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
import FCITripsheetCreationService from 'src/Service/FCIMovement/FCITripsheetCreation/FCITripsheetCreationService'
import FCIVendorSerachSelectComponent from '../CommonMethods/FCIVendorSerachSelectComponent'
import Swal from 'sweetalert2';
import AuthService from 'src/Service/Auth/AuthService'
import LocalStorageService from 'src/Service/LocalStoage'

const FCILoadingMigoReport = () => {
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

    if (event_type == 'truck_no') {
      if (selected_value) {
        setReportVehicle(selected_value)
      } else {
        setReportVehicle('')
      }
    } else if (event_type == 'po_no') {
      if (selected_value) {
        setReportPONo(selected_value)
      } else {
        setReportPONo(0)
      }
    } else if (event_type == 'plant_code') {
      if (selected_value) {
        setReportPlantId(selected_value)
      } else {
        setReportPlantId('')
      }
    } else if (event_type == 'ts_no') {
      if (selected_value) {
        setReportTripsheetNo(selected_value)
      } else {
        setReportTripsheetNo('')
      }
    }
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

  const exportToCSV = () => {
    if (defaultDate == null) {
      toast.warning('Date Filter Should not be empty..!')
      return false
    } else if (
      defaultDate == null &&
      reportVehicle == '' &&
      reportShipmentNo == 0 &&
      reportTSNo == 0 &&
      reportShipmentStatus == 0
    ) {
      toast.warning('Choose atleast one filter type..!')
      return false
    }
    console.log(rowData,'exportCsvData')
    let dateTimeString = GetDateTimeFormat(1)
    let fileName='FCI_Tripsheet_Loading_Migo_Report_'+dateTimeString
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
  const [reportVehicle, setReportVehicle] = useState('')
  const [reportPONo, setReportPONo] = useState(0) 
  const [reportPlantId, setReportPlantId] = useState('')
  const [reportTripsheetNo, setReportTripsheetNo] = useState('')  

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

  const loadTripSheetReport = (fresh_type = '') => {

    if (fresh_type !== '1') {

      FCITripsheetCreationService.getTripsheetLoadingMigoDataForReport().then((res) => { 
        tableReportData = res.data.data
        console.log(tableReportData,'getTripsheetLoadingMigoDataForReport')

        setFetch(true)
        let rowDataList = []

        setSearchFilterData(tableReportData)
        tableReportData.map((data, index) => {
          rowDataList.push({
            sno: index + 1,
            Tripsheet_No: data.tripsheet_no, 
            PO_No: data.po_no,
            VA_No: data.pp_va_no,
            Migo_No: data.migo_no, 
            Migo_Date: data.migo_date, 
            Truck_No: data.truck_no,
            Truck_In_Date_Time: data.in_date_time,
            Truck_Out_Date_Time: data.out_date_time,
            Vendor_name:data.vendor_name,
            Vendor_code:data.vendor_code, 
            From_Plant:data.from_plant,
            To_Plant:data.to_plant,
            Cost_Per_Ton:data.cost_per_ton,
            Total_Qty:data.total_qty,
            Budget_Freight:data.budget_freight,
            Additional_Freight:data.additional_freight,
            Atti_Cooli_Deduction:data.atti_cooli_deduction == 1 ? 'YES' : 'NO',
            Atti_Cooli_Freight:data.atti_cooli,
            Extra_Charge:data.extra_charge,
            Office_Expense:data.office_expense,
            Weighment_Expense:data.weighment_charge,
            Gate_Expense:data.gate_expense,
            Overall_Expense:data.overall_expense,
            SAP_Actual_Loading_Freight:data.sap_actual_loading_expense,
            NLFD_Updated_Loading_Freight:data.nlfd_updated_loading_expense,
            Deduction:data.deduction,
            Total_freight:data.total_freight,
            Expense_Seq_No:data.expense_sequence_no,
            Trip_Position: trip_position[data.trip_current_position],
            Tripsheet_Status: data.status == 1 ? 'Created' : 'Closed',
            Cancel_Status: data.is_cancelled == 1 ? 'Cancelled' : 'Not Cancelled',            
            FCI_Plant: data.fci_plant_info.plant_name,
            FCI_Plant_Code: data.fci_plant_info.plant_symbol,
            Remarks:data.remarks,
            Created_date: data.created_date,
            Created_By: data.tripsheet_creation_user_info.emp_name,
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
    } else {
      if (defaultDate == null) {
        setFetch(true)
        toast.warning('Date Filter Should not be empty..!')
        return false
      } else if (
        defaultDate == null &&
        reportVehicle == '' &&
        reportPONo == 0 &&
        reportPlantId == '' &&
        reportTripsheetNo == ''
      ) {
        toast.warning('Choose atleast one filter type..!')
        return false
      }
      let report_form_data = new FormData()
      report_form_data.append('date_between', defaultDate)
      report_form_data.append('truck_no', reportVehicle)
      report_form_data.append('po_no', reportPONo)
      report_form_data.append('ts_no', reportTripsheetNo)
      report_form_data.append('from_plant', reportPlantId) 
      console.log(defaultDate, 'defaultDate')
      console.log(reportVehicle, 'reportVehicle')
      console.log(reportPlantId, 'reportPlantId')
      console.log(reportPONo, 'reportPONo')
      console.log(reportTripsheetNo, 'reportTripsheetNo') 
      // setFetch(true)
      // return false

      FCITripsheetCreationService.sentTripsheetLoadingMigoDataForReport(report_form_data).then((res) => {
        console.log(res, 'res')
        tableReportData = res.data.data 
        console.log(tableReportData,'sentTripsheetLoadingMigoDataForReport')

        setFetch(true)
        let rowDataList = []

        setSearchFilterData(tableReportData)
        tableReportData.map((data, index) => {
          rowDataList.push({
            sno: index + 1,
            Tripsheet_No: data.tripsheet_no, 
            PO_No: data.po_no,
            VA_No: data.pp_va_no,
            Migo_No: data.migo_no, 
            Migo_Date: data.migo_date, 
            Truck_No: data.truck_no,
            Truck_In_Date_Time: data.in_date_time,
            Truck_Out_Date_Time: data.out_date_time,
            Vendor_name:data.vendor_name,
            Vendor_code:data.vendor_code, 
            From_Plant:data.from_plant,
            To_Plant:data.to_plant,
            Cost_Per_Ton:data.cost_per_ton,
            Total_Qty:data.total_qty,
            Budget_Freight:data.budget_freight,
            Additional_Freight:data.additional_freight,
            Atti_Cooli_Deduction:data.atti_cooli_deduction == 1 ? 'YES' : 'NO',
            Atti_Cooli_Freight:data.atti_cooli,
            Extra_Charge:data.extra_charge,
            Office_Expense:data.office_expense,
            Weighment_Expense:data.weighment_charge,
            Gate_Expense:data.gate_expense,
            Overall_Expense:data.overall_expense,
            SAP_Actual_Loading_Freight:data.sap_actual_loading_expense,
            NLFD_Updated_Loading_Freight:data.nlfd_updated_loading_expense,
            Deduction:data.deduction,
            Total_freight:data.total_freight,
            Expense_Seq_No:data.expense_sequence_no,
            Trip_Position: trip_position[data.trip_current_position],
            Tripsheet_Status: data.status == 1 ? 'Created' : 'Closed',
            Cancel_Status: data.is_cancelled == 1 ? 'Cancelled' : 'Not Cancelled',            
            FCI_Plant: data.fci_plant_info.plant_name,
            FCI_Plant_Code: data.fci_plant_info.plant_symbol,
            Remarks:data.remarks,
            Created_date: data.created_date,
            Created_By: data.tripsheet_creation_user_info.emp_name,
          })
        })
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
  let page_no = LogisticsProScreenNumberConstants.FCIReportModule.FCI_Loading_Migo_report

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
      name: 'Tripsheet No',
      selector: (row) => row.Tripsheet_No,
      sortable: true,
      center: true,
    },    
    {
      name: 'PO No',
      selector: (row) => row.PO_No,
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
      name: 'Date',
      selector: (row) => row.Created_date,
      sortable: true,
      center: true,
    },    
    {
      name: 'Vehicle No',
      selector: (row) => row.Truck_No,
      sortable: true,
      center: true,
    },    
    {
      name: 'Plant',
      selector: (row) => row.FCI_Plant,
      sortable: true,
      center: true,
    },
    {
      name: 'Cancel Status',
      selector: (row) => row.Cancel_Status,
      sortable: true,
      center: true,
    },
    {
      name: 'Trip Status',
      selector: (row) => row.Tripsheet_Status,
      sortable: true,
      center: true,
    },
  ]

  const trip_position = ['', '', 'Loading Expense Closure Submission Completed', 'Loading Expense Closure Submission Approved', 'Loading Expense Closure Submission Approval Reject', 'Expense Validation Completed', 'Expense Validation Rejected', 'Expense Posting Completed', 'Expense Posting Rejected', 'Income Closure Submission Completed']

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
                    <CFormLabel htmlFor="VNum">Vehicle Number</CFormLabel>
                    <FCIVendorSerachSelectComponent
                      size="sm"
                      className="mb-2"
                      onChange={(e) => {
                        onChangeFilter(e, 'truck_no')
                      }}
                      label="Select Vehicle Number"
                      noOptionsMessage="Vehicle Not found"
                      search_type="fci_tripsheet_migo_report_vehicle_number"
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
                    <CFormLabel htmlFor="VNum">FCI Plant</CFormLabel>
                    <FCIVendorSerachSelectComponent
                      size="sm"
                      className="mb-2"
                      onChange={(e) => {
                        onChangeFilter(e, 'plant_code')
                      }}
                      label="Select FCI Plant"
                      noOptionsMessage="Plant Not found"
                      search_type="fci_migo_report_plant_name"
                      search_data={searchFilterData}
                    />
                  </CCol>
                  <CCol xs={12} md={3}>
                    <CFormLabel htmlFor="VNum">Tripsheet Number</CFormLabel>
                    <FCIVendorSerachSelectComponent
                      size="sm"
                      className="mb-2"
                      onChange={(e) => {
                        onChangeFilter(e, 'ts_no')
                      }}
                      label="Select Tripsheet Number"
                      noOptionsMessage="Tripsheet Not found"
                      search_type="fci_tripsheet_migo_report_tripsheet_number"
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

export default FCILoadingMigoReport
