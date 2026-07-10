import {
  CButton,
  CCard,
  CCardImage,
  CCol,
  CContainer,
  CFormInput,
  CFormLabel,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
} from '@coreui/react'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import CustomTable from 'src/components/customComponent/CustomTable'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import BankMasterService from 'src/Service/SubMaster/BankMasterService'
import BankSubMasterValidation from 'src/Utils/SubMaster/BankSubMasterValidation'
import useForm from 'src/Hooks/useForm'
import { getCurrentDateTime, GetDateTimeFormat } from 'src/Pages/Depo/CommonMethods/CommonMethods'
import * as XLSX from 'xlsx'
import FileSaver from 'file-saver'
import UserLoginMasterService from 'src/Service/Master/UserLoginMasterService'

const BankMasterTable = () => {
  const [rowData, setRowData] = useState([])
  const [newBankModel, setNewBankModel] = useState(false)
  const [editBankModel, setEditBankModel] = useState(false)
  const [updateBankId, setUpdateBankId] = useState(false)
  const [mount, setMount] = useState(1)
  const [pending, setPending] = useState(true)
  const [banksData, setBanksData] = useState([])
  const [singleBankInfo, setSingleBankInfo] = useState({})
  const [assignBankModal, setAssignBankModal] = useState(false)
  const [displayBankLogData, setDisplayBankLogData] = useState([])
  const [userMasterData, setUserMasterData] = useState([])

  const user_info_json = localStorage.getItem('user_info')
  const user_info = JSON.parse(user_info_json)
  const user_id = user_info.user_id

  const formValues = {
    bankName: '',
  }

  const { values, errors, handleChange, onFocus, handleSubmit, enableSubmit, onBlur } = useForm(
    addNewBank,
    BankSubMasterValidation,
    formValues
  )

  let viewData = []

  const getdata = (id) => {
    let dat = []
    banksData.map((data) => {
      if (data.bank_id == id || data.id == id) {
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

  const assignBankInfo = (vdata, bankId) => {
    let rowDataList = []

    const filterData = vdata.filter((data) => data.bank_id == bankId)
    let needed_data =
      filterData.length > 0 && filterData[0].log_info ? JSON.parse(filterData[0].log_info) : []

    needed_data.map((data, index) => {
      rowDataList.push({
        sno: index + 1,
        // Bank: filterData[0].bank_name,
        Bank: data.bank_name ? data.bank_name : filterData[0].bank_name,
        Status: statusFinder(data.type),
        Time: data.time,
        user_id: data.user,
        // Remarks: data.remarks,
        Remarks: data.remarks ? data.remarks : '',
      })
    })

    setDisplayBankLogData(rowDataList)
  }

  function handleStatus(id, rowBankData = null) {
    let singleBankData = rowBankData ? [rowBankData] : getdata(id)

    if (singleBankData.length == 0) {
      toast.warning('Invalid Bank Data..')
      return false
    }

    const formData = new FormData()
    formData.append('id', id)
    formData.append('updated_by', user_id)
    formData.append('before_delete_type', singleBankData[0].bank_status)
    formData.append('after_delete_type', singleBankData[0].bank_status == 0 ? '1' : '0')
    formData.append('status', singleBankData[0].bank_status == 0 ? '1' : '0')

    let current_time = getCurrentDateTime()
    let current_info = getOldLogInfo(singleBankData[0].log_info)
    current_info.push({
      bank_name: singleBankData[0].bank_name ? singleBankData[0].bank_name : '',
      type: singleBankData[0].bank_status == 0 ? '4' : '3',
      user: user_info.emp_name || user_id,
      time: current_time,
      remarks: '',
    })
    formData.append('log_info', JSON.stringify(current_info))

    BankMasterService.softDeleteBank(formData).then((res) => {
      if (res.status === 200) {
        setMount((prevState) => (prevState = prevState + 1))
        toast.success('Bank Status Updated Successfully!')
      }
    })
  }

  function handleEdit(id) {
    BankMasterService.getBankById(id).then((res) => {
      values.bankName = res.data.data.bank_name
      setSingleBankInfo(res.data.data)
      setUpdateBankId(id)
      setEditBankModel(true)
    })
  }

  const exportToCSV = () => {
    let dateTimeString = GetDateTimeFormat(1)
    let fileName = 'Bank_Master_Report_' + dateTimeString
    const fileType =
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
    const fileExtension = '.xlsx'
    const ws = XLSX.utils.json_to_sheet(rowData)
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] }
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
    const data = new Blob([excelBuffer], { type: fileType })
    FileSaver.saveAs(data, fileName + fileExtension)
  }

  function updateBank(id) {
    const formData = new FormData()
    formData.append('_method', 'PUT')
    formData.append('bank_name', values.bankName)

    let current_time = getCurrentDateTime()
    let current_info = getOldLogInfo(singleBankInfo.log_info)
    current_info.push({
      bank_name: values.bankName,
      type: 2,
      user: user_info.emp_name || user_id,
      time: current_time,
      remarks: '',
    })

    formData.append('updated_by', user_id)
    formData.append('log_info', JSON.stringify(current_info))

    BankMasterService.updateBank(updateBankId, formData).then((res) => {
      if (res.status === 200) {
        setEditBankModel(false)
        values.bankName = ''
        setUpdateBankId('')
        setMount((prevState) => (prevState = prevState + 1))
        toast.success('Bank Name Updated Successfully!')
      }
    })
  }

  function addNewBank(e) {
    e.preventDefault()

    const formData = new FormData()

    formData.append('bank_name', values.bankName)

    let current_time = getCurrentDateTime()
    let current_info = []
    current_info.push({
      bank_name: values.bankName,
      type: 1,
      user: user_info.emp_name || user_id,
      time: current_time,
      remarks: '',
    })

    formData.append('created_by', user_id)
    formData.append('log_info', JSON.stringify(current_info))

    BankMasterService.createBank(formData).then((res) => {
      if (res.status === 200) {
        values.bankName = ''
        setNewBankModel(false)
        setMount((prevState) => (prevState = prevState + 1))
        toast.success('New Bank Successfully!')
      }
    })
  }

  useEffect(() => {
    BankMasterService.getAllBank().then((res) => {
      viewData = res.data.data
      setBanksData(viewData)
      let rowDataList = []
      viewData.map((data, index) => {
        rowDataList.push({
          sno: index + 1,
          Created_at: data.created_at,
          Bank: data.bank_name,
          Status: data.bank_status === 1 ? '✔️' : '❌',
          Action: (
            <div className="d-flex justify-content-space-between">
              <CButton
                size="sm"
                className="m-1"
                color={'info'}
                onClick={() => {
                  setAssignBankModal(true)
                  assignBankInfo(viewData, data.bank_id)
                }}
              >
                <i className="fa fa-eye" aria-hidden="true"></i>
              </CButton>
              <CButton
                size="sm"
                color={data.bank_status === 1 ? 'success' : 'danger'}
                shape="rounded"
                id={data.bank_id}
                onClick={(e) => handleStatus(data.bank_id, data)}
                type="button"
                className="m-1"
              >
                {/* active & de-active */}
                <i className="fa fa-trash" aria-hidden="true"></i>
              </CButton>
              <CButton
                disabled={data.bank_status === 1 ? false : true}
                size="sm"
                color="secondary"
                shape="rounded"
                id={data.bank_id}
                className="m-1"
                onClick={(e) => handleEdit(data.bank_id)}
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
    })

    UserLoginMasterService.getUser().then((res) => {
      setUserMasterData(res.data.data)
    })
  }, [mount])

  // ============ Column Header Data =======
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
      sortable: true,
      left: true,
    },
    {
      name: 'Bank Name',
      selector: (row) => row.Bank,
      sortable: true,
      left: true,
    },
    {
      name: 'Status',
      selector: (row) => row.Status,
      sortable: true,
      // sortType: basic,
      left: true,
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
      name: 'Bank Name',
      selector: (row) => row.Bank,
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
  // =================== Column Header Data =======

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
              type="button"
              onClick={() => setNewBankModel(true)}
            >
              <span className="float-start">
                <i className="" aria-hidden="true"></i> &nbsp;New
              </span>
            </CButton>
            <CButton
              size="sm"
              color="warning"
              className="px-3 text-white"
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
            data={rowData}
            fieldName={'Bank'}
            showSearchFilter={true}
            pending={pending}
          />

          <CModal
            size="xl"
            backdrop="static"
            scrollable
            visible={assignBankModal}
            onClose={() => {
              setAssignBankModal(false)
            }}
          >
            <CModalHeader>
              <CModalTitle>{`Log Information`}</CModalTitle>
            </CModalHeader>
            <CModalBody>
              <CustomTable
                columns={columns_child}
                data={displayBankLogData}
                fieldName={'Bank'}
                showSearchFilter={true}
              />
            </CModalBody>
            <CModalFooter>
              <CButton
                color="primary"
                onClick={() => {
                  setAssignBankModal(false)
                }}
              >
                Close
              </CButton>
            </CModalFooter>
          </CModal>
        </CCard>
        {/*add New Bank model*/}
        <CModal visible={newBankModel} onClose={() => setNewBankModel(false)}>
          <CModalHeader>
            <CModalTitle>ADD NEW BANK</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <CRow>
              <CCol>
                <CFormLabel htmlFor="defect_type">
                  Bank Name*{' '}
                  {errors.bankName && <span className="small text-danger">{errors.bankName}</span>}
                </CFormLabel>
                <CFormInput
                  size="sm"
                  id="bankName"
                  maxLength={20}
                  className={`${errors.bankName && 'is-invalid'}`}
                  name="bankName"
                  value={values.bankName}
                  onFocus={onFocus}
                  onBlur={onBlur}
                  onChange={handleChange}
                  aria-label="Small select example"
                />
              </CCol>
            </CRow>
          </CModalBody>
          <CModalFooter>
            <CButton
              color="secondary"
              onClick={() => {
                values.bankName = ''
                setNewBankModel(false)
              }}
            >
              Cancel
            </CButton>
            <CButton color="primary" disabled={enableSubmit} onClick={(e) => addNewBank(e)}>
              Add
            </CButton>
          </CModalFooter>
        </CModal>
        {/*add New Bank model*/}
        {/*edit Bank model*/}
        <CModal visible={editBankModel} onClose={() => setEditBankModel(false)}>
          <CModalHeader>
            <CModalTitle>EDIT BANK</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <CRow>
              <CCol>
                <CFormLabel htmlFor="defect_type">
                  Bank Name*{' '}
                  {errors.bankName && <span className="small text-danger">{errors.bankName}</span>}
                </CFormLabel>
                <CFormInput
                  size="sm"
                  id="bankName"
                  maxLength={20}
                  className={`${errors.bankName && 'is-invalid'}`}
                  name="bankName"
                  value={values.bankName}
                  onFocus={onFocus}
                  onBlur={onBlur}
                  onChange={handleChange}
                  aria-label="Small select example"
                />
              </CCol>
            </CRow>
          </CModalBody>
          <CModalFooter>
            <CButton
              color="secondary"
              onClick={() => {
                values.bankName = ''
                setEditBankModel(false)
              }}
            >
              Cancel
            </CButton>
            <CButton color="primary" disabled={enableSubmit} onClick={(e) => updateBank(e)}>
              Update
            </CButton>
          </CModalFooter>
        </CModal>
        {/*edit Bank model*/}
      </CContainer>
    </>
  )
}

export default BankMasterTable
