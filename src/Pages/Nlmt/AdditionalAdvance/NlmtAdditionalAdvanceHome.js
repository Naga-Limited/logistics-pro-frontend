import { CButton, CCard, CContainer } from '@coreui/react'
import { Link } from 'react-router-dom'
import CustomTable from 'src/components/customComponent/CustomTable'
import React, { useEffect, useState } from 'react'
import Loader from 'src/components/Loader'
import AdvanceCreationService from 'src/Service/Advance/AdvanceCreationService'

import AccessDeniedComponent from 'src/components/commoncomponent/AccessDeniedComponent'
import JavascriptInArrayComponent from 'src/components/commoncomponent/JavascriptInArrayComponent'
import * as LogisticsProScreenNumberConstants from 'src/components/constants/LogisticsProScreenNumberConstants'

const NlmtAdditionalAdvanceHome = () => {
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
  let page_no = LogisticsProScreenNumberConstants.AdvancePaymentModule.Additional_Advance

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
  const [diesel_payment, setDiesel_payment] = useState('')
  const [bankpayment, setBank_payment] = useState('')

  let tableData = []
  const ACTION = {
    TRIPSHEET_CREATED: 16,
    SHIPMENT_CREATED: 20,
    NLCD_SHIPMENT_CREATED: 23,
    SHIPMENT_COMPLETE: 22,
    NLCD_SHIPMENT_COMPLETE: 25,
    ADVANCE_COMPLETE: 18,
    RJ_SO_COMPLETE: 35,
    // TRIPSHEET_OWN_NLCD: 2,
    // TRIPSHEET_SALES: 1,
    // TRIPSHEET_OWN_NLFD: 1,
    // TRIPSHEET_STO: 2,
  }

  const PENDING = {
    ADVANCE_BANK_PENDING:null,
    ADVANCE_DIESEL_PENDING:null,
  }
  const loadVehicleReadyToTrip = () => {
    AdvanceCreationService.getVehicleReadyToAdditionalAdvance().then((res) => {
      setFetch(true)
      console.log(res.data.data)
      tableData = res.data.data
      let rowDataList = []
      const filterData1 = tableData.filter(
        (data) => user_locations.indexOf(data.vehicle_location_id) != -1
      )

      const filterData = filterData1.filter(
        (data) =>
         !data.advance_info || data.advance_info.advance_status == 1
      )

      filterData.map((data, index) => {
        rowDataList.push({
          sno: index + 1,
          Tripsheet_No: data.trip_sheet_info?.trip_sheet_no,
          Tripsheet_Date: data.trip_sheet_info.created_date,
          Vehicle_Type: data.vehicle_type_id.type,
          Vehicle_No: data.vehicle_number,
          Driver_Name: data.driver_name,
          Waiting_At: (
            <span className="badge rounded-pill bg-info">
              {data.vehicle_current_position == ACTION.TRIPSHEET_CREATED
                ? 'TS Create'
                : data.vehicle_current_position == ACTION.ADVANCE_COMPLETE
                ? 'Advance Create'
                : data.vehicle_current_position == ACTION.SHIPMENT_CREATED
                ? 'Shipment Create(NLFD)'
                : data.vehicle_current_position == ACTION.SHIPMENT_COMPLETE
                ? 'Shipment Complete(NLFD)'
                : data.vehicle_current_position == ACTION.NLCD_SHIPMENT_CREATED
                ? 'Shipment Create(NLCD)'
                : data.vehicle_current_position == ACTION.NLCD_SHIPMENT_COMPLETE
                ? 'Shipment Complete(NLCD)'
                : data.vehicle_current_position == ACTION.RJ_SO_COMPLETE
                ? 'RJ SO Complete'
                : 'Advance Payment'}
            </span>
          ),

          advance_status:(
            <span className="badge rounded-pill bg-info">
              {
                data.trip_sheet_info.advance_status == 0
                ? 'Advance ❌'
                : data.trip_sheet_info.advance_status == 1
                ? 'Advance ✅'
                :'-'
              }
            </span>
          ),

          Screen_Duration: data.vehicle_current_position_updated_time,
          Overall_Duration: data.created_at,
          Action: (
            <CButton className="badge" color="warning">
              <Link className="text-white" to={`${data.parking_yard_gate_id}`}>Advance Creation</Link>
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
      name: 'Advance Status',
      selector: (row) => row.advance_status,
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
                fieldName={'Advance_user'}
                showSearchFilter={true}
              />
              <hr></hr>
            </CContainer>
          </CCard>
         </>
	     ) : (<AccessDeniedComponent />)}
    	 </>
      )}
    </>
  )
}

export default NlmtAdditionalAdvanceHome
