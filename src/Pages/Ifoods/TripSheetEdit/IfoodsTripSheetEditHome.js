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

import AccessDeniedComponent from 'src/components/commoncomponent/AccessDeniedComponent'
import JavascriptInArrayComponent from 'src/components/commoncomponent/JavascriptInArrayComponent'
import * as LogisticsProScreenNumberConstants from 'src/components/constants/LogisticsProScreenNumberConstants'
import IfoodsTSCreationService from 'src/Service/Ifoods/TSCreation/IfoodsTSCreationService'
import IfoodsGateInService from 'src/Service/Ifoods/GateIn/IfoodsGateInService'

const IfoodsTripSheetEditHome = () => {
  const navigation = useNavigate()


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
   let page_no = LogisticsProScreenNumberConstants.IfoodsModuleScreens.Ifoods_Tripsheet_Edit

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


  const loadTripShipmentReport = () => {

   


      IfoodsGateInService.getParkingYardGateTrucks().then((res) => {
        tableReportData = res.data.data
        console.log(tableReportData)
        setFetch(true)
        let rowDataList = []
        let filterData1 = tableReportData
        const filterData = (filterData1).filter(
          (data) =>
            ((data.trip_settlement_info == null && data.parking_status != '3'))
        )
        // console.log(filterData)
        filterData.map((data, index) => {
          rowDataList.push({
            sno: index + 1,
            Tripsheet_No: data.tripsheet_info[0]?data.tripsheet_info[0].ifoods_tripsheet_no:' - ',
          Vendor_name: data.ifoods_Vendor_info.vendor_name,
          Vehicle_No: data.ifoods_Vehicle_info.vehicle_number,
          Driver_Name: data.driver_name,
          Purpose: data.purpose == 1 ? 'FG-Sales' : 'FG-STO',
           // Vehicle_Type: data.vehicle_type_id.type,
            //Vehicle_No: data.vehicle_number,
            //Driver_Name: data.driver_name,
            //Driver_Mobile_Number: data.driver_contact_number,
            //Division: data.trip_sheet_info?.to_divison,
            //Purpose: data.trip_sheet_info?.purpose,
            //Remarks: data.remarks,
            // Creation_Time: data.created_date,
           // Creation_Time: data.tripsheet_info[0].created_at,
            Waiting_At: (
              <span className="badge rounded-pill bg-info">
                {data.vehicle_current_position == 16
                  ? 'Trip Sheet Created'
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

  useEffect(() => {
    loadTripShipmentReport()
  }, [])

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
      name: 'Vendor Name',
      selector: (row) => row.Vendor_name,
      sortable: true,
      center: true,
    },
    {
      name: 'Trip Purpose',
      selector: (row) => row.Purpose,
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
  
    // {
    //   name: 'Division',
    //   selector: (row) => row.Division == 1 ? 'NLFD':'NLCD',
    //   sortable: true,
    //   center: true,
    // },
    // {
    //   name: 'Purpose',
    //   selector: (row) => row.Purpose == 1 ? 'FG Sale':row.Purpose == 2 ? 'FG STO':'',
    //   sortable: true,
    //   center: true,
    // },
    // {
    //   name: 'Creation Date',
    //   selector: (row) => row.Creation_Time,
    //   sortable: true,
    //   center: true,
    // },
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

  return (
    <>
      {!fetch && <Loader />}
      {fetch && (
       <>

        {screenAccess ? (
         <>
          <CCard className="mt-4">
            <CContainer className="m-2">
              <CustomTable
                columns={columns}
                data={rowData}
                fieldName={'Driver_Name'}
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

export default IfoodsTripSheetEditHome
