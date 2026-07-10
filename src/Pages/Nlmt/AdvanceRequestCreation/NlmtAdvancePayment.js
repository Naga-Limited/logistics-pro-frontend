import { CButton, CCard, CCol, CContainer, CFormLabel, CRow } from '@coreui/react'
import { Link } from 'react-router-dom'
import CustomTable from 'src/components/customComponent/CustomTable'
import React, { useEffect, useState } from 'react'
import Loader from 'src/components/Loader' 
import * as XLSX from 'xlsx';
import FileSaver from 'file-saver'
import AccessDeniedComponent from 'src/components/commoncomponent/AccessDeniedComponent'
import JavascriptInArrayComponent from 'src/components/commoncomponent/JavascriptInArrayComponent'
import * as NlmtScreenAccessCodes from 'src/components/constants/NlmtScreenAccessCodes'
import { DateRangePicker } from 'rsuite'
import { toast } from 'react-toastify'
import NlmtAdvanceCreationService from 'src/Service/Nlmt/Advance/NlmtAdvanceCreationService'
import { GetDateTimeFormat } from '../CommonMethods/CommonMethods'


const NlmtAdvancePayment = () => {
  /*================== User Location Fetch ======================*/
  const user_info_json = localStorage.getItem('user_info')
  const user_info = JSON.parse(user_info_json)
  const user_locations = []
  const vehicle_types = []

  /* Get User Locations From Local Storage */
  user_info.location_info.map((data, index) => {
    user_locations.push(data.id)
  })

  /* Get User Locations From Local Storage */
  user_info.vehicle_type_info.map((data, index) => {
    vehicle_types.push(data.id)
  })
  // console.log(user_locations)
  /*================== User Location Fetch ======================*/

  /* ==================== Access Part Start ========================*/
  const [screenAccess, setScreenAccess] = useState(false)
  let page_no = NlmtScreenAccessCodes.NlmtTransactionScreens.Nlmt_Advance_Payment

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

  const [rowData, setRowData] = useState([])
  const [fetch, setFetch] = useState(false)
  const [diesel_payment, setDiesel_payment] = useState('')
  const [bankpayment, setBank_payment] = useState('')

  const exportToCSV = () => {
    let dateTimeString = GetDateTimeFormat(1)
    let fileName = 'ExpenseClosureScreen_' + dateTimeString
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';
    const ws = XLSX.utils.json_to_sheet(rowData);
    const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  }

  let tableData = []

  const ACTION = {
    ADVANCE_REJECTED: 15,
    TRIPSHEET_CREATED: 16,
    SHIPMENT_CREATED: 22, 
    DIESEL_INDENT_CREATED: 37, 
    DIESEL_INDENT_CONFIRMED: 39, 
  }

  const PENDING = {
    ADVANCE_FREIGHT_PENDING: 0,
    ADVANCE_DIESEL_PENDING: 0,
  }
  const VEHICLE_TYPE_MAP = {
    21: 'Own',
    22: 'Hire',
  }
  const loadVehicleReadyToTrip = (fresh_type = '') => {
    if (fresh_type !== '1') {
      NlmtAdvanceCreationService.getVehicleReadyToAdvance().then((res) => {
        setFetch(true)
        tableData = res.data.data
        console.log('tableData', tableData)
        let rowDataList = []
        const filterData1 = tableData.filter(
          (data) => user_locations.indexOf(data.vehicle_location_id) != -1
        )

        const filterData = filterData1.filter(
          (data) =>
            (data.tripsheet_info?.advance_request == 1) || (data.tripsheet_info?.advance_request == 0 && data.tripsheet_info?.advance_amount == null) || (data.tripsheet_info?.advance_request == 2 && data.advance_payment_info?.approval_status == 2)
        )

        console.log(filterData)

        filterData.map((data, index) => {
          rowDataList.push({
            sno: index + 1,
            Tripsheet_No: data.tripsheet_info?.nlmt_tripsheet_no,
            Tripsheet_Date: data.tripsheet_info?.created_date,
            Vehicle_Type: VEHICLE_TYPE_MAP[data?.vehicle_info?.vehicle_type_id] ?? '-',
            Vehicle_No: data.vehicle_info.vehicle_number,
            Driver_Name: data.driver_name ? data.driver_name : data.driver_info.driver_name,
            //  Driver_Mobile_No: data.driver_contact_number?data.driver_contact_number:data.driver_info.driver_phone_2,
            Driver_Mobile_No: data.driver_contact_number ?? data.driver_phone_1 ?? data.driver_info?.driver_phone_2 ?? data.driver_info?.driver_phone_1 ?? '-',
            Vendor_Name: data.vehicle_info.vehicle_type_id == 22 ? (data.vendor_info ? data.vendor_info.owner_name : '-') : '-',
            Vendor_Code: data.vehicle_info.vehicle_type_id == 22 ? (data.vendor_info ? data.vendor_info.vendor_code : '-') : '-',
            Vendor_Mobile_No: data.vehicle_info.vehicle_type_id == 22 ? (data.vendor_info ? data.vendor_info.owner_number : '-') : '-',
            Vendor_PAN_No: data.vehicle_info.vehicle_type_id == 22 ? (data.vendor_info ? data.vendor_info.pan_card_number : '-') : '-',
            Vendor_Town: data.vehicle_info.vehicle_type_id == 22 ? (data.vendor_info ? (data.vendor_info.city ? data.vendor_info.city : '-') : '-') : '-',
            Waiting_At: (
              <span className="badge rounded-pill bg-info">
                { data.vehicle_current_position == ACTION.TRIPSHEET_CREATED 
                  ? 'Tripsheet ✔️'
                  :  data.vehicle_current_position == ACTION.SHIPMENT_CREATED
                  ? 'Shipment ✔️'
                  : data.vehicle_current_position == ACTION.DIESEL_INDENT_CREATED
                  ? 'DI Creation ✔️'
                   : data.vehicle_current_position == ACTION.DIESEL_INDENT_CONFIRMED
                  ? 'DI Confirmation ✔️'
                  : data.vehicle_current_position == ACTION.ADVANCE_REJECTED
                  ? 'Advance ❌'
                  : '--'
                }
              </span>
            ),
             
            Screen_Duration: data.vehicle_current_position_updated_time,
            Overall_Duration: data.created_at,
            Action: (
              <CButton className="badge" color="warning">
                <Link className="text-white" to={`${data.tripsheet_info?.parking_id}`}>Advance Creation</Link>
              </CButton>
            ),
          })
        })
        setRowData(rowDataList)
      })
    } else {
      if (defaultDate == null) {
        setFetch(true)
        toast.warning('Date Filter Should not be empty..!')
        return false
      }
      let report_form_data = new FormData()
      report_form_data.append('date_between', defaultDate)


      NlmtAdvanceCreationService.getVehicleReadyToAdvanceFilterSearch(report_form_data).then((res) => {
        setFetch(true)
        tableData = res.data.data
        let rowDataList = []
        console.log('tableData11', tableData)
        // const filterData1 = tableData.filter(
        //   (data) => (user_locations.indexOf(data.vehicle_location_id) != -1 && vehicle_types.indexOf(data.vehicle_type_id?.id) != -1)
        // )
        // const filterData = (filterData1).filter(
        //   (data) =>

        //     ((data.vehicle_type_id.id == 3 && (data.trip_sheet_info?.purpose < 3 || data.trip_sheet_info?.purpose == 4) && data.trip_sheet_info?.advance_payment_diesel == 0) || (data.vehicle_current_position == '37' || data.vehicle_current_position == '39' || data.vehicle_current_position == '41') || data.vehicle_type_id.id < 3)
        // )

        const filterData1 = tableData.filter(
          (data) => user_locations.indexOf(data.vehicle_location_id) != -1
        )

        const filterData = filterData1.filter(
          (data) =>
            data.tripsheet_info?.advance_request == 1
        )
        console.log(filterData)

        filterData.map((data, index) => {
          rowDataList.push({
            sno: index + 1,
            Tripsheet_No: data.tripsheet_info?.nlmt_tripsheet_no,
            Tripsheet_Date: data.tripsheet_info?.created_date,
            Vehicle_Type: VEHICLE_TYPE_MAP[data?.vehicle_info?.vehicle_type_id] ?? '-',
            Vehicle_No: data.vehicle_info.vehicle_number,
            Driver_Name: data.driver_name ? data.driver_name : data.driver_info.driver_name,
            //  Driver_Mobile_No: data.driver_contact_number?data.driver_contact_number:data.driver_info.driver_phone_2,
            Driver_Mobile_No: data.driver_contact_number ?? data.driver_phone_1 ?? data.driver_info?.driver_phone_2 ?? data.driver_info?.driver_phone_1 ?? '-',
            Vendor_Name: data.vehicle_info.vehicle_type_id == 22 ? (data.vendor_info ? data.vendor_info.owner_name : '-') : '-',
            Vendor_Code: data.vehicle_info.vehicle_type_id == 22 ? (data.vendor_info ? data.vendor_info.vendor_code : '-') : '-',
            Vendor_Mobile_No: data.vehicle_info.vehicle_type_id == 22 ? (data.vendor_info ? data.vendor_info.owner_number : '-') : '-',
            Vendor_PAN_No: data.vehicle_info.vehicle_type_id == 22 ? (data.vendor_info ? data.vendor_info.pan_card_number : '-') : '-',
            Vendor_Town: data.vehicle_info.vehicle_type_id == 22 ? (data.vendor_info ? (data.vendor_info.city ? data.vendor_info.city : '-') : '-') : '-',
            Waiting_At: (
              <span className="badge rounded-pill bg-info"> 
                { data.vehicle_current_position == ACTION.TRIPSHEET_CREATED 
                  ? 'Tripsheet ✔️'
                  :  data.vehicle_current_position == ACTION.SHIPMENT_CREATED
                  ? 'Shipment ✔️'
                  : data.vehicle_current_position == ACTION.DIESEL_INDENT_CREATED
                  ? 'DI Creation ✔️'
                  : data.vehicle_current_position == ACTION.DIESEL_INDENT_CONFIRMED
                  ? 'DI Confirmation ✔️'
                  : data.vehicle_current_position == ACTION.ADVANCE_REJECTED
                  ? 'Advance ❌'
                  : '--'
                }
              </span>
            ),
            
            Screen_Duration: data.vehicle_current_position_updated_time,
            Overall_Duration: data.created_at,
            Action: (
              <CButton className="badge" color="warning">
                <Link className="text-white" to={`${data.nlmt_trip_in_id}`}>Advance Creation</Link>
              </CButton>
            ),
          })
        })
        setRowData(rowDataList)
      })
    }
  }

  useEffect(() => {
    loadVehicleReadyToTrip()
  }, [])

  const columns = [
    {
      name: 'S.No',
      selector: (row) => row.sno,
      sortable: true,
      center: true,
    },
    {
      name: 'Tripsheet Number',
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
      name: 'Town',
      selector: (row) => row.Vendor_Town,
      sortable: true,
      center: true,
    },
    {
      name: 'Status',
      selector: (row) => row.Waiting_At,
      sortable: true,
      center: true,
    },
    
    {
      name: 'Screen Duration',
      selector: (row) => row.Screen_Duration,
      center: true,
    },
    // {
    //   name: ' Overall Duration',
    //   selector: (row) => row.Overall_Duration,
    //   center: true,
    // },
    {
      name: 'Action',
      selector: (row) => row.Action,
      center: true,
    },
  ]

  /* Set Default Date (Today) in a Variable State */
  const ddd = new Date();
  ddd.setMonth(ddd.getMonth() - 1);
  const [defaultDate, setDefaultDate] = React.useState([
    new Date(ddd),
    // new Date(getCurrentDate('-')),
    new Date(getCurrentDate('-')),
  ])

  function getCurrentDate(separator = '') {
    let newDate = new Date()
    let date = newDate.getDate()
    let month = newDate.getMonth() + 1
    let year = newDate.getFullYear()

    return `${year}${separator}${month < 10 ? `0${month}` : `${month}`}${separator}${date < 10 ? `0${date}` : `${date}`
      }`
  }

  useEffect(() => {
    console.log(defaultDate)
    if (defaultDate) {
      setDefaultDate(defaultDate)
    } else {
    }
  }, [defaultDate])

  return (
    <>
      {!fetch && <Loader />}
      {fetch && (
        <>
          {screenAccess ? (
            <>
              <CCard className="mt-4">
                <CContainer className="mt-1">
                  <CRow className="mt-3">
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
                        className="m-3 px-3 text-white"
                        onClick={() => {
                          setFetch(false)
                          loadVehicleReadyToTrip('1')
                        }}
                      >
                        Filter
                      </CButton>
                      <CButton
                        size="lg-sm"
                        color="warning"
                        className="m-3 px-3 text-white"
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
                    fieldName={'Advance_user'}
                    showSearchFilter={true}
                  />
                  <hr></hr>
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

export default NlmtAdvancePayment
