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

const DepoVehicleMasterEdit = () => {
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
    const [vehicleFeetData, setVehicleFeetData] = useState([])
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


      if(singleVehicleInfo) {
        let vehicle_number = !errors.vehicle_number && values.vehicle_number
        let vendor_id = !errors.vendor_id && values.vendor_id
        let vehicle_type = !errors.vehicle_type && values.vehicle_type
        let vehicle_capacity_id = !errors.vehicle_capacity_id && values.vehicle_capacity_id
        let vehicle_feet_id = !errors.vehicle_feet_id && values.vehicle_feet_id
        let freight_type = !errors.freight_type && values.freight_type
        let vehicle_body_type_id = !errors.vehicle_body_type_id && values.vehicle_body_type_id
        let insurance_validity = !errors.insurance_validity && values.insurance_validity
        let fc_validity = !errors.fc_validity && values.fc_validity
        let vehicle_freight = !errors.vehicle_freight && values.vehicle_freight

        let condition_check =
        vehicle_number &&
        vendor_id &&
        vehicle_capacity_id &&
        freight_type &&
        vehicle_type &&
        vehicle_body_type_id &&
        vehicle_feet_id &&
        vehicle_freight &&
        insurance_validity &&
        fc_validity

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
  //  formData.append('vendor_id', values.vendor_name)
    formData.append('vehicle_number', values.vehicle_number)  
    formData.append('vehicle_type', values.vehicle_type)
    formData.append('vehicle_feet_id', values.vehicle_feet_id)
    formData.append('vehicle_capacity_id', values.vehicle_capacity_id)
    formData.append('vehicle_freight', values.vehicle_freight)
    formData.append('vehicle_freight_per_km', values.vehicle_freight_per_km)
    formData.append('freight_type', values.freight_type)
    formData.append('vehicle_body_type_id', values.vehicle_body_type_id)
    formData.append('insurance_validity', values.insurance_validity)
    formData.append('fc_validity', values.fc_validity)
    formData.append('ac_non_ac', values.ac_non_ac)
    formData.append('updated_by', user_id)

    console.log(formData)

    IfoodsVehicleMasterService.updateVehicles(id, formData).then((res) => {
      setFetch(true)
      if (res.status === 200) {
        for (let value of formData.values()) {
          console.log(value)
        }

        toast.success('Ifoods Vehicle Updated Successfully!')

        setTimeout(() => {
          navigation('/IfoodsVehicleMasterTable')
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
    IfoodsVehicleMasterService.getIfoodsVehicleById(id).then((res) => {
      setFetch(true)
      let vehicle_data = res.data.data
      console.log(res.data.data,'Vehicles info')
      values.vendor_info = vehicle_data.vendor_id 
      values.vendor_id = vehicle_data.ifoods_Vendor_info.vendor_name 
      values.vehicle_number = vehicle_data.vehicle_number
      values.vehicle_type = vehicle_data.vehicle_type
      values.freight_type = vehicle_data.freight_type
      values.vehicle_freight_per_km = vehicle_data.vehicle_freight_per_km
      values.vehicle_freight = vehicle_data.vehicle_freight
      values.freight_type = vehicle_data.freight_type
      values.vehicle_feet_id = vehicle_data.feet_info.id
      values.vehicle_capacity_id = vehicle_data.vehicle_capacity_info.id
      // values.vehicle_feet_id = vehicle_data.vehicle_feet_id.id 
      values.vehicle_body_type_id = vehicle_data.vehicle_body_type_info.id
      values.insurance_validity = vehicle_data.insurance_validity
      values.fc_validity = vehicle_data.fc_validity 
      values.ac_non_ac = vehicle_data.ac_non_ac 
      setSingleVehicleInfo(vehicle_data)
 
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
                          <CFormLabel htmlFor="vehicle_number">
                            Vehicle Number <REQ />{' '}
                            {errors.vehicleNumber && (
                              <span className="small text-danger">{errors.vehicle_number}</span>
                            )}
                          </CFormLabel>
                          <CFormInput
                            name="vehicle_number"
                            size="sm"
                            maxLength={15}
                            id="vehicle_number"
                            onChange={handleChange}
                            value={values.vehicle_number}
                            
                            onFocus={onFocus}
                            onBlur={onBlur}
                            placeholder=""
                            
                          />
                        </CCol>
                        <CCol md={3}>
                          <CFormLabel htmlFor="vehicle_type">
                            Vehicle Type <REQ />{' '}
                            {errors.freightType && (
                              <span className="small text-danger">{errors.vehicle_type}</span>
                            )}
                          </CFormLabel>
                          <CFormSelect
                            size="sm"
                            name="vehicle_type"
                            onChange={handleChange}
                            onFocus={onFocus}
                            value={values.vehicle_type}
                            className={`mb-1 ${errors.vehicle_type && 'is-invalid'}`}
                            aria-label="Small select example"
                            id="vehicle_type"
                          >
                            <option value="0">Select ...</option>
                            <option value="1">Freezer</option>
                            <option value="2">Dry</option>
                          </CFormSelect>
                        </CCol>

                        <CCol md={3}>
                          <CFormLabel htmlFor="vCap">
                          Vehicle Capacity in MTS <REQ />{' '}
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
                            id="vehicle_capacity_id"
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
                          <CFormLabel htmlFor="vehicle_feet_id">
                          Vehicle Feet <REQ />{' '}
                            {errors.vehicle_feet_id && (
                              <span className="small text-danger">
                                {errors.vehicle_feet_id}
                              </span>
                            )}
                          </CFormLabel>

                          <CFormSelect
                            size="sm"
                            name="vehicle_feet_id"
                            onChange={handleChange}
                            onFocus={onFocus}
                            value={values.vehicle_feet_id}
                            className={`mb-1 ${errors.vehicle_feet_id && 'is-invalid'}`}
                            aria-label="Small select example"
                            id="vehicle_feet_id"
                          >
                            <option value="0">Select ...</option>
                            {vehicleFeetData.map(({ id, capacity }) => {
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
                          <CFormLabel htmlFor="vBody">
                            Vehicle Body Type <REQ />{' '}
                            {errors.vehicle_body_type_id && (
                              <span className="small text-danger">
                                {errors.vehicle_body_type_id}
                              </span>
                            )}
                          </CFormLabel>
                          <CFormSelect
                            size="sm"
                            name="vehicle_body_type_id"
                            id="vehicle_body_type_id"
                            onFocus={onFocus}
                            onBlur={onBlur}
                            onChange={handleChange}
                            value={values.vehicle_body_type_id}
                            className={`mb-1 ${errors.vehicle_body_type_id && 'is-invalid'}`}
                            aria-label="Small select example"
                          >
                            <option value="0">Select ...</option>

                            {vehicleBodyData.map(({ id, body_type }) => {
                              return (
                                <>
                                  <option key={id} value={id}>
                                    {body_type}
                                  </option>
                                </>
                              )
                            })}
                          </CFormSelect>
                        </CCol>
                        <CCol md={3}>
                          <CFormLabel htmlFor="freight_type">
                            Freight Type <REQ />{' '}
                            {errors.freightType && (
                              <span className="small text-danger">{errors.freight_type}</span>
                            )}
                          </CFormLabel>
                          <CFormSelect
                            size="sm"
                            name="freight_type"
                            onChange={handleChange}
                            onFocus={onFocus}
                            value={values.freight_type}
                            className={`mb-1 ${errors.freight_type && 'is-invalid'}`}
                            aria-label="Small select example"
                            id="freight_type"
                          >
                            <option value="0">Select ...</option>
                            <option value="1">Budget</option>
                            <option value="2">Actual</option>
                          </CFormSelect>
                        </CCol>
                        {/* {values.freight_type === '2'&& (
                          <>    */}
                          <CCol md={3}>
                          <CFormLabel htmlFor="vehicle_freight">
                            Vehicle Based Freight <REQ />{' '}
                            {errors.vehicle_freight && (
                              <span className="small text-danger">{errors.vehicle_freight}</span>
                            )}
                          </CFormLabel>
                          <CFormSelect
                            size="sm"
                            name="vehicle_freight"
                            onChange={handleChange}
                            onFocus={onFocus}
                            value={values.vehicle_freight}
                            className={`mb-1 ${errors.vehicle_freight && 'is-invalid'}`}
                            aria-label="Small select example"
                            id="vehicle_freight"
                          >
                            <option value="0">Select ...</option>
                            <option value="1">Yes</option>
                            <option value="2">No</option>
                          </CFormSelect>
                        </CCol>
                        {/* {values.vehicle_freight === '1'&&
                        values.freight_type === '2'&& (
                          <>    */}
                          <CCol md={3}>
                          <CFormLabel htmlFor="vehicle_freight_per_km">
                            Vehicle Trip Freight
                            {errors.freightType && (
                              <span className="small text-danger">{errors.vehicle_freight}</span>
                            )}
                          </CFormLabel>
                          <CFormInput
                            name="vehicle_freight_per_km"
                            size="sm"
                            type='Number'
                            maxLength={5}
                            id="vehicle_freight_per_km"
                            onChange={handleChange}
                            value={values.vehicle_freight_per_km}
                            onFocus={onFocus}
                            onBlur={onBlur}
                            placeholder="Vehicle Trip Freight"
                          />
                        </CCol>
 {/* </>
    )}
 </>
    )}  */}

                        <CCol md={3}>
                          <CFormLabel htmlFor="insurance_validity">
                            Insurance Valid To <REQ />{' '}
                            {errors.insurance_validity && (
                              <span className="small text-danger">{errors.insurance_validity}</span>
                            )}
                          </CFormLabel>
                          <CFormInput
                            type="date"
                            onBlur={onBlur}
                            onFocus={onFocus}
                            onChange={handleChange}
                            size="sm"
                            required
                            value={values.insurance_validity}
                            id="insurance_validity"
                            name="insurance_validity"
                            placeholder="date"
                          />
                        </CCol>

                        <CCol md={3}>
                          <CFormLabel htmlFor="fc_validity">
                            FC Valid To <REQ />{' '}
                            {errors.fc_validity && (
                              <span className="small text-danger">{errors.fc_validity}</span>
                            )}
                          </CFormLabel>
                          <CFormInput
                            type="date"
                            onBlur={onBlur}
                            onFocus={onFocus}
                            onChange={handleChange}
                            size="sm"
                            value={values.fc_validity}
                            id="fc_validity"
                            name="fc_validity"
                            placeholder="date"
                          />
                        </CCol>

                      
                        {values.vehicle_type == 1 && (
                          <CCol md={3}>
                            <CFormLabel htmlFor="ac_non_ac">
                              Freezer Availability <REQ />{' '}
                              {errors.freightType && (
                                <span className="small text-danger">{errors.ac_non_ac}</span>
                              )}
                            </CFormLabel>
                            <CFormSelect
                              size="sm"
                              name="ac_non_ac"
                              onChange={handleChange}
                              onFocus={onFocus}
                              value={values.ac_non_ac}
                              className={`mb-1 ${errors.ac_non_ac && 'is-invalid'}`}
                              aria-label="Small select example"
                              id="ac_non_ac"
                            >
                              <option value="0">Select ...</option>
                              <option value="1">Yes</option>
                              <option value="2">No</option>
                            </CFormSelect>
                          </CCol>
                           )}
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
                          <Link to={'/IfoodsVehicleMasterTable'}>
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

export default DepoVehicleMasterEdit
