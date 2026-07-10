import {CButton} from '@coreui/react'
import React, { useEffect, useRef, useState } from 'react'
import leftLogo from 'src/assets/naga/left.png'
import rightLogo from 'src/assets/naga/right.jpg'
import { useParams } from 'react-router-dom'
import ReportService from 'src/Service/Report/ReportService'
import{ useReactToPrint } from 'react-to-print'
import DieselVendorMasterService from 'src/Service/Master/DieselVendorMasterService'

const NlmtDIPrint = ({}) => {
  const { id } = useParams()

  const [singleVehicleInfo, setSingleVehicleInfo] = useState(false)

  const hd = {
    display:'flex',
    justifyContent:'center',
    borderBottom:'1.5px solid black',
    background:'white',
  }

  const hd1 = {
    marginRight: '4%',
    fontFamily:'timesNewRoman',
    fontSize:'16px'
  }

  const h1s = {
    fontFamily:'timesnewroman',
    fontSize:'24px',
    fontWeight:'bold'
  }

  const h2s = {
    display:'block',
    fontFamily:'timesnewroman',
    fontSize:'12px',
    fontWeight:'bold',
    marginTop:'-10px'
  }

  const h3s = {
    display:'block',
    fontFamily:'timesnewroman',
    fontSize:'10px',
    fontWeight:'bold',
    marginTop:'-3px'
  }

  const h4s = {
    display:'block',
    fontFamily:'timesnewroman',
    fontSize:'10px',
    letterSpacing:'0.5px'
  }

  const imhl = {
    width:'100px',
    height:'100px',
  }

  const imhr = {
    width:'120px',
    height:'100px'
  }
  const [vehicleNo, setVehicleNo] = useState('')
  const [vehicleId, setVehicleId] = useState('')
  const [vehicle_capacity, setVehicle_capacity] = useState('')
  const [Gate_in_date, setGate_in_date] = useState('')
  const [driver_name, setDriver_name] = useState('')
  const [driver_contact_number, setDriver_contact_number] = useState('')
  const [odometer_km, setOdometer_km] = useState('')
  const [inspection_time_string, setInspection_time_string] = useState('')
  const [shedName, setShedName] = useState('')
  const [TripSheet, setTripSheet] = useState('')
  const [TripSheetDate, setTripSheetDate] = useState('')
  const [FreightAmount, setFrightAmount] = useState('')
  const [dvData, setDvData] = useState([])

  const user_info_json = localStorage.getItem('user_info')
  const user_info = JSON.parse(user_info_json)
  const user_name = user_info.username
    // console.log(user_name)

  useEffect(() => {
    ReportService.singleDieselDetailsList(id).then((res) => {
      console.log(res.data.data)
      setVehicleNo(res.data.data.parking_info.vehicle_number)
      setGate_in_date(res.data.data.parking_info.gate_in_date_time_string)
      setVehicleId(res.data.data.parking_info.vehicle_type_id.type)
      setVehicle_capacity(res.data.data.parking_info.vehicle_capacity_id.capacity)
      setDriver_name(res.data.data.parking_info.driver_name)
      setDriver_contact_number(res.data.data.parking_info.driver_contact_number)
      setOdometer_km(res.data.data.parking_info.odometer_km)
      setInspection_time_string(res.data.data.parking_info.vehicle_inspection_trip !=null ? res.data.data.parking_info.vehicle_inspection_trip.inspection_time_string:'')
      setShedName(res.data.data.parking_info.vehicle_document !=null ? res.data.data.parking_info.vehicle_document.Shed_info.shed_name:'')
      setTripSheet(res.data.data.parking_info.trip_sheet_info !=null ? res.data.data.parking_info.trip_sheet_info.trip_sheet_no:'')
      setTripSheetDate(res.data.data.parking_info.trip_sheet_info !=null ? res.data.data.parking_info.trip_sheet_info.created_at:'')
      setFrightAmount(res.data.data.parking_info.advance_info !=null ? res.data.data.parking_info.advance_info.actual_freight:'')
      setSingleVehicleInfo(res.data.data)
    })

    DieselVendorMasterService.getDieselVendors().then((response) => {
      let viewData = response.data.data
      console.log(viewData,'getDieselVendors')
      setDvData(viewData)
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

  const dieselVendorFinder = (vendor_code) => {

    console.log(dvData,'dieselVendorFinder-dvData')
    console.log(vendor_code,'dieselVendorFinder-vendor_code')
    let vendorName = '-'
    for (let i = 0; i < dvData.length; i++) {
      if (dvData[i].vendor_code == vendor_code) {
        vendorName = dvData[i].diesel_vendor_name
      }
    }
    console.log(vendorName,'dieselVendorFinder-vendorName')
    return vendorName
  }

  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content : () => componentRef.current,
  });

  const current = new Date();
  const date = `${current.getDate()}/${current.getMonth()+1}/${current.getFullYear()}`

  return (
    <>
      <CButton
        className="text-white"
        size='sm-lg'
        color="warning"
        style={{marginLeft:'690px'}}
        onClick={handleprint}
      >
        Print
      </CButton>
      <div
        style={
          {
            background:'white',
            height:'650px',
            width:'750px',
            paddingLeft:'21px',
            marginTop:'10px',
            paddingTop:'10px',
            marginLeft:'25px',
            paddingRight:'20px'
          }
        }
        ref={componentRef}
      >
        <table width="750" cellPadding="4" cellSpacing="0" border="0" className="table table-bordered">
          <tr  style={{border:'green',height:'650px'}}>
            <tr>
              <td width="700" align="center" style={{ paddingTop:'1px',paddingBottom:'0px' }}>
              {/* <Print_header /> */}
                <div style={hd}>
                  <div style={{width:'17%'}}><img style={imhr} src={rightLogo} /></div>
                    <div style={{width:'66%'}}>
                      <span style={h1s}>NAGA LIMITED</span>
                      <span style={h2s}>FOODS DIVISION</span>
                      <span style={h3s}>FSSAI No 10017042003098</span>
                      <span style={h4s}>Branch/Depot:NAGA LIMITED- FOODS,NO.1, TRICHY ROAD, DINDIGUL-624005</span>
                      <span style={h4s}>Ph:0451-2411123/2410121, Mo:9944990040,9944990050, Fax:0451-2410122</span>
                      <span style={h4s}>GSTIN:33AAACN2369L1ZD,PAN:AAACN2369L, CIN:U10611TN1991PLC020409,State Code-33</span>
                    </div>
                    <div style={{width:'17%'}}><img style={imhl} src={leftLogo} /></div>
                  </div>
              {/* <b><u><strong>DIESEL INTENT</strong></u></b><br /> */}
              <strong style={hd1}>DIESEL INTENT DOCUMENT</strong><br />
              </td>
            </tr>
            <tr>
              <td width="175" align="left"><strong>Tripsheet No</strong></td>
              <td width="175" align="left"> {TripSheet}</td>
              <td width="175" align="left"><strong>Tripsheet Date</strong></td>
              <td width="175" align="left"> {formatDate(TripSheetDate)}</td>
            </tr>
            <tr>
              <td width="175" align="left"><strong>Vehicle No</strong></td>
              <td width="175" align="left"> {vehicleNo}</td>
              <td width="175" align="left"><strong>Vehicle Type</strong></td>
              <td width="175" align="left"> {vehicleId}</td>
            </tr>
            <tr>
              <td width="175" align="left"><strong>Vehicle Capacity</strong></td>
              <td width="175" align="left"> {vehicle_capacity}</td>
              <td width="175" align="left"><strong>Yard Gate In Date&Time</strong></td>
              <td width="175" align="left"> {Gate_in_date}</td>
            </tr>
            <tr>
              <td width="175" align="left"><strong>Driver Name</strong></td>
              <td width="175" align="left"> {driver_name}</td>
              <td width="175" align="left"><strong>Driver Mobile</strong></td>
              <td width="175" align="left"> {driver_contact_number}</td>
            </tr>

            <tr>
              {vehicleId != 'Hire' &&
                <td width="175" align="left">
                  <strong>Opening Odometer KM</strong>
                </td>
              }
              {vehicleId != 'Hire' &&
                <td width="175" align="left"> {odometer_km}</td>
              }
              {vehicleId == 'Hire' &&
                <td width="175" align="left">
                  <strong>Shed Name</strong>
                </td>
              }
              {vehicleId == 'Hire' &&
                <td width="175" align="left"> {shedName}</td>
              }
              <td width="175" align="left">
                <strong>Inspection Date&Time</strong>
              </td>
              <td width="175" align="left"> {inspection_time_string || '-'}</td>
            </tr>
            {singleVehicleInfo.rate_of_ltrs != null &&
              <tr>
                <td width="175" align="left"><strong>Rate Per Liter</strong></td>
                <td width="175" align="left"> {singleVehicleInfo.rate_of_ltrs}</td>
                <td width="175" align="left"><strong>Diesel Liters</strong></td>
                <td width="175" align="left"> {singleVehicleInfo.no_of_ltrs}</td>
              </tr>
            }
            <tr>
              <td width="175" align="left"><strong>Diesel Vendor Name</strong></td>
              {/* <td width="175" align="left"> {singleVehicleInfo.vendor_code == '225831' ? 'RNS Fuel Station' : 'RS Petroleum'}</td> */}
              <td width="175" align="left"> {dieselVendorFinder(singleVehicleInfo.vendor_code)}</td>
              <td width="175" align="left"><strong>Total Amount</strong></td>
              <td width="175" align="left"> {singleVehicleInfo.total_amount == 0 ? 'Fill Tank'  : singleVehicleInfo.total_amount}</td>
            </tr>
            {singleVehicleInfo.rate_of_ltrs != null &&
              <tr>
                <td width="175" align="left"><strong>Invoice Date</strong></td>
                <td width="175" align="left"> {singleVehicleInfo.diesel_invoice_date}</td>
                <td width="175" align="left"><strong>Invoice No</strong></td>
                <td width="175" align="left"> {singleVehicleInfo.invoice_no}</td>
              </tr>
            }
            {singleVehicleInfo.diesel_vendor_sap_invoice_no != null &&
              <tr>
                {singleVehicleInfo.diesel_vendor_sap_invoice_no != null &&
                  <td width="175" align="left">
                    <strong>SAP Invoice No</strong>
                  </td>}
                {singleVehicleInfo.diesel_vendor_sap_invoice_no != null &&
                  <td width="175" align="left"> {singleVehicleInfo.diesel_vendor_sap_invoice_no}</td>
                }
                {vehicleId == 'Hire' &&
                  <td width="175" align="left">
                    <strong>Total Freight</strong>
                  </td>
                }
                {vehicleId == 'Hire' &&
                  <td width="175" align="left"> {FreightAmount}</td>
                }
                {vehicleId == 'Hire' && singleVehicleInfo.diesel_vendor_sap_invoice_no == null &&
                  <td width="175" align="left"><strong></strong></td>
                }
                {vehicleId == 'Hire' && singleVehicleInfo.diesel_vendor_sap_invoice_no == null &&
                  <td width="175" align="left"></td>
                }
                {vehicleId != 'Hire' &&
                  <td width="175" align="left"><strong></strong></td>
                }
                {vehicleId != 'Hire' &&
                  <td width="175" align="left"></td>
                }
              </tr>
            }
            <tr>
              <td width="700" align="left" colSpan="4">
                <strong>Remarks</strong>: {singleVehicleInfo.remarks || '-'}
              </td>
            </tr>
            <tr>
              {/* <Print_footer /> */}
              <td width="175" align="left"><strong>Print Date  </strong></td>
              <td width="175" align="left">: {date}</td>
              <td width="175" align="left"><strong>Authorized Signature   </strong></td>
              <td width="175" align="left"></td>
            </tr>
            <tr>
              <td width="175" align="left"><strong>User ID   </strong></td>
              <td width="175" align="left">: {user_name}</td>
              <td width="175" align="left"><strong>Name  </strong></td>
              <td width="175" align="left"></td>
            </tr>
          </tr>
        </table>
      </div>
    </>
  )
}

export default NlmtDIPrint
