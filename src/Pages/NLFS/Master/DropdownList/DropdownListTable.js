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
  CFormSelect,
  CInputGroupText,
  CInputGroup,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CAlert,
} from '@coreui/react'
import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useForm from 'src/Hooks/useForm' 
import CustomTable from 'src/components/customComponent/CustomTable'

import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css' 
import Loader from 'src/components/Loader'
import SmallLoader from 'src/components/SmallLoader'
import definitionsMasterValidation from 'src/Utils/Definitions/DefinitionsMasterValidation' 

import AccessDeniedComponent from 'src/components/commoncomponent/AccessDeniedComponent'
import JavascriptInArrayComponent from 'src/components/commoncomponent/JavascriptInArrayComponent'
import * as LogisticsProScreenNumberConstants from 'src/components/constants/LogisticsProScreenNumberConstants'  
import AuthService from 'src/Service/Auth/AuthService'
import LocalStorageService from 'src/Service/LocalStoage' 
import DropdownListApi from 'src/Service/NLFS/Master/DropdownListApi'
import DropdownApi from 'src/Service/NLFS/Master/DropdownApi'

const DropdownListTable = () => {

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
  const [smallfetch, setSmallFetch] = useState(false)
  const [rowData, setRowData] = useState([])
  const [dropdownsAll, setDropdownsAll] = useState([])
  const [currentDropdownId, setCurrentDropdownId] = useState('')
  const [disabled, setDisabled] = useState(true)
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
    dropdown_id: '',
    dropdown_list_name: '',
    dropdown_list_code: '',
    short_name: '',
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
    isTouched,
  } = useForm(login, definitionsMasterValidation, formValues)

  function login() {
    // alert('No Errors CallBack Called')
  }

  const assignValues = (id) => {
    values.dropdown_id = id
    console.log(id)
    setCurrentDropdownId(id)
    if (id != 0) {
      // setFetch(false)
      setSmallFetch(false)
      setDisabled(false)
    } else {
      setDisabled(true)
    }
    DropdownListApi.visibleDropdownsListByDropdown(id).then((response) => {
      // setFetch(true)

    // DefinitionsListApi.visibleDefinitionsListByDefinition(id).then((response) => {
      // setFetch(true)
      let needed_data = response.data.data
      console.log(needed_data.length)
      console.log(needed_data)

      // DefinitionsListApi.getDefinitionsList().then((response) => {

      setSmallFetch(true)

      let viewData = response.data.data
      console.log(viewData)
      let rowDataList = []
      viewData.map((data, index) => {
        rowDataList.push({
          sno: index + 1,
          Dropdown_List: data.dropdown_list_name,
          Dropdown_List_Code: data.dropdown_list_code,
          Status: data.status == 1 ? '✔️' : '❌',
          Created_at: data.created_at,
          Action: (
            <div className="d-flex justify-content-space-between">
              <CButton
                size="sm"
                color="danger"
                shape="rounded"
                id={data.dropdown_list_id}
                onClick={(e) => {
                  setSmallFetch(false)
                  Delete(data.dropdown_list_id)
                }}
                className="m-1"
              >
                {/* Delete */}
                <i className="fa fa-trash" aria-hidden="true"></i>
              </CButton>
              <CButton
                size="sm"
                color="secondary"
                shape="rounded"
                id={data.dropdown_list_id}
                disabled={data.status == 1 ? false : true}
                onClick={() => {
                  setSmallFetch(false)
                  Edit(data.dropdown_list_id)
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
      // })
    })
  }

  // =================== Validation ===============

  /*                    */

  // =================== CRUD =====================
  const Create = (e) => {
    
    e.preventDefault()

    let condition_value = dropdownlistAlreadyExistInDropdownListMaster(values)
    console.log(condition_value,'condition_value')


    if(condition_value.short_name == 1){
      setSmallFetch(true)
      toast.warning('Dropdown List Short Name was already exists in Dropdown List Master..!')
      return false
    } 

    if(condition_value.code == 1){
      setSmallFetch(true)
      toast.warning('Dropdown List Code was already exists in Dropdown List Master..!')
      return false
    } 

    if(values.dropdown_list_name.trimStart() == ''){
      values.dropdown_list_name = ''
      setSmallFetch(true)
      toast.warning('Dropdown List Name is required...!')
      return false
    } 

    if(values.dropdown_list_code.trimStart() == ''){
      values.dropdown_list_code = ''
      setSmallFetch(true)
      toast.warning('Dropdown List Code is required...!')
      return false
    } 

    if(values.short_name.trimStart() == ''){
      values.short_name = ''
      setSmallFetch(true)
      toast.warning('Dropdown List Short Name is required...!')
      return false
    } 

    setSave(true)
    let createValues = {
      dropdown_id: values.dropdown_id,
      dropdown_list_name: values.dropdown_list_name,
      short_name: values.short_name,
      dropdown_list_code: values.dropdown_list_code,
      created_by: user_id,
      status: 1,
    }
    console.log(createValues,'createValues')
    // return false
    DropdownListApi.createDropdownsList(createValues)
      // DefinitionsApi.createDefinitions(createValues)
      .then((response) => {
        setSmallFetch(true)
        if (response.status === 201) {
          setSuccess('New Dropdown List Added Successfully')
          toast.success('New Dropdown List Added Successfully!')
          setModal(false)
          setMount((prevState) => prevState + 1)
          setTimeout(() => {
          //   window.location.href = 'NLFSDropdownListTable'
          window.location.reload(false)
          }, 500)
        } 
        
        if (response.status === 200) {
          // setSuccess('New Dropdown Added Successfully')
          toast.warning('Either Dropdown List Name or Short name Already Exists!')
          // setModal(false)
          // setMount((prevState) => prevState + 1)
        }
      })
      .catch((error) => {
        setSmallFetch(true)
        setError(error.response.data.errors.def_title[0])
        // setTimeout(() => {
        //   setError('')
        // }, 1000)
      })
  }

  const Edit = (id) => {
    setSave(false)
    setEditId('')
    console.log(id)

    // DefinitionsApi.getDefinitionsById(id).then((response) => {
    DropdownListApi.getDropdownsListById(id).then((response) => {
      // setSmallFetch(true)
      setSmallFetch(true)
      if (response.status == 200) {
        // console.log(response)
        // setFetch(true)
        let editData = response.data.data
        console.log(editData,'editData')
        console.log(editData)
        setModal(true)
        setSingleDropdownListInfo(editData)
        values.dropdown_id = editData.dropdown_id
        values.dropdown_list_name = editData.dropdown_list_name
        values.dropdown_list_code = editData.dropdown_list_code
        values.short_name = editData.short_name
        setEditId(id)
      } else if (response.status == 404) {
        setModal(false)
        toast.success(response.message)
        setSave(true)
      }
    })
  }

  const dropdownlistAlreadyExistInDropdownListMaster = (data) => {
    let conditions = {
      code:0,
      short_name:0
    }
    
    console.log(data,'Update - data')
    console.log(dropdownListMasterData,'Update - dropdownListMasterData')
    dropdownListMasterData.map((vb,lb)=>{
      if(vb.dropdown_id == data.dropdown_id && vb.short_name == data.short_name){
        conditions.short_name = 1
      }
      
      if(vb.dropdown_id == data.dropdown_id && vb.dropdown_list_code == data.dropdown_list_code){
        conditions.code = 1
      }
    })

    return conditions
  }

  const Update = (id) => {
    let updateValues = ''
    console.log('Update - tplTransform')
    console.log(singleDropdownListInfo,'Update - singleDropdownListInfo')
    console.log(values,'Update - values')
    // if(((singleDropdownListInfo.dropdown_list_code != values.dropdown_list_code) || (singleDropdownListInfo.short_name != values.short_name)) && dropdownlistAlreadyExistInDropdownListMaster(values) === 1){
    //   toast.warning('Updated Dropdown List was already exists in Dropdown List Master..!')
    //   return false
    // } 

    setSave(false)
     
    updateValues = {        
      short_name: values.short_name,
      dropdown_id: values.dropdown_id,
      dropdown_list_name: values.dropdown_list_name,
      dropdown_list_code: values.dropdown_list_code,
      updated_by: user_id,
      status: 1,
    }
    console.log(updateValues, id)
    DropdownListApi.updateDropdownsList(updateValues, id)
    // DefinitionsListApi.updateDefinitionsList(updateValues, id)
      // DefinitionsApi.updateDefinitions(updateValues, id)
      .then((res) => {
        

        if (res.status == 200) {
          setFetch(true)
          setModal(false)
          toast.success('Dropdown List Updated Successfully!')
          setMount((prevState) => (prevState = prevState + 1))
          setSave(true)
          setTimeout(() => {
            // window.location.href = '/DefinitionsListTable'
            window.location.reload(false)
          }, 500)
        }
        if (res.status == 201) {
          setSmallFetch(true)
          // setSuccess('New Dropdown Added Successfully')
          toast.warning('Either Dropdown List Name or Code or Short name Already Exists!')
          // setModal(false)
          // setMount((prevState) => prevState + 1)
        }

        // if (res.status == 200) {
        //   setModal(false)
        //   toast.success('Dropdown List Updated Successfully!')
        //   setMount((prevState) => (prevState = prevState + 1))
        //   setSave(true)
        //   setTimeout(() => {
        //     // window.location.href = '/DefinitionsListTable'
        //     window.location.reload(false)
        //   }, 500)
        // }
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

  const checkToSave = (e, list_name, needed_id) => {
    console.log(e,'checkToSave-e')
    errors.definition_list_code = ''
    let exist_code = true
    console.log(list_name,'checkToSave-list_code')
    console.log(needed_id,'checkToSave-needed_id')
    console.log(dropdownListMasterData,'checkToSave-rowData') 

    dropdownListMasterData.map((data, index) => {
      console.log(data,'checkToSave-data')
      if (data.dropdown_list_name == list_name && save) {
        exist_code = false
      }
    })

    if (exist_code) {
      // alert(1)
      save ? Create(e) : Update(needed_id)
      // toast.warning('Definition List Added..')
      // console.log('yes')
    } else {
      setSmallFetch(true)
      toast.warning('Dropdown List Name Already Taken')
      // console.log('no')
    }
  }

  const Delete = (deleteId) => {
    console.log(deleteId,'deleteId')
    DropdownListApi.deleteDropdownsList(deleteId).then((res) => {
      setSmallFetch(true)
      // PreviousLoadDetailsApi.deletePreviousLoadDetails(deleteId).then((res) => {
      if (res.status === 204) {
        // setMount((prevState) => (prevState = prevState + 1))
        toast.success('Dropdown List Status Updated Successfully!')
        setMount((preState) => preState + 1)
        setTimeout(() => {
          // window.location.href = '/DefinitionsListTable'
          window.location.reload(false)
        }, 500)
      }
    })

    // setTimeout(() => setDeleteModal(false), 500)
  }

  const [dropdownListMasterData, setDropdownListMasterData] = useState([])
  const [singleDropdownListInfo, setSingleDropdownListInfo] = useState([])

  /* Get All definitions */
  useEffect(() => {
    // DropdownListApi.getDropdownsList().then((response) => {
    DropdownListApi.getDropdownsList().then((response) => {
      // setFetch(true)
      // setSmallFetch(true)
      let needed_data = response.data.data
      console.log(needed_data,'getDropdownListMasterData')
      setDropdownListMasterData(needed_data)
    })
  }, [])

  /* Get All definitions */
  useEffect(() => {
    // DropdownListApi.getDropdownsList().then((response) => {
    DropdownApi.getDropdowns().then((response) => {
      setFetch(true)
      setSmallFetch(true)
      let needed_data = response.data.data
      console.log(needed_data,'getDropdowns')
      setDropdownsAll(needed_data)
    })
  }, [])

  // useEffect(() => {
  //   DefinitionsListApi.visibleDefinitionsListByDefinition(currentDefinitionId).then((response) => {
  //     console.log(response)
  //   })
  // }, [mount])

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
      name: 'Dropdown List',
      selector: (row) => row.Dropdown_List,
      sortable: true,
      left: true,
    },
    {
      name: 'Code',
      selector: (row) => row.Dropdown_List_Code,
      left: true,
      sortable: true,
    },
    {
      name: 'Status',
      selector: (row) => row.Status,
      left: true,
      sortable: true,
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
          <CRow xs={{ gutterX: 5 }}>
            <CCol>
              <div className="p-3 border bg-light">
                <CInputGroup className="mb-3">
                  <CInputGroupText component="label" htmlFor="inputGroupSelect01">
                    Dropdowns
                  </CInputGroupText>

                  <CFormSelect
                    id="inputGroupSelect01"
                    onchange
                    onChange={(e) => {
                      assignValues(e.target.value)
                    }}
                    value={values.dropdown_id}
                  >
                    <option value={0}>Select...</option>
                    {dropdownsAll.map(({ dropdown_id, dropdown_title }) => {
                      return (
                        <>
                          <option key={dropdown_id} value={dropdown_id}>
                            {dropdown_title}
                          </option>
                        </>
                      )
                    })}
                  </CFormSelect>
                </CInputGroup>
              </div>
            </CCol>

            <CCol>{/* <div className="p-3 border bg-light">Custom column padding</div> */}</CCol>
          </CRow>
          {/* {currentDefinitionId && ( */}
          {}
          {!smallfetch && <SmallLoader />}

          {smallfetch && (
            <CContainer style={disabled ? { display: 'none' } : {}}>
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
                      values.definition = ''
                      setSuccess('')
                      setUpdate('')
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

          {/* )} */}
        </CContainer>
      )}

      {/* View & Edit Modal Section */}
      {smallfetch && (
         
        <CModal
          size="lg"
          backdrop="static"
          visible={modal}
          onClose={() => {
            setSave(true)
            values.dropdown_list_name = ''
            values.dropdown_list_code = ''
            values.short_name = '' 
            setModal(false)
          }}
        > 
          <CModalHeader>
            <CModalTitle>Dropdown List</CModalTitle>
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
                <CFormLabel htmlFor="dropdown_list_name">
                  Dropdown List Name <REQ />{' '}
                  {errors.dropdown_list_name && (
                    <span className="small text-danger">{errors.dropdown_list_name}</span>
                  )}
                </CFormLabel>
                <CFormInput
                  size="sm"
                  id="dropdown_list_name"
                  maxLength={50}
                  className={`${errors.dropdown_list_name && 'is-invalid'}`}
                  name="dropdown_list_name"
                  readOnly={statusValue == '' ? false : (statusValue == 0 ? true : false)}
                  // value={!save ? values.definition : ''}
                  value={values.dropdown_list_name}
                  onFocus={onFocus}
                  onBlur={onBlur}
                  onChange={handleChange}
                  aria-label="Small select example"
                />
              </CCol>
              <CCol> 
                <CFormLabel htmlFor="short_name">
                  Dropdown List Short Name <REQ />{' '}
                  {errors.short_name && (
                    <span className="small text-danger">{errors.short_name}</span>
                  )}
                </CFormLabel>
                <CFormInput
                  size="sm"
                  id="short_name"
                  maxLength={20}
                  readOnly={statusValue == '' ? false : (statusValue == 0 ? true : false)}
                  className={`${errors.short_name && 'is-invalid'}`}
                  name="short_name"
                  // value={!save ? values.definition : ''}
                  value={values.short_name}
                  onFocus={onFocus}
                  onBlur={onBlur}
                  onChange={handleChange}
                  aria-label="Small select example"
                />
              </CCol>
              <CCol> 
                <CFormLabel htmlFor="dropdown_list_code">
                  Dropdown List Code <REQ />{' '}
                  {errors.dropdown_list_code && (
                    <span className="small text-danger">{errors.dropdown_list_code}</span>
                  )}
                </CFormLabel>
                <CFormInput
                  size="sm"
                  id="dropdown_list_code"
                  readOnly={statusValue == '' ? false : (statusValue == 0 ? true : false)}
                  maxLength={20}
                  className={`${errors.dropdown_list_code && 'is-invalid'}`}
                  name="dropdown_list_code"
                  // value={!save ? values.definition : ''}
                  value={values.dropdown_list_code}
                  onFocus={onFocus}
                  onBlur={onBlur}
                  onChange={handleChange}
                  aria-label="Small select example"
                />
              </CCol>
            </CRow>
          </CModalBody>
          <CModalFooter>
            <CButton
              onClick={(e) => {
                setSmallFetch(false)
                checkToSave(e, values.dropdown_list_name, editId)
                // (save ? Create(e) : Update(editId))
              }}
              // disabled={enableSubmit}
              color="primary"
            >
              {save ? 'Save' : 'Update'}
            </CButton>
          </CModalFooter>
        </CModal>
      )}
      {/* View & Edit Modal Section */}
    </>
  )
}

export default DropdownListTable
