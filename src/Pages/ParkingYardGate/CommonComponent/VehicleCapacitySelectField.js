import { CFormSelect } from '@coreui/react'
import React, { useEffect, useState } from 'react'
import VehicleCapacityService from 'src/Service/SmallMaster/Vehicles/VehicleCapacityService'

const VehicleCapacitySelectField = ({ onFocus, onBlur, handleChange }) => {
  const [vehicleCapacity, setVehicleCapacity] = useState([])

  useEffect(() => {
    // section for getting vehicle capacity from database
    VehicleCapacityService.getVehicleCapacity().then((res) => {
      setVehicleCapacity(res.data.data)
    })
  }, [])

  return (
    <>
      <CFormSelect
        size="sm"
        name="vehicleCapacity"
        className=""
        onFocus={onFocus}
        onBlur={onBlur}
        onChange={handleChange}
        aria-label="Small select example"
      >
        <option value="" hidden selected>
          Select...
        </option>
        {vehicleCapacity.map(({ id, capacity }) => {
          return (
            <>
              <option key={id} value={id}>
                {/* {capacity+"-TON"} */}
                {capacity}
              </option>
            </>
          )
        })}
      </CFormSelect>
    </>
  )
}

export default VehicleCapacitySelectField
