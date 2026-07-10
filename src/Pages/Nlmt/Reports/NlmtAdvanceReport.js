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

/* ================================================================
   NLMT Advance Payment Report
   - Lists ALL posted advance payments (Own + Hire vehicles)
   - Fetches from /Nlmtadvance_register  (POST with date range)
   - Data path: data.parking_info.vehicle_info / driver_info /
                tripsheet_info / vendor_info
   ================================================================ */

function getCurrentDate(separator = '') {
  const d = new Date()
  const date = d.getDate()
  const month = d.getMonth() + 1
  const year = d.getFullYear()
  return `${year}${separator}${month < 10 ? `0${month}` : `${month}`}${separator}${date < 10 ? `0${date}` : `${date}`
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

function convert(str) {
  const date = new Date(str)
  const mnth = ('0' + (date.getMonth() + 1)).slice(-2)
  const day = ('0' + date.getDate()).slice(-2)
  return [date.getFullYear(), mnth, day].join('-')
}

const getVehicleTypeLabel = (vehicleTypeId) => {
  switch (Number(vehicleTypeId)) {
    case 21: return 'Own'
    case 22: return 'Hire'
    case 23: return 'Party'
    default: return '-'
  }
}

const getPaymentModeLabel = (mode, docNo) => {
  if (docNo > 0 || docNo) {
    if (mode == 0 || mode == 1) return 'Cash'
    if (mode == 2) return 'Bank'
  }
  return '-'
}

const getAdvanceStatusLabel = (status) => {
  switch (Number(status)) {
    case 1: return { text: 'Own Advance', color: 'primary', textColor: 'text-white' }
    case 2: return { text: 'Hire Advance', color: 'warning', textColor: 'text-white' }
    case 3: return { text: 'Additional', color: 'info', textColor: 'text-dark' }
    default: return { text: 'Posted', color: 'success', textColor: 'text-white' }
  }
}

const getApprovalStatusLabel = (status) => {
  switch (String(status)) {
    case '3': return { text: 'Approved', color: 'success', textColor: 'text-white' }
    case '2': return { text: 'Rejected', color: 'danger', textColor: 'text-white' }
    default: return { text: 'Advance Request', color: 'warning', textColor: 'text-dark' }
  }
}

/* ---------------------------------------------------------------- */

const NlmtAdvanceReport = () => {
  /* ---- User Info ---- */
  const user_info_json = localStorage.getItem('user_info')
  const user_info = JSON.parse(user_info_json)

  /* ---- Screen Access ---- */
  const [screenAccess, setScreenAccess] = useState(false)
  const page_no = NlmtScreenAccessCodes.NlmtReportScreens.Nlmt_Advance_Payment_Report

  useEffect(() => {
    if (user_info.is_admin == 1 || JavascriptInArrayComponent(page_no, user_info.page_permissions)) {
      setScreenAccess(true)
    } else {
      setScreenAccess(false)
    }
  }, [])

  /* ---- Date Range ---- */
  const getThirtyDaysAgo = () => {
    const d = new Date()
    d.setDate(d.getDate() - 30)
    const year = d.getFullYear()
    const month = ('0' + (d.getMonth() + 1)).slice(-2)
    const day = ('0' + d.getDate()).slice(-2)
    return `${year}-${month}-${day}`
  }

  const [dateRange, setDateRange] = useState([
    new Date(getThirtyDaysAgo()),
    new Date(getCurrentDate('-')),
  ])
  const [fromDate, setFromDate] = useState(getThirtyDaysAgo())
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
  const [reportVehicle, setReportVehicle] = useState(0)
  const [reportTripSheet, setReportTripSheet] = useState('')
  const [reportVehicleType, setReportVehicleType] = useState('')
  const [searchFilterData, setSearchFilterData] = useState([])  // raw API data for vehicle dropdown

  /* ---- Table ---- */
  const [rowData, setRowData] = useState([])
  const [fetch, setFetch] = useState(false)

  /* ---- Photo Modals ---- */
  const [advancePhotoVisible, setAdvancePhotoVisible] = useState(false)
  const [advancePhotoSrc, setAdvancePhotoSrc] = useState('')
  const [addAdvancePhotoVisible, setAddAdvancePhotoVisible] = useState(false)
  const [addAdvancePhotoSrc, setAddAdvancePhotoSrc] = useState('')

  /* raw data reference for photo modals - useRef persists across renders */
  const rawApiDataRef = useRef([])

  /* ---- View Photo Handler ---- */
  const handleViewDocuments = (e, id, type) => {
    const record = rawApiDataRef.current.find((d) => d.id === id)
    if (!record) return
    if (type === 'ADVANCE_FORM_PHOTO') {
      setAdvancePhotoSrc(record.advance_form || '')
      setAdvancePhotoVisible(true)
    } else if (type === 'ADD_ADVANCE_FORM_PHOTO') {
      setAddAdvancePhotoSrc(record.additional_advance_form || '')
      setAddAdvancePhotoVisible(true)
    }
  }

  /* ---- Filter Change ---- */
  const onChangeFilter = (event, type) => {
    if (type === 'vehicle_number') {
      setReportVehicle(event?.value || 0)
    } else if (type === 'trip_sheet_no') {
      setReportTripSheet(event?.value || '')
    } else if (type === 'vehicle_type') {
      setReportVehicleType(event.target.value || '')
      setReportVehicle(0)
      setReportTripSheet('')
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
    formData.append('advpay_from_date_range', fromDate)
    formData.append('advpay_to_date_range', toDate)
    formData.append('vehicle_number', reportVehicle || '')
    formData.append('trip_sheet_no', reportTripSheet || '')
    formData.append('vehicle_type', reportVehicleType || '')

    NlmtReportService.Advancereport(formData)
      .then((res) => {
        const rawApiData = res.data.data || []
        rawApiDataRef.current = rawApiData
        setSearchFilterData(rawApiData)

        const list = []
        rawApiData.forEach((data, index) => {
          const vehicleTypeId = data.parking_info?.vehicle_info?.vehicle_type_id
          const isOwn = vehicleTypeId == 21
          const isHire = vehicleTypeId == 22

          /* Driver name: Own => driver master, Hire => trip-in driver_name field */
          const driverName = isOwn
            ? (data.parking_info?.driver_info?.driver_name || '-')
            : isHire
              ? (data.parking_info?.driver_name || '-')
              : '-'

          list.push({
            id: data.id,
            sno: index + 1,
            Vehicle_Type: getVehicleTypeLabel(vehicleTypeId),
            Advance_Status: getAdvanceStatusLabel(data.advance_status),
            vehicle_number: data.parking_info?.vehicle_info?.vehicle_number || '-',
            trip_sheet_no: data.parking_info?.tripsheet_info?.nlmt_tripsheet_no || '-',
            tripsheet_created: formatDate(data.parking_info?.tripsheet_info?.created_date),
            driver_name: driverName,
            driver_code: data.driver_code || '-',
            owner_name: data.parking_info?.vendor_info?.owner_name || '-',
            pan_card_number: data.parking_info?.vendor_info?.pan_card_number || '-',
            vendor_code: data.parking_info?.vendor_info?.vendor_code || data.driver_code || '-',
            vendor_outstanding: data.vendor_outstanding || '-',
            gst_tax_type: data.gst_tax_type || '-',
            tds_type: data.tds_type || '-',
            vendor_tds: data.vendor_tds || '-',
            vendor_hsn: data.vendor_hsn || '-',

            /* SAP Own advance */
            document_no: data.document_no || '-',
            initial_payment_mode: getPaymentModeLabel(data.initial_payment_mode, data.document_no),

            /* SAP Invoice/Freight */
            sap_invoice_posting_date: formatDate(data.sap_invoice_posting_date),
            sap_freight_payment_document_no: data.sap_freight_payment_document_no || '-',
            sap_freight_payment_amount: data.sap_freight_payment_amount || '-',
            actual_freight: data.actual_freight || '-',

            /* SAP Bank */
            bank_date: formatDate(data.bank_date),
            sap_bank_payment_document_no: data.sap_bank_payment_document_no || '-',
            sap_bank_payment_amount: data.sap_bank_payment_amount || '-',

            /* Advance amounts */
            advance_payment: data.advance_payment || '-',

            /* Advance form photo button */
            advance_form: data.advance_form ? (
              <a style={{color:'black'}} target='_blank' rel="noreferrer" href={data.advance_form}>
                <i className="fa fa-eye" aria-hidden="true"></i>
              </a>
            ) : <>--</>,
            // advance_form: data.advance_form
            //   ? <CustomSpanButton3
            //     handleViewDocuments={handleViewDocuments}
            //     Id={data.id}
            //     documentType={'ADVANCE_FORM_PHOTO'}
            //   />
            //   : '-',

            remarks: data.remarks || '-',
            bank_remarks: data.bank_remarks || '-',
            freight_remarks: data.freight_remarks || '-',
            supplier_ref_no: data.supplier_ref_no || '-',
            supplier_posting_date: formatDate(data.supplier_posting_date),
            low_tonnage_charges: data.low_tonnage_charges || '-',

            /* Additional advance */
            additional_advance_sap_invoice_posting_date: formatDate(data.additional_advance_sap_invoice_posting_date),
            additional_advance_document_no: data.additional_advance_document_no || '-',
            additional_advance_payment: data.additional_advance_payment || '-',
            additional_payment_mode: getPaymentModeLabel(data.additional_payment_mode, data.additional_advance_document_no),
            additional_advance_remarks: data.additional_advance_remarks || '-',
            additional_advance_form: data.additional_advance_form
              ? <CustomSpanButton3
                handleViewDocuments={handleViewDocuments}
                Id={data.id}
                documentType={'ADD_ADVANCE_FORM_PHOTO'}
              />
              : '-',

            username: data.user_info?.emp_name || '-',
            created_at: data.created_at || '-',
            created_at_date: formatDate(data.created_at) || '-',
            created_at_time: data.created_at_time || '-',
            approval_status: getApprovalStatusLabel(data.approval_status),
            approved_by: data.approval_by_user || '-',
            approval_at: data.approval_at || '-',
          })
        })
        setRowData(list)
        setFetch(true)
      })
      .catch((err) => {
        console.error('NLMT Advance Report Error:', err)
        toast.error('Failed to load advance report. Please try again.')
        setFetch(true)
      })
  }

  /* ---- Load on mount ---- */
  useEffect(() => {
    loadReport()
  }, []) 

  /* ---- Export to Excel ---- */
  /* ---- Export to Excel ---- */
  const exportToCSV = () => {
    if (!rowData || rowData.length === 0) {
      toast.warning('No data to export!')
      return
    }
    // Flatten JSX cells for export and return all original columns
    const exportData = rowData.map((row) => ({
      'S.No': row.sno,
      'Vehicle Type': row.Vehicle_Type,
      'Advance Type': row.Advance_Status?.text || '',
      'Vehicle No': row.vehicle_number,
      'NLMT TS No.': row.trip_sheet_no,
      'TS Date': row.tripsheet_created,
      'Driver Name': row.driver_name,
      'Driver Code': row.driver_code,
      'Vendor Name': row.owner_name,
      'PAN No.': row.pan_card_number,
      'Vendor Code': row.vendor_code,
      'Pro Freight Amount': row.actual_freight,
      'Pro Advance Amount': row.Vehicle_Type === 'Own' ? '-' : row.advance_payment,
      'Vendor Outstanding': row.vendor_outstanding,
      // 'SAP Own Doc.No': row.document_no,
      // 'Payment Mode': row.initial_payment_mode,
      'GST Tax Type': (row.gst_tax_type == null ||  row.gst_tax_type == 'Empty' || row.gst_tax_type == '') ? '-' : row.gst_tax_type,
      'TDS Having': row.tds_type == 1 ? 'Yes' : 'No',
      'TDS Tax Type': row.tds_type == 1 ? row.vendor_tds :  '-',
      'HSN Code': row.vendor_hsn ? row.vendor_hsn :  '-',
      'SAP Posting Date': row.sap_invoice_posting_date,
      'SAP Freight Doc.No': row.sap_freight_payment_document_no,
      'SAP Freight Amount': row.sap_freight_payment_amount,
      'Bank Posting Date': row.bank_date,
      'SAP Bank Doc.No': row.sap_bank_payment_document_no,
      'SAP Bank Advance Amount': row.sap_bank_payment_amount,
      // 'Advance Form': typeof row.advance_form === 'object' ? 'Photo Available' : row.advance_form,
      'Remarks': row.remarks,
      'Bank Remarks': row.bank_remarks,
      'Freight Remarks': row.freight_remarks,
      'Supplier Ref No.': row.supplier_ref_no,
      'Supplier Ref Date': row.supplier_posting_date,
      // 'Low Tonnage Charges': row.low_tonnage_charges,
      // 'Add. SAP Posting Date': row.additional_advance_sap_invoice_posting_date,
      // 'Add. SAP Doc.No': row.additional_advance_document_no,
      // 'Add. Advance Amt (₹)': row.additional_advance_payment,
      // 'Add. Payment Mode': row.additional_payment_mode,
      // 'Add. Remarks': row.additional_advance_remarks,
      // 'Add. Advance Form': typeof row.additional_advance_form === 'object' ? 'Photo Available' : row.additional_advance_form,
      'Status': row.approval_status?.text || '',
      'Approved By': row.approved_by,
      'Approval At': row.approval_at,
      'Created By': row.username,
      'Created At': row.created_at_time,
    }))

    const dateTimeString = GetDateTimeFormat(1)
    const fileName = 'NLMT_Advance_Report_' + dateTimeString
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
    {
      name: 'Veh. Type',
      selector: (r) => r.Vehicle_Type,
      cell: (r) => {
        let badgeColor = 'success'
        let textColor = 'text-white'
        if (r.Vehicle_Type === 'Own') {
          badgeColor = 'primary'
        } else if (r.Vehicle_Type === 'Hire') {
          badgeColor = 'warning'
        } else if (r.Vehicle_Type === 'Party') {
          badgeColor = 'info'
          textColor = 'text-dark'
        }
        return (
          <CBadge color={badgeColor} className={textColor}>
            {r.Vehicle_Type}
          </CBadge>
        )
      },
      sortable: true,
      center: true,
    },
    { name: 'Vehicle No', selector: (r) => r.vehicle_number, sortable: true, center: true },
    { name: 'TS No', selector: (r) => r.trip_sheet_no, sortable: true, center: true },
    { name: 'TS Date', selector: (r) => r.tripsheet_created, sortable: true, center: true },
    { name: 'Vendor', selector: (r) => r.owner_name, sortable: true, center: true },
    // { name: 'pan no', selector: (r) => r.pan_card_number, sortable: true, center: true },
    { name: 'freight', selector: (r) => r.sap_freight_payment_amount, sortable: true, center: true },
    {
      name: 'advance',
      selector: (r) => r.Vehicle_Type === 'Own' ? '-' : r.sap_bank_payment_amount,
      sortable: true,
      center: true,
    },
    {
      name: 'Invoice No',
      selector: (r) => r.Vehicle_Type === 'Own' ? '-' : r.sap_bank_payment_document_no,
      sortable: true,
      center: true,
    },
    { name: 'Attachment', selector: (r) => r.advance_form, center: true },
    // { name: 'Add. Advance Form', selector: (r) => r.additional_advance_form, center: true },
    {
      name: 'Status',
      selector: (r) => r.approval_status?.text,
      cell: (r) => (
        <CBadge color={r.approval_status?.color || 'warning'} className={r.approval_status?.textColor || 'text-dark'}>
          {r.approval_status?.text || 'Advance Request'}
        </CBadge>
      ),
      sortable: true,
      center: true,
    },
    { name: 'Approv. By', selector: (r) => r.approved_by, sortable: true, center: true },
    { name: 'created by', selector: (r) => r.username, sortable: true, center: true },
    { name: 'created at', selector: (r) => r.created_at_date, sortable: true, center: true },
  ]

  /* ============================================================ */
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
                    <CFormLabel htmlFor="nlmt_adv_date"><b>Date Range</b></CFormLabel>
                    <DateRangePicker
                      id="nlmt_adv_date"
                      style={{ width: '100%', borderColor: '#6c757d' }}
                      format="dd-MM-yyyy"
                      value={dateRange}
                      onChange={setDateRange}
                    />
                  </CCol>

                  <CCol xs={12} md={2}>
                    <CFormLabel htmlFor="nlmt_adv_vehicletype"><b>Vehicle Type</b></CFormLabel>
                    <CFormSelect
                      id="nlmt_adv_vehicletype"
                      size="sm"
                      className="mb-1"
                      onChange={(e) => onChangeFilter(e, 'vehicle_type')}
                      value={reportVehicleType}
                    >
                      <option value="">All</option>
                      <option value="21">Own</option>
                      <option value="22">Hire</option>
                      {/* <option value="23">Party</option> */}
                    </CFormSelect>
                  </CCol>

                  <CCol xs={12} md={2}>
                    <CFormLabel htmlFor="nlmt_adv_vehicle"><b>Vehicle Number</b></CFormLabel>
                    <NlmtAdvanceVehicleSelectCompont
                      key={`vehicle-${reportVehicleType}`}
                      id="nlmt_adv_vehicle"
                      size="sm"
                      className="mb-1"
                      onChange={(e) => onChangeFilter(e, 'vehicle_number')}
                      label="Select Vehicle"
                      noOptionsMessage="Vehicle not found"
                      search_type="vehicle_number"
                      search_data={searchFilterData}
                      vehicleType={reportVehicleType}
                    />
                  </CCol>

                  <CCol xs={12} md={2}>
                    <CFormLabel htmlFor="nlmt_adv_tripsheet"><b>TripSheet No</b></CFormLabel>
                    <NlmtAdvanceVehicleSelectCompont
                      key={`tripsheet-${reportVehicleType}`}
                      id="nlmt_adv_tripsheet"
                      size="sm"
                      className="mb-1"
                      onChange={(e) => onChangeFilter(e, 'trip_sheet_no')}
                      label="Select TripSheet"
                      noOptionsMessage="TripSheet not found"
                      search_type="trip_sheet_no"
                      search_data={searchFilterData}
                      vehicleType={reportVehicleType}
                    />
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

      {/* ---- Advance Form Photo Modal ---- */}
      <CModal backdrop="static" size="xl" visible={advancePhotoVisible} onClose={() => setAdvancePhotoVisible(false)}>
        <CModalHeader>
          <CModalTitle>Advance Form Photo</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CCardImage 
            // height="500" 
            orientation="top" 
            src={advancePhotoSrc} 
          />
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setAdvancePhotoVisible(false)}>Close</CButton>
        </CModalFooter>
      </CModal>

      {/* ---- Additional Advance Form Photo Modal ---- */}
      <CModal visible={addAdvancePhotoVisible} onClose={() => setAddAdvancePhotoVisible(false)}>
        <CModalHeader>
          <CModalTitle>Additional Advance Form Photo</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CCardImage height="500" orientation="top" src={addAdvancePhotoSrc} />
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setAddAdvancePhotoVisible(false)}>Close</CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}

export default NlmtAdvanceReport