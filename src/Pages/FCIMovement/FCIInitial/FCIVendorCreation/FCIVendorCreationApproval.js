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

const FCIVendorCreationApproval = () => {
    
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
    let page_no = LogisticsProScreenNumberConstants.FCIVCModule.FCI_Vendor_Approval
  
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
    const [panCopyValDel, setPanCopyValDel] = useState(true)
    const [aadharCopyVal, setAadharCopyVal] = useState(false)
    const [aadharCopyValDel, setAadharCopyValDel] = useState(true)
    const [bankCopyVal, setBankCopyVal] = useState(false)
    const [bankCopyValDel, setBankCopyValDel] = useState(true)
    const [tdsCopyVal, setTdsCopyVal] = useState(false)
    const [tdsCopyValDel, setTdsCopyValDel] = useState(true)

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
  
    const customElement = (vk) => {
        let limn = ''
        let kk = 0
          limn = limn +
            `<tr style="border: 1px solid black" key=${kk+1}>
                <th style="width:5%">${kk+1}</td>
                <th style="width:40%">Vendor Code</th>
                <th style="width:55%">${vk.LIFNR ? vk.LIFNR : '-'}</td>
            </tr>
            <tr style="border: 1px solid black" key=${kk+2}>
                <th style="width:5%">${kk+2}</td>
                <th style="width:40%">Vendor Name</th>
                <th style="width:55%">${vk.NAME1 ? vk.NAME1 : '-'}</td>
            </tr>
            <tr style="border: 1px solid black" key=${kk+3}>
                <th style="width:5%">${kk+3}</td>
                <th style="width:40%">Mobile No.</th>
                <th style="width:55%">${vk.TELF1 ? vk.TELF1 : '-'}</td> 
            </tr>
            <tr style="border: 1px solid black" key=${kk+4}>
                <th style="width:5%">${kk+4}</td>
                <th style="width:40%">Aadhar No.</th>
                <th style="width:55%">${vk.IDNUMBER ? vk.IDNUMBER : '-'}</td> 
            </tr>
            <tr style="border: 1px solid black" key=${kk+5}>
                <th style="width:5%">${kk+5}</td>
                <th style="width:40%">TDS TAX TYPE</th>
                <th style="width:55%">${vk.WITHT ? vk.WITHT : ''}</td> 
            </tr>
            <tr style="border: 1px solid black" key=${kk+6}>
                <th style="width:5%">${kk+6}</td>
                <th style="width:40%">Bank Account No.</th>
                <th style="width:55%">${vk.BANKN ? vk.BANKN : '-'}</td> 
            </tr>
            <tr style="border: 1px solid black" key=${kk+7}>
                <th style="width:5%">${kk+7}</td>
                <th style="width:40%">PAN Card No.</th>
                <th style="width:55%">${vk.J_1IPANNO ? vk.J_1IPANNO : '-'}</td> 
            </tr>`
        // })
        return limn
      }

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
        
        if(values.panCopy && values.panCopy.size > 5000000){
            toast.warning('PAN Card Copy - File size is too Big, Please select a file less than 5mb')
            return false
        }

        if(values.aadharCopy && values.aadharCopy.size > 5000000){
            toast.warning('Aadhar Card Copy - File size is too Big, Please select a file less than 5mb')
            return false
        }

        if(values.bankPassbookCopy && values.bankPassbookCopy.size > 5000000){
            toast.warning('Bank Passbook Copy - File size is too Big, Please select a file less than 5mb')
            return false
        }

        if(values.tdsCopy && values.tdsCopy.size > 5000000){
            toast.warning('TDS Declaration Copy - File size is too Big, Please select a file less than 5mb')
            return false
        }

        if(statusCode == 0 && values.remarks.trim() == ''){
            toast.warning('Remarks should be filled while Rejection..')
            return false
        }

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
                    navigation('/FCIVendorCreationApprovalHome')
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

    const getPanData = (e) => {
        e.preventDefault()
        PanDataService.getPanData(values.panCardNumber).then((res) => {
            console.log(res,'getPanData')
            let sap_response = res.data[0]
            setFetch(true) 
            if (res.status == 200 && res.data != '') {            
                // toast.success('Pan Details Detected!')
                Swal.fire({
                    title: `Pan Number Details Detected!`,
                    icon: "success",
                    width: "40em",
                    html: `<table style="height: fit-content" id="table" border=1>
                            <tbody>
                              ${customElement(sap_response)}
                            </tbody>
                          </table>`,
                    confirmButtonText: "OK",
                  }).then(function () {
                        //
                  });
            } else {
                toast.warning('No Pan Details Detected..') 
            }
        })
        .catch((error) => {
            setFetch(true) 
            Swal.fire({
              title: 'Server Connection Failed. Kindly contact Server Admin.!', 
              text:  error.message,
              icon: "warning",
              confirmButtonText: "OK",
            }).then(function () {
              // window.location.reload(false)
            })  
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
                                <CFormLabel htmlFor="panCardNumber">
                                    PAN Card Number <REQ />{' '}
                                    {errors.panCardNumber && <span className="small text-danger">{errors.panCardNumber}</span>}
                                </CFormLabel>
                                <CFormInput
                                    size="sm"
                                    id="panCardNumber"
                                    name="panCardNumber"
                                    className={`${errors.panCardNumber && 'is-invalid'}`}
                                    maxLength={10}
                                    value={values.panCardNumber}
                                    onFocus={onFocus}
                                    onBlur={onBlur}
                                    onChange={handleChange}
                                />
                            </CCol>

                            <CCol xs={12} md={3}>
                                <CFormLabel htmlFor="vendorName">
                                    Vendor Name as per PAN Card <REQ />{' '}
                                    {errors.vendorName && <span className="small text-danger">{errors.vendorName}</span>}
                                </CFormLabel>
                                <CFormInput
                                    size="sm"
                                    id="vendorName"
                                    name="vendorName"
                                    className={`${errors.vendorName && 'is-invalid'}`}
                                    maxLength={30}
                                    value={values.vendorName}
                                    onFocus={onFocus}
                                    onBlur={onBlur}
                                    onChange={handleChange}
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
                                    onFocus={onFocus}
                                    onBlur={onBlur}
                                    onChange={handleChange}
                                />
                            </CCol>

                            <CCol xs={12} md={3}>
                                <CFormLabel htmlFor="vendorMobile">
                                    Vendor Mobile Number <REQ />{' '}
                                    {errors.vendorMobile && <span className="small text-danger">{errors.vendorMobile}</span>}
                                </CFormLabel>
                                <CFormInput
                                    size="sm"
                                    id="vendorMobile"
                                    name="vendorMobile"
                                    className={`${errors.vendorMobile && 'is-invalid'}`}
                                    maxLength={10}
                                    value={values.vendorMobile}
                                    onFocus={onFocus}
                                    onBlur={onBlur}
                                    onChange={handleChange}
                                />
                            </CCol>                            
                             
                            <CCol xs={12} md={3}>
                                <CFormLabel htmlFor="aadhar">
                                Aadhar Card Number  
                                    {/* {errors.aadhar && <span className="small text-danger">{errors.aadhar}</span>} */}
                                </CFormLabel>
                                <CFormInput
                                    size="sm"
                                    id="aadhar"
                                    name="aadhar"
                                    // className={`${errors.aadhar && 'is-invalid'}`}
                                    maxLength={12}
                                    value={values.aadhar}
                                    onFocus={onFocus}
                                    onBlur={onBlur}
                                    onChange={handleChange}
                                />
                            </CCol>

                            <CCol xs={12} md={3}>
                                <CFormLabel htmlFor="vehicleNumber">
                                    Vehicle Number  
                                    {/* {errors.vehicleNumber && <span className="small text-danger">{errors.vehicleNumber}</span>} */}
                                </CFormLabel>
                                <CFormInput
                                    size="sm"
                                    id="vehicleNumber"
                                    name="vehicleNumber"
                                    // className={`${errors.vehicleNumber && 'is-invalid'}`}
                                    maxLength={15}
                                    value={values.vehicleNumber}
                                    onFocus={onFocus}
                                    onBlur={onBlur}
                                    onChange={handleChange}
                                />
                            </CCol>

                            {/* <CCol xs={12} md={3}>
                                <CFormLabel htmlFor="shedName">
                                    Shed Name <REQ />{' '}
                                    {!shed_Name1 && (
                                        <span className="small text-danger">Required</span>
                                    )}
                                </CFormLabel>
                                <ShedListSearchSelect
                                    size="sm"
                                    className="mb-1"
                                    onChange={(e) => {
                                        onChange(e)
                                    }}
                                    label="shedName"
                                    id="shedName"
                                    name="shedName"
                                    onFocus={onFocus}
                                    value={values.shedName} 
                                    onBlur={onBlur}
                                    search_type="shed_name"
                                />
                            </CCol>   */}

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
                                <CFormLabel htmlFor="bankAccHolderName">
                                    Bank Account Holder Name <REQ />{' '}
                                    {errors.bankAccHolderName && <span className="small text-danger">{errors.bankAccHolderName}</span>}
                                </CFormLabel>
                                <CFormInput
                                    size="sm"
                                    id="bankAccHolderName"
                                    name="bankAccHolderName"
                                    className={`${errors.bankAccHolderName && 'is-invalid'}`}
                                    maxLength={30}
                                    value={values.bankAccHolderName}
                                    onFocus={onFocus}
                                    onBlur={onBlur}
                                    onChange={handleChange}
                                />
                            </CCol>

                            <CCol xs={12} md={3}>
                                <CFormLabel htmlFor="bankAccount">
                                Bank Account Number <REQ />{' '}
                                    {errors.bankAccount && <span className="small text-danger">{errors.bankAccount}</span>}
                                </CFormLabel>
                                <CFormInput
                                    size="sm"
                                    id="bankAccount"
                                    name="bankAccount"
                                    className={`${errors.bankAccount && 'is-invalid'}`}
                                    maxLength={18}
                                    value={values.bankAccount}
                                    onFocus={onFocus}
                                    onBlur={onBlur}
                                    onChange={handleChange}
                                />
                            </CCol> 

                            <CCol xs={12} md={3}>
                                <CFormLabel htmlFor="ifscCode">
                                    Bank IFSC Code <REQ />{' '}
                                    {errors.ifscCode && <span className="small text-danger">{errors.ifscCode}</span>}
                                </CFormLabel>
                                <CFormInput
                                    size="sm"
                                    id="ifscCode"
                                    name="ifscCode"
                                    className={`${errors.ifscCode && 'is-invalid'}`}
                                    maxLength={30}
                                    value={values.ifscCode}
                                    onFocus={onFocus}
                                    onBlur={onBlur}
                                    onChange={handleChange}
                                />
                            </CCol>                           

                            <CCol xs={12} md={3}>
                                <CFormLabel htmlFor="bankName">
                                    Bank Name
                                    <REQ />{' '}
                                    {errors.bankName && (
                                    <span className="small text-danger">{errors.bankName}</span>
                                    )}
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
                                        }
                                    )}
                                </CFormSelect>
                            </CCol>

                            <CCol xs={12} md={3}>
                                <CFormLabel htmlFor="bankBranch">
                                    Bank Branch Name/Town<REQ />{' '}
                                    {errors.bankBranch && <span className="small text-danger">{errors.bankBranch}</span>}
                                </CFormLabel>
                                <CFormInput
                                    size="sm"
                                    id="bankBranch"
                                    name="bankBranch"
                                    className={`${errors.bankBranch && 'is-invalid'}`}
                                    maxLength={30}
                                    value={values.bankBranch}
                                    onFocus={onFocus}
                                    onBlur={onBlur}
                                    onChange={handleChange}
                                />
                            </CCol>                            

                            <CCol xs={12} md={3}>
                                <CFormLabel htmlFor="GSTreg">
                                    GST Registration
                                    <REQ />{' '}
                                    {errors.GSTreg && <span className="small text-danger">{errors.GSTreg}</span>}
                                </CFormLabel>
                                <CFormSelect
                                    size="sm"
                                    id="GSTreg"
                                    name="GSTreg"
                                    onFocus={onFocus}
                                    onBlur={onBlur}
                                    onChange={handleChange}
                                    value={values.GSTreg}
                                    className={`${errors.GSTreg && 'is-invalid'}`}
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
                                    <CFormLabel htmlFor="GSTNumber">
                                    GST Registration Number
                                    <REQ />{' '}
                                    {errors.GSTNumber && (
                                        <span className="small text-danger">{errors.GSTNumber}</span>
                                    )}
                                    </CFormLabel>
                                    <CFormInput
                                    size="sm"
                                    id="GSTNumber"
                                    className={`${errors.GSTNumber && 'is-invalid'}`}
                                    name="GSTNumber"
                                    maxLength={15}
                                    onFocus={onFocus}
                                    onBlur={onBlur}
                                    onChange={handleChange}
                                    value={values.GSTNumber}
                                    />
                                </CCol>
                            )}

                            <CCol xs={12} md={3}>
                                <CFormLabel htmlFor="TDStax">
                                    TDS Tax Type
                                    <REQ />{' '}
                                    {errors.TDStax && <span className="small text-danger">{errors.TDStax}</span>}
                                </CFormLabel>

                                <CFormSelect
                                    size="sm"
                                    id="TDStax"
                                    name="TDStax"
                                    value={values.TDStax}
                                    onFocus={onFocus}
                                    onBlur={onBlur}
                                    onChange={handleChange}
                                    className={`${errors.TDStax && 'is-invalid'}`}
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
                                <CFormLabel htmlFor="payment">
                                    Payment Type <REQ />{' '}
                                    {errors.payment && <span className="small text-danger">{errors.payment}</span>}
                                </CFormLabel>

                                <CFormSelect
                                    size="sm"
                                    id="payment"
                                    name="payment"
                                    value={values.payment}
                                    onFocus={onFocus}
                                    onBlur={onBlur}
                                    onChange={handleChange}
                                    className={`${errors.payment && 'is-invalid'}`}
                                    aria-label="Small select example"
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
                                    Street <REQ />{' '}
                                    {errors.street && <span className="small text-danger">{errors.street}</span>}
                                </CFormLabel>
                                <CFormInput
                                    size="sm"
                                    id="street"
                                    name="street"
                                    className={`${errors.street && 'is-invalid'}`}
                                    maxLength={40}
                                    value={values.street}
                                    onFocus={onFocus}
                                    onBlur={onBlur}
                                    onChange={handleChange}
                                />
                            </CCol>

                            <CCol xs={12} md={3}>
                                <CFormLabel htmlFor="area">
                                    Area
                                    <REQ /> {errors.area && <span className="small text-danger">{errors.area}</span>}
                                </CFormLabel>
                                <CFormInput
                                    size="sm"
                                    id="area"
                                    name="area"
                                    className={`${errors.area && 'is-invalid'}`}
                                    value={values.area}
                                    onFocus={onFocus}
                                    onBlur={onBlur}
                                    onChange={handleChange}
                                />
                            </CCol>

                            <CCol xs={12} md={3}>
                                <CFormLabel htmlFor="city">
                                    City
                                    <REQ /> {errors.city && <span className="small text-danger">{errors.city}</span>}
                                </CFormLabel>
                                <CFormInput
                                    size="sm"
                                    id="city"
                                    name="city"
                                    className={`${errors.city && 'is-invalid'}`}
                                    maxLength={30}
                                    value={values.city}
                                    onFocus={onFocus}
                                    onBlur={onBlur}
                                    onChange={handleChange}
                                />
                            </CCol>

                            <CCol xs={12} md={3}>
                                <CFormLabel htmlFor="district">
                                    District
                                    <REQ />{' '}
                                    {errors.district && (
                                    <span className="small text-danger">{errors.district}</span>
                                    )}
                                </CFormLabel>

                                <CFormInput
                                    size="sm"
                                    id="district"
                                    name="district"
                                    className={`${errors.district && 'is-invalid'}`}
                                    value={values.district}
                                    onFocus={onFocus}
                                    onBlur={onBlur}
                                    onChange={handleChange}
                                />
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
                                    size="sm"
                                    id="postalCode"
                                    name="postalCode"
                                    maxLength={6}
                                    className={`${errors.postalCode && 'is-invalid'}`}
                                    value={values.postalCode}
                                    onFocus={onFocus}
                                    onBlur={onBlur}
                                    onChange={handleChange}
                                />
                            </CCol>

                            <CCol xs={12} md={3}>
                                <CFormLabel htmlFor="state">
                                    State
                                    <REQ />{' '}
                                    {errors.state && <span className="small text-danger">{errors.state}</span>}
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
                                <CFormLabel htmlFor="region">
                                    Region
                                    {/* {errors.region && <span className="small text-danger">{errors.region}</span>} */}
                                </CFormLabel>

                                <CFormInput
                                    size="sm"
                                    id="region"
                                    name="region"
                                    maxLength={2}
                                    value={values.state.substring(0, 2)}
                                    placeholder="Select State"
                                    onFocus={onFocus}
                                    onBlur={onBlur}
                                    onChange={handleChange}
                                    readOnly
                                />
                            </CCol>                            

                            {/* <CCol md={3}>
                                <CFormLabel htmlFor="panCopy">
                                    PAN Card Copy  
                                    {errors.panCopy && (
                                    <span className="small text-danger">{errors.panCopy}</span>
                                    )}
                                </CFormLabel>
                                <CFormInput
                                    onBlur={onBlur}
                                    onChange={handleChange}
                                    type="file"
                                    required
                                    accept=".jpg,.jpeg,.png,.pdf"
                                    name="panCopy"
                                    size="sm"
                                    id="panCopy"
                                />
                            </CCol> */}

                            <CCol md={3}>
                                <CFormLabel htmlFor="panCopy">
                                    PAN Card Copy
                                    {errors.panCopy && (
                                        <span className="small text-danger">{errors.panCopy}</span>
                                    )}
                                </CFormLabel>
                                {panCopyValDel ? (
                                    <CButton className="w-100 m-0" color="info" size="sm" id="inputAddress">
                                    <span className="float-start">
                                        <i
                                        className="fa fa-eye"
                                        onClick={() => setPanCopyVal(true)}
                                        aria-hidden="true"
                                        ></i>{' '}
                                        &nbsp;View
                                    </span> 
                                    <span className="float-end">
                                        <i
                                        className="fa fa-trash"
                                        aria-hidden="true"
                                        onClick={() => setPanCopyValDel(false)}
                                        ></i>
                                    </span>
                                    </CButton>
                                ) : (
                                    <CFormInput
                                        onBlur={onBlur}
                                        onChange={handleChange}
                                        type="file"
                                        required
                                        accept=".jpg,.jpeg,.png,.pdf"
                                        name="panCopy"
                                        size="sm"
                                        id="panCopy"
                                    />
                                )}
                            </CCol>

                            <CCol md={3}>
                                <CFormLabel htmlFor="lcFront">
                                    Aadhar Card Copy  
                                    {errors.aadharCopy && (
                                    <span className="small text-danger">{errors.aadharCopy}</span>
                                    )}
                                </CFormLabel>
                                {aadharCopyValDel ? (
                                    <CButton className="w-100 m-0" color="info" size="sm" id="inputAddress">
                                    <span className="float-start">
                                        <i
                                        className="fa fa-eye"
                                        onClick={() => setAadharCopyVal(true)}
                                        aria-hidden="true"
                                        ></i>{' '}
                                        &nbsp;View
                                    </span> 
                                    <span className="float-end">
                                        <i
                                        className="fa fa-trash"
                                        aria-hidden="true"
                                        onClick={() => setAadharCopyValDel(false)}
                                        ></i>
                                    </span>
                                    </CButton>
                                ) : (
                                    <CFormInput
                                        onBlur={onBlur}
                                        onChange={handleChange}
                                        type="file"
                                        required
                                        accept=".jpg,.jpeg,.png,.pdf"
                                        name="aadharCopy"
                                        size="sm"
                                        id="aadharCopy"
                                    />
                                )}
                            </CCol>

                            <CCol md={3}>
                                <CFormLabel htmlFor="bankPassbookCopy">
                                    Bank Passbook Copy  
                                    {errors.bankPassbookCopy && (
                                    <span className="small text-danger">{errors.bankPassbookCopy}</span>
                                    )}
                                </CFormLabel>
                                {bankCopyValDel ? (
                                    <CButton className="w-100 m-0" color="info" size="sm" id="inputAddress">
                                    <span className="float-start">
                                        <i
                                        className="fa fa-eye"
                                        onClick={() => setBankCopyVal(true)}
                                        aria-hidden="true"
                                        ></i>{' '}
                                        &nbsp;View
                                    </span> 
                                    <span className="float-end">
                                        <i
                                        className="fa fa-trash"
                                        aria-hidden="true"
                                        onClick={() => setBankCopyValDel(false)}
                                        ></i>
                                    </span>
                                    </CButton>
                                ) : (
                                    <CFormInput
                                        onBlur={onBlur}
                                        onChange={handleChange}
                                        type="file"
                                        required
                                        accept=".jpg,.jpeg,.png,.pdf"
                                        name="bankPassbookCopy"
                                        size="sm"
                                        id="bankPassbookCopy"
                                    />
                                )}
                            </CCol>

                            <CCol md={3}>
                                <CFormLabel htmlFor="lcFront">
                                    TDS Declaration Copy  
                                    {errors.tdsCopy && (
                                    <span className="small text-danger">{errors.tdsCopy}</span>
                                    )}
                                </CFormLabel>
                                {tdsCopyValDel ? (
                                    <CButton className="w-100 m-0" color="info" size="sm" id="inputAddress">
                                    <span className="float-start">
                                        <i
                                        className="fa fa-eye"
                                        onClick={() => setTdsCopyVal(true)}
                                        aria-hidden="true"
                                        ></i>{' '}
                                        &nbsp;View
                                    </span> 
                                    <span className="float-end">
                                        <i
                                        className="fa fa-trash"
                                        aria-hidden="true"
                                        onClick={() => setTdsCopyValDel(false)}
                                        ></i>
                                    </span>
                                    </CButton>
                                ) : (
                                    <CFormInput
                                        onBlur={onBlur}
                                        onChange={handleChange}
                                        type="file"
                                        required
                                        accept=".jpg,.jpeg,.png,.pdf"
                                        name="tdsCopy"
                                        size="sm"
                                        id="tdsCopy"
                                    />
                                )}
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
  
                        <CRow className="mt-2">
                            <CCol xs={12} md={3}>
                                <CButton
                                    size="sm"
                                    color="success"
                                    className="mx-1 px-2 text-white"
                                    onClick={(e) => {
                                        setFetch(false) 
                                        getPanData(e)
                                    }}
                                    disabled={errors.panCardNumber || values.panCardNumber == ''}
                                >
                                SAP Vendor Check
                                </CButton>
                            </CCol>
                          <CCol
                            className="pull-right"
                            xs={12}
                            sm={12}
                            md={9}
                            style={{ display: 'flex', justifyContent: 'flex-end' }}
                          >
                            <Link to={''}>
                                <CButton
                                size="sm"
                                color="warning"
                                className="mx-1 px-2 text-white" 
                                onClick={() => VendorValidation(2)}
                                disabled={acceptBtn}
                                >
                                APPROVE
                                </CButton>                         
                            </Link>
                            <Link to={''}>
                                <CButton
                                    size="sm"
                                    color="danger"
                                    className="mx-1 px-2 text-white"
                                    onClick={() => VendorValidation(0)}
                                    type="button"
                                >
                                    REJECT
                                </CButton>
                            </Link>
                             
                            <Link to={'/FCIVendorCreationApprovalHome'}>
                              <CButton
                                size="sm"
                                color="warning"
                                className="mx-1 px-2 text-white"
                                type="button"
                              >
                                BACK
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
  export default FCIVendorCreationApproval
  