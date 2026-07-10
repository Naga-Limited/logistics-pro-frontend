export default function FIEntryValidation(values, isTouched) {
    const errors = {}

    if (isTouched.amounttype && values.amounttype === '') {
      errors.amounttype = 'Required'
    }
  
    if (isTouched.mode_of_payment && values.mode_of_payment === '') {
      errors.mode_of_payment = 'Required'
    }
  
    if (isTouched.entry_to && values.entry_to === '') {
      errors.entry_to = 'Required'
    }
  
    if (isTouched.diesel_vendor_name && values.diesel_vendor_name === '') {
      errors.diesel_vendor_name = 'Required'
    }
  
    if (isTouched.rj_so_no && values.rj_so_no === '') {
      errors.rj_so_no = 'Required'
    }
    
    if (isTouched.expense && values.expense === '') {
      errors.expense = 'Required'
    }
  
    if (isTouched.payment_mode && values.payment_mode === '') {
      errors.payment_mode = 'Required'
    }

    if (isTouched.freight_amount && !/^[\d]{2,6}$/.test(values.freight_amount)) {
      errors.freight_amount = 'Only have Numeric Value'
    }

    if (isTouched.hsn_type && values.hsn_type === '') {
      errors.hsn_type = 'Required'
    }

    if (isTouched.tds_type && values.tds_type === '') {
      errors.tds_type = 'Required'
    }

    if (isTouched.gst_tax_type && values.gst_tax_type === '') {
      errors.gst_tax_type = 'Required'
    }

    if (isTouched.rake_tds_type && values.rake_tds_type === '') {
      errors.rake_tds_type = 'Required'
    }

    if (isTouched.rake_hsn_type && values.rake_hsn_type === '') {
      errors.rake_hsn_type = 'Required'
    }

    

    return errors
  }
  