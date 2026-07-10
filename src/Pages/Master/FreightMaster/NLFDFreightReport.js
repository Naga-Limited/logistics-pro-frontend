import React, { useState, useEffect } from 'react'
import {
  CButton,
  CCard,
  CRow,
  CCol, 
  CContainer, 
  CFormLabel,
} from '@coreui/react'
import VehicleAssignmentService from 'src/Service/VehicleAssignment/VehicleAssignmentService' 
import CustomTable from 'src/components/customComponent/CustomTable' 
import { toast } from 'react-toastify'
import Loader from 'src/components/Loader'
import { DateRangePicker } from 'rsuite' 
import FileSaver from 'file-saver'
import * as XLSX from 'xlsx';  
import DefinitionsListApi from 'src/Service/Definitions/DefinitionsListApi'
import { GetDateTimeFormat } from 'src/Pages/Depo/CommonMethods/CommonMethods' 
import FMSearchSelectComponent from './segments/FMSearchSelectComponent'
import JavascriptInArrayComponent from 'src/components/commoncomponent/JavascriptInArrayComponent'
import CustomerFreightApi from 'src/Service/SubMaster/CustomerFreightApi'
import LocationApi from 'src/Service/SubMaster/LocationApi'
import * as LogisticsProScreenNumberConstants from 'src/components/constants/LogisticsProScreenNumberConstants'
import AccessDeniedComponent from 'src/components/commoncomponent/AccessDeniedComponent'

const NLFDFreightReport = () => { 

  /*================== User Location Fetch ======================*/
  const user_info_json = localStorage.getItem('user_info')
  const user_info = JSON.parse(user_info_json)
  const user_locations = []

  /* Get User Locations From Local Storage */
  user_info.location_info.map((data, index) => {
    user_locations.push(data.id)
  })

  /* ==================== Access Part Start ========================*/
    const [screenAccess, setScreenAccess] = useState(false) 
    let page_no = LogisticsProScreenNumberConstants.InvoiceReport.NLFD_Freight_Report
  
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

  const onChangeFilter = (event, event_type) => {
    var selected_value = event.value
    console.log(selected_value, 'selected_value')

    if (event_type == 'vehicle_no') {
      if (selected_value) {
        setReportVehicle(selected_value)
      } else {
        setReportVehicle(0)
      }
    } else if (event_type == 'vehicle_type') {
      if (selected_value) {
        setReportVehicleType(selected_value)
      } else {
        setReportVehicleType(0)
      }
    } else if (event_type == 'tripsheet_no') {
      if (selected_value) {
        setReportTSNo(selected_value)
      } else {
        setReportTSNo(0)
      }
    } else if (event_type == 'shipment_no') {
      if (selected_value) {
        setReportShipmentNo(selected_value)
      } else {
        setReportShipmentNo(0)
      }
    } else if (event_type == 'customer_name') {
      if (selected_value) {
        setReportInvoiceCustomer(selected_value)
      } else {
        setReportInvoiceCustomer(0)
      }
    } else if (event_type == 'delivery_no') {
      if (selected_value) {
        setReportDeliveryNo(selected_value)
      } else {
        setReportDeliveryNo(0)
      }
    } else if (event_type == 'inco_term') {
      if (selected_value) {
        setReportInvoiceIncoTerm(selected_value)
      } else {
        setReportInvoiceIncoTerm(0)
      }
    }
  }

  const exportToCSV = () => {
    console.log(rowData,'exportCsvData')
    let dateTimeString = GetDateTimeFormat(1)
    let fileName='NLFD_Freight_Report_'+dateTimeString
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';
    const ws = XLSX.utils.json_to_sheet(rowData);
    const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], {type: fileType});
    FileSaver.saveAs(data, fileName + fileExtension);
  }

  const [incoTermData, setIncoTermData] = useState([])

  useEffect(() => {

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
      console.log(rowDataList_location,'incoTermData-rowDataList_location')
      setIncoTermData(rowDataList_location)
    })

    CustomerFreightApi.getCustomerFreight().then((response) => {
      console.log(response.data.data, 'trip_shipment_customer_data')
      let trip_shipment_customer_data = response.data.data
      setTripShipmentCustomerData(trip_shipment_customer_data)
    })

  }, [])

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

  const [rowData, setRowData] = useState([])
  const [searchFilterData, setSearchFilterData] = useState([]) 
  const [fetch, setFetch] = useState(false)

  /* Report Variables */
  const [reportVehicle, setReportVehicle] = useState(0)
  const [reportVehicleType, setReportVehicleType] = useState(0)
  const [reportTSNo, setReportTSNo] = useState(0) 
  const [reportShipmentNo, setReportShipmentNo] = useState(0)
  const [reportDeliveryNo, setReportDeliveryNo] = useState(0) 
  const [reportInvoiceCustomer, setReportInvoiceCustomer] = useState(0)
  const [reportInvoiceIncoTerm, setReportInvoiceIncoTerm] = useState(0) 

  let tableReportData = []

  /* Set Default Date (Today) in a Variable State */
  const [defaultDate, setDefaultDate] = React.useState([
    new Date(getCurrentDate('-')),
    new Date(getCurrentDate('-')),
  ])

  useEffect(() => {
    console.log(defaultDate)
    if (defaultDate) {
      setDefaultDate(defaultDate)
    } else {
    }
  }, [defaultDate])

  function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [day, month, year].join('-');
  }

  function formatDate(dateString) {
    if (!dateString) return '';

    const date = new Date(dateString);

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  }

  const soDetailsFinder = (jsonData,type) => {
    let needed_data = '-'
    if(type == 1){
      needed_data = jsonData.SaleOrderNumber
    }
    return needed_data
  }

  const customerDetailsFinder = (jsonData,type) => {
   
    let needed_data = '-'
    if(type == 1){
      needed_data = jsonData.CustomerName
    } else if(type == 2){
      needed_data = jsonData.CustomerCode
    } if(type == 3){
      needed_data = jsonData.CustomerCity
    } if(type == 4){
      needed_data = jsonData.CustomerRoute
    }
    
    return needed_data
  }

  const FindCustomerType = (incoTerm,data) => {
    console.log(tripShipmentCustomerData,'FindCustomerType-tripShipmentCustomerData')
    let incoTermName = getIncoTermNameByCode(incoTerm)
    console.log(incoTermName,'incoTermName')
    if(incoTermName == 'CFR'){
      return 'Regular Customer'
    } else if(incoTermName == 'FOP'){
      return 'Party'
    } else if(incoTermName == 'FOT'){
      return 'Topay'
    } else if(incoTermName == 'FOB'){
      if(data){
        let cusCode = data.CustomerCode ? data.CustomerCode : 0
        if(cusCode == 0){
          return 'FOB'
        } else {
          let custType = '-'
          tripShipmentCustomerData.map((vv,kk)=>{
            if(vv.customer_code == cusCode){
              custType = vv.customer_type
            }
          })
          return custType
        }
      } else {
        return 'FOB Customer'
      }
      
    } else {
      return '-'
    } 
  }

  const baseFreightCalculation = (delivery,totalQty) => {
    console.log(delivery,'baseFreightCalculation-delivery')
    console.log(nlcdPlantsArrayData,'baseFreightCalculation-delivery-nlcdPlantsArrayData')
    let shipment_freight = 0
    if(delivery.delivery_freight_amount == '1' && !(delivery.inco_term_id == '381' || delivery.inco_term_id == '382')) {
     
      let uom_data = delivery.invoice_uom 
      if(!JavascriptInArrayComponent(delivery.delivery_plant,nlcdPlantsArrayData)){
        uom_data = delivery.billed_uom != null ? delivery.billed_uom: delivery.invoice_uom
      }
      console.log(uom_data,'baseFreightCalculation-uom_data')
      let freight_needed = calculationForFreight(delivery,delivery.delivery_qty,delivery.customer_info_updated.CustomerCode,delivery.delivery_plant,uom_data,delivery.created_at,totalQty)
      console.log(freight_needed,'baseFreightCalculation-freight_needed')

      shipment_freight = Number(parseFloat(freight_needed).toFixed(2))
    } else {
      shipment_freight = Number(parseFloat(delivery.delivery_freight_amount).toFixed(2))
    } 

    console.log(shipment_freight,'baseFreightCalculation-shipment_freight')
    return shipment_freight

  }

  const frptFinder = (incoTerm,freight,qty,data,type='') => {
    let incoTermName = getIncoTermNameByCode(incoTerm)
    console.log(incoTermName,'incoTermName')
    let frpt = 1
    if(incoTermName == 'CFR'){
      frpt = freight/qty
    } else if(incoTermName == 'FOP' || incoTermName == 'FOT'){
      return '-'
    } else if(incoTermName == 'FOB'){

      let freighted = baseFreightCalculation(data,qty)
      console.log(freighted,'baseFreightCalculation-freight')

      if(type == 'TT'){
        if(freighted == 0){
          return 'Not Maintained'
        }
        return freighted
      } else if( type == 'RR'){
        let tfrpt = freighted/qty
        if(tfrpt == 0){
          return '-'
        }
        if(Number.isInteger(tfrpt)){
          return tfrpt
        } else {
          return parseFloat(tfrpt).toFixed(2)
        }

      }

      return freight
    } else { 
    } 
    if(Number.isInteger(frpt)){
      return frpt
    } else {
      return parseFloat(frpt).toFixed(2)
    }
  }

  const [tripShipmentCustomerData, setTripShipmentCustomerData] = useState([])
  const [locationData, setLocationData] = useState([])
  const[nlcdPlantsArrayData, setNlcdPlantsArrayData] = useState([])
  useEffect(() => {

    //section for getting Location Data from database
    LocationApi.getLocation().then((res) => {
      console.log(res.data.data,'location data')
      setLocationData(res.data.data)
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
    })

  }, [])

  const calculationForFreight = (deliveries,qty,code,plant,uom,up_date,t_qty=0) => {
    let freight = 0
    let location = '' 

    let locationFilterData = locationData.filter(
      (data) => data.location_code == plant
    )

    console.log(locationFilterData,'locationFilterData')
    if(locationFilterData.length > 0){
      location = locationFilterData[0].id
    }

    console.log(code,'calculationForFreight-code')
    console.log(deliveries,'calculationForFreight-deliveries')
    console.log(plant,'calculationForFreight-plant')
    console.log(uom,'calculationForFreight-uom')
    console.log(up_date,'calculationForFreight-up_date')
    let date = formatDate(up_date)
    console.log(date,'calculationForFreight-updated_date')
    console.log(tripShipmentCustomerData,'calculationForFreight-tripShipmentCustomerData')

    var delivery_freight_array = [];

    // deliveries.map((datan1,indexn1)=>{
      // if(datan1.delivery_plant == '9290'){
      // if(JavascriptInArrayComponent(deliveries.delivery_plant,nlcdPlantsArrayData)){
      //   tripShipmentCustomerData.map((data1,index1)=>{
      //     if(data1.customer_code == deliveries.customer_info.CustomerCode){

      //       let freight_filter_info = []
      //       if(data1.freight_info && data1.freight_info.length > 0){
      //         console.log(data1.freight_info,'data1.freight_info')
      //         freight_filter_info = data1.freight_info.filter(
      //           (data) => data.location_id == location
      //         )
      //       }
      //       console.log(freight_filter_info,'freight_filter_info')
      //       freight_filter_info.map((data2,index2)=>{
      //         if(data2.type == uom && dateCheck(data2.formated_start_date,data2.formated_end_date,date)) { //&& data2.freight_status == '1'
      //             delivery_freight_array.push(data2.freight_rate)
      //         }
      //       })
      //     }
      //   })
      // }
    // })

    /* Get Highest Delivery Freight From deliveryFreightData*/
    console.log(delivery_freight_array,'delivery_freight_array')

    var largest= 0;

    for (let i=0; i<delivery_freight_array.length; i++){
      if (delivery_freight_array[i]>largest) {
          largest=delivery_freight_array[i];
      }
    }

    console.log(largest,'largest freight')

    tripShipmentCustomerData.map((data1,index1)=>{
      if(data1.customer_code == code){

        let freight_filter_info1 = []
        if(data1.freight_info && data1.freight_info.length > 0){
          console.log(data1.freight_info,'data1.freight_info1')
          freight_filter_info1 = data1.freight_info.filter(
            (data) => data.location_id == location
          )
        }
        console.log(freight_filter_info1,'freight_filter_info1')

        freight_filter_info1.map((data2,index2)=>{
          if(data2.type == uom && dateCheck(data2.formated_start_date,data2.formated_end_date,date)) { // && data2.freight_status == '1') {
            if(location == '8') {
              freight = Number(parseFloat(largest).toFixed(2))*Number(parseFloat(qty).toFixed(4))
            } else {
              freight = Number(parseFloat(data2.freight_rate).toFixed(2))*Number(parseFloat(qty).toFixed(4))
            }
          }
        })
      }
    })

    console.log(freight,'calculationForFreight-freight')

    if(Number.isInteger(freight)){
      return freight
    } else {
      return parseFloat(freight).toFixed(2)
    } 
  }

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

  const loadTripShipmentDeliveryReport = (fresh_type = '') => {
    /*================== User Location Fetch ======================*/
    const user_info_json = localStorage.getItem('user_info')
    const user_info = JSON.parse(user_info_json)
    var user_locations = []

    /* Get User Locations From Local Storage */
    user_info.location_info.map((data, index) => {
      user_locations.push(data.id)
    })

    if (fresh_type !== '1') { 
      /*================== User Location Fetch ======================*/

      VehicleAssignmentService.getShipmentDeliveryDataForNLFDFreightReport().then((res) => {
        tableReportData = res.data ? JSON.parse(res.data) : []      
        console.log(tableReportData,'getShipmentDeliveryDataForNLFDFreightReport')
        setFetch(true)
        let rowDataList = []
        let filterData = tableReportData.filter(
          (data) => data
        )
        console.log(filterData,'getShipmentDeliveryDataForNLFDFreightReport')
        setSearchFilterData(filterData)
        filterData.map((data, index) => { 
          rowDataList.push({
            sno: index + 1,
            Customer_Code: customerDetailsFinder(data.customer_info_updated,2),
            Customer_Name: customerDetailsFinder(data.customer_info_updated,1),
            Customer_City: customerDetailsFinder(data.customer_info_updated,3),
            Invoice_No:data.invoice_no ? data.invoice_no : '-',
            Delivery_No:data.delivery_no,
            Customer_Type:data.inco_term_id ? FindCustomerType(data.inco_term_id,data.customer_info_updated) : '-',
            Tripsheet_No: data.trip_sheet_no,         
            Invoice_Tonnage:data.delivery_net_qty ? data.delivery_net_qty : data.delivery_qty,
            Freight_Rate_per_ton:data.delivery_freight_amount && data.delivery_net_qty ? frptFinder(data.inco_term_id,data.delivery_freight_amount,data.delivery_net_qty,data,'RR') : '-',
            Total_Freight_Rate:data.delivery_freight_amount ? ( data.delivery_freight_amount == '1' ? frptFinder(data.inco_term_id,data.delivery_freight_amount,data.delivery_net_qty,data,'TT') : data.delivery_freight_amount ) : '-',
            Vehicle_Type: data.vehicle_type_id == 1 ? 'Own' : 'Hire',
            Vehicle_No: data.vehicle_number,
            Inco_Term:data.inco_term_id ? getIncoTermNameByCode(data.inco_term_id) : '-',
                  
            Shipment_No: data.shipment_no,
            // Shipment_Status: SHIPMENT_STATUS[data.shipment_status], 
            // SO_NO: soDetailsFinder(data.sale_order_info_updated,1),    
            // Delivery_Status:DELIVERY_STATUS[data.delivery_status],
            // Delivery_Line_Item_Count:data.total_line_item,
            // Invoice_Qty:data.invoice_quantity ? `${data.invoice_quantity} ${data.invoice_uom}` : '-',
            
            // Invoice_Attachment_Copy: data.fj_pod_copy && data.fj_pod_copy != '' ? (
            //   <a style={{color:'black'}} target='_blank' rel="noreferrer" href={Global_Fjpodcopy_Url+data.fj_pod_copy}>
            //     <i className="fa fa-eye" aria-hidden="true"></i>
            //   </a>
            // ) : '-',
            
            // Driver_Name: data.driver_name,
            // Driver_Mobile_Number: data.driver_number,
            // Shipment_Qty: data.billed_net_qty ? data.billed_net_qty : (data.shipment_net_qty ? data.shipment_net_qty : data.shipment_qty), 
            // Remarks: data.remarks ? data.remarks : '-',
            // Creation_Time: formatDate(data.created_at)
              
          })
           
          
        })
        setFetch(true)
        setRowData(rowDataList)
      })
    } else {
      if (defaultDate == null) {
        toast.warning('Date Filter Should not be empty..!')
        return false
      } else if (
        defaultDate == null &&
        reportVehicle == 0 &&
        reportVehicleType == 0 &&
        reportShipmentNo == 0 &&
        reportDeliveryNo == 0 &&
        reportTSNo == 0 &&
        reportInvoiceCustomer == 0 &&
        reportInvoiceIncoTerm == 0
      ) {
        toast.warning('Choose atleast one filter type..!')
        return false
      }
      let report_form_data = new FormData()
      report_form_data.append('date_between', defaultDate)
      report_form_data.append('vehicle_no', reportVehicle)
      report_form_data.append('vehicle_type', reportVehicleType)
      report_form_data.append('shipment_no', reportShipmentNo)
      report_form_data.append('delivery_no', reportDeliveryNo)
      report_form_data.append('tripsheet_no', reportTSNo) 
      report_form_data.append('customer_code', reportInvoiceCustomer)
      report_form_data.append('inco_term', reportInvoiceIncoTerm) 

      console.log(defaultDate, 'defaultDate')
      console.log(reportVehicle, 'reportVehicle')
      console.log(reportVehicleType, 'reportVehicleType')
      console.log(reportShipmentNo, 'reportShipmentNo')
      console.log(reportDeliveryNo, 'reportDeliveryNo')
      console.log(reportTSNo, 'reportTSNo')
      console.log(reportInvoiceCustomer, 'reportInvoiceCustomer')
      console.log(reportInvoiceIncoTerm, 'reportInvoiceIncoTerm')

      VehicleAssignmentService.sentShipmentDeliveryDataForNLFDFreightReport(report_form_data).then((res) => {
        console.log(res, 'res')
        let tableReportData = res.data ? JSON.parse(res.data) : []  
        console.log(tableReportData,'sentShipmentDeliveryDataForNLFDFreightReport')

        setFetch(true)
        let rowDataList = []
        let filterData = tableReportData.filter(
          (data) => data
        )
        // console.log(filterData)
        setSearchFilterData(filterData)
        filterData.map((data, index) => {
          rowDataList.push({
            sno: index + 1,
            Customer_Code: customerDetailsFinder(data.customer_info_updated,2),
            Customer_Name: customerDetailsFinder(data.customer_info_updated,1),
            Customer_City: customerDetailsFinder(data.customer_info_updated,3),
            Invoice_No:data.invoice_no ? data.invoice_no : '-',
            Delivery_No:data.delivery_no,
            Customer_Type:data.inco_term_id ? FindCustomerType(data.inco_term_id,data.customer_info_updated) : '-',
            Tripsheet_No: data.trip_sheet_no,         
            Invoice_Tonnage:data.delivery_net_qty ? data.delivery_net_qty : data.delivery_qty,
            Freight_Rate_per_ton:data.delivery_freight_amount && data.delivery_net_qty ? frptFinder(data.inco_term_id,data.delivery_freight_amount,data.delivery_net_qty,data,'RR') : '-',
            Total_Freight_Rate:data.delivery_freight_amount ? ( data.delivery_freight_amount == '1' ? frptFinder(data.inco_term_id,data.delivery_freight_amount,data.delivery_net_qty,data,'TT') : data.delivery_freight_amount ) : '-',
            Vehicle_Type: data.vehicle_type_id == 1 ? 'Own' : 'Hire',
            Vehicle_No: data.vehicle_number,
            Inco_Term:data.inco_term_id ? getIncoTermNameByCode(data.inco_term_id) : '-',
                  
            Shipment_No: data.shipment_no,
            // Shipment_Status: SHIPMENT_STATUS[data.shipment_status], 
            // SO_NO: soDetailsFinder(data.sale_order_info_updated,1),    
            // Delivery_Status:DELIVERY_STATUS[data.delivery_status],
            // Delivery_Line_Item_Count:data.total_line_item,
            // Invoice_Qty:data.invoice_quantity ? `${data.invoice_quantity} ${data.invoice_uom}` : '-',
            
            // Invoice_Attachment_Copy: data.fj_pod_copy && data.fj_pod_copy != '' ? (
            //   <a style={{color:'black'}} target='_blank' rel="noreferrer" href={Global_Fjpodcopy_Url+data.fj_pod_copy}>
            //     <i className="fa fa-eye" aria-hidden="true"></i>
            //   </a>
            // ) : '-',
            
            // Driver_Name: data.driver_name,
            // Driver_Mobile_Number: data.driver_number,
            // Shipment_Qty: data.billed_net_qty ? data.billed_net_qty : (data.shipment_net_qty ? data.shipment_net_qty : data.shipment_qty), 
            // Remarks: data.remarks ? data.remarks : '-',
            // Creation_Time: formatDate(data.created_at)
          })
        })
        setRowData(rowDataList)
      })
    }
  }

  useEffect(() => {
    loadTripShipmentDeliveryReport() 
  }, [incoTermData.length > 0, tripShipmentCustomerData.length > 0, locationData.length > 0])

  const columns = [
    {
      name: 'S.No',
      selector: (row) => row.sno,
      sortable: true,
      center: true,
    },
    {
      name: 'Cus. Code',
      selector: (row) => row.Customer_Code,
      sortable: true,
      center: true,
    },
    {
      name: 'Name',
      selector: (row) => row.Customer_Name,
      sortable: true,
      center: true,
    },
    {
      name: 'City',
      selector: (row) => row.Customer_City,
      sortable: true,
      center: true,
    },
    {
      name: 'Invoice No',
      selector: (row) => row.Invoice_No,
      sortable: true,
      center: true,
    },
    {
      name: 'Delivery No',
      selector: (row) => row.Delivery_No,
      sortable: true,
      center: true,
    },
    {
      name: 'Customer Type',
      selector: (row) => row.Customer_Type,
      sortable: true,
      center: true,
      
    },
    {
      name: 'Shipment No',
      selector: (row) => row.Shipment_No,
      sortable: true,
      center: true,
    },
    {
      name: 'TripSheet No',
      selector: (row) => row.Tripsheet_No,
      sortable: true,
      center: true,
    }, 
    {
      name: 'Invoice Tonnage',
      selector: (row) => row.Invoice_Tonnage,
      sortable: true,
      center: true,
    }, 
    {
      name: 'Freight Per TON',
      selector: (row) => row.Freight_Rate_per_ton,
      sortable: true,
      center: true,
    },
    {
      name: 'Total Freight',
      selector: (row) => row.Total_Freight_Rate,
      sortable: true,
      center: true,
    },    
    // {
    //   name: 'Invoice Qty.',
    //   selector: (row) => row.Invoice_Qty, 
    //   sortable: true,
    //   center: true,
    // },
    {
      name: 'Vehicle Type',
      selector: (row) => row.Vehicle_Type,
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
      name: 'Inco Term',
      selector: (row) => row.Inco_Term,
      sortable: true,
      center: true,
    }, 
  ]

  function getCurrentDate(separator = '') { 
    let newDate = new Date()
    let date = newDate.getDate()
    let month = newDate.getMonth() + 1
    let year = newDate.getFullYear()

    return `${year}${separator}${month < 10 ? `0${month}` : `${month}`}${separator}${
      date < 10 ? `0${date}` : `${date}`
    }`
  }

  return (
    <>
      {!fetch && <Loader />}
      {fetch && (
        <>
        {screenAccess ? ( 
          <CCard className="mt-4">
            <CContainer className="m-2">
              <CRow className="m-2">
                <CCol xs={12} md={3}>
                  <CFormLabel htmlFor="VNum">Date Filter</CFormLabel>
                  <DateRangePicker
                    style={{ width: '100rem', height: '100%', borderColor: 'black' }}
                    className="mb-2"
                    id="start_date"
                    name="end_date"
                    format="dd-MM-yyyy"
                    value={defaultDate}
                    onChange={setDefaultDate}
                  />
                </CCol>
                <CCol xs={12} md={3}>
                  <CFormLabel htmlFor="VNum">Tripsheet Number</CFormLabel>
                  <FMSearchSelectComponent
                    size="sm"
                    className="mb-2"
                    onChange={(e) => {
                      onChangeFilter(e, 'tripsheet_no')
                    }}
                    label="Select Tripsheet Number"
                    noOptionsMessage="Tripsheet Not found"
                    search_type="invoice_report_tripsheet_number"
                    search_data={searchFilterData}
                  />
                </CCol>
                <CCol xs={12} md={3}>
                  <CFormLabel htmlFor="VNum">Vehicle Number</CFormLabel>
                  <FMSearchSelectComponent
                    size="sm"
                    className="mb-2"
                    onChange={(e) => {
                      onChangeFilter(e, 'vehicle_no')
                    }}
                    label="Select Vehicle Number"
                    noOptionsMessage="Vehicle Not found"
                    search_type="invoice_report_vehicle_number"
                    search_data={searchFilterData}
                  />
                </CCol>
                <CCol xs={12} md={3}>
                  <CFormLabel htmlFor="VNum">Vehicle Type</CFormLabel>
                  <FMSearchSelectComponent
                    size="sm"
                    className="mb-2"
                    onChange={(e) => {
                      onChangeFilter(e, 'vehicle_type')
                    }}
                    label="Select Vehicle Type"
                    noOptionsMessage="Vehicle Type Not found"
                    search_type="invoice_report_vehicle_type"
                    search_data={searchFilterData}
                  />
                </CCol>

                <CCol xs={12} md={3}>
                  <CFormLabel htmlFor="VNum">Shipment Number</CFormLabel>
                  <FMSearchSelectComponent
                    size="sm"
                    className="mb-2"
                    onChange={(e) => {
                      onChangeFilter(e, 'shipment_no')
                    }}
                    label="Select Shipment Number"
                    noOptionsMessage="Shipment Not found"
                    search_type="invoice_report_shipment_number"
                    search_data={searchFilterData}
                  />
                </CCol>

                <CCol xs={12} md={3}>
                  <CFormLabel htmlFor="VNum">Customer Name</CFormLabel>
                  <FMSearchSelectComponent
                    size="sm"
                    className="mb-2"
                    onChange={(e) => {
                      onChangeFilter(e, 'customer_name')
                    }}
                    label="Select Customer Name"
                    noOptionsMessage="Customer Name Not found"
                    search_type="invoice_report_customer_name"
                    search_data={searchFilterData}
                  />
                </CCol>

                <CCol xs={12} md={3}>
                  <CFormLabel htmlFor="VNum">Delivery Number</CFormLabel>
                  <FMSearchSelectComponent
                    size="sm"
                    className="mb-2"
                    onChange={(e) => {
                      onChangeFilter(e, 'delivery_no')
                    }}
                    label="Select Delivery Number"
                    noOptionsMessage="Delivery Not found"
                    search_type="invoice_report_delivery_number"
                    search_data={searchFilterData}
                  />
                </CCol>

                <CCol xs={12} md={3}>
                  <CFormLabel htmlFor="VNum">Inco Term</CFormLabel>
                  <FMSearchSelectComponent
                    size="sm"
                    className="mb-2"
                    onChange={(e) => {
                      onChangeFilter(e, 'inco_term')
                    }}
                    label="Select Inco term"
                    noOptionsMessage="Inco Term Not found"
                    search_type="invoice_report_inco_term"
                    search_data={searchFilterData}
                  />
                </CCol>
              </CRow>
              <CRow className="mt-3">
                <CCol className="" xs={12} sm={9} md={3}></CCol>

                <CCol
                  className="offset-md-6"
                  xs={12}
                  sm={9}
                  md={3}
                  style={{ display: 'flex', justifyContent: 'end' }}
                >
                  <CButton
                    size="sm"
                    color="primary"
                    className="mx-3 px-3 text-white"
                    onClick={() => {
                      setFetch(false)
                      loadTripShipmentDeliveryReport('1')
                    }}
                  >
                    Filter
                  </CButton>
                  <CButton
                    size="lg-sm"
                    color="warning"
                    className="mx-3 px-3 text-white"
                    onClick={(e) => { 
                        exportToCSV()
                      }}
                  >
                    Export
                  </CButton>
                </CCol>
              </CRow>
              <CustomTable
                columns={columns}
                data={rowData}
                fieldName={'Driver_Name'}
                showSearchFilter={true}
              />
            </CContainer>
          </CCard>
        ) : (<AccessDeniedComponent />
        )}
        </>
      )}
    </>
  )
}

export default NLFDFreightReport
