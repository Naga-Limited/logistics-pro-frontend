import { React, useState, useEffect } from 'react'
import { CButton, CCard, CContainer } from '@coreui/react'
import { Link } from 'react-router-dom'
import CustomTable from 'src/components/customComponent/CustomTable'
import VehicleMaintenanceService from 'src/Service/VehicleMaintenance/VehicleMaintenanceService'
import Loader from 'src/components/Loader'


import AccessDeniedComponent from 'src/components/commoncomponent/AccessDeniedComponent'
import JavascriptInArrayComponent from 'src/components/commoncomponent/JavascriptInArrayComponent'
import * as LogisticsProScreenNumberConstants from 'src/components/constants/LogisticsProScreenNumberConstants'


const VehicleMaintainence = () => {
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
  let page_no = LogisticsProScreenNumberConstants.VehicleMaintenanceModuleScreen.Vehicle_Maintenance_Started

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

  const ACTION = {
    GATE_IN: 1,
    VEHICLE_MAINTENANCE_GATE_OUT: 5,
    VEHICLE_MAINTENANCE_GATE_IN: 6,
  }

  /* Vehicle Current Position Code */
  const Vehicle_Current_Position = {
    GATE_IN: 1,
    VEHICLE_MAINTENANCE_STARTED: 4,
    VEHICLE_MAINTENANCE_ENDED: 5,
  }

  const loadVehicleMaintenanceTable = () => {
    VehicleMaintenanceService.getVehicleReadyToMaintenance().then((res) => {
      tableData = res.data.data
      console.log(tableData)
      let rowDataList = []
      const filterData = tableData.filter(
        (data) => user_locations.indexOf(data.vehicle_location_id) != -1
      )
      // console.log(filterData)

      filterData.map((data, index) => {
        console.log(data.maintenance_status)
        rowDataList.push({
          sno: index + 1,
          Tripsheet_No: '',
          Vehicle_Type: data.vehicle_type_id.type,
          Vehicle_No: data.vehicle_number,
          Driver_Name: data.driver_name,
          Waiting_At: (
            <span className="badge rounded-pill bg-info">
              {data.vehicle_current_position == Vehicle_Current_Position.GATE_IN
                ? 'Gate In'
                : data.vehicle_current_position ==
                    Vehicle_Current_Position.VEHICLE_MAINTENANCE_STARTED &&
                  data.parking_status == ACTION.VEHICLE_MAINTENANCE_GATE_IN
                ? 'Outside VM Started'
                : data.vehicle_current_position ==
                    Vehicle_Current_Position.VEHICLE_MAINTENANCE_STARTED &&
                  data.parking_status != ACTION.VEHICLE_MAINTENANCE_GATE_IN
                ? 'Inside VM Started'
                : data.vehicle_current_position ==
                  Vehicle_Current_Position.VEHICLE_MAINTENANCE_ENDED
                ? 'VM Completed'
                : 'Gate Out'}
            </span>
          ),
          Screen_Duration: data.vehicle_current_position_updated_time,
          Overall_Duration: data.created_at,
          Action: (
            <span>
              {data.vehicle_current_position == Vehicle_Current_Position.GATE_IN ||
              data.vehicle_current_position ==
                Vehicle_Current_Position.VEHICLE_MAINTENANCE_ENDED ? (
                <CButton className="badge" color="warning">
                  <Link
                    className="text-white"
                    to={`vehicleMaintainence/${data.parking_yard_gate_id}`}
                  >
                    Maintenance Start
                  </Link>
                </CButton>
              ) : (
                <CButton className="badge" color="warning">
                  <Link
                    className="text-white"
                    to={`vehicleMaintainenceEnd/${data.vehicle_maintenance.maintenance_id}`}
                  >
                    Maintenance End
                  </Link>
                </CButton>
              )}
            </span>
          ),
        })
      })
      setFetch(true)
      setRowData(rowDataList)
      setPending(false)
    })
  }
  useEffect(() => {
    loadVehicleMaintenanceTable()
  }, [])

  const columns = [
    {
      name: 'S.No',
      selector: (row) => row.sno,
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
                <CContainer className="mt-2">
                  <CustomTable
                    columns={columns}
                    data={rowData}
                    fieldName={'Driver_Name'}
                    showSearchFilter={true}
                    pending={pending}
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

export default VehicleMaintainence
