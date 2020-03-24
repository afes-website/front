interface Category {
  name: string;
  visible: boolean; // for public
}

export const categories: { [key: string]: Category } = {
  news: { name: "お知らせ", visible: true },
  general: { name: "文実全体", visible: true },
  workTeam: { name: "分科局", visible: true },
  exh: { name: "展示団体", visible: true },
  contrib: { name: "個人･寄稿", visible: true },
  internal: { name: "内部生向け", visible: false },
};

export function getCategory(key: string): string {
  if (!key) return "";
  if (key in categories) return categories[key].name;
  return key;
}

export default categories;
