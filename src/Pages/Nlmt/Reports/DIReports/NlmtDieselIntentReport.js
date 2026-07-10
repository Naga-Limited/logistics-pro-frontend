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
  CFormLabel,
  CNavLink,
  CCardImage} from '@coreui/react'
import { Link } from 'react-router-dom'
import CustomTable from 'src/components/customComponent/CustomTable'
import React, { useEffect, useState } from 'react'
import Loader from 'src/components/Loader'
import ReportService from 'src/Service/Report/ReportService'
// import { CSVLink} from 'react-csv'
// import addName from 'util'
import { toast } from 'react-toastify'
import VehicleMasterValidation from 'src/Utils/Master/VehicleMasterValidation'
import useForm from 'src/Hooks/useForm'
// import { ExportJsonCsv } from 'react-export-json-csv';
import { DateRangePicker } from 'rsuite'
import DieselSelectComponent from './Segments/DieselVehicleNumber/NlmtDieselVehicleList'
import * as XLSX from 'xlsx';
import FileSaver from 'file-saver'

import AccessDeniedComponent from 'src/components/commoncomponent/AccessDeniedComponent'
import JavascriptInArrayComponent from 'src/components/commoncomponent/JavascriptInArrayComponent'
import * as LogisticsProScreenNumberConstants from 'src/components/constants/LogisticsProScreenNumberConstants'
import CustomSpanButton3 from 'src/components/customComponent/CustomSpanButton3'
import { GetDateTimeFormat } from 'src/Pages/Nlmt/CommonMethods/CommonMethods'


const NlmtDieselIntentReport = (
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
let page_no = LogisticsProScreenNumberConstants.DieselIntentModule.Diesel_Intent_Creation_Report

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

  {/* ============= Date Range Picker Part Start =========================== */}

  const [dateRangePickerStartDate, setDateRangePickerStartDate] = useState('')
  const [dateRangePickerEndDate, setDateRangePickerEndDate] = useState('')
  const [reportVehicle, setReportVehicle] = useState(0)
  const [tripsheet, setTripsheet] = useState(0)
  const [DieselStatus, setDieselStatus] = useState(0)
  const [searchFilterData, setSearchFilterData] = useState([])
  const [InvoicePhoto, setInvoicePhoto] = useState(false)
  const [InvoicePhotoSrc, setInvoicePhotoSrc] = useState('')
  const [BunkReadingPhoto, setBunkReadingPhoto] = useState(false)
  const [BunkReadingSrc, setBunkReadingSrc] = useState('')

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

  if (event_type == 'vehicle_no') {
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
  } else if (event_type == 'diesel_status') {
    if (selected_value) {
      setDieselStatus(selected_value)
    } else {
      setDieselStatus(0)
    }
  }
  }
  useEffect(() => {
    ReportService.DieselReport().then((res) => {
        console.log(res.data)
        setStart(res.data)

      })
  }, [])

  const ACTION = {
    DI_CREATED: 1,
    DI_CONFIRMED: 2,
    DI_APPROVAL: 3,
  }

  let viewData

  function handleViewDocuments(e, id, type) {
    switch (type) {
      case 'BUNK_READING_PHOTO':
        {
          let singleUserInfo = viewData.filter((data) => data.id == id)
          setBunkReadingSrc(singleUserInfo[0].bunk_reading)
          setBunkReadingPhoto(true)
        }
        break
        case 'INVOICE_COPY_PHOTO':
        {
          let singleUserInfo = viewData.filter((data) => data.id == id)
          setInvoicePhotoSrc(singleUserInfo[0].invoice_copy)
          setInvoicePhoto(true)
        }
        break
      default:
        return 0
    }
  }
  let tableData1 = []
  const loadVehicleReadyToTrip = () => {
    let tableData = new FormData()
    // tableData.append('advpay_date_range', values.advpay_date_range)

    console.log(dateRangePickerStartDate, 'start date')
    console.log(dateRangePickerEndDate, 'end date')

    tableData.append('diesel_from_date_range', dateRangePickerStartDate)
    tableData.append('diesel_to_date_range', dateRangePickerEndDate)
    tableData.append('vehicle_number', reportVehicle)
    tableData.append('trip_sheet_no', tripsheet)
    tableData.append('diesel_status', DieselStatus)

    function formatDate(date) {
      var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

      if (month.length < 2)
          month = '0' + month;
      if (day.length < 2)
          day = '0' + day;

      return [day, month, year].join('/');
    }

    const getDateTime = (myDateTime, type=0) => {
      let myTime = '-'
      if(myDateTime){
        if(type == 1){
          myTime = new Date(myDateTime).toLocaleTimeString('en-US',{ hour: '2-digit', minute: '2-digit' });
        } else if(type == 2){
          myTime = new Date(myDateTime).toLocaleDateString('en-US',{ month: 'short', year: 'numeric' });
        } else {
          myTime = new Date(myDateTime).toLocaleString('en-US');
        }
      }

      return myTime
    }

    ReportService.DieselReport(tableData).then((res) => {
      setFetch(true)
      tableData1 = res.data.data
      let rowDataList = []
      setSearchFilterData(tableData1)
      //console.log(tableData1)
      viewData = res.data.data
      tableData1.map((data, index) => {
        rowDataList.push({
          sno: index + 1,
          Vehicle_Type: data.parking_info?.vehicle_type_id?.type,
          vehicle_number: data.parking_info?.vehicle_number,
          trip_sheet_no: data.parking_info?.trip_sheet_info?.trip_sheet_no,
          tripsheet_created: data.parking_info && data.parking_info.trip_sheet_info ? formatDate(data.parking_info.trip_sheet_info.created_at) : '-',
          driver_name: data.parking_info?.driver_name,
          vendor_name: data.di_vendor_info?.diesel_vendor_name,
          vendor_code: data.vendor_code,
          vendor_tds: data.vendor_tds ? data.vendor_tds : '-',
          vendor_hsn: data.vendor_hsn ? data.vendor_hsn : '-',
          bunk_reading: ( data.invoice_no ?
            // <CNavLink style={{'color':'blue'}} href={`${data.bunk_reading}`} target={'_blank'}>
            //   <b><u>{'reading_photo'}</u></b>
            // </CNavLink > : '-'
            <CustomSpanButton3
              handleViewDocuments={handleViewDocuments}
              Id={data.id}
              documentType={'BUNK_READING_PHOTO'}
            /> :'-'
          ),
          invoice_copy: ( data.invoice_no ?
            // <CNavLink style={{'color':'blue'}} href={`${data.invoice_copy}`} target={'_blank'}>
            //   <b><u>{'invoice_photo'}</u></b>
            // </CNavLink > : '-'
            <CustomSpanButton3
              handleViewDocuments={handleViewDocuments}
              Id={data.id}
              documentType={'INVOICE_COPY_PHOTO'}
            /> :'-'
          ),
          invoice_no: data.invoice_no,
          rate_of_ltrs: data.rate_of_ltrs,
          no_of_ltrs: data.no_of_ltrs,
          total_amount: data.total_amount,
          diesel_type: data.diesel_type == 0 ? 'Home Diesel':'Additional Diesel',
          diesel_vendor_sap_invoice_no: data.diesel_vendor_sap_invoice_no,
          diesel_status:
            // <span className="badge rounded-pill bg-info">
              data.diesel_status == ACTION.DI_CREATED
                ? 'DI Creation'
                : data.diesel_status == ACTION.DI_CONFIRMED
                ? 'DI Confirmed'
                : 'DI Approval',
          created_by: data.user_info?.emp_name,
          // created_at: data.created_at,
          di_creation_date: formatDate(data.di_creation_time),
          di_creation_time: getDateTime(data.di_creation_time,1),
          di_creation_month: getDateTime(data.di_creation_time,2),
          di_creation_remarks: data.remarks,
          di_confirmation_date: formatDate(data.confirmed_at),
          di_confirmation_time: getDateTime(data.confirmed_at,1),
          di_confirmation_month: getDateTime(data.confirmed_at,2),
          di_confirmation_remarks: data.confirmation_remarks,
          di_approval_date: formatDate(data.approved_at),
          di_approval_time: getDateTime(data.approved_at,1),
          di_approval_month: getDateTime(data.approved_at,2),
          di_approval_remarks: data.approval_remarks,
          Action: (
            <CButton
            className="text-white"
            color="warning"
            id={data.id}
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
  const [dataInCSV, setDataInCSV] = useState("");

    const Export_data = () => {
      let data = new FormData()
      data.append('startDate', values.startDate)
      data.append('endDate', values.endDate)
      data.append('vehicle_number', values.vehicle_number)
      data.append('trip_sheet_no', values.trip_sheet_no)
      ReportService.AdvanceExport(data).then((res) => {
        console.log(res.data)
        setDataInCSV(res.data)
      })
    };
  //   useEffect(() => {
  //     Export_data()
  // },[])

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
  let dateTimeString = GetDateTimeFormat(1)
  let fileName='Diesel_Indent_Report'+dateTimeString
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


  const columns = [
    {
      name: 'S.No',
      selector: (row) => row.sno,
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
      selector: (row) => row.vehicle_number,
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
      name: 'Tripsheet Date',
      selector: (row) => row.tripsheet_created,
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
      name: 'Vendor Code',
      selector: (row) => row.vendor_code,
      sortable: true,
      center: true,
    },
    {
      name: 'TDS Type',
      selector: (row) => row.vendor_tds,
      sortable: true,
      center: true,
    },
    {
      name: 'HSN Code',
      selector: (row) => row.vendor_hsn,
      sortable: true,
      center: true,
    },
    {
      name: 'invoice No',
      selector: (row) => row.invoice_no || '-',
      sortable: true,
      center: true,
    },
    {
      name: 'rate of ltrs',
      selector: (row) => row.rate_of_ltrs || '-',
      sortable: true,
      center: true,
    },
    {
      name: 'no.of.ltrs',
      selector: (row) => row.no_of_ltrs || '-',
      sortable: true,
      center: true,
    },
    {
      name: 'total amount',
      selector: (row) => row.total_amount||'-',
      sortable: true,
      center: true,
    },
    {
      name: 'diesel vendor sap invoice_no',
      selector: (row) => row.diesel_vendor_sap_invoice_no || '-',
      sortable: true,
      center: true,
    },
    {
      name: 'Bunk Reading Photo',
      selector: (row) => row.bunk_reading,
      sortable: true,
      center: true,
    },{
      name: 'Invoice Copy Photo',
      selector: (row) => row.invoice_copy,
      sortable: true,
      center: true,
    },
    {
      name: 'diesel type',
      selector: (row) => row.diesel_type,
      sortable: true,
      center: true,
    },
    {
      name: 'diesel status',
      selector: (row) => row.diesel_status,
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
      name: 'Created_at',
      selector: (row) => row.di_creation_date,
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
      startDate: '',
      endDate: '',
      vehicle_number:'',
      trip_sheet_no:'',
      diesel_status:''
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
            <CCol xs={12} md={3}>
            <CFormLabel htmlFor="VNum">
                  Vehicle Number
            </CFormLabel>
            <DieselSelectComponent
                  size="sm"
                  className="mb-1"
                  onChange={(e) => {
                    onChangeFilter(e, 'vehicle_no')
                  }}
                  label="vehicle_number"
                  id="vehicle_number"
                  name="vehicle_number"
                  // value={values.vehicle_number}
                  search_type="vehicle_number"
                  search_data={searchFilterData}
                />
            </CCol>
            <CCol xs={12} md={3}>
            <CFormLabel htmlFor="VNum">
                  TripSheet Number
            </CFormLabel>
              <DieselSelectComponent
                    size="sm-lg"
                    className="mb-2"
                    onChange={(e) => {
                      onChangeFilter(e, 'trip_sheet_no')
                    }}
                    label="trip_sheet_no"
                    id="trip_sheet_no"
                    name="trip_sheet_no"
                    //  value={values.trip_sheet_no}
                    search_type="trip_sheet_no"
                    search_data={searchFilterData}
                    />

          </CCol>
          <CCol xs={12} md={3}>
          <CFormLabel htmlFor="VNum">
                Diesel Status
          </CFormLabel>
           <DieselSelectComponent
                size="sm"
                className="mb-1"
                onChange={(e) => {
                  onChangeFilter(e, 'diesel_status')
                }}
                label="diesel_status"
                id="diesel_status"
                name="diesel_status"
                // value={values.diesel_status}
                search_type="diesel_status"
                search_data={searchFilterData}
              />
          </CCol >
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

          {/* Model for Advance Photo  */}
         <CModal visible={InvoicePhoto} onClose={() => setInvoicePhoto(false)} >
              <CModalHeader>
                <CModalTitle>Invoice Copy Photo</CModalTitle>
              </CModalHeader>
              <CModalBody>
                <CCardImage height ="500" orientation="top" src={InvoicePhotoSrc} />
              </CModalBody>
              <CModalFooter>
                <CButton color="secondary" onClick={() => setInvoicePhoto(false)}>
                  Close
                </CButton>
              </CModalFooter>
            </CModal>
            <CModal visible={BunkReadingPhoto} onClose={() => setBunkReadingPhoto(false)} >
              <CModalHeader>
                <CModalTitle>Bunk Reading Photo</CModalTitle>
              </CModalHeader>
              <CModalBody>
                <CCardImage height ="500" orientation="top" src={BunkReadingSrc} />
              </CModalBody>
              <CModalFooter>
                <CButton color="secondary" onClick={() => setBunkReadingPhoto(false)}>
                  Close
                </CButton>
              </CModalFooter>
            </CModal>

            {/* Model for Advance Photo  */}

          </CCard>
         </>) : (<AccessDeniedComponent />)}
       </>
      )}
    </>
  )
}

export default NlmtDieselIntentReport
