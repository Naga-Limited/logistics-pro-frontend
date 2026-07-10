import React, { useState } from 'react'
import {
  CButton,
  CCard,
  CCardImage,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
  CFormTextarea,
  CFormSelect,
} from '@coreui/react'
import useForm from 'src/Hooks/useForm'
import { Link, useNavigate, useParams } from 'react-router-dom'
import TripSheetCreationValidation from 'src/Utils/TripSheetCreation/TripSheetCreationValidation'
import TripSheetCreationOwn from './segments/OwnAndContract/TripSheetCreationOwn'
import TripSheetCreationHire from './segments/Hire/TripSheetCreationHire'
import { useEffect } from 'react'
import TripSheetCreationService from 'src/Service/TripSheetCreation/TripSheetCreationService'
import { Object } from 'core-js'
import OwnAndContractCreateTripSheetRequest from './Requests/OwnAndContractCreateTripSheetRequest'
import HireCreateTripSheetRequest from './Requests/HireCreateTripSheetRequest'
import { ToastContainer, toast } from 'react-toastify'
import Loader from 'src/components/Loader'
import Swal from 'sweetalert2'
import 'react-toastify/dist/ReactToastify.css'
import TripSheetInfoService from 'src/Service/PurchasePro/TripSheetInfoService'
import VehicleVarietyService from 'src/Service/SmallMaster/Vehicles/VehicleVarietyService'
import PerviousLoadDetailsService from 'src/Service/PerviousLoadDetails/PerviousLoadDetailsService'
import DefinitionsListApi from 'src/Service/Definitions/DefinitionsListApi'
import UserLoginMasterService from 'src/Service/Master/UserLoginMasterService'

const TripSheetCreation = () => {
  const user_info_json = localStorage.getItem('user_info')
  const user_info = JSON.parse(user_info_json)

  /* Get User Id From Local Storage */
  const user_id = user_info.user_id

  const formValues = {
    vehicle_id: '',
    vehicle_location_code: '',
    vehicle_type_id: '',
    driver_id: '',
    division_id: '',
    trip_advance_eligiblity: '',
    advance_amount: '',
    purpose: '',
    Vehicle_Sourced_by: '',
    expected_date_time: '',
    expected_return_date_time: '',
    freight_rate_per_tone: '',
    advance_payment_diesel: '',
    parking_id: '',
    remarks: '',
    driveMobile: '',
    others_division: '',
    others_department: '',
    others_process: '',
    rmsto_type: '',
    plantName: '',
    vehicle_request_no:[]
  }

  const { id } = useParams()

  const [singleVehicleInfo, setSingleVehicleInfo] = useState(false)

  const [dirverAssign, setDirverAssign] = useState(true)

  const [driverChange, setDriverChange] = useState(false)
  const [DriverPhoneNumberById, setDriverPhoneNumberById] = useState('')
  const [ChangeDriverData, setChangeDriverData] = useState({})
  const [ChangeFciPlantData,setChangeFciPlantData] = useState({})
  const [openTripsheetCount, setOpenTripsheetCount] = useState(0)
  const [openOthersTripsheetCount, setOpenOthersTripsheetCount] = useState(0)
  const [vehicleId, setVehicleId] = useState('')
  const [fetch, setFetch] = useState(false)
  // const [ppUnStoppedTripsheet, setPPUnStoppedTripsheet] = useState(false)
  // const [ppUnStoppedTripsheetData, setPPUnStoppedTripsheetData] = useState([])
  const [sapUnStoppedTripsheet, setSAPUnStoppedTripsheet] = useState(false)
  const [sapUnStoppedTripsheetData, setSAPUnStoppedTripsheetData] = useState([])
  const [changeDriver, setChangeDriver] = useState(false)
  const [validateSubmit, setValidateSubmit] = useState(true)
  const navigation = useNavigate()
  const vehicleType = {
    OWN: 1,
    CONTRACT: 2,
    HIRE: 3,
  }

  const Purpose = [
    { id: 1, purpose: 'FG-Sales' },
    { id: 2, purpose: 'FG-STO' },
    { id: 3, purpose: 'RM-STO' },
    { id: 4, purpose: 'Others' },
    { id: 5, purpose: 'FCI' },
  ]

  const SourcedBy = [
    { id: 1, team: 'Logistics Team' },
    { id: 2, team: 'WM-Team' },
    { id: 3, team: 'Dispatch Team' },
  ]

  const OtherProcess = [
    { id: 1, process: 'Purchase Order' },
    { id: 2, process: 'Stock Transfer Order' },
    { id: 3, process: 'Gate Pass' },
  ]

  const DivisonList = [
    { id: 1, division: 'NLFD' },
    { id: 2, division: 'NLCD' },
  ]
  const purpose_array = ['FG_SALES','FG_STO','RM_STO','OTHERS','FCI']
  const old_trip_purpose_array = ['','FG_SALES','FG_STO','RM_STO','OTHERS','FCI']
  const division_array = ['NLFD','NLCD']
  const OthersDivisionArray = ['','NLFD','NLFA','NLDV','NLMD','NLLD','NLCD','NLIF','NLSD']

  useEffect(() => {
    TripSheetCreationService.getSingleVehicleInfoOnGate(id).then((res) => {
      setFetch(true)
      console.log(res.data.data,'getSingleVehicleInfoOnGate')
      if (res.status === 200) {
        isTouched.vehicle_id = true
        isTouched.parking_id = true
        isTouched.driver_id = true
        isTouched.vehicle_type_id = true
        isTouched.remarks = true
        values.vehicle_type_id = res.data.data.vehicle_type_id.id
        values.parking_id = res.data.data.parking_yard_gate_id
        values.vehicle_id = res.data.data.vehicle_id
        setVehicleId(res.data.data.vehicle_id)
        values.driver_id =
          res.data.data.driver_info != null ? res.data.data.driver_info.driver_id : ''
        values.driveMobile =
          res.data.data.driver_info != null ? res.data.data.driver_info.driver_phone_1 : ''

        values.vehicle_location_id = res.data.data.vehicle_location_info.location_alpha_code
        values.purpose = res.data.data.trip_sto_status == '1' ? (res.data.data.vehicle_current_position == '7' ? 4 : (res.data.data.vehicle_current_position == '10' ? 5 : 3)) : ''
        values.freight_rate_per_tone =
          res.data.data.vehicle_Freight_info == undefined
            ? '0'
            : res.data.data.vehicle_Freight_info.freight_rate_per_ton
        setSingleVehicleInfo(res.data.data)
        console.log(singleVehicleInfo)
      }
    })
  }, [])

  const [userData, setUserData] = useState([])
  const [stopFlagModalEnable, setStopFlagModalEnable] = useState(false)
  useEffect(() => {
    UserLoginMasterService.getUser().then((res) => {
      let user_data = res.data.data
      console.log(user_data)
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
  const timeConvert = (x) => {
    var date = new Date(x)
    let dt = date.toLocaleDateString() 
    let time = date.toLocaleTimeString()
    let con_time = `${dt} ${time}`
    return con_time
  }
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
  

   /* ========= Purchase Pro Stop Call Check For Hire Vehicle Start ========= */

  //  console.log(ppUnStoppedTripsheet,'ppUnStoppedTripsheet')
  //  console.log(ppUnStoppedTripsheetData,'ppUnStoppedTripsheetData')

  //  useEffect(()=>{

  //    if(singleVehicleInfo && singleVehicleInfo.trip_sto_status == 1 && singleVehicleInfo.vehicle_type_id.id == vehicleType.HIRE){
  //      TripSheetCreationService.getPPUnstoppedVehicleInfo(singleVehicleInfo.vehicle_id).then((res) => {
  //        if(res.status == 201 && res.data && res.data.pp_code == 2) {
  //          console.log(res)
  //          setPPUnStoppedTripsheet(true)
  //          setPPUnStoppedTripsheetData(res.data.pp_unstop_data)
  //        }
  //      })
  //    }

  //  },[singleVehicleInfo])


  //  const StopPPEndCall = (e) => {
  //    setFetch(false)
  //    let PPData = new FormData()
  //    PPData.append('VEHICLE_NO', singleVehicleInfo.vehicle_number)
  //    PPData.append('VEHICLE_TYPE', 'HIRE')
  //    PPData.append('TRIPSHEET_NO', ppUnStoppedTripsheetData.trip_sheet_no)
  //    PPData.append('DRIVER_NAME', singleVehicleInfo.driver_name)
  //    PPData.append('DRIVER_MOBILE_NO', singleVehicleInfo.driver_contact_number)
  //    PPData.append('PROCESS_TYPE', 'STOP')

  //    TripSheetInfoService.StopTSInfoToPP(PPData).then((response) => {
  //      if (response.data.pp_status == '1') {
  //        TripSheetCreationService.setPPFlagAsStop(ppUnStoppedTripsheetData.trip_sheet_no).then((res) => {

  //            console.log(res)
  //            if (res.status == 200) {
  //              setFetch(true)
  //              toast.success('LP - PP Stop Process Done Successfully!')
  //              navigation('/TripSheetCreation')
  //            } else {
  //              setFetch(true)
  //              toast.warning('LP - PP Stop Proces Failed. Kindly contact admin.!')
  //              navigation('/TripSheetCreation')
  //            }
  //          })
  //          .catch((errortemp) => {
  //            console.log(errortemp)
  //            setFetch(true)
  //            var object = errortemp.response.data.errors
  //            var output = ''
  //            for (var property in object) {
  //              output += '*' + object[property] + '\n'
  //            }
  //            setError(output)
  //            setErrorModal(true)
  //          })
  //      } else {
  //        setFetch(true)
  //        toast.warning(
  //          'There is a Problem to sent Tripsheet Number to Purchase Pro. Kindly Contact Admin..!'
  //        )
  //        return false
  //      }
  //    })
  //    .catch((error) => {
  //      setFetch(true)
  //      toast.warning(error)
  //    })

  //  }

   /* ========= Purchase Pro Stop Call Check For Hire Vehicle End ========= */

  /* ========= SAP Stop Call Check For Hire Vehicle Start ========= */

 console.log(sapUnStoppedTripsheet,'sapUnStoppedTripsheet')
 console.log(sapUnStoppedTripsheetData,'sapUnStoppedTripsheetData')
  useEffect(()=>{

    console.log(singleVehicleInfo)

      if(singleVehicleInfo ){
      // TripSheetCreationService.getSAPUnstoppedVehicleInfo(singleVehicleInfo.vehicle_type_id.id==3).then((res) => {
      TripSheetCreationService.getSAPUnstoppedVehicleInfo(singleVehicleInfo.vehicle_id).then((res) => {
        console.log(res)
        if(res.status == 201 && res.data && res.data.sap_code == 2) {
          console.log(res)
          setSAPUnStoppedTripsheet(true)
          setSAPUnStoppedTripsheetData(res.data.sap_unstop_data)
        }
      })
    }

  },[singleVehicleInfo])

  console.log(ChangeDriverData,'ChangeDriverData')
  console.log(driverChange,'driverChange')

  const StopSAPEndCall = (e) => {
    setFetch(false)
    let SAPData = new FormData()
    SAPData.append('VEHICLE_NO', singleVehicleInfo.vehicle_number)
    SAPData.append('VEHICLE_TYPE', vehicle_type_find(singleVehicleInfo.vehicle_type_id.id))
    SAPData.append('TRIP_SHEET',sapUnStoppedTripsheetData.trip_sheet_no)
    SAPData.append('DRIVER_NAME',sapUnStoppedTripsheetData.parking__yard.driver_name)
    SAPData.append('DRIVER_CODE', '0' )
    SAPData.append('DRIVER_PH_NO',sapUnStoppedTripsheetData.parking__yard.driver_contact_number)
    //SAPData.append('DRIVER_NAME',driver_info_find('name'))
   // SAPData.append('DRIVER_CODE', driver_info_find('code') )
   // SAPData.append('DRIVER_PH_NO',driver_info_find('contact_no'))
    SAPData.append('Purpose', purpose_array[sapUnStoppedTripsheetData.purpose-1])
    SAPData.append('Division', values.purpose == 3 || values.purpose == 5 ? 'NLFD':  (values.purpose == 4 ? '' : division_array[sapUnStoppedTripsheetData.to_divison-1]))
    SAPData.append('Stop_Flag', '4')
    console.log(singleVehicleInfo.vehicle_number)
    console.log(singleVehicleInfo.vehicle_type_id.id)
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
              navigation('/TripSheetCreation')
            } else {
              setFetch(true)
              toast.warning('LP - SAP Stop Proces Failed. Kindly contact admin.!')
              navigation('/TripSheetCreation')
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

  const tscountfinder = (data,type) => {

    let tripcountdata = []
    if(type == 1){
      tripcountdata = data.filter(
        (data) =>data.trip_sheet_info != null && data.trip_sheet_info.purpose == '4'
      )
    } else {
      tripcountdata = data.filter(
        (data) => (data.trip_sheet_info && data.trip_sheet_info.purpose != '4') || data.trip_sheet_info == null
      )
    }

    console.log(tripcountdata,type == 1 ? 'othersopentripsheetcountdata' : 'regularopentripsheetcountdata')
    return tripcountdata
  }

  /* ========= SAP Stop Call Check For Hire Vehicle End ========= */

  useEffect(() => {
    if (vehicleId) {
      TripSheetCreationService.getOpenTripsheetDataByVehicleId(vehicleId).then((res) => {
        
        setFetch(true)
        let respose_data = res.data.data
        console.log(respose_data,'getOpenTripsheetDataByVehicleId')
        if(respose_data.length > 0){
          let OOTC = tscountfinder(respose_data,1) /* Others Open Tripsheet Count */
          let ROTC = tscountfinder(respose_data,2) /* Regular Open Tripsheet Count */
          let open_tripsheet_count = Object.keys(ROTC).length
          let open_others_tripsheet_count = Object.keys(OOTC).length
          setOpenTripsheetCount(open_tripsheet_count)
          setOpenOthersTripsheetCount(open_others_tripsheet_count)
        }
        
      })
    }
  }, [vehicleId])

  const [vehicleVarietyData, setVehicleVarietyData] = useState([])

  const [loadDetails, setLoadDetails] = useState([])
  const [rmstoProcessTypes, setRmstoProcessTypes] = useState([])

  useEffect(() => {
    //fetch to get Previous Load Details list form master
    PerviousLoadDetailsService.getPerviousLoadDetails().then((res) => {
      console.log(res.data)
      setLoadDetails(res.data.data)
    })

    /* section for getting Rmsto Process Types Master List from database */
    DefinitionsListApi.visibleDefinitionsListByDefinition(26).then((response) => {
      console.log(response.data.data,'setRmstoProcessTypes')
      setRmstoProcessTypes(response.data.data)
    })
  }, [])


  const get_vehicle_loadDetails_by_id = (id) => {
    let val = ''
    loadDetails.map((vv,kk)=>{
      if(vv.id === id){
        val = vv.previous_load_details
      }
    })
    return val
  }

  useEffect(() => {
    //section for getting vehicle variety from database
    VehicleVarietyService.getVehicleVariety().then((res) => {
      setVehicleVarietyData(res.data.data)
    })
  },[singleVehicleInfo])

  const get_vehicle_variety_by_id = (id) => {
    let val = ''
    vehicleVarietyData.map((vv,kk)=>{
      if(vv.id === id){
        val = vv.vehicle_variety
      }
    })
    return val
  }

  const { values, errors, handleChange,handleMultipleChange, onFocus, handleSubmit, enableSubmit, onBlur, isTouched } =
    useForm(createTripSheet, TripSheetCreationValidation, formValues)

    console.log(values.vehicle_request_no,'values.vehicle_request_no')

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

  // const driver_info_find = (info_type) => {
  //   // console.log(driver_trip_id, 'driver_trip_id')
  //   console.log(info_type, 'info_type')

  //   if (info_type == 'name') {
  //     if (singleVehicleInfo.driver_id === null) {
  //       return singleVehicleInfo.driver_name
  //     } else {
  //       return singleVehicleInfo.driver_info.driver_name
  //     }
  //   }

  //   if (info_type == 'contact_no') {
  //     return singleVehicleInfo.driver_contact_number
  //   }
  //   return ''
  // }

  const fciPlantInfoFinder = (value,type) => {
    let fciData = {}
    fciPlantData.map((vh,kh)=>{
      if(vh.plant_id == value){
        fciData = vh
      }
    })
    console.log(fciData,'fciData')

    let neededValueArray = ['',fciData['plant_name'],fciData['plant_symbol'],fciData['company_name'],fciData['street_no'],fciData['street_name'],fciData['city'],fciData['state'],fciData['region'],fciData['postal_code'],fciData['gst_no'],fciData['remarks']]
    console.log(neededValueArray,'neededValueArray')

    return neededValueArray[type]

  }

  const driver_info_find = (info_type) => {
    // console.log(driver_trip_id, 'driver_trip_id')
    console.log(info_type, 'info_type')

    if (info_type == 'name') {
      if (singleVehicleInfo.driver_id === null) {
        return singleVehicleInfo.driver_name
      } else {
        return singleVehicleInfo.driver_info.driver_name
      }
    }

    if (info_type == 'contact_no')
    if (singleVehicleInfo.driver_id == null) {
      return singleVehicleInfo.driver_contact_number
    }
    else
    {
      return singleVehicleInfo.driver_info.driver_phone_1
    }

    if (info_type == 'code') {
      if(singleVehicleInfo.driver_id == null){
        return "0"
      }
      else{
      return singleVehicleInfo.driver_info.driver_code
      }
    }
  }

  const othersDivisionFinder = (data) => {
    let div_id = ''

    let vr_no = data[0]
    console.log(vrDataFromGrandChild,'vrDataFromGrandChild123')
    vrDataFromGrandChild.map((vv,kk)=>{
      if(vv.vr_id == vr_no){
        div_id = vv.vr_division
      }
    })
    let division = div_id != '' && OthersDivisionArray[div_id] ? OthersDivisionArray[div_id] : div_id
    console.log(division,'division123')
    return division
  }

  const division_finder = (purpose) => {
    let div = ''

    if(purpose == '3' || purpose == '5'){
      div = 'NLFD'
    } else if(purpose == '4'){
      div = othersDivisionFinder()
    } else {
      div = division_array[values.division_id-1]
    }

    return div
  }

  function createTripSheet() {
    let data = []

    console.log(openTripsheetCount, 'openTripsheetCount')
    console.log(openOthersTripsheetCount, 'openOthersTripsheetCount')

    let total_open_tripsheets_count = openTripsheetCount+openOthersTripsheetCount
    console.log(total_open_tripsheets_count, 'total_open_tripsheets_count')

    let rotc = parseInt(singleVehicleInfo.REGULAR_OPEN_TRIPSHEET_COUNT)
    let ootc = parseInt(singleVehicleInfo.OTHERS_OPEN_TRIPSHEET_COUNT)
    let oaotc = parseInt(singleVehicleInfo.OVERALL_OPEN_TRIPSHEET_COUNT)

    console.log(rotc, 'REGULAR_OPEN_TRIPSHEET_COUNT')
    console.log(ootc, 'OTHERS_OPEN_TRIPSHEET_COUNT')
    console.log(oaotc, 'OVERALL_OPEN_TRIPSHEET_COUNT')

    if (openTripsheetCount >= rotc) {
      toast.warning(
        `Tripsheet Cannot be created because of Vehicle Already have ${rotc} Open Regular Tripsheets.`
      )
      return false
    }

    // if (openOthersTripsheetCount >= 15) {
    //   toast.warning(
    //     'Tripsheet Cannot be created because of Vehicle Already have 20 Open Other Tripsheets.'
    //   )
    //   return false
    // }

    if (total_open_tripsheets_count >= oaotc) {
      toast.warning(
        `Tripsheet Cannot be created because of Vehicle Already have ${oaotc} Open Other Tripsheets.`
      )
      return false
    }

    // return false

    if (
      values.vehicle_type_id === vehicleType.OWN ||
      values.vehicle_type_id === vehicleType.CONTRACT
    ) {
      data = OwnAndContractCreateTripSheetRequest(values,remarks)

    } else {
      data = HireCreateTripSheetRequest(values,remarks)
    }

    console.log('values')
    console.log(values)

    if (driverChange && !DriverPhoneNumberById) {
      toast.warning('Please Choose The Driver Name')
      return false
    }
    if(values.vehicle_type_id == '3' && singleVehicleInfo.trip_sto_status == null && (values.freight_rate_per_tone == 0 || values.freight_rate_per_tone < 0)) {
      toast.warning('Freight Rate Per Ton amount should be greater than 0')
      return false
    }
    if (values.purpose == '') {
      toast.warning('Purpose Required')
      return false
    // } else if (values.purpose != '3') {
    } else if (!(values.purpose == '3' || values.purpose == '4' || values.purpose == '5')) {
      if (
        values.vehicle_type_id != '3' &&
        (values.purpose == '1' || values.purpose == '2') &&
        values.division_id == ''
      ) {
        toast.warning('Division Required')
        return false
      }

      if (
        values.vehicle_type_id != '3' &&
        values.purpose == '2' &&
        values.Vehicle_Sourced_by == ''
      ) {
        toast.warning('Vehicle sourced by Required')
        return false
      }

      if (values.vehicle_type_id != '3') {
        if (values.trip_advance_eligiblity == 1 && values.advance_amount == '') {
          toast.warning('Advance Amount Required')
          return false
        } else if (values.trip_advance_eligiblity == '') {
          toast.warning('Trip Advance Eligibility Required')
          return false
        }

        if (values.expected_date_time == '') {
          toast.warning('Expected Delivery Date Required')
          return false
        }

        if (values.expected_return_date_time == '') {
          toast.warning('Expected Return Date Required')
          return false
        }
      } else {
        if (values.trip_advance_eligiblity == '') {
          toast.warning('Trip Advance Eligibility Required')
          return false
        } else if (values.trip_advance_eligiblity == '1') {
          if (values.advance_amount == '') {
            toast.warning('Advance Payment Bank Required')
            return false
          } else if (values.advance_payment_diesel == '') {
            toast.warning('Advance Payment Diesel Required')
            return false
          }
        }
      }

      if (values.expected_date_time == '') {
        toast.warning('Expected Delivery Date1 Required')
        return false
      }
    } else if (values.purpose == '3' || values.purpose == '4' || values.purpose == '5') {
      if (values.vehicle_type_id == '3' && values.purpose != '5' && values.Vehicle_Sourced_by == '') {
        toast.warning('Vehicle sourced by Required')
        return false
      }

      if (values.purpose == '5' && values.plantName == ''){
        toast.warning('FCI Plant Name Should be Required')
        return false
      }
      if (values.purpose == '4'){

        console.log('bbb')
        console.log(values.vehicle_request_no,'values.vehicle_request_no')
         

        if (values.vehicle_request_no.length === 0) {
          toast.warning('Vehicle Request No. Required')
          return false
        }

        // return false
      }

      if (values.vehicle_type_id != '3' && values.purpose == '3' && values.rmsto_type == '') {
        toast.warning('RMSTO Type Required')
        return false
      }

      if (values.expected_date_time == '') {
        toast.warning('Expected Delivery Date Required')
        return false
      }

      if (values.vehicle_type_id != '3' && values.expected_return_date_time == '') {
        toast.warning('Expected Return Date Required')
        return false
      }
 

      if (values.vehicle_type_id == '3') {
        values.trip_advance_eligiblity = 0
      }
 
    }

    data.append('created_by', user_id)
     
    setFetch(false)
 
    // Tripsheet Info - SAP Service Start
    TripSheetCreationService.getTripSheetNo(data).then((res) => {
      console.log(res,'getTripSheetNo')
      let tripsheet_no = res.data.ts_no

      console.log(singleVehicleInfo,"singleVehicleInfo")
      console.log(driver_info_find('name'),"driver_info_find")
      console.log(driver_info_find('code'),"driver_info_find")
      console.log(driver_info_find('contact_no'),"driver_info_find")
      let SAPData = new FormData()
      SAPData.append('TRIP_SHEET',tripsheet_no)
      SAPData.append('VEHICLE_NO', singleVehicleInfo.vehicle_number)
      SAPData.append('VEHICLE_TYPE', vehicle_type_find(singleVehicleInfo.vehicle_type_id.id))
      if (values.vehicle_type_id != '3'){
        SAPData.append('VEHICLE_NAME', get_vehicle_variety_by_id(singleVehicleInfo.vehicle_info.vehicle_variety_id))
      }
      SAPData.append('DRIVER_NAME', driverChange ? ChangeDriverData.driver_name : driver_info_find('name'))
      SAPData.append('DRIVER_PH_NO', driverChange ? ChangeDriverData.driver_phone_1 : driver_info_find('contact_no'))
      SAPData.append('DRIVER_CODE', driverChange ? ChangeDriverData.driver_code : driver_info_find('code') )
      SAPData.append('Purpose',purpose_array[values.purpose-1]) //purpose_array[values.purpose-1]
      // SAPData.append('Division',values.purpose== 3 ?'NLFD': division_array[values.division_id-1])
      
      if(values.purpose == 4){
        SAPData.append('Division', othersDivisionFinder(values.vehicle_request_no))
      } else {
        SAPData.append('Division', division_finder(values.purpose))
      }
      if(values.purpose == '3'){
        SAPData.append('RM_STO_TYPE', values.rmsto_type)
      }

      if(values.purpose == '5'){
        /* ========= Newly Added Fields for E-Way Bill Start ========= */
        SAPData.append('PLANT',ChangeFciPlantData.plant_symbol)
        SAPData.append('PLANT_NAME',ChangeFciPlantData.plant_name)
        SAPData.append('COMPANY_NAME',ChangeFciPlantData.company_name)
        SAPData.append('STREET_NO',ChangeFciPlantData.street_no)
        SAPData.append('STREET_NAME',ChangeFciPlantData.street_name)
        SAPData.append('CITY',ChangeFciPlantData.city)
        SAPData.append('STATE',ChangeFciPlantData.state)
        SAPData.append('POST_CODE',ChangeFciPlantData.postal_code)
        SAPData.append('REGION',ChangeFciPlantData.region)
        SAPData.append('GST_NUMBER',ChangeFciPlantData.gst_no)
        /* ========= Newly Added Fields for E-Way Bill End ========= */
      }

      if(singleVehicleInfo.vehicle_inspection_trip && !(values.purpose == '3' || values.purpose == '4' || values.purpose == '5')){
        SAPData.append('CLEAN', singleVehicleInfo.vehicle_inspection_trip.CLEAN == '1' ? 'YES' : 'NO')
        SAPData.append('ODER', singleVehicleInfo.vehicle_inspection_trip.ODER == '0' ? 'NO' : 'YES')
        SAPData.append('SRF_TAR', singleVehicleInfo.vehicle_inspection_trip.SRF_TAR)
        SAPData.append('NON_SRF_TAR', singleVehicleInfo.vehicle_inspection_trip.NON_SRF_TAR)
        SAPData.append('PLATFORM', singleVehicleInfo.vehicle_inspection_trip.PLATFORM == '1' ? 'GOOD' : 'BAD')
        SAPData.append('VEH_FOR_LOAD', singleVehicleInfo.vehicle_inspection_trip.VEH_FOR_LOAD == '1' ? 'YES' : 'NO')
        SAPData.append('PREV_LOAD_DET', get_vehicle_loadDetails_by_id(singleVehicleInfo.vehicle_inspection_trip.PREV_LOAD_DET))
      }
      SAPData.append('TRUCK_CAPACITY', singleVehicleInfo.vehicle_capacity_id ? singleVehicleInfo.vehicle_capacity_id.capacity : '')
      SAPData.append('Insert_Flag', '1')

      TripSheetInfoService.StartTSInfoToSAP(SAPData).then((response) => {
        console.log("SAP Data pass ")
        console.log(response)
        console.log(response.data)
        let sap_status = response.data[0].STATUS
        let sap_tsno = response.data[0].TRIP_SHEET
        console.log(sap_status)
        if (sap_status == '1') {
          console.log("SAP Response Start ")
          console.log(sap_status)
          console.log("SAP Response End ")
          data.append('sap_flag',sap_status)
          data.append('sap_tsno',sap_tsno)
          console.log(data)
          TripSheetCreationService.createTripSheet(data).then((res) => {
            setFetch(true)
            console.log("response.data")
            if (res.status === 200) {
              // toast.success('TripSheet Created')
              Swal.fire({
                title: 'TripSheet Created Successfully!',
                icon: "success",
                text:  'TripSheet No. : ' + sap_tsno,
                confirmButtonText: "OK",
              }).then(function () {
                navigation('/TripSheetCreation')
              });
              // navigation('/TripSheetCreation')
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
        Swal.fire({
          title: 'Server Connection Failed. Kindly contact Admin.!',
          // text:  error.response.data.message,
          text:  error.message,
          icon: "warning",
          confirmButtonText: "OK",
        }).then(function () {
          // window.location.reload(false)
        })   
      })
    })
    .catch((error) => {
      setFetch(true)
      toast.warning(error)
    })
    //Tripsheet Info - SAP End
  }

  const [vrDataFromGrandChild, setVrDataFromGrandChild] = useState('');

  const handleGrandChildData = (data) => {
    console.log(data,'handleGrandChildData')
    setVrDataFromGrandChild(data);
  }

  console.log(vrDataFromGrandChild,'vrs - child to parent component fetch data')

  useEffect(() => {
    if (Object.keys(errors).length === 0 && Object.keys(isTouched)) {
      setValidateSubmit(false)
    } else {
      setValidateSubmit(true)
    }

    console.log(singleVehicleInfo)
    console.log(values)
  })
  const [remarks, setRemarks] = useState('');
  const handleChangenew = event => {
  const result = event.target.value.toUpperCase();

  setRemarks(result);

};

  return (
    <>
      {!fetch && <Loader />}
      {fetch && (
        <>
          <CCard>
            {singleVehicleInfo && (
              <CForm className="container p-3" onSubmit={handleSubmit}>
                {singleVehicleInfo.vehicle_type_id.id === vehicleType.OWN ||
                singleVehicleInfo.vehicle_type_id.id === vehicleType.CONTRACT ? (
                  <TripSheetCreationOwn
                    values={values}
                    errors={errors}
                    handleChange={handleChange}
                    handleMultipleChange={handleMultipleChange}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    singleVehicleInfo={singleVehicleInfo}
                    isTouched={isTouched}
                    dirverAssign={dirverAssign}
                    setDirverAssign={setDirverAssign}
                    driverChange={driverChange}
                    setDriverChange={setDriverChange}
                    DriverPhoneNumberById={DriverPhoneNumberById}
                    setDriverPhoneNumberById={setDriverPhoneNumberById}
                    ChangeDriverData={ChangeDriverData}
                    setChangeDriverData={setChangeDriverData}
                    setChangeFciPlantData={setChangeFciPlantData}
                    Purpose={Purpose}
                    SourcedBy={SourcedBy}
                    OtherProcess={OtherProcess}
                    rmstoProcessTypes={rmstoProcessTypes}
                    DivisonList={DivisonList}
                    onReceiveData={handleGrandChildData}
                  />
                ) : (
                  <TripSheetCreationHire
                    values={values}
                    errors={errors}
                    handleChange={handleChange}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    singleVehicleInfo={singleVehicleInfo}
                    isTouched={isTouched}
                    Purpose={Purpose}
                    SourcedBy={SourcedBy}
                    DivisonList={DivisonList}
                  />
                )}
                <CRow>
                  <CCol xs={12} md={3}>
                    <CFormLabel htmlFor="remarks">Remarks</CFormLabel>
                    <CFormTextarea
                      id="remarks"
                      name="remarks"
                      onFocus={onFocus}
                      onBlur={onBlur}
                      onChange={handleChangenew}
                      value={remarks||''}
                      rows="1"
                    >
                      {/* {remarks} */}
                    </CFormTextarea>
                  </CCol>
                </CRow>             
                <CRow className="mt-md-3">
                  <CCol className="" xs={12} sm={12} md={3}>
                    <CButton size="sm" color="primary" className="text-white" type="button">
                      <Link className="text-white" to="/TripSheetCreation">
                        Back
                      </Link>
                    </CButton>
                  </CCol>
                  <CCol
                    className="offset-md-6"
                    xs={12}
                    sm={12}
                    md={3}
                    style={{ display: 'flex', justifyContent: 'end' }}
                  >
                    {/* <CButton
                      size="sm"
                      color="warning"
                      className="mx-2 text-white"
                      disabled={ppUnStoppedTripsheet}
                      type="submit"
                    >
                      Create
                    </CButton>
                    { ppUnStoppedTripsheet && (
                      <CButton
                        size="sm"
                        color="warning"
                        className="mx-2 text-white"
                        disabled={validateSubmit}
                        onClick={(e) => StopPPEndCall(e)}
                      >
                        PP End
                      </CButton>)
                    } */}
                      <CButton
                      size="sm"
                      color="warning"
                      className="mx-2 text-white"
                      disabled={sapUnStoppedTripsheet}
                      type="submit"
                    >
                      Create
                    </CButton>
                    { sapUnStoppedTripsheet && (
                      <>                     
                        <CButton
                          size="sm"
                          color="warning"
                          className="mx-2 text-white"
                          disabled={validateSubmit}
                          // onClick={(e) => StopSAPEndCall(e)}
                          onClick={(e) => setStopFlagModalEnable(true)}
                        >
                          SAP End
                        </CButton>
                      </>
                    )}
                    {(!driverChange && singleVehicleInfo.vehicle_type_id.id == vehicleType.OWN) ||
                      singleVehicleInfo.vehicle_type_id.id == vehicleType.CONTRACT ? (
                      <CButton
                        size="sm"
                        color="warning"
                        onClick={() => {
                          setDirverAssign(false)
                          setDriverChange(true)
                        }}
                        className="mx-3 px-3 text-white"
                        type="button"
                      >
                        Change Driver
                        </CButton>
                        ) : (
                          <></>
                    )}
                  </CCol>
                </CRow>
                {sapUnStoppedTripsheet && (
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
                )}
              </CForm>
            )}
          </CCard>
          {/* ======================= DB Download Button Modal Area ========================== */}
          <CModal
            visible={stopFlagModalEnable}
            backdrop="static"
            onClose={() => {
              setStopFlagModalEnable(false) 
            }}
          >
            <CModalHeader
              style={{
                backgroundColor: '#ebc999',
              }}
            >
              <CModalTitle>Confirmation To Previous Tripsheet Completion</CModalTitle>
            </CModalHeader>
            <CModalBody>
              <p className="lead"> 
                Are you sure to complete or end the previous tripsheet?
              </p>
              <b style={{color:'red'}}>Note : If the vehicle planning of the previous tripsheet was cancelled, kindly ignore this by clicking the Cancel option.</b> 
            </CModalBody>
            <CModalFooter>
              <CButton
                className="m-2"
                color="warning"
                onClick={() => {   
                  StopSAPEndCall()
                  setStopFlagModalEnable(false)
                }}
              >
                Confirm
              </CButton>
              <CButton
                color="secondary"
                onClick={() => {
                  setStopFlagModalEnable(false) 
                }}
              >
                Cancel
              </CButton> 
            </CModalFooter>
          </CModal>
          {/* *********************************************************** */}
        </>
      )}
    </>
  )
}

export default TripSheetCreation
