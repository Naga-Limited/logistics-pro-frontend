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
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CCardImage,
} from '@coreui/react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import Loader from 'src/components/Loader'
import useForm from 'src/Hooks/useForm'
import NlmtVehicleMasterService from 'src/Service/Nlmt/Masters/NlmtVehicleMasterService'
import NlmtDefinitionsListApi from 'src/Service/Nlmt/Masters/NlmtDefinitionsListApi'
import NlmtVehicleMasterValidation from 'src/Utils/Nlmt/Masters/NlmtVehicleMasterValidation'

const REQ = () => <span className="text-danger"> * </span>

const NlmtVehicleMasterEdit = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [mastersLoaded, setMastersLoaded] = useState(false)
  const [vehicleType, setVehicleType] = useState([])
  const [vehicleCapacity, setVehicleCapacity] = useState([])
  const [vehicleBody, setVehicleBody] = useState([])
  //const [vehicleVariety, setVehicleVariety] = useState([])
  const [vehicleGroup, setVehicleGroup] = useState([])
  const [singleVehicle, setSingleVehicle] = useState({})

  /* ===== ATTACHMENT STATES (SAME AS VehicleMasterEdit) ===== */
  const [RCCopyFront, setRCCopyFront] = useState(false)
  const [RCCopyBack, setRCCopyBack] = useState(false)
  const [InsuranceCopyFront, setInsuranceCopyFront] = useState(false)
  const [InsuranceCopyBack, setInsuranceCopyBack] = useState(false)

  const [RCCopyFrontDel, setRCCopyFrontDel] = useState(true)
  const [RCCopyBackDel, setRCCopyBackDel] = useState(true)
  const [InsuranceCopyFrontDel, setInsuranceCopyFrontDel] = useState(true)
  const [InsuranceCopyBackDel, setInsuranceCopyBackDel] = useState(true)

  const formValues = {
    vechileNumber: '',
    VehicleType: '',
    VehicleCapacity: '',
    VehicleBodyType: '',
    VehicleVariety: '',
    VehicleGroup: '',
    InsuranceValidity: '',
    FCValidity: '',
    RCCopyFront: '',
    RCCopyBack: '',
    InsuranceCopyFront: '',
    InsuranceCopyBack: '',
  }

  const { values, setValues, errors, handleSubmit, isTouched } = useForm(
    updateVehicle,
    NlmtVehicleMasterValidation,
    formValues
  )

  /* ===== LOAD MASTER DATA ===== */
  useEffect(() => {
    Promise.all([
      NlmtDefinitionsListApi.visibleNlmtDefinitionsListByDefinition(2),// Vehicle Capacity
      NlmtDefinitionsListApi.visibleNlmtDefinitionsListByDefinition(1),// Vehicle Body Type
      NlmtDefinitionsListApi.visibleNlmtDefinitionsListByDefinition(3),// Vehicle Type
    ]).then(([cap, body, type]) => {
      setVehicleCapacity(cap.data.data || [])
      setVehicleBody(body.data.data || [])
      setVehicleType(type.data.data || [])
      setMastersLoaded(true)
    })
  }, [])

  /* ===== LOAD VEHICLE ===== */
  useEffect(() => {
    if (!mastersLoaded) return

    NlmtVehicleMasterService.getNlmtVehiclesById(id).then((res) => {
      const v = res.data.data
      setSingleVehicle(v)
      setValues({
        vechileNumber: v.vehicle_number,
        VehicleType: String(v.vehicle_type_info?.definition_list_id || ''),
        VehicleCapacity: String(v.vehicle_capacity_info?.definition_list_id || ''),
        VehicleBodyType: String(v.vehicle_body_type_info?.definition_list_id || ''),
        VehicleVariety: String(v.vehicle_variety_info?.definition_list_id || ''),
        VehicleGroup: String(v.vehicle_group_info?.definition_list_id || ''),
        InsuranceValidity: v.insurance_validity_db,
        FCValidity: v.fc_validity_db,
      })
      setLoading(false)
    })
  }, [mastersLoaded, id, setValues])

  /* ===== CHANGE ===== */
  const handleChange = (e) => {
    const { name, value, files, type } = e.target
    
    if (type === 'file' && files[0]) {
      if (files[0].size > 5 * 1024 * 1024) {
        toast.warning('File size must not exceed 5MB')
        e.target.value = '' // clear UI input
        return
      }
    }

    if (name === 'vechileNumber') {
       e.target.value = String(value).replace(/[^a-zA-Z0-9]/g, '').toUpperCase()
    }

    setValues((prev) => ({
      ...prev,
      [name]: type === 'file' ? files[0] : e.target.value,
    }))
  }

  /* ===== FORM VALID ===== */
  const isFormValid =
    values.vechileNumber &&
    values.VehicleType &&
    values.VehicleCapacity &&
    values.VehicleBodyType &&
    values.InsuranceValidity &&
    values.FCValidity &&
    (RCCopyFrontDel || values.RCCopyFront) &&
    (RCCopyBackDel || values.RCCopyBack) &&
    (InsuranceCopyFrontDel || values.InsuranceCopyFront) &&
    (InsuranceCopyBackDel || values.InsuranceCopyBack) &&
    Object.keys(errors).length === 0

  /* ===== UPDATE ===== */
  function updateVehicle() {
    const formData = new FormData()
    formData.append('_method', 'PUT')
    formData.append('vehicle_number', values.vechileNumber)
    formData.append('vehicle_type_id', values.VehicleType)
    formData.append('vehicle_capacity_id', values.VehicleCapacity)
    formData.append('vehicle_body_type_id', values.VehicleBodyType)
    formData.append('insurance_validity', values.InsuranceValidity)
    formData.append('fc_validity', values.FCValidity)

    if (!RCCopyFrontDel && values.RCCopyFront)
      formData.append('rc_copy_front', values.RCCopyFront)
    if (!RCCopyBackDel && values.RCCopyBack)
      formData.append('rc_copy_back', values.RCCopyBack)
    if (!InsuranceCopyFrontDel && values.InsuranceCopyFront)
      formData.append('insurance_copy_front', values.InsuranceCopyFront)
    if (!InsuranceCopyBackDel && values.InsuranceCopyBack)
      formData.append('insurance_copy_back', values.InsuranceCopyBack)

    NlmtVehicleMasterService.updateNlmtVehicles(id, formData).then(() => {
      toast.success('Vehicle Updated Successfully')
      navigate('/NlmtVehicleMasterTable')
    })
  }

  if (loading) return <Loader />

  return (
    <CCard className="p-3">
      <CForm onSubmit={handleSubmit}>
        <CRow className="g-3">

          {/* ===== BASIC DETAILS ===== */}
          <CCol md={3}>
            <CFormLabel>Vehicle Number<REQ /></CFormLabel>
            <CFormInput 
              name="vechileNumber" 
              maxLength={10}
              value={values.vechileNumber} 
              onChange={handleChange} 
            />
            {errors.vechileNumber && (
               <small className="text-danger">{errors.vechileNumber}</small>
            )}
          </CCol>

          <CCol md={3}>
            <CFormLabel>Vehicle Type<REQ /></CFormLabel>
            <CFormSelect name="VehicleType" value={values.VehicleType} onChange={handleChange}>
              <option value="">Select</option>
              {vehicleType.map(d => (
                <option key={d.definition_list_id} value={d.definition_list_id}>
                  {d.definition_list_name}
                </option>
              ))}
            </CFormSelect>
          </CCol>

          <CCol md={3}>
            <CFormLabel>Vehicle Capacity<REQ /></CFormLabel>
            <CFormSelect name="VehicleCapacity" value={values.VehicleCapacity} onChange={handleChange}>
              <option value="">Select</option>
              {vehicleCapacity.map(d => (
                <option key={d.definition_list_id} value={d.definition_list_id}>
                  {d.definition_list_name}
                </option>
              ))}
            </CFormSelect>
          </CCol>

          <CCol md={3}>
            <CFormLabel>Vehicle Body Type<REQ /></CFormLabel>
            <CFormSelect name="VehicleBodyType" value={values.VehicleBodyType} onChange={handleChange}>
              <option value="">Select</option>
              {vehicleBody.map(d => (
                <option key={d.definition_list_id} value={d.definition_list_id}>
                  {d.definition_list_name}
                </option>
              ))}
            </CFormSelect>
          </CCol>

          {/* ===== ATTACHMENTS ===== */}
          {[
            ['RCCopyFront', 'RC Copy Front', RCCopyFrontDel, setRCCopyFrontDel, setRCCopyFront],
            ['RCCopyBack', 'RC Copy Back', RCCopyBackDel, setRCCopyBackDel, setRCCopyBack],
            ['InsuranceCopyFront', 'Insurance Copy Front', InsuranceCopyFrontDel, setInsuranceCopyFrontDel, setInsuranceCopyFront],
            ['InsuranceCopyBack', 'Insurance Copy Back', InsuranceCopyBackDel, setInsuranceCopyBackDel, setInsuranceCopyBack],
          ].map(([name, label, del, setDel, setView]) => (
            <CCol md={3} key={name}>
              <CFormLabel>{label}<REQ /></CFormLabel>
              {del ? (
                <CButton size="sm" className="w-100 d-flex justify-content-between" color="info">
                  <span
                    className="d-flex align-items-center"
                    style={{ cursor: 'pointer' }}
                    onClick={() => setView(true)}
                  >
                    <i className="fa fa-eye me-1" aria-hidden="true"></i>
                    View
                  </span>
                  <span
                    className="d-flex align-items-center"
                    style={{ cursor: 'pointer' }}
                    onClick={() => setDel(false)}
                  >
                    <i className="fa fa-trash me-1" aria-hidden="true"></i>

                  </span>
                </CButton>
              ) : (
                <CFormInput type="file" name={name} onChange={handleChange} />
              )}
            </CCol>
          ))}

          <CCol md={3}>
            <CFormLabel>Insurance Validity<REQ /></CFormLabel>
            <CFormInput type="date" name="InsuranceValidity" value={values.InsuranceValidity} onChange={handleChange} />
            {errors.InsuranceValidity && (
              <small className="text-danger">{errors.InsuranceValidity}</small>
            )}
          </CCol>

          <CCol md={3}>
            <CFormLabel>FC Validity<REQ /></CFormLabel>
            <CFormInput type="date" name="FCValidity" value={values.FCValidity} onChange={handleChange} />
            {errors.FCValidity && (
              <small className="text-danger">{errors.FCValidity}</small>
            )}
          </CCol>

          <CCol md={12} className="text-end">
            <CButton type="submit" color="warning">
              UPDATE
            </CButton>
            <Link to="/NlmtVehicleMasterTable">
              <CButton className="ms-2" color="secondary">BACK</CButton>
            </Link>
          </CCol>

        </CRow>
      </CForm>

      {/* ===== VIEW MODALS ===== */}
      <CModal visible={RCCopyFront} onClose={() => setRCCopyFront(false)}>
        <CModalHeader><CModalTitle>RC Copy Front</CModalTitle></CModalHeader>
        <CModalBody><CCardImage src={singleVehicle.rc_copy_front} /></CModalBody>
      </CModal>

      <CModal visible={RCCopyBack} onClose={() => setRCCopyBack(false)}>
        <CModalHeader><CModalTitle>RC Copy Back</CModalTitle></CModalHeader>
        <CModalBody><CCardImage src={singleVehicle.rc_copy_back} /></CModalBody>
      </CModal>

      <CModal visible={InsuranceCopyFront} onClose={() => setInsuranceCopyFront(false)}>
        <CModalHeader><CModalTitle>Insurance Copy Front</CModalTitle></CModalHeader>
        <CModalBody><CCardImage src={singleVehicle.insurance_copy_front} /></CModalBody>
      </CModal>

      <CModal visible={InsuranceCopyBack} onClose={() => setInsuranceCopyBack(false)}>
        <CModalHeader><CModalTitle>Insurance Copy Back</CModalTitle></CModalHeader>
        <CModalBody><CCardImage src={singleVehicle.insurance_copy_back} /></CModalBody>
      </CModal>

    </CCard>
  )
}

export default NlmtVehicleMasterEdit
