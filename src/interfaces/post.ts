import { UserMainInfo } from "./user";

export interface PostInterface {
  id: string;
  content: string;
  created_at: Date;
  likes: { count: number }[];
  comments: { count: number }[];
  post_views: { count: number }[];
  liked_by_user: boolean;
  viewed_by_user: boolean;
  user: UserMainInfo;
  image_url?: string[];
}
