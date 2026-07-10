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
import { React, useEffect, useState } from 'react'
import useForm from 'src/Hooks/useForm.js' 
import DriverMasterValidation from 'src/Utils/Master/DriverMasterValidation'
import * as LogisticsProScreenNumberConstants from 'src/components/constants/LogisticsProScreenNumberConstants'
import { Link, useNavigate, useParams } from 'react-router-dom'
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
import DepoDriverMasterService from 'src/Service/Depo/Master/DepoDriverMasterService'
import JavascriptInArrayComponent from 'src/components/commoncomponent/JavascriptInArrayComponent'

const ShipmentDeliveryTrackEdit = () => {
  const { id } = useParams()
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
  const [deliveryTrackData, setDeliveryTrackData] = useState([])
  const [hireVendorCode, setHireVendorCode] = useState(0)
  const [shipmentHaving, setShipmentHaving] = useState(false)
  const [shipmentNumberId, setShipmentNumberId] = useState('');
  const [shedMob, setShedMob] = useState('');
  const [shed_Name, setShed_Name] = useState('');
  const [mgiTime, setMgiTime] = useState('');
  const [mgoTime, setMgoTime] = useState('');
  const [ardTime, setArdTime] = useState('');
  const [unloadTime, setUnloadTime] = useState('');
  const [uldReason, setUldReason] = useState('');
  const [adReason, setAdReason] = useState('');
  const [vehSpeed, setVehSpeed] = useState('');
  const [shedNameId, setShedNameId] = useState('');
  const [shipmentNumberData, setShipmentNumberData] = useState({});
  const [DTRemarks, setDTRemarks] = useState('');
  const [shipmentData, setShipmentData] = useState([]);
  const [pygData, setPygData] = useState([]);
  const handleRemarks = (event,type,parIndex) => {
    let tripResult = event.target.value;
    const fgsales_parent_info1 = JSON.parse(JSON.stringify(deliveryTrackData))
    if(type == 1){
       
      fgsales_parent_info1[parIndex].unloading_time_delay_reason = tripResult
    } else if(type == 2){
      
      fgsales_parent_info1[parIndex].rtd_reason = tripResult
    }
    setDeliveryTrackData(fgsales_parent_info1)
  };

  const ColoredLine = ({ color }) => (
    <hr
        style={{
            color: color,
            backgroundColor: color,
            height: 5
        }}
    />
  )

  useEffect(() => {

    // //section to fetch single DT info
    // DeliveryTrackService.getDtInfoById(id).then((res) => { 
    //   setFetch(true)
    //   let dt_data = res.data.data
    //   console.log(dt_data,'getDtInfoById')
    //   setDeliveryTrackData(dt_data)
    // })

    //section to fetch single DT info
    DeliveryTrackService.getDtInfoByShipmentId(id).then((res) => { 
      setFetch(true)
      let dt_data = res.data.data
      console.log(dt_data,'getDtInfoById')
      console.log(dt_data.shipment_info,'shipment_info')
      setShipmentData(dt_data[0].shipment_info)
      setPygData(dt_data[0].parking_yard_info)
      setDeliveryTrackData(dt_data)
    })

  }, [id])

  const onChangeDTInfo = (eve, type, key) => {
    const fgsales_parent_info = JSON.parse(JSON.stringify(deliveryTrackData))
    if(type == 15){
      let getData61 = eve.target.value.replace(/\D/g, '')

      if(getData61){ 
        fgsales_parent_info[key].delivery_sequence = getData61
      } else {
        fgsales_parent_info[key].delivery_sequence = ''
      }
    } else if(type == 4){
      let need_val = eve.target.value.replace(/[^a-zA-Z ]/gi, '')
      let tripResult = need_val.toUpperCase(); 
      if(need_val){
        fgsales_parent_info[key].tl_name = tripResult 
      } else {
        fgsales_parent_info[key].tl_name = '' 
      }
    } else if(type == 3 || type == 5){
      let getData6 = eve.target.value.replace(/\D/g, '')

      if(getData6){ 
        type == 3 ? fgsales_parent_info[key].vehicle_speed = getData6 : fgsales_parent_info[key].fdl_distance = getData6
      } else {
        type == 3 ? fgsales_parent_info[key].vehicle_speed = '' : fgsales_parent_info[key].fdl_distance = ''
      }
    } else {
      
      let val = eve.target.value
      console.log(val,'vvaall')
      if(val){
        type == 1 ? fgsales_parent_info[key].mgi_time = val : type == 2 ? fgsales_parent_info[key].mgo_time = val : type == 6 ? fgsales_parent_info[key].actual_reached_time = val : type == 8 ? fgsales_parent_info[key].unloading_time = val : '' 
      } else {
        type == 1 ? fgsales_parent_info[key].mgi_time = '' : type == 2 ? fgsales_parent_info[key].mgo_time = '' : type == 6 ? fgsales_parent_info[key].actual_reached_time = '' : type == 8 ? fgsales_parent_info[key].unloading_time = '' : ''
      }

    }
    console.log(fgsales_parent_info,'fgsales_parent_info')
    setDeliveryTrackData(fgsales_parent_info)
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

  const Find_Budget_Running_Hours = (key) => {

    let veh_speed = deliveryTrackData[0].vehicle_speed
    let first_del_dist = deliveryTrackData[key].fdl_distance

    if(veh_speed && first_del_dist){
      let time_taken = first_del_dist / veh_speed
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

  const Find_Budget_Reached_Date_Time = (key) => {

    let veh_speed = deliveryTrackData[0].vehicle_speed
    let first_del_dist = deliveryTrackData[key].fdl_distance
    let mill_go_time = shipmentData.mill_gate_out_time ? shipmentData.mill_gate_out_time : deliveryTrackData[key].mgo_time
    console.log(mill_go_time,'mill_go_time1')
    var date = new Date(mill_go_time.replace('IST', ''));
  
    if(first_del_dist == 0 || veh_speed == 0 || mill_go_time == ''){
      return '-'
    }
    let arrayval = timeConvert(first_del_dist / veh_speed,2) 
    let futureDate = strtotimeask(date, {
      hours: arrayval[0],  
      minutes: Math.round(60*(arrayval[1]/100))  
    });
    console.log(futureDate,'futureDate1');
    return futureDate
  }

  const Find_Actual_Time_Taken = (key) => {

    let mill_go_time = shipmentData.mill_gate_out_time ? shipmentData.mill_gate_out_time : deliveryTrackData[key].mgo_time
    
    console.log(mill_go_time,'mill_go_time2')
    let ardTimeVal = deliveryTrackData[key].actual_reached_time
    console.log(ardTimeVal,'ardTimeVal') 

    if(mill_go_time && ardTimeVal) {
      //new date instance
      const dt_date1 = new Date(mill_go_time);
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
    }

    return '-'
  }

  const Find_Difference_Hrs = (key) => {

    let fddikVal =  deliveryTrackData[key].fdl_distance
    let vehi_speed =  deliveryTrackData[0].vehicle_speed
    let mill_go_time = shipmentData.mill_gate_out_time ? shipmentData.mill_gate_out_time : deliveryTrackData[key].mgo_time
    let ardTimeVal = deliveryTrackData[key].actual_reached_time

    if(mill_go_time && ardTimeVal) {
      let budgetTime = (fddikVal / vehi_speed).toFixed(2)
      let actualTime = (Math.abs(new Date(mill_go_time).getTime()/1000 - new Date(ardTimeVal).getTime()/1000)/3600).toFixed(2);
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
    }

    return '-'
  }

  const Find_Reaching_to_Unloading_Diff_Hrs = (key) => {

    let ardTimeVal =  deliveryTrackData[key].actual_reached_time
    console.log(ardTimeVal,'ardTimeVal1') 
    let unloadTimeVal =  deliveryTrackData[key].unloading_time
    console.log(unloadTimeVal,'unloadTimeTime3') 

    if(unloadTimeVal && ardTimeVal) {

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
    }

    return '-'
  }

  const Find_Gateout_to_Unloading_Diff_Hrs = (key) => {

    let mill_go_Time = shipmentData.mill_gate_out_time ? shipmentData.mill_gate_out_time : deliveryTrackData[key].mgo_time
    console.log(mill_go_Time,'mgiTime3')
    let unloadTimeVal =  deliveryTrackData[key].unloading_time
    console.log(unloadTimeVal,'unloadTimeTime2') 

    if(unloadTimeVal && mill_go_Time) {
      //new date instance
      const dt_date1 = new Date(mill_go_Time);
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
    }

    return '-'
  }

  const Find_Gatein_to_Unloading_Diff_Hrs = (key) => {

    let mill_gi_Time = shipmentData.mill_gate_in_time ? shipmentData.mill_gate_in_time : deliveryTrackData[key].mgi_time
    console.log(mill_gi_Time,'mgiTime')
    let unloadTimeVal =  deliveryTrackData[key].unloading_time
    console.log(unloadTimeVal,'unloadTimeTime1') 

    if(unloadTimeVal && mill_gi_Time) {
      //new date instance
      const dt_date1 = new Date(mill_gi_Time);
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
    }

    return '-'
  }

  const [mgodtError, setMgodtError] = useState(false) 
  const [mgidtError, setMgidtError] = useState(false) 

  const uldtErrorCheck = (key) => {
    let unloadTimeVal =  deliveryTrackData[key].unloading_time ? deliveryTrackData[key].unloading_time : ''
    let ardTimeVal =  deliveryTrackData[key].actual_reached_time ? deliveryTrackData[key].actual_reached_time : ''

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

  const ardtErrorCheck = (key) => {
    console.log(deliveryTrackData,'deliveryTrackData - ',key)
    let ardTimeVal = deliveryTrackData[key].actual_reached_time ? deliveryTrackData[key].actual_reached_time : ''

    let mill_go_time = shipmentData.mill_gate_out_time ? shipmentData.mill_gate_out_time : deliveryTrackData[key].mgo_time

    if(ardTimeVal != '' && mill_go_time != ''){

      let difference112 = diffTime(mill_go_time,ardTimeVal)

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
    if(shipmentData.mgi_time != '' && shipmentData.mgo_time != ''){

      let difference111 = diffTime(shipmentData.mgi_time,shipmentData.mgo_time)

      if(difference111 < 0){
        setMgodtError(true)
      } else {
        setMgodtError(false)
      }

    } else {
      setMgodtError(false)
    }

    if(pygData.gate_in_date_time_org != '' && pygData.gate_out_date_time_org != ''){

      let difference115 = diffTime(pygData.ygi_time,pygData.ygo_time)

      if(difference115 < 0){
        setMgidtError(true)
      } else {
        setMgidtError(false)
      }
    } else {
      setMgidtError(false)
    }

  },[pygData])

  const DTValidate = () => {

    if(shipmentData.mgi_time == ''){
      setFetch(true)
      toast.warning(`Mill Gate In Date & Time Should be required.`)
      return false
    }

    if(mgidtError){
      setFetch(true)
      toast.warning(`Mill Gate In Date & Time Should be greater than Yard Gate In Time.`)
      return false
    }

    if(shipmentData.mgo_time == ''){
      setFetch(true)
      toast.warning(`Mill Gate Out Date & Time Should be required.`)
      return false
    }

    if(mgodtError){
      setFetch(true)
      toast.warning(`Mill Gate Out Date & Time Should be greater than Mill Gate In Date & Time.`)
      return false
    }

    if(deliveryTrackData[0].vehicle_speed == '' || deliveryTrackData[0].vehicle_speed == 0){
      setFetch(true)
      toast.warning(`Vehicle Speed Should be required.`)
      return false
    }

    let tl_name_condition = 0
    let delivery_sequence_empty = 0
    let delivery_sequence_condition = false
    let fdl_distance_condition = 0
    let actual_reached_time_empty = 0
    let actual_reached_time_condition = 0
    let unloading_time_time_empty = 0
    let unloading_time_time_condition = 0

    let del_seq_array = []

    deliveryTrackData.map((bg,kg)=>{
      if(bg.tl_name == ''){
        tl_name_condition = 1
      }
      if(bg.delivery_sequence == '' || bg.delivery_sequence == 0){
        delivery_sequence_empty = 1
      }
      if(bg.fdl_distance == '' || bg.fdl_distance == 0){
        fdl_distance_condition = 1
      }
      if(bg.actual_reached_time == ''){
        actual_reached_time_empty = 1
      }
      if(bg.actual_reached_time != '' && ardtErrorCheck(kg)){
        actual_reached_time_condition = 1
      }
      if(bg.unloading_time == ''){
        unloading_time_time_empty = 1
      }
      if(bg.unloading_time != '' && uldtErrorCheck(kg)){
        unloading_time_time_condition = 1
      }
      del_seq_array.push(Number(bg.delivery_sequence))      
    })
    let sp_array = shipmentData.shipment_all_child_info
    let sp_num_array = []

    for (let ind = 0; ind < sp_array.length; ind++) {
      sp_num_array.push(ind+1)
    }
    del_seq_array.sort(function(a, b){return a - b}) /* Array Sorting in js */
    delivery_sequence_condition = del_seq_array.join() == sp_num_array.join(); /* Check 2 Arrays are Same or not in js */
    console.log(delivery_sequence_condition,'delivery_sequence_condition')
    console.log(sp_num_array,'del_seq_array-sp_num_array')
    console.log(del_seq_array,'del_seq_array')

    if(tl_name_condition == 1){
      setFetch(true)
      toast.warning(`TL Name in One of the DT data was missed.`)
      return false
    }

    if(delivery_sequence_empty == 1){
      setFetch(true)
      toast.warning(`Delivery Sequence in One of the DT data was missed.`)
      return false
    }

    if(delivery_sequence_condition){
      //
    } else {
      setFetch(true)
      toast.warning(`Delivery Sequence in One of the DT data was invalid. Kindly check and submit.`)
      return false
    }

    if(fdl_distance_condition == 1){
      setFetch(true)
      toast.warning(`Delivery Distance in One of the DT data was missed.`)
      return false
    } 

    if(actual_reached_time_empty == 1){
      setFetch(true)
      toast.warning(`Actual Reached Time in One of the DT data was missed.`)
      return false
    } 

    if( actual_reached_time_condition == 1){
      setFetch(true)
      toast.warning(`Actual Reached Date Time in One of the DT data was invalid. Kindly check and submit.`)
      return false
    }

    if(unloading_time_time_empty == 1){
      setFetch(true)
      toast.warning(`Unloading Time in One of the DT data was missed.`)
      return false
    } 

    if(unloading_time_time_condition == 1){
      setFetch(true)
      toast.warning(`Unloading Date Time in One of the DT data was invalid. Kindly check and submit.`)
      return false
    }

    console.log(deliveryTrackData,'deliveryTrackData')

    // setFetch(true)
    // toast.warning(`All are correct`)
    // return false
    
    const formData = new FormData()

    formData.append('parking_id', deliveryTrackData[0].parking_id) 
    formData.append('shipment_id', deliveryTrackData[0].shipment_id)  
    formData.append('vehicle_speed', deliveryTrackData[0].vehicle_speed)
    formData.append('mgi_time', shipmentData.mill_gate_in_time)
    formData.append('mgo_time', shipmentData.mill_gate_out_time) 
    formData.append('updated_by', user_id)
    formData.append('status', 2)
    formData.append('delivery_track_data', JSON.stringify(deliveryTrackData))

    DeliveryTrackService.updateShipmentDTInfo(formData).then((res) => {
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
          text:  res.data.err_message,
          icon: "warning",
          confirmButtonText: "OK",
        }).then(function () {
          // window.location.reload(false)
        });

      } else {
        Swal.fire({
          title: 'Shipment Delivery Tracking Info Cannot Be Updated in LP.. Kindly Contact Admin!',
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

  function formatDate1(date) {
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

  const formatDate = (inputDate) => {
    const date = new Date(inputDate);

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12;
    hours = hours ? hours : 12;
    const formattedHours = String(hours).padStart(2, '0');

    return `${day}-${month}-${year} ${formattedHours}:${minutes} ${ampm}`;
  }

  const millgateinouttimefinder = (type) => {
    let mgi_time = ''
    let mgo_time = ''
    if(type == 1){
      mgi_time = shipmentData && shipmentData.mill_gate_in_time ? formatDate(shipmentData.mill_gate_in_time) : (deliveryTrackData && deliveryTrackData[0] && deliveryTrackData[0].mgi_time ? formatDate(deliveryTrackData[0].mgi_time) : '-')
      return mgi_time
    } else if(type == 2){
      mgo_time = shipmentData && shipmentData.mill_gate_out_time ? formatDate(shipmentData.mill_gate_out_time) : (deliveryTrackData && deliveryTrackData[0] && deliveryTrackData[0].mgo_time ? formatDate(deliveryTrackData[0].mgo_time) : '-')
      return mgo_time
    } 
    
  }

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

                      <CCol md={3}>
                        <CFormLabel htmlFor="tripsheetNo"> Tripsheet No. / Date </CFormLabel>
                        <CFormInput
                          name="tripsheetNo"
                          size="sm" 
                          id="tripsheetNo"
                          readOnly
                          value={`${deliveryTrackData && deliveryTrackData[0] && deliveryTrackData[0].trip_sheet_info ? deliveryTrackData[0].trip_sheet_info.trip_sheet_no : '-'} / ${deliveryTrackData && deliveryTrackData[0] && deliveryTrackData[0].trip_sheet_info ? formatDate1(deliveryTrackData[0].trip_sheet_info.created_at) : '-'}`}                         
                        />
                      </CCol>                    

                      <CCol md={3}>
                        <CFormLabel htmlFor="tripsheetNo"> Shipment No. / Date </CFormLabel>
                        <CFormInput
                          name="tripsheetNo"
                          size="sm" 
                          id="tripsheetNo"
                          readOnly
                          value={`${shipmentData && shipmentData.shipment_no} / ${shipmentData && shipmentData.created_at ? shipmentData.created_at : '-'}`}                        
                        />
                      </CCol> 

                      <CCol md={3}>
                        <CFormLabel htmlFor="tripsheetDivision">Vehicle No. / Division </CFormLabel>
                        <CFormInput
                          name="tripsheetDivision"
                          size="sm" 
                          id="tripsheetDivision"
                          readOnly
                          value={`${deliveryTrackData && deliveryTrackData[0] && deliveryTrackData[0].vehicle_no} / ${deliveryTrackData && deliveryTrackData[0] && deliveryTrackData[0].division}`}                        
                        />
                      </CCol>

                      <CCol md={3}>
                        <CFormLabel htmlFor="shipmentQty"> Shipment Qty. / Shed Name</CFormLabel>
                        <CFormInput
                          name="shipmentQty"
                          size="sm" 
                          id="shipmentQty"
                          readOnly
                          value={`${shipmentData && shipmentData.billed_net_qty ? shipmentData.billed_net_qty + ' TON': ( shipmentData.shipment_net_qty ? shipmentData.shipment_net_qty + ' TON' : '-') } / ${deliveryTrackData && deliveryTrackData[0] && deliveryTrackData[0].shipment_Vendor_info && deliveryTrackData[0].shipment_Vendor_info[0] && deliveryTrackData[0].shipment_Vendor_info[0].shed_name ? deliveryTrackData[0].shipment_Vendor_info[0].shed_name : '-'}`}                         
                        />
                      </CCol>  

                      <CCol md={3}>
                        <CFormLabel htmlFor="pygDriverName"> Driver Name / Mobile No. </CFormLabel>
                        <CFormInput
                          name="pygDriverName"
                          size="sm" 
                          id="pygDriverName"
                          readOnly
                          value={`${deliveryTrackData && deliveryTrackData[0] && deliveryTrackData[0].driver_name} / ${deliveryTrackData && deliveryTrackData[0] && deliveryTrackData[0].driver_contact_no}`}                     
                        />
                      </CCol>

                      <CCol md={3}>
                        <CFormLabel htmlFor="pygYgiTime"> Yard Gate-In Time </CFormLabel>
                        <CFormInput
                          name="pygYgiTime"
                          size="sm" 
                          id="pygYgiTime"
                          readOnly
                          value={pygData ? pygData.gate_in_date_time_string : '-'}                         
                        />
                      </CCol>

                      <CCol md={3}>
                        <CFormLabel htmlFor="pygYgoTime"> Yard Gate-Out Time </CFormLabel>
                        <CFormInput
                          name="pygYgoTime"
                          size="sm" 
                          id="pygYgoTime"
                          readOnly
                          value={pygData ? pygData.gate_out_date_time_string : '-'}                         
                        />
                      </CCol>

                      <CCol md={3}>
                        <CFormLabel htmlFor="mgiTime"> Mill Gate In Date & Time </CFormLabel>
                        <CFormInput
                          name="mgiTime"
                          size="sm" 
                          id="mgiTime"
                          readOnly  
                          // value={shipmentData && shipmentData.mill_gate_in_time ? formatDate(shipmentData.mill_gate_in_time) : '-'}                         
                          value={millgateinouttimefinder(1)}                         
                        />
                      </CCol>

                      <CCol md={3}>
                        <CFormLabel htmlFor="mgoTime"> Mill Gate Out Date & Time </CFormLabel>
                        <CFormInput
                          name="mgoTime"
                          size="sm" 
                          id="mgoTime"
                          readOnly
                          // value={shipmentData && shipmentData.mill_gate_out_time ? formatDate(shipmentData.mill_gate_out_time) : '-'}  
                          value={millgateinouttimefinder(2)}
                        />
                      </CCol>

                      <CCol md={3}>
                        <CFormLabel htmlFor="tptTime"> Truck Placement Date & Time </CFormLabel>
                        <CFormInput
                          name="tptTime"
                          size="sm" 
                          id="tptTime"
                          readOnly
                          value={shipmentData && shipmentData.truck_placement_time ? formatDate(shipmentData.truck_placement_time) : '-'}                         
                        />
                      </CCol>

                      <CCol md={3}>
                        <CFormLabel htmlFor="dotTime"> Despatch DO Date & Time </CFormLabel>
                        <CFormInput
                          name="dotTime"
                          size="sm" 
                          id="dotTime"
                          readOnly
                          value={shipmentData && shipmentData.despatch_do_time ? formatDate(shipmentData.despatch_do_time) : '-'}                         
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
                            onChangeDTInfo(e,3,0)
                          }}
                          type="text"
                          value={deliveryTrackData && deliveryTrackData[0] ? deliveryTrackData[0].vehicle_speed : ''}
                        />
                      </CCol>                    
                          
                    </CRow>
                    
                    {deliveryTrackData && deliveryTrackData.length > 0 && (
                       
                      deliveryTrackData.map((data, index) => {
                        return (
                          <>  
                            <ColoredLine color="red" />                       
                            <CRow className="mb-md-1">

                              <CCol xs={12} md={2}>
                                <CFormLabel htmlFor="sNum">Delivery Number</CFormLabel>
                                <CFormInput
                                  size="sm"
                                  id="sNum" 
                                  value={data.delivery_no} 
                                  readOnly
                                />
                              </CCol>
                             
                              <CCol md={2}>
                                <CFormLabel htmlFor="delSequnce">
                                  Delivery Sequence <REQ />{' '}
                                </CFormLabel>
                                <CFormSelect 
                                  size="sm" 
                                  name={`del_seq_${index}`}
                                  id={`del_seq_${index}`}
                                  onChange={(e) => {
                                    onChangeDTInfo(e,15,index)
                                  }} 
                                  value={data.delivery_sequence}
                                >
                                  <option value="">--Select--</option>                               
                                  {data.shipment_all_child_info.map((valdd,indii) => {
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
                                  value={`${data.invoice_no} / ${data.invoice_qty}`}
                                  readOnly
                                />
                              </CCol>                               
                                
                              <CCol xs={12} md={2}>
                                <CFormLabel htmlFor="cNum">Customer Name</CFormLabel>

                                <CFormInput
                                  size="sm"
                                  id="cNum"
                                  value={data.customer_name} 
                                  readOnly
                                />
                              </CCol>
                              <CCol xs={12} md={2}>
                                <CFormLabel htmlFor="cCode">Customer Code / City</CFormLabel>

                                <CFormInput
                                  size="sm"
                                  id="cCode"
                                  value={`${data.customer_code} / ${data.customer_city}`} 
                                  readOnly
                                />
                              </CCol>   
                                 

                              <CCol md={2}>
                                <CFormLabel htmlFor="tlName">
                                  TL Name <REQ />{' '}
                                </CFormLabel>
                                <CFormInput
                                  name="tlName"
                                  size="sm"
                                  id="tlName"
                                  maxLength="20"
                                  onChange={(e) => {
                                    onChangeDTInfo(e,4,index)
                                  }}
                                  type="text"
                                  value={data.tl_name}
                                />
                              </CCol> 
                              <CCol md={2}>
                                <CFormLabel htmlFor="delDistance">
                                  Delivery Distance in KM <REQ />{' '}
                                </CFormLabel>
                                <CFormInput
                                  name="delDistance"
                                  size="sm"
                                  id="delDistance"
                                  maxLength="3"
                                  onChange={(e) => {
                                    onChangeDTInfo(e,5,index)
                                  }}
                                  type="text" 
                                  value={data.fdl_distance}
                                />
                              </CCol>
                                
                              <CCol xs={12} md={2}>
                                <CFormLabel htmlFor="cNum">Budget Running Hours</CFormLabel>

                                <CFormInput
                                  size="sm"
                                  id="cNum"
                                  value={Find_Budget_Running_Hours(index)}
                                  readOnly
                                />
                              </CCol>

                              <CCol xs={12} md={2}>
                                <CFormLabel htmlFor="cNum">Budget Reached Date & Time</CFormLabel>

                                <CFormInput
                                  size="sm"
                                  id="cNum"
                                  // type="datetime-local"
                                  value={Find_Budget_Reached_Date_Time(index)}
                                  readOnly
                                />
                              </CCol>

                              <CCol xs={12} md={2}>
                                <CFormLabel htmlFor="ardTime">Actual Reached Date-Time<REQ />{' '}</CFormLabel>
                                {ardtErrorCheck(index) && (
                                  <span className="small text-danger">{"Invalid Time"}</span>
                                )}
                                <CFormInput
                                  name="ardTime"
                                  size="sm"
                                  id="ardTime"
                                  onChange={(e) => {
                                    onChangeDTInfo(e,6,index)
                                  }}
                                  type="datetime-local" 
                                  value={data.actual_reached_time}
                                />
                                
                              </CCol>   

                              <CCol xs={12} md={2}>
                                <CFormLabel htmlFor="cNum">Actual Time Taken</CFormLabel>

                                <CFormInput
                                  size="sm"
                                  id="cNum"
                                  value={ardtErrorCheck(index) ? '-' : Find_Actual_Time_Taken(index)}
                                  readOnly
                                />
                              </CCol>

                              <CCol xs={12} md={2}>
                                <CFormLabel htmlFor="cNum">Difference Hrs</CFormLabel>

                                <CFormInput
                                  size="sm"
                                  id="cNum"
                                  value={ardtErrorCheck(index) ? '-' : Find_Difference_Hrs(index)}
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
                                    handleRemarks(e,2,index)
                                  }}
                                  type="text" 
                                  value={data.rtd_reason} 
                                />
                              </CCol>
                              

                              <CCol xs={12} md={2}>
                                <CFormLabel htmlFor="unloadTime">Unloading Date-Time<REQ />{' '}</CFormLabel>
                                {uldtErrorCheck(index) && (
                                  <span className="small text-danger">{"Invalid Time"}</span>
                                )}
                                <CFormInput
                                  name="unloadTime"
                                  size="sm"
                                  id="unloadTime"
                                  onChange={(e) => {
                                    onChangeDTInfo(e,8,index)
                                  }}
                                  type="datetime-local"
                                  value={data.unloading_time}
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
                                    handleRemarks(e,1,index)
                                  }}
                                  type="text"
                                  value={data.unloading_time_delay_reason} 
                                />
                              </CCol>

                              <CCol xs={12} md={2}>
                                <CFormLabel htmlFor="cNum">Reaching to Unloading Diff.</CFormLabel>

                                <CFormInput
                                  size="sm"
                                  id="cNum"
                                  value={uldtErrorCheck(index) ? '-' : Find_Reaching_to_Unloading_Diff_Hrs(index)}
                                  readOnly
                                />
                              </CCol>

                              <CCol xs={12} md={2}>
                                <CFormLabel htmlFor="cNum">GateOut to Unloading Diff.</CFormLabel>

                                <CFormInput
                                  size="sm"
                                  id="cNum"
                                  value={uldtErrorCheck(index) ? '-' : Find_Gateout_to_Unloading_Diff_Hrs(index)}
                                  readOnly
                                />
                              </CCol>

                              <CCol xs={12} md={2}>
                                <CFormLabel htmlFor="cNum">GateIn to Unloading Diff.</CFormLabel>

                                <CFormInput
                                  size="sm"
                                  id="cNum"
                                  value={uldtErrorCheck(index) ? '-' : Find_Gatein_to_Unloading_Diff_Hrs(index)}
                                  readOnly
                                />
                              </CCol>
                                  
                            </CRow>
                          </>
                        )
                      })

                    )}
                     
                    <ColoredLine color="red" />
                    
                    <CRow className="mb-md-1">
                      <CCol>
                        <Link to="/DeliveryTrackHome">
                          <CButton size="sm" color="primary" className="text-white" type="button">
                            Previous
                          </CButton>
                        </Link>
                      </CCol>
                      
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
                          Update
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

export default ShipmentDeliveryTrackEdit
