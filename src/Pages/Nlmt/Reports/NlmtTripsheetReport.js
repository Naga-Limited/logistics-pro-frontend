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
import { useReactToPrint } from 'react-to-print'
import TripSheetFilterComponent from './TripSheetFilterComponent/NlmtTripSheetFilterComponent'
import { GetDateTimeFormat } from '../CommonMethods/CommonMethods'
import * as NlmtScreenAccessCodes from 'src/components/constants/NlmtScreenAccessCodes'
import AccessDeniedComponent from 'src/components/commoncomponent/AccessDeniedComponent'
import JavascriptInArrayComponent from 'src/components/commoncomponent/JavascriptInArrayComponent'
import NlmtTSCreationService from 'src/Service/Nlmt/TSCreation/NlmtTSCreationService'
import NlmtTSPrint from './segments/NlmtTSPrint'
import Print_header_nlmt from 'src/components/printheadercomponent/Print_header_nlmt'
import NlmtTripSheetFilterComponent from './TripSheetFilterComponent/NlmtTripSheetFilterComponent'

const NlmtTripsheetReport = () => {

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
   let page_no = NlmtScreenAccessCodes.NlmtReportScreens.Nlmt_Tripsheet_Report

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
  const [visible, setVisible] = useState(false)
  const [singleVehicleInfo, setSingleVehicleInfo] = useState(false)
  const [editId, setEditId] = useState('')
  const [value, setValue] = React.useState([new Date(getCurrentDate('-')), new Date(getCurrentDate('-'))]);


  {/* ============= Date Range Picker Part Start =========================== */ }

  const [dateRangePickerStartDate, setDateRangePickerStartDate] = useState('')
  const [dateRangePickerEndDate, setDateRangePickerEndDate] = useState('')
  const [reportVehicle, setReportVehicle] = useState(0)
  const [searchFilterData, setSearchFilterData] = useState([])
  const handleView = (row) => {
    setEditId(row.id)        // ✅ MUST BE tripsheet_id
    setVisible(true)
  }
  const convert = (str) => {
    let date = new Date(str);
    let mnth = ("0" + (date.getMonth() + 1)).slice(-2);
    let day = ("0" + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join("-");

  }

  const ACTION = {
    TRIPSHEET_INITIATION: 0,
    TRIPSHEET_CREATED: 1,
    TRIPSHEET_ASSIGNED: 3,
    TRIPSHEET_CONFIRMED: 2,
  }

  useEffect(() => {

    if (value) {

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
  }, [value])

  {/* =============== Date Range Picker Part End =========================== */ }

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

  // const waitingAtData = (tripData, parkingId) => {
  //   let needed_data = 'Loading..'
  //   let parkingData = tripData.parking_yard_info

  //   if (parkingData.vehicle_current_position == '16') {
  //     needed_data = 'Vehicle Assignment'
  //   } else if (parkingData.vehicle_current_position == '20') {
  //     if (tripData.shipment_info) {
  //       let needed_ap_status = tripData.shipment_info.approval_status
  //       let key_data = needed_ap_status - 1
  //       needed_data = tripWaitingAtStatusArray[key_data]
  //     }
  //   } else if (parkingData.vehicle_current_position == '19') {
  //     if (parkingData.parking_status == '4') {
  //       needed_data = 'Trip Ended'
  //     } else {
  //       needed_data = 'Gate Out'
  //     }
  //   } else if (parkingData.vehicle_current_position == '22') {
  //     needed_data = 'Expense Closure'
  //   } else if (parkingData.vehicle_current_position == '26') {
  //     needed_data = 'Expense Closure'
  //   } else if (parkingData.vehicle_current_position == '27') {
  //     needed_data = 'Expense Approval'
  //   } else if (parkingData.vehicle_current_position == '28') {
  //     needed_data = 'Payment Submission'
  //   } else if (parkingData.vehicle_current_position == '29') {
  //     needed_data = 'Payment Submission Approval'
  //   } else if (parkingData.vehicle_current_position == '30') {
  //     needed_data = 'Payment Processed'
  //   }

  //   return needed_data
  // }

  const exportToCSV = () => {

    if (rowData.length == 0) {
      toast.warning('No Data Found..!')
      return false
    }
    let dateTimeString = GetDateTimeFormat(1)
    let fileName = 'Nlmt_TripSheet_Report_' + dateTimeString
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';
    const ws = XLSX.utils.json_to_sheet(rowData);
    const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  }

  const getVehicleTypeLabel = (vehicleTypeId) => {
    switch (Number(vehicleTypeId)) {
      case 21:
        return 'Own'
      case 22:
        return 'Hire'
      case 23:
        return 'Party'
      default:
        return '-'
    }
  }
  let tableData1 = []
  const loadVehicleReadyToTrip = () => {
    let tableData = new FormData()

    tableData.append('trip_from_date_range', dateRangePickerStartDate)
    tableData.append('trip_to_date_range', dateRangePickerEndDate)
    tableData.append('vehicle_number', reportVehicle)
    tableData.append('user_id', user_id)

    NlmtTSCreationService.TripsheetReport(tableData).then((res) => {
      console.log(res.data.data, 'Tripsheet Report api response')
      setFetch(true)

      /* ================= NORMALIZE API DATA ================= */
      let tableData1 = []

      if (Array.isArray(res.data?.data)) {
        tableData1 = res.data.data
      } else if (res.data?.data && typeof res.data.data === 'object') {
        tableData1 = [res.data.data]
      } else if (Array.isArray(res.data)) {
        tableData1 = res.data
      }

      /* ================= FILTER BY LOCATION ================= */
      const filterData = tableData1.filter(
        (item) =>
          item.parking_yard_info &&
          user_locations.includes(
            item.parking_yard_info.vehicle_location_id
          )
      )

      setSearchFilterData(filterData)

      /* ================= MAP TABLE DATA ================= */
      let rowDataList = []

      filterData.forEach((data, index) => {
        const driverName =
          data.driver_id == null
            ? data.parking_yard_info?.driver_name || '-'
            : `${data.trip_driver_info?.driver_name || ''} (${data.trip_driver_info?.driver_code || ''})`

        const contractorName =
          data.driver_id == null
            ? '-'
            : data.trip_driver_info?.Depo_Contractor_info?.contractor_name || '-'

          let tds_copy_link = data.driver_id ? '-' : (data.parking_yard_info && data.parking_yard_info.vendor_info && data.parking_yard_info.vendor_info.tds_dec_form_front ? data.parking_yard_info.vendor_info.tds_dec_form_front : '--')

        rowDataList.push({
          sno: index + 1,
          tripsheet_id: data.id, // ✅ ADD THIS
          vehicle_type: getVehicleTypeLabel(data.trip_vehicle_info?.vehicle_type_id),
          vehicle_number: data.trip_vehicle_info?.vehicle_number || '-',
          trip_sheet_no: data.nlmt_tripsheet_no || '-',
          driver_name: driverName,
          contractor_name: contractorName,
          expected_date_time: formatDate(data.expected_delivery_date),
          gate_in_time:
            data.parking_yard_info?.gate_in_date_time_string || '-',
          gate_out_time:
            data.parking_yard_info?.gate_out_date_time_string || '-',
          created_at: formatDate(data.created_at),
          // waiting_at: waitingAtData(data, data.parking_id),
          tripsheet_status:(  
              data.parking_yard_info?.tripsheet_open_status == ACTION.TRIPSHEET_CREATED
              ? 'TS Created'
              : data.parking_yard_info?.tripsheet_open_status == ACTION.TRIPSHEET_ASSIGNED
              ? 'TS Assigned' 
              : data.parking_yard_info?.tripsheet_open_status == ACTION.TRIPSHEET_CONFIRMED && (data.vehicle_current_position == '17' || data.vehicle_current_position == '21')
              ? 'TS Cancelled'
              : data.parking_yard_info?.tripsheet_open_status == ACTION.TRIPSHEET_CONFIRMED
              ? 'TS Closed'
              :'--'
          ),
          TDS_Copy: !(tds_copy_link == '-' || tds_copy_link == '--') ? (
            <a style={{color:'black'}} target='_blank' rel="noreferrer" href={tds_copy_link}>
              <i className="fa fa-eye" aria-hidden="true"></i>
            </a>
          ) : <>--</>,
          Action: (
            <CButton
              className="text-white"
              color="warning"
              id={data.id}
              size="sm"
            >
              <span className="float-start">
                <Link to={`${data.parking_yard_info.tripsheet_id}`}>
                  <i className="fa fa-eye"></i>&nbsp;View
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



  const columns = [
    {
      name: 'S.No',
      selector: (row) => row.sno,
      sortable: true,
      center: true,
    },
    {
      name: 'Vehicle Type',
      selector: (row) => row.vehicle_type,
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
      name: 'Tripsheet',
      selector: (row) => row.trip_sheet_no,
      sortable: true,
      center: true,
    },
    // {
    //   name: 'Waiting At',
    //   selector: (row) => row.waiting_at,
    //   sortable: true,
    //   center: true,
    // },
    {
      name: 'TS Status',
      selector: (row) => row.tripsheet_status,
      sortable: true,
      center: true,
    },
    // {
    //   name: 'Exp. Del. Date',
    //   selector: (row) => row.expected_date_time,
    //   sortable: true,
    //   center: true,
    // },
    {
      name: 'Created_at',
      selector: (row) => row.created_at,
      sortable: true,
      center: true,
    },
    {
      name: 'TDS Form',
      selector: (row) => row.TDS_Copy,
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
    vehicle_number: '',
    trip_sheet_no: '',
    purpose: '',
    to_divison: '',
    status: ''
  }

  const { values, errors, handleChange, onFocus, handleSubmit, enableSubmit, onBlur } = useForm(
    loadVehicleReadyToTrip,
    VehicleMasterValidation,
    formValues
  )

  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
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
            <>
              <CCard className="mt-4">
                <CContainer className="mt-1">
                  <CRow className="mt-1 mb-1" >
                    <CCol xs={12} md={3}>
                      <CFormLabel htmlFor="VNum">
                        Date Filter
                      </CFormLabel>
                      <DateRangePicker
                        style={{ width: '100rem', height: '100%', borderColor: 'black' }}
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
                      <NlmtTripSheetFilterComponent
                        size="sm"
                        className="mb-1"
                        onChange={(e) => {
                          onChangeFilter(e, 'vehicle_number')
                        }}
                        label="vehicle_number"
                        id="vehicle_number"
                        name="vehicle_number"
                        search_type="nlmt_vehicle_number"
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
                  <hr style={{ height: '2px', marginTop: '0.5px' }}></hr>
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
            color="primary"
            visible={visible}
            onClose={() => {
              setVisible(false)
              setEditId(null)
            }}
          >
                  <CModalHeader>
                    <Print_header_nlmt />
                  </CModalHeader>
            <CModalBody>
              {editId ? (
                <NlmtTSPrint tripsheetId={editId} />
              ) : (
                <p>Loading...</p>
              )}
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

export default NlmtTripsheetReport
