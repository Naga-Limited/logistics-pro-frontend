import { CButton, CCard, CCol, CContainer, CFormLabel, CRow } from '@coreui/react'
import { Link } from 'react-router-dom'
import CustomTable from 'src/components/customComponent/CustomTable'
import React, { useEffect, useState } from 'react'
import Loader from 'src/components/Loader'
import AdvanceCreationService from 'src/Service/Advance/AdvanceCreationService'
import * as XLSX from 'xlsx';
import FileSaver from 'file-saver'
import AccessDeniedComponent from 'src/components/commoncomponent/AccessDeniedComponent'
import JavascriptInArrayComponent from 'src/components/commoncomponent/JavascriptInArrayComponent'
import * as LogisticsProScreenNumberConstants from 'src/components/constants/LogisticsProScreenNumberConstants'
import { GetDateTimeFormat } from '../Depo/CommonMethods/CommonMethods'
import { DateRangePicker } from 'rsuite'
import { toast } from 'react-toastify'


const AdvancePayment = () => {
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
  let page_no = LogisticsProScreenNumberConstants.AdvancePaymentModule.Advance_Payment_List

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

  const [rowData, setRowData] = useState([])
  const [fetch, setFetch] = useState(false)
  const [diesel_payment, setDiesel_payment] = useState('')
  const [bankpayment, setBank_payment] = useState('')

  const exportToCSV = () => {
    let dateTimeString = GetDateTimeFormat(1)
    let fileName='ExpenseClosureScreen_'+dateTimeString
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';
    const ws = XLSX.utils.json_to_sheet(rowData);
    const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], {type: fileType});
    FileSaver.saveAs(data, fileName + fileExtension);
  }

  let tableData = []
  const ACTION = {
    TRIPSHEET_CREATED: 16,
    SHIPMENT_CREATED: 22,
    NLCD_SHIPMENT_CREATED: 25,
    HIRE_TRIPSTO_AFTER_GATE_OUT: 10,
    HIRE_TRIPSTO_AFTER_GATE_OUT_NLCD: 14,
    TRIPSHEET_OWN_NLCD: 2,
    TRIPSHEET_SALES: 1,
    TRIPSHEET_OWN_NLFD: 1,
    TRIPSHEET_STO: 2,
  }

  const PENDING = {
    ADVANCE_FREIGHT_PENDING: 0,
    ADVANCE_DIESEL_PENDING: 0,
  }
  const loadVehicleReadyToTrip = (fresh_type = '') => {
    if (fresh_type !== '1') {
      AdvanceCreationService.getVehicleReadyToAdvance().then((res) => {
        setFetch(true)
        tableData = res.data.data
        let rowDataList = []
        const filterData1 = tableData.filter(
          (data) => (user_locations.indexOf(data.vehicle_location_id) != -1 && vehicle_types.indexOf(data.vehicle_type_id?.id) != -1)
        )
        const filterData = (filterData1).filter(
          (data) =>
            // data.trip_sheet_info?.trip_advance_eligiblity == 1 &&
            // data.trip_sheet_info?.purpose != 3 &&
            // data.trip_sheet_info?.status != 2
            // && data.trip_sheet_info?.unregistered_vendor == null
            // (data.vehicle_type_id.id == 3
            // ? data.trip_sheet_info?.status == 1
            // : data.trip_sheet_info?.trip_advance_eligiblity == 1
            // ? data.trip_sheet_info?.advance_status == 0
            // : data.trip_sheet_info?.purpose != 3)
            // data.trip_sheet_info?.advance_status == 0 &&
            // data.trip_sheet_info?.trip_advance_eligiblity == 1 &&
            // data.trip_sheet_info?.purpose != 3 &&
            // data.trip_sheet_info?.status != 2 ||
            ((data.vehicle_type_id.id == 3 && (data.trip_sheet_info?.purpose < 3 || data.trip_sheet_info?.purpose == 4)  && data.trip_sheet_info?.advance_payment_diesel == 0)|| (data.vehicle_current_position == '37' || data.vehicle_current_position == '39' ||data.vehicle_current_position == '41') || data.vehicle_type_id.id < 3)
        )
        console.log(filterData)

        filterData.map((data, index) => {
          rowDataList.push({
            sno: index + 1,
            Tripsheet_No: data.trip_sheet_info?.trip_sheet_no,
            Tripsheet_Date: data.trip_sheet_info.created_date,
            Vehicle_Type: data.vehicle_type_id.type,
            Vehicle_No: data.vehicle_number,
            Driver_Name: data.driver_name,
            Driver_Mobile_No: data.driver_contact_number,
            Vendor_Name: data.vehicle_type_id.id == 3 ? (data.vendor_info ? data.vendor_info.owner_name : '-') : '-',
            Vendor_Code: data.vehicle_type_id.id == 3 ? (data.vendor_info ? data.vendor_info.vendor_code : '-') : '-',
            Vendor_Mobile_No: data.vehicle_type_id.id == 3 ? (data.vendor_info ? data.vendor_info.owner_number : '-') : '-',
            Vendor_PAN_No: data.vehicle_type_id.id == 3 ? (data.vendor_info ? data.vendor_info.pan_card_number : '-') : '-',
            Vendor_Town: data.vehicle_type_id.id == 3 ? (data.vendor_info ? (data.vendor_info.city ? data.vendor_info.city : '-') : '-') : '-',
            Waiting_At: (
              <span className="badge rounded-pill bg-info">
                {data.vehicle_current_position == ACTION.TRIPSHEET_CREATED &&
                data.parking_status == ACTION.HIRE_TRIPSTO_AFTER_GATE_OUT
                  ? 'Trip STO(NLFD)'
                  : data.vehicle_current_position == ACTION.TRIPSHEET_CREATED &&
                    data.parking_status == ACTION.HIRE_TRIPSTO_AFTER_GATE_OUT_NLCD
                  ? 'Trip STO(NLCD)'
                  : data.trip_sheet_info?.to_divison == ACTION.TRIPSHEET_OWN_NLCD &&
                    data.trip_sheet_info?.purpose == ACTION.TRIPSHEET_SALES
                  ? 'FG Sales(NLCD)'
                  : data.trip_sheet_info?.to_divison == ACTION.TRIPSHEET_OWN_NLFD &&
                    data.trip_sheet_info?.purpose == ACTION.TRIPSHEET_SALES
                  ? 'FG Sales(NLFD)'
                  : data.trip_sheet_info?.to_divison == ACTION.TRIPSHEET_OWN_NLFD &&
                    data.trip_sheet_info?.purpose == ACTION.TRIPSHEET_STO
                  ? 'Trip STO(NLFD)'
                  : data.trip_sheet_info?.to_divison == ACTION.TRIPSHEET_OWN_NLCD &&
                    data.trip_sheet_info?.purpose == ACTION.TRIPSHEET_STO
                  ? 'Trip STO(NLCD)'
                  : // :data.vehicle_current_position == ACTION.TRIPSHEET_CREATED
                  // ? 'TripSheet Creation'
                  data.vehicle_current_position == ACTION.SHIPMENT_CREATED
                  ? 'Shipment Created(NLFD)'
                  : data.vehicle_current_position == ACTION.NLCD_SHIPMENT_CREATED
                  ? 'Shipment Created(NLCD)'
                  : 'Advance Payment'}
              </span>
            ),
            pending_status:(
              <span className="badge rounded-pill bg-info">
                {data.advance_info && data.advance_info.sap_freight_payment_document_no == PENDING.ADVANCE_FREIGHT_PENDING &&
                    data.advance_info.sap_diesel_payment_document_no == PENDING.ADVANCE_DIESEL_PENDING && data.advance_info.advance_payment_diesel > 0
                  ? 'FREIGHT & Diesel Doc.Pending'
                  : data.advance_info && data.advance_info.sap_diesel_payment_document_no == PENDING.ADVANCE_DIESEL_PENDING && data.advance_info.advance_payment_diesel > 0
                  ? 'Diesel Doc. Pending'
                  : data.advance_info && data.advance_info.sap_freight_payment_document_no == PENDING.ADVANCE_FREIGHT_PENDING
                  ? 'Freight Doc. Pending'
                  : '-'}
              </span>
            ),
            Screen_Duration: data.vehicle_current_position_updated_time,
            Overall_Duration: data.created_at,
            Action: (
              <CButton className="badge" color="warning">
                <Link className="text-white" to={`${data.parking_yard_gate_id}`}>Advance Creation</Link>
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
      console.log(defaultDate, 'defaultDate') 

      AdvanceCreationService.getVehicleReadyToAdvanceFilterSearch(report_form_data).then((res) => {
        setFetch(true)
        tableData = res.data.data
        let rowDataList = []
        const filterData1 = tableData.filter(
          (data) => (user_locations.indexOf(data.vehicle_location_id) != -1 && vehicle_types.indexOf(data.vehicle_type_id?.id) != -1)
        )
        const filterData = (filterData1).filter(
          (data) =>
            // data.trip_sheet_info?.trip_advance_eligiblity == 1 &&
            // data.trip_sheet_info?.purpose != 3 &&
            // data.trip_sheet_info?.status != 2
            // && data.trip_sheet_info?.unregistered_vendor == null
            // (data.vehicle_type_id.id == 3
            // ? data.trip_sheet_info?.status == 1
            // : data.trip_sheet_info?.trip_advance_eligiblity == 1
            // ? data.trip_sheet_info?.advance_status == 0
            // : data.trip_sheet_info?.purpose != 3)
            // data.trip_sheet_info?.advance_status == 0 &&
            // data.trip_sheet_info?.trip_advance_eligiblity == 1 &&
            // data.trip_sheet_info?.purpose != 3 &&
            // data.trip_sheet_info?.status != 2 ||
            ((data.vehicle_type_id.id == 3 && (data.trip_sheet_info?.purpose < 3 || data.trip_sheet_info?.purpose == 4)  && data.trip_sheet_info?.advance_payment_diesel == 0)|| (data.vehicle_current_position == '37' || data.vehicle_current_position == '39' ||data.vehicle_current_position == '41') || data.vehicle_type_id.id < 3)
        )
        console.log(filterData)

        filterData.map((data, index) => {
          rowDataList.push({
            sno: index + 1,
            Tripsheet_No: data.trip_sheet_info?.trip_sheet_no,
            Tripsheet_Date: data.trip_sheet_info.created_date,
            Vehicle_Type: data.vehicle_type_id.type,
            Vehicle_No: data.vehicle_number,
            Driver_Name: data.driver_name,
            Driver_Mobile_No: data.driver_contact_number,
            Vendor_Name: data.vehicle_type_id.id == 3 ? (data.vendor_info ? data.vendor_info.owner_name : '-') : '-',
            Vendor_Code: data.vehicle_type_id.id == 3 ? (data.vendor_info ? data.vendor_info.vendor_code : '-') : '-',
            Vendor_Mobile_No: data.vehicle_type_id.id == 3 ? (data.vendor_info ? data.vendor_info.owner_number : '-') : '-',
            Vendor_PAN_No: data.vehicle_type_id.id == 3 ? (data.vendor_info ? data.vendor_info.pan_card_number : '-') : '-',
            Vendor_Town: data.vehicle_type_id.id == 3 ? (data.vendor_info ? (data.vendor_info.city ? data.vendor_info.city : '-') : '-') : '-',
            Waiting_At: (
              <span className="badge rounded-pill bg-info">
                {data.vehicle_current_position == ACTION.TRIPSHEET_CREATED &&
                data.parking_status == ACTION.HIRE_TRIPSTO_AFTER_GATE_OUT
                  ? 'Trip STO(NLFD)'
                  : data.vehicle_current_position == ACTION.TRIPSHEET_CREATED &&
                    data.parking_status == ACTION.HIRE_TRIPSTO_AFTER_GATE_OUT_NLCD
                  ? 'Trip STO(NLCD)'
                  : data.trip_sheet_info?.to_divison == ACTION.TRIPSHEET_OWN_NLCD &&
                    data.trip_sheet_info?.purpose == ACTION.TRIPSHEET_SALES
                  ? 'FG Sales(NLCD)'
                  : data.trip_sheet_info?.to_divison == ACTION.TRIPSHEET_OWN_NLFD &&
                    data.trip_sheet_info?.purpose == ACTION.TRIPSHEET_SALES
                  ? 'FG Sales(NLFD)'
                  : data.trip_sheet_info?.to_divison == ACTION.TRIPSHEET_OWN_NLFD &&
                    data.trip_sheet_info?.purpose == ACTION.TRIPSHEET_STO
                  ? 'Trip STO(NLFD)'
                  : data.trip_sheet_info?.to_divison == ACTION.TRIPSHEET_OWN_NLCD &&
                    data.trip_sheet_info?.purpose == ACTION.TRIPSHEET_STO
                  ? 'Trip STO(NLCD)'
                  : // :data.vehicle_current_position == ACTION.TRIPSHEET_CREATED
                  // ? 'TripSheet Creation'
                  data.vehicle_current_position == ACTION.SHIPMENT_CREATED
                  ? 'Shipment Created(NLFD)'
                  : data.vehicle_current_position == ACTION.NLCD_SHIPMENT_CREATED
                  ? 'Shipment Created(NLCD)'
                  : 'Advance Payment'}
              </span>
            ),
            pending_status:(
              <span className="badge rounded-pill bg-info">
                {data.advance_info && data.advance_info.sap_freight_payment_document_no == PENDING.ADVANCE_FREIGHT_PENDING &&
                    data.advance_info.sap_diesel_payment_document_no == PENDING.ADVANCE_DIESEL_PENDING && data.advance_info.advance_payment_diesel > 0
                  ? 'FREIGHT & Diesel Doc.Pending'
                  : data.advance_info && data.advance_info.sap_diesel_payment_document_no == PENDING.ADVANCE_DIESEL_PENDING && data.advance_info.advance_payment_diesel > 0
                  ? 'Diesel Doc. Pending'
                  : data.advance_info && data.advance_info.sap_freight_payment_document_no == PENDING.ADVANCE_FREIGHT_PENDING
                  ? 'Freight Doc. Pending'
                  : '-'}
              </span>
            ),
            Screen_Duration: data.vehicle_current_position_updated_time,
            Overall_Duration: data.created_at,
            Action: (
              <CButton className="badge" color="warning">
                <Link className="text-white" to={`${data.parking_yard_gate_id}`}>Advance Creation</Link>
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
      name: 'Current Status',
      selector: (row) => row.Waiting_At,
      sortable: true,
      center: true,
    },
    {
      name: 'Pending Docs',
      selector: (row) => row.pending_status,
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

    return `${year}${separator}${month < 10 ? `0${month}` : `${month}`}${separator}${
      date < 10 ? `0${date}` : `${date}`
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
          </> ) : (<AccessDeniedComponent />)}
        </>
      )}
    </>
  )
}

export default AdvancePayment
