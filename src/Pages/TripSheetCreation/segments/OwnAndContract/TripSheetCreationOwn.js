import {
  CButton,
  CCardImage,
  CCol,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CFormTextarea,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
} from '@coreui/react'
import React, { useState } from 'react'
import { useEffect } from 'react'
import AllDriverListSelectComponent from 'src/components/commoncomponent/AllDriverListSelectComponent'
import DivisonListComponent from 'src/components/commoncomponent/DivisonListComponent'
import DriverListSearchSelect from 'src/components/commoncomponent/DriverListSearchSelect'
import DriverListSelectComponent from 'src/components/commoncomponent/DriverListSelectComponent'
import ParkingYardGateService from 'src/Service/ParkingYardGate/ParkingYardGateService'
import DriverMasterService from '../../../../Service/Master/DriverMasterService'
import VehicleVarietyService from 'src/Service/SmallMaster/Vehicles/VehicleVarietyService'
import VehicleGroupService from 'src/Service/SmallMaster/Vehicles/VehicleGroupService'
import VehicleRequestsComponent from 'src/components/commoncomponent/VehicleRequestsComponent'
import FCIPlantListSearchSelect from 'src/Pages/FCIMovement/CommonMethods/FCIPlantListSearchSelect'
import FCIPlantMasterService from 'src/Service/FCIMovement/FCIPlantMaster/FCIPlantMasterService'

const TripSheetCreationOwn = ({
  values,
  errors,
  handleChange,
  handleMultipleChange,
  onFocus,
  handleSubmit,
  enableSubmit,
  onBlur,
  singleVehicleInfo,
  isTouched,
  setDirverAssign,
  dirverAssign,
  setDriverChange,
  driverChange,
  setDriverPhoneNumberById,
  DriverPhoneNumberById,
  setChangeDriverData,
  setChangeFciPlantData,
  changeDriverData,
  Purpose,
  SourcedBy,
  OtherProcess,
  rmstoProcessTypes,
  DivisonList,
  onReceiveData,
}) => {
  const [OdometerPhoto, setOdometerPhoto] = useState(false)
  const REQ = () => <span className="text-danger"> * </span>
  const [vehicleVarietyData, setVehicleVarietyData] = useState([])
  const [vehicleGroupData, setVehicleGroupData] = useState([])
  const [driverChange1, setDriverChange1] = useState(false)
  const [singleFciPlantData, setSingleFciPlantData] = useState([])
  const [fciPlantData, setFciPlantData] = useState([])
  // const [driverPhoneNumberById, setDriverPhoneNumberById] = useState('')

  const onChangeFCI = (event) => {
    let shedId = event.value
    console.log(shedId,'shedId')
    if(shedId == ''){
      errors.plantName = 'Required'
    } else {
      errors.plantName = ''
    }
    if (shedId) {
      values.plantName = shedId

      FCIPlantMasterService.getFCIPlantListById(shedId).then((res) => {
        console.log(res.data.data,'getFCIPlantListById')
        setSingleFciPlantData(res.data.data) 
        setChangeFciPlantData(res.data.data)
      })
     console.log(singleFciPlantData,'singleFciPlantData')
    } else {
      values.plantName = ''
      setSingleFciPlantData([]) 
      setChangeFciPlantData({})
    }
  }

  const ColoredLine = ({ color }) => (
    <hr
      style={{
        color: color,
        backgroundColor: color,
        height: 5
      }}
    />
  )

  const fciPlantInfoFinder = (value,type) => {
    let fciData = {}
    fciPlantData.map((vh,kh)=>{
      if(vh.plant_id == value){
        fciData = vh
      }
    })
    console.log(fciData,'fciData')

    let neededValueArray = ['',fciData['plant_name'],fciData['plant_symbol'],fciData['company_name'],fciData['street_no'],fciData['street_name'],fciData['city'],fciData['state'],fciData['region'],fciData['postal_code'],fciData['gst_no'],fciData['remarks']]
    console.log(neededValueArray,'neededValueArray')

    return neededValueArray[type]

  }

  useEffect(() => {
    //section for getting vehicle variety from database
    VehicleVarietyService.getVehicleVariety().then((res) => {
      setVehicleVarietyData(res.data.data)
    })

    /* section for getting FCI Plant Lists from database */ 
    FCIPlantMasterService.getActiveFCIPlantRequestTableData().then((response) => { 
      let viewData = response.data.data
      console.log(viewData,'FCI Plant Data')
      setFciPlantData(viewData)
    })

    //section for getting vehicle group from database
    VehicleGroupService.getVehicleGroup().then((res) => {
      setVehicleGroupData(res.data.data)
    })
  },[singleVehicleInfo])

  const get_vehicle_variety_by_id = (id) => {
    let val = ''
    vehicleVarietyData.map((vv,kk)=>{
      if(vv.id === id){
        val = vv.vehicle_variety
      }
    })
    return val
  }

  const get_vehicle_group_by_id = (id) => {
    let val = ''
    vehicleGroupData.map((vv,kk)=>{
      if(vv.id === id){
        val = vv.vehicle_group
      }
    })
    return val
  }

  useEffect(() => {
    DriverMasterService.getDriversById(values.driver_id).then((res) => {
      if (res.status === 200) {
        values.driveMobile = res.data.data.driver_phone_1
      }
    })
  }, [values.driver_id])

  useEffect(() => {
    if (driverChange) {
      if (values.driver_id) {
        //fetch to get Drivers info list form master by id
        ParkingYardGateService.getDriverInfoById(values.driver_id).then((res) => {
          setDriverPhoneNumberById(res.data.data.driver_phone_1)
          console.log(res.data.data,'getDriverInfoById')
          setChangeDriverData(res.data.data)
        })
      } else {
        setDriverPhoneNumberById('')
        setChangeDriverData({})
      }
    }
  }, [values.driver_id])

  useEffect(() => {
     
    if (values.plantName) { 
      FCIPlantMasterService.getFCIPlantListById(values.plantName).then((res) => {
        setDriverPhoneNumberById(res.data.data.driver_phone_1)
        console.log(res.data.data,'getDriverInfoById')
        setChangeFciPlantData(res.data.data)
      })
    } else { 
      setChangeFciPlantData({})
    }
    
  }, [values.plantName])

  const onChange = (event) => {
    let driver_id = event.value
    if (driver_id) {
      values.driver_id = driver_id
      ParkingYardGateService.getDriverInfoById(driver_id).then((res) => {
         setDriverPhoneNumberById(res.data.data.driver_phone_1)
         setChangeDriverData(res.data.data)
        //setDriverCodeById(res.data.data.driver_id)
      }
      )
     console.log(DriverPhoneNumberById)
    } else {
      values.driver_id = ''
      setDriverPhoneNumberById('')
      setChangeDriverData({})
       console.log(values.driver_id)
    }
  }

  const onChangeOthersTripsheet = (event,type) => {
    let change_value = event.value
    if(type == '1'){
      values.others_division = change_value
      values.others_department = ''
    } else {
      values.others_department = change_value
    }
    console.log(change_value,'change_value-home')
    console.log(type,'type-home')
  }

  return (
    <>
      <CRow className="">
        <CCol xs={12} md={3}>
          <CFormLabel htmlFor="vType">Vehicle Type</CFormLabel>
          <CFormInput
            size="sm"
            id="vType"
            value={singleVehicleInfo.vehicle_type_id.type}
            readOnly
          />
        </CCol>
        <CCol xs={12} md={3}>
          <CFormLabel htmlFor="vNum">Vehicle Number</CFormLabel>
          <CFormInput size="sm" id="vNum" value={singleVehicleInfo.vehicle_number} readOnly />
        </CCol>
        <CCol xs={12} md={3}>
          <CFormLabel htmlFor="vCap">Vehicle Capacity</CFormLabel>
          <CFormInput
            size="sm"
            id="vCap"
            value={singleVehicleInfo.vehicle_capacity_id.capacity + '-TON'}
            readOnly
          />
        </CCol>
        <CCol xs={12} md={3}>
          <CFormLabel htmlFor="vCap">Vehicle Variety / Group</CFormLabel>
          <CFormInput
            size="sm"
            id="vCap"
            value={`${get_vehicle_variety_by_id(singleVehicleInfo.vehicle_info.vehicle_variety_id)} / ${get_vehicle_group_by_id(singleVehicleInfo.vehicle_info.vehicle_group_id)}`}
            readOnly
          />
        </CCol>
        {/* <CCol xs={12} md={3}>
          <CFormLabel htmlFor="vCap">Vehicle Group</CFormLabel>
          <CFormInput
            size="sm"
            id="vCap"
            value={get_vehicle_group_by_id(singleVehicleInfo.vehicle_info.vehicle_group_id)}
            readOnly
          />
        </CCol> */}
        <CCol xs={12} md={3}>
          <CFormLabel htmlFor="driver_id">
            Driver Name <REQ />{' '}
            {errors.driver_id && <span className="small text-danger">{errors.driver_id}</span>}
          </CFormLabel>

          {dirverAssign ? (
            <CFormInput
              size="sm"
              id="driverName"
              value={singleVehicleInfo.driver_info.driver_name}
              readOnly
            />
          ) : (
            <DriverListSearchSelect
              size="sm"
              label="driver_id"
              id="driver_id"
              name="driver_id"
              onFocus={onFocus}
              onBlur={onBlur}
              onChange={(e) => {
                onChange(e)
              }}
              value={values.driver_id}
              //className={`${errors.driver_id && 'is-invalid'}`}
              aria-label="Small select example"
              search_type="driver_name"
            >
              {/* <AllDriverListSelectComponent /> */}
              {/* <DriverListSelectComponent /> */}
            </DriverListSearchSelect>
          )}
        </CCol>
      {/* </CRow>
      <CRow> */}
        <CCol xs={12} md={3}>
          <CFormLabel htmlFor="driveMobile">
            Driver Mobile Number
            {errors.driveMobile && <span className="small text-danger">{errors.driveMobile}</span>}
          </CFormLabel>
          <CFormInput
            size="sm"
            id="driveMobile"
            name="driveMobile"
            value={dirverAssign ? values.driveMobile : DriverPhoneNumberById}
            readOnly
          />
        </CCol>
        <CCol xs={12} md={3}>
          <CFormLabel htmlFor="OdometerKM">Odometer KM</CFormLabel>
          <CFormInput size="sm" id="OdometerKM" value={singleVehicleInfo.odometer_km} readOnly />
        </CCol>
        <CCol xs={12} md={3}>
          <CFormLabel htmlFor="odoImg">
            Odometer Photo
            {errors.vehicleType && <span className="small text-danger">{errors.vehicleType}</span>}
          </CFormLabel>

          <CButton
            onClick={() => setOdometerPhoto(!OdometerPhoto)}
            className="w-100 m-0"
            color="info"
            size="sm"
            id="odoImg"
          >
            <span className="float-start">
              <i className="fa fa-eye" aria-hidden="true"></i> &nbsp;View
            </span>
          </CButton>
          <CModal visible={OdometerPhoto} onClose={() => setOdometerPhoto(false)}>
            <CModalHeader>
              <CModalTitle>Odometer Photo</CModalTitle>
            </CModalHeader>
            <CModalBody>
              {singleVehicleInfo.odometer_photo &&
              !singleVehicleInfo.odometer_photo.includes('.pdf') ? (
                <CCardImage orientation="top" src={singleVehicleInfo.odometer_photo} />
              ) : (
                <iframe
                  orientation="top"
                  height={500}
                  width={475}
                  src={singleVehicleInfo.odometer_photo}
                ></iframe>
              )}
            </CModalBody>
            {/* <CModalBody>
              <CCardImage orientation="top" src={singleVehicleInfo.odometer_photo} />
            </CModalBody> */}
            <CModalFooter>
              <CButton color="secondary" onClick={() => setOdometerPhoto(false)}>
                Close
              </CButton>
            </CModalFooter>
          </CModal>
        </CCol>
        <CCol xs={12} md={3}>
          <CFormLabel htmlFor="gateInDateTime">Gate-In Date & Time</CFormLabel>
          <CFormInput
            size="sm"
            id="gateInDateTime"
            type="text"
            value={singleVehicleInfo.gate_in_date_time_string}
            readOnly
          />
        </CCol>
      {/* </CRow>
      <CRow> */}
        {singleVehicleInfo.trip_sto_status !== '1' && (
          <>
            <CCol xs={12} md={3}>
              <CFormLabel htmlFor="inspectionDateTime">Inspection Date & Time</CFormLabel>
              <CFormInput
                size="sm"
                id="inspectionDateTime"
                type="text"
                value={singleVehicleInfo.vehicle_inspection_trip.inspection_time_string}
                readOnly
              />
            </CCol>
          </>
        )}
        <CCol xs={12} md={3}>
          <CFormLabel htmlFor="purpose">
            Purpose <REQ />{' '}
            {errors.purpose && <span className="small text-danger">{errors.purpose}</span>}
          </CFormLabel>
          <CFormSelect
            size="sm"
            name="purpose"
            id="purpose"
            onFocus={onFocus}
            onBlur={onBlur}
            onChange={handleChange}
            disabled={singleVehicleInfo.trip_sto_status == '1' ? true : false}
            value={singleVehicleInfo.trip_sto_status != '1' ? values.purpose : (singleVehicleInfo.vehicle_current_position == '7' ? 4 : (singleVehicleInfo.vehicle_current_position == '10' ? 5 : 3))}
            className={`${errors.purpose && 'is-invalid'}`}
            aria-label="Small select example"
          >
            <option value="">Select...</option>
            {singleVehicleInfo.trip_sto_status == '1' &&
              Purpose.map(({ id, purpose }) => {
                return (
                  <>
                    <option value={id}>{purpose}</option>
                  </>
                )
              })
            }
            {Purpose.map(({ id, purpose }) => {
              if (!(id == 3 || id == 4 || id == 5)) {
                return (
                  <>
                    <option value={id}>{purpose}</option>
                  </>
                )
              }
            })}
          </CFormSelect>
        </CCol>
        {singleVehicleInfo.trip_sto_status == '1' && singleVehicleInfo.vehicle_current_position == '10' && (
          <CCol xs={12} md={3}>
            <CFormLabel htmlFor="plantName">
              FCI Plant Name
              <REQ />{' '}
              {errors.plantName && (
                <span className="small text-danger">{errors.plantName}</span>
              )}
            </CFormLabel>
              <FCIPlantListSearchSelect
                size="sm"
                className="mb-1"
                onChange={(e) => {
                  onChangeFCI(e)
                }}
                label="Plant Name"
                id="plantName"
                name="plantName"
                onFocus={onFocus}
                value={values.plantName}
                onBlur={onBlur}
                search_type="plant_name"
              />
          </CCol>
        )}
        {singleVehicleInfo.trip_sto_status == '1' && !(singleVehicleInfo.vehicle_current_position == '7' || singleVehicleInfo.vehicle_current_position == '10') && (
          <CCol xs={12} md={3}>
            <CFormLabel htmlFor="rmsto_type">
              RMSTO Type <REQ />{' '}
            </CFormLabel>
            <CFormSelect
              size="sm"
              name="rmsto_type"
              onFocus={onFocus}
              onBlur={onBlur}
              onChange={handleChange}
              value={values.rmsto_type}
              className={`${errors.rmsto_type && 'is-invalid'}`}
              aria-label="Small select example"
              id="rmsto_type"
            >
              <option value="">Select...</option>
              {rmstoProcessTypes.map(({definition_list_name}) => {
                return (
                  <>
                    <option value={definition_list_name}>{definition_list_name}</option>
                  </>
                )
              })}
            </CFormSelect>
          </CCol>
        )}
        {singleVehicleInfo.trip_sto_status == '1' && singleVehicleInfo.vehicle_current_position == '7' &&
          (
            <>
              {/* <CCol xs={12} md={3}>
                <CFormLabel htmlFor="others_process">
                  Process <REQ />{' '}
                </CFormLabel>
                <CFormSelect
                  size="sm"
                  name="others_process"
                  onFocus={onFocus}
                  onBlur={onBlur}
                  onChange={handleChange}
                  value={values.others_process}
                  className={`${errors.others_process && 'is-invalid'}`}
                  aria-label="Small select example"
                  id="others_process"
                >
                  <option value="">Select...</option>
                  {OtherProcess.map(({ id, process }) => {
                    return (
                      <>
                        <option value={id}>{process}</option>
                      </>
                    )
                  })}
                </CFormSelect>
              </CCol> */}
              <CCol xs={12} md={6}>
                <CFormLabel htmlFor="vehicle_request_no">
                  Vehicle Request No <REQ />{' '}
                  {errors.vehicle_request_no && (
                    <span className="small text-danger">{errors.vehicle_request_no}</span>
                  )}
                </CFormLabel>
                <VehicleRequestsComponent
                  size="sm"
                  name="vehicle_request_no"
                  id="vehicle_request_no"
                  onFocus={onFocus}
                  onBlur={onBlur}
                  onChange={handleMultipleChange}
                  // onChange={handleChange}
                  selectedValue={values.vehicle_request_no}
                  isMultiple={true}
                  className={`mb-1 ${errors.vehicle_request_no && 'is-invalid'}`}
                  label="Select VR"
                  noOptionsMessage="No VR found"
                  sendDataToParent={onReceiveData}
                />
                {/* <CFormSelect
                  size="sm"
                  name="vehicle_request_no"
                  onFocus={onFocus}
                  onBlur={onBlur}
                  // onChange={handleChange}
                  // value={values.vehicle_request_no}
                  className={`${errors.vehicle_request_no && 'is-invalid'}`}
                  aria-label="Small select example"
                  id="vehicle_request_no"
                  // multiple
                  // htmlSize={4}
                >
                  <option value="">Select...</option>
                  <option value="123456">123456</option>
                  <option value="123457">123457</option>
                  <option value="123458">123458</option>

                </CFormSelect> */}
              </CCol>
              {/* <CCol xs={12} md={6}>
                <CFormLabel htmlFor="others_division">
                  Division <REQ />{' '} /  Department <REQ />{' '}
                </CFormLabel>
                <div className='row'>
                  <OthersDivisionSearchSelect
                    size="sm"
                    label="Division"
                    id="others_division"
                    // name="others_division"
                    onFocus={onFocus}
                    onBlur={onBlur}
                    onChange={(e,val) => {
                      onChangeOthersTripsheet(e,val)
                    }}
                    // value={values.others_division}
                    aria-label="Small select example"
                    search_type="division_name"
                  />
                </div>
              </CCol> */}
              {/* <CCol xs={12} md={3}>
                <CFormLabel htmlFor="others_department">
                  Department <REQ />{' '}

                </CFormLabel>

                <OthersDepartmentSearchSelect
                  size="sm"
                  label="Department"
                  id="others_department"
                  name="others_department"
                  onFocus={onFocus}
                  onBlur={onBlur}
                  onChange={(e) => {
                    onChangeOthersTripsheet(e,2)
                  }}
                  value={values.others_department}
                  aria-label="Small select example"
                  search_type="department_name"
                >
                </OthersDepartmentSearchSelect>
              </CCol> */}

            </>
          )
        }

        {values.purpose == 2 &&
        singleVehicleInfo.vehicle_type_id.id != 1 &&
        singleVehicleInfo.vehicle_type_id.id != 2 ? (
          <CCol xs={12} md={3}>
            <CFormLabel htmlFor="Vehicle_Sourced_by">
              Vehicle sourced by <REQ />{' '}
              {errors.Vehicle_Sourced_by && (
                <span className="small text-danger">{errors.Vehicle_Sourced_by}</span>
              )}
            </CFormLabel>
            <CFormSelect
              size="sm"
              name="Vehicle_Sourced_by"
              onFocus={onFocus}
              onBlur={onBlur}
              onChange={handleChange}
              value={values.Vehicle_Sourced_by}
              className={`${errors.Vehicle_Sourced_by && 'is-invalid'}`}
              aria-label="Small select example"
              id="Vehicle_Sourced_by"
            >
              <option value="">Select...</option>
              {SourcedBy.map(({ id, team }) => {
                return (
                  <>
                    <option value={id}>{team}</option>
                  </>
                )
              })}
            </CFormSelect>
          </CCol>
        ) : (
          singleVehicleInfo.trip_sto_status != '1' && (
            <CCol xs={12} md={3}>
              <CFormLabel htmlFor="division_id">
                Division <REQ />{' '}
                {errors.division_id && (
                  <span className="small text-danger">{errors.division_id}</span>
                )}
              </CFormLabel>
              <CFormSelect
                size="sm"
                name="division_id"
                onFocus={onFocus}
                onBlur={onBlur}
                onChange={handleChange}
                value={values.division_id}
                className={`${errors.division_id && 'is-invalid'}`}
                aria-label="Small select example"
                id="division_id"
              >
                <option value="">Select...</option>
                {DivisonList.map(({ id, division }) => {
                  return (
                    <>
                      <option value={id}>{division}</option>
                    </>
                  )
                })}
              </CFormSelect>
            </CCol>
          )
        )}
        {values.purpose == 2 &&
          (singleVehicleInfo.vehicle_type_id.id == 1 ||
            singleVehicleInfo.vehicle_type_id.id == 2) && (
            <CCol xs={12} md={3}>
              <CFormLabel htmlFor="Vehicle_Sourced_by">
                Vehicle sourced by <REQ />{' '}
                {errors.Vehicle_Sourced_by && (
                  <span className="small text-danger">{errors.Vehicle_Sourced_by}</span>
                )}
              </CFormLabel>
              <CFormSelect
                size="sm"
                name="Vehicle_Sourced_by"
                onFocus={onFocus}
                onBlur={onBlur}
                onChange={handleChange}
                value={values.Vehicle_Sourced_by}
                className={`${errors.Vehicle_Sourced_by && 'is-invalid'}`}
                aria-label="Small select example"
                id="Vehicle_Sourced_by"
              >
                <option value="">Select...</option>
                {SourcedBy.map(({ id, team }) => {
                  if (id != 2) {
                    return (
                      <>
                        <option value={id}>{team}</option>
                      </>
                    )
                  }
                })}
              </CFormSelect>
            </CCol>
          )}
        {singleVehicleInfo.trip_sto_status != '1' && (
          <CCol xs={12} md={3}>
            <CFormLabel htmlFor="trip_advance_eligiblity">
              Trip Advance Eligibility <REQ />{' '}
              {errors.trip_advance_eligiblity && (
                <span className="small text-danger">{errors.trip_advance_eligiblity}</span>
              )}
            </CFormLabel>
            <CFormSelect
              size="sm"
              name="trip_advance_eligiblity"
              onFocus={onFocus}
              onBlur={onBlur}
              onChange={handleChange}
              value={values.trip_advance_eligiblity}
              className={`${errors.trip_advance_eligiblity && 'is-invalid'}`}
              aria-label="Small select example"
              id="trip_advance_eligiblity"
            >
              <option value="">Select...</option>
              <option value="1">Yes</option>
              {/* <option value="0" hidden={values.purpose != 3 ? true : false}> */}
              <option value="0" hidden>
                No
              </option>
            </CFormSelect>
          </CCol>
        )}
        {/* </CRow>
      <CRow> */}
        {values.trip_advance_eligiblity == 1 ? (
          <CCol xs={12} md={3}>
            <CFormLabel htmlFor="advance_amount">
              Advance Amount
              {errors.advance_amount && (
                <span className="small text-danger">{errors.advance_amount}</span>
              )}
            </CFormLabel>
            <CFormInput
              size="sm"
              name="advance_amount"
              onFocus={onFocus}
              onBlur={onBlur}
              onChange={handleChange}
              value={values.advance_amount}
              id="advance_amount"
              type="number"
            />
          </CCol>
        ) : (
          <></>
        )}
        <CCol xs={12} md={3}>
          <CFormLabel htmlFor="expected_date_time">
            Expected Delivery Date <REQ />{' '}
            {errors.expected_date_time && (
              <span className="small text-danger">{errors.expected_date_time}</span>
            )}
          </CFormLabel>
          <CFormInput
            size="sm"
            type="date"
            name="expected_date_time"
            id="expected_date_time"
            onFocus={onFocus}
            onBlur={onBlur}
            onChange={handleChange}
            value={values.expected_date_time}
          />
        </CCol>

        <CCol xs={12} md={3}>
          <CFormLabel htmlFor="expected_return_date_time">
            Expected Return Date <REQ />{' '}
            {errors.expected_return_date_time && (
              <span className="small text-danger">{errors.expected_return_date_time}</span>
            )}
          </CFormLabel>
          <CFormInput
            size="sm"
            type="date"
            id="expected_return_date_time"
            name="expected_return_date_time"
            onFocus={onFocus}
            onBlur={onBlur}
            onChange={handleChange}
            value={values.expected_return_date_time}
          />
        </CCol>

        {values.plantName != "" && (
          <>
            <ColoredLine color="red" />
            <CRow className="mt-2 mb-2" hidden>
            <CCol xs={12} md={6}>
              <CFormLabel
                htmlFor="inputAddress"
                style={{
                  backgroundColor: '#4d3227',
                  color: 'white',
                }}
              >
                {`FCI Plant Information : `}
              </CFormLabel>
            </CCol>
            </CRow>
            <CRow>
              <CCol xs={12} md={2}>
                <CFormLabel htmlFor="vNum">Plant Name & Code</CFormLabel>
                <CFormInput size="sm" id="vNum" value={`${fciPlantInfoFinder(values.plantName,1)} (${fciPlantInfoFinder(values.plantName,2)})`} readOnly />
              </CCol>

              <CCol xs={12} md={2}>
                <CFormLabel htmlFor="vNum">Company Name</CFormLabel>
                <CFormInput size="sm" id="vNum" value={`${fciPlantInfoFinder(values.plantName,3)}`} readOnly />
              </CCol>

              <CCol xs={12} md={2}>
                <CFormLabel htmlFor="vNum">Street No. & Name</CFormLabel>
                <CFormInput size="sm" id="vNum" value={`${fciPlantInfoFinder(values.plantName,4)}, ${fciPlantInfoFinder(values.plantName,5)}`} readOnly />
              </CCol>

              <CCol xs={12} md={2}>
                <CFormLabel htmlFor="vNum">City & Pincode</CFormLabel>
                <CFormInput size="sm" id="vNum" value={`${fciPlantInfoFinder(values.plantName,6)} - ${fciPlantInfoFinder(values.plantName,9)}`} readOnly />
              </CCol>

              <CCol xs={12} md={2}>
                <CFormLabel htmlFor="vNum">State & Region</CFormLabel>
                <CFormInput size="sm" id="vNum" value={`${fciPlantInfoFinder(values.plantName,7)} - ${fciPlantInfoFinder(values.plantName,8)}`} readOnly />
              </CCol>

              <CCol xs={12} md={2}>
                <CFormLabel htmlFor="vNum">GST Number</CFormLabel>
                <CFormInput size="sm" id="vNum" value={`${fciPlantInfoFinder(values.plantName,10)}`} readOnly />
              </CCol>
            </CRow>
            <ColoredLine color="red" />
          </>
        )}    

      </CRow>
    </>
  )
}

export default TripSheetCreationOwn
