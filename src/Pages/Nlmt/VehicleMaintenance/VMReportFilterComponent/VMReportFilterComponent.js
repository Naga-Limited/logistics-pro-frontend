
import React, { useEffect, useState } from 'react'
import Select from 'react-select'
import DefinitionsListApi from 'src/Service/Definitions/DefinitionsListApi'
import ReportService from 'src/Service/Report/ReportService'

const VMReportFilterComponent = ({
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
  const [maintenance_by, setMaintenance_by] = useState([])

  useEffect(() => {
    ReportService.getmaintenace_vehice_no().then((res) => {
      setSRVehicle(res.data)
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
}
  else if (search_type == 'vehicle_numbers') {
    srVehicle.map(({ id, vehicle_number }) => {
      option.push({ value: vehicle_number, label: vehicle_number})
    })
  }
else if(search_type == 'vehicle_maintenance_status') {
  maintenance_by.map(({id,maintenance_by})=>{
    option.push({value:maintenance_by,label:maintenance_by
  })
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

export default VMReportFilterComponent
