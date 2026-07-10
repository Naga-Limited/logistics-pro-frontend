
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
import { toast } from 'react-toastify'
import Loader from 'src/components/Loader'
import { DateRangePicker } from 'rsuite'
import SearchSelectComponent from 'src/components/commoncomponent/searchSelectComponent'
import FileSaver from 'file-saver'
import * as XLSX from 'xlsx';
import DepoGateInService from 'src/Service/Depo/GateIn/DepoGateInService'
import AccessDeniedComponent from 'src/components/commoncomponent/AccessDeniedComponent'
import JavascriptInArrayComponent from 'src/components/commoncomponent/JavascriptInArrayComponent'
import * as LogisticsProScreenNumberConstants from 'src/components/constants/LogisticsProScreenNumberConstants'
import { GetDateTimeFormat } from '../CommonMethods/CommonMethods'

const DepoVehicleReport = () => {
  const navigation = useNavigate()

  /*================== User Id & Location Fetch ======================*/
  const user_info_json = localStorage.getItem('user_info')
  const user_info = JSON.parse(user_info_json)
  const user_locations = []

  console.log(user_info)

  /* Get User Locations From Local Storage */
  user_info.location_info.map((data, index) => {
    user_locations.push(data.id)
  })

  /* Get User Id From Local Storage */
  const user_id = user_info.user_id

  // console.log(user_locations)
  /*================== User Location Fetch ======================*/

   /* Get User Locations From Local Storage */
   const user_location_info = user_info.location_info
   var user_locations_id = ''
   user_location_info.map((data, index) => {
     user_locations_id = user_locations_id + data.id + ','
   })

   var lastIndex = user_locations_id.lastIndexOf(',')

   const userLocation = user_locations_id.substring(0, lastIndex)
   console.log(userLocation)

  /* ==================== Access Part Start ========================*/
  const [screenAccess, setScreenAccess] = useState(false)
  let page_no = LogisticsProScreenNumberConstants.DepoModuleScreens.Depo_Vehicles_Report

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
    }
  }

  const exportToCSV = () => {
    console.log(rowData,'exportCsvData')
    let dateTimeString = GetDateTimeFormat(1)
    let fileName='Depo_Vehicles_Report_'+dateTimeString
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
    VEHICLE_INSPECTION_COMPLETED: 2,
    VEHICLE_INSPECTION_REJECTED: 3,
    TRIPSHEET_CREATED: 16,
    TRIPSHEET_REJECTED: 17,
    SHIPMENT_COMPLETED: 22,
    SHIPMENT_CREATED: 20,
    SHIPMENT_DELETED: 21,
    SHIPMENT_CANCELLED: 19,
    TRIP_EXPENSE_CAPTURE_REJECTED: 26,
    TRIP_EXPENSE_APPROVAL: 27,
    TRIP_SETTLEMENT_CAPTURE: 28,
    TRIP_SETTLEMENT_VALIDATION: 29,
    TRIP_SETTLEMENT_APPROVAL: 30,
    TRIP_SETTLEMENT_COMPLETED: 31,
  }

  const scStatusArray = [
    'SC Request - User',
    'SCR Reverted - User',
    'SC Approval - Manager',
    'SC Reject - Manager',
    'Shipment ✔️- User',
    'SC Reject - User',
    'DI Request - User',
    'DI Approval - Manager',
    'DI Reject - User',
    'DI Reject - Manager',
    'DI Update ✔️- User',
    'Shipment / Trip ❌',
    'Shipment Deleted ❌',
    'Shipment - PGI ✔️',
    'Shipment Completed',
  ]

  const [rowData, setRowData] = useState([])
  const [searchFilterData, setSearchFilterData] = useState([])

  const [errorModal, setErrorModal] = useState(false)
  const [fetch, setFetch] = useState(false)

  const [pending, setPending] = useState(true)

  /* Report Variables */
  const [reportVehicle, setReportVehicle] = useState(0)

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

  const scStatus = (code) => {

    console.log(code,'code-code')

    console.log(scStatusArray,'code-code')

    return scStatusArray[code-1]
  }

  const loadDepoReport = (fresh_type = '') => {
    /*================== User Location Fetch ======================*/
    const user_info_json = localStorage.getItem('user_info')
    const user_info = JSON.parse(user_info_json)
    var user_locations = []

    /* Get User Locations From Local Storage */
    user_info.location_info.map((data, index) => {
      user_locations.push(data.id)
    })

    if (fresh_type != '1') {
      // console.log(user_locations)
      /*================== User Location Fetch ======================*/

      DepoGateInService.getPygAllTruckData().then((res) => {
        tableReportData = res.data.data
        console.log(tableReportData,'tableReportData')

        setFetch(true)
        let rowDataList = []
        let filterData = tableReportData.filter(
          (data) => user_locations.indexOf(data.vehicle_location_id) != -1
        )
        console.log(filterData,'filterData')
        setSearchFilterData(filterData)
        filterData.map((data, index) => {
          rowDataList.push({
            sno: index + 1,
            Tripsheet_No: data.vehicle_tripsheet_info ? data.vehicle_tripsheet_info.depo_tripsheet_no : '-',
            Contractor_Name: data.contractor_info.contractor_name,
            Vehicle_No: data.vehicle_info.vehicle_number,
            Driver_Name: data.driver_info.driver_name,
            Remarks: data.remarks,
            Gate_In_Date: data.created_date,
            Waiting_At: (
              <span className="badge rounded-pill bg-info">
                {data.vehicle_current_position == ACTION.GATE_IN
                  ? 'Gate In ✔️'
                  : data.vehicle_current_position == ACTION.VEHICLE_INSPECTION_COMPLETED
                  ? 'Inspection ✔️'
                  : data.vehicle_current_position == ACTION.VEHICLE_INSPECTION_REJECTED
                  ? 'Inspection ❌'
                  : data.vehicle_current_position == ACTION.TRIPSHEET_CREATED
                  ? 'Tripsheet ✔️'
                  : data.vehicle_current_position == ACTION.TRIPSHEET_REJECTED
                  ? 'Tripsheet ❌'
                  : data.vehicle_current_position == ACTION.SHIPMENT_CREATED
                  ? scStatus(data.shipment_info.approval_status)
                  : data.vehicle_current_position == ACTION.SHIPMENT_COMPLETED
                  ? 'Shipment Invoice ✔️'
                  : data.vehicle_current_position == ACTION.SHIPMENT_CANCELLED
                  ? 'Shipment ❌'
                  : data.vehicle_current_position == ACTION.TRIP_EXPENSE_CAPTURE_REJECTED
                  ? 'Expense ❌'
                  : data.vehicle_current_position == ACTION.TRIP_EXPENSE_APPROVAL
                  ? 'Expense ✔️ Approval'
                  : data.vehicle_current_position == ACTION.TRIP_SETTLEMENT_CAPTURE
                  ? 'Expense ✔️'
                  : data.vehicle_current_position == ACTION.TRIP_SETTLEMENT_VALIDATION
                  ? 'Payment ✔️ Validation'
                  : data.vehicle_current_position == ACTION.TRIP_SETTLEMENT_APPROVAL
                  ? 'Payment ✔️ Approval'
                  : data.vehicle_current_position == ACTION.TRIP_SETTLEMENT_COMPLETED
                  ? 'Payment ✔️ Completed'
                  : 'Gate Out'}
              </span>
            ),
            Screen_Duration: data.vehicle_current_position_updated_time,
            Overall_Duration: data.created_at_time,
          })
        })
        setFetch(true)
        setRowData(rowDataList)
        setPending(false)
      })
    } else {
      if (defaultDate == null) {
        toast.warning('Date Filter Should not be empty..!')
        setFetch(true)
        return false
      }
      let report_form_data = new FormData()
      report_form_data.append('date_between', defaultDate)
      report_form_data.append('vehicle_no', reportVehicle)

      console.log(defaultDate, 'defaultDate')
      console.log(reportVehicle, 'reportVehicle')

      DepoGateInService.sentVehicleDataForReport(report_form_data).then((res) => {
        console.log(res, 'res')
        tableReportData = res.data.data
        console.log(tableReportData)

        setFetch(true)
        let rowDataList = []
        let filterData = tableReportData.filter(
          (data) => user_locations.indexOf(data.vehicle_location_id) != -1
        )
        // console.log(filterData)
        setSearchFilterData(filterData)
        filterData.map((data, index) => {
          console.log(data, 'data-data-data')
          rowDataList.push({
            sno: index + 1,
            Tripsheet_No: data.vehicle_tripsheet_info ? data.vehicle_tripsheet_info.depo_tripsheet_no : '-',
            Contractor_Name: data.contractor_info.contractor_name,
            Vehicle_No: data.vehicle_info.vehicle_number,
            Driver_Name: data.driver_info.driver_name,
            Remarks: data.remarks,
            Gate_In_Date: data.created_date,
            Waiting_At: (
              <span className="badge rounded-pill bg-info">
                {data.vehicle_current_position == ACTION.GATE_IN
                  ? 'Gate In ✔️'
                  : data.vehicle_current_position == ACTION.VEHICLE_INSPECTION_COMPLETED
                  ? 'Inspection ✔️'
                  : data.vehicle_current_position == ACTION.VEHICLE_INSPECTION_REJECTED
                  ? 'Inspection ❌'
                  : data.vehicle_current_position == ACTION.TRIPSHEET_CREATED
                  ? 'Tripsheet ✔️'
                  : data.vehicle_current_position == ACTION.TRIPSHEET_REJECTED
                  ? 'Tripsheet ❌'
                  : data.vehicle_current_position == ACTION.SHIPMENT_CREATED
                  ? scStatus(data.shipment_info.approval_status)
                  : data.vehicle_current_position == ACTION.SHIPMENT_COMPLETED
                  ? 'Shipment Invoice ✔️'
                  : data.vehicle_current_position == ACTION.SHIPMENT_CANCELLED
                  ? 'Shipment ❌'
                  : data.vehicle_current_position == ACTION.TRIP_EXPENSE_CAPTURE_REJECTED
                  ? 'Expense ❌'
                  : data.vehicle_current_position == ACTION.TRIP_EXPENSE_APPROVAL
                  ? 'Expense ✔️ Approval'
                  : data.vehicle_current_position == ACTION.TRIP_SETTLEMENT_CAPTURE
                  ? 'Expense ✔️ Approval'
                  : data.vehicle_current_position == ACTION.TRIP_SETTLEMENT_VALIDATION
                  ? 'Payment ✔️ Validation'
                  : data.vehicle_current_position == ACTION.TRIP_SETTLEMENT_APPROVAL
                  ? 'Payment ✔️ Approval'
                  : data.vehicle_current_position == ACTION.TRIP_SETTLEMENT_COMPLETED
                  ? 'Payment ✔️ Completed'
                  : 'Gate Out'}
              </span>
            ),
            Screen_Duration: data.vehicle_current_position_updated_time,
            Overall_Duration: data.created_at_time,
          })
        })
        setRowData(rowDataList)

      })
    }
  }

  useEffect(() => {
    loadDepoReport()
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
      name: 'Cotractor Name',
      selector: (row) => row.Contractor_Name,
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
      name: 'Remarks',
      selector: (row) => row.Remarks,
      sortable: true,
      center: true,
    },
    {
      name: 'Gate-In Date',
      selector: (row) => row.Gate_In_Date,
      sortable: true,
      center: true,
    },
    {
      name: 'Current Status',
      selector: (row) => row.Waiting_At,
      center: true,
    },
    {
      name: 'Screen Duration',
      selector: (row) => row.Screen_Duration,
      sortable: true,
      center: true,
    },
    {
      name: ' Overall Duration',
      selector: (row) => row.Overall_Duration,
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
                      <CFormLabel htmlFor="VNum">Vehicle Number</CFormLabel>
                      <SearchSelectComponent
                        size="sm"
                        className="mb-2"
                        onChange={(e) => {
                          onChangeFilter(e, 'vehicle_no')
                        }}
                        label="Select Vehicle Number"
                        noOptionsMessage="Vehicle Not found"
                        search_type="depo_vehicle_report_vehicle_number"
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
                          loadDepoReport('1')
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
              </CCard>
            </>) : (<AccessDeniedComponent />
          )}
        </>
      )}

    </>
  )
}

export default DepoVehicleReport
