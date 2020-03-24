import {
  BlogRevision,
  BlogRevisionFilterParameter,
  NewBlogRevision,
} from "./@types";
import { AdminAuthToken, WriterAuthToken } from "@/apis/@types";

export interface Methods {
  get: {
    reqHeaders: WriterAuthToken | AdminAuthToken;
    query?: BlogRevisionFilterParameter;
    resBody: BlogRevision[];
  };
  post: {
    reqHeaders: WriterAuthToken;
    reqBody: NewBlogRevision;
    resBody: BlogRevision;
  };
}
