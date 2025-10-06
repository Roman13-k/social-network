import { ErrorState } from "@/interfaces";
import { ChatInterface } from "@/interfaces/chat";
import { MessageInterface } from "@/interfaces/message";
import { UserMainInfo } from "@/interfaces/user";
import { supabase } from "@/lib/supabaseClient";
import { addAsyncCase } from "@/utils/addAsyncCase";
import { mapAuthError } from "@/utils/mapAuthError";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface ChatState {
  chats: ChatInterface[];
  activeChat: ChatInterface | null;
  loading: boolean;
  offset: number | null;
  error: ErrorState | null;
}

const initialState: ChatState = {
  chats: [],
  activeChat: null,
  loading: false,
  offset: 0,
  error: null,
};

const limit = 5;

export const getOrCreateNewChat = createAsyncThunk<
  string,
  { userA: string; userB: string },
  { rejectValue: ErrorState }
>("/chats/getOrCreateNewChat", async ({ userA, userB }, { rejectWithValue }) => {
  try {
    const res = await fetch("/api/getOrCreateChat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userA, userB }),
    });

    const data = await res.json();
    if (!res.ok) return rejectWithValue(data.error);

    return data.chatId;
  } catch (err) {
    return rejectWithValue(err as ErrorState);
  }
});

export const getUsersChats = createAsyncThunk<
  ChatInterface[],
  { userId: string; offset: number },
  { rejectValue: ErrorState }
>("/chats/getUsersChats", async ({ userId, offset }, { rejectWithValue }) => {
  const { data, error } = await supabase
    .from("chats")
    .select(
      `
    id,
    created_at,
    last_message,
    chat_participants (
      user_id,
      profiles ( id, username, avatar_url, online_at )
    )
  `,
    )
    .range(offset, offset + limit - 1);

  if (error) return rejectWithValue(mapAuthError(error));

  return data.map((chat) => ({
    id: chat.id,
    created_at: chat.created_at,
    lastMessage: chat.last_message as unknown as MessageInterface | undefined,
    participants: chat.chat_participants
      .map((p) => p.profiles as unknown as UserMainInfo)
      .filter((u) => u.id !== userId),
  }));
});

export const deleteChat = createAsyncThunk<string, string, { rejectValue: ErrorState }>(
  "/chats/deleteChat",
  async (chatId, { rejectWithValue }) => {
    const { error } = await supabase.from("chats").delete().eq("id", chatId);
    if (error) return rejectWithValue(error);

    return chatId;
  },
);

export const chatsSlice = createSlice({
  name: "chats",
  initialState,
  reducers: {
    enterChat: (state, action) => {
      const chat = state.chats.find((chat) => chat.id === action.payload);

      state.activeChat = chat ?? null;
    },
    leaveChat: (state) => {
      state.activeChat = null;
      state.error = null;
    },
    updateUserOnline: (state, action) => {
      const onlineUsers: string[] = Object.keys(action.payload);

      const updateParticipants = (participants: (typeof state.chats)[0]["participants"]) => {
        return participants.map((p) => {
          const presenceData = action.payload[p.id]?.[0];
          const isNowOnline = onlineUsers.includes(p.id);
          const newOnlineAt = presenceData?.online_at || p.online_at || "";
          if (p.isOnline !== isNowOnline || p.online_at !== newOnlineAt) {
            return { ...p, isOnline: isNowOnline, online_at: newOnlineAt };
          }
          return p;
        });
      };
      state.chats.forEach((chat) => {
        chat.participants = updateParticipants(chat.participants);
      });

      if (state.activeChat) {
        state.activeChat.participants.forEach((p) => {
          const presenceData = action.payload[p.id]?.[0];
          const isNowOnline = onlineUsers.includes(p.id);
          const newOnlineAt = presenceData?.online_at || p.online_at || "";

          if (p.isOnline !== isNowOnline || p.online_at !== newOnlineAt) {
            p.isOnline = isNowOnline;
            p.online_at = newOnlineAt;
          }
        });
      }
    },
    updateChats: (state, action) => {
      state.chats.forEach((chat) => {
        if (action.payload.eventType === "UPDATE" && action.payload.new.id === chat.id) {
          console.log("New: ", action.payload.new.last_message);
          chat.lastMessage = action.payload.new.last_message;
        }
      });
    },
  },
  extraReducers: (builder) => {
    addAsyncCase(builder, getOrCreateNewChat, () => {});
    addAsyncCase(builder, getUsersChats, (state, action) => {
      if (action.payload.length === 0) {
        state.offset = null;
      } else if (state.offset !== null) {
        state.chats.push(...action.payload);
        state.offset += limit;
      }
    });
    addAsyncCase(builder, deleteChat, (state, action) => {
      state.chats = state.chats.filter((chat) => chat.id !== action.payload);
      state.activeChat = null;
      if (state.offset !== null) state.offset -= 1;
    });
  },
});

export const { enterChat, leaveChat, updateUserOnline, updateChats } = chatsSlice.actions;

export default chatsSlice.reducer;
