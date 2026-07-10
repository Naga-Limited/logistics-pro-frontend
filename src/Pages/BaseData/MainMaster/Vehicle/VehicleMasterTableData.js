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
import VehicleMasterService from 'src/Service/Master/VehicleMasterService'
import { useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Loader from 'src/components/Loader'
import CustomSpanButton from 'src/components/customComponent/CustomSpanButton'
import * as XLSX from 'xlsx'
import FileSaver from 'file-saver'
import { getCurrentDateTime, GetDateTimeFormat } from 'src/Pages/Depo/CommonMethods/CommonMethods'
import AccessDeniedComponent from 'src/components/commoncomponent/AccessDeniedComponent'
import JavascriptInArrayComponent from 'src/components/commoncomponent/JavascriptInArrayComponent'
import * as LogisticsProScreenNumberConstants from 'src/components/constants/LogisticsProScreenNumberConstants'
import UserLoginMasterService from 'src/Service/Master/UserLoginMasterService'
import VehicleTypeService from 'src/Service/SmallMaster/Vehicles/VehicleTypeService'
import VehicleCapacityService from 'src/Service/SmallMaster/Vehicles/VehicleCapacityService'
import VehicleBodyTypeService from 'src/Service/SmallMaster/Vehicles/VehicleBodyTypeService'
import VehicleVarietyService from 'src/Service/SmallMaster/Vehicles/VehicleVarietyService'
import VehicleGroupService from 'src/Service/SmallMaster/Vehicles/VehicleGroupService'

const VehicleMasterTableData = () => {
  const [RCCopyFront, setRCCopyFront] = useState(false)
  const [RCCopyBack, setRCCopyBack] = useState(false)
  const [InsuranceCopyBack, setInsuranceCopyBack] = useState(false)
  const [InsuranceCopyFront, setInsuranceCopyFront] = useState(false)
  const REQ = () => <span className="text-danger"> * </span>
  const [rowData, setRowData] = useState([])
  const [mount, setMount] = useState(1)
  const [pending, setPending] = useState(true)
  const [assignMigoModal, setAssignMigoModal] = useState(false)
  const [displayVehicleLogData, setDisplayVehicleLogData] = useState([])
  const [userMasterData, setUserMasterdata] = useState([])
  const [vehiclesData, setVehiclesData] = useState([])
  const [vehicleTypeData, setVehicleTypeData] = useState([])
  const [vehicleCapacityData, setVehicleCapacityData] = useState([])
  const [vehicleBodyTypeData, setVehicleBodyTypeData] = useState([])
  const [vehicleVarietyData, setVehicleVarietyData] = useState([])
  const [vehicleGroupData, setVehicleGroupData] = useState([])

  /*================== User Location Fetch ======================*/
  const user_info_json = localStorage.getItem('user_info')
  const user_info = JSON.parse(user_info_json)
  const user_locations = []
  const user_id = user_info.user_id

  /* Get User Locations From Local Storage */
  user_info.location_info.map((data, index) => {
    user_locations.push(data.id)
  })

  // console.log(user_locations)
  /*================== User Location Fetch ======================*/

  /* ==================== Access Part Start ========================*/
  const [screenAccess, setScreenAccess] = useState(false)
  let page_no_for_view_access =
    LogisticsProScreenNumberConstants.MasterAccessModule.Vehicle_Master_View
  let page_no_for_edit_access =
    LogisticsProScreenNumberConstants.MasterAccessModule.Vehicle_Master_Edit

  const edit_access = JavascriptInArrayComponent(
    page_no_for_edit_access,
    user_info.page_permissions
  )

  useEffect(() => {
    if (
      user_info.is_admin == 1 ||
      JavascriptInArrayComponent(page_no_for_view_access, user_info.page_permissions)
    ) {
      console.log('screen-access-allowed')
      setScreenAccess(true)
    } else {
      console.log('screen-access-not-allowed')
      setScreenAccess(false)
    }
  }, [])
  /* ==================== Access Part End ========================*/

  const [documentSrc, setDocumentSrc] = useState('')
  let viewData

  const getdata = (id) => {
    let dat = []
    vehiclesData.map((jj, hh) => {
      if (jj.vehicle_id == id) {
        dat.push(jj)
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

  function changeVehicleStatus(id, rowVehicleData = null) {
    let singleVehicleData = rowVehicleData ? [rowVehicleData] : getdata(id)
    const formData = new FormData()

    if (singleVehicleData.length == 0) {
      toast.warning('Invalid Vehicle Data..')
      return false
    }

    formData.append('id', id)
    formData.append('updated_by', user_id)
    formData.append('before_delete_type', singleVehicleData[0].vehicle_status)
    formData.append('after_delete_type', singleVehicleData[0].vehicle_status == 0 ? '1' : '0')
    formData.append('status', singleVehicleData[0].vehicle_status == 0 ? '1' : '0')

    let current_time = getCurrentDateTime()
    let current_info = getOldLogInfo(singleVehicleData[0].log_info)
    current_info.push({
      vehicle_number: singleVehicleData[0].vehicle_number
        ? singleVehicleData[0].vehicle_number
        : '',
      vehicle_type_id: singleVehicleData[0].vehicle_type_info
        ? singleVehicleData[0].vehicle_type_info.id
        : '',
      vehicle_type_name: singleVehicleData[0].vehicle_type_info
        ? singleVehicleData[0].vehicle_type_info.type
        : '',
      vehicle_capacity_id: singleVehicleData[0].vehicle_capacity_info
        ? singleVehicleData[0].vehicle_capacity_info.id
        : '',
      vehicle_capacity_name: singleVehicleData[0].vehicle_capacity_info
        ? singleVehicleData[0].vehicle_capacity_info.capacity
        : '',
      vehicle_body_type_id: singleVehicleData[0].vehicle_body_type_info
        ? singleVehicleData[0].vehicle_body_type_info.id
        : '',
      vehicle_body_type_name: singleVehicleData[0].vehicle_body_type_info
        ? singleVehicleData[0].vehicle_body_type_info.body_type
        : '',
      vehicle_variety_id: singleVehicleData[0].vehicle_variety_info
        ? singleVehicleData[0].vehicle_variety_info.id
        : '',
      vehicle_variety_name: singleVehicleData[0].vehicle_variety_info
        ? singleVehicleData[0].vehicle_variety_info.vehicle_variety
        : '',
      vehicle_group_id: singleVehicleData[0].vehicle_group_info
        ? singleVehicleData[0].vehicle_group_info.id
        : '',
      vehicle_group_name: singleVehicleData[0].vehicle_group_info
        ? singleVehicleData[0].vehicle_group_info.vehicle_group
        : '',
      vehicle_length: singleVehicleData[0].vehicle_length
        ? singleVehicleData[0].vehicle_length
        : '',
      vehicle_width: singleVehicleData[0].vehicle_width ? singleVehicleData[0].vehicle_width : '',
      vehicle_height: singleVehicleData[0].vehicle_height
        ? singleVehicleData[0].vehicle_height
        : '',
      insurance_validity: singleVehicleData[0].insurance_validity
        ? singleVehicleData[0].insurance_validity
        : '',
      fc_validity: singleVehicleData[0].fc_validity
        ? singleVehicleData[0].fc_validity
        : '',
      type: singleVehicleData[0].vehicle_status == 0 ? '4' : '3',
      user: user_info.emp_name || user_id,
      time: current_time,
      remarks: '',
    })
    formData.append('log_info', JSON.stringify(current_info))

    VehicleMasterService.softDeleteVehicles(formData).then((res) => {
      if (res.status == 200) {
        toast.success('Vehicle Status Updated Successfully!')
        setMount((preState) => preState + 1)
      } else {
        toast.warning('There is a problem occurs on Vehicle Status Updation..!')
      }
    })
  }

  //section for handling view model for each model

  function handleViewDocuments(e, id, type) {
    switch (type) {
      case 'RC_FRONT':
        {
          let singleVehicleInfo = vehiclesData.filter((data) => data.vehicle_id == id)
          setDocumentSrc(singleVehicleInfo[0].rc_copy_front)
          setRCCopyFront(true)
        }
        break
      case 'RC_BACK':
        {
          let singleVehicleInfo = vehiclesData.filter((data) => data.vehicle_id == id)
          setDocumentSrc(singleVehicleInfo[0].rc_copy_back)
          setRCCopyBack(true)
        }
        break
      case 'INSURANCE_FRONT':
        {
          let singleVehicleInfo = vehiclesData.filter((data) => data.vehicle_id == id)
          setDocumentSrc(singleVehicleInfo[0].insurance_copy_front)
          setInsuranceCopyFront(true)
        }
        break
      case 'INSURANCE_BACK':
        {
          let singleVehicleInfo = vehiclesData.filter((data) => data.vehicle_id == id)
          setDocumentSrc(singleVehicleInfo[0].insurance_copy_back)
          setInsuranceCopyBack(true)
        }
        break
      default:
        return 0
    }
  }

  const exportToCSV = () => {
    let dateTimeString = GetDateTimeFormat(1)
    let fileName = 'Vehicle_Master_Report_' + dateTimeString
    const fileType =
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
    const fileExtension = '.xlsx'
    const ws = XLSX.utils.json_to_sheet(rowData)
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] }
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
    const data = new Blob([excelBuffer], { type: fileType })
    FileSaver.saveAs(data, fileName + fileExtension)
  }

  useEffect(() => {
    VehicleMasterService.getVehicles().then((response) => {
      viewData = response.data.data
      setVehiclesData(viewData)
      let rowDataList = []
      viewData.map((data, index) => {
        rowDataList.push({
          sno: index + 1,
          Creation_Date: data.created_at,
          vehicle_Number: data.vehicle_number,
          Vehicle_Type: data.vehicle_type_info.type,
          Vehicle_Capacity: data.vehicle_capacity_info.capacity + '-TON',
          Vehicle_Bodytype: data.vehicle_body_type_info.body_type,
          Vehicle_Variety: data.vehicle_variety_info
            ? data.vehicle_variety_info.vehicle_variety
            : '-',
          Vehicle_Group: data.vehicle_group_info ? data.vehicle_group_info.vehicle_group : '-',
          vehicle_Length: data.vehicle_length,
          vehicle_Width: data.vehicle_width,
          vehicle_Height: data.vehicle_height,
          vehicle_Volume:
            data.vehicle_length && data.vehicle_width && data.vehicle_height
              ? parseFloat(data.vehicle_length * data.vehicle_width * data.vehicle_height).toFixed(
                  2
                )
              : 0,
          RC_Copy_Front: (
            <CustomSpanButton
              handleViewDocuments={handleViewDocuments}
              vehicleId={data.vehicle_id}
              documentType={'RC_FRONT'}
            />
          ),
          RC_Copy_Back: (
            <CustomSpanButton
              handleViewDocuments={handleViewDocuments}
              vehicleId={data.vehicle_id}
              documentType={'RC_BACK'}
            />
          ),
          Insuranance_Copy_Front: (
            <CustomSpanButton
              handleViewDocuments={handleViewDocuments}
              vehicleId={data.vehicle_id}
              documentType={'INSURANCE_FRONT'}
            />
          ),
          Insuranance_Copy_Back: (
            <CustomSpanButton
              handleViewDocuments={handleViewDocuments}
              vehicleId={data.vehicle_id}
              documentType={'INSURANCE_BACK'}
            />
          ),
          Insurance_Validity: data.insurance_validity,
          FC_Validity: data.fc_validity,
          Status: data.vehicle_status === 1 ? '✔️' : '❌',
          Action: (
            <div className="d-flex justify-content-space-between">
              <CButton
                size="sm"
                className="m-1"
                color={'info'}
                onClick={() => {
                  setAssignMigoModal(true)
                  assignVehicleLogInfo(viewData, data.vehicle_id)
                }}
              >
                <i className="fa fa-eye" aria-hidden="true"></i>
              </CButton>

              {(user_info && user_info.is_admin == 1) || edit_access ? (
                <>
                  <CButton
                    size="sm"
                    color="danger"
                    shape="rounded"
                    id={data.id}
                    onClick={() => {
                      changeVehicleStatus(data.vehicle_id, data)
                    }}
                    className="m-1"
                  >
                    {/* Delete */}
                    <i className="fa fa-trash" aria-hidden="true"></i>
                  </CButton>

                  <Link to={data.vehicle_status === 1 ? `Vehicle/${data.vehicle_id}` : ''}>
                    <CButton
                      disabled={data.vehicle_status === 1 ? false : true}
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
                </>
              ) : null}
            </div>
          ),
        })
      })
      setRowData(rowDataList)
      setPending(false)
    })

    UserLoginMasterService.getUser().then((res) => {
      let viewData = res.data.data
      setUserMasterdata(viewData)
    })

    VehicleTypeService.getVehicleTypes().then((res) => {
      setVehicleTypeData(res.data.data)
    })

    VehicleCapacityService.getVehicleCapacity().then((res) => {
      setVehicleCapacityData(res.data.data)
    })

    VehicleBodyTypeService.getVehicleBody().then((res) => {
      setVehicleBodyTypeData(res.data.data)
    })

    VehicleVarietyService.getVehicleVariety().then((res) => {
      setVehicleVarietyData(res.data.data)
    })

    VehicleGroupService.getVehicleGroup().then((res) => {
      setVehicleGroupData(res.data.data)
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
      name: 'Veh. Number',
      selector: (row) => row.vehicle_Number,
      sortable: true,
      center: true,
    },
    {
      name: 'Veh. Type',
      selector: (row) => row.Vehicle_Type,
      sortable: true,
      center: true,
    },
    {
      name: 'Veh. Capacity',
      selector: (row) => row.Vehicle_Capacity,
      sortable: true,
      center: true,
    },
    {
      name: 'Veh. Body Type',
      selector: (row) => row.Vehicle_Bodytype,
      sortable: true,
      center: true,
    },
    {
      name: 'Veh. Variety',
      selector: (row) => row.Vehicle_Variety,
      sortable: true,
      center: true,
    },
    {
      name: 'Veh. Group',
      selector: (row) => row.Vehicle_Group,
      sortable: true,
      center: true,
    },
    {
      name: 'RC Copy Front',
      selector: (row) => row.RC_Copy_Front,
      center: true,
    },
    {
      name: 'RC Copy Back',
      selector: (row) => row.RC_Copy_Back,
      center: true,
    },
    {
      name: 'Insurance Copy Front',
      selector: (row) => row.Insuranance_Copy_Front,
      center: true,
    },
    {
      name: ' Insurance Copy Back',
      selector: (row) => row.Insuranance_Copy_Back,
      center: true,
    },
    {
      name: 'Insurance Validity',
      selector: (row) => row.Insurance_Validity,
      center: true,
      sortable: true,
      // Cell: ({ row }) => row,
      Cell: ({ row }) => format(row, 'DD/mm/yyyy'),
    },
    {
      name: 'FC Validity',
      selector: (row) => row.FC_Validity,
      center: true,
      sortable: true,
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
    let statuses = ['', 'Created', 'Updated', 'In-Activated', 'Re-Activated']
    return statuses[id]
  }

  const userNameFinder = (id) => {
    const targetId = Number(id)
    let uname = ''
    if (targetId === 1) {
      uname = 'Admin'
    } else {
      userMasterData.map((vv, kk) => {
        if (Number(vv.user_id) === targetId) {
          uname = vv.emp_name
        }
      })
    }
    return uname || '--'
  }

  const getNameById = (list, id, key) => {
    const target = list.find((item) => Number(item.id) === Number(id))
    return target && target[key] ? target[key] : ''
  }

  const buildLogBackfillData = (vehicleId, logInfo) => {
    const formData = new FormData()
    formData.append('id', vehicleId)
    formData.append('log_info', JSON.stringify(logInfo))
    return formData
  }

  const assignVehicleLogInfo = (vdata, vno) => {
    let rowDataList = []

    const filterData = vdata.filter((data) => data.vehicle_id == vno)
    let needed_data = []
    try {
      needed_data = filterData[0].log_info ? JSON.parse(filterData[0].log_info) : []
    } catch (error) {
      needed_data = []
    }

    needed_data.map((data, index) => {
      const hasSnapshotData =
        data.vehicle_type_name ||
        data.vehicle_capacity_name ||
        data.vehicle_body_type_name ||
        data.vehicle_variety_name ||
        data.vehicle_group_name
      const hasSnapshotIds =
        data.vehicle_type_id ||
        data.vehicle_capacity_id ||
        data.vehicle_body_type_id ||
        data.vehicle_variety_id ||
        data.vehicle_group_id
      if (!hasSnapshotData && !hasSnapshotIds && filterData.length > 0) {
        data.vehicle_type_id = filterData[0].vehicle_type_info.id
        data.vehicle_type_name = filterData[0].vehicle_type_info.type
        data.vehicle_capacity_id = filterData[0].vehicle_capacity_info.id
        data.vehicle_capacity_name = filterData[0].vehicle_capacity_info.capacity
        data.vehicle_body_type_id = filterData[0].vehicle_body_type_info.id
        data.vehicle_body_type_name = filterData[0].vehicle_body_type_info.body_type
        data.vehicle_variety_id = filterData[0].vehicle_variety_info
          ? filterData[0].vehicle_variety_info.id
          : 0
        data.vehicle_variety_name = filterData[0].vehicle_variety_info
          ? filterData[0].vehicle_variety_info.vehicle_variety
          : ''
        data.vehicle_group_id = filterData[0].vehicle_group_info
          ? filterData[0].vehicle_group_info.id
          : 0
        data.vehicle_group_name = filterData[0].vehicle_group_info
          ? filterData[0].vehicle_group_info.vehicle_group
          : ''
      }

      const vehicleTypeName = data.vehicle_type_name
        ? data.vehicle_type_name
        : getNameById(vehicleTypeData, data.vehicle_type_id, 'type')
      const vehicleCapacityName = data.vehicle_capacity_name
        ? data.vehicle_capacity_name
        : getNameById(vehicleCapacityData, data.vehicle_capacity_id, 'capacity')
      const vehicleBodyTypeName = data.vehicle_body_type_name
        ? data.vehicle_body_type_name
        : getNameById(vehicleBodyTypeData, data.vehicle_body_type_id, 'body_type')
      const vehicleVarietyName = data.vehicle_variety_name
        ? data.vehicle_variety_name
        : getNameById(vehicleVarietyData, data.vehicle_variety_id, 'vehicle_variety')
      const vehicleGroupName = data.vehicle_group_name
        ? data.vehicle_group_name
        : getNameById(vehicleGroupData, data.vehicle_group_id, 'vehicle_group')

      rowDataList.push({
        sno: index + 1,
        Vehicle_Number: data.vehicle_number ? data.vehicle_number : filterData[0].vehicle_number,
        Vehicle_Type: vehicleTypeName ? vehicleTypeName : '-',
        Vehicle_Capacity: vehicleCapacityName ? vehicleCapacityName + '-TON' : '-',
        Vehicle_Bodytype: vehicleBodyTypeName ? vehicleBodyTypeName : '-',
        Vehicle_Variety: vehicleVarietyName ? vehicleVarietyName : '-',
        Vehicle_Group: vehicleGroupName ? vehicleGroupName : '-',
        Insurance_Validity: data.insurance_validity ? data.insurance_validity : filterData[0].insurance_validity,
        FC_Validity: data.fc_validity ? data.fc_validity : filterData[0].fc_validity,
        Status: statusFinder(data.type),
        Time: data.time,
        User: userNameFinder(data.user),
        Remarks: data.remarks ? data.remarks : '',
      })
    })
    setDisplayVehicleLogData(rowDataList)

    if (filterData.length > 0) {
      const needsBackfill = needed_data.some((item) => {
        const hasSnapshotData =
          item.vehicle_type_name ||
          item.vehicle_capacity_name ||
          item.vehicle_body_type_name ||
          item.vehicle_variety_name ||
          item.vehicle_group_name
        const hasSnapshotIds =
          item.vehicle_type_id ||
          item.vehicle_capacity_id ||
          item.vehicle_body_type_id ||
          item.vehicle_variety_id ||
          item.vehicle_group_id
        return !hasSnapshotData && !hasSnapshotIds
      })

      if (needsBackfill) {
        const formData = buildLogBackfillData(filterData[0].vehicle_id, needed_data)
        VehicleMasterService.backfillVehicleLog(formData)
      }
    }
  }

  const columns_child = [
    {
      name: 'S.No',
      selector: (row) => row.sno,
      sortable: true,
      center: true,
    },
    {
      name: 'Veh. Number',
      selector: (row) => row.Vehicle_Number,
      sortable: true,
      center: true,
    },
    {
      name: 'Veh. Type',
      selector: (row) => row.Vehicle_Type,
      sortable: true,
      center: true,
    },
    {
      name: 'Veh. Capacity',
      selector: (row) => row.Vehicle_Capacity,
      sortable: true,
      center: true,
    },
    {
      name: 'Veh. Body Type',
      selector: (row) => row.Vehicle_Bodytype,
      sortable: true,
      center: true,
    },
    {
      name: 'Veh. Variety',
      selector: (row) => row.Vehicle_Variety,
      sortable: true,
      center: true,
    },
    {
      name: 'Veh. Group',
      selector: (row) => row.Vehicle_Group,
      sortable: true,
      center: true,
    },
    {
      name: 'Insurance Validity',
      selector: (row) => row.Insurance_Validity,
      sortable: true,
      center: true,
    },
    {
      name: 'FC Validity',
      selector: (row) => row.FC_Validity,
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
                    fieldName={'vehicle_Number'}
                    showSearchFilter={true}
                    pending={pending}
                  />
                </CContainer>

                <CModal
                  size="xl"
                  backdrop="static"
                  scrollable
                  visible={assignMigoModal}
                  onClose={() => {
                    setAssignMigoModal(false)
                  }}
                >
                  <CModalHeader>
                    <CModalTitle>{`Log Information`}</CModalTitle>
                  </CModalHeader>
                  <CModalBody>
                    <CustomTable
                      columns={columns_child}
                      data={displayVehicleLogData}
                      fieldName={'vehicle_Number'}
                      showSearchFilter={true}
                    />
                  </CModalBody>
                  <CModalFooter>
                    <CButton
                      color="primary"
                      onClick={() => {
                        setAssignMigoModal(false)
                      }}
                    >
                      Close
                    </CButton>
                  </CModalFooter>
                </CModal>

                {/*Rc copy front model*/}
                <CModal visible={RCCopyFront} onClose={() => setRCCopyFront(false)}>
                  <CModalHeader>
                    <CModalTitle>RC Copy Front</CModalTitle>
                  </CModalHeader>
                  <CModalBody>
                    {!documentSrc.includes('.pdf') ? (
                      <CCardImage orientation="top" src={documentSrc} />
                    ) : (
                      <iframe orientation="top" height={500} width={475} src={documentSrc}></iframe>
                    )}
                  </CModalBody>
                  <CModalFooter>
                    <CButton color="secondary" onClick={() => setRCCopyFront(false)}>
                      Close
                    </CButton>
                  </CModalFooter>
                </CModal>
                {/*Rc copy front model*/}
                {/*Rc copy back model*/}
                <CModal visible={RCCopyBack} onClose={() => setRCCopyBack(false)}>
                  <CModalHeader>
                    <CModalTitle>RC Copy Back</CModalTitle>
                  </CModalHeader>
                  <CModalBody>
                    {!documentSrc.includes('.pdf') ? (
                      <CCardImage orientation="top" src={documentSrc} />
                    ) : (
                      <iframe orientation="top" height={500} width={475} src={documentSrc}></iframe>
                    )}
                  </CModalBody>
                  <CModalFooter>
                    <CButton color="secondary" onClick={() => setRCCopyBack(false)}>
                      Close
                    </CButton>
                    {/* <CButton color="primary">Save changes</CButton> */}
                  </CModalFooter>
                </CModal>
                {/*Rc copy back model*/}

                {/*Insurance copy front*/}
                <CModal visible={InsuranceCopyFront} onClose={() => setInsuranceCopyFront(false)}>
                  <CModalHeader>
                    <CModalTitle>Insurance Copy Front</CModalTitle>
                  </CModalHeader>
                  <CModalBody>
                    {!documentSrc.includes('.pdf') ? (
                      <CCardImage orientation="top" src={documentSrc} />
                    ) : (
                      <iframe orientation="top" height={500} width={475} src={documentSrc}></iframe>
                    )}
                  </CModalBody>
                  <CModalFooter>
                    <CButton color="secondary" onClick={() => setInsuranceCopyFront(false)}>
                      Close
                    </CButton>
                  </CModalFooter>
                </CModal>
                {/*Insurance copy front*/}
                {/*Insurance copy back*/}
                <CModal visible={InsuranceCopyBack} onClose={() => setInsuranceCopyBack(false)}>
                  <CModalHeader>
                    <CModalTitle>Insurance Copy Back</CModalTitle>
                  </CModalHeader>
                  <CModalBody>
                    {!documentSrc.includes('.pdf') ? (
                      <CCardImage orientation="top" src={documentSrc} />
                    ) : (
                      <iframe orientation="top" height={500} width={475} src={documentSrc}></iframe>
                    )}
                  </CModalBody>
                  <CModalFooter>
                    <CButton color="secondary" onClick={() => setInsuranceCopyBack(false)}>
                      Close
                    </CButton>
                  </CModalFooter>
                </CModal>
                {/*Insurance copy back*/}
              </CCard>
            </>
          ) : (
            <AccessDeniedComponent />
          )}
        </>
      )}
    </>
  )
}

export default VehicleMasterTableData
