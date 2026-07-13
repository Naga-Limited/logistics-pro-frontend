import { React, useState, useEffect } from 'react'
import { CButton, CCard, CContainer } from '@coreui/react'
import { Link } from 'react-router-dom'
import CustomTable from 'src/components/customComponent/CustomTable'
import VehicleInspectionService from 'src/Service/VehicleInspection/VehicleInspectionService'
import Loader from 'src/components/Loader'

import AccessDeniedComponent from 'src/components/commoncomponent/AccessDeniedComponent'
import JavascriptInArrayComponent from 'src/components/commoncomponent/JavascriptInArrayComponent'
import * as NlmtScreenAccessCodes from 'src/components/constants/NlmtScreenAccessCodes'
import NlmtTripSheetClosureService from 'src/Service/Nlmt/TripSheetClosure/NlmtTripSheetClosureService'

const NlmtTSPaymentHome = () => {
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
  let page_no = NlmtScreenAccessCodes.NlmtClosureScreens.NLMT_Own_Driver_Payment_Approval

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
    TRIPSHEET_EXPENSE_APPROVAL_COMPLETED: 25,
    TRIPSHEET_INCOME_CAPTURE_REJECTED: 27,
    TRIPSHEET_PAYMENT_CAPTURE: 30, 
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
    const VEHICLE_TYPE_MAP = {
  21: 'Own',
  22: 'Hire',
}

  const getClosureVehiclesData = () => {
    NlmtTripSheetClosureService.getVehicleReadyToTripIncomeClose().then((res) => {
      closureData = res.data.data
      console.log(closureData,'closureData')
      setFetch(true)

      let rowDataList = []
      const filterData1 = closureData.filter(
        (data) =>
          user_locations.includes(data.vehicle_location_id) && 
          data.vehicle_info.vehicle_type_id == 21 &&
          data.trip_settlement_info && 
          data.trip_settlement_info.tripsheet_is_settled == 3
      )

      console.log(filterData1,'filterData1')
      filterData1.map((data, index) => {
        rowDataList.push({
          sno: index + 1,
         Tripsheet_No: data.tripsheet_info?.nlmt_tripsheet_no ?? '-',
        Tripsheet_Date: data.tripsheet_info?.created_date ?? '-',
          Vehicle_Type: VEHICLE_TYPE_MAP[data?.vehicle_info?.vehicle_type_id] ?? '-',
          Vehicle_No: data.vehicle_info?.vehicle_number ?? '-',
          Driver_Name:data.driver_name ??
          data.tripsheet_info?.trip_driver_info?.driver_name ?? '-',
          Waiting_At: (
            <span className="badge rounded-pill bg-info">
              {'EXPENSE ✔️'}
            </span>
          ),
          Trip_Remarks: data.trip_remarks ? data.trip_remarks : '-',
          Screen_Duration: data.vehicle_current_position_updated_time,
          Overall_Duration: data.created_at,
          Action: (
            <CButton className="badge" color="warning">
              {/* <Link className="text-white" to={`/TSClosure`}> */}
              <Link className="text-white" to={`/NlmtTSPaymentHome/${data.nlmt_trip_in_id}`}>
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
    // {
    //   name: 'Vehicle Type',
    //   selector: (row) => row.Vehicle_Type,
    //   sortable: true,
    //   center: true,
    // },
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
    // {
    //   name: 'Acc. Remarks',
    //   selector: (row) => row.Trip_Remarks,
    //   center: true,
    //   sortable: true,
    // },
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
            </>
          ) : (
            <AccessDeniedComponent />
          )}
   	    </>
      )}
    </>
  )
}

export default NlmtTSPaymentHome


// import { React } from 'react'
// import maintenance_logo from 'src/assets/naga/main2.png'

// const NlmtTSPaymentHome = () => {
//   return (
//     <>
//       <div className="card mt-3">
//         <img style={{ margin: '5% 25%', borderRadius: '30%' }} src={maintenance_logo} />
//       </div>
//     </>
//   )
// }

// export default NlmtTSPaymentHome