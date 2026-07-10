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
import AccessDeniedComponent from 'src/components/commoncomponent/AccessDeniedComponent'
import JavascriptInArrayComponent from 'src/components/commoncomponent/JavascriptInArrayComponent'
import * as LogisticsProScreenNumberConstants from 'src/components/constants/LogisticsProScreenNumberConstants'
import IfoodsRouteMasterService from 'src/Service/Ifoods/Master/IfoodsRouteMasterService'
import { GetDateTimeFormat } from '../CommonMethods/CommonMethods'
import FileSaver from 'file-saver'
import * as XLSX from 'xlsx';

const IfoodsRouteReport = () => {

  const [fetch, setFetch] = useState(false)
  const [rowData, setRowData] = useState([])
  const [mount, setMount] = useState(1)
  let viewData

  function changeRouteStatus(id) {
    IfoodsRouteMasterService.deleteIfoodsRoute(id).then((res)=>{
      toast.success('Route Status Updated Successfully!')
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
let page_no = LogisticsProScreenNumberConstants.IfoodsModuleScreens.Ifoods_Route_Master

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
const exportToCSV = () => {
  console.log(rowData,'exportCsvData')
  let dateTimeString = GetDateTimeFormat(1)
  let fileName='Ifoods_Route_Report_'+dateTimeString
  const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  const fileExtension = '.xlsx';
  const ws = XLSX.utils.json_to_sheet(rowData);
  const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
  const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const data = new Blob([excelBuffer], {type: fileType});
  FileSaver.saveAs(data, fileName + fileExtension);
}


  useEffect(()=>{
    IfoodsRouteMasterService.getIfoodsRoutes().then((response)=>{
      setFetch(true)
      viewData = response.data.data
      console.log(viewData,'route_data')
      let rowDataList = []
      viewData.map((data, index) => {
        rowDataList.push({
          sno: index + 1,
          Creation_Date: data.created_at,
        //  location_id: data.location_info ? data.location_info.location : '',
          Outlet: data.ifoods_Alloutlet_Info
            .filter((outlet) => outlet.outlet_name)
            .map((outlet) => `${outlet.outlet_name} - ${outlet.outlet_code}`)
            .join(', '),
          outlet_id: data.outlet_id ,
          route_type: data.route_type=== 1 ? 'Budget' : 'Actual',
          route_name: data.route_name,
          budgeted_km: data.budgeted_km,          
          Status: data.route_status === 1 ? 'Active' : 'In-Active',
        
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
      name: 'Created At',
      selector: (row) => row.Creation_Date,
      sortable: true,
      center: true,
    },
    {
      name: 'outlet',
      selector: (row) => row.Outlet,
      sortable: true,
      center: true,
    },
    {
      name: 'Route Type',
      selector: (row) => row.route_type,
      sortable: true,
      center: true,
    },
    {
      name: 'Route Name',
      selector: (row) => row.route_name,
      sortable: true,
      center: true,
    },
    {
      name: 'Budgeted KM',
      selector: (row) => row.budgeted_km,
      sortable: true,
      center: true,
    },
    {
      name: 'Status',
      selector: (row) => row.Status,
      sortable: true,
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
                 <CButton
                        size="lg-sm"
                        color="warning"
                        className="mx-3 px-3 text-white"
                        onClick={(e) => {
                            exportToCSV()
                          }}
                      >
                        Export
                      </CButton>
                </CCol>
              </CRow>
              <CCard>
                <CContainer>
                  <CustomTable
                    columns={columns}
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

export default IfoodsRouteReport
