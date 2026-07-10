export default function JavascriptDateCheckComponent ( fromDate, givenDate, toDate ) {

  var d1 = fromDate.split("-");
  var d2 = toDate.split("-");
  var c = givenDate.split("-");

  var from = new Date(d1[0], parseInt(d1[1])-1, d1[2]);  // -1 because months are from 0 to 11
  var to   = new Date(d2[0], parseInt(d2[1])-1, d2[2]);
  var check = new Date(c[0], parseInt(c[1])-1, c[2]);

  console.log(`${from}||${check}||${to}`, 'JavascriptDateCheckComponent-Dates')
  console.log(check >= from && check <= to, 'JavascriptDateCheckComponent-Condition')

  return check >= from && check <= to
}
