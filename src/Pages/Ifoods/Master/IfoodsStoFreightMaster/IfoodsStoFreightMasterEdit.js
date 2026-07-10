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
import IfoodsStofreightMasterService from 'src/Service/Ifoods/Master/IfoodsStofreightMasterService'
import LocationSearchSelect from 'src/components/commoncomponent/LocationSearchSelect'
import LocationApi from 'src/Service/SubMaster/LocationApi'

const IfoodsStoFreightMasterEdit = () => {
  const { id } = useParams()

  const formValues = {
    vehicle_capacity_id: '',
    freight_rate: '',
    vendor_id: '',
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
  let page_no = LogisticsProScreenNumberConstants.IfoodsModuleScreens.Ifoods_StoFreight_Master

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
  const [vehicleBodyData, setVehicleBodyData] = useState([])
  const [contractorData, setContractorData] = useState([])
  const [singleVehicleInfo, setSingleVehicleInfo] = useState([])
  const [vendor_name, setVendorName] = useState('')
  const [vendorError, setVendorError] = useState(true)
  const [vendorData, setVendorData] = useState([])
  const [fromLocation, setfromLocation] = useState([])

  const { values, errors, handleChange, onFocus, handleSubmit, onBlur } = useForm(
    changeVehicle,
    DepoVehicleValidation,
    formValues
  )
  const [from_location, setLocation] = useState([])
  const [to_location, setLocations] = useState([])

  const fromlocations = (e) => {
    let location_id = e.value
    values.from_location = location_id
    LocationApi.getLocation(values.from_location).then((res) => {
      setLocation(res.data.data.location_id)
    })
    console.log(location_id)
  }

  const tolocations = (e) => {
    let location_id = e.value
    values.to_location = location_id
    LocationApi.getLocation(values.to_location).then((res) => {
      setLocations(res.data.data.location_id)
    })
    console.log(location_id)
  }
  useEffect(() => {

    LocationApi.getLocation().then((res) => {
      setLocation(res.data.data)
      setLocations(res.data.data)
    })

    //section for getting vehicle capacity from database
    VehicleCapacityService.getVehicleCapacity().then((res) => {
      setVehicleCapacityData(res.data.data)
    })

    //section for getting Contractor Data from database
    IfoodsVendorMasterService.getIfoodsVendors().then((res) => {
      setVendorData(res.data.data)
      console.log(res.data.data)
    })
  }, [])
  useEffect(() => {
    //section for getting Vendor Data from database
    IfoodsVendorMasterService.getActiveIfoodsVendors().then((res) => {
      console.log(res.data.data)
      setVendorData(res.data.data)
    })
  }, [])
  useEffect(() => {
    if (singleVehicleInfo) {
      let vendor_id = !errors.vendor_id && values.vendor_id
      let freight_rate = !errors.freight_rate && values.freight_rate
      let vehicle_capacity_id = !errors.vehicle_capacity_id && values.vehicle_capacity_id
      let condition_check = vendor_id && freight_rate && vehicle_capacity_id
      console.log(condition_check, 'condition_check')

      if (condition_check) {
        setSubmitBtn(false)
      } else {
        setSubmitBtn(true)
      }
    }
  }, [values, errors, singleVehicleInfo])

  function changeVehicle() {
    setFetch(false)
    const formData = new FormData()
    console.log(from_location)
    formData.append('_method', 'PUT')
    formData.append('vendor_id', values.vendor_info)
   //*- formData.append('vendor_id', vendor_name)
    formData.append('vehicle_capacity_id', values.vehicle_capacity_id)
    formData.append('freight_rate', values.freight_rate)
    formData.append('from_location',values.from_location)
    formData.append('to_location', values.to_location)

    formData.append('updated_by', user_id)

    console.log(values)

    IfoodsStofreightMasterService.updateStofreight(id, formData)
      .then((res) => {
        setFetch(true)
        if (res.status === 200) {
          for (let value of formData.values()) {
            console.log(value)
          }

          toast.success('Ifoods Freight Updated Successfully!')

          setTimeout(() => {
            navigation('/IfoodsStoFreightMasterTable')
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
    //section to fetch single info
    IfoodsStofreightMasterService.getIfoodsStofreightById(id).then((res) => {
      setFetch(true)
      let freight_data = res.data.data
      console.log(res.data.data, 'STO info')
      console.log(freight_data.from_location_info.location, 'Vehicles info')
      values.vendor_id = freight_data.ifoods_Vendor_info.vendor_name
      values.vendor_info = freight_data.vendor_id
      values.freight_rate = freight_data.freight_rate
      values.from_location = freight_data.from_location_info.id,
      values.to_location = freight_data.to_location_info.id,
      values.vehicle_capacity_id = freight_data.vehicle_capacity_info.id
      setSingleVehicleInfo(freight_data)
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
                            {vendorError && (
                              <span className="small text-danger">Select Vendor</span>
                            )}
                          </CFormLabel>
                          <CFormSelect
                            size="sm"
                            name="vendor_id"
                            id="vendor_id"
                            onFocus={onFocus}
                            onChange={handleChange}
                            value={values.vendor_id}
                            // selectedValue={values.vendor_id}
                            className={`mb-1 ${errors.vendor_id && 'is-invalid'}`}
                            aria-label="Small select example"
                          >
                            <option value="0">Select ...</option>

                            {vendorData.map(({ id, vendor_name }) => {
                              console.log(vendorData)
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
                          <CFormLabel htmlFor="vCap">
                            Vehicle Feet <REQ />{' '}
                            {errors.vehicle_capacity_id && (
                              <span className="small text-danger">
                                {errors.vehicle_capacity_id}
                              </span>
                            )}
                          </CFormLabel>

                          <CFormSelect
                            size="sm"
                            name="vehicle_capacity_id"
                            onChange={handleChange}
                            onFocus={onFocus}
                            value={values.vehicle_capacity_id}
                            className={`mb-1 ${errors.vehicle_capacity_id && 'is-invalid'}`}
                            aria-label="Small select example"
                            id="vCap"
                          >
                            <option value="0">Select ...</option>
                            {vehicleCapacityData.map(({ id, capacity }) => {
                              return (
                                <>
                                  <option key={id} value={id}>
                                    {capacity}
                                  </option>
                                </>
                              )
                            })}
                          </CFormSelect>
                        </CCol>
                        <CCol md={3}>
                          <CFormLabel htmlFor="from_location">
                            From Location *{' '}
                            {errors.from_location && (
                              <span className="small text-danger">{errors.from_location}</span>
                            )}
                          </CFormLabel>
                          {/* LocationSearchSelect */}

                          <CFormSelect
                            size="sm"
                            name="from_location"
                            id="from_location"
                            onFocus={onFocus}
                            onChange={handleChange}
                            value={values.from_location}
                            // selectedValue={values.vendor_id}
                            className={`mb-1 ${errors.from_location && 'is-invalid'}`}
                            aria-label="Small select example"
                          >
                            <option value="0">Select ...</option>

                            {from_location.map(({ id, location }) => {
                              //console.log(from_location)
                              return (
                                <>
                                  <option key={id} value={id}>
                                    {location}
                                  </option>
                                </>
                              )
                            })}
                          </CFormSelect>


                        </CCol>
                        <CCol md={3}>
                          <CFormLabel htmlFor="to_location">
                            To Location *{' '}
                            {errors.to_location && (
                              <span className="small text-danger">{errors.to_location}</span>
                            )}
                          </CFormLabel>
                          <CFormSelect
                            size="sm"
                            name="to_location"
                            id="to_location"
                            onFocus={onFocus}
                            onChange={handleChange}
                            value={values.to_location}
                            // selectedValue={values.vendor_id}
                            className={`mb-1 ${errors.to_location && 'is-invalid'}`}
                            aria-label="Small select example"
                          >
                            <option value="0">Select ...</option>

                            {to_location.map(({ id, location }) => {
                              console.log(to_location)
                              return (
                                <>
                                  <option key={id} value={id}>
                                    {location}
                                  </option>
                                </>
                              )
                            })}
                          </CFormSelect>


                        </CCol>

                        <CCol md={3}>
                          <CFormLabel htmlFor="freight_rate">
                            Freight <REQ />{' '}
                            {errors.freight_rate && (
                              <span className="small text-danger">{errors.freight_rate}</span>
                            )}
                          </CFormLabel>
                          <CFormInput
                            name="freight_rate"
                            size="sm"
                            maxLength={15}
                            id="freight_rate"
                            onChange={handleChange}
                            value={values.freight_rate}
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
                            // type="submit"
                            disabled={submitBtn}
                            onClick={changeVehicle}
                          >
                            UPDATE
                          </CButton>
                          <Link to={'/IfoodsStoFreightMasterTable'}>
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

export default IfoodsStoFreightMasterEdit
