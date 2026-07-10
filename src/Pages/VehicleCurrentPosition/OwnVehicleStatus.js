import { React, useState, useEffect } from 'react'
import { CButton, CCard, CCol, CContainer, CRow, CTooltip } from '@coreui/react'
import { Link } from 'react-router-dom'
import CustomTable from 'src/components/customComponent/CustomTable' 
import Loader from 'src/components/Loader' 
import AccessDeniedComponent from 'src/components/commoncomponent/AccessDeniedComponent'
import JavascriptInArrayComponent from 'src/components/commoncomponent/JavascriptInArrayComponent'
import * as LogisticsProScreenNumberConstants from 'src/components/constants/LogisticsProScreenNumberConstants'
import VehicleMasterService from 'src/Service/Master/VehicleMasterService'
import * as XLSX from 'xlsx';
import FileSaver from 'file-saver'
import { GetDateTimeFormat } from '../Depo/CommonMethods/CommonMethods'

const OwnVehicleStatus = () => {
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
  let page_no = LogisticsProScreenNumberConstants.OtherModuleScreen.Vehicle_Current_Position

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

  const exportToCSV = () => {
    let dateTimeString = GetDateTimeFormat(1)
    let fileName='Own_Vehicle_Status_'+dateTimeString
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';
    const ws = XLSX.utils.json_to_sheet(rowData);
    const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], {type: fileType});
    FileSaver.saveAs(data, fileName + fileExtension);
  }

  function formatDate(date) {

    if(date == '-'){
      return date
    }
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

  const getDateTime = (myDateTime, type=0) => {

    if(myDateTime == '-'){
      return myDateTime
    }
    let myTime = '-'
    if(type == 1){
      myTime = new Date(myDateTime).toLocaleTimeString('en-US',{ hour: '2-digit', minute: '2-digit' });
    } else if(type == 2){
      myTime = new Date(myDateTime).toLocaleDateString('en-US',{ month: 'short', year: 'numeric' });
    } else {
      myTime = new Date(myDateTime).toLocaleString('en-US');
    }
    
    return myTime
  }

  const getOwnVehicleStatusData = () => {
    VehicleMasterService.getOwnTripVehicles().then((res) => {
        
      let closureData = res.data 
      console.log(closureData,'getOwnTripVehicles')
      setFetch(true)

      let rowDataList = [] 
      closureData.map((data, index) => {
        rowDataList.push({
          sno: index + 1,
          vehicle_no	: data.vehicle_no,
          vehicle_group	: data.vehicle_group,
          driver_name: data.driver_name,
          driver_contact_no: data.driver_contact_number,
          vehicle_location	: data.vehicle_location, 
          vehicle_position	: data.vehicle_position, 
          running_tripsheet_no	: data.tripsheet_no, 
          tripsheet_date: formatDate(data.tripsheet_date_time),
          tripsheet_time: getDateTime(data.tripsheet_date_time,1),
          tripsheet_month: getDateTime(data.tripsheet_date_time,2), 
          tripsheet_purpose	: data.tripsheet_purpose, 
          divison	: data.divison, 
          Last_Screen_Updation_Time	: data.vehicle_position_updated_time1, 
          yard_gate_in_time: data.yard_gate_in_time,
          vehicle_waiting_hours: data.vehicle_waiting_hours,
          yard_gate_out_time: data.yard_gate_out_time,
          vehicle_intransist_hours: data.vehicle_intransist_hours,
          vehile_waiting_hours_from_ts_creation: data.vehile_waiting_hours_from_ts_creation,
          Screen_Duration: data.vehicle_position_updated_time,
          Action: (
            <CTooltip
                content={`Click here to find a Tripsheet Status in an New Tab`}
                placement="top"
              >
                <CButton className="badge m-3" color="warning">
                    <Link className="text-white" target='_blank' to={`/VehicleTripSearch`}>
                        Tripsheet Status
                    </Link>
                </CButton> 
            </CTooltip>
          ),
        })
      })
      setRowData(rowDataList)
      setPending(false)
    })
  }

  useEffect(() => {
    getOwnVehicleStatusData()
  }, [])

  const columns = [
    {
      name: 'S.No',
      selector: (row) => row.sno,
      sortable: true,
      center: true,
    },
    {
        name: 'Vehicle No',
        selector: (row) => row.vehicle_no,
        sortable: true,
        center: true,
    },
    {
      name: 'Vehicle Group',
      selector: (row) => row.vehicle_group,
      sortable: true,
      center: true,
    },
    {
        name: 'Vehicle Position',
        selector: (row) => row.vehicle_position,
        sortable: true,
        center: true,
    },
    // {
    //     name: 'Vehicle Screen',
    //     selector: (row) => row.vehicle_location,
    //     sortable: true,
    //     center: true,
    // },
    {
      name: 'TripSheet No',
      selector: (row) => row.running_tripsheet_no,
      sortable: true,
      center: true,
    },
    {
      name: 'TripSheet Date',
      selector: (row) => row.tripsheet_date,
      sortable: true,
      center: true,
    },
    {
        name: 'Purpose',
        selector: (row) => row.tripsheet_purpose,
        sortable: true,
        center: true,
    },
    {
        name: 'Division',
        selector: (row) => row.divison,
        sortable: true,
        center: true,
    },    
    {
      name: 'Screen Duration',
      selector: (row) => row.Screen_Duration,
      center: true,
      sortable: true,
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
                                    <CRow className="mt-3">
                                        <CCol md={3}></CCol>
                                        <CCol md={3}></CCol>
                                        <CCol md={3}></CCol>
                                        <CCol md={3} style={{textAlign:'end'}}>  
                                            <CButton
                                                className="text-white"                              
                                                color="success" 
                                                size="lg-sm"
                                            >
                                                <CTooltip
                                                    content={`Click here to find a Tripsheet Status in an New Tab`}
                                                    placement="top"
                                                >
                                                    <span className="float-start">
                                                        <Link target='_blank' to={`/VehicleTripSearch`}>
                                                            <i className="fa fa-eye" style={{ color:"blue" }} aria-hidden="true"></i> &nbsp;
                                                            <span style={{ color:"black" }}>Tripsheet Status </span>
                                                        </Link>
                                                    </span>
                                                </CTooltip>
                                            </CButton>                                          
                                            <CButton
                                                size="lg-sm"
                                                color="warning"
                                                className="m-3 px-3 text-white" 
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
                                      ppp={70} /* paginationPerPage ?: number; */
                                      prppo={[30,40,60,90]} /* paginationRowsPerPageOptions?: number[]; */
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

export default OwnVehicleStatus
