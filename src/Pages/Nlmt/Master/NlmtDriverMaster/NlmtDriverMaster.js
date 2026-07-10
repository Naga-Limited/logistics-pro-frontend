/* eslint-disable prettier/prettier */
import {
  CButton,
  CCard,
  CCol,
  CAlert,
  CForm,
  CFormInput,
  CFormLabel,
  CRow,
  CTabContent,
  CTabPane,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
} from '@coreui/react'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import useForm from 'src/Hooks/useForm'
import Loader from 'src/components/Loader'
import NlmtDriverMasterService from 'src/Service/Nlmt/Masters/NlmtDriverMasterService'
import NlmtDriverMasterValidation from 'src/Utils/Nlmt/Masters/NlmtDriverMasterValidation'

const NlmtDriverMaster = () => {
  const navigation = useNavigate()

  const initialValues = {
    driverName: '',
    driverCode: '',
    driverMobile1: '',
    driverMobile2: '',
    licenseNumber: '',
    licenseValidDate: '',
    licenseValidityStatus: 'No',
    driverAddress: '',
  }


  const [driverMasterData, setDriverMasterData] = useState([])
  const [loading, setLoading] = useState(true)
  const [errorModal, setErrorModal] = useState(false)
  const [error, setError] = useState('')

  const [files, setFiles] = useState({
    licenseCopyFront: null,
    licenseCopyBack: null,
    aadharCard: null,
    panCard: null,
    driverPhoto: null,
  })

  const REQ = () => <span className="text-danger"> *</span>

  const {
    values,
    errors,
    handleChange,
    handleSubmit,
    onFocus,
    onBlur,
  } = useForm(addNewDriver, NlmtDriverMasterValidation, initialValues)

  useEffect(() => {
    NlmtDriverMasterService.getNlmtDrivers().then((res) => {
      setDriverMasterData(res.data.data)
      setLoading(false)
    })
  }, [])

  const handleFileChange = (e) => {
    const { name, files } = e.target
    setFiles((prev) => ({
      ...prev,
      [name]: files[0],
    }))
  }
  const isSubmitDisabled = values.licenseValidityStatus !== 'Yes'

  const driverAlreadyExist = (code) => {
    if (!code || driverMasterData.length === 0) return false

    return driverMasterData.some(
      (d) =>
        d.driver_code?.toString().trim().toLowerCase() ===
        code.toString().trim().toLowerCase()
    )
  }

  function addNewDriver() {
    if (
      !files.licenseCopyFront ||
      !files.licenseCopyBack ||
      !files.aadharCard ||
      !files.panCard ||
      !files.driverPhoto
    ) {
      toast.error('All attachments are required')
      return
    }

    if (driverAlreadyExist(values.driverCode)) {
      toast.warning('Entered Driver Code already exists')
      return
    }

    const formData = new FormData()
    formData.append('driver_name', values.driverName)
    formData.append('driver_code', values.driverCode)
    formData.append('driver_phone_1', values.driverMobile1)
    formData.append('driver_phone_2', values.driverMobile2)
    formData.append('license_no', values.licenseNumber)
    formData.append('license_validity_to', values.licenseValidDate)
    formData.append('license_validity_status', values.licenseValidityStatus === 'Yes' ? 1 : 0)
    formData.append('driver_address', values.driverAddress)

    // FILES
    formData.append('license_copy_front', files.licenseCopyFront)
    formData.append('license_copy_back', files.licenseCopyBack)
    formData.append('aadhar_card', files.aadharCard)
    formData.append('pan_card', files.panCard)
    formData.append('driver_photo', files.driverPhoto)

    NlmtDriverMasterService.createNlmtDrivers(formData)
      .then((res) => {
        toast.success('Driver Created Successfully')
        setTimeout(() => navigation('/NlmtDriverMasterTable'), 1000)
      })
      .catch((err) => {
        if (err.response && err.response.data) {
          const { message, errors } = err.response.data

          if (message) {
            toast.error(message)
          }

          if (errors) {
            Object.values(errors).forEach((fieldErrors) => {
              fieldErrors.forEach((msg) => toast.error(msg))
            })
          }
        } else {
          toast.error('Something went wrong. Please try again.')
        }
      })
  }

  if (loading) return <Loader />

  return (
    <>
      <ToastContainer />
      <CCard className="p-2 border-3">

        <CTabContent>
          <CTabPane visible>
            <CForm className="row g-3" onSubmit={handleSubmit}>

              {/* DRIVER NAME */}
              <CCol md={3}>
                <CFormLabel>
                  Driver Name <REQ /> {errors.driverName && <span className="text-danger">{errors.driverName}</span>}
                </CFormLabel>
                <CFormInput name="driverName" maxLength={40} value={values.driverName} onChange={(e) => { e.target.value = e.target.value.replace(/[^a-zA-Z\s]/g, ''); handleChange(e); }} />
              </CCol>

              {/* DRIVER CODE */}
              <CCol md={3}>
                <CFormLabel>
                  Driver Code <REQ /> {errors.driverCode && <span className="text-danger">{errors.driverCode}</span>}
                </CFormLabel>
                <CFormInput name="driverCode" maxLength={6} value={values.driverCode} onChange={(e) => { e.target.value = e.target.value.replace(/[^0-9]/g, ''); handleChange(e); }} />
              </CCol>

              {/* MOBILE */}
              <CCol md={3}>
                <CFormLabel>
                  Mobile 1 <REQ /> {errors.driverMobile1 && <span className="text-danger">{errors.driverMobile1}</span>}
                </CFormLabel>
                <CFormInput name="driverMobile1" maxLength={10} value={values.driverMobile1} onChange={(e) => { e.target.value = e.target.value.replace(/[^0-9]/g, ''); handleChange(e); }} />
              </CCol>

              <CCol md={3}>
                <CFormLabel>
                  Mobile 2 <REQ /> {errors.driverMobile2 && <span className="text-danger">{errors.driverMobile2}</span>}
                </CFormLabel>
                <CFormInput name="driverMobile2" maxLength={10} value={values.driverMobile2} onChange={(e) => { e.target.value = e.target.value.replace(/[^0-9]/g, ''); handleChange(e); }} />
              </CCol>

              {/* LICENSE */}
              <CCol md={3}>
                <CFormLabel>
                  License No <REQ /> {errors.licenseNumber && <span className="text-danger">{errors.licenseNumber}</span>}
                </CFormLabel>
                <CFormInput name="licenseNumber" maxLength={16} value={values.licenseNumber} onChange={handleChange} />
              </CCol>

              <CCol md={3}>
                <CFormLabel>
                  License Valid To <REQ /> {errors.licenseValidDate && <span className="text-danger small">{errors.licenseValidDate}</span>}
                </CFormLabel>
                <CFormInput type="date" name="licenseValidDate" value={values.licenseValidDate} onChange={handleChange} />
              </CCol>

              {/* FILES */}
              {[
                ['licenseCopyFront', 'License Front'],
                ['licenseCopyBack', 'License Back'],
                ['aadharCard', 'Aadhar Card'],
                ['panCard', 'PAN Card'],
                ['driverPhoto', 'Driver Photo'],
              ].map(([name, label]) => (
                <CCol md={3} key={name}>
                  <CFormLabel>{label} <REQ /></CFormLabel>
                  <CFormInput
                    type="file"
                    name={name}
                    accept=".jpg,.jpeg,.png,.pdf"
                    onChange={handleFileChange}
                  />
                  {files[name] && (
                    <small className="text-success">{files[name].name}</small>
                  )}
                </CCol>
              ))}

              <CCol md={3}>
                <CFormLabel htmlFor="licenseValidityStatus">
                  License Validity Status <REQ />{' '}
                  {errors.licenseValidityStatus && (
                    <span className="small text-danger">{errors.licenseValidityStatus}</span>
                  )}
                </CFormLabel>
                <CFormInput
                  name="licenseValidityStatus"
                  size="sm"
                  maxLength={10}
                  id="licenseValidityStatus"
                  onChange={handleChange}
                  value={values.licenseValidityStatus}
                  onFocus={onFocus}
                  onBlur={onBlur}
                  placeholder=""
                  readOnly

                />
              </CCol>

              {/* ADDRESS */}
              <CCol md={6}>
                <CFormLabel>
                  Driver Address <REQ />
                </CFormLabel>
                <CFormInput name="driverAddress" value={values.driverAddress} onChange={handleChange} />
              </CCol>

                  <CCol xs={12} className="text-end">
                    <CButton color="warning" type="submit" className="text-white mx-2">
                      Submit
                    </CButton>


                    <Link to="/NlmtDriverMasterTable">
                      <CButton color="secondary">Cancel</CButton>
                    </Link>
                  </CCol>
               {isSubmitDisabled && (
  <small className="text-danger d-block mt-1">

  </small>
  )}
            </CForm>
          </CTabPane>
        </CTabContent>
      </CCard>

      {/* ERROR MODAL */}
      <CModal visible={errorModal} onClose={() => setErrorModal(false)}>
        <CModalHeader>
          <CModalTitle>Error</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CAlert color="danger">{error}</CAlert>
        </CModalBody>
        <CModalFooter>
          <CButton onClick={() => setErrorModal(false)}>Close</CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}

export default NlmtDriverMaster
