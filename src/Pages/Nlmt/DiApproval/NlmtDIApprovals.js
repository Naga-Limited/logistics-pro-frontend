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
  CInputGroupText

} from '@coreui/react'
import useForm from 'src/Hooks/useForm'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useEffect } from 'react'
import { Object } from 'core-js'
import { ToastContainer, toast } from 'react-toastify'
import Loader from 'src/components/Loader'
import 'react-toastify/dist/ReactToastify.css'
import DieselVendorMasterService from 'src/Service/Master/DieselVendorMasterService'
import AccessDeniedComponent from 'src/components/commoncomponent/AccessDeniedComponent'
import JavascriptInArrayComponent from 'src/components/commoncomponent/JavascriptInArrayComponent'
import * as LogisticsProScreenNumberConstants from 'src/components/constants/LogisticsProScreenNumberConstants'
import JavascriptDateCheckComponent from 'src/components/commoncomponent/JavascriptDateCheckComponent'
import ExpenseIncomePostingDate from '../TripsheetClosure/Calculations/NlmtExpenseIncomePostingDate'
import Swal from 'sweetalert2'
import DieseVendorSelectComponent from 'src/components/commoncomponent/DieselVendorSelectComponent'
import NlmtReportService from 'src/Service/Nlmt/Report/NlmtReportService'
import NlmtDieselApprovalOwn from './segments/Own/NlmtDieselApprovalOwn'
import NlmtDieselIntentPaymentSAP from 'src/Service/Nlmt/SAP/NlmtDieselIntentPaymentSAP'
import NlmtDieselIntentCreationService from 'src/Service/Nlmt/DieselIntent/NlmtDieselIntentCreationService'
import NlmtDieselIntentValidation from 'src/Utils/Nlmt/DieselIntent/NlmtDieselIntentValidation'

const NlmtDIApprovals = () => {
  const user_info_json = localStorage.getItem('user_info')
  const user_info = JSON.parse(user_info_json)

  /* Get User Id From Local Storage */
  const user_id = user_info.user_id

  /* ==================== Access Part Start ========================*/
// const [screenAccess, setScreenAccess] = useState(false)
// let page_no = LogisticsProScreenNumberConstants.DieselIntentModule.Diesel_Intent_Approval_Request

// useEffect(()=>{

//   if(user_info.is_admin == 1 || JavascriptInArrayComponent(page_no,user_info.page_permissions)){
//     console.log('screen-access-allowed')
//     setScreenAccess(true)
//   } else{
//     console.log('screen-access-not-allowed')
//     setScreenAccess(false)
//   }

// },[])
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
    NlmtReportService.singleDieselDetailsList(id).then((res) => {
      setFetch(true)
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

       values.trip_sheet_no = res.data.data.NlmtTripsheetInfo?.trip_sheet_no || ''
        // values.advance_amount = res.data.data.trip_sheet_info.advance_amount
        // values.advance_payment_diesel=res.data.data.trip_sheet_info.advance_payment_diesel
       values.vehicle_type_id = res.data.data.NlmtVehicleInfo?.vehicle_type_id || ''
        values.vehicle_id = res.data.data.vehicle_id
   values.driver_id = res.data.data.NlmtDriverInfo?.driver_id || ''
        values.driveMobile = res.data.data.NlmtDriverInfo?.driver_id || ''
          values.inspection_time =
          res.data.data.parking_info.vehicle_inspection_trip != null ? res.data.data.parking_info.vehicle_inspection_trip.inspection_time_string : ''
        // values.freight_rate_per_tone =
        //   res.data.data.vehicle_Freight_info == undefined
        //     ? '0'
        //     : res.data.data.vehicle_Freight_info.freight_rate_per_ton
        setSingleVehicleInfo(res.data.data)
        console.log(singleVehicleInfo)

      }
    })
  }, [])


  const { values, errors, handleChange, onFocus, handleSubmit, enableSubmit, onBlur, isTouched } =
    useForm(CreateDieselIntent, NlmtDieselIntentValidation, formValues)
const safeEmpty = '\u00A0'
    function CreateDieselIntent(status) {
      setState({ ...state, page_loading: true })
    let formData = new FormData()
    console.log(singleVehicleInfo.NlmtTripsheetInfo?.nlmt_tripsheet_no+'singleVehicleInfo.NlmtTripsheetInfo?.nlmt_tripsheet_no')
    formData.append('trip_sheet',singleVehicleInfo.NlmtTripsheetInfo?.nlmt_tripsheet_no)
    formData.append('LIFNR', values.vendor_code)
    formData.append('WRBTR', values.total_amount.toFixed(0))
    formData.append('REMARKS', remarks?remarks:safeEmpty)
    formData.append('INVOICE_NO', values.invoice_no)
    formData.append('RATE_PER_LTR', values.rate_of_ltrs)
    formData.append('QTY', values.no_of_ltrs1)
    formData.append('VEHICLE_NO', singleVehicleInfo.NlmtVehicleInfo?.vehicle_number)
    formData.append('POST_DATE', values.sap_invoice_diesel_posting_date)
    formData.append('PLANT', 'NLMD')

    let p = 200;
    let Expense_Income_Posting_Date_Taken = ExpenseIncomePostingDate();
    let from_date = Expense_Income_Posting_Date_Taken.min_date
    let to_date = Expense_Income_Posting_Date_Taken.max_date

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
    }
    /* ================== ASK Part Start ======================= */
    else if(values.vendor_tds == ''){
      setFetch(true)
      toast.warning('Vendor TDS Tax Type Should be required..')
      return false
    } else if(values.vendor_hsn == ''){
      setFetch(true)
      toast.warning('HSN Code Should be required..')
      return false
    }

    formData.append('TDS', values.vendor_tds == '0' ? 'NO' : 'YES')
    formData.append('TDS_VALUE', values.vendor_tds == '0' ? safeEmpty : values.vendor_tds)
    formData.append('HSN', values.vendor_hsn)

    /* ================== ASK Part End ======================= */
    NlmtDieselIntentPaymentSAP.DieselIntentSAP(formData).then((res) => {
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
       NlmtDieselIntentCreationService.updateDiesel(id,data).then((res) => {
          if (res.status == 200 && status == 3) {
            Swal.fire({
              title: 'Diesel Intent Approval Submitted!',
              icon: "success",
              text:  'SAP Doc No : ' + sap_diesel_post_document,
              confirmButtonText: "OK",
            }).then(function () {
              navigation('/NlmtDiApprovalHome')
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

      NlmtDieselIntentCreationService.adminUpdateDieselVendor(data).then((res) => {
        console.log(res,'adminUpdateDieselVendor-response')
        setFetch(true)
        if (res.status === 200) {
          toast.success(res.data.message)
          navigation('/NlmtDiApprovalHome')
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

  function CreateDieselIntentHire(status) {
    setState({ ...state, page_loading: true })
  let formData = new FormData()
  formData.append('trip_sheet',singleVehicleInfo.NlmtTripsheetInfo?.nlmt_tripsheet_no)
  // formData.append('trip_sheet','OD78567838')
  formData.append('LIFNR', values.vendor_code)
  formData.append('WRBTR', values.total_amount1)
  formData.append('REMARKS', remarks)
  formData.append('INVOICE_NO', values.invoice_no)
  formData.append('RATE_PER_LTR', values.rate_of_ltrs)
  //formData.append('QTY', values.no_of_ltrs.toFixed(3))
  formData.append('QTY', parseFloat(values.no_of_ltrs).toFixed(3))
  formData.append('VEHICLE_NO', singleVehicleInfo.NlmtVehicleInfo?.vehicle_number)
  formData.append('POST_DATE', values.sap_invoice_diesel_posting_date)
 formData.append('PLANT', 'NLMD')


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
  }

  else if(values.sap_invoice_diesel_posting_date == undefined || values.sap_invoice_diesel_posting_date == ''){
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
  }

   /* ================== ASK Part Start ======================= */
   else if(values.vendor_tds == ''){
    setFetch(true)
    toast.warning('Vendor TDS Tax Type Should be required..')
    return false
  } else if(values.vendor_hsn == ''){
    setFetch(true)
    toast.warning('HSN Code Should be required..')
    return false
  }

  formData.append('TDS', values.vendor_tds == '0' ? 'NO' : 'YES')
  formData.append('TDS_VALUE', values.vendor_tds == '0' ? '' : values.vendor_tds)
  formData.append('HSN', values.vendor_hsn)

  /* ================== ASK Part End ======================= */

  NlmtDieselIntentPaymentSAP.DieselIntentSAP(formData).then((res) => {
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
      //data.append('no_of_ltrs', values.no_of_ltrs.toFixed(3))
     data.append('no_of_ltrs', parseFloat(values.no_of_ltrs).toFixed(3))
      data.append('invoice_no', values.invoice_no)
      data.append('invoice_copy', values.invoice_copy)
      data.append('total_amount', values.total_amount1)
      data.append('bunk_reading', values.bunk_reading)
      data.append('diesel_vendor_sap_invoice_no', values.diesel_vendor_sap_invoice_no)
      data.append('rate_of_ltrs', values.rate_of_ltrs)
      data.append('approval_remarks', remarks)
      data.append('approved_by', user_id)
      data.append('sap_book_division', 3)
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
        NlmtDieselIntentCreationService.updateDiesel(id,data).then((res) => {
          if (res.status == 200 && status == 3) {
            Swal.fire({
              title: 'Diesel Intent Approval Submitted!',
              icon: "success",
              text:  'SAP Doc No : ' + sap_diesel_post_document,
              confirmButtonText: "OK",
            }).then(function () {
              navigation('/NlmtDiApprovalHome')
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

  const [remarks, setRemarks] = useState('');
    const handleChangenew = event => {
    const result = event.target.value.toUpperCase();

    setRemarks(result);

  };

   return (
    <>
      {!fetch && <Loader />}
      {fetch && (
       <>

          <CCard>
            {singleVehicleInfo && (
              <CForm className="container p-3" onSubmit={handleSubmit}>

                  <NlmtDieselApprovalOwn
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


                {/* Admin - Diesel Vendor Change Process */}
                {user_info.is_admin == 1 &&
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
                }

              <CRow className="mt-md-3">
                <CCol className="" xs={12} sm={12} md={3}>
                  <CButton size="sm" color="primary" className="text-white" type="button">
                    <Link className="text-white" to="/NlmtDiApprovalHome">
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
                  {values.vehicle_type_id === vehicleType.OWN ||
              values.vehicle_type_id === vehicleType.CONTRACT ? (
                  <CButton
                    size="sm"
                    color="warning"
                    className="mx-3 px-3 text-white"
                    // type="button"
                    disabled={acceptBtn}
                    onClick={ () =>{setFetch(false)
                      CreateDieselIntent(3)}}
                      // type="submit"
                  >
                    Submit
                  </CButton>
              ):(
                <CButton
                    size="sm"
                    color="warning"
                    className="mx-3 px-3 text-white"
                    // type="button"
                    disabled={acceptBtn}
                    onClick={ () =>{setFetch(false)
                      CreateDieselIntentHire(3)}}
                      // type="submit"
                  >
                    Submit
                  </CButton>
              )}
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

              </CForm>
            )}
          </CCard>

       </>
      )}
    </>
  )
}

export default NlmtDIApprovals
