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
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Loader from 'src/components/Loader'
import AccessDeniedComponent from 'src/components/commoncomponent/AccessDeniedComponent'
import JavascriptInArrayComponent from 'src/components/commoncomponent/JavascriptInArrayComponent'
import * as LogisticsProScreenNumberConstants from 'src/components/constants/LogisticsProScreenNumberConstants'
import VehicleInspectionValidation from 'src/Utils/TransactionPages/VehicleInspection/VehicleInspectionValidation'
import DepoTSCreationService from 'src/Service/Depo/TSCreation/DepoTSCreationService'
import Swal from 'sweetalert2'

const DepoTripsheetCreation = () => {
  const user_info_json = localStorage.getItem('user_info')
  const user_info = JSON.parse(user_info_json)

  /* Get User Id From Local Storage */
  const user_id = user_info.user_id

  /* ==================== Access Part Start ========================*/
  const [screenAccess, setScreenAccess] = useState(false)
  let page_no = LogisticsProScreenNumberConstants.DepoModuleScreens.Depo_Tripsheet_Creation

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
    expected_delivery_date: '',
    remarks: '',
  }


  const { values, errors, handleChange, onFocus, handleSubmit, enableSubmit, onBlur, isTouched } =
    useForm(inspectVehicle, VehicleInspectionValidation, formValues)

  const navigation = useNavigate()
  const REQ = () => <span className="text-danger"> * </span>

  const TripsheetCreationCancel = () => {
    console.log(remarks)
    if (remarks && remarks.trim()) {
      setRejectConfirm(true)
    } else {
      toast.warning('You should give the proper reason for rejection via remarks... ')
      values.remarks = ''
      setRemarks('')
      return false
    }
  }

  const createTripsheet = (status) => {
    let data = new FormData()
    data.append('parking_id', currentVehicleInfo.depo_parking_yard_gate_id)
    data.append('vehicle_id', currentVehicleInfo.vehicle_info.id)
    data.append('driver_id', currentVehicleInfo.driver_info.id)
    data.append('vehicle_location_id', currentVehicleInfo.vehicle_location_info.location_alpha_code)
    data.append('remarks', remarks)
    data.append('expected_delivery_date', values.expected_delivery_date)
    data.append('status', status)
    data.append('created_by', user_id)

    if (values.expected_delivery_date || status == 2) {
      // setFetch(true)

      DepoTSCreationService.handleTripsheetCreationAction(data).then((res) => {
        console.log(res)
        let sap_tsno = res.data.depo_tripsheet_no        
        console.log(res.data.depo_tripsheet_no)
        if (res.status == 200) {
          setFetch(true)
          Swal.fire({
            title: 'Depo TripSheet Created Successfully!',
            icon: "success",
            text:  'TripSheet No. : ' + sap_tsno,
            confirmButtonText: "OK",
          }).then(function () {
            navigation('/DepoTripsheetCreationHome')
          });
          // toast.success('Tripsheet Creation completed')
          // navigation('/DepoTripsheetCreationHome')
        } else if (res.status == 201) {
          setFetch(true)
          if(res.data.sap_status == 1)
          {
            toast.error('Tripsheet Creation Rejected')
            navigation('/DepoTripsheetCreationHome')
          } else if(res.data.sap_status == 2)
          {
            toast.error(res.data.message) 
          }
        }
      })
      .catch((error) => {
        setFetch(true)

        var object = error.response.data.errors
        var output = 'Tripsheet Creation Failed. Kindly Contact Admin..!'
        for (var property in object) {
          output += '*' + object[property] + '\n'
        }
        setError(output)
        setErrorModal(true)
      })
    } else {
      setFetch(true)
      toast.warning('Please Select The Expected Delivery date')
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
    DepoTSCreationService.getSingleVehicleInfoOnGate(id).then((res) => {
      // DepoVInspectionService.getSingleVehicleInfoOnParkingYardGate(id).then((res) => {
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

                      <CRow className="mt-2">
                        <CCol xs={12} md={3}>
                          <CFormLabel htmlFor="inspectionDateTime">Inspection Date & Time</CFormLabel>
                          <CFormInput
                            name="inspectionDateTime"
                            size="sm"
                            id="inspectionDateTime"
                            value={currentVehicleInfo.vehicle_inspection_info.inspection_time_string}
                            readOnly
                          />
                        </CCol>
                        <CCol xs={12} md={3}>
                          <CFormLabel htmlFor="div_pur">Division & Purpose</CFormLabel>
                          <CFormInput
                            name="div_pur"
                            size="sm"
                            id="div_pur"
                            value={'NLFD : FG-SALES'}
                            readOnly
                          />
                        </CCol>
                        <CCol xs={12} md={3}>
                          <CFormLabel htmlFor="expected_delivery_date">
                            Expected Delivery Date <REQ />{' '}
                            {errors.expected_date_time && (
                              <span className="small text-danger">{errors.expected_date_time}</span>
                            )}
                          </CFormLabel>
                          <CFormInput
                            size="sm"
                            type="date"
                            name="expected_delivery_date"
                            id="expected_delivery_date"
                            onFocus={onFocus}
                            onBlur={onBlur}
                            onChange={handleChange}
                            value={values.expected_delivery_date}
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
                          <Link to={'/DepoTripsheetCreationHome'}>
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
                              createTripsheet(1)
                            }}
                          >
                            Create
                          </CButton>

                          <CButton
                            size="sm"
                            color="warning"
                            className="mx-1 px-2 text-white"
                            type="button"
                            onClick={() => {
                              TripsheetCreationCancel()
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
          <p className="lead">Are you sure to reject this Tripsheet Creation ?</p>
        </CModalBody>
        <CModalFooter>
          <CButton
            className="m-2"
            color="warning"
            onClick={() => {
              setRejectConfirm(false)
              setFetch(false)
              createTripsheet(2)
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

export default DepoTripsheetCreation
