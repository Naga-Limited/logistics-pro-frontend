import { CButton, CCard, CContainer } from '@coreui/react'
import { Link } from 'react-router-dom'
import CustomTable from 'src/components/customComponent/CustomTable'
import React, { useEffect, useState } from 'react'
import Loader from 'src/components/Loader'
import TripSheetCreationService from 'src/Service/TripSheetCreation/TripSheetCreationService'
const TripSheetCreationHome = () => {
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
  const [fetch, setFetch] = useState(false)
  let tableData = []

  const loadVehicleReadyToTrip = () => {
    TripSheetCreationService.getVehicleReadyToTrip().then((res) => {
      setFetch(true)
      tableData = res.data.data
      console.log(tableData)
      const filterData1 = tableData.filter(
        (data) => user_locations.indexOf(data.vehicle_location_id) != -1
      )
      // console.log(filterData)

      const filterData = filterData1.filter((item) =>
        item.vehicle_type_id.id == 3
          ? item.document_verification_status == 1
          : item.trip_sto_status == 1
          ? item.vehicle_inspection_status == null
          : item.vehicle_inspection_status != null
      )

      console.log(filterData)

      let rowDataList = []
      filterData.map((data, index) => {
        rowDataList.push({
          sno: index + 1,
          // Tripsheet_No: '',
          Vehicle_Type: data.vehicle_type_id.type,
          Vehicle_No: data.vehicle_number,
          Driver_Name: data.driver_name,
          Waiting_At: (
            <span className="badge rounded-pill bg-info">
              {data.vehicle_current_position == Vehicle_Current_Position.RMSTO_COMPLETED
                ? 'RMSTO Completed'
                : data.vehicle_current_position == Vehicle_Current_Position.FCI_PROCESS_COMPLETED
                ? 'FCI Process Completed'
                : data.vehicle_current_position == Vehicle_Current_Position.OTHERS_PROCESS_COMPLETED
                ? 'Others Process Completed'
                : data.vehicle_current_position ==
                  Vehicle_Current_Position.DOCUMENT_VERIFICATION_COMPLETED
                ? 'Doc. Verification Completed'
                : data.vehicle_current_position ==
                  Vehicle_Current_Position.VEHICLE_INSPECTION_COMPLETED
                ? 'VI Completed'
                : 'Gate Out'}
            </span>
          ),
          Screen_Duration: data.vehicle_current_position_updated_time,
          Overall_Duration: data.created_at,
          Action: (
            <CButton className="badge text-white" color="warning">
              <Link to={`${data.parking_yard_gate_id}`}>Create TripSheet</Link>
            </CButton>
          ),
        })
      })
      setRowData(rowDataList)
    })
  }

  const Vehicle_Current_Position = {
    GATE_IN: 1,
    VEHICLE_INSPECTION_COMPLETED: 2,
    RMSTO_COMPLETED: 6,
    OTHERS_PROCESS_COMPLETED: 7,
    DOCUMENT_VERIFICATION_COMPLETED: 8,
    FCI_PROCESS_COMPLETED: 10,
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
        <CCard className="mt-4">
          <CContainer className="mt-2">
            <CustomTable columns={columns} data={rowData} showSearchFilter={true} />
          </CContainer>
        </CCard>
      )}
    </>
  )
}

export default TripSheetCreationHome
