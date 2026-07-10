import React, { useState, useEffect, useRef } from 'react'
import {
  CButton,
  CCard,
  CContainer,
  CCol,
  CRow,
  CFormLabel,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CCardImage,
  CBadge,
  CFormSelect,
} from '@coreui/react'
import { DateRangePicker } from 'rsuite'
import CustomTable from 'src/components/customComponent/CustomTable'
import Loader from 'src/components/Loader'
import { toast } from 'react-toastify'
import * as XLSX from 'xlsx'
import FileSaver from 'file-saver'
import AccessDeniedComponent from 'src/components/commoncomponent/AccessDeniedComponent'
import JavascriptInArrayComponent from 'src/components/commoncomponent/JavascriptInArrayComponent'
import * as NlmtScreenAccessCodes from 'src/components/constants/NlmtScreenAccessCodes'
import NlmtReportService from 'src/Service/Nlmt/Report/NlmtReportService'
import NlmtAdvanceVehicleSelectCompont from 'src/Pages/Nlmt/AdvanceRequestCreation/segments/VehicleListComponent/NlmtAdvanceVehicleList'
import CustomSpanButton3 from 'src/components/customComponent/CustomSpanButton3'
import { GetDateTimeFormat } from 'src/Pages/Nlmt/CommonMethods/CommonMethods'

function getCurrentDate(separator = '') {
  const d = new Date()
  const date = d.getDate()
  const month = d.getMonth() + 1
  const year = d.getFullYear()
  return `${year}${separator}${month < 10 ? `0${month}` : `${month}`}${separator}${
    date < 10 ? `0${date}` : `${date}`
  }`
}

function formatDate(dateStr) {
  if (!dateStr) return '-'
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return dateStr
  const day = ('0' + d.getDate()).slice(-2)
  const month = ('0' + (d.getMonth() + 1)).slice(-2)
  const year = d.getFullYear()
  return `${day}-${month}-${year}`
}

function formatDateTime(dateStr) {
  if (!dateStr) return '-'
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return dateStr
  const day = ('0' + d.getDate()).slice(-2)
  const month = ('0' + (d.getMonth() + 1)).slice(-2)
  const year = d.getFullYear()
  const hours = ('0' + d.getHours()).slice(-2)
  const minutes = ('0' + d.getMinutes()).slice(-2)
  const seconds = ('0' + d.getSeconds()).slice(-2)
  return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`
}

function convert(str) {
  if (!str) return ''
  const date = new Date(str)
  const mnth = ('0' + (date.getMonth() + 1)).slice(-2)
  const day = ('0' + date.getDate()).slice(-2)
  return [date.getFullYear(), mnth, day].join('-')
}

const getDateTime = (myDateTime, type = 0) => {
  let myTime = '-'
  if (myDateTime) {
    if (type == 1) {
      myTime = new Date(myDateTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    } else if (type == 2) {
      myTime = new Date(myDateTime).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    } else {
      myTime = new Date(myDateTime).toLocaleString('en-US')
    }
  }
  return myTime
}

const getVehicleTypeLabel = (vehicleTypeId) => {
  switch (Number(vehicleTypeId)) {
    case 21: return 'Own'
    case 22: return 'Hire'
    case 23: return 'Party'
    default: return '-'
  }
}

const NlmtDieselIntentReport = () => {
  /* ---- User Info ---- */
  const user_info_json = localStorage.getItem('user_info')
  const user_info = JSON.parse(user_info_json)

  /* ---- Screen Access ---- */
  const [screenAccess, setScreenAccess] = useState(false)
  const page_no = NlmtScreenAccessCodes.NlmtReportScreens.Nlmt_Diesel_Intent_Report 

  useEffect(() => {
    // We assume if it's not defined, admin has access. Adjust if page_no is known.
    if (user_info.is_admin == 1 || JavascriptInArrayComponent(page_no, user_info.page_permissions)) {
      setScreenAccess(true)
    } else {
      setScreenAccess(false)
    }
  }, [])

  /* ---- Date Range ---- */
  const [dateRange, setDateRange] = useState([
    new Date(getCurrentDate('-')),
    new Date(getCurrentDate('-')),
  ])
  const [fromDate, setFromDate] = useState(getCurrentDate('-'))
  const [toDate, setToDate] = useState(getCurrentDate('-'))

  useEffect(() => {
    if (dateRange && dateRange.length === 2) {
      setFromDate(convert(dateRange[0]))
      setToDate(convert(dateRange[1]))
    } else {
      setFromDate('')
      setToDate('')
    }
  }, [dateRange])

  /* ---- Filters ---- */
  const [reportVehicle, setReportVehicle] = useState('')
  const [reportTripSheet, setReportTripSheet] = useState('')
  const [reportDieselStatus, setReportDieselStatus] = useState('')
  const [searchFilterData, setSearchFilterData] = useState([])

  /* ---- Table ---- */
  const [rowData, setRowData] = useState([])
  const [fetch, setFetch] = useState(false)

  /* ---- Photo Modals ---- */
  const [bunkReadingVisible, setBunkReadingVisible] = useState(false)
  const [bunkReadingSrc, setBunkReadingSrc] = useState('')
  const [invoicePhotoVisible, setInvoicePhotoVisible] = useState(false)
  const [invoicePhotoSrc, setInvoicePhotoSrc] = useState('')

  const rawApiDataRef = useRef([])

  /* ---- View Photo Handler ---- */
  const handleViewDocuments = (e, id, type) => {
    const record = rawApiDataRef.current.find((d) => d.id === id)
    if (!record) return
    if (type === 'BUNK_READING_PHOTO') {
      setBunkReadingSrc(record.bunk_reading || '')
      setBunkReadingVisible(true)
    } else if (type === 'INVOICE_COPY_PHOTO') {
      setInvoicePhotoSrc(record.invoice_copy || '')
      setInvoicePhotoVisible(true)
    }
  }

  /* ---- Filter Change ---- */
  const onChangeFilter = (event, type) => {
    if (type === 'vehicle_number') {
      setReportVehicle(event?.value || '')
    } else if (type === 'trip_sheet_no') {
      setReportTripSheet(event?.value || '')
    } else if (type === 'diesel_status') {
      setReportDieselStatus(event.target.value || '')
    }
  }

  /* ---- Load Report ---- */
  const loadReport = () => {
    if (!fromDate || !toDate) {
      toast.warning('Please select a date range!')
      return
    }
    setFetch(false)

    const formData = new FormData()
    formData.append('diesel_from_date_range', fromDate)
    formData.append('diesel_to_date_range', toDate)
    formData.append('vehicle_number', reportVehicle || '')
    formData.append('trip_sheet_no', reportTripSheet || '')
    formData.append('diesel_status', reportDieselStatus || '')

    NlmtReportService.DieselReport(formData)
      .then((res) => {
        const rawApiData = res.data.data || []
        rawApiDataRef.current = rawApiData
        setSearchFilterData(rawApiData)

        const list = []
        rawApiData.forEach((data, index) => {
          const vehicleTypeId = data.NlmtVehicleInfo?.vehicle_type_id
          const isOwn = vehicleTypeId == 21
          const isHire = vehicleTypeId == 22

          const driverName = isOwn
            ? (data.NlmtDriverInfo?.driver_name || '-')
            : isHire
            ? (data.parking_info?.driver_name || '-')
            : '-'
            
          let dieselStatusText = 'Unknown'
          if (data.diesel_status == 1) dieselStatusText = 'DI Created'
          else if (data.diesel_status == 2) dieselStatusText = 'DI Confirmed'
          else if (data.diesel_status == 3) dieselStatusText = 'DI Approval'

          list.push({
            id: data.id,
            sno: index + 1,
            Vehicle_Type: getVehicleTypeLabel(vehicleTypeId),
            vehicle_number: data.NlmtVehicleInfo?.vehicle_number || '-',
            trip_sheet_no: data.NlmtTripsheetInfo?.nlmt_tripsheet_no || data.NlmtTripsheetInfo?.trip_sheet_no || '-',
            tripsheet_created: formatDate(data.NlmtTripsheetInfo?.created_date || data.NlmtTripsheetInfo?.created_at),
            driver_name: driverName,
            vendor_name: data.di_vendor_info?.diesel_vendor_name || '-',
            vendor_code: data.vendor_code || '-',
            vendor_tds: data.vendor_tds || '-',
            vendor_hsn: data.vendor_hsn || '-',
            bunk_reading: data.bunk_reading && data.bunk_reading.indexOf('null') === -1 && data.bunk_reading !== '' ? (
              <CustomSpanButton3
                handleViewDocuments={handleViewDocuments}
                Id={data.id}
                documentType={'BUNK_READING_PHOTO'}
              />
            ) : '-',
            invoice_copy: data.invoice_copy && data.invoice_copy.indexOf('null') === -1 && data.invoice_copy !== '' ? (
              <CustomSpanButton3
                handleViewDocuments={handleViewDocuments}
                Id={data.id}
                documentType={'INVOICE_COPY_PHOTO'}
              />
            ) : '-',
            invoice_no: data.invoice_no || '-',
            rate_of_ltrs: data.rate_of_ltrs || '-',
            no_of_ltrs: data.no_of_ltrs || '-',
            total_amount: data.total_amount || '-',
            diesel_type: data.diesel_type == 0 ? 'Home Diesel' : 'Additional Diesel',
            diesel_vendor_sap_invoice_no: data.diesel_vendor_sap_invoice_no || '-',
            diesel_status: dieselStatusText,
            
            created_by: data.user_info?.emp_name || '-',
            di_creation_date: formatDateTime(data.di_creation_time),
            di_creation_time: getDateTime(data.di_creation_time, 1),
            di_creation_month: getDateTime(data.di_creation_time, 2),
            di_creation_remarks: data.remarks || '-',
            
            di_confirmation_date: formatDateTime(data.confirmed_at),
            di_confirmation_time: getDateTime(data.confirmed_at, 1),
            di_confirmation_month: getDateTime(data.confirmed_at, 2),
            di_confirmation_remarks: data.confirmation_remarks || '-',
            confirmed_by: data.confirmed_by_user?.emp_name || '-',
            
            di_approval_date: formatDateTime(data.approved_at),
            di_approval_time: getDateTime(data.approved_at, 1),
            di_approval_month: getDateTime(data.approved_at, 2),
            di_approval_remarks: data.approval_remarks || '-',
          })
        })
        setRowData(list)
        setFetch(true)
      })
      .catch((err) => {
        console.error('NLMT Diesel Report Error:', err)
        toast.error('Failed to load diesel intent report. Please try again.')
        setFetch(true)
      })
  }

  useEffect(() => {
    loadReport()
  }, [])

  /* ---- Export to Excel ---- */
  const exportToCSV = () => {
    if (!rowData || rowData.length === 0) {
      toast.warning('No data to export!')
      return
    }
    const exportData = rowData.map((row) => ({
      'S.No': row.sno,
      // 'Vehicle Type': row.Vehicle_Type,
      'Vehicle No': row.vehicle_number,
      'Tripsheet Number': row.trip_sheet_no,
      'Tripsheet Date': row.tripsheet_created,
      'Driver Name': row.driver_name,
      'Vendor Name': row.vendor_name,
      'Vendor Code': row.vendor_code,
      // 'TDS Type': row.vendor_tds,
      // 'HSN Code': row.vendor_hsn,
      'Invoice No': row.invoice_no,
      'Rate of Ltrs': row.rate_of_ltrs,
      'No. of Ltrs': row.no_of_ltrs,
      'Total Amount': row.total_amount,
      // 'SAP Invoice No': row.diesel_vendor_sap_invoice_no,
      // 'Diesel Type': row.diesel_type,
      'Diesel Status': row.diesel_status,
      // 'Bunk Reading Photo': typeof row.bunk_reading === 'object' ? 'Available' : '-',
      // 'Invoice Copy Photo': typeof row.invoice_copy === 'object' ? 'Available' : '-',
      'Created By': row.created_by,
      'Creation Date': row.di_creation_date,
      'Creation Remarks': row.di_creation_remarks,
      'Confirmed By': row.confirmed_by,
      'Confirmed Date': row.di_confirmation_date,
      'Confirmation Remarks': row.di_confirmation_remarks,
   
    }))

    const dateTimeString = GetDateTimeFormat(1)
    const fileName = 'NLMT_Diesel_Intent_Report_' + dateTimeString
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
    const ws = XLSX.utils.json_to_sheet(exportData)
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] }
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
    const blob = new Blob([excelBuffer], { type: fileType })
    FileSaver.saveAs(blob, fileName + '.xlsx')
  }

  /* ---- Columns ---- */
  const columns = [
    { name: 'S.No', selector: (r) => r.sno, sortable: true, center: true, width: '65px' },
    { name: 'Veh No', selector: (r) => r.vehicle_number, sortable: true, center: true },
    { name: 'Tripsheet', selector: (r) => r.trip_sheet_no, sortable: true, center: true },
    { name: 'TS Date', selector: (r) => r.tripsheet_created, sortable: true, center: true },
    { name: 'Driver', selector: (r) => r.driver_name, sortable: true, center: true },
    { name: 'Vendor Name', selector: (r) => r.vendor_name, sortable: true, center: true },
    { name: 'Vendor Code', selector: (r) => r.vendor_code, sortable: true, center: true },
    // { name: 'TDS Type', selector: (r) => r.vendor_tds, sortable: true, center: true },
    // { name: 'HSN Code', selector: (r) => r.vendor_hsn, sortable: true, center: true },
    { name: 'Invoice No', selector: (r) => r.invoice_no, sortable: true, center: true },
    { name: '₹/ltr', selector: (r) => r.rate_of_ltrs, sortable: true, center: true },
    { name: 'Qty', selector: (r) => r.no_of_ltrs, sortable: true, center: true },
    { name: 'Amount', selector: (r) => r.total_amount, sortable: true, center: true },
    // { name: 'SAP Invoice No', selector: (r) => r.diesel_vendor_sap_invoice_no, sortable: true, center: true },
    { name: 'Bunk Reading', selector: (r) => r.bunk_reading, center: true },
    { name: 'Invoice Copy', selector: (r) => r.invoice_copy, center: true },
    { name: 'Status', selector: (r) => r.diesel_status, sortable: true, center: true },
    { name: 'Created By', selector: (r) => r.created_by, sortable: true, center: true },
    { name: 'Confirmed By', selector: (r) => r.confirmed_by, sortable: true, center: true },
    { name: 'Created At', selector: (r) => r.di_creation_date, sortable: true, center: true },
  ]

  return (
    <>
      {!fetch && <Loader />}
      {fetch && (
        <>
          {screenAccess ? (
            <CCard className="mt-4">
              <CContainer className="m-2">
                {/* ---- Filter Row ---- */}
                <CRow className="mt-2 mb-2 align-items-end">
                  <CCol xs={12} md={3}>
                    <CFormLabel htmlFor="nlmt_di_date"><b>Date Range</b></CFormLabel>
                    <DateRangePicker
                      id="nlmt_di_date"
                      style={{ width: '100%', borderColor: '#6c757d' }}
                      format="dd-MM-yyyy"
                      value={dateRange}
                      onChange={setDateRange}
                    />
                  </CCol>

                  <CCol xs={12} md={2}>
                    <CFormLabel htmlFor="nlmt_di_vehicle"><b>Vehicle Number</b></CFormLabel>
                    <NlmtAdvanceVehicleSelectCompont
                      size="sm"
                      className="mb-1"
                      onChange={(e) => onChangeFilter(e, 'vehicle_number')}
                      label="Select Vehicle"
                      id="vehicle_number"
                      name="vehicle_number"
                      search_type="vehicle_number"
                      search_data={searchFilterData}
                    />
                  </CCol>

                  <CCol xs={12} md={2}>
                    <CFormLabel htmlFor="nlmt_di_tripsheet"><b>TripSheet No</b></CFormLabel>
                    <NlmtAdvanceVehicleSelectCompont
                      size="sm"
                      className="mb-1"
                      onChange={(e) => onChangeFilter(e, 'trip_sheet_no')}
                      label="Select TripSheet"
                      id="trip_sheet_no"
                      name="trip_sheet_no"
                      search_type="trip_sheet_no"
                      search_data={searchFilterData}
                    />
                  </CCol>
                  
                  <CCol xs={12} md={2}>
                    <CFormLabel htmlFor="nlmt_di_status"><b>Diesel Status</b></CFormLabel>
                    <CFormSelect
                      size="sm"
                      className="mb-1"
                      onChange={(e) => onChangeFilter(e, 'diesel_status')}
                      id="diesel_status"
                      name="diesel_status"
                    >
                      <option value="">Select Status</option>
                      <option value="1">DI Creation</option>
                      <option value="2">DI Confirmed</option>
                      <option value="3">DI Approval</option>
                    </CFormSelect>
                  </CCol>

                  <CCol
                    xs={12} md={3}
                    className="d-flex justify-content-end gap-2 mt-2"
                  >
                    <CButton
                      size="sm"
                      color="primary"
                      className="px-3 text-white mb-1"
                      onClick={() => loadReport()}
                    >
                      <i className="fa fa-filter me-1"></i> Filter
                    </CButton>
                    <CButton
                      size="sm"
                      color="warning"
                      className="px-3 text-white mb-1"
                      onClick={exportToCSV}
                    >
                      <i className="fa fa-file-excel-o me-1"></i> Export
                    </CButton>
                  </CCol>
                </CRow>

                <hr style={{ margin: '6px 0 10px' }} />

                {/* ---- Data Table ---- */}
                <CustomTable
                  columns={columns}
                  data={rowData}
                  fieldName={'vehicle_number'}
                  showSearchFilter={true}
                />

              </CContainer>
            </CCard>
          ) : (
            <AccessDeniedComponent />
          )}
        </>
      )}

      {/* ---- Bunk Reading Photo Modal ---- */}
      <CModal visible={bunkReadingVisible} onClose={() => setBunkReadingVisible(false)}>
        <CModalHeader>
          <CModalTitle>Bunk Reading Photo</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CCardImage height="500" orientation="top" src={bunkReadingSrc} />
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setBunkReadingVisible(false)}>Close</CButton>
        </CModalFooter>
      </CModal>

      {/* ---- Invoice Copy Photo Modal ---- */}
      <CModal visible={invoicePhotoVisible} onClose={() => setInvoicePhotoVisible(false)}>
        <CModalHeader>
          <CModalTitle>Invoice Copy Photo</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CCardImage height="500" orientation="top" src={invoicePhotoSrc} />
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setInvoicePhotoVisible(false)}>Close</CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}

export default NlmtDieselIntentReport