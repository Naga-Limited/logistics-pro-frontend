export default function definitionsMasterValidation(values, isTouched) {
  const errors = {}

  //definitions validation rule
  if (isTouched.definition && !values.definition) {
    errors.definition = 'required'
  } else if (isTouched.definition && !/^[a-zA-Z ]+$/.test(values.definition)) {
    errors.definition = 'Definitions only have Letters and space'
  }

  return errors
}
