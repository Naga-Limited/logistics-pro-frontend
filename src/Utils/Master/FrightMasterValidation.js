export default function FrightMasterValidation(values, isTouched) {
  const errors = {}

  //Customer validation rule
  // if (isTouched.customer_name && values.customer_name === '0') {
  //   errors.customer_name = 'Choose Customer'
  // }
  // if (isTouched.location && values.location === '0') {
  //   errors.location = 'Choose Location'
  // }
  // if (isTouched.type && values.type === '0') {
  //   errors.type = 'Choose Sales Type'
  // }

 // console.log(values.start_date)
  console.log(getCurrentDate('-'))
//  var dateOne = new Date(values.start_date)
 // var dateTwo = new Date(getCurrentDate('-'))
  // if (isTouched.start_date && !values.start_date) {
  //   errors.start_date = 'Choose Start Date'
  // }


  return errors
}

function getCurrentDate(separator = '') {
  let newDate = new Date()
  let date = newDate.getDate()
  let month = newDate.getMonth() + 1
  let year = newDate.getFullYear()

  return `${year}${separator}${month < 10 ? `0${month}` : `${month}`}${separator}${date}`
}

