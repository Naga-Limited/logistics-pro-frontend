import React, { useEffect, useState } from 'react'
import Select from 'react-select' 
import DeliveryTrackService from 'src/Service/DeliveryTrack/DeliveryTrackService' 
const FSSearchSelectComponent = ({
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
  console.log(search_data,'FSSearchSelectComponent-search_data')
  console.log(search_type,'FSSearchSelectComponent-search_type')
  console.log(date_needed,'FSSearchSelectComponent-date_needed')
  
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
  
  if (search_type == 'fs_fsb_filter_vehicle_number') {
    let sp_vehicle_array = []
    search_data.map(({ vehicle_no }) => { 
      if (sp_vehicle_array.indexOf(vehicle_no) === -1) {
        sp_vehicle_array.push(vehicle_no)
        option.push({ value: vehicle_no, label: vehicle_no })
      } 
    })
  } else if (search_type == 'fs_fsb_filter_vehicle_type') {
    let sp_vehicle_type_array = []
    search_data.map(({ diesel_to }) => { 
      if (sp_vehicle_type_array.indexOf(diesel_to) === -1) {
        sp_vehicle_type_array.push(diesel_to)
        option.push({ value: diesel_to, label: VEHICLE_FUEL_TYPE[diesel_to] })
      } 
    })
  } else if (search_type == 'fs_fsb_filter_division') {
    let sp_shipment_array = []
    search_data.map(({ division_id, division_info }) => {
      if (sp_shipment_array.indexOf(division_id) === -1) {
        sp_shipment_array.push(division_id)
        option.push({ value: division_id, label: division_info.short_name })
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

export default FSSearchSelectComponent
