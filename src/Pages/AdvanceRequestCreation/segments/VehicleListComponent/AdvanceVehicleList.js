
import React, { useEffect, useState } from 'react'
import Select from 'react-select'
import ReportService from 'src/Service/Report/ReportService'

const AdvanceVehicleSelectCompont = ({
  size,
  id,
  className,
  onChange,
  label,
  noOptionsMessage,
  search_type,
  search_data = [],
}) => {
  const option = [{ value: '', label: 'Select' }]

  const [srVehicle, setSRVehicle] = useState([])
  const [srTripSheet, setTripSheet] = useState([])

  useEffect(() => {
    ReportService.getadvance_vehicle_no().then((res) => {
      console.log(res.data)
      setSRVehicle(res.data)
    })
}, [])
useEffect(() => {
  ReportService.getadvance_tripsheet_no().then((res) => {
    console.log(res.data)
    setTripSheet(res.data)
  })
}, [])

if (search_type == 'vehicle_number') {
  let sp_vehicle_array = []
  search_data.map(({ vehicle_id ,parking_info }) => {
    if (sp_vehicle_array.indexOf(vehicle_id) === -1) {
      sp_vehicle_array.push(vehicle_id)
      option.push({ value: vehicle_id, label: parking_info?.vehicle_number })
    }
  })
}
  else if(search_type == 'trip_sheet_no') {
    srTripSheet.map(({id,trip_sheet_no})=>{
      option.push({value:trip_sheet_no,label:trip_sheet_no})
    })
  }

  return (
    <>
      <Select
        options={option}
        placeholder={label}
        noOptionsMessage={() => noOptionsMessage}
        size={size}
        className={className}
        onChange={(e) => onChange(e)}
      />
    </>
  )
}

export default AdvanceVehicleSelectCompont
