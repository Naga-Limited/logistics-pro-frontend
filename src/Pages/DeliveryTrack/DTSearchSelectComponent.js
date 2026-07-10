import React, { useEffect, useState } from 'react'
import Select from 'react-select' 
import DeliveryTrackService from 'src/Service/DeliveryTrack/DeliveryTrackService' 
const DTSearchSelectComponent = ({
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

  const [shipmentData, setShipmentData] = useState([]); 

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
       
    }

  }, [])

  const vehicleTypeFinder = (code) => {
    if (code == 1) {
      return 'Own'
    } else if (code == 2) {
      return 'Contract'
    } else if (code == 3) {
      return 'Hire'
    } else if(code == 4) {
      return 'Party'
    } else {
      return ''
    }
  }

  if (search_type == 'delivery_track_shipment_routes') {
    shipmentData.map(({ shipment_id, shipment_no }) => {
        option.push({ value: shipment_id, label: shipment_no })
    })   
  } else if (search_type == 'delivery_track_report_vehicle_number') {
    let sp_vehicle_array = []
    search_data.map(({ vehicle_id, vehicle_no }) => {
      if (sp_vehicle_array.indexOf(vehicle_id) === -1) {
        sp_vehicle_array.push(vehicle_id)
        option.push({ value: vehicle_id, label: vehicle_no })
      }
    })
  } else if (search_type == 'delivery_track_report_shipment_number1') {
    shipmentData.map(({ shipment_id, shipment_no }) => {
      option.push({ value: shipment_id, label: shipment_no })
    })  
  } else if (search_type == 'delivery_track_report_shipment_number') {
    search_data.map(({ shipment_id, shipment_no }) => {
      option.push({ value: shipment_id, label: shipment_no })
    })
  } else if (search_type == 'delivery_track_report_tripsheet_number') {
    let sp_ts_array = []
    search_data.map(({ tripsheet_id, trip_sheet_info }) => {
      if (sp_ts_array.indexOf(tripsheet_id) === -1) {
        sp_ts_array.push(tripsheet_id)
        option.push({ value: tripsheet_id, label: trip_sheet_info.trip_sheet_no })
      }
    })
  } else if (search_type == 'despatch_screen_vehicle_number') {
    let sp_vehicle_array = []
    search_data.map(({ vehicle_id, vehicle_number }) => {
      if (sp_vehicle_array.indexOf(vehicle_id) === -1) {
        sp_vehicle_array.push(vehicle_id)
        option.push({ value: vehicle_id, label: vehicle_number })
      }
    })
  } else if (search_type == 'despatch_screen_shipment_number') {
    search_data.map(({ shipment_id, shipment_no }) => {
      option.push({ value: shipment_id, label: shipment_no })
    })
  } else if (search_type == 'despatch_screen_tripsheet_number') {
    let sp_ts_array = []
    search_data.map(({ tripsheet_id, trip_sheet_info }) => {
      if (sp_ts_array.indexOf(tripsheet_id) === -1) {
        sp_ts_array.push(tripsheet_id)
        option.push({ value: tripsheet_id, label: trip_sheet_info.trip_sheet_no })
      }
    })
  } else if (search_type == 'despatch_screen_vehicle_type') {
    let sp_vt_array = [] 
    search_data.map(({ vehicle_type_id }) => {
      if (sp_vt_array.indexOf(vehicle_type_id) === -1) {
        sp_vt_array.push(vehicle_type_id)
        option.push({ value: vehicle_type_id, label: vehicleTypeFinder(vehicle_type_id) })
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

export default DTSearchSelectComponent
