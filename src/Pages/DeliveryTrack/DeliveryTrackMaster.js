/* eslint-disable prettier/prettier */
import {
  CButton,
  CCard,
  CCol,
  CAlert,
  CContainer,
  CForm,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CNav,
  CNavItem,
  CNavLink,
  CRow,
  CTabContent,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CTabPane,
  CFormFloating,
  CFormCheck,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CInputGroup,
  CInputGroupText,
} from '@coreui/react'
// import { React, useEffect, useState } from 'react'
import React, { useState, useEffect } from 'react'
import useForm from 'src/Hooks/useForm.js' 
import DriverMasterValidation from 'src/Utils/Master/DriverMasterValidation'
import * as LogisticsProScreenNumberConstants from 'src/components/constants/LogisticsProScreenNumberConstants'
import { Link, useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css' 
import Loader from 'src/components/Loader'
import DTSearchSelectComponent from './DTSearchSelectComponent' 
import DeliveryTrackService from 'src/Service/DeliveryTrack/DeliveryTrackService'
import ShedListSearchSelect from 'src/components/commoncomponent/ShedListSearchSelect'
import ShedMasterService from 'src/Service/Master/ShedMasterService'
import CIcon from '@coreui/icons-react'
import Swal from 'sweetalert2'
import AccessDeniedComponent from 'src/components/commoncomponent/AccessDeniedComponent'
import JavascriptInArrayComponent from 'src/components/commoncomponent/JavascriptInArrayComponent'
import { DateRangePicker } from 'rsuite'
const DeliveryTrackMaster = () => {

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
  let page_no = LogisticsProScreenNumberConstants.DeliveryTrackModule.DT_Screen

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

  const formValues = {
  }

  const navigation = useNavigate()
  const [errorModal, setErrorModal] = useState(false)
  const [error, setError] = useState({})

  const { values, errors, handleChange, onFocus, handleSubmit, enableSubmit, onBlur } = useForm(
    // addNewDriver,
    DriverMasterValidation,
    formValues
  )
  
  const [shipmentTrackInfo, setShipmentTrackInfo] = useState([])
  // const shipmentTrackInfo = []

  function getCurrentDate(separator = '') {
    let newDate = new Date()
    let date = newDate.getDate()
    let month = newDate.getMonth() + 1
    let year = newDate.getFullYear()

    return `${year}${separator}${month < 10 ? `0${month}` : `${month}`}${separator}${date}`
  }

  const REQ = () => <span className="text-danger"> * </span>
  const [fetch, setFetch] = useState(false)
  const [smallfetch, setSmallFetch] = useState(false) 
  const [shipmentHaving, setShipmentHaving] = useState(false)
  const [shipmentNumberId, setShipmentNumberId] = useState('');
  const [shedMob, setShedMob] = useState('');
  const [shed_Name, setShed_Name] = useState('');
  const [mgiTime, setMgiTime] = useState('');
  const [mgoTime, setMgoTime] = useState(''); 
  const [uldReason, setUldReason] = useState('');
  const [adReason, setAdReason] = useState('');
  const [vehSpeed, setVehSpeed] = useState('');
  const [shedNameId, setShedNameId] = useState('');
  const [shipmentNumberData, setShipmentNumberData] = useState({}); 
  const [shipmentData, setShipmentData] = useState([]);
  const handleRemarks = (event,type,parIndex) => {
    let tripResult = event.target.value
    const fgsales_parent_info1 = JSON.parse(JSON.stringify(shipmentTrackInfo))
    if(type == 1){
      setUldReason(tripResult)
      fgsales_parent_info1[parIndex]['UnloadingDelayReason'] = tripResult
    } else if(type == 2){
      setAdReason(tripResult)
      fgsales_parent_info1[parIndex]['ActualDelayReason'] = tripResult
    }
    setShipmentTrackInfo(fgsales_parent_info1)
  };

  const onChangeFilter = (event) => {
    var selected_value = event.value
    console.log(selected_value, 'selected_value')
    if (selected_value) {
      setShipmentHaving(true)
      setShipmentNumberId(selected_value)
      shipmentData.map((vv,kk)=>{ 
        if(selected_value == vv.shipment_id){
          setShipmentNumberData(vv)
          setShipmentTrackInfo(vv.shipment_all_child_info)
        }
      })
    } else {
      setShipmentHaving(false)
      setShipmentNumberId('')
      setMgiTime('')
      setMgoTime('')
      setVehSpeed('') 
      setShipmentNumberData({})
      setShipmentTrackInfo([])
    }
  }

  const emptyData = () => {
    setShipmentHaving(false)
    setShipmentNumberId('')
    setMgiTime('')
    setMgoTime('')
    setVehSpeed('')
    setShipmentData([])
    setShipmentNumberData({})
    setShipmentTrackInfo([])
  }

  useEffect(() => {
    if(mgiTime && mgoTime){
      let dift = diffTime(mgiTime,mgoTime) //in seconds
      console.log(dift,'dift')
    }
  },[mgiTime,mgoTime])

  const ColoredLine = ({ color }) => (
    <hr
        style={{
            color: color,
            backgroundColor: color,
            height: 5
        }}
    />
  )



  const [freshType, setFreshType] = useState(0)

  useEffect(() => {
    console.log(freshType,'freshType')
    if(freshType === 0){
      loadTripShipmentReport()
    }    
  }, [freshType])

  const loadTripShipmentReport = (fresh_type = '') => {
    
    if(fresh_type !== '1'){
      //section for getting Location Data from database
      DeliveryTrackService.getShipmentForDeliveryTrack().then((res) => {
        console.log(res.data.data,'getShipmentForDeliveryTrack')
        setFetch(true)
        setSmallFetch(true)
        setSearchFilterData(res.data.data)
        setShipmentData(res.data.data)
      })
    } else {
      if (defaultDate == null) {
        toast.warning('Date Filter Should not be empty..!')
        return false
      } 
  
      let report_form_data = new FormData()
      report_form_data.append('date_between', defaultDate)   
      console.log(defaultDate, 'defaultDate') 
  
      DeliveryTrackService.sentShipmentInfoForDeliveryTrack(report_form_data).then((res) => {
        setFetch(true) 
        console.log(res.data.data,'sentShipmentInfoForDeliveryTrack')
        setSearchFilterData(res.data.data)
        setShipmentData(res.data.data)
      })
    }
    
  }

  const onChangeDTInfo = (eve, type, parent_index = '') => {
    const fgsales_parent_info = JSON.parse(JSON.stringify(shipmentTrackInfo))
    if(type == 7){
      let getData = eve.target.value
      console.log(getData, 'getData-DeliverySequence')
      console.log(parent_index, 'parent_index-DeliverySequence')
      if(getData){
        fgsales_parent_info[parent_index]['DeliverySequence'] = getData 
      } else {
        fgsales_parent_info[parent_index]['DeliverySequence'] = ''  
      }
      console.log(fgsales_parent_info,'fgsales_parent_info-DeliverySequence1')
    } else if(type == 4){
      let need_val = eve.target.value.replace(/[^a-zA-Z ]/gi, '')
      let tripResult = need_val.toUpperCase(); 
      if(need_val){
        fgsales_parent_info[parent_index]['tl_name'] = tripResult 
      } else {
        fgsales_parent_info[parent_index]['tl_name'] = '' 
      }
    } else if(type == 3 || type == 5){
      let getData6 = eve.target.value.replace(/\D/g, '')

      if(getData6){ 
        type == 3 ? setVehSpeed(getData6) : fgsales_parent_info[parent_index]['FirstDeliveryDistance'] = getData6
      } else {
        type == 3 ? setVehSpeed('') : fgsales_parent_info[parent_index]['FirstDeliveryDistance'] = ''
      }
    } else {
      
      let val = eve.target.value
      console.log(val,'vvaall')
      if(val){
        type == 1 ? setMgiTime(val) : type == 2 ? setMgoTime(val) : type == 6 ? fgsales_parent_info[parent_index]['ActualReachedTime'] = val : type == 8 ? fgsales_parent_info[parent_index]['UnloadingTime'] = val : '' 
      } else {
        type == 1 ? setMgiTime('') : type == 2 ? setMgoTime('') : type == 6 ? fgsales_parent_info[parent_index]['ActualReachedTime'] = '' : type == 8 ? fgsales_parent_info[parent_index]['UnloadingTime'] = '' : ''
      }

    }
    console.log(fgsales_parent_info,'fgsales_parent_info-DeliverySequence2')
    setShipmentTrackInfo(fgsales_parent_info)
  }

  const onChangeShedInfo = (event) => {
    let shedId = event.value
    if (shedId) {
      setShedNameId(shedId)

      ShedMasterService.getShedById(shedId).then((res) => {
        console.log(res.data.data)
        setShedMob(res.data.data.shed_owner_phone_1)
        setShed_Name(res.data.data.shed_name)
      })
     console.log(setShed_Name,'setShed_Name')
    } else {
      values.shedName = ''
      setShedMob('')
      setShedNameId('')
      setShed_Name('')
    }
  }

  function diffTime(start, end) {

    let st = new Date(start)
    let et = new Date(end)
    return (et-st)/1000
  }

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

  const Find_Budget_Running_Hours = (parIndex) => {

    console.log(vehSpeed,'vehSpeed') 

    let fddikVal = shipmentTrackInfo[parIndex] && shipmentTrackInfo[parIndex]['FirstDeliveryDistance'] ? shipmentTrackInfo[parIndex]['FirstDeliveryDistance'] : ''

    if(vehSpeed && fddikVal){
      let time_taken = fddikVal / vehSpeed
      console.log(time_taken,'time_taken')

      if(time_taken && time_taken != 'Infinity'){
        let ans = timeConvert(time_taken,1)
        if(ans){
          return ans
        }
      }
    }
    return '-'
  }

  function strtotimeask(date, addTime){
    let generatedTime=date.getTime();
    console.log(generatedTime);
    if(addTime.seconds) generatedTime+=1000*addTime.seconds; //check for additional seconds 
    if(addTime.minutes) generatedTime+=1000*60*addTime.minutes;//check for additional minutes 
    if(addTime.hours) generatedTime+=1000*60*60*addTime.hours;//check for additional hours 
    let answ = new Date(generatedTime);
    let formatted_date = new Date(answ). toLocaleString(undefined, {timeZone: 'Asia/Kolkata'}); 
    console.log(formatted_date,'ssssss');
    return formatted_date
  }

  const Find_Budget_Reached_Date_Time = (parIndex) => {
    console.log(mgoTime,'mgoTime1')
    var date = new Date(mgoTime.replace('IST', ''));
    let fddikVal = shipmentTrackInfo[parIndex] && shipmentTrackInfo[parIndex]['FirstDeliveryDistance'] ? shipmentTrackInfo[parIndex]['FirstDeliveryDistance'] : ''
    console.log(fddikVal,'fddikVal')
    if(fddikVal == 0 || vehSpeed == 0 || mgoTime == ''){
      return '-'
    }
    let arrayval = timeConvert(fddikVal / vehSpeed,2)
    console.log(arrayval,'arrayval');
    let futureDate = strtotimeask(date, {
      hours: arrayval[0],  
      minutes: Math.round(60*(arrayval[1]/100))  
    });
    console.log(futureDate,'futureDate');
    return futureDate
  }

  const Find_Actual_Time_Taken = (parIndex) => {

    console.log(mgoTime,'mgoTime2')
    let ardTimeVal = shipmentTrackInfo[parIndex] && shipmentTrackInfo[parIndex]['ActualReachedTime'] ? shipmentTrackInfo[parIndex]['ActualReachedTime'] : ''
    console.log(ardTimeVal,'ardTimeVal') 

    //new date instance
    const dt_date1 = new Date(mgoTime);
    const dt_date2 = new Date(ardTimeVal);

    //Get the Timestamp
    const date1_time_stamp = dt_date1.getTime()/1000;
    const date2_time_stamp = dt_date2.getTime()/1000;

    let difference = Math.abs(date1_time_stamp - date2_time_stamp);
    console.log(difference,'difference')
     
    let time_taken = difference / 3600
    console.log(time_taken,'time_taken')

    if(time_taken && time_taken != 'Infinity'){
      let ans = timeConvert(time_taken,1)
      if(ans){
        return ans
      }
    }

    return '-'
  }

  const Find_Difference_Hrs = (parIndex) => {

    let fddikVal = shipmentTrackInfo[parIndex] && shipmentTrackInfo[parIndex]['FirstDeliveryDistance'] ? shipmentTrackInfo[parIndex]['FirstDeliveryDistance'] : ''
    let ardTimeVal = shipmentTrackInfo[parIndex] && shipmentTrackInfo[parIndex]['ActualReachedTime'] ? shipmentTrackInfo[parIndex]['ActualReachedTime'] : '' 

    let budgetTime = (fddikVal / vehSpeed).toFixed(2)
    let actualTime = (Math.abs(new Date(mgoTime).getTime()/1000 - new Date(ardTimeVal).getTime()/1000)/3600).toFixed(2);
    let DiffernceTime = actualTime-budgetTime

    console.log(budgetTime,'budgetTime')
    console.log(actualTime,'actualTime')
    console.log(DiffernceTime,'DiffernceTime')

    if(DiffernceTime && !(DiffernceTime == 'Infinity' || DiffernceTime == '-Infinity')){
      let ans = timeConvert(DiffernceTime,1)
      if(ans){ 
        return ans
      } 
    }

    return '-'
  }

  const Find_Reaching_to_Unloading_Diff_Hrs = (parIndex) => {

    let ardTimeVal = shipmentTrackInfo[parIndex] && shipmentTrackInfo[parIndex]['ActualReachedTime'] ? shipmentTrackInfo[parIndex]['ActualReachedTime'] : ''
    let unloadTimeVal = shipmentTrackInfo[parIndex] && shipmentTrackInfo[parIndex]['UnloadingTime'] ? shipmentTrackInfo[parIndex]['UnloadingTime'] : ''
    console.log(ardTimeVal,'ardTime')
    console.log(unloadTimeVal,'unloadTime') 

    //new date instance
    const dt_date1 = new Date(ardTimeVal);
    const dt_date2 = new Date(unloadTimeVal);

    //Get the Timestamp
    const date1_time_stamp = dt_date1.getTime()/1000;
    const date2_time_stamp = dt_date2.getTime()/1000;

    let difference = Math.abs(date1_time_stamp - date2_time_stamp);
    console.log(difference,'difference')
     
    let time_taken = difference / 3600
    console.log(time_taken,'time_taken')

    if(time_taken && !(time_taken == 'Infinity' || time_taken == '-Infinity')){
      let ans = timeConvert(time_taken,1)
      if(ans){
        return ans
      }
    }

    return '-'
  }

  const Find_Gateout_to_Unloading_Diff_Hrs = (parIndex) => {
    console.log(mgoTime,'mgoTime3')
    let unloadTimeVal = shipmentTrackInfo[parIndex] && shipmentTrackInfo[parIndex]['UnloadingTime'] ? shipmentTrackInfo[parIndex]['UnloadingTime'] : ''
    console.log(unloadTimeVal,'unloadTimeTime1') 

    //new date instance
    const dt_date1 = new Date(mgoTime);
    const dt_date2 = new Date(unloadTimeVal);

    //Get the Timestamp
    const date1_time_stamp = dt_date1.getTime()/1000;
    const date2_time_stamp = dt_date2.getTime()/1000;

    let difference = Math.abs(date1_time_stamp - date2_time_stamp);
    console.log(difference,'difference')
     
    let time_taken = difference / 3600
    console.log(time_taken,'time_taken')

    if(time_taken && !(time_taken == 'Infinity' || time_taken == '-Infinity')){
      let ans = timeConvert(time_taken,1)
      if(ans){
        return ans
      }
    }

    return '-'
  }

  const Find_Gatein_to_Unloading_Diff_Hrs = (parIndex) => {
    console.log(mgiTime,'mgiTime')
    let unloadTimeVal = shipmentTrackInfo[parIndex] && shipmentTrackInfo[parIndex]['UnloadingTime'] ? shipmentTrackInfo[parIndex]['UnloadingTime'] : ''
    console.log(unloadTimeVal,'unloadTimeTime') 

    //new date instance
    const dt_date1 = new Date(mgiTime);
    const dt_date2 = new Date(unloadTimeVal);

    //Get the Timestamp
    const date1_time_stamp = dt_date1.getTime()/1000;
    const date2_time_stamp = dt_date2.getTime()/1000;

    let difference = Math.abs(date1_time_stamp - date2_time_stamp);
    console.log(difference,'difference')
     
    let time_taken = difference / 3600
    console.log(time_taken,'time_taken')

    if(time_taken && !(time_taken == 'Infinity' || time_taken == '-Infinity')){
      let ans = timeConvert(time_taken,1)
      if(ans){
        return ans
      }
    }

    return '-'
  }

  const [mgodtError, setMgodtError] = useState(false) 
  const [mgidtError, setMgidtError] = useState(false) 

  const uldtErrorCheck = (parIndex) => {
    let unloadTimeVal = shipmentTrackInfo[parIndex] && shipmentTrackInfo[parIndex]['UnloadingTime'] ? shipmentTrackInfo[parIndex]['UnloadingTime'] : ''
    let ardTimeVal = shipmentTrackInfo[parIndex] && shipmentTrackInfo[parIndex]['ActualReachedTime'] ? shipmentTrackInfo[parIndex]['ActualReachedTime'] : ''

    if(ardTimeVal != '' && unloadTimeVal != ''){

      let difference113 = diffTime(ardTimeVal,unloadTimeVal)

      if(difference113 < 0){
        return true
      } else {
        return false
      }

    } else {
      return false
    }
  }

  const ardtErrorCheck = (parIndex) => {

    let ardTimeVal = shipmentTrackInfo[parIndex] && shipmentTrackInfo[parIndex]['ActualReachedTime'] ? shipmentTrackInfo[parIndex]['ActualReachedTime'] : ''

    if(ardTimeVal != '' && mgoTime != ''){

      let difference112 = diffTime(mgoTime,ardTimeVal)

      if(difference112 < 0){
        return true
      } else {
        return false
      }

    } else {
      return false
    }
  }

  useEffect(()=>{
    if(mgiTime != '' && mgoTime != ''){

      let difference111 = diffTime(mgiTime,mgoTime)

      if(difference111 < 0){
        setMgodtError(true)
      } else {
        setMgodtError(false)
      }

    } else {
      setMgodtError(false)
    }

    if(shipmentNumberData && shipmentNumberData.parking_yard_info &&  shipmentNumberData.parking_yard_info.gate_in_date_time_org && mgiTime != '' ){

      let difference115 = diffTime(shipmentNumberData.parking_yard_info.gate_in_date_time_org,mgiTime)

      if(difference115 < 0){
        setMgidtError(true)
      } else {
        setMgidtError(false)
      }
    } else {
      setMgidtError(false)
    }

  },[mgiTime,mgoTime])

  const DTValidate = () => {

    if(mgiTime == ''){
      setFetch(true)
      toast.warning(`Mill Gate In Date & Time Should be required.`)
      return false
    }

    if(mgidtError){
      setFetch(true)
      toast.warning(`Mill Gate In Date & Time Should be greater than Yard Gate In Time.`)
      return false
    }

    if(mgoTime == ''){
      setFetch(true)
      toast.warning(`Mill Gate Out Date & Time Should be required.`)
      return false
    }

    if(mgodtError){
      setFetch(true)
      toast.warning(`Mill Gate Out Date & Time Should be greater than Mill Gate In Date & Time.`)
      return false
    }

    if(vehSpeed == '' || vehSpeed == 0){
      setFetch(true)
      toast.warning(`Vehicle Speed Should be required.`)
      return false
    }

    let err_have1 = false
    let err_have4 = false
    let del_seq_array = []
    shipmentTrackInfo.map((vh,kh)=>{
      console.log(vh,'shipmentTrackInfo',kh)
      
      if(vh.DeliverySequence){
        //
        del_seq_array.push(vh.DeliverySequence)
      } else {
        err_have4 = true
      }

      if(vh.tl_name && vh.FirstDeliveryDistance){
        //
      } else {
        err_have1 = true
      }
    })

    let err_have2 = false
    shipmentTrackInfo.map((vh,kh)=>{
      let ardTimeVal = shipmentTrackInfo[kh] && shipmentTrackInfo[kh]['ActualReachedTime'] ? shipmentTrackInfo[kh]['ActualReachedTime'] : '' 
      console.log(ardTimeVal,'ardTimeVal-err_have2')
      if( ardTimeVal != '' && ardtErrorCheck(kh)){
        err_have2 = true
      } else {
        //
      }
    })

    let err_have3 = false
    shipmentTrackInfo.map((vh,kh)=>{
      let unloadTimeVal = shipmentTrackInfo[kh] && shipmentTrackInfo[kh]['UnloadingTime'] ? shipmentTrackInfo[kh]['UnloadingTime'] : ''
      console.log(unloadTimeVal,'ardTimeVal-err_have3')
      if( unloadTimeVal != '' && uldtErrorCheck(kh)){
        err_have3 = true
      } else {
        //
      }
    })

    const check_duplicate_in_array=(input_array)=>{
      const duplicates =input_array.filter((item, index) =>input_array.indexOf(item) !== index);
      return Array.from(new Set(duplicates));
    } 
    
    if(err_have4){
      setFetch(true)
      toast.warning(`One of the delivery sequence was missing. Kindly check and submit.`)
      return false
    }

    console.log(del_seq_array,'del_seq_array')
    console.log(check_duplicate_in_array(del_seq_array),'duplicate-del_seq_array');
    let duplicate_element_array = check_duplicate_in_array(del_seq_array)

    if(duplicate_element_array.length > 0){
      setFetch(true)
      toast.warning(`One of the delivery sequence chosen was invalid. Kindly check and submit.`)
      return false
    }

    if(err_have1){
      setFetch(true)
      toast.warning(`One of the detail was missing. Kindly check and submit.`)
      return false
    }

    if(err_have2){
      setFetch(true)
      toast.warning(`One of the Actual Reached Date-Time was invalid. Kindly check and submit.`)
      return false
    }

    if(err_have3){
      setFetch(true)
      toast.warning(`One of the Unloading Date-Time was invalid. Kindly check and submit.`)
      return false
    }

    console.log(shipmentTrackInfo,'shipmentTrackInfo')

    // setFetch(true)
    // toast.warning(`All are correct`)
    // return false
    
    const formData = new FormData()

    formData.append('vehicle_id', shipmentNumberData.vehicle_id)
    formData.append('vehicle_type_id',shipmentNumberData.parking_yard_info.vehicle_type_id_new)
    formData.append('driver_id', shipmentNumberData.driver_id)
    formData.append('parking_id', shipmentNumberData.parking_id)
    formData.append('tripsheet_id', shipmentNumberData.tripsheet_id)
    formData.append('shipment_id', shipmentNumberData.shipment_id)
    if(shipmentNumberData.shipment_Vendor_info && shipmentNumberData.shipment_Vendor_info[0]){
      formData.append('freight_vendor_id', shipmentNumberData.shipment_Vendor_info[0].vendor_id)
      formData.append('freight_vendor_code', shipmentNumberData.shipment_Vendor_info[0].vendor_code)
      formData.append('shed_id', shipmentNumberData.shipment_Vendor_info[0].shed_id)
      formData.append('shed_name', shipmentNumberData.shipment_Vendor_info[0].shed_name)
    }
    formData.append('tripsheet_no', shipmentNumberData.trip_sheet_info.trip_sheet_no)
    formData.append('shipment_no', shipmentNumberData.shipment_no)
    formData.append('shipment_track_data', JSON.stringify(shipmentTrackInfo))
    formData.append('division', shipmentNumberData.assigned_by == 2 ? 'NLCD' : 'NLFD')
    formData.append('vehicle_no', shipmentNumberData.parking_yard_info.vehicle_number)
    formData.append('driver_name', shipmentNumberData.parking_yard_info.driver_name)
    formData.append('driver_contact_no', shipmentNumberData.parking_yard_info.driver_contact_number)
    formData.append('vehicle_speed', vehSpeed)
    formData.append('ygi_time', shipmentNumberData.parking_yard_info.gate_in_date_time_org1)
    formData.append('ygo_time', shipmentNumberData.parking_yard_info.gate_out_date_time_org1)
    formData.append('mgi_time', mgiTime)
    formData.append('mgo_time', mgoTime)
    formData.append('created_by', user_id)
    formData.append('status', 1)

    DeliveryTrackService.insertDTInfo(formData).then((res) => {
      console.log(res)
      setFetch(true) 

      if (res.status == 200) {
        Swal.fire({
          title: res.data.message,
          icon: "success",
          confirmButtonText: "OK",
        }).then(function () {
          navigation('/DeliveryTrackHome')
        });
      } else if (res.status == 201) {
        Swal.fire({
          title: res.data.message,
          icon: "warning",
          confirmButtonText: "OK",
        }).then(function () {
          // window.location.reload(false)
        });

      } else {
        Swal.fire({
          title: 'Delivery Tracking Info Cannot Be Inserted in LP.. Kindly Contact Admin!',
          icon: "warning",
          confirmButtonText: "OK",
        }).then(function () {
          // window.location.reload(false)
        })
      }
    })
    .catch((error) => {
      setFetch(true)
      var object = error.response.data.errors
      var output = ''
      for (var property in object) {
        output += '*' + object[property] + '\n'
      }
      setError(output)
      setErrorModal(true)
    })
  }

  function getCurrentDate(separator = '') {
    let newDate = new Date()
    let date = newDate.getDate()
    let month = newDate.getMonth() + 1
    let year = newDate.getFullYear()

    return `${year}${separator}${month < 10 ? `0${month}` : `${month}`}${separator}${
      date < 10 ? `0${date}` : `${date}`
    }`
  }

  /* Set Default Date (Today) in a Variable State */
  const [defaultDate, setDefaultDate] = React.useState([
    new Date(getCurrentDate('-')),
    new Date(getCurrentDate('-')),
  ])

  const [searchFilterData, setSearchFilterData] = useState([])

  useEffect(() => {
    console.log(defaultDate)
    if (defaultDate) {
      setDefaultDate(defaultDate)
    } else {
    }
  }, [defaultDate])

  return (
    <>
    {!fetch && <Loader />}
      {fetch && (
        <>
          {screenAccess ? (
            <>
              <CCard>
                <CTabContent>
                  <CTabPane className="row g-3 m-2 p-1" role="tabpanel" aria-labelledby="home-tab" visible={true}>
                    
                    <CRow className="mb-md-1">
                      <CCol xs={12} md={6}>
                        <CFormLabel htmlFor="VNum">Date Filter</CFormLabel>
                        <DateRangePicker
                          style={{ width: '100rem', height: '100%', borderColor: 'black' }}
                          className="mb-2"
                          id="start_date"
                          allowedDays="1"
                          name="end_date"
                          format="dd-MM-yyyy"
                          value={defaultDate}
                          onChange={setDefaultDate}
                        />
                      </CCol>
                      <CCol xs={12} md={3} className='m-4'> 
                        <CButton
                          size="sm"
                          color="primary"
                          className="mx-3 px-3 text-white"
                          onClick={() => {
                            setFetch(false)
                            emptyData()
                            setFreshType(1)
                            loadTripShipmentReport('1')
                          }}
                        >
                          Filter
                        </CButton>
                      </CCol>
                      <CCol md={3}>
                        <CFormLabel htmlFor="depoContractorName">
                          Shipment Number {shipmentHaving ? '' : <REQ />}

                        </CFormLabel>
                        <DTSearchSelectComponent
                          size="sm"
                          className="mb-2"
                          onChange={(e) => {
                            onChangeFilter(e)
                            {
                              handleChange
                            }
                          }}
                          label="Select Shipment Number"
                          noOptionsMessage="Shipment Not found"
                          date_needed = {defaultDate}
                          search_type={freshType == 0 ? "delivery_track_shipment_routes" : "delivery_track_report_shipment_number1"}
                          search_data={searchFilterData}
                        />
                      </CCol>
                      
                      <CCol md={3}>
                        <CFormLabel htmlFor="tripsheetNo"> Tripsheet Number </CFormLabel>
                        <CFormInput
                          name="tripsheetNo"
                          size="sm" 
                          id="tripsheetNo"
                          readOnly
                          value={shipmentNumberData && shipmentNumberData.trip_sheet_info ? shipmentNumberData.trip_sheet_info.trip_sheet_no : '-'}                         
                        />
                      </CCol>
                      
                      <CCol md={3}>
                        <CFormLabel htmlFor="tripsheetDate"> Tripsheet Date </CFormLabel>
                        <CFormInput
                          name="tripsheetDate"
                          size="sm" 
                          id="tripsheetDate"
                          readOnly
                          value={shipmentNumberData && shipmentNumberData.trip_sheet_info ? shipmentNumberData.trip_sheet_info.created_date : '-'}                         
                        />
                      </CCol>

                      <CCol md={3}>
                        <CFormLabel htmlFor="shipmentDate"> Shipment Date </CFormLabel>
                        <CFormInput
                          name="shipmentDate"
                          size="sm" 
                          id="shipmentDate"
                          readOnly
                          value={shipmentNumberData && shipmentNumberData.created_at ? shipmentNumberData.created_at : '-'}                         
                        />
                      </CCol>

                      <CCol md={3}>
                        <CFormLabel htmlFor="tripsheetDivision"> Division </CFormLabel>
                        <CFormInput
                          name="tripsheetDivision"
                          size="sm" 
                          id="tripsheetDivision"
                          readOnly
                          value={shipmentNumberData && shipmentNumberData.assigned_by ? (shipmentNumberData.assigned_by == '2' ? 'NLCD' : 'NLFD') : '-'}                         
                        />
                      </CCol>

                      <CCol md={3}>
                        <CFormLabel htmlFor="shipmentQty"> Shipment Qty. in MTS</CFormLabel>
                        <CFormInput
                          name="shipmentQty"
                          size="sm" 
                          id="shipmentQty"
                          readOnly
                          value={`${shipmentNumberData && shipmentNumberData.shipment_net_qty ? shipmentNumberData.shipment_net_qty : '-'}`}                         
                        />
                      </CCol>

                      <CCol md={3}>
                        <CFormLabel htmlFor="delCount"> Delivery Count </CFormLabel>
                        <CFormInput
                          name="delCount"
                          size="sm" 
                          id="delCount"
                          readOnly
                          value={`${shipmentNumberData && shipmentNumberData.shipment_all_child_info ? shipmentNumberData.shipment_all_child_info.length : '-'}`}                         
                        />
                      </CCol>
                        
                      {shipmentNumberData && shipmentNumberData.parking_yard_info && shipmentNumberData.parking_yard_info.vehicle_type_id_new == 3 && (
                        <CCol md={3}>
                          <CFormLabel htmlFor="shedName1"> Shed Name </CFormLabel>
                          <CFormInput
                            name="shedName1"
                            size="sm" 
                            id="shedName1"
                            readOnly
                            value={shipmentNumberData.shipment_Vendor_info && shipmentNumberData.shipment_Vendor_info[0].shed_name ? shipmentNumberData.shipment_Vendor_info[0].shed_name : '-'}                         
                          />
                        </CCol>
                      )}

                      {/* <CCol md={3}>
                        <CFormLabel htmlFor="shedName"> Shed Name {shedNameId ? '' : <REQ />}</CFormLabel>
                        <ShedListSearchSelect
                          size="sm"
                          className="mb-1"
                          onChange={(e) => {
                            onChangeShedInfo(e)
                          }}
                          label="shedName"
                          id="shedName"
                          name="shedName"
                          onFocus={onFocus}
                          value={shedNameId}
                          onBlur={onBlur}
                          search_type="shed_name"
                        />
                      </CCol> */}

                      {/* <CCol md={3}>
                        <CFormLabel htmlFor="shedNumber"> Shed Mobile Number </CFormLabel>
                        <CFormInput
                          name="shedNumber"
                          size="sm" 
                          id="shedNumber"
                          readOnly
                          value={shedMob ? shedMob : '-'}                         
                        />
                      </CCol> */}

                      <CCol md={3}>
                        <CFormLabel htmlFor="pygVehicleNo"> Vehicle Number </CFormLabel>
                        <CFormInput
                          name="pygVehicleNo"
                          size="sm" 
                          id="pygVehicleNo"
                          readOnly
                          value={shipmentNumberData && shipmentNumberData.parking_yard_info ? shipmentNumberData.parking_yard_info.vehicle_number : '-'}                         
                        />
                      </CCol>

                      <CCol md={3}>
                        <CFormLabel htmlFor="pygDriverName"> Driver Name </CFormLabel>
                        <CFormInput
                          name="pygDriverName"
                          size="sm" 
                          id="pygDriverName"
                          readOnly
                          value={shipmentNumberData && shipmentNumberData.parking_yard_info ? shipmentNumberData.parking_yard_info.driver_name : '-'}                         
                        />
                      </CCol>

                      <CCol md={3}>
                        <CFormLabel htmlFor="pygDriverNo"> Driver Mobile Number </CFormLabel>
                        <CFormInput
                          name="pygDriverNo"
                          size="sm" 
                          id="pygDriverNo"
                          readOnly
                          value={shipmentNumberData && shipmentNumberData.parking_yard_info ? shipmentNumberData.parking_yard_info.driver_contact_number : '-'}                         
                        />
                      </CCol>

                      <CCol md={3}>
                        <CFormLabel htmlFor="pygYgiTime"> Yard Gate-In Time </CFormLabel>
                        <CFormInput
                          name="pygYgiTime"
                          size="sm" 
                          id="pygYgiTime"
                          readOnly
                          value={shipmentNumberData && shipmentNumberData.parking_yard_info ? shipmentNumberData.parking_yard_info.gate_in_date_time_string : '-'}                         
                        />
                      </CCol>

                      <CCol md={3}>
                        <CFormLabel htmlFor="pygYgoTime"> Yard Gate-Out Time </CFormLabel>
                        <CFormInput
                          name="pygYgoTime"
                          size="sm" 
                          id="pygYgoTime"
                          readOnly
                          value={shipmentNumberData && shipmentNumberData.parking_yard_info ? shipmentNumberData.parking_yard_info.gate_out_date_time_string : '-'}                         
                        />
                      </CCol>

                      <CCol md={3}>
                        <CFormLabel htmlFor="mgiTime">
                          Mill Gate In Date & Time <REQ />{' '}
                          {mgidtError && (
                            <span className="small text-danger">{"Invalid Time"}</span>
                          )}
                        </CFormLabel>
                        <CFormInput
                          name="mgiTime"
                          size="sm"
                          id="mgiTime"
                          onChange={(e) => {
                            onChangeDTInfo(e,1)
                          }}
                          type="datetime-local"
                          value={mgiTime}
                        />
                      </CCol>

                      <CCol md={3}>
                        <CFormLabel htmlFor="mgoTime">
                          Mill Gate Out Date & Time <REQ />{' '} 
                          {mgodtError && (
                            <span className="small text-danger">{"Invalid Time"}</span>
                          )}
                        </CFormLabel>
                        <CFormInput
                          name="mgoTime"
                          size="sm"
                          id="mgoTime"
                          onChange={(e) => {
                            onChangeDTInfo(e,2)
                          }}
                          type="datetime-local"
                          value={mgoTime}
                        />
                      </CCol>

                      <CCol md={3}>
                        <CFormLabel htmlFor="vehSpeed">
                          Vehicle Speed (Km/Hr) <REQ />{' '}
                        </CFormLabel>
                        <CFormInput
                          name="vehSpeed"
                          size="sm"
                          id="vehSpeed"
                          maxLength="2"
                          onChange={(e) => {
                            onChangeDTInfo(e,3)
                          }}
                          type="text"
                          value={vehSpeed}
                        />
                      </CCol>                    
                          
                    </CRow>

                    {shipmentNumberData && shipmentNumberData.shipment_all_child_info && shipmentNumberData.shipment_all_child_info.map((val, val_index) => {
                      return (
                        <>
                          <ColoredLine color="red" />
                          <CRow key={`HireshipmentChildData_${val_index}`}>
                            <CCol xs={12} md={2}>
                              <CFormLabel htmlFor="sNum">Delivery Number</CFormLabel>
                              <CFormInput
                                size="sm"
                                id="sNum"
                                value={val.delivery_no}
                                readOnly
                              />
                            </CCol>
                            <CCol xs={12} md={2}>
                            <CFormLabel htmlFor={`del_seq_${val_index}`}>Delivery Sequence<REQ />{' '}</CFormLabel>
                            <CFormSelect 
                              size="sm" 
                              name={`del_seq_${val_index}`}
                              id={`del_seq_${val_index}`}
                              onChange={(e) => {
                                onChangeDTInfo(e,7,val_index)
                              }}
                              value={shipmentTrackInfo && shipmentTrackInfo[val_index] ? shipmentTrackInfo[val_index]['DeliverySequence'] : ''}
                            >
                              <option value="">--Select--</option>                               
                              {shipmentNumberData.shipment_all_child_info.map((valdd,indii) => {
                                return (
                                  <>
                                    <option key={indii+1} value={indii+1}>
                                      {indii+1}
                                    </option>
                                  </>
                                )
                              })} 
                            </CFormSelect>
                            </CCol>
                            <CCol xs={12} md={2}>
                              <CFormLabel htmlFor="sInvoice">Invoice No. / Invoice Qty.</CFormLabel>

                              <CFormInput
                                size="sm"
                                id="sInvoice"
                                value={`${val.invoice_no ? val.invoice_no : '-'} / ${val.invoice_net_quantity ? val.invoice_net_quantity : '-'} ${val.invoice_uom ? val.invoice_uom : '-'}`}
                                readOnly
                              />
                            </CCol>
                            
                              
                            <CCol xs={12} md={2}>
                              <CFormLabel htmlFor="cNum">Customer Name</CFormLabel>

                              <CFormInput
                                size="sm"
                                id="cNum"
                                value={val.customer_info.CustomerName}
                                readOnly
                              />
                            </CCol>
                            <CCol xs={12} md={2}>
                              <CFormLabel htmlFor="cCode">Customer Code / City</CFormLabel>

                              <CFormInput
                                size="sm"
                                id="cCode"
                                value={`${val.customer_info.CustomerCode} / ${val.customer_info.CustomerCity}`}
                                readOnly
                              />
                            </CCol>
      
                            <CCol md={2}>
                              <CFormLabel htmlFor="tl_name">
                                TL Name <REQ />{' '}
                              </CFormLabel>
                              <CFormInput
                                name="tl_name"
                                size="sm"
                                id="tl_name"
                                maxLength="20"
                                onChange={(e) => {
                                  onChangeDTInfo(e,4,val_index)
                                }}
                                type="text"
                                // value={val.tl_name}
                                value={shipmentTrackInfo && shipmentTrackInfo[val_index]['tl_name']  ? shipmentTrackInfo[val_index]['tl_name'] : (`${val.tl_name ? val.tl_name: ''}`)}
                              />
                            </CCol>

                            <CCol md={2}>
                              <CFormLabel htmlFor="vehSpeed">
                                First Del. Distance in KM <REQ />{' '}
                              </CFormLabel>
                              <CFormInput
                                name="vehSpeed"
                                size="sm"
                                id="vehSpeed"
                                maxLength="3"
                                onChange={(e) => {
                                  onChangeDTInfo(e,5,val_index)
                                }}
                                type="text" 
                                value={shipmentTrackInfo && shipmentTrackInfo[val_index] ? shipmentTrackInfo[val_index]['FirstDeliveryDistance'] : ''}
                              />
                            </CCol>

                            <CCol xs={12} md={2}>
                              <CFormLabel htmlFor="cNum">Budget Running Hours</CFormLabel>

                              <CFormInput
                                size="sm"
                                id="cNum"
                                value={Find_Budget_Running_Hours(val_index)}
                                readOnly
                              />
                            </CCol>

                            <CCol xs={12} md={2}>
                              <CFormLabel htmlFor="cNum">Budget Reached Date & Time</CFormLabel>

                              <CFormInput
                                size="sm"
                                id="cNum"
                                // type="datetime-local"
                                value={Find_Budget_Reached_Date_Time(val_index)}
                                readOnly
                              />
                            </CCol>

                            <CCol xs={12} md={2}>
                              <CFormLabel htmlFor="ardTime">Actual Reached Date-Time<REQ />{' '}</CFormLabel>
                              {ardtErrorCheck(val_index) && (
                                <span className="small text-danger">{"Invalid Time"}</span>
                              )}
                              <CFormInput
                                name="ardTime"
                                size="sm"
                                id="ardTime"
                                onChange={(e) => {
                                  onChangeDTInfo(e,6,val_index)
                                }}
                                type="datetime-local"
                                // value={ardTime}
                                value={shipmentTrackInfo && shipmentTrackInfo[val_index] ? shipmentTrackInfo[val_index]['ActualReachedTime'] : ''}
                              />
                              
                            </CCol>   

                            <CCol xs={12} md={2}>
                              <CFormLabel htmlFor="cNum">Actual Time Taken</CFormLabel>

                              <CFormInput
                                size="sm"
                                id="cNum"
                                value={ardtErrorCheck(val_index) ? '-' : Find_Actual_Time_Taken(val_index)}
                                readOnly
                              />
                            </CCol>

                            <CCol xs={12} md={2}>
                              <CFormLabel htmlFor="cNum">Difference Hrs</CFormLabel>

                              <CFormInput
                                size="sm"
                                id="cNum"
                                value={ardtErrorCheck(val_index) ? '-' : Find_Difference_Hrs(val_index)}
                                readOnly
                              />
                            </CCol>
                                                  
                            <CCol md={2}>
                              <CFormLabel htmlFor="adReason">
                                Actual Delay Reason 
                              </CFormLabel>
                              <CFormInput
                                name="adReason"
                                size="sm"
                                id="adReason"
                                maxLength="30"
                                onChange={(e) => {
                                  handleRemarks(e,2,val_index)
                                }}
                                type="text"
                                // value={adReason}
                                value={shipmentTrackInfo && shipmentTrackInfo[val_index] ? shipmentTrackInfo[val_index]['ActualDelayReason'] : ''}
                              />
                            </CCol>

                            <CCol xs={12} md={2}>
                              <CFormLabel htmlFor="unloadTime">Unloading Date-Time<REQ />{' '}</CFormLabel>
                              {uldtErrorCheck(val_index) && (
                                <span className="small text-danger">{"Invalid Time"}</span>
                              )}
                              <CFormInput
                                name="unloadTime"
                                size="sm"
                                id="unloadTime"
                                onChange={(e) => {
                                  onChangeDTInfo(e,8,val_index)
                                }}
                                type="datetime-local"
                                // value={unloadTime}
                                value={shipmentTrackInfo && shipmentTrackInfo[val_index] ? shipmentTrackInfo[val_index]['UnloadingTime'] : ''}
                              />
                            </CCol>                          
                            <CCol md={2}>
                              <CFormLabel htmlFor="uldReason">
                                Unloading Delay Reason 
                              </CFormLabel>
                              <CFormInput
                                name="uldReason"
                                size="sm"
                                id="uldReason"
                                maxLength="30"
                                onChange={(e) => {
                                  handleRemarks(e,1,val_index)
                                }}
                                type="text"
                                // value={uldReason}
                                value={shipmentTrackInfo && shipmentTrackInfo[val_index] ? shipmentTrackInfo[val_index]['UnloadingDelayReason'] : ''}
                              />
                            </CCol>

                            <CCol xs={12} md={2}>
                              <CFormLabel htmlFor="cNum">Reaching to Unloading Diff.</CFormLabel>

                              <CFormInput
                                size="sm"
                                id="cNum"
                                value={uldtErrorCheck(val_index) ? '-' : Find_Reaching_to_Unloading_Diff_Hrs(val_index)}
                                readOnly
                              />
                            </CCol>

                            <CCol xs={12} md={2}>
                              <CFormLabel htmlFor="cNum">GateOut to Unloading Diff.</CFormLabel>

                              <CFormInput
                                size="sm"
                                id="cNum"
                                value={uldtErrorCheck(val_index) ? '-' : Find_Gateout_to_Unloading_Diff_Hrs(val_index)}
                                readOnly
                              />
                            </CCol>

                            <CCol xs={12} md={2}>
                              <CFormLabel htmlFor="cNum">GateIn to Unloading Diff.</CFormLabel>

                              <CFormInput
                                size="sm"
                                id="cNum"
                                value={uldtErrorCheck(val_index) ? '-' : Find_Gatein_to_Unloading_Diff_Hrs(val_index)}
                                readOnly
                              />
                            </CCol>

                          </CRow>
                        </>
                      )
                    })}
                      <ColoredLine color="red" />
                    
                    <CRow className="mb-md-1">
                      <CCol>
                        <Link to="/DeliveryTrackHome">
                          <CButton size="sm" color="primary" className="text-white" type="button">
                            Previous
                          </CButton>
                        </Link>
                      </CCol>
                      {shipmentHaving && (
                        <CCol
                          className="pull-right"
                          xs={12}
                          sm={12}
                          md={12}
                          style={{ display: 'flex', justifyContent: 'flex-end' }}
                        >
                          <CButton
                            size="s-lg"
                            color="warning"
                            className="mx-1 px-2 text-white"
                            // type="submit"
                            onClick={() => {
                              setFetch(false)
                              DTValidate()
                            }}
                          >
                            Submit
                          </CButton>
                          <Link to={'/DeliveryTrackHome'}>
                            <CButton
                              size="s-lg"
                              color="warning"
                              className="mx-1 px-2 text-white"
                              type="button"
                            >
                              Cancel
                            </CButton>
                          </Link>
                        </CCol>
                      )}
                    </CRow>        
                    
                  </CTabPane>
                </CTabContent>
              </CCard>
                
              {/* Error Modal Section */}
              <CModal visible={errorModal} onClose={() => setErrorModal(false)}>
                <CModalHeader>
                  <CModalTitle className="h4">Error</CModalTitle>
                </CModalHeader>
                <CModalBody>
                  <CRow>
                    <CCol>
                      {error && (
                        <CAlert color="danger" data-aos="fade-down">
                          {error}
                        </CAlert>
                      )}
                    </CCol>
                  </CRow>
                </CModalBody>
                <CModalFooter>
                  <CButton onClick={() => setErrorModal(false)} color="primary">
                    Close
                  </CButton>
                </CModalFooter>
              </CModal>
              {/* Error Modal Section */}
            </> ) : (<AccessDeniedComponent />)
          }
        </>
      )}
    </>
  )
}

export default DeliveryTrackMaster
