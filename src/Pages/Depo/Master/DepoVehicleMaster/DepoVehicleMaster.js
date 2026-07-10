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

const DepoVehicleMaster = () => {
  const formValues = {
    vehicleNumber: '',
    vehicleCapacity: '',
    depoContractorName: '',
    vehicleBodyType: '',
    insuranceValidity: '',
    fcValidity: '',
    vehicleOwnerName: '',
    vehicleOwnerNumber: '',
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
  let page_no = LogisticsProScreenNumberConstants.DepoModuleScreens.Depo_Vehicle_Master

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
  const [submitBtn, setSubmitBtn] = useState(true)
  const [vehicleBodyData, setVehicleBodyData] = useState([])
  const [vehicleCapacityData, setVehicleCapacityData] = useState([])
  const [existingVehiclesData, setExistingVehiclesDataData] = useState([])
  const [contractorName, setContractorName] = useState('')
  const [contractorError, setContractorError] = useState(true)
  const [contractorData, setContractorData] = useState([])


  const { values, errors, handleChange, onFocus, handleSubmit, onBlur } = useForm(
    addNewVehicle,
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

    //section for getting vehicle List from database
    DepoVehicleMasterService.getDepoVehicles().then((response)=>{
      setExistingVehiclesDataData(response.data.data)
    })

    //section for getting Contractor Data from database
    DepoContractorMasterService.getActiveDepoContractors().then((res) => {
      setContractorData(res.data.data)
    })

  }, [])

  useEffect(() => {

    //section for getting Contractor Data from database
    DepoContractorMasterService.getActiveDepoContractors().then((res) => {
      console.log(res.data.data)
      setContractorData(res.data.data)
    })

  }, [])

  const onChangeFilter = (event) => {
    var selected_value = event.value
    console.log(selected_value, 'selected_value')
    if (selected_value) {
      setContractorName(selected_value)
      setContractorError(false)
    } else {
      setContractorName('')
      setContractorError(true)
    }
  }

  const vehicleInfoAlreadyExists = (vehNo,conId) => {
    let vehicle_exists = 0
    existingVehiclesData.map((vv,kk)=>{
      if(vv.contractor_id == conId && vv.vehicle_number == vehNo){
        vehicle_exists = 1
      }
    })
    console.log(vehicle_exists,'vehicle_exists-vehicleInfoAlreadyExists')
    if(vehicle_exists == 1){
      return true
    }
    return false
  }

  useEffect(() => {

    setFetch(true)
    let cName = contractorError ? false : true
    let vOwnerName = !errors.vehicleOwnerName && values.vehicleOwnerName
    let vNumber = !errors.vehicleNumber && values.vehicleNumber
    let vOwnerNumber = !errors.vehicleOwnerNumber && values.vehicleOwnerNumber
    let vCapacity = !errors.vehicleCapacity && values.vehicleCapacity
    let vBodyType = !errors.vehicleBodyType && values.vehicleBodyType
    let iValidity = !errors.insuranceValidity && values.insuranceValidity
    let fValidity  = !errors.fcValidity && values.fcValidity

    values.depoContractorName = contractorName

    let condition_check = cName && vOwnerName && vNumber && vOwnerNumber && vCapacity && vBodyType && iValidity && fValidity

    console.log(condition_check,'condition_check')

    if (condition_check) {
      setSubmitBtn(false)
    } else {
      setSubmitBtn(true)
    }
  }, [values, errors, contractorError])

  function addNewVehicle() {

    setFetch(false)
    const formData = new FormData()
    // formData.append('contractor_id', values.depoContractorName)
    formData.append('contractor_id', contractorName)
    formData.append('vehicle_number', values.vehicleNumber)
    formData.append('vehicle_capacity_id', values.vehicleCapacity)
    formData.append('vehicle_body_type_id', values.vehicleBodyType)
    formData.append('insurance_validity', values.insuranceValidity)
    formData.append('fc_validity', values.fcValidity)
    formData.append('vehicle_owner_name', values.vehicleOwnerName)
    formData.append('vehicle_owner_number', values.vehicleOwnerNumber)
    formData.append('created_by', user_id)

    console.log(existingVehiclesData,'existingVehiclesData')

    /* Duplicate Vehicle Check */
    if(vehicleInfoAlreadyExists(values.vehicleNumber,contractorName)){
      setFetch(true)
      toast.warning('Vehicle already exists for the same contractor..')
      return false
    }

    DepoVehicleMasterService.createDepoVehicle(formData).then((res) => {

      if (res.status == 201) {
        setFetch(true)
        toast.success('Vehicle Created Successfully!')

        setTimeout(() => {
          navigation('/DepoVehicleMasterTable')
        }, 1000)
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
                          <CFormLabel htmlFor="depoContractorName">
                            Contractor Name <REQ />{' '}
                            {contractorError && (
                              <span className="small text-danger">Required</span>
                            )}
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
                            label="Select Contractor Name"
                            noOptionsMessage="Contractor Not found"
                            search_type="depo_contractors"
                            search_data={contractorData}
                          />
                        </CCol>

                        <CCol md={3}>
                          <CFormLabel htmlFor="contractorOwnerName">
                            Vehicle Number <REQ />{' '}
                            {errors.vehicleNumber && (
                              <span className="small text-danger">{errors.vehicleNumber}</span>
                            )}
                          </CFormLabel>
                          <CFormInput
                            name="vehicleNumber"
                            size="sm"
                            maxLength={15}
                            id="vehicleNumber"
                            onChange={handleChange}
                            value={values.vehicleNumber}
                            onFocus={onFocus}
                            onBlur={onBlur}
                            placeholder=""
                          />
                        </CCol>

                        <CCol md={3}>
                          <CFormLabel htmlFor="vCap">
                            Vehicle Capacity in MTS <REQ />{' '}
                            {errors.vehicleCapacity && (
                              <span className="small text-danger">{errors.vehicleCapacity}</span>
                            )}
                          </CFormLabel>

                          <CFormSelect
                            size="sm"
                            name="vehicleCapacity"
                            onChange={handleChange}
                            onFocus={onFocus}
                            value={values.vehicleCapacity}
                            className={`mb-1 ${errors.vehicleCapacity && 'is-invalid'}`}
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
                          <CFormLabel htmlFor="vBody">
                            Vehicle Body Type <REQ />{' '}
                            {errors.vehicleBodyType && (
                              <span className="small text-danger">{errors.vehicleBodyType}</span>
                            )}
                          </CFormLabel>
                          <CFormSelect
                            size="sm"
                            name="vehicleBodyType"
                            id="vBody"
                            onFocus={onFocus}
                            onBlur={onBlur}
                            onChange={handleChange}
                            value={values.vehicleBodyType}
                            className={`mb-1 ${errors.vehicleBodyType && 'is-invalid'}`}
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
                          <CFormLabel htmlFor="insuranceValidity">
                            Insurance Valid To <REQ />{' '}
                            {errors.insuranceValidity && (
                              <span className="small text-danger">{errors.insuranceValidity}</span>
                            )}
                          </CFormLabel>
                          <CFormInput
                            type="date"
                            onBlur={onBlur}
                            onFocus={onFocus}
                            onChange={handleChange}
                            size="sm"
                            required
                            value={values.insuranceValidity}
                            id="insuranceValidity"
                            name="insuranceValidity"
                            placeholder="date"
                          />
                        </CCol>

                        <CCol md={3}>
                          <CFormLabel htmlFor="fcValidity">
                            FC Valid To <REQ />{' '}
                            {errors.fcValidity && (
                              <span className="small text-danger">{errors.fcValidity}</span>
                            )}
                          </CFormLabel>
                          <CFormInput
                            type="date"
                            onBlur={onBlur}
                            onFocus={onFocus}
                            onChange={handleChange}
                            size="sm"
                            required
                            value={values.fcValidity}
                            id="fcValidity"
                            name="fcValidity"
                            placeholder="date"
                          />
                        </CCol>

                        <CCol md={3}>
                          <CFormLabel htmlFor="contractorName">
                            Vehicle Owner Name <REQ />{' '}
                            {errors.vehicleOwnerName && (
                              <span className="small text-danger">{errors.vehicleOwnerName}</span>
                            )}
                          </CFormLabel>
                          <CFormInput
                            name="vehicleOwnerName"
                            size="sm"
                            maxLength={30}
                            id="vehicleOwnerName"
                            onChange={handleChange}
                            value={values.vehicleOwnerName}
                            onFocus={onFocus}
                            onBlur={onBlur}
                            placeholder=""
                          />
                        </CCol>

                        <CCol md={3}>
                          <CFormLabel htmlFor="contractorNumber">
                            Vehicle Owner Number <REQ />{' '}
                            {errors.vehicleOwnerNumber && (
                              <span className="small text-danger">{errors.vehicleOwnerNumber}</span>
                            )}
                          </CFormLabel>
                          <CFormInput
                            name="vehicleOwnerNumber"
                            size="sm"
                            maxLength={10}
                            id="vehicleOwnerNumber"
                            onChange={handleChange}
                            value={values.vehicleOwnerNumber}
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
                            onClick={addNewVehicle}
                          >
                            ADD
                          </CButton>
                          <Link to={'/DepoVehicleMasterTable'}>
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
            </>) : (<AccessDeniedComponent />
          )}
        </>
      )}
    </>
  )
}

export default DepoVehicleMaster
