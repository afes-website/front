import { BlogArticle, BlogArticleParameter } from "./@types";
import { AdminAuthToken } from "@/apis/@types";

export interface Methods {
  get: {
    resBody: BlogArticle;
  };
  patch: {
    reqHeaders: AdminAuthToken;
    reqBody: BlogArticleParameter;
    resBody: BlogArticle;
  };
  delete: {
    reqHeaders: AdminAuthToken;
  };
}
