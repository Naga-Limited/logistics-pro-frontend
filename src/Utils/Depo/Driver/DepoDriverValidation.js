export default function DepoDriverValidation(values, isTouched) {

  const errors = {}

  console.log(values.depoContractorName,'values.contractorName')

  //Contractor validation rule
  if (isTouched.depoContractorName && values.depoContractorName == '0') {
    errors.depoContractorName = 'Required'
  }

  //Driver Name validation rule
  if (isTouched.driverName && !values.driverName) {
    errors.driverName = 'Required'
  } else if (isTouched.driverName && !/^[a-zA-Z ]+$/.test(values.driverName)) {
    errors.driverName = 'Only have Letters and Space'
  }

  //Driver Mobile Number Validation Rule
  if (isTouched.driverNumber && !values.driverNumber) {
    errors.driverNumber = 'Required'
  } else if (isTouched.driverNumber && !/^[\d]{10}$/.test(values.driverNumber)) {
    errors.driverNumber = 'Only have 10 Digit Numeric'
  }

  //Driver Address Validation Rule
  if (isTouched.driverAddress && !values.driverAddress) {
    errors.driverAddress = 'Required'
  }

  //License Number Validation Rule
  if (isTouched.licenseNumber && !values.licenseNumber) {
    errors.licenseNumber = 'Required'
  } else if (
    isTouched.licenseNumber &&
    !/^[A-Z]{2}[\d]{2}[A-Z]{1}[\d]{11}$/.test(values.licenseNumber)
  ) {
    errors.licenseNumber = 'Invalid Format (Ex: AB12C33333333333)'
  }

  //License Validity Validation Rule
  var dateOne = new Date(values.licenseValidDate)
  var dateTwo = new Date(getCurrentDate('-'))

  if (isTouched.licenseValidDate && !values.licenseValidDate) {
    errors.licenseValidDate = 'Choose License Validity'
  } else if (dateOne < dateTwo) {
    errors.licenseValidDate = 'Past Days Not Allowed'
  }

  return errors
}

function getCurrentDate(separator = '') {
  let newDate = new Date()
  let date = newDate.getDate()
  let month = newDate.getMonth() + 1
  let year = newDate.getFullYear()

  return `${year}${separator}${month < 10 ? `0${month}` : `${month}`}${separator}${date}`
}
