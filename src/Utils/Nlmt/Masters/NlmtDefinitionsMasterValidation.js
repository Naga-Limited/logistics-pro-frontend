export default function NlmtDefinitionsMasterValidation(values, isTouched) {
  const errors = {}

  //definitions validation rule
  if (isTouched.definition) {
    if (!values.definition || values.definition.trim() === '') {
      errors.definition = 'Required'
    } else if (!/^[a-zA-Z0-9 .,'-]+$/.test(values.definition.trim())) {
      errors.definition = "Only letters, numbers, space, - . , ' allowed"
    } else {
      errors.definition = ''
    }
  }

  return errors
}
