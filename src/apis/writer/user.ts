import { WriterAuthToken } from "@/apis/@types";
interface WriterUserInfo {
  id: string;
  name: string;
}

export interface Methods {
  get: {
    resData: WriterUserInfo;
    reqHeaders: WriterAuthToken;
  };
}
