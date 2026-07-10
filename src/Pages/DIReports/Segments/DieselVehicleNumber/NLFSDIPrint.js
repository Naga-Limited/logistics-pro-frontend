import {CButton} from '@coreui/react'
import React, { useEffect, useRef, useState } from 'react'
import leftLogo from 'src/assets/naga/left.png'
import rightLogo from 'src/assets/naga/right.jpg'
import { useParams } from 'react-router-dom' 
import{ useReactToPrint } from 'react-to-print'
import NLFSDieselIntentService from 'src/Service/NLFS/Master/NLFSDieselIntentService'
  
const NLFSDIPrint = ({}) => {
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
   
  const user_info_json = localStorage.getItem('user_info')
  const user_info = JSON.parse(user_info_json)
  const user_name = user_info.username 

  const vehType = ['','Vehicle','Barel','Others','Car']

  useEffect(() => { 
    NLFSDieselIntentService.singleNlfsDieselDetailsList(id).then((res) => {
      console.log(res.data.data,'singleNlfsDieselDetailsList')
      
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

  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content : () => componentRef.current,
  });

  const dieselForFinder = (dd) => {
    let df = '-'
    if(dd.diesel_to == 1){
      if(dd.vehicle_info && dd.vehicle_info.vehicle_variety_info && dd.vehicle_info.vehicle_variety_info.vehicle_variety == 'CAR'){
        df = 'Car'
      }
    } else {
      df = vehType[dd.diesel_to]
    }
    return df
  }

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
                      <span style={h2s}>FUEL STATION</span>
                      <span style={h3s}>FSSAI No /PESO/P/SC/TN/14/11352-P627170</span>
                      <span style={h3s}>Branch/Depot:NAGA LIMITED,NO.9,TRICHY ROAD,DINDIGUL-624005</span>
                      <span style={h4s}>Ph:,Mo:9944990086</span> 
                      <span style={h4s}>GSTIN:33AAACN2369L1ZD,PAN:AAACN2369L, CIN:U10611TN1991PLC020409,State Code-33</span>                 
                    </div>
                    <div style={{width:'17%'}}><img style={imhl} src={leftLogo} /></div>
                  </div> 
              <strong style={hd1}>NLFS DIESEL INDENT</strong><br />
              </td>
            </tr>
            <tr>
              <td width="175" align="left"><strong>Diesel Indent No.</strong></td>
              <td width="175" align="left"> {singleVehicleInfo.di_no}</td> 
              <td width="175" align="left"><strong>Diesel For</strong></td>
              <td width="175" align="left"> {dieselForFinder(singleVehicleInfo)}</td>
            </tr>
            <tr> 
              <td width="175" align="left"><strong>{singleVehicleInfo.diesel_to == 2 ? 'Carry Vehicle No.' : 'Vehicle No.'} </strong></td>
              <td width="175" align="left"> {singleVehicleInfo.diesel_to == 2 ? singleVehicleInfo.carry_vehicle : singleVehicleInfo.vehicle_info?.vehicle_no}</td>
              <td width="175" align="left"><strong>Vehicle Capacity</strong></td>
              <td width="175" align="left"> {`${singleVehicleInfo.diesel_to == 2 ? '-' : singleVehicleInfo.vehicle_info?.vehicle_capacity_info?.capacity + ' Ton'}`}</td>
            </tr>
            <tr> 
              <td width="175" align="left"><strong>Division</strong></td>
              <td width="175" align="left"> {`${singleVehicleInfo.division_info?.division_name} (${singleVehicleInfo.division_info?.short_name})`}</td>
              <td width="175" align="left">
                <strong>Remarks</strong>:
              </td>
              <td width="175" align="left">  {singleVehicleInfo.remarks || '-'}</td>
            </tr>
             
            {singleVehicleInfo.sap_fuel_rate != null &&
              <tr>
                <td width="175" align="left"><strong>Rate Per Liter</strong></td>
                <td width="175" align="left"> {singleVehicleInfo.sap_fuel_rate}</td>
                <td width="175" align="left"><strong>Diesel Liters</strong></td>
                <td width="175" align="left"> {singleVehicleInfo.fuel_quantity}</td>
              </tr>
            }
            <tr>
              <td width="175" align="left"><strong>Diesel Vendor Name</strong></td> 
              <td width="175" align="left"> {'NAGA LIMITED FUEL STATION'}</td>
              <td width="175" align="left"><strong>Total Amount</strong></td>
              <td width="175" align="left"> {singleVehicleInfo.total_amount}</td>
            </tr>
            {singleVehicleInfo.sap_fuel_rate != null &&
              <tr>
                <td width="175" align="left"><strong>Dispensary/Bill No</strong></td>
                <td width="175" align="left"> {singleVehicleInfo.invoice_no}</td>
                <td width="175" align="left"><strong>Bill/Date</strong></td>
                <td width="175" align="left"> {formatDate(singleVehicleInfo.diesel_invoice_date)}</td>
              </tr>
            }  
            <tr> 
              <td width="175" align="left"><strong>Indent Created By</strong></td>
              <td width="175" align="left">: {singleVehicleInfo.creation_user_info?.emp_name}</td>
              <td width="175" align="left"><strong>Diesel Filled/Confirmed By</strong></td>
              <td width="175" align="left"></td>
            </tr>
            <tr>
              <td width="175" align="left"><strong>Date</strong></td>
              <td width="175" align="left">: {singleVehicleInfo.created_at}</td>
              <td width="175" align="left"><strong>Date</strong></td>
              <td width="175" align="left"></td>
            </tr>
          </tr>
        </table>
      </div>
    </>
  )
}
  
export default NLFSDIPrint