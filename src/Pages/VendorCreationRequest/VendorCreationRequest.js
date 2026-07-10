import {
  CButton,
  CCard,
  CCardImage,
  CCol,
  CAlert,
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
import Webcam from 'react-webcam'
import CIcon from '@coreui/icons-react'
import * as icon from '@coreui/icons'
import FileResizer from 'react-image-file-resizer'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Loader from 'src/components/Loader'
import Swal from 'sweetalert2'
// SERVICES FILE
import VendorCreationService from 'src/Service/VendorCreation/VendorCreationService'
import ShedService from 'src/Service/SmallMaster/Shed/ShedService'
import BankMasterService from 'src/Service/SubMaster/BankMasterService'

// VALIDATIONS FILE
import useForm from 'src/Hooks/useForm.js'
import VendorRequestValidation from 'src/Utils/TransactionPages/VendorCreation/VendorRequestValidation'

import AccessDeniedComponent from 'src/components/commoncomponent/AccessDeniedComponent'
import JavascriptInArrayComponent from 'src/components/commoncomponent/JavascriptInArrayComponent'
import * as LogisticsProScreenNumberConstants from 'src/components/constants/LogisticsProScreenNumberConstants'
import DefinitionsListApi from 'src/Service/Definitions/DefinitionsListApi'
import PanDataService from 'src/Service/SAP/PanDataService'

const VendorCreationRequest = () => {
  const user_info_json = localStorage.getItem('user_info')
  const user_info = JSON.parse(user_info_json)

  /* Get User Id From Local Storage */
  const user_id = user_info.user_id

  /* ==================== Access Part Start ========================*/
  const [screenAccess, setScreenAccess] = useState(false)
  let page_no = LogisticsProScreenNumberConstants.VendorCreationModule.Vendor_Creation_Request

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
  const [rmsto, setRmsto] = useState(false)
  const [currentInfo, setCurrentInfo] = useState({})
  const [shedData, setShedData] = useState({})
  const [bankData, setBankData] = useState([])
  const [TaxType, setTaxType] = useState([])

  const [PanCard, setPanCard] = useState(false)
  const [adharvisible, setAdharVisible] = useState(false)
  const [BankPassbook, setBankPassbook] = useState(false) 
  const [TDSFormFront, setTDSFormFront] = useState(false)
  const [TDSFormBack, setTDSFormBack] = useState(false)

  const [errorModal, setErrorModal] = useState(false)
  const [error, setError] = useState({})

  const [acceptBtn, setAcceptBtn] = useState(true)
  const [rejectBtn, setRejectBtn] = useState(true)

  const [panDel, setPanDel] = useState(false)
  const [adharDel, setAdharDel] = useState(false) 

  const [passBookDel, setPassBookDel] = useState(false)
  const [tdsFrontDel, setTdsFrontDel] = useState(false)
  const [tdsBackDel, setTdsBackDel] = useState(false)
  const [hideFileUpdate, setHideFileUpdate] = useState(true)

  // WEB CAM PHOTO ADD Code Addition Start
  const webcamRef = React.useRef(null)
  const [fileuploaded, setFileuploaded] = useState(false)
  const [camEnable, setCamEnable] = useState(false)
  const [imgSrc, setImgSrc] = React.useState(null)
  const capture = React.useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot()
    setImgSrc(imageSrc)
  }, [webcamRef, setImgSrc])
  const webcamRefPan = React.useRef(null)
  const [fileuploadedPan, setFileuploadedPan] = useState(false)
  const [camEnablePan, setCamEnablePan] = useState(false)
  const [imgSrcPan, setImgSrcPan] = React.useState(null)
  const capturePan = React.useCallback(() => {
    const imageSrcPan = webcamRefPan.current.getScreenshot()
    setImgSrcPan(imageSrcPan)
  }, [webcamRefPan, setImgSrcPan])

  const webcamRefBank = React.useRef(null)
  const [fileuploadedBank, setFileuploadedBank] = useState(false)
  const [camEnableBank, setCamEnableBank] = useState(false)
  const [imgSrcBank, setImgSrcBank] = React.useState(null)
  const captureBank = React.useCallback(() => {
    const imageSrcBank = webcamRefBank.current.getScreenshot()
    setImgSrcBank(imageSrcBank)
  }, [webcamRefBank, setImgSrcBank])

  const webcamRefTDSFront = React.useRef(null)
  const [fileuploadedTDSFront, setFileuploadedTDSFront] = useState(false)
  const [camEnableTDSFront, setCamEnableTDSFront] = useState(false)
  const [imgSrcTDSFront, setImgSrcTDSFront] = React.useState(null)
  const captureTDSFront = React.useCallback(() => {
    const imageSrcTDSFront = webcamRefTDSFront.current.getScreenshot()
    setImgSrcTDSFront(imageSrcTDSFront)
  }, [webcamRefTDSFront, setImgSrcTDSFront])

  const webcamRefTDSBack = React.useRef(null)
  const [fileuploadedTDSBack, setFileuploadedTDSBack] = useState(false)
  const [camEnableTDSBack, setCamEnableTDSBack] = useState(false)
  const [imgSrcTDSBack, setImgSrcTDSBack] = React.useState(null)
  const captureTDSBack = React.useCallback(() => {
    const imageSrcTDSBack = webcamRefTDSBack.current.getScreenshot()
    setImgSrcTDSBack(imageSrcTDSBack)
  }, [webcamRefTDSBack, setImgSrcTDSBack])



  const X = () => <span className="text-danger"> * </span>

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

  //WEB Cam Access
  const dataURLtoFileAadhaar = (dataurl, filename) => {
    var arr = dataurl.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n)
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n)
    }
    return new File([u8arr], filename, { type: mime })
  }
  const dataURLtoFilePan = (dataurl, filename) => {
    var arr = dataurl.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n)
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n)
    }
    return new File([u8arr], filename, { type: mime })
  }

  const dataURLtoFileBank = (dataurl, filename) => {
    var arr = dataurl.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n)
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n)
    }
    return new File([u8arr], filename, { type: mime })
  }

  const dataURLtoFileTDSFront = (dataurl, filename) => {
    var arr = dataurl.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n)
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n)
    }
    return new File([u8arr], filename, { type: mime })
  }

  const dataURLtoFileTDSBack = (dataurl, filename) => {
    var arr = dataurl.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n)
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n)
    }
    return new File([u8arr], filename, { type: mime })
  }

// Pan Copy Image Compress
const resizeFilePan = (file) => new Promise(resolve => {
  FileResizer.imageFileResizer(file, 1000, 1000, 'JPEG', 100, 0,
  uri => {
    resolve(uri);
  }, 'base64' );
})

const imageCompressPan = async (event) => {
  const file = event.target.files[0];
  console.log(file)
  if(file.type == 'application/pdf') {
  if(file.size > 5000000){
    alert('File to Big, please select a file less than 5mb')
    setFileuploadedPan(false)
  } else {
    values.panCopy = file
    setFileuploadedPan(true)
  }
}else{
  const imagePan = await resizeFilePan(file);
  if(file.size > 2000000){ // Condition Set only for compress more than 2mb files
    valueAppendToImagePan(imagePan)
    setFileuploadedPan(true)
  } else {
    values.panCopy = file
    setFileuploadedPan(true)
  }
}
}
// Aadhar Copy Image Compress
const resizeFileAadhaar = (file) => new Promise(resolve => {
  FileResizer.imageFileResizer(file, 1000, 1000, 'JPEG', 100, 0,
  uri => {
    resolve(uri);
  }, 'base64' );
})

const imageCompressAadhaar = async (event) => {
  const file = event.target.files[0];
  console.log(file)
  if(file.type == 'application/pdf') {
  if(file.size > 5000000){
    alert('File to Big, please select a file less than 5mb')
    setFileuploaded(false)
  } else {
    values.aadharCopy = file
    setFileuploaded(true)
  }
}else{
  const imageAadhaar = await resizeFileAadhaar(file);
  if(file.size > 2000000){ // Condition Set only for compress more than 2mb files
    valueAppendToImage(imageAadhaar)
    setFileuploaded(true)
  } else {
    values.aadharCopy = file
    setFileuploaded(true)
  }
}
}
// Bank Pass Book Copy Image Compress
const resizeFileBank = (file) => new Promise(resolve => {
  FileResizer.imageFileResizer(file, 1000, 1000, 'JPEG', 100, 0,
  uri => {
    resolve(uri);
  }, 'base64' );
})

const imageCompressBank = async (event) => {
  const file = event.target.files[0];
  console.log(file)
  if(file.type == 'application/pdf') {
  if(file.size > 5000000){
    alert('File to Big, please select a file less than 5mb')
    setFileuploadedBank(false)
  } else {
    values.bankPass = file
    setFileuploadedBank(true)
  }
}else{
  const imageBank = await resizeFileBank(file);
  if(file.size > 2000000){ // Condition Set only for compress more than 2mb files
    valueAppendToImageBank(imageBank)
    setFileuploadedBank(true)
  } else {
    values.bankPass = file
    setFileuploadedBank(true)
  }
}
}

// TDS Front Copy Image Compress
const resizeFileTSDFront = (file) => new Promise(resolve => {
  FileResizer.imageFileResizer(file, 1000, 1000, 'JPEG', 100, 0,
  uri => {
    resolve(uri);
  }, 'base64' );
})
const imageCompressTDSFront = async (event) => {
  const file = event.target.files[0];
  console.log(file)
  if(file.type == 'application/pdf') {
  if(file.size > 5000000){
    alert('File to Big, please select a file less than 5mb')
    setFileuploadedTDSFront(false)
  } else {
    values.TDSfront = file
    setFileuploadedTDSFront(true)
  }
}else{
  const imageTDSFront = await resizeFileTSDFront(file);
  if(file.size > 2000000){ // Condition Set only for compress more than 2mb files
    valueAppendToImageTDSFront(imageTDSFront)
    setFileuploadedTDSFront(true)
  } else {
    values.TDSfront = file
    setFileuploadedTDSFront(true)
  }
}
}

// TDS Back Copy Image Compress
const resizeFileTSDBack = (file) => new Promise(resolve => {
  FileResizer.imageFileResizer(file, 1000, 1000, 'JPEG', 100, 0,
  uri => {
    resolve(uri);
  }, 'base64' );
})
const imageCompressTDSBack = async (event) => {
  const file = event.target.files[0];
  console.log(file)
  if(file.type == 'application/pdf') {
  if(file.size > 5000000){
    alert('File to Big, please select a file less than 5mb')
    setFileuploadedTDSBack(false)
  } else {
    values.TDSback = file
    setFileuploadedTDSBack(true)
  }
}else{
  const imageTDSBack = await resizeFileTSDBack(file);
  if(file.size > 2000000){ // Condition Set only for compress more than 2mb files
    valueAppendToImageTDSBack(imageTDSBack)
    setFileuploadedTDSBack(true)
  } else {
    values.TDSback = file
    setFileuploadedTDSBack(true)
  }
}
}

const valueAppendToImage = (image) => {
    let file_name = 'dummy' + getRndInteger(100001, 999999) + '.png'
    let file = dataURLtoFileAadhaar(image, file_name)
    console.log(file)
    values.aadharCopy = file
    isTouched.aadharCopy = true
  }

  const valueAppendToImagePan = (image) => {
    let file_namePan = 'dummy' + getRndInteger(100001, 999999) + '.png'
    let filePan = dataURLtoFilePan(image, file_namePan)
    console.log(filePan)
    values.panCopy = filePan
    isTouched.panCopy = true
  }

  const valueAppendToImageBank = (image) => {
    let file_nameBank = 'dummy' + getRndInteger(100001, 999999) + '.png'
    let fileBank = dataURLtoFileBank(image, file_nameBank)
    console.log(fileBank)
    values.bankPass = fileBank
    isTouched.bankPass = true
  }

  const valueAppendToImageTDSFront = (image) => {
    let file_nameTDSF = 'dummy' + getRndInteger(100001, 999999) + '.png'
    let fileTDSF = dataURLtoFileTDSFront(image, file_nameTDSF)
    console.log(fileTDSF)
    values.TDSfront = fileTDSF
    isTouched.TDSfront = true
  }

  const valueAppendToImageTDSBack = (image) => {
    let file_namefileTDSB = 'dummy' + getRndInteger(100001, 999999) + '.png'
    let fileTDSB = dataURLtoFileTDSBack(image, file_namefileTDSB)
    console.log(fileTDSB)
    values.TDSback = fileTDSB
    isTouched.TDSback = true
  }

  // will hold a reference for our real input file
  let inputFile = ''
  // function to trigger our input file click
  const uploadClick = (e) => {
    e.preventDefault()
    inputFile.click()
    return false
  }
  let inputFilePan = ''
  // function to trigger our input file click
  const uploadClickPan = (e) => {
    e.preventDefault()
    inputFilePan.click()
    return false
  }

  let inputFileBank = ''
  // function to trigger our input file click
  const uploadClickBank = (e) => {
    e.preventDefault()
    inputFileBank.click()
    return false
  }

  let inputFileTDSFront = ''
  // function to trigger our input file click
  const uploadClickTDSFront = (e) => {
    e.preventDefault()
    inputFileTDSFront.click()
    return false
  }

  let inputFileTDSBack = ''
  // function to trigger our input file click
  const uploadClickTDSBack = (e) => {
    e.preventDefault()
    inputFileTDSBack.click()
    return false
  }


  const getRndInteger = (min, max) => {
    return Math.floor(Math.random() * (max - min)) + min
  }
  useEffect(() => {
    if (values.aadharCopy) {
      setFileuploaded(true)
      isTouched.aadharCopy = true
    } else {
      setFileuploaded(false)
      isTouched.aadharCopy = false
    }
  }, [values.aadharCopy])

  useEffect(() => {
    if (values.panCopy) {
      setFileuploadedPan(true)
      isTouched.panCopy = true
    } else {
      setFileuploadedPan(false)
      isTouched.panCopy = false
    }
  }, [values.panCopy])

  useEffect(() => {
    if (values.bankPass) {
      setFileuploadedBank(true)
      isTouched.bankPass = true
    } else {
      setFileuploadedBank(false)
      isTouched.bankPass = false
    }
  }, [values.bankPass])

  useEffect(() => {
    if (values.TDSfront) {
      setFileuploadedTDSFront(true)
      isTouched.TDSfront = true
    } else {
      setFileuploadedTDSFront(false)
      isTouched.TDSfront = false
    }
  }, [values.TDSfront])

  useEffect(() => {
    if (values.TDSback) {
      setFileuploadedTDSBack(true)
      isTouched.TDSback = true
    } else {
      setFileuploadedTDSBack(false)
      isTouched.TDSback = false
    }
  }, [values.TDSback])


  //WEB CAM Coding end

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
  const REQ = () => <span className="text-danger"> * </span>

  // Check Attachments Name
  const checkAttachments = (str) => {
    if (str.charAt(str.length - 1) == '/') {
      // console.log('true1')
      return true
    } else {
      // console.log('false1')
      return false
    }
  }

  // GET SINGLE VEHICLE DATA
  useEffect(() => {
    VendorCreationService.getVehicleDocumentInfo(id).then((res) => {
      const resData = res.data.data[0]
      console.log('resData')
      console.log(resData)

      //Set vendor Details
      values.vendorName = resData.vendor_info.owner_name || ''
      values.vendorName2 = resData.vendor_info.owner_name2 || ''
      values.panNumber = resData.vendor_info.pan_card_number || ''
      values.aadhar = resData.vendor_info.aadhar_card_number || ''
      values.bankAccount = resData.vendor_info.bank_acc_number || ''
      values.mobileNumber = resData.vendor_info.owner_number || ''

      ////Set vendor Details for rejected
      values.bankAccHolderName = resData.vendor_info.bank_acc_holder_name || ''
      values.bankName = resData.vendor_info.bank_name || ''
      values.bankBranch = resData.vendor_info.bank_branch || ''
      values.ifscCode = resData.vendor_info.bank_ifsc || ''

      values.GSTreg = resData.vendor_info.gst_registration || ''
      values.GSTNumber = resData.vendor_info.gst_registration_number || ''
      values.GSTtax = resData.vendor_info.gst_tax_code || tdsChangeByPAN(resData.vendor_info.pan_card_number,2)
      values.payment = resData.vendor_info.payment_term_3days || ''

      values.street = resData.vendor_info.street || ''
      values.area = resData.vendor_info.area || ''
      values.city = resData.vendor_info.city || ''
      values.district = resData.vendor_info.district || ''
      values.state = resData.vendor_info.state || ''
      values.postalCode = resData.vendor_info.postal_code || ''
      values.remarks = resData.vendor_info.remarks || ''

      // For RMSTO Attachments
      values.aadharCopy = checkAttachments(resData.aadhar_copy) ? '' : resData.aadhar_copy
      values.panCopy = checkAttachments(resData.pan_copy) ? '' : resData.pan_copy
      values.bankPass = checkAttachments(resData.bank_pass_copy) ? '' : resData.bank_pass_copy
      values.TDSfront = checkAttachments(resData.tds_dec_form_front)
        ? ''
        : resData.tds_dec_form_front
      values.TDSback = checkAttachments(resData.tds_dec_form_back) ? '' : resData.tds_dec_form_back 

      if (!resData.vehicle_inspection_id) {
        console.log('RMSTO YES')
        setRmsto(true)

        if (checkAttachments(resData.pan_copy)) {
          setPanDel(true)
        }

        if (checkAttachments(resData.aadhar_copy)) {
          setAdharDel(true)
        }

        if (checkAttachments(resData.bank_pass_copy)) {
          setPassBookDel(true)
        }

        if (checkAttachments(resData.tds_dec_form_front)) {
          setTdsFrontDel(true)
        }

        if (checkAttachments(resData.tds_dec_form_back)) {
          setTdsBackDel(true)
        } 

      } else {
        console.log('RMSTO NO')
        setRmsto(false)
      }

      ShedData(resData.shed_id)
      GetBankData()
      setCurrentInfo(resData)
      setFetch(true)
    })
  }, [id])

  // ERROR VALIDATIONS
  useEffect(() => {
    var gstRegValidationVal = false
    var rmsto_attachments = false

    if (values.GSTreg == '1') {
      gstRegValidationVal = !errors.GSTNumber && values.GSTNumber
    } else if (values.GSTreg == '0') {
      gstRegValidationVal = true
    }

    console.log('values')
    console.log(values)

    // For RMSTO Attachments
    let aadharValCopy = !errors.aadharCopy && values.aadharCopy
    let panValCopy = !errors.panCopy && values.panCopy
    let passbookVal = !errors.bankPass && values.bankPass 

    let tdsfrontVal = !errors.TDSfront && values.TDSfront
    let tdsbackVal = !errors.TDSback && values.TDSback 

    if (rmsto) {
      rmsto_attachments =
        aadharValCopy &&
        panValCopy &&
        passbookVal && 
        tdsfrontVal &&
        tdsbackVal 
    } else {
      rmsto_attachments = true
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
      aadharVal &&
      mobileVal &&
      rmsto_attachments
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

  const vendorInfoUpdate = (sap_pan_data) => {

    console.log(sap_pan_data,'sap_pan_data') 
    const formData = new FormData() 
    formData.append('vehicle_id', id)
    formData.append('parking_id', currentInfo.parking_id)
    formData.append('vendor_id', currentInfo.vendor_id)
    formData.append('bank_acc_number', sap_pan_data.BANKN)
    formData.append('aadhar_card_no', sap_pan_data.IDNUMBER)
    formData.append('pan_card_number', sap_pan_data.J_1IPANNO)
    formData.append('vendor_code', sap_pan_data.LIFNR)
    formData.append('owner_name', sap_pan_data.NAME1)
    formData.append('owner_name2', sap_pan_data.NAME2)
    formData.append('city', sap_pan_data.CITY)
    formData.append('owner_number', sap_pan_data.TELF1)
    formData.append('gst_tax_code', sap_pan_data.WITHT) 
    formData.append('updated_by', user_id)

    VendorCreationService.updateVendorInfo(formData).then((res) => {
      setFetch(true)
      console.log(res)
      if (res.status == 200) {
        Swal.fire({
          title: "Updated!",
          text: "Vendor Details has been Updated.",
          icon: "success"
        }).then(function () {
          navigation('/VendorCreationHome')
        })
      } else if (res.status == 201) {
        Swal.fire({
          title: res.data.message,
          icon: "warning",
          confirmButtonText: "OK",
        }).then(function () {
            // window.location.reload(false)
        })
      } else {
        Swal.fire({
          title: "Failed!",
          text: "Vendor Details Updation Failed.",
          icon: "warning"
        }).then(function () {
          //
        })
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

  // ADD VENDOR REQUEST DETAILS
  const addVendorRequest = (status) => {
    const formData = new FormData()
    formData.append('_method', 'PUT')
    formData.append('vehicle_id', id) 
    formData.append('parking_id', currentInfo.parking_id)
    formData.append('vendor_id', currentInfo.vendor_info.vendor_id)
    formData.append('vendor_code', currentInfo.vendor_info.vendor_code) 
    formData.append('owner_name', values.vendorName) 
    formData.append('owner_name2', values.vendorName2) 
    formData.append('pan_card_number', values.panNumber || currentInfo.vendor_info.pan_card_number)

    //Aadhar Append For RMSTO Hire
    if (values.aadhar) {
      formData.append('aadhar_card_number', values.aadhar)
    } else {
      formData.append('aadhar_card_number', currentInfo.vendor_info.aadhar_card_number)
    }

    formData.append('bank_name', values.bankName)

    //Bank A/C No Append For RMSTO Hire
    if (values.bankAccount) {
      formData.append('bank_acc_number', values.bankAccount)
    } else {
      formData.append('bank_acc_number', currentInfo.vendor_info.bank_acc_number)
    }

    //Mobile No Append For RMSTO Hire
    if (values.mobileNumber) {
      formData.append('owner_number', values.mobileNumber)
    } else {
      formData.append('owner_number', currentInfo.vendor_info.owner_number)
    }

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
    formData.append('remarks', values.remarks || '')
    formData.append('created_by', user_id)

    //Form Data Upload for Vehicle Documents
    formData.append('pan_copy', values.panCopy)
    formData.append('aadhar_copy', values.aadharCopy)
    formData.append('license_copy', values.licenseCopy)
    formData.append('insurance_copy_front', values.insurance)
    formData.append('bank_pass_copy', values.bankPass)
    formData.append('rc_copy_front', values.rcFront)
    formData.append('rc_copy_back', values.rcBack)
    formData.append('transport_shed_sheet', values.transportShed)
    formData.append('tds_dec_form_front', values.TDSfront)
    formData.append('tds_dec_form_back', values.TDSback)

    console.log(formData)
    console.log(values)

    //Aadhar Validation for RMSTO Hire
    if (values.aadhar) {
      if (!/^[\d]{12}$/.test(values.aadhar)) {
        toast.warning('Aadhar Number Must Have 12 Digit Numeric')
        setTimeout(() => {
          setFetch(true)
        }, 2000)
        return false
      }
    }

    //Bank A/C No Validation for RMSTO Hire
    if (values.bankAccount) {
      if (!/^\d{9,18}$/.test(values.bankAccount)) {
        toast.warning('Bank Account Number Must Have Numeric (9-18 digits)')
        setTimeout(() => {
          setFetch(true)
        }, 2000)
        return false
      }
    }

    VendorCreationService.updateVendorRequestData(id, formData)
      .then((res) => {
        setFetch(true)
        console.log(res)
        if (res.status == 200) {
          if (status == 2) {
            toast.success('Vendor Creation Request Created..!')
            navigation('/VendorCreationHome')
          } else {
            toast.warning('Vendor Creation Request Rejected..!')
            navigation('/VendorCreationHome')
          }
        } else {
          toast.warning('Something Went Wrong !')
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

  const [panGroupData, setPanGroupData] = useState([])
  const [panData, setPanData] = useState([])
  const [vendorCode, setVendorCode] = useState('0')

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
        <tr style="border: 1px solid black" key=${kk+8}>
            <th style="width:5%">${kk+8}</td>
            <th style="width:40%">Vendor Name2</th>
            <th style="width:55%">${vk.NAME2 ? vk.NAME2 : '-'}</td>
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
            <th style="width:40%">Tds Tax Type</th>
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
        </tr>
        <tr style="border: 1px solid black" key=${kk+9}>
            <th style="width:5%">${kk+9}</td>
            <th style="width:40%">City</th>
            <th style="width:55%">${vk.CITY ? vk.CITY : '-'}</td>
        </tr>`
    // })
    return limn
  }

  const getPanData = (e) => {
    e.preventDefault()
    console.log(values.panNumber,'panNumbernew')
    
    console.log(panGroupData,'panGroupData')
    console.log(errors.panNumber,'errors.panNumber')
    console.log(values.panNumber,'values.panNumber')

    if (!values.panNumber || values.panNumber == '') {
      setFetch(true)
      toast.warning('Pan Number Required')
      return false
    }

    if (!/^[A-Z]{5}[\d]{4}[A-Z]{1}$/.test(values.panNumber)) {
      setFetch(true)
      toast.warning('PAN NUMBER Must Like "CRCPK0712L"')
      return false
    }
    // PanDataService.getPanData(values.panNumber).then((res) => {
    PanDataService.getMultiVendorInfoByPan(values.panNumber).then((res) => {
        console.log(res,'getPanData')
        // let sap_response = res.data[0]
        setFetch(true) 
        if (res.status == 200 && res.data != '') {            
            // toast.success('Pan Details Detected!')
            setPanGroupData(res.data)
            // Swal.fire({
            //   // title: "Are you sure?",
            //   text: "You won't be able to revert this!",
            //   // icon: "warning",
            //   title: `Pan Number Details Detected!`,
            //   icon: "success",
            //   width: "40em",
            //   showCancelButton: true,
            //   confirmButtonColor: "#3085d6",
            //   cancelButtonColor: "#d33",
            //   html: `<table style="height: fit-content" id="table" border=1>
            //           <tbody>
            //             ${customElement(sap_response)}
            //           </tbody>
            //         </table>`,
            //   confirmButtonText: "Vendor Update",
            //   cancelButtonText: "Cancel",
            // }).then((result)=> {
                     
            //     if (result.isConfirmed) {
            //       setFetch(false)
            //       vendorInfoUpdate(sap_response)
            //     }  
            // });
        } else {
          setPanGroupData([])
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

  const getPanChildData = (e) => {
    e.preventDefault()
    let res = e.target.value
    setVendorCode(res)

    panGroupData.map((vv,kk)=>{
      if(vv.LIFNR == res){
        console.log(vv,'getPanChildData')
        setPanData(vv)

        Swal.fire({
          // title: "Are you sure?",
          text: "You won't be able to revert this!",
          // icon: "warning",
          title: `Pan Number Details Detected!`,
          icon: "success",
          width: "40em",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          html: `<table style="height: fit-content" id="table" border=1>
                  <tbody>
                    ${customElement(vv)}
                  </tbody>
                </table>`,
          confirmButtonText: "Vendor Update",
          cancelButtonText: "Cancel",
        }).then((result)=> {
                  
            if (result.isConfirmed) {
              setFetch(false)
              vendorInfoUpdate(vv)
            }  
        });
        // setTDS(vv.WITHT)
        // setErrorsTdsType('')
      }
    })
    if(res == 0){
      // setErrorsTdsType('Required')
      // setTDS('0')
      setPanData({})
    }
  }

  const tdsSetValue = (vall) => {
    console.log(vall,'tdsSetValue')
    if(vall == 'P' || vall == 'H'){
      return 'T7'
    } else{
      return 'T2'
    }
  }

  const [tdsChangePAN,setTdsChangePAN] = useState(false)
  const [tdsChangePANValue,setTdsChangePANValue] = useState('')

  useEffect(()=>{
    console.log('111111EST')
    if(tdsChangePAN){
      console.log('222222EST')
      console.log(errors,'errorsEST')
      if(errors.panNumber){
        values.GSTtax = ''
        console.log('333333EST')
      } else {
        console.log('444444EST')
        values.GSTtax = tdsChangePANValue
      }

      console.log(values.GSTtax,'666666EST')
    }

    if(!(errors.panNumber == undefined || errors.panNumber == '')){
      setPanGroupData([])
      setPanData({})  
    }

  },[tdsChangePAN,values.GSTtax,errors.panNumber])

  const tdsChangeByPAN = (ev,type) => {
    if(type == 1){
      let val = ev.target.value
      // isTouched.GSTtax = true
      console.log(val,'tdsChangeByPAN1')
      let pan_4th_digit = val.substr(3,1)
      console.log(pan_4th_digit,'pan_4th_digit1')
      let tds_val = tdsSetValue(pan_4th_digit)
      console.log(tds_val,'tds_val1')
      values.GSTtax = tds_val
      setTdsChangePANValue(tds_val)
      setTdsChangePAN(true)      
    } else {
      console.log(ev,'tdsChangeByPAN2')
      let pan_4th_digit = ev.substr(3,1)
      console.log(pan_4th_digit,'pan_4th_digit2')
      let tds_val = tdsSetValue(pan_4th_digit)
      console.log(tds_val,'tds_val2')
      return tds_val
    }
    
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
                      className={`${errors.shedownerMob && 'is-invalid'}`}
                      name="shedownerMob"
                      value={fetch ? shedData.shed_owner_phone_1 : ''}
                      onFocus={onFocus}
                      onBlur={onBlur}
                      onChange={handleChange}
                      readOnly
                    />
                  </CCol>

                  <CCol xs={12} md={3}>
                    <CFormLabel htmlFor="vendorName">
                      Vendor Name
                      <X />{' '}
                      {errors.vendorName && (
                        <span className="small text-danger"> {errors.vendorName} </span>
                      )}
                    </CFormLabel>
                    <CFormInput
                      type="text"
                      name="vendorName"
                      size="sm"
                      id="vendorName"
                      maxLength={20}
                      className={`${errors.vendorName && 'is-invalid'}`} 
                      value={values.vendorName}
                      onFocus={onFocus}
                      onBlur={onBlur}
                      onChange={handleChange}
                    />
                  </CCol>

                  <CCol xs={12} md={3}>
                    <CFormLabel htmlFor="vendorName2">
                      Vendor Name2
                      {/* <X />{' '}
                      {errors.vendorName && (
                        <span className="small text-danger"> {errors.vendorName} </span>
                      )} */}
                    </CFormLabel>
                    <CFormInput
                      type="text"
                      name="vendorName2"
                      size="sm"
                      id="vendorName2"
                      maxLength={50}
                      // className={`${errors.vendorName && 'is-invalid'}`} 
                      value={values.vendorName2}
                      onFocus={onFocus}
                      onBlur={onBlur}
                      onChange={handleChange}
                    />
                  </CCol>

                  <CCol xs={12} md={3}>
                    <CFormLabel htmlFor="panNumber">
                      PAN Card Number
                      <X />{' '}
                      {errors.panNumber && (
                        <span className="small text-danger">{errors.panNumber}</span>
                      )}
                    </CFormLabel>
                    <CFormInput
                      size="sm"
                      id="panNumber"
                      className={`${errors.panNumber && 'is-invalid'}`}
                      name="panNumber"
                      maxLength={10}
                      value={values.panNumber}
                      onFocus={onFocus}
                      onBlur={onBlur} 
                      onChange={(e) => {
                        handleChange(e)                      
                        tdsChangeByPAN(e,1)
                      }}
                    />
                  </CCol>

                  <CCol xs={12} md={3}>
                    <CFormLabel htmlFor="aadhar">
                      Aadhar Card Number
                      <X />{' '}
                      {errors.aadhar && <span className="small text-danger">{errors.aadhar}</span>}
                    </CFormLabel>
                    <CFormInput
                      size="sm"
                      id="aadhar"
                      className={`${errors.aadhar && 'is-invalid'}`}
                      name="aadhar"
                      maxLength={12}
                      value={values.aadhar}
                      onFocus={onFocus}
                      onBlur={onBlur}
                      onChange={handleChange}
                    />
                  </CCol>

                  <CCol xs={12} md={3}>
                    <CFormLabel htmlFor="mobileNumber">
                      Contact Number
                      <X />{' '}
                      {errors.mobileNumber && (
                        <span className="small text-danger">{errors.mobileNumber}</span>
                      )}
                    </CFormLabel>
                    <CFormInput
                      size="sm"
                      id="mobileNumber"
                      name="mobileNumber"
                      maxLength={10}
                      className={`${errors.mobileNumber && 'is-invalid'}`}
                      value={values.mobileNumber}
                      onFocus={onFocus}
                      onBlur={onBlur}
                      onChange={handleChange}
                    />
                  </CCol>

                  <CCol xs={12} md={3}>
                    <CFormLabel htmlFor="bankAccount">
                      Bank Account Number
                      <X />{' '}
                      {errors.bankAccount && (
                        <span className="small text-danger">{errors.bankAccount}</span>
                      )}
                    </CFormLabel>
                    <CFormInput
                      size="sm"
                      id="bankAccount"
                      name="bankAccount"
                      maxLength={18}
                      className={`${errors.bankAccount && 'is-invalid'}`}
                      value={values.bankAccount}
                      onFocus={onFocus}
                      onBlur={onBlur}
                      onChange={handleChange}
                    />
                  </CCol>
                  <CCol xs={12} md={3}>
                    <CFormLabel htmlFor="bankAccHolderName">
                      Bank Account Holder Name
                      <X />{' '}
                      {errors.bankAccHolderName && (
                        <span className="small text-danger">{errors.bankAccHolderName}</span>
                      )}
                    </CFormLabel>
                    <CFormInput
                      size="sm"
                      id="bankAccHolderName"
                      maxLength={30}
                      className={`${errors.bankAccHolderName && 'is-invalid'}`}
                      name="bankAccHolderName"
                      value={values.bankAccHolderName || ''}
                      onFocus={onFocus}
                      onBlur={onBlur}
                      onChange={handleChange}
                    />
                  </CCol>

                  <CCol xs={12} md={3}>
                    <CFormLabel htmlFor="bankName">
                      Bank Name
                      <X />{' '}
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
                        })}
                    </CFormSelect>
                  </CCol>
                  <CCol xs={12} md={3}>
                    <CFormLabel htmlFor="bankBranch">
                      Bank Branch
                      <X />{' '}
                      {errors.bankBranch && (
                        <span className="small text-danger">{errors.bankBranch}</span>
                      )}
                    </CFormLabel>
                    <CFormInput
                      type="text"
                      name="bankBranch"
                      size="sm"
                      id="bankBranch"
                      maxLength={30}
                      className={`${errors.bankBranch && 'is-invalid'}`}
                      value={values.bankBranch}
                      onFocus={onFocus}
                      onBlur={onBlur}
                      onChange={handleChange}
                    />
                  </CCol>

                  <CCol xs={12} md={3}>
                    <CFormLabel htmlFor="ifscCode">
                      Bank IFSC Code
                      <X />{' '}
                      {errors.ifscCode && (
                        <span className="small text-danger">{errors.ifscCode}</span>
                      )}
                    </CFormLabel>
                    <CFormInput
                      type="text"
                      name="ifscCode"
                      size="sm"
                      id="ifscCode"
                      maxLength={11}
                      className={`${errors.ifscCode && 'is-invalid'}`}
                      value={values.ifscCode}
                      onFocus={onFocus}
                      onBlur={onBlur}
                      onChange={handleChange}
                    />
                  </CCol>

                  <CCol xs={12} md={3}>
                    <CFormLabel htmlFor="GSTreg">
                      GST Registeration
                      <X />{' '}
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
                        <X />{' '}
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
                    <CFormLabel htmlFor="GSTtax">
                      Tax Type
                      <X />{' '}
                      {errors.GSTtax && <span className="small text-danger">{errors.GSTtax}</span>}
                    </CFormLabel>

                    <CFormSelect
                      size="sm"
                      id="GSTtax"
                      name="GSTtax"
                      value={values.GSTtax}
                      onFocus={onFocus}
                      onBlur={onBlur}
                      onChange={handleChange}
                      className={`${errors.GSTtax && 'is-invalid'}`}
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
                      Payment Type
                      <X />{' '}
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
                    <CFormLabel htmlFor="street">
                      Street
                      <X />{' '}
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
                      <X /> {errors.area && <span className="small text-danger">{errors.area}</span>}
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
                      <X /> {errors.city && <span className="small text-danger">{errors.city}</span>}
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
                      <X />{' '}
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
                    <CFormLabel htmlFor="state">
                      State
                      <X />{' '}
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

                  <CCol xs={12} md={3}>
                    <CFormLabel htmlFor="postalCode">
                      Postal Code
                      <X />{' '}
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
                    <CFormLabel htmlFor="panCopy">
                      PAN Card Attachment
                      {rmsto && <X />}
                      {errors.panCopy && <span className="small text-danger">{errors.panCopy}</span>}
                    </CFormLabel>
                    { panDel ?  (
                      <CButton className="w-100 m-0" color="info" size="sm" id="inputAddress">
                        {!fileuploadedPan ? (
                          <>
                          <span className="float-start" onClick={uploadClickPan}>
                              <CIcon style={{ color: 'red' }} icon={icon.cilFolderOpen} size="lg" />
                              &nbsp;Upload
                            </span>
                            <span
                              style={{ marginRight: '10%' }}
                              className="mr-10 float-end"
                              onClick={() => {
                                setCamEnablePan(true)
                              }}
                            >
                              <CIcon style={{ color: 'red' }} icon={icon.cilCamera} size="lg" />
                              &nbsp;Camera
                            </span>
                          </>
                        ) : (
                          <>
                            <span className="float-start">&nbsp;{values.panCopy.name}</span>
                            <span className="float-end">
                              <i
                                className="fa fa-trash"
                                aria-hidden="true"
                                onClick={() => {
                                  setFileuploadedPan(false)
                                  values.panCopy == ''
                                }}
                              ></i>
                            </span>
                          </>
                        )}
                      </CButton>
                    ) : (
                      <CButton className="w-100 m-0" color="info" size="sm" id="inputAddress">
                        <span className="float-start"
                        onClick={() => setPanCard(true)}>
                          <i className="fa fa-eye" aria-hidden="true"></i> &nbsp;View
                        </span>
                        <span
                          className="float-end"
                          id="panCopy"
                          onClick={() => {
                            if (window.confirm('Are you sure to remove this file?')) {
                              setPanDel(true)
                              // setHideFileUpdate(false)
                            }
                          }}
                        >
                          <i
                            className="fa fa-trash"
                            aria-hidden="true"
                            // onMouseOver={changeBackground}
                            // onMouseLeave={changeBackground1}
                          ></i>
                        </span>
                      </CButton>
                    )}
                    <CFormInput
                          onBlur={onBlur}
                          // onChange={handleChange}
                          onChange={(e)=>{imageCompressPan(e)}}
                          type="file"
                          accept=".jpg,.jpeg,.png,.pdf"
                          name="panCopy"
                          size="sm"
                          id="panCopy"
                          style={{ display: 'none' }}
                          ref={(input) => {
                            // assigns a reference so we can trigger it later
                            inputFilePan = input
                          }}
                        />
                    {/* {panDel ? (
                      <CFormInput
                        type="file"
                        name="panCopy"
                        size="sm"
                        id="panCopy"
                        accept=".jpg,.jpeg,.png,.pdf"
                        onFocus={onFocus}
                        onBlur={onBlur}
                        onChange={handleChange}
                      />
                    ) : (
                      <CButton
                        className="w-100 m-0"
                        color="info"
                        size="sm"
                        onFocus={onFocus}
                        onBlur={onBlur}
                        onChange={handleChange}
                      >
                        <span className="float-start" onClick={() => setPanCard(!PanCard)}>
                          <i className="fa fa-eye" aria-hidden="true"></i> &nbsp;View
                        </span>
                        <span
                          className="float-end"
                          id="pan"
                          onClick={() => {
                            if (window.confirm('Are you sure to remove this file?')) {
                              setPanDel(true)
                              // setHideFileUpdate(false)
                            }
                          }}
                        >
                          <i
                            className="fa fa-trash"
                            aria-hidden="true"
                            // onMouseOver={changeBackground}
                            // onMouseLeave={changeBackground1}
                          ></i>
                        </span>
                      </CButton>
                    )} */}
                  </CCol>
                  <CCol xs={12} md={3}>
                    <CFormLabel htmlFor="aadharCopy">
                      Aadhar Card Copy 
                      {errors.aadharCopy && (
                        <span className="small text-danger">{errors.aadharCopy}</span>
                      )}
                    </CFormLabel>
                    {adharDel ? (
                      <CButton className="w-100 m-0" color="info" size="sm" id="inputAddress">
                        {!fileuploaded ? (
                          <>
                            <CFormInput
                              onBlur={onBlur} 
                              onChange={(e)=>{imageCompressAadhaar(e)}}
                              type="file"
                              accept=".jpg,.jpeg,.png,.pdf"
                              name="aadharCopy"
                              size="sm"
                              id="aadharCopy"
                              style={{ display: 'none' }}
                              ref={(input) => {
                                // assigns a reference so we can trigger it later
                                inputFile = input
                              }}
                            />
                            <span className="float-start" onClick={uploadClick}>
                              <CIcon style={{ color: 'red' }} icon={icon.cilFolderOpen} size="lg" />
                              &nbsp;Upload
                            </span>
                            <span
                              style={{ marginRight: '10%' }}
                              className="mr-10 float-end"
                              onClick={() => {
                                setCamEnable(true)
                              }}
                            >
                              <CIcon style={{ color: 'red' }} icon={icon.cilCamera} size="lg" />
                              &nbsp;Camera
                            </span>
                          </>
                        ) : (
                          <>
                            <span className="float-start">&nbsp;{values.aadharCopy.name}</span>
                            <span className="float-end">
                              <i
                                className="fa fa-trash"
                                aria-hidden="true"
                                onClick={() => {
                                  setFileuploaded(false)
                                  values.aadharCopy == ''
                                }}
                              ></i>
                            </span>
                          </>
                        )}
                      </CButton>
                    ) : (
                      <CButton
                        className="w-100 m-0"
                        color="info"
                        size="sm"
                        onFocus={onFocus}
                        onBlur={onBlur}
                        onChange={handleChange}
                      >
                        <span className="float-start" onClick={() => setAdharVisible(!adharvisible)}>
                          <i className="fa fa-eye" aria-hidden="true"></i> &nbsp;View
                        </span>
                        <span
                          className="float-end"
                          onClick={() => {
                            if (window.confirm('Are you sure to remove this file?')) {
                              setAdharDel(true)
                              // setHideFileUpdate(false)
                            }
                          }}
                        >
                          <i
                            className="fa fa-trash"
                            aria-hidden="true" 
                          ></i>
                        </span>
                      </CButton>
                    )}
                  </CCol>

                 
                <CCol xs={12} md={3}>
                  <CFormLabel htmlFor="bankPass">
                    Bank Pass Book
                    {rmsto && <X />}
                    {errors.bankPass && (
                      <span className="small text-danger">{errors.bankPass}</span>
                    )}
                    </CFormLabel>
                    {passBookDel ? (
                      <CButton className="w-100 m-0" color="info" size="sm" id="inputAddress">
                        {!fileuploadedBank ? (
                          <>
                            <CFormInput
                              onBlur={onBlur} 
                              onChange={(e)=>{imageCompressBank(e)}}
                              type="file"
                              accept=".jpg,.jpeg,.png,.pdf"
                              name="bankPass"
                              size="sm"
                              id="bankPass"
                              style={{ display: 'none' }}
                              ref={(input) => {
                                // assigns a reference so we can trigger it later
                                inputFileBank = input
                              }}
                            />
                            <span className="float-start" onClick={uploadClickBank}>
                              <CIcon style={{ color: 'red' }} icon={icon.cilFolderOpen} size="lg" />
                              &nbsp;Upload
                            </span>
                            <span
                              style={{ marginRight: '10%' }}
                              className="mr-10 float-end"
                              onClick={() => {
                                setCamEnableBank(true)
                              }}
                            >
                              <CIcon style={{ color: 'red' }} icon={icon.cilCamera} size="lg" />
                              &nbsp;Camera
                            </span>
                          </>
                        ) : (
                          <>
                            <span className="float-start">&nbsp;{values.bankPass.name}</span>
                            <span className="float-end">
                              <i
                                className="fa fa-trash"
                                aria-hidden="true"
                                onClick={() => {
                                  setFileuploadedBank(false)
                                  values.bankPass == ''
                                }}
                              ></i>
                            </span>
                          </>
                        )}
                      </CButton>
                    ) : (
                      <CButton
                        className="w-100 m-0"
                        color="info"
                        size="sm"
                        onFocus={onFocus}
                        onBlur={onBlur}
                        onChange={handleChange}
                      >
                        <span className="float-start" onClick={() => setBankPassbook(!BankPassbook)}>
                          <i className="fa fa-eye" aria-hidden="true"></i> &nbsp;View
                        </span>
                        <span
                          className="float-end"
                          onClick={() => {
                            if (window.confirm('Are you sure to remove this file?')) {
                              setPassBookDel(true)
                              // setHideFileUpdate(false)
                            }
                          }}
                        >
                          <i
                            className="fa fa-trash"
                            aria-hidden="true" 
                          ></i>
                        </span>
                      </CButton>
                    )}
                  </CCol>
                   

                  <CCol xs={12} md={3}>
                    <CFormLabel htmlFor="TDSfront">
                      TDS Declaration Form Front
                      {rmsto && <X />}
                      {errors.TDSfront && (
                        <span className="small text-danger">{errors.TDSfront}</span>
                      )}
                    </CFormLabel>
                    {tdsFrontDel ? (
                      <CButton className="w-100 m-0" color="info" size="sm" id="inputAddress">
                        {!fileuploadedTDSFront ? (
                          <>
                            <CFormInput
                              onBlur={onBlur} 
                              onChange={(e)=>{imageCompressTDSFront(e)}}
                              type="file"
                              accept=".jpg,.jpeg,.png,.pdf"
                              name="TDSfront"
                              size="sm"
                              id="TDSfront"
                              style={{ display: 'none' }}
                              ref={(input) => {
                                // assigns a reference so we can trigger it later
                                inputFileTDSFront = input
                              }}
                            />
                            <span className="float-start" onClick={uploadClickTDSFront}>
                              <CIcon style={{ color: 'red' }} icon={icon.cilFolderOpen} size="lg" />
                              &nbsp;Upload
                            </span>
                            <span
                              style={{ marginRight: '10%' }}
                              className="mr-10 float-end"
                              onClick={() => {
                                setCamEnableTDSFront(true)
                              }}
                            >
                              <CIcon style={{ color: 'red' }} icon={icon.cilCamera} size="lg" />
                              &nbsp;Camera
                            </span>
                          </>
                        ) : (
                          <>
                            <span className="float-start">&nbsp;{values.TDSfront.name}</span>
                            <span className="float-end">
                              <i
                                className="fa fa-trash"
                                aria-hidden="true"
                                onClick={() => {
                                  setFileuploadedTDSFront(false)
                                  values.TDSfront == ''
                                }}
                              ></i>
                            </span>
                          </>
                        )}
                      </CButton>
                    ) : (
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
                        <span
                          className="float-end"
                          onClick={() => {
                            if (window.confirm('Are you sure to remove this file?')) {
                              setTdsFrontDel(true)
                              // setHideFileUpdate(false)
                            }
                          }}
                        >
                          <i
                            className="fa fa-trash"
                            aria-hidden="true" 
                          ></i>
                        </span>
                      </CButton>
                    )}
                  </CCol>
                  <CCol xs={12} md={3}>
                    <CFormLabel htmlFor="TDSback">
                      TDS Declaration Form Back
                      {rmsto && <X />}
                      {errors.TDSback && <span className="small text-danger">{errors.TDSback}</span>}
                    </CFormLabel>
                    {tdsBackDel ? (
                      <CButton className="w-100 m-0" color="info" size="sm" id="inputAddress">
                        {!fileuploadedTDSBack ? (
                          <>
                            <CFormInput
                              onBlur={onBlur} 
                            onChange={(e)=>{imageCompressTDSBack(e)}}
                              type="file"
                              accept=".jpg,.jpeg,.png,.pdf"
                              name="TDSback"
                              size="sm"
                              id="TDSback"
                              style={{ display: 'none' }}
                              ref={(input) => {
                                // assigns a reference so we can trigger it later
                                inputFileTDSBack = input
                              }}
                            />
                            <span className="float-start" onClick={uploadClickTDSBack}>
                              <CIcon style={{ color: 'red' }} icon={icon.cilFolderOpen} size="lg" />
                              &nbsp;Upload
                            </span>
                            <span
                              style={{ marginRight: '10%' }}
                              className="mr-10 float-end"
                              onClick={() => {
                                setCamEnableTDSBack(true)
                              }}
                            >
                              <CIcon style={{ color: 'red' }} icon={icon.cilCamera} size="lg" />
                              &nbsp;Camera
                            </span>
                          </>
                        ) : (
                          <>
                            <span className="float-start">&nbsp;{values.TDSback.name}</span>
                            <span className="float-end">
                              <i
                                className="fa fa-trash"
                                aria-hidden="true"
                                onClick={() => {
                                  setFileuploadedTDSBack(false)
                                  values.TDSback == ''
                                }}
                              ></i>
                            </span>
                          </>
                        )}
                      </CButton>
                    ) : (
                      <CButton
                        className="w-100 m-0"
                        color="info"
                        size="sm"
                        onFocus={onFocus}
                        onBlur={onBlur}
                        onChange={handleChange}
                      >
                        <span className="float-start" onClick={() => setTDSFormBack(!TDSFormBack)}>
                          <i className="fa fa-eye" aria-hidden="true"></i> &nbsp;View
                        </span>
                        <span
                          className="float-end"
                          onClick={() => {
                            if (window.confirm('Are you sure to remove this file?')) {
                              setTdsBackDel(true)
                              // setHideFileUpdate(false)
                            }
                          }}
                        >
                          <i
                            className="fa fa-trash"
                            aria-hidden="true" 
                          ></i>
                        </span>
                      </CButton>
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
                {currentInfo.trip_sheet_info && (
                  <>
                    <CCol xs={12} md={3}>
                      <CFormLabel htmlFor="Vnum">Tripsheet No</CFormLabel>
                      <CFormInput
                        size="sm"
                        id="Vnum"
                        value={currentInfo.trip_sheet_info.trip_sheet_no}
                        readOnly
                      />
                    </CCol>
                  </>
                )}
              </CRow>
              {/* Row Nine------------------------- */}
              <CRow>
                <CCol xs={12} md={6}>
                  <Link to="/VendorCreationHome">
                    <CButton
                      md={9}
                      size="sm"
                      color="primary"
                      disabled=""
                      className="text-white"
                      type="submit"
                    >
                      Previous
                    </CButton>
                  </Link>
                  <CButton
                      size="sm"
                      color="success"
                      className="mx-1 px-2 text-white"
                      onClick={(e) => {
                        setFetch(false) 
                        getPanData(e)
                      }}
                      disabled={errors.panNumber || values.panNumber == ''}
                  >
                  SAP Vendor Check
                  </CButton>
                  {panGroupData.length > 0 && (errors.panNumber == '' || errors.panNumber == undefined) && values.panNumber != '' && (
                    <CFormSelect
                      size="sm"
                      name="pan_data" 
                      value={vendorCode} 
                      onChange={(e) => getPanChildData(e)}
                      aria-label="Small select example"
                      id="gstType"
                      style={{width:"55%",display:"inline-block"}}
                    >
                      <option value="0">Select...</option>
                      {panGroupData.map(({ LIFNR, NAME1 }) => {
                        return (
                          <>
                            <option key={LIFNR} value={LIFNR}>
                              {`${LIFNR} - ${NAME1}`}
                            </option>
                          </>
                        )
                      })}
                    </CFormSelect>
                  )}
                </CCol>

                {/* {panGroupData.length > 0 ? (
                  <CCol md={3}>
                    <CFormLabel htmlFor="pan_data">
                      PAN Data <REQ />{' '}                      
                    </CFormLabel>
                    <CFormSelect
                      size="sm"
                      name="pan_data" 
                      value={vendorCode} 
                      onChange={(e) => getPanChildData(e)}
                      aria-label="Small select example"
                      id="gstType"
                    >
                      <option value="0">Select...</option>
                      {panGroupData.map(({ LIFNR, NAME1 }) => {
                        return (
                          <>
                            <option key={LIFNR} value={LIFNR}>
                              {`${LIFNR} - ${NAME1}`}
                            </option>
                          </>
                        )
                      })}
                    </CFormSelect>
                  </CCol>
                ) : <CCol xs={12} md={3}></CCol>
                } */}

                <CCol xs={12} md={3}></CCol>

                <CCol
                  className=""
                  xs={12}
                  sm={12}
                  md={3}
                  style={{ display: 'flex', justifyContent: 'flex-end' }}
                >
                  
                  <CButton
                    size="sm"
                    color="warning"
                    className="mx-1 px-2 text-white"
                    type="button"
                    disabled={acceptBtn || (!hideFileUpdate && true)}
                    // onClick={() => addVendorRequest(2)}
                    onClick={() => {
                      addVendorRequest(2)
                      setFetch(false)
                      // addVendorConfirmation(4)
                    }}
                  >
                    Submit
                  </CButton>
                    
                </CCol>
              </CRow>
              {/* Row Eight------------------------- */}
              </CForm>
              {/* Camera Image Copy model   Start */}
              <CModal
                visible={camEnablePan}
                backdrop="static"
                onClose={() => {
                  setCamEnablePan(false)
                  setImgSrcPan('')
                }}
              >
                <CModalHeader>
                  <CModalTitle>Pan Photo Copy</CModalTitle>
                </CModalHeader>
                <CModalBody>
                  {!imgSrcPan && (
                    <>
                      <Webcam
                        audio={false}
                        ref={webcamRefPan}
                        screenshotFormat="image/png"
                        height={200}
                      />
                      <p className="mt-2">
                        <CButton
                          size="sm"
                          color="warning"
                          className="mx-1 px-2 text-white"
                          type="button"
                          onClick={() => {
                            capturePan()
                          }}
                        >
                          Accept
                        </CButton>
                      </p>
                    </>
                  )}
                  {imgSrcPan && (
                    <>
                      <img height={200} src={imgSrcPan} />
                      <p className="mt-2">
                        <CButton
                          size="sm"
                          color="warning"
                          className="mx-1 px-2 text-white"
                          type="button"
                          onClick={() => {
                            setImgSrcPan('')
                          }}
                        >
                          Delete
                        </CButton>
                      </p>
                    </>
                  )}
                </CModalBody>
                <CModalFooter>
                  {imgSrcPan && (
                    <CButton
                      className="m-2"
                      color="warning"
                      onClick={() => {
                        setCamEnablePan(false)
                        valueAppendToImagePan(imgSrcPan)
                      }}
                    >
                      Confirm
                    </CButton>
                  )}
                  <CButton
                    color="secondary"
                    onClick={() => {
                      setCamEnablePan(false)
                      setImgSrcPan('')
                    }}
                  >
                    Cancel
                  </CButton>
                </CModalFooter>
              </CModal>

              <CModal
                visible={camEnable}
                backdrop="static"
                onClose={() => {
                  setCamEnable(false)
                  setImgSrc('')
                }}
              >
                <CModalHeader>
                  <CModalTitle>Aadhaar Card Photo Copy</CModalTitle>
                </CModalHeader>
                <CModalBody>
                  {!imgSrc && (
                    <>
                      <Webcam
                        audio={false}
                        ref={webcamRef}
                        screenshotFormat="image/png"
                        height={200}
                      />
                      <p className="mt-2">
                        <CButton
                          size="sm"
                          color="warning"
                          className="mx-1 px-2 text-white"
                          type="button"
                          onClick={() => {
                            capture()
                          }}
                        >
                          Accept
                        </CButton>
                      </p>
                    </>
                  )}
                  {imgSrc && (
                    <>
                      <img height={200} src={imgSrc} />
                      <p className="mt-2">
                        <CButton
                          size="sm"
                          color="warning"
                          className="mx-1 px-2 text-white"
                          type="button"
                          onClick={() => {
                            setImgSrc('')
                          }}
                        >
                          Delete
                        </CButton>
                      </p>
                    </>
                  )}
                </CModalBody>
                <CModalFooter>
                  {imgSrc && (
                    <CButton
                      className="m-2"
                      color="warning"
                      onClick={() => {
                        setCamEnable(false)
                        valueAppendToImage(imgSrc)
                      }}
                    >
                      Confirm
                    </CButton>
                  )}
                  <CButton
                    color="secondary"
                    onClick={() => {
                      setCamEnable(false)
                      setImgSrc('')
                    }}
                  >
                    Cancel
                  </CButton>
                </CModalFooter>
              </CModal>

              <CModal
                visible={camEnableBank}
                backdrop="static"
                onClose={() => {
                  setCamEnableBank(false)
                  setImgSrcBank('')
                }}
              >
                <CModalHeader>
                  <CModalTitle>Bank PassBook Photo Copy</CModalTitle>
                </CModalHeader>
                <CModalBody>
                  {!imgSrcBank && (
                    <>
                      <Webcam
                        audio={false}
                        ref={webcamRefBank}
                        screenshotFormat="image/png"
                        height={200}
                      />
                      <p className="mt-2">
                        <CButton
                          size="sm"
                          color="warning"
                          className="mx-1 px-2 text-white"
                          type="button"
                          onClick={() => {
                            captureBank()
                          }}
                        >
                          Accept
                        </CButton>
                      </p>
                    </>
                  )}
                  {imgSrcBank && (
                    <>
                      <img height={200} src={imgSrcBank} />
                      <p className="mt-2">
                        <CButton
                          size="sm"
                          color="warning"
                          className="mx-1 px-2 text-white"
                          type="button"
                          onClick={() => {
                            setImgSrcBank('')
                          }}
                        >
                          Delete
                        </CButton>
                      </p>
                    </>
                  )}
                </CModalBody>
                <CModalFooter>
                  {imgSrcBank && (
                    <CButton
                      className="m-2"
                      color="warning"
                      onClick={() => {
                        setCamEnableBank(false)
                        valueAppendToImageBank(imgSrcBank)
                      }}
                    >
                      Confirm
                    </CButton>
                  )}
                  <CButton
                    color="secondary"
                    onClick={() => {
                      setCamEnableBank(false)
                      setImgSrcBank('')
                    }}
                  >
                    Cancel
                  </CButton>
                </CModalFooter>
              </CModal>

              <CModal
                visible={camEnableTDSFront}
                backdrop="static"
                onClose={() => {
                  setCamEnableTDSFront(false)
                  setImgSrcTDSFront('')
                }}
              >
                <CModalHeader>
                  <CModalTitle>TDS Front Photo Copy</CModalTitle>
                </CModalHeader>
                <CModalBody>
                  {!imgSrcTDSFront && (
                    <>
                      <Webcam
                        audio={false}
                        ref={webcamRefTDSFront}
                        screenshotFormat="image/png"
                        height={200}
                      />
                      <p className="mt-2">
                        <CButton
                          size="sm"
                          color="warning"
                          className="mx-1 px-2 text-white"
                          type="button"
                          onClick={() => {
                            captureTDSFront()
                          }}
                        >
                          Accept
                        </CButton>
                      </p>
                    </>
                  )}
                  {imgSrcTDSFront && (
                    <>
                      <img height={200} src={imgSrcTDSFront} />
                      <p className="mt-2">
                        <CButton
                          size="sm"
                          color="warning"
                          className="mx-1 px-2 text-white"
                          type="button"
                          onClick={() => {
                            setImgSrcTDSFront('')
                          }}
                        >
                          Delete
                        </CButton>
                      </p>
                    </>
                  )}
                </CModalBody>
                <CModalFooter>
                  {imgSrcTDSFront && (
                    <CButton
                      className="m-2"
                      color="warning"
                      onClick={() => {
                        setCamEnableTDSFront(false)
                        valueAppendToImageTDSFront(imgSrcTDSFront)
                      }}
                    >
                      Confirm
                    </CButton>
                  )}
                  <CButton
                    color="secondary"
                    onClick={() => {
                      setCamEnableTDSFront(false)
                      setImgSrcTDSFront('')
                    }}
                  >
                    Cancel
                  </CButton>
                </CModalFooter>
              </CModal>

              <CModal
                visible={camEnableTDSBack}
                backdrop="static"
                onClose={() => {
                  setCamEnableTDSBack(false)
                  setImgSrcTDSBack('')
                }}
              >
                <CModalHeader>
                  <CModalTitle>TDS Back Photo Copy</CModalTitle>
                </CModalHeader>
                <CModalBody>
                  {!imgSrcTDSBack && (
                    <>
                      <Webcam
                        audio={false}
                        ref={webcamRefTDSBack}
                        screenshotFormat="image/png"
                        height={200}
                      />
                      <p className="mt-2">
                        <CButton
                          size="sm"
                          color="warning"
                          className="mx-1 px-2 text-white"
                          type="button"
                          onClick={() => {
                            captureTDSBack()
                          }}
                        >
                          Accept
                        </CButton>
                      </p>
                    </>
                  )}
                  {imgSrcTDSBack && (
                    <>
                      <img height={200} src={imgSrcTDSBack} />
                      <p className="mt-2">
                        <CButton
                          size="sm"
                          color="warning"
                          className="mx-1 px-2 text-white"
                          type="button"
                          onClick={() => {
                            setImgSrcTDSBack('')
                          }}
                        >
                          Delete
                        </CButton>
                      </p>
                    </>
                  )}
                </CModalBody>
                <CModalFooter>
                  {imgSrcTDSBack && (
                    <CButton
                      className="m-2"
                      color="warning"
                      onClick={() => {
                        setCamEnableTDSBack(false)
                        valueAppendToImageTDSBack(imgSrcTDSBack)
                      }}
                    >
                      Confirm
                    </CButton>
                  )}
                  <CButton
                    color="secondary"
                    onClick={() => {
                      setCamEnableTDSBack(false)
                      setImgSrcTDSBack('')
                    }}
                  >
                    Cancel
                  </CButton>
                </CModalFooter>
              </CModal>
              {/* Camera Image Copy model End */}
            </CCard>
            {/* ============================================================= */}

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

export default VendorCreationRequest
