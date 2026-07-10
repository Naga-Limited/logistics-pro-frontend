import { React, useState, useEffect } from 'react'
import { CButton, CCard, CContainer } from '@coreui/react'
import { Link } from 'react-router-dom'
import CustomTable from 'src/components/customComponent/CustomTable'
import Loader from 'src/components/Loader'
import AccessDeniedComponent from 'src/components/commoncomponent/AccessDeniedComponent'
import JavascriptInArrayComponent from 'src/components/commoncomponent/JavascriptInArrayComponent'
import * as LogisticsProScreenNumberConstants from 'src/components/constants/LogisticsProScreenNumberConstants'
import DepoExpenseClosureService from 'src/Service/Depo/ExpenseClosure/DepoExpenseClosureService'
import IfoodsExpenseClosureService from 'src/Service/Ifoods/ExpenseClosure/IfoodsExpenseClosureService'

const IfoodsExpenseApprovalHome = () => {
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
  let page_no = LogisticsProScreenNumberConstants.IfoodsModuleScreens.Expense_Approval

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
    DEPO_SHIPMENT_COMPLETED: 22,
    DEPO_EXPENSE_APPROVAL: 27
  }

  function dateFormat(a) {
    if (typeof a !== 'string' || a.length < 8) {
      return 'Invalid date format';
    }
  
    let parts = a.split('-');
  
    if (parts.length !== 3) {
      return 'Invalid date format';
    }
  
    let day = parts[0];
    let month = parts[1];
    let short_year = parts[2];
    let year = '20' + short_year;
  
    return `${day}-${month}-${year}`;
  }
  const getClosureVehiclesData = () => {
    IfoodsExpenseClosureService.getVehicleReadyToExpenseApproval().then((res) => {
      closureData = res.data.data
      console.log(closureData,'getVehicleReadyToExpenseApproval')
      setFetch(true)

      let rowDataList = []
      const filterData = closureData.filter(
        (data) =>
          user_locations.indexOf(data.vehicle_location_id) != -1
      )

      filterData.map((data, index) => {
        rowDataList.push({
          sno: index + 1,
          Tripsheet_No: data.tripsheet_info[0].ifoods_tripsheet_no,
          Tripsheet_Date: data.ifoods_Vendor_info.vendor_name,
          Vehicle_No: data.ifoods_Vehicle_info.vehicle_number,
          Driver_Name: data.driver_name,
          Waiting_At: (
            <span className="badge rounded-pill bg-info">
              {data.vehicle_current_position ==
                  VEHICLE_CURRENT_POSITION.DEPO_EXPENSE_APPROVAL
                ? 'Trip Closure Completed'
                : 'Gate Out'}
            </span>
          ),
          Screen_Duration: data.vehicle_current_position_updated_time,
          Overall_Duration: data.created_at,
          Action: (
            <CButton className="badge" color="warning">
              <Link className="text-white" to={`IfoodsExpenseApproval/${data.closure_info.closure_id}`}>
                Trip Closure Approval
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
      name: 'Vendor Name',
      selector: (row) => row.Tripsheet_Date,
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
      name: 'Current Status',
      selector: (row) => row.Waiting_At,
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
    //   sortable: true,
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
            </> ) : (<AccessDeniedComponent />
          )}
   	    </>
      )}
    </>
  )
}

export default IfoodsExpenseApprovalHome



