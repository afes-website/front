import api from "@/apis/$api";
import aspida from "@aspida/axios";

export async function getCategories() {
  return api(aspida()).blog.categories.$get();
}

export default getCategories;
