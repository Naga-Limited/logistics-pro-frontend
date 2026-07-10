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
  CFormInput,
} from '@coreui/react'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import CustomTable from 'src/components/customComponent/CustomTable'
import Loader from 'src/components/Loader'
//import DriverMasterService from 'src/Service/Master/DriverMasterService'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import CustomSpanButton from 'src/components/customComponent/CustomSpanButton1'
import FreightMasterService from 'src/Service/Master/FreightMasterService'
import FreightMasterTableImport from 'src/Pages/Master/FreightMaster/FreightMasterTableImport'
import { read, utils, writeFile } from 'xlsx'
import { getCurrentDateTime } from 'src/Pages/Depo/CommonMethods/CommonMethods'
import UserLoginMasterService from 'src/Service/Master/UserLoginMasterService'

const FreightMasterTable = () => {
  const [fetch, setFetch] = useState(false)
  const [rowData, setRowData] = useState([])
  const [freightsData, setFreightsData] = useState([])
  const [mount, setMount] = useState(1)
  const [assignFreightModal, setAssignFreightModal] = useState(false)
  const [displayFreightLogData, setDisplayFreightLogData] = useState([])
  const [userMasterData, setUserMasterData] = useState([])

  let viewData

  const user_info_json = localStorage.getItem('user_info')
  const user_info = JSON.parse(user_info_json)
  const user_id = user_info.user_id

  const getdata = (id) => {
    let dat = []
    freightsData.map((data) => {
      if (Number(data.id) === Number(id)) {
        dat.push(data)
      }
    })
    return dat
  }

  const getOldLogInfo = (data) => {
    try {
      let data_new = []
      let temp = data ? JSON.parse(data) : []
      let temp1 = data && temp && temp.length > 0 ? temp : []
      temp1.map((vk, kk) => {
        data_new[kk] = vk
      })
      return data_new
    } catch (error) {
      return []
    }
  }

  const statusFinder = (id) => {
    let statuses = ['', 'Created', 'Updated', 'In-Activated', 'Re-Activated']
    return statuses[id]
  }

  const userNameFinder = (id) => {
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
    return uname || '--'
  }

  const assignFreightInfo = (vdata, freightId) => {
    let rowDataList = []

    const filterData = vdata.filter((data) => Number(data.id) === Number(freightId))
    let needed_data =
      filterData.length > 0 && filterData[0].log_info ? JSON.parse(filterData[0].log_info) : []

    needed_data.map((data, index) => {
      rowDataList.push({
        sno: index + 1,
        Customer_Name: data.customer_name
          ? data.customer_name
          : filterData[0].customer_info?.customer_name,
        Customer_Code: data.customer_code
          ? data.customer_code
          : filterData[0].customer_info?.customer_code,
        Customer_Type: data.customer_type
          ? data.customer_type
          : filterData[0].customer_info?.customer_type,
        Supply_Plant: data.location_name
          ? data.location_name
          : filterData[0].location_info?.location,
        Freight: data.freight_rate ? data.freight_rate : filterData[0].freight_rate,
        Supply_Type: data.type_name ? data.type_name : filterData[0].type,
        Start_Date: data.start_date ? data.start_date : filterData[0].start_date,
        End_Date: data.end_date ? data.end_date : filterData[0].end_date,
        Status: statusFinder(data.type),
        Time: data.time,
        User: userNameFinder(data.user),
        Remarks: data.remarks ? data.remarks : '',
      })
    })

    setDisplayFreightLogData(rowDataList)
  }

  function changeFreightStatus(id, rowFreightData = null) {
    let singleData = rowFreightData ? [rowFreightData] : getdata(id)

    if (singleData.length == 0) {
      toast.warning('Invalid Freight Data..')
      return false
    }

    const formData = new FormData()
    formData.append('id', id)
    formData.append('updated_by', user_id)
    formData.append('before_delete_type', singleData[0].freight_status)
    formData.append('after_delete_type', singleData[0].freight_status == 0 ? '1' : '0')
    formData.append('status', singleData[0].freight_status == 0 ? '1' : '0')

    let current_time = getCurrentDateTime()
    let current_info = getOldLogInfo(singleData[0].log_info)
    current_info.push({
      customer_name: singleData[0].customer_info?.customer_name || '',
      customer_code: singleData[0].customer_info?.customer_code || '',
      customer_type: singleData[0].customer_info?.customer_type || '',
      location_name: singleData[0].location_info?.location || '',
      freight_rate: singleData[0].freight_rate || '',
      type_name: singleData[0].type || '',
      start_date: singleData[0].start_date || '',
      end_date: singleData[0].end_date || '',
      type: singleData[0].freight_status == 0 ? '4' : '3',
      user: user_info.emp_name || user_id,
      time: current_time,
      remarks: '',
    })
    formData.append('log_info', JSON.stringify(current_info))

    FreightMasterService.softDeleteFreight(formData).then((res) => {
      if (res.status == 200) {
        toast.success('Freight Rate Status Updated Successfully!')
        setMount((preState) => preState + 1)
      }
    })
  }
  function formatDate(date) {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear()

    if (month.length < 2) month = '0' + month
    if (day.length < 2) day = '0' + day

    return [day, month, year].join('-')
  }
  useEffect(() => {
    FreightMasterService.getFreight().then((response) => {
      setFetch(true)
      viewData = response.data.data
      setFreightsData(viewData)
      console.log(viewData)
      let rowDataList = []
      viewData.map((data, index) => {
        rowDataList.push({
          sno: index + 1,
          institution_customer_id: data.customer_info?.institution_customer_id,
          customer_name: data.customer_info?.customer_name,
          customer_code: data.customer_info?.customer_code,
          customer_type: data.customer_info?.customer_type,
          location_id: data.location_info?.location,
          freight_rate: data.freight_rate,
          type: data.type,
          start_date: data.start_date,
          end_date: data.end_date,
          created_at: data.created_at,
          Status: data.freight_status === 1 ? '✔️' : '❌',
          Action: (
            <div className="d-flex justify-content-space-between">
              <CButton
                size="sm"
                className="m-1"
                color={'info'}
                onClick={() => {
                  setAssignFreightModal(true)
                  assignFreightInfo(viewData, data.id)
                }}
              >
                <i className="fa fa-eye" aria-hidden="true"></i>
              </CButton>
              <CButton
                size="sm"
                color="danger"
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
              <Link to={data.freight_status === 1 ? `FreightMaster/${data.id}` : ''}>
                <CButton
                  size="sm"
                  disabled={data.freight_status === 1 ? false : true}
                  color="secondary"
                  shape="rounded"
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
    })

    UserLoginMasterService.getUser().then((res) => {
      let userData = res.data.data
      setUserMasterData(userData)
    })
  }, [mount, freightsData.length == 0, userMasterData.length == 0])

  // ============ Column Header Data =======

  const columns = [
    {
      name: 'S.no',
      selector: (row) => row.sno,
      left: true,
      sortable: true,
    },


    {
      name: 'Customer Name',
      selector: (row) => row.customer_name,
      left: true,
      sortable: true,
    },
    {
      name: 'Customer Code',
      selector: (row) => row.customer_code,
      left: true,
      sortable: true,
    },
    {
      name: 'Customer type',
      selector: (row) => row.customer_type,
      left: true,
      sortable: true,
    },
    {
      name: 'Supplying Plant',
      selector: (row) => row.location_id,
      left: true,
      sortable: true,
    },

    {
      name: 'Freight Rate',
      selector: (row) => row.freight_rate,
      left: true,
      sortable: true,
    },
    {
      name: 'Supply Type',
      selector: (row) => row.type,
      left: true,
      sortable: true,
    },
    {
      name: 'Start Date',
      selector: (row) => formatDate(row.start_date),
      left: true,
      sortable: true,
    },
    {
      name: 'End Date',
      selector: (row) => formatDate(row.end_date),
      left: true,
      sortable: true,
    },
    {
      name: 'Status',
      selector: (row) => row.Status,
      left: true,
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
      sortable: true,
      center: true,
    },
    {
      name: 'Customer Name',
      selector: (row) => row.Customer_Name,
      sortable: true,
      center: true,
    },
    {
      name: 'Customer Code',
      selector: (row) => row.Customer_Code,
      sortable: true,
      center: true,
    },
    {
      name: 'Customer Type',
      selector: (row) => row.Customer_Type,
      sortable: true,
      center: true,
    },
    {
      name: 'Supply Plant',
      selector: (row) => row.Supply_Plant,
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
      name: 'Supply Type',
      selector: (row) => row.Supply_Type,
      sortable: true,
      center: true,
    },
    {
      name: 'Start Date',
      selector: (row) => row.Start_Date,
      sortable: true,
      center: true,
    },
    {
      name: 'End Date',
      selector: (row) => row.End_Date,
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
          <CCard className="mt-4">
            <CContainer className="mt-2">
              <CRow>
                <CCol
                  className="offset-md-5"
                  xs={15}
                  sm={15}
                  md={3}
                  style={{ display: 'flex', justifyContent: 'end' }}
                >
                  <div className="col-md-6">
                    <Link className="text-white" to="/FreightMasterTableImport">
                      <button className="btn btn-primary float-right">
                        Import <i className="fa fa-download"></i>
                      </button>
                    </Link>
                  </div>
                  <Link className="text-white" to="/FreightMaster">
                    <CButton size="md" color="warning" className="px-3 text-white" type="button">
                      <span className="float-start">
                        <i className="" aria-hidden="true"></i> &nbsp;NEW
                      </span>
                    </CButton>
                  </Link>
                </CCol>
              </CRow>

              <CustomTable columns={columns} data={rowData} showSearchFilter={true} />
            </CContainer>
          </CCard>
          <CModal
            size="xl"
            backdrop="static"
            scrollable
            visible={assignFreightModal}
            onClose={() => {
              setAssignFreightModal(false)
            }}
          >
            <CModalHeader>
              <CModalTitle>{`Log Information`}</CModalTitle>
            </CModalHeader>
            <CModalBody>
              <CustomTable
                columns={columns_child}
                data={displayFreightLogData}
                fieldName={'Customer_Name'}
                showSearchFilter={true}
              />
            </CModalBody>
            <CModalFooter>
              <CButton
                color="primary"
                onClick={() => {
                  setAssignFreightModal(false)
                }}
              >
                Close
              </CButton>
            </CModalFooter>
          </CModal>
        </>
      )}
    </>
  )
}

export default FreightMasterTable
