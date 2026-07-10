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
import * as LogisticsProScreenNumberConstants from 'src/components/constants/LogisticsProScreenNumberConstants'
import AccessDeniedComponent from 'src/components/commoncomponent/AccessDeniedComponent'
import JavascriptInArrayComponent from 'src/components/commoncomponent/JavascriptInArrayComponent'
import { GetDateTimeFormat } from 'src/Pages/Depo/CommonMethods/CommonMethods'
import RakeClosureSubmissionService from 'src/Service/RakeMovement/RakeClosureSubmission/RakeClosureSubmissionService'

const RakePaymentReport = () => {

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
  let page_no = LogisticsProScreenNumberConstants.RakeReportModule.Rake_Payment_report

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

   if (event_type == 'rps_no') {
      if (selected_value) {
        setReportRPSNo(selected_value)
      } else {
        setReportRPSNo(0)
      }
    } else if (event_type == 'rake_vendor') {
      if (selected_value) {
        setReportRakeVendor(selected_value)
      } else {
        setReportRakeVendor(0)
      }
    }
  }

  const exportToCSV = () => {
    console.log(rowData,'exportCsvData')
    let dateTimeString = GetDateTimeFormat(1)
    let fileName='Rake_Payment_Report_'+dateTimeString
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

  /* Report Variables */

  const [reportRPSNo, setReportRPSNo] = useState(0)
  const [reportRakeVendor, setReportRakeVendor] = useState(0)

  let tableData = []
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

      RakeClosureSubmissionService.getPaymentDataForReport().then((res) => {
        tableReportData = res.data.data
        console.log(tableReportData,'getPaymentDataForReport')

        setFetch(true)
        let rowDataList = []

        setSearchFilterData(tableReportData)
        tableReportData.map((data, index) => {
          rowDataList.push({
            sno: index + 1,
            RPS_No: data.expense_sequence_no,
            RPS_Date: data.created_at_date,
            Vendor_Name: data.rake_vendor_info.v_name,
            Vendor_Code: data.vendor_code,
            Sap_Trip_Expense_Amount: data.sap_expense_amount,
            Status: data.payment_status != '1' ? '--': 'Payment Completed',
            Posted_Balance_Payment: data.payment_amount ? data.payment_amount : '--',
            Payment_Remarks: data.payment_remarks ? data.payment_remarks : '--',
            Payment_Posting_Date: data.payment_posting_date ? data.payment_posting_date : '--',
            Sap_Payment_Doc_No: data.payment_document_no ? data.payment_document_no : '--',
            Payment_Created_By: data.payment_by ? data.rake_payment_user_info.emp_name : '--',
            payment_creation_time: data.payment_closure_time_formatted ? data.payment_closure_time_formatted : '--',
          })
        })
        setFetch(true)
        setRowData(rowDataList)
      })
    } else {
      if (defaultDate == null) {
        setFetch(true)
        toast.warning('Date Filter Should not be empty..!')
        return false
      } else if (
        defaultDate == null &&
        reportRPSNo == 0 &&
        reportRakeVendor == 0
      ) {
        setFetch(true)
        toast.warning('Choose atleast one filter type..!')
        return false
      }
      let report_form_data = new FormData()
      report_form_data.append('date_between', defaultDate)
      report_form_data.append('rps_no', reportRPSNo)
      report_form_data.append('v_code', reportRakeVendor)
      console.log(defaultDate, 'defaultDate')
      console.log(reportRPSNo, 'reportTSNo')
      console.log(reportRakeVendor, 'reportRakeVendor')

      RakeClosureSubmissionService.sentPaymentDataForReport(report_form_data).then((res) => {
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
            RPS_No: data.expense_sequence_no,
            RPS_Date: data.created_at_date,
            Vendor_Name: data.rake_vendor_info.v_name,
            Vendor_Code: data.vendor_code,
            Sap_Trip_Expense_Amount: data.sap_expense_amount,
            Status: data.payment_status != '1' ? '--': 'Payment Completed',
            Posted_Balance_Payment: data.payment_amount ? data.payment_amount : '--',
            Payment_Remarks: data.payment_remarks ? data.payment_remarks : '--',
            Payment_Posting_Date: data.payment_posting_date ? data.payment_posting_date : '--',
            Sap_Payment_Doc_No: data.payment_document_no ? data.payment_document_no : '--',
            Payment_Created_By: data.payment_by ? data.rake_payment_user_info.emp_name : '--',
            payment_creation_time: data.payment_closure_time_formatted ? data.payment_closure_time_formatted : '--',
          })
        })
        setRowData(rowDataList)
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
      name: 'RPS No',
      selector: (row) => row.RPS_No,
      sortable: true,
      center: true,
    },
    {
      name: 'RPS Date',
      selector: (row) => row.RPS_Date,
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
                      <CFormLabel htmlFor="VNum">RPS Number</CFormLabel>
                      <SearchSelectComponent
                        size="sm"
                        className="mb-2"
                        onChange={(e) => {
                          onChangeFilter(e, 'rps_no')
                        }}
                        label="Select RPS Number"
                        noOptionsMessage="RPS Not found"
                        search_type="rake_report_rps_number"
                        search_data={searchFilterData}
                      />
                    </CCol>

                    <CCol xs={12} md={3}>
                      <CFormLabel htmlFor="VNum">Rake Vendor</CFormLabel>
                      <SearchSelectComponent
                        size="sm"
                        className="mb-2"
                        onChange={(e) => {
                          onChangeFilter(e, 'rake_vendor')
                        }}
                        label="Select Rake Vendor"
                        noOptionsMessage="Vendor Not found"
                        search_type="rake_report_vendor"
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
                            // loadVehicleReadyToTripForExportCSV()
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

export default RakePaymentReport

