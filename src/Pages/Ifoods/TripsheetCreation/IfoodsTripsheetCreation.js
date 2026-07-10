import {
  CButton,
  CCard,
  CCol,
  CContainer,
  CCardImage,
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
  CFormCheck,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CFormTextarea,
  CButtonGroup,
  CAlert,
  CInputGroupText,
  CInputGroup,
} from '@coreui/react'
import { React, useEffect, useState } from 'react'
import useForm from 'src/Hooks/useForm.js'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Loader from 'src/components/Loader'
import AccessDeniedComponent from 'src/components/commoncomponent/AccessDeniedComponent'
import JavascriptInArrayComponent from 'src/components/commoncomponent/JavascriptInArrayComponent'
import * as LogisticsProScreenNumberConstants from 'src/components/constants/LogisticsProScreenNumberConstants'
import VehicleInspectionValidation from 'src/Utils/TransactionPages/VehicleInspection/VehicleInspectionValidation'
import DepoTSCreationService from 'src/Service/Depo/TSCreation/DepoTSCreationService'
import IfoodsTSCreationService from 'src/Service/Ifoods/TSCreation/IfoodsTSCreationService'
import IfoodsRouteMasterService from 'src/Service/Ifoods/Master/IfoodsRouteMasterService'
import IfoodsStofreightMasterService from 'src/Service/Ifoods/Master/IfoodsStofreightMasterService'
import SearchSelectComponent from 'src/components/commoncomponent/searchSelectComponent'
import IfoodsVehicleAssignmentList from 'src/components/commoncomponent/IfoodsVehicleAssignmentList'
import Swal from 'sweetalert2'
import MaintenanceWorkOrder from 'src/Service/SAP/MaintenanceWorkOrder'
import IfoodsVehicleAssignment from 'src/Service/SAP/IfoodsVehicleAssignment'
import IfoodsVehicleAssignmentListComponent from 'src/components/commoncomponent/IfoodsVehicleAssignmentListComponent'
import IfoodsVehicleStoListComponent from 'src/components/commoncomponent/IfoodsVehicleStoListComponent'
import TripSheetCreationValidation from 'src/Utils/TripSheetCreation/TripSheetCreationValidation'
//import IfoodsVehicleShipmentSapService from 'src/Service/SAP/IfoodsVehicleShipmentSapService'

const IfoodsTripsheetCreation = () => {
  /*================== User Id & Location Fetch ======================*/
  const user_info_json = localStorage.getItem('user_info')
  const user_info = JSON.parse(user_info_json)
  const user_locations = []
  const navigation = useNavigate()
  const [rowData, setRowData] = useState([])

  //console.log(user_info)

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
  let page_no = LogisticsProScreenNumberConstants.IfoodsModuleScreens.Ifoods_Tripsheet

  useEffect(() => {
    if (
      user_info.is_admin == 1 ||
      JavascriptInArrayComponent(page_no, user_info.page_permissions)
    ) {
      // console.log('screen-access-allowed')
      setScreenAccess(true)
    } else {
      // console.log('screen-access-not-allowed')
      setScreenAccess(false)
    }
  }, [])
  /* ==================== Access Part End ========================*/

  const formValues = {
    expected_delivery_date: '',
    shipment_po: '',
    remarks: '',
    shipmentOrder: '',
    loadDetails: '',
  }

  const Purpose = [
    { id: 1, purpose: 'FG-Sales' },
    { id: 2, purpose: 'FG-STO' },
    { id: 3, purpose: 'RM-STO' },
  ]
  const [stofreight, setstoFreight] = useState([])
  const [route, setRoute] = useState([])
  const purpose_array = ['FG_SALES', 'FG_STO', 'RM_STO']
  const {
    values,
    errors,
    handleChange,
    onFocus,
    handleSubmit,
    enableSubmit,
    onBlur,
    isTouched,
    selectedValue,
    handleMultipleChange,
  } = useForm(createTrip, TripSheetCreationValidation, formValues)

  //const navigation = useNavigate()
  const REQ = () => <span className="text-danger"> * </span>

  const TripsheetCreationCancel = () => {
    //console.log(remarks)
    if (remarks && remarks.trim()) {
      setRejectConfirm(true)
    } else {
      toast.warning('You should give the proper reason for rejection via remarks... ')
      values.remarks = ''
      setRemarks('')
      return false
    }
  }
  const border = {
    borderColor: '#b1b7c1',
  }

  useEffect(() => {
    //section for getting Sales Data from database
    IfoodsRouteMasterService.getActiveIfoodsRoutes().then((res) => {
      setRoute(res.data.data)
      //  console.log(res.data.data, 'Sales Data')
    })

    //section for getting STO Data from database
    IfoodsStofreightMasterService.getActiveIfoodsStofreight().then((res) => {
      setstoFreight(res.data.data)
      //  console.log(res.data.data, 'STO Data')
    })
  }, [])

  const createTripsheet = (status) => {
    let data = new FormData()
    data.append('parking_id', currentVehicleInfo.ifoods_parking_yard_gate_id)
    data.append('vehicle_id', currentVehicleInfo.ifoods_Vehicle_info.id)
    data.append('driver_name', currentVehicleInfo.driver_name)
    data.append('vehicle_location_id', currentVehicleInfo.vehicle_location_info.location_alpha_code)
    data.append('remarks', remarks)
    data.append('trip_crate', values.trip_crate)
    data.append('product_temp', values.product_temp)
    data.append('expected_delivery_date', values.expected_delivery_date)

    // for (let i = 0; i < loadDetail.length; i++) {
    //   data.append('delivery_info', JSON.stringify(loadDetail[i]));
    // }
   data.append('delivery_info', JSON.stringify(loadDetail))
    data.append('shipment_po', values.shipment_po)
    data.append('status', status)
    data.append('created_by', user_id)
  //  console.log(values.shipment_po)
  //  console.log(loadDetail)
    // debugger

    if (values.expected_delivery_date || status == 2) {
      setFetch(true)

      IfoodsTSCreationService.handleTripsheetCreationAction(data)
        .then((res) => {
          if (res.status == 200) {
            setFetch(true)
            toast.success('Tripsheet Creation completed')
            navigation('/IfoodsTripsheetCreationHome')
          } else if (res.status == 201) {
            toast.error('Tripsheet Creation Rejected')
            navigation('/IfoodsTripsheetCreationHome')
          }
        })
        .catch((error) => {
          setFetch(true)

          var object = error.response.data.errors
          var output = 'Tripsheet Creation Failed. Kindly Contact Admin..!'
          for (var property in object) {
            output += '*' + object[property] + '\n'
          }
          setError(output)
          setErrorModal(true)
        })
    } else {
      setFetch(true)
      toast.warning('Please Select The Expected Delivery date')
      return false
    }
  }

  const getOutlets = () => {
    const formattedObjects = currentVehicleInfo.ifoods_SalesRoute_info.ifoods_Alloutlet_Info
      .map(
        (outlet) =>
          `<li><b> Outlet Name & Code</b> ${outlet.outlet_name}  <b>&</b> ${outlet.outlet_code}`
      )
      .join('\n')
    Swal.fire({
      title: `Route Name : ${currentVehicleInfo.ifoods_SalesRoute_info.route_name} `,
      html: formattedObjects,
      confirmButtonText: 'Close',

      width: 800,
      padding: '3em',
      confirmButtonColor: '#ff6600',
      confirmButtonText: 'Close',
      iconColor: '#ff6600',
    })
  }

  function createTrip() {}
  const [visible, setVisible] = useState(false)
  const [rejectConfirm, setRejectConfirm] = useState(false)
  const [errorModal, setErrorModal] = useState(false)
  const [error, setError] = useState({})
  const [currentVehicleInfo, setCurrentVehicleInfo] = useState({})
  const [fitForLoad, setFitForLoad] = useState('')
  const [fetch, setFetch] = useState(false)

  const [shipmentOrder, setShipmentOrder] = useState(0)

  const onChangeFilter = (event, event_type) => {
    var selected_value = event.value
    // console.log(selected_value, 'selected_value')

    if (event_type == 'shipment_po') {
      if (selected_value) {
        setShipmentOrder(selected_value)
      } else {
        setShipmentOrder(0)
      }
    }
  }

  // console.log(shipmentOrder)

  const { id } = useParams()

  useEffect(() => {
    IfoodsTSCreationService.getSingleVehicleInfoOnGate(id).then((res) => {
      console.log(res.data.data, 'getSingleVehicleInfoOnParkingYardGate')
      isTouched.remarks = true
      isTouched.trip_crate = true
      isTouched.product_temp = true
      setCurrentVehicleInfo(res.data.data)

      setFetch(true)
    })
  }, [id])

  // useEffect(() => {
  //   IfoodsTSCreationService.getSingleVehicleInfoTrip(id).then((res) => {
  //     console.log(res.data.data, 'VehicleInfoOnTrip')
  //     // isTouched.remarks = true
  //     // isTouched.trip_crate = true
  //     // isTouched.product_temp = true
  //     // setCurrentVehicleInfo(res.data.data)

  //     setFetch(true)
  //   })
  // }, [id])
  const [loadDetails, setLoadDetails] = useState([])

  const [loadDetail, setLoadDetail] = useState([])
  const del_info = []
  useEffect(() => {
    IfoodsVehicleAssignment.getshipmentData(currentVehicleInfo.purpose).then((res) => {
      setFetch(true)
      let tableData = res.data
      let filterData = tableData.filter((data) => data.STATUS == currentVehicleInfo.purpose)
      setLoadDetails(filterData)
      const shipment_data = res.data
      const matchingShipments = []

      shipment_data.forEach((shipment) => {
        if (values.shipment_po.includes(shipment.SHIPMENT_OR_PO)) {
          matchingShipments.push(shipment)
        }
      })

      const shipmentsByDeliveryNo = matchingShipments.reduce((acc, shipment) => {
        const { DELIVERY_NO } = shipment
        if (!acc[DELIVERY_NO]) {
          acc[DELIVERY_NO] = []
        }
        acc[DELIVERY_NO].push(shipment)
        return acc
      }, {})

      const filteredArray = Object.values(shipmentsByDeliveryNo).filter((value) => value !== undefined)

    //  console.log(filteredArray)
    //  console.log(JSON.stringify(filteredArray))
      setLoadDetail(filteredArray)
    //  console.log(JSON.stringify(filteredArray))
    })
    // .catch((error) => {
    //   console.error(error)
    // })
      // setLoadDetail(filteredArray)
      //  console.log(filteredArray)
      // console.log(JSON.stringify(filteredArray))
  
  }, [currentVehicleInfo.purpose,values.shipment_po])

  useEffect(() => {
    var touchLength = Object.keys(isTouched).length

    if (touchLength == Object.keys(formValues).length) {
      if (Object.keys(errors).length == 0) {
        setFitForLoad('YES')
      } else {
        setFitForLoad('NO')
      }
    }
  }, [values, errors])

 

useEffect(() => {
  if (values.shipment_po && Array.isArray(values.shipment_po)) {
    IfoodsVehicleAssignment.getshipmentData(currentVehicleInfo.purpose)
      .then((res) => {
        const shipment_data = res.data
        const matchingShipments = []

        shipment_data.forEach((shipment) => {
          if (values.shipment_po.includes(shipment.SHIPMENT_OR_PO)) {
            matchingShipments.push(shipment)
          }
        })

        const shipmentsByDeliveryNo = matchingShipments.reduce((acc, shipment) => {
          const { DELIVERY_NO } = shipment
          if (!acc[DELIVERY_NO]) {
            acc[DELIVERY_NO] = []
          }
          acc[DELIVERY_NO].push(shipment)
          return acc
        }, {})

        // Convert the object to an array of values and filter out undefined values
        const filteredArray = Object.values(shipmentsByDeliveryNo).filter((value) => value !== undefined)

      //  console.log(filteredArray)
      //  console.log(JSON.stringify(filteredArray))
      })
      .catch((error) => {
        console.error(error)
      })
  }
}, [values.shipment_po])






























  const [delivery, setDelivery] = useState([])
  const [vendorData, setVendorData] = useState([])

  useEffect(() => {
    IfoodsVehicleAssignment.getshipmentData(currentVehicleInfo.purpose).then(
      (res) => {
        setFetch(true)
        const deltList = res.data
        console.log(deltList)
        const allCustomers = []

        for (const outlet of deltList) {
          for (const delivery of outlet.DELIVERY_COUNT) {
            allCustomers.push(delivery.CUSTOMER)
          }
        }
        const stringWithoutFirstFourDigits = allCustomers.map((customer) => customer.substring(4))
 
        
        if (currentVehicleInfo.ifoods_SalesRoute_info)
         {
          if (currentVehicleInfo.ifoods_SalesRoute_info.ifoods_Alloutlet_Info.length > 0)
           {
            setFetch(true)
            const outletcodelpArray = currentVehicleInfo.ifoods_SalesRoute_info.ifoods_Alloutlet_Info.map(
              (outlet) => outlet.outlet_code
            )
            console.log(stringWithoutFirstFourDigits)
           console.log(outletcodelpArray)
           const matchingValues = outletcodelpArray.filter(value => stringWithoutFirstFourDigits.includes(value.toString()));

            console.log(matchingValues + 'isMatch')
            if (matchingValues.length > 0) {
              setFetch(true)
              toast.success('Condition is TRUE: There is at least one matching Outlet')
              console.log('Matching Values:', matchingValues);
            } else {
                setFetch(true)
               Swal.fire({
                title: `Outlet Code : ${vendorData} `,
                text: 'No matching outlet code found',
                icon: 'info',
                showCloseButton: true,
              }).then(function () {
                window.location.reload(false)
              })        
             
            }
          }
        }
        if (vendorData>1) {
          if (stringWithoutFirstFourDigits.includes(vendorData.toString())) {

            setFetch(true)
            toast.success('Outlet matched with route')
           
          } else {
            setFetch(true)
            Swal.fire({
              title: `Outlet Code : ${vendorData} `,
              text: 'No matching outlet code found',
              icon: 'info',
              showCloseButton: true,
              
            }).then(function () {
              window.location.reload(false)
            })    
          }
        }
      }   
    )
  },[values.shipment_po])
  
  useEffect(() => {
    IfoodsVehicleAssignment.getshipmentData(currentVehicleInfo.purpose).then(
      (res) => {
        setFetch(true)
        const deltList = res.data
        const allCustomers = []

        for (const outlet of deltList) {
          for (const delivery of outlet.DELIVERY_COUNT) {
            allCustomers.push(delivery.CUSTOMER)
          }
        }
        const stringWithoutFirstFourDigits = allCustomers.map((customer) => customer.substring(4))
         console.log(stringWithoutFirstFourDigits+"stringWithoutFirstFourDigits")
         console.log(vendorData+"vendorData")
        if (vendorData>1) {
          if (stringWithoutFirstFourDigits.includes(vendorData.toString())) {

            setFetch(true)
            toast.success('Outlet matched with Shipment')
           
          } else {
            setFetch(true)
            Swal.fire({
              title: `Outlet Code : ${vendorData} `,
              text: 'No matching outlet code found',
              icon: 'info',
              showCloseButton: true,
              
            })
            return false
          }
        }
      }   
    )
  },[values.shipment_po,vendorData])


  const onChangeFilter1 = (event) => {
    var selected_value = event.value
    if (selected_value) {
      setVendorData(selected_value)
    } else {
      setVendorData('')
    }
  }

  const [remarks, setRemarks] = useState('')
  const handleChangenew = (event) => {
    const result = event.target.value.toUpperCase()

    setRemarks(result)
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
                          <CFormLabel htmlFor="cname">Vendor Name</CFormLabel>
                          <CFormInput
                            name="cname"
                            size="sm"
                            id="cname"
                            value={currentVehicleInfo?.ifoods_Vendor_info?.vendor_name}
                            readOnly
                          />
                        </CCol>

                        <CCol md={3}>
                          <CFormLabel htmlFor="cmn">Vendor Mobile Number</CFormLabel>
                          <CFormInput
                            name="cmn"
                            size="sm"
                            id="cmn"
                            value={currentVehicleInfo?.ifoods_Vendor_info?.vendor_contact_no}
                            readOnly
                          />
                        </CCol>

                        <CCol md={3}>
                          <CFormLabel htmlFor="vNum">Vehicle Number</CFormLabel>
                          <CFormInput
                            name="vNum"
                            size="sm"
                            id="vNum"
                            value={currentVehicleInfo?.ifoods_Vehicle_info?.vehicle_number}
                            readOnly
                          />
                        </CCol>

                        <CCol xs={12} md={3}>
                          <CFormLabel htmlFor="vcim">Vehicle Capacity In Feet</CFormLabel>
                          <CFormInput
                            name="vcim"
                            size="sm"
                            id="vcim"
                            value={
                              currentVehicleInfo?.ifoods_Vehicle_info?.vehicle_capacity_info?.capacity
                            }
                            readOnly
                          />
                        </CCol>
                      </CRow>

                      <CRow className="">
                        <CCol xs={12} md={3}>
                          <CFormLabel htmlFor="vbt">Vehicle Body Type</CFormLabel>
                          <CFormInput
                            name="vbt"
                            size="sm"
                            id="vbt"
                            value={
                              currentVehicleInfo?.ifoods_Vehicle_info?.vehicle_body_type_info?.body_type
                            }
                            readOnly
                          />
                        </CCol>
                        <CCol xs={12} md={3}>
                          <CFormLabel htmlFor="vivt">Vehicle Insurance Valid To </CFormLabel>
                          <CFormInput
                            name="vivt"
                            size="sm"
                            id="vivt"
                            value={currentVehicleInfo?.ifoods_Vehicle_info?.insurance_validity}
                            readOnly
                          />
                        </CCol>
                        <CCol xs={12} md={3}>
                          <CFormLabel htmlFor="vfvt">Vehicle FC Valid To </CFormLabel>
                          <CFormInput
                            name="vfvt"
                            size="sm"
                            id="vfvt"
                            value={currentVehicleInfo?.ifoods_Vehicle_info?.fc_validity}
                            readOnly
                          />
                        </CCol>
                        <CCol xs={12} md={3}>
                          <CFormLabel htmlFor="gateInDateTime">Gate-In Date & Time</CFormLabel>
                          <CFormInput
                            name="gateInDateTime"
                            size="sm"
                            id="gateInDateTime"
                            value={currentVehicleInfo?.gate_in_date_time_string}
                            readOnly
                          />
                        </CCol>
                      </CRow>
                      <CRow className="">
                        <CCol xs={12} md={3}>
                          <CFormLabel htmlFor="dname">Driver name </CFormLabel>
                          <CFormInput
                            name="dname"
                            size="sm"
                            id="dname"
                            value={currentVehicleInfo?.driver_name}
                            readOnly
                          />
                        </CCol>
                        <CCol xs={12} md={3}>
                          <CFormLabel htmlFor="dmn">Driver Mobile Number </CFormLabel>
                          <CFormInput
                            name="dmn"
                            size="sm"
                            id="dmn"
                            value={currentVehicleInfo?.driver_number}
                            readOnly
                          />
                        </CCol>

                        <CCol xs={12} md={3}>
                          <CFormLabel htmlFor="OdometerKM">Odometer KM</CFormLabel>
                          <CFormInput
                            name="OdometerKM"
                            size="sm"
                            id="OdometerKM"
                            value={currentVehicleInfo?.odometer_km}
                            readOnly
                          />
                        </CCol>
                        <CCol xs={12} md={3}>
                          <CFormLabel htmlFor="odoImg">Odometer Photo</CFormLabel>
                          <CButton
                            onClick={() => setVisible(!visible)}
                            className="w-100 m-0"
                            color="info"
                            size="sm"
                            id="odoImg"
                            style={border}
                          >
                            <span className="float-start">
                              <i className="fa fa-eye" aria-hidden="true"></i> &nbsp;View
                            </span>
                          </CButton>
                          <CModal visible={visible} onClose={() => setVisible(false)}>
                            <CModalHeader>
                              <CModalTitle>Odometer Photo</CModalTitle>
                            </CModalHeader>

                            {/* <CModalBody>
                            <img src={currentVehicleInfo.odometer_photo} alt="" />
                          </CModalBody> */}
                            <CModalBody>
                              {currentVehicleInfo?.odometer_photo &&
                              !currentVehicleInfo?.odometer_photo.includes('.pdf') ? (
                                <CCardImage
                                  orientation="top"
                                  src={currentVehicleInfo?.odometer_photo}
                                />
                              ) : (
                                <iframe
                                  orientation="top"
                                  height={500}
                                  width={475}
                                  src={currentVehicleInfo?.odometer_photo}
                                ></iframe>
                              )}
                            </CModalBody>

                            <CModalFooter>
                              <CButton color="secondary" onClick={() => setVisible(false)}>
                                Close
                              </CButton>
                            </CModalFooter>
                          </CModal>
                        </CCol>
                        {/* </> */}
                        {/* ) : ( */}
                        {/* <></> */}
                        {/* )} */}

                        <CCol xs={12} md={3}>
                          <CFormLabel htmlFor="inspectionDateTime">
                            Inspection Date & Time
                          </CFormLabel>
                          <CFormInput
                            name="inspectionDateTime"
                            size="sm"
                            id="inspectionDateTime"
                            value={
                              currentVehicleInfo?.vehicle_inspection_info?.inspection_time_string
                            }
                            readOnly
                          />
                        </CCol>
                        <CCol xs={12} md={3}>
                          <CFormLabel htmlFor="div_pur">Division</CFormLabel>
                          <CFormInput
                            name="div_pur"
                            size="sm"
                            id="div_pur"
                            value={'NLIF'}
                            readOnly
                          />
                        </CCol>

                        <CCol xs={12} md={3}>
                          <CFormLabel htmlFor="purpose">Purpose</CFormLabel>
                          <CFormInput
                            size="sm"
                            name="purpose"
                            id="purpose"
                            onFocus={onFocus}
                            onBlur={onBlur}
                            onChange={handleChange}
                            value={currentVehicleInfo.purpose == 1 ? 'FG-Sales' : 'FG-STO'}
                            readOnly
                            className={`${errors.purpose && 'is-invalid'}`}
                          ></CFormInput>
                        </CCol>

                        {currentVehicleInfo.purpose == 2 && (
                          <CCol xs={12} md={5}>
                            <CFormLabel htmlFor="">STO Journey</CFormLabel>
                            <CFormInput
                              size="sm"
                              name="purpose"
                              id="purpose"
                              onFocus={onFocus}
                              onBlur={onBlur}
                              onChange={handleChange}
                              value={`${currentVehicleInfo?.ifoods_StoRoute_info?.from_location_info?.location}  - ${currentVehicleInfo?.ifoods_StoRoute_info?.to_location_info?.location} `}
                              readOnly
                              className={`${errors.purpose && 'is-invalid'}`}
                            ></CFormInput>
                          </CCol>
                        )}

                        {currentVehicleInfo.purpose == 1 && (
                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="">Route & Outlets Count</CFormLabel>
                            <CInputGroup>
                              <CFormInput
                                size="sm"
                                name="purpose"
                                id="purpose"
                                onFocus={onFocus}
                                onBlur={onBlur}
                                onChange={handleChange}
                                value={`${currentVehicleInfo?.ifoods_SalesRoute_info?.route_name}  - ${currentVehicleInfo?.ifoods_SalesRoute_info?.ifoods_Alloutlet_Info?.length} Count`}
                                readOnly
                                className={`${errors.purpose && 'is-invalid'}`}
                                search_data={currentVehicleInfo}
                              ></CFormInput>

                              <CInputGroupText className="px-1">
                                <CButton size="sm" color="primary" onClick={(e) => getOutlets(e)}>
                                  <i className="fa fa-cutlery "></i>
                                </CButton>
                              </CInputGroupText>
                            </CInputGroup>
                          </CCol>
                        )}
                      </CRow>
                      <CRow className="">
                        {currentVehicleInfo.purpose == 1 &&
                          currentVehicleInfo?.ifoods_SalesRoute_info?.id == 1 && (
                            <CCol xs={12} md={3}>
                              <CFormLabel htmlFor="">Un Planned KM</CFormLabel>
                              <CFormInput
                                size="sm"
                                name="purpose"
                                id="purpose"
                                onFocus={onFocus}
                                onBlur={onBlur}
                                onChange={handleChange}
                                value={currentVehicleInfo.unplanned_km}
                                readOnly
                                className={`${errors.purpose && 'is-invalid'}`}
                              ></CFormInput>
                            </CCol>
                          )}

                        {currentVehicleInfo.purpose == 1 && (
                          <CCol className="mb-3" md={3}>
                            <CFormLabel htmlFor="shipment_po">
                              Shipment Number <REQ />{' '}
                              {errors.shipment_po && (
                                <span className="small text-danger">{errors.shipment_po}</span>
                              )}
                            </CFormLabel>
                            {/* <IfoodsVehicleAssignmentList
                              size="sm"
                              id="shipment_po"
                              className={`${errors.shipment_po && 'is-invalid'}`}
                              name="shipment_po"
                              onFocus={onFocus}
                              onBlur={onBlur}
                              onChange={(e) => {
                                onChangeFilter(e, 'shipment_pos')
                              }}
                              label="Select Shipment Number"
                              noOptionsMessage="Shipment Number Not found"
                              search_type="shipment_po"
                              search_data={loadDetails}
                              selectedValue={values.shipment_po}
//                              isMultiple={true}
                         

                         
                            ></IfoodsVehicleAssignmentList> */}
                            <IfoodsVehicleAssignmentListComponent
                              size="sm"
                              name="shipment_po"
                              id="shipment_po"
                              onFocus={onFocus}
                              onBlur={onBlur}
                              onChange={handleMultipleChange}
                              selectedValue={values.shipment_po}
                              //  search_type="shipment_po"
                              // search_data={loadDetails}
                              isMultiple={true}
                              className={`mb-1 ${errors.shipment_po && 'is-invalid'}`}
                              label="Select Shipment Location"
                              noOptionsMessage="No Shipment found"
                            />
                          </CCol>
                        )}
                        {currentVehicleInfo.purpose == 1 &&
                          currentVehicleInfo?.ifoods_SalesRoute_info?.id == 1 && (
                            <CCol xs={12} md={3}>
                              <CFormLabel htmlFor="">Select Outlet</CFormLabel>
                              <SearchSelectComponent
                                size="sm"
                                className="mb-2"
                                onBlur={onBlur}
                                onChange={(e) => {
                                  onChangeFilter1(e)
                                  {
                                    handleChange
                                  }
                                }}
                                //  value={values.vendorData}
                                label="Select Outlet Name"
                                noOptionsMessage="Outlet Not found"
                                search_type="ifoods_Outlets"
                                search_data={vendorData}
                              />
                            </CCol>
                          )}

                        {currentVehicleInfo.purpose == 2 && (
                          <CCol className="mb-3" md={3}>
                            <CFormLabel htmlFor="shipment_po">
                              Delivery Number <REQ />{' '}
                              {errors.shipment_po && (
                                <span className="small text-danger">{errors.shipment_po}</span>
                              )}
                            </CFormLabel>
                            {/* <SearchSelectComponent
                              size="sm"
                              id="shipment_po"
                              className={`${errors.shipment_po && 'is-invalid'}`}
                              name="shipment_po"
                              onFocus={onFocus}
                              onBlur={onBlur}
                              onChange={(e) => {
                                onChangeFilter(e, 'shipment_pos')
                              }}
                              label="Select Delivery Number"
                              noOptionsMessage="Delivery Number Not found"
                              //  selectedValue={values.shipment_po}
                            //  search_type="shipment_po"
                             // search_data={loadDetails}
                              isMultiple={true}
                              //  value={filterData}

                            ></SearchSelectComponent> */}

                            <IfoodsVehicleStoListComponent
                              size="sm"
                              name="shipment_po"
                              id="shipment_po"
                              onFocus={onFocus}
                              onBlur={onBlur}
                              onChange={handleMultipleChange}
                              selectedValue={values.shipment_po}
                              //  search_type="shipment_po"
                              // search_data={loadDetails}
                              isMultiple={true}
                              className={`mb-1 ${errors.shipment_po && 'is-invalid'}`}
                              label="Select Shipment Location"
                              noOptionsMessage="No Shipment found"
                            />
                          </CCol>
                        )}
                        <CCol xs={12} md={3}>
                          <CFormLabel htmlFor="">Despatched Crate Count </CFormLabel>
                          <CFormInput
                            size="sm"
                            name="trip_crate"
                            id="trip_crate"
                            type="number"
                            onFocus={onFocus}
                            onBlur={onBlur}
                            onChange={handleChange}
                            value={values.trip_crate}
                            className={`${errors.trip_crate && 'is-invalid'}`}
                          ></CFormInput>
                        </CCol>

                        <CCol xs={12} md={3}>
                          <CFormLabel htmlFor="">Product Temperature°<REQ />{' '}
                              {errors.product_temp && (
                                <span className="small text-danger">{errors.product_temp}</span>
                              )} </CFormLabel>
                          <CFormInput
                            size="sm"
                            name="product_temp"
                            id="product_temp"
                            type="number"
                            onFocus={onFocus}
                            onBlur={onBlur}
                            onChange={handleChange}
                           value={values.product_temp}
                           // value={`-${values.product_temp}`} 
                            className={`${errors.product_temp && 'is-invalid'}`}
                            required
                          ></CFormInput>
                        </CCol>

                        <CCol xs={12} md={3}>
                          <CFormLabel htmlFor="expected_delivery_date">
                            Expected Delivery Date <REQ />{' '}
                            {errors.expected_date_time && (
                              <span className="small text-danger">{errors.expected_date_time}</span>
                            )}
                          </CFormLabel>
                          <CFormInput
                            size="sm"
                            type="date"
                            name="expected_delivery_date"
                            id="expected_delivery_date"
                            onFocus={onFocus}
                            onBlur={onBlur}
                            onChange={handleChange}
                            value={values.expected_delivery_date}
                          />
                        </CCol>
                        <CCol xs={12} md={3}>
                          <CFormLabel htmlFor="remarks">Remarks</CFormLabel>
                          <CFormTextarea
                            id="remarks"
                            onFocus={onFocus}
                            onBlur={onBlur}
                            onChange={handleChangenew}
                            value={remarks || ''}
                            name="remarks"
                            rows="1"
                          ></CFormTextarea>
                        </CCol>
                      </CRow>
                      <CRow className="mt-2">
                        <CCol>
                          <Link to={'/IfoodsTripsheetCreationHome'}>
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
                          <CButton
                            size="sm"
                            color="warning"
                            className="mx-1 px-2 text-white"
                            type="button"
                            onClick={() => {
                              setFetch(false)
                              createTripsheet(1)
                            }}
                          >
                            Create
                          </CButton>

                          {/* <CButton
                            size="sm"
                            color="warning"
                            className="mx-1 px-2 text-white"
                            type="button"
                            onClick={() => {
                              TripsheetCreationCancel()
                            }}
                          >
                            Reject
                          </CButton> */}
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
      {/* Error Modal Section */}

      <CModal visible={errorModal} onClose={() => setErrorModal(false)}>
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
      {/* ======================= Confirm Button Modal Area ========================== */}
      <CModal
        visible={rejectConfirm}
        backdrop="static"
        onClose={() => {
          setRejectConfirm(false)
        }}
      >
        <CModalBody>
          <p className="lead">Are you sure to reject this Tripsheet Creation ?</p>
        </CModalBody>
        <CModalFooter>
          <CButton
            className="m-2"
            color="warning"
            onClick={() => {
              setRejectConfirm(false)
              setFetch(false)
              createTripsheet(2)
            }}
          >
            Confirm
          </CButton>
          <CButton
            color="secondary"
            onClick={() => {
              setRejectConfirm(false)
            }}
          >
            Cancel
          </CButton>
        </CModalFooter>
      </CModal>

      {/* *********************************************************** */}
    </>
  )
}

export default IfoodsTripsheetCreation
