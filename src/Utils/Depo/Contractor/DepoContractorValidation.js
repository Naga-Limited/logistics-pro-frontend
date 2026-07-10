export default function DepoContractorValidation(values, isTouched) {

  const errors = {}

  //Contractor Name validation rule
  if (isTouched.contractorName && !values.contractorName) {
    errors.contractorName = 'Required'
  } else if (isTouched.contractorName && !/^[a-zA-Z ]+$/.test(values.contractorName)) {
    errors.contractorName = 'Only have Letters and Space'
  }

  //Contractor Owner Name validation rule
  if (isTouched.contractorOwnerName && !values.contractorOwnerName) {
    errors.contractorOwnerName = 'Required'
  } else if (isTouched.contractorOwnerName && !/^[a-zA-Z ]+$/.test(values.contractorOwnerName)) {
    errors.contractorOwnerName = 'Only have Letters and Space'
  }

  //Contractor Mobile Number Validation Rule
  if (isTouched.contractorNumber && !values.contractorNumber) {
    errors.contractorNumber = 'Required'
  } else if (isTouched.contractorNumber && !/^[\d]{10}$/.test(values.contractorNumber)) {
    errors.contractorNumber = 'Only have 10 Digit Numeric'
  }

  //Contractor Address Validation Rule
  if (isTouched.contractorAddress && !values.contractorAddress) {
    errors.contractorAddress = 'Required'
  }

  //Contractor Freight Type Validation Rule
  if (isTouched.freightType && values.freightType == 0) {
    errors.freightType = 'Required'
  }

  //Contractor GST Tax Type Validation Rule
  if (isTouched.gstType && values.gstType == 0) {
    errors.gstType = 'Required'
  }

  //Contractor TDS Tax Type Validation Rule
  if (isTouched.tdsType && values.tdsType == 0) {
    errors.tdsType = 'Required'
  }

  //Contractor Code Validation Rule
  if (isTouched.contractorCode && !values.contractorCode) {
    errors.contractorCode = 'Required'
  } else if (isTouched.contractorCode && !/^[\d]{6,8}$/.test(values.contractorCode)) {
    errors.contractorCode = 'Should have 6 Digit Numeric'
  }

  return errors
}

