export default function NLFSVehicleMasterValidation(values, isTouched) {
  const errors = {}

  //User Name validation rule
  if (isTouched.user_name && values.user_name === '') {
    errors.user_name = 'Required'
  } else if (isTouched.user_name && !/^[a-zA-Z ]+$/.test(values.user_name)) {
    errors.user_name = 'Only have Letters and Space'
  } else if (isTouched.user_name && values.user_name.length < 4) {
    errors.user_name = 'Minimum Length : 4'
  }

  //vehicle division validation rule
  if (isTouched.vehicle_division && values.vehicle_division === '0') {
    errors.vehicle_division = 'Required'
  }

  //vehicle plant validation rule
  if (isTouched.vehicle_plant && values.vehicle_plant === '0') {
    errors.vehicle_plant = 'Required'
  }

  //vehicle Number validation rule
  if (isTouched.vechile_number && !values.vechile_number) {
    errors.vechile_number = 'Required'
  } else if (
    isTouched.vechile_number &&
    !/^[A-Z]{2}[\d]{2}[A-Z]{1,2}[\d]{4}$/.test(values.vechile_number)
  ) {

    errors.vechile_number = 'Invalid Vehicle number '

  }

  //vehicle Capacity validation rule
  if (isTouched.vehicle_capacity && values.vehicle_capacity === '0') {
    errors.vehicle_capacity = 'Required'
  }

  //vehicle Model validation rule
  if (isTouched.vehicle_model && values.vehicle_model === '0') {
    errors.vehicle_model = 'Required'
  }

  //vehicle fueltype validation rule
  if (isTouched.vehicle_fueltype && values.vehicle_fueltype === '0') {
    errors.vehicle_fueltype = 'Required'
  }
  //vehicle variety validation rule
  if (isTouched.vehicle_variety && values.vehicle_variety === '0') {
    errors.vehicle_variety = 'Required'
  }

  //vehicle Fuel Tank Capacity validation rule
  if (isTouched.vehicle_fueltankcapacity && values.vehicle_fueltankcapacity === '0') {
    errors.vehicle_fueltankcapacity = 'Required'
  }  

  return errors
}
