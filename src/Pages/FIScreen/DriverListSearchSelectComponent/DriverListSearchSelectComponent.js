import { CFormLabel, CFormSelect } from '@coreui/react'
import React, { useEffect, useState } from 'react'
import ParkingYardGateService from 'src/Service/ParkingYardGate/ParkingYardGateService'
import Select from 'react-select'
import DriverMasterService from 'src/Service/Master/DriverMasterService'

const DriverListSearchSelectComponent = (
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
    DriverMasterService.getDrivers().then((res) => {
      let tableData
      tableData = res.data.data
      const filterData = tableData.filter(
        (data) =>
          (data.driver_status == 1)
      )
      setDriver(filterData)
      console.log(filterData)
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


export default DriverListSearchSelectComponent
