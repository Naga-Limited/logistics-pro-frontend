import {
  CForm,
  CButton,
  CCard,
  CContainer,
  CCol,
  CRow,
  CModal,
  CFormInput,
  CFormLabel,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CCardImage,
  CModalFooter,
  CAlert,
} from '@coreui/react'
import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useForm from 'src/Hooks/useForm'
import validate from 'src/Utils/Validation'
import CustomTable from 'src/components/customComponent/CustomTable'

import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import DefinitionsApi from 'src/Service/Definitions/DefinitionsApi'
import Loader from 'src/components/Loader'
import definitionsMasterValidation from 'src/Utils/Definitions/DefinitionsMasterValidation'
import DropdownApi from 'src/Service/NLFS/Master/DropdownApi'
import AccessDeniedComponent from 'src/components/commoncomponent/AccessDeniedComponent'
import JavascriptInArrayComponent from 'src/components/commoncomponent/JavascriptInArrayComponent'
import * as LogisticsProScreenNumberConstants from 'src/components/constants/LogisticsProScreenNumberConstants'  
import AuthService from 'src/Service/Auth/AuthService'
import LocalStorageService from 'src/Service/LocalStoage' 
import Swal from 'sweetalert2'

const DropdownTable = () => {
  
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

  // console.log(user_locations)
  /*================== User Location Fetch ======================*/

  /* ==================== Access Part Start ========================*/
  const [screenAccess, setScreenAccess] = useState(false)
  let page_no = LogisticsProScreenNumberConstants.NLFSMasterModule.Dropdown_Master_View

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

  const [modal, setModal] = useState(false)
  const [fetch, setFetch] = useState(false)
  const [rowData, setRowData] = useState([])
  const [save, setSave] = useState(true)
  const [success, setSuccess] = useState('')
  const [editId, setEditId] = useState('')
  const [statusValue, setStatusValue] = useState('')
  const [update, setUpdate] = useState('')
  const [deleted, setDeleted] = useState('')
  const [error, setError] = useState('')
  const [mount, setMount] = useState(1)
  const [pending, setPending] = useState(true)
  const formValues = {
    dropdown: '',
    dropdown_short_name: '',
    dropdown_code: '',
  }
  // =================== Validation ===============
  const {
    values,
    errors,
    handleChange,
    onFocus,
    handleSubmit,
    enableSubmit,
    onBlur,
    onClick,
    onKeyUp,
  } = useForm(login, definitionsMasterValidation, formValues)

  function login() {
    // alert('No Errors CallBack Called')
  }
  // =================== Validation ===============

  const dropdownAlreadyExistInDropdownMaster = (data) => {
    let condition = 0
    console.log(data,'Update - data')
    console.log(dropdownMasterData,'Update - dropdownMasterData')
    dropdownMasterData.map((vb,lb)=>{
      if(vb.dropdown_title == data.dropdown || vb.short_name == data.dropdown_short_name || vb.dropdown_code == data.dropdown_code){
        condition = 1
      }
    })

    return condition
  }

  // =================== CRUD =====================
  const Create = (e) => {

    if(dropdownAlreadyExistInDropdownMaster(values) === 1){
      toast.warning('Dropdown was already exists in Dropdown Master..!')
      return false
    } 

    if(values.dropdown.trimStart() == ''){
      values.dropdown = '' 
      toast.warning('Dropdown Name is required...!')
      return false
    } 

    if(values.dropdown_short_name.trimStart() == ''){
      values.dropdown_short_name = '' 
      toast.warning('Dropdown Short Name is required...!')
      return false
    } 

    if(values.dropdown_code.trimStart() == ''){
      values.dropdown_code = '' 
      toast.warning('Dropdown Code is required...!')
      return false
    } 

    setSave(true)
    e.preventDefault()
    let createValues = { 
      dropdown_title: values.dropdown,
      short_name: values.dropdown_short_name,
      dropdown_code: values.dropdown_code,
      created_by: user_id,
      status: 1,
    }

    console.log(createValues,'createValues')
    DropdownApi.createDropdowns(createValues)
      .then((response) => {
        if (response.status === 201) {
          setSuccess('New Dropdown Added Successfully')
          toast.success('New Dropdown Added Successfully!')
          setModal(false)
          setMount((prevState) => prevState + 1)
        }
        if (response.status === 200) {
          // setSuccess('New Dropdown Added Successfully')
          toast.warning('Either Dropdown Name or Short name Already Exists!')
          // setModal(false)
          // setMount((prevState) => prevState + 1)
        }
      })
      .catch((error) => {
        setError(error.response.data.errors.def_title[0])
        // setTimeout(() => {
        //   setError('')
        // }, 1000)
      })
  }

  const Edit = (id) => {
    setSave(false)
    setEditId('')
    // setSingleDropdownInfo('')
    setStatusValue('')
    console.log(id,'EditID')

    DropdownApi.getDropdownsById(id).then((response) => {
      setFetch(true)
      if (response.status == 200) {
        // console.log(response)
        // setFetch(true)
        let editData = response.data.data
        console.log(editData,'EditID - editData')
        setSingleDropdownInfo(editData)
        setModal(true)
        values.dropdown = editData.dropdown_title
        values.dropdown_short_name = editData.short_name
        values.dropdown_code = editData.dropdown_code
        setEditId(id)
        setStatusValue(editData.status)
      } else if (response.status == 404) {
        setModal(false)
        toast.success(response.message)
        setSave(true)
      }
    })
  }

  const Update = (id,type) => {
    console.log(id,'Update - EditID')
    console.log(singleDropdownInfo,'Update - singleDropdownInfo')
    console.log(type,'Update - type')
    console.log(values,'Update - values')
    if(((singleDropdownInfo.dropdown_code != values.dropdown_code) || (singleDropdownInfo.short_name != values.dropdown_short_name)) && dropdownAlreadyExistInDropdownMaster(values) === 1){
      toast.warning('Updated Dropdown was already exists in Dropdown Master..!')
      return false
    } 
    console.log('Update - 112233')
    setSave(false)
    let updateValues = ''
    // let updateValues = { def_title: values.definition }
    if(type == 1 || type == 3)
    {
      updateValues = { 
        dropdown_title: values.dropdown,
        short_name: values.dropdown_short_name,
        dropdown_code: values.dropdown_code,
        updated_by: user_id,
        status: 1,
      }
    } else {
      updateValues = { 
        dropdown_title: values.dropdown,
        short_name: values.dropdown_short_name,
        dropdown_code: values.dropdown_code,
        inactive_by: user_id,
        status: 0,
      }
    }
    console.log(updateValues, id)

    DropdownApi.updateDropdowns(updateValues, id)
      .then((res) => {
        setFetch(true)

        if (res.status == 200) {
          setModal(false)
          toast.success('Dropdown Updated Successfully!')
          setMount((prevState) => (prevState = prevState + 1))
          setSave(true)
        }
      })
      .catch((error) => {
        // console.log('ask2')
        setFetch(true)
        setError(error.response.data.errors.def_title[0])
        // setTimeout(() => {
        //   setError('')
        // }, 1000)
      })
  }

  function logout() {
    AuthService.forceLogout(user_id).then((res) => {
      // console.log(res)
      if (res.status == 204) {
        LocalStorageService.clear()
        window.location.reload(false)
      }
    })
  }

  const [dropdownMasterData, setDropdownMasterData] = useState([])
  const [singleDropdownInfo, setSingleDropdownInfo] = useState([])
  useEffect(() => {
    // DefinitionsApi.getDefinitions().then((response) => {
      DropdownApi.getDropdowns().then((response) => {
      setFetch(true)
      let viewData = response.data.data
      setDropdownMasterData(viewData)
      console.log(viewData,'viewData')
      let rowDataList = []
      viewData.map((data, index) => {
        rowDataList.push({
          sno: index + 1,
          Dropdown_Name: data.dropdown_title,
          Dropdown_Short_Name: data.short_name, 
          Status: data.status == 1 ? '✔️' : '❌', 
          Created_at: data.created_at,
          Action: (
            <div className="d-flex justify-content-space-between">
              <CButton
                size="sm"
                color="secondary"
                shape="rounded"
                id={data.dropdown_id}
                onClick={() => {
                  setFetch(false)
                  Edit(data.dropdown_id)
                }}
                className="m-1"
              >
                {/* Edit */}
                <i className="fa fa-edit" aria-hidden="true"></i>
              </CButton>
            </div>
          ),
        })
      })
      setRowData(rowDataList)
      setPending(false)
      setTimeout(() => {
        setSuccess('')
        setUpdate('')
        setDeleted('')
      }, 1500)
    })
    .catch((error) => {
      setFetch(true)
      console.log(error)
      let errorText = error.response.data.message
      console.log(errorText,'errorText')
      let timerInterval;
      if (error.response.status === 401) { 
        Swal.fire({
          title: "Unauthorized Activities Found..",
          html: "App will close in <b></b> milliseconds.",
          icon: "error",
          timer: 3000,
          timerProgressBar: true,
          didOpen: () => {
            Swal.showLoading();
            const timer = Swal.getPopup().querySelector("b");
            timerInterval = setInterval(() => {
              timer.textContent = `${Swal.getTimerLeft()}`;
            }, 100);
          },
          willClose: () => {
            clearInterval(timerInterval);
          }
        }).then((result) => {
          // console.log(result,'result') 
          if (result.dismiss === Swal.DismissReason.timer) { 
            logout()
          }
        });      
      }
    })
  }, [mount])
  // ============ CRUD =====================
  /*                    */
  // ============ Column Header Data =======
  const columns = [
    {
      name: 'S.No',
      selector: (row) => row.sno,
      sortable: true,
      center: true,
    },
    {
      name: 'Creation date',
      selector: (row) => row.Created_at,
      sortable: true,
      left: true,
    },
    {
      name: 'Dropdown Name',
      selector: (row) => row.Dropdown_Name,
      sortable: true,
      left: true,
    },
    {
      name: 'Dropdown Short Name',
      selector: (row) => row.Dropdown_Short_Name,
      sortable: true,
      left: true,
    },
    {
      name: 'Status',
      selector: (row) => row.Status,
      sortable: true,
      left: true,
    },
    {
      name: 'Action',
      selector: (row) => row.Action,
      center: true,
    },
  ]
  // =================== Column Header Data =======

  return (
    <>
      {!fetch && <Loader />}
      {fetch && (
        <CContainer className="mt-2">
          <CRow className="mt-3">
            <CCol
              className="offset-md-6"
              xs={15}
              sm={15}
              md={6}
              style={{ display: 'flex', justifyContent: 'end' }}
            >
              <CButton
                size="md"
                color="warning"
                className="px-3 text-white"
                onClick={() => {
                  console.log(statusValue,'statusValue')
                  values.dropdown = ''
                  values.dropdown_short_name = ''
                  values.dropdown_code = ''
                  setSuccess('')
                  setUpdate('')
                  setStatusValue('')
                  setError('')
                  setDeleted('')
                  setModal(!modal)
                }}
              >
                <span className="float-start">
                  <i className="" aria-hidden="true"></i> &nbsp;New
                </span>
              </CButton>
            </CCol>
          </CRow>
          <CCard className="mt-1">
            <CustomTable
              columns={columns}
              data={rowData || ''}
              fieldName={'Definition'}
              showSearchFilter={true}
              // pending={pending}
            />
          </CCard>
        </CContainer>
      )}

      {/* View & Edit Modal Section */}
      <CModal
        size="lg"
        backdrop="static"
        visible={modal}
        onClose={() => {
          setSave(true)
          values.dropdown = ''
          values.dropdown_short_name = ''
          values.dropdown_code = ''
          setModal(false)
        }}
      >
        <CModalHeader>
          <CModalTitle>Dropdown</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CRow>
            {/* <CCol> */}
              {update && (
                <CAlert color="primary" data-aos="fade-down" dismissible>
                  {update}
                </CAlert>
              )}
              {success && (
                <CAlert color="success" data-aos="fade-down" dismissible>
                  {success}
                </CAlert>
              )}
              {error && (
                <CAlert color="danger" data-aos="fade-down" dismissible>
                  {error}
                </CAlert>
              )}
            <CCol> 
              <CFormLabel htmlFor="dropdown">
                Dropdown Name <REQ />{' '}
                {errors.dropdown && (
                  <span className="small text-danger">{errors.dropdown}</span>
                )}
              </CFormLabel>
              <CFormInput
                size="sm"
                id="dropdown"
                maxLength={50}
                className={`${errors.dropdown && 'is-invalid'}`}
                name="dropdown"
                readOnly={statusValue == '' ? false : (statusValue == 0 ? true : false)}
                // value={!save ? values.definition : ''}
                value={values.dropdown}
                onFocus={onFocus}
                onBlur={onBlur}
                onChange={handleChange}
                aria-label="Small select example"
              />
            </CCol>
            <CCol> 
              <CFormLabel htmlFor="dropdown_short_name">
                Dropdown Short Name <REQ />{' '}
                {errors.dropdown_short_name && (
                  <span className="small text-danger">{errors.dropdown_short_name}</span>
                )}
              </CFormLabel>
              <CFormInput
                size="sm"
                id="dropdown_short_name"
                maxLength={20}
                readOnly={statusValue == '' ? false : (statusValue == 0 ? true : false)}
                className={`${errors.dropdown_short_name && 'is-invalid'}`}
                name="dropdown_short_name"
                // value={!save ? values.definition : ''}
                value={values.dropdown_short_name}
                onFocus={onFocus}
                onBlur={onBlur}
                onChange={handleChange}
                aria-label="Small select example"
              />
            </CCol>
            <CCol> 
              <CFormLabel htmlFor="dropdown_code">
                Dropdown Code <REQ />{' '}
                {errors.dropdown_code && (
                  <span className="small text-danger">{errors.dropdown_code}</span>
                )}
              </CFormLabel>
              <CFormInput
                size="sm"
                id="dropdown_code"
                readOnly={statusValue == '' ? false : (statusValue == 0 ? true : false)}
                maxLength={20}
                className={`${errors.dropdown_code && 'is-invalid'}`}
                name="dropdown_code"
                // value={!save ? values.definition : ''}
                value={values.dropdown_code}
                onFocus={onFocus}
                onBlur={onBlur}
                onChange={handleChange}
                aria-label="Small select example"
              />
            </CCol>
            
          </CRow>
        </CModalBody>
        <CModalFooter>
          {save ? (
            <CButton onClick={(e) => Create(e)} color="primary">
              {'Save'}
            </CButton>
          ) : (
            <>
            {statusValue == 1 ? (
              <>
              <CButton onClick={(e) => Update(editId,1)} color="primary">
                {'Update'}
              </CButton>
              <CButton onClick={(e) => Update(editId,2)} color="danger">
                {'In Active'}
              </CButton>
              </>
              ) : (
              <CButton onClick={(e) => Update(editId,3)} color="success">
                {'Active'}
              </CButton>
              )}
            </>
          )}
          
        </CModalFooter>
      </CModal>
      {/* View & Edit Modal Section */}
    </>
  )
}

export default DropdownTable
