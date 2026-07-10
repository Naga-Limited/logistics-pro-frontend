import {
  CButton,
  CCard,
  CCol, 
  CForm,
  CFormInput,
  CFormLabel,
  CFormSelect, 
  CRow,
  CTabContent, 
  CTabPane, 
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
import VehicleInspectionValidation from 'src/Utils/TransactionPages/VehicleInspection/VehicleInspectionValidation'
import NlmtVInspectionService from 'src/Service/Nlmt/VInspection/NlmtVInspectionService'
import NlmtVehicleMasterService from 'src/Service/Nlmt/Masters/NlmtVehicleMasterService'
import AccessDeniedComponent from 'src/components/commoncomponent/AccessDeniedComponent'
import JavascriptInArrayComponent from 'src/components/commoncomponent/JavascriptInArrayComponent'  
import * as NlmtScreenAccessCodes from 'src/components/constants/NlmtScreenAccessCodes'

const NlmtVehicleInspection = () => {
  const user_info_json = localStorage.getItem('user_info')
  const user_info = JSON.parse(user_info_json)

  /* Get User Id From Local Storage */
  const user_id = user_info.user_id

  /* ==================== Access Part Start ========================*/
  const [screenAccess, setScreenAccess] = useState(false)
  let page_no = NlmtScreenAccessCodes.NlmtTransactionScreens.Nlmt_Vehicle_Inspection

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
    vehicleId: '',
    vehicleCapacity: '',
    vehicleBodyType: '',
    vehicleInsuranceValidity: '',
    vehicleFcValidity: '',
  }


  const { values, setValues, errors, handleChange, onFocus, handleSubmit, enableSubmit, onBlur, isTouched, initialValues } =
    useForm(inspectVehicle, VehicleInspectionValidation, formValues)

  const navigation = useNavigate()
  const REQ = () => <span className="text-danger"> * </span>

  const addVehicleInspection = (status) => {
    let data = new FormData()
    data.append('parking_id', currentVehicleInfo.nlmt_trip_in_id)
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

      NlmtVInspectionService.handleVehicleInspectionAction(data).then((res) => {
        if (res.status == 200) {
          setFetch(true)
          toast.success('Vehicle Inspection completed')
          navigation('/NlmtVehicleInspectionHome')
        } else if (res.status == 201) {
          toast.error('Vehicle Inspection Rejected')
          navigation('/NlmtVehicleInspectionHome')
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

  function inspectVehicle() { }

  const [rejectConfirm, setRejectConfirm] = useState(false)
  const [errorModal, setErrorModal] = useState(false)
  const [error, setError] = useState({})
  const [currentVehicleInfo, setCurrentVehicleInfo] = useState({})
  const [fitForLoad, setFitForLoad] = useState('')
  const [fetch, setFetch] = useState(false)
const [isChecked, setIsChecked] = useState(false);
  const { id } = useParams()

  useEffect(() => {
    NlmtVInspectionService.getSingleVehicleInfoOnTripIn(id).then((res) => {
      const data = res.data.data
      console.log(data)
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
          vehicleNumber: v.vehicle_number || '',
          vehicleCapacity: v.vehicle_capacity_info?.definition_list_name
            ? `${v.vehicle_capacity_info.definition_list_name} Mts & Own`
            : '',
          vehicleBodyType: v.vehicle_body_type_info?.definition_list_name || '',
          // vehicleVariety: v.vehicle_variety_info?.definition_list_name || '',
          //vehicleGroup: v.vehicle_group_info?.definition_list_name || '',
          vehicleInsuranceValidity: v.insurance_validity || '',
          vehicleFcValidity: v.fc_validity || '',
        }))
      } catch (error) {
        console.error('Vehicle fetch failed', error)
      }
    }

    fetchVehicle()
  }, [values.vehicleId])

  const handleChecked = (e) => {
  const checked = e.target.checked;
  setIsChecked(checked);

  if (checked) {
    setValues((prev) => ({
      ...prev,
      truck_clean: '1',
      bad_smell: '0',
      insect_vevils_presence: '0',
      tarpaulin_srf: '2',
      tarpaulin_non_srf: '2',
      insect_vevils_presence_in_tar: '0',
      truck_platform: '1',
      previous_load_details: '1',
    }));
  }
};

 useEffect(() => {
  const requiredFields = [
    values.truck_clean,
    values.bad_smell,
    values.insect_vevils_presence,
    values.tarpaulin_srf,
    values.tarpaulin_non_srf,
    values.insect_vevils_presence_in_tar,
    values.truck_platform,
    values.previous_load_details,
  ]

  const allFilled = requiredFields.every(
    (v) => v !== '' && v !== null && v !== undefined
  )

  if (allFilled && Object.keys(errors).length === 0) {
    setFitForLoad('YES')
  } else {
    setFitForLoad('NO')
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
                        <CFormLabel htmlFor="vcim">Vehicle Capacity & Type</CFormLabel>
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
                            checked={values.truck_clean === '1'}
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
                              checked={values.truck_clean === '0'}
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
                            checked={values.bad_smell === '1'}
                            label="Yes"
                          />
                          <CFormCheck
                            type="radio"
                            button={{ color: 'success', variant: 'outline' }}
                            name="bad_smell"
                            id="btnradio4"
                            autoComplete="off"
                            value="0"
                            checked={values.bad_smell === '0'}
                            onChange={handleChange}
                            label="No"
                          />
                        </CButtonGroup>
                      </CCol>
                    </CRow>
                    <CRow className="">
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
                            checked={values.insect_vevils_presence === '1'}
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
                            checked={values.insect_vevils_presence === '0'}
                          
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
                            checked={values.tarpaulin_srf === '0'}
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
                            checked={values.tarpaulin_srf === '1'}
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
                            checked={values.tarpaulin_srf === '2'}
                            onChange={handleChange}
                          />
                        </CButtonGroup>
                      </CCol>


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
                            checked={values.tarpaulin_non_srf === '0'}
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
                            checked={values.tarpaulin_non_srf === '1'}
                          />
                          <CFormCheck
                            type="radio"
                            button={{ color: 'success', variant: 'outline' }}
                            name="tarpaulin_non_srf"
                            id="btnradio12"
                            autoComplete="off"
                            label="2"
                            value="2"
                            checked={values.tarpaulin_non_srf === '2'}
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
                            checked={values.insect_vevils_presence_in_tar === '1'}
                          />
                          <CFormCheck
                            type="radio"
                            button={{ color: 'success', variant: 'outline' }}
                            name="insect_vevils_presence_in_tar"
                            id="btnradio14"
                            autoComplete="off"
                            label="No"
                            value="0"
                            checked={values.insect_vevils_presence_in_tar === '0'}
                            onChange={handleChange}
                          />
                        </CButtonGroup>
                      </CCol>
                    </CRow>
                    <CRow className="">
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
                            checked={values.truck_platform === '1'}
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
                            checked={values.truck_platform === '0'}
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
                            <CCol xs={12} md={3}>
                      <CFormCheck
    label="Auto Fill & Approve"
    checked={isChecked}
    onChange={handleChecked}
  />
                      </CCol>
                    </CRow>
                    <CRow className="mt-2">
                      <CCol>
                        <Link to={'/NlmtVehicleInspectionHome'}>
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
                            disabled={fitForLoad !== 'YES'}
                          onClick={() => {
                            setFetch(false)
                            addVehicleInspection(1)
                          }}
                        >
                          Accept
                        </CButton>


                      </CCol>

                    </CRow>
                  </CForm>
                </CTabPane>
              </CTabContent>
            </CCard>
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

export default NlmtVehicleInspection
