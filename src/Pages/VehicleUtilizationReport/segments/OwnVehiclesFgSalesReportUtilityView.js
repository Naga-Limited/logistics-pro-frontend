
import {
  CButton
} from '@coreui/react'
import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useReactToPrint } from 'react-to-print'
import "./toPrint.css";
import leftLogo from 'src/assets/naga/left.png'
import rightLogo from 'src/assets/naga/right.jpg'
import VehicleAssignmentService from 'src/Service/VehicleAssignment/VehicleAssignmentService'
import DefinitionsListApi from 'src/Service/Definitions/DefinitionsListApi'
import Loader from 'src/components/Loader'
import { GetDateTimeFormat } from 'src/Pages/Depo/CommonMethods/CommonMethods';
import MaterialMasterService from 'src/Service/Master/MaterialMasterService';

const OwnVehiclesFgSalesReportUtilityView = ({ }) => {
  const { id } = useParams()

  console.log(id, 'id-id')

  let temp_pos = id.lastIndexOf('||')

  const shipment_id = id.substring(0, temp_pos)
  const parking_id = id.substring(temp_pos + 2)

  console.log(parking_id, 'parking_id')
  console.log(shipment_id, 'shipment_id')

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

    data.line_item_details.map((vu, iu) => {
      qty += vu.DEL_QTY_BAG
    })
    return qty
  }

  const getDeliveryNetQuantity = data => {
    console.log(data)
    let qty = 0

    data.line_item_details.map((vu, iu) => {
      qty += vu.DEL_NET_MTS ? vu.DEL_NET_MTS : 0
    })
    if (!qty) {
      qty = 0
    }
    return qty
  }

  const set_ship_qty = (data) => {
    console.log(data, 'set_ship_qty')
    let qty1 = 0

    if (data.shipment_status != '5') {
      data.shipment_all_child_info.map((vu1, iu1) => {
        vu1.line_item_details.map((vu2, iu2) => {
          console.log(vu2.DEL_QTY_BAG, 'vu2.DEL_QTY_BAG')
          qty1 += vu2.DEL_QTY_BAG
        })
      })
    } else {
      data.shipment_child_info.map((vu1, iu1) => {
        vu1.line_item_details.map((vu2, iu2) => {
          console.log(vu2.DEL_QTY_BAG, 'vu2.DEL_QTY_BAG')
          qty1 += vu2.DEL_QTY_BAG
        })
      })
    }

    console.log(qty1, 'qty1')
    setShipmentQty(qty1)
  }

  const [allMaterialInfo, setAllMaterialInfo] = useState([])
  const [materialUomData, setMaterialUomData] = useState([])

  useEffect(() => {
    VehicleAssignmentService.getShipmentInfoByPId(parking_id).then((response) => {
      setFetch(true)
      let viewData = response.data.data
      let ship_data = viewData.filter((data) => data.shipment_id == shipment_id)
      console.log(viewData, 'parking_data')
      console.log(ship_data, 'shipment_data')
      setReportData(ship_data[0])
      set_ship_qty(ship_data[0])
    })

    /* section for getting Shipment Routes (Foods) Lists from database */
    DefinitionsListApi.visibleDefinitionsListByDefinition(1).then((response) => {

      let viewDatan = response.data.data
      console.log(viewDatan, 'viewDatan')
      let rowDataList_location = []
      viewDatan.map((data, index) => {
        rowDataList_location.push({
          sno: index + 1,
          route_name: data.definition_list_name,
          route_code: data.definition_list_code,
        })
      })
      console.log(rowDataList_location, 'rowDataList_location')
      setRouteData(rowDataList_location)
    })

    /* section for getting Shipment Routes (COnsumer) Lists from database */
    DefinitionsListApi.visibleDefinitionsListByDefinition(17).then((response) => {

      let viewDatann = response.data.data
      console.log(viewDatann, 'viewDatann')
      let rowDataList_location1 = []
      viewDatann.map((data, index) => {
        rowDataList_location1.push({
          sno: index + 1,
          route_name: data.definition_list_name,
          route_code: data.definition_list_code,
        })
      })
      console.log(rowDataList_location1, 'rowDataList_location1')
      setNLCDRouteData(rowDataList_location1)
    })

    /* section for getting Transport Plant Lists from database */
    DefinitionsListApi.visibleDefinitionsListByDefinition(19).then((response) => {

      let viewDatan1 = response.data.data
      console.log(viewDatan1, 'viewDatan')
      let rowDataList_plant = []
      viewDatan1.map((data, index) => {
        rowDataList_plant.push({
          sno: index + 1,
          plant_name: data.definition_list_name,
          plant_code: data.definition_list_code,
        })
      })
      console.log(rowDataList_plant, 'rowDataList_plant')
      setPlantData(rowDataList_plant)
    })

    /* section for getting Inco Term Lists from database */
    DefinitionsListApi.visibleDefinitionsListByDefinition(16).then((response) => {

      let viewData2 = response.data.data
      console.log(viewData2, 'viewData2')
      let rowDataList_location1 = []
      viewData2.map((data, index) => {
        rowDataList_location1.push({
          sno: index + 1,
          incoterm_name: data.definition_list_name,
          incoterm_code: data.definition_list_id,
        })
      })
      console.log(rowDataList_location1, 'rowDataList_location1')
      setIncoTermData(rowDataList_location1)
    })

    MaterialMasterService.getMaterialInfo().then((response) => {
      let viewData = response.data.data
      console.log(response.data.data, 'getMaterialInfo')
      setFetch(true)
      setAllMaterialInfo(viewData)

    })

    /* section for getting Material Uom Master from database */
    DefinitionsListApi.visibleDefinitionsListByDefinition(38).then((response) => {
      console.log(response.data.data, 'setMaterialUomData')
      setMaterialUomData(response.data.data)
    })

  }, [id])

  const getRouteName = (division, code) => {
    let rname = '-'
    if (division == '2') {
      if (nlcdRouteData.length > 0) {
        let single_route_data1 = nlcdRouteData.filter((dat) => dat.route_code == code)
        rname = single_route_data1[0] ? single_route_data1[0].route_name : '-'
      }
    } else {
      if (routeData.length > 0) {
        let single_route_data = routeData.filter((dat) => dat.route_code == code)
        rname = single_route_data[0] ? single_route_data[0].route_name : '-'
      }
    }
    return rname
  }

  const getPlantName = (code) => {
    let pname = '-'
    if (plantData.length > 0) {
      let single_pant_data = plantData.filter((dat) => dat.plant_code == code)
      pname = single_pant_data[0] ? single_pant_data[0].plant_name : '-'
    }
    return pname
  }

  const getIncoName = (code) => {
    let iname = '-'
    if (incoTermData.length > 0) {
      let single_inco_data = incoTermData.filter((dat) => dat.incoterm_code == code)
      iname = single_inco_data[0] ? single_inco_data[0].incoterm_name : '-'
    }
    return iname
  }

  /* css Part Start */

  const pdiv = {
    width: '35%',
    marginLeft: '2%'
  }

  const pdivl = {
    width: '40%',
    display: 'flex',
    marginRight: '2%'
  }

  const pdiv2 = {
    width: '65%',
    marginLeft: '2%'
  }

  const pdiv3 = {
    width: '45%',
    display: 'flex',
    marginRight: '2%'
  }

  const hd1 = {
    marginRight: '4%',
    fontFamily: 'timesNewRoman',
    fontSize: '12px'
  }

  const sp1 = {
    width: '50%',
    display: 'inline-block',
    fontWeight: 'bold'
  }

  const secdiv = {
    margin: '0.5%',
    border: '1px solid black',
    borderTop: 'white',
    fontWeight: 'bold',
    fontFamily: 'timesNewRoman',
    fontSize: '10px',
    margin: "0",
    padding: "0",
    background: 'white'
  }

  const secdiv1 = {
    fontWeight: 'bold',
    fontFamily: 'timesNewRoman',
    fontSize: '10px',
  }

  const sp11 = {
    width: '35%',
    display: 'inline-block',
    fontWeight: 'bold'
  }

  const sp12 = {
    width: '25%',
    display: 'inline-block',
    fontWeight: 'bold'
  }

  const sp2 = {
    width: '5%',
  }

  const page = {
    size: '7in 9.25in',
    margin: '27mm 16mm 27mm 16mm',
    height: '1000px',
    width: '750px',
    paddingLeft: '21px',
    marginTop: '6px',
    paddingTop: '6px',
    marginLeft: '25px',
    paddingRight: '20px',
    overFlow: 'initial !important;'
  }

  const sp3 = {
    width: '45%',
    marginLeft: '5%',
    fontWeight: '100'
  }

  const h1s = {
    fontFamily: 'timesnewroman',
    fontSize: '24px',
    fontWeight: 'bold'
  }

  const h2s = {
    display: 'block',
    fontFamily: 'timesnewroman',
    fontSize: '12px',
    fontWeight: 'bold',
    marginTop: '-10px'
  }

  const h2s1 = {
    display: 'block',
    fontFamily: 'timesnewroman',
    fontSize: '12px',
    fontWeight: 'bold',
    marginTop: '5px'
  }

  const h3s = {
    display: 'block',
    fontFamily: 'timesnewroman',
    fontSize: '10px',
    fontWeight: 'bold',
    marginTop: '-3px'
  }

  const h4s = {
    display: 'block',
    fontFamily: 'timesnewroman',
    fontSize: '10px',
    letterSpacing: '0.5px'
  }

  const imhr = {
    width: '120px',
    height: '100px'
  }

  const imhl = {
    width: '100px',
    height: '100px',
  }

  const hd = {
    display: 'flex',
    justifyContent: 'center',
    borderBottom: '1.5px solid black',
    background: 'white',
  }

  const tam = {
    fontFamily: 'Bamini Tamil',
    src: 'www.kvijayanand.zzl.org/fonts/bamini.ttf',
    fontSize: '9.5px',
    fontWeight: 'bold',
    paddingBottom: '5px',
    borderBottom: '1.5px solid black'
  }

  const footer = {
    marginTop: '5%',
    textAlign: 'center',
    bottom: '50px',
    width: '100%'
  }

  const pb = {
    padding: '1%',
    pageBreakAfter: 'page',
  }

  const del = {
    color: 'red',
    fontSize: '12px',
    fontWeight: 'bold',
    padding: '2px',
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
    content: () => componentRef.current,
  });

  const PURPOSE = {
    FG_SALES: 1,
    FG_STO: 2,
    RM_STO: 3,
  }
  const current = new Date();
  const date = `${current.getDate()}/${current.getMonth() + 1}/${current.getFullYear()}`

  const user_info_json = localStorage.getItem('user_info')
  const user_info = JSON.parse(user_info_json)
  const user_name = user_info.emp_name

  const itemUomFinder = (code) => {
    let uom = 0
    allMaterialInfo.map((vv, kk) => {
      if (vv.material_code == code) {
        uom = vv.uom
      }
    })
    return uom
  }

  const dimensionsFinder = (code, type) => {
    let uom = 0
    let len = 0
    let wid = 0
    let hig = 0
    let vol = 0
    allMaterialInfo.map((vv, kk) => {
      if (vv.material_code == code) {
        uom = vv.uom
        len = vv.length
        wid = vv.width
        hig = vv.height
        vol = vv.volume
      }
    })

    let ans = 0

    console.log(allMaterialInfo, 'dimensionsFinder-allMaterialInfo')
    console.log(code, 'dimensionsFinder-code')
    console.log(type, 'dimensionsFinder-type')
    console.log(vol, 'dimensionsFinder-vol')

    if (type == 1) { // Length
      return `${len} ${itemUomFinder(code)}`
    } else if (type == 2) { // Width
      return `${wid} ${itemUomFinder(code)}`
    } else if (type == 3) { // Height
      return `${hig} ${itemUomFinder(code)}`
    } else if (type == 4) { // Volume
      return `${vol} ${itemUomFinder(code)}`
    } else if (type == 5) { // Volume
      return vol
    } else if (type == 6) { // Volume
      return `(${len}x${len}x${len}) ${itemUomFinder(code)}`
    }
    return uom
  }

  function convertToFeet(value, unit) {
    console.log(value, 'convertToFeet-value')
    console.log(unit, 'convertToFeet-unit')

    value = parseFloat(value)

    if (isNaN(value)) return "0.00"

    let divisor

    switch (unit) {
      case 'mm':
        divisor = 28316846.6;  // mm³ → ft³
        break;

      case 'cm':
        divisor = 28316.8466;    // cm³ → ft³
        break;

      case 'm':
        divisor = 0.0283168466;  // m³ → ft³ (divide by this)
        return Number((value / divisor).toFixed(2));

      case 'in':
        divisor = 1728;          // in³ → ft³
        break;

      case 'ft':
        return Number((value).toFixed(2));

      default:
        divisor = 1;
      // throw new Error("Invalid unit");
    }
    if (unit == 'mm') {
      console.log(value, '111111110')
      console.log(divisor, '111111111')
      console.log(value / divisor, '11111111')
      console.log((value / divisor).toFixed(2), '111111112')
      console.log(Number((value / divisor).toFixed(2)), '111111113')
    }
    return Number((value / divisor).toFixed(2));
  }

  const totalVolumeFinder = (code, qty) => {
    let volume = code ? convertToFeet(dimensionsFinder(code, 5), itemUomFinder(code)) : 0
    let total_volume = volume * qty
    console.log(code, 'totalVolumeFinder-code')
    console.log(qty, 'totalVolumeFinder-qty')
    console.log(volume, 'totalVolumeFinder-volume')
    console.log(total_volume, 'totalVolumeFinder-total_volume')
    return total_volume.toFixed(2)
  }

  const vehicleVolumeFinder = (data) => {

    let len = data.vehicle_length
    let wid = data.vehicle_width
    let hig = data.vehicle_height
    let volume = len * wid * hig
    return parseFloat(volume).toFixed(2)
  }

  const vehicleUtilizationFinder = (type = '') => {

    let prod_vol = overAllVolumeFinder(reportData.shipment_all_child_info)
    let veh_vol = vehicleVolumeFinder(reportData.vehicle_info)
    let util_per = (prod_vol / veh_vol) * 100
    if (type == 1) {
      return Math.round(util_per)
    }
    return `${Math.round(util_per)} %`
  }

  const vehicleWeightUtilizationFinder = (type = '') => {

    let prod_weight = Number(reportData.billed_net_qty)
    let veh_capacity = Number(reportData.vehicle_capacity_id_info.capacity)
    let util_per = (prod_weight / veh_capacity) * 100

    console.log(prod_weight, 'vehicleWeightUtilizationFinder-prod_weight')
    console.log(veh_capacity, 'vehicleWeightUtilizationFinder-veh_capacity')
    console.log(util_per, 'vehicleWeightUtilizationFinder-util_per')

    if (type == 1) {
      return Math.round(util_per)
    }
    return `${Math.round(util_per)} %`
  }

  const findSubTotal = (sub_data) => {
    console.log(sub_data, 'findSubTotal-sub_data');

    let sub_tot = 0;

    sub_data.forEach((vv, kk) => {
      let qty = vv.DEL_QTY_BAG ? parseFloat(vv.DEL_QTY_BAG) : 0;
      let code = vv.MATNR ? vv.MATNR : 0;

      console.log(qty, 'findSubTotal-qty');
      console.log(code, 'findSubTotal-code');

      let tot_vol = 0;

      if (code !== 0) {
        tot_vol = parseFloat(totalVolumeFinder(code, qty)) || 0;
      }

      sub_tot += tot_vol; // ✅ pure number addition

      console.log(tot_vol, 'findSubTotal-tot_vol');
      console.log(sub_tot, 'findSubTotal-sub_tot');
    });

    return sub_tot.toFixed(2); // ✅ apply only once at end
  }

  const overAllVolumeFinder = (data) => {
    let vol = 0
    console.log(data, 'overAllVolumeFinder-data')
    data.map((vv, kk) => {
      let line_array = vv.line_item_details
      if (line_array && line_array.length > 0) {
        vol += parseFloat(findSubTotal(line_array)); // ✅ pure number addition
      }
    })
    console.log(vol, 'overAllVolumeFinder-vol')
    return vol.toFixed(2)
  }

  const colorFinder = () => {
    let clr = 'blue'
    let vlu = vehicleUtilizationFinder(1)
    if (vlu >= 90) {
      clr = 'green'
    } else if (vlu >= 80 && vlu < 90) {
      clr = 'orange'
    } else if (vlu < 80) {
      clr = 'red'
    }

    return clr
  }

  const colorFinder1 = () => {
    let clr = 'blue'
    let vlu = vehicleWeightUtilizationFinder(1)
    if (vlu >= 90) {
      clr = 'green'
    } else if (vlu >= 80 && vlu < 90) {
      clr = 'orange'
    } else if (vlu < 80) {
      clr = 'red'
    }

    return clr
  }

  return (
    <>
      {!fetch && <Loader />}
      {fetch && (
        <>
          <CButton className="text-white" size='sm-lg' color="warning" style={{ marginLeft: '690px' }} onClick={handleprint}>
            Print
          </CButton>
          <div
            style={page}
            ref={componentRef}
          >
            <table width="750" cellPadding="4" cellSpacing="0" >
              <tr style={{ height: '650px', background: 'white', }}>
                <tr>
                  <td width="700" align="center" style={{ paddingTop: '1px', paddingBottom: '0px' }}>
                    <div style={hd}>
                      <div style={{ width: '17%' }}><img style={imhr} src={rightLogo} /></div>
                      <div style={{ width: '66%' }}>
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
                            <span style={h4s}>GSTIN:33AAACN2369L1ZD,PAN:AAACN2369L, CIN:U10611TN1991PLC020409,State Code-33</span>
                          </>
                        )}
                      </div>
                      <div style={{ width: '17%' }}><img style={imhl} src={leftLogo} /></div>
                    </div>
                    <strong style={hd1}>SHIPMENT DOCUMENT</strong><br />
                  </td>
                </tr>

                {reportData && (
                  <tr>
                    <div style={secdiv1}>
                      <div style={{ display: 'flex' }}>
                        <div style={pdiv}>
                          <span style={sp1}>Vehicle No</span>
                          <span style={sp2}>:</span>
                          <span style={sp3}>{reportData.vehicle_number}</span>
                        </div>
                        <div style={{ width: '25%' }}>
                        </div>
                        <div style={pdivl}>
                          <span style={sp1}>Shipment No</span>
                          <span style={sp2}>:</span>
                          <span style={sp3}>{reportData.shipment_no}</span>
                        </div>
                      </div>

                      <div style={{ display: 'flex' }}>
                        <div style={pdiv}>
                          <span style={sp1}>Driver Name</span>
                          <span style={sp2}>:</span>
                          <span style={sp3}>{reportData.driver_name}</span>
                        </div>
                        <div style={{ width: '25%' }}>
                        </div>
                        <div style={pdivl}>
                          <span style={sp1}>Shipment Date</span>
                          <span style={sp2}>:</span>
                          <span style={sp3}>{reportData.created_at}</span>
                        </div>
                      </div>

                      <div style={{ display: 'flex' }}>
                        <div style={pdiv}>
                          <span style={sp1}>Contact No</span>
                          <span style={sp2}>:</span>
                          <span style={sp3}>{reportData.driver_number}</span>
                        </div>
                        <div style={{ width: '25%' }}>
                        </div>
                        <div style={pdivl}>
                          <span style={sp1}>Route</span>
                          <span style={sp2}>:</span>
                          <span style={sp3}>{getRouteName(reportData.assigned_by, reportData.shipment_route)}</span>
                          {/* <span style={sp3}>Gandharvakottai Route</span> */}
                        </div>
                      </div>

                      <div style={{ display: 'flex' }}>
                        <div style={pdiv}>
                          <span style={sp1}>Tripsheet No</span>
                          <span style={sp2}>:</span>
                          <span style={sp3}>{reportData.trip_sheet_info.trip_sheet_no}</span>
                        </div>
                        <div style={{ width: '25%' }}>
                        </div>
                        <div style={pdivl}>
                          <span style={sp1}>Transportation</span>
                          <span style={sp2}>:</span>
                          <span style={sp3}>{getPlantName(reportData.transport_plant)}</span>
                        </div>
                      </div>
                    </div>
                    <div style={hd}>  </div>
                    <div style={hd}>
                      <strong style={{ marginLeft: '2%', color: colorFinder(), width: '100%', textAlign: 'center', border: '1px solid black', fontFamily: "timesnewroman" }}>Vehicle Space Utilization : {vehicleUtilizationFinder()}</strong>
                      <strong style={{ marginLeft: '2%', color: colorFinder1(), width: '100%', textAlign: 'center', border: '1px solid black', fontFamily: "timesnewroman" }}>Vehicle Weight Utilization : {vehicleWeightUtilizationFinder()}</strong>
                    </div>
                    <strong style={{ marginLeft: '2%', color: "green", fontFamily: "timesnewroman" }}>Product Details :</strong><br />
                    <div className="print-container" style={secdiv}>

                      {/* {reportData.shipment_status == '5' && reportData.shipment_child_info.map((vl,id)=>{ */}
                      {reportData.shipment_child_info.map((vl, id) => {
                        return (
                          <>
                            <div style={{ padding: '1%', borderTop: '1px solid black' }}>
                              <div style={{ display: 'flex' }}>
                                <div style={pdiv2}>
                                  <span style={sp12}><span style={del}>{`${id + 1})`}</span>Delivery No</span>
                                  <span style={sp2}>:</span>
                                  <span style={sp3}>{vl.delivery_no}</span>
                                </div>
                                <div style={pdiv3}>
                                  <span style={sp11}>Delivery Place</span>
                                  <span style={sp2}>:</span>
                                  <span style={sp3}>{vl.customer_info.CustomerCity}</span>
                                </div>
                              </div>
                              <div style={{ display: 'flex' }}>
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
                                <table style={{ border: '1px solid black', marginTop: '2%', height: 'fit-content' }}>
                                  <tr style={{ borderBottom: '1px solid black' }}>
                                    <th style={{ width: '7%', textAlign: 'center' }}>S.No</th>
                                    <th style={{ width: '20%' }}>Item Description</th>
                                    <th style={{ width: '13%', textAlign: 'center' }}>Item Code</th>
                                    {/* <th style={{width:'10%',textAlign:'center'}}>Length</th>
                                      <th style={{width:'10%',textAlign:'center'}}>Width</th>
                                      <th style={{width:'10%',textAlign:'center'}}>Height</th> */}
                                    <th style={{ width: '20%', textAlign: 'center' }}>(L x W x H)uom</th>
                                    <th style={{ width: '10%', textAlign: 'center' }}>Volume</th>
                                    <th style={{ width: '10%', textAlign: 'center' }}>Volume(ft)</th>
                                    <th style={{ width: '10%', textAlign: 'center' }}>Quantity</th>
                                    <th style={{ width: '10%', textAlign: 'center' }}>Weight</th>

                                    <th style={{ width: '13%', textAlign: 'center' }}>Total Volume</th>
                                  </tr>
                                  {vl.line_item_details.map((vl1, id1) => {
                                    return (
                                      <>
                                        <tr>
                                          <td style={{ width: '7%', textAlign: 'center', fontWeight: '100' }}>{id1 + 1}</td>
                                          <td style={{ width: '20%', fontWeight: '100' }}>{vl1.ARKTX}</td>
                                          <td style={{ width: '13%', textAlign: 'center', fontWeight: '100' }}>{vl1.MATNR || '-'}</td>
                                          {/* <td style={{width:'10%',textAlign:'center',fontWeight:'100'}}>{vl1.MATNR ? itemUomFinder(vl1.MATNR) : '-'}</td> */}
                                          {/* <td style={{width:'10%',textAlign:'center',fontWeight:'100'}}>{vl1.MATNR ? dimensionsFinder(vl1.MATNR,1) : '-'}</td>
                                            <td style={{width:'10%',textAlign:'center',fontWeight:'100'}}>{vl1.MATNR ? dimensionsFinder(vl1.MATNR,2) : '-'}</td>
                                            <td style={{width:'10%',textAlign:'center',fontWeight:'100'}}>{vl1.MATNR ? dimensionsFinder(vl1.MATNR,3) : '-'}</td> */}
                                          <td style={{ width: '20%', textAlign: 'center', fontWeight: '100' }}>{vl1.MATNR ? dimensionsFinder(vl1.MATNR, 6) : '-'}</td>
                                          <td style={{ width: '10%', textAlign: 'center', fontWeight: '100' }}>{vl1.MATNR ? dimensionsFinder(vl1.MATNR, 4) : '-'}</td>
                                          <td style={{ width: '10%', textAlign: 'center', fontWeight: '100' }}>{vl1.MATNR ? convertToFeet(dimensionsFinder(vl1.MATNR, 5), itemUomFinder(vl1.MATNR)) : '-'}</td>
                                          <td style={{ width: '10%', textAlign: 'center', fontWeight: '100' }}>{Number(vl1.DEL_QTY_BAG)}</td>
                                          <td style={{ width: '10%', textAlign: 'center', fontWeight: '100' }}>{vl1.DEL_NET_MTS.toFixed(3) || '-'}</td>
                                          <td style={{ width: '13%', textAlign: 'center', fontWeight: '100' }}>{totalVolumeFinder(vl1.MATNR, vl1.DEL_QTY_BAG) || '-'}</td>
                                        </tr>
                                      </>
                                    )
                                  })
                                  }

                                  <tr style={{ borderTop: '0.5px solid black' }}>
                                    <td colSpan={3} style={{ width: '74%', textAlign: 'end' }}>Sub Total</td>
                                    <td style={{ width: '10%', textAlign: 'center' }}>{`${vl.delivery_net_qty} TON`}</td>
                                    <td style={{ width: '10%', textAlign: 'center' }}>{`${findSubTotal(vl.line_item_details)} ft`}</td>
                                  </tr>

                                </table>
                              </div>
                            </div>
                          </>
                        )
                      })}

                      <div style={{ padding: '1%', borderTop: '1px solid black' }}>
                        <table style={{ border: '1px solid black', height: 'fit-content' }}>
                          <tr>
                            <td colSpan={3} style={{ width: '74%', textAlign: 'end' }}>Total Product Volume</td>
                            <td style={{ width: '10%', textAlign: 'center' }}>{`${reportData.billed_net_qty} TON`}</td>
                            <td style={{ width: '10%', textAlign: 'center' }}>{`${overAllVolumeFinder(reportData.shipment_all_child_info)} ft`}</td>
                          </tr>
                        </table>

                      </div>
                      <div style={hd}></div>
                      <strong style={{ marginLeft: '2%', color: "green", fontFamily: "timesnewroman", fontSize: "medium" }}>Vehicle Details :</strong><br />
                      <div>
                        <table style={{ border: '1px solid black', marginTop: '2%', height: 'fit-content' }}>
                          <tr style={{ borderBottom: '1px solid black' }}>
                            <th style={{ width: '20%', textAlign: 'center' }}>Vehicle No.</th>
                            <th style={{ width: '20%', textAlign: 'center' }}>Vehicle Capacity(MTS)</th>
                            <th style={{ width: '20%', textAlign: 'center' }}>Length(ft)</th>
                            <th style={{ width: '20%', textAlign: 'center' }}>Width(ft)</th>
                            <th style={{ width: '20%', textAlign: 'center' }}>Height(ft)</th>
                            <th style={{ width: '20%', textAlign: 'center' }}>Volume(ft)</th>
                          </tr>

                          <tr>
                            <td style={{ width: '20%', textAlign: 'center', fontWeight: '100' }}>{reportData.vehicle_number}</td>
                            <td style={{ width: '20%', textAlign: 'center', fontWeight: '100' }}>{reportData.vehicle_capacity_id_info ? reportData.vehicle_capacity_id_info.capacity : '-'}</td>
                            <td style={{ width: '20%', fontWeight: '100', textAlign: 'center' }}>{reportData.vehicle_info ? reportData.vehicle_info.vehicle_length : '-'}</td>
                            <td style={{ width: '20%', textAlign: 'center', fontWeight: '100' }}>{reportData.vehicle_info ? reportData.vehicle_info.vehicle_width : '-'}</td>
                            <td style={{ width: '20%', textAlign: 'center', fontWeight: '100' }}>{reportData.vehicle_info ? reportData.vehicle_info.vehicle_height : '-'}</td>
                            <td style={{ width: '20%', textAlign: 'center', fontWeight: '800' }}>{reportData.vehicle_info ? vehicleVolumeFinder(reportData.vehicle_info) : '-'}</td>
                          </tr>


                        </table>
                      </div>
                      <div style={hd}></div>

                      <strong style={{ marginLeft: '2%', color: "green", fontFamily: "timesnewroman", fontSize: "medium" }}>Vehicle Space Utilization :</strong><br />
                      <div style={{ display: "flex", fontFamily: "timesnewroman", fontSize: "small", marginLeft: "15%", color: "brown" }}>
                        <span style={{ marginRight: "1%", width: "30%" }}>
                          Vehicle Space Utilization %
                        </span>
                        <span style={{ width: "70%" }}>
                          = (Total Product Volume / Truck Volume) × 100
                        </span>
                      </div>
                      <div style={{ display: "flex", fontFamily: "timesnewroman", fontSize: "small", marginLeft: "15%", color: "brown" }}>
                        <span style={{ marginRight: "1%", width: "30%" }}>

                        </span>
                        <span style={{ width: "70%" }}>
                          = {`(${overAllVolumeFinder(reportData.shipment_all_child_info)} / ${reportData.vehicle_info ? vehicleVolumeFinder(reportData.vehicle_info) : '0'}) × 100`}
                        </span>
                      </div>
                      <div style={{ display: "flex", fontFamily: "timesnewroman", fontSize: "small", marginLeft: "15%", color: "blue", marginBottom: "1%" }}>
                        <span style={{ marginRight: "1%", width: "30%" }}>
                          Vehicle Space Utilization %
                        </span>
                        <span style={{ width: "70%" }}>
                          = {vehicleUtilizationFinder()}
                        </span>
                      </div>
                      <div style={hd}></div>

                      <strong style={{ marginLeft: '2%', color: "green", fontFamily: "timesnewroman", fontSize: "medium" }}>Vehicle Weight Utilization :</strong><br />
                      <div style={{ display: "flex", fontFamily: "timesnewroman", fontSize: "small", marginLeft: "15%", color: "brown" }}>
                        <span style={{ marginRight: "1%", width: "30%" }}>
                          Vehicle Weight Utilization %
                        </span>
                        <span style={{ width: "70%" }}>
                          = (Total Product Weight / Truck Payload Capacity) × 100
                        </span>
                      </div>
                      <div style={{ display: "flex", fontFamily: "timesnewroman", fontSize: "small", marginLeft: "15%", color: "brown" }}>
                        <span style={{ marginRight: "1%", width: "30%" }}>

                        </span>
                        <span style={{ width: "70%" }}>
                          = {`(${reportData.billed_net_qty} / ${reportData.vehicle_capacity_id_info ? reportData.vehicle_capacity_id_info.capacity : '-'}) × 100`}
                        </span>
                      </div>
                      <div style={{ display: "flex", fontFamily: "timesnewroman", fontSize: "small", marginLeft: "15%", color: "blue", marginBottom: "1%" }}>
                        <span style={{ marginRight: "1%", width: "30%" }}>
                          Vehicle Weight Utilization %
                        </span>
                        <span style={{ width: "70%" }}>
                          = {vehicleWeightUtilizationFinder()}
                        </span>
                      </div>




                      <table style={{ border: '1px solid black', height: 'fit-content' }}>
                        <tr>
                          <td colSpan={2} style={{ width: '60%', textAlign: 'center' }}>{`Shipment Created By : ${reportData.shipment_user_info.emp_name}`}</td>
                          <td style={{ width: '40%', textAlign: 'center' }}>{`Current Date & Time : ${GetDateTimeFormat('current')}`}</td>
                        </tr>
                      </table>

                    </div>
                  </tr>
                )}
                <tr>
                  <td width="700" align="center" style={{ paddingTop: '1px', paddingBottom: '0px' }}>

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

export default OwnVehiclesFgSalesReportUtilityView
