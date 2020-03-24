import { BlogArticle, BlogArticleParameter } from "./@types";

export interface Methods {
  get: {
    query?: BlogArticleParameter;
    resBody: BlogArticle[];
  };
}
