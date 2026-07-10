import React, { useState, useEffect } from 'react'
import {
  CButton,
  CCard,
  CRow,
  CCol, 
  CContainer, 
  CFormLabel,
} from '@coreui/react' 
import { useNavigate } from 'react-router-dom'
import CustomTable from 'src/components/customComponent/CustomTable' 
import { toast } from 'react-toastify'
import Loader from 'src/components/Loader'
import { DateRangePicker } from 'rsuite' 
import SearchSelectComponent from 'src/components/commoncomponent/searchSelectComponent' 
import FastTagTransactionService from 'src/Service/FastTag/FastTagTransactionService'
import FileSaver from 'file-saver'
import * as XLSX from 'xlsx';
import AccessDeniedComponent from 'src/components/commoncomponent/AccessDeniedComponent'
import JavascriptInArrayComponent from 'src/components/commoncomponent/JavascriptInArrayComponent'
import * as LogisticsProScreenNumberConstants from 'src/components/constants/LogisticsProScreenNumberConstants'
import { GetDateTimeFormat } from '../Depo/CommonMethods/CommonMethods'
import DivisionApi from 'src/Service/SubMaster/DivisionApi'

const FastTagReport = () => {
  const navigation = useNavigate()

    /*================== User Location Fetch ======================*/
    const user_info_json = localStorage.getItem('user_info')
    const user_info = JSON.parse(user_info_json)
    var user_locations = []

    /* Get User Locations From Local Storage */
    user_info.location_info.map((data, index) => {
      user_locations.push(data.id)
    })

    /* Get User Id From Local Storage */
    const user_id = user_info.user_id

    /* ==================== Access Part Start ========================*/
  const [screenAccess, setScreenAccess] = useState(false)
  let page_no = LogisticsProScreenNumberConstants.OtherModuleScreen.Fast_Tag_Report

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

    if (event_type == 'vehicle_no') {
      if (selected_value) {
        setReportVehicle(selected_value)
      } else {
        setReportVehicle('')
      }
    } else if(event_type == 'tripsheet_no') {
      if (selected_value) {
        setReportTSNo(selected_value)
      } else {
        setReportTSNo('')
      }
    } else if(event_type == 'captured_status') {
      if (selected_value) {
        setReportcaptureStatus(selected_value)
      } else {
        setReportcaptureStatus('')
      }
    }
  } 

  const [rowData, setRowData] = useState([])
  const [searchFilterData, setSearchFilterData] = useState([]) 
  const [fetch, setFetch] = useState(false)

  const [pending, setPending] = useState(true)

  /* Report Variables */
  const [reportVehicle, setReportVehicle] = useState('')
  const [reportTSNo, setReportTSNo] = useState('') 
  const [reportcaptureStatus, setReportcaptureStatus] = useState('') 
  let tableReportData = []

  const TS_Capture_Status = (id) => {
    if (id == 0) {
      return 'Not Captured'
    } else if (id == 1) {
      return 'Captured'
    }
  }

  const Deleted_Status = (id) => {
    if (id == 0) {
      return 'Not Deleted'
    } else if (id == 1) {
      return 'Deleted'
    }
  }
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

  const getDateTime = (myDateTime, type=0) => {
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

  const PURPOSE = {
    FG_SALES: 1,
    FG_STO: 2,
    RM_STO: 3,
    OTHERS: 4,
    FCI: 5,
  }

  const [divisionData, setDivisionData] = useState([])
  const othersDivisionArray = ['','NLFD','NLFA','NLDV','NLMD','NLLD','NLCD','NLIF','NLSD']
  const othersDivisionNameFinder = (data) => {
    let ot_div = '-'
    divisionData && divisionData.map((vv,kk)=>{
      if(data.others_division == vv.id){
        ot_div = othersDivisionArray[vv.id]
      }
    })
    return ot_div
  }

  useEffect(() => {
  
    DivisionApi.getDivision().then((response) => {
      let editData = response.data.data
      setDivisionData(editData)
    })
    
  },[])

  const loadFastTagReport = (fresh_type = '') => {

    if (fresh_type !== '1') { 

      FastTagTransactionService.getFastTagDataForReport().then((res) => {
        tableReportData = res.data.data
        console.log(tableReportData)

        setFetch(true)
        let rowDataList = []
        let filterData = tableReportData 
        setSearchFilterData(filterData)
        filterData.map((data, index) => {
          rowDataList.push({
            sno: index + 1,
            Tripsheet_No: data.settlement_info?.tripsheet_no, 
            created_at: data.tripsheet_info?.created_date,
            ts_time: data.tripsheet_info ? getDateTime(data.tripsheet_info.created_at,1) : '',
            ts_month: data.tripsheet_info ? getDateTime(data.tripsheet_info.created_at,2) : '',  
            reader_date_time: data.reader_date_time,
            txn_date_time: data.txn_date_time,
            Vehicle_No: data.vechile_number,
            doc_no: data.settlement_info?.fasttag_sap_document_no,
            posting_date: data.settlement_info?.toll_posting_date,
            settlement_amount: data.settlement_amount,
            unique_ref_no: data.unique_ref_no,
            toll_txn_ref: data.toll_txn_ref, 
            tripsheet_status: data.tripsheet_info ? ( 
              data.tripsheet_info.status == 0 
                ? 'OPENED'
                : data.tripsheet_info.status == 1
                ? 'ASSIGNED'
                : data.tripsheet_info.status == 2
                ? 'CLOSED'
                : ''
              ) : '',
            expense_closure_completed_status: data.settlement_info?'Yes':'No',
            settlement_closure_completed_status: data.settlement_info ?(data.settlement_info.tripsheet_is_settled == 6 ? 'Yes':'No'):'No',
            divison: data.tripsheet_info ? ( data.tripsheet_info.purpose == PURPOSE.OTHERS ? othersDivisionNameFinder(data) : data.tripsheet_info.to_divison == 2 ? 'NLCD':'NLFD' ) : '',
            purpose: data.tripsheet_info ? (
              data.tripsheet_info.purpose == PURPOSE.FG_SALES
                ? 'FG Sales'
                : data.tripsheet_info.purpose == PURPOSE.FG_STO
                ? 'FG STO'
                : data.tripsheet_info.purpose == PURPOSE.RM_STO
                ? 'RM STO'
                : data.tripsheet_info.purpose == PURPOSE.OTHERS
                ? 'OTHERS'
                : data.tripsheet_info.purpose == PURPOSE.FCI
                ? 'FCI'
                :''
            ):'',
            plaza_name: data.plaza_name,
            ts_captured_status: TS_Capture_Status(data.ts_captured_status),
            deleted_status: Deleted_Status(data.deleted_status),
            tag_id: data.tag_id,
            avc_class: data.avc_class,
            mis_field: data.mis_field,
            plaza_code: data.plaza_code,
            status: data.status,
            txn_type: data.txn_type,            
            vechile_class: data.vechile_class,
            wallet_id: data.wallet_id,
            Creation_Time: data.created_at,
          })
        })
        setRowData(rowDataList)
        setPending(false)
      })
    } else {
      if (defaultDate == null) {
        toast.warning('Date Filter Should not be empty..!')
        return false
      } else if (
        defaultDate == null &&
        reportVehicle == ''
        ) {
        toast.warning('Choose atleast one filter type..!')
        return false
      }
      let report_form_data = new FormData()
      report_form_data.append('date_between', defaultDate)
      report_form_data.append('vehicle_no', reportVehicle)
      report_form_data.append('tripsheet_no', reportTSNo)
      report_form_data.append('ts_captured_status', reportcaptureStatus)
      report_form_data.append('user_id', user_id)

      console.log(defaultDate)
      console.log(reportVehicle)
      console.log(reportTSNo) 

      FastTagTransactionService.sentFastTagDataForReport(report_form_data).then((res) => { 
        tableReportData = res.data.data 

        setFetch(true)
        let rowDataList = []
        let filterData = tableReportData
        console.log(filterData,'sentFastTagDataForReport')
        setSearchFilterData(filterData)
        filterData.map((data, index) => {
          rowDataList.push({
            sno: index + 1,
            Tripsheet_No: data.settlement_info?.tripsheet_no, 
            created_at: data.tripsheet_info?.created_date,
            ts_time: data.tripsheet_info ? getDateTime(data.tripsheet_info.created_at,1) : '',
            ts_month: data.tripsheet_info ? getDateTime(data.tripsheet_info.created_at,2) : '',  
            reader_date_time: data.reader_date_time,
            txn_date_time: data.txn_date_time,
            Vehicle_No: data.vechile_number,
            doc_no: data.settlement_info?.fasttag_sap_document_no,
            posting_date: data.settlement_info?.toll_posting_date,
            settlement_amount: data.settlement_amount,
            unique_ref_no: data.unique_ref_no,
            toll_txn_ref: data.toll_txn_ref, 
            tripsheet_status: data.tripsheet_info ? ( 
              data.tripsheet_info.status == 0 
                ? 'OPENED'
                : data.tripsheet_info.status == 1
                ? 'ASSIGNED'
                : data.tripsheet_info.status == 2
                ? 'CLOSED'
                : ''
              ) : '',
            expense_closure_completed_status: data.settlement_info?'Yes':'No',
            settlement_closure_completed_status: data.settlement_info ?(data.settlement_info.tripsheet_is_settled == 6 ? 'Yes':'No'):'No',
            divison: data.tripsheet_info ? ( data.tripsheet_info.purpose == PURPOSE.OTHERS ? othersDivisionNameFinder(data) : data.tripsheet_info.to_divison == 2 ? 'NLCD':'NLFD' ) : '',
            purpose: data.tripsheet_info ? (
              data.tripsheet_info.purpose == PURPOSE.FG_SALES
                ? 'FG Sales'
                : data.tripsheet_info.purpose == PURPOSE.FG_STO
                ? 'FG STO'
                : data.tripsheet_info.purpose == PURPOSE.RM_STO
                ? 'RM STO'
                : data.tripsheet_info.purpose == PURPOSE.OTHERS
                ? 'OTHERS'
                : data.tripsheet_info.purpose == PURPOSE.FCI
                ? 'FCI'
                :''
            ):'',
            plaza_name: data.plaza_name,
            ts_captured_status: TS_Capture_Status(data.ts_captured_status),
            deleted_status: Deleted_Status(data.deleted_status),
            tag_id: data.tag_id,
            avc_class: data.avc_class,
            mis_field: data.mis_field,
            plaza_code: data.plaza_code,
            status: data.status,
            txn_type: data.txn_type,            
            vechile_class: data.vechile_class,
            wallet_id: data.wallet_id,
            Creation_Time: data.created_at,
          })
        })
        setRowData(rowDataList)
        setPending(false)
      })
    }
  }

  useEffect(() => {
    loadFastTagReport()
  }, [])

  const exportToCSV = () => {
    if(rowData.length == 0){
      toast.warning('No Data Found..!')
      return false
    }
    console.log(rowData,'exportCsvData')
    let dateTimeString = GetDateTimeFormat(1)
    let fileName='FastTag_Report_'+dateTimeString 
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';
    const ws = XLSX.utils.json_to_sheet(rowData);
    const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], {type: fileType});
    FileSaver.saveAs(data, fileName + fileExtension);
  }

  const columns = [
    {
      name: 'S.No',
      selector: (row) => row.sno,
      sortable: true,
      center: true,
    },
    {
      name: 'TripSheet No',
      selector: (row) => row.Tripsheet_No || '-',
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
      name: 'Tag Id',
      selector: (row) => row.tag_id,
      sortable: true,
      center: true,
    },
    {
      name: 'AVC Class',
      selector: (row) => row.avc_class,
      sortable: true,
      center: true,
    },
    {
      name: 'toll txn ref',
      selector: (row) => row.toll_txn_ref,
      sortable: true,
      center: true,
    },
    {
      name: 'vehicle class',
      selector: (row) => row.vechile_class,
      sortable: true,
      center: true,
    },
    {
      name: 'settlement amount',
      selector: (row) => row.settlement_amount,
      sortable: true,
      center: true,
    },
    {
      name: 'plaza code',
      selector: (row) => row.plaza_code,
      sortable: true,
      center: true,
    },
    {
      name: 'plaza name',
      selector: (row) => row.plaza_name,
      sortable: true,
      center: true,
    },
    {
      name: 'reader date time',
      selector: (row) => row.reader_date_time,
      sortable: true,
      center: true,
    },{
      name: 'txn date time',
      selector: (row) => row.txn_date_time,
      sortable: true,
      center: true,
    },{
      name: 'wallet_id',
      selector: (row) => row.wallet_id,
      sortable: true,
      center: true,
    },{
      name: 'mis field',
      selector: (row) => row.mis_field || '-',
      sortable: true,
      center: true,
    },{
      name: 'status',
      selector: (row) => row.status,
      sortable: true,
      center: true,
    },{
      name: 'toll posting date',
      selector: (row) => row.posting_date,
      sortable: true,
      center: true,
    },{
      name: 'fasttag sap document_no',
      selector: (row) => row.doc_no,
      sortable: true,
      center: true,
    },{
      name: 'txn type',
      selector: (row) => row.txn_type,
      sortable: true,
      center: true,
    },{
      name: 'ts captured status',
      selector: (row) => row.ts_captured_status,
      sortable: true,
      center: true,
    },{
      name: 'deleted status',
      selector: (row) => row.deleted_status,
      sortable: true,
      center: true,
    },
    {
      name: 'Creation Date',
      selector: (row) => row.Creation_Time,
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
                <SearchSelectComponent
                  size="sm"
                  className="mb-2"
                  onChange={(e) => {
                    onChangeFilter(e, 'vehicle_no')
                  }}
                  label="Select Vehicle Number"
                  noOptionsMessage="Vehicle Not found"
                  search_type="fast_tag_report_vehicle_number"
                  search_data={searchFilterData}
                />
              </CCol>


            <CCol xs={12} md={3}>
                <CFormLabel htmlFor="VNum">Tripsheet Number</CFormLabel>
                <SearchSelectComponent
                  size="sm"
                  className="mb-2"
                  onChange={(e) => {
                    onChangeFilter(e, 'tripsheet_no')
                  }}
                  label="Select Tripsheet Number"
                  noOptionsMessage="Tripsheet Not found"
                  search_type="fast_tag_report_tripsheet_no"
                  search_data={searchFilterData}
                />
            </CCol>


            <CCol xs={12} md={3}>
                <CFormLabel htmlFor="VNum">TS Captured Status</CFormLabel>
                <SearchSelectComponent
                  size="sm"
                  className="mb-2"
                  onChange={(e) => {
                    onChangeFilter(e, 'captured_status')
                  }}
                  label="Select TS Captured Status"
                  noOptionsMessage="Tripsheet Not found"
                  search_type="fast_tag_report_captured_status"
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
                      loadFastTagReport('1')
                    }}
                  >
                    Filter
                  </CButton>
                </CCol>
              </CRow>
              <hr />
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
         </>) : (<AccessDeniedComponent />)}
       </>
      )}

    </>
  )
}

export default FastTagReport
