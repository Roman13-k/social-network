import { MessageInterface } from "./message";
import { UserMainInfo } from "./user";

export interface ChatInterface {
  id: string;
  created_at: string;
  name?: string;
  participants: UserMainInfo[];
  lastMessage?: MessageInterface;
}

export interface ChatParticipantRow {
  id: string;
  chat_id: string;
  user_id: string;
  joined_at: string;
}
