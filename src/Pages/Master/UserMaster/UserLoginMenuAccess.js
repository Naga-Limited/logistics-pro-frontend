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
  CFormCheck,
  CListGroup,
  CListGroupItem,
} from '@coreui/react'
import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useForm from 'src/Hooks/useForm'
import validate from 'src/Utils/Validation'
import CustomTable from 'src/components/customComponent/CustomTable'

import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import DefinitionsApi from 'src/Service/Definitions/DefinitionsApi'
import Loader from 'src/components/Loader'
import SmallLoader from 'src/components/SmallLoader'
import definitionsMasterValidation from 'src/Utils/Definitions/DefinitionsMasterValidation'
import DefinitionsListApi from 'src/Service/Definitions/DefinitionsListApi'
import SearchSelectComponent from 'src/components/commoncomponent/searchSelectComponent'
import UserLoginMasterService from 'src/Service/Master/UserLoginMasterService'

const UserLoginMenuAccess = () => {
  const REQ = () => <span className="text-danger"> * </span>
  const [modal, setModal] = useState(false)
  const [fetch, setFetch] = useState(false)
  const [smallfetch, setSmallFetch] = useState(false)
  const [rowData, setRowData] = useState([])
  const [usersAll, setUsersAll] = useState([])
  const [currentDefinitionId, setCurrentDefinitionId] = useState('')
  const [disabled, setDisabled] = useState(true)
  const [save, setSave] = useState(true)
  const [success, setSuccess] = useState('')
  const [editId, setEditId] = useState('')
  const [update, setUpdate] = useState('')
  const [deleted, setDeleted] = useState('')
  const [error, setError] = useState('')
  const [mount, setMount] = useState(1)
  const [pending, setPending] = useState(true)
  const [checkedYes, setCheckedYes] = useState(false)
  const [unCheckedYes, setUnCheckedYes] = useState(false)
  const [emptyUserError, setEmptyUserError] = useState('')
  const [UserID, setUserID] = useState('')
  const [pageList, setPageList] = useState([])
  const [checkList, setCheckList] = useState([])

  const formValues = {
    definition_id: '',
    definition_list_name: '',
    definition_list_code: '',
    user_data: '',
    user_data_id: '',
    permission: '',
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

  const navigation = useNavigate()

  const assignValues = (id) => {
    values.user_data_id = id
    console.log(id)
    // setCurrentDefinitionId(id)
    if (id != 0) {
      // setFetch(false)
      setSmallFetch(false)
      setDisabled(false)
    } else {
      setDisabled(true)
    }
    UserLoginMasterService.getUserById(id).then((response) => {
      setFetch(true)
      let needed_data = response.data.data
      console.log(needed_data)
      setUserID(response.data.data.user_auto_id)
      setCheckList(needed_data.page_permissions)

      console.log(needed_data)

      setSmallFetch(true)
    })
  }

  const checkSelectAll = (e) => {
    if (e.target.checked === true) {
      // setUnCheckedYes(false)
      setCheckedYes(true)
      setCheckList(range(1, 300))
    } else {
      setCheckedYes(false)
      setCheckList([])
    }
    console.log(checkList)
  }

  const range = (start, end) => {
    let menuadd =
      Array(end - start + 1)
      .fill()
      .map((_, idx) => start + idx)
      menuadd.push(261,321,70,80,81)
      console.log(menuadd);
      return menuadd
  }

  const handlecheck = (e) => {
    setCheckedYes(false)
    setUnCheckedYes(false)
    if (e.target.checked === true) {
      if (checkList.length > 0) {
        setCheckList([...checkList, Number(e.target.value)])
      } else {
        setCheckList([Number(e.target.value)])
      }
    } else {
      const selectedAcc = checkList.filter((a) => {
        if (a === Number(e.target.value)) return false
        return true
      })
      setCheckList([...selectedAcc])
    }
    console.log(checkList)
  }

  const saveData = () => {
    let json_permission_data = JSON.stringify(checkList)
    // console.log(json_permission_data)
    values.permission = json_permission_data

    console.log(values.user_data)
    console.log(values.permission)
    console.log(values.user_data_id)

    const formDataForSaveUser = new FormData()
    formDataForSaveUser.append('user_id', UserID)
    formDataForSaveUser.append('table_id', values.user_data_id)
    formDataForSaveUser.append('permission', values.permission)

    UserLoginMasterService.assignPermission(formDataForSaveUser).then((res) => {
      setFetch(true)
      console.log(res)
      if (res.status === 200) {
        toast.success('User Page Permission Updated Successfully!')
        navigation('/UserLoginMasterTable')
      } else if (res.status === 201) {
        toast.warning('User Page Permission Cannot be Updated..')
      } else if (res.status === 404) {
        toast.warning('User Not Found in DB..Kindly Contact Admin..')
      }
    })
  }

  const PreviousClick = () => {
    setDisabled(true)
    setEmptyUserError('')
    // values.user_data = ''
  }

  /* Assign the Shipment Route for Shipment Creation */
  const onChange = (event) => {
    // console.log(event)
    var current_user = event.value

    if (current_user) {
      setEmptyUserError('')
      values.user_data = current_user
    } else {
      setEmptyUserError(' Required')
      values.user_data = ''
    }
  }

  useEffect(() => {
    /* section for getting Pages List from database For Setting Permission */
    DefinitionsListApi.visibleDefinitionsListByDefinition(8).then((response) => {
      console.log(response.data.data)
      setPageList(response.data.data)
      setFetch(true)
      setSmallFetch(true)
    })
  }, [])

  return (
    <>
      {!fetch && <Loader />}

      {fetch && (
        <CContainer className="mt-2">
          <CRow>
            {/* <CRow xs={{ gutterX: 10 }}> */}
            <CCol>
              <div className="w-100 p-3">
                <CInputGroup>
                  {emptyUserError && <span className="small text-danger">{emptyUserError}</span>}
                  <CInputGroupText className="w-25" component="label">
                    Select User Name
                  </CInputGroupText>

                  <SearchSelectComponent
                    size="lg"
                    className="w-50"
                    onChange={(e) => {
                      onChange(e)
                      assignValues(e.value)
                    }}
                    label="Select User Name"
                    noOptionsMessage="User not found"
                    search_type="user_lists"
                  />

                  {/* <CFormSelect
                    id="inputGroupSelect01"
                    onchange
                    onChange={(e) => {
                      assignValues(e.target.value)
                    }}
                    value={values.definition_id}
                  >
                    <option value={0}>Select...</option>
                    {definitionsAll.map(({ definition_id, definition_name }) => {
                      return (
                        <>
                          <option key={definition_id} value={definition_id}>
                            {definition_name}
                          </option>
                        </>
                      )
                    })}
                  </CFormSelect> */}
                </CInputGroup>
              </div>
            </CCol>
            <CCol></CCol>
          </CRow>
          {/* {currentDefinitionId && ( */}
          {}
          {!smallfetch && <SmallLoader />}

          {smallfetch && (
            <CCard style={disabled ? { display: 'none' } : {}}>
              <CContainer>
                <CRow className="mt-3">
                  <CCol
                    className="offset-md-6"
                    xs={15}
                    sm={15}
                    md={6}
                    style={{ display: 'flex', justifyContent: 'end' }}
                  >
                    <CButton size="md" color="warning" className="px-3 text-white">
                      <Link className="text-white" to="/UserLoginMaster">
                        <span className="float-start">
                          <i className="" aria-hidden="true"></i> &nbsp; New User Create
                        </span>
                      </Link>
                    </CButton>
                  </CCol>
                </CRow>

                <CRow className="mt-3">
                  <CCol md={4}>
                    <h3>Permission to Pages</h3>
                  </CCol>
                  <CCol md={4}>
                    <h3>USER ID : {UserID}</h3>
                  </CCol>
                  <CCol md={2}>
                    <div className="d-flex ">
                      <h5 className="px-2">Select All</h5>
                      <div>
                        <CFormCheck
                          style={{ float: 'right', height: '1.3em', width: '1.3em' }}
                          checked={checkedYes}
                          onChange={(e) => checkSelectAll(e)}
                          value={values.selectAll}
                          name="selectAll"
                          id="select_all_btn"
                          aria-label="..."
                        />
                      </div>
                    </div>
                  </CCol>
                  {/* <CCol md={2}>
                    <div className="d-flex ">
                      <h5 className="px-2">Un Select All</h5>
                      <div>
                        <CFormCheck
                          style={{ float: 'inline-end', height: '1.3em', width: '1.3em' }}
                          checked={unCheckedYes}
                          onChange={(e) => checkUnSelectAll(e)}
                          value={values.unselectAll}
                          name="UnSelectAll"
                          id="un_select_all_btn"
                          aria-label="..."
                        />
                      </div>
                    </div>
                  </CCol> */}
                </CRow>
                <CRow className="mt-3">
                  {pageList.map((val, index) => {
                    console.log(checkList)
                    return (
                      <>
                        <CCol md={4}>
                          <div className="p-2 border bg-light">
                            {' '}
                            <CListGroup>
                              <CListGroupItem>
                                {/* <CButton
                              shape="rounded-0"
                              // className="mr-1"
                              size="sm"
                              style={{
                                float: 'inline-start',
                                marginRight: '3%',
                              }}
                              color="primary"
                              disabled
                            >
                              {index + 1}
                            </CButton> */}
                                {val.definition_list_name}
                                {/* {checkList && ( */}
                                <CFormCheck
                                  style={{ float: 'right', height: '1.3em', width: '1.3em' }}
                                  checked={
                                    checkList.length > 0 &&
                                    checkList.lastIndexOf(Number(val.definition_list_code)) >= 0
                                      ? true
                                      : false
                                  }
                                  onChange={(e) =>
                                    handlecheck(e, val.definition_list_code, index + 1)
                                  }
                                  name={val.definition_list_name}
                                  value={val.definition_list_code}
                                />
                                {/* )} */}
                              </CListGroupItem>
                            </CListGroup>
                          </div>
                        </CCol>
                      </>
                    )
                  })}
                </CRow>
                <CRow className="mt-md-3">
                  <CCol className="" xs={12} sm={12} md={3}>
                    <CButton
                      size="sm"
                      color="primary"
                      className="text-white"
                      type="button"
                      onClick={PreviousClick}
                    >
                      Previous
                    </CButton>
                  </CCol>
                  <CCol
                    className="offset-md-6"
                    xs={12}
                    sm={12}
                    md={3}
                    style={{ display: 'flex', justifyContent: 'end' }}
                  >
                    <CButton
                      size="sm"
                      color="warning"
                      className="mx-3 px-3 text-white"
                      // disabled={validateSubmit}
                      // onClick={saveData}
                      onClick={() => {
                        saveData()
                        setFetch(false)
                      }}
                    >
                      Save
                    </CButton>
                  </CCol>
                </CRow>
              </CContainer>
            </CCard>
          )}

          {/* )} */}
        </CContainer>
      )}
    </>
  )
}

export default UserLoginMenuAccess
