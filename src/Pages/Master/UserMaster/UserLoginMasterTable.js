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
import React, { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import CustomSpanButton3 from 'src/components/customComponent/CustomSpanButton3'
import Loader from 'src/components/Loader'
import CustomTable from 'src/components/customComponent/CustomTable'
import UserLoginMasterService from 'src/Service/Master/UserLoginMasterService'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import * as XLSX from 'xlsx';
import FileSaver from 'file-saver'
import { GetDateTimeFormat, getCurrentDateTime } from 'src/Pages/Depo/CommonMethods/CommonMethods'
import DefinitionsListApi from 'src/Service/Definitions/DefinitionsListApi'
import JavascriptInArrayComponent from 'src/components/commoncomponent/JavascriptInArrayComponent'

const UserLoginMasterTable = () => {
  const [userphoto, setUserphoto] = useState(false)
  const [documentSrc, setDocumentSrc] = useState('')
  const [mount, setMount] = useState(1)
  const [fetch, setFetch] = useState(false)
  const [rowData, setRowData] = useState([])
  const [rowReportData, setRowReportData] = useState([])
  const [userPPData, setUserPPData] = useState([])
  const [pending, setPending] = useState(true)

  const [assignUserLogModal, setAssignUserLogModal] = useState(false)
  const [assignUserData, setAssignUserData] = useState([])

  let viewData
  const viewDataRef = useRef([])

  useEffect(() => {
    viewDataRef.current = viewData
  }, [viewData])

  const user_info_json = localStorage.getItem('user_info')
  const user_info = JSON.parse(user_info_json)
  const user_id = user_info.user_id

  const userNameFinder = (id) => {
    if (typeof id === 'string' && isNaN(id)) return id
    const targetId = Number(id)
    let uname = ''
    if (targetId === 1) {
      uname = 'Admin'
    } else {
      viewDataRef.current.map((user) => {
        if (Number(user.user_id) === targetId) {
          uname = user.emp_name
        }
      })
    }
    return uname || id || '--'
  }

  function handleViewDocuments(e, id, type) {
    switch (type) {
      case 'USER_PHOTO':
        {
          let singleUserInfo = viewData.filter((data) => data.user_id == id)
          setDocumentSrc(singleUserInfo[0].user_image)
          setUserphoto(true)
        }
        break
      default:
        return 0
    }
  }

  const changeUserStatus = (userid) => {
    let current_time = getCurrentDateTime()
    const singleUserData = viewDataRef.current.filter((data) => data.user_id == userid)

    if (!singleUserData || singleUserData.length === 0) {
      toast.error('User data not found!')
      return
    }

    let old_info = []
    try {
      old_info = singleUserData[0].log_info ? JSON.parse(singleUserData[0].log_info) : []
    } catch (error) {
      old_info = []
    }

    let current_status = singleUserData[0].user_status == 0 ? 1 : 0
    let location_ids = singleUserData[0].location_info.map(loc => loc.id).join(',')

    let current_info = [{
      user_id: singleUserData[0].user_auto_id,
      user_mobile_no: singleUserData[0].mobile_no,
      vehicle_types: singleUserData[0].vehicle_type_info
        ? singleUserData[0].vehicle_type_info.map(vt => vt.vehicle_type).join(', ')
        : '',
      incoterm_type: singleUserData[0].inco_term_info
        ? singleUserData[0].inco_term_info.map(it => it.def_list_name).join(', ')
        : '',
      location: singleUserData[0].location_info
        ? singleUserData[0].location_info.map(loc => loc.location_name).join(', ')
        : location_ids,
      type: 3,
      user: user_info.emp_name || user_id,
      time: current_time,
      remarks: '',
    }]

    let complete_info = [...old_info, ...current_info]
    let formData = new FormData()
    formData.append('id', singleUserData[0].user_id)
    formData.append('status', current_status)
    formData.append('log_info', JSON.stringify(complete_info))

    UserLoginMasterService.softDeleteUser(formData).then((res) => {
      if (res.status == 200 || res.status == 204) {
        toast.success('User Status Updated Successfully!')
        setMount((preState) => preState + 1)
      }
    })
  }

  const exportToCSV = () => {

    let dateTimeString = GetDateTimeFormat(1)
    let fileName='User_Master_Report_'+dateTimeString
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';
    const ws = XLSX.utils.json_to_sheet(rowData);
    const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], {type: fileType});
    FileSaver.saveAs(data, fileName + fileExtension);
  }

  const exportAccessToCSV = () => {

    let dateTimeString = GetDateTimeFormat(1)
    let fileName='User_Access_Report_'+dateTimeString
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';
    const ws = XLSX.utils.json_to_sheet(rowReportData);
    const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], {type: fileType});
    FileSaver.saveAs(data, fileName + fileExtension);
  }

  const exportAccessToCSV1 = () => {

    let emp_data = 



[{"employee_code":"20632","name":"Kalaivanan N  ","status":"Active","department":"Supply Chain Management","designation":"Assistant Manager - MIS","division":"NLFD"},{"employee_code":"50361","name":"Prabaharan Sekar  ","status":"Active","department":"Supply Chain Management","designation":"Junior Executive - Logistics","division":"NLCD 2"},{"employee_code":"40265","name":"Prabakaran  ","status":"Inactive","department":"Information Technology","designation":"Senior Executive - SAP","division":"NLSD"},{"employee_code":"20510","name":"Prabhaharan S  ","status":"Active","department":"Supply Chain Management","designation":"Assistant Manager - Wheat Movement","division":"NLFD"},{"employee_code":"40222","name":"Alwin Selvakumar P  ","status":"Active","department":"Information Technology","designation":"Executive - Php","division":"NLSD"},{"employee_code":"90028","name":"Arockiadass S  ","status":"Inactive","department":"Supply Chain Management","designation":"Assistant Manager - Packing","division":"NLFD"},{"employee_code":"20965","name":"Arul Viji C  ","status":"Inactive","department":"Maintenance","designation":"Executive - Maintenance","division":"NLFD"},{"employee_code":"10001","name":"Ashokkumar  S J  ","status":"Active","department":"Business Development","designation":"Regional Manager - Business Development","division":"NLCD 2"},{"employee_code":"20873","name":"Ayyappan P  ","status":"Active","department":"Finance And Accounts","designation":"Junior Executive - Accounts","division":"NLLD"},{"employee_code":"20976","name":"Balagurusamy G  ","status":"Active","department":"Business Development - Admin","designation":"Executive - Sales Order","division":"NLFD"},{"employee_code":"70277","name":"Beer Mohamathu  M","status":"Active","department":"Supply Chain Management","designation":"Junior Executive - Billing","division":"NLMD"},{"employee_code":"60472","name":"Karthick Raja  A","status":"Active","department":"Supply Chain Management","designation":"Junior Executive - Billing","division":"NLMD"},{"employee_code":"40282","name":"Karthik Rajan M  ","status":"Active","department":"Finance And Accounts","designation":"Executive - Audit","division":"NLSD"},{"employee_code":"20031","name":"Karthikeyan S  ","status":"Active","department":"Supply Chain Management","designation":"Senior Executive - Vehicle Sourcing","division":"NLLD"},{"employee_code":"20742","name":"Krishnaveni M  ","status":"Active","department":"Business Development - Admin","designation":"Assistant Manager - Business Development Admin","division":"NLIF"},{"employee_code":"26023","name":"Kumaresan R  ","status":"Active","department":"Business Development","designation":"Senior Customer Executive","division":"NLFD"},{"employee_code":"27070","name":"Mahamoorthy P  ","status":"Active","department":"Supply Chain Management","designation":"Senior Executive - Wheat Movement","division":"NLFA"},{"employee_code":"70016","name":"Maheswaran P  ","status":"Inactive","department":"Finance And Accounts","designation":"Manager - Accounts","division":"NLCD 2"},{"employee_code":"90132","name":"Malar Kannan K  ","status":"Inactive","department":"Supply Chain Management","designation":"Manager - Supply Chain Management","division":"NLIF"},{"employee_code":"40248","name":"Ragavendar R  ","status":"Active","department":"Information Technology","designation":"Junior Executive - SAP","division":"NLSD"},{"employee_code":"80127","name":"Rajkumar M  ","status":"Active","department":"Finance And Accounts","designation":"Manager - Accounts","division":"NLCD 2"},{"employee_code":"30066","name":"Ram Prateep  ","status":"Inactive","department":"Logistics","designation":"Executive - GPS Tracking","division":"NLLD"},{"employee_code":"90111","name":"Ramachandran  ","status":"Inactive","department":"Purchase","designation":"Executive - Purchase","division":"NLIF"},{"employee_code":"20730","name":"Ramakrishnan R  ","status":"Active","department":"Purchase","designation":"Senior Executive - Purchase","division":"NLFD"},{"employee_code":"25031","name":"Sahaya Velankanni J  ","status":"Inactive","department":"Finance And Accounts","designation":"Trainee - Accounts","division":"NLLD"},{"employee_code":"60747","name":"Thiruppathi  M","status":"Active","department":"Supply Chain Management","designation":"Executive - Accounts","division":"NLLD"},{"employee_code":"50402","name":"Vasantha Kumar P  ","status":"Inactive","department":"Supply Chain Management","designation":"Executive - Billing","division":"NLCD 2"},{"employee_code":"10290","name":"Viviliya Prabu nil P","status":"Active","department":"Supply Chain Management","designation":"Executive - Logistics","division":"NLCD 2"},{"employee_code":"20664","name":"Lakshmanan  ","status":"Inactive","department":"Sales and Distribution","designation":"Executive - Depot Operations","division":"NLFD"},{"employee_code":"20718","name":"Loganathan M  ","status":"Inactive","department":"Information Technology","designation":"Executive - Php","division":"NLSD"},{"employee_code":"30091","name":"Rajapandi Veerappan  ","status":"Active","department":"Business Development - Admin","designation":"Executive - GPS Tracking","division":"NLFD"},{"employee_code":"20956","name":"Rajasekaran V  ","status":"Active","department":"Finance And Accounts","designation":"Manager -  Finance  and  Accounts","division":"NLFD"},{"employee_code":"20859","name":"Rajesh Kanna S  ","status":"Active","department":"Business Development - Admin","designation":"Senior Executive - Sales and Distribution","division":"NLFD"},{"employee_code":"80093","name":"RameshB  ","status":"Active","department":"Finance And Accounts","designation":"Senior Manager - Accounts","division":"NLSD"},{"employee_code":"30043","name":"Rameshkumar N  ","status":"Active","department":"Finance And Accounts","designation":"Executive - Accounts","division":"NLLD"},{"employee_code":"20711","name":"Ruban S  ","status":"Inactive","department":"Business Development","designation":"Executive - Depot Operations","division":"NLFD"},{"employee_code":"30053","name":"Sabari Sankar G  ","status":"Active","department":"Supply Chain Management","designation":"Senior Executive - Vehicle Sourcing","division":"NLLD"},{"employee_code":"30063","name":"Sabarinathan  ","status":"Inactive","department":"Finance And Accounts","designation":"Junior Executive - Accounts","division":"NLLD"},{"employee_code":"70155","name":"Thiyagarajan V  ","status":"Active","department":"Maintenance","designation":"Supervisor - Maintenance","division":"NLIF"},{"employee_code":"21101","name":"Velmurugan M  ","status":"Active","department":"Finance And Accounts","designation":"Senior Executive - Accounts","division":"NLLD"},{"employee_code":"26085","name":"Veluchamy A  ","status":"Active","department":"Supply Chain Management","designation":"Executive - Logistics","division":"NLLD"},{"employee_code":"30072","name":"Vignesh Balaji  ","status":"Inactive","department":"Finance And Accounts","designation":"Junior Executive - Accounts","division":"NLLD"},{"employee_code":"40046","name":"Vincent Selvaraj R  ","status":"Active","department":"Information Technology","designation":"Senior Executive - Information Technology","division":"NLSD"},{"employee_code":"30089","name":"Arun Kumar M  ","status":"Inactive","department":"Finance And Accounts","designation":"Executive - Accounts","division":"NLLD"},{"employee_code":"50426","name":"Ashok A  ","status":"Inactive","department":"Purchase","designation":"Executive - Purchase","division":"NLCD 2"},{"employee_code":"50783","name":"Ashok Abraham Ravichandran  ","status":"Active","department":"Purchase","designation":"Executive - Purchase","division":"NLCD 2"},{"employee_code":"90138","name":"Ashok M  ","status":"Inactive","department":"Logistics","designation":"Executive - Despatch","division":"NLIF"},{"employee_code":"20334","name":"Balakrishnan C  ","status":"Active","department":"Production","designation":"Assistant Manager - Silo Operations","division":"NLFD"},{"employee_code":"20483","name":"Dineshkumar A  ","status":"Inactive","department":"Stores","designation":"Senior Executive - Stores","division":"NLFD"},{"employee_code":"90135","name":"Karthi M  ","status":"Active","department":"Logistics","designation":"Assistant Manager - PPIC","division":"NLIF"},{"employee_code":"40212","name":"Bharathi S  ","status":"Active","department":"Information Technology","designation":"Junior Executive - SAP","division":"NLSD"},{"employee_code":"30081","name":"Boobalan S  ","status":"Active","department":"Finance And Accounts","designation":"Assistant Manager - Accounts","division":"NLLD"},{"employee_code":"30086","name":"Samuvel A  ","status":"Inactive","department":"Finance And Accounts","designation":"Junior Executive - Accounts","division":"NLLD"},{"employee_code":"10455","name":"Yogesh V  ","status":"Active","department":"Purchase","designation":"Manager - Purchase","division":"NLFD"},{"employee_code":"11848","name":"Yosep Raja  ","status":"Inactive","department":null,"designation":null,"division":"NLCD 2"},{"employee_code":"90141","name":"Manojprabkar  ","status":"Inactive","department":"Production","designation":"Senior Manager - Plant Operations","division":"NLIF"},{"employee_code":"20621","name":"Maria Vanaraj S  ","status":"Active","department":"Information Technology","designation":"Executive - Php","division":"NLSD"},{"employee_code":"30080","name":"Saravanan  R","status":"Active","department":"Supply Chain Management","designation":"Executive - Vehicle Sourcing","division":"NLLD"},{"employee_code":"26024","name":"Saravanan B  ","status":"Active","department":"Maintenance","designation":"Senior Executive - Mechanical Maintenance","division":"NLFA"},{"employee_code":"30032","name":"Sarkkaraipandi  ","status":"Inactive","department":"Logistics","designation":"Executive - GPS Tracking","division":"NLLD"},{"employee_code":"30057","name":"Sasi M  ","status":"Inactive","department":"Supply Chain Management","designation":"Senior Executive - Mechanical Maintenance","division":"NLLD"},{"employee_code":"10321","name":"Sasirekha  S  ","status":"Inactive","department":"Information Technology","designation":"Assistant Manager - SAP","division":"NLSD"},{"employee_code":"25026","name":"Sathish Kumar S  ","status":"Inactive","department":"Supply Chain Management","designation":"Trainee - Accounts","division":"NLFD"},{"employee_code":"27051","name":"Dhuraipandi T  ","status":"Active","department":"Business Development - Admin","designation":"Executive - Billing","division":"NLFA"},{"employee_code":"20786","name":"Dinakaran K  ","status":"Active","department":"Supply Chain Management","designation":"Senior Executive - Wheat Movement","division":"NLFD"},{"employee_code":"30051","name":"Selvakumar P  ","status":"Active","department":"Supply Chain Management","designation":"Assistant General Manager - Logistics","division":"NLLD"},{"employee_code":"26018","name":"Edison Jerome  ","status":"Active","department":"Business Development - Admin","designation":"Junior Executive - Billing","division":"NLFD"},{"employee_code":"40210","name":"Elavarasan M  ","status":"Inactive","department":"Research And Development","designation":"Assistant Manager - Technologist","division":"NLRE"},{"employee_code":"10004","name":"Francis Robert  ","status":"Inactive","department":"Business Development","designation":"Executive - Business Development","division":"NLFD"},{"employee_code":"40289","name":"Ganaga Sababathi G  ","status":"Inactive","department":"Finance And Accounts","designation":"Executive - Audit","division":"NLSD"},{"employee_code":"90063","name":"Ganesan  ","status":"Active","department":"Finance And Accounts","designation":"Executive - Accounts","division":"NLSD"},{"employee_code":"20961","name":"Gayathri A  ","status":"Active","department":"Supply Chain Management","designation":"Junior Executive - Billing","division":"NLFD"},{"employee_code":"30049","name":"Murugaprakash  ","status":"Active","department":"Finance And Accounts","designation":"Assistant Manager - Accounts","division":"NLLD"},{"employee_code":"70028","name":"Murugesan R  ","status":"Active","department":"Supply Chain Management","designation":"Senior Executive - Logistics","division":"NLLD"},{"employee_code":"30018","name":"Murugesh  K G  ","status":"Active","department":"Finance And Accounts","designation":"Senior Executive - Accounts","division":"NLIF"},{"employee_code":"20564","name":"Muthu Manikandan A  ","status":"Active","department":"Business Development - Admin","designation":"Junior Executive - Depo Operations","division":"NLFD"},{"employee_code":"20694","name":"Muthukumar P  ","status":"Active","department":"Production","designation":"Supervisor - Feed Production","division":"NLFD"},{"employee_code":"90006","name":"Sivaraman B  ","status":"Active","department":"Supply Chain Management","designation":"Assistant Manager - Logistics","division":"NLLD"},{"employee_code":"26001","name":"Sivasakthimalan B  ","status":"Inactive","department":"Finance And Accounts","designation":"Assistant Manager - Accounts","division":"NLIF"},{"employee_code":"20995","name":"Gokulakannan N  ","status":"Inactive","department":"Finance And Accounts","designation":"Executive - Accounts","division":"NLFD"},{"employee_code":"50545","name":"Naga Arjun SG S G","status":"Active","department":"Stores","designation":"Senior Executive - Stores","division":"NLCD 2"},{"employee_code":"30082","name":"Nagaraj M  ","status":"Active","department":"Finance And Accounts","designation":"Junior Executive - Accounts","division":"NLLD"},{"employee_code":"30087","name":"Soundarapandi  ","status":"Active","department":"Business Development - Admin","designation":"Executive - GPS Tracking","division":"NLFD"},{"employee_code":"50725","name":"Srinivasaperumal  ","status":"Inactive","department":"Supply Chain Management","designation":"Executive - Billing","division":"NLCD 2"},{"employee_code":"20486","name":"Gowtham T  ","status":"Active","department":"Business Development","designation":"Senior Customer Executive","division":"NLFD"},{"employee_code":"60515","name":"Gowtham Velraj  V","status":"Active","department":"Finance And Accounts","designation":"Junior Executive - Accounts","division":"NLMD"},{"employee_code":"60104","name":"Grazy  A","status":"Active","department":"Information Technology","designation":"Junior Executive - SAP","division":"NLSD"},{"employee_code":"50089","name":"Stephen Raj M  ","status":"Inactive","department":"Supply Chain Management","designation":"Executive - Logistics","division":"NLCD 2"},{"employee_code":"20261","name":"Sudeswaran P  ","status":"Active","department":"Stores","designation":"Assistant Manager - Stores","division":"NLFD"},{"employee_code":"60810","name":"Sudhakar  S","status":"Active","department":"Supply Chain Management","designation":"Executive - Wheat Movement","division":"NLFD"},{"employee_code":"27030","name":"Pandi G  ","status":"Active","department":"Business Development - Admin","designation":"Executive - Billing","division":"NLFA"},{"employee_code":"26104","name":"Sudharsan H  ","status":"Active","department":"Business Development - Admin","designation":"Junior Executive - Depo Operations","division":"NLFD"},{"employee_code":"26108","name":"Janakiram B  ","status":"Active","department":"Business Development - Admin","designation":"Junior Executive - Billing","division":"NLFD"},{"employee_code":"20022","name":"Jayakumar T  ","status":"Inactive","department":"Business Development","designation":"Manager - Business Development","division":"NLFD"},{"employee_code":"10204","name":"Jeya Krishnan  R  ","status":"Active","department":"Finance And Accounts","designation":"Senior Executive - Billing","division":"NLCD 2"},{"employee_code":"50317","name":"Partha Sarathi S V  ","status":"Inactive","department":"Research And Development","designation":"Assistant Manager - Process Engineer","division":"NLRE"},{"employee_code":"90139","name":"Thamaraiselvan Sankaran  ","status":"Active","department":"Finance And Accounts","designation":"Senior Manager - Accounts","division":"NLIF"},{"employee_code":"30069","name":"Manikandan R  ","status":"Inactive","department":"Supply Chain Management","designation":"Executive - GPS Tracking","division":"NLLD"},{"employee_code":"90065","name":"Manoj  ","status":"Inactive","department":"Logistics","designation":"Executive - Despatch","division":"NLIF"},{"employee_code":"60654","name":"Manoj  S","status":"Active","department":"Logistics","designation":"Executive - Despatch","division":"NLIF"},{"employee_code":"30076","name":"Manoj Prabakar  ","status":"Inactive","department":"Finance And Accounts","designation":"Junior Executive - Accounts","division":"NLLD"},{"employee_code":"70167","name":"Santha Prabhu V  ","status":"Active","department":"Finance And Accounts","designation":"Senior Executive - Accounts","division":"NLSD"},{"employee_code":"20744","name":"Santhosh Kumar P  ","status":"Inactive","department":"Supply Chain Management","designation":"Junior Executive - Wheat Movement","division":"NLFD"},{"employee_code":"25023","name":"Sarath Kumar N  ","status":"Inactive","department":"Supply Chain Management","designation":"Trainee - Coordinator Despatch","division":"NLLD"}]

    let dateTimeString = GetDateTimeFormat(1)
    let fileName='Employee_Report'+dateTimeString
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';
    const ws = XLSX.utils.json_to_sheet(emp_data);
    const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], {type: fileType});
    FileSaver.saveAs(data, fileName + fileExtension);
  }

  useEffect(() => {
    DefinitionsListApi.visibleDefinitionsListByDefinition(8).then((response) => {
      let tableData = response.data.data
      console.log(tableData,'setUserPPData')
      const filterData = tableData.filter((data) => (data.definition_list_status == 1))
      setUserPPData(filterData)
    })

  },[])

  useEffect(() => {    
    UserLoginMasterService.getUser().then((res) => {
      setFetch(true)
      viewData = res.data.data
      viewDataRef.current = res.data.data
      console.log(viewData,'user_details')
      console.log(userPPData,'user_details-userPPData')
      let rowDataList = []
      let rowReportDataList = []
      viewData.map((data, index) => {
        let data_page_permissions_array = data.page_permissions ? data.page_permissions : []
        data_page_permissions_array.map((vk1,kk1)=>{
          let page_name = ''
          userPPData.map((vk,kk)=>{
            if(vk.definition_list_code == vk1){ 
              page_name = vk.definition_list_name 
            }
          })
          rowReportDataList.push({
            sno: index + 1,
            Creation_Date: data.created_at,
            Emp_Id: data.empid,
            emp_name: data.emp_name,
            User_Name: data.username,
            Division: data.division_info.division,
            Department: data.department_info.department,
            Designation: data.designation_info.designation,
            Page_Name: page_name,
            // OverAll_Screen_Page_Permissions : ppInfoFinder(data,1),
            // Master_Screen_Page_Permissions : ppInfoFinderTypeWise(data,1),
            // Transaction_Screen_Page_Permissions : ppInfoFinderTypeWise(data,2),
            // Report_Screen_Page_Permissions : ppInfoFinderTypeWise(data,3),
            AssignedVechileType: data.vehicle_types,
            Location: data.location_info
              .filter((location) => location.location_name)
              .map((location) => `${location.location_name} - ${location.location_code}`)
              .join(', '),
              AssignedVechileType: data.vehicle_type_info
              .filter((vehicle_types) => vehicle_types.vehicle_type)
              .map((vehicle_types) => vehicle_types.vehicle_type)
              .join(', '),
            User_ID: data.user_auto_id,
            User_Mobile_Number: data.mobile_no,
            User_Mail_ID: data.email,
            User_Mail_ID: data.email,
            User_Photo: (
              <CustomSpanButton3
                handleViewDocuments={handleViewDocuments}
                Id={data.user_id}
                documentType={'USER_PHOTO'}
              />
            ),
            Status: data.user_status === 1 ? '✔️' : '❌',
            Status_String: data.user_status === 1 ? 'Active' : 'In Active',
            Action: (
              <div className="d-flex justify-content-space-between">
                <CButton
                  size="sm"
                  color="danger"
                  shape="rounded"
                  id={data.id}
                  onClick={() => {
                    changeUserStatus(data.user_id)
                  }}
                  className="m-1"
                >
                  {/* Delete */}
                  <i className="fa fa-trash" aria-hidden="true"></i>
                </CButton>
                <Link to={data.user_status === 1 ? `UserLoginMasterEdit/${data.user_id}` : ''}>
                  <CButton
                    disabled={data.user_status === 1 ? false : true}
                    size="sm"
                    color="secondary"
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
        rowDataList.push({
          sno: index + 1,
          Creation_Date: data.created_at,
          Emp_Id: data.empid,
          emp_name: data.emp_name,
          User_Name: data.username,
          Division: data.division_info.division,
          Department: data.department_info.department,
          Designation: data.designation_info.designation, 
          // OverAll_Screen_Page_Permissions : ppInfoFinder(data,1),
          // Master_Screen_Page_Permissions : ppInfoFinderTypeWise(data,1),
          // Transaction_Screen_Page_Permissions : ppInfoFinderTypeWise(data,2),
          // Report_Screen_Page_Permissions : ppInfoFinderTypeWise(data,3),
          AssignedVechileType: data.vehicle_types,
          Location: data.location_info
            .filter((location) => location.location_name)
            .map((location) => `${location.location_name} - ${location.location_code}`)
            .join(', '),
            AssignedVechileType: data.vehicle_type_info
            .filter((vehicle_types) => vehicle_types.vehicle_type)
            .map((vehicle_types) => vehicle_types.vehicle_type)
            .join(', '),
          User_ID: data.user_auto_id,
          User_Mobile_Number: data.mobile_no,
          User_Mail_ID: data.email,
          User_Mail_ID: data.email,
          User_Photo: (
            <CustomSpanButton3
              handleViewDocuments={handleViewDocuments}
              Id={data.user_id}
              documentType={'USER_PHOTO'}
            />
          ),
          Status: data.user_status === 1 ? '✔️' : '❌',
          Status_String: data.user_status === 1 ? 'Active' : 'In Active',
          Login_Status: data.user_login_status === 1 ? '✔️' : '❌',
          Login_Status_String: data.user_login_status === 1 ? 'Active' : 'In Active',
          Last_Login_Time: data.login_time,
          Last_Logout_Time: data.logout_time,
          Action: (
            <div className="d-flex justify-content-space-between">
              <CButton
                size="sm"
                className="m-1"
                color={'info'}
                onClick={() => {
                  setAssignUserLogModal(true)
                  assignUserLogInfo(data.user_id)
                }}
              >
                <i className="fa fa-eye" aria-hidden="true"></i>
              </CButton>
              <CButton
                size="sm"
                color={data.user_status === 1 ? 'success' : 'danger'}
                shape="rounded"
                id={data.id}
                onClick={() => {
                  changeUserStatus(data.user_id)
                }}
                className="m-1"
              >
                {/* Delete */}
                <i className="fa fa-trash" aria-hidden="true"></i>
              </CButton>
              <Link to={data.user_status === 1 ? `UserLoginMasterEdit/${data.user_id}` : ''}>
                <CButton
                  disabled={data.user_status === 1 ? false : true}
                  size="sm"
                  color="secondary"
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
      setPending(false)
      setRowData(rowDataList)
      setRowReportData(rowReportDataList)
    })
  }, [mount,userPPData])

const report_screen_array = [3,5,7,9,13,15,17,19,21,25,27,31,33,35,37,46,47,48,55,56,67,68,80,81,70,73,87,88,89,90,91,92,122,123,124,125,126,137,138,139,140,99,148,149]
const transcation_screen_array = [1,2,4,6,8,10,11,12,14,16,18,20,22,23,24,26,261,28,29,30,32,321,34,36,39,40,41,42,43,44,45,49,50,51,52,53,54,63,64,65,66,69,71,72,74,75,76,77,78,79,82,83,84,85,86,96,97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,127,128,129,130,131,132,133,134,135,136,141,143,144,145,146,147,150]
const master_screen_array = [38,48,57,58,59,60,61,62,93,94,95,116,117,118,119,120,121,96,142]

  const ppInfoFinderTypeWise = (data,type) => {
    console.log(data,'ppInfoFinderTypeWise-data')
    let pp_info_array = [] 
    let pp_array = data.page_permissions ? data.page_permissions : []
    if(type === 1){
      pp_array.map((vk1,kk1)=>{      
        if(JavascriptInArrayComponent(vk1,master_screen_array)){          
          userPPData.map((vk,kk)=>{
            if(vk.definition_list_code == vk1){
              let pp = {}
              pp.pp_name = vk.definition_list_name
              pp.pp_code = vk.definition_list_code
              pp.pp_id = vk.definition_list_id
              pp_info_array.push(pp) 
            }
          })
        }       
      })
    } else if(type === 2){
      pp_array.map((vk1,kk1)=>{      
        if(JavascriptInArrayComponent(vk1,transcation_screen_array)){          
          userPPData.map((vk,kk)=>{
            if(vk.definition_list_code == vk1){
              let pp = {}
              pp.pp_name = vk.definition_list_name
              pp.pp_code = vk.definition_list_code
              pp.pp_id = vk.definition_list_id
              pp_info_array.push(pp) 
            }
          })
        }       
      })
    } else if(type === 3){
      pp_array.map((vk1,kk1)=>{      
        if(JavascriptInArrayComponent(vk1,report_screen_array)){          
          userPPData.map((vk,kk)=>{
            if(vk.definition_list_code == vk1){
              let pp = {}
              pp.pp_name = vk.definition_list_name
              pp.pp_code = vk.definition_list_code
              pp.pp_id = vk.definition_list_id
              pp_info_array.push(pp) 
            }
          })
        }       
      })
    } else {

    }
    

    let pp_string = pp_info_array
        .filter((pageP) => pageP.pp_name)       
        .map((pagewP) => `${pagewP.pp_name}`)
        .join(', ')
    console.log(pp_string,'pp_string') 
    if(pp_string == ''){
      return '-'
    }
    return pp_string
  }
  const ppInfoFinder = (data,type) => {
    console.log(data,'ppInfoFinder')
    console.log(userPPData,'ppInfoFinderLP')
    let pp_info_array = [] 
    let pp_array = data.page_permissions
    userPPData.map((vk,kk)=>{
      if(JavascriptInArrayComponent(vk.definition_list_code,pp_array)){
        let pp = {}
        pp.pp_name = vk.definition_list_name
        pp.pp_code = vk.definition_list_code
        pp.pp_id = vk.definition_list_id
        pp_info_array.push(pp) 
      }
    })
    console.log(pp_info_array,'pp_info_array') 
     
    let pp_string = pp_info_array
        .filter((pageP) => pageP.pp_name)       
        .map((pagewP) => `${pagewP.pp_name}`)
        .join(', ')
    console.log(pp_string,'pp_string') 
     // .map((pageP) => `${pageP.pp_code} - ${pageP.pp_name}`)

    if(pp_string == ''){
      return '-'
    }
    if(type == 1){      
      return pp_string
    } else {
      return pp_info_array
    } 
  }

  const statusFinder = (type) => {
    switch (type) {
      case 1:
        return 'Creation'
      case 2:
        return 'Updation'
      case 3:
        return 'Active Status Changed'
      default:
        return 'Unknown'
    }
  }

  const assignUserLogInfo = (userid) => {
    let rowDataList = []
    const filterData = viewDataRef.current.filter((data) => data.user_id == userid)
    let needed_data = []
    try {
      needed_data = filterData[0].log_info ? JSON.parse(filterData[0].log_info) : []
    } catch (error) {
      needed_data = []
    }
    // Exclude creation logs - show empty table by default
    needed_data = needed_data.filter((data) => data.type !== 1)

    needed_data.map((data, index) => {
      rowDataList.push({
        sno: index + 1,
        user_id: data.user_id ? data.user_id : '-',
        user_mobile_no: data.user_mobile_no ? data.user_mobile_no : '-',
        vehicle_types: data.vehicle_types ? data.vehicle_types : '-',
        incoterm_type: data.incoterm_type ? data.incoterm_type : '-',
        location: data.location ? data.location : '-',
        Status: statusFinder(data.type),
        Time: data.time,
        User: userNameFinder(data.user),
      })
    })
    setAssignUserData(rowDataList)
  }

  const columns_log = [
    { name: 'S.No', selector: (row) => row.sno, width: '70px', sortable: true, center: true },
    { name: 'User ID', selector: (row) => row.user_id, sortable: true, center: true },
    { name: 'User Mobile No', selector: (row) => row.user_mobile_no, sortable: true, center: true },
    { name: 'Assigned Vehicle Type', selector: (row) => row.vehicle_types, sortable: true, center: true },
    { name: 'Incoterm Type', selector: (row) => row.incoterm_type, sortable: true, center: true },
    { name: 'Location', selector: (row) => row.location, sortable: true, center: true },
    { name: 'Status', selector: (row) => row.Status, sortable: true, center: true },
    { name: 'Time', selector: (row) => row.Time, sortable: true, center: true },
    { name: 'User', selector: (row) => row.User, sortable: true, center: true },
  ]

  const columns = [
    {
      name: 'S.No',
      selector: (row) => row.sno,
      sortable: true,
      center: true,
    },

    {
      name: 'Empolyee Name',
      selector: (row) => row.emp_name,
      sortable: true,
      center: true,
    },
        {
      name: 'Empolyee Code',
      selector: (row) => row.Emp_Id,
      sortable: true,
      center: true,
    },

    {
      name: 'User Name',
      selector: (row) => row.User_Name,
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
      name: 'Department',
      selector: (row) => row.Department,
      sortable: true,
      center: true,
    },
    {
      name: 'Designation',
      selector: (row) => row.Designation,
      sortable: true,
      center: true,
    },
    {
      name: 'Assgined Vehicle Type',
      selector: (row) => row.AssignedVechileType,
      sortable: true,
      center: true,
    },
    {
      name: 'Location',
      selector: (row) => row.Location,
      sortable: true,
      center: true,
    },
    {
      name: 'User ID',
      selector: (row) => row.User_ID,
      sortable: true,
      center: true,
    },
    {
      name: ' User Mobile Number',
      selector: (row) => row.User_Mobile_Number,
      sortable: true,
      center: true,
    },
    {
      name: 'User Mail ID',
      selector: (row) => row.User_Mail_ID,
      sortable: true,
      center: true,
    },
    {
      name: 'User Photo',
      selector: (row) => row.User_Photo,
      center: true,
    },
    {
      name: 'Creation Date',
      selector: (row) => row.Creation_Date,
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

  return (
    <>
      {!fetch && <Loader />}
      {fetch && (
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
                size="md"
                color="warning"
                // disabled={enableSubmit}
                className="px-3 text-white"
                type="submit"
              >
                <Link className="text-white" to="/UserLoginMaster">
                  NEW
                </Link>
              </CButton>
              <CButton
                size="sm"
                color="primary"
                className="px-3 text-white"
                onClick={(e) => {
                  exportAccessToCSV()
                }}
              >
                Screen Access Report
              </CButton>
              {/* {user_id == 1 && (
                <CButton
                  size="sm"
                  color="primary"
                  className="px-3 text-white"
                  onClick={(e) => {
                    exportAccessToCSV1()
                  }}
                >
                  Employee Report
                </CButton>
              )} */}
              <CButton
                size="sm"
                color="success"
                className="px-3 text-white"
                onClick={(e) => {
                  exportToCSV()
                }}
              >
                User Report
              </CButton>
            </CCol>
          </CRow>
          <CCard>
            <CContainer>
              <CustomTable
                columns={columns}
                data={rowData}
                pending={pending}
                showSearchFilter={true}
              />
              <hr></hr>
            </CContainer>
            {/* Model for User Photo  */}
            <CModal visible={userphoto} onClose={() => setUserphoto(false)}>
              <CModalHeader>
                <CModalTitle>User Photo</CModalTitle>
              </CModalHeader>
              <CModalBody>
                <CCardImage orientation="top" src={documentSrc} />
              </CModalBody>
              <CModalFooter>
                <CButton color="secondary" onClick={() => setUserphoto(false)}>
                  Close
                </CButton>
              </CModalFooter>
            </CModal>
            {/* Model for User Photo  */}

            {/* Log Information Modal */}
            <CModal
              size="xl"
              visible={assignUserLogModal}
              onClose={() => setAssignUserLogModal(false)}
            >
              <CModalHeader>
                <CModalTitle>Log Information</CModalTitle>
              </CModalHeader>
              <CModalBody>
                <CRow>
                  <CCol md={12}>
                    <CustomTable columns={columns_log} data={assignUserData} />
                  </CCol>
                </CRow>
              </CModalBody>
              <CModalFooter>
                <CButton color="secondary" onClick={() => setAssignUserLogModal(false)}>
                  Close
                </CButton>
              </CModalFooter>
            </CModal>
            {/* Log Information Modal */}
          </CCard>
        </>
      )}
    </>
  )
}

export default UserLoginMasterTable
