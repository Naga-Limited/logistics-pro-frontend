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

const DeliveryTrackEdit = () => {
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
  const handleRemarks = (event,type,parIndex) => {
    let tripResult = event.target.value;
    const fgsales_parent_info1 = JSON.parse(JSON.stringify(deliveryTrackData))
    if(type == 1){
       
      fgsales_parent_info1.unloading_time_delay_reason = tripResult
    } else if(type == 2){
      
      fgsales_parent_info1.rtd_reason = tripResult
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

    //section to fetch single DT info
    DeliveryTrackService.getDtInfoById(id).then((res) => { 
      setFetch(true)
      let dt_data = res.data.data
      console.log(dt_data,'getDtInfoById')
      setDeliveryTrackData(dt_data)
    })

  }, [id])

  const onChangeDTInfo = (eve, type) => {
    const fgsales_parent_info = JSON.parse(JSON.stringify(deliveryTrackData))
    if(type == 15){
      let getData61 = eve.target.value.replace(/\D/g, '')

      if(getData61){ 
        fgsales_parent_info.delivery_sequence = getData61
      } else {
        fgsales_parent_info.delivery_sequence = ''
      }
    } else if(type == 4){
      let need_val = eve.target.value.replace(/[^a-zA-Z ]/gi, '')
      let tripResult = need_val.toUpperCase(); 
      if(need_val){
        fgsales_parent_info.tl_name = tripResult 
      } else {
        fgsales_parent_info.tl_name = '' 
      }
    } else if(type == 3 || type == 5){
      let getData6 = eve.target.value.replace(/\D/g, '')

      if(getData6){ 
        type == 3 ? fgsales_parent_info.vehicle_speed = getData6 : fgsales_parent_info.fdl_distance = getData6
      } else {
        type == 3 ? fgsales_parent_info.vehicle_speed = '' : fgsales_parent_info.fdl_distance = ''
      }
    } else {
      
      let val = eve.target.value
      console.log(val,'vvaall')
      if(val){
        type == 1 ? fgsales_parent_info.mgi_time = val : type == 2 ? fgsales_parent_info.mgo_time = val : type == 6 ? fgsales_parent_info.actual_reached_time = val : type == 8 ? fgsales_parent_info.unloading_time = val : '' 
      } else {
        type == 1 ? fgsales_parent_info.mgi_time = '' : type == 2 ? fgsales_parent_info.mgo_time = '' : type == 6 ? fgsales_parent_info.actual_reached_time = '' : type == 8 ? fgsales_parent_info.unloading_time = '' : ''
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

  const Find_Budget_Running_Hours = () => {

    let veh_speed = deliveryTrackData.vehicle_speed
    let first_del_dist = deliveryTrackData.fdl_distance

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

  const Find_Budget_Reached_Date_Time = () => {

    let veh_speed = deliveryTrackData.vehicle_speed
    let first_del_dist = deliveryTrackData.fdl_distance
    let mill_go_time = deliveryTrackData.mgo_time 
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

  const Find_Actual_Time_Taken = () => {

    let mill_go_time = deliveryTrackData.mgo_time
    console.log(mill_go_time,'mill_go_time2')
    let ardTimeVal = deliveryTrackData.actual_reached_time
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

  const Find_Difference_Hrs = (parIndex) => {

    let fddikVal =  deliveryTrackData.fdl_distance
    let vehi_speed =  deliveryTrackData.vehicle_speed
    let mill_go_time = deliveryTrackData.mgo_time
    let ardTimeVal = deliveryTrackData.actual_reached_time

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

  const Find_Reaching_to_Unloading_Diff_Hrs = () => {

    let ardTimeVal =  deliveryTrackData.actual_reached_time
    console.log(ardTimeVal,'ardTimeVal1') 
    let unloadTimeVal =  deliveryTrackData.unloading_time
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

  const Find_Gateout_to_Unloading_Diff_Hrs = () => {

    let mill_go_Time = deliveryTrackData.mgo_time
    console.log(mill_go_Time,'mgoTime3')
    let unloadTimeVal =  deliveryTrackData.unloading_time
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

  const Find_Gatein_to_Unloading_Diff_Hrs = () => {

    let mill_gi_Time = deliveryTrackData.mgi_time
    console.log(mill_gi_Time,'mgiTime')
    let unloadTimeVal =  deliveryTrackData.unloading_time
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

  const uldtErrorCheck = () => {
    let unloadTimeVal =  deliveryTrackData.unloading_time ? deliveryTrackData.unloading_time : ''
    let ardTimeVal =  deliveryTrackData.actual_reached_time ? deliveryTrackData.actual_reached_time : ''

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

  const ardtErrorCheck = () => {

    let ardTimeVal = deliveryTrackData.actual_reached_time ? deliveryTrackData.actual_reached_time : ''

    let mill_go_time = deliveryTrackData.mgo_time

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
    if(deliveryTrackData.mgi_time != '' && deliveryTrackData.mgo_time != ''){

      let difference111 = diffTime(deliveryTrackData.mgi_time,deliveryTrackData.mgo_time)

      if(difference111 < 0){
        setMgodtError(true)
      } else {
        setMgodtError(false)
      }

    } else {
      setMgodtError(false)
    }

    if(deliveryTrackData.ygi_time != '' && deliveryTrackData.ygo_time != ''){

      let difference115 = diffTime(deliveryTrackData.ygi_time,deliveryTrackData.ygo_time)

      if(difference115 < 0){
        setMgidtError(true)
      } else {
        setMgidtError(false)
      }
    } else {
      setMgidtError(false)
    }

  },[deliveryTrackData])

  const DTValidate = () => {

    if(deliveryTrackData.mgi_time == ''){
      setFetch(true)
      toast.warning(`Mill Gate In Date & Time Should be required.`)
      return false
    }

    if(mgidtError){
      setFetch(true)
      toast.warning(`Mill Gate In Date & Time Should be greater than Yard Gate In Time.`)
      return false
    }

    if(deliveryTrackData.mgo_time == ''){
      setFetch(true)
      toast.warning(`Mill Gate Out Date & Time Should be required.`)
      return false
    }

    if(mgodtError){
      setFetch(true)
      toast.warning(`Mill Gate Out Date & Time Should be greater than Mill Gate In Date & Time.`)
      return false
    }

    if(deliveryTrackData.vehicle_speed == '' || deliveryTrackData.vehicle_speed == 0){
      setFetch(true)
      toast.warning(`Vehicle Speed Should be required.`)
      return false
    }

    if(deliveryTrackData.tl_name == ''){
      setFetch(true)
      toast.warning(`TL Name Should be required.`)
      return false
    }

    if(deliveryTrackData.delivery_sequence == '' || deliveryTrackData.delivery_sequence == 0){
      setFetch(true)
      toast.warning(`Delivery Sequence Should be required.`)
      return false
    }

    if(deliveryTrackData.fdl_distance == '' || deliveryTrackData.fdl_distance == 0){
      setFetch(true)
      toast.warning(`Delivery Distance Should be required.`)
      return false
    }

    if( deliveryTrackData.actual_reached_time != '' && ardtErrorCheck()){
      setFetch(true)
      toast.warning(`Actual Reached Date -Time was invalid. Kindly check and submit.`)
      return false
    }

    if( deliveryTrackData.unloading_time != '' && uldtErrorCheck()){
      setFetch(true)
      toast.warning(`Unloading Date -Time was invalid. Kindly check and submit.`)
      return false
    }

    console.log(deliveryTrackData,'deliveryTrackData')

    // setFetch(true)
    // toast.warning(`All are correct`)
    // return false
    
    const formData = new FormData()

    formData.append('_method', 'PUT')     
    formData.append('mgi_time', deliveryTrackData.mgi_time)
    formData.append('mgo_time', deliveryTrackData.mgo_time)
    formData.append('tl_name', deliveryTrackData.tl_name)
    formData.append('delivery_sequence', deliveryTrackData.delivery_sequence)
    formData.append('fdl_distance', deliveryTrackData.fdl_distance)
    formData.append('vehicle_speed', deliveryTrackData.vehicle_speed)
    formData.append('actual_reached_time', deliveryTrackData.actual_reached_time)
    formData.append('unloading_time', deliveryTrackData.unloading_time)
    formData.append('rtd_reason', deliveryTrackData.rtd_reason)
    formData.append('unloading_time_delay_reason', deliveryTrackData.unloading_time_delay_reason)
    formData.append('updated_by', user_id)
    formData.append('status', 2)

    DeliveryTrackService.updateDTInfo(id, formData).then((res) => {
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
          title: 'Delivery Tracking Info Cannot Be Updated in LP.. Kindly Contact Admin!',
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
                    
                    {deliveryTrackData && deliveryTrackData.parking_id && (
                    
                      <CRow className="mb-md-1">

                        <CCol xs={12} md={3}>
                          <CFormLabel htmlFor="sNum">Delivery Number</CFormLabel>
                          <CFormInput
                            size="sm"
                            id="sNum" 
                            value={deliveryTrackData ? deliveryTrackData.delivery_no : '-'} 
                            readOnly
                          />
                        </CCol>
                        <CCol md={3}>
                          <CFormLabel htmlFor="shipmentNo"> Shipment Number </CFormLabel>
                          <CFormInput
                            name="shipmentNo"
                            size="sm" 
                            id="shipmentNo"
                            readOnly
                            value={deliveryTrackData ? deliveryTrackData.shipment_no : '-'}                         
                          />
                        </CCol>
                        <CCol xs={12} md={3}>
                          <CFormLabel htmlFor="sInvoice">Invoice Number</CFormLabel>

                          <CFormInput
                            size="sm"
                            id="sInvoice"
                            value={deliveryTrackData ? deliveryTrackData.invoice_no : '-'} 
                            readOnly
                          />
                        </CCol>
                        <CCol xs={12} md={3}>
                          <CFormLabel htmlFor="qInvoice">Invoice Quantity</CFormLabel>

                          <CFormInput
                            size="sm"
                            id="qInvoice"
                            value={deliveryTrackData ? deliveryTrackData.invoice_qty : '-'} 
                            readOnly
                          />
                        </CCol>
                        
                          
                        <CCol xs={12} md={3}>
                          <CFormLabel htmlFor="cNum">Customer Name</CFormLabel>

                          <CFormInput
                            size="sm"
                            id="cNum"
                            value={deliveryTrackData ? deliveryTrackData.customer_name : '-'} 
                            readOnly
                          />
                        </CCol>
                        <CCol xs={12} md={3}>
                          <CFormLabel htmlFor="cCode">Customer Code / City</CFormLabel>

                          <CFormInput
                            size="sm"
                            id="cCode"
                            value={deliveryTrackData ? `${deliveryTrackData.customer_code} / ${deliveryTrackData.customer_city}` : '-'} 
                            readOnly
                          />
                        </CCol>                     
                        <CCol md={3}>
                          <CFormLabel htmlFor="tripsheetNo"> Tripsheet Number </CFormLabel>
                          <CFormInput
                            name="tripsheetNo"
                            size="sm" 
                            id="tripsheetNo"
                            readOnly
                            value={deliveryTrackData ? deliveryTrackData.tripsheet_no : '-'}                         
                          />
                        </CCol>

                        <CCol md={3}>
                          <CFormLabel htmlFor="tripsheetDivision"> Division </CFormLabel>
                          <CFormInput
                            name="tripsheetDivision"
                            size="sm" 
                            id="tripsheetDivision"
                            readOnly
                            value={deliveryTrackData ? deliveryTrackData.division : '-'}                      
                          />
                        </CCol>

                        <CCol md={3}>
                          <CFormLabel htmlFor="shipmentQty"> Shipment Qty. / Delivery Count</CFormLabel>
                          <CFormInput
                            name="shipmentQty"
                            size="sm" 
                            id="shipmentQty"
                            readOnly
                            value={`${deliveryTrackData && deliveryTrackData.shipment_info ? deliveryTrackData.shipment_info.shipment_net_qty : '-'} TON / ${deliveryTrackData && deliveryTrackData.shipment_all_child_info ? deliveryTrackData.shipment_all_child_info.length : '-'} `}                      
                          />
                        </CCol>
                          
                        {deliveryTrackData.vehicle_type_id == 3 && (
                          <CCol md={3}>
                            <CFormLabel htmlFor="shedName1"> Shed Name </CFormLabel>
                            <CFormInput
                              name="shedName1"
                              size="sm" 
                              id="shedName1"
                              readOnly
                              value={deliveryTrackData.shipment_Vendor_info && deliveryTrackData.shipment_Vendor_info[0].shed_name ? deliveryTrackData.shipment_Vendor_info[0].shed_name : '-'}                         
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
                            value={deliveryTrackData ? deliveryTrackData.vehicle_no : '-'}                              
                          />
                        </CCol>

                        <CCol md={3}>
                          <CFormLabel htmlFor="pygDriverName"> Driver Name </CFormLabel>
                          <CFormInput
                            name="pygDriverName"
                            size="sm" 
                            id="pygDriverName"
                            readOnly
                            value={deliveryTrackData ? deliveryTrackData.driver_name : '-'}                             
                          />
                        </CCol>

                        <CCol md={3}>
                          <CFormLabel htmlFor="pygDriverNo"> Driver Mobile Number </CFormLabel>
                          <CFormInput
                            name="pygDriverNo"
                            size="sm" 
                            id="pygDriverNo"
                            readOnly
                            value={deliveryTrackData ? deliveryTrackData.driver_contact_no : '-'}                           
                          />
                        </CCol>

                        <CCol md={3}>
                          <CFormLabel htmlFor="pygYgiTime"> Yard Gate-In Time </CFormLabel>
                          <CFormInput
                            name="pygYgiTime"
                            size="sm" 
                            id="pygYgiTime"
                            readOnly
                            value={deliveryTrackData ? deliveryTrackData.ygi_time : '-'}                              
                          />
                        </CCol>

                        <CCol md={3}>
                          <CFormLabel htmlFor="pygYgoTime"> Yard Gate-Out Time </CFormLabel>
                          <CFormInput
                            name="pygYgoTime"
                            size="sm" 
                            id="pygYgoTime"
                            readOnly
                            value={deliveryTrackData ? deliveryTrackData.ygo_time : '-'}                             
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
                            value={deliveryTrackData ? deliveryTrackData.mgi_time : '-'}  
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
                            value={deliveryTrackData ? deliveryTrackData.mgo_time : '-'} 
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
                            value={deliveryTrackData ? deliveryTrackData.vehicle_speed : '-'}
                          />
                        </CCol>       

                        <CCol md={3}>
                          <CFormLabel htmlFor="tlName">
                            TL Name <REQ />{' '}
                          </CFormLabel>
                          <CFormInput
                            name="tlName"
                            size="sm"
                            id="tlName"
                            maxLength="20"
                            onChange={(e) => {
                              onChangeDTInfo(e,4)
                            }}
                            type="text"
                            value={deliveryTrackData ? deliveryTrackData.tl_name : '-'}
                          />
                        </CCol>

                        <CCol md={3}>
                          <CFormLabel htmlFor="delSequnce">
                            Delivery Sequence <REQ />{' '}
                          </CFormLabel>
                          <CFormInput
                            name="delSequnce"
                            size="sm"
                            id="delSequnce"
                            maxLength="2"
                            onChange={(e) => {
                              onChangeDTInfo(e,15)
                            }}
                            type="text"
                            value={deliveryTrackData ? deliveryTrackData.delivery_sequence : '-'}
                          />
                        </CCol>

                        <CCol md={3}>
                          <CFormLabel htmlFor="vehSpeed">
                            Delivery Distance in KM <REQ />{' '}
                          </CFormLabel>
                          <CFormInput
                            name="vehSpeed"
                            size="sm"
                            id="vehSpeed"
                            maxLength="3"
                            onChange={(e) => {
                              onChangeDTInfo(e,5)
                            }}
                            type="text" 
                            value={deliveryTrackData ? deliveryTrackData.fdl_distance : '-'}
                          />
                        </CCol>
                        <CCol xs={12} md={3}>
                          <CFormLabel htmlFor="cNum">Budget Running Hours</CFormLabel>

                          <CFormInput
                            size="sm"
                            id="cNum"
                            value={Find_Budget_Running_Hours()}
                            readOnly
                          />
                        </CCol>

                        <CCol xs={12} md={3}>
                          <CFormLabel htmlFor="cNum">Budget Reached Date & Time</CFormLabel>

                          <CFormInput
                            size="sm"
                            id="cNum"
                            // type="datetime-local"
                            value={Find_Budget_Reached_Date_Time()}
                            readOnly
                          />
                        </CCol>

                        <CCol xs={12} md={3}>
                          <CFormLabel htmlFor="ardTime">Actual Reached Date-Time<REQ />{' '}</CFormLabel>
                          {ardtErrorCheck() && (
                            <span className="small text-danger">{"Invalid Time"}</span>
                          )}
                          <CFormInput
                            name="ardTime"
                            size="sm"
                            id="ardTime"
                            onChange={(e) => {
                              onChangeDTInfo(e,6)
                            }}
                            type="datetime-local" 
                            value={deliveryTrackData ? deliveryTrackData.actual_reached_time : '-'}
                          />
                          
                        </CCol>   

                        <CCol xs={12} md={3}>
                          <CFormLabel htmlFor="cNum">Actual Time Taken</CFormLabel>

                          <CFormInput
                            size="sm"
                            id="cNum"
                            value={ardtErrorCheck() ? '-' : Find_Actual_Time_Taken()}
                            readOnly
                          />
                        </CCol>

                        <CCol xs={12} md={3}>
                          <CFormLabel htmlFor="cNum">Difference Hrs</CFormLabel>

                          <CFormInput
                            size="sm"
                            id="cNum"
                            value={ardtErrorCheck() ? '-' : Find_Difference_Hrs()}
                            readOnly
                          />
                        </CCol>
                                              
                        <CCol md={3}>
                          <CFormLabel htmlFor="adReason">
                            Actual Delay Reason 
                          </CFormLabel>
                          <CFormInput
                            name="adReason"
                            size="sm"
                            id="adReason"
                            maxLength="30"
                            onChange={(e) => {
                              handleRemarks(e,2)
                            }}
                            type="text" 
                            value={deliveryTrackData ? deliveryTrackData.rtd_reason : '-'} 
                          />
                        </CCol>

                        <CCol xs={12} md={3}>
                          <CFormLabel htmlFor="unloadTime">Unloading Date-Time<REQ />{' '}</CFormLabel>
                          {uldtErrorCheck() && (
                            <span className="small text-danger">{"Invalid Time"}</span>
                          )}
                          <CFormInput
                            name="unloadTime"
                            size="sm"
                            id="unloadTime"
                            onChange={(e) => {
                              onChangeDTInfo(e,8)
                            }}
                            type="datetime-local"
                            value={deliveryTrackData ? deliveryTrackData.unloading_time : '-'}
                          />
                        </CCol>                          
                        <CCol md={3}>
                          <CFormLabel htmlFor="uldReason">
                            Unloading Delay Reason 
                          </CFormLabel>
                          <CFormInput
                            name="uldReason"
                            size="sm"
                            id="uldReason"
                            maxLength="30"
                            onChange={(e) => {
                              handleRemarks(e,1)
                            }}
                            type="text"
                            value={deliveryTrackData ? deliveryTrackData.unloading_time_delay_reason : '-'} 
                          />
                        </CCol>

                        <CCol xs={12} md={3}>
                          <CFormLabel htmlFor="cNum">Reaching to Unloading Diff.</CFormLabel>

                          <CFormInput
                            size="sm"
                            id="cNum"
                            value={uldtErrorCheck() ? '-' : Find_Reaching_to_Unloading_Diff_Hrs()}
                            readOnly
                          />
                        </CCol>

                        <CCol xs={12} md={3}>
                          <CFormLabel htmlFor="cNum">GateOut to Unloading Diff.</CFormLabel>

                          <CFormInput
                            size="sm"
                            id="cNum"
                            value={uldtErrorCheck() ? '-' : Find_Gateout_to_Unloading_Diff_Hrs()}
                            readOnly
                          />
                        </CCol>

                        <CCol xs={12} md={3}>
                          <CFormLabel htmlFor="cNum">GateIn to Unloading Diff.</CFormLabel>

                          <CFormInput
                            size="sm"
                            id="cNum"
                            value={uldtErrorCheck() ? '-' : Find_Gatein_to_Unloading_Diff_Hrs()}
                            readOnly
                          />
                        </CCol>
                            
                      </CRow>

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
                      {deliveryTrackData && deliveryTrackData.parking_id && (
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

export default DeliveryTrackEdit
