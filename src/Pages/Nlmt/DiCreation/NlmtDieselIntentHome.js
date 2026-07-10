import { CButton, CCard, CContainer } from '@coreui/react'
import { Link } from 'react-router-dom'
import CustomTable from 'src/components/customComponent/CustomTable'
import React, { useEffect, useState } from 'react'
import Loader from 'src/components/Loader' 
import AccessDeniedComponent from 'src/components/commoncomponent/AccessDeniedComponent'
import JavascriptInArrayComponent from 'src/components/commoncomponent/JavascriptInArrayComponent'
import * as NlmtScreenAccessCodes from 'src/components/constants/NlmtScreenAccessCodes'
import NlmtDieselIntentCreationService from 'src/Service/Nlmt/DieselIntent/NlmtDieselIntentCreationService'

const NlmtDieselIntentHome = () => {
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
let page_no = NlmtScreenAccessCodes.NlmtTransactionScreens.Nlmt_Diesel_Indent

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
  const ACTION = {
    TRIPSHEET_CREATED: 16,
    SHIPMENT_CREATED: 22, 
    ADVANCE_CREATED: 18, 
  }

  const loadVehicleReadyToTrip = () => {
    NlmtDieselIntentCreationService.getVehicleReadyToDiesel().then((res) => {
      setFetch(true)
      tableData = res.data.data
      console.log(tableData)
      let rowDataList = []
      const filterData1 = tableData.filter(
        (data) => user_locations.indexOf(data.vehicle_location_id) != -1
      )

const filterData = filterData1.filter((data) => {
  const vehicleTypeId = Number(
    data?.vehicle_type_id?.id ??
    data?.vehicle_type_id ??
    data?.vehicle_info?.vehicle_type_id ??
    0
  );

  const dieselStatus = Number(
    data?.diesel_intent_info?.diesel_status ?? 0
  );

  // Only include Own vehicles with diesel_status = 1
  if (vehicleTypeId === 21 && dieselStatus === 0) {
    return true;
  }

  return false;
});


console.log(filterData,'filterData')
      filterData.map((data, index) => {
        rowDataList.push({
          sno: index + 1,
          Tripsheet_No: data.tripsheet_info?.nlmt_tripsheet_no,
          Tripsheet_Date: data.tripsheet_info?.created_date,
         // Vehicle_Type: data.vehicle_type_id?.type || data.vehicle_info?.vehicle_type_id || 'N/A',
         Vehicle_Type:
  Number(data?.vehicle_type_id?.type ?? data?.vehicle_info?.vehicle_type_id) === 21
    ? 'Own'
    : '-',
          Vehicle_No: data.vehicle_number || data.vehicle_info?.vehicle_number || 'N/A',
          Driver_Name: data.driver_name || data.driver_info?.driver_name || 'N/A',
          Waiting_At: (
            <span className="badge rounded-pill bg-info">
              { data.vehicle_current_position == ACTION.TRIPSHEET_CREATED 
                  ? 'Tripsheet ✔️'
                  :  data.vehicle_current_position == ACTION.SHIPMENT_CREATED
                  ? 'Shipment ✔️' 
                   : data.vehicle_current_position == ACTION.ADVANCE_CREATED
                  ? 'Advance ✔️'
                  : '--'
                }
            </span>
          ),
          advance_status:(
            <span className="badge rounded-pill bg-info">
              {(() => {
                const vehicleTypeId = data.vehicle_type_id?.id || data.vehicle_info?.vehicle_type_id || null;
                const advanceStatus = data.advance_info
            console.log("advanceStatus"+advanceStatus)
                if (advanceStatus) {
                  return 'Advance ✅';
                } else {
                  return 'Advance ❌';
                } 
              })()}
            </span>
          ),
          Screen_Duration: data.vehicle_current_position_updated_time,
          Overall_Duration: data.created_at,
          Action: (() => {
            const vehicleTypeId = data.vehicle_type_id?.id || data.vehicle_info?.vehicle_type_id || null;
            const advanceStatus = data.trip_sheet_info?.advance_status;
            const purpose = data.trip_sheet_info?.purpose;
            const isDisabled = vehicleTypeId < 3 && advanceStatus == 0 && purpose < 3;

            return (
              <CButton className="badge text-white" color="warning" disabled={isDisabled}>
                {isDisabled ? (
                  <span>Diesel Indent Creation</span>
                ) : (
                  <Link to={`${data.nlmt_trip_in_id}`}>Diesel Indent Creation</Link>
                )}
              </CButton>
            );
          })(),
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
      name: 'Status',
      selector: (row) => row.Waiting_At,
      sortable: true,
      center: true,
    },
    {
      name: 'Advance Status',
      selector: (row) => row.advance_status,
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
            </>
          ) : (
            <AccessDeniedComponent />
          )}
        </>
      )}
    </>
  )
}

export default NlmtDieselIntentHome
