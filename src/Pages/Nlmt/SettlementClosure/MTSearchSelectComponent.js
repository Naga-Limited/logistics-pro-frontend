import React, { useEffect, useState } from 'react'
import Select from 'react-select' 
import DeliveryTrackService from 'src/Service/DeliveryTrack/DeliveryTrackService' 
const MTSearchSelectComponent = ({
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
  console.log(search_data,'MTSearchSelectComponent-search_data')
  console.log(search_type,'MTSearchSelectComponent-search_type')
  console.log(date_needed,'MTSearchSelectComponent-date_needed')
  
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
   
  const VEHICLE_FUEL_TYPE = ['','Vehicle','Barel','Others','Car']
  
  if (search_type == 'nlmt_filter_tds_tax_type') {
    let sp_vehicle_array = []
    search_data.map(({ trip_settlement_info }) => { 
      if (sp_vehicle_array.indexOf(trip_settlement_info.tds_type) === -1) {
        sp_vehicle_array.push(trip_settlement_info.tds_type)
        option.push({ value: trip_settlement_info.tds_type, label: trip_settlement_info.tds_type })
      } 
    })
  } else if (search_type == 'nlmt_filter_freight_percentage_type') {
    let sp_vehicle_type_array = []
    search_data.map(({ trip_settlement_info }) => { 
      if (sp_vehicle_type_array.indexOf(trip_settlement_info.advance_amount) === -1) {
        sp_vehicle_type_array.push(trip_settlement_info.advance_amount)
        option.push({ value: trip_settlement_info.advance_amount, label: `${trip_settlement_info.advance_amount}%` })
      } 
    })
  } else if (search_type == 'nlmt_filter_vendor_name') {
    let sp_shipment_array = []
    search_data.map(({ vendor_info }) => {
      console.log(vendor_info,'vendor_info')
      if (sp_shipment_array.indexOf(vendor_info.vendor_code) === -1) {
        sp_shipment_array.push(vendor_info.vendor_code)
        option.push({ value: vendor_info.vendor_code, label: vendor_info.owner_name })
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

export default MTSearchSelectComponent
