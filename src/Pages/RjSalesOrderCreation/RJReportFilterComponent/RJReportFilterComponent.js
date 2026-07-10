
import React, { useEffect, useState } from 'react'
import Select from 'react-select'
import DefinitionsListApi from 'src/Service/Definitions/DefinitionsListApi'
import ReportService from 'src/Service/Report/ReportService'

const RJReportFilterComponent = ({
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
  const [maintenance_by, setMaintenance_by] = useState([])

  useEffect(() => {
    ReportService.getrj_vehice_no().then((res) => {
      setSRVehicle(res.data)
    })
}, [])

useEffect(() => {
  ReportService. gettripsheet_vehicle_no().then((res) => {
    setTripSheet(res.data)
  })
}, [])


useEffect(() => {
  ReportService.getmaintenace_by().then((res) => {
    setMaintenance_by(res.data)
  })
}, [])

if (search_type == 'vehicle_number') {
  let sp_vehicle_array = []
  search_data.map(({ vehicle_id, vehicle_number }) => {
    if (sp_vehicle_array.indexOf(vehicle_number) === -1) {
      sp_vehicle_array.push(vehicle_number)
      option.push({ value: vehicle_number, label: vehicle_number })
    }
  })
} else if (search_type == 'trip_sheet_no') {
    let sp_vehicle_array = []
    search_data.map(({ id, trip_sheet_no }) => {
      if (sp_vehicle_array.indexOf(trip_sheet_no) === -1) {
        sp_vehicle_array.push(trip_sheet_no)
        option.push({ value: trip_sheet_no, label: trip_sheet_no })
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

export default RJReportFilterComponent
