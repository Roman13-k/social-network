import { ErrorState } from "@/interfaces";
import {
  MessageInterface,
  PinnedMessageInterface,
  PinnedMessagesResponse,
} from "@/interfaces/message";
import { supabase } from "@/lib/supabaseClient";
import { addAsyncCase } from "@/utils/addAsyncCase";
import { mapAuthError } from "@/utils/mapAuthError";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

interface MessageState {
  messages: MessageInterface[];
  editingMessage: MessageInterface | null;
  replyMessage: MessageInterface | null;
  pinnedMessages: PinnedMessagesResponse;
  isPinnedModal: boolean;
  loading: boolean;
  error: ErrorState | null;
  offset: number | null;
  pinOffset: number | null;
}

const initialState: MessageState = {
  messages: [],
  editingMessage: null,
  replyMessage: null,
  pinnedMessages: { messages: [], total_count: 0 },
  isPinnedModal: false,
  loading: false,
  error: null,
  offset: 0,
  pinOffset: 0,
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

export const getMessageById = createAsyncThunk<
  MessageInterface,
  string,
  { rejectValue: ErrorState }
>("/", async (id, { rejectWithValue }) => {
  const { data, error } = await supabase.from("messages").select("*").eq("id", id).single();
  if (error) return rejectWithValue(error);

  return data;
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

export const newReplyMessage = createAsyncThunk<
  { id: string },
  { id: string; content: string; chat_id: string; sender_id: string },
  { rejectValue: ErrorState }
>("/messages/newReplyMessage", async ({ id, content, chat_id, sender_id }, { rejectWithValue }) => {
  const { error } = await supabase.from("messages").insert([
    {
      chat_id,
      sender_id,
      content,
      reply_to: id,
    },
  ]);
  if (error) return rejectWithValue(error);

  return { id };
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

export const loadPinMessages = createAsyncThunk<
  PinnedMessagesResponse,
  { chatId: string; offset: number },
  { rejectValue: ErrorState }
>("messages/loadPinMessages", async ({ chatId, offset }, { rejectWithValue }) => {
  const { data, error, count } = await supabase
    .from("chat_pinned_messages")
    .select("message_id, messages(*)", { count: "exact" })
    .eq("chat_id", chatId)
    .range(offset, offset + limit - 1)
    .order("pinned_at", { ascending: false });

  if (error) return rejectWithValue(error);

  const res = (data as unknown as { message_id: string; messages: MessageInterface }[]).map(
    (r) => r.messages,
  );

  return {
    messages: res,
    total_count: count || 0,
  };
});

export const pinMessage = createAsyncThunk<
  MessageInterface,
  { chatId: string | undefined; message: MessageInterface },
  { rejectValue: ErrorState }
>("messages/pinMessage", async ({ chatId, message }, { rejectWithValue }) => {
  const { error } = await supabase.from("chat_pinned_messages").insert({
    chat_id: chatId,
    message_id: message.id,
  });
  if (error) return rejectWithValue(error);
  return message;
});

export const unpinMessage = createAsyncThunk<
  string,
  { chatId: string | undefined; messageId: string },
  { rejectValue: ErrorState }
>("messages/unpinMessage", async ({ chatId, messageId }, { rejectWithValue }) => {
  const { error } = await supabase
    .from("chat_pinned_messages")
    .delete()
    .eq("chat_id", chatId)
    .eq("message_id", messageId);
  if (error) return rejectWithValue(error);
  return messageId;
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
    openPinned: (state) => {
      state.isPinnedModal = true;
    },
    closePinned: (state) => {
      state.isPinnedModal = false;
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
    addAsyncCase(builder, loadPinMessages, (state, action) => {
      if (action.payload?.messages?.length === 0) {
        state.pinOffset = null;
      } else if (state.pinOffset !== null) {
        state.pinnedMessages.messages.unshift(...action.payload.messages);
        state.pinnedMessages.total_count = action.payload.total_count;
        state.pinOffset += limit;
      }
    });
    addAsyncCase(builder, pinMessage, (state, action) => {
      if (!state.pinnedMessages.messages.some((msg) => msg.id === action.payload.id)) {
        state.pinnedMessages.messages.push(action.payload);
      }
      state.messages = state.messages.map((msg) =>
        msg.id === action.payload.id ? { ...msg, ispinned: true } : msg,
      );
    });
    addAsyncCase(builder, unpinMessage, (state, action) => {
      state.pinnedMessages.messages = state.pinnedMessages.messages.filter(
        (ms) => ms.id !== action.payload,
      );
      if (state.pinOffset !== null) state.pinOffset -= 1;
      state.messages = state.messages.map((msg) =>
        msg.id === action.payload ? { ...msg, ispinned: false } : msg,
      );
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
  openPinned,
  closePinned,
} = messagesSlice.actions;

export default messagesSlice.reducer;
