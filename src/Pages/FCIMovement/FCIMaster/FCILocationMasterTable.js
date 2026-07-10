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
import { Link, useNavigate } from 'react-router-dom'
import Loader from 'src/components/Loader'
import CustomTable from 'src/components/customComponent/CustomTable'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import AccessDeniedComponent from 'src/components/commoncomponent/AccessDeniedComponent'
import JavascriptInArrayComponent from 'src/components/commoncomponent/JavascriptInArrayComponent'
import * as LogisticsProScreenNumberConstants from 'src/components/constants/LogisticsProScreenNumberConstants'
import LocationApi from 'src/Service/SubMaster/LocationApi'
import RakeVendorMasterService from 'src/Service/RakeMovement/RakeMaster/RakeVendorMasterService'
import DefinitionsListApi from 'src/Service/Definitions/DefinitionsListApi'

const FCILocationMasterTable = () => {

  const [fetch, setFetch] = useState(false)
  const [rowData, setRowData] = useState([])
  const [mount, setMount] = useState(1)
  const [documentSrc, setDocumentSrc] = useState('')
  const [locationData, setLocationData] = useState([])
  let viewData = []

  function changeVendorStatus(id) {
    RakeVendorMasterService.deleteRakeVendor(id).then((res)=>{
      toast.success('Vendor Status Updated Successfully!')
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
  let page_no = LogisticsProScreenNumberConstants.FCIModule.FCI_Location_Master

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

  const changeLocationStatus = (deleteId) => {
    console.log(deleteId)
    DefinitionsListApi.deleteDefinitionsList(deleteId).then((res) => {
      setFetch(true) 
      if (res.status === 204) { 
        toast.success('Location List Status Updated Successfully!')
        setMount((preState) => preState + 1) 
      }
    })    
  }

  useEffect(()=>{

    /* section for getting FCI Location Master List For Location Name Display from database */
    DefinitionsListApi.visibleDefinitionsListByDefinition(34).then((response) => {
      console.log(response.data.data,'FCI Location Master List')
      setFetch(true)
      viewData = response.data.data
      console.log(viewData,'location_data')
      let rowDataList = []
      viewData.map((data, index) => {
        rowDataList.push({
          sno: index + 1,
          Creation_Date: data.created_at,
          Location_Code: data.definition_list_code,
          Location_Name: data.definition_list_name, 
          Location_Symbol: data.definition_list_alpha_code, 
          Status: data.definition_list_status == 1 ? '✔️' : '❌',
          Action: (
            <div className="d-flex justify-content-space-between">
              <CButton
                size="sm"
                color={data.definition_list_status == 1 ? "success" : "danger"}
                shape="rounded"
                id={data.definition_list_id}
                onClick={() => { 
                  setFetch(false)
                  changeLocationStatus(data.definition_list_id) 
                }}
                className="m-1"
              >
                {/* Delete */}
                <i className="fa fa-trash" aria-hidden="true"></i>
              </CButton>

              <Link to={data.definition_list_status === 1 ? `FCILocationMaster/${data.definition_list_id}` : ''}>
                <CButton
                  disabled={data.definition_list_status === 1 ? false : true}
                  size="sm"
                  color={data.definition_list_status === 1 ? "success" : "secondary"}
                  shape="rounded"
                  id={data.definition_list_id}
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
      name: 'Location Name',
      selector: (row) => row.Location_Name,
      sortable: true,
      center: true,
    },
    {
      name: 'Location Symbol',
      selector: (row) => row.Location_Symbol,
      sortable: true,
      center: true,
    },
    {
      name: 'Location Code',
      selector: (row) => row.Location_Code,
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
                  <Link className="text-white" to="/FCILocationMaster">
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
                    fieldName={'vehicle_Number'}
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

export default FCILocationMasterTable
