
import React from 'react'
import Select from 'react-select' 
const VUFilterComponent = ({
  size,
  id,
  className,
  onChange,
  label,
  noOptionsMessage,
  search_type,
  search_data = [],
}) => {
  const option = [{ value: '', label: 'Select' }]

  if (search_type == 'vehicle_number') {
    let sp_vehicle_array = []
    search_data.map(({ vehicle_id, vehicle_number }) => {
      if (sp_vehicle_array.indexOf(vehicle_number) === -1) {
        sp_vehicle_array.push(vehicle_number)
        option.push({ value: vehicle_number, label: vehicle_number })
      }
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

export default VUFilterComponent
