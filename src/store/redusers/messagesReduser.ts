import { ErrorState } from "@/interfaces";
import { MessageInterface } from "@/interfaces/message";
import { supabase } from "@/lib/supabaseClient";
import { addAsyncCase } from "@/utils/addAsyncCase";
import { mapAuthError } from "@/utils/mapAuthError";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

interface MessageState {
  messages: MessageInterface[];
  editingMessage: MessageInterface | null;
  replyMessage: MessageInterface | null;
  loading: boolean;
  error: ErrorState | null;
  offset: number | null;
}

const initialState: MessageState = {
  messages: [],
  editingMessage: null,
  replyMessage: null,
  loading: false,
  error: null,
  offset: 0,
};

const limit = 10;

export const loadMessages = createAsyncThunk<
  MessageInterface[],
  { offset: number; chatId: string },
  { rejectValue: ErrorState }
>("/messages/loadMessages", async ({ offset, chatId }, { rejectWithValue }) => {
  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .eq("chat_id", chatId)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) return rejectWithValue(mapAuthError(error));

  return data.reverse();
});

export const deleteMessage = createAsyncThunk<string, string, { rejectValue: ErrorState }>(
  "/messages/deleteMessage",
  async (id, { rejectWithValue }) => {
    const { error } = await supabase.from("messages").delete().eq("id", id);
    if (error) return rejectWithValue(error);

    return id;
  },
);

export const updateMessage = createAsyncThunk<
  { id: string; content: string },
  { id: string; content: string },
  { rejectValue: ErrorState }
>("/messages/updateMessage", async ({ id, content }, { rejectWithValue }) => {
  const { error } = await supabase.from("messages").update({ content, updated: true }).eq("id", id);
  if (error) return rejectWithValue(error);

  return { id, content };
});

export const newMessage = createAsyncThunk<
  undefined,
  { chat_id: string; sender_id: string; content: string },
  { rejectValue: ErrorState }
>("/messages/newMessage", async ({ chat_id, sender_id, content }, { rejectWithValue }) => {
  const { error } = await supabase.from("messages").insert([
    {
      chat_id,
      sender_id,
      content,
    },
  ]);
  if (error) return rejectWithValue(error);
});

export const messagesSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    messageReceived: (state, action) => {
      state.messages.push(action.payload);
    },
    clearMessages: (state) => {
      state.messages = [];
      state.offset = 0;
    },
    incrOffset: (state) => {
      if (state.offset !== null) state.offset += 1;
    },
    startEdit: (state, action: PayloadAction<MessageInterface>) => {
      state.editingMessage = action.payload;
    },
    canselEdit: (state) => {
      state.editingMessage = null;
    },
    startReply: (state, action: PayloadAction<MessageInterface>) => {
      state.replyMessage = action.payload;
    },
    canselReply: (state) => {
      state.replyMessage = null;
    },
  },
  extraReducers: (builder) => {
    addAsyncCase(builder, loadMessages, (state, action) => {
      if (action.payload.length === 0) {
        state.offset = null;
      } else if (state.offset !== null) {
        state.messages.unshift(...action.payload);
        state.offset += limit;
      }
    });
    addAsyncCase(builder, deleteMessage, (state, action) => {
      state.messages = state.messages.filter((message) => message.id !== action.payload);
      if (state.offset !== null) state.offset -= 1;
    });
    addAsyncCase(builder, updateMessage, (state, action) => {
      const { id, content } = action.payload;

      const message = state.messages.find((msg) => msg.id === id);
      if (message) {
        message.content = content;
        message.updated = true;
      }
    });
  },
});

export const {
  messageReceived,
  clearMessages,
  incrOffset,
  startEdit,
  canselEdit,
  startReply,
  canselReply,
} = messagesSlice.actions;

export default messagesSlice.reducer;
