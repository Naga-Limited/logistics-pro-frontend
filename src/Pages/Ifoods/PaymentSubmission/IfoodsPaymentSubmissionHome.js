// import { React, useState, useEffect } from 'react'
import React, { useState, useEffect } from 'react'
import {
  CButton,
  CCard,
  CCol,
  CContainer,
  CFormInput,
  CFormLabel,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'

import { Link, useNavigate } from 'react-router-dom'
import CustomTable from 'src/components/customComponent/CustomTable'
import Loader from 'src/components/Loader'
import AccessDeniedComponent from 'src/components/commoncomponent/AccessDeniedComponent'
import JavascriptInArrayComponent from 'src/components/commoncomponent/JavascriptInArrayComponent'
import * as LogisticsProScreenNumberConstants from 'src/components/constants/LogisticsProScreenNumberConstants'
import DepoExpenseClosureService from 'src/Service/Depo/ExpenseClosure/DepoExpenseClosureService'
import SearchSelectComponent from 'src/components/commoncomponent/searchSelectComponent'
import { DateRangePicker } from 'rsuite'
import { toast } from 'react-toastify'
import TripPaymentSubmissionComponent from './TripPaymentSubmissionComponent'
import UserMasterValidation from 'src/Utils/Master/UserMasterValidation'
import useForm from 'src/Hooks/useForm'
import Swal from 'sweetalert2'
import DefinitionsListApi from 'src/Service/Definitions/DefinitionsListApi'
import { GetDateTimeFormat, getFreightAdjustment, getGstTax } from '../CommonMethods/CommonMethods'
import FileSaver from 'file-saver'
import * as XLSX from 'xlsx'
import IfoodsExpenseClosureService from 'src/Service/Ifoods/ExpenseClosure/IfoodsExpenseClosureService'
import IfoodsSalesfreightMasterService from 'src/Service/Ifoods/Master/IfoodsSalesfreightMasterService'

const IfoodsPaymentSubmissionHome = () => {
  /*================== User Location Fetch ======================*/
  const user_info_json = localStorage.getItem('user_info')
  const user_info = JSON.parse(user_info_json)
  const user_locations = []
  const user_vehicle_types = []

  /* Get User Locations From Local Storage */
  user_info.location_info.map((data, index) => {
    user_locations.push(data.id)
  })
  const navigation = useNavigate()
  /* Get User Id From Local Storage */
  const user_id = user_info.user_id

  /* Get User Vehicle Types From Local Storage */
  user_info.vehicle_type_info.map((data, index) => {
    user_vehicle_types.push(data.id)
  })

  // console.log(user_locations)
  /*================== User Location Fetch ======================*/

  const formValues = {
    vehicleNumber: '',
    tripsheetNumber: '',
    tripPaymentSubmission: '',
  }

  const {
    values,
    errors,
    handleChange,
    handleMultipleChange,
    onFocus,
    handleSubmit,
    enableSubmit,
    onBlur,
    isTouched,
  } = useForm(login, UserMasterValidation, formValues)

  function login() {
    // alert('No Errors CallBack Called')
  }

  /* ==================== Access Part Start ========================*/
  const [screenAccess, setScreenAccess] = useState(false)
  let page_no = LogisticsProScreenNumberConstants.IfoodsModuleScreens.Payment_Submission

  useEffect(() => {
    if (
      user_info.is_admin == 1 ||
      JavascriptInArrayComponent(page_no, user_info.page_permissions)
    ) {
      console.log('screen-access-allowed')
      setScreenAccess(true)
    } else {
      console.log('screen-access-not-allowed')
      setScreenAccess(false)
    }
  }, [])
  /* ==================== Access Part End ========================*/

  const [rowData, setRowData] = useState([])
  const [tripPaymentsArray, setTripPaymentsArray] = useState([])
  const [singleVendorArray, setSingleVendorArray] = useState([])
  const [searchFilterData, setSearchFilterData] = useState([])
  // const [pending, setPending] = useState(true)
  const [fetch, setFetch] = useState(false)
  let tableData = []
  let closureData = []
  var tdInfo = {
    tripsheet_orders: [],
    response: [],
  }

  const ACTION = {
    GATE_IN: 1,
    GATE_OUT: 2,
    WAIT_OUTSIDE: 0,
  }

  const [message, setMessage] = useState('')

  const handleChangeRemarks = (event) => {
    const result = event.target.value.toUpperCase()
    // console.log('value.message', message)
    setMessage(result)
  }

  /* Vehicle Current Position */
  const VEHICLE_CURRENT_POSITION = {
    DEPO_SHIPMENT_COMPLETED: 22,
    DEPO_EXPENSE_APPROVAL: 27,
    DEPO_SETTLEMENT_CLOSURE: 20,
  }

  /* Set Default Date (Today) in a Variable State */
  const [defaultDate, setDefaultDate] = React.useState([
    new Date(getCurrentDate('-')),
    new Date(getCurrentDate('-')),
  ])
  const minDate = new Date()
  const maxDate = new Date(new Date().getTime() + 32 * 24 * 60 * 60 * 1000)

  useEffect(() => {
    console.log(defaultDate)
    if (defaultDate) {
      setDefaultDate(defaultDate)
    } else {
    }
  }, [defaultDate])

  const statusSetter = (value) => {
    if (value.closure_approval_needed == '1' && value.closure_approval_time != null) {
      return <span>{'Expense Approval ✔️'}</span>
    } else {
      return <span>{'Expense Closure ✔️'}</span>
    }
  }

  const exportToCSV = () => {
    // console.log(rowData,'exportCsvData')
    let dateTimeString = GetDateTimeFormat(1)
    let fileName = 'Ifoods_Payment_Submission_' + dateTimeString
    const fileType =
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
    const fileExtension = '.xlsx'
    const ws = XLSX.utils.json_to_sheet(rowData)
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] }
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
    const data = new Blob([excelBuffer], { type: fileType })
    FileSaver.saveAs(data, fileName + fileExtension)
  }

  const removeDuplicates = (arr) => {
    return arr.filter((item, index) => arr.indexOf(item) === index)
  }

  const [assignPSModal, setAssignPSModal] = useState(false)

  const checkModalDisplay = () => {
    let trip_payments_array = JSON.parse(JSON.stringify(values.tripPaymentSubmission))

    // console.log(searchFilterData,'searchFilterData-searchFilterData')
    //console.log(trip_payments_array,'trip_payments_array-trip_payments_array')

    let trip_payments_selected_array = searchFilterData.filter((value) =>
      JavascriptInArrayComponent(value.tripsheet_sheet_id, trip_payments_array)
    )

    // console.log(trip_payments_selected_array,'trip_payments_selected_array-trip_payments_selected_array')

    setTripPaymentsArray(trip_payments_selected_array)

    let contractor_array = []
    let purpose_array = []
    let purpose_array_updated = []
    let single_purpose_array = []
    let contractor_array_updated = []
    let single_contractor_array = []
    trip_payments_selected_array.map((vall, indd) => {
      contractor_array.push(vall.ifoods_Vendor_info.id)
    })
    trip_payments_selected_array.map((vall, indd) => {
      purpose_array.push(vall.purpose)
    })

    // console.log(contractor_array,'contractor_array-contractor_array')

    contractor_array_updated = removeDuplicates(contractor_array)
    purpose_array_updated = removeDuplicates(purpose_array)

    // console.log(contractor_array_updated,'contractor_array_updated-contractor_array_updated')

    // console.log(values.tripPaymentSubmission,'values.tripPaymentSubmission')

    if (trip_payments_array.length == 0) {
      toast.warning('Please Choose Atleast One Tripsheet for Payment Submission..!')
      setAssignPSModal(false)
    } else {
      if (contractor_array_updated.length > 1) {
        toast.warning('The selection of tripsheets should only be for a single vendor...!')
        setAssignPSModal(false)
      } else {
        single_contractor_array = searchFilterData.filter((value) =>
          JavascriptInArrayComponent(value.ifoods_Vendor_info.id, contractor_array_updated)
        )

        // console.log(removeDuplicates(single_contractor_array),'removeDuplicates(single_contractor_array)')
        setSingleVendorArray(removeDuplicates(single_contractor_array))
        setAssignPSModal(true)
      }
    }

    console.log(removeDuplicates(single_contractor_array))
  }
  console.log(singleVendorArray + 'singleVendorArray')

  const getClosureVehiclesData = () => {
    IfoodsExpenseClosureService.getVehicleReadyToSettlementClosure().then((res) => {
      closureData = res.data.data

      console.log(closureData, 'getVehicleReadyToSettlementClosure')

      setFetch(true)

      let rowDataList = []
      const filterData = closureData.filter(
        (data) => user_locations.indexOf(data.vehicle_location_id) != -1
      )

      setSearchFilterData(filterData)

      filterData.map((data, index) => {
        if (data.closure_info && data.closure_info.created_at_date) {
        rowDataList.push({
          S_NO: index + 1,
          Ifoods_Location: data.vehicle_location_info.location,
          Vendor_Name: data.ifoods_Vendor_info.vendor_name,
          purpose: data.purpose == 1 ? 'FG-Sales' : 'FG-STO',
          Vendor_Code: data.ifoods_Vendor_info.vendor_code,
          Vendor_Number: data.ifoods_Vendor_info.vendor_contact_no,
          Tripsheet: data.tripsheet_info.ifoods_tripsheet_no,
          // Shipment_No: data.tripsheet_info.shipment_po,
          GateIn_Date: data.created_at,
          Tripsheet_Date: data.tripsheet_info.created_at,
          Expense_Date: data.closure_info.created_at_date,
          Vehicle_No: data.ifoods_Vehicle_info.vehicle_number,
          Driver_Name: data.driver_name,
          Driver_Number: data.driver_number,
          Running_Km: data.closure_info.runningkm,
          Total_Expenses: data.closure_info.total_expenses,
          budget_km_master: data.ifoods_Salesfreight_info.budget_km,
          budget_freight_master: data.ifoods_Salesfreight_info.budget_km_freight,
          freight_per_km_master: data.ifoods_Salesfreight_info.freight_per_km,
          Screen_Duration: data.vehicle_current_position_updated_time,
          Overall_Duration: data.created_at,
          Tripsheet_No: (
            <Link
              className="text-black"
              target="_blank"
              to={`/IfoodsPaymentSubmission/${data.closure_info.closure_id}`}
            >
              <u>
                <strong>{data.tripsheet_info[0].ifoods_tripsheet_no}</strong>
              </u>
            </Link>
          ),
          Action: (
            <CButton className="btn btn-success btn-sm me-md-1">
              <Link
                className="text-white"
                to={`/IfoodsExpenseClosure/${data.closure_info.closure_id}`}
              >
                <i className="fa fa-eye" aria-hidden="true"></i>
              </Link>
            </CButton>
          ),
        })
     } })

      setRowData(rowDataList)
    })
  }

  useEffect(() => {
    getClosureVehiclesData()
  }, [])

  const columns = [
    {
      name: 'S.No',
      selector: (row) => row.S_NO,
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
      name: 'Location',
      selector: (row) => row.Ifoods_Location,
      sortable: true,
      center: true,
    },
    {
      name: 'Loading Point In',
      selector: (row) => row.GateIn_Date,
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
      name: 'Purpose',
      selector: (row) => row.purpose,
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
      name: 'Running KM',
      selector: (row) => row.Running_Km,
      // sortable: true,
      center: true,
    },
    {
      name: 'Total Freight',
      selector: (row) => row.Total_Expenses,
      // sortable: true,
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

  /* Report Variables */
  const [reportVehicle, setReportVehicle] = useState(0)
  const [reportLocation, setReportLocation] = useState(0)
  const [reportVendor, setReportVendor] = useState(0)

  const onChangeFilter = (event, event_type) => {
    var selected_value = event.value
    console.log(selected_value, 'selected_value')

    if (event_type == 'depo_vehicle') {
      if (selected_value) {
        setReportVehicle(selected_value)
      } else {
        setReportVehicle(0)
      }
    } else if (event_type == 'ifoods_purpose') {
      if (selected_value) {
        setReportLocation(selected_value)
      } else {
        setReportLocation(0)
      }
    } else if (event_type == 'ifoods_vendor') {
      if (selected_value) {
        setReportVendor(selected_value)
      } else {
        setReportVendor(0)
      }
    }
  }

  const [tdsTaxData, setTdsTaxData] = useState([])
  useEffect(() => {
    /* section for getting TDS Tax Type Lists from database */
    DefinitionsListApi.visibleDefinitionsListByDefinition(3).then((response) => {
      let viewData = response.data.data
      // console.log(viewData,'viewData')
      setTdsTaxData(viewData)
    })
  }, [])

  const getTdsTax = (code) => {
    let tds_text = '-'
    tdsTaxData.map((val, ind) => {
      if (val.definition_list_code == code) {
        tds_text = val.definition_list_name
      }
    })
    return tds_text
  }

  const loadTripPaymentSubmission = (type) => {
    console.log('loadTripPaymentSubmission--' + type)

    if (defaultDate == null) {
      setFetch(true)
      toast.warning('Date Filter Should not be empty..!')
      return false
    } else if (
      defaultDate == null &&
      reportVehicle == 0 &&
      reportShipmentNo == 0 &&
      reportTSNo == 0 &&
      reportShipmentStatus == 0 &&
      reportLocation == 0
    ) {
      setFetch(true)
      toast.warning('Choose atleast one filter type..!')
      return false
    }
    let report_form_data = new FormData()

    report_form_data.append('date_between', defaultDate)
    report_form_data.append('vehicle_id', reportVehicle)
    report_form_data.append('purpose', reportLocation)
    report_form_data.append('vendor_id', reportVendor)
    console.log(report_form_data)
    console.log(defaultDate, 'defaultDate')
    console.log(reportVehicle, 'reportVehicle')
    console.log(reportLocation, 'reportLocation')
    console.log(reportVendor, 'reportVendor')

    IfoodsExpenseClosureService.sentPaymentSubmissionDataForFilter(report_form_data).then((res) => {
      //   console.log(res, 'res')
      closureData = res.data.data
      console.log(closureData, 'sentPaymentSubmissionDataForFilter')
      setFetch(true)

      let rowDataList = []
      const filterData1 = closureData.filter(
        (data) => user_locations.indexOf(data.vehicle_location_id) != -1
      )

      setSearchFilterData(filterData1)

      filterData1.map((data, index) => {
        if (data.closure_info && data.closure_info.created_at_date) {
        rowDataList.push({
          S_NO: index + 1,
          Ifoods_Location: data.vehicle_location_info.location,
          Vendor_Name: data.ifoods_Vendor_info.vendor_name,
          Vendor_Code: data.ifoods_Vendor_info.vendor_code,
          Vendor_Number: data.ifoods_Vendor_info.vendor_contact_no,
          Tripsheet: data.tripsheet_info[0].ifoods_tripsheet_no,
          purpose: data.purpose == 1 ? 'FG-Sales' : 'FG-STO',
          GateIn_Date: data.created_at,
          Tripsheet_Date: data.tripsheet_info.created_at,
          Expense_Date: data.closure_info.created_at_date,
          Vehicle_No: data.ifoods_Vehicle_info.vehicle_number,
          Driver_Name: data.driver_name,
          Driver_Number: data.driver_number,
          Running_Km: data.closure_info.runningkm,
          Total_Expenses: data.closure_info.total_expenses,
          budget_km_master: data.ifoods_Salesfreight_info.budget_km,
          budget_freight_master: data.ifoods_Salesfreight_info.budget_km_freight,
          freight_per_km_master: data.ifoods_Salesfreight_info.freight_per_km,

          Screen_Duration: data.vehicle_current_position_updated_time,
          Overall_Duration: data.created_at,
          Tripsheet_No: (
            <Link
              className="text-black"
              target="_blank"
              to={`/IfoodsExpenseClosure/${data.closure_info.closure_id}`}
            >
              <u>
                <strong>{data.tripsheet_info[0].ifoods_tripsheet_no}</strong>
              </u>
            </Link>
          ),

          Action: (
            <CButton className="btn btn-success btn-sm me-md-1">
              <Link
                className="text-white"
                to={`/IfoodsExpenseClosure/${data.closure_info.closure_id}`}
              >
                <i className="fa fa-eye" aria-hidden="true"></i>
              </Link>
            </CButton>
          ),
        })
     } })
    
      setRowData(rowDataList)
      // setPending(false)
    })

    if (type == '1') {
      loadTripPaymentSubmission(0)
    }
  }

  const totalFreightTripsheets = (data) => {
    let amount = 0
    let total_amount = 0
    // console.log(data,'totalFreightTripsheets')
    data.map((val, ind) => {
      // amount += val.shipment_info.freight_type == '2' ? Number(parseFloat(val.shipment_info.shipment_depo_actual_freight_amount).toFixed(3)) : Number(parseFloat(val.shipment_info.shipment_depo_budget_freight_amount).toFixed(3))
      amount += Number(parseFloat(val.closure_info.total_expenses).toFixed(3))
    })

    total_amount = Number(parseFloat(amount).toFixed(3))
    // setTotalFreightPayment(total_amount)
    return total_amount
  }

  const totalKmTripsheets = (data) => {
    let amount = 0
    let total_amountkm = 0
    // console.log(data,'totalFreightTripsheets')
    data.map((val, ind) => {
      // amount += val.shipment_info.freight_type == '2' ? Number(parseFloat(val.shipment_info.shipment_depo_actual_freight_amount).toFixed(3)) : Number(parseFloat(val.shipment_info.shipment_depo_budget_freight_amount).toFixed(3))
      amount += Number(parseFloat(val.closure_info.runningkm).toFixed(3))
    })

    total_amountkm = Number(parseFloat(amount).toFixed(3))
    // setTotalFreightPayment(total_amount)
    return total_amountkm
  }

  const additioalExpense = (data) => {
    let amount = 0
    let total_expense = 0

    data.map((val, ind) => {
      amount += Number(parseFloat(val.closure_info.total_expenses).toFixed(3))
    })

    total_expense = Number(parseFloat(amount).toFixed(3))
    return total_expense
  }

  const submitPayment = () => {
    console.log(singleVendorArray, 'singleVendorArray')
    var trip_payment_array = []
    var trip_array = []
    singleVendorArray.map((map_data, map_index) => {
      trip_payment_array.push({
        parking_id: map_data.ifoods_parking_yard_gate_id,
        trip_id: map_data.tripsheet_sheet_id,
        trip_no: map_data.tripsheet_info.ifoods_tripsheet_no,
      })
      trip_array.push(map_data.tripsheet_sheet_id)
    })

    let tfp = totalFreightTripsheets(tripPaymentsArray)

    let payment_submission_data = new FormData()
    payment_submission_data.append('trip_array', JSON.stringify(trip_array))
    payment_submission_data.append('trip_array_data', JSON.stringify(trip_payment_array))
    payment_submission_data.append('created_by', user_id)
    payment_submission_data.append('remarks', message)
    payment_submission_data.append('updated_expense', values.add_expense ? values.add_expense : '0')

    payment_submission_data.append('vendor_id', singleVendorArray[0].vendor_id)
    payment_submission_data.append(
      'vendor_code',
      singleVendorArray[0].ifoods_Vendor_Code_info.vendor_code
    )
    payment_submission_data.append('running_km', singleVendorArray[0].closure_info.runningkm)
    // if ( singleVendorArray[0].ifoods_Salesfreight_info.freight_per_km) {
    if (
      totalKmTripsheets(tripPaymentsArray) >=
      singleVendorArray[0].ifoods_Salesfreight_info.budget_km
    ) {
      payment_submission_data.append(
        'freight_amount',
        Number(singleVendorArray[0].ifoods_Salesfreight_info.budget_km_freight) +
          // Number(singleVendorArray[0].closure_info.total_expenses) +
          (Number(totalKmTripsheets(tripPaymentsArray)) -
            Number(singleVendorArray[0].ifoods_Salesfreight_info.budget_km)) *
            Number(singleVendorArray[0].ifoods_Salesfreight_info.freight_per_km) +
          Number(additioalExpense(tripPaymentsArray)) +
          Number(values.add_expense) ?   Number(singleVendorArray[0].ifoods_Salesfreight_info.budget_km_freight) +
          // Number(singleVendorArray[0].closure_info.total_expenses) +
          (Number(totalKmTripsheets(tripPaymentsArray)) -
            Number(singleVendorArray[0].ifoods_Salesfreight_info.budget_km)) *
            Number(singleVendorArray[0].ifoods_Salesfreight_info.freight_per_km) +
          Number(additioalExpense(tripPaymentsArray)) +
          Number(values.add_expense) :  Number(singleVendorArray[0].ifoods_Salesfreight_info.budget_km_freight) +
          // Number(singleVendorArray[0].closure_info.total_expenses) +
          (Number(totalKmTripsheets(tripPaymentsArray)) -
            Number(singleVendorArray[0].ifoods_Salesfreight_info.budget_km)) *
            Number(singleVendorArray[0].ifoods_Salesfreight_info.freight_per_km) +
          Number(additioalExpense(tripPaymentsArray)) 
      )
    }

    if (
      totalKmTripsheets(tripPaymentsArray) < singleVendorArray[0].ifoods_Salesfreight_info.budget_km
    ) {
      payment_submission_data.append(
        'freight_amount',
        Number(singleVendorArray[0].ifoods_Salesfreight_info.budget_km_freight) +
          Number(additioalExpense(tripPaymentsArray)) +
          Number(values.add_expense) ?Number(singleVendorArray[0].ifoods_Salesfreight_info.budget_km_freight) +
          Number(additioalExpense(tripPaymentsArray)) +
          Number(values.add_expense):Number(singleVendorArray[0].ifoods_Salesfreight_info.budget_km_freight) +
          Number(additioalExpense(tripPaymentsArray)) 
      )
    }
    if (singleVendorArray[0].ifoods_Vendor_info.freight_type == 2) {
      payment_submission_data.append(
        'freight_amount',
        Number(singleVendorArray[0].ifoods_Salesfreight_info.budget_km_freight) +
          Number(additioalExpense(tripPaymentsArray)) +
          Number(values.add_expense) ?  Number(singleVendorArray[0].ifoods_Salesfreight_info.budget_km_freight) +
          Number(additioalExpense(tripPaymentsArray)) +
          Number(values.add_expense) :  Number(singleVendorArray[0].ifoods_Salesfreight_info.budget_km_freight) +
          Number(additioalExpense(tripPaymentsArray)) 
      )
    }
    if (singleVendorArray[0].purpose == 2) {
      payment_submission_data.append(
        'freight_amount',
        Number(additioalExpense(tripPaymentsArray)) + Number(values.add_expense) ?
        Number(additioalExpense(tripPaymentsArray)) + Number(values.add_expense) :
        Number(additioalExpense(tripPaymentsArray)) 
      )
    }

    IfoodsExpenseClosureService.sentPaymentSubmissionData(payment_submission_data)
      .then((res) => {
        let payment_reference = res.data.invoice_reference
        setFetch(true)
        if (res.status == 200) {
          Swal.fire({
            icon: 'success',
            title: 'Payment Submission Request Sent Successfully!',
            text: 'Payment Invoice Reference : ' + payment_reference,
            confirmButtonText: 'OK',
          }).then(function () {
            window.location.reload(false)
            navigation('/IfoodsPaymentSubmissionHome')
          })
        } else if (res.status == 201) {
          Swal.fire({
            title: res.data.message,
            icon: 'warning',
            confirmButtonText: 'OK',
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
      })
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
                      <CFormLabel htmlFor="VNum">Vendor Name</CFormLabel>
                      <SearchSelectComponent
                        size="sm"
                        className="mb-2"
                        onChange={(e) => {
                          onChangeFilter(e, 'ifoods_vendor')
                        }}
                        label="Select Vendor"
                        noOptionsMessage="Vendor Not found"
                        search_type="ifoods_payment_submission_contractor"
                        search_data={searchFilterData}
                      />
                    </CCol>
                    {reportVendor == 1 && (
                      <>
                        <CCol xs={12} md={3}>
                          <CFormLabel htmlFor="VNum">Trip Purpose</CFormLabel>
                          <SearchSelectComponent
                            size="sm"
                            className="mb-2"
                            onChange={(e) => {
                              onChangeFilter(e, 'ifoods_purpose')
                            }}
                            label="Select Purpoes"
                            noOptionsMessage="Purpoes Not found"
                            search_type="ifoods_purpose"
                            search_data={searchFilterData}
                          />
                        </CCol>
                        <CCol xs={12} md={3}>
                          <CFormLabel htmlFor="VNum">Month Filter</CFormLabel>
                          <DateRangePicker
                            style={{ width: '100rem', height: '100%', borderColor: 'black' }}
                            className="mb-2"
                            id="start_date"
                            name="end_date"
                            format="dd-MM-yyyy"
                            value={defaultDate}
                            // oneTap
                            showOneCalendar
                            // hoverRange="month"
                            ranges={[
                              {
                                startDate: new Date(),
                                endDate: maxDate,
                                key: '32days',
                              },
                            ]}
                            onChange={setDefaultDate}
                          />
                          {/* <DateRangePicker
                            style={{ width: '100rem', height: '100%', borderColor: 'black' }}
                            className="mb-2"
                            id="start_date"
                            name="end_date"
                            format="dd-MM-yyyy"
                            value={defaultDate}
                            onChange={setDefaultDate}
                            
                         /> */}
                        </CCol>
                      </>
                    )}
                    {reportVendor != 1 && (
                      <>
                        <CCol xs={12} md={3}>
                          <CFormLabel htmlFor="VNum">Trip Purpose</CFormLabel>
                          <SearchSelectComponent
                            size="sm"
                            className="mb-2"
                            onChange={(e) => {
                              onChangeFilter(e, 'ifoods_purpose')
                            }}
                            label="Select Purpose"
                            noOptionsMessage="Purpose Not found"
                            search_type="ifoods_purpose"
                            search_data={searchFilterData}
                          />
                        </CCol>
                        <CCol xs={12} md={3}>
                          <CFormLabel htmlFor="VNum">Loading Point - In Date Filter</CFormLabel>
                          <DateRangePicker
                            style={{ width: '100rem', height: '100%', borderColor: 'black' }}
                            className="mb-2"
                            id="start_date"
                            name="end_date"
                            format="dd-MM-yyyy"
                            value={defaultDate}
                            // value={''}
                            onChange={setDefaultDate}
                          />
                        </CCol>
                      </>
                    )}

                  
                        <CCol xs={12} md={3}>
                          <CFormLabel htmlFor="VNum">Vehicle Number</CFormLabel>
                          <SearchSelectComponent
                            size="sm"
                            className="mb-2"
                            onChange={(e) => {
                              onChangeFilter(e, 'depo_vehicle')
                            }}
                            label="Select Vehicle Number"
                            noOptionsMessage="Vehicle Not found"
                            search_type="ifoods_payment_submission_vehicle_number"
                            search_data={searchFilterData}
                          />
                        </CCol>
                   
                  </CRow>
                  <CRow className="mt-3">
                    <CCol style={{ display: 'flex', justifyContent: 'end' }}>
                      <CButton
                        size="sm"
                        color="primary"
                        className="mx-3 px-3 text-white"
                        onClick={() => {
                          setFetch(false)
                          loadTripPaymentSubmission(1)
                        }}
                      >
                        Filter
                      </CButton>
                      <CButton
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
                      </CButton>
                    </CCol>
                  </CRow>
                  <CRow className="mt-3">
                    {searchFilterData.length > 0 && (
                      <>
                        <CCol xs={12} md={3}>
                          <CFormLabel htmlFor="VNum">Select Tripsheets For Payment</CFormLabel>
                          <TripPaymentSubmissionComponent
                            size="sm"
                            name="tripPaymentSubmission"
                            id="tripPaymentSubmission"
                            onFocus={onFocus}
                            onBlur={onBlur}
                            onChange={handleMultipleChange}
                            selectedValue={values.tripPaymentSubmission}
                            isMultiple={true}
                            label="Select Tripsheet"
                            noOptionsMessage="Tripsheet not found"
                            search_type="payment_submission"
                            search_data={searchFilterData}
                          />
                        </CCol>

                        <CCol className="" xs={12} sm={9} md={3}>
                          <CButton
                            onClick={() => {
                              checkModalDisplay()
                              // setAssignPSModal(!assignPSModal)
                            }}
                            color="warning"
                            className="mt-4 text-white"
                            size="sm"
                            id="inputAddress"
                          >
                            <span className="float-start">
                              <i className="" aria-hidden="true"></i> &nbsp;Check
                            </span>
                          </CButton>
                          <CButton
                            onClick={() => {
                              window.location.reload(false)
                            }}
                            style={{ marginLeft: '5px' }}
                            color="primary"
                            className="mt-4 text-white"
                            size="sm"
                            id="inputAddress"
                          >
                            <span className="float-start">
                              <i className="fa fa-refresh" aria-hidden="true"></i>
                            </span>
                          </CButton>

                          {/* Assign Payment Modal */}
                          <CModal
                            size="xl"
                            backdrop="static"
                            scrollable
                            visible={assignPSModal}
                            onClose={() => setAssignPSModal(false)}
                          >
                            <CModalHeader>
                              <CModalTitle>
                                <b>Tripsheets : Payment Submission</b>
                              </CModalTitle>
                            </CModalHeader>
                            <CModalBody>
                              {tripPaymentsArray.length > 0 ? (
                                // <CTable bordered borderColor="primary">
                                <CTable striped hover>
                                  {singleVendorArray.length > 0 && (
                                    <CRow className="">
                                      <CCol md={3}>
                                        <CFormLabel htmlFor="cname">Vendor Location</CFormLabel>
                                        <CFormInput
                                          style={{ fontWeight: 'bolder' }}
                                          name="cname"
                                          size="sm"
                                          id="cname"
                                          value={
                                            singleVendorArray[0].vehicle_location_info.location
                                          }
                                          readOnly
                                        />
                                      </CCol>

                                      <CCol md={3}>
                                        <CFormLabel htmlFor="cmn">Vendor Name</CFormLabel>
                                        <CFormInput
                                          style={{ fontWeight: 'bolder' }}
                                          name="cmn"
                                          size="sm"
                                          id="cmn"
                                          value={
                                            singleVendorArray[0].ifoods_Vendor_info.vendor_name
                                          }
                                          readOnly
                                        />
                                      </CCol>

                                      <CCol md={3}>
                                        <CFormLabel htmlFor="cmn">
                                          Vendor Code / Mobile No.
                                        </CFormLabel>
                                        <CFormInput
                                          style={{ fontWeight: 'bolder' }}
                                          name="cmn"
                                          size="sm"
                                          id="cmn"
                                          value={`${singleVendorArray[0].ifoods_Vendor_Code_info.vendor_code} / ${singleVendorArray[0].ifoods_Vendor_info.vendor_contact_no}`}
                                          readOnly
                                        />
                                      </CCol>

                                      <CCol md={3}>
                                        <CFormLabel htmlFor="cmn">Vendor Freight Type</CFormLabel>
                                        <CFormInput
                                          style={{ fontWeight: 'bolder' }}
                                          name="cmn"
                                          size="sm"
                                          id="cmn"
                                          value={
                                            singleVendorArray[0].ifoods_Vendor_info.freight_type ==
                                            '2'
                                              ? 'Actual'
                                              : 'Budget'
                                          }
                                          readOnly
                                        />
                                      </CCol>

                                      <CCol md={3}>
                                        <CFormLabel htmlFor="cmn">GST Tax Type</CFormLabel>
                                        <CFormInput
                                          style={{ fontWeight: 'bolder' }}
                                          name="cmn"
                                          size="sm"
                                          id="cmn"
                                          value={getGstTax(
                                            singleVendorArray[0].ifoods_Vendor_info.gst_tax_type
                                          )}
                                          readOnly
                                        />
                                      </CCol>

                                      <CCol md={3}>
                                        <CFormLabel htmlFor="cmn">TDS Tax Type</CFormLabel>
                                        <CFormInput
                                          style={{ fontWeight: 'bolder' }}
                                          name="cmn"
                                          size="sm"
                                          id="cmn"
                                          value={getTdsTax(
                                            singleVendorArray[0].ifoods_Vendor_info.tds_tax_type
                                          )}
                                          readOnly
                                        />
                                      </CCol>

                                      <CCol md={3}>
                                        <CFormLabel htmlFor="cmn">Actual KM</CFormLabel>
                                        <CFormInput
                                          style={{ fontWeight: 'bolder' }}
                                          name="cmn"
                                          size="sm"
                                          id="cmn"
                                          value={totalKmTripsheets(tripPaymentsArray)}
                                          readOnly
                                        />
                                      </CCol>
                                      {singleVendorArray[0].purpose == 1 && (
                                        <>
                                          {singleVendorArray[0].purpose == 1 &&
                                            singleVendorArray[0].ifoods_Vendor_info.freight_type ==
                                              1 && (
                                              <>
                                                <CCol md={3}>
                                                  <CFormLabel htmlFor="cmn">Budgeted KM</CFormLabel>
                                                  <CFormInput
                                                    style={{ fontWeight: 'bolder' }}
                                                    name="cmn"
                                                    size="sm"
                                                    id="cmn"
                                                    value={
                                                      singleVendorArray[0].ifoods_Salesfreight_info
                                                        .budget_km
                                                    }
                                                    readOnly
                                                  />
                                                </CCol>
                                                <CCol md={3}>
                                                  <CFormLabel htmlFor="cmn">
                                                    Budgeted Freight
                                                  </CFormLabel>
                                                  <CFormInput
                                                    style={{ fontWeight: 'bolder' }}
                                                    name="cmn"
                                                    size="sm"
                                                    id="cmn"
                                                    value={
                                                      singleVendorArray[0].ifoods_Salesfreight_info
                                                        .budget_km_freight
                                                    }
                                                    readOnly
                                                  />
                                                </CCol>

                                                {totalKmTripsheets(tripPaymentsArray) >=
                                                  singleVendorArray[0].ifoods_Salesfreight_info
                                                    .budget_km && (
                                                  <>
                                                    <CCol md={3}>
                                                      <CFormLabel htmlFor="cmn">
                                                        Excess KM
                                                      </CFormLabel>
                                                      <CFormInput
                                                        style={{ fontWeight: 'bolder' }}
                                                        name="cmn"
                                                        size="sm"
                                                        id="budget_freight"
                                                        value={
                                                          Number(
                                                            totalKmTripsheets(tripPaymentsArray)
                                                          ) -
                                                          Number(
                                                            singleVendorArray[0]
                                                              .ifoods_Salesfreight_info.budget_km
                                                          )
                                                        }
                                                        readOnly
                                                      />
                                                    </CCol>
                                                    <CCol md={3}>
                                                      <CFormLabel htmlFor="cmn">
                                                        Excess Freight
                                                      </CFormLabel>
                                                      <CFormInput
                                                        style={{ fontWeight: 'bolder' }}
                                                        name="cmn"
                                                        size="sm"
                                                        id="budget_freight"
                                                        value={
                                                          (Number(
                                                            totalKmTripsheets(tripPaymentsArray)
                                                          ) -
                                                            Number(
                                                              singleVendorArray[0]
                                                                .ifoods_Salesfreight_info.budget_km
                                                            )) *
                                                          Number(
                                                            singleVendorArray[0]
                                                              .ifoods_Salesfreight_info
                                                              .freight_per_km
                                                          )
                                                        }
                                                        readOnly
                                                      />
                                                    </CCol>
                                                    <CCol md={3}>
                                                      <CFormLabel htmlFor="cmn">
                                                        Additional Expense
                                                      </CFormLabel>
                                                      <CFormInput
                                                        style={{ fontWeight: 'bolder' }}
                                                        name="cmn"
                                                        size="sm"
                                                        id="budget_freight"
                                                        value={Number(
                                                          additioalExpense(tripPaymentsArray)
                                                        )}
                                                        readOnly
                                                      />
                                                    </CCol>
                                                    <CCol md={3}>
                                                      <CFormLabel htmlFor="cmn">
                                                        Total Freight
                                                      </CFormLabel>
                                                      <CFormInput
                                                        style={{ fontWeight: 'bolder' }}
                                                        name="cmn"
                                                        size="sm"
                                                        id="total_freight"
                                                        value={
                                                          Number(
                                                            singleVendorArray[0]
                                                              .ifoods_Salesfreight_info
                                                              .budget_km_freight
                                                          ) +
                                                          (Number(
                                                            totalKmTripsheets(tripPaymentsArray)
                                                          ) -
                                                            Number(
                                                              singleVendorArray[0]
                                                                .ifoods_Salesfreight_info.budget_km
                                                            )) *
                                                            Number(
                                                              singleVendorArray[0]
                                                                .ifoods_Salesfreight_info
                                                                .freight_per_km
                                                            ) +
                                                          Number(
                                                            additioalExpense(tripPaymentsArray)
                                                          ) +
                                                          Number(values.add_expense)
                                                            ? Number(
                                                                singleVendorArray[0]
                                                                  .ifoods_Salesfreight_info
                                                                  .budget_km_freight
                                                              ) +
                                                              (Number(
                                                                totalKmTripsheets(tripPaymentsArray)
                                                              ) -
                                                                Number(
                                                                  singleVendorArray[0]
                                                                    .ifoods_Salesfreight_info
                                                                    .budget_km
                                                                )) *
                                                                Number(
                                                                  singleVendorArray[0]
                                                                    .ifoods_Salesfreight_info
                                                                    .freight_per_km
                                                                ) +
                                                              Number(
                                                                additioalExpense(tripPaymentsArray)
                                                              ) +
                                                              Number(values.add_expense)
                                                            : Number(
                                                                singleVendorArray[0]
                                                                  .ifoods_Salesfreight_info
                                                                  .budget_km_freight
                                                              ) +
                                                              (Number(
                                                                totalKmTripsheets(tripPaymentsArray)
                                                              ) -
                                                                Number(
                                                                  singleVendorArray[0]
                                                                    .ifoods_Salesfreight_info
                                                                    .budget_km
                                                                )) *
                                                                Number(
                                                                  singleVendorArray[0]
                                                                    .ifoods_Salesfreight_info
                                                                    .freight_per_km
                                                                ) +
                                                              Number(
                                                                additioalExpense(tripPaymentsArray)
                                                              )
                                                        }
                                                        readOnly
                                                      />
                                                    </CCol>
                                                  </>
                                                )}
                                              </>
                                            )}
                                        </>
                                      )}
                                      {singleVendorArray[0].closure_info.freight_charges && (
                                        <>
                                          {singleVendorArray[0].purpose == 1 &&
                                            singleVendorArray[0].ifoods_Vendor_info.freight_type ==
                                              1 && (
                                              <>
                                                {totalKmTripsheets(tripPaymentsArray) <
                                                  singleVendorArray[0].ifoods_Salesfreight_info
                                                    .budget_km && (
                                                  <>
                                                    <CCol md={3}>
                                                      <CFormLabel htmlFor="cmn">
                                                        Additional Expense
                                                      </CFormLabel>
                                                      <CFormInput
                                                        style={{ fontWeight: 'bolder' }}
                                                        name="cmn"
                                                        size="sm"
                                                        id="budget_freight"
                                                        value={Number(
                                                          additioalExpense(tripPaymentsArray)
                                                        )}
                                                        readOnly
                                                      />
                                                    </CCol>
                                                    <CCol md={3}>
                                                      <CFormLabel htmlFor="cmn">
                                                        Total Freight
                                                      </CFormLabel>
                                                      <CFormInput
                                                        style={{ fontWeight: 'bolder' }}
                                                        name="cmn"
                                                        size="sm"
                                                        id="total_freight"
                                                        value={
                                                          Number(
                                                            singleVendorArray[0]
                                                              .ifoods_Salesfreight_info
                                                              .budget_km_freight
                                                          ) +
                                                          Number(
                                                            additioalExpense(tripPaymentsArray)
                                                          ) +
                                                          Number(values.add_expense)
                                                            ? Number(
                                                                singleVendorArray[0]
                                                                  .ifoods_Salesfreight_info
                                                                  .budget_km_freight
                                                              ) +
                                                              Number(
                                                                additioalExpense(tripPaymentsArray)
                                                              ) +
                                                              Number(values.add_expense)
                                                            : Number(
                                                                singleVendorArray[0]
                                                                  .ifoods_Salesfreight_info
                                                                  .budget_km_freight
                                                              ) +
                                                              Number(
                                                                additioalExpense(tripPaymentsArray)
                                                              )
                                                        }
                                                        readOnly
                                                      />
                                                    </CCol>
                                                  </>
                                                )}
                                              </>
                                            )}
                                        </>
                                      )}
                                      {singleVendorArray[0].ifoods_Vendor_info.freight_type ==
                                        2 && (
                                        <>
                                          <CCol md={3}>
                                            <CFormLabel htmlFor="cmn">
                                              Additional Expense
                                            </CFormLabel>
                                            <CFormInput
                                              style={{ fontWeight: 'bolder' }}
                                              name="cmn"
                                              size="sm"
                                              id="budget_freight"
                                              value={
                                                Number(
                                                  singleVendorArray[0].closure_info.total_expenses
                                                ) -
                                                Number(
                                                  singleVendorArray[0].closure_info.freight_charges
                                                )
                                              }
                                              readOnly
                                            />
                                          </CCol>
                                          <CCol md={3}>
                                            <CFormLabel htmlFor="cmn">Total Freight</CFormLabel>
                                            <CFormInput
                                              style={{ fontWeight: 'bolder' }}
                                              name="cmn"
                                              size="sm"
                                              id="total_freight"
                                              value={
                                                Number(
                                                  singleVendorArray[0].ifoods_Salesfreight_info
                                                    .budget_km_freight
                                                ) +
                                                Number(
                                                  additioalExpense(tripPaymentsArray) +
                                                    Number(values.add_expense)
                                                )
                                                  ? Number(
                                                      singleVendorArray[0].ifoods_Salesfreight_info
                                                        .budget_km_freight
                                                    ) +
                                                    Number(
                                                      additioalExpense(tripPaymentsArray) +
                                                        Number(values.add_expense)
                                                    )
                                                  : Number(
                                                      singleVendorArray[0].ifoods_Salesfreight_info
                                                        .budget_km_freight
                                                    ) + Number(additioalExpense(tripPaymentsArray))
                                              }
                                              readOnly
                                            />
                                          </CCol>
                                        </>
                                      )}

                                      {singleVendorArray[0].purpose == 2 && (
                                        <>
                                          <CCol md={3}>
                                            <CFormLabel htmlFor="cmn">
                                              Additional Expense
                                            </CFormLabel>
                                            <CFormInput
                                              style={{ fontWeight: 'bolder' }}
                                              name="cmn"
                                              size="sm"
                                              id="budget_freight"
                                              value={
                                                Number(
                                                  singleVendorArray[0].closure_info.total_expenses
                                                ) -
                                                Number(
                                                  singleVendorArray[0].closure_info.freight_charges
                                                )
                                              }
                                              readOnly
                                            />
                                          </CCol>
                                          <CCol md={3}>
                                            <CFormLabel htmlFor="cmn">Total Freight</CFormLabel>
                                            <CFormInput
                                              style={{ fontWeight: 'bolder' }}
                                              name="cmn"
                                              size="sm"
                                              id="total_freight"
                                              value={
                                                Number(additioalExpense(tripPaymentsArray)) +
                                                Number(values.add_expense)
                                                  ? Number(additioalExpense(tripPaymentsArray)) +
                                                    Number(values.add_expense)
                                                  : Number(additioalExpense(tripPaymentsArray))
                                              }
                                              readOnly
                                            />
                                          </CCol>
                                        </>
                                      )}

                                      <CCol md={3}>
                                        <CFormLabel htmlFor="remarks">
                                          Updated Addtional Freight
                                        </CFormLabel>
                                        <CFormInput
                                          size="sm"
                                          name="add_expense"
                                          id="add_expense"
                                         // required
                                          defaultValue={0}
                                          value={values.add_expense}
                                          onChange={handleChange}
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
                                  )}

                                  <CTableHead className="mt-2" style={{ background: 'skyblue' }}>
                                    <CTableRow>
                                      <CTableHeaderCell scope="col" style={{ width: '5%' }}>
                                        S.No
                                      </CTableHeaderCell>
                                      <CTableHeaderCell scope="col" style={{ width: '15%' }}>
                                        Tripsheet No.
                                      </CTableHeaderCell>
                                      {/* <CTableHeaderCell scope="col" style={{width: '15%'}}>Tripsheet Date</CTableHeaderCell> */}
                                      <CTableHeaderCell scope="col" style={{ width: '15%' }}>
                                        Loading Point-In Date
                                      </CTableHeaderCell>
                                      {/* <CTableHeaderCell scope="col" style={{width: '30%'}}>Vendor</CTableHeaderCell> */}
                                      <CTableHeaderCell scope="col" style={{ width: '15%' }}>
                                        Vehicle No.
                                      </CTableHeaderCell>
                                      <CTableHeaderCell scope="col" style={{ width: '15%' }}>
                                        Driver Name
                                      </CTableHeaderCell>
                                      <CTableHeaderCell scope="col" style={{ width: '15%' }}>
                                        Run KM.
                                      </CTableHeaderCell>
                                      <CTableHeaderCell scope="col" style={{ width: '15%' }}>
                                        Freight
                                      </CTableHeaderCell>
                                    </CTableRow>
                                  </CTableHead>
                                  <CTableBody>
                                    {tripPaymentsArray.map((val, ind) => {
                                      return (
                                        <CTableRow key={ind}>
                                          <CTableDataCell scope="col" style={{ width: '5%' }}>
                                            {ind + 1}
                                          </CTableDataCell>
                                          <CTableDataCell scope="col" style={{ width: '15%' }}>
                                            {val.tripsheet_info[0].ifoods_tripsheet_no}
                                          </CTableDataCell>
                                          <CTableDataCell scope="col" style={{ width: '15%' }}>
                                            {val.created_date}
                                          </CTableDataCell>

                                          <CTableDataCell scope="col" style={{ width: '15%' }}>
                                            {val.ifoods_Vehicle_info.vehicle_number}
                                          </CTableDataCell>
                                          <CTableDataCell scope="col" style={{ width: '15%' }}>
                                            {val.driver_name}
                                          </CTableDataCell>
                                          <CTableDataCell scope="col" style={{ width: '15%' }}>
                                            {val.closure_info.runningkm}
                                          </CTableDataCell>

                                          <CTableDataCell scope="col" style={{ width: '15%' }}>
                                            {val.closure_info.total_expenses}
                                          </CTableDataCell>
                                        </CTableRow>
                                      )
                                    })}
                                    <CTableRow size="xl">
                                      <CTableDataCell
                                        colSpan={75}
                                        scope="col"
                                        style={{ width: '260%', textAlign: 'end' }}
                                      >
                                        Actual KM
                                      </CTableDataCell>
                                      <CTableDataCell
                                        scope="col"
                                        style={{
                                          width: '00%',
                                          color: 'green',
                                          fontWeight: 'bold',
                                        }}
                                      >
                                        {totalKmTripsheets(tripPaymentsArray)}
                                      </CTableDataCell>
                                      <CTableDataCell
                                        colSpan={6}
                                        scope="col"
                                        style={{ width: '80%', textAlign: 'end' }}
                                      >
                                        Total Freight
                                      </CTableDataCell>
                                      <CTableDataCell
                                        scope="col"
                                        style={{
                                          width: '45%',
                                          color: 'green',
                                          fontWeight: 'bold',
                                        }}
                                      >
                                        {totalFreightTripsheets(tripPaymentsArray)}
                                      </CTableDataCell>
                                    </CTableRow>
                                  </CTableBody>
                                </CTable>
                              ) : (
                                <>Tripsheets Not Found / Invalid</>
                              )}
                              {/* <CRow>
                                  <CCol md={3}>
                                    <CFormLabel htmlFor="cmn">GST Tax Type</CFormLabel>
                                    <CFormInput
                                      style={{fontWeight: 'bolder'}}
                                      name="cmn"
                                      size="sm"
                                      id="cmn"
                                      value={getGstTax(singleVendorArray[0].ifoods_Vendor_info.gst_tax_type)}
                                      readOnly
                                    />
                                  </CCol>

                                  <CCol md={3}>
                                    <CFormLabel htmlFor="cmn">TDS Tax Type</CFormLabel>
                                    <CFormInput
                                      style={{fontWeight: 'bolder'}}
                                      name="cmn"
                                      size="sm"
                                      id="cmn"
                                      value={getTdsTax(singleVendorArray[0].ifoods_Vendor_info.tds_tax_type)}
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
                                </CRow> */}
                            </CModalBody>

                            <CModalFooter>
                              <CButton
                                color="primary"
                                style={{ marginRight: '2%' }}
                                onClick={() => {
                                  setAssignPSModal(false)
                                  setFetch(false)
                                  submitPayment()
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
                        </CCol>
                      </>
                    )}
                    {/* <CCol className="" xs={12} sm={9} md={3}></CCol> */}
                    {/* <CCol xs={12} md={3} className="mt-4"> */}
                  </CRow>
                  <CustomTable
                    columns={columns}
                    pagination={false}
                    data={rowData}
                    fieldName={'Driver_Name'}
                    showSearchFilter={true}
                  />
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

export default IfoodsPaymentSubmissionHome
