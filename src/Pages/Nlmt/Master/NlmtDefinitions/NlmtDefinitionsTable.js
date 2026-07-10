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
  CTooltip,

} from '@coreui/react'
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import useForm from 'src/Hooks/useForm'
import validate from 'src/Utils/Validation'
import CustomTable from 'src/components/customComponent/CustomTable'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Loader from 'src/components/Loader'
import NlmtDefinitionsApi from 'src/Service/Nlmt/Masters/NlmtDefinitionsApi'
import NlmtDefinitionsMasterValidation from 'src/Utils/Nlmt/Masters/NlmtDefinitionsMasterValidation'


const NlmtDefinitionsTable = () => {
  const REQ = () => <span className="text-danger"> * </span>
  const [modal, setModal] = useState(false)
  const [fetch, setFetch] = useState(false)
  const [rowData, setRowData] = useState([])
  const [save, setSave] = useState(true)
  const [success, setSuccess] = useState('')
  const [editId, setEditId] = useState('')
  const [update, setUpdate] = useState('')
  const [deleted, setDeleted] = useState('')
  const [error, setError] = useState('')
  const [mount, setMount] = useState(1)
  const [pending, setPending] = useState(true)
  const formValues = {
    definition: '',
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
  } = useForm(login, NlmtDefinitionsMasterValidation, formValues)

  function login() {
    // alert('No Errors CallBack Called')
  }
  // =================== Validation ===============

  /*                    */

  // =================== CRUD =====================
  const Create = (e) => {
    setSave(true)
    e.preventDefault()
    let createValues = { def_title: values.definition }
    NlmtDefinitionsApi.createNlmtDefinitions(createValues)

      .then((response) => {
        if (response.status === 201) {
          setSuccess('New Definition Added Successfully')
          toast.success('New Definition Added Successfully!')
          setModal(false)
          setMount((prevState) => prevState + 1)
        }
      })
      .catch((error) => {
        setError(error.response.data.errors.def_title[0])
      })
  }

  const Edit = (id) => {
    setSave(false)
    setEditId('')

    NlmtDefinitionsApi.getNlmtDefinitionsById(id).then((response) => {
      setFetch(true)
      if (response.status == 200) {
        let editData = response.data.data
        setModal(true)
        values.definition = editData.definition_name
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
    let updateValues = { def_title: values.definition }
    console.log(updateValues, id)

    NlmtDefinitionsApi.updateNlmtDefinitions(updateValues, id)
      .then((res) => {
        setFetch(true)

        if (res.status == 200) {
          setModal(false)
          toast.success('Definition Updated Successfully!')
          setMount((prevState) => (prevState = prevState + 1))
          setSave(true)
        }
      })
      .catch((error) => {
        setFetch(true)
        setError(error.response.data.errors.def_title[0])

      })
  }

  useEffect(() => {
    NlmtDefinitionsApi.getNlmtDefinitions().then((response) => {
      setFetch(true)
      let viewData = response.data.data
      let rowDataList = []
      viewData.map((data, index) => {
        rowDataList.push({
          sno: index + 1,
          Definition: data.definition_name,
          Created_at: data.created_at,
          Action: (
            <div className="d-flex justify-content-space-between">
               <CTooltip content="Edit" placement="top">
              <CButton
                size="sm"
                color="secondary"
                shape="rounded"
                id={data.id}
                onClick={() => {
                  setFetch(false)
                  Edit(data.definition_id)
                }}
                className="m-1"
              >
                <i className="fa fa-edit" aria-hidden="true"></i>
              </CButton>
              </CTooltip>
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
  }, [mount])
  // ============ CRUD =====================

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
      name: 'Definition',
      selector: (row) => row.Definition,
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

      {/* View & Edit Modal Section */}
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
            </CCol>
          </CRow>
        </CModalBody>
        <CModalFooter>
          <CButton onClick={(e) => (save ? Create(e) : Update(editId))} color="primary">
            {save ? 'Save' : 'Update'}
          </CButton>
        </CModalFooter>
      </CModal>
      {/* View & Edit Modal Section */}
    </>
  )
}

export default NlmtDefinitionsTable
