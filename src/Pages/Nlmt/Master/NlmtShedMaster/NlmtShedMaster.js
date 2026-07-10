/* Created by maria vanaraj
   Fixed & refactored by ChatGPT
*/

import {
  CButton,
  CCard,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CRow,
  CTabContent,
  CTabPane,
  CFormTextarea,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CAlert,
} from '@coreui/react'
import React, { useState } from 'react'
import useForm from 'src/Hooks/useForm.js'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import Loader from 'src/components/Loader'
import NlmtShedMasterService from 'src/Service/Nlmt/Masters/NlmtShedMasterService'
import NlmtShedMasterValidation from 'src/Utils/Nlmt/Masters/NlmtShedMasterValidation'

const NlmtShedMaster = () => {
  const navigate = useNavigate()

  const formValues = {
    ShedName: '',
    ShedOwnerName: '',
    ShedOwnerMobileNumber1: '',
    ShedOwnerMobileNumber2: '',
    ShedOwnerAddress: '',
    ShedOwnerPhoto: '',
    PANNumber: '',
    AadharNumber: '',
    GSTNumber: '',
  }

  const REQ = () => <span className="text-danger"> * </span>

  const [loading, setLoading] = useState(false)
  const [errorModal, setErrorModal] = useState(false)
  const [error, setError] = useState('')

  const { values, errors, handleChange, onFocus, handleSubmit, onBlur } = useForm(
    addNewShed,
    NlmtShedMasterValidation,
    formValues
  )

  /* ===============================
     SUBMIT HANDLER
  =============================== */
  function addNewShed() {
    setLoading(true)

    // Basic validations
    if (!values.ShedName.trim()) {
      toast.warning('Shed Name Required!')
      setLoading(false)
      return
    }

    if (!values.ShedOwnerName.trim()) {
      toast.warning('Shed Owner Name Required!')
      setLoading(false)
      return
    }

    if (!values.ShedOwnerMobileNumber1.trim()) {
      toast.warning('Shed Owner Mobile Number Required!')
      setLoading(false)
      return
    }

    if (!values.ShedOwnerAddress.trim()) {
      toast.warning('Shed Owner Address Required!')
      setLoading(false)
      return
    }

    if (!values.PANNumber.trim()) {
      toast.warning('PAN Number Required!')
      setLoading(false)
      return
    }

    const formData = new FormData()
    formData.append('shed_name', values.ShedName)
    formData.append('shed_owner_name', values.ShedOwnerName)
    formData.append('shed_owner_phone_1', values.ShedOwnerMobileNumber1)
    formData.append('shed_owner_phone_2', values.ShedOwnerMobileNumber2)
    formData.append('shed_owner_address', values.ShedOwnerAddress)
    formData.append('shed_owner_photo', values.ShedOwnerPhoto)
    formData.append('pan_number', values.PANNumber)
    formData.append('shed_adhar_number', values.AadharNumber)
    formData.append('gst_no', values.GSTNumber)

    NlmtShedMasterService.createShed(formData)
      .then((res) => {
        if (res.status === 200) {
          toast.success('Shed Created Successfully!')
          navigate('/NlmtShedMasterTable')
        }
      })
      .catch((err) => {
        console.error(err)
        setError('Something went wrong while creating shed')
        setErrorModal(true)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return (
    <>
      {loading && <Loader />}

      {!loading && (
        <>
          <CCard>
            <CTabContent>
              <CTabPane visible>
                <CForm className="row g-3 m-2 p-1" onSubmit={handleSubmit}>
                  <CRow>
                    <CCol md={3}>
                      <CFormLabel>
                        Shed Name <REQ />
                        {errors.ShedName && (
                          <span className="small text-danger">{errors.ShedName}</span>
                        )}
                      </CFormLabel>
                      <CFormInput
                        name="ShedName"
                        size="sm"
                        onChange={handleChange}
                        value={values.ShedName}
                        onFocus={onFocus}
                        onBlur={onBlur}
                      />
                    </CCol>

                    <CCol md={3}>
                      <CFormLabel>
                        Shed Owner Name <REQ />
                        {errors.ShedOwnerName && (
                          <span className="small text-danger">{errors.ShedOwnerName}</span>
                        )}
                      </CFormLabel>
                      <CFormInput
                        name="ShedOwnerName"
                        size="sm"
                        onChange={(e) => {
                          e.target.value = e.target.value.replace(/[^a-zA-Z\s]/g, '')
                          handleChange(e)
                        }}
                        value={values.ShedOwnerName}
                        onFocus={onFocus}
                        onBlur={onBlur}
                      />
                    </CCol>

                    <CCol md={3}>
                      <CFormLabel>
                        Mobile Number <REQ />
                        {errors.ShedOwnerMobileNumber1 && (
                          <span className="small text-danger">
                            {errors.ShedOwnerMobileNumber1}
                          </span>
                        )}
                      </CFormLabel>
                      <CFormInput
                        name="ShedOwnerMobileNumber1"
                        size="sm"
                        maxLength={10}
                        onChange={(e) => {
                          e.target.value = e.target.value.replace(/[^\d]/g, '')
                          handleChange(e)
                        }}
                        value={values.ShedOwnerMobileNumber1}
                        onFocus={onFocus}
                        onBlur={onBlur}
                      />
                    </CCol>

                    <CCol md={3}>
                      <CFormLabel>Mobile Number 2</CFormLabel>
                      <CFormInput
                        name="ShedOwnerMobileNumber2"
                        size="sm"
                        maxLength={10}
                        onChange={(e) => {
                          e.target.value = e.target.value.replace(/[^\d]/g, '')
                          handleChange(e)
                        }}
                        value={values.ShedOwnerMobileNumber2}
                      />
                    </CCol>

                    <CCol md={3}>
                      <CFormLabel>
                        Address <REQ />
                        {errors.ShedOwnerAddress && (
                          <span className="small text-danger">
                            {errors.ShedOwnerAddress}
                          </span>
                        )}
                      </CFormLabel>
                      <CFormTextarea
                        name="ShedOwnerAddress"
                        size="sm"
                        maxLength={100}
                        onChange={handleChange}
                        value={values.ShedOwnerAddress}
                        onBlur={onBlur}
                      />
                    </CCol>

                    <CCol md={3}>
                      <CFormLabel>Owner Photo</CFormLabel>
                      <CFormInput
                        type="file"
                        name="ShedOwnerPhoto"
                        size="sm"
                        accept=".jpg,.jpeg,.png"
                        onChange={handleChange}
                      />
                    </CCol>

                    <CCol md={3}>
                      <CFormLabel>
                        PAN Number <REQ />
                        {errors.PANNumber && (
                          <span className="small text-danger">{errors.PANNumber}</span>
                        )}
                      </CFormLabel>
                      <CFormInput
                        name="PANNumber"
                        size="sm"
                        maxLength={10}
                        onChange={(e) => {
                          e.target.value = e.target.value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase()
                          handleChange(e)
                        }}
                        value={values.PANNumber}
                      />
                    </CCol>

                    <CCol md={3}>
                      <CFormLabel>Aadhar Number</CFormLabel>
                      <CFormInput
                        name="AadharNumber"
                        size="sm"
                        maxLength={12}
                        onChange={(e) => {
                          e.target.value = e.target.value.replace(/[^a-zA-Z0-9]/g, '')
                          handleChange(e)
                        }}
                        value={values.AadharNumber}
                      />
                    </CCol>

                    <CCol md={3}>
                      <CFormLabel>GST Number</CFormLabel>
                      <CFormInput
                        name="GSTNumber"
                        size="sm"
                        maxLength={15}
                        onChange={(e) => {
                          e.target.value = e.target.value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase()
                          handleChange(e)
                        }}
                        value={values.GSTNumber}
                      />
                    </CCol>
                  </CRow>

                  <CRow className="mt-3">
                    <CCol className="d-flex justify-content-end">
                      <CButton type="submit" color="warning" className="text-white mx-2">
                        Submit
                      </CButton>
                      <Link to="/NlmtShedMasterTable">
                        <CButton color="secondary">Cancel</CButton>
                      </Link>
                    </CCol>
                  </CRow>
                </CForm>
              </CTabPane>
            </CTabContent>
          </CCard>

          {/* Error Modal */}
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
      )}
    </>
  )
}

export default NlmtShedMaster
