
import React, { useEffect, useState } from 'react'
import Select from 'react-select'
import DefinitionsListApi from 'src/Service/Definitions/DefinitionsListApi'
import ReportService from 'src/Service/Report/ReportService'

const VIReportFilterComponent = ({
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
  const [previous_load, setPrevious_load] = useState([])


  const VIstatus = (id) => {
    if (id == 1) {
      return 'Create'
    } else if (id == 2) {
      return 'Reject'
    } else {
      return ''
    }
  }

  useEffect(() => {
    ReportService.getinspection_vehicle_no().then((res) => {
      setSRVehicle(res.data)
    })
}, [])
useEffect(() => {
  ReportService.getinspection_previous_load().then((res) => {
    setPrevious_load(res.data)
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
} else if (search_type == 'vehicle_inspection_status') {
    let sp_vehicle_array = []
    search_data.map(({ id, vehicle_inspection_status }) => {
      if (sp_vehicle_array.indexOf(vehicle_inspection_status) === -1) {
        sp_vehicle_array.push(vehicle_inspection_status)
        option.push({ value: vehicle_inspection_status, label: VIstatus(vehicle_inspection_status) })
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

export default VIReportFilterComponent
