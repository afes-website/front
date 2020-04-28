import { WriterUserInfo } from "../../writer/user";
export interface BlogRevision {
  id: number;
  title: string;
  article_id: string;
  author: WriterUserInfo;
  timestamp: string;
  content: string;
  status: "waiting" | "accepted" | "rejected";
}

export type NewBlogRevision = Omit<
  BlogRevision,
  "id" | "timestamp" | "author" | "status"
>;

export interface BlogRevisionFilterParameter
  extends Partial<Omit<BlogRevision, "id" | "timestamp" | "author">> {
  user_id?: string;
}
