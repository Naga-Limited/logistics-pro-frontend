import { CFormLabel, CFormSelect } from '@coreui/react'
import React, { useEffect, useState } from 'react'
//  import Select from 'react-select'
import DefinitionsListApi from 'src/Service/Definitions/DefinitionsListApi'
import { MultiSelect } from "react-multi-select-component";

const IncotermTypesListComponent= ({
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
  const [incotermtype, setIncotermTypes] = useState([])

  useEffect(() => {
    //fetch to get Location list form master
      /* section for getting Shipment Routes For Shipment Creation from database */
    DefinitionsListApi.visibleDefinitionsListByDefinition(16).then((response) => {
      console.log(response.data.data)
      let incoterm_list = response.data.data,
      formattedIncoterm_list = []
      if (incoterm_list.length > 0) {
        //console.log(vehicleTypesList);
        let filteredData = incoterm_list.filter((incoterm) => incoterm.definition_list_status == 1)
        //console.log(filteredData);
        filteredData.map((incotype) =>
        formattedIncoterm_list.push({
            value: incotype.definition_list_id,
            label: incotype.definition_list_name,
          })
        )
      }
      setIncotermTypes(formattedIncoterm_list)
    })

  }, [])


  return (
    <>
      <MultiSelect
        id={id}
        size={size}
        options={incotermtype}
       value={incotermtype.filter((currincoterm) => selectedValue.includes(currincoterm.value))}
       // value={incotermtype.filter((definition_list_id) => selectedValue.includes(definition_list_id.value))}
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

export default IncotermTypesListComponent
