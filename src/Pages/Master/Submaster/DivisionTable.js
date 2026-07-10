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
import validate from 'src/Utils/Validation'
import CustomTable from 'src/components/customComponent/CustomTable'
import DivisionApi from '../../../Service/SubMaster/DivisionApi'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import DivisionSubMasterValidation from 'src/Utils/SubMaster/DivisionSubMasterValidation'

const DivisionTable = () => {
  const [modal, setModal] = useState(false)
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
    division: '',
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
  } = useForm(login, DivisionSubMasterValidation, formValues)

  function login() {
    // alert('No Errors CallBack Called')
  }
  // =================== Validation ===============

  /*                    */

  // =================== CRUD =====================
  const Create = (e) => {
    e.preventDefault()
    let createValues = { division_name: values.division, division_code: values.division_code }
    DivisionApi.createDivision(createValues)
      .then((response) => {
        if (response.status === 201) {
          setSuccess('New Division Added Successfully')
          setModal(false)
          setMount((prevState) => prevState + 1)
        }
      })
      .catch((error) => {
        setError(error.response.data.errors.division_name[0])
        setTimeout(() => {
          setError('')
        }, 1000)
      })
  }

  const Edit = (id) => {
    setSave(false)
    setEditId('')
    DivisionApi.getDivisionById(id).then((response) => {
      let editData = response.data.data
      setModal(true)
      values.division = editData.division
      values.division_code = editData.division_code
      setEditId(id)
    })
  }

  const Update = (id) => {
    let updateValues = { division_name: values.division }
    console.log(updateValues, id)
    DivisionApi.updateDivision(updateValues, id)
      .then((res) => {
        if (res.status == 200) {
          setModal(false)
          toast.success('Division Info Updated Successfully!')
          setMount((prevState) => (prevState = prevState + 1))
        }
      })
      .catch((error) => {
        setError(error.response.data.errors.division_name[0])
        setTimeout(() => {
          setError('')
        }, 1000)
      })
  }

  const Delete = (divisonID) => {
    DivisionApi.deleteDivision(divisonID).then((res) => {
      if (res.status === 204) {
        setMount((prevState) => (prevState = prevState + 1))
        toast.success('Division Status Updated Successfully!')
      }
    })
  }

  useEffect(() => {
    DivisionApi.getDivision().then((response) => {
      let viewData = response.data.data
      let rowDataList = []
      viewData.map((data, index) => {
        let status = data.division_status == 1 ? '✔️' : '❌'

        rowDataList.push({
          sno: index + 1,
          Division: data.division,
          division_code: data.division_code,
          Created_at: data.created_at,
          Status: status,
          Action: (
            <div className="d-flex justify-content-space-between">
              <CButton
                size="sm"
                color="danger"
                shape="rounded"
                id={data.id}
                onClick={() => Delete(data.id)}
                className="m-1"
              >
                {/* Delete */}
                <i className="fa fa-trash" aria-hidden="true"></i>
              </CButton>
              <CButton
                disabled={data.division_status === 1 ? false : true}
                size="sm"
                color="secondary"
                shape="rounded"
                id={data.id}
                onClick={() => Edit(data.id)}
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
      name: 'Division',
      selector: (row) => row.Division,
      sortable: true,
      left: true,
    },

    {
      name: 'Division Code',
      selector: (row) => row.division_code,
      sortable: true,
      left: true,
    },
    {
      name: 'Status',
      selector: (row) => row.Status,
      sortable: true,
      center: true,
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
                values.division = ''
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
            fieldName={'Division'}
            showSearchFilter={true}
            pending={pending}
          />
        </CCard>
      </CContainer>

      {/* View & Edit Modal Section */}
      <CModal visible={modal} onClose={() => setModal(false)}>
        <CModalHeader>
          <CModalTitle>Division</CModalTitle>
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

              <CFormLabel htmlFor="division">
                Division*{' '}
                {errors.division && <span className="small text-danger">{errors.division}</span>}
              </CFormLabel>
              <CFormInput
                size="sm"
                id="division"
                maxLength={30}
                className={`${errors.division && 'is-invalid'}`}
                name="division"
                value={values.division || ''}
                onFocus={onFocus}
                onBlur={onBlur}
                onChange={handleChange}
                aria-label="Small select example"
              />
              <CFormLabel htmlFor="division_code">
                Division Code*{' '}
                {errors.division_code && (
                  <span className="small text-danger">{errors.division_code}</span>
                )}
              </CFormLabel>
              <CFormInput
                size="sm"
                id="division_code"
                maxLength={8}
                className={`${errors.division && 'is-invalid'}`}
                name="division_code"
                value={values.division_code || ''}
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

export default DivisionTable

// {
//   name: 'Creation Date',
//   selector: (row) => row.Creation_Date,
//   sortable: true,
//   center: true,
// },

// {
//   name: 'Status',
//   selector: (row) => row.Status,
//   center: true,
// },
