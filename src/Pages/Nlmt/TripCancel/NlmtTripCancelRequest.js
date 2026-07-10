import {
  CButton,
  CCard,
  CCol, 
  CForm,
  CFormInput,
  CFormLabel, 
  CRow,
  CTabContent, 
  CTabPane, 
  CModal, 
  CModalBody,
  CModalFooter,
  CFormTextarea, 
} from '@coreui/react'
import React, { useState,useEffect } from 'react'
import useForm from 'src/Hooks/useForm.js'
import { Link, useNavigate, useParams } from 'react-router-dom'
import VehicleInspectionValidation from 'src/Utils/TransactionPages/VehicleInspection/VehicleInspectionValidation'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Loader from 'src/components/Loader'
import ParkingYardGateService from 'src/Service/ParkingYardGate/ParkingYardGateService'
import VehicleCapacityService from 'src/Service/SmallMaster/Vehicles/VehicleCapacityService'
import TripSheetCreationService from 'src/Service/TripSheetCreation/TripSheetCreationService'

import AccessDeniedComponent from 'src/components/commoncomponent/AccessDeniedComponent'
import JavascriptInArrayComponent from 'src/components/commoncomponent/JavascriptInArrayComponent'
import * as NlmtScreenAccessCodes from 'src/components/constants/NlmtScreenAccessCodes' 
import TripSheetInfoService from 'src/Service/PurchasePro/TripSheetInfoService'
import VehicleVarietyService from 'src/Service/SmallMaster/Vehicles/VehicleVarietyService'
import DivisionApi from 'src/Service/SubMaster/DivisionApi'
import DepartmentApi from 'src/Service/SubMaster/DepartmentApi'
import DefinitionsListApi from 'src/Service/Definitions/DefinitionsListApi'
import VehicleBodyTypeService from 'src/Service/SmallMaster/Vehicles/VehicleBodyTypeService'
import VehicleRequestMasterService from 'src/Service/VehicleRequest/VehicleRequestMasterService'
import FCIPlantMasterService from 'src/Service/FCIMovement/FCIPlantMaster/FCIPlantMasterService'
import NlmtTSCreationService from 'src/Service/Nlmt/TSCreation/NlmtTSCreationService'
import NlmtTripInService from 'src/Service/Nlmt/TripIn/NlmtTripInService'

const NlmtTripCancelRequest = () => {
  const user_info_json = localStorage.getItem('user_info')
  const user_info = JSON.parse(user_info_json)

  /* Get User Id From Local Storage */
  const user_id = user_info.user_id

  /* ==================== Access Part Start ========================*/
  const [screenAccess, setScreenAccess] = useState(false)

  let page_no = NlmtScreenAccessCodes.NlmtTransactionScreens.Nlmt_Tripsheet_Edit

  useEffect(()=>{

    if(user_info.is_admin == 1 || JavascriptInArrayComponent(page_no,user_info.page_permissions)){
      console.log('screen-access-allowed')
      setScreenAccess(true)
    } else{
      console.log('screen-access-not-allowed')
      setScreenAccess(false)
    }

     /* section for getting Rmsto Process Types Master List from database */
     DefinitionsListApi.visibleDefinitionsListByDefinition(26).then((response) => {
      console.log(response.data.data,'setRmstoProcessTypes')
      setRmstoProcessTypes(response.data.data)
    })

  },[])
  /* ==================== Access Part End ========================*/

  const formValues = {
    vehicle_id: '',
    truck_clean: '',
    bad_smell: '',
    insect_vevils_presence: '',
    tarpaulin_srf: '',
    tarpaulin_non_srf: '',
    insect_vevils_presence_in_tar: '',
    truck_platform: '',
    previous_load_details: '',
    remarks: '',
  }

  const [rmstoProcessTypes, setRmstoProcessTypes] = useState([])

  const { values, errors, handleChange, onFocus, handleSubmit, enableSubmit, onBlur, isTouched } =
    useForm(TripSheetCancel, VehicleInspectionValidation, formValues)

  const navigation = useNavigate() 

  function TripSheetCancel  () {
    console.log(currentVehicleInfo) 
    
    let veh_type = vehicleType[currentVehicleInfo.vehicle_info.vehicle_type_id]
    console.log(veh_type,'TripSheetCancel-veh_type')

    // setFetch(true)
    // return false
 
    let data = new FormData()
    data.append('parking_id', currentVehicleInfo.nlmt_trip_in_id) 
    data.append('remarks', remarks || '')
    data.append('updated_by', user_id)

    console.log(values.remarks)

    if (remarks == '' || remarks == null) {
      toast.warning('Remarks Field is Mandatory')
      setFetch(true)
      return false
    }
      
    console.log(data)
    NlmtTSCreationService.tripInfo_cancel(id,data).then((res) => {
    // NlmtTSCreationService.tripSheet_cancel(id,data).then((res) => {
      if (res.status == 200) {
        setFetch(true)
        toast.success('Trip Info. Cancelled Sucessfully')
        navigation('/NlmtTripCancel') 
      } else {
        setFetch(true)
        toast.warning('Trip Info. Cancellation failed. Kindly Contact Admin..!')
        return false
      }
    })

    .catch((error) => {
      setFetch(true)
      toast.warning(error)
    })      

  }

  const [currentVehicleInfo, setCurrentVehicleInfo] = useState({})
  const [fetch, setFetch] = useState(false)
  const [confirmBtn, setConfirmBtn] = useState(false)
  const [confirmBtn1, setConfirmBtn1] = useState(false)

  const { id } = useParams()

  const vehicleType = {
    21: "Own",
    22: "Hire",
    23: "Party"
  }

  useEffect(() => {

    NlmtTripInService.getTripInfoById(id).then((res) => {
      setFetch(true)
      console.log(res.data,'getTripsheetInfoById') 
      setCurrentVehicleInfo(res.data.data)
      console.log(res.data.data)
    })
  }, [id])

  const [remarks, setRemarks] = useState('')
  const handleChangenew = event => {
    const result = event.target.value.toUpperCase()
    setRemarks(result);
  }


  const [vehicleCapacity, setVehicleCapacity] = useState([]) 

  useEffect(() => {
    // section for getting vehicle capacity from database
    VehicleCapacityService.getVehicleCapacity().then((res) => {
      setFetch(true)
      setVehicleCapacity(res.data.data)
    })
  }, [])

  const veh_capacity_finder = (capacity) => {
    let cap = ''
    if(vehicleCapacity.length > 0){
      vehicleCapacity.map((vv,kk)=>{
        if(capacity == vv.id){
          cap = vv.capacity
        }
      })
    }
    return cap
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
                  <CForm className="container p-3" onSubmit={handleSubmit}>
                    <CRow className="">
                      <CCol md={3}>
                        <CFormLabel htmlFor="vType">Vehicle Type</CFormLabel>
                        <CFormInput
                          name="vType"
                          size="sm"
                          id="vType"
                          value={currentVehicleInfo.vehicle_info ? vehicleType[currentVehicleInfo.vehicle_info.vehicle_type_id] : '-'}
                          placeholder=""
                          readOnly
                        />
                      </CCol>

                      <CCol md={3}>
                        <CFormLabel htmlFor="vNum">Vehicle Number</CFormLabel>
                        <CFormInput
                          name="vNum"
                          size="sm"
                          id="vNum"
                          value={currentVehicleInfo.vehicle_info ? currentVehicleInfo.vehicle_info.vehicle_number : '-'}
                          placeholder=""
                          readOnly
                        />
                      </CCol>
                      <CCol md={3}>
                        <CFormLabel htmlFor="vNum">Vehicle Capacity In MTS</CFormLabel>
                        <CFormInput
                          name="vNum"
                          size="sm"
                          id="vNum"
                          value={currentVehicleInfo.vehicle_info ? veh_capacity_finder(currentVehicleInfo.vehicle_info.vehicle_capacity_id) : '-'}
                          placeholder=""
                          readOnly
                        />
                      </CCol>

                      <CCol xs={12} md={3}>
                        <CFormLabel htmlFor="driverId">
                          Driver Name
                          {errors.driverId && (
                            <span className="small text-danger">{errors.driverId}</span>
                          )}
                        </CFormLabel>

                        <CFormInput
                          name="driverId"
                          size="sm"
                          id="driverId"
                          value={currentVehicleInfo?.driver_name}
                          placeholder="10"
                          readOnly
                        />
  
                      </CCol>
                      <CCol xs={12} md={3}>
                        <CFormLabel htmlFor="dMob">Driver Contact Number</CFormLabel>
                        <CFormInput
                          name="dMob"
                          size="sm"
                          id="dMob"
                          value={currentVehicleInfo?.driver_phone_1}
                          readOnly
                        />
                      </CCol> 
                      <CCol xs={12} md={3}>
                        <CFormLabel htmlFor="remarks">Remarks</CFormLabel>
                        <CFormTextarea
                          id="remarks"
                          onFocus={onFocus}
                          onBlur={onBlur}
                          onChange={handleChangenew}
                          value={remarks}
                          name="remarks"
                          rows="1"
                        >
                        </CFormTextarea>
                      </CCol>

                    </CRow>
                    <CRow className="mt-2">
                      <CCol>
                        <Link to={'/NlmtTripCancel'}>
                          <CButton
                            md={9}
                            size="sm"
                            color="primary"
                            disabled=""
                            className="text-white"
                            type="button"
                          >
                            Previous
                          </CButton>
                        </Link>
                      </CCol>

                      <CCol
                        className="pull-right"
                        xs={12}
                        sm={12}
                        md={3}
                        style={{ display: 'flex', justifyContent: 'flex-end' }}
                      >
                        {/* {!(values.purpose == 3 || values.purpose == 4) && ( */}
                        {!(values.purpose == 4 || values.purpose == null) && (
                          <CButton
                            size="sm"
                            color="warning"
                            className="mx-1 px-2 text-white"
                            type="button"
                            // disabled={acceptBtn}
                            onClick={() => {
                              setConfirmBtn(true)
                            }}
                          >
                            Submit
                          </CButton>
                        )}
                      {((currentVehicleInfo.vehicle_current_position == '16' && currentVehicleInfo?.tripsheet_info?.advance_status == '0') || values.purpose == null) &&
                        <CButton
                          size="sm"
                          color="warning"
                          className="mx-1 px-2 text-white"
                          type="button"
                          // disabled={acceptBtn}
                          onClick={() => {
                            setConfirmBtn1(true)

                          }}
                        >
                          Trip Cancel
                        </CButton>}
                        {/* {(!(values.purpose == 3 || values.purpose == 4 || values.purpose == 5) && !changeDriver && currentVehicleInfo?.trip_sheet_info?.advance_status == '0' &&
                              (currentVehicleInfo?.vehicle_type_id?.id == VEHICLE_TYPE.OWN) ||
                            currentVehicleInfo?.vehicle_type_id?.id == VEHICLE_TYPE.CONTRACT) ? (
                              <CButton
                                size="sm"
                                color="warning"
                                className="mx-1 px-2 text-white"
                                type="button"
                                onClick={() => {
                                  setOldDriver(currentVehicleInfo?.driver_id)
                                  setChangeDriver(true)
                                  setDriverChange(true)
                                }}
                              >
                                Assign Driver
                              </CButton>
                            ) : (
                              <></>
                            )} */}
                      </CCol>
                    </CRow>
                  </CForm>
                </CTabPane>
              </CTabContent>
            </CCard>
          </>
          ) : (<AccessDeniedComponent />)}
   	    </>
      )}
      <CModal visible={confirmBtn} onClose={() => setConfirmBtn(false)}>
        <CModalBody>
          <p className="lead">Are You sure To Edit TripSheet ? </p>
        </CModalBody>
        <CModalFooter>
          <CButton className="m-2" color="secondary" onClick={() =>setConfirmBtn(false)}>
            No
          </CButton>
          <CButton color="warning" onClick={() => {
            setConfirmBtn(false)
            setFetch(false)
            UpdateTripsheetVehicle()}}>
            Yes
          </CButton>
        </CModalFooter>
      </CModal>

      <CModal visible={confirmBtn1} onClose={() => setConfirmBtn1(false)}>
        <CModalBody>
          <p className="lead" style={{ color:'red' }}>Are You sure To Cancel This Trip ? </p>
        </CModalBody>
        <CModalFooter>
          <CButton className="m-2" color="secondary" onClick={() =>setConfirmBtn1(false)}>
            No
          </CButton>
          <CButton 
            color="warning" 
            onClick={() => {
              setConfirmBtn1(false)
              setFetch(false)
              TripSheetCancel()
            }}>
            Yes
          </CButton>
        </CModalFooter>
      </CModal>

    </>
  )
}

export default NlmtTripCancelRequest
