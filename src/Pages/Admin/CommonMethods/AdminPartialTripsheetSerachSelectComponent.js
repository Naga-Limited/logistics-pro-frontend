import React, { useEffect, useState } from 'react'
import Select from 'react-select'  
import FCIVendorCreationService from 'src/Service/FCIMovement/FCIVendorCreation/FCIVendorCreationService'
import { MultiSelect } from "react-multi-select-component";
import AdminSettingsService from 'src/Service/AdminSettings/AdminSettingsService';
const AdminPartialTripsheetSerachSelectComponent = ({
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
  console.log(search_data,'DTSearchSelectComponent-search_data')
  console.log(search_type,'DTSearchSelectComponent-search_type')
  console.log(date_needed,'DTSearchSelectComponent-date_needed')

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

  const [rjPartialSettlementData, setRjPartialSettlementData] = useState([])

  useEffect(() => {


    AdminSettingsService.getPartialSettlementTripsheetsData().then((resd)=>{
      let da = resd.data.data
      console.log(da,'getPartialSettlementTripsheetsData') 

      let formattedVehicleTypesList = []
      if (da.length > 0) {
        da.map((vv) =>
          formattedVehicleTypesList.push({
            value: vv.parking_yard_gate_id,
            // label: vv.trip_sheet_info.trip_sheet_no,
            label: `${vv.trip_sheet_info.trip_sheet_no} - (${vv.vehicle_number})`,
          })
        )
      }
      setRjPartialSettlementData(formattedVehicleTypesList)
    })

  }, [])

  const FCI_VENDOR_TYPE = ['','Freight Vendor','Loading Vendor']

  if (search_type == 'partial_settlement_tripsheets') {
    let pst_array = []
    search_data.map(({ parking_yard_gate_id, trip_sheet_info, vehicle_number }) => {
      if (pst_array.indexOf(parking_yard_gate_id) === -1) {
        pst_array.push(parking_yard_gate_id)
        option.push({ value: parking_yard_gate_id, label: `${trip_sheet_info.trip_sheet_no} - (${vehicle_number})` })
      }
    }) 
  } 

  return (
    <>
      {/* <Select
        options={option}
        placeholder={label}
        noOptionsMessage={() => noOptionsMessage}
        size={size}
        className={className}
        onChange={(e) => onChange(e)}
        isMulti={isMultiple}
      /> */}
      <MultiSelect
        id={id}
        size={size}
        options={rjPartialSettlementData}
        value={rjPartialSettlementData.filter((currvehicletype) => selectedValue.includes(currvehicletype.value))}
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

export default AdminPartialTripsheetSerachSelectComponent
