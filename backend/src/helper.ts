export function dateNowString() {
  const date = new Date();
  const day = date.getDate();
  const month = date.getMonth();
  const fullYear = date.getFullYear();

  return `${day > 9 ? day : '0' + day}${month > 9 ? month : '0' + month}${fullYear}`;
}
