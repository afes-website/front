import { WriterAuthToken } from "../@types";
export interface Methods {
  post: {
    reqHeaders: WriterAuthToken;

    reqType: FormData;
    reqBody: {
      content: File;
    };

    resBody: {
      id: string;
    };
  };
}
