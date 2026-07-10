export default function LocationSubmasterValidation(values, isTouched) {
  const errors = {}

  //location validation rule
  if (isTouched.location && !values.location) {
    errors.location = 'Required'
  }
  //location_code Numeric validation rule
  // if (isTouched.location_code && !values.location_code) {
  //   errors.location_code = 'Required & Numeric'
  // } else if (isTouched.location_code && !/^[0-9]{4}$/.test(values.location_code)) {
  //   errors.location_code = 'Not Valid'
  // }

   //location_code Alpha Numeric validation rule
   if (isTouched.location_code && !values.location_code) {
    errors.location_code = 'Required & Alpha-Numeric'
  } else if (isTouched.location_code && !/^[A-Za-z0-9]{4}$/.test(values.location_code)) {
    errors.location_code = 'Not Valid'
  }

  //location_alpha_code validation rule
  if (isTouched.location_alpha_code && !values.location_alpha_code) {
    errors.location_alpha_code = 'Required'
  } else if (isTouched.location_alpha_code && !/^[A-Za-z]{1,4}$/.test(values.location_alpha_code)) {
    errors.location_alpha_code = 'Not Valid'
  }

  return errors
}
