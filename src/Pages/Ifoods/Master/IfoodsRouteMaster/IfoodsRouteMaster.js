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
import IfoodsRouteMasterService from 'src/Service/Ifoods/Master/IfoodsRouteMasterService'
import LocationApi from 'src/Service/SubMaster/LocationApi'
import LocationListComponent from 'src/components/commoncomponent/LocationListComponent'
import OutletListComponent from 'src/components/commoncomponent/OutletListComponent'


const IfoodsRouteMaster = () => {
  const formValues = {
    location_id: '',
    outlet_id: '',
    route_type: '',
    route_name: '',
    budgeted_km: '',
    outlet_name:'',
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
  let page_no =
    LogisticsProScreenNumberConstants.IfoodsModuleScreens.Ifoods_Route_Master

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
  const [outlet_name, SetOutletName] = useState('')
  const [vendorError, setVendorError] = useState(true)
  const [vendorData, setVendorData] = useState([])
  const [locationData, setLocationData] = useState([])
  

  const {
    values,
    errors,
    handleChange,
    handleMultipleChange,
    onFocus,
    handleSubmit,
    onBlur,
    handleChangeRemarks,
  } = useForm(addNewRoute, DepoVehicleValidation, formValues)

  useEffect(() => {
    //section for getting Location from database
    LocationApi.getLocation().then((res) => {
      setLocationData(res.data.data)
    })

    //section for getting Vendor from database
    IfoodsVendorMasterService.getIfoodsVendors().then((res) => {
      setVendorData(res.data.data)
    })
  }, [])

  useEffect(() => {
    //section for getting Vendor Data from database
    IfoodsVendorMasterService.getIfoodsVendors().then((res) => {
      console.log(res.data.data)
      setVendorData(res.data.data)
    })
  }, [])

  const onChangeFilter = (event) => {
    var selected_value = event.value
    console.log(selected_value, 'selected_value')
    if (selected_value) {
      SetOutletName(selected_value)
      setVendorError(false)
    } else {
      SetOutletName('')
      setVendorError(true)
    }
  }
  const onChangeFilter1 = (event) => {
    var selected_value = event.value
    console.log(selected_value, 'selected_value')
    if (selected_value) {
      SetOutletName(selected_value)
      setVendorError(false)
    } else {
      SetOutletName('')
      setVendorError(true)
    }
  }
  useEffect(() => {
    setFetch(true)
    // let cName = contractorError ? false : true
    let location_id = !errors.location_id && values.location_id
    let outlet_id = !errors.outlet_id && values.outlet_id
    let route_type = !errors.route_type && values.route_type
    let route_name = !errors.route_name && values.route_name
    let budgeted_km = !errors.budgeted_km && values.budgeted_km

    let condition_check =
      location_id && outlet_id && route_type && route_name && budgeted_km

    console.log(condition_check, 'condition_check')

    if (condition_check) {
      setSubmitBtn(false)
    } else {
      setSubmitBtn(true)
    }
  }, [values, errors, vendorError])

  function addNewRoute() {
    setFetch(false)
    const formData = new FormData()
    formData.append('location_id', values.location_id)
    formData.append('outlet_id',values.outlet_id)
    formData.append('route_type',values. route_type)
    formData.append('route_name', values.route_name)
    formData.append('budgeted_km', values.budgeted_km)
    formData.append('created_by', user_id)
    // console.log(formData);
    // debugger
    IfoodsRouteMasterService.createIfoodsRoute(formData).then((res) => {
      if (res.status == 201) {
        setFetch(true)
        toast.success('Route Created Successfully!')

        setTimeout(() => {
          navigation('/IfoodsRouteMasterTable')
        }, 1000)
      }
      else if (res.status === 202) {
        toast.warning('This Route Combination Already Exists..')
        navigation('/IfoodsRouteMaster')
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
                  <CTabPane
                    role="tabpanel"
                    aria-labelledby="home-tab"
                    visible={true}
                  >
                    <CForm className="row g-3 m-2 p-1" onSubmit={handleSubmit}>
                      <CRow className="mb-md-1">
                      <CCol md={3}>
                          <CFormLabel htmlFor="route_name">
                            Route Name <REQ />{' '}
                            {errors.route_name && (
                              <span className="small text-danger">
                                {errors.route_name}
                              </span>
                            )}
                          </CFormLabel>
                          <CFormInput
                            name="route_name"
                            size="sm"
                            maxLength={30}
                            id="route_name"
                            value={values.route_name}
                            onChange={handleChange}
                          />
                        </CCol>

                        <CCol md={3}>
                          <CFormLabel htmlFor="location_id">
                            Route Location <REQ />{' '}
                          </CFormLabel>
                          <LocationListComponent
                            size="sm"
                            name="location_id"
                            id="location_id"
                            onFocus={onFocus}
                            onBlur={onBlur}
                            onChange={handleMultipleChange}
                            // onChange={handleChange}
                            selectedValue={values.location_id}
                            isMultiple={true}
                            className={`mb-1 ${errors.location_id && 'is-invalid'}`}
                            label="Select Route Location"
                            noOptionsMessage="No Location found"
                          />
                        </CCol>
                        <CCol md={5}>
                          <CFormLabel htmlFor="outlet_id">
                            Outlet Name <REQ />{' '}
                            {vendorError && <span className="small text-danger"></span>}
                          </CFormLabel>
                          <OutletListComponent
                            size="sm"
                            name="outlet_id"
                            id="outlet_id"
                            onFocus={onFocus}
                            onBlur={onBlur}
                            onChange={handleMultipleChange}
                            // onChange={handleChange}
                            selectedValue={values.outlet_id}
                            isMultiple={true}
                            className={`mb-1 ${errors.outlet_id && 'is-invalid'}`}
                            label="Select Outlet"
                            noOptionsMessage="No Outlet found"
                          />
                        </CCol>

                        
                        <CCol md={3}>
                          <CFormLabel htmlFor="route_type">
                            Route Type <REQ />{' '}
                            {errors.route_type && (
                              <span className="small text-danger">
                                {errors.route_type}
                              </span>
                            )}
                          </CFormLabel>
                          <CFormSelect
                            size="sm"
                            name="route_type"
                            onChange={handleChange}
                            onFocus={onFocus}
                            value={values.route_type}
                            className={`mb-1 ${
                              errors.freight_type && 'is-invalid'
                            }`}
                            aria-label="Small select example"
                            id="freight_type"
                          >
                            <option value="0">Select ...</option>
                            <option value="1">Budget</option>
                            <option value="2">Actual</option>
                          </CFormSelect>
                        </CCol>
                        <CCol md={3}>
                          <CFormLabel htmlFor="budgeted_km">
                            Budgeted KM <REQ />{' '}
                            {errors.budgeted_km && (
                              <span className="small text-danger">
                                {errors.budgeted_km}
                              </span>
                            )}
                          </CFormLabel>
                          <CFormInput
                            name="budgeted_km"
                            size="sm"
                            maxLength={8}
                            id="budgeted_km"
                            onChange={handleChange}
                            value={values.budgeted_km}
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
                          style={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                          }}
                        >
                          <CButton
                            size="s-lg"
                            color="warning"
                            className="mx-1 px-2 text-white"
                            // type="submit"
                            //disabled={submitBtn}
                            onClick={addNewRoute}
                          >
                            ADD
                          </CButton>
                          <Link to={'/IfoodsRouteMasterTable'}>
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

export default IfoodsRouteMaster
