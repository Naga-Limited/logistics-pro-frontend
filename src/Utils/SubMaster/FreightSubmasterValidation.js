export default function FreightSubmasterValidation(values, isTouched) {
  const errors = {}

  //customer_name validation rule
  if (isTouched.customer_name && !values.customer_name) {
    errors.customer_name = 'Required'
  }
  //customer_code validation rule
  if (isTouched.customer_code && !values.customer_code) {
    errors.customer_code = 'Required & Numeric'
  } else if (isTouched.customer_code && !/^[0-9]*$/.test(values.customer_code)) {
    errors.customer_code = 'Not Valid'
  }

  //supply_plant validation rule
  if (isTouched.supply_plant && !values.supply_plant) {
    errors.supply_plant = 'Required'
  } else if (isTouched.supply_plant && !/^[0-9]*$/.test(values.supply_plant)) {
    errors.supply_plant = 'Not Valid'
  }

  //FreightRate validation rule
  if (isTouched.freight_rate && !values.freight_rate) {
    errors.freight_rate = 'Required'
  } else if (isTouched.freight_rate && !/^[0-9]*$/.test(values.freight_rate)) {
    errors.freight_rate = 'Not Valid'
  }

  if (isTouched.customer_type && !values.customer_type) {
    errors.customer_type = 'Required'
  }

 //Date validation rule

  if (isTouched.start_date && !values.start_date) {
    errors.start_date = 'Required'
  }

  return errors
}


