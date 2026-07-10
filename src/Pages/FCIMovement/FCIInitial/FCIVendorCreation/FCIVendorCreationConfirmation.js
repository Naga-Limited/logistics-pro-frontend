/* eslint-disable prettier/prettier */
import {
    CAlert,
    CButton,
    CCard,
    CCardImage,
    CCol,
    CForm,
    CFormInput,
    CFormLabel,
    CFormSelect,
    CFormTextarea,
    CInputGroup,
    CInputGroupText,
    CModal,
    CModalBody,
    CModalFooter,
    CModalHeader,
    CModalTitle,
    CRow,
    CTabContent,
    CTabPane,
} from '@coreui/react'
import { React, useEffect, useState } from 'react'
import useForm from 'src/Hooks/useForm.js'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Loader from 'src/components/Loader'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import AccessDeniedComponent from 'src/components/commoncomponent/AccessDeniedComponent'
import JavascriptInArrayComponent from 'src/components/commoncomponent/JavascriptInArrayComponent'
import * as LogisticsProScreenNumberConstants from 'src/components/constants/LogisticsProScreenNumberConstants' 
import DefinitionsListApi from 'src/Service/Definitions/DefinitionsListApi' 
import Swal from 'sweetalert2'
import ShedMasterService from 'src/Service/Master/ShedMasterService'
import BankMasterService from 'src/Service/SubMaster/BankMasterService'
import FCIVendorCreationValidation from 'src/Utils/FCIMovement/FCIVendorCreationValidation'
import PanDataService from 'src/Service/SAP/PanDataService'
import FCIVendorCreationService from 'src/Service/FCIMovement/FCIVendorCreation/FCIVendorCreationService'
import AuthService from 'src/Service/Auth/AuthService'
import LocalStorageService from 'src/Service/LocalStoage' 
import noimage_logo from 'src/assets/naga/image-not-found.png'
import VendorToSAP from 'src/Service/SAP/VendorToSAP'

const FCIVendorCreationConfirmation = () => {
    
    // SET FORM VALUES
    const formValues = {
        vehicleNumber: '',
        shedName: '',
        vendorName: '',
        vendorName2: '',
        vendorMobile: '',
        panCardNumber: '',
        aadhar: '',
        bankAccount: '',
        bankName: '',        
        bankAccHolderName: '',
        bankBranch: '',
        ifscCode: '',
        street: '',
        area: '',
        city: '',
        district: '',
        state: '',
        postalCode: '',
        GSTreg: '',
        GSTNumber: '',
        TDStax: '',
        payment: '',
        remarks: '',
        panCopy: '',
        panCopy_file_name: '',
        aadharCopy: '',
        bankPassbookCopy: '',
        tdsCopy: '',
        region: '',
    }
  
    /*================== User Id & Location Fetch ======================*/
    const user_info_json = localStorage.getItem('user_info')
    const user_info = JSON.parse(user_info_json)
    const user_locations = []
    const { id } = useParams()
    const navigation = useNavigate()
    const [currentInfo, setCurrentInfo] = useState({})
  
    console.log(user_info)
  
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
    let page_no = LogisticsProScreenNumberConstants.FCIVCModule.FCI_Vendor_Confirmation
  
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
  
    const REQ = () => <span className="text-danger"> * </span>
    const [fetch, setFetch] = useState(false)
    const [errorModal, setErrorModal] = useState(false)
    const [error, setError] = useState({})
    const [acceptBtn, setAcceptBtn] = useState(true)
    const [panCopyVal, setPanCopyVal] = useState(false)
    const [aadharCopyVal, setAadharCopyVal] = useState(false)
    const [bankCopyVal, setBankCopyVal] = useState(false)
    const [tdsCopyVal, setTdsCopyVal] = useState(false)
    const [confirmBtn, setConfirmBtn] = useState(false)

    const login = () => {
        
    }
  
    const { values, errors, handleChange, onFocus, handleSubmit, onBlur,isTouched } = useForm(
      login,
      FCIVendorCreationValidation,
      formValues
    )    

    // GET SINGLE VCR DATA
    useEffect(() => {
        FCIVendorCreationService.getSingleVendorCreationInfo(id).then((res) => {
            let resData = res.data.data
            console.log(resData,'resData') 

            //Set vendor Details
            values.vehicleNumber = resData.vehicle_no
            values.shedName = resData.shed_id
            values.vendorName = resData.vendor_name
            values.vendorName2 = resData.vendor_name2
            values.vendorMobile = resData.vendor_mobile_no
            values.panCardNumber = resData.pan_no
            values.aadhar = resData.aadhar_card_no
            values.bankAccount = resData.bank_acc_no
            values.bankName = resData.bank_name        
            values.bankAccHolderName = resData.bank_acc_holder_name
            values.bankBranch = resData.bank_branch
            values.ifscCode = resData.bank_ifsc_code
            values.street = resData.street
            values.area = resData.area
            values.city = resData.city
            values.district = resData.district
            values.state = resData.state
            values.postalCode = resData.postal_code
            values.GSTreg = resData.gst_registration_having
            values.GSTNumber = resData.gst_registration_number
            values.TDStax = resData.tds_tax_code
            values.payment = resData.payment_term_type
            values.remarks = resData.remarks
            values.panCopy = resData.pan_card_copy
            values.aadharCopy = resData.aadhar_card_copy
            values.bankPassbookCopy = resData.bank_passbook_copy
            values.tdsCopy = resData.tds_declaration_copy
            values.region = resData.region
            setCurrentInfo(resData)
            setFetch(true)
        })
        .catch((error) => {
            setFetch(true)
            console.log(error)
            let errorText = error.response.data.message
            console.log(errorText,'errorText')
            let timerInterval;
            if (error.response.status === 401) { 
              Swal.fire({
                title: "Unauthorized Activities Found..",
                html: "App will close in <b></b> milliseconds.",
                icon: "error",
                timer: 3000,
                timerProgressBar: true,
                didOpen: () => {
                  Swal.showLoading();
                  const timer = Swal.getPopup().querySelector("b");
                  timerInterval = setInterval(() => {
                    timer.textContent = `${Swal.getTimerLeft()}`;
                  }, 100);
                },
                willClose: () => {
                  clearInterval(timerInterval);
                }
              }).then((result) => {
                // console.log(result,'result') 
                if (result.dismiss === Swal.DismissReason.timer) { 
                  logout()
                }
              });      
            }
        })
    },[id])

    // ERROR VALIDATIONS
    useEffect(() => {

        console.log(values,'values')

        if(values.panCopy){
            console.log(values.panCopy.size,'panCopy-size')
        }

        // let val1 = !errors.vehicleNumber && values.vehicleNumber
        
        let val3 = !errors.vendorName && values.vendorName
        let val4 = !errors.vendorMobile && values.vendorMobile
        let val5 = !errors.bankAccount && values.bankAccount
        let val6 = !errors.panCardNumber && values.panCardNumber
        // let val7 = !errors.aadhar && values.aadhar
        let val8 = !errors.bankName && values.bankName
        let val9 = !errors.bankAccHolderName && values.bankAccHolderName
        let val10 = !errors.bankBranch && values.bankBranch

        let val11 = !errors.ifscCode && values.ifscCode
        let val12 = !errors.street && values.street
        let val13 = !errors.area && values.area
        let val14 = !errors.city && values.city
        let val15 = !errors.district && values.district
        let val16 = !errors.state && values.state
        let val17 = !errors.postalCode && values.postalCode
        let val18 = !errors.GSTreg && values.GSTreg
        let val19 = !errors.TDStax && values.TDStax
        let val20 = !errors.payment && values.payment

        let val21 = (values.GSTreg == '1' ? !errors.GSTNumber && values.GSTNumber : 1)

        if(user_info.is_admin){
            // console.log(val1,'val1')
           
            console.log(val3,'val3')
            console.log(val4,'val4')
            console.log(val5,'val5')
            console.log(val6,'val6')
            // console.log(val7,'val7')
            console.log(val8,'val8')
            console.log(val9,'val9')
            console.log(val10,'val10')
            console.log(val11,'val11')
            console.log(val12,'val12')
            console.log(val13,'val13')
            console.log(val14,'val14')
            console.log(val15,'val15')
            console.log(val16,'val16')
            console.log(val17,'val17')
            console.log(val18,'val18')
            console.log(val19,'val19')
            console.log(val20,'val20')
            console.log(val21,'val21')
        }

        // if(val1 && val3 && val4 && val5 && val6 && val7 && val8 && val9 && val10 && val11 && val12 && val13 && val14 && val15 && val16 && val17 && val18 && val19 && val20 && val21){
        if(val3 && val4 && val5 && val6 && val8 && val9 && val10 && val11 && val12 && val13 && val14 && val15 && val16 && val17 && val18 && val19 && val20 && val21){
            setAcceptBtn(false)
        } else {
            setAcceptBtn(true)
        }

        if(values.state){
            values.region = values.state.substring(0, 2)
        } else {
            values.region = ''
        }

    }, [values, errors])

    function createVendor() {
    
        let SAPdata = new FormData()
        SAPdata.append('NAME1', values.vendorName)
        SAPdata.append('NAME2', values.vendorName2)
        SAPdata.append('STRAS', values.street)
        SAPdata.append('STREET2', values.area)
        SAPdata.append('ORT02', values.district)
        SAPdata.append('PSTLZ', values.postalCode)
        SAPdata.append('ORT01', values.city)
        SAPdata.append('REGIO', values.region)
        SAPdata.append('TELF1', values.vendorMobile)
        SAPdata.append('STCD3', values.GSTNumber)
        SAPdata.append('BANKL', values.ifscCode)
        SAPdata.append('BANKN', values.bankAccount)
        SAPdata.append('IDNUMBER', values.aadhar ? values.aadhar : '')
        SAPdata.append('KOINH', values.bankAccHolderName)
        SAPdata.append('ZTERM', values.payment)
        SAPdata.append('WITHT', values.TDStax)
        SAPdata.append('J_1IPANNO', values.panCardNumber)
        SAPdata.append('PARTNERTYPE', '001')
    
        VendorToSAP.vendorCreation(SAPdata).then((res) => {
            console.log(res,'vendorCreation-SAPdata')
    
            if (res.data.VENDOR_NO == '' || res.data.VENDOR_NO == undefined) {
              setFetch(true)
              setConfirmBtn(false)
              toast.warning('Vendor Cannot be created from SAP. Kindly Contact Admin..!')
              return false
            }
    
            console.log('res')
            console.log(values)
            let sap_vendor_code = res.data.VENDOR_NO
            console.log(sap_vendor_code,'sap_vendor_code')    
            
            const formData = new FormData()
            formData.append('_method', 'PUT')
            formData.append('vehicle_no', values.vehicleNumber ? values.vehicleNumber : '')
            formData.append('shed_id', values.shedName)       
            formData.append('vendor_name', values.vendorName)
            formData.append('vendor_name2', values.vendorName2)
            formData.append('vendor_mobile_no', values.vendorMobile)
            formData.append('bank_acc_no', values.bankAccount)
            formData.append('pan_no', values.panCardNumber)
            formData.append('aadhar_card_no', values.aadhar ? values.aadhar : '')
    
            formData.append('bank_name', values.bankName)
            formData.append('bank_acc_holder_name', values.bankAccHolderName)
            formData.append('bank_branch', values.bankBranch)
            formData.append('bank_ifsc_code', values.ifscCode)
            formData.append('street', values.street)
            formData.append('area', values.area)
            formData.append('city', values.city)
            formData.append('district', values.district)
            formData.append('state', values.state)
            formData.append('postal_code', values.postalCode)
            formData.append('region', values.region)
    
            formData.append('gst_registration_having', values.GSTreg)
    
            if(values.GSTreg == '1'){
                formData.append('gst_registration_number', values.GSTNumber)
            }
            
            formData.append('tds_tax_code', values.TDStax)
            formData.append('payment_term_type', values.payment)
    
            formData.append('pan_card_copy', values.panCopy)
            formData.append('aadhar_card_copy', values.aadharCopy)
            formData.append('bank_passbook_copy', values.bankPassbookCopy)
            formData.append('tds_declaration_copy', values.tdsCopy)
    
            formData.append('vendor_status', 3)
            formData.append('remarks', values.remarks)
            formData.append('updated_by', user_id)

            formData.append('vendor_code', sap_vendor_code)
    
            // toast.success('Testing Verified!')
            setFetch(false)
            FCIVendorCreationService.updateVendorRequestData(id, formData).then((res) => {
                setFetch(true)
                console.log(res)
                setConfirmBtn(false)
                if (res.status == 200) {
                    Swal.fire({
                        title: res.data.message,
                        icon: "success",
                        text:  'SAP Vendor Code : ' + sap_vendor_code,
                        confirmButtonText: "OK",
                    }).then(function () {
                        navigation('/FCIVendorCreationConfirmationHome')
                    });
                } else if (res.status == 201) {
                    Swal.fire({
                        title: res.data.message,
                        icon: "warning",
                        confirmButtonText: "OK",
                    }).then(function () {
                        // window.location.reload(false)
                    })
                } else {
                    toast.warning('Something Went Wrong..! Kindly Contact Admin')
                }
            })
            .catch((error) => {
                setFetch(true)
                console.log(error)
                let errorText = error.response.data.message
                console.log(errorText,'errorText')
                let timerInterval;
                if (error.response.status === 401) { 
                  Swal.fire({
                    title: "Unauthorized Activities Found..",
                    html: "App will close in <b></b> milliseconds.",
                    icon: "error",
                    timer: 3000,
                    timerProgressBar: true,
                    didOpen: () => {
                      Swal.showLoading();
                      const timer = Swal.getPopup().querySelector("b");
                      timerInterval = setInterval(() => {
                        timer.textContent = `${Swal.getTimerLeft()}`;
                      }, 100);
                    },
                    willClose: () => {
                      clearInterval(timerInterval);
                    }
                  }).then((result) => {
                    // console.log(result,'result') 
                    if (result.dismiss === Swal.DismissReason.timer) { 
                      logout()
                    }
                  });      
                }
            })

        })
        .catch((error) => {
            setFetch(true)
            console.log(error)
            let errorText = error.response.data.message
            console.log(errorText,'errorText')
            let timerInterval;
            if (error.response.status === 401) { 
              Swal.fire({
                title: "Unauthorized Activities Found..",
                html: "App will close in <b></b> milliseconds.",
                icon: "error",
                timer: 3000,
                timerProgressBar: true,
                didOpen: () => {
                  Swal.showLoading();
                  const timer = Swal.getPopup().querySelector("b");
                  timerInterval = setInterval(() => {
                    timer.textContent = `${Swal.getTimerLeft()}`;
                  }, 100);
                },
                willClose: () => {
                  clearInterval(timerInterval);
                }
              }).then((result) => {
                // console.log(result,'result') 
                if (result.dismiss === Swal.DismissReason.timer) { 
                  logout()
                }
              });      
            } else {
                Swal.fire({
                    title: 'Server Connection Failed. Kindly contact Admin.!',
                    // text:  error.response.data.message,
                    text:  error.message,
                    icon: "warning",
                    confirmButtonText: "OK",
                }).then(function () {
                // window.location.reload(false)
                }) 
            }
        })         
    
    }

    function logout() {
        AuthService.forceLogout(user_id).then((res) => {
          // console.log(res)
          if (res.status == 204) {
            LocalStorageService.clear()
            window.location.reload(false)
          }
        })
    }

    const VendorValidation = (statusCode) => {
        if(acceptBtn){
            toast.warning('One Of the detail was missing. Kindly check and submit..')
            return false
        }

        console.log(values,'VendorValidation-values')

        if(statusCode == 0 && values.remarks.trim() == ''){
            toast.warning('Remarks should be filled while Rejection..')
            return false
        }

        const formData = new FormData()
        formData.append('_method', 'PUT')
        formData.append('vehicle_no', values.vehicleNumber)
        formData.append('shed_id', values.shedName)       
        formData.append('vendor_name', values.vendorName)
        formData.append('vendor_name2', values.vendorName2)
        formData.append('vendor_mobile_no', values.vendorMobile)
        formData.append('bank_acc_no', values.bankAccount)
        formData.append('pan_no', values.panCardNumber)
        formData.append('aadhar_card_no', values.aadhar)

        formData.append('bank_name', values.bankName)
        formData.append('bank_acc_holder_name', values.bankAccHolderName)
        formData.append('bank_branch', values.bankBranch)
        formData.append('bank_ifsc_code', values.ifscCode)
        formData.append('street', values.street)
        formData.append('area', values.area)
        formData.append('city', values.city)
        formData.append('district', values.district)
        formData.append('state', values.state)
        formData.append('postal_code', values.postalCode)
        formData.append('region', values.region)

        formData.append('gst_registration_having', values.GSTreg)

        if(values.GSTreg == '1'){
            formData.append('gst_registration_number', values.GSTNumber)
        }
        
        formData.append('tds_tax_code', values.TDStax)
        formData.append('payment_term_type', values.payment)

        formData.append('pan_card_copy', values.panCopy)
        formData.append('aadhar_card_copy', values.aadharCopy)
        formData.append('bank_passbook_copy', values.bankPassbookCopy)
        formData.append('tds_declaration_copy', values.tdsCopy)

        formData.append('vendor_status', statusCode)
        formData.append('remarks', values.remarks)
        formData.append('updated_by', user_id)

        // toast.success('Testing Verified!')
        setFetch(false)
        FCIVendorCreationService.updateVendorRequestData(id, formData).then((res) => {
            setFetch(true)
            console.log(res)
            if (res.status == 200) {
                Swal.fire({
                    title: res.data.message,
                    icon: "success",
                    confirmButtonText: "OK",
                }).then(function () {
                    navigation('/FCIVendorCreationConfirmationHome')
                });
            } else if (res.status == 201) {
                Swal.fire({
                    title: res.data.message,
                    icon: "warning",
                    confirmButtonText: "OK",
                }).then(function () {
                    // window.location.reload(false)
                })
            } else {
                toast.warning('Something Went Wrong..! Kindly Contact Admin')
            }
        })
        .catch((error) => {
            setFetch(true)
            console.log(error)
            let errorText = error.response.data.message
            console.log(errorText,'errorText')
            let timerInterval;
            if (error.response.status === 401) { 
              Swal.fire({
                title: "Unauthorized Activities Found..",
                html: "App will close in <b></b> milliseconds.",
                icon: "error",
                timer: 3000,
                timerProgressBar: true,
                didOpen: () => {
                  Swal.showLoading();
                  const timer = Swal.getPopup().querySelector("b");
                  timerInterval = setInterval(() => {
                    timer.textContent = `${Swal.getTimerLeft()}`;
                  }, 100);
                },
                willClose: () => {
                  clearInterval(timerInterval);
                }
              }).then((result) => {
                // console.log(result,'result') 
                if (result.dismiss === Swal.DismissReason.timer) { 
                  logout()
                }
              });      
            }
        })
    }

    const [bankData, setBankData] = useState([])  
    const [TaxType, setTaxType] = useState([])
    const [paymentTermType, setPaymentTermType] = useState([])

  
    useEffect(() => {

        BankMasterService.getAllBank().then((resp) => {
            setBankData(resp.data.data)
        })

        DefinitionsListApi.visibleDefinitionsListByDefinition(3).then((response) => {
            let tableData = response.data.data
            const filterData = tableData.filter((data) => (data.definition_list_status == 1))
            setTaxType(filterData)
        })

        DefinitionsListApi.visibleDefinitionsListByDefinition(2).then((response) => {
            let tableData = response.data.data
            const filterData = tableData.filter((data) => (data.definition_list_status == 1))
            setPaymentTermType(filterData)
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
                  <CTabContent>
                    <CTabPane role="tabpanel" aria-labelledby="home-tab" visible={true}>
                      <div className="row g-3 m-2 p-1">
                        <CRow className="mb-md-1">
                           
                            <CCol xs={12} md={3}>
                                <CFormLabel htmlFor="vehicleNumber">
                                    Vehicle Number                                  
                                </CFormLabel>
                                <CFormInput
                                    size="sm"
                                    id="vehicleNumber"
                                    name="vehicleNumber"                                     
                                    maxLength={15}
                                    value={currentInfo.vehicle_no ? currentInfo.vehicle_no : '-'}
                                    readOnly
                                />
                            </CCol>

                            <CCol xs={12} md={3}>
                                <CFormLabel htmlFor="shedownerNam">Shed Name</CFormLabel>
                                <CFormInput
                                    type="text"
                                    name="shedownerNam"
                                    size="sm"
                                    id="shedownerNam" 
                                    value={currentInfo && currentInfo.vcr_shed_info ? currentInfo.vcr_shed_info.shed_name : '-'}
                                    readOnly
                                />
                            </CCol>

                            <CCol xs={12} md={3}>
                                <CFormLabel htmlFor="shedownerNam">Shed Owner Name</CFormLabel>
                                <CFormInput
                                    type="text"
                                    name="shedownerNam"
                                    size="sm"
                                    id="shedownerNam" 
                                    value={currentInfo && currentInfo.vcr_shed_info ? currentInfo.vcr_shed_info.shed_owner_name : '-'}
                                    readOnly
                                />
                            </CCol>

                            <CCol xs={12} md={3}>
                                <CFormLabel htmlFor="shedownerMob">Shed Owner Mobile Number</CFormLabel>
                                <CFormInput
                                    type="text"
                                    name="shedownerMob"
                                    size="sm"
                                    id="shedownerMob" 
                                    value={currentInfo && currentInfo.vcr_shed_info ? currentInfo.vcr_shed_info.shed_owner_phone_1 : '-'}
                                    readOnly
                                />
                            </CCol> 

                            <CCol xs={12} md={3}>
                                <CFormLabel htmlFor="vendorName">
                                    Vendor Name as per PAN Card
                                </CFormLabel>
                                <CFormInput
                                    size="sm"
                                    id="vendorName"
                                    name="vendorName"                                   
                                    maxLength={30}
                                    value={currentInfo.vendor_name}
                                    readOnly
                                />
                            </CCol>

                            <CCol xs={12} md={3}>
                                <CFormLabel htmlFor="vendorName2">
                                    Vendor Name 2 
                                </CFormLabel>
                                <CFormInput
                                    size="sm"
                                    id="vendorName2"
                                    name="vendorName2" 
                                    maxLength={50}
                                    value={values.vendorName2}
                                    readOnly
                                />
                            </CCol>

                            <CCol xs={12} md={3}>
                                <CFormLabel htmlFor="vendorMobile">
                                    Vendor Mobile Number
                                </CFormLabel>
                                <CFormInput
                                    size="sm"
                                    id="vendorMobile"
                                    name="vendorMobile" 
                                    maxLength={10}
                                    value={currentInfo.vendor_mobile_no}
                                    readOnly
                                />
                            </CCol>

                            <CCol xs={12} md={3}>
                                <CFormLabel htmlFor="panCardNumber">
                                    PAN Card Number
                                </CFormLabel>
                                <CFormInput
                                    size="sm"
                                    id="panCardNumber"
                                    name="panCardNumber" 
                                    maxLength={10}
                                    value={currentInfo.pan_no}
                                    readOnly
                                />
                            </CCol>
                             
                            <CCol xs={12} md={3}>
                                <CFormLabel htmlFor="aadhar">
                                    Aadhar Card Number 
                                </CFormLabel>
                                <CFormInput
                                    size="sm"
                                    id="aadhar"
                                    name="aadhar" 
                                    maxLength={12}
                                    value={currentInfo.aadhar_card_no ? currentInfo.aadhar_card_no : '-'}
                                    readOnly
                                />
                            </CCol>

                            <CCol xs={12} md={3}>
                                <CFormLabel htmlFor="bankAccount">
                                    Bank Account Number
                                </CFormLabel>
                                <CFormInput
                                    size="sm"
                                    id="bankAccount"
                                    name="bankAccount" 
                                    maxLength={18}
                                    value={currentInfo.bank_acc_no}
                                    readOnly
                                />
                            </CCol>

                            <CCol xs={12} md={3}>
                                <CFormLabel htmlFor="bankAccHolderName">
                                    Bank Account Holder Name 
                                </CFormLabel>
                                <CFormInput
                                    size="sm"
                                    id="bankAccHolderName"
                                    name="bankAccHolderName" 
                                    maxLength={30}
                                    value={currentInfo.bank_acc_holder_name}
                                    readOnly
                                />
                            </CCol>

                            <CCol xs={12} md={3}>
                                <CFormLabel htmlFor="bankName">
                                    Bank Name                                   
                                </CFormLabel>
                                <CFormInput
                                    size="sm"
                                    id="bankAccHolderName"
                                    name="bankAccHolderName" 
                                    maxLength={30}
                                    value={currentInfo.bank_name}
                                    readOnly
                                />
                            </CCol>

                            <CCol xs={12} md={3}>
                                <CFormLabel htmlFor="bankBranch">
                                    Bank Branch Name/Town
                                </CFormLabel>
                                <CFormInput
                                    size="sm"
                                    id="bankBranch"
                                    name="bankBranch" 
                                    maxLength={30}
                                    value={currentInfo.bank_branch}
                                    readOnly
                                />
                            </CCol>

                            <CCol xs={12} md={3}>
                                <CFormLabel htmlFor="ifscCode">
                                    Bank IFSC Code 
                                </CFormLabel>
                                <CFormInput
                                    size="sm"
                                    id="ifscCode"
                                    name="ifscCode" 
                                    maxLength={30}
                                    value={currentInfo.bank_ifsc_code}
                                    readOnly
                                />
                            </CCol>

                            <CCol xs={12} md={3}>
                                <CFormLabel htmlFor="GSTreg">
                                    GST Registration                                   
                                </CFormLabel>
                                <CFormSelect
                                    size="sm"
                                    id="GSTreg"
                                    name="GSTreg"                                    
                                    value={currentInfo.gst_registration_having}
                                    disabled
                                >
                                    <option value={''} hidden selected>
                                    Select...
                                    </option>
                                    <option value="1">Yes</option>
                                    <option value="0">No</option>
                                </CFormSelect>
                            </CCol>

                            {currentInfo.gst_registration_having == 1 && (
                                <CCol xs={12} md={3}>
                                    <CFormLabel htmlFor="GSTNumber">
                                        GST Registration Number
                                    </CFormLabel>
                                    <CFormInput
                                        size="sm"
                                        id="GSTNumber" 
                                        name="GSTNumber"
                                        maxLength={15}
                                        value={currentInfo.gst_registration_number}
                                        readOnly
                                    />
                                </CCol>
                            )}

                            <CCol xs={12} md={3}>
                                <CFormLabel htmlFor="TDStax">
                                    TDS Tax Type
                                </CFormLabel>

                                <CFormSelect
                                    size="sm"
                                    id="TDStax"
                                    name="TDStax"
                                    value={currentInfo.tds_tax_code}                                    
                                    disabled
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
                                <CFormLabel htmlFor="payment">
                                    Payment Type 
                                </CFormLabel>

                                <CFormSelect
                                    size="sm"
                                    id="payment"
                                    name="payment"
                                    value={currentInfo.payment_term_type}
                                    disabled
                                >
                                    <option value="0">Select...</option>
                                    {paymentTermType.map(({ definition_list_code, definition_list_name }) => {
                                        return (
                                        <>
                                            <option key={definition_list_code} value={definition_list_code}>
                                                {definition_list_name}
                                            </option>
                                        </>
                                    )})}
                                </CFormSelect>
                            </CCol>

                            <CCol xs={12} md={3}>
                                <CFormLabel htmlFor="street">
                                    Street 
                                </CFormLabel>
                                <CFormInput
                                    size="sm"
                                    id="street"
                                    name="street" 
                                    maxLength={40}
                                    value={currentInfo.street}
                                    readOnly
                                />
                            </CCol>

                            <CCol xs={12} md={3}>
                                <CFormLabel htmlFor="area">
                                    Area
                                </CFormLabel>
                                <CFormInput
                                    size="sm"
                                    id="area"
                                    name="area"
                                    value={currentInfo.area}
                                    readOnly
                                />
                            </CCol>

                            <CCol xs={12} md={3}>
                                <CFormLabel htmlFor="city">
                                    City
                                </CFormLabel>
                                <CFormInput
                                    size="sm"
                                    id="city"
                                    name="city" 
                                    maxLength={30}
                                    value={currentInfo.city}
                                    readOnly
                                />
                            </CCol>

                            <CCol xs={12} md={3}>
                                <CFormLabel htmlFor="district">
                                    District
                                </CFormLabel>
                                <CFormInput
                                    size="sm"
                                    id="district"
                                    name="district" 
                                    value={currentInfo.district}
                                    readOnly
                                />
                            </CCol>

                            <CCol xs={12} md={3}>
                                <CFormLabel htmlFor="state">
                                    State
                                </CFormLabel>
                                <CFormInput
                                    size="sm"
                                    id="district"
                                    name="district" 
                                    value={currentInfo.state}
                                    readOnly
                                />
                            </CCol> 

                            {/* <CCol xs={12} md={3}>
                                <CFormLabel htmlFor="region">
                                    Region
                                </CFormLabel>

                                <CFormInput
                                    size="sm"
                                    id="region"
                                    name="region"
                                    maxLength={2}
                                    value={currentInfo.region}
                                    readOnly
                                />
                            </CCol> */}

                            <CCol xs={12} md={3}>
                                <CFormLabel htmlFor="postalCode">
                                    Postal Code
                                </CFormLabel>
                                <CFormInput
                                    size="sm"
                                    id="postalCode"
                                    name="postalCode"
                                    maxLength={6}
                                    value={currentInfo.postal_code}
                                    readOnly
                                />
                            </CCol>

                            <CCol md={3}>
                                <CFormLabel htmlFor="panCopy">
                                    PAN Card Copy
                                </CFormLabel>                                
                                <CButton className="w-100 m-0" color="info" size="sm" id="inputAddress">
                                    <span className="float-start">
                                        <i
                                            className="fa fa-eye"
                                            onClick={() => setPanCopyVal(true)}
                                            aria-hidden="true"
                                        ></i>{' '}
                                        &nbsp;View
                                    </span>                                     
                                </CButton>                                
                            </CCol>

                            <CCol md={3}>
                                <CFormLabel htmlFor="lcFront">
                                    Aadhar Card Copy  
                                </CFormLabel>                                
                                <CButton className="w-100 m-0" color="info" size="sm" id="inputAddress">
                                    <span className="float-start">
                                        <i
                                        className="fa fa-eye"
                                        onClick={() => setAadharCopyVal(true)}
                                        aria-hidden="true"
                                        ></i>{' '}
                                        &nbsp;View
                                    </span>
                                </CButton>                               
                            </CCol>

                            <CCol md={3}>
                                <CFormLabel htmlFor="bankPassbookCopy">
                                    Bank Passbook Copy 
                                </CFormLabel>                                 
                                <CButton className="w-100 m-0" color="info" size="sm" id="inputAddress">
                                    <span className="float-start">
                                        <i
                                        className="fa fa-eye"
                                        onClick={() => setBankCopyVal(true)}
                                        aria-hidden="true"
                                        ></i>{' '}
                                        &nbsp;View
                                    </span>                                     
                                </CButton>                                 
                            </CCol>

                            <CCol md={3}>
                                <CFormLabel htmlFor="lcFront">
                                    TDS Declaration Copy 
                                </CFormLabel>                               
                                <CButton className="w-100 m-0" color="info" size="sm" id="inputAddress">
                                    <span className="float-start">
                                        <i
                                        className="fa fa-eye"
                                        onClick={() => setTdsCopyVal(true)}
                                        aria-hidden="true"
                                        ></i>{' '}
                                        &nbsp;View
                                    </span>                                      
                                </CButton>
                            </CCol>

                            <CCol xs={12} md={3}>
                                <CFormLabel htmlFor="remarks">
                                    Remarks
                                    {errors.remarks && <span className="small text-danger">{errors.remarks}</span>}
                                </CFormLabel>
                                <CFormInput
                                    size="sm"
                                    id="remarks"
                                    name="remarks"
                                    value={values.remarks ? values.remarks : ''}
                                    onFocus={onFocus}
                                    onBlur={onBlur}
                                    onChange={handleChange}
                                />
                            </CCol>
  
                        </CRow>                       
  
                        <CRow className="mb-md-1">
                          <CCol
                            className="pull-right"
                            xs={12}
                            sm={12}
                            md={12}
                            style={{ display: 'flex', justifyContent: 'flex-end' }}
                          >
                            {/* <CButton
                                size="s-lg"
                                color="warning"
                                className="mx-1 px-2 text-white"
                                onClick={(e) => {
                                    setFetch(false) 
                                    getPanData(e)
                                }}
                                disabled={errors.panCardNumber || values.panCardNumber == ''}
                            >
                              SAP Vendor Check
                            </CButton> */}
                            <CButton
                              size="s-lg"
                              color="warning"
                              className="mx-1 px-2 text-white" 
                              onClick={() => setConfirmBtn(true)}
                              disabled={acceptBtn}
                            >
                              Confirm
                            </CButton>                         
                             
                            <CButton
                                size="s-lg"
                                color="danger"
                                className="mx-1 px-2 text-white"
                                onClick={() => VendorValidation(0)}
                                type="button"
                            >
                                Reject
                            </CButton>
                             
                            <Link to={'/FCIVendorCreationConfirmationHome'}>
                              <CButton
                                size="s-lg"
                                color="warning"
                                className="mx-1 px-2 text-white"
                                type="button"
                              >
                                Back
                              </CButton>
                            </Link>
                          </CCol>
                        </CRow>
                      </div>
                    </CTabPane>
                  </CTabContent>
                  {/*Pan copy*/}
                    <CModal visible={panCopyVal} onClose={() => setPanCopyVal(false)}>
                    <CModalHeader>
                        <CModalTitle>Pan Card Copy</CModalTitle>
                    </CModalHeader>
                    {currentInfo.pan_card_copy && currentInfo.pan_card_copy.includes('.pdf') ? (
                        <iframe
                            orientation="top"
                            height={500}
                            width={475}
                            src={currentInfo.pan_card_copy}
                        >                                
                        </iframe>
                        ) : (
                            <CCardImage orientation="top"  src={currentInfo.pan_card_copy ? currentInfo.pan_card_copy : noimage_logo} />
                        )
                    }
                    {/* <CModalBody>
                        <CCardImage orientation="top" src={currentInfo.pan_card_copy ? currentInfo.pan_card_copy : noimage_logo} />
                    </CModalBody> */}
                    <CModalFooter>
                        <CButton color="secondary" onClick={() => setPanCopyVal(false)}>
                        Close
                        </CButton>
                    </CModalFooter>
                    </CModal>
                  {/*Pan copy*/}
                  {/*Aadhar copy*/}
                  <CModal visible={aadharCopyVal} onClose={() => setAadharCopyVal(false)}>
                    <CModalHeader>
                        <CModalTitle>Aadhar Card Copy</CModalTitle>
                    </CModalHeader>
                    {currentInfo.aadhar_card_copy && currentInfo.aadhar_card_copy.includes('.pdf') ? (
                        <iframe
                            orientation="top"
                            height={500}
                            width={475}
                            src={currentInfo.aadhar_card_copy}
                        >                                
                        </iframe>
                        ) : (
                            <CCardImage orientation="top"  src={currentInfo.aadhar_card_copy ? currentInfo.aadhar_card_copy : noimage_logo} />
                        )
                    }
                    {/* <CModalBody>
                        <CCardImage orientation="top" src={currentInfo.aadhar_card_copy ? currentInfo.aadhar_card_copy : noimage_logo} />
                    </CModalBody> */}
                    <CModalFooter>
                        <CButton color="secondary" onClick={() => setAadharCopyVal(false)}>
                        Close
                        </CButton>
                    </CModalFooter>
                    </CModal>
                  {/*Aadhar copy*/}
                  {/*Bank Passbook copy*/}
                  <CModal visible={bankCopyVal} onClose={() => setBankCopyVal(false)}>
                    <CModalHeader>
                        <CModalTitle>Bank Passbook Card Copy</CModalTitle>
                    </CModalHeader>
                    {currentInfo.bank_passbook_copy && currentInfo.bank_passbook_copy.includes('.pdf') ? (
                        <iframe
                            orientation="top"
                            height={500}
                            width={475}
                            src={currentInfo.bank_passbook_copy}
                        >                                
                        </iframe>
                        ) : (
                            <CCardImage orientation="top"  src={currentInfo.bank_passbook_copy ? currentInfo.bank_passbook_copy : noimage_logo} />
                        )
                    }
                    {/* <CModalBody>
                        <CCardImage orientation="top" src={currentInfo.bank_passbook_copy ? currentInfo.bank_passbook_copy : noimage_logo} />
                    </CModalBody> */}
                    <CModalFooter>
                        <CButton color="secondary" onClick={() => setBankCopyVal(false)}>
                        Close
                        </CButton>
                    </CModalFooter>
                    </CModal>
                  {/*Bank Passbook copy*/}
                  {/*Tds copy*/}
                  <CModal visible={tdsCopyVal} onClose={() => setTdsCopyVal(false)}>
                    <CModalHeader>
                        <CModalTitle>TDS Declaration Form Copy</CModalTitle>
                    </CModalHeader>
                    {currentInfo.tds_declaration_copy && currentInfo.tds_declaration_copy.includes('.pdf') ? (
                        <iframe
                            orientation="top"
                            height={500}
                            width={475}
                            src={currentInfo.tds_declaration_copy}
                        >                                
                        </iframe>
                        ) : (
                            <CCardImage orientation="top"  src={currentInfo.tds_declaration_copy ? currentInfo.tds_declaration_copy : noimage_logo} />
                        )
                    }
                    {/* <CModalBody>
                        <CCardImage orientation="top" src={currentInfo.tds_declaration_copy ? currentInfo.tds_declaration_copy : noimage_logo} />
                    </CModalBody> */}
                    <CModalFooter>
                        <CButton color="secondary" onClick={() => setTdsCopyVal(false)}>
                        Close
                        </CButton>
                    </CModalFooter>
                    </CModal>
                  {/*Tds copy*/}
                  {/* ======================= Confirm Button Modal Area ========================== */}

                    <CModal visible={confirmBtn} onClose={() => setConfirmBtn(false)}>
                        <CModalBody>
                        <p className="lead">Do You Want To Confirm and Upload This FCI Vendor Details To SAP ?</p>
                        </CModalBody>
                        <CModalFooter>
                        <CButton
                            className="m-2"
                            color="warning"
                            onClick={() => {
                            createVendor()
                            setFetch(false)
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
                </CCard>
              </>) : (<AccessDeniedComponent />
            )}
          </>
        )}
      </>
    )
  }
  export default FCIVendorCreationConfirmation
  