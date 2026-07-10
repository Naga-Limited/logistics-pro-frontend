
import React, { useEffect, useState } from 'react'
import Select from 'react-select'
import NlmtReportService from 'src/Service/Nlmt/Report/NlmtReportService'
import ReportService from 'src/Service/Report/ReportService'

const NlmtAdvanceVehicleSelectCompont = ({
  size,
  id,
  className,
  onChange,
  label,
  noOptionsMessage,
  search_type,
  search_data = [],
  vehicleType,
}) => {
  const option = [{ value: '', label: 'Select' }]

  const [srVehicle, setSRVehicle] = useState([])
  const [srTripSheet, setTripSheet] = useState([])

  useEffect(() => {
    NlmtReportService.getadvance_vehicle_no().then((res) => {
      console.log(res.data)
      setSRVehicle(res.data)
    })
}, [])
useEffect(() => {
  NlmtReportService.getadvance_tripsheet_no().then((res) => {
    console.log(res.data)
    setTripSheet(res.data)
  })
}, [])

  if (search_type == 'vehicle_number') {
    let sp_vehicle_array = []
    search_data.map((row) => {
      const vId = row.vehicle_id
      const vNum = row.parking_info?.vehicle_info?.vehicle_number || row.NlmtVehicleInfo?.vehicle_number
      const vType = row.parking_info?.vehicle_info?.vehicle_type_id || row.NlmtVehicleInfo?.vehicle_type_id
      if (vehicleType && Number(vType) !== Number(vehicleType)) {
        return
      }
      if (vId && vNum && sp_vehicle_array.indexOf(vId) === -1) {
        sp_vehicle_array.push(vId)
        option.push({ value: vId, label: vNum })
      }
    })
  }
  else if(search_type == 'trip_sheet_no') {
    let sp_tripsheet_array = []
    search_data.map((row) => {
      const tsNum = row.parking_info?.tripsheet_info?.nlmt_tripsheet_no || row.NlmtTripsheetInfo?.nlmt_tripsheet_no || row.NlmtTripsheetInfo?.trip_sheet_no
      const vType = row.parking_info?.vehicle_info?.vehicle_type_id || row.NlmtVehicleInfo?.vehicle_type_id
      if (vehicleType && Number(vType) !== Number(vehicleType)) {
        return
      }
      if (tsNum && tsNum !== '-' && sp_tripsheet_array.indexOf(tsNum) === -1) {
        sp_tripsheet_array.push(tsNum)
        option.push({ value: tsNum, label: tsNum })
      }
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

export default NlmtAdvanceVehicleSelectCompont
