import { CButton, CCard, CCol, CContainer, CFormLabel, CRow } from '@coreui/react'
import { Link } from 'react-router-dom'
import CustomTable from 'src/components/customComponent/CustomTable'
import React, { useEffect, useState } from 'react'
import Loader from 'src/components/Loader'
import AccessDeniedComponent from 'src/components/commoncomponent/AccessDeniedComponent'
import JavascriptInArrayComponent from 'src/components/commoncomponent/JavascriptInArrayComponent'
import * as LogisticsProScreenNumberConstants from 'src/components/constants/LogisticsProScreenNumberConstants' 
import RakeTripsheetCreationService from 'src/Service/RakeMovement/RakeTripsheetCreation/RakeTripsheetCreationService'
import { DateRangePicker } from 'rsuite'
import { toast } from 'react-toastify'


const TripsheetEditHome = () => {
  /*================== User Location Fetch ======================*/
  const user_info_json = localStorage.getItem('user_info')
  const user_info = JSON.parse(user_info_json)
  const user_locations = []

  /* Get User Locations From Local Storage */
  user_info.location_info.map((data, index) => {
    user_locations.push(data.id)
  })

  // console.log(user_locations)
  /*================== User Location Fetch ======================*/

  /* ==================== Access Part Start ========================*/
  const [screenAccess, setScreenAccess] = useState(false)
  let page_no = LogisticsProScreenNumberConstants.RakeModule.Rake_Tripsheet_Edit

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

  const [rowData, setRowData] = useState([])
  const [fetch, setFetch] = useState(false)
  let tableData = []

  const loadVehicleReadyToTrip = (type='') => {
    if (type !== '1') {
      RakeTripsheetCreationService.getVehicleReadyToTripsheetEdit().then((res) => {

        setFetch(true)
        tableData = res.data.data
        console.log(tableData,'getVehicleReadyToTripsheetEdit')

        let rowDataList = []
        tableData.map((data, index) => {
          rowDataList.push({
            sno: index + 1,
            Tripsheet_No: data.rake_tripsheet_no,
            FNR_No: data.fnr_no,
            Vehicle_No: data.vehicle_no,
            Driver_Name: data.driver_name,
            Driver_Number: data.driver_phone_number,
            Vendor_Name: data.tripsheet_creation_vendor_info?.v_name,
            Vendor_Code: data.vendor_code,
            Rake_Plant: data.tripsheet_creation_plant_info?.definition_list_name,
            Created_date: data.created_date,
            Created_By: data.tripsheet_creation_user_info?.emp_name,
            Waiting_At: (
              <span className="badge rounded-pill bg-info">
                Tripsheet Edit
              </span>
            ),
            Screen_Duration: data.trip_current_position_updated_time,
            Overall_Duration: data.created_at_time,
            Action: (
              <CButton className="badge text-white" color="warning">
                <Link to={`${data.tripsheet_id}`}>Tripsheet Edit</Link>
              </CButton>
            ),
          })
        })
        setRowData(rowDataList)
      })
    } else {
      if (defaultDate == null) {
        setFetch(true)
        toast.warning('Date Filter Should not be empty..!')
        return false
      } 

      let report_form_data = new FormData()
      report_form_data.append('date_between', defaultDate) 
      console.log(defaultDate, 'defaultDate') 

      // RakeTripsheetCreationService.getVehicleReadyToTripsheetEdit().then((res) => {
      RakeTripsheetCreationService.getVehicleReadyToTripsheetEditFilterSearch(report_form_data).then((res) => {
        setFetch(true)
        tableData = res.data.data
        console.log(tableData,'getVehicleReadyToTripsheetEditFilterSearch')

        let rowDataList = []
        tableData.map((data, index) => {
          rowDataList.push({
            sno: index + 1,
            Tripsheet_No: data.rake_tripsheet_no,
            FNR_No: data.fnr_no,
            Vehicle_No: data.vehicle_no,
            Driver_Name: data.driver_name,
            Driver_Number: data.driver_phone_number,
            Vendor_Name: data.tripsheet_creation_vendor_info?.v_name,
            Vendor_Code: data.vendor_code,
            Rake_Plant: data.tripsheet_creation_plant_info?.definition_list_name,
            Created_date: data.created_date,
            Created_By: data.tripsheet_creation_user_info?.emp_name,
            Waiting_At: (
              <span className="badge rounded-pill bg-info">
                Tripsheet Edit
              </span>
            ),
            Screen_Duration: data.trip_current_position_updated_time,
            Overall_Duration: data.created_at_time,
            Action: (
              <CButton className="badge text-white" color="warning">
                <Link to={`${data.tripsheet_id}`}>Tripsheet Edit</Link>
              </CButton>
            ),
          })
        })
        setRowData(rowDataList)
      })
    }
  }

  useEffect(() => {
    loadVehicleReadyToTrip()
  }, [])

  const columns = [
    {
      name: 'S.No',
      selector: (row) => row.sno,
      sortable: true,
      center: true,
    },
    {
      name: 'Tripsheet No',
      selector: (row) => row.Tripsheet_No,
      sortable: true,
      center: true,
    },
    {
      name: 'Date',
      selector: (row) => row.Created_date,
      sortable: true,
      center: true,
    },
    {
      name: 'FNR No',
      selector: (row) => row.FNR_No,
      sortable: true,
      center: true,
    },
    {
      name: 'Vehicle No',
      selector: (row) => row.Vehicle_No,
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
      name: 'Vendor Name',
      selector: (row) => row.Vendor_Name,
      sortable: true,
      center: true,
    },
    {
      name: 'Plant',
      selector: (row) => row.Rake_Plant,
      sortable: true,
      center: true,
    },
    // {
    //   name: 'Current Status',
    //   selector: (row) => row.Waiting_At,
    //   sortable: true,
    //   center: true,
    // },
    {
      name: 'Screen Duration',
      selector: (row) => row.Screen_Duration,
      center: true,
    },
    // {
    //   name: ' Overall Duration',
    //   selector: (row) => row.Overall_Duration,
    //   center: true,
    // },
    {
      name: 'Action',
      selector: (row) => row.Action,
      center: true,
    },
  ]

  function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [day, month, year].join('-');
  }

  /* Set Default Date (Today) in a Variable State */
  const ddd = new Date(); 
  ddd.setMonth(ddd.getMonth() - 1);
  const [defaultDate, setDefaultDate] = React.useState([
    new Date(ddd),
    // new Date(getCurrentDate('-')),
    new Date(getCurrentDate('-')),
  ])

  function getCurrentDate(separator = '') {
    let newDate = new Date()
    let date = newDate.getDate()
    let month = newDate.getMonth() + 1
    let year = newDate.getFullYear()

    return `${year}${separator}${month < 10 ? `0${month}` : `${month}`}${separator}${
      date < 10 ? `0${date}` : `${date}`
    }`
  }

  useEffect(() => {
    console.log(defaultDate)
    if (defaultDate) {
      setDefaultDate(defaultDate)
    } else {
    }
  }, [defaultDate])

  return (
    <>
      {!fetch && <Loader />}
      {fetch && (
        <>
          {screenAccess ? (
            <>
              <CCard className="mt-4">
                <CRow className="m-3">
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
                  <CCol xs={12} md={3} className="mt-2"> 
                  {/* <CCol
                    className="offset-md-6"
                    xs={12}
                    sm={9}
                    md={3}
                    // style={{ display: 'flex', justifyContent: 'end' }}
                  > */}
                    <CButton
                      size="sm"
                      color="primary"
                      className="m-3 px-3 text-white" 
                      onClick={() => {
                        setFetch(false)
                        loadVehicleReadyToTrip('1')
                      }}
                    >
                      Filter
                    </CButton>
                    {/* <CButton
                      size="lg-sm"
                      color="warning"
                      className="m-3 px-3 text-white" 
                      onClick={(e) => { 
                          exportToCSV()
                        }}
                    >
                      Export
                    </CButton> */}
                  </CCol>
                </CRow> 
                <CContainer className="mt-2">
                  <CustomTable columns={columns} data={rowData} showSearchFilter={true} />
                </CContainer>
              </CCard>
            </>) : (<AccessDeniedComponent />
          )}
        </>
      )}
    </>
  )
}

export default TripsheetEditHome

