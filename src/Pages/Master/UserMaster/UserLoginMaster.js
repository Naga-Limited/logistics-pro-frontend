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
  CListGroupItem,
  CListGroup,
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
import { DepartmentMap } from './Mapping/DepartmentMap'
import { DesignationMap } from './Mapping/DesignationMap'
import { DivisionMap } from './Mapping/DivisonMap'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Link, useNavigate } from 'react-router-dom'
import UserMasterValidation from 'src/Utils/Master/UserMasterValidation'
import DefinitionsListApi from 'src/Service/Definitions/DefinitionsListApi'
import Loader from 'src/components/Loader'
import VehicleTypesListComponent from 'src/Service/Master/VechileTypesListComponent'
import IncotermTypesListComponent from './Mapping/IncotermTypesListComponent'
import FileResizer from 'react-image-file-resizer'

const UserLoginMaster = () => {
  const user_info_json = localStorage.getItem('user_info')
  const user_info = JSON.parse(user_info_json)

  /* Get User Id From Local Storage */
  const user_id = user_info.user_id
  console.log(user_id)

  const formValues = {
    empid: '',
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
  } = useForm(addUser, UserMasterValidation, formValues)

  const navigation = useNavigate()
  const REQ = () => <span className="text-danger"> * </span>

  const [fetch, setFetch] = useState(false)
  const [submitBtn, setSubmitBtn] = useState(true)
  const [errorModal, setErrorModal] = useState(false)
  const [error, setError] = useState({})
  const [IncotermStatus, setIncotermStatus] = useState(0)
  function addUser() {
    let formdata = new FormData()
    formdata.append('empid', values.empid)
    formdata.append('emp_name', values.emp_name)
    formdata.append('username', values.username)
    formdata.append('password', values.password)
    formdata.append('email', values.email)
    formdata.append('mobile_no', values.usermobile)
    formdata.append('vehicle_types', values.vehicletypes)
    formdata.append('incoterm_type_id', values.incotermtype)
    formdata.append('division_id', values.Divison)
    formdata.append('department_id', values.Department)
    formdata.append('designation_id', values.Designation)
    formdata.append('user_auto_id', values.userid)
    formdata.append('location_id', values.location)
    formdata.append('created_by', user_id)

    formdata.append('photo', values.UserPhoto)

    UserLoginMasterService.createUser(formdata)
      .then((res) => {
        setFetch(true)
        if (res.status === 201) {
          toast.success('User Created Successfully!')
          setTimeout(() => {
            navigation('/UserLoginMasterTable')
          }, 1000)
        }else if (res.status === 200) {
          toast.warning('UserID Already Exists. Please Change the Serial ID')
        }
         else if (res.status === 202) {
          toast.warning('User EmailID Already Exists. Please Change the EmailID')
        }
        else if (res.status === 203) {
          toast.warning('User Empolyee Code Already Exists. Please Change the Empolyee Code')
        }
        else if (res.status === 204) {
          toast.warning('User Name  Already Exists. Please Change the User Name')
        }
        else if (res.status === 205) {
          toast.warning('Mobile Number  Already Exists. Please Change the Mobile Number')
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
  const onChangeFilter = (event, event_type) => {
    var selected_value = event.value

    if (event_type == 'incotermtype') {
      if (selected_value) {
        IncotermStatus(selected_value)
      } else {
        setIncotermStatus(0)
      }
    }
    }
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

  const generateUserId = (Divison, Department, Designation) => {
    let userid =
      DivisionMap[Divison] + DepartmentMap[Department] + DesignationMap[Designation]
      //console.log("GenerateUser===>>>>".userid);
    UserLoginMasterService.createUniqueUserId(userid).then((res)=>{
      values.userid = res.data
    }).catch(()=>{
      toast.error("Something went wrong to create User ID");
    });
  }

  useEffect(() => {
    setFetch(true)
    let empid = !errors.empid && values.empid
    let emp_name = !errors.emp_name && values.emp_name
    let uName = !errors.username && values.username
    let passWord = !errors.password && values.password
    let division = !errors.Divison && values.Divison
    let departMent = !errors.Department && values.Department
    let desigNation = !errors.Designation && values.Designation
    let uincotermtype = !errors.incotermtype && values.incotermtype
    let userMobile = !errors.usermobile && values.usermobile
    let userMail = !errors.email && values.email
    let uPhoto = !errors.UserPhoto && values.UserPhoto
    let uLocation = !errors.location && values.location
    let uVehicleType = !errors.vehicletypes && values.vehicletypes.length > 0

    let condition_check =
      empid &&
      emp_name &&
      uName &&
      passWord &&
      division &&
      departMent &&
      desigNation &&
      userMobile &&
      uincotermtype &&
      userMail &&
      uPhoto &&
      uLocation &&
      uVehicleType

    if (condition_check) {
      setSubmitBtn(false)
    } else {
      setSubmitBtn(true)
    }
  }, [values, errors])

  console.log('User login master')

  useEffect(() => {}, [])



  useEffect(() => {
    if (values.Divison && values.Department && values.Designation) {
      generateUserId(values.Divison, values.Department, values.Designation)
    }
  }, [values.Divison, values.Department, values.Designation])

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
                    />
                  </CCol>
                  <CCol md={3}>
                    <CFormLabel htmlFor="password">
                      Password <REQ />{' '}
                    </CFormLabel>
                    {errors.password && (
                      <span className="small text-danger">{errors.password}</span>
                    )}
                    <CFormInput
                      onFocus={onFocus}
                      onBlur={onBlur}
                      onChange={handleChange}
                      value={values.password}
                      maxLength={10}
                      name="password"
                      size="sm"
                      id="username"
                      placeholder=""
                    />
                  </CCol>
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
                      onChange={handleChange}
                      value={values.Divison}
                      className={`mb-1 ${errors.Divison && 'is-invalid'}`}
                      aria-label="Small select example"
                    >
                      <DivisonListComponent />
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
                      onChange={handleChange}
                      value={values.Department}
                      className={`mb-1 ${errors.Department && 'is-invalid'}`}
                      aria-label="Small select example"
                    >
                      <DepartmentListComponent />
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
                      onChange={handleChange}
                      value={values.Designation}
                      className={`mb-1 ${errors.Designation && 'is-invalid'}`}
                      aria-label="Small select example"
                    >
                      <DesignationListComponent />
                    </CFormSelect>
                  </CCol>

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
                    <CFormLabel htmlFor="usermobile">
                      User Mobile Number <REQ />{' '}
                      {errors.usermobile && (
                        <span className="small text-danger">{errors.usermobile}</span>
                      )}
                    </CFormLabel>
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


                  <CCol md={3}>
                    <CFormLabel htmlFor="vehicletypes">
                      Assign Vehicle Type <REQ />{' '}
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
                    <CFormLabel htmlFor="email">
                      User Mail ID <REQ />{' '}
                      {errors.email && <span className="small text-danger">{errors.email}</span>}
                    </CFormLabel>
                    <CFormInput
                      onFocus={onFocus}
                      onBlur={onBlur}
                      onChange={handleChange}
                      value={values.email}
                      type="email"
                      name="email"
                      size="sm"
                      id="email"
                      placeholder="Enter Email"
                    />
                  </CCol>
                  <CCol md={3}>
                    <CFormLabel htmlFor="UserPhoto">
                      User Photo <REQ />{' '}
                      {errors.UserPhoto && (
                        <span className="small text-danger">{errors.UserPhoto}</span>
                      )}
                    </CFormLabel>
                    <CFormInput
                      type="file"
                      onFocus={onFocus}
                      onBlur={onBlur}
                      onChange={(e)=>{imageCompress(e)}}
                      //onChange={handleChange}
                      name="UserPhoto"
                      size="sm"
                      id="UserPhoto"
                    />
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
                    {/* </CFormSelect> */}
                  </CCol>
                  <CCol md={6}>
                    <CFormLabel htmlFor="location">
                      Location <REQ />{' '}
                      {errors.location && (
                        <span className="small text-danger">{errors.location}</span>
                      )}
                    </CFormLabel>
                    <LocationListComponent
                      size="sm"
                      name="location"
                      id="location"
                      onFocus={onFocus}
                      onBlur={onBlur}
                      onChange={handleMultipleChange}
                      // onChange={handleChange}
                      selectedValue={values.location}
                      isMultiple={true}
                      className={`mb-1 ${errors.location && 'is-invalid'}`}
                      label="Select Location"
                      noOptionsMessage="No Location found"
                    />
                    {/* </CFormSelect> */}
                  </CCol>
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
                      Submit
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

export default UserLoginMaster
