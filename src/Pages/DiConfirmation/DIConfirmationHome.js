import { CButton, CCard, CCol, CContainer, CRow } from '@coreui/react'
import { Link } from 'react-router-dom'
import CustomTable from 'src/components/customComponent/CustomTable'
import React, { useEffect, useState } from 'react'
import Loader from 'src/components/Loader'
import * as XLSX from 'xlsx';
import FileSaver from 'file-saver' 
import DieselIntentCreationService from 'src/Service/DieselIntent/DieselIntentCreationService'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import AccessDeniedComponent from 'src/components/commoncomponent/AccessDeniedComponent'
import JavascriptInArrayComponent from 'src/components/commoncomponent/JavascriptInArrayComponent'
import * as LogisticsProScreenNumberConstants from 'src/components/constants/LogisticsProScreenNumberConstants'
import DieselVendorMasterService from 'src/Service/Master/DieselVendorMasterService'
import { GetDateTimeFormat } from '../Depo/CommonMethods/CommonMethods'
import NLFSDieselIntentService from 'src/Service/NLFS/Master/NLFSDieselIntentService';
import NLFSDivisionApi from 'src/Service/NLFS/Master/NLFSDivisionApi';
import DropdownListApi from 'src/Service/NLFS/Master/DropdownListApi';
import NLFSVehicleMasterApi from 'src/Service/NLFS/Master/NLFSVehicleMasterApi';

const DIConfirmationHome = () => {
  /*================== User Location Fetch ======================*/
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
let page_no = LogisticsProScreenNumberConstants.DieselIntentModule.Diesel_Intent_Confirmation_Request

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
    DI_CREATION: 37,

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

  // console.log(user_locations)
  /*================== User Location Fetch ======================*/
  const [rowData, setRowData] = useState([])
  const [row1Data, setRow1Data] = useState([])
  const [fetch, setFetch] = useState(false)
  let tableData = []
  const [divisionData, setDivisionData] = useState([])
  const [plantData, setPlantData] = useState([])
  const [otherDivisionVehicleMasterData, setOtherDivisionVehicleMasterData] = useState([])
  const DieselFor = ['','Vehicle','Barel','Others','Car']

  const loadNLFSDICreation = () => {
    NLFSDieselIntentService.getVehicleReadyToDIConfirm().then((res) => {
      let view_data = res.data.data
      let rowDataList = []
      console.log(view_data,'getVehicleReadyToDIConfirm')
      view_data.map((data, index) => {
        rowDataList.push({
          sno: index + 1,
          DI_No: data.di_no,
          DI_Date: data.created_at, 
          Fuel_For: DieselFor[data.diesel_to], 
          Vehicle_No: (data.diesel_to == 1 || data.diesel_to == 4) ? data.vehicle_no : data.carry_vehicle, 
          Division: vehicleDivisionFinder(data.division_id), 
          Plant: vehiclePlantFinder(data.plant_id), 
          User: data.vehicle_user_name, 
          Waiting_At: <span className="badge rounded-pill bg-info">
            {data.status == 1
                ? 'DI Confirmation'
                : data.status == 2
                ? 'DI Approval'                 
                :'DI Creation'
            }
          </span>, 
          Screen_Duration : data.di_updated_time,
          Action: ( 
            <CButton className="badge text-white" color="warning">
              <Link to={`/OtherDIConfirmation/${data.id}`}>DI Confirmation</Link>
            </CButton> 
          )
        })
      })
      setRow1Data(rowDataList)
    })

  }
  const loadVehicleReadyToTrip = () => {
    DieselIntentCreationService.getVehicleReadyToDieselConfirm().then((res) => {
      setFetch(true)
      console.log(res.data,'diesel confirm data')
      console.log(user_id,'user_id')
      tableData = res.data
      let rowDataList = []
      let filterData1 = []
      if(user_id == 17){
        filterData1 = tableData.filter(
          (data) => user_locations.indexOf(data.vehicle_location_id) != -1 && data.vendor_code == '225831'
        )
      } else 
      {
        filterData1 = tableData.filter(
          (data) => user_locations.indexOf(data.vehicle_location_id) != -1
        )
      }
      // console.log(filterData)
      // const filterData = filterData1.filter((data) => data.diesel_intent_info?.diesel_status == 1 || data.diesel_intent_info?.diesel_status == 3 && data.diesel_intent_info?.diesel_type == 1)
      // console.log(tableData)
      filterData1.map((data, index) => {
        rowDataList.push({
          sno: index + 1,
          Tripsheet_No: data.trip_sheet_no,
          Tripsheet_Date: formatDate(data.created_at),
          Diesel_Bunk: dieselVendorFinder(data.vendor_code),
          Diesel_Bunk_Code: data.vendor_code,
          Vehicle_Type: data.vehicle_type,
          Vehicle_No: data.vehicle_number,
          Driver_Name: data.driver_name,
          Waiting_At: <span className="badge rounded-pill bg-info">
            {data.vehicle_current_position == Vehicle_Current_Position.TRIP_EXPENSE_CAPTURE
                ? 'Expense Capture'
                : data.vehicle_current_position ==
                  Vehicle_Current_Position.TRIP_INCOME_CAPTURE
                ? 'Income Capture'
                : data.vehicle_current_position ==
                  Vehicle_Current_Position.TRIP_INCOME_REJECT
                ? 'Income Reject'
                :Vehicle_Current_Position.DI_CREATION
                ? 'DI Creation'
                :Vehicle_Current_Position.TRIP_SETTLEMENT_REJECT
                ? 'Settlement Reject'
                :'DI Creation'
            }
          </span>,
          Screen_Duration: data.vehicle_current_position_updated_time,
          Overall_Duration: data.created_at,
          Action: (
            <CButton className="badge text-white" color="warning">
              <Link to={`${data.id}`}>DI Confirmation</Link>
            </CButton>
          ),
        })
      })
      setRowData(rowDataList)
    })
  }

  const exportToCSV = () => {
    let dateTimeString = GetDateTimeFormat(1)
    if(rowData.length == 0){
      toast.warning('No Data Found..!')
      return false
    }
    let fileName='Diesel_Confirmation_Screen_Report_'+dateTimeString
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';
    const ws = XLSX.utils.json_to_sheet(rowData);
    const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], {type: fileType});
    FileSaver.saveAs(data, fileName + fileExtension);
  }

  const [dieselVendorsData,setDieselVendorsData] = useState([])

  const dieselVendorFinder = (vendor_code) => {
    let dvname = ''
    console.log(vendor_code,'vendor_code')
    dieselVendorsData.map((vv,kk)=>{
      console.log(kk,'kk')
      console.log(vv,'vv')
      if(vv.vendor_code == vendor_code)
      {
        dvname = vv.diesel_vendor_name
      }
    })
    return dvname
  }

  useEffect(() => {
    loadVehicleReadyToTrip()

    DieselVendorMasterService.getDieselVendors().then((response) => {
      let viewData = response.data.data
      console.log(viewData,'getDieselVendors')
      setDieselVendorsData(viewData)
    })
  }, [dieselVendorsData.length > 0])

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

  const columns = [
    {
      name: 'S.No',
      selector: (row) => row.sno,
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
      name: 'TS Date',
      selector: (row) => row.Tripsheet_Date,
      sortable: true,
      center: true,
    },
    {
      name: 'Diesel Bunk',
      selector: (row) => row.Diesel_Bunk,
      sortable: true,
      center: true,
    },
    {
      name: 'Vehicle Type',
      selector: (row) => row.Vehicle_Type,
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
      name: 'Cur. Status',
      selector: (row) => row.Waiting_At,
      sortable: true,
      center: true,
    },
    {
      name: 'Screen Duration',
      selector: (row) => secondsToDhms(row.Screen_Duration),
      center: true,
      sortable: true,
    },
    // {
    //   name: ' Overall Duration',
    //   selector: (row) => secondsToDhms1(row.Overall_Duration),
    //   center: true,
    //   sortable: true,
    // },
    {
      name: 'Action',
      selector: (row) => row.Action,
      center: true,
    },
  ]

  const columns1 = [
    {
      name: 'S.No',
      selector: (row) => row.sno,
      sortable: true,
      center: true,
    },
    {
      name: 'DI No.',
      selector: (row) => row.DI_No,
      sortable: true,
      center: true,
    },
    {
      name: 'DI Date',
      selector: (row) => row.DI_Date,
      sortable: true,
      center: true,
    },
    {
      name: 'Fuel For',
      selector: (row) => row.Fuel_For,
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
      name: 'Division',
      selector: (row) => row.Division,
      sortable: true,
      center: true,
    },
    {
      name: 'Plant',
      selector: (row) => row.Plant,
      sortable: true,
      center: true,
    },
    {
      name: 'User',
      selector: (row) => row.User,
      sortable: true,
      center: true,
    },
    {
      name: 'Screen Duration',
      selector: (row) => row.Screen_Duration,
      center: true,
      sortable: true,
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
               <CRow>
                  <CCol
                    className="offset-md-6"
                    xs={15}
                    sm={15}
                    md={6}
                    style={{ display: 'flex', justifyContent: 'end' }}
                  >
                     
                    <CButton
                      size="sm"
                      color="success"
                      className="px-3 text-white"
                      onClick={(e) => {
                        exportToCSV()
                      }}
                    >
                      EXPORT
                    </CButton>
                  </CCol>
                </CRow>
              <CustomTable
                columns={columns}
                data={rowData}
                fieldName={'Diesel_intent_Confirmation'}
                showSearchFilter={true}
              />
               
            </CContainer>
          </CCard>
          <CCard>
            <CContainer>
              <h3>Non Tripsheets</h3>
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

export default DIConfirmationHome
