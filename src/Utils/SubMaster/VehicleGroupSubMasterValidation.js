export default function VehicleGroupSubMasterValidation(values, isTouched) {
  const errors = {}

  //vehicle Group validation rule
  if (isTouched.group && !values.group) {
    errors.group = 'Vehicle Group is required'
  }

  return errors
}
