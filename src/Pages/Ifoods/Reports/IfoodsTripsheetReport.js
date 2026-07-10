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
import VehicleAssignmentService from 'src/Service/VehicleAssignment/VehicleAssignmentService'

import Print_footer from 'src/components/printheadercomponent/print_footer'
import * as XLSX from 'xlsx';
import FileSaver from 'file-saver'
import{ useReactToPrint } from 'react-to-print'

import DepoTSCreationService from 'src/Service/Depo/TSCreation/DepoTSCreationService'
import TripSheetFilterComponent from './TripSheetFilterComponent/TripSheetFilterComponent'
import IfoodsTSPrint from './segments/IfoodsTSPrint'
import DepoShipmentCreationService from 'src/Service/Depo/Shipment/DepoShipmentCreationService'
import { GetDateTimeFormat } from '../CommonMethods/CommonMethods'
import * as LogisticsProScreenNumberConstants from 'src/components/constants/LogisticsProScreenNumberConstants'
import AccessDeniedComponent from 'src/components/commoncomponent/AccessDeniedComponent'
import JavascriptInArrayComponent from 'src/components/commoncomponent/JavascriptInArrayComponent'
import IfoodsTSCreationService from 'src/Service/Ifoods/TSCreation/IfoodsTSCreationService'
import Print_header_ifoods from 'src/components/printheadercomponent/Print_header_ifoods'

const IfoodsTripsheetReport = (
  ) => {
  /*================== User Location Fetch ======================*/
  const user_info_json = localStorage.getItem('user_info')
  const user_info = JSON.parse(user_info_json)
  const user_locations = []

  /* Get User Locations From Local Storage */
  user_info.location_info.map((data, index) => {
    user_locations.push(data.id)
  })

  // console.log(user_locations)
  /*================== User Location Fetch ======================*/

   /* ==================== Access Part Start ========================*/
   const [screenAccess, setScreenAccess] = useState(false)
   let page_no = LogisticsProScreenNumberConstants.IfoodsModuleScreens.Ifoods_Tripsheet_Report

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
  }
  function getCurrentDate(separator = '') {
    let newDate = new Date()
    let date = newDate.getDate()
    let month = newDate.getMonth() + 1
    let year = newDate.getFullYear()

    return `${year}${separator}${month < 10 ? `0${month}` : `${month}`}${separator}${date < 10 ? `0${date}` : `${date}`}`
  }

  const deliveryStatusArray = [
    'Requested By User / Unpaused By User',
    'Request Reverted By User',
    'Approved By Manager',
    'Rejected By Manager',
    'Shipment Created By User',
    'Rejected By User',
    'DI Requested By User',
    'DI Request Approved By Manager',
    'DI Request Rejected By User',
    'DI Request Rejected By Manager',
    'DI Updated By User',
    'Shipment / Trip Cancelled By User',
    'Shipment Deleted By User',
    'Shipment All Deliveries PGI Completed',
    'Shipment Completed',
  ]

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
        needed_data = 'Tripsheet Created'
    } else if(parkingData.vehicle_current_position == '25'){
      if(tripData.shipment_info){
        let needed_ap_status = tripData.shipment_info.approval_status
        let key_data = needed_ap_status-1
        needed_data = tripWaitingAtStatusArray[key_data]
      }
    } else if(parkingData.vehicle_current_position == '19'){
      if(parkingData.parking_status == '4'){
        needed_data = 'Tripsheet Cancelled'
      } else {
        needed_data = 'Gate Out'
      }
    } else if(parkingData.vehicle_current_position == '19'){
      needed_data = 'Gate Out'
    } else if(parkingData.vehicle_current_position == '17'){
      needed_data = 'Tripsheet Updated'
    } else if(parkingData.vehicle_current_position == '20'){
      needed_data = 'Expense Closure'
    } else if(parkingData.vehicle_current_position == '27'){
      needed_data = 'Payment Approval'
    } else if(parkingData.vehicle_current_position == '29'){
      needed_data = 'Payment Submission Approval'
    } else if(parkingData.vehicle_current_position == '30'){
      needed_data = 'Payment Processed'
    }

    return needed_data
  }

  const exportToCSV = () => {
    let dateTimeString = GetDateTimeFormat(1)
    let fileName='Deppo_TripSheet_Report_'+dateTimeString
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
    TRIPSHEET_CREATED: 0,
    TRIPSHEET_ASSIGNED: 1,
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

    console.log(values.purpose)
    console.log(values.to_divison)
    IfoodsTSCreationService.TripsheetReport(tableData).then((res) => {
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
          trip_sheet_no: data.ifoods_tripsheet_no,
          driver_name: data.parking_yard_info.driver_name,
          vendor_name: data.parking_yard_info.ifoods_Vendor_info.vendor_name,

          expected_date_time: formatDate(data.expected_delivery_date),
          created_at: formatDate(data.created_at),
          waiting_at: waitingAtData(data, data.parking_yard_info.ifoods_parking_yard_gate_id),
          // waiting_at: waitingAtData1(filterData, data.parking_id),
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
            id={data.parking_yard_info.tripsheet_sheet_id}
            size="sm"
          >
            <span className="float-start">
            <Link to={`${data.parking_yard_info.tripsheet_sheet_id}`}>
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

  // const Edit = (id) => {
  //   setEditId('')
  //   console.log(id)
  //   DepoTSCreationService.singleTripDetailsList(id).then((response) => {
  //     setFetch(false)
  //     console.log(response)
  //     if (response.status == 200) {
  //       console.log(response.data.data)
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
      name: 'Vendor Name',
      selector: (row) => row.vendor_name,
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
  // const [value, onChange] = useState([new Date(), new Date()]);

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
                // onChange={getAdvanceDateRange(e)}
              />
              </CCol>
{/* 
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
          </CCol> */}


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

          <CModal
          size="lg"
          visible={visible}
          backdrop="static"
          scrollable
          onClose={() => setVisible(false)}
          ref={componentRef}
           >
          <CModalHeader>
          <Print_header_ifoods />
          </CModalHeader>
          <CModalBody>
          <IfoodsTSPrint
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
            </CCard> ) : ( <AccessDeniedComponent />
          )}
        </>
      )}
    </>
  )

}

export default IfoodsTripsheetReport
