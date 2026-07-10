import React, { useState, useEffect } from 'react'
import {
  CButton,
  CCard,
  CRow,
  CCol,
  CAlert,
  CContainer,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CFormLabel,
  CFormInput,
} from '@coreui/react'
import VehicleAssignmentService from 'src/Service/VehicleAssignment/VehicleAssignmentService'
import { Link, useNavigate } from 'react-router-dom'
import CustomTable from 'src/components/customComponent/CustomTable'
import TripStoService from 'src/Service/TripSTO/TripStoService'
import { ToastContainer, toast } from 'react-toastify'
import Loader from 'src/components/Loader'
import { DateRangePicker } from 'rsuite'
import ReportService from 'src/Service/Report/ReportService'
import ParkingYardGateService from 'src/Service/ParkingYardGate/ParkingYardGateService'
import SearchSelectComponent from 'src/components/commoncomponent/searchSelectComponent'
import TripSheetCreationService from 'src/Service/TripSheetCreation/TripSheetCreationService'
import * as XLSX from 'xlsx';
import FileSaver from 'file-saver'
import AccessDeniedComponent from 'src/components/commoncomponent/AccessDeniedComponent'
import JavascriptInArrayComponent from 'src/components/commoncomponent/JavascriptInArrayComponent'
import * as LogisticsProScreenNumberConstants from 'src/components/constants/LogisticsProScreenNumberConstants'
import { GetDateTimeFormat } from 'src/Pages/Depo/CommonMethods/CommonMethods'
import DivisionApi from 'src/Service/SubMaster/DivisionApi'
import VehicleGroupApi from 'src/Service/SubMaster/VehicleGroupApi'

const TripSheetEditHome = () => {
  const navigation = useNavigate()

  const exportToCSV = () => {
    let dateTimeString = GetDateTimeFormat(1)
    let fileName='Trip_Sheet_Change_Info_Report_'+dateTimeString
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';
    const ws = XLSX.utils.json_to_sheet(rowData);
    const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], {type: fileType});
    FileSaver.saveAs(data, fileName + fileExtension);
  }

  const [rowData, setRowData] = useState([])
  const [searchFilterData, setSearchFilterData] = useState([])

  const [fetch, setFetch] = useState(false)

  const [pending, setPending] = useState(true)


  let tableData = []
  let tableReportData = []


  /* Set Default Date (Today) in a Variable State */
  const [defaultDate, setDefaultDate] = React.useState([
    new Date(getCurrentDate('-')),
    new Date(getCurrentDate('-')),
  ])

  useEffect(() => {
    console.log(defaultDate)
    if (defaultDate) {
      setDefaultDate(defaultDate)
    } else {
    }
  }, [defaultDate])

   /*================== User Location Fetch ======================*/
   const user_info_json = localStorage.getItem('user_info')
   const user_info = JSON.parse(user_info_json)
   var user_locations = []

   /* Get User Locations From Local Storage */
   user_info.location_info.map((data, index) => {
     user_locations.push(data.id)
   })

   /* ==================== Access Part Start ========================*/
   const [screenAccess, setScreenAccess] = useState(false)
   let page_no = LogisticsProScreenNumberConstants.TripSheetModule.TripSheet_Change

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

  const PURPOSE = {
    FG_SALES: 1,
    FG_STO: 2,
    RM_STO: 3,
    OTHERS: 4,
    FCI: 5,
  }

  const [vgData, setVgData] = useState([])

  useEffect(() => {
  
    DivisionApi.getDivision().then((response) => {
      let editData = response.data.data
      setDivisionData(editData)
    })

    VehicleGroupApi.getVehicleGroup().then((response) => {
      let editData1 = response.data.data
      console.log(editData1,'getVehicleGroup')
      setVgData(editData1)      
    })
    
  },[])

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

  const vgNameFinder = (data) => {
    let vg_name = '-'     
    vgData && vgData.map((vv,kk)=>{
      if(data == vv.id){        
        vg_name = vv.vehicle_group        
      }
    })
    return vg_name
  }

  const loadTripShipmentReport = (fresh_type = '') => {

    if (fresh_type !== '1') {
      // console.log(user_locations)
      /*================== User Location Fetch ======================*/

      TripSheetCreationService.getTripsheetVehiclesReport().then((res) => {
        tableReportData = res.data.data
        console.log(tableReportData,'getTripsheetVehiclesReport-tableReportData')
        setFetch(true)
        let rowDataList = []
        let filterData1 = tableReportData
        const filterData = (filterData1).filter(
          (data) =>
            (data.trip_sheet_info.sap_flag != '0' && ((data.trip_settlement_info == null &&  data.trip_sheet_info?.purpose == '1' && data.parking_status != '19' && data.tripsheet_open_status == 1) || (data.trip_settlement_info == null &&  (data.trip_sheet_info?.purpose == '2' || data.trip_sheet_info?.purpose == '3' || data.trip_sheet_info?.purpose == '4' || data.trip_sheet_info?.purpose == '5' || data.trip_sheet_info?.purpose == null))))
        )
        // console.log(filterData)
        filterData.map((data, index) => {
          rowDataList.push({
            sno: index + 1,
            Tripsheet_No: data.trip_sheet_info != null ? data.trip_sheet_info.trip_sheet_no : '-',
            Creation_Date:  data.trip_sheet_info ? formatDate(data.trip_sheet_info.created_at) : '',
            Creation_Month: data.trip_sheet_info ? getDateTime(data.trip_sheet_info.created_at,2): '', 
            Vehicle_Type: data.vehicle_type_id.type,            
            vehicle_Group: data.vehicle_info ? vgNameFinder(data.vehicle_info.vehicle_group_id) : '--',
            Vehicle_No: data.vehicle_number,
            Division: data.trip_sheet_info ? ( data.trip_sheet_info.purpose == PURPOSE.OTHERS ? othersDivisionNameFinder(data.trip_sheet_info) : data.trip_sheet_info.to_divison == 2 ? 'NLCD':'NLFD') : '',
            Purpose: 
              data.trip_sheet_info ? ( data.trip_sheet_info.purpose == PURPOSE.FG_SALES || data.trip_sheet_info.purpose == null
                ? 'FG Sales'
                : data.trip_sheet_info.purpose == PURPOSE.FG_STO
                ? 'FG STO'
                : data.trip_sheet_info.purpose == PURPOSE.RM_STO
                ? 'RM STO'
                : data.trip_sheet_info.purpose == PURPOSE.OTHERS
                ? 'OTHERS'
                : data.trip_sheet_info.purpose == PURPOSE.FCI
                ? 'FCI'
                : ''
              ) : '',
            Driver_Name: data.driver_name,
            Driver_Mobile_Number: data.driver_contact_number,
            // Division: data.trip_sheet_info?.to_divison,
            // Division: data.trip_sheet_info && data.trip_sheet_info.to_divison == 2 ? 'NLCD': (data.trip_sheet_info.purpose == 4 ? '-' :'NLFD'),
            // Purpose: data.trip_sheet_info?.purpose,
            // Purpose: data.trip_sheet_info ? pur_array[data.trip_sheet_info.purpose] : '-',
            Vendor_Code: data.vendor_info && data.vendor_info.vendor_code ? data.vendor_info.vendor_code : '-',
            Vendor_Name: data.vendor_info && data.vendor_info.owner_name ? data.vendor_info.owner_name : '-',
            Vendor_Mobile_No: data.vendor_info && data.vendor_info.owner_number ? data.vendor_info.owner_number : '-', 
            Shed_Name: data.vendor_info && data.vendor_info.shed_info && data.vendor_info.shed_info.shed_name ? data.vendor_info.shed_info.shed_name : '-', 
            Shed_Mobile_No: data.vendor_info && data.vendor_info.shed_info && data.vendor_info.shed_info.shed_owner_phone_1 ? data.vendor_info.shed_info.shed_owner_phone_1 : '-',  
            Remarks: data.remarks,
            // Creation_Time: data.created_date,
            // Creation_Time: data.trip_sheet_info?.created_date,
            Waiting_At: (
              <span className="badge rounded-pill bg-info">
                {data.vehicle_current_position == 16
                  ? 'Trip Sheet'
                  : data.vehicle_current_position == 18
                  ? 'Advance'
                  : data.vehicle_current_position == 20
                  ? 'NLFD Shipment Create'
                  : data.vehicle_current_position == 22
                  ? 'NLFD Shipment Complete'
                  : data.vehicle_current_position == 23
                  ? 'NLCD Shipment Create'
                  : data.vehicle_current_position == 25
                  ? 'NLCD Shipment Complete'
                  : data.vehicle_current_position == 35
                  ? 'RJ SO Complete'
                  : data.vehicle_current_position == 37
                  ? 'DI Creation'
                  : data.vehicle_current_position == 39
                  ? 'DI Confirmation'
                  : data.vehicle_current_position == 41
                  ? 'DI Approval'
                  : 'Gate Out'}
              </span>
            ),

            Action: (
              <CButton className="badge" color="warning">
                <Link className="text-white" to={`${data.tripsheet_sheet_id}`}>TripSheet Edit</Link>
              </CButton>
            ),
          })
        })
        setRowData(rowDataList)
        setPending(false)
      })
    }

  }

  useEffect(() => {
    loadTripShipmentReport()
  }, [vgData])

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
      name: 'Driver Mobile Number',
      selector: (row) => row.Driver_Mobile_Number,
      sortable: true,
      center: true,
    },
    {
      name: 'Division',
      // selector: (row) => row.Division == 1 ? 'NLFD':'NLCD',
      selector: (row) => row.Division,
      sortable: true,
      center: true,
    },
    {
      name: 'Purpose',
      // selector: (row) => row.Purpose == 1 ? 'FG Sale':row.Purpose == 2 ? 'FG STO':'',
      selector: (row) => row.Purpose,
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
      name: 'CURRENT STATUS',
      selector: (row) => row.Waiting_At,
      sortable: true,
      center: true,
    },
    {
      name: 'Action',
      selector: (row) => row.Action,
      center: true,
    },
  ]

  function getCurrentDate(separator = '') {
    let newDate = new Date()
    let date = newDate.getDate()
    let month = newDate.getMonth() + 1
    let year = newDate.getFullYear()

    return `${year}${separator}${month < 10 ? `0${month}` : `${month}`}${separator}${
      date < 10 ? `0${date}` : `${date}`
    }`
  }

  /* ASK Edit Part Start */
  const pur_array = ['','FG-SALES','FG-STO','RMSTO','OTHERS']
  /* ASK Edit Part End */

  return (
    <>
      {!fetch && <Loader />}
      {fetch && (
       <>

        {screenAccess ? (
         <>
          <CCard className="mt-4">
            <CContainer className="m-2">
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
                      }>
                    Export
                    </CButton>
                </CCol>
              </CRow>
              <CustomTable
                columns={columns}
                data={rowData}
                // fieldName={'Driver_Name'}
                showSearchFilter={true}
              />
            </CContainer>
          </CCard>
         </>
	      ) : (<AccessDeniedComponent />)}
   	   </>
      )}
    </>
  )
}

export default TripSheetEditHome
