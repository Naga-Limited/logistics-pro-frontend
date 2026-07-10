import React, { useEffect, useState } from 'react'
import Select from 'react-select'  
import FCIVendorCreationService from 'src/Service/FCIMovement/FCIVendorCreation/FCIVendorCreationService'
const FCIVendorSerachSelectComponent = ({
    size,
    id,
    className,
    onChange,
    label,
    noOptionsMessage,
    search_type,
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

  const VSTATUS = ["FCI VC Rejected","FCI VC Requested","FCI VC Approved","FCI VC Confirmed","FCI VC Cancelled"]

  const FCI_VENDOR_TYPE = ['','Freight Vendor','Loading Vendor']

  if (search_type == 'vendor_master') {
    search_data.map(({ vendor_code, pan_no, vendor_name }) => {
        option.push({ value: vendor_code, label: `${pan_no} - ${vendor_name}` })
    })   
  }  else if (search_type == 'fci_tripsheet_report_vehicle_number') {
    let fci_ts_vehicle_array = []
    search_data.map(({ vehicle_no, index }) => {
      if (fci_ts_vehicle_array.indexOf(vehicle_no) === -1) {
        fci_ts_vehicle_array.push(vehicle_no)
        option.push({ value: vehicle_no, label: vehicle_no })
      }
    }) 
  } else if (search_type == 'fci_payment_report_fps_number') {
    let fci_ts_po_no_array = []
    search_data.map(({ expense_sequence_no, index }) => {
      if (fci_ts_po_no_array.indexOf(expense_sequence_no) === -1) {
        fci_ts_po_no_array.push(expense_sequence_no)
        option.push({ value: expense_sequence_no, label: expense_sequence_no })
      }
    })
  } else if (search_type == 'fci_tripsheet_report_po_number') {
    let fci_ts_po_no_array = []
    search_data.map(({ po_no, index }) => {
      if (fci_ts_po_no_array.indexOf(po_no) === -1) {
        fci_ts_po_no_array.push(po_no)
        option.push({ value: po_no, label: po_no })
      }
    })
  } else if (search_type == 'fci_tripsheet_report_plant_name') {
    let fci_ts_plant_array = []
    search_data.map(({ fci_plant_info, index }) => {
      if (fci_ts_plant_array.indexOf(fci_plant_info.plant_id) === -1) {
        fci_ts_plant_array.push(fci_plant_info.plant_id)
        option.push({ value: fci_plant_info.plant_id, label: fci_plant_info.plant_name })
      }
    })
  } else if (search_type == 'fci_migo_report_plant_name') {
    let fci_ts_plant_array = []
    search_data.map(({ fci_plant_info, index }) => {
      if (fci_ts_plant_array.indexOf(fci_plant_info.plant_symbol) === -1) {
        fci_ts_plant_array.push(fci_plant_info.plant_symbol)
        option.push({ value: fci_plant_info.plant_symbol, label: fci_plant_info.plant_name })
      }
    })
  } else if (search_type == 'fci_tripsheet_migo_report_vehicle_number') {
    let fci_ts_migo_vehicle_array = []
    search_data.map(({ truck_no, index }) => {
      if (fci_ts_migo_vehicle_array.indexOf(truck_no) === -1) {
        fci_ts_migo_vehicle_array.push(truck_no)
        option.push({ value: truck_no, label: truck_no })
      }
    })
  } else if (search_type == 'fci_tripsheet_migo_report_tripsheet_number') {
    let fci_migo_ts_no_array = []
    search_data.map(({ tripsheet_no, index }) => {
      if (fci_migo_ts_no_array.indexOf(tripsheet_no) === -1) {
        fci_migo_ts_no_array.push(tripsheet_no)
        option.push({ value: tripsheet_no, label: tripsheet_no })
      }
    })
  } else if (search_type == 'fci_expense_report_vendor_name') {
    let fci_ex_vendor_array = []
    search_data.map(({ expense_vendor_name,expense_vendor_code,index }) => {
      if (fci_ex_vendor_array.indexOf(expense_vendor_code) === -1) {
        fci_ex_vendor_array.push(expense_vendor_code)
        option.push({ value: expense_vendor_code, label: expense_vendor_name })
      }
    })
  } else if (search_type == 'fci_expense_report_status') {
    let fci_ex_status_array = []
    search_data.map(({ status,index }) => {
      if (fci_ex_status_array.indexOf(status) === -1) {
        fci_ex_status_array.push(status)
        option.push({ value: status, label: TRIP_CLOSURE_STATUS[status] })
      }
    }) 
  } else if (search_type == 'fci_expense_report_vendor_type') {
    let fci_ex_vt_array = []
    search_data.map(({ expense_vendor_type,index }) => {
      if (fci_ex_vt_array.indexOf(expense_vendor_type) === -1) {
        fci_ex_vt_array.push(expense_vendor_type)
        option.push({ value: expense_vendor_type, label: FCI_VENDOR_TYPE[expense_vendor_type] })
      }
    })   
  } else if (search_type == 'report_vendor_pan') {
    let fci_rvp_array = []
    search_data.map(({ pan_no,index }) => {
      if (fci_rvp_array.indexOf(pan_no) === -1) {
        fci_rvp_array.push(pan_no)
        option.push({ value: pan_no, label: pan_no })
      }
    })   
  } else if (search_type == 'report_vendor_status') {
    let fci_rvs_array = []
    search_data.map(({ vendor_status,index }) => {
      if (fci_rvs_array.indexOf(vendor_status) === -1) {
        fci_rvs_array.push(vendor_status)
        option.push({ value: vendor_status, label: VSTATUS[vendor_status] })
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

export default FCIVendorSerachSelectComponent
