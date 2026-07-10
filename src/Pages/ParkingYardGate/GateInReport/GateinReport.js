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
  CFormInput,
} from '@coreui/react'
import VehicleAssignmentService from 'src/Service/VehicleAssignment/VehicleAssignmentService'
import { Link, useNavigate } from 'react-router-dom'
import CustomTable from 'src/components/customComponent/CustomTable'
import TripStoService from 'src/Service/TripSTO/TripStoService'
import { ToastContainer, toast } from 'react-toastify'
import Loader from 'src/components/Loader'
import { DateRangePicker } from 'rsuite'
import ReportService from 'src/Service/Report/ReportService'
import ParkingYardGateService from 'src/Service/ParkingYardGate/ParkingYardGateService'
import SearchSelectComponent from 'src/components/commoncomponent/searchSelectComponent'

import AccessDeniedComponent from 'src/components/commoncomponent/AccessDeniedComponent'
import JavascriptInArrayComponent from 'src/components/commoncomponent/JavascriptInArrayComponent'
import * as LogisticsProScreenNumberConstants from 'src/components/constants/LogisticsProScreenNumberConstants'


const GateInReport = () => {
  const navigation = useNavigate()

  /*================== User Location Fetch ======================*/
  const user_info_json = localStorage.getItem('user_info')
  const user_info = JSON.parse(user_info_json)
  var user_locations = []

  /* Get User Locations From Local Storage */
  user_info.location_info.map((data, index) => {
    user_locations.push(data.id)
  })

  /* ==================== Access Part Start ========================*/
  const [screenAccess, setScreenAccess] = useState(false)
  let page_no = LogisticsProScreenNumberConstants.OtherModuleScreen.Gate_In_Report

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
  const [reportTSNo, setReportTSNo] = useState(0)
  const [reportTSId, setReportTSId] = useState(0)
  const [reportFIType, setreportFIType] = useState(0)


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

      ParkingYardGateService.getParkingYardGateVehiclesReport().then((res) => {
        tableReportData = res.data.data
        console.log(tableReportData)

        setFetch(true)
        let rowDataList = []
        let filterData = tableReportData
        // console.log(filterData)
        setSearchFilterData(filterData)
        filterData.map((data, index) => {
          rowDataList.push({
            sno: index + 1,
            Tripsheet_No: data.trip_sheet_info != null ? data.trip_sheet_info.trip_sheet_no : '-',
            Vehicle_Type: data.vehicle_type_id.type,
            Vehicle_No: data.vehicle_number,
            Driver_Name: data.driver_name,
            Driver_Mobile_Number: data.driver_contact_number,
            Remarks: data.remarks,
            Creation_Time: data.created_date,
            Action: (
              <CButton className="badge" color="warning">
                <Link className="text-white" to={`${data.parking_yard_gate_id}`}>Gate In</Link>
              </CButton>
            ),
          })
        })
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
        reportShipmentNo == 0 &&
        reportTSNo == 0 &&
        setreportSTOType == 0
      ) {
        toast.warning('Choose atleast one filter type..!')
        return false
      }
      let report_form_data = new FormData()
      report_form_data.append('date_between', defaultDate)
      report_form_data.append('vehicle_no', reportVehicle)


      console.log(defaultDate)

      ParkingYardGateService.sentGateInDataForReport(report_form_data).then((res) => {
        console.log(res, 'res')
        tableReportData = res.data.data
        console.log(tableReportData)

        setFetch(true)
        let rowDataList = []
        let filterData = tableReportData
        // console.log(filterData)
        setSearchFilterData(filterData)
        filterData.map((data, index) => {
          rowDataList.push({

            sno: index + 1,
            Tripsheet_No: data.trip_sheet_info != null ? data.trip_sheet_info.trip_sheet_no : '-',
            Vehicle_Type: data.vehicle_type_id.type,
            Vehicle_No: data.vehicle_number,
            Driver_Name: data.driver_name,
            Driver_Mobile_Number: data.driver_contact_number,
            Remarks: data.remarks,
            Creation_Time: data.created_date,
            Action: (
              <CButton className="badge" color="warning">
                <Link className="text-white" to={`${data.parking_yard_gate_id}`}>Gate In</Link>
              </CButton>
            ),
          })
        })
        setRowData(rowDataList)
        setPending(false)
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
      name: 'Creation Date',
      selector: (row) => row.Creation_Time,
      sortable: true,
      center: true,
    },
    {
      name: 'Action',
      selector: (row) => row.Action,
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
                    search_type="gate_in_report_vehicle_number"
                    search_data={searchFilterData}
                  />
                </CCol>
              </CRow>
              <hr style={{height:'2px', marginTop:'0.5px'}}></hr>
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
                      loadTripShipmentReport('1')
                      setFetch(false)
                    }}
                  >
                    Filter
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
	      ) : (<AccessDeniedComponent />)}
    	 </>
      )}

    </>
  )
}

export default GateInReport
