import {
  CForm,
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
  CTabContent,
  CTabPane,
} from '@coreui/react'
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import useForm from 'src/Hooks/useForm'
import validate from 'src/Utils/Validation'
import CustomTable from 'src/components/customComponent/CustomTable'

import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import DefinitionsApi from 'src/Service/Definitions/DefinitionsApi'
import Loader from 'src/components/Loader'
import SmallLoader from 'src/components/SmallLoader'
import definitionsMasterValidation from 'src/Utils/Definitions/DefinitionsMasterValidation'
import DefinitionsListApi from 'src/Service/Definitions/DefinitionsListApi'
import SearchSelectComponent from 'src/components/commoncomponent/searchSelectComponent'
import FIEntryService from 'src/Service/FIEntry/FIEntryService'
import TripSheetSearchComponent from '../FIScreen/TripsheetSearchComponent/TripSheetSearchComponent'


import AccessDeniedComponent from 'src/components/commoncomponent/AccessDeniedComponent'
import JavascriptInArrayComponent from 'src/components/commoncomponent/JavascriptInArrayComponent'
import * as LogisticsProScreenNumberConstants from 'src/components/constants/LogisticsProScreenNumberConstants'

const VehicleCurrentPosition = () => {
  const REQ = () => <span className="text-danger"> * </span>
  const [modal, setModal] = useState(false)
  const [fetch, setFetch] = useState(false)
  const [smallfetch, setSmallFetch] = useState(false)
  const [rowData, setRowData] = useState([])
  const [definitionsAll, setDefinitionsAll] = useState([])
  const [currentDefinitionId, setCurrentDefinitionId] = useState('')
  const [disabled, setDisabled] = useState(true)
  const [save, setSave] = useState(true)
  const [success, setSuccess] = useState('')
  const [editId, setEditId] = useState('')
  const [update, setUpdate] = useState('')
  const [deleted, setDeleted] = useState('')
  const [error, setError] = useState('')
  const [mount, setMount] = useState(1)
  const [pending, setPending] = useState(true)
  const formValues = {
    definition_id: '',
    definition_list_name: '',
    definition_list_code: '',
  }
  // =================== Validation ===============
  const {
    values,
    errors,
    handleChange,
    onFocus,
    handleSubmit,
    enableSubmit,
    onBlur,
    onClick,
    isTouched,
  } = useForm(login, definitionsMasterValidation, formValues)

  function login() {
    // alert('No Errors CallBack Called')
  }



 /*================== User Location Fetch ======================*/
 const user_info_json = localStorage.getItem('user_info')
 const user_info = JSON.parse(user_info_json)
 const user_locations = []

 /* Get User Locations From Local Storage */
 user_info.location_info.map((data, index) => {
   user_locations.push(data.id)
 })

 // console.log(user_locations)
 /*================== User Location Fetch ======================*/

/* ==================== Access Part Start ========================*/
  const [screenAccess, setScreenAccess] = useState(false)
  let page_no = LogisticsProScreenNumberConstants.OtherModuleScreen.Vehicle_Current_Position

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



  /* Get All definitions */
  useEffect(() => {
    DefinitionsApi.getDefinitions().then((response) => {
      setFetch(true)
      setSmallFetch(true)
      let needed_data = response.data.data
      console.log(needed_data)
      setDefinitionsAll(needed_data)
    })
  }, [])

  const [tsno, setTsno] = useState('')
  const [Parking_id, setParking_id] = useState('')
  const [vehId, setVehID] = useState('')
  const [vTypeId, setVtypeID] = useState('')
  const [vehNo, setVehNo] = useState('')
  const [vType, setVtype] = useState('')
  const [dId, setDID] = useState('')
  const [tsId, setTSID] = useState('')
  const [vehiclesToRJSO, setVehiclesToRJSO] = useState([])
  const [driverName, setDriverName] = useState('')
  const [driverCode, setDriverCode] = useState('')
  const [vendorCode, setVendorCode] = useState('')
  const [vendorName, setVendorName] = useState('')
  const [vehicle_current_position, setvehicle_current_position] = useState('')
  const [parking_status, setParking_status] = useState('')
  const [singleVehicleInfo, setSingleVehicleInfo] = useState(false)
  const [RJTripSheetNo, setRJTripSheetNo] = useState('')
  const [trip_advance_eligiblity,settrip_advance_eligiblity] = useState('')
  const [purpose,setpurpose] = useState('')
  const [to_divison,setto_divison] = useState('')
  const [advance_payment_diesel,setadvance_payment_diesel] = useState('')
  const [diesel_status,setdiesel_status] = useState('')
  const [tripsheet_is_settled,settripsheet_is_settled] = useState ('')
  const [advance_status,setadvance_status] = useState ('')

  const onChange = (event) => {
    let tripsheetNumber = event.value
    if (tripsheetNumber) {
      values.tripsheetNumber = tripsheetNumber
      if (tripsheetNumber != 0) {
        // setFetch(false)
        setSmallFetch(false)
        setDisabled(false)
      } else {
        setDisabled(true)
      }
      FIEntryService.getFIEntrySingleVehicle(tripsheetNumber).then((res) => {
        setSmallFetch(true)
        console.log(res.data.data)
        setVehNo(res.data.data.parking_info !=null ? res.data.data.parking_info.vehicle_number:'')
        setVehID(res.data.data.parking_info !=null ? res.data.data.parking_info.vehicle_id:'')
        setTSID(res.data.data.parking_info !=null ? res.data.data.trip_sheet_id:'')
        setVtype(res.data.data.parking_info.vehicle_type_id !=null ? res.data.data.parking_info.vehicle_type_id.type:'')
        setVtypeID(res.data.data.parking_info.vehicle_type_id !=null ? res.data.data.parking_info.vehicle_type_id.id:'')
        setParking_id(res.data.data !=null ? res.data.data.parking_id:'')
        setDriverName(res.data.data.parking_info.driver_info != null? res.data.data.parking_info.driver_info.driver_name :'')
        setDID(res.data.data.parking_info.driver_info != null? res.data.data.parking_info.driver_info.driver_id :'')
        setDriverCode(res.data.data.parking_info.driver_info != null? res.data.data.parking_info.driver_info.driver_code:'')
        setVendorCode(res.data.data.parking_info.vendor_info != null ? res.data.data.parking_info.vendor_info.vendor_code:'')
        setVendorName(res.data.data.parking_info.vendor_info != null ? res.data.data.parking_info.vendor_info.owner_name:'')
        // setRJCustomerCode(res.data.data.parking_info.rj_so_info[0] != null? res.data.data.parking_info.rj_so_info[0].customer_code:'')
        setRJTripSheetNo(res.data.data.parking_info.rj_so_info[0] != null ? res.data.data.parking_info.rj_so_info[0].rj_so_no:'')
        setvehicle_current_position(res.data.data.parking_info != null ? res.data.data.parking_info.vehicle_current_position : '')
        setParking_status(res.data.data.parking_info != null ? res.data.data.parking_info.parking_status : '')
        settrip_advance_eligiblity(res.data.data !=null ? res.data.data.trip_advance_eligiblity : '')
        setpurpose(res.data.data !=null ? res.data.data.purpose : '')
        setadvance_status(res.data.data !=null ? res.data.data.advance_status : '')
        setto_divison(res.data.data !=null ? res.data.data.to_divison : '')
        setadvance_payment_diesel(res.data.data !=null ? res.data.data.advance_payment_diesel : '')
        setdiesel_status(res.data.data.parking_info.diesel_intent_info !=null ? res.data.data.parking_info.diesel_intent_info.diesel_status : '')
        settripsheet_is_settled(res.data.data.parking_info.trip_settlement_info !=null ? res.data.data.parking_info.trip_settlement_info.tripsheet_is_settled : '')
        settripsheet_is_settled(res.data.data.parking_info.trip_settlement_info !=null ? res.data.data.parking_info.trip_settlement_info.tripsheet_is_settled : '')
        setSingleVehicleInfo(res.data.data)
      })
      // let tableData
      // FIEntryService.getFIEntryRJSOVehicles(tripsheetNumber).then((res) => {
      //   setFetch(true)
      //   tableData = res.data
      //   console.log(tableData)
      //   const filterData = tableData.filter((data) =>  data.tripsheet_id == values.tripsheetNumber)
      //   // console.log(filterData)
      //   setRJSONo(filterData)
      // })

    }
    else {
      values.tripsheetNumber = ''
      vehId = ''
      vehNo = ''
      tsId = ''
      vType = ''
      Parking_id = ''
      driverCode = ''
      driverName = ''
      vendorCode = ''
      vendorName = ''
      // console.log()
    }
  }
  const Previous_status = (vehicle_current,parking_status,advance_status) => {

    if (vehicle_current == 18 && parking_status == 1) {
      return 'Advance'
    } else if (vehicle_current == 18 && parking_status == 6) {
      return 'Advance'
    } else if (vehicle_current == 18 && parking_status == 16) {
      return 'Gate Out'
    } else if (vehicle_current == 18 && parking_status == 11) {
      return 'Gate Out'
    } else if (vehicle_current == 18 && parking_status == 12) {
      return 'Gate Out'
    } else if (vehicle_current == 18 && parking_status == 14) {
      return 'Advance'
    } else if (vehicle_current == 18 && parking_status == 13) {
      return 'Advance'
    } else if (vehicle_current == 18 && parking_status == 10) {
      return 'Advance'
    } else if (vehicle_current == 18 && parking_status == 17) {
      return 'Advance'
    } else if (vehicle_current == 20 && parking_status == 1) {
      return 'NLFD Shipment'
    } else if (vehicle_current == 20 && parking_status == 6) {
      return 'NLFD Shipment'
    } else if (vehicle_current == 20 && parking_status == 2) {
      return 'NLFD Shipment'
    } else if (vehicle_current == 20 && parking_status == 15) {
      return 'NLFD Shipment'
    } else if (vehicle_current == 20 && parking_status == 17) {
      return 'NLFD Shipment'
    } else if (vehicle_current == 20) {
      return 'NLFD Shipment'
    } else if (vehicle_current == 21) {
      return 'NLFD Shipment Deleted'
    } else if (vehicle_current == 22) {
      return 'NLFD Second Weight'
    } else if (vehicle_current == 23) {
      return 'NLCD Shipment'
    } else if (vehicle_current == 24) {
      return 'NLCD Shipment Deleted'
    } else if (vehicle_current == 25) {
      return 'NLCD Second Weight'
    } else if (vehicle_current == 26) {
      return 'Expense Close'
    } else if (vehicle_current == 27) {
      return 'Income Close'
    } else if (vehicle_current == 261) {
      return 'Income Rejected'
    } else if (vehicle_current == 37) {
      return 'DI Creation'
    } else if (vehicle_current == 39) {
      return 'DI Confirmation'
    }  else if (vehicle_current == 35) {
      return 'RJ Sales Order'
    } else if (vehicle_current == 41) {
      return 'DI Approval'
    } else if (vehicle_current == 16 && parking_status == 1) {
      return 'Trip Sheet'
    } else if (vehicle_current == 16 && parking_status == 6) {
      return 'Trip Sheet'
    } else if (vehicle_current == 16 && parking_status == 2) {
      return 'Trip Sheet'
    } else if (vehicle_current == 16 && parking_status == 8) {
      return 'Gate Out'
    } else if (vehicle_current == 16 && parking_status == 9) {
      return 'Gate Out'
    } else if (vehicle_current == 16 && parking_status == 14) {
      return 'Gate Out'
    } else if (vehicle_current == 16 && (parking_status == 10 || parking_status == 16 || parking_status == 11 || parking_status == 12 || parking_status == 13)&& advance_status == 0) {
      return 'Gate Out'
    } else if (vehicle_current == 16 && (parking_status == 10 || parking_status == 16 || parking_status == 11 || parking_status == 12 || parking_status == 13) && advance_status == 1) {
      return 'Additional Advance'
    } else if (vehicle_current == 17) {
      return 'Tripsheet Delete'
    } else if (vehicle_current == 50){
      return 'Gate Out'
    } else {
      return 'Gate In'
    }
  }

  const Hire_waiting = (vehicle_current,parking,trip_advance_eligiblity,purpose,to_divison,advance_payment_diesel,diesel_status,advance_status) => {

    if (vehicle_current == 16 && parking == 2 && trip_advance_eligiblity == 0 && purpose == 2) {
      return 'Gate Out'
    } else if (vehicle_current == 16 && parking == 2 && purpose == 3) {
      return 'Gate Out'
    } else if (vehicle_current == 16 && parking == 2 && trip_advance_eligiblity == 1 && purpose == 2) {
      return 'Gate Out'
    } else if (vehicle_current == 16 && parking == 2 && trip_advance_eligiblity == 1 && purpose == 1 && to_divison == 2) {
      return 'Gate Out'
    } else if (vehicle_current == 16 && parking == 2 && trip_advance_eligiblity == 1 && purpose == 1 && to_divison == 1) {
      return 'NLFD VH Assign'
    } else if (vehicle_current == 16 && parking == 9) {
      return 'Expense Closure'
    } else if (vehicle_current == 16 && parking == 10 && trip_advance_eligiblity == 0) {
      return 'Expense Closure'
    } else if (vehicle_current == 16 && parking == 13 && trip_advance_eligiblity == 1 && purpose == 1 && to_divison == 2) {
      return 'NLCD VH Assign'
    } else if (vehicle_current == 16 && parking == 2 && trip_advance_eligiblity == 0 && purpose == 1 && to_divison == 1) {
      return 'NLFD VH Assign'
    } else if (vehicle_current == 20 && parking == 2 && trip_advance_eligiblity == 0 && purpose == 1 && to_divison == 1) {
      return 'Gate Out'
    } else if (vehicle_current == 20 && parking == 2 && trip_advance_eligiblity == 1 && purpose == 1 && to_divison == 1) {
      return 'Gate Out'
    } else if (vehicle_current == 23 && parking == 13 && trip_advance_eligiblity == 1 && purpose == 1 && to_divison == 2) {
      return 'NLCD Second Weight'
    } else if (vehicle_current == 23 && parking == 13 && trip_advance_eligiblity == 0 && purpose == 1 && to_divison == 2) {
      return 'NLCD Second Weight'
    } else if (vehicle_current == 20 && parking == 17 && trip_advance_eligiblity == 1 && purpose == 1 && to_divison == 1) {
      return 'NLFD Second Weight'
    } else if (vehicle_current == 20 && parking == 17 && trip_advance_eligiblity == 0 && purpose == 1 && to_divison == 1) {
      return 'NLFD Second Weight'
    } else if (vehicle_current == 22 && parking == 17 && trip_advance_eligiblity == 1 && purpose == 1 && to_divison == 1 && advance_payment_diesel == '0') {
      return 'Advance'
    } else if (vehicle_current == 22 && parking == 17 && trip_advance_eligiblity == 1 && purpose == 1 && to_divison == 1 && advance_payment_diesel != '0') {
      return 'DI Creation'
    } else if (vehicle_current == 22 && parking == 17 && trip_advance_eligiblity == 0 && purpose == 1 && to_divison == 1) {
      return 'Expense'
    } else if (vehicle_current == 25 && parking == 13 && trip_advance_eligiblity == 1 && purpose == 1 && to_divison == 2) {
      return 'Advance'
    } else if (vehicle_current == 25 && parking == 13 && trip_advance_eligiblity == 1 && purpose == 1 && to_divison == 2 && advance_payment_diesel == 0) {
      return 'Advance'
    } else if (vehicle_current == 25 && parking == 13 && trip_advance_eligiblity == 1 && purpose == 1 && to_divison == 2 && advance_payment_diesel != 0) {
      return 'DI Creation'
    } else if (vehicle_current == 16 && parking == 10 && trip_advance_eligiblity == 1 && purpose == 2 && to_divison == 1 && advance_payment_diesel == 0) {
      return 'Advance'
    } else if (vehicle_current == 16 && parking == 14 && trip_advance_eligiblity == 1 && purpose == 2 && to_divison == 2 && advance_payment_diesel == 0) {
      return 'Advance'
    } else if (vehicle_current == 16 && parking == 10 && trip_advance_eligiblity == 1 && purpose == 2 && to_divison == 1 && advance_payment_diesel != 0) {
      return 'DI Creation'
    } else if (vehicle_current == 16 && parking == 14 && trip_advance_eligiblity == 1 && purpose == 2 && to_divison == 2 && advance_payment_diesel != 0) {
      return 'DI Creation'
    } else if (vehicle_current == 18 && parking == 17 && trip_advance_eligiblity == 1 && purpose == 1 && to_divison == 1 && advance_payment_diesel != 0 && diesel_status == 3) {
      return 'Expense Closure'
    } else if (vehicle_current == 18 && parking == 13 && trip_advance_eligiblity == 1 && purpose == 1 && to_divison == 2&& advance_payment_diesel != 0 && diesel_status == 3) {
      return 'Expense Closure'
    } else if (vehicle_current == 18 && parking == 10 && trip_advance_eligiblity == 1 && purpose == 2 && to_divison == 1 && advance_payment_diesel != 0 && diesel_status == 3) {
      return 'Expense Closure'
    } else if (vehicle_current == 18 && parking == 14 && trip_advance_eligiblity == 1 && purpose == 2 && to_divison == 2 &&  advance_payment_diesel != 0 && diesel_status == 3) {
      return 'Expense Closure'
    } else if (vehicle_current == 18 && parking == 17 && trip_advance_eligiblity == 1 && purpose == 1 && to_divison == 1 && advance_payment_diesel == 0) {
      return 'Expense Closure'
    } else if (vehicle_current == 18 && parking == 13 && trip_advance_eligiblity == 1 && purpose == 1 && to_divison == 2&& advance_payment_diesel == 0 ) {
      return 'Expense Closure'
    } else if (vehicle_current == 18 && parking == 10 && trip_advance_eligiblity == 1 && purpose == 2 && to_divison == 1 && advance_payment_diesel == 0 ) {
      return 'Expense Closure'
    } else if (vehicle_current == 18 && parking == 14 && trip_advance_eligiblity == 1 && purpose == 2 && to_divison == 2 &&  advance_payment_diesel == 0 ) {
      return 'Expense Closure'
    } else if (vehicle_current == 41 && advance_status == 1) {
      return 'Expense Closure'
    } else if (vehicle_current == 41 && advance_status == 0) {
      return 'Advance'
    }  else if (vehicle_current == 261) {
      return 'Expense Closure'
    } else if (vehicle_current == 37 && advance_status == 0) {
      return 'DI Confirmation & Advance'
    } else if (vehicle_current == 18 && advance_status == 1) {
      return 'DI Confirmation'
    } else if (vehicle_current == 39 && advance_status == 0) {
      return 'DI Approval && Advance'
    }  else if (vehicle_current == 18 && advance_status == 1) {
      return 'DI Approval'
    } else if (vehicle_current == 26) {
      return 'Income Closure'
    } else if (vehicle_current == 27) {
      return 'Tripsheet Settlement'
    } else if (vehicle_current == 17) {
      return 'Tripsheet Delete'
    } else {
      return 'Gate In'
    }
  }

  const Own_waiting = (vehicle_current,parking,trip_advance_eligiblity,purpose,to_divison,diesel_status,tripsheet_is_settled,advance_status) => {

    if (vehicle_current == 16 && parking == 1 && purpose == 3) {
      return 'Gate Out'
    } else if (vehicle_current == 16 && parking == 6 && purpose == 3) {
      return 'Gate Out'
    } else if (vehicle_current == 16 && parking == 8 &&  purpose == 3) {
      return 'DI Creation & Add On FG/RJ Sale'
    } else if (vehicle_current == 16 && parking == 1 && trip_advance_eligiblity == 1 && purpose == 1) {
      return 'Advance && VH Assign'
    } else if (vehicle_current == 16 && parking == 6 && trip_advance_eligiblity == 1 && purpose == 1) {
      return 'Advance && VH Assign'
    } else if (vehicle_current == 16 && parking == 1 && trip_advance_eligiblity == 1 && purpose == 2) {
      return 'Advance && Gate Out'
    } else if (vehicle_current == 16 && parking == 6 && trip_advance_eligiblity == 1 && purpose == 2) {
      return 'Advance && Gate Out'
    } else if (vehicle_current == 18 && parking == 1 && purpose == 1 && to_divison == 1) {
      return 'NLFD VH Assign'
    } else if (vehicle_current == 18 && parking == 6 && purpose == 1 && to_divison == 1) {
      return 'NLFD VH Assign'
    } else if (vehicle_current == 18 && parking == 1 && purpose == 1 && to_divison == 2) {
      return 'Gate Out'
    } else if (vehicle_current == 18 && parking == 6 && purpose == 1 && to_divison == 2) {
      return 'Gate Out'
    } else if (vehicle_current == 18 && parking == 1 && trip_advance_eligiblity == 1 && purpose == 2) {
      return 'Gate Out'
    } else if (vehicle_current == 18 && parking == 6 && trip_advance_eligiblity == 1 && purpose == 2) {
      return 'Gate Out'
    } else if (vehicle_current == 16 && parking == 6 && trip_advance_eligiblity == 1 && purpose == 1 && to_divison == 2) {
      return 'Gate Out'
    } else if (vehicle_current == 16 && parking == 12 && trip_advance_eligiblity == 1 && purpose == 2 && to_divison == 2 && advance_status == 1) {
      return 'DI Creation & Add On FG & RJ Sale'
    }  else if (vehicle_current == 16 && parking == 12 && trip_advance_eligiblity == 1 && purpose == 2 && to_divison == 2 && advance_status == 0) {
      return 'Additional Advance'
    }else if (vehicle_current == 16 && parking == 1 && trip_advance_eligiblity == 1 && purpose == 1 && to_divison == 2) {
      return 'Gate Out'
    }  else if (vehicle_current == 18 && parking == 6 && trip_advance_eligiblity == 1 && purpose == 1 && to_divison == 2) {
      return 'Gate Out'
    } else if (vehicle_current == 18 && parking == 1 && trip_advance_eligiblity == 1 && purpose == 1 && to_divison == 2) {
      return 'Gate Out'
    }else if (vehicle_current == 18 && parking == 11 && trip_advance_eligiblity == 1 && purpose == 1 && to_divison == 2) {
      return 'VH Assign'
    } else if (vehicle_current == 16 && parking == 11 && trip_advance_eligiblity == 1 && purpose == 1 && to_divison == 2) {
      return 'VH Assign'
    } else if (vehicle_current == 23 && parking == 11 && trip_advance_eligiblity == 1 && purpose == 1 && to_divison == 2) {
      return 'NLCD Second Weight'
    } else if (vehicle_current == 20 && parking == 15 && trip_advance_eligiblity == 1 && purpose == 1 && to_divison == 1) {
      return 'NLFD Second Weight'
    } else if (vehicle_current == 23 && parking == 11 && trip_advance_eligiblity == 0 && purpose == 1 && to_divison == 2) {
      return 'NLCD Second Weight'
    } else if (vehicle_current == 20 && parking == 15 && trip_advance_eligiblity == 0 && purpose == 1 && to_divison == 1) {
      return 'NLFD Second Weight'
    } else if (vehicle_current == 20 && (parking == 11 || parking == 12 || parking == 15 || parking == 16 || parking == 8)) {
      return 'NLFD Second Weight'
    } else if (vehicle_current == 18 && parking == 12 && trip_advance_eligiblity == 1&& purpose == 2 && to_divison == 2) {
      return 'DI Creation && Add On FG & RJ Sale'
    } else if (vehicle_current == 18 && parking == 16 && trip_advance_eligiblity == 1 && purpose == 2 && to_divison == 1) {
      return 'DI Creation & Add On FG & RJ Sale'
    } else if (vehicle_current == 16 && parking == 16 && trip_advance_eligiblity == 1 && purpose == 2 && to_divison == 1 && advance_status == 1) {
      return 'DI Creation & Add On FG & RJ Sale'
    } else if (vehicle_current == 16 && parking == 16 && trip_advance_eligiblity == 1 && purpose == 2 && to_divison == 1 && advance_status == 0) {
      return 'Additional Advance'
    } else if (vehicle_current == 25 && trip_advance_eligiblity == 1 && purpose == 1 && to_divison == 2 && advance_status == 1) {
      return 'DI Creation & Add On FG & RJ Sale'
    } else if (vehicle_current == 22 && trip_advance_eligiblity == 1 && purpose == 1 && to_divison == 1 && advance_status == 1) {
      return 'DI Creation & Add On FG & RJ Sale'
    }  else if (vehicle_current == 23 && (parking == 11 || parking == 12 || parking == 15 || parking == 16 || parking == 8)) {
      return 'NLFD Second Weight'
    }else if (vehicle_current == 25 && trip_advance_eligiblity == 1 && purpose == 1 && to_divison == 2 && advance_status == 0) {
      return 'Additional Advance'
    } else if (vehicle_current == 22 && trip_advance_eligiblity == 1 && purpose == 1 && to_divison == 1 && advance_status == 0) {
      return 'Additional Advance'
    } else if (vehicle_current == 20 && parking == 1 && trip_advance_eligiblity == 1 && purpose == 1) {
      return 'Gate Out'
    } else if (vehicle_current == 20 && parking == 6 && trip_advance_eligiblity == 1 && purpose == 1) {
      return 'Gate Out'
    } else if (vehicle_current == 37 && parking_status == 19 && tripsheet_is_settled == 2) {
      return 'DI Confirm & Expense Close'
    } else if (vehicle_current == 37 && parking_status == 19 && tripsheet_is_settled == 1) {
      return 'DI Confirm & Income Close'
    } else if (vehicle_current == 37 && parking_status == 19 && tripsheet_is_settled == 4) {
      return 'DI Confirm & Income Close'
    } else if (vehicle_current == 37 && parking_status == 19 && tripsheet_is_settled == 3) {
      return 'DI Confirm & Settlement'
    } else if (vehicle_current == 37 && parking_status == 19) {
      return 'DI Confirm & Expense Close'
    } else if (vehicle_current == 37) {
      return 'DI Confirm & Gate In'
    } else if (vehicle_current == 39 && parking_status == 19 && tripsheet_is_settled == 2) {
      return 'DI Approve & Expense Close'
    } else if (vehicle_current == 39 && parking_status == 19 && tripsheet_is_settled == 1) {
      return 'DI Approve & Income Close'
    } else if (vehicle_current == 39 && parking_status == 19 && tripsheet_is_settled == 4) {
      return 'DI Approve & Income Close'
    } else if (vehicle_current == 39 && parking_status == 19 && tripsheet_is_settled == 3) {
      return 'DI Approve & Settlement'
    } else if (vehicle_current == 39 && parking_status == 19) {
      return 'DI Approval & Expense Close'
    } else if (vehicle_current == 39) {
      return 'DI Approval & Gate In'
    } else if (vehicle_current == 41 && parking_status == 19 && tripsheet_is_settled == 1) {
      return 'Income Close'
    } else if (vehicle_current == 41 && parking_status == 19 && tripsheet_is_settled == 2) {
      return 'Expense Close'
    } else if (vehicle_current == 41 && parking_status == 19 && tripsheet_is_settled == 3) {
      return 'Settlement'
    } else if (vehicle_current == 41 && parking_status == 19 && !tripsheet_is_settled) {
      return 'Expense'
    } else if (vehicle_current == 35) {
      return 'DI Creation & Add On FG & RJ Sale'
    } else if (vehicle_current == 261 && parking_status == 19 && diesel_status == 1 && tripsheet_is_settled == 2) {
      return 'DI Confirm & Expense Close'
    } else if (vehicle_current == 261 && parking_status == 19 && diesel_status == 2 && tripsheet_is_settled == 2) {
      return 'DI Approve & Expense Close'
    } else if (vehicle_current == 26 && parking_status == 19 && diesel_status == 1 && tripsheet_is_settled == 1) {
      return 'DI Confirm & Income Close'
    } else if (vehicle_current == 26 && parking_status == 19 && diesel_status == 2 && tripsheet_is_settled == 1) {
      return 'DI Approve & Income Close'
    } else if (vehicle_current == 26 && diesel_status == 1) {
      return 'DI Confirm & Income Close'
    } else if (vehicle_current == 26 && diesel_status == 2) {
      return 'DI Approve & Income Close'
    } else if (vehicle_current == 261 && diesel_status == 2) {
      return 'DI Approve & Expense Close'
    } else if (vehicle_current == 261 && diesel_status == 1) {
      return 'DI Confirm & Expense Close'
    } else if (vehicle_current == 27 && diesel_status == 1) {
      return 'DI Confirm & Settlement'
    } else if (vehicle_current == 27 && diesel_status == 2) {
      return 'DI Approve & Settlement'
    } else if (vehicle_current == 27) {
      return 'Settlement'
    } else if (vehicle_current == 26) {
      return 'Income Close'
    } else if (vehicle_current == 17) {
      return 'Tripsheet Delete'
    } else {
      return 'Gate In'
    }
  }

  const Party_Waiting = (vehicle_current,parking) => {

    if (vehicle_current == 50 && parking == 18) {
      return 'VH Assign'
    } else if (vehicle_current == 20 && parking == 18 ) {
      return 'NLFD Second Weight'
    } else if (vehicle_current == 23 && parking == 18 ) {
      return 'NLCD Second Weight'
    } else if (vehicle_current == 21 && parking == 18 ) {
      return 'NLFD Shipment Delete'
    } else if (vehicle_current == 24 && parking == 18 ) {
      return 'NLCD Shipment Delete'
    } else {
      return 'Gate Out'
    }
  }

  return (
    <>
      {!fetch && <Loader />}

      {fetch && (

        <>

         {screenAccess ? (
          <>

            <CContainer className="mt-2">
            <CTabPane role="tabpanel" aria-labelledby="home-tab" visible={true}>

          <CRow xs={{ gutterX: 5 }}>
            <CCol>
              <div className="p-3 border bg-light" style={{height:'75px',width:'315px'}}>
                <CInputGroup className="mb-3">
                  <CInputGroupText component="label" style={{height:'39px'}}>
                    TripSheet No
                  </CInputGroupText>

                  {/* <CFormSelect
                    id="inputGroupSelect01"
                    onchange
                    onChange={(e) => {
                      assignValues(e.target.value)
                    }}
                    value={values.definition_id}
                  >
                    <option value={0}>Select...</option>
                    {definitionsAll.map(({ definition_id, definition_name }) => {
                      return (
                        <>
                          <option key={definition_id} value={definition_id}>
                            {definition_name}
                          </option>
                        </>
                      )
                    })}
                  </CFormSelect> */}
                  <TripSheetSearchComponent
                    id="inputGroupSelect01"
                    className="mb-1"
                          onChange={(e) => {
                            onChange(e)
                          }}
                          label="tripsheetNumber"
                          name="tripsheetNumber"
                          value={values.tripsheetNumber}
                          search_type="tripsheet_Number"
                          onClick={(e) => {
                            changevehicleType1(e.target.value)
                          }}
                        />
                </CInputGroup>
              </div>
            </CCol>

            <CCol>{/* <div className="p-3 border bg-light">Custom column padding</div> */}</CCol>
          </CRow>
          {/* {currentDefinitionId && ( */}
          {}
          {!smallfetch && <SmallLoader />}

          {smallfetch && (
            <CContainer style={disabled ? { display: 'none' } : {}}>
                <CCard>
                <CTabContent>
                  <CRow className="container p-3">
                    <CCol xs={12} md={3}>
                      <CFormLabel htmlFor="vehicleNumber">
                        Vehicle Number
                        {errors.vehicleNumber && (
                          <span className="small text-danger">{errors.vehicleNumber}</span>
                        )}
                      </CFormLabel>
                      <CFormInput
                        size="sm"
                        id="vehicleNumber"
                        name="vehicleNumber"
                        value={vehNo}
                        type="text"
                        maxLength="6"
                        onFocus={onFocus}
                        onBlur={onBlur}
                        onChange={handleChange}
                        readOnly
                      />
                    </CCol>
                    <CCol xs={12} md={3}>
                      <CFormLabel htmlFor="vehicleType">
                        Vehicle Type
                        {errors.vehicleType && (
                          <span className="small text-danger">{errors.vehicleType}</span>
                        )}
                      </CFormLabel>
                      <CFormInput
                        size="sm"
                        id="vehicleType"
                        name="vehicleType"
                        value={vType}
                        type="text"
                        maxLength="6"
                        onFocus={onFocus}
                        onBlur={onBlur}
                        onChange={handleChange}
                        readOnly
                      />
                    </CCol>

                        { vTypeId < 3  &&
                        <CCol xs={12} md={3}>
                          <CFormLabel htmlFor="driver_code">Driver Code</CFormLabel>
                          <CFormInput
                            size="sm"
                            id="driver_code"
                            name="driver_code"
                            value={driverCode}
                            type="text"
                            maxLength="6"
                            onFocus={onFocus}
                            onBlur={onBlur}
                            onChange={handleChange}
                            readOnly
                          />
                        </CCol>}
                        {  vTypeId < 3  &&
                        <CCol xs={12} md={3}>
                          <CFormLabel htmlFor="driver_name">Driver Name</CFormLabel>
                          <CFormInput
                            size="sm"
                            id="driver_name"
                            name="driver_name"
                            value={driverName}
                            type="text"
                            maxLength="6"
                            onFocus={onFocus}
                            onBlur={onBlur}
                            onChange={handleChange}
                            readOnly
                          />
                        </CCol>}
                        {  vTypeId == 4  &&
                        <CCol xs={12} md={3}>
                          <CFormLabel htmlFor="driver_name">Party Name</CFormLabel>
                          <CFormInput
                            size="sm"
                            id="driver_name"
                            name="driver_name"
                            value={singleVehicleInfo?.parking_info?.party_name}
                            type="text"
                            maxLength="6"
                            onFocus={onFocus}
                            onBlur={onBlur}
                            onChange={handleChange}
                            readOnly
                          />
                        </CCol>}
                        {  vTypeId == 4  &&
                        <CCol xs={12} md={3}>
                          <CFormLabel htmlFor="driver_name">Driver Name</CFormLabel>
                          <CFormInput
                            size="sm"
                            id="driver_name"
                            name="driver_name"
                            value={singleVehicleInfo?.parking_info?.driver_name+' - '+singleVehicleInfo?.parking_info?.driver_contact_number}
                            type="text"
                            maxLength="6"
                            onFocus={onFocus}
                            onBlur={onBlur}
                            onChange={handleChange}
                            readOnly
                          />
                        </CCol>}
                        { vType == 'Hire'  &&
                        <CCol xs={12} md={3}>
                          <CFormLabel htmlFor="vendor_code">Vendor Code</CFormLabel>
                          <CFormInput
                            size="sm"
                            id="vendor_code"
                            name="vendor_code"
                            value={vendorCode}
                            type="text"
                            maxLength="6"
                            onFocus={onFocus}
                            onBlur={onBlur}
                            onChange={handleChange}
                            readOnly
                          />
                        </CCol>}
                        { vType == 'Hire'  &&
                        <CCol xs={12} md={3}>
                          <CFormLabel htmlFor="vendor_name">Vendor Name</CFormLabel>
                          <CFormInput
                            size="sm"
                            id="vendor_name"
                            name="vendor_name"
                            value={vendorName}
                            type="text"
                            maxLength="6"
                            onFocus={onFocus}
                            onBlur={onBlur}
                            onChange={handleChange}
                            readOnly
                          />
                        </CCol>}
                        <CCol xs={12} md={3}>
                          <CFormLabel htmlFor="vendor_name">Division Name</CFormLabel>
                          <CFormInput
                            size="sm"
                            id="vendor_name"
                            name="vendor_name"
                            value={singleVehicleInfo.to_divison == 2 ? 'NLCD' : 'NLFD'}
                            type="text"
                            maxLength="6"
                            onFocus={onFocus}
                            onBlur={onBlur}
                            onChange={handleChange}
                            readOnly
                          />
                        </CCol>
                        <CCol xs={12} md={3}>
                          <CFormLabel htmlFor="vendor_name">Purpose</CFormLabel>
                          <CFormInput
                            size="sm"
                            id="vendor_name"
                            name="vendor_name"
                            value={singleVehicleInfo.purpose == 1 ? 'FG Sale' : singleVehicleInfo.purpose == 2 ? 'FG STO':singleVehicleInfo.purpose == 3 ?'RM STO' : 'Party FG Sale'}
                            type="text"
                            maxLength="6"
                            onFocus={onFocus}
                            onBlur={onBlur}
                            onChange={handleChange}
                            readOnly
                          />
                        </CCol>
                        <CCol xs={12} md={3}>
                          <CFormLabel htmlFor="vendor_name">Previous Status</CFormLabel>
                          <CFormInput
                            size="sm"
                            id="vendor_name"
                            name="vendor_name"
                            value={Previous_status(vehicle_current_position,parking_status,advance_status)}
                            type="text"
                            maxLength="6"
                            onFocus={onFocus}
                            onBlur={onBlur}
                            onChange={handleChange}
                            readOnly
                          />
                        </CCol>
                        { vType == 'Hire'  &&
                        <CCol xs={12} md={3}>
                          <CFormLabel htmlFor="vendor_name">Waiting At</CFormLabel>
                          <CFormInput
                            size="sm"
                            id="vendor_name"
                            name="vendor_name"
                            value={Hire_waiting(vehicle_current_position,parking_status,trip_advance_eligiblity,purpose,to_divison,advance_payment_diesel,diesel_status,advance_status)}
                            type="text"
                            maxLength="6"
                            onFocus={onFocus}
                            onBlur={onBlur}
                            onChange={handleChange}
                            readOnly
                          />
                        </CCol>}
                        { vTypeId < 3&&
                        <CCol xs={12} md={3}>
                          <CFormLabel htmlFor="vendor_name">Waiting At</CFormLabel>
                          <CFormInput
                            size="sm"
                            id="vendor_name"
                            name="vendor_name"
                            value={Own_waiting(vehicle_current_position,parking_status,trip_advance_eligiblity,purpose,to_divison,diesel_status,tripsheet_is_settled,advance_status)}
                            type="text"
                            maxLength="6"
                            onFocus={onFocus}
                            onBlur={onBlur}
                            onChange={handleChange}
                            readOnly
                          />
                        </CCol>}
                        { vTypeId == 4 &&
                        <CCol xs={12} md={3}>
                          <CFormLabel htmlFor="vendor_name">Waiting At</CFormLabel>
                          <CFormInput
                            size="sm"
                            id="vendor_name"
                            name="vendor_name"
                            value={Party_Waiting(vehicle_current_position,parking_status)}
                            type="text"
                            maxLength="6"
                            onFocus={onFocus}
                            onBlur={onBlur}
                            onChange={handleChange}
                            readOnly
                          />
                        </CCol>}
                        {singleVehicleInfo.parking_info?.shipment_info.length > 0 &&
                        <CCol xs={12} md={3}>
                          <CFormLabel htmlFor="vendor_name">PGI Status</CFormLabel>
                          <CFormInput
                            size="sm"
                            id="vendor_name"
                            name="vendor_name"
                            value={singleVehicleInfo.parking_info.shipment_info[0].shipment_pgi_status == 1 ? 'PGI Complete' : 'PGI Waiting'}
                            type="text"
                            maxLength="6"
                            onFocus={onFocus}
                            onBlur={onBlur}
                            onChange={handleChange}
                            readOnly
                          />
                        </CCol>}
                  </CRow>
                  </CTabContent>
                  </CCard>
                </CContainer>
              )}
            {/* )} */}
              </CTabPane>
            </CContainer>
          </>
	      ) : (<AccessDeniedComponent />)}

   	    </>
      )}

    </>
  )
}

export default VehicleCurrentPosition
