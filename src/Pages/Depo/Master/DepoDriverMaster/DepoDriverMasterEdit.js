/* eslint-disable prettier/prettier */
import {
  CAlert,
  CButton,
  CCard,
  CCardImage,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
  CTabContent,
  CTabPane
} from '@coreui/react'
import { React, useEffect, useState } from 'react'
import useForm from 'src/Hooks/useForm.js'
import { useParams } from 'react-router-dom'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import DepoContractorMasterService from 'src/Service/Depo/Master/DepoContractorMasterService'
import Loader from 'src/components/Loader'
import * as LogisticsProScreenNumberConstants from 'src/components/constants/LogisticsProScreenNumberConstants'
import DepoDriverMasterService from 'src/Service/Depo/Master/DepoDriverMasterService'
import DepoDriverValidation from 'src/Utils/Depo/Driver/DepoDriverValidation'
import AccessDeniedComponent from 'src/components/commoncomponent/AccessDeniedComponent'
import JavascriptInArrayComponent from 'src/components/commoncomponent/JavascriptInArrayComponent'
const DepoDriverMasterEdit = () => {
  const { id } = useParams()

  const formValues = {
    depoContractorName: '',
    driverName: '',
    driverNumber: '',
    driverAddress: '',
    licenseNumber: '',
    licenseValidDate: '',
    driverPhoto: '',
  }

  /*================== User Id & Location Fetch ======================*/
    const user_info_json = localStorage.getItem('user_info')
    const user_info = JSON.parse(user_info_json)
    const user_locations = []
    const navigation = useNavigate()

    // console.log(user_info)

    /* Get User Locations From Local Storage */
    user_info.location_info.map((data, index) => {
      user_locations.push(data.id)
    })

    /* Get User Id From Local Storage */
    const user_id = user_info.user_id

  /*================== User Location Fetch ======================*/

  /* ==================== Access Part Start ========================*/
  const [screenAccess, setScreenAccess] = useState(false)
  let page_no = LogisticsProScreenNumberConstants.DepoModuleScreens.Depo_Driver_Master

  useEffect(()=>{

    if(user_info.is_admin == 1 || JavascriptInArrayComponent(page_no,user_info.page_permissions)){
      console.log('screen-access-allowed')
      setScreenAccess(true)
    } else{
      console.log('screen-access-not-allowed')
      setScreenAccess(false)
    }

  },[])
  /* ==================== Access Part End ========================*/


    const REQ = () => <span className="text-danger"> * </span>
    const [fetch, setFetch] = useState(false)
    const [errorModal, setErrorModal] = useState(false)
    const [error, setError] = useState({})
    const [submitBtn, setSubmitBtn] = useState(true)
    const [contractorData, setContractorData] = useState([])
    const [singleDriverInfo, setSingleDriverInfo] = useState([])
    const [driverCopy, setDriverCopy] = useState(true)
    const [driverCopyDel, setDriverCopyDel] = useState(false)


    const { values, errors, handleChange, onFocus, handleSubmit, onBlur } = useForm(
      addNewDriver,
      DepoDriverValidation,
      formValues
    )

    useEffect(() => {

      //section for getting Contractor Data from database
      DepoContractorMasterService.getActiveDepoContractors().then((res) => {
        console.log(res.data.data)
        setContractorData(res.data.data)
      })

    }, [])

    useEffect(() => {


      if(singleDriverInfo) {
        // let cName = contractorError ? false : true
        let cName = !errors.depoContractorName && values.depoContractorName
        let dName = !errors.driverName && values.driverName
        let dNumber = !errors.driverNumber && values.driverNumber
        let lNumber = !errors.licenseNumber && values.licenseNumber
        let lValidDate = !errors.licenseValidDate && values.licenseValidDate
        let dAddress = !errors.driverAddress && values.driverAddress

        // values.depoContractorName = contractorName

        let condition_check = cName && dName && dNumber && lNumber && lValidDate && dAddress

        console.log(condition_check,'condition_check')

        if (condition_check) {
          setSubmitBtn(false)
        } else {
          setSubmitBtn(true)
        }
      }
    }, [values, errors, singleDriverInfo])

  function addNewDriver() {
    setFetch(false)
    const formData = new FormData()

    formData.append('_method', 'PUT')
    formData.append('contractor_id', values.depoContractorName)
    formData.append('driver_name', values.driverName)
    formData.append('license_no', values.licenseNumber)
    formData.append('license_validity_to', values.licenseValidDate)
    formData.append('driver_address', values.driverAddress)
    formData.append('driver_photo', values.driverPhoto)
    formData.append('driver_number', values.driverNumber)
    formData.append('updated_by', user_id)

    console.log(values)

    // DepoVehicleMasterService.updateVehicles(id, formData).then((res) => {
      DepoDriverMasterService.updateDrivers(id, formData).then((res) => {
      setFetch(true)
      if (res.status === 200) {
        for (let value of formData.values()) {
          console.log(value)
        }

        toast.success('Depo Driver Updated Successfully!')

        setTimeout(() => {
          navigation('/DepoDriverMasterTable')
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
    DepoDriverMasterService.getDriversById(id).then((res) => {
      setFetch(true)
      let driver_data = res.data.data
      console.log(res.data.data,'Driver info')
      values.depoContractorName = driver_data.Depo_Contractor_info.id

      values.driverName = driver_data.driver_name
      values.licenseNumber = driver_data.license_no
      values.licenseValidDate = driver_data.license_validity_to
      values.driverAddress = driver_data.driver_address
      values.driverPhoto = driver_data.driver_photo
      values.driverNumber = driver_data.driver_number
      setSingleDriverInfo(driver_data)

      console.log(values.depoContractorName,'values.depoContractorName')
      console.log(contractorData,'contractorData')
    })

  }, [id])


  return (
    <>
    {!fetch && <Loader />}

    {fetch && (
      <>
        {screenAccess ? (
          <>
            <CCard>
              <CTabContent>
                <CTabPane role="tabpanel" aria-labelledby="home-tab" visible={true}>
                  <CForm className="row g-3 m-2 p-1" onSubmit={handleSubmit}>
                    <CRow className="mb-md-1">
                    <CCol md={3}>
                      <CFormLabel htmlFor="depoContractorName">
                        Contractor Name <REQ />{' '}
                        {errors.depoContractorName && (
                            <span className="small text-danger">{errors.depoContractorName}</span>
                          )}
                      </CFormLabel>

                      <CFormSelect
                        size="sm"
                        name="depoContractorName"
                        id="depoContractorName"
                        onFocus={onFocus}
                        onChange={handleChange}
                        value={values.depoContractorName}
                        className={`mb-1 ${errors.depoContractorName && 'is-invalid'}`}
                        aria-label="Small select example"
                      >
                        <option value="0">Select ...</option>

                        {contractorData.map(({ id, contractor_name }) => {
                          console.log(values.depoContractorName)
                          return (
                            <>
                              <option key={id} value={id}>
                                {contractor_name}
                              </option>
                            </>
                          )
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
                        <CFormLabel htmlFor="driverNumber">
                        Driver Mobile Number <REQ />{' '}
                          {errors.driverNumber && (
                            <span className="small text-danger">{errors.driverNumber}</span>
                          )}
                        </CFormLabel>
                        <CFormInput
                          name="driverNumber"
                          size="sm"
                          maxLength={10}
                          id="driverNumber"
                          onChange={handleChange}
                          value={values.driverNumber}
                          onFocus={onFocus}
                          onBlur={onBlur}
                          placeholder=""
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
                        <CFormLabel htmlFor="contractorPhoto">
                          Driver Photo
                          {errors.driverPhoto && (
                            <span className="small text-danger">{errors.driverPhoto}</span>
                          )}
                        </CFormLabel>
                        {driverCopy ? (
                          <CButton className="w-100 m-0" color="info" size="sm" id="inputAddress">
                            <span className="float-start">
                              <i
                                className="fa fa-eye"
                                onClick={() => setDriverCopyDel(true)}
                                aria-hidden="true"
                              ></i>{' '}
                              &nbsp;View
                            </span>
                            <span className="float-end">
                              <i
                                className="fa fa-trash"
                                aria-hidden="true"
                                onClick={() => setDriverCopy(false)}
                              ></i>
                            </span>
                          </CButton>
                        ) : (
                            <CFormInput
                            onBlur={onBlur}
                            onChange={handleChange}
                            type="file"
                            accept=".jpg,.jpeg,.png,.pdf"
                            name="driverPhoto"
                            size="sm"
                            id="driverPhoto"
                          />
                        )}
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
                          disabled={submitBtn}
                          onClick={addNewDriver}
                        >
                          UPDATE
                        </CButton>
                        <Link to={'/DepoDriverMasterTable'}>
                          <CButton
                            size="s-lg"
                            color="warning"
                            className="mx-1 px-2 text-white"
                            type="button"
                          >
                            BACK
                          </CButton>
                        </Link>
                      </CCol>
                    </CRow>
                  </CForm>
                </CTabPane>
              </CTabContent>
              {/*Contractor Copy model*/}
              <CModal visible={driverCopyDel} backdrop="static" onClose={() => setDriverCopyDel(false)}>
                <CModalHeader>
                  <CModalTitle>Driver Photo</CModalTitle>
                </CModalHeader>
                <CModalBody>
                {singleDriverInfo.driver_photo && !singleDriverInfo.driver_photo.includes('.pdf') ? (
                    <CCardImage orientation="top" src={singleDriverInfo.driver_photo} />
                  ) : (
                    <iframe
                      orientation="top"
                      height={500}
                      width={475}
                      src={singleDriverInfo.driver_photo}
                    ></iframe>
                  )}
                </CModalBody>
                <CModalFooter>
                  <CButton color="secondary" onClick={() => setDriverCopyDel(false)}>
                    Close
                  </CButton>
                </CModalFooter>
              </CModal>
              {/*Contractor Copy model*/}
              {/* Error Modal Section */}
              <CModal visible={errorModal} backdrop="static" onClose={() => setErrorModal(false)}>
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
            </CCard>
          </>) : (<AccessDeniedComponent />
        )}
      </>
    )}
    </>
  )
}

export default DepoDriverMasterEdit
