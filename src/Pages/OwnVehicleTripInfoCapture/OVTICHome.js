import {
  CButton,
  CCard,
  CContainer,
  CCol,
  CRow,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CCardImage,
  CModalFooter,
  CAlert,
} from '@coreui/react'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import CustomTable from 'src/components/customComponent/CustomTable'
import Loader from 'src/components/Loader' 
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css' 
import DeliveryTrackService from 'src/Service/DeliveryTrack/DeliveryTrackService'
import * as LogisticsProScreenNumberConstants from 'src/components/constants/LogisticsProScreenNumberConstants'
import AccessDeniedComponent from 'src/components/commoncomponent/AccessDeniedComponent'
import JavascriptInArrayComponent from 'src/components/commoncomponent/JavascriptInArrayComponent'
import TripInfoCaptureService from 'src/Service/TripInfoCapture/TripInfoCaptureService'
import ParkingYardGateService from 'src/Service/ParkingYardGate/ParkingYardGateService'
import Swal from 'sweetalert2'
import VehicleGroupService from 'src/Service/SmallMaster/Vehicles/VehicleGroupService'

const OVTICHome = () => {

  /*================== User Id & Location Fetch ======================*/
  const user_info_json = localStorage.getItem('user_info')
  const user_info = JSON.parse(user_info_json)
  const user_locations = []

  /* Get User Locations From Local Storage */
  user_info.location_info.map((data, index) => {
    user_locations.push(data.id)
  })

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

  const [fetch, setFetch] = useState(false)
  const [rowData, setRowData] = useState([])
  const [ticData, setTicData] = useState([])
  const [vehicleGroup, setVehicleGroup] = useState([])
  const [mount, setMount] = useState(1) 
  const [errorModal, setErrorModal] = useState(false)
  const [error, setError] = useState({})
  let viewData

  useEffect(()=>{

    //section for getting vehicle group from database
    VehicleGroupService.getVehicleGroup().then((res) => {
      let veh_group_data = res && res.data ? res.data.data : []
      console.log(veh_group_data,'veh_group_data')
      setVehicleGroup(veh_group_data)
    })

  },[])

  const vehicleGroupName = (code) => {
    let vehicle_group_name = '-'
    vehicleGroup.map((val, key) => {
      if (val.id == code) {
        vehicle_group_name = val.vehicle_group
      }
    })

    console.log(vehicle_group_name,'vehicle_group_name')

    return vehicle_group_name
  }

  const FJ_Empty_Km_Finder = (vv) => {
    let start = Number.isInteger(Number(vv.from_empty_km)) ? Number(vv.from_empty_km) : ''
    let end = Number.isInteger(Number(vv.opening_km)) ? Number(vv.opening_km) : ''
    let ans = end - start 
    console.log(ans,'FJ_Empty_Km_Finder-ans')
    return ans && ans > 0 ? ans : 0   
  }

  const Loaded_Trip_Km_Finder = (vv) => {
    let start = Number.isInteger(Number(vv.opening_km)) ? Number(vv.opening_km) : ''
    let end = Number.isInteger(Number(vv.closing_km)) ? Number(vv.closing_km) : ''
    let ans = end - start 
    console.log(ans,'FJ_Empty_Km_Finder-ans')
    return ans && ans > 0 ? ans : 0   
  }

  const After_Unload_Empty_KM_Finder = (vv) => {
    let start = Number.isInteger(Number(vv.closing_km)) ? Number(vv.closing_km) : ''
    let end = Number.isInteger(Number(vv.to_empty_km)) ? Number(vv.to_empty_km) : ''
    let ans = end - start 
    console.log(ans,'FJ_Empty_Km_Finder-ans')
    return ans && ans > 0 ? ans : 0   
  }

  const val_definer = (val1,val2) => {
    if(val1 || val1 == '' || val1 == 0){
      return val1
    }
    return val2
  } 

  const Net_Load_Weight_Finder = (child_key) =>{

    // console.log(tripsheetNumberData,'Net_Load_Weight_Finder-tripsheetNumberData')
    console.log(child_key,'Net_Load_Weight_Finder-child_key')

    let start = Number(val_definer(rjsoInfodata[child_key][`oa_weight_input`],rjsoInfodata[child_key][`oa_weight`]))
    let end = Number(val_definer(rjsoInfodata[child_key][`e_weight_input`],rjsoInfodata[child_key][`e_weight`]))  
    let ans = start - end
    console.log(ans,'Net_Load_Weight_Finder-ans')
    return ans && ans > 0 ? ans : 0 
    
  }

  const completionValidationPart = (data) => {

    console.log(data,'completionValidationPart')

    let trip_starting_km = Number(data.opening_km)
    let trip_ending_km = Number(data.closing_km)
    let trip_running_km = trip_ending_km - trip_starting_km
    let trip_starting_time = data.trip_sheet_info.created_at	

    let error_status = 0

    /* Condition 1 : Trip Closing KM should be Completed */

    if(data.closing_km == null || data.closing_km == ''){
      toast.warning('Tripsheet yet to be completed..!')
      error_status = 1
    }

    /* Condition 2 : DI Approval should be Completed */

    if(data.di_info == null || data.ti_info && data.ti_info.diesel_status != 3){
      toast.warning('Diesel Approval Process yet to be completed..!')
      error_status = 2
    }

    if(error_status != 1){ 

      let sub_trip_running_km = 0

      let opening_km_exists = 0
      let closing_km_exists = 0
      let before_trip_start_time_exists = 0

      data.tic_child1_info.map((vv,kk)=>{

        
        let ok = Number.isInteger(Number(vv.from_empty_km)) ? Number(vv.from_empty_km) : ''
        console.log(vv,'completionValidationPart-vv') 

        let k_m_1 = FJ_Empty_Km_Finder(vv)
        let k_m_2 = Loaded_Trip_Km_Finder(vv)
        let k_m_3 = After_Unload_Empty_KM_Finder(vv)
        let Tot_km = k_m_1+k_m_2+k_m_3
        console.log(Tot_km,'completionValidationPart-Tot_km')

        sub_trip_running_km = Number(sub_trip_running_km) + Number(Tot_km)
        
        if((ok != '' && data.opening_km == vv.from_empty_km) || (ok == '' && data.opening_km == vv.opening_km)){
          opening_km_exists = 1
        }

        let ck = Number.isInteger(Number(vv.to_empty_km)) ? Number(vv.to_empty_km) : '' 
        if((ck != '' && data.closing_km == vv.to_empty_km) || (ck == '' && data.closing_km == vv.closing_km)){
          closing_km_exists = 1
        }

        // let dift = diffTime(vv.start_time,trip_starting_time) //in seconds

        //new date instance
        const dt_date1 = new Date(vv.start_time);
        const dt_date2 = new Date(trip_starting_time);

        //Get the Timestamp
        const date1_time_stamp = dt_date1.getTime()/1000;
        const date2_time_stamp = dt_date2.getTime()/1000;

        // let difference = Math.abs(date1_time_stamp - date2_time_stamp);
        let difference = date1_time_stamp - date2_time_stamp;
        console.log(difference,'dift difference')

        if(difference < -120){
          before_trip_start_time_exists = 1
        } 

      })

      console.log(trip_running_km,'completionValidationPart-trip_running_km')
      console.log(sub_trip_running_km,'completionValidationPart-sub_trip_running_km')

      /* Condition 3 : Trip Running KM == Addition of every sub trip running km */

      if(trip_running_km != sub_trip_running_km){
        toast.warning('Trip Running KM should be equals to Addition of every sub trip running km.!')
        error_status = 3
      }

      /* Condition 4 : Parent Trip's opening km should be any one child's Opening km  */
      if(opening_km_exists == 0){
        toast.warning(`Any one of the child trip's opening km should be equals to parent trip's opening km..!`)
        error_status = 4
      }

      /* Condition 5 : Parent Trip's closing km should be any one child's closing km  */
      if(closing_km_exists == 0){
        toast.warning(`Any one of the child trip's closing km should be equals to parent trip's closing km..!`)
        error_status = 5
      }

      /* Condition 6 : any one of the Child trip's starting time won't be before Parent Trip's tripsheet creation time. */

      if(before_trip_start_time_exists == 1){
        toast.warning(`Any one of the Child trip's starting time shouldn't be before Parent Trip's tripsheet creation time..!`)
        error_status = 6
      }

    }
 
    /* Condition 7 : any one of the Child trip's ending  time won't be after Parent Trip's tripsheet DI creation time. */

    if(error_status == 0){
      toast.success('Validation completed..!')
      // return false
      completeTICStatus(data)
    }

    console.log(error_status,'error_status')
   
  }

  /* ============== Custom Functions Start ================== */

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

  const kmDifference = (v1,v2) => {
    let ans = 0
    ans = Number(v1) - Number(v2)
    return ans
  }

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

  const DaysFinder = (start_time, end_time) => {
    const time = ovticdiffTime(start_time,end_time);

    let days = 0

    if(time == '-'){
      return 0
    }

    const [hours, minutes, seconds] = time.split(":").map(Number);

    const totalDays = (hours * 3600 + minutes * 60 + seconds) / (24 * 3600);

    console.log(totalDays)
    console.log(totalDays.toFixed(2))
    return totalDays.toFixed(2)
  }

  /* ============== Custom Functions End ================== */

  function diffTime(start, end) {

    let st = new Date(start)
    let et = new Date(end)
    return (et-st)/1000
  }

  function completeTICStatus(data) {
    let data_id = data.id
    console.log(data,'completeTICStatus')

    var TripInfoSeq = []
    // var ChildTripInfo = {}
    // let tic_child_array_length = data.tic_child1_info ? data.tic_child1_info.length : 0

    // let childInfo = data.tic_child1_info ? data.tic_child1_info : []

    // for (var i = 0; i < tic_child_array_length; i++) {

    //   ChildTripInfo.S_no = i+1
    //   ChildTripInfo.Freight_Order = childInfo[i].document_no ? childInfo[i].document_no : ''
    //   ChildTripInfo.Trip_Type = TripTypyeFinder(childInfo[i].child_type,childInfo[i].document_type)
    //   ChildTripInfo.Trip_Category = childInfo[i].journey_type==2 ? 'RJ': 'FJ'
    //   ChildTripInfo.Qty_MT = childInfo[i].qty ? childInfo[i].qty : '' 
    //   ChildTripInfo.Trip_Start_Time = childInfo[i].start_time == '0000-00-00 00:00:00' ? '-' : `${formatDate(childInfo[i].start_time)} ${getDateTime(childInfo[i].start_time,3)}`
    //   ChildTripInfo.Trip_End_Time = childInfo[i].end_time == '0000-00-00 00:00:00' ? '-' : `${formatDate(childInfo[i].end_time)} ${getDateTime(childInfo[i].end_time,3)}`
    //   ChildTripInfo.Trip_Hours = ovticdiffTime(childInfo[i].start_time,childInfo[i].end_time)
    //   ChildTripInfo.Trip_Days = DaysFinder(childInfo[i].start_time,childInfo[i].end_time)
    //   ChildTripInfo.From_Location = childInfo[i].from_empty_place ? childInfo[i].from_empty_place : '-'
    //   ChildTripInfo.Loaded_Location = childInfo[i].from_place ? childInfo[i].from_place : '-'
    //   ChildTripInfo.Unloaded_Location = childInfo[i].to_place ? childInfo[i].to_place : '-'
    //   ChildTripInfo.To_Location_Empty_run = childInfo[i].to_empty_place ? childInfo[i].to_empty_place : '-'
    //   ChildTripInfo.FJ_EMPTY = kmDifference(childInfo[i].opening_km,childInfo[i].from_empty_km)
    //   ChildTripInfo.FJ_KM = childInfo[i].child_type != 2 ? kmDifference(childInfo[i].closing_km,childInfo[i].opening_km) : '-'
    //   ChildTripInfo.RJ_KM = childInfo[i].child_type == 2 ? kmDifference(childInfo[i].closing_km,childInfo[i].opening_km): '-',
    //   ChildTripInfo.RJ_EMPTY = kmDifference(childInfo[i].to_empty_km,childInfo[i].closing_km)
    //   ChildTripInfo.TOT_KM = totalKMFinder(kmDifference(childInfo[i].opening_km,childInfo[i].from_empty_km),kmDifference(childInfo[i].closing_km,childInfo[i].opening_km),0,kmDifference(childInfo[i].to_empty_km,childInfo[i].closing_km)),

    //   TripInfoSeq[i] = ChildTripInfo
    //   ChildTripInfo = {}

    // }

    if(user_info.is_admin){
      console.log('-------------------TripInfoSeq---------------------------')
      console.log(TripInfoSeq)
    }

    /* =================== Request Sent To SAP Part Start ======================= */

    // var SAPApendData_Seq = []
    // var SAPApendData = {}

    // SAPApendData.Tripsheet_No = data.ts_no
    // SAPApendData.Trip_Count = tic_child_array_length
    // SAPApendData.Vehicle_No = data.veh_no
    // SAPApendData.Vehicle_Group = data.vehicle_info ? vehicleGroupName(data.vehicle_info.vehicle_group_id) : ''
    // SAPApendData.Vehicle_Capacity = data.veh_capacity 
    // SAPApendData.En_route_diesel = eDieselFinder(data.tic_child2_info)
    // SAPApendData.Home_Diesel = data.di_status > 1 ? data.di_rns_qty : 0
    // SAPApendData.Total_Diesel = totDieselFinder(data)
    // SAPApendData.Mileage = mileageFinder(data)
    // SAPApendData.trip_info = TripInfoSeq

    // console.log(SAPApendData,'SAPApendData')
    // SAPApendData_Seq.push(SAPApendData)
    // setFetch(false)
    // TripInfoCaptureService.tripInfoPushToSAP(SAPApendData_Seq).then((res) => { 
    //   let sap_response_status = res.data.STATUS
    //   let sap_response_message = res.data.MESSAGE 

    //   console.log(sap_response_status + '/' + sap_response_message)

    //   if (
    //     sap_response_status == '1' &&
    //     res.status == 200 && 
    //     sap_response_message  
    //   ) {

        /* ====== Request Sent To SAP Part End ========== */
    
        TripInfoCaptureService.completeTICInfoById(data_id).then((res) => {
          setFetch(true)
          let ans_data = res.data.data
          // console.log(res)
          console.log(ans_data)
          if (res.status == 200) { 
            Swal.fire({
              title: 'TIC Process Completed Successfully!',
              icon: "success", 
              confirmButtonText: "OK",
            }).then(function () {
              window.location.reload(false)
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
            toast.warning(
              'TIC Process Cannot Be Updated From LP.. Kindly Contact Admin!'
            )
          }
              
        })

      // }
      // else if (
      //   (sap_response_status == '2') &&
      //   res.status == 200 && 
      //   sap_response_message  
      // ) {
      
      //   Swal.fire({
      //     title: sap_response_message,
      //     icon: "warning",
      //     confirmButtonText: "OK",
      //   }).then(function () {
      //     // window.location.reload(false)
      //   })

      // } else {
      //   setFetch(true)
      //   toast.warning('DIS Vendor Invoice Creation Failed in SAP.. Kindly Contact Admin!')
      // }
    // })
    // .catch((errortemp) => {
    //   console.log(errortemp)
    //   setFetch(true)
    //   var object = errortemp.response.data.errors
    //   var output = '' 
    //   setError(output)
    //   setErrorModal(true)
    // })
  }

  function closeTICStatus(data) {
    let data_id = data.id
    console.log(data,'closeTICStatus')
    
    setFetch(false)
    TripInfoCaptureService.closeTICInfoById(data_id).then((res) => {
      setFetch(true)
      toast.success('TIC Process Closed Successfully!')
      setTimeout(() => {
        window.location.reload(false)
      }, 1000)
    })
  }

  function uncloseTICStatus(data) {
    let data_id = data.id
    console.log(data,'uncloseTICStatus')
    
    setFetch(false)
    TripInfoCaptureService.uncloseTICInfoById(data_id).then((res) => {
      setFetch(true)
      toast.success('TIC Process UnClosed Successfully!')
      setTimeout(() => {
        window.location.reload(false)
      }, 1000)
    })
  }

  useEffect(() => {
    if(user_info.is_admin != 1){
      TripInfoCaptureService.getTICData().then((response) => { 
        setFetch(true)
        viewData = response.data.data
        console.log(viewData,'getTICData')
  
        const filterData1 = viewData.filter(
          (data) => user_info.is_admin != 1 ? data.status < 6 : data 
        )
  
        console.log(filterData1)
  
        setTicData(filterData1)
        let rowDataList = []
        filterData1.map((data, index) => {
          rowDataList.push({
            sno: index + 1,
            Creation_Date: data.created_date,           
            Tripsheet_No: data.ts_no,
            Vehicle_No: data.veh_no,
            Vehicle_Group: data.vehicle_info ? vehicleGroupName(data.vehicle_info.vehicle_group_id) : '',
            Driver_Name: data.driver_name, 
            Driver_Number: data.driver_info?.driver_phone_1, 
            Division: divFinder(data.trip_sheet_info), 
            Purpose: tripPurposeFinder(data.ts_purpose), 
            Action: (
              <div className="d-flex justify-content-space-between">
                {user_info.is_admin == 1 ? (
                  <CButton
                    size="sm"
                    color={data.status != 6 ? "success" : 'warning'}
                    shape="rounded"
                    id={data.id}
                    onClick={() => {
                      data.status != 6 ? completionValidationPart(data) : uncloseTICStatus(data) 
                    }} 
                    className="m-1"
                  >
                    {/* Complete */}
                    <i className="fa fa-check" aria-hidden="true"></i>
                  </CButton>
                  ) : ((data.status != 6 ? 
                    (                
                      <CButton
                        size="sm"
                        color="success"
                        shape="rounded"
                        id={data.id}
                        onClick={() => {
                          completionValidationPart(data)
                        }}
                        className="m-1"
                      >
                        {/* Complete */}
                        <i className="fa fa-check" aria-hidden="true"></i>
                      </CButton>
                    ) : 
                    ( 
                      <>
                      </>
                    ))
                  )}
                 
                <Link target='_blank' to={`${data.id}`}>  
                  <CButton
                    size="sm" 
                    color="secondary"
                    shape="rounded"
                    id={data.id}
                    className="m-1"
                  >
                    {/* Edit */}
                    <i className="fa fa-edit" aria-hidden="true"></i>
                  </CButton>
                </Link>
                {user_info.is_admin == 1 ? (
                  <CButton
                    size="sm"
                    color={data.status != 7 ? "danger" : 'warning'}
                    shape="rounded"
                    id={data.id}
                    onClick={() => {
                      data.status != 7 ? closeTICStatus(data) : uncloseTICStatus(data) 
                    }}
                    className="m-1"
                  >
                    {/* Delete */}
                    <i className="fa fa-trash" aria-hidden="true"></i>
                  </CButton>
                ) : ((data.status != 7 ? 
                  (                
                    <CButton
                      size="sm"
                      color="danger"
                      shape="rounded"
                      id={data.id}
                      onClick={() => {
                        closeTICStatus(data)
                      }}
                      className="m-1"
                    >
                      {/* Delete */}
                      <i className="fa fa-trash" aria-hidden="true"></i>
                    </CButton>
                  ) : 
                  ( 
                    <>
                    </>
                  ))
                )}
              </div>
            ),
          })
        })
        setRowData(rowDataList)
      })
    } else{
      TripInfoCaptureService.getTICAdminData().then((response) => { 
        setFetch(true)
        viewData = response.data.data
        console.log(viewData,'getTICAdminData')
  
        const filterData1 = viewData.filter(
          (data) => user_info.is_admin != 1 ? data.status < 6 : data 
        )
  
        console.log(filterData1)
  
        setTicData(filterData1)
        let rowDataList = []
        filterData1.map((data, index) => {
          rowDataList.push({
            sno: index + 1,
            Creation_Date: data.created_date,           
            Tripsheet_No: data.ts_no,
            Vehicle_No: data.veh_no,
            Vehicle_Group: data.vehicle_info ? vehicleGroupName(data.vehicle_info.vehicle_group_id) : '',
            Driver_Name: data.driver_name, 
            Driver_Number: data.driver_info?.driver_phone_1, 
            Division: divFinder(data.trip_sheet_info), 
            Purpose: tripPurposeFinder(data.ts_purpose), 
            Action: (
              <div className="d-flex justify-content-space-between">
                {user_info.is_admin == 1 ? (
                  <CButton
                    size="sm"
                    color={data.status != 6 ? "success" : 'warning'}
                    shape="rounded"
                    id={data.id}
                    onClick={() => {
                      data.status != 6 ? completionValidationPart(data) : uncloseTICStatus(data) 
                    }} 
                    className="m-1"
                  >
                    {/* Complete */}
                    <i className="fa fa-check" aria-hidden="true"></i>
                  </CButton>
                  ) : ((data.status != 6 ? 
                    (                
                      <CButton
                        size="sm"
                        color="success"
                        shape="rounded"
                        id={data.id}
                        onClick={() => {
                          completionValidationPart(data)
                        }}
                        className="m-1"
                      >
                        {/* Complete */}
                        <i className="fa fa-check" aria-hidden="true"></i>
                      </CButton>
                    ) : 
                    ( 
                      <>
                      </>
                    ))
                  )}
                 
                <Link target='_blank' to={`${data.id}`}>  
                  <CButton
                    size="sm" 
                    color="secondary"
                    shape="rounded"
                    id={data.id}
                    className="m-1"
                  >
                    {/* Edit */}
                    <i className="fa fa-edit" aria-hidden="true"></i>
                  </CButton>
                </Link>
                {user_info.is_admin == 1 ? (
                  <CButton
                    size="sm"
                    color={data.status != 7 ? "danger" : 'warning'}
                    shape="rounded"
                    id={data.id}
                    onClick={() => {
                      data.status != 7 ? closeTICStatus(data) : uncloseTICStatus(data) 
                    }}
                    className="m-1"
                  >
                    {/* Delete */}
                    <i className="fa fa-trash" aria-hidden="true"></i>
                  </CButton>
                ) : ((data.status != 7 ? 
                  (                
                    <CButton
                      size="sm"
                      color="danger"
                      shape="rounded"
                      id={data.id}
                      onClick={() => {
                        closeTICStatus(data)
                      }}
                      className="m-1"
                    >
                      {/* Delete */}
                      <i className="fa fa-trash" aria-hidden="true"></i>
                    </CButton>
                  ) : 
                  ( 
                    <>
                    </>
                  ))
                )}
              </div>
            ),
          })
        })
        setRowData(rowDataList)
      })
    }
    
  }, [vehicleGroup.length > 0])

  useEffect(()=>{

    // ParkingYardGateService.fetchVRList(formData).then((res) => {
    //   setSmallFetch(true)
    //   console.log(res,'fetchVRList')
    //   let vrlistData = res.data.data
    //   setVehicleRequestsData(vrlistData)

    // })

  },[])

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
  

  const divFinder = (data) => {
    console.log(data,'divFinder-data')
    if(data.purpose == '4'){
      // // return othersDivisionArray[div]
      // let ans = othersDivisionFinder(data.vehicle_requests)
      // console.log(ans,'ans-othersDivisionFinder')
      // if(ans)
      //   return ans
      // else
        return '-'
    } else if(data.purpose == '5' || data.purpose == '3'){
      return 'NLFD'
    } else if(data.purpose == '1' || data.purpose == '2'){
      let ans = data.to_divison == '2' ? 'NLCD' : 'NLFD'
      return ans
    } else {
      return '-'
    }

  }
  const [vehicleRequestsData, setVehicleRequestsData] = useState([])
  async function othersDivisionFinder () { /* =(vrId) => { */
    let div = 0
    console.log(vrId,'vrId-othersDivisionFinder')
    console.log(vehicleRequestsData,'vehicleRequestsData-othersDivisionFinder') 

    if(vrId != null){

      const formData = new FormData()
      formData.append('vr_string', vrId)

      ParkingYardGateService.fetchVRList(formData).then((res) => {
        
        console.log(res,'fetchVRList')
        let vrlistData = res.data.data 

        vrlistData.map((vh,kh)=>{ 
          if(JavascriptInArrayComponent(vh.vr_id,myArray)){ 
            div = vh.vr_division
          }
        })
        console.log(div,'div1-othersDivisionFinder') 
        console.log(othersDivisionArray[div],'div2-othersDivisionFinder') 
        return othersDivisionArray[div]

      })

    } else {
      return '-'
    }

    let myArray = vrId.split(",")
    console.log(myArray,'myArray-othersDivisionFinder')
    vehicleRequestsData.map((vh,kh)=>{
      // console.log(vh,'vrId-othersDivisionFinder',kh)
      if(JavascriptInArrayComponent(vh.vr_id,myArray)){
      // if(vh.vr_id == vrId){
        div = vh.vr_division
      }
    })
    console.log(div,'div-othersDivisionFinder')
    // console.log(othersDivisionArray[div],'othersDivisionArray[div]-othersDivisionFinder')
    return othersDivisionArray[div]
  }

  // const othersDivisionArray = ['','FOODS','FOODS','DETERGENTS','MINERALS','LOGISTICS','CONSUMER','IFOODS','SERVICE']
  const othersDivisionArray = ['','NLFD','NLFD','NLDV','NLMD','NLLD','NLCD','NLIF','NLSD']

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
      name: 'Tripsheet No.',
      selector: (row) => row.Tripsheet_No,
      sortable: true,
      center: true,
    },
    {
      name: 'Vehicle No.',
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
      name: 'Division',
      selector: (row) => row.Division,
      sortable: true,
      center: true,
    },
    {
      name: 'Purpose',
      selector: (row) => row.Purpose,
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
      name: 'Driver Number',
      selector: (row) => row.Driver_Number,
      sortable: true,
      center: true,
    }, 
    {
      name: 'Action',
      selector: (row) => row.Action,
      center: true,
    },
  ]

  //============ column header data=========

  return (
    <>
      {!fetch && <Loader />}
      {fetch && (
        <>
          {screenAccess ? (
            <>
              <CRow className="mt-1 mb-1">
                <CCol
                  className="offset-md-6"
                  xs={15}
                  sm={15}
                  md={6}
                  style={{ display: 'flex', justifyContent: 'end' }}
                >
                  <Link className="text-white" to="/OVTIMaster">
                    <CButton size="md" color="warning" className="px-3 text-white" type="button">
                      <span className="float-start">
                        <i className="" aria-hidden="true"></i> &nbsp;NEW
                      </span>
                    </CButton>
                  </Link>
                </CCol>
              </CRow>
              <CCard>
                <CContainer>
                  <CustomTable
                    columns={columns}
                    data={rowData}
                    // fieldName={'Driver_Name'}
                    showSearchFilter={true}
                  />
                </CContainer>
              </CCard>
              {/* Error Modal Section Start */}
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
              {/* Error Modal Section End */}
            </>) : (<AccessDeniedComponent />
          )}
        </>
      )}
    </>
  )
}

export default OVTICHome
