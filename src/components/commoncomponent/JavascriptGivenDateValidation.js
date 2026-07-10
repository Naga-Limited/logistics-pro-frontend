export default function JavascriptGivenDateValidation ( start_date, sign, days1 ) {

  /* Sign : 1 - Positive, 2 - Negative */

  const formateDate1 = (assignmentDate) => {
    const date = new Date(assignmentDate)
    const formattedDate = date.toLocaleDateString('en-GB', 
    {
      day: 'numeric', 
      month: 'numeric', 
      year: 'numeric'
    }).replace(/ /g, '-');

    return formattedDate

  }

  console.log(start_date,'start_date_string')

  let a = start_date.split('-');
  let updated_start_date = new Date (a[2], a[1] - 1,a[0]);//using a[1]-1 since Date object has month from 0-11
  console.log(updated_start_date,'updated_start_date') 

  let formateDate111 = formateDate1(updated_start_date)
  console.log(formateDate111,'tripsheet creation date')

  var fiveDaysLater = new Date( updated_start_date.getTime() )

  if(sign == 1){
    fiveDaysLater.setDate(fiveDaysLater.getDate() + days1) 
  } else {
    fiveDaysLater.setDate(fiveDaysLater.getDate() - days1) 
  }
  
  console.log(fiveDaysLater,'fiveDaysLater')

  let formateDate115 = formateDate1(fiveDaysLater)
  console.log(formateDate115,'fiveDaysLater - updated')

  var a5 = formateDate115.split('/');
  var dateCompare = new Date (a5[2], a5[1] - 1,a5[0]);//using a[1]-1 since Date object has month from 0-11

  var Today = new Date();
  console.log(`Start Date : ${start_date}, Days : ${sign == 1 ? '+' : '-'} ${days1}, Today : ${new Date().toLocaleDateString()}`)
  if (dateCompare > Today) {
    console.log('Conditions Satisfied - return true')
    return true
  }
  else {
    console.log('Conditions Not Satisfied - return false') 
    return false
  }

}
