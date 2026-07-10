import { CButton, CCard, CContainer } from '@coreui/react'
import { Link } from 'react-router-dom'
import CustomTable from 'src/components/customComponent/CustomTable'
import React, { useEffect, useState } from 'react'
import Loader from 'src/components/Loader'
import AccessDeniedComponent from 'src/components/commoncomponent/AccessDeniedComponent'
import JavascriptInArrayComponent from 'src/components/commoncomponent/JavascriptInArrayComponent'
import * as LogisticsProScreenNumberConstants from 'src/components/constants/LogisticsProScreenNumberConstants'
import NlmtDieselIntentCreationService from 'src/Service/Nlmt/DieselIntent/NlmtDieselIntentCreationService'

const NlmtDiApprovalHome = () => {
  /*================== User Location Fetch ======================*/
  const user_info_json = localStorage.getItem('user_info')
  const user_info = JSON.parse(user_info_json)
  const user_locations = []

  /* Get User Locations From Local Storage */
  user_info.location_info.map((data, index) => {
    user_locations.push(data.id)
  })

  // console.log(user_locations)
  /*================== User Location Fetch ======================*/
  const [rowData, setRowData] = useState([])
  const [fetch, setFetch] = useState(false)

    /* ==================== Access Part Start ========================*/
// const [screenAccess, setScreenAccess] = useState(false)
// let page_no = LogisticsProScreenNumberConstants.DieselIntentModule.Diesel_Intent_Approval_Request

// useEffect(()=>{

//   if(user_info.is_admin == 1 || JavascriptInArrayComponent(page_no,user_info.page_permissions)){
//     console.log('screen-access-allowed')
//     setScreenAccess(true)
//   } else{
//     console.log('screen-access-not-allowed')
//     setScreenAccess(false)
//   }

// },[])
/* ==================== Access Part End ========================*/

   /* Vehicle Current Position */
   const Vehicle_Current_Position = {
    TRIP_EXPENSE_CAPTURE: 26,
    TRIP_INCOME_CAPTURE: 27,
    TRIP_INCOME_REJECT: 261,
    TRIP_SETTLEMENT_REJECT: 29,
    DI_CONFIRMATION: 39,
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

  let tableData = []

const loadVehicleReadyToTrip = () => {
  NlmtDieselIntentCreationService.getVehicleReadyToDieselApproval().then((res) => {
    setFetch(true)

    tableData = res.data.data   // ✅ FIXED

    let rowDataList = []

    const filterData1 = tableData.filter(
      (data) => user_locations.indexOf(data.parking_info?.vehicle_location_id) != -1
    )

    filterData1.map((data, index) => {
      rowDataList.push({
        sno: index + 1,
        Tripsheet_No: data.NlmtTripsheetInfo?.nlmt_tripsheet_no,
        Tripsheet_Date: formatDate(data.NlmtTripsheetInfo.created_at),
        Vehicle_Type: data.vehicle_type,
        Vehicle_No: data.NlmtVehicleInfo?.vehicle_number,
        Driver_Name: data.NlmtDriverInfo?.driver_name,
        Waiting_At: (
          <span className="badge rounded-pill bg-info">
            DI Confirmation
          </span>
        ),
        Screen_Duration: data.parking_info?.vehicle_current_position_updated_time,
        Overall_Duration: data.created_at,
        Action: (
          <CButton className="badge text-white" color="warning">
            <Link to={`${data.id}`}>Diesel Indent Approval</Link>
          </CButton>
        ),
      })
    })

    setRowData(rowDataList)
  })
}



function secondsToDhms(date) {

  let t1 = new Date(date);
  let t2 = new Date();

  var unix_seconds = Math.abs(t1.getTime() - t2.getTime()) / 1000;


  var d = Math.floor(unix_seconds / (3600*24));
  var h = Math.floor(unix_seconds % (3600*24) / 3600);
  var m = Math.floor(unix_seconds % 3600 / 60);
  var s = Math.floor(unix_seconds % 60);

  var dDisplay = d > 0 ? d + (d == 1 ? " day " : " days ") : "";
  var hDisplay = h > 0 ? h + (h == 1 ? " hr and " : " hrs and ") : "0 hr and ";
  var mDisplay = m > 0 ? m + (m == 1 ? " min " : " mins ") : "0 mins ";

  return dDisplay + hDisplay + mDisplay;
  }
  function secondsToDhms1(date) {

    let t1 = new Date(date);
    let t2 = new Date();

    var unix_seconds = Math.abs(t1.getTime() - t2.getTime()) / 1000;
      var d = Math.floor(unix_seconds / (3600*24));
      var h = Math.floor(unix_seconds % (3600*24) / 3600);
      var m = Math.floor(unix_seconds % 3600 / 60);
      var s = Math.floor(unix_seconds % 60);

      var dDisplay = d > 0 ? d + (d == 1 ? " day " : " days ") : "";
      var hDisplay = h > 0 ? h + (h == 1 ? " hr and " : " hrs and ") : "0 hr and ";
      var mDisplay = m > 0 ? m + (m == 1 ? " min " : " mins ") : "0 mins";
      // var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
      return dDisplay + hDisplay + mDisplay;
      }
  useEffect(() => {
    loadVehicleReadyToTrip()
  }, [])

  const columns = [
    {
      name: 'S.No',
      selector: (row) => row.sno,
      sortable: true,
      center: true,
    },
    {
      name: 'Tripsheet Number',
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
    {
      name: 'Driver Name',
      selector: (row) => row.Driver_Name,
      sortable: true,
      center: true,
    },
    {
      name: 'Waiting At',
      selector: (row) => row.Waiting_At,
      sortable: true,
      center: true,
    },
    {
      name: 'Screen Duration',
      selector: (row) => secondsToDhms(row.Screen_Duration),
      sortable: true,
      center: true,
    },
    {
      name: ' Overall Duration',
      selector: (row) => secondsToDhms1(row.Overall_Duration),
      sortable: true,
      center: true,
    },
    {
      name: 'Action',
      selector: (row) => row.Action,
      center: true,
    },
  ]
  return (
    <>
      {!fetch && <Loader />}
      {fetch && (
       <>

          <CCard className="mt-4">
            <CContainer className="mt-1">
              <CustomTable
                columns={columns}
                data={rowData}
                fieldName={'Diesel_intent_Approval'}
                showSearchFilter={true}
              />
              <hr></hr>
            </CContainer>
          </CCard>

       </>
      )}
    </>
  )
}

export default NlmtDiApprovalHome
