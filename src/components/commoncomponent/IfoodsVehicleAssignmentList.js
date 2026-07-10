import { CFormLabel, CFormSelect } from '@coreui/react'
import React, { useEffect, useState } from 'react'
import Select from 'react-select'

const IfoodsVehicleAssignmentList = ({
  size,
  id,
  className,
  onChange,
  label,
  noOptionsMessage,
  search_type,
  search_data = [],

  isMultiple,
}) => {
  const option = [{ value: '', label: 'Select' }]
 
   if (search_type == 'shipment_po') {
      let shipment_order_array = []
      shipment_order_array = search_data.filter((data) => data.STATUS == 1)
      search_data.map(({ SHIPMENT_OR_PO,QUANTITY }) => {
        if (shipment_order_array.indexOf(SHIPMENT_OR_PO) === -1) {
          shipment_order_array.push(SHIPMENT_OR_PO)
         option.push({ 
          value: SHIPMENT_OR_PO, 
          label: SHIPMENT_OR_PO+' - '+QUANTITY+'  Qty' })
          
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

export default IfoodsVehicleAssignmentList
