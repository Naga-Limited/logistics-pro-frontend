
import React, { useEffect, useState } from 'react'
import Select from 'react-select'
import DefinitionsListApi from 'src/Service/Definitions/DefinitionsListApi'
import NlmtReportService from 'src/Service/Nlmt/Report/NlmtReportService'

const NlmtTripSheetFilterComponent = ({
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

  // const ACTION = {
  //   DI_CREATED: 1,
  //   DI_CONFIRMED: 2,
  //   DI_APPROVAL: 3,
  // }
  useEffect(() => {
    NlmtReportService.gettripsheet_vehicle_no().then((res) => {
      setSRVehicle(res.data)
    })
}, [])
useEffect(() => {
  NlmtReportService.getdiesel_tripsheet_no().then((res) => {
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

 if (search_type == 'nlmt_vehicle_number') {
      let sp_vehicle_array = []
      console.log(search_data,'vehicle_number-search_data')
      search_data.map(({ vehicle_id, trip_vehicle_info }) => {
        if (sp_vehicle_array.indexOf(trip_vehicle_info.vehicle_number) === -1) {
          sp_vehicle_array.push(trip_vehicle_info.vehicle_number)
          option.push({ value: vehicle_id, label: trip_vehicle_info.vehicle_number })
        }
      })
    }
  else if(search_type == 'trip_sheet_no') {
    srTripSheet.map(({id,trip_sheet_no})=>{
      option.push({value:trip_sheet_no,label:trip_sheet_no})
    })
  }
  else if(search_type == 'status') {
    tripStatus.map(({definition_list_code,definition_list_name})=>{
      option.push({value:definition_list_code,label:definition_list_name
    })
  })
}
else if(search_type == 'to_divison') {
  to_divison.map(({definition_list_code,definition_list_name})=>{
    option.push({value:definition_list_code,label:definition_list_name
  })
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

export default NlmtTripSheetFilterComponent
