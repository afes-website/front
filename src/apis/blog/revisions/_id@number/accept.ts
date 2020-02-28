import { BlogRevision } from "../@types";
import { AdminAuthToken } from "@/apis/@types";

export interface Methods {
  patch: {
    reqHeaders: AdminAuthToken;
    resData: BlogRevision;
  };
}
