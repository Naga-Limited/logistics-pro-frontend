import React, { useEffect, useState } from 'react'
import Select from 'react-select' 
import DeliveryTrackService from 'src/Service/DeliveryTrack/DeliveryTrackService' 
import TripInfoCaptureService from 'src/Service/TripInfoCapture/TripInfoCaptureService'
const OVTICSearchSelectComponent = ({
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

  const [shipmentData, setShipmentData] = useState([])

  const user_info_json = localStorage.getItem('user_info')
  const user_info = JSON.parse(user_info_json)

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
       
    } else if (search_type == 'open_ov_tripsheets') { 
       
      TripInfoCaptureService.getOVOTInfoForReport().then((res) => { 
        console.log(res.data.data,'getOVOTInfoForReport')  
        setShipmentData(res.data.data)
      })
       
    }

  }, []) 
  
  if (search_type == 'open_ov_tripsheets') {
    shipmentData.map(({ trip_sheet_id, trip_sheet_no,parking_info }) => {
      if(user_info.is_admin == 1){
        option.push({ value: trip_sheet_id, label: `${trip_sheet_no} - ${parking_info.vehicle_current_position}` })
      } else {
        option.push({ value: trip_sheet_id, label: trip_sheet_no})
      }
        
    })   
  } else if (search_type == 'ovtic_report_vehicle_number') {
    let sp_vehicle_array = []
    search_data.map(({ veh_id, veh_no }) => {
      if (sp_vehicle_array.indexOf(veh_id) === -1) {
        sp_vehicle_array.push(veh_id)
        option.push({ value: veh_id, label: veh_no })
      }
    })
  } else if (search_type == 'ovtic_report_tripsheet_number') {
    let sp_ts_array = []
    search_data.map(({ trip_id, ts_no }) => {
      if (sp_ts_array.indexOf(trip_id) === -1) {
        sp_ts_array.push(trip_id)
        option.push({ value: trip_id, label: ts_no })
      }
    })
  } else if (search_type == 'ovtic_rj_report_vehicle_number') {
    let sp_vehicle_array = []
    console.log(search_data,'ovtic_rj_report_vehicle_number-search_data')
    search_data.map(({ veh_id, veh_no }) => {
      if (sp_vehicle_array.indexOf(veh_id) === -1) {
        sp_vehicle_array.push(veh_id)
        option.push({ value: veh_id, label: veh_no })
      }
    })
  } else if (search_type == 'ovtic_rj_report_tripsheet_number') {
    let sp_ts_array = []
    console.log(search_data,'ovtic_rj_report_tripsheet_number-search_data')
    search_data.map(({ trip_id, ts_no }) => {
      if (sp_ts_array.indexOf(trip_id) === -1) {
        sp_ts_array.push(trip_id)
        option.push({ value: trip_id, label: ts_no })
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

export default OVTICSearchSelectComponent
