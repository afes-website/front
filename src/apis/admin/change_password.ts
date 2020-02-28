import { AdminAuthToken } from "@/apis/@types";

export interface Methods {
  post: {
    reqData: {
      password: string;
    };
    reqHeaders: AdminAuthToken;
  };
}
