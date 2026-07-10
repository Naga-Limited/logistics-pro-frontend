import React from 'react'
import Select from 'react-select'  
const NLMTReportSearchSelectComponent = ({
  size,
  id,
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
  console.log(search_data,'MTSearchSelectComponent-search_data')
  console.log(search_type,'MTSearchSelectComponent-search_type')
  console.log(date_needed,'MTSearchSelectComponent-date_needed')

   const shipmentStatusName = (code) => {
    if (code == 1) {
      return 'Created'
    } else if (code == 2) {
      return 'Updated BY User'
    }
    if (code == 3) {
      return 'Updated BY SAP'
    }
    if (code == 4) {
      return 'Deleted'
    }
    if (code == 5) {
      return 'Completed'
    } else {
      return ''
    }
  }

  const vehicleType = (id) => { 
    if (id == 21) {
      return 'Own'
    } else if (id == 22) {
      return 'Hire'
    } else { 
        return 'Party'
    }
  }
  
  if (search_type == 'nlmt_shipment_report_vehicle_number') {
    let sp_vehicle_array = []
    search_data.map(({ vehicle_id, vehicle_number }) => {
      if (sp_vehicle_array.indexOf(vehicle_id) === -1) {
        sp_vehicle_array.push(vehicle_id)
        option.push({ value: vehicle_id, label: vehicle_number })
      }
    })
  } else if (search_type == 'nlmt_shipment_report_shipment_number') {
    search_data.map(({ shipment_id, shipment_no }) => {
      option.push({ value: shipment_id, label: shipment_no })
    })
  } else if (search_type == 'nlmt_shipment_report_tripsheet_number') {
    let sp_ts_array = []
    search_data.map(({ tripsheet_id, trip_sheet_info }) => {
      if (sp_ts_array.indexOf(tripsheet_id) === -1) {
        sp_ts_array.push(tripsheet_id)
        option.push({ value: tripsheet_id, label: trip_sheet_info.nlmt_tripsheet_no })
      }
    })
  } else if (search_type == 'nlmt_shipment_report_shipment_status') {
    let sp_array = []
    search_data.map(({ shipment_status, index }) => {
      if (sp_array.indexOf(shipment_status) === -1) {
        sp_array.push(shipment_status)
        option.push({ value: shipment_status, label: shipmentStatusName(shipment_status) })
      }
    })
  } else if (search_type == 'nlmt_closure_report_vendor_name') {
    let sp_array = []
    search_data.map(({ driver_id, driver_info, vendor_info, vendor_code }) => {
      if (sp_array.indexOf(vendor_code) === -1) {
        sp_array.push(vendor_code)
        option.push({ value: vendor_code, label: driver_id ? driver_info.driver_name : vendor_info.owner_name })
      }
    }) 
  } else if (search_type == 'nlmt_closure_report_vehicle_type') {
    let sp_array = []
    search_data.map(({ vehicle_info }) => {
      if (sp_array.indexOf(vehicle_info.vehicle_type_id) === -1) {
        sp_array.push(vehicle_info.vehicle_type_id)
        option.push({ value: vehicle_info.vehicle_type_id, label: vehicleType(vehicle_info.vehicle_type_id) })
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

export default NLMTReportSearchSelectComponent
