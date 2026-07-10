import React, { useState, useEffect } from 'react'
import {
  CButton,
  CCard,
  CRow,
  CCol,
  CAlert,
  CContainer,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CFormLabel,
} from '@coreui/react'
import VehicleAssignmentService from 'src/Service/VehicleAssignment/VehicleAssignmentService'
import { Link, useNavigate } from 'react-router-dom'
import CustomTable from 'src/components/customComponent/CustomTable'
import TripStoService from 'src/Service/TripSTO/TripStoService'
import { ToastContainer, toast } from 'react-toastify'
import Loader from 'src/components/Loader'
import { DateRangePicker } from 'rsuite' 
import FileSaver from 'file-saver'
import * as XLSX from 'xlsx';
import { GetDateTimeFormat } from '../Depo/CommonMethods/CommonMethods'
import { APIURL } from 'src/App'
import { useRef } from 'react'
import { useReactToPrint } from 'react-to-print' 
import IASearchSelectComponent from './IASearchSelectComponent'
import DefinitionsListApi from 'src/Service/Definitions/DefinitionsListApi'
import JavascriptInArrayComponent from 'src/components/commoncomponent/JavascriptInArrayComponent'

const HVITWFreightReport = () => {
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
    } else if (event_type == 'delivery_no') {
      if (selected_value) {
        setReportDeliveryNo(selected_value)
      } else {
        setReportDeliveryNo(0)
      }
    }  
  }

  const exportToCSV = () => {
    console.log(rowData,'exportCsvData')
    let dateTimeString = GetDateTimeFormat(1)
    let fileName='HVITW_Freight_Report_'+dateTimeString
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
  const [reportTSNo, setReportTSNo] = useState(0) 
  const [reportShipmentNo, setReportShipmentNo] = useState(0)
  const [reportDeliveryNo, setReportDeliveryNo] = useState(0) 

  let tableData = []
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
      setDefaultDate(defaultDate)
    } else {
    }
  }, [defaultDate])

  function formatDate(date) {

    if(date)
    {
      var d = new Date(date),
          month = '' + (d.getMonth() + 1),
          day = '' + d.getDate(),
          year = d.getFullYear();

      if (month.length < 2)
          month = '0' + month;
      if (day.length < 2)
          day = '0' + day;

      return [day, month, year].join('-');
    } else {
      return '-'
    }
  }

  const invoiceWiseFreightFinder = (qty,frt,ic) => {
    let freight = 0
    let zero_freight_array = [381,382]
    let updated_qty = qty ? qty : 0
    let updated_frt = frt ? frt : 0
    if(JavascriptInArrayComponent(ic,zero_freight_array)){

    } else {
      freight = Number(parseFloat(updated_qty).toFixed(2)) * Number(parseFloat(updated_frt).toFixed(2))
    }
    
    let updated_freight = Number(parseFloat(freight).toFixed(2))
    console.log(updated_freight,'invoiceWiseFreightFinder-updated_freight')
    return updated_freight

  }
  const incoTermWiseFreightFinder = (jsonData,deliveryNumber) => {
    let freight = 0

    console.log(jsonData,'incoTermWiseFreightFinder-jsonData')

    if(jsonData && jsonData.length > 0){
      jsonData.map((vv,kk)=>{
        let del_array = vv.delivery_array
        console.log(del_array,'incoTermWiseFreightFinder-del_array')
        del_array.map((vv1,kk1)=>{ 
          console.log(kk1,'incoTermWiseFreightFinder-delivery_no-key')
          console.log(vv1,'incoTermWiseFreightFinder-delivery_no-val')
          if(vv1 == deliveryNumber){
            freight = Number(vv.amount) / del_array.length
            console.log(freight,'incoTermWiseFreightFinder-freight1')
          }
        })
      })
    }
    console.log(freight,'incoTermWiseFreightFinder-freight2')

    return freight

  }

  const totalFreightFinder = (parentData,shipmentNo) => {

    let freight = 0
    console.log(parentData,'parentData')
    if(parentData.length > 0){

      
      parentData.map((vv,kk)=>{

        if(vv.shipment_no == shipmentNo){
          freight = freight + incoTermWiseFreightFinder(vv.incoterm_freight_info_updated,vv.delivery_no)
        }
      })
    }

    return freight

  }

  const balanceAmount = (data) => {
    // let ba = Number(data.actual_freight) + Number(data.low_tonnage_charges) - (Number(data.advance_payment_diesel)+Number(data.advance_payment))
    let ba = Number(data.actual_freight) - (Number(data.advance_payment_diesel)+Number(data.advance_payment))
    console.log(data,'balanceAmount-data')
    console.log(ba,'balanceAmount-ba')
    return ba
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

    if (fresh_type !== '1') {
      // console.log(user_locations)
      /*================== User Location Fetch ======================*/

      VehicleAssignmentService.getShipmentHvitwFreightDataForReport().then((res) => {
        
        tableReportData = res.data ? JSON.parse(res.data) : []      
        console.log(tableReportData,'getShipmentHvitwFreightDataForReport1')
        setFetch(true)
        let rowDataList = []
        let filterData = tableReportData.filter(
          (data) => data
        )
        console.log(filterData,'getShipmentHvitwFreightDataForReport2')
        setSearchFilterData(filterData)
        filterData.map((data, index) => { 

          let current_shipment_no = 0
          let next_shipment_no = 0
          if(filterData.length > index+1){
            current_shipment_no = filterData[index].shipment_no
            next_shipment_no = filterData[index+1].shipment_no 
          }

          rowDataList.push({
            sno: index + 1,
            Tripsheet_No: data.trip_sheet_no,  
            Vehicle_Type: vehicleType(data.vehicle_type,data),   
            Vehicle_No: data.vehicle_number,
            Shipment_No: data.shipment_no,
            Shipment_Date: formatDate(data.shipment_date),
            Delivery_No:data.delivery_no ? data.delivery_no : '-', 
            Invoice_No:data.invoice_no ? data.invoice_no : '-',
            Customer_Code: customerDetailsFinder(data.customer_info_updated,2),
            Customer_Name: customerDetailsFinder(data.customer_info_updated,1),
            Customer_City: customerDetailsFinder(data.customer_info_updated,3),
            SAP_Freight: `${data.delivery_freight_amount ? data.delivery_freight_amount : '-'}`,
            Inco_Term:data.inco_term_id ? getIncoTermNameByCode(data.inco_term_id) : '-',            
            // Invoice_Qty:data.invoice_quantity ? `${data.invoice_quantity} ${data.invoice_uom}` : '-',
            Inv_Qty_In_MTS:`${data.delivery_net_qty ? data.delivery_net_qty : 0}`,
            Freight_Rate_Per_Ton:data.freight_rate_per_tone ? data.freight_rate_per_tone : '-', 
            Freight:invoiceWiseFreightFinder(data.delivery_net_qty,data.freight_rate_per_tone,data.inco_term_id),
            Ltc_Amount:'-',
            Tot_Frt_Amount:'-',
            Advance_Diesel:'-',
            Advance_Bank:'-',  
            Balance_Available:'-',           
            Freight_Remarks:'-',
            Expense_Booked_Status: '-',             
            Settlement_Booked_Status: '-',            
          })
           
          console.log(filterData.length,'getShipmentHvitwFreightDataForReport2 - filterData.length')
          console.log(index+1,'getShipmentHvitwFreightDataForReport2 - index+1')
          if(current_shipment_no != next_shipment_no || filterData.length == index+1){

            rowDataList.push({
              sno: '-',
              Tripsheet_No: data.trip_sheet_no,  
              Vehicle_Type: vehicleType(data.vehicle_type,data),   
              Vehicle_No: data.vehicle_number,
              Shipment_No: data.shipment_no,
              Shipment_Date: formatDate(data.shipment_date),
              Delivery_No:'-', 
              Invoice_No:'-',
              Customer_Code: '-',
              Customer_Name: '-',
              Customer_City: 'Total SAP Shipment Freight',
              SAP_Freight: `${data.shipment_freight_amount ? data.shipment_freight_amount : '-'}`,
              Inco_Term:'Total Shipment Billed Qty',
              Inv_Qty_In_MTS:`${data.billed_net_qty ? data.billed_net_qty : 0}`,
              Freight_Rate_Per_Ton:data.freight_rate_per_tone ? data.freight_rate_per_tone : '-', 
              Freight: totalFreightFinder(filterData,data.shipment_no),
              Ltc_Amount:data.low_tonnage_charges ? data.low_tonnage_charges : 0,
              // Tot_Frt_Amount:data.actual_freight ? Number(data.actual_freight) + Number(data.low_tonnage_charges) : 0,
              Tot_Frt_Amount:data.actual_freight ? Number(data.actual_freight) : 0,
              Advance_Diesel:data.advance_payment_diesel ? data.advance_payment_diesel : 0,
              Advance_Bank:data.advance_payment ? data.advance_payment : 0,               
              Balance_Available:balanceAmount(data), 
              Freight_Remarks: data.freight_remarks ? data.freight_remarks : '-' ,
              Expense_Booked_Status: data.tripsheet_is_settled ? (data.tripsheet_is_settled >= 3 ? 'Completed' : 'Not Completed') : 'Not Completed',             
              Settlement_Booked_Status: data.tripsheet_is_settled ? (data.tripsheet_is_settled >= 5 ? 'Completed' : 'Not Completed') : 'Not Completed',             
            })

          }
          
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
        reportShipmentNo == 0 &&
        reportDeliveryNo == 0 &&
        reportTSNo == 0 
      ) {
        toast.warning('Choose atleast one filter type..!')
        return false
      }
      let report_form_data = new FormData()
      report_form_data.append('date_between', defaultDate)
      report_form_data.append('vehicle_no', reportVehicle) 
      report_form_data.append('shipment_no', reportShipmentNo)
      report_form_data.append('delivery_no', reportDeliveryNo)
      report_form_data.append('tripsheet_no', reportTSNo)  
      report_form_data.append('division', 1)

      console.log(defaultDate, 'defaultDate')
      console.log(reportVehicle, 'reportVehicle') 
      console.log(reportShipmentNo, 'reportShipmentNo')
      console.log(reportDeliveryNo, 'reportDeliveryNo')
      console.log(reportTSNo, 'reportTSNo') 

      VehicleAssignmentService.sentShipmentHvitwFreightDataForReport(report_form_data).then((res) => {
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

          let current_shipment_no = 0
          let next_shipment_no = 0
          if(filterData.length > index+1){
            current_shipment_no = filterData[index].shipment_no
            next_shipment_no = filterData[index+1].shipment_no 
          }
          

          rowDataList.push({
            sno: index + 1,
            Tripsheet_No: data.trip_sheet_no,  
            Vehicle_Type: vehicleType(data.vehicle_type,data),   
            Vehicle_No: data.vehicle_number,
            Shipment_No: data.shipment_no,
            Shipment_Date: formatDate(data.shipment_date),
            Delivery_No:data.delivery_no ? data.delivery_no : '-', 
            Invoice_No:data.invoice_no ? data.invoice_no : '-',            
            Customer_Code: customerDetailsFinder(data.customer_info_updated,2),
            Customer_Name: customerDetailsFinder(data.customer_info_updated,1),
            Customer_City: customerDetailsFinder(data.customer_info_updated,3),
            SAP_Freight: `${data.delivery_freight_amount ? data.delivery_freight_amount : '-'}`,
            Inco_Term:data.inco_term_id ? getIncoTermNameByCode(data.inco_term_id) : '-',   
            // Invoice_Qty:data.invoice_quantity ? `${data.invoice_quantity} ${data.invoice_uom}` : '-', 
            Inv_Qty_In_MTS:`${data.delivery_net_qty ? data.delivery_net_qty : 0}`,
            Freight_Rate_Per_Ton:data.freight_rate_per_tone ? data.freight_rate_per_tone : '-', 
            Freight:invoiceWiseFreightFinder(data.delivery_net_qty,data.freight_rate_per_tone,data.inco_term_id),
            Ltc_Amount:'-',
            Tot_Frt_Amount:'-',
            Advance_Diesel:'-',
            Advance_Bank:'-',
            Balance_Available:'-',
            Freight_Remarks:'-',
            Expense_Booked_Status: '-',             
            Settlement_Booked_Status: '-', 
          })
          if(current_shipment_no != next_shipment_no || filterData.length == index+1){

            rowDataList.push({
              sno: '-',
              Tripsheet_No: data.trip_sheet_no,  
              Vehicle_Type: vehicleType(data.vehicle_type,data),   
              Vehicle_No: data.vehicle_number,
              Shipment_No: data.shipment_no,
              Shipment_Date: formatDate(data.shipment_date),
              Delivery_No:'-', 
              Invoice_No:'-',
              Customer_Code: '-',
              Customer_Name: '-',
              Customer_City: 'Total SAP Shipment Freight',
              SAP_Freight: `${data.shipment_freight_amount ? data.shipment_freight_amount : '-'}`,
              Inco_Term:'Total Shipment Billed Qty',
              Inv_Qty_In_MTS:`${data.billed_net_qty ? data.billed_net_qty : 0}`,
              Freight_Rate_Per_Ton:data.freight_rate_per_tone ? data.freight_rate_per_tone : '-', 
              Freight: totalFreightFinder(filterData,data.shipment_no),
              Ltc_Amount:data.low_tonnage_charges ? data.low_tonnage_charges : 0,
              // Tot_Frt_Amount:data.actual_freight ? Number(data.actual_freight) + Number(data.low_tonnage_charges) : 0,
              Tot_Frt_Amount:data.actual_freight ? Number(data.actual_freight) : 0,
              Advance_Diesel:data.advance_payment_diesel ? data.advance_payment_diesel : 0,
              Advance_Bank:data.advance_payment ? data.advance_payment : 0,  
              Balance_Available:balanceAmount(data), 
              Freight_Remarks: data.freight_remarks ? data.freight_remarks : '-',
              Expense_Booked_Status: data.tripsheet_is_settled ? (data.tripsheet_is_settled >= 3 ? 'Completed' : 'Not Completed') : 'Not Completed',             
              Settlement_Booked_Status: data.tripsheet_is_settled ? (data.tripsheet_is_settled >= 5 ? 'Completed' : 'Not Completed') : 'Not Completed',         
            })

          }
        })
        setRowData(rowDataList)
        setPending(true)
      })
    }
  }

  useEffect(() => {
    loadTripShipmentDeliveryReport() 
  }, [incoTermData.length > 0])

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
      name: 'Vehicle No',
      selector: (row) => row.Vehicle_No,
      sortable: true,
      center: true,
    },
    {
      name: 'Shipment No',
      selector: (row) => row.Shipment_No,
      sortable: true,
      center: true,
    }, 
     
    // {
    //   name: 'Delivery No',
    //   selector: (row) => row.Delivery_No,
    //   sortable: true,
    //   center: true,
    // },  
    {
      name: 'Invoice No',
      selector: (row) => row.Invoice_No,
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
      name: 'Invoice Qty.',
      selector: (row) => row.Inv_Qty_In_MTS,
      sortable: true,
      center: true,
    },
    
    {
      name: 'Freight',
      selector: (row) => row.Freight,
      sortable: true,
      center: true,
    }, 
    {
      name: 'Customer Name',
      selector: (row) => row.Customer_Name,
      sortable: true,
      center: true,
    },
    {
      name: 'Customer Code',
      selector: (row) => row.Customer_Code,
      sortable: true,
      center: true,
    },
    {
      name: 'Customer City',
      selector: (row) => row.Customer_City,
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
      )}
    </>
  )
}

export default HVITWFreightReport
