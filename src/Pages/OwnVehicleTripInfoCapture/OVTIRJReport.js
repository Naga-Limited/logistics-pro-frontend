import React, { useState, useEffect } from 'react'
import {
  CButton,
  CCard,
  CRow,
  CCol, 
  CContainer, 
  CFormLabel,
} from '@coreui/react'  
import CustomTable from 'src/components/customComponent/CustomTable' 
import { toast } from 'react-toastify'
import Loader from 'src/components/Loader'
import { DateRangePicker } from 'rsuite' 
import FileSaver from 'file-saver'
import * as XLSX from 'xlsx'; 
import { GetDateTimeFormat } from '../Depo/CommonMethods/CommonMethods'
import * as LogisticsProScreenNumberConstants from 'src/components/constants/LogisticsProScreenNumberConstants'
import { useRef } from 'react'
import { useReactToPrint } from 'react-to-print'  
import JavascriptInArrayComponent from 'src/components/commoncomponent/JavascriptInArrayComponent'
import AccessDeniedComponent from 'src/components/commoncomponent/AccessDeniedComponent'
import OVTICSearchSelectComponent from './OVTICSearchSelectComponent'
import TripInfoCaptureService from 'src/Service/TripInfoCapture/TripInfoCaptureService'
import VehicleGroupService from 'src/Service/SmallMaster/Vehicles/VehicleGroupService'  

const OVTIRJReport = () => { 

  /*================== User Id & Location Fetch ======================*/
  const user_info_json = localStorage.getItem('user_info')
  const user_info = JSON.parse(user_info_json)
  const user_locations = []

  /* Get User Locations From Local Storage */
  user_info.location_info.map((data, index) => {
    user_locations.push(data.id)
  })

  /* Get User Id From Local Storage */
  const user_id = user_info.user_id

  /* ==================== Access Part Start ========================*/
  const [screenAccess, setScreenAccess] = useState(false) 
  let page_no = LogisticsProScreenNumberConstants.DeliveryTrackModule.OVTIC_RJ_Report

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

  const onChangeFilter = (event, event_type) => {
    var selected_value = event.value
    console.log(selected_value, 'selected_value')
    console.log(event_type, 'event_type')

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
    } 
  }
  const [vehicleGroup, setVehicleGroup] = useState([])

  useEffect(() => {

    //section for getting vehicle group from database
    VehicleGroupService.getVehicleGroup().then((res) => {
      let vgdata = res.data.data
      console.log(vgdata,'vehicleGroupFinder-vgdata')
      setVehicleGroup(vgdata)
    })
  }, [])

  const vehicleGroupFinder = (id) => {
    let vg = '-'
    console.log(id,'vehicleGroupFinder-id')
    vehicleGroup.map((vv,kk)=>{
      // console.log(vv,'vehicleGroupFinder-vv')
      if(vv.id == id){
        vg = vv.vehicle_group	
      }
    })
    console.log(vg,'vehicleGroupFinder-vg')
    return vg
  }

  const getDateTime = (myDateTime, type=0) => {
    let myTime = '-'
    if(type == 1){
      myTime = new Date(myDateTime).toLocaleTimeString('en-US',{ hour: '2-digit', minute: '2-digit' });
    } else if(type == 2){
      myTime = new Date(myDateTime).toLocaleDateString('en-US',{ month: 'short', year: 'numeric' });
    } else if(type == 3){
      myTime = new Date(myDateTime).toLocaleTimeString('en-US',{ hour12: false, hour: '2-digit', minute: '2-digit' });
    } else {
      myTime = new Date(myDateTime).toLocaleString('en-US');
    }
    
    return myTime
  }

  const exportToCSV1 = () => {
    // Create a new workbook
    const workbook = XLSX.utils.book_new();

    // Define headers
    const headers = ['Name', 'Age', 'Location'];

    // Create a new worksheet
    const worksheet = XLSX.utils.aoa_to_sheet([['List Transaction'], headers]);

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

    // Style the header row
    const headerStyle = {
      font: { bold: true },
      fill: { fgColor: { rgb: '3366FF' } }, // Blue background color
      alignment: { horizontal: 'center' },
    };
    const range = XLSX.utils.decode_range(worksheet['!ref']);
    for (let col = range.s.c; col <= range.e.c; col++) {
      const cellAddress = XLSX.utils.encode_cell({ r: range.s.r + 1, c: col }); // Offset by 1 to skip the title cell
      worksheet[cellAddress].s = headerStyle;
    }

    // Write the workbook to a file
    XLSX.writeFile(workbook, 'example.xlsx');
  }
  const exportToCSV = (e1) => {
    if(rowData.length == 0){
      toast.warning('No Data Found..!')
      return false
    }
    console.log(rowData,'exportCsvData')
    let dateTimeString = GetDateTimeFormat(1)
    let fileName='NAGA_Trip_RJ_Info_Capture_Report_'+dateTimeString
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

  const [pending, setPending] = useState(true)

  /* Report Variables */
  const [reportVehicle, setReportVehicle] = useState(0)
  const [reportTSNo, setReportTSNo] = useState(0) 
  const [reportTSId, setReportTSId] = useState(0) 
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

  const ovticdiffTime=(start, end)=> {

    let st = new Date(start)
    let et = new Date(end)
    let needed_difference_time = (et-st)/1000
    let date = new Date(null);
    date.setSeconds(needed_difference_time); 
    let result = date.toISOString().slice(11, 19);
    return result

  }

  const eDieselFinder = (data) => {
    let td = 0

    console.log(data,'diesel-data')
    data.map((vv,kk)=>{
      td = Number(parseFloat(td).toFixed(2)) + Number(parseFloat(vv.di_enr_qty).toFixed(2)) 
    })
    return Number(parseFloat(td).toFixed(2))
  }

  const totDieselFinder = (vv) => {

    let v1 = eDieselFinder(vv.tic_child2_info) /* Enroute Diesel */
    let v2 = vv.di_status > 1 ? vv.di_rns_qty : 0 /* RNS Diesel */

    return Number(parseFloat(v1).toFixed(2)) + Number(parseFloat(v2).toFixed(2)) 
  }

  const mileageFinder = (vv) => {

    let total_diesel = totDieselFinder(vv) 

    let startkm = vv.opening_km
    let endkm = vv.closing_km

    let tripkm = 0

    let ans = '-'

    if(startkm && Number(startkm) > 0 && endkm && Number(endkm) > 0){
      tripkm = Number(endkm) - Number(startkm)
    }  

    if(tripkm != 0){
      ans = Number(parseFloat(tripkm).toFixed(2)) / Number(parseFloat(total_diesel).toFixed(2)) 
      return Number(parseFloat(ans).toFixed(2))
    }    

    return ans
  }

  const tic_child_status_array = ['','Created','Updated']
  const tic_parent_status_array = ['','Created','Updated','Settlement Completed','','','Completed','Closed']

  const divarray = ['','NLFD','MMD','NLDV','NLMD','NLLD','NLCD','NLIF','NLSD'] 

  const divisionFinder = (data,divison) => {
    let div = '111'
    console.log(data,'divisionFinder-data')
    console.log(divison,'divisionFinder-divison')

    if(data.child_type == 2){
      div = 'NLFD'
    } else if(data.child_type == 1 || data.child_type == 3 ){
      div = (divison == 2 ? 'NLCD' : 'NLFD')
    } else if(data.child_type == 4){
      div = divarray[divison]
    }  
    return div
  }

  function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [day, month, year].join('/');
  }

  const totalKMFinder = (a,b,c,d) => { 
    let km1 = Number.isInteger(Number(a)) ? Number(a) : 0
    let km2 = Number.isInteger(Number(b)) ? Number(b) : 0
    let km3 = Number.isInteger(Number(c)) ? Number(c) : 0
    let km4 = Number.isInteger(Number(d)) ? Number(d) : 0
    console.log('totalKMFinder : FJ Empty = > ',km1,', Start = > ',km2,', End = > ',km3,', To Empty = > ',km4)
    let tk = km1+km2+km3+km4
    let totalkm = Number(parseFloat(tk).toFixed(2))
    console.log(totalkm,'totalKMFinder-totalkm')
    return totalkm
  }

  function autoCaps(str) {
    return str ? str.toUpperCase() : ''
  }

  const LoadWeightFinder = (data) => {
    let second_weight = data.oa_weight ? Number(data.oa_weight) : 0
    let first_weight = data.e_weight ? Number(data.e_weight) : 0
    let load_weight = Number(second_weight-first_weight)
    return load_weight
  }

  const loadTripShipmentReport = (fresh_type = '') => {
    /*================== User Location Fetch ======================*/
    const user_info_json = localStorage.getItem('user_info')
    const user_info = JSON.parse(user_info_json)
    var user_locations = []

    /* Get User Locations From Local Storage */
    user_info.location_info.map((data, index) => {
      user_locations.push(data.id)
    })

    const TripTypyeFinder = (val1,val2) => {

      let type = ''
      const movement_type = ['','RMSTO','RAKE','OTHERS','FCI']
      if(val1 == 1){
        type = 'FG_SALES'
      } else if(val1 == 2){
        type = 'RJSO'
      } else if(val1 == 3){
        type = 'FG_STO'
      } else if(val1 == 4){
        type = movement_type[val2]
      }  

      return type

    }

    if (fresh_type !== '1') { 

      TripInfoCaptureService.getTICRJInfoForReport().then((response) => {  
        console.log(response,'response') 
        tableReportData = response.data  
        let ind = 0
        let rowDataList = [] 
        tableReportData.map((data, index) => {
          ind++
          
          rowDataList.push({
            
            S_NO : ind,  
            RJ_LOAD_DATE : formatDate(data.start_time),
            TS_NO : data.ts_no,
            VEHICLE_NO : data.veh_no,	
            VEHICLE_GROUP : data.vehicle_group,
            VEHICLE_CAPCITY : data.vehicle_capacity ? `${data.vehicle_capacity}`: '-',
            DRIVER_NAME	: autoCaps(data.driver_name), 
            RJ_FROM	: autoCaps(data.from_place),
            RJ_TO	: autoCaps(data.to_place),
            CODE : data.rj_customer_code ? data.rj_customer_code: '-',
            CUSTOMER_SHED_NAME : data.rj_customer_name ? data.rj_customer_name: '-',
            OVER_ALL_WEIGHT : data.oa_weight,
            EMPTY_WEIGHT : data.e_weight,
            LOAD_WEIGHT : LoadWeightFinder(data),
            MATERIAL : autoCaps(data.m_type),
            MTS_BAG_RATE : data.mbr_value,
            AMOUNT : data.freight ? data.freight: '-', 
            LP_Entry_Date: formatDate(data.created_at),
            LP_Completion_Date: formatDate(data.tic_completion_date),
            RJ_REMARKS : data.remarks,            
            Home_Diesel_Confirmation_Date :formatDate(data.di_confirmed_at),     
            Home_Diesel_Approval_Posting_Date : formatDate(data.di_approval_posting_date),          
            RJ_SO_NO : data.rjso_number ? data.rjso_number : '-',
            RJ_Invoice_NO : data.invoice_number ? data.invoice_number : '-',
            RJ_Invoice_Date : data.invoice_date ? data.invoice_date : '-',
          }) 
        })
        
        setSearchFilterData(tableReportData)
        setFetch(true)
        setRowData(rowDataList)
        setPending(false)
      })
    } else {
      if (defaultDate == null) {
        toast.warning('Date Filter Should not be empty..!')
        return false
      } else if (
        defaultDate == null &&
        reportVehicle == 0 && 
        reportTSNo == 0 
      ) {
        toast.warning('Choose atleast one filter type..!')
        return false
      }
      let report_form_data = new FormData()
      report_form_data.append('date_between', defaultDate)
      report_form_data.append('vehicle_no', reportVehicle) 
      report_form_data.append('tripsheet_no', reportTSNo) 
      console.log(defaultDate, 'defaultDate')
      console.log(reportVehicle, 'reportVehicle') 
      console.log(reportTSNo, 'reportTSNo')  
      // return false
      setFetch(false)
      TripInfoCaptureService.sentTICRJInfoForReport(report_form_data).then((res) => {
        console.log(res, 'res')
        tableReportData = res.data
        console.log(tableReportData,'tableReportData2') 
        
        let ind = 0
        let rowDataList = [] 
        tableReportData.map((data, index) => {
          ind++
          
          rowDataList.push({
            
            S_NO : ind,  
            RJ_LOAD_DATE : formatDate(data.start_time),
            TS_NO : data.ts_no,
            VEHICLE_NO : data.veh_no,	
            VEHICLE_GROUP : data.vehicle_group,
            VEHICLE_CAPCITY : data.vehicle_capacity ? `${data.vehicle_capacity}`: '-',
            DRIVER_NAME	: autoCaps(data.driver_name),            
            RJ_FROM	: autoCaps(data.from_place),
            RJ_TO	: autoCaps(data.to_place),
            CODE : data.rj_customer_code ? data.rj_customer_code: '-',
            CUSTOMER_SHED_NAME : data.rj_customer_name ? data.rj_customer_name: '-',
            OVER_ALL_WEIGHT : data.oa_weight,
            EMPTY_WEIGHT : data.e_weight,
            LOAD_WEIGHT : LoadWeightFinder(data),
            MATERIAL : autoCaps(data.m_type),
            MTS_BAG_RATE : data.mbr_value, 
            AMOUNT : data.freight ? data.freight: '-',            
            LP_Entry_Date: formatDate(data.created_at),
            LP_Completion_Date: formatDate(data.tic_completion_date),
            RJ_REMARKS : data.remarks,            
            Home_Diesel_Confirmation_Date :formatDate(data.di_confirmed_at),     
            Home_Diesel_Approval_Posting_Date : formatDate(data.di_approval_posting_date),  
            RJ_SO_NO : data.rjso_number ? data.rjso_number : '-',
            RJ_Invoice_NO : data.invoice_number ? data.invoice_number : '-',
            RJ_Invoice_Date : data.invoice_date ? data.invoice_date : '-',
          }) 
        }) 
        setSearchFilterData(tableReportData)
        setFetch(true)
        setRowData(rowDataList)
        setPending(false)
      })
    }
  }
 
  useEffect(() => {
    loadTripShipmentReport()
  }, [vehicleGroup])

 
  // ============ Column Header Data =======

  const columns = [
    {
      name: 'S.No',
      selector: (row) => row.S_NO,
      sortable: true,
      center: true,
    },
    {
      name: 'Tripsheet',
      selector: (row) => row.TS_NO,
      sortable: true,
      center: true,
    }, 
    {
      name: 'Vehicle No',
      selector: (row) => row.VEHICLE_NO,
      sortable: true,
      center: true,
    },
    {
      name: 'Vehicle Group',
      selector: (row) => row.VEHICLE_GROUP,
      sortable: true,
      center: true,
    },
    {
      name: 'Driver Name',
      selector: (row) => row.DRIVER_NAME,
      sortable: true,
      center: true,
    },
    {
      name: 'RJ Customer',
      selector: (row) => row.CUSTOMER_SHED_NAME,
      sortable: true,
      center: true,
    },
    {
      name: 'RJ SO No',
      selector: (row) => row.RJ_SO_NO,
      sortable: true,
      center: true,
    },     
    {
      name: 'From Place',
      selector: (row) => row.RJ_FROM,
      sortable: true,
      center: true,
    },
    {
      name: 'TO Place',
      selector: (row) => row.RJ_TO,
      sortable: true,
      center: true,
    },   
    {
      name: 'RJ Amount',
      selector: (row) => row.AMOUNT,
      sortable: true,
      center: true,
    },
  ]

  //============ column header data=========

  function getCurrentDate(separator = '') {
    let newDate = new Date()
    let date = newDate.getDate()
    let month = newDate.getMonth() + 1
    let year = newDate.getFullYear()

    return `${year}${separator}${month < 10 ? `0${month}` : `${month}`}${separator}${
      date < 10 ? `0${date}` : `${date}`
    }`
  }

  const componentRef = useRef();
    const handleprint = useReactToPrint({
      content : () => componentRef.current,
    });
    function printReceipt() {
      window.print();
    }

  return (
    <>
      {!fetch && <Loader />}
      {fetch && (
        <>
          {screenAccess ? (
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

                  <CCol xs={12} md={3}>
                    <CFormLabel htmlFor="VNum">Vehicle Number</CFormLabel>
                    <OVTICSearchSelectComponent
                      size="sm"
                      className="mb-2"
                      onChange={(e) => {
                        onChangeFilter(e, 'vehicle_no')
                      }}
                      label="Select Vehicle Number"
                      noOptionsMessage="Vehicle Not found"
                      search_type="ovtic_rj_report_vehicle_number"
                      search_data={searchFilterData}
                    />
                  </CCol> 

                  <CCol xs={12} md={3}>
                    <CFormLabel htmlFor="VNum">Tripsheet Number</CFormLabel>
                    <OVTICSearchSelectComponent
                      size="sm"
                      className="mb-2"
                      onChange={(e) => {
                        onChangeFilter(e, 'tripsheet_no')
                      }}
                      label="Select Tripsheet Number"
                      noOptionsMessage="Tripsheet Not found"
                      search_type="ovtic_rj_report_tripsheet_number"
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
                        loadTripShipmentReport('1')
                      }}
                    >
                      Filter
                    </CButton>
                    <CButton
                      size="lg-sm"
                      color="warning"
                      className="mx-3 px-3 text-white"
                      onClick={(e) => { 
                          exportToCSV(e)
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
          ) : (<AccessDeniedComponent />)}
        </>
      )}
    </>
  )
}

export default OVTIRJReport
