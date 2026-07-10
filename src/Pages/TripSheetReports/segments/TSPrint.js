
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
import leftLogo from 'src/assets/naga/left.png'
import rightLogo from 'src/assets/naga/right.jpg'
import SmallLoader from 'src/components/SmallLoader'
import ReportService from 'src/Service/Report/ReportService'
import houseofnaga from 'src/assets/naga/houseofnaga.png'
import nagalogo from 'src/assets/naga/nagalogo.png'
import{ useReactToPrint } from 'react-to-print'
import Print_header from 'src/components/printheadercomponent/print_header'
import Print_footer from 'src/components/printheadercomponent/print_footer'
import UserLoginMasterService from 'src/Service/Master/UserLoginMasterService'
import DivisionApi from 'src/Service/SubMaster/DivisionApi'
import QRCode from 'react-qr-code'

const TSPrint = ({
}) => {
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
  const [driver_contact_number_own, setDriver_contact_number_own] = useState('')
  const [odometer_km, setOdometer_km] = useState('')
  const [inspection_time_string, setInspection_time_string] = useState('')
  const [shedName, setShedName] = useState('')
  const [created_by, setCreated_by] = useState('')
  const [vendorName, setVendorName] = useState('')
  const [vendorCode, setVendorCode] = useState('')
  const [vendor_contact_number, setVendor_contact_number] = useState('')
  const [shed_contact_number, setShed_contact_number] = useState('')

  const vehicleTypeFinder = (data) => {
    let veh_type = ''
    // console.log(data,'data-vehicleTypeFinder')
    if(data.vehicle_type_id.id == 4 && data.vehicle_others_type == 2){
      veh_type = 'D2R Vehicle'
    } else {
      veh_type = data.vehicle_type_id.type
    }
    return veh_type
  }

  useEffect(() => {
    ReportService.singleTripDetailsList(id).then((res) => {
      console.log(res.data.data,'singleTripDetailsList')
      setVehicleNo(res.data.data.parking_info.vehicle_number)
      setGate_in_date(res.data.data.parking_info.gate_in_date_time_string)
      setVehicleId(vehicleTypeFinder(res.data.data.parking_info))
      setVehicle_capacity(res.data.data.parking_info.vehicle_capacity_id.capacity)
      setDriver_name(res.data.data.parking_info.driver_name)
      setDriver_contact_number(res.data.data.parking_info.driver_contact_number)
      setOdometer_km(res.data.data.parking_info.odometer_km)
      setInspection_time_string(res.data.data.parking_info.vehicle_inspection_trip !=null ? res.data.data.parking_info.vehicle_inspection_trip.inspection_time_string:'')
      setShedName(res.data.data.parking_info.vehicle_document !=null ? res.data.data.parking_info.vehicle_document.Shed_info.shed_name:(res.data.data.parking_info.vendor_info != null ? res.data.data.parking_info.vendor_info.shed_info.shed_name:''))
      setDriver_contact_number_own(res.data.data.parking_info.driver_info !=null ? res.data.data.parking_info.driver_info.driver_phone_1 : '')
      setSingleVehicleInfo(res.data.data)
      setVendorName(res.data.data.parking_info.vendor_info == null ? '' : (res.data.data.parking_info.vendor_info.vendor_code == 0 ? `${res.data.data.parking_info.vendor_info.owner_name} - ${res.data.data.parking_info.vendor_info.pan_card_number}` : res.data.data.parking_info.vendor_info.owner_name))
      setVendorCode(res.data.data.parking_info.vendor_info == null ? '' : (res.data.data.parking_info.vendor_info.vendor_code))
      setVendor_contact_number(res.data.data.parking_info.vendor_info == null ? '' : res.data.data.parking_info.vendor_info.owner_number)
      setShed_contact_number(res.data.data.parking_info.vehicle_document !=null ? res.data.data.parking_info.vehicle_document.Shed_info.shed_owner_phone_1:(res.data.data.parking_info.vendor_info != null ? res.data.data.parking_info.vendor_info.shed_info.shed_owner_phone_1:''))
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
function printReceipt() {
  window.print();
}
const componentRef = useRef();
const handleprint = useReactToPrint({
  content : () => componentRef.current,
});

const PURPOSE = {
  FG_SALES: 1,
  FG_STO: 2,
  RM_STO: 3,
  OTHERS: 4,
}
const current = new Date();
const date = `${current.getDate()}/${current.getMonth()+1}/${current.getFullYear()}`

const user_info_json = localStorage.getItem('user_info')
const user_info = JSON.parse(user_info_json)
// const user_name = user_info.username
const user_name = user_info.emp_name

useEffect(() => {
  if(singleVehicleInfo.created_by){
    UserLoginMasterService.getUserById(singleVehicleInfo.created_by).then((response) => {
      let needed_data = response.data.data
      console.log(needed_data)
      setCreated_by(needed_data.emp_name)
      // setCreated_by(needed_data.username)
    })
  }
},[singleVehicleInfo.created_by])
  
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

  <CButton className="text-white" size='sm-lg' color="warning" style={{marginLeft:'690px'}}
            onClick={handleprint}>Print</CButton>
<div style={{background:'white',height:'650px',width:'750px',paddingLeft:'21px',marginTop:'6px',paddingTop:'6px',marginLeft:'25px',paddingRight:'20px'}}ref={componentRef} >
   <table width="750" cellPadding="4" cellSpacing="0" border="0" className="table table-bordered">
   <tr  style={{border:'green',height:'650px'}}>
    <tr>
    {/* <td width="700" align="center" style={{ paddingTop:'1px',paddingBottom:'0px' }}>
    
    <Print_header />
    <u><strong>TRIPSHEET DETAILS</strong></u>    
    <br />
    </td> */}
      <td width="700" align="center" style={{ paddingTop:'1px',paddingBottom:'0px' }}>
        <div style={hd}>
          <div style={{width:'17%'}}><img style={imhr} src={rightLogo} /></div>
          <div style={{width:'66%'}}>
            <span style={h1s}>NAGA LIMITED</span> 
            <span style={h2s}>LOGISTICS DIVISION</span>
            <span style={h3s}>FSSAI No 10017042003098</span>
            <span style={h4s}>NO.1, TRICHY ROAD, DINDIGUL-624005, Tamilnadu</span>  
            <span style={h4s}>GSTIN:33AAACN2369L1ZD,PAN:AAACN2369L,</span>
            <span style={h4s}>CIN:U10611TN1991PLC020409,State Code-33</span>              
          </div>
          <div style={{width:'17%'}}><img style={imhl} src={leftLogo} /></div>
        </div>
        <strong style={hd1}>TRIPSHEET DETAILS</strong><br />
      </td>
    </tr>
      <tr>
        <td width="175" align="left"><strong>Tripsheet No</strong></td>
        <td width="175" align="left"> {singleVehicleInfo.trip_sheet_no}</td>
        <td width="175" align="left"><strong>Tripsheet Date</strong></td>
        <td width="175" align="left"> {formatDate(singleVehicleInfo.created_at)}</td>
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
        <td width="175" align="left"> {driver_contact_number_own || driver_contact_number}</td>
      </tr>

      <tr>
        {vehicleId == 'Hire' &&
          <>
            <td width="175" align="left"><strong>Vendor Name</strong></td>
            <td width="525" align="left"> {vendorName}</td> 
          </>    
        }   
      </tr>

      <tr>
        {vehicleId == 'Hire' &&
          <td width="175" align="left"><strong>Vendor Code</strong></td>
        }
        {vehicleId == 'Hire' &&
          <td width="175" align="left"> {vendorCode == 0 ? 'New Vendor': vendorCode}</td>
        }
        {vehicleId == 'Hire' &&
          <td width="175" align="left"><strong>Vendor Mobile</strong></td>
        }
        {vehicleId == 'Hire' &&
          <td width="175" align="left"> {vendor_contact_number}</td>
        }
      </tr>

      <tr>
        {(vehicleId == 'Own' || vehicleId == 'Contract')  &&
          <td width="175" align="left"><strong>Odometer KM</strong></td>
        }
        {(vehicleId == 'Own' || vehicleId == 'Contract')  &&
          <td width="175" align="left"> {odometer_km}</td>
        }
        {vehicleId == 'Hire' &&
          <td width="175" align="left"><strong>Shed Name</strong></td>
        }
        {vehicleId == 'Hire' &&
          <td width="175" align="left"> {shedName}</td>
        }

        {vehicleId == 'Hire' && singleVehicleInfo.purpose == PURPOSE.OTHERS && (
          <>
            <td width="175" align="left"><strong>Shed Mobile</strong></td>
            <td width="175" align="left">{shed_contact_number}</td>
          </>
        )}
        {singleVehicleInfo.purpose != PURPOSE.OTHERS &&
          <td width="175" align="left"><strong>Inspection Date&Time</strong></td>
        }
        {singleVehicleInfo.purpose != PURPOSE.OTHERS &&
          <td width="175" align="left"> {inspection_time_string || '-'}</td>
        }
      </tr>
      <tr>
        <td width="175" align="left"><strong>Trip Advance Eligibility</strong></td>
        <td width="175" align="left"> {singleVehicleInfo.trip_advance_eligiblity == '1' ? 'Yes' : 'No'}</td>
        <td width="175" align="left"><strong>Divison</strong></td>
        <td width="175" align="left"> {singleVehicleInfo.purpose != PURPOSE.OTHERS ? singleVehicleInfo.to_divison == '2' ? 'NLCD':'NLFD' : othersDivisionName}</td>
      </tr>

      <tr>
      <td width="175" align="left"><strong>Purpose</strong></td>
        <td width="175" align="left"> {singleVehicleInfo.purpose== PURPOSE.FG_SALES
              ? 'FG Sales' : singleVehicleInfo.purpose== PURPOSE.FG_STO
              ? 'FG STO' : singleVehicleInfo.purpose == PURPOSE.RM_STO
              ? 'RM STO' : singleVehicleInfo.purpose == PURPOSE.OTHERS
              ? 'OTHERS' : singleVehicleInfo.parking_info && singleVehicleInfo.parking_info.vehicle_type_id && singleVehicleInfo.parking_info.vehicle_type_id.id == 4 && singleVehicleInfo.parking_info.vehicle_others_type == 2 
              ? 'D2R FG Sales' : singleVehicleInfo.parking_info && singleVehicleInfo.parking_info.vehicle_type_id && singleVehicleInfo.parking_info.vehicle_type_id.id == 4 && singleVehicleInfo.parking_info.vehicle_others_type == 1 
              ? 'Party FG Sales': ''}</td>
        <td width="175" align="left"><strong>Expected Delivery Date</strong></td>
        <td width="175" align="left"> {formatDate(singleVehicleInfo.expected_date_time)}</td>
      </tr>
      {/* <tr>
        <td width="175" align="left"><strong>Expected Return Date</strong></td>
        <td width="175" align="left">: {formatDate(singleVehicleInfo.expected_return_date_time)}</td>
        <td width="175" align="left"><strong> </strong></td>
        <td width="175" align="left"></td>
      </tr> */}
      <tr>
        <td width="525" colSpan={3} align="left"><strong>Remarks :   </strong>{singleVehicleInfo.remarks || '-'}</td>
        <td width="175" align="left">
          <strong><u>QR Code</u></strong> 
          <div style={{ height: "auto", display:"flex",justifyContent: 'end', maxWidth: 64, width: "100%" }}>
          
            <QRCode size={256} viewBox={`0 0 256 256`} value={vehicleNo} style={{marginTop:"5px", height: "auto", maxWidth: "100%", width: "100%" }} />
          
          </div>
        </td>
      </tr>
      {/* <br /> */}
        {/* <Print_footer /> */}
        <tr>
          <td width="175" align="left"><strong>Print Date  </strong></td>
          <td width="175" align="left"> {date}</td>
          <td width="175" align="left"><strong>Authorized Signature   </strong></td>
          <td width="175" align="left"></td>
        </tr>
        <tr>
          <td width="175" align="left"><strong>Print/Created By   </strong></td>
          <td width="175" align="left"> {user_name}/{created_by}</td>
          <td width="175" align="left"><strong>Name  </strong></td>
          <td width="175" align="left"></td>
        </tr>
        {/* <hr style={{ height:'2px',borderWidth:'0',color:'green',backgroundColor:'green' }}/> */}
        {/* <tr>
          <td width="175" align="left"><strong></strong></td>
        </tr> */}
      </tr>
    </table>
</div>
   
    </>
  )
}

export default TSPrint