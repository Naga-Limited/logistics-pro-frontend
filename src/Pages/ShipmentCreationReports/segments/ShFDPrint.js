
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

import{ useReactToPrint } from 'react-to-print'
import "./toPrint.css";
import leftLogo from 'src/assets/naga/left.png'
import rightLogo from 'src/assets/naga/right.jpg'
// import rightLogo from 'src/assets/naga/right1.png'
import VehicleAssignmentService from 'src/Service/VehicleAssignment/VehicleAssignmentService'
import DefinitionsListApi from 'src/Service/Definitions/DefinitionsListApi'
import Loader from 'src/components/Loader'
import { GetDateTimeFormat } from 'src/Pages/Depo/CommonMethods/CommonMethods';
// import ReactToPrint from 'react-to-print'

const ShFDPrint = ({}) => {
  const { id } = useParams()

  console.log(id,'id-id')

  let temp_pos = id.lastIndexOf('||')

  const shipment_id = id.substring(0,temp_pos)
  const parking_id = id.substring(temp_pos+2)

  console.log(parking_id,'parking_id')
  console.log(shipment_id,'shipment_id')

  const [reportData, setReportData] = useState(false)
  const [routeData, setRouteData] = useState(false)
  const [nlcdRouteData, setNLCDRouteData] = useState(false)
  const [plantData, setPlantData] = useState(false)
  const [incoTermData, setIncoTermData] = useState(false)
  const [fetch, setFetch] = useState(false)

  const [created_by, setCreated_by] = useState('')
  const [shipmentQty, setShipmentQty] = useState(0)

  const getDeliveryQuantity = data => {
    console.log(data)
    let qty = 0

    data.line_item_details.map((vu,iu)=>{
      qty += vu.DEL_QTY_BAG
    })
    return qty
  }

  const getDeliveryNetQuantity = data => {
    console.log(data)
    let qty = 0

    data.line_item_details.map((vu,iu)=>{
      qty += vu.DEL_NET_MTS ? vu.DEL_NET_MTS : 0
    })
    if(!qty){
      qty = 0
    }
    return qty
  }

  const set_ship_qty = (data) => {
    console.log(data,'set_ship_qty')
    let qty1 = 0

    if(data.shipment_status != '5') {
      data.shipment_all_child_info.map((vu1,iu1)=>{
        vu1.line_item_details.map((vu2,iu2)=>{
          console.log(vu2.DEL_QTY_BAG,'vu2.DEL_QTY_BAG')
          qty1 += vu2.DEL_QTY_BAG
        })
      })
    } else {
      data.shipment_child_info.map((vu1,iu1)=>{
        vu1.line_item_details.map((vu2,iu2)=>{
          console.log(vu2.DEL_QTY_BAG,'vu2.DEL_QTY_BAG')
          qty1 += vu2.DEL_QTY_BAG
        })
      })
    }

    console.log(qty1,'qty1')
    setShipmentQty(qty1)
  }

  useEffect(() => {
    VehicleAssignmentService.getShipmentInfoByPId(parking_id).then((response) => {
      setFetch(true)
      let viewData = response.data.data
      let ship_data = viewData.filter((data)=>data.shipment_id == shipment_id)
      console.log(viewData,'parking_data')
      console.log(ship_data,'shipment_data')
      setReportData(ship_data[0])
      set_ship_qty(ship_data[0])
    })

    /* section for getting Shipment Routes (Foods) Lists from database */
    DefinitionsListApi.visibleDefinitionsListByDefinition(1).then((response) => {

      let viewDatan = response.data.data
      console.log(viewDatan,'viewDatan')
      let rowDataList_location = []
      viewDatan.map((data, index) => {
        rowDataList_location.push({
          sno: index + 1,
          route_name: data.definition_list_name,
          route_code: data.definition_list_code,
        })
      })
      console.log(rowDataList_location,'rowDataList_location')
      setRouteData(rowDataList_location)
    })

    /* section for getting Shipment Routes (COnsumer) Lists from database */
    DefinitionsListApi.visibleDefinitionsListByDefinition(17).then((response) => {

      let viewDatann = response.data.data
      console.log(viewDatann,'viewDatann')
      let rowDataList_location1 = []
      viewDatann.map((data, index) => {
        rowDataList_location1.push({
          sno: index + 1,
          route_name: data.definition_list_name,
          route_code: data.definition_list_code,
        })
      })
      console.log(rowDataList_location1,'rowDataList_location1')
      setNLCDRouteData(rowDataList_location1)
    })

    /* section for getting Transport Plant Lists from database */
    DefinitionsListApi.visibleDefinitionsListByDefinition(19).then((response) => {

      let viewDatan1 = response.data.data
      console.log(viewDatan1,'viewDatan')
      let rowDataList_plant = []
      viewDatan1.map((data, index) => {
        rowDataList_plant.push({
          sno: index + 1,
          plant_name: data.definition_list_name,
          plant_code: data.definition_list_code,
        })
      })
      console.log(rowDataList_plant,'rowDataList_plant')
      setPlantData(rowDataList_plant)
    })

    /* section for getting Inco Term Lists from database */
    DefinitionsListApi.visibleDefinitionsListByDefinition(16).then((response) => {

      let viewData2 = response.data.data
      console.log(viewData2,'viewData2')
      let rowDataList_location1 = []
      viewData2.map((data, index) => {
        rowDataList_location1.push({
          sno: index + 1,
          incoterm_name: data.definition_list_name,
          incoterm_code: data.definition_list_id,
        })
      })
      console.log(rowDataList_location1,'rowDataList_location1')
      setIncoTermData(rowDataList_location1)
    })

  },[id])

  const getRouteName = (division,code) => {
    let rname = '-'
    if(division == '2'){
      if(nlcdRouteData.length > 0){
        let single_route_data1 = nlcdRouteData.filter((dat)=>dat.route_code == code)
        rname = single_route_data1[0] ? single_route_data1[0].route_name : '-'
      }
    } else {
      if(routeData.length > 0){
        let single_route_data = routeData.filter((dat)=>dat.route_code == code)
        rname = single_route_data[0] ? single_route_data[0].route_name : '-'
      }
    }
    return rname
  }

  const getPlantName = (code) => {
    let pname = '-'
    if(plantData.length > 0){
      let single_pant_data = plantData.filter((dat)=>dat.plant_code == code)
      pname = single_pant_data[0] ? single_pant_data[0].plant_name : '-'
    }
    return pname
  }

  const getIncoName = (code) => {
    let iname = '-'
    if(incoTermData.length > 0){
      let single_inco_data = incoTermData.filter((dat)=>dat.incoterm_code == code)
      iname = single_inco_data[0] ? single_inco_data[0].incoterm_name : '-'
    }
    return iname
  }

/* css Part Start */

const pdiv = {
  width:'35%',
  marginLeft:'2%'
}

const pdivl = {
  width:'40%',
  display:'flex',
  marginRight:'2%'
}

const pdiv2 = {
  width:'65%',
  marginLeft:'2%'
}

const pdiv3 = {
  width:'45%',
  display:'flex',
  marginRight:'2%'
}

const hd1 = {
  marginRight: '4%',
  fontFamily:'timesNewRoman',
  fontSize:'12px'
}

const sp1 = {
  width:'50%',
  display:'inline-block',
  fontWeight:'bold'
}

const secdiv = {
  margin:'0.5%',
  border:'1px solid black',
  borderTop:'white',
  fontWeight:'bold',
  fontFamily:'timesNewRoman',
  fontSize:'10px',
  margin: "0",
  padding: "0",
  background:'white'
}

const secdiv1 = {
  // margin:'0.5%',
  // fontSize:'13px'
  fontWeight:'bold',
  fontFamily:'timesNewRoman',
  fontSize:'10px',
  // pageBreakAfter:'page'
}

const sp11 = {
  width:'35%',
  display:'inline-block',
  fontWeight:'bold'
}

const sp12 = {
  width:'25%',
  display:'inline-block',
  fontWeight:'bold'
}

const sp2 = {
  width:'5%',
}

const page = {
  size: '7in 9.25in',
  margin: '27mm 16mm 27mm 16mm',
  // background:'white',
  height:'1000px',
  width:'750px',
  paddingLeft:'21px',
  marginTop:'6px',
  paddingTop:'6px',
  marginLeft:'25px',
  paddingRight:'20px',
  overFlow: 'initial !important;'
}

const sp3 = {
  width:'45%',
  marginLeft:'5%',
  fontWeight:'100'
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

const imhr = {
  width:'120px',
  height:'100px'
}

const imhl = {
  width:'100px',
  height:'100px',
}

const hd = {
  display:'flex',
  justifyContent:'center',
  borderBottom:'1.5px solid black',
  background:'white',
}

const tam = {
  fontFamily: 'Bamini Tamil',
  src: 'www.kvijayanand.zzl.org/fonts/bamini.ttf',
  fontSize:'9.5px',
  fontWeight:'bold',
  paddingBottom:'5px',
  borderBottom:'1.5px solid black'
}

const footer = {
  // position: 'fixed',
  marginTop:'5%',
  textAlign:'center',
  bottom: '50px',
  width: '100%'
}

const pb = {
  padding:'1%',
  pageBreakAfter:'page',
  // pageBreakAfter:'always'
}

const del = {
  color: 'red',
  fontSize: '12px',
  fontWeight: 'bold',
  // border: '1px solid black',
  padding: '2px',
  // borderRadius: '10px',
  marginRight: '2%'
}

/* css Part End */

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
}
const current = new Date();
const date = `${current.getDate()}/${current.getMonth()+1}/${current.getFullYear()}`

const user_info_json = localStorage.getItem('user_info')
const user_info = JSON.parse(user_info_json)
const user_name = user_info.emp_name


  return (
    <>
      {!fetch && <Loader />}
        {fetch && (
          <>
            <CButton className="text-white" size='sm-lg' color="warning" style={{marginLeft:'690px'}} onClick={handleprint}>
              Print
            </CButton>
            <div
              style={page}
              ref={componentRef}
            >
              {/* <table width="750" cellPadding="4" cellSpacing="0" border="0" className="table table-bordered"> */}
              <table width="750" cellPadding="4" cellSpacing="0" >
                <tr  style={{height:'650px',background:'white',}}>
                  <tr>
                    <td width="700" align="center" style={{ paddingTop:'1px',paddingBottom:'0px' }}>
                      <div style={hd}>
                        <div style={{width:'17%'}}><img style={imhr} src={rightLogo} /></div>
                        <div style={{width:'66%'}}>
                          <span style={h1s}>NAGA LIMITED</span>
                          {reportData.assigned_by == '2' && (
                            <>
                              <span style={h2s}>CONSUMER DIVISION UNIT 2</span>
                              <span style={h3s}>FSSAI No 12421999000536</span>
                              <span style={h4s}>Branch/Depot:NAGA LIMITED- ,NO.1,PADIYUR ROAD,PUTHUPATTY, VEDASANTHUR</span>
                              <span style={h4s}>TALUK,DINDIGUL-624005</span>
                              <span style={h4s}>Ph:18001020831, Mo:9944990018, Fax:0451-2410122</span>
                            </>
                          )}
                          {reportData.assigned_by != '2' && (
                            <>
                              <span style={h2s}>FOODS DIVISION</span>
                              <span style={h3s}>FSSAI No 10017042003098</span>
                              <span style={h4s}>Branch/Depot:NAGA LIMITED- FOODS,NO.1, TRICHY ROAD, DINDIGUL-624005</span>
                              <span style={h4s}>Ph:0451-2411123/2410121, Mo:9944990040,9944990050, Fax:0451-2410122</span>
                              {/* <span style={h4s}>GSTIN:33AAACN2369L1ZD,PAN:AAACN2369L, CIN:U24246TN1991PLC02040,State Code-33</span> */}
                              <span style={h4s}>GSTIN:33AAACN2369L1ZD,PAN:AAACN2369L, CIN:U10611TN1991PLC020409,State Code-33</span>
                            </>
                          )}
                        </div>
                        <div style={{width:'17%'}}><img style={imhl} src={leftLogo} /></div>
                      </div>
                      <strong style={hd1}>SHIPMENT DOCUMENT</strong><br />
                    </td>
                  </tr>

                  {reportData && (
                    <tr>
                      <div style={secdiv1}>

                        <div style={{display:'flex'}}>
                          <div style={pdiv}>
                            <span style={sp1}>Vehicle No</span>
                            <span style={sp2}>:</span>
                            <span style={sp3}>{reportData.vehicle_number}</span>
                          </div>
                          <div style={{width:'25%'}}>
                          </div>
                          <div style={pdivl}>
                            <span style={sp1}>Shipment No</span>
                            <span style={sp2}>:</span>
                            <span style={sp3}>{reportData.shipment_no}</span>
                          </div>
                        </div>

                        <div style={{display:'flex'}}>
                          <div style={pdiv}>
                            <span style={sp1}>Driver Name</span>
                            <span style={sp2}>:</span>
                            <span style={sp3}>{reportData.driver_name}</span>
                          </div>
                          <div style={{width:'25%'}}>
                          </div>
                          <div style={pdivl}>
                            <span style={sp1}>Shipment Date</span>
                            <span style={sp2}>:</span>
                            <span style={sp3}>{reportData.created_at}</span>
                          </div>
                        </div>

                        <div style={{display:'flex'}}>
                          <div style={pdiv}>
                            <span style={sp1}>Contact No</span>
                            <span style={sp2}>:</span>
                            <span style={sp3}>{reportData.driver_number}</span>
                          </div>
                          <div style={{width:'25%'}}>
                          </div>
                          <div style={pdivl}>
                            <span style={sp1}>Route</span>
                            <span style={sp2}>:</span>
                            <span style={sp3}>{getRouteName(reportData.assigned_by, reportData.shipment_route)}</span>
                            {/* <span style={sp3}>Gandharvakottai Route</span> */}
                          </div>
                        </div>

                        <div style={{display:'flex'}}>
                          <div style={pdiv}>
                            <span style={sp1}>Tripsheet No</span>
                            <span style={sp2}>:</span>
                            <span style={sp3}>{reportData.trip_sheet_info.trip_sheet_no}</span>
                          </div>
                          <div style={{width:'25%'}}>
                          </div>
                          <div style={pdivl}>
                            <span style={sp1}>Transportation</span>
                            <span style={sp2}>:</span>
                            <span style={sp3}>{getPlantName(reportData.transport_plant)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="print-container" style={secdiv}>
                        {reportData.shipment_status == '5' && reportData.shipment_child_info.map((vl,id)=>{
                          return(
                            <><div style={{padding:'1%',borderTop:'1px solid black'}}>
                            {/* // <><div style={{padding:'1%'}}> */}
                              <div style={{display:'flex'}}>
                              {/* <div> */}
                                <div style={pdiv2}>
                                  <span style={sp12}><span style={del}>{`${id+1})`}</span>Delivery No</span>
                                  <span style={sp2}>:</span>
                                  <span style={sp3}>{vl.delivery_no}</span>
                                </div>
                                <div style={pdiv3}>
                                  <span style={sp11}>Delivery Place</span>
                                  <span style={sp2}>:</span>
                                  <span style={sp3}>{vl.customer_info.CustomerCity}</span>
                                </div>
                              </div>
                              <div style={{display:'flex'}}>
                                <div style={pdiv2}>
                                  <span style={sp12}>Party Name</span>
                                  <span style={sp2}>:</span>
                                  <span style={sp3}>{vl.customer_info.CustomerName}</span>
                                </div>
                                <div style={pdiv3}>
                                  <span style={sp11}>Freight Terms</span>
                                  <span style={sp2}>:</span>
                                  <span style={sp3}>{getIncoName(vl.inco_term_id)}</span>
                                </div>
                              </div>
                              <div>
                                <table style={{border:'1px solid black', marginTop:'2%', height:'fit-content'}}>
                                  <tr style={{borderBottom:'1px solid black'}}>
                                    <th style={{width:'7%',textAlign:'center'}}>S.No</th>
                                    <th style={{width:'50%'}}>Item Description</th>
                                    <th style={{width:'13%',textAlign:'center'}}>Batch</th>
                                    <th style={{width:'10%',textAlign:'center'}}>Quantity</th>
                                    <th style={{width:'10%',textAlign:'center'}}>TON(Net)</th>
                                    <th style={{width:'10%',textAlign:'center'}}>TON</th>
                                  </tr>
                                  {vl.line_item_details.map((vl1,id1)=>{
                                    return(
                                      <>
                                        <tr>
                                          <td style={{width:'7%',textAlign:'center',fontWeight:'100'}}>{id1+1}</td>
                                          <td style={{width:'50%',fontWeight:'100'}}>{vl1.ARKTX}</td>
                                          <td style={{width:'13%',textAlign:'center',fontWeight:'100'}}>{vl1.CHARG || '-'}</td>
                                          <td style={{width:'10%',textAlign:'center',fontWeight:'100'}}>{Number(vl1.DEL_QTY_BAG)}</td>
                                          {/* <td style={{width:'10%',textAlign:'center',fontWeight:'100'}}>{vl1.DEL_NET_MTS.toFixed(3) || '-'}</td> */}
                                          <td style={{width:'10%',textAlign:'center',fontWeight:'100'}}>{vl1.DEL_NET_MTS ? vl1.DEL_NET_MTS.toFixed(3) : '-'}</td>
                                          <td style={{width:'10%',textAlign:'center',fontWeight:'100'}}>{vl1.DEL_QTY_MTS.toFixed(3) || '-'}</td>
                                        </tr>
                                      </>
                                    )})
                                  }

                                  <tr style={{borderTop:'0.5px solid black'}}>
                                    <td colSpan={3} style={{width:'70%',textAlign:'end'}}>Sub Total</td>
                                    <td style={{width:'10%',textAlign:'center'}}>{Number(getDeliveryQuantity(vl))}</td>
                                    <td style={{width:'10%',textAlign:'center'}}>{Number(getDeliveryNetQuantity(vl)) == '0' ? '-' : Number(getDeliveryNetQuantity(vl)).toFixed(3)}</td>
                                    <td style={{width:'10%',textAlign:'center'}}>{Number(vl.invoice_quantity/1000).toFixed(3)}</td>
                                  </tr>

                                </table>
                              </div>
                              </div>
                            </>
                          )
                        })}
                        {reportData.shipment_status != '5' && reportData.shipment_all_child_info.map((vl,id)=>{
                          return(
                            <><div style={{padding:'1%',borderTop:'1px solid black'}}>
                            {/* // <><div style={{padding:'1%'}}> */}
                              <div style={{display:'flex'}}>
                              {/* <div> */}
                                <div style={pdiv2}>
                                  <span style={sp12}><span style={del}>{`${id+1})`}</span>Delivery No</span>
                                  <span style={sp2}>:</span>
                                  <span style={sp3}>{vl.delivery_no}</span>
                                </div>
                                <div style={pdiv3}>
                                  <span style={sp11}>Delivery Place</span>
                                  <span style={sp2}>:</span>
                                  <span style={sp3}>{vl.customer_info.CustomerCity}</span>
                                </div>
                              </div>
                              <div style={{display:'flex'}}>
                                <div style={pdiv2}>
                                  <span style={sp12}>Party Name</span>
                                  <span style={sp2}>:</span>
                                  <span style={sp3}>{vl.customer_info.CustomerName}</span>
                                </div>
                                <div style={pdiv3}>
                                  <span style={sp11}>Freight Terms</span>
                                  <span style={sp2}>:</span>
                                  <span style={sp3}>{getIncoName(vl.inco_term_id)}</span>
                                </div>
                              </div>
                              <div>
                                <table style={{border:'1px solid black', marginTop:'2%', height:'fit-content'}}>
                                  <tr style={{borderBottom:'1px solid black'}}>
                                    <th style={{width:'7%',textAlign:'center'}}>S.No</th>
                                    <th style={{width:'50%'}}>Item Description</th>
                                    <th style={{width:'13%',textAlign:'center'}}>Batch</th>
                                    <th style={{width:'10%',textAlign:'center'}}>Quantity</th>
                                    <th style={{width:'10%',textAlign:'center'}}>TON(Net)</th>
                                    <th style={{width:'10%',textAlign:'center'}}>TON</th>
                                  </tr>
                                  {vl.line_item_details.map((vl1,id1)=>{
                                    return(
                                      <>
                                        <tr>
                                          <td style={{width:'7%',textAlign:'center',fontWeight:'100'}}>{id1+1}</td>
                                          <td style={{width:'50%',fontWeight:'100'}}>{vl1.ARKTX}</td>
                                          <td style={{width:'13%',textAlign:'center',fontWeight:'100'}}>{vl1.CHARG || '-'}</td>
                                          <td style={{width:'10%',textAlign:'center',fontWeight:'100'}}>{Number(vl1.DEL_QTY_BAG)}</td>
                                          {/* <td style={{width:'10%',textAlign:'center',fontWeight:'100'}}>{Number(vl1.DEL_NET_MTS).toFixed(3) || '-'}</td> */}
                                          <td style={{width:'10%',textAlign:'center',fontWeight:'100'}}>{vl1.DEL_NET_MTS ? Number(vl1.DEL_NET_MTS).toFixed(3) : '-'}</td>
                                          <td style={{width:'10%',textAlign:'center',fontWeight:'100'}}>{Number(vl1.DEL_QTY_MTS).toFixed(3) || '-'}</td>
                                        </tr>
                                      </>
                                    )})
                                  }

                                  <tr style={{borderTop:'0.5px solid black'}}>
                                    <td colSpan={3} style={{width:'70%',textAlign:'end'}}>Sub Total</td>
                                    <td style={{width:'10%',textAlign:'center'}}>{Number(getDeliveryQuantity(vl))}</td>
                                    {/* <td style={{width:'10%',textAlign:'center'}}>{Number(getDeliveryNetQuantity(vl)).toFixed(3)}</td> */}
                                    <td style={{width:'10%',textAlign:'center'}}>{Number(getDeliveryNetQuantity(vl)) == '0' ? '-' : Number(getDeliveryNetQuantity(vl)).toFixed(3)}</td>
                                    <td style={{width:'10%',textAlign:'center'}}>{Number(vl.delivery_qty).toFixed(3)}</td>
                                  </tr>

                                </table>
                              </div>
                              </div>
                            </>
                          )
                        })}
                        <div style={{padding:'1%',borderTop:'1px solid black'}}>
                          <table style={{border:'1px solid black', height:'fit-content'}}>
                            <tr>
                              <td colSpan={3} style={{width:'70%',textAlign:'end'}}>Total</td>
                              <td style={{width:'10%',textAlign:'center'}}>{Number(shipmentQty)}</td>
                              <td style={{width:'10%',textAlign:'center'}}>{reportData.shipment_status != '5' ? Number(reportData.shipment_net_qty).toFixed(3) || '-' : Number(reportData.billed_net_qty) == '0' ? '-' : Number(reportData.billed_net_qty).toFixed(3) || '-'}</td>
                              <td style={{width:'10%',textAlign:'center'}}>{reportData.shipment_status != '5' ? Number(reportData.shipment_qty).toFixed(3) || '-' : Number(reportData.billed_qty).toFixed(3) || '-'}</td>
                            </tr>
                          </table>

                        </div>
                        <div style={footer}>
                          <div style={{padding:'1%'}}>
                            <table style={{border:'1px solid black', height:'fit-content'}}>
                              <tr>
                                <td colSpan={2} style={{width:'60%',textAlign:'center'}}>{`Print By / Created By : ${user_name} / ${reportData.shipment_user_info.emp_name}`}</td>
                                <td style={{width:'40%',textAlign:'center'}}>{`Date & Time : ${GetDateTimeFormat('current')}`}</td>
                              </tr>
                            </table>
                          </div>

                          <div>
                            <span style={tam}>மேலே குறிப்பிட்டுள்ள பொருட்களை சரியாக எண்ணி பெற்றுக்கொண்டேன். இதில் குறையும் பொருட்களுக்கு ஓட்டுனரே பொறுப்பு</span>
                          </div>
                          <div>
                            <span style={h2s1}>Always use NAGA products</span>
                            <span style={h3s}>FSSC 22000 & HALAL certified company</span>
                            <span style={h4s}>Administrative & Head Office : NO.1, TRICHY ROAD,DINDIGUL-624005,TAMIL NADU,INDIA</span>
                            <span style={h4s}>Ph:, Toll Free:18004255588,Mo: ,Fax:0451-2410122</span>
                            <span style={h4s}>Email : nagalimited@nagamills.com Website : www.nagamills.com</span>
                          </div>
                        </div>
                      </div>
                    </tr>
                  )}
                  <tr>
                    <td width="700" align="center" style={{ paddingTop:'1px',paddingBottom:'0px' }}>

                    </td>
                  </tr>
                </tr>
              </table>
            </div>
          </>
        )
      }
    </>
  )
}

export default ShFDPrint
