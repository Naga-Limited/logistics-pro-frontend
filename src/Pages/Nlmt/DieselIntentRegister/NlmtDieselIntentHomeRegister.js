import { CButton, CCard, CContainer } from '@coreui/react'
import { Link } from 'react-router-dom'
import CustomTable from 'src/components/customComponent/CustomTable'
import React, { useEffect, useState } from 'react'
import Loader from 'src/components/Loader'
import DieselIntentCreationService from 'src/Service/DieselIntent/DieselIntentCreationService'

import AccessDeniedComponent from 'src/components/commoncomponent/AccessDeniedComponent'
import JavascriptInArrayComponent from 'src/components/commoncomponent/JavascriptInArrayComponent'
import * as LogisticsProScreenNumberConstants from 'src/components/constants/LogisticsProScreenNumberConstants'

const NlmtDieselIntentHomeRegister = () => {
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
let page_no = LogisticsProScreenNumberConstants.DieselIntentModule.Additional_Diesel_Intent

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
  const [fetch, setFetch] = useState(false)
  let tableData = []

  const loadVehicleReadyToTrip = () => {
    DieselIntentCreationService.getVehicleReadyToDieselRegisterVendor().then((res) => {
      setFetch(true)
      tableData = res.data.data
      console.log(tableData)
      let rowDataList = []
      const filterData1 = tableData.filter(
        (data) => user_locations.indexOf(data.vehicle_location_id) != -1
      )
      // console.log(filterData)
      // const filterData = filterData1.filter(
      //   (data) =>
      //   data.vehicle_current_position != 28
      // )

      filterData1.map((data, index) => {
        rowDataList.push({
          sno: index + 1,
          Tripsheet_No: data.trip_sheet_info?.trip_sheet_no,
          Tripsheet_Date: data.trip_sheet_info.created_date,
          Vehicle_Type: data.vehicle_type_id.type,
          Vehicle_No: data.vehicle_number,
          Driver_Name: data.driver_name,
          Waiting_At: (
            <span className="badge rounded-pill bg-info">DI Approval</span>
          ),
          Screen_Duration: data.vehicle_current_position_updated_time,
          Overall_Duration: data.created_at,
          Action: (
            <CButton className="badge text-white" color="warning">
              <Link to={`${data.parking_yard_gate_id}`}>Diesel Indent Creation</Link>
            </CButton>
          ),
        })
      })
      setRowData(rowDataList)
    })
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
      sortable: true,
      center: true,
    },
    {
      name: 'Screen Duration',
      selector: (row) => row.Screen_Duration,
      center: true,
    },
    {
      name: ' Overall Duration',
      selector: (row) => row.Overall_Duration,
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
          <CCard className="mt-4">
            <CContainer className="mt-1">
              <CustomTable
                columns={columns}
                data={rowData}
                fieldName={'Diesel_intent'}
                showSearchFilter={true}
              />
              <hr></hr>
            </CContainer>
          </CCard>
         </>) : (<AccessDeniedComponent />)}
       </>
      )}
    </>
  )
}

export default NlmtDieselIntentHomeRegister
