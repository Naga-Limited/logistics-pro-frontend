import {
  CButton,
  CCard,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CNav,
  CNavItem,
  CNavLink,
  CRow,
  CTabContent,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CTabPane,
  CFormFloating,
  CFormTextarea,
} from '@coreui/react'

import { React, useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import DriverListSelectComponent from 'src/components/commoncomponent/DriverListSelectComponent'
import useForm from 'src/Hooks/useForm'
import VehicleMaintenanceValidation from 'src/Utils/TransactionPages/VehicleMaintenance/VehicleMaintenanceValidation'
import VehicleMaintenanceService from 'src/Service/VehicleMaintenance/VehicleMaintenanceService'
import ParkingYardGateService from 'src/Service/ParkingYardGate/ParkingYardGateService'
import validate from 'src/Utils/Validation'
import CustomTable from '../../components/customComponent/CustomTable'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import MaintenanceWorkorderComponent from 'src/components/commoncomponent/MaintenanceWorkorderComponent'
import MaintenanceWorkorderService from 'src/Service/MaintenanceWorkorder/MaintenanceWorkorderService'
import MaintenanceWorkOrder from 'src/Service/SAP/MaintenanceWorkOrder'
import Loader from 'src/components/Loader'
import DriverListSearchSelect from 'src/components/commoncomponent/DriverListSearchSelect'
import SearchSelectComponent from 'src/components/commoncomponent/searchSelectComponent'

import AccessDeniedComponent from 'src/components/commoncomponent/AccessDeniedComponent'
import JavascriptInArrayComponent from 'src/components/commoncomponent/JavascriptInArrayComponent'
import * as LogisticsProScreenNumberConstants from 'src/components/constants/LogisticsProScreenNumberConstants'

const VehicleMaintainence = () => {
  const user_info_json = localStorage.getItem('user_info')
  const user_info = JSON.parse(user_info_json)

  /* Get User Id From Local Storage */
  const user_id = user_info.user_id

  /* ==================== Access Part Start ========================*/
  const [screenAccess, setScreenAccess] = useState(false)
  let page_no = LogisticsProScreenNumberConstants.VehicleMaintenanceModuleScreen.Vehicle_Maintenance_Started

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

  const [outSide, setoutSide] = useState(false)
  const formValues = {
    maintenenceBy: '',
    vehicle_id: '',
    driverId: '',
    vendorName: '',
    maintenenceType: '',
    workOrder: '',
    vendorName: '',
    MaintenanceStart: '',
    MaintenanceEnd: '',
    closingOdoKM: '',
  }
  const border = {
    borderColor: '#b1b7c1',
  }
  const changevehicleType = (str = '') => {
    console.log('true1' + str)
    values.maintenenceType = ''
    values.workOrder = ''
    values.vendorName = ''
    values.MaintenanceStart = ''
    values.remarks = ''
  }
  const { values, errors, handleChange, onFocus, handleSubmit, enableSubmit, onBlur, isTouched } =
    useForm(MaintenanceVehicle, VehicleMaintenanceValidation, formValues)

  const navigation = useNavigate()
  function MaintenanceVehicle() {}
  const addVehicleMaintenance = (status) => {
    let data = new FormData()
    data.append('vehicle_id', values.vehicle_id)
    data.append('parking_id', currentVehicleInfo.parking_yard_gate_id)
    data.append('driver_id', values.driverId)
    data.append('maintenance_typ', values.maintenenceType)
    data.append('maintenance_by', values.maintenenceBy)
    data.append('work_order', workOrder)
    data.append('vendor_id', values.vendorName)
    data.append('maintenance_start_datetime', values.MaintenanceStart)
    data.append('maintenance_end_datetime', values.MaintenanceEnd)
    data.append('opening_odometer_km', values.openingOdoKM)
    data.append('vehicle_maintenance_status', status)
    data.append('created_by', user_id)
    // data.append('closing_odometer_photo', values.closingOdoPhoto);
    data.append('remarks', remarks ? remarks : 'NO REMARKS')
    if (values.driverId && oldDriver) {
      data.append('driver_id', values.driverId)
      data.append('old_driver_id', oldDriver)
    }

    if (values.maintenenceBy != 'inHouse') {
      console.log(currentVehicleInfo.vehicle_number)
      if (workOrder == '') {
        toast.warning('Check The Work Order Number')
        setFetch(true)
        return false
      } else if(WorkOrder_Vehicle != currentVehicleInfo.vehicle_number){
        toast.warning('Vehicle Number is Not Matched ...')
        setFetch(true)
        return false
      }

      let formData = new FormData()

      formData.append('ebeln', workOrder)
      formData.append('vendor_id', values.vendorName)
      formData.append('status', '1')
      MaintenanceWorkOrder.WorkorderstopSAP(formData).then((res) => {
        console.log(res)
      })
    }
    VehicleMaintenanceService.addVehicleMaintenance(data).then((res) => {
      if (res.status == 200) {
        setFetch(true)
        toast.success('Vehicle Maintenance Started')
        navigation('/vMain')
      }
    })
  }

  const [workOrder, setWorkOrder] = useState(0)

  const onChangeFilter = (event, event_type) => {
    var selected_value = event.value
    console.log(selected_value, 'selected_value')

    if (event_type == 'work_order_no') {
      if (selected_value) {
        setWorkOrder(selected_value)
      } else {
        setWorkOrder(0)
      }
    }
  }

  console.log(workOrder)
  const [loadDetails, setLoadDetails] = useState([])


  const [visible, setVisible] = useState(false)
  const [currentVehicleInfo, setCurrentVehicleInfo] = useState({})
  const [changeDriver, setChangeDriver] = useState(false)
  const [vendor_name, setVendor_name] = useState('')
  const [WorkOrder_Vehicle, setWorkOrder_Vehicle] = useState('')
  const [acceptBtn, setAcceptBtn] = useState(true)
  const [acceptBtn1, setAcceptBtn1] = useState(true)
  const [rejectBtn, setRejectBtn] = useState(true)
  const [oldDriver, setOldDriver] = useState('')
  const [fetch, setFetch] = useState(false)
  const [driver, setDriver] = useState([])
  const [driverPhoneNumberById, setDriverPhoneNumberById] = useState('')
  const [driverCodeById, setDriverCodeById] = useState('')
  const [driverChange, setDriverChange] = useState(false)

  const REQ = () => <span className="text-danger"> * </span>

  const VEHICLE_TYPE = {
    OWN: 1,
    CONTRACT: 2,
    HIRE: 3,
    PARTY: 4,
  }

  const { id } = useParams()

  useEffect(() => {
    VehicleMaintenanceService.getSingleVehicleInfoOnParkingYardGate(id).then((res) => {
      values.vehicle_id = res.data.data.vehicle_id
      values.driverId = res.data.data.driver_id
      // values.driverId =
      // res.data.data != null ? res.data.data.driver_name : ''
      values.openingOdoKM = res.data.data.odometer_km
      isTouched.vehicle_id = true
      isTouched.remarks = true
      setCurrentVehicleInfo(res.data.data)
      setFetch(true)
      console.log(currentVehicleInfo)
    })
  }, [id])

  useEffect(() => {
    //fetch to get Work Order list form SAP
    // MaintenanceWorkorderService.getMaintenanceWorkorder.
    MaintenanceWorkOrder.getworkorderData(currentVehicleInfo.vehicle_number).then((res) => {
      setFetch(true)
      console.log(res.data);
      let tableData = res.data
      let filterData = tableData.filter(
        (data) => data.EQUNR == currentVehicleInfo.vehicle_number
      )
      setLoadDetails(filterData)
    })
  }, [currentVehicleInfo.vehicle_number])

  useEffect(() => {
    if (
      isTouched.maintenenceBy &&
      isTouched.maintenenceType &&
      isTouched.MaintenanceStart &&
      !errors.maintenenceBy &&
      !errors.maintenenceType &&
      !errors.cMob &&
      !errors.MaintenanceStart
    ) {
      setAcceptBtn(false)
    } else {
      setAcceptBtn(true)
    }
  }, [errors])
  useEffect(() => {
    if (
      isTouched.maintenenceBy &&
      isTouched.maintenenceType &&
      isTouched.MaintenanceStart &&
      // isTouched.workOrder &&
      // isTouched.vendorName &&
      !errors.maintenenceBy &&
      !errors.maintenenceType &&
      !errors.MaintenanceStart &&
      // !errors.workOrder &&
      !errors.driverId
    ) {
      setAcceptBtn1(false)
    } else {
      setAcceptBtn1(true)
    }
  }, [errors])

  useEffect(() => {
    if (workOrder) {
      MaintenanceWorkOrder.getworkorderData().then((res) => {
        let vendorName_data = res.data
        console.log(vendorName_data)

        vendorName_data.map((res) => {
          console.log(res)
          // values.vendorName = 'test';
          console.log(res.EBELN)
          if (res.EBELN == workOrder) {
            setFetch(true)
            isTouched.vendorName = true
            isTouched.WorkOrder_Vehicle = true
            values.vendorName = res.NAME1
            values.WorkOrder_Vehicle = res.EQUNR
            setVendor_name(res.NAME1)
            setWorkOrder_Vehicle(res.EQUNR)
          }
        })
      })
    } else {
      values.vendorName = ''
      values.WorkOrder_Vehicle = ''
      setVendor_name('')
      setWorkOrder_Vehicle('')
    }
  }, [workOrder])

  useEffect(() => {
    //fetch to get Drivers list form master
    VehicleMaintenanceService.getDrivers().then((res) => {
      setDriver(res.data.data)
    })
  }, [])

  const onChange = (event) => {
    let driverId = event.value
    if (driverId) {
      values.driverId = driverId

      ParkingYardGateService.getDriverInfoById(driverId).then((res) => {
        setDriverPhoneNumberById(res.data.data.driver_phone_1)
        setDriverCodeById(res.data.data.driver_code)
      })
     console.log(driverPhoneNumberById)
    } else {
      values.driverId = ''
      setDriverPhoneNumberById('')
      // console.log()
    }
  }
  const [remarks, setRemarks] = useState('');
  const handleChangenew = event => {
  const result = event.target.value.toUpperCase();

  setRemarks(result);
  
};
  return (
    <>
      {!fetch && <Loader />}
      {fetch && (
        <>
         <>

         {screenAccess ? (
          <>
            <CCard>
              <CTabContent>
                <CTabPane role="tabpanel" aria-labelledby="home-tab" visible={true}>
                  <CForm className="container p-3" onSubmit={handleSubmit}>
                    <CRow>
                      <CCol xs={12} md={3}>
                        <CFormLabel htmlFor="vehicle_id">Vehicle No</CFormLabel>

                      <CFormInput
                        name="vehicle_id"
                        size="sm"
                        id="vehicle_id"
                        value={currentVehicleInfo.vehicle_number}
                        placeholder=""
                        readOnly
                      />
                    </CCol>
                    <CCol className="mb-3" md={3}>
                      <CFormLabel htmlFor="maintenenceBy">
                        Maintenance By <REQ />{' '}
                        {errors.maintenenceBy && (
                          <span className="small text-danger">{errors.maintenenceBy}</span>
                        )}
                      </CFormLabel>
                      <CFormSelect
                        size="sm"
                        id="maintenenceBy"
                        className={`${errors.maintenenceBy && 'is-invalid'}`}
                        name="maintenenceBy"
                        value={values.maintenenceBy}
                        onFocus={onFocus}
                        onBlur={onBlur}
                        onChange={handleChange}
                        onClick={(e) => {
                          changevehicleType(e.target.value)
                        }}
                      >
                        <option value="" selected>
                          Select...
                        </option>
                        <option value="inHouse" onClick={() => setoutSide(false)}>
                          Inhouse
                        </option>
                        <option value="outSide" onClick={() => setoutSide(true)}>
                          Outside
                        </option>
                      </CFormSelect>
                    </CCol>
                    {values.maintenenceBy && (
                      <CCol className="mb-3" md={3}>
                        <CFormLabel htmlFor="maintenenceType">
                          Maintenance Type <REQ />{' '}
                          {errors.maintenenceType && (
                            <span className="small text-danger">{errors.maintenenceType}</span>
                          )}
                        </CFormLabel>

                        <CFormSelect
                          size="sm"
                          id="maintenenceType"
                          className={`${errors.maintenenceType && 'is-invalid'}`}
                          name="maintenenceType"
                          value={values.maintenenceType}
                          onFocus={onFocus}
                          onBlur={onBlur}
                          onChange={handleChange}
                          required
                        >
                          <option value="" hidden selected>
                            Select...
                          </option>
                          <option value="scheduled">Scheduled Maintenance</option>
                          <option value="breakDown">Break Down Maintenance</option>
                        </CFormSelect>
                      </CCol>
                    )}
                    {values.maintenenceBy && (
                      <CCol xs={12} md={3}>
                        <CFormLabel htmlFor="MaintenanceStart">
                          Maintenance Start Date <REQ />{' '}
                          {errors.MaintenanceStart && (
                            <span className="small text-danger">{errors.MaintenanceStart}</span>
                          )}
                        </CFormLabel>

                          <CFormInput
                            size="sm"
                            id="MaintenanceStart"
                            className={`${errors.MaintenanceStart && 'is-invalid'}`}
                            name="MaintenanceStart"
                            value={values.MaintenanceStart}
                            type="date"
                            onFocus={onFocus}
                            onBlur={onBlur}
                            onChange={handleChange}
                          />
                        </CCol>
                      )}
                      {values.maintenenceBy != 'inHouse' && values.maintenenceBy && (
                        <CCol xs={12} md={3}>
                          <CFormLabel htmlFor="driverId">
                            Driver Name <REQ />{' '}
                            {errors.driverId && (
                              <span className="small text-danger">{errors.driverId}</span>
                            )}
                          </CFormLabel>

                          {currentVehicleInfo.vehicle_type_id.id == VEHICLE_TYPE.OWN ||
                          currentVehicleInfo.vehicle_type_id.id == VEHICLE_TYPE.CONTRACT ? (
                            changeDriver ? (
                              // <CFormSelect
                              //   size="sm"
                              //   name="driverId"
                              //   id="driverId"
                              //   onFocus={onFocus}
                              //   onBlur={onBlur}
                              //   onChange={handleChange}
                              //   value={values.driverId}
                              //   label={'Small select example'}
                              // >
                            <DriverListSearchSelect
                              size="sm"
                              className="mb-1"
                              onChange={(e) => {
                                onChange(e)
                              }}
                              label="driverId"
                              id="driverId"
                              name="driverId"
                              value={values.driverId}
                              search_type="driver_name"
                            />
                            /* </CFormSelect> */
                            ) : (
                              <>
                                <CFormInput
                                  name="driverId"
                                  size="sm"
                                  id="driverId"
                                  value={currentVehicleInfo.driver_name+' - '+currentVehicleInfo.driver_info.driver_code}                                placeholder="10"
                                  readOnly
                                />
                              </>
                            )
                          ) : (
                            <CFormInput
                              name="driverId"
                              size="sm"
                              id="driverId"
                              value={currentVehicleInfo.driver_name}
                              placeholder="10"
                              readOnly
                            />
                          )}
                        </CCol>
                      )}
                      {values.maintenenceBy != 'inHouse' && values.maintenenceBy && (
                      <CCol xs={12} md={3}>
                      <CFormLabel htmlFor="dMob">Driver Contact Number</CFormLabel>
                      <CFormInput
                        name="dMob"
                        size="sm"
                        id="dMob"
                        value={
                          driverChange
                            ? driverPhoneNumberById
                            : currentVehicleInfo.driver_contact_number
                        }
                        readOnly
                      />
                    </CCol>)}

                      {values.maintenenceBy != 'inHouse' && values.maintenenceBy && (
                        <CCol className="mb-3" md={3}>
                          <CFormLabel htmlFor="workOrder">
                            Work Order <REQ />{' '}
                            {errors.workOrder && (
                              <span className="small text-danger">{errors.workOrder}</span>
                            )}
                          </CFormLabel>
                          <SearchSelectComponent
                            size="sm"
                            id="workOrder"
                            className={`${errors.workOrder && 'is-invalid'}`}
                            name="workOrder"
                            // value={values.workOrder || ''}
                            // value={values.workOrder}
                            onFocus={onFocus}
                            onBlur={onBlur}
                            // onChange={handleChange}
                            onChange={(e) => {
                              onChangeFilter(e, 'work_order_no')
                            }}
                            label="Select Work Order Number"
                            noOptionsMessage="Work Order Not found"
                            search_type="work_order"
                            search_data={loadDetails}
                          >
                            {/* <MaintenanceWorkorderComponent /> */}
                          </SearchSelectComponent>
                        </CCol>
                      )}
                      {values.maintenenceBy != 'inHouse' && values.maintenenceBy && (
                        <CCol className="mb-3" md={3}>
                          <CFormLabel htmlFor="vendorName">
                            Vendor Name
                            {errors.vendorName && (
                              <span className="small text-danger">{errors.vendorName}</span>
                            )}
                          </CFormLabel>
                          <CFormInput
                            size="sm"
                            id="vendorName"
                            className={`${errors.vendorName && 'is-invalid'}`}
                            name="vendorName"
                            value={values.vendorName}
                            onFocus={onFocus}
                            onBlur={onBlur}
                            onChange={vendor_name}
                            readOnly
                          />
                        </CCol>
                      )}
                      {values.maintenenceBy != 'inHouse' && values.maintenenceBy && (
                      <CCol className="mb-3" md={3}>
                        <CFormLabel htmlFor="WorkOrder_Vehicle">
                          Work Order Vehicle Number
                          {errors.WorkOrder_Vehicle && (
                            <span className="small text-danger">{errors.WorkOrder_Vehicle}</span>
                          )}
                        </CFormLabel>
                        <CFormInput
                          size="sm"
                          id="WorkOrder_Vehicle"
                          className={`${errors.vendorName && 'is-invalid'}`}
                          name="WorkOrder_Vehicle"
                          value={values.WorkOrder_Vehicle}
                          onFocus={onFocus}
                          onBlur={onBlur}
                          onChange={WorkOrder_Vehicle}
                          readOnly
                        />
                      </CCol>
                    )}

                      {values.maintenenceBy != 'inHouse' && values.maintenenceBy && (
                        <CCol xs={12} md={3}>
                          <CFormLabel htmlFor="closingOdoKM">Opening Odometer KM</CFormLabel>
                          <CFormInput
                            size="sm"
                            id="closingOdoKM"
                            name="closingOdoKM"
                            value={values.openingOdoKM}
                            type="text"
                            maxLength="6"
                            onFocus={onFocus}
                            onBlur={onBlur}
                            onChange={handleChange}
                            readOnly
                          />
                        </CCol>
                      )}
                      {values.maintenenceBy && (
                        <CCol xs={12} md={3}>
                          <CFormLabel htmlFor="remarks">Remarks</CFormLabel>
                          <CFormTextarea
                            name="remarks"
                            id="remarks"
                            onBlur={onBlur}
                            onChange={handleChangenew}
                            value={remarks || ''}
                            rows="1"
                          ></CFormTextarea>
                        </CCol>
                      )}
                    </CRow>

                    <CRow>
                      <CCol>
                        <Link to={'/VMain'}>
                          <CButton
                            md={6}
                            size="sm"
                            color="primary"
                            disabled=""
                            className="text-white"
                            type="submit"
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
                        {/* <CButton
                      size="sm"
                      color="warning"
                      disabled=""
                      className="mx-3 text-white"
                      type="button"
                      hidden={outSide}
                    >
                      Maintenence End
                    </CButton> */}
                        {values.maintenenceBy != 'outSide' && values.maintenenceBy && (
                          <CButton
                            size="sm"
                            color="warning"
                            className="mx-3 text-white"
                            type="button"
                            disabled={acceptBtn}
                            onClick={() => {
                              setFetch(false)
                              addVehicleMaintenance(1)
                            }}
                          >
                            Maintenence Start
                          </CButton>
                        )}
                        {values.maintenenceBy != 'inHouse' && values.maintenenceBy && (
                          <CButton
                            size="sm"
                            color="warning"
                            className="mx-3 text-white"
                            type="button"
                            disabled={acceptBtn1}
                            onClick={() => {
                              setFetch(false)
                              addVehicleMaintenance(2)
                            }}
                          >
                            {/* Gate Out */}
                            Maintenence Start
                          </CButton>
                        )}
                        {(values.maintenenceBy != 'inHouse' &&
                          values.maintenenceBy &&
                          !changeDriver &&
                          currentVehicleInfo?.vehicle_type_id?.id == VEHICLE_TYPE.OWN) ||
                        currentVehicleInfo?.vehicle_type_id?.id == VEHICLE_TYPE.CONTRACT ? (
                          <CButton
                            size="sm"
                            color="warning"
                            className="mx-1 px-2 text-white"
                            type="button"
                            onClick={() => {
                              setOldDriver(currentVehicleInfo.driver_id)
                              setChangeDriver(true)
                              setDriverChange(true)
                            }}
                          >
                            Assign Driver
                          </CButton>
                        ) : (
                          <></>
                        )}
                      </CCol>
                    </CRow>
                  </CForm>
                </CTabPane>
              </CTabContent>
            </CCard>
            </>
	       ) : (<AccessDeniedComponent />)}

   	     </>
        </>
      )}
    </>
  )
}

export default VehicleMaintainence
