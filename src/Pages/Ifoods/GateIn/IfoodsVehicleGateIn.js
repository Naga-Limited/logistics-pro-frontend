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
import VehicleCapacityService from 'src/Service/SmallMaster/Vehicles/VehicleCapacityService'
import VehicleBodyTypeService from 'src/Service/SmallMaster/Vehicles/VehicleBodyTypeService'
import SearchSelectComponent from 'src/components/commoncomponent/searchSelectComponent'
import CustomTable from 'src/components/customComponent/CustomTable'
import VehicleAssignmentSapService from 'src/Service/SAP/VehicleAssignmentSapService'
import Swal from 'sweetalert2'
import DepoShipmentCreationService from 'src/Service/Depo/Shipment/DepoShipmentCreationService'
import SmallLoader from 'src/components/SmallLoader'
import IfoodsVendorMasterService from 'src/Service/Ifoods/Master/IfoodsVendorMasterService'
import IfoodsVehicleMasterService from 'src/Service/Ifoods/Master/IfoodsVehicleMasterService'
import IfoodsGateInService from 'src/Service/Ifoods/GateIn/IfoodsGateInService'
import IfoodsStofreightMasterService from 'src/Service/Ifoods/Master/IfoodsStofreightMasterService'
import IfoodsRouteMasterService from 'src/Service/Ifoods/Master/IfoodsRouteMasterService'
import IfoodsOutletMasterService from 'src/Service/Ifoods/Master/IfoodsOutletMasterService'


const IfoodsVehicleGateIn = () => {
  const formValues = {
    vendorId: '',
    vehicleId: '',
    vehicleNumber: '',
    vehicleCapacity: '',
    vehicleBodyType: '',
    vehicleInsuranceValidity: '',
    vehicleFcValidity: '',
    driver_name: '',
    driverName: '',
    driver_number: '',
    driverLicenseNumber: '',
    driverLicenseValidity: '',
    odometerKm: '',
    odometerImg: '',
    remarks: '',
    purpose: '',
    stofreight: '',
    route: '',
    unplanned_km: '',
  }

  const user_info_json = localStorage.getItem('user_info')
  const user_info = JSON.parse(user_info_json)
  const user_locations = []
  const navigation = useNavigate()
  const [rowData, setRowData] = useState([])

  //  console.log(user_info)

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
  // console.log(userLocation)

  /* ==================== Access Part Start ========================*/
  const [screenAccess, setScreenAccess] = useState(false)
  let page_no = LogisticsProScreenNumberConstants.IfoodsModuleScreens.Ifoods_loadingpoint_GateIn

  useEffect(() => {
    if (
      user_info.is_admin == 1 ||
      JavascriptInArrayComponent(page_no, user_info.page_permissions)
    ) {
      //   console.log('screen-access-allowed')
      setScreenAccess(true)
    } else {
      ///   console.log('screen-access-not-allowed')
      setScreenAccess(false)
    }
  }, [])
  /* ==================== Access Part End ========================*/

  const REQ = () => <span className="text-danger"> * </span>
  const [fetch, setFetch] = useState(false)
  const [fetch1, setFetch1] = useState(false)
  const [submitBtn, setSubmitBtn] = useState(true)
  const [vehicleCapacityData, setVehicleCapacityData] = useState([])
  const [vehicleBodyData, setVehicleBodyData] = useState([])
  const [vendorName, setvendorName] = useState('')
  const [vendorError, setvendorError] = useState(true)
  const [vehicleAvaialble, setVechicleAvaialble] = useState(false)
  const [driverAvaialble, setDriverAvaialble] = useState(false)
  const [vendorData, setVendorData] = useState([])
  const [vendorVehicleData, setVendorVehicleData] = useState([])
  const [vendorDriverData, setvendorDriverData] = useState([])
  const [vendorModal, setVendorModal] = useState(false)
  const [vehicleCapacityByVId, setVehicleCapacityByVId] = useState('')
  const [vehicleFeetByVId, setVehicleFeetByVId] = useState('')

  const [vehicleBodyTypeByVId, setVehicleBodyTypeByVId] = useState('')
  const [vehicleIValidityByVId, setVehicleIValidityByVId] = useState('')
  const [vehicleFValidityByVId, setVehicleFValidityByVId] = useState('')
  const [driver_numberById, setdriver_numberById] = useState('')
  const [driverLValidityByVId, setDriverLValidityByVId] = useState('')
  const [driverLicenseById, setDriverLicenseById] = useState('')
  const [currentVehicleInfo, setCurrentVehicleInfo] = useState({})
  const [currentTSInfo, setCurrentTSInfo] = useState({})
  const [route, setRoute] = useState('')
  const [stofreight, setstoFreight] = useState('')
  const [errorModal, setErrorModal] = useState(false)

  const { values, errors, handleChange, onFocus, handleSubmit, onBlur, isTouched } = useForm(
    action,
    DepoVehicleValidation,
    formValues
  )

  /* Parking Status */
  const ACTION = {
    GATE_IN: 1,
    WAIT_OUTSIDE: 0,
  }

  /* Vehicle Current Position */
  const Vehicle_Current_Position = {
    GATE_IN: 1,
    VEHICLE_INSPECTION_COMPLETED: 2,
    VEHICLE_INSPECTION_REJECTED: 3,
    TRIPSHEET_CREATED: 16,
    TRIPSHEET_REJECTED: 17,
    AFTER_DELIVERY_GATE_IN: 19,
    SHIPMENT_COMPLETED: 22,
    SHIPMENT_CREATED: 20,
    SHIPMENT_DELETED: 21,
    TRIP_EXPENSE_CAPTURE: 26,
    TRIP_INCOME_CAPTURE: 27,
    TRIP_INCOME_REJECT: 261,
    TRIP_SETTLEMENT_CAPTURE: 28,
    TRIP_SETTLEMENT_REJECT: 29,
  }

  const Purpose = [
    { id: 1, purpose: 'FG-Sales' },
    { id: 2, purpose: 'FG-STO' },
  ]
  const clearTimer = (e) => {
    setTimer('00:00:60')
    if (Ref.current) clearInterval(Ref.current)
    const id = setInterval(() => {
      startTimer(e)
    }, 1000)
    Ref.current = id
  }
  const [shipmentPYGData1, setShipmentPYGData1] = useState([])
  const [otpGenerated, setOtpGenerated] = useState(false)
  const gateOutAction = (PYGId) => {
    IfoodsGateInService.getParkingYardGateTrucks()
      .then((res) => {
        let tableData = res.data.data
        console.log(tableData)

        let trip = tableData[0].tripsheet_info[0].ifoods_tripsheet_no
        let ship = tableData[0].tripsheet_info[0].shipment_po

        const shipmentOrPoArray = ship.split(',').map((item) => item.replace(/,$/, ''))
        const formattedDataArray = shipmentOrPoArray.map((shipmentOrPo) => ({
          zztripsheet_no: trip,
          shipment_or_po: shipmentOrPo,
        }))
        console.log('formDataArray:', formattedDataArray)
        const SAPdata = JSON.stringify(formattedDataArray)

        const deli_json = tableData[0].tripsheet_info[0].delivery_info
        const expected_delivery = tableData[0].tripsheet_info[0].expected_delivery_date
        const tripsheet = tableData[0].tripsheet_info[0].ifoods_tripsheet_no
        const driver_contact_no = tableData[0]?.driver_number
        const vehicle_number = tableData[0]?.ifoods_Vehicle_info?.vehicle_number
        console.log(expected_delivery + 'expected_delivery')
        var inputDate = expected_delivery
        var parsedDate = new Date(inputDate)
        var day = parsedDate.getDate()
        var monthNames = [
          'Jan',
          'Feb',
          'Mar',
          'Apr',
          'May',
          'Jun',
          'Jul',
          'Aug',
          'Sep',
          'Oct',
          'Nov',
          'Dec',
        ]
        var monthIndex = parsedDate.getMonth()
        var year = parsedDate.getFullYear()
        var formattedDate = day + '-' + monthNames[monthIndex] + '-' + year

        console.log(formattedDate + 'formattedDate')
        const data = JSON.parse(deli_json)

        const formattedCustomers1 = data[0].flatMap((shipmentData1) =>
        shipmentData1.DELIVERY_COUNT.map((delivery) => ({
          customer: delivery.CUSTOMER.substring(4),
          quantity: delivery.QUANTITY,
          driver_contact_no,
          vehicle_number,
        }))
      );

      setShipmentPYGData1(formattedCustomers1);
        console.log('Formatted Customers Array:', formattedCustomers1)
       // setShipmentPYGData1(formattedCustomers1)
        IfoodsOutletMasterService.getActiveIfoodsOutlet().then((response) => {
          try {
            const master_data = JSON.stringify(response.data.data, null, 2)
            const parsedData = JSON.parse(master_data)
            if (Array.isArray(parsedData)) {
              const outletContactNumbers = formattedCustomers1.map((formattedCustomer) => {
                const outlet = parsedData.find(
                  (item) => item.outlet_code === parseInt(formattedCustomer.customer)
                )
                return outlet ? outlet.outlet_contact_no : 'N/A'
              })

              const combinedArray = formattedCustomers1.reduce(
                (accumulator, customerData, index) => {
                  const existingCustomer = accumulator.find(
                    (item) => item.customer === customerData.customer
                  )
                  const outletContactNumber = outletContactNumbers[index] || 'N/A'
                  const date = formattedDate
                  const trip_sheet = tripsheet
                  const driverContactNumber = customerData.driver_contact_no
                  const vehicleNumber = customerData.vehicle_number
                  if (existingCustomer) {
                    existingCustomer.quantity += customerData.quantity
                  } else {
                    accumulator.push({
                      customer: customerData.customer,
                      quantity: customerData.quantity,
                      outletContactNumber: outletContactNumber,
                      date: date,
                      driver_contact_no: driverContactNumber,
                      vehicle_number: vehicleNumber,
                      trip_sheet: trip_sheet,
                    })
                  }

                  return accumulator
                },
                []
              )

              console.log('Combined Array:', combinedArray)

              IfoodsGateInService.otpmsgoutlet(combinedArray).then((res) => {
                if (res.status == 200) {
                  toast.success("Outlet's Message Send Successfully!")
                } else {
                  toast.warning("Outlet's Message Send not Successfully!")
                }
              })
            } else {
              console.error('Parsed data is not an array.')
            }
          } catch (error) {
            console.error('Error parsing JSON:', error)
          }

          IfoodsGateInService.StopTSInfoToSAP(formattedDataArray).then((response) => {
            console.log(SAPdata)
            setFetch(true)
            toast.success('Tripsheet Details Updated Successfully!')
          })
          IfoodsGateInService.actionGateOut(PYGId).then((res) => {

            if (res.status === 201) {

              toast.success('Vehicle GateOut Successfully!')
              loadParkingYardGateTable()
              setTimeout(() => {
                window.location.reload(false)
              }, 3000)
            }
          })
        })
      })
      .catch((error) => {
        console.error('Error sending data to backend:', error)
      })
  }

  const resetFormValues = () => {
    values.vendorId = ''
    values.vehicleId = ''
    values.vehicleNumber = ''
    values.vehicleCapacity = ''
    values.vehicleBodyType = ''
    values.vehicleInsuranceValidity = ''
    values.vehicleFcValidity = ''
    values.driver_name = ''
    values.driverName = ''
    values.driver_number = ''
    values.driverLicenseNumber = ''
    values.driverLicenseValidity = ''
    values.remarks = ''
    values.odometerKm = ''
    values.odometerImg = ''
  }
  const [error, setError] = useState({})

  useEffect(() => {
    IfoodsRouteMasterService.getActiveIfoodsRoutes().then((res) => {
      setRoute(res.data.data)
    })

    IfoodsStofreightMasterService.getActiveIfoodsStofreight().then((res) => {
      setstoFreight(res.data.data)
    })
  }, [])

  const onChangeFilter1 = (event) => {
    var selected_value = event.value
    if (selected_value) {
      setstoFreight(selected_value)
      setError(false)
    } else {
      setstoFreight('')
      setError(true)
    }
  }
  const onChangeFilter2 = (event) => {
    var selected_value = event.value
    if (selected_value) {
      setRoute(selected_value)
      setError(false)
    } else {
      setRoute('')
      setError(true)
    }
  }

  const pgiCompleteGO = (data) => {
    const formDataPGI = new FormData()
    formDataPGI.append('tripsheet_no', data.vehicle_tripsheet_info.depo_tripsheet_no)
    formDataPGI.append('veh_no', data.vehicle_info.vehicle_number)
    formDataPGI.append('tknum', data.shipment_info.shipment_no)
    formDataPGI.append('del_count', data.shipment_info.shipment_child_info.length)
    console.log('tripsheet_no', data.vehicle_tripsheet_info.depo_tripsheet_no)
    console.log('veh_no', data.vehicle_info.vehicle_number)
    console.log('tknum', data.shipment_info.shipment_no)
    console.log('del_count', data.shipment_info.shipment_child_info.length)

    VehicleAssignmentSapService.updateShipmentInvoiceCompletion(formDataPGI)
      .then((res) => {
        let sap_response = res.data
        if (res.status == 200) {
          if (sap_response.STATUS == 1) {
            sap_response.updated_by = user_id
            let sap_response_data = JSON.stringify(sap_response)

            DepoShipmentCreationService.updateSecondWeightInfoToDb(sap_response_data)
              .then((res) => {
                setFetch(true)
                if (res.status == 200) {
                  Swal.fire({
                    title: res.data.message,
                    icon: 'success',
                    confirmButtonText: 'OK',
                  }).then(function () {
                    window.location.reload(false)
                  })
                } else if (res.status == 201) {
                  Swal.fire({
                    icon: 'warning',
                    title: 'Vehicle Gate-Out Failed',
                    text: res.data.message,
                    confirmButtonText: 'OK',
                  }).then(function () {
                    window.location.reload(false)
                  })
                } else {
                  toast.warning('Something went wrong. Kindly contact Admin..!')
                }
              })
              .catch((error) => {
                setFetch(true)
                var object = error.response.data.errors
                var output = ''
                for (var property in object) {
                  output += '*' + object[property] + '\n'
                }
                setError(output)
                setErrorModal(true)
              })
          } else if (
            sap_response.STATUS == 2 ||
            sap_response.STATUS == 5 ||
            sap_response.STATUS == 6 ||
            sap_response.STATUS == 7
          ) {
            setFetch(true)
            Swal.fire({
              title: sap_response.MESSAGE,
              icon: 'warning',
              confirmButtonText: 'OK',
            }).then(function () {
              window.location.reload(false)
            })
          } else if (sap_response.STATUS == 3 || sap_response.STATUS == 4) {
            setFetch(true)
            Swal.fire({
              title: sap_response.MESSAGE,
              icon: 'info',
              confirmButtonText: 'OK',
            }).then(function () {
              window.location.reload(false)
            })
          }
        } else {
          setFetch(true)
          toast.warning('Shipment Cannot be Approved. Kindly contact Admin..!')
        }
      })
      .catch((error) => {
        // console.log(error)
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
    IfoodsGateInService.getParkingYardGateTrucks().then((res) => {
      //  console.log(res.data.data)
      let tableData = res.data.data
      let rowDataList = []
      setCurrentTSInfo(res.data.data)
      const filterData1 = tableData.filter(
        (data) => user_locations.indexOf(data.vehicle_location_id) != -1
      )
      console.log(currentTSInfo)

      const filterData2 = filterData1.filter(
        (data) =>
          (data.shipment_info &&
            (data.shipment_info.approval_status == 14 ||
              data.shipment_info.approval_status == 12)) ||
          data.shipment_info == null
      )

      //  console.log(filterData2)

      filterData2.map((data, index) => {
        //  console.log(data, 'filterData.map')

        rowDataList.push({
          sno: index + 1,
          Tripsheet_No: data.tripsheet_info[0] ? data.tripsheet_info[0].ifoods_tripsheet_no : ' - ',
          Vendor_name: data.ifoods_Vendor_info.vendor_name,
          Vehicle_No: data.ifoods_Vehicle_info.vehicle_number,
          Driver_Name: data.driver_name,
          Purpose: data.purpose == 1 ? 'FG-Sales' : 'FG-STO',
          Waiting_At: (
            <span className="badge rounded-pill bg-info">
              {data.vehicle_current_position == Vehicle_Current_Position.VEHICLE_INSPECTION_REJECTED
                ? 'Vehicle Inspection Rejected'
                : data.vehicle_current_position == Vehicle_Current_Position.TRIPSHEET_REJECTED
                ? 'Tripsheet Creation Rejected'
                : data.vehicle_current_position == Vehicle_Current_Position.SHIPMENT_DELETED
                ? 'Shipment Deletion'
                : data.vehicle_current_position == Vehicle_Current_Position.AFTER_DELIVERY_GATE_IN
                ? 'After Delivery Gate In'
                : data.shipment_info && data.shipment_info.approval_status == 14
                ? 'Shipment - PGI After Gateout'
                : data.vehicle_current_position == Vehicle_Current_Position.SHIPMENT_COMPLETED
                ? 'Shipment Completion'
                : 'Tripsheet Creation Completed'}
            </span>
          ),
          Screen_Duration: data.vehicle_current_position_updated_time,
          Overall_Duration: data.created_at,
          Action: (
            <CButton
              type="button"
              onClick={(e) => {
                setFetch(false)
                // data.shipment_info && data.shipment_info.approval_status == 14
                //   ? pgiCompleteGO(data):
                gateOutAction(data.ifoods_parking_yard_gate_id)
              }}
              className="badge text-white"
              color="warning"
            >
              Loading Point Out
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
      setFetch(true)
      toast.warning('Please choose the vehicle number..!')

      return false
    } else if (values.driver_name == '') {
      setFetch(true)
      toast.warning('Please Enter the Driver Name..!')
      return false
    } else if (values.driver_number == '') {
      setFetch(true)
      toast.warning('Please enter the Driver Number..!')
      return false
    } else if (values.odometerKm == '') {
      setFetch(true)
      toast.warning('Please Upload OdometerKm Number..!')
      return false
    } else if (values.odometerImg == '') {
      setFetch(true)
      toast.warning('Please Upload OdometerKm Photo..!')
      return false
    } else if (values.purpose == '') {
      setFetch(true)
      toast.warning('Please Choose the Trip Purpose..!')
      return false
    } else if (values.purpose == 2) {
      console.log('stoCheck', stofreight)
      if (stofreight > 0 || stofreight.length == 0) {
        //
      } else {
        setFetch(true)
        toast.warning('Please Choose STO Journey..!')
        return false
      }
    } else if (values.purpose == 1) {
      console.log('stoCheck', route)
      if (route > 0 || route.length == 0) {
        //
      } else {
        setFetch(true)
        toast.warning('Please Choose Route Journey..!')
        return false
      }
    }
    console.log('values.purpose' + values.purpose)

    const formData = new FormData()

    formData.append('vendor_id', vendorName)
    formData.append('driver_name', values.driver_name)
    formData.append('driver_number', values.driver_number)
    formData.append('vehicle_id', values.vehicleId)
    formData.append('odometer_km', values.odometerKm)
    if (values.odometerImg !== '') {
      formData.append('odometer_photo', values.odometerImg)
    }
    formData.append('vehicle_location_id', userLocation)
    formData.append('remarks', values.remarks)
    formData.append('purpose', values.purpose)
    //formData.append('stofreight_id', stofreight)
    if (values.purpose == '2') {
      formData.append('stofreight_id', stofreight)
    }
    if (values.purpose == '1') {
      formData.append('route_id', route)
    }
    // formData.append('route_id', route)
    formData.append('unplanned_km', values.unplanned_km)

    formData.append('created_by', user_id)

    //  console.log(values)
    //  console.log(type)
    //debugger;
    IfoodsGateInService.handleParkingYardGateInAction(formData)
      .then((res) => {
        //  console.log(res)
        setFetch(true)
        if (res.status == 200) {
          toast.success('Vehicle GateIn Successfully!')
          //reseting the fromValues
          resetFormValues()
          setTimeout(() => {
            window.location.reload(false)
          }, 1000)
        } else if (res.status == 201) {
          toast.info('Truck Already inProcess...!')
          setTimeout(() => {
            window.location.reload(false)
          }, 3000)
        } else {
          toast.danger('Something Went Wrong!')
        }
      })
      .catch((error) => {
        // console.log(error)
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
    if (vendorName != '') {
      // setFetch(false)
      values.vendorId = vendorName
      IfoodsVehicleMasterService.getIfoodsVehicleByVendorId(vendorName).then((res) => {
        //   console.log(res.data.data, 'IfoodsVehicleByvendorId')
        let received_data = res.data.data
        let filteredData1 = received_data.filter((data) => data.vehicle_is_assigned == 0)

        if (res.status == 200 && filteredData1.length > 0) {
          setVechicleAvaialble(true)

          setVendorVehicleData(filteredData1)

          setVendorModal(true)
        } else {
          resetFormValues()
          setVendorModal(false)
          setVechicleAvaialble(false)
          setVendorVehicleData([])
        }
      })
    }
  }, [vendorName])

  useEffect(() => {
    //section for getting Vendor Data from database
    IfoodsVendorMasterService.getActiveIfoodsVendors().then((res) => {
      setFetch(true)
      // console.log(res.data.data)
      let vendor_data = res.data.data
      let filterData = vendor_data.filter((data) => data.vendor_location == user_locations[0])
      //console.log(filterData)

      if (user_info.is_admin == 1) {
        setVendorData(vendor_data)
      } else {
        setVendorData(filterData)
      }
    })
  }, [])

  useEffect(() => {
    IfoodsVehicleMasterService.getIfoodsVehicles().then((res) => {
      //  console.log(res.data.data, 'getSingleVehicleInfoOnParkingYardGate')
      isTouched.remarks = true
      setCurrentVehicleInfo(res.data.data)
      setFetch(true)
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
      name: 'Vendor Name',
      selector: (row) => row.Vendor_name,
      sortable: true,
      center: true,
    },
    {
      name: 'Trip-Purpose ',
      selector: (row) => row.Purpose,
      sortable: true,
      center: true,
    },
    {
      name: 'Vehicle No',
      selector: (row) => row.Vehicle_No,
      sortable: true,
      center: true,
    },
    // {
    //   name: 'Driver Name',
    //   selector: (row) => row.Driver_Name,
    //   sortable: true,
    //   center: true,
    // },
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
    // {
    //   name: ' Overall Duration',
    //   selector: (row) => row.Overall_Duration,
    //   center: true,
    // },
    {
      name: 'Action',
      selector: (row) => row.Action,
      center: true,
    },
  ]

  const onChangeFilter = (event) => {
    var selected_value = event.value
    // console.log(selected_value, 'selected_value')
    if (selected_value) {
      setvendorName(selected_value)
      setvendorError(false)
    } else {
      setvendorName('')
      setvendorError(true)
    }
  }

  useEffect(() => {
    if (values.vehicleId) {
      //section to fetch single vendor info
      IfoodsVehicleMasterService.getIfoodsVehicleById(values.vehicleId).then((res) => {
        isTouched.vehicleCapacity = true
        isTouched.vehicleNumber = true
        isTouched.vehicleBodyType = true
        isTouched.vehicleInsuranceValidity = true
        isTouched.vehicleFcValidity = true
        //console.log(res.data.data, 'getDepoVehicleById')
        setVehicleFeetByVId(res.data.data.feet_info.capacity)
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
      setVehicleFeetByVId('')
      setVehicleCapacityByVId('')
      setVehicleBodyTypeByVId('')
      setVehicleIValidityByVId('')
      setVehicleFValidityByVId('')
    }
  }, [values.vehicleId])

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
                          <CFormLabel htmlFor="ifoodsVendorName">
                            Vendor Name <REQ />{' '}
                            {(vehicleAvaialble == false || vehicleAvaialble == false) &&
                              vendorName != '' && (
                                <span className="small text-danger">Vehicle Not Available </span>
                              )}
                            {vendorName == '' && (
                              <span className="small text-danger">Select The Vendor Name</span>
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
                            label="Select Vendor Name"
                            noOptionsMessage="Vendor Not found"
                            search_type="ifoods_Vendors"
                            search_data={vendorData}
                          />
                        </CCol>

                        {vendorName != '' && vehicleAvaialble && (
                          <>
                            <CCol xs={12} md={3}>
                              <CFormLabel htmlFor="vehicleId">
                                Vehicle Number <REQ />{' '}
                                {errors.vehicleId && (
                                  <span className="small text-danger">{errors.vehicleId}</span>
                                )}
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
                                required
                              >
                                <option value="">Select...</option>
                                {vendorVehicleData.map(({ id, vehicle_number }) => {
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
                              <CFormLabel htmlFor="vehicleCapacity">Vehicle Feet </CFormLabel>
                              <CFormInput
                                size="sm"
                                id="vehicleCapacity"
                                name="vehicleCapacity"
                                value={vehicleFeetByVId}
                                readOnly
                              />
                            </CCol>
                            <CCol xs={12} md={3}>
                              <CFormLabel htmlFor="vehicleCapacity">
                                Vehicle Capacity In Mts{' '}
                              </CFormLabel>
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
                              <CFormLabel htmlFor="vehicleInsuranceValidity">
                                Vehicle Insurance Valid To{' '}
                              </CFormLabel>
                              <CFormInput
                                size="sm"
                                id="vehicleInsuranceValidity"
                                name="vehicleInsuranceValidity"
                                value={vehicleIValidityByVId}
                                readOnly
                              />
                            </CCol>

                            <CCol xs={12} md={3}>
                              <CFormLabel htmlFor="vehicleFcValidity">
                                Vehicle FC Valid To{' '}
                              </CFormLabel>
                              <CFormInput
                                size="sm"
                                id="vehicleFcValidity"
                                name="vehicleFcValidity"
                                value={vehicleFValidityByVId}
                                readOnly
                              />
                            </CCol>

                            <CCol xs={12} md={3}>
                              <CFormLabel htmlFor="driver_name">
                                Driver Name <REQ />{' '}
                                {errors.driver_name && (
                                  <span className="small text-danger">{errors.driver_name}</span>
                                )}
                              </CFormLabel>
                              <CFormInput
                                size="sm"
                                name="driver_name"
                                id="driver_name"
                                required
                                maxLength={30}
                                onFocus={onFocus}
                                onBlur={onBlur}
                                onChange={handleChange}
                                value={values.driver_name}
                                className={`${errors.driver_name && 'is-invalid'}`}
                                aria-label="Small select example"
                              ></CFormInput>
                            </CCol>

                            <CCol xs={12} md={3}>
                              <CFormLabel htmlFor="driver_number">Driver Contact Number</CFormLabel>
                              <CFormInput
                                size="sm"
                                name="driver_number"
                                id="driver_number"
                                maxLength={30}
                                onFocus={onFocus}
                                onBlur={onBlur}
                                onChange={handleChange}
                                value={values.driver_number}
                                className={`${errors.driver_number && 'is-invalid'}`}
                                aria-label="Small select example"
                                required
                              />
                            </CCol>
                            <CCol xs={12} md={3}>
                              <CFormLabel htmlFor="odometerKm">
                                Odometer KM <REQ />{' '}
                                {errors.odometerKm && (
                                  <span className="small text-danger">{errors.odometerKm}</span>
                                )}
                              </CFormLabel>
                              <CFormInput
                                size="sm"
                                name="odometerKm"
                                id="odometerKm"
                                maxLength={6}
                                onFocus={onFocus}
                                onBlur={onBlur}
                                onChange={handleChange}
                                value={values.odometerKm}
                                required
                              />
                            </CCol>

                            <CCol xs={12} md={3}>
                              <CFormLabel htmlFor="odoImg">
                                Odometer Photo <REQ />{' '}
                                {errors.odometerImg && (
                                  <span className="small text-danger">{errors.odometerImg}</span>
                                )}
                              </CFormLabel>
                              <CFormInput
                                type="file"
                                name="odometerImg"
                                onFocus={onFocus}
                                onBlur={onBlur}
                                onChange={handleChange}
                                className={`${errors.odometerImg && 'is-invalid'}`}
                                size="sm"
                                id="odoImg"
                                accept=".jpg,.jpeg,.png,.pdf"
                                required
                              />
                            </CCol>
                            <CCol xs={12} md={3}>
                              <CFormLabel htmlFor="purpose">
                                Purpose <REQ />{' '}
                                {errors.purpose && (
                                  <span className="small text-danger">{errors.purpose}</span>
                                )}
                              </CFormLabel>
                              <CFormSelect
                                size="sm"
                                name="purpose"
                                id="purpose"
                                onFocus={onFocus}
                                onBlur={onBlur}
                                onChange={handleChange}
                                //  disabled={singleVehicleInfo.trip_sto_status == '1' ? true : false}
                                value={
                                  currentVehicleInfo.trip_sto_status != '1' ? values.purpose : 2
                                }
                                className={`${errors.purpose && 'is-invalid'}`}
                                aria-label="Small select example"
                                required
                              >
                                <option value="">Select...</option>
                                {currentVehicleInfo.trip_sto_status == '1' &&
                                  Purpose.map(({ id, purpose }) => {
                                    return (
                                      <>
                                        <option value={id}>{purpose}</option>
                                      </>
                                    )
                                  })}
                                {Purpose.map(({ id, purpose }) => {
                                  if (id != 3) {
                                    return (
                                      <>
                                        <option value={id}>{purpose}</option>
                                      </>
                                    )
                                  }
                                })}
                              </CFormSelect>
                            </CCol>

                            <CRow className="">
                              {values.purpose == 2 && (
                                <CCol xs={12} md={3}>
                                  <CFormLabel htmlFor="">
                                    STO Journey <REQ />{' '}
                                    {errors.location && (
                                      <span className="small text-danger">{errors.ifoods_sto}</span>
                                    )}
                                  </CFormLabel>
                                  <SearchSelectComponent
                                    aria-label="Small select example"
                                    id="ifoods_sto"
                                    size="sm"
                                    className="mb-2"
                                    onChange={(e) => {
                                      onChangeFilter1(e)
                                      {
                                        handleChange
                                      }
                                    }}
                                    label="Select Form & TO Location"
                                    noOptionsMessage="Location Not found"
                                    search_type="ifoods_sto"
                                    search_data={stofreight}
                                  />
                                </CCol>
                              )}
                              {values.purpose == 1 && (
                                <CCol xs={12} md={3}>
                                  <CFormLabel htmlFor="">
                                    Route name <REQ />{' '}
                                    {errors.location && (
                                      <span className="small text-danger">
                                        {errors.ifoods_sales}
                                      </span>
                                    )}
                                  </CFormLabel>
                                  <SearchSelectComponent
                                    aria-label="Small select example"
                                    id="ifoods_sales"
                                    size="sm"
                                    className="mb-2"
                                    onChange={(e) => {
                                      onChangeFilter2(e)
                                      {
                                        handleChange
                                      }
                                    }}
                                    label="Select Route Name "
                                    noOptionsMessage="Route Not found"
                                    search_type="ifoods_route"
                                    search_data={route}
                                  />
                                </CCol>
                              )}

                              {values.purpose == 1 && route == 1 && (
                                <CCol xs={12} md={3}>
                                  <CFormLabel htmlFor="">
                                    Un Planned KM <REQ />{' '}
                                    {errors.location && (
                                      <span className="small text-danger">{errors.ifoods_sto}</span>
                                    )}
                                  </CFormLabel>
                                  <CFormInput
                                    name="unplanned_km"
                                    size="sm"
                                    id="unplanned_km"
                                    onFocus={onFocus}
                                    onBlur={onBlur}
                                    onChange={handleChange}
                                    value={values.unplanned_km}
                                  />
                                </CCol>
                              )}

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
                            </CRow>
                          </>
                        )}
                      </CRow>

                      {vendorName != '' && (
                        <>
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
            </>
          ) : (
            <AccessDeniedComponent />
          )}
          {/* ============ Vendor Details Missing Modal Area ================ */}
          <CModal
            visible={false}
            backdrop="static"
            onClose={() => {
              setVendorModal(false)
            }}
          >
            <CModalBody>
              {!vehicleAvaialble && (
                <p className="small text-danger">Vehicle Not Available For The Selected Vendor</p>
              )}
              {!driverAvaialble && (
                <p className="small text-danger">Driver Not Available For The Selected Vendor</p>
              )}
              {vendorName == '' && <p className="small text-danger">Select The Vendor Name</p>}
            </CModalBody>
            <CModalFooter>
              <CButton
                color="secondary"
                onClick={() => {
                  setVendorModal(false)
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

export default IfoodsVehicleGateIn
