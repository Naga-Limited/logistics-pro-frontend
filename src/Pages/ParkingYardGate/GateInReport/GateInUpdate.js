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
import VehicleInspectionService from 'src/Service/VehicleInspection/VehicleInspectionService'
import { Link, useNavigate, useParams } from 'react-router-dom'
import DriverListSelectComponent from 'src/components/commoncomponent/DriverListSelectComponent'
import VehicleInspectionValidation from 'src/Utils/TransactionPages/VehicleInspection/VehicleInspectionValidation'
import PerviousLoadDetailComponent from 'src/components/commoncomponent/PerviousLoadDetailComponent'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Loader from 'src/components/Loader'
import ParkingYardGateService from 'src/Service/ParkingYardGate/ParkingYardGateService'
import DriverListSearchSelect from 'src/components/commoncomponent/DriverListSearchSelect'
import DriverMasterService from 'src/Service/Master/DriverMasterService'
import VehicleCapacitySelectField from '../CommonComponent/VehicleCapacitySelectField'
import VehicleCapacityService from 'src/Service/SmallMaster/Vehicles/VehicleCapacityService'

import AccessDeniedComponent from 'src/components/commoncomponent/AccessDeniedComponent'
import JavascriptInArrayComponent from 'src/components/commoncomponent/JavascriptInArrayComponent'
import * as LogisticsProScreenNumberConstants from 'src/components/constants/LogisticsProScreenNumberConstants'

const GateInUpdate = () => {
  const user_info_json = localStorage.getItem('user_info')
  const user_info = JSON.parse(user_info_json)

  /* Get User Id From Local Storage */
  const user_id = user_info.user_id

   /* ==================== Access Part Start ========================*/
   const [screenAccess, setScreenAccess] = useState(false)
   let page_no = LogisticsProScreenNumberConstants.OtherModuleScreen.Gate_In_Report

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

  const [driverChange, setDriverChange] = useState(false)
  const [driverPhoneNumberById, setDriverPhoneNumberById] = useState('')
  const [driverCodeById, setDriverCodeById] = useState('')

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

  const onChange = (event) => {
    let driverId = event.value
    if (driverId) {
      values.driverId = driverId

      ParkingYardGateService.getDriverInfoById(driverId).then((res) => {
        setDriverPhoneNumberById(res.data.data.driver_phone_1)
        setDriverCodeById(res.data.data.driver_id)
      })
     console.log(driverPhoneNumberById)
    } else {
      values.driverId = ''
      // console.log()
    }
  }
// console.log(values.driverId)
  const border = {
    borderColor: '#b1b7c1',
  }

  const { values, errors, handleChange, onFocus, handleSubmit, enableSubmit, onBlur, isTouched } =
    useForm(inspectVehicle, VehicleInspectionValidation, formValues)

  const navigation = useNavigate()
  const REQ = () => <span className="text-danger"> * </span>

  const UpdateParkingVehicle = () => {
    let data = new FormData()
    data.append('vehicle_id', values.vehicle_id)
    data.append('parking_id', currentVehicleInfo.parking_yard_gate_id)
    data.append('vehicle_location_id', values.vehicle_location_id)
    data.append('tripsheet_sheet_id', currentVehicleInfo.tripsheet_sheet_id || '')
    data.append('odometer_km', values.OdometerKM || '')
    data.append('odometer_closing_km', values.odometer_closing_km || '')
    data.append('vehicle_capacity_id', values.vehicle_capacity_ids || values.vehicle_capacity_id)
    data.append('vehicle_body_type_id', values.vehicle_body_type_ids)
    data.append('party_name', values.party_name || '')
    data.append('vehicle_current_position', values.vehicle_current_position)
    data.append('parking_status', values.parking_status)
    data.append('maintenance_status', values.maintenance_status || '')
    data.append('trip_sto_status', values.trip_sto_status || '')
    data.append('vendor_creation_status', values.vendor_creation_status || '')
    data.append('vehicle_inspection_status', values.vehicle_inspection_status || '')
    data.append('document_verification_status', values.document_verification_status)
    data.append('tripsheet_open_status', values.tripsheet_open_status)
    data.append('gate_out_date_time',values.gate_out_date_times || currentVehicleInfo.gate_out_date_time_string)
    data.append('created_by', values.created_by)

    if (values.driverId && oldDriver) {
      data.append('driver_id', values.driverId)
      data.append('old_driver_id', oldDriver)
    }

    if (values.vehicle_inspection_status == 1 && (values.maintenance_status == 1 ||values.maintenance_status == 2) && values.trip_sto_status == 1) {
      toast.warning('Wrongly Select The Inspection,Maintenance,RM STO Status...')
      setFetch(true)
      return false
    }else if (values.vehicle_inspection_status == 1 &&  values.trip_sto_status == 1) {
      toast.warning('Wrongly Select The Inspection,RM STO Status...')
      setFetch(true)
      return false
    } else if (values.vehicle_inspection_status == 1 &&  (values.maintenance_status == 1 ||values.maintenance_status == 2)) {
      toast.warning('Wrongly Select The Inspection,Maintenance Status...')
      setFetch(true)
      return false
    } else if ((values.maintenance_status == 1 ||values.maintenance_status == 2) && values.trip_sto_status == 1) {
      toast.warning('Wrongly Select The Maintenance,RM STO Status...')
      setFetch(true)
      return false
    }  else if ((values.parking_status == 5 || values.parking_status == 4 || values.parking_status == 7 || values.parking_status > 7) && (values.gate_out_date_times == '')) {
      toast.warning('Enter The Gate Out Time...')
      setFetch(true)
      return false
    }

    console.log(values)
    // if(values.driverId)



      ParkingYardGateService.updateParkingYard(id,data).then((res) => {
        if (res.status == 200) {
          setFetch(true)
          toast.success('Parking Updated Sucessfully')
          navigation('/GateinReport')
        }
      })
    }


  function inspectVehicle() {}

  const [visible, setVisible] = useState(false)
  const [visible1, setVisible1] = useState(false)
  const [currentVehicleInfo, setCurrentVehicleInfo] = useState({})
  const [changeDriver, setChangeDriver] = useState(false)
  const [fitForLoad, setFitForLoad] = useState('')
  const [acceptBtn, setAcceptBtn] = useState(true)
  const [rejectBtn, setRejectBtn] = useState(true)
  const [oldDriver, setOldDriver] = useState('')
  const [fetch, setFetch] = useState(false)
  const [pending, setPending] = useState(true)
  const VEHICLE_TYPE = {
    OWN: '1',
    CONTRACT: '2',
    HIRE: '3',
    PARTY: '4',
  }

  function dateFormat(a) {
    let short_year = a.substring(a.lastIndexOf('-') + 1)
    let month = a.substring(a.indexOf('-') + 1, a.lastIndexOf('-'))
    let day = a.substring(0, a.indexOf('-'))
    let d = a.lastIndexOf('-')
    let year = 20 + short_year
    let new_date = year + '-' + month + '-' + day
    return new_date
  }

  const { id } = useParams()

  useEffect(() => {

    ParkingYardGateService.getParkingInfoById(id).then((res) => {
      setFetch(true)
      console.log(res.data)
      values.vehicle_id = res.data.data.vehicle_id

      isTouched.vehicle_id = true
      isTouched.remarks = true
      values.vehicle_type_id = res.data.data.vehicle_type_id.id
      values.maintenance_status = res.data.data.maintenance_status
      values.remarks = res.data.data.remarks
      values.parking_status = res.data.data.parking_status
      values.party_name = res.data.data.party_name
      values.trip_sto_status = res.data.data.trip_sto_status
      values.tripsheet_open_status = res.data.data.tripsheet_open_status
      values.vehicle_body_type_ids = res.data.data.vehicle_body_type_ids
      values.vehicle_current_position = res.data.data.vehicle_current_position
      values.vehicle_inspection_status = res.data.data.vehicle_inspection_status
      values.vehicle_location_id = res.data.data.vehicle_location_id
      values.vendor_creation_status = res.data.data.vendor_creation_status
      values.OdometerKM = res.data.data.odometer_km
      values.odometer_closing_km = res.data.data.odometer_closing_km
      values.driver_id = res.data.data.driver_id
      values.driver_name = res.data.data.driver_name
      values.driver_contact_number = res.data.data.driver_contact_number
      values.created_by = res.data.data.created_by
      values.parking_yard_gate_id = res.data.data.parking_yard_gate_id
      values.vehicle_capacity_id = res.data.data.vehicle_capacity_id.id
      values.document_verification_status = res.data.data.document_verification_status
      values.gate_in_date_time_string = dateFormat(res.data.data.gate_in_date_times)
      values.gate_out_date_time = dateFormat(res.data.data.gate_out_date_times)

      setCurrentVehicleInfo(res.data.data)
      console.log(res.data.data)

    })
  }, [id])

  // useEffect(() => {
  //   if (values.driverId) {
  //     //fetch to get Drivers info list form master by id
  //     ParkingYardGateService.getDriverInfoById(values.driverId).then((res) => {
  //       setDriverPhoneNumberById(res.data.data.driver_phone_1)
  //     })
  //   } else {
  //     setDriverPhoneNumberById('')
  //   }
  // }, [values.driverId])



  useEffect(() => {
    var touchLength = Object.keys(isTouched).length
    if (driverChange) {
      touchLength--
    }

    if (touchLength == Object.keys(formValues).length) {
      if (Object.keys(errors).length == 0) {
        setFitForLoad('YES')

        setAcceptBtn(false)
        setRejectBtn(true)
      } else {
        setFitForLoad('NO')
        setAcceptBtn(true)
        setRejectBtn(false)
      }
    }
  }, [values, errors])

  const [remarks, setRemarks] = useState('');
    const handleChangenew = event => {
    const result = event.target.value.toUpperCase();

    setRemarks(result);

  };

  const VBodytype = [
    { id: 1, VBody: 'Open' },
    { id: 2, VBody: 'Closed' },
  ]
  const Maintainence = [
    { id: 1, VMain: 'Inside' },
    { id: 2, VMain: 'Outside' },
  ]
  const Parking_Status = [
    { id: 1, PStatus: 'Own GateIn-1' },
    { id: 2, PStatus: 'Hire GateIn-2' },
    { id: 3, PStatus: 'Party GateIn-3' },
    { id: 4, PStatus: 'Inspection Reject-4' },
    { id: 5, PStatus: 'MaintenanceOut-5' },
    { id: 6, PStatus: 'MaintenanceIn-6' },
    { id: 7, PStatus: 'Doc.Failure-7' },
    { id: 8, PStatus: 'Own RM STO-8' },
    { id: 9, PStatus: 'Hire RM STO-9' },
    { id: 10, PStatus: 'FD Hire FG STO-10' },
    { id: 11, PStatus: 'CD Own FG Sale-11' },
    { id: 12, PStatus: 'CD Own FG STO-12' },
    { id: 13, PStatus: 'CD Hire FG Sale-13' },
    { id: 14, PStatus: 'CD Hire FG STO-14' },
    { id: 15, PStatus: 'FD Own FG Sale-15' },
    { id: 16, PStatus: 'FD Own FG STO-16' },
    { id: 17, PStatus: 'FD Hire FG Sale-17' },
    { id: 18, PStatus: 'Party Gate Out-18' },
    { id: 19, PStatus: 'Delivery Gate In-19' },
  ]
  const Vehicle_Current = [
    { id: 1, CStatus: 'GateIn-1' },
    { id: 2, CStatus: 'Inspection Completed-2' },
    { id: 3, CStatus: 'Inspection Rejected-3' },
    { id: 4, CStatus: 'Veh.Maintenance Start-4' },
    { id: 5, CStatus: 'Veh.Maintenance End-5' },
    { id: 6, CStatus: 'RM Completed-6' },
    { id: 7, CStatus: 'RM Rejected-7' },
    { id: 8, CStatus: 'Doc.Verify Completed-8' },
    { id: 9, CStatus: 'Doc.Verify Rejected-9' },
    { id: 16, CStatus: 'TS Created-16' },
    { id: 17, CStatus: 'TS Rejected-17' },
    { id: 18, CStatus: 'Advance Completed-18' },
    { id: 19, CStatus: 'Advance Reject-19' },
    { id: 20, CStatus: 'FD Shipment Created-20' },
    { id: 21, CStatus: 'FD Shipment Deleted-21' },
    { id: 22, CStatus: 'FD Shipment Completed-22' },
    { id: 23, CStatus: 'CD Shipment Created-23' },
    { id: 24, CStatus: 'CD Shipment Deleted-24' },
    { id: 25, CStatus: 'CD Shipment Completed-25' },
    { id: 26, CStatus: 'Expense Completed-26' },
    { id: 27, CStatus: 'Income Completed-27' },
    { id: 261, CStatus: 'Income Rejected-261' },
    { id: 28, CStatus: 'Settlement Completed-28' },
    { id: 29, CStatus: 'Settlement Rejected-29' },
    { id: 35, CStatus: 'RJ Sale Created-35' },
    { id: 36, CStatus: 'RJ Sale Rejected-36' },
    { id: 37, CStatus: 'Diesel Created-37' },
    { id: 39, CStatus: 'Diesel Confirmed-39' },
    { id: 41, CStatus: 'Diesel Approved-41' },
  ]
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

console.log(values.gate_out_date_times)

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
                    <CFormLabel htmlFor="vNum">Vehicle Capacity</CFormLabel>
                    <CFormInput
                      name="vNum"
                      size="sm"
                      id="vNum"
                      value={currentVehicleInfo.vehicle_capacity_id?.capacity}
                      placeholder=""
                      readOnly
                    />
                  </CCol>
                  <CCol xs={12} md={3}>
                    <CFormLabel htmlFor="driverId">
                      Driver Name <REQ />{' '}
                      {errors.driverId && (
                        <span className="small text-danger">{errors.driverId}</span>
                      )}
                    </CFormLabel>

                    {values.vehicle_type_id == VEHICLE_TYPE.OWN ||
                    values.vehicle_type_id == VEHICLE_TYPE.CONTRACT ? (
                      changeDriver ? (
                        // <CFormSelect
                        //   size="sm"
                        //   name="driverId"
                        //   id="driverId"
                        //   onFocus={onFocus}
                        //   onBlur={onBlur}
                        //   onChange={handleChange}
                        //   value={values.driverId}
                        //   label={'Small select example'}
                        // >
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
                          // </CFormSelect>
                      ) : (
                        <>
                          <CFormInput
                            name="driverId"
                            size="sm"
                            id="driverId"
                            value={currentVehicleInfo?.driver_name+' - '+ currentVehicleInfo.driver_info?.driver_code}
                            // value={currentVehicleInfo.driver_name}
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
                        value={currentVehicleInfo.driver_name}
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
                          : values.driver_contact_number
                      }
                      readOnly
                    />
                  </CCol>
                  {values.vehicle_type_id < 3 &&
                    <CCol xs={12} md={3}>
                    <CFormLabel htmlFor="driverId">
                      Driver ID

                    </CFormLabel>
                      <CFormInput
                        name="driverId"
                        size="sm"
                        id="driverId"
                        value={
                          driverChange
                            ? driverCodeById
                            : values.driver_id
                        }
                        readOnly
                      />
                  </CCol>}

                  {values.vehicle_type_id == VEHICLE_TYPE.OWN ||
                  values.vehicle_type_id == VEHICLE_TYPE.CONTRACT ? (
                    <>

                      <CCol xs={12} md={3}>
                        <CFormLabel htmlFor="OdometerKM">Opening Odometer KM</CFormLabel>
                        <CFormInput
                          name="OdometerKM"
                          size="sm"
                          id="OdometerKM"
                          value={values.OdometerKM}
                          onFocus={onFocus}
                          onBlur={onBlur}
                          onChange={handleChange}
                        />
                      </CCol>
                      <CCol xs={12} md={3}>
                        <CFormLabel htmlFor="odometer_closing_km">Closing Odometer KM</CFormLabel>
                        <CFormInput
                          name="odometer_closing_km"
                          size="sm"
                          id="odometer_closing_km"
                          value={values.odometer_closing_km}
                          onFocus={onFocus}
                          onBlur={onBlur}
                          onChange={handleChange}
                        />
                      </CCol>
                      <CCol xs={12} md={3}>
                        <CFormLabel htmlFor="odoImg">Open Odometer Photo</CFormLabel>
                        <CButton
                          onClick={() => setVisible(!visible)}
                          className="w-100 m-0"
                          color="info"
                          size="sm"
                          id="odoImg"
                          style={border}
                        >
                          <span className="float-start">
                            <i className="fa fa-eye" aria-hidden="true"></i> &nbsp;View
                          </span>
                        </CButton>
                        <CModal visible={visible} onClose={() => setVisible(false)}>
                          <CModalHeader>
                            <CModalTitle>Open Odometer Photo</CModalTitle>
                          </CModalHeader>

                          {/* <CModalBody>
                            <img src={currentVehicleInfo.odometer_photo} alt="" />
                          </CModalBody> */}
                          <CModalBody>
                            {currentVehicleInfo.odometer_photo &&
                            !currentVehicleInfo.odometer_photo.includes('.pdf') ? (
                              <CCardImage
                                orientation="top"
                                src={currentVehicleInfo.odometer_photo}
                              />
                            ) : (
                              <iframe
                                orientation="top"
                                height={500}
                                width={475}
                                src={currentVehicleInfo.odometer_photo}
                              ></iframe>
                            )}
                          </CModalBody>

                          <CModalFooter>
                            <CButton color="secondary" onClick={() => setVisible(false)}>
                              Close
                            </CButton>
                          </CModalFooter>
                        </CModal>
                      </CCol>

                      <CCol xs={12} md={3}>
                        <CFormLabel htmlFor="odoImg">Close Odometer Photo</CFormLabel>
                        <CButton
                          onClick={() => setVisible1(!visible1)}
                          className="w-100 m-0"
                          color="info"
                          size="sm"
                          id="odoImg"
                          style={border}
                        >
                          <span className="float-start">
                            <i className="fa fa-eye" aria-hidden="true"></i> &nbsp;View
                          </span>
                        </CButton>
                        <CModal visible={visible1} onClose={() => setVisible1(false)}>
                          <CModalHeader>
                            <CModalTitle>Close Odometer Photo</CModalTitle>
                          </CModalHeader>

                          {/* <CModalBody>
                            <img src={currentVehicleInfo.odometer_photo} alt="" />
                          </CModalBody> */}
                          <CModalBody>
                            {currentVehicleInfo.odometer_closing_photo &&
                            !currentVehicleInfo.odometer_closing_photo.includes('.pdf') ? (
                              <CCardImage
                                orientation="top"
                                src={currentVehicleInfo.odometer_closing_photo}
                              />
                            ) : (
                              <iframe
                                orientation="top"
                                height={500}
                                width={475}
                                src={currentVehicleInfo.odometer_closing_photo}
                              ></iframe>
                            )}
                          </CModalBody>

                          <CModalFooter>
                            <CButton color="secondary" onClick={() => setVisible1(false)}>
                              Close
                            </CButton>
                          </CModalFooter>
                        </CModal>
                      </CCol>
                    </>
                  ) : (
                    <></>
                  )}
                  {values.vehicle_type_id == 4 &&
                  <CCol xs={12} md={3}>
                    <CFormLabel htmlFor="party_name">
                      Party Name
                    </CFormLabel>
                    <CFormInput
                      name="party_name"
                      size="sm"
                      id="party_name"
                      onFocus={onFocus}
                      onBlur={onBlur}
                      onChange={handleChange}
                      value={values.party_name}
                    />
                  </CCol>}
                  <CCol xs={12} md={3}>
                    <CFormLabel htmlFor="vehicle_body_type_ids">
                    Vehicle Body Type
                    </CFormLabel>
                    <CFormSelect
                      name="vehicle_body_type_ids"
                      size="sm"
                      id="vehicle_body_type_ids"
                      onFocus={onFocus}
                      onBlur={onBlur}
                      onChange={handleChange}
                      value={values.vehicle_body_type_ids}
                      // readOnly
                    >
                      <option value="">Select...</option>
                        {
                          VBodytype.map(({ id, VBody }) => {
                            return (
                              <>
                                <option value={id}>{VBody}</option>
                              </>
                            )
                          })}
                  </CFormSelect>
                  </CCol>
                  <CCol xs={12} md={3}>
                    <CFormLabel htmlFor="gate_in_date_time_string">
                       Gate In Date
                    </CFormLabel>
                    <CFormInput
                      type="date"
                      name="gate_in_date_time_string"
                      size="sm"
                      id="gate_in_date_time_string"
                      onFocus={onFocus}
                      onBlur={onBlur}
                      onChange={handleChange}
                      value={values.gate_in_date_time_string}
                      disabled
                    />
                  </CCol>
                  <CCol xs={12} md={3}>
                    <CFormLabel htmlFor="vehicle_current_position">
                    Veh.Current Position
                    </CFormLabel>
                    <CFormSelect
                      name="vehicle_current_position"
                      size="sm"
                      id="vehicle_current_position"
                      onFocus={onFocus}
                      onBlur={onBlur}
                      onChange={handleChange}
                      value={values.vehicle_current_position}
                    >
                      <option value="0">Select...</option>
                        {
                          Vehicle_Current.map(({ id, CStatus }) => {
                            return (
                              <>
                                <option value={id}>{CStatus}</option>
                              </>
                            )
                          })}
                    </CFormSelect>
                  </CCol>
                  <CCol xs={12} md={3}>
                    <CFormLabel htmlFor="parking_status">
                    Parking Status
                    </CFormLabel>
                    <CFormSelect
                      name="parking_status"
                      size="sm"
                      id="parking_status"
                      onFocus={onFocus}
                      onBlur={onBlur}
                      onChange={handleChange}
                      value={values.parking_status}
                    >
                      <option value="0">Select...</option>
                        {
                          Parking_Status.map(({ id, PStatus }) => {
                            return (
                              <>
                                <option value={id}>{PStatus}</option>
                              </>
                            )
                          })}
                    </CFormSelect>
                  </CCol>
                  {currentVehicleInfo.gate_out_date_time_string == '' &&
                  <CCol xs={12} md={3}>
                    <CFormLabel htmlFor="gate_out_date_times">
                       Gate Out Date
                    </CFormLabel>
                    <CFormInput
                      type="datetime-local"
                      name="gate_out_date_times"
                      size="sm"
                      id="gate_out_date_times"
                      onFocus={onFocus}
                      onBlur={onBlur}
                      onChange={handleChange}
                      value={values.gate_out_date_times}

                    />
                  </CCol> }
                  {currentVehicleInfo.gate_out_date_time_string != '' &&
                  <CCol xs={12} md={3}>
                    <CFormLabel htmlFor="gate_out_date_time">
                       Gate Out Date
                    </CFormLabel>
                    <CFormInput
                      type="date"
                      name="gate_out_date_time"
                      size="sm"
                      id="gate_out_date_time"
                      onFocus={onFocus}
                      onBlur={onBlur}
                      onChange={handleChange}
                      value={values.gate_out_date_time}
                      disabled
                    />
                  </CCol>}

                  <CCol xs={12} md={3}>
                    <CFormLabel htmlFor="vehicle_inspection_status">
                    Inspection Status
                    </CFormLabel>
                    <CFormSelect
                      name="vehicle_inspection_status"
                      size="sm"
                      id="vehicle_inspection_status"
                      onFocus={onFocus}
                      onBlur={onBlur}
                      onChange={handleChange}
                      value={values.vehicle_inspection_status}
                    >
                  <option value="">Select...</option>
                  <option value="1">Completed</option>
                  </CFormSelect>
                  </CCol>
                  <CCol xs={12} md={3}>
                    <CFormLabel htmlFor="maintenance_status">
                    Maintenance Status
                    </CFormLabel>
                    <CFormSelect
                      name="maintenance_status"
                      size="sm"
                      id="maintenance_status"
                      onFocus={onFocus}
                      onBlur={onBlur}
                      onChange={handleChange}
                      value={values.maintenance_status}
                    >
                      <option value="">Select...</option>
                        {
                          Maintainence.map(({ id, VMain }) => {
                            return (
                              <>
                                <option value={id}>{VMain}</option>
                              </>
                            )
                          })}
                  </CFormSelect>
                  </CCol>
                  <CCol xs={12} md={3}>
                    <CFormLabel htmlFor="trip_sto_status">
                    STO Status
                    </CFormLabel>
                    <CFormSelect
                      name="trip_sto_status"
                      size="sm"
                      id="trip_sto_status"
                      onFocus={onFocus}
                      onBlur={onBlur}
                      onChange={handleChange}
                      value={values.trip_sto_status}
                    >
                  <option value="">Select...</option>
                  <option value="1">Completed</option>
                  </CFormSelect>
                  </CCol>
                  <CCol xs={12} md={3}>
                    <CFormLabel htmlFor="vendor_creation_status">
                    Vendor Creation Status
                    </CFormLabel>
                    <CFormSelect
                      name="vendor_creation_status"
                      size="sm"
                      id="vendor_creation_status"
                      onFocus={onFocus}
                      onBlur={onBlur}
                      onChange={handleChange}
                      value={values.vendor_creation_status}
                    >
                  <option value="">Select...</option>
                  <option value="1">Completed</option>
                  </CFormSelect>
                  </CCol>
                  <CCol xs={12} md={3}>
                    <CFormLabel htmlFor="document_verification_status">
                    Document Status
                    </CFormLabel>
                    <CFormSelect
                      name="document_verification_status"
                      size="sm"
                      id="document_verification_status"
                      onFocus={onFocus}
                      onBlur={onBlur}
                      onChange={handleChange}
                      value={values.document_verification_status}
                    >
                  <option value="0">Select...</option>
                  <option value="1">Completed</option>
                  </CFormSelect>
                  </CCol>
                  <CCol xs={12} md={3}>
                    <CFormLabel htmlFor="tripsheet_open_status">
                    Trip Open Status
                    </CFormLabel>
                    <CFormSelect
                      name="tripsheet_open_status"
                      size="sm"
                      id="tripsheet_open_status"
                      onFocus={onFocus}
                      onBlur={onBlur}
                      onChange={handleChange}
                      value={values.tripsheet_open_status}
                    >
                    <option value="0">Select...</option>
                    <option value="1">Open</option>
                    <option value="2">Closed</option>
                    <option value="3">Assigned</option>
                    </CFormSelect>
                  </CCol>
                  <CCol xs={12} md={3}>
                    <CFormLabel htmlFor="remarks">Remarks</CFormLabel>
                    <CFormTextarea
                      id="remarks"
                      onFocus={onFocus}
                      onBlur={onBlur}
                      onChange={handleChange}
                      value={values.remarks}
                      name="remarks"
                      rows="1"
                    >
                    </CFormTextarea>
                  </CCol>
                  <CCol xs={12} md={3}>
                    <CFormLabel htmlFor="created_by">
                    Created By
                    </CFormLabel>
                    <CFormInput
                      name="created_by"
                      size="sm"
                      id="created_by"
                      onFocus={onFocus}
                      onBlur={onBlur}
                      onChange={handleChange}
                      value={values.created_by}
                    />
                  </CCol>
                </CRow>
                <CRow className="mt-2">
                  <CCol>
                    <Link to={'/GateinReport'}>
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
                    <CButton
                      size="sm"
                      color="warning"
                      className="mx-1 px-2 text-white"
                      type="button"
                      // disabled={acceptBtn}
                      onClick={() => {
                        setFetch(false)
                        UpdateParkingVehicle()
                      }}
                    >
                      Accept
                    </CButton>
                    {(!changeDriver && values.vehicle_type_id == VEHICLE_TYPE.OWN) ||
                    values.vehicle_type_id == VEHICLE_TYPE.CONTRACT ? (
                      <CButton
                        size="sm"
                        color="warning"
                        className="mx-1 px-2 text-white"
                        type="button"
                        onClick={() => {
                          setOldDriver(currentVehicleInfo.driver_id)
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
    </>
  )
}

export default GateInUpdate
