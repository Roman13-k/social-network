import { LoginProviderType } from "@/types/login";

export interface UserInterface {
  id: string;
  email?: string;
  phone?: string;
  created_at: string;
  app_metadata: {
    provider?: LoginProviderType | string;
    providers?: (LoginProviderType | string)[];
    [key: string]: unknown;
  };
  user_metadata: {
    avatar_url?: string;
    email?: string;
    email_verified?: boolean;
    full_name?: string;
    iss?: string;
    name?: string;
    phone_verified?: boolean;
    picture?: string;
    provider_id?: string;
    sub?: string;
    [key: string]: unknown;
  };
  is_anonymous?: boolean;
  stats: UserStats;
  online_at: string;
  isOnline: boolean;
}

export interface UserStats {
  posts_count: number;
  likes_count: number;
  comments_count: number;
}

export interface UserMainInfo {
  id: string;
  username: string;
  avatar_url: string;
  chat_background?: string;
  email?: string;
  online_at: string;
  isOnline: boolean;
}

export interface SettingsRender {
  label: string;
  data: React.ReactNode;
}
