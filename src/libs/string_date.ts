import moment from "moment";

export function getStringTime(date: Date) {
  return moment(date).format("YYYY/MM/DD HH:mm");
}

export function getStringDate(date: Date) {
  return moment(date).format("YYYY/MM/DD");
}
