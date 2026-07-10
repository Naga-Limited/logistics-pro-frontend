import React, { useState, useEffect } from 'react'
import {
  CButton,
  CCard,
  CRow,
  CCol, 
  CContainer, 
  CFormLabel,
} from '@coreui/react' 
import { useNavigate } from 'react-router-dom'
import CustomTable from 'src/components/customComponent/CustomTable' 
import { toast } from 'react-toastify'
import Loader from 'src/components/Loader'
import { DateRangePicker } from 'rsuite' 
import SearchSelectComponent from 'src/components/commoncomponent/searchSelectComponent'
import FileSaver from 'file-saver'
import * as XLSX from 'xlsx';
import { GetDateTimeFormat } from '../Depo/CommonMethods/CommonMethods'
import * as LogisticsProScreenNumberConstants from 'src/components/constants/LogisticsProScreenNumberConstants'
import TripSheetClosureService from 'src/Service/TripSheetClosure/TripSheetClosureService'
import AccessDeniedComponent from 'src/components/commoncomponent/AccessDeniedComponent'
import JavascriptInArrayComponent from 'src/components/commoncomponent/JavascriptInArrayComponent'

const TripsheetPaymentReport = () => {

  /*================== User Id & Location Fetch ======================*/
  const user_info_json = localStorage.getItem('user_info')
  const user_info = JSON.parse(user_info_json)
  const user_locations = []
  const navigation = useNavigate()
  const is_admin = user_info.user_id == 1 && user_info.is_admin == 1

  if(is_admin){
    console.log(user_info)
  }

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
  let page_no = LogisticsProScreenNumberConstants.HireDeductionPaymentModule.Hire_Payment_Report_Screen

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

   if (event_type == 'tripsheet_no') {
      if (selected_value) {
        setReportTSNo(selected_value)
      } else {
        setReportTSNo(0)
      }
    } else if (event_type == 'payment_status') {
      if (selected_value) {
        setReportPaymentStatus(selected_value)
      } else {
        setReportPaymentStatus(0)
      }
    }
  }

  const exportToCSV = () => {
    if(rowData.length == 0){
      toast.warning('No Data Found..!')
      return false
    }
    console.log(rowData,'exportCsvData')
    let dateTimeString = GetDateTimeFormat(1)
    let fileName='Deduction_Payment_Report_'+dateTimeString
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';
    const ws = XLSX.utils.json_to_sheet(rowData);
    const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], {type: fileType});
    FileSaver.saveAs(data, fileName + fileExtension);
  }

  const [rowData, setRowData] = useState([])
  const [searchFilterData, setSearchFilterData] = useState([]) 
  const [fetch, setFetch] = useState(false)

  const [pending, setPending] = useState(true)

  /* Report Variables */

  const [reportTSNo, setReportTSNo] = useState(0) 
  const [reportPaymentStatus, setReportPaymentStatus] = useState(0)

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

  const loadTripPaymentReport = (fresh_type = '') => {
     

    if (fresh_type !== '1') {

      TripSheetClosureService.getPaymentDataForReport().then((res) => {
        tableReportData = res.data.data
        console.log(tableReportData,'getPaymentDataForReport')

        setFetch(true)
        let rowDataList = []

        setSearchFilterData(tableReportData)
        tableReportData.map((data, index) => {
          rowDataList.push({
            sno: index + 1,
            Tripsheet_No: data.trip_sheet_info.trip_sheet_no,
            Tripsheet_Date: data.trip_sheet_info.created_date,
            Vendor_Name: data.vendor_name,
            Vendor_Code: data.vendor_code,
            Vehicle_No: data.parking_yard_info.vehicle_number,
            Driver_Name: data.parking_yard_info.driver_name,
            Driver_Mobile_Number: data.parking_yard_info.driver_contact_number,
            Previous_Vendor_Outstanding: data.previous_vendor_outstanding ? data.previous_vendor_outstanding : '--',
            Current_Vendor_Outstanding: data.current_vendor_outstanding ? data.current_vendor_outstanding : '--',
            Sap_Trip_Expense_Amount: data.sap_trip_expense_amount,
            Status: data.status == '1' ? 'Deduction Completed': 'Payment Completed',
            Unloading_Deduction_Amount: data.unloading_deduction,
            Subdelivery_Deduction_Amount: data.subdelivery_deduction,
            Weighment_Deduction_Amount: data.weighment_deduction,
            Freight_Deduction_Amount: data.freight_deduction,
            Diversion_Return_Deduction_Amount: data.diversion_return_deduction,
            Halting_Deduction_Amount: data.halting_deduction,
            Toll_Deduction_Amount: data.toll_deduction,
            Total_Deduction_Amount: data.total_deduction ? data.total_deduction : '--',
            Deduction_Remarks: data.deduction_remarks ? data.deduction_remarks : '--',
            Deduction_Posting_Date: data.deduction_posting_date ? data.deduction_posting_date : '--',
            Sap_Deduction_Doc_No: data.sap_deduction_doc_no ? data.sap_deduction_doc_no : '--',
            Posted_Balance_Payment: data.posted_balance_payment ? data.posted_balance_payment : '--',
            Payment_Remarks: data.payment_remarks ? data.payment_remarks : '--',
            Payment_Posting_Date: data.payment_posting_date ? data.payment_posting_date : '--',
            Sap_Payment_Doc_No: data.sap_payment_doc_no ? data.sap_payment_doc_no : '--',
            Payment_Created_By: data.payment_created_by ? data.payment_user_info.emp_name : '--',
            payment_creation_time: data.payment_creation_time_format ? data.payment_creation_time_format : '--',
            Created_By: data.sap_deduction_doc_no ? data.deduction_user_info.emp_name : data.payment_user_info.emp_name,
            Creation_Time: data.created_at_format,
          })
        })
        setFetch(true)
        setRowData(rowDataList)
        setPending(false)
      })
    } else {
      if (defaultDate == null) {
        toast.warning('Date Filter Should not be empty..!')
        return false
      } else if (
        defaultDate == null &&
        reportTSNo == 0 &&
        reportPaymentStatus == 0
      ) {
        toast.warning('Choose atleast one filter type..!')
        return false
      }
      let report_form_data = new FormData()
      report_form_data.append('date_between', defaultDate)
      report_form_data.append('tripsheet_no', reportTSNo)
      report_form_data.append('status', reportPaymentStatus)
      report_form_data.append('user_id', user_id)
      console.log(defaultDate, 'defaultDate')
      console.log(reportTSNo, 'reportTSNo')
      console.log(reportPaymentStatus, 'reportPaymentStatus')

      TripSheetClosureService.sentPaymentDataForReport(report_form_data).then((res) => {
        console.log(res, 'res')
        tableReportData = res.data.data
        console.log(tableReportData)

        setFetch(true)
        let rowDataList = []
        let filterData = tableReportData
        setSearchFilterData(filterData)
        filterData.map((data, index) => {
          rowDataList.push({
            sno: index + 1,
            Tripsheet_No: data.trip_sheet_info.trip_sheet_no,
            Tripsheet_Date: data.trip_sheet_info.created_date,
            Vendor_Name: data.vendor_name,
            Vendor_Code: data.vendor_code,
            Vehicle_No: data.parking_yard_info.vehicle_number,
            Driver_Name: data.parking_yard_info.driver_name,
            Driver_Mobile_Number: data.parking_yard_info.driver_contact_number,
            Previous_Vendor_Outstanding: data.previous_vendor_outstanding ? data.previous_vendor_outstanding : '--',
            Current_Vendor_Outstanding: data.current_vendor_outstanding ? data.current_vendor_outstanding : '--',
            Sap_Trip_Expense_Amount: data.sap_trip_expense_amount,
            Status: data.status == '1' ? 'Deduction Completed': 'Payment Completed',
            Unloading_Deduction_Amount: data.unloading_deduction,
            Subdelivery_Deduction_Amount: data.subdelivery_deduction,
            Weighment_Deduction_Amount: data.weighment_deduction,
            Freight_Deduction_Amount: data.freight_deduction,
            Diversion_Return_Deduction_Amount: data.diversion_return_deduction,
            Halting_Deduction_Amount: data.halting_deduction,
            Toll_Deduction_Amount: data.toll_deduction,
            Total_Deduction_Amount: data.total_deduction ? data.total_deduction : '--',
            Deduction_Remarks: data.deduction_remarks ? data.deduction_remarks : '--',
            Deduction_Posting_Date: data.deduction_posting_date ? data.deduction_posting_date : '--',
            Sap_Deduction_Doc_No: data.sap_deduction_doc_no ? data.sap_deduction_doc_no : '--',
            Posted_Balance_Payment: data.posted_balance_payment ? data.posted_balance_payment : '--',
            Payment_Remarks: data.payment_remarks ? data.payment_remarks : '--',
            Payment_Posting_Date: data.payment_posting_date ? data.payment_posting_date : '--',
            Sap_Payment_Doc_No: data.sap_payment_doc_no ? data.sap_payment_doc_no : '--',
            Payment_Created_By: data.payment_created_by ? data.payment_user_info.emp_name : '--',
            payment_creation_time: data.payment_creation_time_format ? data.payment_creation_time_format : '--',
            Created_By: data.sap_deduction_doc_no ? data.deduction_user_info.emp_name : data.payment_user_info.emp_name,
            Creation_Time: data.created_at_format,
          })
        })
        setRowData(rowDataList)
        setPending(false)
      })
    }
  }

  useEffect(() => {
    loadTripPaymentReport()
  }, [])

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
      name: 'TripSheet Date',
      selector: (row) => row.Tripsheet_Date,
      sortable: true,
      center: true,
    },
    {
      name: 'Vendor Name',
      selector: (row) => row.Vendor_Name,
      sortable: true,
      center: true,
    },
    {
      name: 'Vendor Code',
      selector: (row) => row.Vendor_Code,
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
      name: 'Driver Name',
      selector: (row) => row.Driver_Name,
      sortable: true,
      center: true,
    },
    {
      name: 'Driver Mobile Number',
      selector: (row) => row.Driver_Mobile_Number,
      sortable: true,
      center: true,
    },
    {
      name: 'Old Vendor Outstanding',
      selector: (row) => row.Previous_Vendor_Outstanding,
      sortable: true,
      center: true,
    },
    {
      name: 'Current Vendor Outstanding',
      selector: (row) => row.Current_Vendor_Outstanding,
      sortable: true,
      center: true,
    },
    {
      name: 'SAP Trip Expense',
      selector: (row) => row.Sap_Trip_Expense_Amount,
      sortable: true,
      center: true,
    },
    {
      name: 'Status',
      selector: (row) => row.Status,
      sortable: true,
      center: true,
    },
    {
      name: 'Deduction Amount',
      selector: (row) => row.Total_Deduction_Amount,
      sortable: true,
      center: true,
    },
    {
      name: 'Deduction Remarks',
      selector: (row) => row.Deduction_Remarks,
      sortable: true,
      center: true,
    },
    {
      name: 'SAP Deduction Date',
      selector: (row) => row.Deduction_Posting_Date,
      sortable: true,
      center: true,
    },
    {
      name: 'Deduction Doc.',
      selector: (row) => row.Sap_Deduction_Doc_No,
      sortable: true,
      center: true,
    },
    {
      name: 'Payment Amount',
      selector: (row) => row.Posted_Balance_Payment,
      sortable: true,
      center: true,
    },
    {
      name: 'Payment Remarks',
      selector: (row) => row.Payment_Remarks,
      sortable: true,
      center: true,
    },
    {
      name: 'SAP Payment Date',
      selector: (row) => row.Payment_Posting_Date,
      sortable: true,
      center: true,
    },
    {
      name: 'Payment Doc.',
      selector: (row) => row.Sap_Payment_Doc_No,
      sortable: true,
      center: true,
    },
    {
      name: 'Paymented By',
      selector: (row) => row.Payment_Created_By,
      sortable: true,
      center: true,
    },
    {
      name: 'Payment Time',
      selector: (row) => row.payment_creation_time,
      sortable: true,
      center: true,
    },
    {
      name: 'Created By',
      selector: (row) => row.Created_By,
      sortable: true,
      center: true,
    },
    {
      name: 'Creation Time',
      selector: (row) => row.Creation_Time,
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
            <>
              <CCard className="mt-4">
                <CContainer className="m-2">
                  <CRow className="mt-1 mb-1">
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
                      <SearchSelectComponent
                        size="sm"
                        className="mb-2"
                        onChange={(e) => {
                          onChangeFilter(e, 'tripsheet_no')
                        }}
                        label="Select Tripsheet Number"
                        noOptionsMessage="Tripsheet Not found"
                        search_type="shipment_report_tripsheet_number"
                        search_data={searchFilterData}
                      />
                    </CCol>

                    <CCol xs={12} md={3}>
                      <CFormLabel htmlFor="VNum">Payment Status</CFormLabel>
                      <SearchSelectComponent
                        size="sm"
                        className="mb-2"
                        onChange={(e) => {
                          onChangeFilter(e, 'payment_status')
                        }}
                        label="Select Payment Status"
                        noOptionsMessage="Status Not found"
                        search_type="payment_report_shipment_status"
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
                          loadTripPaymentReport('1')
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
            </> ) : (<AccessDeniedComponent />)
          }
        </>
      )}
    </>
  )
}

export default TripsheetPaymentReport

