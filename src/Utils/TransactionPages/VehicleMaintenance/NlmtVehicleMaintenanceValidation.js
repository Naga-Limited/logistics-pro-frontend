export default function NlmtVehicleMaintenanceValidation(values, isTouched) {
  const errors = {}

  /* ---------------- COMMON ---------------- */
  if (isTouched.MaintenanceEnd && !values.MaintenanceEnd) {
    errors.MaintenanceEnd = 'Required'
  }

  /* ---------------- OUTSIDE ONLY ---------------- */
  if (values.maintenenceBy === 'outSide') {

    if (isTouched.driverId && !values.driverId) {
      errors.driverId = 'Required'
    }

    if (isTouched.maintenenceType && !values.maintenenceType) {
      errors.maintenenceType = 'Required'
    }

    if (isTouched.workOrder && !values.workOrder) {
      errors.workOrder = 'Required'
    }

    if (isTouched.MaintenanceStart && !values.MaintenanceStart) {
      errors.MaintenanceStart = 'Required'
    }

    if (
      isTouched.closingOdoKM &&
      (!values.closingOdoKM || !/^[\d]+$/.test(values.closingOdoKM))
    ) {
      errors.closingOdoKM = 'Allow only numeric'
    }

    if (
      isTouched.closing_odometer_photo &&
      !values.closing_odometer_photo
    ) {
      errors.closing_odometer_photo = 'Required'
    }
  }

  return errors
}
