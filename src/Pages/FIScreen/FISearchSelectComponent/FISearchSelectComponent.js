
import React, { useEffect, useState } from 'react'
import Select from 'react-select'
import FIEntryService from 'src/Service/FIEntry/FIEntryService'
import GLListMasterService from 'src/Service/Master/GLListMasterService'

const FISearchSelectComponent = ({
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

  const [GLLists, setGLList] = useState([])
  const [GLLists1, setGLList1] = useState([])

  useEffect(() => {

/* section for getting Tripsheet no Data from database For FI Entry */
    GLListMasterService.getGLlist().then((rest) => {
      console.log(rest.data.data)
      let tableData = rest.data.data
      const filterData = tableData.filter(
        (data) => (data.amount_type == '1' && data.gl_status == '1')
      )
      // let tableData = rest.data.data
      setGLList(filterData)
      const filterData1 = tableData.filter(
        (data) => (data.amount_type == '2' && (data.gltype == "6,7" || data.gltype == "5,7" || data.gltype == "7") && data.gl_status == '1')
      )
     setGLList1(filterData1)
    })
  }, [])


  if (search_type == 'gl_lists') {
    GLLists.map(({ gl_list_id, gl_description ,gl_code }) => {
      option.push({ value: gl_list_id, label: gl_description + ' - ' + gl_code})
    })
  }else if (search_type == 'gl_lists_expense') {
    GLLists1.map(({ gl_list_id, gl_description ,gl_code }) => {
      option.push({ value: gl_list_id, label: gl_description + ' - ' + gl_code})
    })
  }else if (search_type == 'gl_amount_type') {
    GLLists.map(({ gl_list_id, amount_type }) => {
      option.push({ value: amount_type, label: amount_type == 1 ? 'Income' : amount_type == 2 ? 'Expense' : ''})
    })
  }else if (search_type == 'rj_customer_details') {
    let sp_vehicle_array = []
    search_data.map(({ customer_code, customer_name }) => {
      if (sp_vehicle_array.indexOf(customer_code) === -1) {
        sp_vehicle_array.push(customer_code)
        option.push({ value: customer_code, label: customer_name })
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

export default FISearchSelectComponent
