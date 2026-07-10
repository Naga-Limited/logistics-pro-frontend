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
import { Link } from 'react-router-dom'
import CustomTable from 'src/components/customComponent/CustomTable'
import ShedMaster from 'src/Service/Master/ShedMasterService'
// import ShedMaster from 'src/Pages/Master/ShedMaster/ShedMaster'
import { useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import CustomSpanButton from 'src/components/customComponent/CustomSpanButton2'
//validation
import ShedMasterValidation from 'src/Utils/Master/ShedMasterValidation.js'
import { GetDateTimeFormat, getCurrentDateTime } from 'src/Pages/Depo/CommonMethods/CommonMethods'
import * as XLSX from 'xlsx';
import FileSaver from 'file-saver'
import UserLoginMasterService from 'src/Service/Master/UserLoginMasterService'

const ShedMasterTable = () => {
  const [ShedOwnerPhoto, setShedOwnerPhoto] = useState(false)
  const [ShedRCcopy, setShedRCcopy] = useState(false)

  const [deleteModal, setDeleteModal] = useState(false)
  const [rowData, setRowData] = useState([])
  const [mount, setMount] = useState(1)
  const [pending, setPending] = useState(true)

  const [assignShedLogModal, setAssignShedLogModal] = useState(false)
  const [assignShedData, setAssignShedData] = useState([])
  const [userMasterData, setUserMasterData] = useState([])

  /*================== User Id Fetch ======================*/
  const user_info_json = localStorage.getItem('user_info')
  const user_info = user_info_json ? JSON.parse(user_info_json) : null
  const user_id = user_info && user_info.user_id ? user_info.user_id : 0
  /*================== User Id Fetch ======================*/

  const [documentSrc, setDocumentSrc] = useState('')
  let viewData

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

  function changeShedStatus(id) {
    let current_time = getCurrentDateTime()
    const filterData = rowData.filter((data) => data.id == id)
    const singleShedData = viewData.filter((data) => data.shed_id == id)
    
    let current_info = []
    let old_info = []
    try {
      old_info = singleShedData[0].log_info ? JSON.parse(singleShedData[0].log_info) : []
    } catch (error) {
      old_info = []
    }
    
    let current_status = singleShedData[0].shed_status === 0 ? 1 : 0
    current_info.push({
      shed_type_id: singleShedData[0].shed_type_id,
      shed_name: singleShedData[0].shed_name,
      shed_owner_name: singleShedData[0].shed_owner_name,
      shed_owner_phone_1: singleShedData[0].shed_owner_phone_1,
      shed_owner_phone_2: singleShedData[0].shed_owner_phone_2,
      shed_owner_address: singleShedData[0].shed_owner_address,
      pan_number: singleShedData[0].pan_number,
      shed_adhar_number: singleShedData[0].shed_adhar_number,
      gst_no: singleShedData[0].gst_no,
      type: 3,
      user: user_info.emp_name || user_id,
      time: current_time,
      remarks: '',
    })

    let complete_info = [...old_info, ...current_info]

    let formData = new FormData()
    formData.append('id', id)
    formData.append('status', current_status)
    formData.append('log_info', JSON.stringify(complete_info))

    ShedMaster.softDeleteShed(formData).then((res) => {
      toast.success('Shed Status Updated Successfully!')
      setMount((preState) => preState + 1)
    })
  }

  const exportToCSV = () => {

    let dateTimeString = GetDateTimeFormat(1)
    let fileName='Shed_Master_Report_'+dateTimeString
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';
    const ws = XLSX.utils.json_to_sheet(rowData);
    const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], {type: fileType});
    FileSaver.saveAs(data, fileName + fileExtension);
  }

  //section for handling view model for each model

  function handleViewDocuments(e, id, type) {
    switch (type) {
      case 'SHED_OWNER_PHOTO':
        {
          let singleShedInfo = viewData.filter((data) => data.shed_id == id)
          setDocumentSrc(singleShedInfo[0].shed_owner_photo)
          setShedOwnerPhoto(true)
        }
        break
      case 'RC_BACK':
        {
          let singleVehicleInfo = viewData.filter((data) => data.vehicle_id == id)
          setDocumentSrc(singleVehicleInfo[0].rc_copy_back)
          setShedRCcopy(true)
        }
        break
    }
  }
  useEffect(() => {
    ShedMaster.getShed().then((response) => {
      console.log(response)
      console.log('asd')
      viewData = response.data.data
      let rowDataList = []
      viewData.map((data, index) => {
        rowDataList.push({
          sno: index + 1,
          Creation_Date: data.created_at,
          // Shed_Type: data.shed_type_info.shed_type,
          Shed_Name: data.shed_name,
          Shed_Owner_Name: data.shed_owner_name,
          Shed_Owner_Phone_1: data.shed_owner_phone_1,
          Shed_Owner_Phone_2: data.shed_owner_phone_2 ? data.shed_owner_phone_1 : '-',
          Shed_Owner_Address: data.shed_owner_address,
          Shed_Owner_Photo: (
            <CustomSpanButton
              handleViewDocuments={handleViewDocuments}
              shedId={data.shed_id}
              documentType={'SHED_OWNER_PHOTO'}
            />
          ),
          Aadhar_Number: data.shed_adhar_number ? data.shed_adhar_number : '-',
          Pan_Number: data.pan_number,
          Gst_No: data.gst_no ? data.gst_no : '-',
          Status: data.shed_status === 1 ? '✔️' : '❌',

          Action: (
            <div className="d-flex justify-content-space-between">
              <CButton
                size="sm"
                color="danger"
                shape="rounded"
                id={data.id}
                onClick={() => {
                  changeShedStatus(data.shed_id)
                }}
                className="m-1"
              >
                {/* Delete */}
                <i className="fa fa-trash" aria-hidden="true"></i>
              </CButton>
              <CButton
                size="sm"
                className="m-1"
                color={'info'}
                onClick={() => {
                  setAssignShedLogModal(true)
                  assignShedLogInfo(viewData, data.shed_id)
                }}
              >
                <i className="fa fa-eye" aria-hidden="true"></i>
              </CButton>
              <Link to={data.shed_status === 1 ? `ShedMaster/${data.shed_id}` : ''}>
                <CButton
                  size="sm"
                  color="secondary"
                  shape="rounded"
                  disabled={data.shed_status === 1 ? false : true}
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
      name: 'Shed Type',
      selector: (row) => row.Shed_Type,
      sortable: true,
      center: true,
    },
    {
      name: 'Shed Name',
      selector: (row) => row.Shed_Name,
      sortable: true,
      center: true,
    },
    {
      name: 'Shed Owner Name',
      selector: (row) => row.Shed_Owner_Name,
      sortable: true,
      center: true,
    },
    {
      name: 'Shed Owner Mobile Number 1',
      selector: (row) => row.Shed_Owner_Phone_1,
      sortable: true,
      center: true,
    },
    {
      name: 'Shed Owner Mobile Number 2',
      selector: (row) => row.Shed_Owner_Phone_2,
      sortable: true,
      center: true,
    },
    {
      name: 'Shed Owner Address',
      selector: (row) => row.Shed_Owner_Address,
      sortable: true,
      center: true,
    },
    {
      name: 'Aadhar Number',
      selector: (row) => row.Aadhar_Number,
      sortable: true,
      center: true,
    },
    {
      name: ' Shed Owner Photo',
      selector: (row) => row.Shed_Owner_Photo,
      center: true,
    },
    {
      name: 'PAN Number',
      selector: (row) => row.Pan_Number,
      sortable: true,
      center: true,
    },
    {
      name: 'GST Number',
      selector: (row) => row.Gst_No,
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

  const statusFinder = (type) => {
    switch (type) {
      case 1:
        return 'Creation'
      case 2:
        return 'Updation'
      case 3:
        return 'Active Status Changed'
      case 4:
        return 'Assigned Status Changed'
      default:
        return 'Unknown'
    }
  }

  const assignShedLogInfo = (ddata, dno) => {
    let rowDataList = []

    const filterData = ddata.filter((data) => data.shed_id == dno)
    let needed_data = []
    try {
      needed_data = filterData[0].log_info ? JSON.parse(filterData[0].log_info) : []
    } catch (error) {
      needed_data = []
    }

    if (needed_data.length === 0) {
      let current_time = getCurrentDateTime()
      let current_info = []
      current_info.push({
        shed_type_id: filterData[0].shed_type_id,
        shed_name: filterData[0].shed_name,
        shed_owner_name: filterData[0].shed_owner_name,
        shed_owner_phone_1: filterData[0].shed_owner_phone_1,
        shed_owner_phone_2: filterData[0].shed_owner_phone_2,
        shed_owner_address: filterData[0].shed_owner_address,
        pan_number: filterData[0].pan_number,
        shed_adhar_number: filterData[0].shed_adhar_number,
        gst_no: filterData[0].gst_no,
        type: 1,
        user: user_info.emp_name || user_id,
        time: current_time,
        remarks: 'BACKFILLED',
      })
      let formData = new FormData()
      formData.append('id', filterData[0].shed_id)
      formData.append('log_info', JSON.stringify(current_info))
      ShedMaster.backfillShedLog(formData).then((res) => {})
      needed_data = current_info
    }

    needed_data.map((data, index) => {
      rowDataList.push({
        sno: index + 1,
        Shed_Name: data.shed_name ? data.shed_name : '-',
        Shed_Owner_Name: data.shed_owner_name ? data.shed_owner_name : '-',
        Shed_Owner_Phone_1: data.shed_owner_phone_1 ? data.shed_owner_phone_1 : '-',
        Shed_Owner_Phone_2: data.shed_owner_phone_2 ? data.shed_owner_phone_2 : '-',
        Shed_Owner_Address: data.shed_owner_address ? data.shed_owner_address : '-',
        PAN_Number: data.pan_number ? data.pan_number : '-',
        Aadhar_Number: data.shed_adhar_number ? data.shed_adhar_number : '-',
        GST_Number: data.gst_no ? data.gst_no : '-',
        Status: statusFinder(data.type),
        Time: data.time,
        User: userNameFinder(data.user),
        Remarks: data.remarks,
      })
    })

    setAssignShedData(rowDataList)
  }

  const columns_child = [
    {
      name: 'S.No',
      selector: (row) => row.sno,
      width: '100px',
      sortable: true,
      center: true,
    },
    {
      name: 'Shed Name',
      selector: (row) => row.Shed_Name,
      sortable: true,
      center: true,
    },
    {
      name: 'Shed Owner Name',
      selector: (row) => row.Shed_Owner_Name,
      sortable: true,
      center: true,
    },
    {
      name: 'Shed Owner Mobile Number 1',
      selector: (row) => row.Shed_Owner_Phone_1,
      sortable: true,
      center: true,
    },
    {
      name: 'Shed Owner Mobile Number 2',
      selector: (row) => row.Shed_Owner_Phone_2,
      sortable: true,
      center: true,
    },
    {
      name: 'Shed Owner Address',
      selector: (row) => row.Shed_Owner_Address,
      sortable: true,
      center: true,
    },
    {
      name: 'PAN Number',
      selector: (row) => row.PAN_Number,
      sortable: true,
      center: true,
    },
    {
      name: 'Aadhar Number',
      selector: (row) => row.Aadhar_Number,
      sortable: true,
      center: true,
    },
    {
      name: 'GST Number',
      selector: (row) => row.GST_Number,
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
          <Link className="text-white" to="/ShedMaster">
            <CButton size="sm" color="warning" className="px-5 text-white" type="button">
              NEW
            </CButton>
          </Link>
          <CButton
            size="sm"
            color="warning"
            className="px-5 text-white" 
            onClick={(e) => {
              exportToCSV()
            }
              }>
            Export
          </CButton>
        </CCol>
      </CRow>
      <CCard>
        <CContainer>
          <CustomTable
            columns={columns}
            data={rowData}
            fieldName={'Shed_Name'}
            showSearchFilter={true}
            pending={pending}
          />
        </CContainer>

        <CModal visible={ShedOwnerPhoto} onClose={() => setShedOwnerPhoto(false)}>
          <CModalHeader>
            <CModalTitle>Shed Owner Photo</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <CCardImage orientation="top" src={documentSrc} />
          </CModalBody>
          <CModalFooter>
            <CButton color="secondary" onClick={() => setShedOwnerPhoto(false)}>
              Close
            </CButton>
          </CModalFooter>
        </CModal>

        <CModal
          size="xl"
          visible={assignShedLogModal}
          onClose={() => setAssignShedLogModal(false)}
        >
          <CModalHeader>
            <CModalTitle>Log Information</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <CRow className="">
              <CCol md={12}>
                <CustomTable columns={columns_child} data={assignShedData} />
              </CCol>
            </CRow>
          </CModalBody>
          <CModalFooter>
            <CButton color="secondary" onClick={() => setAssignShedLogModal(false)}>
              Close
            </CButton>
          </CModalFooter>
        </CModal>
      </CCard>
    </>
  )
}
export default ShedMasterTable
