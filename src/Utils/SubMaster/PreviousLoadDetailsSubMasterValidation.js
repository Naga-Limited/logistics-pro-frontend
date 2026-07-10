export default function PreviousLoadDetailsSubMasterValidation(values, isTouched) {
  const errors = {}

  //vehicle type validation rule
  if (isTouched.previous_load_details && !values.previous_load_details) {
    errors.previous_load_details = 'Previous Load Details is required'
  } else if (isTouched.previous_load_details && !/^[a-zA-Z ]+$/.test(values.previous_load_details)) {
    errors.previous_load_details = 'Previous Load Details only have Letters and space'
  }

  return errors
}
