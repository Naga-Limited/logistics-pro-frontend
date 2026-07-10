

// const BdcUploadValidation = (values, isTouched) => {
export default function BdcUploadValidation(values, isTouched, eVehicles) {

  const errors = {}

  const checkRakeVehicle = (v_no) => {
    let v_no_valid = 0
    eVehicles.map((datan, indexn)=>{
      if(datan == v_no){
        v_no_valid = 1
      }
    })

    if(v_no_valid == 1){
      return true
    } else {
      return false
    }
  }

  //Rake Plant Validation Rule
  if (isTouched.rake_plant1 && values.rake_plant1 === '') {
    errors.rake_plant1 = 'Required'
  }

  //Vendor Code Validation Rule
  if (isTouched.vendor_code1 && values.vendor_code1 === '') {
    errors.vendor_code1 = 'Required'
  }

  //Driver Mobile Number 1 Validation Rule
  if (isTouched.driver_number1 && !values.driver_number1) {
    errors.driver_number1 = 'Required'
  } else if (isTouched.driver_number1 && !/^[\d]{10}$/.test(values.driver_number1)) {
    errors.driver_number1 = 'Only have 10 Digit Numeric'
  }

  //vehicle Number validation rule
  if (isTouched.vehicle_no1 && !values.vehicle_no1) {
    errors.vehicle_no1 = 'Required'
  } else if(!checkRakeVehicle(values.vehicle_no1) && (values.vehicle_no1 == '' || values.vehicle_no1.length < 9 || values.vehicle_no1 > 10 || !(values.vehicle_no1.match(/^[A-Z]{2}[0-9]{2}[A-Z]{1,2}[0-9]{4}$/)))){
    errors.vehicle_no1 = 'Invalid Vehicle No'
  }

   //Driver Name Validation Rule
   if (isTouched.driver_name1 && !values.driver_name1) {
    errors.driver_name1 = 'Required'
  } else if (isTouched.driver_name1 && !/^[a-zA-Z ]+$/.test(values.driver_name1)) {
    errors.driver_name1 = 'Only have Letters and Space'
  }

  //FNR Number 1 Validation Rule
  if (isTouched.fnr_no1 && !values.fnr_no1) {
    errors.fnr_no1 = 'Required'
  } else if(values.fnr_no1.length < 11 || values.fnr_no1.length > 12 ) {
    errors.fnr_no1 = 'Invalid FNR No'
  }

  return errors

}


// export default BdcUploadValidation;
