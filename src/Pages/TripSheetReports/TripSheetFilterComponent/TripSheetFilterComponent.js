
import React, { useEffect, useState } from 'react'
import Select from 'react-select'
import DefinitionsListApi from 'src/Service/Definitions/DefinitionsListApi'
import ReportService from 'src/Service/Report/ReportService'

const TripSheetFilterComponent = ({
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
  const [tripStatus, setTripStatus] = useState([])
  const [to_divison, setTo_divison] = useState([])
  const [purpose, setPurpose] = useState([])

  const TripStatus = (id) => {
   if(id == 1) {
      return 'TS Create'
    } else if (id == 2) {
      return 'TS Closed'
    } else if(id == 3) {
      return 'TS Assigned'
    }
  }

  useEffect(() => {
    ReportService.gettripsheet_vehicle_no().then((res) => {
      setSRVehicle(res.data)
    })
}, [])
useEffect(() => {
  ReportService.getdiesel_tripsheet_no().then((res) => {
    setTripSheet(res.data)
  })
}, [])

  useEffect(() => {
  DefinitionsListApi.visibleDefinitionsListByDefinition(12).then((response) => {
    setTripStatus(response.data.data)
  })
  }, [])
  useEffect(() => {
    DefinitionsListApi.visibleDefinitionsListByDefinition(10).then((response) => {
      setTo_divison(response.data.data)
    })
    }, [])
  useEffect(() => {
    DefinitionsListApi.visibleDefinitionsListByDefinition(11).then((response) => {
      setPurpose(response.data.data)
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
  else if(search_type == 'trip_sheet_no') {
    srTripSheet.map(({id,trip_sheet_no})=>{
      option.push({value:trip_sheet_no,label:trip_sheet_no})
    })
  }
  else if(search_type == 'status') {
    let sp_vehicle_array = []
      search_data.map(({ id, tripsheet_open_status }) => {
        if (sp_vehicle_array.indexOf(tripsheet_open_status) === -1) {
          sp_vehicle_array.push(tripsheet_open_status)
          option.push({ value: tripsheet_open_status, label: TripStatus(tripsheet_open_status) })
        }
   })
 }
else if(search_type == 'to_divison') {
  let sp_vehicle_array = []
      search_data.map(({ id, to_divison }) => {
        if (sp_vehicle_array.indexOf(to_divison) === -1) {
          sp_vehicle_array.push(to_divison)
          option.push({ value: to_divison, label: to_divison })
        }
   })
}
else if(search_type == 'purpose') {
  purpose.map(({definition_list_code,definition_list_name})=>{
    option.push({value:definition_list_code,label:definition_list_name
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

export default TripSheetFilterComponent
