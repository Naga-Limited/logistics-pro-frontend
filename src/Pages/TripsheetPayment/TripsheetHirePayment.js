import {
  CForm,
  CButton,
  CCard,
  CContainer,
  CCol,
  CRow,
  CModal,
  CFormInput,
  CFormLabel,
  CModalHeader,
  CFormSelect,
  CInputGroupText,
  CInputGroup,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CAlert,
  CFormCheck,
  CListGroup,
  CListGroupItem,
  CTabPane,
  CAccordion,
  CAccordionItem,
  CAccordionBody,
  CAccordionHeader,
  CTabContent,
  CNavItem,
  CNav,
  CNavLink,
  CButtonGroup,
  CFormTextarea,
} from '@coreui/react'
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import Loader from 'src/components/Loader'
import SmallLoader from 'src/components/SmallLoader'
import TripSheetClosureService from 'src/Service/TripSheetClosure/TripSheetClosureService'
import VendorOutstanding from 'src/Service/SAP/VendorOutstanding'
import ExpenseIncomePostingDate from '../TripsheetClosure/Calculations/ExpenseIncomePostingDate'
import DefinitionsListApi from 'src/Service/Definitions/DefinitionsListApi'
import TripSheetClosureSapService from 'src/Service/SAP/TripSheetClosureSapService'
import Swal from 'sweetalert2'
import * as LogisticsProScreenNumberConstants from 'src/components/constants/LogisticsProScreenNumberConstants'
import AccessDeniedComponent from 'src/components/commoncomponent/AccessDeniedComponent'
import JavascriptInArrayComponent from 'src/components/commoncomponent/JavascriptInArrayComponent'
import JavascriptDateCheckComponent from 'src/components/commoncomponent/JavascriptDateCheckComponent'

const TripsheetHirePayment = () => {
  const REQ = () => <span className="text-danger"> * </span>

  /*================== User Id & Location Fetch ======================*/
  const user_info_json = localStorage.getItem('user_info')
  const user_info = JSON.parse(user_info_json)
  const user_locations = []
  const navigation = useNavigate()
  const is_admin = user_info.user_id == 1 && user_info.is_admin == 1

  if(is_admin){
    console.log(user_info)
  }

  /* Get User Locations From Local Storage */
  user_info.location_info.map((data, index) => {
    user_locations.push(data.id)
  })

  const Expense_Income_Posting_Date = ExpenseIncomePostingDate();
  console.log(Expense_Income_Posting_Date,'ExpenseIncomePostingDate')

  /* Get User Id From Local Storage */
  const user_id = user_info.user_id

  // console.log(user_locations)
  /*================== User Location Fetch ======================*/

  /* ==================== Access Part Start ========================*/
  const [screenAccess, setScreenAccess] = useState(false)
  let page_no = LogisticsProScreenNumberConstants.HireDeductionPaymentModule.Hire_Payment_Screen

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
  const [smallfetch, setSmallFetch] = useState(false)
  const [pageList, setPageList] = useState([])

  const [tripHirePaymentData, setTripHirePaymentData] = useState({})
  const [sapTdsFreightData, setSapTdsFreightData] = useState({})
  const [hireVendorData, setHireVendorData] = useState({})
  const [gstTaxTermsData, setGstTaxTermsData] = useState([])
  const [tripSheetHaving, setTripsheetHaving] = useState(false)
  const [paymentSubmit, setPaymentSubmit] = useState(false)
  const [sapPaymentPostingPossibility, setSapPaymentPostingPossibility] = useState(false)
  const [vont, setVont] = useState(0) /* Vendor Outstanding Next Trip */
  const [activeKey, setActiveKey] = useState(1)
  const [sapBookDivision, setSapBookDivision] = useState(1)
  const [hireVendorCode, setHireVendorCode] = useState(0)
  const [hireVendorOutstanding, setHireVendorOutstanding] = useState(0)
  const [totalDeductionAmount, setTotalDeductionAmount] = useState(0)
  const [totalBalancePaymentAmount, setTotalBalancePaymentAmount] = useState(0)
  const [unloadingDeduction, setUnloadingDeduction] = useState(0)
  const [subdeliveryDeduction, setSubdeliveryDeduction] = useState(0)
  const [weighmentDeduction, setWeighmentDeduction] = useState(0)
  const [freightDeduction, setFreightDeduction] = useState(0)
  const [diversionReturnDeduction, setDiversionReturnDeduction] = useState(0)
  const [haltingDeduction, setHaltingDeduction] = useState(0)
  const [tollDeduction, setTollDeduction] = useState(0)
  const [deductionRemarks, setDeductionRemarks] = useState('')
  const [paymentRemarks, setPaymentRemarks] = useState('')
  const [paymentPostingDate, setPaymentPostingDate] = useState('')

  const [errorModal, setErrorModal] = useState(false)
  const [error, setError] = useState({})

  const deduction_type_amount = [unloadingDeduction,subdeliveryDeduction,weighmentDeduction,freightDeduction,diversionReturnDeduction,haltingDeduction,tollDeduction]

  const remarksHandleChange = (event,type) => {

    if(type == 3){
      setPaymentPostingDate(event.target.value)
    } else {
      let result = event.target.value.toUpperCase()
      if(type == 1){
        setDeductionRemarks(result.trimStart())
      } else {
        setPaymentRemarks(result.trimStart())
      }
    }

  }

  const [tripsheetNumberNew, setTripsheetNumberNew] = useState('');
  const handleChangenewtrip = event => {
    let tripResult = event.target.value.toUpperCase();
    setTripsheetNumberNew(tripResult.trim());

  };

  const gstTaxCodeName = (code) => {
    let gst_tax_code_name = '-'

    gstTaxTermsData.map((val, key) => {
      if (val.definition_list_code == code) {
        gst_tax_code_name = val.definition_list_name
      }
    })

    console.log(gst_tax_code_name,'gst_tax_code_name')

    return gst_tax_code_name
  }

  useEffect(()=>{

    let bpa = 0
    let v_o_n_t = 0
    if(tripHirePaymentData.deduction_info){
      bpa = tripHirePaymentData.deduction_info.previous_balance_payment
    } else {
      bpa = totalBalancePaymentAmount
    }

    console.log(hireVendorOutstanding,'hireVendorOutstanding')
    console.log(bpa,'totalBalancePaymentAmount')

    // if((hireVendorOutstanding <= 0 && bpa > 0) || (hireVendorOutstanding > 0 && (bpa-hireVendorOutstanding) > 0)){
    //   setSapPaymentPostingPossibility(true)
    //   v_o_n_t = 1
    // } else {
    //   setSapPaymentPostingPossibility(false)
    //   v_o_n_t = 0
    // }

    let difference_amount = (getInt(bpa)) - getInt(hireVendorOutstanding)

    if(bpa <= 0){
      setSapPaymentPostingPossibility(false)
      v_o_n_t = 0
    } else {
      if(difference_amount > bpa){
        setSapPaymentPostingPossibility(true)
        v_o_n_t = 1
      } else {
        setSapPaymentPostingPossibility(false)
        v_o_n_t = 0
      }
    }

    if(v_o_n_t = 0){
        setVont(getInt(hireVendorOutstanding))
    } else {

      let sap_payment_amount = tripHirePaymentData.deduction_info ? sapPaymentPosting(2) : sapPaymentPosting(1)
      console.log(sap_payment_amount,'sap_payment_amount')
      console.log(sap_payment_amount == bpa,'sap_payment_amount == bpa')
      let needed_val = 0
      if(sap_payment_amount == bpa){
        needed_val = getInt(hireVendorOutstanding)+getInt(bpa)
        setVont(needed_val)
      } else {
        setVont(needed_val)
      }
      console.log(needed_val,'v-0-n-t')
    }

    // if(hireVendorOutstanding <= 0 && bpa > 0){
    //   setVont(getInt(hireVendorOutstanding)+getInt(bpa))
    // } else {
    //   if(v_o_n_t == 0){
    //     setVont(getInt(hireVendorOutstanding)-(getInt(bpa)))
    //   } else {
    //     setVont(0)
    //   }
    // }

  },[hireVendorOutstanding,totalBalancePaymentAmount,tripHirePaymentData.deduction_info,sapPaymentPostingPossibility,vont])

  // GET PAN DETAILS FROM SAP
  const gettripHirePaymentData = (e) => {
    e.preventDefault()
    setUnloadingDeduction(0)
    setSubdeliveryDeduction(0)
    setWeighmentDeduction(0)
    setFreightDeduction(0)
    setDiversionReturnDeduction(0)
    setHaltingDeduction(0)
    setTollDeduction(0)
    setPaymentPostingDate('')
    setDeductionRemarks('')
    setPaymentRemarks('')
    console.log(tripsheetNumberNew,'tripsheetNumberNew')
    if(/^[a-zA-Z0-9]+$/i.test(tripsheetNumberNew) && /[a-zA-Z]/.test(tripsheetNumberNew) && /[0-9]/.test(tripsheetNumberNew)){
      TripSheetClosureService.getTripSettlementPaymentInfoByTripsheetNo(tripsheetNumberNew).then((res) => {
        setTripsheetHaving(true)
        console.log(res,'getTripSettlementInfoByTripsheetNo')
        if (res.status == 200 && res.data != '') {

          let needed_data = res.data.data
          setSmallFetch(true)
          setTripHirePaymentData(needed_data)
          if(needed_data.Parking_Vendor_Info){
            setHireVendorData(needed_data.Parking_Vendor_Info)
            setHireVendorCode(needed_data.Parking_Vendor_Info.vendor_code)
          } else {
            setHireVendorData(needed_data.vendor_info)
            setHireVendorCode(needed_data.vendor_info.vendor_code)
          }
          // setHireVendorCode(needed_data.vendor_info.vendor_code)
          toast.success('Tripsheet Details Detected!')

          let total_deduction_amount = Number(unloadingDeduction)+Number(subdeliveryDeduction)+Number(weighmentDeduction)+Number(freightDeduction)+Number(diversionReturnDeduction)+Number(haltingDeduction)+Number(tollDeduction)
          console.log(needed_data.trip_settlement_info.sap_book_division,'getTripSettlementInfoByTripsheetNo-sap_book_division')
          if(needed_data.trip_settlement_info.sap_book_division == 2)
          {
            setSapBookDivision(2)
          } else {
            setSapBookDivision(1) 
          }

          // let total_trip_expenses = needed_data.trip_settlement_info ? (needed_data.trip_settlement_info.expense ? needed_data.trip_settlement_info.expense : '0'): '0'

          let sap_trip_expenses = sapTdsFreightData ? sapTdsFreightData.TDS_AMT : 0

          let total_advance_amount = needed_data.advance_info ? (needed_data.advance_info.advance_payment && needed_data.advance_info.advance_payment_diesel ? Number(parseFloat(needed_data.advance_info.advance_payment).toFixed(2)) + Number(parseFloat(needed_data.advance_info.advance_payment_diesel).toFixed(2)) : '0')
          : '0'

          let balance_amount = Number(parseFloat(sap_trip_expenses).toFixed(2)) - ( Number(parseFloat(total_advance_amount).toFixed(2)) + Number(parseFloat(total_deduction_amount).toFixed(2)))
          // let balance_amount = Number(parseFloat(total_trip_expenses).toFixed(2)) - ( Number(parseFloat(total_advance_amount).toFixed(2)) + Number(parseFloat(total_deduction_amount).toFixed(2)))

          // let balance_amount = Number(parseFloat(total_trip_expenses).toFixed(2)) - Number(parseFloat(total_deduction_amount).toFixed(2))
          setTotalDeductionAmount(total_deduction_amount)
          setTotalBalancePaymentAmount(balance_amount)

        } else {

          setTripHirePaymentData([])
          setHireVendorCode(0)
          setHireVendorData({})
          setTripsheetHaving(false)
          setSmallFetch(true)
          if (res.status == 201 && (res.data.status == '1' ||res.data.status == '2')) {
            toast.warning(res.data.message)
          } else {
            setSmallFetch(true)
            toast.warning('Tripsheet Details cannot be detected from LP!')
          }
        }
      })
    } else {

      setTripHirePaymentData([])
      setHireVendorCode(0)
      setTripsheetHaving(false)
      setSmallFetch(true)
      toast.warning('Tripsheet Number Must Like "AB123456789"')
      return false
    }

  }

  const tripPaymentBalanceFinder = (data) => {
    let balance = 0
    let total = data.actual_freight
    let total_updated = Number(parseFloat(total).toFixed(2))
    let bank = data.advance_payment
    let bank_updated = Number(parseFloat(bank).toFixed(2))
    let diesel = data.advance_payment_diesel
    let diesel_updated = Number(parseFloat(diesel).toFixed(2))
    balance = total_updated - (bank_updated+diesel_updated)
    console.log(total_updated+'/'+bank_updated+'/'+diesel_updated+'/'+balance)
    return balance
  }

  const tripSettlementStatusFinder = (value) => {
    if(value == '3'){
      return 'Expenses Posted'
    } else if(value == '5'){
      return 'Income Partially Posted'
    } else if(value == '6'){
      return 'Income Posted'
    } else {
      return '--'
    }
  }

  const TripAditionalExpenseFinder = (datas) => {
    let expense = Number(parseFloat(datas.expense).toFixed(2))
    let freight = Number(parseFloat(datas.freight_charges).toFixed(2))
    let additional_expenses = Number(parseFloat(expense-freight).toFixed(2))
    return additional_expenses
  }

  useEffect(() => {

      let total_deduction_amount = Number(unloadingDeduction)+Number(subdeliveryDeduction)+Number(weighmentDeduction)+Number(freightDeduction)+Number(diversionReturnDeduction)+Number(haltingDeduction)+Number(tollDeduction)

      // let total_trip_expenses = tripHirePaymentData.trip_settlement_info ? (tripHirePaymentData.trip_settlement_info.expense ? tripHirePaymentData.trip_settlement_info.expense : '0') : '0'

      let sap_trip_expenses = sapTdsFreightData ? sapTdsFreightData.TDS_AMT : 0

      let total_advance_amount = tripHirePaymentData.advance_info ? (tripHirePaymentData.advance_info.advance_payment && tripHirePaymentData.advance_info.advance_payment_diesel ? Number(parseFloat(tripHirePaymentData.advance_info.advance_payment).toFixed(2)) + Number(parseFloat(tripHirePaymentData.advance_info.advance_payment_diesel).toFixed(2)) : '0')
      : '0'

      // let balance_amount = Number(parseFloat(total_trip_expenses).toFixed(2)) - ( Number(parseFloat(total_advance_amount).toFixed(2)) + Number(parseFloat(total_deduction_amount).toFixed(2)))
      let balance_amount = Number(parseFloat(sap_trip_expenses).toFixed(2)) - ( Number(parseFloat(total_advance_amount).toFixed(2)) + Number(parseFloat(total_deduction_amount).toFixed(2)))

      setTotalDeductionAmount(total_deduction_amount)
      setTotalBalancePaymentAmount(balance_amount)

  },[unloadingDeduction,subdeliveryDeduction,weighmentDeduction,freightDeduction,diversionReturnDeduction,haltingDeduction,tollDeduction,sapTdsFreightData])

  useEffect(() => {
    if(tripSheetHaving){
      TripSheetClosureSapService.getSapTripExpensesByTripsheetNo(tripsheetNumberNew).then((res) => {
        let trip_sap_expenses_data = res.data[0]
        console.log(trip_sap_expenses_data,'trip_sap_expenses_data')
        if(trip_sap_expenses_data.TRIPSHEET_NO == tripsheetNumberNew && trip_sap_expenses_data.STATUS == 1 && trip_sap_expenses_data.TDS_AMT != 0){
          setSapTdsFreightData(trip_sap_expenses_data)
        } else {
          setSapTdsFreightData({})
          Swal.fire({
            title: 'Tripsheet Data not found in SAP.. Kindly Contact Admin!',
            icon: "warning",
            confirmButtonText: "OK",
          }).then(function () {
            window.location.reload(false)
          })
        }
      })
    }else {
      setSapTdsFreightData({})
    }

  },[tripSheetHaving])

  useEffect(() => {
    if (hireVendorCode != 0) {
      
      VendorOutstanding.getVendoroutstanding(hireVendorCode).then((res) => {
        let driver_outstanding_data = res.data[0];
        console.log(driver_outstanding_data,'driver_outstanding_data');
        setHireVendorOutstanding(driver_outstanding_data.L_DMBTR)
      })
      
    }else {
      setHireVendorOutstanding(0)
    }
  },[hireVendorCode, tripHirePaymentData])

  useEffect(() => {
    /* section for getting Pages List from database For Setting Permission */
    DefinitionsListApi.visibleDefinitionsListByDefinition(8).then((response) => {
      console.log(response.data.data)
      setPageList(response.data.data)
      setFetch(true)
      setSmallFetch(true)
    })

     /* section for getting GST Tax Terms Master List For GST Tax Code Display from database */
     DefinitionsListApi.visibleDefinitionsListByDefinition(3).then((response) => {
      console.log(response.data.data,'setGstTaxTermsData')
      setGstTaxTermsData(response.data.data)
    })
  }, [])

  const getInt = (val) => {
    return Number(parseFloat(val).toFixed(2))
  }

  const sapPaymentPosting = (type) => {

    let payment = 0

    if(sapPaymentPostingPossibility){

      /* Type 1 : Deduction Not Having */
      if(type == 1){

        // if(getInt(hireVendorOutstanding) <= 0){
        //   payment = totalBalancePaymentAmount
        // } else {
        //   payment = totalBalancePaymentAmount-hireVendorOutstanding
        // }

        payment = getLowerValue(getInt(hireVendorOutstanding),getInt(totalBalancePaymentAmount))

      } else {

        let bal_payment = tripHirePaymentData.deduction_info.previous_balance_payment

        // if(getInt(hireVendorOutstanding) <= 0){
        //   payment = bal_payment
        // } else {
        //   payment = bal_payment-hireVendorOutstanding
        // }

        payment = getLowerValue(getInt(hireVendorOutstanding),getInt(bal_payment))

      }

    }

    console.log(payment,'sapPaymentPosting-Amount')

    return payment
  }

  const getLowerValue = (a,b) => {
    let lower = 0
    console.log(a,'a')
    console.log(b,'b')
    if(-a >= b){
      lower = b
    } else {
      lower = -a
    }
    console.log(lower,'lower-Amount')
    return lower
  }

  console.log(tripHirePaymentData,'tripHirePaymentData')
  console.log(sapTdsFreightData,'sapTdsFreightData')

  const paymentSubmissionValidation = () => {

    /* ===================== Validations Part Start ===================== */
    if(tripHirePaymentData.advance_info && hireVendorCode != tripHirePaymentData.advance_info.vendor_code){
      setFetch(true)
      toast.warning(`Hire Vendor verification failed. Kindly contact Admin..`)
      return false
    }

    if(paymentRemarks == ''){
      setFetch(true)
      toast.warning(`Payment Remarks should not be empty.`)
      return false
    }

    if(paymentPostingDate ==''){
      setFetch(true)
      toast.warning(`Please check and choose Payment Posting date..`)
      return false
    }

    // ============= Posting date Validation Part =================== //

    let Expense_Income_Posting_Date_Taken = ExpenseIncomePostingDate();
    let from_date = Expense_Income_Posting_Date_Taken.min_date
    let to_date = Expense_Income_Posting_Date_Taken.max_date

    if(JavascriptDateCheckComponent(from_date,paymentPostingDate,to_date)){
      //
    } else {
      setFetch(true)
      toast.warning('Invalid Payment Posting date')
      return false
    }
    // ============= Posting date Validation Part =================== //

    if(sapPaymentPostingPossibility){
      //
    } else {
      setFetch(true)
      toast.error(`Sap Payment Posting Not Available for this tripsheet (${tripHirePaymentData.trip_sheet_info.trip_sheet_no}). Kindly Contact Admin..`)
      return false
    }

    /* ===================== Validations Part End ===================== */

    if(is_admin){
      console.log('-------------------tripHirePaymentData---------------------------')
      console.log(tripHirePaymentData)
      console.log('-------------------Tripsheet No---------------------------')
      console.log(tripHirePaymentData.trip_sheet_info.trip_sheet_no)
      console.log('-------------------Vehicle No---------------------------')
      console.log(tripHirePaymentData.vehicle_number)
      console.log('-------------------Hire Vendor Code---------------------------')
      console.log(hireVendorCode)
      console.log('-------------------Hire Vendor Outstanding---------------------------')
      console.log(hireVendorOutstanding)
      // console.log('-------------------Deduction Remarks---------------------------')
      // console.log(deductionRemarks)
      console.log('-------------------Payment Remarks---------------------------')
      console.log(paymentRemarks)
      console.log('-------------------Payment Posting date---------------------------')
      console.log(paymentPostingDate)
      console.log('-------------------Total Trip Expenses---------------------------')
      console.log(tripHirePaymentData.trip_settlement_info.expense)
      // console.log('-------------------Total Deduction Amount---------------------------')
      // console.log(totalDeductionAmount)
      console.log('-------------------Total Balance Amount---------------------------')
      console.log(totalBalancePaymentAmount)
      console.log('-------------------SAP Posting Amount---------------------------')
      if(tripHirePaymentData.deduction_info){
        console.log(sapPaymentPosting(2))
      } else {
        console.log(sapPaymentPosting(1))
      }

    }

    setPaymentSubmit(true)
  }

  /* Submit Process */
  const TripsheetPaymentSubmit = () => {

    setFetch(false)

    let sap_data = new FormData()
    sap_data.append('TRIPSHEET_NO', tripHirePaymentData.trip_sheet_info.trip_sheet_no)
    sap_data.append('VEHICLE_NO', tripHirePaymentData.vehicle_number)
    sap_data.append('LIFNR', hireVendorCode)
    if(sapBookDivision == 2){
      sap_data.append('PLANT', 'NLCD')
    } else {
      sap_data.append('PLANT', 'NLLD')
    }
    let payment_string = '100%/'
    if(tripHirePaymentData.advance_info && tripHirePaymentData.advance_info.sap_freight_payment_document_no)
    {
      payment_string = '20%/'
    }  
    sap_data.append('BANK_REMARKS', payment_string+paymentRemarks)
    sap_data.append('BANK_PAYMENT', tripHirePaymentData.deduction_info ? sapPaymentPosting(2) : sapPaymentPosting(1))
    sap_data.append('POST_DATE', paymentPostingDate)

    /* ====== Request Sent To SAP For Payment Doc. Generation Start ========== */

    TripSheetClosureSapService.hireTripsheetPaymentPost(sap_data).then((res) => {

      console.log(res,'hireTripsheetPaymentPost')

      let sap_payment_doc_no = res.data.BANK_PAYMENT_DOC_NO
      let sap_payment_status = res.data.BANK_PAYMENT_STATUS
      let sap_payment_message = res.data.BANK_PAYMENT_MESSAGE
      let sap_payment_tripsheet = res.data.TRIPSHEET_NO

      console.log(sap_payment_doc_no + '/' + sap_payment_status + '/' + sap_payment_message + '/' + sap_payment_tripsheet)

      if(res.status == 200 && sap_payment_status == '1' && sap_payment_doc_no && sap_payment_message && sap_payment_tripsheet == tripHirePaymentData.trip_sheet_info.trip_sheet_no) {

          /* ====== Request Sent To SAP For Payment Doc. Generation End ========== */

          /* ====== Request Sent To LP DB For Payment Details Updation Start ========== */

          let form_data = new FormData()

          /* Common For Both Deduction Not Having & Deduction Having */

          form_data.append('parking_id', tripHirePaymentData.trip_sheet_info.parking_id)
          form_data.append('closure_id', tripHirePaymentData.trip_settlement_info.id)
          form_data.append('tripsheet_id', tripHirePaymentData.trip_sheet_info.trip_sheet_id)
          form_data.append('tripsheet_no', sap_payment_tripsheet)
          form_data.append('payment_posting_date', paymentPostingDate)
          form_data.append('payment_created_by', user_id)
          form_data.append('posted_balance_payment', tripHirePaymentData.deduction_info ? sapPaymentPosting(2) : sapPaymentPosting(1))
          form_data.append('payment_remarks', paymentRemarks)
          form_data.append('sap_payment_doc_no', sap_payment_doc_no)
          form_data.append('current_vendor_outstanding', vont)
          form_data.append('status', 2)

          /* Deduction Not Having Scenario (DB Table Insert Process) */
          if(tripHirePaymentData.deduction_info == null){

            /* Deduction Not Having : Data Formation */
            // form_data.append('vendor_name', tripHirePaymentData.vendor_info.owner_name)
            // form_data.append('vendor_code', tripHirePaymentData.vendor_info.vendor_code)
            form_data.append('vendor_name', hireVendorData.owner_name)
            form_data.append('vendor_code', hireVendorData.vendor_code)
            form_data.append('previous_vendor_outstanding', hireVendorOutstanding)
            form_data.append('unloading_deduction', deduction_type_amount[0])
            form_data.append('subdelivery_deduction', deduction_type_amount[1])
            form_data.append('weighment_deduction', deduction_type_amount[2])
            form_data.append('freight_deduction', deduction_type_amount[3])
            form_data.append('diversion_return_deduction', deduction_type_amount[4])
            form_data.append('halting_deduction', deduction_type_amount[5])
            form_data.append('toll_deduction', deduction_type_amount[6])
            form_data.append('sap_trip_expense_amount', sapTdsFreightData.TDS_AMT)
            form_data.append('previous_balance_payment', totalBalancePaymentAmount)
            form_data.append('created_by', user_id)

            TripSheetClosureService.createHireTripsheetDeduction(form_data).then((res)=>{
              console.log(res,'createHireTripsheetDeduction')
              setFetch(true)
              if (res.status == 200) {
                Swal.fire({
                  title: 'Hire Tripsheet - Payment Completed Successfully!',
                  icon: "success",
                  text:  'Payment Doc No : ' + sap_payment_doc_no,
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
                toast.warning('Hire Tripsheet Payment Failed. Kindly contact Admin..!')
              }
            })
            .catch((error) => {
              setFetch(true)
              console.log(error)
              var object = error.response.data.errors
              var output = ''
              for (var property in object) {
                output += '*' + object[property] + '\n'
              }
              setError(output)
              setErrorModal(true)
            })

          } else {

            /* Deduction Having Scenario (DB Table Update Process) */

            TripSheetClosureService.updateHireTripsheetPayment(form_data).then((res)=>{
              console.log(res,'updateHireTripsheetPayment')
              setFetch(true)
              if (res.status == 200) {
                Swal.fire({
                  title: 'Hire Tripsheet - Payment Completed Successfully!',
                  icon: "success",
                  text:  'Payment Doc No : ' + sap_payment_doc_no,
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
                toast.warning('Hire Tripsheet Payment Failed. Kindly contact Admin..!')
              }
            })
            .catch((error) => {
              setFetch(true)
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

          // form_data.append('other_deduction', user_id)
          // form_data.append('remarks', user_id)

      } else {
        setFetch(true)
        toast.warning('Payment Failed in SAP.. Kindly Contact Admin!')
      }

    })
    .catch((error) => {
      setFetch(true)
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

  return (
    <>
      {!fetch && <Loader />}

      {fetch && (
        <>
          {screenAccess ? (
            <>
              <CContainer className="mt-2">
                <CRow>
                  <CCol xs={12} md={4}>
                    <div className="w-100 p-3">
                      <CFormLabel htmlFor="tripsheetNumberNew">
                        Enter Tripsheet Number
                        <REQ />{' '}

                      </CFormLabel>
                      <CInputGroup>
                        <CFormInput
                          size="sm"
                          name="tripsheetNumberNew"
                          id="tripsheetNumberNew"
                          maxLength={15}
                          autoComplete='off'
                          value={tripsheetNumberNew}
                          onChange={handleChangenewtrip}
                        />
                        <CInputGroupText className="p-0">
                          <CButton
                            size="sm"
                            color="primary"
                            onClick={(e) => {
                              // setFetch(false)
                              setSmallFetch(false)
                              gettripHirePaymentData(e)
                            }}
                          >
                            <i className="fa fa-search px-1"></i>
                          </CButton>
                          <CButton
                            size="sm"
                            style={{ marginLeft:"3px" }}
                            color="primary"
                            onClick={() => {
                              window.location.reload(false)
                            }}
                          >
                            <i className="fa fa-refresh px-1"></i>
                          </CButton>
                        </CInputGroupText>
                      </CInputGroup>
                    </div>
                  </CCol>
                </CRow>

                {!smallfetch && <SmallLoader />}

                {smallfetch && Object.keys(tripHirePaymentData).length != 0  && (

                  <CCard style={{display: tripSheetHaving ? 'block' : 'none'}}  className="p-3">
                    <CTabContent className="p-3">
                      <CTabPane role="tabpanel" aria-labelledby="home-tab">
                      </CTabPane>
                    </CTabContent>

                    <CNav variant="tabs" role="tablist">
                      <CNavItem>
                        <CNavLink
                          active={activeKey === 1}
                          style={{ backgroundColor: 'green' }}
                          onClick={() => setActiveKey(1)}
                        >
                          General Information
                        </CNavLink>
                      </CNavItem>
                      <CNavItem>
                        <CNavLink
                          active={activeKey === 2}
                          style={{ backgroundColor: 'green' }}
                          onClick={() => setActiveKey(2)}
                        >
                          Tripsheet Information
                        </CNavLink>
                      </CNavItem>
                      {tripHirePaymentData.advance_info && (
                        <CNavItem>
                          <CNavLink
                            active={activeKey === 3}
                            style={{ backgroundColor: 'green' }}
                            onClick={() => setActiveKey(3)}
                          >
                            Advance Information
                          </CNavLink>
                        </CNavItem>
                      )}

                      <CNavItem>
                        <CNavLink
                          active={activeKey === 4}
                          style={{ backgroundColor: 'green' }}
                          onClick={() => setActiveKey(4)}
                        >
                          Expenses Information
                        </CNavLink>
                      </CNavItem>

                      <CNavItem>
                        <CNavLink
                          active={activeKey === 5}
                          style={{ backgroundColor: 'red' }}
                          onClick={() => setActiveKey(5)}
                        >
                          Payment
                        </CNavLink>
                      </CNavItem>

                    </CNav>

                    <CTabContent>
                      <CTabPane role="tabpanel" aria-labelledby="home-tab" visible={activeKey === 1}>
                        <CRow className="mt-2">

                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="vNum">Vehicle Number</CFormLabel>

                            <CFormInput size="sm" id="vNum" value={tripHirePaymentData.vehicle_number} readOnly />
                          </CCol>
                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="vCap">Vehicle Capacity in MTS</CFormLabel>

                            <CFormInput
                              size="sm"
                              id="vCap"
                              value={
                                tripHirePaymentData.vehicle_capacity_id ? tripHirePaymentData.vehicle_capacity_id.capacity : ''
                              }
                              readOnly
                            />
                          </CCol>

                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="vType">Vehicle Type</CFormLabel>

                            <CFormInput
                              size="sm"
                              id="vType"
                              value={tripHirePaymentData.vehicle_type_id ? tripHirePaymentData.vehicle_type_id.type : ''}
                              readOnly
                            />
                          </CCol>
                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="dName">Driver Name</CFormLabel>

                            <CFormInput size="sm" id="dName" value={tripHirePaymentData.driver_name} readOnly />
                          </CCol>
                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="dMob">Driver Cell Number</CFormLabel>

                            <CFormInput
                              size="sm"
                              id="dMob"
                              value={tripHirePaymentData.driver_contact_number}
                              readOnly
                            />
                          </CCol>


                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="gateInDateTime">Gate-In Date & Time</CFormLabel>

                            <CFormInput
                              size="sm"
                              id="gateInDateTime"
                              value={tripHirePaymentData.gate_in_date_time_string}
                              readOnly
                            />
                          </CCol>
                          {tripHirePaymentData.trip_sheet_info.purpose != 3 && (
                            <CCol xs={12} md={3}>
                              <CFormLabel htmlFor="inspectionDateTime">
                                Vehicle Inspection Date & Time
                              </CFormLabel>

                              <CFormInput
                                size="sm"
                                id="inspectionDateTime"
                                value={
                                  tripHirePaymentData.vehicle_inspection_trip
                                    ? tripHirePaymentData.vehicle_inspection_trip.inspection_time_string
                                    : 'No Inspection'
                                }
                                readOnly
                              />
                            </CCol>
                          )}
                          {tripHirePaymentData.trip_sheet_info.purpose != 3 && (
                            <CCol xs={12} md={3}>
                              <CFormLabel htmlFor="verifyDate">Doc. Verification Date & Time</CFormLabel>

                              <CFormInput
                                size="sm"
                                id="verifyDate"
                                value={
                                  tripHirePaymentData.vehicle_document
                                    ? tripHirePaymentData.vehicle_document.doc_verify_time_string
                                    : ''
                                }
                                readOnly
                              />
                            </CCol>
                          )}
                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="gateoutDate">Gate Out Date & Time</CFormLabel>

                            <CFormInput
                              size="sm"
                              id="gateoutDate"
                              value={tripHirePaymentData.gate_out_date_time_string}
                              readOnly
                            />
                          </CCol>
                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="shedName">Shed Name</CFormLabel>

                            <CFormInput
                              size="sm"
                              id="shedName"
                              // value={tripHirePaymentData.vendor_info && tripHirePaymentData.vendor_info.shed_info ? tripHirePaymentData.vendor_info.shed_info.shed_name : ''}
                              value={hireVendorData && hireVendorData.shed_info ? hireVendorData.shed_info.shed_name : ''}
                              readOnly
                            />
                          </CCol>
                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="shedOwnerName">Shed Owner Name</CFormLabel>

                            <CFormInput
                              size="sm"
                              id="shedOwnerName"
                              // value={
                              //   tripHirePaymentData.vendor_info && tripHirePaymentData.vendor_info.shed_info ? tripHirePaymentData.vendor_info.shed_info.shed_owner_name : ''
                              // }
                              value={hireVendorData && hireVendorData.shed_info ? hireVendorData.shed_info.shed_owner_name : ''}
                              readOnly
                            />
                          </CCol>
                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="shedOwnerMob">Shed Owner Cell Number</CFormLabel>

                            <CFormInput
                              size="sm"
                              id="shedOwnerMob"
                              // value={
                              //   tripHirePaymentData.vendor_info && tripHirePaymentData.vendor_info.shed_info
                              //     ? tripHirePaymentData.vendor_info.shed_info.shed_owner_phone_1
                              //     : ''
                              // }
                              value={hireVendorData && hireVendorData.shed_info ? hireVendorData.shed_info.shed_owner_phone_1 : ''}
                              readOnly
                            />
                          </CCol>
                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="vendorName">Vendor Name</CFormLabel>

                            <CFormInput
                              size="sm"
                              id="vendorName"
                              // value={tripHirePaymentData.vendor_info ? tripHirePaymentData.vendor_info.owner_name : ''}
                              value={hireVendorData ? hireVendorData.owner_name : ''}
                              readOnly
                            />
                          </CCol>
                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="vendorCode">Vendor Code</CFormLabel>

                            <CFormInput
                              size="sm"
                              id="vendorCode"
                              // value={tripHirePaymentData.vendor_info ? tripHirePaymentData.vendor_info.vendor_code : ''}
                              value={hireVendorData ? hireVendorData.vendor_code : ''}
                              readOnly
                            />
                          </CCol>
                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="vendorMob">Vendor Cell Number</CFormLabel>

                            <CFormInput
                              size="sm"
                              id="vendorMob"
                              // value={tripHirePaymentData.vendor_info ? tripHirePaymentData.vendor_info.owner_number : ''}
                              value={hireVendorData ? hireVendorData.owner_number : ''}
                              readOnly
                            />
                          </CCol>
                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="vendorPanNo">Vendor PAN Number</CFormLabel>

                            <CFormInput
                              size="sm"
                              id="vendorPanNo"
                              // value={tripHirePaymentData.vendor_info ? tripHirePaymentData.vendor_info.pan_card_number : ''}
                              value={hireVendorData ? hireVendorData.pan_card_number : ''}
                              readOnly
                            />
                          </CCol>
                        </CRow>
                      </CTabPane>
                      <CTabPane role="tabpanel" aria-labelledby="profile-tab" visible={activeKey === 2}>
                        <CRow className="mt-2">
                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="tNum">Tripsheet Number</CFormLabel>
                            <CFormInput
                              size="sm"
                              id="tNum"
                              value={
                                tripHirePaymentData.trip_sheet_info ? tripHirePaymentData.trip_sheet_info.trip_sheet_no : ''
                              }
                              readOnly
                            />
                          </CCol>
                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="vtf">Trip Purpose</CFormLabel>

                            <CFormInput
                              size="sm"
                              id="vtf"
                              value={
                                tripHirePaymentData.trip_sheet_info
                                  ? tripHirePaymentData.trip_sheet_info.purpose == 1
                                    ? 'FG-SALES'
                                    : tripHirePaymentData.trip_sheet_info.purpose == 2
                                    ? 'FG-STO'
                                    : tripHirePaymentData.trip_sheet_info.purpose == 3
                                    ? 'RM-STO'
                                    : tripHirePaymentData.trip_sheet_info.purpose == 4
                                    ? 'OTHERS'
                                    : ''
                                  : ''
                              }
                              readOnly
                            />
                          </CCol>
                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="to_division">Division Type</CFormLabel>

                            <CFormInput
                              size="sm"
                              id="to_division"
                              value={
                                tripHirePaymentData.trip_sheet_info
                                  ? tripHirePaymentData.trip_sheet_info.to_divison == 2
                                    ? 'CONSUMER'
                                    :  'Foods'
                                  : ''
                              }
                              readOnly
                            />
                          </CCol>
                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="advance_need">Trip Advance Eligibility</CFormLabel>

                            <CFormInput
                              size="sm"
                              id="advance_need"
                              value={
                                tripHirePaymentData.trip_sheet_info
                                  ? tripHirePaymentData.trip_sheet_info.trip_advance_eligiblity == 1
                                    ? 'YES'
                                    : 'NO'
                                  : ''
                              }
                              readOnly
                            />
                          </CCol>
                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="PlannedBankAdvance">
                              Planned Bank Advance
                            </CFormLabel>

                            <CFormInput
                              size="sm"
                              id="PlannedBankAdvance"
                              value={
                                tripHirePaymentData.trip_sheet_info
                                  ? (tripHirePaymentData.trip_sheet_info.advance_amount ? tripHirePaymentData.trip_sheet_info.advance_amount : 0)
                                  : '0'
                              }
                              readOnly
                            />
                          </CCol>
                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="PlannedDieselAdvance">
                              Planned Diesel Advance
                            </CFormLabel>

                            <CFormInput
                              size="sm"
                              id="PlannedDieselAdvance"
                              value={
                                tripHirePaymentData.trip_sheet_info
                                  ? (tripHirePaymentData.trip_sheet_info.advance_payment_diesel ? tripHirePaymentData.trip_sheet_info.advance_payment_diesel : 0)
                                  : '0'
                              }
                              readOnly
                            />
                          </CCol>
                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="PlannedFrpt">
                              Planned Freight Rate Per Ton
                            </CFormLabel>

                            <CFormInput
                              size="sm"
                              id="PlannedFrpt"
                              value={
                                tripHirePaymentData.trip_sheet_info
                                  ? tripHirePaymentData.trip_sheet_info.freight_rate_per_tone
                                  : '0'
                              }
                              readOnly
                            />
                          </CCol>
                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="inspectionDateTime">
                              Tripsheet Creation Date & Time
                            </CFormLabel>

                            <CFormInput
                              size="sm"
                              id="TSCreationDateTime"
                              value={
                                tripHirePaymentData.trip_sheet_info
                                  ? tripHirePaymentData.trip_sheet_info.tripsheet_creation_time_string
                                  : '---'
                              }
                              readOnly
                            />
                          </CCol>

                        </CRow>
                      </CTabPane>
                      <CTabPane role="tabpanel" aria-labelledby="profile-tab" visible={activeKey === 3}>
                        <CRow className="mt-2">
                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="TripActualFreight">
                              Trip Actual Freight
                            </CFormLabel>

                            <CFormInput
                              size="sm"
                              id="TripActualFreight"
                              value={
                                tripHirePaymentData.advance_info
                                  ? (tripHirePaymentData.advance_info.actual_freight ? tripHirePaymentData.advance_info.actual_freight : 0)
                                  : '0'
                              }
                              readOnly
                            />
                          </CCol>
                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="TripBankAdvance">
                              Trip Bank Advance
                            </CFormLabel>

                            <CFormInput
                              size="sm"
                              id="TripBankAdvance"
                              value={
                                tripHirePaymentData.advance_info
                                  ? (tripHirePaymentData.advance_info.advance_payment ? tripHirePaymentData.advance_info.advance_payment : 0)
                                  : '0'
                              }
                              readOnly
                            />
                          </CCol>
                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="TripDieselAdvance">
                              Trip Diesel Advance
                            </CFormLabel>

                            <CFormInput
                              size="sm"
                              id="TripDieselAdvance"
                              value={
                                tripHirePaymentData.advance_info
                                  ? (tripHirePaymentData.advance_info.advance_payment_diesel ? tripHirePaymentData.advance_info.advance_payment_diesel : 0)
                                  : '0'
                              }
                              readOnly
                            />
                          </CCol>
                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="TripVendorBalance">
                              Trip Vendor Balance
                            </CFormLabel>

                            <CFormInput
                              size="sm"
                              id="TripVendorBalance"
                              value={
                                tripHirePaymentData.advance_info
                                  ? tripPaymentBalanceFinder(tripHirePaymentData.advance_info)
                                  : '0'
                              }
                              readOnly
                            />
                          </CCol>
                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="TripFreightAdvanceDoc">
                            SAP Actual Freight Doc.
                            </CFormLabel>

                            <CFormInput
                              size="sm"
                              id="TripFreightAdvanceDoc"
                              value={
                                tripHirePaymentData.advance_info
                                  ? (tripHirePaymentData.advance_info.sap_freight_payment_document_no ? tripHirePaymentData.advance_info.sap_freight_payment_document_no : 0)
                                  : '0'
                              }
                              readOnly
                            />
                          </CCol>
                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="TripBankAdvanceDoc">
                              SAP Bank Advance Doc.
                            </CFormLabel>

                            <CFormInput
                              size="sm"
                              id="TripBankAdvanceDoc"
                              value={
                                tripHirePaymentData.advance_info
                                  ? (tripHirePaymentData.advance_info.sap_bank_payment_document_no ? tripHirePaymentData.advance_info.sap_bank_payment_document_no : 0)
                                  : '0'
                              }
                              readOnly
                            />
                          </CCol>
                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="TripDieselAdvanceDoc">
                              SAP Diesel Advance Doc.
                            </CFormLabel>

                            <CFormInput
                              size="sm"
                              id="TripDieselAdvanceDoc"
                              value={
                                tripHirePaymentData.advance_info
                                  ? (tripHirePaymentData.advance_info.sap_diesel_payment_document_no ? tripHirePaymentData.advance_info.sap_diesel_payment_document_no : 0)
                                  : '0'
                              }
                              readOnly
                            />
                          </CCol>
                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="TripPostingDate">
                              SAP Posting date & Time
                            </CFormLabel>

                            <CFormInput
                              size="sm"
                              id="TripPostingDate"
                              value={
                                tripHirePaymentData.advance_info
                                  ? (tripHirePaymentData.advance_info.sap_invoice_posting_date ? tripHirePaymentData.advance_info.sap_invoice_posting_date : '--')
                                  : '--'
                              }
                              readOnly
                            />
                          </CCol>
                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="TripVendorCode">
                              Vendor Code
                            </CFormLabel>

                            <CFormInput
                              size="sm"
                              id="TripVendorCode"
                              value={
                                tripHirePaymentData.advance_info
                                  ? (tripHirePaymentData.advance_info.vendor_code ? tripHirePaymentData.advance_info.vendor_code : 0)
                                  : '0'
                              }
                              readOnly
                            />
                          </CCol>
                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="TripVendorOutstanding">
                              Vendor Outstanding
                            </CFormLabel>

                            <CFormInput
                              size="sm"
                              id="TripVendorOutstanding"
                              value={
                                tripHirePaymentData.advance_info
                                  ? (tripHirePaymentData.advance_info.vendor_outstanding ? tripHirePaymentData.advance_info.vendor_outstanding : 0)
                                  : '0'
                              }
                              readOnly
                            />
                          </CCol>
                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="AdvanceUser">
                              Advance Given By
                            </CFormLabel>

                            <CFormInput
                              size="sm"
                              id="AdvanceUser"
                              value={
                                tripHirePaymentData.advance_info
                                  ? (tripHirePaymentData.advance_info.user_info ? tripHirePaymentData.advance_info.user_info.emp_name : '--')
                                  : '--'
                              }
                              readOnly
                            />
                          </CCol>
                        </CRow>
                      </CTabPane>
                      <CTabPane role="tabpanel" aria-labelledby="profile-tab" visible={activeKey === 4}>
                        <CRow className="mt-2">
                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="TripExpenseAmount">
                              Total Expense Amount
                            </CFormLabel>

                            <CFormInput
                              size="sm"
                              id="TripExpenseAmount"
                              value={
                                tripHirePaymentData.trip_settlement_info
                                  ? (tripHirePaymentData.trip_settlement_info.expense ? tripHirePaymentData.trip_settlement_info.expense : '0')
                                  : '0'
                              }
                              readOnly
                            />
                          </CCol>
                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="TripExpensePostingdate">
                              Expense Posting date
                            </CFormLabel>

                            <CFormInput
                              size="sm"
                              id="TripExpensePostingdate"
                              value={
                                tripHirePaymentData.trip_settlement_info
                                  ? (tripHirePaymentData.trip_settlement_info.expense_posting_date ? tripHirePaymentData.trip_settlement_info.expense_posting_date : '--')
                                  : '--'
                              }
                              readOnly
                            />
                          </CCol>
                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="TripExpenseDoc">
                              SAP Expense Doc.
                            </CFormLabel>

                            <CFormInput
                              size="sm"
                              id="TripExpenseDoc"
                              value={
                                tripHirePaymentData.trip_settlement_info
                                  ? (tripHirePaymentData.trip_settlement_info.expense_sap_document_no ? tripHirePaymentData.trip_settlement_info.expense_sap_document_no : '--')
                                  : '--'
                              }
                              readOnly
                            />
                          </CCol>
                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="TripExpenseRemarks">
                              Remarks
                            </CFormLabel>

                            <CFormInput
                              size="sm"
                              id="TripExpenseRemarks"
                              value={
                                tripHirePaymentData.trip_settlement_info
                                  ? (tripHirePaymentData.trip_settlement_info.income_remarks ? tripHirePaymentData.trip_settlement_info.income_remarks : '--')
                                  : '--'
                              }
                              readOnly
                            />
                          </CCol>
                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="UnloadingCharges">
                              Unloading Charges
                            </CFormLabel>

                            <CFormInput
                              size="sm"
                              id="UnloadingCharges"
                              value={
                                tripHirePaymentData.trip_settlement_info
                                  ? (tripHirePaymentData.trip_settlement_info.unloading_charges ? tripHirePaymentData.trip_settlement_info.unloading_charges : '0')
                                  : '0'
                              }
                              readOnly
                            />
                          </CCol>
                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="SubdeliveryCharges">
                              Subdelivery Charges
                            </CFormLabel>

                            <CFormInput
                              size="sm"
                              id="SubdeliveryCharges"
                              value={
                                tripHirePaymentData.trip_settlement_info
                                  ? (tripHirePaymentData.trip_settlement_info.sub_delivery_charges ? tripHirePaymentData.trip_settlement_info.sub_delivery_charges : '0')
                                  : '0'
                              }
                              readOnly
                            />
                          </CCol>
                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="WeighmentCharges">
                              Weighment Charges
                            </CFormLabel>

                            <CFormInput
                              size="sm"
                              id="WeighmentCharges"
                              value={
                                tripHirePaymentData.trip_settlement_info
                                  ? (tripHirePaymentData.trip_settlement_info.weighment_charges ? tripHirePaymentData.trip_settlement_info.weighment_charges : '0')
                                  : '0'
                              }
                              readOnly
                            />
                          </CCol>
                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="FreightCharges">
                            Freight Charges
                            </CFormLabel>

                            <CFormInput
                              size="sm"
                              id="FreightCharges"
                              value={
                                tripHirePaymentData.trip_settlement_info
                                  ? (tripHirePaymentData.trip_settlement_info.freight_charges ? tripHirePaymentData.trip_settlement_info.freight_charges : '0')
                                  : '0'
                              }
                              readOnly
                            />
                          </CCol>
                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="Stock_Diversion_Return_Charges">
                              Stock Diversion / Return Charges
                            </CFormLabel>

                            <CFormInput
                              size="sm"
                              id="Stock_Diversion_Return_Charges"
                              value={
                                tripHirePaymentData.trip_settlement_info
                                  ? (tripHirePaymentData.trip_settlement_info.diversion_return_charges ? tripHirePaymentData.trip_settlement_info.diversion_return_charges : '0')
                                  : '0'
                              }
                              readOnly
                            />
                          </CCol>
                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="HaltingCharges">
                            Halting Charges
                            </CFormLabel>

                            <CFormInput
                              size="sm"
                              id="HaltingCharges"
                              value={
                                tripHirePaymentData.trip_settlement_info
                                  ? (tripHirePaymentData.trip_settlement_info.halting_charges ? tripHirePaymentData.trip_settlement_info.halting_charges : '0')
                                  : '0'
                              }
                              readOnly
                            />
                          </CCol>
                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="TollAmount">
                            Toll Amount
                            </CFormLabel>

                            <CFormInput
                              size="sm"
                              id="TollAmount"
                              value={
                                tripHirePaymentData.trip_settlement_info
                                  ? (tripHirePaymentData.trip_settlement_info.toll_amount ? tripHirePaymentData.trip_settlement_info.toll_amount : '0')
                                  : '0'
                              }
                              readOnly
                            />
                          </CCol>
                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="tripStatus">
                              Tripsheet Status
                            </CFormLabel>

                            <CFormInput
                              size="sm"
                              id="tripStatus"
                              value={
                                tripHirePaymentData.trip_settlement_info
                                  ? (tripHirePaymentData.trip_settlement_info.tripsheet_is_settled ? tripSettlementStatusFinder(tripHirePaymentData.trip_settlement_info.tripsheet_is_settled) : '--')
                                  : '--'
                              }
                              readOnly
                            />
                          </CCol>
                        </CRow>
                      </CTabPane>
                      <CTabPane role="tabpanel" aria-labelledby="profile-tab" visible={activeKey === 5}>
                        <CRow className="mt-2">
                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="TripTotalFreight">
                              LP - Total Freight Amount
                            </CFormLabel>

                            <CFormInput
                              size="sm"
                              id="TripTotalFreight"
                              value={
                                tripHirePaymentData.advance_info
                                  ? (tripHirePaymentData.advance_info.actual_freight ? tripHirePaymentData.advance_info.actual_freight : 0)
                                  : tripHirePaymentData.trip_settlement_info
                                  ? (tripHirePaymentData.trip_settlement_info.freight_charges ? tripHirePaymentData.trip_settlement_info.freight_charges : '0')
                                  : '0'
                              }
                              readOnly
                            />
                          </CCol>

                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="TripAditionalExpense">
                              LP - Additional Expenses
                            </CFormLabel>

                            <CFormInput
                              size="sm"
                              id="TripAditionalExpense"
                              value={TripAditionalExpenseFinder(tripHirePaymentData.trip_settlement_info)}
                              readOnly
                            />
                          </CCol>
                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="TripAditionalExpense">
                              LP - Total Trip Expenses
                            </CFormLabel>

                            <CFormInput
                              size="sm"
                              id="TripAditionalExpense"
                              value={
                                tripHirePaymentData.trip_settlement_info
                                  ? (tripHirePaymentData.trip_settlement_info.expense ? tripHirePaymentData.trip_settlement_info.expense : '0')
                                  : '0'
                              }
                              readOnly
                            />
                          </CCol>
                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="Current_vendor_Outstanding">
                              SAP - Current Vendor Outstanding
                            </CFormLabel>

                            <CFormInput
                              size="sm"
                              id="Current_vendor_Outstanding"
                              value={hireVendorOutstanding}
                              readOnly
                            />
                          </CCol>
                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="TripBankDieselAdvance">
                              Bank Advance / Diesel Advance
                            </CFormLabel>

                            <CFormInput
                              size="sm"
                              id="TripBankDieselAdvance"
                              value={
                                (tripHirePaymentData.advance_info
                                  ? (tripHirePaymentData.advance_info.advance_payment ? tripHirePaymentData.advance_info.advance_payment : '0')
                                  : '0') + ' / ' + (tripHirePaymentData.advance_info
                                  ? (tripHirePaymentData.advance_info.advance_payment_diesel ? tripHirePaymentData.advance_info.advance_payment_diesel : '0')
                                  : '0')
                              }
                              readOnly
                            />
                          </CCol>

                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="TripAdvance">
                              Total Trip Advance
                            </CFormLabel>

                            <CFormInput
                              size="sm"
                              id="TripAdvance"
                              value={
                                tripHirePaymentData.advance_info
                                  ? (tripHirePaymentData.advance_info.advance_payment && tripHirePaymentData.advance_info.advance_payment_diesel ? Number(parseFloat(tripHirePaymentData.advance_info.advance_payment).toFixed(2)) + Number(parseFloat(tripHirePaymentData.advance_info.advance_payment_diesel).toFixed(2)) : '0')
                                  : '0'
                              }
                              readOnly
                            />
                          </CCol>

                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="TdsType">
                              TDS Type
                            </CFormLabel>

                            <CFormInput
                              size="sm"
                              id="TdsType"
                              value={(tripHirePaymentData.vendor_info && tripHirePaymentData.vendor_info.gst_tax_code ? gstTaxCodeName(tripHirePaymentData.vendor_info.gst_tax_code) : '--')}
                              readOnly
                            />
                          </CCol>

                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="TdsHaving">
                              TDS Applicable
                            </CFormLabel>

                            <CFormInput
                              size="sm"
                              id="TdsHaving"
                              value={
                                tripHirePaymentData.trip_settlement_info
                                  ? (tripHirePaymentData.trip_settlement_info.tds_having == '1' ? 'Yes' : 'No')
                                  : 'No'
                              }
                              readOnly
                            />
                          </CCol>

                          { sapTdsFreightData && (
                            <>
                              { sapTdsFreightData.FRE_DOC_NO != '' && (
                                <>
                                  <CCol xs={12} md={3}>
                                    <CFormLabel htmlFor="AdvanceFreightDoc">
                                      SAP Freight Expense Amount
                                    </CFormLabel>

                                    <CFormInput
                                      size="sm"
                                      id="AdvanceFreightDoc"
                                      value={sapTdsFreightData.FRE_AMT}
                                      readOnly
                                    />
                                  </CCol>
                                  <CCol xs={12} md={3}>
                                    <CFormLabel htmlFor="AdditionalExpenseDoc">
                                      SAP Additional Expenses Amount
                                    </CFormLabel>

                                    <CFormInput
                                      size="sm"
                                      id="AdditionalExpenseDoc"
                                      value={sapTdsFreightData.EXP_AMT}
                                      readOnly
                                    />
                                  </CCol>
                                </>
                              )}
                              <CCol xs={12} md={3}>
                                <CFormLabel htmlFor="TotalExpenseDoc">
                                  SAP Total Expenses Amount
                                </CFormLabel>

                                <CFormInput
                                  size="sm"
                                  id="TotalExpenseDoc"
                                  value={sapTdsFreightData.TDS_AMT}
                                  readOnly
                                />
                              </CCol>
                            </>
                          )}

                          {tripHirePaymentData.deduction_info && (
                            <>
                              <CCol xs={12} md={3}>
                                <CFormLabel htmlFor="PreviousVendorOutstanding">
                                  Vendor Outstanding Before Deduction
                                </CFormLabel>

                                <CFormInput
                                  size="sm"
                                  id="PreviousVendorOutstanding"
                                  value={tripHirePaymentData.deduction_info.previous_vendor_outstanding}
                                  readOnly
                                />
                              </CCol>
                              <CCol xs={12} md={3}>
                                <CFormLabel htmlFor="freight_deduction_charge">
                                  Freight Deduction
                                </CFormLabel>

                                <CFormInput
                                  size="sm"
                                  id="freight_deduction_charge"
                                  value={tripHirePaymentData.deduction_info.freight_deduction}
                                  readOnly
                                />
                              </CCol>
                              <CCol xs={12} md={3}>
                                <CFormLabel htmlFor="unloading_subdelivery_deduction_charge">
                                  Un-loading / Sub-delivery Deduction
                                </CFormLabel>

                                <CFormInput
                                  size="sm"
                                  id="unloading_subdelivery_deduction_charge"
                                  value={tripHirePaymentData.deduction_info.unloading_deduction + ' / ' + tripHirePaymentData.deduction_info.subdelivery_deduction}
                                  readOnly
                                />
                              </CCol>
                              <CCol xs={12} md={3}>
                                <CFormLabel htmlFor="weighment_diversion_deduction_charge">
                                  Weighment / Diversion Deduction
                                </CFormLabel>

                                <CFormInput
                                  size="sm"
                                  id="weighment_diversion_deduction_charge"
                                  value={tripHirePaymentData.deduction_info.weighment_deduction + ' / ' + tripHirePaymentData.deduction_info.diversion_return_deduction}
                                  readOnly
                                />
                              </CCol>
                              <CCol xs={12} md={3}>
                                <CFormLabel htmlFor="halting_toll_deduction_charge">
                                  Halting / Toll Deduction
                                </CFormLabel>

                                <CFormInput
                                  size="sm"
                                  id="halting_toll_deduction_charge"
                                  value={tripHirePaymentData.deduction_info.halting_deduction + ' / ' + tripHirePaymentData.deduction_info.toll_deduction}
                                  readOnly
                                />
                              </CCol>
                              <CCol xs={12} md={3}>
                                <CFormLabel htmlFor="total_deduction_charge">
                                  Total Deduction
                                </CFormLabel>

                                <CFormInput
                                  size="sm"
                                  id="total_deduction_charge"
                                  value={tripHirePaymentData.deduction_info.total_deduction}
                                  readOnly
                                />
                              </CCol>
                              <CCol xs={12} md={3}>
                                <CFormLabel htmlFor="total_balance_payment_amount">
                                  Trip Balance Amount
                                </CFormLabel>
                                <CFormInput
                                  id="total_balance_payment_amount"
                                  name="total_balance_payment_amount"
                                  value={tripHirePaymentData.deduction_info.previous_balance_payment}
                                  size="sm"
                                  readOnly
                                />
                              </CCol>
                              {sapPaymentPostingPossibility && (
                                <>
                                  <CCol xs={12} md={3}>
                                    <CFormLabel htmlFor="sap_balance_payment_amount">
                                      SAP Posting Payment
                                    </CFormLabel>
                                    <br />
                                    <CFormInput
                                      id="sap_balance_payment_amount"
                                      name="sap_balance_payment_amount"
                                      value={sapPaymentPosting(2)}
                                      size="sm"
                                      readOnly
                                    />
                                  </CCol>
                                  <CCol xs={12} md={3}>
                                    <CFormLabel htmlFor="after_payment_vendor_outstanding">
                                      After Payment - Vendor Outstanding
                                    </CFormLabel>
                                    <br />
                                    <CFormInput
                                      id="after_payment_vendor_outstanding"
                                      name="after_payment_vendor_outstanding"
                                      value={vont}
                                      size="sm"
                                      readOnly
                                    />
                                  </CCol>
                                </>
                              )}
                              <CCol xs={12} md={3}>
                                <CFormLabel htmlFor="deduction_remarks">
                                  Deduction Remarks
                                </CFormLabel>

                                <CFormInput
                                  size="sm"
                                  id="deduction_remarks"
                                  value={tripHirePaymentData.deduction_info.deduction_remarks || '--'}
                                  readOnly
                                />
                              </CCol>
                              <CCol xs={12} md={3}>
                                <CFormLabel htmlFor="deduction_posting_date">
                                  Deduction SAP Posting Date
                                </CFormLabel>

                                <CFormInput
                                  size="sm"
                                  id="deduction_posting_date"
                                  value={tripHirePaymentData.deduction_info.deduction_posting_date}
                                  readOnly
                                />
                              </CCol>
                              <CCol xs={12} md={3}>
                                <CFormLabel htmlFor="deduction_date_time">
                                  Deduction Date & Time
                                </CFormLabel>

                                <CFormInput
                                  size="sm"
                                  id="deduction_date_time"
                                  value={tripHirePaymentData.deduction_info.created_at_format}
                                  readOnly
                                />
                              </CCol>
                            </>
                          )}

                          {tripHirePaymentData.deduction_info == null && (
                            <>
                              <CCol xs={12} md={3}>
                                <CFormLabel htmlFor="total_balance_payment_amount">
                                  Trip Balance Amount
                                </CFormLabel>
                                <br />
                                <CFormInput
                                  id="total_balance_payment_amount"
                                  name="total_balance_payment_amount"
                                  value={totalBalancePaymentAmount}
                                  size="sm"
                                  readOnly
                                />
                              </CCol>
                              {sapPaymentPostingPossibility && (
                                <>
                                  <CCol xs={12} md={3}>
                                    <CFormLabel htmlFor="sap_balance_payment_amount">
                                      SAP Posting Payment
                                    </CFormLabel>
                                    <br />
                                    <CFormInput
                                      id="sap_balance_payment_amount"
                                      name="sap_balance_payment_amount"
                                      value={sapPaymentPosting(1)}
                                      size="sm"
                                      readOnly
                                    />
                                  </CCol>
                                  <CCol xs={12} md={3}>
                                    <CFormLabel htmlFor="after_payment_vendor_outstanding">
                                      After Payment - Vendor Outstanding
                                    </CFormLabel>
                                    <br />
                                    <CFormInput
                                      id="after_payment_vendor_outstanding"
                                      name="after_payment_vendor_outstanding"
                                      value={vont}
                                      size="sm"
                                      readOnly
                                    />
                                  </CCol>
                                </>
                              )}
                            </>
                          )}

                          {/* <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="truckClean">
                              Deduction Having <REQ />{' '}
                            </CFormLabel>
                            <br />
                            <CButtonGroup role="group" aria-label="Basic checkbox toggle button group">
                              <CFormCheck
                                type="radio"
                                button={{ color: 'success', variant: 'outline' }}
                                name="deduction_having"
                                id="btnradio1"
                                onChange={(e) => {deductionChange(e)}}
                                autoComplete="off"
                                value="1"
                                label="Yes"
                              />

                              <CFormCheck
                                type="radio"
                                button={{ color: 'danger', variant: 'outline' }}
                                name="deduction_having"
                                id="btnradio2"
                                autoComplete="off"
                                onChange={(e) => {deductionChange(e)}}
                                value="0"
                                label="No"
                              />
                            </CButtonGroup>
                          </CCol> */}


                          {/* <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="deduction_remarks">Deduction Remarks</CFormLabel>
                            <CFormTextarea
                              name="deduction_remarks"
                              id="deduction_remarks"
                              rows="1"
                              onChange={(e) => {remarksHandleChange(e,'1')}}
                              value={deductionRemarks}
                            ></CFormTextarea>
                          </CCol> */}
                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="payment_remarks">Payment Remarks</CFormLabel>
                            <CFormTextarea
                              name="payment_remarks"
                              id="payment_remarks"
                              rows="1"
                              onChange={(e) => {remarksHandleChange(e,'2')}}
                              value={paymentRemarks}
                            ></CFormTextarea>
                          </CCol>
                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="payment_posting_date">
                              Payment Posting Date <REQ />{' '}
                            </CFormLabel>
                            <CFormInput
                              size="sm"
                              type="date"
                              id="payment_posting_date"
                              name="payment_posting_date"
                              min={Expense_Income_Posting_Date.min_date}
                              max={Expense_Income_Posting_Date.max_date}
                              onKeyDown={(e) => {
                                e.preventDefault();
                              }}
                              onChange={(e) => {remarksHandleChange(e,'3')}}
                              value={paymentPostingDate}
                            />
                          </CCol>
                        </CRow>
                        <CRow>
                          <CCol
                            className="offset-md-9"
                            xs={12}
                            sm={12}
                            md={3}
                            // style={{ display: 'flex', justifyContent: 'space-between' }}
                            style={{ display: 'flex', flexDirection: 'row-reverse', cursor: 'pointer' }}
                          >

                            <CButton
                              size="sm"
                              color="warning"
                              disabled={!sapPaymentPostingPossibility}
                              className="mx-3 text-white"
                              onClick={() => {
                                paymentSubmissionValidation()
                              }}
                              type="submit"
                            >
                              Submit
                            </CButton>
                            {!sapPaymentPostingPossibility && (<span className="text-danger">* Payment Not Possible</span>)}
                          </CCol>
                        </CRow>
                      </CTabPane>
                    </CTabContent>
                    {/* ============== Settlement Submit Confirm Button Modal Area Start ================= */}
                    <CModal
                      visible={paymentSubmit}
                      size='lg'
                      backdrop="static"
                      // scrollable
                      onClose={() => {
                        setPaymentSubmit(false)
                      }}
                    >
                      <CModalBody>
                        <p className="lead">Are you sure to Post the Payment Details to SAP in <span style={{color:'red'}}>{`${sapBookDivision == 2 ? 'NLCD Book': 'NLLD Book'}`}</span>?</p>
                      </CModalBody>
                      <CModalFooter>
                        <CButton
                          className="m-2"
                          color="warning"
                          onClick={() => {
                            setPaymentSubmit(false)
                            TripsheetPaymentSubmit()
                          }}
                        >
                          Yes
                        </CButton>
                        <CButton
                          color="secondary"
                          onClick={() => {
                            setPaymentSubmit(false)
                          }}
                        >
                          No
                        </CButton>
                      </CModalFooter>
                    </CModal>
                    {/* ============== Settlement Submit Confirm Button Modal Area End ================= */}
                    {/* Error Modal Section Start */}
                      <CModal visible={errorModal} onClose={() => setErrorModal(false)}>
                        <CModalHeader>
                          <CModalTitle className="h4">Error</CModalTitle>
                        </CModalHeader>
                        <CModalBody>
                          <CRow>
                            <CCol>
                              {error && (
                                <CAlert color="danger" data-aos="fade-down">
                                  {error}
                                </CAlert>
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
                    {/* Error Modal Section End */}
                  </CCard>

                )}

              </CContainer>
            </> ) : (<AccessDeniedComponent />)
          }
        </>
      )}
    </>
  )
}

export default TripsheetHirePayment
