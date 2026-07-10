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
import { useNavigate } from 'react-router-dom'
import Loader from 'src/components/Loader'
import SmallLoader from 'src/components/SmallLoader'
import LocationApi from 'src/Service/SubMaster/LocationApi'
import DefinitionsListApi from 'src/Service/Definitions/DefinitionsListApi'
import NlmtVehicleAssignmentSapService from 'src/Service/Nlmt/SAP/NlmtVehicleAssignmentSapService'


const NlmtOpenDeliveryInfo = ({ getDeliveries, fetchAllData, division }) => {
  const [rowData, setRowData] = useState([])
  const [saleOrders, setSaleOrders] = useState([])
  const [fetch, setFetch] = useState(false)
  const [locationData, setLocationData] = useState([])

  /*================== User Location Fetch ======================*/
  const user_info_json = localStorage.getItem('user_info')
  const user_info = JSON.parse(user_info_json)
  const user_locations = []
  const user_access_locations = []

  console.log(user_info)
  const navigation = useNavigate()

  /* Get User Locations From Local Storage */
  user_info.location_info.map((data, index) => {
    user_locations.push(data.id)
  })


  /* ===== User Inco Terms Declaration Start ===== */

  const user_inco_terms = []
  /* Get User Inco Terms From Local Storage */
  user_info.inco_term_info.map((data, index) => {
    user_inco_terms.push(data.def_list_code)
  })
  const [incoTermData, setIncoTermData] = useState([])
  const[nlcdPlantsData, setNlcdPlantsData] = useState([])
  const[nlcdPlantsArrayData, setNlcdPlantsArrayData] = useState([])

  useEffect(() => {

     /* section for getting Inco Term Lists from database */
     DefinitionsListApi.visibleDefinitionsListByDefinition(16).then((response) => {

      let viewData = response.data.data

      let rowDataList_location = []
      viewData.map((data, index) => {
        rowDataList_location.push({
          sno: index + 1,
          incoterm_name: data.definition_list_name,
          incoterm_code: data.definition_list_code,
        })
      })

      setIncoTermData(rowDataList_location)
    })

    /* section for getting NLCD Plants List Display from database */
    DefinitionsListApi.visibleDefinitionsListByDefinition(35).then((response) => {

      let nlcd_plants_data = response.data.data
      console.log(nlcd_plants_data,'nlcd_all_plants_data')
      let active_plant_array = []
      let filter_Data = nlcd_plants_data.filter((c, index) => {

        if (c.definition_list_status == 1) {
          active_plant_array.push(c.definition_list_code)
          return true
        }
      })
      console.log(filter_Data,'nlcd_active_plants_data')
      console.log(active_plant_array,'active_plant_array')
      setNlcdPlantsArrayData(active_plant_array)
      setNlcdPlantsData(filter_Data)
    })

  }, [])

  /* Display The Inco Term Name via Given Inco Term Code */
  const getIncoTermNameByCode = (code) => {

    let filtered_incoterm_data = incoTermData.filter((c, index) => {

      if (c.incoterm_code == code) {
        return true
      }
    })

    let incoTermName = filtered_incoterm_data[0] ? filtered_incoterm_data[0].incoterm_name : 'Loading..'

    return incoTermName
  }

  /* ===== User Inco Terms Declaration End ===== */


  /* Get User Plant Access From Local Storage */
  user_info.location_info.map((data1, index1) => {
    user_access_locations.push(data1.location_code)
  })

  /* Get User Id From Local Storage */
  const user_id = user_info.user_id

  console.log(user_locations, 'user_locations')
  console.log(user_access_locations, 'user_access_locations')

  const inArray = (plant, plants) => {
    var length = plants.length
    for (var i = 0; i < length; i++) {
      if (plants[i] == plant) return true
    }
    return false
  }

  /*================== User Location Fetch ======================*/

  const [deliveryinfo, setDeliveryInfo] = useState({
    delivery_orders: [],
    response: [],
  })

  const assign_delivery = (e) => {
    // Destructuring
    const { value, checked } = e.target
    const { delivery_orders } = deliveryinfo

    // Case 1 : The user checks the box
    if (checked) {
      setDeliveryInfo({
        delivery_orders: [...delivery_orders, value],
        response: [...delivery_orders, value],
      })
      getDeliveries({
        delivery_orders: [...delivery_orders, value],
        response: [...delivery_orders, value],
      })
    }

    // Case 2 : The user unchecks the box
    else {
      setDeliveryInfo({
        delivery_orders: delivery_orders.filter((e) => e !== value),
        response: delivery_orders.filter((e) => e !== value),
      })
      getDeliveries({
        delivery_orders: delivery_orders.filter((e) => e !== value),
        response: delivery_orders.filter((e) => e !== value),
      })
    }

    console.log(deliveryinfo.response)
  }

  /* Date Format Change : yyyy-mm-dd to dd-mm-yy */
  const formatDate = (input) => {
    var datePart = input.match(/\d+/g),
      year = datePart[0].substring(2), // get only two digits
      month = datePart[1],
      day = datePart[2]

    return day + '-' + month + '-' + year
  }

  const loadSaleOrderInfoTable = () => {
    var del_order = []

    var delivery_orders_array = {}

    console.log(saleOrders)

    // Converting the Delivery Details into Delivery Orders
    // =================================================================================================

    const obj = Object.entries(saleOrders)

    obj.forEach(([key_st, value]) => {
      let lineItem = value.LINE_ITEM
      // console.log(key_st)
      // console.log(value)

      if (division == 'nlfd' && inArray(value.WERKS, user_access_locations)) {
        del_order.push({
          sno: (key_st % 10) + 1,
          SaleOrderNumber: value.VBELN,
          SaleOrderDate: value.ERDAT,
          SaleOrderQty: value.SO_QTY,
          DeliveryOrderNumber: value.VBELN2,
          TL_NAME: value.TL_NAME,
          // DeliveryOrderDate: value.WADAT_IST,
          DeliveryOrderDate: value.BLDAT,
          CustomerName: value.NAME1,
          CustomerType: value.TXT30,
          CustomerCode: value.KUNNR,
          CustomerCity: value.ORT01,
          CustomerRoute: value.ROUTE,
          DeliveryQty: value.TOT_DEL_MTS,
          DeliveryNetQty: value.TOT_NET_MTS,
          DeliveryItems: value.LINE_ITEM,
          DeliveryPlant: value.WERKS,
          IncoTerm: value.INCO1,
        })
      // } else if (division == 'nlcd' && value.WERKS == '9290') {
      } else if (division == 'nlcd' && inArray(value.WERKS, nlcdPlantsArrayData)) {
        del_order.push({
          sno: (key_st % 10) + 1,
          SaleOrderNumber: value.VBELN,
          SaleOrderDate: value.ERDAT,
          SaleOrderQty: value.SO_QTY,
          DeliveryOrderNumber: value.VBELN2,
          TL_NAME: value.TL_NAME,
          // DeliveryOrderDate: value.WADAT_IST,
          DeliveryOrderDate: value.BLDAT,
          CustomerName: value.NAME1,
          CustomerType: value.TXT30,
          CustomerCode: value.KUNNR,
          CustomerCity: value.ORT01,
          CustomerRoute: value.ROUTE,
          DeliveryQty: value.TOT_DEL_MTS,
          DeliveryNetQty: value.TOT_NET_MTS,
          DeliveryItems: value.LINE_ITEM,
          DeliveryPlant: value.WERKS,
          IncoTerm: value.INCO1,
        })
      }
    })

    // Conversion completed
    // =================================================================================================

    var all_del_no = []
    var glo = 0
    console.log(del_order)
    let filtered_del_order = del_order.filter((c, index) => {
      if (!all_del_no.includes(c.DeliveryOrderNumber)) {
        c.sno = glo + 1
        all_del_no.push(c.DeliveryOrderNumber)
        glo++
        return true
      }
    })

    fetchAllData(del_order)
    setRowData(del_order)
  }

  useEffect(() => {
    // section for getting Shed Details from database
    NlmtVehicleAssignmentSapService.getSaleOrders().then((res) => {
      // console.log(res.data)

      setSaleOrders(res.data)
      setFetch(true)
      // loadSaleOrderInfoTable()
    })
  }, [])

  useEffect(() => {
    LocationApi.getLocation().then((response) => {
      let viewData = response.data.data
      // let rowDataList = []
      let rowDataList_location = []
      viewData.map((data, index) => {
        rowDataList_location.push({
          sno: index + 1,
          Location: data.location,
          location_code: data.location_code,
        })
      })
      setLocationData(rowDataList_location)
    })
  }, [])

  /* Display The Delivery Plant Name via Given Delivery Plant Code */
  const getLocationNameByCode = (code) => {
    let filtered_location_data = locationData.filter((c, index) => {
      if (c.location_code == code) {
        return true
      }
    })
    // console.log(filtered_location_data)
    let locationName = filtered_location_data[0] ? filtered_location_data[0].Location : 'Loading..'
    return locationName
  }

  useEffect(() => {
    loadSaleOrderInfoTable()
  }, [fetch])

  return (
    <>
      {!fetch && <SmallLoader />}
      {fetch && (
        <CContainer>
          <CRow>
            {/* <CTable> */}
            <CTable style={{ height: 'auto' }}>
              <CTableHead style={{ backgroundColor: '#4d3227', color: 'white' }}>
                <CTableRow style={{ width: '100%' }}>
                  <CTableHeaderCell
                    scope="col"
                    style={{ color: 'white', width: '5%', textAlign: 'center' }}
                  >
                    #
                  </CTableHeaderCell>
                  <CTableHeaderCell
                    scope="col"
                    style={{ color: 'white', width: '5%', textAlign: 'center' }}
                  >
                    S.No
                  </CTableHeaderCell>
                  <CTableHeaderCell
                            scope="col"
                            style={{ color: 'white', width: '9%', textAlign: 'center' }}
                  >
                    Inco Term
                  </CTableHeaderCell>
                  <CTableHeaderCell
                    scope="col"
                    style={{ color: 'white', width: '9%', textAlign: 'center' }}
                  >
                    Delivery Plant
                  </CTableHeaderCell>
                  <CTableHeaderCell
                    scope="col"
                    style={{ color: 'white', width: '9%', textAlign: 'center' }}
                  >
                    Delivery No
                  </CTableHeaderCell>
                  <CTableHeaderCell
                    scope="col"
                    style={{ color: 'white', width: '9%', textAlign: 'center' }}
                  >
                    Delivery Date
                  </CTableHeaderCell>
                  <CTableHeaderCell
                    scope="col"
                    style={{ color: 'white', width: '9%', textAlign: 'center' }}
                  >
                    SO No
                  </CTableHeaderCell>
                  <CTableHeaderCell
                    scope="col"
                    style={{ color: 'white', width: '9%', textAlign: 'center' }}
                  >
                    SO Date
                  </CTableHeaderCell>

                  <CTableHeaderCell
                    scope="col"
                    style={{ color: 'white', width: '15%', textAlign: 'center' }}
                  >
                    Customer Name
                  </CTableHeaderCell>
                  <CTableHeaderCell
                    scope="col"
                    style={{ color: 'white', width: '15%', textAlign: 'center' }}
                  >
                    Customer Type
                  </CTableHeaderCell>
                  <CTableHeaderCell
                    scope="col"
                    style={{ color: 'white', width: '8%', textAlign: 'center' }}
                  >
                    City
                  </CTableHeaderCell>
                  <CTableHeaderCell
                    scope="col"
                    style={{ color: 'white', width: '9%', textAlign: 'center' }}
                  >
                    Route
                  </CTableHeaderCell>

                  <CTableHeaderCell
                    scope="col"
                    style={{ color: 'white', width: '5%', textAlign: 'center' }}
                  >
                    QTY in MTS
                  </CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {/* { saleOrders && { */}
                {/* {fetch && */}
                {rowData.map((data, index) => {
                  // console.log('data')
                  // console.log(data)
                  // if (data.VBELN2)
                  return (
                    <>
                      <CTableRow>
                        <CTableDataCell style={{ width: '5%', textAlign: 'center' }} scope="row">
                          <input
                            className="form-check-input"
                            style={{ minHeight: '18px !important' }}
                            type="checkbox"
                            name="delivery_orders"
                            value={data.DeliveryOrderNumber}
                            id="flexCheckDefault"
                            onChange={assign_delivery}
                          />
                          {/* <input type="checkbox" name="name2" /> */}
                        </CTableDataCell>
                        <CTableDataCell style={{ width: '5%', textAlign: 'center' }} scope="row">
                          {data.sno}
                        </CTableDataCell>
                        <CTableDataCell style={{ width: '9%', textAlign: 'center' }} scope="row">
                          {/* {getIncoTermNameByCode(data.IncoTerm)} */}
                          {data.IncoTerm}
                        </CTableDataCell>
                        <CTableDataCell style={{ width: '9%', textAlign: 'center' }} scope="row">
                          {getLocationNameByCode(data.DeliveryPlant)}
                        </CTableDataCell>
                        <CTableDataCell style={{ width: '9%', textAlign: 'center' }} scope="row">
                          {data.DeliveryOrderNumber}
                        </CTableDataCell>
                        <CTableDataCell style={{ width: '9%', textAlign: 'center' }} scope="row">
                          {formatDate(data.DeliveryOrderDate)}{' '}
                        </CTableDataCell>
                        <CTableDataCell style={{ width: '9%', textAlign: 'center' }} scope="row">
                          {data.SaleOrderNumber}
                        </CTableDataCell>
                        <CTableDataCell style={{ width: '9%', textAlign: 'center' }} scope="row">
                          {formatDate(data.SaleOrderDate)}{' '}
                        </CTableDataCell>
                        <CTableDataCell style={{ width: '15%', textAlign: 'center' }} scope="row">
                          {data.CustomerName}
                        </CTableDataCell>
                        <CTableDataCell style={{ width: '15%', textAlign: 'center' }} scope="row">
                          {data.CustomerType}
                        </CTableDataCell>
                        <CTableDataCell style={{ width: '8%', textAlign: 'center' }} scope="row">
                          {data.CustomerCity}
                        </CTableDataCell>
                        <CTableDataCell style={{ width: '9%', textAlign: 'center' }} scope="row">
                          {data.CustomerRoute}
                        </CTableDataCell>
                        <CTableDataCell style={{ width: '5%', textAlign: 'center' }} scope="row">
                          {data.DeliveryQty}
                        </CTableDataCell>
                      </CTableRow>
                    </>
                  )
                })}
              </CTableBody>
            </CTable>
          </CRow>
        </CContainer>
      )}
    </>
  )
}

export default NlmtOpenDeliveryInfo
