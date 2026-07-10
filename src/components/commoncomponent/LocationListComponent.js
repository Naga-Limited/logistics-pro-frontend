import { CFormLabel, CFormSelect } from '@coreui/react'
import React, { useEffect, useState } from 'react'
import Select from 'react-select'
import LocationApi from 'src/Service/SubMaster/LocationApi'
import { MultiSelect } from "react-multi-select-component";

const LocationListComponent = ({
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
  const [location, setLocation] = useState([])

  function inArray(needle, haystack) {
    var length = haystack.length
    for (var i = 0; i < length; i++) {
      if (haystack[i] == needle) return true
    }
    return false
  }

  useEffect(() => {
    //fetch to get Location list form master
    LocationApi.getLocation().then((res) => {
      let locationList = res.data.data,
        formattedLocationList = []
      if (locationList.length > 0) {
        let filteredData = locationList.filter((location) => location.location_status === 1)
        filteredData.map((locaton) =>
          formattedLocationList.push({
            value: locaton.id,
            label: `${locaton.location} - ${locaton.location_code}`,
          })
        )
      }
      setLocation(formattedLocationList)
    })
  }, [])

  return (
    <>
      <MultiSelect
        id={id}
        size={size}
        options={location}
        // value={location.filter((currlocation) => selectedValue.includes(currlocation.value))}
        value={location.filter((currlocation) => inArray(currlocation.value,selectedValue))}
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

export default LocationListComponent
