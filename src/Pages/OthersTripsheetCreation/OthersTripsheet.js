/* eslint-disable prettier/prettier */
import {
  CAlert,
  CButton,
  CCard,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CFormTextarea,
  CInputGroup,
  CInputGroupText,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
  CTabContent,
  CTabPane,
  CTooltip,
} from '@coreui/react'
import { React, useEffect, useState } from 'react'
import useForm from 'src/Hooks/useForm.js'
import { Link, useNavigate } from 'react-router-dom'
import Loader from 'src/components/Loader'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import AccessDeniedComponent from 'src/components/commoncomponent/AccessDeniedComponent'
import JavascriptInArrayComponent from 'src/components/commoncomponent/JavascriptInArrayComponent'
import * as LogisticsProScreenNumberConstants from 'src/components/constants/LogisticsProScreenNumberConstants'
import DefinitionsListApi from 'src/Service/Definitions/DefinitionsListApi'
import RakeVendorMasterService from 'src/Service/RakeMovement/RakeMaster/RakeVendorMasterService'
import DivisionApi from 'src/Service/SubMaster/DivisionApi'
import DepartmentApi from 'src/Service/SubMaster/DepartmentApi'
import DocumentVerificationService from 'src/Service/DocsVerify/DocsVerifyService'
import DepartmentMasterComponent from 'src/components/MasterDropDownComponent/DepartmentMasterComponent'
import VehicleCapacityService from 'src/Service/SmallMaster/Vehicles/VehicleCapacityService'
import VehicleBodyTypeService from 'src/Service/SmallMaster/Vehicles/VehicleBodyTypeService'
import VehicleVarietyService from 'src/Service/SmallMaster/Vehicles/VehicleVarietyService'
import VehicleRequestMasterService from 'src/Service/VehicleRequest/VehicleRequestMasterService'
import Swal from 'sweetalert2'
import ShedListSearchSelect from 'src/components/commoncomponent/ShedListSearchSelect'
import ShedMasterService from 'src/Service/Master/ShedMasterService'
import VendorAvaiable from '../DocumentVerification/Segments/VendorAvaiable'
import VendorNotAvailable from '../DocumentVerification/Segments/VendorNotAvailable'
import PanDataService from 'src/Service/SAP/PanDataService'
import VehicleRequestsComponent from 'src/components/commoncomponent/VehicleRequestsComponent'
import OthersTripsheetValidation from 'src/Utils/TripSheetCreation/OthersTripsheetValidation'
import OthersVendorNotAvailable from '../DocumentVerification/Segments/OthersVendorNotAvailable'
import ParkingYardGateService from 'src/Service/ParkingYardGate/ParkingYardGateService'
import TripSheetCreationService from 'src/Service/TripSheetCreation/TripSheetCreationService'
import TripSheetInfoService from 'src/Service/PurchasePro/TripSheetInfoService'
import UserLoginMasterService from 'src/Service/Master/UserLoginMasterService'

const OthersTripsheet = () => {
  const formValues = {
    shedName: '',
    ot_adv_avail: '',
    ot_veh_insurence_valid: '',
    ot_dr_license_valid: '',
    ot_freight_calc: '',
    ot_vr_no: '',
    ot_veh_num: '',
    ot_dr_name: '',
    ot_dr_num: '',
    ot_veh_cap: '',
    ot_veh_body_type: '',
    ownerName: '',
    ownerMob: '',
    aadhar: '',
    bankAcc: '',
    ot_bank_adv: '',
    ot_diesel_adv: '',
    ot_freight_amount: '',
    ot_tot_freight_amount: '',
    ot_vr_purpose: '',
    ot_vr_product: '',
    ot_vr_req_contact_no: '',
    ot_vr_requester: '',
    ot_vr_from_location: '',
    ot_vr_to_location: '',
    ot_vr_datetime: '',
  }

  /*================== User Id & Location Fetch ======================*/
  const user_info_json = localStorage.getItem('user_info')
  const user_info = JSON.parse(user_info_json)
  const user_locations = []
  const navigation = useNavigate()

  console.log(user_info)

  /* Get User Locations From Local Storage */
  user_info.location_info.map((data, index) => {
    user_locations.push(data.id)
  })

  /* Get User Id From Local Storage */
  const user_id = user_info.user_id
  const user_emp_id = user_info.empid


  /* Get User Locations From Local Storage */
  const user_location_info = user_info.location_info

  var user_locations_id = ''
  user_location_info.map((data, index) => {
    user_locations_id = user_locations_id + data.id + ','
  })

  var lastIndex = user_locations_id.lastIndexOf(',')

  const userLocation = user_locations_id.substring(0, lastIndex)
  console.log(userLocation,'userLocation')

  var lastIndex_new = userLocation.lastIndexOf(',')
  const userLocation_new = userLocation.substring(lastIndex_new+1)
  console.log(userLocation_new,'userLocation_new')

  // console.log(user_locations)
  /*================== User Location Fetch ======================*/

  /* ==================== Access Part Start ========================*/
  const [screenAccess, setScreenAccess] = useState(false)
  let page_no = LogisticsProScreenNumberConstants.OtherModuleScreen.Others_Tripsheet
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

  const REQ = () => <span className="text-danger"> * </span>
  const [fetch, setFetch] = useState(false)
  const [submitBtn, setSubmitBtn] = useState(true)
  const [locationError, setLocationError] = useState(true)
  const [sapUnStoppedTripsheet, setSAPUnStoppedTripsheet] = useState(false)
  const [sapUnStoppedTripsheetData, setSAPUnStoppedTripsheetData] = useState([])
  const [errorModal, setErrorModal] = useState(false)
  const [error, setError] = useState({})
  const [panGroupData, setPanGroupData] = useState([])
  const [vendorCode, setVendorCode] = useState('0')

  const { values, errors, handleChangeOTS, onFocus, handleSubmit, onBlur, isTouched } = useForm(
    login,
    OthersTripsheetValidation,
    formValues
  )

  function login() {
    // alert('No Errors CallBack Called')
  }

  const [userData, setUserData] = useState([]) 
  useEffect(() => {
    UserLoginMasterService.getUser().then((res) => {
      let user_data = res.data.data
      // console.log(user_data)
      setUserData(user_data)
    })
  },[])

  const findUser = (id) => {
    let userName = ''
    if(id == '1') {
      userName = 'Admin'
    } else {
      userData.map((data,index)=>{
        if(data.user_id == id) {
          userName = data.username
        }
      })
    }
    return userName
  }

  const vehicle_type_find = (veh_type_id) => {
    console.log(veh_type_id, 'veh_type_id')
    if (veh_type_id == '1') {
      return 'OWN'
    } else if (veh_type_id == '2') {
      return 'CONTRACT'
    } else if (veh_type_id == '3') {
      return 'HIRE'
    }
  }

  const StopSAPEndCall = (e) => {
    setFetch(false)
    let SAPData = new FormData()
    SAPData.append('VEHICLE_NO', sapUnStoppedTripsheetData.parking__yard.vehicle_number)
    SAPData.append('VEHICLE_TYPE', vehicle_type_find(sapUnStoppedTripsheetData.parking__yard.vehicle_type_id))
    SAPData.append('TRIP_SHEET',sapUnStoppedTripsheetData.trip_sheet_no)
    SAPData.append('DRIVER_NAME',sapUnStoppedTripsheetData.parking__yard.driver_name)
    SAPData.append('DRIVER_CODE', '0' )
    SAPData.append('DRIVER_PH_NO',sapUnStoppedTripsheetData.parking__yard.driver_contact_number)
    //SAPData.append('DRIVER_NAME',driver_info_find('name'))
   // SAPData.append('DRIVER_CODE', driver_info_find('code') )
   // SAPData.append('DRIVER_PH_NO',driver_info_find('contact_no'))
    SAPData.append('Purpose', purpose_array[sapUnStoppedTripsheetData.purpose-1])
    SAPData.append('Division', sapUnStoppedTripsheetData.purpose == 3 || sapUnStoppedTripsheetData.purpose == 5 ? 'NLFD':  (sapUnStoppedTripsheetData.purpose == 4 ? '' : division_array[sapUnStoppedTripsheetData.to_divison-1]))
    SAPData.append('Stop_Flag', '4') 
    console.log(sapUnStoppedTripsheetData.trip_sheet_no)
    console.log(sapUnStoppedTripsheetData)
    console.log(sapUnStoppedTripsheetData.purpose)
    console.log(sapUnStoppedTripsheetData.to_divison)
    TripSheetInfoService.StartTSInfoToSAP(SAPData).then((response) => {
      console.log(response.data[0])
      if (response.data[0].STATUS == '1') {
        TripSheetCreationService.setSAPFlagAsStop(sapUnStoppedTripsheetData.trip_sheet_no,user_id).then((res) => {
          if (res.status == 200) {
              setFetch(true)
              toast.success('LP - SAP Stop Process Done Successfully!')
              // navigation('/OthersTripsheet')
              // setTimeout(() => {
              //   // window.location.reload(false)
              // }, 1000)
            } else {
              setFetch(true)
              toast.warning('LP - SAP Stop Proces Failed. Kindly contact admin.!')
              // navigation('/OthersTripsheet')
            }
          })
          .catch((errortemp) => {
            setFetch(true)
            var object = errortemp.response.data.errors
            var output = ''
            for (var property in object) {
              output += '*' + object[property] + '\n'
            }
            setError(output)
            setErrorModal(true)
          })
      } else {
        setFetch(true)
        toast.warning(
          'There is a Problem to sent Tripsheet Number to SAP. Kindly Contact Admin..!'
        )
        return false
      }
    })
    .catch((error) => {
      setFetch(true)
      toast.warning(error)
    })

  }
  const timeConvert = (x) => {
    var date = new Date(x)
    let dt = date.toLocaleDateString() 
    let time = date.toLocaleTimeString()
    let con_time = `${dt} ${time}`
    return con_time
  }
  const purpose_array = ['FG_SALES','FG_STO','RM_STO','OTHERS','FCI']
  const old_trip_purpose_array = ['','FG_SALES','FG_STO','RM_STO','OTHERS','FCI']
  const division_array = ['NLFD','NLCD']
  const previous_hire_tripsheet_status_array = [
    {id:'16',status:'Tripsheet Created'},
    {id:'17',status:'Tripsheet Cancelled'},
    {id:'21',status:'NLFD Shipment Cancelled'},
    {id:'22',status:'NLFD Shipment Completed'},
    {id:'24',status:'NLcD Shipment Cancelled'},
    {id:'25',status:'NLCD Shipment Completed'}, 
    {id:'18',status:'Advance Completed'},
    {id:'41',status:'Diesel Indent Approved'},
    {id:'26',status:'Expense Closure Completed'},
  ]
  const ptStatusFinder = (code) => {
    let s_code = ''
    previous_hire_tripsheet_status_array.map((gh,lh)=>{
      if(gh.id == code){
        s_code = gh.status
      }
    })
    return s_code
  }

  const [vendor, setVendor] = useState(false) // Vendor Available
  const [is_vr_admin, set_is_vr_admin] = useState(false)
  const [vehicleRequestAdminUsersData, setVehicleRequestAdminUsersData] = useState([])
  const [vrData, setVrData] = useState([])
  const [currentVrData, setCurrentVrData] = useState([])
  const [vrProductdata, setVrProductdata] = useState([])
  const [vrPurposedata, setVrPurposedata] = useState([])
  const [vehicleRequestAdminUsersArray, setVehicleRequestAdminUsersArray] = useState([])
  const [vehicleCapacity, setVehicleCapacity] = useState([])
  const [vehicleVariety, setVehicleVariety] = useState([])
  const [vehicleBody, setVehicleBody] = useState([])

  const [panData, setPanData] = useState({})
  const [readOnly, setReadOnly] = useState(true)
  const [write, setWrite] = useState(false)
  const [panNumbernew, setpanNumber] = useState('')
  const [vendorAddress, setVendorAddress] = useState('')
  const [vendorRemarks, setVendorRemarks] = useState('')

  const handleChangenewpan = event => {

    let panResult = event.target.value.toUpperCase()

    /* Validation */
    var regpan = /^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/;

    if (panResult.trim() == '') {
      errors.panNumber = 'Required'
    } else if (!regpan.test(panResult)) {
      errors.panNumber = 'Invalid Pan Format (Ex:ABCDE1234F)'
    } else {
      errors.panNumber = ''
    }

    setpanNumber(panResult)
    setPanData({})
  };

  const remarksHandleChange = (event,type) => {

    let result = event.target.value.toUpperCase()
    if(type == 1){
      setVendorAddress(result.trimStart())
    } else {
      setVendorRemarks(result.trimStart())
    }

  }

  useEffect(() => {

    let pan_data_length = Object.keys(panData).length

    /* Unit TS */
    let veh_no = !errors.ot_veh_num && values.ot_veh_num
    let veh_cap = !errors.ot_veh_cap && values.ot_veh_cap
    let dr_name = !errors.ot_dr_name && values.ot_dr_name
    let dr_no = !errors.ot_dr_num && values.ot_dr_num
    let veh_body = !errors.ot_veh_body_type && values.ot_veh_body_type
    let pan_no = !errors.panNumber && panNumbernew

    let owner_name = pan_data_length == 0 ? !errors.ownerName && values.ownerName : ( panData.J_1IPANNO == panNumbernew ? true : false)
    let owner_no = pan_data_length == 0 ? !errors.ownerMob && values.ownerMob : ( panData.J_1IPANNO == panNumbernew ? true : false)

    let ins_val = !errors.ot_veh_insurence_valid && values.ot_veh_insurence_valid
    let lic_val = !errors.ot_dr_license_valid && values.ot_dr_license_valid
    let shed = !errors.shedName && values.shedName

    let vr_no = currentProcessId == '2' ? !errors.ot_vr_no && values.ot_vr_no : (currentProcessId == '1' ? true : false)

    let fr_cal_md = !errors.ot_freight_calc && values.ot_freight_calc
    let fr_amt = !errors.ot_freight_amount && values.ot_freight_amount
    let fr_tot_amt = values.ot_freight_calc == '4' ? true : !errors.ot_tot_freight_amount && values.ot_tot_freight_amount
    let adv_val = is_vr_admin != '1' || (!errors.ot_adv_avail && values.ot_adv_avail)
    let bank_adv = values.ot_adv_avail == '0' || is_vr_admin != '1' ? true : !errors.ot_bank_adv && values.ot_bank_adv
    let diesel_adv = values.ot_adv_avail == '0' || is_vr_admin != '1' ? true : !errors.ot_diesel_adv && values.ot_diesel_adv

    let vr_pur = currentProcessId == '1' ? !errors.ot_vr_purpose && values.ot_vr_purpose : (currentProcessId == '2' ? true : false)
    let vr_pro = currentProcessId == '1' ? !errors.ot_vr_product && values.ot_vr_product : (currentProcessId == '2' ? true : false)
    let vr_from_loc = currentProcessId == '1' ? !errors.ot_vr_from_location && values.ot_vr_from_location : (currentProcessId == '2' ? true : false)
    let vr_to_loc = currentProcessId == '1' ? !errors.ot_vr_to_location && values.ot_vr_to_location : (currentProcessId == '2' ? true : false)
    let vr_req_by = currentProcessId == '1' ? !errors.ot_vr_requester && values.ot_vr_requester : (currentProcessId == '2' ? true : false)
    let vr_req_no = currentProcessId == '1' ? !errors.ot_vr_req_contact_no && values.ot_vr_req_contact_no : (currentProcessId == '2' ? true : false)
    let vr_date_time = currentProcessId == '1' ? !errors.ot_vr_datetime && values.ot_vr_datetime : (currentProcessId == '2' ? true : false)

    let condition_check = veh_no && veh_cap && dr_name && dr_no && veh_body && pan_no && owner_name && owner_no && ins_val && lic_val && shed && vr_no && fr_cal_md && fr_amt && fr_tot_amt && adv_val && bank_adv && diesel_adv && vr_pur && vr_pro && vr_from_loc && vr_to_loc && vr_req_by && vr_req_no && vr_date_time

    if(user_info.is_admin == 1){
      console.log(veh_no,'veh_no')
      console.log(veh_cap,'veh_cap')
      console.log(dr_name,'dr_name')
      console.log(dr_no,'dr_no')
      console.log(veh_body,'veh_body')
      console.log(pan_no,'pan_no')
      console.log(!errors.panNumber,'pan_no1')
      console.log(values.panNumber,'pan_no2')
      console.log(owner_name,'owner_name')
      console.log(owner_no,'owner_no')
      console.log(ins_val,'ins_val')
      console.log(lic_val,'lic_val')
      console.log(shed,'shed')
      console.log(vr_no,'vr_no')
      console.log(fr_cal_md,'fr_cal_md')
      console.log(fr_tot_amt,'fr_tot_amt')
      console.log(adv_val,'adv_val')
      console.log(bank_adv,'bank_adv')
      console.log(diesel_adv,'diesel_adv')
      console.log(vr_pur,'vr_pur')
      console.log(vr_pro,'vr_pro')
      console.log(vr_from_loc,'vr_from_loc')
      console.log(vr_to_loc,'vr_to_loc')
      console.log(vr_req_by,'vr_req_by')
      console.log(vr_req_no,'vr_req_no')
      console.log(vr_date_time,'vr_date_time')
      console.log(condition_check,'vb')
    }

    if (condition_check) {
      setSubmitBtn(false)
    } else {
      setSubmitBtn(true)
    }
  }, [values, errors, panNumbernew, panData])

  const freight_header = (type) => {
    let header_text = ''
    if(type == 1){
      header_text = 'Freight Per TON'
    } else if(type == 2){
      header_text = 'Freight Per KM'
    } else if(type == 3){
      header_text = 'Freight Per Trip'
    } else if(type == 4){
      header_text = 'Freight Amount'
    }
    return header_text
  }

  const onChange = (event) => {
    let shedId = event.value
    console.log(shedId,'shedId')
    if (shedId != '') {
      values.shedName = shedId

      ShedMasterService.getShedById(shedId).then((res) => {
        console.log(res.data.data)
        setShedMob(res.data.data.shed_owner_phone_1)
        setShedWhats(res.data.data.shed_owner_phone_2)
        setShed_Name1(res.data.data.shed_name)
        errors.shedName = ''
      })
     console.log(setShed_Name1)
    } else {
      values.shedName = ''
      setShedMob('')
      setShedWhats('')
      errors.shedName = 'Required'
      // console.log()
    }
  }

  useEffect(() => {
    if(vehicleRequestAdminUsersData.length > 0){
      let user_array = []
      let vr_admin = 0
      vehicleRequestAdminUsersData.map((vv,kk)=>{
        if(vv.definition_list_status == '1'){
          user_array.push(vv.definition_list_code)
        }
      })

      if(user_info.is_admin == 1 || JavascriptInArrayComponent(user_emp_id, user_array)){
        vr_admin = 1
      } else {
        vr_admin = 0
      }

      console.log(user_array,'user_array')
      console.log(vr_admin,'vr_admin')

      // vr_admin == 1 ? set_is_vr_admin(true) : set_is_vr_admin(false)

      if(vr_admin == 1){
        set_is_vr_admin(true)
      } else {
        set_is_vr_admin(false)
        values.ot_adv_avail = 0
      }
      setVehicleRequestAdminUsersArray(user_array)
    }

  }, [vehicleRequestAdminUsersData])

  const ColoredLine = ({ color }) => (
    <hr
        style={{
            color: color,
            backgroundColor: color,
            height: 5
        }}
    />
  )

  const veh_variety_finder = (variety) => {
    let vari = ''
    if(vehicleVariety.length > 0){
      vehicleVariety.map((vv,kk)=>{
        if(variety == vv.id){
          vari = vv.vehicle_variety
        }
      })
    }
    return vari
  }

  const veh_capacity_finder = (capacity) => {
    let cap = ''
    if(vehicleCapacity.length > 0){
      vehicleCapacity.map((vv,kk)=>{
        if(capacity == vv.id){
          cap = vv.capacity
        }
      })
    }
    return cap
  }

  const veh_body_finder = (body) => {
    let bod = ''
    if(vehicleBody.length > 0){
      vehicleBody.map((vv,kk)=>{
        if(body == vv.id){
          bod = vv.body_type
        }
      })
    }
    return bod
  }

  const div_finder = (division) => {
    let div = ''
    if(divisionData.length > 0){
      divisionData.map((vv,kk)=>{
        if(division == vv.id){
          div = vv.division
        }
      })
    }
    return div
  }

  const purp_finder = (purpose) => {
    let purp = ''
    if(vrPurposedata.length > 0){
      vrPurposedata.map((vv1,kk1)=>{
        if(purpose == vv1.definition_list_code){
          purp = vv1.definition_list_name
        }
      })
    }
    return purp
  }

  const dep_finder = (department) => {
    let dep = ''
    if(departmentData.length > 0){
      departmentData.map((vv,kk)=>{
        if(department == vv.id){
          dep = vv.department
        }
      })
    }
    return dep
  }

  const prod_finder = (product) => {
    let dep = ''
    if(vrProductdata.length > 0){
      vrProductdata.map((vv,kk)=>{
        if(product == vv.definition_list_code){
          dep = vv.definition_list_name
        }
      })
    }
    return dep
  }

  useEffect(() => {

    /* section for getting VR Lists from database */
    VehicleRequestMasterService.getVehicleRequests().then((res)=>{

      let vrList = res.data.data
      console.log(vrList,'getVehicleRequests')
      let filterData =  vrList.filter(
        (data) => data.vr_tr_no == null
      )
      console.log(filterData,'getVehicleRequests-filterData')
      setVrData(filterData)
    })

    /* section for getting Vehicle Requests Admin User Lists from database */
    DefinitionsListApi.visibleDefinitionsListByDefinition(28).then((response) => {

      let viewData = response.data.data
      console.log(viewData,'Vehicle Requests Admin User Lists')
      setVehicleRequestAdminUsersData(viewData)
    })

    //section for getting vehicle capacity from database
    VehicleCapacityService.getVehicleCapacity().then((res) => {
      setVehicleCapacity(res.data.data)
    })

    VehicleBodyTypeService.getVehicleBody().then((res) => {
      setVehicleBody(res.data.data)
    })

    //section for getting vehicle variety from database
    VehicleVarietyService.getVehicleVariety().then((res) => {
      setVehicleVariety(res.data.data)
    })

 }, [])

  const [divisionData, setDivisionData] = useState([])
  const [departmentData, setDepartmentData] = useState([])

  useEffect(() => {

    /* section for getting Division Data from database */
    DivisionApi.getDivision().then((rest) => {

      let tableData = rest.data.data
      console.log(tableData)
      setDivisionData(tableData)
    })

    /* section for getting Department Data from database */
    DepartmentApi.getDepartment().then((rest) => {
      setFetch(true)
      let tableData = rest.data.data
      console.log(tableData)
      setDepartmentData(tableData)
    })

    /* section for getting VR Purpose Lists from database */
    DefinitionsListApi.visibleDefinitionsListByDefinition(29).then((response) => {

      let viewData = response.data.data
      console.log(viewData,'VR Purpose Lists')
      setVrPurposedata(viewData)
    })

    /* section for getting VR Product Lists from database */
    DefinitionsListApi.visibleDefinitionsListByDefinition(30).then((response) => {

      let viewData = response.data.data
      console.log(viewData,'VR Product Lists')
      let filter_Data =  viewData.filter(
        (data) => data.definition_list_status == 1
      )
      console.log(filter_Data,'VR Product Lists - filter_Data')
      setVrProductdata(filter_Data)
    })

  }, [])

  const OthersDivisionArray = ['','NLFD','NLFA','NLDV','NLMD','NLLD','NLCD','NLIF','NLSD']

  const [vehicleVendors, setVehicleVendors] = useState([])

  // GET ALL VENDOR DATA FOR THE VEHICLE NO
  useEffect(() => {
    if(values.ot_veh_num.trim() != ''){
      // section for getting Vehicle's Vendor Details from database
      DocumentVerificationService.getVehicleVendorDetails(values.ot_veh_num).then((res) => {
        if(res.status == '200'){
          console.log(res.data.data,'getVehicleVendorDetails')
          setVehicleVendors(res.data.data)
        } else {
          setVehicleVendors([])
        }

      })
    }

  }, [values.ot_veh_num])


  useEffect(() => {
    if(values.ot_adv_avail !== '1'){
      values.ot_bank_adv = ''
      values.ot_diesel_adv = ''
    }
    if(values.ot_freight_calc == '4'){
      values.ot_tot_freight_amount = ''
    }

  }, [values.ot_adv_avail, values.ot_freight_calc])

  useEffect(()=>{
    if(values.ot_vr_no != ''){
      vrData.map((vb,kb)=>{
        if(vb.vr_id == values.ot_vr_no){
          setCurrentVrData(vb)
        }
      })
    } else {
      setCurrentVrData([])
    }
  },[values.ot_vr_no])

  const checkOthersTripsheetValidation = () => {
    setFetch(false)
    ParkingYardGateService.checkTripAvailability(values.ot_veh_num).then((res) => {
      let response_data = res.data
      console.log(response_data,'checkTripAvailability')
      setFetch(true)
      // return false
      if(response_data.vehicle_already_exists == '1' && response_data.previous_trip_completed == '0'){
        toast.warning('Truck Already inProcess. Cannot make next trip.')
        return false
      } else if(response_data.vehicle_already_exists == '1' && response_data.already_regular_ts_completed == '1' && response_data.already_others_ts_completed == '1'){
        toast.warning(`Tripsheet Cannot be created because of Vehicle Already have ${response_data.OVERALL_OPEN_TRIPSHEET_COUNT} Open Tripsheets.`)
        return false
      } else if(response_data.vehicle_already_exists == '1' && response_data.already_others_ts_completed == '1'){
        toast.warning(`Tripsheet Cannot be created because of Vehicle Already have ${response_data.OTHERS_OPEN_TRIPSHEET_COUNT} Open Others Tripsheets.`)
        return false
      } else if(response_data.vehicle_already_exists == '1' && response_data.sap_stop_process == '2'){
        setSAPUnStoppedTripsheet(true)
        setSAPUnStoppedTripsheetData(response_data.sap_unstop_data)
        // toast.warning('Previous Trip SAP Stop Process should be completed. Kindly contact Admin.')
        return false
      } else {
        createOthersTripsheet()
      }

    })
  }

  function createOthersTripsheet() {

    let pan_data_length = Object.keys(panData).length

    if(user_info.is_admin == 1){

      console.log('shedName',values.shedName)
      console.log('ot_adv_avail',values.ot_adv_avail)
      console.log('ot_veh_insurence_valid',values.ot_veh_insurence_valid)
      console.log('ot_dr_license_valid',values.ot_dr_license_valid)
      console.log('ot_freight_calc',values.ot_freight_calc)
      console.log('ot_vr_no',values.ot_vr_no)
      console.log('ot_veh_num',values.ot_veh_num)
      console.log('ot_dr_name',values.ot_dr_name)
      console.log('ot_dr_num',values.ot_dr_num)
      console.log('ot_veh_cap',values.ot_veh_cap)
      console.log('ot_veh_body_type',values.ot_veh_body_type)
      console.log('ownerName',values.ownerName)
      console.log('ownerMob',values.ownerMob)
      console.log('aadhar',values.aadhar)
      console.log('bankAcc',values.bankAcc)
      console.log('ot_bank_adv',values.ot_bank_adv)
      console.log('ot_diesel_adv',values.ot_diesel_adv)
      console.log('ot_freight_amount',values.ot_freight_amount)
      console.log('ot_tot_freight_amount',values.ot_tot_freight_amount)
      console.log('ot_vr_purpose',values.ot_vr_purpose)
      console.log('ot_vr_product',values.ot_vr_product)
      console.log('ot_vr_req_contact_no',values.ot_vr_req_contact_no)
      console.log('ot_vr_requester',values.ot_vr_requester)
      console.log('ot_vr_from_location',values.ot_vr_from_location)
      console.log('ot_vr_to_location',values.ot_vr_to_location)
      console.log('ot_vr_datetime',values.ot_vr_datetime)
      console.log('pannumber',panNumbernew)
      console.log('pandata',panData)
      console.log('pan_data_length',pan_data_length)
      console.log('v_remarks', vendorRemarks)
      console.log('created_by', user_id)
    }

    let vendor_existing = 1
    let vendor_already_created = 0
    vehicleVendors.map((vc,kc)=>{
      if(panNumbernew == vc.pan_card_number){
        vc.vendor_code == 0 ? vendor_existing = 0 : vendor_already_created = 1
      }
    })

    if(vendor_existing == 0 && vendor_already_created == 0){
      toast.error('Vendor Creation Process Already Pending.. So Kindly Go and Complete the Vendor creation Process..')
      return false
    }

    if (isTouched.panNumbernew && !panNumbernew) {
      toast.warning('Pan Number Required')
      return false

    } else if (isTouched.panNumbernew && !/^[A-Z]{5}[\d]{4}[A-Z]{1}$/.test(panNumbernew)) {
      toast.warning('PAN NUMBER Must Like "CRCPK0712L"')
      return false
    }

    const formData = new FormData()
    const formDataPYG = new FormData()
    const formDataDVC = new FormData()
    const formDataSAPTSC = new FormData()
    const formDataTSC = new FormData()

    /* PYG Form Elements */
    formDataPYG.append('action_type', 1)
    formDataPYG.append('vr_type', currentProcessId)
    formDataPYG.append('vehicle_type_id', 3)
    formDataPYG.append('vehicle_number',values.ot_veh_num)
    formDataPYG.append('driver_name',values.ot_dr_name)
    formDataPYG.append('driver_contact_number',values.ot_dr_num)
    formDataPYG.append('vehicle_capacity_id',values.ot_veh_cap)
    formDataPYG.append('vehicle_body_type_id',values.ot_veh_body_type)
    formDataPYG.append('remarks', vendorRemarks)
    formDataPYG.append('created_by', user_id)
    formDataPYG.append('vehicle_location_id', user_info.is_admin == 1 ? 1 : userLocation_new)

    /* VR Form Elements */
    formDataPYG.append('vr_no', currentProcessId == 1 ? 0: currentVrData.vr_no)
    formDataDVC.append('vr_no', currentProcessId == 1 ? 0: currentVrData.vr_no)
    formDataTSC.append('vr_no', currentProcessId == 1 ? 0: currentVrData.vr_no)

    /* DV Form Elements */
    formDataDVC.append('shed_id',values.shedName)
    formDataDVC.append('insurance_validity',values.ot_veh_insurence_valid)
    formDataDVC.append('freight_rate_per_ton',values.ot_freight_amount)
    formDataDVC.append('remarks',  vendorRemarks ? vendorRemarks : 'NO REMARKS')
    formDataDVC.append('created_by', user_id)
    formDataDVC.append('vendor_status',1)
    formDataDVC.append('document_status',1)
    formDataDVC.append('pan_card_number',panNumbernew)

    if(pan_data_length != 0 && panData.J_1IPANNO == panNumbernew){
      formDataDVC.append('vendor_code', panData.LIFNR)
      formDataDVC.append('owner_name', panData.NAME1)
      formDataDVC.append('owner_number', panData.TELF1)
      formDataDVC.append('aadhar_card_number', panData.IDNUMBER)
      formDataDVC.append('bank_acc_number', panData.BANKN)
      formDataDVC.append('gst_tax_code', WITHT)
    } else {
      formDataDVC.append('vendor_code', 0)
      formDataDVC.append('owner_name', values.ownerName)
      formDataDVC.append('owner_number', values.ownerMob)
      formDataDVC.append('aadhar_card_number', values.aadhar || '')
      formDataDVC.append('bank_acc_number', values.bankAcc || '')
      formDataDVC.append('gst_tax_code', '')
    }

    /* TSC Form Elements */
    formDataTSC.append('ot_vr_datetime',values.ot_vr_datetime)
    formDataTSC.append('vehicle_type_id', 3)
    formDataTSC.append('vehicle_location_id', user_info.is_admin == 1 ? 1 : userLocation_new)
    formDataTSC.append('trip_advance_eligiblity', values.ot_adv_avail)
    formDataTSC.append('advance_amount', values.ot_bank_adv)
    formDataTSC.append('purpose', 4)
    formDataTSC.append('expected_date_time', values.ot_vr_datetime)
    formDataTSC.append('freight_rate_per_tone', values.ot_freight_amount)
    formDataTSC.append('others_freight_calc_type', values.ot_freight_calc)
    formDataTSC.append('others_total_freight', values.ot_tot_freight_amount)
    formDataTSC.append('advance_payment_diesel', values.ot_diesel_adv)
    formDataTSC.append('remarks', vendorRemarks ? vendorRemarks : '')
    formDataTSC.append('created_by', user_id)
    formDataTSC.append('first_vr_id', currentProcessId == 1 ? 0 : currentVrData.vr_id)
    formDataTSC.append('vehicle_request_no', currentProcessId == 1 ? 0: currentVrData.vr_no)

    /* VR Form Elements */
    formData.append('vr_division', user_info.division_info.id)
    formData.append('vr_dept', user_info.department_info.id)
    formData.append('vr_purpose', values.ot_vr_purpose)
    formData.append('vr_prod', values.ot_vr_product)
    formData.append('vr_from_loc', values.ot_vr_from_location)
    formData.append('vr_to_loc', values.ot_vr_to_location)
    formData.append('request_by', values.ot_vr_requester)
    formData.append('contact_no', values.ot_vr_req_contact_no)
    formData.append('vr_capacity_id', values.ot_veh_cap)
    formData.append('vr_body_id', values.ot_veh_body_type)
    formData.append('vr_require_time', values.ot_vr_datetime)
    formData.append('vr_status', 1)
    formData.append('veh_remarks', vendorRemarks)
    formData.append('created_by', user_id)

    setFetch(false)
    if(currentProcessId == '1'){ /* By Unit */
      VehicleRequestMasterService.createVehicleRequest(formData).then((res) => {
        let lp_vr_no = res.data.vehicle_request_no
        let lp_vr_id = res.data.vehicle_request_id
        if (res.status == 200) {

          toast.success(`VR Number (${lp_vr_no}) generated Successfully..`)

          if(currentProcessId == 1){
            /* VR Form Elements */
            formDataPYG.append('vr_no', lp_vr_no)
            formDataDVC.append('vr_no', lp_vr_no)
            formDataTSC.append('vr_no', lp_vr_no)
            formDataTSC.append('vehicle_request_no', lp_vr_no)
            formDataTSC.append('first_vr_id', lp_vr_id)
          }

          ParkingYardGateService.CreateOtherTripsheetPYG(formDataPYG).then((res) => {

            console.log('CreateOtherTripsheet-response', res)
            let pyg_response_row = res.data.data

            if (res.status == 200) {
              toast.success('Vehicle and Driver Details verified..')

              formDataDVC.append('vehicle_id',pyg_response_row.vehicle_id)
              formDataTSC.append('vehicle_id',pyg_response_row.vehicle_id)
              formDataDVC.append('parking_id',pyg_response_row.parking_yard_gate_id)
              formDataTSC.append('parking_id',pyg_response_row.parking_yard_gate_id)

              ParkingYardGateService.CreateOtherTripsheetDVC(formDataDVC).then((res) => {

                if (res.status == 200 || res.status == 204) {
                  res.status == 200 ? toast.success('Vendor Document verified for New Vendor..') : toast.success('Vendor Document Verified for Existing Vendor..')
                  // return false

                  /* SAP Tripsheet Flag Form Elements */
                  formDataSAPTSC.append('vehicle_type_id', 3)
                  formDataSAPTSC.append('vehicle_location_id',pyg_response_row.vehicle_location_id)

                  // Tripsheet Info - SAP Service Start
                    ParkingYardGateService.getOthersTripSheetNo(formDataSAPTSC).then((res) => {
                      let tripsheet_no = res.data.ts_no
                      let SAPData = new FormData()
                      formDataTSC.append('tripsheet_no', tripsheet_no)
                      SAPData.append('TRIP_SHEET',tripsheet_no)
                      SAPData.append('VEHICLE_NO', values.ot_veh_num)
                      SAPData.append('VEHICLE_TYPE', 'HIRE')
                      SAPData.append('VEHICLE_NAME', '')
                      SAPData.append('DRIVER_NAME', values.ot_dr_name)
                      SAPData.append('DRIVER_PH_NO', values.ot_dr_num)
                      SAPData.append('DRIVER_CODE', '')
                      SAPData.append('Purpose','OTHERS')
                      SAPData.append('DIVISION', OthersDivisionArray[user_info.division_info.id] ? OthersDivisionArray[user_info.division_info.id] : '')
                      SAPData.append('TRUCK_CAPACITY', '')
                      SAPData.append('Insert_Flag', '1')

                      TripSheetInfoService.StartTSInfoToSAP(SAPData).then((response) => {
                        console.log("SAP Data pass ")
                        console.log(response)
                        console.log(response.data)
                        let sap_status = response.data[0].STATUS
                        console.log(sap_status)
                        if (sap_status == '1') {
                          toast.success('Trip Details sent to SAP..')

                          console.log("SAP Response Start ")
                          console.log(sap_status)
                          console.log("SAP Response End ")
                          formDataTSC.append('sap_flag',sap_status)
                          console.log(formDataTSC)

                          ParkingYardGateService.CreateOtherTripsheetTSC(formDataTSC).then((res) => {

                            console.log("response.data")
                            if (res.status == 200) {
                              setFetch(true)
                              Swal.fire({
                                title: 'Tripsheet Created Successfully!',
                                icon: "success",
                                text:  'Tripsheet No : ' + tripsheet_no,
                                confirmButtonText: "OK",
                              }).then(function () {
                                window.location.reload(false)
                              });

                            } else if (res.status == 201) {
                              setFetch(true)
                              Swal.fire({
                                title: res.data.message,
                                icon: "warning",
                                confirmButtonText: "OK",
                              }).then(function () {
                                // window.location.reload(false)
                              })
                            } else {
                              setFetch(true)
                              toast.warning('Others Process Tripsheet Creation Failed. Kindly contact Admin..!')
                            }
                          })
                          .catch((error) => {
                            setFetch(true)
                            toast.warning(error)
                          })
                        } else {
                          setFetch(true)
                          toast.warning(response.data[0].MESSAGE+'. Kindly Contact Admin..!'
                          )
                          return false
                        }
                      })
                      .catch((error) => {
                        setFetch(true)
                        toast.warning(error)
                      })
                    })
                    .catch((error) => {
                      setFetch(true)
                      toast.warning(error)
                    })
                  //Tripsheet Info - SAP End


                } else if (res.status == 201) {
                  setFetch(true)
                  Swal.fire({
                    title: res.data.message,
                    icon: "warning",
                    confirmButtonText: "OK",
                  }).then(function () {
                    // window.location.reload(false)
                  })
                } else {
                  setFetch(true)
                  toast.warning('Others Process Tripsheet Creation Failed. Kindly contact Admin..!')
                }
              })
              .catch((err) => {
                setFetch(true)
                toast.warning(err)
              })

            } else if (res.status == 201) {
              setFetch(true)
              Swal.fire({
                title: res.data.message,
                icon: "warning",
                confirmButtonText: "OK",
              }).then(function () {
                // window.location.reload(false)
              })
            } else {
              setFetch(true)
              toast.warning('Others Process Tripsheet Creation Failed. Kindly contact Admin..!')
            }

          })
          .catch((error) => {
            console.log(error,'error')
            setFetch(true)
            var object = error.response.data.errors
            var output = ''
            for (var property in object) {
              output += '*' + object[property] + '\n'
            }
            setError(output)
            setErrorModal(true)
          })

        } else if (res.status == 201) {
          Swal.fire({
            title: res.data.message,
            icon: "warning",
            confirmButtonText: "OK",
          }).then(function () {
            // window.location.reload(false)
          })
        } else {
          toast.warning('`VR Number Creation Failed. Kindly contact Admin..!')
        }

      })
      .catch((error) => {
        console.log(error,'error')
        setFetch(true)
        var object = error.response.data.errors
        var output = ''
        for (var property in object) {
          output += '*' + object[property] + '\n'
        }
        setError(output)
        setErrorModal(true)
      })

    } else if(currentProcessId == '2'){ /* By Vehicle Request */

      ParkingYardGateService.CreateOtherTripsheetPYG(formDataPYG).then((res) => {

        console.log('CreateOtherTripsheet-response', res)
        let pyg_response_row = res.data.data

        if (res.status == 200) {
          toast.success('Vehicle and Driver Details verified..')

          formDataDVC.append('vehicle_id',pyg_response_row.vehicle_id)
          formDataTSC.append('vehicle_id',pyg_response_row.vehicle_id)
          formDataDVC.append('parking_id',pyg_response_row.parking_yard_gate_id)
          formDataTSC.append('parking_id',pyg_response_row.parking_yard_gate_id)

          ParkingYardGateService.CreateOtherTripsheetDVC(formDataDVC).then((res) => {

            if (res.status == 200 || res.status == 204) {
              res.status == 200 ? toast.success('Vendor Document verified for New Vendor..') : toast.success('Vendor Document Verified for Existing Vendor..')
              // return false

              /* SAP Tripsheet Flag Form Elements */
              formDataSAPTSC.append('vehicle_type_id', 3)
              formDataSAPTSC.append('vehicle_location_id',pyg_response_row.vehicle_location_id)

              // Tripsheet Info - SAP Service Start
                  ParkingYardGateService.getOthersTripSheetNo(formDataSAPTSC).then((res) => {
                  let tripsheet_no = res.data.ts_no
                  let SAPData = new FormData()
                  formDataTSC.append('tripsheet_no', tripsheet_no)
                  SAPData.append('TRIP_SHEET',tripsheet_no)
                  SAPData.append('VEHICLE_NO', values.ot_veh_num)
                  SAPData.append('VEHICLE_TYPE', 'HIRE')
                  SAPData.append('VEHICLE_NAME', '')
                  SAPData.append('DRIVER_NAME', values.ot_dr_name)
                  SAPData.append('DRIVER_PH_NO', values.ot_dr_num)
                  SAPData.append('DRIVER_CODE', '')
                  SAPData.append('PURPOSE','OTHERS') 
                  SAPData.append('DIVISION', OthersDivisionArray[currentVrData.vr_division] ? OthersDivisionArray[currentVrData.vr_division] : '')
                  SAPData.append('TRUCK_CAPACITY', '')
                  SAPData.append('Insert_Flag', '1')

                  TripSheetInfoService.StartTSInfoToSAP(SAPData).then((response) => {
                    console.log("SAP Data pass ")
                    console.log(response)
                    console.log(response.data)
                    let sap_status = response.data[0].STATUS
                    console.log(sap_status)
                    if (sap_status == '1') {
                      toast.success('Trip Details sent to SAP..')

                      console.log("SAP Response Start ")
                      console.log(sap_status)
                      console.log("SAP Response End ")
                      formDataTSC.append('sap_flag',sap_status)
                      console.log(formDataTSC)

                      ParkingYardGateService.CreateOtherTripsheetTSC(formDataTSC).then((res) => {

                        console.log("response.data")
                        if (res.status == 200) {
                          setFetch(true)
                          Swal.fire({
                            title: 'Tripsheet Created Successfully!',
                            icon: "success",
                            text:  'Tripsheet No : ' + tripsheet_no,
                            confirmButtonText: "OK",
                          }).then(function () {
                            window.location.reload(false)
                          });

                        } else if (res.status == 201) {
                          setFetch(true)
                          Swal.fire({
                            title: res.data.message,
                            icon: "warning",
                            confirmButtonText: "OK",
                          }).then(function () {
                            // window.location.reload(false)
                          })
                        } else {
                          setFetch(true)
                          toast.warning('Others Process Tripsheet Creation Failed. Kindly contact Admin..!')
                        }
                      })
                      .catch((error) => {
                        setFetch(true)
                        toast.warning(error)
                      })
                    } else {
                      setFetch(true)
                      toast.warning(response.data[0].MESSAGE+'. Kindly Contact Admin..!'
                      )
                      return false
                    }
                  })
                  .catch((error) => {
                    setFetch(true)
                    toast.warning(error)
                  })
                })
                .catch((error) => {
                  setFetch(true)
                  toast.warning(error)
                })
              //Tripsheet Info - SAP End


            } else if (res.status == 201) {
              setFetch(true)
              Swal.fire({
                title: res.data.message,
                icon: "warning",
                confirmButtonText: "OK",
              }).then(function () {
                // window.location.reload(false)
              })
            } else {
              setFetch(true)
              toast.warning('Others Process Tripsheet Creation Failed. Kindly contact Admin..!')
            }
          })
          .catch((err) => {
            setFetch(true)
            toast.warning(err)
          })

        } else if (res.status == 201) {
          setFetch(true)
          Swal.fire({
            title: res.data.message,
            icon: "warning",
            confirmButtonText: "OK",
          }).then(function () {
            // window.location.reload(false)
          })
        } else {
          setFetch(true)
          toast.warning('Others Process Tripsheet Creation Failed. Kindly contact Admin..!')
        }

      })
      .catch((error) => {
        console.log(error,'error')
        setFetch(true)
        var object = error.response.data.errors
        var output = ''
        for (var property in object) {
          output += '*' + object[property] + '\n'
        }
        setError(output)
        setErrorModal(true)
      })
    }

  }

  const [headEnable, setHeadEnable] = useState(true)
  const [currentProcessId, setCurrentProcessId] = useState(0)
  const [shedMob, setShedMob] = useState('')
  const [shedWhats, setShedWhats] = useState('')
  const [shed_Name1, setShed_Name1] = useState('')
  const [WITHT, setWITHT] = useState('')

   // ASSIGN SINGLE SHED DATA VALUE
   useEffect(() => {
    if (values.shedName != '0') {
      //fetch Shed mobile number , whatsapp Number from Shed Master

      ShedMasterService.getShedById(values.shedName).then((res) => {
        console.log(res.data.data)
        setShedMob(res.data.data.shed_owner_phone_1)
        setShedWhats(res.data.data.shed_owner_phone_2)
        setShed_Name1(res.data.data.shed_name)
      })
    } else {
      setShedMob('')
      setShedWhats('')
      setShed_Name1('')
    }
  }, [values.shedName])

  const assignValues = (id) => {
    console.log(id,'assignValues-id')
    if(id !=0){
      setHeadEnable(false)
    }
    setCurrentProcessId(id)
  }

  const clearValues = () => {
    setCurrentProcessId(0)
    setHeadEnable(true)
    values.ot_veh_num = ''
    values.ot_veh_cap = ''
    values.ot_dr_name = ''
    values.ot_dr_num = ''
    values.ot_veh_body_type = ''
    values.panNumber = ''
    values.ownerName = ''
    values.ownerMob = ''
    values.aadhar = ''
    values.bankAcc = ''
    values.ot_veh_insurence_valid = ''
    values.ot_dr_license_valid = ''
    values.shedName = ''
    values.ot_vr_no = ''
    values.ot_freight_calc = ''
    values.ot_freight_amount = ''
    values.ot_adv_avail = ''
    values.ot_tot_freight_amount = ''
    values.ot_bank_adv = ''
    values.ot_diesel_adv = ''
    values.ot_vr_product = ''
    values.ot_vr_purpose = ''
    values.ot_vr_req_contact_no = ''
    values.ot_vr_requester = ''
    values.ot_vr_from_location = ''
    values.ot_vr_to_location = ''
    values.ot_vr_datetime = ''
    setVendorRemarks('')
    errors.ot_veh_num = ''
    errors.ot_veh_cap = ''
    errors.ot_dr_name = ''
    errors.ot_dr_num = ''
    errors.ot_veh_body_type = ''
    errors.panNumber = ''
    errors.ownerName = ''
    errors.ownerMob = ''
    errors.aadhar = ''
    errors.bankAcc = ''
    errors.ot_veh_insurence_valid = ''
    errors.ot_dr_license_valid = ''
    errors.shedName = ''
    errors.ot_vr_no = ''
    errors.ot_freight_calc = ''
    errors.ot_freight_amount = ''
    errors.ot_adv_avail = ''
    errors.ot_tot_freight_amount = ''
    errors.ot_bank_adv = ''
    errors.ot_diesel_adv = ''
    errors.ot_vr_product = ''
    errors.ot_vr_purpose = ''
    errors.ot_vr_req_contact_no = ''
    errors.ot_vr_requester = ''
    errors.ot_vr_from_location = ''
    errors.ot_vr_to_location = ''
    errors.ot_vr_datetime = ''
    setpanNumber('')
    setShedMob('')
    setShedWhats('')
    setShed_Name1('')
  }

  // GET PAN DETAILS FROM SAP
  const getPanData = (e) => {
    e.preventDefault()
    // PanDataService.getPanData(panNumbernew).then((res) => {
    //   if (res.status == 200 && res.data != '') {
    //     setVendor(true)
    //     setPanData(res.data[0])
    //     setWITHT(res.data[0].WITHT)
    //     toast.success('Pan Details Detected!')
    //   } else {
    //     toast.warning('No Pan Details Detected! Fill Up The Fields')
    //     setVendor(false)
    //   }
    // })
    if (!panNumbernew || panNumbernew == '') {
      // setFetch(true)
      toast.warning('Pan Number Required')
      return false
    }

    if (!/^[A-Z]{5}[\d]{4}[A-Z]{1}$/.test(panNumbernew)) {
      // setFetch(true)
      toast.warning('PAN NUMBER Must Like "CRCPK0712L"')
      return false
    }
    console.log(panNumbernew,'panNumbernew')
    console.log(errors.panNumber,'panNumbernew22')
    // if(panNumbernew && errors.panNumber)
    PanDataService.getMultiVendorInfoByPan(panNumbernew).then((res) => {
      console.log(res.data,'getPanData-panResult')
      if (res.status == 200 && res.data != '') {
        setVendor(true)
        // setPanData(res.data[0])
        setPanGroupData(res.data)
        setWITHT(res.data[0].WITHT)
        toast.success('Pan Details Detected!')
      } else {
        toast.warning('No Pan Details Detected! Fill Up The Fields')
        setPanGroupData([])
        setVendor(false)
      }
    })

    setReadOnly(true)
    setWrite(true)
  }

  const getPanChildData = (e) => {
    e.preventDefault()
    let res = e.target.value
    setVendorCode(res)

    panGroupData.map((vv,kk)=>{
      if(vv.LIFNR == res){
        console.log(vv,'getPanChildData')
        setPanData(vv)
        // setTDS(vv.WITHT)
        // setErrorsTdsType('')
      }
    })
    if(res == 0){
      // setErrorsTdsType('Required')
      // setTDS('0')
      setPanData({})
    }
  }

  const vendorClear = () => {
    setpanNumber('')
    setPanGroupData([])
    setPanData({})
    // setTDS('0')
    // setErrorsTdsType('')
    setVendorCode('0')
    setVendor(false)
  }

  return (
    <>
      {!fetch && <Loader />}

      {fetch && (
        <>
          {screenAccess ? (
            <>
              <CCard>

                <CTabContent>
                  {headEnable && (
                    <CRow className="mt-3">
                      <CCol xs={12} md={6}>
                        <div className="p-3">
                          <CInputGroup className="mb-3">
                            <CInputGroupText component="label" htmlFor="inputGroupSelect01">
                              Others Tripsheet Creation Type
                            </CInputGroupText>

                            <CFormSelect
                              id="inputGroupSelect01"
                              onchange
                              onChange={(e) => {
                                assignValues(e.target.value)
                              }}
                              value={currentProcessId}
                            >
                              <option value={0}>Select...</option>
                              {/* <option value={1}> By Unit</option> */}
                              {/* Option Restriction for NLLD Division (5) Members */}
                              {user_info && user_info.division_info && user_info.division_info.id != 5 && (<option value={1}> By Unit</option>)} 
                              {is_vr_admin == 1 && (<option value={2}> By Vehicle Request</option>)}  
                            </CFormSelect>
                            <CTooltip
                              content="Page Refresh"
                              placement="top"
                            >
                              <CButton
                                size="s-lg"
                                // color="warning"
                                className="m-1 text-white"
                                onClick={() => {
                                  window.location.reload(false)
                                }}
                                type="button"
                              >
                                {/* Refresh */}
                                <span className="float-start">
                                  <i className="fa fa-refresh" aria-hidden="true"></i>
                                </span>
                              </CButton>
                            </CTooltip>
                          </CInputGroup>
                        </div>
                      </CCol>
                    </CRow>
                  )}
                  <CTabPane role="tabpanel" aria-labelledby="home-tab" visible={currentProcessId != 0}>
                    <CForm className="row g-3 m-2 p-1" onSubmit={handleSubmit}>
                      <CRow className="mb-md-1">
                        {currentProcessId == '2' && (
                          <>
                            <CRow key={`HireshipmentData1`} className="mt-2" hidden>
                              <CCol xs={12} md={3}>
                                <CFormLabel
                                  htmlFor="inputAddress"
                                  style={{
                                    backgroundColor: '#4d3227',
                                    color: 'white',
                                  }}
                                >
                                  Vehicle Request Details
                                </CFormLabel>
                              </CCol>
                            </CRow>
                            <CCol xs={12} md={3}>
                              <CFormLabel htmlFor="ot_vr_no">
                                Vehicle Request No <REQ />{' '}
                                {errors.ot_vr_no && (
                                  <span className="small text-danger">{errors.ot_vr_no}</span>
                                )}
                              </CFormLabel>
                              <CFormSelect
                                size="sm"
                                name="ot_vr_no"
                                onChange={handleChangeOTS}
                                onFocus={onFocus}
                                value={values.ot_vr_no}
                                className={`mb-1 ${errors.ot_vr_no && 'is-invalid'}`}
                                aria-label="Small select example"
                                id="ot_vr_no"
                              >
                                <option value="">Select ...</option>
                                {vrData.map(({ vr_id, vr_no, vr_division, vr_purpose, request_by }) => {
                                  return (
                                    <>
                                      <option key={vr_id} value={vr_id}>
                                        {`${vr_no} (${div_finder(vr_division)} - ${purp_finder(vr_purpose)} : By ${request_by})`}
                                      </option>
                                    </>
                                  )
                                })}
                              </CFormSelect>
                            </CCol>

                            <CCol xs={12} md={3}>
                              <CFormLabel htmlFor="tNum">Division</CFormLabel>
                              <CFormInput
                                size="sm"
                                id="tNum"
                                value={values.ot_vr_no == '' ? '--' : div_finder(currentVrData.vr_division)}
                                readOnly
                              />
                            </CCol>
                            <CCol xs={12} md={3}>
                              <CFormLabel htmlFor="tNum">Department</CFormLabel>
                              <CFormInput
                                size="sm"
                                id="tNum"
                                value={values.ot_vr_no == '' ? '--' : dep_finder(currentVrData.vr_dept)}
                                readOnly
                              />
                            </CCol>
                            <CCol xs={12} md={3}>
                              <CFormLabel htmlFor="tNum">Purpose</CFormLabel>
                              <CFormInput
                                size="sm"
                                id="tNum"
                                value={values.ot_vr_no == '' ? '--' : purp_finder(currentVrData.vr_purpose)}
                                readOnly
                              />
                            </CCol>
                            <CCol xs={12} md={3}>
                              <CFormLabel htmlFor="tNum">Product</CFormLabel>
                              <CFormInput
                                size="sm"
                                id="tNum"
                                value={values.ot_vr_no == '' ? '--' : prod_finder(currentVrData.vr_prod)}
                                readOnly
                              />
                            </CCol>
                            <CCol xs={12} md={3}>
                              <CFormLabel htmlFor="tNum">From Location</CFormLabel>
                              <CFormInput
                                size="sm"
                                id="tNum"
                                value={values.ot_vr_no == '' ? '--' : currentVrData.vr_from_loc}
                                readOnly
                              />
                            </CCol>
                            <CCol xs={12} md={3}>
                              <CFormLabel htmlFor="tNum">To Location</CFormLabel>
                              <CFormInput
                                size="sm"
                                id="tNum"
                                value={values.ot_vr_no == '' ? '--' : currentVrData.vr_to_loc}
                                readOnly
                              />
                            </CCol>
                            <CCol xs={12} md={3}>
                              <CFormLabel htmlFor="tNum">Request By</CFormLabel>
                              <CFormInput
                                size="sm"
                                id="tNum"
                                value={values.ot_vr_no == '' ? '--' : `${currentVrData.request_by} (${currentVrData.contact_no})`}
                                readOnly
                              />
                            </CCol>
                            <CCol xs={12} md={3}>
                              <CFormLabel htmlFor="tNum">Vehicle Capacity (TON)</CFormLabel>
                              <CFormInput
                                size="sm"
                                id="tNum"
                                value={values.ot_vr_no == '' ? '--' : veh_capacity_finder(currentVrData.vr_capacity_id)}
                                readOnly
                              />
                            </CCol>
                            <CCol xs={12} md={3}>
                              <CFormLabel htmlFor="tNum">Vehicle Body Type / Variety</CFormLabel>
                              <CFormInput
                                size="sm"
                                id="tNum"
                                value={values.ot_vr_no == '' ? '--' : `${veh_body_finder(currentVrData.vr_body_id)} / ${veh_variety_finder(currentVrData.vr_variety_id)}`}
                                readOnly
                              />
                            </CCol>
                            <CCol xs={12} md={3}>
                              <CFormLabel htmlFor="tNum">Remarks</CFormLabel>
                              <CFormInput
                                size="sm"
                                id="tNum"
                                value={values.ot_vr_no == '' ? '--' : currentVrData.veh_remarks}
                                readOnly
                              />
                            </CCol>
                            <CCol xs={12} md={3}>
                              <CFormLabel htmlFor="tNum">Expected Date</CFormLabel>
                              <CFormInput
                                size="sm"
                                id="tNum"
                                value={values.ot_vr_no == '' ? '--' : currentVrData.require_time_date_string}
                                readOnly
                              />
                            </CCol>
                            <ColoredLine color="red" />
                          </>
                        )}
                        <CCol xs={12} md={3}>
                          <CFormLabel htmlFor="ot_veh_num">
                            Vehicle Number <REQ />{' '}
                            {errors.ot_veh_num && (
                              <span className="small text-danger">{errors.ot_veh_num}</span>
                            )}
                          </CFormLabel>
                          <CFormInput
                            name="ot_veh_num"
                            size="sm"
                            maxLength={10}
                            id="ot_veh_num"
                            onChange={handleChangeOTS}
                            value={values.ot_veh_num}
                            onFocus={onFocus}
                            onBlur={onBlur}
                            placeholder=""
                          />
                        </CCol>
                        <CCol md={3}>
                          <CFormLabel htmlFor="ot_veh_cap">
                            Vehicle Capacity (TON)<REQ />{' '}
                            {errors.ot_veh_cap && (
                              <span className="small text-danger">{errors.ot_veh_cap}</span>
                            )}
                          </CFormLabel>

                          <CFormSelect
                            size="sm"
                            name="ot_veh_cap"
                            onChange={handleChangeOTS}
                            onFocus={onFocus}
                            value={values.ot_veh_cap}
                            className={`mb-1 ${errors.ot_veh_cap && 'is-invalid'}`}
                            aria-label="Small select example"
                            id="vCap"
                          >
                            <option value="">Select ...</option>
                            {vehicleCapacity.map(({ id, capacity }) => {
                              return (
                                <>
                                  <option key={id} value={id}>
                                    {capacity}
                                  </option>
                                </>
                              )
                            })}
                          </CFormSelect>
                        </CCol>
                        <CCol xs={12} md={3}>
                          <CFormLabel htmlFor="ot_dr_name">
                            Driver Name <REQ />{' '}
                            {errors.ot_dr_name && (
                              <span className="small text-danger">{errors.ot_dr_name}</span>
                            )}
                          </CFormLabel>
                          <CFormInput
                            name="ot_dr_name"
                            size="sm"
                            maxLength={20}
                            id="ot_dr_name"
                            onChange={handleChangeOTS}
                            value={values.ot_dr_name}
                            onFocus={onFocus}
                            onBlur={onBlur}
                            placeholder=""
                          />
                        </CCol>
                        <CCol xs={12} md={3}>
                          <CFormLabel htmlFor="ot_dr_num">
                            Driver Number <REQ />{' '}
                            {errors.ot_dr_num && (
                              <span className="small text-danger">{errors.ot_dr_num}</span>
                            )}
                          </CFormLabel>
                          <CFormInput
                            name="ot_dr_num"
                            size="sm"
                            maxLength={10}
                            id="ot_dr_num"
                            onChange={handleChangeOTS}
                            value={values.ot_dr_num}
                            onFocus={onFocus}
                            onBlur={onBlur}
                            placeholder=""
                          />
                        </CCol>
                        <CCol md={3}>
                          <CFormLabel htmlFor="ot_veh_body_type">
                            Vehicle Body Type<REQ />{' '}
                            {errors.ot_veh_body_type && (
                              <span className="small text-danger">{errors.ot_veh_body_type}</span>
                            )}
                          </CFormLabel>
                          <CFormSelect
                            size="sm"
                            name="ot_veh_body_type"
                            id="vBody"
                            onFocus={onFocus}
                            onBlur={onBlur}
                            onChange={handleChangeOTS}
                            value={values.ot_veh_body_type}
                            className={`mb-1 ${errors.ot_veh_body_type && 'is-invalid'}`}
                            aria-label="Small select example"
                          >
                            <option value="">Select ...</option>

                            {vehicleBody.map(({ id, body_type }) => {
                              return (
                                <>
                                  <option key={id} value={id}>
                                    {body_type}
                                  </option>
                                </>
                              )
                            })}
                          </CFormSelect>
                        </CCol>
                        <CCol xs={12} md={3}>
                          <CFormLabel htmlFor="panNumber">
                            PAN Card Number
                            <REQ />{' '}
                            {errors.panNumber && (
                              <span className="small text-danger">{errors.panNumber}</span>
                            )}
                          </CFormLabel>
                          <CInputGroup>
                            <CFormInput
                              size="sm"
                              name="panNumber"
                              id="panNumber"
                              maxLength={10}
                              value={panNumbernew}
                              readOnly = {panGroupData.length > 0 ? true : false}
                              onFocus={onFocus}
                              onBlur={onBlur}
                              onChange={handleChangenewpan}
                            />
                            {/* <CInputGroupText className="p-0">
                              <CButton size="sm" color="success" onClick={(e) => getPanData(e)}>
                                <i className="fa fa-check px-1"></i>
                              </CButton>
                            </CInputGroupText> */}
                            <CInputGroupText className="p-0">
                              {panGroupData.length == 0 ? (
                                <CButton 
                                  size="sm" 
                                  color="success" 
                                  onClick={(e) => getPanData(e)}
                                >
                                  <i className="fa fa-check px-1"></i>
                                </CButton>
                                ) : (
                                  <CButton 
                                    size="sm" 
                                    color="danger" 
                                    onClick={(e) => vendorClear()}
                                  >
                                    <i className="fa fa-refresh px-1"></i>
                                  </CButton>
                                )
                              }
                            </CInputGroupText>
                          </CInputGroup>
                        </CCol>
                        {panGroupData.length > 0 && (
                          <CCol md={3}>
                            <CFormLabel htmlFor="pan_data">
                              PAN Data <REQ />{' '}
                              
                            </CFormLabel>
                            <CFormSelect
                              size="sm"
                              name="pan_data" 
                              value={vendorCode} 
                              onChange={(e) => getPanChildData(e)}
                              aria-label="Small select example"
                              id="gstType"
                            >
                              <option value="0">Select...</option>
                              {panGroupData.map(({ LIFNR, NAME1 }) => {
                                return (
                                  <>
                                    <option key={LIFNR} value={LIFNR}>
                                      {`${LIFNR} - ${NAME1}`}
                                    </option>
                                  </>
                                )
                              })}
                            </CFormSelect>
                          </CCol>
                        )}

                        {vendor ? (
                          <VendorAvaiable panData={panData} />
                        ) : (
                          <OthersVendorNotAvailable
                            onFocus={onFocus}
                            onBlur={onBlur}
                            handleChange={handleChangeOTS}
                            values={values}
                            errors={errors}
                          />
                        )}
                        <CCol xs={12} md={3}>
                          <CFormLabel htmlFor="ot_veh_insurence_valid">
                            Insurance Validity
                            <REQ />{' '}
                            {errors.ot_veh_insurence_valid && (
                              <span className="small text-danger">{errors.ot_veh_insurence_valid}</span>
                            )}
                          </CFormLabel>
                          <CFormSelect
                            size="sm"
                            name="ot_veh_insurence_valid"
                            id="ot_veh_insurence_valid"
                            onFocus={onFocus}
                            onBlur={onBlur}
                            onChange={handleChangeOTS}
                            value={values.ot_veh_insurence_valid}
                          >
                            <option value="">Select ...</option>
                            <option value="1">Valid</option>
                            <option value="0">Invalid</option>
                          </CFormSelect>
                        </CCol>
                        <CCol xs={12} md={3}>
                          <CFormLabel htmlFor="ot_dr_license_valid">
                            License Validity
                            <REQ />{' '}
                            {errors.ot_dr_license_valid && (
                              <span className="small text-danger">{errors.ot_dr_license_valid}</span>
                            )}
                          </CFormLabel>
                          <CFormSelect
                            size="sm"
                            name="ot_dr_license_valid"
                            id="ot_dr_license_valid"
                            onFocus={onFocus}
                            onBlur={onBlur}
                            onChange={handleChangeOTS}
                            value={values.ot_dr_license_valid}
                          >
                            <option value="">Select ...</option>
                            <option value="1">Valid</option>
                            <option value="0">Invalid</option>
                          </CFormSelect>
                        </CCol>
                        <CCol xs={12} md={3}>
                          <CFormLabel htmlFor="shedName">
                            Shed Name
                            <REQ />{' '}
                            {errors.shedName && (
                              <span className="small text-danger">{errors.shedName}</span>
                            )}
                          </CFormLabel>
                          <ShedListSearchSelect
                            size="sm"
                            className="mb-1"
                            onChange={(e) => {
                              onChange(e)
                            }}
                            label="shedName"
                            id="shedName"
                            name="shedName"
                            onFocus={onFocus}
                            value={values.shedName}
                            onBlur={onBlur}
                            search_type="shed_name"
                          />

                        </CCol>
                        <CCol xs={12} md={3}>
                          <CFormLabel htmlFor="shedownerMob">Shed Mobile Number</CFormLabel>
                          <CFormInput
                            type="text"
                            name="shedownerMob"
                            size="sm"
                            id="shedownerMob"
                            // value={shedData && shedData.shed_owner_phone_1}
                            value={shedMob}
                            readOnly
                          />
                        </CCol>
                        <CCol xs={12} md={3}>
                          <CFormLabel htmlFor="shedownerWhatsapp">Shed WhatsApp Number</CFormLabel>
                          <CFormInput
                            type="text"
                            name="shedownerWhatsapp"
                            size="sm"
                            id="shedownerWhatsapp"
                            // value={shedData && shedData.shed_owner_phone_2}
                            value={shedWhats}
                            readOnly
                          />
                        </CCol>

                        <ColoredLine color="red" />
                        {currentProcessId == '1' && (
                          <>
                            <CCol xs={12} md={3}>
                              <CFormLabel htmlFor="tNum">Division</CFormLabel>
                              <CFormInput
                                size="sm"
                                id="tNum"
                                value={user_info && user_info.division_info ? user_info.division_info.division : ''}
                                readOnly
                              />
                            </CCol>
                            <CCol xs={12} md={3}>
                              <CFormLabel htmlFor="tNum">Department</CFormLabel>
                              <CFormInput
                                size="sm"
                                id="tNum"
                                value={user_info && user_info.department_info ? user_info.department_info.department : ''}
                                readOnly
                              />
                            </CCol>
                            <CCol md={3}>
                              <CFormLabel htmlFor="ot_vr_purpose">
                                Purpose <REQ />{' '}
                                {errors.ot_vr_purpose && (
                                  <span className="small text-danger">{errors.ot_vr_purpose}</span>
                                )}
                              </CFormLabel>
                              <CFormSelect
                                size="sm"
                                name="ot_vr_purpose"
                                onChange={handleChangeOTS}
                                onFocus={onFocus}
                                value={values.ot_vr_purpose}
                                className={`mb-1 ${errors.ot_vr_purpose && 'is-invalid'}`}
                                aria-label="Small select example"
                                id="ot_vr_purpose"
                              >
                                <option value="">Select ...</option>
                                {vrPurposedata && vrPurposedata.map(({ definition_list_code, definition_list_name }) => {
                                  if (definition_list_code) {
                                    return (
                                      <>
                                        <option key={definition_list_code} value={definition_list_code}>
                                          {definition_list_name}
                                        </option>
                                      </>
                                    )
                                  }
                                })}
                              </CFormSelect>
                            </CCol>
                            <CCol md={3}>
                              <CFormLabel htmlFor="ot_vr_product">
                                Product <REQ />{' '}
                                {errors.ot_vr_product && (
                                  <span className="small text-danger">{errors.ot_vr_product}</span>
                                )}
                              </CFormLabel>
                              <CFormSelect
                                size="sm"
                                name="ot_vr_product"
                                onChange={handleChangeOTS}
                                onFocus={onFocus}
                                value={values.ot_vr_product}
                                className={`mb-1 ${errors.ot_vr_product && 'is-invalid'}`}
                                aria-label="Small select example"
                                id="ot_vr_product"
                              >
                                <option value="">Select ...</option>
                                {vrProductdata && vrProductdata.map(({ definition_list_code, definition_list_name }) => {
                                  if (definition_list_code) {
                                    return (
                                      <>
                                        <option key={definition_list_code} value={definition_list_code}>
                                          {definition_list_name}
                                        </option>
                                      </>
                                    )
                                  }
                                })}
                              </CFormSelect>
                            </CCol>
                            <CCol xs={12} md={3}>
                              <CFormLabel htmlFor="ot_vr_from_location">
                                From Location <REQ />{' '}
                                {errors.ot_vr_from_location && (
                                  <span className="small text-danger">{errors.ot_vr_from_location}</span>
                                )}
                              </CFormLabel>
                              <CFormInput
                                name="ot_vr_from_location"
                                size="sm"
                                maxLength={20}
                                id="ot_vr_from_location"
                                onChange={handleChangeOTS}
                                value={values.ot_vr_from_location}
                                onFocus={onFocus}
                                onBlur={onBlur}
                                placeholder=""
                              />
                            </CCol>
                            <CCol xs={12} md={3}>
                              <CFormLabel htmlFor="ot_vr_to_location">
                                To Location <REQ />{' '}
                                {errors.ot_vr_to_location && (
                                  <span className="small text-danger">{errors.ot_vr_to_location}</span>
                                )}
                              </CFormLabel>
                              <CFormInput
                                name="ot_vr_to_location"
                                size="sm"
                                maxLength={20}
                                id="ot_vr_to_location"
                                onChange={handleChangeOTS}
                                value={values.ot_vr_to_location}
                                onFocus={onFocus}
                                onBlur={onBlur}
                                placeholder=""
                              />
                            </CCol>
                            <CCol xs={12} md={3}>
                              <CFormLabel htmlFor="ot_vr_requester">
                                Request By (Name) <REQ />{' '}
                                {errors.ot_vr_requester && (
                                  <span className="small text-danger">{errors.ot_vr_requester}</span>
                                )}
                              </CFormLabel>
                              <CFormInput
                                name="ot_vr_requester"
                                size="sm"
                                maxLength={20}
                                id="ot_vr_requester"
                                onChange={handleChangeOTS}
                                value={values.ot_vr_requester}
                                onFocus={onFocus}
                                onBlur={onBlur}
                                placeholder=""
                              />
                            </CCol>
                            <CCol xs={12} md={3}>
                              <CFormLabel htmlFor="ot_vr_req_contact_no">
                                Contact No. <REQ />{' '}
                                {errors.ot_vr_req_contact_no && (
                                  <span className="small text-danger">{errors.ot_vr_req_contact_no}</span>
                                )}
                              </CFormLabel>
                              <CFormInput
                                name="ot_vr_req_contact_no"
                                size="sm"
                                maxLength={10}
                                id="ot_vr_req_contact_no"
                                onChange={handleChangeOTS}
                                value={values.ot_vr_req_contact_no}
                                className={`mb-1 ${errors.ot_vr_req_contact_no && 'is-invalid'}`}
                                onFocus={onFocus}
                                onBlur={onBlur}
                                placeholder=""
                              />
                            </CCol>
                            <CCol xs={12} md={3}>
                              <CFormLabel htmlFor="ot_vr_datetime">
                                Expected Date <REQ />{' '}
                                {errors.ot_vr_datetime && (
                                  <span className="small text-danger">
                                    {errors.ot_vr_datetime}
                                  </span>
                                )}
                              </CFormLabel>
                              <CFormInput
                                name="ot_vr_datetime"
                                size="sm"
                                id="ot_vr_datetime"
                                onChange={handleChangeOTS}
                                type="date"
                                value={values.ot_vr_datetime}
                                onFocus={onFocus}
                                onBlur={onBlur}
                                placeholder=""
                              />
                            </CCol>
                            <ColoredLine color="red" />
                          </>
                        )}


                        <CRow key={`HireshipmentData1`} className="mt-2" hidden>
                          <CCol xs={12} md={3}>
                            <CFormLabel
                              htmlFor="inputAddress"
                              style={{
                                backgroundColor: '#4d3227',
                                color: 'white',
                              }}
                            >
                              Freight Details
                            </CFormLabel>
                          </CCol>
                        </CRow>
                        <CCol xs={12} md={3}>
                          <CFormLabel htmlFor="ot_freight_calc">
                            Freight Calculation Based On
                            <REQ />{' '}
                            {errors.ot_freight_calc && (
                              <span className="small text-danger">{errors.ot_freight_calc}</span>
                            )}
                          </CFormLabel>
                          <CFormSelect
                            size="sm"
                            name="ot_freight_calc"
                            id="ot_freight_calc"
                            onFocus={onFocus}
                            onBlur={onBlur}
                            onChange={handleChangeOTS}
                            value={values.ot_freight_calc}
                          >
                            <option value="">Select...</option>
                            <option value="1">TON</option>
                            <option value="2">KM</option>
                            <option value="3">Trip</option>
                            <option value="4">Fixed</option>
                          </CFormSelect>
                        </CCol>
                        {values.ot_freight_calc != "" && (
                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="ot_freight_amount">
                              {freight_header(values.ot_freight_calc)} <REQ />{' '}
                              {errors.ot_freight_amount && (
                                <span className="small text-danger">{errors.ot_freight_amount}</span>
                              )}
                            </CFormLabel>
                            <CFormInput
                              name="ot_freight_amount"
                              size="sm"
                              maxLength={6}
                              id="ot_freight_amount"
                              onChange={handleChangeOTS}
                              value={values.ot_freight_amount}
                              className={`mb-1 ${errors.ot_freight_amount && 'is-invalid'}`}
                              onFocus={onFocus}
                              onBlur={onBlur}
                              placeholder=""
                            />
                          </CCol>
                        )}
                        {is_vr_admin == 1 ? (
                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="ot_adv_avail">
                              Advance Applicable
                              <REQ />{' '}
                              {errors.ot_adv_avail && (
                                <span className="small text-danger">{errors.ot_adv_avail}</span>
                              )}
                            </CFormLabel>
                            <CFormSelect
                              size="sm"
                              name="ot_adv_avail"
                              id="ot_adv_avail"
                              onFocus={onFocus}
                              onBlur={onBlur}
                              onChange={handleChangeOTS}
                              value={values.ot_adv_avail}
                            >
                              <option value="">Select ...</option>
                              <option value="1">Yes</option>
                              <option value="0">No</option>
                            </CFormSelect>
                          </CCol>
                        ) : (
                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="tNum">Advance Applicable</CFormLabel>
                            <CFormInput
                              size="sm"
                              id="tNum"
                              value={'No'}
                              readOnly
                            />
                          </CCol>
                        )}
                        {!(values.ot_freight_calc == "" || values.ot_freight_calc == 4) && (
                          <CCol xs={12} md={3}>
                          <CFormLabel htmlFor="ot_tot_freight_amount">
                            Total Freight (Approx.) <REQ />{' '}
                            {errors.ot_tot_freight_amount && (
                              <span className="small text-danger">{errors.ot_tot_freight_amount}</span>
                            )}
                          </CFormLabel>
                          <CFormInput
                            name="ot_tot_freight_amount"
                            size="sm"
                            maxLength={6}
                            id="ot_tot_freight_amount"
                            onChange={handleChangeOTS}
                            value={values.ot_tot_freight_amount}
                            className={`mb-1 ${errors.ot_tot_freight_amount && 'is-invalid'}`}
                            onFocus={onFocus}
                            onBlur={onBlur}
                            placeholder=""
                          />
                          </CCol>
                        )}
                        {values.ot_adv_avail == '1' && (
                          <>
                            <CCol xs={12} md={3}>
                              <CFormLabel htmlFor="ot_bank_adv">
                                Bank Advance <REQ />{' '}
                                {errors.ot_bank_adv && (
                                  <span className="small text-danger">{errors.ot_bank_adv}</span>
                                )}
                              </CFormLabel>
                              <CFormInput
                                name="ot_bank_adv"
                                size="sm"
                                maxLength={6}
                                id="ot_bank_adv"
                                onChange={handleChangeOTS}
                                value={values.ot_bank_adv}
                                className={`mb-1 ${errors.ot_bank_adv && 'is-invalid'}`}
                                onFocus={onFocus}
                                onBlur={onBlur}
                                placeholder=""
                              />
                            </CCol>
                            <CCol xs={12} md={3}>
                              <CFormLabel htmlFor="ot_diesel_adv">
                                Diesel Advance <REQ />{' '}
                                {errors.ot_diesel_adv && (
                                  <span className="small text-danger">{errors.ot_diesel_adv}</span>
                                )}
                              </CFormLabel>
                              <CFormInput
                                name="ot_diesel_adv"
                                size="sm"
                                maxLength={6}
                                id="ot_diesel_adv"
                                onChange={handleChangeOTS}
                                value={values.ot_diesel_adv}
                                className={`mb-1 ${errors.ot_diesel_adv && 'is-invalid'}`}
                                onFocus={onFocus}
                                onBlur={onBlur}
                                placeholder=""
                              />
                            </CCol>
                          </>
                        )}

                        <CCol md={3}>
                          <CFormLabel htmlFor="vr_remarks">
                            Trip Remarks
                          </CFormLabel>
                          <CFormTextarea
                            name="vr_remarks"
                            id="vr_remarks"
                            rows="1"
                            onChange={(e) => {remarksHandleChange(e,'2')}}
                            value={vendorRemarks}
                          ></CFormTextarea>
                        </CCol>
                      </CRow>

                      <CRow className="mb-md-1" style={{width:'100%'}}>
                        <CCol className="" xs={12} sm={12} md={3} style={{width:'30%'}}>
                          <CButton size="s-lg" color="warning" className="text-white" onClick={clearValues} type="button">
                            Back
                          </CButton>
                        </CCol>
                        <CCol
                          xs={12}
                          sm={12}
                          md={3}
                          style={{ display: 'flex', justifyContent: 'flex-end', width:'70%' }}
                        >
                          <CTooltip
                            content="Page Refresh"
                            placement="top"
                          >
                            <CButton
                              size="s-lg"
                              color="warning"
                              className="mx-2 text-white"
                              onClick={() => {
                                window.location.reload(false)
                              }}
                              type="button"
                            >
                              <span className="float-start">
                                <i className="fa fa-refresh" aria-hidden="true"></i>
                              </span>
                            </CButton>
                          </CTooltip>
                          <CButton
                            size="s-lg"
                            color="warning"
                            className="mx-3 text-white"
                            onClick={checkOthersTripsheetValidation}
                            disabled={submitBtn}
                          >
                            Create
                          </CButton>
                        </CCol>
                      </CRow>

                    </CForm>
                  </CTabPane>
                </CTabContent>
                {/* Error Modal Section */}
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
                {/* Error Modal Section */}
                {/* ============== Settlement Submit Confirm Button Modal Area Start ================= */}
                  <CModal
                    visible={sapUnStoppedTripsheet}
                    backdrop="static"
                     size="xl"
                    // scrollable
                    onClose={() => {
                      setSAPUnStoppedTripsheet(false)
                    }}
                  >
                    <CModalBody>
                      
                      
                      <> 
                        <CRow className="mt-2 mb-2" style={{border:"1px solid pink"}}>
                          <CCol xs={12} md={6}>
                            <CFormLabel
                              htmlFor="inputAddress"
                              style={{
                                backgroundColor: 'indigo',
                                color: 'white',
                              }}
                            >
                              {`. Previous Tripsheet Information .`}
                            </CFormLabel>
                          </CCol>
                        </CRow>
                        <CRow className="mt-md-3">                 
                          <CCol xs={12} md={2}>
                            <CFormLabel htmlFor="vNum">Tripsheet No.</CFormLabel>
                            <CFormInput size="sm" id="vNum" value={sapUnStoppedTripsheetData.trip_sheet_no} readOnly />
                          </CCol>
                          <CCol xs={12} md={2}>
                            <CFormLabel htmlFor="vNum">Status</CFormLabel>
                            {/* <CFormInput style={{color:sapUnStoppedTripsheetData.parking__yard?.vehicle_current_position == '16' ? 'red' : 'green', fontWeight:'bold'}} size="sm" id="vNum" value={sapUnStoppedTripsheetData.parking__yard?.vehicle_current_position == '16' ? 'Tripsheet Created': 'Tripsheet Assigned / Advance Completed'} readOnly /> */}
                            <CFormInput style={{color:sapUnStoppedTripsheetData.parking__yard?.vehicle_current_position == '16' ? 'red' : 'green', fontWeight:'bold'}} size="sm" id="vNum" value={ptStatusFinder(sapUnStoppedTripsheetData.parking__yard?.vehicle_current_position)}  readOnly />
                          </CCol>
                          <CCol xs={12} md={2}>
                            <CFormLabel htmlFor="vNum">Purpose / Division</CFormLabel>
                            <CFormInput size="sm" id="vNum" value={`${sapUnStoppedTripsheetData.parking__yard?.vehicle_type_id == 4 ? 'Party FG-Sales' : old_trip_purpose_array[sapUnStoppedTripsheetData.purpose]} / ${sapUnStoppedTripsheetData.purpose == 4 ? '-' : sapUnStoppedTripsheetData.to_divison == 2 ? 'NLCD':'NLFD'}`}  readOnly />
                          </CCol>                       
                          <CCol xs={12} md={2}>
                            <CFormLabel htmlFor="vNum">Tripsheet Created By</CFormLabel>
                            <CFormInput size="sm" id="vNum" value={findUser(sapUnStoppedTripsheetData.created_by)} readOnly />
                          </CCol>
                          <CCol xs={12} md={2}>
                            <CFormLabel htmlFor="vNum">Creation Time</CFormLabel>
                            <CFormInput size="sm" id="vNum" value={timeConvert(sapUnStoppedTripsheetData.created_at)} readOnly />
                          </CCol>
                          <CCol xs={12} md={2}>
                            <CFormLabel htmlFor="vNum">Tripsheet Remarks</CFormLabel>
                            <CFormInput size="sm" id="vNum" value={sapUnStoppedTripsheetData.remarks ? sapUnStoppedTripsheetData.remarks: '-'} readOnly />
                          </CCol>
                        </CRow>   
                      </>
                      <p className="lead" style={{color:"red", fontWeight:"bold",marginTop:'15px'}}>Note : Previous Trip SAP Stop Process should be completed for next tripsheet creation. If the vehicle planning of the previous tripsheet was cancelled, kindly ignore this by clicking the Cancel option</p>
                      
                    </CModalBody>
                    <CModalFooter>
                    <p className="lead">Are you sure to close the previous Tripsheet in SAP ?</p>
                      <CButton
                        className="m-2"
                        color="warning"
                        onClick={() => {
                          setSAPUnStoppedTripsheet(false)
                          StopSAPEndCall()
                        }}
                      >
                        Close
                      </CButton>
                      <CButton
                        color="secondary"
                        onClick={() => {
                          setSAPUnStoppedTripsheet(false)
                        }}
                      >
                        Cancel
                      </CButton>
                    </CModalFooter>
                  </CModal>
                  {/* ============== Settlement Submit Confirm Button Modal Area End ================= */}
              </CCard>
            </>) : (<AccessDeniedComponent />
          )}
        </>
      )}
    </>
  )
}
export default OthersTripsheet
