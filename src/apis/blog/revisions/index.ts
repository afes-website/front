import {
  BlogRevision,
  BlogRevisionFilterParameter,
  NewBlogRevision
} from "./@types";
import { AdminAuthToken, WriterAuthToken } from "@/apis/@types";

export interface Methods {
  get: {
    reqHeaders: WriterAuthToken | AdminAuthToken;
    query?: BlogRevisionFilterParameter;
    resData: BlogRevision[];
  };
  post: {
    reqHeaders: WriterAuthToken;
    reqData: NewBlogRevision;
    resData: BlogRevision;
  };
}
