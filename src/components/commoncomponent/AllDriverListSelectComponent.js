import { CFormLabel, CFormSelect } from '@coreui/react'
import React, { useEffect, useState } from 'react'
import ParkingYardGateService from 'src/Service/ParkingYardGate/ParkingYardGateService'

const AllDriverListSelectComponent = () => {
  const [driver, setDriver] = useState([])

  useEffect(() => {
    //fetch to get Drivers list form master
    ParkingYardGateService.getAllDrivers().then((res) => {
      setDriver(res.data.data)
    })
  }, [])

  return (
    <>
        <option  value={''}>Select...</option>
        {driver.map(({ driver_id, driver_name }) => {
          return (
            <>
              <option key={driver_id} value={driver_id}>
                {driver_name}
              </option>
            </>
          )
        })}

    </>
  )
}

export default AllDriverListSelectComponent
