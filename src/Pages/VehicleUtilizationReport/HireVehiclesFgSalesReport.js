import React, { useState, useEffect } from 'react'
import {
  CButton,
  CCard,
  CRow,
  CCol, 
  CContainer, 
  CFormLabel,
} from '@coreui/react' 
import { Link, useNavigate } from 'react-router-dom'
import CustomTable from 'src/components/customComponent/CustomTable' 
import { toast } from 'react-toastify'
import Loader from 'src/components/Loader'
import { DateRangePicker } from 'rsuite' 
import FileSaver from 'file-saver'
import * as XLSX from 'xlsx';
import { GetDateTimeFormat } from '../Depo/CommonMethods/CommonMethods'

import { useRef } from 'react'
import { useReactToPrint } from 'react-to-print'
import AccessDeniedComponent from 'src/components/commoncomponent/AccessDeniedComponent'
import JavascriptInArrayComponent from 'src/components/commoncomponent/JavascriptInArrayComponent'
import * as LogisticsProScreenNumberConstants from 'src/components/constants/LogisticsProScreenNumberConstants'
import VehicleUtilizationService from 'src/Service/VehicleUtilization/VehicleUtilizationService'
import VehicleCapacityService from 'src/Service/SmallMaster/Vehicles/VehicleCapacityService'
import UserLoginMasterService from 'src/Service/Master/UserLoginMasterService'
import VUFilterComponent from './CommonComponent/VUFilterComponent'

const HireVehiclesFgSalesReport = () => {

  /*================== User Id & Location Fetch ======================*/
    const user_info_json = localStorage.getItem('user_info')
    const user_info = JSON.parse(user_info_json)
    const user_locations = []
    const navigation = useNavigate()
  
    console.log(user_info)
  
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
    let page_no = LogisticsProScreenNumberConstants.VehicleUtilizationModule.HireFGSales_Report
  
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
    if(rowData.length == 0){
      toast.warning('No Data Found to Export..!')
      return false
    }
    let dateTimeString = GetDateTimeFormat(1)
    let fileName='FGSALES_Hire_Vehicles_Utilization_Report_'+dateTimeString
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

  const [errorModal, setErrorModal] = useState(false)
  const [fetch, setFetch] = useState(false)

  const [pending, setPending] = useState(true)

  /* Report Variables */
  const [reportVehicle, setReportVehicle] = useState(0)
  const [reportTSNo, setReportTSNo] = useState(0)
  const [visible, setVisible] = useState(false)
  const [reportTSId, setReportTSId] = useState(0)
  const [reportShipmentNo, setReportShipmentNo] = useState(0)
  const [reportShipmentStatus, setReportShipmentStatus] = useState(0)

  const [vehicleCapacityInfo, setVehicleCapacityInfo] = useState([])
  const [shipmentUserInfo, setShipmentUserInfo] = useState([])

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
  const ddd = new Date(); 
  ddd.setMonth(ddd.getMonth() - 1);
  const [defaultDate, setDefaultDate] = React.useState([
    new Date(ddd),
    // new Date(getCurrentDate('-')),
    new Date(getCurrentDate('-')),
  ])

  useEffect(() => {
    console.log(defaultDate)
    if (defaultDate) {
      setDefaultDate(defaultDate)
    } else {
    }

  }, [defaultDate])

  const vehCapacityFinder = (vc) => {
    console.log(vc,'vehicleCapacityInfo id')
    console.log(vehicleCapacityInfo,'vehicleCapacityInfo')
    let vc_info = ''
    vehicleCapacityInfo.map((vk,kk)=>{
      if(vk.id === vc){
        vc_info = vk.capacity 
      }
    })
    return vc_info
  }

  const shipmentUserFinder = (userid) => {
    console.log(userid,'shipmentUserFinder id')
    console.log(shipmentUserInfo,'shipmentUserFinder shipmentUserInfo')
    let vc_info = userid == 1 ? 'Admin' : ''
    shipmentUserInfo.map((vk,kk)=>{
      if(vk.user_id === userid){
        vc_info = vk.emp_name 
      }
    })
    return vc_info
  }

  const dateFormatter = (dt) => {
    // const dt = "2024-07-06 10:51:06";
    const [datePart] = dt.split(" ");
    const [yyyy, mm, dd] = datePart.split("-");

    const output = `${dd}-${mm}-${yyyy}`;
    console.log(output); // 06-07-2024
    return output
  }

  const utilityFinder = (billedQty,vehQty) => {
    let vehicleCapacity = vehCapacityFinder(vehQty)

    if(vehicleCapacity){
      let utilityPercentage = Math.round((billedQty*100)/vehicleCapacity)
      return utilityPercentage+' %'
    } else {
      return '-'
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

      VehicleUtilizationService.getHireFgsalesVehilceUtilizationDataForReport().then((res) => {
        // tableReportData = res.data.data
        tableReportData = res.data ? JSON.parse(res.data) : []  
        console.log(tableReportData,'getHireFgsalesVehilceUtilizationDataForReport')

        // setFetch(true)
        let rowDataList = []
        let filterData = tableReportData.filter(
          (data) => user_locations.indexOf(data.vehicle_location_id) != -1  
        )
        // console.log(filterData)
        setSearchFilterData(filterData)
        filterData.map((data, index) => {
          rowDataList.push({
            sno: index + 1,
            Tripsheet_No: data.trip_sheet_no,
            Tripsheet_Date: dateFormatter(data.tripsheet_date),
            Division: data.division == 2 ? 'NLCD':'NLFD', 
            Shipment_No: data.shipment_no, 
            Vehicle_No: data.vehicle_number,
            Driver_Name: data.driver_name,
            Driver_Mobile_Number: data.driver_number,
            Shipment_Qty: data.shipment_net_qty, 
            Shipment_Delivery_Count: data.details_count,
            Vehicle_Capacity:vehCapacityFinder(data.vehicle_capacity_id)+' TON',
            Billed_Qty:data?.billed_net_qty+' TON',
            Utility:utilityFinder(data.billed_net_qty,data.vehicle_capacity_id), 
            Created_By:shipmentUserFinder(data.created_by),
            Shipment_Creation_Date: dateFormatter(data.shipment_date),
            Action: (
              <CButton
                className="text-white"
                color="warning"
                id={data.id}
                // disabled={data.status != 5}
                size="sm"
              >
                <span className="float-start">
                <Link to={`/${data.division == 2 ? 'ShipmentCreationNLCDReport' : 'ShipmentCreationNLFDReport'}/${data.shipment_id}||${data.parking_id}`} target='_blank'>
                  <i className="fa fa-eye" aria-hidden="true"></i> &nbsp;View
                </Link>
                </span>
              </CButton>
            ),
          })
        })
        // setFetch(true)
        setRowData(rowDataList)
        setPending(false)
      })
    } else {
      if (defaultDate == null) {
        setFetch(true)
        toast.warning('Date Filter Should not be empty..!')
        return false
      } 
      else if (
        defaultDate == null &&
        reportVehicle == 0 
      //   reportShipmentNo == 0 &&
      //   reportTSNo == 0 &&
      //   reportShipmentStatus == 0
      ) {
        toast.warning('Choose atleast one filter type..!')
        return false
      }
      let report_form_data = new FormData()
      report_form_data.append('date_between', defaultDate)
      report_form_data.append('vehicle_no', reportVehicle)
      // report_form_data.append('shipment_no', reportShipmentNo)
      // report_form_data.append('tripsheet_no', reportTSNo)
      // report_form_data.append('trip_sheet_id', reportTSId)
      // report_form_data.append('shipmant_status', reportShipmentStatus)
      // report_form_data.append('division', 1)
      console.log(defaultDate, 'defaultDate')
      console.log(reportVehicle, 'reportVehicle')
      // console.log(reportShipmentNo, 'reportShipmentNo')
      // console.log(reportTSNo, 'reportTSNo')
      // console.log(reportShipmentStatus, 'reportShipmentStatus')

      VehicleUtilizationService.sentHireFgsalesVehilceUtilizationDataForReport(report_form_data).then((res) => {
        
        tableReportData = res.data ? JSON.parse(res.data) : []  
        console.log(tableReportData,'getHireFgsalesVehilceUtilizationDataForReport')

        setFetch(true)
        let rowDataList = []
        let filterData = tableReportData.filter(
          (data) => user_locations.indexOf(data.vehicle_location_id) != -1
        )
        // console.log(filterData)
        setSearchFilterData(filterData)
        filterData.map((data, index) => {
          rowDataList.push({
            sno: index + 1,
            Tripsheet_No: data.trip_sheet_no,
            Tripsheet_Date: dateFormatter(data.tripsheet_date),
            Division: data.division == 2 ? 'NLCD':'NLFD', 
            Shipment_No: data.shipment_no, 
            Vehicle_No: data.vehicle_number,
            Driver_Name: data.driver_name,
            Driver_Mobile_Number: data.driver_number,
            Shipment_Qty: data.shipment_net_qty, 
            Shipment_Delivery_Count: data.details_count,
            Vehicle_Capacity:vehCapacityFinder(data.vehicle_capacity_id)+' TON',
            Billed_Qty:data?.billed_net_qty+' TON',
            Utility:utilityFinder(data.billed_net_qty,data.vehicle_capacity_id), 
            Created_By:shipmentUserFinder(data.created_by),
            Shipment_Creation_Date: dateFormatter(data.shipment_date),
            Action: (
              <CButton
                className="text-white"
                color="warning"
                id={data.id}
                // disabled={data.status != 5}
                size="sm"
              >
                <span className="float-start">
                <Link to={`/${data.division == 2 ? 'ShipmentCreationNLCDReport' : 'ShipmentCreationNLFDReport'}/${data.shipment_id}||${data.parking_id}`} target='_blank'>
                  <i className="fa fa-eye" aria-hidden="true"></i> &nbsp;View
                </Link>
                </span>
              </CButton>
            ),
          })
        })
        setRowData(rowDataList)
        setPending(false)
      })
    }
  }

  useEffect(() => { 

    // if(vehicleCapacityInfo.length == 0)
    // {
       loadTripShipmentReport()

      //section for getting vehicle capacity from database
      VehicleCapacityService.getVehicleCapacity().then((res) => { 
        setFetch(true)
        setVehicleCapacityInfo(res.data.data)
      })
      UserLoginMasterService.getUser().then((res) => {
        setShipmentUserInfo(res.data.data)
      })
    // }

  }, [vehicleCapacityInfo.length == 0, shipmentUserInfo.length == 0])
 

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
      name: 'Vehicle No',
      selector: (row) => row.Vehicle_No,
      sortable: true,
      center: true,
    },
    // {
    //   name: 'Driver Name',
    //   selector: (row) => row.Driver_Name,
    //   sortable: true,
    //   center: true,
    // },
    // {
    //   name: 'Driver Mobile Number',
    //   selector: (row) => row.Driver_Mobile_Number,
    //   sortable: true,
    //   center: true,
    // },
    {
      name: 'Shipment No',
      selector: (row) => row.Shipment_No,
      sortable: true,
      center: true,
    }, 
    {
      name: 'View',
      selector: (row) => row.Action,
      center: true,
    },
    // {
    //   name: 'Qty in MTS',
    //   selector: (row) => row.Shipment_Qty,
    //   sortable: true,
    //   center: true,
    // }, 
    {
      name: 'No.Of Delivery',
      selector: (row) => row.Shipment_Delivery_Count,
      sortable: true,
      center: true,
    },
    {
      name: 'Veh. Capacity',
      selector: (row) => row.Vehicle_Capacity,
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
      name: 'Utility',
      selector: (row) => row.Utility,
      sortable: true,
      center: true,
    }, 
    {
      name: 'Shipment Date',
      selector: (row) => row.Shipment_Creation_Date,
      sortable: true,
      center: true,
    }, 
    // {
    //   name: 'Created By',
    //   selector: (row) => row.Created_By,
    //   sortable: true,
    //   center: true,
    // }, 
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
                      <VUFilterComponent
                        size="sm"
                        className="mb-2"
                        onChange={(e) => {
                          onChangeFilter(e, 'vehicle_no')
                        }}
                        label="Select Vehicle Number"
                        noOptionsMessage="Vehicle Not found"
                        search_type="vehicle_number"
                        search_data={searchFilterData}
                      />
                    </CCol>

                    {/* <CCol xs={12} md={3}>
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
            </>) : (<AccessDeniedComponent />
          )}
        </>
      )}
    </>
  )
}

export default HireVehiclesFgSalesReport
