/* eslint-disable prettier/prettier */
import {
  CButton,
  CCard,
  CCol,
  CAlert,
  CContainer,
  CForm,
  CFormInput,
  CCardImage,
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
import { useParams } from 'react-router-dom'

import DriverMasterService from 'src/Service/Master/DriverMasterService'
import DriverMasterValidation from '../../../Utils/Master/DriverMasterValidation'

import { Link, useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import DriverTypeService from 'src/Service/SmallMaster/Drivers/DriverTypeService'
import Loader from 'src/components/Loader'
const DriverMaster = () => {
  const { id } = useParams()
  const REQ = () => <span className="text-danger"> * </span>
  const [LicenseCopyFront, setLicenseCopyFront] = useState(false)
  const [LicenseCopyFrontDel, setLicenseCopyFrontDel] = useState(true)
  const [LicenseCopyBack, setLicenseCopyBack] = useState(false)
  const [LicenseCopyBackDel, setLicenseCopyBackDel] = useState(true)
  const [AadharCopy, setAadharCopy] = useState(false)
  const [AadharCopyDel, setAadharCopyDel] = useState(true)
  const [PanCopy, setPanCopy] = useState(false)
  const [PanCopyDel, setPanCopyDel] = useState(true)
  const [DriverPhoto, setDriverPhoto] = useState(false)
  const [DriverPhotoDel, setDriverPhotoDel] = useState(true)

  const formValues = {
    driverType: '',
    driverName: '',
    driverCode: '',
    driverMobile1: '',
    driverMobile2: '',
    licenseNumber: '',
    licenseValidDate: '',
    LicenseCopyFront: '',
    LicenseCopyBack: '',
    licenseValidityStatus: 'No',
    aadharCard: '',
    panCard: '',
    driverPhoto: '',
    driverAddress: '',
  }

  const [driverType, setDriverType] = useState([])
  const [singleDriver, setSingleDriver] = useState('')
  const [driverMasterData, setDriverMasterData] = useState([])
  const navigation = useNavigate()
  const [fetch, setFetch] = useState(false)
  const [errorModal, setErrorModal] = useState(false)
  const [error, setError] = useState({})

  const { values, errors, handleChange, onFocus, handleSubmit, enableSubmit, onBlur } = useForm(
    addNewDriver,
    DriverMasterValidation,
    formValues
  )

  function dateFormat(a) {
    let short_year = a.substring(a.lastIndexOf('-') + 1)
    let month = a.substring(a.indexOf('-') + 1, a.lastIndexOf('-'))
    let day = a.substring(0, a.indexOf('-'))
    let d = a.lastIndexOf('-')
    let year = 20 + short_year
    let new_date = year + '-' + month + '-' + day
    return new_date
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

  function addNewDriver() {
    const formData = new FormData()
    
    if(values.driverCode != singleDriver.driver_code &&  driverAlreadyExistInDriverMaster(values.driverCode) === 1){
      toast.warning('Updated Driver Code was already exists in Driver Master..!')
      return false
    } 
    setFetch(false)
    formData.append('_method', 'PUT')
    formData.append('driver_type_id', values.driverType)
    formData.append('driver_name', values.driverName)
    formData.append('driver_code', values.driverCode)
    formData.append('driver_phone_1', values.driverMobile1)
    formData.append('driver_phone_2', values.driverMobile2)
    formData.append('license_no', values.licenseNumber)
    formData.append('license_validity_to', values.licenseValidDate)
    formData.append('license_copy_front', values.LicenseCopyFront)
    formData.append('license_copy_back', values.LicenseCopyBack)
    formData.append('license_validity_status', values.licenseValidityStatus == 'Yes' ? 1 : 0)
    formData.append('aadhar_card', values.aadharCard)
    formData.append('pan_card', values.panCard)
    formData.append('driver_photo', values.driverPhoto)
    formData.append('driver_address', values.driverAddress)
    // console.log(values)
    DriverMasterService.updateDrivers(id, formData)
      .then((res) => {
        setFetch(true)
        if (res.status === 200) {
          toast.success('Driver Updated Successfully!')

          setTimeout(() => {
            navigation('/DriverMasterTable')
          }, 1000)
        }
      })
      .catch((error) => {
        setFetch(true)
        for (let value of formData.values()) {
          // console.log(value)
        }
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
    //section to fetch single Driver info
    DriverMasterService.getDriversById(id).then((res) => {
      setFetch(true)
      values.driverType = res.data.data.driver_type_info.driver_type_id
      values.driverName = res.data.data.driver_name
      values.driverCode = res.data.data.driver_code
      values.driverMobile1 = res.data.data.driver_phone_1
      values.driverMobile2 = res.data.data.driver_phone_2
      values.licenseNumber = res.data.data.license_no
      values.licenseValidDate = dateFormat(res.data.data.license_validity_to)
      values.licenseValidityStatus = res.data.data.license_validity_status
      values.driverAddress = res.data.data.driver_address
      setSingleDriver(res.data.data)
    })

    //section for getting Driver type from database
    DriverTypeService.getDriverTypes().then((res) => {
      setDriverType(res.data.data)
    })
    //section for getting Driver Master from database
    DriverMasterService.getDrivers().then((res) => {
      console.log(res.data.data,'getDrivers')
      setDriverMasterData(res.data.data)
    })
  }, [id])

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
                        value={values.driverType}
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
                        maxLength={20}
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
                        {errors.LicenseCopyFront && (
                          <span className="small text-danger">{errors.LicenseCopyFront}</span>
                        )}
                      </CFormLabel>
                      {LicenseCopyFrontDel ? (
                        <CButton className="w-100 m-0" color="info" size="sm" id="inputAddress">
                          <span className="float-start">
                            <i
                              className="fa fa-eye"
                              onClick={() => setLicenseCopyFront(true)}
                              aria-hidden="true"
                            ></i>{' '}
                            &nbsp;View
                          </span>
                          <span className="float-end">
                            <i
                              className="fa fa-trash"
                              aria-hidden="true"
                              onClick={() => setLicenseCopyFrontDel(false)}
                            ></i>
                          </span>
                        </CButton>
                      ) : (
                        <CFormInput
                          onBlur={onBlur}
                          onChange={handleChange}
                          type="file"
                          // required
                          accept=".jpg,.jpeg,.png,.pdf"
                          name="LicenseCopyFront"
                          size="sm"
                          id="lcFront"
                        />
                      )}
                    </CCol>
                    <CCol md={3}>
                      <CFormLabel htmlFor="lcBack">
                        License Copy Back <REQ />{' '}
                        {errors.LicenseCopyBack && (
                          <span className="small text-danger">{errors.LicenseCopyBack}</span>
                        )}
                      </CFormLabel>
                      {LicenseCopyBackDel ? (
                        <CButton className="w-100 m-0" color="info" size="sm" id="inputAddress">
                          <span className="float-start">
                            <i
                              className="fa fa-eye"
                              onClick={() => setLicenseCopyBack(true)}
                              aria-hidden="true"
                            ></i>{' '}
                            &nbsp;View
                          </span>
                          <span className="float-end">
                            <i
                              className="fa fa-trash"
                              aria-hidden="true"
                              onClick={() => setLicenseCopyBackDel(false)}
                            ></i>
                          </span>
                        </CButton>
                      ) : (
                        <CFormInput
                          onBlur={onBlur}
                          onChange={handleChange}
                          type="file"
                          // required
                          accept=".jpg,.jpeg,.png,.pdf"
                          name="LicenseCopyBack"
                          size="sm"
                          id="lcBack"
                        />
                      )}
                    </CCol>

                    <CCol md={3}>
                      <CFormLabel htmlFor="aadhar">
                        Aadhar Card <REQ />{' '}
                        {errors.aadharCard && (
                          <span className="small text-danger">{errors.aadharCard}</span>
                        )}
                      </CFormLabel>
                      {AadharCopyDel ? (
                        <CButton className="w-100 m-0" color="info" size="sm" id="inputAddress">
                          <span className="float-start">
                            <i
                              className="fa fa-eye"
                              onClick={() => setAadharCopy(true)}
                              aria-hidden="true"
                            ></i>{' '}
                            &nbsp;View
                          </span>
                          <span className="float-end">
                            <i
                              className="fa fa-trash"
                              aria-hidden="true"
                              onClick={() => setAadharCopyDel(false)}
                            ></i>
                          </span>
                        </CButton>
                      ) : (
                        <CFormInput
                          onBlur={onBlur}
                          onChange={handleChange}
                          type="file"
                          // required
                          accept=".jpg,.jpeg,.png,.pdf"
                          name="aadharCard"
                          size="sm"
                          id="aadhar"
                        />
                      )}
                    </CCol>
                    <CCol md={3}>
                      <CFormLabel htmlFor="pan">
                        PAN Card <REQ />{' '}
                        {errors.panCard && (
                          <span className="small text-danger">{errors.panCard}</span>
                        )}
                      </CFormLabel>
                      {PanCopyDel ? (
                        <CButton className="w-100 m-0" color="info" size="sm" id="inputAddress">
                          <span className="float-start">
                            <i
                              className="fa fa-eye"
                              onClick={() => setPanCopy(true)}
                              aria-hidden="true"
                            ></i>{' '}
                            &nbsp;View
                          </span>
                          <span className="float-end">
                            <i
                              className="fa fa-trash"
                              aria-hidden="true"
                              onClick={() => setPanCopyDel(false)}
                            ></i>
                          </span>
                        </CButton>
                      ) : (
                        <CFormInput
                          onBlur={onBlur}
                          onChange={handleChange}
                          type="file"
                          // required
                          accept=".jpg,.jpeg,.png,.pdf"
                          name="panCard"
                          size="sm"
                          id="pan"
                        />
                      )}
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
                      {DriverPhotoDel ? (
                        <CButton className="w-100 m-0" color="info" size="sm" id="inputAddress">
                          <span className="float-start">
                            <i
                              className="fa fa-eye"
                              onClick={() => setDriverPhoto(true)}
                              aria-hidden="true"
                            ></i>{' '}
                            &nbsp;View
                          </span>
                          <span className="float-end">
                            <i
                              className="fa fa-trash"
                              aria-hidden="true"
                              onClick={() => setDriverPhotoDel(false)}
                            ></i>
                          </span>
                        </CButton>
                      ) : (
                        <CFormInput
                          onBlur={onBlur}
                          onChange={handleChange}
                          type="file"
                          // required
                          accept=".jpg,.jpeg,.png,.pdf"
                          name="driverPhoto"
                          size="sm"
                          id="driverPhoto"
                        />
                      )}
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
                        // disabled={enableSubmit}
                      >
                        Update
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
          {/*License copy front model*/}
          <CModal visible={LicenseCopyFront} onClose={() => setLicenseCopyFront(false)}>
            <CModalHeader>
              <CModalTitle>License Copy Front</CModalTitle>
            </CModalHeader>
            <CModalBody>
              {singleDriver.license_copy_front &&
              !singleDriver.license_copy_front.includes('.pdf') ? (
                <CCardImage orientation="top" src={singleDriver.license_copy_front} />
              ) : (
                <iframe
                  orientation="top"
                  height={500}
                  width={475}
                  src={singleDriver.license_copy_front}
                ></iframe>
              )}
            </CModalBody>
            <CModalFooter>
              <CButton color="secondary" onClick={() => setLicenseCopyFront(false)}>
                Close
              </CButton>
            </CModalFooter>
          </CModal>
          {/*License copy front model*/}
          {/*License copy Back model*/}
          <CModal visible={LicenseCopyBack} onClose={() => setLicenseCopyBack(false)}>
            <CModalHeader>
              <CModalTitle>License Copy Back</CModalTitle>
            </CModalHeader>
            <CModalBody>
              {singleDriver.license_copy_back &&
              !singleDriver.license_copy_back.includes('.pdf') ? (
                <CCardImage orientation="top" src={singleDriver.license_copy_back} />
              ) : (
                <iframe
                  orientation="top"
                  height={500}
                  width={475}
                  src={singleDriver.license_copy_back}
                ></iframe>
              )}
            </CModalBody>
            <CModalFooter>
              <CButton color="secondary" onClick={() => setLicenseCopyBack(false)}>
                Close
              </CButton>
            </CModalFooter>
          </CModal>
          {/*License copy Back model*/}
          {/*Aadhar copy model*/}
          <CModal visible={AadharCopy} onClose={() => setAadharCopy(false)}>
            <CModalHeader>
              <CModalTitle>Aadhar Copy</CModalTitle>
            </CModalHeader>
            <CModalBody>
              {singleDriver.aadhar_card && !singleDriver.aadhar_card.includes('.pdf') ? (
                <CCardImage orientation="top" src={singleDriver.aadhar_card} />
              ) : (
                <iframe
                  orientation="top"
                  height={500}
                  width={475}
                  src={singleDriver.aadhar_card}
                ></iframe>
              )}
            </CModalBody>
            <CModalFooter>
              <CButton color="secondary" onClick={() => setAadharCopy(false)}>
                Close
              </CButton>
            </CModalFooter>
          </CModal>
          {/*Aadhar copy model*/}
          {/*Pan copy model*/}
          <CModal visible={PanCopy} onClose={() => setPanCopy(false)}>
            <CModalHeader>
              <CModalTitle>Pan Copy</CModalTitle>
            </CModalHeader>
            <CModalBody>
              {singleDriver.pan_card && !singleDriver.pan_card.includes('.pdf') ? (
                <CCardImage orientation="top" src={singleDriver.pan_card} />
              ) : (
                <iframe
                  orientation="top"
                  height={500}
                  width={475}
                  src={singleDriver.pan_card}
                ></iframe>
              )}
            </CModalBody>
            <CModalFooter>
              <CButton color="secondary" onClick={() => setPanCopy(false)}>
                Close
              </CButton>
            </CModalFooter>
          </CModal>
          {/*Pan copy model*/}
          {/*Driver Photo model*/}
          <CModal visible={DriverPhoto} onClose={() => setDriverPhoto(false)}>
            <CModalHeader>
              <CModalTitle>Driver Photo</CModalTitle>
            </CModalHeader>
            <CModalBody>
              {singleDriver.driver_photo && !singleDriver.driver_photo.includes('.pdf') ? (
                <CCardImage orientation="top" src={singleDriver.driver_photo} />
              ) : (
                <iframe
                  orientation="top"
                  height={500}
                  width={475}
                  src={singleDriver.driver_photo}
                ></iframe>
              )}
            </CModalBody>
            <CModalFooter>
              <CButton color="secondary" onClick={() => setDriverPhoto(false)}>
                Close
              </CButton>
            </CModalFooter>
          </CModal>
          {/*Driver Photo model*/}
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
