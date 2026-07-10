import {
  CButton,
  CCard,
  CCol,
  CContainer,
  CCardImage,
  CForm,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CNav,
  CNavItem,
  CNavLink,
  CRow,
  CTabContent,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CTabPane,
  CFormFloating,
  CFormCheck,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CFormTextarea,
  CButtonGroup,
  CInputGroup,
  CInputGroupText,
} from '@coreui/react'
import React, { useState , useRef, useCallback,useEffect } from 'react'
import useForm from 'src/Hooks/useForm.js'
import { Link, useNavigate, useParams } from 'react-router-dom'
import VehicleInspectionValidation from 'src/Utils/TransactionPages/VehicleInspection/VehicleInspectionValidation'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Loader from 'src/components/Loader'
import ParkingYardGateService from 'src/Service/ParkingYardGate/ParkingYardGateService'
import VehicleCapacityService from 'src/Service/SmallMaster/Vehicles/VehicleCapacityService'
import TripSheetCreationService from 'src/Service/TripSheetCreation/TripSheetCreationService'
import DriverListSearchSelect from 'src/components/commoncomponent/DriverListSearchSelect'

import AccessDeniedComponent from 'src/components/commoncomponent/AccessDeniedComponent'
import JavascriptInArrayComponent from 'src/components/commoncomponent/JavascriptInArrayComponent'
import * as LogisticsProScreenNumberConstants from 'src/components/constants/LogisticsProScreenNumberConstants'
import TripSheetInfoService from 'src/Service/PurchasePro/TripSheetInfoService'
import VehicleVarietyService from 'src/Service/SmallMaster/Vehicles/VehicleVarietyService'
import DivisionApi from 'src/Service/SubMaster/DivisionApi'
import DepartmentApi from 'src/Service/SubMaster/DepartmentApi'
import DefinitionsListApi from 'src/Service/Definitions/DefinitionsListApi'
import SmallLoader from 'src/components/SmallLoader'
import VehicleBodyTypeService from 'src/Service/SmallMaster/Vehicles/VehicleBodyTypeService'
import VehicleRequestMasterService from 'src/Service/VehicleRequest/VehicleRequestMasterService'
import FCIPlantMasterService from 'src/Service/FCIMovement/FCIPlantMaster/FCIPlantMasterService'

const TripSheetEditRequest = () => {
  const user_info_json = localStorage.getItem('user_info')
  const user_info = JSON.parse(user_info_json)

  /* Get User Id From Local Storage */
  const user_id = user_info.user_id

  /* ==================== Access Part Start ========================*/
  const [screenAccess, setScreenAccess] = useState(false)

  let page_no = LogisticsProScreenNumberConstants.TripSheetModule.TripSheet_Change

  useEffect(()=>{

    if(user_info.is_admin == 1 || JavascriptInArrayComponent(page_no,user_info.page_permissions)){
      console.log('screen-access-allowed')
      setScreenAccess(true)
    } else{
      console.log('screen-access-not-allowed')
      setScreenAccess(false)
    }

     /* section for getting Rmsto Process Types Master List from database */
     DefinitionsListApi.visibleDefinitionsListByDefinition(26).then((response) => {
      console.log(response.data.data,'setRmstoProcessTypes')
      setRmstoProcessTypes(response.data.data)
    })

  },[])
  /* ==================== Access Part End ========================*/
  const purpose_array = ['FG_SALES','FG_STO','RM_STO','OTHERS','FCI']
  const division_array = ['NLFD','NLCD']
  const vht_array = ['OWN','CONTRACT','HIRE']

  const [driverChange, setDriverChange] = useState(false)
  const [driverPhoneNumberById, setDriverPhoneNumberById] = useState('')
  const [driverCodeById, setDriverCodeById] = useState('')
  const [driverNameById, setDriverNameById] = useState('')
  const [oldDriver, setOldDriver] = useState('')
  const [changeDriver, setChangeDriver] = useState(false)

  const formValues = {
    vehicle_id: '',
    truck_clean: '',
    bad_smell: '',
    insect_vevils_presence: '',
    tarpaulin_srf: '',
    tarpaulin_non_srf: '',
    insect_vevils_presence_in_tar: '',
    truck_platform: '',
    previous_load_details: '',
    remarks: '',
  }

  const [rmstoProcessTypes, setRmstoProcessTypes] = useState([])
  const onChange = (event) => {
    let driverId = event.value
    if (driverId) {
      values.driverId = driverId

      ParkingYardGateService.getDriverInfoById(driverId).then((res) => {
        setDriverPhoneNumberById(res.data.data.driver_phone_1)
        setDriverCodeById(res.data.data.driver_code)
        setDriverNameById(res.data.data.driver_name)
      })
     console.log(driverPhoneNumberById)
    } else {
      values.driverId = ''
      setDriverPhoneNumberById('')
      // console.log()
    }
  }
// console.log(values.driverId)
  const border = {
    borderColor: '#b1b7c1',
  }

  const { values, errors, handleChange, onFocus, handleSubmit, enableSubmit, onBlur, isTouched } =
    useForm(TripSheetCancel, VehicleInspectionValidation, formValues)

  const navigation = useNavigate()
  const REQ = () => <span className="text-danger"> * </span>

  const UpdateTripsheetVehicle = () => {

    if (currentVehicleInfo.vehicle_type_id.id != '4' && (currentVehicleInfo.trip_sheet_info.sap_flag == '1' || currentVehicleInfo.trip_sheet_info.sap_flag == '2')) {
      let SAPData = new FormData()
      console.log(values.driverId)
      SAPData.append('TRIP_SHEET',currentVehicleInfo.trip_sheet_info.trip_sheet_no)
      SAPData.append('VEHICLE_NO', currentVehicleInfo.vehicle_number)
      SAPData.append('VEHICLE_TYPE', vht_array[currentVehicleInfo.vehicle_type_id.id-1])
      SAPData.append('DRIVER_NAME',  driverNameById?driverNameById:currentVehicleInfo.driver_name)
      SAPData.append('DRIVER_CODE', driverCodeById?driverCodeById:'0')
      SAPData.append('DRIVER_PH_NO',driverPhoneNumberById?driverPhoneNumberById:'0')
      SAPData.append('Purpose',purpose_array[values.purpose-1])
      // SAPData.append('Division',division_array[values.Division-1])
      SAPData.append('Division', values.purpose == 3 || values.purpose == 5 ? 'NLFD':  (values.purpose == 4 ? '' : division_array[values.Division-1]))
      if(values.purpose == '3' && values.rmsto_type){
        SAPData.append('RM_STO_TYPE', values.rmsto_type)
      }
      SAPData.append('Change_Flag', '2')
      let data = new FormData()
      console.log(currentVehicleInfo)
      data.append('parking_id', currentVehicleInfo.parking_yard_gate_id)
      data.append('trip_sheet_id', currentVehicleInfo.tripsheet_sheet_id)
      data.append('driver_id', values.driverId || '')
      data.append('purpose', values.purpose)
      data.append('to_divison', values.Division)
      data.append('advance_amount', values.advance_amount)
      data.append('freight_rate_per_tone', values.freight_rate_per_tone || '')
      data.append('advance_payment_diesel', values.advance_payment_diesel || '')
      data.append('vehicle_sourced_by', values.vehicle_sourced_by || '')
      data.append('expected_date_time', values.expected_date_time || '')
      data.append('expected_return_date_time', values.expected_return_date_time || '')
      if(values.purpose == '3' && values.rmsto_type){
        data.append('rmsto_type',values.rmsto_type || '')
      }
      data.append('remarks', remarks || '')
      data.append('updated_by', user_id)
      // data.append('sap_flag', '2')
      console.log(purpose_array[values.purpose-1],'needed_purpose')
      console.log(division_array[values.Division-1],'needed_Division')

      if (values.driverId && oldDriver) {
        data.append('driver_id', values.driverId)
        data.append('old_driver_id', oldDriver)
      }

      if (values.purpose == '2' && values.vehicle_sourced_by == 0) {
        toast.warning('Select Vehicle Sourced By ...')
        setFetch(true)
        return false
      }

      if (values.expected_date_time == '' && values.expected_date_time == null) {
        toast.warning('Select Expected Date ...')
        setFetch(true)
        return false
      }

      if (values.expected_return_date_time == '' && values.expected_return_date_time == null) {
        toast.warning('Select Expected Return Date ...')
        setFetch(true)
        return false
      }
      console.log(values.freight_rate_per_tone)
      if(currentVehicleInfo.vehicle_type_id.id == '3'){
        if (isTouched.freight_rate_per_tone && !/^[\d]{2,4}$/.test(values.freight_rate_per_tone)) {
          toast.warning('Freight Rate Per Ton Allow Only Numbers')
          setFetch(true)
          return false
        }
        else if(values.freight_rate_per_tone == 0){
          toast.warning('Freight Rate Per Ton Allow more than 0...')
          setFetch(true)
          return false
        }
        else if (isTouched.advance_payment_diesel && !/^[\d]{1,6}$/.test(values.advance_payment_diesel)) {
          toast.warning('Diesel Payment Allow Only Numbers')
          setFetch(true)
          return false
        }
      }
      if (isTouched.advance_amount && !/^[\d]{1,6}$/.test(values.advance_amount)) {
        toast.warning('Advance Payment Allow Only Numbers')
        setFetch(true)
        return false
      }else if (values.driverId == '') {
        toast.warning('Select The Driver Name')
        setFetch(true)
        return false
      }

     // value={currentVehicleInfo?.driver_name+' - '+currentVehicleInfo?.driver_info?.driver_code}

      TripSheetInfoService.StartTSInfoToSAP(SAPData).then((response) => {
        console.log("SAP Data pass ")
        console.log(response)
        console.log(response.data)
        let sap_status = response.data[0].STATUS
        console.log(sap_status)
        if (sap_status == '1') {
          setFetch(true)
          console.log("SAP Response Start ")
          console.log(sap_status)
          console.log("SAP Response End ")
          data.append('sap_flag','2')
          console.log(data)
          TripSheetCreationService.updateTripSheet(id,data).then((res) => {
            if (res.status == 200) {
              setFetch(true)
              toast.success('TripSheet Updated Sucessfully')
              navigation('/TripSheetEditHome')
            }
          })

          .catch((error) => {
            setFetch(true)
            toast.warning(error)
          })
        }
         else {            
          setFetch(true)
          toast.warning(response.data[0].MESSAGE+'. Kindly Contact Admin..!')
          return false
        }
      })
      .catch((error) => {
        setFetch(true)
        toast.warning(error)
      })
  
    } else {
      let data = new FormData()
      data.append('parking_id', currentVehicleInfo.parking_yard_gate_id)
      data.append('trip_sheet_id', currentVehicleInfo.tripsheet_sheet_id)
      data.append('driver_id', values.driverId || '')
      data.append('purpose', values.purpose)
      data.append('to_divison', values.Division)
      data.append('advance_amount', values.advance_amount)
      data.append('freight_rate_per_tone', values.freight_rate_per_tone || '')
      data.append('advance_payment_diesel', values.advance_payment_diesel || '')
      data.append('vehicle_sourced_by', values.vehicle_sourced_by || '')
      data.append('expected_date_time', values.expected_date_time || '')
      data.append('expected_return_date_time', values.expected_return_date_time || '')
      data.append('remarks', remarks || '')
      data.append('updated_by', user_id)
      if (values.driverId && oldDriver) {
        data.append('driver_id', values.driverId)
        data.append('old_driver_id', oldDriver)
      }

      if (values.purpose == '2' && values.vehicle_sourced_by == 0) {
        toast.warning('Select Vehicle Sourced By ...')
        setFetch(true)
        return false
      }
      if (values.expected_date_time == '' && values.expected_date_time == null) {
        toast.warning('Select Expected Date ...')
        setFetch(true)
        return false
      }
      
      if (values.expected_return_date_time == '' && values.expected_return_date_time == null) {
        toast.warning('Select Expected Return Date ...')
        setFetch(true)
        return false
      }
      console.log(values.freight_rate_per_tone)
      if(currentVehicleInfo.vehicle_type_id.id == '3'){
       if (isTouched.freight_rate_per_tone && !/^[\d]{2,4}$/.test(values.freight_rate_per_tone)) {
        toast.warning('Freight Rate Per Ton Allow Only Numbers')
        setFetch(true)
        return false
        }
       else if(values.freight_rate_per_tone == 0){
          toast.warning('Freight Rate Per Ton Allow more than 0...')
          setFetch(true)
          return false
        }
       else if (isTouched.advance_payment_diesel && !/^[\d]{1,6}$/.test(values.advance_payment_diesel)) {
          toast.warning('Diesel Payment Allow Only Numbers')
          setFetch(true)
          return false
        }
      }
      if (isTouched.advance_amount && !/^[\d]{1,6}$/.test(values.advance_amount)) {
        toast.warning('Advance Payment Allow Only Numbers')
        setFetch(true)
        return false
      }else if (values.driverId == '') {
        toast.warning('Select The Driver Name')
        setFetch(true)
        return false
      }
        
      TripSheetCreationService.updateTripSheet(id,data).then((res) => {
        if (res.status == 200) {
          setFetch(true)
          toast.success('TripSheet Updated Sucessfully')
          navigation('/TripSheetEditHome')
        }
      })
    }
  }
  //Tripsheet Info - SAP End


  function TripSheetCancel  () {
    console.log(currentVehicleInfo)

    if (currentVehicleInfo.vehicle_type_id.id != '4' && (currentVehicleInfo.trip_sheet_info.sap_flag == '1' || currentVehicleInfo.trip_sheet_info.sap_flag == '2')) {
      console.log('IF part')
      let SAPData = new FormData()
      SAPData.append('TRIP_SHEET',currentVehicleInfo.trip_sheet_info.trip_sheet_no)
      SAPData.append('VEHICLE_NO',currentVehicleInfo.vehicle_number)
      SAPData.append('VEHICLE_TYPE',vht_array[currentVehicleInfo.vehicle_type_id.id-1])
      SAPData.append('DRIVER_NAME',currentVehicleInfo.driver_name)
      SAPData.append('DRIVER_CODE', driverCodeById?driverCodeById:'0')
      // SAPData.append('Purpose',purpose_array[currentVehicleInfo.trip_sheet_info.purpose-1])
      // SAPData.append('Division',division_array[currentVehicleInfo.trip_sheet_info.to_divison-1])
      SAPData.append('Purpose',purpose_array[values.purpose-1])
      // SAPData.append('Division',currentVehicleInfo.trip_sheet_info.purpose == '4' ? '' : (currentVehicleInfo.trip_sheet_info.purpose == '3' ? 'NLFD' : division_array[values.Division-1]))
      SAPData.append('Division', values.purpose == 3 || values.purpose == 5 ? 'NLFD':  (values.purpose == 4 ? '' : division_array[values.Division-1]))
      SAPData.append('Stop_Flag', '4')

      let data = new FormData()
      data.append('parking_id', currentVehicleInfo.parking_yard_gate_id)
      data.append('trip_sheet_id', currentVehicleInfo.tripsheet_sheet_id)
      data.append('remarks', remarks || '')
      if(values.purpose == '4'){
        data.append('vehicle_request_no', currentVehicleInfo.trip_sheet_info.vehicle_requests)
      }
      data.append('updated_by', user_id)

      console.log(values.remarks)

      if (remarks == '' || remarks == null) {
        toast.warning('Remarks Field is Mandatory')
        setFetch(true)
        return false
      }

      TripSheetInfoService.StartTSInfoToSAP(SAPData).then((response) => {
        console.log("SAP Data CANCEL ")
        console.log(response)
        console.log(response.data)
        let sap_status = response.data[0].STATUS
        console.log(sap_status)
        if (sap_status == '1') {
          // setFetch(true)
          console.log("SAP Response Start ")
          console.log(sap_status)
          console.log("SAP Response End ")
          data.append('sap_flag','2')
          console.log(data)

          TripSheetCreationService.tripSheet_cancel(id,data).then((res) => {
            if (res.status == 200) {
              setFetch(true)
              toast.success('TripSheet Cancel Sucessfully')
              navigation('/TripSheetEditHome')
            }
          })

          .catch((error) => {
            setFetch(true)
            toast.warning(error)
          })
        }
        else {
          setFetch(true)
          toast.warning(response.data[0].MESSAGE+'. Kindly Contact Admin..!')
            return false
        }
      })
      .catch((error) => {
        setFetch(true)
        toast.warning(error)
      })
        
    } else if(values.pupose == null && currentVehicleInfo.vehicle_type_id.id == '4') {
      // toast.warning('Party Vehicle - Tripsheet Cancelled')

      let SAPData = new FormData()
      SAPData.append('TRIP_SHEET',currentVehicleInfo.trip_sheet_info.trip_sheet_no)
      SAPData.append('VEHICLE_NO',currentVehicleInfo.vehicle_number)
      SAPData.append('VEHICLE_TYPE', currentVehicleInfo.vehicle_others_type == '2' ? 'D2R' : 'PARTY')
      SAPData.append('DRIVER_NAME',currentVehicleInfo.driver_name)
      SAPData.append('DRIVER_CODE', 0)
      SAPData.append('Purpose','FG_SALES')
      SAPData.append('Division', 'NLFD')
      SAPData.append('Stop_Flag', '4')

      let data = new FormData()
      data.append('parking_id', currentVehicleInfo.parking_yard_gate_id)
      data.append('trip_sheet_id', currentVehicleInfo.tripsheet_sheet_id)
      data.append('remarks', remarks || '')
      data.append('updated_by', user_id)

      console.log(values.remarks)

      if (remarks == '' || remarks == null) {
        toast.warning('Remarks Field is Mandatory')
        setFetch(true)
        return false
      }

      TripSheetInfoService.StartTSInfoToSAP(SAPData).then((response) => {
        console.log("SAP Data CANCEL ")
        console.log(response)
        console.log(response.data)
        let sap_status = response.data[0].STATUS
        console.log(sap_status)
        if (sap_status == '1') {
          // setFetch(true)
          console.log("SAP Response Start ")
          console.log(sap_status)
          console.log("SAP Response End ")
          data.append('sap_flag','2')
          console.log(data)

          TripSheetCreationService.tripSheet_cancel(id,data).then((res) => {
            if (res.status == 200) {
              setFetch(true)
              toast.success('Party Vehicle TripSheet Cancelled Sucessfully..')
              navigation('/TripSheetEditHome')
            }
          })

          .catch((error) => {
            setFetch(true)
            toast.warning(error)
          })
        }
        else {
          setFetch(true)
          toast.warning(response.data[0].MESSAGE+'. Kindly Contact Admin..!')
            return false
        }
      })
      .catch((error) => {
        setFetch(true)
        toast.warning(error)
      })
      // setFetch(true)
      // return false
    } else {
      toast.warning('Tripsheet Details Cannot be updated in LP. Kindly contact Admin..')
      setFetch(true)
      return false
    }

  }

  const [currentVehicleInfo, setCurrentVehicleInfo] = useState({})
  const [fetch, setFetch] = useState(false)
  const [confirmBtn, setConfirmBtn] = useState(false)
  const [confirmBtn1, setConfirmBtn1] = useState(false)

  const VEHICLE_TYPE = {
    OWN: '1',
    CONTRACT: '2',
    HIRE: '3',
    PARTY: '4',
  }

  const { id } = useParams()

  function dateFormat(a) {
    let short_year = a.substring(a.lastIndexOf('-') + 1)
    let month = a.substring(a.indexOf('-') + 1, a.lastIndexOf('-'))
    let day = a.substring(0, a.indexOf('-'))
    let d = a.lastIndexOf('-')
    let year = short_year
    let new_date = year + '-' + month + '-' + day
    return new_date
  }


  useEffect(() => {

    TripSheetCreationService.getTripsheetInfoById(id).then((res) => {
      setFetch(true)
      console.log(res.data,'getTripsheetInfoById')
      values.driverId = res.data.data.driver_id
      values.Division = res.data.data.trip_sheet_info?.to_divison
      values.purpose = res.data.data.trip_sheet_info?.purpose 
      values.rmsto_type = res.data.data.trip_sheet_info?.rmsto_type
      values.freight_rate_per_tone = res.data.data.trip_sheet_info?.freight_rate_per_tone
      values.advance_amount = res.data.data.trip_sheet_info?.advance_amount
      values.advance_payment_diesel = res.data.data.trip_sheet_info?.advance_payment_diesel
      values.expected_date_time = dateFormat(res.data.data.trip_sheet_info?.expected_date_times)
      values.expected_return_date_time = dateFormat(res.data.data.trip_sheet_info?.expected_return_date_times)
      setRemarks(res.data.data.trip_sheet_info?.remarks)
      values.vehicle_sourced_by = res.data.data.trip_sheet_info?.vehicle_sourced_by
      setCurrentVehicleInfo(res.data.data)
      console.log(res.data.data)
    })
  }, [id])

  const [remarks, setRemarks] = useState('');
    const handleChangenew = event => {
    const result = event.target.value.toUpperCase();

    setRemarks(result);

  };


  const [vehicleCapacity, setVehicleCapacity] = useState([])
  const [checked, setChecked] = React.useState(false);

  useEffect(() => {
    // section for getting vehicle capacity from database
    VehicleCapacityService.getVehicleCapacity().then((res) => {
      setFetch(true)
      setVehicleCapacity(res.data.data)
    })
  }, [])





  function handleChange1(e) {
    setChecked(!checked)
    values.vehicle_capacity_id = ''
    // values.otp = ''
  }

  function ExpenseIncomePostingDate() {
    let min_date = ''
    let max_date = ''

    const getDateXDaysAgo = (numOfDays, date = new Date()) => {
        const daysAgo = new Date(date.getTime());

        daysAgo.setDate(date.getDate() - numOfDays);

        let needed_date = new Date(daysAgo).toISOString().slice(0, 10)

        return needed_date;
    }

    const getDateXDaysBefore = (numOfDays, date = new Date()) => {
        const daysAgo = new Date(date.getTime());

        daysAgo.setDate(date.getDate() + numOfDays);

        let needed_date = new Date(daysAgo).toISOString().slice(0, 10)

        return needed_date;
    }

    let today = new Date().toISOString().slice(0, 10)

    console.log(today,'today')

    const date = new Date(today);

    min_date = getDateXDaysAgo(0, date)
    // max_date = getDateXDaysBefore(30, date)
    // max_date = today

    let date_component = {}

    date_component.min_date = min_date
    date_component.max_date = max_date

    console.log(date_component,'date_component')

    return date_component
   }

   const Expense_Income_Posting_Date = ExpenseIncomePostingDate();

   /* Ask Part Start */


  const [smallFetch, setSmallFetch] = useState(false)
  const [divisionData, setDivisionData] = useState([])
  const [departmentData, setDepartmentData] = useState([])
  const [vehicleVariety, setVehicleVariety] = useState([])
  const [vehicleBody, setVehicleBody] = useState([])
  const [vrProductdata, setVrProductdata] = useState([])
  const [vrPurposedata, setVrPurposedata] = useState([])
  const [vehicleRequestsData, setVehicleRequestsData] = useState([])
  const [vrData, setVrData] = useState([])

   const ColoredLine = ({ color }) => (
    <hr
        style={{
            color: color,
            backgroundColor: color,
            height: 5
        }}
    />
  )

  const othersDivisionArray = ['','FOODS','FOODS','DETERGENTS','MINERALS','LOGISTICS','CONSUMER','IFOODS','SERVICE']

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

  const div_finder_by_vr_id  = (vrId) => {
    let vr_data = []
    vrData.map((vk,lk)=>{
      if(vrId == vk.vr_id){
        vr_data.push(vk)
      }
    })
    console.log('vrId',vrId)
    console.log('vr_data',vr_data)
    let div = '-'
    if(vr_data && vr_data.length > 0){
      if(divisionData.length > 0){
        divisionData.map((vv,kk)=>{
          if(vr_data[0].vr_division == vv.id){
            div = vv.division
          }
        })
      }
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

  /* For SAP Others Data */
  const others_hire_total_qty = (hire_data) => {
    let qty = 0
    if (hire_data.length > 0) {
      hire_data.map((val, ind) => {
        qty += Number(parseFloat(val.others_sto_delivery_quantity).toFixed(2))
      })
    }

    return qty
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

  const [fciPlantName,setFCIPlantName] = useState('')

  useEffect(() => {
    if(currentVehicleInfo.trip_sheet_info && currentVehicleInfo.trip_sheet_info.others_division)
    {  
      FCIPlantMasterService.getFCIPlantListById(currentVehicleInfo.trip_sheet_info.others_division).then((res) => {
        let plant_data = res.data.data
        console.log(res.data.data,'getFCIPlantListById')
        setFCIPlantName(plant_data.plant_name)
      })
    }
  },[currentVehicleInfo,currentVehicleInfo.trip_sheet_info])

  const fciPlantInfoFinder = (plant_id,type) => {  
    let plantName = '-'
    if(plant_id)
    {
      FCIPlantMasterService.getFCIPlantListById(plant_id).then((res) => {
        let plant_data = res.data.data
        console.log(res.data.data,'getFCIPlantListById')
        plantName = plant_data.plant_name
      })
    }
    return plantName
  }

  useEffect(() => {

    VehicleBodyTypeService.getVehicleBody().then((res) => {
      setVehicleBody(res.data.data)
    })

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

    //section for getting vehicle variety from database
    VehicleVarietyService.getVehicleVariety().then((res) => {
      setVehicleVariety(res.data.data)
    })

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

   useEffect(()=>{

    if(currentVehicleInfo && currentVehicleInfo.trip_sheet_info){
      console.log(currentVehicleInfo.trip_sheet_info.vehicle_requests,'vehicle_requests')

      let veh_req = currentVehicleInfo.trip_sheet_info.vehicle_requests // 7,8,9

      if(veh_req != null){

        const formData = new FormData()
        formData.append('vr_string', veh_req)

        ParkingYardGateService.fetchVRList(formData).then((res) => {
          setSmallFetch(true)
          console.log(res,'fetchVRList')
          let vrlistData = res.data.data
          setVehicleRequestsData(vrlistData)

        })

      } else {
        setSmallFetch(true)
      }

    }

  },[currentVehicleInfo, currentVehicleInfo.trip_sheet_info])

  return (
    <>
      {!fetch && <Loader />}
      {fetch && (
       <>

        {screenAccess ? (
         <>
          <CCard>
            <CTabContent>
              <CTabPane role="tabpanel" aria-labelledby="home-tab" visible={true}>
                <CForm className="container p-3" onSubmit={handleSubmit}>
                  <CRow className="">
                    <CCol md={3}>
                      <CFormLabel htmlFor="vType">Vehicle Type</CFormLabel>
                      <CFormInput
                        name="vType"
                        size="sm"
                        id="vType"
                        value={currentVehicleInfo.vehicle_type_id?.type}
                        placeholder=""
                        readOnly
                      />
                    </CCol>

                  <CCol md={3}>
                    <CFormLabel htmlFor="vNum">Vehicle Number</CFormLabel>
                    <CFormInput
                      name="vNum"
                      size="sm"
                      id="vNum"
                      value={currentVehicleInfo.vehicle_number}
                      placeholder=""
                      readOnly
                    />
                  </CCol>

                  <CCol md={3}>
                    <CFormLabel htmlFor="vNum">Tripsheet Number</CFormLabel>
                    <CFormInput
                      name="vNum"
                      size="sm"
                      id="vNum"
                      value={currentVehicleInfo?.trip_sheet_info?.trip_sheet_no}
                      placeholder=""
                      readOnly
                    />
                  </CCol>
                  <CCol md={3}>
                    <CFormLabel htmlFor="vNum">Vehicle Capacity In MTS</CFormLabel>
                    <CFormInput
                      name="vNum"
                      size="sm"
                      id="vNum"
                      value={currentVehicleInfo?.vehicle_capacity_id?.capacity}
                      placeholder=""
                      readOnly
                    />
                  </CCol>

                  <CCol xs={12} md={3}>
                          <CFormLabel htmlFor="driverId">
                            Driver Name
                            {errors.driverId && (
                              <span className="small text-danger">{errors.driverId}</span>
                            )}
                          </CFormLabel>

                          {currentVehicleInfo?.vehicle_type_id?.id == VEHICLE_TYPE.OWN ||
                          currentVehicleInfo?.vehicle_type_id?.id == VEHICLE_TYPE.CONTRACT ? (
                            changeDriver ? (

                            <DriverListSearchSelect
                              size="sm"
                              className="mb-1"
                              onChange={(e) => {
                                onChange(e)
                              }}
                              label="driverId"
                              id="driverId"
                              name="driverId"
                              value={values.driverId}
                              search_type="driver_name"
                            />
                            /* </CFormSelect> */
                            ) : (
                              <>
                                <CFormInput
                                  name="driverId"
                                  size="sm"
                                  id="driverId"
                                  value={currentVehicleInfo?.driver_name+' - '+currentVehicleInfo?.driver_info?.driver_code}
                                  placeholder="10"
                                  readOnly
                                />
                              </>
                            )
                          ) : (
                            <CFormInput
                              name="driverId"
                              size="sm"
                              id="driverId"
                              value={currentVehicleInfo?.driver_name}
                              placeholder="10"
                              readOnly
                            />
                          )}
                        </CCol>
                        <CCol xs={12} md={3}>
                          <CFormLabel htmlFor="dMob">Driver Contact Number</CFormLabel>
                          <CFormInput
                            name="dMob"
                            size="sm"
                            id="dMob"
                            value={
                              driverChange
                                ? driverPhoneNumberById
                                : currentVehicleInfo.driver_contact_number
                            }
                            readOnly
                          />
                  </CCol>

                  <CCol md={3}>
                    <CFormLabel htmlFor="vNum">Advance Eligiblity</CFormLabel>
                    <CFormInput
                      name="vNum"
                      size="sm"
                      id="vNum"
                      value={currentVehicleInfo?.trip_sheet_info?.trip_advance_eligiblity == 1 ? 'Yes':'No'}
                      placeholder=""
                      readOnly
                    />
                  </CCol>

                  {!(values.purpose == 3 || values.purpose == 4 || values.purpose == 5 || values.purpose == null) ? (
                    <>
                      <CCol xs={12} md={3}>
                        <CFormLabel htmlFor="Division">
                        Division
                        </CFormLabel>
                        <CFormSelect
                          name="Division"
                          size="sm"
                          id="Division"
                          onFocus={onFocus}
                          onBlur={onBlur}
                          onChange={handleChange}
                          value={values.Division}
                        >
                      {/* <option value="">Select...</option> */}
                      <option value="1">NLFD</option>
                      <option value="2">NLCD</option>
                      </CFormSelect>
                      </CCol>
                      <CCol xs={12} md={3}>
                        <CFormLabel htmlFor="purpose">
                        Purpose
                        </CFormLabel>
                        <CFormSelect
                          name="purpose"
                          size="sm"
                          id="purpose"
                          onFocus={onFocus}
                          onBlur={onBlur}
                          onChange={handleChange}
                          value={values.purpose}
                          disabled={currentVehicleInfo?.tripsheet_open_status == '1' && values.purpose == '2' && (currentVehicleInfo?.vehicle_current_position == '37' || currentVehicleInfo?.vehicle_current_position == '39' || currentVehicleInfo?.vehicle_current_position == '41')}
                        >
                      {/* <option value="">Select...</option> */}
                      <option value="1">FG Sales</option>
                      <option value="2">FG STO</option>
                      {/* <option value="3">RM STO</option> */}
                      </CFormSelect>
                      </CCol>
                    </>) : (
                    <>
                      {(values.purpose == 3 || values.purpose == 5) && (
                        <>
                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="dMob">Division</CFormLabel>
                            <CFormInput
                              name="nlfd_div"
                              size="sm"
                              id="nlfd_div"
                              value={'NLFD'}
                              placeholder="10"
                              readOnly
                            />
                          </CCol>
                          {values.purpose == 5 && (
                            <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="dMob">FCI Plant name</CFormLabel>
                            <CFormInput
                              name="nlfd_div"
                              size="sm"
                              id="nlfd_div"
                              value={fciPlantName || fciPlantInfoFinder(currentVehicleInfo?.trip_sheet_info?.others_division,1)}
                              placeholder="10"
                              readOnly
                            />
                          </CCol>
                          )}
                        </>
                      )}
                      {values.purpose == 4 || (values.purpose == 3 && currentVehicleInfo?.vehicle_type_id?.id == VEHICLE_TYPE.HIRE) ? (
                        <CCol xs={12} md={3}>
                          <CFormLabel htmlFor="dMob">Purpose</CFormLabel>
                          <CFormInput
                            name="other_purpose"
                            size="sm"
                            id="other_purpose"
                            value={values.purpose == '4' ? 'OTHERS' : 'RMSTO'}
                            placeholder="10"
                            readOnly
                          />
                        </CCol>) : (
                          <>
                          { values.purpose != null &&
                            <CCol xs={12} md={3}>
                              <CFormLabel htmlFor="purpose">
                                Purpose
                              </CFormLabel>
                              <CFormSelect
                                name="purpose"
                                size="sm"
                                id="purpose"
                                onFocus={onFocus}
                                onBlur={onBlur}
                                onChange={handleChange}
                                value={values.purpose}
                              >
                                {/* <option value="">Select...</option> */}
                                  <option value="3">RMSTO</option>
                                  <option value="5">FCI</option> 
                              </CFormSelect>
                            </CCol>
                          }
                            { values.purpose == 3 &&
                              <CCol xs={12} md={3}>
                                <CFormLabel htmlFor="rmsto_type">
                                  RMSTO Type  
                                </CFormLabel>
                                <CFormSelect
                                  size="sm"
                                  name="rmsto_type"
                                  onFocus={onFocus}
                                  onBlur={onBlur}
                                  onChange={handleChange}
                                  value={values.rmsto_type} 
                                  aria-label="Small select example"
                                  id="rmsto_type"
                                >
                                  <option value="">Select...</option>
                                  {rmstoProcessTypes.map(({definition_list_name}) => {
                                    return (
                                      <>
                                        <option value={definition_list_name}>{definition_list_name}</option>
                                      </>
                                    )
                                  })}
                                </CFormSelect>
                              </CCol>
                            }
                          </>
                        )}
                      </>
                    )}

                  { values.purpose == 2 &&
                  <CCol md={3}>
                    <CFormLabel htmlFor="vehicle_sourced_by">Vehicle Sourced By</CFormLabel>
                    <CFormSelect
                      name="vehicle_sourced_by"
                      size="sm"
                      id="vehicle_sourced_by"
                      onFocus={onFocus}
                      onBlur={onBlur}
                      onChange={handleChange}
                      value={values.vehicle_sourced_by}
                    >
                      <option value="0">Select ...</option>
                      <option value="1">Logistics Team</option>
                      <option value="2" hidden>WH Team</option>
                      <option value="3">Inventory Team</option>
                    </CFormSelect>
                  </CCol>}
                  { !(values.purpose == 4 || values.purpose == 3 || values.purpose == 5 ) && (
                    <>
                      {currentVehicleInfo?.vehicle_type_id?.id == 3 &&
                        <CCol xs={12} md={3}>
                          <CFormLabel htmlFor="freight_rate_per_tone">Freight Rate Per Ton</CFormLabel>
                          <CFormInput
                            type='number'
                            name="freight_rate_per_tone"
                            size="sm"
                            id="freight_rate_per_tone"
                            value={values.freight_rate_per_tone}
                            onFocus={onFocus}
                            onBlur={onBlur}
                            onChange={handleChange}
                            maxLength={4}
                          />
                        </CCol>
                      }
                    
                      {values.purpose != null && currentVehicleInfo?.trip_sheet_info?.advance_status == '0'&&
                        <CCol xs={12} md={3}>
                          <CFormLabel htmlFor="advance_amount">Advance Payment</CFormLabel>
                          <CFormInput
                            type='number'
                            name="advance_amount"
                            size="sm"
                            id="advance_amount"
                            value={values.advance_amount}
                            onFocus={onFocus}
                            onBlur={onBlur}
                            onChange={handleChange}
                            maxLength={6}
                            // readOnly
                          />
                        </CCol>
                      }
                  
                      {currentVehicleInfo.vehicle_type_id?.id == 3 &&
                        <CCol xs={12} md={3}>
                          <CFormLabel htmlFor="advance_payment_diesel">Advance Payment Diesel</CFormLabel>
                          <CFormInput
                            type='number'
                            name="advance_payment_diesel"
                            size="sm"
                            id="advance_payment_diesel"
                            value={values.advance_payment_diesel}
                            onFocus={onFocus}
                            onBlur={onBlur}
                            onChange={handleChange}
                            maxLength={6}
                          />
                        </CCol>
                      }
                    
                      { values.purpose != null &&
                        <CCol xs={12} md={3}>
                          <CFormLabel htmlFor="expected_date_time">
                            Expected Delivery Date
                          </CFormLabel>
                          <CFormInput
                            size="sm"
                            id="expected_date_time"
                            name="expected_date_time"
                            type="date"
                            onFocus={onFocus}
                            onBlur={onBlur}
                            onChange={handleChange}
                            value={values.expected_date_time}
                            min={Expense_Income_Posting_Date.min_date}
                            max={Expense_Income_Posting_Date.max_date}
                            onKeyDown={(e) => {
                              e.preventDefault();
                            }}
                          />
                        </CCol>
                      }
                      {currentVehicleInfo.vehicle_type_id?.id < 3 &&
                        <CCol xs={12} md={3}>
                          <CFormLabel htmlFor="expected_return_date_time">
                            Expected Return Date
                          </CFormLabel>
                          <CFormInput
                            size="sm"
                            type='date'
                            id="expected_return_date_time"
                            name="expected_return_date_time"
                            onFocus={onFocus}
                            onBlur={onBlur}
                            onChange={handleChange}
                            value={values.expected_return_date_time}
                            min={Expense_Income_Posting_Date.min_date}
                            max={Expense_Income_Posting_Date.max_date}
                            onKeyDown={(e) => {
                              e.preventDefault();
                            }}
                          />
                        </CCol>
                      }
                    </>
                  )}

                  {currentVehicleInfo && currentVehicleInfo.trip_sheet_info && currentVehicleInfo.trip_sheet_info.purpose == 4 && (
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
                      <ColoredLine color="red" />
                      {!smallFetch && <SmallLoader />}
                      {smallFetch && vehicleRequestsData.map((currentVrData,kk)=>{
                        return (
                          <>
                            <CRow>
                              <CCol xs={12} md={3}>
                                <CFormLabel htmlFor="tNum">{kk+1} ) VR No</CFormLabel>
                                <CFormInput
                                  size="sm"
                                  id="tNum"
                                  value={currentVrData.vr_no}
                                  readOnly
                                />
                              </CCol>
                              <CCol xs={12} md={3}>
                                <CFormLabel htmlFor="tNum">Division</CFormLabel>
                                <CFormInput
                                  size="sm"
                                  id="tNum"
                                  value={div_finder(currentVrData.vr_division)}
                                  readOnly
                                />
                              </CCol>
                              <CCol xs={12} md={3}>
                                <CFormLabel htmlFor="tNum">Department</CFormLabel>
                                <CFormInput
                                  size="sm"
                                  id="tNum"
                                  value={dep_finder(currentVrData.vr_dept)}
                                  readOnly
                                />
                              </CCol>
                              <CCol xs={12} md={3}>
                                <CFormLabel htmlFor="tNum">Purpose</CFormLabel>
                                <CFormInput
                                  size="sm"
                                  id="tNum"
                                  value={(purp_finder(currentVrData.vr_purpose))}
                                  readOnly
                                />
                              </CCol>
                              <CCol xs={12} md={3}>
                                <CFormLabel htmlFor="tNum">Product</CFormLabel>
                                <CFormInput
                                  size="sm"
                                  id="tNum"
                                  value={prod_finder(currentVrData.vr_prod)}
                                  readOnly
                                />
                              </CCol>
                              <CCol xs={12} md={3}>
                                <CFormLabel htmlFor="tNum">From Location</CFormLabel>
                                <CFormInput
                                  size="sm"
                                  id="tNum"
                                  value={currentVrData.vr_from_loc}
                                  readOnly
                                />
                              </CCol>
                              <CCol xs={12} md={3}>
                                <CFormLabel htmlFor="tNum">To Location</CFormLabel>
                                <CFormInput
                                  size="sm"
                                  id="tNum"
                                  value={currentVrData.vr_to_loc}
                                  readOnly
                                />
                              </CCol>
                              <CCol xs={12} md={3}>
                                <CFormLabel htmlFor="tNum">Request By</CFormLabel>
                                <CFormInput
                                  size="sm"
                                  id="tNum"
                                  value={`${currentVrData.request_by} (${currentVrData.contact_no})`}
                                  readOnly
                                />
                              </CCol>
                              <CCol xs={12} md={3}>
                                <CFormLabel htmlFor="tNum">Vehicle Capacity (TON)</CFormLabel>
                                <CFormInput
                                  size="sm"
                                  id="tNum"
                                  value={veh_capacity_finder(currentVrData.vr_capacity_id)}
                                  readOnly
                                />
                              </CCol>
                              <CCol xs={12} md={3}>
                                <CFormLabel htmlFor="tNum">Vehicle Body Type / Variety</CFormLabel>
                                <CFormInput
                                  size="sm"
                                  id="tNum"
                                  value={`${veh_body_finder(currentVrData.vr_body_id)} / ${veh_variety_finder(currentVrData.vr_variety_id) || '-'}`}
                                  readOnly
                                />
                              </CCol>
                              <CCol xs={12} md={3}>
                                <CFormLabel htmlFor="tNum">Remarks</CFormLabel>
                                <CFormInput
                                  size="sm"
                                  id="tNum"
                                  value={currentVrData.veh_remarks}
                                  readOnly
                                />
                              </CCol>
                              <CCol xs={12} md={3}>
                                <CFormLabel htmlFor="tNum">Expected Date</CFormLabel>
                                <CFormInput
                                  size="sm"
                                  id="tNum"
                                  value={currentVrData.require_time_date_string}
                                  readOnly
                                />
                              </CCol>
                            </CRow>
                            <ColoredLine color="red" />
                          </>
                        )
                      })}
                    </>
                  )}
                  <CCol xs={12} md={3}>
                    <CFormLabel htmlFor="remarks">Remarks</CFormLabel>
                    <CFormTextarea
                      id="remarks"
                      onFocus={onFocus}
                      onBlur={onBlur}
                      onChange={handleChangenew}
                      value={remarks}
                      name="remarks"
                      rows="1"
                    >
                    </CFormTextarea>
                  </CCol>

                </CRow>
                <CRow className="mt-2">
                  <CCol>
                    <Link to={'/TripSheetEditHome'}>
                      <CButton
                        md={9}
                        size="sm"
                        color="primary"
                        disabled=""
                        className="text-white"
                        type="button"
                      >
                        Previous
                      </CButton>
                    </Link>
                  </CCol>

                  <CCol
                    className="pull-right"
                    xs={12}
                    sm={12}
                    md={3}
                    style={{ display: 'flex', justifyContent: 'flex-end' }}
                  >
                    {/* {!(values.purpose == 3 || values.purpose == 4) && ( */}
                    {!(values.purpose == 4 || values.purpose == null) && (
                      <CButton
                        size="sm"
                        color="warning"
                        className="mx-1 px-2 text-white"
                        type="button"
                        // disabled={acceptBtn}
                        onClick={() => {
                          setConfirmBtn(true)
                        }}
                      >
                        Submit
                      </CButton>
                    )}
                   {((currentVehicleInfo.vehicle_current_position == '16' && currentVehicleInfo?.trip_sheet_info?.advance_status == '0') || values.purpose == null) &&
                    <CButton
                      size="sm"
                      color="warning"
                      className="mx-1 px-2 text-white"
                      type="button"
                      // disabled={acceptBtn}
                      onClick={() => {
                        setConfirmBtn1(true)

                      }}
                    >
                      TripSheet Cancel
                    </CButton>}
                    {(!(values.purpose == 3 || values.purpose == 4 || values.purpose == 5) && !changeDriver && currentVehicleInfo?.trip_sheet_info?.advance_status == '0' &&
                          (currentVehicleInfo?.vehicle_type_id?.id == VEHICLE_TYPE.OWN) ||
                        currentVehicleInfo?.vehicle_type_id?.id == VEHICLE_TYPE.CONTRACT) ? (
                          <CButton
                            size="sm"
                            color="warning"
                            className="mx-1 px-2 text-white"
                            type="button"
                            onClick={() => {
                              setOldDriver(currentVehicleInfo?.driver_id)
                              setChangeDriver(true)
                              setDriverChange(true)
                            }}
                          >
                            Assign Driver
                          </CButton>
                        ) : (
                          <></>
                        )}
                  </CCol>
                </CRow>
              </CForm>
            </CTabPane>
          </CTabContent>
        </CCard>
         </>
	      ) : (<AccessDeniedComponent />)}
   	   </>
      )}
      <CModal visible={confirmBtn} onClose={() => setConfirmBtn(false)}>
        <CModalBody>
          <p className="lead">Are You sure To Edit TripSheet ? </p>
        </CModalBody>
        <CModalFooter>
          <CButton className="m-2" color="secondary" onClick={() =>setConfirmBtn(false)}>
            No
          </CButton>
          <CButton color="warning" onClick={() => {
            setConfirmBtn(false)
            setFetch(false)
            UpdateTripsheetVehicle()}}>
            Yes
          </CButton>
        </CModalFooter>
      </CModal>

      <CModal visible={confirmBtn1} onClose={() => setConfirmBtn1(false)}>
        <CModalBody>
          <p className="lead" style={{ color:'red' }}>Are You sure To Cancel This TripSheet ? </p>
        </CModalBody>
        <CModalFooter>
          <CButton className="m-2" color="secondary" onClick={() =>setConfirmBtn1(false)}>
            No
          </CButton>
          <CButton color="warning" onClick={() => {
            setConfirmBtn1(false)
            setFetch(false)
            TripSheetCancel()}}>
            Yes
          </CButton>
        </CModalFooter>
      </CModal>

    </>
  )
}

export default TripSheetEditRequest
