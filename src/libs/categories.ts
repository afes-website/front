const categories: { [key: string]: string } = {
  news: "お知らせ",
  general: "文実全体",
  workTeam: "分科局",
  exh: "展示団体",
  contrib: "個人･寄稿"
};

function getCategory(key: string) {
  if (!key) return "";
  return categories[key];
}

export default getCategory;
