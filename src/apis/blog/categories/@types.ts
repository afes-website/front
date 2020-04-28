export interface Category {
  name: string;
  visible: boolean;
}
export interface Categories {
  [index: string]: Category;
}
