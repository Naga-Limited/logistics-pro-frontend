import React, { useState, useEffect } from 'react'
import AppConfig from 'src/AppConfig'
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
} from '@coreui/react'
import { Link } from 'react-router-dom'
import { DateRangePicker } from 'rsuite'
import Select from 'react-select'
import CustomTable from 'src/components/customComponent/CustomTable'
import Loader from 'src/components/Loader'
import { toast } from 'react-toastify'
import * as XLSX from 'xlsx'
import FileSaver from 'file-saver'
import AccessDeniedComponent from 'src/components/commoncomponent/AccessDeniedComponent'
import JavascriptInArrayComponent from 'src/components/commoncomponent/JavascriptInArrayComponent'
import * as NlmtScreenAccessCodes from 'src/components/constants/NlmtScreenAccessCodes'
import NlmtReportService from 'src/Service/Nlmt/Report/NlmtReportService'
import { GetDateTimeFormat } from 'src/Pages/Nlmt/CommonMethods/CommonMethods'

/* ================================================================
   NLMT Trip-In Report
   - Lists ALL trip-in records (Own + Hire) from nlmt_trip_in
   - POST /Nlmt_trip_in_report  (date range + optional vehicle)
   - Action column shown only for admin users (is_admin == 1)
   ================================================================ */

/* ── Date helpers ─────────────────────────────────────────────── */
function getCurrentDate(sep = '-') {
  const d = new Date()
  const day   = ('0' + d.getDate()).slice(-2)
  const month = ('0' + (d.getMonth() + 1)).slice(-2)
  return `${d.getFullYear()}${sep}${month}${sep}${day}`
}

function convert(dateObj) {
  const d     = new Date(dateObj)
  const month = ('0' + (d.getMonth() + 1)).slice(-2)
  const day   = ('0' + d.getDate()).slice(-2)
  return [d.getFullYear(), month, day].join('-')
}

function formatDate(dateStr) {
  if (!dateStr) return '-'
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return dateStr
  const day   = ('0' + d.getDate()).slice(-2)
  const month = ('0' + (d.getMonth() + 1)).slice(-2)
  return `${day}-${month}-${d.getFullYear()}`
}

/* Vehicle-type plain label */
const getVehicleTypeLabel = (typeId) => {
  switch (Number(typeId)) {
    case 21: return 'Own'
    case 22: return 'Hire'
    case 23: return 'Party'
    default: return '-'
  }
}

const Parking_Status = [
  { id: 1,  PStatus: 'Own GateIn – 1' },
  { id: 2,  PStatus: 'Hire GateIn – 2' },
  { id: 3,  PStatus: 'Party GateIn – 3' },
  { id: 4,  PStatus: 'Inspection Rejected – 4' },
  { id: 5,  PStatus: 'Maintenance Out – 5' },
  { id: 6,  PStatus: 'Maintenance In – 6' },
  { id: 7,  PStatus: 'Doc. Failure – 7' },
  { id: 11, PStatus: 'Trip Closed – 11' },
  { id: 15, PStatus: 'Gate Out – 15' },
  { id: 19, PStatus: 'Trip Out – 19' },
]

const Maintenance_Options = [
  { id: 1, VMain: 'Inside' },
  { id: 2, VMain: 'Outside' },
]

const getParkingStatusLabel = (status) => {
  if (status === null || status === undefined || status === '') return '-'
  const code = Number(status)
  const found = Parking_Status.find((item) => item.id === code)
  return found ? found.PStatus : `Status ${status}`
}

const getMaintenanceStatusLabel = (status) => {
  if (status === null || status === undefined || status === '') return '-'
  const code = Number(status)
  const found = Maintenance_Options.find((item) => item.id === code)
  return found ? found.VMain : `Status ${status}`
}

const getInspectionStatusLabel = (status) => {
  if (status === null || status === undefined || status === '') return '-'
  return Number(status) === 1 ? 'Completed' : '-'
}

const veh_cur_pos_own = [
  { desc: 'Vehicle Gate In', code: 1 },
  { desc: 'Vehicle Inspection Completed', code: 2 },
  { desc: 'Tripsheet Creation Completed', code: 16 },
  { desc: 'Tripsheet Cancelled', code: 17 },
  { desc: 'Advance Payment Request Created', code: 18 },
  { desc: 'Advance Payment Approved / Completed', code: 19 },
  { desc: 'Shipment Creation Completed', code: 20 },
  { desc: 'Shipment Deleted', code: 21 },
  { desc: 'Shipment Completed', code: 22 },
  { desc: 'Expense Closure Completed', code: 23 },
  { desc: 'Expense Closure Rejected', code: 24 },
  { desc: 'Expense Closure Approval Completed', code: 25 },
  { desc: 'Income Closure Completed', code: 26 },
  { desc: 'Income Closure Rejected', code: 27 },
  { desc: 'Income Closure Approval Completed', code: 28 },
  { desc: 'Driver Payment Completed', code: 30 },
  { desc: 'Driver Payment Rejected', code: 31 },
  { desc: 'Driver Payment Approval Completed', code: 32 },
  { desc: 'Diesel Indent Created', code: 37 },
  { desc: 'Diesel Indent Confirmed', code: 39 },
]

const veh_cur_pos_hire = [
  { desc: 'Document Verification Completed', code: 8 },
  { desc: 'Document Verification Rejected', code: 9 },
  { desc: 'Advance Payment Request Rejected', code: 15 },
  { desc: 'Tripsheet Creation Completed', code: 16 },
  { desc: 'Tripsheet Cancelled', code: 17 },
  { desc: 'Advance Payment Request Created', code: 18 },
  { desc: 'Advance Payment Approved / Completed', code: 19 },
  { desc: 'Shipment Creation Completed', code: 20 },
  { desc: 'Shipment Deleted', code: 21 },
  { desc: 'Shipment Completed', code: 22 },
  { desc: 'Expense Closure Completed & Waiting For Deduction Approval', code: 26 },
  { desc: 'Without Deduction Expense Closure Completed or Deduction Approval Completed', code: 27 },
  { desc: 'Expense Closure Approval Completed / Payment Validation Rejected', code: 28 },
  { desc: 'Hire Vehicles Payment Submission Completed / Hire Vehicles Payment Approval Rejected', code: 29 },
  { desc: 'Hire Vehicles Payment Validation Completed', code: 30 },
  { desc: 'Hire Vehicles Payment Approval Completed', code: 31 },
]

const veh_cur_pos_table_own = [
  { desc: 'Gate In ✔️', code: 1 },
  { desc: 'Veh. Insp. ✔️', code: 2 },
  { desc: 'TS Creation ✔️', code: 16 },
  { desc: 'TS Cancelled ❌', code: 17 },
  { desc: 'Adv. Request ✔️', code: 18 },
  { desc: 'Adv. Payment ✔️', code: 19 },
  { desc: 'Shipment ✔️', code: 20 },
  { desc: 'Ship. Deleted ❌', code: 21 },
  { desc: 'Ship. Completed ✔️', code: 22 },
  { desc: 'Exp. Closure ✔️', code: 23 },
  { desc: 'Exp. Closure ❌', code: 24 },
  { desc: 'Exp. Approval ✔️', code: 25 },
  { desc: 'Income Closure ✔️', code: 26 },
  { desc: 'Income Closure ❌', code: 27 },
  { desc: 'Income Approval ✔️', code: 28 },
  { desc: 'Driver Payment ✔️', code: 30 },
  { desc: 'Driver Payment ❌', code: 31 },
  { desc: 'Driver Payment Approval ✔️', code: 32 },
  { desc: 'DI Creation ✔️', code: 37 },
  { desc: 'DI Confirmation ✔️', code: 39 },
]

const veh_cur_pos_table_hire = [
  { desc: 'Doc. Verify ✔️', code: 8 },
  { desc: 'Doc. Verify ❌', code: 9 },
  { desc: 'Adv Rej ❌', code: 15 },
  { desc: 'TS Creation ✔️', code: 16 },
  { desc: 'TS Cancelled ❌', code: 17 },
  { desc: 'Adv. Request ✔️', code: 18 },
  { desc: 'Adv. Approval ✔️', code: 19 },
  { desc: 'Shipment ✔️', code: 20 },
  { desc: 'Ship. Deleted ❌', code: 21 },
  { desc: 'Ship. Completed ✔️', code: 22 },
  { desc: 'Exp. Closure ✔️', code: 26 },
  { desc: 'Ded. Approval ✔️', code: 27 },
  { desc: 'Payment Validation ❌', code: 28 },
  { desc: 'Payment Submission ✔️', code: 29 },
  { desc: 'Payment Validation ✔️', code: 30 },
  { desc: 'Payment Approval ✔️', code: 31 },
]

const getVehiclePositionLabel = (pos, typeId) => {
  const code = Number(pos)
  const isHire = Number(typeId) !== 21
  const table = isHire ? veh_cur_pos_table_hire : veh_cur_pos_table_own
  const found = table.find((item) => item.code === code)
  return found ? found.desc : `Position ${pos}`
}

const getVehiclePositionExportLabel = (pos, typeId) => {
  const code = Number(pos)
  const isHire = Number(typeId) !== 21
  const table = isHire ? veh_cur_pos_hire : veh_cur_pos_own
  const found = table.find((item) => item.code === code)
  return found ? found.desc : `Position ${pos}`
}

const getTripsheetStatusLabel = (openStatus, currentPos) => {
  const pos = Number(currentPos)
  if (pos === 17 || pos === 21) {
    return 'TS Cancelled'
  }
  switch (Number(openStatus)) {
    case 0: return 'Gate In'
    case 1: return 'TS Created'
    case 2: return 'TS Closed'
    case 3: return 'Assigned'
    default: return '-'
  }
}

const isValidPhoto = (photoUrl) => {
  if (!photoUrl) return false
  const lower = photoUrl.toLowerCase()
  if (lower.endsWith('/') || lower.endsWith('/null') || lower.endsWith('/undefined')) {
    return false
  }
  return true
}

const getCleanPhotoUrl = (urlStr) => {
  if (!urlStr) return ''
  let cleaned = urlStr

  // 1. Replace double public/public with single public (occurs under XAMPP Apache)
  if (cleaned.includes('/public/public/')) {
    cleaned = cleaned.replace('/public/public/', '/public/')
  }

  // 2. Adjust path based on server document root config
  const baseUrl = AppConfig?.api?.baseUrl || ''
  
  // If the API is served from the root of a domain (e.g. php artisan serve), 
  // the baseUrl will not contain the subfolder '/LP_API/'. 
  // In production/UAT, baseUrl is 'https://domain.com/LP_API/api/v1', so it contains '/LP_API/'.
  const isServedFromRoot = !baseUrl.includes('/LP_API/')
  
  if (isServedFromRoot && cleaned.includes('/public/storage/')) {
    cleaned = cleaned.replace('/public/storage/', '/storage/')
  }

  return cleaned
}

const formatDMYHMS = (dateStr) => {
  if (!dateStr || dateStr === '-') return '-'
  
  // If it is already in dd/mm/yyyy HH:mm:ss format, convert to dd-mm-yyyy
  if (typeof dateStr === 'string' && dateStr.includes('/')) {
    const [datePart, timePart] = dateStr.split(' ');
    if (datePart && timePart) {
      const parts = datePart.split('/');
      if (parts.length === 3) {
        return `${parts[0]}-${parts[1]}-${parts[2]} ${timePart}`;
      }
    }
  }

  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return dateStr
  
  const dd = String(d.getDate()).padStart(2, '0')
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const yyyy = d.getFullYear()
  const hh = String(d.getHours()).padStart(2, '0')
  const min = String(d.getMinutes()).padStart(2, '0')
  const ss = String(d.getSeconds()).padStart(2, '0')
  
  return `${dd}-${mm}-${yyyy} ${hh}:${min}:${ss}`
}

/* ================================================================ */

const NlmtTripInReport = () => {
  /* ── User / Access ─────────────────────────────────────────── */
  const user_info = JSON.parse(localStorage.getItem('user_info') || '{}')
  const isAdmin   = user_info.is_admin == 1

  const [screenAccess, setScreenAccess] = useState(false)
  const page_no = NlmtScreenAccessCodes.NlmtReportScreens.NLMT_Trip_In_Report

  useEffect(() => {
    setScreenAccess(
      isAdmin || JavascriptInArrayComponent(page_no, user_info.page_permissions)
    )
  }, [])

  /* ── Date range ─────────────────────────────────────────────── */
  const today = getCurrentDate('-')
  const [dateRange, setDateRange] = useState([new Date(today), new Date(today)])
  const [fromDate, setFromDate]   = useState(today)
  const [toDate,   setToDate]     = useState(today)

  useEffect(() => {
    if (dateRange && dateRange.length === 2) {
      setFromDate(convert(dateRange[0]))
      setToDate(convert(dateRange[1]))
    } else {
      setFromDate('')
      setToDate('')
    }
  }, [dateRange])

  /* ── Vehicle filter dropdown ─────────────────────────────────── */
  const [vehicleOptions,   setVehicleOptions]   = useState([{ value: '', label: 'Select Vehicle Number' }])
  const [selectedVehicle,  setSelectedVehicle]  = useState(null)

  useEffect(() => {
    NlmtReportService.getTripInVehicleData()
      .then((res) => {
        const opts = [{ value: '', label: 'Select Vehicle Number' }]
        ;(res.data || []).forEach(({ vehicle_id, vehicle_number, vehicle_type_id }) => {
          if (vehicle_id && vehicle_number) {
            opts.push({ value: vehicle_id, label: vehicle_number, vehicle_type_id })
          }
        })
        setVehicleOptions(opts)
      })
      .catch((err) => console.error('Vehicle list fetch error:', err))
  }, [])

  /* ── Vehicle Type filter ─────────────────────────────────────── */
  const vehicleTypeOptions = [
    { value: '', label: 'Select Vehicle Type' },
    { value: '21', label: 'Own' },
    { value: '22', label: 'Hire' },
    { value: '23', label: 'Party' },
  ]
  const [selectedVehicleType, setSelectedVehicleType] = useState(null)

  /* ── Tripsheet filter dropdown ───────────────────────────────── */
  const [tripsheetOptions, setTripsheetOptions] = useState([{ value: '', label: 'Select Tripsheet No' }])
  const [selectedTripsheet, setSelectedTripsheet] = useState(null)

  useEffect(() => {
    NlmtReportService.getTripInTripsheetData()
      .then((res) => {
        const opts = [{ value: '', label: 'Select Tripsheet No' }]
        ;(res.data || []).forEach(({ tripsheet_id, nlmt_tripsheet_no, vehicle_id, vehicle_type_id }) => {
          if (nlmt_tripsheet_no) {
            opts.push({ value: nlmt_tripsheet_no, label: nlmt_tripsheet_no, vehicle_id, vehicle_type_id })
          }
        })
        setTripsheetOptions(opts)
      })
      .catch((err) => console.error('Tripsheet list fetch error:', err))
  }, [])

  /* ── Dynamic Cross-Filtering Logic ─────────────────────────────── */
  const filteredVehicleOptions = vehicleOptions.filter((opt) => {
    if (!opt.value) return true

    if (selectedVehicleType && selectedVehicleType.value) {
      if (Number(opt.vehicle_type_id) !== Number(selectedVehicleType.value)) {
        return false
      }
    }

    if (selectedTripsheet && selectedTripsheet.value) {
      const tsOpt = tripsheetOptions.find((t) => t.value === selectedTripsheet.value)
      if (tsOpt && Number(opt.value) !== Number(tsOpt.vehicle_id)) {
        return false
      }
    }

    return true
  })

  const filteredTripsheetOptions = tripsheetOptions.filter((opt) => {
    if (!opt.value) return true

    if (selectedVehicleType && selectedVehicleType.value) {
      if (Number(opt.vehicle_type_id) !== Number(selectedVehicleType.value)) {
        return false
      }
    }

    if (selectedVehicle && selectedVehicle.value) {
      if (Number(opt.vehicle_id) !== Number(selectedVehicle.value)) {
        return false
      }
    }

    return true
  })

  const filteredVehicleTypeOptions = vehicleTypeOptions.filter((opt) => {
    if (!opt.value) return true

    if (selectedVehicle && selectedVehicle.value) {
      const vehOpt = vehicleOptions.find((v) => Number(v.value) === Number(selectedVehicle.value))
      if (vehOpt && Number(opt.value) !== Number(vehOpt.vehicle_type_id)) {
        return false
      }
    }

    if (selectedTripsheet && selectedTripsheet.value) {
      const tsOpt = tripsheetOptions.find((t) => t.value === selectedTripsheet.value)
      if (tsOpt && Number(opt.value) !== Number(tsOpt.vehicle_type_id)) {
        return false
      }
    }

    return true
  })

  /* ── Photo Modals State ──────────────────────────────────────── */
  const [odoPhotoVisible, setOdoPhotoVisible] = useState(false)
  const [odoPhotoSrc, setOdoPhotoSrc] = useState('')
  const [odoClosingPhotoVisible, setOdoClosingPhotoVisible] = useState(false)
  const [odoClosingPhotoSrc, setOdoClosingPhotoSrc] = useState('')

  /* ── Table state ─────────────────────────────────────────────── */
  const [rowData, setRowData] = useState([])
  const [fetch,   setFetch]   = useState(false)

  /* ── Load report ─────────────────────────────────────────────── */
  const loadReport = () => {
    if (!fromDate || !toDate) {
      toast.warning('Please select a date range!')
      return
    }
    setFetch(false)

    const fd = new FormData()
    fd.append('trip_in_from_date', fromDate)
    fd.append('trip_in_to_date',   toDate)
    fd.append('vehicle_id',        selectedVehicle?.value || '')
    fd.append('vehicle_type_id',   selectedVehicleType?.value || '')
    fd.append('tripsheet_no',      selectedTripsheet?.value || '')

    NlmtReportService.TripInReport(fd)
      .then((res) => {
        
        
        const raw  = res.data.data || []
        // console.log('raw',raw)
        const list = []

        raw.forEach((data, index) => {
          const vTypeId = data.vehicle_info?.vehicle_type_id
          const isOwn   = Number(vTypeId) === 21

          /* Driver name: Own → driver master; Hire → driver_name field */
          const driverName  = isOwn
            ? (data.driver_info?.driver_name || data.driver_name || '-')
            : (data.driver_name || '-')

          /* Driver mobile: Own → driver master; Hire → driver_phone_1 field */
          const driverPhone = isOwn
            ? (data.driver_info?.driver_phone_1 || data.driver_phone_1 || '-')
            : (data.driver_phone_1 || '-')

          const hasOdoPhoto = isValidPhoto(data.odometer_photo)
          const hasOdoClosingPhoto = isValidPhoto(data.odometer_closing_photo)

          list.push({
            sno:              index + 1,
            nlmt_trip_in_id:  data.nlmt_trip_in_id  || '-',
            vehicle_number:   data.vehicle_info?.vehicle_number || '-',
            Vehicle_Type:     getVehicleTypeLabel(vTypeId),
            nlmt_tripsheet_no: data.tripsheet_info?.nlmt_tripsheet_no || '-',
            driver_name:      driverName,
            driver_phone:     driverPhone,
            odometer_km:      data.odometer_km || '-',
            odometer_photo_btn: hasOdoPhoto ? (
              <CButton
                color="secondary"
                size="sm"
                className="text-dark"
                style={{ 
                  borderRadius: '20px', 
                  padding: '2px 10px', 
                  fontSize: '10px', 
                  fontWeight: 'bold', 
                  backgroundColor: '#b0bec5', 
                  borderColor: '#b0bec5', 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  gap: '5px' 
                }}
                onClick={() => {
                  setOdoPhotoSrc(getCleanPhotoUrl(data.odometer_photo))
                  setOdoPhotoVisible(true)
                }}
              >
                <i className="fa fa-eye" aria-hidden="true" style={{ fontSize: '11px' }} /> VIEW
              </CButton>
            ) : '-',
            odometer_photo_link: hasOdoPhoto ? getCleanPhotoUrl(data.odometer_photo) : '-',
            odometer_closing_km: data.odometer_closing_km || '-',
            odometer_closing_photo_btn: hasOdoClosingPhoto ? (
              <CButton
                color="secondary"
                size="sm"
                className="text-dark"
                style={{ 
                  borderRadius: '20px', 
                  padding: '2px 10px', 
                  fontSize: '10px', 
                  fontWeight: 'bold', 
                  backgroundColor: '#b0bec5', 
                  borderColor: '#b0bec5', 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  gap: '5px' 
                }}
                onClick={() => {
                  setOdoClosingPhotoSrc(getCleanPhotoUrl(data.odometer_closing_photo))
                  setOdoClosingPhotoVisible(true)
                }}
              >
                <i className="fa fa-eye" aria-hidden="true" style={{ fontSize: '11px' }} /> VIEW
              </CButton>
            ) : '-',
            odometer_closing_photo_link: hasOdoClosingPhoto ? getCleanPhotoUrl(data.odometer_closing_photo) : '-',
            vehicle_position_label: getVehiclePositionLabel(data.vehicle_current_position, data.vehicle_info?.vehicle_type_id),
            vehicle_position_export_label: getVehiclePositionExportLabel(data.vehicle_current_position, data.vehicle_info?.vehicle_type_id),
            tripsheet_status_label: getTripsheetStatusLabel(data.tripsheet_open_status, data.vehicle_current_position),
            remarks:          data.remarks || '-',
            closing_remarks:  data.closing_remarks || '-',
            parking_status_label: getParkingStatusLabel(data.parking_status),
            inspection_status: getInspectionStatusLabel(data.vehicle_inspection_status),
            maintenance_status_label: getMaintenanceStatusLabel(data.maintenance_status),
            tripsheet_shipment_status: data.tripsheet_shipment_status || '-',
            payment_status:   data.payment_status || '-',
            gate_in_date_time: formatDMYHMS(data.gate_in_date_time_string_modify || data.gate_in_date_time),
            gate_out_date_time: formatDMYHMS(data.gate_out_date_time),
            created_by:       data.nlmt_user_info?.emp_name || '-',
            updated_by:       data.updated_by || '-',
            creation_date:    data.created_date || '-',

            /* Action – admin only, same pattern as Gate In Report
            Action: isAdmin
              ? (
                <CButton className="badge" color="warning">
                  <Link
                    className="text-white"
                    to={`${data.nlmt_trip_in_id}`}
                  >
                    Gate In
                  </Link>
                </CButton>
              )
              : null,
            */
          })
        })

        setRowData(list)
        setFetch(true)
      })
      .catch((err) => {
        console.error('NLMT Trip-In Report Error:', err)
        toast.error('Failed to load Trip-In report. Please try again.')
        setFetch(true)
      })
  }

  /* Load on mount */
  useEffect(() => { loadReport() }, [])

  /* ── Export ─────────────────────────────────────────────────── */
  const exportToCSV = () => {
    if (!rowData || rowData.length === 0) {
      toast.warning('No data to export!')
      return
    }
    const exportData = rowData.map((row) => ({
      'S.No':         row.sno,
      'Trip-In ID':   row.nlmt_trip_in_id,
      'Vehicle No':   row.vehicle_number,
      'Vehicle Type': row.Vehicle_Type,
      'Tripsheet No': row.nlmt_tripsheet_no,
      'Driver Name':  row.driver_name,
      'Driver Mobile No': row.driver_phone,
      'Odometer KM':  row.odometer_km,
      // 'Odometer Photo': row.odometer_photo_link,
      'Odometer Closing KM': row.odometer_closing_km,
      // 'Odometer Closing Photo': row.odometer_closing_photo_link,
      'Vehicle Current Position': row.vehicle_position_export_label,
      'Tripsheet Open Status': row.tripsheet_status_label,
      'Remarks':      row.remarks,
      'Closing Remarks': row.closing_remarks,
      'Parking Status': row.parking_status_label,
      'Inspection Status': row.inspection_status,
      // 'Maintenance Status': row.maintenance_status_label,
      // 'Tripsheet Shipment Status': row.tripsheet_shipment_status,
      // 'Payment Status': row.payment_status,
      'Gate In Time': row.gate_in_date_time,
      'Gate Out Time': row.gate_out_date_time,
      'Created By':   row.created_by,
      // 'Updated By':   row.updated_by,
      'Creation Date': row.creation_date,
    }))

    const fileName  = 'NLMT_TripIn_Report_' + GetDateTimeFormat(1)
    const fileType  = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
    const ws = XLSX.utils.json_to_sheet(exportData)
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] }
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
    FileSaver.saveAs(new Blob([excelBuffer], { type: fileType }), fileName + '.xlsx')
  }

  /* ── Columns ─────────────────────────────────────────────────── */
  const columns = [
    {
      name:     'S.NO',
      selector: (r) => r.sno,
      sortable: true,
      center:   true,
      width:    '65px',
    },
    {
      name:     'VEH.TYPE',
      selector: (r) => r.Vehicle_Type,
      sortable: true,
      center:   true,
    },
    
    {
      name:     'VEHICLE NO',
      selector: (r) => r.vehicle_number,
      sortable: true,
      center:   true,
    },
    
    {
      name:     'TRIPSHEET',
      selector: (r) => r.nlmt_tripsheet_no,
      sortable: true,
      center:   true,
    },
    {
      name:     'DRIVER',
      selector: (r) => r.driver_name,
      sortable: true,
      center:   true,
    },
    {
      name:     'PHONE NO',
      selector: (r) => r.driver_phone,
      sortable: true,
      center:   true,
    },
    {
      name:     'OPENING KM',
      selector: (r) => r.odometer_km,
      sortable: true,
      center:   true,
    },
    {
      name:     'IMG.',
      selector: (r) => r.odometer_photo_btn,
      center:   true,
    },
    {
      name:     'CLOSING KM',
      selector: (r) => r.odometer_closing_km,
      sortable: true,
      center:   true,
    },
    {
      name:     'IMG.',
      selector: (r) => r.odometer_closing_photo_btn,
      center:   true,
    },
    {
      name:     'VEH.STATUS',
      selector: (r) => r.vehicle_position_label,
      sortable: true,
      center:   true,
    },
    {
      name:     'TS STATUS',
      selector: (r) => r.tripsheet_status_label,
      sortable: true,
      center:   true,
    },
    {
      name:     'CREATION DATE',
      selector: (r) => r.creation_date,
      sortable: true,
      center:   true,
    },
    /* Action column – rendered only when user is admin
    ...(isAdmin
      ? [
          {
            name:     'ACTION',
            selector: (r) => r.Action,
            center:   true,
          },
        ]
      : []),
    */
  ]

  /* ── Render ──────────────────────────────────────────────────── */
  return (
    <>
      {!fetch && <Loader />}
      {fetch && (
        <>
          {screenAccess ? (
            <CCard className="mt-4">
              <CContainer className="m-2">

                {/* ── Filter Row ── */}
                <CRow className="mt-1 mb-1">

                  {/* Date Range */}
                  <CCol xs={12} md={3}>
                    <CFormLabel htmlFor="tripin_date">Date Filter</CFormLabel>
                    <DateRangePicker
                      id="tripin_date"
                      style={{ width: '100%', borderColor: '#6c757d' }}
                      format="dd-MM-yyyy"
                      value={dateRange}
                      onChange={setDateRange}
                    />
                  </CCol>

                  {/* Vehicle Filter */}
                  <CCol xs={12} md={3}>
                    <CFormLabel htmlFor="tripin_vehicle">Vehicle Number</CFormLabel>
                    <Select
                      id="tripin_vehicle"
                      options={filteredVehicleOptions}
                      value={selectedVehicle}
                      onChange={setSelectedVehicle}
                      placeholder="Select Vehicle Number"
                      isClearable
                    />
                  </CCol>

                  {/* Vehicle Type Filter */}
                  <CCol xs={12} md={3}>
                    <CFormLabel htmlFor="tripin_vehicle_type">Vehicle Type</CFormLabel>
                    <Select
                      id="tripin_vehicle_type"
                      options={filteredVehicleTypeOptions}
                      value={selectedVehicleType}
                      onChange={setSelectedVehicleType}
                      placeholder="Select Vehicle Type"
                      isClearable
                    />
                  </CCol>

                  {/* Tripsheet Number Filter */}
                  <CCol xs={12} md={3}>
                    <CFormLabel htmlFor="tripin_tripsheet">Tripsheet No</CFormLabel>
                    <Select
                      id="tripin_tripsheet"
                      options={filteredTripsheetOptions}
                      value={selectedTripsheet}
                      onChange={setSelectedTripsheet}
                      placeholder="Select Tripsheet No"
                      isClearable
                    />
                  </CCol>
                </CRow>

                <hr style={{ height: '2px', marginTop: '0.5px' }} />

                {/* Filter / Export buttons – right-aligned */}
                <CRow className="mt-3">
                  <CCol className="" xs={12} sm={9} md={3} />
                  <CCol
                    className="offset-md-6"
                    xs={12}
                    sm={9}
                    md={3}
                    style={{ display: 'flex', justifyContent: 'end', gap: '8px' }}
                  >
                    <CButton
                      id="tripin_filter_btn"
                      size="sm"
                      color="primary"
                      className="mx-3 px-3 text-white"
                      onClick={() => {
                        setFetch(false)
                        loadReport()
                      }}
                    >
                      Filter
                    </CButton>
                    <CButton
                      id="tripin_export_btn"
                      size="sm"
                      color="warning"
                      className="px-3 text-white"
                      onClick={exportToCSV}
                    >
                      <i className="fa fa-file-excel-o me-1" />Export
                    </CButton>
                  </CCol>
                </CRow>

                {/* ── Data Table ── */}
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

      {/* ---- Odometer Photo Modal ---- */}
      <CModal visible={odoPhotoVisible} onClose={() => setOdoPhotoVisible(false)}>
        <CModalHeader>
          <CModalTitle>Odometer Photo</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {odoPhotoSrc && !odoPhotoSrc.toLowerCase().endsWith('.pdf') ? (
            <CCardImage height="500" orientation="top" src={odoPhotoSrc} />
          ) : (
            <iframe height="500" width="100%" src={odoPhotoSrc} title="Odometer Photo"></iframe>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setOdoPhotoVisible(false)}>Close</CButton>
        </CModalFooter>
      </CModal>

      {/* ---- Odometer Closing Photo Modal ---- */}
      <CModal visible={odoClosingPhotoVisible} onClose={() => setOdoClosingPhotoVisible(false)}>
        <CModalHeader>
          <CModalTitle>Odometer Closing Photo</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {odoClosingPhotoSrc && !odoClosingPhotoSrc.toLowerCase().endsWith('.pdf') ? (
            <CCardImage height="500" orientation="top" src={odoClosingPhotoSrc} />
          ) : (
            <iframe height="500" width="100%" src={odoClosingPhotoSrc} title="Odometer Closing Photo"></iframe>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setOdoClosingPhotoVisible(false)}>Close</CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}

export default NlmtTripInReport