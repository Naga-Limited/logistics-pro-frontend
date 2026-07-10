
import React, { useEffect, useState } from 'react'
import Select from 'react-select'
import DefinitionsListApi from 'src/Service/Definitions/DefinitionsListApi'
import ReportService from 'src/Service/Report/ReportService'

const NlfsDieselSelectComponent = ({
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

  const FuelFor = ['','Vehicle','Barel','Others','Car']

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

  useEffect(() => {
    DefinitionsListApi.visibleDefinitionsListByDefinition(9).then((response) => {
      setDieselStatus(response.data.data)
    })
  }, [])

  console.log(search_data,'search_data')

  if (search_type == 'vehicle_number') {
    let sp_vehicle_array = []
    search_data.map(({ vehicle_id, vehicle_info }) => {
      if (sp_vehicle_array.indexOf(vehicle_id) === -1) {
        sp_vehicle_array.push(vehicle_id)
        option.push({ value: vehicle_id, label: vehicle_id == 0 ? '-' : vehicle_info.vehicle_no })
      }
    })
  } else if (search_type == 'fuel_for') {
    let sp_vehicle_array = []
    search_data.map(({ diesel_to }) => {
      if (sp_vehicle_array.indexOf(diesel_to) === -1) {
        sp_vehicle_array.push(diesel_to)
        option.push({ value: diesel_to, label: FuelFor[diesel_to] })
      }
    })
  }else if (search_type == 'trip_sheet_no') {
    let sp_vehicle_array = []
    search_data.map(({ id, di_no }) => {
      if (sp_vehicle_array.indexOf(id) === -1) {
        sp_vehicle_array.push(id)
        option.push({ value: id, label: di_no })
      }
    })
  }else if (search_type == 'diesel_status') {
    let sp_vehicle_array = []
    search_data.map(({ status }) => {
      if (sp_vehicle_array.indexOf(status) === -1) {
        sp_vehicle_array.push(status)
        option.push({ value: status, label: Diesel_Status(status) })
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

export default NlfsDieselSelectComponent
