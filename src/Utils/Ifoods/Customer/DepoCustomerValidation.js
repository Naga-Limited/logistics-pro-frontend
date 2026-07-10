export default function DepoCustomerValidation(values, isTouched) {

  const errors = {}

  //Customer Name validation rule
  if (isTouched.customerName && !values.customerName) {
    errors.customerName = 'Required'
  } else if (isTouched.customerName && !/^[a-zA-Z ]+$/.test(values.customerName)) {
    errors.customerName = 'Only have Letters and Space'
  }

  //Customer Mobile Number Validation Rule
  if (isTouched.customerNumber && !values.customerNumber) {
    errors.customerNumber = 'Required'
  } else if (isTouched.customerNumber && !/^[\d]{10}$/.test(values.customerNumber)) {
    errors.customerNumber = 'Should have 10 Digit Numeric'
  }

  //Customer Address Validation Rule
  if (isTouched.customerAddress && !values.customerAddress) {
    errors.customerAddress = 'Required'
  }

  //Customer Code Validation Rule
  if (isTouched.customerCode && !values.customerCode) {
    errors.customerCode = 'Required'
  } else if (isTouched.customerCode && !/^[\d]{6,8}$/.test(values.customerCode)) {
    errors.customerCode = 'Should have 6 to 8 Digit Numeric'
  }

  return errors
}
