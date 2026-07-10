
import React, { useEffect, useState } from 'react'
import Select from 'react-select'
import DefinitionsListApi from 'src/Service/Definitions/DefinitionsListApi'
import ReportService from 'src/Service/Report/ReportService'

const CustomerCreationFilterComponent = ({
  size,
  id,
  className,
  onChange,
  label,
  noOptionsMessage,
  search_type,
}) => {
  const option = [{ value: '', label: 'Select' }]

  const [customer_status, setcustomer_status] = useState([])

  useEffect(() => {
    ReportService.getrj_customer_status().then((res) => {
      setcustomer_status(res.data)
    })
}, [])
const ACTION = {
  CUSTOMER_CREATION: 1,
  CUSTOMER_APPROVED: 2,
  CUSTOMER_CONFIRMED: 3,
  CUSTOMER_REJECTED: 4,
}
  if (search_type == 'customer_status') {
    customer_status.map(({ id, customer_status }) => {
      option.push({ value: customer_status, label:customer_status == ACTION.CUSTOMER_CREATION
        ? 'Customer Creation'
        : customer_status == ACTION.CUSTOMER_CONFIRMED
        ? 'Customer Confirmed'
        : customer_status == ACTION.CUSTOMER_APPROVED
        ? 'Customer Approved'
        : 'Rejected'})
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

export default CustomerCreationFilterComponent
