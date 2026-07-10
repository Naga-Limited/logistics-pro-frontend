export default function HireCreateTripSheetRequest(values,remarks) {
  let data = new FormData()
  data.append('vehicle_id', values.vehicle_id)
  data.append('parking_id', values.parking_id)
  data.append('vehicle_type_id', values.vehicle_type_id)
  data.append('vehicle_location_id', values.vehicle_location_id)
  data.append('driver_id', values.driver_id)
  data.append('division_id', values.division_id)
  data.append('trip_advance_eligiblity', values.trip_advance_eligiblity)
  data.append('advance_amount', values.advance_amount)
  data.append('purpose', values.purpose)
  data.append('vehicle_sourced_by', values.Vehicle_Sourced_by)
  data.append('expected_date_time', values.expected_date_time)
  data.append('expected_return_date_time', values.expected_return_date_time)
  data.append('freight_rate_per_tone', values.freight_rate_per_tone || 0)
  data.append('advance_payment_diesel', values.advance_payment_diesel)
  data.append('remarks', remarks ? remarks : '')
  return data
}
