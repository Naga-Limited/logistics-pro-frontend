
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
import { Link, useNavigate } from 'react-router-dom'
import CustomTable from 'src/components/customComponent/CustomTable'
import TripStoService from 'src/Service/TripSTO/TripStoService'
import { toast } from 'react-toastify'
import Loader from 'src/components/Loader'
import { DateRangePicker } from 'rsuite'
import SearchSelectComponent from 'src/components/commoncomponent/searchSelectComponent'
import FileSaver from 'file-saver'
import * as XLSX from 'xlsx';
import DepoGateInService from 'src/Service/Depo/GateIn/DepoGateInService'
import AccessDeniedComponent from 'src/components/commoncomponent/AccessDeniedComponent'
import JavascriptInArrayComponent from 'src/components/commoncomponent/JavascriptInArrayComponent'
import * as LogisticsProScreenNumberConstants from 'src/components/constants/LogisticsProScreenNumberConstants'
import DepoFreightMasterService from 'src/Service/Depo/Master/DepoFreightMasterService'
const DepoRoutefreightReport = () => {
  const navigation = useNavigate()
  /*================== User Id & Location Fetch ======================*/
  const user_info_json = localStorage.getItem('user_info')
  const user_info = JSON.parse(user_info_json)
  const user_locations = []
  //console.log(user_info)
  /* Get User Locations From Local Storage */
  user_info.location_info.map((data, index) => {
    user_locations.push(data.id)
  })
  /* Get User Id From Local Storage */
  const user_id = user_info.user_id

  // //console.log(user_locations)
  /*================== User Location Fetch ======================*/

   /* Get User Locations From Local Storage */
   const user_location_info = user_info.location_info
   var user_locations_id = ''
   user_location_info.map((data, index) => {
     user_locations_id = user_locations_id + data.id + ','
   })
   var lastIndex = user_locations_id.lastIndexOf(',')
   const userLocation = user_locations_id.substring(0, lastIndex)
   //console.log(userLocation)
  /* ==================== Access Part Start ========================*/
  const [screenAccess, setScreenAccess] = useState(false)
  let page_no = LogisticsProScreenNumberConstants.DepoModuleScreens.Depo_freight_report

  useEffect(()=>{
    if(user_info.is_admin == 1 || JavascriptInArrayComponent(page_no,user_info.page_permissions)){
      //console.log('screen-access-allowed')
      setScreenAccess(true)
    } else{
      //console.log('screen-access-not-allowed')
      setScreenAccess(false)
    }

  },[])
  /* ==================== Access Part End ========================*/

  const onChangeFilter = (event, event_type) => {
    var selected_value = event.value
    console.log(selected_value, 'selected_value')

    if (event_type == 'location') {
      if (selected_value) {
        setReportLocation(selected_value)
      } else {
        setReportLocation(0)
      }
    }
    else  if (event_type == 'route_name') {
      if (selected_value) {

        setReportRoute(selected_value)
      } else {

        setReportRoute(0)
      }
    }
  }

  const exportToCSV = () => {
    //console.log(rowData,'exportCsvData')
    let fileName='Depo_Freight_Report'
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
  const [errorModal, setErrorModal] = useState(false)
  const [fetch, setFetch] = useState(false)
  const [pending, setPending] = useState(true)
  /* Report Variables */
  const [reportLocation, setReportLocation] = useState(0)
  const [reportRoute, setReportRoute] = useState(0)

  let tableData = []
  let tableReportData = []

  /* Set Default Date (Today) in a Variable State */
  const [defaultDate, setDefaultDate] = React.useState([
    new Date(getCurrentDate('-')),
    new Date(getCurrentDate('-')),
  ])


  const loadDepoReport = (fresh_type = '') => {
    /*================== User Location Fetch ======================*/
    const user_info_json = localStorage.getItem('user_info')
    const user_info = JSON.parse(user_info_json)
    var user_locations = []

    /* Get User Locations From Local Storage */
    user_info.location_info.map((data, index) => {
      user_locations.push(data.id)
    })

    if (fresh_type != '1') {
      // //console.log(user_locations)
      /*================== User Location Fetch ======================*/

      DepoFreightMasterService.getDepoFreights().then((response)=>{
        tableReportData = response.data.data
        //console.log(tableReportData,'tableReportData')

        setFetch(true)
        let rowDataList = []
        let filterData = tableReportData.filter(
          (data) => user_locations.indexOf(data.location_id) != -1
        )

        setSearchFilterData(filterData)
        filterData.map((data, index) => {
          rowDataList.push({
            sno: index + 1,
            Creation_Date: data.created_at,
            Location: data.location_info.location,
            Route_Name: data.route_info.route_name,
            Contractor_Name: data.contractor_info.contractor_name,
            Freight: Number(data.freight_rate),
            Status: data.status === 1 ? 'Active' : 'In-Active',
          })
        })
        setFetch(true)
        setRowData(rowDataList)
        // setPending(false)
      })
    } else {
      let report_form_data = new FormData()

       report_form_data.append('location', reportLocation)
       report_form_data.append('route_name', reportRoute)
       console.log(reportLocation, 'reportLocation')
       console.log(reportRoute, 'reportRoute')
      DepoFreightMasterService.sentDataForReport(report_form_data).then((res)=>{
      tableReportData = res.data.data
      console.log(tableReportData)
        let rowDataList = []
        let filterData = tableReportData.filter(
         (data) =>user_locations.indexOf(data.location_id) != -1 )
         setSearchFilterData(filterData)
         setFetch(true)
         filterData.map((data, index) => {
          console.log(data, 'data-data-data')
          rowDataList.push({
            sno: index + 1,
            Creation_Date: data.created_at,
            Location: data.location_info.location,
            Route_Name: data.route_info.route_name,
            Contractor_Name: data.contractor_info.contractor_name,
            Freight: Number(data.freight_rate),
            Status: data.customer_status === 1 ? 'Active' : 'In-Active',
          })
        })
        setRowData(rowDataList)

      })
    }
  }

  useEffect(() => {
    loadDepoReport()
  }, [])

  const columns = [
    {
        name: 'S.No',
        selector: (row) => row.sno,
        sortable: true,
        center: true,
      },

      {
        name: 'Depo Location',
        selector: (row) => row.Location,
        sortable: true,
        center: true,
      },
      {
        name: 'Route Name',
        selector: (row) => row.Route_Name,
        sortable: true,
        center: true,
      },
      {
        name: 'Contractor Name',
        selector: (row) => row.Contractor_Name,
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
        name: 'Status',
        selector: (row) => row.Status,
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
        <>
          {screenAccess ? (
            <>
              <CCard className="mt-4">
                <CContainer className="m-2">
                  <CRow className="mt-1 mb-1">
                      <CCol xs={12} md={3}>
                      <CFormLabel htmlFor="VNum">Depo Location</CFormLabel>
                      <SearchSelectComponent
                        size="sm"
                        className="mb-2"
                        onChange={(e) => {
                          onChangeFilter(e, 'location')
                        }}
                        label="Select Depo Location "
                        noOptionsMessage="Location Not found"
                        search_type="depos_location"
                        search_data={searchFilterData}
                      />
                    </CCol>
                     <CCol xs={12} md={3}>
                      <CFormLabel htmlFor="VNum">Depo Route</CFormLabel>
                       <SearchSelectComponent
                        size="sm"
                        className="mb-2"
                        onChange={(e) => {
                          onChangeFilter(e, 'route_name')
                        }}
                        label="Select Route"
                        noOptionsMessage="Route Not found"
                        search_type="depos_route"
                        search_data={searchFilterData}
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
                          loadDepoReport('1')
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
            </>) : (<AccessDeniedComponent />
          )}
        </>
      )}

    </>
  )
}

export default DepoRoutefreightReport
