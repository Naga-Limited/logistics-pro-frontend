export default function RejectReasonSubMasterValidation(values, isTouched) {
  const errors = {}

  //vehicle type validation rule
  if (isTouched.rejection_reason && !values.rejection_reason) {
    errors.rejection_reason = 'Rejection Reason is required'
  } else if (isTouched.rejection_reason && !/^[a-zA-Z ]+$/.test(values.rejection_reason)) {
    errors.rejection_reason = 'Rejection Reason only have Letters and space'
  }

  return errors
}
