import React, { useEffect, useState } from 'react'
import Select from 'react-select'  
import FCIVendorCreationService from 'src/Service/FCIMovement/FCIVendorCreation/FCIVendorCreationService'
import { MultiSelect } from "react-multi-select-component";
import AdminSettingsService from 'src/Service/AdminSettings/AdminSettingsService';
const PygVehicleSearchSelectComponent = ({
    size,
    name,
    id,
    className,
    onChange,
    onFocus,
    onBlur,
    label,
    noOptionsMessage,
    search_type,
    selectedValue,
    search_data = [],
    date_needed = {},
    division_type = '',
    isMultiple
}) => {
  const option = [{ value: '', label: 'Select' }]
  console.log(search_data,'PygVehicleSearchSelectComponent-search_data')
  console.log(search_type,'PygVehicleSearchSelectComponent-search_type')
  console.log(date_needed,'PygVehicleSearchSelectComponent-date_needed')

//   const [fciVendorsData, setFciVendorsData] = useState([]); 

  // useEffect(() => {
    
  //   if(search_data && search_data.length > 0){
  //     setShipmentData(search_data)
  //   } else {
  //     setShipmentData([])
  //   }
     
  // }, [search_data])
  
  useEffect(() => {

    // if (search_type == 'vendor_master') {
    //     /* section for getting Rake Vendors from database */
    //     FCIVendorCreationService.getAllSapVendorsFromLP().then((response) => {
    //         let viewData = response.data      
    //         console.log(viewData,'FCI Vendor Data') 
    //         setFciVendorsData(viewData)
    //     })
    // }  

  }, [])

  /* Trip Closure Status */
  const TRIP_CLOSURE_STATUS = [
    '',
    'Exp. Sub. ✔️',
    'Exp. Sub. Approved ✔️',
    'Exp. Sub. Rejected ❌',
    'Exp. Verified ✔️',
    'Exp. Rejected ❌',
    'Exp. Posted ✔️',
    'Exp. Posting Rejected ❌',
    'Inc. Posted ✔️',     
    'Cancelled ❌'
  ]

   

  const FCI_VENDOR_TYPE = ['','Freight Vendor','Loading Vendor']

  if (search_type == 'pyg_vehicle_info') {
    let pst_array = []
    search_data.map(({ vehicle_id, vehicle_number }) => {
      if (pst_array.indexOf(vehicle_id) === -1) {
        pst_array.push(vehicle_id)
        option.push({ value: vehicle_id, label: `${vehicle_number}` })
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
        // onChange={(e) => onChange(e)}
        onChange={(e) => onChange(e)}
        // onChange={(e) => onChange(e, name)}
        // isMulti={isMultiple}
      />
      {/* <MultiSelect
        id={id}
        size={size}
        // options={rjPartialSettlementData}
        options={option}
        // value={rjPartialSettlementData.filter((currvehicletype) => selectedValue.includes(currvehicletype.value))}
        name={name}
        className={className}
        // isMulti={isMultiple}
        onFocus={onFocus}
        onBlur={onBlur}
        // onChange={(e) => onChange(e, name)}
        onChange={(e) => onChange(e)}
        placeholder={label}
        noOptionsMessage={() => noOptionsMessage}
      /> */}
    </>
  )
}

export default PygVehicleSearchSelectComponent
