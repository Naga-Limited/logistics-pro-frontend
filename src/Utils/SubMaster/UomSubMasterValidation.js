export default function UomSubMasterValidation(values, isTouched) {
  const errors = {}

  //vehicle type validation rule
  if (isTouched.uom && !values.uom) {
    errors.uom = 'Uom is required'
  } else if (isTouched.uom && !/^[a-zA-Z ]+$/.test(values.uom)) {
    errors.uom = 'Uom only have Letters and space'
  }

  return errors
}
