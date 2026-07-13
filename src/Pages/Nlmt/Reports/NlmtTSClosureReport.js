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
import NLMTReportSearchSelectComponent from './NLMTReportSearchSelectComponent'
import FileSaver from 'file-saver'
import * as XLSX from 'xlsx';
import { useRef } from 'react'
import { useReactToPrint } from 'react-to-print'
import { GetDateTimeFormat } from '../CommonMethods/CommonMethods'
import * as NlmtScreenAccessCodes from 'src/components/constants/NlmtScreenAccessCodes'
import JavascriptInArrayComponent from 'src/components/commoncomponent/JavascriptInArrayComponent'
import AccessDeniedComponent from 'src/components/commoncomponent/AccessDeniedComponent'
import NlmtTripSheetClosureService from 'src/Service/Nlmt/TripSheetClosure/NlmtTripSheetClosureService'

const NlmtTSClosureReport = () => {

  const user_info_json = localStorage.getItem('user_info')
  const user_info = JSON.parse(user_info_json)
  /* Get User Id From Local Storage */
  const user_id = user_info.user_id
  const is_admin = user_info.user_id == 1 && user_info.is_admin == 1
  console.log(is_admin, 'is_admin')

  /* ==================== Access Part Start ========================*/
  const [screenAccess, setScreenAccess] = useState(false)
  let page_no = NlmtScreenAccessCodes.NlmtReportScreens.NLMT_Closure_Report

  useEffect(() => {

    if (user_info.is_admin == 1 || JavascriptInArrayComponent(page_no, user_info.page_permissions)) {
      console.log('screen-access-allowed')
      setScreenAccess(true)
    } else {
      console.log('screen-access-not-allowed')
      setScreenAccess(false)
    }

  }, [])
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
    } else if (event_type == 'tripsheet_no') {
      if (selected_value) {
        setReportTSNo(selected_value)
      } else {
        setReportTSNo(0)
      }
    } else if (event_type == 'vendor_code') {
      if (selected_value) {
        setReportVendorCode(selected_value)
      } else {
        setReportVendorCode(0)
      }
    } else if (event_type == 'vehicle_type') {
      if (selected_value) {
        setReportVehicleType(selected_value)
      } else {
        setReportVehicleType(0)
      }
    }
  }

  const exportToCSV = () => {
    console.log(rowData, 'exportCsvData')
    if (!rowData || rowData.length === 0) {
      toast.warning('No data to export!')
      return
    }
    let dateTimeString = GetDateTimeFormat(1)
    let fileName = 'NLMT_Closure_Report_' + dateTimeString
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';
    const ws = XLSX.utils.json_to_sheet(rowData);
    const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  }

  const [rowData, setRowData] = useState([])
  const [searchFilterData, setSearchFilterData] = useState([])
  const [fetch, setFetch] = useState(false)

  const [pending, setPending] = useState(true)

  /* Report Variables */
  const [reportVehicle, setReportVehicle] = useState(0)
  const [reportTSNo, setReportTSNo] = useState(0)
  const [reportVendorCode, setReportVendorCode] = useState(0)
  const [reportVehicleType, setReportVehicleType] = useState(0)


  let tableData = []
  let tableReportData = []

  const vehicleType = (id, data) => {
    console.log(data, 'vehicleType-data')
    if (id == 21) {
      return 'Own'
    } else if (id == 22) {
      return 'Hire'
    } else {
      return 'Party'
    }
  }

  /* Function For Closure Status Find */
  const ownClosureStatus = (id) => {

    if (id == 1) {
      return 'Expense Requeted'
    } else if (id == 2) {
      return 'Expense Rejected'
    } else if (id == 3) {
      return 'Expense Approved'
    } else if (id == 6) {
      return 'Payment Approved'
    } else if (id == 7) {
      return 'Income Requeted'
    } else if (id == 8) {
      return 'Income Rejected'
    } else if (id == 9) {
      return 'Income Approved'
    } else {
      return '----'
    }
  }

  /* Function For Approval Status Find */
  const hireClosureStatus = (id) => {
    if (id == 1) {
      return 'Expense Requeted'
    } else if (id == 2) {
      return 'Deduction Approved'
    } else if (id == 3) {
      return 'Deduction Rejected'
    } else if (id == 4) {
      return 'Expense Rejected'
    } else if (id == 5) {
      return 'Expense Approved'
    } else {
      return '----'
    }
  }

  /* Function For Approval Status Find */
  const approvalStatus = (id) => {
    if (id == 1) {
      return 'Deduction Approved'
    } else if (id == 2) {
      return 'Deduction Rejected'
    } else if (id == 0) {
      return 'Approval Pending'
    } else if (id == 3) {
      return 'Expense Approved'
    } else if (id == 4) {
      return 'Expense Rejected'
    } else {
      return '----'
    }
  }

  /* Function For Payment Status Find */
  const paymentStatus = (id) => {
    if (id == 1) {
      return 'Payment Submitted'
    } else if (id == 2) {
      return 'Payment Validated'
    } else if (id == 3) {
      return 'Payment Posted'
    } else {
      return '---'
    }
  }

  /* Function For Income Status Find */
  const incomeStatus = (id) => {
    if (id == 1) {
      return 'Income Requested'
    } else if (id == 2) {
      return 'Income Rejected'
    } else if (id == 3) {
      return 'Expense Claimed'
    } else if (id == 4) {
      return 'Income Claimed'
    } else {
      return '---'
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

  const loadTripShipmentReport = (fresh_type = '') => {
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

      NlmtTripSheetClosureService.getNlmtClosureDataForReport().then((res) => {
        tableReportData = res.data.data
        console.log(tableReportData, 'getNlmtClosureDataForReport')

        setFetch(true)
        let rowDataList = []
        let filterData = tableReportData.filter(
          (data) => user_locations.indexOf(data.gatein_info.vehicle_location_id) != -1
        )
        // console.log(filterData)
        setSearchFilterData(filterData)
        filterData.map((data, index) => {
          rowDataList.push({
            sno: index + 1,
            /* Trip Info */
            Tripsheet_Date: data.trip_sheet_info.created_date,
            Tripsheet_No: data.tripsheet_no,
            Vehicle_No: data.vehicle_number,
            Vehicle_Type: vehicleType(data.vehicle_info.vehicle_type_id),
            Vehicle_Capacity: data.vehicle_info.vehicle_capacity_details.definition_list_code,
            Driver_Name: data.driver_id ? data.driver_info?.driver_name : data.gatein_info.driver_name,
            Driver_Mobile_Number: data.driver_id ? data.driver_info?.driver_phone_1 : data.gatein_info.driver_phone_1,
            Halt_Days: data.halt_days,

            /* Shipment Info */
            Shipment_Count: data.shipment_info?.length,
            Shipment_No: data.shipment_no,

            /* Vendor Info */
            Vendor_Name: data.driver_id ? data.driver_info?.driver_name : data.vendor_info?.owner_name,
            Vendor_Code: data.driver_id ? data.driver_info?.driver_code : data.vendor_info?.vendor_code,

            /* Expenses Info */
            Own_driver_expenses: data.driver_expenses,
            Unloading_Charges: data.unloading_charges,
            Freight_Charges: data.freight_charges,
            Halting_Charges: data.halting_charges,
            Toll_Amount: data.toll_amount,
            Bata: data.bata,
            Other_Charges: data.misc_charges,
            expense_form: data.expense_form ? (
              <a style={{ color: 'black' }} target='_blank' rel="noreferrer" href={data.expense_form}>
                <i className="fa fa-eye" aria-hidden="true"></i>
              </a>
            ) : <>--</>,
            expense: data.expense,
            expense_Sap_Doc: data.expense_sap_document_no,
            SAP_Expense_Amount: data.sap_expense_amount,
            SAP_Expense_Text: data.sap_text,
            Hire_Expense_Percentage: data.advance_amount ? data.advance_amount : '-',
            SAP_Expense_Posting_Date: data.sap_expense_date,
            SAP_Expense_Remarks: data.remarks,
            Expense_Closure_Date: data.created_date,
            Closure_Status: data.driver_id ? ownClosureStatus(data.own_closure_status) : hireClosureStatus(data.hire_closure_status),
            Closure_Updation_Time: data.closure_updation_time,
            Expense_Ref_No: data.driver_id ? '-' : data.supplier_ref_no,
            Expense_Ref_Date: data.driver_id ? '-' : data.supplier_posting_date,

            /* Deduction Info */
            Deduction_Amount: data.diversion_return_charges,
            Deduction_Remarks: data.driver_id ? '-' : data.deduction_approval_remarks,
            Deduction_Approval_By: data.driver_id ? '-' : data.deduction_approval_by,
            Deduction_Approval_Time: data.driver_id ? '-' : data.deduction_approval_at,
            Deduction_SAP_Doc: data.deduction_doc,
            Deduction_Reference: data.ded_ref,
            Deduction_Remarks: data.ded_remarks,
            Deduction_Costcenter: data.cost_center,
            Deduction_Posting_Date: data.ded_posting_date,

            /* Expense Approval Info */
            Expense_Approval_Remarks: data.expense_approval_remarks,
            Expense_Approval_By: data.expense_approval_by,
            Expense_Approval_Time: data.expense_approval_at,
            Expense_Approval_Status: approvalStatus(data.approval_status),

            /* Tax Info */
            GST_Tax_Type: data.gst_tax_type == 'Empty' ? 'No Tax' : (data.gst_tax_type && data.gst_tax_type != '' ? data.gst_tax_type : '-'),
            TDS_Having: data.tds_having == 1 ? 'YES' : 'No',
            TDS_Tax_Type: data.tds_having == 1 ? data.vendor_tds : '-',
            HSN_Code: data.vendor_hsn,

            /* Income info */
            income: data.income,
            Income_Request_By: data.income_request_by,
            Income_Request_At: data.income_request_at,
            SAP_Income_Text: data.income_sap_text,
            SAP_Income_Posting_Date: data.income_posting_date,
            SAP_Income_Remarks: data.income_remarks,
            Profit_and_Loss: data.profit_and_loss,
            NLMT_Income_Status: data.driver_id ? incomeStatus(data.nlmt_income_status) : '-',

            /* Income Approval Info */
            Income_Approval_Remarks: data.driver_id ? data.deduction_approval_remarks : '-',
            Income_Approval_By: data.driver_id ? data.deduction_approval_by : '-',
            Income_Approval_Time: data.driver_id ? data.deduction_approval_at : '-',
            NLMT_Expense_Vendor_Code: data.driver_id ? data.nlmt_div_expense_vendor_code : '-',
            NLMT_Income_Vendor_Code: data.driver_id ? data.nlmt_div_income_vendor_code : '-',
            NLMT_Division_Expense_Ref_No: data.driver_id ? data.supplier_ref_no : '-',
            NLMT_Division_Expense_Ref_Date: data.driver_id ? data.supplier_posting_date : '-',
            SAP_Income_Doc: data.income_sap_document_no,
            NLMT_Div_SAP_Expense_Doc_No: data.nlmt_div_sap_expense_doc_no,

            /* Payment Info */
            Payment_Status: paymentStatus(data.payment_status),
            Driver_Payment_Remarks: data.driver_payment_remarks,
            Driver_Payment_By: data.driver_payment_by,
            Driver_Payment_At: data.driver_payment_at,
            Driver_Payment_Posting_Date: data.driver_payment_posting_date,
            Driver_Payment_Sap_Text: data.driver_payment_sap_text,
            Driver_Payment_Sap_Document_No: data.driver_payment_sap_document_no,

          })
        })
        setFetch(true)
        setRowData(rowDataList)
        setPending(false)
      })
        .catch((err) => {
          console.error('NLMT Closure Report Error:', err)
          toast.error('Failed to load advance report. Please try again.')
          setFetch(true)
        })
    } else {
      if (defaultDate == null) {
        setFetch(true)
        toast.warning('Date Filter Should not be empty..!')
        return false
      } else if (
        defaultDate == null &&
        reportVehicle == 0 &&
        reportVendorCode == 0 &&
        reportTSNo == 0 &&
        reportVehicleType == 0
      ) {
        setFetch(true)
        toast.warning('Choose atleast one filter type..!')
        return false
      }
      let report_form_data = new FormData()
      report_form_data.append('date_between', defaultDate)
      report_form_data.append('vehicle_no', reportVehicle)
      report_form_data.append('vendor_code', reportVendorCode)
      report_form_data.append('tripsheet_no', reportTSNo)
      report_form_data.append('vehicle_type', reportVehicleType)

      console.log(defaultDate, 'defaultDate')
      console.log(reportVehicle, 'reportVehicle')
      console.log(reportVendorCode, 'reportVendorCode')
      console.log(reportTSNo, 'reportTSNo')
      console.log(reportVehicleType, 'reportVehicleType')

      NlmtTripSheetClosureService.sentNlmtClosureDataForReport(report_form_data).then((res) => {
        console.log(res, 'res')
        tableReportData = res.data.data
        console.log(tableReportData)

        setFetch(true)
        let rowDataList = []
        let filterData = tableReportData.filter(
          (data) => user_locations.indexOf(data.gatein_info.vehicle_location_id) != -1
        )
        // console.log(filterData)
        setSearchFilterData(filterData)
        filterData.map((data, index) => {
          rowDataList.push({
            sno: index + 1,
            /* Trip Info */
            Tripsheet_Date: data.trip_sheet_info.created_date,
            Tripsheet_No: data.tripsheet_no,
            Vehicle_No: data.vehicle_number,
            Vehicle_Type: vehicleType(data.vehicle_info.vehicle_type_id),
            Vehicle_Capacity: data.vehicle_info.vehicle_capacity_details.definition_list_code,
            Driver_Name: data.driver_id ? data.driver_info?.driver_name : data.gatein_info.driver_name,
            Driver_Mobile_Number: data.driver_id ? data.driver_info?.driver_phone_1 : data.gatein_info.driver_phone_1,
            Halt_Days: data.halt_days,

            /* Shipment Info */
            Shipment_Count: data.shipment_info?.length,
            Shipment_No: data.shipment_no,

            /* Vendor Info */
            Vendor_Name: data.driver_id ? data.driver_info?.driver_name : data.vendor_info?.owner_name,
            Vendor_Code: data.driver_id ? data.driver_info?.driver_code : data.vendor_info?.vendor_code,

            /* Expenses Info */
            Own_driver_expenses: data.driver_expenses,
            Unloading_Charges: data.unloading_charges,
            Freight_Charges: data.freight_charges,
            Halting_Charges: data.halting_charges,
            Toll_Amount: data.toll_amount,
            Bata: data.bata,
            Other_Charges: data.misc_charges,
            expense_form: data.expense_form ? (
              <a style={{ color: 'black' }} target='_blank' rel="noreferrer" href={data.expense_form}>
                <i className="fa fa-eye" aria-hidden="true"></i>
              </a>
            ) : <>--</>,
            expense: data.expense,
            expense_Sap_Doc: data.expense_sap_document_no,
            SAP_Expense_Amount: data.sap_expense_amount,
            SAP_Expense_Text: data.sap_text,
            Hire_Expense_Percentage: data.advance_amount ? data.advance_amount : '-',
            SAP_Expense_Posting_Date: data.sap_expense_date,
            SAP_Expense_Remarks: data.remarks,
            Expense_Closure_Date: data.created_date,
            Closure_Status: data.driver_id ? ownClosureStatus(data.own_closure_status) : hireClosureStatus(data.hire_closure_status),
            Closure_Updation_Time: data.closure_updation_time,
            Expense_Ref_No: data.driver_id ? '-' : data.supplier_ref_no,
            Expense_Ref_Date: data.driver_id ? '-' : data.supplier_posting_date,

            /* Deduction Info */
            Deduction_Amount: data.diversion_return_charges,
            Deduction_Remarks: data.driver_id ? '-' : data.deduction_approval_remarks,
            Deduction_Approval_By: data.driver_id ? '-' : data.deduction_approval_by,
            Deduction_Approval_Time: data.driver_id ? '-' : data.deduction_approval_at,
            Deduction_SAP_Doc: data.deduction_doc,
            Deduction_Reference: data.ded_ref,
            Deduction_Remarks: data.ded_remarks,
            Deduction_Costcenter: data.cost_center,
            Deduction_Posting_Date: data.ded_posting_date,

            /* Expense Approval Info */
            Expense_Approval_Remarks: data.expense_approval_remarks,
            Expense_Approval_By: data.expense_approval_by,
            Expense_Approval_Time: data.expense_approval_at,
            Expense_Approval_Status: approvalStatus(data.approval_status),

            /* Tax Info */
            GST_Tax_Type: data.gst_tax_type == 'Empty' ? 'No Tax' : (data.gst_tax_type && data.gst_tax_type != '' ? data.gst_tax_type : '-'),
            TDS_Having: data.tds_having == 1 ? 'YES' : 'No',
            TDS_Tax_Type: data.tds_having == 1 ? data.vendor_tds : '-',
            HSN_Code: data.vendor_hsn,

            /* Income info */
            income: data.income,
            Income_Request_By: data.income_request_by,
            Income_Request_At: data.income_request_at,
            SAP_Income_Text: data.income_sap_text,
            SAP_Income_Posting_Date: data.income_posting_date,
            SAP_Income_Remarks: data.income_remarks,
            Profit_and_Loss: data.profit_and_loss,
            NLMT_Income_Status: data.driver_id ? incomeStatus(data.nlmt_income_status) : '-',

            /* Income Approval Info */
            Income_Approval_Remarks: data.driver_id ? data.deduction_approval_remarks : '-',
            Income_Approval_By: data.driver_id ? data.deduction_approval_by : '-',
            Income_Approval_Time: data.driver_id ? data.deduction_approval_at : '-',
            NLMT_Expense_Vendor_Code: data.driver_id ? data.nlmt_div_expense_vendor_code : '-',
            NLMT_Income_Vendor_Code: data.driver_id ? data.nlmt_div_income_vendor_code : '-',
            NLMT_Division_Expense_Ref_No: data.driver_id ? data.supplier_ref_no : '-',
            NLMT_Division_Expense_Ref_Date: data.driver_id ? data.supplier_posting_date : '-',
            SAP_Income_Doc: data.income_sap_document_no,
            NLMT_Div_SAP_Expense_Doc_No: data.nlmt_div_sap_expense_doc_no,

            /* Payment Info */
            Payment_Status: paymentStatus(data.payment_status),
            Driver_Payment_Remarks: data.driver_payment_remarks,
            Driver_Payment_By: data.driver_payment_by,
            Driver_Payment_At: data.driver_payment_at,
            Driver_Payment_Posting_Date: data.driver_payment_posting_date,
            Driver_Payment_Sap_Text: data.driver_payment_sap_text,
            Driver_Payment_Sap_Document_No: data.driver_payment_sap_document_no,

          })
        })
        setRowData(rowDataList)
        setPending(false)
      })
        .catch((err) => {
          console.error('NLMT Closure Report Error:', err)
          toast.error('Failed to load advance report. Please try again.')
          setFetch(true)
        })
    }
  }

  useEffect(() => {
    loadTripShipmentReport()
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
      name: 'TS Date',
      selector: (row) => row.Tripsheet_Date,
      sortable: true,
      center: true,
    },
    {
      name: 'Veh. No',
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
      name: 'Vendor Name',
      selector: (row) => row.Vendor_Name,
      sortable: true,
      center: true,
    },
    {
      name: 'Code',
      selector: (row) => row.Vendor_Code,
      sortable: true,
      center: true,
    },
    {
      name: 'Expense',
      selector: (row) => row.expense,
      sortable: true,
      center: true,
    },
    {
      name: 'Attach.',
      selector: (row) => row.expense_form,
      sortable: true,
      center: true,
    },
    {
      name: 'Exp. Status',
      selector: (row) => row.Closure_Status,
      sortable: true,
      center: true,
    },
    {
      name: 'Appr. Status',
      selector: (row) => row.Approval_Status,
      sortable: true,
      center: true,
    },
    {
      name: 'Closure Status',
      selector: (row) => row.Payment_Status,
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
      name: 'Exp. Date',
      selector: (row) => row.Expense_Closure_Date,
      sortable: true,
      center: true,
    },
  ]

  function getCurrentDate(separator = '') {
    let newDate = new Date()
    let date = newDate.getDate()
    let month = newDate.getMonth() + 1
    let year = newDate.getFullYear()

    return `${year}${separator}${month < 10 ? `0${month}` : `${month}`}${separator}${date < 10 ? `0${date}` : `${date}`
      }`
  }

  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
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
                      <CFormLabel htmlFor="VNum">Vehicle Type</CFormLabel>
                      <NLMTReportSearchSelectComponent
                        size="sm"
                        className="mb-2"
                        onChange={(e) => {
                          onChangeFilter(e, 'vehicle_type')
                        }}
                        label="Select Vehicle Type"
                        noOptionsMessage="Vehicle Type Not found"
                        search_type="nlmt_closure_report_vehicle_type"
                        search_data={searchFilterData}
                      />
                    </CCol>

                    <CCol xs={12} md={3}>
                      <CFormLabel htmlFor="VNum">Vehicle Number</CFormLabel>
                      <NLMTReportSearchSelectComponent
                        size="sm"
                        className="mb-2"
                        onChange={(e) => {
                          onChangeFilter(e, 'vehicle_no')
                        }}
                        label="Select Vehicle Number"
                        noOptionsMessage="Vehicle Not found"
                        search_type="nlmt_shipment_report_vehicle_number"
                        search_data={searchFilterData}
                      />
                    </CCol>

                    <CCol xs={12} md={3}>
                      <CFormLabel htmlFor="VNum">Tripsheet Number</CFormLabel>
                      <NLMTReportSearchSelectComponent
                        size="sm"
                        className="mb-2"
                        onChange={(e) => {
                          onChangeFilter(e, 'tripsheet_no')
                        }}
                        label="Select Tripsheet Number"
                        noOptionsMessage="Tripsheet Not found"
                        search_type="nlmt_shipment_report_tripsheet_number"
                        search_data={searchFilterData}
                      />
                    </CCol>

                    <CCol xs={12} md={3}>
                      <CFormLabel htmlFor="VNum">Vendor Name</CFormLabel>
                      <NLMTReportSearchSelectComponent
                        size="sm"
                        className="mb-2"
                        onChange={(e) => {
                          onChangeFilter(e, 'vendor_code')
                        }}
                        label="Select Vendor Name"
                        noOptionsMessage="Vendor name Not found"
                        search_type="nlmt_closure_report_vendor_name"
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
                          loadTripShipmentReport('1')
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
            </>
          ) : (
            <AccessDeniedComponent />
          )}
        </>
      )}
    </>
  )
}

export default NlmtTSClosureReport
