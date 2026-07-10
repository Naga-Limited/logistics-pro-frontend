export default function FCILocationValidation(values, isTouched) {

    const errors = {}
  
    //Vendor GST Tax Type Validation Rule
    if (isTouched.gstType && values.gstType == 0) {
      errors.gstType = 'Required'
    }
  
    //Vendor TDS Tax Type Validation Rule
    if (isTouched.tdsType && values.tdsType == 0) {
      errors.tdsType = 'Required'
    }
  
    return errors
  }
  
  