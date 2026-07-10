export default function validate(values, isTouched) {
  const errors = {}

  if (isTouched.defect_type && !values.defect_type.trim()) {
    errors.defect_type = 'Required'
  }

  return errors
}
