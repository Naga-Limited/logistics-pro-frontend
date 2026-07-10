import { 
  CButton, 
  CCard, 
  CContainer, 
  CCol,
  CRow,
  CModal,
  CModalHeader, 
  CModalBody,
  CModalFooter, 
  CFormLabel
} from '@coreui/react'
import { Link } from 'react-router-dom'
import CustomTable from 'src/components/customComponent/CustomTable'
import React, { useEffect, useRef, useState } from 'react'
import Loader from 'src/components/Loader' 
import { toast } from 'react-toastify'
import VehicleMasterValidation from 'src/Utils/Master/VehicleMasterValidation'
import useForm from 'src/Hooks/useForm' 
import { DateRangePicker } from 'rsuite' 
import Print_header from 'src/components/printheadercomponent/print_header'
import Print_footer from 'src/components/printheadercomponent/print_footer'
import * as XLSX from 'xlsx';
import FileSaver from 'file-saver'
import{ useReactToPrint } from 'react-to-print' 
import DepoTSCreationService from 'src/Service/Depo/TSCreation/DepoTSCreationService'
import TripSheetFilterComponent from './TripSheetFilterComponent/TripSheetFilterComponent'
import DepoTSPrint from './segments/DepoTSPrint' 
import { GetDateTimeFormat } from '../CommonMethods/CommonMethods'
import * as LogisticsProScreenNumberConstants from 'src/components/constants/LogisticsProScreenNumberConstants'
import AccessDeniedComponent from 'src/components/commoncomponent/AccessDeniedComponent'
import JavascriptInArrayComponent from 'src/components/commoncomponent/JavascriptInArrayComponent'

const DepoTripsheetReport = () => {

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

  // console.log(user_locations)
  /*================== User Location Fetch ======================*/

   /* ==================== Access Part Start ========================*/
   const [screenAccess, setScreenAccess] = useState(false)
   let page_no = LogisticsProScreenNumberConstants.DepoModuleScreens.Depo_Tripsheet_Report

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

  const [value, setValue] = React.useState([new Date(getCurrentDate('-')), new Date(getCurrentDate('-'))]);

  const [rowData, setRowData] = useState([])
  const [fetch, setFetch] = useState(false) 
  const [visible, setVisible] = useState(false) 

  {/* ============= Date Range Picker Part Start =========================== */}

  const [dateRangePickerStartDate, setDateRangePickerStartDate] = useState('')
  const [dateRangePickerEndDate, setDateRangePickerEndDate] = useState('')
  const [reportVehicle, setReportVehicle] = useState(0)
  const [searchFilterData, setSearchFilterData] = useState([])

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
  }
  function getCurrentDate(separator = '') {
    let newDate = new Date()
    let date = newDate.getDate()
    let month = newDate.getMonth() + 1
    let year = newDate.getFullYear()

    return `${year}${separator}${month < 10 ? `0${month}` : `${month}`}${separator}${date < 10 ? `0${date}` : `${date}`}`
  }

  const tripWaitingAtStatusArray = [
    'Shipment Approval',
    'Shipment Plan Change',
    'Shipment Creation',
    'Vehicle Assignment',
    'PGI Complete',
    'Vehicle Assignment',
    'DI Request Approval',
    'Delivery Insert',
    'PGI Complete',
    'PGI Complete',
    'PGI Complete',
    '---',
    'Vehicle Assignment',
    'Gate Out',
    '---',
  ]

  const waitingAtData = (tripData, parkingId) => {
    let needed_data = 'Loading..'
    let parkingData = tripData.parking_yard_info

    if(parkingData.vehicle_current_position == '16'){
        needed_data = 'Vehicle Assignment'
    } else if(parkingData.vehicle_current_position == '20'){
      if(tripData.shipment_info){
        let needed_ap_status = tripData.shipment_info.approval_status
        let key_data = needed_ap_status-1
        needed_data = tripWaitingAtStatusArray[key_data]
      }
    } else if(parkingData.vehicle_current_position == '19'){
      if(parkingData.parking_status == '4'){
        needed_data = 'Trip Ended'
      } else {
        needed_data = 'Gate Out'
      }
    } else if(parkingData.vehicle_current_position == '22'){
      needed_data = 'Expense Closure'
    } else if(parkingData.vehicle_current_position == '26'){
      needed_data = 'Expense Closure'
    } else if(parkingData.vehicle_current_position == '27'){
      needed_data = 'Expense Approval'
    } else if(parkingData.vehicle_current_position == '28'){
      needed_data = 'Payment Submission'
    } else if(parkingData.vehicle_current_position == '29'){
      needed_data = 'Payment Submission Approval'
    } else if(parkingData.vehicle_current_position == '30'){
      needed_data = 'Payment Processed'
    }

    return needed_data
  }

  const exportToCSV = () => {

    if(rowData.length == 0){
      toast.warning('No Data Found..!')
      return false
    }
    let dateTimeString = GetDateTimeFormat(1)
    let fileName='Deppo_TripSheet_Report_'+dateTimeString
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';
    const ws = XLSX.utils.json_to_sheet(rowData);
    const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], {type: fileType}); 
    FileSaver.saveAs(data, fileName + fileExtension);
  } 

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

  let tableData1 = []
  const loadVehicleReadyToTrip = () => {
    let tableData = new FormData()
    console.log(dateRangePickerStartDate, 'start date')
    console.log(dateRangePickerEndDate, 'end date')

    tableData.append('trip_from_date_range', dateRangePickerStartDate)
    tableData.append('trip_to_date_range', dateRangePickerEndDate)
    tableData.append('vehicle_number', reportVehicle)
    tableData.append('user_id', user_id)

    console.log(values.purpose)
    console.log(values.to_divison)
    DepoTSCreationService.TripsheetReport(tableData).then((res) => {
      console.log(res.data,'editData')
      setFetch(true)
      tableData1 = res.data
      let rowDataList = []
      let filterData = tableData1.filter(
        (data) => user_locations.indexOf(data.parking_yard_info.vehicle_location_id) != -1
      )
      console.log(filterData,'filterData')
      setSearchFilterData(filterData)
      filterData.map((data, index) => {
        rowDataList.push({
          sno: index + 1,
          vehicle_number: data.trip_vehicle_info.vehicle_number,
          trip_sheet_no: data.depo_tripsheet_no,
          driver_name: data.trip_driver_info.driver_name,
          contractor_name: data.trip_driver_info.Depo_Contractor_info.contractor_name,

          expected_date_time: formatDate(data.expected_delivery_date),
          gate_in_time: data.parking_yard_info ? data.parking_yard_info.gate_in_date_time_string : '-',
          gate_out_time: data.parking_yard_info ? data.parking_yard_info.gate_out_date_time_string : '-',
          created_at: formatDate(data.created_at),
          waiting_at: waitingAtData(data, data.parking_id), 
          status:(
            Number(data.parking_yard_info.vehicle_current_position) > 20 && Number(data.parking_yard_info.vehicle_current_position) < 30 ? 'TS Completed'
            : data.status == 1
            ? 'TS Created'
            : data.status == 3
            ? 'TS Assigned'
            : data.status == 2
            ? 'TS Closed'
            :'TS Rejected'
          ),
          Action: (
            <CButton
            className="text-white"
            color="warning"
            id={data.depo_tripsheet_id}
            size="sm"
          >
            <span className="float-start">
            <Link to={`${data.parking_id}`}>
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

  const [editId, setEditId] = useState('')

  const columns = [
    {
      name: 'S.No',
      selector: (row) => row.sno,
      sortable: true,
      center: true,
    },
    {
      name: 'Contractor Name',
      selector: (row) => row.contractor_name,
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
      name: 'Driver Name',
      selector: (row) => row.driver_name,
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
      name: 'Waiting At',
      selector: (row) => row.waiting_at,
      sortable: true,
      center: true,
    },
    {
      name: 'Trip status',
      selector: (row) => row.status,
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
      name: 'Created_at',
      selector: (row) => row.created_at,
      sortable: true,
      center: true,
    },
    {
      name: 'Action',
      selector: (row) => row.Action,
      center: true,
    }
  ] 

  const formValues = {
    trip_from_date_range: '',
    trip_to_date_range: '',
    vehicle_number:'',
    trip_sheet_no:'',
    purpose:'',
    to_divison:'',
    status:''
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
        <>
          {screenAccess ? (
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
                    />
                  </CCol>

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
                      search_type="depo_vehicle_number"
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
                      loadVehicleReadyToTrip()
                    }}
                  >
                    Filter
                  </CButton>
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
              </CContainer>

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
                  <DepoTSPrint
                    values={values} 
                    onClick={(e) => {editId}}
                    handleChange={handleChange}
                    formatDate={formatDate}
                    singleVehicleInfo={singleVehicleInfo}
                  />
                </CModalBody>
                <hr />
                <Print_footer />
                <CModalFooter>
                  <CButton 
                    className="btn btn-success btn-lg"
                    onClick={printReceipt}
                  >
                    Print
                  </CButton>
                </CModalFooter>
              </CModal>

            </CCard> ) : ( <AccessDeniedComponent />
          )} 
        </>
      )}
    </>
  )

}

export default DepoTripsheetReport
