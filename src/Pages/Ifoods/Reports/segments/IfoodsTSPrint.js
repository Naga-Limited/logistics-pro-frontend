
import {
  CCol,
  CRow,
  CContainer,
  CCard,
  CForm,
  CFormInput,
  CFormSelect,
  CFormTextarea,
  CFormLabel,
  CHeaderBrand,
  CInputGroup,
  CInputGroupText,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
  CTable,
  CTableBody,
  CTableHead,
  CButton
} from '@coreui/react'
import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import SmallLoader from 'src/components/SmallLoader'
import ReportService from 'src/Service/Report/ReportService'
import houseofnaga from 'src/assets/naga/houseofnaga.png'
import nagalogo from 'src/assets/naga/nagalogo.png'
import{ useReactToPrint } from 'react-to-print'

import Print_footer from 'src/components/printheadercomponent/print_footer'
import DepoTSCreationService from 'src/Service/Depo/TSCreation/DepoTSCreationService'
import DepoShipmentCreationService from 'src/Service/Depo/Shipment/DepoShipmentCreationService'
import IfoodsTSCreationService from 'src/Service/Ifoods/TSCreation/IfoodsTSCreationService'
import Print_header from 'src/components/printheadercomponent/print_header'
import Print_header_ifoods from 'src/components/printheadercomponent/Print_header_ifoods'

const IfoodsTSPrint = () => {
  const { id } = useParams()

  const [singleVehicleInfo, setSingleVehicleInfo] = useState(false)
  const [singleVehicleShipmentInfo, setSingleVehicleShipmentInfo] = useState(false)
  const [trip_user_name, setTrip_user_name] = useState('')

  useEffect(() => {

      // DepoShipmentCreationService.getSingleDepoShipmentByParkingId(id).then((res) => {
      //   console.log(res.data.data,'getSingleDepoShipmentByParkingId')
      //   setSingleVehicleShipmentInfo(res.data.data)

      // })

      IfoodsTSCreationService.getTripsheetInfoById(id).then((res) => {
        // setTrip_user_name(res.data.data.depo_user_info.username)
        //setTrip_user_name(res.data.data.depo_user_info.emp_name)
        console.log(res.data.data,'singleTripDetailsList')
        setSingleVehicleInfo(res.data.data)
      })
  }, [])

  function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [day, month, year].join('-');
  }

  const datetimeFormatted = () => {
    var today = new Date();
    var day = today.getDate() + "";
    var month = (today.getMonth() + 1) + "";
    var year = today.getFullYear() + "";
    var hour = today.getHours() + "";
    var minutes = today.getMinutes() + "";
    var seconds = today.getSeconds() + "";

    day = checkZero(day);
    month = checkZero(month);
    year = checkZero(year);
    hour = checkZero(hour);
    minutes = checkZero(minutes);
    seconds = checkZero(seconds);

    let needed_data = day + "-" + month + "-" + year + " " + hour + ":" + minutes + ":" + seconds
    console.log(needed_data,'needed_data');

    return needed_data

  }

  function checkZero(data){
    if(data.length == 1){
      data = "0" + data;
    }
    return data;
  }

  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content : () => componentRef.current,
  });

  const current = new Date();
  const date = `${current.getDate()}-${current.getMonth()+1}-${current.getFullYear()} ${current.getHours()}:${current.getMinutes()}`

  const user_info_json = localStorage.getItem('user_info')
  const user_info = JSON.parse(user_info_json)

  // const user_name = user_info.username
  const user_name = user_info.emp_name

  return (
    <>
      {singleVehicleInfo && Number(singleVehicleInfo.vehicle_current_position) <= 20 && (
        <CButton
          className="text-white"
          size='sm-lg'
          color="warning"
          style={{marginLeft:'690px'}}
          onClick={handleprint}>Print
        </CButton>)}
      <div
        style={{background:'white',height:'1000px',width:'750px',paddingLeft:'21px',marginTop:'6px',paddingTop:'6px',marginLeft:'25px',paddingRight:'20px'}}
        ref={componentRef}
      >
        {singleVehicleInfo && (
          <table width="750" cellPadding="4" cellSpacing="0" border="0" className="table table-bordered">
            <tr  style={{border:'green',height:'650px'}}>
              <tr>
                <td width="700" align="center" style={{ paddingTop:'1px',paddingBottom:'0px' }}>
                  <Print_header_ifoods
                     type={"ifoods"}
                  />
                  <u><strong>TRIPSHEET ( {singleVehicleInfo.vehicle_location_info.location} )</strong></u><br />
                </td>
              </tr>
              <tr>
                <td width="175" align="left"><strong>Tripsheet No</strong></td>
                <td width="175" align="left"> {singleVehicleInfo.tripsheet_info[0].ifoods_tripsheet_no}</td>
                <td width="175" align="left"><strong>Tripsheet Date</strong></td>
                <td width="175" align="left"> {formatDate(singleVehicleInfo.tripsheet_info[0].created_at)}</td>
              </tr>
              <tr>
                <td width="175" align="left"><strong>Vendor Name</strong></td>
                <td width="175" align="left"> {singleVehicleInfo.ifoods_Vendor_info.vendor_name}</td>
                <td width="175" align="left"><strong>Vehicle No</strong></td>
                <td width="175" align="left"> {singleVehicleInfo.ifoods_Vehicle_info.vehicle_number}</td>
              </tr>
              <tr>
                <td width="175" align="left"><strong>Vehicle Capacity</strong></td>
                <td width="175" align="left"> {singleVehicleInfo.ifoods_Vehicle_info.vehicle_capacity_info.capacity+' Mts'}</td>
                <td width="175" align="left"><strong>Vehicle Feet</strong></td>
                <td width="175" align="left"> {singleVehicleInfo.ifoods_Vehicle_info.feet_info.capacity+' Feet '}</td>
              </tr>
              <tr>
                <td width="175" align="left"><strong>Driver Name</strong></td>
                <td width="175" align="left"> {singleVehicleInfo.driver_name}</td>
                <td width="175" align="left"><strong>Driver Contact Number</strong></td>
                <td width="175" align="left"> {singleVehicleInfo.driver_number}</td>
              </tr>
              <tr>
                <td width="175" align="left"><strong>GateIn Date & Time</strong></td>
                <td width="175" align="left"> {singleVehicleInfo.gate_in_date_time_string}</td>
                <td width="175" align="left"><strong>Expected Delivery Date</strong></td>
                <td width="175" align="left"> {formatDate(singleVehicleInfo.tripsheet_info[0].expected_delivery_date)}</td>
              </tr>
              <tr>
                <td width="175" align="left"><strong>Odometer Opening KM</strong></td>
                <td width="175" align="left"> {singleVehicleInfo.odometer_km}</td>
                <td width="175" align="left"><strong>Vehicle Temperature</strong></td>
                <td width="175" align="left"> {'- 20°'}</td>
              </tr>
              <tr>
                <td width="175" align="left"><strong>Product Temperature</strong></td>
                <td width="175" align="left"> {singleVehicleInfo.tripsheet_info[0].product_temp+'°'}</td>
                <td width="175" align="left"><strong>Trip Crate</strong></td>
                <td width="175" align="left"> {singleVehicleInfo.tripsheet_info[0].trip_crate}</td>
              </tr>

              {singleVehicleShipmentInfo && (
                <>
                  <tr>
                    <td colSpan={2} style={{background:'wheat',textAlign:'center',fontWeight:'bold'}}>
                      Shipment Info
                    </td>
                  </tr>
                  <tr>
                    <td width="175" align="left"><strong>Shipment No</strong></td>
                    <td width="175" align="left">{singleVehicleShipmentInfo.shipment_no}</td>
                    <td width="175" align="left"><strong>Shipment Date</strong></td>
                    <td width="175" align="left">{singleVehicleShipmentInfo.created_at_date}</td>
                  </tr>
                  <tr>
                    <td width="175" align="left"><strong>Created By</strong></td>
                    <td width="175" align="left">{singleVehicleShipmentInfo.depo_shipment_user_info.emp_name}</td>
                    <td width="175" align="left"><strong>Shipment Remarks</strong></td>
                    <td width="175" align="left">{singleVehicleShipmentInfo.remarks || '-'}</td>
                  </tr>
                  <tr>
                    <td width="175" align="left"><strong>Planned Qty in MTS</strong></td>
                    <td width="175" align="left">{singleVehicleShipmentInfo.initial_shipment_qty}</td>
                    <td width="175" align="left"><strong>Final Qty in MTS</strong></td>
                    <td width="175" align="left">{singleVehicleShipmentInfo.final_shipment_qty}</td>
                  </tr>
                  <tr>
                    <td width="175" align="left"><strong>Shipment Freight Type</strong></td>
                    <td width="175" align="left">{singleVehicleShipmentInfo.freight_type == '1' ? 'Budget' : 'Actual'}</td>
                    <td width="175" align="left"><strong>Deliveries Count</strong></td>
                    <td width="175" align="left"> {singleVehicleShipmentInfo.shipment_child_info.length}</td>
                  </tr>
                  <tr>
                    <td colSpan={2} style={{background:'wheat',textAlign:'center',fontWeight:'bold'}}>
                      Delivery Info
                    </td>
                  </tr>
                  <tr>
                    <td width="40" align="center"><strong>S.No</strong></td>
                    <td width="80" align="center"><strong>Delivery Number</strong></td>
                    <td width="50" align="center"><strong>Qty in MTS</strong></td>
                    <td width="200" align="center"><strong>Customer Name</strong></td>
                    <td width="80" align="center"><strong>Place</strong></td>
                  </tr>
                  {singleVehicleShipmentInfo.shipment_child_info.map((val,ind)=>{
                    return (
                      <tr key={ind}>
                        <td width="40" align="center">{ind+1}</td>
                        <td width="80" align="center">{val.delivery_no}</td>
                        <td width="50" align="center">{val.delivery_qty}</td>
                        <td width="200" align="center">{val.customer_info.CustomerName}</td>
                        <td width="80" align="center">{val.customer_info.CustomerCity}</td>
                      </tr>
                    )}
                  )}
                </>
              )}
              <tr>
                <td width="700" align="left" colSpan="4"><strong>{'Remarks : '}</strong> {singleVehicleInfo.tripsheet_info[0].remarks || ' - '}</td>
              </tr>
              <tr>
                <td width="175" align="left"><strong>Print Date & Time </strong></td>
                <td width="175" align="left"> {datetimeFormatted()}</td>
                <td width="175" align="left"><strong>Authorized Signature   </strong></td>
                <td width="175" align="left"></td>
              </tr>
              <tr>
                <td width="175" align="left"><strong>User ID / Created By </strong></td>
                <td width="175" align="left"> {user_name} / {trip_user_name}</td>
                <td width="175" align="left"><strong>Name  </strong></td>
                <td width="175" align="left"></td>
              </tr>
            </tr>
          </table>
        )}

      </div>
    </>
  )

}

export default IfoodsTSPrint
