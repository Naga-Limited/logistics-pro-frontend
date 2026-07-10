/* eslint-disable prettier/prettier */
import {
  CButton,
  CCard,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CRow,
  CTabContent,
  CTabPane,
  CButtonGroup,
  CFormCheck,
} from '@coreui/react'
import { React, useEffect, useState } from 'react'
import useForm from 'src/Hooks/useForm.js'
import { Link, useNavigate } from 'react-router-dom'
import Loader from 'src/components/Loader'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import AccessDeniedComponent from 'src/components/commoncomponent/AccessDeniedComponent'
import JavascriptInArrayComponent from 'src/components/commoncomponent/JavascriptInArrayComponent'
import * as LogisticsProScreenNumberConstants from 'src/components/constants/LogisticsProScreenNumberConstants'
import DepoVehicleValidation from 'src/Utils/Depo/Vehicle/DepoVehicleValidation'
import DepoContractorMasterService from 'src/Service/Depo/Master/DepoContractorMasterService'
import VehicleCapacityService from 'src/Service/SmallMaster/Vehicles/VehicleCapacityService'
import VehicleBodyTypeService from 'src/Service/SmallMaster/Vehicles/VehicleBodyTypeService'
import DepoVehicleMasterService from 'src/Service/Depo/Master/DepoVehicleMasterService'
import SearchSelectComponent from 'src/components/commoncomponent/searchSelectComponent'
import IfoodsVehicleMasterService from 'src/Service/Ifoods/Master/IfoodsVehicleMasterService'
import IfoodsVendorMasterService from 'src/Service/Ifoods/Master/IfoodsVendorMasterService'
import IfoodsStofreightMasterService from 'src/Service/Ifoods/Master/IfoodsStofreightMasterService'
import LocationSearchSelect from 'src/components/commoncomponent/LocationSearchSelect'
import LocationApi from 'src/Service/SubMaster/LocationApi'
const IfoodsStoFreightMaster = () => {
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
  let page_no = LogisticsProScreenNumberConstants.IfoodsModuleScreens.Ifoods_SalesFreight_Master

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
  const [submitBtn, setSubmitBtn] = useState(true)
  const [vehicleCapacityData, setVehicleCapacityData] = useState([])
  const [vehicleBodyData, setVehicleBodyData] = useState([])
  const [vendor_name, setVendorName] = useState('')
  const [vendorError, setVendorError] = useState(true)
  const [vendorData, setVendorData] = useState([])
  const [from_location, setLocation] = useState([])
  const [to_location, setLocations] = useState([])
  // const [location_id, setLocation] = useState([])
  const { values, errors, handleChange, onFocus, handleSubmit, onBlur } = useForm(
    addNewVehicle,
    DepoVehicleValidation,
    formValues
  )
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
    //section for getting vehicle capacity from database
    VehicleCapacityService.getVehicleCapacity().then((res) => {
      setVehicleCapacityData(res.data.data)
    })

    //section for getting Vendor Data from database
    IfoodsVendorMasterService.getActiveIfoodsVendors().then((res) => {
      setVendorData(res.data.data)
    })
  }, [])

  useEffect(() => {
    //section for getting Vendor Data from database
    IfoodsVendorMasterService.getActiveIfoodsVendors().then((res) => {
      console.log(res.data.data)
      setVendorData(res.data.data)
    })
  }, [])

  const onChangeFilter = (event) => {
    var selected_value = event.value
    console.log(selected_value, 'selected_value')
    if (selected_value) {
      setVendorName(selected_value)
      setVendorError(false)
    } else {
      setVendorName('')
      setVendorError(true)
    }
  }

  useEffect(() => {
    setFetch(true)
    // let cName = contractorError ? false : true
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
  }, [values, errors, vendorError])

  function addNewVehicle() {
    setFetch(false)
    const formData = new FormData()
    formData.append('vendor_id', vendor_name)
    formData.append('freight_rate', values.freight_rate)
    formData.append('from_location', values.from_location)
    formData.append('to_location', values.to_location)

    formData.append('vehicle_capacity_id', values.vehicle_capacity_id)
    formData.append('created_by', user_id)
     console.log(formData);
    //debugger
    IfoodsStofreightMasterService.createIfoodsStofreight(formData).then((res) => {
      if (res.status == 201) {
        setFetch(true)
        toast.success('Vehicle Freight Rate Created Successfully!')

        setTimeout(() => {
          navigation('/IfoodsStoFreightMasterTable')
        }, 1000)
      }
      else if (res.status === 202) {
        toast.warning('This Freight Combination Already Exists..')
        navigation('/IfoodsStoFreightMasterTable')
      }
    })
  }

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
                            {vendorError && <span className="small text-danger">Required</span>}
                          </CFormLabel>
                          <SearchSelectComponent
                            size="sm"
                            className="mb-2"
                            onChange={(e) => {
                              onChangeFilter(e)
                              {
                                handleChange
                              }
                            }}
                            label="Select Vendor Name"
                            noOptionsMessage="Vendor Not found"
                            search_type="ifoods_Vendors"
                            // search_data={vendorData}
                          />
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
              From Location  *{' '}
                {errors.from_location && (
                  <span className="small text-danger">{errors.from_location}</span>
                )}
              </CFormLabel>
              {/* LocationSearchSelect */}
              <LocationSearchSelect
                size="sm"
                id="from_location"
                type="text"
                //isDisabled={true}
                //maxLength={125}
                className={`${errors.from_location && 'is-invalid'}`}
                name="from_location"
                value={values.from_location}
                onFocus={onFocus}
                onBlur={onBlur}
                onChange={(e) =>
                  {
                    fromlocations(e, 'from_location')
                  }}
                aria-label="Small select example"
                search_type="from_location"
                

              />
              </CCol>
               <CCol md={3}>
              <CFormLabel htmlFor="to_location">
              To Location  *{' '}
                {errors.to_location && (
                  <span className="small text-danger">{errors.to_location}</span>
                )}
              </CFormLabel>           
              <LocationSearchSelect
                size="sm"
                id="to_location"
                type="text"
                className={`${errors.to_location && 'is-invalid'}`}
                name="to_location"
                value={values.to_location||""}
                onFocus={onFocus}
                onBlur={onBlur}
                onChange={(e) =>
                  {
                    tolocations(e, 'to_location')
                  }}
                aria-label="Small select example"
                search_type="to_location"
                
              />
              </CCol>
              
                        <CCol md={3}>
                          <CFormLabel htmlFor="freight_rate">
                            Freight Rate <REQ />{' '}
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
                            //disabled={submitBtn}
                            onClick={addNewVehicle}
                          >
                            ADD
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

export default IfoodsStoFreightMaster
