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
import { Link } from 'react-router-dom'
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

const DefinitionsListTable = () => {
  const REQ = () => <span className="text-danger"> * </span>
  const [modal, setModal] = useState(false)
  const [fetch, setFetch] = useState(false)
  const [smallfetch, setSmallFetch] = useState(false)
  const [rowData, setRowData] = useState([])
  const [definitionsAll, setDefinitionsAll] = useState([])
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
  const formValues = {
    definition_id: '',
    definition_list_name: '',
    definition_list_code: '',
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
    values.definition_id = id
    console.log(id)
    setCurrentDefinitionId(id)
    if (id != 0) {
      // setFetch(false)
      setSmallFetch(false)
      setDisabled(false)
    } else {
      setDisabled(true)
    }
    DefinitionsListApi.visibleDefinitionsListByDefinition(id).then((response) => {
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
          Definition_List: data.definition_list_name,
          Code: data.definition_list_code,
          Status: data.definition_list_status === 1 ? '✔️' : '❌',
          Created_at: data.created_at,
          Action: (
            <div className="d-flex justify-content-space-between">
              <CButton
                size="sm"
                color="danger"
                shape="rounded"
                id={data.definition_list_id}
                onClick={(e) => {
                  setSmallFetch(false)
                  Delete(data.definition_list_id)
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
                id={data.definition_list_id}
                disabled={data.definition_list_status === 1 ? false : true}
                onClick={() => {
                  setSmallFetch(false)
                  Edit(data.definition_list_id)
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
    setSave(true)
    e.preventDefault()
    let createValues = {
      def_title_id: values.definition_id,
      def_list_name: values.definition,
      def_list_code: values.definition_list_code,
    }

    DefinitionsListApi.createDefinitionsList(createValues)
      // DefinitionsApi.createDefinitions(createValues)
      .then((response) => {
        setSmallFetch(true)
        if (response.status === 201) {
          setSuccess('New Definition List Added Successfully')
          toast.success('New Definition List Added Successfully!')
          setModal(false)
          setMount((prevState) => prevState + 1)
          setTimeout(() => {
            window.location.href = '/DefinitionsListTable'
          }, 500)
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
    DefinitionsListApi.getDefinitionsListById(id).then((response) => {
      // setSmallFetch(true)
      setSmallFetch(true)
      if (response.status == 200) {
        // console.log(response)
        // setFetch(true)
        let editData = response.data.data
        console.log(editData)
        setModal(true)

        values.definition_id = editData.definition_id
        values.definition = editData.definition_list_name
        values.definition_list_code = editData.definition_list_code
        setEditId(id)
      } else if (response.status == 404) {
        setModal(false)
        toast.success(response.message)
        setSave(true)
      }
    })
  }

  const Update = (id) => {
    setSave(false)
    let updateValues = {
      def_title_id: values.definition_id,
      def_list_name: values.definition,
      def_list_code: values.definition_list_code,
    }
    console.log(updateValues, id)

    DefinitionsListApi.updateDefinitionsList(updateValues, id)
      // DefinitionsApi.updateDefinitions(updateValues, id)
      .then((res) => {
        setFetch(true)

        if (res.status == 200) {
          setModal(false)
          toast.success('Definition Updated Successfully!')
          setMount((prevState) => (prevState = prevState + 1))
          setSave(true)
          setTimeout(() => {
            window.location.href = '/DefinitionsListTable'
          }, 500)
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

  const checkToSave = (e, list_code, needed_id) => {
    console.log(e)
    errors.definition_list_code = ''
    let exist_code = true
    console.log(list_code)
    console.log(needed_id)

    rowData.map((data, index) => {
      console.log(data)
      if (data.Code == list_code && save) {
        exist_code = false
      }
    })

    if (exist_code) {
      save ? Create(e) : Update(needed_id)
      // toast.warning('Definition List Added..')
      // console.log('yes')
    } else {
      setSmallFetch(true)
      toast.warning('Definition List Code Already Taken')
      // console.log('no')
    }
  }

  const Delete = (deleteId) => {
    console.log(deleteId)
    DefinitionsListApi.deleteDefinitionsList(deleteId).then((res) => {
      setSmallFetch(true)
      // PreviousLoadDetailsApi.deletePreviousLoadDetails(deleteId).then((res) => {
      if (res.status === 204) {
        // setMount((prevState) => (prevState = prevState + 1))
        toast.success('Definitions List Status Updated Successfully!')
        setMount((preState) => preState + 1)
        setTimeout(() => {
          window.location.href = '/DefinitionsListTable'
        }, 500)
      }
    })

    // setTimeout(() => setDeleteModal(false), 500)
  }

  /* Get All definitions */
  useEffect(() => {
    DefinitionsApi.getDefinitions().then((response) => {
      setFetch(true)
      setSmallFetch(true)
      let needed_data = response.data.data
      console.log(needed_data)
      setDefinitionsAll(needed_data)
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
      name: 'Definition List',
      selector: (row) => row.Definition_List,
      sortable: true,
      left: true,
    },
    {
      name: 'Code',
      selector: (row) => row.Code,
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
                    Definitions
                  </CInputGroupText>

                  <CFormSelect
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
          visible={modal}
          onClose={() => {
            setSave(true)
            setModal(false)
          }}
        >
          <CModalHeader>
            <CModalTitle>Definition</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <CRow>
              <CCol>
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

                <CFormLabel htmlFor="definition">
                  Definition Name <REQ />{' '}
                  {errors.definition && (
                    <span className="small text-danger">{errors.definition}</span>
                  )}
                </CFormLabel>
                <CFormInput
                  size="sm"
                  id="definition"
                  maxLength={50}
                  className={`${errors.definition && 'is-invalid'}`}
                  name="definition"
                  // value={!save ? values.definition : ''}
                  value={values.definition}
                  onFocus={onFocus}
                  onBlur={onBlur}
                  onChange={handleChange}
                  aria-label="Small select example"
                />
                <CFormLabel htmlFor="division_code">
                  Definition List Code{' '}
                  {errors.definition_list_code && (
                    <span className="small text-danger">{errors.definition_list_code}</span>
                  )}
                </CFormLabel>
                <CFormInput
                  size="sm"
                  id="definition_list_code"
                  maxLength={8}
                  className={`${errors.definition_list_code && 'is-invalid'}`}
                  name="definition_list_code"
                  value={values.definition_list_code || ''}
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
                checkToSave(e, values.definition_list_code, editId)
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

export default DefinitionsListTable
