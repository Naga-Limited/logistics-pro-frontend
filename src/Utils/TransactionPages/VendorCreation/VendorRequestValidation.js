export default function VendorRequestValidation(values, isTouched) {
  const errors = {}

  if (isTouched.panNumber && !values.panNumber) {
    errors.panNumber = 'Required'
  } else if (isTouched.panNumber && !/^[A-Z]{5}[\d]{4}[A-Z]{1}$/.test(values.panNumber)) {
    errors.panNumber = 'Must Like "AMIPR8417L"'
  }

  if (isTouched.aadhar && !values.aadhar) {
    errors.aadhar = 'Required'
  } else if (isTouched.aadhar && !/^[\d]{12}$/.test(values.aadhar)) {
    errors.aadhar = 'Must Have 12 Digit Numeric'
  }

  if (isTouched.mobileNumber && !values.mobileNumber) {
    errors.mobileNumber = 'Required'
  } else if (isTouched.mobileNumber && !/^[\d]{10}$/.test(values.mobileNumber)) {
    errors.mobileNumber = 'Must Have 10 Digit Numeric'
  }

  if (!/^[\d]{2}[A-Z]{5}[\d]{4}[A-Z]{1}[\d]{1}[A-Z]{1}[A-Z\d]{1}$/.test(values.GSTNumber)) {
    errors.GSTNumber = 'Must Like "07AAGFF2194N1Z1"'
  }

  // if (isTouched.GSTNumber && !values.GSTNumber) {
  //   errors.GSTNumber = 'Required'
  // } else if (
  //   isTouched.GSTNumber && !/^[\d]{2}[A-Z]{5}[\d]{4}[A-Z]{1}[\d]{1}[A-Z]{1}[A-Z\d]{1}$/.test(values.GSTNumber)
  // ) {
  //   errors.GSTNumber = 'Must Like "07AAGFF2194N1Z1"'
  // }

  if (isTouched.bankName && !values.bankName) {
    errors.bankName = 'Required'
  }

  //Payment Type Validation Rule
  if (isTouched.payment && values.payment == '0') {
    errors.payment = 'Required'
  } else if (isTouched.payment && !values.payment) {
    errors.payment = 'Required'
  }

  //Tax Type Validation Rule
  if (isTouched.GSTtax && values.GSTtax == '0') {
    errors.GSTtax = 'Required'
  } else if (isTouched.GSTtax && !values.GSTtax) {
    errors.GSTtax = 'Required'
  }

  if (isTouched.bankBranch && !values.bankBranch) {
    errors.bankBranch = 'Required'
  } else if (isTouched.bankBranch && !/^[a-zA-Z]+(\s[a-zA-Z]+)?$/.test(values.bankBranch)) {
    errors.bankBranch = 'Invalid Name'
  }

  if (isTouched.bankAccHolderName && !values.bankAccHolderName) {
    errors.bankAccHolderName = 'Required'
  } else if (
    isTouched.bankAccHolderName &&
    !/^[a-zA-Z]+(\s[a-zA-Z]+)?$/.test(values.bankAccHolderName)
  ) {
    errors.bankAccHolderName = 'Invalid Name'
  }

  if (isTouched.GSTreg && !values.GSTreg) {
    errors.GSTreg = 'Required'
  }

  if (isTouched.insuranceValid && !values.insuranceValid) {
    errors.insuranceValid = 'Required'
  }

  if (isTouched.freightRate && !values.freightRate) {
    errors.freightRate = 'Required'
  }

  if (isTouched.ownerName && !values.ownerName) {
    errors.ownerName = 'Required'
  }

  if (isTouched.ownerMob && !values.ownerMob) {
    errors.ownerMob = 'Required'
  } else if (isTouched.ownerMob && !/^[\d]{10}$/.test(values.ownerMob)) {
    errors.ownerMob = 'Must Have 10 Digit Numeric'
  }

  if (isTouched.bankAccount && !values.bankAccount) {
    errors.bankAccount = 'Required'
  } else if (isTouched.bankAccount && !/^\d{9,18}$/.test(values.bankAccount)) {
    errors.bankAccount = 'Must Have Numeric (9-18 digits) ..'
  }

  //Vendor Name Validation Rule
  if (isTouched.vendorName && !values.vendorName) {
    errors.vendorName = 'Required'
  }
  // else if (isTouched.vendorName && !/^[a-zA-Z ]+$/.test(values.vendorName)) {
  //   errors.vendorName = 'Only have Letters and space'
  // }

  if (isTouched.ifscCode && !values.ifscCode) {
    errors.ifscCode = 'Required'
  }
  else if (isTouched.ifscCode && !/^[A-Z0-9]{11}$/.test(values.ifscCode)) {
    errors.ifscCode = 'Must Like "BKID0008267"'
  }

  //Street Validation Rule
  if (isTouched.street && !values.street) {
    errors.street = 'Required'
  } 
  // else if (isTouched.street && !/^[a-zA-Z ]+$/.test(values.street)) {
  //   errors.street = 'Only have Letters and space'
  // }

  //Area Validation Rule
  if (isTouched.area && !values.area) {
    errors.area = 'Required'
  } else if (isTouched.area && !/^[a-zA-Z ]+$/.test(values.area)) {
    errors.area = 'Only have Letters and space'
  }

  //City Validation Rule
  if (isTouched.city && !values.city) {
    errors.city = 'Required'
  } else if (isTouched.city && !/^[a-zA-Z ]+$/.test(values.city)) {
    errors.city = 'Only have Letters and space'
  }

  //State Validation Rule
  if (isTouched.state && !values.state) {
    errors.state = 'Required'
  }

  //District Validation Rule
  if (isTouched.district && !values.district) {
    errors.district = 'Required'
  } else if (isTouched.district && !/^[a-zA-Z ]+$/.test(values.district)) {
    errors.district = 'Only have Letters and space'
  }

  if (isTouched.postalCode && !values.postalCode) {
    errors.postalCode = 'Required'
  } else if (isTouched.postalCode && !/^[\d]{6}$/.test(values.postalCode)) {
    errors.postalCode = '6 Numbers Only'
  }

  if (isTouched.rcFront && !values.rcFront) {
    errors.rcFront = 'Required'
  }
  if (isTouched.rcBack && !values.rcBack) {
    errors.rcBack = 'Required'
  }
  if (isTouched.TDSfront && !values.TDSfront) {
    errors.TDSfront = 'Required'
  }
  if (isTouched.transportShed && !values.transportShed) {
    errors.transportShed = 'Required'
  }
  if (isTouched.licenseCopy && !values.licenseCopy) {
    errors.licenseCopy = 'Required'
  }
  if (isTouched.TDSback && !values.TDSback) {
    errors.TDSback = 'Required'
  }
  if (isTouched.aadharCopy && !values.aadharCopy) {
    errors.aadharCopy = 'Required'
  }
  if (isTouched.panCopy && !values.panCopy) {
    errors.panCopy = 'Required'
  }
  if (isTouched.bankPass && !values.bankPass) {
    errors.bankPass = 'Required'
  }

  return errors
}
