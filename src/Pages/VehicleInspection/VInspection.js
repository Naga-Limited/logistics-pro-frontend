import { React, useState, useEffect } from 'react'
import { CButton, CCard, CContainer } from '@coreui/react'
import { Link } from 'react-router-dom'
import CustomTable from 'src/components/customComponent/CustomTable'
import VehicleInspectionService from 'src/Service/VehicleInspection/VehicleInspectionService'
import Loader from 'src/components/Loader'

const VInspection = () => {
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
  const [pending, setPending] = useState(true)
  const [fetch, setFetch] = useState(false)
  let tableData = []

  const vehicle_type_finder = (v_type_id_data) => {
    let v_type = ''
    console.log(v_type_id_data,'v_type_id_data')
    if(v_type_id_data.vehicle_type_id.id != '4'){
      v_type = v_type_id_data.vehicle_type_id.type
    } else {
      if(v_type_id_data.vehicle_others_type == '2'){
        v_type = 'D2R Vehicle'
      } else {
        v_type = v_type_id_data.vehicle_type_id.type
      }
    }
    return v_type      
  }

  const ACTION = {
    GATE_IN: 1,
    GATE_OUT: 2,
    WAIT_OUTSIDE: 0,
    VEHICLE_MAINTENANCE_ENDED: 5,
  }
  const loadVehicleInspectionTable = () => {
    VehicleInspectionService.getVehicleReadyToInspect().then((res) => {
      setFetch(true)
      tableData = res.data.data
      // console.log(tableData)
      let rowDataList = []
      const filterData = tableData.filter(
        (data) => user_locations.indexOf(data.vehicle_location_id) != -1
      )
      // console.log(filterData)
      filterData.map((data, index) => {
        rowDataList.push({
          sno: index + 1,
          // Tripsheet_No: '',
          Vehicle_Type: vehicle_type_finder(data),
          Vehicle_No: data.vehicle_number,
          Driver_Name: data.driver_name,
          Waiting_At: (
            <span className="badge rounded-pill bg-info">
              {data.vehicle_current_position == ACTION.GATE_IN
                ? 'Gate In'
                : data.vehicle_current_position == ACTION.VEHICLE_MAINTENANCE_ENDED
                ? 'VM Completed'
                : 'Gate Out'}
            </span>
          ),
          Screen_Duration: data.vehicle_current_position_updated_time,
          Overall_Duration: data.created_at,
          Action: (
            <CButton className="badge" color="warning">
              <Link className="text-white" to={`vehicleInspection/${data.parking_yard_gate_id}`}>
                Vehicle Inspection
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
    loadVehicleInspectionTable()
  }, [])

  const columns = [
    {
      name: 'S.No',
      selector: (row) => row.sno,
      sortable: true,
      center: true,
    },
    // {
    //   name: 'TripSheet No',
    //   selector: (row) => row.VA_No,
    //   sortable: true,
    //   center: true,
    // },
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
      sortable: true,
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
            <CustomTable
              columns={columns}
              data={rowData}
              fieldName={'Driver_Name'}
              showSearchFilter={true}
              // pending={pending}
            />
          </CContainer>
        </CCard>
      )}
    </>
  )
}

export default VInspection
