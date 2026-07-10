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
import * as NlmtScreenAccessCodes from 'src/components/constants/NlmtScreenAccessCodes'
import VehicleInspectionValidation from 'src/Utils/TransactionPages/VehicleInspection/VehicleInspectionValidation'
import Swal from 'sweetalert2'
import NlmtTSCreationService from 'src/Service/Nlmt/TSCreation/NlmtTSCreationService'
import NlmtVehicleMasterService from 'src/Service/Nlmt/Masters/NlmtVehicleMasterService'

const NlmtTripsheetCreationOwn = () => {
  const user_info_json = localStorage.getItem('user_info')
  const user_info = JSON.parse(user_info_json)

  /* Get User Id From Local Storage */
  const user_id = user_info.user_id

  /* ==================== Access Part Start ========================*/
  const [screenAccess, setScreenAccess] = useState(false)
  let page_no = NlmtScreenAccessCodes.NlmtTransactionScreens.Nlmt_Own_Vehicle_TS_Creation

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
    expected_return_date_time: '',
    remarks: '',
    vehicleId: '',
    vehicleNumber: '',
    vehicleCapacity: '',
    vehicleBodyType: '',
    vehicleInsuranceValidity: '',
    vehicleFcValidity: '',
    advanceRequest: '1',
    advanceAmount: '0',
  }


  const { values, setValues, errors, handleChange, onFocus, handleSubmit, enableSubmit, onBlur, isTouched } =
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
  const [advanceReqList, setadvanceReqList] = useState([
    { id: 1, name: 'Yes' },
    { id: 0, name: 'No' },
  ])

  const createTripsheet = (status) => { /* Status = 1 for Create, 2 for Reject */


    if(status == 1)
    {
      if (!values.advanceAmount) { 
        toast.error('Advance Amount Required')
        return false
      } else if (!/^\d{3,5}$/.test(values.advanceAmount) && values.advanceAmount > 0) { 
        toast.error('Advance Amount should be 3-5 Digit Numeric')
        return false
      }

      console.log(values.advanceAmount,'values.advanceAmount')

      if(values.expected_delivery_date == '' || values.expected_delivery_date == null){
        toast.error('Expected Delivery Date Required')
        return false
      }

      if(values.expected_return_date_time == '' || values.expected_return_date_time == null){
        toast.error('Expected Return Date Required')
        return false
      } 

    }
     

    console.log(values,'createTripsheet-values')
    setFetch(false)
    // return false

    let data = new FormData()
    data.append('parking_id', currentVehicleInfo.nlmt_trip_in_id)
    data.append('vehicle_id', currentVehicleInfo.vehicle_info.vehicle_id)
    data.append('vehicle_type_id', currentVehicleInfo.vehicle_info.vehicle_type_id)
    data.append('driver_id', currentVehicleInfo.driver_info.driver_id)
    data.append('advance_request', values.advanceRequest)
    data.append('advance_amount', values.advanceAmount)
    data.append('remarks', remarks)
    data.append('expected_delivery_date', values.expected_delivery_date)
    data.append('expected_return_date_time', values.expected_return_date_time)
    data.append('status', status)
    data.append('created_by', user_id)

    NlmtTSCreationService.handleTripsheetCreationAction(data).then((res) => {
      console.log(res)
      
      if (res.status == 200) {
        let sap_tsno = res.data.nlmt_tripsheet_no
        console.log(res.data.nlmt_tripsheet_no)
        setFetch(true)
        Swal.fire({
          title: 'NLMT-TripSheet Created Successfully!',
          icon: "success",
          text: 'TripSheet No. : ' + sap_tsno,
          confirmButtonText: "OK",
        }).then(function () {
          navigation('/NlmtTripsheetCreationOwnHome')
        });
      }
      // if (result.isConfirmed) {
      //   window.location.reload()
      // }
      else if (status == 2 && res.status == 201) {
        setFetch(true)
        toast.error('Tripsheet Creation Rejected')
        navigation('/NlmtTripsheetCreationOwnHome') 
      } else if (status == 1 && res.status == 201) {
         setFetch(true)
        if (res.data.sap_status == 1) {
          //
        } else if (res.data.sap_status == 2) {
          toast.error(res.data.message+'. Kindly contact admin..!')
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
     
  }

  function inspectVehicle() { }

  const [rejectConfirm, setRejectConfirm] = useState(false)
  const [errorModal, setErrorModal] = useState(false)
  const [error, setError] = useState({})
  const [currentVehicleInfo, setCurrentVehicleInfo] = useState({})
  const [fitForLoad, setFitForLoad] = useState('')
  const [fetch, setFetch] = useState(false)

  const { id } = useParams()

  useEffect(() => {
    NlmtTSCreationService.getSingleVehicleInfoOnTripIn(id).then((res) => {
      const data = res.data.data
      // console.log(data)
      setCurrentVehicleInfo(data)

      setValues((prev) => ({
        ...prev,
        vehicleId: data.vehicle_info.vehicle_id,
      }))

      setFetch(true)
    })
  }, [id])
  useEffect(() => {
    if (!values?.vehicleId) return;

    const fetchVehicle = async () => {
      try {
        const res = await NlmtVehicleMasterService.getNlmtVehiclesById(values.vehicleId)
        const v = res?.data?.data

        if (!v) return

        setValues((prev) => ({
          ...prev,
          vehicleCapacity: v.vehicle_capacity_info?.definition_list_name
            ? `${v.vehicle_capacity_info.definition_list_name} Mts & Own`
            : '',
          vehicleBodyType: v.vehicle_body_type_info?.definition_list_name || '',
          vehicleInsuranceValidity: v.insurance_validity || '',
          vehicleFcValidity: v.fc_validity || '',
        }))
      } catch (error) {
        console.error('Vehicle fetch failed', error)
      }
    }

    fetchVehicle()
  }, [values.vehicleId])


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


                        <CCol xs={12} md={3}>
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
                          <CFormLabel htmlFor="vcim">Vehicle Capacity & Type </CFormLabel>
                          <CFormInput
                            name="vcim"
                            size="sm"
                            id="vcim"
                            value={values.vehicleCapacity || ''}
                            readOnly
                          />
                        </CCol>



                        <CCol xs={12} md={3}>
                          <CFormLabel htmlFor="vbt">Vehicle Body Type</CFormLabel>
                          <CFormInput
                            name="vbt"
                            size="sm"
                            id="vbt"
                            value={values.vehicleBodyType || ''}
                            readOnly
                          />
                        </CCol>
                        <CCol xs={12} md={3}>
                          <CFormLabel htmlFor="vivt">Vehicle Insurance Valid To </CFormLabel>
                          <CFormInput
                            name="vivt"
                            size="sm"
                            id="vivt"
                            value={values.vehicleInsuranceValidity || ''}
                            readOnly
                          />
                        </CCol>
                      </CRow>
                      <CRow className="">
                        <CCol xs={12} md={3}>
                          <CFormLabel htmlFor="vfvt">Vehicle FC Valid To </CFormLabel>
                          <CFormInput
                            name="vfvt"
                            size="sm"
                            id="vfvt"
                            value={values.vehicleFcValidity || ''}
                            readOnly
                          />
                        </CCol>
                        <CCol xs={12} md={3}>
                          <CFormLabel htmlFor="gateInDateTime">Trip-In Date & Time</CFormLabel>
                          <CFormInput
                            name="gateInDateTime"
                            size="sm"
                            id="gateInDateTime"
                            value={currentVehicleInfo.gate_in_date_time_string}
                            readOnly
                          />
                        </CCol>


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
                            value={currentVehicleInfo.driver_info.driver_phone_1}
                            readOnly
                          />
                        </CCol>
                      </CRow>
                      <CRow className="">
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
                          <CFormLabel>Trip Advance </CFormLabel>
                          <CFormSelect name="advanceRequest" value={values.advanceRequest} disabled>
                            <option value="">Select</option>
                            {advanceReqList.map(({ id, name }) => (
                              <option key={id} value={String(id)}>
                                {name}
                              </option>
                            ))}
                          </CFormSelect>
                        </CCol>
                         
                        <CCol md={3}>
                          <CFormLabel>
                            Advance Amount 
                            {/* <REQ /> */}
                          </CFormLabel>
                          <CFormInput
                            //id="advanceAmount"
                            onFocus={onFocus}
                            onBlur={onBlur}
                            size="sm"
                            type='text'
                            maxLength="5"
                            name='advanceAmount'
                            value={values.advanceAmount}
                            onChange={handleChange}
                            onKeyDown={(e) => {
                              if (e.key === 'e' || e.key === 'E' || e.key === '+' || e.key === '-') {
                                e.preventDefault();
                              }
                            }}
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
                          <CFormLabel htmlFor="expected_return_date_time">
                            Expected Return Date <REQ />{' '}
                            {errors.expected_return_date_time && (
                              <span className="small text-danger">{errors.expected_return_date_time}</span>
                            )}
                          </CFormLabel>
                          <CFormInput
                            size="sm"
                            type="date"
                            name="expected_return_date_time"
                            id="expected_return_date_time"
                            onFocus={onFocus}
                            onBlur={onBlur}
                            onChange={handleChange}
                            value={values.expected_return_date_time}
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
                      <CRow className="">
                        <CCol md={9}>
                          <Link to={'/NlmtTripsheetCreationOwnHome'}>
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
                            color="success"
                            className="mx-1 px-2 text-white"
                            type="button"
                            onClick={() => { 
                              createTripsheet(1)
                            }}
                          >
                            Create
                          </CButton>

                          <CButton
                            size="sm"
                            color="danger"
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
            </>
          ) : (
            <AccessDeniedComponent />
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

export default NlmtTripsheetCreationOwn
