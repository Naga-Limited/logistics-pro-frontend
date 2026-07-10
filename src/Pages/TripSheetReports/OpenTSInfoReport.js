import {
  CButton,
  CCard,
  CCol,  
  CContainer, 
  CFormLabel, 
  CRow,
  CTabContent, 
  CTabPane, 
} from '@coreui/react'
import React,{ useState, useEffect } from 'react'  
import Loader from 'src/components/Loader' 
import FIEntryValidation from 'src/Utils/FIEntry/FIEntryValidation' 
import useForm from 'src/Hooks/useForm'  
import AccessDeniedComponent from 'src/components/commoncomponent/AccessDeniedComponent'
import JavascriptInArrayComponent from 'src/components/commoncomponent/JavascriptInArrayComponent'
import * as LogisticsProScreenNumberConstants from 'src/components/constants/LogisticsProScreenNumberConstants'
import * as XLSX from 'xlsx';
import FileSaver from 'file-saver' 
import CustomTable from 'src/components/customComponent/CustomTable'  
import PygVehicleSearchSelectComponent from '../ParkingYardGate/CommonComponent/PygVehicleSearchSelectComponent'
import ParkingYardGateService from 'src/Service/ParkingYardGate/ParkingYardGateService'
import DivisionApi from 'src/Service/SubMaster/DivisionApi'
import UserLoginMasterService from 'src/Service/Master/UserLoginMasterService'
import DepartmentApi from 'src/Service/SubMaster/DepartmentApi'
import { GetDateTimeFormat } from '../Depo/CommonMethods/CommonMethods'

const OpenTSInfoReport = () => {
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

  // console.log(user_locations)
  /*================== User Location Fetch ======================*/

  /* ==================== Access Part Start ========================*/
  const [screenAccess, setScreenAccess] = useState(true) 
  // let page_no = LogisticsProScreenNumberConstants.TripSheetModule.TripSheet_Accounts_Report

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

  const formValues = {
    pyg_vehicle_info:''
  }

  const [fetch, setFetch] = useState(false)  
  const [pygVehicleNumber, setPygVehicleNumber] = useState('') 
  const [rowData, setRowData] = useState([]) 

  const {
    values,
    errors,
    handleChange, 
    handleChangeMap,
    isTouched,
    setIsTouched,
    setErrors,
    onFocus,
    handleSubmit,
    enableSubmit,
    onBlur,
    handleMultipleChange,
  } = useForm(login, FIEntryValidation, formValues)

  function login() {
    // alert('No Errors CallBack Called')
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
 
  const [pygVehicleData,setPygVehicleData] = useState([])    
   
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

  const closureStatusCheck = (code,type) => {
    let status = 'Not Completed'
    if(type == 1){ /* Expense Closure */
      if(code >= 1){
        status = 'Completed'
      }
    } else if(type == 2){ /* Income Closure */
      if(code >= 3){
        status = 'Completed'
      }
    } else { /* Settlement Closure */
      if(code == 6){
        status = 'Completed'
      } else if(code == 5){
        status = 'Partially Completed'
      }
    }

    return status
  }

  const vehicle_current_position_array =
  [
    "",                                 /*0*/
    "Parking Yard Gate In",             /*1*/
    "Vehicle Inspection Completed",     /*2*/
    "Vehicle Inspection Rejected",      /*3*/
    "Vehicle Maintenance Started",      /*4*/
    "Vehicle Maintenance Ended",        /*5*/
    "RMSTO Vehicle Taken",              /*6*/
    "OTHERS Vehicle Taken",             /*7*/
    "Document Verification Completed",  /*8*/
    "Document Verification Rejected",   /*9*/
    "-","-","-","-","-","-",                  /*10 - 15*/
    "Tripsheet Created",                /*16*/
    "Tripsheet Cancelled",              /*17*/
    "Advance Payment Completed","",     /*18,19*/
    "NLFD Shipment Created",            /*20*/
    "NLFD Shipment Deleted",            /*21*/
    "NLFD Shipment Completed",          /*22*/
    "NLCD Shipment Created",            /*23*/
    "NLCD Shipment Deleted",            /*24*/
    "NLCD Shipment Completed",          /*25*/
    "Expense Closure Completed",        /*26*/  
    "Income Closure Completed",         /*27*/
    "Settlement Closure Completed",     /*28*/    
    "-","-","-","-","-","-",            /*29 - 34*/   
    "RJ Sale Order Created","",         /*35,36*/
    "Diesle Indent Completed","",       /*37*/
    "Diesle Indent Confirmed","",       /*39*/
    "Diesle Indent Approved","",        /*41*/
  ]

  const exportToCSV = () => {
    let dateTimeString = GetDateTimeFormat(1)
    let fileName=pygVehicleNumber+'_Open_TripSheet_Report_'+dateTimeString
    // let fileName='TripSheet'
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';
    const ws = XLSX.utils.json_to_sheet(rowData);
    const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], {type: fileType});
    // debugger
    //console.log(tableData);
    FileSaver.saveAs(data, fileName + fileExtension);
  }

  const ACTION = {
    TRIPSHEET_CREATED: 1,
    TRIPSHEET_ASSIGNED: 3,
    TRIPSHEET_CONFIRMED: 2,
  }

  const SOURCED_BY = {
    LOGISTICS_TEAM: 1,
    WH_TEAM: 2,
    INVENTRY_TEAM: 3,
  }

  const PURPOSE = {
    FG_SALES: 1,
    FG_STO: 2,
    RM_STO: 3,
    OTHERS: 4,
    FCI: 5,
  }

  const SAPFLAG = {
    Stop: 0,
    Start: 1,
    Change: 2,
  }

  const [divisionData, setDivisionData] = useState([])
  const othersDivisionArray = ['','NLFD','NLFA','NLDV','NLMD','NLLD','NLCD','NLIF','NLSD']

  const othersDivisionNameFinder = (data) => {
    let ot_div = '-'
    divisionData && divisionData.map((vv,kk)=>{
      if(data.others_division == vv.id){
        ot_div = othersDivisionArray[vv.id]
      }
    })
    return ot_div
  }

  const othersDepartmentNameFinder = (data) => {
    let ot_dep = '-'
    departmentData && departmentData.map((vv,kk)=>{
      if(data == vv.id){
        ot_dep = vv.department	
      }
    })
    return ot_dep
  }

  const othersDivisionNameFinder1 = (data) => {
    let ot_div = '-'
    divisionData && divisionData.map((vv,kk)=>{
      if(data == vv.id){
        ot_div = vv.division	
      }
    })
    return ot_div
  }

  useEffect(() => {
    
    DivisionApi.getDivision().then((response) => {
      let editData = response.data.data
      setDivisionData(editData)
    })
    
  },[])

  const [userData, setUserData] = useState([]) 
  const [departmentData, setDepartmentData] = useState([])

  useEffect(() => {
    UserLoginMasterService.getUser().then((res) => {
      let user_data = res.data.data
      // console.log(user_data)
      setUserData(user_data)
    })

    /* section for getting Department Data from database */
    DepartmentApi.getDepartment().then((rest) => {
      // setFetch(true)
      let tableData = rest.data.data
      console.log(tableData)
      setDepartmentData(tableData)
    })
  },[])

  const findUser = (id,type='') => {
    let userName = ''
    let userMail = ''

    if(type == 1){
      userData.map((data,index)=>{
        if(data.user_id == id) {
          userMail = data.email
        }
      })

      return userMail
    } else {
      if(id == '1') {
        userName = 'Admin'
      } else {
        userData.map((data,index)=>{
          if(data.user_id == id) {
            userName = data.emp_name
          }
        })
      }
    }
    return userName
  }

  const onChange = (event) => {
    let vehicle_id = event.value
    console.log(vehicle_id)
    if (vehicle_id) {
      values.pyg_vehicle_info = vehicle_id 
      ParkingYardGateService.getOpenTripsheetInfoByVId(vehicle_id).then((res) => { 
        let rowDataList = []
        let tableData123 = res.data ? JSON.parse(res.data) : [] 
        // console.log(tableData123,'getOpenTripsheetInfoByVId')            
        
        tableData123.map((data, index) => {
          rowDataList.push({
            sno: index + 1,
            vehicle_number: data.vehicle_number, 
            trip_sheet_no: data.trip_sheet_no,
            TS_DT: formatDate(data.created_at),
            ts_time: getDateTime(data.created_at,1),
            ts_month: getDateTime(data.created_at,2),  
            created_by: data.emp_name,
            YGI_DATE: formatDate(data.gate_in_date_time),	
            YGI_TIME: getDateTime(data.gate_in_date_time,1),
            YGO_DATE: formatDate(data.gate_out_date_time),		
            YGO_TIME: getDateTime(data.gate_out_date_time,1),
            /*SAP Flag */
            sap_flag: (
              data.sap_flag == SAPFLAG.Stop
                ? 'Stopped'
                : data.sap_flag == SAPFLAG.Start
                ? 'Started'
                : data.sap_flag == SAPFLAG.Change
                ? 'Updated'
                : '-'
            ),        
            tripsheet_status:(
              data.tripsheet_open_status == ACTION.TRIPSHEET_CREATED
                ? 'TS Created'
                : data.tripsheet_open_status == ACTION.TRIPSHEET_ASSIGNED
                ? 'TS Assigned' 
                : data.tripsheet_open_status == ACTION.TRIPSHEET_CONFIRMED && (data.vehicle_current_position == '17' || data.vehicle_current_position == '21' || data.vehicle_current_position == '24')
                ? 'TS Cancelled'
                : data.tripsheet_open_status == ACTION.TRIPSHEET_CONFIRMED
                ? 'TS Closed'
                :'TS Rejected'
            ),
            vehicle_previous_status: vehicle_current_position_array[data.vehicle_current_position],
            Sourcing_Remarks: data.remarks ? data.remarks : '--',
            accounts_remarks: data.trip_remarks ? data.trip_remarks : '--',
            vehicle_number: data.vehicle_number,  
            Vehicle_Type: data.vehicle_type == 'Party Vehicle' ? (data.vehicle_others_type == '2' ? 'D2R Vehicle' : data.vehicle_type) : data.vehicle_type,
            vehicle_Group: data.vehicle_group ? data.vehicle_group : '-',
            VH_Capacity: data.vehicle_capacity,    
            trip_opening_km: data.odometer_km ? data.odometer_km : '-',
            trip_closing_km: data.odometer_closing_km ? data.odometer_closing_km : '-',                        
            DIVISION: data.purpose == PURPOSE.OTHERS ? othersDivisionNameFinder(data) : data.to_divison == 2 ? 'NLCD':'NLFD',
            purpose: (
              data.purpose == PURPOSE.FG_SALES
                ? 'FG Sales'
                : data.purpose == PURPOSE.FG_STO
                ? 'FG STO'
                : data.purpose == PURPOSE.RM_STO
                ? 'RM STO'
                : data.purpose == PURPOSE.OTHERS
                ? 'OTHERS'
                : data.purpose == PURPOSE.FCI
                ? 'FCI'
                :''
            ), 
            Driver_Code: data.driver_code ? data.driver_code : '-',
            driver_name: data.driver_name,
            driver_mobile_no: data.driver_contact_number, 
            Vendor_Code: data.vendor_code ? data.vendor_code : '-',
            Vendor_Name: data.owner_name ? data.owner_name : '-',
            Vendor_Mobile_No: data.owner_number ? data.owner_number : '-',
            Vendor_PAN_No: data.pan_card_number ? data.pan_card_number : '-',
            Vendor_Town: data.city ? data.city : '-',
            Shed_Name: data.shed_name ? data.shed_name : '-',
            Shed_Mobile_No: data.shed_owner_phone_1 ? data.shed_owner_phone_1 : '-',
  
            Diesel_Indent_Dt: formatDate(data.di_created_at), 
            DI_Time: getDateTime(data.di_created_at,1),
            DI_Created_By: findUser(data.di_created_by),
            DI_Filled_Dt_Time: data.diesel_status == 2 ? data.di_updated_at : '-', 
            DI_Approval_Dt_Time: data.diesel_status == 3 ? data.di_updated_at : '-',
            //====================================================================================//
            TS_Stop_call_Given_Dt_Time: data.sap_flag == 0 ? (data.sap_flag_updation_time ? data.sap_flag_updation_time : '-') : '-',
            TS_Stop_call_Given_By: data.sap_flag == 0 ? (data.sap_flag_update_by ? findUser(data.sap_flag_update_by) : '-') : '-', 
            
            Exp_Booked_Status: data.tripsheet_is_settled ? closureStatusCheck(data.tripsheet_is_settled,1) : 'Not Completed',
            Exp_Booked_Dt: data.expense_created_at ? formatDate(data.expense_created_at) : '-',
            Exp_Posting_Dt: data.expense_posting_date ? formatDate(data.expense_posting_date) : '-',
            Settlement_Status: data.tripsheet_is_settled ? closureStatusCheck(data.tripsheet_is_settled,3) : 'Not Completed',
            Settlement_Closure_Dt: data.settled_at ? formatDate(data.settled_at) : '-', 
            Settlement_Posting_Dt: data.income_posting_date ? formatDate(data.income_posting_date) : '-',  
  
            Vehicle_Request_Given_By: data.vr_info ? data.vr_info.request_by : '-',
            Mobile_Number: data.vr_info ? data.vr_info.contact_no : '-',
            Mail_ID: data.vr_info ? findUser(data.vr_info.created_by,1) : '-',	
            VR_Division: data.vr_info ? othersDivisionNameFinder1(data.vr_info.vr_division) : '-',
            VR_Departement: data.vr_info ? othersDepartmentNameFinder(data.vr_info.vr_dept) : '-',          
            Vehicle_Request_No: data.vr_info ? data.vr_info.vr_no : '-',	
            Vehicle_Request_Date: data.vr_info ? data.vr_info.vr_require_time : '-', 
            FROM_LOCATION: data.vr_info ? data.vr_info.vr_from_loc : '-',
            TO_LOCATION: data.vr_info ? data.vr_info.vr_to_loc : '-',
  
            
            expected_date: formatDate(data.expected_date_time),
            expected_return_date: formatDate(data.expected_return_date_time),
            vehicle_sourced_by: (
              data.vehicle_sourced_by == SOURCED_BY.LOGISTICS_TEAM
                ? 'Logistic Team'
                : data.vehicle_sourced_by == SOURCED_BY.INVENTRY_TEAM
                ? 'Inventry Team'
                : data.vehicle_sourced_by == SOURCED_BY.WH_TEAM
                ? 'WH team'
                :'-'
            ),  
          })
          setPygVehicleNumber(data.vehicle_number)
        })
        setRowData(rowDataList) 
      })
    //  console.log(DriverPhoneNumberById)
    } else {
      values.pyg_vehicle_info = ''
      setPygVehicleNumber('') 
    }
  }

  const columns = [
    {
      name: 'S.No',
      selector: (row) => row.sno,
      sortable: true,
      center: true,
    },
    {
      name: 'Tripsheet Number',
      selector: (row) => row.trip_sheet_no,
      sortable: true,
      center: true,
    },
    {
      name: 'Created_at',
      selector: (row) => row.TS_DT,
      sortable: true,
      center: true,
    },
    {
      name: 'TS status',
      selector: (row) => row.tripsheet_status,
      sortable: true,
      center: true,
    },
    {
      name: 'Veh. status',
      selector: (row) => row.vehicle_previous_status,
      sortable: true,
      center: true,
    },
    {
      name: 'Trip Remarks',
      selector: (row) => row.Sourcing_Remarks,
      sortable: true,
      center: true,
    },
    {
      name: 'Acc. Remarks',
      selector: (row) => row.accounts_remarks,
      sortable: true,
      center: true,
    },
    {
      name: 'Vehicle No',
      selector: (row) => row.vehicle_number,
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
      name: 'to divison',
      selector: (row) => row.DIVISION,
      sortable: true,
      center: true,
    },
    {
      name: 'purpose',
      selector: (row) => row.purpose,
      sortable: true,
      center: true,
    },
      /*Table grid View SAP Flag */
      {
      name: 'SAP Flag',
      selector: (row) => row.sap_flag,
      sortable: true,
      center: true,
    },
    // {
    //   name: 'freight rate per tone',
    //   selector: (row) => row.freight_rate_per_tone || '-',
    //   sortable: true,
    //   center: true,
    // },
    // {
    //   name: 'trip advance eligiblity',
    //   selector: (row) => row.trip_advance_eligiblity,
    //   sortable: true,
    //   center: true,
    // },
    // {
    //   name: 'advance amount',
    //   selector: (row) => row.advance_amount||'-',
    //   sortable: true,
    //   center: true,
    // },
    // {
    //   name: 'advance payment bank',
    //   selector: (row) => row.advance_payment_bank||'-',
    //   sortable: true,
    //   center: true,
    // },
    // {
    //   name: 'advance payment diesel',
    //   selector: (row) => row.advance_payment_diesel||'-',
    //   sortable: true,
    //   center: true,
    // },
    // {
    //   name: 'advance otp',
    //   selector: (row) => row.advance_otp,
    //   sortable: true,
    //   center: true,
    // },
    {
      name: 'sourced by',
      selector: (row) => row.vehicle_sourced_by || '-',
      sortable: true,
      center: true,
    },
    {
      name: 'Driver Name',
      selector: (row) => row.driver_name,
      sortable: true,
      center: true,
    },
    {
      name: 'Exp.Delivery Date',
      selector: (row) => row.expected_date,
      sortable: true,
      center: true,
    },
    {
      name: 'Exp.Return Date',
      selector: (row) => row.expected_return_date||'-',
      sortable: true,
      center: true,
    },
    {
      name: 'Created_by',
      selector: (row) => row.created_by,
      sortable: true,
      center: true,
    },
    // {
    //   name: 'Action',
    //   selector: (row) => row.Action,
    //   center: true,
    // }
  ]

  useEffect(() => {

    ParkingYardGateService.getPYGDisticstVehiclesData().then((resd)=>{
      let da = resd.data
      var result = Object.keys(da).map((key) => [da[key]]);
      let test_array = []
      result.map((vi,ki)=>{ 
          test_array[ki] = vi[0]
      })
      setFetch(true)
      console.log(test_array,'getPYGDisticstVehiclesData') 
      setPygVehicleData(test_array)
    }) 

  }, [])

  // ========================================== ASK PART END ========================================== //

  return (
    <>
      {!fetch && <Loader />}
      {fetch && (
        <>
        {(screenAccess) ? (
          <>
          <CCard>
            {/* <CContainer className="mt-2"> */}

            {/* </CContainer> */}
            <CTabContent>   
              <CTabPane role="tabpanel" aria-labelledby="home-tab" visible={true}>
                <>
                  <CRow className="m-2"> 
                    <CCol xs={12} md={3}>
                      <CFormLabel htmlFor="vCap">Vehicle Number</CFormLabel>
                      
                      <PygVehicleSearchSelectComponent
                        size="sm"
                        className="mb-2"
                        name="pyg_vehicle_info"
                        id="pyg_vehicle_info"
                        onFocus={onFocus}
                        onBlur={onBlur} 
                        onChange={(e) => {
                          onChange(e)
                        }} 
                        value={values.pyg_vehicle_info}  
                        label="Select Vehicle Number"
                        noOptionsMessage="Vehicle Not found" 
                        search_type={'pyg_vehicle_info'}
                        search_data={pygVehicleData}
                      />
                    </CCol>
                  </CRow>
                    
                </>
              </CTabPane>
              <CContainer className="mt-1">
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
                  fieldName={'Advance_user'}
                  showSearchFilter={true}
                />
              </CContainer>
            </CTabContent>
          </CCard>
          </>
        ) : (<AccessDeniedComponent />)}
        </>
      )}
    </>
  )
}
export default OpenTSInfoReport

