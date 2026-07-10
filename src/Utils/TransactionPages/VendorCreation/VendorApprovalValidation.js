export default function VendorApprovalValidation(values, isTouched) {
  const errors = {}

  if (isTouched.panNumber && !values.panNumber) {
    errors.panNumber = 'PAN Number is Required'
  } else if (isTouched.panNumber && !/^[A-Z]{5}[\d]{4}[A-Z]{1}$/.test(values.panNumber)) {
    errors.panNumber = 'Must Like "AMIPR8417L"'
  }

  if (isTouched.aadhar && !values.aadhar) {
    errors.aadhar = 'Aadhar Number is Required'
  } else if (isTouched.aadhar && !/^[\d]{12}$/.test(values.aadhar)) {
    errors.aadhar = 'Must Have 12 Digit Numeric'
  }

  if (!/^[\d]{2}[A-Z]{5}[\d]{4}[A-Z]{1}[\d]{1}[A-Z]{1}[A-Z\d]{1}$/.test(values.GSTNumber)) {
    errors.GSTNumber = 'Must Like "07AAGFF2194N1Z1"'
  }

  if (isTouched.GSTNumber && !values.GSTNumber) {
    errors.GSTNumber = 'GST Number is Required'
  } else if (
    isTouched.GSTNumber &&
    !/^[\d]{2}[A-Z]{5}[\d]{4}[A-Z]{1}[\d]{1}[A-Z]{1}[A-Z\d]{1}$/.test(values.GSTNumber)
  ) {
    errors.GSTNumber = 'Must Like "07AAGFF2194N1Z1"'
  }

  if (isTouched.bankName && !values.bankName) {
    errors.bankName = 'Bank name is required'
  } else if (isTouched.bankName && !/^[a-zA-Z ]+$/.test(values.bankName)) {
    errors.bankName = 'Bank name only have Letters and space'
  }
  // if (isTouched.shedName && !values.shedName) {
  //   errors.shedName = 'Shed Name is Required'
  // }
  if (isTouched.GSTtax && !values.GSTtax) {
    errors.GSTtax = 'Tax Code is Required'
  }
  if (isTouched.payment_term_3days && !values.payment_term_3days) {
    errors.payment_term_3days = 'Payment is Required'
  }

  if (isTouched.bankBranch && !values.bankBranch) {
    errors.bankBranch = 'Bank Branch is Required'
  } else if (isTouched.bankBranch && !/^[a-zA-Z]+(\s[a-zA-Z]+)?$/.test(values.bankBranch)) {
    errors.bankBranch = 'Invalid Name'
  }

  if (isTouched.bankAccHolderName && !values.bankAccHolderName) {
    errors.bankAccHolderName = 'A/C Holder Name is Required'
  } else if (
    isTouched.bankAccHolderName &&
    !/^[a-zA-Z]+(\s[a-zA-Z]+)?$/.test(values.bankAccHolderName)
  ) {
    errors.bankAccHolderName = 'Invalid Name'
  }

  if (isTouched.GSTreg && !values.GSTreg) {
    errors.GSTreg = 'Required'
  }
  if (isTouched.region && !values.region) {
    errors.region = 'Region is Required'
  }

  if (isTouched.insuranceValid && !values.insuranceValid) {
    errors.insuranceValid = 'Insurance Validity is Required'
  }

  if (isTouched.freightRate && !values.freightRate) {
    errors.freightRate = 'Freight rate is Required'
  }

  // if (isTouched.ownerName && !values.ownerName) {
  //   errors.ownerName = 'Owner Name is Required'
  // }

  // if (isTouched.ownerMob && !values.ownerMob) {
  //   errors.ownerMob = ' Mobile No. is Required'
  // } else if (isTouched.ownerMob && !/^[\d]{10}$/.test(values.ownerMob)) {
  //   errors.ownerMob = 'Must Have 10 Digit Numeric'
  // }

  if (isTouched.bankAccount && !values.bankAccount) {
    errors.bankAccount = 'Bank Account is Required'
  } else if (isTouched.bankAccount && !/^[\d]{20}$/.test(values.bankAccount)) {
    errors.bankAccount = 'Must Have 20 Digit Numeric'
  }

  if (isTouched.ifscCode && !values.ifscCode) {
    errors.ifscCode = 'IFSC Code is Required'
  } else if (isTouched.ifscCode && !/^[A-Z]{4}[\d]{7}$/.test(values.ifscCode)) {
    errors.ifscCode = 'Must Like "IOBA0001234"'
  }

  if (isTouched.street && !values.street) {
    errors.street = 'Street is Required'
  } else if (isTouched.street && /^[A-Z0-9 _]*[A-Z0-9][A-Z0-9 _]*$/.test(values.street)) {
    errors.street = 'Letters & Number Only'
  }
  if (isTouched.city && !values.city) {
    errors.city = 'City is Required'
  } else if (isTouched.city && /^[A-Z0-9 _]*[A-Z0-9][A-Z0-9 _]*$/.test(values.city)) {
    errors.city = 'Letters Only'
  }
  if (isTouched.state && !values.state) {
    errors.state = 'State is Required'
  } else if (isTouched.state && /^[A-Z0-9 _]*[A-Z0-9][A-Z0-9 _]*$/.test(values.state)) {
    errors.state = 'Letters Only'
  }
  if (isTouched.district && !values.district) {
    errors.district = 'District is Required'
  } else if (isTouched.district && /^[A-Z0-9 _]*[A-Z0-9][A-Z0-9 _]*$/.test(values.district)) {
    errors.district = 'Letters Only'
  }

  if (isTouched.area && !values.area) {
    errors.area = 'Area is Required'
  } else if (isTouched.area && /^[A-Z0-9 _]*[A-Z0-9][A-Z0-9 _]*$/.test(values.area)) {
    errors.area = 'Letters Only'
  }

  if (isTouched.postalCode && !values.postalCode) {
    errors.postalCode = 'Postal Code is Required'
  } else if (isTouched.postalCode && !/^[\d]{6}$/.test(values.postalCode)) {
    errors.postalCode = '6 Numbers Only'
  }

  return errors
}
