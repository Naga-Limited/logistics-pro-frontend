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
  CFormTextarea,
  CFormSelect,
  CInputGroup,
  CInputGroupText,
  CAlert
} from '@coreui/react'
import useForm from 'src/Hooks/useForm'
import { Link, useNavigate, useParams } from 'react-router-dom'
import TripSheetCreationValidation from 'src/Utils/TripSheetCreation/TripSheetCreationValidation'
import { useEffect } from 'react'
import TripSheetCreationService from 'src/Service/TripSheetCreation/TripSheetCreationService'
import { Object } from 'core-js'
import { ToastContainer, toast } from 'react-toastify'
import Loader from 'src/components/Loader'
import 'react-toastify/dist/ReactToastify.css'
import AdvanceCreationOwn from './segments/OwnAndContract/AdvanceCreationOwn'
import AdvanceCreationHire from './segments/Hire/AdvanceCreationHire'
import AdvanceCreationService from 'src/Service/Advance/AdvanceCreationService'
import AdvanceCreationValidation from 'src/Utils/Advance/AdvanceCreationValidation'
// import VendorOutstanding from 'src/Service/SAP/VendorOutstanding'
// import OwnAndContractAdvanceRequest from './Requests/OwnAndContractAdvanceRequest'
// import HireAdvanceRequest from './Requests/HireAdvanceRequest'
import AdvanceHireSAP from 'src/Service/SAP/AdvanceHireSAP'
import AdvanceOwnSAP from 'src/Service/SAP/AdvanceOwnSAP'
import useFormAdvance from 'src/Hooks/useFormAdvance'
import AdvanceCreationHireUpdate from './segments/HireUpdate/AdvanceCreationHireUpdate'

import AccessDeniedComponent from 'src/components/commoncomponent/AccessDeniedComponent'
import JavascriptInArrayComponent from 'src/components/commoncomponent/JavascriptInArrayComponent'
import * as LogisticsProScreenNumberConstants from 'src/components/constants/LogisticsProScreenNumberConstants'

import Swal from "sweetalert2";
import JavascriptDateCheckComponent from 'src/components/commoncomponent/JavascriptDateCheckComponent'
import ExpenseIncomePostingDate from '../TripsheetClosure/Calculations/ExpenseIncomePostingDate'
import PanDataService from 'src/Service/SAP/PanDataService'

const AdvanceRequest = () => {
  const user_info_json = localStorage.getItem('user_info')
  const user_info = JSON.parse(user_info_json)

  /* Get User Id From Local Storage */
  const user_id = user_info.user_id

  /* ==================== Access Part Start ========================*/
  const [screenAccess, setScreenAccess] = useState(false)
  let page_no = LogisticsProScreenNumberConstants.AdvancePaymentModule.Advance_Payment_List

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

  const Expense_Income_Posting_Date_Taken = ExpenseIncomePostingDate();
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
    frpt:'' /* Freight Rate Per Ton */
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
  const [error, setError] = useState({})
  const navigation = useNavigate()
  const [ButtonDisable, setButtonDisable] = useState(false)
  const [vpan, setVpan] = useState('')
  const [vpanMobile, setVpanMobile] = useState(0)
  const [vpanMobileHaving, setVpanMobileHaving] = useState(false)
  
  const vehicleType = {
    OWN: 1,
    CONTRACT: 2,
    HIRE: 3,
  }

  const totalFreightvaluefinder = (type,Actual_Freight,Low_Tonnage_Charges) => {
    let ans = 0
    let ans1 = 0
    if(type == 1){
      console.log(Actual_Freight,'totalFreightvaluefinder-Inco_Term_wise_Freight')
    } else{
      console.log(Actual_Freight,'totalFreightvaluefinder-Actual_Freight')
    }
    console.log(Low_Tonnage_Charges,'totalFreightvaluefinder-Low_Tonnage_Charges')
    let Total_Freight = Number(Actual_Freight) + (Number.isInteger(Number(Low_Tonnage_Charges)) ? Number(Low_Tonnage_Charges) : 0)
    ans = Number(parseFloat(Total_Freight).toFixed(2))
    ans1 = Math.round(ans)
    console.log(ans1,'totalFreightvaluefinder-totalFreightvalue')
    return ans1 ? ans1 : 0
  }

  // const totalvaluefinder = (type,data,tp_data) => {
  //   console.log(values,'totalvaluefinderp-values')
  //   console.log(type,'totalvaluefinderp-type')
  //   console.log(data,'totalvaluefinderp-data')
  //   let children = data.shipment_child_info
  //   let totval_type1 = 0
  //   let totval_type2 = 0
  //   let totval_type3 = 0
     
  //     children.map((vv,kk)=>{
  //       if(vv.invoice_uom == 'KG'){
  //         let qtty = Number(vv.invoice_net_quantity)/1000
  //         console.log(qtty,'totalvaluefinderp1')
  //         totval_type1 = totval_type1+qtty
  //         if(JavascriptInArrayComponent(vv.inco_term_id ,[381,382])){
  //           //
  //         } else {
  //           totval_type3 = totval_type3+qtty
  //         }

  //       } else {
  //         //
  //       }
  //       // let ammt = freightamountfinder(vv.inco_term_id,tp_data.freight_rate_per_tone,getDeliveryQuantity(vv.invoice_net_quantity,vv.invoice_uom))
  //       let ammt = freightamountfinder(vv.inco_term_id,values.frpt,getDeliveryQuantity(vv.invoice_net_quantity,vv.invoice_uom))
  //       console.log(totval_type2,'totalvaluefinderp1-child ammt-addition')
  //       totval_type2 = totval_type2+ammt
  //       console.log(totval_type2,'totalvaluefinderp1-child totval_type2-addition')
  //     })
     
  //   console.log(totval_type1,'totalvaluefinderp1')
  //   console.log(totval_type2,'totalvaluefinderp2')
  //   console.log(totval_type3,'totalvaluefinderp3')
  //   if(type == 1){
  //     return Number(parseFloat(totval_type1).toFixed(2))
  //   } else if(type == 2){
  //     // return totval_type2
  //     return Math.round(totval_type2)
  //   } else if(type == 3){
  //     return Number(parseFloat(totval_type3).toFixed(2))
  //   } 
  // }

  const totalvaluefinder = (type,data) => {
    console.log(values,'totalvaluefinderparent-values')
    console.log(type,'totalvaluefinderparent-type')
    console.log(data,'totalvaluefinderparent-data')
      
    let totval_type1 = 0
    let totval_type2 = 0
    let totval_type3 = 0

    if(data){

      let children = data.shipment_child_info
      
      children.map((vv,kk)=>{
        if(vv.invoice_uom == 'KG'){
          let qtty = Number(vv.invoice_net_quantity)/1000
          console.log(qtty,'totalvaluefinderparent-qty')
          totval_type1 = totval_type1+qtty
          if(JavascriptInArrayComponent(vv.inco_term_id ,[381,382])){
            //
          } else {
            totval_type3 = totval_type3+qtty
          }

        } else {
          //
        }
        let ammt = freightamountfinder(vv.inco_term_id,values.frpt,getDeliveryQuantity(vv.invoice_net_quantity,vv.invoice_uom))
        console.log('totalvaluefinderparent-child-amount - ',ammt,', Key - ',kk)
        totval_type2 = totval_type2+ammt
      })
      
      console.log(totval_type1,'totalvaluefinderparent-totval_type1')
      console.log(totval_type2,'totalvaluefinderparent-totval_type2')
      console.log(totval_type3,'totalvaluefinderparent-totval_type3')
      
    }
    if(type == 1){
      return Number(parseFloat(totval_type1).toFixed(2))
    } else if(type == 2){ 
      console.log(Math.round(totval_type2),'totalvaluefinderparent-rounded totval_type2 value')
      return Math.round(totval_type2)
    } else if(type == 3){
      return Number(parseFloat(totval_type3).toFixed(2))
    } 
  }

  const freightamountfinder = (id,ton,qty) => {
    console.log(id,'freightamountfinder-id')
    console.log(ton,'freightamountfinder-ton')
    console.log(qty,'freightamountfinder-qty')
    if(JavascriptInArrayComponent(id,[381,382])){
      return 0
    }
    let ans = Number(ton)*qty
    console.log(ans,'freightamountfinder-ans') 
    // return Math.round(ans)
    return Number(ans)
    // return parseInt(ans)
  }

  const getDeliveryQuantity = (qty,uom) => {
    if(uom == 'KG'){
      console.log(Number(qty)/1000,'getDeliveryQuantity')
      // return Number(parseFloat(qty).toFixed(2))
      return Number(qty)/1000
    } else {
      return '-'
    }
  }

  // document.addEventListener('contextmenu', event => event.preventDefault());
  useEffect(() => {
    AdvanceCreationService.getSingleVehicleInfoOnGate(id).then((res) => {
      setFetch(true)
      console.log(res.data.data,'getSingleVehicleInfoOnGate')
      if (res.status === 200) {
        let resp_data = res.data.data
        vendorDataAssignment(resp_data)
        isTouched.vehicle_id = true
        values.tripsheet_id = res.data.data.tripsheet_sheet_id
        isTouched.driver_id = true
        isTouched.tripsheet_id = true
        isTouched.vehicle_type_id = true
        values.parking_id = true
        values.parking_id = res.data.data.parking_yard_gate_id
        values.trip_sheet_no =
          res.data.data.trip_sheet_info != null ? res.data.data.trip_sheet_info.trip_sheet_no : ''
        values.purpose =
          res.data.data.trip_sheet_info != null ? res.data.data.trip_sheet_info.purpose : ''
        values.to_divison =
          res.data.data.trip_sheet_info != null ? res.data.data.trip_sheet_info.to_divison : ''
        values.driver_code =
          res.data.data.driver_info != null ? res.data.data.driver_info.driver_code : ''
        if(res.data.data.Parking_Vendor_Info){
          values.vendor_code = res.data.data.Parking_Vendor_Info.vendor_code
        } else {
          values.vendor_code = res.data.data.vendor_info != null ? res.data.data.vendor_info.vendor_code : ''
        }
        // values.vendor_code =
        // res.data.data.Parking_Vendor_Info != null ? res.data.data.vendor_info.vendor_code : res.data.data.vendor_info != null ? res.data.data.vendor_info.vendor_code : ''
        values.advance_payments =
          res.data.data.trip_sheet_info != null ? res.data.data.trip_sheet_info.advance_amount : ''
        values.advance_payment_diesel =
          res.data.data.diesel_intent_info != null ? res.data.data.diesel_intent_info.total_amount
            : '0'
        values.advance_payment_update =
          res.data.data.advance_info != null ? res.data.data.advance_info.advance_payment : ''
        values.advance_payment_diesel_update =
          res.data.data.advance_info != null ? res.data.data.advance_info.advance_payment_diesel
            : ''
        // values.actual_freight = res.data.data.trip_sheet_info.freight_rate_per_tone
        values.vehicle_type_id = res.data.data.vehicle_type_id.id
        values.vehicle_id = res.data.data.vehicle_id
        values.driver_id =
          res.data.data.driver_info != null ? res.data.data.driver_info.driver_id : ''
        values.driveMobile =
          res.data.data.driver_info != null ? res.data.data.driver_info.driver_phone_1 : ''
        values.frpt = res.data.data.trip_sheet_info.freight_rate_per_tone
        values.freight_remarks = res.data.data.vehicle_document != null ? res.data.data.vehicle_document.remarks : ''
        if(res.data.data.trip_sheet_info.purpose == 1 && res.data.data.trip_sheet_info.to_divison == 1 && res.data.data.driver_info == null){
          let sp_data = res.data.data.shipment_info[0]
          let tp_data = res.data.data.trip_sheet_info
          values.actual_freight = totalvaluefinder(2,sp_data,tp_data)
        } else {
          values.actual_freight = Number(res.data.data.vehicle_capacity_id !=null ? res.data.data.vehicle_capacity_id.capacity : '') * Number(res.data.data.trip_sheet_info != null ? res.data.data.trip_sheet_info.freight_rate_per_tone :'')
        values.balance1 = (values.actual_freight)-(Number(res.data.data.trip_sheet_info !=null ? res.data.data.trip_sheet_info.advance_amount : '') + Number(res.data.data.diesel_intent_info != null ? res.data.data.diesel_intent_info.total_amount :''))
        }

        values.totalvalue1 = Number(values.balance1) + (Number(res.data.data.trip_sheet_info !=null ? res.data.data.trip_sheet_info.advance_amount : '') + Number(res.data.data.diesel_intent_info != null ? res.data.data.diesel_intent_info.total_amount :''))

        // values.shipment_ton =
          // res.data.data.shipment_info != null ? res.data.data.shipment_info[0].shipment_qty : ''
        // values.freight_rate_per_tone =
        //   res.data.data.vehicle_Freight_info == undefined
        //     ? '0'
        //     : res.data.data.vehicle_Freight_info.freight_rate_per_ton
        setRemarks(res.data.data.advance_info != null ? res.data.data.advance_info.remarks
            : '')
        values.bank_remarks = res.data.data.advance_info != null ? res.data.data.advance_info.bank_remarks
        : ''
        values.vendor_tds = res.data.data.advance_info != null ? res.data.data.advance_info.vendor_tds
        : ''
        values.vendor_hsn = res.data.data.advance_info != null ? res.data.data.advance_info.vendor_hsn
        : ''
        values.tds_type = res.data.data.advance_info != null ? res.data.data.advance_info.tds_type
        : ''
        setSingleVehicleInfo(res.data.data)
        console.log(singleVehicleInfo,'singleVehicleInfo--1')
      }
    })
  }, [])

  const vendorDataAssignment = (resp_data) => { 
    let vcode = 0
    
    if(resp_data.Parking_Vendor_Info){
      vcode = resp_data.Parking_Vendor_Info.vendor_code
    } else {
      vcode = resp_data.vendor_info != null ? resp_data.vendor_info.vendor_code : ''
    }

    if(vcode == 0 || vcode == ''){
      setVpan('')
    } else {
      let vp = resp_data?.Parking_Vendor_Info?.pan_card_number || resp_data?.vendor_info?.pan_card_number
      console.log(vp,'vendorDataAssignment-vp')
      setVpan(vp)
    }
  }

  const panMobileCheck = (data) => {
    console.log(data,'panMobileCheck')
    let mobValue = data.TELF1 ? data.TELF1 : ''
    let mobCondition = 0
    if(mobValue.trim() != ''){
    // if(data.TELF1 && /^[\d]{10}$/.test(data.TELF1)){
      mobCondition = 1
    } 
    return mobCondition
  }

  useEffect(() => {
    if(vpan && singleVehicleInfo){
      // PanDataService.getPanData(vpan).then((res) => {
      PanDataService.getMultiVendorInfoByPan(vpan).then((res) => {
        if (res.status == 200 && res.data != '') { 
          console.log(res,'current_vendor_code-res')
          
          let vendorCode = ''
          if(singleVehicleInfo.Parking_Vendor_Info){
            vendorCode = singleVehicleInfo.Parking_Vendor_Info.vendor_code
          } else {
            vendorCode = singleVehicleInfo.vendor_info != null ? singleVehicleInfo.vendor_info.vendor_code : ''
          }
          console.log(vendorCode,'current_vendor_code')

          let multiple_vendor_data = res.data && res.data.length > 0 ? res.data : []
          let current_vendor_data = {}
          multiple_vendor_data.map((vv,kk)=>{
            if(vv.LIFNR == vendorCode){
              current_vendor_data = vv
            }
          })
          console.log(current_vendor_data,'current_vendor_code-sap-data')
          // console.log(res.data[0],'panNumbernew')
          if(panMobileCheck(current_vendor_data) === 1){
            console.log('SAP-VENDOR-MOBILE-NUMBER-VERIFIED')
            setVpanMobile(current_vendor_data.TELF1)
            setVpanMobileHaving(true)
          } else {
            console.log('SAP-VENDOR-MOBILE-NUMBER-MISSING/INVALID')
            toast.warning('SAP - Vendor Mobile Number was Missing or Invalid. Kindly update Address in SAP..')  
            setVpanMobileHaving(false)
            setVpanMobile(0) 
          } 
        } else { 
          setVpanMobileHaving(false) 
        }
      })
    }
  },[vpan,singleVehicleInfo])

  const bankAmountExists = (v1,v2,v3) => {
    console.log(v1,'bankAmountExists:Freight-Tonnage-Amount')
    console.log(v2,'bankAmountExists:Bank-Advance-Amount')
    console.log(v3,'bankAmountExists:Diesel-Advance-Amount')
    let lowtoncharge = values.low_tonnage_charges
    let Total_Freight = Number(v1) + (Number.isInteger(Number(lowtoncharge)) ? Number(lowtoncharge) : 0) 
    let alloted_amount = Total_Freight*4/5
    let alloted_amount1 = Math.round(alloted_amount)
    console.log(alloted_amount1,'bankAmountExists:80%-Advance-Amount')
    let bank_advance_allowed_amount = alloted_amount1 - v3 
    let bank_advance_allowed_amount1 = Math.round(bank_advance_allowed_amount)
    console.log(bank_advance_allowed_amount,'bankAmountExists:bank_advance_allowed_amount')
    if(v2 > bank_advance_allowed_amount1 ){
      return 101
    }
    return 102
  }

  const bank_advance_limit_finder = (type,lowtoncharge,v3) => { 

    let v1 = 0
    if(type == 1){
      v1 = totalvaluefinder(2,singleVehicleInfo.shipment_info[0])
    } else {
      v1 = values.actual_freight
    }

    let Total_Freight = Number(v1) + (Number.isInteger(Number(lowtoncharge)) ? Number(lowtoncharge) : 0) 
    let alloted_amount = Total_Freight*4/5
    let alloted_amount1 = Math.round(alloted_amount)

    let bank_advance_allowed_amount = alloted_amount1 - v3 
    let bank_advance_allowed_amount1 = Math.round(bank_advance_allowed_amount)
    console.log(bank_advance_allowed_amount1,'bank_advance_limit_finder-bank_advance_allowed_amount')

    // return bank_advance_allowed_amount
    return Math.round(bank_advance_allowed_amount1)
  }

  function diffTime(start, end) {

    let st = new Date(start)
    let et = new Date(end)
    return (et-st)/1000
  }

  function timeValidation (mgiTime,mgoTime){
    let condition = 0
    if(mgiTime != '' && mgoTime != ''){

      let difference111 = diffTime(mgiTime,mgoTime)

      console.log(difference111,'difference111')

      if(difference111 < 0){
        condition = 1
      } else {
        condition = 0
      }

    } else {
      condition = 0
    }
    console.log(condition,'difference111-condition')
    return condition
  }

  const { values, errors, handleChange, onFocus, handleSubmit, enableSubmit, onBlur, isTouched } =
    useFormAdvance(CreateAdvanceOwn, AdvanceCreationValidation, formValues)

    const refreshPage = () =>{ window. location. reload(false); }

  function CreateAdvance(status) {
    setState({ ...state, page_loading: true })
    let formData = new FormData()
    let formData1 = new FormData()
    let formData2 = new FormData()

    let BANK_DOC_NO = ''
    let FRE_DOC_NO = ''
    let from_date = Expense_Income_Posting_Date_Taken.min_date
    let to_date = Expense_Income_Posting_Date_Taken.max_date
    let updated_freight = 0
    let sap_total_freight = 0
    if(singleVehicleInfo.trip_sheet_info.purpose == 1 && singleVehicleInfo.trip_sheet_info.to_divison == 1 && singleVehicleInfo.driver_info == null){
      updated_freight = totalFreightvaluefinder(1,totalvaluefinder(2,singleVehicleInfo.shipment_info[0]),values.low_tonnage_charges)
      sap_total_freight = totalvaluefinder(2,singleVehicleInfo.shipment_info[0])
    } else {
      updated_freight = totalFreightvaluefinder(2,values.actual_freight,values.low_tonnage_charges)
      sap_total_freight = values.actual_freight
    } 

    let sap_actual_freight = 'FREIGHT_PAYMENT:' + sap_total_freight
    let sap_advance_payment_diesel = 'DIESEL_PAYMENT:' + values.advance_payment_diesel
    let sap_advance_payments = values.advance_payments || '0'

    formData.append('LIFNR', values.vendor_code)
    formData.append('TRIP_SHEET', values.trip_sheet_no)
    // formData.append('TRIP_SHEET', 'OK76913')
    formData.append('VEHICLE_NO', singleVehicleInfo.vehicle_number)
    formData.append('FREIGHT_PAYMENT',sap_actual_freight)
    formData.append('BANK_PAYMENT',sap_advance_payments)
    formData.append('TAX_TYPE', values.gst_tax_type)
    // formData.append('TDS', values.tds_type == 1 ? 'YES' : 'NO')
    formData.append('REMARKS', remarks)
    formData.append('bank_remark', values.bank_remarks)
    formData.append('POST_DATE', values.sap_invoice_posting_date)
    formData.append('BANK_DATE',values.bank_date)
    formData.append('REF_NO',values.supplier_ref_no ? values.supplier_ref_no: values.trip_sheet_no)
    formData.append('REF_DATE',values.supplier_posting_date) 
    formData.append('Load_tonnage_amt',values.low_tonnage_charges) 
    formData2.append('LIFNR', values.vendor_code)
    formData2.append('TRIP_SHEET', values.trip_sheet_no)

    // formData2.append('TRIP_SHEET', 'OK76911936')
    formData2.append('DIESEL_PAYMENT',sap_advance_payment_diesel)
    formData2.append('VEHICLE_NO', singleVehicleInfo.vehicle_number)
    formData2.append('REMARKS', remarks)
    formData2.append('POST_DATE',values.sap_invoice_posting_date)

    formData.append('TDS', values.vendor_tds == '0' ? 'NO' : 'YES')
    formData.append('TDS_VALUE', values.vendor_tds == '0' ? '' : values.vendor_tds)
    formData.append('HSN', values.vendor_hsn)

    if(singleVehicleInfo.trip_sheet_info.to_divison == 2 || (singleVehicleInfo.trip_sheet_info.purpose == 4 && singleVehicleInfo.trip_sheet_info.others_division == 6))
    {
      formData.append('PLANT', 'NLCD')
      formData2.append('PLANT', 'NLCD')
    } else {
      formData.append('PLANT', 'NLLD')
      formData2.append('PLANT', 'NLLD')
    }

    /* ========== Old Condition set By Maria - Start ========== */
    // let x = values.advance_payments
    // let y = values.advance_payment_diesel
    // let sum = Number(x) + Number(y)

    // console.log(sum)
    // var p = values.actual_freight
    // if (p < sum) {
    //   setFetch(true)
    //   toast.warning('Bank & Diesel Amount Should Be Less Than The Actual Freight Amount')
    //   return false
    // }
    /* ========== Old Condition set By Maria - End ========== */

    /* ========== New Condition set By Alwin - Start ========== */

      if(bankAmountExists(updated_freight,values.advance_payments,singleVehicleInfo.trip_sheet_info.advance_payment_diesel) == '101'){
        setFetch(true)
        toast.warning('Bank Advance Amount Limit Exists..')
        return false
      }
      
    /* ========== New Condition set By Alwin - End ========== */

    // else if (values.tds_type == '' || values.tds_type == undefined) {
    //   setFetch(true)
    //   toast.warning('Select The TDS ...')
    //   return false
    // }

    /* ================== ASK Validations Part Start ======================= */

    if (values.vendor_code == 0 || values.vendor_code == '') {
      setFetch(true)
      toast.warning('Please Create Vendor ..')
      return false
    } else if (values.driver_outstanding == undefined) {
       setFetch(true)
       toast.warning('Please Check Vendor outstanding')
       return false
    }else if (values.gst_tax_type == '' || values.gst_tax_type == undefined) {
      setFetch(true)
      toast.warning('Select The GST Tax Type ...')
      return false
    } else if(values.vendor_hsn == ''){
      setFetch(true)
      toast.warning('HSN Code Should be required..')
      return false
    } else if(values.sap_invoice_posting_date == '' || values.sap_invoice_posting_date == undefined){
      setFetch(true)
      toast.warning('Enter Freight Posting Date')
      return false
    } else if(!(JavascriptDateCheckComponent(from_date,values.sap_invoice_posting_date,to_date))){
      setFetch(true)
      toast.warning('Invalid Freight Posting date')
      return false          
    } else if(values.vendor_tds == ''){
      setFetch(true)
      toast.warning('Vendor TDS Tax Type Should be required..')
      return false
    } else if (isTouched.advance_payments && !/^[\d]{1,6}$/.test(values.advance_payments)) {
      toast.warning('Advance Payment Allow Only Numbers')
      setFetch(true)
      return false
    } else if((values.bank_date == '' && values.advance_payments > "0") || (values.bank_date == undefined &&  values.advance_payments > "0")){
      setFetch(true)
      toast.warning('Enter Advance Payment Bank Posting Date')
      return false
    } else if(!(JavascriptDateCheckComponent(from_date,values.bank_date,to_date)) && values.advance_payments > "0"){
      setFetch(true)
      toast.warning('Invalid Advance Payment Bank Posting date')
      return false          
    } else if(values.supplier_posting_date == '' || values.supplier_posting_date == undefined){
      setFetch(true)
      toast.warning('Enter Vendor Bill/Reference Date')
      return false

    } else if(timeValidation(values.supplier_posting_date,values.sap_invoice_posting_date) == 1){
      setFetch(true)
      toast.warning(`Vendor Bill/Reference Date should be on or before of Freight Posting Date.`)
      return false
    } else if(remarks == '' || remarks == undefined){
      setFetch(true)
      toast.warning('Enter Accounting Remarks')
      return false
    } else if (isTouched.low_tonnage_charges && !/^[\d]{1,6}$/.test(values.low_tonnage_charges)) {
      toast.warning('Low Tonnage Charges Should be in a numeric..')
      setFetch(true)
      return false
    } else if(values.bank_remarks == '' && values.advance_payments > "0" || values.bank_remarks == undefined &&  values.advance_payments > "0"){
      setFetch(true)
      toast.warning('Enter Bank Payment Remarks')
      return false
    } 

    let vcos = Number(values.driver_outstanding)
    // let vcos = 5
    // toast.success('VCOS : '+vcos)
    
    if(vcos > 0){
      let Bank_Advance_Eligible_Amount = 0
      if(singleVehicleInfo.trip_sheet_info.purpose == 1 && singleVehicleInfo.trip_sheet_info.to_divison == 1){
        Bank_Advance_Eligible_Amount = bank_advance_limit_finder(1,values.low_tonnage_charges,values.advance_payment_diesel)
      } else {
        Bank_Advance_Eligible_Amount = bank_advance_limit_finder(2,values.low_tonnage_charges,values.advance_payment_diesel)
      } 

      let Vendor_Current_Out_Standing_in_SAP = Number(values.driver_outstanding)

      let bank_advance_amount_taken = Number.isInteger(Number(values.advance_payments)) ? Number(values.advance_payments) : 0

      let ans = Number(Bank_Advance_Eligible_Amount) - Vendor_Current_Out_Standing_in_SAP 

      let Bank_Advance_Amount_Limit_asper_VOS = Number(parseFloat(ans).toFixed(2))

      console.log(Bank_Advance_Eligible_Amount,'Bank_Advance_Eligible_Amount')
      console.log(Vendor_Current_Out_Standing_in_SAP,'Vendor_Current_Out_Standing_in_SAP')
      console.log(Bank_Advance_Amount_Limit_asper_VOS,'Bank_Advance_Amount_Limit_asper_VOS')
      console.log(bank_advance_amount_taken,'Bank_Advance_Amount_Limit_asper_VOS')

      if(bank_advance_amount_taken !=0 && bank_advance_amount_taken > Bank_Advance_Amount_Limit_asper_VOS){
        setFetch(true)
        toast.warning('Bank Advance Amount Eligible asper VOS : Rs.'+Bank_Advance_Amount_Limit_asper_VOS)
        toast.warning('Vendor Having Debit Balance. So, need to deduct.')
        return false
      }  else {
        toast.success('Vendor Outstanding Amount is within the Limit..')
      }     
      
    } else {
      toast.success('Vendor Outstanding Amount is within the Limit..')
    }

    /* ================== ASK Validations Part End ======================= */
    toast.success('Validation Completed..')
    // setFetch(true)
    // console.log(values,'final validation values')
    // return false  

    if(values.actual_freight > "0" && values.advance_payment_diesel == "0"){

      AdvanceHireSAP.AdvanceHireSAP(formData).then((res) => {

        values.sap_freight_payment_document_no = res.data.FRE_DOC_NO
        values.sap_bank_payment_document_no = res.data.BANK_DOC_NO
        const data = new FormData()

        data.append('vehicle_id', values.vehicle_id)
        data.append('parking_id', values.parking_id)
        data.append('advance_payment_diesel', values.advance_payment_diesel || '0')
        data.append('tripsheet_id', values.tripsheet_id)
        data.append('actual_freight', updated_freight) 
        data.append('vendor_code', values.vendor_code)
        data.append('vendor_outstanding', values.driver_outstanding)
        data.append('advance_payment', values.advance_payments)
        data.append('remarks', remarks)
        data.append('bank_remarks', values.bank_remarks)
        data.append('created_by', user_id)
        data.append('advance_status', status)
        data.append('purpose', values.purpose)
        data.append('to_divison', values.to_divison)
        data.append('sap_freight_payment_document_no', values.sap_freight_payment_document_no || '0')
        data.append('sap_diesel_payment_document_no', values.sap_diesel_payment_document_no || '0')
        data.append('sap_bank_payment_document_no', values.sap_bank_payment_document_no || '0')
        data.append('gst_tax_type', values.gst_tax_type)
        // data.append('tds_type',values.tds_type)
        data.append('tds_type', values.vendor_tds == '0' ? 2 : 1)
        data.append('sap_invoice_posting_date',values.sap_invoice_posting_date)
        data.append('bank_date',values.bank_date)
        data.append('incoterm_freight_info',values.incoterm_freight_info)
        /* ================== ASK Part Start ======================= */
        data.append('vendor_tds', values.vendor_tds)
        data.append('vendor_hsn', values.vendor_hsn)
        data.append('supplier_posting_date', values.supplier_posting_date)
        data.append('supplier_ref_no', values.supplier_ref_no ? values.supplier_ref_no: values.trip_sheet_no)
        data.append('low_tonnage_charges', values.low_tonnage_charges)
        data.append('freight_remarks', values.freight_remarks) 

        if(singleVehicleInfo.trip_sheet_info.to_divison == 2)
        {
          data.append('sap_book_division', 2) 
        } else {
          data.append('sap_book_division', 1) 
        }
        /* ================== ASK Part End ======================= */

        if (values.sap_freight_payment_document_no == undefined || values.sap_freight_payment_document_no == '') {
          setFetch(true)
          toast.warning('Freight Cannot be Posted From SAP.. Kindly Contact Admin!')
          return false
        }else if (values.sap_bank_payment_document_no == undefined || values.sap_bank_payment_document_no == '') {
          setFetch(true)
          toast.warning('Bank Payment Cannot be Posted From SAP.. Kindly Contact Admin!')
          return false
        }

        AdvanceCreationService.createAdvance(data).then((res) => {
          if (res.status === 200) {
            console.log('values')
            console.log(res)
            setFetch(true)
            setAcceptBtn(true)
            setButtonDisable(true)
            // toast.success('Advance Created Successfully!')
            // FreightSAPPosting(true)
            // DieselSAPPosting(true)
            // navigation('/AdvancePayment')
            if(values.actual_freight > "0" && values.advance_payments > "0"){
              Swal.fire({
                title: "Advance Submitted Successfully",
                html:'SAP Freight Doc.No - ' + values.sap_freight_payment_document_no + '<br />' +
                'SAP Bank Doc.No - ' + values.sap_bank_payment_document_no,
                icon: "success",
                confirmButtonText: "OK",
              }).then(function () {
                toast.success('Advance Posted Successfully')
                navigation('/AdvancePayment')
              });
            } else {
              Swal.fire({
                title: "Advance Submitted Successfully",
                html:'SAP Freight Doc.No - ' + values.sap_freight_payment_document_no,
                icon: "success",
                confirmButtonText: "OK",
              }).then(function () {
                toast.success('Advance Posted Successfully')
                navigation('/AdvancePayment')
              });
            }
          }
        })
      })
    } else if(values.actual_freight > "0" && values.advance_payment_diesel > "0"){

      AdvanceHireSAP.AdvanceHireSAP(formData).then((res) => {

        values.sap_freight_payment_document_no = res.data.FRE_DOC_NO
        values.sap_bank_payment_document_no = res.data.BANK_DOC_NO

        AdvanceHireSAP.AdvanceHireDieselSAP(formData2).then((res) => {

          values.sap_diesel_payment_document = res.data.DOCUMENT_NO

          const data = new FormData()
          // $remarks = values.remarks;
          // values.remark = 'Freight :'+ values.remarks
          console.log(values)
          data.append('vehicle_id', values.vehicle_id)
          data.append('parking_id', values.parking_id)
          data.append('advance_payment_diesel', values.advance_payment_diesel || '0')
          data.append('tripsheet_id', values.tripsheet_id)
          data.append('actual_freight', updated_freight)
          data.append('vendor_code', values.vendor_code)
          data.append('vendor_outstanding', values.driver_outstanding)
          data.append('advance_payment', values.advance_payments)
          data.append('remarks', remarks)
          data.append('bank_remarks', values.bank_remarks)
          data.append('created_by', user_id)
          data.append('advance_status', status)
          data.append('purpose', values.purpose)
          data.append('to_divison', values.to_divison)
          data.append('sap_freight_payment_document_no', values.sap_freight_payment_document_no || '0')
          data.append('sap_diesel_payment_document_no', values.sap_diesel_payment_document || '0')
          data.append('sap_bank_payment_document_no', values.sap_bank_payment_document_no || '0')
          data.append('gst_tax_type', values.gst_tax_type)
          // data.append('tds_type',values.tds_type)
          data.append('tds_type', values.vendor_tds == '0' ? 2 : 1)
          data.append('sap_invoice_posting_date',values.sap_invoice_posting_date)
          data.append('bank_date',values.bank_date)
          data.append('incoterm_freight_info',values.incoterm_freight_info)
          /* ================== ASK Part Start ======================= */
          data.append('vendor_tds', values.vendor_tds)
          data.append('vendor_hsn', values.vendor_hsn)
          data.append('supplier_posting_date', values.supplier_posting_date)
          data.append('supplier_ref_no', values.supplier_ref_no)
          data.append('low_tonnage_charges', values.low_tonnage_charges)
          data.append('freight_remarks', values.freight_remarks) 
          if(singleVehicleInfo.trip_sheet_info.to_divison == 2)
          {
            data.append('sap_book_division', 2) 
          } else {
            data.append('sap_book_division', 1) 
          }
          /* ================== ASK Part End ======================= */

          if (values.sap_freight_payment_document_no == undefined || values.sap_freight_payment_document_no == "") {
            setFetch(true)
            toast.warning('Freight Cannot be Posted From SAP.. Kindly Contact Admin!')
            return false
          }else if (values.sap_diesel_payment_document == undefined || values.sap_diesel_payment_document == '') {
            setFetch(true)
            toast.warning('Diesel Cannot be Posted From SAP.. Kindly Contact Admin!')
            return false
          }else if (values.advance_payments > "0" && (values.sap_bank_payment_document_no == undefined || values.sap_bank_payment_document_no == '')) {
            setFetch(true)
            toast.warning('Bank Payment Cannot be Posted From SAP.. Kindly Contact Admin!')
            return false
          }


          AdvanceCreationService.createAdvance(data).then((res) => {
            if (res.status === 200) {
              console.log('values')
              console.log(res)
              setFetch(true)
              setAcceptBtn(true)
              setButtonDisable(true)
              // toast.success('Advance Created Successfully!')
              // FreightSAPPosting(true)
              // DieselSAPPosting(true)
              // navigation('/AdvancePayment')
              if(values.actual_freight > "0" && values.advance_payments > "0"){
                Swal.fire({
                  title: "Advance Submitted Successfully",
                  html:'SAP Freight Doc.No - ' + values.sap_freight_payment_document_no + '<br />' +
                  'SAP Bank Doc.No - ' + values.sap_bank_payment_document_no + '<br />'+
                  'SAP Diesel Doc.No - ' + values.sap_diesel_payment_document,
                  icon: "success",
                  confirmButtonText: "OK",
                }).then(function () {
                  toast.success('Advance Posted Successfully')
                  navigation('/AdvancePayment')
                });
              } else {
                Swal.fire({
                  title: "Advance Submitted Successfully",
                  html:'SAP Freight Doc.No - ' + values.sap_freight_payment_document_no + '<br />'+
                      'SAP Diesel Doc.No - ' + values.sap_diesel_payment_document,
                  icon: "success",
                  confirmButtonText: "OK",
                }).then(function () {
                  toast.success('Advance Posted Successfully')
                  navigation('/AdvancePayment')
                });
              }
            }
          })
        })
      })
    }
  }


  function CreateAdvanceOwn(status) {
    setState({ ...state, page_loading: true })
    let formData = new FormData()
    formData.append('LIFNR', values.driver_code)
    formData.append('CJNET_AMOUNT', values.advance_paymented || values.advance_payments)
    formData.append('trip_sheet', values.trip_sheet_no)
    formData.append('VEHICLE_NO', singleVehicleInfo.vehicle_number)
    formData.append('REMARKS', remarks)
    formData.append('POST_DATE', values.sap_invoice_posting_date)
    formData.append('screen_type', 'HOME')
    formData.append('PAYMENT_TYPE', values.payment_mode == '1' ? 'CASH':values.payment_mode == '2' ? 'BANK' : '')

    let limit = 9990;
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

    console.log(values.advance_paymented)
    console.log(values.advance_payments)

    if(values.advance_paymented > 0 && (values.advance_payments >= 0)){

      if(values.otp1 == ''){
        setFetch(true)
        toast.warning('Enter The OTP Number')
        return false
      } else if(values.advance_form == '' || values.advance_form.size > 5000000){
        setFetch(true)
        toast.warning('Attached The Advance Form Copy')
        return false
      } else if(values.sap_invoice_posting_date == '' || values.sap_invoice_posting_date == undefined){
        setFetch(true)
        toast.warning('Enter Posting Date')
        return false
      } else if(!(JavascriptDateCheckComponent(from_date,values.sap_invoice_posting_date,to_date))){
        setFetch(true)
        toast.warning('Invalid Posting date')
        return false          
      } else if(values.payment_mode == '' || values.payment_mode == undefined){
        setFetch(true)
        toast.warning('Select Payment Mode')
        return false
      }
      AdvanceOwnSAP.AdvanceOwnSAP(formData).then((res) => {
        console.log(res.data.DOCUMENT_NO)
        values.document_no = res.data.DOCUMENT_NO
        console.log('values')
        const data = new FormData()
        data.append('driver_id', values.driver_id)
        data.append('vehicle_id', values.vehicle_id)
        data.append('parking_id', values.parking_id)
        data.append('tripsheet_id', values.tripsheet_id)
        data.append('advance_form', values.advance_form)
        data.append('driver_code', values.driver_code)
        data.append('vendor_outstanding', values.driver_outstanding)
        data.append('advance_payment', values.advance_paymented || values.advance_payments)
        data.append('payment_mode', values.payment_mode)
        data.append('remarks', remarks)
        data.append('created_by', user_id)
        data.append('purpose', values.purpose)
        data.append('to_divison', values.to_divison)
        data.append('advance_status', status)
        data.append('document_no', values.document_no)
        data.append('sap_invoice_posting_date',values.sap_invoice_posting_date)

        if(res.data.STATUS == '2'){
          setFetch(true)
          toast.warning('Advance Amount Exceed.. Kindly Contact Admin!')
          return false
        }

        if (values.document_no == undefined || values.document_no == '') {
          setFetch(true)
          toast.warning('Invalid Invoice Number,Contact SAP Team')
          return false
        }

        AdvanceCreationService.createAdvance(data).then((res) => {
          console.log(res)
          if (res.status === 200) {
            console.log(res)
            setFetch(true)
            // toast.success('Advance Created Successfully!')
            setAcceptBtn(true)
            // navigation('/AdvancePayment')
            Swal.fire({
              title: "Advance Submitted Successfully",
              html: 'SAP Document No - ' + values.document_no,
              icon: "success",
              confirmButtonText: "OK",
            }).then(function () {

               toast.success('Advance Posted Successfully')
               navigation('/AdvancePayment')
            });
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
    }else if(values.advance_payments > 0 && (values.advance_paymented == undefined || values.advance_paymented == '')){

      if(values.otp1 == ''){
        setFetch(true)
        toast.warning('Enter The OTP Number')
        return false
      } else if(values.advance_form == '' || values.advance_form.size > 5000000){
        setFetch(true)
        toast.warning('Attached The Advance Form Copy')
        return false
      }

      else if(values.sap_invoice_posting_date == '' || values.sap_invoice_posting_date == undefined){
        setFetch(true)
        toast.warning('Enter Posting Date')
        return false
      } else if(!(JavascriptDateCheckComponent(from_date,values.sap_invoice_posting_date,to_date))){
        setFetch(true)
        toast.warning('Invalid Posting date')
        return false          
      }
      else if(values.payment_mode == '' || values.payment_mode == undefined){
        setFetch(true)
        toast.warning('Select Payment Mode')
        return false
      }
      AdvanceOwnSAP.AdvanceOwnSAP(formData).then((res) => {
        console.log(res.data.DOCUMENT_NO)
        values.document_no = res.data.DOCUMENT_NO
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
        data.append('payment_mode', values.payment_mode)
        data.append('remarks', remarks)
        data.append('created_by', user_id)
        data.append('purpose', values.purpose)
        data.append('to_divison', values.to_divison)
        data.append('advance_status', status)
        data.append('document_no', values.document_no)
        data.append('sap_invoice_posting_date',values.sap_invoice_posting_date)

        if(res.data.STATUS == '2'){
          setFetch(true)
          toast.warning('Advance Amount Exceed.. Kindly Contact Admin!')
          return false
        }

        if (values.document_no == undefined || values.document_no == '') {
          setFetch(true)
          toast.warning('Invalid Invoice Number,Contact SAP Team')
          return false
        }

        AdvanceCreationService.createAdvance(data).then((res) => {
          console.log(res)
          if (res.status === 200) {
            console.log(res)
            setFetch(true)
            // toast.success('Advance Created Successfully!')
            setAcceptBtn(true)
            // navigation('/AdvancePayment')
            Swal.fire({
              title: "Advance Submitted Successfully",
              html: 'SAP Document No - ' + values.document_no,
              icon: "success",
              confirmButtonText: "OK",
            }).then(function () {

              toast.success('Advance Posted Successfully')
              navigation('/AdvancePayment')
            });
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
    } else {
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
      data.append('payment_mode', values.payment_mode || 0)
      data.append('remarks', remarks)
      data.append('created_by', user_id)
      data.append('purpose', values.purpose)
      data.append('to_divison', values.to_divison)
      data.append('advance_status', status)
      data.append('document_no', values.document_no || '0')
      data.append('sap_invoice_posting_date',values.sap_invoice_posting_date)

      // if (values.document_no == undefined) {
      //   setFetch(true)
      //   toast.warning('Invalid Invoice Number')
      //   return false
      // }

      if(values.sap_invoice_posting_date == '' || values.sap_invoice_posting_date == undefined){
        setFetch(true)
        toast.warning('Enter Posting Date')
        return false
      } else if(!(JavascriptDateCheckComponent(from_date,values.sap_invoice_posting_date,to_date))){
        setFetch(true)
        toast.warning('Invalid Posting date')
        return false          
      }

      AdvanceCreationService.createAdvance(data).then((res) => {
        console.log(res)
        if (res.status === 200) {
          console.log(res)
          setFetch(true)
          // toast.success('Advance Created Successfully!')
          setAcceptBtn(true)
          // navigation('/AdvancePayment')
          Swal.fire({
            title: "Advance Submitted Successfully",
            // html: 'SAP Document No - ' + values.document_no,
            icon: "success",
            confirmButtonText: "OK",
          }).then(function () {

             toast.success('Advance Posted Successfully')
             navigation('/AdvancePayment')
          });
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

  function UpdateAdvanceHire() {
    setState({ ...state, page_loading: true })
    let formData1 = new FormData()
    let formData2 = new FormData()
    let from_date = Expense_Income_Posting_Date_Taken.min_date
    let to_date = Expense_Income_Posting_Date_Taken.max_date
    console.log('Update')
    let sap_advance_payment_diesel = 'DIESEL_PAYMENT:' + (values.advance_payment_diesel_update || '0')
    let sap_advance_payments = values.advance_payment_update || '0'
    let sap_actual_freight = 'FREIGHT_PAYMENT:' + (singleVehicleInfo.advance_info.actual_freight || '0')
    formData1.append('LIFNR', values.vendor_code)
    formData1.append('TRIP_SHEET', values.trip_sheet_no)
    // formData.append('TRIP_SHEET', 'OK76911936')
    formData1.append('VEHICLE_NO', singleVehicleInfo.vehicle_number)
    formData1.append('FREIGHT_PAYMENT',sap_actual_freight)
    formData1.append('TAX_TYPE', singleVehicleInfo.advance_info.gst_tax_type)
    formData1.append('TDS', values.vendor_tds == '0' ? 'NO' : 'YES')
    formData1.append('TDS_VALUE', values.vendor_tds == '0' ? '' : values.vendor_tds)
    formData1.append('HSN', values.vendor_hsn)
    // formData1.append('TDS', singleVehicleInfo.advance_info.tds_type == 1 ? 'YES' : 'NO')
    formData1.append('REMARKS', remarks)
    formData1.append('bank_remark', values.bank_remarks)
    formData1.append('POST_DATE', values.sap_invoice_posting_date)
    formData1.append('BANK_PAYMENT', sap_advance_payments)

    formData2.append('LIFNR', values.vendor_code)
    formData2.append('HSN', values.vendor_hsn)
    formData2.append('TRIP_SHEET', values.trip_sheet_no)
    formData2.append('DIESEL_PAYMENT',sap_advance_payment_diesel)
    formData2.append('VEHICLE_NO', singleVehicleInfo.vehicle_number)
    formData2.append('REMARKS', remarks)
    formData2.append('POST_DATE',values.sap_invoice_posting_date)

    if(singleVehicleInfo.trip_sheet_info.to_divison == 2 || (singleVehicleInfo.trip_sheet_info.purpose == 4 && singleVehicleInfo.trip_sheet_info.others_division == 6))
    {
      formData1.append('PLANT', 'NLCD')
      formData2.append('PLANT', 'NLCD')
    } else {
      formData1.append('PLANT', 'NLLD')
      formData2.append('PLANT', 'NLLD')
    }

    let x = values.advance_payment_update
    let y = values.advance_payment_diesel_update
    let sum = Number(x) + Number(y)

    console.log(sum)
    var p = singleVehicleInfo.advance_info.actual_freight
    if (p < sum) {
      setFetch(true)
      toast.warning('Bank & Diesel Amount Should Be Less Than The Actual Freight Amount')
      return false
    }else if(values.sap_invoice_posting_date == '' || values.sap_invoice_posting_date == undefined){
      setFetch(true)
      toast.warning('Enter Posting Date')
      return false
    } else if(!(JavascriptDateCheckComponent(from_date,values.sap_invoice_posting_date,to_date))){
      setFetch(true)
      toast.warning('Invalid Posting date')
      return false          
    }

    else if (isTouched.advance_payment_update && !/^[\d]{1,6}$/.test(values.advance_payment_update)) {
      toast.warning('Advance Payment Allow Only Numbers')
      setFetch(true)
      return false
    }else if(remarks == '' || remarks == undefined){
      setFetch(true)
      toast.warning('Enter Freight Payment Remarks')
      return false
    }else if(values.bank_remarks == '' && values.advance_payment_update > "0" || values.bank_remarks == undefined &&  values.advance_payment_update > "0"){
      setFetch(true)
      toast.warning('Enter Bank Payment Remarks')
      return false
    }


    if(singleVehicleInfo.advance_info.actual_freight > 0 && values.advance_payment_diesel_update > 0){
      console.log('test3');
      AdvanceHireSAP.AdvanceHireSAP(formData1).then((res) => {
      values.sap_freight_payment_document_no = res.data.FRE_DOC_NO
      values.sap_bank_payment_document_no = res.data.BANK_DOC_NO

      AdvanceHireSAP.AdvanceHireDieselSAP(formData2).then((res) => {
        if (res.status === 200){

        values.sap_diesel_payment_document_no = res.data.DOCUMENT_NO
      const data = new FormData()
      // $remarks = values.remarks;
      // values.remark = 'Freight :'+ values.remarks
      console.log(values)
      data.append('_method', 'PUT')
      // data.append('actual_freight', values.actual_freight)
      data.append('advance_payment_diesel', values.advance_payment_diesel_update)
      data.append('advance_payment', values.advance_payment_update)
      data.append('remarks', remarks)
      data.append('bank_remarks', values.bank_remarks)
      data.append('sap_freight_payment_document_no', values.sap_freight_payment_document_no || '0')
      data.append('sap_diesel_payment_document_no', values.sap_diesel_payment_document_no || '0')
      data.append('sap_bank_payment_document_no', values.sap_bank_payment_document_no || '0')
      data.append('vehicle_id', values.vehicle_id)
      data.append('parking_id', values.parking_id)
      data.append('tripsheet_id', values.tripsheet_id)
      data.append('purpose', values.purpose)
      data.append('to_divison', values.to_divison)
      data.append('vendor_outstanding', values.driver_outstanding)
      data.append('sap_invoice_posting_date',values.sap_invoice_posting_date)
      data.append('created_by', user_id)

      if(singleVehicleInfo.trip_sheet_info.to_divison == 2)
      {
        data.append('sap_book_division', 2) 
      } else {
        data.append('sap_book_division', 1) 
      }

      if (values.sap_freight_payment_document_no == undefined || values.sap_freight_payment_document_no == '' || values.sap_freight_payment_document_no == '0') {
        setFetch(true)
        toast.warning('Freight Cannot be Posted From SAP.. Kindly Contact Admin')
        return false
      }else if(values.sap_diesel_payment_document_no == undefined || values.sap_diesel_payment_document_no == '' || values.sap_diesel_payment_document_no == '0'){
        setFetch(true)
        toast.warning('Diesel Cannot be Posted From SAP.. Kindly Contact Admin')
        return false
      }
      AdvanceCreationService.updateAdvance(id,data)
        .then((res) => {
          if (res.status === 200) {
            console.log('values')
            console.log(res)
            setFetch(true)
            // toast.success('Advance Created Successfully!')
            setAcceptBtn(true)
            // navigation('/AdvancePayment')
            Swal.fire({
              title: "Advance Submitted Successfully",
              // content: myhtml,
              html: 'SAP Diesel Doc.No - ' + values.sap_diesel_payment_document_no + '<br />' +
                    'SAP Freight Doc.No - ' + values.sap_freight_payment_document_no + '<br />' +
                    'SAP Bank Doc.No - ' + values.sap_bank_payment_document_no,
              icon: "success",
              confirmButtonText: "OK",
            }).then(function () {
              // Redirect the user
              // window.location.reload(false)
              // window.location.reload('/AdvancePayment')
               toast.success('Advance Posted Successfully')
               navigation('/AdvancePayment')
            });
          }
        })
      }
      })

    })
    }
    else if(singleVehicleInfo.advance_info.actual_freight > 0 && values.advance_payment_diesel_update == "0"){
      console.log('test1');
      AdvanceHireSAP.AdvanceHireSAP(formData1).then((res) => {
      values.sap_freight_payment_document_no = res.data.FRE_DOC_NO
      values.sap_bank_payment_document_no = res.data.BANK_DOC_NO

      const data = new FormData()
      // $remarks = values.remarks;
      // values.remark = 'Freight :'+ values.remarks
      console.log(values)
      data.append('_method', 'PUT')
      // data.append('actual_freight', values.actual_freight)
      data.append('advance_payment', values.advance_payment_update)
      data.append('remarks', remarks)
      data.append('bank_remarks', values.bank_remarks)
      data.append('sap_freight_payment_document_no', values.sap_freight_payment_document_no)
      data.append('sap_bank_payment_document_no', values.sap_bank_payment_document_no || '0')
      data.append('vehicle_id', values.vehicle_id)
      data.append('parking_id', values.parking_id)
      data.append('tripsheet_id', values.tripsheet_id)
      data.append('purpose', values.purpose)
      data.append('to_divison', values.to_divison)
      data.append('vendor_outstanding', values.driver_outstanding)
      data.append('sap_invoice_posting_date',values.sap_invoice_posting_date)
      data.append('created_by', user_id)
      if(singleVehicleInfo.trip_sheet_info.to_divison == 2)
      {
        data.append('sap_book_division', 2) 
      } else {
        data.append('sap_book_division', 1) 
      }

      if (values.sap_freight_payment_document_no == undefined || values.sap_freight_payment_document_no == '' || values.sap_freight_payment_document_no == '0') {
        setFetch(true)
        toast.warning('Freight Cannot be Posted From SAP.. Kindly Contact Admin')
        return false
      }

      AdvanceCreationService.updateAdvance(id,data)
        .then((res) => {
          if (res.status === 200) {
            console.log('values')
            console.log(res)
            setFetch(true)
            // toast.success('Advance Created Successfully!')
            setAcceptBtn(true)
            // navigation('/AdvancePayment')
            Swal.fire({
              title: "Advance Submitted Successfully",
              // content: myhtml,
              html:'SAP Freight Doc.No - ' + values.sap_freight_payment_document_no + '<br />' +
              'SAP Bank Doc.No - ' + values.sap_bank_payment_document_no ,
              icon: "success",
              confirmButtonText: "OK",
            }).then(function () {
              // Redirect the user
              // window.location.reload(false)
              // window.location.reload('/AdvancePayment')
               toast.success('Advance Posted Successfully')
               navigation('/AdvancePayment')
            });
          }
        })
      })
    }
    else if(values.advance_payment_diesel_update > 0){
      console.log('test2');
        AdvanceHireSAP.AdvanceHireDieselSAP(formData2).then((res) => {
      console.log(res.data.DOCUMENT_NO)

      values.sap_diesel_payment_document_no = res.data.DOCUMENT_NO

      const data = new FormData()
      // $remarks = values.remarks;
      // values.remark = 'Freight :'+ values.remarks
      console.log(values)
      data.append('_method', 'PUT')
      // data.append('actual_freight', values.actual_freight)
      data.append('advance_payment_diesel', values.advance_payment_diesel_update)
      data.append('remarks', remarks)
      data.append('sap_diesel_payment_document_no', values.sap_diesel_payment_document_no)
      data.append('vehicle_id', values.vehicle_id)
      data.append('parking_id', values.parking_id)
      data.append('tripsheet_id', values.tripsheet_id)
      data.append('purpose', values.purpose)
      data.append('to_divison', values.to_divison)
      data.append('vendor_outstanding', values.driver_outstanding)
      data.append('sap_invoice_posting_date',values.sap_invoice_posting_date)
      data.append('created_by', user_id)
      if(singleVehicleInfo.trip_sheet_info.to_divison == 2)
      {
        data.append('sap_book_division', 2) 
      } else {
        data.append('sap_book_division', 1) 
      }

      if (values.sap_diesel_payment_document_no == undefined || values.sap_diesel_payment_document_no == '') {
        setFetch(true)
        toast.warning('Diesel Cannot be Posted From SAP.. Kindly Contact Admin')
        return false
      }
      AdvanceCreationService.updateAdvance(id,data)
        .then((res) => {
          if (res.status === 200) {
            console.log('values')
            console.log(res)
            setFetch(true)
            // toast.success('Advance Created Successfully!')
            setAcceptBtn(true)
            // navigation('/AdvancePayment')
            Swal.fire({
              title: "Advance Submitted Successfully",
              // content: myhtml,
              html: 'SAP Diesel Doc.No - ' + values.sap_diesel_payment_document_no + '<br />' +
                    'SAP Freight Doc.No - ' + values.sap_freight_payment_document_no + '<br />' +
                    'SAP Bank Doc.No - ' + values.sap_bank_payment_document_no,
              icon: "success",
              confirmButtonText: "OK",
            }).then(function () {
              // Redirect the user
              // window.location.reload(false)
              // window.location.reload('/AdvancePayment')
               toast.success('Advance Posted Successfully')
               navigation('/AdvancePayment')
            });
          }
        })
      })
    }
  }
  useEffect(() => {
    if (Object.keys(errors).length === 0 && Object.keys(isTouched)) {
      setValidateSubmit(false)
    } else {
      setValidateSubmit(true)
    }

    console.log(singleVehicleInfo,'singleVehicleInfo--2')
    console.log(values)
    topayPartyCheck(singleVehicleInfo)
  })
  useEffect(() => {
    if (!errors.advance_form && !errors.advance_paymented) {
      setAcceptBtn(false)
    } else {
      setAcceptBtn(true)
    }
  }, [errors])
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

  const [remarks, setRemarks] = useState(''); 
    const handleChangenew = event => {
    const result = event.target.value.toUpperCase();

    setRemarks(result);
  };

  const [topayPartyFreightLock, setTopayPartyFreightLock] = useState(false)

  const topayPartyCheck = (topayPartyCheckData) => {
    console.log(topayPartyCheckData,'topayPartyCheckData')
    let tpv = 0

    if(topayPartyCheckData && topayPartyCheckData.trip_sheet_info && topayPartyCheckData.trip_sheet_info.purpose == 1 && (topayPartyCheckData.trip_sheet_info.to_divison == 1 || topayPartyCheckData.trip_sheet_info.to_divison == 2)){

      if(topayPartyCheckData.shipment_info && topayPartyCheckData.shipment_info[0].shipment_all_child_info){
        tpv = topayPartyValid(topayPartyCheckData.shipment_info[0].shipment_all_child_info)
      }  
    }  
    console.log(tpv,'tpv')
    if(tpv == '101'){
      setTopayPartyFreightLock(true)
    } else {
      setTopayPartyFreightLock(false)
    }

  }

  const topayPartyValid = (topayPartyValidData) => {
    var inco_term_array = ["381","382"]
    let shipment_inco_term_array = []
    console.log(topayPartyValidData,'topayPartyValidData')

    topayPartyValidData.map((vv,kk)=>{

      if(JavascriptInArrayComponent(vv.inco_term_id,inco_term_array))
      {
        //
      } else {
        shipment_inco_term_array.push(vv.inco_term_id)
      }
      
    })

    console.log(shipment_inco_term_array,'shipment_inco_term_array')

    if(shipment_inco_term_array.length == 0 && topayPartyValidData.length > 0){
      return '101'
    } else {
      return '102'
    }

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
                  {singleVehicleInfo.vehicle_type_id.id === vehicleType.OWN ||
                  singleVehicleInfo.vehicle_type_id.id === vehicleType.CONTRACT ? (
                    <AdvanceCreationOwn
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
                    />
                  ) : singleVehicleInfo.vehicle_type_id.id === vehicleType.HIRE && singleVehicleInfo.advance_info === null && (singleVehicleInfo.vehicle_current_position === '16' || singleVehicleInfo.vehicle_current_position === '25' ||singleVehicleInfo.vehicle_current_position === '22' || singleVehicleInfo.vehicle_current_position === '37' || singleVehicleInfo.vehicle_current_position === '39' || singleVehicleInfo.vehicle_current_position === '41') ? (
                    <AdvanceCreationHire
                      values={values}
                      errors={errors}
                      handleChange={handleChange}
                      onFocus={onFocus}
                      onBlur={onBlur}
                      singleVehicleInfo={singleVehicleInfo}
                      isTouched={isTouched}
                      remarks={remarks}
                      handleChangenew={handleChangenew}
                      vendorMobileValue={vpanMobile}
                    />
                  ):(
                    <AdvanceCreationHireUpdate
                      values={values}
                      errors={errors}
                      handleChange={handleChange}
                      onFocus={onFocus}
                      onBlur={onBlur}
                      singleVehicleInfo={singleVehicleInfo}
                      isTouched={isTouched}
                      remarks={remarks}
                      handleChangenew={handleChangenew}
                    />
                  )}
                  {singleVehicleInfo.vehicle_type_id.id === vehicleType.OWN ||
                  singleVehicleInfo.vehicle_type_id.id === vehicleType.CONTRACT ? (
                    <CRow className="mt-md-3">
                      <CCol className="" xs={12} sm={12} md={3}>
                        <CButton size="sm" color="primary" className="text-white" type="button">
                          <Link className="text-white" to="/AdvancePayment">
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
                          disabled={acceptBtn}
                          onClick={() => {
                            setFetch(false)
                            CreateAdvanceOwn(1)
                          }}
                          // type="submit"
                        >
                          Submit
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
              ) : singleVehicleInfo.vehicle_type_id.id === vehicleType.HIRE && singleVehicleInfo.advance_info === null && (singleVehicleInfo.vehicle_current_position === '16'|| singleVehicleInfo.vehicle_current_position === '25' ||singleVehicleInfo.vehicle_current_position === '22' || singleVehicleInfo.vehicle_current_position === '37' || singleVehicleInfo.vehicle_current_position === '39' || singleVehicleInfo.vehicle_current_position === '41') ?(
                <>
                  <CRow className="mt-md-3"> 

                    {((singleVehicleInfo.Parking_Vendor_Info === null) ||(singleVehicleInfo.Parking_Vendor_Info && singleVehicleInfo.Parking_Vendor_Info.vendor_code == 0)) && (
                      <CCol xs={12} md={9} style={{ display: 'flex', justifyContent: 'end' }}>
                        <span style={{ color: 'red' }}>
                          *Vendor Creation Process is pending. So Advance Payment not possible for this Tripsheet..
                        </span>
                      </CCol>
                    )} 

                    {vpanMobile == 0 && singleVehicleInfo.vendor_info && (
                      <CCol xs={12} md={9} style={{ display: 'flex', justifyContent: 'end' }}>
                        <span style={{ color: 'red' }}>
                          *Vendor Mobile Number was missing / invalid. Kindly update address in SAP..
                        </span>
                      </CCol>
                    )} 
                     
                    {topayPartyFreightLock && (
                      <CCol xs={12} md={9} style={{ display: 'flex', justifyContent: 'end' }}>
                        <span style={{ color: 'red' }}>
                          *Shipment Having Topay / Party Deliveries only. So Advance Payment not possible for this Tripsheet..
                        </span>
                      </CCol>
                    )}
                     
                  </CRow>
                  <CRow className="mt-md-3">
                    <CCol className="" xs={12} sm={12} md={3}>
                      <CButton size="sm" color="primary" className="text-white" type="button" disabled={ButtonDisable}>
                        <Link className="text-white" to="/AdvancePayment">
                          Previous
                        </Link>
                      </CButton>
                    </CCol>
                    <CCol className="" xs={12} sm={12} md={3}></CCol>
                    <CCol className="" xs={12} sm={12} md={3}></CCol>                  
                    
                    <CCol xs={12} md={3} style={{ display: 'flex', justifyContent: 'end' }}> 
                    {/* <CCol xs={12} md={3} style={{ display: 'flex', justifyContent: 'end' }}>  */}
                    {/* <CCol
                      className="offset-md-6"
                      xs={12}
                      sm={12}
                      md={3}
                      style={{ display: 'flex', justifyContent: 'end' }}
                    >                     */}
                      <CButton
                        size="sm"
                        color="warning"
                        className="mx-3 px-3 text-white"
                        // type="button"
                        disabled={acceptBtn1 || ButtonDisable || vpanMobile == 0 || topayPartyFreightLock }
                        onClick={() => {
                          setFetch(false);
                          CreateAdvance(2);
                          // refreshPage()
                        }}
                        // type="submit"
                      >
                        Submit
                      </CButton>

                      {/* <CButton
                        size="sm"
                        color="warning"
                        className="mx-3 px-3 text-white"
                        type="button"
                        onClick={ () =>{setFetch(false)
                          CreateAdvance(2)}}
                      >
                      Reject
                      </CButton> */}
                    </CCol>
                  </CRow>
                </>
              ):(
                <CRow className="mt-md-3">
                  <CCol className="" xs={12} sm={12} md={3}>
                    <CButton size="sm" color="primary" className="text-white" type="button">
                      <Link className="text-white" to="/AdvancePayment">
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
                      onClick={() => {
                        setFetch(false)
                        UpdateAdvanceHire()
                      }}
                      // type="submit"
                    >
                      ReSubmit
                    </CButton>

                    {/* <CButton
                      size="sm"
                      color="warning"
                      className="mx-3 px-3 text-white"
                      type="button"
                      onClick={ () =>{setFetch(false)
                        CreateAdvance(2)}}
                    >
                     Reject
                    </CButton> */}
                  </CCol>
                </CRow>
              )}
            </CForm>
          )}
        </CCard>
          </>) : (<AccessDeniedComponent />)}
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

export default AdvanceRequest
