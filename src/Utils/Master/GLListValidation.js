export default function GLListValidation(values, isTouched) {
  const errors = {}

  //G/L Description Validation Rule
  if (isTouched.gl_description && !values.gl_description) {
    errors.gl_description = 'Required'
  } else if (isTouched.gl_description && !/^[A-Z_]+$/.test(values.gl_description)) {
    errors.gl_description = 'Only have Capital Letters and _'
  }

  //G/L Code Validation Rule
  if (isTouched.gl_code && !values.gl_code) {
    errors.gl_code = 'Required'
  } else if (isTouched.gl_code && !/^[\d]{6}$/.test(values.gl_code)) {
    errors.gl_code = 'Only have 6 Digit Numeric'
  }

  //Profit Center Validation Rule
  if (isTouched.profit_center && !values.profit_center) {
    errors.profit_center = 'Required'
  } else if (isTouched.profit_center && !/^[\d]{8}$/.test(values.profit_center)) {
    errors.profit_center = 'Only have 8 Digit Numeric'
  }

  //Plant Code Validation Rule
  if (isTouched.plant && !values.plant) {
    errors.plant = 'Required'
  } else if (isTouched.plant && !/^[\d]{4}$/.test(values.plant)) {
    errors.plant = 'Only have 4 Digit Numeric'
  }

  //Diesel Vendor Mail-ID Validation Rule
  if (isTouched.amount_type && values.amount_type=== '') {
    errors.amount_type = 'Required'

  }

  return errors
}
