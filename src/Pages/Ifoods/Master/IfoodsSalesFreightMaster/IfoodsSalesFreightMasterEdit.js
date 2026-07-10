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
  CFormCheck
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
import IfoodsSalesfreightMasterService from 'src/Service/Ifoods/Master/IfoodsSalesfreightMasterService'
const IfoodsSalesFreightMasterEdit = () => {
  const { id } = useParams()

  const formValues = {
    vehicle_number: '',
    vendor_name: '',
    vendor_id: '',
    vehicle_capacity_id: '',
    vehicle_body_type_id: '',
    insurance_validity: '',
    fc_validity: '',
    ac_non_ac: '',
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
  let page_no = LogisticsProScreenNumberConstants.IfoodsModuleScreens.Ifoods_Vehicle_Master

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
    const [vehicleCapacityData, setVehicleCapacityData] = useState([])
    const [vehicleBodyData, setVehicleBodyData] = useState([])
    const [contractorData, setContractorData] = useState([])
    const [singleVehicleInfo, setSingleVehicleInfo] = useState([])
    const [vendor_name, setVendorName] = useState('')
    const [vendorError, setVendorError] = useState(true)
    const [vendorData, setVendorData] = useState([])

    const { values, errors, handleChange, onFocus, handleSubmit, onBlur } = useForm(
      changeVehicle,
      DepoVehicleValidation,
      formValues
    )

    useEffect(() => {

      //section for getting vehicle capacity from database
      VehicleCapacityService.getVehicleCapacity().then((res) => {
        setVehicleCapacityData(res.data.data)
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


      if(singleVehicleInfo) {
        let vendor_id = !errors.vendor_id && values.vendor_id
        let payment_type = !errors.payment_type && values.payment_type
        let budget_km = !errors.budget_km && values.budget_km
        let budget_km_freight = !errors.budget_km_freight && values.budget_km_freight
        let freight_per_km = !errors.freight_per_km && values.freight_per_km
       
    
        let condition_check =
        payment_type &&
          vendor_id &&
          
          budget_km &&
          budget_km_freight &&
          freight_per_km 
          
    
        console.log(condition_check,'condition_check')

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

    formData.append('_method', 'PUT')
    formData.append('vendor_id', values.vendor_info)
    formData.append('payment_type', values.payment_type)  
    formData.append('budget_km', values.budget_km)
    formData.append('budget_km_freight', values.budget_km_freight)
    formData.append('freight_per_km', values.freight_per_km)
 
    formData.append('updated_by', user_id)

    console.log(values)

    IfoodsSalesfreightMasterService.updateSalesfreight(id, formData).then((res) => {
      setFetch(true)
      if (res.status === 200) {
        for (let value of formData.values()) {
          console.log(value)
        }

        toast.success('Ifoods Vehicle Updated Successfully!')

        setTimeout(() => {
          navigation('/IfoodsSalesFreightMasterTable')
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

    //section to fetch single Contractor info
    IfoodsSalesfreightMasterService.getIfoodsSalesfreightById(id).then((res) => {
      setFetch(true)
      let freight_data = res.data.data
      console.log(res.data.data,'Freight info')
      values.vendor_id = freight_data.ifoods_Vendor_info.vendor_name
      values.vendor_info = freight_data.vendor_id 
      values.payment_type = freight_data.payment_type
      values.budget_km = freight_data.budget_km
      values.budget_km_freight = freight_data.budget_km_freight
      values.freight_per_km = freight_data.freight_per_km
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
                            {vendorError && <span className="small text-danger"></span>}
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
                            disabled={submitBtn}
                            onClick={changeVehicle}
                          >
                            UPDATE
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

export default IfoodsSalesFreightMasterEdit
