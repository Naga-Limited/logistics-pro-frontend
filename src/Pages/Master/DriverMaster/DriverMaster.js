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

import DriverMasterService from 'src/Service/Master/DriverMasterService'
import DriverMasterValidation from '../../../Utils/Master/DriverMasterValidation'
import Loader from 'src/components/Loader'
import { Link, useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import DriverTypeService from 'src/Service/SmallMaster/Drivers/DriverTypeService'
import { getCurrentDateTime } from 'src/Pages/Depo/CommonMethods/CommonMethods'
const DriverMaster = () => {
  const formValues = {
    driverType: '',
    driverName: '',
    driverCode: '',
    driverMobile1: '',
    driverMobile2: '',
    licenseNumber: '',
    licenseValidDate: '',
    licenseCopyFront: '',
    licenseCopyBack: '',
    licenseValidityStatus: 'No',
    aadharCard: '',
    panCard: '',
    driverPhoto: '',
    driverAddress: '',
  }

  /*================== User Id Fetch ======================*/
  const user_info_json = localStorage.getItem('user_info')
  const user_info = user_info_json ? JSON.parse(user_info_json) : null
  const user_id = user_info && user_info.user_id ? user_info.user_id : 0
  /*================== User Id Fetch ======================*/

  const [driverType, setDriverType] = useState([])
  const [driverMasterData, setDriverMasterData] = useState([])
  const [fetch, setFetch] = useState(false)
  const navigation = useNavigate()
  const [errorModal, setErrorModal] = useState(false)
  const [error, setError] = useState({})
  const REQ = () => <span className="text-danger"> * </span>
  const { values, errors, handleChange, onFocus, handleSubmit, enableSubmit, onBlur } = useForm(
    addNewDriver,
    DriverMasterValidation,
    formValues
  )

  function getCurrentDate(separator = '') {
    let newDate = new Date()
    let date = newDate.getDate()
    let month = newDate.getMonth() + 1
    let year = newDate.getFullYear()

    return `${year}${separator}${month < 10 ? `0${month}` : `${month}`}${separator}${date}`
  }

  function addNewDriver() {
    const formData = new FormData()

    if(driverAlreadyExistInDriverMaster(values.driverCode) === 1){
      toast.warning('Entered Driver Code was already exists in Driver Master..!')
      return false
    } 
    setFetch(false)
    formData.append('driver_type_id', values.driverType)
    formData.append('driver_name', values.driverName)
    formData.append('driver_code', values.driverCode)
    formData.append('driver_phone_1', values.driverMobile1)
    formData.append('driver_phone_2', values.driverMobile2)
    formData.append('license_no', values.licenseNumber)
    formData.append('license_validity_to', values.licenseValidDate)
    formData.append('license_copy_front', values.licenseCopyFront)
    formData.append('license_copy_back', values.licenseCopyBack)
    formData.append('license_validity_status', values.licenseValidityStatus == 'Yes' ? 1 : 0)
    formData.append('aadhar_card', values.aadharCard)
    formData.append('pan_card', values.panCard)
    formData.append('driver_photo', values.driverPhoto)
    formData.append('driver_address', values.driverAddress)

    DriverMasterService.createDrivers(formData)
      .then((res) => {
        console.log(res)
        setFetch(true)
        if (res.status === 201) {
          toast.success('Driver Created Successfully!')

          setTimeout(() => {
            navigation('/DriverMasterTable')
          }, 1000)
        }
      })
      .catch((error) => {
        setFetch(true)
        var object = error.response.data.errors
        var output = ''
        for (var property in object) {
          output += '*' + object[property] + '\n'
        }
        setError(output)
        setErrorModal(true)
      })
  }

  const driverAlreadyExistInDriverMaster = (code) => {
    let condition = 0
    driverMasterData.map((vb,lb)=>{
      if(vb.driver_code == code){
        condition = 1
      }
    })

    return condition
  }

  useEffect(() => {
    //section for getting Driver type from database
    DriverTypeService.getDriverTypes().then((res) => {
      console.log(res.data.data,'getDriverTypes')
      setDriverType(res.data.data)
    })
    //section for getting Driver Master from database
    DriverMasterService.getDrivers().then((res) => {
      setFetch(true)
      console.log(res.data.data,'getDrivers')
      setDriverMasterData(res.data.data)
    })
  }, [])

  return (
    <> 
      {!fetch && <Loader />}
      {fetch && (
        <>
          <CCard>
            <CTabContent>
              <CTabPane role="tabpanel" aria-labelledby="home-tab" visible={true}>
                <CForm className="row g-3 m-2 p-1" onSubmit={handleSubmit}>
                  <CRow className="mb-md-1">
                    <CCol md={3}>
                      <CFormLabel htmlFor="driverType">
                        Driver Type <REQ />{' '}
                        {errors.driverType && (
                          <span className="small text-danger">{errors.driverType}</span>
                        )}
                      </CFormLabel>
                      <CFormSelect
                        size="sm"
                        name="driverType"
                        onChange={handleChange}
                        onFocus={onFocus}
                        value={values.vehicleType}
                        className={`mb-1 ${errors.driverType && 'is-invalid'}`}
                        aria-label="Small select example"
                        id="driverType"
                      >
                        <option value="0">Select ...</option>
                        {driverType.map(({ driver_type_id, driver_type }) => {
                          if (driver_type_id <= 2) {
                            return (
                              <>
                                <option key={driver_type_id} value={driver_type_id}>
                                  {driver_type}
                                </option>
                              </>
                            )
                          }
                        })}
                      </CFormSelect>
                    </CCol>
                    <CCol md={3}>
                      <CFormLabel htmlFor="driverName">
                        Driver Name <REQ />{' '}
                        {errors.driverName && (
                          <span className="small text-danger">{errors.driverName}</span>
                        )}
                      </CFormLabel>
                      <CFormInput
                        name="driverName"
                        size="sm"
                        maxLength={30}
                        id="driverName"
                        onChange={handleChange}
                        value={values.driverName}
                        onFocus={onFocus}
                        onBlur={onBlur}
                        placeholder=""
                      />
                    </CCol>
                    <CCol md={3}>
                      <CFormLabel htmlFor="driverCode">
                        Driver Code <REQ />{' '}
                        {errors.driverCode && (
                          <span className="small text-danger">{errors.driverCode}</span>
                        )}
                      </CFormLabel>
                      <CFormInput
                        name="driverCode"
                        size="sm"
                        maxLength={6}
                        id="driverCode"
                        onChange={handleChange}
                        value={values.driverCode}
                        onFocus={onFocus}
                        onBlur={onBlur}
                        placeholder=""
                      />
                    </CCol>
                    <CCol md={3}>
                      <CFormLabel htmlFor="driverMobile1">
                        Driver Mobile Number 1 <REQ />{' '}
                        {errors.driverMobile1 && (
                          <span className="small text-danger">{errors.driverMobile1}</span>
                        )}
                      </CFormLabel>
                      <CFormInput
                        name="driverMobile1"
                        size="sm"
                        maxLength={10}
                        id="driverMobile1"
                        onChange={handleChange}
                        value={values.driverMobile1}
                        onFocus={onFocus}
                        onBlur={onBlur}
                        placeholder=""
                      />
                    </CCol>
                  </CRow>
                  <CRow className="mb-md-1">
                    <CCol md={3}>
                      <CFormLabel htmlFor="driverMobile2">
                        Driver Mobile Number 2 <REQ />{' '}
                        {errors.driverMobile2 && (
                          <span className="small text-danger">{errors.driverMobile2}</span>
                        )}
                      </CFormLabel>
                      <CFormInput
                        name="driverMobile2"
                        size="sm"
                        maxLength={10}
                        id="driverMobile2"
                        onChange={handleChange}
                        value={values.driverMobile2}
                        onFocus={onFocus}
                        onBlur={onBlur}
                        placeholder=""
                      />
                    </CCol>
                    <CCol md={3}>
                      <CFormLabel htmlFor="licenseNumber">
                        License Number <REQ />{' '}
                        {errors.licenseNumber && (
                          <span className="small text-danger">{errors.licenseNumber}</span>
                        )}
                      </CFormLabel>
                      <CFormInput
                        name="licenseNumber"
                        size="sm"
                        maxLength={16}
                        id="licenseNumber"
                        onChange={handleChange}
                        value={values.licenseNumber}
                        onFocus={onFocus}
                        onBlur={onBlur}
                        placeholder=""
                      />
                    </CCol>
                    <CCol md={3}>
                      <CFormLabel htmlFor="licenseValidDate">
                        License Valid To <REQ />{' '}
                        {errors.licenseValidDate && (
                          <span className="small text-danger">{errors.licenseValidDate}</span>
                        )}
                      </CFormLabel>
                      <CFormInput
                        type="date"
                        onBlur={onBlur}
                        onFocus={onFocus}
                        onChange={handleChange}
                        size="sm"
                        required
                        value={values.licenseValidDate}
                        id="licenseValidDate"
                        name="licenseValidDate"
                        placeholder="date"
                      />
                    </CCol>
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
                  </CRow>
                  <CRow className="mb-md-1">
                    <CCol md={3}>
                      <CFormLabel htmlFor="lcFront">
                        License Copy Front <REQ />{' '}
                        {errors.licenseCopyFront && (
                          <span className="small text-danger">{errors.licenseCopyFront}</span>
                        )}
                      </CFormLabel>
                      <CFormInput
                        onBlur={onBlur}
                        onChange={handleChange}
                        type="file"
                        required
                        accept=".jpg,.jpeg,.png,.pdf"
                        name="licenseCopyFront"
                        size="sm"
                        id="lcFront"
                      />
                    </CCol>
                    <CCol md={3}>
                      <CFormLabel htmlFor="lcBack">
                        License Copy Back <REQ />{' '}
                        {errors.licenseCopyBack && (
                          <span className="small text-danger">{errors.licenseCopyBack}</span>
                        )}
                      </CFormLabel>
                      <CFormInput
                        onBlur={onBlur}
                        onChange={handleChange}
                        type="file"
                        required
                        accept=".jpg,.jpeg,.png,.pdf"
                        name="licenseCopyBack"
                        size="sm"
                        id="lcBack"
                      />
                    </CCol>

                    <CCol md={3}>
                      <CFormLabel htmlFor="aadhar">
                        Aadhar Card <REQ />{' '}
                        {errors.aadharCard && (
                          <span className="small text-danger">{errors.aadharCard}</span>
                        )}
                      </CFormLabel>
                      <CFormInput
                        onBlur={onBlur}
                        onChange={handleChange}
                        type="file"
                        required
                        accept=".jpg,.jpeg,.png,.pdf"
                        name="aadharCard"
                        size="sm"
                        id="aadhar"
                      />
                    </CCol>
                    <CCol md={3}>
                      <CFormLabel htmlFor="pan">
                        PAN Card <REQ />{' '}
                        {errors.panCard && <span className="small text-danger">{errors.panCard}</span>}
                      </CFormLabel>
                      <CFormInput
                        onBlur={onBlur}
                        onChange={handleChange}
                        type="file"
                        required
                        accept=".jpg,.jpeg,.png,.pdf"
                        name="panCard"
                        size="sm"
                        id="pan"
                      />
                    </CCol>
                  </CRow>
                  <CRow className="mb-md-1">
                    <CCol md={3}>
                      <CFormLabel htmlFor="driverPhoto">
                        Driver Photo <REQ />{' '}
                        {errors.driverPhoto && (
                          <span className="small text-danger">{errors.driverPhoto}</span>
                        )}
                      </CFormLabel>
                      <CFormInput
                        onBlur={onBlur}
                        onChange={handleChange}
                        type="file"
                        required
                        accept=".jpg,.jpeg,.png,.pdf"
                        name="driverPhoto"
                        size="sm"
                        id="driverPhoto"
                      />
                    </CCol>
                    <CCol md={3}>
                      <CFormLabel htmlFor="driverAddress">
                        Driver Address <REQ />{' '}
                        {errors.driverAddress && (
                          <span className="small text-danger">{errors.driverAddress}</span>
                        )}
                      </CFormLabel>
                      <CFormInput
                        name="driverAddress"
                        size="sm"
                        maxLength={200}
                        id="driverAddress"
                        onChange={handleChange}
                        value={values.driverAddress}
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
                      <Link to={'/DriverMasterTable'}>
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
      )}
    </>
  )
}

export default DriverMaster
