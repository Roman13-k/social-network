export interface MessageInterface {
  id: string;
  chat_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  updated: boolean;
  ispinned: boolean;
  reply_to: string | null;
}

export interface PinnedMessageInterface {
  message_id: number;
  messages: MessageInterface;
  created_at: string;
}

export interface PinnedMessagesResponse {
  messages: MessageInterface[];

  total_count: number;
}
