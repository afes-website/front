interface Category {
  name: string;
  visible: boolean;
}
interface Categories {
  [key: string]: Category;
}

export interface Methods {
  get: {
    resBody: Categories;
  };
}
