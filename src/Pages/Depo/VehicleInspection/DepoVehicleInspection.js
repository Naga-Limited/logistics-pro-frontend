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

const DepoVehicleInspection = () => {
  const user_info_json = localStorage.getItem('user_info')
  const user_info = JSON.parse(user_info_json)

  /* Get User Id From Local Storage */
  const user_id = user_info.user_id

  /* ==================== Access Part Start ========================*/
  const [screenAccess, setScreenAccess] = useState(false)
  let page_no = LogisticsProScreenNumberConstants.DepoModuleScreens.Depo_Vehicle_Inspection

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

  const formValues = {
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


  const { values, errors, handleChange, onFocus, handleSubmit, enableSubmit, onBlur, isTouched } =
    useForm(inspectVehicle, VehicleInspectionValidation, formValues)

  const navigation = useNavigate()
  const REQ = () => <span className="text-danger"> * </span>

  const addVehicleInspection = (status) => {
    let data = new FormData()
    data.append('parking_id', currentVehicleInfo.depo_parking_yard_gate_id)
    data.append('truck_clean', values.truck_clean)
    data.append('bad_smell', values.bad_smell)
    data.append('insect_vevils_presence', values.insect_vevils_presence)
    data.append('tarpaulin_srf', values.tarpaulin_srf)
    data.append('tarpaulin_non_srf', values.tarpaulin_non_srf)
    data.append('insect_vevils_presence_in_tar', values.insect_vevils_presence_in_tar)
    data.append('truck_platform', values.truck_platform)
    data.append('previous_load_details', values.previous_load_details)
    data.append('vehicle_fit_for_loading', fitForLoad == 'YES' ? 1 : 0)
    data.append('remarks', remarks)
    data.append('status', status)
    data.append('created_by', user_id)

    console.log(values)

    if (
      values.truck_clean &&
      values.bad_smell &&
      values.insect_vevils_presence &&
      values.insect_vevils_presence_in_tar &&
      values.tarpaulin_srf &&
      values.tarpaulin_non_srf &&
      values.truck_platform &&
      values.previous_load_details
    ) {
      setFetch(true)

      DepoVInspectionService.handleVehicleInspectionAction(data).then((res) => {
        if (res.status == 200) {
          setFetch(true)
          toast.success('Vehicle Inspection completed')
          navigation('/DepoVehicleInspectionHome')
        } else if (res.status == 201) {
          toast.error('Vehicle Inspection Rejected')
          navigation('/DepoVehicleInspectionHome')
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

  const { id } = useParams()

  useEffect(() => {
      DepoVInspectionService.getSingleVehicleInfoOnParkingYardGate(id).then((res) => {
        console.log(res.data.data,'getSingleVehicleInfoOnParkingYardGate')
        isTouched.remarks = true
        setCurrentVehicleInfo(res.data.data)
        setFetch(true)
    })
  }, [id])

  useEffect(() => {
    var touchLength = Object.keys(isTouched).length

    if (touchLength == Object.keys(formValues).length) {
      if (Object.keys(errors).length == 0) {
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
                          <CFormLabel htmlFor="cname">Contractor Name</CFormLabel>
                          <CFormInput
                            name="cname"
                            size="sm"
                            id="cname"
                            value={currentVehicleInfo.contractor_info.contractor_name}
                            readOnly
                          />
                        </CCol>

                        <CCol md={3}>
                          <CFormLabel htmlFor="cmn">Contractor Mobile Number</CFormLabel>
                          <CFormInput
                            name="cmn"
                            size="sm"
                            id="cmn"
                            value={currentVehicleInfo.contractor_info.contractor_number}
                            readOnly
                          />
                        </CCol>

                        <CCol md={3}>
                          <CFormLabel htmlFor="vNum">Vehicle Number</CFormLabel>
                          <CFormInput
                            name="vNum"
                            size="sm"
                            id="vNum"
                            value={currentVehicleInfo.vehicle_info.vehicle_number}
                            readOnly
                          />
                        </CCol>

                        <CCol xs={12} md={3}>
                          <CFormLabel htmlFor="vcim">Vehicle Capacity In MTS</CFormLabel>
                          <CFormInput
                            name="vcim"
                            size="sm"
                            id="vcim"
                            value={currentVehicleInfo.vehicle_info.vehicle_capacity_info.capacity}
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
                            value={currentVehicleInfo.vehicle_info.vehicle_body_type_info.body_type}
                            readOnly
                          />
                        </CCol>
                        <CCol xs={12} md={3}>
                          <CFormLabel htmlFor="vivt">Vehicle Insurance Valid To </CFormLabel>
                          <CFormInput
                            name="vivt"
                            size="sm"
                            id="vivt"
                            value={currentVehicleInfo.vehicle_info.insurance_validity}
                            readOnly
                          />
                        </CCol>
                        <CCol xs={12} md={3}>
                          <CFormLabel htmlFor="vfvt">Vehicle FC Valid To </CFormLabel>
                          <CFormInput
                            name="vfvt"
                            size="sm"
                            id="vfvt"
                            value={currentVehicleInfo.vehicle_info.fc_validity}
                            readOnly
                          />
                        </CCol>
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
                      </CRow>
                      <CRow className="">
                        <CCol xs={12} md={3}>
                          <CFormLabel htmlFor="dname">Driver name </CFormLabel>
                          <CFormInput
                            name="dname"
                            size="sm"
                            id="dname"
                            value={currentVehicleInfo.driver_info.driver_name}
                            readOnly
                          />
                        </CCol>
                        <CCol xs={12} md={3}>
                          <CFormLabel htmlFor="dmn">Driver Mobile Number </CFormLabel>
                          <CFormInput
                            name="dmn"
                            size="sm"
                            id="dmn"
                            value={currentVehicleInfo.driver_info.driver_number}
                            readOnly
                          />
                        </CCol>
                        <CCol xs={12} md={3}>
                          <CFormLabel htmlFor="dln">Driver License Number </CFormLabel>
                          <CFormInput
                            name="dln"
                            size="sm"
                            id="dln"
                            value={currentVehicleInfo.driver_info.license_no}
                            readOnly
                          />
                        </CCol>
                        <CCol xs={12} md={3}>
                          <CFormLabel htmlFor="dlvt">Driver License Valid To </CFormLabel>
                          <CFormInput
                            name="dlvt"
                            size="sm"
                            id="dlvt"
                            value={currentVehicleInfo.driver_info.license_validity_to}
                            readOnly
                          />
                        </CCol>
                      </CRow>

                      <CRow className="">
                        <CCol xs={12} md={3}>
                          <CFormLabel htmlFor="truckClean">
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
                          <CFormLabel htmlFor="tarpaulin_srf">
                            Tarpaulin – SRF <REQ />{' '}
                          </CFormLabel>
                          <br />
                          <CButtonGroup role="group" aria-label="Basic checkbox toggle button group">
                            <CFormCheck
                              type="radio"
                              button={{ color: 'danger', variant: 'outline' }}
                              name="tarpaulin_srf"
                              id="btnradio7"
                              autoComplete="off"
                              label="0"
                              value="0"
                              onChange={handleChange}
                            />
                            <CFormCheck
                              type="radio"
                              button={{ color: 'danger', variant: 'outline' }}
                              name="tarpaulin_srf"
                              id="btnradio8"
                              autoComplete="off"
                              label="1"
                              value="1"
                              onChange={handleChange}
                            />
                            <CFormCheck
                              type="radio"
                              button={{ color: 'success', variant: 'outline' }}
                              name="tarpaulin_srf"
                              id="btnradio9"
                              autoComplete="off"
                              value="2"
                              label="2"
                              onChange={handleChange}
                            />
                          </CButtonGroup>
                        </CCol>
                      </CRow>
                      <CRow className="">
                        <CCol xs={12} md={3}>
                          <CFormLabel htmlFor="tarpaulin_non_srf">
                            Tarpaulin Non-SRF <REQ />{' '}
                          </CFormLabel>
                          <br />
                          <CButtonGroup role="group" aria-label="Basic checkbox toggle button group">
                            <CFormCheck
                              type="radio"
                              button={{ color: 'danger', variant: 'outline' }}
                              name="tarpaulin_non_srf"
                              id="btnradio10"
                              autoComplete="off"
                              label="0"
                              value="0"
                              onChange={handleChange}
                            />
                            <CFormCheck
                              type="radio"
                              button={{ color: 'danger', variant: 'outline' }}
                              name="tarpaulin_non_srf"
                              id="btnradio11"
                              autoComplete="off"
                              label="1"
                              onChange={handleChange}
                              value="1"
                            />
                            <CFormCheck
                              type="radio"
                              button={{ color: 'success', variant: 'outline' }}
                              name="tarpaulin_non_srf"
                              id="btnradio12"
                              autoComplete="off"
                              label="2"
                              value="2"
                              onChange={handleChange}
                            />
                          </CButtonGroup>
                        </CCol>
                        <CCol xs={12} md={3}>
                          <CFormLabel htmlFor="insect_vevils_presence_in_tar">
                            Insect or Vevils Presence (Tar.) <REQ />{' '}
                          </CFormLabel>
                          <br />
                          <CButtonGroup role="group" aria-label="Basic checkbox toggle button group">
                            <CFormCheck
                              type="radio"
                              button={{ color: 'danger', variant: 'outline' }}
                              name="insect_vevils_presence_in_tar"
                              id="btnradio13"
                              autoComplete="off"
                              label="Yes"
                              onChange={handleChange}
                              value="1"
                            />
                            <CFormCheck
                              type="radio"
                              button={{ color: 'success', variant: 'outline' }}
                              name="insect_vevils_presence_in_tar"
                              id="btnradio14"
                              autoComplete="off"
                              label="No"
                              value="0"
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
                              id="btnradio15"
                              autoComplete="off"
                              label="Good"
                              onChange={handleChange}
                              value="1"
                            />
                            <CFormCheck
                              type="radio"
                              button={{ color: 'danger', variant: 'outline' }}
                              name="truck_platform"
                              id="btnradio16"
                              onChange={handleChange}
                              autoComplete="off"
                              label="Bad"
                              value="0"
                            />
                          </CButtonGroup>
                        </CCol>
                        <CCol xs={12} md={3}>
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
                        </CCol>
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

                          <CButton
                            size="sm"
                            color="warning"
                            className="mx-1 px-2 text-white"
                            type="button"
                            onClick={() => {
                              setRejectConfirm(true)
                            }}
                          >
                            Reject
                          </CButton>
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

export default DepoVehicleInspection
