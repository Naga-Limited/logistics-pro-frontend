import { CButton } from '@coreui/react'
import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import leftLogo from 'src/assets/naga/left.png'
import rightLogo from 'src/assets/naga/right.jpg' 
import{ useReactToPrint } from 'react-to-print' 
import UserLoginMasterService from 'src/Service/Master/UserLoginMasterService'
import DivisionApi from 'src/Service/SubMaster/DivisionApi'
import QRCode from 'react-qr-code'
import NlmtReportService from 'src/Service/Nlmt/Report/NlmtReportService'
import * as NlmtScreenAccessCodes from 'src/components/constants/NlmtScreenAccessCodes'
import Loader from 'src/components/Loader' 
import AccessDeniedComponent from 'src/components/commoncomponent/AccessDeniedComponent'
import JavascriptInArrayComponent from 'src/components/commoncomponent/JavascriptInArrayComponent'

const NlmtTSPrint = ({}) => {
  const { id } = useParams()

  /*================== User Location Fetch ======================*/
    const user_info_json = localStorage.getItem('user_info')
    const user_info = JSON.parse(user_info_json)
    const user_name = user_info.emp_name
    const user_locations = []
  
    /* Get User Locations From Local Storage */
    user_info.location_info.map((data, index) => {
      user_locations.push(data.id)
    })
  
    // console.log(user_locations)
    /*================== User Location Fetch ======================*/
  /* ==================== Access Part Start ========================*/
  const [screenAccess, setScreenAccess] = useState(false)
  let page_no1 = NlmtScreenAccessCodes.NlmtReportScreens.Nlmt_Tripsheet_Report
  let page_no2 = NlmtScreenAccessCodes.NlmtTSStatusScreens.Nlmt_Vehicle_Tripsheet_Status
  
  useEffect(()=>{
  
    if(user_info.is_admin == 1 || JavascriptInArrayComponent(page_no1,user_info.page_permissions) || JavascriptInArrayComponent(page_no2,user_info.page_permissions)){
      console.log('screen-access-allowed')
      setScreenAccess(true)
    } else{
      console.log('screen-access-not-allowed')
      setScreenAccess(false)
    }
  
  },[])
  /* ==================== Access Part End ========================*/

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
    fontSize:'26px',
    fontWeight:'bold'
  }

  const h2s = {
    display:'block',
    fontFamily:'timesnewroman',
    fontSize:'16px',
    fontWeight:'bold',
    marginTop:'-10px'
  }

  const h2s1 = {
    display:'block',
    fontFamily:'timesnewroman',
    fontSize:'12px',
    fontWeight:'bold',
    marginTop:'5px'
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
    width:'140px',
    height:'125px'
  }

  const imhr = {
    width:'140px',
    height:'125px'
  }

  const [vehicleNo, setVehicleNo] = useState('')
  const [vehicleId, setVehicleId] = useState('')
  const [fetch, setFetch] = useState(false)
  const [vehicle_capacity, setVehicle_capacity] = useState('')
  const [Gate_in_date, setGate_in_date] = useState('')
  const [driver_name, setDriver_name] = useState('')
  const [driver_contact_number, setDriver_contact_number] = useState('')
  const [driver_contact_number_own, setDriver_contact_number_own] = useState('')
  const [odometer_km, setOdometer_km] = useState('')
  const [inspection_time_string, setInspection_time_string] = useState('')
  const [shedName, setShedName] = useState('')
  const [created_by, setCreated_by] = useState('')
  const [vendorName, setVendorName] = useState('')
  const [vendorCode, setVendorCode] = useState('')
  const [vendor_contact_number, setVendor_contact_number] = useState('')
  const [shed_contact_number, setShed_contact_number] = useState('')

  const vehicleTypeFinder = (vehicleTypeId) => {
    const map = {
      21: 'Own',
      22: 'Hire',
      23: 'Party',
    }

    return map[vehicleTypeId] || ''
  }


  useEffect(() => {
    if (!id) return

    NlmtReportService.singleTripDetailsList(id).then((res) => {
      setFetch(true)
      const data = res.data.data
      console.log(data,'singleTripDetailsList')

      setSingleVehicleInfo(data)

      // Vehicle
      setVehicleNo(data.nlmt_vehicle_info?.vehicle_number || '')
      setVehicle_capacity(data.nlmt_vehicle_info?.vehicle_capacity_id || '')

      // Vehicle Type
      setVehicleId(
        vehicleTypeFinder(
          data.nlmt_vehicle_info
        )
      )

      // Trip in
      setGate_in_date(data.trip_in_date_time || '')
      setOdometer_km(data.odometer_km || '')

      // Driver
      setDriver_name(data.nlmt_driver_info?.driver_name || data.driver_name || '')
      setDriver_contact_number(data.nlmt_driver_info?.driver_phone_1 || data.driver_phone_1 || '')

      // Vendor
      setVendorName(data.vendor_info?.owner_name || '')
      setVendorCode(data.vendor_info?.vendor_code || '')
      setVendor_contact_number(data.vendor_info?.owner_number || '')

    })
  }, [id])

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

  function printReceipt() {
    window.print();
  }

  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content : () => componentRef.current,
  });

  const current = new Date();
  const date = `${current.getDate()}/${current.getMonth()+1}/${current.getFullYear()}`

  useEffect(() => {
    if(singleVehicleInfo.created_by){
      UserLoginMasterService.getUserById(singleVehicleInfo.created_by).then((response) => {
        let needed_data = response.data.data
        console.log(needed_data,'needed_data')
        setCreated_by(needed_data.emp_name)
        // setCreated_by(needed_data.username)
      })
    }
  },[singleVehicleInfo.created_by])

  console.log(singleVehicleInfo,'singleVehicleInfo');
  const othersDivisionArray = ['','NLFD','NLFA','NLDV','NLMD','NLLD','NLCD','NLIF','NLSD']
  const [othersDivisionName, setOthersDivisionName] = useState('')

  useEffect(() => {
    if(singleVehicleInfo.others_division){
      DivisionApi.getDivisionById(singleVehicleInfo.others_division).then((response) => {
        let editData = response.data.data
        if(editData){
          setOthersDivisionName(othersDivisionArray[editData.id])
        }
      })
    }
  },[singleVehicleInfo.others_division])

  return (
    <>
      {!fetch && <Loader />}
      {fetch && (
        <>
          {screenAccess ? (
            <>
      <CButton
        className="text-white"
        size="sm-lg"
        color="warning"
        style={{ marginLeft: '690px' }}
        onClick={handleprint}
      >
        Print
      </CButton>

      <div
        style={{
          background: 'white',
          height: '650px',
          width: '750px',
          paddingLeft: '21px',
          marginTop: '6px',
          paddingTop: '6px',
          marginLeft: '25px',
          paddingRight: '20px'
        }}
        ref={componentRef}
      >
        <table
          width="750"
          cellPadding="4"
          cellSpacing="0"
          border="0"
          className="table table-bordered"
        >
          <tr style={{ border: 'green', height: '650px' }}>
            <tr>
              <td
                width="700"
                align="center"
                style={{ paddingTop: '1px', paddingBottom: '0px' }}
              >
                <div style={hd}>
                  <div style={{ width: '20%' }}>
                    <img style={imhr} src={rightLogo} />
                  </div>

                  <div style={{ width: '60%' }}>
                    <span style={h1s}>NAGA LIMITED</span>
                    <span style={h2s}>MINERALS DIVISION</span>
                    <span style={h4s}>Branch/Depot:NAGA LIMITED-MINERALS,</span>
                    <span style={h4s}>
                      PARCEL A AND B,V.O.CHIDAMBARANAR PORT TRUST
                    </span>
                    <span style={h4s}>
                      NO.138,TUTICORIN - 628004, Tamilnadu
                    </span>
                    <span style={h4s}>
                      GSTIN:33AAACN2369L1ZD,PAN:AAACN2369L,
                    </span>
                    <span style={h4s}>
                      CIN:U10611TN1991PLC020409,State Code-33
                    </span>
                  </div>

                  <div style={{ width: '20%' }}>
                    <img style={imhl} src={leftLogo} />
                  </div>
                </div>

                <strong style={hd1}>TRIPSHEET DETAILS</strong>
                <br />
              </td>
            </tr>

            <tr>
              <td width="175" align="left">
                <strong>Tripsheet No</strong>
              </td>
              <td width="175" align="left">
                {singleVehicleInfo.nlmt_tripsheet_info?.nlmt_tripsheet_no}
              </td>
              <td width="175" align="left">
                <strong>Tripsheet Date</strong>
              </td>
              <td width="175" align="left">
                {formatDate(singleVehicleInfo.nlmt_tripsheet_info?.created_at)}
              </td>
            </tr>

            <tr>
              <td width="175" align="left">
                <strong>Vehicle No</strong>
              </td>
              <td width="175" align="left">
                {singleVehicleInfo.nlmt_vehicle_info?.vehicle_number}
              </td>
              <td width="175" align="left">
                <strong>Vehicle Type</strong>
              </td>
              <td width="175" align="left">
                {vehicleTypeFinder(
                  singleVehicleInfo.nlmt_vehicle_info?.vehicle_type_id
                )}
              </td>
            </tr>

            <tr>
              <td width="175" align="left">
                <strong>Vehicle Capacity</strong>
              </td>
              <td width="175" align="left">
                {singleVehicleInfo.nlmt_vehicle_info?.vehicle_capacity_id}
              </td>
              <td width="175" align="left">
                <strong>Trip In Date&Time</strong>
              </td>
              <td width="175" align="left">
                {singleVehicleInfo.trip_in_date_time}
              </td>
            </tr>

            <tr>
              <td width="175" align="left">
                <strong>Driver Name</strong>
              </td>
              <td width="175" align="left">
                {singleVehicleInfo.nlmt_driver_info?.driver_name ||
                  singleVehicleInfo.driver_name}
              </td>
              <td width="175" align="left">
                <strong>Driver Mobile</strong>
              </td>
              <td width="175" align="left">
                {singleVehicleInfo.nlmt_driver_info?.driver_phone_1 ||
                  singleVehicleInfo.driver_phone_1}
              </td>
            </tr>

            <tr>
              {vehicleId == 'Hire' && (
                <>
                  <td width="175" align="left">
                    <strong>Vendor Name</strong>
                  </td>
                  <td width="525" align="left">
                    {singleVehicleInfo.vendor_info?.owner_name}
                  </td>
                </>
              )}
            </tr>

            <tr>
              {vehicleId == 'Hire' && (
                <td width="175" align="left">
                  <strong>Vendor Code</strong>
                </td>
              )}

              {vehicleId == 'Hire' && (
                <td width="175" align="left">
                  {singleVehicleInfo.vendor_info?.owner_name == 0
                    ? 'New Vendor'
                    : vendorCode}
                </td>
              )}

              {vehicleId == 'Hire' && (
                <td width="175" align="left">
                  <strong>Vendor Mobile</strong>
                </td>
              )}

              {vehicleId == 'Hire' && (
                <td width="175" align="left">
                  {singleVehicleInfo.vendor_info?.owner_number}
                </td>
              )}
            </tr>

            <tr>
              {(vehicleId == 'Own' || vehicleId == 'Contract') && (
                <td width="175" align="left">
                  <strong>Odometer KM</strong>
                </td>
              )}

              {(vehicleId == 'Own' || vehicleId == 'Contract') && (
                <td width="175" align="left">
                  {singleVehicleInfo.odometer_km}
                </td>
              )}

              {vehicleId == 'Hire' && (
                <td width="175" align="left">
                  <strong>Shed Name</strong>
                </td>
              )}

              {vehicleId == 'Hire' && (
                <td width="175" align="left">
                  {shedName}
                </td>
              )}
            </tr>

            <tr>
              <td width="175" align="left">
                <strong>Trip Advance Eligibility</strong>
              </td>
              <td width="175" align="left">
                {singleVehicleInfo.nlmt_tripsheet_info?.advance_request == '0'
                  ? 'No'
                  : 'Yes'}
              </td>
              <td width="175" align="left">
                <strong>Divison</strong>
              </td>
              <td width="175" align="left">
                {'NLMT'}
              </td>
            </tr>

            <tr>
              <td width="175" align="left">
                <strong>Purpose</strong>
              </td>
              <td width="175" align="left">
                {'FG-Sales'}
              </td>
              <td width="175" align="left">
                <strong>Expected Delivery Date</strong>
              </td>
              <td width="175" align="left">
                {formatDate(
                  singleVehicleInfo.nlmt_tripsheet_info?.expected_delivery_date
                )}
              </td>
            </tr>

            <tr>
              <td width="525" colSpan={3} align="left">
                <strong>Remarks : </strong>
                {singleVehicleInfo.nlmt_tripsheet_info?.remarks || '-'}
              </td>

              <td width="175" align="left">
                <strong>
                  <u>QR Code</u>
                </strong>

                <div
                  style={{
                    height: 'auto',
                    display: 'flex',
                    justifyContent: 'end',
                    maxWidth: 64,
                    width: '100%'
                  }}
                >
                  <QRCode
                    size={256}
                    viewBox={`0 0 256 256`}
                    value={vehicleNo}
                    style={{
                      marginTop: '5px',
                      height: 'auto',
                      maxWidth: '100%',
                      width: '100%'
                    }}
                  />
                </div>
              </td>
            </tr>

            <tr>
              <td width="175" align="left">
                <strong>Print Date</strong>
              </td>
              <td width="175" align="left">
                {date}
              </td>
              <td width="175" align="left">
                <strong>Authorized Signature</strong>
              </td>
              <td width="175" align="left"></td>
            </tr>

            <tr>
              <td width="175" align="left">
                <strong>Print/Created By</strong>
              </td>
              <td width="175" align="left">
                {user_name}/{created_by}
              </td>
              <td width="175" align="left">
                <strong>Name</strong>
              </td>
              <td width="175" align="left"></td>
            </tr>
          </tr>
        </table>
      </div>
            </>
          ) : (
            <AccessDeniedComponent />
          )}
        </>
      )}
    </>
  )
}

export default NlmtTSPrint
