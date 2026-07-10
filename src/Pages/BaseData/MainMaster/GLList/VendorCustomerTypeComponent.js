import { CFormLabel, CFormSelect } from '@coreui/react'
import React, { useEffect, useState } from 'react'
import Select from 'react-select'
import DefinitionsListApi from 'src/Service/Definitions/DefinitionsListApi'
import { MultiSelect } from "react-multi-select-component";

const VendorCustomerTypeComponent= ({
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
  search_type
}) => {
  const [gltype, setgltype] = useState([])

  useEffect(() => {
    //fetch to get Location list form master
      /* section for getting Shipment Routes For Shipment Creation from database */
    DefinitionsListApi.visibleDefinitionsListByDefinition(18).then((response) => {
      console.log(response.data.data)
      let gltype_list = response.data.data,
      formattedgltype_list = []
      if (gltype_list.length > 0) {
        //console.log(vehicleTypesList);
        let filteredData = gltype_list.filter((gltype) => gltype.definition_list_status == 1)
        //console.log(filteredData);
        filteredData.map((gltype) =>
        formattedgltype_list.push({
            value: gltype.definition_list_code,
            label: gltype.definition_list_name,
          })
        )
      }
      setgltype(formattedgltype_list)
    })

  }, [])


  return (
    <>
      <MultiSelect
        id={id}
        size={size}
        options={gltype}
        value={gltype.filter((currgl_type) => selectedValue.includes(currgl_type.value))}
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

export default VendorCustomerTypeComponent
