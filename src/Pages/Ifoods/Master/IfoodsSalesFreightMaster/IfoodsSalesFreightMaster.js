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
import IfoodsSalesfreightMasterService from 'src/Service/Ifoods/Master/IfoodsSalesfreightMasterService'
import IfoodsVendorMasterService from 'src/Service/Ifoods/Master/IfoodsVendorMasterService'

const IfoodsSalesFreightMaster = () => {
  const formValues = {
    payment_type: '',
    vendor_name: '',
    vendor_id: '',
    budget_km: '',
    budget_km_freight: '',
    freight_per_km: '',
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

  const { values, errors, handleChange, onFocus, handleSubmit, onBlur } = useForm(
    addNewVehicle,
    DepoVehicleValidation,
    formValues
  )

  // useEffect(() => {
  //     //section for getting Vendor Data from database
  //   IfoodsVendorMasterService.getActiveIfoodsVendors().then((res) => {
  //     setVendorData(res.data.data)
  //   })
  // }, [])

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
    let payment_type = !errors.payment_type && values.payment_type
    let vendor_id = !errors.vendor_id && values.vendor_id
    let budget_km = !errors.budget_km && values.budget_km
    let budget_km_freight = !errors.budget_km_freight && values.budget_km_freight
    let freight_per_km = !errors.freight_per_km && values.freight_per_km
 
    let condition_check =
    payment_type &&
      vendor_id &&
      budget_km &&
      budget_km_freight &&
      freight_per_km 
  

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
    formData.append('payment_type', values.payment_type)  
    formData.append('budget_km', values.budget_km)
    formData.append('budget_km_freight', values.budget_km_freight)
    formData.append('freight_per_km', values.freight_per_km)
    formData.append('created_by', user_id)
   // console.log(formData);
   // debugger
   IfoodsSalesfreightMasterService.createIfoodsSalesfreight(formData).then((res) => {
      if (res.status == 201) {
        setFetch(true)
        toast.success('Freight Created Successfully!')

        setTimeout(() => {
          navigation('/IfoodsSalesFreightMasterTable')
        }, 1000)
      }
      else if (res.status === 202) {
        toast.warning('This Freight Combination Already Exists..')
        navigation('/IfoodsSalesFreightMasterTable')
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
                          <CFormLabel htmlFor="payment_type">
                            Payment Type <REQ />{' '}
                            {errors.freightType && (
                              <span className="small text-danger">{errors.payment_type}</span>
                            )}
                          </CFormLabel>
                          <CFormSelect
                            size="sm"
                            name="payment_type"
                            onChange={handleChange}
                            onFocus={onFocus}
                            value={values.payment_type}
                            className={`mb-1 ${errors.payment_type && 'is-invalid'}`}
                            aria-label="Small select example"
                            id="payment_type"
                          >
                            <option value="0">Select ...</option>
                            <option value="1">Budget</option>
                            <option value="2">Actual</option>
                          </CFormSelect>
                        </CCol>
                        <CCol md={3}>
                          <CFormLabel htmlFor="budget_km">
                            Budget KM <REQ />{' '}
                            {errors.freight_rate && (
                              <span className="small text-danger">{errors.budget_km}</span>
                            )}
                          </CFormLabel>
                          <CFormInput
                            name="budget_km"
                            size="sm"
                            maxLength={15}
                            id="budget_km"
                            onChange={handleChange}
                            value={values.budget_km}
                            onFocus={onFocus}
                            onBlur={onBlur}
                            placeholder=""
                          />
                        </CCol>
                        <CCol md={3}>
                          <CFormLabel htmlFor="budget_km_freight">
                            Budget KM Freight <REQ />{' '}
                            {errors.freight_rate && (
                              <span className="small text-danger">{errors.budget_km_freight}</span>
                            )}
                          </CFormLabel>
                          <CFormInput
                            name="budget_km_freight"
                            size="sm"
                            maxLength={15}
                            id="budget_km_freight"
                            onChange={handleChange}
                            value={values.budget_km_freight}
                            onFocus={onFocus}
                            onBlur={onBlur}
                            placeholder=""
                          />
                        </CCol>
                        <CCol md={3}>
                          <CFormLabel htmlFor="freight_per_km">
                            Freight Per KM <REQ />{' '}
                            {errors.freight_rate && (
                              <span className="small text-danger">{errors.freight_per_km}</span>
                            )}
                          </CFormLabel>
                          <CFormInput
                            name="freight_per_km"
                            size="sm"
                            maxLength={15}
                            id="freight_per_km"
                            onChange={handleChange}
                            value={values.freight_per_km}
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
                          <Link to={'/IfoodsSalesFreightMasterTable'}>
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

export default IfoodsSalesFreightMaster
