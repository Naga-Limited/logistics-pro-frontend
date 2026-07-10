import { CButton, CCard, CContainer } from '@coreui/react'
import { Link } from 'react-router-dom'
import CustomTable from 'src/components/customComponent/CustomTable'
import React, { useEffect, useState } from 'react'
import Loader from 'src/components/Loader'
import AccessDeniedComponent from 'src/components/commoncomponent/AccessDeniedComponent'
import JavascriptInArrayComponent from 'src/components/commoncomponent/JavascriptInArrayComponent'
import * as LogisticsProScreenNumberConstants from 'src/components/constants/LogisticsProScreenNumberConstants'
import DepoTSCreationService from 'src/Service/Depo/TSCreation/DepoTSCreationService'


const DepoTripsheetCreationHome = () => {
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
  let page_no = LogisticsProScreenNumberConstants.DepoModuleScreens.Depo_Tripsheet_Creation

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
    DepoTSCreationService.getVehicleReadyToTripsheetCreation().then((res) => {

      setFetch(true)
      tableData = res.data.data
      console.log(tableData,'getVehicleReadyToTripsheetCreation')
      const filterData = tableData.filter(
        (data) => user_locations.indexOf(data.vehicle_location_id) != -1
      )

      let rowDataList = []
      filterData.map((data, index) => {
        rowDataList.push({
          sno: index + 1,
          Contractor_Name: data.contractor_info.contractor_name,
          Vehicle_No: data.vehicle_info.vehicle_number,
          Driver_Name: data.driver_info.driver_name,
          Waiting_At: (
            <span className="badge rounded-pill bg-info">
              {data.vehicle_current_position ==
                  Vehicle_Current_Position.VEHICLE_INSPECTION_COMPLETED
                ? 'VI Completed'
                : 'Gate Out'}
            </span>
          ),
          Screen_Duration: data.vehicle_current_position_updated_time,
          Overall_Duration: data.created_at_time,
          Action: (
            <CButton className="badge text-white" color="warning">
              <Link to={`${data.depo_parking_yard_gate_id}`}>Create TripSheet</Link>
            </CButton>
          ),
        })
      })
      setRowData(rowDataList)
    })
  }

  const Vehicle_Current_Position = {
    GATE_IN: 1,
    VEHICLE_INSPECTION_COMPLETED: 2
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
      name: 'Cotractor Name',
      selector: (row) => row.Contractor_Name,
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
                <CContainer className="mt-2">
                  <CustomTable columns={columns} data={rowData} showSearchFilter={true} />
                </CContainer>
              </CCard>
            </>) : (<AccessDeniedComponent />
          )}
        </>
      )}
    </>
  )
}

export default DepoTripsheetCreationHome

