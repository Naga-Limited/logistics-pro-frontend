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
  CModalFooter,
} from '@coreui/react'
import React, { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import CustomTable from 'src/components/customComponent/CustomTable'
import DieselVendorMasterService from 'src/Service/Master/DieselVendorMasterService'
import { getCurrentDateTime } from 'src/Pages/Depo/CommonMethods/CommonMethods'
import UserLoginMasterService from 'src/Service/Master/UserLoginMasterService'

const DieselVendorMasterTable = () => {
  const [rowData, setRowData] = useState([])
  const [mount, setMount] = useState(1)
  const [pending, setPending] = useState(true)

  const [assignDieselVendorLogModal, setAssignDieselVendorLogModal] = useState(false)
  const [assignDieselVendorData, setAssignDieselVendorData] = useState([])
  const [userMasterData, setUserMasterData] = useState([])

  /*================== User Id Fetch ======================*/
  const user_info_json = localStorage.getItem('user_info')
  const user_info = user_info_json ? JSON.parse(user_info_json) : null
  const user_id = user_info && user_info.user_id ? user_info.user_id : 0
  /*================== User Id Fetch ======================*/

  const [viewData, setViewData] = useState([])
  const viewDataRef = useRef([])

  useEffect(() => {
    viewDataRef.current = viewData
  }, [viewData])

  const userNameFinder = (id) => {
    if (typeof id === 'string' && isNaN(id)) return id
    const targetId = Number(id)
    let uname = ''
    if (targetId === 1) {
      uname = 'Admin'
    } else {
      userMasterData.map((user) => {
        if (Number(user.user_id) === targetId) {
          uname = user.emp_name
        }
      })
    }
    return uname || id || '--'
  }

  function changeDieselVendorStatus(id) {
    let current_time = getCurrentDateTime()
    const singleVendorData = viewDataRef.current.filter((data) => data.diesel_vendor_id == id)

    if (!singleVendorData || singleVendorData.length === 0) {
      toast.error('Vendor data not found!')
      return
    }

    let old_info = []
    try {
      old_info = singleVendorData[0].log_info ? JSON.parse(singleVendorData[0].log_info) : []
    } catch (error) {
      old_info = []
    }

    let current_status = singleVendorData[0].diesel_vendor_status === 0 ? 1 : 0
    let current_info = [{
      diesel_vendor_name: singleVendorData[0].diesel_vendor_name,
      vendor_code: singleVendorData[0].vendor_code,
      vendor_phone_1: singleVendorData[0].vendor_phone_1,
      vendor_phone_2: singleVendorData[0].vendor_phone_2,
      vendor_email: singleVendorData[0].vendor_email,
      type: 3,
      user: user_info.emp_name || user_id,
      time: current_time,
      remarks: '',
    }]

    let complete_info = [...old_info, ...current_info]

    let formData = new FormData()
    formData.append('id', id)
    formData.append('status', current_status)
    formData.append('log_info', JSON.stringify(complete_info))

    DieselVendorMasterService.softDeleteDieselVendor(formData).then((res) => {
      toast.success('Diesel Vendor Status Updated Successfully!')
      setMount((preState) => preState + 1)
    })
  }

  useEffect(() => {
    DieselVendorMasterService.getDieselVendors().then((response) => {
      const data = response.data.data
      setViewData(data)
      let rowDataList = []
      data.map((item, index) => {
        rowDataList.push({
          sno: index + 1,
          Creation_Date: item.created_at,
          diesel_Vendor_Name: item.diesel_vendor_name,
          diesel_Vendor_Code: item.vendor_code,
          diesel_Vendor_Mobile1: item.vendor_phone_1,
          diesel_Vendor_Mobile2: item.vendor_phone_2,
          diesel_Vendor_Mail: item.vendor_email,
          Status: item.diesel_vendor_status === 1 ? '✔️' : '❌',

          Action: (
            <div className="d-flex justify-content-space-between">
              <CButton
                size="sm"
                className="m-1"
                color={'info'}
                onClick={() => {
                  setAssignDieselVendorLogModal(true)
                  assignDieselVendorLogInfo(item.diesel_vendor_id)
                }}
              >
                <i className="fa fa-eye" aria-hidden="true"></i>
              </CButton>
              <CButton
                size="sm"
                color={item.diesel_vendor_status === 1 ? 'success' : 'danger'}
                shape="rounded"
                id={item.diesel_vendor_id}
                onClick={() => {
                  changeDieselVendorStatus(item.diesel_vendor_id)
                }}
                className="m-1"
              >
                <i className="fa fa-trash" aria-hidden="true"></i>
              </CButton>
              <Link
                to={
                  item.diesel_vendor_status === 1
                    ? `DieselVendorMaster/${item.diesel_vendor_id}`
                    : ''
                }
              >
                <CButton
                  size="sm"
                  color="secondary"
                  shape="rounded"
                  disabled={item.diesel_vendor_status === 1 ? false : true}
                  id={item.diesel_vendor_id}
                  className="m-1"
                >
                  <i className="fa fa-edit" aria-hidden="true"></i>
                </CButton>
              </Link>
            </div>
          ),
        })
      })
      setRowData(rowDataList)
      setPending(false)
    })

    UserLoginMasterService.getUser().then((res) => {
      setUserMasterData(res.data.data)
    })
  }, [mount])

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

  const assignDieselVendorLogInfo = (dno) => {
    let rowDataList = []

    const filterData = viewDataRef.current.filter((data) => data.diesel_vendor_id == dno)
    let needed_data = []
    try {
      needed_data = filterData[0].log_info ? JSON.parse(filterData[0].log_info) : []
    } catch (error) {
      needed_data = []
    }

    // Exclude creation logs (type 1); show empty table by default
    needed_data = needed_data.filter((data) => data.type !== 1)

    needed_data.map((data, index) => {
      rowDataList.push({
        sno: index + 1,
        Diesel_Vendor_Name: data.diesel_vendor_name ? data.diesel_vendor_name : '-',
        Vendor_Code: data.vendor_code ? data.vendor_code : '-',
        Vendor_Phone_1: data.vendor_phone_1 ? data.vendor_phone_1 : '-',
        Vendor_Phone_2: data.vendor_phone_2 ? data.vendor_phone_2 : '-',
        Vendor_Email: data.vendor_email ? data.vendor_email : '-',
        Status: statusFinder(data.type),
        Time: data.time,
        User: userNameFinder(data.user),
        Remarks: data.remarks,
      })
    })

    setAssignDieselVendorData(rowDataList)
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
      name: 'Diesel Vendor Name',
      selector: (row) => row.diesel_Vendor_Name,
      sortable: true,
      center: true,
    },
    {
      name: 'Diesel Vendor Code',
      selector: (row) => row.diesel_Vendor_Code,
      sortable: true,
      center: true,
    },
    {
      name: 'Diesel Vendor Mobile Number 1',
      selector: (row) => row.diesel_Vendor_Mobile1,
      sortable: true,
      center: true,
    },
    {
      name: 'Diesel Vendor Mobile Number 2',
      selector: (row) => row.diesel_Vendor_Mobile2,
      sortable: true,
      center: true,
    },
    {
      name: 'Diesel Vendor Mail ID',
      selector: (row) => row.diesel_Vendor_Mail,
      sortable: true,
      center: true,
    },
    {
      name: 'Status',
      selector: (row) => row.Status,
      center: true,
      sortable: true,
    },
    {
      name: 'Action',
      selector: (row) => row.Action,
      center: true,
    },
  ]

  const columns_child = [
    {
      name: 'S.No',
      selector: (row) => row.sno,
      width: '80px',
      sortable: true,
      center: true,
    },
    {
      name: 'Diesel Vendor Name',
      selector: (row) => row.Diesel_Vendor_Name,
      sortable: true,
      center: true,
    },
    {
      name: 'Diesel Vendor Code',
      selector: (row) => row.Vendor_Code,
      sortable: true,
      center: true,
    },
    {
      name: 'Diesel Vendor Mobile No 1',
      selector: (row) => row.Vendor_Phone_1,
      sortable: true,
      center: true,
    },
    {
      name: 'Diesel Vendor Mobile No 2',
      selector: (row) => row.Vendor_Phone_2,
      sortable: true,
      center: true,
    },
    {
      name: 'Diesel Vendor Mail ID',
      selector: (row) => row.Vendor_Email,
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
  ]

  return (
    <>
      <CRow className="mt-1 mb-1">
        <CCol
          className="offset-md-6"
          xs={15}
          sm={15}
          md={6}
          style={{ display: 'flex', justifyContent: 'end' }}
        >
          <Link className="text-white" to="/DieselVendorMaster">
            <CButton size="md" color="warning" className="px-3 text-white" type="button">
              <span className="float-start">
                <i className="" aria-hidden="true"></i> &nbsp;NEW
              </span>
            </CButton>
          </Link>
        </CCol>
      </CRow>
      <CCard>
        <CContainer>
          <CustomTable
            columns={columns}
            data={rowData}
            fieldName={'diesel_Vendor_Name'}
            showSearchFilter={true}
            pending={pending}
          />
        </CContainer>

        {/* Log Information Modal */}
        <CModal
          size="xl"
          visible={assignDieselVendorLogModal}
          onClose={() => setAssignDieselVendorLogModal(false)}
        >
          <CModalHeader>
            <CModalTitle>Log Information</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <CRow>
              <CCol md={12}>
                <CustomTable columns={columns_child} data={assignDieselVendorData} />
              </CCol>
            </CRow>
          </CModalBody>
          <CModalFooter>
            <CButton color="secondary" onClick={() => setAssignDieselVendorLogModal(false)}>
              Close
            </CButton>
          </CModalFooter>
        </CModal>
        {/* Log Information Modal */}
      </CCard>
    </>
  )
}

export default DieselVendorMasterTable
