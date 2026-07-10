import { CButton, CCard, CContainer,CFormSelect,CForm,
  CCol,
  CRow,
  CModal,
  CModalHeader,
  CModalTitle,
  CTabPane,
  CModalBody,
  CModalFooter,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CFormInput,
  CFormLabel} from '@coreui/react'
import { Link, useParams } from 'react-router-dom'
import CustomTable from 'src/components/customComponent/CustomTable'
import React, { useEffect, useRef, useState } from 'react'
import Loader from 'src/components/Loader'
import ReportService from 'src/Service/Report/ReportService'
// import { CSVLink} from 'react-csv'
// import addName from "util";
import { toast } from 'react-toastify'
import VehicleMasterValidation from 'src/Utils/Master/VehicleMasterValidation'
import useForm from 'src/Hooks/useForm'
// import { ExportJsonCsv } from 'react-export-json-csv';
import { DateRangePicker } from 'rsuite'
import TripSheetFilterComponent from './TripSheetFilterComponent/TripSheetFilterComponent'
import TSPrint from './segments/TSPrint'
import VehicleAssignmentService from 'src/Service/VehicleAssignment/VehicleAssignmentService'
import Print_header from 'src/components/printheadercomponent/print_header'
import Print_footer from 'src/components/printheadercomponent/print_footer'
import * as XLSX from 'xlsx';
import FileSaver from 'file-saver'
import{ useReactToPrint } from 'react-to-print'
import { GetDateTimeFormat } from '../Depo/CommonMethods/CommonMethods'
import DivisionApi from 'src/Service/SubMaster/DivisionApi'

const TSCreationReport = (
  ) => {
  /*================== User Location Fetch ======================*/
  const user_info_json = localStorage.getItem('user_info')
  const user_info = JSON.parse(user_info_json)
  const user_locations = []

  /* Get User Locations From Local Storage */
  user_info.location_info.map((data, index) => {
    user_locations.push(data.id)
  })

  /* Set Party Vehicles Tripsheet Enable Condition */
  let party_need_array = user_info.vehicle_type_info.filter((data)=>data.id==4)
  const party_enabled = party_need_array.length > 0 ? 1 : 0
  // console.log(party_need_array,'party_need_array')
  // console.log(party_enabled,'party_enabled')

  // console.log(user_locations)
  /*================== User Location Fetch ======================*/

  const [value, setValue] = React.useState([new Date(getCurrentDate('-')), new Date(getCurrentDate('-'))]);

  const [rowData, setRowData] = useState([])
  const [fetch, setFetch] = useState(false)
  const [currentDeliveryId, setCurrentDeliveryId] = useState('')
  const [visible, setVisible] = useState(false)
  const [start, setStart] = useState('')
  const [trip_id, setTrip_id] = useState('')
  const [shipmentRouteError, setShipmentRouteError] = useState('')

  {/* ============= Date Range Picker Part Start =========================== */}

  const [dateRangePickerStartDate, setDateRangePickerStartDate] = useState('')
  const [dateRangePickerEndDate, setDateRangePickerEndDate] = useState('')
  const [reportVehicle, setReportVehicle] = useState(0)
  const [searchFilterData, setSearchFilterData] = useState([])
  const [status, setStatus] = useState('')
  const [to_division, setTo_divison] = useState(0)

  const  convert = (str) => {
    let date = new Date(str);
    let mnth = ("0" + (date.getMonth() + 1)).slice(-2);
    let day = ("0" + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join("-");

  }

  useEffect (()=>{

    if(value){

      console.log(value)
      let fromDate = value[0];
      let toDate = value[1];
      console.log(convert(fromDate))
      console.log(convert(toDate))
      setDateRangePickerStartDate(convert(fromDate));
      setDateRangePickerEndDate(convert(toDate));

    } else {

      setDateRangePickerStartDate('');
      setDateRangePickerEndDate('');

    }
  },[value])

  {/* =============== Date Range Picker Part End =========================== */}

  const onChange = (event) => {
    // console.log(event)
    let vehicle_number = event.value
    console.log(vehicle_number)
    let seleted_vehicle = start.find(vehicle => vehicle.vehicle_number == vehicle_number)
    if(seleted_vehicle){
      let tableData = new FormData()
      tableData.append('trip_sheet_no', seleted_vehicle.trip_sheet_no)
    }
    if (vehicle_number) {
      values.vehicle_number = vehicle_number
      // values.trip_sheet_no = seleted_vehicle.trip_sheet_no
    } else {
      values.vehicle_number = ''
    }
  }


  const onChangeFilter = (event, event_type) => {
    var selected_value = event.value
    console.log(selected_value, 'selected_value')

    if (event_type == 'vehicle_number') {
      if (selected_value) {
        setReportVehicle(selected_value)
      } else {
        setReportVehicle(0)
      }
    }
    else if (event_type == 'status') {
      if (selected_value) {
        setStatus(selected_value)
      } else {
        setStatus('')
      }
    }
  }
  function getCurrentDate(separator = '') {
    let newDate = new Date()
    let date = newDate.getDate()
    let month = newDate.getMonth() + 1
    let year = newDate.getFullYear()

    return `${year}${separator}${month < 10 ? `0${month}` : `${month}`}${separator}${date < 10 ? `0${date}` : `${date}`}`
  }

  const getDateTime = (myDateTime, type=0) => {
    let myTime = '-'
    if(type == 1){
      myTime = new Date(myDateTime).toLocaleTimeString('en-US',{ hour: '2-digit', minute: '2-digit' });
    } else if(type == 2){
      myTime = new Date(myDateTime).toLocaleDateString('en-US',{ month: 'short', year: 'numeric' });
    } else {
      myTime = new Date(myDateTime).toLocaleString('en-US');
    }
    
    return myTime
  }

  const closureStatusCheck = (code,type) => {
    let status = 'Not Completed'
    if(type == 1){ /* Expense Closure */
      if(code >= 1){
        status = 'Completed'
      }
    } else if(type == 2){ /* Income Closure */
      if(code >= 3){
        status = 'Completed'
      }
    } else { /* Settlement Closure */
      if(code == 6){
        status = 'Completed'
      } else if(code == 5){
        status = 'Partially Completed'
      }
    }

    return status
  }

  const vehicle_current_position_array =
  [
    "",                                 /*0*/
    "Parking Yard Gate In",             /*1*/
    "Vehicle Inspection Completed",     /*2*/
    "Vehicle Inspection Rejected",      /*3*/
    "Vehicle Maintenance Started",      /*4*/
    "Vehicle Maintenance Ended",        /*5*/
    "RMSTO Vehicle Taken",              /*6*/
    "OTHERS Vehicle Taken",             /*7*/
    "Document Verification Completed",  /*8*/
    "Document Verification Rejected",   /*9*/
    "-","-","-","-","-","-",                  /*10 - 15*/
    "Tripsheet Created",                /*16*/
    "Tripsheet Cancelled",              /*17*/
    "Advance Payment Completed","",     /*18,19*/
    "NLFD Shipment Created",            /*20*/
    "NLFD Shipment Deleted",            /*21*/
    "NLFD Shipment Completed",          /*22*/
    "NLCD Shipment Created",            /*23*/
    "NLCD Shipment Deleted",            /*24*/
    "NLCD Shipment Completed",          /*25*/
    "Expense Closure Completed",        /*26*/  
    "Income Closure Completed",         /*27*/
    "Settlement Closure Completed",     /*28*/    
    "-","-","-","-","-","-",            /*29 - 34*/   
    "RJ Sale Order Created","",         /*35,36*/
    "Diesle Indent Completed","",       /*37*/
    "Diesle Indent Confirmed","",       /*39*/
    "Diesle Indent Approved","",        /*41*/
  ]

  const exportToCSV = () => {
    let dateTimeString = GetDateTimeFormat(1)
    let fileName='TripSheet_Report_'+dateTimeString
    // let fileName='TripSheet'
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';
    const ws = XLSX.utils.json_to_sheet(rowData);
    const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], {type: fileType});
    // debugger
    //console.log(tableData);
    FileSaver.saveAs(data, fileName + fileExtension);
  }
  const ACTION = {
    TRIPSHEET_CREATED: 1,
    TRIPSHEET_ASSIGNED: 3,
    TRIPSHEET_CONFIRMED: 2,
  }
  const SOURCED_BY = {
    LOGISTICS_TEAM: 1,
    WH_TEAM: 2,
    INVENTRY_TEAM: 3,
  }
  const PURPOSE = {
    FG_SALES: 1,
    FG_STO: 2,
    RM_STO: 3,
    OTHERS: 4,
    FCI: 5,
  }
  const SAPFLAG = {
    Stop: 0,
    Start: 1,
    Change: 2,
  }

  let tableData1 = []
  const loadVehicleReadyToTrip = (party=0) => {
    let tableData = new FormData()
    // tableData.append('advpay_date_range', values.advpay_date_range)

    console.log(dateRangePickerStartDate, 'start date')
    console.log(dateRangePickerEndDate, 'end date')

    tableData.append('trip_from_date_range', dateRangePickerStartDate)
    tableData.append('trip_to_date_range', dateRangePickerEndDate)
    // tableData.append('startDate', values.startDate)
    // tableData.append('endDate', values.endDate)
    tableData.append('vehicle_number', reportVehicle)
    tableData.append('tripsheet_open_status', status)
    tableData.append('to_divison', to_division)
    tableData.append('purpose', values.purpose)

    if(party == '1'){
      tableData.append('party', 1)
    } else {
      tableData.append('party', 0)
    }

        // console.log(dateRangePickerStartDate)
    // console.log(values.trip_sheet_no)
    console.log(values.purpose)
    console.log(values.to_divison)
    ReportService.TripsheetReport(tableData).then((res) => {
     
      setFetch(true)
      tableData1 = res.data
      console.log(tableData1,'filterData1')
      let rowDataList = []
      // setSearchFilterData(tableData1)

      /* Tripsheet No : Duplicate Records Validation */
      const tripseet_nos_array = tableData1.map(({ trip_sheet_no }) => trip_sheet_no);
      const tableDataFiltered = tableData1.filter(({ trip_sheet_no }, index) => !tripseet_nos_array.includes(trip_sheet_no, index + 1));
      console.log(tableDataFiltered,'filterData2')
      let filterData = tableDataFiltered.filter(
        (data) => user_locations.indexOf(data.vehicle_location_id) != -1
      )
      console.log(filterData,'filterData3')
      setSearchFilterData(filterData)

      // tableData1.map((data, index) => {
        filterData.map((data, index) => {
        rowDataList.push({
          sno: index + 1,
          trip_sheet_no: data.trip_sheet_no,
          created_at: formatDate(data.created_at),
          ts_time: getDateTime(data.created_at,1),
          ts_month: getDateTime(data.created_at,2),          
          tripsheet_status:(
            data.tripsheet_open_status == ACTION.TRIPSHEET_CREATED
              ? 'TS Created'
              : data.tripsheet_open_status == ACTION.TRIPSHEET_ASSIGNED
              ? 'TS Assigned'
              // : data.tripsheet_open_status == ACTION.TRIPSHEET_CONFIRMED && data.vehicle_current_position == '17'
              // ? 'TS Cancelled'
              : data.tripsheet_open_status == ACTION.TRIPSHEET_CONFIRMED && (data.vehicle_current_position == '17' || data.vehicle_current_position == '21' || data.vehicle_current_position == '24')
              ? 'TS Cancelled'
              : data.tripsheet_open_status == ACTION.TRIPSHEET_CONFIRMED
              ? 'TS Closed'
              :'TS Rejected'
          ),
          vehicle_previous_status: vehicle_current_position_array[data.vehicle_current_position],
          remarks: data.remarks ? data.remarks : '--',
          accounts_remarks: data.trip_remarks ? data.trip_remarks : '--',
          Vehicle_Type: data.vehicle_type == 'Party Vehicle' ? (data.vehicle_others_type == '2' ? 'D2R Vehicle' : data.vehicle_type) : data.vehicle_type,
          vehicle_Group: data.vehicle_group ? data.vehicle_group : '-',
          vehicle_number: data.vehicle_number,  
          trip_opening_km: data.odometer_km ? data.odometer_km : '-',
          trip_closing_km: data.odometer_closing_km ? data.odometer_closing_km : '-',
          vehicle_Capacity_In_Ton: data.vehicle_capacity,                  
          to_divison: data.purpose == PURPOSE.OTHERS ? othersDivisionNameFinder(data) : data.to_divison == 2 ? 'NLCD':'NLFD',
          purpose: (
            data.purpose == PURPOSE.FG_SALES
              ? 'FG Sales'
              : data.purpose == PURPOSE.FG_STO
              ? 'FG STO'
              : data.purpose == PURPOSE.RM_STO
              ? 'RM STO'
              : data.purpose == PURPOSE.OTHERS
              ? 'OTHERS'
              : data.purpose == PURPOSE.FCI
              ? 'FCI'
              :''
          ),
           /*SAP Flag */
          sap_flag: (
            data.sap_flag == SAPFLAG.Stop
              ? 'Stopped'
              : data.sap_flag == SAPFLAG.Start
              ? 'Started'
              : data.sap_flag == SAPFLAG.Change
              ? 'Updated'
              : '-'
          ),
          freight_rate_per_tone: data.freight_rate_per_tone,
          trip_advance_eligiblity: data.trip_advance_eligiblity == '1'?'Yes':'No',
          advance_amount: data.advance_amount,
          advance_payment_bank: data.advance_payment_bank,
          advance_payment_diesel: data.advance_payment_diesel,
          advance_otp: user_info.is_admin == 1 ? data.advance_otp : '****',
          vehicle_sourced_by: (
            data.vehicle_sourced_by == SOURCED_BY.LOGISTICS_TEAM
              ? 'Logistic Team'
              : data.vehicle_sourced_by == SOURCED_BY.INVENTRY_TEAM
              ? 'Inventry Team'
              : data.vehicle_sourced_by == SOURCED_BY.WH_TEAM
              ? 'WH team'
              :''
          ),
          driver_name: data.driver_name,
          driver_mobile_no: data.driver_contact_number,
          Vendor_Code: data.vendor_code ? data.vendor_code : '-',
          Vendor_Name: data.owner_name ? data.owner_name : '-',
          Vendor_Name2: data.owner_name ? data.owner_name2 : '-',
          Vendor_Mobile_No: data.owner_number ? data.owner_number : '-',
          Vendor_PAN_No: data.pan_card_number ? data.pan_card_number : '-',
          Vendor_Town: data.city ? data.city : '-',
          Shed_Name: data.shed_name ? data.shed_name : '-',
          Shed_Mobile_No: data.shed_owner_phone_1 ? data.shed_owner_phone_1 : '-',
          expected_date_time: formatDate(data.expected_date_time),
          expected_return_date_time: formatDate(data.expected_return_date_time),
          Expense_Closure_Completed_Status: data.tripsheet_is_settled ? closureStatusCheck(data.tripsheet_is_settled,1) : 'Not Completed',
          Expense_Closure_Completed_Date: data.expense_created_at ? formatDate(data.expense_created_at) : '-',
          Settlement_Closure_Completed_Status: data.tripsheet_is_settled ? closureStatusCheck(data.tripsheet_is_settled,3) : 'Not Completed',
          Settlement_Closure_Completed_Date: data.settled_at ? formatDate(data.settled_at) : '-',
          created_by: data.emp_name,
          Action: (
            <CButton
            className="text-white"
            color="warning"
            id={data.id}
            disabled={data.status == 2}
            size="sm"
          >
            <span className="float-start">
            <Link to={`${data.id}`}>
              <i className="fa fa-eye" aria-hidden="true"></i> &nbsp;View
             </Link>
            </span>
          </CButton>
          ),
        })
      })
      setRowData(rowDataList)
    })
  }
  useEffect(() => {
    loadVehicleReadyToTrip()
  }, [])

  function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [day, month, year].join('-');
}

const [singleVehicleInfo, setSingleVehicleInfo] = useState(false)
const [divisionData, setDivisionData] = useState([])
const othersDivisionArray = ['','NLFD','NLFA','NLDV','NLMD','NLLD','NLCD','NLIF','NLSD']
const othersDivisionNameFinder = (data) => {
  let ot_div = '-'
  divisionData && divisionData.map((vv,kk)=>{
    if(data.others_division == vv.id){
      ot_div = othersDivisionArray[vv.id]
    }
  })
  return ot_div
}

useEffect(() => {
  
  DivisionApi.getDivision().then((response) => {
    let editData = response.data.data
    setDivisionData(editData)
  })
  
},[])

  const [editId, setEditId] = useState('')
  // const Edit = (id) => {
  //   setEditId('')
  //   console.log(id)
  //   ReportService.singleTripDetailsList(id).then((response) => {
  //     setFetch(false)
  //     console.log(response)
  //     if (response.status == 200) {
  //       console.log(response.data.data,'singleTripDetailsList')
  //       setFetch(true)
  //       let editData = response.data.data
  //       setVisible(true)
  //       values.trip_sheet_no = editData.trip_sheet_no
  //       values.vehicle_type = editData.parking_info.vehicle_type_id !=null ? editData.parking_info.vehicle_type_id.type:''
  //       values.vehicle_number = editData.parking_info !=null ? editData.parking_info.vehicle_number:''
  //       values.driver_name = editData.parking_info !=null ? editData.parking_info.driver_name : ''
  //       values.driver_number = editData.parking_info !=null ? editData.parking_info.driver_contact_number : ''
  //       values.to_divison = editData.to_divison
  //       values.purpose = editData.purpose
  //       values.sap_flag = editData.sap_flag  // Edited or updated value for sap_flag
  //       values.trip_advance_eligiblity == editData.trip_advance_eligiblity
  //       values.advance_amount == editData.advance_amount
  //       values.advance_payment_diesel == editData.advance_payment_diesel
  //       values.advance_payment_bank == editData.advance_payment_bank
  //       values.expected_return_date_time == editData.expected_return_date_time
  //       values.expected_date_time == editData.expected_date_time
  //       values.remark == editData.remark
  //       // setEditId(id)
  //       // console.log(editData)
  //       setSingleVehicleInfo(response.data.data)
  //       setEditId(id)
  //     }
  //   })
  // }

  const columns = [
    {
      name: 'S.No',
      selector: (row) => row.sno,
      sortable: true,
      center: true,
    },
    {
      name: 'Tripsheet Number',
      selector: (row) => row.trip_sheet_no,
      sortable: true,
      center: true,
    },
    {
      name: 'Created_at',
      selector: (row) => row.created_at,
      sortable: true,
      center: true,
    },
    {
      name: 'Trip status',
      selector: (row) => row.tripsheet_status,
      sortable: true,
      center: true,
    },
    {
      name: 'Trip Remarks',
      selector: (row) => row.remarks,
      sortable: true,
      center: true,
    },
    {
      name: 'Acc. Remarks',
      selector: (row) => row.accounts_remarks,
      sortable: true,
      center: true,
    },
    {
      name: 'Vehicle No',
      selector: (row) => row.vehicle_number,
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
      name: 'to divison',
      selector: (row) => row.to_divison,
      sortable: true,
      center: true,
    },
    {
      name: 'purpose',
      selector: (row) => row.purpose,
      sortable: true,
      center: true,
    },
     /*Table grid View SAP Flag */
     {
      name: 'SAP Flag',
      selector: (row) => row.sap_flag,
      sortable: true,
      center: true,
    },
    {
      name: 'freight rate per tone',
      selector: (row) => row.freight_rate_per_tone || '-',
      sortable: true,
      center: true,
    },
    {
      name: 'trip advance eligiblity',
      selector: (row) => row.trip_advance_eligiblity,
      sortable: true,
      center: true,
    },
    {
      name: 'advance amount',
      selector: (row) => row.advance_amount||'-',
      sortable: true,
      center: true,
    },
    {
      name: 'advance payment bank',
      selector: (row) => row.advance_payment_bank||'-',
      sortable: true,
      center: true,
    },
    {
      name: 'advance payment diesel',
      selector: (row) => row.advance_payment_diesel||'-',
      sortable: true,
      center: true,
    },
    {
      name: 'advance otp',
      selector: (row) => row.advance_otp,
      sortable: true,
      center: true,
    },
    {
      name: 'sourced by',
      selector: (row) => row.vehicle_sourced_by || '-',
      sortable: true,
      center: true,
    },
    {
      name: 'Driver Name',
      selector: (row) => row.driver_name,
      sortable: true,
      center: true,
    },
    {
      name: 'Exp.Delivery Date',
      selector: (row) => row.expected_date_time,
      sortable: true,
      center: true,
    },
    {
      name: 'Exp.Return Date',
      selector: (row) => row.expected_return_date_time||'-',
      sortable: true,
      center: true,
    },
    {
      name: 'Created_by',
      selector: (row) => row.created_by,
      sortable: true,
      center: true,
    },
    {
      name: 'Action',
      selector: (row) => row.Action,
      center: true,
    }
  ]
  // const [value, onChange] = useState([new Date(), new Date()]);

    const formValues = {
      trip_from_date_range: '',
      trip_to_date_range: '',
      vehicle_number:'',
      trip_sheet_no:'',
      purpose:'',
      to_divison:'',
      status:'',
      created_by:''


    }
    const { values, errors, handleChange, onFocus, handleSubmit, enableSubmit, onBlur } = useForm(
      loadVehicleReadyToTrip,
      VehicleMasterValidation,
      formValues
    )

    const componentRef = useRef();
    const handleprint = useReactToPrint({
      content : () => componentRef.current,
    });
    function printReceipt() {
      window.print();
    }
  return (
    <>
      {!fetch && <Loader />}
      {fetch && (
        <CCard className="mt-4">
          <CContainer className="mt-1">
          <CRow className="mt-1 mb-1" >
          <CCol xs={12} md={3}>
          <CFormLabel htmlFor="VNum">
                Date Filter
          </CFormLabel>
          <DateRangePicker
            style={{width: '100rem',height:'100%',borderColor:'black'}}
            className="mb-2"
            id="advpay_date_range"
            name="advpay_date_range"
            format="dd-MM-yyyy"
            value={value}
            onChange={setValue}
            // onChange={getAdvanceDateRange(e)}
          />
          </CCol>
          {/* <CCol xs={12} md={3}>
          <CFormLabel htmlFor="VNum">
                Division
          </CFormLabel>
          <TripSheetFilterComponent
                size="sm"
                className="mb-1"
                onChange={(e) => {
                  to_divison(e)
                }}
                label="to_divison"
                id="to_divison"
                name="to_divison"
                value={values.to_divison || '1'}
                search_type="to_divison"
              />
          </CCol> */}

           <CCol xs={12} md={3}>
          <CFormLabel htmlFor="VNum">
                Vehicle Number
          </CFormLabel>
            <TripSheetFilterComponent
                  size="sm"
                  className="mb-1"
                  onChange={(e) => {
                    onChangeFilter(e, 'vehicle_number')
                  }}
                  label="vehicle_number"
                  id="vehicle_number"
                  name="vehicle_number"
                  // value={values.vehicle_number}
                  search_type="vehicle_number"
                  search_data={searchFilterData}
                  noOptionsMessage="Status Not found"
            />
           </CCol>
           <CCol xs={12} md={3}>
           <CFormLabel htmlFor="VNum">
                TripSheet Status
           </CFormLabel>
           <TripSheetFilterComponent
                  size="sm"
                  className="mb-1"
                  onChange={(e) => {
                    onChangeFilter(e, 'status')
                  }}
                  label="status"
                  id="status"
                  name="status"
                  // value={values.vehicle_number}
                  search_type="status"
                  search_data={searchFilterData}
                  noOptionsMessage="Status Not found"
            />
           </CCol>

          </CRow>
          <CCol
            className="offset-md-9"
            xs={12}
            sm={12}
            md={3}
            style={{ display: 'flex', justifyContent: 'end' }}
          >
            <CButton
              size="lg-sm"
              color="primary"
              className="mx-3 px-3 text-white"
              onClick={() => {
                setFetch(false)
                loadVehicleReadyToTrip()}}
            >
              Filter
            </CButton>
            {party_enabled == 1 && (
              <CButton
                size="lg-sm"
                color="primary"
                className="mx-3 px-3 text-white"
                onClick={() => {
                  setFetch(false)
                  loadVehicleReadyToTrip(1)}}
              >
                Party Vehicles Filter
              </CButton>
            )}
          </CCol>
          <hr style={{height:'2px', marginTop:'0.5px'}}></hr>
          <CRow>

          <CCol
          className="offset-md-9"
          xs={12}
          sm={12}
          md={3}
          style={{ display: 'flex', justifyContent: 'end' }}
          >
            <CButton
             size="lg-sm"
             color="warning"
             className="mx-3 px-3 text-white"
             onClick={(e) => {
              exportToCSV()}
              }>
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
          </CContainer>
          {/* {singleVehicleInfo && (
              <TSPrint
              values={values}
              //  delivery_data={editId}
              //  division={1}
              onClick={(e) => {editId}}
              handleChange={handleChange}
              formatDate={formatDate}
              singleVehicleInfo={singleVehicleInfo}
              />)} */}
          <CModal
          size="lg"
          visible={visible}
          backdrop="static"
          scrollable
          onClose={() => setVisible(false)}
          ref={componentRef}
           >
          <CModalHeader>
          <Print_header />
          </CModalHeader>
          <CModalBody>
          <TSPrint
           values={values}
          //  delivery_data={editId}
          //  division={1}
          onClick={(e) => {editId}}
          handleChange={handleChange}
          formatDate={formatDate}
          singleVehicleInfo={singleVehicleInfo}
          />
          </CModalBody>
          <hr />
          <Print_footer />
          <CModalFooter>
            <CButton className="btn btn-success btn-lg"
            onClick={printReceipt}>Print</CButton>
          </CModalFooter>
        </CModal>
        </CCard>
      )}
    </>
  )

}

export default TSCreationReport
