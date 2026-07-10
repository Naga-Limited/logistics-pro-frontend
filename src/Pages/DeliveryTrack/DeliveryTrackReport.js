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
import VehicleAssignmentService from 'src/Service/VehicleAssignment/VehicleAssignmentService'
import { Link, useNavigate } from 'react-router-dom'
import CustomTable from 'src/components/customComponent/CustomTable'
import TripStoService from 'src/Service/TripSTO/TripStoService'
import { ToastContainer, toast } from 'react-toastify'
import Loader from 'src/components/Loader'
import { DateRangePicker } from 'rsuite'
import SearchSelectComponent from 'src/components/commoncomponent/searchSelectComponent'
import FileSaver from 'file-saver'
import * as XLSX from 'xlsx';
import { GetDateTimeFormat } from '../Depo/CommonMethods/CommonMethods'
import * as LogisticsProScreenNumberConstants from 'src/components/constants/LogisticsProScreenNumberConstants'
import { useRef } from 'react'
import { useReactToPrint } from 'react-to-print'
import DeliveryTrackService from 'src/Service/DeliveryTrack/DeliveryTrackService'
import DTSearchSelectComponent from './DTSearchSelectComponent'
import JavascriptInArrayComponent from 'src/components/commoncomponent/JavascriptInArrayComponent'
import AccessDeniedComponent from 'src/components/commoncomponent/AccessDeniedComponent'

const DeliveryTrackReport = () => {
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

  /* ==================== Access Part Start ========================*/
  const [screenAccess, setScreenAccess] = useState(false)
  let page_no = LogisticsProScreenNumberConstants.DeliveryTrackModule.DT_Report

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

  const exportToCSV = () => {
    console.log(rowData,'exportCsvData')
    let dateTimeString = GetDateTimeFormat(1)
    let fileName='NAGA_Delivery_Tracking_Report_'+dateTimeString
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

  const [vehicleSto, setVehicleSto] = useState('')

  let tableData = []
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

  const timeConvert = (timeconst,type) => {
  
    let fixed_no = timeconst.toFixed(2)
    const myArray = fixed_no.toString().split(".");
    let timeConvertValue = `${myArray[0]} hours ${Math.round(60*(myArray[1]/100))} mins`
    console.log(myArray,'myArray')
    console.log(timeConvertValue,'timeConvertValue')

    if(type == 1){
      return timeConvertValue
    } else {
      return myArray
    }
    
  }

  function diffTime(start, end) {

    let st = new Date(start)
    let et = new Date(end)
    return (et-st)/1000
  }

  const budgetHrsFinder = (ddata) => {

    let veh_speed = ddata.vehicle_speed
    let first_del_dist = ddata.fdl_distance
    let result = '-'

    if(veh_speed && first_del_dist){ 
      let time_taken1 = (first_del_dist * 60 / veh_speed ) * 60 
      console.log(time_taken1,'time_taken1') 

      let date = new Date(null);
      date.setSeconds(time_taken1);
      console.log(date,'time_taken1-date') 
      result = date.toISOString().slice(11, 19);  
      console.log(result,'budgetHrsFinder2')
    }
    
    return result
  }

  function strtotimeask(date, addTime){
    let generatedTime=date.getTime();
    console.log(generatedTime,'generatedTime');
    if(addTime.seconds) generatedTime+=1000*addTime.seconds; //check for additional seconds 
    if(addTime.minutes) generatedTime+=1000*60*addTime.minutes;//check for additional minutes 
    if(addTime.hours) generatedTime+=1000*60*60*addTime.hours;//check for additional hours 

    // let date1 = new Date(generatedTime);

    let temp = new Date(generatedTime).toLocaleString('en-AU', { 
      hourCycle: 'h23',
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
  });

    // let front1 = date1.toLocaleDateString('en-US');
    // let back1 = date1.toLocaleTimeString('en-GB');
    // let formatted_date = `${front1} ${back1}`
    // console.log(formatted_date,'formatted_date');
    console.log(temp,'temp');
    return temp
  }

  const timeFormatAdjustment = (dateStr, type) => {
    console.log(dateStr,'dateStr1')
    var dArr = type == 1 ? dateStr.split(", "): dateStr.split(" ");  
    let val1 = `${reformatDate(dArr[0],type)} ${dArr[1]}`
    console.log(val1,'val1')
    return val1  
  }
  const reformatDate = (dateStr, type) => {
    console.log(dateStr,'dateStr2')
    var dArr = type == 1 ? dateStr.split("/") : dateStr.split("-");   
    let val2 =  type == 1 ? dArr[0]+ "-" +dArr[1]+ "-" +dArr[2] : dArr[2]+ "-" +dArr[1]+ "-" +dArr[0];  
    console.log(val2,'val2')
    return val2
  }

  const timeFormatAdjustment1 = (dateStr, type) => {
    console.log(dateStr,'chdateStr1')
    var dArr = type == 1 ? dateStr.split(", "): dateStr.split(" ");  
    let val1 = `${reformatDate1(dArr[0],type)} ${dArr[1]}`
    console.log(val1,'chval1')
    return val1  
  }
  const reformatDate1 = (dateStr, type) => {
    console.log(dateStr,'chdateStr2')
    var dArr = type == 1 ? dateStr.split("/") : dateStr.split("-");   
    let val2 =  type == 1 ? dArr[2]+ "-" +dArr[1]+ "-" +dArr[0] : dArr[2]+ "-" +dArr[1]+ "-" +dArr[0];  
    console.log(val2,'chval2')
    return val2
  }

  const budgetReachedDateTimeFinder = (ddata,type='') => {

    let veh_speed = ddata.vehicle_speed
    let first_del_dist = ddata.fdl_distance
    let mill_go_time = ddata.mgo_time 
    console.log(mill_go_time,'mill_go_time1')
    var date = new Date(mill_go_time.replace('IST', ''));
  
    if(first_del_dist == 0 || veh_speed == 0 || mill_go_time == ''){
      return '-'
    }
    let arrayval = timeConvert(first_del_dist / veh_speed,2) 
    console.log(arrayval,'arrayval7');
    let futureDate = strtotimeask(date, {
      hours: arrayval[0],  
      minutes: Math.round(60*(arrayval[1]/100))  
    });
    console.log(futureDate,'futureDate1');
    if(type == '1'){
      return timeFormatAdjustment1(futureDate,1)
    }
    return timeFormatAdjustment(futureDate,1)
  }

  const ActualTimeTakenFinder = (ddata) => {
    console.log(ddata,'ddata')
    let result = '-' 
    if(ddata.mgo_time && ddata.unloading_time){
      let time1 = ddata.mgo_time
      let time2 = ddata.actual_reached_time    
      console.log(time1,'ActualTimeTakenFinder-time1')
      console.log(time2,'ActualTimeTakenFinder-time2')
      if(!(time1 == null || time1 == '' || time1 == '00-00-0000 00:00:00' || time1 == '0000-00-00 00:00:00') && !(time2 == null || time2 == '' || time2 == '00-00-0000 00:00:00' || time2 == '0000-00-00 00:00:00')){
        let needed_difference_time = diffTime(time1,time2)
        let date = new Date(null);
        date.setSeconds(needed_difference_time); 
        console.log(date,'ActualTimeTakenFinder-date')
        result = date.toISOString().slice(11, 19);      
      }
    }
    console.log(result,'ActualTimeTakenFinder')
    return result
  }

  const DifferenceHoursFinder = (ddata) => {
    console.log(ddata,'ddata')
    let result = '-'
    let budget_time = budgetReachedDateTimeFinder(ddata,1)
    if(ddata.actual_reached_time && ddata.unloading_time){
      let time1 = budget_time
      let time2 = ddata.actual_reached_time    
      console.log(time1,'DifferenceHoursFinder-time1')
      console.log(time2,'DifferenceHoursFinder-time2')
      if(!(time1 == null || time1 == '' || time1 == '00-00-0000 00:00:00' || time1 == '0000-00-00 00:00:00') && !(time2 == null || time2 == '' || time2 == '00-00-0000 00:00:00' || time2 == '0000-00-00 00:00:00')){
        let needed_difference_time = diffTime(time1,time2)
        let date = new Date(null);
        date.setSeconds(needed_difference_time); 
        result = date.toISOString().slice(11, 19);      
      }
    }
    console.log(result,'MillGateInTimeToUnloadingTimeFinder')
    return result
  }

  const ReachedTimeToUnloadingTimeFinder = (ddata) => {
    console.log(ddata,'ddata')
    let result = '-'
    if(ddata.actual_reached_time && ddata.unloading_time){
      let time1 = ddata.actual_reached_time
      let time2 = ddata.unloading_time
      console.log(time1,'ReachedTimeToUnloadingTimeFinder-time1')
      console.log(time2,'ReachedTimeToUnloadingTimeFinder-time2')
      if(!(time1 == null || time1 == '' || time1 == '00-00-0000 00:00:00' || time1 == '0000-00-00 00:00:00') && !(time2 == null || time2 == '' || time2 == '00-00-0000 00:00:00' || time2 == '0000-00-00 00:00:00')){
        let needed_difference_time = diffTime(time1,time2)
        let date = new Date(null);
        date.setSeconds(needed_difference_time); 
        result = date.toISOString().slice(11, 19);      
      }
    }
    console.log(result,'MillGateInTimeToUnloadingTimeFinder')
    return result
  }

  const MillGateOutTimeToUnloadingTimeFinder = (ddata) => {
    console.log(ddata,'ddata')
    let result = '-'
    if(ddata.mgo_time && ddata.unloading_time){
      // let time1 = timeFormatAdjustment(ddata.mgo_time,2)
      // let time2 = timeFormatAdjustment(ddata.unloading_time,2)
      let time1 = ddata.mgo_time
      let time2 = ddata.unloading_time
      console.log(time1,'MillGateOutTimeToUnloadingTimeFinder-time1')
      console.log(time2,'MillGateOutTimeToUnloadingTimeFinder-time2')
      if(!(time1 == null || time1 == '' || time1 == '00-00-0000 00:00:00' || time1 == '0000-00-00 00:00:00') && !(time2 == null || time2 == '' || time2 == '00-00-0000 00:00:00' || time2 == '0000-00-00 00:00:00')){
        let needed_difference_time = diffTime(time1,time2)
        let date = new Date(null);
        date.setSeconds(needed_difference_time); 
        result = date.toISOString().slice(11, 19);      
      }
    }
    console.log(result,'MillGateInTimeToUnloadingTimeFinder')
    return result
  }

  const MillGateInTimeToUnloadingTimeFinder = (ddata) => {
    console.log(ddata,'ddata')
    let result = '-'
    if(ddata.mgi_time && ddata.unloading_time){
      let time1 = ddata.mgi_time
      let time2 = ddata.unloading_time
      console.log(time1,'MillGateInTimeToUnloadingTimeFinder-time1')
      console.log(time2,'MillGateInTimeToUnloadingTimeFinder-time2')
      if(!(time1 == null || time1 == '' || time1 == '00-00-0000 00:00:00' || time1 == '0000-00-00 00:00:00') && !(time2 == null || time2 == '' || time2 == '00-00-0000 00:00:00' || time2 == '0000-00-00 00:00:00')){
        let needed_difference_time = diffTime(time1,time2)
        let date = new Date(null);
        date.setSeconds(needed_difference_time); 
        result = date.toISOString().slice(11, 19);      
      }
    }
    console.log(result,'MillGateInTimeToUnloadingTimeFinder')
    return result
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

      DeliveryTrackService.getDTInfoForReport().then((response) => { 
        tableReportData = response.data.data
        setSearchFilterData(tableReportData)
        console.log(tableReportData,'tableReportData1') 
        let rowDataList = []
        tableReportData.map((data, index) => {
        rowDataList.push({
          sno: index + 1,
          Tripsheet_No: data.tripsheet_no,
          Shipment_No: data.shipment_no,
          Shipment_Date: data.shipment_info.created_at,
          Invoice_No: data.invoice_no,
          Delivery_No: data.delivery_no,
          Delivery_Sequence: data.delivery_sequence,
          TL_Name: data.tl_name,
          Division: data.division,
          Shed_Name: data.shipment_Vendor_info && data.shipment_Vendor_info.length > 0 ? data.shipment_Vendor_info[0].shed_name: '-',
          Vehicle_No: data.vehicle_no,
          Driver_Name: data.driver_name,
          Driver_Mobile_No: data.driver_contact_no,
          Customer_Name: data.customer_name,
          Customer_Code: data.customer_code,
          Customer_City: data.customer_city,
          Delivery_Net_Qty: data.delivery_net_qty,
          Invoice_Qty: data.delivery_info.invoice_net_quantity,
          Invoice_Uom: data.delivery_info.invoice_uom,
          Speed_Km_Per_Hour:data.vehicle_speed,
          First_Delivery_Location_Distance_In_Km:data.fdl_distance,
          Budget_Running_Hrs: budgetHrsFinder(data),
          Yard_GateIn_Time: timeFormatAdjustment(data.ygi_time,2),
          Yard_GateOut_Time: timeFormatAdjustment(data.ygo_time,2),
          Mill_GateIn_Time: timeFormatAdjustment(data.mgi_time,2),
          Mill_GateOut_Time: timeFormatAdjustment(data.mgo_time,2),
          Budget_Reached_DateTime_Hrs: budgetReachedDateTimeFinder(data),
          Actual_Reached_DateTime: data.actual_reached_time ? (ActualTimeTakenFinder(data) == '-' ? '-' : timeFormatAdjustment(data.actual_reached_time,2)) : '-',
          Actual_Time_Taken: ActualTimeTakenFinder(data),
          Difference_Hours: DifferenceHoursFinder(data),
          Reached_Time_Delay_Reason: data.rtd_reason,
          Unloading_Date_Time : data.unloading_time ? (!(data.unloading_time == null || data.unloading_time == '' || data.unloading_time == '0000-00-00 00:00:00') ? timeFormatAdjustment(data.unloading_time,2) : '-' ) : '-',
          Unloading_Time_Delay_Reason: data.unloading_time_delay_reason,
          Reached_Time_To_Unloading_Time: ReachedTimeToUnloadingTimeFinder(data),
          Mill_Gate_Out_Time_To_Unloading_Time: MillGateOutTimeToUnloadingTimeFinder(data),
          Mill_Gate_In_Time_To_Unloading_Time: MillGateInTimeToUnloadingTimeFinder(data),
          Creation_Date: data.created_date,
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
      console.log(defaultDate, 'defaultDate')
      console.log(reportVehicle, 'reportVehicle')
      console.log(reportShipmentNo, 'reportShipmentNo')
      console.log(reportTSNo, 'reportTSNo')
      console.log(reportShipmentStatus, 'reportShipmentStatus')

      DeliveryTrackService.sentDTInfoForReport(report_form_data).then((res) => {
        console.log(res, 'res')
        tableReportData = res.data.data
        console.log(tableReportData,'tableReportData2')
        setSearchFilterData(tableReportData,'sentDTInfoForReport')
        setFetch(true)
        let rowDataList = []
        tableReportData.map((data, index) => {
          rowDataList.push({
            sno: index + 1,
            Tripsheet_No: data.tripsheet_no,
            Shipment_No: data.shipment_no,
            Shipment_Date: data.shipment_info.created_at,
            Invoice_No: data.invoice_no,
            Delivery_No: data.delivery_no,
            Delivery_Sequence: data.delivery_sequence,
            TL_Name: data.tl_name,
            Division: data.division,
            Shed_Name: data.shipment_Vendor_info && data.shipment_Vendor_info.length > 0 ? data.shipment_Vendor_info[0].shed_name: '-',
            Vehicle_No: data.vehicle_no,
            Driver_Name: data.driver_name,
            Driver_Mobile_No: data.driver_contact_no,
            Customer_Name: data.customer_name,
            Customer_Code: data.customer_code,
            Customer_City: data.customer_city,
            Delivery_Net_Qty: data.delivery_net_qty,
            Invoice_Qty: data.delivery_info.invoice_net_quantity,
            Invoice_Uom: data.delivery_info.invoice_uom,
            Speed_Km_Per_Hour:data.vehicle_speed,
            First_Delivery_Location_Distance_In_Km:data.fdl_distance,
            Budget_Running_Hrs: budgetHrsFinder(data),
            Yard_GateIn_Time: timeFormatAdjustment(data.ygi_time,2),
            Yard_GateOut_Time: timeFormatAdjustment(data.ygo_time,2),
            Mill_GateIn_Time: timeFormatAdjustment(data.mgi_time,2),
            Mill_GateOut_Time: timeFormatAdjustment(data.mgo_time,2),
            Budget_Reached_DateTime_Hrs: budgetReachedDateTimeFinder(data),
            Actual_Reached_DateTime: data.actual_reached_time ? (ActualTimeTakenFinder(data) == '-' ? '-' : timeFormatAdjustment(data.actual_reached_time,2)) : '-',
            Actual_Time_Taken: ActualTimeTakenFinder(data),
            Difference_Hours: DifferenceHoursFinder(data),
            Reached_Time_Delay_Reason: data.rtd_reason,
            Unloading_Date_Time : data.unloading_time ? ((data.unloading_time == null || data.unloading_time == '' || data.unloading_time == '0000-00-00 00:00:00') ? '-' : timeFormatAdjustment(data.unloading_time,2) ) : '-',
            Unloading_Time_Delay_Reason: data.unloading_time_delay_reason,
            Reached_Time_To_Unloading_Time: ReachedTimeToUnloadingTimeFinder(data),
            Mill_Gate_Out_Time_To_Unloading_Time: MillGateOutTimeToUnloadingTimeFinder(data),
            Mill_Gate_In_Time_To_Unloading_Time: MillGateInTimeToUnloadingTimeFinder(data),
            Creation_Date: data.created_date,
          })
        })
        setFetch(true)
        setRowData(rowDataList)
        setPending(false)
      })
    }
  }

  useEffect(() => {
    loadTripShipmentReport()
  }, [])

 
  // ============ Column Header Data =======

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
      name: 'Invoice No',
      selector: (row) => row.Invoice_No,
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
      name: 'Delivery Sequence',
      selector: (row) => row.Delivery_Sequence,
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
      name: 'Customer Name',
      selector: (row) => row.Customer_Name,
      sortable: true,
      center: true,
    },
    {
      name: 'Customer Code',
      selector: (row) => row.Customer_Code,
      sortable: true,
      center: true,
    },
    {
      name: 'Customer City ',
      selector: (row) => row.Customer_City,
      sortable: true,
      center: true,
    },

    {
      name: 'Tripsheet No',
      selector: (row) => row.Tripsheet_No,
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
    },{
      name: 'Driver Mobile No',
      selector: (row) => row.Driver_Mobile_No,
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
      name: 'Yard GateIn Time',
      selector: (row) => row.Yard_GateIn_Time,
      sortable: true,
      center: true,
    },
    {
      name: 'Yard GateOut Time',
      selector: (row) => row.Yard_GateOut_Time,
      sortable: true,
      center: true,
    },
    {
      name: 'Mill GateIn Time',
      selector: (row) => row.Mill_GateIn_Time,
      sortable: true,
      center: true,
    },
    {
      name: 'Mill GateOut Time',
      selector: (row) => row.Mill_GateOut_Time,
      sortable: true,
      center: true,
    },
    {
      name: 'TL Name',
      selector: (row) => row.TL_Name,
      sortable: true,
      center: true,
    },
    {
      name: 'Delivery Distance',
      selector: (row) => row.First_Delivery_Location_Distance_In_Km,
      // sortable: true,
      center: true,
    },
    {
      name: 'Actual Reached Time',
      selector: (row) => row.Actual_Reached_DateTime,
      sortable: true,
      center: true,
    },
    {
      name: 'Unloading Time',
      selector: (row) => row.Unloading_Date_Time,
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
                    <DTSearchSelectComponent
                      size="sm"
                      className="mb-2"
                      onChange={(e) => {
                        onChangeFilter(e, 'vehicle_no')
                      }}
                      label="Select Vehicle Number"
                      noOptionsMessage="Vehicle Not found"
                      search_type="delivery_track_report_vehicle_number"
                      search_data={searchFilterData}
                    />
                  </CCol>

                  <CCol xs={12} md={3}>
                    <CFormLabel htmlFor="VNum">Shipment Number</CFormLabel>
                    <DTSearchSelectComponent
                      size="sm"
                      className="mb-2"
                      onChange={(e) => {
                        onChangeFilter(e, 'shipment_no')
                      }}
                      label="Select Shipment Number"
                      noOptionsMessage="Shipment Not found"
                      search_type="delivery_track_report_shipment_number"
                      search_data={searchFilterData}
                    />
                  </CCol>

                  <CCol xs={12} md={3}>
                    <CFormLabel htmlFor="VNum">Tripsheet Number</CFormLabel>
                    <DTSearchSelectComponent
                      size="sm"
                      className="mb-2"
                      onChange={(e) => {
                        onChangeFilter(e, 'tripsheet_no')
                      }}
                      label="Select Tripsheet Number"
                      noOptionsMessage="Tripsheet Not found"
                      search_type="delivery_track_report_tripsheet_number"
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
                      search_type="shipment_report_shipment_status"
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
          ) : (<AccessDeniedComponent />)}
        </>
      )}
    </>
  )
}

export default DeliveryTrackReport
