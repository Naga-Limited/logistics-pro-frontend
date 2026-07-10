export default function IfoodsVehicleValidation(values, isTouched) {

  const errors = {}

  //Vendor Name validation rule
  if (isTouched.vendor_id && !values.vendor_id) {
    errors.vendor_id = 'Required'
  }


  //vehicle Number validation rule
  if (isTouched.vehicle_number && !values.vehicle_number) {
    errors.vehicle_number = 'Required'
  }  else if (isTouched.vehicle_number && values.vehicle_number.length < 5) {
    errors.vehicle_number = 'Minimum Length : 5'
  }

  //vehicle Capacity validation rule
  if (isTouched.vehicle_capacity_id && values.vehicle_capacity_id == '0') {
    errors.vehicle_capacity_id = 'Required'
  }

  //AC availity validation rule
  if (isTouched.ac_non_ac && values.ac_non_ac == '0') {
    errors.ac_non_ac = 'Required'
  }

  //vehicle body Type validation rule
  if (isTouched.vehicleBodyType && values.vehicleBodyType == '0') {
    errors.vehicleBodyType = 'Required'
  }

  //Insurance Validity Validation Rule
  var dateOne = new Date(values.insuranceValidity)
  var dateTwo = new Date(getCurrentDate('-'))

  if (isTouched.insuranceValidity && !values.insuranceValidity) {
    errors.insuranceValidity = 'Choose Insurance Validity Date'
  } else if (dateOne < dateTwo) {
    errors.insuranceValidity = 'Past Days Not Allowed'
  }

  //FC Validity Validation Rule
  var dateThree = new Date(values.fcValidity)

  if (isTouched.fcValidity && !values.fcValidity) {
    errors.fcValidity = 'Choose FC Validity Date'
  } else if (dateThree < dateTwo) {
    errors.fcValidity = 'Past Days Not Allowed'
  }

  return errors
}

function getCurrentDate(separator = '') {
  let newDate = new Date()
  let date = newDate.getDate()
  let month = newDate.getMonth() + 1
  let year = newDate.getFullYear()

  return `${year}${separator}${month < 10 ? `0${month}` : `${month}`}${separator}${date}`
}
