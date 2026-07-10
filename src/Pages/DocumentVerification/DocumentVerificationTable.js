import { React, useState, useEffect } from 'react'
import { CButton, CCard, CContainer, CSpinner } from '@coreui/react'
import { Link } from 'react-router-dom'
// import { Lines } from 'react-preloaders'
import CustomTable from 'src/components/customComponent/CustomTable'
import DocsVerifyService from 'src/Service/DocsVerify/DocsVerifyService'
import PanDataService from 'src/Service/SAP/PanDataService'
import Loader from 'src/components/Loader'

import AccessDeniedComponent from 'src/components/commoncomponent/AccessDeniedComponent'
import JavascriptInArrayComponent from 'src/components/commoncomponent/JavascriptInArrayComponent'
import * as LogisticsProScreenNumberConstants from 'src/components/constants/LogisticsProScreenNumberConstants'

const DocsVerify = () => {
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
   let page_no = LogisticsProScreenNumberConstants.DocumentVerificationModule.Document_Verify_List

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
  const [pending, setPending] = useState(true)

  let tableData = []

  const ACTION = {
    VEHICLE_INSPECTION_COMPLETED: 2,
  }

  const loadDocsVerifyTable = () => {
    DocsVerifyService.getDocsVerifyTableData().then((res) => {
      tableData = res.data.data
      setFetch(true)
      let rowDataList = []
      console.log(tableData)
      const filterData1 = tableData.filter(
        (data) => user_locations.indexOf(data.vehicle_location_id) != -1
      )
      // console.log(filterData)
      const filterData = filterData1.filter(
        (data) =>
          data.vehicle_type_id.id == 3 &&
          data.vehicle_inspection != null &&
          data.document_verification_status == 0
      )
      console.log(filterData)
      filterData.map((data, index) => {
        rowDataList.push({
          sno: index + 1,
          // Tripsheet_No: '',
          Vehicle_Type: data.vehicle_type_id.type,
          Vehicle_No: data.vehicle_number,
          Driver_Name: data.driver_name,
          Waiting_At: (
            <span
              className="badge rounded-pill bg-info"
              data-coreui-toggle="tooltip"
              data-coreui-placement="top"
              title="Vehicle Inspection Completed"
            >
              {data.vehicle_current_position == ACTION.VEHICLE_INSPECTION_COMPLETED
                ? 'VI Completed'
                : 'Gate Out'}
            </span>
          ),
          Screen_Duration: data.vehicle_current_position_updated_time,
          Overall_Duration: data.created_at,
          Action: (
            <CButton className="badge" color="warning">
              <Link className="text-white" to={`DocVerifyVendorAvail/${data.parking_yard_gate_id}`}>
                VERIFY
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
    loadDocsVerifyTable()
  }, [])

  const columns = [
    {
      name: 'S.No',
      selector: (row) => row.sno,
      sortable: true,
      center: true,
    },
    // {
    //   name: 'VA No',
    //   selector: (row) => row.VA_No,
    //   sortable: true,
    //   center: true,
    // },
    // {
    //   name: 'Tripsheet No',
    //   selector: (row) => row.Tripsheet_No,
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
              // pending={pending}
            />
          </CContainer>
        </CCard>
       </>
	     ) : (<AccessDeniedComponent />)}
      </>
      )}
    </>
  )
}

export default DocsVerify
