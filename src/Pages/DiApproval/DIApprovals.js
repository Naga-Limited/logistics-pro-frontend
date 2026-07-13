import React, { useState } from 'react'
import {
  CButton,
  CCard, 
  CCol,
  CForm, 
  CFormLabel, 
  CRow, 
  CFormSelect, 
} from '@coreui/react'
import useForm from 'src/Hooks/useForm'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useEffect } from 'react'
import { Object } from 'core-js'
import { toast } from 'react-toastify'
import Loader from 'src/components/Loader'
import 'react-toastify/dist/ReactToastify.css'
import DieselIntentCreationService from 'src/Service/DieselIntent/DieselIntentCreationService'
import DieselIntentValidation from 'src/Utils/DieselIntent/DieselIntentValidation'
import DieselApprovalOwn from './segments/OwnAndContract/DieselApprovalOwn'
import DieselApprovalHire from './segments/Hire/DieselApprovalHire'
import DieselVendorMasterService from 'src/Service/Master/DieselVendorMasterService'
import DieselIntentPaymentSAP from 'src/Service/SAP/DieselIntentPaymentSAP'
import ReportService from 'src/Service/Report/ReportService'
import AccessDeniedComponent from 'src/components/commoncomponent/AccessDeniedComponent'
import JavascriptInArrayComponent from 'src/components/commoncomponent/JavascriptInArrayComponent'
import * as LogisticsProScreenNumberConstants from 'src/components/constants/LogisticsProScreenNumberConstants'
import JavascriptDateCheckComponent from 'src/components/commoncomponent/JavascriptDateCheckComponent'
import ExpenseIncomePostingDate from '../TripsheetClosure/Calculations/ExpenseIncomePostingDate'
import Swal from 'sweetalert2'
import DieseVendorSelectComponent from 'src/components/commoncomponent/DieselVendorSelectComponent'
import NLFSSAPDieselIndentService from 'src/Service/SAP/NLFSSAPDieselIndentService'
import { getCurrentDateTime } from '../Depo/CommonMethods/CommonMethods'
import VendorOutstanding from 'src/Service/SAP/VendorOutstanding'

export const nlfs_diesel_material_code = process.env.REACT_APP_NLFS_DIESEL_MATERIAL_CODE

const DiApprovals = () => {
  const user_info_json = localStorage.getItem('user_info')
  const user_info = JSON.parse(user_info_json)

  /* Get User Id From Local Storage */
  const user_id = user_info.user_id

  /* ==================== Access Part Start ========================*/
  const [screenAccess, setScreenAccess] = useState(false)
  let page_no = LogisticsProScreenNumberConstants.DieselIntentModule.Diesel_Intent_Approval_Request

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

  const formValues = {
    vehicle_id: '',
    vendor_code: '',
    invoice_no: '',
    invoice_copy: '',
    no_of_ltrs: '',
    total_amount: '',
    bunk_reading: '',
    diesel_vendor_sap_invoice_no: '',
    diesel_status: '',
    nlfs_sap_status: '',
    remarks: '',
    diesel_vendor_name: '',
    vendor_hsn: '',
    vendor_tds: ''
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
  const navigation = useNavigate()
  const vehicleType = {
    OWN: 1,
    CONTRACT: 2,
    HIRE: 3,
  }

  function dateFormat(a) {
    let short_year = a.substring(a.lastIndexOf('-') + 1)
    let month = a.substring(a.indexOf('-') + 1, a.lastIndexOf('-'))
    let day = a.substring(0, a.indexOf('-'))
    let d = a.lastIndexOf('-')
    let year = 20 + short_year
    let new_date = year + '-' + month + '-' + day
    return new_date
  }

  useEffect(() => {
    ReportService.singleDieselDetailsList(id).then((res) => {
      // setFetch(true)
      console.log(res.data.data,'singleDieselDetailsList')
      if (res.status === 200) {
        values.vendor_code = res.data.data != null ? res.data.data.vendor_code : ''
        DieselVendorMasterService.getDieselVendorsByCode(values.vendor_code).then((res) => {
          setFetch(true)
          console.log(res)
          // values.diesel_vendor_name = res.data.data.diesel_vendor_name
          values.diesel_vendor_name=
        res.data.data != null ? res.data.data.diesel_vendor_name : ''
        values.diesel_vendor_id = res.data.data != null ? res.data.data.diesel_vendor_id : ''
        })
        isTouched.vehicle_id = true
        values.tripsheet_id = res.data.data.tripsheet_id
        isTouched.driver_id = true
        isTouched.tripsheet_id = true
        isTouched.vehicle_type_id = true
        values.parking_id = true
        values.parking_id = res.data.data.parking_id
        // values.vendor_code = res.data.data.diesel_intent_info != null ? res.data.data.diesel_intent_info.vendor_code : ''
        // values.tripsheet_id = res.data.data.trip_sheet_info != null ? res.data.data.trip_sheet_info.trip_sheet_no : ''
        values.driver_code =
        res.data.data != null ? res.data.data.driver_code : ''
        values.invoice_no =
        res.data.data != null ? res.data.data.invoice_no : ''
        values.rate_of_ltrs =
        res.data.data != null ? res.data.data.rate_of_ltrs : ''
        values.total_amount =
        res.data.data != null ? res.data.data.total_amount : ''
        values.total_amount1 =
        res.data.data != null ? res.data.data.total_amount : ''
        values.no_of_ltrs =
        res.data.data != null ? res.data.data.no_of_ltrs : ''
        values.no_of_ltrs1 =
        res.data.data != null ? res.data.data.no_of_ltrs : ''
        values.invoice_copy=
        res.data.data != null ? res.data.data.invoice_copy : ''
        values.bunk_reading=
        res.data.data != null ? res.data.data.bunk_reading : ''
        values.diesel_invoice_date=dateFormat(
        res.data.data != null ? res.data.data.diesel_invoice_date : '')

        values.trip_sheet_no=
        res.data.data.parking_info.trip_sheet_info != null ? res.data.data.parking_info.trip_sheet_info.trip_sheet_no : ''
        // values.advance_amount = res.data.data.trip_sheet_info.advance_amount
        // values.advance_payment_diesel=res.data.data.trip_sheet_info.advance_payment_diesel
        values.vehicle_type_id = res.data.data.parking_info !=null ? res.data.data.parking_info.vehicle_type_id.id :''
        values.vehicle_id = res.data.data.vehicle_id
        values.driver_id = res.data.data !=null ? res.data.data.driver_id:''
        values.vendor_tds = res.data.data != null ? res.data.data.vendor_tds : ''
        values.vendor_hsn = res.data.data != null ? res.data.data.vendor_hsn : ''
        values.sap_invoice_diesel_posting_date=dateFormat(
        res.data.data != null ? res.data.data.diesel_invoice_sap_posting_date : '')
        values.driveMobile =
          res.data.data.parking_info != null ? res.data.data.parking_info.driver_contact_number : ''
          values.inspection_time =
          res.data.data.parking_info.vehicle_inspection_trip != null ? res.data.data.parking_info.vehicle_inspection_trip.inspection_time_string : ''
        // values.freight_rate_per_tone =
        //   res.data.data.vehicle_Freight_info == undefined
        //     ? '0'
        //     : res.data.data.vehicle_Freight_info.freight_rate_per_ton
        values.nlfs_sap_status = res.data.data !=null ? res.data.data.nlfs_sap_status : ''
        setSingleVehicleInfo(res.data.data)
        console.log(singleVehicleInfo)
        
      }
    })
    VendorOutstanding.getNLLDFuelDiscount().then((res) => {
      let driver_outstanding_data = res.data[0];
      console.log(driver_outstanding_data,'getNLLDFuelDiscount data')
      if(driver_outstanding_data.STATUS == '1' && driver_outstanding_data.CUSTOMER == '1006')
      {
        setSapNlldFuelDiscountRate(driver_outstanding_data.AMOUNT)
      } else {
        setSapNlldFuelDiscountRate(0)
      }
    })
  }, [])

  const { values, errors, handleChange, onFocus, handleSubmit, enableSubmit, onBlur, isTouched } =
    useForm(CreateDieselIntent, DieselIntentValidation, formValues)

  // Own vehicles RNS/RS DI Submission Process
  function CreateDieselIntent(status) {
    setState({ ...state, page_loading: true })
    let formData = new FormData()
    formData.append('trip_sheet',values.trip_sheet_no)
    formData.append('LIFNR', values.vendor_code)
    formData.append('WRBTR', values.total_amount.toFixed(0))
    formData.append('REMARKS', remarks)
    formData.append('INVOICE_NO', values.invoice_no)
    formData.append('RATE_PER_LTR', values.rate_of_ltrs)
    formData.append('QTY', parseFloat(values.no_of_ltrs1).toFixed(3))
    formData.append('VEHICLE_NO', singleVehicleInfo.parking_info.vehicle_number)
    formData.append('POST_DATE', values.sap_invoice_diesel_posting_date)
    formData.append('PLANT', 'NLLD')

    let p = 200;
    let Expense_Income_Posting_Date_Taken = ExpenseIncomePostingDate();
    let from_date = Expense_Income_Posting_Date_Taken.min_date
    let to_date = Expense_Income_Posting_Date_Taken.max_date
    setFetch(false)
    if (p <= values.rate_of_ltrs) {
      setFetch(true)
      toast.warning('Rate per liter should not allow more than 200Rs...')
      return false
    }else if(values.sap_invoice_diesel_posting_date == undefined || values.sap_invoice_diesel_posting_date == ''){
      setFetch(true)
      toast.warning('Enter Posting Date')
      return false
    } else if(!(JavascriptDateCheckComponent(from_date,values.sap_invoice_diesel_posting_date,to_date))){
      setFetch(true)
      toast.warning('Invalid Posting date')
      return false  
    }else if(values.invoice_copy == '' || values.invoice_copy.size > 5000000){
      setFetch(true)
      toast.warning('Attach The  Invoice Copy Less Than 5MB')
      return false
    }else if(values.bunk_reading == '' || values.bunk_reading.size > 5000000){
      setFetch(true)
      toast.warning('Attach The Bunk Reading Copy Less Than 5MB')
      return false
    } else if(values.vendor_tds == '' || values.vendor_tds == null){
      setFetch(true)
      toast.warning('Vendor TDS Tax Type Should be required..')
      return false
    } else if(values.vendor_hsn == '' || values.vendor_hsn == null){
      setFetch(true)
      toast.warning('HSN Code Should be required..')
      return false
    }

    formData.append('TDS', values.vendor_tds == '0' ? 'NO' : 'YES')
    formData.append('TDS_VALUE', values.vendor_tds == '0' ? '' : values.vendor_tds)
    formData.append('HSN', values.vendor_hsn)

    /* ================== ASK Part End ======================= */
    DieselIntentPaymentSAP.DieselIntentSAP(formData).then((res) => {
      console.log(res.data.INVOICE_RECEIPT)
      let sap_diesel_post_document = res.data.INVOICE_RECEIPT
      values.diesel_vendor_sap_invoice_no = res.data.INVOICE_RECEIPT
      console.log(values)
      const data = new FormData()
      console.log(values)
      data.append('_method', 'PUT')
      data.append('vehicle_id', values.vehicle_id)
      data.append('parking_id', values.parking_id)
      data.append('driver_id', values.driver_id)
      data.append('diesel_vendor_id', values.diesel_vendor_id)
      data.append('tripsheet_id', values.tripsheet_id)
      data.append('vendor_code', values.vendor_code)
      data.append('no_of_ltrs', values.no_of_ltrs1)
      data.append('invoice_no', values.invoice_no)
      data.append('invoice_copy', values.invoice_copy)
      data.append('total_amount', values.total_amount.toFixed(0))
      data.append('bunk_reading', values.bunk_reading)
      data.append('diesel_vendor_sap_invoice_no', values.diesel_vendor_sap_invoice_no)
      data.append('rate_of_ltrs', values.rate_of_ltrs)
      data.append('approval_remarks', remarks)
      data.append('sap_book_division', 1)
      data.append('approved_by', user_id)
      data.append('diesel_status',status)
      data.append('diesel_invoice_date', values.diesel_invoice_date)
      data.append('sap_invoice_diesel_posting_date',values.sap_invoice_diesel_posting_date)

      /* ================== ASK Part Start ======================= */
      data.append('vendor_tds', values.vendor_tds)
      data.append('vendor_hsn', values.vendor_hsn)
      /* ================== ASK Part End ======================= */

      if(values.diesel_vendor_sap_invoice_no == undefined || values.diesel_vendor_sap_invoice_no == ''){
        setFetch(true)
        toast.warning('Invalid Invoice Number')
        return false
      }
      DieselIntentCreationService.updateDiesel(id,data).then((res) => {
        if (res.status == 200 && status == 3) { 
          Swal.fire({
            title: 'Diesel Intent Approval Submitted!',
            icon: "success",
            text:  'SAP Doc No : ' + sap_diesel_post_document,
            confirmButtonText: "OK",
          }).then(function () {
            navigation('/DiApprovalHome')
          });
        } else {
          // toast.warning('Something Went Wrong !')
          Swal.fire({
            title: 'Diesel Intent Approval Failed in LP.. Kindly Contact Admin!',
            icon: "warning",
            confirmButtonText: "OK",
          }).then(function () {
            // window.location.reload(false)
          })
        // if (res.status === 200) {
        //   if (status == 3){
        //     setFetch(true)
        //   toast.success('Diesel Intent Approved Successfully!')
        //     navigation('/DiApprovalHome')
        // } else {
        //   setFetch(true)
        //   toast.warning('Reject the customer Approval!')
        //   navigation('/DiApprovalHome')
        // }
        }
      })
    })
  }

  /* ============= Admin Vendor Change Process ============= */
  
  const [vendorChangeId, setVendorChangeId] = useState('')

  const ColoredLine = ({ color }) => (
    <hr
        style={{
            color: color,
            backgroundColor: color,
            height: 5
        }}
    />
  )

  const AdminVendorChange = (eve) => {
    let selectedValue = eve.target.value
    console.log(selectedValue,'AdminVendorChange-selectedValue')
    setVendorChangeId(selectedValue)
  }

  function DieselVendorChange() {

    if(vendorChangeId == ''){ 
      toast.warning('Vendor Name is required...')
      return false
    } 

    if(values.diesel_vendor_id == vendorChangeId){
      toast.warning('Same Vendor cannot be updated itself...')
      return false
    }
    
    const data = new FormData() 
    data.append('parking_id', values.parking_id)
    data.append('di_id', id) 
    data.append('diesel_vendor_id', values.diesel_vendor_id)
    data.append('change_vendor_id', vendorChangeId)  
    setFetch(false)

    DieselIntentCreationService.adminUpdateDieselVendor(data).then((res) => {
      console.log(res,'adminUpdateDieselVendor-response')
      setFetch(true)
      if (res.status === 200) {
        toast.success(res.data.message)
        navigation('/DiApprovalHome')
      } else if (res.status === 201) {
        toast.warning(res.data.message)
      } else {
        toast.warning('Something went wrong!')
      } 
    })
    .catch((error) => {
      setFetch(true)
      var object = error.response.data.errors
      var output = ''
      for (var property in object) {
        output += '*' + object[property] + '\n'
      }
      setError(output)
      setErrorModal(true)
    })
  }

    /* ============= Admin Vendor Change Process ============= */

  // Hire vehicles RNS/RS DI Submission Process
  function CreateDieselIntentHire(status) {
    setFetch(false)
    setState({ ...state, page_loading: true })
    let formData = new FormData()
    formData.append('trip_sheet',values.trip_sheet_no)
    // formData.append('trip_sheet','OD78567838')
    formData.append('LIFNR', values.vendor_code)
    formData.append('WRBTR', values.total_amount1)
    formData.append('REMARKS', remarks)
    formData.append('INVOICE_NO', values.invoice_no)
    formData.append('RATE_PER_LTR', values.rate_of_ltrs)
    formData.append('QTY', values.no_of_ltrs.toFixed(3))
    formData.append('VEHICLE_NO', singleVehicleInfo.parking_info.vehicle_number)
    formData.append('POST_DATE', values.sap_invoice_diesel_posting_date)

    // if(singleVehicleInfo.parking_info.trip_sheet_info.to_divison == 2)
    if(singleVehicleInfo.parking_info.trip_sheet_info.to_divison == 2 || (singleVehicleInfo.parking_info.trip_sheet_info.purpose == 4 && singleVehicleInfo.parking_info.trip_sheet_info.others_division == 6))
    {
      formData.append('PLANT', 'NLCD') 
    } else {
      formData.append('PLANT', 'NLLD') 
    }

    let p = 200;

    let Expense_Income_Posting_Date_Taken = ExpenseIncomePostingDate();
    let from_date = Expense_Income_Posting_Date_Taken.min_date
    let to_date = Expense_Income_Posting_Date_Taken.max_date

    console.log(values,'values')
    console.log(from_date,'from_date')
    console.log(to_date,'to_date')
    console.log(values.sap_invoice_diesel_posting_date,'values.sap_invoice_diesel_posting_date')

    if (p <= values.rate_of_ltrs) {
      setFetch(true)
      toast.warning('Rate per liter should not allow more than 200Rs...')
      return false
    } else if(values.sap_invoice_diesel_posting_date == undefined || values.sap_invoice_diesel_posting_date == ''){
      setFetch(true)
      toast.warning('Enter Posting Date')
      return false
    } else if(!(JavascriptDateCheckComponent(from_date,values.sap_invoice_diesel_posting_date,to_date))){
      setFetch(true)
      toast.warning('Invalid Posting date')
      return false
    } else if(values.invoice_copy == '' || values.invoice_copy.size > 5000000){
      setFetch(true)
      toast.warning('Attach The  Invoice Copy Less Than 5MB')
      return false
    }else if(values.bunk_reading == '' || values.bunk_reading.size > 5000000){
      setFetch(true)
      toast.warning('Attach The Bunk Reading Copy Less Than 5MB')
      return false
    } else if(values.vendor_tds == '' || values.vendor_tds == null){
      setFetch(true)
      toast.warning('Vendor TDS Tax Type Should be required..')
      return false
    } else if(values.vendor_hsn == '' || values.vendor_hsn == null){
      setFetch(true)
      toast.warning('HSN Code Should be required..')
      return false
    }

    formData.append('TDS', values.vendor_tds == '0' ? 'NO' : 'YES')
    formData.append('TDS_VALUE', values.vendor_tds == '0' ? '' : values.vendor_tds)
    formData.append('HSN', values.vendor_hsn)

    /* ================== ASK Part End ======================= */

    DieselIntentPaymentSAP.DieselIntentSAP(formData).then((res) => {
      console.log(res.data.INVOICE_RECEIPT)
      let sap_diesel_post_document = res.data.INVOICE_RECEIPT
      values.diesel_vendor_sap_invoice_no = res.data.INVOICE_RECEIPT
      console.log(values)
      const data = new FormData()
      console.log(values)
      data.append('_method', 'PUT')
      data.append('vehicle_id', values.vehicle_id)
      data.append('parking_id', values.parking_id)
      data.append('driver_id', values.driver_id)
      data.append('diesel_vendor_id', values.diesel_vendor_id)
      data.append('tripsheet_id', values.tripsheet_id)
      data.append('vendor_code', values.vendor_code)
      data.append('no_of_ltrs', values.no_of_ltrs.toFixed(3))
      data.append('invoice_no', values.invoice_no)
      data.append('invoice_copy', values.invoice_copy)
      data.append('total_amount', values.total_amount1)
      data.append('bunk_reading', values.bunk_reading)
      data.append('diesel_vendor_sap_invoice_no', values.diesel_vendor_sap_invoice_no)
      data.append('rate_of_ltrs', values.rate_of_ltrs)
      data.append('approval_remarks', remarks)
      data.append('approved_by', user_id)
      if(singleVehicleInfo.parking_info.trip_sheet_info.to_divison == 2)
      { 
        data.append('sap_book_division', 2)
      } else {
        data.append('sap_book_division', 1)
      }
      data.append('diesel_status',status)
      data.append('diesel_invoice_date', values.diesel_invoice_date)
      data.append('sap_invoice_diesel_posting_date',values.sap_invoice_diesel_posting_date)

      /* ================== ASK Part Start ======================= */
      data.append('vendor_tds', values.vendor_tds)
      data.append('vendor_hsn', values.vendor_hsn)
      /* ================== ASK Part End ======================= */

      if(values.diesel_vendor_sap_invoice_no == undefined || values.diesel_vendor_sap_invoice_no == ''){
        setFetch(true)
        toast.warning('Invalid Invoice Number')
        return false
      }
      DieselIntentCreationService.updateDiesel(id,data).then((res) => {
        setFetch(true)
        if (res.status == 200 && status == 3) {  
          Swal.fire({
            title: 'Diesel Intent Approval Submitted!',
            icon: "success",
            text:  'SAP Doc No : ' + sap_diesel_post_document,
            confirmButtonText: "OK",
          }).then(function () {
            navigation('/DiApprovalHome')
          });
        } else { 
            // toast.warning('Something Went Wrong !')
            Swal.fire({
              title: 'Diesel Intent Approval Failed in LP.. Kindly Contact Admin!',
              icon: "warning",
              confirmButtonText: "OK",
            }).then(function () {
              // window.location.reload(false)
            })
          // }
        
          // if (res.status === 200) {
          //   if (status == 3){
          //     setFetch(true)
          //   toast.success('Diesel Intent Approved Successfully!')
          //     navigation('/DiApprovalHome')
          // } else {
          //   setFetch(true)
          //   toast.warning('Reject the customer Approval!')
          //   navigation('/DiApprovalHome')
          // }
        }
      })
    })
  }

  useEffect(() => {
    if (Object.keys(errors).length === 0 && Object.keys(isTouched)) {
      setValidateSubmit(false)
    } else {
      setValidateSubmit(true)
    }

    console.log(singleVehicleInfo)
    console.log(values)
  })
  useEffect(() => {
    if(!errors.diesel_vendor_name && !errors.rate_of_ltrs){
      setAcceptBtn(false);
    } else {
      setAcceptBtn(true);
    }
  }, [errors])

  const formatter = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  })

  const [remarks, setRemarks] = useState('');
  const handleChangenew = event => {
    const result = event.target.value.toUpperCase();
    setRemarks(result);
  }

  const submitNameAssigner = () => {
    let name = '-'

    let vcode =  values.diesel_vendor_id
    let vstat =  values.nlfs_sap_status

    console.log(vcode,'submitNameAssigner-vcode')
    console.log(vstat,'submitNameAssigner-vstat')
 
    if(vcode != 3)
    {
      name = 'Submit'
    } else {
      if(vstat == 1){
        name = 'DO Creation'
      } else if(vstat == 2){
        name = 'Invoice Creation'
      } else if(vstat == 3){
        name = 'E-Way Bill Creation'
      } else {
        console.log(singleVehicleInfo,'singleVehicleInfo-data')
        console.log(values.rate_of_ltrs,'singleVehicleInfo-values.rate_of_ltrs')
        let di_qty = 0
        if(values.vehicle_type_id === vehicleType.OWN || values.vehicle_type_id === vehicleType.CONTRACT)
        {
          di_qty = values.no_of_ltrs1
        } else {
          di_qty = values.no_of_ltrs
        }
        console.log(di_qty,'singleVehicleInfo-di_qty')  
        if(singleVehicleInfo.rate_of_ltrs != values.rate_of_ltrs || formatter.format(singleVehicleInfo.no_of_ltrs) != formatter.format(di_qty))
        {
          name = 'Accounts Approval'
        } else {
          name = 'SO Creation'
        }        
      }
    }

    return name
  }

  function DiApprovalSubmission () {

    let vcode =  values.diesel_vendor_id
    let vstat =  values.nlfs_sap_status
    console.log(singleVehicleInfo,'singleVehicleInfo')
    console.log(values,'singleVehicleInfo-values')
    // return false

    if(vcode != 3){
      if(values.vehicle_type_id === vehicleType.OWN || values.vehicle_type_id === vehicleType.CONTRACT)
      {
        CreateDieselIntent(3)
      } else {
        CreateDieselIntentHire(3)
      }
    } else {
      let di_qty = 0
      if(values.vehicle_type_id === vehicleType.OWN || values.vehicle_type_id === vehicleType.CONTRACT)
      {
        di_qty = values.no_of_ltrs1
      } else {
        di_qty = parseFloat(values.no_of_ltrs).toFixed(3)
      }

      if(singleVehicleInfo.rate_of_ltrs != values.rate_of_ltrs || formatter.format(singleVehicleInfo.no_of_ltrs) != formatter.format(di_qty)){
        NLFSAccountsApproval()
      } else if(vstat == 1){ 
        NLFSDOCreation()
      } else if(vstat == 2){ 
        NLFSInvoiceCreation()
      } else if(vstat == 3){ 
        NLFSEWayBillCreation()
      } else { 
        NLFSSOCreation()
      }
    }

  }

const [sapNlldFuelDiscountRate, setSapNlldFuelDiscountRate] = useState(0)

 

  function BasicValidation () {

    let temp = 0
    let p = 200;

    let Expense_Income_Posting_Date_Taken = ExpenseIncomePostingDate();
    let from_date = Expense_Income_Posting_Date_Taken.min_date
    let to_date = Expense_Income_Posting_Date_Taken.max_date

    console.log(from_date,'from_date')
    console.log(to_date,'to_date')
    console.log(values.sap_invoice_diesel_posting_date,'values.sap_invoice_diesel_posting_date')

    if (p <= values.rate_of_ltrs) {
      setFetch(true)
      toast.warning('Rate per liter should not allow more than 200Rs...')
      return false
    } else if(values.sap_invoice_diesel_posting_date == undefined || values.sap_invoice_diesel_posting_date == ''){
      setFetch(true)
      toast.warning('Enter Posting Date')
      return false
    } else if(!(JavascriptDateCheckComponent(from_date,values.sap_invoice_diesel_posting_date,to_date))){
      setFetch(true)
      toast.warning('Invalid Posting date')
      return false
    } else if(values.invoice_copy == '' || values.invoice_copy.size > 5000000){
      setFetch(true)
      toast.warning('Attach The  Invoice Copy Less Than 5MB')
      return false
    } else if(values.bunk_reading == '' || values.bunk_reading.size > 5000000){
      setFetch(true)
      toast.warning('Attach The Bunk Reading Copy Less Than 5MB')
      return false
    } 
    // else if(values.vendor_tds == '' || values.vendor_tds == null || values.vendor_tds == 'null'){
    //   setFetch(true)
    //   toast.warning('Vendor TDS Tax Type Should be required..')
    //   return false
    // } else if(values.vendor_hsn == '' || values.vendor_hsn == null || values.vendor_hsn == 'null'){
    //   setFetch(true)
    //   toast.warning('HSN Code Should be required..')
    //   return false
    // } 
    else {
      temp = 1
    }
    
    return temp
  }

  function NLFSAccountsApproval () {
    if(sapDieselRate != values.rate_of_ltrs)
    {
      toast.warning(`Rate per liter (${values.rate_of_ltrs}) should be as same as SAP Rate (${sapDieselRate})...`)
      return false
    }
    let valid = BasicValidation()
    if(valid == 1)
    {
      let totamt = 0
      if(values.vehicle_type_id === vehicleType.OWN || values.vehicle_type_id === vehicleType.CONTRACT)
      {
        totamt = singleVehicleInfo.total_amount
      } else {
        totamt = values.total_amount1
      }
      let accounts_approval_info = []
      accounts_approval_info.push({
        nol: singleVehicleInfo.no_of_ltrs,
        rpl: singleVehicleInfo.rate_of_ltrs,
        amount: totamt,
      })

      const data = new FormData()
      console.log(values) 
      data.append('vehicle_id', values.vehicle_id)
      data.append('di_id', id)
      data.append('parking_id', values.parking_id)
      data.append('driver_id', values.driver_id)
      data.append('diesel_vendor_id', values.diesel_vendor_id)
      data.append('tripsheet_id', values.tripsheet_id)
      data.append('vendor_code', values.vendor_code)
      let di_qty = 0
      if(values.vehicle_type_id === vehicleType.OWN || values.vehicle_type_id === vehicleType.CONTRACT)
      {
        di_qty = values.no_of_ltrs1
      } else {
        di_qty = values.no_of_ltrs
      }
      data.append('no_of_ltrs', di_qty)
      data.append('invoice_no', values.invoice_no)
      data.append('invoice_copy', values.invoice_copy)
      data.append('total_amount', Math.round(values.total_amount))
      data.append('bunk_reading', values.bunk_reading) 
      data.append('rate_of_ltrs', values.rate_of_ltrs)
      data.append('acc_appr_request_remarks', remarks)
      data.append('acc_appr_request_by', user_id)
      data.append('diesel_invoice_date', values.diesel_invoice_date)
      data.append('sap_invoice_diesel_posting_date',values.sap_invoice_diesel_posting_date) 
      // data.append('vendor_tds', values.vendor_tds)
      // data.append('vendor_hsn', values.vendor_hsn)
      data.append('acc_appr_info', JSON.stringify(accounts_approval_info))      
      
      setFetch(false)
      DieselIntentCreationService.accountsApprovalRequest(data).then((res) => {
       setFetch(true)
        if (res.status === 200) {
          toast.success(res.data.message)
          navigation('/DiApprovalHome')
        } else if (res.status === 201) {
          toast.warning(res.data.message)
        } else {
          toast.warning('Something went wrong!')
        } 
      })
    }
  }

  function NLFSSOCreation () {

    if(sapDieselRate != values.rate_of_ltrs)
    {
      toast.warning(`Rate per liter (${values.rate_of_ltrs}) should be as same as SAP Rate (${sapDieselRate})...`)
      return false
    }

    let valid = BasicValidation()
    if(valid == 1)
    {
      toast.success('NLFS SO Creation Process')
      console.log('TRIPSHEET_NO : ',values.trip_sheet_no)
      console.log('VEHICLE_NO : ',singleVehicleInfo.parking_info.vehicle_number)
      console.log('QTY : ',parseFloat(values.no_of_ltrs).toFixed(2))
      console.log('DIE_AMT : ',values.rate_of_ltrs)
      console.log('TOT_AMT : ',values.total_amount)
      console.log('TOT_AMT1 : ',values.total_amount1)
      console.log('POST_DATE : ',values.sap_invoice_diesel_posting_date) 

      let formData = new FormData()
      formData.append('TRIPSHEET_NO',values.trip_sheet_no) 
      formData.append('VEHICLE_NO', singleVehicleInfo.parking_info.vehicle_number)
      formData.append('KUNNR', '1006') /* 1006 - NLLD, 1060 - NLCD */
      formData.append('MATNR', nlfs_diesel_material_code)   

      let amount_total = 0
      if(values.vehicle_type_id === vehicleType.OWN || values.vehicle_type_id === vehicleType.CONTRACT)
      { 
        amount_total = parseFloat(values.total_amount).toFixed(2)
      } else {  
        amount_total = parseFloat(values.total_amount1).toFixed(2)     
      }
      let discount_amount = 0
      if(sapNlldFuelDiscountRate != 0 ){
        discount_amount = netAmountFinder(amount_total,2)
      } else {
        discount_amount = amount_total
      }
      console.log('discount_amount : ',discount_amount) 
      formData.append('QTY',  parseFloat(values.no_of_ltrs).toFixed(3)) 
      formData.append('DIE_AMT', amount_total)
      formData.append('DIE_RATE', values.rate_of_ltrs)

      formData.append('UOM', 'L')      
      formData.append('POST_DATE', values.sap_invoice_diesel_posting_date)
      formData.append('DIS_CHA', 'B1')
      formData.append('DOC_TYPE', 2) /* 1 - Barel, 2 - Vehicle */

      console.log('old_amount : ',amount_total)  
      console.log('total_amount : ',discount_amount)  

      // formData.append('SALE_NO', "")
      // formData.append('DEL_NO', "") 
      // console.log(formData,'NLFSSOCreation-formData')
      // return false
      setFetch(false)
      NLFSSAPDieselIndentService.NLFSSOCreation(formData).then((res) => {
        setFetch(true)
        console.log(res,'NLFSSOCreation')
        let sap_status = res.data.STATUS
        let sap_so = res.data.SALE_NO
        let sap_so_amount = res.data.SO_AMT
        let sap_message = res.data.MESSAGE
        if(sap_status != '1'){
          toast.warning(sap_message)
        } else {
          
          const data = new FormData()
          console.log(values) 
          data.append('di_id', id)
          data.append('vehicle_id', values.vehicle_id)
          data.append('parking_id', values.parking_id)
          data.append('driver_id', values.driver_id)
          data.append('diesel_vendor_id', values.diesel_vendor_id)
          data.append('tripsheet_id', values.tripsheet_id)
          data.append('vendor_code', values.vendor_code)
          data.append('no_of_ltrs', parseFloat(values.no_of_ltrs).toFixed(3))
          data.append('invoice_no', values.invoice_no)
          data.append('invoice_copy', values.invoice_copy)
          data.append('total_amount', discount_amount)

          if(values.diesel_vendor_id == 3){
            if(values.vehicle_type_id === vehicleType.OWN || values.vehicle_type_id === vehicleType.CONTRACT)
            {
              data.append('old_amount', amount_total)
              data.append('total_amount', discount_amount) 
            } else {
              data.append('old_amount', discount_amount)
              data.append('total_amount', amount_total)              
            }
            data.append('discount_rate', sapNlldFuelDiscountRate)
          } else {
            data.append('total_amount', amount_total)
          }
          data.append('discount_rate', sapNlldFuelDiscountRate)
          data.append('bunk_reading', values.bunk_reading)
          data.append('diesel_vendor_sap_invoice_no', values.diesel_vendor_sap_invoice_no)
          data.append('rate_of_ltrs', values.rate_of_ltrs)
          data.append('approval_remarks', remarks)
          data.append('approved_by', user_id) 
          data.append('nlfs_sap_status',1)
          data.append('diesel_invoice_date', values.diesel_invoice_date)
          data.append('sap_invoice_diesel_posting_date',values.sap_invoice_diesel_posting_date) 
          // data.append('vendor_tds', values.vendor_tds)
          // data.append('vendor_hsn', values.vendor_hsn)  
          let current_time = getCurrentDateTime()
          let di_so_info = []
          di_so_info.push({
            doc_no: sap_so,
            type: 1, /* Sale Order Creation */
            user: user_id,
            time: current_time,
            remarks: remarks,
          })
          data.append('nlfs_di_info', JSON.stringify(di_so_info))  

          setFetch(false)
          DieselIntentCreationService.NLFSSOCreation(data).then((res) => {
            setFetch(true)
            if (res.status === 200) {
              // toast.success(res.data.message)
              // navigation('/DiApprovalHome')
              Swal.fire({
                title: 'Sale Order Created',
                icon: "success",
                text:  'SAP SO No : ' + sap_so,
                confirmButtonText: "OK",
              }).then(function () {
                // navigation('/DiApprovalHome')
                window.location.reload(false)
              })
            } else if (res.status === 201) {
              toast.warning(res.data.message)
            } else {
              toast.warning('Something went wrong!')
            } 
          })
        }
      })
    }
  }

  const nlfsSAPInfoFinder = (doc_type) => {
  // doc_type = [ 1 - SO, 2 - DO, 3 - Invoice ] 
    let child_element = ''
    let temp = JSON.parse(singleVehicleInfo.nlfs_di_info)
    console.log(temp,'nlfiDIInfoFinder') 
    temp.map((vk,kk)=>{
      if(vk.type == doc_type){
        child_element = vk
      }
    })
    console.log(child_element,'nlfiDIInfoFinder-child_element') 
    return child_element?.doc_no
  } 

  const getSOInfo = () => {
    let data = []
    let so_info= ''
    let temp = JSON.parse(singleVehicleInfo.nlfs_di_info)
    console.log(temp,'getSOInfo') 
    temp.map((vk,kk)=>{
      if(vk.type == 1){
        so_info = vk
      }
    })
    console.log(so_info,'getSOInfo-so_info')
    data.push(so_info)
    console.log(data,'getSOInfo-data')
    return data
  }

  const getSODOInfo = () => {
    let data = []
    let so_info= ''
    let do_info= ''
    let temp = JSON.parse(singleVehicleInfo.nlfs_di_info)
    console.log(temp,'getSODOInfo') 
    temp.map((vk,kk)=>{
      if(vk.type == 1){
        so_info = vk
      }
      if(vk.type == 2){
        do_info = vk
      }
    })
    console.log(so_info,'getSODOInfo-so_info')
    data.push(so_info)
    console.log(do_info,'getSODOInfo-so_info')
    data.push(do_info)
    console.log(data,'getSODOInfo-data')
    return data
  }

  function NLFSDOCreation () {
    
    let valid = BasicValidation()

    console.log(values,'NLFSDOCreation-values')
    // return false
    if(valid == 1)
    {
      toast.success('NLFS DO Creation Process')
      console.log('TRIPSHEET_NO : ',values.trip_sheet_no)
      console.log('VEHICLE_NO : ',singleVehicleInfo.parking_info.vehicle_number)
      console.log('QTY : ',values.no_of_ltrs)
      console.log('DIE_AMT : ',values.rate_of_ltrs)
      console.log('TOT_AMT : ',values.total_amount)
      console.log('POST_DATE : ',values.sap_invoice_diesel_posting_date) 

      let formData = new FormData()
      formData.append('TRIPSHEET_NO',values.trip_sheet_no) 
      formData.append('VEHICLE_NO', singleVehicleInfo.parking_info.vehicle_number)
      formData.append('KUNNR', '1006') /* 1006 - NLLD, 1060 - NLCD */
      formData.append('MATNR', nlfs_diesel_material_code)

      formData.append('QTY', parseFloat(values.no_of_ltrs).toFixed(3)) 
      if(values.vehicle_type_id === vehicleType.OWN || values.vehicle_type_id === vehicleType.CONTRACT)
      {
        formData.append('DIE_AMT', singleVehicleInfo.total_amount)
      } else {
        formData.append('DIE_AMT', singleVehicleInfo.old_amount)           
      }
      
      formData.append('DIE_RATE', values.rate_of_ltrs)

      formData.append('UOM', 'L')      
      formData.append('POST_DATE', values.sap_invoice_diesel_posting_date)
      formData.append('DIS_CHA', 'B1')
      formData.append('DOC_TYPE', 2) /* 1 - Barel, 2 - Vehicle */
      formData.append('SALE_NO', nlfsSAPInfoFinder(1))
      // formData.append('DEL_NO', "") 
      setFetch(false)
      NLFSSAPDieselIndentService.NLFSDOCreation(formData).then((res) => {
        setFetch(true)
        console.log(res,'NLFSDOCreation')
        let sap_status = res.data.STATUS
        let sap_so = res.data.DEL_NO
        let sap_message = res.data.MESSAGE
        if(sap_status != '1'){
          toast.warning(sap_message)
        } else {
          
          const data = new FormData()
          console.log(values) 
          data.append('di_id', id) 
          data.append('parking_id', values.parking_id) 
          data.append('diesel_vendor_id', values.diesel_vendor_id)   
          let current_time = getCurrentDateTime()
          let di_so_info = getSOInfo()
          di_so_info.push({
            doc_no: sap_so,
            type: 2, /* Delivery Order Creation */
            user: user_id,
            time: current_time,
            remarks: remarks,
          })
          data.append('nlfs_di_info', JSON.stringify(di_so_info))  

          setFetch(false)
          DieselIntentCreationService.NLFSDOCreation(data).then((res) => {
            setFetch(true)
            if (res.status === 200) {
              // toast.success(res.data.message)
              // navigation('/DiApprovalHome')
              Swal.fire({
                title: 'Delivery Order Created',
                icon: "success",
                text:  'SAP Delivery No : ' + sap_so,
                confirmButtonText: "OK",
              }).then(function () {
                window.location.reload(false)
                // navigation('/DiApprovalHome')
              })
            } else if (res.status === 201) {
              toast.warning(res.data.message)
            } else {
              toast.warning('Something went wrong!')
            } 
          })
        }
      })
    }
    
  }

  function NLFSInvoiceCreation () {
    toast.success('NLFS Invoice Creation Process')
    console.log('TRIPSHEET_NO : ',values.trip_sheet_no)
    console.log('VEHICLE_NO : ',singleVehicleInfo.parking_info.vehicle_number)
    console.log('QTY : ',values.no_of_ltrs)
    console.log('DIE_AMT : ',values.rate_of_ltrs)
    console.log('TOT_AMT : ',values.total_amount)
    console.log('POST_DATE : ',values.sap_invoice_diesel_posting_date) 

    let formData = new FormData()
    formData.append('TRIPSHEET_NO',values.trip_sheet_no) 
    formData.append('VEHICLE_NO', singleVehicleInfo.parking_info.vehicle_number)
    formData.append('KUNNR', '1006') /* 1006 - NLLD, 1060 - NLCD */
    formData.append('MATNR', nlfs_diesel_material_code)

    formData.append('QTY', parseFloat(values.no_of_ltrs).toFixed(3)) 
    if(values.vehicle_type_id === vehicleType.OWN || values.vehicle_type_id === vehicleType.CONTRACT)
    {
      formData.append('DIE_AMT', singleVehicleInfo.total_amount)
    } else {
      formData.append('DIE_AMT', singleVehicleInfo.old_amount)           
    }
    formData.append('DIE_RATE', values.rate_of_ltrs)

    formData.append('UOM', 'L')      
    formData.append('POST_DATE', values.sap_invoice_diesel_posting_date)
    formData.append('DIS_CHA', 'B1')
    formData.append('DOC_TYPE', 2) /* 1 - Barel, 2 - Vehicle */
    formData.append('SALE_NO', nlfsSAPInfoFinder(1))
    formData.append('DEL_NO', nlfsSAPInfoFinder(2)) 
    setFetch(false)
    NLFSSAPDieselIndentService.NLFSInvoiceCreation(formData).then((res) => {
      setFetch(true)
      console.log(res,'NLFSInvoiceCreation')
      let sap_status = res.data.STATUS
      let sap_so = res.data.INV_NO
      let sap_message = res.data.MESSAGE
      if(sap_status != '1'){
        toast.warning(sap_message)
      } else {
        
        const data = new FormData()
        console.log(values) 
        data.append('di_id', id) 
        data.append('parking_id', values.parking_id) 
        data.append('diesel_vendor_id', values.diesel_vendor_id)   
        let current_time = getCurrentDateTime()
        let di_so_info = getSODOInfo()
        di_so_info.push({
          doc_no: sap_so,
          type: 3, /* Invoice Creation */
          user: user_id,
          time: current_time,
          remarks: remarks,
        })
        data.append('nlfs_di_info', JSON.stringify(di_so_info))  

        setFetch(false)
        DieselIntentCreationService.NLFSInvoiceCreation(data).then((res) => {
          setFetch(true)
          if (res.status === 200) {
            // toast.success(res.data.message)
            // navigation('/DiApprovalHome')
            Swal.fire({
              title: 'Invoice Created',
              icon: "success",
              text:  'SAP Invoice No : ' + sap_so,
              confirmButtonText: "OK",
            }).then(function () {
              // window.location.reload(false)
              navigation('/DiApprovalHome')
            })
          } else if (res.status === 201) {
            toast.warning(res.data.message)
          } else {
            toast.warning('Something went wrong!')
          } 
        })
      }
    })
  }

  function NLFSEWayBillCreation () {
    toast.warning('NLFSEWayBillCreation')
  }

  const [sapDieselRate , setSapDieselRate] = useState(0)

  const handleChildData = (data) => {
    setSapDieselRate(data)
  }

  const netAmountFinder = (tot,type) => {
    let amount = 0
    console.log(tot,'netAmountFinder-tot')
    let discount_amount = values.no_of_ltrs * sapNlldFuelDiscountRate
    console.log(discount_amount,'netAmountFinder-discount_amount')
    amount = parseFloat(discount_amount)+parseFloat(tot)
    console.log(amount,'netAmountFinder-amount')
    // let dis_amount = Math.round(amount)
    let dis_amount = parseFloat(amount).toFixed(2)
    console.log(dis_amount,'netAmountFinder-dis_amount')
    return type == 1 ? parseFloat(discount_amount).toFixed(2) : dis_amount
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
                {values.vehicle_type_id === vehicleType.OWN ||
                values.vehicle_type_id === vehicleType.CONTRACT ? (
                  <DieselApprovalOwn
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
                    sapNlldFuelDiscountRate={sapNlldFuelDiscountRate} 
                    sendDataToParent={handleChildData}
                    handleChangenew={handleChangenew}
                  />
                ) : (
                  <DieselApprovalHire
                    values={values}
                    errors={errors}
                    handleChange={handleChange}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    singleVehicleInfo={singleVehicleInfo}
                    isTouched={isTouched}
                    remarks={remarks}
                    sapNlldFuelDiscountRate={sapNlldFuelDiscountRate} 
                    sendDataToParent={handleChildData}
                    handleChangenew={handleChangenew}
                  />
                )}

                {/* Admin - Diesel Vendor Change Process */}
                {/* {user_info.is_admin == 1 &&  */}
                  <>
                    <ColoredLine color="red" />
                    <CRow className="mt-md-3">
                      
                      <CCol className="" xs={12} sm={12} md={3}>
                        <CFormLabel htmlFor="diesel_vendor_name">
                          Vendor Name  
                        </CFormLabel>
                        <CFormSelect
                          size="sm"
                          name="dvname" 
                          onChange={(e)=>{AdminVendorChange(e)}}
                          value={vendorChangeId}
                          id="vendor_id" 
                          aria-label="Small select example"
                        >
                          <DieseVendorSelectComponent/>
                        </CFormSelect> 
                      </CCol>
                      {vendorChangeId &&
                        <CCol className="mt-4" xs={12} sm={12} md={3}>
                          <CButton 
                            size="sm" 
                            color="success" 
                            className="text-white" 
                            type="button" 
                            onClick={() => {
                              DieselVendorChange() 
                            }}> 
                              Vendor Change 
                          </CButton> 

                        </CCol>
                      }   
                    </CRow>
                    <ColoredLine color="red" />
                  </>
                {/* } */}

              <CRow className="mt-md-3">
                <CCol className="" xs={12} sm={12} md={3}>
                  <CButton size="sm" color="primary" className="text-white" type="button">
                    <Link className="text-white" to="/DiApprovalHome">
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
                    disabled={acceptBtn}
                    onClick={ () =>{
                      DiApprovalSubmission()
                    }} 
                  >
                    {submitNameAssigner()}
                  </CButton> 
                </CCol>
              </CRow>

              </CForm>
            )}
          </CCard>
         </>) : (<AccessDeniedComponent />)}
       </>
      )}
    </>
  )
}

export default DiApprovals
