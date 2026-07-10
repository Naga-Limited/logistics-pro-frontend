/* eslint-disable prettier/prettier */
import {
  CButton,
  CCard, 
  CContainer, 
  CFormInput,
  CFormLabel, 
  CRow,
  CTabContent,
  CModal,
  CModalHeader,
  CModalTitle,
  CTabPane,
  CModalBody,
  CModalFooter,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell, 
  CTableRow, 
  CCol,
} from '@coreui/react'
 
import React, { useState, useEffect } from 'react' 
import useForm from 'src/Hooks/useForm'
import validate from 'src/Utils/Validation' 
import { toast } from 'react-toastify'
import Loader from 'src/components/Loader' 
import LocationApi from 'src/Service/SubMaster/LocationApi' 
import AccessDeniedComponent from 'src/components/commoncomponent/AccessDeniedComponent'
import JavascriptInArrayComponent from 'src/components/commoncomponent/JavascriptInArrayComponent'
import * as NlmtScreenAccessCodes from 'src/components/constants/NlmtScreenAccessCodes' 
import Swal from 'sweetalert2' 
import { DateRangePicker } from 'rsuite'  
import NLFSDieselIntentService from 'src/Service/NLFS/Master/NLFSDieselIntentService'
import MTSearchSelectComponent from './MTSearchSelectComponent' 
import NlmtTripSheetClosureService from 'src/Service/Nlmt/TripSheetClosure/NlmtTripSheetClosureService'
import FileSaver from 'file-saver'
import * as XLSX from 'xlsx';
import { GetDateTimeFormat } from '../CommonMethods/CommonMethods'
import { Link } from 'react-router-dom'

const NlmtSettlementClosureHome = () => {
  /*================== User Location Fetch ======================*/
  const user_info_json = localStorage.getItem('user_info')
  const user_info = JSON.parse(user_info_json)
  const user_locations = []
  const user_access_locations = []

  console.log(user_info) 
  /* Get User Locations From Local Storage */
  user_info.location_info.map((data, index) => {
    user_locations.push(data.id)
  })

  /* ===== User Inco Terms Declaration Start ===== */

  /* ==================== Access Part Start ========================*/
  const [screenAccess, setScreenAccess] = useState(false)
  let page_no = NlmtScreenAccessCodes.NlmtClosureScreens.Nlmt_Payment_Submission

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

  const user_inco_terms = []
  /* Get User Inco Terms From Local Storage */
  user_info.inco_term_info.map((data, index) => {
    user_inco_terms.push(data.def_list_code)
  }) 

  const totalShipmentQuantity = (data) => {
    let ship_quantity = 0
    let total_ship_quantity = 0
    console.log(data,'totalShipQuantity-data')
    data.map((val,ind)=>{ 
      ship_quantity += Number(parseFloat(val.vehicle_assignment[0].billed_net_qty).toFixed(3))
    })

    total_ship_quantity = Number(parseFloat(ship_quantity).toFixed(3))
    console.log(data,'totalShipQuantity-total_ship_quantity') 
    return total_ship_quantity
  }

  /* Get User Plant Access From Local Storage */
  user_info.location_info.map((data1, index1) => {
    user_access_locations.push(data1.location_code)
  })

  /* Get User Id From Local Storage */
  const user_id = user_info.user_id

  console.log(user_locations, 'user_locations')
  console.log(user_access_locations, 'user_access_locations')
  /*================== User Location Fetch ======================*/

  const [rowData, setRowData] = useState([]) 
  const [locationData, setLocationData] = useState([])
  const [tripDIInfoArray, setTripDIInfoArray] = useState([])

  const [mainKey, setMainKey] = useState(1)

  const [activeKey, setActiveKey] = useState(1) 

  const [fetch, setFetch] = useState(false)  

  const [ChildVnum, setChildVnum] = useState('')
  const [ChildVroute, setChildVroute] = useState('')
  const [frcsValid, setFrcsValid] = useState(false)
  const [errorModal, setErrorModal] = useState(false)
  const [shipmentApproval, setShipmentApproval] = useState(true)
  const [shipmentData, setShipmentData] = useState([])
  const [customerAndFreightInvalidData, setCustomerAndFreightInvalidData] = useState([]) 
  const [error, setError] = useState({})

  useEffect(()=>{

    if((customerAndFreightInvalidData.ActualFreightCondition != customerAndFreightInvalidData.BudjetFreightCondition) && customerAndFreightInvalidData.FreightType == 2){
        setShipmentApproval(true)
    } else {
        setShipmentApproval(false)
    }

    console.log(customerAndFreightInvalidData,'customerAndFreightInvalidData')
    console.log(shipmentApproval,'shipmentApproval')

  },[customerAndFreightInvalidData])

  const formValues = {
    parking_id: '',
    vehicle_id: '',
    driver_id: '',
    tripsheet_id: '',
    tripsheet_no: '',
    assigned_by: '', 
    shipment_route: '', 
    vehicle_number: '',
    vehicle_type_id: '',
    vehicle_location_id: '',
    vehicle_capacity_id: '',
    driver_name: '',
    driver_number: '',
    shipment_info: '',
    remarks: '',
  }

  const [diInfo, setDIInfo] = useState({
    di_orders: [],
    response: [],
  })

  const assign_all = (e) => {
    const checked = e.target.checked
    console.log(checked,'assign_all-checked')
    console.log(rowData,'assign_all-checked2')
    if (checked) {
      const allIds = rowData.map(row => row.nlmt_trip_in_id)

      setDIInfo({
        di_orders: allIds,
        response: allIds,
      })
    } else {
      setDIInfo({
        di_orders: [],
        response: [],
      })
    }
  }

  const assign_delivery = (e,id) => {
    // Destructuring
    const { value, checked } = e.target
    const { di_orders } = diInfo

    console.log(value,'assign_delivery-e')
    console.log(id,'assign_delivery-index')
    console.log(checked,'assign_delivery-checked')

    // Case 1 : The user checks the box
    if (checked) {
      setDIInfo({
        di_orders: [...di_orders, id],
        response: [...di_orders, id],
      })
    }

    // Case 2 : The user unchecks the box
    else {
      setDIInfo({
        di_orders: di_orders.filter((e) => e !== id),
        response: di_orders.filter((e) => e !== id),
      })
    }
    console.log(diInfo.response,'assign_delivery-diInfo')
  }
  const [sapTdsFreightData, setSapTdsFreightData] = useState([])

  const [assignPSModal , setAssignPSModal ] = useState(false)
  const { values, errors, handleChange, onFocus, handleSubmit, enableSubmit, onBlur } = useForm(
    login,
    validate,
    formValues
  )

  /* Different Advance Percentage Clubbing Check */
  const differentDivisionAssign = (data) => {
    console.log(data,'differentDivisionAssign-data')
    console.log(rowData,'differentDivisionAssign-rowData')
    let div_array = []
    data.map((vv,kk)=>{
      rowData.map((ll,jj)=>{
        if(ll.nlmt_trip_in_id == vv){
          div_array.push(ll.trip_settlement_info.advance_amount)
        }
      })
    })
    console.log(div_array,'differentDivisionAssign-div_array')
    let diff_div_exists = 0
    let ar = []
    div_array.map((ff,pp)=>{
      if(JavascriptInArrayComponent(ff,ar)){
        // diff_div_exists = 0
      } else {
        if(pp == 0){

        } else {
          diff_div_exists = 1
        }
        ar.push(ff)
      }
    })
    console.log(ar,'diff_div_exists-array')
    console.log(diff_div_exists,'diff_div_exists')
    return diff_div_exists == 1 
  }

  /* Different Vendors Clubbing Check */
  const differentDieselToAssign = (data) => {
    console.log(data,'differentDieselToAssign-data')
    console.log(rowData,'differentDivisionAssign-rowData')
    let div_array = []
    data.map((vv,kk)=>{
      rowData.map((ll,jj)=>{
        if(ll.nlmt_trip_in_id == vv){
          div_array.push(ll.trip_settlement_info.vendor_code)
        }
      })
    })
    console.log(div_array,'differentDieselToAssign-div_array')
    let diff_d2_exists = 0
    let ar = []
    div_array.map((ff,pp)=>{
      if(JavascriptInArrayComponent(ff,ar)){
        // diff_d2_exists = 0
      } else {
        if(pp == 0){

        } else {
          diff_d2_exists = 1
        }
        ar.push(ff)
      }
    })
    console.log(ar,'diff_d2_exists-array')
    console.log(diff_d2_exists,'diff_d2_exists')
    return diff_d2_exists == 1 
  }

  function login() {
    alert('No Errors CallBack Called')
  }

  function checkModalDisplay() {
    console.log(rowData) 
    console.log(diInfo,'diInfo')

    if (Object.keys(diInfo.response).length == 0) {
      toast.warning('Please Choose Atleast One Tripsheet for MPS Number Creation !') 
      setAssignPSModal(false)
      return false
    }

    /* Different Advance Percentage Clubbing Check */
    if(diInfo.di_orders.length > 1 && differentDivisionAssign(diInfo.di_orders)){
      toast.warning('MPS number creation is not allowed for Tripsheets belonging to different Freight Percentages..!')
      setAssignPSModal(false)
      return false
    }

    /* Different Vendors Clubbing Check */
    if(diInfo.di_orders.length > 1 && differentDieselToAssign(diInfo.di_orders)){
      toast.warning('MPS number creation is not allowed for Tripsheets belonging to different Vendors..!')
      setAssignPSModal(false)
      return false
    }

    let trip_payments_selected_array = rowData.filter(
      (value) =>
      JavascriptInArrayComponent(value.nlmt_trip_in_id,diInfo.di_orders)
    )

    console.log(trip_payments_selected_array,'trip_payments_selected_array-trip_payments_selected_array')

    setTripDIInfoArray(trip_payments_selected_array)

    let sap_sent_array = []
    trip_payments_selected_array.map((vv,kk)=>{
        sap_sent_array.push({
            TRIPSHEET_NO: vv.tripsheet_info?.nlmt_tripsheet_no
        })
    })

    setAssignPSModal(true)
    console.log(sap_sent_array,'sap_sent_array')
    // setFetch(false)
    // NlmtTripSheetClosureService.tdsDataFetchFromSAP(sap_sent_array).then((res) => {
    //     setFetch(true)
    //     console.log(res,'tdsDataFetchFromSAP1')
    //     let res_array = res && res.data ? res.data : []
    //     console.log(res_array,'tdsDataFetchFromSAP2')

    //     setSapTdsFreightData(res_array)

    //     let tds_status = 0

    //     res_array.map((vv,kk)=>{
    //         if(vv.STATUS == '2'){
    //             tds_status = 1
    //         }
    //     })

    //     if(tds_status == 1){
    //         // setFetch(true)
    //         toast.warning('One of the Tripsheet - Expense Document not having tds data.. ')
    //     } else {

    //       setAssignPSModal(true)

    //     }
    // })
    // .catch((errortemp) => {
    //   console.log(errortemp)
    //   setFetch(true)
    //   var object = errortemp.response.data.errors
    //   var output = ''
    //   for (var property in object) {
    //     output += '*' + object[property] + '\n'
    //   }
    //   setError(output)
    //   setErrorModal(true)
    // })


    //  const sap_data = {
    //   TRIP_SHEET: tripInfo?.tripsheet_info?.nlmt_tripsheet_no,

    // var del_orders_array = deliveryinfo.delivery_orders
    // console.log(del_orders_array) 

    
  }

  /* Date Format Change : yyyy-mm-dd to dd-mm-yy */
  const formatDate = (input) => {
    if(!input){
      return '-'
    }
    var datePart = input.match(/\d+/g),
      year = datePart[0].substring(2), // get only two digits
      month = datePart[1],
      day = datePart[2]

    return day + '-' + month + '-' + year
  }
 
  useEffect(()=>{

    NlmtTripSheetClosureService.getVehicleReadyToTripExpenseSubmission().then((res) => {

      setFetch(true)
      let tableData = res.data.data
      let rowDataList = []
      console.log(tableData,'getVehicleReadyToTripExpenseSubmission-tableData')
      setSearchFilterData(tableData)
      setRowData(tableData)
    })
    .catch((err) => {
      setFetch(true)
      console.log(err)
    }) 
  },[])

  useEffect(() => {
    LocationApi.getLocation().then((response) => {
      let viewData = response.data.data
      // let rowDataList = []
      let rowDataList_location = []
      viewData.map((data, index) => {
        rowDataList_location.push({
          sno: index + 1,
          Location: data.location,
          location_code: data.location_code,
        })
      })
      setLocationData(rowDataList_location)
    })

  }, [])

  /* Report Variables */
  const [reportVendor, setReportVendor] = useState(0)
  const [reportFreightp, setReportFreightp] = useState(0) 

  const onChangeFilter = (event, event_type) => {
    var selected_value = event.value
    console.log(selected_value, 'selected_value')

    if (event_type == 'vendor_name') {
      if (selected_value) {
        setReportVendor(selected_value)
      } else {
        setReportVendor(0)
      }
    } else if (event_type == 'freight_percentage') {
      if (selected_value) {
        setReportFreightp(selected_value)
      } else {
        setReportFreightp(0)
      }
    }   
  }

  const mpsFilterDataSubmission = () => {
    // setFetch(true) 
    console.log(reportVendor,'mpsFilterDataSubmission-reportVendor')
    console.log(reportFreightp,'mpsFilterDataSubmission-reportFreightp') 

    console.log(dateRangePickerStartDate, 'mpsFilterDataSubmission-start date')
    console.log(dateRangePickerEndDate, 'mpsFilterDataSubmission-end date')

    if (dateRangePickerStartDate == '' && dateRangePickerEndDate == '') {
      setFetch(true) 
      toast.warning('Date Filter Should not be empty..!')
      return false
    } 

    let report_form_data = new FormData() 
    report_form_data.append('diesel_from_date_range', dateRangePickerStartDate)
    report_form_data.append('diesel_to_date_range', dateRangePickerEndDate)
    report_form_data.append('vendor_code', reportVendor)
    report_form_data.append('advance_amount', reportFreightp) 

    NlmtTripSheetClosureService.filterNLMTVehicleReadyToPaymentSequenceNumberGeneration(report_form_data).then((res) => {
      console.log(res, 'res')
      setFetch(true) 
      let tableData = res.data.data 
      console.log(tableData,'filterNLFSVehicleReadyToDieselIndentSequenceNumberGeneration - tableData') 
      setDIInfo({
        di_orders: [],
        response: [],
      })
      // let filterData = tableData.filter(
      //   (data) => ((data.diesel_to == 2 && data.nlfs_sap_status == 4) || (data.diesel_to != 2 && data.nlfs_sap_status == 3))
      // )

      // console.log(filterData,'filterNLFSVehicleReadyToDieselIndentSequenceNumberGeneration - filterData') 

      setSearchFilterData(tableData)
      setRowData(tableData) 
    })
    .catch((errortemp) => {
      console.log(errortemp)
      setFetch(true)
      var object = errortemp.response.data.errors
      var output = ''
      for (var property in object) {
        output += '*' + object[property] + '\n'
      }
      setError(output)
      setErrorModal(true)
    })

  }

   const totalFreightTripsheets = (data) => {
    
    let tot_amount = 0
    let total_amount = 0
    console.log(data,'totalFreightTripsheets-data')
    data.map((val,ind)=>{  

      let deduction = Number(val.trip_settlement_info.diversion_return_charges)
      let amount = totalRateFinder(val.trip_settlement_info.advance_amount == 10 ? 1 : 2,val,deduction)
      tot_amount = tot_amount + (amount)
      console.log(tot_amount,'totalFreightTripsheets-total_amount-child')

    })

    total_amount = Number(parseFloat(tot_amount).toFixed(3))
    console.log(total_amount,'totalFreightTripsheets-total_amount')
    // setTotalFreightPayment(total_amount)
    return total_amount
  }

  const totalRateFinder = (type, data, deduction) => {

    // let freight = tdsRateFinder(type,data)
    let freight = 0

    if(type == 1){
      freight = balanceFreight(data.advance_payment_info.sap_freight_payment_amount,data.advance_payment_info.sap_bank_payment_amount)
    } else {
      freight = data.trip_settlement_info.sap_expense_amount
    }

    let frt = Number(parseFloat(freight).toFixed(2))
    let ded = Number(parseFloat(deduction).toFixed(2))

    let rate = Number(parseFloat(frt - ded).toFixed(2))
    console.log(rate,'totalRateFinder-rate')
    return rate
  }

  const tdsRateFinder = (type, data) => {

    let frt = 0
    if(type == 1){
      frt = data.advance_payment_info.sap_freight_payment_amount
    } else {
      frt = data.trip_settlement_info.sap_expense_amount
    }
    return frt
  }

   const balanceFreight = (a,b) => {

    if(!a || !b)
      return 0

    let freight = Number(parseFloat(a).toFixed(2))
    let advance = Number(parseFloat(b).toFixed(2))

    let frt = Number(parseFloat(freight - advance).toFixed(2))
    console.log(frt,'balanceFreight-frt')
    return frt

  }

  const freightRateFinder = (type, data) => {

    let frt = 0
    if(type == 1){
      frt = data.advance_payment_info.actual_freight
    } else {
      frt = data.trip_settlement_info.expense
    }
    return frt
  }

  const tdsTaxAmountFinder = (tsno, type = 0, deduction = 0) => {

    console.log(sapTdsFreightData,'tdsTaxAmountFinder-data')
    let amount = 0
    let total = 0
    sapTdsFreightData.map((ff,jj)=>{
        if(ff.TRIPSHEET_NO == tsno){
            amount = ff.TDS_AMT
        }
    })
    console.log(amount,'tdsTaxAmountFinder-amount')

    if(type == 1){
        total = amount - deduction
    }
    console.log(total,'tdsTaxAmountFinder-total')
    return type == 1 ? total : amount
  }

  const PaymentSequenceNoGeneration = () => {
    console.log(diInfo,'PaymentSequenceNoGeneration-diInfo')
    console.log(tripDIInfoArray,'PaymentSequenceNoGeneration-tripDIInfoArray')

    var trip_payment_array= []
    var trip_array= []
    tripDIInfoArray.map((map_data,map_index)=>{
      trip_payment_array.push({
        parking_id: map_data.nlmt_trip_in_id,
        trip_id: map_data.tripsheet_id,
        shipment_id: map_data.vehicle_assignment[0].shipment_id,
        closure_id: map_data.trip_settlement_info.id,
        trip_no: map_data.tripsheet_info.nlmt_tripsheet_no, 
        shipment_no: map_data.vehicle_assignment[0].shipment_no,
        sap_tds_expense: tdsTaxAmountFinder(map_data.tripsheet_info.nlmt_tripsheet_no)
      })
      trip_array.push(map_data.tripsheet_id)
    })
    

    let tfp = totalFreightTripsheets(tripDIInfoArray)
    console.log(tfp,'totalFreightPayment')

    let tfq = totalShipmentQuantity(tripDIInfoArray)
    console.log(tfq,'totalShipmentQuantity')

    let di_submission_data = new FormData()
    
    di_submission_data.append('vendor_name', tripDIInfoArray[0].vendor_info.owner_name)
    di_submission_data.append('vendor_code', tripDIInfoArray[0].vendor_info.vendor_code)
    di_submission_data.append('tripsheet_count', tripDIInfoArray.length)

    di_submission_data.append('shipment_qty', tfq)
    di_submission_data.append('freight_percentage', tripDIInfoArray[0].trip_settlement_info.advance_amount)
    di_submission_data.append('freight_amount', tfp)
    di_submission_data.append('remarks', message) 
    di_submission_data.append('created_by', user_id)

    di_submission_data.append('tripsheets', JSON.stringify(trip_array))
    di_submission_data.append('trip_info', JSON.stringify(trip_payment_array))
    
    // setFetch(true)
    NlmtTripSheetClosureService.sentNLMTPaymentSubmissionData(di_submission_data).then((res) => {
      // console.log(res,'sentPaymentSubmissionData')
      
      setFetch(true)
      if (res.status == 200) {
        let payment_reference = res.data.invoice_reference
        Swal.fire({
          icon: "success",
          title: 'Payment Submission Request Sent Successfully!',
          text:  'Payment Sequence : ' + payment_reference,
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
          window.location.reload(false)
        })
      } else {
        toast.warning('Payment Submission Cannot be Updated. Kindly contact Admin..!')
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
      setError(output)
      setErrorModal(true)
    })

  }

  const [searchFilterData, setSearchFilterData] = useState([])

  function getCurrentDate(separator = '') {
    let newDate = new Date()
    let date = newDate.getDate()
    let month = newDate.getMonth() + 1
    let year = newDate.getFullYear()

    return `${year}${separator}${month < 10 ? `0${month}` : `${month}`}${separator}${
      date < 10 ? `0${date}` : `${date}`
    }`
  }
  
  const [message, setMessage] = useState('')
  const [value, setValue] = React.useState([new Date(getCurrentDate('-')), new Date(getCurrentDate('-'))]);
  const [dateRangePickerStartDate, setDateRangePickerStartDate] = useState('')
  const [dateRangePickerEndDate, setDateRangePickerEndDate] = useState('')

  const handleChangeRemarks = (event) => {
    const result = event.target.value.toUpperCase()
    // console.log('value.message', message)
    setMessage(result)
  }

  const  convert = (str) => {
    let date = new Date(str);
    let mnth = ("0" + (date.getMonth() + 1)).slice(-2);
    let day = ("0" + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join("-");

  }

  useEffect (()=>{
  
    if(value){

      console.log(value)
      let fromDate = value[0];
      let toDate = value[1];
      console.log(convert(fromDate))
      console.log(convert(toDate))
      setDateRangePickerStartDate(convert(fromDate));
      setDateRangePickerEndDate(convert(toDate));

    } else {

      setDateRangePickerStartDate('');
      setDateRangePickerEndDate('');

    }
  },[value])

  const exportToCSV = () => {
    // console.log(rowData,'exportCsvData')
    let dateTimeString = GetDateTimeFormat(1)
    let fileName = 'NLMT_Payment_Submission_' + dateTimeString
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';
    const ws = XLSX.utils.json_to_sheet(rowData);
    const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  }

  return (
    <>
      {!fetch && <Loader />}{' '}
      {fetch && (
        <>
          {screenAccess ? (
            <>
              <CCard className="p-1">                 
                <CContainer className="m-2">
                  <CRow className="mt-1 mb-1">
                    <CCol xs={12} md={3}>
                      <CFormLabel htmlFor="VNum">
                        Expense Closure Date Filter
                      </CFormLabel>
                      <DateRangePicker
                        style={{width: '100rem',height:'100%',borderColor:'black'}}
                        className="mb-2"
                        id="advpay_date_range"
                        name="advpay_date_range"
                        format="dd-MM-yyyy"
                        value={value}
                        onChange={setValue}
                        // onChange={getAdvanceDateRange(e)}
                      />
                    </CCol>
                    
                    <CCol xs={12} md={3}>
                      <CFormLabel htmlFor="VNum">Vendor Name</CFormLabel>
                      <MTSearchSelectComponent
                        size="sm"
                        className="mb-2"
                        onChange={(e) => {
                          onChangeFilter(e, 'vendor_name')
                        }}
                        label="Select Vendor Name"
                        noOptionsMessage="Vendor Name Not found"
                        search_type="nlmt_filter_vendor_name"
                        search_data={searchFilterData}
                      />
                    </CCol>
                    
                    <CCol xs={12} md={3}>
                      <CFormLabel htmlFor="VNum">Freight Percentage</CFormLabel>
                      <MTSearchSelectComponent
                        size="sm"
                        className="mb-2"
                        onChange={(e) => {
                          onChangeFilter(e, 'freight_percentage')
                        }}
                        label="Select Freight Percentage Type"
                        noOptionsMessage="Freight Percentage Type Not found"
                        search_type="nlmt_filter_freight_percentage_type"
                        search_data={searchFilterData}
                      />
                    </CCol> 
                    <CCol xs={12} md={3}
                      style={{  marginTop:'3%' }}
                    >
                      <CButton
                        size="sm"
                        color="primary"
                        className="mx-3 px-3 text-white"
                        onClick={() => {
                          setFetch(false)
                          mpsFilterDataSubmission()
                        }}
                      >
                        Filter
                      </CButton>
                      {/* <CButton
                        size="sm"
                        color="warning"
                        className="mx-3 px-3 text-white"
                        // style={{marginTop:'10%'}}
                        onClick={(e) => {
                            // loadVehicleReadyToTripForExportCSV()
                            exportToCSV()
                          }}
                      >
                        Export
                      </CButton> */}
                      {Object.keys(rowData).length > 0 && ( 
                        <CButton
                          onClick={() => {
                            checkModalDisplay()
                            // setAssignTruckModal(!assignTruckModal)
                          }}
                          color="success"
                          className="mx-3 text-white"
                          size="sm"
                          id="inputAddress"
                        >
                          <span className="float-start">
                            <i className="" aria-hidden="true"></i> &nbsp;Assign MPS
                          </span>
                        </CButton>
                      )}

                    </CCol>
                     
                  </CRow>
                </CContainer>
                <CTabContent>
                  <CTabPane role="tabpanel" aria-labelledby="" visible={activeKey === 1}>
                    {Object.keys(rowData).length == 0 && (
                      <>
                        <div className="m-5">
                          <h2>There are no Tripsheets to display..</h2>
                        </div>
                      </>
                    )}
                    {Object.keys(rowData).length > 0 && (
                      <>
                        
                        <CRow>
                          <CTable style={{ height: '80vh', width: 'auto' }} className="overflow-scroll">
                            <CTableHead style={{ backgroundColor: '#4d3227', color: 'white' }}>
                              <CTableRow style={{ width: '100%' }}>
                                {/* <CTableHeaderCell
                                  scope="col"
                                  style={{ color: 'white', width: '5%', textAlign: 'center' }}
                                >
                                  #
                                </CTableHeaderCell> */}
                                <CTableDataCell
                                  style={{ width: '5%', textAlign: 'center' }}
                                  scope="row"
                                >
                                  <input
                                    className="form-check-input"
                                    style={{ minHeight: '18px !important', background:rowData.length > 0 &&
                                      diInfo.di_orders.length === rowData.length ? 'yellow' : 'white' }}
                                    type="checkbox"
                                    name="delivery_orders" 
                                    id="flexCheckDefault"
                                    onChange={assign_all}
                                    checked={
                                      rowData.length > 0 &&
                                      diInfo.di_orders.length === rowData.length
                                    }
                                  /> 
                                  {rowData.length > 0 &&
                                      diInfo.di_orders.length === rowData.length && (
                                    <span
                                      style={{
                                        position: 'absolute', 
                                        left: 30,
                                        fontSize: 14,
                                        color: 'black',
                                        pointerEvents: 'none'
                                      }}
                                    >
                                      ✔
                                    </span>
                                  )}
                                </CTableDataCell>
                                <CTableHeaderCell
                                  scope="col"
                                  style={{ color: 'white', width: '5%', textAlign: 'center' }}
                                >
                                  S.No
                                </CTableHeaderCell>

                                <CTableHeaderCell
                                  scope="col"
                                  style={{ color: 'white', width: '9%', textAlign: 'center' }}
                                >
                                  Tripsheet No.
                                </CTableHeaderCell>

                                <CTableHeaderCell
                                  scope="col"
                                  style={{ color: 'white', width: '9%', textAlign: 'center' }}
                                >
                                  Exp. Date
                                </CTableHeaderCell>

                                <CTableHeaderCell
                                  scope="col"
                                  style={{ color: 'white', width: '9%', textAlign: 'center' }}
                                >
                                  Vendor Name
                                </CTableHeaderCell>
                                <CTableHeaderCell
                                  scope="col"
                                  style={{ color: 'white', width: '9%', textAlign: 'center' }}
                                >
                                  Code
                                </CTableHeaderCell> 
                                <CTableHeaderCell
                                  scope="col"
                                  style={{ color: 'white', width: '9%', textAlign: 'center' }}
                                >
                                  Vehicle No.
                                </CTableHeaderCell>
                                {/* <CTableHeaderCell
                                  scope="col"
                                  style={{ color: 'white', width: '9%', textAlign: 'center' }}
                                >
                                  User Name
                                </CTableHeaderCell> */}
                                <CTableHeaderCell
                                  scope="col"
                                  style={{ color: 'white', width: '9%', textAlign: 'center' }}
                                >
                                  Shipment Qty.
                                </CTableHeaderCell>
                                
                                <CTableHeaderCell
                                  scope="col"
                                  style={{ color: 'white', width: '9%', textAlign: 'center' }}
                                >
                                  Freight %
                                </CTableHeaderCell>
                                <CTableHeaderCell
                                  scope="col"
                                  style={{ color: 'white', width: '9%', textAlign: 'center' }}
                                >
                                  Freight Balance
                                </CTableHeaderCell>
                                <CTableHeaderCell
                                  scope="col"
                                  style={{ color: 'white', width: '9%', textAlign: 'center' }}
                                >
                                  Total Freight
                                </CTableHeaderCell>
                                {/* <CTableHeaderCell
                                  scope="col"
                                  style={{ color: 'white', width: '9%', textAlign: 'center' }}
                                >
                                  TDS Tax
                                </CTableHeaderCell>  */}
                                
                                <CTableHeaderCell
                                  scope="col"
                                  style={{ color: 'white', width: '9%', textAlign: 'center' }}
                                >
                                  Deduction Amount
                                </CTableHeaderCell> 

                                {/* <CTableHeaderCell
                                  scope="col"
                                  style={{ color: 'white', width: '9%', textAlign: 'center' }}
                                >
                                  Payment Amount
                                </CTableHeaderCell>  */}
                                 
                              </CTableRow>
                            </CTableHead>
                            <CTableBody>
                              {/* { saleOrders && { */}
                              {/* {fetch && */}
                              {rowData.map((data, index) => {
                                console.log('data')
                                // console.log(data)
                                // if (data.VBELN2)
                                return (
                                  <>
                                    <CTableRow>
                                      <CTableDataCell
                                        style={{ width: '5%', textAlign: 'center' }}
                                        scope="row"
                                      >
                                        <input
                                          className="form-check-input"
                                          style={{ minHeight: '18px !important' }}
                                          type="checkbox"
                                          name="delivery_orders"
                                          value={data.nlmt_trip_in_id}
                                          id="flexCheckDefault" 
                                          checked={diInfo.di_orders.includes(data.nlmt_trip_in_id)}
                                          onChange={(e) => {
                                            assign_delivery(e, data.nlmt_trip_in_id)
                                          }}
                                        />
                                        {/* <input type="checkbox" name="name2" /> */}
                                      </CTableDataCell>
                                      <CTableDataCell
                                        style={{ width: '5%', textAlign: 'center' }}
                                        scope="row"
                                      >
                                        {/* {index+1} */}
                                        <a style={{color:'black'}} target='_blank' rel="noreferrer" href={data.trip_settlement_info.expense_form}>
                                          <u><strong>{index+1}</strong></u>
                                        </a> 
                                         
                                      </CTableDataCell>
                                      <CTableDataCell
                                        style={{ width: '9%', textAlign: 'center' }}
                                        scope="row"
                                      >
                                        {/* {data.tripsheet_info.nlmt_tripsheet_no} */}                                      
                                        <Link
                                          className='text-black'
                                          target='_blank'
                                          to={`/NlmtSettlementClosureInfo/${data.nlmt_trip_in_id}`}
                                        >
                                          <u><strong>{data.tripsheet_info.nlmt_tripsheet_no}</strong></u>
                                        </Link>
                                                    
                                      </CTableDataCell>
                                      <CTableDataCell
                                        style={{ width: '9%', textAlign: 'center' }}
                                        scope="row"
                                      >
                                        {formatDate(data.trip_settlement_info.expense_posting_date)}
                                      </CTableDataCell>
                                      <CTableDataCell
                                        style={{ width: '9%', textAlign: 'center' }}
                                        scope="row"
                                      >
                                        {data.vendor_info.owner_name}
                                        
                                      </CTableDataCell>
                                      <CTableDataCell
                                        style={{ width: '9%', textAlign: 'center' }}
                                        scope="row"
                                      >
                                        {data.vendor_info.vendor_code}
                                      </CTableDataCell>
                                      <CTableDataCell
                                        style={{ width: '9%', textAlign: 'center' }}
                                        scope="row"
                                      >
                                        {data.vehicle_info.vehicle_number}
                                      </CTableDataCell>
                                      {/* <CTableDataCell
                                        style={{ width: '9%', textAlign: 'center' }}
                                        scope="row"
                                      >
                                        {data.vehicle_user_name}
                                      </CTableDataCell> */}
                                      <CTableDataCell
                                        style={{ width: '9%', textAlign: 'center' }}
                                        scope="row"
                                      >
                                        {`${(data.vehicle_assignment && data.vehicle_assignment[0]) ? data.vehicle_assignment[0].billed_net_qty : 0} TON`}
                                      </CTableDataCell>
                                      <CTableDataCell
                                        style={{ width: '9%', textAlign: 'center' }}
                                        scope="row"
                                      >
                                         {`${data.trip_settlement_info.advance_amount} %`}
                                      </CTableDataCell>
                                      <CTableDataCell
                                        style={{ width: '9%', textAlign: 'center' }}
                                        scope="row"
                                      >
                                        {data.trip_settlement_info.advance_amount == 100 ? (data.trip_settlement_info.sap_expense_amount ? data.trip_settlement_info.sap_expense_amount : data.trip_settlement_info.expense) : data.advance_payment_info.sap_freight_payment_amount ? balanceFreight(data.advance_payment_info.sap_freight_payment_amount,data.advance_payment_info.sap_bank_payment_amount) :  data.trip_settlement_info.expense / 10}
                                      </CTableDataCell>
                                      
                                      <CTableDataCell
                                        style={{ width: '9%', textAlign: 'center' }}
                                        scope="row"
                                      >
                                         {data.trip_settlement_info.advance_amount == 100 ? (data.trip_settlement_info.sap_expense_amount ? data.trip_settlement_info.sap_expense_amount : data.trip_settlement_info.expense) : data.advance_payment_info.sap_freight_payment_amount ? data.advance_payment_info.sap_freight_payment_amount :  data.advance_payment_info.actual_freight}
                                      </CTableDataCell>
                                      {/* <CTableDataCell
                                        style={{ width: '9%', textAlign: 'center' }}
                                        scope="row"
                                      >
                                         
                                        <a className='text-black' target='_blank' rel="noreferrer" href={data.invoice_copy}>
                                          <u><strong>{data.invoice_no}</strong></u>
                                        </a>                                                 
                                         
                                      </CTableDataCell>  */}
                                      {/* <CTableDataCell
                                        style={{ width: '9%', textAlign: 'center' }}
                                        scope="row"
                                      >
                                        {data.trip_settlement_info.tds_having == 0 ? 'No Tax' : tdsTaxCodeName(data.trip_settlement_info.tds_type)}
                                      </CTableDataCell> */}
                                      <CTableDataCell
                                        style={{ width: '9%', textAlign: 'center' }}
                                        scope="row"
                                      >
                                        {data.trip_settlement_info.diversion_return_charges ? data.trip_settlement_info.diversion_return_charges : 0}
                                      </CTableDataCell>
                                      {/* <CTableDataCell
                                        style={{ width: '9%', textAlign: 'center' }}
                                        scope="row"
                                      >
                                        {paymentFinder(data.trip_settlement_info)}
                                      </CTableDataCell> */}
                                       
                                    </CTableRow>
                                  </>
                                )
                              })}
                            </CTableBody>
                          </CTable>
                        </CRow>
                      </>
                    )}
                  </CTabPane>
                </CTabContent>

                 

              </CCard>
            </>) : (<AccessDeniedComponent />
          )}
        </>
      )}
      {/* Error Modal Section */}
      <CModal visible={errorModal} onClose={() => setErrorModal(false)}>
        <CModalHeader>
          <CModalTitle className="h4">Error</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CRow>
            <CCol>
              {error && (
                // <CAlert color="danger">
                  {error}
                // </CAlert>
              )}
            </CCol>
          </CRow>
        </CModalBody>
        <CModalFooter>
          <CButton onClick={() => setErrorModal(false)} color="primary">
            Close
          </CButton>
        </CModalFooter>
      </CModal>
      {/* Error Modal Section */}
      
      {/* *********************************************************** */}
      
      {/* Assign Payment Modal */}
      <CModal
        size="xl"
        backdrop="static"
        scrollable
        visible={assignPSModal}
        onClose={() => setAssignPSModal(false)}
      >
        <CModalHeader>
          <CModalTitle><b>NLMT Payment Submission</b></CModalTitle>
        </CModalHeader>
        <CModalBody>
          {tripDIInfoArray.length > 0 ? (
            // <CTable bordered borderColor="primary">
            
            <>
              <CRow className="">
                <CCol md={4}>
                  <CFormLabel htmlFor="cname">Vendor Name & Code</CFormLabel>
                  <CFormInput
                    style={{fontWeight: 'bolder'}}
                    name="cname"
                    size="sm"
                    id="cname"
                    value={`${tripDIInfoArray[0].vendor_info.owner_name} (${tripDIInfoArray[0].vendor_info.vendor_code})`}
                    readOnly
                  />
                </CCol>

                <CCol md={2}>
                  <CFormLabel htmlFor="cmn">Freight in %</CFormLabel>
                  <CFormInput
                    style={{fontWeight: 'bolder'}}
                    name="cmn"
                    size="sm"
                    id="cmn"
                    value={`${tripDIInfoArray[0].trip_settlement_info.advance_amount} %`}
                    readOnly
                  />
                </CCol>
                
                <CCol md={2}>
                  <CFormLabel htmlFor="cmn">Tripsheet Count</CFormLabel>
                  <CFormInput
                    style={{fontWeight: 'bolder'}}
                    name="cmn"
                    size="sm"
                    id="cmn"
                    value={`${tripDIInfoArray.length}`}
                    readOnly
                  />
                </CCol>

                <CCol md={2}>
                  <CFormLabel htmlFor="cmn">Total Shipment Qty.</CFormLabel>
                  <CFormInput
                    style={{fontWeight: 'bolder'}}
                    name="cmn"
                    size="sm"
                    id="cmn"
                    value={`${totalShipmentQuantity(tripDIInfoArray)} TON`}
                    readOnly
                  />
                </CCol>   

                <CCol md={2}>
                  <CFormLabel htmlFor="cmn">Total Amount</CFormLabel>
                  <CFormInput
                    style={{fontWeight: 'bolder'}}
                    name="cmn"
                    size="sm"
                    id="cmn"
                    value={totalFreightTripsheets(tripDIInfoArray)}
                    readOnly
                  />
                </CCol>               

                <CCol md={3}>
                  <CFormLabel htmlFor="remarks">Remarks</CFormLabel>
                  <CFormInput
                    size="sm"
                    name="remarks"
                    id="remarks"
                    value={message}
                    onChange={handleChangeRemarks}
                  />
                </CCol>
              </CRow>
              <CTable striped hover style={{height:tripDIInfoArray.length > 2 ? '50vh' : '30vh'}}>
                <CTableHead className='mt-3' style={{background: 'pink'}}>
                  <CTableRow>
                    <CTableHeaderCell scope="col" style={{width: '5%', textAlign:"center"}}>S.No</CTableHeaderCell>
                    <CTableHeaderCell scope="col" style={{width: '15%', textAlign:"center"}}>Tripsheet</CTableHeaderCell>
                    <CTableHeaderCell scope="col" style={{width: '15%', textAlign:"center"}}>Truck No.</CTableHeaderCell>
                    <CTableHeaderCell scope="col" style={{width: '15%', textAlign:"center"}}>Shipment Qty.</CTableHeaderCell>
                    <CTableHeaderCell scope="col" style={{width: '15%', textAlign:"center"}}>Freight</CTableHeaderCell>
                    <CTableHeaderCell scope="col" style={{width: '15%', textAlign:"center"}}>GST/TDS</CTableHeaderCell>
                    {/* <CTableHeaderCell scope="col" style={{width: '15%', textAlign:"center"}}>TDS TAX</CTableHeaderCell> */}
                    <CTableHeaderCell scope="col" style={{width: '15%', textAlign:"center"}}>100 % Amt.</CTableHeaderCell>

                    {tripDIInfoArray[0].trip_settlement_info.advance_amount == 10 && (
                      <CTableHeaderCell scope="col" style={{width: '15%', textAlign:"center"}}>
                        {'10% Amt.'}
                      </CTableHeaderCell>  
                    )}
                                     
                    <CTableHeaderCell scope="col" style={{width: '15%', textAlign:"center"}}>Deduction</CTableHeaderCell>
                    <CTableHeaderCell scope="col" style={{width: '15%', textAlign:"center"}}>Balance</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {tripDIInfoArray.map((val,ind)=>{
                    // console.log(val,'searchFilterData-Depo Tripsheets : Payment Submission')
                    return(
                      <CTableRow key={ind}>

                        <CTableDataCell scope="col" style={{width: '5%', textAlign:"center"}}>{ind+1}</CTableDataCell>

                        <CTableDataCell scope="col" style={{width: '15%', textAlign:"center"}}>{val.tripsheet_info.nlmt_tripsheet_no}</CTableDataCell>

                        <CTableDataCell scope="col" style={{width: '15%', textAlign:"center"}}>{val.vehicle_info.vehicle_number}</CTableDataCell> 

                        <CTableDataCell scope="col" style={{width: '15%', textAlign:"center"}}>{val.vehicle_assignment && val.vehicle_assignment[0] && val.vehicle_assignment[0].billed_net_qty ? val.vehicle_assignment[0].billed_net_qty : ''}</CTableDataCell>

                        <CTableDataCell scope="col" style={{width: '15%', textAlign:"center"}}>{freightRateFinder(val.trip_settlement_info.advance_amount == 10 ? 1 : 2,val)}</CTableDataCell>

                        <CTableDataCell scope="col" style={{width: '15%', textAlign:"center"}}>{`${(val.trip_settlement_info.gst_tax_type && val.trip_settlement_info.gst_tax_type != 'Empty') ? val.trip_settlement_info.gst_tax_type : '-'} / ${val.trip_settlement_info.vendor_tds == 0 ? '-' : val.trip_settlement_info.vendor_tds}`}</CTableDataCell>  

                        <CTableDataCell scope="col" style={{width: '15%', textAlign:"center"}}>{tdsRateFinder(val.trip_settlement_info.advance_amount == 10 ? 1 : 2,val)}</CTableDataCell>

                        {val.trip_settlement_info.advance_amount == 10 && (
                          <CTableDataCell scope="col" style={{width: '15%', textAlign:"center"}}>
                            {balanceFreight(val.advance_payment_info.sap_freight_payment_amount,val.advance_payment_info.sap_bank_payment_amount)}
                          </CTableDataCell>
                        )}

                        <CTableDataCell scope="col" style={{width: '15%', textAlign:"center"}}>{val.trip_settlement_info.diversion_return_charges}</CTableDataCell>

                        <CTableDataCell scope="col" style={{width: '15%', textAlign:"center"}}>{totalRateFinder(val.trip_settlement_info.advance_amount == 10 ? 1 : 2,val,val.trip_settlement_info.diversion_return_charges)}</CTableDataCell>
                        {/* <CTableDataCell scope="col" style={{width: '15%', textAlign:"center"}}>{val.invoice_no}</CTableDataCell>
                        <CTableDataCell scope="col" style={{width: '15%', textAlign:"center"}}>{invoiceNoFinder(val)}</CTableDataCell> */}
                      </CTableRow>
                    )

                  })}
                  <CTableRow>
                    <CTableDataCell colSpan={6} scope="col" style={{width: '95%', textAlign:'end'}}>Total Freight</CTableDataCell>
                    <CTableDataCell scope="col" style={{width: '15%', color:'green', fontWeight:'bold', textAlign:'center'}}>{totalFreightTripsheets(tripDIInfoArray)}
                    </CTableDataCell>
                  </CTableRow>
                </CTableBody>
              </CTable>
            </>) : (<>Tripsheets Not Found / Invalid</>
        )}
           
        </CModalBody>

        <CModalFooter>

          <CButton
            color="primary"
            style={{marginRight: '2%'}}
            onClick={() => {
              setAssignPSModal(false)
              setFetch(false)
              PaymentSequenceNoGeneration()
            }}
          >
            {'Submit'}
          </CButton>
          <CButton
            color="primary"
            onClick={() => {
              setAssignPSModal(false)
            }}
          >
            {'Cancel'}
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}

export default NlmtSettlementClosureHome


