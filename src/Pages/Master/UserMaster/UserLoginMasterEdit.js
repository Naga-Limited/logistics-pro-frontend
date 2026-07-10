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
  CCardImage,
  CAlert,
} from '@coreui/react'
import { useEffect } from 'react'
import { React, useState } from 'react'
import DepartmentListComponent from 'src/components/commoncomponent/DepartmentListComponent'
import DesignationListComponent from 'src/components/commoncomponent/DesignationListComponent'
import DivisonListComponent from 'src/components/commoncomponent/DivisonListComponent'
import LocationListComponent from 'src/components/commoncomponent/LocationListComponent'
import useForm from 'src/Hooks/useForm.js'
import UserLoginMasterService from 'src/Service/Master/UserLoginMasterService'
import DefinitionsListApi from 'src/Service/Definitions/DefinitionsListApi'
import { DepartmentMap } from './Mapping/DepartmentMap'
import { DesignationMap } from './Mapping/DesignationMap'
import { DivisionMap } from './Mapping/DivisonMap'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Link, useNavigate, useParams } from 'react-router-dom'
import UserMasterValidation from 'src/Utils/Master/UserMasterValidation'
import Loader from 'src/components/Loader'
import DesignationApi from 'src/Service/SubMaster/DesignationApi'
import DivisionApi from 'src/Service/SubMaster/DivisionApi'
import DepartmentApi from 'src/Service/SubMaster/DepartmentApi'
import VehicleTypesListComponent from 'src/Service/Master/VechileTypesListComponent'
import IncotermTypesListComponent from './Mapping/IncotermTypesListComponent'
import FileResizer from 'react-image-file-resizer'
import { getCurrentDateTime } from 'src/Pages/Depo/CommonMethods/CommonMethods'

const getOldLogInfo = (log_info) => {
  try {
    return log_info ? JSON.parse(log_info) : []
  } catch (e) {
    return []
  }
}

const UserLoginMasterEdit = () => {
  const user_info_json = localStorage.getItem('user_info')
  const user_info = JSON.parse(user_info_json)

  /* Get User Id From Local Storage */
  const user_id = user_info.user_id
  console.log(user_id)

  const { id } = useParams()

  const [singleUserInfo, setSingleUserInfo] = useState({})
  const [delUserPhoto, setDelUserPhoto] = useState(true)
  const [userPhoto, setUserPhoto] = useState(false)
  const REQ = () => <span className="text-danger"> * </span>
  const [fetch, setFetch] = useState(false)
  const [submitBtn, setSubmitBtn] = useState(true)
  const [errorModal, setErrorModal] = useState(false)
  const [error, setError] = useState({})
  const [designation, setDesignation] = useState([])
  const [divison, setDivison] = useState([])
  const [department, setDepartment] = useState([])
  const [incoterm, setIncoterm] = useState([])
  const formValues = {
    empid:'',
    emp_name: '',
    username: '',
    password: '',
    Divison: '',
    Department: '',
    Designation: '',
    vehicletypes: '',
    incotermtype: '',
    userid: '',
    usermobile: '',
    email: '',
    UserPhoto: '',
    location: '',
    selectAll: false,
    parking_yard_gate_in: '',
    vehicle_inspection_page: '',
    vehicle_maintenance_page: '',
    trip_sto_page: '',
    document_verification_page: '',
    vendor_creation_page: '',
    vendor_approval_page: '',
    vendor_confirmation_page: '',
    trip_sheet_creation_page: '',
  }

  const {
    values,
    errors,
    handleChange,
    handleMultipleChange,
    onFocus,
    handleSubmit,
    enableSubmit,
    onBlur,
    isTouched,
  } = useForm(updateUser, UserMasterValidation, formValues)


 /* ==================== File Compress Code Start=========================*/

 const resizeFile = (file) => new Promise(resolve => {
  FileResizer.imageFileResizer(file, 1000, 1000, 'JPEG', 100, 0,
  uri => {
    resolve(uri);
  }, 'base64' );
})

const imageCompress = async (event) => {

  const file = event.target.files[0];
  const image = await resizeFile(file);

  if(file.size > 2000000){ // Condition Set only for compress more than 2mb files
    valueAppendToImage(image)
  } else {
    values.UserPhoto = file
  }
}

const dataURLtoFile = (dataurl, filename) => {
  var arr = dataurl.split(','),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], filename, {type: mime});
};

const valueAppendToImage = (image) => {

  let file_name = 'dummy'+getRndInteger(100001,999999)+'.jpg'
  let file = dataURLtoFile(
    image,
    file_name,
  );

  console.log(file )

  values.UserPhoto = file // Appending compressed file in form value
}

const getRndInteger = (min, max) => {
  return Math.floor(Math.random() * (max - min)) + min;
}

/* ==================== FIle Compress Code End =========================*/

  const navigation = useNavigate()

  function updateUser() {
    setFetch(false)
    let formdata = new FormData()
    formdata.append('_method', 'PUT')
    formdata.append('empid', values.empid)
    formdata.append('emp_name', values.emp_name)
    formdata.append('username', values.username)
    formdata.append('email', values.email)
    formdata.append('mobile_no', values.usermobile)
    formdata.append('vehicle_types', values.vehicletypes)
    formdata.append('division_id', values.Divison)
    formdata.append('department_id', values.Department)
    formdata.append('designation_id', values.Designation)
    formdata.append('user_auto_id', values.userid)
    // formdata.append('location_id', values.location)
    formdata.append('location_id', selectedValueData.toString())
    formdata.append('incoterm_type_id', values.incotermtype)
    formdata.append('created_by', user_id)

    if (values.UserPhoto) {
      formdata.append('photo', values.UserPhoto)
    }

    let current_time = getCurrentDateTime()
    let current_info = getOldLogInfo(singleUserInfo ? singleUserInfo.log_info : null)
    
    // We get text names for division, department, designation to show in log
    let divisionName = divison.find(d => d.id == values.Divison)?.division || values.Divison
    let departmentName = department.find(d => d.id == values.Department)?.department || values.Department
    let designationName = designation.find(d => d.id == values.Designation)?.designation || values.Designation

    // Resolve location IDs to names
    let locationNames = ''
    if (singleUserInfo && singleUserInfo.location_info) {
      locationNames = singleUserInfo.location_info
        .filter(loc => selectedValueData.includes(loc.id))
        .map(loc => loc.location_name)
        .join(', ')
    }
    if (!locationNames && selectedValueData.length > 0) {
      locationNames = selectedValueData.toString()
    }

    // Resolve vehicle type names
    let vehicleTypeNames = ''
    if (singleUserInfo && singleUserInfo.vehicle_type_info) {
      vehicleTypeNames = singleUserInfo.vehicle_type_info
        .map(vt => vt.vehicle_type)
        .join(', ')
    }

    // Resolve incoterm type names
    let incotermTypeNames = ''
    if (singleUserInfo && singleUserInfo.inco_term_info) {
      incotermTypeNames = singleUserInfo.inco_term_info
        .map(it => it.def_list_name)
        .join(', ')
    }

    current_info.push({
      user_id: values.userid,
      user_mobile_no: values.usermobile,
      vehicle_types: vehicleTypeNames || values.vehicletypes,
      incoterm_type: incotermTypeNames || values.incotermtype,
      location: locationNames,
      type: 2,
      user: user_info.emp_name || user_id,
      time: current_time,
      remarks: '',
    })

    formdata.append('log_info', JSON.stringify(current_info))

    UserLoginMasterService.updateUser(id, formdata)
      .then((res) => {
        setFetch(true)
        if (res.status === 200) {
          toast.success('User Updated Successfully!')
          // setTimeout(() => {
            navigation('/UserLoginMasterTable')
          // }, 1000)
        }
      })
      .catch((error) => {
        setFetch(true)
        for (let value of formdata.values()) {
          console.log(value)
        }
        console.log(error)
        var object = error.response.data.errors
        var output = ''
        for (var property in object) {
          output += '*' + object[property] + '\n'
        }
        setError(output)
        setErrorModal(true)
      })
  }

  useEffect(() => {
    //fetch to get Designation list form master
    DesignationApi.getDesignation().then((res) => {
      setDesignation(res.data.data)
    })

    //fetch to get Department list form master
    DepartmentApi.getDepartment().then((res) => {
      setDepartment(res.data.data)
    })

    //fetch to get Divison list form master
    DivisionApi.getDivision().then((res) => {
      setDivison(res.data.data)
    })
  }, [])

  const [selectedValueData,setSelectedValueData] = useState([])

  useEffect(() => {
    let empid = !errors.empid && values.empid
    let emp_name = !errors.emp_name && values.emp_name
    let uName = !errors.username && values.username
    // let passWord = !errors.password && values.password
    let division = !errors.Divison && values.Divison
    let departMent = !errors.Department && values.Department
    let desigNation = !errors.Designation && values.Designation
    let vehicleTypes = !errors.vehicletypes && values.vehicletypes
    let userMobile = !errors.usermobile && values.usermobile
    let userMail = !errors.email && values.email
    // let uPhoto = !errors.UserPhoto && values.UserPhoto
    // let uLocation = !errors.location && values.location
    let uLocation = selectedValueData.length > 0
    let uincotermtype = !errors.incotermtype && values.incotermtype
    let uVehicleType = !errors.vehicletypes && values.vehicletypes.length > 0

    let condition_check =
      uName &&
      // passWord &&
      division &&
      departMent &&
      desigNation &&
      vehicleTypes &&
      userMobile &&
      userMail &&
      // uPhoto &&
      uLocation &&
       uincotermtype &&
      uVehicleType

    if (condition_check) {
      setSubmitBtn(false)
    } else {
      setSubmitBtn(true)
    }
  }, [values, errors,selectedValueData])


  function inArray(needle, haystack) {
    var length = haystack.length
    for (var i = 0; i < length; i++) {
      if (haystack[i] == needle) return true
    }
    return false
  }

  const locationUpdate = (e_data) => {

    let  new_data = []
    e_data.map((va,ind)=>{
      new_data.push(Number(va.value))
    })

    /* sorting the plant id array */
    new_data.sort(function(a, b){return a - b})
    setSelectedValueData(new_data)

  }

  useEffect(() => {
    UserLoginMasterService.getUserById(id).then((res) => {
      // let pagePermission = JSON.parse(res.data.data.page_permissions)
      console.log(res.data.data)
      values.empid = res.data.data.empid
      values.emp_name = res.data.data.emp_name
      values.username = res.data.data.username
      values.Divison = res.data.data.division_info.id
      values.Department = res.data.data.department_info.id
      values.Designation = res.data.data.designation_info.id
      values.incotermtype = res.data.data.incoterm_type_id || ''
      values.vehicletypes = res.data.data.vehicle_types || ''
      values.location = res.data.data.location_id || ''
      values.userid = res.data.data.user_auto_id
      values.usermobile = res.data.data.mobile_no
      values.email = res.data.data.email
      if(res.data.data.location_info.length > 0){
        let ndata = res.data.data.location_info
        let ndata_ar = []
        ndata.map((vv,ind)=>{
          console.log(vv,'vv-'+ind)
          ndata_ar[ind] = vv.id
        })
        setSelectedValueData(ndata_ar)
      } else {
        setSelectedValueData([])
      }
      // (values.location = res.data.data.location_info
      //   .filter((location) => location.location_name)
      //   .map((location) => location.id)
      //   .join(', ')),
      //   (values.vehicletypes = res.data.data.vehicle_type_info
      //     .filter((vehicletypes) => vehicletypes.vehicle_type)
      //     .map((vehicletypes) => vehicletypes.id)
      //     .join(', ')),
        setSingleUserInfo(res.data.data)

      setFetch(true)
    })
  }, [id])

  useEffect(() => {
    if (values.Divison && values.Department && values.Designation) {
      generateUserId(values.Divison, values.Department, values.Designation)
    }
  }, [values.Divison, values.Department, values.Designation])

  const generateUserId = (Divison, Department, Designation) => {
    let userid =
      DivisionMap[Divison] + DepartmentMap[Department] + DesignationMap[Designation]
    //values.userid = userid
    UserLoginMasterService.createUniqueUserId(userid).then((res)=>{
      values.userid = res.data
    }).catch(()=>{
      toast.error("Something went wrong to create User ID");
    });
  }

  return (
    <>
      {!fetch && <Loader />}{' '}
      {fetch && (
        <CCard>
          <CTabContent>
            <CTabPane role="tabpanel" aria-labelledby="home-tab" visible={true}>
              <CForm className="row g-3 m-2 p-1" onSubmit={handleSubmit}>
                <CRow className="mb-md-1">
                  <CCol md={3}>
                  <CFormLabel htmlFor="empid">
                  Empolyee Code <REQ />{' '}
                    </CFormLabel>
                    {errors.empid && (
                      <span className="small text-danger">{errors.empid}</span>
                    )}
                    <CFormInput
                      onFocus={onFocus}
                      onBlur={onBlur}
                      maxLength={30}
                      onChange={handleChange}
                      value={values.empid}
                      name="empid"
                      size="sm"
                      id="empid"
                      placeholder=""
                      disabled
                    />
                    </CCol>
                    <CCol md={3}>
                    <CFormLabel htmlFor="emp_name">
                    Empolyee Name <REQ />{' '}
                    </CFormLabel>
                    {errors.emp_name && (
                      <span className="small text-danger">{errors.emp_name}</span>
                    )}
                    <CFormInput
                      onFocus={onFocus}
                      onBlur={onBlur}
                      maxLength={30}
                      onChange={handleChange}
                      value={values.emp_name}
                      name="emp_name"
                      size="sm"
                      id="emp_name"
                      placeholder=""
                      disabled
                    />
                    </CCol>
                    <CCol md={3}>
                    <CFormLabel htmlFor="username">
                      User Name <REQ />{' '}
                    </CFormLabel>
                    {errors.username && (
                      <span className="small text-danger">{errors.username}</span>
                    )}
                    <CFormInput
                      onFocus={onFocus}
                      onBlur={onBlur}
                      maxLength={30}
                      onChange={handleChange}
                      value={values.username}
                      name="username"
                      size="sm"
                      id="username"
                      placeholder=""
                      disabled
                    />
                  </CCol>
                  {/* <CCol md={3}>
                    <CFormLabel htmlFor="password">New Password</CFormLabel>
                    <CFormInput
                      onFocus={onFocus}
                      onBlur={onBlur}
                      onChange={handleChange}
                      value={values.password}
                      name="password"
                      size="sm"
                      id="username"
                      placeholder=""
                    />
                  </CCol> */}
                  <CCol md={3}>
                    <CFormLabel htmlFor="Divison">
                      Divison <REQ />{' '}
                      {errors.Divison && (
                        <span className="small text-danger">{errors.Divison}</span>
                      )}
                    </CFormLabel>
                    <CFormSelect
                      size="sm"
                      name="Divison"
                      id="Divison"
                      onFocus={onFocus}
                      onBlur={onBlur}
                      //onChange={handleChange}
                      value={values.Divison}
                      className={`mb-1 ${errors.Divison && 'is-invalid'}`}
                      aria-label="Small select example"
                      disabled
                    >
                      <option value={''}>Select...</option>
                      {divison.map(({ id, division, division_status }) => {
                        if (division_status === 1) {
                          return (
                            <>
                              <option key={id} value={id}>
                                {division}
                              </option>
                            </>
                          )
                        }
                      })}
                      {/* <DivisonListComponent /> */}
                    </CFormSelect>
                  </CCol>
                  <CCol md={3}>
                    <CFormLabel htmlFor="Department">
                      Department <REQ />{' '}
                      {errors.Department && (
                        <span className="small text-danger">{errors.Department}</span>
                      )}
                    </CFormLabel>

                    <CFormSelect
                      size="sm"
                      name="Department"
                      id="Department"
                      onFocus={onFocus}
                      onBlur={onBlur}
                      //onChange={handleChange}
                      value={values.Department}
                      className={`mb-1 ${errors.Department && 'is-invalid'}`}
                      aria-label="Small select example"
                      disabled
                    >
                      <option value={''}>Select...</option>
                      {department.map(({ id, department, department_status }) => {
                        if (department_status === 1) {
                          return (
                            <>
                              <option key={id} value={id}>
                                {department}
                              </option>
                            </>
                          )
                        }
                      })}
                      {/* <DepartmentListComponent /> */}
                    </CFormSelect>
                  </CCol>
                  <CCol md={3}>
                    <CFormLabel htmlFor="Designation">
                      Designation <REQ />{' '}
                      {errors.Designation && (
                        <span className="small text-danger">{errors.Designation}</span>
                      )}
                    </CFormLabel>
                    <CFormSelect
                      size="sm"
                      name="Designation"
                      id="Designation"
                      onFocus={onFocus}
                      onBlur={onBlur}
                      //onChange={handleChange}
                      value={values.Designation}
                      className={`mb-1 ${errors.Designation && 'is-invalid'}`}
                      aria-label="Small select example"
                      disabled
                    >
                      <option value={''}>Select...</option>
                      {designation.map(({ id, designation, designation_status }) => {
                        if (designation_status === 1) {
                          return (
                            <>
                              <option key={id} value={id}>
                                {designation}
                              </option>
                            </>
                          )
                        }
                      })}

                      {/* <DesignationListComponent /> */}
                    </CFormSelect>
                  </CCol>
                  {/* </CRow>
                <CRow className="mb-md-1"> */}

                  <CCol md={3}>
                    <CFormLabel htmlFor="userid">
                      User ID <REQ />{' '}
                    </CFormLabel>
                    <CFormInput
                      name="userid"
                      onFocus={onFocus}
                      onBlur={onBlur}
                      onChange={handleChange}
                      value={values.userid}
                      size="sm"
                      id="userid"
                      placeholder=""
                      readOnly
                    />
                  </CCol>
                  <CCol md={3}>
                    <CFormLabel htmlFor="email">
                      User Mail ID <REQ />{' '}
                    </CFormLabel>
                    {errors.email && <span className="small text-danger">{errors.email}</span>}
                    <CFormInput
                      onFocus={onFocus}
                      onBlur={onBlur}
                      onChange={handleChange}
                      value={values.email}
                      name="email"
                      size="sm"
                      id="email"
                      placeholder="Enter Email"
                      disabled
                    />
                  </CCol>
                  <CCol md={3}>
                    <CFormLabel htmlFor="UserPhoto">
                      User Photo <REQ />{' '}
                      {errors.UserPhoto && (
                        <span className="small text-danger">{errors.UserPhoto}</span>
                      )}
                    </CFormLabel>
                    {delUserPhoto ? (
                      <CButton className="w-100 m-0" color="info" size="sm" id="inputAddress">
                        <span className="float-start">
                          <i
                            className="fa fa-eye"
                            onClick={() => setUserPhoto(true)}
                            aria-hidden="true"
                          ></i>{' '}
                          &nbsp;View
                        </span>
                        <span className="float-end">
                          <i
                            className="fa fa-trash"
                            aria-hidden="true"
                            onClick={() => setDelUserPhoto(false)}
                          ></i>
                        </span>
                      </CButton>
                    ) : (
                      <CFormInput
                        onFocus={onFocus}
                        onBlur={onBlur}
                        onChange={(e)=>{imageCompress(e)}}
                        type="file"
                        accept=".jpg,.jpeg"
                        name="UserPhoto"
                        size="sm"
                        id="UserPhoto"
                      />
                    )}
                    {/*user image biew model*/}
                    <CModal visible={userPhoto} onClose={() => setUserPhoto(false)}>
                      <CModalHeader>
                        <CModalTitle>User Photo</CModalTitle>
                      </CModalHeader>
                      <CModalBody>
                        <CCardImage orientation="top" src={singleUserInfo.user_image} />
                      </CModalBody>
                      <CModalFooter>
                        <CButton color="secondary" onClick={() => setUserPhoto(false)}>
                          Close
                        </CButton>
                      </CModalFooter>
                    </CModal>
                    {/*user image biew model*/}
                  </CCol>
                  <CCol md={3}>
                    <CFormLabel htmlFor="usermobile">
                      User Mobile Number <REQ />{' '}
                    </CFormLabel>
                    {errors.usermobile && (
                      <span className="small text-danger">{errors.usermobile}</span>
                    )}
                    <CFormInput
                      onFocus={onFocus}
                      onBlur={onBlur}
                      maxLength={10}
                      onChange={handleChange}
                      value={values.usermobile}
                      name="usermobile"
                      size="sm"
                      id="usermobile"
                      placeholder="Enter Mobile Number"
                    />
                  </CCol>

                  {/* </CRow>
                <CRow className="mb-md-1"> */}

                  <CCol md={3}>
                    <CFormLabel htmlFor="vehicletypes">
                      Assigned Vehicle Type <REQ />{' '}
                      {errors.vehicletypes && (
                        <span className="small text-danger">{errors.vehicletypes}</span>
                      )}
                    </CFormLabel>
                    <VehicleTypesListComponent
                      size="sm"
                      name="vehicletypes"
                      id="vehicletypes"
                      onFocus={onFocus}
                      onBlur={onBlur}
                      onChange={handleMultipleChange}
                      // onChange={handleChange}
                      selectedValue={values.vehicletypes}
                      isMultiple={true}
                      className={`mb-1 ${errors.vehicletypes && 'is-invalid'}`}
                      label="Select Vehicle Type"
                      noOptionsMessage="Vehicle types not found"
                    />
                    {/* </CFormSelect> */}
                  </CCol>
                  <CCol md={3}>
                    <CFormLabel htmlFor="incotermtype">
                    Incoterm Type <REQ />{' '}
                      {errors.incotermtype && (
                        <span className="small text-danger">{errors.incotermtype}</span>
                      )}
                    </CFormLabel>
                    <IncotermTypesListComponent
                      size="sm"
                      name="incotermtype"
                      id="incotermtype"
                      onFocus={onFocus}
                      onBlur={onBlur}
                      onChange={handleMultipleChange}
                      selectedValue={values.incotermtype}
                      isMultiple={true}
                      className={`mb-1 ${errors.incotermtype && 'is-invalid'}`}
                      label="Select Incoterm Type"
                      noOptionsMessage="Incoterm Type not found"

                    />

                  </CCol>
                  <CCol md={6}>
                    <CFormLabel htmlFor="location">
                      Location <REQ />{' '}
                      {selectedValueData.length == 0 && (
                        <span className="small text-danger">{'Required'}</span>
                      )}
                    </CFormLabel>
                    <LocationListComponent
                      size="sm"
                      name="location"
                      id="location"
                      onFocus={onFocus}
                      onBlur={onBlur}
                      // onChange={handleMultipleChange}
                      onChange={(e)=>{
                        locationUpdate(e)
                      }}
                      // selectedValue={values.location}
                      selectedValue={selectedValueData}
                      isMultiple={true}
                      // className={`mb-1 ${errors.location && 'is-invalid'}`}
                      label="Select Location"
                      noOptionsMessage="No Location found"
                    />
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
                      type="submit"
                      disabled={submitBtn}
                    >
                      Update
                    </CButton>
                    <Link to={'/UserLoginMasterTable'}>
                      <CButton
                        size="s-lg"
                        color="warning"
                        className="mx-1 px-2 text-white"
                        type="button"
                      >
                        Cancel
                      </CButton>
                    </Link>
                  </CCol>
                </CRow>
              </CForm>
            </CTabPane>
          </CTabContent>
        </CCard>
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
    </>
  )
}

export default UserLoginMasterEdit
