import { WriterAuthToken } from "../@types";
export interface Methods {
  post: {
    reqHeaders: WriterAuthToken;

    reqFormat: FormData;
    reqBody: {
      content: File;
    };

    resBody: {
      id: string;
    };
  };
}
