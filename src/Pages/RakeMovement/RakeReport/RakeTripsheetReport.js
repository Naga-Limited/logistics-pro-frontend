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

const RakeTripsheetReport = () => {
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

    if (event_type == 'vehicle_no') {
      if (selected_value) {
        setReportVehicle(selected_value)
      } else {
        setReportVehicle(0)
      }
    } else if (event_type == 'fnr_no') {
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
    } else if (event_type == 'trip_status') {
      if (selected_value) {
        setReportTripsheetStatus(selected_value)
      } else {
        setReportTripsheetStatus(0)
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
      // reportTSNo == 0 &&
      reportShipmentStatus == 0
    ) {
      toast.warning('Choose atleast one filter type..!')
      return false
    }
    console.log(rowData,'exportCsvData')
    let dateTimeString = GetDateTimeFormat(1)
    let fileName='Rake_Tripsheet_Report_'+dateTimeString
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

  const [errorModal, setErrorModal] = useState(false)
  const [fetch, setFetch] = useState(false)

  const [pending, setPending] = useState(true)

  /* Report Variables */
  const [reportVehicle, setReportVehicle] = useState(0)
  const [reportFNRNo, setReportFNRNo] = useState(0)
  const [reportTSId, setReportTSId] = useState(0)
  const [reportVendorId, setReportVendorId] = useState(0)
  const [reportTripsheetStatus, setReportTripsheetStatus] = useState(0)

  const [vehicleSto, setVehicleSto] = useState('')

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

      RakeTripsheetCreationService.getTripsheetDataForReport().then((res) => {
        tableReportData = res.data.data
        console.log(tableReportData,'getTripsheetDataForReport')

        setFetch(true)
        let rowDataList = []

        setSearchFilterData(tableReportData)
        tableReportData.map((data, index) => {
          rowDataList.push({
            sno: index + 1,
            Tripsheet_No: data.rake_tripsheet_no,
            FNR_No: data.fnr_no,
            Vehicle_No: data.vehicle_no,
            Driver_Name: data.driver_name,
            Driver_Number: data.driver_phone_number,
            // Tripsheet_Status: data.status == 1 ? 'Created' : 'Closed',
            // Cancel_Status: data.is_cancelled == 1 ? 'Cancelled' : 'Not Cancelled',
            Vendor_Name: data.tripsheet_creation_vendor_info.v_name,
            Vendor_Code: data.vendor_code,
            Rake_Plant: data.tripsheet_creation_plant_info.definition_list_name,
            Created_date: data.created_date,
            Created_By: data.tripsheet_creation_user_info.emp_name,
            Action: (
              <CButton
              className="text-white"
              color="warning"
              id={data.tripsheet_id}
              disabled={data.status == 2}
              size="sm"
            >
              <span className="float-start">
              <Link target='_blank' to={`/RAKETSCreationReport/${data.tripsheet_id}`}>
                <i className="fa fa-eye" aria-hidden="true"></i> &nbsp;View
                </Link>
              </span>
            </CButton>
            ),
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
        reportVehicle == 0 &&
        reportShipmentNo == 0 &&
        // reportTSNo == 0 &&
        reportShipmentStatus == 0
      ) {
        toast.warning('Choose atleast one filter type..!')
        return false
      }
      let report_form_data = new FormData()
      report_form_data.append('date_between', defaultDate)
      report_form_data.append('vehicle_no', reportVehicle)
      report_form_data.append('fnr_no', reportFNRNo)
      report_form_data.append('vendor_id', reportVendorId)
      report_form_data.append('trip_status', reportTripsheetStatus)
      console.log(defaultDate, 'defaultDate')
      console.log(reportVehicle, 'reportVehicle')
      console.log(reportVendorId, 'reportVendorId')
      console.log(reportFNRNo, 'reportFNRNo')
      console.log(reportTripsheetStatus, 'reportTripsheetStatus')

      RakeTripsheetCreationService.sentTripsheetDataForReport(report_form_data).then((res) => {
        console.log(res, 'res')
        tableReportData = res.data.data
        console.log(tableReportData)

        setFetch(true)
        let rowDataList = []

        setSearchFilterData(tableReportData)
        tableReportData.map((data, index) => {
          rowDataList.push({
            sno: index + 1,
            Tripsheet_No: data.rake_tripsheet_no,
            FNR_No: data.fnr_no,
            Vehicle_No: data.vehicle_no,
            Driver_Name: data.driver_name,
            Driver_Number: data.driver_phone_number,
            // Tripsheet_Status: data.status == 1 ? 'Created' : 'Closed',
            // Cancel_Status: data.is_cancelled == 1 ? 'Cancelled' : 'Not Cancelled',
            Vendor_Name: data.tripsheet_creation_vendor_info.v_name,
            Vendor_Code: data.vendor_code,
            Rake_Plant: data.tripsheet_creation_plant_info.definition_list_name,
            Created_date: data.created_date,
            Created_By: data.tripsheet_creation_user_info.emp_name,
            Action: (
              <CButton
              className="text-white"
              color="warning"
              id={data.tripsheet_id}
              disabled={data.status == 2}
              size="sm"
            >
              <span className="float-start">
              <Link target='_blank' to={`/RAKETSCreationReport/${data.tripsheet_id}`}>
                <i className="fa fa-eye" aria-hidden="true"></i> &nbsp;View
                </Link>
              </span>
            </CButton>
            ),
          })
        })
        setRowData(rowDataList)
        setPending(false)
      })
    }
  }

  /* ==================== Access Part Start ========================*/
  const [screenAccess, setScreenAccess] = useState(false)
  let page_no = LogisticsProScreenNumberConstants.RakeReportModule.Rake_Tripsheet_report

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
      name: 'FNR No',
      selector: (row) => row.FNR_No,
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
      name: 'Vendor Name',
      selector: (row) => row.Vendor_Name,
      sortable: true,
      center: true,
    },
    {
      name: 'Plant',
      selector: (row) => row.Rake_Plant,
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
    {
      name: 'Action',
      selector: (row) => row.Action,
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
                <SearchSelectComponent
                  size="sm"
                  className="mb-2"
                  onChange={(e) => {
                    onChangeFilter(e, 'vehicle_no')
                  }}
                  label="Select Vehicle Number"
                  noOptionsMessage="Vehicle Not found"
                  search_type="rake_tripsheet_report_vehicle_number"
                  search_data={searchFilterData}
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
                  label="Select Vendor name"
                  noOptionsMessage="Vendor Not found"
                  search_type="rake_tripsheet_report_vendor_name"
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

export default RakeTripsheetReport
