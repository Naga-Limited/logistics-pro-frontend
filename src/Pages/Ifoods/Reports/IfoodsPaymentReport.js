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
  CCardImage,
} from '@coreui/react'
import { Link, useNavigate } from 'react-router-dom'
import CustomTable from 'src/components/customComponent/CustomTable'
import TripStoService from 'src/Service/TripSTO/TripStoService'
import { ToastContainer, toast } from 'react-toastify'
import Loader from 'src/components/Loader'
import { DateRangePicker } from 'rsuite'
// import TripSheetFilterComponent from '../TripSheetReports/TripSheetFilterComponent/TripSheetFilterComponent'
import SearchSelectComponent from 'src/components/commoncomponent/searchSelectComponent'
import FileSaver from 'file-saver'
import * as XLSX from 'xlsx'
import DepoShipmentCreationService from 'src/Service/Depo/Shipment/DepoShipmentCreationService'
import { GetDateTimeFormat, getGstTax } from '../CommonMethods/CommonMethods'
import AccessDeniedComponent from 'src/components/commoncomponent/AccessDeniedComponent'
import * as LogisticsProScreenNumberConstants from 'src/components/constants/LogisticsProScreenNumberConstants'
import DepoExpenseClosureService from 'src/Service/Depo/ExpenseClosure/DepoExpenseClosureService'
import DefinitionsListApi from 'src/Service/Definitions/DefinitionsListApi'
import JavascriptInArrayComponent from 'src/components/commoncomponent/JavascriptInArrayComponent'
import IfoodsExpenseClosureService from 'src/Service/Ifoods/ExpenseClosure/IfoodsExpenseClosureService'
import CustomSpanButton3 from 'src/components/customComponent/CustomSpanButton3'
import IfoodsTSCreationService from 'src/Service/Ifoods/TSCreation/IfoodsTSCreationService';

const IfoodsPaymentReport = () => {
  const navigation = useNavigate()

  /*================== User Location Fetch ======================*/
  const user_info_json = localStorage.getItem('user_info')
  const user_info = JSON.parse(user_info_json)
  var user_locations = []

  /* Get User Locations From Local Storage */
  user_info.location_info.map((data, index) => {
    user_locations.push(data.id)
  })
  // console.log(user_locations)

  /*================== User Location Fetch ======================*/

  const [tdsTaxData, setTdsTaxData] = useState([])
  const [tripDetails, setTripDetails] = useState(null);
  useEffect(() => {

    /* section for getting TDS Tax Type Lists from database */
    DefinitionsListApi.visibleDefinitionsListByDefinition(3).then((response) => {

     let viewData = response.data.data
      console.log(viewData,'viewData')
     setTdsTaxData(viewData)
   })

  }, [])
  const [value, setValue] = React.useState([new Date(getCurrentDate('-')), new Date(getCurrentDate('-'))]);
  function getCurrentDate(separator = '') {
    let newDate = new Date()
    let date = newDate.getDate()
    let month = newDate.getMonth() + 1
    let year = newDate.getFullYear()

    return `${year}${separator}${month < 10 ? `0${month}` : `${month}`}${separator}${date < 10 ? `0${date}` : `${date}`}`
  }
  const onChangeFilter = (event, event_type) => {
    var selected_value = event.value
    console.log(selected_value, 'selected_value')

    if (event_type == 'ifoods_vendor') {
      if (selected_value) {
        setReportContractor(selected_value)
      } else {
        setReportContractor(0)
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
    if (defaultDate == null) {
      toast.warning('Date Filter Should not be empty..!')
      return false
    } else if (defaultDate == null && reportContractor == 0 && reportPaymentStatus == 0) {
      toast.warning('Choose atleast one filter type..!')
      return false
    }
    console.log(rowData, 'exportCsvData')
    let dateTimeString = GetDateTimeFormat(1)
    let fileName = 'Ifoods_Payment_Report_' + dateTimeString
    const fileType =
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
    const fileExtension = '.xlsx'
    const ws = XLSX.utils.json_to_sheet(rowData)
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] }
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
    const data = new Blob([excelBuffer], { type: fileType })
    FileSaver.saveAs(data, fileName + fileExtension)
  }

  const [rowData, setRowData] = useState([])
  const [searchFilterData, setSearchFilterData] = useState([])

  const [errorModal, setErrorModal] = useState(false)
  const [fetch, setFetch] = useState(false)

  const [pending, setPending] = useState(true)
  const [visible, setVisible] = useState(false)
  const [InvoicePhoto, setInvoicePhoto] = useState(false)
  const [InvoicePhotoSrc, setInvoicePhotoSrc] = useState('')
  /* Report Variables */
  const [reportContractor, setReportContractor] = useState(0)
  const [reportPaymentStatus, setReportPaymentStatus] = useState(0)

  let tableData = []
  let tableReportData = []

  const paymentStatusArray = [
    'Submission Request ✔️',
    'SCM Validation Rejected ❌',
    'OH Approved ✔️',
    'AM Validation Rejected, ❌',
    'AM Validation Approved ✔️',
    'AH Rejected, ❌',
    'Completed ✔️',
    'SCM Validation Approved ✔️',
  ]

  const paymentStatus = (data) => {
    console.log(data,'paymentStatus-data')
    var pid = data.status
    if(data.approval_remarks && data.approval_time && pid == 1){
      return 'Approval ❌'
    }
    return paymentStatusArray[pid-1]
  }

  const getTdsTax = (code) => {
    let tds_text = 'Loading..'
    console.log(code,'code')
    console.log(tdsTaxData,'tdsTaxData')
    if(tdsTaxData.length > 0) {
      tdsTaxData.map((val,ind)=>{
        console.log(val,'tdsTaxData - '+ind)
        if(val.definition_list_code == code){
          tds_text = val.definition_list_name
        } else if('Empty' == code){
          tds_text = 'No Tax'
        }
      })
    }
    return tds_text
  }

  /* Set Default Date (Today) in a Variable State */
  const [defaultDate, setDefaultDate] = React.useState([
    new Date(getCurrentDate('-')),
    new Date(getCurrentDate('-')),
  ])
  const [dateRangePickerStartDate, setDateRangePickerStartDate] = useState('')
  const [dateRangePickerEndDate, setDateRangePickerEndDate] = useState('')
  const  convert = (str) => {
    let date = new Date(str);
    let mnth = ("0" + (date.getMonth() + 1)).slice(-2);
    let day = ("0" + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join("-");

  }
  useEffect (()=>{

    if(value){

      console.log(value)
      let fromDate = value[0];
      let toDate = value[1];
      console.log(convert(fromDate))
      console.log(convert(toDate))
      setDateRangePickerStartDate(convert(fromDate));
      setDateRangePickerEndDate(convert(toDate));

    } else {

      setDateRangePickerStartDate('');
      setDateRangePickerEndDate('');

    }
  },[value])

  const loadTripPaymentReport = (fresh_type = '') => {

    if (fresh_type !== '1') {
      IfoodsExpenseClosureService.getPaymentDataForReport().then((res) => {
        tableReportData = res.data.data;
        console.log(tableReportData, 'getPaymentDataForReport');

        setFetch(true);
        let rowDataList = [];
        tableReportData.map((data, index) => {
          const ifoods_tripsheet_nos = data.ifoods_tripsheet_nos || [];
          ifoods_tripsheet_nos.forEach((tripsheet, tripIndex) => {
            rowDataList.push({
              S_No: `${index + 1}${tripIndex > 0 ? `.${tripIndex + 1}` : ''}`,
              Payment_Reference_No: data.invoice_sequence,
              Vendor_Name: data.payment_vendor_info.vendor_name,
              Vendor_Code: data.payment_vendor_info.vendor_code,
              Vendor_No: data.payment_vendor_info.vendor_contact_no,
              Vendor_Freight: data.payment_vendor_info.freight_type == '2' ? 'Actual' : 'Budget',
              Tripsheet_Count: data.tripsheet_count,
              Tripsheet_No: tripsheet,
              GST_Tax_Type: getGstTax(data.payment_vendor_info.gst_tax_type),
              TDS_Tax_Type: getTdsTax(data.payment_vendor_info.tds_tax_type),
              Invoice_No: data.sap_invoice_no || '-',
              Invoice_Posting_Date: data.invoice_posting_date || '-',
              _Actual_Freight_Amount: data.freight_amount,
              Posting_Expense_Amount: data.expense_amount,
              Posting_Payment_Amount: data.payment_amount,
              Ifoods_freight_type: data.freight_type == 'P' ? 'Primary' : 'Secondary',
              Tds_deduction: data.tds_dec_value,
              Gst_value: data.gst_dec_value,
              Sap_Expense_Doc: data.sap_expense_no,
              Sap_Payment_Doc: data.sap_payment_no,
              expense_posting_date: data.expense_posting_date,
              payment_posting_date: data.payment_posting_date,
              Payment_Status: paymentStatus(data),
              Remarks: data.remarks || '-',
              Approval_Remarks: data.approval_remarks || '-',
              Reference_Text: data.reference_text || '-',
              Payment_Request_Date: data.created_date,
            });
          });
        });
        setFetch(true);
        setRowData(rowDataList);
        setPending(false);
      })
    } else {
      if (defaultDate == null) {
        setFetch(true)
        toast.warning('Date Filter Should not be empty..!')
        return false
      } else if (defaultDate == null && reportContractor == 0 && reportPaymentStatus == 0) {
        toast.warning('Choose atleast one filter type..!')
        return false
      }
      let report_form_data = new FormData()
      report_form_data.append('trip_from_date_range', dateRangePickerStartDate)
      report_form_data.append('trip_to_date_range', dateRangePickerEndDate)
      // report_form_data.append('date_between', defaultDate)
      report_form_data.append('payment_status', reportPaymentStatus)
      report_form_data.append('ifoods_vendor', reportContractor)

      console.log(defaultDate, 'defaultDate')
      console.log(reportPaymentStatus, 'reportPaymentStatus')
      console.log(reportContractor, 'reportContractor')

      IfoodsExpenseClosureService.sentPaymentDataForReport(report_form_data).then((res) => {
        console.log(res, 'res')
        tableReportData = res.data.data
        console.log(tableReportData)

        setFetch(true)
        let rowDataList = []
        console.log(tableReportData,'tableReportData')
        setSearchFilterData(tableReportData)
        tableReportData.map((data, index) => {
          setFetch(true);
          let rowDataList = [];
          tableReportData.map((data, index) => {
            const ifoods_tripsheet_nos = data.ifoods_tripsheet_nos || [];
            ifoods_tripsheet_nos.forEach((tripsheet, tripIndex) => {
              rowDataList.push({
                S_No: `${index + 1}${tripIndex > 0 ? `.${tripIndex + 1}` : ''}`,
                Payment_Reference_No: data.invoice_sequence,
                Vendor_Name: data.payment_vendor_info.vendor_name,
                Vendor_Code: data.payment_vendor_info.vendor_code,
                Vendor_No: data.payment_vendor_info.vendor_contact_no,
                Vendor_Freight: data.payment_vendor_info.freight_type == '2' ? 'Actual' : 'Budget',
                Tripsheet_Count: data.tripsheet_count,
                Tripsheet_No: tripsheet,
                GST_Tax_Type: getGstTax(data.payment_vendor_info.gst_tax_type),
                TDS_Tax_Type: getTdsTax(data.payment_vendor_info.tds_tax_type),
                Invoice_No: data.sap_invoice_no || '-',
                Invoice_Posting_Date: data.invoice_posting_date || '-',
                _Actual_Freight_Amount: data.freight_amount,
                Posting_Expense_Amount: data.expense_amount,
                Posting_Payment_Amount: data.payment_amount,
                Ifoods_freight_type: data.freight_type == 'P' ? 'Primary' : 'Secondary',
                Tds_deduction: data.tds_dec_value,
                Gst_value: data.gst_dec_value,
                Sap_Expense_Doc: data.sap_expense_no,
                Sap_Payment_Doc: data.sap_payment_no,
                expense_posting_date: data.expense_posting_date,
                payment_posting_date: data.payment_posting_date,
                Payment_Status: paymentStatus(data),
                Remarks: data.remarks || '-',
                Approval_Remarks: data.approval_remarks || '-',
                Reference_Text: data.reference_text || '-',
                Payment_Request_Date: data.created_date,
              });
            });
          });
          setFetch(true);
          setRowData(rowDataList);
          setPending(false);
        })
  })
}}

  /* ==================== Access Part Start ========================*/
  const [screenAccess, setScreenAccess] = useState(false)
  let page_no = LogisticsProScreenNumberConstants.IfoodsModuleScreens.Ifoods_Payment_Report

  useEffect(() => {
    if (
      user_info.is_admin == 1 ||
      JavascriptInArrayComponent(page_no, user_info.page_permissions)
    ) {
      console.log('screen-access-allowed')
      setScreenAccess(true)
    } else{
      console.log('screen-access-not-allowed')
      setScreenAccess(false)
    }

  },[])
  /* ==================== Access Part End ========================*/

  useEffect(() => {
    if(tdsTaxData.length > 0){
      loadTripPaymentReport()
    }
  }, [tdsTaxData])

  const columns = [
    {
      name: 'S.No',
      selector: (row) => row.S_No,
      sortable: true,
      center: true,
    },
    {
      name: 'Ref.No',
      selector: (row) => row.Payment_Reference_No,
      sortable: true,
      center: true,
    },
    {
      name: 'Vendor. Name',
      selector: (row) => row.Vendor_Name,
      sortable: true,
      center: true,
    },
    {
      name: 'Vendor. Code',
      selector: (row) => row.Vendor_Code,
      sortable: true,
      center: true,
    },
    {
      name: 'Tripsheet_No',
      selector: (row) => row.Tripsheet_No,
      sortable: true,
      center: true,
    },
    {
      name: 'Freight Type',
      selector: (row) => row.Vendor_Freight,
      sortable: true,
      center: true,
    },
    {
      name: 'Tripsheets',
      selector: (row) => row.Tripsheet_Count,
      sortable: true,
      center: true,
    },
    {
      name: 'GST Tax Type',
      selector: (row) => row.GST_Tax_Type,
      sortable: true,
      center: true,
    },
    {
      name: 'TDS Tax Type',
      selector: (row) => row.TDS_Tax_Type,
      sortable: true,
      center: true,
    },
    {
      name: 'Actual Freight',
      selector: (row) => row._Actual_Freight_Amount,
      sortable: true,
      center: true,
    },
    {
      name: 'Expense Amount ',
      selector: (row) => row.Posting_Expense_Amount,
      sortable: true,
      center: true,
    },
    {
      name: 'Payment Amount ',
      selector: (row) => row.Posting_Payment_Amount,
      sortable: true,
      center: true,
    },
    {
      name: 'Status',
      selector: (row) => row.Payment_Status,
      sortable: true,
      center: true,
    },

    {
      name: 'SAP Expense Doc',
      selector: (row) => row.Sap_Expense_Doc,
      sortable: true,
      center: true,
    },
    {
      name: 'SAP Payment Doc',
      selector: (row) => row.Sap_Payment_Doc,
      sortable: true,
      center: true,
    },
    {
      name: 'SAP Expense Date',
      selector: (row) => row.Posting_Expense_Amount,
      sortable: true,
      center: true,
    },
    {
      name: 'SAP Payment Date',
      selector: (row) => row.Posting_Payment_Amount,
      sortable: true,
      center: true,
    },

    {
      name: 'Remarks',
      selector: (row) => row.Remarks,
      sortable: true,
      center: true,
    },
    {
      name: 'Creation Date',
      selector: (row) => row.Payment_Request_Date,
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
                <CRow className="mt-1 mb-1">
                  <CCol xs={12} md={3}>
                    <CFormLabel htmlFor="VNum">Date Filter</CFormLabel>
                    <DateRangePicker
                      style={{ width: '100rem', height: '100%', borderColor: 'black' }}
                      className="mb-2"
                      id="start_date"
                      name="end_date"
                      format="dd-MM-yyyy"

                      value={value}
                onChange={setValue}
                    />
                  </CCol>

                  <CCol xs={12} md={3}>
                    <CFormLabel htmlFor="VNum">Vendor Name</CFormLabel>
                    <SearchSelectComponent
                      size="sm"
                      className="mb-2"
                      onChange={(e) => {
                        onChangeFilter(e, 'ifoods_vendor')
                      }}
                      label="Select Vendor Name"
                      noOptionsMessage="Vendor Not found"
                      search_type="ifoods_payment_submission_vendor"
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
                      search_type="ifoods_payment_report_payment_status"
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
                      size="sm"
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
              <CModal
                size="xl"
                visible={visible}
                backdrop="static"
                scrollable
                onClose={() => setVisible(false)}
              >
                <CModalHeader>
                  <CModalTitle style={{ display: 'flex', justifyContent: 'end' }}>
                    Payment Vendor Invoice
                  </CModalTitle>
                </CModalHeader>

                <CModalBody></CModalBody>
                <CModalFooter>
                  <CButton color="secondary" onClick={() => setVisible(false)}>
                    Close
                  </CButton>
                </CModalFooter>
              </CModal>

              {/* Model for Advance Photo  */}
              <CModal visible={InvoicePhoto} onClose={() => setInvoicePhoto(false)}>
                <CModalHeader>
                  <CModalTitle>Invoice Copy Photo</CModalTitle>
                </CModalHeader>
                <CModalBody>
                  <CCardImage height="500" orientation="top" src={InvoicePhotoSrc} />
                </CModalBody>
                <CModalFooter>
                  <CButton color="secondary" onClick={() => setInvoicePhoto(false)}>
                    Close
                  </CButton>
                </CModalFooter>
              </CModal>
            </CCard>
          ) : (
            <AccessDeniedComponent />
          )}
        </>
      )}
      {/* Error Modal Section */}
      <CModal visible={errorModal} onClose={() => setErrorModal(false)}>
        <CModalHeader>
          <CModalTitle className="h4">Trip STO Confirmation</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CRow>
            <CCol>
              <CAlert color="danger" data-aos="fade-down">
                {'Are You Sure to Want to go Trip STO ?'}
              </CAlert>
            </CCol>
          </CRow>
        </CModalBody>
        <CModalFooter>
          <CButton
            color="primary"
            onClick={() => {
              setFetch(false)
              setErrorModal(false)
              assignTripSTO(vehicleSto)
            }}
          >
            Yes
          </CButton>
          <CButton onClick={() => setErrorModal(false)} color="primary">
            <Link to=""> No </Link>
          </CButton>
        </CModalFooter>
      </CModal>
      {/* Error Modal Section */}
    </>
  )
}

export default IfoodsPaymentReport
