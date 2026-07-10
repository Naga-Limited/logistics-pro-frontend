export default function StatusSubMasterValidation(values, isTouched) {
  const errors = {}

  //vehicle type validation rule
  if (isTouched.status && !values.status) {
    errors.status = 'Status is required'
  } else if (isTouched.status && !/^[a-zA-Z ]+$/.test(values.status)) {
    errors.status = 'Status only have Letters and space'
  }

  return errors
}
