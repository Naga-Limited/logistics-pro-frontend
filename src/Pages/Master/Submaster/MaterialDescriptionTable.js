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
  CInputGroupText,
  CFormCheck,
  CModalFooter,
  CAlert,
} from '@coreui/react'
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import useForm from 'src/Hooks/useForm'
import validate from 'src/Utils/Validation'
import CustomTable from 'src/components/customComponent/CustomTable'
import MaterialDescriptionApi from 'src/Service/SubMaster/MaterialDescriptionApi'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import MaterialDescriptionSubMasterValidation from 'src/Utils/SubMaster/MaterialDescriptionSubMasterValidation'

const MaterialDescriptionTable = () => {
  const [modal, setModal] = useState(false)
  const [radio, setRadio] = useState(false)
  const [rowData, setRowData] = useState([])
  const [save, setSave] = useState(true)
  const [success, setSuccess] = useState('')
  const [editId, setEditId] = useState('')
  const [update, setUpdate] = useState('')
  const [deleted, setDeleted] = useState('')
  const [error, setError] = useState('')
  const [mount, setMount] = useState(1)
  const [pending, setPending] = useState(true)
  const checkRadio = (param) => {
    if (param == 'enab') {
      values.material_description = ''
      setRadio(false)
      setModal(!modal)
    } else {
      setModal(true)
      setRadio(true)
    }
  }

  const formValues = {
    material_description: '',
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
  } = useForm(login, MaterialDescriptionSubMasterValidation, formValues)

  function login() {
    // alert('No Errors CallBack Called')
  }

  const Create = (e) => {
    e.preventDefault()
    let createValues = { material_description: values.material_description }
    MaterialDescriptionApi.createMaterialDescription(createValues)
      .then((response) => {
        //console.log(response)
        setSuccess('New Material Description Added Successfully')
      })
      .catch((error) => {
        setError(error.response.data.errors.material_description[0])
        setTimeout(() => {
          setError('')
        }, 1000)
      })
  }

  const Edit = (id) => {
    setSave(false)
    setEditId('')
    MaterialDescriptionApi.getMaterialDescriptionById(id).then((response) => {
      let editData = response.data.data
      setModal(true)
      values.material_description = editData.material_description
      setEditId(id)
    })
  }

  const Update = (id) => {
    let updateValues = {
      material_description: values.material_description,
    }

    MaterialDescriptionApi.updateMaterialDescription(updateValues, id)
      .then((res) => {
        if (res.status == 200) {
          setModal(false)
          toast.success('Material Info Updated Successfully!')
          setMount((prevState) => (prevState = prevState + 1))
        }
      })
      .catch((error) => {
        setError(error.response.data.errors.material_description[0])
      })
  }

  const Delete = (id) => {
    MaterialDescriptionApi.deleteMaterialDescription(id).then((res) => {
      if (res.status === 204) {
        setMount((prevState) => (prevState = prevState + 1))
        toast.success('Material Status Updated Successfully!')
      }
    })
  }

  useEffect(() => {
    MaterialDescriptionApi.getMaterialDescription().then((response) => {
      let viewData = response.data.data
      let rowDataList = []
      viewData.map((data, index) => {
        rowDataList.push({
          sno: index + 1,
          // CreationDate: data.creation_date,
          CreationDate: data.creation_date.substring(0, 10),
          MaterialDescription: data.material_description,
          Status: data.status === 1 ? '✔️' : '❌',
          // data.status,
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
                disabled={data.status === 1 ? false : true}
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
        setError('')
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
      name: 'Creation Date',
      selector: (row) => row.CreationDate,
      sortable: true,
      center: true,
    },
    {
      name: 'Material Description',
      selector: (row) => row.MaterialDescription,
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
                checkRadio('enab')
                values.material_description = ''
                setSuccess('')
                setUpdate('')
                setError('')
                setDeleted('')
                setModal(!modal)
              }}
              // onClick={() => setModal(!modal)}
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
            fieldName={'MaterialDescription'}
            showSearchFilter={true}
            pending={pending}
          />
        </CCard>
      </CContainer>

      {/* Modal Section */}
      <CModal visible={modal} onClose={() => setModal(false)}>
        <CModalHeader>
          <CModalTitle>Material Description</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CRow>
            <CCol>
              <CFormLabel htmlFor="material_description">
                MaterialDescription*{' '}
                {errors.material_description && (
                  <span className="small text-danger">{errors.material_description}</span>
                )}
              </CFormLabel>
              <CFormInput
                size="sm"
                id="material_description"
                maxLength={20}
                className={`${errors.material_description && 'is-invalid'}`}
                name="material_description"
                value={values.material_description}
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
      {/* Modal Section */}
    </>
  )
}

export default MaterialDescriptionTable
