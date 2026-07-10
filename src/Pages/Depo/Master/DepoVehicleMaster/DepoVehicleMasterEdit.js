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
  CTabPane
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

const DepoVehicleMasterEdit = () => {
  const { id } = useParams()

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
    const [errorModal, setErrorModal] = useState(false)
    const [error, setError] = useState({})
    const [submitBtn, setSubmitBtn] = useState(true)
    const [vehicleCapacityData, setVehicleCapacityData] = useState([])
    const [vehicleBodyData, setVehicleBodyData] = useState([])
    const [existingVehiclesData, setExistingVehiclesDataData] = useState([])
    const [contractorData, setContractorData] = useState([])
    const [oldContractorId, setOldContractorId] = useState([])
    const [oldVehicleNo, setOldVehicleNo] = useState([])
    const [singleVehicleInfo, setSingleVehicleInfo] = useState([])


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


      if(singleVehicleInfo) {
        // let cName = contractorError ? false : true
        let cName = !errors.depoContractorName && values.depoContractorName
        let vOwnerName = !errors.vehicleOwnerName && values.vehicleOwnerName
        let vNumber = !errors.vehicleNumber && values.vehicleNumber
        let vOwnerNumber = !errors.vehicleOwnerNumber && values.vehicleOwnerNumber
        let vCapacity = !errors.vehicleCapacity && values.vehicleCapacity
        let vBodyType = !errors.vehicleBodyType && values.vehicleBodyType
        let iValidity = !errors.insuranceValidity && values.insuranceValidity
        let fValidity  = !errors.fcValidity && values.fcValidity

        let condition_check = cName && vOwnerName && vNumber && vOwnerNumber && vCapacity && vBodyType && iValidity && fValidity

        console.log(condition_check,'condition_check')

        if (condition_check) {
          setSubmitBtn(false)
        } else {
          setSubmitBtn(true)
        }
      }
    }, [values, errors, singleVehicleInfo])

  function addNewVehicle() {
    setFetch(false)
    const formData = new FormData()

    formData.append('_method', 'PUT')
    formData.append('contractor_id', values.depoContractorName)
    formData.append('vehicle_number', values.vehicleNumber)
    formData.append('vehicle_capacity_id', values.vehicleCapacity)
    formData.append('vehicle_body_type_id', values.vehicleBodyType)
    formData.append('insurance_validity', values.insuranceValidity)
    formData.append('fc_validity', values.fcValidity)
    formData.append('vehicle_owner_name', values.vehicleOwnerName)
    formData.append('vehicle_owner_number', values.vehicleOwnerNumber)
    formData.append('updated_by', user_id)

    if(values.vehicleNumber == oldVehicleNo && values.depoContractorName == oldContractorId)
    {
      // No Validation need
    } else {
      /* Duplicate Vehicle Check */
      if(vehicleInfoAlreadyExists(values.vehicleNumber,values.depoContractorName)){
        setFetch(true)
        toast.warning('Vehicle already exists for the selected contractor..')
        return false
      }
    }
    console.log(values)

    DepoVehicleMasterService.updateVehicles(id, formData).then((res) => {
      setFetch(true)
      if (res.status === 200) {
        for (let value of formData.values()) {
          console.log(value)
        }

        toast.success('Depo Vehicle Updated Successfully!')

        setTimeout(() => {
          navigation('/DepoVehicleMasterTable')
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
    DepoVehicleMasterService.getDepoVehicleById(id).then((res) => {
      setFetch(true)
      let vehicle_data = res.data.data
      console.log(res.data.data,'Vehicles info')
      values.depoContractorName = vehicle_data.Depo_Contractor_info.id
      setOldContractorId(vehicle_data.Depo_Contractor_info.id)
      setOldVehicleNo(vehicle_data.vehicle_number)
      values.vehicleNumber = vehicle_data.vehicle_number
      values.vehicleCapacity = res.data.data.vehicle_capacity_info.id
      values.vehicleBodyType = res.data.data.vehicle_body_type_info.id
      values.insuranceValidity = vehicle_data.insurance_validity
      values.fcValidity = vehicle_data.fc_validity
      values.vehicleOwnerName = vehicle_data.vehicle_owner_name
      values.vehicleOwnerNumber = vehicle_data.vehicle_owner_number
      setSingleVehicleInfo(vehicle_data)
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
                          <CFormLabel htmlFor="vNum">
                            Vehicle Number
                            <REQ />
                            {errors.vehicleNumber && (
                              <span className="small text-danger">{errors.vehicleNumber}</span>
                            )}
                          </CFormLabel>
                          <CFormInput
                            name="vehicleNumber"
                            size="sm"
                            maxLength={10}
                            id="vNum"
                            onChange={handleChange}
                            value={values.vehicleNumber}
                            onFocus={onFocus}
                            onBlur={onBlur}
                            placeholder=""
                          />
                        </CCol>

                        <CCol md={3}>
                          <CFormLabel htmlFor="vehicleCapacity">
                            Vehicle Capacity
                            <REQ />{' '}
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
                          <CFormLabel htmlFor="vehicleBodyType">
                            Vehicle Body Type
                            <REQ />{' '}
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
                      </CRow>

                      <CRow className="mb-md-1">
                        <CCol md={3}>
                          <CFormLabel htmlFor="insuranceValidity">
                            Insurance Validity
                            <REQ />
                            {errors.insuranceValidity && (
                              <span className="small text-danger">{errors.insuranceValidity}</span>
                            )}
                          </CFormLabel>
                          <CFormInput
                            type="date"
                            onBlur={onBlur}
                            value={values.insuranceValidity}
                            onChange={handleChange}
                            size="sm"
                            required
                            id="insuranceValidity"
                            name="insuranceValidity"
                            placeholder="date"
                          />
                        </CCol>
                        <CCol md={3}>
                          <CFormLabel htmlFor="fcValidity">
                            FC Validity
                            <REQ />
                            {errors.fcValidity && (
                              <span className="small text-danger">{errors.fcValidity}</span>
                            )}
                          </CFormLabel>
                          <CFormInput
                            type="date"
                            size="sm"
                            required
                            value={values.fcValidity}
                            onBlur={onBlur}
                            onChange={handleChange}
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
                            UPDATE
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
