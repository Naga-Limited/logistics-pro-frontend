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

const IfoodsVehicleMasterTable = () => {

  const [fetch, setFetch] = useState(false)
  const [rowData, setRowData] = useState([])
  const [mount, setMount] = useState(1)
  let viewData

  function changeVehicleStatus(id) {
    IfoodsVehicleMasterService.deleteIfoodsVehicle(id).then((res)=>{
      toast.success('Vehicle Status Updated Successfully!')
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
let page_no = LogisticsProScreenNumberConstants.IfoodsModuleScreens.Ifoods_Vehicle_Master

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
    IfoodsVehicleMasterService.getIfoodsVehicles().then((response)=>{
      setFetch(true)
      viewData = response.data.data
      console.log(viewData,'vehicle_data')
      let rowDataList = []
      viewData.map((data, index) => {
        rowDataList.push({
          sno: index + 1,
          Creation_Date: data.created_at,
          vehicle_number: data.vehicle_number,
          Vendor_name: data.ifoods_Vendor_info.vendor_name,
          vehicle_capacity_id: data.vehicle_capacity_info.capacity + '-Feet',
          vehicle_body_type_id: data.vehicle_body_type_id,
          Vehicle_FC_Validity: data.fc_validity,
          Vehicle_Insurance_Validity: data.insurance_validity,
          ac_non_ac: data.ac_non_ac == 0 ? 'Non-AC' : 'AC',
          Assigned: data.vehicle_is_assigned === 1 ? '✔️' : '❌',
          Status: data.vehicle_status === 1 ? '✔️' : '❌',
          Action: (
            <div className="d-flex justify-content-space-between">
              <CButton
                size="sm"
                color={data.vehicle_status === 1 ? "success" : "danger"}
                shape="rounded"
                id={data.id}
                onClick={() => {
                  changeVehicleStatus(data.id)
                }}
                className="m-1"
              >
                {/* Delete */}
                <i className="fa fa-trash" aria-hidden="true"></i>
              </CButton>

              <Link to={data.vehicle_status === 1 ? `IfoodsVehicleMaster/${data.id}` : ''}>
                <CButton
                  disabled={data.vehicle_status === 1 ? false : true}
                  size="sm"
                  color={data.vehicle_status === 1 ? "success" : "secondary"}
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
      name: 'Vehicle Number',
      selector: (row) => row.vehicle_number,
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
      name: 'AC / Non-AC',
      selector: (row) => row.ac_non_ac,
      sortable: true,
      center: true,
    },
    {
      name: 'Insurance Valid To',
      selector: (row) => row.Vehicle_Insurance_Validity,
      sortable: true,
      center: true,
    },
    {
      name: 'FC Valid To',
      selector: (row) => row.Vehicle_FC_Validity,
      sortable: true,
      center: true,
    },
    {
      name: 'Assigned',
      selector: (row) => row.Assigned,
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
                  <Link className="text-white" to="/IfoodsVehicleMaster">
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

export default IfoodsVehicleMasterTable
