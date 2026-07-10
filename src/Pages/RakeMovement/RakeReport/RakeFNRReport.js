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

import AccessDeniedComponent from 'src/components/commoncomponent/AccessDeniedComponent'
import * as LogisticsProScreenNumberConstants from 'src/components/constants/LogisticsProScreenNumberConstants'
import JavascriptInArrayComponent from 'src/components/commoncomponent/JavascriptInArrayComponent'
import { GetDateTimeFormat } from 'src/Pages/Depo/CommonMethods/CommonMethods'
import RakeTripsheetCreationService from 'src/Service/RakeMovement/RakeTripsheetCreation/RakeTripsheetCreationService'

const RakeFNRReport = () => {
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

  const onChangeFilter = (event, event_type) => {
    var selected_value = event.value
    console.log(selected_value, 'selected_value')

    if (event_type == 'fnr_no') {
      if (selected_value) {
        setReportFNRNo(selected_value)
      } else {
        setReportFNRNo(0)
      }
    } else if (event_type == 'vendor_name') {
      if (selected_value) {
        setReportVendorId(selected_value)
      } else {
        setReportVendorId(0)
      }
    } 
  }

  const exportToCSV = () => {
    if (defaultDate == null) {
      toast.warning('Date Filter Should not be empty..!')
      return false
    } else if (
      defaultDate == null &&
      reportFNRNo == 0 &&
      reportVendorId == 0  
    ) {
      toast.warning('Choose atleast one filter type..!')
      return false
    }
    console.log(rowData,'exportCsvData')
    let dateTimeString = GetDateTimeFormat(1)
    let fileName='Rake_FNR_Report_'+dateTimeString
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
  const [reportFNRNo, setReportFNRNo] = useState(0) 
  const [reportVendorId, setReportVendorId] = useState(0)   
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

  const TotalValueFinder = (data, type) => {
    let totalQuantity = 0
    let totalBaseFreight = 0
    let totalAdditionalFreight = 0
    let totalDeduction = 0
    let totalFreight = 0

    if(data.length > 0){
      data.map((vv,kk)=>{
        totalQuantity += Number(vv.total_qty)
        totalBaseFreight += Number(vv.budget_freight)
        totalAdditionalFreight += Number(vv.additional_freight)
        totalDeduction += Number(vv.deduction)
        totalFreight += Number(vv.total_freight)
      })
    }

    console.log(totalQuantity,'TotalValueFinder-totalQuantity')
    console.log(totalBaseFreight,'TotalValueFinder-totalBaseFreight')
    console.log(totalAdditionalFreight,'TotalValueFinder-totalAdditionalFreight')
    console.log(totalDeduction,'TotalValueFinder-totalDeduction')
    console.log(totalFreight,'TotalValueFinder-totalFreight')

    if(type == 1){
      return parseFloat(totalQuantity).toFixed(2)
    } else if(type == 2){
      return parseFloat(totalBaseFreight).toFixed(2)
    } else if(type == 3){
      return parseFloat(totalAdditionalFreight).toFixed(2)
    } else if(type == 4){
      return parseFloat(totalDeduction).toFixed(2)
    } else if(type == 5){
      return parseFloat(totalFreight).toFixed(2)
    } else {
      return 0
    }
  }

  const loadTripSheetReport = (fresh_type = '') => {

    if (fresh_type !== '1') {

      RakeTripsheetCreationService.getFNRDataForReport().then((res) => {
      // RakeTripsheetCreationService.getTripsheetDataForReport().then((res) => {
        tableReportData = res.data.data
        console.log(tableReportData,'getFNRDataForReport')

        setFetch(true)
        let rowDataList = []

        setSearchFilterData(tableReportData)
        tableReportData.map((data, index) => {
          rowDataList.push({
            sno: index + 1,
            FNR_No: data.fnr_no,
            Tripsheet_No: data.tripsheet_no,
            VA_No: data.pp_va_no,
            Migo_No: data.migo_no,
            Migo_Date: data.migo_date,
            Vehicle_No: data.truck_no,
            Quantity_In_MTS: data.total_qty,
            Base_Freight: data.budget_freight,
            Additional_Freight: data.additional_freight,
            Deduction: data.deduction,
            Remarks: data.remarks,
            Total_Freight: data.total_freight,
            Expense_Date: data.created_date,
            Vendor_Code: data.vendor_code, 
            Vendor_Name: data.tripsheet_creation_vendor_info ? data.tripsheet_creation_vendor_info.v_name : 'Blocked / Not Found',
            Vendor_Name2: data.tripsheet_creation_vendor_info ? data.tripsheet_creation_vendor_info.v_name2 : 'Blocked / Not Found',
          })
          if(tableReportData.length == index+1){
            rowDataList.push({
              sno: '-',
              FNR_No: '-',
              Tripsheet_No: '-',
              VA_No: '-',
              Migo_No: '-',
              Migo_Date: '-',
              Vehicle_No: 'Total',
              Quantity_In_MTS: TotalValueFinder(tableReportData,1),
              Base_Freight: TotalValueFinder(tableReportData,2),
              Additional_Freight: TotalValueFinder(tableReportData,3),
              Deduction: TotalValueFinder(tableReportData,4),
              Remarks: '-',
              Total_Freight: TotalValueFinder(tableReportData,5),
              Expense_Date: '-',
              Vendor_Code: '-',
              Vendor_Name: '-',
              Vendor_Name2: '-',              
            })
          }
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
      }  
      let report_form_data = new FormData()
      report_form_data.append('date_between', defaultDate)
     
      report_form_data.append('fnr_no', reportFNRNo)
      report_form_data.append('vendor_id', reportVendorId)
      
      console.log(defaultDate, 'defaultDate')
      
      console.log(reportFNRNo, 'reportFNRNo')
      console.log(reportVendorId, 'reportVendorId')
       

      RakeTripsheetCreationService.sentFNRDataForReport(report_form_data).then((res) => {
        console.log(res, 'res')
        tableReportData = res.data.data
        console.log(tableReportData)

        setFetch(true)
        let rowDataList = []

        setSearchFilterData(tableReportData)
        tableReportData.map((data, index) => {
          rowDataList.push({
            sno: index + 1,
            FNR_No: data.fnr_no,
            Tripsheet_No: data.tripsheet_no,
            VA_No: data.pp_va_no,
            Migo_No: data.migo_no,
            Migo_Date: data.migo_date,
            Vehicle_No: data.truck_no,
            Quantity_In_MTS: data.total_qty,
            Base_Freight: data.budget_freight,
            Additional_Freight: data.additional_freight,
            Deduction: data.deduction,
            Remarks: data.remarks,
            Total_Freight: data.total_freight,
            Expense_Date: data.created_date,
            Vendor_Code: data.vendor_code, 
            Vendor_Name: data.tripsheet_creation_vendor_info ? data.tripsheet_creation_vendor_info.v_name : 'Blocked / Not Found',
            Vendor_Name2: data.tripsheet_creation_vendor_info ? data.tripsheet_creation_vendor_info.v_name2 : 'Blocked / Not Found'            
          })
          if(tableReportData.length == index+1){
            rowDataList.push({
              sno: '-',
              FNR_No: '-',
              Tripsheet_No: '-',
              VA_No: '-',
              Migo_No: '-',
              Migo_Date: '-',
              Vehicle_No: 'Total',
              Quantity_In_MTS: TotalValueFinder(tableReportData,1),
              Base_Freight: TotalValueFinder(tableReportData,2),
              Additional_Freight: TotalValueFinder(tableReportData,3),
              Deduction: TotalValueFinder(tableReportData,4),
              Remarks: '-',
              Total_Freight: TotalValueFinder(tableReportData,5),
              Expense_Date: '-',
              Vendor_Code: '-', 
              Vendor_Name: '-',
              Vendor_Name2: '-'              
            })
          }
        })
        setRowData(rowDataList)
        setPending(false)
      })
    }
  }

  /* ==================== Access Part Start ========================*/
  const [screenAccess, setScreenAccess] = useState(false)
  let page_no = LogisticsProScreenNumberConstants.RakeReportModule.Rake_RCS_migo_report

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
    loadTripSheetReport()
  }, [])

  const columns = [
    {
      name: 'S.No',
      selector: (row) => row.sno,
      sortable: true,
      center: true,
    },
    {
      name: 'FNR No',
      selector: (row) => row.FNR_No,
      sortable: true,
      center: true,
    },
    {
      name: 'Tripsheet No',
      selector: (row) => row.Tripsheet_No,
      sortable: true,
      center: true,
    },
    {
      name: 'VA No',
      selector: (row) => row.VA_No,
      sortable: true,
      center: true,
    },     
    {
      name: 'Migo No',
      selector: (row) => row.Migo_No,
      sortable: true,
      center: true,
    },
    {
      name: 'Migo Date',
      selector: (row) => row.Migo_Date,
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
      name: 'Freight',
      selector: (row) => row.Total_Freight,
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
                    <CFormLabel htmlFor="VNum">FNR Number</CFormLabel>
                    <SearchSelectComponent
                      size="sm"
                      className="mb-2"
                      onChange={(e) => {
                        onChangeFilter(e, 'fnr_no')
                      }}
                      label="Select FNR Number"
                      noOptionsMessage="FNR Not found"
                      search_type="rake_tripsheet_report_fnr_number"
                      search_data={searchFilterData}
                    />
                  </CCol>

                  <CCol xs={12} md={3}>
                    <CFormLabel htmlFor="VNum">Vendor Name</CFormLabel>
                    <SearchSelectComponent
                      size="sm"
                      className="mb-2"
                      onChange={(e) => {
                        onChangeFilter(e, 'vendor_name')
                      }}
                      label="Select Vendor Name"
                      noOptionsMessage="Vendor Name Not found"
                      search_type="rake_tripsheet_fnr_report_vendor_name"
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
                        loadTripSheetReport('1')
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

export default RakeFNRReport
