import {
  CButton,
  CCard,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CRow,
  CTabContent,
  CTabPane,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CAlert,
  CModalFooter,
  CCardImage,
} from '@coreui/react'
import { React, useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useForm from 'src/Hooks/useForm.js'
import RJCustomerValidation from 'src/Utils/TransactionPages/RJCustomerCreation/RJCustomerValidation'
import { useParams } from 'react-router-dom'
import CustomerCreationService from 'src/Service/CustomerCreation/CustomerCreationService'
import { ToastContainer, toast } from 'react-toastify'
import BankService from 'src/Service/Bank/BankService'
import CustomerToSAP from 'src/Service/SAP/CustomerToSAP'
import Loader from 'src/components/Loader'

import AccessDeniedComponent from 'src/components/commoncomponent/AccessDeniedComponent'
import JavascriptInArrayComponent from 'src/components/commoncomponent/JavascriptInArrayComponent'
import * as LogisticsProScreenNumberConstants from 'src/components/constants/LogisticsProScreenNumberConstants'

const RJcustomerCreationConfirmation = () => {

  /*================== User Location Fetch ======================*/
const user_info_json = localStorage.getItem('user_info')
const user_info = JSON.parse(user_info_json)
const user_locations = []

/* Get User Locations From Local Storage */
user_info.location_info.map((data, index) => {
  user_locations.push(data.id)
})

// console.log(user_locations)
/*================== User Location Fetch ======================*/
/* ==================== Access Part Start ========================*/
const [screenAccess, setScreenAccess] = useState(false)
let page_no = LogisticsProScreenNumberConstants.RJCustomerModule.Customer_Creation_Confirmation

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
      createdtype: '',
      customer_name: '',
      cMob: '',
      panCardattachment: '',
      panCard: '',
      AadharCopy: '',
      aadharCard: '',
      bankPass: '',
      bankName: '',
      bankBranch: '',
      bankAccount: '',
      ifscCode: '',
      street: '',
      area: '',
      City: '',
      district: '',
      state: '',
      postalCode: '',
      region: '',
      GST: '',
      Payment: '',
      customer_payment_id: '',
      incoterms: '',
      incoterms_description: ''
    }
    const { id } = useParams()
    const navigation = useNavigate()
    const [errorModal, setErrorModal] = useState(false)
    const [error, setError] = useState({})
    const [ShedOwnerPhoto, setShedOwnerPhoto] = useState(false)
    const [ShedOwnerPhotoDel, setShedOwnerPhotoDel] = useState(true)
    const [Aadhar, setAadhar] = useState(false)
    const [AadharDel, setAadharDel] = useState(true)
    const [passbook, setpassbook] = useState(false)
    const [passbookDel, setpassbookDel] = useState(true)
    const [bankData, setBankData] = useState([])
    const [currentInfo, setCurrentInfo] = useState({})
    const [confirmBtn, setConfirmBtn] = useState(false)
    const [state, setState] = useState({
      page_loading: false,
    })
    const [acceptBtn, setAcceptBtn] = useState(true)
    const [fetch, setFetch] = useState(false)
    const REQ = () => <span className="text-danger"> * </span>

    const { values, errors, handleChange, onFocus, handleSubmit, enableSubmit, onBlur,isTouched } = useForm(
      CustomerCreation,
      RJCustomerValidation,
      formValues,
      CustomerCreationSAP
    )

    useEffect(() => {
      console.log('dfg3')
      if(isTouched.cMob && isTouched.customer_name){
        setAcceptBtn(false);
      } else {
        setAcceptBtn(true);
      }
    }, [errors])

    function CustomerCreationSAP() {
      setState({ ...state, page_loading: true })
      let data = new FormData()
      data.append('name1', values.customer_name)
      data.append('STRAS', values.street)
      data.append('street2', values.area)
      data.append('ORT02', values.district)
      data.append('PSTLZ', values.postalCode)
      data.append('ORT01', values.City)
      data.append('REGIO', values.state)
      data.append('TELF1', values.cMob)
      data.append('STCD3', values.GST || '')
      data.append('BANKL', values.ifscCode || '')
      data.append('BANKN', values.bankAccount || '')
      data.append('KOINH', values.customer_name || '')
      data.append('zterm', values.Payment)
      data.append('J_1IPANNO', values.panCard || '')
      data.append('IDNUMBER', values.aadharCard || '')
      data.append('INCO1', values.incoterms_description)
      // SAPdata.append('country', 'IN')

      CustomerToSAP.customerCreation(data)
      .then((res) => {
        console.log(res.data.CUSTOMER_NO)
        console.log(values)
        // console.log(status_code)
      let formData = new FormData()
      formData.append('_method', 'PUT')
      formData.append('creation_type', values.createdtype )
      formData.append('customer_name', values.customer_name)
      formData.append('customer_mobile_number', values.cMob)
      formData.append('customer_PAN_card_number', values.panCard || ' ')
      formData.append('customer_PAN_card', values.panCardattachment)
      formData.append('customer_Aadhar_card_number', values.aadharCard || ' ')
      formData.append('customer_Aadhar_card', values.AadharCopy)
      formData.append('customer_bank_passbook', values.bankPass || ' ')
      formData.append('customer_bank_branch', values.bankBranch || ' ')
      formData.append('customer_bank_ifsc_code', values.ifscCode)
      formData.append('customer_bank_account_number', values.bankAccount || ' ')
      formData.append('customer_street_name', values.street)
      formData.append('customer_city', values.City)
      formData.append('customer_district', values.district)
      formData.append('customer_area', values.area)
      formData.append('customer_state', values.state)
      formData.append('customer_postal_code', values.postalCode)
      formData.append('customer_region', values.state)
      formData.append('customer_gst_number', values.GST)
      formData.append('customer_payment_terms', values.Payment)
      // formData.append('customer_payment_id', values.Payment)
      // formData.append('incoterms', values.incoterms_description)
      formData.append('incoterms_description', values.incoterms_description)
      formData.append('customer_status', 3)
      formData.append('customer_remarks',values.customer_remarks || ' ')
      formData.append('customer_code',res.data.CUSTOMER_NO)
      formData.append('customer_bank_id', values.bankName)
      // formData.append('customer_status', 3)

      CustomerCreationService.updateCustomerconfirmation(id, formData)
      .then((res) => {
        if (res.status === 200) {
          setState({ ...state, page_loading: false })
          toast.success('Customer Created Successfully!')
          navigation('/RJcustomerCreationConfrimationHome')
          setAcceptBtn(true)
          setFetch(false)
        } else {
          toast.success('Something Went Wrong..!')
          navigation('/RJcustomerCreationConfrimationHome')
          setFetch(false)
        }
      })
      .catch((error) => {
        setState({ ...state })
        for (let value of formData.values()) {
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
  .catch((error) => {
    setState({ ...state })
    alert(error.message)
  })
}

    const GetBankData = () => {
      BankService.getBankDetails().then((resp) => {
        setBankData(resp.data.data)
      })
    }

    useEffect(() => {
      //section for getting vehicle type from database
      CustomerCreationService.getCustomerById(id).then((res) => {
        console.log(res.data.data)

        values.createdtype = res.data.data.creation_type
        values.customer_name = res.data.data.customer_name
        values.cMob = res.data.data.customer_mobile_number
        values.panCard = res.data.data.customer_PAN_card_number
        values.panCardattachment = res.data.data.customer_PAN_card
        values.aadharCard = res.data.data.customer_Aadhar_card_number
        values.AadharCopy = res.data.data.customer_Aadhar_card
        values.bankPass = res.data.data.customer_bank_passbook
        values.bankBranch = res.data.data.customer_bank_branch
        values.bankAccount = res.data.data.customer_bank_account_number
        values.ifscCode = res.data.data.customer_bank_ifsc_code
        values.street = res.data.data.customer_street_name
        values.City = res.data.data.customer_city
        values.district = res.data.data.customer_district
        values.area = res.data.data.customer_area
        values.state = res.data.data.customer_state
        values.state = res.data.data.customer_region
        values.GST = res.data.data.customer_gst_number
        values.Payment = res.data.data.customer_payment_terms
        // values.Payment = res.data.data.customer_payment_id
        values.incoterms_description = res.data.data.incoterms_description
        // values.incoterms_description = res.data.data.incoterms
        values.postalCode = res.data.data.customer_postal_code
        values.customer_remarks = res.data.data.customer_remarks
        values.bankName = res.data.data.customer_bank_id
        GetBankData()
        setFetch(true)
      })

    }, [id])
    function CustomerCreation() {
      // console.log(status_code)
    let formData = new FormData()
    formData.append('_method', 'PUT')
    formData.append('creation_type', values.createdtype)
    formData.append('customer_name', values.customer_name)
    formData.append('customer_mobile_number', values.cMob)
    formData.append('customer_PAN_card_number', values.panCard || ' ')
    formData.append('customer_PAN_card', values.panCardattachment)
    formData.append('customer_Aadhar_card_number', values.aadharCard || ' ')
    formData.append('customer_Aadhar_card', values.AadharCopy)
    formData.append('customer_bank_passbook', values.bankPass)
    formData.append('customer_bank_branch', values.bankBranch || ' ')
    formData.append('customer_bank_ifsc_code', values.ifscCode || ' ')
    formData.append('customer_bank_account_number', values.bankAccount || ' ')
    formData.append('customer_street_name', values.street)
    formData.append('customer_city', values.City)
    formData.append('customer_district', values.district)
    formData.append('customer_area', values.area)
    formData.append('customer_state', values.state)
    formData.append('customer_postal_code', values.postalCode)
    formData.append('customer_region', values.state)
    formData.append('customer_gst_number', values.GST || ' ')
    formData.append('customer_payment_terms', values.Payment)
    // formData.append('customer_payment_id', values.Payment)
    // formData.append('incoterms', values.incoterms_description)
    formData.append('incoterms_description', values.incoterms_description)
    // formData.append('customer_status', values.status_code)
    formData.append('customer_remarks',values.customer_remarks || ' ')
    formData.append('customer_bank_id', values.bankName)
    formData.append('customer_status', 4)
    console.log(formData)
    console.log(values)
    CustomerCreationService.updateCustomer(id, formData)
    .then((res) => {
      console.log(res)
      if (res.status == 200) {
        console.log(res)
        // if (status_code == 4) {
          //never come here
          toast.warning('Customer Confirmation Rejected!')
          navigation('/RJcustomerCreationConfrimationHome')

      }
      else {
        toast.warning('Something Went Wrong !')
      }
    })
    .catch((error) => {
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
              <CTabContent>
                <CTabPane role="tabpanel" aria-labelledby="home-tab" visible={true}>
                  <CForm className="container p-3" onSubmit={handleSubmit}>
                    <CRow className="">
                      <CCol xs={12} md={3}>
                        <CFormLabel htmlFor="createdtype">
                          Customer Type
                          <REQ />{' '}
                        </CFormLabel>

                        <CFormSelect
                          size="sm"
                          id="createdtype"
                          className={`${errors.createdtype && 'is-invalid'}`}
                          name="createdtype"
                          value={values.createdtype}
                          onFocus={onFocus}
                          onBlur={onBlur}
                          disabled
                          onChange={handleChange}
                        >
                          <option value="" hidden selected>
                            Select ...
                          </option>
                          <option value="shed">RJ Shed</option>
                          <option value="customer">RJ Customer</option>
                        </CFormSelect>
                      </CCol>

                  <CCol xs={12} md={3}>
                    <CFormLabel htmlFor="customer_name">
                      Name
                      <REQ />{' '}
                      {errors.customer_name && (
                        <span className="small text-danger">{errors.customer_name}</span>
                      )}
                    </CFormLabel>
                    <CFormInput
                      name="customer_name"
                      size="sm"
                      maxLength={30}
                      id="customer_name"
                      onChange={handleChange}
                      value={values.customer_name}
                      onFocus={onFocus}
                      onBlur={onBlur}
                      placeholder=""
                      readOnly
                    />
                  </CCol>
                  <CCol xs={12} md={3}>
                    <CFormLabel htmlFor="cMob">
                      Mobile Number
                      <REQ />{' '}
                      {errors.cMob && <span className="small text-danger">{errors.cMob}</span>}
                    </CFormLabel>
                    <CFormInput
                      name="cMob"
                      size="sm"
                      maxLength={10}
                      id="cMob"
                      onChange={handleChange}
                      value={values.cMob}
                      onFocus={onFocus}
                      onBlur={onBlur}
                      placeholder=""
                      readOnly
                    />
                  </CCol>
                  <CCol xs={12} md={3}>
                    <CFormLabel htmlFor="street">
                      Street Name
                      <REQ />{' '}
                    </CFormLabel>

                    <CFormInput
                      name="street"
                      size="sm"
                      maxLength={30}
                      id="street"
                      onChange={handleChange}
                      value={values.street}
                      onFocus={onFocus}
                      onBlur={onBlur}
                      placeholder=""
                      readOnly
                    />
                  </CCol>

                  <CCol xs={12} md={3}>
                    <CFormLabel htmlFor="area">
                      Area Name
                      <REQ />{' '}
                    </CFormLabel>
                    <CFormInput
                      name="area"
                      size="sm"
                      maxLength={30}
                      id="area"
                      onChange={handleChange}
                      value={values.area}
                      onFocus={onFocus}
                      onBlur={onBlur}
                      placeholder=""
                      readOnly
                    />
                  </CCol>
                  <CCol xs={12} md={3}>
                    <CFormLabel htmlFor="City">City
                    <REQ />{' '}
                    </CFormLabel>
                    <CFormInput
                      name="City"
                      size="sm"
                      maxLength={20}
                      id="City"
                      onChange={handleChange}
                      value={values.City}
                      onFocus={onFocus}
                      onBlur={onBlur}
                      placeholder=""
                      readOnly
                    />
                  </CCol>
                  <CCol xs={12} md={3}>
                    <CFormLabel htmlFor="district">
                      District
                      <REQ />{' '}
                    </CFormLabel>
                    <CFormInput
                      name="district"
                      size="sm"
                      maxLength={20}
                      id="district"
                      onChange={handleChange}
                      value={values.district}
                      onFocus={onFocus}
                      onBlur={onBlur}
                      placeholder=""
                      readOnly
                    />
                  </CCol>

                  <CCol xs={12} md={3}>
                <CFormLabel htmlFor="state">
                  State
                  <REQ />{' '}
                </CFormLabel>

                <CFormSelect
                  size="sm"
                  id="state"
                  name="state"
                  value={values.state}
                  onFocus={onFocus}
                  onBlur={onBlur}
                  onChange={handleChange}
                  className={`${errors.state && 'is-invalid'}`}
                  aria-label="Small select example"
                  disabled
                >
                  <option value={''} hidden selected>
                    Select...
                  </option>
                  <option value="24">Gujarat</option>
                  <option value="27">Maharashtra</option>
                  <option value="29">Karnataka</option>
                  <option value="32">Kerala</option>
                  <option value="33">Tamil nadu</option>
                  <option value="34">Pondicherry</option>
                  <option value="36">Telengana</option>
                  <option value="37">Andhra pradesh</option>
                </CFormSelect>
                  </CCol>

                  <CCol xs={12} md={3}>
                    <CFormLabel htmlFor="postalCode">
                      Postal Code
                      <REQ />{' '}
                      {errors.postalCode && (
                        <span className="small text-danger">{errors.postalCode}</span>
                      )}
                    </CFormLabel>
                    <CFormInput
                      name="postalCode"
                      size="sm"
                      maxLength={6}
                      id="postalCode"
                      onChange={handleChange}
                      value={values.postalCode}
                      onFocus={onFocus}
                      onBlur={onBlur}
                      placeholder=""
                      readOnly
                    />
                  </CCol>
                  <CCol xs={12} md={3}>
                    <CFormLabel htmlFor="region">
                      Region
                      <REQ />{' '}
                      {errors.region && <span className="small text-danger">{errors.region}</span>}
                    </CFormLabel>
                    <CFormInput
                       size="sm"
                       id="region"
                       name="region"
                       maxLength={2}
                       value={values.state}
                       placeholder="Select State"
                       onFocus={onFocus}
                       onBlur={onBlur}
                       onChange={handleChange}
                       readOnly
                    />
                  </CCol>

                      <CCol md={3}>
                      <CFormLabel htmlFor="panCardattachment">
                        PAN Card Photo{' '}
                        {errors.panCardattachment && (
                          <span className="small text-danger">{errors.panCardattachment}</span>
                        )}
                      </CFormLabel>
                      {values.panCardattachment == 'http://127.0.0.1:8000/storage/app/Customer/customer_PAN_card/' ? (

                        <CFormInput
                          type="text"
                          accept=".jpg,.jpeg,.png,.pdf"
                          name="panCardattachment"
                          size="sm"
                          id="panCardattachment"
                          disabled
                        />
                      ):(
                        <CButton className="w-100 m-0" color="info" size="sm" id="inputAddress">
                        <span className="float-start">
                          <i
                            className="fa fa-eye"
                            onClick={() => setShedOwnerPhoto(true)}
                            aria-hidden="true"
                          ></i>{' '}
                          &nbsp;View
                        </span>

                      </CButton>
                      )}
                    </CCol>

                  <CCol xs={12} md={3}>
                    <CFormLabel htmlFor="panCard">
                      PAN Number
                    </CFormLabel>
                    <CFormInput
                      name="panCard"
                      size="sm"
                      maxLength={10}
                      id="panCard"
                      onChange={handleChange}
                      value={values.panCard}
                      onFocus={onFocus}
                      onBlur={onBlur}
                      placeholder=""
                      readOnly
                   />
                  </CCol>

                  <CCol xs={12} md={3}>

                      <CFormLabel htmlFor="AadharCopy">
                      Aadhar Card Photo{' '}
                        {errors.AadharCopy && (
                          <span className="small text-danger">{errors.AadharCopy}</span>
                        )}
                      </CFormLabel>
                      {values.AadharCopy == 'http://127.0.0.1:8000/storage/app/Customer/customer_Aadhar_card/' ? (
                        <CFormInput
                          type="text"
                          accept=".jpg,.jpeg,.png,.pdf"
                          name="AadharCopy"
                          size="sm"
                          id="AadharCopy"
                          disabled
                        />
                      ):(
                        <CButton className="w-100 m-0" color="info" size="sm" id="inputAddress">
                          <span className="float-start">
                            <i
                              className="fa fa-eye"
                              onClick={() => setAadhar(true)}
                              aria-hidden="true"
                            ></i>{' '}
                            &nbsp;View
                          </span>
                        </CButton>
                      )}
                  </CCol>

                      <CCol xs={12} md={3}>
                        <CFormLabel htmlFor="aadharCard">
                          Aadhar Number

                        </CFormLabel>
                        <CFormInput
                          name="aadharCard"
                          size="sm"
                          maxLength={12}
                          id="aadharCard"
                          onChange={handleChange}
                          onFocus={onFocus}
                          onBlur={onBlur}
                          placeholder=""
                          value={values.aadharCard}
                          readOnly
                        />
                      </CCol>

                      <CCol xs={12} md={3}>
                      <CFormLabel htmlFor="bankPass">
                        Bank Passbook{' '}
                        {errors.bankPass && (
                          <span className="small text-danger">{errors.bankPass}</span>
                        )}
                      </CFormLabel>
                      {values.bankPass == 'http://127.0.0.1:8000/storage/app/Customer/customer_bank_passbook/' ? (
                        <CFormInput
                          type="text"
                          name="bankPass"
                          size="sm"
                          id="bankPass"
                          disabled
                        />
                      ):(
                        <CButton className="w-100 m-0" color="info" size="sm" id="inputAddress">
                          <span className="float-start">
                            <i
                              className="fa fa-eye"
                              onClick={() => setpassbook(true)}
                              aria-hidden="true"
                            ></i>{' '}
                            &nbsp;View
                          </span>
                        </CButton>
                      )}
                    </CCol>
                      <CCol xs={12} md={3}>
                        <CFormLabel htmlFor="bankName">Bank Name
                        {errors.bankName && <span className="small text-danger">{errors.bankName}</span>}
                        </CFormLabel>
                        <CFormSelect
                    size="sm"
                    id="bankName"
                    className={`${errors.bankName && 'is-invalid'}`}
                    name="bankName"
                    value={values.bankName}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    onChange={handleChange}
                    disabled
                  >
                    <option value="0" selected hidden>
                      Select ...
                    </option>
                    {fetch &&
                          bankData.map((data) => {
                            return (
                              <>
                                <option key={data.bank_id} value={data.bank_id}>
                                  {data.bank_name}
                                </option>
                              </>
                            )
                          })}
                  </CFormSelect>
                      </CCol>
                      <CCol xs={12} md={3}>
                        <CFormLabel htmlFor="bankBranch">
                          Bank Branch
                          {errors.bankBranch && (
                            <span className="small text-danger">{errors.bankBranch}</span>
                          )}
                        </CFormLabel>
                        <CFormInput
                          name="bankBranch"
                          size="sm"
                          maxLength={30}
                          id="bankBranch"
                          onChange={handleChange}
                          value={values.bankBranch}
                          onFocus={onFocus}
                          onBlur={onBlur}
                          placeholder=""
                          readOnly
                        />
                      </CCol>
                      <CCol xs={12} md={3}>
                        <CFormLabel htmlFor="ifscCode">
                          Bank IFSC Code

                    </CFormLabel>
                    <CFormInput
                      name="ifscCode"
                      size="sm"
                      maxLength={11}
                      id="ifscCode"
                      onChange={handleChange}
                      value={values.ifscCode}
                      onFocus={onFocus}
                      onBlur={onBlur}
                      placeholder=""
                      readOnly
                    />
                  </CCol>
                  <CCol xs={12} md={3}>
                    <CFormLabel htmlFor="bankAccount">
                      Bank Account Number

                    </CFormLabel>
                    <CFormInput
                      name="bankAccount"
                      size="sm"
                      maxLength={20}
                      id="bankAccount"
                      onChange={handleChange}
                      value={values.bankAccount}
                      onFocus={onFocus}
                      onBlur={onBlur}
                      placeholder=""
                      readOnly
                    />
                  </CCol>
                  <CCol xs={12} md={3}>
                    <CFormLabel htmlFor="GST">
                      GST Number
                    </CFormLabel>
                    <CFormInput
                      name="GST"
                      size="sm"
                      maxLength={15}
                      id="GST"
                      onChange={handleChange}
                      value={values.GST}
                      onFocus={onFocus}
                      onBlur={onBlur}
                      placeholder=""
                      readOnly
                    />
                  </CCol>
                  <CCol xs={12} md={3}>
                    <CFormLabel htmlFor="Payment">Payment Terms
                    <REQ />{' '}
                      {errors.Payment && <span className="small text-danger">{errors.Payment}</span>}
                    </CFormLabel>
                    <CFormSelect
                  size="sm"
                  id="Payment"
                  name="Payment"
                  value={values.Payment}
                  onFocus={onFocus}
                  onBlur={onBlur}
                  onChange={handleChange}
                  className={`${errors.Payment && 'is-invalid'}`}
                  aria-label="Small select example"
                  disabled
                >
                  <option value={''} hidden selected>
                    Select...
                  </option>
                  <option value="ADVA">Advance Payment</option>
                  <option value="D001">Within 1 day Due net</option>
                  <option value="D002">Within 2 day Due net</option>
                  <option value="D003">Within 3 day Due net</option>
                  <option value="D004">Within 4 day Due net</option>
                  <option value="D005">Within 5 day Due net</option>
                  <option value="D006">Within 6 day Due net</option>
                  <option value="D007">Within 7 day Due net</option>
                  <option value="D008">Within 8 day Due net</option>
                  <option value="D009">Within 9 day Due net</option>
                  <option value="D010">Within 10 day Due net</option>
                  <option value="D011">Within 11 day Due net</option>
                  <option value="D012">Within 12 day Due net</option>
                  <option value="D013">Within 13 day Due net</option>
                  <option value="D014">Within 14 day Due net</option>
                  <option value="D015">Within 15 day Due net</option>
                  <option value="D016">Within 16 day Due net</option>
                  <option value="D017">Within 17 day Due net</option>
                  <option value="D018">Within 18 day Due net</option>
                  <option value="D019">Within 19 day Due net</option>
                  <option value="D020">Within 20 day Due net</option>
                  <option value="D021">Within 21 day Due net</option>
                  <option value="D022">Within 22 day Due net</option>
                  <option value="D023">Within 23 day Due net</option>
                  <option value="D024">Within 24 day Due net</option>
                  <option value="D025">Within 25 day Due net</option>
                  <option value="D026">Within 26 day Due net</option>
                  <option value="D027">Within 27 day Due net</option>
                  <option value="D028">Within 28 day Due net</option>
                  <option value="D029">Within 20 day Due net</option>
                  <option value="D030">Within 30 day Due net</option>
                  <option value="D035">Within 35 day Due net</option>
                  <option value="D045">Within 40 day Due net</option>
                  <option value="D040">Within 45 day Due net</option>
                  <option value="D050">Within 50 day Due net</option>
                  <option value="D060">Within 60 day Due net</option>
                  <option value="D090">Within 90 day Due net</option>
                </CFormSelect>
                  </CCol>
                  {/* <CCol xs={12} md={3}>
                    <CFormLabel htmlFor="customer_payment_id">
                      Payment Type
                      {errors.customer_payment_id && <span className="small text-danger">{errors.customer_payment_id}</span>}
                    </CFormLabel>
                    <CFormInput
                       size="sm"
                       id="customer_payment_id"
                       name="customer_payment_id"
                       maxLength={2}
                       value={values.Payment}
                       placeholder="Select Payment Terms"
                       onFocus={onFocus}
                       onBlur={onBlur}
                       onChange={handleChange}
                       readOnly
                    />
                  </CCol> */}
                  <CCol xs={12} md={3}>
                  <CFormLabel htmlFor="incoterms_description">
                  Incoterms Description
                  <REQ />{' '}
                  {errors.incoterms_description && <span className="small text-danger">{errors.incoterms_description}</span>}
                </CFormLabel>

                <CFormSelect
                  size="sm"
                  id="incoterms_description"
                  name="incoterms_description"
                  value={values.incoterms_description}
                  onFocus={onFocus}
                  onBlur={onBlur}
                  onChange={handleChange}
                  className={`${errors.incoterms_description && 'is-invalid'}`}
                  aria-label="Small select example"
                  disabled
                >
                  <option value={''} hidden selected>
                    Select...
                  </option>
                  <option value="CFR">Cost and Freight</option>
                  <option value="CT1">Customer Regular</option>
                  <option value="FOB">Free on Board</option>
                </CFormSelect>
                </CCol>
                {/* <CCol xs={12} md={3}>
                    <CFormLabel htmlFor="incoterms">
                    Incoterms Type
                      {errors.incoterms && <span className="small text-danger">{errors.incoterms}</span>}
                    </CFormLabel>
                    <CFormInput
                       size="sm"
                       id="incoterms"
                       name="incoterms"
                       maxLength={2}
                       value={values.incoterms_description}
                       placeholder="Select incoterms"
                       onFocus={onFocus}
                       onBlur={onBlur}
                       onChange={handleChange}
                       readOnly
                    />
                  </CCol> */}
                  <CCol xs={12} md={3}>
                    <CFormLabel htmlFor="customer_remarks">Remarks</CFormLabel>
                    <CFormInput
                      name="customer_remarks"
                      size="sm"
                      maxLength={40}
                      id="customer_remarks"
                      onChange={handleChange}
                      value={values.customer_remarks}
                      onFocus={onFocus}
                      onBlur={onBlur}
                      placeholder=""
                    />
                  </CCol>
                </CRow>
                <CRow className="mt-3">
                  <CCol>
                    <CButton
                      size="sm"
                      color="primary"
                      // disabled={enableSubmit}
                      className="px-3 text-white"
                      type="button"
                    >
                      <Link to="/RJcustomerCreationConfrimationHome"> Previous</Link>
                    </CButton>
                  </CCol>
                  <CCol className="offset-md-6 d-md-flex justify-content-end" xs={12} sm={12} md={3}>
                    <CButton
                      size="sm"
                      color="warning"
                      // disabled={enableSubmit}
                      // disabled={acceptBtn}
                      className="mx-3 px-3 text-white"
                      type="button"
                      onClick={() => setConfirmBtn(true)}
                    >
                      Submit
                    </CButton>

                    <CButton
                      size="sm"
                      // disabled={enableSubmit}
                      color="warning"
                      className="px-3 text-white"
                      type="button"
                      onClick={() => {CustomerCreation(4)
                        setFetch(false)}}
                    >
                      Reject
                    </CButton>
                  </CCol>
                </CRow>
              </CForm>

            </CTabPane>
          </CTabContent>
        </CCard>
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
        <CModal visible={confirmBtn} onClose={() => setConfirmBtn(false)}>
        <CModalBody>
          <p className="lead">Do You Want To Confirm and Upload This Customer Details To SAP ?</p>
        </CModalBody>
        <CModalFooter>
          <CButton className="m-2" color="warning" onClick={() =>{CustomerCreationSAP()
          setFetch(false)}}>
            Confirm
          </CButton>
          <CButton color="secondary" onClick={() => setConfirmBtn(false)}>
            Cancel
          </CButton>
          {/* <CButton color="primary">Save changes</CButton> */}
        </CModalFooter>
      </CModal>
      {/*Pass book copy model*/}
      <CModal visible={passbook} onClose={() => setpassbook(false)}>
                  <CModalHeader>
                    <CModalTitle>Bank Passbook Photo</CModalTitle>
                  </CModalHeader>
                  <CModalBody>
                    <CCardImage orientation="top" src={values.bankPass} />
                  </CModalBody>
                  <CModalFooter>
                    <CButton color="secondary" onClick={() => setpassbook(false)}>
                      Close
                    </CButton>
                  </CModalFooter>
                </CModal>
                 {/*Aadhar copy  model*/}
                 <CModal visible={Aadhar} onClose={() => setAadhar(false)}>
                  <CModalHeader>
                    <CModalTitle>Aadhar Card Photo</CModalTitle>
                  </CModalHeader>
                  <CModalBody>
                    <CCardImage orientation="top" src={values.AadharCopy} />
                  </CModalBody>
                  <CModalFooter>
                    <CButton color="secondary" onClick={() => setAadhar(false)}>
                      Close
                    </CButton>
                  </CModalFooter>
                </CModal>
                  {/*Shed  Owner Photo model*/}
                  <CModal visible={ShedOwnerPhoto} onClose={() => setShedOwnerPhoto(false)}>
                  <CModalHeader>
                    <CModalTitle>PAN Card Photo</CModalTitle>
                  </CModalHeader>
                  <CModalBody>
                    <CCardImage orientation="top" src={values.panCardattachment || ''} />
                  </CModalBody>
                  <CModalFooter>
                    <CButton color="secondary" onClick={() => setShedOwnerPhoto(false)}>
                      Close
                    </CButton>
                  </CModalFooter>
                </CModal>

          </>) : (<AccessDeniedComponent />)}
        </>
      )}

    </>
    )
}

export default RJcustomerCreationConfirmation
