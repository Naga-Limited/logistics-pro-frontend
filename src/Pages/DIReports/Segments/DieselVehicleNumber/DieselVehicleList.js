
import React, { useEffect, useState } from 'react'
import Select from 'react-select'
import DefinitionsListApi from 'src/Service/Definitions/DefinitionsListApi'
import ReportService from 'src/Service/Report/ReportService'

const DieselSelectComponent = ({
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
  const [dieselStatus, setDieselStatus] = useState([])

  const Diesel_Status = (id) => {
    if (id == 1) {
      return 'Created'
    } else if (id == 2) {
      return 'Confirmed'
    }
    if (id == 3) {
      return 'Approved'
    } else {
      return ''
    }
  }

  useEffect(() => {
    ReportService.getdiesel_vehicle_no().then((res) => {
      setSRVehicle(res.data)
    })
}, [])
useEffect(() => {
  ReportService.getdiesel_tripsheet_no().then((res) => {
    setTripSheet(res.data)
  })
}, [])
// useEffect(() => {
//   ReportService.getdiesel_status().then((res) => {
//     console.log(res.data)
//     setDieselStatus(res.data)
//   })
// }, [])
useEffect(() => {
DefinitionsListApi.visibleDefinitionsListByDefinition(9).then((response) => {
  setDieselStatus(response.data.data)
})
}, [])
if (search_type == 'vehicle_number') {
  let sp_vehicle_array = []
  search_data.map(({ vehicle_id, vehicle_number,parking_info }) => {
    if (sp_vehicle_array.indexOf(vehicle_id) === -1) {
      sp_vehicle_array.push(vehicle_id)
      option.push({ value: vehicle_id, label: parking_info?.vehicle_number })
    }
  })
} else if (search_type == 'trip_sheet_no') {
    let sp_vehicle_array = []
    search_data.map(({ tripsheet_id, trip_sheet_no,parking_info }) => {
      if (sp_vehicle_array.indexOf(tripsheet_id) === -1) {
        sp_vehicle_array.push(tripsheet_id)
        option.push({ value: tripsheet_id, label: parking_info?.trip_sheet_info?.trip_sheet_no })
      }
    })
  }else if (search_type == 'diesel_status') {
    let sp_vehicle_array = []
    search_data.map(({ id, diesel_status }) => {
      if (sp_vehicle_array.indexOf(diesel_status) === -1) {
        sp_vehicle_array.push(diesel_status)
        option.push({ value: diesel_status, label: Diesel_Status(diesel_status) })
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

export default DieselSelectComponent
