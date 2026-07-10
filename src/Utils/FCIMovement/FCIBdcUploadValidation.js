export default function FCIBdcUploadValidation(values, isTouched, eVehicles) {

  const errors = {}

  const checkFCIVehicle = (v_no) => {
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

  //FCI Plant Validation Rule
  if (isTouched.fci_plant1 && values.fci_plant1 == '') {
    errors.fci_plant1 = 'Required'
  }

  //vehicle Number validation rule
  if (isTouched.vehicle_no1 && !values.vehicle_no1) {
    errors.vehicle_no1 = 'Required'
  } else if(!checkFCIVehicle(values.vehicle_no1) && (values.vehicle_no1 == '' || values.vehicle_no1.length < 9 || values.vehicle_no1 > 10 || !(values.vehicle_no1.match(/^[A-Z]{2}[0-9]{2}[A-Z]{1,2}[0-9]{4}$/)))){
    errors.vehicle_no1 = 'Invalid Vehicle No'
  }

  //FNR Number 1 Validation Rule
  if (isTouched.po_no1 && !values.po_no1) {
    errors.po_no1 = 'Required'
  } else if (!(/^-?\d+$/.test(values.po_no1))){
    errors.po_no1 = 'Invalid PO Number'
  } else if(values.po_no1.length < 10 || values.po_no1.length > 11 ) {
    errors.po_no1 = 'PO Number should be 10 or 11 Digit Numeric'
  } 

  return errors
  
} 
      