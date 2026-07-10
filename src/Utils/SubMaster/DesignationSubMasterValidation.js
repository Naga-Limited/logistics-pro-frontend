export default function DesignationSubMasterValidation(values, isTouched) {
  const errors = {}

  //vehicle type validation rule
  if (isTouched.designation && !values.designation) {
    errors.designation = 'Designation is required'
  } else if (isTouched.designation && !/^[a-zA-Z ]+$/.test(values.designation)) {
    errors.designation = 'Designation only have Letters and space'
  }

  return errors
}
