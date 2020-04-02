import { WriterAuthToken } from "@/apis/@types";

export interface Methods {
  post: {
    reqBody: {
      password: string;
    };
    reqHeaders: WriterAuthToken;
  };
}
