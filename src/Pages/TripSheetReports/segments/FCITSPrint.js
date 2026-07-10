import {CButton} from '@coreui/react'
import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import leftLogo from 'src/assets/naga/left.png'
import rightLogo from 'src/assets/naga/right.jpg' 
import{ useReactToPrint } from 'react-to-print' 
import UserLoginMasterService from 'src/Service/Master/UserLoginMasterService' 
import QRCode from 'react-qr-code'
import FCITripsheetCreationService from 'src/Service/FCIMovement/FCITripsheetCreation/FCITripsheetCreationService'

const FCITSPrint = ({}) => {
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
  const [created_by, setCreated_by] = useState('') 

  useEffect(() => {
    FCITripsheetCreationService.getTripeInfoById(id).then((res) => {
      let viwdata = res.data.data
      console.log(res.data.data,'getTripeInfoById')
      if(viwdata){
        setSingleVehicleInfo(res.data.data)
        setVehicleNo(viwdata.vehicle_no)
      }
      
    })
  },[])

  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content : () => componentRef.current,
  });

  const current = new Date();
  const date = `${current.getDate()}/${current.getMonth()+1}/${current.getFullYear()}`

  const user_info_json = localStorage.getItem('user_info')
  const user_info = JSON.parse(user_info_json) 
  const user_name = user_info.emp_name

  useEffect(() => {
    if(singleVehicleInfo.created_by){
      UserLoginMasterService.getUserById(singleVehicleInfo.created_by).then((response) => {
        let needed_data = response.data.data
        console.log(needed_data)
        setCreated_by(needed_data.emp_name) 
      })
    }
  },[singleVehicleInfo.created_by])

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
        style={{background:'white',height:'650px',width:'750px',paddingLeft:'21px',marginTop:'6px',paddingTop:'6px',marginLeft:'25px',paddingRight:'20px'}}
        ref={componentRef} 
      >
        <table 
          width="750" 
          cellPadding="4" 
          cellSpacing="0" 
          border="0" 
          className="table table-bordered"
        >
          <tr  
            style={{border:'green',height:'650px'}}
          >
            <tr>
      
              <td width="700" align="center" style={{ paddingTop:'1px',paddingBottom:'0px' }}>
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
                <strong style={hd1}>FCI TRIPSHEET DETAILS</strong><br />
              </td>
            </tr>
            <tr>
              <td width="175" align="left"><strong>Tripsheet No</strong></td>
              <td width="175" align="left"> {singleVehicleInfo.fci_tripsheet_no}</td>        
              <td width="175" align="left"><strong>Tripsheet Date</strong></td>
              <td width="175" align="left"> {singleVehicleInfo.created_date}</td>
            </tr>
            <tr>
              <td width="175" align="left"><strong>PO No</strong></td>
              <td width="175" align="left"> {singleVehicleInfo.po_no}</td>        
              <td width="175" align="left"><strong>From Plant Name</strong></td>
              { singleVehicleInfo.fci_plant_info && (
                <td width="175" align="left"> 
                  {`${singleVehicleInfo.fci_plant_info.plant_name} (${singleVehicleInfo.fci_plant_info.plant_symbol})`}
                </td>
              )}
            </tr>
            <tr>
              <td width="175" align="left"><strong>Vehicle No</strong></td>
              <td width="175" align="left"> {vehicleNo}</td>
              <td width="175" align="left"><strong>QR Code</strong></td>
              <td width="175" align="left">
                {/* <strong><u>QR Code</u></strong>  */}
                <div style={{ height: "auto", display:"flex",justifyContent: 'end', maxWidth: 64, width: "100%" }}>
                
                  <QRCode size={256} viewBox={`0 0 256 256`} value={vehicleNo} style={{marginTop:"5px", height: "auto", maxWidth: "100%", width: "100%" }} />
                
                </div>
              </td>
              
            </tr>     
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
          </tr>
        </table>
      </div>
   
    </>
  )}

export default FCITSPrint