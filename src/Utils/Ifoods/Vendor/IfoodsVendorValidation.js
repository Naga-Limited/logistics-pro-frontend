export default function IfoodsVendorValidation(values, isTouched) {
  const errors = {}

  //Vendor Code Validation Rule
  if (isTouched.vendor_code && !values.vendor_code) {
    errors.vendor_code = 'Required'
  } else if (isTouched.vendor_code && !/^[\d]{6,8}$/.test(values.vendor_code)) {
    errors.vendor_code = 'Should have 6 Digit Numeric'
  }

  //Vendor Name Validation Rule
  if (isTouched.vendor_name && values.vendor_name == 0) {
    errors.vendor_name = 'Required'
  }

  //Vendor Location Validation Rule
  if (isTouched.location_id && values.location_id == 0) {
    errors.location_id = 'Required'
  }
  //Vendor Freight Validation Rule
  if (isTouched.freight_type && values.freight_type == 0) {
    errors.freight_type = 'Required'
  }
  //Vendor Vendor Address Validation Rule
  if (isTouched.vendor_address && values.vendor_address == 0) {
    errors.vendor_address = 'Required'
  }

  //Vendor Mobile Number Validation Rule
  if (isTouched.vendor_contact_no && !values.vendor_contact_no) {
    errors.vendor_contact_no = 'Required'
  } else if (isTouched.vendor_contact_no && !/^[\d]{10}$/.test(values.vendor_contact_no)) {
    errors.vendor_contact_no = 'Only have 10 Digit Numeric'
  }

  //Vendor GST Tax Type Validation Rule
  if (isTouched.gst_tax_type && values.gst_tax_type == 0) {
    errors.gst_tax_type = 'Required'
  }

  //Vendor TDS Tax Type Validation Rule
  if (isTouched.tds_tax_type && values.tds_tax_type == 0) {
    errors.tds_tax_type = 'Required'
  }
  
  return errors
}
