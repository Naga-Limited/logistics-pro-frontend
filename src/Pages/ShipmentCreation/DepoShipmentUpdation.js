import {
  CButton,
  CCard,
  CContainer,
  CCol,
  CRow,
  CModal,
  CFormInput,
  CFormLabel,
  CModalHeader,
  CFormSelect,
  CInputGroupText,
  CInputGroup,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CAlert, 
  CFormTextarea,
  CTableDataCell,
  CTableBody,
  CTableRow,
  CTableHeaderCell,
  CTable,
  CTableHead,
  CHeaderBrand,
} from '@coreui/react'
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Loader from 'src/components/Loader'
import SmallLoader from 'src/components/SmallLoader' 
import ExpenseIncomePostingDate from '../TripsheetClosure/Calculations/ExpenseIncomePostingDate'
import DefinitionsListApi from 'src/Service/Definitions/DefinitionsListApi' 
import Swal from 'sweetalert2' 
import AccessDeniedComponent from 'src/components/commoncomponent/AccessDeniedComponent' 
import VehicleAssignmentSapService from 'src/Service/SAP/VehicleAssignmentSapService'
import DeliveryOrderInfo from './Segments/DeliveryOrderInfo'
import LocationApi from 'src/Service/SubMaster/LocationApi'
import UserLoginMasterService from 'src/Service/Master/UserLoginMasterService' 
import DepoTSCreationService from 'src/Service/Depo/TSCreation/DepoTSCreationService'
import DepoCustomerMasterService from 'src/Service/Depo/Master/DepoCustomerMasterService'
import DepoFreightMasterService from 'src/Service/Depo/Master/DepoFreightMasterService'
import DepoShipmentCreationService from 'src/Service/Depo/Shipment/DepoShipmentCreationService'

const DepoShipmentUpdation = () => {
  const REQ = () => <span className="text-danger"> * </span>

  /*================== User Id & Location Fetch ======================*/
  const user_info_json = localStorage.getItem('user_info')
  const user_info = JSON.parse(user_info_json)
  const user_locations = []
  const navigation = useNavigate()
  const is_admin = user_info.user_id == 1 && user_info.is_admin == 1

  if(is_admin){
    console.log(user_info)
  }

  /* Get User Locations From Local Storage */
  user_info.location_info.map((data, index) => {
    user_locations.push(data.id)
  })

  const Expense_Income_Posting_Date = ExpenseIncomePostingDate();
  console.log(Expense_Income_Posting_Date,'ExpenseIncomePostingDate')

  /* Get User Id From Local Storage */
  const user_id = user_info.user_id

  // console.log(user_locations)
  /*================== User Location Fetch ======================*/

  /* ==================== Access Part Start ========================*/
  const [screenAccess, setScreenAccess] = useState(false)

  useEffect(()=>{

    if(user_info.is_admin == 1){
      console.log('screen-access-allowed')
      setScreenAccess(true)
    } else{
      console.log('screen-access-not-allowed')
      setScreenAccess(false)
    }

  },[])
  /* ==================== Access Part End ========================*/

  const [fetch, setFetch] = useState(false)
  const [smallfetch, setSmallFetch] = useState(false)
  const [pageList, setPageList] = useState([])

  const [tripHirePaymentData, setTripHirePaymentData] = useState({})
  const [shipmentPossibility, setShipmentPossibility] = useState(false)
  const [shipmentError, setShipmentError] = useState(false)
  const [tripSheetHaving, setTripsheetHaving] = useState(false)
  const [shipmentHaving, setShipmentHaving] = useState(false)
  const [shipmentData, setShipmentData] = useState([])
  const [foodsRouteData, setFoodsRouteData] = useState([])
  const [consumerRouteData, setConsumerRouteData] = useState([])
  const [shipmentRoute, setShipmentRoute] = useState(0)
  const [shipmentLastRoute, setShipmentLastRoute] = useState(0)

  const [shipmentUpdate, setShipmentUpdate] = useState(false)
  const [activeKey, setActiveKey] = useState(1)

  const [shipmentRemarks, setShipmentRemarks] = useState('')
  const [shipmentDivision, setShipmentDivision] = useState('')
  const [shipmentPgiStatus, setShipmentPgiStatus] = useState(0)
  const [shipmentTPP, setShipmentTPP] = useState(0)
  const [userName, setUserName] = useState(0)

  const [errorModal, setErrorModal] = useState(false)
  const [error, setError] = useState({})
  const [rowData, setRowData] = useState([])
  const [visible, setVisible] = useState(false)
  const [saleOrders, setSaleOrders] = useState([])

  const [depoCustomerData, setDepoCustomerData] = useState([])
  const [depoFreightData, setDepoFreightData] = useState([])
  const [contractorId, setContractorId] = useState('')
  const [contractorFreight, setContractorFreight] = useState('')
  const [deliveryFreightData, setDeliveryFreightData] = useState([])
  const [shipmentBudjetFreight, setShipmentBudjetFreight] = useState(0)
  const [shipmentActualFreight, setShipmentActualFreight] = useState(0)
  const [largestFreight, setLargestFreight] = useState(0)
  const [customerAndFreightInvalidData, setCustomerAndFreightInvalidData] = useState([])
  

  var del_qty = []
  var total_del_qty = 0
  var total_del_qty_rounded_value = 0

  //Split Delivery Data for getting Selected Delivery Numbers's Quantity

  let filtered_del_order_qty = rowData.filter((c, index) => {

    var temp = 0
    console.log(c,'filtered_del_order_qty-c')
    console.log(rowData,'filtered_del_order_qty-rowData')
    rowData.map((data1, index) => {
      if (c.DeliveryOrderNumber == data1.DeliveryOrderNumber) {
         
        del_qty.push(c)
        // total_del_qty = total_del_qty + c.DeliveryQty
        total_del_qty = total_del_qty + c.DeliveryNetQty
        console.log(total_del_qty,'filtered_del_order_qty-total_del_qty')
        //return true
      }
    })
    total_del_qty_rounded_value = parseFloat(total_del_qty).toFixed(3)
    console.log(total_del_qty_rounded_value,'total_del_qty_rounded_value')
  })

  useEffect (()=>{

    let invalid_data = {}

    invalid_data.ActualFreightCondition = shipmentActualFreight
    invalid_data.BudjetFreightCondition = shipmentBudjetFreight
    invalid_data.DeliveryFreightValue = deliveryFreightData

    if(rowData.length != deliveryFreightData.length){
      invalid_data.CustomerMasterCondition = false
    } else {
      invalid_data.CustomerMasterCondition = true
    }

    invalid_data.FinalFreightCondition = contractorFreight == '2' ? Number(parseFloat(total_del_qty_rounded_value*largestFreight).toFixed(2)) : shipmentBudjetFreight
    invalid_data.FreightType = contractorFreight

    console.log(invalid_data,'invalid_data')
    console.log(shipmentBudjetFreight,'shipmentBudjetFreight')
    console.log(shipmentActualFreight,'shipmentActualFreight')

    // getCustomerAndFreightInvalidData(invalid_data)

    setCustomerAndFreightInvalidData(invalid_data)

  },[contractorId,shipmentBudjetFreight,shipmentActualFreight])

  useEffect (()=>{
    if(deliveryFreightData.length > 0 && contractorId) {
      let budfreight = 0
      let needed_total_del_qty = 0

      var delivery_freight_array = [];
      deliveryFreightData.map((data2, index1) => {

        budfreight += data2.total_del_freight
        delivery_freight_array.push(data2.del_freight_per_ton)
      })
      setShipmentBudjetFreight(Number(parseFloat(budfreight).toFixed(2)))

      /* Get Total Delivery Quantity */
      rowData.map((data1, index) => {
        // needed_total_del_qty += data1.DeliveryQty
        needed_total_del_qty += data1.DeliveryNetQty
      })

      /* Get Highest Delivery Freight From deliveryFreightData*/
      // delivery_freight_array
      var largest= 0;

      for (let i=0; i<delivery_freight_array.length; i++){
          if (delivery_freight_array[i]>largest) {
              largest=delivery_freight_array[i];
          }
      }

      setLargestFreight(Number(parseFloat(largest).toFixed(2)))

      let actfreight = contractorFreight == '2' ? Number(parseFloat(largest*needed_total_del_qty).toFixed(2)) : Number(parseFloat(budfreight).toFixed(2))
      // let actfreight = largest*needed_total_del_qty
      setShipmentActualFreight(actfreight)

    } else {
      setShipmentActualFreight(0)
      setShipmentBudjetFreight(0)
      setLargestFreight(0)
    }
  },[deliveryFreightData, contractorId])

  function getQty(data) {
    console.log(del_qty)
    let qty = ''
    rowData.map((data1, index) => {
      if (data == data1.DeliveryOrderNumber) {
        // qty = data1.DeliveryQty
        qty = data1.DeliveryNetQty
      }
    })
    return qty
  }

  function getCustomerName(data) {
    console.log(del_qty)
    console.log(rowData,'getCustomerName')
    let name = ''
    rowData.map((data1, index) => {
      if (data == data1.DeliveryOrderNumber) {
        name = data1.CustomerName
      }
    })
    return name
  }

  function getCustomerLocation(data) {
    console.log(del_qty)
    let location = ''
    rowData.map((data1, index) => {
      if (data == data1.DeliveryOrderNumber) {
        location = data1.CustomerCity
      }
    })
    return location
  }

  const getDeliveryFreight = (data,type) => {
    let deliveryFreight = '0.00'

    let cust_code = ''
    console.log(rowData,'del_qty-del_qty')
    rowData.map((data1, index) => {
      if (data == data1.DeliveryOrderNumber) {
        console.log(data1,'data1-111111')
        cust_code = data1.CustomerCode
        depoCustomerData.map((data2, index1) => {
          if (cust_code == data2.customer_code) {
            depoFreightData.map((data3, index2) => { 
              if (data2.location_id == data3.location_id && data2.route_id == data3.route_id && contractorId == data3.contractor_id) {

                if(type == 1) {
                  let data_object = {}
                  data_object.del_number = data1.DeliveryOrderNumber
                  // data_object.del_qty = data1.DeliveryQty
                  data_object.del_qty = data1.DeliveryNetQty
                  data_object.customer_code = cust_code
                  data_object.route_id = data2.route_id
                  data_object.location_id = data2.location_id
                  data_object.contractor_id = contractorId
                  // data_object.total_del_freight =  Number(parseFloat(data1.DeliveryQty * Number(data3.freight_rate)).toFixed(3))
                  data_object.total_del_freight =  Number(parseFloat(data1.DeliveryNetQty * Number(data3.freight_rate)).toFixed(3))
                  data_object.del_freight_per_ton = Number(data3.freight_rate)

                  console.log(deliveryFreightData,'1deliveryFreightData-deliveryFreightData')
                  //if(deliveryFreightData.length == 0) {
                   if(deliveryFreightData.length == 0 && data2.location_info.location_code == data1.DeliveryPlant && data3.location_info.location_code == data1.DeliveryPlant) {  
                    setDeliveryFreightData(deliveryFreightData => [...deliveryFreightData, data_object]);
                  }

                  deliveryFreight = data3.freight_rate
                } else if(type == 2) {
                  // deliveryFreight = Number(parseFloat(data1.DeliveryQty * Number(data3.freight_rate)).toFixed(3))
                  deliveryFreight = Number(parseFloat(data1.DeliveryNetQty * Number(data3.freight_rate)).toFixed(3))
                }

              }
            })
          }
        })
      }
    })

    return deliveryFreight
  }

  const getDeliveryFreight1 = (data,type) => {
    let deliveryFreight = '0.00'

    let cust_code = '' 
    rowData.map((data1, index) => {
      if (data == data1.DeliveryOrderNumber) {

        cust_code = data1.CustomerCode
        depoCustomerData.map((data2, index1) => {
          if (cust_code == data2.customer_code) {
            depoFreightData.map((data3, index2) => {
              if (data2.location_id == data3.location_id && data2.route_id == data3.route_id && contractorId == data3.contractor_id) {

                if(type == 1) {
                  let data_object = {}
                  data_object.del_number = data1.DeliveryOrderNumber
                  // data_object.del_qty = data1.DeliveryQty
                  data_object.del_qty = data1.DeliveryNetQty
                  data_object.customer_code = cust_code
                  data_object.route_id = data2.route_id
                  data_object.location_id = data2.location_id
                  data_object.contractor_id = contractorId
                  // data_object.total_del_freight =  Number(parseFloat(data1.DeliveryQty * Number(data3.freight_rate)).toFixed(3))
                  data_object.total_del_freight =  Number(parseFloat(data1.DeliveryNetQty * Number(data3.freight_rate)).toFixed(3))
                  data_object.del_freight_per_ton = Number(data3.freight_rate)

                  deliveryFreight = data3.freight_rate
                } else if(type == 2) {
                  // deliveryFreight = Number(parseFloat(data1.DeliveryQty * Number(data3.freight_rate)).toFixed(3))
                  deliveryFreight = Number(parseFloat(data1.DeliveryNetQty * Number(data3.freight_rate)).toFixed(3))
                }

              }
            })
          }
        })
      }
    })

    return deliveryFreight
  }

  const getCustomerRoute = (data) => {

    let customerRoute = 'Customer Not Found in LP'
    let cust_code = ''
    let del_plant = ''
    if(depoCustomerData.length > 0) {
      rowData.map((data1, index) => {
        if (data == data1.DeliveryOrderNumber) {

          console.log(data1,'data1-filterData')
          cust_code = data1.CustomerCode
          del_plant = data1.DeliveryPlant
          /* Customer plant && Delivery Plant Filter*/
          let filterData = depoCustomerData.filter(
            (data) => data.customer_code == cust_code && data.location_info.location_code == del_plant
          )
          console.log(filterData,'filterData')
          if(filterData.length > 0) {
            customerRoute = filterData[0].location_info.location+' : '+filterData[0].route_info.route_name
          }

        }
      })
    }
    return customerRoute
  }

  const remarksHandleChange = (event,type) => {

    let result = event.target.value
    if(type == 1){
      let result1 = result.toUpperCase()
      setShipmentRemarks(result1.trimStart())
    } else if(type == 2){
      setShipmentDivision(result)
      setShipmentRoute(0)
    } else if(type == 3){
      setShipmentPgiStatus(result)
    } else if(type == 4){
      setShipmentTPP(result)
    } else if(type == 5){
      setUserName(result)
    } else if(type == 6){
      setShipmentRoute(result)
    }

  }

  const [tripsheetNumberNew, setTripsheetNumberNew] = useState('');
  const [shipmentNumberNew, setShipmentNumberNew] = useState('');
  const handleChangenewtrip = event => {
    let tripResult = event.target.value.toUpperCase();
    setTripsheetNumberNew(tripResult.trim());

  };
  const handleChangenewtrip1 = event => {
    let tripResult = event.target.value.toUpperCase();

    let value_change = tripResult.trim().replace(/[^0-9]+/g, '')
    setShipmentNumberNew(value_change);

  };

  // GET Tripsheet DETAILS FROM LP
  const gettripSheetData = (e) => {
    e.preventDefault()

    console.log(tripsheetNumberNew,'tripsheetNumberNew')
    if(/^[a-zA-Z0-9]+$/i.test(tripsheetNumberNew) && /[a-zA-Z]/.test(tripsheetNumberNew) && /[0-9]/.test(tripsheetNumberNew)){
      DepoTSCreationService.getTripsheetInfoByTripsheetNo(tripsheetNumberNew).then((res) => {
        setTripsheetHaving(true)
        setShipmentHaving(false)
        console.log(res,'getTripSettlementInfoByTripsheetNo')



        if (res.status == 200 && res.data != '') {

          let needed_data = res.data.data
          console.log(needed_data,'needed_data')

          if(getInt(needed_data.vehicle_current_position) > 26 && getInt(needed_data.vehicle_current_position) != 50){
            setShipmentPossibility(false)
            setShipmentError('Expense Closure already completed. So, Shipment Cannot be inserted..')
          } else if(getInt(needed_data.tripsheet_open_status) == 2){
            setShipmentPossibility(false)
            setShipmentError('Tripsheet already closed. So, Shipment Cannot be inserted..')
          } else {
            setShipmentPossibility(true)
            setShipmentError('')
          }
          setSmallFetch(true)
          setContractorId(needed_data.contractor_id)
          setContractorFreight(needed_data.contractor_info.freight_type)
          setTripHirePaymentData(needed_data)
          toast.success('Tripsheet Details Detected!')

        } else {
          setContractorId('')
          setContractorFreight('')
          setTripHirePaymentData([])
          setTripsheetHaving(false)
          setSmallFetch(true)
          if (res.status == 201 && (res.data.status == '1' ||res.data.status == '2' ||res.data.status == '3')) {
            toast.warning(res.data.message)
          } else {
            setSmallFetch(true)
            toast.warning('Tripsheet Details cannot be detected from LP!')
          }
        }
      })
    } else {
      setContractorId('')
      setContractorFreight('')
      setTripHirePaymentData([])
      setTripsheetHaving(false)
      setSmallFetch(true)
      setShipmentHaving(false)
      toast.warning('Tripsheet Number Must Like "AB123456789"')
      return false
    }

  }

  const loadSaleOrderInfoTable = () => {
    var del_order = []

    console.log(saleOrders,'saleOrders')

    // Converting the Delivery Details into Delivery Orders
    // =================================================================================================

    const obj = Object.entries(saleOrders)

    obj.forEach(([key_st, value]) => {
      let lineItem = value.LINE_ITEM

      del_order.push({
        sno: (key_st % 10) + 1,
        SaleOrderNumber: value.VBELN,
        SaleOrderDate: value.ERDAT,
        SaleOrderQty: value.SO_QTY,
        DeliveryOrderNumber: value.VBELN2,
        TL_NAME: value.TL_NAME,
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

      del_qty.push({
        sno: (key_st % 10) + 1,
        SaleOrderNumber: value.VBELN,
        SaleOrderDate: value.ERDAT,
        SaleOrderQty: value.SO_QTY,
        DeliveryOrderNumber: value.VBELN2,
        TL_NAME: value.TL_NAME,
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

    setRowData(del_order)
  }

  const [shipmentApproval, setShipmentApproval] = useState(true)

  useEffect(()=>{

    if((customerAndFreightInvalidData.ActualFreightCondition != customerAndFreightInvalidData.BudjetFreightCondition) && customerAndFreightInvalidData.FreightType == 2){
      setShipmentApproval(true)
    } else {
      setShipmentApproval(false)
    }

    console.log(customerAndFreightInvalidData,'customerAndFreightInvalidData')
    console.log(shipmentApproval,'shipmentApproval')

  },[customerAndFreightInvalidData])

  useEffect(() => {
    loadSaleOrderInfoTable()
  }, [fetch,saleOrders])

  // GET Shipment DETAILS FROM SAP
  const getShipmentData = (e) => {
    console.log(shipmentNumberNew,'shipmentNumberNew')
    let data = new FormData()
    data.append('TKNUM', shipmentNumberNew)
    // data.append('HSN_SAC', hsnCode)

    VehicleAssignmentSapService.getShipmentInfoForUpdation(data).then((res) => {

      console.log(res,'getShipmentInfoForUpdation')


      if (res.status == 200 && res.data != '' && res.data != '\n') {
        setSmallFetch(true)
        setShipmentHaving(true)
        setSaleOrders(res.data)
        toast.success('Shipment Details Detected!')
      } else {
        setSmallFetch(true)
        setShipmentHaving(false)
        setSaleOrders([])
        if (res.status == 201 && (res.data.status == '1' ||res.data.status == '2')) {
          toast.warning(res.data.message)
        } else {
          setSmallFetch(true)
          toast.warning('Tripsheet Details cannot be detected from LP!')
        }
      }
    })
  }

  useEffect(() => {
    /* section for getting Pages List from database For Setting Permission */
    DefinitionsListApi.visibleDefinitionsListByDefinition(8).then((response) => {
      console.log(response.data.data)
      setPageList(response.data.data)
      setFetch(true)
      setSmallFetch(true)
    })

     /* section for getting Foods Routes List Display from database */
     DefinitionsListApi.visibleDefinitionsListByDefinition(1).then((response) => {
      console.log(response.data.data,'setFoodsRouteData')
      setFoodsRouteData(response.data.data)
    })

    /* section for getting Consumer Routes List Display from database */
    DefinitionsListApi.visibleDefinitionsListByDefinition(17).then((response) => {
      console.log(response.data.data,'setConsumerRouteData')
      setConsumerRouteData(response.data.data)
    })

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
  }, [])

  const getInt = (val) => {
    return Number(parseFloat(val).toFixed(2))
  }

  const [incoTermData, setIncoTermData] = useState([])
  const [tppData, setTppData] = useState([])
  const [userData, setUserData] = useState([])
  const [currentDeliveryId, setCurrentDeliveryId] = useState('')

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

  /* section for getting Transport Planning Points Lists from database */
  UserLoginMasterService.getUser().then((response) => {
    let userData = response.data.data
    console.log(userData,'userData')
    let userDataList_location = []
    userData.map((data, index) => {
      userDataList_location.push({
        sno: index + 1,
        user_name: data.emp_name,
        user_emp_code:data.empid,
        user_id: data.user_id
      })
    })
    setUserData(userDataList_location)
  })

   DefinitionsListApi.visibleDefinitionsListByDefinition(19).then((response) => {

    let viewData = response.data.data

    let rowDataList_location = []
    viewData.map((data, index) => {
      rowDataList_location.push({
        sno: index + 1,
        tpp_name: data.definition_list_name,
        tpp_code: data.definition_list_code,
      })
    })

    setTppData(rowDataList_location)
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

 const [locationData, setLocationData] = useState([])
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
  // console.log(code)
  // console.log(locationData)
  let filtered_location_data = locationData.filter((c, index) => {
    if (c.location_code == code) {
      return true
    }
  })
  // console.log(filtered_location_data)
  let locationName = filtered_location_data[0] ? filtered_location_data[0].Location : 'Loading..'
  return locationName
}

/* Date Format Change : yyyy-mm-dd to dd-mm-yy */
const formatDate = (input='') => {
  let needed = '--'
  if(input != ''){
    var datePart = input.match(/\d+/g),
    year = datePart[0].substring(2), // get only two digits
    month = datePart[1],
    day = datePart[2]
    needed = day + '-' + month + '-' + year
  }

  return needed
}

  console.log(tripHirePaymentData,'tripHirePaymentData')

  /* Validation Process */
  const shipmentUpdateValidation = () => {

    /* ===================== Validations Part Start ===================== */

    // if(shipmentDivision == '0'){
    //   setFetch(true)
    //   toast.warning(`Please select shipment freight Type..`)
    //   return false
    // }

    if(shipmentTPP == '0'){
      setFetch(true)
      toast.warning(`Please select shipment transport planning point..`)
      return false
    }

    if(shipmentRoute == '0'){
      setFetch(true)
      toast.warning(`Please select shipment route..`)
      return false
    }

    if(userName == '0'){
      setFetch(true)
      toast.warning(`Please select shipment creation username..`)
      return false
    }

    if(shipmentRemarks == ''){
      setFetch(true)
      toast.warning(`Shipment Remarks should not be empty.`)
      return false
    }

    /* ===================== Validations Part End ===================== */

    setShipmentUpdate(true)
  }

  /* Submit Process */
  const TripsheetShipmentUpdate = () => {

    

    console.log('-------------------tripHirePaymentData---------------------------')
    console.log(tripHirePaymentData)
    console.log('-------------------Tripsheet No---------------------------')
    console.log(tripHirePaymentData.vehicle_tripsheet_info.depo_tripsheet_no)
    console.log('-------------------Vehicle No---------------------------')
    console.log(tripHirePaymentData.vehicle_info.vehicle_number)

    var shipment_details2 = []

    /* Create Shipment JSON String for DB Update */
    /*========(Start)================================================================================*/

    var shipment_details2 = []
    let cofdata = []
    /* Create Shipment JSON String for DB Update */
    /*========(Start)================================================================================*/

    
    console.log(customerAndFreightInvalidData,'customerAndFreightInvalidData')
    rowData.map((value_item, key_item) => {
      // if (value_item1 == value_item.DeliveryOrderNumber) {
      let cofdata1 = ''
      if(customerAndFreightInvalidData.DeliveryFreightValue && customerAndFreightInvalidData.DeliveryFreightValue.length > 0){
        cofdata1 = customerAndFreightInvalidData.DeliveryFreightValue.filter((data) => data.del_number == value_item.DeliveryOrderNumber)
      } else {

        if(customerAndFreightInvalidData && customerAndFreightInvalidData.length > 0){
            cofdata1 = customerAndFreightInvalidData.filter((data) => data.del_number == value_item.DeliveryOrderNumber)
        }

      }

      cofdata.push(cofdata1[0])
      // let cofdata = customerAndFreightInvalidData.DeliveryFreightValue.filter((data) => data.del_number == value_item.DeliveryOrderNumber)
      console.log(customerAndFreightInvalidData,'customerAndFreightInvalidData')
      console.log(cofdata1[0],'cofdata1[0]')
      value_item['delivery_sequence'] = key_item + 1
      value_item['delivery_depo_freight_amount'] = cofdata1[0] ? cofdata1[0].del_freight_per_ton : 0
      shipment_details2.push(value_item)
      // }
    })
    
    console.log(cofdata,'cofdata')
    // console.log(shipment_details1)
    console.log(shipment_details2)

    if (shipment_details2.length > 0) {
      let shipment_route = shipment_details2[shipment_details2.length - 1].CustomerRoute
      console.log(shipment_route)
      setShipmentLastRoute(shipment_route)
    } else {
      setShipmentLastRoute('')
    }

    setShipmentData(shipment_details2)
    let shipment_info = JSON.stringify(shipment_details2)
    console.log(shipment_info,'shipment_info')

    /* Get Total Shipment Quantity By Adding each Delivery Quantity */
    var totalShipmentQuantity = 0
    var totalShipmentNetQuantity = 0
    var totalShipmentQuantityRounded = 0
    var totalShipmentNetQuantityRounded = 0
    shipment_details2.map((val, key) => {
      totalShipmentQuantity = totalShipmentQuantity + val.DeliveryQty
      totalShipmentNetQuantity = totalShipmentNetQuantity + val.DeliveryNetQty
    })

    totalShipmentQuantityRounded = parseFloat(totalShipmentQuantity).toFixed(2)
    totalShipmentNetQuantityRounded = parseFloat(totalShipmentNetQuantity).toFixed(2)

    console.log(totalShipmentQuantityRounded,'totalShipmentQuantityRounded')
    console.log(totalShipmentNetQuantityRounded,'totalShipmentNetQuantityRounded')

    /*=========(End)=================================================================================*/

    const formData = new FormData() 

    formData.append('parking_id', tripHirePaymentData.depo_parking_yard_gate_id)
    formData.append('vehicle_id', tripHirePaymentData.vehicle_id)
    formData.append('driver_id', tripHirePaymentData.driver_id)
    formData.append('tripsheet_id', tripHirePaymentData.tripsheet_sheet_id)
    formData.append('shipment_depo_actual_freight_amount', customerAndFreightInvalidData.FinalFreightCondition)
    formData.append('shipment_depo_budget_freight_amount', customerAndFreightInvalidData.BudjetFreightCondition) 
    formData.append('remarks', shipmentRemarks == '' ? null : shipmentRemarks) 
    formData.append('created_by', userName)
    formData.append('freight_type', contractorFreight)
    formData.append('process', 1) /* 1-createShipment, 2-saveShipment  */
    formData.append('shipment_no', shipmentNumberNew)
    formData.append('transport_plant', shipmentTPP) 
    formData.append('shipment_info', shipment_info) 
    formData.append('initial_shipment_qty', totalShipmentQuantityRounded)
    formData.append('initial_shipment_net_qty', totalShipmentNetQuantityRounded) 
    formData.append('shipment_route', shipmentRoute)
    formData.append('shipment_last_route_id', shipmentLastRoute)

    if(shipmentPgiStatus == 1){
      formData.append('shipment_status', 3)
      formData.append('shipment_pgi_status', 1)
    }

    // return false
    setFetch(false)
 
    DepoShipmentCreationService.insertShipmentOrder(formData).then((res) => {
      console.log(res,'insertShipmentOrder')
      setFetch(true)
      if (res.status == 200) {
        Swal.fire({
          title: 'Shipment Manually Inserted Successfully!',
          icon: "success",
          text:  'Shipment No : ' + shipmentNumberNew,
          confirmButtonText: "OK",
        }).then(function () {
          window.location.reload(false)
        });
      } else if (res.status == 201) {
        Swal.fire({
          title: res.data.message,
          icon: "warning",
          confirmButtonText: "OK",
        }).then(function () {
          window.location.reload(false)
        })
      } else {
        toast.warning('Manual Shipment Insertion Failed. Kindly contact Admin..!')
      }
    })
    .catch((error) => {
      setFetch(true)
      console.log(error)
      var object = error.response.data.errors
      var output = ''
      for (var property in object) {
        output += '*' + object[property] + '\n'
      }
      setError(output)
      setErrorModal(true)
    })

  }

  return (
    <>
      {!fetch && <Loader />}
      {fetch && (
        <>
          {screenAccess ? (
            <>
              <CContainer className="mt-2">
                {!tripSheetHaving && (
                  <CRow>
                    <CCol xs={12} md={4}>
                      <div className="w-100 p-3">
                        <CFormLabel htmlFor="tripsheetNumberNew">
                          Enter Tripsheet Number
                          <REQ />{' '}

                        </CFormLabel>
                        <CInputGroup>
                          <CFormInput
                            size="sm"
                            name="tripsheetNumberNew"
                            id="tripsheetNumberNew"
                            maxLength={15}
                            autoComplete='off'
                            value={tripsheetNumberNew}
                            onChange={handleChangenewtrip}
                          />
                          <CInputGroupText className="p-0">
                            <CButton
                              size="sm"
                              color="primary"
                              onClick={(e) => {
                                // setFetch(false)
                                setSmallFetch(false)
                                gettripSheetData(e)
                              }}
                            >
                              <i className="fa fa-search px-1"></i>
                            </CButton>
                            <CButton
                              size="sm"
                              style={{ marginLeft:"3px" }}
                              color="primary"
                              onClick={() => {
                                window.location.reload(false)
                              }}
                            >
                              <i className="fa fa-refresh px-1"></i>
                            </CButton>
                          </CInputGroupText>
                        </CInputGroup>
                      </div>
                    </CCol>
                  </CRow>
                )}

                {!smallfetch && <SmallLoader />}

                {smallfetch && Object.keys(tripHirePaymentData).length != 0  && (
                  <>
                    <CCard style={{display: tripSheetHaving ? 'block' : 'none'}}  className="p-3">

                      <CRow>
                        <CCol xs={12} md={3}>
                          <CFormLabel htmlFor="vNum">Contractor Name</CFormLabel> 
                          <CFormInput
                            size="sm"
                            id="vNum"
                            value={
                              tripHirePaymentData.contractor_info ? tripHirePaymentData.contractor_info.contractor_name : ''
                            }
                            readOnly
                          />
                        </CCol>

                        <CCol xs={12} md={3}>
                          <CFormLabel htmlFor="vNum">Vehicle Number</CFormLabel> 
                          <CFormInput
                            size="sm"
                            id="vNum"
                            value={
                              tripHirePaymentData.vehicle_info ? tripHirePaymentData.vehicle_info.vehicle_number : ''
                            }
                            readOnly
                          />
                        </CCol>
                        <CCol xs={12} md={3}>
                          <CFormLabel htmlFor="vCap">Vehicle Capacity in MTS</CFormLabel>

                          <CFormInput
                            size="sm"
                            id="vCap"
                            value={
                              tripHirePaymentData.vehicle_info && tripHirePaymentData.vehicle_info.vehicle_capacity_info ? tripHirePaymentData.vehicle_info.vehicle_capacity_info.capacity : ''
                            }
                            readOnly
                          />
                        </CCol>
                        
                        <CCol xs={12} md={3}>
                          <CFormLabel htmlFor="dName">Driver Name</CFormLabel>  

                          <CFormInput 
                            size="sm" 
                            id="dName" 
                            value={
                              tripHirePaymentData.driver_info  ? tripHirePaymentData.driver_info.driver_name : '-'
                            } 
                            readOnly 
                          />
                        </CCol>
                        <CCol xs={12} md={3}>
                          <CFormLabel htmlFor="dMob">Driver Cell Number</CFormLabel>

                          <CFormInput
                            size="sm"
                            id="dMob"
                            value={
                              tripHirePaymentData.driver_info ? tripHirePaymentData.driver_info.driver_number : '-'
                            }
                            readOnly
                          />
                        </CCol>
                        <CCol xs={12} md={3}>
                          <CFormLabel htmlFor="tNum">Tripsheet Number</CFormLabel>
                          <CFormInput
                            size="sm"
                            id="tNum"
                            value={
                              tripHirePaymentData.vehicle_tripsheet_info  ? tripHirePaymentData.vehicle_tripsheet_info.depo_tripsheet_no : ''
                            }
                            readOnly
                          />
                        </CCol>
                         
                        <CCol xs={12} md={3}>
                          <CFormLabel htmlFor="inspectionDateTime">
                            Tripsheet Creation Date & Time
                          </CFormLabel>

                          <CFormInput
                            size="sm"
                            id="TSCreationDateTime"
                            value={
                              tripHirePaymentData.vehicle_tripsheet_info  ? tripHirePaymentData.vehicle_tripsheet_info.ts_creation_time_string	 : '---' 
                            }
                            readOnly
                          />
                        </CCol>

                      </CRow>
                      {!shipmentHaving && (
                        <CRow className="mt-3">
                          <CCol>
                            <CButton
                              size="sm"
                              style={{ marginLeft:"3px" }}
                              color="primary"
                              onClick={() => {
                                window.location.reload(false)
                              }}
                            >
                              Back
                            </CButton>
                            {shipmentError != '' && (
                              <span style={{ marginLeft:"10px" }} className="medium text-danger">* {shipmentError}</span>
                            )}
                          </CCol>

                        </CRow>
                      )}
                      {shipmentHaving && shipmentPossibility && (
                        <>
                          <CRow className="mt-2" hidden>
                            <CCol xs={12} md={3}>
                              <CFormLabel
                                htmlFor="inputAddress"
                                style={{
                                  backgroundColor: '#4d3227',
                                  color: 'white',
                                }}
                              >
                                Delivery Information
                              </CFormLabel>
                            </CCol>
                          </CRow>
                          <CRow>
                            <CTable style={{ height: '40vh', width: 'auto' }} className="overflow-scroll">
                              <CTableHead style={{ backgroundColor: '#4d3227', color: 'white' }}>
                                <CTableRow style={{ width: '100%' }}>

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
                                    QTY in MTS
                                  </CTableHeaderCell>

                                  <CTableHeaderCell
                                    scope="col"
                                    style={{ color: 'white', width: '8%', textAlign: 'center' }}
                                  >
                                    Action
                                  </CTableHeaderCell>
                                </CTableRow>
                              </CTableHead>
                              <CTableBody>
                                {/* { saleOrders && { */}
                                {/* {fetch && */}
                                {rowData.map((data, index) => { 
                                  return (
                                    <>
                                      <CTableRow>
                                        <CTableDataCell
                                          style={{ width: '5%', textAlign: 'center' }}
                                          scope="row"
                                        >
                                          {data.sno}
                                        </CTableDataCell>
                                        <CTableDataCell
                                          style={{ width: '9%', textAlign: 'center' }}
                                          scope="row"
                                        >
                                          {getIncoTermNameByCode(data.IncoTerm)}
                                        </CTableDataCell>
                                        <CTableDataCell
                                          style={{ width: '9%', textAlign: 'center' }}
                                          scope="row"
                                        >
                                          {getLocationNameByCode(data.DeliveryPlant)}
                                        </CTableDataCell>
                                        <CTableDataCell
                                          style={{ width: '9%', textAlign: 'center' }}
                                          scope="row"
                                        >
                                          {data.DeliveryOrderNumber}
                                        </CTableDataCell>
                                        <CTableDataCell
                                          style={{ width: '9%', textAlign: 'center' }}
                                          scope="row"
                                        >
                                          {formatDate(data.DeliveryOrderDate)}{' '}
                                        </CTableDataCell>
                                        <CTableDataCell
                                          style={{ width: '9%', textAlign: 'center' }}
                                          scope="row"
                                        >
                                          {data.SaleOrderNumber}
                                        </CTableDataCell>
                                        <CTableDataCell
                                          style={{ width: '9%', textAlign: 'center' }}
                                          scope="row"
                                        >
                                          {formatDate(data.SaleOrderDate)}{' '}
                                        </CTableDataCell>
                                        <CTableDataCell
                                          style={{ width: '15%', textAlign: 'center' }}
                                          scope="row"
                                        >
                                          {data.CustomerName}
                                        </CTableDataCell>
                                        <CTableDataCell
                                          style={{ width: '8%', textAlign: 'center' }}
                                          scope="row"
                                        >
                                          {data.CustomerCity}
                                        </CTableDataCell>
                                        <CTableDataCell
                                          style={{ width: '9%', textAlign: 'center' }}
                                          scope="row"
                                        >
                                          {data.CustomerRoute}
                                        </CTableDataCell>
                                        <CTableDataCell
                                          style={{ width: '5%', textAlign: 'center' }}
                                          scope="row"
                                        >
                                          {data.DeliveryQty}
                                          {/* {data.DeliveryNetQty} */}
                                        </CTableDataCell>

                                        <CTableDataCell
                                          style={{ width: '8%', textAlign: 'center' }}
                                          scope="row"
                                        >
                                          <CButton
                                            onClick={() => {
                                              setVisible(!visible)
                                              setCurrentDeliveryId(data.DeliveryOrderNumber)
                                            }}
                                            className="text-white"
                                            color="warning"
                                            size="sm"
                                          >
                                            <span className="float-start">
                                              <i className="fa fa-eye" aria-hidden="true"></i> &nbsp;View
                                            </span>
                                          </CButton>

                                          {/* ======================= Delivery Info Modal Area ========================== */}
                                          <CModal
                                            size="xl"
                                            visible={visible}
                                            backdrop="static"
                                            scrollable
                                            onClose={() => setVisible(false)}
                                          >
                                            <CModalHeader>
                                              <CModalTitle>Delivery Order Details</CModalTitle>
                                            </CModalHeader>

                                            <CModalBody>
                                              <DeliveryOrderInfo
                                                all_delivery_data={rowData}
                                                delivery_id={currentDeliveryId}
                                              />
                                            </CModalBody>
                                            <CModalFooter>
                                              <CButton color="secondary" onClick={() => setVisible(false)}>
                                                Close
                                              </CButton>
                                            </CModalFooter>
                                          </CModal>
                                          {/* *********************************************************** */}
                                        </CTableDataCell>
                                      </CTableRow>
                                    </>
                                  )
                                })}
                              </CTableBody>
                            </CTable>
                          </CRow>
                          <CContainer>
                            <u>
                              <CHeaderBrand style={{ color: '#4d3227', fontWeight: '600' }}>
                                Delivery Freight Details
                              </CHeaderBrand>
                            </u>
                            <CRow className="mt-3 mb-3">
                              <CCol>
                                <CTable
                                  style={{ height: 'auto' }}
                                  // className="overflow-scroll"
                                >
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
                                        Number
                                      </CTableHeaderCell>

                                      <CTableHeaderCell scope="col" style={{ color: 'white', width: '21%' }}>
                                        Customer Name
                                      </CTableHeaderCell>
                                      {/* <CTableHeaderCell scope="col" style={{ color: 'white', width: '15%' }}>
                                        Customer City
                                      </CTableHeaderCell> */}
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

                                    {rowData.map((data, index) => { 
                                      return (
                                        <>
                                          <CTableRow key={index}  style={{ background: '#ebc999' }}>
                                            <CTableDataCell style={{ width: '5%' }}>{index + 1}</CTableDataCell>
                                            <CTableDataCell style={{ width: '8%' }}>{data.DeliveryOrderNumber}</CTableDataCell> 
                                            <CTableDataCell style={{ width: '21%' }}>
                                              {getCustomerName(data.DeliveryOrderNumber)}
                                            </CTableDataCell>
                                             
                                            <CTableDataCell style={{ width: '20%' }}>
                                              {getCustomerRoute(data.DeliveryOrderNumber)}
                                            </CTableDataCell>
                                            <CTableDataCell style={{ width: '8%' }}>{getQty(data.DeliveryOrderNumber)}</CTableDataCell>
                                            <CTableDataCell style={{ width: '13%' }}>
                                              {getDeliveryFreight(data.DeliveryOrderNumber,'1')}
                                            </CTableDataCell>
                                            <CTableDataCell style={{ width: '13%' }}>
                                            {contractorFreight == '2' ? largestFreight : getDeliveryFreight1(data.DeliveryOrderNumber,'1')}
                                            </CTableDataCell>
                                            <CTableDataCell style={{ width: '13%' }}>
                                              {getDeliveryFreight(data.DeliveryOrderNumber,'2')}
                                            </CTableDataCell>
                                            <CTableDataCell style={{ width: '13%' }}>
                                            {contractorFreight == '2' ? Number(parseFloat(getQty(data.DeliveryOrderNumber)*largestFreight).toFixed(2)) : getDeliveryFreight(data.DeliveryOrderNumber,'2') }
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
                                       
                                      <CTableDataCell style={{ width: '8%' }}><b>{total_del_qty_rounded_value}</b></CTableDataCell>
                                      <CTableDataCell style={{ width: '13%' }}>
                                        <b>-</b>
                                      </CTableDataCell>
                                      <CTableDataCell style={{ width: '13%' }}>
                                        <b>-</b>
                                      </CTableDataCell>
                                      <CTableDataCell style={{ width: '13%' }}>
                                        <b>{shipmentBudjetFreight}</b>
                                      </CTableDataCell>
                                       
                                      <CTableDataCell
                                        style={contractorFreight == '2' && shipmentApproval ? { width: '13%', color:'red', fontWeight:'bolder' } : { width: '13%' }}
                                      >
                                        <b>{contractorFreight == '2' ? Number(parseFloat(total_del_qty_rounded_value*largestFreight).toFixed(2)) : shipmentBudjetFreight} </b>
                                      </CTableDataCell>

                                    </CTableRow>

                                  </CTableBody>
                                </CTable>
                              </CCol>
                            </CRow>
                          </CContainer>
                          <CRow>
                            <CCol xs={12} md={3}>
                              <CFormLabel htmlFor="tNum">Shipment Number</CFormLabel>
                              <CFormInput
                                size="sm"
                                id="tNum"
                                value={shipmentNumberNew}
                                readOnly
                              />
                            </CCol>
                            {/* <CCol xs={12} md={3}>
                              <CFormLabel htmlFor="shipment_division">
                                Freight Type <REQ />{' '}
                              </CFormLabel>
                              <CFormSelect
                                size="sm"
                                name="shipment_division"
                                onChange={(e) => {remarksHandleChange(e,'2')}}
                                value={shipmentDivision}
                                id="shipment_division"
                              >
                                <option value="0">Select ...</option>
                                <option value="1">Budget</option>
                                <option value="2">Actual</option>
                              </CFormSelect>
                            </CCol> */}
                             
                            <CCol xs={12} md={3}>
                              <CFormLabel htmlFor="shipment_pgi_status">
                                PGI Completion
                              </CFormLabel>
                              <CFormSelect
                                size="sm"
                                name="shipment_pgi_status"
                                onChange={(e) => {remarksHandleChange(e,'3')}}
                                value={shipmentPgiStatus}
                                id="shipment_pgi_status"
                              >
                                <option value="0" selected>Not Completed</option>
                                <option value="1">Completed</option>
                              </CFormSelect>
                            </CCol>
                            <CCol xs={12} md={3}>
                              <CFormLabel htmlFor="tpp_list">
                                Transport Planning Point <REQ />{' '}
                              </CFormLabel>
                              <CFormSelect
                                size="sm"
                                name="tpp_list"
                                onChange={(e) => {remarksHandleChange(e,'4')}}
                                value={shipmentTPP}
                                id="tpp_list"
                              >
                                <option value="0">Select ...</option>
                                {tppData.map((val,ind) => {
                                  return (
                                    <>
                                      <option key={ind} value={val.tpp_code}>
                                        {`${val.tpp_name} - ${val.tpp_code}`}
                                      </option>
                                    </>
                                  )
                                })}
                              </CFormSelect>
                            </CCol>
                             
                            <CCol xs={12} md={3}>
                              <CFormLabel htmlFor="shipment_route_nlfd">
                              Shipment Route <REQ />{' '}
                              </CFormLabel>
                              <CFormSelect
                                size="sm"
                                name="shipment_route_nlfd"
                                onChange={(e) => {remarksHandleChange(e,'6')}}
                                value={shipmentRoute}
                                id="shipment_route_nlfd"
                              >
                                <option value="0">Select ...</option>
                                {foodsRouteData.map((val,ind) => {
                                  return (
                                    <>
                                      <option key={ind} value={val.definition_list_code}>
                                        {`${val.definition_list_name} (${val.definition_list_code})`}
                                      </option>
                                    </>
                                  )
                                })}
                              </CFormSelect>
                            </CCol>
                             
                            <CCol xs={12} md={3}>
                              <CFormLabel htmlFor="user_list">
                                Created By <REQ />{' '}
                              </CFormLabel>
                              <CFormSelect
                                size="sm"
                                name="user_list"
                                onChange={(e) => {remarksHandleChange(e,'5')}}
                                value={userName}
                                id="user_list"
                              >
                                <option value="0">Select ...</option>
                                {userData.map((val,ind) => {
                                  return (
                                    <>
                                      <option key={ind} value={val.user_id}>
                                        {`${val.user_name} (${val.user_emp_code})`}
                                      </option>
                                    </>
                                  )
                                })}
                              </CFormSelect>
                            </CCol>
                            <CCol xs={12} md={3}>
                              <CFormLabel htmlFor="shipment_remarks">Remarks</CFormLabel>
                              <CFormTextarea
                                name="shipment_remarks"
                                id="shipment_remarks"
                                rows="1"
                                onChange={(e) => {remarksHandleChange(e,'1')}}
                                value={shipmentRemarks}
                              ></CFormTextarea>
                            </CCol>
                          </CRow>
                          <CRow className="mt-3">
                            <CCol className="" xs={12} sm={9} md={3}>
                              <CButton
                                size="sm"
                                style={{ marginLeft:"3px" }}
                                color="primary"
                                onClick={() => {
                                  window.location.reload(false)
                                }}
                              >
                                Back
                              </CButton>
                            </CCol>

                            <CCol
                              className="offset-md-6"
                              xs={12}
                              sm={9}
                              md={3}
                              style={{ display: 'flex', justifyContent: 'end' }}
                            >
                              <CButton
                                size="sm"
                                color="warning"
                                className="mx-3 px-3 text-white"
                                onClick={() => {
                                  shipmentUpdateValidation()
                                }}
                              >
                                Submit
                              </CButton>
                            </CCol>
                          </CRow>
                        </>
                      )}

                      {/* ============== Settlement Submit Confirm Button Modal Area Start ================= */}
                      <CModal
                        visible={shipmentUpdate}
                        backdrop="static"
                        // scrollable
                        onClose={() => {
                          setShipmentUpdate(false)
                        }}
                      >
                        <CModalBody>
                          <p className="lead">Are you sure to Update the Shipment Details to LP ?</p>
                        </CModalBody>
                        <CModalFooter>
                          <CButton
                            className="m-2"
                            color="warning"
                            onClick={() => {
                              setShipmentUpdate(false)
                              TripsheetShipmentUpdate()
                            }}
                          >
                            Yes
                          </CButton>
                          <CButton
                            color="secondary"
                            onClick={() => {
                              setShipmentUpdate(false)
                            }}
                          >
                            No
                          </CButton>
                        </CModalFooter>
                      </CModal>
                      {/* ============== Settlement Submit Confirm Button Modal Area End ================= */}
                      {/* Error Modal Section Start */}
                        <CModal visible={errorModal} onClose={() => setErrorModal(false)}>
                          <CModalHeader>
                            <CModalTitle className="h4">Error</CModalTitle>
                          </CModalHeader>
                          <CModalBody>
                            <CRow>
                              <CCol>
                                {error && (
                                  <CAlert color="danger" data-aos="fade-down">
                                    {error}
                                  </CAlert>
                                )}
                              </CCol>
                            </CRow>
                          </CModalBody>
                          <CModalFooter>
                            <CButton onClick={() => setErrorModal(false)} color="primary">
                              Close
                            </CButton>
                          </CModalFooter>
                        </CModal>
                      {/* Error Modal Section End */}
                    </CCard>
                    {shipmentPossibility && (
                      <CCard style={{display: tripSheetHaving ? 'block' : 'none'}}  className="p-3">
                        {tripSheetHaving && !shipmentHaving && (
                          <CRow>
                            <CCol xs={12} md={4}>
                              <div className="w-100 p-3">
                                <CFormLabel htmlFor="shipmentNumberNew">
                                  Enter Shipment Number
                                  <REQ />{' '}

                                </CFormLabel>
                                <CInputGroup>
                                  <CFormInput
                                    size="sm"
                                    name="shipmentNumberNew"
                                    id="shipmentNumberNew"
                                    maxLength={10}
                                    autoComplete='off'
                                    value={shipmentNumberNew}
                                    onChange={handleChangenewtrip1}
                                  />
                                  <CInputGroupText className="p-0">
                                    <CButton
                                      size="sm"
                                      color="primary"
                                      onClick={(e) => {
                                        // setFetch(false)
                                        setSmallFetch(false)
                                        getShipmentData(e)
                                      }}
                                    >
                                      <i className="fa fa-search px-1"></i>
                                    </CButton>

                                  </CInputGroupText>
                                </CInputGroup>
                              </div>
                            </CCol>
                          </CRow>
                        )}
                      </CCard>
                    )}
                  </>
                )}

              </CContainer>
            </> ) : (<AccessDeniedComponent />)
          }
        </>
      )}
    </>
  )
}

export default DepoShipmentUpdation

