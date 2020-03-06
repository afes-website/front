import { WriterAuthToken } from "../@types";
export interface Methods {
  post: {
    reqHeaders: WriterAuthToken;

    reqType: FormData;
    reqData: {
      content: File;
    };

    resData: {
      id: string;
    };
  };
}
