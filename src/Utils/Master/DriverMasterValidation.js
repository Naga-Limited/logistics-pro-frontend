export default function DriverMasterValidation(values, isTouched) {
  const errors = {}

  //Driver type validation rule
  if (isTouched.driverType && values.driverType === '0') {
    errors.driverType = 'Choose Driver Type'
  }

  //Driver Name Validation Rule
  if (isTouched.driverName && !values.driverName) {
    errors.driverName = 'Required'
  } else if (isTouched.driverName && !/^[a-zA-Z ]+$/.test(values.driverName)) {
    errors.driverName = 'Only have Letters and Space'
  }

  //Driver Code Validation Rule
  if (isTouched.driverCode && !values.driverCode) {
    errors.driverCode = 'Required'
  } else if (isTouched.driverCode && !/^[\d]{6}$/.test(values.driverCode)) {
    errors.driverCode = 'Only have 6 Digit Numeric'
  }

  //Driver Mobile Number 1 Validation Rule
  if (isTouched.driverMobile1 && !values.driverMobile1) {
    errors.driverMobile1 = 'Required'
  } else if (isTouched.driverMobile1 && !/^[\d]{10}$/.test(values.driverMobile1)) {
    errors.driverMobile1 = 'Only have 10 Digit Numeric'
  }

  //Driver Mobile Number 2 Validation Rule
  if (isTouched.driverMobile2 && !values.driverMobile2) {
    errors.driverMobile2 = 'Required'
  } else if (isTouched.driverMobile2 && !/^[\d]{10}$/.test(values.driverMobile2)) {
    errors.driverMobile2 = 'Only have 10 Digit Numeric'
  }

  //License Number Validation Rule
  if (isTouched.licenseNumber && !values.licenseNumber) {
    errors.licenseNumber = 'Required'
  } else if (
    isTouched.licenseNumber &&
    // !/^[A-Z]{2}[\d]{2}[A-Z]{1}[\d]{11}$/.test(values.licenseNumber)
    !(/^[A-Z]{2}[\d]{2}[A-Z]{1}[\d]{11}$/.test(values.licenseNumber) || /^[A-Z]{2}[\d]{2}[\d]{11}$/.test(values.licenseNumber))
  ) {
    errors.licenseNumber = 'Invalid Format (Ex: AB12C33333333333)'
  }
  console.log(values.licenseValidDate)
  console.log(getCurrentDate('-'))
  //License Validity Validation Rule
  var dateOne = new Date(values.licenseValidDate)
  var dateTwo = new Date(getCurrentDate('-'))
  if (isTouched.licenseValidDate && !values.licenseValidDate) {
    errors.licenseValidDate = 'Choose License Validity'
  } else if (dateOne >= dateTwo) {
    //License Validity Expired Error Message
    // document.getElementById('licenseValidityStatus').value = 'Yes'
    values.licenseValidityStatus = 'Yes'
    // errors.licenseValidDate = 'License Validity Expired'
  } else if (dateOne < dateTwo) {
    values.licenseValidityStatus = 'No'
  }

  // alert(document.getElementById('licenseValidityStatus').value)

  //Address Validation Rule
  if (isTouched.driverAddress && !values.driverAddress) {
    errors.driverAddress = 'Required'
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

// const formValues = {
//   driverType: '',
//   driverName: '',
//   driverCode: '',
//   driverMobile1: '',
//   driverMobile2: '',
//   licenseNumber: '',
//   licenseValidDate: '',
//   licenseCopyFront: '',
//   licenseCopyBack: '',
//   licenseValidityStatus: '',
//   aadharCard: '',
//   panCard: '',
//   driverPhoto: '',
//   driverAddress: '',
// }
