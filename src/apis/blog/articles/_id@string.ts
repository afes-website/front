import { BlogArticle, BlogArticleParameter } from "./@types";
import { AdminAuthToken } from "@/apis/@types";

export interface Methods {
  get: {
    resData: BlogArticle;
  };
  patch: {
    reqHeaders: AdminAuthToken;
    reqData: BlogArticleParameter;
    resData: BlogArticle;
  };
  delete: {
    reqHeaders: AdminAuthToken;
  };
}
