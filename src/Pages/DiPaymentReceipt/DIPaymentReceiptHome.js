import { CButton, CCard, CContainer } from '@coreui/react'
import { Link } from 'react-router-dom'
import CustomTable from 'src/components/customComponent/CustomTable'
import React, { useEffect, useState } from 'react'
import Loader from 'src/components/Loader'
import DieselIntentCreationService from 'src/Service/DieselIntent/DieselIntentCreationService'

import AccessDeniedComponent from 'src/components/commoncomponent/AccessDeniedComponent'
import JavascriptInArrayComponent from 'src/components/commoncomponent/JavascriptInArrayComponent'
import * as LogisticsProScreenNumberConstants from 'src/components/constants/LogisticsProScreenNumberConstants'
import NLFSDieselIntentService from 'src/Service/NLFS/Master/NLFSDieselIntentService'
import NLFSDivisionApi from 'src/Service/NLFS/Master/NLFSDivisionApi'
import DropdownListApi from 'src/Service/NLFS/Master/DropdownListApi'

const DIPaymentReceiptHome = () => {
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
  const [row1Data, setRow1Data] = useState([])
  const [fetch, setFetch] = useState(false)
  const [divisionData, setDivisionData] = useState([])
  const [plantData, setPlantData] = useState([])
  const [otherDivisionVehicleMasterData, setOtherDivisionVehicleMasterData] = useState([])
  const DieselFor = ['','Vehicle','Barel','Others']

    /* ==================== Access Part Start ========================*/
const [screenAccess, setScreenAccess] = useState(false)
let page_no = LogisticsProScreenNumberConstants.NLFSDieselIntentModule.FS_DIS_Receipt_Creation

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

  const loadNLFSDICreation = () => {
    NLFSDieselIntentService.getNLFSPaymentReceiptGeneration().then((res) => {
      let view_data = res.data.data
      let rowDataList = []
      console.log(view_data,'getVehicleReadyToDIConfirm')
       
      view_data.map((data, index) => {
        rowDataList.push({
          S_No: index + 1,
          Date: data.created_date, 
          Division: data.division_info.short_name, 
          Unique_No: data.dis_no, 
          Request_By: data.creation_user_info.emp_name,
          DI_Count:data.di_count, 
          Fuel_Quantity:data.fuel_quantity, 
          Fuel_Amount:data.fuel_amount, 
          Waiting_At: (
            <span className="badge rounded-pill bg-info">
              {data.status == '1'
                ? 'Vendor Invoice Created'
                : data.status == '3'
                ? 'Vendor Payment Completed'
                : '--'}
            </span>
          ),
          Screen_Duration: data.created_at1,
          Action: ( 
            <CButton className="btn btn-success btn-sm me-md-1">
              <Link className="text-white" to={`/DIPaymentReceiptHome/${data.id}`}>
                <i className="fa fa-eye" aria-hidden="true"></i>
              </Link>
            </CButton>
          ),
        })
      })
      setRow1Data(rowDataList)
    })

  }

  useEffect(() => {
       
    loadNLFSDICreation()

    //section for getting Divisions Data from database
    NLFSDivisionApi.getActiveDivisions().then((response) => {
      let viewData = response.data.data
      console.log(viewData,'getActiveDivisions')
      setDivisionData(viewData)
    })

    /* Fetch Plant For data */
    DropdownListApi.visibleDropdownsListByDropdown(5).then((response) => {
      setFetch(true)
      let needed_data = response.data.data
      console.log(needed_data,'getPlantData')
      setPlantData(needed_data)
    })
  }, [divisionData.length == 0,plantData.length == 0]) 
  
  const vehicleDivisionFinder = (veh) => {
    console.log(divisionData,'divisionData') 
    let vehdiv = '-' 
    divisionData.map((vk,kk)=>{
      if(vk.division_id == veh)
      {
        vehdiv = vk.short_name
      }
    }) 
    return vehdiv 
  }

  const vehiclePlantFinder = (veh) => {
    console.log(plantData,'plantData')
    let plant_name = '-'
    plantData.map((vk,kk)=>{
      if(vk.dropdown_list_id == veh)
      {
        plant_name = vk.short_name
      }
    }) 
    return plant_name
  }

  const columns1 = [
    {
      name: 'S.No',
      selector: (row) => row.S_No,
      sortable: true,
      center: true,
    },
    {
      name: 'Invoice Ref.',
      selector: (row) => row.Unique_No,
      sortable: true,
      center: true,
    },
    {
      name: 'Date',
      selector: (row) => row.Date,
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
      name: 'DI Count',
      selector: (row) => row.DI_Count,
      sortable: true,
      center: true,
    },
    // {
    //   name: 'Fuel Quantity',
    //   selector: (row) => row.Fuel_Quantity,
    //   sortable: true,
    //   center: true,
    // },
    {
      name: 'Total Amount',
      selector: (row) => row.Fuel_Amount,
      sortable: true,
      center: true,
    },
    {
      name: 'Current Status',
      selector: (row) => row.Waiting_At,
      sortable: true,
      center: true,
    },
    {
      name: 'Screen Duration',
      selector: (row) => row.Screen_Duration,
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
        {screenAccess ? (
         <>
          <CCard>
            <CContainer>
              
              <CustomTable
                columns={columns1}
                data={row1Data}
                fieldName={'Driver_Name'}
                showSearchFilter={true}
                // pending={pending}
              />
            </CContainer>
          </CCard>
         </>) : (<AccessDeniedComponent />)}
       </>
      )}
    </>
  )
}

export default DIPaymentReceiptHome
