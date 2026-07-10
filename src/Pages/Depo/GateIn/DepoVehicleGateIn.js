/* eslint-disable prettier/prettier */
import {
  CButton,
  CCard,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CFormTextarea,
  CModal,
  CModalBody,
  CModalFooter,
  CRow,
  CTabContent,
  CTabPane,
} from '@coreui/react'
import { React, useEffect, useState } from 'react'
import useForm from 'src/Hooks/useForm.js'
import { Link, useNavigate } from 'react-router-dom'
import Loader from 'src/components/Loader'
import { toast } from 'react-toastify'
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
import DepoDriverMasterService from 'src/Service/Depo/Master/DepoDriverMasterService'
import DepoGateInService from 'src/Service/Depo/GateIn/DepoGateInService'
import CustomTable from 'src/components/customComponent/CustomTable'
import VehicleAssignmentSapService from 'src/Service/SAP/VehicleAssignmentSapService'
import Swal from 'sweetalert2'
import DepoShipmentCreationService from 'src/Service/Depo/Shipment/DepoShipmentCreationService'
import SmallLoader from 'src/components/SmallLoader'

const DepoVehicleGateIn = () => {

  const formValues = {
    contractorId: '',
    vehicleId: '',
    vehicleNumber: '',
    vehicleCapacity: '',
    vehicleBodyType: '',
    vehicleInsuranceValidity: '',
    vehicleFcValidity: '',
    driverId: '',
    driverName: '',
    driverPhoneNumber: '',
    driverLicenseNumber: '',
    driverLicenseValidity: '',
    remarks: '',
  }

  /*================== User Id & Location Fetch ======================*/
  const user_info_json = localStorage.getItem('user_info')
  const user_info = JSON.parse(user_info_json)
  const user_locations = []
  const navigation = useNavigate()
  const [rowData, setRowData] = useState([])

  console.log(user_info)

  /* Get User Locations From Local Storage */
  user_info.location_info.map((data, index) => {
    user_locations.push(data.id)
  })

  /* Get User Id From Local Storage */
  const user_id = user_info.user_id

  // console.log(user_locations)
  /*================== User Location Fetch ======================*/

   /* Get User Locations From Local Storage */
   const user_location_info = user_info.location_info
   var user_locations_id = ''
   user_location_info.map((data, index) => {
     user_locations_id = user_locations_id + data.id + ','
   })

   var lastIndex = user_locations_id.lastIndexOf(',')

   const userLocation = user_locations_id.substring(0, lastIndex)
   console.log(userLocation)

  var lastIndex_new = userLocation.lastIndexOf(',')
  const userLocation_new = userLocation.substring(lastIndex_new+1)
  console.log(userLocation_new,'userLocation_new')

  /* ==================== Access Part Start ========================*/
  const [screenAccess, setScreenAccess] = useState(false)
  let page_no = LogisticsProScreenNumberConstants.DepoModuleScreens.Depo_Gate_IN

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
  const [fetch1, setFetch1] = useState(false)
  const [submitBtn, setSubmitBtn] = useState(true)
  const [vehicleCapacityData, setVehicleCapacityData] = useState([])
  const [vehicleBodyData, setVehicleBodyData] = useState([])
  const [contractorName, setContractorName] = useState('')
  const [contractorError, setContractorError] = useState(true)
  const [vehicleAvaialble, setVechicleAvaialble] = useState(false)
  const [driverAvaialble, setDriverAvaialble] = useState(false)
  const [contractorData, setContractorData] = useState([])
  const [contractorVehicleData, setContractorVehicleData] = useState([])
  const [contractorDriverData, setContractorDriverData] = useState([])
  const [contractorModal, setContractorModal] = useState(false)
  const [vehicleCapacityByVId, setVehicleCapacityByVId] = useState('')
  const [vehicleBodyTypeByVId, setVehicleBodyTypeByVId] = useState('')
  const [vehicleIValidityByVId, setVehicleIValidityByVId] = useState('')
  const [vehicleFValidityByVId, setVehicleFValidityByVId] = useState('')
  const [driverPhoneNumberById, setDriverPhoneNumberById] = useState('')
  const  [driverLValidityByVId, setDriverLValidityByVId] = useState('')
  const [driverLicenseById, setDriverLicenseById] = useState('')


  const { values, errors, handleChange, onFocus, handleSubmit, onBlur, isTouched } = useForm(
    action,
    DepoVehicleValidation,
    formValues
  )

  /* Parking Status */
  const ACTION = {
    GATE_IN: 1,
    WAIT_OUTSIDE: 0,
    VEHICLE_MAINTENANCE_GATE_OUT: 5,
    VEHICLE_MAINTENANCE_GATE_IN: 6,
  }

   /* Vehicle Current Position */
   const Vehicle_Current_Position = {
    GATE_IN: 1,
    VEHICLE_INSPECTION_COMPLETED: 2,
    VEHICLE_INSPECTION_REJECTED: 3,
    TRIPSHEET_CREATED: 16,
    TRIPSHEET_REJECTED: 17,
    SHIPMENT_REQUEST_CANCELLED: 19,
    SHIPMENT_COMPLETED: 22,
    SHIPMENT_CREATED: 20,
    SHIPMENT_DELETED: 21,
    TRIP_EXPENSE_CAPTURE: 26,
    TRIP_INCOME_CAPTURE: 27,
    TRIP_INCOME_REJECT: 261,
    TRIP_SETTLEMENT_CAPTURE: 28,
    TRIP_SETTLEMENT_REJECT: 29,
  }

  const gateOutAction = (PYGId) => {
    DepoGateInService.actionGateOut(PYGId).then((res) => {
      if (res.status === 201) {
        toast.success('Vehicle GateOut Successfully!')
        loadParkingYardGateTable()
      }
    })
  }

  const resetFormValues = () => {
    values.contractorId = ''
    values.vehicleId = ''
    values.vehicleNumber = ''
    values.vehicleCapacity = ''
    values.vehicleBodyType = ''
    values.vehicleInsuranceValidity = ''
    values.vehicleFcValidity = ''
    values.driverId = ''
    values.driverName = ''
    values.driverPhoneNumber = ''
    values.driverLicenseNumber = ''
    values.driverLicenseValidity = ''
    values.remarks = ''
  }

  const pgiCompleteGO = data => {
    console.log(data,'pgiCompleteGO')

    const formDataPGI = new FormData()

    formDataPGI.append('tripsheet_no', data.vehicle_tripsheet_info.depo_tripsheet_no)
    formDataPGI.append('veh_no', data.vehicle_info.vehicle_number)
    formDataPGI.append('tknum', data.shipment_info.shipment_no)
    formDataPGI.append('del_count', data.shipment_info.shipment_child_info.length)

    console.log('tripsheet_no', data.vehicle_tripsheet_info.depo_tripsheet_no)
    console.log('veh_no', data.vehicle_info.vehicle_number)
    console.log('tknum', data.shipment_info.shipment_no)
    console.log('del_count', data.shipment_info.shipment_child_info.length)

    VehicleAssignmentSapService.updateShipmentInvoiceCompletion(formDataPGI).then(
      (res) => {
        let sap_response = res.data
        console.log(res,'res-res-res')
        console.log(sap_response,'updateShipmentInvoiceCompletion')

        if (res.status == 200) {

          if(sap_response.STATUS == 1) {

            sap_response.updated_by = user_id
            let sap_response_data  = JSON.stringify(sap_response)
            // let sap_response_data  = JSON.parse(sap_response)
            console.log(sap_response_data,'sap_response_data')
            DepoShipmentCreationService.updateSecondWeightInfoToDb(sap_response_data).then((res) => {
              console.log(res)
              setFetch(true)
              if (res.status == 200) {
                 Swal.fire({
                  title: res.data.message,
                  icon: "success",
                  confirmButtonText: "OK",
                }).then(function () {
                  window.location.reload(false)
                });
              } else if (res.status == 201) {
                Swal.fire({
                  icon: "warning",
                  title: "Vehicle Gate-Out Failed",
                  text: res.data.message,
                  confirmButtonText: "OK",
                }).then(function () {
                  window.location.reload(false)
                });
              } else {
                toast.warning('Something went wrong. Kindly contact Admin..!')
              }
            })
            .catch((error) => {
              console.log(error)
              setFetch(true)
              var object = error.response.data.errors
              var output = ''
              for (var property in object) {
                output += '*' + object[property] + '\n'
              }
              setError(output)
              setErrorModal(true)
            })

          } else if(sap_response.STATUS == 2 || sap_response.STATUS == 5 || sap_response.STATUS == 6 || sap_response.STATUS == 7) {
            setFetch(true)
            Swal.fire({
              title: sap_response.MESSAGE,
              icon: "warning",
              confirmButtonText: "OK",
            }).then(function () {
              window.location.reload(false)
            });
          } else if(sap_response.STATUS == 3 || sap_response.STATUS == 4) {
            setFetch(true)
            Swal.fire({
              title: sap_response.MESSAGE,
              icon: "info",
              confirmButtonText: "OK",
            }).then(function () {
              window.location.reload(false)
            });
          }
        } else {
          setFetch(true)
          toast.warning('Shipment Cannot be Approved. Kindly contact Admin..!')
        }
      })
      .catch((error) => {
        console.log(error)
        setFetch(true)
        var object = error.response.data.errors
        var output = ''
        for (var property in object) {
          output += '*' + object[property] + '\n'
        }
        setError(output)
        setErrorModal(true)
      })

  }

  const loadParkingYardGateTable = () => {
    DepoGateInService.getParkingYardGateTrucks().then((res) => {

      let tableData = res.data.data
      let rowDataList = []
      console.log(tableData)
      const filterData1 = tableData.filter(
        (data) => user_locations.indexOf(data.vehicle_location_id) != -1
      )
      console.log(filterData1)

      const filterData2 = filterData1.filter(
        (data) => (data.shipment_info && (data.shipment_info.approval_status == 14 || data.shipment_info.approval_status == 12)) || data.shipment_info == null
      )

      console.log(filterData2)

      filterData2.map((data, index) => {
        console.log(data,'filterData.map')

        rowDataList.push({
          sno: index + 1,
          Tripsheet_No: data.vehicle_tripsheet_info ? data.vehicle_tripsheet_info.depo_tripsheet_no : ' - ',
          Contractor_Name: data.contractor_info.contractor_name,
          Vehicle_No: data.vehicle_info.vehicle_number,
          Driver_Name: data.driver_info.driver_name,
          Waiting_At: (
            <span className="badge rounded-pill bg-info">
              {data.vehicle_current_position == Vehicle_Current_Position.VEHICLE_INSPECTION_REJECTED
                ? 'Vehicle Inspection Rejected'
                : data.vehicle_current_position == Vehicle_Current_Position.TRIPSHEET_REJECTED
                ? 'Tripsheet Creation Rejected'
                : data.vehicle_current_position == Vehicle_Current_Position.SHIPMENT_DELETED
                ? 'Shipment Deletion'
                : data.vehicle_current_position == Vehicle_Current_Position.SHIPMENT_REQUEST_CANCELLED
                ? 'Shipment Request Cancelled'
                : data.shipment_info && data.shipment_info.approval_status == 14
                ? 'Shipment - PGI After Gateout'
                : data.vehicle_current_position == Vehicle_Current_Position.SHIPMENT_COMPLETED
                ? 'Shipment Completion'
                : 'Gate Out'}
            </span>
          ),
          Screen_Duration: data.vehicle_current_position_updated_time,
          Overall_Duration: data.created_at,
          Action: (
            <CButton
              type="button"
              onClick={(e) => {
                setFetch(false)
                data.shipment_info && data.shipment_info.approval_status == 14 ? pgiCompleteGO(data) : gateOutAction(data.depo_parking_yard_gate_id)
              }}
              className="badge text-white"
              color="warning"
            >
            Gate Out
            </CButton>
          ),
        })
      })
      setFetch1(true)
      setRowData(rowDataList)
      // setPending(false)
    })
  }

  useEffect(() => {
    loadParkingYardGateTable()
  }, [])

  function action(type) {
    if (values.vehicleId == '') {
      toast.warning('Please choose the vehicle number..!')
      setFetch(true)
      return false
    } else if (values.driverId == '') {
      toast.warning('Please choose the driver name..!')
      setFetch(true)
      return false
    }

    const formData = new FormData()

    formData.append('contractor_id', values.contractorId)
    formData.append('driver_id', values.driverId)
    formData.append('vehicle_id', values.vehicleId)
    // formData.append('vehicle_location_id', userLocation)
    formData.append('vehicle_location_id', userLocation_new)
    formData.append('remarks', values.remarks)
    formData.append('created_by', user_id)

    console.log(values)
    console.log(type)

    DepoGateInService.handleParkingYardGateInAction(formData).then((res) => {

        console.log(res)
        setFetch(true)
        if (res.status == 200) {
          toast.success('Vehicle GateIn Successfully!')
          //reseting the fromValues
          resetFormValues()
          setTimeout(() => {
            window.location.reload(false)
          }, 1000)
        } else if (res.status == 201) {
          toast.info('Truck Already inProcess. Cannot make next trip..!')
          setTimeout(() => {
            window.location.reload(false)
          }, 3000)
        } else {
          toast.danger('Something Went Wrong!')
        }
      })
      .catch((error) => {
        console.log(error)
        setFetch(true)
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

    //section for getting vehicle capacity from database
    VehicleCapacityService.getVehicleCapacity().then((res) => {
      setVehicleCapacityData(res.data.data)
    })

    //section for getting vehicle Body Type from database
    VehicleBodyTypeService.getVehicleBody().then((res) => {
      setVehicleBodyData(res.data.data)
    })

  }, [])

  useEffect(() => {
    if(contractorName != ''){
      // setFetch(false)
      values.contractorId = contractorName
      DepoVehicleMasterService.getDepoVehicleByContractorId(contractorName).then((res) => {
        console.log(res.data.data,'DepoVehicleByContractorId')
        let received_data = res.data.data
        let filteredData1 = received_data.filter(
          (data) => data.vehicle_is_assigned == 0
        )

        if(res.status == 200 && filteredData1.length > 0){
          setVechicleAvaialble(true)

          setContractorVehicleData(filteredData1)

          setContractorModal(true)
        } else {
          resetFormValues()
          setContractorModal(false)
          setVechicleAvaialble(false)
          setContractorVehicleData([])
        }
      })

      DepoDriverMasterService.getDepoDriverByContractorId(contractorName).then((res) => {
        // setFetch(true)
        console.log(res.data.data,'DepoDriverByContractorId')
        let received_data = res.data.data

        let filteredData2 = received_data.filter(
          (data) => data.driver_is_assigned == 0
        )

        if(res.status == 200 && filteredData2.length > 0){
          setContractorModal(true)
          setDriverAvaialble(true)

          setContractorDriverData(filteredData2)

        } else {
          resetFormValues()
          setContractorModal(false)
          setDriverAvaialble(false)
          setContractorDriverData([])
        }
      })
    } else {
      resetFormValues()
    }
  }, [contractorName])

  useEffect(() => {

    //section for getting Contractor Data from database
    DepoContractorMasterService.getActiveDepoContractors().then((res) => {
      setFetch(true)
      console.log(res.data.data)
      console.log(user_locations,'user_locations')
      let contractor_data = res.data.data

      let filterData = contractor_data.filter(
        (data) => data.contractor_location == user_locations[0]
      )

      console.log(filterData)

      if(user_info.is_admin == 1) {
        setContractorData(contractor_data)
      } else {
        setContractorData(filterData)
      }

    })

  }, [])

  const columns = [
    {
      name: 'S.No',
      selector: (row) => row.sno,
      sortable: true,
      center: true,
    },
    {
      name: 'Tripsheet No',
      selector: (row) => row.Tripsheet_No,
      sortable: true,
      center: true,
    },
    {
      name: 'Cotractor Name',
      selector: (row) => row.Contractor_Name,
      sortable: true,
      center: true,
    },
    {
      name: 'Vehicle No',
      selector: (row) => row.Vehicle_No,
      sortable: true,
      center: true,
    },
    {
      name: 'Driver Name',
      selector: (row) => row.Driver_Name,
      sortable: true,
      center: true,
    },
    {
      name: 'Current Status',
      selector: (row) => row.Waiting_At,
      sortable: true,
      center: true,
    },
    {
      name: 'Screen Duration',
      selector: (row) => row.Screen_Duration,
      center: true,
    },
    {
      name: ' Overall Duration',
      selector: (row) => row.Overall_Duration,
      center: true,
    },
    {
      name: 'Action',
      selector: (row) => row.Action,
      center: true,
    },
  ]

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

  useEffect(() => {
    if (values.vehicleId) {

      //section to fetch single Contractor info
      DepoVehicleMasterService.getDepoVehicleById(values.vehicleId).then((res) => {
        isTouched.vehicleCapacity = true
        isTouched.vehicleNumber = true
        isTouched.vehicleBodyType = true
        isTouched.vehicleInsuranceValidity = true
        isTouched.vehicleFcValidity = true
        console.log(res.data.data,'getDepoVehicleById')
        setVehicleCapacityByVId(res.data.data.vehicle_capacity_info.capacity)
        setVehicleBodyTypeByVId(res.data.data.vehicle_body_type_info.body_type)
        setVehicleIValidityByVId(res.data.data.insurance_validity)
        setVehicleFValidityByVId(res.data.data.fc_validity)
        values.vehicleNumber = res.data.data.vehicle_number
        values.vehicleCapacity = res.data.data.vehicle_capacity_info.capacity
        values.vehicleBodyType = res.data.data.vehicle_body_type_info.body_type
        values.vehicleInsuranceValidity = res.data.data.insurance_validity
        values.vehicleFcValidity = res.data.data.fc_validity

      })
    } else {
        values.vehicleCapacity = ''
        values.vehicleBodyType = ''
        values.vehicleInsuranceValidity = ''
        values.vehicleFcValidity = ''
        setVehicleCapacityByVId('')
        setVehicleBodyTypeByVId('')
        setVehicleIValidityByVId('')
        setVehicleFValidityByVId('')
    }
  }, [values.vehicleId])

  useEffect(() => {
    if (values.driverId) {
      //fetch to get Drivers info list form master by id
        DepoDriverMasterService.getDriversById(values.driverId).then((res) => {
        console.log(res.data.data,'getDriverInfoById')
        isTouched.driverPhoneNumber = true
        isTouched.driverLicenseValidity = true
        isTouched.driverLicenseNumber = true
        isTouched.driverName = true
        setDriverPhoneNumberById(res.data.data.driver_number)
        setDriverLValidityByVId(res.data.data.license_validity_to)
        setDriverLicenseById(res.data.data.license_no)
        values.driverPhoneNumber = res.data.data.driver_number
        values.driverLicenseNumber = res.data.data.license_no
        values.driverLicenseValidity = res.data.data.license_validity_to
        values.driverName = res.data.data.driver_name

      })
    } else {
      values.driverPhoneNumber = ''
      values.driverLicenseNumber = ''
      values.driverLicenseValidity = ''
      values.driverName = ''
      setDriverPhoneNumberById('')
      setDriverLValidityByVId('')
      setDriverLicenseById('')
    }
  }, [values.driverId])

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
                            {(vehicleAvaialble == false || driverAvaialble == false) && contractorName != '' && (
                              <span className="small text-danger">Vehicle / Driver Not Available </span>
                            )}

                            {contractorName == '' && (
                              <span className="small text-danger">Select The Contractor Name</span>
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


                       {contractorName != '' && vehicleAvaialble && driverAvaialble && (
                          <>

                            <CCol xs={12} md={3}>
                              <CFormLabel htmlFor="vehicleId">
                                Vehicle Number <REQ />{' '}
                                {errors.vehicleId && <span className="small text-danger">{errors.vehicleId}</span>}
                              </CFormLabel>
                              <CFormSelect
                                size="sm"
                                name="vehicleId"
                                id="vehicleId"
                                onFocus={onFocus}
                                onBlur={onBlur}
                                onChange={handleChange}
                                value={values.vehicleId}
                                className={`${errors.vehicleId && 'is-invalid'}`}
                                aria-label="Small select example"
                              >
                                <option value="">Select...</option>
                                {contractorVehicleData.map(({ id, vehicle_number }) => {
                                  return (
                                    <>
                                      <option key={id} value={id}>
                                        {vehicle_number}
                                      </option>
                                    </>
                                  )
                                })}
                              </CFormSelect>
                            </CCol>

                            <CCol xs={12} md={3}>
                              <CFormLabel htmlFor="vehicleCapacity">Vehicle Capacity In MTS </CFormLabel>
                              <CFormInput
                                size="sm"
                                id="vehicleCapacity"
                                name="vehicleCapacity"
                                value={vehicleCapacityByVId}
                                readOnly
                              />
                            </CCol>

                            <CCol xs={12} md={3}>
                              <CFormLabel htmlFor="vehicleBodyType">Vehicle Body Type </CFormLabel>
                              <CFormInput
                                size="sm"
                                id="vehicleBodyType"
                                name="vehicleBodyType"
                                value={vehicleBodyTypeByVId}
                                readOnly
                              />
                            </CCol>

                            <CCol xs={12} md={3}>
                              <CFormLabel htmlFor="vehicleInsuranceValidity">Vehicle Insurance Valid To </CFormLabel>
                              <CFormInput
                                size="sm"
                                id="vehicleInsuranceValidity"
                                name="vehicleInsuranceValidity"
                                value={vehicleIValidityByVId}
                                readOnly
                              />
                            </CCol>

                            <CCol xs={12} md={3}>
                              <CFormLabel htmlFor="vehicleFcValidity">Vehicle FC Valid To </CFormLabel>
                              <CFormInput
                                size="sm"
                                id="vehicleFcValidity"
                                name="vehicleFcValidity"
                                value={vehicleFValidityByVId}
                                readOnly
                              />
                            </CCol>

                            <CCol xs={12} md={3}>
                              <CFormLabel htmlFor="driverId">
                                Driver Name <REQ />{' '}
                                {errors.driverId && <span className="small text-danger">{errors.driverId}</span>}
                              </CFormLabel>
                              <CFormSelect
                                size="sm"
                                name="driverId"
                                id="driverId"
                                maxLength={30}
                                onFocus={onFocus}
                                onBlur={onBlur}
                                onChange={handleChange}
                                value={values.driverId}
                                className={`${errors.driverId && 'is-invalid'}`}
                                aria-label="Small select example"
                              >
                                <option value="">Select...</option>
                                {contractorDriverData.map(({ id, driver_name }) => {
                                  return (
                                    <>
                                      <option key={id} value={id}>
                                        {driver_name}
                                      </option>
                                    </>
                                  )
                                })}
                              </CFormSelect>
                            </CCol>

                            <CCol xs={12} md={3}>
                              <CFormLabel htmlFor="driverPhoneNumber">Driver Contact Number</CFormLabel>
                              <CFormInput
                                size="sm"
                                id="driverPhoneNumber"
                                name="driverPhoneNumber"
                                value={driverPhoneNumberById}
                                readOnly
                              />
                            </CCol>

                            <CCol xs={12} md={3}>
                              <CFormLabel htmlFor="driverLicenseNumber">Driver License Number</CFormLabel>
                              <CFormInput
                                size="sm"
                                id="driverLicenseNumber"
                                name="driverLicenseNumber"
                                value={driverLicenseById}
                                readOnly
                              />
                            </CCol>

                            <CCol xs={12} md={3}>
                              <CFormLabel htmlFor="driverLicenseValidity">Driver License Valid To </CFormLabel>
                              <CFormInput
                                size="sm"
                                id="driverLicenseValidity"
                                name="driverLicenseValidity"
                                value={driverLValidityByVId}
                                readOnly
                              />
                            </CCol>

                            <CCol xs={12} md={3}>
                              <CFormLabel htmlFor="remarks">Remarks</CFormLabel>
                              <CFormTextarea
                                name="remarks"
                                id="remarks"
                                maxLength={40}
                                onBlur={onBlur}
                                onChange={handleChange}
                                value={values.remarks || ''}
                                rows="1"
                              >
                                {values.remarks}
                              </CFormTextarea>
                            </CCol>
                          </>
                        )}

                      </CRow>

                      {contractorName != '' &&
                        (<>
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
                                onClick={(e) => {
                                  e.preventDefault()
                                  setFetch(false)
                                  action(1)
                                }}
                              >
                                GateIn
                              </CButton>
                            </CCol>
                          </CRow>
                        </>
                      )}
                    </CForm>
                  </CTabPane>
                </CTabContent>
              </CCard>
              {!fetch1 && <SmallLoader />}
              {fetch1 && (
                <CCard className="mt-3">
                  <CContainer className="mt-2">
                    <CustomTable
                      columns={columns}
                      data={rowData}
                      fieldName={'Driver_Name'}
                      showSearchFilter={true}
                    />
                  </CContainer>
                </CCard>
              )}
            </>) : (<AccessDeniedComponent />
          )}
          {/* ============ Contractor Details Missing Modal Area ================ */}
            <CModal
              visible={false}
              backdrop="static"
              onClose={() => {
                setContractorModal(false)
              }}
            >
              <CModalBody>
                {!vehicleAvaialble && (
                  <p className="small text-danger">Vehicle Not Available For The Selected Contractor</p>
                )}
                {!driverAvaialble && (
                  <p className="small text-danger">Driver Not Available For The Selected Contractor</p>
                )}
                {contractorName == '' && (
                  <p className="small text-danger">Select The Contractor Name</p>
                )}
              </CModalBody>
              <CModalFooter>
                <CButton
                  color="secondary"
                  onClick={() => {
                    setContractorModal(false)
                  }}
                >
                  Close
                </CButton>
              </CModalFooter>
            </CModal>
          {/* *********************************************************** */}
        </>
      )}
    </>
  )
}

export default DepoVehicleGateIn
