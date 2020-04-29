import { BlogRevision } from "@/apis/blog/revisions/@types";
import { NewBlogContribRevision } from "@/apis/blog/revisions/contrib/@types";

export interface Methods {
  post: {
    reqBody: NewBlogContribRevision;
    resBody: BlogRevision;
  };
}
