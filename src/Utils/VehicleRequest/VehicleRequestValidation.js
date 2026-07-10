export default function VehicleRequestValidation(values, isTouched) {
  const errors = {}

  //VR Vehicle Purpose Type Validation Rule
  if (isTouched.vr_purpose && values.vr_purpose == 0) {
    errors.vr_purpose = 'Required'
  }

  //VR Vehicle Product Type Validation Rule
  if (isTouched.vr_product && values.vr_product == 0) {
    errors.vr_product = 'Required'
  }

  //VR Vehicle Capacity Type Validation Rule
  if (isTouched.vr_capacity_id && values.vr_capacity_id == 0) {
    errors.vr_capacity_id = 'Required'
  }

  //VR Vehicle Variety Type Validation Rule
  if (isTouched.vr_variety_id && values.vr_variety_id == 0) {
    errors.vr_variety_id = 'Required'
  }

  //VR Vehicle Body Type Validation Rule
  if (isTouched.vr_body_type_id && values.vr_body_type_id == 0) {
    errors.vr_body_type_id = 'Required'
  }

  if (isTouched.vr_req_contact_no && values.vr_req_contact_no.trim() == '') {
    errors.vr_req_contact_no = 'Required'
  } else if (isTouched.vr_req_contact_no && !/^[\d]{10}$/.test(values.vr_req_contact_no)) {
    errors.vr_req_contact_no = 'Only have 10 Digit Numeric '
  }

  //VR From Location Validation Rule
  if (isTouched.vr_from_location && values.vr_from_location.trim() == '') {
    errors.vr_from_location = 'Required'
  } else if (
    isTouched.vr_from_location &&
    !/^[^*|\":<>[\]{}`\\()';@&$#+!]+$/.test(values.vr_from_location)
  ) {
    errors.vr_from_location = 'Special Characters Not Allowed'
  }

  //VR To Location Validation Rule
  if (isTouched.vr_to_location && values.vr_to_location.trim() == '') {
    errors.vr_to_location = 'Required'
  } else if (
    isTouched.vr_to_location &&
    !/^[^*|\":<>[\]{}`\\()';@&$#+!]+$/.test(values.vr_to_location)
  ) {
    errors.vr_to_location = 'Special Characters Not Allowed'
  }

  //VR Requester Name Validation Rule
  if (isTouched.vr_requester && values.vr_requester.trim() == '') {
    errors.vr_requester = 'Required'
  } else if (isTouched.vr_requester && !/^[a-zA-Z ]+$/.test(values.vr_requester)) {
    errors.vr_requester = 'Only have Letters and space'
  }

  return errors
}
