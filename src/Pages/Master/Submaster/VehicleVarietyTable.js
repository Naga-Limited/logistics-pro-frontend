
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
  CCardImage,
  CModalFooter,
  CAlert,
} from '@coreui/react'
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import useForm from 'src/Hooks/useForm'
import validate from 'src/Utils/Validation'
import CustomTable from 'src/components/customComponent/CustomTable'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import VehicleVarietyApi from 'src/Service/SubMaster/VehicleVarietyApi'
import VehicleVarietySubMasterValidation from 'src/Utils/SubMaster/VehicleVarietySubMasterValidation'

const VehicleVarietyTable = () => {
  const [modal, setModal] = useState(false)
  const [deleteModal, setDeleteModal] = useState(false)
  const [rowData, setRowData] = useState([])
  const [save, setSave] = useState(true)
  const [success, setSuccess] = useState('')
  const [editId, setEditId] = useState('')
  const [update, setUpdate] = useState('')
  const [deleted, setDeleted] = useState('')
  const [error, setError] = useState('')
  const [mount, setMount] = useState(1)
  const [pending, setPending] = useState(true)
  const REQ = () => <span className="text-danger"> * </span>

  const formValues = {
    // vehicleVariety: '',
    variety: '',
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
  } = useForm(login, VehicleVarietySubMasterValidation, formValues)

  function login() {
    // alert('No Errors CallBack Called')
  }
  // =================== Validation ===============

  /*                    */

  // =================== CRUD =====================
  const Create = (e) => {
    e.preventDefault()
    let createValues = { vehicle_variety: values.variety }
    if(values.variety.trim() == ''){
      values.variety = ''
      return false
    }
    VehicleVarietyApi.createVehicleVariety(createValues)
      .then((response) => {
        setSuccess('New Vehicle Variety Added Successfully')
        toast.success('New Vehicle Variety Added Successfully!')
        setModal(false)
        setMount((prevState) => prevState + 1)
      })
      .catch((error) => {
        setError(error.response.data.errors.vehicle_variety[0])
        setTimeout(() => {
          setError('')
        }, 2000)
      })
  }

  const Edit = (id) => {
    setSave(false)
    setEditId('')
    VehicleVarietyApi.getVehicleVarietyById(id).then((response) => {
      let editData = response.data.data
      console.log(editData,'editData')
      setModal(true)
      values.variety = editData.vehicle_variety
      setEditId(id)
    })
  }

  const Update = (id) => {
    let updateValues = { vehicle_variety: values.variety }
    console.log(updateValues, id)
    VehicleVarietyApi.updateVehicleVariety(updateValues, id)
      .then((res) => {
        if (res.status == 200) {
          setModal(false)
          toast.success('Vehicle Variety Info Updated Successfully!')
          setMount((prevState) => (prevState = prevState + 1))
        }
      })
      .catch((error) => {
        setError(error.response.data.errors.vehicle_variety[0])
        setTimeout(() => {
          setError('')
        }, 2000)
      })
  }

  const Delete = (vehicleId) => {
    VehicleVarietyApi.deleteVehicleVariety(vehicleId).then((res) => {
      if (res.status === 204) {
        setMount((prevState) => (prevState = prevState + 1))
        toast.success('Vehicle Variety Status Updated Successfully!')
      }
    })
    setTimeout(() => setDeleteModal(false), 500)
  }

  useEffect(() => {
    VehicleVarietyApi.getVehicleVariety().then((response) => {
      let viewData = response.data.data
      let rowDataList = []
      viewData.map((data, index) => {
        rowDataList.push({
          sno: index + 1,
          Variety: data.vehicle_variety,
          Created_at: data.created_at,
          Status: data.status === 1 ? '✔️' : '❌',
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
                size="sm"
                color="secondary"
                shape="rounded"
                id={data.id}
                onClick={() => Edit(data.id)}
                disabled={data.status === 1 ? false : true}
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
      left: true,
      sortable: true,
    },

    {
      name: 'Vehicle Variety',
      selector: (row) => row.Variety,
      center: true,
      sortable: true,
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
                values.variety = ''
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
            data={rowData || ''}
            fieldName={'Variety'}
            showSearchFilter={true}
            pending={pending}
          />
        </CCard>
      </CContainer>

      {/* View & Edit Modal Section */}
      <CModal visible={modal} onClose={() => setModal(false)}>
        <CModalHeader>
          <CModalTitle>Vehicle Variety</CModalTitle>
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

              <CFormLabel htmlFor="variety">
                Vehicle Variety<REQ />{' '}
                {errors.variety && <span className="small text-danger">{errors.variety}</span>}
              </CFormLabel>
              <CFormInput
                size="sm"
                id="variety"
                maxLength={20}
                className={`${errors.variety && 'is-invalid'}`}
                name="variety"
                value={values.variety || ''}
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

      {/* Delete Modal Section */}
      <CModal visible={deleteModal} onClose={() => setDeleteModal(false)}>
        <CModalHeader>
          <CModalTitle className="h4">Confirm To Delete</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CRow>
            <CCol>
              <CFormLabel htmlFor="variety">Are you sure want to Delete </CFormLabel>
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

export default VehicleVarietyTable
