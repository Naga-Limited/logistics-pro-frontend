import {
  CCol,
  CRow,
  CContainer,
  CCard,
  CFormInput,
  CFormSelect,
  CFormTextarea,
  CFormLabel,
  CHeaderBrand,
  CInputGroup,
  CInputGroupText,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
  CTable,
  CTableBody,
  CTableHead,
} from '@coreui/react'
import React, { useEffect, useState } from 'react'
import NlmtSearchSelectComponent from 'src/components/commoncomponent/NlmtSearchSelectComponent'
import SearchSelectComponent from 'src/components/commoncomponent/searchSelectComponent'
import Loader from 'src/components/Loader'
import SmallLoader from 'src/components/SmallLoader'
import DefinitionsListApi from 'src/Service/Definitions/DefinitionsListApi'
import VehicleMasterService from 'src/Service/Master/VehicleMasterService'
import NlmtDefinitionsListApi from 'src/Service/Nlmt/Masters/NlmtDefinitionsListApi'
import NlmtVehicleMasterService from 'src/Service/Nlmt/Masters/NlmtVehicleMasterService'
import NlmtVehicleAssignmentSapService from 'src/Service/Nlmt/SAP/NlmtVehicleAssignmentSapService'
import VehicleAssignmentSapService from 'src/Service/SAP/VehicleAssignmentSapService'
import CustomerFreightApi from 'src/Service/SubMaster/CustomerFreightApi'
import LocationApi from 'src/Service/SubMaster/LocationApi'

const NlmtAssignTruckInfo = ({
  values,
  getvnum,
  getvtripinfo,
  getvroute,
  delivery_sequence,
  delivery_data,
  division,
  last_delivery_route,
  getFgstoData,
}) => {
  /* values = Form Values , getvnum = Selected Vehicle Number for validation, getvroute = Selected Vehicle Route for validation, getvtripinfo = Selected Vehicle's Tripsheet Info for checking the Tripsheet expire date older than 5 days, delivery_sequence = Array with Selected Delivery Numbers, delivery_data = All Delivery info from SAP, division = 1 - nlfd / 2 - nlcd  */

  // console.log(delivery_sequence.delivery_sequence)
  // console.log(delivery_sequence.delivery_data)
  // console.log(values)
  console.log(division + '-division')

  /*================== User Location Fetch ======================*/
  const user_info_json = localStorage.getItem('user_info')
  const user_info = JSON.parse(user_info_json)
  const user_locations = []

  const [locationData, setLocationData] = useState([])

  /* Get User Locations From Local Storage */
  user_info.location_info.map((data, index) => {
    user_locations.push(data.id)
  })

  // console.log(user_locations)
  /*================== User Location Fetch ======================*/

  function getQty(data) {
    console.log(del_qty)
    let qty = ''
    // console.log(data)
    del_qty.map((data1, index) => {
      if (data == data1.DeliveryOrderNumber) {
        // console.log(data1)
        qty = data1.DeliveryQty
        // qty = data1.DeliveryNetQty
        // return 'yes'
      }
    })
    return qty
  }

  function getCustomerCode(data) {
    console.log(del_qty)
    let code = ''
    // console.log(data)
    del_qty.map((data1, index) => {
      if (data == data1.DeliveryOrderNumber) {
        // console.log(data1)
        code = data1.CustomerCode
        // return 'yes'
      }
    })
    return code
  }

  function getCustomerName(data) {
    console.log(del_qty)
    let name = ''
    // console.log(data)
    del_qty.map((data1, index) => {
      if (data == data1.DeliveryOrderNumber) {
        // console.log(data1)
        name = data1.CustomerName
        // return 'yes'
      }
    })
    return name
  }

  function getCustomerType(data) {
    console.log(del_qty)
    let name = ''
    // console.log(data)
    del_qty.map((data1, index) => {
      if (data == data1.DeliveryOrderNumber) {
        // console.log(data1)
        name = data1.CustomerType
        // return 'yes'
      }
    })
    return name
  }

  function getCustomerLocation(data) {
    console.log(del_qty)
    let location = ''
    // console.log(data)
    del_qty.map((data1, index) => {
      if (data == data1.DeliveryOrderNumber) {
        // console.log(data1)
        location = data1.CustomerCity
        // return 'yes'
      }
    })
    return location
  }

  var del_qty = []
  var total_del_qty = 0
  var total_del_qty_rounded_value = 0
  const [tripShipmentCustomerData, setTripShipmentCustomerData] = useState([])

  // useEffect(() => {
  //   CustomerFreightApi.getCustomerFreight().then((response) => {
  //     console.log(response.data.data, 'trip_shipment_customer_data3333')
  //     let trip_shipment_customer_data = response.data.data
  //     setTripShipmentCustomerData(trip_shipment_customer_data)
  //   })

  // }, [])
  const [selectedVehicle, setSelectedVehicle] = useState(null)
  const [capacityList, setCapacityList] = useState([])
  useEffect(() => {
    NlmtDefinitionsListApi.visibleNlmtDefinitionsListByDefinition(2)
      .then((res) => {
        setCapacityList(res.data.data || [])
      })
      .catch((err) => {
        console.error('Capacity fetch failed', err)
      })
  }, [])
  const dateCheck = (dateFrom, dateTo) => {
    console.log(dateFrom, 'dateFrom')
    console.log(dateTo, 'dateTo')

    let date_t = new Date()

    let day = date_t.getDate()
    let month = date_t.getMonth() + 1
    let year = date_t.getFullYear()

    // This arrangement can be altered based on how we want the date's format to appear.
    let currentDate = `${day}-${month}-${year}`
    console.log(currentDate) // "17-6-2022"

    var d1 = dateFrom.split('-')
    var d2 = dateTo.split('-')
    var c = currentDate.split('-')

    var from = new Date(d1[2], parseInt(d1[1]) - 1, d1[0]) // -1 because months are from 0 to 11
    var to = new Date(d2[2], parseInt(d2[1]) - 1, d2[0])
    var check = new Date(c[2], parseInt(c[1]) - 1, c[0])
    console.log(check >= from && check <= to, 'condition1')
    if (check >= from && check <= to) {
      return true
    } else {
      return false
    }
  }

  useEffect(() => {
    //section for getting Location Data from database
    LocationApi.getLocation().then((res) => {
      console.log(res.data.data, 'location data')
      setLocationData(res.data.data)
    })
  }, [])

  const calculationForFreight = (plant, code) => {
    let condition = '201'
    let location = ''

    let locationFilterData = locationData.filter((data) => data.location_code == plant)

    console.log(locationFilterData, 'locationFilterData')
    if (locationFilterData.length > 0) {
      location = locationFilterData[0].id
    }
    // if(plant == '9290'){
    //   location = 8
    // } else if(plant == '1009'){
    //   location = 1
    // } else if(plant == '1020'){
    //   location = 6
    // }
    console.log(location, 'location-location')
    console.log(code, 'code')
    console.log(plant, 'plant')
    console.log(tripShipmentCustomerData, 'tripShipmentCustomerData')

    // tripShipmentCustomerData.map((data1, index1) => {
    //   if (data1.customer_code == code) {
    //     let freight_filter_info = []
    //     if (data1.freight_info && data1.freight_info.length > 0) {
    //       console.log(data1.freight_info, 'data1.freight_info')
    //       freight_filter_info = data1.freight_info.filter(
    //         (data) => data.location_id == location
    //       )
    //     }
    //     console.log(freight_filter_info, 'freight_filter_info')
    //     freight_filter_info.map((data2, index2) => {
    //       console.log(data2, 'dataaaa2')
    //       if (dateCheck(data2.formated_start_date, data2.formated_end_date) && data2.freight_status == '1') {
    //         condition = '203'
    //       } else {
    //         condition = '202'
    //       }
    //     })
    //   }
    // })

    console.log(condition, 'condition')

    return condition
  }

  //Split Delivery Data for getting Selected Delivery Numbers's Quantity
  // let filtered_del_order_qty = delivery_sequence.delivery_data.filter((c, index) => {
  let filtered_del_order_qty = delivery_data.filter((c, index) => {
    // console.log(c)
    // console.log(index)
    var temp = 0

    // console.log(delivery_sequence.response)
    // console.log(c.DeliveryOrderNumber)
    // if (delivery_sequence.delivery_sequence.response.includes(c.DeliveryOrderNumber)) {
    if (delivery_sequence.response.includes(c.DeliveryOrderNumber)) {
      del_qty.push(c)
      total_del_qty = total_del_qty + c.DeliveryQty
      // return true
    }
    // console.log(del_qty)
    // console.log(total_del_qty)
    total_del_qty_rounded_value = parseFloat(total_del_qty).toFixed(3)
    // console.log(total_del_qty_rounded_value)
  })

  // console.log(filtered_del_order_qty)

  let del_qty_array = []
  const [tsVehicle, setTSVehicle] = useState([])
  const [srVehicle, setSRVehicle] = useState([])
  const [tsInfo, setTSInfo] = useState([])
  const [fetch, setFetch] = useState(false)
  const [vehicleNumberError, setVehicleNumberError] = useState('')
  const [shipmentRouteError, setShipmentRouteError] = useState('')
  const [total_delivery_qty, setTotal_delivery_qty] = useState(0)
  const [vehicleCapacity, setVehicleCapacity] = useState('')
  const [current_vehicle_number, setCurrent_vehicle_number] = useState('')
  const REQ = () => <span className="text-danger"> * </span>

  const [message, setMessage] = useState('')
  const handleChangeRemarks = (event) => {
    const result = event.target.value.toUpperCase()
    console.log('value.message', message)
    values.remarks = result
    setMessage(result)
  }

  useEffect(() => {
    /* section for getting Truck Details For Shipment Creation from database */
    console.log('getTruckInfo')
    NlmtVehicleAssignmentSapService.getTruckInfo()
      .then((res) => {
        
        setFetch(true)
        const tableData = res?.data?.data || []
        const filterData = tableData.filter((data) =>
          user_locations.includes(data.vehicle_location_id) &&
          (
            /* 1) Hire vehicle After Tripsheet Creation */
            (data.vehicle_current_position == 16 && data.driver_id == null) || 
            /* 2) Own vehicle After Tripsheet Creation */
            (data.vehicle_current_position == 16 && data.driver_id != null) || 
            /* 3) Own vehicle After Advance Payment */
            (data.vehicle_current_position == 18 && data.driver_id != null && data.advance_payment_info) || 
            /* 4) Own vehicle After Diesel Indent Creation */
            (data.vehicle_current_position == 37 && data.driver_id != null && data.diesel_intent_info && data.diesel_intent_info.diesel_status == 1) || 
            /* 5) Own vehicle After Diesel Indent Confirmation */
            (data.vehicle_current_position == 39 && data.driver_id != null && data.diesel_intent_info && data.diesel_intent_info.diesel_status == 2) || 
            /* 6) Own vehicle After Shipment Completion */
            (data.vehicle_current_position == 22 && data.driver_id != null && data.vehicle_assignment.length > 0)
          )
        )

        console.log('getTruckInfo1',filterData)
        setTSVehicle(filterData)
      })
      .catch((err) => {
        console.error('getTruckInfo failed', err)
        setFetch(true)
      })

    /* section for getting Shipment Routes For Shipment Creation from database */
    NlmtDefinitionsListApi.visibleNlmtDefinitionsListByDefinition(5).then((response) => {
      console.log(response.data.data)
      setSRVehicle(response.data.data)
    })
  }, [])

  /* Assign the Shipment Route for Shipment Creation */
  const onChange = (event) => {
    // console.log(event)
    var route_no = event.value

    getvroute(route_no)
    if (route_no) {
      setShipmentRouteError('')
      values.shipment_route = route_no
    } else {
      setShipmentRouteError(' Required')
      values.shipment_route = ''
    }
  }

  const baseFreightInValid = (value, code, doNumber) => {
    console.log(value, 'baseFreightInValidvalue')
    console.log(code, 'baseFreightInValidcode')
    console.log(doNumber, 'baseFreightInValiddoNumber')
    let key = '101'
    value.map((val1, ind1) => {
      if (
        doNumber == val1.DeliveryOrderNumber &&
        code == val1.CustomerCode &&
        'CFR' != val1.IncoTerm
      ) {
        if (calculationForFreight(val1.DeliveryPlant, code) == '202') {
          console.log('yess')
          key = '102'
        } else {
          console.log('nooo')
        }
      }
    })
    console.log(key, 'keyy')
    return key
  }

  /* Assign the Tripsheet Number for Shipment Creation */
  const assignValues = (e) => {
    if (!e || !e.value) {
      setTSInfo([])
      getvtripinfo([])
      setVehicleCapacity('')
      setCurrent_vehicle_number('')
      setVehicleNumberError(' Required')
      return
    }
    console.log('Selected value:', e)
    console.log('All vehicles:', tsVehicle)
    const selectedTripsheetId = Number(e.value)
    getvnum(selectedTripsheetId)
    
    console.log(tsVehicle,'Data-Before')
    console.log(selectedTripsheetId,'Data-Before-ts1') 

    const filterData = tsVehicle.filter(
      (data) =>
        Number(data.tripsheet_id) === selectedTripsheetId         
    )

    console.log(filterData,'Data-After')

    if (!filterData.length) {
      setVehicleNumberError('Invalid vehicle selection')
      return
    }

    const vehicle = filterData[0]
    console.log(filterData, 'filterDatafilterDatafilterData')
    setTSInfo(filterData)
    getvtripinfo(filterData)

    /* Tripsheet Number */
    setCurrent_vehicle_number(vehicle?.nlmt_tripsheet_info?.nlmt_tripsheet_no || '')

    /* Vehicle Capacity */
    const capacityId = vehicle?.vehicle_info?.vehicle_capacity_id

    if (capacityId && capacityList.length > 0) {
      const capObj = capacityList.find((c) => String(c.definition_list_id) === String(capacityId))

      const capValue = capObj?.definition_list_name || ''

      setVehicleCapacity(capValue)
      values.vehicle_capacity_id = capacityId
    } else {
      setVehicleCapacity('')
    }

    setVehicleNumberError('')
    console.log(vehicle, 'vehiclevehiclevehicle')
    /* Form Values */
    values.vehicle_id = vehicle?.vehicle_id
    values.parking_id =
      vehicle?.nlmt_tripsheet_info?.parking_yard_info?.nlmt_trip_in_id ||
      vehicle?.tripsheet_info?.parking_id
    values.driver_id = vehicle.driver_id
    values.tripsheet_id = vehicle.tripsheet_id
    values.tripsheet_no = vehicle.tripsheet_info?.nlmt_tripsheet_no
    values.vehicle_number = vehicle.vehicle_info?.vehicle_number
    values.vehicle_type_id = vehicle.vehicle_info?.vehicle_type_id
    values.vehicle_location_id = vehicle.vehicle_location_id

    // Handle driver name from multiple possible sources
    values.driver_name =
      vehicle?.nlmt_driver_info?.driver_name ||
      vehicle?.driver_info?.driver_name ||
      vehicle?.driver_name ||
      ''

    // Handle driver phone from multiple possible sources
    values.driver_number =
      vehicle?.nlmt_driver_info?.driver_phone_1 ||
      vehicle?.driver_info?.driver_phone_1 ||
      vehicle?.driver_phone_1 ||
      ''

    console.log('Assigned driver info:', {
      driver_name: values.driver_name,
      driver_number: values.driver_number,
      vehicle_type_id: values.vehicle_type_id,
      parking_id: values.parking_id,
      tripsheet_id: values.tripsheet_id,
      tripsheet_no: values.tripsheet_no,
      vehicle_number: values.vehicle_number,
    })
  }

  const vehicle_type_finder = (row) => {
    if (!row || !row.vehicle_info) return ''

    const vehicleTypeId = Number(row.vehicle_info.vehicle_type_id)

    if (vehicleTypeId === 21) return 'Own Vehicle'
    if (vehicleTypeId === 22) return 'Hire Vehicle'
    if (vehicleTypeId === 23) return 'Party Vehicle'

    return 'Unknown Vehicle'
  }
  const vehicleTypeId = Number(tsInfo[0]?.vehicle_info?.vehicle_type_id)
  return (
    <>
      {!fetch && <SmallLoader />}
      {fetch && (
        <CContainer>
          <u>
            <CHeaderBrand style={{ color: '#4d3227', fontWeight: '600' }}>
              Delivery Details
            </CHeaderBrand>
          </u>
          <CRow className="mt-3 mb-3">
            <CCol>
              <CTable style={{ height: 'auto' }}>
                <CTableHead style={{ backgroundColor: '#4d3227', color: 'white' }}>
                  <CTableRow>
                    <CTableHeaderCell
                      scope="col"
                      style={{ color: 'white', width: '10%' }}
                      data-coreui-toggle="tooltip"
                      data-coreui-placement="top"
                      title="Sequence"
                    >
                      Seq.
                    </CTableHeaderCell>
                    <CTableHeaderCell scope="col" style={{ color: 'white', width: '15%' }}>
                      Number
                    </CTableHeaderCell>
                    <CTableHeaderCell
                      scope="col"
                      style={{ color: 'white', width: '10%' }}
                      data-coreui-toggle="tooltip"
                      data-coreui-placement="top"
                      title="Quantity in MTS"
                    >
                      Qty.
                    </CTableHeaderCell>
                    <CTableHeaderCell scope="col" style={{ color: 'white', width: '45%' }}>
                      Customer Name
                    </CTableHeaderCell>
                    <CTableHeaderCell scope="col" style={{ color: 'white', width: '25%' }}>
                      Customer Type
                    </CTableHeaderCell>
                    <CTableHeaderCell scope="col" style={{ color: 'white', width: '25%' }}>
                      Customer Location
                    </CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {/* {del_qty.map((data, index) => { */}
                  {/* {delivery_sequence.delivery_sequence.response.map((data, index) => { */}
                  {delivery_sequence.response.map((data, index) => {
                    // setTotal_delivery_qty(total_delivery_qty + data.DeliveryQty)
                    // setTotal_delivery_qty(data.DeliveryQty)
                    return (
                      <>
                        <CTableRow style={{ background: '#ebc999' }}>
                          <CTableDataCell style={{ width: '10%' }}>{index + 1}</CTableDataCell>
                          <CTableDataCell style={{ width: '15%' }}>{data}</CTableDataCell>
                          <CTableDataCell style={{ width: '10%' }}>{getQty(data)}</CTableDataCell>
                          <CTableDataCell style={{ width: '45%' }}>
                            {getCustomerName(data)}
                            {baseFreightInValid(delivery_data, getCustomerCode(data), data) ==
                              '102' && <b style={{ color: 'red' }}>{` (Zero Freight)`}</b>}
                          </CTableDataCell>
                          <CTableDataCell style={{ width: '25%' }}>
                            {getCustomerType(data)}
                          </CTableDataCell>
                          <CTableDataCell style={{ width: '25%' }}>
                            {getCustomerLocation(data)}
                          </CTableDataCell>
                        </CTableRow>
                      </>
                    )
                  })}
                </CTableBody>
              </CTable>
            </CCol>
          </CRow>
          <CRow className="mb-3">
            <CCol>
              <CInputGroup>
                <CInputGroupText
                  style={{
                    backgroundColor: '#4d3227',
                    color: 'white',
                    width: '35%',
                  }}
                >
                  Total Quantity in MTS
                </CInputGroupText>
                <CFormInput readOnly value={total_del_qty_rounded_value} />
              </CInputGroup>
            </CCol>
          </CRow>
          <u>
            {' '}
            <CHeaderBrand style={{ color: '#4d3227', fontWeight: '600' }}>
              Truck Details
            </CHeaderBrand>
          </u>
          {/* <CCard> */}
          <CRow className="mt-3">
            <CCol xs={12} md={4}>
              <CFormLabel htmlFor="vehicleNumber">
                Vehicle Number <REQ />{' '}
                {vehicleNumberError && (
                  <span className="small text-danger">{vehicleNumberError}</span>
                )}
              </CFormLabel>
              <NlmtSearchSelectComponent
                size="sm"
                className="mb-2"
                // value={selectedVehicle}
                onChange={(e) => {
                  assignValues(e)
                }}
                label="Select Vehicle Number"
                noOptionsMessage="Vehicle Not found"
                search_type="nlmt_shipment_vehicle_number"
                search_data={tsVehicle}
                division_type={division}
              />
            </CCol>
            <CCol xs={12} md={4}>
              <CFormLabel htmlFor="vCap">Tripsheet Number</CFormLabel>
              <CFormInput
                size="sm"
                className="mb-2"
                id="vCap"
                //value={tsInfo[0] ? (tsInfo[0].trip_sheet_info ? tsInfo[0].trip_sheet_info.trip_sheet_no : '123456') : ''}
                value={tsInfo[0]?.tripsheet_info?.nlmt_tripsheet_no || ''}
                readOnly
              />
            </CCol>
            <CCol xs={12} md={4}>
              <CFormLabel htmlFor="vCap">Vehicle Capacity in MTS</CFormLabel>
              <CFormInput size="sm" id="vCap" value={vehicleCapacity || ''} readOnly />
            </CCol>
            {/* </CRow>

          <CRow className=""> */}
            <CCol xs={12} md={4}>
              <CFormLabel htmlFor="vCap">Vehicle Type</CFormLabel>
              <CFormInput
                size="sm"
                className="mb-2"
                value={tsInfo[0] ? vehicle_type_finder(tsInfo[0]) : ''}
                readOnly
              />
            </CCol>

            <CCol xs={12} md={4}>
              <CFormLabel htmlFor="dName">Driver Name</CFormLabel>
              <CFormInput
                size="sm"
                id="dName"
                value={
                  tsInfo[0]?.nlmt_driver_info?.driver_name ||
                  tsInfo[0]?.driver_info?.driver_name ||
                  tsInfo[0]?.driver_name ||
                  ''
                }
                readOnly
              />
            </CCol>

            {vehicleTypeId === 21 && (
              <CCol xs={12} md={4}>
                <CFormLabel>Driver Code</CFormLabel>
                <CFormInput
                  size="sm"
                  value={
                    tsInfo[0]?.nlmt_driver_info?.driver_code ||
                    tsInfo[0]?.driver_info?.driver_code ||
                    ''
                  }
                  readOnly
                />
              </CCol>
            )}

            {/* HIRE Vehicle → Show Vendor Code */}
            {vehicleTypeId === 22 && (
              <CCol xs={12} md={4}>
                <CFormLabel>Vendor Code</CFormLabel>
                <CFormInput size="sm" value={tsInfo[0]?.vendor_info?.vendor_code || ''} readOnly />
              </CCol>
            )}

            <CCol xs={12} md={4}>
              <CFormLabel htmlFor="dMob">Driver Mobile Number</CFormLabel>
              <CFormInput
                size="sm"
                id="dMob"
                readOnly
                value={
                  tsInfo[0]?.nlmt_driver_info?.driver_phone_1 ||
                  tsInfo[0]?.driver_info?.driver_phone_1 ||
                  tsInfo[0]?.driver_phone_1 ||
                  ''
                }
              />
            </CCol>
            {/* </CRow>
          <CRow className=""> */}
            <CCol xs={12} md={4}>
              <CFormLabel htmlFor="dMob">Last Delivery Route</CFormLabel>
              <CFormInput size="sm" id="dMob" value={last_delivery_route} readOnly />
            </CCol>
            <CCol xs={12} md={4}>
              <CFormLabel htmlFor="VNum">
                Shipment Route <REQ />
                {shipmentRouteError && (
                  <span className="small text-danger">{shipmentRouteError}</span>
                )}
              </CFormLabel>
              <NlmtSearchSelectComponent
                size="sm"
                className="mb-2"
                onChange={(e) => {
                  onChange(e)
                }}
                label="Select Shipment Route"
                noOptionsMessage="No Shipment Route found"
                search_type="shipment_routes"
                division_type={division}
              />
            </CCol>
            <CCol xs={12} md={4}>
              <CFormLabel htmlFor="remarks">Remarks</CFormLabel>
              <CFormInput
                name="remarks"
                id="remarks"
                value={message}
                onChange={handleChangeRemarks}
              />
            </CCol>
            {/* <CCol></CCol> */}
          </CRow>
          {/* </CCard> */}
        </CContainer>
      )}
    </>
  )
}

export default NlmtAssignTruckInfo

