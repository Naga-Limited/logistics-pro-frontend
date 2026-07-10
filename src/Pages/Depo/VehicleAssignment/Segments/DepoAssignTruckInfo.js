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
import DepoCustomerMasterService from 'src/Service/Depo/Master/DepoCustomerMasterService'
import DepoFreightMasterService from 'src/Service/Depo/Master/DepoFreightMasterService'
import DepoRouteMasterService from 'src/Service/Depo/Master/DepoRouteMasterService'
import DepoShipmentCreationService from 'src/Service/Depo/Shipment/DepoShipmentCreationService'
import VehicleMasterService from 'src/Service/Master/VehicleMasterService'

const DepoAssignTruckInfo = ({
  values,
  getvnum,
  getvroute,
  delivery_sequence,
  delivery_data,
  division,
  last_delivery_route,
  getCustomerAndFreightInvalidData,
}) => {
  /* values = Form Values , getvnum = Selected Vehicle Number for validation, getvroute = Selected Vehicle Route for validation,  delivery_sequence = Array with Selected Delivery Numbers, delivery_data = All Delivery info from SAP, division = 1 - nlfd / 2 - nlcd , getCustomerAndFreightInvalidData = Getting Customer And Freight Invalid Data */

  // console.log(delivery_sequence.delivery_sequence)
  // console.log(delivery_sequence.delivery_data)
  // console.log(values)
  console.log(division)

  /*================== User Location Fetch ======================*/
  const user_info_json = localStorage.getItem('user_info')
  const user_info = JSON.parse(user_info_json)
  const user_locations = []
  const [routeData, setRouteData] = useState([])
  const [depoCustomerData, setDepoCustomerData] = useState([])
  const [depoFreightData, setDepoFreightData] = useState([])
  const [contractorId, setContractorId] = useState('')
  const [contractorFreight, setContractorFreight] = useState('')
  const [deliveryFreightData, setDeliveryFreightData] = useState([])
  const [shipmentBudjetFreight, setShipmentBudjetFreight] = useState(0)
  const [shipmentActualFreight, setShipmentActualFreight] = useState(0)
  const [largestFreight, setLargestFreight] = useState(0)
  const [customerAndFreightInvalidData, setCustomerAndFreightInvalidData] = useState([])

  /* Get User Locations From Local Storage */
  user_info.location_info.map((data, index) => {
    user_locations.push(data.id)
  })

  console.log(user_locations)
  /*================== User Location Fetch ======================*/

  function getQty(data) {
    console.log(del_qty)
    let qty = ''
    del_qty.map((data1, index) => {
      if (data == data1.DeliveryOrderNumber) {
        // qty = data1.DeliveryQty
        qty = data1.DeliveryNetQty
      }
    })
    return qty
  }

  function getCustomerName(data) {
    console.log(del_qty)
    let name = ''
    del_qty.map((data1, index) => {
      if (data == data1.DeliveryOrderNumber) {
        name = data1.CustomerName
      }
    })
    return name
  }

  function getCustomerLocation(data) {
    console.log(del_qty)
    let location = ''
    del_qty.map((data1, index) => {
      if (data == data1.DeliveryOrderNumber) {
        location = data1.CustomerCity
      }
    })
    return location
  }

  const getDeliveryFreight = (data,type) => {
    let deliveryFreight = '0.00'

    let cust_code = ''
    console.log(del_qty,'del_qty-del_qty')
    del_qty.map((data1, index) => {
      if (data == data1.DeliveryOrderNumber) {

        cust_code = data1.CustomerCode
        depoCustomerData.map((data2, index1) => {
          if (cust_code == data2.customer_code) {
            depoFreightData.map((data3, index2) => {
              if (data2.location_id == data3.location_id && data2.route_id == data3.route_id && contractorId == data3.contractor_id) {

                if(type == 1) {
                  let data_object = {}
                  data_object.del_number = data1.DeliveryOrderNumber
                  // data_object.del_qty = data1.DeliveryQty
                  data_object.del_qty = data1.DeliveryNetQty
                  data_object.customer_code = cust_code
                  data_object.route_id = data2.route_id
                  data_object.location_id = data2.location_id
                  data_object.contractor_id = contractorId
                  // data_object.total_del_freight =  Number(parseFloat(data1.DeliveryQty * Number(data3.freight_rate)).toFixed(3))
                  data_object.total_del_freight =  Number(parseFloat(data1.DeliveryNetQty * Number(data3.freight_rate)).toFixed(3))
                  data_object.del_freight_per_ton = Number(data3.freight_rate)

                  console.log(deliveryFreightData,'1deliveryFreightData-deliveryFreightData')
                  //if(deliveryFreightData.length == 0) {
                   if(deliveryFreightData.length == 0 && data2.location_info.location_code == data1.DeliveryPlant && data3.location_info.location_code == data1.DeliveryPlant) {  
                    setDeliveryFreightData(deliveryFreightData => [...deliveryFreightData, data_object]);
                  }

                  deliveryFreight = data3.freight_rate
                } else if(type == 2) {
                  // deliveryFreight = Number(parseFloat(data1.DeliveryQty * Number(data3.freight_rate)).toFixed(3))
                  deliveryFreight = Number(parseFloat(data1.DeliveryNetQty * Number(data3.freight_rate)).toFixed(3))
                }

              }
            })
          }
        })
      }
    })

    return deliveryFreight
  }

  const getDeliveryFreight1 = (data,type) => {
    let deliveryFreight = '0.00'

    let cust_code = ''
    console.log(del_qty,'del_qty-del_qty')
    del_qty.map((data1, index) => {
      if (data == data1.DeliveryOrderNumber) {

        cust_code = data1.CustomerCode
        depoCustomerData.map((data2, index1) => {
          if (cust_code == data2.customer_code) {
            depoFreightData.map((data3, index2) => {
              if (data2.location_id == data3.location_id && data2.route_id == data3.route_id && contractorId == data3.contractor_id) {

                if(type == 1) {
                  let data_object = {}
                  data_object.del_number = data1.DeliveryOrderNumber
                  // data_object.del_qty = data1.DeliveryQty
                  data_object.del_qty = data1.DeliveryNetQty
                  data_object.customer_code = cust_code
                  data_object.route_id = data2.route_id
                  data_object.location_id = data2.location_id
                  data_object.contractor_id = contractorId
                  // data_object.total_del_freight =  Number(parseFloat(data1.DeliveryQty * Number(data3.freight_rate)).toFixed(3))
                  data_object.total_del_freight =  Number(parseFloat(data1.DeliveryNetQty * Number(data3.freight_rate)).toFixed(3))
                  data_object.del_freight_per_ton = Number(data3.freight_rate)

                  deliveryFreight = data3.freight_rate
                } else if(type == 2) {
                  // deliveryFreight = Number(parseFloat(data1.DeliveryQty * Number(data3.freight_rate)).toFixed(3))
                  deliveryFreight = Number(parseFloat(data1.DeliveryNetQty * Number(data3.freight_rate)).toFixed(3))
                }

              }
            })
          }
        })
      }
    })

    return deliveryFreight
  }

  var del_qty = []
  var total_del_qty = 0
  var total_del_qty_rounded_value = 0

  //Split Delivery Data for getting Selected Delivery Numbers's Quantity

  let filtered_del_order_qty = delivery_data.filter((c, index) => {

    var temp = 0
    if (delivery_sequence.response.includes(c.DeliveryOrderNumber)) {
      del_qty.push(c)
      // total_del_qty = total_del_qty + c.DeliveryQty
      total_del_qty = total_del_qty + c.DeliveryNetQty
      //return true
    }
    total_del_qty_rounded_value = parseFloat(total_del_qty).toFixed(3)
  })

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

  const [shipmentApproval, setShipmentApproval] = useState(true)

   const [message, setMessage] = useState('')
  const handleChangeRemarks = (event) => {
    const result = event.target.value.toUpperCase()
    values.remarks = result
    setMessage(result)
  }


  useEffect(() => {
    /* section for getting Truck Details For Shipment Creation from database */
    // VehicleAssignmentSapService.getTruckInfo().then((res) => {
    DepoShipmentCreationService.getTruckInfo().then((res) => {

      setFetch(true)

      let tableData = res.data.data
      console.log(tableData)
      let filterData = tableData.filter(
        (data) => user_locations.indexOf(data.vehicle_location_id) != -1
      )
      console.log(filterData,'getTruckInfo')
      // console.log(filterData.contractor_info.freight_type,'freight_type')
      setTSVehicle(filterData)
      // setFetch(true)
    })

     //section to fetch Routes by Depo Location Id
     DepoRouteMasterService.getDepoRoutesByDepoLocationId(user_locations[0]).then((res) => {
      console.log(res.data.data,'getDepoRoutesByDepoLocationId')
      setRouteData(res.data.data)
    })

    //section to fetch Active Depo Customers
    DepoCustomerMasterService.getActiveDepoCustomers().then((res) => {
      console.log(res.data.data,'getActiveDepoCustomers')
      setDepoCustomerData(res.data.data)
    })

    //section to fetch Depo Freights
    DepoFreightMasterService.getActiveDepoFreights().then((res) => {
      console.log(res.data.data,'getActiveDepoFreights')
      setDepoFreightData(res.data.data)
    })

    /* section for getting Shipment Routes For Shipment Creation from database */
    DefinitionsListApi.visibleDefinitionsListByDefinition(1).then((response) => {
      console.log(response.data.data)
      setSRVehicle(response.data.data)
    })
  }, [])

  const getCustomerRoute = (data) => {

    let customerRoute = 'Customer Not Found in LP'
    let cust_code = ''
    let del_plant = ''
    if(depoCustomerData.length > 0) {
      del_qty.map((data1, index) => {
        if (data == data1.DeliveryOrderNumber) {

          console.log(data1,'data1-filterData')
          cust_code = data1.CustomerCode
          del_plant = data1.DeliveryPlant
          /* Customer plant && Delivery Plant Filter*/
          let filterData = depoCustomerData.filter(
            (data) => data.customer_code == cust_code && data.location_info.location_code == del_plant
          )
          console.log(filterData,'filterData')
          if(filterData.length > 0) {
            customerRoute = filterData[0].location_info.location+' : '+filterData[0].route_info.route_name
          }

        }
      })
    }
    return customerRoute
  }

  useEffect (()=>{

    let invalid_data = {}

    invalid_data.ActualFreightCondition = shipmentActualFreight
    invalid_data.BudjetFreightCondition = shipmentBudjetFreight
    invalid_data.DeliveryFreightValue = deliveryFreightData

    if(del_qty.length != deliveryFreightData.length){
      invalid_data.CustomerMasterCondition = false
    } else {
      invalid_data.CustomerMasterCondition = true
    }

    invalid_data.FinalFreightCondition = contractorFreight == '2' ? Number(parseFloat(total_del_qty_rounded_value*largestFreight).toFixed(2)) : shipmentBudjetFreight
    invalid_data.FreightType = contractorFreight

    console.log(invalid_data,'invalid_data')
    console.log(shipmentBudjetFreight,'shipmentBudjetFreight')
    console.log(shipmentActualFreight,'shipmentActualFreight')

    getCustomerAndFreightInvalidData(invalid_data)

    setCustomerAndFreightInvalidData(invalid_data)

  },[contractorId,shipmentBudjetFreight,shipmentActualFreight])

  useEffect (()=>{
    if(deliveryFreightData.length > 0 && contractorId) {
      let budfreight = 0
      let needed_total_del_qty = 0

      var delivery_freight_array = [];
      deliveryFreightData.map((data2, index1) => {

        budfreight += data2.total_del_freight
        delivery_freight_array.push(data2.del_freight_per_ton)
      })
      setShipmentBudjetFreight(Number(parseFloat(budfreight).toFixed(2)))

      /* Get Total Delivery Quantity */
      del_qty.map((data1, index) => {
        // needed_total_del_qty += data1.DeliveryQty
        needed_total_del_qty += data1.DeliveryNetQty
      })

      /* Get Highest Delivery Freight From deliveryFreightData*/
      // delivery_freight_array
      var largest= 0;

      for (let i=0; i<delivery_freight_array.length; i++){
          if (delivery_freight_array[i]>largest) {
              largest=delivery_freight_array[i];
          }
      }

      setLargestFreight(Number(parseFloat(largest).toFixed(2)))

      let actfreight = contractorFreight == '2' ? Number(parseFloat(largest*needed_total_del_qty).toFixed(2)) : Number(parseFloat(budfreight).toFixed(2))
      // let actfreight = largest*needed_total_del_qty
      setShipmentActualFreight(actfreight)

    } else {
      setShipmentActualFreight(0)
      setShipmentBudjetFreight(0)
      setLargestFreight(0)
    }
  },[deliveryFreightData, contractorId])

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
    console.log(tripsheet_no,'tripsheet_no')
    console.log(tsVehicle)
    if (tripsheet_no) {
      const filterData = tsVehicle.filter((data) =>
        data.vehicle_current_position == '16' &&
        data.parking_status == '1' &&
        data.vehicle_tripsheet_info.depo_tripsheet_no == tripsheet_no
      )
      console.log(filterData,'tsVehicle.filter')
      setTSInfo(filterData)
      setCurrent_vehicle_number(filterData[0].vehicle_tripsheet_info.depo_tripsheet_no)
      setVehicleCapacity(filterData[0].vehicle_info.vehicle_capacity_info.capacity)
      setContractorId(filterData[0].contractor_id)
      setContractorFreight(filterData[0].contractor_info.freight_type)
      values.parking_id = filterData[0].depo_parking_yard_gate_id
      values.vehicle_id = filterData[0].vehicle_info.id
      values.driver_id = filterData[0].driver_info.id
      values.tripsheet_id = filterData[0].tripsheet_sheet_id
      values.vehicle_number = filterData[0].vehicle_info.vehicle_number
      values.shipment_freight = filterData[0].contractor_info.freight_type
      values.tripsheet_no = filterData[0].vehicle_tripsheet_info.depo_tripsheet_no
      values.driver_name = filterData[0].driver_info.driver_name
      values.driver_number = filterData[0].driver_info.driver_number
      values.vehicle_location_id = filterData[0].vehicle_location_id

      VehicleMasterService.getVehiclesById(filterData[0].vehicle_id).then((res) => {
        console.log(res.data.data)
        // setVehicleCapacity(res.data.data.vehicle_capacity_info.capacity)
        values.vehicle_capacity_id = res.data.data.vehicle_capacity_info.id
      })

      setVehicleNumberError('')
    } else {
      setTSInfo([])
      setContractorId('')
      setContractorFreight('')
      setVehicleCapacity('')
      setCurrent_vehicle_number('')
      setVehicleNumberError(' Required')
      setFetch(true)
      values.parking_id = ''
      values.tripsheet_id = ''
      values.vehicle_number = ''
      values.tripsheet_no = ''
      values.driver_name = ''
      values.driver_number = ''
      values.vehicle_location_id = ''
    }
  }



  useEffect(()=>{

    if((customerAndFreightInvalidData.ActualFreightCondition != customerAndFreightInvalidData.BudjetFreightCondition) && customerAndFreightInvalidData.FreightType == 2){
      setShipmentApproval(true)
    } else {
      setShipmentApproval(false)
    }

    console.log(customerAndFreightInvalidData,'customerAndFreightInvalidData')
    console.log(shipmentApproval,'shipmentApproval')

  },[customerAndFreightInvalidData])

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
              <CTable
                style={{ height: 'auto' }}
                // className="overflow-scroll"
              >
                <CTableHead style={{ backgroundColor: '#4d3227', color: 'white' }}>
                  <CTableRow>
                    <CTableHeaderCell
                      scope="col"
                      style={{ color: 'white', width: '5%' }}
                      data-coreui-toggle="tooltip"
                      data-coreui-placement="top"
                      title="Sequence"
                    >
                      Seq.
                    </CTableHeaderCell>
                    <CTableHeaderCell scope="col" style={{ color: 'white', width: '8%' }}>
                      Number
                    </CTableHeaderCell>

                    <CTableHeaderCell scope="col" style={{ color: 'white', width: '21%' }}>
                      Customer Name
                    </CTableHeaderCell>
                    {/* <CTableHeaderCell scope="col" style={{ color: 'white', width: '15%' }}>
                      Customer City
                    </CTableHeaderCell> */}
                    <CTableHeaderCell scope="col" style={{ color: 'white', width: '20%' }}>
                      Depo - Route
                    </CTableHeaderCell>
                    <CTableHeaderCell
                      scope="col"
                      style={{ color: 'white', width: '8%' }}
                      data-coreui-toggle="tooltip"
                      data-coreui-placement="top"
                      title="Quantity in MTS"
                    >
                      Qty / MTS
                    </CTableHeaderCell>
                    <CTableHeaderCell scope="col" style={{ color: 'white', width: '13%' }}>
                      Budget Freight / MTS
                    </CTableHeaderCell>
                    <CTableHeaderCell scope="col" style={{ color: 'white', width: '13%' }}>
                      Actual Freight / MTS
                    </CTableHeaderCell>
                    <CTableHeaderCell scope="col" style={{ color: 'white', width: '13%' }}>
                      Budget Freight Value
                    </CTableHeaderCell>
                    <CTableHeaderCell scope="col" style={{ color: 'white', width: '13%' }}>
                      Actual Freight Value
                    </CTableHeaderCell>

                  </CTableRow>
                </CTableHead>
                <CTableBody>

                  {delivery_sequence.response.map((data, index) => {

                    return (
                      <>
                        <CTableRow style={{ background: '#ebc999' }}>
                          <CTableDataCell style={{ width: '5%' }}>{index + 1}</CTableDataCell>
                          <CTableDataCell style={{ width: '8%' }}>{data}</CTableDataCell>
                          <CTableDataCell style={{ width: '21%' }}>
                            {getCustomerName(data)}
                          </CTableDataCell>
                          {/* <CTableDataCell style={{ width: '15%' }}>
                            {getCustomerLocation(data)}
                          </CTableDataCell> */}
                          <CTableDataCell style={{ width: '20%' }}>
                            {getCustomerRoute(data)}
                          </CTableDataCell>
                          <CTableDataCell style={{ width: '8%' }}>{getQty(data)}</CTableDataCell>
                          <CTableDataCell style={{ width: '13%' }}>
                            {getDeliveryFreight(data,'1')}
                          </CTableDataCell>
                          <CTableDataCell style={{ width: '13%' }}>
                          {contractorFreight == '2' ? largestFreight : getDeliveryFreight1(data,'1')}
                          </CTableDataCell>
                          <CTableDataCell style={{ width: '13%' }}>
                            {getDeliveryFreight(data,'2')}
                          </CTableDataCell>
                          <CTableDataCell style={{ width: '13%' }}>
                          {contractorFreight == '2' ? Number(parseFloat(getQty(data)*largestFreight).toFixed(2)) : getDeliveryFreight(data,'2') }
                          </CTableDataCell>

                        </CTableRow>
                      </>
                    )
                  })}
                  {/*{(vehicleCapacity - total_del_qty_rounded_value) > 0 */
                    // (<CTableRow style={{ background: '#ebc999' }}>
                    //   <CTableDataCell style={{ width: '5%' }}> </CTableDataCell>
                    //   <CTableDataCell style={{ width: '8%' }}> </CTableDataCell>
                    //   <CTableDataCell style={{ width: '21%' }}>
                    //   </CTableDataCell>
                    //   {/* <CTableDataCell style={{ width: '15%' }}>
                    //   </CTableDataCell> */}
                    //   <CTableDataCell style={{ width: '20%', color: 'indigo'  }}>
                    //     <b>Low Tonnage</b>
                    //   </CTableDataCell>
                    //   <CTableDataCell style={{ width: '8%', color: 'indigo'  }}><b>{Number(parseFloat(vehicleCapacity - total_del_qty_rounded_value).toFixed(2))}</b></CTableDataCell>
                    //   <CTableDataCell style={{ width: '13%', color: 'indigo'  }}>
                    //   <b>-</b>
                    //   </CTableDataCell>
                    //   <CTableDataCell style={{ width: '13%', color: 'indigo'  }}>
                    //     <b>{largestFreight}</b>
                    //   </CTableDataCell>
                    //   {/* <CTableDataCell style={{ width: '13%', color: 'indigo'  }}>
                    //     <b>{Number(parseFloat(vehicleCapacity - total_del_qty_rounded_value)*largestFreight).toFixed(2)}</b>
                    //   </CTableDataCell> */}
                    //   <CTableDataCell style={{ width: '13%', color: 'indigo'  }}>
                    //   <b>-</b>
                    //   </CTableDataCell>
                    //   <CTableDataCell style={{ width: '13%', color: 'indigo'  }}>
                    //     <b>{Number(parseFloat(vehicleCapacity - total_del_qty_rounded_value)*largestFreight).toFixed(2)}</b>
                    //   </CTableDataCell>

                    // </CTableRow>)
                  }
                  <CTableRow style={{ background: '#ebc999'}}>
                    <CTableDataCell style={{ width: '5%' }}> </CTableDataCell>
                    <CTableDataCell style={{ width: '8%' }}> </CTableDataCell>
                    <CTableDataCell style={{ width: '21%' }}>

                    </CTableDataCell>
                    {/* <CTableDataCell style={{ width: '15%' }}>

                    </CTableDataCell> */}
                    <CTableDataCell style={{ width: '20%' }}>
                      <b>Total</b>
                    </CTableDataCell>
                    {/* {total_del_qty_rounded_value > vehicleCapacity ?
                      (<CTableDataCell style={{ width: '8%' }}><b>{total_del_qty_rounded_value}</b></CTableDataCell>) : (<CTableDataCell style={{ width: '8%' }}><b>{vehicleCapacity}</b></CTableDataCell>)
                    } */}
                    <CTableDataCell style={{ width: '8%' }}><b>{total_del_qty_rounded_value}</b></CTableDataCell>
                    <CTableDataCell style={{ width: '13%' }}>
                      <b>-</b>
                    </CTableDataCell>
                    <CTableDataCell style={{ width: '13%' }}>
                      <b>-</b>
                    </CTableDataCell>
                    <CTableDataCell style={{ width: '13%' }}>
                      <b>{shipmentBudjetFreight}</b>
                    </CTableDataCell>
                    {/* {total_del_qty_rounded_value > vehicleCapacity ?
                      (<CTableDataCell style={{ width: '13%' }}>
                          <b>{Number(parseFloat(total_del_qty_rounded_value*largestFreight).toFixed(2))}</b>
                      </CTableDataCell>) : (<CTableDataCell style={{ width: '13%' }}>
                        <b>{Number(parseFloat(vehicleCapacity*largestFreight).toFixed(2))}</b>
                      </CTableDataCell>)
                    } */}
                    {/* {total_del_qty_rounded_value > vehicleCapacity ?
                      (<CTableDataCell style={{ width: '13%' }}>
                          <b>{Number(parseFloat(total_del_qty_rounded_value*largestFreight).toFixed(2))}</b>
                      </CTableDataCell>) : (<CTableDataCell style={{ width: '13%' }}>
                        <b>{Number(parseFloat(vehicleCapacity*largestFreight).toFixed(2))}</b>
                      </CTableDataCell>)
                    } */}
                    <CTableDataCell
                      style={contractorFreight == '2' && shipmentApproval ? { width: '13%', color:'red', fontWeight:'bolder' } : { width: '13%' }}
                    >
                      <b>{contractorFreight == '2' ? Number(parseFloat(total_del_qty_rounded_value*largestFreight).toFixed(2)) : shipmentBudjetFreight} </b>
                    </CTableDataCell>

                  </CTableRow>

                </CTableBody>
              </CTable>
            </CCol>
          </CRow>
          <CRow className="mb-3">
            {/* <CCol xs={12} md={4}>
              <CInputGroup>
                <CInputGroupText
                  style={{
                    backgroundColor: '#4d3227',
                    color: 'white',
                  }}
                >
                  Total Quantity in MTS
                </CInputGroupText>
                <CFormInput readOnly value={total_del_qty_rounded_value} />
              </CInputGroup>
            </CCol>
            <CCol xs={12} md={4}>
              <CInputGroup>
                <CInputGroupText
                  style={{
                    backgroundColor: '#4d3227',
                    color: 'white',
                  }}
                >
                  Budget Freight Rate
                </CInputGroupText>
                <CFormInput readOnly value={shipmentBudjetFreight} />
              </CInputGroup>
            </CCol>
            <CCol xs={12} md={4}>
              <CInputGroup>
                <CInputGroupText
                  style={{
                    backgroundColor: '#4d3227',
                    color: 'white',
                  }}
                >
                  Actual Freight Rate
                </CInputGroupText>
                <CFormInput readOnly value={shipmentActualFreight} />
              </CInputGroup>
            </CCol> */}
          </CRow>
          <u>
            {' '}
            <CHeaderBrand style={{ color: '#4d3227', fontWeight: '600' }}>
              Truck Details
            </CHeaderBrand>
          </u>
          {/* <CCard> */}
          <CRow className="mt-3">
            <CCol xs={12} md={3}>
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
                search_type="depo_va_vehicle_number"
                search_data={tsVehicle}
                division_type={division}
              />

            </CCol>
            <CCol xs={12} md={3}>
              <CFormLabel htmlFor="vCap">Tripsheet Number</CFormLabel>
              <CFormInput
                size="sm"
                className="mb-2"
                id="vCap"
                value={tsInfo[0] ? (tsInfo[0].vehicle_tripsheet_info ? tsInfo[0].vehicle_tripsheet_info.depo_tripsheet_no : '123456') :''}
                readOnly
              />
            </CCol>

            <CCol xs={12} md={3}>
              <CFormLabel htmlFor="vCap">Vehicle Capacity in MTS</CFormLabel>
              <CFormInput
                size="sm"
                id="vCap"
                value={vehicleCapacity ? vehicleCapacity : ''}
                readOnly
              />
            </CCol>

            <CCol xs={12} md={3}>
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

            <CCol xs={12} md={3}>
              <CFormLabel htmlFor="vCap">Contractor Name</CFormLabel>
              <CFormInput
                size="sm"
                className="mb-2"
                id="vCap"
                value={tsInfo[0] ? tsInfo[0].contractor_info.contractor_name : ''}
                readOnly
              />
            </CCol>

            <CCol xs={12} md={3}>
              <CFormLabel htmlFor="vCap">Freight Type</CFormLabel>
              <CFormInput
                size="sm"
                className="mb-2"
                id="vCap"
                value={tsInfo[0] ? (tsInfo[0].contractor_info.freight_type == '1' ? 'Budget' : 'Actual') : ''}
                readOnly
              />
            </CCol>

            <CCol xs={12} md={3}>
              <CFormLabel htmlFor="dName">Driver Name</CFormLabel>
              <CFormInput
                size="sm"
                id="dName"
                value={tsInfo[0] ? tsInfo[0].driver_info.driver_name : ''}
                readOnly
              />
            </CCol>

            <CCol xs={12} md={3}>
              <CFormLabel htmlFor="dMob">Driver Mobile Number</CFormLabel>
              <CFormInput
                size="sm"
                id="dMob"
                value={tsInfo[0] ? tsInfo[0].driver_info.driver_number : ''}
                readOnly
              />
            </CCol>

            <CCol xs={12} md={3}>
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

export default DepoAssignTruckInfo
