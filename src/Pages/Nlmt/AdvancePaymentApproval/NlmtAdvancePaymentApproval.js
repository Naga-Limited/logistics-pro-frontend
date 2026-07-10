import React, { useState } from 'react'
import {
  CButton,
  CCard,
  CCardImage,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow, 
  CAlert,
} from '@coreui/react' 
import { Link, useNavigate, useParams } from 'react-router-dom' 
import { useEffect } from 'react' 
import { Object } from 'core-js'
import { toast } from 'react-toastify'
import Loader from 'src/components/Loader'
import 'react-toastify/dist/ReactToastify.css' 

import AccessDeniedComponent from 'src/components/commoncomponent/AccessDeniedComponent'
import JavascriptInArrayComponent from 'src/components/commoncomponent/JavascriptInArrayComponent'
import * as NlmtScreenAccessCodes from 'src/components/constants/NlmtScreenAccessCodes'
import Swal from 'sweetalert2'
import JavascriptDateCheckComponent from 'src/components/commoncomponent/JavascriptDateCheckComponent'
import ExpenseIncomePostingDate from '../TripsheetClosure/Calculations/NlmtExpenseIncomePostingDate' 
import NlmtAdvanceCreationService from 'src/Service/Nlmt/Advance/NlmtAdvanceCreationService'
import NlmtAdvanceCreationValidation from 'src/Utils/Nlmt/Advance/NlmtAdvanceCreationValidation'
import NlmtAdvanceHireSAP from 'src/Service/Nlmt/SAP/NlmtAdvanceHireSAP'
import NlmtAdvanceOwnSAP from 'src/Service/Nlmt/SAP/NlmtAdvanceOwnSAP' 
import useFormNlmtAdvance from 'src/Hooks/useFormNlmtAdvance '
import NlmtAdvanceCreationOwn from './segments/OwnAndContract/NlmtAdvanceCreationOwn'
import NlmtAdvanceCreationHire from './segments/Hire/NlmtAdvanceCreationHire'
import NlmtTSFreightUpdationService from 'src/Service/Nlmt/FreightUpdation/NlmtTSFreightUpdationService'
import { getCurrentDateTime } from 'src/Pages/Depo/CommonMethods/CommonMethods'
import UserLoginMasterService from 'src/Service/Master/UserLoginMasterService'
import CustomTable from 'src/components/customComponent/CustomTable'
import NlmtDefinitionsListApi from 'src/Service/Nlmt/Masters/NlmtDefinitionsListApi'

const NlmtAdvancePaymentApproval = () => {
  const user_info_json = localStorage.getItem('user_info')
  const user_info = JSON.parse(user_info_json)

  /* Get User Id From Local Storage */
  const user_id = user_info.user_id

  /* ==================== Access Part Start ========================*/
  const [screenAccess, setScreenAccess] = useState(false)
  let page_no = NlmtScreenAccessCodes.NlmtTransactionScreens.NLMT_Advance_Approval

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

  const Expense_Income_Posting_Date_Taken = ExpenseIncomePostingDate()
  const formValues = {
    tripsheet_id: '',
    advance_form: '', 
    driver_code: '',
    vendor_outstanding: '',
    vendor_code: '',
    advance_payment: '',
    advance_payment_diesel: '',
    remarks: '',
    advance_status: '',
    advance_payments: '',
    actual_freight: '',
    vendor_hsn: '',
    vendor_tds: '',
    supplier_posting_date: '',
    supplier_ref_no: '',
    low_tonnage_charges: '',
    freight_remarks: '',
    incoterm_freight_info: '',
    frpt: '' /* Freight Rate Per Ton */,
  }

  const { id } = useParams()
  const [state, setState] = useState({
    page_loading: false,
  })

  const [singleVehicleInfo, setSingleVehicleInfo] = useState(false)
  const [dirverAssign, setDirverAssign] = useState(true)
  const [fetch, setFetch] = useState(false)
  const [vendorData, setvendorData] = useState({})
  const [validateSubmit, setValidateSubmit] = useState(true)
  const [vendor, setVendor] = useState(false)
  const [acceptBtn, setAcceptBtn] = useState(true)
  const [acceptBtn1, setAcceptBtn1] = useState(true)
  const [errorModal, setErrorModal] = useState(false)
  const [sap_bank_payment_document_no, setSap_bank_payment_document_no] = useState('')
  const [sap_actual_freight_document_no, setSap_actual_freight_document_no] = useState('')
  const [sap_advance_diesel_document_no, setSap_advance_diesel_document_no] = useState('')
  const [totalFreightAmount, setTotalFreightAmount] = useState(0)
  const [currentDateVbr, setCurrentDateVbr] = useState('') /* Vendor Bill Reference Date */
  const [error, setError] = useState({})
  const navigation = useNavigate()
  const [ButtonDisable, setButtonDisable] = useState(false)
  const [vpan, setVpan] = useState('')
  const [vpanMobile, setVpanMobile] = useState(0)
  const [vpanMobileHaving, setVpanMobileHaving] = useState(false)
  const [checked, setChecked] = useState(false)
  const [otpVerify, setOtpVerify] = useState(false)
  const [otpGenerated, setOtpGenerated] = useState(false)
  const [remarks, setRemarks] = useState('')

  const handleChangenew = (event) => {
    const result = event.target.value.toUpperCase()
    setRemarks(result)
  }

  const [rowData, setRowData] = useState([])
  const LogType = ['No Need','Creation','Approval','Rejection','Re-Request','Advance Completed']


  const vehicleType = {
    OWN: 21,
    HIRE: 22,
  }

  const totalvaluefinder = (type, data) => {
    console.log(values, 'totalvaluefinderparent-values')
    console.log(type, 'totalvaluefinderparent-type')
    console.log(data, 'totalvaluefinderparent-data')

    let totval_type1 = 0
    let totval_type2 = 0
    let totval_type3 = 0

    if (data) {
      let children = data.shipment_child_info

      children.map((vv, kk) => {
        if (vv.invoice_uom == 'KG') {
          let qtty = Number(vv.invoice_net_quantity) / 1000
          console.log(qtty, 'totalvaluefinderparent-qty')
          totval_type1 = totval_type1 + qtty
          if (JavascriptInArrayComponent(vv.inco_term_id, [381, 382])) {
            //
          } else {
            totval_type3 = totval_type3 + qtty
          }
        } else {
          //
        }
        let ammt = freightamountfinder(
          vv.inco_term_id,
          values.frpt,
          getDeliveryQuantity(vv.invoice_net_quantity, vv.invoice_uom)
        )
        console.log('totalvaluefinderparent-child-amount - ', ammt, ', Key - ', kk)
        totval_type2 = totval_type2 + ammt
      })

      console.log(totval_type1, 'totalvaluefinderparent-totval_type1')
      console.log(totval_type2, 'totalvaluefinderparent-totval_type2')
      console.log(totval_type3, 'totalvaluefinderparent-totval_type3')
    }
    if (type == 1) {
      return Number(parseFloat(totval_type1).toFixed(2))
    } else if (type == 2) {
      console.log(Math.round(totval_type2), 'totalvaluefinderparent-rounded totval_type2 value')
      return Math.round(totval_type2)
    } else if (type == 3) {
      return Number(parseFloat(totval_type3).toFixed(2))
    }
  }

  const [userMasterData, setUserMasterdata] = useState([])
  
  const userNameFinder = (id) => {
    console.log(id,'userNameFinder-id')
    console.log(userMasterData,'userNameFinder-data')
    let uname = ''
    if(id == 1){
      uname = 'Admin'
    } else {
      userMasterData.map((vv,kk)=>{
        if(vv.user_id == id){
          uname = vv.emp_name
        }
      })
    }
    return uname
  }

  const freightamountfinder = (id, ton, qty) => {
    console.log(id, 'freightamountfinder-id')
    console.log(ton, 'freightamountfinder-ton')
    console.log(qty, 'freightamountfinder-qty')
    if (JavascriptInArrayComponent(id, [381, 382])) {
      return 0
    }
    let ans = Number(ton) * qty
    console.log(ans, 'freightamountfinder-ans')
    // return Math.round(ans)
    return Number(ans)
    // return parseInt(ans)
  }

  const getDeliveryQuantity = (qty, uom) => {
    if (uom == 'KG') {
      console.log(Number(qty) / 1000, 'getDeliveryQuantity')
      // return Number(parseFloat(qty).toFixed(2))
      return Number(qty) / 1000
    } else {
      return '-'
    }
  }

  // document.addEventListener('contextmenu', event => event.preventDefault());
  useEffect(() => {
    NlmtAdvanceCreationService.getAdvanceApprovalInfoById(id).then((res) => {
      setFetch(true)
      console.log(res.data.data, 'getAdvanceApprovalInfoById')
      if (res.status === 200) {
        let resp_data = res.data.data
        // vendorDataAssignment(resp_data)
        isTouched.vehicle_id = true
        values.tripsheet_id = res.data.data.tripsheet_id
        isTouched.driver_id = true
        isTouched.tripsheet_id = true
        isTouched.vehicle_type_id = true
        values.parking_id = true
        values.parking_id = res.data.data.nlmt_trip_in_id
        values.trip_sheet_no =
          res.data.data.tripsheet_info != null ? res.data.data.tripsheet_info.nlmt_tripsheet_no : ''

        values.driver_code =
          res.data.data.driver_info != null ? res.data.data.driver_info.driver_code : ''
        if (res.data.data.Parking_Vendor_Info) {
          values.vendor_code = res.data.data.Parking_Vendor_Info.vendor_code
        } else {
          values.vendor_code =
            res.data.data.vendor_info != null ? res.data.data.vendor_info.vendor_code : ''
        }
        // values.vendor_code =
        // res.data.data.Parking_Vendor_Info != null ? res.data.data.vendor_info.vendor_code : res.data.data.vendor_info != null ? res.data.data.vendor_info.vendor_code : ''
        values.advance_payments =
          res.data.data.tripsheet_info != null ? res.data.data.tripsheet_info.advance_amount : ''
        values.advance_payment_diesel =
          res.data.data.diesel_intent_info != null
            ? res.data.data.diesel_intent_info.total_amount
            : '0'
        values.advance_payment_update =
          res.data.data.advance_info != null ? res.data.data.advance_info.advance_payment : ''
        values.advance_payment_diesel_update =
          res.data.data.advance_info != null
            ? res.data.data.advance_info.advance_payment_diesel
            : ''
        // values.actual_freight = res.data.data.tripsheet_info.freight_rate_per_tone
        values.vehicle_type_id = res.data.data.vehicle_info.vehicle_type_id
        values.vehicle_id = res.data.data.vehicle_id
        values.driver_id =
          res.data.data.driver_info != null ? res.data.data.driver_info.driver_id : ''
        values.driveMobile =
          res.data.data.driver_info != null ? res.data.data.driver_info.driver_phone_1 : ''

        if(resp_data.advance_payment_info){
          let advInfo = resp_data.advance_payment_info
          values.sap_invoice_posting_date = advInfo.sap_invoice_posting_date
          values.vendor_tds = advInfo.vendor_tds
          values.gst_tax_type = advInfo.gst_tax_type
          values.vendor_hsn = advInfo.vendor_hsn
          values.bank_date = advInfo.bank_date
          values.bank_remarks = advInfo.bank_remarks
          values.remarks = advInfo.remarks
          values.supplier_ref_no = advInfo.supplier_ref_no
          values.supplier_posting_date = advInfo.supplier_posting_date
        }
        setRemarks(res.data.data.advance_payment_info != null ? res.data.data.advance_payment_info.remarks : '')
 
        let rowDataList = []
        const Log_Info = res.data.data.tripsheet_info.freight_log_info ?? '[{}]'

        // Convert JSON string to JavaScript array
        const log_info_array = JSON.parse(Log_Info)

        console.log(log_info_array,'freight_log_info-array')

        log_info_array.forEach((item, index) => {
          let log_info_object = {}
          log_info_object.S_NO = index + 1
          log_info_object.Type = LogType[item.type] || ''
          log_info_object.remarks = item.remarks
          log_info_object.FreightRate = item.freight_rate
          log_info_object.UpdatedFreightRate = item.updated_freight_rate
          log_info_object.User = userNameFinder(item.user)
          log_info_object.DateTime = item.time
          rowDataList.push(log_info_object)
        })

        setRowData(rowDataList)      

        setSingleVehicleInfo(res.data.data)
        console.log(singleVehicleInfo, 'singleVehicleInfo--1')
      }
    })

    UserLoginMasterService.getUser().then((res) => {
      let viewData = res.data.data
      setUserMasterdata(viewData)
    },[])
  }, [id, userMasterData.length == 0]) 

  function timeValidation(mgiTime, mgoTime) {
    let condition = 0
    if (mgiTime != '' && mgoTime != '') {
      let difference111 = diffTime(mgiTime, mgoTime)

      console.log(difference111, 'difference111')

      if (difference111 < 0) {
        condition = 1
      } else {
        condition = 0
      }
    } else {
      condition = 0
    }
    console.log(condition, 'difference111-condition')
    return condition
  }

  const { values, errors, handleChange, onFocus, handleSubmit, enableSubmit, onBlur, isTouched } =
    useFormNlmtAdvance(CreateAdvanceOwn, NlmtAdvanceCreationValidation, formValues)

  console.log(singleVehicleInfo, 'singleVehicleInfo')

  function CreateAdvanceOwn(status) {
    setState({ ...state, page_loading: true })
    let formData = new FormData()
    const safeEmpty = '\u00A0'

    formData.append('LIFNR', values.driver_code)
    formData.append('TRIP_SHEET', values.trip_sheet_no)
    formData.append('VEHICLE_NO', singleVehicleInfo.vehicle_info.vehicle_number)
    formData.append('PLANT', 'NLMD')
    // formData.append('FREIGHT_PAYMENT', `FREIGHT_PAYMENT:${values.advance_paymented}`)
    formData.append('FREIGHT_PAYMENT', `FREIGHT_PAYMENT:${values.advance_paymented || values.advance_payments}`)
    formData.append('BANK_PAYMENT', '')
    formData.append('POST_DATE', values.sap_invoice_posting_date)
    formData.append('REF_DATE', '')
    formData.append('REMARKS', remarks ? remarks : '')
    formData.append('BANK_REMARK', '')
    formData.append('REF_NO', '')
    formData.append('TDS', '')
    formData.append('TAX_TYPE', '')
    formData.append('TDS_VALUE', '')
    formData.append('HSN', '')

    let limit = 9990
    let from_date = Expense_Income_Posting_Date_Taken.min_date
    let to_date = Expense_Income_Posting_Date_Taken.max_date

    if (values.driver_outstanding == undefined) {
      setFetch(true)
      toast.warning('Please Check Vendor outstanding')
      return false
    }

    // else if (limit < values.advance_paymented) {
    //   setFetch(true)
    //   toast.warning('Cash Advance less than 9990 ...')
    //   return false
    // }

    console.log(values.advance_paymented,'values.advance_paymented')
    console.log(values.advance_payments,'values.advance_payments')

    console.log('values',values) 

    // setFetch(true) 
    // return false

    if (values.advance_paymented > 0 && values.advance_payments >= 0) {
      // if (values.otp1 == '') {
      //   setFetch(true)
      //   toast.warning('Enter The OTP Number')
      //   return false
      // } else 

        setFetch(true)
        toast.warning('Driver Advance given scenario will be implemented in future.. ')
        return false
        
      if (values.advance_form == '' || values.advance_form.size > 5000000) {
        setFetch(true)
        toast.warning('Attached The Advance Form Copy')
        return false
      } else if (
        values.sap_invoice_posting_date == '' ||
        values.sap_invoice_posting_date == undefined
      ) {
        setFetch(true)
        toast.warning('Enter Posting Date')
        return false
      } else if (
        !JavascriptDateCheckComponent(from_date, values.sap_invoice_posting_date, to_date)
      ) {
        setFetch(true)
        toast.warning('Invalid Posting date')
        return false
      } else if (values.payment_mode == '' || values.payment_mode == undefined) {
        setFetch(true)
        toast.warning('Select Payment Mode')
        return false
      }

      // NlmtAdvanceOwnSAP.AdvanceOwnSAP(formData).then((res) => {
      //   const sap = res.data

        /* ================= FREIGHT CHECK ================= */

        // if (sap.FRE_STATUS !== '1') {
        //   toast.warning(sap.FRE_MESSAGE || 'Freight Document not created')
        //   setFetch(true)
        //   return
        // }

        // values.sap_freight_payment_document_no = sap.FRE_DOC_NO
        // values.sap_bank_payment_document_no = sap.BANK_DOC_NO
        
        const data = new FormData()
        data.append('driver_id', values.driver_id)
        data.append('vehicle_id', values.vehicle_id)
        data.append('parking_id', values.parking_id)
        data.append('tripsheet_id', values.tripsheet_id)
        data.append('advance_form', values.advance_form)
        data.append('driver_code', values.driver_code)
        data.append('vendor_outstanding', values.driver_outstanding)
        data.append('advance_payment', values.advance_paymented || values.advance_payments)
        data.append('actual_freight', values.advance_paymented || values.advance_payments)
        data.append('payment_mode', values.payment_mode)
        data.append('remarks', remarks)
        data.append('created_by', user_id)
        data.append('advance_status', '1')
        //data.append('document_no', values.sap_freight_payment_document_no)
        // data.append(
        //   'sap_freight_payment_document_no',
        //   values.sap_freight_payment_document_no || '0'
        // )
        data.append('sap_invoice_posting_date', values.sap_invoice_posting_date)

        console.log('values',values)
        console.log('data',data)

        // if (res.data.STATUS == '2') {
          setFetch(true)
        //   toast.warning('Advance Amount Exceed.. Kindly Contact Admin!')
          return false
        // }

        NlmtAdvanceCreationService.createAdvance(data).then((res) => {
          console.log(res)
          if (res.status === 200) {
            console.log(res)
            setFetch(true)
            // toast.success('Advance Created Successfully!')
            setAcceptBtn(true)
            // navigation('/AdvancePayment')
            Swal.fire({
              title: 'Advance Submitted Successfully',
              html: `SAP Freight Doc.No - ${sap.FRE_DOC_NO}`,
              icon: 'success',
            }).then(function () {
              toast.success('Advance Posted Successfully')
              navigation('/NlmtAdvancePayment')
            })
          }
        })
        .catch((error) => {
          // setState({ ...state })
          for (let value of data.values()) {
            console.log(value)
          }
          console.log(error)
          var object = error.response.data.errors
          var output = ''
          for (var property in object) {
            output += '*' + object[property] + '\n'
          }
          setError(output)
          setErrorModal(true)
        })
      // })
    } else if (
      values.advance_payments > 0 &&
      (values.advance_paymented == undefined || values.advance_paymented == '')
    ) {

        setFetch(true)
        toast.warning('Driver Advance given scenario will be implemented in future.. ')
        return false

      if (values.otp1 == '') {
        setFetch(true)
        toast.warning('Enter The OTP Number')
        return false
      } else if (values.advance_form == '' || values.advance_form.size > 5000000) {
        setFetch(true)
        toast.warning('Attached The Advance Form Copy')
        return false
      } else if (
        values.sap_invoice_posting_date == '' ||
        values.sap_invoice_posting_date == undefined
      ) {
        setFetch(true)
        toast.warning('Enter Posting Date')
        return false
      } else if (
        !JavascriptDateCheckComponent(from_date, values.sap_invoice_posting_date, to_date)
      ) {
        setFetch(true)
        toast.warning('Invalid Posting date')
        return false
      } else if (values.payment_mode == '' || values.payment_mode == undefined) {
        setFetch(true)
        toast.warning('Select Payment Mode')
        return false
      }
      NlmtAdvanceOwnSAP.AdvanceOwnSAP(formData).then((res) => {
        values.sap_freight_payment_document_no = res.data.FRE_DOC_NO
        console.log('values1')
        const data = new FormData()
        data.append('driver_id', values.driver_id)
        data.append('vehicle_id', values.vehicle_id)
        data.append('parking_id', values.parking_id)
        data.append('tripsheet_id', values.tripsheet_id)
        data.append('advance_form', values.advance_form)
        data.append('driver_code', values.driver_code)
        data.append('vendor_outstanding', values.driver_outstanding)
        data.append('advance_payment', values.advance_paymented || values.advance_payments)
        data.append('actual_freight', values.advance_paymented || values.advance_payments)
        data.append('payment_mode', values.payment_mode)
        data.append('remarks', remarks)
        data.append('created_by', user_id)
        data.append('purpose', values.purpose)
        data.append('to_divison', values.to_divison)
        data.append('advance_status', '1')
        data.append(
          'sap_freight_payment_document_no',
          values.sap_freight_payment_document_no || '0'
        )
        data.append('sap_invoice_posting_date', values.sap_invoice_posting_date)

        if (res.data.STATUS == '2') {
          setFetch(true)
          toast.warning('Advance Amount Exceed.. Kindly Contact Admin!')
          return false
        }

        if (values.sap_freight_payment_document_no == undefined || values.sap_freight_payment_document_no == '') {
          setFetch(true)
          toast.warning('Invalid Invoice Number,Contact SAP Team')
          return false
        }

        NlmtAdvanceCreationService.createAdvance(data)
          .then((res) => {
            console.log(res)
            if (res.status === 200) {
              console.log(res)
              setFetch(true)
              // toast.success('Advance Created Successfully!')
              setAcceptBtn(true)
              // navigation('/AdvancePayment')
              Swal.fire({
                title: 'Advance Submitted Successfully',
                html: 'SAP Document No - ' + values.sap_freight_payment_document_no,
                icon: 'success',
                confirmButtonText: 'OK',
              }).then(function () {
                toast.success('Advance Posted Successfully')
                navigation('/NlmtAdvancePayment')
              })
            }
          })
          .catch((error) => {
            // setState({ ...state })
            for (let value of data.values()) {
              console.log(value)
            }
            console.log(error)
            var object = error.response.data.errors
            var output = ''
            for (var property in object) {
              output += '*' + object[property] + '\n'
            }
            setError(output)
            setErrorModal(true)
          })
      })
    } else { /* 0 Rs Advance Scenario */
      console.log('values2')
      const data = new FormData()
      data.append('driver_id', values.driver_id)
      data.append('vehicle_id', values.vehicle_id)
      data.append('parking_id', values.parking_id)
      data.append('tripsheet_id', values.tripsheet_id)
      data.append('advance_form', values.advance_form)
      data.append('driver_code', values.driver_code)
      data.append('vendor_outstanding', values.driver_outstanding)
      data.append('advance_payment', values.advance_paymented || values.advance_payments)
      data.append('actual_freight', values.advance_paymented || values.advance_payments)
      data.append('payment_mode', values.payment_mode || 0)
      data.append('remarks', remarks)
      data.append('created_by', user_id)
      data.append('purpose', values.purpose)
      data.append('to_divison', values.to_divison)
      data.append('advance_status', '1')
      data.append('document_no', values.document_no || '0')
      data.append('sap_invoice_posting_date', values.sap_invoice_posting_date)

      // if (values.document_no == undefined) {
      //   setFetch(true)
      //   toast.warning('Invalid Invoice Number')
      //   return false
      // }

      if (values.sap_invoice_posting_date == '' || values.sap_invoice_posting_date == undefined) {
        setFetch(true)
        toast.warning('Enter Posting Date')
        return false
      } else if (
        !JavascriptDateCheckComponent(from_date, values.sap_invoice_posting_date, to_date)
      ) {
        setFetch(true)
        toast.warning('Invalid Posting date')
        return false
      }

      NlmtAdvanceCreationService.createAdvance(data)
        .then((res) => {
          console.log(res)
          if (res.status === 200) {
            console.log(res)
            setFetch(true)
            // toast.success('Advance Created Successfully!')
            setAcceptBtn(true)
            // navigation('/AdvancePayment')
            Swal.fire({
              title: 'Advance Submitted Successfully',
              // html: 'SAP Document No - ' + values.document_no,
              icon: 'success',
              confirmButtonText: 'OK',
            }).then(function () {
              toast.success('Advance Posted Successfully')
              navigation('/NlmtAdvancePayment')
            })
          }
        })
        .catch((error) => {
          // setState({ ...state })
          for (let value of data.values()) {
            console.log(value)
          }
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
  }

  // useEffect(() => {
  //   const today = new Date().toISOString().split('T')[0]

  //   values.advance_payments = values.advance_payments ?? 0
  //   values.bank_date = values.bank_date ?? today
  //   values.supplier_posting_date = values.supplier_posting_date ?? today
  //   values.sap_invoice_posting_date = values.sap_invoice_posting_date ?? today
  // }, [])

  const getNumericCapacity = (capacityName) => {
    if (!capacityName) return 0
    return parseFloat(capacityName) || 0
  }

  function formatYMD(dateTime) {
    return dateTime ? dateTime.split(' ')[0] : '';
  }

  const [advanceLimit, setadvanceLimit] = useState([])

  useEffect(() => {
    NlmtDefinitionsListApi.visibleNlmtDefinitionsListByDefinition(4)
      .then((res) => setadvanceLimit(res?.data?.data || []))
      .catch(() => setadvanceLimit([]))
  }, [])

  //Hire SAP Advance
  function CreateAdvanceHire(status) {
    setState({ ...state, page_loading: true })

    if (values.driver_outstanding == undefined) {
      setFetch(true)
      toast.warning('Please Check Vendor outstanding')
      return false
    }

    console.log('CreateAdvanceHire-values', values)

    /* ===== Validation Part Start ===== */

    if(values.gst_tax_type == '' || values.gst_tax_type == undefined) {
      toast.warning('GST Tax Type Should be required..')
      setFetch(true)
      return false
    } else if(values.vendor_hsn == '') {
      toast.warning('HSN Code Should be required..')
      setFetch(true)
      return false
    } else if(values.sap_invoice_posting_date == '' || values.sap_invoice_posting_date == undefined) {
      toast.warning('Enter Freight Posting Date')
      setFetch(true)
      return false
    } else if(values.vendor_tds == '') {
      toast.warning('Vendor TDS Tax Type Should be required..')
      setFetch(true)
      return false
    // } else if(!JavascriptDateCheckComponent(from_date, values.sap_invoice_posting_date, to_date)) {
    //   toast.warning('Invalid Freight Posting date')
    //   setFetch(true)
    //   return false
    } else if(values.bank_date == '' || values.bank_date == undefined) {
      toast.warning('Enter Advance Payment Bank Posting Date')
      setFetch(true)
      return false
    // } else if(!JavascriptDateCheckComponent(from_date, values.bank_date, to_date) && values.advance_payments > '0') {
    //   toast.warning('Invalid Advance Payment Bank Posting date')
    //   setFetch(true)
    //   return false
    } else if(values.supplier_posting_date == '' || values.supplier_posting_date == undefined) {
      toast.warning('Enter Vendor Bill/Reference Date')
      setFetch(true)
      return false
    // } else if(timeValidation(values.supplier_posting_date, values.sap_invoice_posting_date) == 1) {
    //   toast.warning(`Vendor Bill/Reference Date should be on or before of Freight Posting Date.`)
    //   setFetch(true)
    //   return false
    } else if(remarks == '' || remarks == undefined) {
      toast.warning('Enter Accounting Remarks')
      setFetch(true)
      return false
    // } else if(isTouched.low_tonnage_charges && !/^[\d]{1,6}$/.test(values.low_tonnage_charges)) {
    //   toast.warning('Low Tonnage Charges Should be in a numeric..')
    //   setFetch(true)
    //   return false
    } else if(values.bank_remarks == '' || values.bank_remarks == undefined ) {
      toast.warning('Enter Bank Payment Remarks')
      setFetch(true)
      return false
    }

    // if (values.advance_form == '' || values.advance_form.size > 5000000) {
    //   setFetch(true)
    //   toast.warning('Advance Attachment should be required within 5MB')
    //   return false
    // } 

    /* ===== Validation Part End ===== */

    /* ===== SAP Form Data Creation Part Start ===== */

    const advancePercentage = advanceLimit?.find((item) => item.definition_list_status === 1) ?.definition_list_name || 0
    const advanceEligible = (totalFreightAmount * Number(advancePercentage) / 100).toFixed(2)
    const balanceAmount = Number(totalFreightAmount) - Number(advanceEligible)

    let formData = new FormData()

    formData.append('TRIP_SHEET', values.trip_sheet_no)
    formData.append('VEHICLE_NO', singleVehicleInfo.vehicle_info.vehicle_number)
    formData.append('TAX_TYPE', values.gst_tax_type === 'Empty' ? '' : values.gst_tax_type)
    formData.append('TDS', values.vendor_tds && values.vendor_tds !== '0' ? 'YES' : 'NO')
    formData.append('TDS_VALUE',values.vendor_tds && values.vendor_tds !== '0' ? values.vendor_tds : '')
    formData.append('REMARKS', remarks)
    formData.append('LIFNR', singleVehicleInfo.vendor_info.vendor_code)
    formData.append('FREIGHT_PAYMENT', `FREIGHT_PAYMENT:${Number(totalFreightAmount) || 0}`)
    formData.append('POST_DATE', formatYMD(values.sap_invoice_posting_date))
    formData.append('BANK_DATE', formatYMD(values.bank_date))
    formData.append('REF_NO',values.supplier_ref_no ? values.supplier_ref_no : values.trip_sheet_no)
    formData.append('REF_DATE', formatYMD(values.sap_invoice_posting_date))
    // formData.append('BANK_PAYMENT', Number(advanceEligible))
    formData.append('BANK_PAYMENT', 1)
    formData.append('BANK_REMARKS', values.bank_remarks)
    formData.append('HSN', values.vendor_hsn)
    formData.append('PLANT', 'NLMD')

    /* ===== SAP Form Data Creation Part End ===== */

    console.log('SAP API Completion')
    console.log(formData, 'FormData : SAP')

    // setFetch(true)
    // return false
     
    NlmtAdvanceHireSAP.AdvanceHireSAP(formData).then((res) => {
      const sap = res.data.data || res.data
      if (sap.FRE_STATUS !== '1' || sap.BANK_STATUS !== '1') {
        toast.error(sap.FRE_MESSAGE || 'SAP Freight Failed')
        toast.error(sap.BANK_MESSAGE || 'SAP Bank Failed')
        setFetch(true)
        return
      }

      values.sap_freight_payment_document_no = sap.FRE_DOC_NO
      values.sap_freight_payment_amount = sap.FRE_DOC_AMT
      values.sap_bank_payment_document_no = sap.BANK_DOC_NO
      values.sap_bank_payment_amount = sap.BANK_DOC_AMT

      const data = new FormData()
      console.log(values)

      data.append('_method', 'PUT')
      data.append('vehicle_id', values.vehicle_id)
      data.append('parking_id', values.parking_id)
      data.append('tripsheet_id', values.tripsheet_id)
      data.append('vendor_code', values.vendor_code)
      // data.append('advance_form', values.advance_form)
      data.append('vendor_outstanding', values.driver_outstanding)
      data.append('advance_payment', Number(advanceEligible))
      data.append('actual_freight', totalFreightAmount)
      data.append('remarks', remarks)
      data.append('bank_remarks', values.bank_remarks)
      // data.append('created_by', user_id)
      data.append('advance_status', '2')
      data.append('sap_freight_payment_document_no',values.sap_freight_payment_document_no || '0')
      data.append('sap_bank_payment_document_no', values.sap_bank_payment_document_no || '0')
      data.append('sap_freight_payment_amount',values.sap_freight_payment_amount || '0')        
      data.append('sap_bank_payment_amount', values.sap_bank_payment_amount || 0)
      data.append('billed_qty', singleVehicleInfo?.vehicle_assignment?.[0]?.billed_net_qty || 0)
      data.append('shipment_no', singleVehicleInfo?.vehicle_assignment?.[0]?.shipment_no || 0)
      data.append('shipment_id', singleVehicleInfo?.vehicle_assignment?.[0]?.shipment_id || 0)
      data.append('freight_per_ton', singleVehicleInfo.tripsheet_info.trip_freight_rate || 0)
      data.append('route_id', singleVehicleInfo.tripsheet_info.route_id || 0) 
      data.append('gst_tax_type', values.gst_tax_type) 
      data.append('tds_type', values.vendor_tds == '0' ? 2 : 1)
      data.append('sap_invoice_posting_date', values.sap_invoice_posting_date)
      data.append('bank_date', values.bank_date) 
      /* ================== ASK Part Start ======================= */
      data.append('vendor_tds', values.vendor_tds)
      data.append('vendor_hsn', values.vendor_hsn)
      data.append('supplier_posting_date', formatYMD(values.supplier_posting_date))
      data.append('supplier_ref_no', values.supplier_ref_no) 
      
      const currentTime = new Date();

      const formatted =
        currentTime.getFullYear() + '-' +
        String(currentTime.getMonth() + 1).padStart(2, '0') + '-' +
        String(currentTime.getDate()).padStart(2, '0') + ' ' +
        String(currentTime.getHours()).padStart(2, '0') + ':' +
        String(currentTime.getMinutes()).padStart(2, '0') + ':' +
        String(currentTime.getSeconds()).padStart(2, '0');

      console.log(formatted,'formatted')

      data.append('approval_remarks', rejRemarks) 
      data.append('approval_status', 3) /* Approved */ 
      data.append('approval_at', formatted)
      data.append('approval_by', user_id) 

      if (res.data.STATUS == '2') {
        setFetch(true)
        toast.warning('Advance Amount Exceed.. Kindly Contact Admin!')
        return false
      }

      // if (values.document_no == undefined || values.document_no == '') {
      //   setFetch(true)
      //   toast.warning('Invalid Invoice Number,Contact SAP Team')
      //   return false
      // }
      let advance_id = singleVehicleInfo.advance_payment_info.id

      console.log('PRO API Completion')
      console.log(data, 'FormData : PRO')

      // setFetch(true)
      // return false
      
      NlmtAdvanceCreationService.updateAdvance(advance_id, data).then((res) => {
      // NlmtAdvanceCreationService.createAdvance(data).then((res) => {
        console.log(res + 'fbvfdbfdxgbfgbfgbfg')

        if (res.status == 200) {
          Swal.fire({
            title: "Advance Payment Submitted Successfully",
            html: `SAP Freight Amount - ${values.sap_freight_payment_amount ?? '-'}<br/>SAP Freight Doc.No - ${values.sap_freight_payment_document_no ?? '-'}<br/>SAP Bank Amount - ${values.sap_bank_payment_amount ?? '-'}<br/>SAP Bank Doc.No - ${values.sap_bank_payment_document_no ?? '-'}`,
            icon: "success",
            confirmButtonText: "OK",
          }).then(function () {
            navigation('/NlmtAdvancePaymentApproval')
          });
        } else if (res.status == 201) {
          Swal.fire({
            title: res.data.message,
            icon: "warning",
            confirmButtonText: "OK",
          }).then(function () {
            // window.location.reload(false)
          });
        } else {
          toast.warning(
            'Advance Approval Cannot Be Submitted From LP.. Kindly Contact Admin!'
          )
        }
      })
      .catch((error) => {
        // setState({ ...state })
        for (let value of data.values()) {
          console.log(value)
        }
        console.log(error)
        var object = error.response.data.errors
        var output = ''
        for (var property in object) {
          output += '*' + object[property] + '\n'
        }
        setError(output)
        setErrorModal(true)
      })
    })
  
  }

  useEffect(() => {
    if (Object.keys(errors).length === 0 && Object.keys(isTouched)) {
      setValidateSubmit(false)
    } else {
      setValidateSubmit(true)
    }

    console.log(singleVehicleInfo, 'singleVehicleInfo--2')
    console.log(values)
    topayPartyCheck(singleVehicleInfo)
  })
  useEffect(() => {
    const originalAdvance = Number(singleVehicleInfo?.tripsheet_info?.advance_amount) || 0

    if (checked) {
      if (values.advance_paymented === '' || values.advance_paymented === undefined) {
        setAcceptBtn(true)
        return
      }

      const changedAdvance = Number(values.advance_paymented) || 0
      if (changedAdvance > 0) {
        const postingDateFilled = !!values.sap_invoice_posting_date
        const paymentModeFilled = !!values.payment_mode
        const otpFilled = (values.otp && values.otp.length === 4) || (values.otp1 && values.otp1.length === 4)
        const otpVerified = otpVerify === true
        const formUploaded = !!values.advance_form
        const remarksFilled = !!remarks

        if (  
            postingDateFilled && 
            paymentModeFilled && 
            // otpFilled && 
            // otpVerified && 
            formUploaded && 
            remarksFilled
          ) 
        {
          setAcceptBtn(false)
        } else {
          setAcceptBtn(true)
        }
      } else {
        const postingDateFilled = !!values.sap_invoice_posting_date
        if (postingDateFilled) {
          setAcceptBtn(false)
        } else {
          setAcceptBtn(true)
        }
      }
    } else {
      if (originalAdvance > 0) {
        const postingDateFilled = !!values.sap_invoice_posting_date
        const paymentModeFilled = !!values.payment_mode
        const otpFilled = (values.otp && values.otp.length === 4) || (values.otp1 && values.otp1.length === 4)
        const otpVerified = otpVerify === true
        const formUploaded = !!values.advance_form
        const remarksFilled = !!remarks

        if (postingDateFilled && paymentModeFilled && otpFilled && otpVerified && formUploaded && remarksFilled) {
          setAcceptBtn(false)
        } else {
          setAcceptBtn(true)
        }
      } else {
        const postingDateFilled = !!values.sap_invoice_posting_date
        if (postingDateFilled) {
          setAcceptBtn(false)
        } else {
          setAcceptBtn(true)
        }
      }
    }
  }, [
    checked,
    otpVerify,
    values.sap_invoice_posting_date,
    values.payment_mode,
    values.otp,
    values.otp1,
    values.advance_form,
    values.advance_paymented,
    remarks,
    singleVehicleInfo
  ])
  useEffect(() => {
    if (
      !errors.actual_freight &&
      !errors.advance_payment
      // isTouched.actual_freight
    ) {
      setAcceptBtn1(false)
    } else {
      setAcceptBtn1(true)
    }
  }, [errors])

 
  const [rejRemarks, setRejRemarks] = useState('')

  const handleChangenew1 = (event) => {
    const result1 = event.target.value.toUpperCase()

    setRejRemarks(result1)
  }

  const [topayPartyFreightLock, setTopayPartyFreightLock] = useState(false)

  const topayPartyCheck = (topayPartyCheckData) => {
    console.log(topayPartyCheckData, 'topayPartyCheckData')
    let tpv = 0

    if (
      topayPartyCheckData &&
      topayPartyCheckData.tripsheet_info &&
      topayPartyCheckData.tripsheet_info.purpose == 1 &&
      (topayPartyCheckData.tripsheet_info.to_divison == 1 ||
        topayPartyCheckData.tripsheet_info.to_divison == 2)
    ) {
      if (
        topayPartyCheckData.shipment_info &&
        topayPartyCheckData.shipment_info[0].shipment_all_child_info
      ) {
        tpv = topayPartyValid(topayPartyCheckData.shipment_info[0].shipment_all_child_info)
      }
    }
    console.log(tpv, 'tpv')
    if (tpv == '101') {
      setTopayPartyFreightLock(true)
    } else {
      setTopayPartyFreightLock(false)
    }
  }

  const topayPartyValid = (topayPartyValidData) => {
    var inco_term_array = ['381', '382']
    let shipment_inco_term_array = []
    console.log(topayPartyValidData, 'topayPartyValidData')

    topayPartyValidData.map((vv, kk) => {
      if (JavascriptInArrayComponent(vv.inco_term_id, inco_term_array)) {
        //
      } else {
        shipment_inco_term_array.push(vv.inco_term_id)
      }
    })

    console.log(shipment_inco_term_array, 'shipment_inco_term_array')

    if (shipment_inco_term_array.length == 0 && topayPartyValidData.length > 0) {
      return '101'
    } else {
      return '102'
    }
  }

  const getOldLogInfo = () => {
    let data = [] 
    let temp = singleVehicleInfo.tripsheet_info.freight_log_info ? JSON.parse(singleVehicleInfo.tripsheet_info.freight_log_info) : []
    console.log(temp,'getOldLogInfo') 
    temp.map((vk,kk)=>{
      data[kk] = vk 
    }) 
    console.log(data,'getOldLogInfo-data')
    return data
  }

  const ColoredLine = ({ color }) => (
    <hr
      style={{
          color: color,
          backgroundColor: color,
          height: 5
      }}
    />
  ) 
  
  const veh_capacity_finder = (capacity) => {
    let cap = ''
    if(vehicleCapacity.length > 0){
      vehicleCapacity.map((vv,kk)=>{
        if(capacity == vv.id){
          cap = vv.capacity
        }
      })
    }
    return cap
  }

  const NlmtAdvanceApprovalCancel = () => {
    
    console.log(rejRemarks, 'NlmtAdvanceApprovalCancel-Remarks')
    if (rejRemarks && rejRemarks.trim()) {
      rejectAdvanceApproval()
    } else {
      setFetch(true)
      Swal.fire({
        title: 'Remarks required for rejection..',
        icon: "warning",
        confirmButtonText: "OK",
      }).then(function () {
      })
      setRejRemarks('')
      return false
    }
  }

  const rejectAdvanceApproval = () => {
    const formDataUpdate = new FormData()

    formDataUpdate.append('id', id)
    formDataUpdate.append('created_by', user_id)
    formDataUpdate.append('remarks', rejRemarks)
    NlmtAdvanceCreationService.rejectAdvanceApproval(formDataUpdate).then((res) => {
      console.log(res)
      setFetch(true)
      if (res.status == 200) {
        Swal.fire({
          title: "Advance Approval Rejected Successfully!",
          icon: "success",
          confirmButtonText: "OK",
        }).then(function () {
          navigation('/NlmtAdvancePaymentApproval')
        });
      } else if (res.status == 201) {
        Swal.fire({
          title: res.data.message,
          icon: "warning",
          confirmButtonText: "OK",
        }).then(function () {
          // window.location.reload(false)
        });
      } else {
        toast.warning(
          'Advance Approval Cannot Be Rejected From LP.. Kindly Contact Admin!'
        )
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

  const RejectionProcess = () => {
    console.log(rejRemarks,'apremarks')
    if (rejRemarks && rejRemarks.trim()) {
      FreightUpdationRejection()
    } else {
      setFetch(true)
      Swal.fire({
        title: 'Remarks required for rejection..',
        icon: "warning",
        confirmButtonText: "OK",
      }).then(function () {
      })
      setRejRemarks('')
      return false
    }
  }

  const columns = [
    {
      name: 'S.No',
      selector: (row) => row.S_NO,
      sortable: true,
      center: true,
    },
    {
      name: 'Type',
      selector: (row) => row.Type,
      sortable: true,
      center: true,
    },
    {
      name: 'Freight Rate',
      selector: (row) => row.FreightRate,
      sortable: true,
      center: true,
    }, 
    {
      name: 'Modified Freight Rate',
      selector: (row) => row.UpdatedFreightRate,
      sortable: true,
      center: true,
    }, 
    {
      name: 'Remarks',
      selector: (row) => row.remarks,
      sortable: true,
      center: true,
    }, 
    {
      name: 'User',
      selector: (row) => row.User,
      sortable: true,
      center: true,
    },
    {
      name: 'Time',
      selector: (row) => row.DateTime,
      sortable: true,
      center: true,
    }
  ]

  

  function FreightUpdationRejection() {
    const formDataUpdate = new FormData()
    formDataUpdate.append('id', singleVehicleInfo.tripsheet_id)
    formDataUpdate.append('updated_by', user_id)
    formDataUpdate.append('remarks', rejRemarks)

    let current_time = getCurrentDateTime()
    let current_info = getOldLogInfo()
    current_info.push({
      route_id: singleVehicleInfo.tripsheet_info.route_id ?? '',
      freight_rate: singleVehicleInfo.tripsheet_info.trip_freight_rate ?? '', 
      freight_change: 1, 
      updated_freight_rate: singleVehicleInfo.tripsheet_info.trip_updated_freight_rate ?? '', 
      type: 3, /* Rejection */
      user: user_id,
      time: current_time,
      remarks: rejRemarks,
    })
    formDataUpdate.append('freight_log_info', JSON.stringify(current_info))

    NlmtTSFreightUpdationService.rejectFreightUpdationApprovalData(formDataUpdate).then((res) => {
      console.log(res)
      setFetch(true)
      if (res.status == 200) {
        Swal.fire({
          title: "Freight Updation Rejected Successfully!",
          icon: "success",
          confirmButtonText: "OK",
        }).then(function () {
          navigation('/NlmtAdvancePaymentApproval')
        });
      } else if (res.status == 201) {
        Swal.fire({
          title: res.data.message,
          icon: "warning",
          confirmButtonText: "OK",
        }).then(function () {
          window.location.reload(false)
        });
      } else {
        toast.warning(
          'NLMT Freight Cannot Be Rejected From LP.. Kindly Contact Admin!'
        )
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
              <CCard>
                {singleVehicleInfo && (
                  <CForm className="container p-3" onSubmit={handleSubmit}>
                    {singleVehicleInfo.vehicle_info.vehicle_type_id === 21 ? (
                      <NlmtAdvanceCreationOwn
                        values={values}
                        errors={errors}
                        handleChange={handleChange}
                        onFocus={onFocus}
                        onBlur={onBlur}
                        singleVehicleInfo={singleVehicleInfo}
                        isTouched={isTouched}
                        dirverAssign={dirverAssign}
                        setDirverAssign={setDirverAssign}
                        remarks={remarks}
                        handleChangenew={handleChangenew}
                        checked={checked}
                        setChecked={setChecked}
                        otpVerify={otpVerify}
                        setOtpVerify={setOtpVerify}
                        otpGenerated={otpGenerated}
                        setOtpGenerated={setOtpGenerated}
                      />
                    ) : singleVehicleInfo.vehicle_info.vehicle_type_id === 22 ? (
                      <NlmtAdvanceCreationHire
                        values={values}
                        errors={errors}
                        handleChange={handleChange}
                        onFocus={onFocus}
                        onBlur={onBlur}
                        singleVehicleInfo={singleVehicleInfo}
                        isTouched={isTouched}
                        remarks={remarks}
                        rejRemarks={rejRemarks}
                        handleChangenew={handleChangenew}
                        handleChangenew1={handleChangenew1}
                        vendorMobileValue={vpanMobile}
                        setTotalFreightAmount={setTotalFreightAmount}
                      />
                    ) : (
                      <NlmtAdvanceCreationHire
                        values={values}
                        errors={errors}
                        handleChange={handleChange}
                        onFocus={onFocus}
                        onBlur={onBlur}
                        singleVehicleInfo={singleVehicleInfo}
                        isTouched={isTouched}
                        remarks={remarks}
                        rejRemarks={rejRemarks}
                        handleChangenew={handleChangenew}
                        handleChangenew1={handleChangenew1}
                      />
                    )}
                    {singleVehicleInfo.vehicle_info.vehicle_type_id === 21 ? (
                      <CRow className="mt-md-3">
                        <CCol className="" xs={12} sm={12} md={3}>
                          <CButton size="sm" color="primary" className="text-white" type="button">
                            <Link className="text-white" to="/NlmtAdvancePaymentApproval">
                              Previous
                            </Link>
                          </CButton>
                        </CCol>
                        <CCol
                          className="offset-md-6"
                          xs={12}
                          sm={12}
                          md={3}
                          style={{ display: 'flex', justifyContent: 'end' }}
                        >
                          <CButton
                            size="sm"
                            color="warning"
                            className="mx-3 px-3 text-white"
                            // type="button"
                            // disabled={acceptBtn}
                            // style={{ opacity: acceptBtn ? 0.5 : 1, cursor: acceptBtn ? 'not-allowed' : 'pointer' }}
                            onClick={() => {
                              setFetch(false)
                              CreateAdvanceOwn(1)
                            }}
                            // type="submit"
                          >
                            Submit {/* Own Process Submit */}
                          </CButton>

                          {/* <CButton
                          size="sm"
                          color="warning"
                          className="mx-3 px-3 text-white"
                          type="button"
                          onClick={ () =>{setFetch(false)
                            CreateAdvanceOwn(2)}}
                        >
                        Reject
                        </CButton> */}
                        </CCol>
                      </CRow>
                    ) : (
                      <>
                      
                        <ColoredLine color="red" /> 
                        <CRow key={`HireshipmentDeliveryData`} className="mt-2" hidden>
                          <CCol xs={12} md={6}>
                            <CFormLabel
                              htmlFor="inputAddress"
                              style={{
                                backgroundColor: '#4d3227',
                                color: 'white',
                              }}
                            >
                              Freight Update Process History
                            </CFormLabel>
                          </CCol>
                        </CRow>         
                                  
                        <CustomTable
                          columns={columns}
                          pagination={false}
                          data={rowData}
                          fieldName={'Driver_Name'}
                          showSearchFilter={true}
                        />
                        <ColoredLine color="red" />

                        {
                          ( singleVehicleInfo.vendor_info == null ||
                            ( singleVehicleInfo.vendor_info && 
                              singleVehicleInfo.vendor_info.vendor_code == 0
                            )
                          ) && (
                          <CRow className="mt-md-3">
                            <CCol xs={12} md={9} style={{ display: 'flex', justifyContent: 'end' }}>
                              <span style={{ color: 'red' }}>
                                *Vendor Creation Process is pending. So Advance Payment not possible for
                                this Tripsheet..
                              </span>
                            </CCol>
                          </CRow>
                        )}
                      
                        <CRow className="mt-md-3">
                          <CCol className="" xs={12} sm={12} md={3}>
                            <CButton size="sm" color="primary" className="text-white" type="button">
                              <Link className="text-white" to="/NlmtAdvancePaymentApproval">
                                Previous
                              </Link>
                            </CButton>
                          </CCol>
                          
                          {(singleVehicleInfo.tripsheet_info.freight_approval_status == 0 || singleVehicleInfo.tripsheet_info.freight_approval_status == 2) ? (
                            <CCol
                              className="offset-md-6"
                              xs={12}
                              sm={12}
                              md={3}
                              style={{ display: 'flex', justifyContent: 'end' }}
                            >

                              {/* <CButton
                                size="sm"
                                color="danger"
                                className="mx-3 px-3 text-white" 
                                onClick={() => {
                                  setFetch(false)
                                  RejectionProcess()
                                }} 
                              >
                                Freight Reject
                              </CButton> */}
                              <CButton
                                size="sm"
                                color="danger"
                                className="mx-3 px-3 text-white" 
                                onClick={() => {
                                  setFetch(false)
                                  NlmtAdvanceApprovalCancel()
                                }} 
                              >
                                Reject
                              </CButton>
                              {( singleVehicleInfo.vendor_info && singleVehicleInfo.vendor_info.vendor_code != 0 &&
                                <CButton
                                  size="sm"
                                  color="success"
                                  className="mx-3 px-3 text-white" 
                                  onClick={() => {
                                    setFetch(false)
                                    CreateAdvanceHire() 
                                  }} 
                                >
                                  Approve {/* Hire Process Submit */}
                                </CButton> 
                              )}                              
                            </CCol>
                          ) : (
                            <CCol md={7} style={{ border: "1px solid black", marginTop: "2px", background: "aliceblue" }}>
                              <CFormLabel>
                                Note :
                              </CFormLabel>
                              <span style={{ display: "block", fontWeight: "bold" }} className="big text-danger">
                                The tripsheet is awaiting freight approval; therefore, advance payment cannot be made.
                              </span>
                            </CCol>
                          )} 
                        </CRow>
                      </>
                    )}
                  </CForm>
                )}
              </CCard>
            </>
          ) : (
            <AccessDeniedComponent />
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
    </>
  )
}

export default NlmtAdvancePaymentApproval
