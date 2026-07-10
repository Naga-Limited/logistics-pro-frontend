/* eslint-disable prettier/prettier */
import {
  CAlert,
  CButton,
  CCard,
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
  CTabPane,
  CButtonGroup,
  CFormCheck,
} from '@coreui/react'
import { React, useEffect, useState } from 'react'
import useForm from 'src/Hooks/useForm.js'
import VehicleCapacityService from 'src/Service/SmallMaster/Vehicles/VehicleCapacityService'
import VehicleBodyTypeService from 'src/Service/SmallMaster/Vehicles/VehicleBodyTypeService'
import { useParams } from 'react-router-dom'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import DepoVehicleValidation from 'src/Utils/Depo/Vehicle/DepoVehicleValidation'
import DepoContractorMasterService from 'src/Service/Depo/Master/DepoContractorMasterService'
import DepoVehicleMasterService from 'src/Service/Depo/Master/DepoVehicleMasterService'
import Loader from 'src/components/Loader'
import AccessDeniedComponent from 'src/components/commoncomponent/AccessDeniedComponent'
import JavascriptInArrayComponent from 'src/components/commoncomponent/JavascriptInArrayComponent'
import * as LogisticsProScreenNumberConstants from 'src/components/constants/LogisticsProScreenNumberConstants'
import IfoodsVehicleMasterService from 'src/Service/Ifoods/Master/IfoodsVehicleMasterService'
import IfoodsVendorMasterService from 'src/Service/Ifoods/Master/IfoodsVendorMasterService'
import SearchSelectComponent from 'src/components/commoncomponent/searchSelectComponent'
import IfoodsVendorCodeMasterService from 'src/Service/Ifoods/Master/IfoodsVendorCodeMasterService'

const IfoodsVendorCodeMasterEdit = () => {
  const { id } = useParams()

  const formValues = {
    vendor_id: '',
    vendor_code: '',
    start_date: '',
    end_date: '',
  }

  /*================== User Id & Location Fetch ======================*/
  const user_info_json = localStorage.getItem('user_info')
  const user_info = JSON.parse(user_info_json)
  const user_locations = []
  const navigation = useNavigate()

  console.log(user_info)

  /* Get User Locations From Local Storage */
  user_info.location_info.map((data, index) => {
    user_locations.push(data.id)
  })

  /* Get User Id From Local Storage */
  const user_id = user_info.user_id

  // console.log(user_locations)
  /*================== User Location Fetch ======================*/

  /* ==================== Access Part Start ========================*/
  const [screenAccess, setScreenAccess] = useState(false)
  let page_no = LogisticsProScreenNumberConstants.IfoodsModuleScreens.Ifoods_VendorCode_Master

  useEffect(() => {
    if (
      user_info.is_admin == 1 ||
      JavascriptInArrayComponent(page_no, user_info.page_permissions)
    ) {
      console.log('screen-access-allowed')
      setScreenAccess(true)
    } else {
      console.log('screen-access-not-allowed')
      setScreenAccess(false)
    }
  }, [])
  /* ==================== Access Part End ========================*/

  const REQ = () => <span className="text-danger"> * </span>
  const [fetch, setFetch] = useState(false)
  const [errorModal, setErrorModal] = useState(false)
  const [error, setError] = useState({})
  const [submitBtn, setSubmitBtn] = useState(true)
  const [vehicleCapacityData, setVehicleCapacityData] = useState([])
  const [vehicleFeetData, setVehicleFeetData] = useState([])
  const [vehicleBodyData, setVehicleBodyData] = useState([])
  const [contractorData, setContractorData] = useState([])
  const [singleVendorInfo, setSingleVendorInfo] = useState([])
  const [vendor_name, setVendorName] = useState('')
  const [vendorError, setVendorError] = useState(true)
  const [vendorData, setVendorData] = useState([])

  const { values, errors, handleChange, onFocus, handleSubmit, onBlur } = useForm(
    changeVendorCode,
    DepoVehicleValidation,
    formValues
  )

  useEffect(() => {
    //section for getting vehicle capacity from database
    VehicleCapacityService.getVehicleCapacity().then((res) => {
      setVehicleCapacityData(res.data.data)
      setVehicleFeetData(res.data.data)
    })

    //section for getting vehicle Body Type from database
    VehicleBodyTypeService.getVehicleBody().then((res) => {
      setVehicleBodyData(res.data.data)
    })

    //section for getting Contractor Data from database
    IfoodsVendorMasterService.getIfoodsVendors().then((res) => {
      setVendorData(res.data.data)
      console.log(res.data.data)
    })
  }, [])

  useEffect(() => {
    if (singleVendorInfo) {
      let vendor_id = !errors.vendor_id && values.vendor_id
      let vendor_code = !errors.vendor_code && values.vendor_code
      let start_date = !errors.start_date && values.start_date
      let end_date = !errors.end_date && values.end_date

      let condition_check = vendor_id && vendor_code && start_date && end_date

      console.log(condition_check, 'condition_check')

      if (condition_check) {
        setSubmitBtn(false)
      } else {
        setSubmitBtn(true)
      }
    }
  }, [values, errors, singleVendorInfo])

  function changeVendorCode() {
    setFetch(false)
    const formData = new FormData()

    formData.append('_method', 'PUT')
    formData.append('vendor_id', values.vendor_info)
    // formData.append('vendor_id', vendor_name)
    formData.append('vendor_code', values.vendor_code)
    formData.append('vehicle_type', values.vehicle_type)
    formData.append('start_date', values.start_date)
    formData.append('end_date', values.end_date)
    formData.append('updated_by', user_id)

    console.log(formData)

    IfoodsVendorCodeMasterService.updateVendorsCode(id, formData)
      .then((res) => {
        setFetch(true)
        if (res.status === 200) {
          for (let value of formData.values()) {
            console.log(value)
          }

          toast.success('Vendor Code Updated Successfully!')

          setTimeout(() => {
            navigation('/IfoodsVendorCodeMasterTable')
          }, 1000)
        }
      })
      .catch((error) => {
        setFetch(true)
        for (let value of formData.values()) {
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
    IfoodsVendorCodeMasterService.getVendorsByIdCode(id).then((res) => {
      setFetch(true)
      let vendor_data = res.data.data
      console.log(res.data.data, 'vendor_data')
      values.vendor_info = vendor_data.vendor_id
      values.vendor_id = vendor_data.ifoods_Vendor_info.vendor_name
      values.vendor_code = vendor_data.vendor_code
      values.vendor_code = vendor_data.vendor_code
      values.start_date = vendor_data.start_date
      values.end_date = vendor_data.end_date
      setSingleVendorInfo(vendor_data)
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
                          <CFormLabel htmlFor="vendor_id">
                            Vendor Name <REQ />{' '}
                            {vendorError && <span className="small text-danger"></span>}
                          </CFormLabel>
                          <CFormSelect
                            size="sm"
                            name="vendor_id"
                            id="vendor_id"
                            isReadOnly={true}
                            onFocus={onFocus}
                            onChange={handleChange}
                            value={values.vendor_id}
                            className={`mb-1 ${errors.vendor_id && 'is-invalid'}`}
                            aria-label="Small select example"
                          >
                            <option value="0">Select ...</option>

                            {vendorData.map(({ id, vendor_name }) => {
                              return (
                                <>
                                  <option key={id} value={vendor_name}>
                                    {vendor_name}
                                  </option>
                                </>
                              )
                            })}
                          </CFormSelect>
                        </CCol>

                        <CCol md={3}>
                          <CFormLabel htmlFor="vendor_code">
                            New Vendor Code <REQ />{' '}
                            {errors.vehicleNumber && (
                              <span className="small text-danger">{errors.vendor_code}</span>
                            )}
                          </CFormLabel>
                          <CFormInput
                            name="vendor_code"
                            size="sm"
                            maxLength={15}
                            id="vendor_code"
                            onChange={handleChange}
                            value={values.vendor_code}
                            onFocus={onFocus}
                            onBlur={onBlur}
                            placeholder=""
                          />
                        </CCol>
                        <CCol md={3}>
                          <CFormLabel htmlFor="start_date">
                            Start Date <REQ />{' '}
                            {errors.start_date && (
                              <span className="small text-danger">{errors.start_date}</span>
                            )}
                          </CFormLabel>
                          <CFormInput
                            size="sm"
                            id="start_date"
                            type="date"
                            className={`${errors.start_date && 'is-invalid'}`}
                            name="start_date"
                            value={values.start_date}
                            onFocus={onFocus}
                            onBlur={onBlur}
                            onChange={handleChange}
                            aria-label="Small select example"
                            placeholder="date"
                          />
                        </CCol>
                        <CCol md={3}>
                          <CFormLabel htmlFor="end_date">
                            End Date <REQ />{' '}
                            {errors.end_date && (
                              <span className="small text-danger">{errors.end_date}</span>
                            )}
                          </CFormLabel>

                          <CFormInput
                            size="sm"
                            id="end_date"
                            type="date"
                            className={`${errors.end_date && 'is-invalid'}`}
                            name="end_date"
                            value={values.end_date}
                            onFocus={onFocus}
                            onBlur={onBlur}
                            onChange={handleChange}
                            aria-label="Small select example"
                            placeholder="date"
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
                            disabled={submitBtn}
                            onClick={changeVendorCode}
                          >
                            UPDATE
                          </CButton>
                          <Link to={'/IfoodsVendorCodeMasterTable'}>
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
            </>
          ) : (
            <AccessDeniedComponent />
          )}
        </>
      )}
    </>
  )
}

export default IfoodsVendorCodeMasterEdit
