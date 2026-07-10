import { React, useState, useEffect } from 'react'
import { CButton, CCard, CContainer } from '@coreui/react'
import { Link } from 'react-router-dom'
import CustomTable from 'src/components/customComponent/CustomTable'
import Loader from 'src/components/Loader'
import AccessDeniedComponent from 'src/components/commoncomponent/AccessDeniedComponent'
import JavascriptInArrayComponent from 'src/components/commoncomponent/JavascriptInArrayComponent'
import * as NlmtScreenAccessCodes from 'src/components/constants/NlmtScreenAccessCodes'  
import LocationApi from 'src/Service/SubMaster/LocationApi'
import NlmtTripSheetClosureService from 'src/Service/Nlmt/TripSheetClosure/NlmtTripSheetClosureService'

const NlmtSettlementValidationTable = () => {

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
  let page_no = NlmtScreenAccessCodes.NlmtClosureScreens.Nlmt_Payment_Validation

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
  const [locationData, setLocationData] = useState([])
  const [pending, setPending] = useState(false)
  const [fetch, setFetch] = useState(false)
  let tableData = []
  let closureData = []

  useEffect(() => {
    LocationApi.getLocation().then((response) => {
      let viewData = response.data.data
      console.log(viewData,'viewData')
      let rowDataList_location = []
      viewData.map((data, index) => {
        rowDataList_location.push({
          sno: index + 1,
          Location: data.location,
          location_code: data.id,
        })
      })
      setLocationData(rowDataList_location)
    })

  },[])

  useEffect(() => {
    getClosureVehiclesData()
  }, [locationData])

  const getClosureVehiclesData = () => {
    NlmtTripSheetClosureService.getTripsReadyToSettlementValidation().then((res) => {
      closureData = res.data.data
      console.log(closureData,'getTripsReadyToSettlementValidation')

      let rowDataList = []
      // const filterData = closureData.filter(
      //   (data) =>
      //     user_locations.indexOf(data.contractor_info.contractor_location) != -1
      // )

      // console.log(filterData,'getTripsReadyToSettlementApproval')

      closureData.map((data, index) => {
        rowDataList.push({
          sno: index + 1,
          date: data.created_date,
          User_Name: data.created_date,
          Freight_Code: data.freight_percentage,
          Unique_No: data.invoice_sequence,
          Vendor_Name: data.vendor_name,
          Request_By: data.payment_user_info.emp_name,
          Trip_Count:data.trip_info.length,
          //Contractor_Location: getLocationNameByCode(data.contractor_info.contractor_location),
          Waiting_At: (
            <span className="badge rounded-pill bg-info">
              {data.status == '1'
                ? 'Waiting For Validation'
                : 'Gate Out'}
            </span>
          ),
          Screen_Duration: data.created_at,
          Action: (
            // <CButton className="badge" color="warning">
            //   <Link className="text-white" to={`DepoSettlementValidation/${data.id}`}>
            //     {/* Payment Validation */}
            //     <i className="fa fa-eye" aria-hidden="true"></i>
            //   </Link>
            // </CButton>
            <CButton className="btn btn-success btn-sm me-md-1">
              <Link className="text-white" to={`NlmtSettlementValidation/${data.id}`}>
                <i className="fa fa-eye" aria-hidden="true"></i>
              </Link>
            </CButton>
          ),
        })
      })
      setFetch(true)
      setRowData(rowDataList)
      setPending(true)
    })
  }

  const columns = [
    {
      name: 'S.No',
      selector: (row) => row.sno,
      sortable: true,
      center: true,
    },
    {
      name: 'Invoice Ref.',
      selector: (row) => row.Unique_No,
      sortable: true,
      center: true,
    },
    {
      name: 'Date',
      selector: (row) => row.date,
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
      name: 'TS Count',
      selector: (row) => row.Trip_Count,
      sortable: true,
      center: true,
    },
    // {
    //   name: 'Request By',
    //   selector: (row) => row.Request_By,
    //   sortable: true,
    //   center: true,
    // },Freight_Code
    // {
    //   name: 'Current Status',
    //   selector: (row) => row.Waiting_At,
    //   center: true,
    // },
    {
      name: 'Freight %',
      selector: (row) => row.Freight_Code,
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
      name: 'View',
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

export default NlmtSettlementValidationTable




