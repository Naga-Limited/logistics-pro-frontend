
import React, { useEffect, useState } from 'react'
import Select from 'react-select'
import DefinitionsListApi from 'src/Service/Definitions/DefinitionsListApi'
import ReportService from 'src/Service/Report/ReportService'

const DocumentReportFilterComponent = ({
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

  const Docstatus = (id) => {
    if (id == 1) {
      return 'Create'
    } else if (id == 2) {
      return 'Reject'
    } else {
      return ''
    }
  }

  useEffect(() => {
    ReportService.getdocument_vehicle_data().then((res) => {
      setSRVehicle(res.data)
    })
}, [])


  if (search_type == 'vehicle_id') {
    let sp_vehicle_array = []
    search_data.map(({ vehicle_id, Parking_info }) => {
      if (sp_vehicle_array.indexOf(vehicle_id) === -1) {
        sp_vehicle_array.push(vehicle_id)
        option.push({ value: vehicle_id, label: Parking_info.vehicle_number })
      }
    })
  }else if (search_type == 'document_status') {
    let sp_ts_array = []
    search_data.map(({ document_id, document_status }) => {
      if (sp_ts_array.indexOf(document_status) === -1) {
        sp_ts_array.push(document_status)
        option.push({ value: document_status, label: Docstatus(document_status) })
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

export default DocumentReportFilterComponent
