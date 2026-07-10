export default function OthersTripsheetValidation(values, isTouched) {
  const errors = {}

  const getInt = (val) => {
    let int_value = 0
    if(val){
      int_value = Number(parseFloat(val).toFixed(2))
    }
    console.log(int_value,'int_value')
    return int_value
  }

  //vehicle Number validation rule
  if (isTouched.ot_veh_num && !values.ot_veh_num) {
    errors.ot_veh_num = 'Vehicle Number is required'
  } else if (
    isTouched.ot_veh_num &&
    !/^[A-Z]{2,3}[\d]{2,3}[A-Z]{0,2}[\d]{2,4}$/.test(values.ot_veh_num)
  ) {
    errors.ot_veh_num = 'Invalid Vehicle number '
  }

  //Driver Name Validation Rule
  if (isTouched.ot_dr_name && values.ot_dr_name.trim() == '') {
    errors.ot_dr_name = 'Required'
  } else if (isTouched.ot_dr_name && !/^[a-zA-Z ]+$/.test(values.ot_dr_name)) {
    errors.ot_dr_name = 'Only have Letters and space'
  }

  //Driver Contact No Validation Rule
  if (isTouched.ot_dr_num && values.ot_dr_num.trim() == '') {
    errors.ot_dr_num = 'Required'
  } else if (isTouched.ot_dr_num && !/^[\d]{10}$/.test(values.ot_dr_num)) {
    errors.ot_dr_num = 'Only have 10 Digit Numeric '
  }

  //Owner Name Validation Rule
  if (isTouched.ownerName && values.ownerName.trim() == '') {
    errors.ownerName = 'Required'
  } else if (isTouched.ownerName && !/^[a-zA-Z ]+$/.test(values.ownerName)) {
    errors.ownerName = 'Only have Letters and space'
  }

  //Owner Contact No Validation Rule
  if (isTouched.ownerMob && values.ownerMob.trim() == '') {
    errors.ownerMob = 'Required'
  } else if (isTouched.ownerMob && !/^[\d]{10}$/.test(values.ownerMob)) {
    errors.ownerMob = '10 Digit Numeric '
  }

  //Owner Aadhar No Validation Rule
  if (isTouched.aadhar && values.aadhar.trim() == '') {
    errors.aadhar = ''
  } else if (isTouched.aadhar && !/^[\d]{12}$/.test(values.aadhar)) {
    errors.aadhar = ' 12 Digit Numeric '
  }

  //Owner Bank Acc No Validation Rule
  if (isTouched.bankAcc && values.bankAcc.trim() == '') {
    errors.bankAcc = ''
  } else if (isTouched.bankAcc && !/^\d{9,18}$/.test(values.bankAcc)) {
    errors.bankAcc = ' Numeric (9-18 digits) ..'
  }

   //vehicle capacity validation rule
   if (isTouched.ot_veh_cap && values.ot_veh_cap === '') {
    errors.ot_veh_cap = 'Choose Vehicle Capacity'
  }

  //Freight Calculation Method validation rule
  if (isTouched.ot_freight_calc && values.ot_freight_calc === '') {
    errors.ot_freight_calc = 'Required'
  }

  //vehicleBody validation rule
  if (isTouched.ot_veh_body_type && values.ot_veh_body_type === '') {
    errors.ot_veh_body_type = 'Choose Vehicle Body'
  }

  //vehicleInsurance validation rule
  if (isTouched.ot_veh_insurence_valid && values.ot_veh_insurence_valid === '') {
    errors.ot_veh_insurence_valid = 'Required'
  }

  //driverLicense validation rule
  if (isTouched.ot_dr_license_valid && values.ot_dr_license_valid === '') {
    errors.ot_dr_license_valid = 'Required'
  }

  //Advance Availability validation rule
  if (isTouched.ot_adv_avail && values.ot_adv_avail === '') {
    errors.ot_adv_avail = 'Required'
  }

  //Others Vehicle Request validation rule
  if (isTouched.ot_vr_no && values.ot_vr_no === '') {
    errors.ot_vr_no = 'Required'
  }

  //Others VR Purpose validation rule
  if (isTouched.ot_vr_purpose && values.ot_vr_purpose === '') {
    errors.ot_vr_purpose = 'Required'
  }

  //Others VR Product validation rule
  if (isTouched.ot_vr_product && values.ot_vr_product === '') {
    errors.ot_vr_product = 'Required'
  }


  //Freight Amount Validation Rule
  if (isTouched.ot_freight_amount && values.ot_freight_amount.trim() == '') {
    errors.ot_freight_amount = 'Required'
  } else if (isTouched.ot_freight_amount && !/^\d{1,6}$/.test(values.ot_freight_amount)) {
    errors.ot_freight_amount = ' Numeric (1-6 digits) ..'
  }

  //Total Freight Amount Validation Rule
  if (isTouched.ot_tot_freight_amount && values.ot_tot_freight_amount.trim() == '') {
    errors.ot_tot_freight_amount = 'Required'
  } else if (isTouched.ot_tot_freight_amount && !/^\d{1,6}$/.test(values.ot_tot_freight_amount)) {
    errors.ot_tot_freight_amount = ' Numeric (1-6 digits) ..'
  } else if(getInt(values.ot_tot_freight_amount) < getInt(values.ot_freight_amount)){
    errors.ot_tot_freight_amount = ' Total Freight Should be Greaterthan Freight Amount..'
  }

  console.log('values.ot_freight_amount',values.ot_freight_amount)
  console.log('values.ot_tot_freight_amount',values.ot_tot_freight_amount)

   //Bank Advance Amount Validation Rule
   if (isTouched.ot_bank_adv && values.ot_bank_adv.trim() == '') {
    errors.ot_bank_adv = 'Required'
  } else if (isTouched.ot_bank_adv && !/^\d{1,6}$/.test(values.ot_bank_adv)) {
    errors.ot_bank_adv = ' Numeric (1-6 digits) ..'
  }

  //Diesel Advance Amount Validation Rule
  if (isTouched.ot_diesel_adv && values.ot_diesel_adv.trim() == '') {
    errors.ot_diesel_adv = 'Required'
  } else if (isTouched.ot_diesel_adv && !/^\d{1,6}$/.test(values.ot_diesel_adv)) {
    errors.ot_diesel_adv = ' Numeric (1-6 digits) ..'
  }

  if (isTouched.ot_vr_req_contact_no && values.ot_vr_req_contact_no.trim() == '') {
    errors.ot_vr_req_contact_no = 'Required'
  } else if (isTouched.ot_vr_req_contact_no && !/^[\d]{10}$/.test(values.ot_vr_req_contact_no)) {
    errors.ot_vr_req_contact_no = 'Only have 10 Digit Numeric '
  }

  //VR From Location Validation Rule
  if (isTouched.ot_vr_from_location && values.ot_vr_from_location.trim() == '') {
    errors.ot_vr_from_location = 'Required'
  } else if (
    isTouched.ot_vr_from_location &&
    !/^[^*|\":<>[\]{}`\\()';@&$#+!]+$/.test(values.ot_vr_from_location)
  ) {
    errors.ot_vr_from_location = 'Special Characters Not Allowed'
  }

  //VR To Location Validation Rule
  if (isTouched.ot_vr_to_location && values.ot_vr_to_location.trim() == '') {
    errors.ot_vr_to_location = 'Required'
  } else if (
    isTouched.ot_vr_to_location &&
    !/^[^*|\":<>[\]{}`\\()';@&$#+!]+$/.test(values.ot_vr_to_location)
  ) {
    errors.ot_vr_to_location = 'Special Characters Not Allowed'
  }

  //VR Requester Name Validation Rule
  if (isTouched.ot_vr_requester && values.ot_vr_requester.trim() == '') {
    errors.ot_vr_requester = 'Required'
  } else if (isTouched.ot_vr_requester && !/^[a-zA-Z ]+$/.test(values.ot_vr_requester)) {
    errors.ot_vr_requester = 'Only have Letters and space'
  }

  //VR Expected Date & Time Validation Rule
  if (isTouched.ot_vr_datetime && values.ot_vr_datetime.trim() == '') {
    errors.ot_vr_datetime = 'Required'
  }

  return errors
}


