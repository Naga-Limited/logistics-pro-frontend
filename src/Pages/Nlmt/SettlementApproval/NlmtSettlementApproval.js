/* eslint-disable prettier/prettier */
import {
  CButton,
  CCard,
  CCardImage,
  CCol,
  CFormInput,
  CFormLabel, 
  CFormTextarea,
  CInputGroup,
  CInputGroupText,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow, 
} from '@coreui/react'

import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import Loader from 'src/components/Loader'
import DefinitionsListApi from 'src/Service/Definitions/DefinitionsListApi'
import AccessDeniedComponent from 'src/components/commoncomponent/AccessDeniedComponent'
import JavascriptInArrayComponent from 'src/components/commoncomponent/JavascriptInArrayComponent'
import * as NlmtScreenAccessCodes from 'src/components/constants/NlmtScreenAccessCodes' 
import useFormDepoExpenseClosure from 'src/Hooks/useFormDepoExpenseClosure'
import LocationApi from 'src/Service/SubMaster/LocationApi'
import Swal from 'sweetalert2'
import CustomTable from 'src/components/customComponent/CustomTable'
import ExpenseIncomePostingDate from 'src/Pages/TripsheetClosure/Calculations/ExpenseIncomePostingDate'
import { GetDateTimeFormat } from 'src/Pages/Nlmt/CommonMethods/CommonMethods'
import FileSaver from 'file-saver'
import * as XLSX from 'xlsx'
import JavascriptDateCheckComponent from 'src/components/commoncomponent/JavascriptDateCheckComponent'
import NlmtTripSheetClosureService from 'src/Service/Nlmt/TripSheetClosure/NlmtTripSheetClosureService'

const NlmtSettlementApproval = () => {

  /*================== User Id & Location Fetch ======================*/
  const user_info_json = localStorage.getItem('user_info')
  const user_info = JSON.parse(user_info_json)
  const user_locations = []
  const navigation = useNavigate()

  // console.log(user_info)

  /* Get User Locations From Local Storage */
  user_info.location_info.map((data, index) => {
    user_locations.push(data.id)
  })

  const [reference, setReference] = useState('')
  const [invoicePostingDate, setInvoicePostingDate] = useState('')
  const [invoiceCopy, setInvoiceCopy] = useState('')
  const [tdsHaving, setTdsHaving] = useState(0)
  const REQ = () => <span className="text-danger"> * </span>

  const handleChangeInvoicePostingDate = (event) => {
    let vall = event.target.value
    console.log('handleChangeInvoicePostingDate', vall)
    setInvoicePostingDate(vall)
  }

  const border = {
    borderColor: '#b1b7c1',
  }

  const tdsRateFinder = (type, data) => {

    let frt = 0
    if(type == 1){
      frt = data.advance_payment_info.sap_freight_payment_amount
    } else {
      frt = data.trip_settlement_info.sap_expense_amount
    }
    console.log(frt,'tdsRateFinder-frt')
    return frt
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

  const balanceFreight = (a,b) => {

    if(!a || !b)
      return 0

    let freight = Number(parseFloat(a).toFixed(2))
    let advance = Number(parseFloat(b).toFixed(2))

    let frt = Number(parseFloat(freight - advance).toFixed(2))
    console.log(frt,'balanceFreight-frt')
    return frt

  }

  const exportToCSV = () => {
    // console.log(rowData,'exportCsvData')
    let dateTimeString = GetDateTimeFormat(1)
    let fileName = 'NLMT_Payment_Approval_' + dateTimeString
    const fileType =
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
    const fileExtension = '.xlsx'
    const ws = XLSX.utils.json_to_sheet(rowData)
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] }
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
    const data = new Blob([excelBuffer], { type: fileType })
    FileSaver.saveAs(data, fileName + fileExtension)
  }

  /* Get User Id From Local Storage */
  const user_id = user_info.user_id

  // console.log(user_locations)
  /*================== User Location Fetch ======================*/

  const Expense_Income_Posting_Date = ExpenseIncomePostingDate()

  const { id } = useParams()
  const [rowData, setRowData] = useState([])
  const [locationData, setLocationData] = useState([])

  /* ==================== Access Part Start ========================*/
  const [screenAccess, setScreenAccess] = useState(false)
  let page_no = NlmtScreenAccessCodes.NlmtClosureScreens.Nlmt_Payment_Approval

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

  const formValues = {
    halt_days: '',
    remarks: '',
    apremarks: '',
  }

  const [plantMasterData, setPlantMasterData] = useState([])
  useEffect(() => {
    /* section for getting Plant Master List For Location Name Display from database */
    DefinitionsListApi.visibleDefinitionsListByDefinition(12).then((response) => {
      console.log(response.data.data)
      setPlantMasterData(response.data.data)
    })
  }, [])

  /* Overall Journey Information Constants */
  const [pmData, setPMData] = useState([])

  const [visible, setVisible] = useState(false)
  const [tripPaymentDelete, setTripPaymentDelete] = useState(false)
  const [tripPaymentAllDelete, setTripPaymentAllDelete] = useState(false)
  const [tripIdToDelete, setTripIdToDelete] = useState('')
  const [tripNoToDelete, setTripNoToDelete] = useState('')
  const [paymentAmountToDelete, setPaymentAmountToDelete] = useState(0)
  const [shipmentIdToDelete, setShipmentIdToDelete] = useState('')

  const {
    values,
    errors,
    handleChange,
    isTouched,
    setIsTouched,
    setErrors,
    onFocus,
    handleSubmit,
    enableSubmit,
    onBlur,
  } = useFormDepoExpenseClosure(login, formValues)

  function login() {
    // alert('No Errors CallBack Called')
  }

  /* Display The Delivery Plant Name via Given Delivery Plant Code */
  const getLocationNameByCode = (code) => {
    console.log(code, 'code')
    console.log(locationData, 'filtered_location_data')
    let filtered_location_data = locationData.filter((c, index) => {
      if (c.location_code == code) {
        return true
      }
    })
    console.log(filtered_location_data, 'filtered_location_data')
    let locationName =
      filtered_location_data.length > 0 ? filtered_location_data[0].Location : 'Loading..'
    return locationName
  }

  useEffect(() => {
    LocationApi.getLocation().then((response) => {
      let viewData = response.data.data
      console.log(viewData, 'viewData')
      let rowDataList_location = []
      viewData.map((data, index) => {
        rowDataList_location.push({
          sno: index + 1,
          Location: data.location,
          location_code: data.id,
        })
      })
      setLocationData(rowDataList_location)
    })
  }, [id])

  const deleteTripAllPayment = () => {
    const formDataUpdate = new FormData()

    formDataUpdate.append('id', id)
    formDataUpdate.append('created_by', user_id)
    formDataUpdate.append('remarks', values.apremarks)
    NlmtTripSheetClosureService.rejectPaymentValidation(formDataUpdate)
      .then((res) => {
        console.log(res)
        setFetch(true)
        if (res.status == 200) {
          Swal.fire({
            title: 'Payment Validation Rejected Successfully!',
            icon: 'success',
            confirmButtonText: 'OK',
          }).then(function () {
            navigation('/NlmtSettlementApprovalTable')
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
          toast.warning('Shipment - Delivery Cannot Be Deleted From LP.. Kindly Contact Admin!')
        }
      })
      .catch((error) => {
        setFetch(true)
        // for (let value of formDataForDBUpdate.values()) {
        //   console.log(value)
        // }
        console.log(error)
        var object = error.response.data.errors
        var output = ''
        for (var property in object) {
          output += '*' + object[property] + '\n'
        }
        setError(output)
        setErrorModal(true)
      })
  }

  const [fetch, setFetch] = useState(false)
  const [vendorInfo, setVendorInfo] = useState([])

  const [errorModal, setErrorModal] = useState(false)
  const [error, setError] = useState({})

  /* ===================== The Constants Needed For First Render Part Start ===================== */

  const [settlementClosureData, setSettlementClosureData] = useState([])
  const [singleVendorArray, setSingleVendorArray] = useState([])

  /* ===================== The Constants Needed For First Render Part End ===================== */

  /* ===================== The Very First Render Part Start ===================== */

  useEffect(() => {
    NlmtTripSheetClosureService.getPaymentInfoById(id).then((res) => {
      let payment_info_id_data = res.data.data
      console.log(payment_info_id_data, 'payment_info_id_data')
      setSingleVendorArray(payment_info_id_data)
    })
  }, [id])
  console.log(singleVendorArray, 'singleVendorArray')

  const [totalTonnage, setTotalTonnage] = useState(0)
  const [tdsTaxData, setTdsTaxData] = useState([])
  useEffect(() => {
    /* section for getting TDS Tax Type Lists from database */
    DefinitionsListApi.visibleDefinitionsListByDefinition(3).then((response) => {
      let viewData = response.data.data
      console.log(viewData, 'viewData')
      setTdsTaxData(viewData)
    })
  }, [])

  const getTdsTax = (code) => {
    let tds_text = '-'
    tdsTaxData.map((val, ind) => {
      if (val.definition_list_code == code) {
        tds_text = val.definition_list_name
      } else if ('Empty' == code) {
        tds_text = 'No Tax'
      }
    })
    return tds_text
  }

  useEffect(() => {
    NlmtTripSheetClosureService.getSettlementApprovalInfoById(id).then((res) => {
      setFetch(true)
      // Response is an ARRAY — each element is one parking-yard/trip record
      let payment_info_data = res.data.data
      console.log(payment_info_data, 'closure_info_data')
      setSettlementClosureData(payment_info_data)

      // Set vendor & remarks from the first record
      if (payment_info_data.length > 0) {
        setVendorInfo(payment_info_data[0].vendor_info)
        values.remarks = payment_info_data[0].trip_settlement_info
          ? payment_info_data[0].trip_settlement_info.remarks
          : ''
      }

      let rowDataList = []
      let tot_ton = 0

      // Iterate over the top-level array; each item has its own tripsheet/settlement/vehicle_assignment
      payment_info_data.map((data, index) => {
        const tripsheetInfo = data.tripsheet_info || {}
        const tripSettlement = data.trip_settlement_info || {}
        const vehicleInfo = data.vehicle_info || {} 
        const advanceAmount = data.advance_payment_info?.advance_payment || '0'
        const settlementInfo = data.trip_settlement_info || {}  
        // Use first vehicle_assignment item for shipment details
        const assignment = data.vehicle_assignment && data.vehicle_assignment.length > 0
          ? data.vehicle_assignment[0]
          : {}

        let qty_ton = assignment.shipment_net_qty && Number(assignment.shipment_net_qty) != 0
          ? Number(parseFloat(assignment.shipment_net_qty).toFixed(3))
          : parseFloat(assignment.shipment_qty || 0)
        console.log(qty_ton, 'qty_ton')
        tot_ton += Number(parseFloat(qty_ton).toFixed(3))

        rowDataList.push({
          sno: index+1,              
          Tripsheet: tripsheetInfo.nlmt_tripsheet_no || '-',
          Shipment_No: assignment.shipment_no || '-',
          GateIn_Date: data.created_date || '-',
          Tripsheet_Date: tripsheetInfo.created_date || '-',
          Expense_Date: tripSettlement.created_date || '-',
          Vehicle_No: vehicleInfo.vehicle_number || assignment.vehicle_number || '-',
          Driver_Name: data.driver_name || '-',
          Driver_Number: String(data.driver_phone_1 || '-'),   
          expenseAmount: Number(settlementInfo.expense),
          expenseGstTdsTax: `${(settlementInfo.gst_tax_type && settlementInfo.gst_tax_type != 'Empty') ? settlementInfo.gst_tax_type : '-'} / ${settlementInfo.tds_having == 1 ?  settlementInfo.vendor_tds : '-'}`, 
          expTdsPayment_100: tdsRateFinder(singleVendorArray.freight_percentage == 10 ? 1 : 2, data),
          expTdsPayment_10: singleVendorArray.freight_percentage == 10 ? balanceFreight(data.advance_payment_info.sap_freight_payment_amount,data.advance_payment_info.sap_bank_payment_amount) : '-',
          expenseDeduction: Number(settlementInfo.diversion_return_charges),
          expPayment: totalRateFinder(singleVendorArray.freight_percentage == 10 ? 1 : 2,data,data.trip_settlement_info.diversion_return_charges),
          Shipment_Net_Qty: assignment.shipment_net_qty || '-', 
          Screen_Duration: data.vehicle_current_position_updated_time || '-',
          Overall_Duration: data.created_at || '-',
          Tripsheet_No: (
            <Link
              className="text-black"
              target="_blank"
              to={`/NlmtSettlementClosureInfo/${data.nlmt_trip_in_id}`}
            >
              <u>
                <strong>{tripsheetInfo.nlmt_tripsheet_no}</strong>
              </u>
            </Link>
          ),
          S_NO: (
            <a style={{color:'black'}} target='_blank' rel="noreferrer" href={data.trip_settlement_info.expense_form}>
              <u><strong>{index+1}</strong></u>
            </a>  
          ),
         
        })
        console.log(tot_ton, 'totTon', index)
      })
      let totTon = Number(parseFloat(tot_ton).toFixed(3))
      console.log(totTon, 'totTon-tot')
      setTotalTonnage(totTon)
      setRowData(rowDataList)
    })
  }, [id,singleVendorArray.length == 0])

  const DepoTripSettlementValidationCancel = () => {
    console.log(values.apremarks, 'apremarks')
    if (values.apremarks && values.apremarks.trim()) {
      setTripPaymentAllDelete(true)
    } else {
      setFetch(true)
      Swal.fire({
        title: 'Remarks required for rejection..',
        icon: 'warning',
        confirmButtonText: 'OK',
      }).then(function () {})
      values.apremarks = ''
      return false
    }
  }

  const columns = [
    {
      name: 'S.No',
      selector: (row) => row.S_NO,
      // sortable: true,
      center: true,
    },
    {
      name: 'TripSheet',
      selector: (row) => row.Tripsheet_No,
      // sortable: true,
      center: true,
    },
    {
      name: 'Shipment',
      selector: (row) => row.Shipment_No,
      sortable: true,
      center: true,
    }, 
    {
      name: 'GateIn',
      selector: (row) => row.GateIn_Date,
      sortable: true,
      center: true,
    }, 
    {
      name: 'Truck No',
      selector: (row) => row.Vehicle_No,
      sortable: true,
      center: true,
    },
    // {
    //   name: 'Driver',
    //   selector: (row) => row.Driver_Name,
    //   sortable: true,
    //   center: true,
    // },
    // {
    //   name: 'Ship. Qty',
    //   selector: (row) => row.Shipment_Qty,
    //   sortable: true,
    //   center: true,
    // },
    {
      name: 'Ship. Qty',
      selector: (row) => row.Shipment_Net_Qty,
      sortable: true,
      center: true,
    },
    {
      name: 'Freight',
      selector: (row) => row.expenseAmount,
      sortable: true,
      center: true,
    }, 
    {
      name: 'GST/TDS',
      selector: (row) => row.expenseGstTdsTax,
      sortable: true,
      center: true,
    },
    {
      name: '100 % Amt.',
      selector: (row) => row.expTdsPayment_100,
      sortable: true,
      center: true,
    },
    {
      name: '10 % Amt.',
      selector: (row) => row.expTdsPayment_10,
      sortable: true,
      center: true,
    },
    {
      name: 'Deduction',
      selector: (row) => row.expenseDeduction,
      sortable: true,
      center: true,
    }, 
    {
      name: 'Payment',
      selector: (row) => row.expPayment, 
      center: true,
    }, 
    // {
    //   name: 'Expense Date',
    //   selector: (row) => row.Expense_Date,
    //   sortable: true,
    //   center: true,
    // }, 
  ]

  const validationApproval = () => {

    if (invoicePostingDate) {
      //
    } else {
      setFetch(true)
      toast.warning('You should select invoice posting date before submitting..!')
      return false
    }

    // ============= Posting date Validation Part =================== //

    let Expense_Income_Posting_Date_Taken = ExpenseIncomePostingDate()
    let from_date = Expense_Income_Posting_Date_Taken.min_date
    let to_date = Expense_Income_Posting_Date_Taken.max_date

    if (JavascriptDateCheckComponent(from_date, invoicePostingDate, to_date)) {
      //
    } else {
      setFetch(true)
      toast.warning('Invalid Posting date')
      return false
    }
    // ============= Posting date Validation Part =================== //

    console.log(singleVendorArray, 'singleVendorArray')

    /* =================== Request Sent To SAP For Invoice No. Generation Start ======================= */

    var LineItem = {}
    var LineItemSeq = []

    var trips = settlementClosureData || []

    for (var i = 0; i < trips.length; i++) {
      LineItem.LINE_ITEM = String(i + 1)
      LineItem.TRIPSHEET_NO = trips[i].tripsheet_info?.nlmt_tripsheet_no || ''

      LineItemSeq[i] = LineItem
      LineItem = {}
    }

    const sap_data = [
      {
        PAY_REF: singleVendorArray.invoice_sequence,
        LIFNR: singleVendorArray.vendor_code,
        POST_DATE: invoicePostingDate,
        BANK_PAYMENT: singleVendorArray.freight_amount,
        BANK_REMARKS: singleVendorArray.reference_text,
        PLANT: 'NLMD',
        LINE: LineItemSeq,
      },
    ]
    // sap_data.append('depo_location', depoLocation)

    console.log(sap_data, 'validationApproval-sap_data')
    // setFetch(true)
    // return false

    NlmtTripSheetClosureService.NlmtPaymentInvoiceCreation(sap_data).then((res) => {
      let sap_invoice_no = res.data.BANK_PAYMENT_DOC_NO
      let sap_invoice_status = res.data.BANK_PAYMENT_STATUS
      let sap_invoice_message = res.data.BANK_PAYMENT_MESSAGE
      let sap_invoice_reference = res.data.PAY_REF

      console.log(
        sap_invoice_no +
          '/' +
          sap_invoice_status +
          '/' +
          sap_invoice_message +
          '/' +
          sap_invoice_reference
      )

      if (
        sap_invoice_status == '1' &&
        res.status == 200 &&
        sap_invoice_no &&
        sap_invoice_message &&
        sap_invoice_reference == singleVendorArray.invoice_sequence
      ) {
        /* ====== Request Sent To SAP For Invoice No. Generation End ========== */

        let form_data = new FormData()
        form_data.append('payment_id', id)
        form_data.append('updated_by', user_id)
        form_data.append('remarks', values.apremarks)
        form_data.append('sap_invoice_no', sap_invoice_no)
        form_data.append('status', 4)
        form_data.append('invoice_posting_date', invoicePostingDate)

        NlmtTripSheetClosureService.sendPaymentApproval(form_data)
          .then((res) => {
            console.log(res, 'sendValidationApproval')
            setFetch(true)
            if (res.status == 200) {
              Swal.fire({
                title: 'Payment Approval Confirmed Successfully!',
                icon: 'success',
                text: 'Payment Invoice No : ' + sap_invoice_no,
                confirmButtonText: 'OK',
              }).then(function () {
                navigation('/NlmtSettlementApprovalTable')
              })
            } else if (res.status == 201) {
              Swal.fire({
                title: res.data.message,
                icon: 'warning',
                confirmButtonText: 'OK',
              }).then(function () {
                // window.location.reload(false)
              })
            } else {
              toast.warning('Payment Approval Cannot be Updated. Kindly contact Admin..!')
            }
          })
          .catch((errortemp) => {
            console.log(errortemp)
            setFetch(true)
            var object = errortemp.response.data.errors
            var output = ''
            // for (var property in object) {
            //   output += '*' + object[property] + '\n'
            // }
            setError(output)
            setErrorModal(true)
          })
      } else if (
        sap_invoice_status == '2' &&
        res.status == 200 &&
        sap_invoice_no == '' &&
        sap_invoice_message &&
        sap_invoice_reference == singleVendorArray.invoice_sequence
      ) {
        Swal.fire({
          title: sap_invoice_message,
          icon: 'warning',
          confirmButtonText: 'OK',
        }).then(function () {
          window.location.reload(false)
        })
      } else {
        setFetch(true)
        toast.warning('Payment Invoice Creation Failed in SAP.. Kindly Contact Admin!')
      }
    })
    .catch((errortemp) => {
      console.log(errortemp)
      setFetch(true)
      var object = errortemp.response.data.errors
      var output = ''
      // for (var property in object) {
      //   output += '*' + object[property] + '\n'
      // }
      setError(output)
      setErrorModal(true)
    })
  }

  return (
    <>
      {!fetch && <Loader />}
      {fetch && (
        <>
          {screenAccess ? (
            <>
              <CCard className="p-1">
                {singleVendorArray && (
                  <>
                    <CRow className="m-2">
                      <CCol md={3}>
                        <CFormLabel htmlFor="cmn">Invoice Sequence No.</CFormLabel>
                        <CFormInput
                          style={{ fontWeight: 'bolder' }}
                          name="cmn"
                          size="sm"
                          id="cmn"
                          value={singleVendorArray.invoice_sequence}
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
                          value={singleVendorArray.vendor_info ? singleVendorArray.vendor_info.owner_name : ''}
                          readOnly
                        />
                      </CCol>

                      <CCol md={3}>
                        <CFormLabel htmlFor="cmn">Vendor Code / Mobile No.</CFormLabel>
                        <CFormInput
                          style={{ fontWeight: 'bolder' }}
                          name="cmn"
                          size="sm"
                          id="cmn"
                          value={`${singleVendorArray.vendor_info ? singleVendorArray.vendor_info.vendor_code : ''} / ${singleVendorArray.vendor_info ? singleVendorArray.vendor_info.owner_number : ''}`}
                          readOnly
                        />
                      </CCol>

                      <CCol md={3}>
                        <CFormLabel htmlFor="cmn">Tripsheet Count / Freight %</CFormLabel>
                        <CFormInput
                          style={{fontWeight: 'bolder'}}
                          name="cmn"
                          size="sm"
                          id="cmn"
                          value={`${singleVendorArray.trip_info.length} / ${singleVendorArray.freight_percentage} %`}
                          readOnly
                        />
                      </CCol>   

                      <CCol md={3}>
                        <CFormLabel htmlFor="cmn">Total Qty. in MTS </CFormLabel>
                        <CFormInput
                          style={{ fontWeight: 'bolder' }}
                          name="cmn"
                          size="sm"
                          id="cmn"
                          value={singleVendorArray.shipment_qty}
                          readOnly
                        />
                      </CCol>

                      <CCol md={3}>
                        <CFormLabel htmlFor="cmn">Total Payment</CFormLabel>
                        <CFormInput
                          style={{ fontWeight: 'bolder' }}
                          name="cmn"
                          size="sm"
                          id="cmn"
                          value={`${singleVendorArray.freight_amount}`}
                          readOnly
                        />
                      </CCol>

                      <CCol md={3}>
                        <CFormLabel htmlFor="cmn">Payment Requested By</CFormLabel>
                        <CFormInput
                          style={{ fontWeight: 'bolder' }}
                          name="cmn"
                          size="sm"
                          id="cmn"
                          value={singleVendorArray.payment_user_info.emp_name}
                          readOnly
                        />
                      </CCol>

                      <CCol md={3}>
                        <CFormLabel htmlFor="cmn">Payment Remarks</CFormLabel>
                        <CFormInput
                          style={{ fontWeight: 'bolder' }}
                          name="cmn"
                          size="sm"
                          id="cmn"
                          value={singleVendorArray.remarks}
                          readOnly
                        />
                      </CCol> 

                      <CCol md={3}>
                        <CFormLabel htmlFor="cmn">Invoice Copy</CFormLabel>
                        
                        <CButton
                          onClick={() => setVisible(!visible)}
                          className="w-100 m-0"
                          color="info"
                          size="sm"
                          id="odoImg"
                          style={border}
                        >
                          <span className="float-start"> 
                            {singleVendorArray.invoice_copy ? (
                              <>
                                <i className="fa fa-eye" aria-hidden="true"></i> &nbsp;View
                              </>
                            ) : <> {'Not Attached.'} </>
                          }
                          </span>
                        </CButton>
                        <CModal visible={visible} onClose={() => setVisible(false)}>
                          <CModalHeader>
                            <CModalTitle>Payment Invoice Copy</CModalTitle>
                          </CModalHeader>

                          <CModalBody>
                            {singleVendorArray.invoice_copy &&
                            !singleVendorArray.invoice_copy.includes('.pdf') ? (
                              <CCardImage orientation="top" src={singleVendorArray.invoice_copy} />
                            ) : (
                              <iframe
                                orientation="top"
                                height={500}
                                width={475}
                                src={singleVendorArray.invoice_copy}
                              ></iframe>
                            )}
                          </CModalBody>

                          <CModalFooter>
                            <CButton color="secondary" onClick={() => setVisible(false)}>
                              Close
                            </CButton>
                          </CModalFooter>
                        </CModal>
                      </CCol>

                      <CCol md={3}>
                        <CFormLabel htmlFor="cmn">Validation Remarks</CFormLabel>
                        <CFormInput
                          style={{ fontWeight: 'bolder' }}
                          name="cmn"
                          size="sm"
                          id="cmn"
                          value={singleVendorArray.approval_remarks || '-'}
                          readOnly
                        />
                      </CCol>

                      <CCol md={3}>
                        <CFormLabel htmlFor="cmn">SAP Reference Text</CFormLabel>
                        <CFormInput
                          style={{ fontWeight: 'bolder' }}
                          name="cmn"
                          size="sm"
                          id="cmn"
                          value={singleVendorArray.reference_text || '-'}
                          readOnly
                        />
                      </CCol>
                      
                      <CCol md={3} style={{ textAlign: 'end' }}>
                        {/* <CFormLabel htmlFor="cmn">.</CFormLabel> */}
                        <CButton
                          size="sm"
                          color="warning"
                          className="mx-3 px-3 text-white"
                          style={{ marginTop: '10%' }}
                          onClick={(e) => {
                            // loadVehicleReadyToTripForExportCSV()
                            exportToCSV()
                          }}
                        >
                          Export
                        </CButton>
                      </CCol>

                      {/* <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="odoImg">Invoice Copy</CFormLabel>
                            <CButton
                              onClick={() => setVisible(!visible)}
                              className="w-100 m-0"
                              color="info"
                              size="sm"
                              id="odoImg"
                              style={border}
                            >
                              <span className="float-start">
                                <i className="fa fa-eye" aria-hidden="true"></i> &nbsp;View
                              </span>
                            </CButton>
                            <CModal visible={visible} onClose={() => setVisible(false)}>
                              <CModalHeader>
                                <CModalTitle>Payment Invoice Copy</CModalTitle>
                              </CModalHeader>

                              <CModalBody>
                                {singleVendorArray.invoice_copy &&
                                !singleVendorArray.invoice_copy.includes('.pdf') ? (
                                  <CCardImage
                                    orientation="top"
                                    src={singleVendorArray.invoice_copy}
                                  />
                                ) : (
                                  <iframe
                                    orientation="top"
                                    height={500}
                                    width={475}
                                    src={singleVendorArray.invoice_copy}
                                  ></iframe>
                                )}
                              </CModalBody>

                              <CModalFooter>
                                <CButton color="secondary" onClick={() => setVisible(false)}>
                                  Close
                                </CButton>
                              </CModalFooter>
                            </CModal>
                          </CCol> */}
                    </CRow>
                  </>
                )}
                <CustomTable
                  columns={columns}
                  pagination={false}
                  data={rowData}
                  fieldName={'Driver_Name'}
                  showSearchFilter={true}
                />

                <CRow className="m-4">
                  <CCol xs={12} md={3}>
                    <CFormLabel htmlFor="apremarks">Approval Remarks</CFormLabel>
                    <CFormTextarea
                      name="apremarks"
                      id="apremarks"
                      rows="1"
                      onFocus={onFocus}
                      onBlur={onBlur}
                      onChange={handleChange}
                      value={values.apremarks}
                    ></CFormTextarea>
                  </CCol>

                  <CCol xs={12} md={3}>
                    <CFormLabel htmlFor="invoicePostingDate">
                      Invoice Posting Date <REQ />{' '}
                    </CFormLabel>
                    <CFormInput
                      size="sm"
                      type="date"
                      id="invoicePostingDate"
                      name="invoicePostingDate"
                      onChange={handleChangeInvoicePostingDate}
                      min={Expense_Income_Posting_Date.min_date}
                      max={Expense_Income_Posting_Date.max_date}
                      onKeyDown={(e) => {
                        e.preventDefault()
                      }}
                      value={invoicePostingDate}
                    />
                  </CCol>
                </CRow>
                <CRow className="mt-2">
                  <CCol className="m-2" xs={12} sm={12} md={3}>
                    <CButton size="sm" color="primary" className="text-white" type="button">
                      <Link className="text-white" to="/NlmtSettlementApprovalTable">
                        Previous
                      </Link>
                    </CButton>
                  </CCol>
                  <CCol
                    className="offset-md-9"
                    // xs={12}
                    // sm={12}
                    // md={3}
                    // style={{ display: 'flex', justifyContent: 'space-between' }}
                    // style={{ display: 'flex', flexDirection: 'row-reverse', cursor: 'pointer' }}
                    // className="pull-right"
                    xs={12}
                    sm={12}
                    md={3}
                    style={{ display: 'flex', justifyContent: 'flex-end' }}
                  >
                    <CButton
                      size="sm"
                      style={{ background: 'red' }}
                      className="mx-3 text-white"
                      onClick={() => {
                        // setFetch(false)
                        DepoTripSettlementValidationCancel()
                      }}
                      type="submit"
                    >
                      Reject
                    </CButton>
                    <CButton
                      size="sm"
                      style={{ background: 'green' }}
                      className="mx-3 text-white"
                      onClick={() => {
                        setFetch(false)
                        validationApproval()
                      }}
                      type="submit"
                    >
                      Approve
                    </CButton>
                  </CCol>
                </CRow>

                <CModal
                  size="md"
                  visible={tripPaymentAllDelete}
                  onClose={() => {
                    setTripPaymentAllDelete(false)
                  }}
                >
                  <CModalHeader
                    style={{
                      backgroundColor: '#ebc999',
                    }}
                  >
                    <CModalTitle>Confirmation To Reject</CModalTitle>
                  </CModalHeader>
                  <CModalBody>
                    <p className="lead">Are you sure to reject this Payment</p>
                  </CModalBody>
                  <CModalFooter>
                    <CButton
                      className="m-2"
                      color="warning"
                      onClick={() => {
                        setTripPaymentAllDelete(false)
                        setFetch(false)
                        deleteTripAllPayment()
                      }}
                    >
                      Yes
                    </CButton>
                    <CButton
                      color="secondary"
                      onClick={() => {
                        setTripPaymentAllDelete(false)
                      }}
                    >
                      No
                    </CButton>
                  </CModalFooter>
                </CModal>
                <CModal
                  size="md"
                  visible={tripPaymentDelete}
                  onClose={() => {
                    setTripPaymentDelete(false)
                    setTripIdToDelete('')
                    setTripNoToDelete('')
                    setPaymentAmountToDelete(0)
                    setShipmentIdToDelete('')
                  }}
                >
                  <CModalHeader
                    style={{
                      backgroundColor: '#ebc999',
                    }}
                  >
                    <CModalTitle>Confirmation To Removal</CModalTitle>
                  </CModalHeader>
                  <CModalBody>
                    <p className="lead">Are you sure to remove this Tripsheet - ({tripNoToDelete})</p>
                    <CRow>
                      <CCol xs>
                        <CInputGroup style={{ width: '80%' }}>
                          <CInputGroupText
                            style={{
                              backgroundColor: '#4d3227',
                              color: 'white',
                              width: '60%',
                            }}
                          >
                            Previous Trip Freight Amount
                          </CInputGroupText>
                          <CFormInput
                            readOnly
                            value={Number(singleVendorArray.freight_amount).toFixed(3)}
                          />
                        </CInputGroup>
                      </CCol>
                    </CRow>
                    <CRow>
                      <CCol xs>
                        <CInputGroup style={{ width: '80%' }}>
                          <CInputGroupText
                            style={{
                              backgroundColor: '#4d3227',
                              color: 'white',
                              width: '60%',
                            }}
                          >
                            Removal Trip Freight Amount
                          </CInputGroupText>
                          <CFormInput readOnly value={Number(paymentAmountToDelete).toFixed(3)} />
                        </CInputGroup>
                      </CCol>
                    </CRow>
                    <CRow>
                      <CCol xs>
                        <CInputGroup style={{ width: '80%' }}>
                          <CInputGroupText
                            style={{
                              backgroundColor: '#4d3227',
                              color: 'white',
                              width: '60%',
                            }}
                          >
                            Updated Trip Freight Amount
                          </CInputGroupText>
                          <CFormInput
                            readOnly
                            value={(
                              Number(singleVendorArray.freight_amount).toFixed(3) -
                              Number(paymentAmountToDelete).toFixed(3)
                            ).toFixed(3)}
                          />
                        </CInputGroup>
                      </CCol>
                    </CRow>
                  </CModalBody>
                  <CModalFooter>
                    <CButton
                      className="m-2"
                      color="warning"
                      onClick={() => {
                        setTripPaymentDelete(false)
                        // setFetch(false)
                        deleteTripPayment()
                      }}
                    >
                      Confirm
                    </CButton>
                    <CButton
                      color="secondary"
                      onClick={() => {
                        setTripPaymentDelete(false)
                        setTripIdToDelete('')
                        setTripNoToDelete('')
                        setPaymentAmountToDelete(0)
                        setShipmentIdToDelete('')
                      }}
                    >
                      Cancel
                    </CButton>
                    {/* <CButton color="primary">Save changes</CButton> */}
                  </CModalFooter>
                </CModal>

                {/* *********************************************************** */}
              </CCard>
            </>) : (<AccessDeniedComponent />
          )}
        </>
      )}
    </>
  )
}

export default NlmtSettlementApproval
