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
  CCardImage,
} from '@coreui/react'
import VehicleAssignmentService from 'src/Service/VehicleAssignment/VehicleAssignmentService'
import { Link, useNavigate } from 'react-router-dom'
import CustomTable from 'src/components/customComponent/CustomTable'
import TripStoService from 'src/Service/TripSTO/TripStoService'
import { ToastContainer, toast } from 'react-toastify'
import Loader from 'src/components/Loader'
import { DateRangePicker } from 'rsuite'
import TripSheetFilterComponent from '../TripSheetReports/TripSheetFilterComponent/TripSheetFilterComponent'
import SearchSelectComponent from 'src/components/commoncomponent/searchSelectComponent'
import ReportService from 'src/Service/Report/ReportService'
import * as XLSX from 'xlsx';
import FileSaver from 'file-saver'

import AccessDeniedComponent from 'src/components/commoncomponent/AccessDeniedComponent'
import JavascriptInArrayComponent from 'src/components/commoncomponent/JavascriptInArrayComponent'
import * as LogisticsProScreenNumberConstants from 'src/components/constants/LogisticsProScreenNumberConstants'
import CustomSpanButton3 from 'src/components/customComponent/CustomSpanButton3'

const sto_report = () => {
  const navigation = useNavigate()


    /*================== User Id & Location Fetch ======================*/
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
  let page_no = LogisticsProScreenNumberConstants.RMSTOModule.RM_STO_Report

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
    } else if (event_type == 'sto_type') {
      if (selected_value) {
        setreportSTOType(selected_value)
      } else {
        setreportSTOType(0)
      }
    } else if (event_type == 'from_location') {
      if (selected_value) {
        setreportSTOFromPlant(selected_value)
      } else {
        setreportSTOFromPlant(0)
      }
    }  else if (event_type == 'to_location') {
      if (selected_value) {
        setreportSTOToPlant(selected_value)
      } else {
        setreportSTOToPlant(0)
      }
    }
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
  const [reportSTOType, setreportSTOType] = useState(0)
  const [reportSTOFromPlant, setreportSTOFromPlant] = useState(0)
  const [reportSTOToPlant, setreportSTOToPlant] = useState(0)
  const [PODCopy, setPODCopy] = useState(false)
  const [PODCopySrc, setPODCopySrc] = useState('')

  const [vehicleSto, setVehicleSto] = useState('')

  let tableData = []
  let tableReportData = []

  const vehicleType = (id) => {
    if (id == 1) {
      return 'Own'
    } else if (id == 2) {
      return 'Contract'
    } else if (id == 3) {
      return 'Hire'
    } else {
      return 'Party Vehicle'
    }
  }

  const STOStatus = (id) => {
    if (id == 1) {
      return 'FG STO'
    } else if (id == 2) {
      return 'RM STO'
    } else if (id == 3) {
      return 'OTHERS'
    } else if (id == 4) {
      return 'FCI'
    }
  }

  let viewData

  function handleViewDocuments(e, id, type) {
    switch (type) {
      case 'POD_COPY':
        {
          let singleUserInfo = viewData.filter((data) => data.id == id)
          setPODCopySrc(singleUserInfo[0].pod_copy)
          setPODCopy(true)
        }
        break

      default:
        return 0
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

  const exportToCSV = () => {

  let fileName='STOReport'
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

      ReportService.getSTODataForReport().then((res) => {
        tableReportData = res.data.data
        viewData = res.data.data
        console.log(tableReportData)

        setFetch(true)
        let rowDataList = []
        let filterData = tableReportData
        // console.log(filterData)
        setSearchFilterData(filterData)
        filterData.map((data, index) => {
          rowDataList.push({
            sno: index + 1,
            Tripsheet_No: data.trip_sheet_info.trip_sheet_no,
            sto_delivery_no: data.sto_delivery_no,
            sto_po_no:data.sto_po_no,
            Vehicle_Type: data.parking_yard_info.vehicle_type_id.type,
            Vehicle_No: data.parking_yard_info.vehicle_number,
            Driver_Name: data.parking_yard_info.driver_name,
            Driver_Mobile_Number: data.parking_yard_info.driver_contact_number,
            STO_Qty: data.sto_delivery_quantity,
            freight_amount: data.freight_amount,
            STO_delivery_location:data.sto_delivery_division,
            from_location:data.from_location,
            to_location:data.to_location,
            income_base_charges:data.income_base_charges || '-',
            income_halting_charges:data.income_halting_charges || '-',
            income_low_tonage_charges:data.income_low_tonage_charges || '-',
            income_others_charges:data.income_others_charges || '-',
            income_sub_delivery_charges:data.income_sub_delivery_charges || '-',
            income_unloading_charges:data.income_unloading_charges || '-',
            income_weighment_chares:data.income_weighment_chares || '-',
            opening_km:data.opening_km || '-',
            closing_km:data.closing_km || '-',
            pod_copy: ( data.pod_copys != ''  ?
            <CustomSpanButton3
              handleViewDocuments={handleViewDocuments}
              Id={data.id}
              documentType={'POD_COPY'}
            /> :'-'
             ),
            // Shipment_Delivery_Count: data.shipment_child_info.length,
            STO_Status: STOStatus(data.sto_delivery_type),
            Remarks: data.remarks,
            Creation_Time: data.created_at,
            username:data.user_info?.emp_name
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
      report_form_data.append('sto_type', reportSTOType)
      report_form_data.append('from_location', reportSTOFromPlant)
      report_form_data.append('to_location', reportSTOToPlant)

      console.log(reportVehicle)
      console.log(reportTSNo)
      console.log(reportTSId)
      console.log(reportSTOType)
      console.log(reportSTOFromPlant)
      console.log(reportSTOToPlant)

      ReportService.sentSTODataForReport(report_form_data).then((res) => {
        console.log(res, 'res')
        tableReportData = res.data.data
        viewData = res.data.data
        console.log(tableReportData)

        setFetch(true)
        let rowDataList = []
        let filterData = tableReportData
        // console.log(filterData)
        setSearchFilterData(filterData)
        filterData.map((data, index) => {
          rowDataList.push({
            
            sno: index + 1,
            Tripsheet_No: data.trip_sheet_info.trip_sheet_no,
            sto_delivery_no: data.sto_delivery_no,
            sto_po_no:data.sto_po_no,
            Vehicle_Type: data.parking_yard_info.vehicle_type_id.type,
            Vehicle_No: data.parking_yard_info.vehicle_number,
            Driver_Name: data.parking_yard_info.driver_name,
            Driver_Mobile_Number: data.parking_yard_info.driver_contact_number,
            STO_Qty: data.sto_delivery_quantity,
            freight_amount: data.freight_amount,
            STO_delivery_location:data.sto_delivery_division,
            from_location:data.from_location,
            to_location:data.to_location,
            income_base_charges:data.income_base_charges || '-',
            income_halting_charges:data.income_halting_charges || '-',
            income_low_tonage_charges:data.income_low_tonage_charges || '-',
            income_others_charges:data.income_others_charges || '-',
            income_sub_delivery_charges:data.income_sub_delivery_charges || '-',
            income_unloading_charges:data.income_unloading_charges || '-',
            income_weighment_chares:data.income_weighment_chares || '-',
            opening_km:data.opening_km || '-',
            closing_km:data.closing_km || '-',
            pod_copy: ( data.pod_copys != ''  ?
              <CustomSpanButton3
                handleViewDocuments={handleViewDocuments}
                Id={data.id}
                documentType={'POD_COPY'}
              /> :'-'
            ),
            // Shipment_Delivery_Count: data.shipment_child_info.length,
            STO_Status: STOStatus(data.sto_delivery_type),
            Remarks: data.remarks,
            Creation_Time: data.created_at,
            username:data.user_info?.emp_name
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
      name: 'STO Delivery No',
      selector: (row) => row.sto_delivery_no,
      sortable: true,
      center: true,
    },
    {
      name: 'STO PO No',
      selector: (row) => row.sto_po_no,
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
      selector: (row) => row.STO_Qty,
      sortable: true,
      center: true,
    },
    {
      name: 'Freight Amount',
      selector: (row) => row.freight_amount,
      sortable: true,
      center: true,
    },
    {
      name: 'Delivery Location',
      selector: (row) => row.STO_delivery_location,
      sortable: true,
      center: true,
    },
    {
      name: 'From Location',
      selector: (row) => row.from_location,
      sortable: true,
      center: true,
    },
    {
      name: 'TO Location',
      selector: (row) => row.to_location,
      sortable: true,
      center: true,
    },
    {
      name: 'Income Base Charges',
      selector: (row) => row.income_base_charges,
      sortable: true,
      center: true,
    },
    {
      name: 'Income Halting Charges',
      selector: (row) => row.income_halting_charges,
      sortable: true,
      center: true,
    },
    {
      name: 'Income Low Ton Charges',
      selector: (row) => row.income_low_tonage_charges,
      sortable: true,
      center: true,
    },
    {
      name: 'Income Other Charges',
      selector: (row) => row.income_others_charges,
      sortable: true,
      center: true,
    },
    {
      name: 'Income Sub.Delivery Charges',
      selector: (row) => row.income_sub_delivery_charges,
      sortable: true,
      center: true,
    },
    {
      name: 'Income Unloading Charges',
      selector: (row) => row.income_unloading_charges,
      sortable: true,
      center: true,
    },
    {
      name: 'Income Weighment Charges',
      selector: (row) => row.income_weighment_chares,
      sortable: true,
      center: true,
    },
    {
      name: 'Income Weighment Charges',
      selector: (row) => row.income_weighment_chares,
      sortable: true,
      center: true,
    },
    {
      name: 'Opening KM',
      selector: (row) => row.opening_km,
      sortable: true,
      center: true,
    },
    {
      name: 'Closing KM',
      selector: (row) => row.closing_km,
      sortable: true,
      center: true,
    },
    {
      name: 'POD Copy',
      selector: (row) => row.pod_copy,
      sortable: true,
      center: true,
    },
    {
      name: 'STO Type',
      selector: (row) => row.STO_Status,
      sortable: true,
      center: true,
    },
    {
      name: 'Creation By',
      selector: (row) => row.username,
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
                <CFormLabel htmlFor="VNum">From Location</CFormLabel>
                <SearchSelectComponent
                  size="sm"
                  className="mb-2"
                  onChange={(e) => {
                    onChangeFilter(e, 'from_location')
                  }}
                  label="Select STO Type"
                  noOptionsMessage="Type Not found"
                  search_type="from_location"
                  search_data={searchFilterData}
                />
              </CCol>
              <CCol xs={12} md={3}>
                <CFormLabel htmlFor="VNum">To Location</CFormLabel>
                <SearchSelectComponent
                  size="sm"
                  className="mb-2"
                  onChange={(e) => {
                    onChangeFilter(e, 'to_location')
                  }}
                  label="Select STO Type"
                  noOptionsMessage="Type Not found"
                  search_type="to_location"
                  search_data={searchFilterData}
                />
              </CCol>
              <CCol xs={12} md={3}>
                <CFormLabel htmlFor="VNum">STO Type</CFormLabel>
                <SearchSelectComponent
                  size="sm"
                  className="mb-2"
                  onChange={(e) => {
                    onChangeFilter(e, 'sto_type')
                  }}
                  label="Select STO Type"
                  noOptionsMessage="Type Not found"
                  search_type="sto_type"
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
       </>
      ) : (<AccessDeniedComponent />)}
      </>
      )}
      <CModal visible={PODCopy} onClose={() => setPODCopy(false)} >
              <CModalHeader>
                <CModalTitle>POD Copy Photo</CModalTitle>
              </CModalHeader>
              <CModalBody>
                <CCardImage height ="500" orientation="top" src={PODCopySrc} />
              </CModalBody>
              <CModalFooter>
                <CButton color="secondary" onClick={() => setPODCopy(false)}>
                  Close
                </CButton>
              </CModalFooter>
     </CModal>
    </>
  )
}

export default sto_report
