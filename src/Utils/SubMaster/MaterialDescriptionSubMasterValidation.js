export default function MaterialDescriptionSubMasterValidation(values, isTouched) {
  const errors = {}

  //vehicle type validation rule
  if (isTouched.material_description && !values.material_description) {
    errors.material_description = 'Material Description is required'
  } else if (isTouched.material_description && !/^[a-zA-Z0-9]*$/.test(values.material_description)) {
    errors.material_description = 'Material Description only have Letters and space'
  }


  return errors
}
