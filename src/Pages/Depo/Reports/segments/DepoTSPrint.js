import { CButton } from '@coreui/react'
import React, { useEffect, useRef, useState } from 'react'
import QRCode from 'react-qr-code'
import { useParams } from 'react-router-dom' 
import{ useReactToPrint } from 'react-to-print'
import Print_header from 'src/components/printheadercomponent/print_header' 
import DepoShipmentCreationService from 'src/Service/Depo/Shipment/DepoShipmentCreationService'

const DepoTSPrint = () => {
  const { id } = useParams()

  const [singleVehicleInfo, setSingleVehicleInfo] = useState(false)
  const [singleVehicleShipmentInfo, setSingleVehicleShipmentInfo] = useState(false)
  const [trip_user_name, setTrip_user_name] = useState('')

  useEffect(() => {

      DepoShipmentCreationService.getSingleDepoShipmentByParkingId(id).then((res) => {
        console.log(res.data.data,'getSingleDepoShipmentByParkingId')
        setSingleVehicleShipmentInfo(res.data.data)

      })

      DepoShipmentCreationService.getSingleDepoShipmentPYGData(id).then((res) => {
        // setTrip_user_name(res.data.data.depo_user_info.username)
        setTrip_user_name(res.data.data.depo_user_info.emp_name)
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
      {/* {singleVehicleInfo && Number(singleVehicleInfo.vehicle_current_position) >= 22 && ( */}
        <CButton
          className="text-white"
          size='sm-lg'
          color="warning"
          style={{marginLeft:'690px'}}
          onClick={handleprint}>Print
        </CButton>
      {/* )} */}
      <div
        style={{background:'white',height:'1000px',width:'750px',paddingLeft:'21px',marginTop:'6px',paddingTop:'6px',marginLeft:'25px',paddingRight:'20px'}}
        ref={componentRef}
      >
        {singleVehicleInfo && (
          <table width="750" cellPadding="4" cellSpacing="0" border="0" className="table table-bordered">
            <tr  style={{border:'green',height:'650px'}}>
              <tr>
                <td width="700" align="center" style={{ paddingTop:'1px',paddingBottom:'0px' }}>
                  <Print_header
                    type={"depo"}
                  />
                  <u><strong>TRIPSHEET ( {singleVehicleInfo.vehicle_location_info.location} )</strong></u><br />
                </td>
              </tr>
              <tr>
                <td width="175" align="left"><strong>Tripsheet No</strong></td>
                <td width="175" align="left"> {singleVehicleInfo.vehicle_tripsheet_info.depo_tripsheet_no}</td>
                <td width="175" align="left"><strong>Tripsheet Date</strong></td>
                <td width="175" align="left"> {singleVehicleInfo.vehicle_tripsheet_info.created_date}</td>
              </tr>
              <tr>
                <td width="175" align="left"><strong>Contractor Name</strong></td>
                <td width="175" align="left"> {singleVehicleInfo.contractor_info.contractor_name}</td>
                <td width="175" align="left"><strong>Contractor Cell Number</strong></td>
                <td width="175" align="left"> {singleVehicleInfo.contractor_info.contractor_number}</td>
              </tr>
              <tr>
                <td width="175" align="left"><strong>Vehicle No</strong></td>
                <td width="175" align="left"> {singleVehicleInfo.vehicle_info.vehicle_number}</td>
                <td width="175" align="left"><strong>Vehicle Capacity</strong></td>
                <td width="175" align="left"> {singleVehicleInfo.vehicle_info.vehicle_capacity_info.capacity+' TON '}</td>
              </tr>
              <tr>
                <td width="175" align="left"><strong>Driver Name</strong></td>
                <td width="175" align="left"> {singleVehicleInfo.driver_info.driver_name}</td>
                <td width="175" align="left"><strong>Driver Cell Number</strong></td>
                <td width="175" align="left"> {singleVehicleInfo.driver_info.driver_number}</td>
              </tr>
              <tr>
                <td width="175" align="left"><strong>GateIn / Inspection Date</strong></td>
                <td width="175" align="left"> {singleVehicleInfo.created_date}/{formatDate(singleVehicleInfo.vehicle_inspection_info.created_at)}</td>
                <td width="175" align="left"><strong>Expected Delivery Date</strong></td>
                <td width="175" align="left"> {formatDate(singleVehicleInfo.vehicle_tripsheet_info.expected_delivery_date)}</td>
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
              {/* <tr>
                <td width="700" align="left" colSpan="4"><strong>{'Remarks : '}</strong> {singleVehicleInfo.vehicle_tripsheet_info.remarks || ' - '}</td>
              </tr> */}
              <tr>
                <td width="525" colSpan={3} align="left"><strong>Remarks :   </strong>{singleVehicleInfo.remarks || '-'}</td>
                <td width="175" align="left">
                  <strong><u>QR Code</u></strong> 
                  <div style={{ height: "auto", display:"flex",justifyContent: 'end', maxWidth: 64, width: "100%" }}>
                  
                    <QRCode size={256} viewBox={`0 0 256 256`} value={singleVehicleInfo.vehicle_info.vehicle_number} style={{marginTop:"5px", height: "auto", maxWidth: "100%", width: "100%" }} />
                  
                  </div>
                </td>
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

export default DepoTSPrint
