export const categories: { [key: string]: string } = {
  news: "お知らせ",
  general: "文実全体",
  workTeam: "分科局",
  exh: "展示団体",
  contrib: "個人･寄稿"
};

export function getCategory(key: string) {
  if (!key) return "";
  if (key in categories) return categories[key];
  return key;
}

export default categories;
