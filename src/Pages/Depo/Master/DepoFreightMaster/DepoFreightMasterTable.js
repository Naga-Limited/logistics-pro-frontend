import {
  CButton,
  CCard,
  CContainer,
  CCol,
  CRow,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CModal,
  CTooltip,
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
import DepoFreightMasterService from 'src/Service/Depo/Master/DepoFreightMasterService'
import * as XLSX from 'xlsx'
import FileSaver from 'file-saver'
import { getCurrentDateTime, GetDateTimeFormat } from '../../CommonMethods/CommonMethods'
import UserLoginMasterService from 'src/Service/Master/UserLoginMasterService'

const DepoFreightMasterTable = () => {

  const [fetch, setFetch] = useState(false)
  const [rowData, setRowData] = useState([])
  const [freightsData, setFreightsData] = useState([])
  const [mount, setMount] = useState(1)
  let viewData

  const getdata = (id) => {
    let dat = []
    freightsData.map((jj,hh)=>{
      console.log(jj)
      if(jj.id == id){
        dat.push(jj)
      }
    })
    return dat
  }

  const getOldLogInfo = (data) => {
    let data_new = [] 
    let temp = JSON.parse(data)
    let temp1 = data && temp && temp.length > 0 ? temp : []
    console.log(temp,'getOldLogInfo') 
    temp1.map((vk,kk)=>{
      data_new[kk] = vk 
    }) 
    console.log(data_new,'getOldLogInfo-data_new')
    return data_new
  }

  function changeFreightStatus(id) {

    let singleFrightData = getdata(id)
    console.log(singleFrightData,'singleFrightData')
    const formData = new FormData()
    if(singleFrightData.length == 0){
      toast.warning('Invalid Freight Data..')
      return false
    }
    
    formData.append('id', id) 
    
    formData.append('updated_by', user_id) 
    formData.append('before_delete_type', singleFrightData[0].status) 
    formData.append('after_delete_type', singleFrightData[0].status == 0 ? '1' : '0')
    formData.append('status', singleFrightData[0].status == 0 ? '1' : '0')
    
    console.log(singleFrightData,'singleFrightData')
    
    let current_time = getCurrentDateTime()
    let current_info = getOldLogInfo(singleFrightData[0].log_info)
    current_info.push({
      location_id: singleFrightData[0].location_id ? singleFrightData[0].location_id : '',
      route_id: singleFrightData[0].route_id ? singleFrightData[0].route_id : '',
      contractor_id: singleFrightData[0].contractor_id ? singleFrightData[0].contractor_id : '',
      freight_rate: singleFrightData[0].freight_rate ? singleFrightData[0].freight_rate : '', 
      type: singleFrightData[0].status == 0 ? '4' : '3' , /* 3 - inactive, 4 - reactive */
      user: user_id,
      time: current_time,
      remarks: singleFrightData[0].remarks ? singleFrightData[0].remarks : '',
    })
    formData.append('log_info', JSON.stringify(current_info))
    console.log(formData,'formData') 
    DepoFreightMasterService.softDeleteDepoFreight(formData).then((res)=>{
      // toast.success('Freight Status Updated Successfully!')
      // setMount((preState) => preState + 1)

      if (res.status == 200) {
        setFetch(true)
        toast.success('Freight Status Updated Successfully!')
        setMount((preState) => preState + 1)
        setTimeout(() => {
          window.location.reload(false)
        }, 1000)

      } else {
        setFetch(true)
        toast.warning('There is a problem occurs on Freight Status Updation..!')

        // setTimeout(() => {
        //   window.location.reload(false)
        // }, 1000)
      }
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
const [assignMigoModal, setAssignMigoModal] = useState(false)
 const [displayFreightLogData, setDisplayFreightLogData] = useState([])
let page_no = LogisticsProScreenNumberConstants.DepoModuleScreens.Depo_Freight_Master

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
    let dateTimeString = GetDateTimeFormat(1)
    let fileName='Depo_Freight_Master_Report_'+dateTimeString
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';
    const ws = XLSX.utils.json_to_sheet(rowData);
    const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], {type: fileType});
    FileSaver.saveAs(data, fileName + fileExtension);
  }

  const [userMasterData, setUserMasterdata] = useState([])

  useEffect(()=>{
    DepoFreightMasterService.getDepoFreights().then((response)=>{
      setFetch(true)
      viewData = response.data.data
      console.log(viewData,'freight_data')
      setFreightsData(viewData)
      let rowDataList = []
      viewData.map((data, index) => {
        rowDataList.push({
          sno: index + 1,
          Creation_Date: data.created_at,
          Location: data.location_info.location,
          Route_Name: data.route_info.route_name,
          Contractor_Name: data.contractor_info.contractor_name,
          Freight: Number(data.freight_rate),
          Status: data.status === 1 ? '✔️' : '❌',
          Action: (
            <div className="d-flex justify-content-space-between">
              <CButton 
                size="sm"
                className="m-1"
                color={'info'} 
                onClick={() => {
                    setAssignMigoModal(true)
                    // setDisplayVehicleNo(data.vehicle_no)
                    // setDisplayVehicleOSCount(data.over_speed_count)
                    // setDisplayVehicleInfo(data.vehicle_info)
                    // assignVehicleInfo(closure_info_data.json_data,data.vehicle_no)
                    // setShipmentTSToDelete(data.trip_sheet_info.trip_sheet_no)
                    assignFreightInfo(viewData,data.id)
                }}
              >
                 <i className="fa fa-eye" aria-hidden="true"></i>
              </CButton>
              <CButton
                size="sm"
                color={data.status === 1 ? "success" : "danger"}
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

              <Link to={data.status === 1 ? `DepoFreightMaster/${data.id}` : ''}>
                <CButton
                  disabled={data.status === 1 ? false : true}
                  size="sm"
                  color={data.status === 1 ? "success" : "secondary"}
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

    UserLoginMasterService.getUser().then((res) => {
       let viewData = res.data.data
       setUserMasterdata(viewData)
     },[])
  },[mount, freightsData.length == 0, userMasterData.length == 0])

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
      name: 'Depo Location',
      selector: (row) => row.Location,
      sortable: true,
      center: true,
    },
    {
      name: 'Route Name',
      selector: (row) => row.Route_Name,
      sortable: true,
      center: true,
    },
    {
      name: 'Contractor Name',
      selector: (row) => row.Contractor_Name,
      sortable: true,
      center: true,
    },
    {
      name: 'Freight Rate',
      selector: (row) => row.Freight,
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

  const statusFinder = (id) => {
    let statuses = ['','Created','Updated','In-Activated','Re-Activated']
    return statuses[id]
  }

  const userNameFinder = (id) => {
    console.log(id,'userNameFinder-id')
    console.log(userMasterData,'userNameFinder-data')
    let uname = ''
    if(id == 1){
      uname = 'Admin'
    } else {
      userMasterData.map((vv,kk)=>{
        if(vv.user_id == id){
          uname = vv.emp_name
        }
      })
    }
    return uname
  }

  const assignFreightInfo = (vdata,vno) => {
  
    console.log(vdata,'vdata')
    console.log(vno,'vno')
    let rowDataList = []

    const filterData = vdata.filter( 
        (data) => data.id == vno
      )
      console.log(filterData,'filterData')
    let needed_data = filterData[0].log_info ? JSON.parse(filterData[0].log_info) : []
      
      console.log(needed_data,'needed_data')
      needed_data.map((data, index) => { 
        rowDataList.push({
          sno: index + 1,
          // Location: data.location_id,
          Location: filterData[0].location_info.location,
          // Route_Name: data.route_id,
          Route_Name:filterData[0].route_info.route_name,
          // Contractor_Name: data.contractor_id,
          Contractor_Name: filterData[0].contractor_info.contractor_name,
          Freight: data.freight_rate,
          Status: statusFinder(data.type),   
          Time: data.time,   
          User: userNameFinder(data.user),   
          Remarks: data.remarks,   
        })
        
      })
      setDisplayFreightLogData(rowDataList)
    }

  const columns_child = [
    {
        name: 'S.No',
        selector: (row) => row.sno,
        sortable: true,
        center: true,
    },
    {
      name: 'Depo Location',
      selector: (row) => row.Location,
      sortable: true,
      center: true,
    },
    {
      name: 'Route Name',
      selector: (row) => row.Route_Name,
      sortable: true,
      center: true,
    },
    {
      name: 'Contractor Name',
      selector: (row) => row.Contractor_Name,
      sortable: true,
      center: true,
    },
    {
      name: 'Freight Rate',
      selector: (row) => row.Freight,
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
      name: 'Time',
      selector: (row) => row.Time,
      sortable: true,
      center: true,
    },
    {
      name: 'User',
      selector: (row) => row.User,
      sortable: true,
      center: true,
    },
    {
      name: 'Remarks',
      selector: (row) => row.Remarks,
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
                  <Link className="text-white" to="/DepoFreightMaster">
                    <CButton size="sm" color="warning" className="px-3 text-white" type="button">
                      NEW
                    </CButton>
                  </Link>
                  <CButton
                    size="sm"
                    color="success"
                    className="px-3 text-white"
                    onClick={(e) => {
                      exportToCSV()
                    }}
                  >
                    EXPORT
                  </CButton>
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
                <CModal
                  size="xl" 
                  backdrop="static"
                  scrollable
                  visible={assignMigoModal}
                  onClose={() => {
                      setAssignMigoModal(false) 
                      // setDisplayVehicleNo('')
                      // setDisplayVehicleOSCount('')
                      // setDisplayVehicleInfo({})
                  }}
                >
                  <CModalHeader>
                      <CModalTitle>{`Log Information`}</CModalTitle>
                  </CModalHeader>
                  <CModalBody>                       
                    
                    <CustomTable
                      columns={columns_child}
                      data={displayFreightLogData} 
                      fieldName={'Driver_Name'}
                      showSearchFilter={true}
                    />
                      
                  </CModalBody>
                  <CModalFooter>
                        
                    <CButton
                      color="primary"
                      onClick={() => {
                        setAssignMigoModal(false)
                        // setDisplayVehicleNo('')
                        // setDisplayVehicleOSCount('')
                        // setDisplayVehicleInfo({})
                        // setOtherExpenses('')
                      }}
                    >
                      Close
                    </CButton>
                  </CModalFooter>
                </CModal>
              </CCard>
            </>) : (<AccessDeniedComponent />
          )}
        </>
      )}
    </>
  )
}

export default DepoFreightMasterTable
