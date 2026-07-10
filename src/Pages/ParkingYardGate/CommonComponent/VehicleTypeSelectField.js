import { CFormSelect } from '@coreui/react'
import React, { useEffect, useState } from 'react'
import VehicleBodyTypeService from 'src/Service/SmallMaster/Vehicles/VehicleBodyTypeService'

const VehicleTypeSelectField = ({ onFocus, onBlur, handleChange }) => {
  const [vehicleBody, setVehicleBody] = useState([])

  useEffect(() => {
    VehicleBodyTypeService.getVehicleBody().then((res) => {
      setVehicleBody(res.data.data)
    })
  }, [])

  return (
    <>
      <CFormSelect
        size="sm"
        name="vehicleBody"
        className=""
        onFocus={onFocus}
        onBlur={onBlur}
        onChange={handleChange}
        aria-label="Small select example"
      >
        <option value="">Select...</option>
        {vehicleBody.map(({ id, body_type }) => {
          return (
            <>
              <option key={id} value={id}>
                {body_type}
              </option>
            </>
          )
        })}
      </CFormSelect>
    </>
  )
}

export default VehicleTypeSelectField
