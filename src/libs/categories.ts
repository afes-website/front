import api from "@/apis/$api";
import aspida from "@aspida/axios";
import { Categories } from "@/apis/blog/categories/@types";

let categories: Categories | undefined = undefined;

export default async function getCategories(): Promise<Categories> {
  if (categories !== undefined) return Promise.resolve(categories);

  return api(aspida())
    .blog.categories.$get()
    .then((data) => {
      categories = data;
      return data;
    });
}
