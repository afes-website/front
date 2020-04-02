interface WriterUserCredentials {
  id: string;
  password: string;
}

export interface Methods {
  post: {
    reqBody: WriterUserCredentials;
    resBody: {
      token: string;
    };
  };
}
