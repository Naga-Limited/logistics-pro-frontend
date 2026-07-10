import React, { useState, useEffect } from 'react'
import {
  CButton,
  CCard,
  CRow,
  CCol, 
  CContainer, 
  CFormLabel,
} from '@coreui/react'
import VehicleAssignmentService from 'src/Service/VehicleAssignment/VehicleAssignmentService'
import { Link } from 'react-router-dom'
import CustomTable from 'src/components/customComponent/CustomTable' 
import { toast } from 'react-toastify'
import Loader from 'src/components/Loader'
import { DateRangePicker } from 'rsuite' 
import SearchSelectComponent from 'src/components/commoncomponent/searchSelectComponent'
import FileSaver from 'file-saver'
import * as XLSX from 'xlsx';
import { getCurrentDateTime, GetDateTimeFormat } from '../Depo/CommonMethods/CommonMethods'

import { useRef } from 'react'
import { useReactToPrint } from 'react-to-print' 
import MobileOTP from 'src/Service/Advance/MobileOTP'

const ShipmentCreationNLFDReport = () => { 

  const user_info_json = localStorage.getItem('user_info')
  const user_info = JSON.parse(user_info_json)
  /* Get User Id From Local Storage */
  const user_id = user_info.user_id
  const is_admin = user_info.user_id == 1 && user_info.is_admin == 1
  console.log(is_admin,'is_admin')

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
    }
  }

  const exportToCSV = () => {
    console.log(rowData,'exportCsvData')
    let dateTimeString = GetDateTimeFormat(1)
    let fileName='NLFD_Shipment_Report_'+dateTimeString
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';
    const ws = XLSX.utils.json_to_sheet(rowData);
    const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], {type: fileType});
    FileSaver.saveAs(data, fileName + fileExtension);
  }

  const [rowData, setRowData] = useState([])
  const [searchFilterData, setSearchFilterData] = useState([]) 
  const [fetch, setFetch] = useState(false)

  const [pending, setPending] = useState(true)

  /* Report Variables */
  const [reportVehicle, setReportVehicle] = useState(0)
  const [reportTSNo, setReportTSNo] = useState(0) 
  const [reportTSId, setReportTSId] = useState(0)
  const [reportShipmentNo, setReportShipmentNo] = useState(0)
  const [reportShipmentStatus, setReportShipmentStatus] = useState(0)


  let tableData = []
  let tableReportData = []

  const vehicleType = (id, data) => {
    console.log(data,'vehicleType-data')
    if (id == 1) {
      return 'Own'
    } else if (id == 2) {
      return 'Contract'
    } else if (id == 3) {
      return 'Hire'
    } else {
      if(id == 4 && data.parking_yard_info && data.parking_yard_info.vehicle_others_type == '2'){
        return 'D2R Vehicle'
      } else {
        return 'Party Vehicle'
      }
    }
  }

  const shipmentStatus = (id) => {
    if (id == 1) {
      return 'Created'
    } else if (id == 2) {
      return 'Updated By User'
    } else if (id == 3) {
      return 'Updated By SAP'
    } else if (id == 4) {
      return 'Deleted'
    } else {
      return 'Completed'
    }
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

  const getOldLogInfo = (info) => {
    let data = [] 
    let temp = info ? JSON.parse(info) : []
    console.log(temp,'getOldLogInfo') 
    if(temp && Array.isArray(temp) && temp.length > 0){
      temp.map((vk,kk)=>{
        data[kk] = vk 
      }) 
    }
    console.log(data,'getOldLogInfo-data')
    return data
  }

  async function SMSgeneration(data) {
    console.log(data, 'SMSgeneration-shipment_child_data')

    const formData = new FormData()
    formData.append('shipment_id', data.shipment_id)

    console.log(formData,'SMSgeneration-formdata')

    let current_time = getCurrentDateTime() 

    let current_info = getOldLogInfo(data.sms_log_info)
    console.log(current_info,'SMSgeneration-old current_info')
    current_info.push({ 
      type: 2, // Manual Generation
      user: user_id,
      time: current_time 
    })
    console.log(current_info,'SMSgeneration-updated current_info')
    formData.append('log_info', JSON.stringify(current_info))
     
    setFetch(false)

    try {
      const tsRes = await MobileOTP.generateDriverPODAttachmentSms(formData)
      console.log("Vendor Response:", tsRes)
      setFetch(true)
      if (tsRes.status === 200) {        
        toast.success('SMS Send Successfully!')
      } else if(tsRes.status === 201){         
        toast.warning(tsRes.data.message)
      } else {
        toast.warning('Failed to send SMS..')
      }

    } catch (error) {
      console.error("Error:", error)
      setFetch(true)  
    }
  }

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

      VehicleAssignmentService.getShipmentDataForReport().then((res) => {
        tableReportData = res.data.data
        console.log(tableReportData)

        setFetch(true)
        let rowDataList = []
        let filterData = tableReportData.filter(
          (data) => user_locations.indexOf(data.vehicle_location_id) != -1 && data.assigned_by == 1
        )
        // console.log(filterData)
        setSearchFilterData(filterData)
        filterData.map((data, index) => {
          rowDataList.push({
            sno: index + 1,
            Tripsheet_No: data.trip_sheet_info.trip_sheet_no,
            Tripsheet_Date: data.trip_sheet_info.created_date,
            Shipment_No: data.shipment_no,
            Vehicle_Type: vehicleType(data.vehicle_type_id,data),
            Vehicle_No: data.vehicle_number,
            Driver_Name: data.driver_name,
            Driver_Mobile_Number: data.driver_number,
            Shipment_Qty: data.shipment_qty,
            Shipment_Freight: data.shipment_freight_amount,
            Shipment_Delivery_Count: data.shipment_child_info.length,
            Billed_Qty:data?.billed_qty,
            Shipment_Status: shipmentStatus(data.shipment_status),
            Remarks: data.remarks,
            Created_By:data.shipment_user_info?.emp_name,
            Creation_Time: data.created_at,
            Action: (
              <CButton
                className="text-white"
                color="warning"
                id={data.id} 
                size="sm"
              >
                <span className="float-start">
                <Link to={`${data.shipment_id}||${data.parking_id}`}>
                  <i className="fa fa-eye" aria-hidden="true"></i> &nbsp;View
                </Link>
                </span>
              </CButton>
            ),
            Sms: (
              <CButton
                className="text-white"
                color="success"
                id={data.shipment_id} 
                onClick={() => { 
                  SMSgeneration(data)
                }}
                size="sm"
              >
                <span className="float-start"> 
                  <i className="fa fa-mobile-phone" aria-hidden="true"></i> &nbsp;✔️
                </span>
              </CButton>
            ),
            Upload: (
              <>
                {(is_admin && !(data.vehicle_type_id == 2 || data.vehicle_type_id == 4)) ?
                    <CButton
                      className="text-white"
                      color="primary"
                      id={data.id}
                      style={{marginLeft:'5px'}}
                      // disabled={data.status != 5}
                      size="sm"
                    >
                      <span className="float-start">
                        <Link target='_blank' to={`/pod?pbh=${Number(data.shipment_id).toString(36)}`}> 
                          <i className="fa fa-file" aria-hidden="true"></i> &nbsp;Upload
                        </Link>
                      </span>
                    </CButton>
                : '-'}
              </>
            ),
          })
        })
        setFetch(true)
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
        reportShipmentStatus == 0
      ) {
        toast.warning('Choose atleast one filter type..!')
        return false
      }
      let report_form_data = new FormData()
      report_form_data.append('date_between', defaultDate)
      report_form_data.append('vehicle_no', reportVehicle)
      report_form_data.append('shipment_no', reportShipmentNo)
      report_form_data.append('tripsheet_no', reportTSNo)
      report_form_data.append('trip_sheet_id', reportTSId)
      report_form_data.append('shipmant_status', reportShipmentStatus)
      report_form_data.append('division', 1)
      console.log(defaultDate, 'defaultDate')
      console.log(reportVehicle, 'reportVehicle')
      console.log(reportShipmentNo, 'reportShipmentNo')
      console.log(reportTSNo, 'reportTSNo')
      console.log(reportShipmentStatus, 'reportShipmentStatus')

      VehicleAssignmentService.sentShipmentDataForReport(report_form_data).then((res) => {
        console.log(res, 'res')
        tableReportData = res.data.data
        console.log(tableReportData)

        setFetch(true)
        let rowDataList = []
        let filterData = tableReportData.filter(
          (data) => user_locations.indexOf(data.vehicle_location_id) != -1 && data.assigned_by == 1
        )
        // console.log(filterData)
        setSearchFilterData(filterData)
        filterData.map((data, index) => {
          rowDataList.push({
            sno: index + 1,
            Tripsheet_No: data.trip_sheet_info.trip_sheet_no,
            Tripsheet_Date: data.trip_sheet_info.created_date,
            Shipment_No: data.shipment_no,
            Vehicle_Type: vehicleType(data.vehicle_type_id,data),
            Vehicle_No: data.vehicle_number,
            Driver_Name: data.driver_name,
            Driver_Mobile_Number: data.driver_number,
            Shipment_Qty: data.shipment_qty,
            Shipment_Freight: data.shipment_freight_amount,
            Shipment_Delivery_Count: data.shipment_child_info.length,
            Billed_Qty:data?.billed_qty,
            Shipment_Status: shipmentStatus(data.shipment_status),
            Remarks: data.remarks,
            Created_By:data.shipment_user_info?.emp_name,
            Creation_Time: data.created_at,
            Action: (
              <CButton
                className="text-white"
                color="warning"
                id={data.id}
                // disabled={data.status != 5}
                size="sm"
              >
                <span className="float-start">
                <Link to={`${data.shipment_id}||${data.parking_id}`}>
                  <i className="fa fa-eye" aria-hidden="true"></i> &nbsp;View
                </Link>
                </span>
              </CButton>
            ),
            Sms: (
              <CButton
                className="text-white"
                color="success"
                id={data.shipment_id} 
                onClick={() => { 
                  SMSgeneration(data)
                }}
                size="sm"
              >
                <span className="float-start"> 
                  <i className="fa fa-mobile-phone" aria-hidden="true"></i> &nbsp;✔️
                </span>
              </CButton>
            ),
            Upload: (
              <>
                {(is_admin && !(data.vehicle_type_id == 2 || data.vehicle_type_id == 4)) ?
                    <CButton
                      className="text-white"
                      color="primary"
                      id={data.id}
                      style={{marginLeft:'5px'}}
                      // disabled={data.status != 5}
                      size="sm"
                    >
                      <span className="float-start">
                        <Link target='_blank' to={`/pod?pbh=${Number(data.shipment_id).toString(36)}`}> 
                          <i className="fa fa-file" aria-hidden="true"></i> &nbsp;Upload
                        </Link>
                      </span>
                    </CButton>
                : '-'}
              </>
            ),
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
      name: 'Shipment No',
      selector: (row) => row.Shipment_No,
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
      name: 'Qty in MTS',
      selector: (row) => row.Shipment_Qty,
      sortable: true,
      center: true,
    },
    {
      name: 'Freight Rate',
      selector: (row) => row.Shipment_Freight,
      sortable: true,
      center: true,
    },
    {
      name: 'No.Of Delivery',
      selector: (row) => row.Shipment_Delivery_Count,
      sortable: true,
      center: true,
    },
    {
      name: 'Billed Qty',
      selector: (row) => row.Billed_Qty,
      sortable: true,
      center: true,
    },
    {
      name: 'Status',
      selector: (row) => row.Shipment_Status,
      sortable: true,
      center: true,
    },
    {
      name: 'Remarks',
      selector: (row) => row.Remarks,
      // sortable: true,
      center: true,
    },
    {
      name: 'Creation Date',
      selector: (row) => row.Creation_Time,
      sortable: true,
      center: true,
    },
    {
      name: 'Action',
      selector: (row) => row.Action,
      center: true,
    },
    {
      name: 'Upload',
      selector: (row) => row.Upload,
      center: true,
    },
    {
      name: 'SMS',
      selector: (row) => row.Sms,
      center: true,
    }
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
                  search_type="shipment_report_vehicle_number"
                  search_data={searchFilterData}
                />
              </CCol>

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
                  search_type="shipment_report_tripsheet_number"
                  search_data={searchFilterData}
                />
              </CCol>

              <CCol xs={12} md={3}>
                <CFormLabel htmlFor="VNum">Shipment Status</CFormLabel>
                <SearchSelectComponent
                  size="sm"
                  className="mb-2"
                  onChange={(e) => {
                    onChangeFilter(e, 'shipment_status')
                  }}
                  label="Select Shipment Status"
                  noOptionsMessage="Status Not found"
                  search_type="shipment_report_shipment_status"
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
                    setFetch(false)
                    loadTripShipmentReport('1')
                  }}
                >
                  Filter
                </CButton>
                <CButton
                  size="lg-sm"
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
        </CCard>
      )}
    </>
  )
}

export default ShipmentCreationNLFDReport
