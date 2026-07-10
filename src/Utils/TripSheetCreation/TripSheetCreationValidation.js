export default function TripSheetCreationValidation(values, isTouched) {
  const errors = {}

  //trip_advance_eligiblity validation rule
  if (isTouched.trip_advance_eligiblity && !values.trip_advance_eligiblity) {
    errors.trip_advance_eligiblity = ' Choose Yes or No'
  }

  //FCI Plant Name Validation Rule
  if (isTouched.plantName && values.plantName == '0') {
    errors.plantName = 'Required'
  }

  //advance_amount validation rule this runs on only the trip_eligibility is yes
  if (isTouched.trip_advance_eligiblity && values.trip_advance_eligiblity == 1) {
    if (isTouched.advance_amount && !values.advance_amount) {
      errors.advance_amount = ' Number Only'
    } else if (isTouched.advance_amount && values.advance_amount.length > 6) {
      errors.advance_amount = ' Only 6 digits'
    }
  }

  //division_id validation rule
  if (isTouched.division_id && !values.division_id) {
    errors.division_id = ' Choose the Divison'
  }

  //purpose validation rule
  if (isTouched.purpose && !values.purpose) {
    errors.purpose = ' Choose the Purpose'
  }

  //purpose validation only if STO Choosed validation rule
  if (isTouched.purpose && values.purpose == 2) {
    //Vehicle_Sourced_by validation rule
    if (isTouched.Vehicle_Sourced_by && !values.Vehicle_Sourced_by) {
      errors.Vehicle_Sourced_by = ' Required Sourced by'
    }
  }

  //expected_date_time validation rule
  if (isTouched.expected_date_time && !values.expected_date_time) {
    errors.expected_date_time = ' Required'
  }

   //vehicle_request_no validation rule
   if (isTouched.vehicle_request_no && values.vehicle_request_no.length === 0) {
    errors.vehicle_request_no = ' Required'
  }

  //vehicle_type_id validation rule
  if (values.vehicle_type_id == 3) {
    //freight_rate_per_tone validation rule
    if (isTouched.freight_rate_per_tone && !values.freight_rate_per_tone) {
      errors.freight_rate_per_tone = ' Only Numeric'
    } else if (isTouched.freight_rate_per_tone && values.freight_rate_per_tone.length > 6) {
      errors.freight_rate_per_tone = ' Only 6 digits'
    }

    //advance_payment_diesel validation rule
    if (isTouched.advance_payment_diesel && !values.advance_payment_diesel) {
      errors.advance_payment_diesel = ' Only Numeric'
    } else if (isTouched.advance_payment_diesel && values.advance_payment_diesel.length > 6) {
      errors.advance_payment_diesel = ' Only 6 digits'
    }
  } else {
    //expected_return_date_time validation rule
    if (isTouched.expected_return_date_time && !values.expected_return_date_time) {
      errors.expected_return_date_time = ' Required'
    }
  }

  return errors
}
