export default function VendorRequestValidation(values, isTouched) {
  const errors = {}
  if (isTouched.vehicleType && !values.vehicleType) {
    errors.vehicleType = 'required'
  }
  if (isTouched.OdometerKm && !values.OdometerKm) {
    errors.OdometerKm = 'required'
  }
  if (isTouched.odometerPhoto && values.odometerPhoto.length > 0) {
    errors.odometerPhoto = 'Choose The File'
  }

  return errors
}
