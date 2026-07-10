import {
  CButton,
  CCard,
  CContainer,
  CCol,
  CRow,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CCardImage,
  CModalFooter,
} from '@coreui/react'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import CustomTable from 'src/components/customComponent/CustomTable'
import Loader from 'src/components/Loader' 
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css' 
import DeliveryTrackService from 'src/Service/DeliveryTrack/DeliveryTrackService'
import * as LogisticsProScreenNumberConstants from 'src/components/constants/LogisticsProScreenNumberConstants'
import AccessDeniedComponent from 'src/components/commoncomponent/AccessDeniedComponent'
import JavascriptInArrayComponent from 'src/components/commoncomponent/JavascriptInArrayComponent'

const DeliveryTrackTable = () => {

  /*================== User Id & Location Fetch ======================*/
  const user_info_json = localStorage.getItem('user_info')
  const user_info = JSON.parse(user_info_json)
  const user_locations = []

  /* Get User Locations From Local Storage */
  user_info.location_info.map((data, index) => {
    user_locations.push(data.id)
  })

  /* ==================== Access Part Start ========================*/
  const [screenAccess, setScreenAccess] = useState(false)
  let page_no = LogisticsProScreenNumberConstants.DeliveryTrackModule.DT_Screen

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

  const [fetch, setFetch] = useState(false)
  const [rowData, setRowData] = useState([])
  const [mount, setMount] = useState(1) 
  let viewData

  function changeDTStatus(id) {
    setFetch(false)
    DeliveryTrackService.deleteDTInfo(id).then((res) => {
      setFetch(true)
      toast.success('DT Info Deleted Successfully!')
      setTimeout(() => {
        window.location.reload(false)
      }, 1000)
    })
  }

  function changeDTStatus1(data) {
    let data_id = data.id
    console.log(data,'changeDTStatus1')
    if(data.actual_reached_time == null || data.actual_reached_time == '0000-00-00 00:00:00'){
      toast.warning('Actual Reached Time Should be filled')
      return false
    }
    if(data.unloading_time == null || data.unloading_time == '0000-00-00 00:00:00'){
      toast.warning('Unloading Time Should be filled')
      return false
    }
    setFetch(false)
    DeliveryTrackService.closeDtInfoById(data_id).then((res) => {
      setFetch(true)
      toast.success('DT Info Closed Successfully!')
      setTimeout(() => {
        window.location.reload(false)
      }, 1000)
    })
  } 

  useEffect(() => {
    DeliveryTrackService.getAllDtInfo().then((response) => { 
      setFetch(true)
      viewData = response.data.data
      console.log(viewData)
      let rowDataList = []
      viewData.map((data, index) => {
        rowDataList.push({
          sno: index + 1,
          Creation_Date: data.created_date,
          Invoice_No: data.invoice_no,
          Delivery_No: data.delivery_no,
          Delivery_Sequence: data.delivery_sequence,
          Shipment_No: data.shipment_no,
          Shipment_Date: data.created_at ? formatDate(data.created_at): '',
          Shipment_Qty: data.billed_net_qty,
          Customer_Name: data.customer_name,
          Customer_Code: data.customer_code,
          Customer_City: data.customer_city,
          Tripsheet_No: data.tripsheet_no,
          Vehicle_No: data.vehicle_no,
          Driver_Name: data.driver_name,
          Driver_Mobile_No: data.driver_contact_no,
          Division: data.division,
          Yard_GateIn_Time: data.ygi_time,
          Yard_GateOut_Time: data.ygo_time,
          Mill_GateIn_Time: data.mgi_time,
          Mill_GateOut_Time: data.mgo_time, 
          TL_Name: data.tl_name,
          First_Delivery_Distance: data.fdl_distance,
          Actual_Reached_Time: data.actual_reached_time,
          Unloading_Time: data.unloading_time, 
          Action: (
            <div className="d-flex justify-content-space-between">
               
              <CButton
                size="sm"
                color="success"
                shape="rounded"
                id={data.id}
                onClick={() => {
                  changeDTStatus1(data)
                }}
                className="m-1"
              >
                {/* Delete */}
                <i className="fa fa-check" aria-hidden="true"></i>
              </CButton>
               
              <Link target='_blank' to={`ShipmentDeliveryTrack/${data.shipment_id}`}> 
                <CButton
                  size="sm"
                  // disabled={data.driver_status === 1 ? false : true}
                  color="secondary"
                  shape="rounded"
                  id={data.id}
                  className="m-1"
                >
                  {/* Edit */}
                  <i className="fa fa-edit" aria-hidden="true"></i>
                </CButton>
              </Link>
              {user_info.is_admin == 1 && (
                <CButton
                  size="sm"
                  color="danger"
                  shape="rounded"
                  id={data.id}
                  onClick={() => {
                    changeDTStatus(data.id)
                  }}
                  className="m-1"
                >
                  {/* Delete */}
                  <i className="fa fa-trash" aria-hidden="true"></i>
                </CButton>
              )}
            </div>
          ),
        })
      })
      setRowData(rowDataList)
    })
  }, [mount])

  // ============ Column Header Data =======

  const updated_columns = [
    {
      name: 'S.No',
      selector: (row) => row.sno,
      sortable: true,
      center: true,
    },
    {
      name: 'Tripsheet No',
      selector: (row) => row.Tripsheet_No,
      sortable: true,
      center: true,
    },
    {
      name: 'Shipment Date',
      selector: (row) => row.Shipment_Date,
      sortable: true,
      center: true,
    },
    {
      name: 'Shipment No',
      selector: (row) => row.Shipment_No,
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
      name: 'Driver Mobile No',
      selector: (row) => row.Driver_Mobile_No,
      sortable: true,
      center: true,
    },
    {
      name: 'Customer Name',
      selector: (row) => row.Customer_Name,
      sortable: true,
      center: true,
    }, 
    {
      name: 'Customer City ',
      selector: (row) => row.Customer_City,
      sortable: true,
      center: true,
    },
    {
      name: 'Shipment Qty',
      selector: (row) => `${row.Shipment_Qty} - TON`,
      sortable: true,
      center: true,
    },
    {
      name: 'Division',
      selector: (row) => row.Division,
      sortable: true,
      center: true,
    }, 
    {
      name: 'Mill Gate In Time',
      selector: (row) => row.Mill_GateIn_Time,
      sortable: true,
      center: true,
    },
    {
      name: 'Mill Gate Out Time',
      selector: (row) => row.Mill_GateOut_Time,
      sortable: true,
      center: true,
    },
    {
      name: 'Actual Reached Time',
      selector: (row) => row.Actual_Reached_Time,
      sortable: true,
      center: true,
    },
    {
      name: 'Unloading Time',
      selector: (row) => row.Unloading_Time,
      sortable: true,
      center: true,
    },

    {
      name: 'Action',
      selector: (row) => row.Action,
      center: true,
    },
  ]

  function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [day, month, year].join('-');
  }

  const columns = [
    {
      name: 'S.No',
      selector: (row) => row.sno,
      sortable: true,
      center: true,
    },
    {
      name: 'Creation Date',
      selector: (row) => row.Creation_Date,
      sortable: true,
      center: true,
    },
    {
      name: 'Invoice No',
      selector: (row) => row.Invoice_No,
      sortable: true,
      center: true,
    },
    {
      name: 'Delivery No',
      selector: (row) => row.Delivery_No,
      sortable: true,
      center: true,
    },
    {
      name: 'Delivery Sequence',
      selector: (row) => row.Delivery_Sequence,
      sortable: true,
      center: true,
    },
    {
      name: 'Shipment No',
      selector: (row) => row.Shipment_No,
      sortable: true,
      center: true,
    },
    {
      name: 'Customer Name',
      selector: (row) => row.Customer_Name,
      sortable: true,
      center: true,
    },
    {
      name: 'Customer Code',
      selector: (row) => row.Customer_Code,
      sortable: true,
      center: true,
    },
    {
      name: 'Customer City ',
      selector: (row) => row.Customer_City,
      sortable: true,
      center: true,
    },
    {
      name: 'Tripsheet No',
      selector: (row) => row.Tripsheet_No,
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
    },{
      name: 'Driver Mobile No',
      selector: (row) => row.Driver_Mobile_No,
      sortable: true,
      center: true,
    },
    {
      name: 'Division',
      selector: (row) => row.Division,
      sortable: true,
      center: true,
    },
    {
      name: 'Yard GateIn Time',
      selector: (row) => row.Yard_GateIn_Time,
      sortable: true,
      center: true,
    },
    {
      name: 'Yard GateOut Time',
      selector: (row) => row.Yard_GateOut_Time,
      sortable: true,
      center: true,
    },
    {
      name: 'Mill GateIn Time',
      selector: (row) => row.Mill_GateIn_Time,
      sortable: true,
      center: true,
    },
    {
      name: 'Mill GateIn Time',
      selector: (row) => row.Mill_GateOut_Time,
      sortable: true,
      center: true,
    },
    {
      name: 'TL Name',
      selector: (row) => row.TL_Name,
      sortable: true,
      center: true,
    },
    {
      name: 'Delivery Distance',
      selector: (row) => row.First_Delivery_Distance,
      // sortable: true,
      center: true,
    },
    {
      name: 'Actual Reached Time',
      selector: (row) => row.Actual_Reached_Time,
      sortable: true,
      center: true,
    },
    {
      name: 'Unloading Time',
      selector: (row) => row.Unloading_Time,
      sortable: true,
      center: true,
    },

    {
      name: 'Action',
      selector: (row) => row.Action,
      center: true,
    },
  ]

  //============ column header data=========

  return (
    <>
      {!fetch && <Loader />}
      {fetch && (
        <>
          {screenAccess ? (
            <>
              {/* <CRow className="mt-1 mb-1">
                <CCol
                  className="offset-md-6"
                  xs={15}
                  sm={15}
                  md={6}
                  style={{ display: 'flex', justifyContent: 'end' }}
                >
                  <Link className="text-white" to="/DeliveryTrackMaster">
                    <CButton size="md" color="warning" className="px-3 text-white" type="button">
                      <span className="float-start">
                        <i className="" aria-hidden="true"></i> &nbsp;NEW
                      </span>
                    </CButton>
                  </Link>
                </CCol>
              </CRow> */}
              <CCard>
                <CContainer>
                  <CustomTable
                    columns={updated_columns}
                    data={rowData}
                    // fieldName={'Driver_Name'}
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

export default DeliveryTrackTable
