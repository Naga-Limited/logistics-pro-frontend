/* eslint-disable prettier/prettier */
import {
  CButton,
  CCard,
  CCol,
  CAlert, 
  CFormInput,
  CFormLabel,
  CFormSelect, 
  CRow,
  CTabContent, 
  CTabPane, 
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CTooltip,
} from '@coreui/react' 
import React, { useState, useEffect } from 'react'
import useForm from 'src/Hooks/useForm.js' 
import DriverMasterValidation from 'src/Utils/Master/DriverMasterValidation'
import * as LogisticsProScreenNumberConstants from 'src/components/constants/LogisticsProScreenNumberConstants'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css' 
import Loader from 'src/components/Loader'  
import Swal from 'sweetalert2'
import AccessDeniedComponent from 'src/components/commoncomponent/AccessDeniedComponent'
import JavascriptInArrayComponent from 'src/components/commoncomponent/JavascriptInArrayComponent'
import OVTICSearchSelectComponent from './OVTICSearchSelectComponent'
import AdminSettingsService from 'src/Service/AdminSettings/AdminSettingsService'
import ParkingYardGateService from 'src/Service/ParkingYardGate/ParkingYardGateService'
import TripInfoCaptureService from 'src/Service/TripInfoCapture/TripInfoCaptureService'
import CustomerCreationService from 'src/Service/CustomerCreation/CustomerCreationService'
import DieselVendorMasterService from 'src/Service/Master/DieselVendorMasterService'
const OVTICHomeEdit = () => {
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
  let page_no = LogisticsProScreenNumberConstants.DeliveryTrackModule.OVTIC_Screen

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

  const [ticData, setTicData] = useState([])
  const [ticChild1Data, setTicChild1Data] = useState([])
  const [ticChild2Data, setTicChild2Data] = useState([])
  const [rmothersInfoData, setRmothersInfoData] = useState([])
  const [fgstoInfoData, setFgstoInfoData] = useState([])
  const [fgsalesInfoData, setFgsalesInfoData] = useState([])
  const [rjsoInfodata, setRjsoInfodata] = useState([])
  const [dvData, setDvData] = useState([])

  const otherDataSplitProcess = (data) => {
    console.log(data,'otherDataSplitProcess')
    setTrRemarks(data.remarks ? data.remarks : '')
    setBvremarks(data.bvremarks ? data.bvremarks : '')
    setTwkm(data.truck_work_km ? data.truck_work_km : '')
    setMish(data.mileage_shortage ? data.mileage_shortage : '')
    setCrload(data.company_return_load ? data.company_return_load : '')
  }

  const childSplitProcess = (data) => {
    let rjso_data = data.filter((data) => data.child_type == 2 ) 
    let rm_data = data.filter((data) => data.child_type == 4 ) 
    let fg_data = data.filter((data) => data.child_type == 1 ) 
    let fgsto_data = data.filter((data) => data.child_type == 3 ) 
    
    console.log(fg_data,'qqq fg_data-1')
    console.log(rjso_data,'qqq rjso_data-2')
    console.log(fgsto_data,'qqq fgsto_data-3')
    console.log(rm_data,'qqq rm_data-4')

    setRmothersInfoData(rm_data)
    setFgstoInfoData(fgsto_data)
    setFgsalesInfoData(fg_data)
    setRjsoInfodata(rjso_data)
  }

  useEffect(() => {

    //section to fetch single DT info
    TripInfoCaptureService.getTICInfoById(id).then((res) => { 
      setFetch(true)
      let dt_data = res.data.data

      if(dt_data){
        otherDataSplitProcess(dt_data)
        console.log(dt_data,'getTICInfoById')
        if(dt_data.tic_child1_info){
          setTicChild1Data(dt_data.tic_child1_info)
          childSplitProcess(dt_data.tic_child1_info)
        }
        console.log(dt_data.tic_child1_info,'dt_data.tic_child1_info')
        console.log(dt_data.tic_child2_info,'dt_data.tic_child2_info')
        if(dt_data.tic_child2_info){
          setTicChild2Data(dt_data.tic_child2_info)
        }
        setTripsheetHaving(true)
        setTripsheetNumberValue(dt_data.ts_no)
        setTicData(dt_data)
      }
    })

    CustomerCreationService.getCustomerCreationData().then((res) => {
      const filterData_shed = res.data.data
      console.log(filterData_shed,'getCustomerCreationData') 
      setShedName(filterData_shed) 
    })

    DieselVendorMasterService.getDieselVendors().then((response) => {
      let viewData = response.data.data
      console.log(viewData,'getDieselVendors')
      setDvData(viewData)
    })

  }, [id])

  const navigation = useNavigate()
  const [errorModal, setErrorModal] = useState(false)
  const [error, setError] = useState({})

  const { values, errors, handleChange, onFocus, handleSubmit, enableSubmit, onBlur } = useForm(
    // addNewDriver,
    DriverMasterValidation,
    formValues
  )

  const dieselVendorFinder = (vendor_code) => {

    console.log(dvData,'dieselVendorFinder-dvData')
    console.log(vendor_code,'dieselVendorFinder-vendor_code')
    let vendorName = '-'
    for (let i = 0; i < dvData.length; i++) {
      if (dvData[i].vendor_code == vendor_code) {
        vendorName = dvData[i].diesel_vendor_name
      }
    }
    console.log(vendorName,'dieselVendorFinder-vendorName')
    return vendorName
  }
  
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
  const [tripsheetHaving, setTripsheetHaving] = useState(false)
  const [tripsheetNumberId, setTripsheetNumberId] = useState('');
  const [tripsheetNumberValue, setTripsheetNumberValue] = useState('');
  const [shedMob, setShedMob] = useState('');
  const [shed_Name, setShed_Name] = useState('');
  const [mgiTime, setMgiTime] = useState('');
  const [mgoTime, setMgoTime] = useState(''); 
  const [uldReason, setUldReason] = useState('');
  const [adReason, setAdReason] = useState('');
  const [vehSpeed, setVehSpeed] = useState('');
  const [shedNameId, setShedNameId] = useState('');
  const [shedName, setShedName] = useState([])
  const [shipmentNumberData, setShipmentNumberData] = useState({}); 
  const [tripsheetNumberData, setTripsheetNumberData] = useState({}); 
  const [shipmentData, setShipmentData] = useState([]);
  const [tripsheetData, setTripsheetData] = useState([]);
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
      setTripsheetHaving(true)
      setTripsheetNumberId(selected_value)
      console.log(tripsheetData, 'selected_value-tripsheetData')

      tripsheetData.map((vv,kk)=>{ 
        console.log(vv, 'selected_value-vv')
        
        if(selected_value == vv.trip_sheet_id){
          setTripsheetNumberValue(vv.trip_sheet_no)
        }
      })
    } else {
      setTripsheetHaving(false)
      setTripsheetNumberId('')
      setMgiTime('')
      setMgoTime('')
      setVehSpeed('') 
      setTripsheetNumberValue('') 
    }
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

  useEffect(()=>{
    if(tripsheetHaving && tripsheetNumberValue != ''){
      // AdminSettingsService.getTripsheetNumber5Data(tripsheetNumberValue).then((res) => {
      AdminSettingsService.getTICDataByTripsheet(tripsheetNumberValue).then((res) => {
        let ans_data = res.data.data
        console.log(ans_data,'getTICDataByTripsheet')
        setTripsheetNumberData(ans_data)
      })
    } else {
      setTripsheetNumberData({})
    }
  },[tripsheetNumberValue])

  useEffect(() => {
    console.log(freshType,'freshType')
    if(freshType === 0){
      // loadTripShipmentReport()
    }    
  }, [freshType])

  // const loadTripShipmentReport = (fresh_type = '') => {
    
  //   if(fresh_type !== '1'){
  //     //section for getting Location Data from database
  //     TripInfoCaptureService.getOVOTInfoForReport().then((res) => {
  //       console.log(res.data.data,'getOVOTInfoForReport')
  //       setFetch(true)
  //       setSmallFetch(true)
  //       setSearchFilterData(res.data.data)
  //       setTripsheetData(res.data.data)
  //     })
  //   }
    
  // }

  function diffTime(start, end) {

    let st = new Date(start)
    let et = new Date(end)
    return (et-st)/1000
  }

  const timeConvert = (timeconst,type) => {
    console.log(timeconst,'timeconst')
    console.log(type,'type') 
    if(isNaN(timeconst)){
      return '-'
    }
    const myArray = timeconst.toString().split(".");
    let timeConvertValue = `${myArray[0]} hours ${Math.round(60*(myArray[1]/100))} mins`
    console.log(myArray,'myArray')
    console.log(timeConvertValue,'timeConvertValue')

    if(type == 1){
      return timeConvertValue
    } else {
      return myArray
    }
    
  }

  const [mgodtError, setMgodtError] = useState(false) 
  const [mgidtError, setMgidtError] = useState(false) 

  const tripPurposeFinder = (code) => {
    let p_code = '-'
    if(code == '1'){
      p_code = 'FG-SALES'
    } else if(code == '2'){
      p_code = 'FG-STO'
    } else if(code == '3'){
      p_code = 'RM-STO'
    } else if(code == '4'){
      p_code = 'OTHERS'
    } else if(code == '5'){
      p_code = 'FCI'
    }
    return p_code
  }

  const [vehicleRequestsData, setVehicleRequestsData] = useState([])

  useEffect(()=>{

    if(tripsheetNumberData && tripsheetNumberData.trip_sheet_info){
      console.log(tripsheetNumberData.trip_sheet_info.vehicle_requests,'vehicle_requests')

      let veh_req = tripsheetNumberData.trip_sheet_info.vehicle_requests // 7,8,9

      if(veh_req != null){

        const formData = new FormData()
        formData.append('vr_string', veh_req)

        ParkingYardGateService.fetchVRList(formData).then((res) => {
          setSmallFetch(true)
          console.log(res,'fetchVRList')
          let vrlistData = res.data.data
          setVehicleRequestsData(vrlistData)

        })

      } else {
        setSmallFetch(true)
      }

    }

  },[tripsheetNumberData])

  const divFinder = (data) => {
    if(data.purpose == '4'){
      return othersDivisionFinder(data.vehicle_requests)
    } else if(data.purpose == '5' || data.purpose == '3'){
      return 'NLFD'
    } else if(data.purpose == '1' || data.purpose == '2'){
      let ans = data.to_divison == '2' ? 'NLCD' : 'NLFD'
      return ans
    } else {
      return '-'
    }

  }
  const othersDivisionFinder = (vrId) => {
    let div = 0
    console.log(vrId,'vrId-othersDivisionFinder')
    console.log(vehicleRequestsData,'vehicleRequestsData-othersDivisionFinder')
    let myArray = vrId.split(",")
    console.log(myArray,'myArray-othersDivisionFinder')
    vehicleRequestsData.map((vh,kh)=>{ 
      if(JavascriptInArrayComponent(vh.vr_id,myArray)){ 
        div = vh.vr_division
      }
    })
    console.log(div,'div-othersDivisionFinder') 
    return othersDivisionArray[div]
  }

  const FJ_Empty_Km_Finder = (type,child_key) => {

    console.log(tripsheetNumberData,'FJ_Empty_Km_Finder-tripsheetNumberData')
    console.log(ticData,'FJ_Empty_Km_Finder-ticData')
    console.log(child_key,'FJ_Empty_Km_Finder-child_key')
    console.log(type,'FJ_Empty_Km_Finder-type')
    let val = 0
    if(type == 1){ /* FG_SALES */   
      let start = Number(val_definer(fgsalesInfoData[child_key][`from_empty_km_input`],fgsalesInfoData[child_key][`from_empty_km`]))
      let end = Number(val_definer(fgsalesInfoData[child_key][`opening_km_input`],fgsalesInfoData[child_key][`opening_km`]))
      let ans = end - start 
      console.log(ans,'FJ_Empty_Km_Finder-ans')
      return ans && ans > 0 ? ans : 0 
    } else if(type == 2){ /* FG_STO */ 
      let start = Number(val_definer(fgstoInfoData[child_key][`from_empty_km_input`],fgstoInfoData[child_key][`from_empty_km`]))
      let end = Number(val_definer(fgstoInfoData[child_key][`opening_km_input`],fgstoInfoData[child_key][`opening_km`]))
      let ans = end - start 
      console.log(ans,'FJ_Empty_Km_Finder-ans')
      return ans && ans > 0 ? ans : 0 
    } else if(type == 3){ /* RMO */ 
      let start = Number(val_definer(rmothersInfoData[child_key][`from_empty_km_input`],rmothersInfoData[child_key][`from_empty_km`]))
      let end = Number(val_definer(rmothersInfoData[child_key][`opening_km_input`],rmothersInfoData[child_key][`opening_km`])) 
      let ans = end - start 
      console.log(ans,'FJ_Empty_Km_Finder-ans')
      return ans && ans > 0 ? ans : 0 
    } else if(type == 4){ /* RJSOO */   
      let start = Number(val_definer(rjsoInfodata[child_key][`from_empty_km_input`],rjsoInfodata[child_key][`from_empty_km`]))
      let end = Number(val_definer(rjsoInfodata[child_key][`opening_km_input`],rjsoInfodata[child_key][`opening_km`]))  
      let ans = end - start 
      console.log(ans,'FJ_Empty_Km_Finder-ans')
      return ans && ans > 0 ? ans : 0 
    }

    return val

  }

  const val_definer = (val1,val2) => {
    if(val1 || val1 == '' || val1 == 0){
      return val1
    }
    return val2
  }

  const Total_Trip_Km_Finder = (type,child_key) => {
    let FJ_Empty_KM = Number(FJ_Empty_Km_Finder(type,child_key))
    let Loaded_Trip_KM = Number(Loaded_Trip_Km_Finder(type,child_key))
    let After_Unload_Empty_KM = Number(After_Unload_Empty_KM_Finder(type,child_key))

    let tot_trip_km = FJ_Empty_KM + Loaded_Trip_KM + After_Unload_Empty_KM
    console.log(tot_trip_km,'Total_Trip_Km_Finder-tot_trip_km')
    return tot_trip_km
  }

  const Loaded_Trip_Km_Finder = (type,child_key) => {

    console.log(tripsheetNumberData,'Loaded_Trip_Km_Finder-tripsheetNumberData')
    console.log(child_key,'Loaded_Trip_Km_Finder-child_key')
    console.log(type,'Loaded_Trip_Km_Finder-type')
    let val = 0
    if(type == 1){ /* FG_SALES */ 
      let start = Number(val_definer(fgsalesInfoData[child_key][`opening_km_input`],fgsalesInfoData[child_key][`opening_km`]))
      let end = Number(val_definer(fgsalesInfoData[child_key][`closing_km_input`],fgsalesInfoData[child_key][`closing_km`]))      
      let ans = end - start 
      console.log(ans,'Loaded_Trip_Km_Finder-ans')
      return ans && ans > 0 ? ans : 0 
    } else if(type == 2){ /* FG_STO */ 
      let start = Number(val_definer(fgstoInfoData[child_key][`opening_km_input`],fgstoInfoData[child_key][`opening_km`]))
      let end = Number(val_definer(fgstoInfoData[child_key][`closing_km_input`],fgstoInfoData[child_key][`closing_km`])) 
      let ans = end - start 
      console.log(ans,'Loaded_Trip_Km_Finder-ans')
      return ans && ans > 0 ? ans : 0 
    } else if(type == 3){ /* RMO */ 
      let start = Number(val_definer(rmothersInfoData[child_key][`opening_km_input`],rmothersInfoData[child_key][`opening_km`]))
      let end = Number(val_definer(rmothersInfoData[child_key][`closing_km_input`],rmothersInfoData[child_key][`closing_km`]))  
      let ans = end - start 
      console.log(ans,'Loaded_Trip_Km_Finder-ans')
      return ans && ans > 0 ? ans : 0 
    } else if(type == 4){ /* RJSOO */ 
      let start = Number(val_definer(rjsoInfodata[child_key][`opening_km_input`],rjsoInfodata[child_key][`opening_km`]))
      let end = Number(val_definer(rjsoInfodata[child_key][`closing_km_input`],rjsoInfodata[child_key][`closing_km`])) 
      let ans = end - start 
      console.log(ans,'Loaded_Trip_Km_Finder-ans')
      return ans && ans > 0 ? ans : 0 
    }

    return val

  }

  const After_Unload_Empty_KM_Finder = (type,child_key) => {
    console.log(tripsheetNumberData,'After_Unload_Empty_KM_Finder-tripsheetNumberData')
    console.log(child_key,'After_Unload_Empty_KM_Finder-child_key')
    console.log(type,'After_Unload_Empty_KM_Finder-type')
    let val = 0
    if(type == 1){ /* FG_SALES */     
      let start = Number(val_definer(fgsalesInfoData[child_key][`closing_km_input`],fgsalesInfoData[child_key][`closing_km`]))
      let end = Number(val_definer(fgsalesInfoData[child_key][`to_empty_km_input`],fgsalesInfoData[child_key][`to_empty_km`]))
      let ans = end - start 
      console.log(ans,'After_Unload_Empty_KM_Finder-ans')
      return ans && ans > 0 ? ans : 0 
    } else if(type == 2){ /* FG_STO */ 
      let start = Number(val_definer(fgstoInfoData[child_key][`closing_km_input`],fgstoInfoData[child_key][`closing_km`]))
      let end = Number(val_definer(fgstoInfoData[child_key][`to_empty_km_input`],fgstoInfoData[child_key][`to_empty_km`]))  
      let ans = end - start 
      console.log(ans,'After_Unload_Empty_KM_Finder-ans')
      return ans && ans > 0 ? ans : 0 
    } else if(type == 3){ /* RMO */ 
      let start = Number(val_definer(rmothersInfoData[child_key][`closing_km_input`],rmothersInfoData[child_key][`closing_km`]))
      let end = Number(val_definer(rmothersInfoData[child_key][`to_empty_km_input`],rmothersInfoData[child_key][`to_empty_km`]))  
      let ans = end - start 
      console.log(ans,'After_Unload_Empty_KM_Finder-ans')
      return ans && ans > 0 ? ans : 0 
    } else if(type == 4){ /* RJSO */ 
      let start = Number(val_definer(rjsoInfodata[child_key][`closing_km_input`],rjsoInfodata[child_key][`closing_km`]))
      let end = Number(val_definer(rjsoInfodata[child_key][`to_empty_km_input`],rjsoInfodata[child_key][`to_empty_km`])) 
      let ans = end - start 
      console.log(ans,'After_Unload_Empty_KM_Finder-ans')
      return ans && ans > 0 ? ans : 0 
    }

    return val
  }

  const Net_Load_Weight_Finder = (child_key) =>{

    console.log(tripsheetNumberData,'Net_Load_Weight_Finder-tripsheetNumberData')
    console.log(child_key,'Net_Load_Weight_Finder-child_key')

    let start = Number(val_definer(rjsoInfodata[child_key][`oa_weight_input`],rjsoInfodata[child_key][`oa_weight`]))
    let end = Number(val_definer(rjsoInfodata[child_key][`e_weight_input`],rjsoInfodata[child_key][`e_weight`]))  
    let ans = start - end
    console.log(ans,'Net_Load_Weight_Finder-ans')
    return ans && ans > 0 ? ans : 0 
    
  }

  const [twkm,setTwkm] = useState('')
  const [mish,setMish] = useState('')
  const [crload,setCrload] = useState('')
  const [bvremarks,setBvremarks] = useState('')
  const [trRemarks,setTrRemarks] = useState('')

  // const othersDivisionArray = ['','FOODS','FOODS','DETERGENTS','MINERALS','LOGISTICS','CONSUMER','IFOODS','SERVICE']
  const othersDivisionArray = ['','NLFD','NLFD','NLDV','NLMD','NLLD','NLCD','NLIF','NLSD']

  const changeParentTableItemForChanges = (event, child_property_name) => {

    let getData1 = event.target.value

    if (child_property_name == 'twkm') {
      // getData1 = event.target.value.replace(/\D/g, '')
      setTwkm(getData1) 
    } else if (child_property_name == 'mish') {
      // getData1 = event.target.value.replace(/\D/g, '')
      setMish(getData1)
    } else if (child_property_name == 'trRemarks') { 
      setTrRemarks(getData1)
    } else {
      setCrload(getData1)
    } 

  }
  const changeFgsalesTableItemForChanges = (event, child_property_name, parent_index, arpl = '') => {
    let getData1 = event.target.value

    console.log(getData1,'changeFgsalesTableItemForChanges-getData1')
    console.log(child_property_name,'changeFgsalesTableItemForChanges-child_property_name')
    console.log(fgsalesInfoData,'changeFgsalesTableItemForChanges-fgsalesInfoData')

    if (child_property_name == 'qty') {
      getData1 = event.target.value
        .replace(/[^0-9^\.]+/g, '')
        .replace('.', '$#$')
        .replace(/\./g, '')
        .replace('$#$', '.')
        .replace(/^0+/, '')
    } else if (child_property_name == 'closing_km' || child_property_name == 'opening_km'|| child_property_name == 'document_no' ) {
      getData1 = event.target.value.replace(/\D/g, '')
    } else if (event.target.name == 'from_place' || event.target.name == 'to_place') {
      getData1 = event.target.value.replace(/[^a-zA-Z ]/gi, '')
    } 

    const tripsheetNumberData_parent_info = JSON.parse(JSON.stringify(fgsalesInfoData))

    if (child_property_name == 'opening_km') {
      tripsheetNumberData_parent_info[parent_index][`${child_property_name}_input`] = getData1
      tripsheetNumberData_parent_info[parent_index][`running_km_input`] = tripsheetNumberData_parent_info[parent_index][
        `closing_km_input`
      ]
        ? Number(tripsheetNumberData_parent_info[parent_index][`closing_km_input`]) - Number(getData1)
        : (tripsheetNumberData_parent_info[parent_index][
          `closing_km`
        ]
          ? Number(tripsheetNumberData_parent_info[parent_index][`closing_km`]) - Number(getData1)
          : '')
    } else if (child_property_name == 'closing_km') {
      tripsheetNumberData_parent_info[parent_index][`${child_property_name}_input`] = getData1
      tripsheetNumberData_parent_info[parent_index][`running_km_input`] = tripsheetNumberData_parent_info[parent_index][
        `opening_km_input`
      ]
        ? Number(getData1) - Number(tripsheetNumberData_parent_info[parent_index][`opening_km_input`])
        : (tripsheetNumberData_parent_info[parent_index][
          `opening_km`
        ]
          ? Number(getData1) - Number(tripsheetNumberData_parent_info[parent_index][`opening_km`])
          : '')
    } else {
      tripsheetNumberData_parent_info[parent_index][`${child_property_name}_input`] = getData1
    }

    // console.log(shipment_parent_info)
    setFgsalesInfoData(tripsheetNumberData_parent_info)
  }

  const changeRJTableItemForChanges = (event, child_property_name, parent_index, arpl = '') => {
    let getData1 = event.target.value

    console.log(getData1,'changeRJTableItemForChanges-getData1')
    console.log(child_property_name,'changeRJTableItemForChanges-child_property_name')
    console.log(rjsoInfodata,'changeRJTableItemForChanges-rjsoInfodata')

    if (child_property_name == 'qty') {
      getData1 = event.target.value
        .replace(/[^0-9^\.]+/g, '')
        .replace('.', '$#$')
        .replace(/\./g, '')
        .replace('$#$', '.')
        .replace(/^0+/, '')
    } else if (child_property_name == 'document_no' || child_property_name == 'closing_km' || child_property_name == 'opening_km' || child_property_name == 'freight') {
      getData1 = event.target.value.replace(/\D/g, '')
    } else if (event.target.name == 'from_place' || event.target.name == 'to_place') {
      getData1 = event.target.value.replace(/[^a-zA-Z ]/gi, '')
    } 
  
    const tripsheetNumberData_parent_info1 = JSON.parse(JSON.stringify(rjsoInfodata))

    if(child_property_name == 'rj_customer_id'){

      let filterData1 = shedName.filter((c, index) => {
        if (getData1 == c.customer_id) {
          return true
        }
      })

      console.log(filterData1,'changeRJTableItemForChanges-filterData1')

      if(filterData1.length > 0){
        tripsheetNumberData_parent_info1[parent_index][`rj_customer_code_input`] = filterData1[0].customer_code
        tripsheetNumberData_parent_info1[parent_index][`rj_customer_name_input`] = filterData1[0].customer_name
      } else {
        tripsheetNumberData_parent_info1[parent_index][`rj_customer_code_input`] = 0
        tripsheetNumberData_parent_info1[parent_index][`rj_customer_name_input`] = ''
      }
      
    }

    if (child_property_name == 'opening_km') {
      tripsheetNumberData_parent_info1[parent_index][`${child_property_name}_input`] = getData1
      tripsheetNumberData_parent_info1[parent_index][`running_km_input`] = tripsheetNumberData_parent_info1[parent_index][
        `closing_km_input`
      ]
        ? Number(tripsheetNumberData_parent_info1[parent_index][`closing_km_input`]) - Number(getData1)
        : (tripsheetNumberData_parent_info1[parent_index][
          `closing_km`
        ]
          ? Number(tripsheetNumberData_parent_info1[parent_index][`closing_km`]) - Number(getData1)
          : '')
    } else if (child_property_name == 'closing_km') {
      tripsheetNumberData_parent_info1[parent_index][`${child_property_name}_input`] = getData1
      tripsheetNumberData_parent_info1[parent_index][`running_km_input`] = tripsheetNumberData_parent_info1[parent_index][
        `opening_km_input`
      ]
        ? Number(getData1) - Number(tripsheetNumberData_parent_info1[parent_index][`opening_km_input`])
        : (tripsheetNumberData_parent_info1[parent_index][
          `opening_km`
        ]
          ? Number(getData1) - Number(tripsheetNumberData_parent_info1[parent_index][`opening_km`])
          : '')
    } else {
      tripsheetNumberData_parent_info1[parent_index][`${child_property_name}_input`] = getData1
    }

    console.log(tripsheetNumberData_parent_info1,'setRjsoInfodata')
    setRjsoInfodata(tripsheetNumberData_parent_info1)
  }

  const changeFGSTOTableItemForChanges = (event, child_property_name, parent_index, arpl = '') => {
    let getData1 = event.target.value

    console.log(getData1,'changeFGSTOTableItemForChanges-getData1')
    console.log(child_property_name,'changeFGSTOTableItemForChanges-child_property_name')
    console.log(fgstoInfoData,'changeFGSTOTableItemForChanges-fgstoInfoData')
    
    if (child_property_name == 'qty') {
      getData1 = event.target.value
        .replace(/[^0-9^\.]+/g, '')
        .replace('.', '$#$')
        .replace(/\./g, '')
        .replace('$#$', '.')
        .replace(/^0+/, '')
    } else if (child_property_name == 'closing_km' || child_property_name == 'opening_km' || child_property_name == 'document_no' ) {
      getData1 = event.target.value.replace(/\D/g, '')
    } else if (event.target.name == 'from_place' || event.target.name == 'to_place') {
      getData1 = event.target.value.replace(/[^a-zA-Z ]/gi, '')
    } 

    const tripsheetNumberData_parent_info2 = JSON.parse(JSON.stringify(fgstoInfoData))
    console.log(tripsheetNumberData_parent_info2,'xeroxcopy')

    if (child_property_name == 'document_no') { 
      tripsheetNumberData_parent_info2[parent_index][`${child_property_name}_input`] = getData1 
    } else if (child_property_name == 'qty') { 
      tripsheetNumberData_parent_info2[parent_index][`${child_property_name}_input`] = getData1 
    } else if (child_property_name == 'opening_km') { 
      tripsheetNumberData_parent_info2[parent_index][`${child_property_name}_input`] = getData1 
      tripsheetNumberData_parent_info2[parent_index][`running_km_input`] = tripsheetNumberData_parent_info2[parent_index][
        `closing_km_input`
      ] 
        ? Number(tripsheetNumberData_parent_info2[parent_index][`closing_km_input`]) - Number(getData1)
        : (tripsheetNumberData_parent_info2[parent_index][
          `closing_km`
        ]
          ? Number(tripsheetNumberData_parent_info2[parent_index][`closing_km`]) - Number(getData1)
          : '')
    } else if (child_property_name == 'closing_km') { 
      tripsheetNumberData_parent_info2[parent_index][`${child_property_name}_input`] = getData1 
      tripsheetNumberData_parent_info2[parent_index][`running_km_input`] = tripsheetNumberData_parent_info2[parent_index][
        `opening_km_input`
      ] 
        ? Number(getData1) - Number(tripsheetNumberData_parent_info2[parent_index][`opening_km_input`])
        : (tripsheetNumberData_parent_info2[parent_index][
          `opening_km`
        ]
          ? Number(getData1) - Number(tripsheetNumberData_parent_info2[parent_index][`opening_km`])
          : '')
    } else { 
      tripsheetNumberData_parent_info2[parent_index][`${child_property_name}_input`] = getData1
    }
 
    setFgstoInfoData(tripsheetNumberData_parent_info2)
  }

  const changeRMSTOTableItemForChanges = (event, child_property_name, parent_index, arpl = '') => {
    let getData1 = event.target.value

    console.log(getData1,'changeRMSTOTableItemForChanges-getData1')
    console.log(child_property_name,'changeRMSTOTableItemForChanges-child_property_name')
    console.log(rmothersInfoData,'changeRMSTOTableItemForChanges-rmothersInfoData')
    
    if (child_property_name == 'qty') {
      getData1 = event.target.value
        .replace(/[^0-9^\.]+/g, '')
        .replace('.', '$#$')
        .replace(/\./g, '')
        .replace('$#$', '.')
        .replace(/^0+/, '')
    } else if (child_property_name == 'closing_km' || child_property_name == 'opening_km' || child_property_name == 'document_no' ) {
      getData1 = event.target.value.replace(/\D/g, '')
    } else if (event.target.name == 'from_place' || event.target.name == 'to_place') {
      getData1 = event.target.value.replace(/[^a-zA-Z ]/gi, '')
    } 

    const tripsheetNumberData_parent_info7 = JSON.parse(JSON.stringify(rmothersInfoData))
    console.log(tripsheetNumberData_parent_info7,'xeroxcopy')

    if (child_property_name == 'document_no') { 
      tripsheetNumberData_parent_info7[parent_index][`${child_property_name}_input`] = getData1 
    } else if (child_property_name == 'qty') { 
      tripsheetNumberData_parent_info7[parent_index][`${child_property_name}_input`] = getData1 
    } else if (child_property_name == 'opening_km') { 
      tripsheetNumberData_parent_info7[parent_index][`${child_property_name}_input`] = getData1 
        tripsheetNumberData_parent_info7[parent_index][`running_km_input`] = tripsheetNumberData_parent_info7[parent_index][
        `closing_km_input`
      ] 
        ? Number(tripsheetNumberData_parent_info7[parent_index][`closing_km_input`]) - Number(getData1)
        : (tripsheetNumberData_parent_info7[parent_index][
          `closing_km`
        ]
          ? Number(tripsheetNumberData_parent_info7[parent_index][`closing_km`]) - Number(getData1)
          : '')
    } else if (child_property_name == 'closing_km') { 
      tripsheetNumberData_parent_info7[parent_index][`${child_property_name}_input`] = getData1 
        tripsheetNumberData_parent_info7[parent_index][`running_km_input`] = tripsheetNumberData_parent_info7[parent_index][
        `opening_km_input`
      ] 
        ? Number(getData1) - Number(tripsheetNumberData_parent_info7[parent_index][`opening_km_input`])
        : (tripsheetNumberData_parent_info7[parent_index][
          `opening_km`
        ]
          ? Number(getData1) - Number(tripsheetNumberData_parent_info7[parent_index][`opening_km`])
          : '')
    } else if (child_property_name == 'from_place') { 
      tripsheetNumberData_parent_info7[parent_index][`${child_property_name}_input`] = getData1
    } else if (child_property_name == 'to_place') { 
      tripsheetNumberData_parent_info7[parent_index][`${child_property_name}_input`] = getData1
    } else { 
      tripsheetNumberData_parent_info7[parent_index][`${child_property_name}_input`] = getData1
    } 
    setRmothersInfoData(tripsheetNumberData_parent_info7)
  }

  const changeEDITableItemForChanges = (event, child_property_name, parent_index, arpl = '') => {
    console.log(event,'event-changeEDITableItemForChanges')
    console.log(child_property_name,'child_property_name-changeEDITableItemForChanges')
    let getData1 = event.target.value
    
    if (child_property_name == 'di_enr_rpl' || child_property_name == 'di_enr_qty') {
      getData1 = event.target.value
        .replace(/[^0-9^\.]+/g, '')
        .replace('.', '$#$')
        .replace(/\./g, '')
        .replace('$#$', '.')
        .replace(/^0+/, '')
    } else if (event.target.name == 'bunk_location') {
      getData1 = event.target.value.replace(/[^a-zA-Z ]/gi, '')
    } 

    const tripsheetNumberData_parent_info9 = JSON.parse(JSON.stringify(ticChild2Data))
    console.log(tripsheetNumberData_parent_info9,'xeroxcopy')

    if (child_property_name == 'di_enr_qty') {
      tripsheetNumberData_parent_info9[parent_index][`${child_property_name}_input`] = getData1 
    } else if (child_property_name == 'di_enr_rpl') { 
      tripsheetNumberData_parent_info9[parent_index][`${child_property_name}_input`] = getData1 
    } else if (child_property_name == 'from_place') { 
      tripsheetNumberData_parent_info9[parent_index][`${child_property_name}_input`] = getData1
    } else { 
      tripsheetNumberData_parent_info9[parent_index][`${child_property_name}_input`] = getData1
    }

    let rpl = (tripsheetNumberData_parent_info9[parent_index]['di_enr_rpl_input'] == '' || tripsheetNumberData_parent_info9[parent_index]['di_enr_rpl_input'])  ? tripsheetNumberData_parent_info9[parent_index]['di_enr_rpl_input'] : (tripsheetNumberData_parent_info9[parent_index]['di_enr_rpl'] ? tripsheetNumberData_parent_info9[parent_index]['di_enr_rpl'] : 0)

    let diq = (tripsheetNumberData_parent_info9[parent_index]['di_enr_qty_input'] == '' || tripsheetNumberData_parent_info9[parent_index]['di_enr_qty_input']) ? tripsheetNumberData_parent_info9[parent_index]['di_enr_qty_input'] : (tripsheetNumberData_parent_info9[parent_index]['di_enr_qty'] ? tripsheetNumberData_parent_info9[parent_index]['di_enr_qty'] : 0)

    let diAmount = Math.round(diq * rpl)
    console.log(diAmount,'diAmount')
    if(Number(diAmount)){
      tripsheetNumberData_parent_info9[parent_index][`di_enr_amount_input`] = diAmount
    } else {
      tripsheetNumberData_parent_info9[parent_index][`di_enr_amount_input`] = 0
    } 
    setTicChild2Data(tripsheetNumberData_parent_info9)
  }

  const [fgstoChildInsertEnable,setFgstoChildInsertEnable] = useState(false)
  const [fgsalesChildInsertEnable,setFgsalesChildInsertEnable] = useState(false)
  const [rjChildInsertEnable,setRjChildInsertEnable] = useState(false)
  const [rmChildInsertEnable,setRMChildInsertEnable] = useState(false)
  const [ediChildInsertEnable,setEDIChildInsertEnable] = useState(false)

  const rmChildInsert = () => {
    const tripsheetNumberData_parent_info5 = JSON.parse(JSON.stringify(rmothersInfoData))

    if(tripsheetNumberData_parent_info5 && tripsheetNumberData_parent_info5.length > 0){
      console.log('Yes')
      let sample_obj = {}
      sample_obj.document_type = ''
      sample_obj.journey_type = ''
      sample_obj.division = ''
      sample_obj.rmo_count = ''
      sample_obj.qty = ''
      sample_obj.start_time = ''
      sample_obj.end_time = ''
      sample_obj.from_location = ''
      sample_obj.opening_km = ''
      sample_obj.closing_km = ''
      sample_obj.running_km = ''
      sample_obj.remarks = ''
      tripsheetNumberData_parent_info5.push(sample_obj)
    } else {
      console.log('No')
      let sample_obj = {}
      sample_obj.document_type = ''
      sample_obj.journey_type = ''
      sample_obj.division = ''
      sample_obj.rmo_count = ''
      sample_obj.qty = ''
      sample_obj.start_time = ''
      sample_obj.end_time = ''
      sample_obj.from_location = ''
      sample_obj.opening_km = ''
      sample_obj.closing_km = ''
      sample_obj.running_km = ''
      sample_obj.remarks = ''
      // tripsheetNumberData_parent_info5 =[sample_obj]
      tripsheetNumberData_parent_info5.push(sample_obj)
      setRmothersInfoData(tripsheetNumberData_parent_info5)
      setRMChildInsertEnable(true)
    }
    console.log(tripsheetNumberData_parent_info5,'tripsheetNumberData_parent_info5')
    setRmothersInfoData(tripsheetNumberData_parent_info5)
  }

  const enrouteDIChildInsert = () => {
    const tripsheetNumberData_parent_info8 = JSON.parse(JSON.stringify(ticChild2Data))

    console.log(tripsheetNumberData_parent_info8,'tripsheetNumberData_parent_info8')

    if(tripsheetNumberData_parent_info8 && tripsheetNumberData_parent_info8.length > 0){
      console.log('Yes')
      let sample_obj = {}
      sample_obj.di_enr_qty = ''
      sample_obj.di_enr_rpl = '' /* rpl - rate Per Liter*/
      sample_obj.di_enr_amount = ''
      sample_obj.bunk_location = ''      
      sample_obj.remarks = ''
      tripsheetNumberData_parent_info8.push(sample_obj)
    } else {
      console.log('No')
      let sample_obj = {}
      sample_obj.di_enr_qty = ''
      sample_obj.di_enr_rpl = '' /* rpl - rate Per Liter*/
      sample_obj.di_enr_amount = ''
      sample_obj.bunk_location = ''      
      sample_obj.remarks = ''
      // tripsheetNumberData_parent_info8 =[sample_obj]
      tripsheetNumberData_parent_info8.push(sample_obj)
      setTicChild2Data(tripsheetNumberData_parent_info8)
      setEDIChildInsertEnable(true)
    }
    console.log(tripsheetNumberData_parent_info8,'tripsheetNumberData_parent_info8')
    setTicChild2Data(tripsheetNumberData_parent_info8)
  }

  const fgsalesChildInsert = () => {
    const tripsheetNumberData_parent_info3 = JSON.parse(JSON.stringify(fgsalesInfoData))

    if(tripsheetNumberData_parent_info3 && tripsheetNumberData_parent_info3.length > 0){
      console.log('Yes')
      let sample_obj = {}
      sample_obj.document_no = ''
      sample_obj.division = ''
      sample_obj.journey_type = ''
      sample_obj.qty = ''
      sample_obj.start_time = ''
      sample_obj.end_time = ''
      sample_obj.from_location = ''
      sample_obj.opening_km = ''
      sample_obj.closing_km = ''
      sample_obj.running_km = ''
      sample_obj.remarks = ''
      tripsheetNumberData_parent_info3.push(sample_obj)
    } else {
      console.log('No')
      let sample_obj = {}
      sample_obj.document_no = ''
      sample_obj.division = ''
      sample_obj.journey_type = ''
      sample_obj.qty = ''
      sample_obj.start_time = ''
      sample_obj.end_time = ''
      sample_obj.from_location = ''
      sample_obj.opening_km = ''
      sample_obj.closing_km = ''
      sample_obj.running_km = ''
      sample_obj.remarks = '' 
      tripsheetNumberData_parent_info3.push(sample_obj)
      setFgsalesChildInsertEnable(true)
    }
    console.log(tripsheetNumberData_parent_info3,'tripsheetNumberData_parent_info3')
    setFgsalesInfoData(tripsheetNumberData_parent_info3)
  }

  const rjChildInsert = () => {
    const tripsheetNumberData_parent_info3 = JSON.parse(JSON.stringify(rjsoInfodata))

    if(tripsheetNumberData_parent_info3 && tripsheetNumberData_parent_info3.length > 0){
      console.log('Yes')
      let sample_obj = {}
      sample_obj.document_no = ''
      sample_obj.division = ''
      sample_obj.journey_type = ''
      sample_obj.qty = ''
      sample_obj.start_time = ''
      sample_obj.end_time = ''
      sample_obj.from_location = ''
      sample_obj.opening_km = ''
      sample_obj.closing_km = ''
      sample_obj.running_km = ''
      sample_obj.remarks = ''
      tripsheetNumberData_parent_info3.push(sample_obj)
    } else {
      console.log('No')
      let sample_obj = {}
      sample_obj.document_no = ''
      sample_obj.division = ''
      sample_obj.journey_type = ''
      sample_obj.qty = ''
      sample_obj.start_time = ''
      sample_obj.end_time = ''
      sample_obj.from_location = ''
      sample_obj.opening_km = ''
      sample_obj.closing_km = ''
      sample_obj.running_km = ''
      sample_obj.remarks = '' 
      tripsheetNumberData_parent_info3.push(sample_obj)
      setRjChildInsertEnable(true)
    }
    console.log(tripsheetNumberData_parent_info3,'tripsheetNumberData_parent_info3')
    setRjsoInfodata(tripsheetNumberData_parent_info3)
  }

  const fgstoChildInsert = () => {
    const tripsheetNumberData_parent_info3 = JSON.parse(JSON.stringify(fgstoInfoData))

    if(tripsheetNumberData_parent_info3 && tripsheetNumberData_parent_info3.length > 0){
      console.log('Yes')
      let sample_obj = {}
      sample_obj.document_no = ''
      sample_obj.division = ''
      sample_obj.journey_type = ''
      sample_obj.qty = ''
      sample_obj.start_time = ''
      sample_obj.end_time = ''
      sample_obj.from_location = ''
      sample_obj.opening_km = ''
      sample_obj.closing_km = ''
      sample_obj.running_km = ''
      sample_obj.remarks = ''
      tripsheetNumberData_parent_info3.push(sample_obj)
    } else {
      console.log('No')
      let sample_obj = {}
      sample_obj.document_no = ''
      sample_obj.division = ''
      sample_obj.journey_type = ''
      sample_obj.qty = ''
      sample_obj.start_time = ''
      sample_obj.end_time = ''
      sample_obj.from_location = ''
      sample_obj.opening_km = ''
      sample_obj.closing_km = ''
      sample_obj.running_km = ''
      sample_obj.remarks = ''
      // tripsheetNumberData_parent_info3 =[sample_obj]
      tripsheetNumberData_parent_info3.push(sample_obj)
      setFgstoChildInsertEnable(true)
    }
    console.log(tripsheetNumberData_parent_info3,'tripsheetNumberData_parent_info3')
    setFgstoInfoData(tripsheetNumberData_parent_info3)
  }

  console.log(tripsheetNumberData)

  const FgsalesDataUpdateForChanges = (original, input) => {
    return input === undefined ? original : input
  }

  const RJDataUpdateForChanges = (original, input) => {
    return input === undefined ? original : input
  }

  const FGSTODataUpdateForChanges  = (original, input) => {
    return input === undefined ? original : input
  }

  const RMSTODataUpdateForChanges  = (original, input) => {
    return input === undefined ? original : input
  }

  const EDIDataUpdateForChanges  = (original, input) => {
    return input === undefined ? original : input
  }

  const Find_Difference_Hrs = (type, parIndex) => { 
    console.log('ttrree')
    let startTimeVal = ''
    let endTimeVal = ''
    if(type == 1){
      startTimeVal = fgsalesInfoData[parIndex][`start_time_input`] ? fgsalesInfoData[parIndex][`start_time_input`] : (fgsalesInfoData[parIndex][`start_time`] ? fgsalesInfoData[parIndex][`start_time`] : '')
      endTimeVal = fgsalesInfoData[parIndex][`end_time_input`] ? fgsalesInfoData[parIndex][`end_time_input`] : (fgsalesInfoData[parIndex][`end_time`] ? fgsalesInfoData[parIndex][`end_time`] : '')
    } else if(type == 2){
      startTimeVal = rjsoInfodata[parIndex][`start_time_input`] ? rjsoInfodata[parIndex][`start_time_input`] : (rjsoInfodata[parIndex][`start_time`] ? rjsoInfodata[parIndex][`start_time`] : '')
      endTimeVal = rjsoInfodata[parIndex][`end_time_input`] ? rjsoInfodata[parIndex][`end_time_input`] : (rjsoInfodata[parIndex][`end_time`] ? rjsoInfodata[parIndex][`end_time`] : '')
    } else if(type == 3){
      startTimeVal = fgstoInfoData[parIndex][`start_time_input`] ? fgstoInfoData[parIndex][`start_time_input`] : (fgstoInfoData[parIndex][`start_time`] ? fgstoInfoData[parIndex][`start_time`] : '')
      endTimeVal = fgstoInfoData[parIndex][`end_time_input`] ? fgstoInfoData[parIndex][`end_time_input`] : (fgstoInfoData[parIndex][`end_time`] ? fgstoInfoData[parIndex][`end_time`] : '')
    } else if(type == 4){
      startTimeVal = rmothersInfoData[parIndex][`start_time_input`] ? rmothersInfoData[parIndex][`start_time_input`] : (rmothersInfoData[parIndex][`start_time`] ? rmothersInfoData[parIndex][`start_time`] : '')
      endTimeVal = rmothersInfoData[parIndex][`end_time_input`] ? rmothersInfoData[parIndex][`end_time_input`] : (rmothersInfoData[parIndex][`end_time`] ? rmothersInfoData[parIndex][`end_time`] : '')
    } 

    let DiffernceTimeVal = (Math.abs(new Date(startTimeVal).getTime()/1000 - new Date(endTimeVal).getTime()/1000)/3600).toFixed(2); 
      console.log(startTimeVal,'budgetTime')
      console.log(endTimeVal,'actualTime')
      console.log(DiffernceTimeVal,'DiffernceTimeVal')
    if(startTimeVal && endTimeVal) {
      if(DiffernceTimeVal && !(DiffernceTimeVal == 'Infinity' || DiffernceTimeVal == '-Infinity')){
        let ans = timeConvert(DiffernceTimeVal,1)
        console.log(ans,'DiffernceTime')
        if(ans){ 
          return ans
        } 
      }
    }

    return '-'
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

  const childHavingCheck = () => {
    console.log(tripsheetNumberData,'tripsheetNumberData')
    let fgsales_available = fgsalesInfoData && fgsalesInfoData.length > 0 
    let rjso_available = rjsoInfodata && rjsoInfodata.length > 0 
    let fgsto_available = fgstoInfoData && fgstoInfoData.length > 0 
    let rmsto_available = rmothersInfoData && rmothersInfoData.length > 0
    let edi_available = ticChild2Data && ticChild2Data.length > 0

    let all_available = {}
    all_available.fgsales_available = fgsales_available
    all_available.rjso_available = rjso_available
    all_available.fgsto_available = fgsto_available
    all_available.rmsto_available = rmsto_available
    all_available.edi_available = edi_available
    return all_available
  }

  const okmValidation = (data,type) => {

    let error = 0

    console.log(data,'okmValidation-data')
    console.log(type,'okmValidation-type')

    if(type == 1){
      data.map((vv,kk)=>{ 
        if( !(vv.opening_km_input ? vv.opening_km_input : vv.opening_km) || (vv.opening_km_input == '') ||  (vv.opening_km_input == '' && vv.opening_km == '') ){
          error = 1
        }
      })
    }

    if(type == 2){
      data.map((vv,kk)=>{ 
        if( !(vv.closing_km_input ? vv.closing_km_input : vv.closing_km) || (vv.closing_km_input == '') || (vv.closing_km_input == '' && vv.closing_km == '') ){
          error = 1
        }
      })
    }

    if(error == 1){
      return 1
    } else {
      return 2
    }

  }

  function diffTime(start, end) {

    let st = new Date(start)
    let et = new Date(end)
    return (et-st)/1000
  }

  const journeyTypeValidation = (data,type) => {
    let error = 0
    if(type == 1){
      data.map((vv,kk)=>{
        // if( !vv.journey_type_input || vv.journey_type_input == '0' ){
          if( !(vv.journey_type_input ? vv.journey_type_input : vv.journey_type) || vv.journey_type_input == '0' || (vv.journey_type_input == '0' && vv.journey_type == '') ){
          error = 1
        }
      })
    }

    if(error == 1){
      return 1
    } else {
      return 2
    }

  }

  const setimeValidation = (data,type) => {

    let error = 0

    if(type == 1){
      data.map((vv,kk)=>{
        if( !(vv.start_time_input ? vv.start_time_input : vv.start_time) || vv.start_time_input == '' || (vv.start_time_input == '' && vv.start_time == '') ){
          error = 1
        }
      })
    }

    if(type == 2){
      data.map((vv,kk)=>{
        if( !(vv.end_time_input ? vv.end_time_input : vv.end_time) || vv.end_time_input == '' ||  (vv.end_time_input == '' && vv.end_time == '' )){
          error = 1
        }
      })
    }

    if(type == 3){

      data.map((vv,kk)=>{
       
        let start = vv.start_time_input ? vv.start_time_input : vv.start_time
        let end = vv.end_time_input ? vv.end_time_input : vv.end_time
        let difference111 = diffTime(start,end)
  
        if(difference111 <= 0){
          error = 1
        }  
      })
      
    }

    if(error == 1){
      return 1
    } else {
      return 2
    }

  }

  const fromtolocValidation = (data,type) => {

    let error = 0

    if(type == 1){
      data.map((vv,kk)=>{
        if( !(vv.from_place_input ? vv.from_place_input : vv.from_place) || (vv.from_place_input == '') || (vv.from_place_input == '' && vv.from_place == '') ){
          error = 1
        }
      })
    }

    if(type == 2){
      data.map((vv,kk)=>{ 
        if( !(vv.to_place_input ? vv.to_place_input : vv.to_place) || vv.to_place_input == '' || (vv.to_place_input == '' && vv.to_place == '') ){
          error = 1
        }
      })
    }

    if(error == 1){
      return 1
    } else {
      return 2
    }

  }

  const fromToLocationValidation = (data,type) => {
    let value = ''
    if(type == 1){
      value = 'Fgsto'
    } else if(type == 2){
      value = 'RM/Others'
    } 

    console.log(value)

    if(fromtolocValidation(data,1) == '1'){
      setFetch(true)
      toast.warning(`One of the ${value} - From Location field was not filled..`)
      return false
    }

    if(fromtolocValidation(data,2) == '1'){
      setFetch(true)
      toast.warning(`One of the ${value} - To Location field was not filled..`)
      return false
    } 

  }
  const basicValidation = (data,type) => {
    let value = ''
    if(type == 1){
      value = 'Shipment'
    } else if(type == 2){
      value = 'Return Journey'
    } else if(type == 3){
      value = 'Fgsto'
    } else if(type == 4){
      value = 'RM/Others'
    } else {
      value = ''
    }

    console.log(value)

    if(type != 2){
      
      if(journeyTypeValidation(data,1) == '1'){
        setFetch(true)
        toast.warning(`One of the ${value} - Journey Type field was not selected..`)
        return false
      }
    }

    if(setimeValidation(data,1) == '1'){
      setFetch(true)
      toast.warning(`One of the ${value} - Starting Time field was not filled..`)
      return false
    }

    if(setimeValidation(data,2) == '1'){
      setFetch(true)
      toast.warning(`One of the ${value} - Ending Time field was not filled..`)
      return false
    } 

    if(setimeValidation(data,3) == '1'){
      setFetch(true) 
      toast.warning(`One of the ${value} - Ending Time Should be greater than Starting Time..`)
      return false
    } 

    if(okmValidation(data,1) == '1'){
      setFetch(true)
      toast.warning(`One of the ${value} - Odometer KM2 field was not filled..`)
      return false
    }

    if(okmValidation(data,2) == '1'){
      setFetch(true)
      toast.warning(`One of the ${value} - Odometer KM3 field was not filled..`)
      return false
    } 

  }

  const getDateTime = (myDateTime, type=0) => {
    if(myDateTime == null){
      return '-'
    }
    let myTime = '-'
    if(type == 1){
      myTime = new Date(myDateTime).toLocaleTimeString('en-US',{ hour: '2-digit', minute: '2-digit' });
    } else if(type == 2){
      myTime = new Date(myDateTime).toLocaleDateString('en-US',{ month: 'short', year: 'numeric' });
    } else {
      myTime = new Date(myDateTime).toLocaleString('en-US');
    }
    
    return myTime
  }

  const OVTIValidate = () => {
    
    console.log(tripsheetNumberData,'tripsheetNumberData') 

    let fgsales_available = tripsheetNumberData.trip_sheet_info.purpose == 1

    console.log(fgsales_available,'fgsales_available') 

    if((tripsheetNumberData.trip_sheet_info.purpose == 2 && (!fgstoInfoData || fgstoInfoData.length == 0) )){
      setFetch(true)
      toast.warning(`Atleast one FGSTO Info should be added..`)
      return false
    }

    if((Number(tripsheetNumberData.trip_sheet_info.purpose) >= 3 && (!rmothersInfoData || rmothersInfoData.length == 0) )){
      setFetch(true)
      toast.warning(`Atleast one Rm / Others Info should be added..`)
      return false
    }

    let con = childHavingCheck()

    console.log(con,'con')
    
    let ans_rjso = true
    let ans_fgsales = true
    let ans_fgsto = true
    let ans_rmothers = true
    let ans1 = true 

    /* FGSALES Validations */
    if(con.fgsales_available){ 
      ans_fgsales = basicValidation(fgsalesInfoData,1)
    }

    /* RJSO Validations */
    if(con.rjso_available){ 
      ans_rjso = basicValidation(rjsoInfodata,2)

      let oaw_error = 0
      let ew_error = 0
      let oawew_error = 0
      let mbr_error = 0

      let cuscode_error = 0 
      let cusfreight_error = 0 
      rjsoInfodata.map((vv,kk)=>{

        if( !(vv.oa_weight_input ? vv.oa_weight_input : vv.oa_weight) || (vv.oa_weight_input == '') || (vv.oa_weight_input == '' && vv.oa_weight == '') ){
          oaw_error = 1
        }

        if(!(vv.rj_customer_code) && !(vv.rj_customer_id_input)){
          cuscode_error = 1
        }

        if(!(vv.rj_customer_code) && !(vv.freight_input || vv.freight)){
          cusfreight_error = 1
        }

        if( !(vv.e_weight_input ? vv.e_weight_input : vv.e_weight) || (vv.e_weight_input == '') || (vv.e_weight_input == '' && vv.e_weight == '') ){
          ew_error = 1
        }

        if(Number(vv.e_weight_input ? vv.e_weight_input : vv.e_weight) > Number(vv.oa_weight_input ? vv.oa_weight_input : vv.oa_weight)){
          oawew_error = 1
        }

        if( !(vv.mbr_value_input ? vv.mbr_value_input : vv.mbr_value) || (vv.mbr_value_input == '') || (vv.mbr_value_input == '' && vv.mbr_value == '') ){
          mbr_error = 1
        } 
        
      })

      if(cuscode_error == 1){
        toast.warning(`One of the RJSO - Customer field was not selected..`)
        return false
      } 

      if(cusfreight_error == 1){
        toast.warning(`One of the RJSO - Freight field was not filled..`)
        return false
      } 

      if(oaw_error == 1){
        toast.warning(`One of the RJSO - Over All Weight field was not filled..`)
        return false
      }
      if(ew_error == 1){
        toast.warning(`One of the RJSO - Empty Weight field was not filled..`)
        return false
      }
      if(oawew_error == 1){
        toast.warning(`One of the RJSO - Empty Weight is greater than Over All Weight field..`)
        return false
      }
      if(mbr_error == 1){
        toast.warning(`One of the RJSO - MTS/BAG * RATE field was not filled...`)
        return false
      }
    }

    /* FGSTO Validations */
    if(con.fgsto_available){ 
      let div_error = 0
      let inv_error = 0
      let qty_error = 0
      console.log(fgstoInfoData,'fgstoInfoData')
      fgstoInfoData.map((vv,kk)=>{
        if( !(vv.division_input ? vv.division_input : vv.division) || (vv.division_input == '0') || (vv.division_input == '0' && vv.division == '0') ){
          div_error = 1
        }
        if( !(vv.document_no_input ? vv.document_no_input : vv.document_no) || (vv.document_no_input == '' && vv.document_no  == '') || vv.document_no_input == ''){
          inv_error = 1
        }
        if( !(vv.qty_input ? vv.qty_input : vv.qty) || (vv.qty_input == '') || (vv.qty_input == '' && vv.qty == '') ){
          qty_error = 1
        }
        
      })

      if(div_error == 1){
        toast.warning(`One of the FGSTO - Division field was not filled..`)
        return false
      }
      if(inv_error == 1){
        toast.warning(`One of the FGSTO - Invoice Number field was not filled..`)
        return false
      }
      if(qty_error == 1){
        toast.warning(`One of the FGSTO - Delivery Qty. field was not filled..`)
        return false
      }
      ans_fgsto = basicValidation(fgstoInfoData,3)
      if(ans_fgsto == false){

      } else {
        ans1 = fromToLocationValidation(fgstoInfoData,1)
      }
      
    }

    /* RMSTO Validations */
    if(con.rmsto_available){ 
      let rmoType_error = 0
      let div_error = 0
      let rmoCount_error = 0
      let qty_error = 0
      console.log(rmothersInfoData,'rmothersInfoData')
      rmothersInfoData.map((vv,kk)=>{
         
        if( !(vv.document_type_input ? vv.document_type_input : vv.document_type) || (vv.document_type_input == '0') || (vv.document_type_input == '0' && vv.document_type == '0') ){
          rmoType_error = 1
        }
        if( !(vv.division_input ? vv.division_input : vv.division) || (vv.division_input == '0') || (vv.division_input == '0' && vv.division == '0') ){
          div_error = 1
        } 

        if( !(vv.rmo_count_input ? vv.rmo_count_input : vv.rmo_count) || (vv.rmo_count_input == '') || (vv.rmo_count_input == '' && vv.rmo_count == '') ){
          rmoCount_error = 1
        }  
        if( !(vv.qty_input ? vv.qty_input : vv.qty) || (vv.qty_input == '') || (vv.qty_input == '' && vv.qty == '') ){
          qty_error = 1
        }
        
      })

      if(rmoType_error == 1){
        toast.warning(`One of the RM/Others - Movement Type field was not filled..`)
        return false
      }
      if(div_error == 1){
        toast.warning(`One of the RM/Others - Division field was not filled..`)
        return false
      }
      if(rmoCount_error == 1){
        toast.warning(`One of the RM/Others - Trip Count field was not filled..`)
        return false
      }
      if(qty_error == 1){
        toast.warning(`One of the RM/Others - Delivery Qty. field was not filled..`)
        return false
      }
       
      ans_rmothers = basicValidation(rmothersInfoData,4)
      if(ans_rmothers == false){

      } else {
        ans1 = fromToLocationValidation(rmothersInfoData,2)
      }
    }

    if(con.edi_available){
      let dlqty_error = 0
      let dlrpl_error = 0
      let bunkloc_error = 0 
      console.log(ticChild2Data,'ticChild2Data')
      ticChild2Data.map((vv,kk)=>{ 
         
        if( !(vv.di_enr_qty_input ? vv.di_enr_qty_input : vv.di_enr_qty) || (vv.di_enr_qty_input == '') || (vv.di_enr_qty_input == '' && vv.di_enr_qty == '') ){
          dlqty_error = 1
        } 
        if( !(vv.di_enr_rpl_input ? vv.di_enr_rpl_input : vv.di_enr_rpl) || (vv.di_enr_rpl_input == '') || (vv.di_enr_rpl_input == '' && vv.di_enr_rpl == '') ){
          dlrpl_error = 1
        } 
        if( !(vv.bunk_location_input ? vv.bunk_location_input : vv.bunk_location) || (vv.bunk_location_input == '') || (vv.bunk_location_input == '' && vv.bunk_location == '') ){
          bunkloc_error = 1
        }   
        
      })

      if(dlqty_error == 1){
        toast.warning(`One of the Enroute Diesel - Qty. in Litre field was not filled..`)
        return false
      }
      if(dlrpl_error == 1){
        toast.warning(`One of the Enroute Diesel - Rate Per Litre field was not filled..`)
        return false
      }
      if(bunkloc_error == 1){
        toast.warning(`One of the Enroute Diesel - Bunk Location field was not filled..`)
        return false
      } 
    }

    console.log(ans1,'ans1')
    if(ans_fgsales == false || ans_fgsto == false || ans_rjso == false || ans_rmothers == false || ans1 == false){
      toast.warning(`Validation Pending..`)
      return false
    }
    //  else if(ans == undefined){
    //   // toast.success(`Validation Completed..`)
    // } else {
    //   toast.warning(`Validation Completed2..`)
    // }

    // toast.success(`Validation Completed..`)
    // return false
    const formData = new FormData()

    formData.append('trip_id',tripsheetNumberData.tripsheet_sheet_id) 
    formData.append('pyg_id', tripsheetNumberData.parking_yard_gate_id)
    // formData.append('veh_id', tripsheetNumberData.vehicle_id)
    // formData.append('veh_no', tripsheetNumberData.vehicle_number)  
    // formData.append('veh_capacity', tripsheetNumberData.vehicle_capacity_id.capacity)

    formData.append('ts_no', tripsheetNumberData.trip_sheet_info.trip_sheet_no)
    // formData.append('ts_date', tripsheetNumberData.trip_sheet_info.created_date)
    // formData.append('ts_month', getDateTime(tripsheetNumberData.trip_sheet_info.created_at,2))
    // formData.append('ts_division', tripsheetNumberData.trip_sheet_info.to_divison)
    // formData.append('ts_purpose', tripsheetNumberData.trip_sheet_info.purpose)
    // formData.append('ts_user', tripsheetNumberData.trip_sheet_info.created_by) 
    formData.append('ts_status', tripsheetNumberData.trip_sheet_info.status) 

    formData.append('opening_km', tripsheetNumberData.odometer_km)
    formData.append('ad_gate_in_status', 0)
    if(tripsheetNumberData.odometer_closing_km){
      formData.append('closing_km', tripsheetNumberData.odometer_closing_km)
      // formData.append('running_km', tripsheetNumberData.driver_id)
      formData.append('ad_gate_in_status', 1)
    }
  
    // formData.append('driver_id', tripsheetNumberData.driver_id)
    // formData.append('driver_name', tripsheetNumberData.driver_name)

    if(tripsheetNumberData.diesel_intent_info){
      formData.append('di_id', tripsheetNumberData.diesel_intent_info.id)
      formData.append('di_rns_qty', tripsheetNumberData.diesel_intent_info.no_of_ltrs)
      formData.append('di_rns_rpl', tripsheetNumberData.diesel_intent_info.rate_of_ltrs)
      formData.append('di_rns_amount', tripsheetNumberData.diesel_intent_info.total_amount)
      formData.append('di_status', tripsheetNumberData.diesel_intent_info.diesel_status)
    }
    
    formData.append('diesel_intent_info', tripsheetNumberData.diesel_intent_info && tripsheetNumberData.diesel_intent_collection_info.length > 0 ? JSON.stringify([tripsheetNumberData.diesel_intent_info]) : '')
    formData.append('fgsales_info', fgsalesInfoData && fgsalesInfoData.length > 0 ? JSON.stringify(fgsalesInfoData) : '')
    formData.append('fgsto_info', fgstoInfoData && fgstoInfoData.length > 0 ? JSON.stringify(fgstoInfoData) : '')
    formData.append('rmothers_info', rmothersInfoData && rmothersInfoData.length > 0 ? JSON.stringify(rmothersInfoData) : '')
    formData.append('rjso_info', rjsoInfodata && rjsoInfodata.length > 0 ? JSON.stringify(rjsoInfodata) : '')
    formData.append('edi_info', ticChild2Data && ticChild2Data.length > 0 ? JSON.stringify(ticChild2Data) : '')

    formData.append('veh_position', tripsheetNumberData.vehicle_current_position)
    formData.append('updated_by', user_id) 
    formData.append('status', 2) 

    formData.append('truck_work_km', twkm ? twkm : '')
    formData.append('mileage_shortage', mish ? mish : '')
    formData.append('company_return_load', crload ? crload : '')    
    formData.append('bvremarks', bvremarks ? bvremarks : '')
    formData.append('remarks', trRemarks ? trRemarks : '')
    formData.append('_method', 'PUT')
    setFetch(false) 
    TripInfoCaptureService.updateTICData(id,formData).then((res) => {
      console.log(res)
      setFetch(true) 

      if (res.status == 200) {
        Swal.fire({
          title: 'Tripsheet Info. Updated Successfully!',
          icon: "success", 
          confirmButtonText: "OK",
        }).then(function () {
          navigation('/OVTICHome')
        });
      } else if (res.status == 201) {
        Swal.fire({
          title: res.data.message,
          icon: "warning",
          confirmButtonText: "OK",
        }).then(function () {
          // window.location.reload(false)
        })
      } else {
        toast.warning('Tripsheet Info. Capture Process Failed. Kindly contact Admin..!')
      }

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

  const removeFgsalesChild = (data,ind) => {
    const tripsheetNumberData_parent_info41 = JSON.parse(JSON.stringify(fgsalesInfoData))
    console.log(ind,'removeFgsalesChild1')
    if(data && data.length == 1){ 
      setFgsalesInfoData([])
      setFgsalesChildInsertEnable(false)
    } else if(data && data.length > 1){
      tripsheetNumberData_parent_info41.splice(ind, 1); 
      setFgsalesInfoData(tripsheetNumberData_parent_info41)
    }
    console.log(tripsheetNumberData_parent_info41,'removeFgsalesChild2')
  }

  const removeRjChild = (data,ind) => {
    const tripsheetNumberData_parent_info42 = JSON.parse(JSON.stringify(rjsoInfodata))
    console.log(ind,'removeFgsalesChild1')
    if(data && data.length == 1){ 
      setRjsoInfodata([])
      setRjChildInsertEnable(false)
    } else if(data && data.length > 1){
      tripsheetNumberData_parent_info42.splice(ind, 1); 
      setRjsoInfodata(tripsheetNumberData_parent_info42)
    }
    console.log(tripsheetNumberData_parent_info42,'removeRjChild')
  }

  const removeFgstoChild = (data,ind) => {
    const tripsheetNumberData_parent_info4 = JSON.parse(JSON.stringify(fgstoInfoData))
    console.log(ind,'removeFgstoChild1')
    if(data && data.length == 1){ 
      setFgstoInfoData([])
      setFgstoChildInsertEnable(false)
    } else if(data && data.length > 1){
      tripsheetNumberData_parent_info4.splice(ind, 1); 
      setFgstoInfoData(tripsheetNumberData_parent_info4)
    }
    console.log(tripsheetNumberData_parent_info4,'removeFgstoChild2')
    
  }

  const removeRMChild = (data,ind) => {
    const tripsheetNumberData_parent_info6 = JSON.parse(JSON.stringify(rmothersInfoData))
    console.log(ind,'removeFgstoChild1')
    if(data && data.length == 1){
      setRmothersInfoData([])
      setRMChildInsertEnable(false)
    } else if(data && data.length > 1){
      tripsheetNumberData_parent_info6.splice(ind, 1) 
      setRmothersInfoData(tripsheetNumberData_parent_info6)
    }
    console.log(tripsheetNumberData_parent_info6,'removeRMChild')
    
  } 

  const removeEDIChild = (data,ind) => {
    const tripsheetNumberData_parent_info9 = JSON.parse(JSON.stringify(ticChild2Data))
    console.log(ind,'removeFgstoChild1')
    if(data && data.length == 1){
      setTicChild2Data([])
      setEDIChildInsertEnable(false)
    } else if(data && data.length > 1){
      tripsheetNumberData_parent_info9.splice(ind, 1) 
      setTicChild2Data(tripsheetNumberData_parent_info9)
    }
    console.log(tripsheetNumberData_parent_info9,'removeEDIChild')
    
  } 

  /* ================ New Validation Method Part Start ================ */
  
    const updatedChildHavingCheck = () => {
      console.log(tripsheetNumberData,'tripsheetNumberData') 
      let rjso_available = tripsheetNumberData.rj_so_info && tripsheetNumberData.rj_so_info.length > 0 
      let fgsto_available = fgstoChildInsertEnable && tripsheetNumberData.fgsto_info && tripsheetNumberData.fgsto_info.length > 0 
      let rmsto_available = rmChildInsertEnable && tripsheetNumberData.rmothers_info && tripsheetNumberData.rmothers_info.length > 0
      let edi_available = ediChildInsertEnable && tripsheetNumberData.enroute_di_info && tripsheetNumberData.enroute_di_info.length > 0
  
      let all_available = {} 
      all_available.rjso_available = rjso_available
      all_available.fgsto_available = fgsto_available
      all_available.rmsto_available = rmsto_available
      all_available.edi_available = edi_available
      return all_available
    }
  
    const OVTINewValidate = () => {
  
      let tripFGSALES = tripsheetNumberData?.trip_sheet_info.purpose == 1
      let tripFGSTO = tripsheetNumberData?.trip_sheet_info.purpose == 2
      let tripRMSTO = tripsheetNumberData?.trip_sheet_info.purpose == 3
      let tripOthers = tripsheetNumberData?.trip_sheet_info.purpose == 4
      let tripFCI = tripsheetNumberData?.trip_sheet_info.purpose == 5
  
      let con = updatedChildHavingCheck()
  
      console.log(con,'con')
      
      let ans_rjso = true
      let ans_fgsales = true
      let ans_fgsto = true
      let ans_rmothers = true
      let ans1 = true 
  
      setFetch(true)      
  
      if((tripsheetNumberData.trip_sheet_info.purpose == 2 && (!fgstoInfoData || fgstoInfoData.length == 0) )){
        setFetch(true)
        toast.warning(`Atleast one FGSTO Info should be added..`)
        return false
      }
  
      if((Number(tripsheetNumberData.trip_sheet_info.purpose) >= 3 && (!rmothersInfoData || rmothersInfoData.length == 0) )){
        setFetch(true)
        toast.warning(`Atleast one Rm / Others Info should be added..`)
        return false
      }
  
      if(tripFGSALES){
  
        // toast.warning(`Tripsheet is for (${tripsheetNumberData.trip_sheet_info.purpose}) FG-SALES..`)
  
        let is_valid = fgSalesValidation(fgsalesInfoData)
  
        if(is_valid && is_valid != 10){
  
          if(is_valid == 1){
            setFetch(true)
            toast.warning(`Atleast one Journey Type of the FGSALES Info should be selected..`)
            return false
          }
  
          if(is_valid == 2){
            setFetch(true)
            toast.warning(`One of the Shipment - Starting Time field was not filled..`)
            return false
          }
  
          if(is_valid == 3){
            setFetch(true)
            toast.warning(`One of the Shipment - Ending Time field was not filled..`)
            return false
          }
  
          if(is_valid == 4){
            setFetch(true)
            toast.warning(`One of the Shipment - Ending Time Should be greater than Starting Time..`)
            return false
          }
  
          if(is_valid == 5){
            setFetch(true)
            toast.warning(`One of the Shipment - Loaded Location field was not filled..`)
            return false
          }
  
          if(is_valid == 6){
            setFetch(true)
            toast.warning(`One of the Shipment - Odometer KM2 field was not filled..`)
            return false
          }
  
          if(is_valid == 7){
            setFetch(true)
            toast.warning(`One of the Shipment - Unloaded Location field was not filled..`)
            return false
          }
  
          if(is_valid == 8){
            setFetch(true)
            toast.warning(`One of the Shipment - Odometer KM3 field was not filled..`)
            return false
          }
  
          if(is_valid == 9){
            setFetch(true)
            toast.warning(`One of the Shipment - Odometer KM3 Should be greater than Odometer KM2..`)
            return false
          }
  
        } else {
          if(is_valid == 10){
            toast.success(`FG-SALES Validation Verified..`)
          } else {
            toast.warning(`Shipment Info Not Found..`)
            return false
          }
        }
  
      }  
  
      /* FGSALES Validations */
      if(con.fgsales_available){ 
        ans_fgsales = basicValidation(fgsalesInfoData,1)
      }

      /* RJSO Validations */
      if(con.rjso_available){ 
        ans_rjso = basicValidation(rjsoInfodata,2)

        let oaw_error = 0
        let ew_error = 0
        let oawew_error = 0
        let mbr_error = 0

        let cuscode_error = 0 
        let cusfreight_error = 0 
        rjsoInfodata.map((vv,kk)=>{

          if( !(vv.oa_weight_input ? vv.oa_weight_input : vv.oa_weight) || (vv.oa_weight_input == '') || (vv.oa_weight_input == '' && vv.oa_weight == '') ){
            oaw_error = 1
          }

          if(!(vv.rj_customer_code) && !(vv.rj_customer_id_input)){
            cuscode_error = 1
          }

          if(!(vv.rj_customer_code) && !(vv.freight_input || vv.freight)){
            cusfreight_error = 1
          }

          if( !(vv.e_weight_input ? vv.e_weight_input : vv.e_weight) || (vv.e_weight_input == '') || (vv.e_weight_input == '' && vv.e_weight == '') ){
            ew_error = 1
          }

          if(Number(vv.e_weight_input ? vv.e_weight_input : vv.e_weight) > Number(vv.oa_weight_input ? vv.oa_weight_input : vv.oa_weight)){
            oawew_error = 1
          }

          if( !(vv.mbr_value_input ? vv.mbr_value_input : vv.mbr_value) || (vv.mbr_value_input == '') || (vv.mbr_value_input == '' && vv.mbr_value == '') ){
            mbr_error = 1
          } 
          
        })

        if(cuscode_error == 1){
          toast.warning(`One of the RJSO - Customer field was not selected..`)
          return false
        } 

        if(cusfreight_error == 1){
          toast.warning(`One of the RJSO - Freight field was not filled..`)
          return false
        } 

        if(oaw_error == 1){
          toast.warning(`One of the RJSO - Over All Weight field was not filled..`)
          return false
        }
        if(ew_error == 1){
          toast.warning(`One of the RJSO - Empty Weight field was not filled..`)
          return false
        }
        if(oawew_error == 1){
          toast.warning(`One of the RJSO - Empty Weight is greater than Over All Weight field..`)
          return false
        }
        if(mbr_error == 1){
          toast.warning(`One of the RJSO - MTS/BAG * RATE field was not filled...`)
          return false
        }
      }

      /* FGSTO Validations */
      if(con.fgsto_available){ 
        let div_error = 0
        let inv_error = 0
        let qty_error = 0
        console.log(fgstoInfoData,'fgstoInfoData')
        fgstoInfoData.map((vv,kk)=>{
          if( !(vv.division_input ? vv.division_input : vv.division) || (vv.division_input == '0') || (vv.division_input == '0' && vv.division == '0') ){
            div_error = 1
          }
          if( !(vv.document_no_input ? vv.document_no_input : vv.document_no) || (vv.document_no_input == '' && vv.document_no  == '') || vv.document_no_input == ''){
            inv_error = 1
          }
          if( !(vv.qty_input ? vv.qty_input : vv.qty) || (vv.qty_input == '') || (vv.qty_input == '' && vv.qty == '') ){
            qty_error = 1
          }
          
        })

        if(div_error == 1){
          toast.warning(`One of the FGSTO - Division field was not filled..`)
          return false
        }
        if(inv_error == 1){
          toast.warning(`One of the FGSTO - Invoice Number field was not filled..`)
          return false
        }
        if(qty_error == 1){
          toast.warning(`One of the FGSTO - Delivery Qty. field was not filled..`)
          return false
        }
        ans_fgsto = basicValidation(fgstoInfoData,3)
        if(ans_fgsto == false){

        } else {
          ans1 = fromToLocationValidation(fgstoInfoData,1)
        }
        
      }

      /* RMSTO Validations */
      if(con.rmsto_available){ 
        let rmoType_error = 0
        let div_error = 0
        let rmoCount_error = 0
        let qty_error = 0
        console.log(rmothersInfoData,'rmothersInfoData')
        rmothersInfoData.map((vv,kk)=>{
          
          if( !(vv.document_type_input ? vv.document_type_input : vv.document_type) || (vv.document_type_input == '0') || (vv.document_type_input == '0' && vv.document_type == '0') ){
            rmoType_error = 1
          }
          if( !(vv.division_input ? vv.division_input : vv.division) || (vv.division_input == '0') || (vv.division_input == '0' && vv.division == '0') ){
            div_error = 1
          } 

          if( !(vv.rmo_count_input ? vv.rmo_count_input : vv.rmo_count) || (vv.rmo_count_input == '') || (vv.rmo_count_input == '' && vv.rmo_count == '') ){
            rmoCount_error = 1
          }  
          if( !(vv.qty_input ? vv.qty_input : vv.qty) || (vv.qty_input == '') || (vv.qty_input == '' && vv.qty == '') ){
            qty_error = 1
          }
          
        })

        if(rmoType_error == 1){
          toast.warning(`One of the RM/Others - Movement Type field was not filled..`)
          return false
        }
        if(div_error == 1){
          toast.warning(`One of the RM/Others - Division field was not filled..`)
          return false
        }
        if(rmoCount_error == 1){
          toast.warning(`One of the RM/Others - Trip Count field was not filled..`)
          return false
        }
        if(qty_error == 1){
          toast.warning(`One of the RM/Others - Delivery Qty. field was not filled..`)
          return false
        }
        
        ans_rmothers = basicValidation(rmothersInfoData,4)
        if(ans_rmothers == false){

        } else {
          ans1 = fromToLocationValidation(rmothersInfoData,2)
        }
      }

      if(con.edi_available){
        let dlqty_error = 0
        let dlrpl_error = 0
        let bunkloc_error = 0 
        console.log(ticChild2Data,'ticChild2Data')
        ticChild2Data.map((vv,kk)=>{ 
          
          if( !(vv.di_enr_qty_input ? vv.di_enr_qty_input : vv.di_enr_qty) || (vv.di_enr_qty_input == '') || (vv.di_enr_qty_input == '' && vv.di_enr_qty == '') ){
            dlqty_error = 1
          } 
          if( !(vv.di_enr_rpl_input ? vv.di_enr_rpl_input : vv.di_enr_rpl) || (vv.di_enr_rpl_input == '') || (vv.di_enr_rpl_input == '' && vv.di_enr_rpl == '') ){
            dlrpl_error = 1
          } 
          if( !(vv.bunk_location_input ? vv.bunk_location_input : vv.bunk_location) || (vv.bunk_location_input == '') || (vv.bunk_location_input == '' && vv.bunk_location == '') ){
            bunkloc_error = 1
          }   
          
        })

        if(dlqty_error == 1){
          toast.warning(`One of the Enroute Diesel - Qty. in Litre field was not filled..`)
          return false
        }
        if(dlrpl_error == 1){
          toast.warning(`One of the Enroute Diesel - Rate Per Litre field was not filled..`)
          return false
        }
        if(bunkloc_error == 1){
          toast.warning(`One of the Enroute Diesel - Bunk Location field was not filled..`)
          return false
        } 
      }
    
      console.log(ans1,'ans1')
      if(ans_fgsales == false || ans_fgsto == false || ans_rjso == false || ans_rmothers == false || ans1 == false){
        toast.warning(`Validation Pending..`)
        return false
      }  
        
      toast.success(`Validation Completed..`)
      // return false 
  
      const formData = new FormData()

      formData.append('trip_id',tripsheetNumberData.tripsheet_sheet_id) 
      formData.append('pyg_id', tripsheetNumberData.parking_yard_gate_id)

      formData.append('ts_no', tripsheetNumberData.trip_sheet_info.trip_sheet_no)
      formData.append('ts_status', tripsheetNumberData.trip_sheet_info.status) 

      formData.append('opening_km', tripsheetNumberData.odometer_km)
      formData.append('ad_gate_in_status', 0)
      if(tripsheetNumberData.odometer_closing_km){
        formData.append('closing_km', tripsheetNumberData.odometer_closing_km)
        // formData.append('running_km', tripsheetNumberData.driver_id)
        formData.append('ad_gate_in_status', 1)
      }
    
      // formData.append('driver_id', tripsheetNumberData.driver_id)
      // formData.append('driver_name', tripsheetNumberData.driver_name)

      if(tripsheetNumberData.diesel_intent_info){
        formData.append('di_id', tripsheetNumberData.diesel_intent_info.id)
        formData.append('di_rns_qty', tripsheetNumberData.diesel_intent_info.no_of_ltrs)
        formData.append('di_rns_rpl', tripsheetNumberData.diesel_intent_info.rate_of_ltrs)
        formData.append('di_rns_amount', tripsheetNumberData.diesel_intent_info.total_amount)
        formData.append('di_status', tripsheetNumberData.diesel_intent_info.diesel_status)
      }
      
      formData.append('diesel_intent_info', tripsheetNumberData.diesel_intent_info && tripsheetNumberData.diesel_intent_collection_info.length > 0 ? JSON.stringify([tripsheetNumberData.diesel_intent_info]) : '')
      formData.append('fgsales_info', fgsalesInfoData && fgsalesInfoData.length > 0 ? JSON.stringify(fgsalesInfoData) : '')
      formData.append('fgsto_info', fgstoInfoData && fgstoInfoData.length > 0 ? JSON.stringify(fgstoInfoData) : '')
      formData.append('rmothers_info', rmothersInfoData && rmothersInfoData.length > 0 ? JSON.stringify(rmothersInfoData) : '')
      formData.append('rjso_info', rjsoInfodata && rjsoInfodata.length > 0 ? JSON.stringify(rjsoInfodata) : '')
      formData.append('edi_info', ticChild2Data && ticChild2Data.length > 0 ? JSON.stringify(ticChild2Data) : '')

      formData.append('veh_position', tripsheetNumberData.vehicle_current_position)
      formData.append('updated_by', user_id) 
      formData.append('status', 2) 

      formData.append('truck_work_km', twkm ? twkm : '')
      formData.append('mileage_shortage', mish ? mish : '')
      formData.append('company_return_load', crload ? crload : '')    
      formData.append('bvremarks', bvremarks ? bvremarks : '')
      formData.append('remarks', trRemarks ? trRemarks : '')
      formData.append('_method', 'PUT')
      setFetch(false) 
      TripInfoCaptureService.updateTICData(id,formData).then((res) => {
        console.log(res)
        setFetch(true) 

        if (res.status == 200) {
          Swal.fire({
            title: 'Tripsheet Info. Updated Successfully!',
            icon: "success", 
            confirmButtonText: "OK",
          }).then(function () {
            navigation('/OVTICHome')
          });
        } else if (res.status == 201) {
          Swal.fire({
            title: res.data.message,
            icon: "warning",
            confirmButtonText: "OK",
          }).then(function () {
            // window.location.reload(false)
          })
        } else {
          toast.warning('Tripsheet Info. Capture Process Failed. Kindly contact Admin..!')
        }

      })
  
    }
  
    const fgSalesValidation = (data) => {
      console.log(data,'fgSalesValidation-data')
      let error = 0
      let jt_having = 0
      let journey_type_having_array = []
      data.map((vv,kk)=>{

        if( !(vv.journey_type_input ? vv.journey_type_input : vv.journey_type) || vv.journey_type_input == '0' || (vv.journey_type_input == '0' && vv.journey_type == '') ){
          error = 1
        } else {
          jt_having = 1
          journey_type_having_array.push(kk)
        }
      })
  
      if(jt_having == 0)
      {
        return 1
      } 
  
      console.log(jt_having,'fgSalesValidation-jt_having')
      console.log(journey_type_having_array,'fgSalesValidation-journey_type_having_array')
  
      /* Time Validation */
      let start_time_error = 0
      let end_time_error = 0
      let start_end_time_difference_error = 0
      let opening_km_error = 0
      let closing_km_error = 0
      let opening_closing_km_difference_error = 0
      let from_place_error = 0
      let to_place_error = 0
      
      data.map((vv,kk)=>{
  
        if(JavascriptInArrayComponent(kk,journey_type_having_array))
        {
  
          console.log(kk,'fgSalesValidation-if-kk')

          if( !(vv.start_time_input ? vv.start_time_input : vv.start_time) || vv.start_time_input == '' || (vv.start_time_input == '' && vv.start_time == '') ){
            start_time_error = 1
          }
  
          if( !(vv.end_time_input ? vv.end_time_input : vv.end_time) || vv.end_time_input == '' ||  (vv.end_time_input == '' && vv.end_time == '' )){
            end_time_error = 1
          }
  
          let start = vv.start_time_input ? vv.start_time_input : vv.start_time
          let end = vv.end_time_input ? vv.end_time_input : vv.end_time
          let difference111 = diffTime(start,end)
  
          if(difference111 <= 0){
            start_end_time_difference_error = 1
          }
  
          if( !(vv.opening_km_input ? vv.opening_km_input : vv.opening_km) || (vv.opening_km_input == '') ||  (vv.opening_km_input == '' && vv.opening_km == '') ){
            opening_km_error = 1
          }
  
          if( !(vv.closing_km_input ? vv.closing_km_input : vv.closing_km) || (vv.closing_km_input == '') || (vv.closing_km_input == '' && vv.closing_km == '') ){
            closing_km_error = 1
          }
  
          if((vv.opening_km_input ? vv.opening_km_input : vv.opening_km) >= (vv.closing_km_input ? vv.closing_km_input : vv.closing_km)){
            opening_closing_km_difference_error = 1
          }
  
          if( !(vv.from_place_input ? vv.from_place_input : vv.from_place) || (vv.from_place_input == '') || (vv.from_place_input == '' && vv.from_place == '') ){
            from_place_error = 1
          }
  
          if( !(vv.to_place_input ? vv.to_place_input : vv.to_place) || vv.to_place_input == '' || (vv.to_place_input == '' && vv.to_place == '') ){
            to_place_error = 1
          }
  
        } else {
          console.log(kk,'fgSalesValidation-else-kk')
        }
  
      })
  
      console.log(start_time_error,'fgSalesValidation-start_time_error')
      console.log(end_time_error,'fgSalesValidation-end_time_error')
      console.log(start_end_time_difference_error,'fgSalesValidation-start_end_time_difference_error')
      console.log(opening_km_error,'fgSalesValidation-opening_km_error')
      console.log(closing_km_error,'fgSalesValidation-closing_km_error')
      console.log(opening_closing_km_difference_error,'fgSalesValidation-opening_closing_km_difference_error')
      console.log(from_place_error,'fgSalesValidation-from_place_error')
      console.log(to_place_error,'fgSalesValidation-to_place_error')
     
      if(start_time_error == 1){
        return 2
      } 
  
      if(end_time_error == 1){
        return 3
      } 
  
      if(start_end_time_difference_error == 1){
        return 4
      }
      
      if(from_place_error == 1){
        return 5
      }
  
      if(opening_km_error == 1){
        return 6
      }
  
      if(to_place_error == 1){
        return 7
      }
  
      if(closing_km_error == 1){
        return 8
      }
  
      if(opening_closing_km_difference_error == 1){
        return 9
      }
  
      return 10
    }
  
    /* ================ New Validation Method Part End ================ */

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
                    {/* <CRow className="mb-md-1">
                      <CCol md={3}>
                        <CFormLabel htmlFor="depoContractorName"> 
                          Tripsheet Number {tripsheetHaving ? '' : <REQ />}

                        </CFormLabel> 
                        <OVTICSearchSelectComponent
                          size="sm"
                          className="mb-2"
                          onChange={(e) => {
                            onChangeFilter(e)
                            {
                              handleChange
                            }
                          }}
                          label="Select Tripsheet Number"
                          noOptionsMessage="Tripsheet Not found" 
                          search_type={"open_ov_tripsheets"}
                          search_data={searchFilterData}
                        />
                      </CCol>
                    </CRow> */}
                    {tripsheetHaving && tripsheetNumberData && (
                      <>
                      <ColoredLine color="green" />
                        <CRow>
                          <CCol xs={12} md={3}>
                            <CFormLabel
                              htmlFor="inputAddress"
                              style={{
                                backgroundColor: '#4d3227',
                                margin: '4px 0',
                                color: 'white',
                              }}
                            >
                              Tripsheet Information
                            </CFormLabel>
                          </CCol>
                        </CRow>
                        <CRow>
                          {tripsheetNumberData.diesel_intent_info && (
                            <> 
                                <CCol md={3}>
                                  <CFormLabel htmlFor="dname"> Tripsheet Number</CFormLabel>
                                  <CFormInput
                                    name="dname"
                                    size="sm" 
                                    id="dname"
                                    readOnly
                                    value={user_info.is_admin == 1 ? `${ticData.ts_no} - ${tripsheetNumberData.vehicle_current_position} - ${ticData.veh_position}`: ticData.ts_no}                       
                                  />
                                </CCol>
                                <CCol md={3}>
                                  <CFormLabel htmlFor="dname"> Opening KM</CFormLabel>
                                  <CFormInput
                                    name="dname"
                                    size="sm" 
                                    id="dname"
                                    readOnly
                                    value={tripsheetNumberData.odometer_km}                       
                                  />
                                </CCol>
                                <CCol md={3}>
                                  <CFormLabel htmlFor="dname"> Closing KM</CFormLabel>
                                  <CFormInput
                                    name="dname"
                                    size="sm" 
                                    id="dname"
                                    readOnly
                                    value={tripsheetNumberData.odometer_closing_km}                       
                                  />
                                </CCol>
                                <CCol md={3}>
                                  <CFormLabel htmlFor="dname"> Running KM</CFormLabel>
                                  <CFormInput
                                    name="dname"
                                    size="sm" 
                                    id="dname"
                                    readOnly
                                    value={tripsheetNumberData.odometer_closing_km - tripsheetNumberData.odometer_km}                       
                                  />
                                </CCol>
                              {/* </CRow> */}
                            </>
                          )}
                        </CRow>
                        <CRow className="mb-md-1">
                          <CCol md={3}>
                            <CFormLabel htmlFor="tdate"> Tripsheet Date & Time</CFormLabel>
                            <CFormInput
                              name="tdate"
                              size="sm" 
                              id="tdate"
                              readOnly
                              value={tripsheetNumberData && tripsheetNumberData.trip_sheet_info ? tripsheetNumberData.trip_sheet_info.tripsheet_creation_time_string : '-'}                         
                            />
                          </CCol>
                          <CCol md={3}>
                            <CFormLabel htmlFor="tno"> Tripsheet Number</CFormLabel>
                            <CFormInput
                              name="tno"
                              size="sm" 
                              id="tno"
                              readOnly
                              value={tripsheetNumberData && tripsheetNumberData.trip_sheet_info ? tripsheetNumberData.trip_sheet_info.trip_sheet_no : '-'}                       
                            />
                          </CCol>
                          <CCol md={3}>
                            <CFormLabel htmlFor="tdiv"> Division / Purpose</CFormLabel>
                            <CFormInput
                              name="tdiv"
                              size="sm" 
                              id="tdiv"
                              readOnly  
                              value={`${tripsheetNumberData && tripsheetNumberData.trip_sheet_info ?  divFinder(tripsheetNumberData.trip_sheet_info) : '-'} / ${tripsheetNumberData && tripsheetNumberData.trip_sheet_info ? tripPurposeFinder(tripsheetNumberData.trip_sheet_info.purpose) : '-'}`}  
                            />
                          </CCol>
                          {/* <CCol md={3}>
                            <CFormLabel htmlFor="tpurpose"> Purpose</CFormLabel>
                            <CFormInput
                              name="tpurpose"
                              size="sm" 
                              id="tpurpose"
                              readOnly
                              value={tripsheetNumberData && tripsheetNumberData.trip_sheet_info ? tripPurposeFinder(tripsheetNumberData.trip_sheet_info.purpose) : '-'}                       
                            />
                          </CCol> */}
                          <CCol md={3}>
                            <CFormLabel htmlFor="tno"> Vehicle No. / Capacity in MTS</CFormLabel>
                            <CFormInput
                              name="vno"
                              size="sm" 
                              id="vno"
                              readOnly
                              value={`${tripsheetNumberData ? tripsheetNumberData.vehicle_number : '-'} / ${tripsheetNumberData && tripsheetNumberData.vehicle_capacity_id ? tripsheetNumberData.vehicle_capacity_id.capacity : '-'}`}                      
                            />
                          </CCol>
                          {/* <CCol md={3}>
                            <CFormLabel htmlFor="vcm"> Vehicle Capacity in MTS</CFormLabel>
                            <CFormInput
                              name="vcm"
                              size="sm" 
                              id="vcm"
                              readOnly
                              value={tripsheetNumberData && tripsheetNumberData.vehicle_capacity_id ? tripsheetNumberData.vehicle_capacity_id.capacity : '-'}                       
                            />
                          </CCol> */}
                          <CCol md={3}>
                            <CFormLabel htmlFor="dname"> Driver Name</CFormLabel>
                            <CFormInput
                              name="dname"
                              size="sm" 
                              id="dname"
                              readOnly
                              value={tripsheetNumberData ? tripsheetNumberData.driver_name : '-'}                       
                            />
                          </CCol>
                          <CCol md={1} >
                            <CTooltip
                              content="Add FG-Sales Info"
                              placement="top"
                            >
                              <CButton
                                size="sm"
                                style={{width:'100%'}}
                                color="success"
                                // color="secondary"
                                className="mt-4 px-2 text-white" 
                                onClick={() => { 
                                  fgsalesChildInsert()
                                }}
                              >
                                <i style={{color:'indigo', marginRight:'5%'}} className="fa fa-plus-square" aria-hidden="true"></i>
                                FG
                              </CButton>
                            </CTooltip> 
                          </CCol>
                          
                          <CCol md={1} >
                            <CTooltip
                              content="Add FGSTO Info"
                              placement="top"
                            >
                              <CButton
                                size="sm"
                                style={{width:'100%'}}
                                color="success"
                                className="mt-4 px-2 text-white" 
                                onClick={() => { 
                                  fgstoChildInsert()
                                }} /*marginRight:'5%' */
                              >
                                <i style={{color:'indigo', marginRight:'5%'}} className="fa fa-plus-square" aria-hidden="true"></i>
                                STO
                              </CButton>
                            </CTooltip> 
                          </CCol>

                          <CCol md={1} >
                            <CTooltip
                              content="Add Return Journey Info"
                              placement="top"
                            >
                              <CButton
                                size="sm"
                                style={{width:'100%'}}
                                color="warning"
                                // color="secondary"
                                className="mt-4 px-2 text-white" 
                                onClick={() => { 
                                  rjChildInsert()
                                }}
                              >
                                <i style={{color:'black', marginRight:'5%'}} className="fa fa-plus-square" aria-hidden="true"></i>
                                RJ
                              </CButton>
                            </CTooltip> 
                          </CCol>

                          <CCol md={1}> 
                            <CTooltip
                              content="Add RM / Others Info"
                              placement="top"
                            >
                              <CButton
                                size="sm"
                                style={{width:'100%'}}
                                color="primary"
                                className="mt-4 px-2 text-white" 
                                onClick={() => { 
                                  rmChildInsert()
                                }}
                              >
                                <i style={{color:'yellow', marginRight:'5%'}} className="fa fa-plus-square" aria-hidden="true"></i>
                                RMO
                              </CButton>
                            </CTooltip> 
                          </CCol>
                          <CCol md={2}>
                           
                            <CButton
                              size="sm"
                              style={{width:'100%'}}
                              color="danger"
                              className="mt-4 px-2 text-white" 
                              onClick={() => { 
                                enrouteDIChildInsert()
                              }}
                            >
                              <i style={{color:'indigo', marginRight:'5%'}} className="fa fa-plus-square" aria-hidden="true"></i>
                              Enroute Diesel
                              <i style={{color:'black', marginLeft:'5%'}} className="fa fa-truck" aria-hidden="true"></i>
                              
                            </CButton>
                          </CCol>
                          <CCol md={3}>
                            <CFormLabel htmlFor="dname">Trip Remarks</CFormLabel>
                            <CFormInput
                              name="dname"
                              size="sm" 
                              id="dname"
                              onChange={(e) => {
                                changeParentTableItemForChanges(e, 'trRemarks')
                              }}
                              value={trRemarks} 
                              maxLength={50}                     
                            />
                          </CCol>
                          
                        </CRow> 
                        <CRow>
                          <CCol xs={12} md={3}>
                            <CFormLabel
                              htmlFor="inputAddress"
                              style={{
                                backgroundColor: '#4d3227',
                                margin: '4px 0',
                                color: 'white',
                              }}
                            >
                              Manual Information Capturing
                            </CFormLabel>
                          </CCol>
                        </CRow>
                        <CRow className="mb-md-1">
                          <CCol md={2}>
                            <CFormLabel htmlFor="dname">Total Diesel Ltr</CFormLabel>
                            <CFormInput
                              name="dname"
                              size="sm" 
                              id="dname"
                              readOnly
                              value={'-'}                       
                            />
                          </CCol>
                          <CCol md={2}>
                            <CFormLabel htmlFor="dname">Total Milage</CFormLabel>
                            <CFormInput
                              name="dname"
                              size="sm" 
                              id="dname"
                              readOnly
                              value={'-'}                       
                            />
                          </CCol>
                          <CCol md={2}>
                            <CFormLabel htmlFor="dname">Total Diesel Amount</CFormLabel>
                            <CFormInput
                              name="dname"
                              size="sm" 
                              id="dname"
                              readOnly
                              value={'-'}                       
                            />
                          </CCol>
                          <CCol md={2}>
                            <CFormLabel htmlFor="dname">Truck Work Remarks</CFormLabel>
                            <CFormInput
                              size="sm"
                              type="text"
                              onChange={(e) => {
                                changeParentTableItemForChanges(e, 'twkm')
                              }}
                              value={twkm}  
                              maxLength={50}
                            />
                          </CCol>
                          <CCol md={2}>
                            <CFormLabel htmlFor="dname">Company return load</CFormLabel>
                            <CFormInput
                              size="sm"
                              type="text"
                              onChange={(e) => {
                                changeParentTableItemForChanges(e, 'crload')
                              }}
                              value={crload} 
                              maxLength={50}
                            />
                          </CCol>
                          <CCol md={2}>
                            <CFormLabel htmlFor="dname">Mileage shortage Remarks</CFormLabel>
                            <CFormInput
                              size="sm"
                              type="text"
                              onChange={(e) => {
                                changeParentTableItemForChanges(e, 'mish')
                              }}
                              value={mish} 
                              maxLength={50}
                            />
                          </CCol>
                        </CRow>
                      </>
                    )}
                    {tripsheetHaving && tripsheetNumberData && tripsheetNumberData.diesel_intent_info && (
                      <>
                        <ColoredLine color="blue" />
                        <CRow>
                          <CCol xs={12} md={3}>
                            <CFormLabel
                              htmlFor="inputAddress"
                              style={{
                                backgroundColor: '#4d3227',
                                margin: '4px 0',
                                color: 'white',
                              }}
                            >
                              Diesel Indent Information
                            </CFormLabel>
                          </CCol>
                        </CRow>
                        <CRow className="mb-md-1">
                          <CCol md={2}>
                            <CFormLabel htmlFor="dname"> Diesel Vendor</CFormLabel>
                            <CFormInput
                              name="dname"
                              size="sm" 
                              id="dname"
                              readOnly
                              // value={tripsheetNumberData.diesel_intent_info.vendor_code	? tripsheetNumberData.diesel_intent_info.vendor_code == 225831 ? 'RNS Fuel Station' : 'RS Petroleum' : '-'}   
                              value={dieselVendorFinder(tripsheetNumberData.diesel_intent_info.vendor_code)}                    
                            />
                          </CCol>
                          <CCol md={2}>
                            <CFormLabel htmlFor="dname"> Diesel Qty in Ltr.</CFormLabel>
                            <CFormInput
                              name="dname"
                              size="sm" 
                              id="dname"
                              readOnly
                              value={tripsheetNumberData.diesel_intent_info.no_of_ltrs ? tripsheetNumberData.diesel_intent_info.no_of_ltrs	 : '-'}                        
                            />
                          </CCol>
                          <CCol md={2}>
                            <CFormLabel htmlFor="dname"> Diesel Rate Per Ltr.</CFormLabel>
                            <CFormInput
                              name="dname"
                              size="sm" 
                              id="dname"
                              readOnly
                              value={tripsheetNumberData.diesel_intent_info.rate_of_ltrs ? tripsheetNumberData.diesel_intent_info.rate_of_ltrs	: '-'}                      
                            />
                          </CCol>
                          <CCol md={2}>
                            <CFormLabel htmlFor="dname"> Diesel Amount</CFormLabel>
                            <CFormInput
                              name="dname"
                              size="sm" 
                              id="dname"
                              readOnly
                              value={tripsheetNumberData.diesel_intent_info.total_amount ? tripsheetNumberData.diesel_intent_info.total_amount	 : '-'}                       
                            />
                          </CCol>
                          <CCol md={2}>
                            <CFormLabel htmlFor="dname"> DI Creation Time</CFormLabel>
                            <CFormInput
                              name="dname"
                              size="sm" 
                              id="dname"
                              readOnly
                              value={tripsheetNumberData.diesel_intent_info.invoice_date_time_string ? tripsheetNumberData.diesel_intent_info.invoice_date_time_string	 : '-'}                       
                            />
                          </CCol>
                          <CCol md={2}>
                            <CFormLabel htmlFor="dname"> Mileage in KM</CFormLabel>
                            <CFormInput
                              name="dname"
                              size="sm" 
                              id="dname"
                              readOnly
                              value={mileageFinder(ticData)}                    
                            />
                          </CCol>
                        </CRow>                        
                      </>
                    )} 
                    {/* {tripsheetNumberData && tripsheetNumberData.shipment_info && tripsheetNumberData.shipment_info.map((val, index) => { */}
                    {fgsalesInfoData && fgsalesInfoData.length > 0 && fgsalesInfoData.map((val, index) => {
                      return (
                        <>
                          <ColoredLine color="red" />
                          <CRow>
                            <CCol xs={12} md={3}>
                              <CFormLabel
                                htmlFor="inputAddress"
                                style={{
                                  backgroundColor: '#4d3227',
                                  margin: '4px 0',
                                  color: 'white',
                                }}
                              > 
                                {`FG-SALES Information ${val.lp_rfj == 1 ? '( Auto ) .' : '( Manual ) .'}`}
                              </CFormLabel>
                            </CCol>
                            <CCol md={3}>
                              <CFormSelect 
                                aria-label="Default select example"
                                onChange={(e) => {
                                  changeFgsalesTableItemForChanges(e, 'journey_type', index)
                                }}
                                value={FgsalesDataUpdateForChanges(val.journey_type, val.journey_type_input)}
                              >
                                <option value="0">Journey Type</option>
                                <option value="1">FJ</option>
                                <option value="2">RJ</option> 
                              </CFormSelect>                               
                            </CCol>
                            {val.lp_rfj == 1 ? ( <></>                                
                              ) :  (
                              <>
                                <CCol md={3}></CCol>
                                <CCol style={{ display: 'flex', justifyContent: 'flex-end' }} md={3}>
                                  <CButton
                                    size="s-lg"
                                    color={val.status ? "success": "danger"}
                                    className="text-white" 
                                    onClick={() => { 
                                      removeFgsalesChild(fgsalesInfoData,index)
                                    }}
                                  >
                                    Remove
                                  </CButton>
                                </CCol>
                              </>
                            )}
                          </CRow>
                          
                          <CRow className="mb-md-1">

                            {val.lp_rfj == 1 ? ( 
                              <CCol md={2}>
                                <CFormLabel htmlFor="sno"> Shipment Number</CFormLabel>
                                <CFormInput
                                  name="sno"
                                  size="sm" 
                                  id="sno"
                                  readOnly
                                  value={val.document_no ? val.document_no : '-'}                       
                                />
                              </CCol>) : (
                              <CCol xs={12} md={2}>
                                <CFormLabel htmlFor="openKM">Shipment Number</CFormLabel>

                                <CFormInput
                                  size="sm"
                                  type="text"
                                  onChange={(e) => {
                                    changeFgsalesTableItemForChanges(e, 'document_no', index)
                                  }}
                                  value={FgsalesDataUpdateForChanges(
                                    val.document_no,
                                    val.document_no_input
                                  )}
                                  maxLength={20}
                                />
                                  
                              </CCol>
                            )}
                            
                            {val.lp_rfj == 1 ? (
                              <CCol md={2}>
                                <CFormLabel htmlFor="sqm"> Qty. in MTS</CFormLabel>
                                <CFormInput
                                  name="sqm"
                                  size="sm" 
                                  id="sqm"
                                  readOnly
                                  value={val.qty ? val.qty:''}                       
                                />
                              </CCol>) : (
                              <CCol xs={12} md={2}>
                                <CFormLabel htmlFor="openKM">Qty. in MTS</CFormLabel>

                                <CFormInput
                                  size="sm"
                                  type="text"
                                  onChange={(e) => {
                                    changeFgsalesTableItemForChanges(e, 'qty', index)
                                  }}
                                  value={FgsalesDataUpdateForChanges(
                                    val.qty,
                                    val.qty_input
                                  )}
                                  maxLength={20}
                                />
                                  
                              </CCol>
                            )}

                            {val.lp_rfj == 1 ? (
                              <CCol md={2}>
                                <CFormLabel htmlFor="sno"> Division</CFormLabel>
                                <CFormInput
                                  name="sno"
                                  size="sm" 
                                  id="sno"
                                  readOnly
                                  value={val.division == '2' ? 'NLCD' : (val.division == '1' ? 'NLFD' :'-')}                       
                                />
                              </CCol> ) : (
                              <CCol md={2}>
                                <CFormLabel htmlFor="sno"> Division</CFormLabel>
                                <CFormSelect 
                                  aria-label="Default select example"
                                  onChange={(e) => {
                                    changeFgsalesTableItemForChanges(e, 'division', index)
                                  }}
                                  value={FgsalesDataUpdateForChanges(val.division, val.division_input)}
                                >
                                  <option value="0">--Select--</option>
                                  <option value="1">NLFD (FOODS)</option>
                                  <option value="2">NLCD (CONSUMER)</option> 
                                </CFormSelect>                               
                              </CCol> 
                            )}
                            <CCol xs={12} md={2}>
                              <CFormLabel htmlFor="openKM">Start Time <REQ /></CFormLabel>

                              <CFormInput
                                size="sm"
                                type="datetime-local"
                                onChange={(e) => {
                                  changeFgsalesTableItemForChanges(e, 'start_time', index)
                                }}
                                value={FgsalesDataUpdateForChanges(
                                  val.start_time,
                                  val.start_time_input
                                )}
                                maxLength={6}
                              />
                                
                            </CCol>
                            <CCol xs={12} md={2}>
                              <CFormLabel htmlFor="closeKM">End Time <REQ /></CFormLabel>

                              <CFormInput
                                size="sm"
                                type="datetime-local"
                                onChange={(e) => {
                                  changeFgsalesTableItemForChanges(e, 'end_time', index)
                                }}
                                value={FgsalesDataUpdateForChanges(
                                  val.end_time,
                                  val.end_time_input
                                )}
                                maxLength={6}
                              />
                              
                            </CCol>
                            {/* <CCol xs={12} md={2}>
                              <CFormLabel htmlFor="runKM">Total Time</CFormLabel>

                              <CFormInput
                                size="sm"
                                id="runKM" 
                                value={Find_Difference_Hrs(1,index)} 
                                readOnly
                              />
                            </CCol>
                            <CCol xs={12} md={2}>
                              <CFormLabel htmlFor="openKM">From Location<REQ /></CFormLabel>

                              <CFormInput
                                size="sm"
                                type="text"
                                onChange={(e) => {
                                  changeFgsalesTableItemForChanges(e, 'from_place', index)
                                }}
                                value={FgsalesDataUpdateForChanges(
                                  val.from_place,
                                  val.from_place_input
                                )}
                                maxLength={20}
                              />
                                
                            </CCol>
                            <CCol xs={12} md={2}>
                              <CFormLabel htmlFor="closeKM">To Location<REQ /></CFormLabel>

                              <CFormInput
                                size="sm"
                                type="text"
                                onChange={(e) => {
                                  changeFgsalesTableItemForChanges(e, 'to_place', index)
                                }}
                                value={FgsalesDataUpdateForChanges(
                                  val.to_place,
                                  val.to_place_input
                                )}
                                maxLength={20}
                              />
                              
                            </CCol>
                            <CCol xs={12} md={2}>
                              <CFormLabel htmlFor="openKM">Opening KM <REQ /></CFormLabel>

                              <CFormInput
                                size="sm"
                                type="text"
                                onChange={(e) => {
                                  changeFgsalesTableItemForChanges(e, 'opening_km', index)
                                }}
                                value={FgsalesDataUpdateForChanges(
                                  val.opening_km,
                                  val.opening_km_input
                                )}
                                maxLength={6}
                              />
                                
                            </CCol>
                            <CCol xs={12} md={2}>
                              <CFormLabel htmlFor="closeKM">Closing KM <REQ /></CFormLabel>

                              <CFormInput
                                size="sm"
                                type="text"
                                onChange={(e) => {
                                  changeFgsalesTableItemForChanges(e, 'closing_km', index)
                                }}
                                value={FgsalesDataUpdateForChanges(
                                  val.closing_km,
                                  val.closing_km_input
                                )}
                                maxLength={6}
                              />
                              
                            </CCol>
                            <CCol xs={12} md={2}>
                              <CFormLabel htmlFor="runKM">Running KM</CFormLabel>

                              <CFormInput
                                size="sm"
                                id="runKM"
                                value={FgsalesDataUpdateForChanges(
                                  val.running_km,
                                  val.running_km_input
                                )} 
                                readOnly
                              />
                            </CCol>
                            <CCol xs={12} md={2}>
                              <CFormLabel htmlFor="openKM">Remarks </CFormLabel>

                              <CFormInput
                                size="sm"
                                type="text"
                                onChange={(e) => {
                                  changeFgsalesTableItemForChanges(e, 'remarks', index)
                                }}
                                maxLength={40}
                                value={FgsalesDataUpdateForChanges(
                                  val.remarks,
                                  val.remarks_input
                                )} 
                                
                              />
                                
                            </CCol> */}

                            <CCol xs={12} md={2}>
                              <CFormLabel htmlFor="openKM">Remarks</CFormLabel>

                              <CFormInput
                                size="sm"
                                type="text"
                                onChange={(e) => {
                                  changeFgsalesTableItemForChanges(e, 'remarks', index)
                                }}
                                value={FgsalesDataUpdateForChanges(
                                  val.remarks,
                                  val.remarks_input
                                )} 
                                maxLength={50}
                              />
                                
                            </CCol>
                            
                            <CCol xs={12} md={2}>
                              <CFormLabel htmlFor="openKM">From Location </CFormLabel>

                              <CFormInput
                                size="sm"
                                type="text"
                                onChange={(e) => {
                                  changeFgsalesTableItemForChanges(e, 'from_empty_place', index)
                                }}
                                value={FgsalesDataUpdateForChanges(
                                  val.from_empty_place,
                                  val.from_empty_place_input
                                )}
                                maxLength={20}
                              />
                                
                            </CCol>
                            <CCol xs={12} md={2}>
                              <CFormLabel htmlFor="openKM">Odometer KM1</CFormLabel>

                              <CFormInput
                                size="sm"
                                type="text"
                                onChange={(e) => {
                                  changeFgsalesTableItemForChanges(e, 'from_empty_km', index)
                                }}
                                value={FgsalesDataUpdateForChanges(
                                  val.from_empty_km,
                                  val.from_empty_km_input
                                )}
                                maxLength={6}
                              />
                                
                            </CCol>
                            <CCol xs={12} md={2}>
                              <CFormLabel htmlFor="openKM">Loaded Location<REQ /></CFormLabel>

                              <CFormInput
                                size="sm"
                                type="text"
                                onChange={(e) => {
                                  changeFgsalesTableItemForChanges(e, 'from_place', index)
                                }}
                                value={FgsalesDataUpdateForChanges(
                                  val.from_place,
                                  val.from_place_input
                                )}
                                maxLength={20}
                              />
                                
                            </CCol>
                            <CCol xs={12} md={2}>
                              <CFormLabel htmlFor="openKM">Odometer KM2<REQ /></CFormLabel>

                              <CFormInput
                                size="sm"
                                type="text"
                                onChange={(e) => {
                                  changeFgsalesTableItemForChanges(e, 'opening_km', index)
                                }}
                                value={FgsalesDataUpdateForChanges(
                                  val.opening_km,
                                  val.opening_km_input
                                )}
                                maxLength={6}
                              />
                                
                            </CCol>
                            <CCol xs={12} md={2}>
                              <CFormLabel htmlFor="closeKM">Unloaded Location<REQ /></CFormLabel>

                              <CFormInput
                                size="sm"
                                type="text"
                                onChange={(e) => {
                                  changeFgsalesTableItemForChanges(e, 'to_place', index)
                                }}
                                value={FgsalesDataUpdateForChanges(
                                  val.to_place,
                                  val.to_place_input
                                )}
                                maxLength={20}
                              />
                              
                            </CCol>
                            
                            <CCol xs={12} md={2}>
                              <CFormLabel htmlFor="closeKM">Odometer KM3<REQ /></CFormLabel>

                              <CFormInput
                                size="sm"
                                type="text"
                                onChange={(e) => {
                                  changeFgsalesTableItemForChanges(e, 'closing_km', index)
                                }}
                                value={FgsalesDataUpdateForChanges(
                                  val.closing_km,
                                  val.closing_km_input
                                )}
                                maxLength={6}
                              />
                              
                            </CCol>
                            <CCol xs={12} md={2}>
                              <CFormLabel htmlFor="openKM">To Location Empty Run</CFormLabel>

                              <CFormInput
                                size="sm"
                                type="text"
                                onChange={(e) => {
                                  changeFgsalesTableItemForChanges(e, 'to_empty_place', index)
                                }}
                                value={FgsalesDataUpdateForChanges(
                                  val.to_empty_place,
                                  val.to_empty_place_input
                                )}
                                maxLength={20}
                              />
                                
                            </CCol>
                            <CCol xs={12} md={2}>
                              <CFormLabel htmlFor="openKM">Odometer KM4</CFormLabel>

                              <CFormInput
                                size="sm"
                                type="text"
                                onChange={(e) => {
                                  changeFgsalesTableItemForChanges(e, 'to_empty_km', index)
                                }}
                                value={FgsalesDataUpdateForChanges(
                                  val.to_empty_km,
                                  val.to_empty_km_input
                                )}
                                maxLength={6}
                              />
                                
                            </CCol>
                            
                            <CCol xs={12} md={2}>
                              <CFormLabel htmlFor="runKM">FJ Empty KM</CFormLabel>

                              <CFormInput
                                size="sm"
                                id="runKM" 
                                value={FJ_Empty_Km_Finder(1,index)} 
                                readOnly
                              />
                            </CCol>
                            <CCol xs={12} md={2}>
                              <CFormLabel htmlFor="runKM">Loaded Trip KM</CFormLabel>

                              <CFormInput
                                size="sm"
                                id="runKM"
                                value={Loaded_Trip_Km_Finder(1,index)} 
                                readOnly
                              />
                            </CCol>
                            <CCol xs={12} md={2}>
                              <CFormLabel htmlFor="runKM">After Unload Empty KM</CFormLabel>

                              <CFormInput
                                size="sm"
                                id="runKM" 
                                value={After_Unload_Empty_KM_Finder(1,index)} 
                                readOnly
                              />
                            </CCol>
                            <CCol xs={12} md={2}>
                              <CFormLabel htmlFor="totKM">Total Trip KM</CFormLabel>

                              <CFormInput
                                size="sm"
                                id="totKM" 
                                value={Total_Trip_Km_Finder(1,index)} 
                                readOnly
                              />
                            </CCol>
                            <CCol xs={12} md={2}>
                              <CFormLabel htmlFor="runKM">Total Trip Hrs</CFormLabel>

                              <CFormInput
                                size="sm"
                                id="runKM" 
                                value={Find_Difference_Hrs(1,index)} 
                                readOnly
                              />
                            </CCol>
                            
                          </CRow>
                        </>
                    )})}
                    {/*OD160924001 */}
                    {/* {tripsheetNumberData && tripsheetNumberData.rj_so_info && tripsheetNumberData.rj_so_info.map((val, index) => { */}
                    {rjsoInfodata && rjsoInfodata.length > 0 && rjsoInfodata.map((val, index) => {
                      return (
                        <>
                          <ColoredLine color="blue" />
                          <CRow>
                            <CCol xs={12} md={6}>
                              <CFormLabel
                                htmlFor="inputAddress"
                                style={{
                                  backgroundColor: '#4d3227',
                                  margin: '4px 0',
                                  color: 'white',
                                }}
                              >
                                {`Return Journey Information ${val.lp_rfj == 1 ? '( Auto ) .' : '( Manual ) .'}`}
                              </CFormLabel>
                            </CCol>
                          </CRow>
                          
                          <CRow className="mb-md-1">

                            {val.lp_rfj == 1 ? ( 
                              <CCol md={2}>
                                <CFormLabel htmlFor="sno"> RJSO Number</CFormLabel>
                                <CFormInput
                                  name="sno"
                                  size="sm" 
                                  id="sno"
                                  readOnly
                                  value={val.document_no ? val.document_no : '-'}                       
                                />
                              </CCol>) : (
                              <CCol xs={12} md={2}>
                                <CFormLabel htmlFor="openKM">RJSO Doc. No. </CFormLabel>
  
                                <CFormInput
                                  size="sm"
                                  type="text"
                                  onChange={(e) => {
                                    changeRJTableItemForChanges(e, 'document_no', index)
                                  }}
                                  value={RJDataUpdateForChanges(
                                    val.document_no,
                                    val.document_no_input
                                  )}
                                  maxLength={20}
                                />
                                  
                              </CCol>
                            )}
                            {val.lp_rfj == 1 ? ( 
                              <CCol md={2}>
                                <CFormLabel htmlFor="sno"> Customer Code</CFormLabel>
                                <CFormInput
                                  name="sno"
                                  size="sm" 
                                  id="sno"
                                  readOnly
                                  value={val.rj_customer_code ? val.rj_customer_code : '-'}                       
                                />
                              </CCol>) : (
                                <>
                                  <CCol xs={12} md={2}>
                                    <CFormLabel htmlFor="rj_customer_name">
                                      Customer Name <REQ />{' '}
                                      
                                    </CFormLabel>
                                    <CFormSelect
                                      size="sm"
                                      name="rj_customer_id"
                                      // value={RJDataUpdateForChanges(val.rj_customer_name, val.rj_customer_name_input)}   
                                      value={RJDataUpdateForChanges(val.rj_customer_id, val.rj_customer_id_input)}   
                                                                       
                                      aria-label="Small select example"
                                      onChange={(e) => {
                                        changeRJTableItemForChanges(e, 'rj_customer_id', index)
                                      }}
                                      id="rj_customer_id"
                                    >
                                      <option value="0">Select ...</option>
                                      {shedName.map(({ customer_id, customer_name }) => {
                                        if (customer_id) {
                                          return (
                                            <>
                                              <option key={customer_id}  value={customer_id}>
                                                {customer_name}
                                              </option>
                                            </>
                                          )
                                        }
                                      })}
                                    </CFormSelect>
                                  </CCol>
                                  <CCol md={2}>
                                    <CFormLabel htmlFor="sno"> Customer Code</CFormLabel>
                                    <CFormInput
                                      name="sno"
                                      size="sm" 
                                      id="sno"
                                      readOnly
                                      value={(val.rj_customer_code_input || val.rj_customer_code_input == 0) ? val.rj_customer_code_input : (val.rj_customer_code ? val.rj_customer_code : '0')}                       
                                    />
                                  </CCol>
                                </>
                            )}
                            {val.lp_rfj == 1 ? ( 
                              <CCol md={2}>
                                <CFormLabel htmlFor="sno"> Customer Name</CFormLabel>
                                <CFormInput
                                  name="sno"
                                  size="sm" 
                                  id="sno"
                                  readOnly
                                  value={val.rj_customer_name ? val.rj_customer_name : '-'}                       
                                />
                              </CCol>) : (<></>)}
                            {/* <CCol md={2}>
                              <CFormLabel htmlFor="sno"> Customer Name</CFormLabel>
                              <CFormInput
                                name="sno"
                                size="sm" 
                                id="sno"
                                readOnly
                                // value={val.customer_info.customer_name ? val.customer_info.customer_name : '-'}                       
                              />
                            </CCol>
                            <CCol md={2}>
                              <CFormLabel htmlFor="sno"> Customer Code</CFormLabel>
                              <CFormInput
                                name="sno"
                                size="sm" 
                                id="sno"
                                readOnly
                                value={val.customer_code ? val.customer_code : '-'}                       
                              />
                            </CCol> */}
                            {/* <CCol md={2}>
                              <CFormLabel htmlFor="sqm"> Quantity in MTS</CFormLabel>
                              <CFormInput
                                name="sqm"
                                size="sm" 
                                id="sqm"
                                readOnly
                                value={`${val.qty	 ? val.qty	 : '-'}`}                       
                              />
                            </CCol> 
                            <CCol md={2}>
                              <CFormLabel htmlFor="sqm"> Freight Amount</CFormLabel>
                              <CFormInput
                                name="sqm"
                                size="sm" 
                                id="sqm"
                                readOnly
                                value={`${val.freight ? val.freight : '-'}`}                       
                              />
                            </CCol> */}
                            {val.lp_rfj == 1 ? ( 
                              <CCol md={2}>
                                <CFormLabel htmlFor="sqm">Freight Amount</CFormLabel>
                                <CFormInput
                                  name="sqm"
                                  size="sm" 
                                  id="sqm"
                                  readOnly
                                  value={`${val.freight ? val.freight : '-'}`}                       
                                />
                              </CCol> 
                            ) : (
                              <>
                                <CCol xs={12} md={2}>
                                  <CFormLabel htmlFor="openKM">Freight <REQ /></CFormLabel>
    
                                  <CFormInput
                                    size="sm"
                                    type="text"
                                    onChange={(e) => {
                                      changeRJTableItemForChanges(e, 'freight', index)
                                    }}
                                    value={RJDataUpdateForChanges(
                                      val.freight,
                                      val.freight_input
                                    )}
                                    maxLength={20}
                                  />
                                    
                                </CCol>
                              </>
                            )}
                            <CCol xs={12} md={2}>
                              <CFormLabel htmlFor="openKM">Start Time <REQ /></CFormLabel>

                              <CFormInput
                                size="sm"
                                type="datetime-local"
                                onChange={(e) => {
                                  changeRJTableItemForChanges(e, 'start_time', index)
                                }}
                                value={RJDataUpdateForChanges(
                                  val.start_time,
                                  val.start_time_input
                                )}
                                maxLength={6}
                              />
                                
                            </CCol>
                            <CCol xs={12} md={2}>
                              <CFormLabel htmlFor="closeKM">End Time <REQ /></CFormLabel>

                              <CFormInput
                                size="sm"
                                type="datetime-local"
                                onChange={(e) => {
                                  changeRJTableItemForChanges(e, 'end_time', index)
                                }}
                                value={RJDataUpdateForChanges(
                                  val.end_time,
                                  val.end_time_input
                                )}
                                maxLength={6}
                              />
                              
                            </CCol>
                            {/* <CCol xs={12} md={2}>
                              <CFormLabel htmlFor="runKM">Total Time</CFormLabel>

                              <CFormInput
                                size="sm"
                                id="runKM" 
                                value={Find_Difference_Hrs(2,index)} 
                                readOnly
                              />
                            </CCol>
                            <CCol md={2}>
                              <CFormLabel htmlFor="sqm">From Location</CFormLabel>
                              <CFormInput
                                name="sqm"
                                size="sm" 
                                id="sqm"
                                readOnly
                                value={`${val.from_place ? val.from_place : '-'}`}                 
                              />
                            </CCol> 
                            <CCol md={2}>
                              <CFormLabel htmlFor="sqm">To Location</CFormLabel>
                              <CFormInput
                                name="sqm"
                                size="sm" 
                                id="sqm"
                                readOnly
                                value={`${val.to_place ? val.to_place : '-'}`}                 
                              />
                            </CCol> 
                            <CCol xs={12} md={2}>
                              <CFormLabel htmlFor="openKM">Opening KM <REQ /></CFormLabel>

                              <CFormInput
                                size="sm"
                                type="text"
                                onChange={(e) => {
                                  changeRJTableItemForChanges(e, 'opening_km', index)
                                }}
                                value={RJDataUpdateForChanges(
                                  val.opening_km,
                                  val.opening_km_input
                                )}
                                maxLength={6}
                              />
                                
                            </CCol>
                            <CCol xs={12} md={2}>
                              <CFormLabel htmlFor="closeKM">Closing KM <REQ /></CFormLabel>

                              <CFormInput
                                size="sm"
                                type="text"
                                onChange={(e) => {
                                  changeRJTableItemForChanges(e, 'closing_km', index)
                                }}
                                value={RJDataUpdateForChanges(
                                  val.closing_km,
                                  val.closing_km_input
                                )}
                                maxLength={6}
                              />
                              
                            </CCol>
                            <CCol xs={12} md={2}>
                              <CFormLabel htmlFor="runKM">Running KM</CFormLabel>

                              <CFormInput
                                size="sm"
                                id="runKM"
                                value={RJDataUpdateForChanges(
                                  val.running_km,
                                  val.running_km_input
                                )}
                                // value={(
                                //   val.running_km,
                                //   val.running_km_input
                                // )}
                                readOnly
                              />
                            </CCol>
                            <CCol xs={12} md={2}>
                              <CFormLabel htmlFor="openKM">Remarks<REQ /></CFormLabel>

                              <CFormInput
                                size="sm"
                                type="text"
                                onChange={(e) => {
                                  changeRJTableItemForChanges(e, 'Remarks', index)
                                }}
                                value={RJDataUpdateForChanges(
                                  val.remarks,
                                  val.Remarks_input
                                )}
                                maxLength={40}
                              />
                                
                            </CCol> */}
                            <CCol xs={12} md={2}>
                              <CFormLabel htmlFor="openKM">From Location </CFormLabel>

                              <CFormInput
                                size="sm"
                                type="text"
                                onChange={(e) => {
                                  changeRJTableItemForChanges(e, 'from_empty_place', index)
                                }}
                                value={RJDataUpdateForChanges(
                                  val.from_empty_place,
                                  val.from_empty_place_input
                                )}
                                maxLength={20}
                              />
                                
                            </CCol>
                            <CCol xs={12} md={2}>
                              <CFormLabel htmlFor="openKM">Odometer KM1</CFormLabel>

                              <CFormInput
                                size="sm"
                                type="text"
                                onChange={(e) => {
                                  changeRJTableItemForChanges(e, 'from_empty_km', index)
                                }}
                                value={RJDataUpdateForChanges(
                                  val.from_empty_km,
                                  val.from_empty_km_input
                                )}
                                maxLength={6}
                              />
                                
                            </CCol>
                            
                            {val.lp_rfj == 1 ? ( 
                              <CCol md={2}>
                                <CFormLabel htmlFor="sqm">Loaded Location</CFormLabel>
                                <CFormInput
                                  name="sqm"
                                  size="sm" 
                                  id="sqm"
                                  readOnly
                                  value={`${val.from_place ? val.from_place : '-'}`}                 
                                />
                              </CCol> ) : (
                              <CCol xs={12} md={2}>
                                <CFormLabel htmlFor="openKM">Loaded Location<REQ /></CFormLabel>

                                <CFormInput
                                  size="sm"
                                  type="text"
                                  onChange={(e) => {
                                    changeRJTableItemForChanges(e, 'from_place', index)
                                  }}
                                  value={RJDataUpdateForChanges(
                                    val.from_place,
                                    val.from_place_input
                                  )}
                                  maxLength={20}
                                />                                  
                              </CCol>
                            )}
                            <CCol xs={12} md={2}>
                              <CFormLabel htmlFor="openKM">Odometer KM2<REQ /></CFormLabel>

                              <CFormInput
                                size="sm"
                                type="text"
                                onChange={(e) => {
                                  changeRJTableItemForChanges(e, 'opening_km', index)
                                }}
                                value={RJDataUpdateForChanges(
                                  val.opening_km,
                                  val.opening_km_input
                                )}
                                maxLength={6}
                              />
                                
                            </CCol>

                            {val.lp_rfj == 1 ? (
                              <CCol md={2}>
                                <CFormLabel htmlFor="sqm">Unloaded Location</CFormLabel>
                                <CFormInput
                                  name="sqm"
                                  size="sm" 
                                  id="sqm"
                                  readOnly
                                  value={`${val.to_place ? val.to_place : '-'}`}                 
                                />
                              </CCol>

                              ):(

                              <CCol xs={12} md={2}>
                                <CFormLabel htmlFor="closeKM">Unloaded Location<REQ /></CFormLabel>

                                <CFormInput
                                  size="sm"
                                  type="text"
                                  onChange={(e) => {
                                    changeRJTableItemForChanges(e, 'to_place', index)
                                  }}
                                  value={RJDataUpdateForChanges(
                                    val.to_place,
                                    val.to_place_input
                                  )}
                                  maxLength={20}
                                />
                                
                              </CCol> 
                            )}
                            <CCol xs={12} md={2}>
                              <CFormLabel htmlFor="closeKM">Odometer KM3<REQ /></CFormLabel>

                              <CFormInput
                                size="sm"
                                type="text"
                                onChange={(e) => {
                                  changeRJTableItemForChanges(e, 'closing_km', index)
                                }}
                                value={RJDataUpdateForChanges(
                                  val.closing_km,
                                  val.closing_km_input
                                )}
                                maxLength={6}
                              />
                              
                            </CCol>
                            <CCol xs={12} md={2}>
                              <CFormLabel htmlFor="openKM">To Location Empty Run</CFormLabel>

                              <CFormInput
                                size="sm"
                                type="text"
                                onChange={(e) => {
                                  changeRJTableItemForChanges(e, 'to_empty_place', index)
                                }}
                                value={RJDataUpdateForChanges(
                                  val.to_empty_place,
                                  val.to_empty_place_input
                                )}
                                maxLength={20}
                              />
                                
                            </CCol>
                            <CCol xs={12} md={2}>
                              <CFormLabel htmlFor="openKM">Odometer KM4</CFormLabel>

                              <CFormInput
                                size="sm"
                                type="text"
                                onChange={(e) => {
                                  changeRJTableItemForChanges(e, 'to_empty_km', index)
                                }}
                                value={RJDataUpdateForChanges(
                                  val.to_empty_km,
                                  val.to_empty_km_input
                                )}
                                maxLength={6}
                              />
                                
                            </CCol>
                            <CCol md={2}>
                              <CFormLabel htmlFor="sqm"> Over All Weight in MTS<REQ /></CFormLabel>
                              <CFormInput
                                size="sm"
                                type="text"
                                onChange={(e) => {
                                  changeRJTableItemForChanges(e, 'oa_weight', index)
                                }}
                                value={RJDataUpdateForChanges(
                                  val.oa_weight,
                                  val.oa_weight_input
                                )}
                                maxLength={6}
                              />
                            </CCol>
                            <CCol md={2}>
                              <CFormLabel htmlFor="sqm"> Empty Weight in MTS<REQ /></CFormLabel>
                              <CFormInput
                                size="sm"
                                type="text"
                                onChange={(e) => {
                                  changeRJTableItemForChanges(e, 'e_weight', index)
                                }}
                                value={RJDataUpdateForChanges(
                                  val.e_weight,
                                  val.e_weight_input
                                )}
                                maxLength={6}
                              />
                            </CCol>
                            <CCol xs={12} md={2}>
                              <CFormLabel htmlFor="openKM">MTS/BAG * RATE<REQ /></CFormLabel>

                              <CFormInput
                                size="sm"
                                type="text"
                                onChange={(e) => {
                                  changeRJTableItemForChanges(e, 'mbr_value', index)
                                }}
                                value={RJDataUpdateForChanges(
                                  val.mbr_value,
                                  val.mbr_value_input
                                )}
                                maxLength={40}
                              />
                                
                            </CCol>
                            <CCol xs={12} md={2}>
                              <CFormLabel htmlFor="openKM">RJ Deduction/Remarks</CFormLabel>

                              <CFormInput
                                size="sm"
                                type="text"
                                onChange={(e) => {
                                  changeRJTableItemForChanges(e, 'remarks', index)
                                }}
                                value={RJDataUpdateForChanges(
                                  val.remarks,
                                  val.remarks_input
                                )}
                                maxLength={50}
                              />
                                
                            </CCol>
                            <CCol xs={12} md={2}>
                              <CFormLabel htmlFor="runKM">FJ Empty KM</CFormLabel>

                              <CFormInput
                                size="sm"
                                id="runKM" 
                                value={FJ_Empty_Km_Finder(4,index)} 
                                readOnly
                              />
                            </CCol>
                            <CCol xs={12} md={2}>
                              <CFormLabel htmlFor="runKM">Loaded Trip KM</CFormLabel>

                              <CFormInput
                                size="sm"
                                id="runKM"
                                value={Loaded_Trip_Km_Finder(4,index)} 
                                readOnly
                              />
                            </CCol>
                            <CCol xs={12} md={2}>
                              <CFormLabel htmlFor="runKM">After Unload Empty KM</CFormLabel>

                              <CFormInput
                                size="sm"
                                id="runKM" 
                                value={After_Unload_Empty_KM_Finder(4,index)} 
                                readOnly
                              />
                            </CCol>
                            <CCol xs={12} md={2}>
                              <CFormLabel htmlFor="totKM">Total Trip KM</CFormLabel>

                              <CFormInput
                                size="sm"
                                id="totKM" 
                                value={Total_Trip_Km_Finder(4,index)} 
                                readOnly
                              />
                            </CCol>
                            
                            <CCol xs={12} md={2}>
                              <CFormLabel htmlFor="runKM">Total Trip Hrs</CFormLabel>

                              <CFormInput
                                size="sm"
                                id="runKM" 
                                value={Find_Difference_Hrs(2,index)} 
                                readOnly
                              />
                            </CCol>
                            <CCol xs={12} md={2}>
                              <CFormLabel htmlFor="runKM">Net Load Weight in MTS</CFormLabel>

                              <CFormInput
                                size="sm"
                                id="runKM" 
                                value={Net_Load_Weight_Finder(index)} 
                                readOnly
                              />
                            </CCol>
                            
                            {val.lp_rfj == 1 && (
                              <>
                                <CCol md={2}>
                                  <CFormLabel htmlFor="sqm"> Qty. in MTS</CFormLabel>
                                  <CFormInput
                                    name="sqm"
                                    size="sm" 
                                    id="sqm"
                                    readOnly
                                    value={`${val.qty	 ? val.qty	 : '-'}`}                       
                                  />
                                </CCol> 
                                <CCol xs={12} md={2}>
                                  <CFormLabel htmlFor="matDes">Material Description</CFormLabel>

                                  <CFormInput
                                    size="sm"
                                    id="matDes" 
                                    value={`${val.material_descriptions	? val.material_descriptions : '-'}`}          
                                    readOnly
                                  />
                                </CCol>
                              </>
                            )}

                            {val.lp_rfj == 1 ? ( <></>                                
                              ) :  (
                              <>
                                <CCol xs={12} md={10}></CCol> 
                                <CCol style={{ display: 'flex', justifyContent: 'flex-end' }} xs={12} md={2}>
                                  <CButton
                                    size="s-lg"
                                    color={val.status ? "success": "danger"}
                                    className="mt-3 px-2 text-white" 
                                    onClick={() => { 
                                      removeRjChild(rjsoInfodata,index)
                                    }}
                                  >
                                    Remove
                                  </CButton>
                                </CCol>
                              </>
                            )}
                          </CRow>
                        </>
                    )})}
                    
                    {/* {fgstoChildInsertEnable && tripsheetNumberData && tripsheetNumberData.fgsto_info && tripsheetNumberData.fgsto_info.length > 0 && tripsheetNumberData.fgsto_info.map((val, index) => { */}
                    {fgstoInfoData && fgstoInfoData.length > 0 && fgstoInfoData.map((val, index) => {
                      return (
                        <>
                          <ColoredLine color="blue" />
                          <CRow key={`fgsto_header_data${index}`}>
                            <CCol xs={12} md={3}>
                              <CFormLabel
                                htmlFor="inputAddress"
                                style={{
                                  backgroundColor: '#4d3227',
                                  margin: '4px 0',
                                  color: 'white',
                                }}
                              >
                                FGSTO Information
                              </CFormLabel>
                            </CCol>
                            <CCol md={3}>
                              <CFormSelect 
                                aria-label="Default select example"
                                onChange={(e) => {
                                  changeFGSTOTableItemForChanges(e, 'division', index)
                                }}
                                value={FGSTODataUpdateForChanges(val.division, val.division_input)}
                              >
                                <option value="0">DIVISION</option>
                                <option value="1">NLFD (FOODS)</option>
                                <option value="2">NLCD (CONSUMER)</option> 
                              </CFormSelect>                               
                            </CCol>
                            <CCol md={3}>
                              <CFormSelect 
                                aria-label="Default select example"
                                onChange={(e) => {
                                  changeFGSTOTableItemForChanges(e, 'journey_type', index)
                                }}
                                value={FGSTODataUpdateForChanges(val.journey_type, val.journey_type_input)}
                              >
                                <option value="0">Journey Type</option>
                                <option value="1">FJ</option>
                                <option value="2">RJ</option> 
                              </CFormSelect>                               
                            </CCol>
                            <CCol style={{ display: 'flex', justifyContent: 'flex-end' }} xs={12} md={3}>
                              <CButton
                                size="s-lg"
                                color={val.status ? "success": "danger"}
                                className="text-white" 
                                onClick={() => { 
                                  removeFgstoChild(fgstoInfoData,index)
                                }}
                              >
                                Remove
                              </CButton>
                            </CCol>
                            
                          </CRow>
                          
                          <CRow className="mb-md-1" key={`fgsto_body_data${index}`}>
                            <CCol md={2}>
                              <CFormLabel htmlFor="sno"> STO Invoice Number<REQ /></CFormLabel>
                              <CFormInput
                                size="sm"
                                type="text"
                                onChange={(e) => {
                                  changeFGSTOTableItemForChanges(e, 'document_no', index)
                                }}
                                value={FGSTODataUpdateForChanges(
                                  val.document_no,
                                  val.document_no_input
                                )}
                                maxLength={10}
                              />
                            </CCol>
                            <CCol md={2}>
                              <CFormLabel htmlFor="sqm"> Qty. in MTS<REQ /></CFormLabel>
                              <CFormInput
                                size="sm"
                                type="text"
                                onChange={(e) => {
                                  changeFGSTOTableItemForChanges(e, 'qty', index)
                                }}
                                value={FGSTODataUpdateForChanges(
                                  val.qty,
                                  val.qty_input
                                )}
                                maxLength={6}
                              />
                            </CCol>
                             
                            <CCol xs={12} md={2}>
                              <CFormLabel htmlFor="openKM">Start Time <REQ /></CFormLabel>

                              <CFormInput
                                size="sm"
                                type="datetime-local"
                                onChange={(e) => {
                                  changeFGSTOTableItemForChanges(e, 'start_time', index)
                                }}
                                value={FGSTODataUpdateForChanges(
                                  val.start_time,
                                  val.start_time_input
                                )}
                                maxLength={6}
                              />
                                
                            </CCol>
                            <CCol xs={12} md={2}>
                              <CFormLabel htmlFor="closeKM">End Time <REQ /></CFormLabel>

                              <CFormInput
                                size="sm"
                                type="datetime-local"
                                onChange={(e) => {
                                  changeFGSTOTableItemForChanges(e, 'end_time', index)
                                }}
                                value={FGSTODataUpdateForChanges(
                                  val.end_time,
                                  val.end_time_input
                                )}
                                maxLength={6}
                              />
                              
                            </CCol>
                            <CCol xs={12} md={2}>
                              <CFormLabel htmlFor="openKM">From Location </CFormLabel>

                              <CFormInput
                                size="sm"
                                type="text"
                                onChange={(e) => {
                                  changeFGSTOTableItemForChanges(e, 'from_empty_place', index)
                                }}
                                value={FGSTODataUpdateForChanges(
                                  val.from_empty_place,
                                  val.from_empty_place_input
                                )}
                                maxLength={20}
                              />
                                
                            </CCol>
                            <CCol xs={12} md={2}>
                              <CFormLabel htmlFor="openKM">Odometer KM1</CFormLabel>

                              <CFormInput
                                size="sm"
                                type="text"
                                onChange={(e) => {
                                  changeFGSTOTableItemForChanges(e, 'from_empty_km', index)
                                }}
                                value={FGSTODataUpdateForChanges(
                                  val.from_empty_km,
                                  val.from_empty_km_input
                                )}
                                maxLength={6}
                              />
                                
                            </CCol>
                            <CCol xs={12} md={2}>
                              <CFormLabel htmlFor="openKM">Loaded Location<REQ /></CFormLabel>

                              <CFormInput
                                size="sm"
                                type="text"
                                onChange={(e) => {
                                  changeFGSTOTableItemForChanges(e, 'from_place', index)
                                }}
                                value={FGSTODataUpdateForChanges(
                                  val.from_place,
                                  val.from_place_input
                                )}
                                maxLength={20}
                              />
                                
                            </CCol>
                            
                            <CCol xs={12} md={2}>
                              <CFormLabel htmlFor="openKM">Odometer KM2<REQ /></CFormLabel>

                              <CFormInput
                                size="sm"
                                type="text"
                                onChange={(e) => {
                                  changeFGSTOTableItemForChanges(e, 'opening_km', index)
                                }}
                                value={FGSTODataUpdateForChanges(
                                  val.opening_km,
                                  val.opening_km_input
                                )}
                                maxLength={6}
                              />
                                
                            </CCol>
                            <CCol xs={12} md={2}>
                              <CFormLabel htmlFor="closeKM">Unloaded Location<REQ /></CFormLabel>

                              <CFormInput
                                size="sm"
                                type="text"
                                onChange={(e) => {
                                  changeFGSTOTableItemForChanges(e, 'to_place', index)
                                }}
                                value={FGSTODataUpdateForChanges(
                                  val.to_place,
                                  val.to_place_input
                                )}
                                maxLength={20}
                              />
                              
                            </CCol> 
                            <CCol xs={12} md={2}>
                              <CFormLabel htmlFor="closeKM">Odometer KM3<REQ /></CFormLabel>

                              <CFormInput
                                size="sm"
                                type="text"
                                onChange={(e) => {
                                  changeFGSTOTableItemForChanges(e, 'closing_km', index)
                                }}
                                value={FGSTODataUpdateForChanges(
                                  val.closing_km,
                                  val.closing_km_input
                                )}
                                maxLength={6}
                              />
                              
                            </CCol>
                            <CCol xs={12} md={2}>
                              <CFormLabel htmlFor="openKM">To Location Empty Run</CFormLabel>

                              <CFormInput
                                size="sm"
                                type="text"
                                onChange={(e) => {
                                  changeFGSTOTableItemForChanges(e, 'to_empty_place', index)
                                }}
                                value={FGSTODataUpdateForChanges(
                                  val.to_empty_place,
                                  val.to_empty_place_input
                                )}
                                maxLength={20}
                              />
                                
                            </CCol>
                            <CCol xs={12} md={2}>
                              <CFormLabel htmlFor="openKM">Odometer KM4</CFormLabel>

                              <CFormInput
                                size="sm"
                                type="text"
                                onChange={(e) => {
                                  changeFGSTOTableItemForChanges(e, 'to_empty_km', index)
                                }}
                                value={FGSTODataUpdateForChanges(
                                  val.to_empty_km,
                                  val.to_empty_km_input
                                )}
                                maxLength={6}
                              />
                                
                            </CCol>                            
                            
                            <CCol xs={12} md={2}>
                              <CFormLabel htmlFor="runKM">FJ Empty KM</CFormLabel>

                              <CFormInput
                                size="sm"
                                id="runKM" 
                                value={FJ_Empty_Km_Finder(2,index)} 
                                readOnly
                              />
                            </CCol>
                            <CCol xs={12} md={2}>
                              <CFormLabel htmlFor="runKM">Loaded Trip KM</CFormLabel>

                              <CFormInput
                                size="sm"
                                id="runKM"
                                value={Loaded_Trip_Km_Finder(2,index)} 
                                readOnly
                              />
                            </CCol>
                            <CCol xs={12} md={2}>
                              <CFormLabel htmlFor="runKM">After Unload Empty KM</CFormLabel>

                              <CFormInput
                                size="sm"
                                id="runKM" 
                                value={After_Unload_Empty_KM_Finder(2,index)} 
                                readOnly
                              />
                            </CCol>
                            <CCol xs={12} md={2}>
                              <CFormLabel htmlFor="totKM">Total Trip KM</CFormLabel>

                              <CFormInput
                                size="sm"
                                id="totKM" 
                                value={Total_Trip_Km_Finder(2,index)} 
                                readOnly
                              />
                            </CCol>
                            <CCol xs={12} md={2}>
                              <CFormLabel htmlFor="runKM">Total Trip Hrs</CFormLabel>

                              <CFormInput
                                size="sm"
                                id="runKM" 
                                value={Find_Difference_Hrs(3,index)} 
                                maxLength={6} 
                                readOnly
                              />
                            </CCol>
                            <CCol xs={12} md={2}>
                              <CFormLabel htmlFor="openKM">Remarks</CFormLabel>

                              <CFormInput
                                size="sm"
                                type="text"
                                onChange={(e) => {
                                  changeFGSTOTableItemForChanges(e, 'remarks', index)
                                }}
                                value={FGSTODataUpdateForChanges(
                                  val.remarks,
                                  val.remarks_input
                                )}
                                maxLength={50}
                              />
                                
                            </CCol>
                            {/* <CCol xs={12} md={2}>
                              <CFormLabel htmlFor="runKM">Total Time</CFormLabel>

                              <CFormInput
                                size="sm"
                                id="runKM" 
                                value={Find_Difference_Hrs(3,index)} 
                                maxLength={6} 
                                readOnly
                              />
                            </CCol>
                            <CCol xs={12} md={2}>
                              <CFormLabel htmlFor="openKM">From Location<REQ /></CFormLabel>

                              <CFormInput
                                size="sm"
                                type="text"
                                onChange={(e) => {
                                  changeFGSTOTableItemForChanges(e, 'from_place', index)
                                }}
                                value={FGSTODataUpdateForChanges(
                                  val.from_place,
                                  val.from_place_input
                                )}
                                maxLength={20}
                              />
                                
                            </CCol>
                            <CCol xs={12} md={2}>
                              <CFormLabel htmlFor="closeKM">To Location<REQ /></CFormLabel>

                              <CFormInput
                                size="sm"
                                type="text"
                                onChange={(e) => {
                                  changeFGSTOTableItemForChanges(e, 'to_place', index)
                                }}
                                value={FGSTODataUpdateForChanges(
                                  val.to_place,
                                  val.to_place_input
                                )}
                                maxLength={20}
                              />
                              
                            </CCol> 
                            <CCol xs={12} md={2}>
                              <CFormLabel htmlFor="openKM">Opening KM <REQ /></CFormLabel>

                              <CFormInput
                                size="sm"
                                type="text"
                                onChange={(e) => {
                                  changeFGSTOTableItemForChanges(e, 'opening_km', index)
                                }}
                                value={FGSTODataUpdateForChanges(
                                  val.opening_km,
                                  val.opening_km_input
                                )}
                                maxLength={6}
                              />
                                
                            </CCol>
                            <CCol xs={12} md={2}>
                              <CFormLabel htmlFor="closeKM">Closing KM <REQ /></CFormLabel>

                              <CFormInput
                                size="sm"
                                type="text"
                                onChange={(e) => {
                                  changeFGSTOTableItemForChanges(e, 'closing_km', index)
                                }}
                                value={FGSTODataUpdateForChanges(
                                  val.closing_km,
                                  val.closing_km_input
                                )}
                                maxLength={6}
                              />
                              
                            </CCol>
                            <CCol xs={12} md={2}>
                              <CFormLabel htmlFor="runKM">Running KM</CFormLabel>

                              <CFormInput
                                size="sm"
                                id="runKM"
                                value={FGSTODataUpdateForChanges(
                                  val.running_km,
                                  val.running_km_input
                                )} 
                                readOnly
                              />
                            </CCol>
                            <CCol xs={12} md={2}>
                              <CFormLabel htmlFor="openKM">Remarks</CFormLabel>

                              <CFormInput
                                size="sm"
                                type="text"
                                onChange={(e) => {
                                  changeFGSTOTableItemForChanges(e, 'remarks', index)
                                }}
                                value={FGSTODataUpdateForChanges(
                                  val.remarks,
                                  val.remarks_input
                                )}
                                maxLength={40}
                              />
                                
                            </CCol> */}
                            
                            
                          </CRow>
                        </>
                    )})}
                    {/* {rmChildInsertEnable && tripsheetNumberData && tripsheetNumberData.rmothers_info && tripsheetNumberData.rmothers_info.length > 0 && tripsheetNumberData.rmothers_info.map((val, index) => { */}
                    {rmothersInfoData && rmothersInfoData.length > 0 && rmothersInfoData.map((val, index) => {
                      return (
                        <>
                          <ColoredLine color="blue" />
                          <CRow key={`rmsto_header_data${index}`}>
                            <CCol xs={12} md={3}>
                              <CFormLabel
                                htmlFor="inputAddress"
                                style={{
                                  backgroundColor: '#4d3227',
                                  margin: '4px 0',
                                  color: 'white',
                                }}
                              >
                                RM/Others Information
                              </CFormLabel>
                            </CCol>
                            <CCol md={3}>
                              <CFormSelect 
                                aria-label="Default select example"
                                onChange={(e) => {
                                  changeRMSTOTableItemForChanges(e, 'journey_type', index)
                                }}
                                value={RMSTODataUpdateForChanges(val.journey_type, val.journey_type_input)}
                              >
                                <option value="0">Journey Type</option>
                                <option value="1">FJ</option>
                                <option value="2">RJ</option> 
                              </CFormSelect>                               
                            </CCol>
                            <CCol md={3}>
                              <CFormSelect 
                                aria-label="Default select example"
                                onChange={(e) => {
                                  changeRMSTOTableItemForChanges(e, 'document_type', index)
                                }}
                                value={RMSTODataUpdateForChanges(val.document_type, val.document_type_input)}
                              >
                                <option value="0">Movement Type</option>
                                <option value="1">RMSTO</option>
                                <option value="2">RAKE</option> 
                                <option value="3">OTHERS</option> 
                                <option value="4">FCI</option> 
                              </CFormSelect>                               
                            </CCol>
                            <CCol md={3}>
                              <CFormSelect 
                                aria-label="Default select example"
                                onChange={(e) => {
                                  changeRMSTOTableItemForChanges(e, 'division', index)
                                }}
                                value={RMSTODataUpdateForChanges(val.division, val.division_input)}
                              >
                                {JavascriptInArrayComponent((val.document_type_input ? val.document_type_input : val.document_type) ,[1,2,4]) && 
                                (
                                  <>
                                    <option value="0">DIVISION</option>
                                    <option value="1">NLFD (FOODS)</option>
                                    <option value="2">MMD</option> 
                                  </>
                                )}

                                {(val.document_type_input ? val.document_type_input : val.document_type) == 0 && 
                                (
                                  <>
                                    <option value="0">DIVISION</option>
                                    </>
                                )}

                                {(val.document_type_input ? val.document_type_input : val.document_type) == 3 && 
                                (
                                  <>
                                    <option value="0">DIVISION</option>
                                    <option value="1">NLFD (FOODS) </option>
                                    <option value="2">MMD</option>                                    
                                    <option value="3">NLDV (DETERGENTS)</option> 
                                    <option value="4">NLMD (MINERALS)</option> 
                                    <option value="5">NLLD (LOGISTICS)</option> 
                                    <option value="6">NLCD (CONSUMER)</option> 
                                    <option value="7">NLIF (IFOODS)</option> 
                                    <option value="8">NLSD (SERVICE)</option> 
                                  </>
                                )}

                                
                              </CFormSelect>                               
                            </CCol>
                            <CCol md={2}> 
                            </CCol>
                          </CRow>
                          
                          <CRow className="mb-md-1" key={`rmo_body_data${index}`}>
                            <CCol md={2}>
                              <CFormLabel htmlFor="sno">Trip Count</CFormLabel>
                              <CFormInput
                                size="sm"
                                type="text"
                                onChange={(e) => {
                                  changeRMSTOTableItemForChanges(e, 'rmo_count', index)
                                }}
                                value={RMSTODataUpdateForChanges(
                                  val.rmo_count,
                                  val.rmo_count_input
                                )}
                                maxLength={3}
                              />
                            </CCol>
                            <CCol md={2}>
                              <CFormLabel htmlFor="sqm"> Qty. in MTS</CFormLabel>
                              <CFormInput
                                size="sm"
                                type="text"
                                onChange={(e) => {
                                  changeRMSTOTableItemForChanges(e, 'qty', index)
                                }}
                                value={RMSTODataUpdateForChanges(
                                  val.qty,
                                  val.qty_input
                                )}
                                maxLength={6}
                              />
                            </CCol>
                             
                            <CCol xs={12} md={2}>
                              <CFormLabel htmlFor="openKM">Start Time <REQ /></CFormLabel>

                              <CFormInput
                                size="sm"
                                type="datetime-local"
                                onChange={(e) => {
                                  changeRMSTOTableItemForChanges(e, 'start_time', index)
                                }}
                                value={RMSTODataUpdateForChanges(
                                  val.start_time,
                                  val.start_time_input
                                )}
                                maxLength={6}
                              />
                                
                            </CCol>
                            <CCol xs={12} md={2}>
                              <CFormLabel htmlFor="closeKM">End Time <REQ /></CFormLabel>

                              <CFormInput
                                size="sm"
                                type="datetime-local"
                                onChange={(e) => {
                                  changeRMSTOTableItemForChanges(e, 'end_time', index)
                                }}
                                value={RMSTODataUpdateForChanges(
                                  val.end_time,
                                  val.end_time_input
                                )}
                                maxLength={6}
                              />
                              
                            </CCol>
                            {/* <CCol xs={12} md={2}>
                              <CFormLabel htmlFor="runKM">Total Time</CFormLabel>

                              <CFormInput
                                size="sm"
                                id="runKM" 
                                value={Find_Difference_Hrs(4,index)} 
                                readOnly
                              />
                            </CCol>
                            <CCol xs={12} md={2}>
                              <CFormLabel htmlFor="openKM">From Location<REQ /></CFormLabel>

                              <CFormInput
                                size="sm"
                                type="text"
                                onChange={(e) => {
                                  changeRMSTOTableItemForChanges(e, 'from_place', index)
                                }}
                                value={RMSTODataUpdateForChanges(
                                  val.from_place,
                                  val.from_place_input
                                )}
                                maxLength={20}
                              />
                                
                            </CCol>
                            <CCol xs={12} md={2}>
                              <CFormLabel htmlFor="closeKM">To Location<REQ /></CFormLabel>

                              <CFormInput
                                size="sm"
                                type="text"
                                onChange={(e) => {
                                  changeRMSTOTableItemForChanges(e, 'to_place', index)
                                }}
                                value={RMSTODataUpdateForChanges(
                                  val.to_place,
                                  val.to_place_input
                                )}
                                maxLength={20}
                              />
                              
                            </CCol>
                            
                            <CCol xs={12} md={2}>
                              <CFormLabel htmlFor="openKM">Opening KM <REQ /></CFormLabel>

                              <CFormInput
                                size="sm"
                                type="text"
                                onChange={(e) => {
                                  changeRMSTOTableItemForChanges(e, 'opening_km', index)
                                }}
                                value={RMSTODataUpdateForChanges(
                                  val.opening_km,
                                  val.opening_km_input
                                )}
                                maxLength={6}
                              />
                                
                            </CCol>
                            <CCol xs={12} md={2}>
                              <CFormLabel htmlFor="closeKM">Closing KM <REQ /></CFormLabel>

                              <CFormInput
                                size="sm"
                                type="text"
                                onChange={(e) => {
                                  changeRMSTOTableItemForChanges(e, 'closing_km', index)
                                }}
                                value={RMSTODataUpdateForChanges(
                                  val.closing_km,
                                  val.closing_km_input
                                )}
                                maxLength={6}
                              />
                              
                            </CCol>
                            <CCol xs={12} md={2}>
                              <CFormLabel htmlFor="runKM">Running KM</CFormLabel>

                              <CFormInput
                                size="sm"
                                id="runKM"
                                value={RMSTODataUpdateForChanges(
                                  val.running_km,
                                  val.running_km_input
                                )} 
                                readOnly
                              />
                            </CCol>
                            <CCol xs={12} md={2}>
                              <CFormLabel htmlFor="openKM">Remarks </CFormLabel>

                              <CFormInput
                                size="sm"
                                type="text"
                                onChange={(e) => {
                                  changeRMSTOTableItemForChanges(e, 'remarks', index)
                                }}
                                value={RMSTODataUpdateForChanges(
                                  val.remarks,
                                  val.remarks_input
                                )}
                                maxLength={40}
                              />
                                
                            </CCol> */}
                            <CCol xs={12} md={2}>
                              <CFormLabel htmlFor="openKM">From Location </CFormLabel>

                              <CFormInput
                                size="sm"
                                type="text"
                                onChange={(e) => {
                                  changeRMSTOTableItemForChanges(e, 'from_empty_place', index)
                                }}
                                value={RMSTODataUpdateForChanges(
                                  val.from_empty_place,
                                  val.from_empty_place_input
                                )}
                                maxLength={20}
                              />
                                
                            </CCol>
                            <CCol xs={12} md={2}>
                              <CFormLabel htmlFor="openKM">Odometer KM1</CFormLabel>

                              <CFormInput
                                size="sm"
                                type="text"
                                onChange={(e) => {
                                  changeRMSTOTableItemForChanges(e, 'from_empty_km', index)
                                }}
                                value={RMSTODataUpdateForChanges(
                                  val.from_empty_km,
                                  val.from_empty_km_input
                                )}
                                maxLength={6}
                              />
                                
                            </CCol>
                            <CCol xs={12} md={2}>
                              <CFormLabel htmlFor="openKM">Loaded Location<REQ /></CFormLabel>

                              <CFormInput
                                size="sm"
                                type="text"
                                onChange={(e) => {
                                  changeRMSTOTableItemForChanges(e, 'from_place', index)
                                }}
                                value={RMSTODataUpdateForChanges(
                                  val.from_place,
                                  val.from_place_input
                                )}
                                maxLength={20}
                              />
                                
                            </CCol>
                            <CCol xs={12} md={2}>
                              <CFormLabel htmlFor="openKM">Odometer KM2<REQ /></CFormLabel>

                              <CFormInput
                                size="sm"
                                type="text"
                                onChange={(e) => {
                                  changeRMSTOTableItemForChanges(e, 'opening_km', index)
                                }}
                                value={RMSTODataUpdateForChanges(
                                  val.opening_km,
                                  val.opening_km_input
                                )}
                                maxLength={6}
                              />
                                
                            </CCol>
                            <CCol xs={12} md={2}>
                              <CFormLabel htmlFor="closeKM">Unloaded Location<REQ /></CFormLabel>

                              <CFormInput
                                size="sm"
                                type="text"
                                onChange={(e) => {
                                  changeRMSTOTableItemForChanges(e, 'to_place', index)
                                }}
                                value={RMSTODataUpdateForChanges(
                                  val.to_place,
                                  val.to_place_input
                                )}
                                maxLength={20}
                              />
                              
                            </CCol>
                            
                            
                            <CCol xs={12} md={2}>
                              <CFormLabel htmlFor="closeKM">Odometer KM3<REQ /></CFormLabel>

                              <CFormInput
                                size="sm"
                                type="text"
                                onChange={(e) => {
                                  changeRMSTOTableItemForChanges(e, 'closing_km', index)
                                }}
                                value={RMSTODataUpdateForChanges(
                                  val.closing_km,
                                  val.closing_km_input
                                )}
                                maxLength={6}
                              />
                              
                            </CCol>
                            <CCol xs={12} md={2}>
                              <CFormLabel htmlFor="openKM">To Location Empty Run</CFormLabel>

                              <CFormInput
                                size="sm"
                                type="text"
                                onChange={(e) => {
                                  changeRMSTOTableItemForChanges(e, 'to_empty_place', index)
                                }}
                                value={RMSTODataUpdateForChanges(
                                  val.to_empty_place,
                                  val.to_empty_place_input
                                )}
                                maxLength={20}
                              />
                                
                            </CCol>
                            <CCol xs={12} md={2}>
                              <CFormLabel htmlFor="openKM">Odometer KM4</CFormLabel>

                              <CFormInput
                                size="sm"
                                type="text"
                                onChange={(e) => {
                                  changeRMSTOTableItemForChanges(e, 'to_empty_km', index)
                                }}
                                value={RMSTODataUpdateForChanges(
                                  val.to_empty_km,
                                  val.to_empty_km_input
                                )}
                                maxLength={6}
                              />
                                
                            </CCol>
                            <CCol xs={12} md={2}>
                              <CFormLabel htmlFor="runKM">FJ Empty KM</CFormLabel>

                              <CFormInput
                                size="sm"
                                id="runKM" 
                                value={FJ_Empty_Km_Finder(3,index)} 
                                readOnly
                              />
                            </CCol>
                            <CCol xs={12} md={2}>
                              <CFormLabel htmlFor="runKM">Loaded Trip KM</CFormLabel>

                              <CFormInput
                                size="sm"
                                id="runKM"
                                value={Loaded_Trip_Km_Finder(3,index)} 
                                readOnly
                              />
                            </CCol>
                            <CCol xs={12} md={2}>
                              <CFormLabel htmlFor="runKM">After Unload Empty KM</CFormLabel>

                              <CFormInput
                                size="sm"
                                id="runKM" 
                                value={After_Unload_Empty_KM_Finder(3,index)} 
                                readOnly
                              />
                            </CCol>
                            <CCol xs={12} md={2}>
                              <CFormLabel htmlFor="totKM">Total Trip KM</CFormLabel>

                              <CFormInput
                                size="sm"
                                id="totKM" 
                                value={Total_Trip_Km_Finder(3,index)} 
                                readOnly
                              />
                            </CCol>
                            <CCol xs={12} md={2}>
                              <CFormLabel htmlFor="runKM">Total Trip Hrs</CFormLabel>

                              <CFormInput
                                size="sm"
                                id="runKM" 
                                value={Find_Difference_Hrs(4,index)} 
                                readOnly
                              />
                            </CCol>
                            <CCol xs={12} md={2}>
                              <CFormLabel htmlFor="openKM">Remarks </CFormLabel>

                              <CFormInput
                                size="sm"
                                type="text"
                                onChange={(e) => {
                                  changeRMSTOTableItemForChanges(e, 'remarks', index)
                                }}
                                value={RMSTODataUpdateForChanges(
                                  val.remarks,
                                  val.remarks_input
                                )}
                                maxLength={50}
                              />
                                
                            </CCol>
                            <CCol xs={12} md={10}></CCol> 
                            <CCol style={{ display: 'flex', justifyContent: 'flex-end' }} xs={12} md={2}>
                              <CButton
                                size="s-lg"
                                color={val.status ? "success": "danger"}
                                className="mt-3 px-2 text-white" 
                                onClick={() => { 
                                  removeRMChild(rmothersInfoData,index)
                                }}
                              >
                                Remove
                              </CButton>
                            </CCol>
                            
                          </CRow>
                        </>
                    )})}
                    {ticChild2Data && ticChild2Data.length > 0 && ticChild2Data.map((val, index) => {
                      return (
                        <>
                          <ColoredLine color="blue" />
                          <CRow key={`enroute_di_header_data${index}`}>
                            <CCol xs={12} md={3}>
                              <CFormLabel
                                htmlFor="inputAddress"
                                style={{
                                  backgroundColor: '#4d3227',
                                  margin: '4px 0',
                                  color: 'white',
                                }}
                              >
                                Enroute Diesel Information
                              </CFormLabel>
                            </CCol>                            
                             
                          </CRow>
                          
                          <CRow className="mb-md-1" key={`edi_body_data${index}`}>
                            
                            <CCol md={2}>
                              <CFormLabel htmlFor="sqm"> Diesel Qty. in Litre</CFormLabel>
                              <CFormInput
                                size="sm"
                                type="text"
                                onChange={(e) => {
                                  changeEDITableItemForChanges(e, 'di_enr_qty', index)
                                }}
                                value={EDIDataUpdateForChanges(
                                  val.di_enr_qty,
                                  val.di_enr_qty_input
                                )}
                                maxLength={6}
                              />
                            </CCol> 
                            <CCol md={2}>
                              <CFormLabel htmlFor="sqm"> Rate Per Litre</CFormLabel>
                              <CFormInput
                                size="sm"
                                type="text"
                                onChange={(e) => {
                                  changeEDITableItemForChanges(e, 'di_enr_rpl', index)
                                }}
                                value={EDIDataUpdateForChanges(
                                  val.di_enr_rpl,
                                  val.di_enr_rpl_input
                                )}
                                maxLength={6}
                              />
                            </CCol> 
                            <CCol md={2}>
                              <CFormLabel htmlFor="sno">Total Amount</CFormLabel>
                              <CFormInput
                                size="sm"
                                type="text"
                                readOnly
                                // onChange={(e) => {
                                //   changeEDITableItemForChanges(e, 'di_enr_amount', index)
                                // }}
                                value={EDIDataUpdateForChanges(
                                  val.di_enr_amount,
                                  val.di_enr_amount_input
                                )}
                                maxLength={10}
                              />
                            </CCol>
                            <CCol xs={12} md={2}>
                              <CFormLabel htmlFor="openKM">Bunk Location<REQ /></CFormLabel>

                              <CFormInput
                                size="sm"
                                type="text"
                                onChange={(e) => {
                                  changeEDITableItemForChanges(e, 'bunk_location', index)
                                }}
                                value={EDIDataUpdateForChanges(
                                  val.bunk_location,
                                  val.bunk_location_input
                                )}
                                maxLength={20}
                              />
                                
                            </CCol>
                             
                            <CCol xs={12} md={2}>
                              <CFormLabel htmlFor="openKM">Remarks</CFormLabel>

                              <CFormInput
                                size="sm"
                                type="text"
                                onChange={(e) => {
                                  changeEDITableItemForChanges(e, 'remarks', index)
                                }}
                                value={EDIDataUpdateForChanges(
                                  val.remarks,
                                  val.remarks_input
                                )}
                                maxLength={50}
                              />
                                
                            </CCol>
                            <CCol xs={12} md={2}>
                              <CButton
                                size="s-lg"
                                color={val.status ? "success" : "danger"}
                                className="mt-3 px-2 text-white"
                                // type="submit"
                                onClick={() => {
                                  // setFetch(false)
                                  removeEDIChild(ticChild2Data,index)
                                }}
                              >
                                Remove
                              </CButton>
                            </CCol>
                            
                          </CRow>
                        </>
                    )})}                    
                                         
                    <ColoredLine color="red" />
                    
                    <CRow className="mb-md-1">
                      <CCol>
                        <Link to="/OVTICHome">
                          <CButton size="sm" color="primary" className="text-white" type="button">
                            Previous
                          </CButton>
                        </Link>
                      </CCol> 
                      {tripsheetHaving && (
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
                            onClick={() => { 
                              // OVTIValidate()
                              OVTINewValidate()
                            }}
                          >
                            Submit
                          </CButton>                            
                         
                          <Link to="/OVTICHome">
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

export default OVTICHomeEdit
