import moment from "moment";

export function getStringTime(date: string) {
  return moment(date).format("YYYY/MM/DD HH:mm");
}

export function getStringDate(date: string) {
  return moment(date).format("YYYY/MM/DD");
}
