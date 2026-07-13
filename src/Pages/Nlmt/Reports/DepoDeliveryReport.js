import React, { useState, useEffect } from 'react'
import {
  CButton,
  CCard,
  CRow,
  CCol,
  CAlert,
  CContainer,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CFormLabel,
} from '@coreui/react'
import { Link, useNavigate } from 'react-router-dom'
import CustomTable from 'src/components/customComponent/CustomTable'
import TripStoService from 'src/Service/TripSTO/TripStoService'
import { ToastContainer, toast } from 'react-toastify'
import Loader from 'src/components/Loader'
import { DateRangePicker } from 'rsuite'
// import TripSheetFilterComponent from '../TripSheetReports/TripSheetFilterComponent/TripSheetFilterComponent'
import SearchSelectComponent from 'src/components/commoncomponent/searchSelectComponent'
import FileSaver from 'file-saver'
import * as XLSX from 'xlsx'
import DepoShipmentCreationService from 'src/Service/Depo/Shipment/DepoShipmentCreationService'
import { GetDateTimeFormat } from '../CommonMethods/CommonMethods'
import AccessDeniedComponent from 'src/components/commoncomponent/AccessDeniedComponent'
import * as LogisticsProScreenNumberConstants from 'src/components/constants/LogisticsProScreenNumberConstants'
import JavascriptInArrayComponent from 'src/components/commoncomponent/JavascriptInArrayComponent'
import { imageUrlValidation } from '../CommonMethods/CommonMethods';
const DepoDeliveryReport = () => {
  const navigation = useNavigate()

   /*================== User Location Fetch ======================*/
  const user_info_json = localStorage.getItem('user_info')
  const user_info = JSON.parse(user_info_json)
  var user_locations = []

  /* Get User Locations From Local Storage */
  user_info.location_info.map((data, index) => {
    user_locations.push(data.id)
  })
  // console.log(user_locations)
  /*================== User Location Fetch ======================*/

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
    } else if (event_type == 'shipment_no') {
      if (selected_value) {
        setReportShipmentNo(selected_value)
      } else {
        setReportShipmentNo(0)
      }
    } else if (event_type == 'shipment_status') {
      if (selected_value) {
        setReportShipmentStatus(selected_value)
      } else {
        setReportShipmentStatus(0)
      }
    } else if (event_type == 'delivery_status') {
      if (selected_value) {
        setReportdeliveryStatus(selected_value)
      } else {
        setReportdeliveryStatus(0)
      }
    }
  }

  const exportToCSV = () => {
    if (defaultDate == null) {
      toast.warning('Date Filter Should not be empty..!')
      return false
    } else if (
      defaultDate == null &&
      reportVehicle == 0 &&
      reportShipmentNo == 0 &&
      reportTSNo == 0 &&
      reportShipmentStatus == 0
    ) {
      toast.warning('Choose atleast one filter type..!')
      return false
    }

    let dateTimeString = GetDateTimeFormat(1)
    let fileName='Depo_Delivery_Report_'+dateTimeString
    const fileType =
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
    const fileExtension = '.xlsx'
    const ws = XLSX.utils.json_to_sheet(rowData)
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] }
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
    const data = new Blob([excelBuffer], { type: fileType })
    FileSaver.saveAs(data, fileName + fileExtension)
  }

  const ACTION = {
    GATE_IN: 1,
    GATE_OUT: 2,
    WAIT_OUTSIDE: 0,
    VEHICLE_MAINTENANCE_ENDED: 5,
  }

  const [rowData, setRowData] = useState([])
  const [searchFilterData, setSearchFilterData] = useState([])

  const [errorModal, setErrorModal] = useState(false)
  const [fetch, setFetch] = useState(false)

  const [pending, setPending] = useState(true)

  /* Report Variables */
  const [reportVehicle, setReportVehicle] = useState(0)
  const [reportTSNo, setReportTSNo] = useState(0)
  const [reportTSId, setReportTSId] = useState(0)
  const [reportShipmentNo, setReportShipmentNo] = useState(0)
  const [reportShipmentStatus, setReportShipmentStatus] = useState(0)
  const [reportDeliveryStatus, setReportdeliveryStatus] = useState(0)

  const [vehicleSto, setVehicleSto] = useState('')

  let tableData = []
  let tableReportData = []

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

  const shipmentStatusArray = [
    'Created',
    'Updated By User',
    'Updated By SAP',
    'Cancelled',
    'Completed',
    'Deleted',
    'Removed',
  ]

  const deliveryStatus = (id) => {
    return deliveryStatusArray[id - 1]
  }

  const shipmentStatus = (id) => {
    return shipmentStatusArray[id - 1]
  }

  /* Set Default Date (Today) in a Variable State */
  const [defaultDate, setDefaultDate] = React.useState([
    new Date(getCurrentDate('-')),
    new Date(getCurrentDate('-')),
  ])

  useEffect(() => {
    //  console.log(defaultDate)
    if (defaultDate) {
      setDefaultDate(defaultDate)
    } else {
    }
  }, [defaultDate])

  const loadTripShipmentReport = (fresh_type = '') => {
    /*================== User Location Fetch ======================*/
    const user_info_json = localStorage.getItem('user_info')
    const user_info = JSON.parse(user_info_json)
    var user_locations = []

    /* Get User Locations From Local Storage */
    user_info.location_info.map((data, index) => {
      user_locations.push(data.id)
    })

    if (fresh_type !== '1') {
      // console.log(user_locations)
      /*================== User Location Fetch ======================*/

      DepoShipmentCreationService.getSingleDepoShipmentChildInfo().then((res) => {
        tableReportData = res.data.data
        console.log(tableReportData, 'getShipmentDataForReport')

        setFetch(true)
        let rowDataList = []
        let filterData = tableReportData.filter(
          (data) => user_locations.indexOf(data.parking_yard_info.vehicle_location_id) != -1
        )
        console.log(filterData, 'filterData')

        setSearchFilterData(filterData)
        let tot_temp = 0
        let temp = 0
        filterData.map((data, index) => {
          tot_temp = tot_temp + data.shipment_child_info.length
          temp = tot_temp - data.shipment_child_info.length
          data.shipment_child_info.map((data1, index1) => {
          console.log(data, 'data')

          rowDataList.push({
            sno: temp + 1,
            Delivery_No: data.shipment_child_info[index1].delivery_no,
            Invoice_No: data.shipment_child_info[index1].invoice_no,
            Tripsheet_No: data.trip_sheet_info.depo_tripsheet_no,
            Tripsheet_Date: data.trip_sheet_info.created_date,
            Shipment_No: data.shipment_no,
            CreatedBy: data.depo_shipment_user_info.emp_name,
            Initial_Shipment: data.initial_shipment_qty,
            Final_Shipment: data.final_shipment_qty,
            Delivery_Net_qty: data.shipment_child_info[index1].delivery_net_qty,
            Delivery_Pod_Copy: imageUrlValidation(data.shipment_child_info[index1].fj_pod_copy) == '' ? '--' : (
              <a style={{color:'black'}} target='_blank' rel="noreferrer" href={data.shipment_child_info[index1].fj_pod_copy}>
                <i className="fa fa-eye" aria-hidden="true"></i>
              </a>
            ),
            Freight_type: data.freight_type === 1 ? 'Budget' : 'Actual',
            Customer_Name: data.shipment_child_info[index1].customer_info.CustomerName,
            Customer_City: data.shipment_child_info[index1].customer_info.CustomerCity,
            Customer_Route: data.shipment_child_info[index1].customer_info.CustomerRoute,
            Contractor_Name: data.trip_vehicle_info.Depo_Contractor_info.contractor_name,
            //  Contractor_Mobile_Number: data.trip_vehicle_info.Depo_Contractor_info.contractor_number,
            Shipment_Qty:
              data.final_shipment_qty == 0 ? data.initial_shipment_qty : data.final_shipment_qty,
            Shipment_Budget_Freight: data.shipment_depo_budget_freight_amount,
            Shipment_Actual_Freight: data.shipment_depo_actual_freight_amount,
            BUDGET_VS_ACTUAL:
              data.shipment_depo_actual_freight_amount - data.shipment_depo_actual_freight_amount,
            //  Shipment_SAP_Freight: data.shipment_sap_freight_amount,
            Shipment_LP_Freight: data.shipment_child_info[index1].delivery_depo_freight_amount,
            Shipment_SAP_Sec_Freight:
              data.shipment_child_info[index1].delivery_sap_secondary_freight_amount,
            ACTUAL_VS_SAP:
              data.shipment_child_info[index1].delivery_sap_secondary_freight_amount -
              data.shipment_child_info[index1].delivery_depo_freight_amount,
            Shipment_Delivery_Count:
              data.shipment_child_info.length > 0
                ? data.shipment_child_info.length
                : data.shipment_delivery_info.length,
            Delivery_Status: deliveryStatus(data.approval_status),
            Shipment_Status: shipmentStatus(data.status),
            Remarks: data.remarks,
            Creation_Date: data.created_at_date,
          })
          temp++
          })
        })
        setFetch(true)
        setRowData(rowDataList)
        setPending(false)
      })
    } else {
      if (defaultDate == null) {
        setFetch(true)
        toast.warning('Date Filter Should not be empty..!')
        return false
      } else if (
        defaultDate == null &&
        reportVehicle == 0 &&
        reportShipmentNo == 0 &&
        reportTSNo == 0 &&
        reportShipmentStatus == 0 &&
        reportDeliveryStatus == 0
      ) {
        toast.warning('Choose atleast one filter type..!')
        return false
      }
      let report_form_data = new FormData()
      report_form_data.append('date_between', defaultDate)
      // report_form_data.append('vehicle_no', reportVehicle)
      report_form_data.append('shipment_no', reportShipmentNo)
      report_form_data.append('tripsheet_no', reportTSNo)
      report_form_data.append('trip_sheet_id', reportTSId)
      report_form_data.append('shipmant_status', reportShipmentStatus)
      report_form_data.append('delivery_status', reportDeliveryStatus)

      console.log(defaultDate, 'defaultDate')
      console.log(reportVehicle, 'reportVehicle')
      console.log(reportShipmentNo, 'reportShipmentNo')
      console.log(reportTSNo, 'reportTSNo')
      console.log(reportShipmentStatus, 'reportShipmentStatus')
      console.log(reportDeliveryStatus, 'reportDeliveryStatus')

      DepoShipmentCreationService.sentShipmentDataForReport(report_form_data).then((res) => {
        console.log(res, 'res')
        tableReportData = res.data.data
        console.log(tableReportData)

        setFetch(true)
        let rowDataList = []
        let filterData = tableReportData.filter(
          (data) => user_locations.indexOf(data.parking_yard_info.vehicle_location_id) != -1
        )
        // console.log(filterData)
        setSearchFilterData(filterData)
        let tot_temp = 0
        let temp = 0
        filterData.map((data, index) => {
          tot_temp = tot_temp + data.shipment_child_info.length
          temp = tot_temp - data.shipment_child_info.length
          data.shipment_child_info.map((data1, index1) => {
            console.log(data, 'data')
            rowDataList.push({
              sno: temp + 1,
              Delivery_No: data.shipment_child_info[index1].delivery_no,
              Invoice_No: data.shipment_child_info[index1].invoice_no,
              Tripsheet_No: data.trip_sheet_info.depo_tripsheet_no,
              Tripsheet_Date: data.trip_sheet_info.created_date,
              Shipment_No: data.shipment_no,
              CreatedBy: data.depo_shipment_user_info.emp_name,
              Initial_Shipment: data.initial_shipment_qty,
              Final_Shipment: data.final_shipment_qty,
              Delivery_Net_qty: data.shipment_child_info[index1].delivery_net_qty,
              Delivery_Pod_Copy: imageUrlValidation(data.shipment_child_info[index1].fj_pod_copy) == '' ? '--' : (
                <a style={{color:'black'}} target='_blank' rel="noreferrer" href={data.shipment_child_info[index1].fj_pod_copy}>
                  <i className="fa fa-eye" aria-hidden="true"></i>
                </a>
              ),
              //Depo_Location: data.depo_shipment_user_info.location_info[index1].location_name,
              Freight_type: data.freight_type === 1 ? 'Budget' : 'Actual',
              Customer_Name: data.shipment_child_info[index1].customer_info.CustomerName,
              Customer_City: data.shipment_child_info[index1].customer_info.CustomerCity,
              Customer_Route: data.shipment_child_info[index1].customer_info.CustomerRoute,
              Contractor_Name: data.trip_vehicle_info.Depo_Contractor_info.contractor_name,
              Contractor_Mobile_Number: data.trip_vehicle_info.Depo_Contractor_info.contractor_number,
              Shipment_Qty:
                data.final_shipment_qty == 0 ? data.initial_shipment_qty : data.final_shipment_qty,
              Shipment_Budget_Freight: data.shipment_depo_budget_freight_amount,
              Shipment_Actual_Freight: data.shipment_depo_actual_freight_amount,
              BUDGET_VS_ACTUAL:
                data.shipment_depo_actual_freight_amount - data.shipment_depo_actual_freight_amount,
              //  Shipment_SAP_Freight: data.shipment_sap_freight_amount,
              Shipment_LP_Freight: data.shipment_child_info[index1].delivery_depo_freight_amount,
              Shipment_SAP_Sec_Freight:
                data.shipment_child_info[index1].delivery_sap_secondary_freight_amount,
              ACTUAL_VS_SAP:
                data.shipment_child_info[index1].delivery_sap_secondary_freight_amount -
                data.shipment_child_info[index1].delivery_depo_freight_amount,
              Shipment_Delivery_Count:
                data.shipment_child_info.length > 0
                  ? data.shipment_child_info.length
                  : data.shipment_delivery_info.length,
              Delivery_Status: deliveryStatus(data.approval_status),
              Shipment_Status: shipmentStatus(data.status),
              Remarks: data.remarks,
              Creation_Date: data.created_at_date,
            })
            temp++
          })
        })
        setRowData(rowDataList)
        setPending(false)
      })
    }
  }
    /* ==================== Access Part Start ========================*/
  const [screenAccess, setScreenAccess] = useState(false)
  let page_no = LogisticsProScreenNumberConstants.DepoModuleScreens.Depo_Delivery_Report

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
      name: 'Creation Date',
      selector: (row) => row.Creation_Date,
      sortable: true,
      center: true,
    },
    {
      name: 'Delivery No',
      selector: (row) => row.Delivery_No,
      sortable: true,
      center: true,
    },
    {
      name: 'Invoice No',
      selector: (row) => row.Invoice_No,
      sortable: true,
      center: true,
    },
    {
      name: 'Shipment No',
      selector: (row) => row.Shipment_No,
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
      name: 'Customer Name',
      selector: (row) => row.Customer_Name,
      sortable: true,
      center: true,
    },

    {
      name: 'Contractor',
      selector: (row) => row.Contractor_Name,
      sortable: true,
      center: true,
    },
    {
      name: 'Net Qty',
      selector: (row) => row.Delivery_Net_qty,
      sortable: true,
      center: true,
    },
    {
      name: 'Gross Qty',
      selector: (row) => row.Shipment_Qty,
      sortable: true,
      center: true,
    },
    {
      name: 'Approved Freight',
      selector: (row) => row.Shipment_LP_Freight,
      sortable: true,
      center: true,
    },
    {
      name: 'Secondary Freight',
      selector: (row) => row.Shipment_SAP_Sec_Freight,
      sortable: true,
      center: true,
    },
    {
      name: 'Difference Amount',
      selector: (row) => row.ACTUAL_VS_SAP,
      sortable: true,
      center: true,
    },
    {
      name: 'Initial Shipment',
      selector: (row) => row.Initial_Shipment,
      sortable: true,
      center: true,
    },
    {
      name: 'Final Shipment',
      selector: (row) => row.Final_Shipment,
      sortable: true,
      center: true,
    },
    {
      name: 'Freight Type',
      selector: (row) => row.Freight_type,
      sortable: true,
      center: true,
    },
    {
      name: 'POD Copy',
      selector: (row) => row.Delivery_Pod_Copy,
      // sortable: true,
      center: true,
    },
    {
      name: 'Del.Status',
      selector: (row) => row.Delivery_Status,
      sortable: true,
      center: true,
    },
    {
      name: 'Created By',
      selector: (row) => row.CreatedBy,
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

              {/* <CCol xs={12} md={3}>
                <CFormLabel htmlFor="VNum">Vehicle Number</CFormLabel>
                <SearchSelectComponent
                  size="sm"
                  className="mb-2"
                  onChange={(e) => {
                    onChangeFilter(e, 'vehicle_no')
                  }}
                  label="Select Vehicle Number"
                  noOptionsMessage="Vehicle Not found"
                  search_type="depo_shipment_report_vehicle_number"
                  search_data={searchFilterData}
                />
              </CCol> */}

              <CCol xs={12} md={3}>
                <CFormLabel htmlFor="VNum">Shipment Number</CFormLabel>
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
              </CCol>

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
                  search_type="depo_shipment_report_tripsheet_number"
                  search_data={searchFilterData}
                />
              </CCol>

              {/* <CCol xs={12} md={3}>
                <CFormLabel htmlFor="VNum">Shipment Status</CFormLabel>
                <SearchSelectComponent
                  size="sm"
                  className="mb-2"
                  onChange={(e) => {
                    onChangeFilter(e, 'shipment_status')
                  }}
                  label="Select Shipment Status"
                  noOptionsMessage="Status Not found"
                  search_type="depo_shipment_report_shipment_status"
                  search_data={searchFilterData}
                />
              </CCol> */}
              {/* <CCol xs={12} md={3}>
                <CFormLabel htmlFor="VNum">Delivery Status</CFormLabel>
                <SearchSelectComponent
                  size="sm"
                  className="mb-2"
                  onChange={(e) => {
                    onChangeFilter(e, 'delivery_status')
                  }}
                  label="Select Delivery Status"
                  noOptionsMessage="Status Not found"
                  search_type="depo_delivery_report_delivery_status"
                  search_data={searchFilterData}
                />
              </CCol> */}
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
                    setFetch(false)
                    loadTripShipmentReport('1')
                  }}
                >
                  Filter
                </CButton>
                <CButton
                  size="sm"
                  color="warning"
                  className="mx-3 px-3 text-white"
                  onClick={(e) => {
                    // loadVehicleReadyToTripForExportCSV()
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
           </CCard> ) : ( <AccessDeniedComponent />
          )}
        </>
      )}
      {/* Error Modal Section */}
      <CModal visible={errorModal} onClose={() => setErrorModal(false)}>
        <CModalHeader>
          <CModalTitle className="h4">Trip STO Confirmation</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CRow>
            <CCol>
              <CAlert color="danger" data-aos="fade-down">
                {'Are You Sure to Want to go Trip STO ?'}
              </CAlert>
            </CCol>
          </CRow>
        </CModalBody>
        <CModalFooter>
          <CButton
            color="primary"
            onClick={() => {
              setFetch(false)
              setErrorModal(false)
              assignTripSTO(vehicleSto)
            }}
          >
            Yes
          </CButton>
          <CButton onClick={() => setErrorModal(false)} color="primary">
            <Link to=""> No </Link>
          </CButton>
        </CModalFooter>
      </CModal>
      {/* Error Modal Section */}
    </>
  )
}

export default DepoDeliveryReport
