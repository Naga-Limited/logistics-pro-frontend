import React, { useState, useEffect } from 'react'
import {
  CButton,
  CCard,
  CRow,
  CCol, 
  CContainer, 
  CFormLabel,
} from '@coreui/react'  
import CustomTable from 'src/components/customComponent/CustomTable' 
import { toast } from 'react-toastify'
import Loader from 'src/components/Loader'
import { DateRangePicker } from 'rsuite' 
import FileSaver from 'file-saver'
import * as XLSX from 'xlsx';
import { GetDateTimeFormat } from '../Depo/CommonMethods/CommonMethods'
import * as LogisticsProScreenNumberConstants from 'src/components/constants/LogisticsProScreenNumberConstants'
import { useRef } from 'react'
import { useReactToPrint } from 'react-to-print'  
import JavascriptInArrayComponent from 'src/components/commoncomponent/JavascriptInArrayComponent'
import AccessDeniedComponent from 'src/components/commoncomponent/AccessDeniedComponent'
import OVTICSearchSelectComponent from './OVTICSearchSelectComponent'
import TripInfoCaptureService from 'src/Service/TripInfoCapture/TripInfoCaptureService'
import VehicleGroupService from 'src/Service/SmallMaster/Vehicles/VehicleGroupService' 

const OVTIReport = () => { 

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

  /* ==================== Access Part Start ========================*/
  const [screenAccess, setScreenAccess] = useState(false) 
  let page_no = LogisticsProScreenNumberConstants.DeliveryTrackModule.OVTIC_Report

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
    console.log(event_type, 'event_type')

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
    }
  }
  const [vehicleGroup, setVehicleGroup] = useState([])

  useEffect(() => {

    //section for getting vehicle group from database
    VehicleGroupService.getVehicleGroup().then((res) => {
      let vgdata = res.data.data
      console.log(vgdata,'vehicleGroupFinder-vgdata')
      setVehicleGroup(vgdata)
    })
  }, [])

  function autoCaps(str) {
    return str ? str.toUpperCase() : ''
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

  const vehicleGroupFinder = (id) => {
    let vg = '-'
    console.log(id,'vehicleGroupFinder-id')
    vehicleGroup.map((vv,kk)=>{
      // console.log(vv,'vehicleGroupFinder-vv')
      if(vv.id == id){
        vg = vv.vehicle_group	
      }
    })
    console.log(vg,'vehicleGroupFinder-vg')
    return vg
  }

  const getDateTime = (myDateTime, type=0) => {
    let myTime = '-'
    if(type == 1){
      myTime = new Date(myDateTime).toLocaleTimeString('en-US',{ hour: '2-digit', minute: '2-digit' });
    } else if(type == 2){
      myTime = new Date(myDateTime).toLocaleDateString('en-US',{ month: 'short', year: 'numeric' });
    } else if(type == 3){
      myTime = new Date(myDateTime).toLocaleTimeString('en-US',{ hour12: false, hour: '2-digit', minute: '2-digit' });
    } else {
      myTime = new Date(myDateTime).toLocaleString('en-US');
    }
    
    return myTime
  }

  const exportToCSV = () => {
    if(rowData.length == 0){
      toast.warning('No Data Found..!')
      return false
    }
    console.log(rowData,'exportCsvData')
    let dateTimeString = GetDateTimeFormat(1)
    let fileName='NAGA_Trip_Info_Capture_Report_'+dateTimeString
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
  let tableReportData = []

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

  const ovticdiffTime=(start, end)=> {

    if(start == '0000-00-00 00:00:00' || end == '0000-00-00 00:00:00'){
      return '-'
    }

    let st = new Date(start)
    let et = new Date(end)
    console.log(start,'ovticdiffTime-start')
    console.log(end,'ovticdiffTime-end')

    const diffInMs = Math.abs(et-st); // difference in milliseconds
    const diffInSeconds = Math.floor(diffInMs / 1000);

    const hours = String(Math.floor(diffInSeconds / 3600)).padStart(2, '0');
    const minutes = String(Math.floor((diffInSeconds % 3600) / 60)).padStart(2, '0');
    const seconds = String(diffInSeconds % 60).padStart(2, '0');

    const result = `${hours}:${minutes}:${seconds}`;
     
    console.log(result,'ovticdiffTime-result')
    return result

  }

  const eDieselFinder = (data) => {
    let td = 0

    console.log(data,'diesel-data')
    data.map((vv,kk)=>{
      td = Number(parseFloat(td).toFixed(2)) + Number(parseFloat(vv.di_enr_qty).toFixed(2)) 
    })
    return Number(parseFloat(td).toFixed(2))
  }

  const totDieselFinder = (vv) => {

    let v1 = eDieselFinder(vv.tic_child2_info) /* Enroute Diesel */
    let v2 = vv.di_status > 1 ? vv.di_rns_qty : 0 /* RNS Diesel */

    return Number(parseFloat(v1).toFixed(2)) + Number(parseFloat(v2).toFixed(2)) 
  }

  const mileageFinder = (vv) => {

    let total_diesel = totDieselFinder(vv) 

    let startkm = vv.opening_km
    let endkm = vv.closing_km

    let tripkm = 0

    let ans = '-'

    if(startkm && Number(startkm) > 0 && endkm && Number(endkm) > 0){
      tripkm = Number(endkm) - Number(startkm)
    }  

    if(tripkm != 0){
      ans = Number(parseFloat(tripkm).toFixed(2)) / Number(parseFloat(total_diesel).toFixed(2)) 
      return Number(parseFloat(ans).toFixed(2))
    }    

    return ans
  }

  const tic_child_status_array = ['','Created','Updated']
  const tic_parent_status_array = ['','Created','Updated','Settlement Completed','','','Completed','Closed']

  const divarray = ['','NLFD','MMD','NLDV','NLMD','NLLD','NLCD','NLIF','NLSD'] 

  const divisionFinder = (data,divison) => {
    let div = '111'
    console.log(data,'divisionFinder-data')
    console.log(divison,'divisionFinder-divison')

    if(data.child_type == 2){
      div = 'NLFD'
    } else if(data.child_type == 1 || data.child_type == 3 ){
      div = (divison == 2 ? 'NLCD' : 'NLFD')
    } else if(data.child_type == 4){
      div = divarray[divison]
    }  
    return div
  }

  const totalKMFinder = (a,b,c,d) => { 
    let km1 = Number.isInteger(Number(a)) ? Number(a) : 0
    let km2 = Number.isInteger(Number(b)) ? Number(b) : 0
    let km3 = Number.isInteger(Number(c)) ? Number(c) : 0
    let km4 = Number.isInteger(Number(d)) ? Number(d) : 0
    console.log('totalKMFinder : FJ Empty = > ',km1,', Start = > ',km2,', End = > ',km3,', To Empty = > ',km4)
    let tk = km1+km2+km3+km4
    let totalkm = Number(parseFloat(tk).toFixed(2))
    console.log(totalkm,'totalKMFinder-totalkm')
    return totalkm
  }

  const totalTripCountFinder = (data) => {
    let trip_count = 0
    console.log(data,'totalTripCountFinder-data')
    data.map((vv,kk)=>{
      console.log(vv.child_type,'totalTripCountFinder-vv.child_type',kk)
      if(vv.child_type == 4){
        trip_count = trip_count + Number(vv.rmo_count)
      } else {
        trip_count = trip_count + 1
      }
    })
    console.log(trip_count,'totalTripCountFinder-trip_count')
    return Number(trip_count)
  }

  function parseDate(dateStr) {
    const [day, month, year] = dateStr.split('/').map(Number);
    return new Date(year, month - 1, day); // month is 0-indexed
  }

  function diffInDays(dateStr1, dateStr2) {
    const date1 = parseDate(dateStr1);
    const date2 = parseDate(dateStr2);

    const diffMs = date2 - date1;
    const diffDays = diffMs / (1000 * 60 * 60 * 24);

    return Math.floor(diffDays); // or Math.abs(diffDays) if you want positive number only
  }

  const durationDays = ($t1,$t2) => {
    const daysBetween = diffInDays($t2, $t1);
    console.log(`${daysBetween} days`);
    return daysBetween
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

    return [day, month, year].join('/');
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

    const TripTypyeFinder = (val1,val2) => {

      let type = ''
      const movement_type = ['','RMSTO','RAKE','OTHERS','FCI']
      if(val1 == 1){
        type = 'FG_SALES'
      } else if(val1 == 2){
        type = 'RJSO'
      } else if(val1 == 3){
        type = 'FG_STO'
      } else if(val1 == 4){
        type = movement_type[val2]
      }  

      return type

    }

    if (fresh_type !== '1') { 

      TripInfoCaptureService.getTICInfoForReport().then((response) => {  
        tableReportData = response.data.data
        setSearchFilterData(tableReportData)
        let rowDataList = [] 
        let ind = 0
        console.log(tableReportData,'tableReportData1') 
        tableReportData.map((vv,kk)=>{
          
          let tableReportData1 = vv.tic_child1_info 
          let rkm = 0
          let tkm = 0
          tableReportData1.map((data, index) => {
            ind++
            
            rowDataList.push({
              sno : ind,  
              // Created_On : vv.trip_sheet_info.created_date,
              Entry_date : vv.created_date, 
              TS_Month : getDateTime(vv.trip_sheet_info.created_at,2), 
              Yard_In_TIME : `${formatDate(vv.pyg_info.gate_in_date_time_org)} ${getDateTime(vv.pyg_info.gate_in_date_time_org,3)}`,
              Tripsheet_No : vv.ts_no, 
              TS_Time : `${formatDate(vv.trip_sheet_info.created_at)} ${getDateTime(vv.trip_sheet_info.created_at,3)}`, 
              Yard_Out_Time	: `${formatDate(vv.pyg_info.gate_in_date_time_org)} ${getDateTime(vv.pyg_info.gate_out_date_time_org,3)}`,
              Freight_Order	: data.document_no ? data.document_no: '-',
              Trip_Type	: TripTypyeFinder(data.child_type,data.document_type),
              Trip_Count : data.child_type == 4 ? data.rmo_count : 1,
              Trip_Category	: data.journey_type==2 ? 'RJ': 'FJ',
              Vehicle_No : vv.veh_no,
              Vehicle_Group	: vehicleGroupFinder(vv.vehicle_info.vehicle_group_id),
              Vehicle_Capacity : vv.veh_capacity ? `${vv.veh_capacity}`: '-',
              Vendor_code	: vv.driver_info.driver_code,
              Driver_Name	: autoCaps(vv.driver_name),
              Division : divisionFinder(data,data.division),
              Qty_MT	: data.qty ? data.qty : '-', 
              // Trip_Month : getDateTime(vv.trip_sheet_info.created_at,2), 
              Trip_Month : data.start_time == '0000-00-00 00:00:00' ? '-' : `${getDateTime(data.start_time,2)}`,
              Trip_Start_Time : data.start_time == '0000-00-00 00:00:00' ? '-' : `${formatDate(data.start_time)} ${getDateTime(data.start_time,3)}`,
              // Trip_Start_Time	: data.start_time, 
              Trip_End_Time : data.end_time == '0000-00-00 00:00:00' ? '-' : `${formatDate(data.end_time)} ${getDateTime(data.end_time,3)}`,
              // Trip_End_Time	: data.end_time,
              Trip_Hours	: ovticdiffTime(data.start_time,data.end_time),
              From_Location	: data.from_empty_place ? autoCaps(data.from_empty_place) : '-',
              Odometer_KM1	: data.from_empty_km ? data.from_empty_km : '-',
              Loaded_Location	: autoCaps(data.from_place),
              Odometer_KM2	: data.opening_km,
              Unloaded_Location	: autoCaps(data.to_place),
              Odometer_KM3	: data.closing_km,
              To_Location_Empty_run	: data.to_empty_place ? autoCaps(data.to_empty_place) : '-',
              Odometer_KM4	: data.to_empty_km ? data.to_empty_km : '-',
              FJ_EMPTY	:  kmDifference(data.opening_km,data.from_empty_km),
              FJ_KM	: data.child_type != 2 ? kmDifference(data.closing_km,data.opening_km) : '-',
              RJ_KM	: data.child_type == 2 ? kmDifference(data.closing_km,data.opening_km): '-',
              RJ_EMPTY : kmDifference(data.to_empty_km,data.closing_km),
              // TOT_KM : data.running_km ? data.running_km: '-',
              // TOT_KM : totalKMFinder(kmDifference(data.opening_km,data.from_empty_km),kmDifference(data.closing_km,data.opening_km),data.child_type == 2 ? kmDifference(data.closing_km,data.opening_km): 0,kmDifference(data.to_empty_km,data.closing_km)),
              TOT_KM : totalKMFinder(kmDifference(data.opening_km,data.from_empty_km),kmDifference(data.closing_km,data.opening_km),0,kmDifference(data.to_empty_km,data.closing_km)),
              En_route_diesel	: '',
              Home_Diesel : '',
              Total_Diesel : '-',
              Mileage : '-',
              Indent_No_APK	: '-',
              Bill_No	: '-',
              Indent_No_DGL	: '-',
              Bill_No	: '-',
              RJ_Cust_Code : data.rj_customer_code ? data.rj_customer_code: '-',
              RJ_Customer_Name : data.rj_customer_name ? data.rj_customer_name: '-',
              RJ_Amount : data.freight ? data.freight: '-',             
              Truck_work_km	: '-',
              Company_return_load	: '-',
              Mileage_shortage 	: '-',
              Remarks : data.remarks,
              Status : tic_child_status_array[data.status],
              Final_Status : '-',
              Completed_Date : '-',
              Home_Diesel_Indent_Date : '-',
              Duration_Days : '-',
            })
            rkm = Number(rkm) + Number(data.running_km)
            tkm = Number(vv.closing_km) - Number(vv.opening_km)
            if(tableReportData1.length == index+1){
              rowDataList.push({
                sno : '-',  
                Entry_date : 'Total Diesel',
                TS_Month : getDateTime(vv.trip_sheet_info.created_at,2), 
                Yard_In_TIME : '-',
                Tripsheet_No : vv.ts_no, 
                TS_Time : '-',
                Yard_Out_Time	: '-',
                Freight_Order	: '-',
                Trip_Type	: '-',
                Trip_Count : totalTripCountFinder(vv.tic_child1_info),
                Trip_Category	: '-',
                Vehicle_No : vv.veh_no,
                Vehicle_Group	: '-',
                Vehicle_Capacity	: vv.veh_capacity ? `${vv.veh_capacity}`: '-',
                Vendor_code	: '-',
                Driver_Name	: '-',
                Division	: '-',
                Qty_MT	: '-', 
                Trip_Month	: '-', 
                Trip_Start_Time	: '-', 
                Trip_End_Time	: '-',
                Trip_Hours	: '-',
                From_Location	: '-',
                Odometer_KM1	: vv.opening_km ? vv.opening_km : '-',
                Loaded_Location	: '-',
                Odometer_KM2	: '-',
                Unloaded_Location	: '-',
                Odometer_KM3	: '-',
                To_Location_Empty_run	: '-',
                Odometer_KM4	: vv.closing_km ? vv.closing_km : '-',
                FJ_EMPTY	: '-',
                FJ_KM	: '-',
                RJ_KM	: '-',
                RJ_EMPTY	: '-', 
                TOT_KM	: tkm > 0 ? tkm : '-',
                En_route_diesel	: eDieselFinder(vv.tic_child2_info),
                Home_Diesel	: vv.di_status > 1 ? vv.di_rns_qty : 0, 
                Total_Diesel : totDieselFinder(vv),
                Mileage	: mileageFinder(vv),
                Indent_No_APK	: '-',
                Bill_No	: '-',
                Indent_No_DGL	: '-',
                Bill_No	: '-',
                RJ_Cust_Code	: '-',
                RJ_Customer_Name : '-',
                RJ_Amount : '-', 
                Truck_work_km	: vv.truck_work_km,
                Company_return_load	: vv.company_return_load,
                Mileage_shortage 	: vv.mileage_shortage,
                Remarks : vv.remarks,
                Status : tic_parent_status_array[vv.status],
                Final_Status : vv.status == 6 ? 'Completed' : '-',
                Completed_Date : vv.status == 6 ? formatDate(vv.updated_at) : '-',
                Home_Diesel_Indent_Date :vv.di_info ? formatDate(vv.di_info.di_creation_time)	: '-',
                Duration_Days : vv.status == 6 && vv.di_info ? durationDays(formatDate(vv.updated_at),formatDate(vv.di_info.di_creation_time)) : '-',
              })
            }
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
        reportTSNo == 0 
      ) {
        toast.warning('Choose atleast one filter type..!')
        return false
      }
      let report_form_data = new FormData()
      report_form_data.append('date_between', defaultDate)
      report_form_data.append('vehicle_no', reportVehicle) 
      report_form_data.append('tripsheet_no', reportTSNo) 
      console.log(defaultDate, 'defaultDate')
      console.log(reportVehicle, 'reportVehicle') 
      console.log(reportTSNo, 'reportTSNo')  
      // return false
      setFetch(false)
      TripInfoCaptureService.sentTICInfoForReport(report_form_data).then((res) => {
        console.log(res, 'res')
        tableReportData = res.data.data
        console.log(tableReportData,'tableReportData2')
        setSearchFilterData(tableReportData,'sentDTInfoForReport')
        setFetch(true)
        let ind = 0
        let rowDataList = []
        tableReportData.map((vv,kk)=>{
          
          let tableReportData1 = vv.tic_child1_info 
          let rkm = 0
          let tkm = 0
          tableReportData1.map((data, index) => {
            ind++ 
            rowDataList.push({
              sno : ind,  
              // Created_On : vv.trip_sheet_info.created_date,
              Entry_date : vv.created_date, 
              TS_Month : getDateTime(vv.trip_sheet_info.created_at,2), 
              Yard_In_TIME : `${formatDate(vv.pyg_info.gate_in_date_time_org)} ${getDateTime(vv.pyg_info.gate_in_date_time_org,3)}`,
              Tripsheet_No : vv.ts_no, 
              TS_Time : `${formatDate(vv.trip_sheet_info.created_at)} ${getDateTime(vv.trip_sheet_info.created_at,3)}`, 
              Yard_Out_Time	: `${formatDate(vv.pyg_info.gate_in_date_time_org)} ${getDateTime(vv.pyg_info.gate_out_date_time_org,3)}`,             
              Freight_Order	: data.document_no ? data.document_no: '-',
              Trip_Type	: TripTypyeFinder(data.child_type,data.document_type),
              Trip_Count : data.child_type == 4 ? data.rmo_count : 1,
              Trip_Category	: data.journey_type==2 ? 'RJ': 'FJ',
              Vehicle_No : vv.veh_no,
              Vehicle_Group	: vehicleGroupFinder(vv.vehicle_info.vehicle_group_id),
              Vehicle_Capacity : vv.veh_capacity ? `${vv.veh_capacity}`: '-',
              Vendor_code	: vv.driver_info.driver_code,
              Driver_Name	: autoCaps(vv.driver_name),
              Division : divisionFinder(data,data.division),
              Qty_MT	: data.qty ? data.qty : '-', 
              // Trip_Month : getDateTime(vv.trip_sheet_info.created_at,2), 
              Trip_Month : data.start_time == '0000-00-00 00:00:00' ? '-' : `${getDateTime(data.start_time,2)}`,
              Trip_Start_Time : data.start_time == '0000-00-00 00:00:00' ? '-' : `${formatDate(data.start_time)} ${getDateTime(data.start_time,3)}`,
              // Trip_Start_Time	: data.start_time, 
              Trip_End_Time : data.end_time == '0000-00-00 00:00:00' ? '-' : `${formatDate(data.end_time)} ${getDateTime(data.end_time,3)}`,
              // Trip_End_Time	: data.end_time,
              Trip_Hours	: ovticdiffTime(data.start_time,data.end_time),
              From_Location	: data.from_empty_place ? autoCaps(data.from_empty_place) : '-',
              Odometer_KM1	: data.from_empty_km ? data.from_empty_km : '-',
              Loaded_Location	: autoCaps(data.from_place),
              Odometer_KM2	: data.opening_km,
              Unloaded_Location	: autoCaps(data.to_place),
              Odometer_KM3	: data.closing_km,
              To_Location_Empty_run	: data.to_empty_place ? autoCaps(data.to_empty_place) : '-',
              Odometer_KM4	: data.to_empty_km ? data.to_empty_km : '-',
              FJ_EMPTY	:  kmDifference(data.opening_km,data.from_empty_km),
              FJ_KM	: data.child_type != 2 ? kmDifference(data.closing_km,data.opening_km) : '-',
              RJ_KM	: data.child_type == 2 ? kmDifference(data.closing_km,data.opening_km): '-',
              RJ_EMPTY : kmDifference(data.to_empty_km,data.closing_km),
              // TOT_KM : data.running_km ? data.running_km: '-',
              // TOT_KM : totalKMFinder(kmDifference(data.opening_km,data.from_empty_km),kmDifference(data.closing_km,data.opening_km),data.child_type == 2 ? kmDifference(data.closing_km,data.opening_km): 0,kmDifference(data.to_empty_km,data.closing_km)),
              TOT_KM : totalKMFinder(kmDifference(data.opening_km,data.from_empty_km),kmDifference(data.closing_km,data.opening_km),0,kmDifference(data.to_empty_km,data.closing_km)),
              En_route_diesel	: '',
              Home_Diesel : '',
              Total_Diesel : '-',
              Mileage : '-',
              Indent_No_APK	: '-',
              Bill_No	: '-',
              Indent_No_DGL	: '-',
              Bill_No	: '-',
              RJ_Cust_Code : data.rj_customer_code ? data.rj_customer_code: '-',
              RJ_Customer_Name : data.rj_customer_name ? data.rj_customer_name: '-',
              RJ_Amount : data.freight ? data.freight: '-', 
              Truck_work_km	: '-',
              Company_return_load	: '-',
              Mileage_shortage 	: '-',
              Remarks : data.remarks,
              Status : tic_child_status_array[data.status],
              Final_Status : '-',
              Completed_Date : '-',
              Home_Diesel_Indent_Date : '-',
              Duration_Days : '-',
            })
            rkm = Number(rkm) + Number(data.running_km)
            tkm = Number(vv.closing_km) - Number(vv.opening_km)
            if(tableReportData1.length == index+1){
              rowDataList.push({
                sno : '-',  
                Entry_date : 'Total Diesel',
                TS_Month : getDateTime(vv.trip_sheet_info.created_at,2), 
                Yard_In_TIME : '-',
                Tripsheet_No : vv.ts_no, 
                TS_Time : '-',
                Yard_Out_Time	: '-',
                Freight_Order	: '-',
                Trip_Type	: '-',
                Trip_Count : totalTripCountFinder(vv.tic_child1_info),
                Trip_Category	: '-',
                Vehicle_No : vv.veh_no,
                Vehicle_Group	: '-',
                Vehicle_Capacity : vv.veh_capacity ? `${vv.veh_capacity}`: '-',
                Vendor_code	: '-',
                Driver_Name	: '-',
                Division	: '-',
                Qty_MT	: '-', 
                Trip_Month : '-',
                Trip_Start_Time	: '-', 
                Trip_End_Time	: '-',
                Trip_Hours	: '-',
                From_Location	: '-',
                Odometer_KM1	: vv.opening_km ? vv.opening_km : '-',
                Loaded_Location	: '-',
                Odometer_KM2	: '-',
                Unloaded_Location	: '-',
                Odometer_KM3	: '-',
                To_Location_Empty_run	: '-',
                Odometer_KM4	: vv.closing_km ? vv.closing_km : '-',
                FJ_EMPTY	: '-',
                FJ_KM	: '-',
                RJ_KM	: '-',
                RJ_EMPTY	: '-', 
                TOT_KM	: tkm > 0 ? tkm : '-',
                En_route_diesel	: eDieselFinder(vv.tic_child2_info),
                Home_Diesel	: vv.di_status > 1 ? vv.di_rns_qty : 0, 
                Total_Diesel : totDieselFinder(vv),
                Mileage	: mileageFinder(vv),
                Indent_No_APK	: '-',
                Bill_No	: '-',
                Indent_No_DGL	: '-',
                Bill_No	: '-',
                RJ_Cust_Code	: '-',
                RJ_Customer_Name : '-',
                RJ_Amount : '-', 
                Truck_work_km	: vv.truck_work_km,
                Company_return_load	: vv.company_return_load,
                Mileage_shortage 	: vv.mileage_shortage,
                Remarks : vv.remarks,
                Status	: tic_parent_status_array[vv.status],
                Final_Status : vv.status == 6 ? 'Completed' : '-',
                Completed_Date : vv.status == 6 ? formatDate(vv.updated_at) : '-',
                Home_Diesel_Indent_Date :vv.di_info ? formatDate(vv.di_info.di_creation_time)	: '-',
                Duration_Days : vv.status == 6 && vv.di_info ? durationDays(formatDate(vv.updated_at),formatDate(vv.di_info.di_creation_time)) : '-',
              })
            }
          })

        })
        setFetch(true)
        setRowData(rowDataList)
        setPending(false)
      })
    }
  }

  const kmDifference = (v1,v2) => {
    let ans = 0
    ans = Number(v1) - Number(v2)
    return ans
  }
 
  useEffect(() => {
    loadTripShipmentReport()
  }, [vehicleGroup])

 
  // ============ Column Header Data =======

  const columns = [
    {
      name: 'S.No',
      selector: (row) => row.sno,
      sortable: true,
      center: true,
    },
    {
      name: 'Tripsheet',
      selector: (row) => row.Tripsheet_No,
      sortable: true,
      center: true,
    },
    {
      name: 'TS Time',
      selector: (row) => row.TS_Time,
      sortable: true,
      center: true,
    },
    {
      name: 'Trip Type',
      selector: (row) => row.Trip_Type,
      sortable: true,
      center: true,
    },
    {
      name: 'Trip Category',
      selector: (row) => row.Trip_Category,
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
      name: 'Vehicle Group',
      selector: (row) => row.Vehicle_Group,
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
      name: 'Division',
      selector: (row) => row.Division,
      sortable: true,
      center: true,
    },
    {
      name: 'Document No',
      selector: (row) => row.Freight_Order,
      sortable: true,
      center: true,
    },     
    {
      name: 'Start Time',
      selector: (row) => row.Trip_Start_Time,
      sortable: true,
      center: true,
    },
    {
      name: 'End Time',
      selector: (row) => row.Trip_End_Time,
      sortable: true,
      center: true,
    },
    {
      name: 'Trip Hrs',
      selector: (row) => row.Trip_Hours,
      sortable: true,
      center: true,
    },
    {
      name: 'Total KM',
      selector: (row) => row.TOT_KM,
      sortable: true,
      center: true,
    },
    {
      name: 'Total Diesel',
      selector: (row) => row.Total_Diesel,
      sortable: true,
      center: true,
    },
    {
      name: 'RJ Customer Name',
      selector: (row) => row.RJ_Customer_Name,
      sortable: true,
      center: true,
    },
    {
      name: 'RJ Amount',
      selector: (row) => row.RJ_Amount,
      sortable: true,
      center: true,
    },
    {
      name: 'Status',
      selector: (row) => row.Status,
      sortable: true,
      center: true,
    },
     
  ]

  //============ column header data=========

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
                    <OVTICSearchSelectComponent
                      size="sm"
                      className="mb-2"
                      onChange={(e) => {
                        onChangeFilter(e, 'vehicle_no')
                      }}
                      label="Select Vehicle Number"
                      noOptionsMessage="Vehicle Not found"
                      search_type="ovtic_report_vehicle_number"
                      search_data={searchFilterData}
                    />
                  </CCol> 

                  <CCol xs={12} md={3}>
                    <CFormLabel htmlFor="VNum">Tripsheet Number</CFormLabel>
                    <OVTICSearchSelectComponent
                      size="sm"
                      className="mb-2"
                      onChange={(e) => {
                        onChangeFilter(e, 'tripsheet_no')
                      }}
                      label="Select Tripsheet Number"
                      noOptionsMessage="Tripsheet Not found"
                      search_type="ovtic_report_tripsheet_number"
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
          ) : (<AccessDeniedComponent />)}
        </>
      )}
    </>
  )
}

export default OVTIReport
