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
  CCardImage,
  CModalFooter,
  CTableDataCell,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableHead,
  CFormLabel,
  CFormInput,
  CTable,
} from '@coreui/react'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import CustomTable from 'src/components/customComponent/CustomTable'
import Loader from 'src/components/Loader' 
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css' 
import DeliveryTrackService from 'src/Service/DeliveryTrack/DeliveryTrackService'
import * as LogisticsProScreenNumberConstants from 'src/components/constants/LogisticsProScreenNumberConstants'
import AccessDeniedComponent from 'src/components/commoncomponent/AccessDeniedComponent'
import JavascriptInArrayComponent from 'src/components/commoncomponent/JavascriptInArrayComponent'
import { GetDateTimeFormat } from '../Depo/CommonMethods/CommonMethods'
import FileSaver from 'file-saver'
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2'
import { DateRangePicker } from 'rsuite'
import DTSearchSelectComponent from './DTSearchSelectComponent'

const DTDespatchHome = () => {

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
  let page_no = LogisticsProScreenNumberConstants.DeliveryTrackModule.DT_Screen

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

  const [fetch, setFetch] = useState(false)
  const [despatchEditModal, setDespatchEditModal] = useState(false)
  const [despatchEditModalId, setDespatchEditModalId] = useState('')
  const [despatchEditModalShipment, setDespatchEditModalShipment] = useState('')
  const [despatchEditModalData, setDespatchEditModalData] = useState([])
  const [rowData, setRowData] = useState([])
  const [mount, setMount] = useState(1) 
  let viewData

  function changeDTStatus(id) {
    setFetch(false)
    DeliveryTrackService.deleteDTInfo(id).then((res) => {
      setFetch(true)
      toast.success('DT Info Deleted Successfully!')
      setTimeout(() => {
        window.location.reload(false)
      }, 1000)
    })
  }

  const [reportVehicle, setReportVehicle] = useState(0) 
  const [reportTSId, setReportTSId] = useState(0)
  const [reportShipmentNo, setReportShipmentNo] = useState(0)
  const [reportVehilceType, setReportVehilceType] = useState(0)

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
        setReportTSId(selected_value)
      } else {
        setReportTSId(0)
      }
    } else if (event_type == 'shipment_no') {
      if (selected_value) {
        setReportShipmentNo(selected_value)
      } else {
        setReportShipmentNo(0)
      }
    } else if (event_type == 'vehicle_type') {
      if (selected_value) {
        setReportVehilceType(selected_value)
      } else {
        setReportVehilceType(0)
      }
    }
  }

  const exportToCSV = () => {
    console.log(rowData,'exportCsvData')
    let dateTimeString = GetDateTimeFormat(1)
    let fileName='NAGA_DT_Despatch_Report_'+dateTimeString
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';
    const ws = XLSX.utils.json_to_sheet(rowData);
    const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], {type: fileType});
    FileSaver.saveAs(data, fileName + fileExtension);
  }

  function changeDTStatus1(data) {
    let data_id = data.id
    console.log(data,'changeDTStatus1')
    if(data.actual_reached_time == null || data.actual_reached_time == '0000-00-00 00:00:00'){
      toast.warning('Actual Reached Time Should be filled')
      return false
    }
    if(data.unloading_time == null || data.unloading_time == '0000-00-00 00:00:00'){
      toast.warning('Unloading Time Should be filled')
      return false
    }
    setFetch(false)
    DeliveryTrackService.closeDtInfoById(data_id).then((res) => {
      setFetch(true)
      toast.success('DT Info Closed Successfully!')
      setTimeout(() => {
        window.location.reload(false)
      }, 1000)
    })
  }

  const [mgt, setMgt] = useState('') /* Mill Gate In Time */
  const [mgo, setMgo] = useState('') /* Mill Gate Out Time */
  const [tpt, setTpt] = useState('') /* Truck Placement Time */
  const [dot, setDot] = useState('') /* DO Time */
  const [dr, setDr] = useState('') /* Despatch Remarks */
  
  const handleChangeValues = (event,type) => {
    const result = event.target.value
    if(type == 1){
      setMgt(result)
    } else if(type == 2){
      setMgo(result)
    } else if(type == 3){
      setTpt(result)
    } else if(type == 4){
      setDot(result)
    } else if(type == 5){
      setDr(result)
    } 
    
  }

  const editSingleDTDespatchData = (data) => { 
    setDespatchEditModalId(data.shipment_id)
    setDespatchEditModalData(data)
    setMgt(data.mill_gate_in_time ? data.mill_gate_in_time : '')
    setMgo(data.mill_gate_out_time ? data.mill_gate_out_time : '')
    setDot(data.despatch_do_time ? data.despatch_do_time : '')
    setTpt(data.truck_placement_time ? data.truck_placement_time : '')
    setDr(data.despatch_remarks ? data.despatch_remarks : '')
    setDespatchEditModalShipment(data.shipment_no)
  }

  useEffect(() => {
    loadTripShipmentReport()
  }, [])

  const loadTripShipmentReport = (fresh_type = '') => { 

    if (fresh_type !== '1') { 

      DeliveryTrackService.getTodayAllShipmentInfo().then((response) => { 
        setFetch(true)
        viewData = response.data.data
        setSearchFilterData(viewData)
        console.log(viewData)
        let rowDataList = []
        viewData.map((data, index) => {
          rowDataList.push({
            sno : index + 1,
            Yard_Gate_In : data.parking_yard_info?.gate_in_date_time_org1,
            Truck_No : data.vehicle_number,
            Truck_Type : data.vehicle_type_id_info?.type,
            Driver_Contact_No : data.driver_number,
            Tripsheet_No : data.trip_sheet_info?.trip_sheet_no,
            // Shipment_Date : data.created_at,
            Shipment_Time : data.shipment_date_time_org1,
            Shipment_No : data.shipment_no,          
            Party_Name : data.shipment_child_info && data.shipment_child_info[0] ? data.shipment_child_info[0].customer_info?.CustomerName : '-',
            city : data.shipment_child_info && data.shipment_child_info[0] ? data.shipment_child_info[0].customer_info?.CustomerCity : '-',
            Yard_Gate_Out : data.parking_yard_info?.gate_out_date_time_org1,
            Mill_Gate_in : data.mill_gate_in_time ? data.mill_gate_in_time : '-', 
            Mill_Gate_Out : data.mill_gate_out_time ? data.mill_gate_out_time : '-', 
            Truck_Placement_time : data.truck_placement_time ? data.truck_placement_time : '-', 
            DO_time : data.despatch_do_time ? data.despatch_do_time : '-', 
            Despatch_Remarks : data.despatch_remarks ? data.despatch_remarks : '-', 
            Action: (
              <div className="d-flex justify-content-space-between">
                 <CButton
                  size="sm"
                  color="secondary"
                  shape="rounded"
                  id={data.id}
                  onClick={() => {
                    setDespatchEditModal(true)
                    editSingleDTDespatchData(data)
                  }}
                  className="m-1"
                >
                  {/* Edit */}
                  <i className="fa fa-edit" aria-hidden="true"></i>
                </CButton>               
                 
                <Link target={data.mill_gate_in_time && data.mill_gate_out_time ? '_blank' : '_self'}  to={data.mill_gate_in_time && data.mill_gate_out_time ? `DTDespatch/${data.shipment_id}` : ''}> 
                  <CButton
                    size="sm" 
                    color="success"
                    shape="rounded"
                    disabled={data.mill_gate_in_time && data.mill_gate_out_time ? false : true}
                    id={data.id}
                    className="m-1"
                  >
                    {/* View */}
                    <i className="fa fa-eye" aria-hidden="true"></i>
                  </CButton>
                </Link>
                 
              </div>
            ),
          })
        })
        setRowData(rowDataList)
      })
    } else {
      if (defaultDate == null) {
        toast.warning('Date Filter Should not be empty..!')
        return false
      } else if (
        defaultDate == null &&
        reportVehicle == 0 &&
        reportShipmentNo == 0 &&
        reportTSId == 0 &&
        reportVehilceType == 0
      ) {
        toast.warning('Choose atleast one filter type..!')
        return false
      }
      let report_form_data = new FormData()
      report_form_data.append('date_between', defaultDate)
      report_form_data.append('vehicle_no', reportVehicle)
      report_form_data.append('shipment_no', reportShipmentNo) 
      report_form_data.append('tripsheet_id', reportTSId) 
      report_form_data.append('vehicle_type', reportVehilceType) 
      console.log(defaultDate, 'defaultDate')
      console.log(reportVehicle, 'reportVehicle')
      console.log(reportShipmentNo, 'reportShipmentNo')
      console.log(reportTSId, 'reportTSId') 
      console.log(reportVehilceType, 'reportVehilceType') 

      DeliveryTrackService.sentDTAllInfoForReport(report_form_data).then((response) => { 
        setFetch(true)
        viewData = response.data.data
        console.log(viewData)
        setSearchFilterData(viewData)
        let rowDataList = []
        viewData.map((data, index) => {
          rowDataList.push({
            sno : index + 1,
            Yard_Gate_In : data.parking_yard_info?.gate_in_date_time_org1,
            Truck_No : data.vehicle_number,
            Truck_Type : data.vehicle_type_id_info?.type,
            Driver_Contact_No : data.driver_number,
            Tripsheet_No : data.trip_sheet_info?.trip_sheet_no,
            // Shipment_Date : data.created_at,
            Shipment_Time : data.shipment_date_time_org1,
            Shipment_No : data.shipment_no,          
            Party_Name : data.shipment_child_info && data.shipment_child_info[0] ? data.shipment_child_info[0].customer_info?.CustomerName : '-',
            city : data.shipment_child_info && data.shipment_child_info[0] ? data.shipment_child_info[0].customer_info?.CustomerCity : '-',
            Yard_Gate_Out : data.parking_yard_info?.gate_out_date_time_org1,
            Mill_Gate_in : data.mill_gate_in_time ? data.mill_gate_in_time : '-', 
            Mill_Gate_Out : data.mill_gate_out_time ? data.mill_gate_out_time : '-', 
            Truck_Placement_time : data.truck_placement_time ? data.truck_placement_time : '-', 
            DO_time : data.despatch_do_time ? data.despatch_do_time : '-', 
            Despatch_Remarks : data.despatch_remarks ? data.despatch_remarks : '-', 
            Action: (
              <div className="d-flex justify-content-space-between">
                 <CButton
                  size="sm"
                  color="secondary"
                  shape="rounded"
                  id={data.id}
                  onClick={() => {
                    setDespatchEditModal(true)
                    editSingleDTDespatchData(data)
                  }}
                  className="m-1"
                >
                  {/* Edit */}
                  <i className="fa fa-edit" aria-hidden="true"></i>
                </CButton>               
                 
                <Link target={data.mill_gate_in_time && data.mill_gate_out_time ? '_blank' : '_self'}  to={data.mill_gate_in_time && data.mill_gate_out_time ? `DTDespatch/${data.shipment_id}` : ''}> 
                  <CButton
                    size="sm" 
                    color="success"
                    shape="rounded"
                    disabled={data.mill_gate_in_time && data.mill_gate_out_time ? false : true}
                    id={data.id}
                    className="m-1"
                  >
                    {/* View */}
                    <i className="fa fa-eye" aria-hidden="true"></i>
                  </CButton>
                </Link>
                 
              </div>
            ),
          })
        })
        setRowData(rowDataList)
      })
      
    }
  }

  useEffect(() => {
    DeliveryTrackService.getTodayAllShipmentInfo().then((response) => { 
      setFetch(true)
      viewData = response.data.data
      console.log(viewData)
      let rowDataList = []
      viewData.map((data, index) => {
        rowDataList.push({
          sno : index + 1,
          Yard_Gate_In : data.parking_yard_info?.gate_in_date_time_org1,
          Truck_No : data.vehicle_number,
          Truck_Type : data.vehicle_type_id_info?.type,
          Driver_Contact_No : data.driver_number,
          Tripsheet_No : data.trip_sheet_info?.trip_sheet_no,
          // Shipment_Date : data.created_at,
          Shipment_Time : data.shipment_date_time_org1,
          Shipment_No : data.shipment_no,          
          Party_Name : data.shipment_child_info ? data.shipment_child_info[0].customer_info?.CustomerName : '-',
          city : data.shipment_child_info ? data.shipment_child_info[0].customer_info?.CustomerCity : '-',
          Yard_Gate_Out : data.parking_yard_info?.gate_out_date_time_org1,
          Mill_Gate_in : data.mill_gate_in_time ? data.mill_gate_in_time : '-', 
          Mill_Gate_Out : data.mill_gate_out_time ? data.mill_gate_out_time : '-', 
          Truck_Placement_time : data.truck_placement_time ? data.truck_placement_time : '-', 
          DO_time : data.despatch_do_time ? data.despatch_do_time : '-', 
          Despatch_Remarks : data.despatch_remarks ? data.despatch_remarks : '-', 
          Action: (
            <div className="d-flex justify-content-space-between">
               <CButton
                size="sm"
                color="secondary"
                shape="rounded"
                id={data.id}
                onClick={() => {
                  setDespatchEditModal(true)
                  editSingleDTDespatchData(data)
                }}
                className="m-1"
              >
                {/* Edit */}
                <i className="fa fa-edit" aria-hidden="true"></i>
              </CButton>               
               
              <Link target={data.mill_gate_in_time && data.mill_gate_out_time ? '_blank' : '_self'}  to={data.mill_gate_in_time && data.mill_gate_out_time ? `DTDespatch/${data.shipment_id}` : ''}> 
                <CButton
                  size="sm" 
                  color="success"
                  shape="rounded"
                  disabled={data.mill_gate_in_time && data.mill_gate_out_time ? false : true}
                  id={data.id}
                  className="m-1"
                >
                  {/* View */}
                  <i className="fa fa-eye" aria-hidden="true"></i>
                </CButton>
              </Link>
               
            </div>
          ),
        })
      })
      setRowData(rowDataList)
    })
  }, [mount])

  // ============ Column Header Data =======

  const columns = [
    {
      name: 'S.No',
      selector: (row) => row.sno,
      sortable: true,
      center: true,
    },
    {
      name: 'Yard Gate In',
      selector: (row) => row.Yard_Gate_In,
      sortable: true,
      center: true,
    },
    {
      name: 'Truck No',
      selector: (row) => row.Truck_No,
      sortable: true,
      center: true,
    },
    {
      name: 'Truck Type',
      selector: (row) => row.Truck_Type,
      sortable: true,
      center: true,
    },
    {
      name: 'Driver Contact No',
      selector: (row) => row.Driver_Contact_No,
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
      name: 'Shipment Time',
      selector: (row) => row.Shipment_Time,
      sortable: true,
      center: true,
    },
    {
      name: 'Shipment No',
      selector: (row) => row.Shipment_No,
      sortable: true,
      center: true,
    }, 
    {
      name: 'Party Name',
      selector: (row) => row.Party_Name,
      sortable: true,
      center: true,
    },

    {
      name: 'City',
      selector: (row) => row.city,
      sortable: true,
      center: true,
    },
    {
      name: 'Yard Gate Out',
      selector: (row) => row.Yard_Gate_Out,
      sortable: true,
      center: true,
    },
    {
      name: 'Mill Gate Tn',
      selector: (row) => row.Mill_Gate_in,
      sortable: true,
      center: true,
    },{
      name: 'Mill Gate Out',
      selector: (row) => row.Mill_Gate_Out,
      sortable: true,
      center: true,
    },
    {
      name: 'Truck Placement Time',
      selector: (row) => row.Truck_Placement_time,
      sortable: true,
      center: true,
    },
    {
      name: 'DO Time',
      selector: (row) => row.DO_time,
      sortable: true,
      center: true,
    }, 
    {
      name: 'Action',
      selector: (row) => row.Action,
      center: true,
    },
  ]

  //============ column header data=========

  const clearDespatchValues = () => {
    setMgo('')
    setMgt('')
    setTpt('')
    setDot('')
    setDr('')
  }

  const submitProcess = () => {
      console.log(despatchEditModalData,'submitProcess-despatchEditModalData')
       
      console.log(mgt,'submitProcess-mgt')
      console.log(mgo,'submitProcess-mgo')
      console.log(tpt,'submitProcess-tpt')
      console.log(dot,'submitProcess-dot')
      console.log(dr,'submitProcess-dr')
      // setFetch(true)
      // return false
      let process_submission_data = new FormData() 
      process_submission_data.append('updated_by', user_id)
      process_submission_data.append('mill_gate_in_time', mgt)
      process_submission_data.append('mill_gate_out_time', mgo)
      process_submission_data.append('truck_placement_time', tpt)
      process_submission_data.append('despatch_do_time', dot)
      process_submission_data.append('despatch_remarks', dr) 
      process_submission_data.append('shipment_id', despatchEditModalData.shipment_id) 
      process_submission_data.append('parking_id', despatchEditModalData.parking_id) 
      process_submission_data.append('shipment_no', despatchEditModalData.shipment_no) 
  
      DeliveryTrackService.updateDtDespatchInfo(process_submission_data).then((res) => { 
         
        setFetch(true)
        if (res.status == 200) {
          Swal.fire({
            icon: "success",
            title: 'DT Despatch Info. Updated Successfully!', 
            confirmButtonText: "OK",
          }).then(function () {
            window.location.reload(false)
          });
        } else if (res.status == 201) {
          Swal.fire({
            title: res.data.message,
            icon: "warning",
            confirmButtonText: "OK",
          }).then(function () {
            // window.location.reload(false)
          })
        } else {
          toast.warning('DT Despatch Info Cannot be Updated. Kindly contact Admin..!')
        }
      })
      .catch((errortemp) => {
        console.log(errortemp)
        setFetch(true)
        var object = errortemp.response.data.errors
        var output = ''
        for (var property in object) {
          output += '*' + object[property] + '\n'
        }
        toast.warning(output)
      })
  
    }

    /* Set Default Date (Today) in a Variable State */
      const [defaultDate, setDefaultDate] = React.useState([
        new Date(getCurrentDate('-')),
        new Date(getCurrentDate('-')),
      ])

       const [searchFilterData, setSearchFilterData] = useState([])
    
      useEffect(() => {
        console.log(defaultDate)
        if (defaultDate) {
          setDefaultDate(defaultDate)
        } else {
        }
      }, [defaultDate])

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
             
              <CCard>
                <>
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
                        <DTSearchSelectComponent
                          size="sm"
                          className="mb-2"
                          onChange={(e) => {
                            onChangeFilter(e, 'vehicle_no')
                          }}
                          label="Select Vehicle Number"
                          noOptionsMessage="Vehicle Not found"
                          search_type="despatch_screen_vehicle_number"
                          search_data={searchFilterData}
                        />
                      </CCol>

                      <CCol xs={12} md={3}>
                        <CFormLabel htmlFor="VNum">Shipment Number</CFormLabel>
                        <DTSearchSelectComponent
                          size="sm"
                          className="mb-2"
                          onChange={(e) => {
                            onChangeFilter(e, 'shipment_no')
                          }}
                          label="Select Shipment Number"
                          noOptionsMessage="Shipment Not found"
                          search_type="despatch_screen_shipment_number"
                          search_data={searchFilterData}
                        />
                      </CCol>

                      <CCol xs={12} md={3}>
                        <CFormLabel htmlFor="VNum">Tripsheet Number</CFormLabel>
                        <DTSearchSelectComponent
                          size="sm"
                          className="mb-2"
                          onChange={(e) => {
                            onChangeFilter(e, 'tripsheet_no')
                          }}
                          label="Select Tripsheet Number"
                          noOptionsMessage="Tripsheet Not found"
                          search_type="despatch_screen_tripsheet_number"
                          search_data={searchFilterData}
                        />
                      </CCol> 
                      <CCol xs={12} md={3}>
                        <CFormLabel htmlFor="VNum">Vehicle Type</CFormLabel>
                        <DTSearchSelectComponent
                          size="sm"
                          className="mb-2"
                          onChange={(e) => {
                            onChangeFilter(e, 'vehicle_type')
                          }}
                          label="Select Vehicle Type"
                          noOptionsMessage="Vehicle Type found"
                          search_type="despatch_screen_vehicle_type"
                          search_data={searchFilterData}
                        />
                      </CCol> 
                    {/* </CRow> */}
                  
                  {/* <CRow className="mt-1 mb-1"> */}
                    <CCol
                      className="offset-md-6"
                      xs={15}
                      sm={15}
                      md={6}
                      style={{ display: 'flex', justifyContent: 'end' }}
                    >
                       
                      <CButton
                        size="sm"
                        color="primary"
                        className="mx-3 px-3 text-white"
                        onClick={() => {
                          setFetch(false)
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
                            // loadVehicleReadyToTripForExportCSV()
                            exportToCSV()
                          }}
                      >
                        Export
                      </CButton>
                    </CCol>
                  </CRow>
                  {/* <CContainer> */}
                    <CustomTable
                      columns={columns}
                      data={rowData}
                      // fieldName={'Driver_Name'}
                      showSearchFilter={true}
                    />
                  </CContainer>
                  {/* Assign Payment Modal */}
                  <CModal
                    size="xl"
                    backdrop="static"
                    scrollable
                    visible={despatchEditModal}
                    onClose={() => {
                      setDespatchEditModal(false)
                      clearDespatchValues()
                      setDespatchEditModalData([])
                    }}
                  >
                    <CModalHeader>
                      <CModalTitle><b>DT : Despatch Edit</b></CModalTitle>
                    </CModalHeader>
                    <CModalBody>                       
                      <CTable striped hover>
                        {console.log(despatchEditModalData,'despatchEditModalData')}
                        {despatchEditModalData && (
                          <CRow className="">
                            <CCol md={3}>
                              <CFormLabel htmlFor="cname">Vehicle No. / Type</CFormLabel>
                              <CFormInput
                                style={{fontWeight: 'bolder'}}
                                name="cname"
                                size="sm"
                                id="cname"
                                value={`${despatchEditModalData.vehicle_number} / ${despatchEditModalData.vehicle_type_id_info?.type}`}
                                readOnly
                              />
                            </CCol>
                            <CCol md={3}>
                              <CFormLabel htmlFor="cname">Yard Gate In Time / Tripsheet No.</CFormLabel>
                              <CFormInput
                                style={{fontWeight: 'bolder'}}
                                name="cname"
                                size="sm"
                                id="cname"
                                value={`${despatchEditModalData.parking_yard_info?.gate_in_date_time_org1} / ${despatchEditModalData.trip_sheet_info?.trip_sheet_no}`}
                                readOnly
                              />
                            </CCol>
                            <CCol md={3}>
                              <CFormLabel htmlFor="cname">Shipment No. / Time</CFormLabel>
                              <CFormInput
                                style={{fontWeight: 'bolder'}}
                                name="cname"
                                size="sm"
                                id="cname"
                                value={`${despatchEditModalData.shipment_no} / ${despatchEditModalData.shipment_date_time_org1}`}
                                readOnly
                              />
                            </CCol>
                            <CCol md={3}>
                              <CFormLabel htmlFor="cname">Driver Name / Contact No.</CFormLabel>
                              <CFormInput
                                style={{fontWeight: 'bolder'}}
                                name="cname"
                                size="sm"
                                id="cname"
                                value={`${despatchEditModalData.driver_name} / ${despatchEditModalData.driver_number}`}
                                readOnly
                              />
                            </CCol>
                            <CCol md={3}>
                              <CFormLabel htmlFor="cname">Yard Gate Out Time / Shipment Qty.</CFormLabel>
                              <CFormInput
                                style={{fontWeight: 'bolder'}}
                                name="cname"
                                size="sm"
                                id="cname"
                                value={`${despatchEditModalData.parking_yard_info?.gate_out_date_time_org1} / ${despatchEditModalData.billed_net_qty ? despatchEditModalData.billed_net_qty : despatchEditModalData.shipment_net_qty} Ton`}
                                readOnly
                              />
                            </CCol>
                            <CCol md={3}>
                              <CFormLabel htmlFor="cmn">One of the Delivery - Customer Name</CFormLabel>
                              <CFormInput
                                style={{fontWeight: 'bolder'}}
                                name="cmn"
                                size="sm"
                                id="cmn"
                                value={despatchEditModalData.shipment_child_info ? despatchEditModalData.shipment_child_info[0].customer_info.CustomerName : ''}
                                readOnly
                              />
                            </CCol>

                            <CCol md={3}>
                              <CFormLabel htmlFor="cmn">Customer Code / City</CFormLabel>
                              <CFormInput
                                style={{fontWeight: 'bolder'}}
                                name="cmn"
                                size="sm"
                                id="cmn"
                                value={`${despatchEditModalData.shipment_child_info ? despatchEditModalData.shipment_child_info[0].customer_info.CustomerCode : '-'} / ${despatchEditModalData.shipment_child_info ? despatchEditModalData.shipment_child_info[0].customer_info.CustomerCity : '-'}`}
                                readOnly
                              />
                            </CCol>

                            <CCol md={3}>
                              <CFormLabel htmlFor="mgt">Mill gate In Time</CFormLabel>
                              <CFormInput
                                size="sm"
                                name="mgt"
                                id="mgt"
                                type="datetime-local"
                                value={mgt}
                                onChange={(e) => {
                                  handleChangeValues(e,1)
                                }}
                              />
                            </CCol>

                            <CCol md={3}>
                              <CFormLabel htmlFor="mgo">Mill gate Out Time</CFormLabel>
                              <CFormInput
                                size="sm"
                                name="mgo"
                                id="mgo"
                                type="datetime-local"
                                value={mgo} 
                                onChange={(e) => {
                                  handleChangeValues(e,2)
                                }}
                              />
                            </CCol>

                            <CCol md={3}>
                              <CFormLabel htmlFor="tpt">Truck Placement Time</CFormLabel>
                              <CFormInput
                                size="sm"
                                name="tpt"
                                id="tpt"
                                type="datetime-local"
                                value={tpt}
                                onChange={(e) => {
                                  handleChangeValues(e,3)
                                }}
                              />
                            </CCol>

                            <CCol md={3}>
                              <CFormLabel htmlFor="dot">DO Time</CFormLabel>
                              <CFormInput
                                size="sm"
                                name="dot"
                                id="dot"
                                type="datetime-local"
                                value={dot}
                                onChange={(e) => {
                                  handleChangeValues(e,4)
                                }}
                              />
                            </CCol>
                             
                            <CCol md={3}>
                              <CFormLabel htmlFor="dr">Remarks</CFormLabel>
                              <CFormInput
                                size="sm"
                                name="dr"
                                id="dr"
                                value={dr}
                                onChange={(e) => {
                                  handleChangeValues(e,5)
                                }}
                              />
                            </CCol>

                          </CRow>
                        )}
                        
                      </CTable>                  
                    </CModalBody>

                    <CModalFooter>

                      <CButton
                        color="primary"
                        style={{marginRight: '2%'}}
                        onClick={() => {
                          setDespatchEditModal(false)
                          setFetch(false)
                          submitProcess()
                        }}
                      >
                        {'Submit'}
                      </CButton>
                      <CButton
                        color="primary"
                        onClick={() => {
                          setDespatchEditModal(false)
                          setDespatchEditModalData([])
                          clearDespatchValues()
                        }}
                      >
                        {'Cancel'}
                      </CButton>
                    </CModalFooter>
                  </CModal>
                </>                
              </CCard>
            </>) : (<AccessDeniedComponent />
          )}
        </>
      )}
    </>
  )
}

export default DTDespatchHome
