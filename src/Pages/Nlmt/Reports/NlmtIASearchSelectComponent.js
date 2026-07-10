import React, { useEffect, useState } from 'react'
import Select from 'react-select' 
import DeliveryTrackService from 'src/Service/DeliveryTrack/DeliveryTrackService' 
const NlmtIASearchSelectComponent = ({
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
  console.log(search_data,'IASearchSelectComponent-search_data')
  console.log(search_type,'IASearchSelectComponent-search_type')
  console.log(date_needed,'IASearchSelectComponent-date_needed')

  const [shipmentData, setShipmentData] = useState([]); 

  useEffect(() => {
    
    if(search_data && search_data.length > 0){
      setShipmentData(search_data)
    } else {
      setShipmentData([])
    }
     
  }, [search_data])

  const vehicleType = (id) => { 
    if (id == 21) {
      return 'Own'
    } else if (id == 22) {
      return 'Hire'
    } else { 
        return 'Party'
    }
  }

  const Nlmt_Payment_Status = (id) => {
    let paymentStatusArray = [
      'Submission ✔️',
      'Validation ❌',
      'Validation ✔️',
      'Completed ✔️',
      'Deleted'
    ]
    return paymentStatusArray[id-1]
  }

  const DELIVERY_STATUS = ['','CREATED','DELETED','PGI DONE']
  const VEHICLE_TYPE = ['','OWN','CONTRACT','HIRE','OTHERS']
  const SHIPMENT_STATUS = ['','CREATED','UPDATED BY USER','UPDATED BY SAP','DELETED','COMPLETED']
  
  if (search_type == 'invoice_report_vehicle_number') {
    let sp_vehicle_array = []
    search_data.map(({ vehicle_number }) => { 
      if (sp_vehicle_array.indexOf(vehicle_number) === -1) {
        sp_vehicle_array.push(vehicle_number)
        option.push({ value: vehicle_number, label: vehicle_number })
      } 
    })
  } else if (search_type == 'invoice_report_vehicle_type') {
    let sp_vehicle_type_array = []
    search_data.map(({ vehicle_type_id }) => { 
      if (sp_vehicle_type_array.indexOf(vehicle_type_id) === -1) {
        sp_vehicle_type_array.push(vehicle_type_id)
        option.push({ value: vehicle_type_id, label: vehicleType(vehicle_type_id) })
      } 
    })
  } else if (search_type == 'invoice_report_shipment_number') {
    let sp_shipment_array = []
    search_data.map(({ shipment_no }) => {
      if (sp_shipment_array.indexOf(shipment_no) === -1) {
        sp_shipment_array.push(shipment_no)
        option.push({ value: shipment_no, label: shipment_no })
      }
    })
  } else if (search_type == 'invoice_report_shipment_status') {
    let sp_ship_status_array = []
    search_data.map(({ shipment_status }) => {
      if (sp_ship_status_array.indexOf(shipment_status) === -1) {
        sp_ship_status_array.push(shipment_status)
        option.push({ value: shipment_status, label: SHIPMENT_STATUS[shipment_status] })
      }
    })
  } else if (search_type == 'invoice_report_tripsheet_number') {
    let sp_tsno_array = []
    search_data.map(({ trip_sheet_no }) => {
      if (sp_tsno_array.indexOf(trip_sheet_no) === -1) {
        sp_tsno_array.push(trip_sheet_no)
        option.push({ value: trip_sheet_no, label: trip_sheet_no })
      }
    })
  } else if (search_type == 'invoice_report_delivery_number') {
    let sp_del_array = []
    search_data.map(({ delivery_no }) => {
      if (sp_del_array.indexOf(delivery_no) === -1) {
        sp_del_array.push(delivery_no)
        option.push({ value: delivery_no, label: delivery_no })
      }
    })
  } else if (search_type == 'invoice_report_delivery_status') {
    let sp_del_status_array = []
    search_data.map(({ delivery_status }) => {
      if (sp_del_status_array.indexOf(delivery_status) === -1) {
        sp_del_status_array.push(delivery_status)
        option.push({ value: delivery_status, label: DELIVERY_STATUS[delivery_status] })
      }
    })
  } else if (search_type == 'nlmt_payment_report_vendor_name') {
    let dprcn_array = []
    console.log(search_data,'nlmt_payment_report_vendor_name-search_data')
    search_data.map(({ vendor_info, index }) => {
      if (dprcn_array.indexOf(vendor_info.vendor_code) === -1) {
        dprcn_array.push(vendor_info.vendor_code)
        option.push({ value: vendor_info.vendor_code, label: vendor_info.owner_name })
      }
    })
   } else if (search_type == 'nlmt_payment_report_payment_status') {
    let dprps_array = []
    console.log(search_data,'nlmt_payment_report_payment_status-search_data')
    search_data.map(({ status, index }) => {
      if (dprps_array.indexOf(status) === -1) {
        dprps_array.push(status)
        option.push({ value: status, label: Nlmt_Payment_Status(status) })
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

export default NlmtIASearchSelectComponent
