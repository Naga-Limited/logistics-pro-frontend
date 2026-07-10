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
import SearchSelectComponent from 'src/components/commoncomponent/searchSelectComponent'
import Loader from 'src/components/Loader'
import SmallLoader from 'src/components/SmallLoader'
import DefinitionsListApi from 'src/Service/Definitions/DefinitionsListApi'
import VehicleMasterService from 'src/Service/Master/VehicleMasterService'
import VehicleAssignmentSapService from 'src/Service/SAP/VehicleAssignmentSapService'

const AssignTruckInfo = ({
  values,
  getvnum,
  getvroute,
  delivery_sequence,
  delivery_data,
  division,
  last_delivery_route,
}) => {
  /* values = Form Values , getvnum = Selected Vehicle Number for validation, getvroute = Selected Vehicle Route for validation,  delivery_sequence = Array with Selected Delivery Numbers, delivery_data = All Delivery info from SAP, division = 1 - nlfd / 2 - nlcd  */

  // console.log(delivery_sequence.delivery_sequence)
  // console.log(delivery_sequence.delivery_data)
  // console.log(values)
  console.log(division)

  /*================== User Location Fetch ======================*/
  const user_info_json = localStorage.getItem('user_info')
  const user_info = JSON.parse(user_info_json)
  const user_locations = []

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
        // return 'yes'
      }
    })
    return qty
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
      return true
    }
    // console.log(del_qty)
    // console.log(total_del_qty)
    total_del_qty_rounded_value = parseFloat(total_del_qty).toFixed(2)
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
    VehicleAssignmentSapService.getTruckInfo().then((res) => {
      setFetch(true)

      let tableData = res.data.data
      console.log(tableData)
      let filterData = tableData.filter(
        (data) => user_locations.indexOf(data.vehicle_location_id) != -1
      )
      console.log(filterData)
      setTSVehicle(filterData)
      // setFetch(true)
    })

    /* section for getting Shipment Routes For Shipment Creation from database */
    DefinitionsListApi.visibleDefinitionsListByDefinition(1).then((response) => {
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

  /* Assign the Tripsheet Number for Shipment Creation */
  const assignValues = (e) => {

    let tripsheet_no = e.value

    getvnum(tripsheet_no)
    console.log(division)
    console.log(tsVehicle)
    if (tripsheet_no) {
      const filterData = tsVehicle.filter((data) =>
        data.vehicle_current_position == '22' ||
        data.vehicle_current_position == '25' ||
        data.vehicle_current_position == '35' ||
        (data.vehicle_current_position == '50' && data.parking_status == '18' && data.vehicle_type_id.id == 4) ||
        (data.vehicle_current_position == '18' &&
          (data.parking_status == '16' || data.parking_status == '12')) ||
        (data.vehicle_current_position == '16' && data.parking_status == '8'|| data.parking_status == '12' || data.parking_status == '16')
          ? data.trip_sheet_info.trip_sheet_no == tripsheet_no
          : data.trip_sheet_info.trip_sheet_no == tripsheet_no &&
            data.trip_sheet_info.to_divison == division
      )

      setTSInfo(filterData)
      setCurrent_vehicle_number(filterData[0].trip_sheet_info.trip_sheet_no)
      console.log(filterData)

      VehicleMasterService.getVehiclesById(filterData[0].vehicle_id).then((res) => {
        console.log(res.data.data)
        setVehicleCapacity(res.data.data.vehicle_capacity_info.capacity)
        values.vehicle_capacity_id = res.data.data.vehicle_capacity_info.id
      })

      setVehicleNumberError('')
      // shipmentSave = false

      values.vehicle_id = filterData[0].vehicle_id
      values.parking_id = filterData[0].parking_yard_gate_id
      values.driver_id = filterData[0].driver_id
      values.tripsheet_id = filterData[0].tripsheet_sheet_id
      values.tripsheet_no = filterData[0].trip_sheet_info.trip_sheet_no
      values.assigned_by = filterData[0].trip_sheet_info.to_divison
      values.vehicle_number = filterData[0].vehicle_number
      values.vehicle_type_id = filterData[0].vehicle_type_id.id
      values.vehicle_location_id = filterData[0].vehicle_location_id
      values.driver_name = filterData[0].driver_name
      values.driver_number = filterData[0].driver_contact_number
    } else {
      setTSInfo([])
      setVehicleCapacity('')
      setCurrent_vehicle_number('')
      setVehicleNumberError(' Required')

      setFetch(true)
      values.vehicle_id = ''
      values.driver_id = ''
      values.tripsheet_id = ''
      values.vehicle_location_id = ''
      values.assigned_by = ''
      values.vehicle_number = ''
      values.vehicle_type_id = ''
      values.vehicle_capacity_id = ''
      values.driver_name = ''
      values.driver_number = ''
      values.tripsheet_no = ''
    }
  }

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
              <SearchSelectComponent
                size="sm"
                className="mb-2"
                onChange={(e) => {
                  assignValues(e)
                }}
                label="Select Vehicle Number"
                noOptionsMessage="Vehicle Not found"
                search_type="nlfd_va_vehicle_number"
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
                value={tsInfo[0] ? (tsInfo[0].trip_sheet_info ? tsInfo[0].trip_sheet_info.trip_sheet_no : '123456') :''}
                readOnly
              />
            </CCol>

            <CCol xs={12} md={4}>
              <CFormLabel htmlFor="vCap">Vehicle Capacity in MTS</CFormLabel>
              <CFormInput
                size="sm"
                id="vCap"
                value={vehicleCapacity ? vehicleCapacity : ''}
                readOnly
              />
            </CCol>
          {/* </CRow>

          <CRow className=""> */}
            <CCol xs={12} md={4}>
              <CFormLabel htmlFor="vCap">Vehicle Type</CFormLabel>
              <CFormInput
                size="sm"
                className="mb-2"
                id="vCap"
                value={tsInfo[0] ? tsInfo[0].vehicle_type_id.type : ''}
                readOnly
              />
            </CCol>

            <CCol xs={12} md={4}>
              <CFormLabel htmlFor="dName">Driver Name</CFormLabel>
              <CFormInput
                size="sm"
                id="dName"
                value={tsInfo[0] ? tsInfo[0].driver_name : ''}
                readOnly
              />
            </CCol>

            {tsInfo[0] && tsInfo[0].vehicle_type_id.id != '4' && (<CCol xs={12} md={4}>
              {tsInfo[0] && tsInfo[0].vehicle_type_id.id == '3' && (<CFormLabel htmlFor="dName">Vendor Code</CFormLabel>)}
              {tsInfo[0] && tsInfo[0].vehicle_type_id.id != '3' && (<CFormLabel htmlFor="dName">Driver Code</CFormLabel>)}
              {/* {!tsInfo[0] && (<CFormLabel htmlFor="dName">Driver Name</CFormLabel>)} */}
              <CFormInput
                size="sm"
                id="dName"
                value={tsInfo[0].vehicle_type_id.id == '3' ? tsInfo[0].vendor_info.vendor_code : tsInfo[0].driver_info.driver_code}
                readOnly
              />
            </CCol>)}

            <CCol xs={12} md={4}>
              <CFormLabel htmlFor="dMob">Driver Mobile Number</CFormLabel>
              <CFormInput
                size="sm"
                id="dMob"
                value={tsInfo[0] ? tsInfo[0].driver_contact_number : ''}
                readOnly
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
              <SearchSelectComponent
                size="sm"
                className="mb-2"
                onChange={(e) => {
                  onChange(e)
                }}
                label="Select Shipment Route"
                noOptionsMessage="No Shipment Route found"
                search_type="shipment_routes"
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

export default AssignTruckInfo
