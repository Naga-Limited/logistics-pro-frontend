import { CFormLabel, CFormSelect } from '@coreui/react'
import React, { useEffect, useState } from 'react'
import ParkingYardGateService from 'src/Service/ParkingYardGate/ParkingYardGateService'
import Select from 'react-select'

const DriverListSearchSelect = (
  {
    size,
  id,
  className,
  onChange,
  label,
  noOptionsMessage,
  search_type,
  }
) => {
  const option = [{ value: '', label: 'Select' }]

  const [driver, setDriver] = useState([])

  useEffect(() => {
    //fetch to get Drivers list form master
    ParkingYardGateService.getDrivers().then((res) => {
      setDriver(res.data.data)
      console.log(res.data.data)
    })
  }, [])
  
  if (search_type == 'driver_name') {
    driver.map(({ driver_id, driver_name,driver_code }) => {
      option.push({ value: driver_id, label: driver_name+' - '+driver_code})
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


export default DriverListSearchSelect
