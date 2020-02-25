import { AdminAuthToken } from "@/apis/@types";
interface AdminUserInfo {
  id: string;
  name: string;
}

export interface Methods {
  get: {
    reqHeaders: AdminAuthToken;
    resData: AdminUserInfo;
  };
}
