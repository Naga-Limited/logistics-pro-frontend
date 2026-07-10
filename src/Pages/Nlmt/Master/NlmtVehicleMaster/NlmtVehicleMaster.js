/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react'
import {
  CButton,
  CCard,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CRow,
  CAlert,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
} from '@coreui/react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import Loader from 'src/components/Loader'
import NlmtVehicleMasterService from 'src/Service/Nlmt/Masters/NlmtVehicleMasterService'
import NlmtDefinitionsListApi from 'src/Service/Nlmt/Masters/NlmtDefinitionsListApi'

const REQ = () => <span className="text-danger"> * </span>

const NlmtVehicleMaster = () => {
  const navigate = useNavigate()

  /* ================= FORM VALUES ================= */
  const formValues = {
    vehicleNumber: '',
    vehicleType: '',
    vehicleCapacity: '',
    vehicleBodyType: '',
    vehicleVariety: '',
    vehicleGroup: '',
    rcFront: null,
    rcBack: null,
    insFront: null,
    insBack: null,
    insuranceValidity: '',
    fcValidity: '',
  }

  /* ================= STATES ================= */
  const [values, setValues] = useState(formValues)
  const [loading, setLoading] = useState(true)
  const [submitBtn, setSubmitBtn] = useState(true)

  const [vehicleTypeData, setVehicleTypeData] = useState([])
  const [vehicleCapacityData, setVehicleCapacityData] = useState([])
  const [vehicleBodyTypeData, setVehicleBodyTypeData] = useState([])
  const [vehicleMasterData, setVehicleMasterData] = useState([])

  const [errorModal, setErrorModal] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  // Redundantly check overall validation was disabled.

  /* ================= LOAD MASTER DATA ================= */
  useEffect(() => {
    Promise.all([
      NlmtDefinitionsListApi.visibleNlmtDefinitionsListByDefinition(2), // Vehicle Capacity
      NlmtDefinitionsListApi.visibleNlmtDefinitionsListByDefinition(1), // Vehicle Body Type
      NlmtDefinitionsListApi.visibleNlmtDefinitionsListByDefinition(3), // Vehicle Type
      NlmtVehicleMasterService.getNlmtVehicles(),
    ])
      .then(([capacity, body, type,vehicles]) => {
        setVehicleTypeData(type.data.data || [])
        setVehicleBodyTypeData(body.data.data || [])
        setVehicleCapacityData(capacity.data.data || [])
        setVehicleMasterData(vehicles.data.data || [])
      })
      .finally(() => setLoading(false))
  }, [])

  /* ================= DUPLICATE CHECK ================= */
  const vehicleAlreadyExists = (vehicleNumber) => {
    return vehicleMasterData.some(
      (v) => v.vehicle_number === vehicleNumber,
    )
  }

  const own_vehicle_type_data = vehicleTypeData.filter((data)=>data.definition_list_name == 'Own')
  console.log(own_vehicle_type_data,'own_vehicle_type_data')

  /* ================= ENABLE / DISABLE SAVE ================= */
  // Removed implicit disabling as per user mandate to allow native feedback loops.
  useEffect(() => {
    setSubmitBtn(false)
  }, [])

  /* ================= HANDLE CHANGE ================= */
  const handleChange = (e) => {
    const { name, value, files } = e.target
    let val = files ? files[0] : String(value)

    if (files && files[0]) {
      if (files[0].size > 5 * 1024 * 1024) {
        toast.warning('File size must not exceed 5MB')
        e.target.value = ''
        return
      }
    }

    if (name === 'vehicleNumber') {
      val = val.replace(/[^a-zA-Z0-9]/g, '').toUpperCase()
    }

    setValues((prev) => ({
      ...prev,
      [name]: val,
    }))
  }

  /* ================= SUBMIT ================= */
  const handleSubmit = (e) => {
    e.preventDefault()

    if (!values.vehicleNumber || !values.vehicleCapacity || !values.vehicleBodyType || !values.insuranceValidity || !values.fcValidity) {
      // || !values.vehicleType 
       toast.warning('Please fill all required fields')
       return
    }

    const vehicleRegex = /^[A-Z]{2}\d{2}[A-Z]{1,2}\d{4}$/
    if (!vehicleRegex.test(values.vehicleNumber)) {
       toast.warning('Invalid Vehicle Number Format')
       return
    }

    const todayStr = new Date().toISOString().split('T')[0]
    if (values.insuranceValidity < todayStr) {
       toast.warning('Insurance Validity past date not allowed')
       return
    }
    if (values.fcValidity < todayStr) {
       toast.warning('FC Validity past date not allowed')
       return
    }

    if (vehicleAlreadyExists(values.vehicleNumber)) {
      toast.warning('Vehicle Number already exists!')
      return
    }

    const formData = new FormData()
    formData.append('vehicle_number', values.vehicleNumber)
    formData.append('vehicle_capacity_id', values.vehicleCapacity)
    formData.append('vehicle_body_type_id', values.vehicleBodyType)
    formData.append('vehicle_type_id',own_vehicle_type_data[0].definition_list_id)

    if (values.rcFront) formData.append('rc_copy_front', values.rcFront)
    if (values.rcBack) formData.append('rc_copy_back', values.rcBack)
    if (values.insFront) formData.append('insurance_copy_front', values.insFront)
    if (values.insBack) formData.append('insurance_copy_back', values.insBack)
    formData.append('insurance_validity', values.insuranceValidity)
    formData.append('fc_validity', values.fcValidity)

    NlmtVehicleMasterService.createNlmtVehicles(formData)
      .then(() => {
        toast.success('Vehicle Created Successfully')
        navigate('/NlmtVehicleMasterTable')
      })
      .catch((err) => {
        let msg = ''
        const errors = err.response?.data?.errors || {}
        Object.keys(errors).forEach((k) => {
          msg += `${errors[k]}\n`
        })
        setErrorMsg(msg || 'Something went wrong')
        setErrorModal(true)
      })
  }

  if (loading) return <Loader />

  /* ================= JSX ================= */
  return (
    <>
      <CCard className="p-3">
        <CForm onSubmit={handleSubmit}>
          <CRow className="g-3">

            <CCol md={3}>
              <CFormLabel>Vehicle Number<REQ /></CFormLabel>
              <CFormInput
                name="vehicleNumber"
                maxLength={10}
                value={values.vehicleNumber}
                onChange={handleChange}
              />
            </CCol>
            {/* <CCol md={3}>
              <CFormLabel>Vehicle Type<REQ /></CFormLabel>
              <CFormSelect
                name="vehicleType"
                value={values.vehicleType}
                onChange={handleChange}
              >
                <option value="">Select</option>
                {vehicleTypeData.map(({ definition_list_id, definition_list_name }) => (
                  <option
                    key={definition_list_id}
                    value={String(definition_list_id)}
                  >
                    {definition_list_name}
                  </option>
                ))}
              </CFormSelect>
            </CCol> */}

            <CCol md={3}>
              <CFormLabel>Vehicle Capacity<REQ /></CFormLabel>
              <CFormSelect
                name="vehicleCapacity"
                value={values.vehicleCapacity}
                onChange={handleChange}
              >
                <option value="">Select</option>
                {vehicleCapacityData.map(({ definition_list_id, definition_list_name }) => (
                  <option
                    key={definition_list_id}
                    value={String(definition_list_id)}
                  >
                    {definition_list_name}
                  </option>
                ))}
              </CFormSelect>
            </CCol>

            <CCol md={3}>
              <CFormLabel>Vehicle Body Type<REQ /></CFormLabel>
              <CFormSelect
                name="vehicleBodyType"
                value={values.vehicleBodyType}
                onChange={handleChange}
              >
                <option value="">Select</option>
                {vehicleBodyTypeData.map(({ definition_list_id, definition_list_name }) => (
                  <option
                    key={definition_list_id}
                    value={String(definition_list_id)}
                  >
                    {definition_list_name}
                  </option>
                ))}
              </CFormSelect>
            </CCol>



            <CCol md={3}>
              <CFormLabel>RC Copy Front</CFormLabel>
              <CFormInput type="file" name="rcFront"  accept=".jpg,.jpeg,.png,.pdf"  onChange={handleChange} />
              {values.rcFront && (
    <small className="text-success">{values.rcFront.name}</small>
  )}
            </CCol>

            <CCol md={3}>
              <CFormLabel>RC Copy Back</CFormLabel>
              <CFormInput type="file" name="rcBack"  accept=".jpg,.jpeg,.png,.pdf"  onChange={handleChange} />
                {values.rcBack && (
    <small className="text-success">{values.rcBack.name}</small>
  )}
            </CCol>

            <CCol md={3}>
              <CFormLabel>Insurance Copy Front</CFormLabel>
              <CFormInput type="file" name="insFront"  accept=".jpg,.jpeg,.png,.pdf" onChange={handleChange} />
              {values.insFront && (
    <small className="text-success">{values.insFront.name}</small>
  )}
            </CCol>

            <CCol md={3}>
              <CFormLabel>Insurance Copy Back</CFormLabel>
              <CFormInput type="file"  accept=".jpg,.jpeg,.png,.pdf" name="insBack" onChange={handleChange} />
              {values.insBack && (
    <small className="text-success">{values.insBack.name}</small>
  )}
            </CCol>

            <CCol md={3}>
              <CFormLabel>Insurance Validity<REQ /></CFormLabel>
              <CFormInput
                type="date"
                name="insuranceValidity"
                value={values.insuranceValidity}
                onChange={handleChange}
              />
            </CCol>

            <CCol md={3}>
              <CFormLabel>FC Validity<REQ /></CFormLabel>
              <CFormInput
                type="date"
                name="fcValidity"
                value={values.fcValidity}
                onChange={handleChange}
              />
            </CCol>

            <CCol md={12} className="text-end">
              <CButton color="warning" type="submit" disabled={submitBtn}>
                Submit
              </CButton>
              <Link to="/NlmtVehicleMasterTable">
                <CButton color="secondary" className="ms-2">
                  BACK
                </CButton>
              </Link>
            </CCol>

          </CRow>
        </CForm>
      </CCard>

      <CModal visible={errorModal} onClose={() => setErrorModal(false)}>
        <CModalHeader>
          <CModalTitle>Error</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CAlert color="danger" style={{ whiteSpace: 'pre-line' }}>
            {errorMsg}
          </CAlert>
        </CModalBody>
        <CModalFooter>
          <CButton onClick={() => setErrorModal(false)}>Close</CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}

export default NlmtVehicleMaster
