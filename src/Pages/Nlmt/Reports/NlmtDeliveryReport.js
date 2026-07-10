import React, { useState, useEffect } from 'react'
import {
  CButton,
  CCard,
  CRow,
  CCol, 
  CContainer, 
  CFormLabel,
} from '@coreui/react'  
import CustomTable from 'src/components/customComponent/CustomTable' 
import { toast } from 'react-toastify'
import Loader from 'src/components/Loader'
import { DateRangePicker } from 'rsuite' 
import FileSaver from 'file-saver'
import * as XLSX from 'xlsx'; 
import { APIURL } from 'src/App'
import { useRef } from 'react'
import { useReactToPrint } from 'react-to-print'  
import DefinitionsListApi from 'src/Service/Definitions/DefinitionsListApi' 
import NlmtIASearchSelectComponent from './NlmtIASearchSelectComponent' 
import { GetDateTimeFormat } from '../CommonMethods/CommonMethods'
import NlmtVehicleAssignmentService from 'src/Service/Nlmt/VehicleAssignment/NlmtVehicleAssignmentService'
import * as NlmtScreenAccessCodes from 'src/components/constants/NlmtScreenAccessCodes'
import JavascriptInArrayComponent from 'src/components/commoncomponent/JavascriptInArrayComponent'
import AccessDeniedComponent from 'src/components/commoncomponent/AccessDeniedComponent'

const NlmtDeliveryReport = () => {

  /*================== User Location Fetch ======================*/
    const user_info_json = localStorage.getItem('user_info')
    const user_info = JSON.parse(user_info_json)
    const user_locations = []
  
    /* Get User Locations From Local Storage */
    user_info.location_info.map((data, index) => {
      user_locations.push(data.id)
    })
  
    /* Get User Id From Local Storage */
    const user_id = user_info.user_id
  
    // console.log(user_locations)
    /*================== User Location Fetch ======================*/
  
    /* ==================== Access Part Start ========================*/
     const [screenAccess, setScreenAccess] = useState(false)
     let page_no = NlmtScreenAccessCodes.NlmtReportScreens.NLMT_Delivery_Report
  
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
    let fileName='NLMT_Delivery_Report_'+dateTimeString
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

  let tableData = []
  let tableReportData = []

  const vehicleType = (id, data) => {
    console.log(data,'vehicleType-data')
    if (id == 21) {
      return 'Own'
    } else if (id == 22) {
      return 'Hire'
    } else { 
        return 'Party'
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

  const loadTripShipmentDeliveryReport = (fresh_type = '') => {
    /*================== User Location Fetch ======================*/
    const user_info_json = localStorage.getItem('user_info')
    const user_info = JSON.parse(user_info_json)
    var user_locations = []

    /* Get User Locations From Local Storage */
    user_info.location_info.map((data, index) => {
      user_locations.push(data.id)
    })

    /* FPFPFP - FJ_POD_FILE_PATH_FRONT_PART */
    const FPFPFP = APIURL.substring(0,APIURL.lastIndexOf("api/v1"))
    /* FPFPBP - FJ_POD_FILE_PATH_BACK_PART */
    // const FPFPBP = 'storage/TripsheetClosure/POD/FJ/' /* Local Server */
    const FPFPBP = 'public/storage/TripsheetClosure/POD/FJ/' /* Quality & Production Server */

    const Global_Fjpodcopy_Url = FPFPFP+FPFPBP
    const DELIVERY_STATUS = ['','CREATED','DELETED','PGI DONE']
    const SHIPMENT_STATUS = ['','CREATED','UPDATED BY USER','UPDATED BY SAP','DELETED','COMPLETED']

    if (fresh_type !== '1') {
      // console.log(user_locations)
      /*================== User Location Fetch ======================*/

      NlmtVehicleAssignmentService.getNlmtShipmentDeliveryDataForReport().then((res) => {
        
        tableReportData = res.data ? JSON.parse(res.data) : []      
        console.log(tableReportData,'getNlmtShipmentDeliveryDataForReport1')
        setFetch(true)
        let rowDataList = []
        let filterData = tableReportData.filter(
          (data) => data
        )
        console.log(filterData,'getNlmtShipmentDeliveryDataForReport2')
        setSearchFilterData(filterData)
        filterData.map((data, index) => { 
          rowDataList.push({
            sno: index + 1,
            Tripsheet_No: data.nlmt_tripsheet_no,               
            Shipment_No: data.shipment_no,
            Shipment_Status: SHIPMENT_STATUS[data.shipment_status], 
            Vehicle_Type: vehicleType(data.vehicle_type_id,data),
            Vehicle_No: data.vehicle_number,
            SO_NO: soDetailsFinder(data.sale_order_info_updated,1),
            Delivery_No:data.delivery_no,
            Delivery_Qty:data.delivery_net_qty ? data.delivery_net_qty : data.delivery_qty,              
            Delivery_Status:DELIVERY_STATUS[data.delivery_status],
            Delivery_Line_Item_Count:data.total_line_item,
            Invoice_No:data.invoice_no ? data.invoice_no : '-',
            Inco_Term:data.inco_term_id ? getIncoTermNameByCode(data.inco_term_id) : '-',
            Invoice_Qty:data.invoice_quantity ? `${data.invoice_quantity} ${data.invoice_uom}` : '-',
            // Invoice_Attachment_Copy: data.fj_pod_copy && data.fj_pod_copy != '' ? (
            //   <a style={{color:'black'}} target='_blank' rel="noreferrer" href={Global_Fjpodcopy_Url+data.fj_pod_copy}>
            //     <i className="fa fa-eye" aria-hidden="true"></i>
            //   </a>
            // ) : '-',
            Customer_Name: customerDetailsFinder(data.customer_info_updated,1),
            Customer_Code: customerDetailsFinder(data.customer_info_updated,2),
            Customer_City: customerDetailsFinder(data.customer_info_updated,3),
            Driver_Name: data.driver_name,
            Driver_Mobile_Number: data.driver_number,
            Shipment_Qty: data.billed_net_qty ? data.billed_net_qty : (data.shipment_net_qty ? data.shipment_net_qty : data.shipment_qty), 
            Remarks: data.remarks ? data.remarks : '-',
            Creation_Time: formatDate(data.created_at)
              
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
        reportVehicleType == 0 &&
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
      report_form_data.append('vehicle_type', reportVehicleType)
      report_form_data.append('shipment_no', reportShipmentNo)
      report_form_data.append('delivery_no', reportDeliveryNo)
      report_form_data.append('tripsheet_no', reportTSNo) 
      report_form_data.append('shipment_status', reportShipmentStatus)
      report_form_data.append('delivery_status', reportDeliveryStatus)
      report_form_data.append('division', 1)

      console.log(defaultDate, 'defaultDate')
      console.log(reportVehicle, 'reportVehicle')
      console.log(reportVehicleType, 'reportVehicleType')
      console.log(reportShipmentNo, 'reportShipmentNo')
      console.log(reportDeliveryNo, 'reportDeliveryNo')
      console.log(reportTSNo, 'reportTSNo')
      console.log(reportShipmentStatus, 'reportShipmentStatus')
      console.log(reportDeliveryStatus, 'reportDeliveryStatus')

      NlmtVehicleAssignmentService.sentNlmtShipmentDeliveryDataForReport(report_form_data).then((res) => {
        console.log(res, 'res')
        let tableReportData = res.data ? res.data : []  
        console.log(tableReportData,'sentNlmtShipmentDeliveryDataForReport')

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
            Tripsheet_No: data.nlmt_tripsheet_no,               
            Shipment_No: data.shipment_no,
            Shipment_Status: SHIPMENT_STATUS[data.shipment_status], 
            Vehicle_Type: vehicleType(data.vehicle_type_id,data),
            Vehicle_No: data.vehicle_number,
            SO_NO: soDetailsFinder(data.sale_order_info_updated,1),
            Delivery_No:data.delivery_no,
            Delivery_Qty:data.delivery_net_qty ? data.delivery_net_qty : data.delivery_qty,              
            Delivery_Status:DELIVERY_STATUS[data.delivery_status],
            Delivery_Line_Item_Count:data.total_line_item,
            Invoice_No:data.invoice_no ? data.invoice_no : '-',
            Inco_Term:data.inco_term_id ? getIncoTermNameByCode(data.inco_term_id) : '-',
            Invoice_Qty:data.invoice_quantity ? `${data.invoice_quantity} ${data.invoice_uom}` : '-',
            // Invoice_Attachment_Copy: data.fj_pod_copy && data.fj_pod_copy != '' ? (
            //   <a style={{color:'black'}} target='_blank' rel="noreferrer" href={Global_Fjpodcopy_Url+data.fj_pod_copy}>
            //     <i className="fa fa-eye" aria-hidden="true"></i>
            //   </a>
            // ) : '-',
            Customer_Name: customerDetailsFinder(data.customer_info_updated,1),
            Customer_Code: customerDetailsFinder(data.customer_info_updated,2),
            Customer_City: customerDetailsFinder(data.customer_info_updated,3),
            Driver_Name: data.driver_name,
            Driver_Mobile_Number: data.driver_number,
            Shipment_Qty: data.billed_net_qty ? data.billed_net_qty : (data.shipment_net_qty ? data.shipment_net_qty : data.shipment_qty), 
            Remarks: data.remarks ? data.remarks : '-',
            Creation_Time: formatDate(data.created_at)
          })
        })
        setRowData(rowDataList)
        setPending(true)
      })
    }
  }

  useEffect(() => {
    loadTripShipmentDeliveryReport() 
  }, [incoTermData.length==0])

  const columns = [
    {
      name: 'S.No',
      selector: (row) => row.sno,
      sortable: true,
      center: true,
    },
    {
      name: 'TripSheet',
      selector: (row) => row.Tripsheet_No,
      sortable: true,
      center: true,
    },
    {
      name: 'Vehicle',
      selector: (row) => row.Vehicle_No,
      sortable: true,
      center: true,
    },
    {
      name: 'Veh. Type',
      selector: (row) => row.Vehicle_Type,
      sortable: true,
      center: true,
    },
    {
      name: 'Shipment',
      selector: (row) => row.Shipment_No,
      sortable: true,
      center: true,
    },
    {
      name: 'Status',
      selector: (row) => row.Shipment_Status,
      sortable: true,
      center: true,
    },
    {
      name: 'Date',
      selector: (row) => row.Creation_Time,
      sortable: true,
      center: true,
    },
     
    {
      name: 'Delivery',
      selector: (row) => row.Delivery_No,
      sortable: true,
      center: true,
    },
    {
      name: 'Status',
      selector: (row) => row.Delivery_Status,
      sortable: true,
      center: true,
    },
    {
      name: 'Del. Qty',
      selector: (row) => row.Delivery_Qty,
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
      name: 'Inv. Qty.',
      selector: (row) => row.Invoice_Qty,
      sortable: true,
      center: true,
    },
    {
      name: 'Inco Term',
      selector: (row) => row.Inco_Term,
      sortable: true,
      center: true,
    },
    // {
    //   name: 'Invoice Copy',
    //   selector: (row) => row.Invoice_Attachment_Copy,
    //   center: true,
    // },
    {
      name: 'SO No',
      selector: (row) => row.SO_NO,
      sortable: true,
      center: true,
    },
    {
      name: 'Customer',
      selector: (row) => row.Customer_Name,
      sortable: true,
      center: true,
    },
    {
      name: 'Code',
      selector: (row) => row.Customer_Code,
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
      name: 'Driver',
      selector: (row) => row.Driver_Name,
      sortable: true,
      center: true,
    },
    {
      name: 'Cell No.',
      selector: (row) => row.Driver_Mobile_Number,
      sortable: true,
      center: true,
    },
    {
      name: 'Ship. Qty.',
      selector: (row) => row.Shipment_Qty,
      sortable: true,
      center: true,
    },    
    {
      name: 'Remarks',
      selector: (row) => row.Remarks,
      sortable: true,
      center: true,
    }
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

  const componentRef = useRef();
    const handleprint = useReactToPrint({
      content : () => componentRef.current,
    });
    function printReceipt() {
      window.print();
    }

  return (
    <>
      {!fetch && <Loader />}
      {fetch && (
        <>
          {screenAccess ? (
            <>
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
                      <NlmtIASearchSelectComponent
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
                      <NlmtIASearchSelectComponent
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
                      <NlmtIASearchSelectComponent
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
                      <NlmtIASearchSelectComponent
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
                      <NlmtIASearchSelectComponent
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
                      <NlmtIASearchSelectComponent
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
                      <NlmtIASearchSelectComponent
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
            </>
          ) : (
            <AccessDeniedComponent />
          )}
        </>
      )}
    </>
  )
}

export default NlmtDeliveryReport
