import React, { useEffect, useState } from 'react'
import Select from 'react-select' 
import DeliveryTrackService from 'src/Service/DeliveryTrack/DeliveryTrackService' 
const IASearchSelectComponent = ({
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
  
  useEffect(() => {

   if (search_type == 'delivery_track_shipment_routes') {
    //section for getting Location Data from database
    DeliveryTrackService.getShipmentForDeliveryTrack().then((res) => {
        console.log(res.data.data,'getShipmentForDeliveryTrack')
        setShipmentData(res.data.data)
      })
    } else if (search_type == 'delivery_track_report_shipment_number1') { 
        let report_form_data = new FormData()
        report_form_data.append('date_between', date_needed)   
        DeliveryTrackService.sentShipmentInfoForDeliveryTrack(report_form_data).then((res) => { 
            console.log(res.data.data,'sentShipmentInfoForDeliveryTrack')  
            setShipmentData(res.data.data)
        })
       
        /* ====================== Shipment Report Filter Component Part Start ====================== */
    } 
    // else if (search_type == 'shipment_report_vehicle_number') {
    //     let sp_vehicle_array = []
    //     search_data.map(({ vehicle_id, vehicle_number }) => {
    //     if (sp_vehicle_array.indexOf(vehicle_id) === -1) {
    //         sp_vehicle_array.push(vehicle_id)
    //         option.push({ value: vehicle_id, label: vehicle_number })
    //     }
    //     })
    // } else if (search_type == 'shipment_report_shipment_number') {
    //     search_data.map(({ shipment_id, shipment_no }) => {
    //     option.push({ value: shipment_id, label: shipment_no })
    //     })
    // } else if (search_type == 'shipment_report_tripsheet_number') {
    //     let sp_ts_array = []
    //     search_data.map(({ tripsheet_id, trip_sheet_info }) => {
    //     if (sp_ts_array.indexOf(tripsheet_id) === -1) {
    //         sp_ts_array.push(tripsheet_id)
    //         option.push({ value: tripsheet_id, label: trip_sheet_info.trip_sheet_no })
    //     }
    //     })
    // } else if (search_type == 'shipment_report_shipment_status') {
    //     let sp_array = []
    //     search_data.map(({ shipment_status, index }) => {
    //     if (sp_array.indexOf(shipment_status) === -1) {
    //         sp_array.push(shipment_status)
    //         option.push({ value: shipment_status, label: shipmentStatusName(shipment_status) })
    //     }
    //     })
    //     /* ====================== Shipment Report Filter Component Part End ====================== */
    // }

  }, [])

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
        option.push({ value: vehicle_type_id, label: VEHICLE_TYPE[vehicle_type_id] })
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

export default IASearchSelectComponent
