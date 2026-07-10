/* eslint-disable prettier/prettier */
import {
  CButton,
  CCard,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CFormTextarea,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import React, { useEffect, useState } from 'react'
import Loader from 'src/components/Loader'
import SmallLoader from 'src/components/SmallLoader'
import CustomTable from 'src/components/customComponent/CustomTable'
import { toast } from 'react-toastify'
import { Link, useNavigate } from 'react-router-dom'
import NlmtVehicleMasterService from 'src/Service/Nlmt/Masters/NlmtVehicleMasterService'
import NlmtDriverMasterService from 'src/Service/Nlmt/Masters/NlmtDriverMasterService'
import NlmtTripInService from 'src/Service/Nlmt/TripIn/NlmtTripInService'
import Swal from 'sweetalert2'
import NlmtDefinitionsListApi from 'src/Service/Nlmt/Masters/NlmtDefinitionsListApi'
import * as NlmtScreenAccessCodes from 'src/components/constants/NlmtScreenAccessCodes'
import AccessDeniedComponent from 'src/components/commoncomponent/AccessDeniedComponent'
import JavascriptInArrayComponent from 'src/components/commoncomponent/JavascriptInArrayComponent'

const NlmtTripInOwnVehicle = () => {
  const navigation = useNavigate()

  /* Get User Locations From Local Storage */
  const user_info_json = localStorage.getItem('user_info')
  const user_info = JSON.parse(user_info_json)
  const user_locations = []
  user_info.location_info.map((data, index) => {
    user_locations.push(data.id)
  })

  const user_id = user_info.user_id
  /*================== User Location Fetch ======================*/

  /* Get User Locations From Local Storage */
  const user_location_info = user_info.location_info
  var user_locations_id = ''
  user_location_info.map((data, index) => {
    user_locations_id = user_locations_id + data.id + ','
  })
  var lastIndex = user_locations_id.lastIndexOf(',')

  const userLocation = user_locations_id.substring(0, lastIndex)


  /* ================= STATES ================= */
  const [loading, setLoading] = useState(false)
  const [tableLoading, setTableLoading] = useState(false)

  const [vehicleList, setVehicleList] = useState([])
  const [driverList, setDriverList] = useState([])
  const [tripData, setTripData] = useState([])
  const REQ = () => <span className="text-danger"> *</span>
  const [values, setValues] = useState({
    vehicleId: '',
    vehicleNumber: '',
    vehicleCapacity: '',
    vehicleBodyType: '',
    vehicleVariety: '',
    vehicleGroup: '',
    vehicleInsuranceValidity: '',
    vehicleFcValidity: '',
    driverId: '',
    driverCode: '',
    driverMobile: '',
    driverLicenseValidity: '',
    odometerKm: '',
    odometerImg: '',
    remarks: '',
    driverLicenseDate: '',
    driverLicenseStatus: '',
  })
  const ACTION = {
    GATE_IN: 1,
    WAIT_OUTSIDE: 0,
    VEHICLE_MAINTENANCE_GATE_OUT: 5,
    VEHICLE_MAINTENANCE_GATE_IN: 6,
  }
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
  const TripSheet_division = {
    TRIPSHEET_OWN_NLMT: 1,
    TRIPSHEET_OWN_NLMT: 2,
  }

   /* ==================== Access Part Start ========================*/
    const [screenAccess, setScreenAccess] = useState(false)
    let page_no = NlmtScreenAccessCodes.NlmtTransactionScreens.Nlmt_Vehicle_Trip_In
  
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

  /* ================= HANDLERS ================= */
  const handleChange = (e) => {
    const { name, value, files } = e.target
    setValues({
      ...values,
      [name]: files ? files[0] : value,
    })
  }
  const isTripInEnabled =
    values.vehicleId &&
    values.driverId &&
    values.odometerKm &&
    values.odometerImg
  /* ================= LOAD VEHICLES ================= */
  useEffect(() => {
    setLoading(true)

    NlmtVehicleMasterService.getNlmtVehicles()
      .then((res) => {
        console.log(res.data.data)
        const availableVehicles = res.data.data.filter((v) =>

          Number(v.vehicle_is_assigned) === 0 &&
          Number(v.vehicle_status) === 1 &&
          Number(v.vehicle_type_id) === 21
        )

        setVehicleList(availableVehicles)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  /* ================= VEHICLE DETAILS ================= */
  useEffect(() => {
    if (!values.vehicleId) return

    NlmtVehicleMasterService.getNlmtVehiclesById(values.vehicleId).then((res) => {
      const v = res.data.data

      setValues((prev) => ({
        ...prev,
        vehicleNumber: v.vehicle_number,
        vehicleCapacity: v.vehicle_capacity_info?.definition_list_name
          ? `${v.vehicle_capacity_info.definition_list_name} Mts`
          : '',
        vehicleBodyType: v.vehicle_body_type_info?.definition_list_name || '',
        vehicleType: v.vehicle_type_info?.definition_list_name || '',
        vehicleInsuranceValidity: v.insurance_validity,
        vehicleFcValidity: v.fc_validity,
      }))
    })
  }, [values.vehicleId])


  /* ================= LOAD DRIVERS ================= */
  useEffect(() => {
    NlmtDriverMasterService.getNlmtDrivers().then((res) => {

      const availableDrivers = res.data.data.filter(
        (d) => d.driver_assigned_status === 0 &&
          d.driver_status === 1
      )
      console.log(availableDrivers, "availableDrivers Data")
      setDriverList(availableDrivers)
    })
  }, [])
  const [vehicleCapacity, setVehicleCapacity] = useState([])
  const [vehicleBody, setVehicleBody] = useState([])

  const VEHICLE_TYPE_MAP = {
    21: 'Own',
    22: 'Hire',
  }
  useEffect(() => {
    Promise.all([
      NlmtDefinitionsListApi.visibleNlmtDefinitionsListByDefinition(2),// Vehicle Capacity
      NlmtDefinitionsListApi.visibleNlmtDefinitionsListByDefinition(1),// Vehicle Body Type
      // NlmtDefinitionsListApi.visibleNlmtDefinitionsListByDefinition(3),// Vehicle Type
    ]).then(([cap, body, type]) => {
      setVehicleCapacity(cap.data.data || [])
      setVehicleBody(body.data.data || [])
      // setVehicleType(type.data.data || [])
      // setMastersLoaded(true)
    })
  }, [])


  /* ================= DRIVER DETAILS ================= */
  useEffect(() => {
    if (!values.driverId) return

    const selectedDriver = driverList.find(
      (d) => String(d.driver_id) === String(values.driverId)
    )

    if (!selectedDriver) return

    const licenseStr = selectedDriver.license_validity_to
    const [day, month, year] = licenseStr.split('-')
    const fullYear = `20${year}`
    const formattedDate = `${fullYear}-${month}-${day}`

    const expiryDate = new Date(formattedDate)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const status = expiryDate >= today ? 'Valid' : 'Expired'

    setValues((prev) => ({
      ...prev,
      driverCode: selectedDriver.driver_code,
      driverMobile: selectedDriver.driver_phone_1,
      driverLicenseDate: licenseStr,
      driverLicenseStatus: status,
    }))
  }, [values.driverId, driverList])

  const gateInAction = (PYGId) => {
    NlmtTripInService.actionWaitingOutsideToTripIn(PYGId).then((res) => {
      if (res.status === 201) {
        toast.success('Vehicle GateIn Successfully!')
        loadParkingYardGateTable()
      }
    })
  }

  // const gateOutAction = (PYGId) => {
  //   NlmtTripInService.actionTripOut(PYGId).then((res) => {
  //     console.log(values.vehicleType)
  //     if (res.status === 201 && res.data.sap_status) {
  //       if (res.data.sap_status == 1) {
  //         toast.success('Vehicle GateOut Successfully!')
  //       } else {
  //         toast.warning(res.data.info.MESSAGE + '. Kindly Contact Admin..!')
  //       }
  //     } else if (res.status === 201) {
  //       toast.success('Vehicle GateOut Successfully!')
  //     }
  //     loadParkingYardGateTable()
  //   })
  // }

  /* ================= LOAD TABLE ================= */
  const loadTripInTable = () => {
    setTableLoading(true)

    NlmtTripInService.getTripInTrucks().then((res) => {
      console.log("Trip In Table Data", res)
      const tableData = res?.data?.data || []

      let rowDataList = []

      // 🔥 Location Filter (same concept as ParkingYard)
      const filterData1 = tableData.filter(
        (data) => user_locations.indexOf(data?.vehicle_location_id) !== -1
      )
      console.log("Filtered Trip In Data", filterData1)
      const filterData = filterData1.filter(
        (data) => ( 
            data.vehicle_current_position == '17' || 
            (data.advance_payment_info && data.diesel_intent_info)
          )

          /* Tripsheet Cancel After Tripsheet Creation */


        //   data.parking_status == '0' ||
        //   (data.vehicle_info.vehicle_type_id == '21' && data.maintenance_status != null) ||
        //   (data.vehicle_info.vehicle_type_id == '21' && data.vehicle_current_position == 37 && data.advance_payment_info && data.diesel_intent_info && data.parking_status != '19') ||
        //   (data.vehicle_info.vehicle_type_id == '21' && data.vehicle_current_position == 39 && data.advance_payment_info && data.diesel_intent_info && data.parking_status != '19') ||
        //   (data.vehicle_info.vehicle_type_id == '21' && data.vehicle_current_position == 18 && data.advance_payment_info && data.diesel_intent_info && data.parking_status != '19') ||
        //   (data.vehicle_info.vehicle_type_id == '21' && data.vehicle_current_position == 22 && data.advance_payment_info && data.diesel_intent_info && data.parking_status != '19') ||

 
        //   data.vehicle_info.vehicle_type_id == '21' && data.vehicle_current_position == '20' || (data.vehicle_info.vehicle_type_id == '21' && data.vehicle_current_position == '17')
      )
      console.log(filterData, 'filterData');
      filterData.map((data, index) => {
        rowDataList.push({
          sno: index + 1,
          id: data?.nlmt_trip_in_id,
          tripsheet_no: data?.tripsheet_info?.nlmt_tripsheet_no ?? '-',
          vehicle_number: data?.vehicle_info?.vehicle_number ?? '-',
          vehicle_type: VEHICLE_TYPE_MAP[data?.vehicle_info?.vehicle_type_id] || '-',
          driver_name:
            data?.driver_info?.driver_name && data?.driver_info?.driver_code
              ? `${data.driver_info.driver_name} (${data.driver_info.driver_code})`
              : '-',
          driver_mobile1: data?.driver_info?.driver_phone_1 ?? '-',

          created_at: data?.gate_in_date_time_string ?? '-',
          Waiting_At: (
            <span className="badge rounded-pill bg-info">
              {data.parking_status == ACTION.WAIT_OUTSIDE
                ? 'Waiting Outside'
                : data.vehicle_current_position ==
                  Vehicle_Current_Position.VEHICLE_INSPECTION_REJECTED
                  ? 'Vehicle Inspection Rejected'
                  : data.vehicle_current_position ==
                    Vehicle_Current_Position.VEHICLE_INSPECTION_COMPLETED &&
                    data.vehicle_info.vehicle_type_id == '23' &&
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
                          : data.vehicle_current_position == Vehicle_Current_Position.TRIPSHEET_CREATED

                            ? 'TS Created : Others'
                            : data.vehicle_current_position == Vehicle_Current_Position.TRIPSHEET_CREATED
                              ? 'TS Created : RMSTO'
                              : data.vehicle_current_position == Vehicle_Current_Position.TRIPSHEET_CREATED ? 'TS Created : FCI'
                                : data.vehicle_current_position == Vehicle_Current_Position.TRIPSHEET_CREATED &&
                                  data.vehicle_info.vehicle_type_id == '22'
                                  ? 'TS Created : FG-STO (NLFD)'
                                  : data.vehicle_current_position == Vehicle_Current_Position.TRIPSHEET_CREATED &&
                                    data.vehicle_info.vehicle_type_id == '22'
                                    ? 'TS Created : FG-STO (NLCD)'
                                    : data.vehicle_current_position == Vehicle_Current_Position.TRIPSHEET_CREATED &&
                                      data.vehicle_info.vehicle_type_id == '22'
                                      ? 'TS Created : FG-Sales (NLCD)'
                                      : data.vehicle_current_position == Vehicle_Current_Position.SHIPMENT_CREATED &&
                                        data.vehicle_info.vehicle_type_id == '22' &&
                                        data.tripsheet_info.status == '1'
                                        ? 'Ship. Created : FG-Sales (NLFD)'
                                        :
                                        data.vehicle_current_position == Vehicle_Current_Position.ADVANCE_CREATED &&
                                          data.vehicle_info.vehicle_type_id != '22'
                                          ? 'Advance Create:FG-Sales(NLCD)'
                                          : data.vehicle_current_position == Vehicle_Current_Position.TRIPSHEET_CREATED &&
                                            data.vehicle_info.vehicle_type_id != '22'
                                            ? 'TS Create : FG-Sales(NLCD)'
                                            : data.vehicle_current_position ==
                                              Vehicle_Current_Position.DIESEL_INTENT_APPROVAL &&
                                              data.vehicle_info.vehicle_type_id != '22'
                                              ? 'Diesel Approved'
                                              : data.vehicle_current_position ==
                                                Vehicle_Current_Position.DIESEL_INTENT_CONFIRMATION &&
                                                data.vehicle_info.vehicle_type_id != '22'
                                                ? 'Diesel Confirmation'
                                                : data.vehicle_current_position ==
                                                  Vehicle_Current_Position.DIESEL_INTENT_CREATION &&
                                                  data.vehicle_info.vehicle_type_id != '22'
                                                  ? 'Diesel Creation'
                                                  : data.tripsheet_info?.to_divison == TripSheet_division.TRIPSHEET_OWN_NLMT &&
                                                    data.vehicle_current_position == Vehicle_Current_Position.ADVANCE_CREATED &&
                                                    data.vehicle_info.vehicle_type_id != '22' &&
                                                    data.tripsheet_info.advance_status == '1'
                                                    ? 'Advance Create:FG-STO(NLMT)'
                                                    :
                                                    data.vehicle_current_position == Vehicle_Current_Position.ADVANCE_CREATED &&
                                                      data.vehicle_info.vehicle_type_id != '22'
                                                      ? 'Advance Create:FG-STO(NLMT)'
                                                      :
                                                      data.vehicle_current_position == Vehicle_Current_Position.TRIPSHEET_CREATED &&
                                                        data.vehicle_info.vehicle_type_id != '22'
                                                        ? 'TS Create:FG-STO(NLMT)'
                                                        :
                                                        data.vehicle_current_position == Vehicle_Current_Position.TRIPSHEET_CREATED &&
                                                          data.vehicle_info.vehicle_type_id != '22'
                                                          ? 'TS Create:FG-STO(NLMT)'
                                                          : data.vehicle_info.vehicle_type_id == '22' &&
                                                            data.vehicle_current_position == '20'
                                                            ? 'Ship. Created : FG-Sales (NLMT)'
                                                            : data.vehicle_info.vehicle_type_id < '22' &&
                                                              data.vehicle_current_position == '20'
                                                              ? 'Ship. Created : FG-Sales (NLFD)'
                                                              : data.vehicle_current_position == Vehicle_Current_Position.SHIPMENT_DELETED_NLCD &&
                                                                data.vehicle_info.vehicle_type_id != '22'
                                                                ? 'Shipment Delete(NLMT)'
                                                                : data.vehicle_current_position == Vehicle_Current_Position.SHIPMENT_DELETED_NLFD &&
                                                                  data.vehicle_info.vehicle_type_id != '22'
                                                                  ? 'Shipment Delete(NLMT)'
                                                                  : data.vehicle_current_position == Vehicle_Current_Position.TRIPSHEET_CANCEL &&
                                                                    data.vehicle_info.vehicle_type_id < '22'
                                                                    ? 'TripSheet Cancel'
                                                                    : 'Trip Out'}
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
                  gateInAction(data.nlmt_trip_in_id)
                }}
                className="badge text-white"
                color="warning"
              >
                Trip IN
              </CButton>
            ) : data.vehicle_current_position == Vehicle_Current_Position.DIESEL_INTENT_APPROVAL ||
              data.vehicle_current_position == Vehicle_Current_Position.DIESEL_INTENT_CREATION ||
              data.vehicle_current_position == Vehicle_Current_Position.DIESEL_INTENT_CONFIRMATION ||
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
                  to={`NlmtAfterDeliveryTripInDetails/${data.nlmt_trip_in_id}`}
                >
                  Trip IN
                </Link>
              </CButton>
            ) : (
              <>
                {' '}
                {/* <CButton
                  type="button"
                  onClick={(e) => {
                    setFetch(false)
                    gateOutAction(data.nlmt_trip_in_id)
                  }}
                  className="badge text-white"
                  color="warning"
                >
                  Trip Out
                </CButton> */}
                <CButton className="badge" color="warning">
                  <Link
                    className="text-white"
                    to={`NlmtAfterDeliveryTripInDetails/${data.nlmt_trip_in_id}`}
                  >
                    Trip IN
                  </Link>
                </CButton>
              </>
            ),
        })
      })
      setTripData(rowDataList)
      setTableLoading(false)
    })
  }

  /* ================= SUBMIT ================= */
  const submitGateIn = (e) => {
    e.preventDefault()

    if (!values.vehicleId || !values.driverId) {
      toast.error('Please select Vehicle & Driver')
      return false
    }

    if (!values.odometerKm) {
      toast.error('Odometer KM Required')
      return false
    } else if (!/^[\d]{6}$/.test(values.odometerKm)) {
      toast.error('Odometer KM should be 6 Digit Numeric')
      return false
    }

    console.log(values, 'submitGateIn values')

    // return false

    const formData = new FormData()
    formData.append('vehicle_id', values.vehicleId)
    formData.append('driver_id', values.driverId)
    formData.append('odometer_km', values.odometerKm)
    formData.append('odometer_photo', values.odometerImg)
    formData.append('remarks', values.remarks)
    formData.append('vehicle_location_id', userLocation)
    formData.append('created_by', user_id)

    NlmtTripInService.handleTripInAction(formData)
      .then((res) => {

        if(res.status === 200){
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: res.data.message,
            showConfirmButton: false,
            timer: 1500,
          }).then(() => {
            window.location.reload()
          })
        } else {
          toast.warning(res.data.message + '. Kindly Contact Admin..!')
        }

        
      })
      .catch((error) => {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: error.response?.data?.message || 'Trip-In failed',
        })
      })
  }
  useEffect(() => {
    loadTripInTable()
  }, [])
  const handleTripOut = (tripId) => {
    Swal.fire({
      title: 'Confirm Trip Out?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
    }).then((result) => {
      if (result.isConfirmed) {
        NlmtTripInService.actionTripOut(tripId).then(() => {
          toast.success('Trip Out Successful')
          // window.location.reload()
        })
      }
    })
  }

  /* ================= TABLE COLUMNS ================= */
  const columns = [
    {
      name: 'S.No',
      selector: (row) => row.sno,
      sortable: true,
      center: true,
    },
    {
      name: 'Tripsheet No',
      selector: (row) => row.tripsheet_no,
      sortable: true,
      center: true,
    },
    {
      name: 'Vehicle Type',
      selector: (row) => row.vehicle_type,
      sortable: true,
      center: true,
    },
    {
      name: 'Vehicle No',
      selector: (row) => row.vehicle_number,
      sortable: true,
      center: true,
    },
    {
      name: 'Driver Name',
      selector: (row) => row.driver_name,
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


  /* ================= RENDER ================= */
  if (loading) return <Loader />

  return (
    <>
      {screenAccess ? (
        <>
          <CCard className="p-3">
            <CForm onSubmit={submitGateIn}>
              <CRow>
                <CCol md={3}>
                  <CFormLabel>Vehicle Number<REQ /></CFormLabel>
                  <CFormSelect name="vehicleId" value={values.vehicleId} onChange={handleChange} >
                    <option value="">Select Vehicle</option>
                    {vehicleList.map((v) => (
                      <option key={v.vehicle_id} value={v.vehicle_id}>{v.vehicle_number}</option>
                    ))}
                  </CFormSelect>
                </CCol>
                {values.vehicleId && (
                  <>
                    <CCol md={3}>
                      <CFormLabel>Vehicle Type</CFormLabel>
                      <CFormInput value={values.vehicleType} readOnly />
                    </CCol>
                    <CCol md={3}>
                      <CFormLabel>Vehicle Capacity</CFormLabel>
                      <CFormInput value={values.vehicleCapacity} readOnly />
                    </CCol>

                    <CCol md={3}>
                      <CFormLabel>Vehicle Body Type</CFormLabel>
                      <CFormInput value={values.vehicleBodyType} readOnly />
                    </CCol>
                    <CCol md={3}>
                      <CFormLabel>Insurance Validity</CFormLabel>
                      <CFormInput value={values.vehicleInsuranceValidity} readOnly />
                    </CCol>
                    <CCol md={3}>
                      <CFormLabel>FC Validity</CFormLabel>
                      <CFormInput value={values.vehicleFcValidity} readOnly />
                    </CCol>

                    <CCol md={3}>
                      <CFormLabel>Driver Name<REQ /></CFormLabel>
                      <CFormSelect name="driverId" value={values.driverId} onChange={handleChange} >
                        <option value="">Select Driver</option>
                        {driverList.map((d) => (
                          <option key={d.driver_id} value={d.driver_id}>
                            {d.driver_name}
                          </option>
                        ))}
                      </CFormSelect>
                    </CCol>
                  </>
                )}
                {values.driverId && (
                  <>
                    <CCol md={3}>
                      <CFormLabel>Driver Code</CFormLabel>
                      <CFormInput value={values.driverCode} readOnly />
                    </CCol>
                    <CCol md={3}>
                      <CFormLabel>Driver Mobile</CFormLabel>
                      <CFormInput value={values.driverMobile} readOnly />
                    </CCol>

                    <CCol md={3}>
                      <CFormLabel>License Validity</CFormLabel>

                      <CInputGroup>
                        <CFormInput
                          value={values.driverLicenseDate}
                          readOnly
                          className={
                            values.driverLicenseStatus === 'Valid'
                              ? 'border-success text-success fw-bold'
                              : 'border-danger text-danger fw-bold'
                          }
                        />
                        <CInputGroupText
                          className={
                            values.driverLicenseStatus === 'Valid'
                              ? 'bg-success text-white fw-bold'
                              : 'bg-danger text-white fw-bold'
                          }
                        >
                          {values.driverLicenseStatus}
                        </CInputGroupText>
                      </CInputGroup>

                    </CCol>


                    <CCol md={3}>
                      <CFormLabel>Odometer KM<REQ /></CFormLabel>
                      <CFormInput 
                        name="odometerKm" 
                        type="text" 
                        value={values.odometerKm} 
                        min="0"
                        maxLength="6" 
                        placeholder="Enter Odometer KM" 
                        onChange={handleChange} 
                      />
                    </CCol>

                    <CCol md={3}>
                      <CFormLabel>Odometer Photo <REQ /> </CFormLabel>
                      <CFormInput type="file"
                        name="odometerImg"
                        accept=".pdf,.jpg,.jpeg,.png" onChange={handleChange} />
                      {values.odometerImg && (
                        <small className="text-success">{values.odometerImg.name}</small>
                      )}
                    </CCol>
                    <CCol md={6}>
                      <CFormLabel>Remarks</CFormLabel>
                      <CFormTextarea
                        name="remarks"
                        placeholder="Enter Remarks"
                        onChange={handleChange}
                      />
                    </CCol>

                    <CCol md={12} className="mt-3 text-end">
                      <CButton type="submit" color="warning"
                        disabled={!isTripInEnabled}>Trip In</CButton>
                    </CCol>
                  </>
                )}
              </CRow>
            </CForm>
          </CCard>

          <CCard className="mt-4">
            <CContainer>
              {tableLoading ? <SmallLoader /> : (
                <CustomTable columns={columns} showSearchFilter={true} data={tripData} />
              )}
            </CContainer>
          </CCard>
        </> ) : (<AccessDeniedComponent />
      )}
    </>
  )
}

export default NlmtTripInOwnVehicle
