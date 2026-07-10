
import React, { useEffect, useState } from 'react'
import Select from 'react-select'
import ReportService from 'src/Service/Report/ReportService'

const RjSoOsReceivableFilterComp = ({
  size,
  id,
  className,
  onChange,
  label,
  noOptionsMessage,
  search_type,
}) => {
  const option = [{ value: '', label: 'Select' }]

  const [rjOsVehicle, setRJOSVehicle] = useState([])
  const [rjOsShedName, setRJOSShedName] = useState([])


  useEffect(() => {
    ReportService.getRjSoOsReceivableVehicleNo().then((res) => {
      console.log(res);
      setRJOSVehicle(res.data)
    })
  }, [])
  useEffect(() => {
    ReportService.getRjSoOsReceivableShedName().then((res) => {
      console.log(res);
      setRJOSShedName(res.data)
    })
  }, [])


  if (search_type == 'rj_os_vehicle_number') {
    rjOsVehicle.map(({ vehicle_id, vehicle_number }) => {
      option.push({ value: vehicle_id, label: vehicle_number})
    })
  }
  else if(search_type == 'rj_os_shed_name') {
    rjOsShedName.map(({shed_id,shed_name})=>{
      option.push({value:shed_id,label:shed_name})
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

export default RjSoOsReceivableFilterComp
