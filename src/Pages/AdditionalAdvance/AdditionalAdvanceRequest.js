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
import AdvanceCreationService from 'src/Service/Advance/AdvanceCreationService'
import AdvanceCreationValidation from 'src/Utils/Advance/AdvanceCreationValidation'
import AdvanceOwnSAP from 'src/Service/SAP/AdvanceOwnSAP'
import useFormAdvance from 'src/Hooks/useFormAdvance'
import AdditionalAdvanceCreationOwn from './segments/OwnAndContract/AdditionalAdvanceCreationOwn'
import UpdateAdditionalAdvance from './segments/UpdateAdvance/UpdateAdditionalAdvance'

import AccessDeniedComponent from 'src/components/commoncomponent/AccessDeniedComponent'
import JavascriptInArrayComponent from 'src/components/commoncomponent/JavascriptInArrayComponent'
import * as LogisticsProScreenNumberConstants from 'src/components/constants/LogisticsProScreenNumberConstants'
import Swal from 'sweetalert2'
import ExpenseIncomePostingDate from '../TripsheetClosure/Calculations/ExpenseIncomePostingDate'
import JavascriptDateCheckComponent from 'src/components/commoncomponent/JavascriptDateCheckComponent'

const AdditionalAdvanceRequest = () => {
  const user_info_json = localStorage.getItem('user_info')
  const user_info = JSON.parse(user_info_json)

  /* Get User Id From Local Storage */
  const user_id = user_info.user_id

  /* ==================== Access Part Start ========================*/
  const [screenAccess, setScreenAccess] = useState(false)
  let page_no = LogisticsProScreenNumberConstants.AdvancePaymentModule.Additional_Advance

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
  const [error, setError] = useState({})
  const navigation = useNavigate()
  const vehicleType = {
    OWN: 1,
    CONTRACT: 2,
    HIRE: 3,
  }
  // document.addEventListener('contextmenu', event => event.preventDefault());
  useEffect(() => {
    AdvanceCreationService.getSingleVehicleInfoOnGate(id).then((res) => {
      setFetch(true)
      console.log(res.data.data)
      if (res.status === 200) {
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
        values.vendor_code =
          res.data.data.vendor_info != null ? res.data.data.vendor_info.vendor_code : ''
        values.advance_payments =
          res.data.data.trip_sheet_info != null ? res.data.data.trip_sheet_info.advance_amount : ''
        values.advance_payment_diesel =
          res.data.data.trip_sheet_info != null ? res.data.data.trip_sheet_info.advance_payment_diesel
            : ''
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
        // values.sap_invoice_posting_date =
        //   res.data.data.advance_info != null ? res.data.data.advance_info.sap_invoice_posting_date
        //   : ''
        // values.shipment_ton =
          // res.data.data.shipment_info != null ? res.data.data.shipment_info[0].shipment_qty : ''
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
    useFormAdvance(CreateAdvanceOwn, AdvanceCreationValidation, formValues)


  function CreateAdvanceOwn() {

    setState({ ...state, page_loading: true })
    let formData = new FormData()
    formData.append('LIFNR', values.driver_code)
    formData.append('CJNET_AMOUNT', values.advance_paymented || values.advance_payments)
    formData.append('trip_sheet', values.trip_sheet_no)
    formData.append('VEHICLE_NO', singleVehicleInfo.vehicle_number)
    formData.append('REMARKS', remarks)
    formData.append('POST_DATE', values.sap_invoice_posting_date)
    formData.append('screen_type', singleVehicleInfo.trip_sheet_info.advance_status == 0 ? 'HOME':'ADDITIONAL')
    formData.append('PAYMENT_TYPE', values.payment_mode == '1' ? 'CASH':values.payment_mode == '2' ? 'BANK' : '')
    console.log(values.sap_invoice_posting_date)
    let limit = 9990;

    // if (values.driver_outstanding == undefined) {
    //   setFetch(true)
    //   toast.warning('Please Check Vendor outstanding')
    //   return false
    // }

    //  if (limit < values.advance_paymented) {
    //   setFetch(true)
    //   toast.warning('Cash Advance less than 49990 ...')
    //   return false
    // }

    let from_date = Expense_Income_Posting_Date_Taken.min_date
    let to_date = Expense_Income_Posting_Date_Taken.max_date

    console.log(values.advance_paymented)
    console.log(values.advance_payments)
    if(singleVehicleInfo.trip_sheet_info.advance_status == 0) {
      if(values.advance_paymented > 0 && (values.advance_payments == '0' || values.advance_payments > 0)){
        // console.log(values.advance_form.size)

        if(values.otp1 == ''){
          setFetch(true)
          toast.warning('Enter The OTP Number')
          return false
        }

        else if(values.advance_form == '' || values.advance_form.size > 5000000){
          setFetch(true)
          toast.warning('Advance Form Required Less Than 5MB')
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
          // data.append('enter_otp', values.otp1)
          data.append('remarks', remarks)
          data.append('created_by', user_id)
          data.append('purpose', values.purpose)
          data.append('to_divison', values.to_divison)
          // data.append('advance_status', status)
          data.append('document_no', values.document_no)
          data.append('sap_invoice_posting_date',values.sap_invoice_posting_date)
          data.append('payment_mode', values.payment_mode)

          if(res.data.STATUS == '2'){
            setFetch(true)
            toast.warning('Advance Amount Exceed.. Kindly Contact Admin!')
            return false
          }

          if (values.document_no == undefined || values.document_no == '') {
            setFetch(true)
            toast.warning('Freight Cannot be Posted From SAP.. Kindly Contact Admin!')
            return false
          }

          AdvanceCreationService.createAdditionalAdvance(data).then((res) => {
            console.log(res)
            if (res.status === 201) {
              console.log(res)
              setFetch(true)
              // toast.success('Advance Created Successfully!')
              setAcceptBtn(true)
              // navigation('/AdditionalAdvanceHome')
              Swal.fire({
                title: "Advance Submitted Successfully",
                html: 'SAP Document No - ' + values.document_no,
                icon: "success",
                confirmButtonText: "OK",
              }).then(function () {

                toast.success('Advance Posted Successfully')
                navigation('/AdditionalAdvanceHome')
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
      } else if(values.advance_payments > 0 && (values.advance_paymented == undefined || values.advance_paymented == '')){

        if(values.otp1 == ''){
          setFetch(true)
          toast.warning('Enter The OTP Number')
          return false
        }
        else if(values.advance_form == '' || values.advance_form.size > 5000000){
          setFetch(true)
          toast.warning('Advance Form Required Less Than 5MB')
          return false
        }

        else if(values.sap_invoice_posting_date == '' || values.sap_invoice_posting_date == undefined){
          setFetch(true)
          toast.warning('Enter Posting Date')
          return false
        }
        else if(!(JavascriptDateCheckComponent(from_date,values.sap_invoice_posting_date,to_date))){
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
          // data.append('enter_otp', values.otp1)
          data.append('remarks', remarks)
          data.append('created_by', user_id)
          data.append('purpose', values.purpose)
          data.append('to_divison', values.to_divison)
          // data.append('advance_status', status)
          data.append('document_no', values.document_no)
          data.append('sap_invoice_posting_date',values.sap_invoice_posting_date)
          data.append('payment_mode', values.payment_mode)

          if(res.data.STATUS == '2'){
            setFetch(true)
            toast.warning('Advance Amount Exceed.. Kindly Contact Admin!')
            return false
          }

          if (values.document_no == undefined || values.document_no == '') {
            setFetch(true)
            toast.warning('Freight Cannot be Posted From SAP.. Kindly Contact Admin!')
            return false
          }

          AdvanceCreationService.createAdditionalAdvance(data).then((res) => {
            console.log(res)
            if (res.status === 201) {
              console.log(res)
              setFetch(true)
              // toast.success('Advance Created Successfully!')
              setAcceptBtn(true)
              // navigation('/AdditionalAdvanceHome')
              Swal.fire({
                title: "Advance Submitted Successfully",
                html: 'SAP Document No - ' + values.document_no,
                icon: "success",
                confirmButtonText: "OK",
              }).then(function () {

                toast.success('Advance Posted Successfully')
                navigation('/AdditionalAdvanceHome')
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
        // data.append('enter_otp', values.otp1)
        data.append('remarks', remarks)
        data.append('created_by', user_id)
        data.append('purpose', values.purpose)
        data.append('to_divison', values.to_divison)
        // data.append('advance_status', status)
        data.append('document_no', values.document_no || '0')
        data.append('sap_invoice_posting_date',values.sap_invoice_posting_date)

        // if (values.document_no == undefined) {
        //   setFetch(true)
        //   toast.warning('Invalid Invoice Number')
        //   return false
        // }

        // if(res.data.STATUS == '2'){
        //   setFetch(true)
        //   toast.warning('Advance Should Not Allow More Than 9990.. Kindly Contact Admin!')
        //   return false
        // }

        if(values.sap_invoice_posting_date == '' || values.sap_invoice_posting_date == undefined){
          setFetch(true)
          toast.warning('Enter Posting Date')
          return false
        }

        else if(!(JavascriptDateCheckComponent(from_date,values.sap_invoice_posting_date,to_date))){
          setFetch(true)
          toast.warning('Invalid Posting date')
          return false  
        }

        AdvanceCreationService.createAdditionalAdvance(data).then((res) => {
          console.log(res)
          if (res.status === 201) {
            console.log(res)
            setFetch(true)
            // toast.success('Advance Created Successfully!')
            setAcceptBtn(true)
            // navigation('/AdditionalAdvanceHome')
            Swal.fire({
              title: "Advance Submitted Successfully",
              // html: 'SAP Document No - ' + values.document_no,
              icon: "success",
              confirmButtonText: "OK",
            }).then(function () {

              toast.success('Advance Posted Successfully')
              navigation('/AdditionalAdvanceHome')
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
    } else {
      console.log('Update')



      if(values.sap_invoice_posting_date == '' || values.sap_invoice_posting_date == undefined){
        setFetch(true)
        toast.warning('Enter Posting Date')
        return false
      } else if(!(JavascriptDateCheckComponent(from_date,values.sap_invoice_posting_date,to_date))){
        setFetch(true)
        toast.warning('Invalid Posting date')
        return false          
      } else if(values.advance_form == '' || values.advance_form.size > 5000000){
        setFetch(true)
        toast.warning('Advance Form Required Less Than 5MB')
        return false
      } else if(values.advance_payments >= 0 && values.advance_paymented == 0){
        setFetch(true)
        toast.warning('Enter Advance Payment ...')
        return false
      } else if(values.advance_payments == 0 && values.advance_paymented == undefined){
        setFetch(true)
        toast.warning('Enter Advance Payment ...')
        return false
      } else if(values.payment_mode == '' || values.payment_mode == undefined){
        setFetch(true)
        toast.warning('Select Payment Mode')
        return false
      }
      AdvanceOwnSAP.AdvanceOwnSAP(formData).then((res) => {
        console.log(res.data.DOCUMENT_NO)
        values.document_no = res.data.DOCUMENT_NO
        console.log(values.document_no)

        const data = new FormData()
        data.append('driver_id', values.driver_id)
        data.append('vehicle_id', values.vehicle_id)
        data.append('parking_id', values.parking_id)
        data.append('tripsheet_id', values.tripsheet_id)
        data.append('additional_advance_form', values.advance_form)
        data.append('driver_code', values.driver_code)
        data.append('vendor_outstanding', values.driver_outstanding)
        data.append('additional_advance_payment', values.advance_paymented || values.advance_payments)
        // data.append('enter_otp', values.otp1)
        data.append('additional_advance_remarks', remarks)
        // data.append('advance_status', status)
        data.append('additional_advance_document_no', values.document_no || '0')
        data.append('additional_advance_sap_invoice_posting_date',values.sap_invoice_posting_date)
        data.append('created_by', user_id)
        data.append('payment_mode', values.payment_mode)

        if(res.data.STATUS == '2'){
          setFetch(true)
          toast.warning('Advance Amount Exceed.. Kindly Contact Admin!')
          return false
        }

        if (values.document_no == undefined || values.document_no == '') {
          setFetch(true)
          toast.warning('Advance Cannot be Posted From SAP.. Kindly Contact Admin!')
          return false
        }

        if(values.sap_invoice_posting_date == '' || values.sap_invoice_posting_date == undefined){
          setFetch(true)
          toast.warning('Enter Posting Date')
          return false
        } else if(!(JavascriptDateCheckComponent(from_date,values.sap_invoice_posting_date,to_date))){
          setFetch(true)
          toast.warning('Invalid Posting date')
          return false          
        } 

        AdvanceCreationService.updateAdditionalAdvance(id,data).then((res) => {
          console.log(res)
          if (res.status === 200) {
            console.log(res)
            setFetch(true)
            // toast.success('Advance Created Successfully!')
            setAcceptBtn(true)
            // navigation('/AdditionalAdvanceHome')
            Swal.fire({
              title: "Advance Submitted Successfully",
              html: 'SAP Document No - ' + values.document_no,
              icon: "success",
              confirmButtonText: "OK",
            }).then(function () {

              toast.success('Advance Posted Successfully')
              navigation('/AdditionalAdvanceHome')
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

    console.log(singleVehicleInfo)
    console.log(values)
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
      !errors.advance_payment_diesel &&
      !errors.actual_freight &&
      !errors.advance_payment &&
      isTouched.actual_freight
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
                {singleVehicleInfo.trip_sheet_info.advance_status === '0' ? (
                  <AdditionalAdvanceCreationOwn
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
                ):(
                  <UpdateAdditionalAdvance
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
                )
                }
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
                          CreateAdvanceOwn()
                        }}
                        // type="submit"
                      >
                        Submit
                      </CButton>
                    </CCol>
                  </CRow>
              </CForm>
            )}
          </CCard>
        </>
	     ) : (<AccessDeniedComponent />)}
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

export default AdditionalAdvanceRequest
