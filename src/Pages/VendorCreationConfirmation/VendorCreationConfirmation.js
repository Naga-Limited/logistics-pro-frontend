import {
  CButton,
  CCard,
  CCardImage,
  CAlert,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
} from '@coreui/react'
import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Loader from 'src/components/Loader'

// SERVICES FILE
import VendorCreationService from 'src/Service/VendorCreation/VendorCreationService'
import ShedService from 'src/Service/SmallMaster/Shed/ShedService'
import BankMasterService from 'src/Service/SubMaster/BankMasterService'

import VendorToSAP from 'src/Service/SAP/VendorToSAP'

// VALIDATIONS FILE
import useForm from 'src/Hooks/useForm.js' 
import VendorRequestValidation from 'src/Utils/TransactionPages/VendorCreation/VendorRequestValidation'

import AccessDeniedComponent from 'src/components/commoncomponent/AccessDeniedComponent'
import JavascriptInArrayComponent from 'src/components/commoncomponent/JavascriptInArrayComponent'
import * as LogisticsProScreenNumberConstants from 'src/components/constants/LogisticsProScreenNumberConstants'
import DefinitionsListApi from 'src/Service/Definitions/DefinitionsListApi'

const VendorCreationConfirmation = () => {

   /*================== User Location Fetch ======================*/
   const user_info_json = localStorage.getItem('user_info')
   const user_info = JSON.parse(user_info_json)
   const user_locations = []

   /* Get User Locations From Local Storage */
   user_info.location_info.map((data, index) => {
     user_locations.push(data.id)
   })

   /* Get User Id From Local Storage */
  const user_id = user_info.user_id

   // console.log(user_locations)
   /*================== User Location Fetch ======================*/

   /* ==================== Access Part Start ========================*/
   const [screenAccess, setScreenAccess] = useState(false)
   let page_no = LogisticsProScreenNumberConstants.VendorCreationModule.Vendor_Creation_Confirmation

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

  const { id } = useParams()
  const navigation = useNavigate()

  const [fetch, setFetch] = useState(false)
  const [currentInfo, setCurrentInfo] = useState({})
  const [shedData, setShedData] = useState({})
  const [bankData, setBankData] = useState([])
  const [confirmBtn, setConfirmBtn] = useState(false)
  const [state, setState] = useState({
    page_loading: false,
  })

  const [PanCard, setPanCard] = useState(false)
  const [adharvisible, setAdharVisible] = useState(false)
  const [BankPassbook, setBankPassbook] = useState(false)  
  const [TDSFormFront, setTDSFormFront] = useState(false)
  const [TDSFormBack, setTDSFormBack] = useState(false)

  const [acceptBtn, setAcceptBtn] = useState(true)
  const [rejectBtn, setRejectBtn] = useState(true)

  const [errorModal, setErrorModal] = useState(false)
  const [error, setError] = useState({})
  const [TaxType, setTaxType] = useState([])   

  // SET FORM VALUES
  const formValues = { 
    vendorName: '',
    vendorName2: '',
    panNumber: '',
    aadhar: '',
    bankAccount: '',
    mobileNumber: '',
    bankName: '',
    bankBranch: '',
    bankAccHolderName: '',
    ifscCode: '',
    street: '',
    area: '',
    city: '',
    district: '',
    state: '',
    postalCode: '',
    region: '',
    GSTreg: '',
    GSTNumber: '',
    GSTtax: '',
    payment: '',
    remarks: '',
    // Files
    panCopy: '',
    aadharCopy: '',
    licenseCopy: '',
    rcFront: '',
    rcBack: '',
    insurance: '',
    transportShed: '',
    bankPass: '',
    TDSfront: '',
    TDSback: '',
  }

  // VALIDATIONS
  function callBack() {}
  const { values, errors, handleChange, onFocus, handleSubmit, enableSubmit, onBlur, isTouched } =
    useForm(callBack, VendorRequestValidation, formValues)

  // GET SINGLE SHED DETAILS
  const ShedData = (shed_id) => {
    ShedService.SingleShedData(shed_id).then((resp) => {
      setShedData(resp.data.data)
    })
  }

  // GET BANK DETAILS
  const GetBankData = () => {
    BankMasterService.getAllBank().then((resp) => {
      setBankData(resp.data.data)
    })
  }

  // GET SINGLE VEHICLE DATA FROM VEHICLE DOCUMENTS TABLE
  useEffect(() => {
    VendorCreationService.getVehicleDocumentInfo(id).then((res) => {
      const resData = res.data.data[0]
      console.log('resData')
      console.log(resData)

      //Set vendor Details
      values.vendorName = resData.vendor_info.owner_name
      values.vendorName2 = resData.vendor_info.owner_name2
      values.panNumber = resData.vendor_info.pan_card_number
      values.aadhar = resData.vendor_info.aadhar_card_number
      values.bankAccount = resData.vendor_info.bank_acc_number
      values.mobileNumber = resData.vendor_info.owner_number

      values.bankAccHolderName = resData.vendor_info.bank_acc_holder_name
      values.bankName = resData.vendor_info.bank_name
      values.bankBranch = resData.vendor_info.bank_branch
      values.ifscCode = resData.vendor_info.bank_ifsc

      values.GSTreg = resData.vendor_info.gst_registration
      values.GSTNumber = resData.vendor_info.gst_registration_number
      values.GSTtax = resData.vendor_info.gst_tax_code
      values.payment = resData.vendor_info.payment_term_3days

      values.street = resData.vendor_info.street
      values.area = resData.vendor_info.area
      values.city = resData.vendor_info.city
      values.district = resData.vendor_info.district
      values.state = resData.vendor_info.state
      values.postalCode = resData.vendor_info.postal_code
      values.remarks = resData.vendor_info.remarks || ''

      ShedData(resData.shed_id)
      GetBankData()
      setCurrentInfo(resData)
      setFetch(true)
    })
  }, [id])

  // ERROR VALIDATIONS
  useEffect(() => {
    var gstRegValidationVal = false

    if (values.GSTreg == '1') {
      gstRegValidationVal = !errors.GSTNumber && values.GSTNumber
    } else if (values.GSTreg == '0') {
      gstRegValidationVal = true
    }

    // For Vendor Details
    let vendorNameVal = !errors.vendorName && values.vendorName
    let panVal = !errors.panNumber && values.panNumber
    let aadharVal = !errors.aadhar && values.aadhar
    let mobileVal = !errors.mobileNumber && values.mobileNumber

    // For Vendor Bank Details
    let bankAccVal = !errors.bankAccount && values.bankAccount
    let bankAccHolderNameVal = !errors.bankAccHolderName && values.bankAccHolderName
    let bankNameVal = !errors.bankName && values.bankName
    let bankBranchVal = !errors.bankBranch && values.bankBranch
    let ifscCodeVal = !errors.ifscCode && values.ifscCode

    // For GST Details
    let GSTtaxVal = !errors.GSTtax && values.GSTtax
    let paymentVal = !errors.payment && values.payment

    // For Address Details
    let streetVal = !errors.street && values.street
    let cityVal = !errors.city && values.city
    let areaVal = !errors.area && values.area
    let districtVal = !errors.district && values.district
    let stateVal = !errors.state && values.state
    let postalcodeVal = !errors.postalCode && values.postalCode

    if (
      gstRegValidationVal &&
      bankAccVal &&
      bankAccHolderNameVal &&
      bankNameVal &&
      bankBranchVal &&
      ifscCodeVal &&
      GSTtaxVal &&
      paymentVal &&
      streetVal &&
      cityVal &&
      areaVal &&
      districtVal &&
      stateVal &&
      postalcodeVal &&
      vendorNameVal &&
      panVal &&
      mobileVal &&
      aadharVal
    ) {
      setAcceptBtn(false)
      setRejectBtn(false)
    } else {
      setAcceptBtn(true)
      setRejectBtn(true)
    }

    if (!errors.aadharCopy && values.aadharCopy) {
      console.log('error_aadhar_no')
    } else {
      console.log('error_aadhar_yes')
    }
  }, [values, errors])

  function createVendor() {
    setState({ ...state, page_loading: true })

    let SAPdata = new FormData()
    SAPdata.append('NAME1', values.vendorName)
    SAPdata.append('NAME2', values.vendorName2)
    SAPdata.append('STRAS', values.street)
    SAPdata.append('STREET2', values.area)
    SAPdata.append('ORT02', values.district)
    SAPdata.append('PSTLZ', values.postalCode)
    SAPdata.append('ORT01', values.city)
    SAPdata.append('REGIO', values.state.substring(0, 2))
    SAPdata.append('TELF1', currentInfo.vendor_info.owner_number)
    SAPdata.append('STCD3', values.GSTNumber)
    SAPdata.append('BANKL', values.ifscCode)
    SAPdata.append('BANKN', values.bankAccount)
    SAPdata.append('IDNUMBER', values.aadhar)
    SAPdata.append('KOINH', values.bankAccHolderName)
    SAPdata.append('ZTERM', values.payment)
    SAPdata.append('WITHT', values.GSTtax)
    SAPdata.append('J_1IPANNO', currentInfo.vendor_info.pan_card_number || values.panNumber) 
    SAPdata.append('PARTNERTYPE', '001')

    VendorToSAP.vendorCreation(SAPdata)
      .then((res) => {
        console.log(res)

        if (res.data.VENDOR_NO == '' || res.data.VENDOR_NO == undefined) {
          setFetch(true)
          setConfirmBtn(false)
          toast.warning('Vendor Cannot be created from SAP. Kindly Contact Admin..!')
          return false
        }

        console.log('res')
        console.log(values)
        console.log(res.data.VENDOR_NO)

        const formData = new FormData()
        formData.append('_method', 'PUT')
        formData.append('parking_id', currentInfo.parking_id)
        formData.append('confirmed_by', user_id)
        formData.append('vendor_id', currentInfo.vendor_info.vendor_id)
        formData.append('vendor_code', currentInfo.vendor_info.vendor_code) 
        formData.append('owner_name', values.vendorName) 
        formData.append('owner_name2', values.vendorName2) 
        formData.append(
          'pan_card_number',
          currentInfo.vendor_info.pan_card_number || values.panNumber
        )
        formData.append(
          'aadhar_card_number',
          currentInfo.vendor_info.aadhar_card_number || values.aadhar
        )
        formData.append('bank_name', values.bankName)
        formData.append('owner_number', values.mobileNumber)
        formData.append(
          'bank_acc_number',
          currentInfo.vendor_info.bank_acc_number || values.bankAccount
        )
        formData.append('bank_acc_holder_name', values.bankAccHolderName)
        formData.append('bank_branch', values.bankBranch)
        formData.append('bank_ifsc', values.ifscCode)
        formData.append('street', values.street)
        formData.append('area', values.area)
        formData.append('city', values.city)
        formData.append('district', values.district)
        formData.append('state', values.state)
        formData.append('region', values.state.substring(0, 2))
        formData.append('postal_code', values.postalCode)
        formData.append('gst_registration', values.GSTreg)
        formData.append('gst_registration_number', values.GSTNumber)
        formData.append('gst_tax_code', values.GSTtax)
        formData.append('payment_term_3days', values.payment)

        formData.append('vendor_status', 4)
        formData.append('remarks', values.remarks)
        formData.append('vendor_code', res.data.VENDOR_NO)

        console.log(formData)
        console.log(values)

        // RJSaleOrderCreationService.createRJSaleOrder(formData)
        VendorCreationService.updateVendorRequestData(id, formData)
          .then((res) => {
            setFetch(true)
            if (res.status === 200) {
              setState({ ...state, page_loading: false })
              toast.success('Vendor Created Successfully!')
              navigation('/VendorCreationConfrimationHome')
            } else {
              toast.warning('Something Went Wrong..!')
              navigation('/VendorCreationConfrimationHome')
            }
          })
          .catch((error) => {
            setFetch(true)
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
        setFetch(true)
        setState({ ...state })
        toast.warning(error.message)
      })
  }

  // ADD VENDOR REQUEST DETAILS
  const addVendorRequest = (status) => {
    const formData = new FormData()
    formData.append('_method', 'PUT')
    formData.append('parking_id', currentInfo.parking_id)    
    formData.append('vehicle_id', id) 
    formData.append('vendor_id', currentInfo.vendor_info.vendor_id)

    formData.append('vendor_code', currentInfo.vendor_info.vendor_code)
    formData.append('owner_name', values.vendorName)
    formData.append('owner_name2', values.vendorName2)
    formData.append('owner_number', currentInfo.vendor_info.owner_number)
    formData.append('pan_card_number', currentInfo.vendor_info.pan_card_number || values.panNumber)
    formData.append(
      'aadhar_card_number',
      currentInfo.vendor_info.aadhar_card_number || values.aadhar
    )
    formData.append('bank_name', values.bankName)
    formData.append(
      'bank_acc_number',
      currentInfo.vendor_info.bank_acc_number || values.bankAccount
    )
    formData.append('bank_acc_holder_name', values.bankAccHolderName)
    formData.append('bank_branch', values.bankBranch)
    formData.append('bank_ifsc', values.ifscCode)
    formData.append('street', values.street)
    formData.append('area', values.area)
    formData.append('city', values.city)
    formData.append('district', values.district)
    formData.append('state', values.state)
    formData.append('region', values.state.substring(0, 2))
    formData.append('postal_code', values.postalCode)
    formData.append('gst_registration', values.GSTreg)
    formData.append('gst_registration_number', values.GSTNumber)
    formData.append('gst_tax_code', values.GSTtax || 1245)
    formData.append('payment_term_3days', values.payment || 3000)
    formData.append('vendor_status', status)
    formData.append('remarks', values.remarks)

    console.log(formData)
    console.log(values)

    VendorCreationService.updateVendorRequestData(id, formData)
      .then((res) => {
        console.log(res)
        if (res.status == 200) {
          if (status == 4) {
            //never come here
            toast.success('Vendor Approval Done!')
            navigation('/VendorCreationConfrimationHome')
          } else {
            toast.warning('Vendor Confirmation Rejected!')
            navigation('/VendorCreationConfrimationHome')
          }
        } else {
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


  useEffect(() => {
    DefinitionsListApi.visibleDefinitionsListByDefinition(3).then((response) => {
      let tableData = response.data.data
      const filterData = tableData.filter((data) => (data.definition_list_status == 1))
      setTaxType(filterData)
    })
    }, [])

  return (
    <>
      {!fetch && <Loader />}
      {fetch && (
        <>
         {screenAccess ? (
          <>
          <CCard>
            <CForm className="container p-3" onSubmit={handleSubmit}>
              {/*Row One ------------------------- */}
              <CRow className="">
                {currentInfo.Parking_Table_Joint_Info && (
                  <>
                    <CCol xs={12} md={3}>
                      <CFormLabel htmlFor="Vnum">Vehicle No</CFormLabel>
                      <CFormInput
                        size="sm"
                        id="Vnum"
                        value={currentInfo.Parking_Table_Joint_Info ? currentInfo.Parking_Table_Joint_Info.vehicle_number : ''}
                        readOnly
                      />
                    </CCol>
                  </>
                )}
                <CCol xs={12} md={3}>
                  <CFormLabel htmlFor="shedName">Shed Name</CFormLabel>
                  <CFormInput
                    size="sm"
                    id="shedName"
                    value={fetch ? shedData.shed_name : ''}
                    readOnly
                  />
                </CCol>
                <CCol xs={12} md={3}>
                  <CFormLabel htmlFor="ownerName">Shed Owner Name</CFormLabel>
                  <CFormInput
                    size="sm"
                    id="ownerName"
                    value={fetch ? shedData.shed_owner_name : ''}
                    readOnly
                  />
                </CCol>
                <CCol xs={12} md={3}>
                  <CFormLabel htmlFor="shedownerMob">Shed Mobile Number </CFormLabel>
                  <CFormInput
                    size="sm"
                    id="shedownerMob"
                    name="shedownerMob"
                    value={fetch ? shedData.shed_owner_phone_1 : ''}
                    readOnly
                  />
                </CCol>
                
                <CCol xs={12} md={3}>
                  <CFormLabel htmlFor="vendorName">Vendor Name</CFormLabel>
                  <CFormInput
                    type="text"
                    name="vendorName"
                    size="sm"
                    id="vendorName"
                    maxLength={20}
                    value={values.vendorName}
                    readOnly
                  />
                </CCol>
                <CCol xs={12} md={3}>
                  <CFormLabel htmlFor="vendorName2">Vendor Name2</CFormLabel>
                  <CFormInput
                    type="text"
                    name="vendorName2"
                    size="sm"
                    id="vendorName2"
                    maxLength={50}
                    value={values.vendorName2}
                    readOnly
                  />
                </CCol>
                
                <CCol xs={12} md={3}>
                  <CFormLabel htmlFor="panNumber">PAN Card Number</CFormLabel>
                  <CFormInput
                    size="sm"
                    id="panNumber"
                    name="panNumber"
                    maxLength={10}
                    value={values.panNumber}
                    readOnly
                  />
                </CCol>
                <CCol xs={12} md={3}>
                  <CFormLabel htmlFor="aadhar">Aadhar Card Number</CFormLabel>
                  <CFormInput
                    size="sm"
                    id="aadhar"
                    name="aadhar"
                    maxLength={12}
                    value={values.aadhar}
                    readOnly
                  />
                </CCol>
                <CCol xs={12} md={3}>
                  <CFormLabel htmlFor="mobileNumber">Contact Number</CFormLabel>
                  <CFormInput
                    size="sm"
                    id="mobileNumber"
                    name="mobileNumber"
                    maxLength={10}
                    value={values.mobileNumber}
                    readOnly
                  />
                </CCol>
                 
                <CCol xs={12} md={3}>
                  <CFormLabel htmlFor="bankAccount">Bank Account Number</CFormLabel>
                  <CFormInput
                    size="sm"
                    id="bankAccount"
                    name="bankAccount"
                    maxLength={18}
                    value={values.bankAccount}
                    readOnly
                  />
                </CCol>
                <CCol xs={12} md={3}>
                  <CFormLabel htmlFor="bankAccHolderName">Bank Account Holder Name</CFormLabel>
                  <CFormInput
                    size="sm"
                    id="bankAccHolderName"
                    maxLength={30}
                    name="bankAccHolderName"
                    value={values.bankAccHolderName || ''}
                    readOnly
                  />
                </CCol>

                <CCol xs={12} md={3}>
                  <CFormLabel htmlFor="bankName">Bank Name</CFormLabel>
                  <CFormSelect
                    size="sm"
                    id="bankName"
                    name="bankName"
                    value={values.bankName}
                    disabled
                  >
                    <option value="0" selected hidden>
                      Select ...
                    </option>
                    {fetch &&
                      bankData.map((data) => {
                        return (
                          <>
                            <option key={data.bank_id} value={data.bank_name}>
                              {data.bank_name}
                            </option>
                          </>
                        )
                      })}
                  </CFormSelect>
                </CCol>
                <CCol xs={12} md={3}>
                  <CFormLabel htmlFor="bankBranch">Bank Branch</CFormLabel>
                  <CFormInput
                    type="text"
                    name="bankBranch"
                    size="sm"
                    id="bankBranch"
                    maxLength={30}
                    value={values.bankBranch}
                    readOnly
                  />
                </CCol>
                <CCol xs={12} md={3}>
                  <CFormLabel htmlFor="ifscCode">Bank IFSC Code</CFormLabel>
                  <CFormInput
                    type="text"
                    name="ifscCode"
                    size="sm"
                    id="ifscCode"
                    maxLength={11}
                    value={values.ifscCode || ''}
                    readOnly
                  />
                </CCol>

                <CCol xs={12} md={3}>
                  <CFormLabel htmlFor="GSTreg">GST Registeration</CFormLabel>
                  <CFormSelect
                    size="sm"
                    id="GSTreg"
                    name="GSTreg"
                    disabled
                    value={values.GSTreg}
                    aria-label="Small select example"
                  >
                    <option value={''} hidden selected>
                      Select...
                    </option>
                    <option value="1">Yes</option>
                    <option value="0">No</option>
                  </CFormSelect>
                </CCol>
                {values.GSTreg == 1 && (
                  <CCol xs={12} md={3}>
                    <CFormLabel htmlFor="GSTNumber">GST Registration Number</CFormLabel>
                    <CFormInput
                      size="sm"
                      id="GSTNumber"
                      name="GSTNumber"
                      maxLength={15}
                      disabled
                      value={values.GSTNumber}
                    />
                  </CCol>
                )}

                <CCol xs={12} md={3}>
                  <CFormLabel htmlFor="GSTtax">Tax Type</CFormLabel>

                  <CFormSelect
                    size="sm"
                    id="GSTtax"
                    name="GSTtax"
                    value={values.GSTtax}
                    disabled
                    aria-label="Small select example"
                  >
                    <option value="0">Select...</option>
                      {TaxType.map(({ definition_list_code, definition_list_name }) => {
                        return (
                          <>
                            <option key={definition_list_code} value={definition_list_code}>
                              {definition_list_name}
                            </option>
                          </>
                        )
                      })}
                  </CFormSelect>
                </CCol>
                <CCol xs={12} md={3}>
                  <CFormLabel htmlFor="payment">Payment Type</CFormLabel>

                  <CFormSelect
                    size="sm"
                    id="payment"
                    name="payment"
                    value={values.payment}
                    disabled
                    aria-label="Small select example"
                  >
                    <option value="0">Select ...</option>
                    <option value="Z001">Down Payment Immediate</option>
                    <option value="Z004">4 Days Credit Term</option>
                    <option value="Z007">7 Days Credit Term</option>
                    <option value="Z010">10 Days Credit Term</option>
                    <option value="Z015">15 Days Credit Term</option>
                    <option value="Z021">21 Days Credit Term</option>
                    <option value="Z030">30 Days Credit Term</option>
                    <option value="Z035">35 Days Credit Term</option>
                    <option value="Z040">40 Days Credit Term</option>
                    <option value="Z045">45 Days Credit Term</option>
                    <option value="Z050">50 Days Credit Term</option>
                    <option value="Z060">60 Days Credit Term</option>
                    <option value="Z075">75 Days Credit Term</option>
                    <option value="Z090">90 Days Credit Term</option>
                    <option value="Z120">120 Days Credit Term</option>
                    <option value="ZA25">ADVANCE 25% BALANCE AFTER RECEIPT</option>
                    <option value="ZA30">Advance 30% Bal after</option>
                    <option value="ZA50">ADVANCE 50% BALANCE AFTER RECEIPT</option>
                    <option value="ZA90">90% Advance Remaining After 4 Days</option>
                    <option value="ZARC">Advance 40% Against Receipt 40% After</option>
                    <option value="ZO90">ADV 90% on original RR and Bal 10% on rake</option>
                    <option value="ZR80">ADV 80% on original RR and Bal 20% on rake</option>
                    <option value="ZR90">ADV 90% ON RR RECIPT&BAL 10% ON DELV RECEIPT</option>
                  </CFormSelect>
                </CCol>

                <CCol xs={12} md={3}>
                  <CFormLabel htmlFor="street">Street</CFormLabel>
                  <CFormInput
                    size="sm"
                    id="street"
                    name="street"
                    maxLength={40}
                    value={values.street}
                    disabled
                  />
                </CCol>
                <CCol xs={12} md={3}>
                  <CFormLabel htmlFor="area">Area</CFormLabel>
                  <CFormInput size="sm" id="area" name="area" value={values.area} readOnly />
                </CCol>
                <CCol xs={12} md={3}>
                  <CFormLabel htmlFor="city">City</CFormLabel>
                  <CFormInput
                    size="sm"
                    id="city"
                    name="city"
                    maxLength={30}
                    value={values.city}
                    readOnly
                  />
                </CCol>
                <CCol xs={12} md={3}>
                  <CFormLabel htmlFor="district">District</CFormLabel>

                  <CFormInput
                    size="sm"
                    id="district"
                    name="district"
                    value={values.district}
                    readOnly
                  />
                </CCol>
                <CCol xs={12} md={3}>
                  <CFormLabel htmlFor="state">State</CFormLabel>

                  <CFormSelect
                    size="sm"
                    id="state"
                    name="state"
                    value={values.state}
                    disabled
                    aria-label="Small select example"
                  >
                    <option value={''} hidden selected>
                      Select...
                    </option>
                    <option value="24-Gujarat">Gujarat</option>
                    <option value="27-Maharashtra">Maharashtra</option>
                    <option value="29-Karnataka">Karnataka</option>
                    <option value="32-Kerala">Kerala</option>
                    <option value="33-Tamil nadu">Tamil nadu</option>
                    <option value="34-Pondicherry">Pondicherry</option>
                    <option value="36-Telengana">Telengana</option>
                    <option value="37-Andhra pradesh">Andhra pradesh</option>
                  </CFormSelect>
                </CCol>
                <CCol xs={12} md={3}>
                  <CFormLabel htmlFor="region">Region</CFormLabel>

                  <CFormInput
                    size="sm"
                    id="region"
                    name="region"
                    maxLength={2}
                    value={values.state.substring(0, 2)}
                    placeholder="Select State"
                    readOnly
                  />
                </CCol>
                <CCol xs={12} md={3}>
                  <CFormLabel htmlFor="postalCode">Postal Code</CFormLabel>
                  <CFormInput
                    size="sm"
                    id="postalCode"
                    name="postalCode"
                    maxLength={6}
                    value={values.postalCode}
                    readOnly
                  />
                </CCol>
                <CCol xs={12} md={3}>
                  <CFormLabel htmlFor="panCopy">PAN Card Attachment</CFormLabel>
                  <CButton className="w-100 m-0" color="info" size="sm" readOnly>
                    <span className="float-start" onClick={() => setPanCard(!PanCard)}>
                      <i className="fa fa-eye" aria-hidden="true"></i> &nbsp;View
                    </span>
                  </CButton>
                </CCol>
                <CCol xs={12} md={3}>
                  <CFormLabel htmlFor="aadharCopy">Aadhar Card Copy</CFormLabel>
                  <CButton className="w-100 m-0" color="info" size="sm">
                    <span className="float-start" onClick={() => setAdharVisible(!adharvisible)}>
                      <i className="fa fa-eye" aria-hidden="true"></i> &nbsp;View
                    </span>
                  </CButton>
                </CCol>
                 
                <CCol xs={12} md={3}>
                  <CFormLabel htmlFor="bankPass">Bank Pass Book</CFormLabel>

                  <CButton className="w-100 m-0" color="info" size="sm">
                    <span className="float-start" onClick={() => setBankPassbook(!BankPassbook)}>
                      <i className="fa fa-eye" aria-hidden="true"></i> &nbsp;View
                    </span>
                  </CButton>
                </CCol>
                
                <CCol xs={12} md={3}>
                  <CFormLabel htmlFor="TDSfront">TDS Declaration Form Front</CFormLabel>

                  <CButton
                    className="w-100 m-0"
                    color="info"
                    size="sm"
                    onFocus={onFocus}
                    onBlur={onBlur}
                    onChange={handleChange}
                  >
                    <span className="float-start" onClick={() => setTDSFormFront(!TDSFormFront)}>
                      <i className="fa fa-eye" aria-hidden="true"></i> &nbsp;View
                    </span>
                  </CButton>
                </CCol>
                <CCol xs={12} md={3}>
                  <CFormLabel htmlFor="TDSback">TDS Declaration Form Back</CFormLabel>

                  <CButton className="w-100 m-0" color="info" size="sm">
                    <span className="float-start" onClick={() => setTDSFormBack(!TDSFormBack)}>
                      <i className="fa fa-eye" aria-hidden="true"></i> &nbsp;View
                    </span>
                  </CButton>
                </CCol>
                <CCol xs={12} md={3}>
                  <CFormLabel htmlFor="remarks">Remarks</CFormLabel>
                  <CFormInput
                    size="sm"
                    id="remarks"
                    name="remarks"
                    value={values.remarks == 'null' ? '' : values.remarks ? values.remarks : ''}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    onChange={handleChange}
                  />
                </CCol>
              </CRow>
              {/* Row Nine------------------------- */}
              <CRow>
                <CCol>
                  <Link to="/VendorCreationConfrimationHome">
                    <CButton
                      md={9}
                      size="sm"
                      color="primary"
                      disabled=""
                      className="text-white"
                      // type="submit"
                    >
                      Previous
                    </CButton>
                  </Link>
                </CCol>

                
                <CCol
                  className=""
                  xs={12}
                  sm={12}
                  md={3}
                  style={{ display: 'flex', justifyContent: 'flex-end' }}
                >
                   
                  <CButton
                    size="sm"
                    color="success"
                    className="mx-1 px-2 text-white"
                    type="button"
                    disabled={fetch ? false : true}
                    onClick={() => {
                      // updateSAP()
                      setConfirmBtn(true)
                    }}
                  >
                    Confirm
                  </CButton>
                  <CButton
                    size="sm"
                    color="danger"
                    className="mx-1 px-2 text-white"
                    type="button"
                    disabled={fetch ? false : true}
                    onClick={() => addVendorRequest(1)}
                  >
                    Reject
                  </CButton>
                </CCol>
              </CRow>
              {/* Row Eight------------------------- */}
            </CForm>
          </CCard>
          {/* ============================================================= */}
          {/* ======================= Confirm Button Modal Area ========================== */}

          <CModal visible={confirmBtn} onClose={() => setConfirmBtn(false)}>
            <CModalBody>
              <p className="lead">Do You Want To Confirm and Upload This Vendor Details To SAP ?</p>
            </CModalBody>
            <CModalFooter>
              <CButton
                className="m-2"
                color="warning"
                onClick={() => {
                  createVendor()
                  setFetch(false)
                  // addVendorConfirmation(4)
                }}
              >
                Confirm
              </CButton>
              <CButton color="secondary" onClick={() => setConfirmBtn(false)}>
                Cancel
              </CButton>
              {/* <CButton color="primary">Save changes</CButton> */}
            </CModalFooter>
          </CModal>

          {/* *********************************************************** */}
          {/* ======================= Modal Area ========================== */}

          {/* ======================= Pan Card View ========================== */}

          <CModal visible={PanCard} onClose={() => setPanCard(false)}>
            <CModalHeader>
              <CModalTitle>Pan Card</CModalTitle>
            </CModalHeader>
            <CModalBody>
              {currentInfo.pan_copy && !currentInfo.pan_copy.includes('.pdf') ? (
                <CCardImage orientation="top" src={currentInfo.pan_copy} />
              ) : (
                <iframe
                  orientation="top"
                  height={500}
                  width={475}
                  src={currentInfo.pan_copy}
                ></iframe>
              )}
            </CModalBody>
            <CModalFooter>
              <CButton color="secondary" onClick={() => setPanCard(false)}>
                Close
              </CButton>
            </CModalFooter>
          </CModal>

          {/* ======================= Aadhar Card View ========================== */}

          <CModal visible={adharvisible} onClose={() => setAdharVisible(false)}>
            <CModalHeader>
              <CModalTitle>Aadhar Card</CModalTitle>
            </CModalHeader>
            <CModalBody>
              {currentInfo.aadhar_copy && !currentInfo.aadhar_copy.includes('.pdf') ? (
                <CCardImage orientation="top" src={currentInfo.aadhar_copy} />
              ) : (
                <iframe
                  orientation="top"
                  height={500}
                  width={475}
                  src={currentInfo.aadhar_copy}
                ></iframe>
              )}
            </CModalBody>
            <CModalFooter>
              <CButton color="secondary" onClick={() => setAdharVisible(false)}>
                Close
              </CButton>
            </CModalFooter>
          </CModal>

          {/* ======================= Bank Passbook View ========================== */}

          <CModal visible={BankPassbook} onClose={() => setBankPassbook(false)}>
            <CModalHeader>
              <CModalTitle>Bank Passbook</CModalTitle>
            </CModalHeader>
            <CModalBody>
              {currentInfo.bank_pass_copy && !currentInfo.bank_pass_copy.includes('.pdf') ? (
                <CCardImage orientation="top" src={currentInfo.bank_pass_copy} />
              ) : (
                <iframe
                  orientation="top"
                  height={500}
                  width={475}
                  src={currentInfo.bank_pass_copy}
                ></iframe>
              )}
            </CModalBody>
            <CModalFooter>
              <CButton color="secondary" onClick={() => setBankPassbook(false)}>
                Close
              </CButton>
            </CModalFooter>
          </CModal>

          {/* ======================= TDS Declaration Form Front View ========================== */}

          <CModal visible={TDSFormFront} onClose={() => setTDSFormFront(false)}>
            <CModalHeader>
              <CModalTitle>TDS Declaration Form Front</CModalTitle>
            </CModalHeader>
            <CModalBody>
              {currentInfo.tds_dec_form_front &&
              !currentInfo.tds_dec_form_front.includes('.pdf') ? (
                <CCardImage orientation="top" src={currentInfo.tds_dec_form_front} />
              ) : (
                <iframe
                  orientation="top"
                  height={500}
                  width={475}
                  src={currentInfo.tds_dec_form_front}
                ></iframe>
              )}
            </CModalBody>
            <CModalFooter>
              <CButton color="secondary" onClick={() => setTDSFormFront(false)}>
                Close
              </CButton>
            </CModalFooter>
          </CModal>

          {/* ======================= TDS Declaration Form Back View ========================== */}

          <CModal visible={TDSFormBack} onClose={() => setTDSFormBack(false)}>
            <CModalHeader>
              <CModalTitle>TDS Declaration Form Back</CModalTitle>
            </CModalHeader>
            <CModalBody>
              {currentInfo.tds_dec_form_back && !currentInfo.tds_dec_form_back.includes('.pdf') ? (
                <CCardImage orientation="top" src={currentInfo.tds_dec_form_back} />
              ) : (
                <iframe
                  orientation="top"
                  height={500}
                  width={475}
                  src={currentInfo.tds_dec_form_back}
                ></iframe>
              )}
            </CModalBody>
            <CModalFooter>
              <CButton color="secondary" onClick={() => setTDSFormBack(false)}>
                Close
              </CButton>
            </CModalFooter>
          </CModal>

          {/* *********************************************************** */}

          {/* Modal Area */}
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
          {/* Error Modal Section */}
          </>
	       ) : (<AccessDeniedComponent />)}
        </>
      )}
    </>
  )
}

export default VendorCreationConfirmation
