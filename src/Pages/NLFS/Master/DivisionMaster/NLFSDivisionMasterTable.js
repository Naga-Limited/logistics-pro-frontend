import {
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
  CModalFooter,
  CAlert,
} from '@coreui/react'
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useForm from 'src/Hooks/useForm' 
import CustomTable from 'src/components/customComponent/CustomTable'

import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css' 
import Loader from 'src/components/Loader'
import definitionsMasterValidation from 'src/Utils/Definitions/DefinitionsMasterValidation' 
import AccessDeniedComponent from 'src/components/commoncomponent/AccessDeniedComponent'
import JavascriptInArrayComponent from 'src/components/commoncomponent/JavascriptInArrayComponent'
import * as LogisticsProScreenNumberConstants from 'src/components/constants/LogisticsProScreenNumberConstants'  
import AuthService from 'src/Service/Auth/AuthService'
import LocalStorageService from 'src/Service/LocalStoage' 
import Swal from 'sweetalert2'
import NLFSDivisionApi from 'src/Service/NLFS/Master/NLFSDivisionApi'

const NLFSDivisionMasterTable = () => {
  
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
  let page_no = LogisticsProScreenNumberConstants.NLFSMasterModule.Division_Master_View

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
    division: '',
    division_short_name: '',
    division_code: '',
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

  const divisionAlreadyExistInDivisionMaster = (data) => {
    let condition = 0
    console.log(data,'Update - data')
    console.log(divisionMasterData,'Update - divisionMasterData')
    divisionMasterData.map((vb,lb)=>{
      if(vb.division_title == data.division || vb.short_name == data.division_short_name || vb.division_code == data.division_code){
        condition = 1
      }
    })

    return condition
  }

  // =================== CRUD =====================
  const Create = (e) => {

    if(divisionAlreadyExistInDivisionMaster(values) === 1){
      toast.warning('Division was already exists in Division Master..!')
      return false
    } 

    if(values.division.trimStart() == ''){
      values.division = '' 
      toast.warning('Division Name is required...!')
      return false
    } 

    if(values.division_short_name.trimStart() == ''){
      values.division_short_name = '' 
      toast.warning('Division Short Name is required...!')
      return false
    } 

    if(values.division_code.trimStart() == ''){
      values.division_code = '' 
      toast.warning('Division Code is required...!')
      return false
    } 

    setSave(true)
    e.preventDefault()
    let createValues = { 
      division_name: values.division,
      short_name: values.division_short_name,
      division_code: values.division_code,
      created_by: user_id,
      status: 1,
    }

    console.log(createValues,'createValues')
    NLFSDivisionApi.createDivisions(createValues)
      .then((response) => {
        if (response.status === 201) {
          setSuccess('New Division Added Successfully')
          toast.success('New Division Added Successfully!')
          setModal(false)
          setMount((prevState) => prevState + 1)
        }
        if (response.status === 200) {
          // setSuccess('New Division Added Successfully')
          toast.warning('Either Division Name or Short name Already Exists!')
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
    // setSingleDivisionInfo('')
    setStatusValue('')
    console.log(id,'EditID')

    NLFSDivisionApi.getDivisionsById(id).then((response) => {
      setFetch(true)
      if (response.status == 200) {
        // console.log(response)
        // setFetch(true)
        let editData = response.data.data
        console.log(editData,'EditID - editData')
        setSingleDivisionInfo(editData)
        setModal(true)
        values.division = editData.division_name
        values.division_short_name = editData.short_name
        values.division_code = editData.division_code
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
    console.log(singleDivisionInfo,'Update - singleDivisionInfo')
    console.log(type,'Update - type')
    console.log(values,'Update - values')
    if(((singleDivisionInfo.division_code != values.division_code) || (singleDivisionInfo.short_name != values.division_short_name)) && divisionAlreadyExistInDivisionMaster(values) === 1){
      toast.warning('Updated Division was already exists in Division Master..!')
      return false
    } 
    console.log('Update - 112233')
    setSave(false)
    let updateValues = ''
    // let updateValues = { def_title: values.definition }
    if(type == 1 || type == 3)
    {
      updateValues = { 
        division_name: values.division,
        short_name: values.division_short_name,
        division_code: values.division_code,
        updated_by: user_id,
        status: 1,
      }
    } else {
      updateValues = { 
        division_name: values.division,
        short_name: values.division_short_name,
        division_code: values.division_code,
        inactive_by: user_id,
        status: 0,
      }
    }
    console.log(updateValues, id)

    NLFSDivisionApi.updateDivisions(updateValues, id)
      .then((res) => {
        setFetch(true)

        if (res.status == 200) {
          setModal(false)
          toast.success('Division Updated Successfully!')
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

  const [divisionMasterData, setDivisionMasterData] = useState([])
  const [singleDivisionInfo, setSingleDivisionInfo] = useState([])
  useEffect(() => {
    // DefinitionsApi.getDefinitions().then((response) => {
      NLFSDivisionApi.getDivisions().then((response) => {
      setFetch(true)
      let viewData = response.data.data
      setDivisionMasterData(viewData)
      console.log(viewData,'viewData')
      let rowDataList = []
      viewData.map((data, index) => {
        rowDataList.push({
          sno: index + 1,
          Division_Name: data.division_name,
          Division_Short_Name: data.short_name, 
          Status: data.status == 1 ? '✔️' : '❌', 
          Created_at: data.created_at,
          Action: (
            <div className="d-flex justify-content-space-between">
              <CButton
                size="sm"
                color="secondary"
                shape="rounded"
                id={data.division_id}
                onClick={() => {
                  setFetch(false)
                  Edit(data.division_id)
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
      name: 'Division Name',
      selector: (row) => row.Division_Name,
      sortable: true,
      left: true,
    },
    {
      name: 'Division Short Name',
      selector: (row) => row.Division_Short_Name,
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
                  values.division = ''
                  values.division_short_name = ''
                  values.division_code = ''
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
          values.division = ''
          values.division_short_name = ''
          values.division_code = ''
          setModal(false)
        }}
      >
        <CModalHeader>
          <CModalTitle>Division</CModalTitle>
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
              <CFormLabel htmlFor="division">
                Division Name <REQ />{' '}
                {errors.division && (
                  <span className="small text-danger">{errors.division}</span>
                )}
              </CFormLabel>
              <CFormInput
                size="sm"
                id="division"
                maxLength={50}
                className={`${errors.division && 'is-invalid'}`}
                name="division"
                readOnly={statusValue == '' ? false : (statusValue == 0 ? true : false)}
                // value={!save ? values.definition : ''}
                value={values.division}
                onFocus={onFocus}
                onBlur={onBlur}
                onChange={handleChange}
                aria-label="Small select example"
              />
            </CCol>
            <CCol> 
              <CFormLabel htmlFor="division_short_name">
                Division Short Name <REQ />{' '}
                {errors.division_short_name && (
                  <span className="small text-danger">{errors.division_short_name}</span>
                )}
              </CFormLabel>
              <CFormInput
                size="sm"
                id="division_short_name"
                maxLength={20}
                readOnly={statusValue == '' ? false : (statusValue == 0 ? true : false)}
                className={`${errors.division_short_name && 'is-invalid'}`}
                name="division_short_name"
                // value={!save ? values.definition : ''}
                value={values.division_short_name}
                onFocus={onFocus}
                onBlur={onBlur}
                onChange={handleChange}
                aria-label="Small select example"
              />
            </CCol>
            <CCol> 
              <CFormLabel htmlFor="division_code">
                Division Code <REQ />{' '}
                {errors.division_code && (
                  <span className="small text-danger">{errors.division_code}</span>
                )}
              </CFormLabel>
              <CFormInput
                size="sm"
                id="division_code"
                readOnly={statusValue == '' ? false : (statusValue == 0 ? true : false)}
                maxLength={20}
                className={`${errors.division_code && 'is-invalid'}`}
                name="division_code"
                // value={!save ? values.definition : ''}
                value={values.division_code}
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

export default NLFSDivisionMasterTable
