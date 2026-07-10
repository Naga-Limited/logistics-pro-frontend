/* eslint-disable prettier/prettier */
import {
  CButton,
  CCard,
  CCol,
  CAlert,
  CContainer,
  CForm,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CNav,
  CNavItem,
  CNavLink,
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
import { React, useEffect, useState } from 'react'
import useForm from 'src/Hooks/useForm.js'
import DieselVendorMasterValidation from '../../../Utils/Master/DieselVendorMasterValidation'
import { useParams } from 'react-router-dom'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import DieselVendorMasterService from 'src/Service/Master/DieselVendorMasterService'
import { getCurrentDateTime } from 'src/Pages/Depo/CommonMethods/CommonMethods'

const getOldLogInfo = (log_info) => {
  try {
    return log_info ? JSON.parse(log_info) : []
  } catch (e) {
    return []
  }
}

const DieselVendorMasterEdit = () => {
  const { id } = useParams()
  const [errorModal, setErrorModal] = useState(false)
  const [dieselVendorInfo, setDieselVendorInfo] = useState(false)
  const [singleVendorInfo, setSingleVendorInfo] = useState(null)

  const [error, setError] = useState({})
  const user_info_json = localStorage.getItem('user_info')
  const user_info = user_info_json ? JSON.parse(user_info_json) : null
  const user_id = user_info && user_info.user_id ? user_info.user_id : 0

  const formValues = {
    dieselVendorName: '',
    dieselVendorCode: '',
    dieselVendorMobile1: '',
    dieselVendorMobile2: '',
    dieselVendorMail: '',
  }

  const navigation = useNavigate()

  const { values, errors, handleChange, onFocus, handleSubmit, enableSubmit, onBlur } = useForm(
    addNewDieselVendor,
    DieselVendorMasterValidation,
    formValues
  )

  function addNewDieselVendor() {
    const formData = new FormData()

    formData.append('_method', 'PUT')
    formData.append('diesel_vendor_name', values.dieselVendorName)
    formData.append('vendor_code', values.dieselVendorCode)
    formData.append('vendor_phone_1', values.dieselVendorMobile1)
    formData.append('vendor_phone_2', values.dieselVendorMobile2)
    formData.append('vendor_email_id', values.dieselVendorMail)

    let current_time = getCurrentDateTime()
    let current_info = getOldLogInfo(singleVendorInfo ? singleVendorInfo.log_info : null)
    current_info.push({
      diesel_vendor_name: values.dieselVendorName,
      vendor_code: values.dieselVendorCode,
      vendor_phone_1: values.dieselVendorMobile1,
      vendor_phone_2: values.dieselVendorMobile2,
      vendor_email: values.dieselVendorMail,
      type: 2,
      user: user_info.emp_name || user_id,
      time: current_time,
      remarks: '',
    })
    formData.append('log_info', JSON.stringify(current_info))

    DieselVendorMasterService.updateDieselVendors(id, formData)
      .then((res) => {
        console.log(res)
        if (res.status === 200) {
          toast.success('Diesel Vendor Updated Successfully!')

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

  useEffect(() => {
    DieselVendorMasterService.getDieselVendorsById(id).then((res) => {
      values.dieselVendorName = res.data.data.diesel_vendor_name
      values.dieselVendorCode = res.data.data.vendor_code
      values.dieselVendorMobile1 = res.data.data.vendor_phone_1
      values.dieselVendorMobile2 = res.data.data.vendor_phone_2
      values.dieselVendorMail = res.data.data.vendor_email
      setDieselVendorInfo(res.data.data)
      setSingleVendorInfo(res.data.data)
    })
  }, [id])

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
                    maxLength={30}
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
                    // disabled={enableSubmit}
                  >
                    Update
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

export default DieselVendorMasterEdit
