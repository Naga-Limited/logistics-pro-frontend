export default function VehicleCapacitySubMasterValidation(values, isTouched) {
  const errors = {}

  //vehicle type validation rule
  if (isTouched.capacity && !values.capacity) {
    errors.capacity = 'Vehicle Capacity is required'
  } else if (isTouched.capacity && !/^[0-9]+$/.test(values.capacity)) {
    errors.capacity = 'Vehicle Capacity only have Number'
  }

  return errors
}
