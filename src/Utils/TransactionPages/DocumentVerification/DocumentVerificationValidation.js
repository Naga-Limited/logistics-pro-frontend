export default function DocumentVerificationValidation(values, isTouched) {
  const errors = {}

  if (isTouched.panNumber && !values.panNumber) {
    errors.panNumber = 'Required'
  } else if (isTouched.panNumber && !/^[A-Z]{5}[\d]{4}[A-Z]{1}$/.test(values.panNumber)) {
    errors.panNumber = 'Must Like "CRCPK0712L"'
  }

  //Shed Name Validation Rule
  if (isTouched.shedName && values.shedName == '0') {
    errors.shedName = 'Required'
  }

  if (isTouched.rcFront && !values.rcFront) {
    errors.rcFront = 'Required'
  }
  if (isTouched.rcBack && !values.rcBack) {
    errors.rcBack = 'Required'
  }
  // if (isTouched.insurance && !values.insurance) {
  //   errors.insurance = 'Required'
  // }
  if (isTouched.insuranceValid && !values.insuranceValid) {
    errors.insuranceValid = 'Required'
  }
  if (isTouched.TDSfront && !values.TDSfront) {
    errors.TDSfront = 'Required'
  }

  if (isTouched.transportShedSheet && !values.transportShedSheet) {
    errors.transportShedSheet = 'Required'
  }

  if (isTouched.license && !values.license) {
    errors.license = 'Required'
  }
  if (isTouched.TDSback && !values.TDSback) {
    errors.TDSback = 'Required'
  }

  // if (isTouched.shedName && !values.shedName) {
  //   errors.shedName = 'Required'
  // }

  if (isTouched.freightRate && !values.freightRate) {
    errors.freightRate = 'Required'
  } else if (isTouched.freightRate && !/^[0-9]{1,4}$/.test(values.freightRate)) {
    errors.freightRate = 'Numbers Only'
  }

  if (isTouched.ownerName && !values.ownerName) {
    errors.ownerName = 'Required'
  } else if (isTouched.ownerName && !/^[a-zA-Z]+(\s[a-zA-Z]+)?$/.test(values.ownerName)) {
    errors.ownerName = 'Invalid'
  }

  if (isTouched.ownerMob && !values.ownerMob) {
    errors.ownerMob = 'Required'
  } else if (isTouched.ownerMob && !/^[\d]{10}$/.test(values.ownerMob)) {
    errors.ownerMob = 'Must Have 10 Numeric'
  }

  if (isTouched.aadhar && !values.aadhar) {
    errors.aadhar = 'Required'
  } else if (isTouched.aadhar && !/^[\d]{12}$/.test(values.aadhar)) {
    errors.aadhar = 'Must Have 12 Numeric'
  }

  if (isTouched.bankAcc && !values.bankAcc) {
    errors.bankAcc = 'Required'
  } else if (isTouched.bankAcc && !/^\d{9,18}$/.test(values.bankAcc)) {
    errors.bankAcc = 'Must Have Numeric (9-18 digits) ..'
  }

  if (isTouched.aadharCopy && !values.aadharCopy) {
    errors.aadharCopy = 'Required'
  }
  if (isTouched.panCopy && !values.panCopy) {
    errors.panCopy = 'Required'
  }
  if (isTouched.passCopy && !values.passCopy) {
    errors.passCopy = 'Required'
  }

  return errors
}
