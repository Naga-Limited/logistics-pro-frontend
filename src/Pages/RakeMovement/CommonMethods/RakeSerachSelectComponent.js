import React from 'react'
import Select from 'react-select'   
const RakeSerachSelectComponent = ({
    size, 
    className,
    onChange,
    label,
    noOptionsMessage,
    search_type,
    search_data = [],
    date_needed = {}, 
    isMultiple
}) => {
  const option = [{ value: '', label: 'Select' }]

  console.log(search_data,'DTSearchSelectComponent-search_data')
  console.log(search_type,'DTSearchSelectComponent-search_type')
  console.log(date_needed,'DTSearchSelectComponent-date_needed')

  if (search_type == 'rake_vp_report_vehicle_number') {
    let fci_ts_vehicle_array = []
    search_data.map(({ truck_no, index }) => {
      if (fci_ts_vehicle_array.indexOf(truck_no) === -1) {
        fci_ts_vehicle_array.push(truck_no)
        option.push({ value: truck_no, label: truck_no })
      }
    }) 
  } else if (search_type == 'rake_vp_report_po_number') {
    let fci_ts_po_no_array = []
    search_data.map(({ po_no, index }) => {
      if (fci_ts_po_no_array.indexOf(po_no) === -1) {
        fci_ts_po_no_array.push(po_no)
        option.push({ value: po_no, label: po_no })
      }
    })
  } else if (search_type == 'rake_vp_report_vendor_code') {
    let fci_ex_vendor_array = []
    search_data.map(({ v_code,v_name,index }) => {
      if (fci_ex_vendor_array.indexOf(v_code) === -1) {
        fci_ex_vendor_array.push(v_code)
        option.push({ value: v_code, label: `${v_name} (${v_code})` })
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
        isMulti={isMultiple}
      />
    </>
  )
}

export default RakeSerachSelectComponent
