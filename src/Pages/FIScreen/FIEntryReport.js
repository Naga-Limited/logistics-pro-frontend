import React, { useState, useEffect } from 'react'
import {
  CButton,
  CCard,
  CRow,
  CCol, 
  CContainer, 
  CFormLabel,
} from '@coreui/react' 
import { useNavigate } from 'react-router-dom'
import CustomTable from 'src/components/customComponent/CustomTable'
import { toast } from 'react-toastify'
import Loader from 'src/components/Loader'
import { DateRangePicker } from 'rsuite' 
import SearchSelectComponent from 'src/components/commoncomponent/searchSelectComponent'
import ReportService from 'src/Service/Report/ReportService'
import AccessDeniedComponent from 'src/components/commoncomponent/AccessDeniedComponent'
import JavascriptInArrayComponent from 'src/components/commoncomponent/JavascriptInArrayComponent'
import * as LogisticsProScreenNumberConstants from 'src/components/constants/LogisticsProScreenNumberConstants'
import * as XLSX from 'xlsx';
import FileSaver from 'file-saver'
import { GetDateTimeFormat } from '../Depo/CommonMethods/CommonMethods'

const fi_report = () => {

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
  let page_no = LogisticsProScreenNumberConstants.FIEntryModule.FI_Entry_Report

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

  const navigation = useNavigate()

  const onChangeFilter = (event, event_type) => {
    var selected_value = event.value
    console.log(selected_value, 'selected_value')

    if (event_type == 'vehicle_no') {
      if (selected_value) {
        setReportVehicle(selected_value)
      } else {
        setReportVehicle(0)
      }
    } else if (event_type == 'tripsheet_no') {
      if (selected_value) {
        setReportTSNo(selected_value)
      } else {
        setReportTSNo(0)
      }
    } else if (event_type == 'fi_type') {
      if (selected_value) {
        setreportFIType(selected_value)
      } else {
        setreportFIType(0)
      }
    } else if (event_type == 'fi_status') {
      if (selected_value) {
        setreportFIStatus(selected_value)
      } else {
        setreportFIStatus(0)
      }
    }
  }

  const [rowData, setRowData] = useState([])
  const [searchFilterData, setSearchFilterData] = useState([]) 
  const [fetch, setFetch] = useState(false)

  const [pending, setPending] = useState(true)

  /* Report Variables */
  const [reportVehicle, setReportVehicle] = useState(0)
  const [reportTSNo, setReportTSNo] = useState(0)
  const [reportTSId, setReportTSId] = useState(0)
  const [reportFIType, setreportFIType] = useState(0)
  const [reportFIStatus, setreportFIStatus] = useState(0)  
  let tableReportData = []

  const FIType = (id) => {
    if (id == 1) {
      return 'Income'
    } else if (id == 2) {
      return 'Expense'
    } else if (id == 3) {
      return 'Advance'
    } else {
      return ''
    }
  }

  const EntryType = (id) => {
    if (id == 1) {
      return 'RJ Customer'
    } else if (id == 2) {
      return 'To Pay Customer'
    } else if (id == 3) {
      return 'Foods'
    } else if (id == 4) {
      return 'Consumer'
    } else if (id == 5) {
      return 'Driver Vendor'
    } else if (id == 6) {
      return 'Freight Vendor'
    } else if (id == 7) {
      return 'Diesel Vendor'
    } else if (id == 8) {
      return 'Contract Vendor'
    } else if (id == 9) {
      return 'Fast Tag'
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

  const exportToCSV = () => {

    if(rowData.length == 0){
      toast.warning('No Data Found..!')
      return false
    }
    let dateTimeString = GetDateTimeFormat(1)
    let fileName='FI_Entry_Report'+dateTimeString
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';
    const ws = XLSX.utils.json_to_sheet(rowData);
    const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], {type: fileType}); 
    FileSaver.saveAs(data, fileName + fileExtension);
  }

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
    
    if (fresh_type !== '1') {
     
      ReportService.getFIDataForReport(user_id).then((res) => {
        tableReportData = res.data.data
        console.log(tableReportData)

        setFetch(true)
        let rowDataList = []
        let filterData = tableReportData 
        let indexNo = 0
        setSearchFilterData(filterData)
        filterData.map((data, index) => {
          data.gl_type_expense.map((data1, index2) => {
            indexNo += 1
            rowDataList.push({
            sno: indexNo,
            Tripsheet_No: data.trip_sheet_info.trip_sheet_no,
            Tripsheet_Date: data.trip_sheet_info.created_date,
            fi_entry_type: FIType(data.fi_entry_type),
            sap_fi_document_no: data.sap_fi_document_no,
            sap_fi_posting_date: formatDate(data.sap_fi_posting_date),
            Vehicle_Type: data.parking_yard_info.vehicle_type_id.type,
            Vehicle_No: data.parking_yard_info.vehicle_number,
            Driver_Name: data.driver_info?.driver_name||data.parking_yard_info.driver_name,
            Driver_Mobile_Number: data.driver_info?.driver_phone_1 || data.parking_yard_info.driver_contact_number,
            Trip_Driver_Name: data.parking_yard_info.driver_name,
            Trip_Driver_Mobile_Number: data.parking_yard_info.driver_contact_number,
            vendor_code: data.vendor_code,
            fi_mode: data.fi_mode == '1' ? 'Credit' : data.fi_mode == '2' ? 'Debit' : '-',
            tds_type: data.tds_type == '1' ? 'Yes' : data.tds_type == '2' ? 'No' : '-',
            tds_value: data.tds_type == '1' ? (data.vendor_tds ? data.vendor_tds : '-') : '-',
            hsn_type: data.vendor_hsn ? data.vendor_hsn : '-',
            gst_tax_type: data.gst_tax_type || '-',
            supplier_posting_dates: formatDate(data.supplier_posting_date) == '01-01-1970'  ?  '-' : formatDate(data.supplier_posting_date),
            supplier_ref_no: data.supplier_ref_no || '-',
            entry_to: EntryType(data.entry_to),
            freight_amount: data1.EXPENSE_AMT || data.amount,
            gl_type:data1.label || data.gl_list_info?.gl_description || '-',
            gl_code:data1.GL_CODE || data.gl_list_info?.gl_code || '-',
            diesel_vendor_name: data.diesel_vendor_info != null?data.diesel_vendor_info.diesel_vendor_name : '-',
            Remarks: data.remarks,
            fi_status: data.fi_status == '1' ? 'Created' : 'Rejected',
            Creation_Time: data.created_at,
            created_by: data.user_info?.emp_name,
          })
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
      report_form_data.append('tripsheet_no', reportTSNo)
      report_form_data.append('trip_sheet_id', reportTSId)
      report_form_data.append('fi_type', reportFIType)
      report_form_data.append('fi_status', reportFIStatus)
      report_form_data.append('user_id', user_id)

      console.log(reportVehicle)
      console.log(reportTSNo) 
      console.log(reportFIType)

      ReportService.sentFIDataForReport(report_form_data).then((res) => { 
        tableReportData = res.data.data 

        setFetch(true)
        let rowDataList = []
        let filterData = tableReportData 
        setSearchFilterData(filterData)
        let indexNo = 0
        filterData.map((data, index) => {
          data.gl_type_expense.map((data1, index2) => {
            indexNo += 1
            rowDataList.push({
            sno: indexNo,
            Tripsheet_No: data.trip_sheet_info.trip_sheet_no,
            Tripsheet_Date: data.trip_sheet_info.created_date,
            fi_entry_type: FIType(data.fi_entry_type),
            sap_fi_document_no: data.sap_fi_document_no,
            sap_fi_posting_date: formatDate(data.sap_fi_posting_date),
            Vehicle_Type: data.parking_yard_info.vehicle_type_id.type,
            Vehicle_No: data.parking_yard_info.vehicle_number,
            Driver_Name: data.driver_info?.driver_name||data.parking_yard_info.driver_name,
            Driver_Mobile_Number: data.driver_info?.driver_phone_1 || data.parking_yard_info.driver_contact_number,
            Trip_Driver_Name: data.parking_yard_info.driver_name,
            Trip_Driver_Mobile_Number: data.parking_yard_info.driver_contact_number,
            vendor_code: data.vendor_code,
            fi_mode: data.fi_mode == '1' ? 'Credit' : data.fi_mode == '2' ? 'Debit' : '-',
            tds_type: data.tds_type == '1' ? 'Yes' : data.tds_type == '2' ? 'No' : '-',
            tds_value: data.tds_type == '1' ? (data.vendor_tds ? data.vendor_tds : '-') : '-',
            hsn_type: data.vendor_hsn ? data.vendor_hsn : '-',
            gst_tax_type: data.gst_tax_type || '-',
            supplier_posting_dates: formatDate(data.supplier_posting_date) == '01-01-1970'  ?  '-' : formatDate(data.supplier_posting_date),
            supplier_ref_no: data.supplier_ref_no || '-',
            entry_to: EntryType(data.entry_to),
            freight_amount: data1.EXPENSE_AMT || data.amount,
            gl_type:data1.label || data.gl_list_info?.gl_description || '-',
            gl_code:data1.GL_CODE || data.gl_list_info?.gl_code || '-',
            diesel_vendor_name: data.diesel_vendor_info != null?data.diesel_vendor_info.diesel_vendor_name : '-',
            Remarks: data.remarks,
            fi_status: data.fi_status == '1' ? 'Created' : 'Rejected',
            Creation_Time: data.created_at,
            created_by: data.user_info?.emp_name,
          })
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
      name: 'Driver Mobile Number',
      selector: (row) => row.Driver_Mobile_Number,
      sortable: true,
      center: true,
    },
    {
      name: 'FI Entry Type',
      selector: (row) => row.fi_entry_type,
      sortable: true,
      center: true,
    },
    {
      name: 'FI Mode',
      selector: (row) => row.fi_mode || '-',
      sortable: true,
      center: true,
    },
    {
      name: 'Vendor/Customer Code',
      selector: (row) => row.vendor_code || '-',
      sortable: true,
      center: true,
    },
    {
      name: 'FI Document No',
      selector: (row) => row.sap_fi_document_no,
      sortable: true,
      center: true,
    },
    {
      name: 'SAP Posting Date',
      selector: (row) => row.sap_fi_posting_date,
      sortable: true,
      center: true,
    },
    {
      name: 'Entry',
      selector: (row) => row.entry_to,
      sortable: true,
      center: true,
    },
    {
      name: 'GL Type',
      selector: (row) => row.gl_type,
      sortable: true,
      center: true,
    },
    {
      name: 'GL Code',
      selector: (row) => row.gl_code,
      sortable: true,
      center: true,
    },
    {
      name: 'Amount',
      selector: (row) => row.freight_amount,
      sortable: true,
      center: true,
    },
    {
      name: 'Diesel Vendor Name',
      selector: (row) => row.diesel_vendor_name,
      sortable: true,
      center: true,
    },
    {
      name: 'GST TAX Type',
      selector: (row) => row.gst_tax_type,
      sortable: true,
      center: true,
    },
    {
      name: 'TDS',
      selector: (row) => row.tds_type,
      sortable: true,
      center: true,
    },
    {
      name: 'TDS Value',
      selector: (row) => row.tds_value,
      sortable: true,
      center: true,
    },
    {
      name: 'HSN Type',
      selector: (row) => row.hsn_type,
      sortable: true,
      center: true,
    },
    {
      name: 'Supplier Ref.No',
      selector: (row) => row.supplier_ref_no,
      sortable: true,
      center: true,
    },
    {
      name: 'Supplier Posting Date',
      selector: (row) => row.supplier_posting_dates,
      sortable: true,
      center: true,
    },

    {
      name: 'FI Status',
      selector: (row) => row.fi_status,
      sortable: true,
      center: true,
    },
    {
      name: 'Remarks',
      selector: (row) => row.Remarks,
      sortable: true,
      center: true,
    },
    {
      name: 'Created By',
      selector: (row) => row.created_by,
      sortable: true,
      center: true,
    },
    {
      name: 'Creation Date',
      selector: (row) => row.Creation_Time,
      sortable: true,
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
                      search_type="sto_report_vehicle_number"
                      search_data={searchFilterData}
                    />
                  </CCol>

                  {/* <CCol xs={12} md={3}>
                    <CFormLabel htmlFor="VNum">Delivery Number</CFormLabel>
                    <SearchSelectComponent
                      size="sm"
                      className="mb-2"
                      onChange={(e) => {
                        onChangeFilter(e, 'shipment_no')
                      }}
                      label="Select Shipment Number"
                      noOptionsMessage="Shipment Not found"
                      search_type="shipment_report_shipment_number"
                      search_data={searchFilterData}
                    />
                  </CCol> */}

                  <CCol xs={12} md={3}>
                    <CFormLabel htmlFor="VNum">Tripsheet Number</CFormLabel>
                    <SearchSelectComponent
                      size="sm"
                      className="mb-2"
                      onChange={(e) => {
                        onChangeFilter(e, 'tripsheet_no')
                      }}
                      label="Select Tripsheet Number"
                      noOptionsMessage="Tripsheet Not found"
                      search_type="sto_report_tripsheet_number"
                      search_data={searchFilterData}
                    />
                  </CCol>

                  <CCol xs={12} md={3}>
                    <CFormLabel htmlFor="VNum">FI Entry Type</CFormLabel>
                    <SearchSelectComponent
                      size="sm"
                      className="mb-2"
                      onChange={(e) => {
                        onChangeFilter(e, 'fi_type')
                      }}
                      label="Select FI Type"
                      noOptionsMessage="Type Not found"
                      search_type="fi_type"
                      search_data={searchFilterData}
                    />
                  </CCol>

                  <CCol xs={12} md={3}>
                    <CFormLabel htmlFor="VNum">FI Status</CFormLabel>
                    <SearchSelectComponent
                      size="sm"
                      className="mb-2"
                      onChange={(e) => {
                        onChangeFilter(e, 'fi_status')
                      }}
                      label="Select FI Status"
                      noOptionsMessage="Type Not found"
                      search_type="fi_status"
                      search_data={searchFilterData}
                    />
                  </CCol>

                </CRow>
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

export default fi_report
