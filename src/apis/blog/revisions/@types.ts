export interface BlogRevision {
  id: number;
  title: string;
  article_id: string;
  user_id: string;
  timestamp: string;
  content: string;
  status: "waiting" | "accepted" | "rejected";
}

export type NewBlogRevision = Omit<
  BlogRevision,
  "id" | "timestamp" | "user_id" | "status"
>;

export type BlogRevisionFilterParameter = Partial<
  Omit<BlogRevision, "id" | "timestamp">
>;
