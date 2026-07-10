export default function BankSubMasterValidation(values, isTouched) {
  const errors = {}

  //vehicle type validation rule
  if (isTouched.bankName && !values.bankName) {
    errors.bankName = 'Bank name is required'
  } else if (isTouched.bankName && !/^[a-zA-Z ]+$/.test(values.bankName)) {
    errors.bankName = 'Bank name only have Letters and space'
  }
  return errors
}
