import { React, useState, useEffect } from 'react'
import { CButton, CCard, CCol, CContainer, CRow } from '@coreui/react'
import { Link } from 'react-router-dom'
import CustomTable from 'src/components/customComponent/CustomTable'
import VehicleInspectionService from 'src/Service/VehicleInspection/VehicleInspectionService'
import Loader from 'src/components/Loader'
import TripSheetClosureService from 'src/Service/TripSheetClosure/TripSheetClosureService'
import * as XLSX from 'xlsx';
import FileSaver from 'file-saver'
import AccessDeniedComponent from 'src/components/commoncomponent/AccessDeniedComponent'
import JavascriptInArrayComponent from 'src/components/commoncomponent/JavascriptInArrayComponent'
import * as LogisticsProScreenNumberConstants from 'src/components/constants/LogisticsProScreenNumberConstants'
import DivisionApi from 'src/Service/SubMaster/DivisionApi'
import { GetDateTimeFormat } from 'src/Pages/Depo/CommonMethods/CommonMethods'
import NlmtTripSheetClosureService from 'src/Service/Nlmt/TripSheetClosure/NlmtTripSheetClosureService';

const NlmtTSSettlementHome = () => {
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

  /* ==================== Access Part Start ========================*/
  // const [screenAccess, setScreenAccess] = useState(false)
  // let page_no = LogisticsProScreenNumberConstants.TripSettlementScreens.Tripsheet_Settlement_Closure

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

  const [rowData, setRowData] = useState([])
  const [pending, setPending] = useState(true)
  const [fetch, setFetch] = useState(false)
  let tableData = []
  let closureData = []

  const getDateTime = (myDateTime, type=0) => {
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

  const exportToCSV = () => {
    let dateTimeString = GetDateTimeFormat(1)
    let fileName='SettlementClosureScreen_'+dateTimeString
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';
    const ws = XLSX.utils.json_to_sheet(rowData);
    const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], {type: fileType});
    FileSaver.saveAs(data, fileName + fileExtension);
  }

  const ACTION = {
    GATE_IN: 1,
    GATE_OUT: 2,
    WAIT_OUTSIDE: 0,
  }

  /* Vehicle Current Position */
  const VEHICLE_CURRENT_POSITION = {
    TRIPSHEET_EXPENSE_CAPTURE: 26,
    TRIPSHEET_INCOME_CAPTURE_REJECTED: 261,
    TRIPSHEET_INCOME_CAPTURE: 27,
    TRIPSHEET_SETTLEMENT: 28,
    DIESEL_INDENT_CREATION_COMPLETED: 37,
    DIESEL_INDENT_CONFIRMATION_COMPLETED: 39,
    DIESEL_INDENT_APPROVAL_COMPLETED: 41,
    TRIPSHEET_SETTLEMENT_REJECTED: 29,
  }

  /* Vehicle Current Parking Status */
  const VEHICLE_CURRENT_PARKING_STATUS = {
    HIRE_RMSTO_GATEOUT: 9,
    HIRE_FGSTO_NLFD_GATEOUT: 10,
    HIRE_FGSALES_NLCD_GATEOUT: 13,
    HIRE_FGSTO_NLCD_GATEOUT: 14,
    HIRE_FGSALES_NLFD_GATEOUT: 17,
    AFTER_DELIVERY_GATEIN: 19,
  }

  const getLUD = (Data) => {
    let lud_date = ''
    if(Data.vehicle_info.vehicle_type_id == '21'){
      lud_date = Data.trip_settlement_info.sap_expense_date
    }
    return lud_date
  }

  useEffect(() => {

    DivisionApi.getDivision().then((response) => {
      let editData = response.data.data
      setDivisionData(editData)
    })

  },[])

  const [divisionData, setDivisionData] = useState([])
  const othersDivisionArray = ['','NLFD','NLFA','NLDV','NLMD','NLLD','NLCD','NLIF','NLSD']
  const othersDivisionNameFinder = (data) => {
    let ot_div = '-'
    console.log(data,'othersDivisionNameFinder-data')
    console.log(divisionData,'othersDivisionNameFinder-divisionData')
    divisionData && divisionData.map((vv,kk)=>{
      if(data.others_division == vv.id){
        ot_div = othersDivisionArray[vv.id]
      }
    })
    return ot_div
  }

  const PURPOSE = {
    FG_SALES: 1,
    FG_STO: 2,
    RM_STO: 3,
    OTHERS: 4,
    FCI: 5,
  }
   const vehicle_type_find = (veh_type_id) => {
    //console.log(veh_type_id, 'veh_type_id')
    if (veh_type_id == '21') {
      return 'OWN'
    } else if (veh_type_id == '22') {
      return 'HIRE'
    } else if (veh_type_id == '23') {
      return 'PARTY'
    }
  }

  const getClosureVehiclesData = () => {
    NlmtTripSheetClosureService.getVehicleReadyToTripSettlement().then((res) => {
      closureData = res.data.data
      console.log(closureData,'closureData')
      setFetch(true)

      let rowDataList = []
      const filterData1 = closureData.filter(
        (data) =>

          data.trip_settlement_info != null &&
          (data.trip_settlement_info.tripsheet_is_settled == 3 && data.vehicle_info.vehicle_type_id == 21 ||
            data.trip_settlement_info.tripsheet_is_settled == 5 && data.vehicle_info.vehicle_type_id == 21 )
      )

      console.log(filterData1,'filterData1')
      filterData1.map((data, index) => {
        rowDataList.push({
          sno: index + 1,
          Tripsheet_No: data.tripsheet_info.nlmt_tripsheet_no,
          Tripsheet_Date: data.tripsheet_info.created_date,
          Tripsheet_Month: getDateTime(data.tripsheet_info.created_at,2),
          Last_Updation_Date: getLUD(data),
          Vehicle_Type: vehicle_type_find(data.vehicle_info.vehicle_type_id),
          Vehicle_No: data.vehicle_info.vehicle_number,
        //  Division: data.trip_sheet_info.purpose == 4 ? othersDivisionNameFinder(data.trip_sheet_info) : data.trip_sheet_info.to_divison == 2 ? 'NLCD':'NLFD',
          Purpose:'FG-SALES',
          Driver_Name: data.driver_info.driver_name,
          Driver_Mobile_No: data.driver_info.driver_phone_1,

          Waiting_At: (
            <span className="badge rounded-pill bg-info">
              {data.vehicle_current_position == VEHICLE_CURRENT_POSITION.TRIPSHEET_INCOME_CAPTURE
                ? 'INCOME ✔️'
                : data.vehicle_current_position ==
                  VEHICLE_CURRENT_POSITION.TRIPSHEET_SETTLEMENT_REJECTED
                ? 'SETTLEMENT REJECTED'
                : data.vehicle_current_position ==
                    VEHICLE_CURRENT_POSITION.DIESEL_INDENT_CREATION_COMPLETED &&
                  data.parking_status == VEHICLE_CURRENT_PARKING_STATUS.AFTER_DELIVERY_GATEIN
                ? 'DI CREATION ✔️'
                : data.vehicle_current_position ==
                    VEHICLE_CURRENT_POSITION.DIESEL_INDENT_CONFIRMATION_COMPLETED &&
                  data.parking_status == VEHICLE_CURRENT_PARKING_STATUS.AFTER_DELIVERY_GATEIN
                ? 'DI CONFIRMATION ✔️'
                : data.vehicle_current_position ==
                    VEHICLE_CURRENT_POSITION.DIESEL_INDENT_APPROVAL_COMPLETED &&
                  data.parking_status == VEHICLE_CURRENT_PARKING_STATUS.AFTER_DELIVERY_GATEIN
                ? 'DI APPROVAL ✔️'
                : 'Gate Out'}
            </span>
          ),
          Parking_Remarks: data.remarks ? data.remarks : '-',
          Trip_Accounts_Remarks: data.trip_remarks ? data.trip_remarks : '-',
          Screen_Duration: data.vehicle_current_position_updated_time,
          Overall_Duration: data.created_at,
          Action: (
            <CButton className="badge" color="warning">
              {/* <Link className="text-white" to={`/TSClosure`}> */}
              {/* <Link className="text-white" to={`/TSSettlement/${data.parking_yard_gate_id}`}></Link> */}
              <Link className="text-white" to={`/NlmtTripSheetSettleMentNew/${data.nlmt_trip_in_id}`}>
                Settlement
              </Link>
            </CButton>
          ),
        })
      })
      setRowData(rowDataList)
      setPending(false)
    })
  }

  useEffect(() => {
    getClosureVehiclesData()
  }, [divisionData])

  const columns = [
    {
      name: 'S.No',
      selector: (row) => row.sno,
      sortable: true,
      center: true,
    },
    {
      name: 'TripSheet No',
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
      name: 'Current Status',
      selector: (row) => row.Waiting_At,
      // sortable: true,
      center: true,
    },
    {
      name: 'Acc. Remarks',
      selector: (row) => row.Trip_Accounts_Remarks,
      center: true,
      sortable: true,
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
              <CCard className="mt-4">
                <CContainer className="mt-2">
                  <CRow>
                    <CCol
                      className="offset-md-9"
                      xs={12}
                      sm={12}
                      md={3}
                      style={{ display: 'flex', justifyContent: 'end' }}
                    >
                      <CButton
                        size="lg-sm"
                        color="warning"
                        className="mx-3 px-3 text-white"
                        onClick={(e) => {
                          exportToCSV()}
                        }
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
                    // pending={pending}
                  />
                </CContainer>
              </CCard>


   	    </>

      )}
    </>
  )
}

export default NlmtTSSettlementHome
