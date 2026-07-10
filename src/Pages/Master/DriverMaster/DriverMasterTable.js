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
import CustomTable from 'src/components/customComponent/CustomTable'
import Loader from 'src/components/Loader'
import DriverMasterService from 'src/Service/Master/DriverMasterService'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import CustomSpanButton from 'src/components/customComponent/CustomSpanButton1'
import * as XLSX from 'xlsx';
import FileSaver from 'file-saver'
import { GetDateTimeFormat, getCurrentDateTime } from 'src/Pages/Depo/CommonMethods/CommonMethods'
import DriverTypeService from 'src/Service/SmallMaster/Drivers/DriverTypeService'
import UserLoginMasterService from 'src/Service/Master/UserLoginMasterService'

const DriverMasterTable = () => {
  const [LicenseCopyFront, setLicenseCopyFront] = useState(false)
  const [LicenseCopyBack, setLicenseCopyBack] = useState(false)
  const [AadharCopy, setAadharCopy] = useState(false)
  const [PanCopy, setPanCopy] = useState(false)
  const [fetch, setFetch] = useState(false)
  const [DriverPhoto, setDriverPhoto] = useState(false)

  const [rowData, setRowData] = useState([])
  const [mount, setMount] = useState(1)

  const [documentSrc, setDocumentSrc] = useState('')
  const [driverTypeData, setDriverTypeData] = useState([])
  const driverTypeDataRef = useRef([])
  const [assignDriverLogModal, setAssignDriverLogModal] = useState(false)
  const [assignDriverData, setAssignDriverData] = useState([])
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

  useEffect(() => {
    driverTypeDataRef.current = driverTypeData
  }, [driverTypeData])

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

  function changeDriverStatus(id) {
    let current_time = getCurrentDateTime()
    const filterData = rowData.filter((data) => data.id == id)
    const singleDriverData = viewDataRef.current.filter((data) => data.driver_id == id)
    
    let current_info = []
    let old_info = []
    try {
      old_info = singleDriverData[0].log_info ? JSON.parse(singleDriverData[0].log_info) : []
    } catch (error) {
      old_info = []
    }
    
    let current_status = singleDriverData[0].driver_status === 0 ? 1 : 0
    current_info.push({
      driver_type_id: singleDriverData[0].driver_type_id,
      driver_name: singleDriverData[0].driver_name,
      driver_code: singleDriverData[0].driver_code,
      driver_phone_1: singleDriverData[0].driver_phone_1,
      driver_phone_2: singleDriverData[0].driver_phone_2,
      license_no: singleDriverData[0].license_no,
      license_validity_to: singleDriverData[0].license_validity_to,
      license_validity_status: singleDriverData[0].license_validity_status,
      driver_address: singleDriverData[0].driver_address,
      driver_assigned_status: singleDriverData[0].driver_assigned_status,
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

    DriverMasterService.softDeleteDrivers(formData).then((res) => {
      toast.success('Driver Active Status Updated Successfully!')
      setMount((preState) => preState + 1)
    })
  }

  function changeDriverAssignStatus(id) {
    let current_time = getCurrentDateTime()
    const singleDriverData = viewDataRef.current.filter((data) => data.driver_id == id)

    if (!singleDriverData || singleDriverData.length === 0) {
      toast.error('Driver data not found!')
      return
    }

    let old_info = []
    try {
      old_info = singleDriverData[0].log_info ? JSON.parse(singleDriverData[0].log_info) : []
    } catch (error) {
      old_info = []
    }

    let new_assign_status = singleDriverData[0].driver_assigned_status === 1 ? 0 : 1

    let current_info = [{
      driver_type_id: singleDriverData[0].driver_type_id,
      driver_name: singleDriverData[0].driver_name,
      driver_code: singleDriverData[0].driver_code,
      driver_phone_1: singleDriverData[0].driver_phone_1,
      driver_phone_2: singleDriverData[0].driver_phone_2,
      license_no: singleDriverData[0].license_no,
      license_validity_to: singleDriverData[0].license_validity_to,
      license_validity_status: singleDriverData[0].license_validity_status,
      driver_address: singleDriverData[0].driver_address,
      driver_assigned_status: new_assign_status,
      type: 2,
      user: user_info.emp_name || user_id,
      time: current_time,
      remarks: new_assign_status === 1 ? 'Assigned' : 'Not Assigned',
    }]

    let complete_info = [...old_info, ...current_info]
    let formData = new FormData()
    formData.append('id', id)
    formData.append('assign_status', new_assign_status)
    formData.append('log_info', JSON.stringify(complete_info))

    DriverMasterService.assignDriverWithLog(formData).then((res) => {
      toast.success('Driver Assign Status Updated Successfully!')
      setMount((preState) => preState + 1)
    })
  }

  //section for handling view model for each model

  function handleViewDocuments(e, id, type) {
    switch (type) {
      case 'LC_FRONT':
        {
          let singleDriverInfo = viewDataRef.current.filter((data) => data.driver_id == id)
          // console.log(viewData)
          setDocumentSrc(singleDriverInfo[0].license_copy_front)
          setLicenseCopyFront(true)
        }
        break
      case 'LC_BACK':
        {
          let singleDriverInfo = viewDataRef.current.filter((data) => data.driver_id == id)
          setDocumentSrc(singleDriverInfo[0].license_copy_back)
          setLicenseCopyBack(true)
        }
        break
      case 'AADHAR_COPY':
        {
          let singleDriverInfo = viewDataRef.current.filter((data) => data.driver_id == id)
          setDocumentSrc(singleDriverInfo[0].aadhar_card)
          setAadharCopy(true)
        }
        break
      case 'PAN_COPY':
        {
          let singleDriverInfo = viewDataRef.current.filter((data) => data.driver_id == id)
          setDocumentSrc(singleDriverInfo[0].pan_card)
          setPanCopy(true)
        }
        break
      case 'DRIVER_COPY':
        {
          let singleDriverInfo = viewDataRef.current.filter((data) => data.driver_id == id)
          setDocumentSrc(singleDriverInfo[0].driver_photo)
          setDriverPhoto(true)
        }
        break
    }
  }

  const exportToCSV = () => {
    let dateTimeString = GetDateTimeFormat(1)
    let fileName='Driver_Master_Report_'+dateTimeString
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';
    const ws = XLSX.utils.json_to_sheet(rowData);
    const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], {type: fileType});
    FileSaver.saveAs(data, fileName + fileExtension);
  }

  useEffect(() => {
    DriverTypeService.getDriverTypes().then((res) => {
      setDriverTypeData(res.data.data)
    })

    DriverMasterService.getDrivers().then((response) => {
      setFetch(true)
      setViewData(response.data.data)
      console.log(response.data.data,'response.data.data')
      let rowDataList = []
      response.data.data.map((data, index) => {
        rowDataList.push({
          sno: index + 1,
          Creation_Date: data.created_at,
          Driver_Type: data.driver_type_info.driver_type,
          Driver_Name: data.driver_name,
          Driver_Code: data.driver_code,
          Driver_Phone1: data.driver_phone_1,
          Driver_Phone2: data.driver_phone_2,
          License_Number: data.license_no,
          License_Valid_To: data.license_validity_to,
          LC_Copy_Front: (
            <CustomSpanButton
              handleViewDocuments={handleViewDocuments}
              driverId={data.driver_id}
              documentType={'LC_FRONT'}
            />
          ),
          LC_Copy_Back: (
            <CustomSpanButton
              handleViewDocuments={handleViewDocuments}
              driverId={data.driver_id}
              documentType={'LC_BACK'}
            />
          ),
          License_Validity: data.license_validity_status === 1 ? 'Valid' : 'Invalid',
          Aadhar_Copy: (
            <CustomSpanButton
              handleViewDocuments={handleViewDocuments}
              driverId={data.driver_id}
              documentType={'AADHAR_COPY'}
            />
          ),
          Pan_Copy: (
            <CustomSpanButton
              handleViewDocuments={handleViewDocuments}
              driverId={data.driver_id}
              documentType={'PAN_COPY'}
            />
          ),
          Driver_Copy: (
            <CustomSpanButton
              handleViewDocuments={handleViewDocuments}
              driverId={data.driver_id}
              documentType={'DRIVER_COPY'}
            />
          ),
          Vehicle_Number: data.vehicle_no ? data.vehicle_no : '-',
          Tripsheet_Number: data.tripsheet_no ? data.tripsheet_no : '-',
          Driver_Address: data.driver_address,
          Assigned_Status: data.driver_assigned_status === 1 ? '✔️' : '❌',
          Status: data.driver_status === 1 ? '✔️' : '❌',
          Action: (
            <div className="d-flex justify-content-space-between">
              <CButton
                size="sm"
                color={data.driver_assigned_status === 1 ? 'success' :"danger"}
                shape="rounded"
                id={data.id}
                onClick={() => {
                  changeDriverAssignStatus(data.driver_id)
                }}
                className="m-1"
              >
                {/* Assign */}
                {data.driver_assigned_status === 1 ? (
                  <i className="fa fa-check" aria-hidden="true"></i>
                ) : (
                  <i className="fa fa-window-close-o" aria-hidden="true"></i>
                )}
                
              </CButton>
              <CButton
                size="sm"
                className="m-1"
                color={'info'}
                onClick={() => {
                  setAssignDriverLogModal(true)
                  assignDriverLogInfo(data.driver_id)
                }}
              >
                <i className="fa fa-eye" aria-hidden="true"></i>
              </CButton>
              <CButton
                size="sm"
                color={data.driver_status === 1 ? 'success' :"danger"}
                shape="rounded"
                id={data.id}
                onClick={() => {
                  changeDriverStatus(data.driver_id)
                }}
                className="m-1"
              >
                {/* Delete */}
                <i className="fa fa-trash" aria-hidden="true"></i>
              </CButton>
              
              <Link to={data.driver_status === 1 ? `DriverMaster/${data.driver_id}` : ''}>
                <CButton
                  size="sm"
                  disabled={data.driver_status === 1 ? false : true}
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
      name: 'Creation Date',
      selector: (row) => row.Creation_Date,
      sortable: true,
      center: true,
    },
    {
      name: 'Driver Type',
      selector: (row) => row.Driver_Type,
      sortable: true,
      center: true,
    },
    {
      name: 'Driver Name',
      selector: (row) => row.Driver_Name,
      sortable: true,
      center: true,
    },
    {
      name: 'Driver Code',
      selector: (row) => row.Driver_Code,
      sortable: true,
      center: true,
    },
    {
      name: 'Driver Mobile Number 1',
      selector: (row) => row.Driver_Phone1,
      sortable: true,
      center: true,
    },
    {
      name: 'Driver Mobile Number 2',
      selector: (row) => row.Driver_Phone2,
      sortable: true,
      center: true,
    },
    {
      name: 'License Number',
      selector: (row) => row.License_Number,
      sortable: true,
      center: true,
    },
    {
      name: 'License Valid To',
      selector: (row) => row.License_Valid_To,
      sortable: true,
      center: true,
    },
    {
      name: 'License Validity Status',
      selector: (row) => row.License_Validity,
      sortable: true,
      center: true,
    },
    {
      name: 'License Copy Front',
      selector: (row) => row.LC_Copy_Front,
      center: true,
    },
    {
      name: ' License Copy Back',
      selector: (row) => row.LC_Copy_Back,
      center: true,
    },

    {
      name: 'Aadhar Card',
      selector: (row) => row.Aadhar_Copy,
      center: true,
    },
    {
      name: 'PAN Card',
      selector: (row) => row.Pan_Copy,
      center: true,
    },
    {
      name: 'Driver Photo',
      selector: (row) => row.Driver_Copy,
      center: true,
    },
    {
      name: 'Vehicle Number',
      selector: (row) => row.Vehicle_Number,
      center: true,
    },
    {
      name: 'Tripsheet Number',
      selector: (row) => row.Tripsheet_Number,
      center: true,
    },
    {
      name: 'Driver Address',
      selector: (row) => row.Driver_Address,
      sortable: true,
      center: true,
    },
    {
      name: 'Assigned Status',
      selector: (row) => row.Assigned_Status,
      sortable: true,
      center: true,
    },
    {
      name: 'Active Status',
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

  //============ column header data=========

  const getNameById = (data, id, fieldName) => {
    const item = data.find((item) => item.id == id || item[`${fieldName}_id`] == id)
    return item ? item[fieldName] : ''
  }

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

  const assignDriverLogInfo = (dno) => {
    let rowDataList = []

    const filterData = viewDataRef.current.filter((data) => data.driver_id == dno)
    let needed_data = []
    try {
      needed_data = filterData[0].log_info ? JSON.parse(filterData[0].log_info) : []
    } catch (error) {
      needed_data = []
    }

    needed_data = needed_data.filter((data) => data.type !== 1)

    needed_data.map((data, index) => {
      const currentDriver = filterData[0]
      const driverTypeId = data.driver_type_id ? data.driver_type_id : currentDriver.driver_type_id
      // Use driver_type_info from current record as primary source (avoids stale driverTypeData closure)
      const driverTypeName = data.driver_type_name
        ? data.driver_type_name
        : (currentDriver.driver_type_info && currentDriver.driver_type_info.driver_type)
          ? currentDriver.driver_type_info.driver_type
          : getNameById(driverTypeDataRef.current, driverTypeId, 'driver_type')

      rowDataList.push({
        sno: index + 1,
        Driver_Type: driverTypeName ? driverTypeName : '-',
        Driver_Name: data.driver_name ? data.driver_name : '-',
        Driver_Code: data.driver_code ? data.driver_code : '-',
        Driver_Phone1: data.driver_phone_1 ? data.driver_phone_1 : '-',
        Driver_Phone2: data.driver_phone_2 ? data.driver_phone_2 : '-',
        License_Number: data.license_no ? data.license_no : '-',
        License_Valid_To: data.license_validity_to ? data.license_validity_to : '-',
        License_Validity: data.license_validity_status === 1 || data.license_validity_status === 'Yes' ? 'Valid' : 'Invalid',
        Driver_Address: data.driver_address ? data.driver_address : '-',
        Assigned_Status: data.driver_assigned_status === 1 ? 'Assigned' : 'Not Assigned',
        Status: statusFinder(data.type),
        Time: data.time,
        User: userNameFinder(data.user),
        Remarks: data.remarks,
      })
    })

    setAssignDriverData(rowDataList)
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
      name: 'Driver Type',
      selector: (row) => row.Driver_Type,
      sortable: true,
      center: true,
    },
    {
      name: 'Driver Name',
      selector: (row) => row.Driver_Name,
      sortable: true,
      center: true,
    },
    {
      name: 'Driver Code',
      selector: (row) => row.Driver_Code,
      sortable: true,
      center: true,
    },
    {
      name: 'Driver Mobile Number 1',
      selector: (row) => row.Driver_Phone1,
      sortable: true,
      center: true,
    },
    {
      name: 'Driver Mobile Number 2',
      selector: (row) => row.Driver_Phone2,
      sortable: true,
      center: true,
    },
    {
      name: 'License Number',
      selector: (row) => row.License_Number,
      sortable: true,
      center: true,
    },
    {
      name: 'License Valid To',
      selector: (row) => row.License_Valid_To,
      sortable: true,
      center: true,
    },
    {
      name: 'License Validity Status',
      selector: (row) => row.License_Validity,
      sortable: true,
      center: true,
    },
    {
      name: 'Driver Address',
      selector: (row) => row.Driver_Address,
      sortable: true,
      center: true,
    },
    {
      name: 'Assigned Status',
      selector: (row) => row.Assigned_Status,
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
              <Link className="text-white" to="/DriverMaster">
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
          <CCard>
            <CContainer>
              <CustomTable
                columns={columns}
                data={rowData}
                // fieldName={'Driver_Name'}
                showSearchFilter={true}
              />
            </CContainer>
          </CCard>
          {/*License copy front model*/}
          <CModal visible={LicenseCopyFront} onClose={() => setLicenseCopyFront(false)}>
            <CModalHeader>
              <CModalTitle>License Copy Front</CModalTitle>
            </CModalHeader>
            <CModalBody>
              {!documentSrc.includes('.pdf') ? (
                <CCardImage orientation="top" src={documentSrc} />
              ) : (
                <iframe orientation="top" height={500} width={475} src={documentSrc}></iframe>
              )}
            </CModalBody>
            <CModalFooter>
              <CButton color="secondary" onClick={() => setLicenseCopyFront(false)}>
                Close
              </CButton>
            </CModalFooter>
          </CModal>
          {/*License copy front model*/}
          {/*License copy Back model*/}
          <CModal visible={LicenseCopyBack} onClose={() => setLicenseCopyBack(false)}>
            <CModalHeader>
              <CModalTitle>License Copy Back</CModalTitle>
            </CModalHeader>
            <CModalBody>
              {!documentSrc.includes('.pdf') ? (
                <CCardImage orientation="top" src={documentSrc} />
              ) : (
                <iframe orientation="top" height={500} width={475} src={documentSrc}></iframe>
              )}
            </CModalBody>
            <CModalFooter>
              <CButton color="secondary" onClick={() => setLicenseCopyBack(false)}>
                Close
              </CButton>
            </CModalFooter>
          </CModal>
          {/*License copy Back model*/}
          {/*Aadhar copy model*/}
          <CModal visible={AadharCopy} onClose={() => setAadharCopy(false)}>
            <CModalHeader>
              <CModalTitle>Aadhar Copy</CModalTitle>
            </CModalHeader>
            <CModalBody>
              {!documentSrc.includes('.pdf') ? (
                <CCardImage orientation="top" src={documentSrc} />
              ) : (
                <iframe orientation="top" height={500} width={475} src={documentSrc}></iframe>
              )}
            </CModalBody>
            <CModalFooter>
              <CButton color="secondary" onClick={() => setAadharCopy(false)}>
                Close
              </CButton>
            </CModalFooter>
          </CModal>
          {/*Aadhar copy model*/}
          {/*Pan copy model*/}
          <CModal visible={PanCopy} onClose={() => setPanCopy(false)}>
            <CModalHeader>
              <CModalTitle>Pan Copy</CModalTitle>
            </CModalHeader>
            <CModalBody>
              {!documentSrc.includes('.pdf') ? (
                <CCardImage orientation="top" src={documentSrc} />
              ) : (
                <iframe orientation="top" height={500} width={475} src={documentSrc}></iframe>
              )}
            </CModalBody>
            <CModalFooter>
              <CButton color="secondary" onClick={() => setPanCopy(false)}>
                Close
              </CButton>
            </CModalFooter>
          </CModal>
          {/*Pan copy model*/}
          {/*Driver Photo model*/}
          <CModal visible={DriverPhoto} onClose={() => setDriverPhoto(false)}>
            <CModalHeader>
              <CModalTitle>Driver Photo</CModalTitle>
            </CModalHeader>
            <CModalBody>
              {!documentSrc.includes('.pdf') ? (
                <CCardImage orientation="top" src={documentSrc} />
              ) : (
                <iframe orientation="top" height={500} width={475} src={documentSrc}></iframe>
              )}
            </CModalBody>
            <CModalFooter>
              <CButton color="secondary" onClick={() => setDriverPhoto(false)}>
                Close
              </CButton>
            </CModalFooter>
          </CModal>

          <CModal
            size="xl"
            visible={assignDriverLogModal}
            onClose={() => setAssignDriverLogModal(false)}
          >
            <CModalHeader>
              <CModalTitle>Log Information</CModalTitle>
            </CModalHeader>
            <CModalBody>
              <CRow className="">
                <CCol md={12}>
                  <CustomTable columns={columns_child} data={assignDriverData} />
                </CCol>
              </CRow>
            </CModalBody>
            <CModalFooter>
              <CButton color="secondary" onClick={() => setAssignDriverLogModal(false)}>
                Close
              </CButton>
            </CModalFooter>
          </CModal>

          {/*Driver Photo model*/}
        </>
      )}
    </>
  )
}

export default DriverMasterTable
