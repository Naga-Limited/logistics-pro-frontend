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
import DivisionApi from 'src/Service/SubMaster/DivisionApi'

const OwnVehiclesOthersReport = () => {

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
    let page_no = LogisticsProScreenNumberConstants.VehicleUtilizationModule.OwnOthers_Report
  
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
    let fileName='OTHERS_Own_Vehicles_Utilization_Report_'+dateTimeString
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
  const [tripDivisionInfo, setTripDivisionInfo] = useState([])

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
    let vc_info = ''
    shipmentUserInfo.map((vk,kk)=>{
      if(vk.user_id === userid){
        vc_info = vk.emp_name 
      }
    })
    return vc_info
  }

  const tripDivisionFinder = (divid) => {
    console.log(divid,'tripDivisionFinder id')
    console.log(tripDivisionInfo,'tripDivisionFinder shipmentUserInfo')
    let vc_info = ''
    tripDivisionInfo.map((vk,kk)=>{
      if(vk.id === divid){
        vc_info = vk.division 
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

  const PURPOSE = ['','FG_SALES','FG_STO','RM_STO','OTHERS','FCI']

  const OTHERS_PROCESS_TYPE = ['','Purchase Order','Stock Transfer Order','Gate Pass']

  const stoJourneyTypeFinder = (data) => {
    let j_type = 'DEF'
    if(data.sto_delivery_type == '1'){
      j_type = 'FG-STO'
    } else if(data.sto_delivery_type == '4'){
      j_type = 'FCI'
    } else {
      if(data.rm_type == '2'){
        j_type = 'RAKE'
      } else {
        j_type = 'RM-STO'
      }
    }
    return j_type
  }

  const divisionFinder = (data) => {
    let div = 'NLFD'
    if(data.purpose == 3){
      div = 'NLFD'
    } else if(data.purpose == 2){
      if(data.to_divison == 2){
      div = 'NLCD'
    } else  {
        div = 'NLFD'
      } 
    } else if(data.purpose == 4){
      let ans = tripDivisionFinder(data.others_division)

      if(ans == 'Consumer Dindigul')
      {
        div = 'NLCD'
      } else if(ans == 'Minerals Dindigul') {
        div = 'NLMD'
      } else if(ans == 'Logistics Dindigul') {
        div = 'NLLD'
      } else if(ans == 'IFoods Dindigul') {
        div = 'NLIF'
      } else if(ans == 'Foods Dindigul' || ans == 'Foods Aruppukotai') {
        div = 'NLFD' 
      } else if(ans == 'Detergents Dindigul') {
        div = 'NLDV'
      } else {
        div = ans
      }

    } 
    return div
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

      VehicleUtilizationService.getOwnOthersVehilceUtilizationDataForReport().then((res) => {
        // tableReportData = res.data.data
        tableReportData = res.data ? JSON.parse(res.data) : []  
        console.log(tableReportData,'getOwnOthersVehilceUtilizationDataForReport')

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
            Trip_Purpose: PURPOSE[data.purpose],
            Division: divisionFinder(data),
            Others_Process: data.purpose == '4' ? OTHERS_PROCESS_TYPE[data.others_process] : '-',
            Delivery_No: data.sto_delivery_no, 
            Delivery_Type: stoJourneyTypeFinder(data), 
            Vehicle_No: data.vehicle_number,
            Driver_Name: data.driver_name,
            Driver_Mobile_Number: data.driver_contact_number,              
            Vehicle_Capacity:vehCapacityFinder(data.vehicle_capacity_id)+' TON', 
            Delivery_Qty: data.sto_delivery_quantity+' TON',
            Utility:utilityFinder(data.sto_delivery_quantity,data.vehicle_capacity_id), 
            Created_By:shipmentUserFinder(data.created_by),
            DO_Mapping_Date: dateFormatter(data.do_date)
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

      VehicleUtilizationService.sentOwnOthersVehilceUtilizationDataForReport(report_form_data).then((res) => {
        
        tableReportData = res.data ? JSON.parse(res.data) : []  
        console.log(tableReportData,'sentOwnOthersVehilceUtilizationDataForReport')

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
            Trip_Purpose: PURPOSE[data.purpose],
            Division: divisionFinder(data),
            Others_Process: data.purpose == '4' ? OTHERS_PROCESS_TYPE[data.others_process] : '-',
            Delivery_No: data.sto_delivery_no, 
            Delivery_Type: stoJourneyTypeFinder(data), 
            Vehicle_No: data.vehicle_number,
            Driver_Name: data.driver_name,
            Driver_Mobile_Number: data.driver_contact_number,              
            Vehicle_Capacity:vehCapacityFinder(data.vehicle_capacity_id)+' TON', 
            Delivery_Qty: data.sto_delivery_quantity+' TON',
            Utility:utilityFinder(data.sto_delivery_quantity,data.vehicle_capacity_id), 
            Created_By:shipmentUserFinder(data.created_by),
            DO_Mapping_Date: dateFormatter(data.do_date)
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
      DivisionApi.getDivision().then((res) => {
        setTripDivisionInfo(res.data.data)
      })
    // }

  }, [vehicleCapacityInfo.length == 0, shipmentUserInfo.length == 0, tripDivisionInfo.length == 0])
 

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
      name: 'TS Date',
      selector: (row) => row.Tripsheet_Date,
      sortable: true,
      center: true,
    },
    {
      name: 'Purpose',
      selector: (row) => row.Trip_Purpose,
      sortable: true,
      center: true,
    },
    {
      name: 'Division',
      selector: (row) => row.Division,
      sortable: true,
      center: true,
    },
    {
      name: 'Other Process',
      selector: (row) => row.Others_Process,
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
      name: 'Delivery No',
      selector: (row) => row.Delivery_No,
      sortable: true,
      center: true,
    }, 
    {
      name: 'Del. Type',
      selector: (row) => row.Delivery_Type,
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
      name: 'Delivery Qty',
      selector: (row) => row.Delivery_Qty,
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
      name: 'DO Map. Date',
      selector: (row) => row.DO_Mapping_Date,
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

export default OwnVehiclesOthersReport
