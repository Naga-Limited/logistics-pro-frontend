import { CButton, CCard, CCol, CContainer, CRow } from '@coreui/react'
import { Link } from 'react-router-dom'
import CustomTable from 'src/components/customComponent/CustomTable'
import React, { useEffect, useState } from 'react'
import Loader from 'src/components/Loader'
import AdvanceCreationService from 'src/Service/Advance/AdvanceCreationService'
import DieselIntentCreationService from 'src/Service/DieselIntent/DieselIntentCreationService'
import * as XLSX from 'xlsx';
import FileSaver from 'file-saver'
import AccessDeniedComponent from 'src/components/commoncomponent/AccessDeniedComponent'
import JavascriptInArrayComponent from 'src/components/commoncomponent/JavascriptInArrayComponent'
import * as LogisticsProScreenNumberConstants from 'src/components/constants/LogisticsProScreenNumberConstants'
import { GetDateTimeFormat } from '../Depo/CommonMethods/CommonMethods'

const DieselIntentHome = () => {
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
let page_no = LogisticsProScreenNumberConstants.DieselIntentModule.Diesel_Intent_Creation_Request

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
  const ACTION = {
    TRIPSHEET_CREATED: 16,
    SHIPMENT_CREATED: 22,
    NLCD_SHIPMENT_CREATED: 25,
    RJ_SALES_ORDER: 35,
    HIRE_TRIPSTO_AFTER_GATE_OUT: 10,
    HIRE_TRIPSTO_AFTER_GATE_OUT_NLCD: 14,
    TRIPSHEET_OWN_NLCD: 2,
    TRIPSHEET_SALES: 1,
    TRIPSHEET_OWN_NLFD: 1,
    TRIPSHEET_STO: 2,
    ADVANCE_CREATED: 18,
    TRIPSHEET_CREATED: 16,
    OWN_TRIPSTO_AFTER_GATE_OUT_NLFD: 16,
    OWN_TRIPSTO_AFTER_GATE_OUT_NLCD: 12,
    OWN_FG_SALES_SHIPMENT_GATE_OUT_NLFD: 15,
    OWN_FG_SALES_SHIPMENT_GATE_OUT_NLCD: 11,
    HIRE_FG_SALES_SHIPMENT_GATE_OUT_NLFD: 17,
    HIRE_FG_SALES_SHIPMENT_GATE_OUT_NLCD: 13,
    OWN_RMSTO_GATE_OUT: 8,
    OWN_FCI_GATE_OUT: 22,
  }

  const loadVehicleReadyToTrip = () => {
    DieselIntentCreationService.getVehicleReadyToDiesel().then((res) => {
      setFetch(true)
      tableData = res.data.data
      console.log(tableData)
      let rowDataList = []
      const filterData1 = tableData.filter(
        (data) => user_locations.indexOf(data.vehicle_location_id) != -1
      )
      // console.log(filterData)
      const filterData = filterData1.filter(
        (data) =>
          (data.vehicle_type_id.id == '3' &&
          data.trip_sheet_info ? data.trip_sheet_info.advance_payment_diesel > '0':'') ||
          data.vehicle_type_id.id != 3
      )

      filterData.map((data, index) => {
        rowDataList.push({
          sno: index + 1,
          Tripsheet_No: data.trip_sheet_info?.trip_sheet_no,
          Tripsheet_Date: data.trip_sheet_info?.created_date,
          Vehicle_Type: data.vehicle_type_id.type,
          Vehicle_No: data.vehicle_number,
          Driver_Name: data.driver_name,
          Waiting_At: (
            <span className="badge rounded-pill bg-info">
              {data.vehicle_current_position == ACTION.ADVANCE_CREATED &&
              data.parking_status == ACTION.OWN_TRIPSTO_AFTER_GATE_OUT_NLFD
                ? 'Trip STO(NLFD)'
                : data.vehicle_current_position == ACTION.ADVANCE_CREATED &&
                  data.parking_status == ACTION.OWN_TRIPSTO_AFTER_GATE_OUT_NLCD
                ? 'Trip STO(NLCD)'
                :data.vehicle_current_position == ACTION.TRIPSHEET_CREATED &&
                  data.parking_status == ACTION.OWN_TRIPSTO_AFTER_GATE_OUT_NLFD
                ? 'Trip STO(NLFD)'
                : data.vehicle_current_position == ACTION.TRIPSHEET_CREATED &&
                    data.parking_status == ACTION.OWN_TRIPSTO_AFTER_GATE_OUT_NLCD
                ? 'Trip STO(NLCD)'
                : (data.vehicle_current_position == ACTION.TRIPSHEET_CREATED || data.vehicle_current_position == ACTION.ADVANCE_CREATED) &&
                  data.parking_status == ACTION.HIRE_TRIPSTO_AFTER_GATE_OUT
                ? 'Trip STO(NLFD)'
                : (data.vehicle_current_position == ACTION.TRIPSHEET_CREATED || data.vehicle_current_position == ACTION.ADVANCE_CREATED) &&
                  data.parking_status == ACTION.HIRE_TRIPSTO_AFTER_GATE_OUT_NLCD
                ? 'Trip STO(NLCD)'
                : data.vehicle_current_position == ACTION.SHIPMENT_CREATED &&
                  data.parking_status == ACTION.OWN_FG_SALES_SHIPMENT_GATE_OUT_NLFD
                ? 'FG SALES(NLFD)'
                : data.vehicle_current_position == ACTION.NLCD_SHIPMENT_CREATED &&
                  data.parking_status == ACTION.OWN_FG_SALES_SHIPMENT_GATE_OUT_NLCD
                ? 'FG SALES(NLCD)'
                : data.vehicle_current_position == ACTION.SHIPMENT_CREATED &&
                  data.parking_status == ACTION.HIRE_FG_SALES_SHIPMENT_GATE_OUT_NLFD
                ? 'FG SALES(NLFD)'
                : data.vehicle_current_position == ACTION.NLCD_SHIPMENT_CREATED &&
                  data.parking_status == ACTION.HIRE_FG_SALES_SHIPMENT_GATE_OUT_NLCD
                ? 'FG SALES(NLCD)'
                : data.vehicle_current_position == ACTION.TRIPSHEET_CREATED &&
                  data.parking_status == ACTION.OWN_RMSTO_GATE_OUT
                ? 'RM STO'
                : data.vehicle_current_position == ACTION.TRIPSHEET_CREATED &&
                  data.parking_status == ACTION.OWN_FCI_GATE_OUT
                ? 'FCI'
                : data.vehicle_current_position == ACTION.SHIPMENT_CREATED
                ? 'Add FG Sale(NLFD)'
                : data.vehicle_current_position == ACTION.NLCD_SHIPMENT_CREATED
                ? 'Add FG Sale(NLCD)'
                : data.vehicle_current_position == ACTION.RJ_SALES_ORDER
                ? 'RJ Sales'
                : 'Diesel Intent Creation'}
            </span>
          ),
          advance_status:(
            <span className="badge rounded-pill bg-info">
              {
                data.vehicle_type_id.id < 3 && data.trip_sheet_info.advance_status == 0 && data.trip_sheet_info.purpose < 3
                ? 'Advance ❌'
                : data.trip_sheet_info.advance_status == 1
                ? 'Advance ✅'
                :'-'
              }
            </span>
          ),
          Screen_Duration: data.vehicle_current_position_updated_time,
          Overall_Duration: data.created_at,
          Action: (
            <CButton className="badge text-white" color="warning" disabled = {(data.vehicle_type_id.id < 3 && data.trip_sheet_info.advance_status == 0 && data.trip_sheet_info.purpose < 3)}>
              {(data.vehicle_type_id?.id < 3 && data.trip_sheet_info?.advance_status == 0 && data?.trip_sheet_info.purpose < 3) ? (
              <span>Diesel Indent Creation</span>
              ):(
              <Link to={`${data.parking_yard_gate_id}`}>Diesel Indent Creation</Link>
              )}
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

  const columns = [
    {
      name: 'S.No',
      selector: (row) => row.sno,
      sortable: true,
      center: true,
    },
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
      name: 'Vehicle Type',
      selector: (row) => row.Vehicle_Type,
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
      name: 'Advance Status',
      selector: (row) => row.advance_status,
      sortable: true,
      center: true,
    },
    {
      name: 'Screen Duration',
      selector: (row) => row.Screen_Duration,
      center: true,
    },
    {
      name: ' Overall Duration',
      selector: (row) => row.Overall_Duration,
      center: true,
    },
    {
      name: 'Action',
      selector: (row) => row.Action,
      center: true,
    },
  ]

  const exportToCSV = () => {
    let dateTimeString = GetDateTimeFormat(1)
    if(rowData.length == 0){
      toast.warning('No Data Found..!')
      return false
    }
    let fileName='DI_Creation_Report_'+dateTimeString
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';
    const ws = XLSX.utils.json_to_sheet(rowData);
    const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], {type: fileType});
    FileSaver.saveAs(data, fileName + fileExtension);
  }

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
              <Link className="text-white" to="/OtherDICreation">
                <CButton size="sm" color="warning" className="px-3 text-white" type="button">
                  Other Div. Vehicles DI
                </CButton>
              </Link>
              <CButton
                size="sm"
                color="success"
                className="px-3 text-white"
                onClick={(e) => {
                  exportToCSV()
                }}
              >
                EXPORT
              </CButton>
            </CCol>
          </CRow>
          <CCard className="mt-4">
            <CContainer className="mt-1">
              <CustomTable
                columns={columns}
                data={rowData}
                fieldName={'Diesel_intent'}
                showSearchFilter={true}
              />
              <hr></hr>
            </CContainer>
          </CCard>
           </>) : (<AccessDeniedComponent />)}
        </>
      )}
    </>
  )
}

export default DieselIntentHome
