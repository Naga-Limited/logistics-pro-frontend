export default function VehicleVarietySubMasterValidation(values, isTouched) {
  const errors = {}

  //vehicle Variety validation rule
  if (isTouched.variety && !values.variety) {
    errors.variety = 'Vehicle Variety is required'
  } else if(values.variety.trim() == ''){
    errors.variety = 'Vehicle Variety is required'
    values.variety = ''
  }

  return errors
}
