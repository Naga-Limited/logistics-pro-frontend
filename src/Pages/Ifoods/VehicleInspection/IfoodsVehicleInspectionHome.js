import { React, useState, useEffect } from 'react'
import { CButton, CCard, CContainer } from '@coreui/react'
import { Link } from 'react-router-dom'
import CustomTable from 'src/components/customComponent/CustomTable'
import Loader from 'src/components/Loader'
import DepoVInspectionService from 'src/Service/Depo/VInspection/DepoVInspectionService'
import AccessDeniedComponent from 'src/components/commoncomponent/AccessDeniedComponent'
import JavascriptInArrayComponent from 'src/components/commoncomponent/JavascriptInArrayComponent'
import * as LogisticsProScreenNumberConstants from 'src/components/constants/LogisticsProScreenNumberConstants'
import IfoodsVInspectionService from 'src/Service/Ifoods/VInspection/IfoodsVInspectionService'

const IfoodsVehicleInspectionHome = () => {
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
  let page_no = LogisticsProScreenNumberConstants.IfoodsModuleScreens.Ifoods_Vins

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
    GATE_OUT: 2,
    WAIT_OUTSIDE: 0,
    VEHICLE_MAINTENANCE_ENDED: 5,
  }
  const loadVehicleInspectionTable = () => {
    IfoodsVInspectionService.getVehicleReadyToInspect().then((res) => {
      setFetch(true)
      tableData = res.data.data
      console.log(tableData,'getVehicleReadyToInspect')
      let rowDataList = []
      const filterData = tableData.filter(
        (data) => user_locations.indexOf(data.vehicle_location_id) != -1
      )
      console.log(filterData,'filterData')
      filterData.map((data, index) => {
        rowDataList.push({
          sno: index + 1,
          Vendor_Name: data.ifoods_Vendor_info.vendor_name,
          Vehicle_No: data.ifoods_Vehicle_info.vehicle_number,
           Driver_Name: data.driver_name,
           Purpose: data.purpose == 1 ? 'FG-Sales' : 'FG-STO',
          Waiting_At: (
            <span className="badge rounded-pill bg-info">
              {data.vehicle_current_position == ACTION.GATE_IN
                ? 'Loading Point - In Completed'
                : 'Tripsheet Created'}
            </span>
          ),
          Screen_Duration: data.vehicle_current_position_updated_time,
          Overall_Duration: data.created_at_time,
          Action: (
            <CButton className="badge" color="warning">
              <Link className="text-white" to={`IfoodsVehicleInspection/${data.ifoods_parking_yard_gate_id}`}>
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
    {
      name: 'Vehicle No',
      selector: (row) => row.Vehicle_No,
      sortable: true,
      center: true,
    },
   
    // {
    //   name: 'Driver Name',
    //   selector: (row) => row.Driver_Name,
    //   sortable: true,
    //   center: true,
    // },

    {
      name: 'Trip Purpose ',
      selector: (row) => row.Purpose,
      sortable: true,
      center: true,
    },


    {
      name: 'Vendor Name',
      selector: (row) => row.Vendor_Name,
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
    // {
    //   name: ' Overall Duration',
    //   selector: (row) => row.Overall_Duration,
    //   center: true,
    // },
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
                  />
                </CContainer>
              </CCard>
            </>) : (<AccessDeniedComponent />
          )}
        </>
      )}
    </>
  )
}

export default IfoodsVehicleInspectionHome
