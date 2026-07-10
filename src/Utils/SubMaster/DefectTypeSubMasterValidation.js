export default function DefectTypeSubMasterValidation(values, isTouched) {
  const errors = {}

  //vehicle type validation rule
  if (isTouched.defect_type && !values.defect_type) {
    errors.defect_type = 'Defect Type is required'
  } else if (isTouched.defect_type && !/^[a-zA-Z ]+$/.test(values.defect_type)) {
    errors.defect_type = 'Defect Type only have Letters and space'
  }

  return errors
}
