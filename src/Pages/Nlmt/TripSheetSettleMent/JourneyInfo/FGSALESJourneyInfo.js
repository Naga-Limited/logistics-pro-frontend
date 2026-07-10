import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import {
  CButton,
  CCard,
  CCardBody,
  CCollapse,
  CContainer,
  CNavLink,
  CTable,
  CTableBody,
  CTableHead,
} from '@coreui/react'
import CustomTable from 'src/components/customComponent/CustomTable'
import Loader from 'src/components/Loader'
import CustomerFreightApi from 'src/Service/SubMaster/CustomerFreightApi'
import LocationApi from 'src/Service/SubMaster/LocationApi'
import DefinitionsListApi from 'src/Service/Definitions/DefinitionsListApi'

const FGSALESJourneyInfo = (props) => {
  console.log(props.fgsalesJourneyInfo, 'fgsalesTripData')

  var fgsalesTripData = props.fgsalesJourneyInfo
  const [rowData, setRowData] = useState([])
  const [fetch, setFetch] = useState(false)
  const [tripShipmentCustomerData, setTripShipmentCustomerData] = useState([])

  const dateCheck = (dateFrom,dateTo,dateCheck) => {
    console.log(dateFrom,'dateFrom')
    console.log(dateTo,'dateTo')
    console.log(dateCheck,'dateCheck')

    var d1 = dateFrom.split("-");
    var d2 = dateTo.split("-");
    var c = dateCheck.split("-");

    var from = new Date(d1[2], parseInt(d1[1])-1, d1[0]);  // -1 because months are from 0 to 11
    var to = new Date(d2[2], parseInt(d2[1])-1, d2[0]);
    var check = new Date(c[2], parseInt(c[1])-1, c[0]);
    console.log(check >= from && check <= to,'condition')
    if(check >= from && check <= to){
      return true
    } else {
      return false
    }

  }

  const [locationData, setLocationData] = useState([])
  useEffect(() => {

    //section for getting Location Data from database
    LocationApi.getLocation().then((res) => {
      console.log(res.data.data,'location data')
      setLocationData(res.data.data)  
    })

  }, [])

  const inArray = (plant, plants) => {
    var length = plants.length
    for (var i = 0; i < length; i++) {
      if (plants[i] == plant) return true
    }
    return false
  }

  const calculationForFreight = (data2,shipmentDate) => {

    console.log(data2,'data2')
    let qty = data2.delivery_qty
    let code = data2.customer_info.CustomerCode
    let plant = data2.delivery_plant
    // let uom = data2.invoice_uom

    let uom = data2.invoice_uom
    // if(plant != '9290'){
    if(!inArray(plant, nlcdPlantsArrayData)){
      uom = data2.billed_uom != null ? data2.billed_uom: data2.invoice_uom
    }

    let freight = 0
    let location = ''

    // if(data2.delivery_freight_amount == '1' && data2.inco_term_id != '382') {
    if(data2.delivery_freight_amount == '1' && !(data2.inco_term_id == '381' || data2.inco_term_id == '382')) {


      // if(plant == '9290'){
      //   location = 8
      // } else if(plant == '1009' || plant == '1010'){
      //   location = 1
      // } else if(plant == '1020' || plant == '1022'){
      //   location = 6
      // }

      let locationFilterData = locationData.filter(
        (data) => data.location_code == plant
      )

      console.log(locationFilterData,'locationFilterData')
      if(locationFilterData.length > 0){
        location = locationFilterData[0].id
      }

      console.log(code,'code')
      console.log(plant,'plant')
      console.log(uom,'uom')
      console.log(tripShipmentCustomerData,'tripShipmentCustomerData11')
      
      tripShipmentCustomerData.map((data1,index1)=>{
        setFetch(true)
        if(data1.customer_code == code){

          let freight_filter_info = []
          if(data1.freight_info && data1.freight_info.length > 0){
            console.log(data1.freight_info,'data1.freight_info')
            freight_filter_info = data1.freight_info.filter(
              (data) => data.location_id == location
            )
          }
          console.log(freight_filter_info,'freight_filter_info')
          freight_filter_info.map((datan2,index2)=>{

            console.log(datan2,'dataaaa2')
            if(datan2.type == uom && dateCheck(datan2.formated_start_date,datan2.formated_end_date,shipmentDate))
            { //&& datan2.freight_status == '1')
              freight = Number(parseFloat(datan2.freight_rate).toFixed(2))*Number(parseFloat(qty).toFixed(4))

            }
          })
        }
      })
    } else {
      setFetch(true)
      freight = Number(parseFloat(data2.delivery_freight_amount).toFixed(2))
    }

    console.log(freight,'freight')

    return freight
  }

  const calculationForCustomerFreight = (data2,shipmentDate) => {

    console.log(data2,'data2')
    let qty = data2.delivery_qty
    let code = data2.customer_info.CustomerCode
    let plant = data2.delivery_plant
    // let uom = data2.invoice_uom
    let uom = data2.billed_uom != null ? data2.billed_uom: data2.invoice_uom

    let freight = 0
    let location = ''

    // if(data2.delivery_freight_amount == '1' && data2.inco_term_id != '382') {
    if(data2.delivery_freight_amount == '1' && !(data2.inco_term_id == '381' || data2.inco_term_id == '382')) {

      // if(plant == '9290'){
      //   location = 8
      // } else if(plant == '1009'){
      //   location = 1
      // } else if(plant == '1020'){
      //   location = 6
      // }

      let locationFilterData = locationData.filter(
        (data) => data.location_code == plant
      )

      console.log(locationFilterData,'locationFilterData')
      if(locationFilterData.length > 0){
        location = locationFilterData[0].id
      }
      console.log(code,'code')
      console.log(plant,'plant')
      console.log(uom,'uom')
      console.log(tripShipmentCustomerData,'tripShipmentCustomerData11')

      tripShipmentCustomerData.map((data1,index1)=>{
        if(data1.customer_code == code){
          let freight_filter_info = []
          if(data1.freight_info && data1.freight_info.length > 0){
            console.log(data1.freight_info,'data1.freight_info')
            freight_filter_info = data1.freight_info.filter(
              (data) => data.location_id == location
            )
          }
          console.log(freight_filter_info,'freight_filter_info')
          freight_filter_info.map((datan2,index2)=>{

            console.log(datan2,'dataaaa2')
            if(datan2.type == uom && dateCheck(datan2.formated_start_date,datan2.formated_end_date,shipmentDate))
            { //&& datan2.freight_status == '1')
              freight = Number(parseFloat(datan2.freight_rate).toFixed(2))

            }
          })
        }
      })
    } else {
      freight = 0
    }

    console.log(freight,'customerfreight')

    return freight
  }

  const [incoTermData, setIncoTermData] = useState([])
  const[nlcdPlantsData, setNlcdPlantsData] = useState([])
  const[nlcdPlantsArrayData, setNlcdPlantsArrayData] = useState([])

  /* Display The Inco Term Name via Given Inco Term Code */
  const getIncoTermNameByCode = (code) => {
    console.log(incoTermData,'incoTermData')
    let filtered_incoterm_data = incoTermData.filter((c, index) => {
      
      if (c.incoterm_id == code) {
        return true
      }
    })

    let incoTermName = filtered_incoterm_data[0] ? filtered_incoterm_data[0].incoterm_code : 'Loading..'

    return incoTermName
  }

  const getClosureSTOData = () => {
    let rowDataList = []
    let indexNo = 0
    fgsalesTripData.map((data1, index1) => {
      data1.shipment_child_info.map((data2, index2) => {
        indexNo += 1

        if (data1.vehicle_type_id == '3') {
          rowDataList.push({
            sno: indexNo,
            shipment_no: data1.shipment_no,
            shipment_date: data1.created_at,
            // delivery_no: data2.delivery_no,
            delivery_no: ( data2.fj_pod_copy ?
              (<CNavLink style={{'color':'blue'}} href={`${data2.fj_pod_copy}`} target={'_blank'}>
                <b><u>{data2.delivery_no}</u></b>
              </CNavLink >) : data2.delivery_no
            ),
            invoice_no: data2.invoice_no,
            delivery_plant: data2.delivery_plant,
            incoterm: data2.inco_term_id ? getIncoTermNameByCode(data2.inco_term_id) : '-',
            division: data1.assigned_by == '1' ? 'NLFD' : 'NLCD',
            tripsheet_no: data1.trip_sheet_info.trip_sheet_no,
            customer_name: data2.customer_info.CustomerName,
            customer_code: data2.customer_info.CustomerCode,
            customer_city: data2.customer_info.CustomerCity,
            delivery_qty: data2.delivery_net_qty,
            invoice_qty: data2.invoice_net_quantity,
            invoice_uom: data2.invoice_uom,
            billed_uom: data2.billed_uom,
            // delivery_freight: data2.delivery_freight_amount,
            customer_freight: tripShipmentCustomerData.length > 0 ? (Number(parseFloat(calculationForCustomerFreight(data2,data1.created_at)).toFixed(2)) != 0 ? Number(parseFloat(calculationForCustomerFreight(data2,data1.created_at)).toFixed(2)) :
            <b style={{'color':'red'}}>{`0 (Zero Freight)`}</b>
            )  : '-',
            delivery_freight: tripShipmentCustomerData.length > 0 ? (Number(parseFloat(calculationForFreight(data2,data1.created_at)).toFixed(2)) != 0 ? Number(parseFloat(calculationForFreight(data2,data1.created_at)).toFixed(2)) :
            <b style={{'color':'red'}}>{`0 (Zero Freight)`}</b>
            )  : '-',
            delivered_time: data2.delivered_date_time,
            invoice_copy: data2.fj_pod_copy,
            driver_name: data1.driver_name,
          })
        } else {
          rowDataList.push({
            sno: indexNo,
            shipment_no: data1.shipment_no,
            shipment_date: data1.created_at,
            // delivery_no: data2.delivery_no,
            delivery_no: ( data2.fj_pod_copy ?
              <CNavLink style={{'color':'blue'}} href={`${data2.fj_pod_copy}`} target={'_blank'}>
                <b><u>{data2.delivery_no}</u></b>
              </CNavLink > : data2.delivery_no
            ),
            invoice_no: data2.invoice_no,
            delivery_plant: data2.delivery_plant,
            incoterm: data2.inco_term_id ? getIncoTermNameByCode(data2.inco_term_id) : '-', 
            division: data1.assigned_by == '1' ? 'NLFD' : 'NLCD',
            tripsheet_no: data1.trip_sheet_info.trip_sheet_no,
            customer_name: data2.customer_info.CustomerName,
            customer_code: data2.customer_info.CustomerCode,
            customer_city: data2.customer_info.CustomerCity,
            unload_charge: data2.unloading_charges,
            delivery_qty: data2.delivery_net_qty,
            invoice_qty: data2.invoice_net_quantity,
            invoice_uom: data2.invoice_uom,
            billed_uom: data2.billed_uom,
            // delivery_freight: data2.delivery_freight_amount,
            customer_freight: tripShipmentCustomerData.length > 0 ? (Number(parseFloat(calculationForCustomerFreight(data2,data1.created_at)).toFixed(2)) != 0 ? Number(parseFloat(calculationForCustomerFreight(data2,data1.created_at)).toFixed(2)) :
            <b style={{'color':'red'}}>{`0 (Zero Freight)`}</b>
            )  : '-',
            delivery_freight: tripShipmentCustomerData.length > 0 ? (Number(parseFloat(calculationForFreight(data2,data1.created_at)).toFixed(2)) != 0 ? Number(parseFloat(calculationForFreight(data2,data1.created_at)).toFixed(2)) :
            <b style={{'color':'red'}}>{`0 (Zero Freight)`}</b>
            )  : '-',
            invoice_copy: data2.fj_pod_copy,
            driver_name: data1.driver_name,
            opening_km: data1.opening_km,
            closing_km: data1.closing_km,
          })
        }
      })
    })
    setRowData(rowDataList)
  }

  useEffect(() => {
    CustomerFreightApi.getCustomerFreight().then((response) => {
      console.log(response.data.data, 'trip_shipment_customer_data3333')
      let trip_shipment_customer_data = response.data.data
      setTripShipmentCustomerData(trip_shipment_customer_data)
    })

    /* section for getting Inco Term Lists from database */
    DefinitionsListApi.visibleDefinitionsListByDefinition(16).then((response) => {

      let viewData = response.data.data

      let rowDataList_location = []
      viewData.map((data, index) => {
        rowDataList_location.push({
          sno: index + 1,
          incoterm_id: data.definition_list_id,
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

  useEffect(() => {

    // if(tripShipmentCustomerData.length > 0 && incoTermData.length > 0) {
    if(tripShipmentCustomerData.length > 0 && incoTermData.length > 0) {
      getClosureSTOData()
    }

  }, [tripShipmentCustomerData])

  const columns = [
    {
      name: 'S.No',
      selector: (row) => row.sno,
      sortable: true,
      center: true,
    },
    {
      name: 'Delivery No',
      selector: (row) => row.delivery_no,
      sortable: true,
      center: true,
    },
    {
      name: 'Shipment No',
      selector: (row) => row.shipment_no,
      sortable: true,
      center: true,
    },
    {
      name: 'Ship. Date',
      selector: (row) => row.shipment_date,
      sortable: true,
      center: true,
    },
    {
      name: 'Inco Term',
      selector: (row) => row.incoterm,
      sortable: true,
      center: true,
    },
    {
      name: 'Del. Plant',
      selector: (row) => row.delivery_plant,
      sortable: true,
      center: true,
    },
    {
      name: 'Invoice No',
      selector: (row) => row.invoice_no,
      sortable: true,
      center: true,
    },
    
    {
      name: 'Division',
      selector: (row) => row.division,
      sortable: true,
      center: true,
    },
    {
      name: 'Tripsheet No',
      selector: (row) => row.tripsheet_no,
      sortable: true,
      center: true,
    },
    {
      name: 'Customer Name',
      selector: (row) => row.customer_name,
      sortable: true,
      center: true,
    },
    {
      name: 'Customer Code',
      selector: (row) => row.customer_code,
      sortable: true,
      center: true,
    },
    {
      name: 'Customer City',
      selector: (row) => row.customer_city,
      sortable: true,
      center: true,
    },
    {
      name: 'Unloading Charges',
      selector: (row) => row.unload_charge,
      // sortable: true,
      center: true,
    },
    {
      name: 'Delivery Qty',
      selector: (row) => row.delivery_qty,
      // sortable: true,
      center: true,
    },
    {
      name: 'Invoice Qty',
      selector: (row) => row.invoice_qty,
      // sortable: true,
      center: true,
    },
    {
      name: 'Invoice Uom',
      selector: (row) => row.invoice_uom,
      // sortable: true,
      center: true,
    },
    {
      name: 'Billed Uom',
      selector: (row) => row.billed_uom,
      // sortable: true,
      center: true,
    },
    {
      name: 'Customer Freight',
      selector: (row) => row.customer_freight,
      // sortable: true,
      center: true,
    },
    {
      name: 'Delivery Freight',
      selector: (row) => row.delivery_freight,
      // sortable: true,
      center: true,
    },
    {
      name: 'Delivered Time',
      selector: (row) => row.delivered_time,
      // sortable: true,
      center: true,
    },
    // {
    //   name: 'Invoice',
    //   selector: (row) => row.invoice_copy,
    //   center: true,
    //   // sortable: true,
    // },
    {
      name: 'Driver Name',
      selector: (row) => row.driver_name,
      // sortable: true,
      center: true,
    },
    {
      name: 'Opening KM',
      selector: (row) => row.opening_km,
      // sortable: true,
      center: true,
    },
    {
      name: 'Closing KM',
      selector: (row) => row.closing_km,
      // sortable: true,
      center: true,
    },
  ]

  const columns_hire = [
    {
      name: 'S.No',
      selector: (row) => row.sno,
      sortable: true,
      center: true,
    },
    {
      name: 'Delivery No',
      selector: (row) => row.delivery_no,
      // sortable: true,
      center: true,
    },
    {
      name: 'Shipment No',
      selector: (row) => row.shipment_no,
      sortable: true,
      center: true,
    },
    {
      name: 'Ship. Date',
      selector: (row) => row.shipment_date,
      sortable: true,
      center: true,
    },
    {
      name: 'Inco Term',
      selector: (row) => row.incoterm,
      sortable: true,
      center: true,
    },
    {
      name: 'Del. Plant',
      selector: (row) => row.delivery_plant,
      sortable: true,
      center: true,
    },
    {
      name: 'Invoice No',
      selector: (row) => row.invoice_no,
      sortable: true,
      center: true,
    },
    {
      name: 'Division',
      selector: (row) => row.division,
      sortable: true,
      center: true,
    },
    {
      name: 'Tripsheet No',
      selector: (row) => row.tripsheet_no,
      sortable: true,
      center: true,
    },
    {
      name: 'Customer Name',
      selector: (row) => row.customer_name,
      sortable: true,
      center: true,
    },
    {
      name: 'Customer Code',
      selector: (row) => row.customer_code,
      sortable: true,
      center: true,
    },
    {
      name: 'Customer City',
      selector: (row) => row.customer_city,
      sortable: true,
      center: true,
    },

    {
      name: 'Delivery Qty',
      selector: (row) => row.delivery_qty,
      // sortable: true,
      center: true,
    },
    {
      name: 'Invoice Qty',
      selector: (row) => row.invoice_qty,
      // sortable: true,
      center: true,
    },
    {
      name: 'Invoice Uom',
      selector: (row) => row.invoice_uom,
      // sortable: true,
      center: true,
    },
    {
      name: 'Customer Freight',
      selector: (row) => row.customer_freight,
      // sortable: true,
      center: true,
    },
    {
      name: 'Delivery Freight',
      selector: (row) => row.delivery_freight,
      // sortable: true,
      center: true,
    },
    {
      name: 'Delivered Time',
      selector: (row) => row.delivered_time,
      // sortable: true,
      center: true,
    },
    // {
    //   name: 'Invoice',
    //   selector: (row) => row.invoice_copy,
    //   center: true,
    //   // sortable: true,
    // },
    {
      name: 'Driver Name',
      selector: (row) => row.driver_name,
      // sortable: true,
      center: true,
    },
  ]

  return (
      <>
        <div>
          {/* <h3>{props.title} </h3> */}
          {props.fgsalesJourneyInfo.length > 0 && (
            <>
              <CContainer className="mt-2">
                {!fetch && <Loader />}
                {fetch && (
                  <>
                    <CustomTable
                      columns={fgsalesTripData[0].vehicle_type_id == '3' ? columns_hire : columns}
                      data={rowData}
                      // title={props.title}
                      showSearchFilter={true}
                    />
                  </>
                )}
              </CContainer>
            </>
          )}
        </div>
      </>
  )
}
FGSALESJourneyInfo.propTypes = {
  fgsalesJourneyInfo: PropTypes.array.isRequired,
  title: PropTypes.string,
}

FGSALESJourneyInfo.defaultProps = {
  title: '',
}
export default FGSALESJourneyInfo
