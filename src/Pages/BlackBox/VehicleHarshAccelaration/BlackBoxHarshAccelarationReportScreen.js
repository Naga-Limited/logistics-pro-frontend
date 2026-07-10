import React, { useState, useEffect } from 'react'
import {
  CButton,
  CCard,
  CRow,
  CCol, 
  CContainer, 
  CFormLabel,
} from '@coreui/react' 
import { Link, useNavigate } from 'react-router-dom'
import CustomTable from 'src/components/customComponent/CustomTable' 
import { toast } from 'react-toastify'
import Loader from 'src/components/Loader'
import { DateRangePicker } from 'rsuite' 
import FileSaver from 'file-saver'
import * as XLSX from 'xlsx';
import { GetDateTimeFormat } from 'src/Pages/Depo/CommonMethods/CommonMethods'
import BlackBoxService from 'src/Service/BlackBox/BlackBoxService' 
import AccessDeniedComponent from 'src/components/commoncomponent/AccessDeniedComponent'
import * as LogisticsProScreenNumberConstants from 'src/components/constants/LogisticsProScreenNumberConstants'
import JavascriptInArrayComponent from 'src/components/commoncomponent/JavascriptInArrayComponent'

const BlackBoxHarshAccelarationReportScreen = () => {
  /*================== User Id & Location Fetch ======================*/
  const user_info_json = localStorage.getItem('user_info')
  const user_info = JSON.parse(user_info_json)
  const user_locations = []
  const navigation = useNavigate()
  const is_admin = user_info.user_id == 1 && user_info.is_admin == 1

  if(is_admin){
    console.log(user_info)
  }

  /* Get User Locations From Local Storage */
  user_info.location_info.map((data, index) => {
    user_locations.push(data.id)
  }) 

  /* Get User Id From Local Storage */
  const user_id = user_info.user_id

  // console.log(user_locations)
  /*================== User Location Fetch ======================*/

  /* ==================== Access Part Start ========================*/
  const [screenAccess, setScreenAccess] = useState(false)
  let page_no = LogisticsProScreenNumberConstants.BlackBoxVehicleReportModule.Vehicle_Harsh_Acceleration

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

  const exportToCSV = () => {
    console.log(rowData,'exportCsvData')
    let dateTimeString = GetDateTimeFormat(1)
    let fileName='BB_Vehicle_Harsh_Accelaration_Report_'+dateTimeString
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';
    const ws = XLSX.utils.json_to_sheet(rowData);
    const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], {type: fileType});
    FileSaver.saveAs(data, fileName + fileExtension);
  }

  const [rowData, setRowData] = useState([])
  const [searchFilterData, setSearchFilterData] = useState([]) 
  const [fetch, setFetch] = useState(false) 
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

  const GetTimeFormat = (tre) => {
    let time = new Date(tre).toLocaleTimeString()
    return time
  }

  const loadVehicleHarshAccelarationReport = (fresh_type = '') => {

    if (fresh_type !== '1') {
      // console.log(user_locations)
      /*================== User Location Fetch ======================*/

      BlackBoxService.getVehilceHarshAccelarationInfo().then((res) => {
  
        tableReportData = res.data.data  
        console.log(tableReportData,'getVehilceHarshAccelarationInfo')
        setFetch(true)
        let rowDataList = []
        let filterData = tableReportData.filter(
          (data) => data
        ) 
        setSearchFilterData(filterData)
        filterData.map((data, index) => { 
          rowDataList.push({
            sno: index + 1,
            From_Time: GetTimeFormat(data.from_date_time),
            To_Time: GetTimeFormat(data.to_date_time),
            Vehicle_Count: data.record_count,
            // Remarks: data.remarks ? data.remarks : '-',
            Creation_Time: data.created_date,
            Action: (
              <>
                <CButton className="btn btn-success btn-sm me-md-1">
                  <Link className="text-white" target='_blank' to={`/BlackBoxHarshAccelarationReport/${data.id}`}>
                    <i className="fa fa-eye" aria-hidden="true"></i>
                  </Link>
                </CButton>                
              </>
            ),           
          })
           
          
        })
        setFetch(true)
        setRowData(rowDataList) 
      })
    } else {
      if (defaultDate == null) {
        toast.warning('Date Filter Should not be empty..!')
        return false
      }  
      let report_form_data = new FormData()
      report_form_data.append('date_between', defaultDate) 

      console.log(defaultDate, 'defaultDate') 

      BlackBoxService.sentVehilceHarshAccelarationInfo(report_form_data).then((res) => { 

        tableReportData = res.data.data  
        console.log(tableReportData,'sentVehilceHarshAccelarationInfo')

        setFetch(true)
        let rowDataList = []
        let filterData = tableReportData.filter(
          (data) => data
        )
        // console.log(filterData)
        setSearchFilterData(filterData)
        filterData.map((data, index) => {
          rowDataList.push({ 
            sno: index + 1,
            From_Time: GetTimeFormat(data.from_date_time),
            To_Time: GetTimeFormat(data.to_date_time),
            Vehicle_Count: data.record_count,
            // Remarks: data.remarks ? data.remarks : '-',
            Creation_Time: data.created_date,
            Action: (
              <>
                <CButton className="btn btn-success btn-sm me-md-1">
                  <Link className="text-white" target='_blank' to={`/BlackBoxHarshAccelarationReport/${data.id}`}>
                    <i className="fa fa-eye" aria-hidden="true"></i>
                  </Link>
                </CButton>              
              </>
            ),  
          })
        })
        setRowData(rowDataList) 
      })
    }
  }

  useEffect(() => {
    loadVehicleHarshAccelarationReport() 
  }, [])

  const columns = [
    {
      name: 'S.No',
      selector: (row) => row.sno,
      sortable: true,
      center: true,
    },
    {
      name: 'Date',
      selector: (row) => row.Creation_Time,
      sortable: true,
      center: true,
    },     
    {
      name: 'From Time',
      selector: (row) => row.From_Time,
      sortable: true,
      center: true,
    },
    {
      name: 'To Time',
      selector: (row) => row.To_Time,
      sortable: true,
      center: true,
    }, 
    {
      name: 'Vehicle Count',
      selector: (row) => row.Vehicle_Count,
      sortable: true,
      center: true,
    },   
    {
      name: 'View',
      selector: (row) => row.Action,
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
        <>
          {screenAccess ? (
            <>
              <CCard className="mt-4">
                <CContainer className="m-2">
                  <CRow className="m-2">
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
                          loadVehicleHarshAccelarationReport('1')
                        }}
                      >
                        Filter
                      </CButton>
                      <CButton
                        size="lg-sm"
                        color="warning"
                        className="mx-3 px-3 text-white"
                        onClick={(e) => { 
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
            </> ) : (<AccessDeniedComponent />)
          }
        </>
      )}
    </>
  )
}

export default BlackBoxHarshAccelarationReportScreen
