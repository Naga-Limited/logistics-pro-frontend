export default function NlmtVehicleMasterValidation(values, isTouched) {
  const errors = {}

  function getCurrentDate(separator = '') {
    let newDate = new Date()
    let date = newDate.getDate()
    let month = newDate.getMonth() + 1
    let year = newDate.getFullYear()
    return `${year}${separator}${month < 10 ? `0${month}` : `${month}`}${separator}${date < 10 ? `0${date}` : `${date}`}`
  }

  const todayStr = getCurrentDate('-')
  
  // Harmonize the disparate variable names between Create and Edit view
  const inputVNumber = values.vechileNumber || values.vehicleNumber
  const inputTouched = isTouched.vechileNumber || isTouched.vehicleNumber
  const inputInsValid = values.InsuranceValidity || values.insuranceValidity
  const inputInsTouched = isTouched.InsuranceValidity || isTouched.insuranceValidity
  const inputFCValid = values.FCValidity || values.fcValidity
  const inputFCTouched = isTouched.FCValidity || isTouched.fcValidity

  //vehicle Number validation rule
  if (inputVNumber) {
     if (!/^[A-Z]{2}\d{2}[A-Z]{1,2}\d{4}$/.test(inputVNumber)) {
        const errStr = 'Invalid Vehicle number format'
        errors.vechileNumber = errStr
        errors.vehicleNumber = errStr
     }
  } else if (inputTouched) {
    errors.vechileNumber = 'Required'
    errors.vehicleNumber = 'Required'
  }

  //vehicle Capacity validation rule
  if (isTouched.VehicleCapacity && values.VehicleCapacity === '0') {
    errors.VehicleCapacity = 'Required'
  }
  if (isTouched.vehicleCapacity && !values.vehicleCapacity) {
    errors.vehicleCapacity = 'Required'
  }

  //vehicle body validation rule
  if (isTouched.VehicleBodyType && values.VehicleBodyType === '0') {
    errors.VehicleBodyType = 'Required'
  }
  if (isTouched.vehicleBodyType && !values.vehicleBodyType) {
    errors.vehicleBodyType = 'Required'
  }

  // Date Validations
  if (inputInsValid) {
    if (inputInsValid < todayStr) {
      errors.InsuranceValidity = 'Past date not allowed'
      errors.insuranceValidity = 'Past date not allowed'
    }
  } else if (inputInsTouched) {
    errors.InsuranceValidity = 'Required'
    errors.insuranceValidity = 'Required'
  }

  if (inputFCValid) {
    if (inputFCValid < todayStr) {
      errors.FCValidity = 'Past date not allowed'
      errors.fcValidity = 'Past date not allowed'
    }
  } else if (inputFCTouched) {
    errors.FCValidity = 'Required'
    errors.fcValidity = 'Required'
  }

  return errors
}
