import { CFormLabel, CFormSelect } from '@coreui/react'
import React, { useEffect, useState } from 'react'
import Select from 'react-select'
import VehicleTypesApi from 'src/Service/SubMaster/VehicleTypesApi'
import { MultiSelect } from "react-multi-select-component";

const VehicleTypesListComponent = ({
  size,
  name,
  id,
  onFocus,
  onBlur,
  onChange,
  selectedValue,
  isMultiple,
  className,
  label,
  noOptionsMessage,
}) => {
  const [vehicletypes, setVehicletypes] = useState([])

  useEffect(() => {
    //fetch to get Location list form master
    VehicleTypesApi.getVehicleTypes().then((res) => {
      let vehicleTypesList = res.data.data,
        formattedVehicleTypesList = []
      if (vehicleTypesList.length > 0) {
        //console.log(vehicleTypesList);
        let filteredData = vehicleTypesList.filter((vehicletypes) => vehicletypes.vehicle_type_status == 1)
        //console.log(filteredData);
        filteredData.map((vtype) =>
        formattedVehicleTypesList.push({
            value: vtype.id,
            label: vtype.type,
          })
        )
        //console.log(formattedVehicleTypesList);
      }
      setVehicletypes(formattedVehicleTypesList)
    })
  }, [])

  return (
    <>
      <MultiSelect
        id={id}
        size={size}
        options={vehicletypes}
        value={vehicletypes.filter((currvehicletype) => selectedValue.includes(currvehicletype.value))}
        name={name}
        className={className}
        isMulti={isMultiple}
        onFocus={onFocus}
        onBlur={onBlur}
        onChange={(e) => onChange(e, name)}
        placeholder={label}
        noOptionsMessage={() => noOptionsMessage}
      />
    </>
  )
}

export default VehicleTypesListComponent
