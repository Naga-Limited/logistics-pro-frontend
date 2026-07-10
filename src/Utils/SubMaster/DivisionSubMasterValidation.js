export default function divisionSubMasterValidation(values, isTouched) {
  const errors = {}

  //division validation rule
  if (isTouched.division && !values.division) {
    errors.division = 'required'
  } else if (isTouched.division && !/^[a-zA-Z ]+$/.test(values.division)) {
    errors.division = 'Division only have Letters and space'
  }

  //division_code validation rule
  if (isTouched.division_code && !values.division_code) {
    errors.division_code = 'required Numeric'
  } else if (isTouched.division_code && !/^[0-9]{8}$/.test(values.division_code)) {
    errors.division_code = 'Not Valid'
  }

  return errors
}
