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
  CAlert,
} from '@coreui/react'
import { React, useEffect, useState } from 'react'
import useForm from 'src/Hooks/useForm.js'
import { Link, useNavigate, useParams } from 'react-router-dom'
import PerviousLoadDetailComponent from 'src/components/commoncomponent/PerviousLoadDetailComponent'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Loader from 'src/components/Loader'
import AccessDeniedComponent from 'src/components/commoncomponent/AccessDeniedComponent'
import JavascriptInArrayComponent from 'src/components/commoncomponent/JavascriptInArrayComponent'
import * as LogisticsProScreenNumberConstants from 'src/components/constants/LogisticsProScreenNumberConstants'
import DepoVInspectionService from 'src/Service/Depo/VInspection/DepoVInspectionService'
import VehicleInspectionValidation from 'src/Utils/TransactionPages/VehicleInspection/VehicleInspectionValidation'
import IfoodsVInspectionService from 'src/Service/Ifoods/VInspection/IfoodsVInspectionService'

const IfoodsVehicleInspection = () => {
  const user_info_json = localStorage.getItem('user_info')
  const user_info = JSON.parse(user_info_json)

  /* Get User Id From Local Storage */
  const user_id = user_info.user_id

  /* ==================== Access Part Start ========================*/
  const [screenAccess, setScreenAccess] = useState(false)
  let page_no = LogisticsProScreenNumberConstants.IfoodsModuleScreens.Ifoods_Vins

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
  const border = {
    borderColor: '#b1b7c1',
  }
  const formValues = {
    truck_clean: '',
    bad_smell: '',
    insect_vevils_presence: '',
    door_condition: '',
    cob_web: '',
    panel_surface: '',
    truck_platform: '',
    oli_grease_traces: '',
    water_stagnment: '',
    vh_temp: '',
    remarks: '',

  }


  const { values, errors, handleChange, onFocus, handleSubmit, enableSubmit, onBlur, isTouched } =
    useForm(inspectVehicle, VehicleInspectionValidation, formValues)

  const navigation = useNavigate()
  const REQ = () => <span className="text-danger"> * </span>

  const addVehicleInspection = (status) => {
    let data = new FormData()
    data.append('parking_id', currentVehicleInfo.ifoods_parking_yard_gate_id)
    data.append('truck_clean', values.truck_clean)
    data.append('bad_smell', values.bad_smell)
    data.append('door_condition', values.door_condition)
    data.append('insect_vevils_presence', values.insect_vevils_presence)
    data.append('door_condition', values.door_condition)
    data.append('cob_web', values.cob_web)
    data.append('panel_surface', values.panel_surface)
    data.append('truck_platform', values.truck_platform)
    data.append('oli_grease_traces', values.oli_grease_traces)
    data.append('water_stagnment', values.water_stagnment)
    data.append('vh_temp', values.vh_temp)
    data.append('vehicle_fit_for_loading', fitForLoad == 'YES' ? 1 : 0)
    data.append('remarks', remarks)
    data.append('status', status)
    data.append('created_by', user_id)

    console.log(values)

    if (
      values.truck_clean &&
      values.bad_smell &&
      values.insect_vevils_presence &&
      values.door_condition &&
      values.cob_web &&
      values.panel_surface &&
      values.truck_platform &&
      values.oli_grease_traces &&
      values.water_stagnment &&
      values.vh_temp 
    ) {
      setFetch(true)

      IfoodsVInspectionService.handleVehicleInspectionAction(data).then((res) => {
        if (res.status == 200) {
          setFetch(true)
          toast.success('Vehicle Inspection completed')
          navigation('/IfoodsVehicleInspectionHome')
        } else if (res.status == 201) {
          toast.error('Vehicle Inspection Rejected')
          navigation('/IfoodsVehicleInspectionHome')
        }
      })
      .catch((error) => {
        setFetch(true)
        for (let value of formData.values()) {
        }
        var object = error.response.data.errors
        var output = 'Vehicle Inspection Failed. Kindly Contact Admin..!'
        for (var property in object) {
          output += '*' + object[property] + '\n'
        }
        setError(output)
        setErrorModal(true)
      })
    } else {
      setFetch(true)
      toast.warning('Please Choose All the required fields')
      return false
    }
  }

  function inspectVehicle() {}

  const [rejectConfirm, setRejectConfirm] = useState(false)
  const [errorModal, setErrorModal] = useState(false)
  const [error, setError] = useState({})
  const [currentVehicleInfo, setCurrentVehicleInfo] = useState({})
  const [fitForLoad, setFitForLoad] = useState('')
  const [fetch, setFetch] = useState(false)
  const [visible, setVisible] = useState(false)

  const { id } = useParams()

  useEffect(() => {
    IfoodsVInspectionService.getSingleVehicleInfoOnParkingYardGate(id).then((res) => {
        console.log(res.data.data,'getSingleVehicleInfoOnParkingYardGate')
        isTouched.remarks = true
        setCurrentVehicleInfo(res.data.data)
        setFetch(true)
    })
  }, [id])


  

  useEffect(() => {
    var touchLength = Object.keys(isTouched).length

    if (touchLength == Object.keys(formValues).length) {
      if (Object.keys(errors).length == 1) {
        setFitForLoad('YES')

      } else {
        setFitForLoad('NO')

      }
    }
  }, [values, errors])

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
                            value={currentVehicleInfo.ifoods_Vendor_info.vendor_name}
                            readOnly
                          />
                        </CCol>

                        <CCol md={3}>
                          <CFormLabel htmlFor="cmn">Vendor Mobile Number</CFormLabel>
                          <CFormInput
                            name="cmn"
                            size="sm"
                            id="cmn"
                            value={currentVehicleInfo.ifoods_Vendor_info.vendor_contact_no}
                            readOnly
                          />
                        </CCol>

                        <CCol md={3}>
                          <CFormLabel htmlFor="vNum">Vehicle Number</CFormLabel>
                          <CFormInput
                            name="vNum"
                            size="sm"
                            id="vNum"
                            value={currentVehicleInfo.ifoods_Vehicle_info.vehicle_number}
                            readOnly
                          />
                        </CCol>
                        <CCol xs={12} md={3}>
                          <CFormLabel htmlFor="vcim">Vehicle Feet</CFormLabel>
                          <CFormInput
                            name="vcim"
                            size="sm"
                            id="vcim"
                            value={currentVehicleInfo.ifoods_Vehicle_info.feet_info.capacity}
                            readOnly
                          />
                        </CCol>
                        <CRow className="">
                        <CCol xs={12} md={3}>
                          <CFormLabel htmlFor="vcim">Vehicle Capacity In Mts</CFormLabel>
                          <CFormInput
                            name="vcim"
                            size="sm"
                            id="vcim"
                            value={currentVehicleInfo.ifoods_Vehicle_info.vehicle_capacity_info.capacity}
                            readOnly
                          />
                        </CCol>
                     

                      
                        <CCol xs={12} md={3}>
                          <CFormLabel htmlFor="vbt">Vehicle Body Type</CFormLabel>
                          <CFormInput
                            name="vbt"
                            size="sm"
                            id="vbt"
                            value={currentVehicleInfo.ifoods_Vehicle_info.vehicle_body_type_info.body_type}
                            readOnly
                          />
                        </CCol>
                        <CCol xs={12} md={3}>
                          <CFormLabel htmlFor="vivt">Vehicle Insurance Valid To </CFormLabel>
                          <CFormInput
                            name="vivt"
                            size="sm"
                            id="vivt"
                            value={currentVehicleInfo.ifoods_Vehicle_info.insurance_validity}
                            readOnly
                          />
                        </CCol>
                        <CCol xs={12} md={3}>
                          <CFormLabel htmlFor="vfvt">Vehicle FC Valid To </CFormLabel>
                          <CFormInput
                            name="vfvt"
                            size="sm"
                            id="vfvt"
                            value={currentVehicleInfo.ifoods_Vehicle_info.fc_validity}
                            readOnly
                          />
                        </CCol>
                        </CRow>
                        <CRow className="">
                        <CCol xs={12} md={3}>
                          <CFormLabel htmlFor="gateInDateTime">Gate-In Date & Time</CFormLabel>
                          <CFormInput
                            name="gateInDateTime"
                            size="sm"
                            id="gateInDateTime"
                            value={currentVehicleInfo.gate_in_date_time_string}
                            readOnly
                          />
                        </CCol>
                      
                     
                      <CCol xs={12} md={3}>
                          <CFormLabel htmlFor="dname">Freezer Availability </CFormLabel>
                          <CFormInput
                            name="dname"
                            size="sm"
                            id="dname"
                            value={currentVehicleInfo.ifoods_Vehicle_info.ac_non_ac == 0 ? 'Non-AC' : 'AC'}
                            readOnly
                          />
                        </CCol>
                        <CCol xs={12} md={3}>
                          <CFormLabel htmlFor="dname">Driver name </CFormLabel>
                          <CFormInput
                            name="dname"
                            size="sm"
                            id="dname"
                            value={currentVehicleInfo.driver_name}
                            readOnly
                          />
                        </CCol>
                        <CCol xs={12} md={3}>
                          <CFormLabel htmlFor="dmn">Driver Mobile Number </CFormLabel>
                          <CFormInput
                            name="dmn"
                            size="sm"
                            id="dmn"
                            value={currentVehicleInfo.driver_number}
                            readOnly
                          />
                        </CCol>
                        </CRow>
                        {/* {currentVehicleInfo.vehicle_type_id.id == VEHICLE_TYPE.OWN ||
                  currentVehicleInfo.vehicle_type_id.id == VEHICLE_TYPE.CONTRACT ? (
                    <> */}

                      <CCol xs={12} md={3}>
                        <CFormLabel htmlFor="OdometerKM">Odometer KM</CFormLabel>
                        <CFormInput
                          name="OdometerKM"
                          size="sm"
                          id="OdometerKM"
                          value={currentVehicleInfo.odometer_km}
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
                    {/* </> */}
                  {/* ) : ( */}
                    {/* <></> */}
                  {/* )} */}
                     
                     

                     
                        <CCol xs={12} md={3}>
                          <CFormLabel htmlFor="truck_clean">
                            Truck Clean <REQ />{' '}
                          </CFormLabel>
                          <br />
                          <CButtonGroup role="group" aria-label="Basic checkbox toggle button group">
                            <CFormCheck
                              type="radio"
                              button={{ color: 'success', variant: 'outline' }}
                              name="truck_clean"
                              id="btnradio1"
                              onChange={handleChange}
                              autoComplete="off"
                              value="1"
                              label="Yes"
                            />
                            <CFormCheck
                              type="radio"
                              button={{ color: 'danger', variant: 'outline' }}
                              name="truck_clean"
                              id="btnradio2"
                              autoComplete="off"
                              onChange={handleChange}
                              value="0"
                              label="No"
                            />
                          </CButtonGroup>
                        </CCol>
                        <CCol xs={12} md={3}>
                          <CFormLabel htmlFor="bad_smell">
                            Bad Smell <REQ />{' '}
                          </CFormLabel>
                          <br />
                          <CButtonGroup role="group" aria-label="Basic checkbox toggle button group">
                            <CFormCheck
                              type="radio"
                              button={{ color: 'danger', variant: 'outline' }}
                              name="bad_smell"
                              id="btnradio3"
                              autoComplete="off"
                              onChange={handleChange}
                              value="1"
                              label="Yes"
                            />
                            <CFormCheck
                              type="radio"
                              button={{ color: 'success', variant: 'outline' }}
                              name="bad_smell"
                              id="btnradio4"
                              autoComplete="off"
                              value="0"
                              onChange={handleChange}
                              label="No"
                            />
                          </CButtonGroup>
                        </CCol>
                        <CCol xs={12} md={3}>
                          <CFormLabel htmlFor="insect_vevils_presence">
                            Insect or Vevils Presence <REQ />{' '}
                          </CFormLabel>
                          <br />
                          <CButtonGroup role="group" aria-label="Basic checkbox toggle button group">
                            <CFormCheck
                              type="radio"
                              button={{ color: 'danger', variant: 'outline' }}
                              name="insect_vevils_presence"
                              id="btnradio5"
                              autoComplete="off"
                              label="Yes"
                              value="1"
                              onChange={handleChange}
                            />
                            <CFormCheck
                              type="radio"
                              button={{ color: 'success', variant: 'outline' }}
                              name="insect_vevils_presence"
                              id="btnradio6"
                              autoComplete="off"
                              label="No"
                              value="0"
                              onChange={handleChange}
                            />
                          </CButtonGroup>
                        </CCol>
                        
                        
                           <CCol xs={12} md={3}>
                          <CFormLabel htmlFor="door_condition">
                          Door Condition<REQ />{' '}
                          </CFormLabel>
                          <br />
                          <CButtonGroup role="group" aria-label="Basic checkbox toggle button group">
                            <CFormCheck
                              type="radio"
                              button={{ color: 'danger', variant: 'outline' }}
                              name="door_condition"
                              id="btnradio6"
                              autoComplete="off"
                              label="Bad"
                              value="0"
                              onChange={handleChange}
                            />
                            <CFormCheck
                              type="radio"
                              button={{ color: 'success', variant: 'outline' }}
                              name="door_condition"
                              id="btnradio7"
                              autoComplete="off"
                              label="Good"
                              value="1"
                              onChange={handleChange}
                            />
                          
                          </CButtonGroup>
                        </CCol>
                    
                        <CCol xs={12} md={3}>
                          <CFormLabel htmlFor="cob_web">
                            Cob-Web <REQ />{' '}
                          </CFormLabel>
                          <br />
                          <CButtonGroup role="group" aria-label="Basic checkbox toggle button group">
                            <CFormCheck
                              type="radio"
                              button={{ color: 'danger', variant: 'outline' }}
                              name="cob_web"
                              id="btnradio9"
                              autoComplete="off"
                              label="Yes"
                              value="1"
                              onChange={handleChange}
                            />
                            <CFormCheck
                              type="radio"
                              button={{ color: 'success', variant: 'outline' }}
                              name="cob_web"
                              id="btnradio10"
                              autoComplete="off"
                              label="No"
                              onChange={handleChange}
                              value="0"
                            />
                          </CButtonGroup>
                        </CCol>
                        <CCol xs={12} md={3}>
                          <CFormLabel htmlFor="panel_surface">
                          Panel Surface <REQ />{' '}
                          </CFormLabel>
                          <br />
                          <CButtonGroup role="group" aria-label="Basic checkbox toggle button group">
                            <CFormCheck
                              type="radio"
                              button={{ color: 'danger', variant: 'outline' }}
                              name="panel_surface"
                              id="btnradio11"
                              autoComplete="off"
                              label="Bad"
                              onChange={handleChange}
                              value="0"
                            />
                            <CFormCheck
                              type="radio"
                              button={{ color: 'success', variant: 'outline' }}
                              name="panel_surface"
                              id="btnradio12"
                              autoComplete="off"
                              label="Good"
                              value="1"
                              onChange={handleChange}
                            />
                          </CButtonGroup>
                        </CCol>
                        <CCol xs={12} md={3}>
                          <CFormLabel htmlFor="truck_platform">
                            Truck Platform <REQ />{' '}
                          </CFormLabel>
                          <br />
                          <CButtonGroup role="group" aria-label="Basic checkbox toggle button group">
                            <CFormCheck
                              type="radio"
                              button={{ color: 'success', variant: 'outline' }}
                              name="truck_platform"
                              id="btnradio13"
                              autoComplete="off"
                              label="Good"
                              onChange={handleChange}
                              value="0"
                            />
                            <CFormCheck
                              type="radio"
                              button={{ color: 'danger', variant: 'outline' }}
                              name="truck_platform"
                              id="btnradio14"
                              onChange={handleChange}
                              autoComplete="off"
                              label="Bad"
                              value="1"
                            />
                          </CButtonGroup>
                        </CCol>
                        
                        <CCol xs={12} md={3}>
                          <CFormLabel htmlFor="water_stagnment">
                          Water Stagnant <REQ />{' '}
                          </CFormLabel>
                          <br />
                          <CButtonGroup role="group" aria-label="Basic checkbox toggle button group">
                            <CFormCheck
                              type="radio"
                              button={{ color: 'success', variant: 'outline' }}
                              name="water_stagnment"
                              id="btnradio15"
                              autoComplete="off"
                              label="No"
                              onChange={handleChange}
                              value="0"
                            />
                            <CFormCheck
                              type="radio"
                              button={{ color: 'danger', variant: 'outline' }}
                              name="water_stagnment"
                              id="btnradio16"
                              onChange={handleChange}
                              autoComplete="off"
                              label="Yes"
                              value="1"
                            />
                          </CButtonGroup>
                        </CCol>
                        <CCol xs={12} md={3}>
                          <CFormLabel htmlFor="oli_grease_traces">
                          Oil / Grease Traces <REQ />{' '}
                          </CFormLabel>
                          <br />
                          <CButtonGroup role="group" aria-label="Basic checkbox toggle button group">
                            <CFormCheck
                              type="radio"
                              button={{ color: 'success', variant: 'outline' }}
                              name="oli_grease_traces"
                              id="btnradio20"
                              autoComplete="off"
                              label="No"
                              onChange={handleChange}
                              value="1"
                            />
                            <CFormCheck
                              type="radio"
                              button={{ color: 'danger', variant: 'outline' }}
                              name="oli_grease_traces"
                              id="btnradio19"
                              onChange={handleChange}
                              autoComplete="off"
                              label="Yes"
                              value="0"
                            />
                          </CButtonGroup>
                        </CCol>
                        <CCol xs={12} md={3}>
                          <CFormLabel htmlFor="vh_temp">
                          Vehicle Temp ( -20℃ ) <REQ />{' '}
                          </CFormLabel>
                          <br />
                          <CButtonGroup role="group" aria-label="Basic checkbox toggle button group">
                            <CFormCheck
                              type="radio"
                              button={{ color: 'success', variant: 'outline' }}
                              name="vh_temp"
                              id="btnradio17"
                              autoComplete="off"
                              label="Yes"
                              onChange={handleChange}
                              value="0"
                            />
                            <CFormCheck
                              type="radio"
                              button={{ color: 'danger', variant: 'outline' }}
                              name="vh_temp"
                              id="btnradio18"
                              onChange={handleChange}
                              autoComplete="off"
                              label="No"
                              value="1"
                            />
                          </CButtonGroup>
                        </CCol>
                        {/* <CCol xs={12} md={3}>
                          <CFormLabel htmlFor="previous_load_details">
                            Previous Load Details <REQ />{' '}
                            {errors.previous_load_details && (
                              <span className="small text-danger">{errors.previous_load_details}</span>
                            )}
                          </CFormLabel>
                          <CFormSelect
                            size="sm"
                            name="previous_load_details"
                            id="previous_load_details"
                            onFocus={onFocus}
                            onBlur={onBlur}
                            onChange={handleChange}
                            value={values.previous_load_details}
                            la={'Small select example'}
                          >
                            <PerviousLoadDetailComponent />
                          </CFormSelect>
                        </CCol> */}
                        <CCol xs={12} md={3}>
                          <CFormLabel htmlFor="vFitLoad">
                            Vehicle Fit For Loading
                            {errors.vFitLoad && (
                              <span className="small text-danger">{errors.vFitLoad}</span>
                            )}
                          </CFormLabel>
                          <CFormInput
                            name="vFitLoad"
                            size="sm"
                            id="vFitLoad"
                            onFocus={onFocus}
                            onBlur={onBlur}
                            onChange={handleChange}
                            value={fitForLoad}
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
                            value={remarks || ''}
                            name="remarks"
                            rows="1"
                          >
                          </CFormTextarea>
                        </CCol>
                      </CRow>
                      <CRow className="mt-2">
                        <CCol>
                          <Link to={'/vInspection'}>
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
                            onClick={() => {
                              setFetch(false)
                              addVehicleInspection(1)
                            }}
                          >
                            Accept
                          </CButton>

                          {/* <CButton
                            size="sm"
                            color="warning"
                            className="mx-1 px-2 text-white"
                            type="button"
                            onClick={() => {
                              setRejectConfirm(true)
                            }}
                          >
                            Reject
                          </CButton> */}
                        </CCol>

                      </CRow>
                    </CForm>
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
      {/* ======================= Confirm Button Modal Area ========================== */}
      <CModal
        visible={rejectConfirm}
        backdrop="static"
        onClose={() => {
          setRejectConfirm(false)
        }}
      >
        <CModalBody>
          <p className="lead">Are you sure to reject this vehicle inspection ?</p>
        </CModalBody>
        <CModalFooter>
          <CButton
            className="m-2"
            color="warning"
            onClick={() => {
              setRejectConfirm(false)
              setFetch(false)
              addVehicleInspection(2)
            }}
          >
            Confirm
          </CButton>
          <CButton
            color="secondary"
            onClick={() => {
              setRejectConfirm(false)
            }}
          >
            Cancel
          </CButton>
        </CModalFooter>
      </CModal>
      {/* *********************************************************** */}
    </>
  )
}

export default IfoodsVehicleInspection
