import { CFormLabel, CFormSelect } from '@coreui/react'
import React, { useEffect, useState } from 'react'
import Select from 'react-select'
import LocationApi from 'src/Service/SubMaster/LocationApi'
import { MultiSelect } from 'react-multi-select-component'
import IfoodsTSCreationService from 'src/Service/Ifoods/TSCreation/IfoodsTSCreationService'
import IfoodsVehicleAssignment from 'src/Service/SAP/IfoodsVehicleAssignment'

const IfoodsVehicleAssignmentListComponent = ({
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
  search_type,
  noOptionsMessage,
}) => {
  const [outlet, setOutlet] = useState([])
  const [fetch, setFetch] = useState(false)

  // useEffect(() => {
  //   IfoodsVehicleAssignment.getshipmentData(1).then((res) => {
  //     setFetch(true)
  //     let outletList = res.data
  //     console.log(outletList)
  //     const formattedOutletList = []
  //     if (outletList.length > -1) {
  //       let filteredData = outletList.filter((outlet) => outlet.STATUS == 1)
  //       filteredData.map((outlet) =>
  //         formattedOutletList.push({
  //           value: outlet.SHIPMENT_OR_PO,
  //           label: `${outlet.SHIPMENT_OR_PO}`,
  //         })
  //       )
  //     }
  //     setOutlet(formattedOutletList)
  //     console.log(formattedOutletList)
  //   })
  // }, [])

  useEffect(() => {
    IfoodsVehicleAssignment.getshipmentData(1).then((res) => {
      setFetch(true)
      let outletList = res.data
   //   console.log(outletList[0].DELIVERY_COUNT[0].CUSTOMER)
      


      const formattedOutletList = []
      const uniqueValues = new Set()

      if (outletList.length > -1) {
        let filteredData = outletList.filter((outlet) => outlet.SHIPMENT_OR_PO)
        filteredData.forEach((outlet) => {
          const value = outlet.SHIPMENT_OR_PO
          if (!uniqueValues.has(value)) {
            uniqueValues.add(value)
            formattedOutletList.push({
              value: value,
              label: `${value}`,
            })
          }
        })
      }
      setOutlet(formattedOutletList)
      console.log(formattedOutletList)
    })

    
  }, [])




  //******************************************************* */

  

  return (
    <>
      <MultiSelect
        id={id}
        size={size}
        options={outlet}
        value={outlet.filter((curroutlet) => selectedValue.includes(curroutlet.value))}
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

export default IfoodsVehicleAssignmentListComponent
