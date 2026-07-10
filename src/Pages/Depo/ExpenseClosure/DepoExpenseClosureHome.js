import { React, useState, useEffect } from 'react'
import { CButton, CCard, CCol, CContainer, CRow } from '@coreui/react'
import { Link } from 'react-router-dom'
import CustomTable from 'src/components/customComponent/CustomTable'
import Loader from 'src/components/Loader'
import AccessDeniedComponent from 'src/components/commoncomponent/AccessDeniedComponent'
import JavascriptInArrayComponent from 'src/components/commoncomponent/JavascriptInArrayComponent'
import * as LogisticsProScreenNumberConstants from 'src/components/constants/LogisticsProScreenNumberConstants'
import DepoExpenseClosureService from 'src/Service/Depo/ExpenseClosure/DepoExpenseClosureService'
import * as XLSX from 'xlsx';
import FileSaver from 'file-saver'
import { GetDateTimeFormat } from '../CommonMethods/CommonMethods'

const DepoExpenseClosureHome = () => {
  /*================== User Location Fetch ======================*/
  const user_info_json = localStorage.getItem('user_info')
  const user_info = JSON.parse(user_info_json)
  const user_locations = []
  const user_vehicle_types = []

  /* Get User Locations From Local Storage */
  user_info.location_info.map((data, index) => {
    user_locations.push(data.id)
  })

  /* Get User Vehicle Types From Local Storage */
  user_info.vehicle_type_info.map((data, index) => {
    user_vehicle_types.push(data.id)
  })

  // console.log(user_locations)
  /*================== User Location Fetch ======================*/

  /* ==================== Access Part Start ========================*/
  const [screenAccess, setScreenAccess] = useState(false)
  let page_no = LogisticsProScreenNumberConstants.DepoModuleScreens.Depo_Expense_Closure

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
  const [pending, setPending] = useState(true)
  const [fetch, setFetch] = useState(false)
  let tableData = []
  let closureData = []

  const exportToCSV = () => {

    let dateTimeString = GetDateTimeFormat(1)
    let fileName='DepoExpenseClosure_'+dateTimeString
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
  }

  /* Vehicle Current Position */
  const VEHICLE_CURRENT_POSITION = {
    DEPO_SHIPMENT_COMPLETED: 22,
    DEPO_CLOSURE_APPROVAL_REJECTED: 26
  }

  /* Vehicle Current Parking Status */
  const VEHICLE_CURRENT_PARKING_STATUS = {
    DEPO_SHIPMENT_COMPLETED_GATE_OUT: 15,
  }

  const getClosureVehiclesData = () => {
    DepoExpenseClosureService.getVehicleReadyToTripClose().then((res) => {
      closureData = res.data.data
      console.log(closureData,'closureData')
      setFetch(true)

      let rowDataList = []
      const filterData = closureData.filter(
        (data) =>
          user_locations.indexOf(data.vehicle_location_id) != -1
      )

      filterData.map((data, index) => {
        rowDataList.push({
          S_No: index + 1,
          Tripsheet_No: data.shipment_info.trip_sheet_info.depo_tripsheet_no,
          Tripsheet_Date: data.shipment_info.trip_sheet_info.created_date,
          Shipment_No: data.shipment_info.shipment_no,
          Shipment_Date: data.shipment_info.created_at_date,
          Contractor_Name: data.contractor_info.contractor_name,
          Contractor_Code: data.contractor_info.contractor_code,
          Vehicle_No: data.shipment_info.trip_sheet_info.trip_vehicle_info.vehicle_number,
          Driver_Name: data.shipment_info.trip_sheet_info.trip_driver_info.driver_name,
          Waiting_At:
              data.vehicle_current_position ==
                  VEHICLE_CURRENT_POSITION.DEPO_SHIPMENT_COMPLETED
                ? 'Shipment ✔️ Gateout'
                : data.vehicle_current_position ==
                  VEHICLE_CURRENT_POSITION.DEPO_CLOSURE_APPROVAL_REJECTED
                ? 'Approval ❌'
                :'Gate Out',
          Screen_Duration: data.vehicle_current_position_updated_time,
          Overall_Duration: data.created_at,
          Action: (
            <CButton className="badge" color="warning">
              <Link className="text-white" to={`/DepoExpenseClosure/${data.depo_parking_yard_gate_id}`}>
                Expense Closure
              </Link>
            </CButton>
          ),
        })
      })
      setRowData(rowDataList)
      setPending(false)
    })
  }

  useEffect(() => {
    getClosureVehiclesData()
  }, [])

  const columns = [
    {
      name: 'S.No',
      selector: (row) => row.S_No,
      sortable: true,
      center: true,
    },
    {
      name: 'TripSheet No',
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
      name: 'Contractor Name',
      selector: (row) => row.Contractor_Name,
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
      center: true,
    },
    {
      name: 'Screen Duration',
      selector: (row) => row.Screen_Duration,
      center: true,
      sortable: true,
    },
    // {
    //   name: ' Overall Duration',
    //   selector: (row) => row.Overall_Duration,
    //   center: true,
    //   sortable: true,
    // },
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
                <CContainer className="mt-2">
                  <CRow>
                    <CCol
                      className="offset-md-9"
                      xs={12}
                      sm={12}
                      md={3}
                      style={{ display: 'flex', justifyContent: 'end' }}
                      >
                        <CButton
                        size="lg-sm"
                        color="warning"
                        className="mx-3 px-3 text-white"
                        onClick={(e) => {
                          exportToCSV()}
                          }>
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
            </> ) : (<AccessDeniedComponent />
          )}
   	    </>
      )}
    </>
  )
}

export default DepoExpenseClosureHome

