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
import { GetDateTimeFormat } from '../Depo/CommonMethods/CommonMethods'

const TSSettlementHome = () => {
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
  const [screenAccess, setScreenAccess] = useState(false)
  let page_no = LogisticsProScreenNumberConstants.TripSettlementScreens.Tripsheet_Settlement_Closure

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
    if(Data.vehicle_type_id.id == '3'){
      lud_date = Data.trip_settlement_info.sap_expense_date
    } else {
      if(Data.vehicle_current_position == '41'){
        lud_date = Data.diesel_intent_info.sap_diesel_date
      } else {
        lud_date = Data.trip_settlement_info.sap_expense_date
      }
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

  const getClosureVehiclesData = () => {
    TripSheetClosureService.getVehicleReadyToTripSettlement().then((res) => {
      closureData = res.data.data
      console.log(closureData)
      setFetch(true)

      let rowDataList = []
      const filterData1 = closureData.filter(
        (data) =>
          user_locations.indexOf(data.vehicle_location_id) != -1 &&
          data.trip_settlement_info != null &&
          (data.trip_settlement_info.tripsheet_is_settled == 3 ||
            data.trip_settlement_info.tripsheet_is_settled == 5)
      )

      console.log(filterData1,'filterData1')
      filterData1.map((data, index) => {
        rowDataList.push({
          sno: index + 1,
          Tripsheet_No: data.trip_sheet_info.trip_sheet_no,
          Tripsheet_Date: data.trip_sheet_info.created_date,
          Tripsheet_Month: getDateTime(data.trip_sheet_info.created_at,2),  
          Last_Updation_Date: getLUD(data),
          Vehicle_Type: data.vehicle_type_id.type,
          Vehicle_No: data.vehicle_number,
          Division: data.trip_sheet_info.purpose == 4 ? othersDivisionNameFinder(data.trip_sheet_info) : data.trip_sheet_info.to_divison == 2 ? 'NLCD':'NLFD', 
          Purpose: (
            data.trip_sheet_info.purpose == PURPOSE.FG_SALES
              ? 'FG SALES'
              : data.trip_sheet_info.purpose == PURPOSE.FG_STO
              ? 'FG STO'
              : data.trip_sheet_info.purpose == PURPOSE.RM_STO
              ? 'RM STO'
              : data.trip_sheet_info.purpose == PURPOSE.OTHERS
              ? 'OTHERS'
              : data.trip_sheet_info.purpose == PURPOSE.FCI
              ? 'FCI'
              :''
          ),
          Driver_Name: data.driver_name,
          Driver_Mobile_No: data.driver_contact_number,
          Vendor_Code: data.vehicle_type_id.id == 3 ? (data.vendor_info ? data.vendor_info.vendor_code : '-') : '-',
          Vendor_Name: data.vehicle_type_id.id == 3 ? (data.vendor_info ? data.vendor_info.owner_name : '-') : '-',          
          Vendor_Mobile_No: data.vehicle_type_id.id == 3 ? (data.vendor_info ? data.vendor_info.owner_number : '-') : '-',
          Vendor_PAN_No: data.vehicle_type_id.id == 3 ? (data.vendor_info ? data.vendor_info.pan_card_number : '-') : '-',
          Vendor_Town: data.vehicle_type_id.id == 3 ? (data.vendor_info ? (data.vendor_info.city ? data.vendor_info.city : '-') : '-') : '-',
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
              <Link className="text-white" to={`/TSSettlement/${data.parking_yard_gate_id}`}>
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
      name: 'Division',
      selector: (row) => row.Division,
      sortable: true,
      center: true,
    },
    {
      name: 'Last Updation',
      selector: (row) => row.Last_Updation_Date,
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

          {screenAccess ? (
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
            </> ) : (<AccessDeniedComponent />
          )}

   	    </>

      )}
    </>
  )
}

export default TSSettlementHome
