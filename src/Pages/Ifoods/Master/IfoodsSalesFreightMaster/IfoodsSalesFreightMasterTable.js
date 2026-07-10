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
import IfoodsSalesfreightMasterService from 'src/Service/Ifoods/Master/IfoodsSalesfreightMasterService'

const IfoodsSalesFreightMasterTable = () => {

  const [fetch, setFetch] = useState(false)
  const [rowData, setRowData] = useState([])
  const [mount, setMount] = useState(1)
  let viewData

  function changeFreightStatus(id) {
    IfoodsSalesfreightMasterService.deleteIfoodsSalesfreight(id).then((res)=>{
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
let page_no = LogisticsProScreenNumberConstants.IfoodsModuleScreens.Ifoods_SalesFreight_Master

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
    IfoodsSalesfreightMasterService.getIfoodsSalesfreight().then((response)=>{
      setFetch(true)
      viewData = response.data.data
      console.log(viewData,'Freight_data')
      let rowDataList = []
      viewData.map((data, index) => {
        rowDataList.push({
          sno: index + 1,
          Creation_Date: data.created_at,
          payment_type: data.payment_type == 1 ? 'Budget' : 'Actual',
          budget_km: data.budget_km,
          budget_km_freight: data.budget_km_freight,
          freight_per_km: data.freight_per_km,
          Vendor_name: data.ifoods_Vendor_info.vendor_name,
          Status: data.freight_status == 1 ? '✔️' : '❌',
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

              <Link to={data.freight_status === 1 ? `IfoodsSalesFreightMaster/${data.id}` : ''}>
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
      name: 'Payment Type',
      selector: (row) => row.payment_type,
      sortable: true,
      center: true,
    },
    {
      name: 'Budget KM',
      selector: (row) => row.budget_km,
      sortable: true,
      center: true,
    },
    {
      name: 'Budget KM Freight',
      selector: (row) => row.budget_km_freight,
      sortable: true,
      center: true,
    },
    {
      name: 'Freight Per KM',
      selector: (row) => row.freight_per_km,
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
                  <Link className="text-white" to="/IfoodsSalesFreightMaster">
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

export default IfoodsSalesFreightMasterTable
