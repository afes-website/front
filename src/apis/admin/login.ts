interface AdminUserCredentials {
  id: string;
  password: string;
}

export interface Methods {
  post: {
    reqData: AdminUserCredentials;
    resData: {
      token: string;
    };
  };
}
