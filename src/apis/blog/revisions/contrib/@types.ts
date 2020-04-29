import { BlogRevision } from "@/apis/blog/revisions/@types";

export type NewBlogContribRevision = Omit<
  BlogRevision,
  "id" | "article_id" | "timestamp" | "author" | "status"
>;
