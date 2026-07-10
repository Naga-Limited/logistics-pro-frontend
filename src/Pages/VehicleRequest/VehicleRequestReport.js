import React, { useState, useEffect } from 'react'
import {
  CButton,
  CCard,
  CRow,
  CCol,
  CAlert,
  CContainer,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CFormLabel,
} from '@coreui/react'
import VehicleAssignmentService from 'src/Service/VehicleAssignment/VehicleAssignmentService'
import { Link, useNavigate } from 'react-router-dom'
import CustomTable from 'src/components/customComponent/CustomTable'
import TripStoService from 'src/Service/TripSTO/TripStoService'
import { ToastContainer, toast } from 'react-toastify'
import Loader from 'src/components/Loader'
import { DateRangePicker } from 'rsuite'
import TripSheetFilterComponent from '../TripSheetReports/TripSheetFilterComponent/TripSheetFilterComponent'
import SearchSelectComponent from 'src/components/commoncomponent/searchSelectComponent'
import FileSaver from 'file-saver'
import * as XLSX from 'xlsx';
import UserLoginMasterService from 'src/Service/Master/UserLoginMasterService'
import VehicleRequestMasterService from 'src/Service/VehicleRequest/VehicleRequestMasterService'
import DefinitionsListApi from 'src/Service/Definitions/DefinitionsListApi'
import JavascriptInArrayComponent from 'src/components/commoncomponent/JavascriptInArrayComponent'
import { GetDateTimeFormat } from '../Depo/CommonMethods/CommonMethods'
import DepartmentApi from 'src/Service/SubMaster/DepartmentApi'
import DivisionApi from 'src/Service/SubMaster/DivisionApi'
import VehicleCapacityService from 'src/Service/SmallMaster/Vehicles/VehicleCapacityService'
import VehicleBodyTypeService from 'src/Service/SmallMaster/Vehicles/VehicleBodyTypeService'
import VehicleVarietyService from 'src/Service/SmallMaster/Vehicles/VehicleVarietyService'

const VehicleRequestReport = () => {
  const navigation = useNavigate()

  /*================== User Location Fetch ======================*/
  const user_info_json = localStorage.getItem('user_info')
  const user_info = JSON.parse(user_info_json)
  var user_locations = []

  /* Get User Locations From Local Storage */
  user_info.location_info.map((data, index) => {
    user_locations.push(data.id)
  })

  /* Get User Divisions From Local Storage */
  const user_division_id = user_info.is_admin == 1 ? 1 : user_info.division_info.id

  /* Get User Id From Local Storage */
  const user_id = user_info.user_id
  const user_emp_id = user_info.empid

  const onChangeFilter = (event, event_type) => {
    var selected_value = event.value
    console.log(selected_value, 'selected_value')

    if (event_type == 'vehicle_no') {
      if (selected_value) {
        setReportVehicle(selected_value)
      } else {
        setReportVehicle(0)
      }
    } else if (event_type == 'tripsheet_no') {
      if (selected_value) {
        setReportTSNo(selected_value)
      } else {
        setReportTSNo(0)
      }
    } else if (event_type == 'shipment_status') {
      if (selected_value) {
        setReportClosureStatus(selected_value)
      } else {
        setReportClosureStatus(0)
      }
    }
  }

  const [is_vr_admin, set_is_vr_admin] = useState(false)
  const [vehicleRequestAdminUsersData, setVehicleRequestAdminUsersData] = useState([])
  const [vehicleRequestAdminUsersArray, setVehicleRequestAdminUsersArray] = useState([])
  const [divisionData, setDivisionData] = useState([])
  const [departmentData, setDepartmentData] = useState([])
  const [purposeData, setPurposeData] = useState([])
  const [productData, setProductData] = useState([])
  const [vehicleCapacity, setVehicleCapacity] = useState([])
  const [vehicleVariety, setVehicleVariety] = useState([])
  const [vehicleBody, setVehicleBody] = useState([])

  useEffect(() => {
    if(vehicleRequestAdminUsersData.length > 0){
      let user_array = []
      let vr_admin = 0
      vehicleRequestAdminUsersData.map((vv,kk)=>{
        if(vv.definition_list_status == '1'){
          user_array.push(vv.definition_list_code)
        }
      })

      if(user_info.is_admin == 1 || JavascriptInArrayComponent(user_emp_id, user_array)){
        vr_admin = 1
      } else {
        vr_admin = 0
      }

      console.log(user_array,'user_array')
      console.log(vr_admin,'vr_admin')

      vr_admin == 1 ? set_is_vr_admin(true) : set_is_vr_admin(false)
      setVehicleRequestAdminUsersArray(user_array)
    }

  }, [vehicleRequestAdminUsersData])

  const findUser = (id) => {
    let userName = ''
    if(id == '1') {
      userName = 'Admin'
    } else {
      userData.map((data,index)=>{
        if(data.user_id == id) {
          userName = data.username
        }
      })
    }
    return userName
  }

  const exportToCSV = () => {
    console.log(rowData,'exportCsvData')
    // let fileName='LP_Trip_Closure_Report'
    let dateTimeString = GetDateTimeFormat(1)
    let fileName='LP_Vehicle_Requests_Report_'+dateTimeString
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';
    const ws = XLSX.utils.json_to_sheet(rowData);
    const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], {type: fileType});
    FileSaver.saveAs(data, fileName + fileExtension);
  }

  const ACTION = {
    GATE_IN: 1,
    GATE_OUT: 2,
    WAIT_OUTSIDE: 0,
    VEHICLE_MAINTENANCE_ENDED: 5,
  }

  const [rowData, setRowData] = useState([])
  const [searchFilterData, setSearchFilterData] = useState([])

  const [errorModal, setErrorModal] = useState(false)
  const [fetch, setFetch] = useState(false)

  const [pending, setPending] = useState(true)

  /* Report Variables */
  const [reportVehicle, setReportVehicle] = useState(0)
  const [reportTSNo, setReportTSNo] = useState(0)
  const [userData, setUserData] = useState([])
  const [reportTSId, setReportTSId] = useState(0)
  const [reportShipmentNo, setReportShipmentNo] = useState(0)
  const [reportClosureStatus, setReportClosureStatus] = useState(0)

  const [vehicleSto, setVehicleSto] = useState('')

  let tableData = []
  let tableReportData = []

  /* Set Default Date (Today) in a Variable State */
  const [defaultDate, setDefaultDate] = React.useState([
    new Date(getCurrentDate('-')),
    new Date(getCurrentDate('-')),
  ])

  useEffect(() => {
    console.log(defaultDate)
    if (defaultDate) {
      setDefaultDate(defaultDate)
    } else {
    }
  }, [defaultDate])

  useEffect(() => {

    /* section for getting Division Data from database */
    DivisionApi.getDivision().then((rest) => {

      let tableData = rest.data.data
      console.log(tableData)
      setDivisionData(tableData)
    })

    /* section for getting Department Data from database */
    DepartmentApi.getDepartment().then((rest) => {
      // setFetch(true)
      let tableData = rest.data.data
      console.log(tableData)
      setDepartmentData(tableData)
    })

    /* section for getting Vehicle Requests Admin User Lists from database */
    DefinitionsListApi.visibleDefinitionsListByDefinition(28).then((response) => {

      let viewData = response.data.data
      console.log(viewData,'Vehicle Requests Admin User Lists')
      setVehicleRequestAdminUsersData(viewData)
    })

    /* section for getting VR Purpose Lists from database */
    DefinitionsListApi.visibleDefinitionsListByDefinition(29).then((response) => {

      let viewData = response.data.data
      console.log(viewData,'VR Purpose Lists')
      setPurposeData(viewData)
    })

    /* section for getting VR Product Lists from database */
    DefinitionsListApi.visibleDefinitionsListByDefinition(30).then((response) => {

      let viewData = response.data.data
      console.log(viewData,'VR Product Lists')
      setProductData(viewData)
    })

    //section for getting vehicle capacity from database
    VehicleCapacityService.getVehicleCapacity().then((res) => {
      setVehicleCapacity(res.data.data)
    })

    VehicleBodyTypeService.getVehicleBody().then((res) => {
      setVehicleBody(res.data.data)
    })

    //section for getting vehicle variety from database
    VehicleVarietyService.getVehicleVariety().then((res) => {
      setVehicleVariety(res.data.data)
    })

  }, [])

  const veh_variety_finder = (variety) => {
    let vari = ''
    if(vehicleVariety.length > 0){
      vehicleVariety.map((vv,kk)=>{
        if(variety == vv.id){
          vari = vv.vehicle_variety
        }
      })
    }
    return vari
  }

  const veh_capacity_finder = (capacity) => {
    let cap = ''
    if(vehicleCapacity.length > 0){
      vehicleCapacity.map((vv,kk)=>{
        if(capacity == vv.id){
          cap = vv.capacity
        }
      })
    }
    return cap
  }

  const veh_body_finder = (body) => {
    let bod = ''
    if(vehicleBody.length > 0){
      vehicleBody.map((vv,kk)=>{
        if(body == vv.id){
          bod = vv.body_type
        }
      })
    }
    return bod
  }

  const div_finder = (division) => {
    let div = ''
    if(divisionData.length > 0){
      divisionData.map((vv,kk)=>{
        if(division == vv.id){
          div = vv.division
        }
      })
    }
    return div
  }

  const purp_finder = (purpose) => {
    let purp = ''
    if(purposeData.length > 0){
      purposeData.map((vv1,kk1)=>{
        if(purpose == vv1.definition_list_code){
          purp = vv1.definition_list_name
        }
      })
    }
    return purp
  }

  const dep_finder = (department) => {
    let dep = ''
    if(departmentData.length > 0){
      departmentData.map((vv,kk)=>{
        if(department == vv.id){
          dep = vv.department
        }
      })
    }
    return dep
  }

  const prod_finder = (product) => {
    let dep = ''
    if(productData.length > 0){
      productData.map((vv,kk)=>{
        if(product == vv.definition_list_code){
          dep = vv.definition_list_name
        }
      })
    }
    return dep
  }

  const VR_Waiting_TS_Status_Array =
  [
    "",
    "PYG Done",
    "DOC. Verify Done",
    "TS Created",
    "Expense Closure",
    "Income Closure",
    "Settlement Closure"
  ]

  const VR_Waiting_Status_Array =
  [
    "",
    "NLLD Confirm.",
    "Vehicle Assigned",
    "Cancelled",
    "Closure Initiated",
    "Closed"
  ]

  const WaitingStatusFinder = (s1,s2) => {
    let status = ''
    if(s1 == 2){
      status = s2 ? VR_Waiting_TS_Status_Array[s2] : VR_Waiting_Status_Array[s1]
    } else if(s1 == 4){
      status = VR_Waiting_TS_Status_Array[s2]
    } else {
      status = VR_Waiting_Status_Array[s1]
    }
    return status
  }

  useEffect(()=>{
    if(productData.length > 0 && departmentData.length > 0 && purposeData.length > 0 && divisionData.length > 0 && vehicleBody.length > 0 && vehicleVariety.length > 0 && vehicleCapacity.length > 0){
      loadVRReport()
    }
  },[productData.length > 0 && departmentData.length > 0 && purposeData.length > 0 && divisionData.length > 0 && vehicleBody.length > 0 && vehicleVariety.length > 0 && vehicleCapacity.length > 0])

  const loadVRReport = (fresh_type = '') => {

    if (fresh_type !== '1') {

      VehicleRequestMasterService.getVRDataForReport().then((res) => {

        tableReportData = res.data.data
        console.log(tableReportData,'sentVRDataForReport-filterData')
        const filterData1 =  tableReportData.filter(
          (data) => (is_vr_admin == 1 || user_info.is_admin == 1) ? data : user_division_id == data.vr_division
        )
        console.log(filterData1,'sentVRDataForReport-filterData1')
        let rowDataList = []
        filterData1.map((data, index) => {
          rowDataList.push({
            sno: index + 1,
            VR_No: data.vr_no,
            VR_Creation_Date: data.created_at,
            VR_Tripsheet_No: data.vr_tr_no ? data.vr_tr_no : '-',
            VR_By: data.request_by,
            VR_Cell_No: data.contact_no,
            VR_Division: div_finder(data.vr_division),
            VR_Department: dep_finder(data.vr_dept),
            VR_Purpose: purp_finder(data.vr_purpose),
            VR_Product: prod_finder(data.vr_prod),
            VR_From_Location: data.vr_from_loc,
            VR_To_Location: data.vr_to_loc,
            VR_Needed_Date: data.require_time_date_string,
            VR_Body_Type: veh_body_finder(data.vr_body_id),
            VR_Capacity_In_MTS: veh_capacity_finder(data.vr_capacity_id),
            VR_Variety: veh_variety_finder(data.vr_variety_id),
            Waiting_Status: WaitingStatusFinder(data.vr_status,data.vr_ts_status),
            Remarks: data.veh_remarks
          })
        })
        setRowData(rowDataList)
        setFetch(true)
        setPending(false)
      })

    } else {

      if (defaultDate == null) {
        toast.warning('Date Filter Should not be empty..!')
        return false
      }

      let report_form_data = new FormData()
      report_form_data.append('date_between', defaultDate)

      VehicleRequestMasterService.sentVRDataForReport(report_form_data).then((res) => {

        tableReportData = res.data.data
        console.log(tableReportData,'sentVRDataForReport-filterData')
        const filterData1 =  tableReportData.filter(
          (data) => (is_vr_admin == 1 || user_info.is_admin == 1) ? data : user_division_id == data.vr_division
        )
        console.log(filterData1,'sentVRDataForReport-filterData1')
        let rowDataList = []
        filterData1.map((data, index) => {
          rowDataList.push({
            sno: index + 1,
            VR_No: data.vr_no,
            VR_Creation_Date: data.created_at,
            VR_Tripsheet_No: data.vr_tr_no ? data.vr_tr_no : '-',
            VR_By: data.request_by,
            VR_Cell_No: data.contact_no,
            VR_Division: div_finder(data.vr_division),
            VR_Department: dep_finder(data.vr_dept),
            VR_Purpose: purp_finder(data.vr_purpose),
            VR_Product: prod_finder(data.vr_prod),
            VR_From_Location: data.vr_from_loc,
            VR_To_Location: data.vr_to_loc,
            VR_Needed_Date: data.require_time_date_string,
            VR_Body_Type: veh_body_finder(data.vr_body_id),
            VR_Capacity_In_MTS: veh_capacity_finder(data.vr_capacity_id),
            VR_Variety: veh_variety_finder(data.vr_variety_id) != '' ? veh_variety_finder(data.vr_variety_id) : '-',
            Waiting_Status: WaitingStatusFinder(data.vr_status,data.vr_ts_status),
            Remarks: data.veh_remarks
          })
        })
        setRowData(rowDataList)
        setFetch(true)
        setPending(false)
      })
    }
  }

  useEffect(() => {
    loadVRReport()
  }, [])

  useEffect(() => {
    UserLoginMasterService.getUser().then((res) => {
      let user_data = res.data.data
      console.log(user_data)
      setUserData(user_data)
    })
  },[])

  const columns = [
    {
      name: 'S.No',
      selector: (row) => row.sno,
      sortable: true,
      center: true,
    },
    {
      name: 'VR No',
      selector: (row) => row.VR_No,
      sortable: true,
      center: true,
    },
    {
      name: 'VR Date',
      selector: (row) => row.VR_Creation_Date,
      sortable: true,
      center: true,
    },
    {
      name: 'TripSheet No',
      selector: (row) => row.VR_Tripsheet_No,
      sortable: true,
      center: true,
    },
    {
      name: 'Request By',
      selector: (row) => row.VR_By,
      sortable: true,
      center: true,
    },
    {
      name: 'Contact No',
      selector: (row) => row.VR_Cell_No,
      sortable: true,
      center: true,
    },
    {
      name: 'Division',
      selector: (row) => row.VR_Division,
      sortable: true,
      center: true,
    },
    {
      name: 'Department',
      selector: (row) => row.VR_Department,
      sortable: true,
      center: true,
    },
    {
      name: 'Purpose',
      selector: (row) => row.VR_Purpose,
      sortable: true,
      center: true,
    },
    {
      name: 'Product',
      selector: (row) => row.VR_Product,
      sortable: true,
      center: true,
    },
    {
      name: 'From Location',
      selector: (row) => row.VR_From_Location,
      sortable: true,
      center: true,
    },
    {
      name: 'To Location',
      selector: (row) => row.VR_To_Location,
      sortable: true,
      center: true,
    },
    {
      name: 'Req. date',
      selector: (row) => row.VR_Needed_Date,
      sortable: true,
      center: true,
    },
    {
      name: 'Veh. Body Type',
      selector: (row) => row.VR_Body_Type,
      sortable: true,
      center: true,
    },
    {
      name: 'Veh. Capacity',
      selector: (row) => row.VR_Capacity_In_MTS,
      sortable: true,
      center: true,
    },
    {
      name: 'Veh. Variety',
      selector: (row) => row.VR_Variety,
      sortable: true,
      center: true,
    },
    {
      name: 'Remarks',
      selector: (row) => row.Remarks,
      sortable: true,
      center: true,
    },
    {
      name: 'Status',
      selector: (row) => row.Waiting_Status,
      sortable: true,
      center: true,
    },
  ]

  function getCurrentDate(separator = '') {
    let newDate = new Date()
    let date = newDate.getDate()
    let month = newDate.getMonth() + 1
    let year = newDate.getFullYear()

    return `${year}${separator}${month < 10 ? `0${month}` : `${month}`}${separator}${
      date < 10 ? `0${date}` : `${date}`
    }`
  }

  return (
    <>
      {!fetch && <Loader />}
      {fetch && (
        <CCard className="mt-4">
          <CContainer className="m-2">
            <CRow className="mt-1 mb-1">
              <CCol xs={12} md={3}>
                <CFormLabel htmlFor="VNum">Date Filter</CFormLabel>
                <DateRangePicker
                  style={{ width: '100rem', height: '100%', borderColor: 'black' }}
                  className="mb-2"
                  id="start_date"
                  name="end_date"
                  format="dd-MM-yyyy"
                  value={defaultDate}
                  onChange={setDefaultDate}
                />
              </CCol>
            </CRow>
            <CRow className="mt-3">
              <CCol className="" xs={12} sm={9} md={3}></CCol>


              <CCol
                className="offset-md-6"
                xs={12}
                sm={9}
                md={3}
                style={{ display: 'flex', justifyContent: 'end' }}
              >
                <CButton
                  size="sm"
                  color="primary"
                  className="mx-3 px-3 text-white"
                  onClick={() => {
                    setFetch(false)
                    loadVRReport('1')
                  }}
                >
                  Filter
                </CButton>
                <CButton
                  size="lg-sm"
                  color="warning"
                  className="mx-3 px-3 text-white"
                  onClick={(e) => {
                      // loadVehicleReadyToTripForExportCSV()
                      exportToCSV()
                    }}
                >
                  Export
                </CButton>
              </CCol>
            </CRow>
            <CustomTable
              columns={columns}
              data={rowData}
              fieldName={'Driver_Name'}
              showSearchFilter={true}
            />
          </CContainer>
        </CCard>
      )}

    </>
  )
}

export default VehicleRequestReport
