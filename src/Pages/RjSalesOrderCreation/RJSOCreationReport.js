import { 
  CButton, 
  CCard, 
  CContainer,
  CCol,
  CRow,
  CModal,
  CModalHeader,
  CModalTitle, 
  CModalBody,
  CModalFooter, 
  CFormLabel
} from '@coreui/react' 
import CustomTable from 'src/components/customComponent/CustomTable'
import React, { useEffect, useState } from 'react'
import Loader from 'src/components/Loader'
import ReportService from 'src/Service/Report/ReportService'
import VehicleMasterValidation from 'src/Utils/Master/VehicleMasterValidation'
import useForm from 'src/Hooks/useForm'
import { DateRangePicker } from 'rsuite';
import FileSaver from 'file-saver'
import * as XLSX from 'xlsx'; 
import RJReportFilterComponent from './RJReportFilterComponent/RJReportFilterComponent'
import { APIURL } from 'src/App'
import { GetDateTimeFormat } from '../Depo/CommonMethods/CommonMethods'
import DriverMasterService from 'src/Service/Master/DriverMasterService'
import { toast } from 'react-toastify'

const RJSOCreationReport = () => {
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

  const [value, setValue] = React.useState([new Date(getCurrentDate('-')), new Date(getCurrentDate('-'))]);

  const [rowData, setRowData] = useState([])
  const [fetch, setFetch] = useState(false)
  const [visible, setVisible] = useState(false)
  const [reportVehicle, setReportVehicle] = useState(0)
  const [tripsheet, setTripsheet] = useState(0)


  {/* ============= Date Range Picker Part Start =========================== */}

  const [dateRangePickerStartDate, setDateRangePickerStartDate] = useState('')
  const [dateRangePickerEndDate, setDateRangePickerEndDate] = useState('')
  const [searchFilterData, setSearchFilterData] = useState([])
  const [driverData, setDriverData] = useState([])

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

    if (event_type == 'vehicle_number') {
      if (selected_value) {
        setReportVehicle(selected_value)
      } else {
        setReportVehicle(0)
      }
    } else if (event_type == 'trip_sheet_no') {
      if (selected_value) {
        setTripsheet(selected_value)
      } else {
        setTripsheet(0)
      }
    }
  }

  const driverCodeFinder = (data) => {
    let d_code = ''
    driverData.map((vv,kk)=>{
      if(vv.driver_id == data){
        d_code = vv.driver_code
      }
    })
    return d_code
  }

  useEffect(() => {
    DriverMasterService.getDrivers().then((response) => {
      setFetch(true)
      let viewData = response.data.data
      setDriverData(viewData)
    })
  }, [])


  /* RSFPFP - RJ_SHED_FILE_PATH_FRONT_PART */
  const RSFPFP = APIURL.substring(0,APIURL.lastIndexOf("api/v1"))
  /* RSFPBP - RJ_SHED_FILE_PATH_BACK_PART */
  // const RSFPBP = 'storage/TripsheetClosure/POD/RJ-SHED/' /* Local Server */
  const RSFPBP = 'public/storage/TripsheetClosure/POD/RJ-SHED/' /* Quality & Production Server */

  const Global_Rjshedcopy_Url = RSFPFP+RSFPBP

  if(user_info.is_admin == 1){
    console.log(APIURL,'APIURL')
    console.log(RSFPFP,'RJ_SHED_FILE_PATH_FRONT_PART')
    console.log(RSFPBP,'RJ_SHED_FILE_PATH_BACK_PART')
    console.log(Global_Rjshedcopy_Url,'RJ SHED COPY FILE PATH')
  }

  const balance_amount_finder = (total,adv) => {
    let total_amount = Number(parseFloat(total).toFixed(2))
    let advance_amount = Number(parseFloat(adv).toFixed(2))
    let balance_amount = total_amount-advance_amount
    return Number(parseFloat(balance_amount).toFixed(2))
  }

  const RJSO_STATUS_ARRAY = ['','Requested','RJSO Created','Cancelled','Invoice Completed']

  let tableData1 = []
  const loadVehicleReadyToTrip = () => {
    let tableData = new FormData() 
    console.log(dateRangePickerStartDate, 'start date')
    console.log(dateRangePickerEndDate, 'end date')

    tableData.append('rj_from_date_range', dateRangePickerStartDate)
    tableData.append('rj_to_date_range', dateRangePickerEndDate)
    tableData.append('vehicle_number', reportVehicle)
    tableData.append('trip_sheet_no', tripsheet) 
    console.log(reportVehicle)
    console.log(tripsheet)
    setFetch(false)
    ReportService.RJSalesOrderReport(tableData).then((res) => {
      console.log(res.data)
      setFetch(true)
      tableData1 = res.data 
      let rowDataList = []
      setSearchFilterData(tableData1)
      tableData1.map((data, index) => {
        rowDataList.push({
          sno: index + 1,
          trip_sheet_no: data.trip_sheet_no,
          rj_so_no: data.rj_so_no ? data.rj_so_no : '-',
          created_at:formatDate(data.created_at),
          rj_invoice_no: data.rj_invoice_no ? data.rj_invoice_no : '-',
          bill_date:data.income_posting_date ? formatDate(data.income_posting_date) : '-',
          vehicle_number: data.vehicle_number,
          driver_code: driverData.length > 0 ? driverCodeFinder(data.driver_id) : '-',
          driver_name: data.driver_name,
          customer_code: data.customer_code,
          customer_name: data.customer_name,
          customer_mobile_no: data.customer_mobile_no,
          RJ_Shed_Copy: (
            <a style={{color:'black'}} target='_blank' rel="noreferrer" href={Global_Rjshedcopy_Url+data.rj_shed_copy}>
              <i className="fa fa-eye" aria-hidden="true"></i>
            </a>
          ),
          uom: data.uom,
          order_qty: data.order_qty,
          freight_income: data.freight_income,
          advance_amount: data.advance_amount,
          balance_amount: balance_amount_finder(data.freight_income,data.advance_amount),
          material_descriptions: data.material_descriptions,
          hsn_code: data.hsn_code,
          Vehicle_Type: data.vehicle_type,
          last_Delivery_point: data.last_Delivery_point,
          actual_delivery_date_time: data.actual_delivery_date_time,
          empty_load_km: data.empty_load_km,
          loading_point: data.loading_point,
          unloading_point:data.unloading_point,
          empty_km_after_unloaded: data.empty_km_after_unloaded,
          expected_delivery_date_time: data.expected_delivery_date_time,
          expected_return_date_time: data.expected_return_date_time,
          rjso_status: RJSO_STATUS_ARRAY[data.rjso_status],
          rj_pod_copy: data.rj_pod_copy
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

  function getCurrentDate(separator = '') {
    let newDate = new Date()
    let date = newDate.getDate()
    let month = newDate.getMonth() + 1
    let year = newDate.getFullYear()

    return `${year}${separator}${month < 10 ? `0${month}` : `${month}`}${separator}${date < 10 ? `0${date}` : `${date}`}`
  }



  const exportToCSV = () => {
    if(rowData.length == 0){
      toast.warning('No Data Found..!')
      return false
    }
    let dateTimeString = GetDateTimeFormat(1)
    let fileName='RJSO_Report_'+dateTimeString 
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';
    const ws = XLSX.utils.json_to_sheet(rowData);
    const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], {type: fileType}); 
    FileSaver.saveAs(data, fileName + fileExtension);
  }

  const columns = [
    {
      name: 'S.No',
      selector: (row) => row.sno,
      sortable: true,
      center: true,
    },
    {
      name: 'Tripsheet No',
      selector: (row) => row.trip_sheet_no,
      sortable: true,
      center: true,
    },
    {
      name: 'RJ SO.No',
      selector: (row) => row.rj_so_no,
      sortable: true,
      center: true,
    },
    {
      name: 'Date',
      selector: (row) => row.created_at,
      sortable: true,
      center: true,
    },
    {
      name: 'Bill Doc.No',
      selector: (row) => row.rj_invoice_no,
      sortable: true,
      center: true,
    },
    {
      name: 'Bill Date',
      selector: (row) => row.bill_date,
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
      name: 'Driver Code',
      selector: (row) => row.driver_code,
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
      name: 'Customer Code',
      selector: (row) => row.customer_code,
      sortable: true,
      center: true,
    },
    {
      name: 'Customer Name',
      selector: (row) => row.customer_name,
      sortable: true,
      center: true,
    },
    {
      name: 'RJ Shed Copy',
      selector: (row) => row.RJ_Shed_Copy,
      center: true,
    },
    {
      name: 'UOM',
      selector: (row) => row.uom,
      sortable: true,
      center: true,
    },
    {
      name: 'Ordered QTY',
      selector: (row) => row.order_qty,
      sortable: true,
      center: true,
    },
    {
      name: 'Freight Income',
      selector: (row) => row.freight_income,
      sortable: true,
      center: true,
    },
    {
      name: 'Advance Amount',
      selector: (row) => row.advance_amount,
      sortable: true,
      center: true,
    },
    {
      name: 'Balance Amount',
      selector: (row) => row.balance_amount,
      sortable: true,
      center: true,
    },
    {
      name: 'Material Description',
      selector: (row) => row.material_descriptions,
      sortable: true,
      center: true,
    },
    {
      name: 'HSN Code',
      selector: (row) => row.hsn_code,
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
      name: 'Last Delivery Point',
      selector: (row) => row.last_Delivery_point,
      sortable: true,
      center: true,
    },
    {
      name: 'Actual Delivery Date & Time',
      selector: (row) => row.actual_delivery_date_time,
      sortable: true,
      center: true,
    },
    {
      name: 'Empty KM for RJ Loading',
      selector: (row) => row.empty_load_km,
      sortable: true,
      center: true,
    },
    {
      name: 'Loading Point',
      selector: (row) => row.loading_point,
      sortable: true,
      center: true,
    },
    {
      name: 'Unloading Point',
      selector: (row) => row.unloading_point,
      sortable: true,
      center: true,
    },
    {
      name: 'Empty KM after RJ unloading',
      selector: (row) => row.empty_km_after_unloaded,
      sortable: true,
      center: true,
    },
    {
      name: 'Expected Delivery Date & time',
      selector: (row) => row.expected_delivery_date_time,
      sortable: true,
      center: true,
    },
    {
      name: 'Expected Return Date & time',
      selector: (row) => row.expected_return_date_time,
      sortable: true,
      center: true,
    },

    {
      name: 'Status',
      selector: (row) => row.rjso_status,
      sortable: true,
      center: true,
    },

  ]

  const formValues = {
    rj_from_date_range: '',
    rj_to_date_range: '',
    vehicle_number:'',
    trip_sheet_no :'',
    vehicle_maintenance_status:'',
  }
  const { values, errors, handleChange, onFocus, handleSubmit, enableSubmit, onBlur } = useForm(
    loadVehicleReadyToTrip,
    VehicleMasterValidation,
    formValues
  )

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
                  id="rj_date_range"
                  name="rj_date_range"
                  format="dd-MM-yyyy"
                  value={value}
                  onChange={setValue} 
                />
              </CCol>

              <CCol xs={12} md={3}>
                <CFormLabel htmlFor="VNum">
                      Vehicle Number
                </CFormLabel>
                <RJReportFilterComponent
                  size="sm"
                  className="mb-1"
                  onChange={(e) => {
                    onChangeFilter(e,'vehicle_number')
                  }}
                  label="vehicle_number"
                  id="vehicle_number"
                  name="vehicle_number"

                  search_type="vehicle_number"
                  search_data={searchFilterData}
                />
              </CCol>

              <CCol xs={12} md={3}>
                <CFormLabel htmlFor="VNum">
                      TripSheet Number
                </CFormLabel>
                <RJReportFilterComponent
                  size="sm-lg"
                  className="mb-2"
                  onChange={(e) => {
                    onChangeFilter(e,'trip_sheet_no')
                  }}
                  label="trip_sheet_no"
                  id="trip_sheet_no"
                  name="trip_sheet_no" 
                  search_type="trip_sheet_no"
                  search_data={searchFilterData}
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
            size="xl"
            visible={visible}
            backdrop="static"
            scrollable
            onClose={() => setVisible(false)}
          >
            <CModalHeader>
              <CModalTitle style={{ display: 'flex', justifyContent: 'end'}}>Diesel Intent Vouchar</CModalTitle>
            </CModalHeader>

            <CModalBody>

            </CModalBody>
            <CModalFooter>
              <CButton color="secondary" onClick={() => setVisible(false)}>
                Close
              </CButton>
            </CModalFooter>
          </CModal>
        </CCard>
      )}
    </>
  )
}

export default RJSOCreationReport
