import { CButton, CCard, CCol, CContainer, CRow } from '@coreui/react'
import { Link } from 'react-router-dom'
import CustomTable from 'src/components/customComponent/CustomTable'
import React, { useEffect, useState } from 'react'
import Loader from 'src/components/Loader'
import * as XLSX from 'xlsx'
import FileSaver from 'file-saver'
import DieselVendorMasterService from 'src/Service/Master/DieselVendorMasterService'
import { GetDateTimeFormat } from 'src/Pages/Nlmt/CommonMethods/CommonMethods'
import NlmtDieselIntentCreationService from 'src/Service/Nlmt/DieselIntent/NlmtDieselIntentCreationService'
import * as NlmtScreenAccessCodes from 'src/components/constants/NlmtScreenAccessCodes'
import AccessDeniedComponent from 'src/components/commoncomponent/AccessDeniedComponent'
import JavascriptInArrayComponent from 'src/components/commoncomponent/JavascriptInArrayComponent' 

const NlmtDIConfirmationHome = () => {
  /*================== User Location Fetch ======================*/
  const user_info_json = localStorage.getItem('user_info')
  const user_info = JSON.parse(user_info_json)
  const user_locations = []

  user_info?.location_info?.map((data) => {
    user_locations.push(Number(data.id))
  })

  /* Vehicle Current Position */
  const Vehicle_Current_Position = {
    TRIP_EXPENSE_CAPTURE: 26,
    TRIP_INCOME_CAPTURE: 27,
    TRIP_INCOME_REJECT: 261,
    TRIP_SETTLEMENT_REJECT: 29,
    DI_CREATION: 37,
  }

  /* ==================== Access Part Start ========================*/
  const [screenAccess, setScreenAccess] = useState(false)
  let page_no =  NlmtScreenAccessCodes.NlmtTransactionScreens.Nlmt_DI_Confirmation

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
  const [dieselVendorsData, setDieselVendorsData] = useState([])

  function formatDate(date) {
    if (!date) return '-'
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear()

    if (month.length < 2) month = '0' + month
    if (day.length < 2) day = '0' + day

    return [day, month, year].join('-')
  }

  const loadVehicleReadyToTrip = () => {
    NlmtDieselIntentCreationService.getVehicleReadyToDieselConfirm().then((res) => {
      setFetch(true)

      const tableData = Array.isArray(res.data.data)
        ? res.data.data
        : [res.data.data]

      console.log('API Data:', tableData)
      console.log('User Locations:', user_locations)

      let rowDataList = []

      const filterData1 = tableData.filter((data) => {
        const locationId = Number(data.parking_info?.vehicle_location_id)
        return user_locations.includes(locationId)
      })

      console.log('Filtered Data:', filterData1)

      filterData1.map((data, index) => {
        rowDataList.push({
          sno: index + 1,

          Tripsheet_No: data.NlmtTripsheetInfo?.nlmt_tripsheet_no ?? '-',
          Tripsheet_Date: formatDate(data.NlmtTripsheetInfo?.created_at),

          Diesel_Bunk: data.di_vendor_info?.diesel_vendor_name ?? '-',
          Diesel_Bunk_Code: data.vendor_code ?? '-',
          Vehicle_No: data.NlmtVehicleInfo?.vehicle_number ?? '-',

          Driver_Name: data.NlmtDriverInfo?.driver_name ?? '-',

          Waiting_At: (
            <span className="badge rounded-pill bg-info">
              {Number(data.prev_curr_pos) === Vehicle_Current_Position.TRIP_EXPENSE_CAPTURE
                ? 'Expense Capture'
                : Number(data.prev_curr_pos) ===
                  Vehicle_Current_Position.TRIP_INCOME_CAPTURE
                ? 'Income Capture'
                : Number(data.prev_curr_pos) ===
                  Vehicle_Current_Position.TRIP_INCOME_REJECT
                ? 'Income Reject'
                : Number(data.prev_curr_pos) ===
                  Vehicle_Current_Position.DI_CREATION
                ? 'DI Creation'
                : Number(data.prev_curr_pos) ===
                  Vehicle_Current_Position.TRIP_SETTLEMENT_REJECT
                ? 'Settlement Reject'
                : 'DI Creation'}
            </span>
          ),

          Screen_Duration: data.di_creation_time,
          Overall_Duration: data.created_at,

          Action: (
            <CButton className="badge text-white" color="warning">
              <Link to={`${data.id}`} className="text-white">
                Diesel Indent Confirmation
              </Link>
            </CButton>
          ),
        })
      })

      setRowData(rowDataList)
    })
  }

  const exportToCSV = () => {
    let dateTimeString = GetDateTimeFormat(1)
    let fileName = 'Diesel_Confirmation_Screen_Report_' + dateTimeString
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
    loadVehicleReadyToTrip()

    DieselVendorMasterService.getDieselVendors().then((response) => {
      setDieselVendorsData(response.data.data)
    })
  }, [])

  function secondsToDhms(date) {
    if (!date) return '-'
    let t1 = new Date(date)
    let t2 = new Date()

    var unix_seconds = Math.abs(t1.getTime() - t2.getTime()) / 1000

    var d = Math.floor(unix_seconds / (3600 * 24))
    var h = Math.floor((unix_seconds % (3600 * 24)) / 3600)
    var m = Math.floor((unix_seconds % 3600) / 60)

    var dDisplay = d > 0 ? d + (d == 1 ? ' day ' : ' days ') : ''
    var hDisplay =
      h > 0 ? h + (h == 1 ? ' hr and ' : ' hrs and ') : '0 hr and '
    var mDisplay =
      m > 0 ? m + (m == 1 ? ' min ' : ' mins ') : '0 mins '

    return dDisplay + hDisplay + mDisplay
  }

  const columns = [
    { name: 'S.No', selector: (row) => row.sno, sortable: true, center: true },
    {
      name: 'Tripsheet Number',
      selector: (row) => row.Tripsheet_No,
      sortable: true,
      center: true,
    },
    {
      name: 'TripSheet Date',
      selector: (row) => row.Tripsheet_Date,
      sortable: true,
      center: true,
    },
    {
      name: 'Diesel Bunk',
      selector: (row) => row.Diesel_Bunk,
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
      name: 'Current Status',
      selector: (row) => row.Waiting_At,
      sortable: true,
      center: true,
    },
    {
      name: 'Screen Duration',
      selector: (row) => secondsToDhms(row.Screen_Duration),
      center: true,
      sortable: true,
    },
    {
      name: 'Action',
      selector: (row) => row.Action,
      center: true,
    },
  ]

  return (
    <>
      {!fetch && <Loader />}
      {fetch && (
        <>
          {screenAccess ? (
            <>
              <CCard className="mt-4">
                <CContainer className="mt-1">
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
                        color="success"
                        className="px-3 text-white"
                        onClick={exportToCSV}
                      >
                        EXPORT
                      </CButton>
                    </CCol>
                  </CRow>

                  <CustomTable
                    columns={columns}
                    data={rowData}
                    fieldName={'Diesel_intent_Confirmation'}
                    showSearchFilter={true}
                  />
                  <hr />
                </CContainer>
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

export default NlmtDIConfirmationHome
