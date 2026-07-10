/* eslint-disable prettier/prettier */
import {
  CButton,
  CCard,
  // CCol,
  CContainer,
  CForm,
  CFormInput,
  CFormLabel,
  CTableCaption,
  CFormSelect,
  CNav,
  CNavItem,
  CNavLink,
  CRow,
  CTabContent,
  CModal,
  CModalHeader,
  CModalTitle,
  CTabPane,
  CModalBody,
  CModalFooter,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CFormFloating,
  CNavbar,
  CTableRow,
  CFormTextarea,
  CCardImage,
  CAccordion,
  CAccordionItem,
  CAccordionHeader,
  CAccordionBody,
  CInputGroup,
  CInputGroupText,
  CAlert,
  CCol,
} from '@coreui/react'
import { React, useState, useEffect } from 'react'
// import CModal from '@coreui/react/src/components/modal/CModal'
import useForm from 'src/Hooks/useForm'
import validate from 'src/Utils/Validation'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import Loader from 'src/components/Loader'
import DefinitionsListApi from 'src/Service/Definitions/DefinitionsListApi'
import VehicleAssignmentSapService from 'src/Service/SAP/VehicleAssignmentSapService'
// import VehicleAssignmentService from 'src/Service/VehicleAssignment/VehicleAssignmentService'
import DeliveryOrderInfo from 'src/Pages/ShipmentCreation/Segments/DeliveryOrderInfo'
import LocationApi from 'src/Service/SubMaster/LocationApi'
import CustomTable from 'src/components/customComponent/CustomTable'
import AccessDeniedComponent from 'src/components/commoncomponent/AccessDeniedComponent'
import JavascriptInArrayComponent from 'src/components/commoncomponent/JavascriptInArrayComponent'
import * as LogisticsProScreenNumberConstants from 'src/components/constants/LogisticsProScreenNumberConstants'
// import DepoAssignTruckInfo from 'src/Pages/ShipmentCreation/Segments/DepoAssignTruckInfo'
import DepoShipmentCreationService from 'src/Service/Depo/Shipment/DepoShipmentCreationService'
import DepoAssignTruckInfo from './Segments/DepoAssignTruckInfo'
import Swal from 'sweetalert2'

const DepoVehicleAssignment = () => {
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

  /* ===== User Inco Terms Declaration Start ===== */

  /* ==================== Access Part Start ========================*/
  const [screenAccess, setScreenAccess] = useState(false)
  let page_no = LogisticsProScreenNumberConstants.DepoModuleScreens.Depo_Vehicle_Assignment

  useEffect(()=>{

    if(user_info.is_admin == 1 || JavascriptInArrayComponent(page_no,user_info.page_permissions)){
      console.log('screen-access-allowed')
      setScreenAccess(true)
    } else{
      console.log('screen-access-not-allowed')
      setScreenAccess(false)
    }

  },[])
  /* ==================== Access Part End ========================*/

  const user_inco_terms = []
  /* Get User Inco Terms From Local Storage */
  user_info.inco_term_info.map((data, index) => {
    user_inco_terms.push(data.def_list_code)
  })
  const [incoTermData, setIncoTermData] = useState([])
  const [weighmentDepoData, setWeighmentDepoData] = useState([]) 

  useEffect(() => {

     /* section for getting Inco Term Lists from database */
     DefinitionsListApi.visibleDefinitionsListByDefinition(16).then((response) => {

      let viewData = response.data.data
      console.log(viewData, 'viewData - Inco Term Lists')
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

    /* section for getting Weighment Depo Lists from database */
     DefinitionsListApi.visibleDefinitionsListByDefinition(37).then((response) => {

      let viewData = response.data.data
      console.log(viewData, 'viewData - Weighment Depo Lists')
      let rowDataList_location = []
      viewData.map((data, index) => {
        if(data.definition_list_status == 1)
          {
            rowDataList_location.push({
              sno: index + 1,
              depo_name: data.definition_list_name,
              depo_code: data.definition_list_code,
              depo_status: data.definition_list_status,
            
            })
          }
      })

      setWeighmentDepoData(rowDataList_location)
    })

  }, [])

  const DepoVehicleTypeFinder = () => {
    let vt = 'DEPO' 
    console.log(weighmentDepoData,'weighmentDepoData')
    console.log(values.vehicle_location_id,'weighmentDepoData-vehicle_location_id')
    weighmentDepoData.map((data, index) => {
      if(data.depo_code == values.vehicle_location_id)
      {
        vt = 'APK_DEPO'
      }
    })
    return vt
  }

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


  /* Get User Plant Access From Local Storage */
  user_info.location_info.map((data1, index1) => {
    user_access_locations.push(data1.location_code)
  })

  /* Get User Id From Local Storage */
  const user_id = user_info.user_id

  console.log(user_locations, 'user_locations')
  console.log(user_access_locations, 'user_access_locations')
  /*================== User Location Fetch ======================*/

  const [rowData, setRowData] = useState([])
  const [shipmentRowData, setShipmentRowData] = useState([])
  const [waitingShipmentRowData, setWaitingShipmentRowData] = useState([])
  const [creatingShipmentRowData, setCreatingShipmentRowData] = useState([])
  const [shipmentWaitingDeliveriesData, setShipmentWaitingDeliveriesData] = useState([])
  const [locationData, setLocationData] = useState([])

  const [mainKey, setMainKey] = useState(1)

  const [activeKey, setActiveKey] = useState(1)
  const [truckinfo, setTruckinfo] = useState(1)
  const [activeKey_2, setActiveKey_2] = useState(1)

  const [visible, setVisible] = useState(false)
  const [saleOrders, setSaleOrders] = useState([])

  const [fetch, setFetch] = useState(false)
  const [truckHavingTS, setTruckHavingTS] = useState(true)
  const [visible1, setVisible1] = useState(false)

  /* Modal Condition to Enable for Shipment Delete */
  const [shipmentDelete, setShipmentDelete] = useState(false)

  /* Modal Condition to Enable for Shipment Cancel */
  const [shipmentTripCancel, setShipmentTripCancel] = useState(false)

  /* Get Shipment No to Delete */
  const [shipmentToDelete, setShipmentToDelete] = useState('')

  /* Get Deleted Shipment Info */
  const [deletedShipmentInfo, setDeletedShipmentInfo] = useState([])

  /* Get Shipment-Tripsheet No to Delete */
  const [shipmentTSToDelete, setShipmentTSToDelete] = useState('')

  const [ChildVnum, setChildVnum] = useState('')
  const [ChildVroute, setChildVroute] = useState('')
  const [frcsValid, setFrcsValid] = useState(false)
  const [errorModal, setErrorModal] = useState(false)
  const [shipmentApproval, setShipmentApproval] = useState(true)
  const [shipmentData, setShipmentData] = useState([])
  const [customerAndFreightInvalidData, setCustomerAndFreightInvalidData] = useState([])
  const [shipmentRoute, setShipmentRoute] = useState('')
  const [ShipmentCreatedData, setShipmentCreatedData] = useState([])
  const [error, setError] = useState({})

  /* Getting Vehicle Number From Child Component */
  const getvnum = (data_need) => {
    setChildVnum(data_need)
  }

  /* Getting Vehicle Route From Child Component */
  const getvroute = (data_need) => {
    setChildVroute(data_need)
  }

  /* Getting Customer And Freight Invalid Data From Child Component */
  const getCustomerAndFreightInvalidData = (data_need) => {
    console.log(data_need,'getCustomerAndFreightInvalidData')

    if(data_need && data_need.ActualFreightCondition != 0 && data_need.BudjetFreightCondition != 0 && data_need.CustomerMasterCondition ) {
    // if(data_need.CustomerMasterCondition ) {
      setFrcsValid(true)
    } else {
      setFrcsValid(false)
    }
    setCustomerAndFreightInvalidData(data_need)
  }

  const [deliveryinfo, setDeliveryInfo] = useState({
    delivery_orders: [],
    response: [],
  })

  useEffect(()=>{

    if((customerAndFreightInvalidData.ActualFreightCondition != customerAndFreightInvalidData.BudjetFreightCondition) && customerAndFreightInvalidData.FreightType == 2){
      setShipmentApproval(true)
    } else {
      setShipmentApproval(false)
    }

    console.log(customerAndFreightInvalidData,'customerAndFreightInvalidData')
    console.log(shipmentApproval,'shipmentApproval')

},[customerAndFreightInvalidData])

  const formValues = {
    parking_id: '',
    vehicle_id: '',
    driver_id: '',
    tripsheet_id: '',
    tripsheet_no: '',
    assigned_by: '',
    // shipment_no: '',
    shipment_route: '',
    // shipment_status: '',
    vehicle_number: '',
    vehicle_type_id: '',
    vehicle_location_id: '',
    vehicle_capacity_id: '',
    driver_name: '',
    driver_number: '',
    shipment_info: '',
    remarks: '',
  }

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
    }

    // Case 2 : The user unchecks the box
    else {
      setDeliveryInfo({
        delivery_orders: delivery_orders.filter((e) => e !== value),
        response: delivery_orders.filter((e) => e !== value),
      })
    }
    console.log(deliveryinfo.response)
  }
  const [currentDeliveryId, setCurrentDeliveryId] = useState('')

  const columns = [
    {
      name: 'S.No',
      selector: (row) => row.sno,
      sortable: true,
      center: true,
    },
    {
      name: 'Vehicle Number',
      selector: (row) => row.Vehicle_No,
      sortable: true,
      center: true,
    },
    {
      name: 'Tripsheet Number',
      selector: (row) => row.Tripsheet_No,
      sortable: true,
      center: true,
    },
    {
      name: 'Tripsheet Date',
      selector: (row) => row.Tripsheet_Date,
      sortable: true,
      center: true,
    },
    {
      name: 'Shipment Number',
      selector: (row) => row.Shipment_No,
      sortable: true,
      center: true,
    },
    {
      name: 'Shipment Date',
      selector: (row) => row.Created_At,
      sortable: true,
      center: true,
    },
    {
      name: 'Created By',
      selector: (row) => row.Shipment_User,
      sortable: true,
      center: true,
    },
    {
      name: 'PGI Status',
      selector: (row) => row.PGI_Status,
      sortable: true,
      center: true,
    },
    {
      name: 'Action',
      selector: (row) => row.Action,
      center: true,
    },
  ]

  const waiting_columns = [
    {
      name: 'S.No',
      selector: (row) => row.sno,
      sortable: true,
      center: true,
    },
    {
      name: 'Vehicle Number',
      selector: (row) => row.Vehicle_No,
      sortable: true,
      center: true,
    },
    {
      name: 'Tripsheet Number',
      selector: (row) => row.Tripsheet_No,
      sortable: true,
      center: true,
    },
    {
      name: 'Shipment Number',
      selector: (row) => row.Shipment_No,
      sortable: true,
      center: true,
    },
    {
      name: 'Created By',
      selector: (row) => row.Shipment_User,
      sortable: true,
      center: true,
    },
    {
      name: 'Created On',
      selector: (row) => row.Created_At,
      sortable: true,
      center: true,
    },
    {
      name: 'View',
      selector: (row) => row.View,
      // sortable: true,
      center: true,
    },
    {
      name: 'Status',
      selector: (row) => row.Status,
      center: true,
    },
    // {
    //   name: 'Manager Action',
    //   selector: (row) => row.Action,
    //   center: true,
    // },
    // {
    //   name: 'User Action',
    //   selector: (row) => row.Action,
    //   center: true,
    // },
  ]

  const [assignTruckErrorModal, setAssignTruckErrorModal] = useState(false)
  const [assignTruckModal, setAssignTruckModal] = useState(false)
  const { values, errors, handleChange, onFocus, handleSubmit, enableSubmit, onBlur } = useForm(
    login,
    validate,
    formValues
  )

  function login() {
    alert('No Errors CallBack Called')
  }

  function checkModalDisplay(type=0) {
    console.log(rowData)
    console.log(deliveryinfo)
    var del_orders_array = deliveryinfo.delivery_orders
    console.log(del_orders_array)
    var shipment_details1 = []
    var shipment_details2 = []
    let cofdata = []
    /* Create Shipment JSON String for DB Update */
    /*========(Start)================================================================================*/

    del_orders_array.map((value_item1, key_item1) => {
      console.log(value_item1)
      console.log(customerAndFreightInvalidData,'customerAndFreightInvalidData')
      rowData.map((value_item, key_item) => {
        if (value_item1 == value_item.DeliveryOrderNumber) {
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
          value_item['delivery_sequence'] = key_item1 + 1
          value_item['delivery_depo_freight_amount'] = cofdata1[0] ? cofdata1[0].del_freight_per_ton : 0
          shipment_details2.push(value_item)
        }
      })
    })

    console.log(cofdata,'cofdata')

    // console.log(shipment_details1)
    console.log(shipment_details2)
    if (shipment_details2.length > 0) {
      let shipment_route = shipment_details2[shipment_details2.length - 1].CustomerRoute
      console.log(shipment_route)
      setShipmentRoute(shipment_route)
    } else {
      setShipmentRoute('')
    }
    setShipmentData(shipment_details2)
    values.shipment_info = JSON.stringify(shipment_details2)

    /*=========(End)=================================================================================*/

    if(type==0){
      if (Object.keys(deliveryinfo.response).length > 0) {
        setAssignTruckModal(true)
        // setAssignTruckErrorModal(false)
      } else {
        toast.warning('Please Choose Atleast One Delivery Order for Shipment Creation !')
        setAssignTruckModal(false)
        // setAssignTruckErrorModal(true)
      }
    }
  }

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

  /* Shipment Delete / Cancel Process */
  const deleteShipment = (type) => {
    // alert(shipmentToDelete + shipmentTSToDelete)
    const formDataForSAPShipmentDelete = new FormData()
    formDataForSAPShipmentDelete.append('shipment_no', shipmentToDelete)
    formDataForSAPShipmentDelete.append('trip_sheet', shipmentTSToDelete)
    VehicleAssignmentSapService.deleteShipment(formDataForSAPShipmentDelete)
      .then((res) => {
        let sap_shipment_no = res.data.SHIPMENT_NO
        let sap_shipment_status = res.data.STATUS
        let sap_ts_shipment = res.data.TRIP_SHEET

        console.log(sap_shipment_no + '/' + sap_shipment_status + '/' + sap_ts_shipment)

        if (sap_shipment_status == '1' && res.status == 200 && sap_shipment_no && sap_ts_shipment) {

          if(type == 1) {
            let formDataForDBUpdate  = new FormData()
            formDataForDBUpdate.append('_method', 'DELETE')
            formDataForDBUpdate.append('updated_by', user_id)
            DepoShipmentCreationService.deleteShipmentOrder(shipmentToDelete,formDataForDBUpdate)
            .then((res) => {
              setFetch(true)
              if (res.status == 204) {
                // toast.success('Shipment Deleted Successfully!')
                // navigation('/Dashboard')
                Swal.fire({
                  title: "Shipment Deleted Successfully!",
                  icon: "success",
                  confirmButtonText: "OK",
                }).then(function () {
                  // Redirect to Dashboard Home Page
                  navigation('/Dashboard')
                });
              } else {
                toast.warning('Shipment Cannot Be Deleted From LP.. Kindly Contact Admin!')
                setFetch(true)
                setTimeout(() => {
                  window.location.reload(false)
                }, 1000)
              }
            })
            .catch((error) => {
              setFetch(true)
              for (let value of formDataForSAPShipmentDelete.values()) {
                console.log(value)
              }
              console.log(error)
              var object = error.response.data.errors
              var output = ''
              for (var property in object) {
                output += '*' + object[property] + '\n'
              }
              setError(output)
              setErrorModal(true)
            })
          } else {
            let formDataForDBUpdate1 = new FormData()
            formDataForDBUpdate1.append('shipment_no', shipmentToDelete)
            formDataForDBUpdate1.append('updated_by', user_id)
            DepoShipmentCreationService.deleteShipmentTrip(formDataForDBUpdate1)
            .then((res) => {
              setFetch(true)
              if (res.status == 204) {
                // toast.success('Shipment Trip Cancelled Successfully!')
                // navigation('/Dashboard')
                Swal.fire({
                  title: "Shipment Trip Cancelled Successfully!",
                  icon: "success",
                  confirmButtonText: "OK",
                }).then(function () {
                  // Redirect to Dashboard Home Page
                  navigation('/Dashboard')
                });
              } else {
                toast.warning('Shipment Trip Cannot Be Cancelled From LP.. Kindly Contact Admin!')
                setFetch(true)
                setTimeout(() => {
                  window.location.reload(false)
                }, 1000)
              }
            })
            .catch((error) => {
              setFetch(true)
              for (let value of formDataForSAPShipmentDelete.values()) {
                console.log(value)
              }
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


        } else {
          toast.warning('Shipment Cannot Be Deleted From SAP.. Kindly Contact Admin!')
          setFetch(true)
          setTimeout(() => {
            window.location.reload(false)
          }, 1000)
        }
      })
      .catch((error) => {
        setFetch(true)
        for (let value of formDataForSAPShipmentDelete.values()) {
          console.log(value)
        }
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

  /* Date Format Change : yyyy-mm-dd to dd-mm-yy */
  const formatDate = (input) => {
    var datePart = input.match(/\d+/g),
      year = datePart[0].substring(2), // get only two digits
      month = datePart[1],
      day = datePart[2]

    return day + '-' + month + '-' + year
  }

  const pgiUpdateInDb = (json_data) => {
    console.log(json_data,'pgiUpdateInDb-json_data')
    DepoShipmentCreationService.updatePgiInfoToDb(json_data).then((res) => {
      console.log(res)
    })
  }

  const deliveryQuantityUpdateInDb = (json_data) => {
    console.log(json_data,'deliveryQuantityUpdateInDb-json_data')
    DepoShipmentCreationService.updateDeliveryQuantityInfoToDb(json_data).then((res) => {
      console.log(res)
    })
  }

  // const secondWeightUpdateInDb = (json_data) => {
  //   // console.log(json_data)
  //   DepoShipmentCreationService.updateSecondWeightInfoToDb(json_data).then((res) => {
  //     console.log(res)
  //   })
  // }

  const inArray = (plant, plants) => {
    var length = plants.length
    for (var i = 0; i < length; i++) {
      if (plants[i] == plant) return true
    }
    return false
  }

  const statusSetter = (status) => {

    if(status == '1') {
      return (
        <span className="badge rounded-pill bg-info">{'Waiting For Approval'}</span>
      )
    } else if(status == '2') {
      return (
        <span className="badge rounded-pill bg-info">{'Request Reverted'}</span>
      )
    } else if(status == '3') {
      return (
        <span className="badge rounded-pill bg-info">{'Request Confirmed'}</span>
      )
    } else if(status == '4') {
      return (
        <span className="badge rounded-pill bg-info">{'Request Rejected'}</span>
      )
    } else if(status == '7') {
      return (
        <span className="badge rounded-pill bg-info">{'Waiting For Delivery Insert Approval'}</span>
      )
    } else if(status == '8') {
      return (
        <span className="badge rounded-pill bg-info">{'Delivery Insert Request Confirmed'}</span>
      )
    } else {
      return ''
    }
  }

  const loadSaleOrderInfoTable = (sap_data) => {
    var del_order = []

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

    var delivery_orders_array = {}

    console.log(sap_data)

    // Converting the Delivery Details into Delivery Orders
    // =================================================================================================

    const obj = Object.entries(sap_data)

    obj.forEach(([key_st, value]) => {
      let lineItem = value.LINE_ITEM
      // console.log(key_st)
      // console.log(value)

    //   if (inArray(value.WERKS, user_access_locations)) {
        if (value.WERKS != '9290' && inArray(value.WERKS, user_access_locations) && inArray(value.INCO1,user_inco_terms) && !inArray(value.VBELN2,shipmentWaitingDeliveriesData)) {
        // if (value.WERKS != '9290' && inArray(value.WERKS, user_access_locations) && inArray(value.INCO1,user_inco_terms) ) {
        // if (value.WERKS == '1009') {
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

    // console.log(saleOrders)
    // console.log(del_order)
    // console.log(filtered_del_order)
    // setRowData(filtered_del_order)

    setRowData(del_order)
    // setFetch(true)
  }

  useEffect(() => {
    /* section for getting Sale Order Details from SAP */
    VehicleAssignmentSapService.getSaleOrders()
      .then((res) => {
        // console.log(res.data)

        let sap_sale_orders = res.data

        setSaleOrders(sap_sale_orders)
        // setFetch(true)
        loadSaleOrderInfoTable(res.data)
      })
      .catch((err) => {
        setFetch(true)
        console.log(err)
      })

    /* section for getting PGI Info Details from SAP */
    VehicleAssignmentSapService.getPGIInfoData()
      .then((res) => {
        console.log(res.data,'getPGIInfoData')
        let response_info = res.data
        if (response_info.length > 0) {
          pgiUpdateInDb(JSON.stringify(response_info))
        } else {
          console.log('Nothing to Update PGI Info')
        }
      })
      .catch((err) => {
        console.log(err)
      })

    /* section for getting Delivery Quantity update Details from SAP */
    VehicleAssignmentSapService.getDeliveryQuantityInfoData()
      .then((res) => {
        console.log(res.data)
        let response_info = res.data
        if (response_info.length > 0) {
          deliveryQuantityUpdateInDb(JSON.stringify(response_info))
        } else {
          console.log('Nothing to Update Delivery Quantity Info')
        }
      })
      .catch((err) => {
        console.log(err)
      })

    // /* section for getting 2nd Weight Info Details from SAP */
    // VehicleAssignmentSapService.getSecondWeightInfoData()
    //   .then((res) => {
    //     console.log(res.data)
    //     let response_info = res.data
    //     if (response_info.length > 0) {
    //       secondWeightUpdateInDb(JSON.stringify(response_info))
    //     } else {
    //       console.log('Nothing to Update 2nd Weight Info')
    //     }
    //   })
    //   .catch((err) => {
    //     console.log(err)
    //   })
  }, [])

  useEffect(() => {
    loadShipmentViewTable()
  }, [])

  // useEffect(() => {
  //   if (shipmentToDelete != '') {
  //     VehicleAssignmentService.getSingleShipment(shipmentToDelete).then((res) => {
  //       console.log(res.data.data)
  //       setDeletedShipmentInfo(res.data.data)
  //     })
  //   } else {
  //     setDeletedShipmentInfo([])
  //   }
  // }, [shipmentToDelete])

  const loadShipmentViewTable = () => {
    /* Shipment Information Tab Datas */
    DepoShipmentCreationService.getAllShipmentOrders().then((res) => {
      // setFetch(true)
      let tableData = res.data.data
      console.log(res.data.data,'getAllShipmentOrders')
      let rowDataList = []
      const filterData = tableData.filter(
        (data) => user_locations.indexOf(data.parking_yard_info.vehicle_location_id) != -1 && (!(data.approval_status == 7 || data.approval_status == 8))
      )
      console.log(filterData,'filterData-DepoShipmentCreationShipmentInfo')
      let temp = 0
      filterData.map((data, index) => {

          rowDataList.push({
            sno: temp + 1,
            Vehicle_No: data.trip_vehicle_info.vehicle_number,
            Created_At: data.created_at_date,
            Tripsheet_No: data.trip_sheet_info.depo_tripsheet_no,
            // Shipment_User: data.depo_shipment_user_info.username,
            Shipment_User: data.depo_shipment_user_info.emp_name,
            Tripsheet_Date: data.trip_sheet_info.created_date,
            Shipment_No: data.shipment_no != null ? data.shipment_no : ' - ',
            PGI_Status: data.shipment_pgi_status == 1 ? '✔️' : '❌',
            Action: (
              <span className="float-start" color="danger">
                <CButton className="btn btn-secondary btn-sm me-md-1">
                  <Link className="text-white" to={`DepoShipmentCreationShipmentInfo/${data.shipment_id}`}>
                    <i className="fa fa-eye" aria-hidden="true"></i>
                  </Link>
                </CButton>

                <CButton
                  className="btn btn-danger btn-sm me-md-1"
                  onClick={() => {
                    setShipmentDelete(true)
                    setShipmentToDelete(data.shipment_no)
                    setShipmentTSToDelete(data.trip_sheet_info.depo_tripsheet_no)
                  }}
                  disabled={data.shipment_pgi_status == 1}
                >
                  <i className="fa fa-trash" aria-hidden="true"></i>
                </CButton>
                <CButton
                  className="btn btn-danger btn-sm me-md-1"
                  onClick={() => {
                    setShipmentTripCancel(true)
                    // setShipmentDelete(true)
                    setShipmentToDelete(data.shipment_no)
                    setShipmentTSToDelete(data.trip_sheet_info.depo_tripsheet_no)
                  }}
                  disabled={data.shipment_pgi_status == 1}
                >

                  <i className="fa fa-window-close-o" aria-hidden="true"></i>
                </CButton>
              </span>
            ),
          })
          temp++

      })
      setShipmentRowData(rowDataList)
      // setRowData(rowDataList)
    })

    /* Ready For Shipment Creation Tab Datas */
    DepoShipmentCreationService.getAllCreatingShipmentOrders().then((res1) => {
      let tableData = res1.data.data
      console.log(res1.data.data,'getAllCreatingShipmentOrders')
      let rowDataList2 = []
      const filterData = tableData.filter(
        (data) => user_locations.indexOf(data.parking_yard_info.vehicle_location_id) != -1
      )
      console.log(filterData,'filterData')
      let temp = 0
      filterData.map((data, index) => {

        rowDataList2.push({
            sno: temp + 1,
            Vehicle_No: data.trip_vehicle_info.vehicle_number,
            Created_At: data.created_at_date,
            Tripsheet_No: data.trip_sheet_info.depo_tripsheet_no,
            Shipment_No: data.shipment_no != null ? data.shipment_no : ' - ',
            // Shipment_User: data.depo_shipment_user_info.username,
            Shipment_User: data.depo_shipment_user_info.emp_name,
            View: (
              <CButton className="btn btn-secondary btn-sm me-md-1">

                <Link className="text-white" to={`DepoVehicleAssignmentShipmentInfo/${data.shipment_id}`}>
                  <i className="fa fa-eye" aria-hidden="true"></i>
                </Link>
              </CButton>),
            Status: statusSetter(data.approval_status),
            Action: (
              <>
                <span className="float-start" color="success">
                  <CButton
                    className="btn btn-success btn-sm me-md-1"
                    onClick={() => {
                      setShipmentDelete(true)
                      setShipmentToDelete(data.shipment_no)
                      setShipmentTSToDelete(data.trip_sheet_info.trip_sheet_no)
                    }}
                    disabled={data.shipment_pgi_status == 1}
                  >
                    <i className="fa fa-check-square-o" aria-hidden="true"></i>
                  </CButton>
                </span>
                <span className="float-start" color="danger">
                  <CButton
                    className="btn btn-danger btn-sm me-md-1"
                    onClick={() => {
                      setShipmentDelete(true)
                      setShipmentToDelete(data.shipment_no)
                      setShipmentTSToDelete(data.trip_sheet_info.trip_sheet_no)
                    }}
                    disabled={data.shipment_pgi_status == 1}
                  >

                    <i className="fa fa-window-close-o" aria-hidden="true"></i>
                  </CButton>
                </span>
              </>
            ),
          })
          temp++

      })
      setCreatingShipmentRowData(rowDataList2)
    })

    /* Shipment request Tab Datas */
    DepoShipmentCreationService.getAllWaitingShipmentOrders().then((res) => {
      let tableData = res.data.data
      console.log(res.data.data,'getAllWaitingShipmentOrders')
      let rowDataList1 = []
      const filterData = tableData.filter(
        (data) => user_locations.indexOf(data.parking_yard_info.vehicle_location_id) != -1
      )
      console.log(filterData,'filterData')
      let temp = 0
      filterData.map((data, index) => {

        rowDataList1.push({
            sno: temp + 1,
            Vehicle_No: data.trip_vehicle_info.vehicle_number,
            Created_At: data.created_at_date,
            Tripsheet_No: data.trip_sheet_info.depo_tripsheet_no,
            Shipment_No: data.shipment_no != null ? data.shipment_no : ' - ',
            // Shipment_User: data.depo_shipment_user_info.username,
            Shipment_User: data.depo_shipment_user_info.emp_name,
            View: (
              <CButton className="btn btn-secondary btn-sm me-md-1">
                <Link className="text-white" to={`DepoVehicleAssignmentShipmentInfo/${data.shipment_id}`}>
                  <i className="fa fa-eye" aria-hidden="true"></i>
                </Link>
              </CButton>),
            Status: statusSetter(data.approval_status),
            Action: (
              <>
                <span className="float-start" color="success">
                  <CButton
                    className="btn btn-success btn-sm me-md-1"
                    onClick={() => {
                      setShipmentDelete(true)
                      setShipmentToDelete(data.shipment_no)
                      setShipmentTSToDelete(data.trip_sheet_info.trip_sheet_no)
                    }}
                    disabled={data.shipment_pgi_status == 1}
                  >
                    <i className="fa fa-check-square-o" aria-hidden="true"></i>
                  </CButton>
                </span>
                <span className="float-start" color="danger">
                  <CButton
                    className="btn btn-danger btn-sm me-md-1"
                    onClick={() => {
                      setShipmentDelete(true)
                      setShipmentToDelete(data.shipment_no)
                      setShipmentTSToDelete(data.trip_sheet_info.trip_sheet_no)
                    }}
                    disabled={data.shipment_pgi_status == 1}
                  >

                    <i className="fa fa-window-close-o" aria-hidden="true"></i>
                  </CButton>
                </span>
              </>
            ),
          })
          temp++

      })
      setWaitingShipmentRowData(rowDataList1)
      // setRowData(rowDataList)
    })
  }

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

  // useEffect(() => {
  //   loadSaleOrderInfoTable()
  //   // setFetch(true)
  //   if (values.vehicle_number == '') {
  //     console.log('vehicle_no')
  //   } else {
  //     console.log('vehicle_yes')
  //   }
  // }, [fetch])

  function saveShipment() {
    console.log(values)
    console.log(shipmentData)
    // setFetch(true)

    /* Get Total Shipment Quantity By Adding each Delivery Quantity */
    var totalShipmentQuantity = 0
    var totalShipmentNetQuantity = 0
    var totalShipmentQuantityRounded = 0
    var totalShipmentNetQuantityRounded = 0
    shipmentData.map((val, key) => {
      totalShipmentQuantity = totalShipmentQuantity + val.DeliveryQty
      totalShipmentNetQuantity = totalShipmentNetQuantity + val.DeliveryNetQty
    })

    // console.log(totalShipmentQuantity)
    totalShipmentQuantityRounded = parseFloat(totalShipmentQuantity).toFixed(2)
    totalShipmentNetQuantityRounded = parseFloat(totalShipmentNetQuantity).toFixed(2)

    const formData = new FormData()
    formData.append('parking_id', values.parking_id)
    formData.append('vehicle_id', values.vehicle_id)
    formData.append('driver_id', values.driver_id)
    formData.append('tripsheet_id', values.tripsheet_id)
    formData.append('shipment_depo_actual_freight_amount', customerAndFreightInvalidData.FinalFreightCondition)
    formData.append('shipment_depo_budget_freight_amount', customerAndFreightInvalidData.BudjetFreightCondition)
    formData.append('remarks', values.remarks)
    formData.append('created_by', user_id)
    formData.append('freight_type', values.shipment_freight)
    formData.append('process', 2) /* 1-createShipment, 2-saveShipment  */
    formData.append('shipment_info', values.shipment_info)
    // formData.append('shipment_no', sap_shipment_no)
    formData.append('initial_shipment_qty', totalShipmentQuantityRounded)
    formData.append('initial_shipment_net_qty', totalShipmentNetQuantityRounded)
    formData.append('shipment_route', values.shipment_route)
    formData.append('shipment_last_route_id', shipmentRoute)

    DepoShipmentCreationService.createShipmentOrder(formData).then((res) => {
      setFetch(true)
      if (res.status === 200) {
        // toast.success('Shipment Creation Request Sent Successfully!')
        // navigation('/Dashboard')
        Swal.fire({
          icon: "success",
          title: "Approval Requested Successfully!",
          text: "Shipment plan sent for an approval ..",
          confirmButtonText: "OK",
        }).then(function () {
          // Redirect to Dashboard Home Page
          navigation('/Dashboard')
        });
      }
    })
    .catch((error) => {
      setFetch(true)
      for (let value of formData.values()) {
        console.log(value)
      }
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

  function createShipment() {
    console.log(values)
    console.log(shipmentData)
    // console.log(weighmentDepoData,'weighmentDepoData')
    // console.log(values.vehicle_location_id,'weighmentDepoData-vehicle_location_id')
    // console.log(DepoVehicleTypeFinder(),'weighmentDepoData-DepoVehicleTypeFinder')
    // setFetch(true)
    // return false

    /* Get Total Shipment Quantity By Adding each Delivery Quantity */
    var totalShipmentQuantity = 0
    var totalShipmentNetQuantity = 0
    var totalShipmentQuantityRounded = 0
    var totalShipmentNetQuantityRounded = 0
    shipmentData.map((val, key) => {
      totalShipmentQuantity = totalShipmentQuantity + val.DeliveryQty
      totalShipmentNetQuantity = totalShipmentNetQuantity + val.DeliveryNetQty
    })

    // console.log(totalShipmentQuantity)
    totalShipmentQuantityRounded = parseFloat(totalShipmentQuantity).toFixed(2)
    totalShipmentNetQuantityRounded = parseFloat(totalShipmentNetQuantity).toFixed(2)

    var ShipmentCreationSendData = {}
    var ShipmentCreationSendData_seq = []

    /* Set Shipment Data via Selected Deliveries by Loop */
    for (var i = 0; i < shipmentData.length; i++) {
      ShipmentCreationSendData.SIGNI = values.vehicle_number
      ShipmentCreationSendData.trip_sheet = values.tripsheet_no
      ShipmentCreationSendData.Driver_name = values.driver_name
      ShipmentCreationSendData.Contact_no = values.driver_number
      ShipmentCreationSendData.LFIMG = totalShipmentQuantityRounded
      ShipmentCreationSendData.VEH_TYPE = DepoVehicleTypeFinder() 
      ShipmentCreationSendData.ROUTE = values.shipment_route
      ShipmentCreationSendData.TPRFO = shipmentData[i].delivery_sequence
      ShipmentCreationSendData.VBELN = shipmentData[i].DeliveryOrderNumber
      ShipmentCreationSendData.DEL_QTY_MTS = shipmentData[i].DeliveryQty

      ShipmentCreationSendData_seq[i] = ShipmentCreationSendData

      ShipmentCreationSendData = {}
    }

    console.log(ShipmentCreationSendData_seq)

    VehicleAssignmentSapService.createShipment(ShipmentCreationSendData_seq).then((rest) => {

      let sap_shipment_no = rest.data.SHIPMENT_NO
      let sap_shipment_status = rest.data.STATUS
      let sap_ts_shipment = rest.data.TRIP_SHEET
      let sap_trans_plant = rest.data.TRANS_PLAN_POINT

      console.log(sap_shipment_no + '/' + sap_shipment_status + '/' + sap_ts_shipment + '/' + sap_trans_plant)

      if (sap_shipment_no && sap_ts_shipment && sap_shipment_status == 1) {

        const formData = new FormData()
        formData.append('parking_id', values.parking_id)
        formData.append('vehicle_id', values.vehicle_id)
        formData.append('driver_id', values.driver_id)
        formData.append('tripsheet_id', values.tripsheet_id)
        formData.append('shipment_depo_actual_freight_amount', customerAndFreightInvalidData.FinalFreightCondition)
        formData.append('shipment_depo_budget_freight_amount', customerAndFreightInvalidData.BudjetFreightCondition)
        formData.append('remarks', values.remarks)
        formData.append('created_by', user_id)
        formData.append('freight_type', values.shipment_freight)
        formData.append('process', 1) /* 1-createShipment, 2-saveShipment  */
        formData.append('shipment_info', values.shipment_info)
        formData.append('shipment_no', sap_shipment_no)
        formData.append('transport_plant', sap_trans_plant)
        formData.append('initial_shipment_qty', totalShipmentQuantityRounded)
        formData.append('initial_shipment_net_qty', totalShipmentNetQuantityRounded)
        formData.append('shipment_route', values.shipment_route)
        formData.append('shipment_last_route_id', shipmentRoute)

        DepoShipmentCreationService.createShipmentOrder(formData).then((res) => {
            setFetch(true)
            if (res.status === 200) {
              // toast.success('Shipment Created Successfully!')
              // navigation('/Dashboard')
              Swal.fire({
                title: "Shipment Created Successfully!",
                text:  'SAP Shipment No - ' + sap_shipment_no,
                icon: "success",
                confirmButtonText: "OK",
              }).then(function () {
                // Redirect to Dashboard Home Page
                navigation('/Dashboard')
              });
            }
          })
          .catch((error) => {
            setFetch(true)
            for (let value of formData.values()) {
              console.log(value)
            }
            console.log(error)
            var object = error.response.data.errors
            var output = ''
            for (var property in object) {
              output += '*' + object[property] + '\n'
            }
            setError(output)
            setErrorModal(true)
          })
      } else {
        toast.warning('Shipment Not Created..Kindly Contact Admin!')
        setFetch(true)
        setTimeout(() => {
          window.location.reload(false)
        }, 1000)
      }
    })
  }

  return (
    <>
      {!fetch && <Loader />}{' '}
      {fetch && (
        <>
          {screenAccess ? (
            <>
              <CCard className="p-1">
                <CNav variant="tabs" role="tablist">
                  <CNavItem>
                    <CNavLink
                      className="btn btn-sm"
                      // href="javascript:void(0);"
                      active={activeKey === 1}
                      onClick={() => setActiveKey(1)}
                    >
                      Open Delivery
                    </CNavLink>
                  </CNavItem>

                  <CNavItem>
                    <CNavLink
                      className="btn btn-sm"
                      // href="javascript:void(0);"
                      active={activeKey === 3}
                      onClick={() => {
                        setActiveKey(3)
                      }}
                    >
                      Waiting @ SH App.
                    </CNavLink>
                  </CNavItem>

                  <CNavItem>
                    <CNavLink
                      className="btn btn-sm"
                      // href="javascript:void(0);"
                      active={activeKey === 4}
                      onClick={() => {
                        setActiveKey(4)
                      }}
                    >
                      Ready For Shipment Creation
                    </CNavLink>
                  </CNavItem>

                  <CNavItem>
                    <CNavLink
                      className="btn btn-sm"
                      // href="javascript:void(0);"
                      active={activeKey === 2}
                      onClick={() => {
                        setActiveKey(2)
                      }}
                    >
                      Shipment Information
                    </CNavLink>
                  </CNavItem>

                </CNav>

                <CTabContent>
                  <CTabPane role="tabpanel" aria-labelledby="" visible={activeKey === 1}>
                    {Object.keys(rowData).length == 0 && (
                      <>
                        <div className="m-5">
                          <h2>There are no delivery records to display..</h2>
                        </div>
                      </>
                    )}
                    {Object.keys(rowData).length > 0 && (
                      <>
                        <CRow>
                          <CCol
                            className="mt-2 offset-md-9"
                            xs={12}
                            sm={12}
                            md={3}
                            // style={{ display: 'flex', justifyContent: 'space-between' }}
                            style={{ display: 'flex', flexDirection: 'row-reverse', cursor: 'pointer' }}
                          >
                            <CButton
                              onClick={() => {
                                checkModalDisplay()
                                // setAssignTruckModal(!assignTruckModal)
                              }}
                              color="warning"
                              className="mx-3 text-white"
                              size="sm"
                              id="inputAddress"
                            >
                              <span className="float-start">
                                <i className="" aria-hidden="true"></i> &nbsp;Assign Truck
                              </span>
                            </CButton>

                            {/* Assign Truck Modal */}
                            <CModal
                              size="xl"
                              backdrop="static"
                              scrollable
                              visible={assignTruckModal}
                              onClose={() => setAssignTruckModal(false)}
                            >
                              <CModalHeader>
                                <CModalTitle>Depo Vehicle Assignment</CModalTitle>
                              </CModalHeader>
                              <CModalBody>
                                <DepoAssignTruckInfo
                                  values={values}
                                  getvnum={getvnum}
                                  getvroute={getvroute}
                                  delivery_sequence={deliveryinfo}
                                  delivery_data={rowData}
                                  division={1}
                                  last_delivery_route={shipmentRoute}
                                  getCustomerAndFreightInvalidData={getCustomerAndFreightInvalidData}
                                />
                              </CModalBody>

                              <CModalFooter>
                              {shipmentApproval && (<span style={{ color: 'indigo',marginRight:'5%',fontWeight:'bolder' }}>Delivery will be sent to Shipment Approval..</span>)}
                                <CButton
                                  color="primary"
                                  onClick={() => {
                                    setAssignTruckModal(false)
                                    setFetch(false)
                                    checkModalDisplay(1)
                                    shipmentApproval ? saveShipment() : createShipment()
                                    // customerAndFreightInvalidData.FinalFreightCondition == customerAndFreightInvalidData.FinalFreightCondition ? createShipment() : saveShipment()
                                    // createShipment()
                                  }}
                                  // disabled={shipmentSave}
                                  disabled={ChildVnum && ChildVroute && frcsValid ? false : true}
                                  // disabled={ChildVnum && ChildVroute ? false : true}
                                >
                                  {shipmentApproval ? 'Save' : 'Create'}
                                </CButton>
                              </CModalFooter>
                            </CModal>

                            {/* Assign Truck Empty Error Modal */}
                            <CModal
                              visible={assignTruckErrorModal}
                              onClose={() => setAssignTruckErrorModal(false)}
                            >
                              <CModalHeader>
                                <CModalTitle>Error</CModalTitle>
                              </CModalHeader>
                              <CModalBody>
                                <h3 style={{ color: 'red' }}>
                                  * Please Choose Atleast One Delivery Order for Shipment Creation
                                </h3>
                              </CModalBody>
                              <CModalFooter>
                                <CButton
                                  color="secondary"
                                  onClick={() => setAssignTruckErrorModal(false)}
                                >
                                  Close
                                </CButton>
                              </CModalFooter>
                            </CModal>
                          </CCol>
                        </CRow>

                        <CRow>
                          <CTable style={{ height: '80vh', width: 'auto' }} className="overflow-scroll">
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
                                console.log('data')
                                // console.log(data)
                                // if (data.VBELN2)
                                return (
                                  <>
                                    <CTableRow>
                                      <CTableDataCell
                                        style={{ width: '5%', textAlign: 'center' }}
                                        scope="row"
                                      >
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
                      </>
                    )}
                  </CTabPane>
                </CTabContent>

                <CTabContent>
                  <br />
                  <CTabPane role="tabpanel" aria-labelledby="" visible={activeKey === 2}>
                    {/* {fetch && ( */}

                    <CCard className="mt-4">
                      <CContainer className="mt-2">
                        <CustomTable columns={columns} data={shipmentRowData} showSearchFilter={true} />
                      </CContainer>
                    </CCard>
                    {/* )} */}

                    <CTable style={{ display: 'none' }}>
                      <CTableHead style={{ backgroundColor: '#4d3227', color: 'white' }}>
                        <CTableRow>
                          <CTableHeaderCell scope="col" style={{ color: 'white' }}>
                            S.no
                          </CTableHeaderCell>

                          <CTableHeaderCell scope="col" style={{ color: 'white' }}>
                            Truck No
                          </CTableHeaderCell>
                          <CTableHeaderCell scope="col" style={{ color: 'white' }}>
                            Trip Sheet No
                          </CTableHeaderCell>
                          <CTableHeaderCell scope="col" style={{ color: 'white' }}>
                            Shipment No
                          </CTableHeaderCell>
                          <CTableHeaderCell scope="col" style={{ color: 'white' }}>
                            Action
                          </CTableHeaderCell>
                        </CTableRow>
                      </CTableHead>

                      <CTableBody>
                        {
                          // fetch &&
                          ShipmentCreatedData.map((data, index) => {
                            return (
                              <>
                                <CTableRow>
                                  <CTableDataCell scope="row">1</CTableDataCell>
                                  {/* <CTableDataCell>1789</CTableDataCell> */}
                                  <CTableDataCell>TN57AT6789</CTableDataCell>
                                  <CTableDataCell>637534</CTableDataCell>
                                  <CTableDataCell>6547234</CTableDataCell>

                                  <CTableDataCell>
                                    <CButton color="warning" size="sm" className="mx-3 text-white">
                                      <Link className="text-white" to="/VehicleAssignmentFoods">
                                        Show
                                      </Link>
                                    </CButton>
                                  </CTableDataCell>
                                </CTableRow>
                              </>
                            )
                          })
                        }
                      </CTableBody>
                    </CTable>
                  </CTabPane>
                </CTabContent>

                <CTabContent>
                  <br />
                  <CTabPane role="tabpanel" aria-labelledby="" visible={activeKey === 3}>
                    {/* {fetch && ( */}
                    <CCard className="mt-4">
                      <CContainer className="mt-2">
                        <CustomTable columns={waiting_columns} data={waitingShipmentRowData} showSearchFilter={true} />
                      </CContainer>
                    </CCard>
                    {/* )} */}
                  </CTabPane>
                </CTabContent>

                <CTabContent>
                  <br />
                  <CTabPane role="tabpanel" aria-labelledby="" visible={activeKey === 4}>
                    {/* {fetch && ( */}
                    <CCard className="mt-4">
                      <CContainer className="mt-2">
                        <CustomTable columns={waiting_columns} data={creatingShipmentRowData} showSearchFilter={true} />
                      </CContainer>
                    </CCard>
                    {/* )} */}
                  </CTabPane>
                </CTabContent>

              </CCard>
            </>) : (<AccessDeniedComponent />
          )}
        </>
      )}
      {/* Error Modal Section */}
      <CModal visible={errorModal} onClose={() => setErrorModal(false)}>
        <CModalHeader>
          <CModalTitle className="h4">Error</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CRow>
            <CCol>
              {error && (
                // <CAlert color="danger">
                  {error}
                // </CAlert>
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
      {/* Error Modal Section */}
      {/* ======================= Confirm Button Modal Area ========================== */}
      <CModal
        visible={shipmentDelete}
        backdrop="static"
        // scrollable
        onClose={() => {
          setShipmentDelete(false)
          setShipmentToDelete('')
          setShipmentTSToDelete('')
        }}
      >
        <CModalBody>
          <p className="lead">Are you sure to delete this shipment - ({shipmentToDelete}) ?</p>
        </CModalBody>
        <CModalFooter>
          <CButton
            className="m-2"
            color="warning"
            onClick={() => {
              deleteShipment(1)
              setShipmentDelete(false)
              setFetch(false)
            }}
          >
            Confirm
          </CButton>
          <CButton
            color="secondary"
            onClick={() => {
              setShipmentDelete(false)
              setShipmentToDelete('')
              setShipmentTSToDelete('')
            }}
          >
            Cancel
          </CButton>
          {/* <CButton color="primary">Save changes</CButton> */}
        </CModalFooter>
      </CModal>
      {/* *********************************************************** */}
      {/* ======================= Confirm Button Modal Area ========================== */}
      <CModal
        visible={shipmentTripCancel}
        backdrop="static"
        // scrollable
        onClose={() => {
          setShipmentTripCancel(false)
          setShipmentToDelete('')
          setShipmentTSToDelete('')
        }}
      >
        <CModalBody>
          <p className="lead">Are you sure to Cancel this shipment - ({shipmentToDelete}) and Tripsheet - ({ shipmentTSToDelete})?</p>
        </CModalBody>
        <CModalFooter>
          <CButton
            className="m-2"
            color="warning"
            onClick={() => {
              setShipmentTripCancel(false)
              deleteShipment(2)
              setFetch(false)
            }}
          >
            Confirm
          </CButton>
          <CButton
            color="secondary"
            onClick={() => {
              setShipmentTripCancel(false)
              setShipmentToDelete('')
              setShipmentTSToDelete('')
            }}
          >
            Cancel
          </CButton>
          {/* <CButton color="primary">Save changes</CButton> */}
        </CModalFooter>
      </CModal>
      {/* *********************************************************** */}
    </>
  )
}

export default DepoVehicleAssignment
