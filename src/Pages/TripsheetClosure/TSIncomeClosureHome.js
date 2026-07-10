import { React, useState, useEffect } from 'react'
import { CButton, CCard, CContainer } from '@coreui/react'
import { Link } from 'react-router-dom'
import CustomTable from 'src/components/customComponent/CustomTable'
import VehicleInspectionService from 'src/Service/VehicleInspection/VehicleInspectionService'
import Loader from 'src/components/Loader'
import TripSheetClosureService from 'src/Service/TripSheetClosure/TripSheetClosureService'

import AccessDeniedComponent from 'src/components/commoncomponent/AccessDeniedComponent'
import JavascriptInArrayComponent from 'src/components/commoncomponent/JavascriptInArrayComponent'
import * as LogisticsProScreenNumberConstants from 'src/components/constants/LogisticsProScreenNumberConstants'

const TSIncomeClosureHome = () => {
  /*================== User Location Fetch ======================*/
  const user_info_json = localStorage.getItem('user_info')
  const user_info = JSON.parse(user_info_json)
  const user_locations = []
  const user_vehicle_types = []

  /* Get User Locations From Local Storage */
  user_info.location_info.map((data, index) => {
    user_locations.push(data.id)
  })

  /* Get User Vehicle Types From Local Storage */
  user_info.vehicle_type_info.map((data, index) => {
    user_vehicle_types.push(data.id)
  })

  // console.log(user_locations)
  /*================== User Location Fetch ======================*/

  /* ==================== Access Part Start ========================*/
  const [screenAccess, setScreenAccess] = useState(false)
  let page_no = LogisticsProScreenNumberConstants.TripSettlementScreens.Tripsheet_Income_Closure

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

  const getClosureVehiclesData = () => {
    TripSheetClosureService.getVehicleReadyToTripIncomeClose().then((res) => {
      closureData = res.data.data
      console.log(closureData)
      setFetch(true)

      let rowDataList = []
      const filterData1 = closureData.filter(
        (data) =>
          user_locations.indexOf(data.vehicle_location_id) != -1 &&
          user_vehicle_types.indexOf(data.vehicle_type_id.id) != -1 &&
          data.trip_settlement_info != null &&
          (data.trip_settlement_info.tripsheet_is_settled == 1 ||
            data.trip_settlement_info.tripsheet_is_settled == 4)
      )

      console.log(filterData1)
      filterData1.map((data, index) => {
        rowDataList.push({
          sno: index + 1,
          Tripsheet_No: data.trip_sheet_info.trip_sheet_no,
          Tripsheet_Date: data.trip_sheet_info.created_date,
          Vehicle_Type: data.vehicle_type_id.type,
          Vehicle_No: data.vehicle_number,
          Driver_Name: data.driver_name,
          Waiting_At: (
            <span className="badge rounded-pill bg-info">
              {data.vehicle_current_position == VEHICLE_CURRENT_POSITION.TRIPSHEET_EXPENSE_CAPTURE
                ? 'EXPENSE ✔️'
                : data.vehicle_current_position ==
                  VEHICLE_CURRENT_POSITION.TRIPSHEET_SETTLEMENT_REJECTED
                ? 'SETTLEMENT ❌'
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
          Trip_Remarks: data.trip_remarks ? data.trip_remarks : '-',
          Screen_Duration: data.vehicle_current_position_updated_time,
          Overall_Duration: data.created_at,
          Action: (
            <CButton className="badge" color="warning">
              {/* <Link className="text-white" to={`/TSClosure`}> */}
              <Link className="text-white" to={`/TSIncomeCapture/${data.parking_yard_gate_id}`}>
                Income Closure
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
      // sortable: true,
      center: true,
    },
    {
      name: 'Acc. Remarks',
      selector: (row) => row.Trip_Remarks,
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

export default TSIncomeClosureHome
