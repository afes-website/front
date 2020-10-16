import api from "@afes-website/docs";
import aspida from "@aspida/axios";
import { Categories } from "@afes-website/docs";

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
