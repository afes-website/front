interface WriterUserCredentials {
  id: string;
  password: string;
}

export interface Methods {
  post: {
    reqData: WriterUserCredentials;
    resData: {
      token: string;
    };
  };
}
