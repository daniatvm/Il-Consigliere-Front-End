export const getTodaysDate = () => {
  let today = new Date();
  const dd = String(today.getDate()).padStart(2, '0');
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const yyyy = today.getFullYear();
  return yyyy + '-' + mm + '-' + dd;
}

export const requestDay = () => {
  let today = new Date();
  const dd = String(today.getDate()).padStart(2, '0');;
  const mm = String(today.getMonth() + 1).padStart(2, '0');;
  const yyyy = today.getFullYear();
  const due = parseInt(dd) + 3;
  return yyyy + '-' + mm + '-' + due.toString();
}

console.log(requestDay());