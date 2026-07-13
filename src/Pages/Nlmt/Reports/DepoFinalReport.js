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
import TripStoService from 'src/Service/TripSTO/TripStoService'
import { ToastContainer, toast } from 'react-toastify'
import Loader from 'src/components/Loader'
import { DateRangePicker } from 'rsuite'
// import TripSheetFilterComponent from '../TripSheetReports/TripSheetFilterComponent/TripSheetFilterComponent'
import SearchSelectComponent from 'src/components/commoncomponent/searchSelectComponent'
import FileSaver from 'file-saver'
import * as XLSX from 'xlsx';
import DepoShipmentCreationService from 'src/Service/Depo/Shipment/DepoShipmentCreationService'
import { GetDateTimeFormat, getGstTax } from '../CommonMethods/CommonMethods'
import AccessDeniedComponent from 'src/components/commoncomponent/AccessDeniedComponent'
import * as LogisticsProScreenNumberConstants from 'src/components/constants/LogisticsProScreenNumberConstants'
import DepoExpenseClosureService from 'src/Service/Depo/ExpenseClosure/DepoExpenseClosureService'
import DefinitionsListApi from 'src/Service/Definitions/DefinitionsListApi'
import JavascriptInArrayComponent from 'src/components/commoncomponent/JavascriptInArrayComponent'

const DepoFinalReport = () => {
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
  useEffect(() => {

    /* section for getting TDS Tax Type Lists from database */
    DefinitionsListApi.visibleDefinitionsListByDefinition(3).then((response) => {

     let viewData = response.data.data
      console.log(viewData,'viewData')
     setTdsTaxData(viewData)
   })

  }, [])

  const onChangeFilter = (event, event_type) => {
    var selected_value = event.value
    console.log(selected_value, 'selected_value')

    if (event_type == 'contractor_id') {
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
    } else if (
      defaultDate == null &&
      reportContractor == 0 &&
      reportPaymentStatus == 0
    ) {
      toast.warning('Choose atleast one filter type..!')
      return false
    }
    console.log(rowData,'exportCsvData')
    let dateTimeString = GetDateTimeFormat(1)
    let fileName='Depo_Payment_Report_'+dateTimeString
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

  /* Report Variables */
  const [reportContractor, setReportContractor] = useState(0)
  const [reportPaymentStatus, setReportPaymentStatus] = useState(0)

  let tableData = []
  let tableReportData = []

  const paymentStatusArray = [
    'Submission ✔️',
    'Validation ❌',
    'Validation ✔️',
    'Completed ✔️',
    'Deleted'
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

  useEffect(() => {
    console.log(defaultDate)
    if (defaultDate) {
      setDefaultDate(defaultDate)
    } else {
    }
  }, [defaultDate])

  const loadTripPaymentReport = (fresh_type = '') => {

    if (fresh_type !== '1') {

      DepoExpenseClosureService.getPaymentDataForReport().then((res) => {
        tableReportData = res.data.data
        console.log(tableReportData,'getPaymentDataForReport')

        setFetch(true)
        let rowDataList = []
        console.log(tableReportData,'tableReportData')
        setSearchFilterData(tableReportData)
        tableReportData.map((data, index) => {
          rowDataList.push({
            S_No: index + 1,
            Payment_Reference_No: data.invoice_sequence,
            Contractor_Name: data.payment_contractor_info.contractor_name,
            Contractor_Code: data.payment_contractor_info.contractor_code,
            Contractor_No: data.payment_contractor_info.contractor_number,
            Contractor_Freight: data.payment_contractor_info.freight_type == '2' ? 'Actual' : 'Budget',
            Tripsheet_Count: data.tripsheet_count,
            GST_Tax_Type:getGstTax(data.payment_contractor_info.gst_tax_type),
            TDS_Tax_Type:getTdsTax(data.payment_contractor_info.tds_tax_type),
            Invoice_No: data.sap_invoice_no || '-',
            Invoice_Posting_Date: data.invoice_posting_date || '-',
            Freight_Amount: data.freight_amount,
            Payment_Status: paymentStatus(data),
            Remarks: data.remarks || '-',
            Approval_Remarks: data.approval_remarks || '-',
            Reference_Text: data.reference_text || '-',
            Payment_Request_Date: data.created_date
          })
        })
        setFetch(true)
        setRowData(rowDataList)
        setPending(false)
      })
    } else {
      if (defaultDate == null) {
        setFetch(true)
        toast.warning('Date Filter Should not be empty..!')
        return false
      } else if (
        defaultDate == null &&
        reportContractor == 0 &&
        reportPaymentStatus == 0
      ) {
        toast.warning('Choose atleast one filter type..!')
        return false
      }
      let report_form_data = new FormData()
      report_form_data.append('date_between', defaultDate)
      report_form_data.append('payment_status', reportPaymentStatus)
      report_form_data.append('contractor_id', reportContractor)

      console.log(defaultDate, 'defaultDate')
      console.log(reportPaymentStatus, 'reportPaymentStatus')
      console.log(reportContractor, 'reportContractor')

      DepoExpenseClosureService.sentPaymentDataForReport(report_form_data).then((res) => {
      // DepoShipmentCreationService.sentShipmentDataForReport(report_form_data).then((res) => {
        console.log(res, 'res')
        tableReportData = res.data.data
        console.log(tableReportData)

        setFetch(true)
        let rowDataList = []
        console.log(tableReportData,'tableReportData')
        setSearchFilterData(tableReportData)
        tableReportData.map((data, index) => {
          rowDataList.push({
            S_No: index + 1,
            Payment_Reference_No: data.invoice_sequence,
            Contractor_Name: data.payment_contractor_info.contractor_name,
            Contractor_Code: data.payment_contractor_info.contractor_code,
            Contractor_No: data.payment_contractor_info.contractor_number,
            Contractor_Freight: data.payment_contractor_info.freight_type == '2' ? 'Actual' : 'Budget',
            Tripsheet_Count: data.tripsheet_count,
            GST_Tax_Type:getGstTax(data.payment_contractor_info.gst_tax_type),
            TDS_Tax_Type:getTdsTax(data.payment_contractor_info.tds_tax_type),
            Invoice_No: data.sap_invoice_no || '-',
            Invoice_Posting_Date: data.invoice_posting_date || '-',
            Freight_Amount: data.freight_amount,
            Payment_Status: paymentStatus(data),
            Remarks: data.remarks || '-',
            Approval_Remarks: data.approval_remarks || '-',
            Reference_Text: data.reference_text || '-',
            Payment_Request_Date: data.created_date
          })
        })
        setRowData(rowDataList)
        setPending(false)
      })
    }
  }

  /* ==================== Access Part Start ========================*/
  const [screenAccess, setScreenAccess] = useState(false)
  let page_no = LogisticsProScreenNumberConstants.DepoModuleScreens.Depo_Final_Report

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
      name: 'Contr. Name',
      selector: (row) => row.Contractor_Name,
      sortable: true,
      center: true,
    },
    {
      name: 'Contr. Code',
      selector: (row) => row.Contractor_Code,
      sortable: true,
      center: true,
    },
    {
      name: 'Freight Type',
      selector: (row) => row.Contractor_Freight,
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
      name: 'Freight',
      selector: (row) => row.Freight_Amount,
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
      name: 'Reference',
      selector: (row) => row.Reference_Text,
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
      name: 'Invoice Date',
      selector: (row) => row.Invoice_Posting_Date,
      sortable: true,
      center: true,
    },
    {
      name: 'Remarks',
      selector: (row) => row.Remarks,
      // sortable: true,
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
                      value={defaultDate}
                      onChange={setDefaultDate}
                    />
                  </CCol>

                  <CCol xs={12} md={3}>
                    <CFormLabel htmlFor="VNum">Contractor Name</CFormLabel>
                    <SearchSelectComponent
                      size="sm"
                      className="mb-2"
                      onChange={(e) => {
                        onChangeFilter(e, 'contractor_id')
                      }}
                      label="Select Contractor Number"
                      noOptionsMessage="Contractor Not found"
                      search_type="depo_payment_report_contractor_name"
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
                      search_type="depo_payment_report_payment_status"
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
            </CCard> ) : ( <AccessDeniedComponent />
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

export default DepoFinalReport
