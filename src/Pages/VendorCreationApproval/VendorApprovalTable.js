import { React, useState, useEffect } from 'react'
import { CButton, CCard, CContainer, CSpinner, CBadge } from '@coreui/react'
import { Link } from 'react-router-dom'
import CustomTable from 'src/components/customComponent/CustomTable'
import VendorCreationService from 'src/Service/VendorCreation/VendorCreationService'
import Loader from 'src/components/Loader'

import AccessDeniedComponent from 'src/components/commoncomponent/AccessDeniedComponent'
import JavascriptInArrayComponent from 'src/components/commoncomponent/JavascriptInArrayComponent'
import * as LogisticsProScreenNumberConstants from 'src/components/constants/LogisticsProScreenNumberConstants'

const VendorCreationApprovalHome = () => {
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
   let page_no = LogisticsProScreenNumberConstants.VendorCreationModule.Vendor_Creation_Approval

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
    GATE_IN: 1,
    GATE_OUT: 2,
    WAIT_OUTSIDE: 3,
  }

  const loadVendorApprovalTable = () => {
    VendorCreationService.getVendorApprovalTableData().then((res) => {
      tableData = res.data.data
      setFetch(true)
      console.log(tableData)
      let rowDataList = []
      console.log(tableData)
      const filterData1 = tableData.filter(
        (data) => user_locations.indexOf(data.vehicle_location_id) != -1
      )
      // console.log(filterData)
      const filterData = filterData1.filter(
        (data) =>
          // data.vehicle_document != null &&
          // data.vehicle_type_id.id == 3 &&
          // data.vendor_info.vendor_status == 2 &&
          // data.vehicle_document.vendor_flag == 0

          (data.trip_sto_status == 1 || data.vehicle_document != null) &&
          data.vehicle_type_id.id == 3 &&
          data.vendor_info?.vendor_status == 2 &&
          (data.trip_sto_status == 1 || data.vehicle_document.document_status == 1) &&
          (data.trip_sto_status == 1 || data.vehicle_document.vendor_flag == 0)
      )
      console.log(filterData)

      filterData.map((data, index) => {
        // if (data.vehicle_document != null) {
        rowDataList.push({
          sno: index + 1,
          // Tripsheet_No: '',
          Vehicle_Type: data.vehicle_type_id.type,
          Vehicle_No: data.vehicle_number,
          Driver_Name: data.driver_name,
          Owner_Name: data.vendor_info?.owner_name,
          PAN_NUMBER: data.vendor_info?.pan_card_number,
          Waiting_At: (
            <span className="badge rounded-pill bg-info">
              {data.parking_status == ACTION.GATE_IN
                ? 'Vendor Approval'
                : data.parking_status == ACTION.WAIT_OUTSIDE
                ? 'Waiting Outside'
                : 'Vendor Approval'}
            </span>
          ),
          Screen_Duration: data.updated_at,
          Overall_Duration: data.created_at,
          Action: (
            <CButton className="badge" color="warning">
              <Link className="text-white" to={`VendorCreationApproval/${data.vehicle_id}`}>
                Approve Vendor
              </Link>
            </CButton>
          ),
        })
        // }
      })
      setRowData(rowDataList)
      setPending(false)
    })
  }

  useEffect(() => {
    loadVendorApprovalTable()
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
      name: 'Owner Name',
      selector: (row) => row.Owner_Name,
      sortable: true,
      center: true,
    },
    {
      name: 'PAN Number',
      selector: (row) => row.PAN_NUMBER,
      sortable: true,
      center: true,
    },
    {
      name: 'Waiting At',
      selector: (row) => row.Waiting_At,
      sortable: true,
      center: true,
    },
    {
      name: 'Screen Duration',
      selector: (row) => row.Screen_Duration,
      sortable: true,
      center: true,
    },
    {
      name: ' Overall Duration',
      selector: (row) => row.Overall_Duration,
      sortable: true,
      center: true,
    },
    {
      name: 'Action',
      selector: (row) => row.Action,
      sortable: true,
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
export default VendorCreationApprovalHome
