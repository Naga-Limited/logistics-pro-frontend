export default function DepartmentSubMasterValidation(values, isTouched) {
  const errors = {}

  //vehicle type validation rule
  if (isTouched.department && !values.department) {
    errors.division = 'Department Name is required'
  } else if (isTouched.department && !/^[a-zA-Z ]+$/.test(values.department)) {
    errors.department = 'Department Name only have Letters and space'
  }

  return errors
}
