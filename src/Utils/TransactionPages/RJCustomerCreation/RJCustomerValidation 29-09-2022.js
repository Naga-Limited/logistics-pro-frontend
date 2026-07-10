export default function RJCustomerValidation(values, isTouched) {
  const errors = {}


  if (isTouched.customer_name && !values.customer_name) {
    errors.customer_name = ' Required'
  } else if (isTouched.customer_name && !/^[a-zA-Z ]+$/.test(values.customer_name)) {
    errors.customer_name = ' Allow only Letters'
  }
  if(isTouched.bankBranch && !/^[a-zA-Z ]+$/.test(values.bankBranch)) {
    errors.bankBranch = ' Allow only Letters'
  }
  if(isTouched.ifscCode && !/^[A-Za-z0-9]{11}$/.test(values.ifscCode)) {
    errors.ifscCode = ' 11 Digit Alphanumeric'
  }
  if (isTouched.cMob && !values.cMob) {
    errors.cMob = ' Required'
  } else if (
    isTouched.cMob &&
    !/^[\d]{10}$/.test(values.cMob)
  ) {
    errors.cMob = ' Must Have 10 Digit Numeric'
  }
  if (
    isTouched.bankAccount &&
    !/^[\d]{9,18}$/.test(values.bankAccount)
  ) {
    errors.bankAccount = ' Allow only Numeric'
  }
  if(isTouched.street && !/^[a-zA-Z ]+$/.test(values.street)) {
    errors.street = ' Allow only Letters'
  }
  if(isTouched.area && !/^[a-zA-Z ]+$/.test(values.area)) {
    errors.area = ' Allow only Letters'
  }
  // if(isTouched.state && !/^[a-zA-Z ]+$/.test(values.state)) {
  //   errors.state = 'Allow only Letters'
  // }
  if(isTouched.district && !/^[a-zA-Z ]+$/.test(values.district)) {
    errors.district = ' Allow only Letters'
  }
  if(isTouched.City && !/^[a-zA-Z ]+$/.test(values.City)) {
    errors.City = ' Allow only Letters'
  }
  if (isTouched.panCard && !/^[A-Za-z]{5}[\d]{4}[A-Za-z]{1}$/.test(values.panCard)) {
    errors.panCard = ' 10 Digit Alphanumeric'
  }
  if(isTouched.aadharCard && !/^[\d]{12}$/.test(values.aadharCard)) {
    errors.aadharCard = ' Must Have 12 Digit Numeric'
  }
  if (
    isTouched.GST &&
    !/^[\d]{2}[A-Z]{5}[\d]{4}[A-Z]{1}[\d]{1}[A-Z]{1}[A-Z\d]{1}$/.test(values.GST)
  ) {
    errors.GST = ' Must Have 15 Digit Numeric Ex.33ASDFA1234A1A1'
  }
  // if (
  //   isTouched.region &&
  //   !/^[\d]{2}/.test(values.region)
  // ) {
  //   errors.region = 'Allow only Numeric'
  // }
  if (
    isTouched.postalCode &&
    !/^[\d]{6}$/.test(values.postalCode)
  ) {
    errors.postalCode = ' Allow only Numeric'
  }
  if (isTouched.createdtype && values.createdtype=== '') {
    errors.createdtype = ' Required'
  }
  if (isTouched.Payment && values.Payment==='') {
    errors.Payment = ' Required'
  }
  if (isTouched.incoterms_description && values.incoterms_description==='') {
    errors.incoterms_description = ' Required'
  }
  return errors
}
