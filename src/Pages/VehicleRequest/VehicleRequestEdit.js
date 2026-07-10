/* eslint-disable prettier/prettier */
import {
  CAlert,
  CButton,
  CCard,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CFormTextarea,
  CInputGroup,
  CInputGroupText,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
  CTabContent,
  CTabPane,
} from '@coreui/react'
import { React, useEffect, useState } from 'react'
import useForm from 'src/Hooks/useForm.js'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Loader from 'src/components/Loader'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import AccessDeniedComponent from 'src/components/commoncomponent/AccessDeniedComponent'
import JavascriptInArrayComponent from 'src/components/commoncomponent/JavascriptInArrayComponent'
import * as LogisticsProScreenNumberConstants from 'src/components/constants/LogisticsProScreenNumberConstants'
import DefinitionsListApi from 'src/Service/Definitions/DefinitionsListApi'
import RakeVendorMasterService from 'src/Service/RakeMovement/RakeMaster/RakeVendorMasterService'
import DivisionApi from 'src/Service/SubMaster/DivisionApi'
import DepartmentApi from 'src/Service/SubMaster/DepartmentApi'
import VehicleCapacityService from 'src/Service/SmallMaster/Vehicles/VehicleCapacityService'
import VehicleBodyTypeService from 'src/Service/SmallMaster/Vehicles/VehicleBodyTypeService'
import VehicleVarietyService from 'src/Service/SmallMaster/Vehicles/VehicleVarietyService'
import VehicleRequestValidation from 'src/Utils/VehicleRequest/VehicleRequestValidation'
import VehicleRequestMasterService from 'src/Service/VehicleRequest/VehicleRequestMasterService'
import Swal from 'sweetalert2'

const VehicleRequestEdit = () => {
  const formValues = {
    vr_product: '',
    vr_purpose: '',
    vr_from_location: '',
    vr_to_location: '',
    vr_req_contact_no: '',
    vr_requester: '',
    vr_datetime: '',
    vr_capacity_id: '',
    vr_variety_id: '',
    vr_body_type_id: '',
    vr_division: '',
    vr_department: '',
  }

  const { id } = useParams()

  /*================== User Id & Location Fetch ======================*/
  const user_info_json = localStorage.getItem('user_info')
  const user_info = JSON.parse(user_info_json)
  const user_locations = []
  const navigation = useNavigate()

  console.log(user_info)

  /* Get User Locations From Local Storage */
  user_info.location_info.map((data, index) => {
    user_locations.push(data.id)
  })

  /* Get User Id From Local Storage */
  const user_id = user_info.user_id
  const user_emp_id = user_info.empid

  // console.log(user_locations)
  /*================== User Location Fetch ======================*/

  /* ==================== Access Part Start ========================*/
  const [screenAccess, setScreenAccess] = useState(false)
  let page_no = LogisticsProScreenNumberConstants.OtherModuleScreen.Vehicle_request
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

  const REQ = () => <span className="text-danger"> * </span>
  const [fetch, setFetch] = useState(false)
  const [tdsTaxData, setTdsTaxData] = useState(false)
  const [submitBtn, setSubmitBtn] = useState(true)
  const [locationError, setLocationError] = useState(true)
  const [errorModal, setErrorModal] = useState(false)
  const [error, setError] = useState({})

  const { values, errors, handleChange, onFocus, handleSubmit, onBlur, isTouched } = useForm(
    updateVR,
    VehicleRequestValidation,
    formValues
  )

  const [vendor, setVendor] = useState(false) // Vendor Available
  const [is_vr_admin, set_is_vr_admin] = useState(false)
  const [vehicleRequestAdminUsersData, setVehicleRequestAdminUsersData] = useState([])
  const [vrPurposedata, setVrPurposedata] = useState([])
  const [vrProductdata, setVrProductdata] = useState([])
  const [vehicleRequestAdminUsersArray, setVehicleRequestAdminUsersArray] = useState([])
  const [vehicleCapacity, setVehicleCapacity] = useState([])
  const [vehicleVariety, setVehicleVariety] = useState([])
  const [vehicleBody, setVehicleBody] = useState([])

  const [panData, setPanData] = useState({})
  const [tDS, setTDS] = useState('0')
  const [errorsTdsType, setErrorsTdsType] = useState('')
  const [panNumbernew, setpanNumber] = useState('')
  const [vendorAddress, setVendorAddress] = useState('')
  const [vendorRemarks, setVendorRemarks] = useState('')
  const handleChangenewpan = event => {
    let panResult = event.target.value.toUpperCase()
    setpanNumber(panResult)
    setPanData({})
  };

  const remarksHandleChange = (event,type) => {

    let result = event.target.value.toUpperCase()
    if(type == 1){
      setVendorAddress(result.trimStart())
    } else {
      setVendorRemarks(result.trimStart())
    }

  }

  const [currentDivision,setCurrentDivision] = useState(0)
  const [currentDepartment,setCurrentDepartment] = useState(0)

  useEffect(() => {
    //section to fetch single VR info
    VehicleRequestMasterService.getVehicleRequestsById(id).then((res) => {

      let vr_info = res.data.data
      console.log(vr_info,'getVehicleRequestsById')

      values.vr_product = vr_info.vr_prod
      values.vr_purpose = vr_info.vr_purpose
      values.vr_from_location = vr_info.vr_from_loc
      values.vr_to_location = vr_info.vr_to_loc
      values.vr_req_contact_no = vr_info.contact_no
      values.vr_requester = vr_info.request_by
      values.vr_datetime = vr_info.vr_require_time
      values.vr_capacity_id = vr_info.vr_capacity_id
      values.vr_variety_id = vr_info.vr_variety_id
      values.vr_body_type_id = vr_info.vr_body_id
      setVendorRemarks(vr_info.veh_remarks)
      values.vr_division = vr_info.vr_division
      values.vr_department = vr_info.vr_dept
      setCurrentDepartment(vr_info.vr_dept)
      setCurrentDivision(vr_info.vr_division)

      setFetch(true)
    })

  }, [id])

  useEffect(() => {
    // setFetch(true)
    let vpr = !errors.vr_product && values.vr_product != 0
    let vpu = !errors.vr_purpose && values.vr_purpose != 0
    let vfl = !errors.vr_from_location && values.vr_from_location
    let vtl = !errors.vr_to_location && values.vr_to_location
    let vrc = !errors.vr_req_contact_no && values.vr_req_contact_no
    let vrn = !errors.vr_requester && values.vr_requester
    let vdt = !errors.vr_datetime && values.vr_datetime
    let vc = !errors.vr_capacity_id && values.vr_capacity_id != 0
    let vv = !errors.vr_variety_id && values.vr_variety_id != 0
    let vb = !errors.vr_body_type_id && values.vr_body_type_id != 0
    let vdiv = values.vr_division != ''
    let vdep = values.vr_department != ''

    let vd = is_vr_admin ? (vdiv && vdep ? 1 : 0): 1

    let condition_check = vpr && vpu && vfl && vtl && vrc && vrn && vdt && vc && vv && vb && vd != 0

    if(user_info.is_admin == 1){
      console.log(vpr,'vpr')
      console.log(vpu,'vpu')
      console.log(vfl,'vfl')
      console.log(vtl,'vtl')
      console.log(vrc,'vrc')
      console.log(vrn,'vrn')
      console.log(vdt,'vdt')
      console.log(vc,'vc')
      console.log(vv,'vv')
      console.log(vb,'vb')
      console.log(vdiv,'vb')
      console.log(vdep,'vb')
      console.log(condition_check,'vb')
    }

    if (condition_check) {
      setSubmitBtn(false)
    } else {
      setSubmitBtn(true)
    }
  }, [values, errors, currentDepartment, currentDivision])

  const onChangeFilter = (event, event_type) => {
    var selected_value = event.value
    console.log(selected_value, 'selected_value')
    if (event_type == 'division') {
      if (selected_value) {
        values.vr_division = selected_value
        setCurrentDivision(selected_value)
      } else {
        values.vr_division = ''
        setCurrentDivision(0)
      }
    }
    if (event_type == 'department') {
      if (selected_value) {
        values.vr_department = selected_value
        setCurrentDepartment(selected_value)
      } else {
        values.vr_department = ''
        setCurrentDepartment(0)
      }
    }
  }

  useEffect(() => {
    if(vehicleRequestAdminUsersData.length > 0){
      let user_array = []
      let vr_admin = 0
      vehicleRequestAdminUsersData.map((vv,kk)=>{
        if(vv.definition_list_status == '1'){
          user_array.push(vv.definition_list_code)
        }
      })

      if(user_info.is_admin == 1 || JavascriptInArrayComponent(user_emp_id, user_array)){
        vr_admin = 1
      } else {
        vr_admin = 0
        setCurrentDepartment(user_info.department_info.id)
        setCurrentDivision(user_info.division_info.id)
      }

      console.log(user_array,'user_array')
      console.log(vr_admin,'vr_admin')

      vr_admin == 1 ? set_is_vr_admin(true) : set_is_vr_admin(false)
      setVehicleRequestAdminUsersArray(user_array)
    }

  }, [vehicleRequestAdminUsersData])

  useEffect(() => {

    /* section for getting TDS Tax Type Lists from database */
    DefinitionsListApi.visibleDefinitionsListByDefinition(3).then((response) => {

      let viewData = response.data.data
      console.log(viewData,'viewData')
      setTdsTaxData(viewData)
    })

    /* section for getting Vehicle Requests Admin User Lists from database */
    DefinitionsListApi.visibleDefinitionsListByDefinition(28).then((response) => {

      let viewData = response.data.data
      console.log(viewData,'Vehicle Requests Admin User Lists')
      setVehicleRequestAdminUsersData(viewData)
    })

    /* section for getting VR Purpose Lists from database */
    DefinitionsListApi.visibleDefinitionsListByDefinition(29).then((response) => {

      let viewData = response.data.data
      console.log(viewData,'VR Purpose Lists')
      setVrPurposedata(viewData)
    })

    /* section for getting VR Product Lists from database */
    DefinitionsListApi.visibleDefinitionsListByDefinition(30).then((response) => {

      let viewData = response.data.data
      console.log(viewData,'VR Product Lists')
      let filter_Data =  viewData.filter(
        (data) => data.definition_list_status == 1
      )
      console.log(filter_Data,'VR Product Lists - filter_Data')
      setVrProductdata(filter_Data)
    })

    //section for getting vehicle capacity from database
    VehicleCapacityService.getVehicleCapacity().then((res) => {
      setVehicleCapacity(res.data.data)
    })

    VehicleBodyTypeService.getVehicleBody().then((res) => {
      setVehicleBody(res.data.data)
    })

    //section for getting vehicle variety from database
    VehicleVarietyService.getVehicleVariety().then((res) => {
      setVehicleVariety(res.data.data)
    })

 }, [])

  const [divisionData, setDivisionData] = useState([])
  const [departmentData, setDepartmentData] = useState([])
  // const [currentDivision, setCurrentDivision] = useState([])

  useEffect(() => {

    /* section for getting Division Data from database */
    DivisionApi.getDivision().then((rest) => {

      let tableData = rest.data.data
      console.log(tableData)
      setDivisionData(tableData)
    })

    /* section for getting Department Data from database */
    DepartmentApi.getDepartment().then((rest) => {
      // setFetch(true)
      let tableData = rest.data.data
      console.log(tableData)
      setDepartmentData(tableData)
    })

  }, [])

  function updateVR() {

    if(user_info.is_admin == 1){

      console.log('values.vr_division', values.vr_division)
      console.log('values.vr_department', values.vr_department)
      console.log('vr_product', values.vr_product)
      console.log('vr_purpose', values.vr_purpose)
      console.log('vr_from_location', values.vr_from_location)
      console.log('vr_to_location', values.vr_to_location)
      console.log('vr_req_contact_no', values.vr_req_contact_no)
      console.log('vr_requester', values.vr_requester)
      console.log('vr_datetime', values.vr_datetime)
      console.log('vr_capacity_id', values.vr_capacity_id)
      console.log('vr_variety_id', values.vr_variety_id)
      console.log('vr_body_type_id', values.vr_body_type_id)
      console.log('v_remarks', vendorRemarks)
      console.log('updated_by', user_id)
    }

    setFetch(false)

    const formData = new FormData()
    formData.append('_method', 'PUT')
    formData.append('vr_division', values.vr_division)
    formData.append('vr_dept', values.vr_department)
    formData.append('vr_purpose', values.vr_purpose)
    formData.append('vr_prod', values.vr_product)
    formData.append('vr_from_loc', values.vr_from_location)
    formData.append('vr_to_loc', values.vr_to_location)
    formData.append('request_by', values.vr_requester)
    formData.append('contact_no', values.vr_req_contact_no)
    formData.append('vr_capacity_id', values.vr_capacity_id)
    formData.append('vr_variety_id', values.vr_variety_id)
    formData.append('vr_body_id', values.vr_body_type_id)
    formData.append('vr_require_time', values.vr_datetime)
    formData.append('vr_status', 1)
    formData.append('veh_remarks', vendorRemarks)
    formData.append('updated_by', user_id)

    VehicleRequestMasterService.updateVehicleRequests(id,formData).then((res) => {

      let lp_vr_no = res.data.vehicle_request_no
      if (res.status == 200) {
        Swal.fire({
          title: 'Vehicle Request Updated Successfully!',
          icon: "success",
          text:  'Vehicle Request No : ' + lp_vr_no,
          confirmButtonText: "OK",
        }).then(function () {
          navigation('/VehicleRequestTable')
        });
      } else if (res.status == 201) {
        Swal.fire({
          title: res.data.message,
          icon: "warning",
          confirmButtonText: "OK",
        }).then(function () {
          // window.location.reload(false)
        })
      } else {
        toast.warning('Vehicle Request Updation Failed. Kindly contact Admin..!')
      }

    })
    .catch((error) => {
      console.log(error,'error')
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
                    <CForm className="row g-3 m-2 p-1" onSubmit={handleSubmit}>
                      <CRow className="mb-md-1">
                        {is_vr_admin == 1 ? (
                          <>
                            <CCol md={3}>
                              <CFormLabel htmlFor="division">
                                Division <REQ />{' '}
                                {values.vr_division == '' && (
                                  <span className="small text-danger">{'Required'}</span>
                                )}
                              </CFormLabel>
                              <CFormSelect
                                size="sm"
                                name="vr_division"
                                onChange={handleChange}
                                onFocus={onFocus}
                                value={values.vr_division}
                                className={`mb-1 ${errors.vr_division && 'is-invalid'}`}
                                aria-label="Small select example"
                                id="vr_division"
                              >
                                <option value="">Select ...</option>
                                {divisionData && divisionData.map(({ division, id }) => {
                                  if (id) {
                                    return (
                                      <>
                                        <option key={id} value={id}>
                                          {division}
                                        </option>
                                      </>
                                    )
                                  }
                                })}
                              </CFormSelect>
                            </CCol>
                            <CCol md={3}>
                              <CFormLabel htmlFor="department">
                                Department <REQ />{' '}
                                {values.vr_department == '' && (
                                  <span className="small text-danger">{'Required'}</span>
                                )}
                              </CFormLabel>
                              <CFormSelect
                                size="sm"
                                name="vr_department"
                                onChange={handleChange}
                                onFocus={onFocus}
                                value={values.vr_department}
                                className={`mb-1 ${errors.vr_department && 'is-invalid'}`}
                                aria-label="Small select example"
                                id="vr_department"
                              >
                                <option value="">Select ...</option>
                                {departmentData && departmentData.map(({ department, id }) => {
                                  if (id) {
                                    return (
                                      <>
                                        <option key={id} value={id}>
                                          {department}
                                        </option>
                                      </>
                                    )
                                  }
                                })}
                              </CFormSelect>
                            </CCol>
                          </>
                        ) : (
                          <>
                            <CCol xs={12} md={3}>
                              <CFormLabel htmlFor="tNum">Division</CFormLabel>
                              <CFormInput
                                size="sm"
                                id="tNum"
                                value={user_info && user_info.division_info ? user_info.division_info.division : ''}
                                readOnly
                              />
                            </CCol>
                            <CCol xs={12} md={3}>
                              <CFormLabel htmlFor="tNum">Department</CFormLabel>
                              <CFormInput
                                size="sm"
                                id="tNum"
                                value={user_info && user_info.department_info ? user_info.department_info.department : ''}
                                readOnly
                              />
                            </CCol>
                          </>
                        )}

                        <CCol md={3}>
                          <CFormLabel htmlFor="vr_purpose">
                            Purpose <REQ />{' '}
                            {errors.vr_purpose && (
                              <span className="small text-danger">{errors.vr_purpose}</span>
                            )}
                          </CFormLabel>
                          <CFormSelect
                            size="sm"
                            name="vr_purpose"
                            onChange={handleChange}
                            onFocus={onFocus}
                            value={values.vr_purpose}
                            className={`mb-1 ${errors.vr_purpose && 'is-invalid'}`}
                            aria-label="Small select example"
                            id="vr_purpose"
                          >
                            <option value="0">Select ...</option>
                            {vrPurposedata && vrPurposedata.map(({ definition_list_code, definition_list_name }) => {
                              if (definition_list_code) {
                                return (
                                  <>
                                    <option key={definition_list_code} value={definition_list_code}>
                                      {definition_list_name}
                                    </option>
                                  </>
                                )
                              }
                            })}
                          </CFormSelect>
                        </CCol>
                        <CCol md={3}>
                          <CFormLabel htmlFor="vr_product">
                            Product <REQ />{' '}
                            {errors.vr_product && (
                              <span className="small text-danger">{errors.vr_product}</span>
                            )}
                          </CFormLabel>
                          <CFormSelect
                            size="sm"
                            name="vr_product"
                            onChange={handleChange}
                            onFocus={onFocus}
                            value={values.vr_product}
                            className={`mb-1 ${errors.vr_product && 'is-invalid'}`}
                            aria-label="Small select example"
                            id="vr_product"
                          >
                            <option value="0">Select ...</option>
                            {vrProductdata && vrProductdata.map(({ definition_list_code, definition_list_name }) => {
                              if (definition_list_code) {
                                return (
                                  <>
                                    <option key={definition_list_code} value={definition_list_code}>
                                      {definition_list_name}
                                    </option>
                                  </>
                                )
                              }
                            })}
                          </CFormSelect>
                        </CCol>
                        <CCol xs={12} md={3}>
                          <CFormLabel htmlFor="vr_from_location">
                            From Location <REQ />{' '}
                            {errors.vr_from_location && (
                              <span className="small text-danger">{errors.vr_from_location}</span>
                            )}
                          </CFormLabel>
                          <CFormInput
                            name="vr_from_location"
                            size="sm"
                            maxLength={20}
                            id="vr_from_location"
                            onChange={handleChange}
                            value={values.vr_from_location}
                            onFocus={onFocus}
                            onBlur={onBlur}
                            placeholder=""
                          />
                        </CCol>
                        <CCol xs={12} md={3}>
                          <CFormLabel htmlFor="vr_to_location">
                            To Location <REQ />{' '}
                            {errors.vr_to_location && (
                              <span className="small text-danger">{errors.vr_to_location}</span>
                            )}
                          </CFormLabel>
                          <CFormInput
                            name="vr_to_location"
                            size="sm"
                            maxLength={20}
                            id="vr_to_location"
                            onChange={handleChange}
                            value={values.vr_to_location}
                            onFocus={onFocus}
                            onBlur={onBlur}
                            placeholder=""
                          />
                        </CCol>
                        <CCol xs={12} md={3}>
                          <CFormLabel htmlFor="vr_requester">
                            Request By (Name) <REQ />{' '}
                            {errors.vr_requester && (
                              <span className="small text-danger">{errors.vr_requester}</span>
                            )}
                          </CFormLabel>
                          <CFormInput
                            name="vr_requester"
                            size="sm"
                            maxLength={20}
                            id="vr_requester"
                            onChange={handleChange}
                            value={values.vr_requester}
                            onFocus={onFocus}
                            onBlur={onBlur}
                            placeholder=""
                          />
                        </CCol>
                        <CCol xs={12} md={3}>
                          <CFormLabel htmlFor="vr_req_contact_no">
                            Contact No. <REQ />{' '}
                            {errors.vr_req_contact_no && (
                              <span className="small text-danger">{errors.vr_req_contact_no}</span>
                            )}
                          </CFormLabel>
                          <CFormInput
                            name="vr_req_contact_no"
                            size="sm"
                            maxLength={10}
                            id="vr_req_contact_no"
                            onChange={handleChange}
                            value={values.vr_req_contact_no}
                            className={`mb-1 ${errors.vr_req_contact_no && 'is-invalid'}`}
                            onFocus={onFocus}
                            onBlur={onBlur}
                            placeholder=""
                          />
                        </CCol>

                        <CCol md={3}>
                          <CFormLabel htmlFor="vr_capacity_id">
                            Vehicle Capacity (TON)<REQ />{' '}
                            {errors.vr_capacity_id && (
                              <span className="small text-danger">{errors.vr_capacity_id}</span>
                            )}
                          </CFormLabel>

                          <CFormSelect
                            size="sm"
                            name="vr_capacity_id"
                            onChange={handleChange}
                            onFocus={onFocus}
                            value={values.vr_capacity_id}
                            className={`mb-1 ${errors.vr_capacity_id && 'is-invalid'}`}
                            aria-label="Small select example"
                            id="vCap"
                          >
                            <option value="0">Select ...</option>
                            {vehicleCapacity.map(({ id, capacity }) => {
                              return (
                                <>
                                  <option key={id} value={id}>
                                    {capacity}
                                  </option>
                                </>
                              )
                            })}
                          </CFormSelect>
                        </CCol>

                        <CCol md={3}>
                          <CFormLabel htmlFor="vr_variety_id">
                            Vehicle Variety<REQ />{' '}
                            {errors.vr_variety_id && (
                              <span className="small text-danger">{errors.vr_variety_id}</span>
                            )}
                          </CFormLabel>

                          <CFormSelect
                            size="sm"
                            name="vr_variety_id"
                            onChange={handleChange}
                            onFocus={onFocus}
                            value={values.vr_variety_id}
                            className={`mb-1 ${errors.vr_variety_id && 'is-invalid'}`}
                            aria-label="Small select example"
                            id="vCap"
                          >
                            <option value="0">Select ...</option>
                            {vehicleVariety.map(({ id, vehicle_variety }) => {
                              return (
                                <>
                                  <option key={id} value={id}>
                                    {vehicle_variety}
                                  </option>
                                </>
                              )
                            })}
                          </CFormSelect>
                        </CCol>

                        <CCol md={3}>
                          <CFormLabel htmlFor="vr_body_type_id">
                            Vehicle Body Type<REQ />{' '}
                            {errors.vr_body_type_id && (
                              <span className="small text-danger">{errors.vr_body_type_id}</span>
                            )}
                          </CFormLabel>
                          <CFormSelect
                            size="sm"
                            name="vr_body_type_id"
                            id="vBody"
                            onFocus={onFocus}
                            onBlur={onBlur}
                            onChange={handleChange}
                            value={values.vr_body_type_id}
                            className={`mb-1 ${errors.vr_body_type_id && 'is-invalid'}`}
                            aria-label="Small select example"
                          >
                            <option value="0">Select ...</option>

                            {vehicleBody.map(({ id, body_type }) => {
                              return (
                                <>
                                  <option key={id} value={id}>
                                    {body_type}
                                  </option>
                                </>
                              )
                            })}
                          </CFormSelect>
                        </CCol>

                        <CCol xs={12} md={3}>
                          <CFormLabel htmlFor="vr_datetime">
                            Expected Date <REQ />{' '}
                            {errors.vr_datetime && (
                              <span className="small text-danger">
                                {errors.vr_datetime}
                              </span>
                            )}
                          </CFormLabel>
                          <CFormInput
                            name="vr_datetime"
                            size="sm"
                            id="vr_datetime"
                            onChange={handleChange}
                            type="date"
                            value={values.vr_datetime}
                            onFocus={onFocus}
                            onBlur={onBlur}
                            placeholder=""
                          />
                        </CCol>

                        <CCol md={3}>
                          <CFormLabel htmlFor="vr_remarks">
                            Trip Remarks
                          </CFormLabel>
                          <CFormTextarea
                            name="vr_remarks"
                            id="vr_remarks"
                            rows="1"
                            onChange={(e) => {remarksHandleChange(e,'2')}}
                            value={vendorRemarks}
                          ></CFormTextarea>
                        </CCol>
                      </CRow>

                      <CRow className="mb-md-1">
                        <CCol
                          className="pull-right"
                          xs={12}
                          sm={12}
                          md={12}
                          style={{ display: 'flex', justifyContent: 'flex-end' }}
                        >
                          <CButton
                            size="s-lg"
                            color="warning"
                            className="mx-1 px-2 text-white"
                            onClick={updateVR}
                            disabled={submitBtn}
                          >
                            Update
                          </CButton>
                          <Link to={'/VehicleRequestTable'}>
                            <CButton
                              size="s-lg"
                              color="warning"
                              className="mx-1 px-2 text-white"
                              type="button"
                            >
                              BACK
                            </CButton>
                          </Link>
                        </CCol>
                      </CRow>
                    </CForm>
                  </CTabPane>
                </CTabContent>
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
              </CCard>
            </>) : (<AccessDeniedComponent />
          )}
        </>
      )}
    </>
  )
}
export default VehicleRequestEdit
