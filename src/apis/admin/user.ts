import { AdminAuthToken } from "@/apis/@types";
export interface AdminUserInfo {
  id: string;
  name: string;
}

export interface Methods {
  get: {
    reqHeaders: AdminAuthToken;
    resBody: AdminUserInfo;
  };
}
