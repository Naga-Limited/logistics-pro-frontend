import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
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
  CFormTextarea,
  CModal,
  CModalTitle,
  CModalHeader,
  CModalBody,
  CAlert,
  CModalFooter,
} from '@coreui/react'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { React, useState, useEffect } from 'react'
import useForm from 'src/Hooks/useForm'
import ParkingYardGateValidation from 'src/Utils/TransactionPages/ParkingYardGate/ParkingYardGateValidation'
import CustomTable from '../../components/customComponent/CustomTable'
import ParkingYardGateService from 'src/Service/ParkingYardGate/ParkingYardGateService'
import VehicleTypeService from 'src/Service/SmallMaster/Vehicles/VehicleTypeService'
import OwnAndContractSection from './FormSection/OwnAndContractSection'
import HireSection from './FormSection/HireSection'
import PartySection from './FormSection/PartySection'
import { Link, useNavigate } from 'react-router-dom'
import SmallLoader from 'src/components/SmallLoader'
import Loader from 'src/components/Loader'
// import { reject } from 'core-js/fn/promise'

import AccessDeniedComponent from 'src/components/commoncomponent/AccessDeniedComponent'
import JavascriptInArrayComponent from 'src/components/commoncomponent/JavascriptInArrayComponent'
import * as LogisticsProScreenNumberConstants from 'src/components/constants/LogisticsProScreenNumberConstants'

const ParkingYardGate = () => {
  /*================== User Id & Location Fetch ======================*/
  const user_info_json = localStorage.getItem('user_info')
  const user_info = JSON.parse(user_info_json)
  const user_locations = []

  /* Get User Locations From Local Storage */
  user_info.location_info.map((data, index) => {
    user_locations.push(data.id)
  })

  /* Get User Id From Local Storage */
  const user_id = user_info.user_id

  // console.log(user_locations)
  /*================== User Location Fetch ======================*/

   /* ==================== Access Part Start ========================*/
const [screenAccess, setScreenAccess] = useState(false)
let page_no = LogisticsProScreenNumberConstants.ParkingYardGateModule.ParkingYardGate

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

  const [rowData, setRowData] = useState([])
  let tableData = []

  const [vehicleType, setVehicleType] = useState([])
  const [pending, setPending] = useState(true)
  const [fetch, setFetch] = useState(false)
  const [fetch1, setFetch1] = useState(false)

  const [errorModal, setErrorModal] = useState(false)
  const [error, setError] = useState({})

  const [submitBtn, setSubmitBtn] = useState(true)
  const REQ = () => <span className="text-danger"> * </span>

  /* Parking Status */
  const ACTION = {
    GATE_IN: 1,
    WAIT_OUTSIDE: 0,
    VEHICLE_MAINTENANCE_GATE_OUT: 5,
    VEHICLE_MAINTENANCE_GATE_IN: 6,
  }

  /* Vehicle Current Position */
  const Vehicle_Current_Position = {
    GATE_IN: 1,
    VEHICLE_INSPECTION_COMPLETED: 2,
    VEHICLE_INSPECTION_REJECTED: 3,
    VEHICLE_MAINTENANCE_STARTED: 4,
    VEHICLE_MAINTENANCE_ENDED: 5,
    DOCUMENT_VERIFICATION_REJECTED: 9,
    TRIPSHEET_CREATED: 16,
    TRIPSHEET_CANCEL: 17,
    ADVANCE_CREATED: 18,
    SHIPMENT_CREATED: 20,
    SHIPMENT_DELETED_NLFD: 21,
    SHIPMENT_DELETED_NLCD: 24,
    DIESEL_INTENT_CREATION: 37,
    DIESEL_INTENT_CONFIRMATION: 39,
    DIESEL_INTENT_APPROVAL: 41,
    TRIP_EXPENSE_CAPTURE: 26,
    TRIP_INCOME_CAPTURE: 27,
    TRIP_INCOME_REJECT: 261,
    TRIP_SETTLEMENT_CAPTURE: 28,
    TRIP_SETTLEMENT_REJECT: 29,
  }
  /*Tripsheet division and purpose */
  const TripSheet_division = {
    TRIPSHEET_OWN_NLFD: 1,
    TRIPSHEET_OWN_NLCD: 2,
  }
  const TripSheet_purpose = {
    TRIPSHEET_SALES: 1,
    TRIPSHEET_STO: 2,
  }
  const formValues = {
    vehicleType: '',
    vehicleId: '',
    vehicleNumber: '',
    others_type: '',
    vehicleCapacity: '',
    driverId: '',
    driverName: '',
    driverPhoneNumber: '',
    odometerKm: '',
    odometerImg: '',
    partyName: '',
    vehicleBody: '',
    remarks: '',
  }

  const resetFormValues = () => {
    values.vehicleType = ''
    values.vehicleId = ''
    values.vehicleNumber = ''
    values.others_type = ''
    values.vehicleCapacity = ''
    values.driverId = ''
    values.driverName = ''
    values.driverPhoneNumber = ''
    values.odometerKm = ''
    values.odometerImg = ''
    values.partyName = ''
    values.vehicleBody = ''
    values.remarks = ''
  }

  const resetIsTouched = () => {
    isTouched.vehicleType = false
    isTouched.vehicleId = false
    isTouched.vehicleNumber = false
    isTouched.vehicleCapacity = false
    isTouched.driverId = false
    isTouched.driverName = false
    isTouched.driverPhoneNumber = false
    isTouched.odometerKm = false
    isTouched.odometerImg = false
    isTouched.partyName = false
    isTouched.vehicleBody = false
    isTouched.remarks = false
  }

  let navigation = useNavigate()

  const emptyVehicleDriverCheck = () => {
    if (values.vehicleNumber == '' && values.driverName == '') {
      return false
    }
  }

  const {
    values,
    setValues,
    errors,
    handleChange,
    onFocus,
    enableSubmit,
    onBlur,
    isTouched,
    setIsTouched,
    setErrors,
  } = useForm(action, ParkingYardGateValidation, formValues)

  useEffect(()=>{
    if(values.vehicleType == '4' && values.others_type == ''){
      values.partyName = ''
    }
  },[values.others_type])

  const vehicle_type_finder = (v_type_id_data) => {
    let v_type = ''
    console.log(v_type_id_data,'v_type_id_data')
    if(v_type_id_data.vehicle_type_id.id != '4'){
      v_type = v_type_id_data.vehicle_type_id.type
    } else {
      if(v_type_id_data.vehicle_others_type == '2'){
        v_type = 'D2R Vehicle'
      } else {
        v_type = v_type_id_data.vehicle_type_id.type
      }
    }
    return v_type      
  }

  function action(type) {
    if (values.vehicleNumber == '') {
      toast.warning('Invalid Vehicle Selected. Kindly Contact Admin.!')
      setFetch(true)
      return false
    } else if (values.driverName == '') {
      toast.warning('Invalid Driver Selected. Kindly Contact Admin.!')
      setFetch(true)
      return false
    }

    emptyVehicleDriverCheck()
    const formData = new FormData()
    formData.append('vehicle_type_id', values.vehicleType)
    if(values.vehicleType == '4'){
      formData.append('vehicle_others_type', values.others_type)
    }
    formData.append('vehicle_id', values.vehicleId)
    formData.append('driver_id', values.driverId)
    formData.append('odometer_km', values.odometerKm)
    if (values.odometerImg !== '') {
      formData.append('odometer_photo', values.odometerImg)
    }
    formData.append('vehicle_number', values.vehicleNumber)
    formData.append('vehicle_capacity_id', values.vehicleCapacity)
    formData.append('driver_name', values.driverName)
    formData.append('driver_contact_number', values.driverPhoneNumber)
    formData.append('vehicle_body_type_id', values.vehicleBody)
    formData.append('party_name', values.partyName)
    formData.append('remarks', values.remarks || '')
    formData.append('action_type', type)
    formData.append('created_by', user_id)
    // formData.append('vehicle_location_id', userLocation)
    formData.append('vehicle_location_id', userLocation_new)

    console.log(values)
    console.log(type)

    ParkingYardGateService.handleParkingYardGateAction(formData)
      .then((res) => {
        console.log(res)
        setFetch(true)
        if (res.status == 200) {
          if (type == 3) {
            toast.success('Vehicle Waiting Outside Successfully!')
          } else if (type == 1) {
            toast.success('Vehicle GateIn Successfully!')
          } else {
            toast.success('Process Done!')
          }
          //reseting the fromValues
          resetFormValues()
          loadParkingYardGateTable()
          setIsTouched({})
          setErrors({})
          setValues({})
        } else if (res.status == 201) {
          toast.info('Truck Already inProcess. Cannot make next trip..!')
        } else {
          toast.danger('Something Went Wrong!')
        }
      })
      .catch((error) => {
        console.log(error)
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

  const gateInAction = (PYGId) => {
    ParkingYardGateService.actionWaitingOutsideToGateIn(PYGId).then((res) => {
      if (res.status === 201) {
        toast.success('Vehicle GateIn Successfully!')
        loadParkingYardGateTable()
      }
    })
  }

  const gateOutAction = (PYGId) => {
    ParkingYardGateService.actionGateOut(PYGId).then((res) => {
      console.log(values.vehicleType)
      if (res.status === 201 && res.data.sap_status){
        if(res.data.sap_status == 1 ) {
          toast.success('Vehicle GateOut Successfully!')
        } else {
          toast.warning(res.data.info.MESSAGE+'. Kindly Contact Admin..!')
        }
      } else if (res.status === 201) {
        toast.success('Vehicle GateOut Successfully!')
      }
      loadParkingYardGateTable()
    })
  }

  const loadParkingYardGateTable = () => {
    ParkingYardGateService.getParkingYardGateTrucks().then((res) => {
      setFetch(true)
      tableData = res.data.data
      let rowDataList = []
      console.log(tableData)
      const filterData1 = tableData.filter(
        (data) => user_locations.indexOf(data.vehicle_location_id) != -1
      )
      // console.log(filterData1)

      const filterData = filterData1.filter(
        (data) =>
          data.parking_status == '0' ||
          (data.vehicle_type_id.id == 3 &&
            (data.vehicle_current_position == '3' || data.vehicle_current_position == '9')) ||
          (data.vehicle_type_id.id == 3 &&
            (data.trip_sheet_info.purpose != '1' ||
              (data.trip_sheet_info.purpose == '1' && data.trip_sheet_info.to_divison != '1') ||
              (data.trip_sheet_info.purpose == '1' && data.trip_sheet_info.status == '1'))) ||
          (data.vehicle_type_id.id == '4' && data.parking_status == '3') ||
          // || data.vehicle_type_id.id == '1'||data.vehicle_type_id.id == '2'
          (data.vehicle_type_id.id == '1' && data.maintenance_status != null) ||
          (data.vehicle_type_id.id == '1' && data.trip_sheet_info.advance_status == '0' && data.trip_sto_status == '1') ||
          (data.vehicle_type_id.id == '2' && data.trip_sheet_info.advance_status == '0' && data.trip_sto_status == '1') ||

          (data.vehicle_type_id.id < '3' && data.vehicle_current_position == '18' && data.trip_sheet_info.trip_advance_eligiblity == '1' && data.trip_sheet_info.advance_status == '1' &&
            data.trip_sheet_info.purpose == '1' && data.trip_sheet_info.to_divison == '2') ||

            (data.vehicle_type_id.id < '3' && data.vehicle_current_position == '18' && data.trip_sheet_info.trip_advance_eligiblity == '1' && data.trip_sheet_info.advance_status == '1' &&
            data.trip_sheet_info.purpose == '2') ||

              (data.vehicle_type_id.id < '3' && data.vehicle_current_position == '16' && data.trip_sheet_info.trip_advance_eligiblity == '1' && data.trip_sheet_info.advance_status == '0' &&
              data.trip_sheet_info.purpose == '1' && data.trip_sheet_info.to_divison == '2') ||

              (data.vehicle_type_id.id < '3' && data.vehicle_current_position == '16' && data.trip_sheet_info.trip_advance_eligiblity == '1' && data.trip_sheet_info.advance_status == '0' &&
              data.trip_sheet_info.purpose == '2') ||

          (data.vehicle_type_id.id != '3' &&
            data.trip_sheet_info.advance_status == '1' &&
            data.vehicle_current_position == '20') ||

            (data.vehicle_type_id.id < '3' &&
            data.trip_sheet_info.advance_status == '0' &&
            data.vehicle_current_position == '20') ||

          (data.vehicle_type_id.id != '3' &&
            (data.vehicle_current_position == '37' ||
              data.vehicle_current_position == '39' ||
              data.vehicle_current_position == '41')) ||
          (data.vehicle_type_id.id != '3' && data.vehicle_current_position == '21') ||
          data.vehicle_current_position == '24'||(data.vehicle_type_id.id < '3' && data.vehicle_current_position == '17')
      )
      // console.log(filterData)
      filterData.map((data, index) => {
        console.log(data)

        rowDataList.push({
          sno: index + 1,
          Tripsheet_No: data.trip_sheet_info ? data.trip_sheet_info.trip_sheet_no : ' - ',
          // Vehicle_Type: data.vehicle_type_id.type,
          Vehicle_Type: vehicle_type_finder(data),
          Vehicle_No: data.vehicle_number,
          Driver_Name: data.driver_name,
          Waiting_At: (
            <span className="badge rounded-pill bg-info">
              {data.parking_status == ACTION.WAIT_OUTSIDE
                ? 'Waiting Outside'
                : data.vehicle_current_position ==
                  Vehicle_Current_Position.VEHICLE_INSPECTION_REJECTED
                ? 'Vehicle Inspection Rejected'
                : data.vehicle_current_position ==
                    Vehicle_Current_Position.VEHICLE_INSPECTION_COMPLETED &&
                  data.vehicle_type_id.id == '4' &&
                  data.parking_status == '3'
                ? 'Party Veh. Completed'
                : data.vehicle_current_position ==
                  Vehicle_Current_Position.DOCUMENT_VERIFICATION_REJECTED
                ? 'Doc. Verification Rejected'
                : data.vehicle_current_position ==
                  Vehicle_Current_Position.VEHICLE_MAINTENANCE_STARTED
                ? 'Outside Maintenance Start'
                : data.vehicle_current_position ==
                    Vehicle_Current_Position.VEHICLE_MAINTENANCE_STARTED &&
                  data.parking_status == ACTION.VEHICLE_MAINTENANCE_STARTED
                ? 'Outside Maintenance End'
                : data.vehicle_current_position == Vehicle_Current_Position.TRIPSHEET_CREATED &&
                  data.trip_sto_status == '1' && data.trip_sheet_info.purpose == '4'
                ? 'TS Created : Others'
                : data.vehicle_current_position == Vehicle_Current_Position.TRIPSHEET_CREATED &&
                  data.trip_sto_status == '1' && data.trip_sheet_info.purpose == '3'
                ? 'TS Created : RMSTO'
                : data.vehicle_current_position == Vehicle_Current_Position.TRIPSHEET_CREATED &&
                  data.trip_sto_status == '1' && data.trip_sheet_info.purpose == '5'
                ? 'TS Created : FCI'
                : data.vehicle_current_position == Vehicle_Current_Position.TRIPSHEET_CREATED &&
                  data.vehicle_type_id.id == '3' &&
                  data.trip_sheet_info.purpose == '2' &&
                  data.trip_sheet_info.to_divison == '1'
                ? 'TS Created : FG-STO (NLFD)'
                : data.vehicle_current_position == Vehicle_Current_Position.TRIPSHEET_CREATED &&
                  data.vehicle_type_id.id == '3' &&
                  data.trip_sheet_info.purpose == '2' &&
                  data.trip_sheet_info.to_divison == '2'
                ? 'TS Created : FG-STO (NLCD)'
                : data.vehicle_current_position == Vehicle_Current_Position.TRIPSHEET_CREATED &&
                  data.vehicle_type_id.id == '3' &&
                  data.trip_sheet_info.purpose == '1' &&
                  data.trip_sheet_info.to_divison == '2'
                ? 'TS Created : FG-Sales (NLCD)'
                : data.vehicle_current_position == Vehicle_Current_Position.SHIPMENT_CREATED &&
                  data.vehicle_type_id.id == '3' &&
                  data.trip_sheet_info.purpose == '1' &&
                  data.trip_sheet_info.status == '1'
                ? 'Ship. Created : FG-Sales (NLFD)'
                : data.trip_sheet_info?.to_divison == TripSheet_division.TRIPSHEET_OWN_NLCD &&
                  data.trip_sheet_info?.purpose == TripSheet_purpose.TRIPSHEET_SALES &&
                  data.vehicle_current_position == Vehicle_Current_Position.ADVANCE_CREATED &&
                  data.vehicle_type_id.id != '3' &&
                  data.trip_sheet_info.advance_status == '1'
                ? 'Advance Create:FG-Sales(NLCD)'
                : data.trip_sheet_info?.to_divison == TripSheet_division.TRIPSHEET_OWN_NLCD &&
                  data.trip_sheet_info?.purpose == TripSheet_purpose.TRIPSHEET_SALES &&
                  data.vehicle_current_position == Vehicle_Current_Position.TRIPSHEET_CREATED &&
                  data.vehicle_type_id.id != '3' &&
                  data.trip_sheet_info.advance_status == '0'
                ? 'TS Create : FG-Sales(NLCD)'
                : data.vehicle_current_position ==
                    Vehicle_Current_Position.DIESEL_INTENT_APPROVAL &&
                  data.vehicle_type_id.id != '3'
                ? 'Diesel Approved'
                : data.vehicle_current_position ==
                    Vehicle_Current_Position.DIESEL_INTENT_CONFIRMATION &&
                  data.vehicle_type_id.id != '3'
                ? 'Diesel Confirmation'
                : data.vehicle_current_position ==
                    Vehicle_Current_Position.DIESEL_INTENT_CREATION &&
                  data.vehicle_type_id.id != '3'
                ? 'Diesel Creation'
                : data.trip_sheet_info?.to_divison == TripSheet_division.TRIPSHEET_OWN_NLCD &&
                  data.trip_sheet_info?.purpose == TripSheet_purpose.TRIPSHEET_STO &&
                  data.vehicle_current_position == Vehicle_Current_Position.ADVANCE_CREATED &&
                  data.vehicle_type_id.id != '3' &&
                  data.trip_sheet_info.advance_status == '1'
                ? 'Advance Create:FG-STO(NLCD)'
                : data.trip_sheet_info?.to_divison == TripSheet_division.TRIPSHEET_OWN_NLFD &&
                  data.trip_sheet_info?.purpose == TripSheet_purpose.TRIPSHEET_STO &&
                  data.vehicle_current_position == Vehicle_Current_Position.ADVANCE_CREATED &&
                  data.vehicle_type_id.id != '3' &&
                  data.trip_sheet_info.advance_status == '1'
                ? 'Advance Create:FG-STO(NLFD)'
                : data.trip_sheet_info?.to_divison == TripSheet_division.TRIPSHEET_OWN_NLCD &&
                  data.trip_sheet_info?.purpose == TripSheet_purpose.TRIPSHEET_STO &&
                  data.vehicle_current_position == Vehicle_Current_Position.TRIPSHEET_CREATED &&
                  data.vehicle_type_id.id != '3' &&
                  data.trip_sheet_info.advance_status == '0'
                ? 'TS Create:FG-STO(NLCD)'
                : data.trip_sheet_info?.to_divison == TripSheet_division.TRIPSHEET_OWN_NLFD &&
                  data.trip_sheet_info?.purpose == TripSheet_purpose.TRIPSHEET_STO &&
                  data.vehicle_current_position == Vehicle_Current_Position.TRIPSHEET_CREATED &&
                  data.vehicle_type_id.id != '3' &&
                  data.trip_sheet_info.advance_status == '0'
                ? 'TS Create:FG-STO(NLFD)'
                : data.vehicle_type_id.id == '1' &&
                  data.trip_sheet_info.advance_status == '1' &&
                  data.vehicle_current_position == '20'
                ? 'Ship. Created : FG-Sales (NLFD)'
                : data.vehicle_type_id.id < '3' &&
                  data.trip_sheet_info.advance_status == '0' &&
                  data.vehicle_current_position == '20'
                ? 'Ship. Created : FG-Sales (NLFD)'
                : data.vehicle_current_position == Vehicle_Current_Position.SHIPMENT_DELETED_NLCD &&
                  data.vehicle_type_id.id != '3'
                ? 'Shipment Delete(NLCD)'
                : data.vehicle_current_position == Vehicle_Current_Position.SHIPMENT_DELETED_NLFD &&
                  data.vehicle_type_id.id != '3'
                ? 'Shipment Delete(NLFD)'
                : data.vehicle_current_position == Vehicle_Current_Position.TRIPSHEET_CANCEL &&
                  data.vehicle_type_id.id < '3'
                ? 'TripSheet Cancel'
                : 'Gate Out'}
            </span>
          ),
          Screen_Duration: data.vehicle_current_position_updated_time,
          Overall_Duration: data.created_at,
          Action:
            // data.parking_status == ACTION.GATE_IN && !data.maintenance_status ? (
            //   <CButton className="badge text-white" color="warning" type="button">
            //     Vehicle Inspection
            //   </CButton>
            // ):
            data.parking_status == ACTION.WAIT_OUTSIDE ||
            data.parking_status == ACTION.VEHICLE_MAINTENANCE_GATE_OUT ? (
              <CButton
                type="button"
                onClick={(e) => {
                  setFetch(false)
                  gateInAction(data.parking_yard_gate_id)
                }}
                className="badge text-white"
                color="warning"
              >
                Gate IN
              </CButton>
            ) : data.vehicle_current_position == Vehicle_Current_Position.DIESEL_INTENT_APPROVAL ||
              data.vehicle_current_position == Vehicle_Current_Position.DIESEL_INTENT_CREATION ||
              data.vehicle_current_position ==
                Vehicle_Current_Position.DIESEL_INTENT_CONFIRMATION ||
              data.vehicle_current_position == Vehicle_Current_Position.TRIP_EXPENSE_CAPTURE ||
              data.vehicle_current_position == Vehicle_Current_Position.TRIP_INCOME_CAPTURE ||
              data.vehicle_current_position == Vehicle_Current_Position.TRIP_INCOME_REJECT ||
              data.vehicle_current_position == Vehicle_Current_Position.TRIP_SETTLEMENT_REJECT ||
              data.vehicle_current_position == Vehicle_Current_Position.SHIPMENT_DELETED_NLFD ||
              data.vehicle_current_position == Vehicle_Current_Position.TRIPSHEET_CANCEL ||
              data.vehicle_current_position == Vehicle_Current_Position.SHIPMENT_DELETED_NLCD ? (
              <CButton className="badge" color="warning">
                <Link
                  className="text-white"
                  to={`AfterGateInDeliveryDetails/${data.parking_yard_gate_id}`}
                >
                  Gate IN
                </Link>
              </CButton>
            ) : (
              <>
                {' '}
                <CButton
                  type="button"
                  onClick={(e) => {
                    setFetch(false)
                    gateOutAction(data.parking_yard_gate_id)
                  }}
                  className="badge text-white"
                  color="warning"
                >
                  Gate Out
                </CButton>
              </>
            ),
        })
      })
      setRowData(rowDataList)
      setPending(false)
    })
  }

  useEffect(() => {
    isTouched.remarks = true
    //section for getting vehicle type from database
    VehicleTypeService.getVehicleTypes().then((res) => {
      console.log('sd')
      console.log(res)
      setVehicleType(res.data.data)
      // changevehicleType()
    })

    loadParkingYardGateTable()
  }, [])

  // ERROR VALIDATIONS

  useEffect(() => {
    // alert('op')
    isTouched.remarks = true
    // For Own & Contract Vehicles
    // let OVNum = !errors.vehicleNumber && values.vehicleId
    let OVNum = values.vehicleId
    let DName = !errors.driverName && values.driverId
    let OKm = !errors.odometerKm && values.odometerKm
    let OIm = !errors.odometerImg && values.odometerImg

    // For Hire Vehicles
    let HVNum = !errors.vehicleNumber && values.vehicleNumber
    let HVCty = !errors.vehicleCapacity && values.vehicleCapacity
    let HDName = !errors.driverName && values.driverName
    let HDCNum = !errors.driverPhoneNumber && values.driverPhoneNumber
    let HVBdy = !errors.vehicleBody && values.vehicleBody

    // For Party Vehicles
    let PVNum = !errors.vehicleNumber && values.vehicleNumber
    let PVTYpe = !errors.others_type && values.others_type
    let PName = !errors.partyName && values.partyName
    let PVCty = !errors.vehicleCapacity && values.vehicleCapacity
    let PDName = !errors.driverName && values.driverName
    let PDCNum = !errors.driverPhoneNumber && values.driverPhoneNumber
    let PVBdy = !errors.vehicleBody && values.vehicleBody

    let own_contract_accept = OVNum && DName && OKm && OIm
    let hire_accept = HVNum && HVCty && HDName && HDCNum && HVBdy
    let party_accept = PVNum && PName && PVCty && PDName && PDCNum && PVBdy && PVTYpe

    if (values.vehicleType) {
      console.log('wer')
      if ((values.vehicleType == '1' || values.vehicleType == '2') && own_contract_accept) {
        setSubmitBtn(false)
      } else if (values.vehicleType == '3' && hire_accept) {
        setSubmitBtn(false)
      } else if (values.vehicleType == '4' && party_accept) {
        setSubmitBtn(false)
      } else {
        setSubmitBtn(true)
      }
    } else {
      console.log('dfg')
      setSubmitBtn(true)
    }

    console.log(values)
    console.log('values')
  }, [values, errors])

  const columns = [
    {
      name: 'S.No',
      selector: (row) => row.sno,
      sortable: true,
      center: true,
    },
    {
      name: 'Tripsheet No',
      selector: (row) => row.Tripsheet_No,
      sortable: true,
      center: true,
    },
    {
      name: 'Vehicle Type',
      selector: (row) => row.Vehicle_Type,
      sortable: true,
      center: true,
    },
    {
      name: 'Vehicle No',
      selector: (row) => row.Vehicle_No,
      sortable: true,
      center: true,
    },
    {
      name: 'Driver Name',
      selector: (row) => row.Driver_Name,
      sortable: true,
      center: true,
    },
    {
      name: 'Current Status',
      selector: (row) => row.Waiting_At,
      sortable: true,
      center: true,
    },
    {
      name: 'Screen Duration',
      selector: (row) => row.Screen_Duration,
      center: true,
    },
    {
      name: ' Overall Duration',
      selector: (row) => row.Overall_Duration,
      center: true,
    },
    {
      name: 'Action',
      selector: (row) => row.Action,
      center: true,
    },
  ]

  const changevehicleType = (str = '') => {
    console.log('true1' + str)

    values.vehicleNumber = ''
    values.vehicleId = ''
    values.driverName = ''
    values.driverId = ''
    values.odometerKm = ''
    values.odometerImg = ''
    values.driverPhoneNumber = ''
    values.partyName = ''
  }

  return (
    <>
      {!fetch && <Loader />}
      {fetch && (
       <>
        {screenAccess ? (
         <>
          <CContainer>
            <CCard>
              <CForm className="container p-3">
                <CRow className="">
                  <CCol md={3}>
                    <CFormLabel htmlFor="vehicleType">
                      Vehicle Type <REQ />{' '}
                      {errors.vehicleType && (
                        <span className="small text-danger">{errors.vehicleType}</span>
                      )}
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
                  </CCol>
                  {(values.vehicleType == 2 || values.vehicleType == 1) && (
                    <OwnAndContractSection
                      errors={errors}
                      onBlur={onBlur}
                      onFocus={onFocus}
                      handleChange={handleChange}
                      values={values}
                      isTouched={isTouched}
                      setIsTouched={setIsTouched}
                      setErrors={setErrors}
                    />
                  )}
                  {values.vehicleType == 3 && (
                    <HireSection
                      errors={errors}
                      onFocus={onFocus}
                      onBlur={onBlur}
                      handleChange={handleChange}
                      values={values}
                      isTouched={isTouched}
                      setIsTouched={setIsTouched}
                      setErrors={setErrors}
                    />
                  )}
                  {values.vehicleType == 4 && (
                    <PartySection
                      errors={errors}
                      onFocus={onFocus}
                      onBlur={onBlur}
                      handleChange={handleChange}
                      values={values}
                      isTouched={isTouched}
                      setIsTouched={setIsTouched}
                      setErrors={setErrors}
                    />
                  )}
                  {values.vehicleType && values.vehicleType != '0' && (
                    <CCol xs={12} md={3}>
                      <CFormLabel htmlFor="remarks">Remarks</CFormLabel>
                      <CFormTextarea
                        name="remarks"
                        id="remarks"
                        maxLength={40}
                        onBlur={onBlur}
                        onChange={handleChange}
                        value={values.remarks || ''}
                        rows="1"
                      >
                        {values.remarks}
                      </CFormTextarea>
                    </CCol>
                  )}
                </CRow>
                <CRow className="mt-1">
                  <CCol
                    className="d-md-flex justify-content-end"
                    xs={12}
                    sm={12}
                    md={12}
                    // style={{ display: 'flex', justifyContent: 'flex-end' }}
                  >
                    <CButton
                      size="sm"
                      color="warning"
                      disabled={submitBtn}
                      onClick={(e) => {
                        e.preventDefault()
                        setFetch(false)
                        action(ACTION.WAIT_OUTSIDE)
                      }}
                      className="mx-1 text-white"
                      type="submit"
                    >
                      Wait OutSide
                    </CButton>
                    <CButton
                      size="sm"
                      disabled={submitBtn}
                      onClick={(e) => {
                        e.preventDefault()
                        setFetch(false)
                        action(ACTION.GATE_IN)
                      }}
                      color="warning"
                      className="mx-1 text-white"
                      type="button"
                    >
                      Gate In
                    </CButton>
                  </CCol>
                </CRow>
              </CForm>
            </CCard>
            {/* {!fetch && <SmallLoader />}
            {fetch && ( */}
            <CCard className="mt-3">
              <CContainer className="mt-2">
                <CustomTable
                  columns={columns}
                  data={rowData}
                  fieldName={'Driver_Name'}
                  showSearchFilter={true}
                  // pending={pending}
                />
              </CContainer>
            </CCard>
            {/* )} */}
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
          </CContainer>
         </>) : (<AccessDeniedComponent />)}
       </>
      )}
    </>
  )
}
export default ParkingYardGate
