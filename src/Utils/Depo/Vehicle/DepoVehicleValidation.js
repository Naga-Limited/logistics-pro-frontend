export default function DepoVehicleValidation(values, isTouched) {

  const errors = {}

  //Contractor Name validation rule
  if (isTouched.contractorName && !values.contractorName) {
    errors.contractorName = 'Required'
  } else if (isTouched.contractorName && !/^[a-zA-Z ]+$/.test(values.contractorName)) {
    errors.contractorName = 'Only have Letters and Space'
  }

  //Vehicle Owner Name validation rule
  if (isTouched.vehicleOwnerName && !values.vehicleOwnerName) {
    errors.vehicleOwnerName = 'Required'
  } else if (isTouched.vehicleOwnerName && !/^[a-zA-Z ]+$/.test(values.vehicleOwnerName)) {
    errors.vehicleOwnerName = 'Only have Letters and Space'
  }

  //Vehicle Owner Mobile Number Validation Rule
  if (isTouched.vehicleOwnerNumber && !values.vehicleOwnerNumber) {
    errors.vehicleOwnerNumber = 'Required'
  } else if (isTouched.vehicleOwnerNumber && !/^[\d]{10}$/.test(values.vehicleOwnerNumber)) {
    errors.vehicleOwnerNumber = 'Only have 10 Digit Numeric'
  }

  //vehicle Number validation rule
  if (isTouched.vehicleNumber && !values.vehicleNumber) {
    errors.vehicleNumber = 'Required'
  }  else if (isTouched.vehicleNumber && values.vehicleNumber.length < 6) {
    errors.vehicleNumber = 'Minimum Length : 6'
  }

  //vehicle Capacity validation rule
  if (isTouched.vehicleCapacity && values.vehicleCapacity == '0') {
    errors.vehicleCapacity = 'Required'
  }

  //Contractor validation rule
  if (isTouched.depoContractorName && values.depoContractorName == '0') {
    errors.depoContractorName = 'Required'
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
