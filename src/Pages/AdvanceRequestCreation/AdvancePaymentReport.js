import { CButton, CCard, CContainer,CFormSelect,
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
  CHeader,
  CCardImage} from '@coreui/react'
import { Link } from 'react-router-dom'
import CustomTable from 'src/components/customComponent/CustomTable'
import React, { useEffect, useState } from 'react'
import Loader from 'src/components/Loader'
import ReportService from 'src/Service/Report/ReportService'
// import { CSVLink} from 'react-csv'
// import AdvancePrint from './segments/AdvancePrint'
// import addName from "util";
import { toast } from 'react-toastify'
import VehicleMasterValidation from 'src/Utils/Master/VehicleMasterValidation'
import useForm from 'src/Hooks/useForm'
// import { ExportJsonCsv } from 'react-export-json-csv';
import AdvanceVehicleSelectCompont from './segments/VehicleListComponent/AdvanceVehicleList'
import { DateRangePicker } from 'rsuite'
import * as XLSX from 'xlsx';
import FileSaver from 'file-saver'

import AccessDeniedComponent from 'src/components/commoncomponent/AccessDeniedComponent'
import JavascriptInArrayComponent from 'src/components/commoncomponent/JavascriptInArrayComponent'
import * as LogisticsProScreenNumberConstants from 'src/components/constants/LogisticsProScreenNumberConstants'
import CustomSpanButton3 from 'src/components/customComponent/CustomSpanButton3'

const AdvancePayment = (srVehicle
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
let page_no = LogisticsProScreenNumberConstants.AdvancePaymentModule.Advance_Payment_Report

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
  const [vehicle_numbers, setVehicle_numbers] = useState('')
  const [shipmentRouteError, setShipmentRouteError] = useState('')
  const [Vendor_Name, setVendor_Name] = useState([])

  {/* ============= Date Range Picker Part Start =========================== */}

  const [dateRangePickerStartDate, setDateRangePickerStartDate] = useState('')
  const [dateRangePickerEndDate, setDateRangePickerEndDate] = useState('')
  const [reportVehicle, setReportVehicle] = useState(0)
  const [searchFilterData, setSearchFilterData] = useState([])
  const [AdvancePhoto, setAdvancePhoto] = useState(false)
  const [AdvancePhotoSrc, setAdvancePhotoSrc] = useState('')
  const [AddAdvancePhoto, setAddAdvancePhoto] = useState(false)
  const [AddAdvancePhotoSrc, setAddAdvancePhotoSrc] = useState('')

  let tableData1 = []
  let viewData

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

  function handleViewDocuments(e, id, type) {
    switch (type) {
      case 'ADVANCE_FORM_PHOTO':
        {
          let singleUserInfo = viewData.filter((data) => data.id == id)
          setAdvancePhotoSrc(singleUserInfo[0].advance_form)
          setAdvancePhoto(true)
        }
        break
        case 'ADD_ADVANCE_FORM_PHOTO':
        {
          let singleUserInfo = viewData.filter((data) => data.id == id)
          setAddAdvancePhotoSrc(singleUserInfo[0].additional_advance_form)
          setAddAdvancePhoto(true)
        }
        break
      default:
        return 0
    }
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

  const loadVehicleReadyToTrip = () => {
    let tableData = new FormData()
    // tableData.append('advpay_date_range', values.advpay_date_range)

    console.log(dateRangePickerStartDate, 'start date')
    console.log(dateRangePickerEndDate, 'end date')

    tableData.append('advpay_from_date_range', dateRangePickerStartDate)
    tableData.append('advpay_to_date_range', dateRangePickerEndDate)

    // tableData.append('startDate', values.startDate)
    // tableData.append('endDate', values.endDate)
    tableData.append('vehicle_number', reportVehicle)
    tableData.append('trip_sheet_no', values.trip_sheet_no)
// console.log(values.trip_sheet_no)
// console.log(values.vehicle_number)

    ReportService.Advancereport(tableData).then((res) => {
      setFetch(true)
      tableData1 = res.data.data

      let rowDataList = []
      setSearchFilterData(tableData1)
      //console.log(res.data.data)
      viewData = res.data.data
      tableData1.map((data, index) => {
        // console.log(data.vehicle_number)
        // setVehicle_numbers(data.vehicle_number)
        rowDataList.push({
          sno: index + 1,
          Vehicle_Type: data.parking_info?.vehicle_type_id?.type,
          vehicle_number: data.parking_info?.vehicle_number,
          trip_sheet_no: data.parking_info?.trip_sheet_info?.trip_sheet_no,
          tripsheet_created: data.parking_info?.trip_sheet_info?.created_date,
          driver_name: data.parking_info?.driver_name,
          pan_card_number: data.parking_info?.vendor_info?.pan_card_number || '-',
          owner_name: data.parking_info?.vendor_info?.owner_name || '-',
          vendor_code: data.parking_info?.vendor_info?.vendor_code || data.parking_info?.driver_info?.driver_code,
          sap_invoice_posting_date: formatDate(data.sap_invoice_posting_date),
          sap_freight_payment_document_no:data.sap_freight_payment_document_no,
          actual_freight: data.actual_freight,
          advance_form: ( data.document_no > 0 ?
            // <CNavLink style={{'color':'blue'}} href={`${data.advance_form}`} target={'_blank'}>
            //   <b><u>{'advance_photo'}</u></b>
            // </CNavLink > : '-'
            <CustomSpanButton3
              handleViewDocuments={handleViewDocuments}
              Id={data.id}
              documentType={'ADVANCE_FORM_PHOTO'}
            /> :'-'
          ),

          document_no:  data.document_no,
          advance_payment: data.advance_payment,
          sap_diesel_payment_document_no:data.sap_diesel_payment_document_no,
          advance_payment_diesel: data.advance_payment_diesel,
          remarks:data.remarks || '-',
          bank_remarks:data.bank_remarks || '-',
          freight_remarks:data.freight_remarks || '-', 
          supplier_ref_no:data.supplier_ref_no || '-',
          supplier_posting_date	:data.supplier_posting_date	 || '-',
          low_tonnage_charges	:data.low_tonnage_charges	 || '-',
          vendor_outstanding: data.vendor_outstanding,
          bank_date: data.bank_date == null ? '-' :formatDate(data.bank_date),
          additional_advance_sap_invoice_posting_date: data.additional_advance_sap_invoice_posting_date == null ? '-' :formatDate(data.additional_advance_sap_invoice_posting_date),
          additional_advance_payment: data.additional_advance_payment || '-',
          additional_advance_form: ( data.additional_advance_document_no > 0  ?
            // <CNavLink style={{'color':'blue'}} href={`${data.additional_advance_form}`} target={'_blank'}>
            //   <b><u>{'additional_advance_photo'}</u></b>
            // </CNavLink > : '-'
            <CustomSpanButton3
              handleViewDocuments={handleViewDocuments}
              Id={data.id}
              documentType={'ADD_ADVANCE_FORM_PHOTO'}
            /> :'-'
          ),
          additional_advance_document_no: data.additional_advance_document_no || '-',
          additional_advance_remarks: data.additional_advance_remarks || '-',
          created_at: data.updated_at,
          to_divison: data.to_divison == '1' ? 'NLFD':'NLCD',
          purpose:data.purpose == '1' ? 'FG Sale':data.purpose == '2' ? 'FG STO' : '',
          sap_bank_payment_document_no:data.sap_bank_payment_document_no,
          username:data.user_info?.emp_name,
          additional_payment_mode:data.additional_advance_document_no > 0 && data.additional_payment_mode == 0 ? 'Cash' : data.additional_payment_mode == 1 ? 'Cash' : data.additional_payment_mode == 2 ? 'Bank' : '-',
          initial_payment_mode: data.document_no > 0 && data.initial_payment_mode == 0 ? 'Cash' : data.initial_payment_mode == 2 ? 'Bank' : data.initial_payment_mode == 1 ? 'Cash':'-',

          // Action: (
          //   <CButton
          //   onClick={() => {
          //     setVisible(!visible)
          //     setCurrentDeliveryId(data.DeliveryOrderNumber)
          //   }}
          //   className="text-white"
          //   color="warning"
          //   size="sm"
          // >
          //   <span className="float-start">
          //     <i className="fa fa-eye" aria-hidden="true"></i> &nbsp;View
          //   </span>
          // </CButton>
          // ),
        })
      })
      setRowData(rowDataList)
    })
  }
  useEffect(() => {
    loadVehicleReadyToTrip()
  }, [])




function getCurrentDate(separator = '') {
  let newDate = new Date()
  let date = newDate.getDate()
  let month = newDate.getMonth() + 1
  let year = newDate.getFullYear()

  return `${year}${separator}${month < 10 ? `0${month}` : `${month}`}${separator}${date < 10 ? `0${date}` : `${date}`}`
}
// console.log(getCurrentDate('-'));



const exportToCSV = () => {
  let fileName='Advance'
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
      name: 'Vendor Name',
      selector: (row) => row.owner_name,
      sortable: true,
      center: true,
    },
    {
      name: 'Vendor PAN Number',
      selector: (row) => row.pan_card_number,
      sortable: true,
      center: true,
    },
    {
      name: 'Vendor Code',
      selector: (row) => row.vendor_code || row.driver_code,
      sortable: true,
      center: true,
    },
    {
      name: 'Vendor Outstanding',
      selector: (row) => row.vendor_outstanding,
      sortable: true,
      center: true,
    },
    {
      name: 'SAP Posting Date',
      selector: (row) => row.sap_invoice_posting_date,
      sortable: true,
      center: true,
    },
    {
      name: 'SAP Hire Freight Doc.No',
      selector: (row) => row.sap_freight_payment_document_no || '-',
      sortable: true,
      center: true,
    },
    {
      name: 'Total Freight',
      selector: (row) => row.actual_freight || '-',
      sortable: true,
      center: true,
    },
    {
      name: 'SAP Own Doc.No',
      selector: (row) => row.document_no || '0',
      sortable: true,
      center: true,
    },
    {
      name: 'SAP Bank Posting Date',
      selector: (row) => row.bank_date || '-',
      sortable: true,
      center: true,
    },
    {
      name: 'SAP Hire Bank Doc.No',
      selector: (row) => row.sap_bank_payment_document_no || '-',
      sortable: true,
      center: true,
    },
    {
      name: 'Advance Payment',
      selector: (row) => row.advance_payment || '-',
      sortable: true,
      center: true,
    },
    {
      name: 'SAP Hire Diesel Doc.No',
      selector: (row) => row.sap_diesel_payment_document_no || '-',
      sortable: true,
      center: true,
    },
    {
      name: 'Diesel Payment',
      selector: (row) => row.advance_payment_diesel || '-',
      sortable: true,
      center: true,
    },

    {
      name: 'Advance Form',
      selector: (row) => row.advance_form || '-',
      sortable: true,
      center: true,
    },
    {
      name: 'Payment Type',
      selector: (row) => row.initial_payment_mode,
      sortable: true,
      center: true,
    },
    {
      name: 'Remarks',
      selector: (row) => row.remarks,
      sortable: true,
      center: true,
    },
    {
      name: 'Bank Remarks',
      selector: (row) => row.bank_remarks,
      sortable: true,
      center: true,
    },
    {
      name: 'Additional SAP Posting Date',
      selector: (row) => row.additional_advance_sap_invoice_posting_date,
      sortable: true,
      center: true,
    },

    {
      name: 'SAP Additional Advance Doc.No',
      selector: (row) => row.additional_advance_document_no,
      sortable: true,
      center: true,
    },


    {
      name: 'Additional Advance Form',
      selector: (row) => row.additional_advance_form,
      sortable: true,
      center: true,
    },

    {
      name: 'Additional Advance Payment',
      selector: (row) => row.additional_advance_payment,
      sortable: true,
      center: true,
    },
    {
      name: 'Additional Payment Type',
      selector: (row) => row.additional_payment_mode,
      sortable: true,
      center: true,
    },
    {
      name: 'Additional Advance Remarks',
      selector: (row) => row.additional_advance_remarks,
      sortable: true,
      center: true,
    },
    {
      name: 'Created_by',
      selector: (row) => row.username,
      sortable: true,
      center: true,
    },
    {
      name: 'Created_at',
      selector: (row) => row.created_at,
      sortable: true,
      center: true,
    },
    // {
    //   name: 'Action',
    //   selector: (row) => row.Action,
    //   center: true,
    // }
  ]
  // const [value, onChange] = useState([new Date(), new Date()]);

    const formValues = {
      startDate: '',
      endDate: '',
      vehicle_number:'',
      trip_sheet_no:''
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
            <CRow className="mt-1 mb-1">
          {/* <CCol xs={12} md={2}> */}
          {/* <DateRangePicker locale="en-SE" onChange={onChange} startDate={values.startDate} endDate={values.endDate} value= {value}></DateRangePicker> */}
              {/* <CFormInput size="sm"  type="date"  name="startDate" value={start}  />
              <CFormInput size="sm" type='date' name="endDate" value={end}  /> */}
              {/* <CFormInput
                        type="date"
                        size="sm-lg"
                        required
                        value={values.startDate}
                        onBlur={onBlur}
                        onFocus={onFocus}
                        onChange={handleChange}
                        id="startDate"
                        name="startDate"
                        placeholder="date"
                      />
              </CCol> */}
              {/* <CCol xs={12} md={2}>
                <CFormInput
                        type="date"
                        size="sm-lg"
                        required
                        value={values.endDate}
                        onBlur={onBlur}
                        onFocus={onFocus}
                        onChange={handleChange}
                        id="endDate"
                        name="endDate"
                        placeholder="date"
                      />
              </CCol> */}
              <CCol xs={12} md={3}>
                    <CFormLabel htmlFor="VNum">Date Filter</CFormLabel>
                    <DateRangePicker
                      style={{ width: '100rem', height: '100%', borderColor: 'black' }}
                      id="advpay_date_range"
                      name="advpay_date_range"
                      format="dd-MM-yyyy"
                      value={value}
                      onChange={setValue}
                      // onChange={getAdvanceDateRange(e)}
                    />
                  </CCol>
                  <CCol xs={12} md={3}>
                    <CFormLabel htmlFor="VNum">Vehicle Number</CFormLabel>
                    <AdvanceVehicleSelectCompont
                      size="sm-lg"
                      className="mb-2"
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
                  {/* <CCol xs={12} md={2}>

            <AdvanceVehicleSelectCompont
                   size="sm-lg"
                   className="mb-2"
                   onChange={(e) => {
                    onChange1(e)
                   }}
                   label="trip_sheet_no"
                   id="trip_sheet_no"
                   name="trip_sheet_no"
                   value={values.trip_sheet_no}
                   search_type="trip_sheet_no"
                  />

          </CCol> */}
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
                        setFetch(false)
                      }}
                >
                  Filter
                </CButton>
              </CCol>
              <hr style={{ height: '2px', marginTop: '0.5px' }}></hr>
            </CRow>
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
                  }
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
          <CModal
            size="xl"
            visible={visible}
            backdrop="static"
            scrollable
            onClose={() => setVisible(false)}
          >
            <CModalHeader>
              <CModalTitle>Advance Payment Vouchar</CModalTitle>
            </CModalHeader>

                <CModalBody>
                  {/* <AdvancePrint
                  all_delivery_data={rowData}
                  delivery_id={currentDeliveryId}
                /> */}
                </CModalBody>
                <CModalFooter>
                  <CButton color="secondary" onClick={() => setVisible(false)}>
                    Close
                  </CButton>
                </CModalFooter>
              </CModal>

         {/* Model for Advance Photo  */}
         <CModal visible={AdvancePhoto} onClose={() => setAdvancePhoto(false)} >
              <CModalHeader>
                <CModalTitle>Advance Photo</CModalTitle>
              </CModalHeader>
              <CModalBody>
                <CCardImage height ="500" orientation="top" src={AdvancePhotoSrc} />
              </CModalBody>
              <CModalFooter>
                <CButton color="secondary" onClick={() => setAdvancePhoto(false)}>
                  Close
                </CButton>
              </CModalFooter>
            </CModal>
            <CModal visible={AddAdvancePhoto} onClose={() => setAddAdvancePhoto(false)} >
              <CModalHeader>
                <CModalTitle>Additional Advance Photo</CModalTitle>
              </CModalHeader>
              <CModalBody>
                <CCardImage height ="500" orientation="top" src={AddAdvancePhotoSrc} />
              </CModalBody>
              <CModalFooter>
                <CButton color="secondary" onClick={() => setAddAdvancePhoto(false)}>
                  Close
                </CButton>
              </CModalFooter>
            </CModal>

            {/* Model for Advance Photo  */}
            </CCard>
          </>
	      ) : (<AccessDeniedComponent />)}
   	   </>
      )}
    </>
  )
}

export default AdvancePayment
