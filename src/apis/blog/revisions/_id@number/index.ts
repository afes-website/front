import { BlogRevision } from "../@types";
import { AdminAuthToken, WriterAuthToken } from "@/apis/@types";

export interface Methods {
  get: {
    reqHeaders: WriterAuthToken | AdminAuthToken;
    resBody: BlogRevision;
  };
}
