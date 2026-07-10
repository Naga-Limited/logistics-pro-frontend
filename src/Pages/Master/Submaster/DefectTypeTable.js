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
import { Link } from 'react-router-dom'
import useForm from 'src/Hooks/useForm'
import validate from 'src/Utils/DefectTypeValidation'
import CustomTable from 'src/components/customComponent/CustomTable'
import DefectTypeApi from '../../../Service/SubMaster/DefectTypeApi.js'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import DefectTypeSubMasterValidation from 'src/Utils/SubMaster/DefectTypeSubMasterValidation'

const DefectTypeTable = () => {
  const [modal, setModal] = useState(false)
  const [deleteModal, setDeleteModal] = useState(false)
  const [rowData, setRowData] = useState([])
  const [save, setSave] = useState(true)
  const [DTS, setDTS] = useState(false)
  const [success, setSuccess] = useState('')
  const [editId, setEditId] = useState('')
  const [deleteId, setDeleteId] = useState('')
  const [update, setUpdate] = useState('')
  const [deleted, setDeleted] = useState('')
  const [error, setError] = useState('')
  const [mount, setMount] = useState(1)
  const [pending, setPending] = useState(true)
  const formValues = {
    defect_type: '',
  }

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
  } = useForm(login, DefectTypeSubMasterValidation, formValues)

  function login() {}

  function test(dev) {
    if (values.defect_type.trim()) {
      return true
    }

    return false
  }

  const Create = (e) => {
    e.preventDefault()
    // let valid = test(e)
    let createValues = { defect_type: values.defect_type }
    // if (valid) {
    DefectTypeApi.createDefectType(createValues)
      .then((response) => {
        setSuccess('New Defect Type Added Successfully')
      })
      .catch((error) => {
        setError(error.response.data.errors.defect_type[0])
        setTimeout(() => {
          setError('')
        }, 1000)
      })
    // }
  }

  const Edit = (id) => {
    setSave(false)
    setEditId('')
    DefectTypeApi.getDefectTypeById(id).then((response) => {
      let editData = response.data.data
      setModal(true)
      values.defect_type = editData.defect_type
      setEditId(id)
    })
  }

  const Update = (id) => {
    let updateValues = { defect_type: values.defect_type }
    console.log(updateValues, id)
    DefectTypeApi.updateDefectType(updateValues, id)
      .then((res) => {
        if (res.status === 200) {
          setModal(false)
          toast.success('Defect Type Info Updated Successfully!')
          setMount((prevState) => (prevState = prevState + 1))
        }
      })
      .catch((error) => {
        setError(error.response.data.errors.defect_type[0])
        setTimeout(() => {
          setError('')
        }, 1000)
      })
  }

  const Delete = (deleteId) => {
    DefectTypeApi.deleteDefectType(deleteId).then((res) => {
      if (res.status === 204) {
        setMount((prevState) => (prevState = prevState + 1))
        toast.success('Defect Type Status Updated Successfully!')
      }
    })
    setTimeout(() => setDeleteModal(false), 500)
  }

  useEffect(() => {
    DefectTypeApi.getDefectType().then((response) => {
      let viewData = response.data.data
      let rowDataList = []
      viewData.map((data, index) => {
        rowDataList.push({
          sno: index + 1,
          DefectType: data.defect_type,
          Created_at: data.created_at,
          Status: data.defect_type_status === 1 ? '✔️' : '❌',
          Action: (
            <div className="d-flex justify-content-space-between">
              <CButton
                size="sm"
                color="danger"
                shape="rounded"
                id={data.defect_type_id}
                onClick={() => Delete(data.defect_type_id)}
                className="m-1"
              >
                {/* Delete */}
                <i className="fa fa-trash" aria-hidden="true"></i>
              </CButton>
              <CButton
                disabled={data.defect_type_status === 1 ? false : true}
                size="sm"
                color="secondary"
                shape="rounded"
                id={data.defect_type_id}
                onClick={() => Edit(data.defect_type_id)}
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
  }, [mount, modal, save, success, update, deleted])

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
      left: true,
      sortable: true,
    },

    {
      name: 'Defect Type',
      selector: (row) => row.DefectType,
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
      left: true,
      sortable: true,
    },
  ]

  return (
    <>
      <CContainer>
        <CRow>
          <CCol
            className="offset-md-6"
            xs={15}
            sm={15}
            md={6}
            style={{ display: 'flex', justifyContent: 'end' }}
          >
            <CButton
              size="sm"
              color="warning"
              className="px-5 text-white"
              onClick={() => {
                values.defect_type = ''
                setSuccess('')
                setUpdate('')
                setError('')
                setDeleted('')
                setModal(!modal)
              }}
            >
              <span className="float-start">
                <i className="" aria-hidden="true"></i> &nbsp;NEW
              </span>
            </CButton>
          </CCol>
        </CRow>
        <CCard className="mt-1">
          <CustomTable
            columns={columns}
            data={rowData}
            fieldName={'DefectType'}
            showSearchFilter={true}
            pending={pending}
          />
        </CCard>
      </CContainer>

      {/* View & Edit Modal Section */}
      <CModal visible={modal} onClose={() => setModal(false)}>
        <CModalHeader>
          <CModalTitle>Defect Type</CModalTitle>
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

              <CFormLabel htmlFor="defect_type">
                Defect Type*{' '}
                {errors.defect_type && (
                  <span className="small text-danger">{errors.defect_type}</span>
                )}
              </CFormLabel>
              <CFormInput
                size="sm"
                id="defect_type"
                maxLength={40}
                className={`${errors.defect_type && 'is-invalid'}`}
                name="defect_type"
                value={values.defect_type || ''}
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
            // disabled={DTS}
            onClick={(e) => (save ? Create(e) : Update(editId))}
            color="primary"
          >
            {save ? 'Save' : 'Update'}
          </CButton>
        </CModalFooter>
      </CModal>
      {/* View & Edit Modal Section */}

      {/* Delete Modal Section */}
      <CModal visible={deleteModal} onClose={() => setDeleteModal(false)}>
        <CModalHeader>
          <CModalTitle className="h4">Confirm To Delete</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CRow>
            <CCol>
              <CFormLabel htmlFor="defect_type">Are you sure want to Delete ?</CFormLabel>
            </CCol>
          </CRow>
          {deleted && (
            <CAlert color="danger" dismissible>
              {deleted}
            </CAlert>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton onClick={() => Delete()} color="danger">
            YES
          </CButton>
          <CButton onClick={() => setDeleteModal(false)} color="primary">
            NO
          </CButton>
        </CModalFooter>
      </CModal>
      {/* Delete Modal Section */}
    </>
  )
}

export default DefectTypeTable
