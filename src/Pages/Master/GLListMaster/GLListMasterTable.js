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
import { toast } from 'react-toastify'
import Loader from 'src/components/Loader'
import CustomTable from 'src/components/customComponent/CustomTable'
import GLListMasterService from 'src/Service/Master/GLListMasterService'
import * as XLSX from 'xlsx';
import FileSaver from 'file-saver'
import { GetDateTimeFormat, getCurrentDateTime } from 'src/Pages/Depo/CommonMethods/CommonMethods'
import UserLoginMasterService from 'src/Service/Master/UserLoginMasterService'
import DefinitionsListApi from 'src/Service/Definitions/DefinitionsListApi'

const GLListMasterTable = () => {
  const [rowData, setRowData] = useState([])
  const [mount, setMount] = useState(1)
  const [pending, setPending] = useState(true)
  const [fetch, setFetch] = useState(false)
  
  const [assignGLLogModal, setAssignGLLogModal] = useState(false)
  const [assignGLData, setAssignGLData] = useState([])
  const [userMasterData, setUserMasterData] = useState([])
  const [vendorCustomerTypes, setVendorCustomerTypes] = useState([])
  const vendorCustomerTypesRef = useRef([])

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
      userMasterData.map((user) => {
        if (Number(user.user_id) === targetId) {
          uname = user.emp_name
        }
      })
    }
    return uname || id || '--'
  }

  const resolveVendorCustomerType = (gltype) => {
    if (!gltype || gltype === '-') return '-'
    const codes = String(gltype).split(',')
    const names = codes.map(code => {
      const found = vendorCustomerTypesRef.current.find(vct => String(vct.definition_list_code) === String(code.trim()))
      return found ? found.definition_list_name : code
    })
    return names.join(', ')
  }

  function changeGLList(id) {
    let current_time = getCurrentDateTime()
    const singleGLData = viewDataRef.current.filter((data) => data.gl_list_id == id)

    if (!singleGLData || singleGLData.length === 0) {
      toast.error('G/L data not found!')
      return
    }

    let old_info = []
    try {
      old_info = singleGLData[0].log_info ? JSON.parse(singleGLData[0].log_info) : []
    } catch (error) {
      old_info = []
    }

    let current_status = singleGLData[0].gl_status == 0 ? 1 : 0

    let current_info = [{
      gl_description: singleGLData[0].gl_description,
      gl_code: singleGLData[0].gl_code,
      amount_type: singleGLData[0].amount_type,
      cost_center: singleGLData[0].cost_center,
      profit_center: singleGLData[0].profit_center,
      plant_code: singleGLData[0].plant,
      vendor_customer_type: resolveVendorCustomerType(singleGLData[0].gltype),
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

    GLListMasterService.softDeleteGlList(formData).then((res) => {
      console.log(res)
      toast.success('GL Status Updated Successfully!')
      setMount((preState) => preState + 1)
    })
  }

  const exportToCSV = () => {
    let dateTimeString = GetDateTimeFormat(1)
    let fileName='GL_List_Master_Report_'+dateTimeString
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';
    const ws = XLSX.utils.json_to_sheet(rowData);
    const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], {type: fileType});
    FileSaver.saveAs(data, fileName + fileExtension);
  }

  useEffect(() => {
    GLListMasterService.getGLlist().then((response) => {
      setFetch(true)
      viewData = response.data.data
      viewDataRef.current = response.data.data
      console.log(viewData)
      let rowDataList = []
      viewData.map((data, index) => {
        rowDataList.push({
          sno: index + 1,
          Creation_Date: data.created_at,
          gl_description: data.gl_description,
          gl_code: data.gl_code,
          gl_type:data.gltype,
          cost_center: data.cost_center,
          profit_center: data.profit_center,
          amount_type: data.amount_type == 1 ? 'Income' : 'Expense',
          plant: data.plant,
          Status: data.gl_status == 1 ? '✔️' : '❌',
          Action: (
            <div className="d-flex justify-content-space-between">
              <CButton
                size="sm"
                className="m-1"
                color={'info'}
                onClick={() => {
                  setAssignGLLogModal(true)
                  assignGLLogInfo(data.gl_list_id)
                }}
              >
                <i className="fa fa-eye" aria-hidden="true"></i>
              </CButton>
              <CButton
                size="sm"
                color={data.gl_status === 1 ? 'success' : 'danger'}
                shape="rounded"
                id={data.id}
                onClick={() => {
                  changeGLList(data.gl_list_id)
                }}
                className="m-1"
              >
                {/* Delete */}
                <i className="fa fa-trash" aria-hidden="true"></i>
              </CButton>
              <Link
                to={
                  data.gl_status === 1
                    ? `GLListMaster/${data.gl_list_id}`
                    : ''
                }
              >
                <CButton
                  size="sm"
                  color="secondary"
                  shape="rounded"
                  disabled={data.gl_status === 1 ? false : true}
                  id={data.id}
                  className="m-1"
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
      setPending(false)
    })

    UserLoginMasterService.getUser().then((res) => {
      setUserMasterData(res.data.data)
    })

    DefinitionsListApi.visibleDefinitionsListByDefinition(18).then((res) => {
      setVendorCustomerTypes(res.data.data)
      vendorCustomerTypesRef.current = res.data.data
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
      name: 'Creation Date',
      selector: (row) => row.Creation_Date,
      sortable: true,
      center: true,
    },
    {
      name: 'gl description',
      selector: (row) => row.gl_description,
      sortable: true,
      center: true,
    },
    {
      name: 'gl code',
      selector: (row) => row.gl_code,
      sortable: true,
      center: true,
    },
    {
      name: 'cost center',
      selector: (row) => row.cost_center,
      sortable: true,
      center: true,
    },
    {
      name: 'profit center',
      selector: (row) => row.profit_center,
      sortable: true,
      center: true,
    },
    {
      name: 'amount type',
      selector: (row) => row.amount_type,
      sortable: true,
      center: true,
    },
    {
      name: 'plant',
      selector: (row) => row.plant,
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

  const assignGLLogInfo = (id) => {
    let rowDataList = []
    const filterData = viewDataRef.current.filter((data) => data.gl_list_id == id)
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
        gl_description: data.gl_description ? data.gl_description : '-',
        gl_code: data.gl_code ? data.gl_code : '-',
        amount_type: data.amount_type == 1 ? 'Income' : (data.amount_type == 2 ? 'Expense' : '-'),
        cost_center: data.cost_center ? data.cost_center : '-',
        profit_center: data.profit_center ? data.profit_center : '-',
        plant_code: data.plant_code ? data.plant_code : '-',
        vendor_customer_type: data.vendor_customer_type ? resolveVendorCustomerType(data.vendor_customer_type) : '-',
        Status: statusFinder(data.type),
        Time: data.time,
        User: userNameFinder(data.user),
      })
    })
    setAssignGLData(rowDataList)
  }

  const columns_log = [
    { name: 'S.No', selector: (row) => row.sno, width: '70px', sortable: true, center: true },
    { name: 'G/L Description', selector: (row) => row.gl_description, sortable: true, center: true },
    { name: 'G/L Code', selector: (row) => row.gl_code, sortable: true, center: true },
    { name: 'G/L Amount Type', selector: (row) => row.amount_type, sortable: true, center: true },
    { name: 'Cost Center', selector: (row) => row.cost_center, sortable: true, center: true },
    { name: 'Profit Center', selector: (row) => row.profit_center, sortable: true, center: true },
    { name: 'Plant Code', selector: (row) => row.plant_code, sortable: true, center: true },
    { name: 'Vendor/Customer Type', selector: (row) => row.vendor_customer_type, sortable: true, center: true },
    { name: 'Status', selector: (row) => row.Status, sortable: true, center: true },
    { name: 'Time', selector: (row) => row.Time, sortable: true, center: true },
    { name: 'User', selector: (row) => row.User, sortable: true, center: true },
  ]

  return (
    <>
    {!fetch && <Loader />}
    {fetch && (
      <>
       <CCard className="mt-4">
        <CContainer className="mt-1">
          <CRow className="mt-1 mb-1">
            <CCol
              className="offset-md-6"
              xs={15}
              sm={15}
              md={6}
              style={{ display: 'flex', justifyContent: 'end' }}
            >
              <Link className="text-white" to="/GLListMaster">
                <CButton size="md" color="warning" className="px-3 text-white" type="button">
                  <span className="float-start">
                    <i className="" aria-hidden="true"></i> &nbsp;NEW
                  </span>
                </CButton>
              </Link>
              <CButton
                size="sm"
                color="warning"
                className="px-3 text-white"
                onClick={(e) => {
                  exportToCSV()
                }}
              >
                EXPORT
              </CButton>
            </CCol>
          </CRow>
            <CustomTable
              columns={columns}
              data={rowData}
              fieldName={'diesel_Vendor_Name'}
              showSearchFilter={true}
              pending={pending}
            />

            {/* Log Information Modal */}
            <CModal
              size="xl"
              visible={assignGLLogModal}
              onClose={() => setAssignGLLogModal(false)}
            >
              <CModalHeader>
                <CModalTitle>Log Information</CModalTitle>
              </CModalHeader>
              <CModalBody>
                <CRow>
                  <CCol md={12}>
                    <CustomTable columns={columns_log} data={assignGLData} />
                  </CCol>
                </CRow>
              </CModalBody>
              <CModalFooter>
                <CButton color="secondary" onClick={() => setAssignGLLogModal(false)}>
                  Close
                </CButton>
              </CModalFooter>
            </CModal>
            {/* Log Information Modal */}
        </CContainer>
       </CCard>
      </>
    )}
    </>
  )
}

export default GLListMasterTable
