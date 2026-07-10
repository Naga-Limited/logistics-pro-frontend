import {
  CButton,
  CCard,
  CContainer,
  CCol,
  CRow,
} from '@coreui/react'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Loader from 'src/components/Loader'
import CustomTable from 'src/components/customComponent/CustomTable'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import IfoodsVehicleMasterService from 'src/Service/Ifoods/Master/IfoodsVehicleMasterService'
import AccessDeniedComponent from 'src/components/commoncomponent/AccessDeniedComponent'
import JavascriptInArrayComponent from 'src/components/commoncomponent/JavascriptInArrayComponent'
import * as LogisticsProScreenNumberConstants from 'src/components/constants/LogisticsProScreenNumberConstants'
import IfoodsStofreightMasterService from 'src/Service/Ifoods/Master/IfoodsStofreightMasterService'

const IfoodsStoFreightMasterTable = () => {

  const [fetch, setFetch] = useState(false)
  const [rowData, setRowData] = useState([])
  const [mount, setMount] = useState(1)
  let viewData

  function changeFreightStatus(id) {
    IfoodsStofreightMasterService.deleteIfoodsStofreight(id).then((res)=>{
      toast.success('Freight Rate Status Updated Successfully!')
      setMount((preState) => preState + 1)
    })
  }

  /*================== User Id & Location Fetch ======================*/
  const user_info_json = localStorage.getItem('user_info')
  const user_info = JSON.parse(user_info_json)
  const user_locations = []
  const navigation = useNavigate()

  console.log(user_info)

  /* Get User Locations From Local Storage */
  user_info.location_info.map((data, index) => {
    user_locations.push(data.id)
  })

  /* Get User Id From Local Storage */
  const user_id = user_info.user_id

  // console.log(user_locations)
  /*================== User Location Fetch ======================*/

  /* ==================== Access Part Start ========================*/
const [screenAccess, setScreenAccess] = useState(false)
const [locationData, setLocationData] = useState([])
const [from_location, setLocation] = useState([])
const [to_location, setLocations] = useState([])
let page_no = LogisticsProScreenNumberConstants.IfoodsModuleScreens.Ifoods_SalesFreight_Master
const fromlocations = (e) => {
  let location_id = e.value
  values.from_location = location_id
  LocationApi.getLocation(values.from_location).then((res) => {
  setLocation(res.data.data.location_id)
})
  console.log(location_id)
}

const tolocations = (e) => {
  let location_id = e.value
  values.to_location = location_id
  LocationApi.getLocation(values.to_location).then((res) => {
    setLocations(res.data.data.location_id)
})
  console.log(location_id)
}
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

  useEffect(()=>{
    IfoodsStofreightMasterService.getIfoodsStofreight().then((response)=>{
      setFetch(true)
      viewData = response.data.data
      console.log(viewData,'Freight_data')
      let rowDataList = []
      viewData.map((data, index) => {
        rowDataList.push({
          sno: index + 1,
          Creation_Date: data.created_at,
          freight_rate: data.freight_rate,
          Vendor_name: data.ifoods_Vendor_info.vendor_name,
          vehicle_capacity_id: data.vehicle_capacity_info.capacity + '-Feet',
           from_location: data.from_location_info.location,
          to_location: data.to_location_info.location,
          Vendor_name: data.ifoods_Vendor_info.vendor_name,
          Status: data.freight_status === 1 ? '✔️' : '❌',
          Action: (
            <div className="d-flex justify-content-space-between">
              <CButton
                size="sm"
                color={data.freight_status === 1 ? "success" : "danger"}
                shape="rounded"
                id={data.id}
                onClick={() => {
                  changeFreightStatus(data.id)
                }}
                className="m-1"
              >
                {/* Delete */}
                <i className="fa fa-trash" aria-hidden="true"></i>
              </CButton>

              <Link to={data.freight_status === 1 ? `IfoodsStoFreightMaster/${data.id}` : ''}>
                <CButton
                  disabled={data.freight_status === 1 ? false : true}
                  size="sm"
                  color={data.freight_status === 1 ? "success" : "secondary"}
                  shape="rounded"
                  id={data.id}
                  className="m-1"
                  type="button"
                >
                  {/* Edit */}
                  <i className="fa fa-edit" aria-hidden="true"></i>
                </CButton>
              </Link>
            </div>
          ),
        })
      })
      setRowData(rowDataList)
    })
  },[mount])

  // ============ Column Header Data =======

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
      name: 'Vendor Name',
      selector: (row) => row.Vendor_name,
      sortable: true,
      center: true,
    },
    {
      name: 'Vehicle Capacity',
      selector: (row) => row.vehicle_capacity_id,
      sortable: true,
      center: true,
    },
    {
      name: 'Freight Rate',
      selector: (row) => row.freight_rate,
      sortable: true,
      center: true,
    },
    {
      name: 'From Location',
      selector: (row) => row.from_location,
      sortable: true,
      center: true,
    },
    {
      name: 'To Location',
      selector: (row) => row.to_location,
      sortable: true,
      center: true,
    },
    {
      name: 'Status',
      selector: (row) => row.Status,
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
              <CRow className="mt-1 mb-1">
                <CCol
                  className="offset-md-6"
                  xs={15}
                  sm={15}
                  md={6}
                  style={{ display: 'flex', justifyContent: 'end' }}
                >
                  <Link className="text-white" to="/IfoodsStoFreightMaster">
                    <CButton size="sm" color="warning" className="px-5 text-white" type="button">
                      NEW
                    </CButton>
                  </Link>
                </CCol>
              </CRow>
              <CCard>
                <CContainer>
                  <CustomTable
                    columns={columns}
                    data={rowData}
                    // fieldName={'vehicle_Number'}
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

export default IfoodsStoFreightMasterTable
