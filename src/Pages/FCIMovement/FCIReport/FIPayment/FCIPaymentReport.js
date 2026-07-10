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
import { Link, useNavigate } from 'react-router-dom'
import CustomTable from 'src/components/customComponent/CustomTable' 
import { ToastContainer, toast } from 'react-toastify'
import Loader from 'src/components/Loader'
import { DateRangePicker } from 'rsuite' 
import FileSaver from 'file-saver'
import * as XLSX from 'xlsx';
import AccessDeniedComponent from 'src/components/commoncomponent/AccessDeniedComponent'
import * as LogisticsProScreenNumberConstants from 'src/components/constants/LogisticsProScreenNumberConstants'
import JavascriptInArrayComponent from 'src/components/commoncomponent/JavascriptInArrayComponent'
import { GetDateTimeFormat } from 'src/Pages/Depo/CommonMethods/CommonMethods' 
import DefinitionsListApi from 'src/Service/Definitions/DefinitionsListApi'
import FCIClosureSubmissionService from 'src/Service/FCIMovement/FCIClosureSubmission/FCIClosureSubmissionService'
import FCIVendorSerachSelectComponent from '../../CommonMethods/FCIVendorSerachSelectComponent'
import Swal from 'sweetalert2';
import AuthService from 'src/Service/Auth/AuthService'
import LocalStorageService from 'src/Service/LocalStoage'
import FCIPlantMasterService from 'src/Service/FCIMovement/FCIPlantMaster/FCIPlantMasterService'

const FCIPaymentReport = () => {
  const navigation = useNavigate()

  /*================== User Location Fetch ======================*/
  const user_info_json = localStorage.getItem('user_info')
  const user_info = JSON.parse(user_info_json)
  var user_locations = []

  /* Get User Locations From Local Storage */
  user_info.location_info.map((data, index) => {
    user_locations.push(data.id)
  })
  /* Get User Id From Local Storage */
  const user_id = user_info.user_id
  // console.log(user_locations)
  /*================== User Location Fetch ======================*/

  const onChangeFilter = (event, event_type) => {
    var selected_value = event.value
    console.log(selected_value, 'selected_value')

    if (event_type == 'po_no') {
      if (selected_value) {
        setReportPONo(selected_value)
      } else {
        setReportPONo(0)
      }
    } else if (event_type == 'fps_no') {
      if (selected_value) {
        setReportFPSNo(selected_value)
      } else {
        setReportFPSNo(0)
      }
    } else if (event_type == 'vendor_name') {
      if (selected_value) {
        setReportVendorCode(selected_value)
      } else {
        setReportVendorCode(0)
      }
    } else if (event_type == 'vendor_type') {
      if (selected_value) {
        setReportVendorType(selected_value)
      } else {
        setReportVendorType(0)
      }
    } else if (event_type == 'plant_code') {
      if (selected_value) {
        setReportPlantId(selected_value)
      } else {
        setReportPlantId(0)
      }
    }
  }

  const exportToCSV = () => {
    if (defaultDate == null) {
      toast.warning('Date Filter Should not be empty..!')
      return false
    } else if (
      defaultDate == null &&
      reportVendorCode == 0 &&
      reportVendorType == 0 &&
      reportPlantId == 0 &&
      reportPONo == 0 && 
      reportFPSNo == 0
    ) {
      toast.warning('Choose atleast one filter type..!')
      return false
    }
    console.log(rowData,'exportCsvData')
    let dateTimeString = GetDateTimeFormat(1)
    let fileName='FCI_Payment_Report_'+dateTimeString
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

  const [errorModal, setErrorModal] = useState(false)
  const [fetch, setFetch] = useState(false)

  const [pending, setPending] = useState(true)

  const [reportPONo, setReportPONo] = useState(0) 
  const [reportFPSNo, setReportFPSNo] = useState(0) 
  const [reportVendorCode, setReportVendorCode] = useState(0)
  const [reportVendorType, setReportVendorType] = useState(0) 
  const [reportPlantId, setReportPlantId] = useState('')  

  let tableData = []
  let tableReportData = []

  const [fciPlantData, setFciPlantData] = useState([])

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

  useEffect(() => {

    /* section for getting Rake Plant Lists from database */
    // DefinitionsListApi.visibleDefinitionsListByDefinition(34).then((response) => {
    FCIPlantMasterService.getActiveFCIPlantRequestTableData().then((response) => {
      setFetch(true)
      let viewData = response.data.data
      console.log(viewData,'FCI Plant Data')
      setFciPlantData(viewData)
    })

  }, [])

  const locationFinder = (plant) => {
    let n_loc = '--'
    console.log(plant,'plant-plant')
    fciPlantData.map((datann, indexnn) => {
      console.log(datann,'plant-plant-datann')
      if(datann.plant_symbol == plant){
        n_loc = datann.plant_name
      }
    })
    return n_loc
  }

  function logout() {
    AuthService.forceLogout(user_id).then((res) => {
      // console.log(res)
      if (res.status == 204) {
        LocalStorageService.clear()
        window.location.reload(false)
      }
    })
  }

  const loadTripSheetExpenseReport = (fresh_type = '') => {

    if (fresh_type !== '1') {

      FCIClosureSubmissionService.getPaymentDataForReport().then((res) => { 
        tableReportData = res.data.data
        console.log(tableReportData,'getPaymentDataForReport')

        // setFetch(true)
        let rowDataList = []

        setSearchFilterData(tableReportData)
        tableReportData.map((data, index) => {

          /* Get Tripsheets Count */
          let chars = data.tripsheet_info

          let uniqueChars = chars.filter((c, index) => {
              return chars.indexOf(c) === index
          })

          console.log(uniqueChars,'uniqueChars')

          rowDataList.push({
            sno: index + 1,
            date: data.created_at_date,
            Unique_No: data.expense_sequence_no,
            PO_No: data.po_no,
            Vendor_Name: data.expense_vendor_name,
            Vendor_Code: data.expense_vendor_code,
            Vendor_Type: FCI_VENDOR_TYPE[data.expense_vendor_type],
            Request_By: data.fci_user_info.emp_name,
            Trip_Count: data.trip_migo_count,
            TripSheet_Count: data.tripsheet_count,
            FCI_Plant: locationFinder(data.fci_plant_code), 
            Sap_Trip_Expense_Amount: data.sap_expense_amount_wtds,
            Payment_Status: data.payment_status != '1' ? '--': 'Payment Completed',
            Posted_Balance_Payment: data.payment_amount ? data.payment_amount : '--',
            Payment_Remarks: data.payment_remarks ? data.payment_remarks : '--',
            Payment_Posting_Date: data.payment_posting_date ? data.payment_posting_date : '--',
            Sap_Payment_Doc_No: data.payment_document_no ? data.payment_document_no : '--',
            Payment_Created_By: data.payment_by ? data.fci_payment_user_info.emp_name : '--',
            payment_creation_time: data.payment_closure_time_formatted ? data.payment_closure_time_formatted : '--',
            Created_By: data.fci_user_info.emp_name,
            Screen_Duration: data.created_at_time,
            // Status: data.status,
            Status: TRIP_CLOSURE_STATUS[data.status],             
          })
        })
        // setFetch(true)
        setRowData(rowDataList)
        setPending(false)
      })
      .catch((error) => {
        setFetch(true)
        console.log(error)
        let errorText = error.response.data.message
        console.log(errorText,'errorText')
        let timerInterval;
        if (error.response.status === 401) { 
          Swal.fire({
            title: "Unauthorized Activities Found..",
            html: "App will close in <b></b> milliseconds.",
            icon: "error",
            timer: 3000,
            timerProgressBar: true,
            didOpen: () => {
              Swal.showLoading();
              const timer = Swal.getPopup().querySelector("b");
              timerInterval = setInterval(() => {
                timer.textContent = `${Swal.getTimerLeft()}`;
              }, 100);
            },
            willClose: () => {
              clearInterval(timerInterval);
            }
          }).then((result) => {
            // console.log(result,'result') 
            if (result.dismiss === Swal.DismissReason.timer) { 
              logout()
            }
          });      
        }
      })
    } else {

      if (defaultDate == null) {
        setFetch(true)
        toast.warning('Date Filter Should not be empty..!')
        return false
      } else if (
        defaultDate == null &&
        reportVendorCode == 0 &&
        reportVendorType == 0 &&
        reportPlantId == 0 &&
        reportPONo == 0 && 
        reportFPSNo == 0
      ) {
        setFetch(true)
        toast.warning('Choose atleast one filter type..!')
        return false
      }

      let report_form_data = new FormData()
      report_form_data.append('date_between', defaultDate) 
      report_form_data.append('po_no', reportPONo)
      report_form_data.append('fps_no', reportFPSNo)
      report_form_data.append('expense_vendor_code', reportVendorCode)
      report_form_data.append('expense_vendor_type', reportVendorType)
      report_form_data.append('fci_plant_id', reportPlantId)

      console.log(defaultDate, 'date_between')
      console.log(reportVendorCode, 'expense_vendor_code')
      console.log(reportVendorType, 'expense_vendor_type')
      console.log('po_no', reportPONo)
      console.log('fps_no', reportFPSNo)
      console.log('fci_plant_id', reportPlantId)

      FCIClosureSubmissionService.sentPaymentDataForReport(report_form_data).then((res) => { 
        console.log(res, 'res')
        tableReportData = res.data.data
        console.log(tableReportData,'sentPaymentDataForReport')
        let rowDataList = []

        setSearchFilterData(tableReportData)
        tableReportData.map((data, index) => {

          /* Get Tripsheets Count */
          let chars = data.tripsheet_info

          let uniqueChars = chars.filter((c, index) => {
              return chars.indexOf(c) === index
          })

          console.log(uniqueChars,'uniqueChars')

          rowDataList.push({
            sno: index + 1,
            date: data.created_at_date,
            Unique_No: data.expense_sequence_no,
            PO_No: data.po_no,
            Vendor_Name: data.expense_vendor_name,
            Vendor_Code: data.expense_vendor_code,
            Vendor_Type: FCI_VENDOR_TYPE[data.expense_vendor_type],
            Request_By: data.fci_user_info.emp_name,
            Trip_Count: data.trip_migo_count,
            TripSheet_Count: data.tripsheet_count,
            FCI_Plant: locationFinder(data.fci_plant_code), 
            Sap_Trip_Expense_Amount: data.sap_expense_amount_wtds,
            Payment_Status: data.payment_status != '1' ? '--': 'Payment Completed',
            Posted_Balance_Payment: data.payment_amount ? data.payment_amount : '--',
            Payment_Remarks: data.payment_remarks ? data.payment_remarks : '--',
            Payment_Posting_Date: data.payment_posting_date ? data.payment_posting_date : '--',
            Sap_Payment_Doc_No: data.payment_document_no ? data.payment_document_no : '--',
            Payment_Created_By: data.payment_by ? data.fci_payment_user_info.emp_name : '--',
            payment_creation_time: data.payment_closure_time_formatted ? data.payment_closure_time_formatted : '--',
            Created_By: data.fci_user_info.emp_name,
            Screen_Duration: data.created_at_time,
            Status: TRIP_CLOSURE_STATUS[data.status],             
          })
        })
        setFetch(true)
        setRowData(rowDataList)
        setPending(false)
      })
      .catch((error) => {
        setFetch(true)
        console.log(error)
        let errorText = error.response.data.message
        console.log(errorText,'errorText')
        let timerInterval;
        if (error.response.status === 401) { 
          Swal.fire({
            title: "Unauthorized Activities Found..",
            html: "App will close in <b></b> milliseconds.",
            icon: "error",
            timer: 3000,
            timerProgressBar: true,
            didOpen: () => {
              Swal.showLoading();
              const timer = Swal.getPopup().querySelector("b");
              timerInterval = setInterval(() => {
                timer.textContent = `${Swal.getTimerLeft()}`;
              }, 100);
            },
            willClose: () => {
              clearInterval(timerInterval);
            }
          }).then((result) => {
            // console.log(result,'result') 
            if (result.dismiss === Swal.DismissReason.timer) { 
              logout()
            }
          });      
        }
      })
    }
  }

  /* ==================== Access Part Start ========================*/
  const [screenAccess, setScreenAccess] = useState(false)
  let page_no = LogisticsProScreenNumberConstants.FCIReportModule.FCI_Income_report

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

  useEffect(() => {
    loadTripSheetExpenseReport()
  }, [fciPlantData])

  const columns = [
    {
      name: 'S.No',
      selector: (row) => row.sno,
      sortable: true,
      center: true,
    },
    {
      name: 'Closure Seq.',
      selector: (row) => row.Unique_No,
      sortable: true,
      center: true,
    },
    {
      name: 'Date',
      selector: (row) => row.date,
      sortable: true,
      center: true,
    },
    {
      name: 'PO NO',
      selector: (row) => row.PO_No,
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
      name: 'Vendor Type',
      selector: (row) => row.Vendor_Type,
      sortable: true,
      center: true,
    },
    // {
    //   name: 'Trip Sheet Count',
    //   selector: (row) => row.TripSheet_Count,
    //   sortable: true,
    //   center: true,
    // },
    // {
    //   name: 'Trip Count',
    //   selector: (row) => row.Trip_Count,
    //   sortable: true,
    //   center: true,
    // },
    {
      name: 'Location',
      selector: (row) => row.FCI_Plant,
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
      name: 'Payment Status',
      selector: (row) => row.Payment_Status,
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
    // {
    //   name: 'Current Status',
    //   selector: (row) => row.Waiting_At,
    //   sortable: true,
    //   center: true,
    // },
    // {
    //   name: 'Screen Duration',
    //   selector: (row) => row.Screen_Duration,
    //   sortable: true,
    //   center: true,
    // },
    // {
    //   name: 'Status',
    //   selector: (row) => row.Status,
    //   sortable: true,
    //   center: true,
    // // },
    // {
    //   name: 'Action',
    //   selector: (row) => row.Action,
    //   center: true,
    // },
  ]

  /* Trip Closure Status */
  const TRIP_CLOSURE_STATUS = [
    '',
    'Exp. Sub. ✔️',
    'Exp. Sub. Approved ✔️',
    'Exp. Sub. Rejected ❌',
    'Exp. Verified ✔️',
    'Exp. Rejected ❌',
    'Exp. Posted ✔️',
    'Exp. Posting Rejected ❌',
    'Inc. Posted ✔️',     
    'Cancelled ❌'
  ]

  const FCI_VENDOR_TYPE = ['','Freight Vendor','Loading Vendor']

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
                    <CFormLabel htmlFor="VNum">FPS Number</CFormLabel>
                    <FCIVendorSerachSelectComponent
                      size="sm"
                      className="mb-2"
                      onChange={(e) => {
                        onChangeFilter(e, 'fps_no')
                      }}
                      label="Select FPS Number"
                      noOptionsMessage="FPS Not found"
                      search_type="fci_payment_report_fps_number"
                      search_data={searchFilterData}
                    />
                  </CCol>

                  <CCol xs={12} md={3}>
                    <CFormLabel htmlFor="VNum">PO Number</CFormLabel>
                    <FCIVendorSerachSelectComponent
                      size="sm"
                      className="mb-2"
                      onChange={(e) => {
                        onChangeFilter(e, 'po_no')
                      }}
                      label="Select PO Number"
                      noOptionsMessage="PO Not found"
                      search_type="fci_tripsheet_report_po_number"
                      search_data={searchFilterData}
                    />
                  </CCol>

                  <CCol xs={12} md={3}>
                    <CFormLabel htmlFor="VNum">Vendor Type</CFormLabel>
                    <FCIVendorSerachSelectComponent
                      size="sm"
                      className="mb-2"
                      onChange={(e) => {
                        onChangeFilter(e, 'vendor_type')
                      }}
                      label="Select Vendor Type"
                      noOptionsMessage="Vendor Type Not found"
                      search_type="fci_expense_report_vendor_type"
                      search_data={searchFilterData}
                    />
                  </CCol>

                  <CCol xs={12} md={3}>
                    <CFormLabel htmlFor="VNum">Vendor Name</CFormLabel>
                    <FCIVendorSerachSelectComponent
                      size="sm"
                      className="mb-2"
                      onChange={(e) => {
                        onChangeFilter(e, 'vendor_name')
                      }}
                      label="Select Vendor name"
                      noOptionsMessage="Vendor Not found"
                      search_type="fci_expense_report_vendor_name"
                      search_data={searchFilterData}
                    />
                  </CCol>

                  <CCol xs={12} md={3}>
                    <CFormLabel htmlFor="VNum">FCI Plant</CFormLabel>
                    <FCIVendorSerachSelectComponent
                      size="sm"
                      className="mb-2"
                      onChange={(e) => {
                        onChangeFilter(e, 'plant_code')
                      }}
                      label="Select FCI Plant"
                      noOptionsMessage="Plant Not found"
                      search_type="fci_tripsheet_report_plant_name"
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
                        loadTripSheetExpenseReport('1')
                      }}
                    >
                      Filter
                    </CButton>
                    <CButton
                      size="sm"
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
            </CCard> ) : ( <AccessDeniedComponent />
          )}
        </>
      )}
       
    </>
  )
}

export default FCIPaymentReport
