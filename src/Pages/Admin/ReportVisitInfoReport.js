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
  CFormLabel 
} from '@coreui/react' 
import CustomTable from 'src/components/customComponent/CustomTable'
import React, { useEffect, useRef, useState } from 'react'
import Loader from 'src/components/Loader' 
import { toast } from 'react-toastify'
import VehicleMasterValidation from 'src/Utils/Master/VehicleMasterValidation'
import useForm from 'src/Hooks/useForm' 
import { DateRangePicker } from 'rsuite' 
import * as XLSX from 'xlsx';
import FileSaver from 'file-saver'  
import AccessDeniedComponent from 'src/components/commoncomponent/AccessDeniedComponent' 
import { GetDateTimeFormat } from '../Depo/CommonMethods/CommonMethods' 
import AdminSettingsService from 'src/Service/AdminSettings/AdminSettingsService'
import * as LogisticsProScreenNumberConstants from 'src/components/constants/LogisticsProScreenNumberConstants'
import JavascriptInArrayComponent from 'src/components/commoncomponent/JavascriptInArrayComponent'

const ReportVisitInfoReport = () => {

  /*================== User Location Fetch ======================*/
  const user_info_json = localStorage.getItem('user_info')
  const user_info = JSON.parse(user_info_json)
  const user_locations = []

  /* Get User Locations From Local Storage */
  user_info.location_info.map((data, index) => {
    user_locations.push(data.id)
  })

  /* Get User Id From Local Storage */
  const user_id = user_info.user_id

  const [assignMigoModal, setAssignMigoModal] = useState(false)

  // console.log(user_locations)
  /*================== User Location Fetch ======================*/

  /* ==================== Access Part Start ========================*/
  const [screenAccess, setScreenAccess] = useState(false) 
  let page_no = LogisticsProScreenNumberConstants.SettingsModule.Admin_Visited_Report
  useEffect(()=>{

    if(user_info.is_admin == 1 || JavascriptInArrayComponent(page_no,user_info.page_permissions)){
      console.log('screen-access-allowed')
      setScreenAccess(true)
    } else{
      console.log('screen-access-not-allowed')
      setScreenAccess(false)
    }

  },[])
  /* ==================== Access Part End ========================*/

  const [value, setValue] = React.useState([new Date(getCurrentDate('-')), new Date(getCurrentDate('-'))]);

  const [rowData, setRowData] = useState([])
  const [fetch, setFetch] = useState(false) 

  {/* ============= Date Range Picker Part Start =========================== */}

  const [dateRangePickerStartDate, setDateRangePickerStartDate] = useState('')
  const [dateRangePickerEndDate, setDateRangePickerEndDate] = useState('')
  const [reportVehicle, setReportVehicle] = useState(0)
  const [searchFilterData, setSearchFilterData] = useState([])
  const [displayVehicleData, setDisplayVehicleData] = useState([])

  const  convert = (str) => {
    let date = new Date(str);
    let mnth = ("0" + (date.getMonth() + 1)).slice(-2);
    let day = ("0" + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join("-");

  }

  useEffect (()=>{

    if(value){

      console.log(value)
      let fromDate = value[0];
      let toDate = value[1];
      console.log(convert(fromDate))
      console.log(convert(toDate))
      setDateRangePickerStartDate(convert(fromDate));
      setDateRangePickerEndDate(convert(toDate));

    } else {

      setDateRangePickerStartDate('');
      setDateRangePickerEndDate('');

    }
  },[value])

  {/* =============== Date Range Picker Part End =========================== */}

  function getCurrentDate(separator = '') {
    let newDate = new Date()
    let date = newDate.getDate()
    let month = newDate.getMonth() + 1
    let year = newDate.getFullYear()

    return `${year}${separator}${month < 10 ? `0${month}` : `${month}`}${separator}${date < 10 ? `0${date}` : `${date}`}`
  }

  const exportToCSV = () => {

    if(rowData.length == 0){
      toast.warning('No Data Found..!')
      return false
    }
    let dateTimeString = GetDateTimeFormat(1)
    let fileName='Report_Visit_Info_Report_'+dateTimeString
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';
    const ws = XLSX.utils.json_to_sheet(rowData);
    const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], {type: fileType}); 
    FileSaver.saveAs(data, fileName + fileExtension);
  }   
 
  const [displayReportName, setDisplayReportName] = useState('')
  const [displayUserName, setDisplayUserName] = useState('')
  const [displayUserVisitCount, setDisplayUserVisitCount] = useState('')
  const [displayUserVisitInfo, setDisplayUserVisitInfo] = useState({})
  const [displayVisitDate, setDisplayVisitDate] = useState({})

  const assignVRInfo = (vdata) => {

    console.log(vdata,'vdata') 
    let rowDataList = []     
    vdata.map((data, index) => { 
      rowDataList.push({
        sno: index + 1, 
        visit_time: data.visit_time,                   
      })
      
    })
    setDisplayVehicleData(rowDataList)
  }

  let tableData1 = []
  const loadVehicleReadyToTrip = () => {
    let tableData = new FormData()
    console.log(dateRangePickerStartDate, 'start date')
    console.log(dateRangePickerEndDate, 'end date')

    tableData.append('trip_from_date_range', dateRangePickerStartDate)
    tableData.append('trip_to_date_range', dateRangePickerEndDate)
    tableData.append('vehicle_number', reportVehicle)
    tableData.append('user_id', user_id)
 
    AdminSettingsService.ReportVisitInfoReport(tableData).then((res) => {
      console.log(res.data,'editData')
      setFetch(true)
      tableData1 = res.data
      let rowDataList = []
     
      setSearchFilterData(tableData1)
      tableData1.map((data, index) => {
        rowDataList.push({
          sno: index + 1,
          report_name: data.report_name,
          user_name: data.user_name,
          visit_count: data.visit_count,
          visit_date: data.created_date,
          Action: (
            <CButton
              className="text-white"
              color="warning"
              id={data.depo_tripsheet_id}
              size="sm"
              onClick={() => {
                setAssignMigoModal(true)
                setDisplayVisitDate(data.created_date)
                setDisplayUserVisitInfo(data.visit_info)
                setDisplayUserVisitCount(data.visit_count)
                setDisplayUserName(data.user_name)
                setDisplayReportName(data.report_name) 
                assignVRInfo(data.visit_info)
            }}
            >
              <i className="fa fa-eye" aria-hidden="true"></i>
            </CButton>
          ),
        })
      })
      setRowData(rowDataList)
    })
  }
  useEffect(() => {
    loadVehicleReadyToTrip()
  }, [])

  const columns_child = [
    {
      name: 'S.No',
      selector: (row) => row.sno,
      sortable: true,
      center: true,
    },
    {
      name: 'Visit Time',
      selector: (row) => row.visit_time,
      sortable: true,
      center: true,
    }
  ]

  const columns = [
    {
      name: 'S.No',
      selector: (row) => row.sno,
      sortable: true,
      center: true,
    },
    {
      name: 'Report Name',
      selector: (row) => row.report_name,
      sortable: true,
      center: true,
    },
    {
      name: 'User Name',
      selector: (row) => row.user_name,
      sortable: true,
      center: true,
    },
    {
      name: 'Date',
      selector: (row) => row.visit_date,
      sortable: true,
      center: true,
    },
    {
      name: 'Visit Count',
      selector: (row) => row.visit_count,
      sortable: true,
      center: true,
    },
    {
      name: 'Action',
      selector: (row) => row.Action,
      center: true,
    }
  ] 

  const formValues = {
    trip_from_date_range: '',
    trip_to_date_range: '',
    vehicle_number:'',
    trip_sheet_no:'',
    purpose:'',
    to_divison:'',
    status:''
  }

  const { values, errors, handleChange, onFocus, handleSubmit, enableSubmit, onBlur } = useForm(
    loadVehicleReadyToTrip,
    VehicleMasterValidation,
    formValues
  )

  return (
    <>
      {!fetch && <Loader />}
      {fetch && (
        <>
          {screenAccess ? (
            <CCard className="mt-4">
              <CContainer className="mt-1">
                <CRow className="mt-1 mb-1" >
                  <CCol xs={12} md={3}>
                    <CFormLabel htmlFor="VNum">
                          Date Filter
                    </CFormLabel>
                    <DateRangePicker
                      style={{width: '100rem',height:'100%',borderColor:'black'}}
                      className="mb-2"
                      id="advpay_date_range"
                      name="advpay_date_range"
                      format="dd-MM-yyyy"
                      value={value}
                      onChange={setValue} 
                    />
                  </CCol>                   
                </CRow>
                <CCol
                  className="offset-md-9"
                  xs={12}
                  sm={12}
                  md={3}
                  style={{ display: 'flex', justifyContent: 'end' }}
                >
                  
                  <CButton
                    size="lg-sm"
                    color="primary"
                    className="mx-3 px-3 text-white"
                    onClick={() => {
                      setFetch(false)
                      loadVehicleReadyToTrip()}
                    }
                  >
                    Filter
                  </CButton>
                  <CButton
                    size="lg-sm"
                    color="warning"
                    className="mx-3 px-3 text-white"
                    onClick={(e) => {
                      exportToCSV()}
                    }
                  >
                    Export
                  </CButton>
                </CCol>                
                
                <hr style={{height:'2px', marginTop:'0.5px'}}></hr>
                
                <CustomTable
                  columns={columns}
                  data={rowData}
                  fieldName={'Advance_user'}
                  showSearchFilter={true}
                />
              </CContainer>

              {/* ============== Income Reject Confirm Button Modal Area ================= */}
                
              <CModal
                size="m" 
                backdrop="static"
                scrollable
                visible={assignMigoModal}
                onClose={() => {
                    setAssignMigoModal(false) 
                    setDisplayVisitDate('')
                    setDisplayUserVisitCount('')
                    setDisplayUserName('')
                    setDisplayReportName('')
                    setDisplayUserVisitInfo({})
                }}
              >
                <CModalHeader>
                    <CModalTitle>
                      <p>{`Report Name : ${displayReportName}`}</p>
                      <p>{`User Name : ${displayUserName}`}</p>
                      <p>{`Visit Date : ${displayVisitDate}`}</p>
                      <p>{`Visit Count : ${displayUserVisitCount}`}</p> 
                    </CModalTitle>
                </CModalHeader>
                <CModalBody>
                      
                    <CustomTable
                      columns={columns_child}
                      data={displayVehicleData}
                      fieldName={'Driver_Name'}
                      showSearchFilter={true}
                    />
                    
                </CModalBody>
                <CModalFooter>                      
                    <CButton
                    color="primary"
                    onClick={() => {
                      setAssignMigoModal(false) 
                      setDisplayVisitDate('')
                      setDisplayUserVisitCount('')
                      setDisplayUserName('')
                      setDisplayReportName('')
                      setDisplayUserVisitInfo({})
                    }}
                    >
                    Close
                    </CButton>
                </CModalFooter>
              </CModal>
            </CCard> ) : ( <AccessDeniedComponent />
          )}
        </>
      )}
    </>
  )

}

export default ReportVisitInfoReport
