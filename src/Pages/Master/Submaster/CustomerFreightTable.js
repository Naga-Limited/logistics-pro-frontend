import {
  CButton,
  CCard,
  CContainer,
  CCol,
  CRow,
  CModal,
  CFormInput,
  CFormLabel,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CAlert,
  CFormSelect,
} from '@coreui/react'
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useForm from 'src/Hooks/useForm'
import CustomTable from 'src/components/customComponent/CustomTable'
import CustomerFreightApi from '../../../Service/SubMaster/CustomerFreightApi'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import FreightSubmasterValidation from 'src/Utils/SubMaster/FreightSubmasterValidation'
import { getCurrentDateTime, GetDateTimeFormat } from 'src/Pages/Depo/CommonMethods/CommonMethods'
import * as XLSX from 'xlsx'
import FileSaver from 'file-saver'
import UserLoginMasterService from 'src/Service/Master/UserLoginMasterService'

const CustomerFreightTable = () => {
  const [modal, setModal] = useState(false)
  const [rowData, setRowData] = useState([])
  const [save, setSave] = useState(true)
  const [success, setSuccess] = useState('')
  const [editId, setEditId] = useState('')
  const [update, setUpdate] = useState('')
  const [error, setError] = useState('')
  const [mount, setMount] = useState(1)
  const [pending, setPending] = useState(true)
  const [customerFreightData, setCustomerFreightData] = useState([])
  const [singleCustomerFreightInfo, setSingleCustomerFreightInfo] = useState({})
  const [assignCustomerFreightModal, setAssignCustomerFreightModal] = useState(false)
  const [displayCustomerFreightLogData, setDisplayCustomerFreightLogData] = useState([])
  const [userMasterData, setUserMasterData] = useState([])
  const navigation = useNavigate()

  const user_info_json = localStorage.getItem('user_info')
  const user_info = JSON.parse(user_info_json)
  const user_id = user_info.user_id

  const formValues = {
    // customerfreight: '',
    customer_name: '',
    customer_code: '',
    customer_type: '',
  }

  const { values, errors, handleChange, onFocus, enableSubmit, onBlur } = useForm(
    login,
    FreightSubmasterValidation,
    formValues
  )

  function login() {
    // no-op
  }

  const getdata = (id) => {
    let dat = []
    customerFreightData.map((data) => {
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
    if (!id) return '--'
    if (typeof id === 'string' && isNaN(Number(id))) {
      return id
    }
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

  const assignCustomerFreightInfo = (vdata, customerFreightId) => {
    let rowDataList = []

    const filterData = vdata.filter((data) => Number(data.id) === Number(customerFreightId))
    let needed_data =
      filterData.length > 0 && filterData[0].log_info ? JSON.parse(filterData[0].log_info) : []

    needed_data.map((data, index) => {
      rowDataList.push({
        sno: index + 1,
        Customer_Name: data.customer_name ? data.customer_name : filterData[0].customer_name,
        Customer_Code: data.customer_code ? data.customer_code : filterData[0].customer_code,
        Customer_Type: data.customer_type ? data.customer_type : filterData[0].customer_type,
        Status: statusFinder(data.type),
        Time: data.time,
        user_id: data.user,
        Remarks: data.remarks ? data.remarks : '',
      })
    })

    setDisplayCustomerFreightLogData(rowDataList)
  }

  function changeCustomerFreightStatus(id, rowCustomerFreightData = null) {
    let singleData = rowCustomerFreightData ? [rowCustomerFreightData] : getdata(id)

    if (singleData.length == 0) {
      toast.warning('Invalid Customer Freight Data..')
      return false
    }

    const formData = new FormData()
    formData.append('id', id)
    formData.append('updated_by', user_id)
    formData.append('before_delete_type', singleData[0].customer_status)
    formData.append('after_delete_type', singleData[0].customer_status == 0 ? '1' : '0')
    formData.append('status', singleData[0].customer_status == 0 ? '1' : '0')

    let current_time = getCurrentDateTime()
    let current_info = getOldLogInfo(singleData[0].log_info)
    current_info.push({
      customer_name: singleData[0].customer_name ? singleData[0].customer_name : '',
      customer_code: singleData[0].customer_code ? singleData[0].customer_code : '',
      customer_type: singleData[0].customer_type ? singleData[0].customer_type : '',
      type: singleData[0].customer_status == 0 ? '4' : '3',
      user: user_info.emp_name || user_id,
      time: current_time,
      remarks: '',
    })
    formData.append('log_info', JSON.stringify(current_info))

    CustomerFreightApi.softDeleteCustomerFreight(formData).then((res) => {
      if (res.status == 200) {
        setMount((prevState) => (prevState = prevState + 1))
        toast.success('Customer Status Updated Successfully!')
      }
    })
  }

  const Create = (e) => {
    e.preventDefault()

    let current_time = getCurrentDateTime()
    let current_info = []
    current_info.push({
      customer_name: values.customer_name,
      customer_code: values.customer_code,
      customer_type: values.customer_type,
      type: 1,
      user: user_info.emp_name || user_id,
      time: current_time,
      remarks: '',
    })

    let createValues = {
      customer_name: values.customer_name,
      customer_code: values.customer_code,
      customer_type: values.customer_type,
      created_by: user_id,
      log_info: JSON.stringify(current_info),
    }

    CustomerFreightApi.createCustomerFreight(createValues)
      .then((response) => {
        if (response.status === 201) {
          values.customer_name = ''
          values.customer_code = ''
          values.customer_type = ''
          setModal(false)
          setMount((prevState) => (prevState = prevState + 1))
          toast.success('New Customer Added Successfully!')
        } else if (response.status === 200) {
          setError('Customer Already Exists. Please Check')
        }
      })
      .catch((error) => {
        showError(error)
      })
  }

  const Edit = (id) => {
    setSave(false)
    setEditId('')
    CustomerFreightApi.getCustomerFreightById(id).then((response) => {
      let editData = response.data.data
      setModal(true)
      values.customer_name = editData.customer_name
      values.customer_code = editData.customer_code
      values.customer_type = editData.customer_type
      setSingleCustomerFreightInfo(editData)
      setEditId(id)
    })
  }

  const exportToCSV = () => {
    let dateTimeString = GetDateTimeFormat(1)
    let fileName = 'Customer_Freight_Master_Report_' + dateTimeString
    const fileType =
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
    const fileExtension = '.xlsx'
    const ws = XLSX.utils.json_to_sheet(rowData)
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] }
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
    const data = new Blob([excelBuffer], { type: fileType })
    FileSaver.saveAs(data, fileName + fileExtension)
  }

  const Update = (id) => {
    let current_time = getCurrentDateTime()
    let current_info = getOldLogInfo(singleCustomerFreightInfo.log_info)
    current_info.push({
      customer_name: values.customer_name,
      customer_code: values.customer_code,
      customer_type: values.customer_type,
      type: 2,
      user: user_info.emp_name || user_id,
      time: current_time,
      remarks: '',
    })

    let updateValues = {
      customer_name: values.customer_name,
      customer_code: values.customer_code,
      customer_type: values.customer_type,
      updated_by: user_id,
      log_info: JSON.stringify(current_info),
    }

    CustomerFreightApi.updateCustomerFreight(updateValues, id)
      .then(() => {
        setModal(false)
        setMount((prevState) => (prevState = prevState + 1))
        toast.success('Customer Updated Successfully!')
      })
      .catch((error) => {
        showError(error)
      })
  }

  const Delete = (id, rowCustomerFreightData = null) => {
    changeCustomerFreightStatus(id, rowCustomerFreightData)
  }

  const showError = (error) => {
    let errors = error.response.data.errors
    setError(
      Object.keys(errors)
        .map((key, index) => errors[key][0])
        .join(' <br/> ')
    )
    setTimeout(() => {
      setError('')
    }, 1000)
  }

  useEffect(() => {
    CustomerFreightApi.getCustomerFreight().then((response) => {
      let viewData = response.data.data
      setCustomerFreightData(viewData)
      let rowDataList = []
      viewData.map((data, index) => {
        rowDataList.push({
          sno: index + 1,
          customer_name: data.customer_name,
          customer_code: data.customer_code,
          customer_type: data.customer_type,
          Created_at: data.created_at,
          Status: data.customer_status === 1 ? '✔️' : '❌',
          Action: (
            <div className="d-flex justify-content-space-between">
              <CButton
                size="sm"
                className="m-1"
                color={'info'}
                onClick={() => {
                  setAssignCustomerFreightModal(true)
                  assignCustomerFreightInfo(viewData, data.id)
                }}
              >
                <i className="fa fa-eye" aria-hidden="true"></i>
              </CButton>
              <CButton
                size="sm"
                color={data.customer_status === 1 ? 'success' : 'danger'}
                shape="rounded"
                id={data.id}
                onClick={() => Delete(data.id, data)}
                className="m-1"
              >
                {/* Delete */}
                <i className="fa fa-trash" aria-hidden="true"></i>
              </CButton>
              <CButton
                disabled={data.customer_status === 1 ? false : true}
                size="sm"
                color="secondary"
                shape="rounded"
                id={data.id}
                onClick={() => Edit(data.id)}
                className="m-1"
              >
                {/* Edit */}
                <i className="fa fa-edit" aria-hidden="true"></i>
              </CButton>
            </div>
          ),
        })
      })
      setRowData(rowDataList)
      setPending(false)

      setTimeout(() => {
        setSuccess('')
        setUpdate('')
        setError('')
      }, 1500)
    })

    UserLoginMasterService.getUser().then((res) => {
      setUserMasterData(res.data.data)
    })
  }, [mount, modal, save, success, update])

  const columns = [
    {
      name: 'S.No',
      selector: (row) => row.sno,
      sortable: true,
      center: true,
    },
    {
      name: 'Creation date',
      selector: (row) => row.Created_at,
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
      name: 'Customer Type',
      selector: (row) => row.customer_type,
      left: true,
      sortable: true,
    },
    // {
    //   name: 'Supplying Plant',
    //   selector: (row) => row.supply_plant,
    //   left: true,
    //   sortable: true,
    // },

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
      selector: (row) => userNameFinder(row.user_id),
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

  return (
    <>
      <CContainer className="mt-2">
        <CRow className="mt-3">
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
              className="px-3 text-white"
              onClick={() => {
                values.customer_name = ''
                values.customer_code = ''
                values.customer_type = ''
                setSuccess('')
                setUpdate('')
                setError('')
                setModal(!modal)
                setSave(true)
              }}
            >
              <span className="float-start">
                <i className="" aria-hidden="true"></i> &nbsp;New
              </span>
            </CButton>
            <CButton
              size="sm"
              color="warning"
              className="px-5 text-white"
              onClick={(e) => {
                exportToCSV()
              }}
            >
              Export
            </CButton>
          </CCol>
        </CRow>
        <CCard className="mt-1">
          <CustomTable
            columns={columns}
            data={rowData || ''}
            fieldName={'customer_name'}
            showSearchFilter={true}
            pending={pending}
          />

          <CModal
            size="xl"
            backdrop="static"
            scrollable
            visible={assignCustomerFreightModal}
            onClose={() => {
              setAssignCustomerFreightModal(false)
            }}
          >
            <CModalHeader>
              <CModalTitle>{`Log Information`}</CModalTitle>
            </CModalHeader>
            <CModalBody>
              <CustomTable
                columns={columns_child}
                data={displayCustomerFreightLogData}
                fieldName={'customer_name'}
                showSearchFilter={true}
              />
            </CModalBody>
            <CModalFooter>
              <CButton
                color="primary"
                onClick={() => {
                  setAssignCustomerFreightModal(false)
                }}
              >
                Close
              </CButton>
            </CModalFooter>
          </CModal>
        </CCard>
      </CContainer>

      {/* View & Edit Modal Section */}
      <CModal visible={modal} onClose={() => setModal(false)}>
        <CModalHeader>
          <CModalTitle>Create New Customer</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CRow>
            <CCol>
              {update && (
                <CAlert color="primary" data-aos="fade-down" dismissible>
                  {update}
                </CAlert>
              )}
              {success && (
                <CAlert color="success" data-aos="fade-down" dismissible>
                  {success}
                </CAlert>
              )}
              {error && (
                <CAlert color="danger" data-aos="fade-down" dismissible>
                  <div dangerouslySetInnerHTML={{ __html: error }} />
                </CAlert>
              )}

              <CFormLabel htmlFor="customer">
                Customer Name*{' '}
                {errors.customer_name && (
                  <span className="small text-danger">{errors.customer_name}</span>
                )}
              </CFormLabel>
              <CFormInput
                size="sm"
                id="customer_name"
                //maxLength={125}
                className={`${errors.customer_name && 'is-invalid'}`}
                name="customer_name"
                value={values.customer_name || ''}
                onFocus={onFocus}
                onBlur={onBlur}
                onChange={handleChange}
                aria-label="Small select example"
              />
              <CFormLabel htmlFor="customer_code">
                Customer Code*{' '}
                {errors.customer_code && (
                  <span className="small text-danger">{errors.customer_code}</span>
                )}
              </CFormLabel>
              <CFormInput
                size="sm"
                id="customer_code"
                type="number"
                //maxLength={4}
                className={`${errors.customer_code && 'is-invalid'}`}
                name="customer_code"
                value={values.customer_code || ''}
                onFocus={onFocus}
                onBlur={onBlur}
                onChange={handleChange}
                aria-label="Small select example"
              />
              <CFormLabel htmlFor="customer_type">
                Customer Type *{' '}
                {errors.customer_type && (
                  <span className="small text-danger">{errors.customer_type}</span>
                )}
              </CFormLabel>
              <CFormSelect
                size="sm"
                id="customer_type"
                className={`${errors.customer_type && 'is-invalid'}`}
                name="customer_type"
                //readOnly={editFieldsReadOnly}
                value={values.customer_type}
                onFocus={onFocus}
                onBlur={onBlur}
                onChange={handleChange}
              >
                <option value="" selected>
                  Select...
                </option>
                <option value="Foods-Institution">Foods-Institution</option>
                <option value="Foods-Interdivision">Foods-Interdivision</option>
                <option value="Foods-Export">Foods-Export</option>
                <option value="Foods-Mini-Institution">Foods-Mini-Institution</option>
                <option value="Consumer-Interdivision">Consumer-Interdivision</option>
                <option value="Consumer-Regular">Consumer-Regular</option>
              </CFormSelect>
            </CCol>
          </CRow>
        </CModalBody>
        <CModalFooter>
          <CButton
            onClick={(e) => (save ? Create(e) : Update(editId))}
            color="primary"
            disabled={save ? enableSubmit : false}
          >
            {save ? 'Save' : 'Update'}
          </CButton>
        </CModalFooter>
      </CModal>
      {/* View & Edit Modal Section */}
    </>
  )
}

export default CustomerFreightTable
