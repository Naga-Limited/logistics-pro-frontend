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
  CCardImage,
} from '@coreui/react'
import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import Loader from 'src/components/Loader'
import SmallLoader from 'src/components/SmallLoader'
import TripSheetClosureService from 'src/Service/TripSheetClosure/TripSheetClosureService'
import VendorOutstanding from 'src/Service/SAP/VendorOutstanding'
// import ExpenseIncomePostingDate from '../TripsheetClosure/Calculations/ExpenseIncomePostingDate'
import DefinitionsListApi from 'src/Service/Definitions/DefinitionsListApi'
import TripSheetClosureSapService from 'src/Service/SAP/TripSheetClosureSapService'
import Swal from 'sweetalert2'
import * as LogisticsProScreenNumberConstants from 'src/components/constants/LogisticsProScreenNumberConstants'
import AccessDeniedComponent from 'src/components/commoncomponent/AccessDeniedComponent'
import JavascriptInArrayComponent from 'src/components/commoncomponent/JavascriptInArrayComponent'
import ExpenseIncomePostingDate from 'src/Pages/TripsheetClosure/Calculations/ExpenseIncomePostingDate'
import RakeClosureSubmissionService from 'src/Service/RakeMovement/RakeClosureSubmission/RakeClosureSubmissionService'
import CustomTable from 'src/components/customComponent/CustomTable'
import { formatDateAsDDMMYYY } from '../CommonMethods/CommonMethods'
import RakeTripsheetSapService from 'src/Service/SAP/RakeTripsheetSapService'
import JavascriptDateCheckComponent from 'src/components/commoncomponent/JavascriptDateCheckComponent'

const RakePayment = () => {
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
  const [tripRPSClosureData, setTripRPSClosureData] = useState({})
  const [sapTdsFreightData, setSapTdsFreightData] = useState({})
  const [hireVendorData, setHireVendorData] = useState({})
  const [tdsTaxTermsData, setTdsTaxTermsData] = useState([])
  const [tripSheetHaving, setTripsheetHaving] = useState(false)
  const [rPSHaving, setRPSHaving] = useState(false)
  const [paymentSubmit, setPaymentSubmit] = useState(false)
  const [sapPaymentPostingPossibility, setSapPaymentPostingPossibility] = useState(false)
  const [vont, setVont] = useState(0) /* Vendor Outstanding Next Trip */
  const [activeKey, setActiveKey] = useState(1)
  const [hireVendorCode, setHireVendorCode] = useState(0)
  const [hireVendorOutstanding, setHireVendorOutstanding] = useState(0)
  const [totalDeductionAmount, setTotalDeductionAmount] = useState(0)
  const [totalBalancePaymentAmount, setTotalBalancePaymentAmount] = useState(0)
  const [sapPostingPayment, setSapPostingPayment] = useState(0)
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

  const [rakeRowData, setRakeRowData] = useState([])
  const [visible, setVisible] = useState(false)
  const [fiImgSrc, setFiImgSrc] = React.useState(null);

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

  const [tripRPSNumberNew, setTripRPSNumberNew] = useState('');
  const handleChangenewtrip = event => {
    let tripResult = event.target.value.toUpperCase();
    setTripRPSNumberNew(tripResult.trim());

  };

  const tdsTaxCodeName = (code) => {
    let tds_tax_code_name = '-'

    tdsTaxTermsData.map((val, key) => {
      if (val.definition_list_code == code) {
        tds_tax_code_name = val.definition_list_name
      }
    })

    console.log(tds_tax_code_name,'tds_tax_code_name')

    return tds_tax_code_name
  }

  useEffect(()=>{

    let v_o_n_t = 0
    console.log(hireVendorOutstanding,'11111 - hireVendorOutstanding')
    console.log(sapPostingPayment,'11111 - sapPostingPayment')

    let difference_amount = (getInt(sapPostingPayment)) - getInt(hireVendorOutstanding)

    if(sapPostingPayment <= 0){
      setSapPaymentPostingPossibility(false)
      v_o_n_t = 0
    } else {
      if(difference_amount > sapPostingPayment){
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

      let sap_payment_amount = sapPaymentPosting()
      console.log(sap_payment_amount,'sap_payment_amount')
      console.log(sap_payment_amount == sapPostingPayment,'sap_payment_amount == sapPostingPayment')
      let needed_val = 0
      if(sap_payment_amount == sapPostingPayment){
        needed_val = getInt(hireVendorOutstanding)+getInt(sapPostingPayment)
        setVont(needed_val)
      } else {
        setVont(needed_val)
      }
      console.log(needed_val,'v-0-n-t')
    }

  },[hireVendorOutstanding,totalBalancePaymentAmount,sapPaymentPostingPossibility,vont,sapPostingPayment])

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
    console.log(tripRPSNumberNew,'tripRPSNumberNew')
    if(/^[a-zA-Z0-9]+$/i.test(tripRPSNumberNew) && /[a-zA-Z]/.test(tripRPSNumberNew) && /[0-9]/.test(tripRPSNumberNew)){
        RakeClosureSubmissionService.getExpenseApprovalInfoByRPSForFiPayment(tripRPSNumberNew).then((res) => {

        let tableReportData = res.data.data
        console.log(res.data.data,'getExpenseApprovalInfoByRPSForFiPayment')
        let bpa = Number(parseFloat(tableReportData.total_expense_amount).toFixed(3)) + Number(parseFloat(tableReportData.deduction_expenses).toFixed(3))
        console.log(bpa,'bpa')
        setTripsheetHaving(true)
        setRPSHaving(true)

        if (res.status == 200 && res.data != '') {

          // setSmallFetch(true)
          setTripHirePaymentData(tableReportData)
          setTripRPSClosureData(tableReportData)
          setTotalBalancePaymentAmount(bpa)
          setHireVendorData(tableReportData.rake_vendor_info)
          setHireVendorCode(tableReportData.rake_vendor_info.v_code)
          toast.success('RPS Details Detected!')

        } else {

          setTripHirePaymentData([])
          setTripRPSClosureData([])
          setHireVendorCode(0)
          setTotalBalancePaymentAmount(0)
          setHireVendorData({})
          setTripsheetHaving(false)
          setRPSHaving(false)
          setSmallFetch(true)
          if (res.status == 201 && (res.data.status == '1' ||res.data.status == '2')) {
            toast.warning(res.data.message)
          } else {
            setSmallFetch(true)
            toast.warning('RPS Details cannot be detected from LP!')
          }
        }
      })
    } else {

      setTripHirePaymentData([])
      setTripRPSClosureData([])
      setHireVendorCode(0)
      setTotalBalancePaymentAmount(0)
      setTripsheetHaving(false)
      setRPSHaving(false)
      setSmallFetch(true)
      // toast.warning('RPS Number Must Like "AB123456789"')
      toast.warning('RPS Number Must Like "RPS1234567"')
      return false
    }

  }

  useEffect(() => {
    loadRakeTripFIReport()
  }, [tripRPSClosureData])

  const rake_column = [
    {
      name: 'S.No',
      selector: (row) => row.SNO,
      sortable: true,
      center: true,
    },
    {
      name: 'RPS No',
      selector: (row) => row.RPS_NO,
      sortable: true,
      center: true,
    },
    {
      name: 'FNR No',
      selector: (row) => row.FNR_NO,
      sortable: true,
      center: true,
    },
    {
      name: 'Plant',
      selector: (row) => row.RAKE_LOC,
      sortable: true,
      center: true,
    },
    {
      name: 'Vendor Name',
      selector: (row) => row.VENDOR_NAME,
      sortable: true,
      center: true,
    },
    {
      name: 'Vendor Code',
      selector: (row) => row.VENDOR_CODE,
      sortable: true,
      center: true,
    },
    {
      name: 'FI Entry Type',
      selector: (row) => row.FI_TYPE,
      sortable: true,
      center: true,
    },
    {
      name: 'Income Division',
      selector: (row) => row.INCOME_DIV,
      sortable: true,
      center: true,
    },
    {
      name: 'GST Tax Type',
      selector: (row) => row.GST_TAX,
      sortable: true,
      center: true,
    },
    {
      name: 'TDS Available',
      selector: (row) => row.TDS_AVAIL,
      sortable: true,
      center: true,
    },
    {
      name: 'TDS Tax Type',
      selector: (row) => row.TDS_TAX,
      sortable: true,
      center: true,
    },
    {
      name: 'GL Count',
      selector: (row) => row.GL_COUNT,
      sortable: true,
      center: true,
    },
    {
      name: 'Supp. Ref. No',
      selector: (row) => row.SUP_REF_NO,
      sortable: true,
      center: true,
    },
    {
      name: 'Supp. Doc. Date',
      selector: (row) => row.SUP_DOC_DATE,
      sortable: true,
      center: true,
    },
    {
      name: 'FI Doc. No',
      selector: (row) => row.INCOME_FI_DOC,
      sortable: true,
      center: true,
    },
    {
      name: 'FI TDS Doc. No',
      selector: (row) => row.INCOME_FI_TDS_DOC,
      sortable: true,
      center: true,
    },
    {
      name: 'Attachment',
      selector: (row) => row.ATTACHMENT,
      // sortable: true,
      center: true,
    },
    {
      name: 'SAP Posting Date',
      selector: (row) => row.POSTING_DATE,
      sortable: true,
      center: true,
    },
    {
      name: 'GL Code',
      selector: (row) => row.INCOME_GL,
      sortable: true,
      center: true,
    },
    {
      name: 'GL Code',
      selector: (row) => row.GL_TYPE,
      sortable: true,
      center: true,
    },
    {
      name: 'GL Amount',
      selector: (row) => row.GL_AMOUNT,
      sortable: true,
      center: true,
    },
    {
      name: 'Amount',
      selector: (row) => row.INCOME_EXPENSE_AMOUNT,
      sortable: true,
      center: true,
    },
    {
      name: 'Remarks',
      selector: (row) => row.FI_REMARKS,
      sortable: true,
      center: true,
    },
    {
      name: 'TDS Remarks',
      selector: (row) => row.FI_TDS_REMARKS,
      sortable: true,
      center: true,
    },
    {
      name: 'Created By',
      selector: (row) => row.USER_NAME,
      sortable: true,
      center: true,
    },
    {
      name: 'Creation Time',
      selector: (row) => row.CREATION_TIME,
      sortable: true,
      center: true,
    },
  ]

  const border = {
    borderColor: '#b1b7c1',
    cursor: 'pointer'
  }

  const RakeFI_Array = ['','Expense Credit','Expense Debit','Income Credit','Income Debit']
  const RakePlant_Array = []
  RakePlant_Array['R1'] = 'Dindigul'
  RakePlant_Array['R2'] = 'Aruppukottai'

  const loadRakeTripFIReport = () => {
    console.log(tripRPSNumberNew,'loadRakeTripFIReport-tripRPSNumberNew')
    if(tripRPSNumberNew){
      RakeClosureSubmissionService.getFIInfoByRPS(tripRPSNumberNew).then((res) => {
        let tableReportData = res.data.data
        console.log(res.data.data,'getFIInfoByRPS')
        let rowDataList = []
        let filterData = tableReportData
        console.log(filterData)
        let indexNo = 0
        filterData.map((data, index) => {
          console.log(data,'getFIInfoByRPSChild',index)
          if(data.fi_entry_mode == 3 || data.fi_entry_mode == 4){
            indexNo += 1
            rowDataList.push({
              SNO: indexNo,
              RPS_NO: data.rps_no,
              FNR_NO: data.fnr_no,
              RAKE_LOC: RakePlant_Array[data.rake_plant_code],
              RPS_DATE: data.created_at_date,
              VENDOR_NAME: data.vendor_info.v_name,
              VENDOR_CODE:data.vendor_code,
              INCOME_DIV:data.income_division,
              FI_TYPE: RakeFI_Array[data.fi_entry_mode],
              FI_REMARKS:data.fi_remarks,
              FI_TDS_REMARKS:data.fi_tds_remarks,
              INCOME_GL:data.income_gl_code,
              GL_AMOUNT:data.amount,
              INCOME_EXPENSE_AMOUNT:data.amount,
              INCOME_FI_DOC:data.sap_fi_doc_no,
              ATTACHMENT:(
                <span
                  onClick={() => {
                    setVisible(!visible)
                    setFiImgSrc(data.attachment_copy)
                  }}
                  className="w-100 m-0"
                  color="info"
                  size="sm"
                  id="odoImg"
                  style={border}
                >
                  <span className="float-start">
                    <i className="fa fa-eye" aria-hidden="true"></i>
                  </span>
                </span>
              ),
              INCOME_FI_TDS_DOC:data.sap_fi_tds_doc_no,
              POSTING_DATE:formatDateAsDDMMYYY(data.sap_posting_date),
              USER_NAME:data.fi_user_info.emp_name,
              CREATION_TIME: data.fi_date_time_string,
              GST_TAX:'--',
              TDS_AVAIL:'--',
              TDS_TAX:'--',
              GL_COUNT:'1',
              SUP_REF_NO:'--',
              SUP_DOC_DATE:'--',
              GL_TYPE:'FREIGHT INCOME - INTER COMPANY',
            })

          } else {
            data.freight_gl_info.map((data1, index2) => {
              indexNo += 1
              rowDataList.push({
                SNO: indexNo,
                RPS_NO: data.rps_no,
                FNR_NO: data.fnr_no,
                RAKE_LOC: RakePlant_Array[data.rake_plant_code],
                RPS_DATE: data.created_at_date,
                VENDOR_NAME: data.vendor_info.v_name,
                VENDOR_CODE:data.vendor_code,
                INCOME_DIV:data.income_division,
                FI_TYPE: RakeFI_Array[data.fi_entry_mode],
                FI_REMARKS:data.fi_remarks,
                FI_TDS_REMARKS:'--',
                INCOME_GL:data1.GL_CODE,
                GL_AMOUNT:data1.EXPENSE_AMT,
                INCOME_EXPENSE_AMOUNT:data.amount,
                INCOME_FI_DOC:data.sap_fi_doc_no,
                ATTACHMENT:(
                  <span
                    onClick={() => {
                      setVisible(!visible)
                      setFiImgSrc(data.attachment_copy)
                    }}
                    className="w-100 m-0"
                    color="info"
                    size="sm"
                    id="odoImg"
                    style={border}
                  >
                    <span className="float-start">
                      <i className="fa fa-eye" aria-hidden="true"></i>
                    </span>
                  </span>
                ),
                INCOME_FI_TDS_DOC:'--',
                POSTING_DATE:formatDateAsDDMMYYY(data.sap_posting_date),
                USER_NAME:data.fi_user_info.emp_name,
                CREATION_TIME: data.fi_date_time_string,
                GST_TAX:data.gst_tax_type,
                TDS_AVAIL:data.tds_available == '1' ? 'YES' : 'NO',
                TDS_TAX:data.tds_tax_type,
                GL_COUNT:data.freight_gl_info.length,
                SUP_REF_NO:data.supplier_ref_no,
                SUP_DOC_DATE:data.supplier_doc_date,
                GL_TYPE:data1.label
              })
            })
          }

        })
        setRakeRowData(rowDataList)
        // setFetch(true)
      })
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
    if (hireVendorCode != 0) {
      VendorOutstanding.getVendoroutstanding(hireVendorCode).then((res) => {
        let driver_outstanding_data = res.data[0];
        console.log(driver_outstanding_data,'driver_outstanding_data');
        setHireVendorOutstanding(driver_outstanding_data.L_DMBTR)
      })
    }else {
      setHireVendorOutstanding(0)
    }
  },[hireVendorCode])

  useEffect(() => {
    /* section for getting Pages List from database For Setting Permission */
    DefinitionsListApi.visibleDefinitionsListByDefinition(8).then((response) => {
      console.log(response.data.data)
      setPageList(response.data.data)
      setFetch(true)
      setSmallFetch(true)
    })

     /* section for getting TDS Tax Terms Master List For TDS Tax Code Display from database */
     DefinitionsListApi.visibleDefinitionsListByDefinition(3).then((response) => {
      console.log(response.data.data,'setTdsTaxTermsData')
      setTdsTaxTermsData(response.data.data)
    })
  }, [])

  const getInt = (val) => {
    return Number(parseFloat(val).toFixed(2))
  }

  const sapPaymentPosting = () => {

    let payment = 0

    if(sapPaymentPostingPossibility){

      payment = getLowerValue(getInt(hireVendorOutstanding),getInt(sapPostingPayment))

    }

    console.log(payment,'sapPaymentPosting-Amount')

    return payment
  }

  useEffect(() => {
    if(rPSHaving){
      RakeTripsheetSapService.getSapTripExpensesByRpsNo(tripRPSNumberNew).then((res) => {
        let trip_sap_expenses_data = res.data[0]
        console.log(trip_sap_expenses_data,'trip_sap_expenses_data')
        setFetch(true)
        setSmallFetch(true)
        if(trip_sap_expenses_data.RPS_NO == tripRPSNumberNew && trip_sap_expenses_data.STATUS == 1 && trip_sap_expenses_data.EXP_AMT != 0){
          setSapTdsFreightData(trip_sap_expenses_data)
        } else {
          setSapTdsFreightData({})
          Swal.fire({
            title: 'RPS Data not found in SAP.. Kindly Contact Admin!',
            icon: "warning",
            confirmButtonText: "OK",
          }).then(function () {
            // window.location.reload(false)
          })
        }
      })
    }else {
      setSapTdsFreightData({})
    }

  },[rPSHaving])

  useEffect(() => {
    if(sapTdsFreightData){
      // toast.success('SAP TDS Details Fetched')
      console.log(sapTdsFreightData,'sapTdsFreightData')
      if((sapTdsFreightData.LP_EXP_AMT == totalBalancePaymentAmount) && (sapTdsFreightData.EXP_DOC_NO == tripRPSClosureData.expense_document_no)){
        // setSapPaymentPostingPossibility(true)
        let exp = getInt(sapTdsFreightData.SAP_EXP_AMT)
        let deduct = getInt(tripRPSClosureData.deduction_expenses)
        let payment = exp - deduct
        console.log(payment,'SapPostingPayment')
        setSapPostingPayment(payment)
      } else {
        setSapPaymentPostingPossibility(false)
        setSapPostingPayment(0)
      }
    }

  },[sapTdsFreightData])

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

  console.log(sapTdsFreightData,'sapTdsFreightData')

  const paymentSubmissionValidation = () => {

    /* ===================== Validations Part Start ===================== */

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

    if(paymentRemarks == ''){
      setFetch(true)
      toast.warning(`Payment Remarks should not be empty.`)
      return false
    }

    if(sapPaymentPostingPossibility){
      //
    } else {
      setFetch(true)
      toast.error(`Sap Payment Posting Not Available for this RPS No (${tripRPSNumberNew}). Kindly Contact Admin..`)
      return false
    }

    /* ===================== Validations Part End ===================== */

    if(is_admin){
      console.log('-------------------tripRPSClosureData---------------------------')
      console.log(tripRPSClosureData)
      console.log('-------------------RPS No---------------------------')
      console.log(tripRPSClosureData.expense_sequence_no)
      console.log('-------------------Hire Vendor Code---------------------------')
      console.log(hireVendorCode)
      console.log('-------------------Hire Vendor Outstanding---------------------------')
      console.log(hireVendorOutstanding)
      console.log('-------------------Payment Remarks---------------------------')
      console.log(paymentRemarks)
      console.log('-------------------Payment Posting date---------------------------')
      console.log(paymentPostingDate)
      console.log('-------------------LP Total Balance Amount---------------------------')
      console.log(totalBalancePaymentAmount)
      console.log('-------------------SAP Posting Amount---------------------------')
      console.log(sapPostingPayment)

    }
    // return false
    setPaymentSubmit(true)
  }

  /* Submit Process */
  const RakePaymentSubmit = () => {

    // setFetch(false)

    let sap_data = new FormData()
    sap_data.append('RPS_NO', tripRPSNumberNew)
    sap_data.append('LIFNR', hireVendorCode)
    sap_data.append('BANK_REMARKS', paymentRemarks)
    sap_data.append('BANK_PAYMENT', sapPostingPayment)
    sap_data.append('POST_DATE', paymentPostingDate)

    /* ====== Request Sent To SAP For Payment Doc. Generation Start ========== */
    RakeTripsheetSapService.rakeHireVendorPaymentPost(sap_data).then((res) => {

      console.log(res,'rakeHireVendorPaymentPost')

      let sap_payment_doc_no = res.data.BANK_PAYMENT_DOC_NO
      let sap_payment_status = res.data.BANK_PAYMENT_STATUS
      let sap_payment_message = res.data.BANK_PAYMENT_MESSAGE
      let sap_payment_tripsheet = res.data.RPS_NO

      console.log(sap_payment_doc_no + '/' + sap_payment_status + '/' + sap_payment_message + '/' + sap_payment_tripsheet)
      // return false
      if(res.status == 200 && sap_payment_status == '1' && sap_payment_doc_no && sap_payment_message && sap_payment_tripsheet == tripRPSNumberNew) {

        /* ====== Request Sent To SAP For Payment Doc. Generation End ========== */

        /* ====== Request Sent To LP DB For Payment Details Updation Start ========== */

        let form_data = new FormData()

        form_data.append('closure_id', tripRPSClosureData.closure_id)
        form_data.append('rps_no', tripRPSNumberNew)

        form_data.append('sap_expense_tds', sapTdsFreightData.TDS_TYPE)
        form_data.append('sap_expense_amount', sapTdsFreightData.SAP_EXP_AMT)
        form_data.append('payment_amount', sapPostingPayment)
        form_data.append('payment_document_no', sap_payment_doc_no)
        form_data.append('payment_posting_date', paymentPostingDate)
        form_data.append('payment_remarks', paymentRemarks)
        form_data.append('payment_status', 1)
        form_data.append('payment_by', user_id)
        RakeClosureSubmissionService.paymentSubmission(form_data).then((res)=>{

          console.log(res,'paymentSubmission')
          setFetch(true)
          if (res.status == 200) {
            Swal.fire({
              title: 'Rake Vendor - Payment Completed Successfully!',
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
            toast.warning('Rake Vendor - Payment Failed. Kindly contact Admin..!')
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
                {Object.keys(tripRPSClosureData).length == 0  && (
                  <CRow>
                    <CCol xs={12} md={4}>
                      <div className="w-100 p-3">
                        <CFormLabel htmlFor="tripRPSNumberNew">
                          Enter RPS Number
                          <REQ />{' '}

                        </CFormLabel>
                        <CInputGroup>
                          <CFormInput
                            size="sm"
                            name="tripRPSNumberNew"
                            id="tripRPSNumberNew"
                            maxLength={15}
                            autoComplete='off'
                            value={tripRPSNumberNew}
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
                )}

                {!smallfetch && <SmallLoader />}

                {smallfetch && Object.keys(tripRPSClosureData).length != 0  && (

                  <CCard style={{display: tripSheetHaving ? 'block' : 'none'}}  className="p-3">

                    <CButton className="badge m-3" color="warning">
                      <Link className="text-white" target='_blank' to={`/RakeSettlementReport/${tripRPSClosureData.closure_id}`}>
                        Click here to RPS Info in an New Tab
                      </Link>
                    </CButton>
                    <CNav variant="tabs" role="tablist">
                      <CNavItem>
                        <CNavLink
                          active={activeKey === 1}
                          style={{ backgroundColor: 'green' }}
                          onClick={() => setActiveKey(1)}
                        >
                          FI Information
                        </CNavLink>
                      </CNavItem>

                      <CNavItem>
                        <CNavLink
                          active={activeKey === 2}
                          style={{ backgroundColor: tripRPSClosureData.payment_status == 1 ? 'green' : 'red' }}
                          onClick={() => setActiveKey(2)}
                        >
                          Trip Payment
                        </CNavLink>
                      </CNavItem>

                    </CNav>

                    <CTabContent>
                      <CTabPane role="tabpanel" aria-labelledby="profile-tab" visible={activeKey === 1}>
                        {tripRPSNumberNew && rakeRowData.length > 0 &&
                          <CustomTable
                            columns={rake_column}
                            data={rakeRowData}
                            fieldName={'RPS_NO'}
                            showSearchFilter={true}
                          />
                        }

                        {rakeRowData.length == 0 && (
                          <>
                            <div className="m-5">
                              <h2>There are no FI records to display..</h2>
                            </div>
                          </>
                        )}
                      </CTabPane>
                      <CTabPane role="tabpanel" aria-labelledby="profile-tab" visible={activeKey === 2}>
                        <CRow className="mt-2">
                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="TripTotalFreight">
                              LP - Base Freight Expenses
                            </CFormLabel>

                            <CFormInput
                              size="sm"
                              id="TripTotalFreight"
                              value={tripRPSClosureData.expense_amount}
                              readOnly
                            />
                          </CCol>

                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="additional_expenses">
                              LP - Additional Expenses
                            </CFormLabel>

                            <CFormInput
                              size="sm"
                              id="additional_expenses"
                              value={tripRPSClosureData.additional_expenses}
                              readOnly
                            />
                          </CCol>

                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="deduction_expenses">
                              LP - Trip Deduction
                            </CFormLabel>

                            <CFormInput
                              size="sm"
                              id="deduction_expenses"
                              value={tripRPSClosureData.deduction_expenses}
                              readOnly
                            />
                          </CCol>
                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="total_freight_expenses">
                              LP - Total Freight Expenses
                            </CFormLabel>

                            {(sapTdsFreightData.LP_EXP_AMT != totalBalancePaymentAmount) && (
                              <span className="text-danger">* SAP Freight Mismatch</span>
                            )}

                            <CFormInput
                              size="sm"
                              id="total_freight_expenses"
                              // value={Number(parseFloat(tripRPSClosureData.total_expense_amount).toFixed(3)) + Number(parseFloat(tripRPSClosureData.deduction_expenses).toFixed(3))}
                              value={totalBalancePaymentAmount}
                              readOnly
                            />
                          </CCol>
                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="expense_tds_type">
                              LP - TDS Type
                            </CFormLabel>

                            <CFormInput
                              size="sm"
                              id="expense_tds_type"
                              value={tripRPSClosureData.expense_tds_type ? tdsTaxCodeName(tripRPSClosureData.expense_tds_type) : '--'}
                              readOnly
                            />
                          </CCol>
                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="expense_tds">
                              LP - TDS Availability
                            </CFormLabel>

                            <CFormInput
                              size="sm"
                              id="expense_tds"
                              value={tripRPSClosureData.expense_tds == 1 ? 'YES' : 'NO'}
                              readOnly
                            />
                          </CCol>
                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="sap_expense_tds_type">
                              SAP - TDS Type
                            </CFormLabel>

                            <CFormInput
                              size="sm"
                              id="sap_expense_tds_type"
                              value={sapTdsFreightData.TDS_TYPE ? tdsTaxCodeName(sapTdsFreightData.TDS_TYPE) : '--'}
                              readOnly
                            />
                          </CCol>
                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="sap_expense_tds_amount">
                              SAP - TDS Amount
                            </CFormLabel>

                            <CFormInput
                              size="sm"
                              id="sap_expense_tds_amount"
                              value={sapTdsFreightData.TDS_AMT ? sapTdsFreightData.TDS_AMT : '0'}
                              readOnly
                            />
                          </CCol>
                          {/* <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="total_expense_amount">
                              LP - Total Trip Expenses
                            </CFormLabel>

                            <CFormInput
                              size="sm"
                              id="total_expense_amount"
                              value={tripRPSClosureData.total_expense_amount}
                              readOnly
                            />
                          </CCol> */}
                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="vname">
                              Vendor Name
                            </CFormLabel>

                            <CFormInput
                              size="sm"
                              id="vname"
                              value={tripRPSClosureData.rake_vendor_info.v_name}
                              readOnly
                            />
                          </CCol>
                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="vname">
                              Vendor Code
                            </CFormLabel>

                            <CFormInput
                              size="sm"
                              id="vname"
                              value={tripRPSClosureData.rake_vendor_info.v_code}
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
                          {/* === SAP TDS Data Fetching Details Against RPS No Part Start === */}

                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="sap_expense_total_amount">
                              SAP - Trip Expenses Amount
                            </CFormLabel>

                            <CFormInput
                              size="sm"
                              id="sap_expense_total_amount"
                              value={sapTdsFreightData.SAP_EXP_AMT ? sapTdsFreightData.SAP_EXP_AMT : '0'}
                              readOnly
                            />
                          </CCol>
                          { tripRPSClosureData.payment_status != 1 ? (
                            <>
                              <CCol xs={12} md={3}>
                                <CFormLabel htmlFor="sap_expense_doc_no">
                                  SAP - Expense Doc. No
                                </CFormLabel>

                                <CFormInput
                                  size="sm"
                                  id="sap_expense_doc_no"
                                  value={sapTdsFreightData.EXP_DOC_NO ? sapTdsFreightData.EXP_DOC_NO : '--'}
                                  readOnly
                                />
                              </CCol>

                              {/* === SAP TDS Data Fetching Details Against RPS No Part End === */}

                              <CCol xs={12} md={3}>
                                <CFormLabel htmlFor="trip_payment_amount">
                                  Trip Payment Amount
                                </CFormLabel>

                                <CFormInput
                                  size="sm"
                                  id="trip_payment_amount"
                                  value={sapPostingPayment}
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
                            </>
                          ) : (
                            <>
                              <CCol xs={12} md={3}>
                                <CFormLabel htmlFor="vname">
                                  SAP Payment Posting Amount
                                </CFormLabel>

                                <CFormInput
                                  size="sm"
                                  id="vname"
                                  value={tripRPSClosureData.payment_amount}
                                  readOnly
                                />
                              </CCol>
                              <CCol xs={12} md={3}>
                                <CFormLabel htmlFor="vname">
                                  SAP Payment Doc. No.
                                </CFormLabel>

                                <CFormInput
                                  size="sm"
                                  id="vname"
                                  value={tripRPSClosureData.payment_document_no}
                                  readOnly
                                />
                              </CCol>
                              <CCol xs={12} md={3}>
                                <CFormLabel htmlFor="vname">
                                  Payment Posting date
                                </CFormLabel>

                                <CFormInput
                                  size="sm"
                                  id="vname"
                                  value={tripRPSClosureData.payment_posting_date}
                                  readOnly
                                />
                              </CCol>
                              <CCol xs={12} md={3}>
                                <CFormLabel htmlFor="vname">
                                  Payment Remarks
                                </CFormLabel>

                                <CFormInput
                                  size="sm"
                                  id="vname"
                                  value={tripRPSClosureData.payment_remarks}
                                  readOnly
                                />
                              </CCol>
                            </>
                          )}
                        </CRow>
                        { tripRPSClosureData.payment_status != 1 && (
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
                        )}
                      </CTabPane>
                      <CRow>
                        <CCol className="m-2" xs={12} sm={12} md={3}>
                          <CButton
                            size="sm"
                            style={{ marginLeft:"3px" }}
                            color="primary"
                            onClick={() => {
                              window.location.reload(false)
                            }}
                          >
                            BACK <i className="fa fa-refresh px-1"></i>
                          </CButton>
                        </CCol>
                      </CRow>
                    </CTabContent>
                    {/* ============== Settlement Submit Confirm Button Modal Area Start ================= */}
                    <CModal
                      visible={paymentSubmit}
                      backdrop="static"
                      // scrollable
                      onClose={() => {
                        setPaymentSubmit(false)
                      }}
                    >
                      <CModalBody>
                        <p className="lead">Are you sure to Post the Payment Details to SAP ?</p>
                      </CModalBody>
                      <CModalFooter>
                        <CButton
                          className="m-2"
                          color="warning"
                          onClick={() => {
                            setPaymentSubmit(false)
                            RakePaymentSubmit()
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
                    {/* ============== FI-Entry Attachment Copy Modal Area Start ================= */}
                      <CModal
                        visible={visible}
                        onClose={() => {
                          setVisible(false)
                          setFiImgSrc("")
                        }}
                      >
                        <CModalHeader>
                          <CModalTitle>FI Attachment Copy</CModalTitle>
                        </CModalHeader>

                        <CModalBody>
                          {fiImgSrc &&
                          !fiImgSrc.includes('.pdf') ? (
                            <CCardImage orientation="top" src={fiImgSrc} />
                          ) : (
                            <iframe
                              orientation="top"
                              height={500}
                              width={475}
                              src={fiImgSrc}
                            ></iframe>
                          )}
                        </CModalBody>

                        <CModalFooter>
                          <CButton
                            color="secondary"
                            onClick={() => {
                              setVisible(false)
                              setFiImgSrc("")
                            }}
                          >
                            Close
                          </CButton>
                        </CModalFooter>
                      </CModal>
                    {/* ============== FI-Entry Attachment Copy Modal Area Start ================= */}
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

export default RakePayment
