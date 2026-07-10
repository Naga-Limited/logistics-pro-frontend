export default function AfterDeliveryGateInValidation(values, isTouched) {
  const errors = {}

    //odometer Kilometer validation rule
  if (isTouched.odometer_closing_km && !values.odometer_closing_km) {
    errors.odometer_closing_km = 'Odometer KM Required & Numeric'
  } else if (isTouched.odometer_closing_km && !/^[\d]{6}$/.test(values.odometer_closing_km)) {
    errors.odometer_closing_km = 'Must Have 6 Digit Numeric'
  }

  //odometerImg validation rule
  if (isTouched.closing_odometer_photo && !values.closing_odometer_photo) {
    errors.closing_odometer_photo = 'Choose Odometer Photo'
  }

  return errors
}
