import { React, useState, useEffect } from 'react'
import { CButton, CCard, CContainer } from '@coreui/react'
import { Link } from 'react-router-dom'
import CustomTable from 'src/components/customComponent/CustomTable'
import Loader from 'src/components/Loader'
import AccessDeniedComponent from 'src/components/commoncomponent/AccessDeniedComponent'
import JavascriptInArrayComponent from 'src/components/commoncomponent/JavascriptInArrayComponent'
import * as LogisticsProScreenNumberConstants from 'src/components/constants/LogisticsProScreenNumberConstants'
import DepoShipmentCreationService from 'src/Service/Depo/Shipment/DepoShipmentCreationService'

const DepoShipmentApprovalTable = () => {
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
  let page_no = LogisticsProScreenNumberConstants.DepoModuleScreens.Depo_Shipment_Approval

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

  const statusSetter = (status) => {
    // data.approval_status == 1 ? () : '',

    if(status == '1') {
      return (
        <span className="badge rounded-pill bg-info">{'Waiting For Approval'}</span>
      )
    } else if(status == '2') {
      return (
        <span className="badge rounded-pill bg-info">{'Request Reverted'}</span>
      )
    } else if(status == '3') {
      return (
        <span className="badge rounded-pill bg-info">{'Request Confirmed'}</span>
      )
    } else if(status == '7') {
      return (
        <span className="badge rounded-pill bg-info">{'Waiting For Delivery Insert Approval'}</span>
      )
    } else {
      return ''
    }
  }

  const loadShipmentApprovalTable = () => {
    DepoShipmentCreationService.getAllWaitingShipmentOrders().then((res) => {
      setFetch(true)
      let tableData = res.data.data
      console.log(res.data.data,'getAllWaitingShipmentOrders')
      let rowDataList1 = []
      const filterData = tableData.filter(
        (data) => user_locations.indexOf(data.parking_yard_info.vehicle_location_id) != -1 && (data.approval_status == '1' || data.approval_status == '7')
      )
      console.log(filterData,'filterData')
      let temp = 0
      filterData.map((data, index) => {

        rowDataList1.push({
            sno: temp + 1,
            Vehicle_No: data.trip_vehicle_info.vehicle_number,
            Created_At: data.created_at_date,
            Tripsheet_No: data.trip_sheet_info.depo_tripsheet_no,
            Shipment_No: data.shipment_no != null ? data.shipment_no : ' - ',
            Shipment_User: data.depo_shipment_user_info.username,
            View: (
              <CButton className="btn btn-secondary btn-sm me-md-1">
                <Link className="text-white" to={`DepoShipmentApproval/${data.shipment_id}`}>
                  <i className="fa fa-eye" aria-hidden="true"></i>
                </Link>
              </CButton>),
            Status: statusSetter(data.approval_status),
            Action: (
              <>
                <span className="float-start" color="success">
                  <CButton
                    className="btn btn-success btn-sm me-md-1"
                    onClick={() => {
                      setShipmentDelete(true)
                      setShipmentToDelete(data.shipment_no)
                      setShipmentTSToDelete(data.trip_sheet_info.trip_sheet_no)
                    }}
                    disabled={data.shipment_pgi_status == 1}
                  >
                    <i className="fa fa-check-square-o" aria-hidden="true"></i>
                  </CButton>
                </span>
                <span className="float-start" color="danger">
                  <CButton
                    className="btn btn-danger btn-sm me-md-1"
                    onClick={() => {
                      setShipmentDelete(true)
                      setShipmentToDelete(data.shipment_no)
                      setShipmentTSToDelete(data.trip_sheet_info.trip_sheet_no)
                    }}
                    disabled={data.shipment_pgi_status == 1}
                  >

                    <i className="fa fa-window-close-o" aria-hidden="true"></i>
                  </CButton>
                </span>
              </>
            ),
          })
          temp++

      })
      setRowData(rowDataList1)
      // setRowData(rowDataList)
    })
  }

  useEffect(() => {
    loadShipmentApprovalTable()
    // loadVehicleInspectionTable()
  }, [])

  const waiting_columns = [
    {
      name: 'S.No',
      selector: (row) => row.sno,
      sortable: true,
      center: true,
    },
    {
      name: 'Vehicle Number',
      selector: (row) => row.Vehicle_No,
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
      name: 'Shipment Number',
      selector: (row) => row.Shipment_No,
      sortable: true,
      center: true,
    },
    {
      name: 'Created By',
      selector: (row) => row.Shipment_User,
      sortable: true,
      center: true,
    },
    {
      name: 'Created On',
      selector: (row) => row.Created_At,
      sortable: true,
      center: true,
    },
    {
      name: 'View',
      selector: (row) => row.View,
      // sortable: true,
      center: true,
    },
    {
      name: 'Status',
      selector: (row) => row.Status,
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
                    columns={waiting_columns}
                    data={rowData}
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

export default DepoShipmentApprovalTable
