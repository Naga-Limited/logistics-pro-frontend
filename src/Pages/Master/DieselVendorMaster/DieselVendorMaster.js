/* eslint-disable prettier/prettier */
import {
  CButton,
  CCard,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CNav,
  CNavItem,
  CNavLink,
  CAlert,
  CRow,
  CTabContent,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CTabPane,
  CFormFloating,
  CFormCheck,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
} from '@coreui/react'
import { React, useState } from 'react'
import useForm from 'src/Hooks/useForm.js'
import DieselVendorMasterValidation from '../../../Utils/Master/DieselVendorMasterValidation'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import DieselVendorMasterService from 'src/Service/Master/DieselVendorMasterService'

const DieselVendorMaster = () => {
  const formValues = {
    dieselVendorName: '',
    dieselVendorCode: '',
    dieselVendorMobile1: '',
    dieselVendorMobile2: '',
    dieselVendorMail: '',
  }

  const navigation = useNavigate()
  const [errorModal, setErrorModal] = useState(false)
  const [error, setError] = useState({})

  const { values, errors, handleChange, onFocus, handleSubmit, enableSubmit, onBlur } = useForm(
    addNewDieselVendor,
    DieselVendorMasterValidation,
    formValues
  )

  function addNewDieselVendor() {
    const formData = new FormData()

    formData.append('diesel_vendor_name', values.dieselVendorName)
    formData.append('vendor_code', values.dieselVendorCode)
    formData.append('vendor_phone_1', values.dieselVendorMobile1)
    formData.append('vendor_phone_2', values.dieselVendorMobile2)
    formData.append('vendor_email_id', values.dieselVendorMail)

    DieselVendorMasterService.createDieselVendors(formData)
      .then((res) => {
        if (res.status === 201) {
          toast.success('Diesel Vendor Created Successfully!')

          setTimeout(() => {
            navigation('/DieselVendorMasterTable')
          }, 1000)
        }
      })
      .catch((error) => {
        var object = error.response.data.errors
        var output = ''
        for (var property in object) {
          output += '*' + object[property] + '\n'
        }
        setError(output)
        setErrorModal(true)
      })
  }

  return (
    <>
      <CCard>
        <CTabContent>
          <CTabPane role="tabpanel" aria-labelledby="home-tab" visible={true}>
            <CForm className="row g-3 m-2 p-1" onSubmit={handleSubmit}>
              <CRow className="mb-md-1">
                <CCol md={3}>
                  <CFormLabel htmlFor="dvName">
                    Diesel Vendor Name*
                    {errors.dieselVendorName && (
                      <span className="small text-danger">{errors.dieselVendorName}</span>
                    )}
                  </CFormLabel>
                  <CFormInput
                    name="dieselVendorName"
                    size="sm"
                    maxLength={20}
                    id="dvName"
                    onChange={handleChange}
                    value={values.dieselVendorName}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    placeholder=""
                  />
                </CCol>
                <CCol md={3}>
                  <CFormLabel htmlFor="dvCode">
                    Diesel Vendor Code*
                    {errors.dieselVendorCode && (
                      <span className="small text-danger">{errors.dieselVendorCode}</span>
                    )}
                  </CFormLabel>
                  <CFormInput
                    name="dieselVendorCode"
                    size="sm"
                    maxLength={6}
                    id="dvCode"
                    onChange={handleChange}
                    value={values.dieselVendorCode}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    placeholder=""
                  />
                </CCol>
                <CCol md={3}>
                  <CFormLabel htmlFor="dvMobile1">
                    Diesel Vendor Mobile Number 1*
                    {errors.dieselVendorMobile1 && (
                      <span className="small text-danger">{errors.dieselVendorMobile1}</span>
                    )}
                  </CFormLabel>
                  <CFormInput
                    name="dieselVendorMobile1"
                    size="sm"
                    maxLength={10}
                    id="dvMobile1"
                    onChange={handleChange}
                    value={values.dieselVendorMobile1}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    placeholder=""
                  />
                </CCol>
                <CCol md={3}>
                  <CFormLabel htmlFor="dvMobile2">
                    Diesel Vendor Mobile Number 2*
                    {errors.dieselVendorMobile2 && (
                      <span className="small text-danger">{errors.dieselVendorMobile2}</span>
                    )}
                  </CFormLabel>
                  <CFormInput
                    name="dieselVendorMobile2"
                    size="sm"
                    maxLength={10}
                    id="dvMobile2"
                    onChange={handleChange}
                    value={values.dieselVendorMobile2}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    placeholder=""
                  />
                </CCol>
              </CRow>
              <CRow className="mb-md-1">
                <CCol md={3}>
                  <CFormLabel htmlFor="dvMail">
                    Diesel Vendor Mail ID*
                    {errors.dieselVendorMail && (
                      <span className="small text-danger">{errors.dieselVendorMail}</span>
                    )}
                  </CFormLabel>
                  <CFormInput
                    name="dieselVendorMail"
                    size="sm"
                    maxLength={30}
                    id="dvMail"
                    onChange={handleChange}
                    value={values.dieselVendorMail}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    placeholder=""
                  />
                </CCol>
              </CRow>

              <CRow className="mb-md-1">
                <CCol
                  className="pull-right"
                  xs={12}
                  sm={12}
                  md={12}
                  style={{ display: 'flex', justifyContent: 'flex-end' }}
                >
                  <CButton
                    size="s-lg"
                    color="warning"
                    className="mx-1 px-2 text-white"
                    type="submit"
                    disabled={enableSubmit}
                  >
                    Submit
                  </CButton>
                  <Link to={'/DieselVendorMasterTable'}>
                    <CButton
                      size="s-lg"
                      color="warning"
                      className="mx-1 px-2 text-white"
                      type="button"
                    >
                      Cancel
                    </CButton>
                  </Link>
                </CCol>
              </CRow>
            </CForm>
          </CTabPane>
        </CTabContent>
      </CCard>

      {/* Error Modal Section */}
      <CModal visible={errorModal} onClose={() => setErrorModal(false)}>
        <CModalHeader>
          <CModalTitle className="h4">Error</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CRow>
            <CCol>
              {error && (
                <CAlert color="danger" data-aos="fade-down">
                  {error}
                </CAlert>
              )}
            </CCol>
          </CRow>
        </CModalBody>
        <CModalFooter>
          <CButton onClick={() => setErrorModal(false)} color="primary">
            Close
          </CButton>
        </CModalFooter>
      </CModal>
      {/* Error Modal Section */}
    </>
  )
}

export default DieselVendorMaster
