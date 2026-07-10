import { React, useState, useEffect } from 'react'
import { CButton, CCard, CContainer } from '@coreui/react'
import { Link } from 'react-router-dom'
import CustomTable from 'src/components/customComponent/CustomTable'
import Loader from 'src/components/Loader'
import AccessDeniedComponent from 'src/components/commoncomponent/AccessDeniedComponent'
import JavascriptInArrayComponent from 'src/components/commoncomponent/JavascriptInArrayComponent'
import * as LogisticsProScreenNumberConstants from 'src/components/constants/LogisticsProScreenNumberConstants'
import DepoExpenseClosureService from 'src/Service/Depo/ExpenseClosure/DepoExpenseClosureService'
import LocationApi from 'src/Service/SubMaster/LocationApi'
import IfoodsExpenseClosureService from 'src/Service/Ifoods/ExpenseClosure/IfoodsExpenseClosureService'

const IfoodsPaymentApprovalTable = () => {
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
  let page_no = LogisticsProScreenNumberConstants.IfoodsModuleScreens.Payment_Approval

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

  const ACTION = {
    GATE_IN: 1,
    GATE_OUT: 2,
    WAIT_OUTSIDE: 0,
  }

  /* Display The Delivery Plant Name via Given Delivery Plant Code */
  const getLocationNameByCode = (code) => {
    console.log(code,'code')
    console.log(locationData,'filtered_location_data')
    let filtered_location_data = locationData.filter((c, index) => {
      if (c.location_code == code) {
        return true
      }
    })
    console.log(filtered_location_data,'filtered_location_data')
    let locationName = filtered_location_data.length > 0 ? filtered_location_data[0].Location : 'Loading..'
    return locationName
  }

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
    IfoodsExpenseClosureService.getTripsReadyToSettlementApproval().then((res) => {
      closureData = res.data.data
      console.log(closureData,'getTripsReadyToSettlementApproval')

      let rowDataList = []
      // const filterData = closureData.filter(
      //   (data) =>
      //     user_locations.indexOf(data.vendorinfo.vendorlocation) != -1
      // )

      // console.log(filterData,'getTripsReadyToSettlementApproval')

      closureData.map((data, index) => {
        rowDataList.push({
          sno: index + 1,
          date: data.created_date,
          User_Name: data.created_date,
          Unique_No: data.invoice_sequence,
          Freight_Amt: data.freight_amount,
          vendorName: data.vendor_info.vendor_name,
          Request_By: data.payment_user_info.emp_name,
          Trip_Count:data.trip_info.length,
          vendorLocation: getLocationNameByCode(data.vendor_info.location_info.location_name),
          Waiting_At: (
            <span className="badge rounded-pill bg-info">
              {data.status == '3'
                ? 'AM-Payment Validation Completed'
                : 'AM-Payment Validation Completed'}
            </span>
          ),
          Screen_Duration: data.updated_at,
          Action: (
            // <CButton className="badge" color="warning">
            //   <Link className="text-white" to={`DepoSettlementApproval/${data.id}`}>
            //     Payment Approval
            //   </Link>
            // </CButton>
            <CButton className="btn btn-success btn-sm me-md-1">
              <Link className="text-white" to={`IfoodsPaymentApproval/${data.id}`}>
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
      selector: (row) => row.vendorName,
      sortable: true,
      center: true,
    },
  
    {
      name: 'Tripsheets Count',
      selector: (row) => row.Trip_Count,
      sortable: true,
      center: true,
    },
    {
      name: 'Freight Amount',
      selector: (row) => row.Freight_Amt,
      sortable: true,
      center: true,
    },
    // {
    //   name: 'Request By',
    //   selector: (row) => row.Request_By,
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
            </> ) : (<AccessDeniedComponent />
          )}
   	    </>
      )}
    </>
  )
}

export default IfoodsPaymentApprovalTable




