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

const FCITripsheetReport = () => {
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

    if (event_type == 'vehicle_no') {
      if (selected_value) {
        setReportVehicle(selected_value)
      } else {
        setReportVehicle(0)
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
      reportVehicle == 0 &&
      reportShipmentNo == 0 &&
      reportTSNo == 0 &&
      reportShipmentStatus == 0
    ) {
      toast.warning('Choose atleast one filter type..!')
      return false
    }
    console.log(rowData,'exportCsvData')
    let dateTimeString = GetDateTimeFormat(1)
    let fileName='FCI_Tripsheet_Report_'+dateTimeString
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';
    const ws = XLSX.utils.json_to_sheet(rowData);
    const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], {type: fileType});
    FileSaver.saveAs(data, fileName + fileExtension);
  }

  const ACTION = {
    GATE_IN: 1,
    GATE_OUT: 2,
    WAIT_OUTSIDE: 0,
    VEHICLE_MAINTENANCE_ENDED: 5,
  }

  const [rowData, setRowData] = useState([])
  const [searchFilterData, setSearchFilterData] = useState([]) 
  const [fetch, setFetch] = useState(false)

  const [pending, setPending] = useState(true)

  /* Report Variables */
  const [reportVehicle, setReportVehicle] = useState(0)
  const [reportPONo, setReportPONo] = useState(0) 
  const [reportPlantId, setReportPlantId] = useState(0)  

  let tableData = []
  let tableReportData = []

  function logout() {
    AuthService.forceLogout(user_id).then((res) => {
      // console.log(res)
      if (res.status == 204) {
        LocalStorageService.clear()
        window.location.reload(false)
      }
    })
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

  const loadTripSheetReport = (fresh_type = '') => {

    if (fresh_type !== '1') {

      FCITripsheetCreationService.getTripsheetDataForReport().then((res) => { 
        tableReportData = res.data.data
        console.log(tableReportData,'getTripsheetDataForReport')

        setFetch(true)
        let rowDataList = []

        setSearchFilterData(tableReportData)
        tableReportData.map((data, index) => {
          rowDataList.push({
            sno: index + 1,
            Tripsheet_No: data.fci_tripsheet_no,
            PO_No: data.po_no,
            Vehicle_No: data.vehicle_no, 
            Tripsheet_Status: data.status == 1 ? 'Created' : 'Closed',
            Cancel_Status: data.is_cancelled == 1 ? 'Cancelled' : 'Not Cancelled', 
            FCI_Plant: data.fci_plant_info.plant_name,
            FCI_Plant_Code: data.fci_plant_info.plant_symbol,
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
        reportVehicle == 0 &&
        reportPONo == 0 &&
        reportPlantId == 0 
      ) {
        toast.warning('Choose atleast one filter type..!')
        return false
      }
      let report_form_data = new FormData()
      report_form_data.append('date_between', defaultDate)
      report_form_data.append('vehicle_no', reportVehicle)
      report_form_data.append('po_no', reportPONo)
      report_form_data.append('fci_plant_id', reportPlantId) 
      console.log(defaultDate, 'defaultDate')
      console.log(reportVehicle, 'reportVehicle')
      console.log(reportPlantId, 'reportPlantId')
      console.log(reportPONo, 'reportPONo') 
      // setFetch(true)
      // return false
      FCITripsheetCreationService.sentTripsheetDataForReport(report_form_data).then((res) => { 
        console.log(res, 'res')
        tableReportData = res.data.data
        console.log(tableReportData)

        setFetch(true)
        let rowDataList = []

        setSearchFilterData(tableReportData)
        tableReportData.map((data, index) => {
          rowDataList.push({
            sno: index + 1,
            Tripsheet_No: data.fci_tripsheet_no,
            PO_No: data.po_no,
            Vehicle_No: data.vehicle_no, 
            Tripsheet_Status: data.status == 1 ? 'Created' : 'Closed',
            Cancel_Status: data.is_cancelled == 1 ? 'Cancelled' : 'Not Cancelled', 
            FCI_Plant: data.fci_plant_info.plant_name,
            FCI_Plant_Code: data.fci_plant_info.plant_symbol,
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
  let page_no = LogisticsProScreenNumberConstants.FCIReportModule.FCI_Tripsheet_report

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
      name: 'Date',
      selector: (row) => row.Created_date,
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
      name: 'Vehicle No',
      selector: (row) => row.Vehicle_No,
      sortable: true,
      center: true,
    },
    {
      name: 'Plant',
      selector: (row) => row.FCI_Plant,
      sortable: true,
      center: true,
    },
    // {
    //   name: 'Cancel Status',
    //   selector: (row) => row.Cancel_Status,
    //   sortable: true,
    //   center: true,
    // },
    // {
    //   name: 'Trip Status',
    //   selector: (row) => row.Tripsheet_Status,
    //   sortable: true,
    //   center: true,
    // },
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
                    <CFormLabel htmlFor="VNum">Vehicle Number</CFormLabel>
                    <FCIVendorSerachSelectComponent
                      size="sm"
                      className="mb-2"
                      onChange={(e) => {
                        onChangeFilter(e, 'vehicle_no')
                      }}
                      label="Select Vehicle Number"
                      noOptionsMessage="Vehicle Not found"
                      search_type="fci_tripsheet_report_vehicle_number"
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
                      search_type="fci_tripsheet_report_plant_name"
                      search_data={searchFilterData}
                    />
                  </CCol>

              {/* <CCol xs={12} md={3}>
                <CFormLabel htmlFor="VNum">Tripsheet Status</CFormLabel>
                <SearchSelectComponent
                  size="sm"
                  className="mb-2"
                  onChange={(e) => {
                    onChangeFilter(e, 'trip_status')
                  }}
                  label="Select Tripsheet Status"
                  noOptionsMessage="Status Not found"
                  search_type="rake_tripsheet_report_trip_status"
                  search_data={searchFilterData}
                />
              </CCol> */}
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
    </>
  )
}

export default FCITripsheetReport
