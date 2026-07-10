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
} from '@coreui/react'
import useForm from 'src/Hooks/useForm'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useEffect } from 'react'
import { Object } from 'core-js'
import { ToastContainer, toast } from 'react-toastify'
import Loader from 'src/components/Loader'
import 'react-toastify/dist/ReactToastify.css'
import DieselCreationOwn from './segments/OwnAndContract/DieselCreationOwn'
import DieselIntentCreationService from 'src/Service/DieselIntent/DieselIntentCreationService'
import DieselIntentValidation from 'src/Utils/DieselIntent/DieselIntentValidation'
import DieselIntentPaymentSAP from 'src/Service/SAP/DieselIntentPaymentSAP'
import SingleTripDetails from './segments/SingleTripDetails/SingleTripDetails'

import AccessDeniedComponent from 'src/components/commoncomponent/AccessDeniedComponent'
import JavascriptInArrayComponent from 'src/components/commoncomponent/JavascriptInArrayComponent'
import * as LogisticsProScreenNumberConstants from 'src/components/constants/LogisticsProScreenNumberConstants'
import ExpenseIncomePostingDate from '../TripsheetClosure/Calculations/ExpenseIncomePostingDate'
import JavascriptDateCheckComponent from 'src/components/commoncomponent/JavascriptDateCheckComponent'
import Swal from 'sweetalert2'

const DieselIntentRegister = () => {
  const user_info_json = localStorage.getItem('user_info')
  const user_info = JSON.parse(user_info_json)

  /* Get User Id From Local Storage */
  const user_id = user_info.user_id

   /* ==================== Access Part Start ========================*/
const [screenAccess, setScreenAccess] = useState(false)
let page_no = LogisticsProScreenNumberConstants.DieselIntentModule.Additional_Diesel_Intent
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
    remarks: '',
    diesel_vendor_name: '',
  }

  const { id } = useParams()
  const [state, setState] = useState({
    page_loading: false,
  })
  const [singleVehicleInfo, setSingleVehicleInfo] = useState(false)
  const [dirverAssign, setDirverAssign] = useState(true)
  const [fetch, setFetch] = useState(false)
  const [validateSubmit, setValidateSubmit] = useState(true)
  const [acceptBtn, setAcceptBtn] = useState(true)
  const navigation = useNavigate()
  const vehicleType = {
    OWN: 1,
    CONTRACT: 2,
    HIRE: 3,
  }

  useEffect(() => {
    DieselIntentCreationService.getSingleVehicleInfoOnGate(id).then((res) => {
      setFetch(true)
      console.log(res.data.data)
      if (res.status === 200) {
        isTouched.vehicle_id = true
        values.tripsheet_id = res.data.data.tripsheet_sheet_id
        isTouched.driver_id = true
        isTouched.tripsheet_id = true
        isTouched.vehicle_type_id = true
        isTouched.parking_id = true

        // values.tripsheet_id = res.data.data.trip_sheet_info != null ? res.data.data.trip_sheet_info.trip_sheet_no : ''
        values.driver_code =
          res.data.data.driver_info != null ? res.data.data.driver_info.driver_code : ''
        // values.vendor_code =
        // res.data.data.diesel_vendor != null ? res.data.data.diesel_vendor.vendor_code : ''
        values.advance_amount = res.data.data.trip_sheet_info.advance_amount
        values.advance_payment_diesel = res.data.data.trip_sheet_info.advance_payment_diesel
        values.total_amount =
          res.data.data.advance_info != null
            ? res.data.data.advance_info.advance_payment_diesel
            : ''
        values.vehicle_type_id = res.data.data.vehicle_type_id.id
        values.vehicle_id = res.data.data.vehicle_id
        values.parking_id = res.data.data.parking_yard_gate_id
        values.driver_id = res.data.data !=null ? res.data.data.driver_id:''
        values.inspection_time =
          res.data.data.vehicle_inspection_trip != null
            ? res.data.data.vehicle_inspection_trip.inspection_time_string
            : ''
        values.trip_sheet_no=
            res.data.data.trip_sheet_info != null ? res.data.data.trip_sheet_info.trip_sheet_no : ''
        values.driveMobile =
          res.data.data.driver_info != null ? res.data.data.driver_info.driver_phone_1 : ''
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
    useForm(CreateDieselIntent, DieselIntentValidation, formValues)
  function CreateDieselIntent(status) {
    setState({ ...state, page_loading: true })
    let formData = new FormData()
    formData.append('trip_sheet',values.trip_sheet_no)
    formData.append('LIFNR', values.vendor_code)
    formData.append('WRBTR', values.total_amount1.toFixed(0))
    formData.append('REMARKS', remarks)
    formData.append('INVOICE_NO', values.invoice_no)
    formData.append('RATE_PER_LTR', values.rate_of_ltrs1)
    formData.append('QTY', values.no_of_ltrs1)
    formData.append('PLANT', 'NLLD')
    formData.append('VEHICLE_NO', singleVehicleInfo.vehicle_number)
    formData.append('POST_DATE', values.sap_invoice_diesel_posting_date)
    console.log(values.total_amount1)

    let p = 200;

    if (p <= values.rate_of_ltrs1) {
      setFetch(true)
      toast.warning('Rate per liter should not allow more than 200Rs...')
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

    else if(values.sap_invoice_diesel_posting_date == undefined || values.sap_invoice_diesel_posting_date == ''){
      setFetch(true)
      toast.warning('Enter Posting Date')
      return false
    } 

    // ============= Posting date Validation Part =================== //

    let Expense_Income_Posting_Date_Taken = ExpenseIncomePostingDate();
    let from_date = Expense_Income_Posting_Date_Taken.min_date
    let to_date = Expense_Income_Posting_Date_Taken.max_date
    let choosen_date = values.sap_invoice_diesel_posting_date

    if(JavascriptDateCheckComponent(from_date,choosen_date,to_date)){
      //
    } else {
      setFetch(true)
      toast.warning('Invalid Posting date')
      return false
    }

    /* ================== ASK Part Start ======================= */
    if(values.vendor_tds == ''){
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
    // ============= Posting date Validation Part =================== //
    
    DieselIntentPaymentSAP.DieselIntentSAP(formData).then((res) => {
      console.log(res.data.INVOICE_RECEIPT)
      let sap_diesel_post_document = res.data.INVOICE_RECEIPT
      values.diesel_vendor_sap_invoice_no = res.data.INVOICE_RECEIPT
      // debugger
    const data = new FormData()
    data.append('parking_id', values.parking_id)
    data.append('vehicle_id', values.vehicle_id)
    data.append('diesel_vendor_id', values.diesel_vendor_name)
    data.append('driver_id', values.driver_id)
    data.append('tripsheet_id', values.tripsheet_id)
    data.append('vendor_code', values.vendor_code)
    data.append('no_of_ltrs', values.no_of_ltrs1)
    data.append('total_amount', values.total_amount1.toFixed(0))
    data.append('rate_of_ltrs', values.rate_of_ltrs1)
    data.append('diesel_vendor_sap_invoice_no', values.diesel_vendor_sap_invoice_no)
    data.append('remarks', remarks)
    data.append('created_by', user_id)
    data.append('sap_book_division', 1)
    data.append('invoice_no', values.invoice_no)
    data.append('invoice_copy', values.invoice_copy)
    data.append('bunk_reading', values.bunk_reading)
    data.append('diesel_status', status)
    data.append('diesel_invoice_date', values.diesel_invoice_date)
    data.append('sap_invoice_diesel_posting_date', values.sap_invoice_diesel_posting_date)

    /* ================== ASK Part Start ======================= */
    data.append('vendor_tds', values.vendor_tds)
    data.append('vendor_hsn', values.vendor_hsn)
    /* ================== ASK Part End ======================= */

    data.append('diesel_type',1)
    if(values.diesel_vendor_sap_invoice_no == undefined || values.diesel_vendor_sap_invoice_no == ''){
      setFetch(true)
      toast.warning('Invalid Invoice Number')
      return false
    }
    DieselIntentCreationService.createDieselRegisterVendor(data)
      .then((res) => {
        if (res.status === 201) { 
          Swal.fire({
            title: 'Diesel Intent Created Successfully!',
            icon: "success",
            text:  'SAP Doc No : ' + sap_diesel_post_document,
            confirmButtonText: "OK",
          }).then(function () {
            navigation('/DieselIntentHomeRegister')
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
        // setError(output)
        // setErrorModal(true)
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
    if (isTouched.diesel_vendor_name && !errors.diesel_vendor_name && !errors.no_of_ltrs1&& isTouched.no_of_ltrs1&&
      isTouched.invoice_no &&
      !errors.invoice_no &&
      // isTouched.invoice_copy &&
      !errors.invoice_copy &&
      // isTouched.bunk_reading &&
      isTouched.rate_of_ltrs1 &&
      !errors.rate_of_ltrs1 &&
      !errors.bunk_reading) {
      setAcceptBtn(false)
    } else {
      setAcceptBtn(true)
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
        {screenAccess ? (
         <>
          <CCard>
            {singleVehicleInfo && (
              <CForm className="container p-3" onSubmit={handleSubmit}>
                  <DieselCreationOwn
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
                <CRow className="mt-md-3">
                  <CCol className="" xs={12} sm={12} md={3}>
                    <CButton size="sm" color="primary" className="text-white" type="button">
                      <Link className="text-white" to="/DieselIntentHome">
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
                        CreateDieselIntent(3)
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
                <SingleTripDetails/>
              </CForm>
            )}
          </CCard>
         </>) : (<AccessDeniedComponent />)}
       </>
      )}

    </>
  )
}
export default DieselIntentRegister
