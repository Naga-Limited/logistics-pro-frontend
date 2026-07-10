export default function AdvanceCreationValidation(values, isTouched) {
  const errors = {}

  if (isTouched.advance_form && !values.advance_form) {
    errors.advance_form = 'Required'
  }
  if (isTouched.advance_payment && !/^[\d]{1,6}$/.test(values.advance_payment)) {
    errors.advance_payment = ' Allow only Numeric'
  }
  if (isTouched.advance_paymented && (values.advance_paymented > 49990 || !/^[\d]{1,6}$/.test(values.advance_paymented))) {
    errors.advance_paymented = 'Amount Exceed'
  }
  if (isTouched.otp && !/^[\d]{4}$/.test(values.otp)) {
    errors.otp = ' Allow only Numeric'
  }
  if (isTouched.actual_freight && !/^[\d]{2,6}$/.test(values.actual_freight)) {
    errors.actual_freight = ' Allow only Numeric'
  }
  if (isTouched.advance_payment_diesel && !/^[\d]{1,5}$/.test(values.advance_payment_diesel)) {
    errors.advance_payment_diesel = ' Allow only Numeric'
  }
  if (isTouched.low_tonnage_charges && !/^[\d]{1,5}$/.test(values.low_tonnage_charges)) {
    errors.low_tonnage_charges = ' Allow only Numeric'
  }
  if (isTouched.vendor_code && !/^[\d]{6}$/.test(values.vendor_code)) {
    errors.vendor_code = ' Allow only Numeric'
  }
  if (isTouched.driver_code && !/^[\d]{6}$/.test(values.driver_code)) {
    errors.driver_code = ' Allow only Numeric'
  }
  if (isTouched.advance_payments && !/^[\d]{2,6}$/.test(values.advance_payments)) {
    errors.advance_payments = ' Allow only Numeric'
  }
  return errors
}
