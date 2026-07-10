export default function OwnAndContractCreateTripSheetRequest(values,remarks) {
  let data = new FormData()

  data.append('vehicle_id', values.vehicle_id)
  data.append('parking_id', values.parking_id)
  data.append('vehicle_location_id', values.vehicle_location_id)
  data.append('vehicle_type_id', values.vehicle_type_id)
  data.append('driver_id', values.driver_id)
  data.append('division_id', values.division_id)
  data.append('trip_advance_eligiblity', values.trip_advance_eligiblity)
  data.append('advance_amount', values.advance_amount)
  data.append('purpose', values.purpose ? values.purpose : '3')
  if (values.purpose == '2') {
    data.append('vehicle_sourced_by', values.Vehicle_Sourced_by)
  }
  if (values.purpose == '3') {
    data.append('rmsto_type', values.rmsto_type)
  }  
  if (values.purpose == '4') {
    // data.append('others_division', values.others_division)
    // data.append('others_department', values.others_department)
    // data.append('others_process', values.others_process)
    data.append('first_vr_id', values.vehicle_request_no[0])
    data.append('vehicle_request_no', values.vehicle_request_no)
  }
  if (values.purpose == '5') {
    data.append('others_division', values.plantName)
  }
  data.append('expected_date_time', values.expected_date_time)
  data.append('expected_return_date_time', values.expected_return_date_time)
  data.append('remarks', remarks ? remarks : '')
  return data
}
