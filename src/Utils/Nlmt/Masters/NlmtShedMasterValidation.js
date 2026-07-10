export default function NlmtShedMasterValidation(values, isTouched) {
  const errors = {}

  //vehicle type validation rule
  if (isTouched.shedType && values.shedType === '0') {
    errors.shedType = 'Choose Shed Type'
  }

  //shed name validation rule
  if (isTouched.ShedName && !values.ShedName) {
    errors.ShedName = 'Shed Name is required'
  } else if (isTouched.ShedName && !/^[a-zA-Z ]+$/.test(values.ShedName)) {
    errors.ShedName = 'Driver Name only have Letters and space'
  }
  //

  if (isTouched.ShedOwnerName && !values.ShedOwnerName) {
    errors.ShedOwnerName = 'Shed Owner name is Required'
  } else if (isTouched.ShedOwnerName && !/^[a-zA-Z ]+$/.test(values.ShedOwnerName)) {
    errors.ShedOwnerName = 'Must Have Letters & Space'
  }
  // if (isTouched.ShedOwnerMobileNumber2 && !values.ShedOwnerMobileNumber2) {
  //   errors.ShedOwnerMobileNumber2 = 'Mobile Number 2 is required'
  // } else if (
  //   isTouched.ShedOwnerMobileNumber2 &&
  //   !/^[\d]{10}$/.test(values.ShedOwnerMobileNumber2)
  // ) {
  //   errors.ShedOwnerMobileNumber2 = 'Must Have 10 Digit Numeric'
  // }
  if (isTouched.ShedOwnerMobileNumber1 && !values.ShedOwnerMobileNumber1) {
    errors.ShedOwnerMobileNumber1 = 'Required'
  } else if (
    isTouched.ShedOwnerMobileNumber1 &&
    !/^[\d]{10}$/.test(values.ShedOwnerMobileNumber1)
  ) {
    errors.ShedOwnerMobileNumber1 = 'Must Have 10 Digit Numeric'
  }
  if (isTouched.ShedOwnerAddress && !values.ShedOwnerAddress) {
    errors.ShedOwnerAddress = 'Address is required'
  }
  // if (isTouched.ShedOwnerPhoto && !values.ShedOwnerPhoto) {
  //   errors.ShedOwnerPhoto = 'Shed Owner photo is required'
  // }
  if (isTouched.PANNumber && !values.PANNumber) {
    errors.PANNumber = 'PAN Number is required'
  } else if (isTouched.PANNumber && !/^[A-Z]{5}[\d]{4}[A-Z]{1}$/.test(values.PANNumber)) {
    errors.PANNumber = 'Must Have 10 Digit Alphanumeric'
  }
  // if (isTouched.AadharNumber && !values.AadharNumber) {
  //   errors.AadharNumber = 'Aadhar Number is required'
  // } else if (isTouched.AadharNumber && !/^[\d]{12}$/.test(values.AadharNumber)) {
  //   errors.AadharNumber = 'Must Have 12 Digit Numeric'
  // }
  // if (isTouched.GSTNumber && !values.GSTNumber) {
  //   errors.GSTNumber = 'GST Number is required'
  // } else if (
  //   isTouched.GSTNumber &&
  //   !/^[\d]{2}[A-Z]{5}[\d]{4}[A-Z]{1}[\d]{1}[A-Z]{1}[A-Z\d]{1}$/.test(values.GSTNumber)
  // ) {
  //   errors.GSTNumber = 'Must Have 15 Digit Numeric'
  // }

  console.log(errors,'errors')
  return errors
}
