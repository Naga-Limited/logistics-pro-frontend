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
import Swal from 'sweetalert2'
import AccessDeniedComponent from 'src/components/commoncomponent/AccessDeniedComponent'
import JavascriptInArrayComponent from 'src/components/commoncomponent/JavascriptInArrayComponent'
import * as LogisticsProScreenNumberConstants from 'src/components/constants/LogisticsProScreenNumberConstants'
import IfoodsVehicleStoListComponent from 'src/components/commoncomponent/IfoodsVehicleStoListComponent'
import IfoodsVehicleAssignmentListComponent from 'src/components/commoncomponent/IfoodsVehicleAssignmentListComponent'
import IfoodsTSCreationService from 'src/Service/Ifoods/TSCreation/IfoodsTSCreationService'
import IfoodsVehicleAssignment from 'src/Service/SAP/IfoodsVehicleAssignment'

const TripSheetEditRequest = () => {
  const user_info_json = localStorage.getItem('user_info')
  const user_info = JSON.parse(user_info_json)

  /* Get User Id From Local Storage */
  const user_id = user_info.user_id

  /* ==================== Access Part Start ========================*/
  const [screenAccess, setScreenAccess] = useState(false)

  let page_no = LogisticsProScreenNumberConstants.IfoodsModuleScreens.Ifoods_Tripsheet_Edit

  useEffect(() => {
    if (
      user_info.is_admin == 1 ||
      JavascriptInArrayComponent(page_no, user_info.page_permissions)
    ) {
      //  console.log('screen-access-allowed')
      setScreenAccess(true)
    } else{
    //  console.log('screen-access-not-allowed')
      setScreenAccess(false)
    }

  },[])
  /* ==================== Access Part End ========================*/


  const [driverChange, setDriverChange] = useState(false)
  const [driverPhoneNumberById, setDriverPhoneNumberById] = useState('')
  const [driverCodeById, setDriverCodeById] = useState('')
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

  const onChange = (event) => {
    let driverId = event.value
    if (driverId) {
      values.driverId = driverId

      ParkingYardGateService.getDriverInfoById(driverId).then((res) => {
        setDriverPhoneNumberById(res.data.data.driver_phone_1)
        setDriverCodeById(res.data.data.driver_code)
      })
   //  console.log(driverPhoneNumberById)
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

  const {
    values,
    errors,
    handleChange,
    onFocus,
    handleSubmit,
    handleMultipleChange,
    enableSubmit,
    onBlur,
    isTouched,
  } = useForm(TripSheetCancel, VehicleInspectionValidation, formValues)

  const navigation = useNavigate()
  const REQ = () => <span className="text-danger"> * </span>

  const UpdateTripsheetVehicle = () => {

    let data = new FormData()
    // data.append('parking_id', currentVehicleInfo.parking_yard_gate_id)
    // data.append('trip_sheet_id', currentVehicleInfo.tripsheet_sheet_id)
   // data.append('shipment_po', values.shipment_po || '')
    // data.append('purpose', values.purpose)
    // data.append('to_divison', values.Division)
    // data.append('advance_amount', values.advance_amount)
    // data.append('freight_rate_per_tone', values.freight_rate_per_tone || '')
    // data.append('advance_payment_diesel', values.advance_payment_diesel || '')
    // data.append('vehicle_sourced_by', values.vehicle_sourced_by || '')
   // data.append('expected_delivery_date', values.expected_delivery_date || '')
    // data.append('expected_return_date_time', values.expected_return_date_time || '')
    data.append('id', id || '')
    data.append('remarks', remarks || '')
    data.append('updated_by', user_id)
    if (values.shipment_po ) {
      data.append('shipment_po', values.shipment_po)
     // data.append('old_driver_id', oldDriver)
    }
    data.append('delivery_info', JSON.stringify(loadDetail))
    // if (values.purpose == '2' && values.vehicle_sourced_by == 0) {
    //   toast.warning('Select Vehicle Sourced By ...')
    //   setFetch(true)
    //   return false
    // }
    if (values.expected_delivery_date == '' && values.expected_delivery_date == null) {
      toast.warning('Select Expected Date ...')
      setFetch(true)
      return false
    }
    if (values.remarks == '' && values.remarks == null) {
      toast.warning('remarks ...')
      setFetch(true)
      return false
    }
  
    IfoodsTSCreationService.updateTripSheet(id, data).then((res) => {
      if (res.status == 200) {
        setFetch(true)
        toast.success('TripSheet Updated Sucessfully')
        navigation('/IfoodsTripSheetEditHome')
      }
    })
  }
  const getOutlets = () => {
    const formattedObjects = currentVehicleInfo.ifoods_SalesRoute_info.ifoods_Alloutlet_Info
      .map(
        (outlet) =>
          `<li><b> Outlet Name & Code</b> ${outlet.outlet_name}  <b>&</b> ${outlet.outlet_code}`
      )
      .join('\n')
    Swal.fire({
      title: `Route Name : ${currentVehicleInfo.ifoods_SalesRoute_info.route_name} `,
      html: formattedObjects,
      confirmButtonText: 'Close',

      width: 800,
      padding: '3em',
      confirmButtonColor: '#ff6600',
      confirmButtonText: 'Close',
      iconColor: '#ff6600',
    })
  }

  function TripSheetCancel  () {
    let data = new FormData()
    data.append('parking_id', currentVehicleInfo.parking_yard_gate_id)
    data.append('trip_sheet_id', currentVehicleInfo.tripsheet_sheet_id)
    data.append('remarks', remarks || '')
    data.append('updated_by', user_id)

    //console.log(values.remarks)

    if (remarks == '' || remarks == null) {
      toast.warning('Remarks Field is Mandatory')
      setFetch(true)
      return false
    }

    IfoodsTSCreationService.tripSheet_cancel(id,data).then((res) => {
        if (res.status == 200) {
          setFetch(true)
          toast.success('TripSheet Cancel Sucessfully')
          navigation('/IfoodsTripSheetEditHome')
        }
      })
    }

  const [currentVehicleInfo, setCurrentVehicleInfo] = useState({})
  const [fetch, setFetch] = useState(false)
  const [confirmBtn, setConfirmBtn] = useState(false)
  const [confirmBtn1, setConfirmBtn1] = useState(false)
  const [visible, setVisible] = useState(false)
  const VEHICLE_TYPE = {
    OWN: '1',
    CONTRACT: '2',
    HIRE: '3',
    PARTY: '4',
  }

  const { id } = useParams()


  function formatDate(date) {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear()

    if (month.length < 2) month = '0' + month
    if (day.length < 2) day = '0' + day

    return [day, month, year].join('-')
  }

 

  useEffect(() => {

    IfoodsTSCreationService.getTripsheetInfoById(id).then((res) => {
      setFetch(true)
      const tableData =res.data.data
      console.log(tableData)
      values.vendor_name = tableData.ifoods_Vendor_info.vendor_name
      values.ifoods_tripsheet_no = tableData.tripsheet_info[0].ifoods_tripsheet_no
      values.trip_crate = tableData.tripsheet_info[0].trip_crate
      values.vehicle_number = tableData.ifoods_Vehicle_info.vehicle_number
      values.capacity = tableData.ifoods_Vehicle_info.vehicle_capacity_info.capacity
      values.body_type = tableData.ifoods_Vehicle_info.vehicle_body_type_info.body_type   
      values.insurance_validity = tableData.ifoods_Vehicle_info.insurance_validity
      values.fc_validity = tableData.ifoods_Vehicle_info.fc_validity   
      values.gate_in_date_time_string = tableData.gate_in_date_time_string
      values.driver_name = tableData.driver_name
      values.driver_number = tableData.driver_number
      values.odometer_km = tableData.odometer_km 
      values.odometer_photo = tableData.odometer_photo
      values.gate_in_date_time_string = tableData.gate_in_date_time_string    
      values.unplanned_km = tableData.unplanned_km
      values.division = 'NLIF'
      values.inspection_time_string = tableData.ifoods_inspection_info[0].created_at
      values.fromlocation = tableData.ifoods_StoRoute_info
        ? tableData.ifoods_StoRoute_info.from_location_info.location
        : ''
      values.tolocation = tableData.ifoods_StoRoute_info
        ? tableData.ifoods_StoRoute_info.to_location_info.location
        : ''
   //   values.route_name = tableData.ifoods_SalesRoute_info.route_name
    //  values.route_nameLength = tableData.ifoods_SalesRoute_info.ifoods_Alloutlet_Info.length
      values.shipment_po = tableData.tripsheet_info[0].shipment_po
      values.purpose = tableData.purpose
      values.shipment = res.data.data.purpose
      values.expected_delivery_date = tableData.tripsheet_info[0].expected_delivery_date
      setRemarks(res.data.data.trip_sheet_info?.remarks)
      setCurrentVehicleInfo(res.data.data)
      // console.log(res.data.data).
      console.log('Date expected_delivery_date')
      console.log('')
      // console.log()
    })
  }, [id])

  const [remarks, setRemarks] = useState('')
  const handleChangenew = (event) => {
    const result = event.target.value.toUpperCase()

    setRemarks(result)
  }

  const [vehicleCapacity, setVehicleCapacity] = useState([])
  const [checked, setChecked] = React.useState(false)

  useEffect(() => {
    // section for getting vehicle capacity from database
    VehicleCapacityService.getVehicleCapacity().then((res) => {
      setFetch(true)
      setVehicleCapacity(res.data.data)
    })
  }, [])
  const [loadDetails, setLoadDetails] = useState([])
  const [loadDetail, setLoadDetail] = useState([])
  useEffect(() => {
    IfoodsVehicleAssignment.getshipmentData(values.purpose).then((res) => {
      setFetch(true)
      let tableData = res.data
      let filterData = tableData.filter((data) => data.STATUS == currentVehicleInfo.purpose)
      setLoadDetails(filterData)
      const shipment_data = res.data
      const matchingShipments = []

      shipment_data.forEach((shipment) => {
        if (values.shipment_po.includes(shipment.SHIPMENT_OR_PO)) {
          matchingShipments.push(shipment)
        }
      })

      const shipmentsByDeliveryNo = matchingShipments.reduce((acc, shipment) => {
        const { DELIVERY_NO } = shipment
        if (!acc[DELIVERY_NO]) {
          acc[DELIVERY_NO] = []
        }
        acc[DELIVERY_NO].push(shipment)
        return acc
      }, {})

      const filteredArray = Object.values(shipmentsByDeliveryNo).filter(
        (value) => value !== undefined
      )

      console.log(filteredArray)
      console.log(JSON.stringify(filteredArray))
      setLoadDetail(filteredArray)
      console.log(JSON.stringify(filteredArray))
    })
    // .catch((error) => {
    //   console.error(error)
    // })
      
  
  }, [values.purpose,values.shipment_po])



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

    //console.log(today,'today')

    const date = new Date(today);

    min_date = getDateXDaysAgo(0, date)
    // max_date = getDateXDaysBefore(30, date)
    // max_date = today

    let date_component = {}

    date_component.min_date = min_date
    date_component.max_date = max_date

   // console.log(date_component,'date_component')

    return date_component
   }

   const Expense_Income_Posting_Date = ExpenseIncomePostingDate();

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
                          <CFormLabel htmlFor="cname">Vendor Name</CFormLabel>
                          <CFormInput
                            name="cname"
                            size="sm"
                            id="cname"
                            value={values.vendor_name}
                            readOnly
                          />
                        </CCol>

                        <CCol md={3}>
                          <CFormLabel htmlFor="cmn">Tripsheet Number</CFormLabel>
                          <CFormInput
                            name="cmn"
                            size="sm"
                            id="cmn"
                            value={values.ifoods_tripsheet_no}
                            readOnly
                          />
                        </CCol>

                        <CCol md={3}>
                          <CFormLabel htmlFor="vNum">Vehicle Number</CFormLabel>
                          <CFormInput
                            name="vNum"
                            size="sm"
                            id="vNum"
                            value={values.vehicle_number}
                            readOnly
                          />
                        </CCol>

                        <CCol xs={12} md={3}>
                          <CFormLabel htmlFor="vcim">Vehicle Capacity In Feet</CFormLabel>
                          <CFormInput
                            name="vcim"
                            size="sm"
                            id="vcim"
                            value={values.capacity}
                            readOnly
                          />
                        </CCol>
                      </CRow>

                      <CRow className="">
                        <CCol xs={12} md={3}>
                          <CFormLabel htmlFor="vbt">Vehicle Body Type</CFormLabel>
                          <CFormInput
                            name="vbt"
                            size="sm"
                            id="vbt"
                            value={values.body_type}
                            readOnly
                          />
                        </CCol>
                        <CCol xs={12} md={3}>
                          <CFormLabel htmlFor="vivt">Vehicle Insurance Valid To </CFormLabel>
                          <CFormInput
                            name="vivt"
                            size="sm"
                            id="vivt"
                            value={values.insurance_validity}
                            readOnly
                          />
                        </CCol>
                        <CCol xs={12} md={3}>
                          <CFormLabel htmlFor="vfvt">Vehicle FC Valid To </CFormLabel>
                          <CFormInput
                            name="vfvt"
                            size="sm"
                            id="vfvt"
                            value={values.fc_validity}
                            readOnly
                          />
                        </CCol>
                        <CCol xs={12} md={3}>
                          <CFormLabel htmlFor="gateInDateTime">Gate-In Date & Time</CFormLabel>
                          <CFormInput
                            name="gateInDateTime"
                            size="sm"
                            id="gateInDateTime"
                            value={values.gate_in_date_time_string}
                            readOnly
                          />
                        </CCol>
                      </CRow>
                      <CRow className="">
                        <CCol xs={12} md={3}>
                          <CFormLabel htmlFor="dname">Driver name </CFormLabel>
                          <CFormInput
                            name="dname"
                            size="sm"
                            id="dname"
                            value={values.driver_name}
                            readOnly
                          />
                        </CCol>
                        <CCol xs={12} md={3}>
                          <CFormLabel htmlFor="dmn">Driver Mobile Number </CFormLabel>
                          <CFormInput
                            name="dmn"
                            size="sm"
                            id="dmn"
                            value={values.driver_number}
                            readOnly
                          />
                        </CCol>

                        <CCol xs={12} md={3}>
                          <CFormLabel htmlFor="OdometerKM">Odometer KM</CFormLabel>
                          <CFormInput
                            name="OdometerKM"
                            size="sm"
                            id="OdometerKM"
                            value={values.odometer_km}
                            readOnly
                          />
                        </CCol>
                        <CCol xs={12} md={3}>
                          <CFormLabel htmlFor="odoImg">Odometer Photo</CFormLabel>
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
                              <CModalTitle>Odometer Photo</CModalTitle>
                            </CModalHeader>

                            <CModalBody>
                              <img src={values.odometer_photo} alt="" />
                            </CModalBody>
                            <CModalBody>
                              {values.odometer_photo && !values.odometer_photo.includes('.pdf') ? (
                                <CCardImage orientation="top" src={values.odometer_photo} />
                              ) : (
                                <iframe
                                  orientation="top"
                                  height={500}
                                  width={475}
                                  src={values.odometer_photo}
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
                          <CFormLabel htmlFor="inspectionDateTime">
                            Inspection Date & Time
                          </CFormLabel>
                          <CFormInput
                            name="inspectionDateTime"
                            size="sm"
                            id="inspectionDateTime"
                            value={formatDate(values.inspection_time_string)}
                            readOnly
                          />
                        </CCol>
                        <CCol xs={12} md={3}>
                          <CFormLabel htmlFor="div_pur">Division</CFormLabel>
                          <CFormInput
                            name="div_pur"
                            size="sm"
                            id="div_pur"
                            value={'NLIF'}
                            readOnly
                          />
                        </CCol>

                        <CCol xs={12} md={3}>
                          <CFormLabel htmlFor="purpose">Purpose</CFormLabel>
                          <CFormInput
                            size="sm"
                            name="purpose"
                            id="purpose"
                            onFocus={onFocus}
                            onBlur={onBlur}
                            onChange={handleChange}
                            value={values.purpose == 1 ? 'FG-Sales' : 'FG-STO'}
                            readOnly
                            className={`${errors.purpose && 'is-invalid'}`}
                          ></CFormInput>
                        </CCol>

                        {currentVehicleInfo.purpose == 2 && (
                          <>
                            <CCol xs={12} md={5}>
                              <CFormLabel htmlFor="">STO Journey</CFormLabel>
                              <CFormInput
                                size="sm"
                                name="purpose"
                                id="purpose"
                                onFocus={onFocus}
                                onBlur={onBlur}
                                onChange={handleChange}
                                value={`${values.fromlocation}  - ${currentVehicleInfo.ifoods_StoRoute_info.to_location_info.location} `}
                                readOnly
                                className={`${errors.purpose && 'is-invalid'}`}
                              ></CFormInput>
                            </CCol>

                            <CCol className="mb-3" md={3}>
                              <CFormLabel htmlFor="shipment_po">
                                Delivery Number <REQ />{' '}
                                {errors.shipment_po && (
                                  <span className="small text-danger">{errors.shipment_po}</span>
                                )}
                              </CFormLabel>

                              <IfoodsVehicleStoListComponent
                                size="sm"
                                name="shipment_po"
                                id="shipment_po"
                                onFocus={onFocus}
                                onBlur={onBlur}
                                onChange={handleMultipleChange}
                                selectedValue={values.shipment_po}
                                //  search_type="shipment_po"
                                // search_data={loadDetails}
                                isMultiple={true}
                                className={`mb-1 ${errors.shipment_po && 'is-invalid'}`}
                                label="Select Shipment Location"
                                noOptionsMessage="No Shipment found"
                              />
                            </CCol>
                          </>
                        )}
                      </CRow>
                      <CRow className="">
                        {currentVehicleInfo.ifoods_SalesRoute_info == 1 &&  (
                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="">Un Planned KM</CFormLabel>
                            <CFormInput
                              size="sm"
                              name="purpose"
                              id="purpose"
                              onFocus={onFocus}
                              onBlur={onBlur}
                              onChange={handleChange}
                              value={values.unplanned_km }
                              readOnly
                              className={`${errors.purpose && 'is-invalid'}`}
                            ></CFormInput>
                          </CCol>
                        )}

                        {currentVehicleInfo.purpose == 1 && (
                          <CCol className="mb-3" md={3}>
                            <CFormLabel htmlFor="shipment_po">
                              Shipment Number <REQ />{' '}
                              {errors.shipment_po && (
                                <span className="small text-danger">{errors.shipment_po}</span>
                              )}
                            </CFormLabel>
                              <IfoodsVehicleAssignmentListComponent
                              size="sm"
                              name="shipment_po"
                              id="shipment_po"
                              onFocus={onFocus}
                              onBlur={onBlur}
                              onChange={handleMultipleChange}
                            
                              selectedValue={values.shipment_po}
                        
                              isMultiple={true}
                              className={`mb-1 ${errors.shipment_po && 'is-invalid'}`}
                              label="Select Shipment Location"
                              noOptionsMessage="No Shipment found"
                            />
                          </CCol>
                        )}

                        
                        <CCol xs={12} md={3}>
                          <CFormLabel htmlFor="expected_delivery_date">
                            Despatched Crate Count <REQ />{' '}
                            {errors.expected_delivery_date && (
                              <span className="small text-danger">
                                {errors.expected_delivery_date}
                              </span>
                            )}
                          </CFormLabel>
                          <CFormInput
                            name="inspectionDateTime"
                            size="sm"
                            id="inspectionDateTime"
                            value={values.trip_crate}
                            readOnly
                          />
                        </CCol>

                        <CCol xs={12} md={3}>
                          <CFormLabel htmlFor="expected_delivery_date">
                            Expected Delivery Date <REQ />{' '}
                            {errors.expected_delivery_date && (
                              <span className="small text-danger">
                                {errors.expected_delivery_date}
                              </span>
                            )}
                          </CFormLabel>
                          <CFormInput
                            name="inspectionDateTime"
                            size="sm"
                            id="inspectionDateTime"
                            value={formatDate(values.inspection_time_string)}
                            readOnly
                          />
                        </CCol>
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
                          ></CFormTextarea>
                        </CCol>
                      </CRow>
                      <CRow className="mt-2">
                        <CCol>
                          <Link to={'/IfoodsIfoodsTripSheetEditHome'}>
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
                              setConfirmBtn(true)
                            }}
                          >
                            Submit
                          </CButton>
                          {currentVehicleInfo.vehicle_current_position == '16' && (
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
                            </CButton>
                          )}
                          {(!changeDriver &&
                            currentVehicleInfo?.trip_sheet_info?.advance_status == '0' &&
                            currentVehicleInfo?.vehicle_type_id?.id == VEHICLE_TYPE.OWN) ||
                          currentVehicleInfo?.vehicle_type_id?.id == VEHICLE_TYPE.CONTRACT ? (
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
          ) : (
            <AccessDeniedComponent />
          )}
        </>
      )}
      <CModal visible={confirmBtn} onClose={() => setConfirmBtn(false)}>
        <CModalBody>
          <p className="lead">Are You sure To Edit TripSheet ? </p>
        </CModalBody>
        <CModalFooter>
          <CButton className="m-2" color="secondary" onClick={() => setConfirmBtn(false)}>
            No
          </CButton>
          <CButton
            color="warning"
            onClick={() => {
              setConfirmBtn(false)
              setFetch(false)
              UpdateTripsheetVehicle()
            }}
          >
            Yes
          </CButton>
        </CModalFooter>
      </CModal>

      <CModal visible={confirmBtn1} onClose={() => setConfirmBtn1(false)}>
        <CModalBody>
          <p className="lead" style={{ color: 'red' }}>
            Are You sure To Cancel This TripSheet ?{' '}
          </p>
        </CModalBody>
        <CModalFooter>
          <CButton className="m-2" color="secondary" onClick={() => setConfirmBtn1(false)}>
            No
          </CButton>
          <CButton
            color="warning"
            onClick={() => {
              setConfirmBtn1(false)
              setFetch(false)
              TripSheetCancel()
            }}
          >
            Yes
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}

export default TripSheetEditRequest

