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
import TripSheetClosureService from 'src/Service/TripSheetClosure/TripSheetClosureService'
import ClosureCommonForm from './segments/ClosureCommonForm'
import UserLoginMasterService from 'src/Service/Master/UserLoginMasterService'
import { GetDateTimeFormat } from '../Depo/CommonMethods/CommonMethods'
import * as LogisticsProScreenNumberConstants from 'src/components/constants/LogisticsProScreenNumberConstants'
import AccessDeniedComponent from 'src/components/commoncomponent/AccessDeniedComponent'
import JavascriptInArrayComponent from 'src/components/commoncomponent/JavascriptInArrayComponent'

const TSSettlementReport = () => {
  const navigation = useNavigate()

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

  /* ==================== Access Part Start ========================*/
  const [screenAccess, setScreenAccess] = useState(false)
  let page_no = LogisticsProScreenNumberConstants.TripSettlementScreens.Tripsheet_Settlement_Closure_Report
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
    } else if (event_type == 'tripsheet_no') {
      if (selected_value) {
        setReportTSNo(selected_value)
      } else {
        setReportTSNo(0)
      }
    } else if (event_type == 'vehicle_type') {
      if (selected_value) {
        setReportVehicleType(selected_value)
      } else {
        setReportVehicleType(0)
      }
    }
  }

  const findUser = (id) => {
    let userName = ''
    if(id == '1') {
      userName = 'Admin'
    } else {
      userData.map((data,index)=>{
        if(data.user_id == id) {
          userName = data.username
        }
      })
    }
    return userName
  }

  const exportToCSV = () => { 
    if(rowData.length == 0){
      toast.warning('No Data Found..!')
      return false
    }
    let dateTimeString = GetDateTimeFormat(1)
    let fileName='LP_Trip_Settlement_Report_'+dateTimeString  
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
  const [reportVehicle, setReportVehicle] = useState(0)
  const [reportTSNo, setReportTSNo] = useState(0)
  const [userData, setUserData] = useState([])
  const [reportTSId, setReportTSId] = useState(0)
  const [reportVehicleType, setReportVehicleType] = useState(0)  
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

  const loadTripClosureReport = (fresh_type = '') => {

    if (fresh_type !== '1') {
      let report_form_data = new FormData()
      report_form_data.append('date_between', defaultDate)
      report_form_data.append('vehicle_no', 0)
      report_form_data.append('tripsheet_no', 0)
      report_form_data.append('vehicle_type', 0)
      report_form_data.append('user_id', user_id)

      TripSheetClosureService.sentSettlementDataForReport(report_form_data).then((res) => {
        console.log(res, 'res')
        tableReportData = res.data.data
        console.log(tableReportData,'tableReportData')

        setFetch(true)
        let rowDataList = []
        let filterData = tableReportData.filter(
          (data) => user_locations.indexOf(data.vehicle_location_id) != -1 && data.trip_sheet_info
        )
        // console.log(filterData)
        setSearchFilterData(filterData)
        rowDataList = ClosureCommonForm(filterData,'2')

        setRowData(rowDataList)
        setPending(false)
      })
    } else {
      if (defaultDate == null) {
        toast.warning('Date Filter Should not be empty..!')
        return false
      } else if (
        defaultDate == null &&
        reportVehicle == 0 &&
        reportTSNo == 0 &&
        reportVehicleType == 0
      ) {
        toast.warning('Choose atleast one filter type..!')
        return false
      }
      let report_form_data = new FormData()
      report_form_data.append('date_between', defaultDate)
      report_form_data.append('vehicle_no', reportVehicle)
      report_form_data.append('tripsheet_no', reportTSNo)
      report_form_data.append('trip_sheet_id', reportTSId)
      report_form_data.append('vehicle_type', reportVehicleType)
      report_form_data.append('user_id', user_id)

      console.log(defaultDate, 'defaultDate')
      console.log(reportVehicle, 'reportVehicle')
      console.log(reportVehicleType, 'reportVehicleType')
      console.log(reportTSNo, 'reportTSNo')

      TripSheetClosureService.sentSettlementDataForReport(report_form_data).then((res) => {
        console.log(res, 'res')
        tableReportData = res.data.data
        console.log(tableReportData)

        setFetch(true)
        let rowDataList = []
        let filterData = tableReportData.filter(
          (data) => user_locations.indexOf(data.vehicle_location_id) != -1 && data.trip_sheet_info
        )
        // console.log(filterData)
        setSearchFilterData(filterData)
        rowDataList = ClosureCommonForm(filterData,'2')

        setRowData(rowDataList)
        setPending(false)
      })
    }
  }

  useEffect(() => {
    loadTripClosureReport()
  }, [])

  useEffect(() => {
    UserLoginMasterService.getUser().then((res) => {
      let user_data = res.data.data
      console.log(user_data)
      setUserData(user_data)
    })
  },[])

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
      name: 'Driver Code',
      selector: (row) => row.Driver_Code,
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
      name: 'Vendor Pan Number',
      selector: (row) => row.Vendor_Pan_No,
      sortable: true,
      center: true,
    },
    {
      name: 'Vendor Mobile Number',
      selector: (row) => row.Vendor_Mobile_No,
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
      name: 'Trip Purpose',
      selector: (row) => row.Trip_Purpose,
      sortable: true,
      center: true,
    },
    {
      name: 'Trip Division',
      selector: (row) => row.Trip_Division,
      sortable: true,
      center: true,
    },
    {
      name: 'Advance Availability',
      selector: (row) => row.Advance_Availability,
      sortable: true,
      center: true,
    },
    {
      name: 'Driver Advance Amount',
      selector: (row) => row.Driver_Advance,
      sortable: true,
      center: true,
    },
    {
      name: 'Total Freight',
      selector: (row) => row.Total_Freight,
      sortable: true,
      center: true,
    },
    {
      name: 'Bank Advance',
      selector: (row) => row.Bank_Advance,
      sortable: true,
      center: true,
    },
    {
      name: 'Diesel Advance',
      selector: (row) => row.Diesel_Advance,
      sortable: true,
      center: true,
    },
    {
      name: 'Addon Availability',
      selector: (row) => row.Addon_Availability,
      sortable: true,
      center: true,
    },
    {
      name: 'RJSO Availability',
      selector: (row) => row.RJSO_Availability,
      sortable: true,
      center: true,
    },
    {
      name: 'Budgeted KM',
      selector: (row) => row.Budgeted_KM,
      sortable: true,
      center: true,
    },
    {
      name: 'Actual KM',
      selector: (row) => row.Actual_KM,
      sortable: true,
      center: true,
    },
    {
      name: 'Budgeted Mileage',
      selector: (row) => row.Budgeted_Mileage,
      sortable: true,
      center: true,
    },
    {
      name: 'Actual Mileage',
      selector: (row) => row.Actual_Mileage,
      sortable: true,
      center: true,
    },
    {
      name: 'Idle Hours',
      selector: (row) => row.Trip_Idle_Hours,
      sortable: true,
      center: true,
    },
    {
      name: 'Unloading Charges',
      selector: (row) => row.Unloading_Charges,
      sortable: true,
      center: true,
    },
    {
      name: 'Sub Delivery Charges',
      selector: (row) => row.Sub_Delivery_Charges,
      sortable: true,
      center: true,
    },
    {
      name: 'Weighment Charges',
      selector: (row) => row.Weighment_Charges,
      sortable: true,
      center: true,
    },
    {
      name: 'Freight Charges',
      selector: (row) => row.Freight_Charges,
      sortable: true,
      center: true,
    },
    {
      name: 'Diversion Return Charges',
      selector: (row) => row.Diversion_Return_Charges,
      sortable: true,
      center: true,
    },
    {
      name: 'Halting Charges',
      selector: (row) => row.Halting_Charges,
      sortable: true,
      center: true,
    },
    {
      name: 'Toll Amount',
      selector: (row) => row.Toll_Amount,
      sortable: true,
      center: true,
    },
    {
      name: 'Bata',
      selector: (row) => row.Bata,
      sortable: true,
      center: true,
    },
    {
      name: 'Municipal Charges',
      selector: (row) => row.Municipal_Charges,
      sortable: true,
      center: true,
    },
    {
      name: 'Registered Diesel Amount',
      selector: (row) => row.Registered_Diesel_Amount,
      sortable: true,
      center: true,
    },
    {
      name: 'Enroute Diesel Amount',
      selector: (row) => row.Enroute_Diesel_Amount,
      sortable: true,
      center: true,
    },
    {
      name: 'Port Entry Fee',
      selector: (row) => row.Port_Entry_Fee,
      sortable: true,
      center: true,
    },
    {
      name: 'Misc. Charges',
      selector: (row) => row.Misc_Charges,
      sortable: true,
      center: true,
    },
    {
      name: 'Fine Amount',
      selector: (row) => row.Fine_Amount,
      sortable: true,
      center: true,
    },
    {
      name: 'Maintenance Cost',
      selector: (row) => row.Maintenance_Cost,
      sortable: true,
      center: true,
    },
    {
      name: 'Loading Charges',
      selector: (row) => row.Loading_Charges,
      sortable: true,
      center: true,
    },
    {
      name: 'Tarpaulin Charges',
      selector: (row) => row.Tarpaulin_Charges,
      sortable: true,
      center: true,
    },
    {
      name: 'Low Tonnage Charges',
      selector: (row) => row.Low_Tonnage_Charges,
      sortable: true,
      center: true,
    },
    {
      name: 'Local Bata Amount',
      selector: (row) => row.Local_Bata_Amount,
      sortable: true,
      center: true,
    },
    {
      name: 'Halt Bata Amount',
      selector: (row) => row.Halt_Bata_Amount,
      sortable: true,
      center: true,
    },
    {
      name: 'Driver Expense',
      selector: (row) => row.Driver_Expense,
      sortable: true,
      center: true,
    },
    {
      name: 'RJ Bata Amount',
      selector: (row) => row.RJ_Bata_Amount,
      sortable: true,
      center: true,
    },
    {
      name: 'RJ Loading Charges',
      selector: (row) => row.RJ_Loading_Charges,
      sortable: true,
      center: true,
    }, {
      name: 'RJ Commision Charges',
      selector: (row) => row.RJ_Commision_Charges,
      sortable: true,
      center: true,
    }, {
      name: 'RJ Tarpaulin Charges',
      selector: (row) => row.RJ_Tarpaulin_Charges,
      sortable: true,
      center: true,
    }, {
      name: 'RJ Weighment Charges',
      selector: (row) => row.RJ_Weighment_Charges,
      sortable: true,
      center: true,
    }, {
      name: 'RJ Unloading Charges',
      selector: (row) => row.RJ_Unloading_Charges,
      sortable: true,
      center: true,
    }, {
      name: 'RJ Misc. Charges',
      selector: (row) => row.RJ_Misc_Charges,
      sortable: true,
      center: true,
    }, {
      name: 'RJ Municipal Charges',
      selector: (row) => row.RJ_Munic_Charges,
      sortable: true,
      center: true,
    }, {
      name: 'RJ Halt Charges',
      selector: (row) => row.RJ_Halt_Charges,
      sortable: true,
      center: true,
    }, {
      name: 'RJ Enrote Diesel Charges',
      selector: (row) => row.RJ_ED_Charges,
      sortable: true,
      center: true,
    },
    {
      name: 'FCI Atti Cooli Charges',
      selector: (row) => row.FCI_AttiCooli_Charges,
      sortable: true,
      center: true,
    },
    {
      name: 'FCI Extra Charges',
      selector: (row) => row.FCI_Extra_Charges,
      sortable: true,
      center: true,
    },
    {
      name: 'FCI Office Expense Charges',
      selector: (row) => row.FCI_OfficeExpense_Charges,
      sortable: true,
      center: true,
    },
    {
      name: 'FCI Gate Expense Charges',
      selector: (row) => row.FCI_GateExpense_Charges,
      sortable: true,
      center: true,
    },
    {
      name: 'FCI Weighment Charges',
      selector: (row) => row.FCI_Weighment_Charges,
      sortable: true,
      center: true,
    },
    {
      name: 'Halt Days', 
      selector: (row) => row.Halt_Days,
      sortable: true,
      center: true,
    },
    { 
      name: 'Driver Advance Sap Doc.No',
      selector: (row) => row.Driver_Advance_Sap_Document_No,
      sortable: true,
      center: true,
    },
    {
      name: 'Diesel Vendor Sap Doc.No',
      selector: (row) => row.Diesel_Vendor_Sap_Document_No,
      sortable: true,
      center: true,
    },
    {
      name: 'Total Freight Expense Sap Doc.No',
      selector: (row) => row.Total_Freight_Expense_Sap_Document_No,
      sortable: true,
      center: true,
    },
    {
      name: 'Bank Expense Sap Doc.No',
      selector: (row) => row.Bank_Expense_Sap_Document_No,
      sortable: true,
      center: true,
    },
    {
      name: 'Diesel Expense Sap Doc.No',
      selector: (row) => row.Diesel_Expense_Sap_Document_No,
      sortable: true,
      center: true,
    },
    {
      name: 'Trip Expense Sap Doc.No',
      selector: (row) => row.Trip_Expense_Sap_Document_No,
      sortable: true,
      center: true,
    },
    {
      name: 'Trip Expense Posting Date',
      selector: (row) => row.Trip_Expense_Posting_Date,
      sortable: true,
      center: true,
    },
    {
      name: 'TDS Having',
      selector: (row) => row.TDS_Having,
      sortable: true,
      center: true,
    },
    {
      name: 'TDS Type',
      selector: (row) => row.TDS_Type,
      sortable: true,
      center: true,
    },
    {
      name: 'SAP Remarks',
      selector: (row) => row.SAP_Remarks,
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
      name: 'Expense Remarks',
      selector: (row) => row.Expense_Remarks,
      sortable: true,
      center: true,
    },
    {
      name: 'Settlement Closure Clearance Date',
      selector: (row) => row.Settlement_Closure_Clearance_Date,
      sortable: true,
      center: true,
    },
    {
      name: 'Expense Closure Clearance Date',
      selector: (row) => row.Expense_Closure_Clearance_Date,
      sortable: true,
      center: true,
    },
    {
      name: 'Trip Income Remarks',
      selector: (row) => row.Trip_Income_Remarks,
      sortable: true,
      center: true,
    },
    {
      name: 'Trip Settlement Remarks',
      selector: (row) => row.Trip_Settlement_Remarks,
      sortable: true,
      center: true,
    },
    {
      name: 'Expense Closure Cleared By',
      selector: (row) => findUser(row.Expense_Closure_Cleared_By),
      sortable: true,
      center: true,
    },
    {
      name: 'Settlement Closure Cleared By',
      selector: (row) => findUser(row.Settlement_Closure_Cleared_By),
      sortable: true,
      center: true,
    },
    {
      name: 'Trip Income Posting Date',
      selector: (row) => row.Trip_Income_Posting_Date,
      sortable: true,
      center: true,
    },
    {
      name: 'Trip MMD Income',
      selector: (row) => row.Trip_MMD_Income_Amount,
      sortable: true,
      center: true,
    },
    {
      name: 'Trip NLFD Income',
      selector: (row) => row.Trip_NLFD_Income_Amount,
      sortable: true,
      center: true,
    },
    {
      name: 'Trip NLCD Income',
      selector: (row) => row.Trip_NLCD_Income_Amount,
      sortable: true,
      center: true,
    },
    {
      name: 'Trip RJSO Income',
      selector: (row) => row.Trip_RJSO_Income_Amount,
      sortable: true,
      center: true,
    },
    {
      name: 'Trip Income Amount',
      selector: (row) => row.Trip_Income_Amount,
      sortable: true,
      center: true,
    },
    {
      name: 'Trip Expense',
      selector: (row) => row.Trip_Expense,
      sortable: true,
      center: true,
    },
    {
      name: 'Trip P & L',
      selector: (row) => row.Trip_Profit_Loss,
      sortable: true,
      center: true,
    },
    {
      name: 'NLFD Income Sap Doc.No',
      selector: (row) => row.Trip_NLFD_Income_Sap_Document_No,
      sortable: true,
      center: true,
    },
    {
      name: 'NLCD Income Sap Doc.No',
      selector: (row) => row.Trip_NLCD_Income_Sap_Document_No,
      sortable: true,
      center: true,
    },
    {
      name: 'RJSO Income Sap Doc.No',
      selector: (row) => row.Trip_RJSO_Income_Sap_Document_No,
      sortable: true,
      center: true,
    },
    {
      name: 'MMD Income Sap Doc.No',
      selector: (row) => row.Trip_MMD_Income_Sap_Document_No,
      sortable: true,
      center: true,
    },
    {
      name: 'MMD Income Sap TDS Doc.No',
      selector: (row) => row.Trip_MMD_Income_Sap_TDS_Document_No,
      sortable: true,
      center: true,
    },
    {
      name: 'NLFD Income Base Doc.No',
      selector: (row) => row.NLFD_BASE_DOC,
      sortable: true,
      center: true,
    },
    {
      name: 'NLCD Income Base Doc.No',
      selector: (row) => row.NLCD_BASE_DOC,
      sortable: true,
      center: true,
    },
    {
      name: 'MMD Income Base Doc.No',
      selector: (row) => row.NLMMD_BASE_DOC,
      sortable: true,
      center: true,
    },
    {
      name: 'NLIF Income Base Doc.No',
      selector: (row) => row.NLIF_BASE_DOC,
      sortable: true,
      center: true,
    },
    {
      name: 'NLMD Income Base Doc.No',
      selector: (row) => row.NLMD_BASE_DOC,
      sortable: true,
      center: true,
    },
    {
      name: 'NLDV Income Base Doc.No',
      selector: (row) => row.NLDV_BASE_DOC,
      sortable: true,
      center: true,
    },
    {
      name: 'NLSD Income Base Doc.No',
      selector: (row) => row.NLSD_BASE_DOC,
      sortable: true,
      center: true,
    },
    {
      name: 'NLFD Income Addi. Doc.No',
      selector: (row) => row.NLFD_ADD_DOC,
      sortable: true,
      center: true,
    },
    {
      name: 'NLCD Income Addi. Doc.No',
      selector: (row) => row.NLCD_ADD_DOC,
      sortable: true,
      center: true,
    },
    {
      name: 'MMD Income Addi. Doc.No',
      selector: (row) => row.NLMMD_ADD_DOC,
      sortable: true,
      center: true,
    },
    {
      name: 'NLIF Income Addi. Doc.No',
      selector: (row) => row.NLIF_ADD_DOC,
      sortable: true,
      center: true,
    },
    {
      name: 'NLMD Income Addi. Doc.No',
      selector: (row) => row.NLMD_ADD_DOC,
      sortable: true,
      center: true,
    },
    {
      name: 'NLDV Income Addi. Doc.No',
      selector: (row) => row.NLDV_ADD_DOC,
      sortable: true,
      center: true,
    },
    {
      name: 'NLSD Income Addi. Doc.No',
      selector: (row) => row.NLSD_ADD_DOC,
      sortable: true,
      center: true,
    },
    {
      name: 'Status',
      selector: (row) => row.Status,
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
                    <CFormLabel htmlFor="VNum">Vehicle Type</CFormLabel>
                    <SearchSelectComponent
                      size="sm"
                      className="mb-2"
                      onChange={(e) => {
                        onChangeFilter(e, 'vehicle_type')
                      }}
                      label="Select Vehicle Type"
                      noOptionsMessage="Vehicle Type Not found"
                      search_type="settlement_report_vehicle_type"
                      search_data={searchFilterData}
                    />
                  </CCol>

                  <CCol xs={12} md={3}>
                    <CFormLabel htmlFor="VNum">Vehicle Number</CFormLabel>
                    <SearchSelectComponent
                      size="sm"
                      className="mb-2"
                      onChange={(e) => {
                        onChangeFilter(e, 'vehicle_no')
                      }}
                      label="Select Vehicle Number"
                      noOptionsMessage="Vehicle Not found"
                      search_type="settlement_report_vehicle_number"
                      search_data={searchFilterData}
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
                      search_type="settlement_report_tripsheet_number"
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
                        loadTripClosureReport('1')
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
            </CCard> ) : ( <AccessDeniedComponent />
          )} 
        </>
      )}
    </>
  )
}

export default TSSettlementReport
