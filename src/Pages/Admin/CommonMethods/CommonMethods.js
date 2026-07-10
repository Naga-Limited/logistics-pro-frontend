export const formatDateAsDDMMYYY = (input) => {
  var datePart = input.match(/\d+/g),
  year = datePart[0].substring(0), // get only four digits
  month = datePart[1], day = datePart[2];
  console.log(datePart);

  return day+'-'+month+'-'+year;
}
