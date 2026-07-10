import {
  CCol,
  CRow,
  CContainer,
  CCard,
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
  CButton,
} from '@coreui/react'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Loader from 'src/components/Loader'
import SmallLoader from 'src/components/SmallLoader'
import VehicleAssignmentSapService from 'src/Service/SAP/VehicleAssignmentSapService'
import LocationApi from 'src/Service/SubMaster/LocationApi'
import DefinitionsListApi from 'src/Service/Definitions/DefinitionsListApi'
import DepoShipmentCreationService from 'src/Service/Depo/Shipment/DepoShipmentCreationService'
import * as ShipmentCreationModifyConstants from './ShipmentCreationModifyConstants'
import DepoCustomerMasterService from 'src/Service/Depo/Master/DepoCustomerMasterService'
import DepoFreightMasterService from 'src/Service/Depo/Master/DepoFreightMasterService'

const OpenDeliveryInfo = ({ getDeliveries, fetchAllData, division, shipmentData, getUpdates }) => {
  const [rowData, setRowData] = useState([])
  const [saleOrders, setSaleOrders] = useState([])
  const [fetch, setFetch] = useState(false)
  const [assignData, setAssignData] = useState(false)
  const [assignTruckWordEnable, setAssignTruckWordEnable] = useState(true)
  const [locationData, setLocationData] = useState([])
  const [shipmentWaitingDeliveriesData, setShipmentWaitingDeliveriesData] = useState([])
  const [shipmentDeliveriesDataUpdated, setShipmentDeliveriesDataUpdated] = useState([])

  // var shipmentDeliveriesDataUpdated = JSON.parse(JSON.stringify(shipmentData.shipment_delivery_info))

  // const [drawInsertTableData, setDrawInsertTableData] = useState([])

  /*================== User Location Fetch ======================*/
  const user_info_json = localStorage.getItem('user_info')
  const user_info = JSON.parse(user_info_json)
  const user_locations = []
  const user_access_locations = []

  console.log(user_info)
  const navigation = useNavigate()

  /* Get User Locations From Local Storage */
  user_info.location_info.map((data, index) => {
    user_locations.push(data.id)
  })

  console.log(shipmentData,'shipmentData-shipmentData')
  /* ===== User Inco Terms Declaration Start ===== */

  const user_inco_terms = []
  /* Get User Inco Terms From Local Storage */
  user_info.inco_term_info.map((data, index) => {
    user_inco_terms.push(data.def_list_code)
  })
  const [incoTermData, setIncoTermData] = useState([])

  useEffect(() => {

     /* section for getting Inco Term Lists from database */
     DefinitionsListApi.visibleDefinitionsListByDefinition(16).then((response) => {

      let viewData = response.data.data

      let rowDataList_location = []
      viewData.map((data, index) => {
        rowDataList_location.push({
          sno: index + 1,
          incoterm_name: data.definition_list_name,
          incoterm_code: data.definition_list_code,
        })
      })

      setIncoTermData(rowDataList_location)
    })

  }, [])

  /* Display The Inco Term Name via Given Inco Term Code */
  const getIncoTermNameByCode = (code) => {

    let filtered_incoterm_data = incoTermData.filter((c, index) => {

      if (c.incoterm_code == code) {
        return true
      }
    })

    let incoTermName = filtered_incoterm_data[0] ? filtered_incoterm_data[0].incoterm_name : 'Loading..'

    return incoTermName
  }

  /* ===== User Inco Terms Declaration End ===== */

  const [depoCustomerData, setDepoCustomerData] = useState([])
  const [depoFreightData, setDepoFreightData] = useState([])

  useEffect(()=>{
    //section to fetch Active Depo Customers
    DepoCustomerMasterService.getActiveDepoCustomers().then((res) => {
      console.log(res.data.data,'getActiveDepoCustomers')
      setDepoCustomerData(res.data.data)
    })

    //section to fetch Depo Freights
    DepoFreightMasterService.getActiveDepoFreights().then((res) => {
      console.log(res.data.data,'getActiveDepoFreights')
      setDepoFreightData(res.data.data)
    })
  },[])


  /* Get User Plant Access From Local Storage */
  user_info.location_info.map((data1, index1) => {
    user_access_locations.push(data1.location_code)
  })

  /* Get User Id From Local Storage */
  const user_id = user_info.user_id

  console.log(user_locations, 'user_locations')
  console.log(user_access_locations, 'user_access_locations')

  const inArray = (plant, plants) => {
    var length = plants.length
    for (var i = 0; i < length; i++) {
      if (plants[i] == plant) return true
    }
    return false
  }

  /*================== User Location Fetch ======================*/

  const [deliveryinfo, setDeliveryInfo] = useState({
    delivery_orders: [],
    response: [],
  })

  const [updatedinfo, setUpdatedInfo] = useState({
    insert_deliveries_data:[],
    actual_freight: '',
    budget_freight: '',
    add_enable: false,
  })

  const assign_delivery = (e) => {
    // Destructuring
    const { value, checked } = e.target
    const { delivery_orders } = deliveryinfo

    // Case 1 : The user checks the box
    if (checked) {
      setDeliveryInfo({
        delivery_orders: [...delivery_orders, value],
        response: [...delivery_orders, value],
      })
      getDeliveries({
        delivery_orders: [...delivery_orders, value],
        response: [...delivery_orders, value],
      })
    }

    // Case 2 : The user unchecks the box
    else {
      setDeliveryInfo({
        delivery_orders: delivery_orders.filter((e) => e !== value),
        response: delivery_orders.filter((e) => e !== value),
      })
      getDeliveries({
        delivery_orders: delivery_orders.filter((e) => e !== value),
        response: delivery_orders.filter((e) => e !== value),
      })
    }

    console.log(deliveryinfo.response)
  }

  const assignTruckData = () => {
    console.log(deliveryinfo,'deliveryinfo-deliveryinfo')
    console.log(saleOrders,'saleOrders-saleOrders')
    let delivery_orders_array_needed = []
    let delivery_display_data = []

    deliveryinfo.delivery_orders.map((val1,ind1)=>{
      saleOrders.map((val2,ind2)=>{
        if(val1 == val2.VBELN2){
          delivery_orders_array_needed.push(val2)
        }
      })
    })
    console.log(delivery_orders_array_needed,'delivery_orders_array_needed')

    // let sd_data = shipmentData.shipment_child_info
    let sd_data = shipmentData.shipment_child_info.length > 0 ? shipmentData.shipment_child_info : shipmentData.shipment_delivery_info
    console.log(sd_data,'shipmentData.shipment_child_info')
    sd_data.map((val4,ind4)=>{
      let datan1 = {}
      datan1.deliveryNo = val4.delivery_no
      // datan.customerCode = val3.KUNNR
      datan1.customerName = val4.customer_info.CustomerName
      datan1.customerRoute = val4.customer_info.CustomerRoute
      datan1.deliveryQty = val4.delivery_qty
      datan1.deliveryNetQty = val4.delivery_net_qty
      datan1.deliveryFreight = val4.delivery_depo_freight_amount
      datan1.parentDelivery = 'yes'
      // datan1.budgetFreight = ShipmentCreationModifyConstants.freightValueFinder(val4.delivery_qty,val4.delivery_depo_freight_amount)
      datan1.budgetFreight = ShipmentCreationModifyConstants.freightValueFinder(val4.delivery_net_qty,val4.delivery_depo_freight_amount)
      delivery_display_data.push(datan1)
    })

    // if(assignData){

    // } else {
    //   delivery_orders_array_needed = []
    // }

    delivery_orders_array_needed.map((val3,ind3)=>{
      let datan = {}
      datan.deliveryNo = val3.VBELN2
      // datan.customerCode = val3.KUNNR
      datan.customerName = val3.NAME1
      datan.customerRoute = val3.ROUTE
      datan.deliveryQty = val3.TOT_DEL_MTS
      datan.deliveryNetQty = val3.TOT_NET_MTS
      datan.parentDelivery = 'no'
      datan.deliveryFreight = ShipmentCreationModifyConstants.cont_loc_cust_freight_finder(depoCustomerData,depoFreightData,shipmentData.parking_yard_info.contractor_id,val3.WERKS,val3.KUNNR)
      // datan.budgetFreight = ShipmentCreationModifyConstants.freightValueFinder(val3.TOT_DEL_MTS,datan.deliveryFreight)
      datan.budgetFreight = ShipmentCreationModifyConstants.freightValueFinder(val3.TOT_NET_MTS,datan.deliveryFreight)
      delivery_display_data.push(datan)
    })

    let largeFrei = ShipmentCreationModifyConstants.largestFreightFinder1(delivery_display_data)

    delivery_display_data.map((val5,ind5)=>{
      val5.actFri = shipmentData.freight_type == 2 ? largeFrei : val5.deliveryFreight
      // val5.actualFreight = shipmentData.freight_type == 2 ? ShipmentCreationModifyConstants.freightValueFinder(val5.deliveryQty,largeFrei) : val5.budgetFreight
      val5.actualFreight = shipmentData.freight_type == 2 ? ShipmentCreationModifyConstants.freightValueFinder(val5.deliveryNetQty,largeFrei) : val5.budgetFreight
    })

    setUpdatedInfo({
      insert_deliveries_data:delivery_display_data,
      actual_freight: shipmentData.freight_type == 2 ? ShipmentCreationModifyConstants.actualFreightValue_FindCalculation(delivery_display_data) : ShipmentCreationModifyConstants.budjetFreightValue_FindCalculation(delivery_display_data),
      budget_freight: ShipmentCreationModifyConstants.budjetFreightValue_FindCalculation(delivery_display_data),
      add_enable: true,
    })

    getUpdates({
      insert_deliveries_data:delivery_display_data,
      actual_freight: shipmentData.freight_type == 2 ? ShipmentCreationModifyConstants.actualFreightValue_FindCalculation(delivery_display_data) : ShipmentCreationModifyConstants.budjetFreightValue_FindCalculation(delivery_display_data),
      budget_freight: ShipmentCreationModifyConstants.budjetFreightValue_FindCalculation(delivery_display_data),
      add_enable: true,
    })

    console.log(delivery_display_data,'delivery_display_data')
    setAssignData(!assignData)
    setShipmentDeliveriesDataUpdated(delivery_display_data)
  }

  /* Date Format Change : yyyy-mm-dd to dd-mm-yy */
  const formatDate = (input) => {
    var datePart = input.match(/\d+/g),
      year = datePart[0].substring(2), // get only two digits
      month = datePart[1],
      day = datePart[2]

    return day + '-' + month + '-' + year
  }

  const loadSaleOrderInfoTable = (sap_data) => {
    var del_order = []

    var delivery_orders_array = {}

    DepoShipmentCreationService.getShipmentWiseWaitingDeliveries().then((res) => {

      let shipment_waiting_delivery_data = res.data.data
      console.log(shipment_waiting_delivery_data,'shipment_waiting_delivery_data')
      let shipment_waiting_delivery_array = []
      shipment_waiting_delivery_data.map((val,ind)=>{
        shipment_waiting_delivery_array.push(val.delivery_no)
      })
      console.log(shipment_waiting_delivery_array,'shipment_waiting_delivery_array')
      setShipmentWaitingDeliveriesData(shipment_waiting_delivery_array)
      setFetch(true)
    })

    console.log(sap_data)

    // Converting the Delivery Details into Delivery Orders
    // =================================================================================================

    const obj = Object.entries(sap_data)

    obj.forEach(([key_st, value]) => {
      let lineItem = value.LINE_ITEM
      // console.log(key_st)
      // console.log(value)

      if (division == 'nlfd' && inArray(value.WERKS, user_access_locations) && !inArray(value.VBELN2,shipmentWaitingDeliveriesData)) {
        del_order.push({
          sno: (key_st % 10) + 1,
          SaleOrderNumber: value.VBELN,
          SaleOrderDate: value.ERDAT,
          SaleOrderQty: value.SO_QTY,
          DeliveryOrderNumber: value.VBELN2,
          // DeliveryOrderDate: value.WADAT_IST,
          DeliveryOrderDate: value.BLDAT,
          CustomerName: value.NAME1,
          CustomerCode: value.KUNNR,
          CustomerCity: value.ORT01,
          CustomerRoute: value.ROUTE,
          DeliveryQty: value.TOT_DEL_MTS,
          DeliveryNetQty: value.TOT_NET_MTS,
          DeliveryItems: value.LINE_ITEM,
          DeliveryPlant: value.WERKS,
          IncoTerm: value.INCO1,
        })
      } else if (division == 'nlcd' && value.WERKS == '9290') {
        del_order.push({
          sno: (key_st % 10) + 1,
          SaleOrderNumber: value.VBELN,
          SaleOrderDate: value.ERDAT,
          SaleOrderQty: value.SO_QTY,
          DeliveryOrderNumber: value.VBELN2,
          // DeliveryOrderDate: value.WADAT_IST,
          DeliveryOrderDate: value.BLDAT,
          CustomerName: value.NAME1,
          CustomerCode: value.KUNNR,
          CustomerCity: value.ORT01,
          CustomerRoute: value.ROUTE,
          DeliveryQty: value.TOT_DEL_MTS,
          DeliveryNetQty: value.TOT_NET_MTS,
          DeliveryItems: value.LINE_ITEM,
          DeliveryPlant: value.WERKS,
          IncoTerm: value.INCO1,
        })
      }
    })

    // Conversion completed
    // =================================================================================================

    var all_del_no = []
    var glo = 0
    console.log(del_order)
    let filtered_del_order = del_order.filter((c, index) => {
      if (!all_del_no.includes(c.DeliveryOrderNumber)) {
        c.sno = glo + 1
        all_del_no.push(c.DeliveryOrderNumber)
        glo++
        return true
      }
    })

    fetchAllData(del_order)
    setRowData(del_order)
  }

  useEffect(() => {
    // section for getting Shed Details from database
    VehicleAssignmentSapService.getSaleOrders().then((res) => {
      // console.log(res.data)

      setSaleOrders(res.data)
      // setFetch(true)
      loadSaleOrderInfoTable(res.data)
    })
  }, [])

  useEffect(() => {
    LocationApi.getLocation().then((response) => {
      let viewData = response.data.data
      // let rowDataList = []
      let rowDataList_location = []
      viewData.map((data, index) => {
        rowDataList_location.push({
          sno: index + 1,
          Location: data.location,
          location_code: data.location_code,
        })
      })
      setLocationData(rowDataList_location)
    })
  }, [])

  /* Display The Delivery Plant Name via Given Delivery Plant Code */
  const getLocationNameByCode = (code) => {
    let filtered_location_data = locationData.filter((c, index) => {
      if (c.location_code == code) {
        return true
      }
    })
    // console.log(filtered_location_data)
    let locationName = filtered_location_data[0] ? filtered_location_data[0].Location : 'Loading..'
    return locationName
  }

  // useEffect(() => {
  //   loadSaleOrderInfoTable()
  // }, [fetch])

  return (
    <>
      {!fetch && <SmallLoader />}
      {fetch && (
        <CContainer>

          <CRow>
            <CCol
              className="mt-2 offset-md-9"
              xs={12}
              sm={12}
              md={3}
              style={{ display: 'flex', flexDirection: 'row-reverse', cursor: 'pointer' }}
            >
                {assignTruckWordEnable && deliveryinfo.delivery_orders.length > 0 && (
                  <CButton
                  color="warning"
                  className="mx-3 text-white"
                  size="sm"
                  id="inputAddress"
                  onClick={() => {
                      setAssignTruckWordEnable(false)
                      assignTruckData()
                    }
                  }
                >
                    <span className="float-start">
                      <i className="" aria-hidden="true"></i> &nbsp;Assign Truck
                    </span>
                  </CButton>
                )}
                {!assignTruckWordEnable && (
                  <CButton
                  color="warning"
                  className="mx-3 text-white"
                  size="sm"
                  id="inputAddress"
                  onClick={() => {
                      setAssignTruckWordEnable(true)
                      setAssignData(false)
                      setDeliveryInfo({
                        delivery_orders: [],
                        response: [],
                      })
                      setUpdatedInfo({
                        insert_deliveries_data:[],
                        actual_freight: '',
                        budget_freight: '',
                        add_enable: false,
                      })
                      getUpdates({
                        insert_deliveries_data:[],
                        actual_freight: '',
                        budget_freight: '',
                        add_enable: false,
                      })

                    }
                  }
                >
                    <span className="float-start">
                      <i className="" aria-hidden="true"></i> Back To Open Delivery
                    </span>
                  </CButton>
                )}
            </CCol>
          </CRow>

          {assignData && (<CRow>
            <CTable style={{ height: 'auto' }}>
              <CTableHead style={{ backgroundColor: '#4d3227', color: 'white' }}>
                <CTableRow>
                  <CTableHeaderCell
                    scope="col"
                    style={{ color: 'white', width: '5%' }}
                    data-coreui-toggle="tooltip"
                    data-coreui-placement="top"
                    title="Sequence"
                  >
                    Seq.
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" style={{ color: 'white', width: '8%' }}>
                    Delivery No.
                  </CTableHeaderCell>

                  <CTableHeaderCell scope="col" style={{ color: 'white', width: '21%' }}>
                    Customer Name
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" style={{ color: 'white', width: '20%' }}>
                    Depo - Route
                  </CTableHeaderCell>
                  <CTableHeaderCell
                    scope="col"
                    style={{ color: 'white', width: '8%' }}
                    data-coreui-toggle="tooltip"
                    data-coreui-placement="top"
                    title="Quantity in MTS"
                  >
                    Qty / MTS
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" style={{ color: 'white', width: '13%' }}>
                    Budget Freight / MTS
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" style={{ color: 'white', width: '13%' }}>
                    Actual Freight / MTS
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" style={{ color: 'white', width: '13%' }}>
                    Budget Freight Value
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" style={{ color: 'white', width: '13%' }}>
                    Actual Freight Value
                  </CTableHeaderCell>

                </CTableRow>
              </CTableHead>
              <CTableBody>

                {shipmentDeliveriesDataUpdated.map((data, index) => {
                  console.log(data,'datareturn')
                  return (
                    <>
                      <CTableRow
                        key={`test${index}`}
                        // style={{ background: '#ebc999' }}
                        style={ data.parentDelivery == 'yes' ? { background: '#ebc999'} : {background: 'skyblue'} }
                      >
                        <CTableDataCell style={{ width: '5%' }}>{index + 1}</CTableDataCell>
                        <CTableDataCell style={{ width: '8%' }}>
                          {data.deliveryNo}
                        </CTableDataCell>
                        <CTableDataCell style={{ width: '21%' }}>
                          {data.customerName}
                        </CTableDataCell>
                        <CTableDataCell style={{ width: '20%' }}>
                        {data.customerRoute}
                        </CTableDataCell>
                        <CTableDataCell style={{ width: '8%' }}>
                          {data.deliveryNetQty}
                          {/* {data.deliveryQty} */}
                        </CTableDataCell>
                        <CTableDataCell style={{ width: '13%' }}>
                        {data.deliveryFreight}
                        </CTableDataCell>
                        <CTableDataCell style={{ width: '13%' }}>
                        {data.actFri}
                        </CTableDataCell>
                        <CTableDataCell style={{ width: '13%' }}>
                          {data.budgetFreight}
                        </CTableDataCell>
                        <CTableDataCell style={{ width: '13%' }}>
                        {data.actualFreight}
                        </CTableDataCell>

                      </CTableRow>
                    </>
                  )
                })}
                <CTableRow style={{ background: '#ebc999'}}>
                  <CTableDataCell style={{ width: '5%' }}> </CTableDataCell>
                  <CTableDataCell style={{ width: '8%' }}> </CTableDataCell>
                  <CTableDataCell style={{ width: '21%' }}>
                  </CTableDataCell>
                  <CTableDataCell style={{ width: '20%' }}>
                    <b>Total</b>
                  </CTableDataCell>
                  <CTableDataCell style={{ width: '8%' }}>
                    <b>{ShipmentCreationModifyConstants.totalQtyFinder(shipmentDeliveriesDataUpdated)}</b>
                  </CTableDataCell>
                  <CTableDataCell style={{ width: '13%' }}>
                    <b>-</b>
                  </CTableDataCell>
                  <CTableDataCell style={{ width: '13%' }}>
                    <b>-</b>
                  </CTableDataCell>
                  <CTableDataCell style={{ width: '13%' }}>
                    <b>{ShipmentCreationModifyConstants.budjetFreightValue_FindCalculation(shipmentDeliveriesDataUpdated)}</b>
                  </CTableDataCell>
                  <CTableDataCell style={{ width: '13%' }}>
                  <b>{ShipmentCreationModifyConstants.actualFreightValue_FindCalculation(shipmentDeliveriesDataUpdated)}</b>
                  </CTableDataCell>

                </CTableRow>

              </CTableBody>
            </CTable>
          </CRow>)}
          {!assignData && (<CRow>
            {/* <CTable> */}
            <CTable style={{ height: 'auto' }}>
              <CTableHead style={{ backgroundColor: '#4d3227', color: 'white' }}>
                <CTableRow style={{ width: '100%' }}>
                  <CTableHeaderCell
                    scope="col"
                    style={{ color: 'white', width: '5%', textAlign: 'center' }}
                  >
                    #
                  </CTableHeaderCell>
                  <CTableHeaderCell
                    scope="col"
                    style={{ color: 'white', width: '5%', textAlign: 'center' }}
                  >
                    S.No
                  </CTableHeaderCell>
                  <CTableHeaderCell
                            scope="col"
                            style={{ color: 'white', width: '9%', textAlign: 'center' }}
                  >
                    Inco Term
                  </CTableHeaderCell>
                  <CTableHeaderCell
                    scope="col"
                    style={{ color: 'white', width: '9%', textAlign: 'center' }}
                  >
                    Delivery Plant
                  </CTableHeaderCell>
                  <CTableHeaderCell
                    scope="col"
                    style={{ color: 'white', width: '9%', textAlign: 'center' }}
                  >
                    Delivery No
                  </CTableHeaderCell>
                  <CTableHeaderCell
                    scope="col"
                    style={{ color: 'white', width: '9%', textAlign: 'center' }}
                  >
                    Delivery Date
                  </CTableHeaderCell>
                  <CTableHeaderCell
                    scope="col"
                    style={{ color: 'white', width: '9%', textAlign: 'center' }}
                  >
                    SO No
                  </CTableHeaderCell>
                  <CTableHeaderCell
                    scope="col"
                    style={{ color: 'white', width: '9%', textAlign: 'center' }}
                  >
                    SO Date
                  </CTableHeaderCell>

                  <CTableHeaderCell
                    scope="col"
                    style={{ color: 'white', width: '15%', textAlign: 'center' }}
                  >
                    Customer Name
                  </CTableHeaderCell>
                  <CTableHeaderCell
                    scope="col"
                    style={{ color: 'white', width: '8%', textAlign: 'center' }}
                  >
                    City
                  </CTableHeaderCell>
                  <CTableHeaderCell
                    scope="col"
                    style={{ color: 'white', width: '9%', textAlign: 'center' }}
                  >
                    Route
                  </CTableHeaderCell>

                  <CTableHeaderCell
                    scope="col"
                    style={{ color: 'white', width: '5%', textAlign: 'center' }}
                  >
                    Net QTY in MTS
                  </CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {/* { saleOrders && { */}
                {/* {fetch && */}
                {rowData.map((data, index) => {
                  // console.log('data')
                  // console.log(data)
                  // if (data.VBELN2)
                  return (
                    <>
                      <CTableRow>
                        <CTableDataCell style={{ width: '5%', textAlign: 'center' }} scope="row">
                          <input
                            className="form-check-input"
                            style={{ minHeight: '18px !important' }}
                            type="checkbox"
                            name="delivery_orders"
                            value={data.DeliveryOrderNumber}
                            id="flexCheckDefault"
                            onChange={assign_delivery}
                          />
                          {/* <input type="checkbox" name="name2" /> */}
                        </CTableDataCell>
                        <CTableDataCell style={{ width: '5%', textAlign: 'center' }} scope="row">
                          {data.sno}
                        </CTableDataCell>
                        <CTableDataCell style={{ width: '9%', textAlign: 'center' }} scope="row">
                          {getIncoTermNameByCode(data.IncoTerm)}
                        </CTableDataCell>
                        <CTableDataCell style={{ width: '9%', textAlign: 'center' }} scope="row">
                          {getLocationNameByCode(data.DeliveryPlant)}
                        </CTableDataCell>
                        <CTableDataCell style={{ width: '9%', textAlign: 'center' }} scope="row">
                          {data.DeliveryOrderNumber}
                        </CTableDataCell>
                        <CTableDataCell style={{ width: '9%', textAlign: 'center' }} scope="row">
                          {formatDate(data.DeliveryOrderDate)}{' '}
                        </CTableDataCell>
                        <CTableDataCell style={{ width: '9%', textAlign: 'center' }} scope="row">
                          {data.SaleOrderNumber}
                        </CTableDataCell>
                        <CTableDataCell style={{ width: '9%', textAlign: 'center' }} scope="row">
                          {formatDate(data.SaleOrderDate)}{' '}
                        </CTableDataCell>
                        <CTableDataCell style={{ width: '15%', textAlign: 'center' }} scope="row">
                          {data.CustomerName}
                        </CTableDataCell>
                        <CTableDataCell style={{ width: '8%', textAlign: 'center' }} scope="row">
                          {data.CustomerCity}
                        </CTableDataCell>
                        <CTableDataCell style={{ width: '9%', textAlign: 'center' }} scope="row">
                          {data.CustomerRoute}
                        </CTableDataCell>
                        <CTableDataCell style={{ width: '5%', textAlign: 'center' }} scope="row">
                          {data.DeliveryNetQty}
                          {/* {data.DeliveryQty} */}
                        </CTableDataCell>
                      </CTableRow>
                    </>
                  )
                })}
              </CTableBody>
            </CTable>
          </CRow>)}
        </CContainer>
      )}
    </>
  )
}

export default OpenDeliveryInfo
