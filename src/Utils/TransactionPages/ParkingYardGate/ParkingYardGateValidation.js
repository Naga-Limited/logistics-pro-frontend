export default function ParkingYardGateValidation(values, isTouched) {
  const errors = {}

  //vehicle type validation rule
  if (isTouched.vehicleType && values.vehicleType === '0') {
    errors.vehicleType = 'Choose Vehicle Type'
  }

  //vehicle id validation rule
  if (isTouched.vehicleId && values.vehicleId === '') {
    errors.vehicleId = 'Choose Vehicle'
  }

  //Driver id validation rule
  if (isTouched.driverId && values.driverId === '') {
    errors.driverId = 'Choose Driver'
  }

  //vehicle Number validation rule
  if (isTouched.vehicleNumber && !values.vehicleNumber) {
    errors.vehicleNumber = 'Vehicle Number is required'
  } else if (
    isTouched.vehicleNumber &&
    !/^[A-Z]{2,3}[\d]{2,3}[A-Z]{0,2}[\d]{2,4}$/.test(values.vehicleNumber)
  ) {
    errors.vehicleNumber = 'Invalid Vehicle number '
  }

  //vehicle capacity validation rule
  if (isTouched.vehicleCapacity && values.vehicleCapacity === '') {
    errors.vehicleCapacity = 'Choose Vehicle Capacity'
  }

  //vehicle driverName validation rule

  if (isTouched.driverName && values.driverName === '') {
    errors.driverName = 'Enter Driver Name'
  } else if (isTouched.driverName && !/^[a-zA-Z]+(\s[a-zA-Z]+)?$/.test(values.driverName)) {
    errors.driverName = 'Invalid Driver Name'

    //   if (isTouched.driverName && values.driverName==="") {
    //     errors.driverName = "Enter Driver Name"
    //   }else if(isTouched.driverName &&  !/^[a-zA-Z ]{1,30}$/.test(values.driverName))
    //   {
    //     errors.driverName = 'No Special Characters'
  }

  //vehicle driverName validation rule
  // if (isTouched.driverPhoneNumber && values.driverPhoneNumber == '') {
  //   errors.driverPhoneNumber = 'Number should be numeric'
  // } else if (isTouched.driverPhoneNumber && values.driverPhoneNumber.length != 10) {
  //   errors.driverPhoneNumber = '10 digits required'
  // }

  if (isTouched.driverPhoneNumber && !values.driverPhoneNumber) {
    errors.driverPhoneNumber = 'Required'
  } else if (isTouched.driverPhoneNumber && !/^[\d]{10}$/.test(values.driverPhoneNumber)) {
    errors.driverPhoneNumber = 'Must Have 10 Digit Numeric'
  }

  //odometer Kilometer validation rule
  if (isTouched.odometerKm && !values.odometerKm) {
    errors.odometerKm = 'Odometer KM Required & Numeric'
  } else if (isTouched.odometerKm && !/^[\d]{6}$/.test(values.odometerKm)) {
    errors.odometerKm = 'Must Have 6 Digit Numeric'
  }

  //odometerImg validation rule
  if (isTouched.odometerImg && !values.odometerImg) {
    errors.odometerImg = 'Choose Odometer Photo'
  }

  //partyName validation rule
  //   if (isTouched.partyName && !values.partyName) {
  //     errors.partyName = 'Party Name Required'
  //   }

  //partyName validation rule
  if (isTouched.partyName && !values.partyName) {
    errors.partyName = 'Required'
  } else if (isTouched.partyName && !/^[a-zA-Z ]{1,30}$/.test(values.partyName)) {
    errors.partyName = '30 Characters Only'
  }

  //vehicleBody validation rule
  if (isTouched.vehicleBody && !values.vehicleBody) {
    errors.vehicleBody = 'Choose Vehicle Body'
  }

  //others_type validation rule
  if (isTouched.others_type && !values.others_type) {
    errors.others_type = 'Choose Vehicle Others Type'
  }

  

  return errors
}
