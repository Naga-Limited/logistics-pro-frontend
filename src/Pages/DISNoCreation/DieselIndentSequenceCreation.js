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
 
import React, { useState, useEffect } from 'react'
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
// import DepoAssignTruckInfo from './Segments/DepoAssignTruckInfo'
import Swal from 'sweetalert2'
import DepoAssignTruckInfo from '../Depo/VehicleAssignment/Segments/DepoAssignTruckInfo'
import { DateRangePicker } from 'rsuite'
import SearchSelectComponent from 'src/components/commoncomponent/searchSelectComponent'
import DieselIntentCreationService from 'src/Service/DieselIntent/DieselIntentCreationService'
import VehicleTypeService from 'src/Service/SmallMaster/Vehicles/VehicleTypeService'
import DepoExpenseClosureService from 'src/Service/Depo/ExpenseClosure/DepoExpenseClosureService'
import NLFSDieselIntentService from 'src/Service/NLFS/Master/NLFSDieselIntentService'

export const nlfs_diesel_vendor_code = process.env.REACT_APP_NLFS_DIESEL_VENDOR

const DieselIndentSequenceCreation = () => {
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
  let page_no = LogisticsProScreenNumberConstants.NLFSDieselIntentModule.FS_DIS_No_Creation_TS

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

  const REQ = () => <span className="text-danger"> * </span>

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

  const [diInfo, setDIInfo] = useState({
    di_orders: [],
    response: [],
  })
  
  const assign_all = (e) => {
    const checked = e.target.checked

    if (checked) {
      const allIds = rowData.map(row => row.id)

      setDIInfo({
        di_orders: allIds,
        response: allIds,
      })
    } else {
      setDIInfo({
        di_orders: [],
        response: [],
      })
    }
  }

  const assign_delivery = (e,id) => {
    // Destructuring
    const { value, checked } = e.target
    const { di_orders } = diInfo

    console.log(value,'assign_delivery-e')
    console.log(id,'assign_delivery-index')
    console.log(checked,'assign_delivery-checked')

    // Case 1 : The user checks the box
    if (checked) {
      setDIInfo({
        di_orders: [...di_orders, id],
        response: [...di_orders, id],
      })
    }

    // Case 2 : The user unchecks the box
    else {
      setDIInfo({
        di_orders: di_orders.filter((e) => e !== id),
        response: di_orders.filter((e) => e !== id),
      })
    }
    console.log(diInfo.response,'assign_delivery-diInfo')
  }
  const [currentDeliveryId, setCurrentDeliveryId] = useState('')

  const [assignTruckErrorModal, setAssignTruckErrorModal] = useState(false)
  const [assignPSModal , setAssignPSModal ] = useState(false)
  const [assignTruckModal, setAssignTruckModal] = useState(false)
  const { values, errors, handleChange, onFocus, handleSubmit, enableSubmit, onBlur } = useForm(
    login,
    validate,
    formValues
  )

  function login() {
    alert('No Errors CallBack Called')
  }

  const totalFreightTripsheets = (data) => {
    let amount = 0
    let total_amount = 0
    console.log(data,'totalFreightTripsheets-data')
    data.map((val,ind)=>{ 
      amount += Number(parseFloat(val.total_amount).toFixed(3))
    })

    total_amount = Number(parseFloat(amount).toFixed(3))
    console.log(data,'totalFreightTripsheets-total_amount')
    // setTotalFreightPayment(total_amount)
    return total_amount
  }

  const totalFuelQuantity = (data) => {
    let fuel_quantity = 0
    let total_fuel_quantity = 0
    console.log(data,'totalFuelQuantity-data')
    data.map((val,ind)=>{ 
      fuel_quantity += Number(parseFloat(val.no_of_ltrs).toFixed(3))
    })

    total_fuel_quantity = Number(parseFloat(fuel_quantity).toFixed(3))
    console.log(data,'totalFuelQuantity-total_fuel_quantity')
    // setTotalFreightPayment(total_amount)
    return total_fuel_quantity
  }

  const differentVehicleTypeAssign = (data) => {
    console.log(data,'differentDivisionAssign-data')
    let div_array = []
    data.map((vv,kk)=>{
      rowData.map((ll,jj)=>{
        if(ll.id == vv){
          div_array.push(ll.vehicle_type_id)
        }
      })
    })
    console.log(div_array,'differentDivisionAssign-div_array')
    // return div_array.length === new Set(div_array).size 

    return new Set(div_array).size > 1
  }

  function checkModalDisplay(type=0) {
    console.log(rowData)
    console.log(diInfo)  

    let trip_payments_selected_array = rowData.filter(
      (value) =>
      JavascriptInArrayComponent(value.id,diInfo.di_orders)
    )

    console.log(trip_payments_selected_array,'trip_payments_selected_array-trip_payments_selected_array')

    setTripDIInfoArray(trip_payments_selected_array)

    if(type==0){
      if (Object.keys(diInfo.response).length > 0) { 
        setAssignPSModal(true) 
      } else {
        toast.warning('Please Choose Atleast One Tripsheet for FSB Number Creation !') 
        setAssignPSModal(false) 
      }
    }

    if(diInfo.di_orders.length > 1 && differentVehicleTypeAssign(diInfo.di_orders)){
      toast.warning('FSB number creation is not allowed for diesel indents belonging to different vehicle types..!')
      setAssignPSModal(false)
      return false
    }
  }

  const [message, setMessage] = useState('')
    
  const handleChangeRemarks = (event) => {
    const result = event.target.value.toUpperCase()
    // console.log('value.message', message)
    setMessage(result)
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

  function formatDate1(date) {
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

  /* Date Format Change : yyyy-mm-dd to dd-mm-yy */
  const formatDate = (input) => {
    var datePart = input.match(/\d+/g),
      year = datePart[0].substring(2), // get only two digits
      month = datePart[1],
      day = datePart[2]

    return day + '-' + month + '-' + year
  }

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

  const [vehicleType, setVehicleType] = useState([])
 
  useEffect(()=>{
    DieselIntentCreationService.getVehicleReadyToDieselIndentSequenceNumberGeneration().then((res) => {
      setFetch(true)
      let tableData = res.data
      let rowDataList = []
      console.log(tableData,'getVehicleReadyToDieselIndentSequenceNumberGeneration-tableData')
      setRowData(tableData)
    })
    .catch((err) => {
      setFetch(true)
      console.log(err)
    })

    VehicleTypeService.getVehicleTypes().then((res) => {
      console.log('sd')
      console.log(res)
      setVehicleType(res.data.data)
      // changevehicleType()
    })
  },[])

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

  const DieselIndentSubmission = () => {
    console.log(diInfo,'DieselIndentSubmission-diInfo')
    console.log(tripDIInfoArray,'DieselIndentSubmission-tripDIInfoArray')
    var trip_di_no_info= []
    var di_id_info= []
    tripDIInfoArray.map((map_data,map_index)=>{
      trip_di_no_info.push({
        id: map_data.id,
        vehicle_number: map_data.vehicle_number,
        trip_sheet_no: map_data.trip_sheet_no, 
      })
      di_id_info.push(map_data.id)
    }) 

    console.log(di_id_info,'DieselIndentSubmission-di_id_info')

    let tfp = totalFreightTripsheets(tripDIInfoArray)
    console.log(tfp,'totalFreightPayment')

    let tfq = totalFuelQuantity(tripDIInfoArray)
    console.log(tfq,'totalFuelQuantity')

    let di_submission_data = new FormData()
    di_submission_data.append('di_id_info', JSON.stringify(di_id_info))
    di_submission_data.append('trip_di_no_info', JSON.stringify(trip_di_no_info))
    di_submission_data.append('created_by', user_id)
    di_submission_data.append('di_count', tripDIInfoArray.length)
    di_submission_data.append('division_id', 5) /* 5-Logistics Division */
    di_submission_data.append('vendor_code', nlfs_diesel_vendor_code) /* 410198-Naga Limited Fuel Station */
    di_submission_data.append('remarks', message)
    di_submission_data.append('status', 1) /* 1-Created */
    di_submission_data.append('type', 1) /* 1-Logistics */ 
    di_submission_data.append('fuel_to', 'V') /* V-Vehicle */ 
    di_submission_data.append('fuel_quantity', tfq)
    di_submission_data.append('fuel_amount', tfp)
    // setFetch(true)
    NLFSDieselIntentService.sentDISubmissionData(di_submission_data).then((res) => {
      // console.log(res,'sentPaymentSubmissionData')
      let payment_reference = res.data.invoice_reference
      setFetch(true)
      if (res.status == 200) {
        Swal.fire({
          icon: "success",
          title: 'Diesel Indent Submission Request Sent Successfully!',
          text:  'Diesel Indent Sequence : ' + payment_reference,
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
        toast.warning('Diesel Indent Submission Cannot be Updated. Kindly contact Admin..!')
      }
    })
    .catch((errortemp) => {
      console.log(errortemp)
      setFetch(true)
      var object = errortemp.response.data.errors
      var output = ''
      for (var property in object) {
        output += '*' + object[property] + '\n'
      }
      setError(output)
      setErrorModal(true)
    })

  }

  const [tripDIInfoArray, setTripDIInfoArray] = useState([])

  const invoiceNoFinder = (data) => {
    // Convert string to JSON
    const di_info_data = JSON.parse(data.nlfs_di_info);

    const docNo = di_info_data.find(item => item.type === 3)?.doc_no;
    console.log(docNo,'invoiceNoFinder')
    return docNo
  }

  const [searchFilterData, setSearchFilterData] = useState([])

  /* Set Default Date (Today) in a Variable State */
  const [defaultDate, setDefaultDate] = React.useState([
    new Date(getCurrentDate('-')),
    new Date(getCurrentDate('-')),
  ])

  useEffect(() => {
    console.log(defaultDate)
    if (defaultDate) {
      setDefaultDate(defaultDate)
    } else {
    }
  }, [defaultDate])

  function getCurrentDate(separator = '') {
    let newDate = new Date()
    let date = newDate.getDate()
    let month = newDate.getMonth() + 1
    let year = newDate.getFullYear()

    return `${year}${separator}${month < 10 ? `0${month}` : `${month}`}${separator}${
      date < 10 ? `0${date}` : `${date}`
    }`
  }
  

  return (
    <>
      {!fetch && <Loader />}{' '}
      {fetch && (
        <>
          {screenAccess ? (
            <>
              <CCard className="p-1">                 
                <CContainer className="m-2">
                  <CRow className="mt-1 mb-1">
                    <CCol xs={12} md={3}>
                      <CFormLabel htmlFor="VNum">Gate - In Date Filter</CFormLabel>
                      <DateRangePicker
                        style={{ width: '100rem', height: '100%', borderColor: 'black' }}
                        className="mb-2"
                        id="start_date"
                        name="end_date"
                        format="dd-MM-yyyy"
                        value={defaultDate}
                        // value={''}
                        onChange={setDefaultDate}
                      />
                    </CCol>
                    {/* <CCol xs={12} md={3}>
                      <CFormLabel htmlFor="vehicleType">
                        Vehicle Type <REQ />{' '}                         
                      </CFormLabel>
                      <CFormSelect
                        size="sm"
                        name="vehicleType"
                        id="vehicleType"
                        onFocus={onFocus}
                        onBlur={onBlur}
                        onChange={handleChange}
                        onClick={(e) => {
                          changevehicleType(e.target.value)
                        }}
                        value={values.vehicleType}
                        className={`${errors.vehicleType && 'is-invalid'}`}
                        aria-label="Small select example"
                      >
                        <option value="0">Select ...</option>
                        {vehicleType.map(({ id, type }) => {
                          return (
                            <>
                              <option key={id} value={id}>
                                {id == '4' ? 'Others' : type}
                              </option>
                            </>
                          )
                        })}
                      </CFormSelect>
                    </CCol> */}

                    {/* <CCol xs={12} md={3}>
                      <CFormLabel htmlFor="VNum">Depo Location</CFormLabel>
                      <SearchSelectComponent
                        size="sm"
                        className="mb-2"
                        onChange={(e) => {
                          onChangeFilter(e, 'depo_location')
                        }}
                        label="Select Depo Location"
                        noOptionsMessage="Location Not found"
                        search_type="depo_payment_submission_location"
                        search_data={searchFilterData}
                      />
                    </CCol>

                    <CCol xs={12} md={3}>
                      <CFormLabel htmlFor="VNum">Depo Contractor</CFormLabel>
                      <SearchSelectComponent
                        size="sm"
                        className="mb-2"
                        onChange={(e) => {
                          onChangeFilter(e, 'depo_contractor')
                        }}
                        label="Select Depo Contractor"
                        noOptionsMessage="Contractor Not found"
                        search_type="depo_payment_submission_contractor"
                        search_data={searchFilterData}
                      />
                    </CCol>

                    <CCol xs={12} md={3}>
                      <CFormLabel htmlFor="VNum">Vehicle Number</CFormLabel>
                      <SearchSelectComponent
                        size="sm"
                        className="mb-2"
                        onChange={(e) => {
                          onChangeFilter(e, 'depo_vehicle')
                        }}
                        label="Select Vehicle Number"
                        noOptionsMessage="Vehicle Not found"
                        search_type="depo_payment_submission_vehicle_number"
                        search_data={searchFilterData}
                      />
                    </CCol> */}

                  {/* </CRow>
                  <CRow className="mt-3"> */}
                    <CCol
                      style={{ display: 'flex', justifyContent: 'end', marginTop:'3%' }}
                    >
                      <CButton
                        size="sm"
                        color="primary"
                        className="mx-3 px-3 text-white"
                        // onClick={() => {
                        //   setFetch(false)
                        //   loadTripPaymentSubmission(1)
                        // }}
                      >
                        Filter
                      </CButton>
                      <CButton
                        size="sm"
                        color="warning"
                        className="mx-3 px-3 text-white"
                        // style={{marginTop:'10%'}}
                        onClick={(e) => {
                            // loadVehicleReadyToTripForExportCSV()
                            // exportToCSV()
                          }}
                      >
                        Export
                      </CButton>
                      {Object.keys(rowData).length > 0 && ( 
                        <CButton
                          onClick={() => {
                            checkModalDisplay()
                            // setAssignTruckModal(!assignTruckModal)
                          }}
                          color="success"
                          className="mx-3 text-white"
                          size="sm"
                          id="inputAddress"
                        >
                          <span className="float-start">
                            <i className="" aria-hidden="true"></i> &nbsp;Assign FSB
                          </span>
                        </CButton>
                      )}

                    </CCol>
                     
                  </CRow>
                </CContainer>
                <CTabContent>
                  <CTabPane role="tabpanel" aria-labelledby="" visible={activeKey === 1}>
                    {Object.keys(rowData).length == 0 && (
                      <>
                        <div className="m-5">
                          <h2>There are no Diesel Indents to display..</h2>
                        </div>
                      </>
                    )}
                    {Object.keys(rowData).length > 0 && (
                      <>
                        
                        <CRow>
                          <CTable style={{ height: '80vh', width: 'auto' }} className="overflow-scroll">
                            <CTableHead style={{ backgroundColor: '#4d3227', color: 'white' }}>
                              <CTableRow style={{ width: '100%' }}>
                                {/* <CTableHeaderCell
                                  scope="col"
                                  style={{ color: 'white', width: '5%', textAlign: 'center' }}
                                >
                                  #
                                </CTableHeaderCell> */}
                                <CTableDataCell
                                  style={{ width: '5%', textAlign: 'center' }}
                                  scope="row"
                                >
                                  <input
                                    className="form-check-input" 
                                    style={{ minHeight: '18px !important', background:rowData.length > 0 &&
                                      diInfo.di_orders.length === rowData.length ? 'yellow' : 'white', }}
                                    type="checkbox"
                                    name="delivery_orders" 
                                    id="flexCheckDefault"
                                    onChange={assign_all}
                                    checked={
                                      rowData.length > 0 &&
                                      diInfo.di_orders.length === rowData.length
                                    } 
                                  /> 
                                  {rowData.length > 0 &&
                                      diInfo.di_orders.length === rowData.length && (
                                    <span
                                      style={{
                                        position: 'absolute', 
                                        left: 32,
                                        fontSize: 14,
                                        color: 'black',
                                        pointerEvents: 'none'
                                      }}
                                    >
                                      ✔
                                    </span>
                                  )}
                                </CTableDataCell>
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
                                  Tripsheet
                                </CTableHeaderCell>

                                <CTableHeaderCell
                                  scope="col"
                                  style={{ color: 'white', width: '9%', textAlign: 'center' }}
                                >
                                  Vehicle Type
                                </CTableHeaderCell>
                                <CTableHeaderCell
                                  scope="col"
                                  style={{ color: 'white', width: '9%', textAlign: 'center' }}
                                >
                                  Vehicle No.
                                </CTableHeaderCell>
                                {/* <CTableHeaderCell
                                  scope="col"
                                  style={{ color: 'white', width: '9%', textAlign: 'center' }}
                                >
                                  Driver Name
                                </CTableHeaderCell> */}
                                <CTableHeaderCell
                                  scope="col"
                                  style={{ color: 'white', width: '9%', textAlign: 'center' }}
                                >
                                  Invoice Date
                                </CTableHeaderCell>
                                <CTableHeaderCell
                                  scope="col"
                                  style={{ color: 'white', width: '9%', textAlign: 'center' }}
                                >
                                  Posting Date
                                </CTableHeaderCell>
                                <CTableHeaderCell
                                  scope="col"
                                  style={{ color: 'white', width: '9%', textAlign: 'center' }}
                                >
                                  Diesel Qty.
                                </CTableHeaderCell>
                                <CTableHeaderCell
                                  scope="col"
                                  style={{ color: 'white', width: '9%', textAlign: 'center' }}
                                >
                                  Diesel rate
                                </CTableHeaderCell>
                                <CTableHeaderCell
                                  scope="col"
                                  style={{ color: 'white', width: '9%', textAlign: 'center' }}
                                >
                                  Total Amount
                                </CTableHeaderCell>
                                <CTableHeaderCell
                                  scope="col"
                                  style={{ color: 'white', width: '9%', textAlign: 'center' }}
                                >
                                  Fuel Dispensary No.
                                </CTableHeaderCell> 
                                <CTableHeaderCell
                                  scope="col"
                                  style={{ color: 'white', width: '9%', textAlign: 'center' }}
                                >
                                  SAP Inv. No.
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
                                          value={data.id}
                                          id="flexCheckDefault"
                                          checked={diInfo.di_orders.includes(data.id)}
                                          onChange={(e) => assign_delivery(e, data.id)} 
                                        />
                                        {/* <input type="checkbox" name="name2" /> */}
                                      </CTableDataCell>
                                      <CTableDataCell
                                        style={{ width: '5%', textAlign: 'center' }}
                                        scope="row"
                                      >
                                        {index+1}
                                      </CTableDataCell>
                                      <CTableDataCell
                                        style={{ width: '9%', textAlign: 'center' }}
                                        scope="row"
                                      >
                                        {data.trip_sheet_no}
                                      </CTableDataCell>
                                      <CTableDataCell
                                        style={{ width: '9%', textAlign: 'center' }}
                                        scope="row"
                                      >
                                        {data.vehicle_type}
                                      </CTableDataCell>
                                      <CTableDataCell
                                        style={{ width: '9%', textAlign: 'center' }}
                                        scope="row"
                                      >
                                        {data.vehicle_number}
                                      </CTableDataCell>
                                      {/* <CTableDataCell
                                        style={{ width: '9%', textAlign: 'center' }}
                                        scope="row"
                                      >
                                        {data.driver_name}
                                      </CTableDataCell> */}
                                      <CTableDataCell
                                        style={{ width: '9%', textAlign: 'center' }}
                                        scope="row"
                                      >
                                        {formatDate1(data.diesel_invoice_date)}
                                      </CTableDataCell>
                                      <CTableDataCell
                                        style={{ width: '9%', textAlign: 'center' }}
                                        scope="row"
                                      >
                                        {formatDate1(data.sap_invoice_diesel_posting_date)}
                                      </CTableDataCell>
                                      <CTableDataCell
                                        style={{ width: '9%', textAlign: 'center' }}
                                        scope="row"
                                      >
                                        {data.no_of_ltrs}
                                      </CTableDataCell>
                                      <CTableDataCell
                                        style={{ width: '9%', textAlign: 'center' }}
                                        scope="row"
                                      >
                                        {data.rate_of_ltrs}
                                      </CTableDataCell>
                                      <CTableDataCell
                                        style={{ width: '9%', textAlign: 'center' }}
                                        scope="row"
                                      >
                                        {data.total_amount}
                                      </CTableDataCell>
                                      <CTableDataCell
                                        style={{ width: '9%', textAlign: 'center' }}
                                        scope="row"
                                      >
                                         
                                        <a className='text-black' target='_blank' rel="noreferrer" href={data.invoice_copy}>
                                          <u><strong>{data.invoice_no}</strong></u>
                                        </a>                                                 
                                         
                                      </CTableDataCell> 
                                      <CTableDataCell
                                        style={{ width: '9%', textAlign: 'center' }}
                                        scope="row"
                                      >
                                        {invoiceNoFinder(data)}
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
      
      {/* *********************************************************** */}
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

      {/* Assign Payment Modal */}
      <CModal
        size="xl"
        backdrop="static"
        scrollable
        visible={assignPSModal}
        onClose={() => setAssignPSModal(false)}
      >
        <CModalHeader>
          <CModalTitle><b>Diesel Indent Submission</b></CModalTitle>
        </CModalHeader>
        <CModalBody>
          {tripDIInfoArray.length > 0 ? (
            // <CTable bordered borderColor="primary">
            
            <>
              <CRow className="">
                <CCol md={3}>
                  <CFormLabel htmlFor="cname">Fuel Station Name & Code</CFormLabel>
                  <CFormInput
                    style={{fontWeight: 'bolder'}}
                    name="cname"
                    size="sm"
                    id="cname"
                    value={`NAGA LIMITED FUEL STATION (410198)`}
                    readOnly
                  />
                </CCol>

                <CCol md={3}>
                  <CFormLabel htmlFor="cmn">User Division</CFormLabel>
                  <CFormInput
                    style={{fontWeight: 'bolder'}}
                    name="cmn"
                    size="sm"
                    id="cmn"
                    value={`Logistics Division (NLLD))`}
                    readOnly
                  />
                </CCol>
                
                <CCol md={2}>
                  <CFormLabel htmlFor="cmn">DI. Count</CFormLabel>
                  <CFormInput
                    style={{fontWeight: 'bolder'}}
                    name="cmn"
                    size="sm"
                    id="cmn"
                    value={`${tripDIInfoArray.length}`}
                    readOnly
                  />
                </CCol>

                <CCol md={2}>
                  <CFormLabel htmlFor="cmn">Total Fuel Qty.</CFormLabel>
                  <CFormInput
                    style={{fontWeight: 'bolder'}}
                    name="cmn"
                    size="sm"
                    id="cmn"
                    value={totalFuelQuantity(tripDIInfoArray)}
                    readOnly
                  />
                </CCol>    

                <CCol md={2}>
                  <CFormLabel htmlFor="cmn">Total Amount</CFormLabel>
                  <CFormInput
                    style={{fontWeight: 'bolder'}}
                    name="cmn"
                    size="sm"
                    id="cmn"
                    value={totalFreightTripsheets(tripDIInfoArray)}
                    readOnly
                  />
                </CCol>               

                <CCol md={3}>
                  <CFormLabel htmlFor="remarks">Remarks</CFormLabel>
                  <CFormInput
                    size="sm"
                    name="remarks"
                    id="remarks"
                    value={message}
                    onChange={handleChangeRemarks}
                  />
                </CCol>
              </CRow>
              <CTable striped hover style={{height:tripDIInfoArray.length > 2 ? '40vh' : '20vh'}}>
                <CTableHead className='mt-3' style={{background: 'pink'}}>
                  <CTableRow>
                    <CTableHeaderCell scope="col" style={{width: '5%', textAlign:"center"}}>S.No</CTableHeaderCell>
                    <CTableHeaderCell scope="col" style={{width: '15%', textAlign:"center"}}>Tripsheet No.</CTableHeaderCell>
                    <CTableHeaderCell scope="col" style={{width: '15%', textAlign:"center"}}>Vehicle Type</CTableHeaderCell>
                    <CTableHeaderCell scope="col" style={{width: '15%', textAlign:"center"}}>Vehicle No.</CTableHeaderCell>
                    <CTableHeaderCell scope="col" style={{width: '15%', textAlign:"center"}}>Driver Name</CTableHeaderCell>
                    <CTableHeaderCell scope="col" style={{width: '15%', textAlign:"center"}}>Diesel Qty.</CTableHeaderCell>
                    <CTableHeaderCell scope="col" style={{width: '15%', textAlign:"center"}}>Diesel Rate</CTableHeaderCell>
                    <CTableHeaderCell scope="col" style={{width: '15%', textAlign:"center"}}>Total Amount</CTableHeaderCell>
                    {/* <CTableHeaderCell scope="col" style={{width: '15%', textAlign:"center"}}>Fuel Dis. No.</CTableHeaderCell>
                    <CTableHeaderCell scope="col" style={{width: '15%', textAlign:"center"}}>SAP Inv. No.</CTableHeaderCell> */}
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {tripDIInfoArray.map((val,ind)=>{
                    // console.log(val,'searchFilterData-Depo Tripsheets : Payment Submission')
                    return(
                      <CTableRow key={ind}>
                        <CTableDataCell scope="col" style={{width: '5%', textAlign:"center"}}>{ind+1}</CTableDataCell>
                        <CTableDataCell scope="col" style={{width: '15%', textAlign:"center"}}>{val.trip_sheet_no}</CTableDataCell>
                        <CTableDataCell scope="col" style={{width: '15%', textAlign:"center"}}>{val.vehicle_type}</CTableDataCell>
                        {/* <CTableHeaderCell scope="col" style={{width: '30%'}}>{val.contractor_info.contractor_name}</CTableHeaderCell> */}
                        <CTableDataCell scope="col" style={{width: '15%', textAlign:"center"}}>{val.vehicle_number}</CTableDataCell>
                        <CTableDataCell scope="col" style={{width: '15%', textAlign:"center"}}>{val.driver_name}</CTableDataCell>
                        <CTableDataCell scope="col" style={{width: '15%', textAlign:"center"}}>{val.no_of_ltrs}</CTableDataCell>
                        {/* <CTableDataCell scope="col" style={{width: '15%'}}>{val.shipment_info.freight_type == '2' ? val.shipment_info.shipment_depo_actual_freight_amount: val.shipment_info.shipment_depo_budget_freight_amount}</CTableDataCell> */}
                        <CTableDataCell scope="col" style={{width: '15%', textAlign:"center"}}>{val.rate_of_ltrs}</CTableDataCell>
                        <CTableDataCell scope="col" style={{width: '15%', textAlign:"center"}}>{val.total_amount}</CTableDataCell>
                        {/* <CTableDataCell scope="col" style={{width: '15%', textAlign:"center"}}>{val.invoice_no}</CTableDataCell>
                        <CTableDataCell scope="col" style={{width: '15%', textAlign:"center"}}>{invoiceNoFinder(val)}</CTableDataCell> */}
                      </CTableRow>
                    )

                  })}
                  <CTableRow>
                    <CTableDataCell colSpan={7} scope="col" style={{width: '95%', textAlign:'end'}}>Total Freight</CTableDataCell>
                    <CTableDataCell scope="col" style={{width: '15%', color:'green', fontWeight:'bold', textAlign:'center'}}>{totalFreightTripsheets(tripDIInfoArray)}
                    </CTableDataCell>
                  </CTableRow>
                </CTableBody>
              </CTable>
            </>) : (<>Tripsheets Not Found / Invalid</>
        )}
          
        </CModalBody>

        <CModalFooter>

          <CButton
            color="primary"
            style={{marginRight: '2%'}}
            onClick={() => {
              setAssignPSModal(false)
              setFetch(false)
              DieselIndentSubmission()
            }}
          >
            {'Submit'}
          </CButton>
          <CButton
            color="primary"
            onClick={() => {
              setAssignPSModal(false)
            }}
          >
            {'Cancel'}
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}

export default DieselIndentSequenceCreation

