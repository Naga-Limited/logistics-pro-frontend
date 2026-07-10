export default function NlmtDieselIntentValidation(values, isTouched) {
  const errors = {}

  if (isTouched.diesel_vendor_name && !values.diesel_vendor_name) {
    errors.diesel_vendor_name = 'Required'
  }
  if (isTouched.diesel_vendor_name && values.diesel_vendor_name === '0') {
    errors.diesel_vendor_name = 'Required'
  }
  if (isTouched.no_of_ltrs &&!/^[\d]{1,5}\.[\d]{3}$/.test(values.no_of_ltrs)) {
    errors.no_of_ltrs = ' Allow only Float Format (Ex: 19.900)'
  }
  if (isTouched.no_of_ltrs1 &&!/^[\d]{1,5}\.[\d]{3}$/.test(values.no_of_ltrs1)) {
    errors.no_of_ltrs1 = ' Allow only Float Format (Ex: 19.900)'
  }
  if (isTouched.	rate_of_ltrs &&!/^[\d]{1,3}\.[\d]{2}$/.test(values.	rate_of_ltrs)) {
    errors.rate_of_ltrs = ' Allow only Float Format  (Ex: 95.60)'
  }
  if (isTouched.rate_of_ltrs1 &&!/^[\d]{1,3}\.[\d]{2}$/.test(values.rate_of_ltrs1)) {
    errors.rate_of_ltrs1 = ' Allow only Float Format  (Ex: 95.60)'
  }
  if (isTouched.total_amount &&!/^[\d]{2,6}$/.test(values.total_amount)) {
    errors.total_amount = ' Allow Only Numeric'
  }
  if (isTouched.bunk_reading && !values.bunk_reading) {
    errors.bunk_reading = 'Required'
  }
  if (isTouched.invoice_copy && !values.invoice_copy) {
    errors.invoice_copy = 'Required'
  }
  if (isTouched.invoice_no && !values.invoice_no) {
    errors.invoice_no = 'Required'
  }
  return errors
}
