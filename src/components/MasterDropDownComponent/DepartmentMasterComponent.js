
import React from 'react'
import Select from 'react-select'

const DepartmentMasterComponent = ({
  size,
  className,
  onChange,
  label,
  noOptionsMessage,
  search_type,
  search_data = []
}) => {
  const option = [{ value: '', label: 'Select' }]

  if (search_type == 'department') {
    let division_array = []
    search_data.map(({ department, id }) => {
      if (division_array.indexOf(id) === -1) {
        division_array.push(id)
        option.push({ value: id, label: department })
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

export default DepartmentMasterComponent
