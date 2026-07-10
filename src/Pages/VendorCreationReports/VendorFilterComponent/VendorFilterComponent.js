
import React, { useEffect, useState } from 'react'
import Select from 'react-select'
import DefinitionsListApi from 'src/Service/Definitions/DefinitionsListApi'
import ReportService from 'src/Service/Report/ReportService'

const VendorFilterComponent = ({
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

  const vendor_status_name = (id) => {
    if (id == 1) {
      return 'Available'
    }
    else if (id == 2) {
      return 'Created'
    } else if (id == 3) {
      return 'Approved'
    } else if (id == 4) {
      return 'Confirmed'
    }  else if (id == 5) {
      return 'Rejected'
    } else {
      return ''
    }
  }

  useEffect(() => {
    ReportService.getvendor_status().then((res) => {
      setSRVehicle(res.data)
    })
}, [])

  if (search_type == 'vendor_status') {
    let sp_array = []
    search_data.map(({ vendor_status, document_info }) => {
      if (sp_array.indexOf(vendor_status) === -1) {
        sp_array.push(vendor_status)
        option.push({ value: vendor_status, label: vendor_status_name(vendor_status) })
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

export default VendorFilterComponent
