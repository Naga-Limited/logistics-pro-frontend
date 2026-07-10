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
import VehicleMasterService from 'src/Service/Master/VehicleMasterService'
import { useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Loader from 'src/components/Loader'
import CustomSpanButton from 'src/components/customComponent/CustomSpanButton'
import * as XLSX from 'xlsx';
import FileSaver from 'file-saver'
import { GetDateTimeFormat, getCurrentDateTime } from 'src/Pages/Depo/CommonMethods/CommonMethods'
import NLFSVehicleMsterApi from 'src/Service/NLFS/Master/NLFSVehicleMasterApi'
import UserLoginMasterService from 'src/Service/Master/UserLoginMasterService'

const NLFSVehicleMasterTable = () => {
  const [RCCopyFront, setRCCopyFront] = useState(false)
  const [RCCopyBack, setRCCopyBack] = useState(false)
  const [InsuranceCopyBack, setInsuranceCopyBack] = useState(false)
  const [InsuranceCopyFront, setInsuranceCopyFront] = useState(false)
  const REQ = () => <span className="text-danger"> * </span>
  const [rowData, setRowData] = useState([])
  const [mount, setMount] = useState(1)
  const [pending, setPending] = useState(true)

  const [documentSrc, setDocumentSrc] = useState('')
  let viewData
  const viewDataRef = useRef([])
  const [userMasterData, setUserMasterData] = useState([])
  const [assignNLFSVehicleLogModal, setAssignNLFSVehicleLogModal] = useState(false)
  const [assignNLFSVehicleData, setAssignNLFSVehicleData] = useState([])

  /*================== User Id & Location Fetch ======================*/
  const user_info_json = localStorage.getItem('user_info')
  const user_info = JSON.parse(user_info_json)
  const user_id = user_info.user_id

  const userNameFinder = (id) => {
    if (typeof id === 'string' && isNaN(id)) return id
    let user = userMasterData.find((user) => user.user_id == id)
    return user ? user.emp_name : '--'
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

  function changeVehicleStatus(id) {
    let current_time = getCurrentDateTime()
    const singleVehicleData = viewDataRef.current.filter((data) => data.vehicle_id == id)

    let old_info = []
    try {
      old_info = singleVehicleData[0].log_info ? JSON.parse(singleVehicleData[0].log_info) : []
    } catch (error) {
      old_info = []
    }

    let current_status = singleVehicleData[0].status == 0 ? 1 : 0
    let current_info = [{
      division_id: singleVehicleData[0].division_id,
      plant_id: singleVehicleData[0].plant_id,
      vehicle_no: singleVehicleData[0].vehicle_no,
      vehicle_user_name: singleVehicleData[0].vehicle_user_name,
      vehicle_user_emp_code: singleVehicleData[0].vehicle_user_emp_code,
      vehicle_capacity_id: singleVehicleData[0].vehicle_capacity_id,
      vehicle_variety_id: singleVehicleData[0].vehicle_variety_id,
      vehicle_model_type_id: singleVehicleData[0].vehicle_model_type_id,
      fuel_type_id: singleVehicleData[0].fuel_type_id,
      tank_capacity_type_id: singleVehicleData[0].tank_capacity_type_id,
      remarks: singleVehicleData[0].remarks,
      type: 3,
      user: user_info.emp_name || user_id,
      time: current_time,
    }]

    let complete_info = [...old_info, ...current_info]

    let formData = new FormData()
    formData.append('id', id)
    formData.append('status', current_status)
    formData.append('log_info', JSON.stringify(complete_info))

    NLFSVehicleMsterApi.softDeleteNLFSVehicles(formData).then((res) => {
      toast.success('Vehicle Status Updated Successfully!')
      setMount((preState) => preState + 1)
    })
  }

  const exportToCSV = () => {
    let dateTimeString = GetDateTimeFormat(1)
    let fileName='NLFS_Vehicle_Master_Report_'+dateTimeString
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';
    const ws = XLSX.utils.json_to_sheet(rowData);
    const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], {type: fileType});
    FileSaver.saveAs(data, fileName + fileExtension);
  }

  useEffect(() => {
    NLFSVehicleMsterApi.getNLFSVehicles().then((response) => {
      viewData = response.data.data
      viewDataRef.current = response.data.data
      let rowDataList = []
      viewData.map((data, index) => {
        rowDataList.push({
          sno: index + 1,
          Creation_Date: data.created_at,          
          vehicle_Number: data.vehicle_no,
          Vehicle_Division: data.vehicle_division_info.short_name,
          Vehicle_Variety: data.vehicle_variety_info ? data.vehicle_variety_info.vehicle_variety : '-',
          Vehicle_Capacity: data.vehicle_capacity_info.capacity + '-TON',
          Vehicle_Model: data.vehicle_model_info.dropdown_list_name,
          Vehicle_FuelType: data.vehicle_fuel_info.dropdown_list_name,
          Vehicle_FuelTankCapacity: data.vehicle_fuel_tank_capacity_info.dropdown_list_name,
          Vehicle_Username: data.vehicle_user_info.username,
          Vehicle_UserEmpCode: data.vehicle_user_info.empid,
          Status: data.status == 1 ? '✔️' : '❌',
          Creation_Time: data.created_at_format,
          Action: (
            <div className="d-flex justify-content-space-between">
              <CButton
                size="sm"
                className="m-1"
                color={'info'}
                onClick={() => {
                  setAssignNLFSVehicleLogModal(true)
                  assignNLFSVehicleLogInfo(data.vehicle_id)
                }}
              >
                <i className="fa fa-eye" aria-hidden="true"></i>
              </CButton>
              <CButton
                size="sm"
                color={data.status == 1 ? 'success' : 'danger'}
                shape="rounded"
                id={data.id}
                onClick={() => {
                  changeVehicleStatus(data.vehicle_id)
                }}
                className="m-1"
              >
                {/* Delete */}
                <i className="fa fa-trash" aria-hidden="true"></i>
              </CButton>

              <Link to={data.status == 1 ? `NLFSVehicleMaster/${data.vehicle_id}` : ''}>
                <CButton
                  disabled={data.status == 1 ? false : true}
                  size="sm"
                  color="secondary"
                  shape="rounded"
                  id={data.vehicle_id}
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
      setRowData(rowDataList)
      setPending(false)
    })

    UserLoginMasterService.getUser().then((res) => {
      setUserMasterData(res.data.data)
    })
  }, [mount])

  const assignNLFSVehicleLogInfo = (vid) => {
    let rowDataList = []

    const filterData = viewDataRef.current.filter((data) => data.vehicle_id == vid)
    console.log(filterData, 'filterData for vid:', vid)
    let needed_data = []
    try {
      if (filterData[0].log_info) {
        needed_data = typeof filterData[0].log_info === 'string' 
          ? JSON.parse(filterData[0].log_info) 
          : filterData[0].log_info
      } else {
        needed_data = []
      }
    } catch (error) {
      console.error('Error parsing log_info:', error)
      needed_data = []
    }

    console.log(needed_data, 'parsed needed_data')

    needed_data.map((data, index) => {
      rowDataList.push({
        sno: index + 1,
        Vehicle_Number: data.vehicle_no ? data.vehicle_no : '-',
        Division: data.division_name ? data.division_name : (filterData[0].vehicle_division_info ? filterData[0].vehicle_division_info.short_name : '-'),
        Plant: data.plant_name ? data.plant_name : (filterData[0].vehicle_plant_info ? filterData[0].vehicle_plant_info.dropdown_list_name : '-'),
        Vehicle_Capacity: data.vehicle_capacity_name ? data.vehicle_capacity_name : (filterData[0].vehicle_capacity_info ? filterData[0].vehicle_capacity_info.capacity + '-TON' : '-'),
        Vehicle_Variety: data.vehicle_variety_name ? data.vehicle_variety_name : (filterData[0].vehicle_variety_info ? filterData[0].vehicle_variety_info.vehicle_variety : '-'),
        Vehicle_Model: data.vehicle_model_name ? data.vehicle_model_name : (filterData[0].vehicle_model_info ? filterData[0].vehicle_model_info.dropdown_list_name : '-'),
        Vehicle_FuelType: data.vehicle_fuel_type_name ? data.vehicle_fuel_type_name : (filterData[0].vehicle_fuel_info ? filterData[0].vehicle_fuel_info.dropdown_list_name : '-'),
        Vehicle_FuelTankCapacity: data.vehicle_fuel_tank_capacity_name ? data.vehicle_fuel_tank_capacity_name : (filterData[0].vehicle_fuel_tank_capacity_info ? filterData[0].vehicle_fuel_tank_capacity_info.dropdown_list_name : '-'),
        User_Name: data.vehicle_user_name ? data.vehicle_user_name : '-',
        User_Emp_Code: data.vehicle_user_emp_code ? data.vehicle_user_emp_code : '-',
        Status: statusFinder(data.type),
        Time: data.time,
        User: userNameFinder(data.user),
      })
    })

    setAssignNLFSVehicleData(rowDataList)
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
      name: 'Vehicle Number',
      selector: (row) => row.Vehicle_Number,
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
      name: 'Plant',
      selector: (row) => row.Plant,
      sortable: true,
      center: true,
    },
    {
      name: 'Vehicle Capacity',
      selector: (row) => row.Vehicle_Capacity,
      sortable: true,
      center: true,
    },
    {
      name: 'Vehicle Variety',
      selector: (row) => row.Vehicle_Variety,
      sortable: true,
      center: true,
    },
    {
      name: 'Vehicle Model',
      selector: (row) => row.Vehicle_Model,
      sortable: true,
      center: true,
    },
    {
      name: 'Vehicle Fuel Type',
      selector: (row) => row.Vehicle_FuelType,
      sortable: true,
      center: true,
    },
    {
      name: 'Vehicle Fuel Tank Capacity',
      selector: (row) => row.Vehicle_FuelTankCapacity,
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
      name: 'User Employee Code',
      selector: (row) => row.User_Emp_Code,
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
      name: 'Veh. Division',
      selector: (row) => row.Vehicle_Division,
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
      name: 'Veh. Variety',
      selector: (row) => row.Vehicle_Variety,
      sortable: true,
      center: true,
    },
    {
      name: 'Veh. Modal',
      selector: (row) => row.Vehicle_Model,
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

  //============ column header data=========

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
          <Link className="text-white" to="/NLFSVehicleMaster">
            <CButton size="sm" color="warning" className="px-3 text-white" type="button">
              NEW
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
            fieldName={'vehicle_Number'}
            showSearchFilter={true}
            pending={pending}
          />
        </CContainer>

        {/*Rc copy front model*/}
        <CModal visible={RCCopyFront} onClose={() => setRCCopyFront(false)}>
          <CModalHeader>
            <CModalTitle>RC Copy Front</CModalTitle>
          </CModalHeader>
          <CModalBody>
          {(!documentSrc.includes(".pdf"))?<CCardImage orientation="top" src={documentSrc} />: <iframe orientation="top" height={500} width={475} src={documentSrc} ></iframe> }
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
          {(!documentSrc.includes(".pdf"))?<CCardImage orientation="top" src={documentSrc} />: <iframe orientation="top" height={500} width={475} src={documentSrc} ></iframe> }

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
          {(!documentSrc.includes(".pdf"))?<CCardImage orientation="top" src={documentSrc} />: <iframe orientation="top" height={500} width={475} src={documentSrc} ></iframe> }
          </CModalBody>
          <CModalFooter>
            <CButton color="secondary" onClick={() => setInsuranceCopyFront(false)}>
              Close
            </CButton>
          </CModalFooter>
        </CModal>
        {/*Insurance copy front*/}
        {/*Insurance copy back*/}
        <CModal
          size="xl"
          visible={assignNLFSVehicleLogModal}
          onClose={() => setAssignNLFSVehicleLogModal(false)}
        >
          <CModalHeader>
            <CModalTitle className="h4">Log Information</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <CustomTable columns={columns_child} data={assignNLFSVehicleData} />
          </CModalBody>
          <CModalFooter>
            <CButton color="secondary" onClick={() => setAssignNLFSVehicleLogModal(false)}>
              Close
            </CButton>
          </CModalFooter>
        </CModal>
      </CCard>
    </>
  )
}

export default NLFSVehicleMasterTable
