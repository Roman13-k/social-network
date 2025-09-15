import { ErrorState } from "@/interfaces";
import { ChatInterface } from "@/interfaces/chat";
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
    .from("chats_with_last_message")
    .select(
      `id,
      created_at,
      last_message,
      chat_participants (
        user_id,
        profiles ( id, username, avatar_url )
      )`,
    )
    .range(offset, offset + limit - 1);

  if (error) return rejectWithValue(mapAuthError(error));

  return data.map((chat) => ({
    id: chat.id,
    created_at: chat.created_at,
    lastMessage: chat.last_message,
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
  },
  extraReducers: (builder) => {
    addAsyncCase(builder, getOrCreateNewChat, () => {});
    addAsyncCase(builder, getUsersChats, (state, action) => {
      if (state.offset !== null) {
        state.chats.push(...action.payload);
        state.offset += limit;
      }
      if (action.payload.length < limit && state.chats.length !== 0) {
        state.offset = null;
      }
    });
    addAsyncCase(builder, deleteChat, (state, action) => {
      state.chats = state.chats.filter((chat) => chat.id !== action.payload);
      state.activeChat = null;
      if (state.offset !== null) state.offset -= 1;
    });
  },
});

export const { enterChat, leaveChat } = chatsSlice.actions;

export default chatsSlice.reducer;
