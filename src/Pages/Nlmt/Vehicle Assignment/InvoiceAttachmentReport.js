import React, { useState, useEffect } from 'react'
import {
  CButton,
  CCard,
  CRow,
  CCol, 
  CContainer, 
  CFormLabel,
  CInputGroup,
  CInputGroupText,
  CFormSelect,
  CFormInput,
} from '@coreui/react'
import VehicleAssignmentService from 'src/Service/VehicleAssignment/VehicleAssignmentService'
import { useNavigate } from 'react-router-dom'
import CustomTable from 'src/components/customComponent/CustomTable' 
import { toast } from 'react-toastify'
import Loader from 'src/components/Loader'
import { DateRangePicker } from 'rsuite' 
import FileSaver from 'file-saver'
import * as XLSX from 'xlsx';
import { GetDateTimeFormat } from '../Depo/CommonMethods/CommonMethods'
import { APIURL } from 'src/App'  
import DefinitionsListApi from 'src/Service/Definitions/DefinitionsListApi'
import IASearchSelectComponent from '../ShipmentCreationReports/IASearchSelectComponent'

const InvoiceAttachmentReport = () => {
  const navigation = useNavigate()

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
    } else if (event_type == 'shipment_status') {
      if (selected_value) {
        setReportShipmentStatus(selected_value)
      } else {
        setReportShipmentStatus(0)
      }
    } else if (event_type == 'delivery_no') {
      if (selected_value) {
        setReportDeliveryNo(selected_value)
      } else {
        setReportDeliveryNo(0)
      }
    } else if (event_type == 'delivery_status') {
      if (selected_value) {
        setReportDeliveryStatus(selected_value)
      } else {
        setReportDeliveryStatus(0)
      }
    }
  }

  const exportToCSV = () => {
    console.log(rowData,'exportCsvData')
    let dateTimeString = GetDateTimeFormat(1)
    let fileName='NLFD_Delivery_Report_'+dateTimeString
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';
    const ws = XLSX.utils.json_to_sheet(rowData);
    const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], {type: fileType});
    FileSaver.saveAs(data, fileName + fileExtension);
  }

  // const ACTION = {
  //   GATE_IN: 1,
  //   GATE_OUT: 2,
  //   WAIT_OUTSIDE: 0,
  //   VEHICLE_MAINTENANCE_ENDED: 5,
  // }

  const ACTION = {
    TRIPSHEET_CREATED: 1,
    TRIPSHEET_ASSIGNED: 3,
    TRIPSHEET_CONFIRMED: 2,
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

  const [pending, setPending] = useState(false)

  /* Report Variables */
  const [reportVehicle, setReportVehicle] = useState(0)
  const [reportVehicleType, setReportVehicleType] = useState(0)
  const [reportTSNo, setReportTSNo] = useState(0) 
  const [reportShipmentNo, setReportShipmentNo] = useState(0)
  const [reportDeliveryNo, setReportDeliveryNo] = useState(0)
  const [reportShipmentStatus, setReportShipmentStatus] = useState(0)
  const [reportDeliveryStatus, setReportDeliveryStatus] = useState(0) 

  let tableReportData = []

  const vehicleType = (value, data) => {
   
    if(value == 'Party Vehicle' && data.vehicle_others_type == '2'){
      return 'D2R Vehicle'
    } else {
      return value
    }
    
  } 

  /* Set Default Date (Today) in a Variable State */
  const [defaultDate, setDefaultDate] = React.useState([
    new Date(getCurrentDate('-')),
    new Date(getCurrentDate('-')),
  ])

  useEffect(() => {
    console.log(defaultDate)
    if (defaultDate) {
      setFetch(true)
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

  const getDateTime = (myDateTime, type=0) => {
    if(myDateTime == null){
      return '-'
    }
    let myTime = '-'
    if(type == 1){
      myTime = new Date(myDateTime).toLocaleTimeString('en-US',{ hour: '2-digit', minute: '2-digit' });
    } else if(type == 2){
      myTime = new Date(myDateTime).toLocaleDateString('en-US',{ month: 'short', year: 'numeric' });
    } else {
      myTime = new Date(myDateTime).toLocaleString('en-US');
    }
    
    return myTime
  }

  const closureStatusCheck = (code,type) => {
    let status = 'Not Completed'
    if(type == 1){ /* Expense Closure */
      if(code >= 1){
        status = 'Completed'
      }
    } else if(type == 2){ /* Income Closure */
      if(code >= 3){
        status = 'Completed'
      }
    } else { /* Settlement Closure */
      if(code == 6){
        status = 'Completed'
      } else if(code == 5){
        status = 'Partially Completed'
      }
    }

    return status
  }

  const vehicle_current_position_array =
  [
    "",                                 /*0*/
    "Parking Yard Gate In",             /*1*/
    "Vehicle Inspection Completed",     /*2*/
    "Vehicle Inspection Rejected",      /*3*/
    "Vehicle Maintenance Started",      /*4*/
    "Vehicle Maintenance Ended",        /*5*/
    "RMSTO Vehicle Taken",              /*6*/
    "OTHERS Vehicle Taken",             /*7*/
    "Document Verification Completed",  /*8*/
    "Document Verification Rejected",   /*9*/
    "-","-","-","-","-","-",                  /*10 - 15*/
    "Tripsheet Created",                /*16*/
    "Tripsheet Cancelled",              /*17*/
    "Advance Payment Completed","",     /*18,19*/
    "NLFD Shipment Created",            /*20*/
    "NLFD Shipment Deleted",            /*21*/
    "NLFD Shipment Completed",          /*22*/
    "NLCD Shipment Created",            /*23*/
    "NLCD Shipment Deleted",            /*24*/
    "NLCD Shipment Completed",          /*25*/
    "Expense Closure Completed",        /*26*/  
    "Income Closure Completed",         /*27*/
    "Settlement Closure Completed",     /*28*/    
    "-","-","-","-","-","-",            /*29 - 34*/   
    "RJ Sale Order Created","",         /*35,36*/
    "Diesle Indent Completed","",       /*37*/
    "Diesle Indent Confirmed","",       /*39*/
    "Diesle Indent Approved","",        /*41*/
  ]

  const loadTripShipmentDeliveryReport = (cid,fresh_type = '') => {
    /*================== User Location Fetch ======================*/
    const user_info_json = localStorage.getItem('user_info')
    const user_info = JSON.parse(user_info_json)
    var user_locations = []

    /* Get User Locations From Local Storage */
    user_info.location_info.map((data, index) => {
      user_locations.push(data.id)
    })

    /* FPFPFP - FJ_POD_FILE_PATH_FRONT_PART */
    const FPFPFP = APIURL.substring(0,APIURL.lastIndexOf("api/v1/"))
    /* FPFPBP - FJ_POD_FILE_PATH_BACK_PART */
    // const FPFPBP = 'storage/TripsheetClosure/POD/FJ/' /* Local Server */
    const FPFPBP = 'public/storage/TripsheetClosure/POD/FJ/' /* Quality & Production Server */

    const Global_Fjpodcopy_Url = FPFPFP+FPFPBP
    const DELIVERY_STATUS = ['','CREATED','DELETED','PGI DONE']
    const SHIPMENT_STATUS = ['','CREATED','UPDATED BY USER','UPDATED BY SAP','DELETED','COMPLETED']

    if (fresh_type !== '1') {
      // console.log(user_locations)
      /*================== User Location Fetch ======================*/

      VehicleAssignmentService.getInvoiceAttachmentReortData(cid).then((res) => {
        
        tableReportData = res.data ? JSON.parse(res.data) : []      
        console.log(tableReportData,'getInvoiceAttachmentReortData1')
        setFetch(true)
        let rowDataList = []
        let filterData = tableReportData.filter(
          (data) => data
        )
        console.log(filterData,'getInvoiceAttachmentReortData2')
        setSearchFilterData(filterData)
        filterData.map((data, index) => { 
          rowDataList.push({
            sno: index + 1,
            Tripsheet_No: data.trip_sheet_no,    
            TS_DT: formatDate(data.created_at),
            // ts_time: getDateTime(data.created_at,1),
            ts_month: getDateTime(data.created_at,2),   
            tripsheet_status:(
              data.tripsheet_open_status == ACTION.TRIPSHEET_CREATED
                ? 'TS Created'
                : data.tripsheet_open_status == ACTION.TRIPSHEET_ASSIGNED
                ? 'TS Assigned'
                // : data.tripsheet_open_status == ACTION.TRIPSHEET_CONFIRMED && data.vehicle_current_position == '17'
                // ? 'TS Cancelled'
                : data.tripsheet_open_status == ACTION.TRIPSHEET_CONFIRMED && (data.vehicle_current_position == '17' || data.vehicle_current_position == '21' || data.vehicle_current_position == '24')
                ? 'TS Cancelled'
                : data.tripsheet_open_status == ACTION.TRIPSHEET_CONFIRMED
                ? 'TS Closed'
                :'TS Rejected'
            ),
            vehicle_previous_status: vehicle_current_position_array[data.vehicle_current_position],              
            Shipment_No: data.shipment_no,
            Sh_DT: formatDate(data.shipment_created_at),
            Shipment_Status: SHIPMENT_STATUS[data.shipment_status], 
            Vehicle_Type: vehicleType(data.vehicle_type,data),
            Vehicle_No: data.vehicle_number,
            Exp_Booked_Status: data.tripsheet_is_settled ? closureStatusCheck(data.tripsheet_is_settled,1) : 'Not Completed',
            Exp_Booked_Dt: data.expense_created_at ? formatDate(data.expense_created_at) : '-', 
            Settlement_Status: data.tripsheet_is_settled ? closureStatusCheck(data.tripsheet_is_settled,3) : 'Not Completed',
            Settlement_Closure_Dt: data.settled_at ? formatDate(data.settled_at) : '-', 
            // SO_NO: soDetailsFinder(data.sale_order_info_updated,1),
            Delivery_No:data.delivery_no,
            // Delivery_Qty:data.delivery_net_qty ? data.delivery_net_qty : data.delivery_qty,              
            Delivery_Status:DELIVERY_STATUS[data.delivery_status],
            // Delivery_Line_Item_Count:data.total_line_item,
            Invoice_No:data.invoice_no ? data.invoice_no : '-',
            Inco_Term:data.inco_term_id ? getIncoTermNameByCode(data.inco_term_id) : '-',
            // Invoice_Qty:data.invoice_quantity ? `${data.invoice_quantity} ${data.invoice_uom}` : '-',
            Invoice_Attachment_Copy: data.fj_pod_copy && data.fj_pod_copy != '' ? (
              <a style={{color:'black'}} target='_blank' rel="noreferrer" href={Global_Fjpodcopy_Url+data.fj_pod_copy}>
                <i className="fa fa-eye" aria-hidden="true"></i>
              </a>
            ) : '-',
            Attachment_Status: data.fj_pod_copy && data.fj_pod_copy != '' ? 'Completed' : 'Not Completed',
            Customer_Name: customerDetailsFinder(data.customer_info_updated,1),
            Customer_Code: customerDetailsFinder(data.customer_info_updated,2),
            Customer_City: customerDetailsFinder(data.customer_info_updated,3),
            Vendor_Code: data.vendor_code ? data.vendor_code : '-',
            Vendor_Name: data.owner_name ? data.owner_name : '-',          
            Shed_Name: data.shed_name ? data.shed_name : '-',
            Driver_Name: data.driver_name,
            Driver_Mobile_Number: data.driver_number,
            // Shipment_Qty: data.billed_net_qty ? data.billed_net_qty : (data.shipment_net_qty ? data.shipment_net_qty : data.shipment_qty), 
            // Remarks: data.remarks ? data.remarks : '-',
            // Creation_Time: formatDate(data.created_at)
              
          })
           
          
        })
        setFetch(true)
        setRowData(rowDataList)
        setPending(true)
      })
    } else {
      if (defaultDate == null) {
        toast.warning('Date Filter Should not be empty..!')
        return false
      } else if (
        defaultDate == null &&
        reportVehicle == 0 &&
        // reportVehicleType == 0 &&
        reportShipmentNo == 0 &&
        reportDeliveryNo == 0 &&
        reportTSNo == 0 &&
        reportShipmentStatus == 0 &&
        reportDeliveryStatus == 0
      ) {
        toast.warning('Choose atleast one filter type..!')
        return false
      }
      let report_form_data = new FormData()
      report_form_data.append('date_between', defaultDate)
      report_form_data.append('vehicle_no', reportVehicle)
      report_form_data.append('cid', currentProcessId)
      // report_form_data.append('vehicle_type', reportVehicleType)
      report_form_data.append('shipment_no', reportShipmentNo)
      report_form_data.append('delivery_no', reportDeliveryNo)
      report_form_data.append('tripsheet_no', reportTSNo) 
      report_form_data.append('shipment_status', reportShipmentStatus)
      report_form_data.append('delivery_status', reportDeliveryStatus)
      report_form_data.append('division', 1)

      console.log(defaultDate, 'defaultDate')
      console.log(reportVehicle, 'reportVehicle')
      console.log(currentProcessId, 'currentProcessId')
      console.log(reportShipmentNo, 'reportShipmentNo')
      console.log(reportDeliveryNo, 'reportDeliveryNo')
      console.log(reportTSNo, 'reportTSNo')
      console.log(reportShipmentStatus, 'reportShipmentStatus')
      console.log(reportDeliveryStatus, 'reportDeliveryStatus')
 
      VehicleAssignmentService.sentInvoiceAttachmentReortDataForReport(report_form_data).then((res) => {
        console.log(res, 'res')
        let tableReportData = res.data ? JSON.parse(res.data) : []  
        console.log(tableReportData,'sentShipmentDeliveryDataForReport')

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
            Tripsheet_No: data.trip_sheet_no, 
            TS_DT: formatDate(data.created_at),
            // ts_time: getDateTime(data.created_at,1),
            ts_month: getDateTime(data.created_at,2),   
            tripsheet_status:(
              data.tripsheet_open_status == ACTION.TRIPSHEET_CREATED
                ? 'TS Created'
                : data.tripsheet_open_status == ACTION.TRIPSHEET_ASSIGNED
                ? 'TS Assigned'
                // : data.tripsheet_open_status == ACTION.TRIPSHEET_CONFIRMED && data.vehicle_current_position == '17'
                // ? 'TS Cancelled'
                : data.tripsheet_open_status == ACTION.TRIPSHEET_CONFIRMED && (data.vehicle_current_position == '17' || data.vehicle_current_position == '21' || data.vehicle_current_position == '24')
                ? 'TS Cancelled'
                : data.tripsheet_open_status == ACTION.TRIPSHEET_CONFIRMED
                ? 'TS Closed'
                :'TS Rejected'
            ),
            vehicle_previous_status: vehicle_current_position_array[data.vehicle_current_position],             
            Shipment_No: data.shipment_no,
            Sh_DT: formatDate(data.shipment_created_at),
            Shipment_Status: SHIPMENT_STATUS[data.shipment_status], 
            Vehicle_Type: vehicleType(data.vehicle_type,data),
            Vehicle_No: data.vehicle_number,
            Exp_Booked_Status: data.tripsheet_is_settled ? closureStatusCheck(data.tripsheet_is_settled,1) : 'Not Completed',
            Exp_Booked_Dt: data.expense_created_at ? formatDate(data.expense_created_at) : '-', 
            Settlement_Status: data.tripsheet_is_settled ? closureStatusCheck(data.tripsheet_is_settled,3) : 'Not Completed',
            Settlement_Closure_Dt: data.settled_at ? formatDate(data.settled_at) : '-', 
            // SO_NO: soDetailsFinder(data.sale_order_info_updated,1),
            Delivery_No:data.delivery_no,
            // Delivery_Qty:data.delivery_net_qty ? data.delivery_net_qty : data.delivery_qty,              
            Delivery_Status:DELIVERY_STATUS[data.delivery_status],
            // Delivery_Line_Item_Count:data.total_line_item,
            Invoice_No:data.invoice_no ? data.invoice_no : '-',
            Inco_Term:data.inco_term_id ? getIncoTermNameByCode(data.inco_term_id) : '-',
            // Invoice_Qty:data.invoice_quantity ? `${data.invoice_quantity} ${data.invoice_uom}` : '-',
            Invoice_Attachment_Copy: data.fj_pod_copy && data.fj_pod_copy != '' ? (
              <a style={{color:'black'}} target='_blank' rel="noreferrer" href={Global_Fjpodcopy_Url+data.fj_pod_copy}>
                <i className="fa fa-eye" aria-hidden="true"></i>
              </a>
            ) : '-',
            Attachment_Status: data.fj_pod_copy && data.fj_pod_copy != '' ? 'Completed' : 'Not Completed',
            Customer_Name: customerDetailsFinder(data.customer_info_updated,1),
            Customer_Code: customerDetailsFinder(data.customer_info_updated,2),
            Customer_City: customerDetailsFinder(data.customer_info_updated,3),
            Vendor_Code: data.vendor_code ? data.vendor_code : '-',
            Vendor_Name: data.owner_name ? data.owner_name : '-',          
            Shed_Name: data.shed_name ? data.shed_name : '-',
            Driver_Name: data.driver_name,
            Driver_Mobile_Number: data.driver_number,
            // Shipment_Qty: data.billed_net_qty ? data.billed_net_qty : (data.shipment_net_qty ? data.shipment_net_qty : data.shipment_qty), 
            // Remarks: data.remarks ? data.remarks : '-',
            // Creation_Time: formatDate(data.created_at)
          })
        })
        setRowData(rowDataList)
        setPending(true)
      })
    }
  }

  const columns = [
    {
      name: 'S.No',
      selector: (row) => row.sno,
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
      name: 'Month',
      selector: (row) => row.ts_month,
      sortable: true,
      center: true,
    },
    {
      name: 'Veh. Prv. Status',
      selector: (row) => row.vehicle_previous_status,
      sortable: true,
      center: true,
    },
    {
      name: 'Vehicle Type',
      selector: (row) => row.Vehicle_Type,
      sortable: true,
      center: true,
    },
    {
      name: 'Exp. Book. Status',
      selector: (row) => row.Exp_Booked_Status,
      sortable: true,
      center: true,
    },
    {
      name: 'Exp. Book. Date',
      selector: (row) => row.Exp_Booked_Dt,
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
      name: 'Del. Status',
      selector: (row) => row.Delivery_Status,
      sortable: true,
      center: true,
    }, 
    {
      name: 'Inco Term',
      selector: (row) => row.Inco_Term,
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
      name: 'Invoice Copy',
      selector: (row) => row.Invoice_Attachment_Copy,
      center: true,
    },
    {
      name: 'Attach. Status',
      selector: (row) => row.Attachment_Status,
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

  const [headEnable, setHeadEnable] = useState(true)
  const [currentProcessId, setCurrentProcessId] = useState(0)

  const assignValues = (id) => {
    console.log(id,'assignValues-id')
    if(id !=0){
      setHeadEnable(false)
    }
    setCurrentProcessId(id)
    setFetch(false)
    loadTripShipmentDeliveryReport(id)

    setReportShipmentNo(0)
    setReportShipmentStatus(0)
    setReportDeliveryNo(0)
    setReportDeliveryStatus(0)
    setReportVehicle(0)
    setReportTSNo(0) 
  }

  const cid_array = ['','NLFD - Own Vehicles','NLFD - Hire Vehicles','NLCD - Own Vehicles','NLCD - Hire Vehicles','Party Vehicles']

  // useEffect(() => {
  //   loadTripShipmentDeliveryReport() 
  // }, [currentProcessId != 0])

  return (
    <>
      {!fetch && <Loader />}
      {fetch && (
        
        <CCard className="mt-4">
          {headEnable && (
            <CRow className="mt-3">
              <CCol xs={12} md={6}>
                <div className="p-3">
                  <CInputGroup className="mb-3">
                    <CInputGroupText component="label" htmlFor="inputGroupSelect01">
                      Report Type
                    </CInputGroupText>

                    <CFormSelect
                      id="inputGroupSelect01"
                      onchange
                      onChange={(e) => {
                        assignValues(e.target.value)
                      }}
                      value={currentProcessId}
                    >
                      <option value={0}>Select...</option>

                      <option value={1}> NLFD - Own Vehicles </option>
                      <option value={2}> NLFD - Hire Vehicles </option>
                      <option value={3}> NLCD - Own Vehicles </option>
                      <option value={4}> NLCD - Hire Vehicles </option>
                      <option value={5}> Party Vehicles </option>

                    </CFormSelect>
                  </CInputGroup>
                </div>
              </CCol>
            </CRow>
          )}
          {!headEnable && (
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
                <IASearchSelectComponent
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
                <IASearchSelectComponent
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
              {/* <CCol xs={12} md={3}>
                <CFormLabel htmlFor="VNum">Vehicle Type</CFormLabel>
                <IASearchSelectComponent
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
              </CCol> */}

              <CCol xs={12} md={3}>
                <CFormLabel htmlFor="VNum">Shipment Number</CFormLabel>
                <IASearchSelectComponent
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
                <CFormLabel htmlFor="VNum">Shipment Status</CFormLabel>
                <IASearchSelectComponent
                  size="sm"
                  className="mb-2"
                  onChange={(e) => {
                    onChangeFilter(e, 'shipment_status')
                  }}
                  label="Select Shipment Status"
                  noOptionsMessage="Status Not found"
                  search_type="invoice_report_shipment_status"
                  search_data={searchFilterData}
                />
              </CCol>

              <CCol xs={12} md={3}>
                <CFormLabel htmlFor="VNum">Delivery Number</CFormLabel>
                <IASearchSelectComponent
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
                <CFormLabel htmlFor="VNum">Delivery Status</CFormLabel>
                <IASearchSelectComponent
                  size="sm"
                  className="mb-2"
                  onChange={(e) => {
                    onChangeFilter(e, 'delivery_status')
                  }}
                  label="Select Delivery Status"
                  noOptionsMessage="Status Not found"
                  search_type="invoice_report_delivery_status"
                  search_data={searchFilterData}
                />
              </CCol>
              <CCol xs={12} md={3}>
                <CFormLabel htmlFor="VNum">Report Entry Type</CFormLabel>
                  <CFormInput size="sm" id="dName" value={cid_array[currentProcessId]} readOnly />
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
                  color="secondary"
                  className="mx-3 px-3 text-white"
                  onClick={() => {
                    setHeadEnable(true)
                    setCurrentProcessId(0)
                  }}
                >
                  Back
                </CButton>
                <CButton
                  size="sm"
                  color="primary"
                  className="mx-3 px-3 text-white"
                  onClick={() => {
                    setFetch(false)
                    loadTripShipmentDeliveryReport(currentProcessId,'1')
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
          )}
        </CCard>
      )}
    </>
  )
}

export default InvoiceAttachmentReport
