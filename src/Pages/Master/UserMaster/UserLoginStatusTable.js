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
  CWidgetStatsA,
  CInputGroup,
  CInputGroupText,
  CFormInput,
  CCardBody,
} from '@coreui/react'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import Loader from 'src/components/Loader'
import CustomTable from 'src/components/customComponent/CustomTable'
import UserLoginMasterService from 'src/Service/Master/UserLoginMasterService'
import 'react-toastify/dist/ReactToastify.css'
import CIcon from '@coreui/icons-react'
import { cilArrowBottom, cilArrowTop, cilOptions } from '@coreui/icons'

const UserLoginStatusTable = () => {

  const [mount, setMount] = useState(1)
  const [fetch, setFetch] = useState(false)
  const [rowData, setRowData] = useState([])
  const [pending, setPending] = useState(true)
  const [opencount, setOpencount] = useState(false)

  let viewData


  useEffect(() => {
    UserLoginMasterService.getUserLoginDetails().then((res) => {
      console.log(res.data)
      setOpencount(res.data)
      })
  },[])

  useEffect(() => {
    UserLoginMasterService.getUser().then((res) => {
      setFetch(true)
      viewData = res.data.data
      console.log(viewData)
      let rowDataList = []
      viewData.map((data, index) => {
        rowDataList.push({
          sno: index + 1,
          Creation_Date: data.created_at,
          Emp_Id: data.empid,
          Emp_name: data.emp_name,
          User_Name: data.username,
          Division: data.division_info.division,
          Department: data.department_info.department,
          Designation: data.designation_info.designation,

          Location: data.location_info
            .filter((location) => location.location_name)
            .map((location) => `${location.location_name} - ${location.location_code}`)
            .join(', '),
            AssignedVechileType: data.vehicle_type_info
            .filter((vehicle_types) => vehicle_types.vehicle_type)
            .map((vehicle_types) => vehicle_types.vehicle_type)
            .join(', '),
          User_Mobile_Number: data.mobile_no,
          User_Mail_ID: data.email,
          Status: data.user_status === 1 ? '✔️' : '❌',
          User_LogOut_Time: data.logout_time,
          LoginStatus: data.user_login_status === 1 ? '✔️' : '❌',

        })
      })
      setPending(false)
      setRowData(rowDataList)
    })
  }, [mount])

  const columns = [
    {
      name: 'S.No',
      selector: (row) => row.sno,
      sortable: true,
      center: true,
    },
     {
      name: 'Empolyee Name',
      selector: (row) => row.Emp_name,
      sortable: true,
      center: true,
    },
    {
      name: 'Empolyee Code',
      selector: (row) => row.Emp_Id,
      sortable: true,
      center: true,
    },

    // {
    //   name: 'User Name',
    //   selector: (row) => row.User_Name,
    //   sortable: true,
    //   center: true,
    // },
    {
      name: 'Division',
      selector: (row) => row.Division,
      sortable: true,
      center: true,
    },
    // {
    //   name: 'Location',
    //   selector: (row) => row.Location,
    //   sortable: true,
    //   center: true,
    // },

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
      name: 'User Master Status',
      selector: (row) => row.Status,
      sortable: true,
      center: true,
    },
    {
      name: 'User Logout Date&Time',
      selector: (row) => row.User_LogOut_Time,
      sortable: true,
      center: true,
    },
    {
      name: 'Session Status',
      selector: (row) => row.LoginStatus,
      sortable: true,
      center: true,
    },

  ]

  return (
    <>
      {!fetch && <Loader />}
      {fetch && (
        <>

          <CCard>
          <CCardBody>
          <CRow>
          <CCol sm={6} lg={4}>
            <CWidgetStatsA
              className="mb-1"
              // color="#ffa500"
              style={{paddingBottom:15,backgroundColor: '#ff66cc'}}
              value={
                <>
                <div>
                <CInputGroup style={{color:'white'}}>
                <CInputGroupText style={{
                        backgroundColor: '#ff66cc',
                        color: 'white',
                      }}>
                Session Users Count-
                <CFormInput
                value={opencount.Total_Login_Count}
                            style={{color:'white',backgroundColor:'#ff66cc',border:'#4d3227'}}/>
                <span>(<CIcon icon={cilArrowBottom} />)</span>
                </CInputGroupText>
                </CInputGroup>
                <CInputGroup>
                <CInputGroupText style={{
                        backgroundColor: '#ff66cc',
                        color: 'white',
                        width: '75%',
                      }}>Active Session</CInputGroupText><CFormInput readOnly
                      value={opencount.User_Login_Count}
                      style={{color:'white',backgroundColor:'#ff66cc'}}/>
                </CInputGroup>
                <CInputGroup>
                <CInputGroupText style={{
                        backgroundColor: '#ff66cc',
                        color: 'white',
                        width: '75%',
                      }}>Inactive Session </CInputGroupText><CFormInput readOnly
                      value={opencount.User_UnLogin_Count}
                      style={{color:'white',backgroundColor:'#ff66cc'}}/>
                </CInputGroup>
                </div>
                </>
              }
            />
          </CCol>
          <CCol sm={6} lg={4}>
            <CWidgetStatsA
              className="mb-1"
              // color="#ffa500"
              style={{paddingBottom:15,backgroundColor: 'dodgerblue'}}
              value={
                <>
                <div>
                <CInputGroup style={{color:'white'}}>
                <CInputGroupText style={{
                        backgroundColor: 'dodgerblue',
                        color: 'white',
                      }}>
                 User Master Count -
                <CFormInput
                value={opencount.Total_User_Count}
                            style={{color:'white',backgroundColor:'dodgerblue',border:'#4d3227'}}/>
                <span>(<CIcon icon={cilArrowBottom} />)</span>
                </CInputGroupText>
                </CInputGroup>
                <CInputGroup>
                <CInputGroupText style={{
                        backgroundColor: 'dodgerblue',
                        color: 'white',
                        width: '75%',
                      }}>Active Users</CInputGroupText><CFormInput readOnly
                      value={opencount.User_Active_Count}
                      style={{color:'white',backgroundColor:'dodgerblue'}}/>
                </CInputGroup>
                <CInputGroup>
                <CInputGroupText style={{
                        backgroundColor: 'dodgerblue',
                        color: 'white',
                        width: '75%',
                      }}>Inactive Users </CInputGroupText><CFormInput readOnly
                      value={opencount.User_Inactive_Count}
                      style={{color:'white',backgroundColor:'dodgerblue'}}/>
                </CInputGroup>
                </div>
                </>
              }
            />
          </CCol>
          </CRow>
          <hr/>
            <CContainer>
              <CustomTable
                columns={columns}
                data={rowData}
                pending={pending}
                showSearchFilter={true}
              />
              <hr></hr>
            </CContainer>
            </CCardBody>
          </CCard>
        </>
      )}
    </>
  )
}

export default UserLoginStatusTable
