interface AdminUserCredentials {
  id: string;
  password: string;
}

export interface Methods {
  post: {
    reqBody: AdminUserCredentials;
    resBody: {
      token: string;
    };
  };
}
