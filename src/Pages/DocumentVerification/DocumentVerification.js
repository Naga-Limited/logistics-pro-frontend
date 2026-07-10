/* eslint-disable prettier/prettier */
import {
  CButton,
  CCard,
  CCol, 
  CForm,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CNav,
  CNavItem,
  CNavLink,
  CRow,
  CTabContent, 
  CTabPane, 
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CFormTextarea,
  CInputGroupText,
  CInputGroup, 
} from '@coreui/react'
import React,{  useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// SERVICES FILE
import DocumentVerificationService from 'src/Service/DocsVerify/DocsVerifyService'
import ShedService from 'src/Service/SmallMaster/Shed/ShedService'
import PanDataService from 'src/Service/SAP/PanDataService'
import ShedListSearchSelect from 'src/components/commoncomponent/ShedListSearchSelect'

// VALIDATIONS FILE
import useForm from 'src/Hooks/useForm.js' 
import DocumentVerificationValidation from 'src/Utils/TransactionPages/DocumentVerification/DocumentVerificationValidation'
import Loader from 'src/components/Loader'
import VendorAvaiable from './Segments/VendorAvaiable'
import VendorNotAvailable from './Segments/VendorNotAvailable'
import ShedMasterService from 'src/Service/Master/ShedMasterService'

import AccessDeniedComponent from 'src/components/commoncomponent/AccessDeniedComponent'
import JavascriptInArrayComponent from 'src/components/commoncomponent/JavascriptInArrayComponent'
import * as LogisticsProScreenNumberConstants from 'src/components/constants/LogisticsProScreenNumberConstants'

import Webcam from 'react-webcam'
import CIcon from '@coreui/icons-react'
import * as icon from '@coreui/icons';
import FileResizer from 'react-image-file-resizer'

const DocVerifyVendorAvail = () => {
  const user_info_json = localStorage.getItem('user_info')
  const user_info = JSON.parse(user_info_json)

  /* Get User Id From Local Storage */
  const user_id = user_info.user_id

  /* ==================== Access Part Start ========================*/
  const [screenAccess, setScreenAccess] = useState(false)
  let page_no = LogisticsProScreenNumberConstants.DocumentVerificationModule.Document_Verify_List

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
  const [visible, setVisible] = useState(false)
  const [currentVehicleInfo, setCurrentVehicleInfo] = useState({})
  const [acceptBtn, setAcceptBtn] = useState(true)
  const [rejectBtn, setRejectBtn] = useState(true)
  const [shedNames, setShedNames] = useState([]) 
  const [shedData, setShedData] = useState({})
  const [panNumber, setPanNumber] = useState('')
  const [panData, setPanData] = useState({})
  const [readOnly, setReadOnly] = useState(true)
  const [write, setWrite] = useState(false)
  const [fetch, setFetch] = useState(false)
  const [vendor, setVendor] = useState(false) // Vendor Available
  const REQ = () => <span className="text-danger"> * </span>
  const [panGroupData, setPanGroupData] = useState([])
  const [vendorCode, setVendorCode] = useState('0')
  const [shedMob, setShedMob] = useState('')
  const [shedWhats, setShedWhats] = useState('')
  const [shed_Name1, setShed_Name1] = useState('')
  const [WITHT, setWITHT] = useState('')

  // SET FORM VALUES
  const formValues = {
    panNumber: '',
    rcFront: '',
    rcBack: '',
    insuranceValid: '',
    TDSfront: '',
    TDSback: '',
    transportShedSheet: '',
    shedName: '',
    ownershipTrans: '',
    freightRate: '',
    ...(!vendor && { aadharCopy: '', panCopy: '', passCopy: '', license: '' }),
    ...(!readOnly && { ownerName: '', ownerMob: '', aadhar: '', bankAcc: '', insurance: '' }),
    remarks: '',
  }

  // VALIDATIONS
  function callBack() {}
  const { values, errors, handleChange, onFocus, handleSubmit, enableSubmit, onBlur, isTouched } =
    useForm(callBack, DocumentVerificationValidation, formValues)

  // GET SINGLE VEHICLE DATA
  useEffect(() => {
    DocumentVerificationService.getSingleVehicleInfoOnParkingYardGate(id).then((res) => {
      const resData = res.data.data
      setCurrentVehicleInfo(resData)
      setFetch(true)
    })
  }, [id])

  // GET ALL SHED DATA VALUE
  useEffect(() => {
    // section for getting Shed Details from database
    ShedMasterService.getShed().then((res) => {
      // console.log(res.data.data)
      setShedNames(res.data.data)
    })
  }, [])

  // GET ALL VENDOR DATA FOR THE VEHICLE NO
  // useEffect(() => {
  //   if(currentVehicleInfo.vehicle_number){
  //     // section for getting Vehicle's Vendor Details from database
  //     DocumentVerificationService.getVehicleVendorDetails(currentVehicleInfo.vehicle_number).then((res) => {
  //       console.log(res.data.data,'getVehicleVendorDetails')
  //       setVehicleVendors(res.data.data)
  //     })
  //   }

  // }, [currentVehicleInfo,currentVehicleInfo.vehicle_number])

  // ASSIGN SINGLE SHED DATA VALUE
  useEffect(() => {
    if (values.shedName != '0') {
      //fetch Shed mobile number , whatsapp Number from Shed Master

      ShedMasterService.getShedById(values.shedName).then((res) => {
        console.log(res.data.data)
        setShedMob(res.data.data.shed_owner_phone_1)
        setShedWhats(res.data.data.shed_owner_phone_2)
        setShed_Name1(res.data.data.shed_name)
      })
    } else {
      setShedMob('')
      setShedWhats('')
      setShed_Name1('')
    }
  }, [values.shedName])

  // ERROR VALIDATIONS
  useEffect(() => {
    // isTouched.transportShedSheet = true
    isTouched.ownershipTrans = true
    //isTouched.insurance = true
    isTouched.remarks = true

    if (vendor) {
      // isTouched.license = true
      errors.license = ''
    }

    if (!readOnly) {
      isTouched.ownerName = true
      isTouched.ownerMob = true
      isTouched.aadhar = true
      isTouched.bankAcc = true
    }

    // For Vendor Not Availabale
    let aadharVal = !errors.aadharCopy && values.aadharCopy
    let panVal = !errors.panCopy && values.panCopy
    let passbookVal = !errors.passCopy && values.passCopy
    let licenseVal = !errors.license && values.license
    let shedVal = !errors.shedName && values.shedName
    //let pannoVal = !errors.panNumber && values.panNumber
    let pannoVal = panNumbernew
    // For Vendor Available
    let rcfrontVal = !errors.rcFront && values.rcFront
    let rcbackVal = !errors.rcBack && values.rcBack
    let tdsfrontVal = !errors.TDSfront && values.TDSfront
    let tdsbackVal = !errors.TDSback && values.TDSback
    let tssVal = !errors.transportShedSheet && values.transportShedSheet
    let fptVal = !errors.freightRate && values.freightRate
    let insuranceVal = !errors.insuranceValid && values.insuranceValid

    if (!vendor) {
      console.log('vendor_not_available')
      if (
        // aadharVal &&
        shedVal &&
        pannoVal &&
        values.ownerName &&
        values.ownerMob &&
        // panVal &&
        // passbookVal &&
        // licenseVal &&
        // rcfrontVal &&
        // rcbackVal &&
        // tdsfrontVal &&
        // tdsbackVal &&
        // tssVal &&
        fptVal
        // insuranceVal
      ) {
        setAcceptBtn(false)
        setRejectBtn(false)
      } else {
        setAcceptBtn(true)
        setRejectBtn(true)
      }
    } else {
      console.log('vendor_available')
      if (
        // rcfrontVal &&
        // rcbackVal &&
        shedVal &&
        pannoVal &&
        // tdsfrontVal &&
        // tdsbackVal &&
        // tssVal &&
        fptVal
        // insuranceVal
      ) {
        setAcceptBtn(false)
        setRejectBtn(false)
      } else {
        setAcceptBtn(true)
        setRejectBtn(true)
      }
    }

    if (!errors.aadharCopy && values.aadharCopy) {
      console.log('error_aadhar_no')
    } else {
      console.log('error_aadhar_yes')
    }
  }, [values, errors])

  // GET PAN DETAILS FROM SAP
  const getPanData = (e) => {
    e.preventDefault()
    console.log(panNumbernew,'panNumbernew')

    if (!panNumbernew || panNumbernew == '') {
      setFetch(true)
      toast.warning('Pan Number Required')
      return false
    }

    if (!/^[A-Z]{5}[\d]{4}[A-Z]{1}$/.test(panNumbernew)) {
      setFetch(true)
      toast.warning('PAN NUMBER Must Like "CRCPK0712L"')
      return false
    }

    PanDataService.getMultiVendorInfoByPan(panNumbernew).then((res) => {
      console.log(res.data,'getPanData-panResult')
      if (res.status == 200 && res.data != '') {
        setVendor(true)
        // setPanData(res.data[0])
        setPanGroupData(res.data)
        setWITHT(res.data[0].WITHT)
        toast.success('Pan Details Detected!')
      } else {
        toast.warning('No Pan Details Detected! Fill Up The Fields')
        setPanGroupData([])
        setVendor(false)
      }
    })

    setReadOnly(true)
    setWrite(true)
  }

  // GET SINGLE SHED DETAILS
  const ShedData = (id) => {
    ShedService.SingleShedData(id).then((resp) => {
      setShedData(resp.data.data)
    })
  }

  // ADD DOCUMENT VERIFICATION DETAILS
  const addDocumentVerification = (status) => {
    setFetch(true)

    console.log(currentVehicleInfo.vehicle_number,'currentVehicleInfo.vehicle_number')
    console.log(panNumbernew,'panNumbernew')

    // let vendor_existing = 1
    // let vendor_already_created = 0
    // vehicleVendors.map((vc,kc)=>{
    //   if(panNumbernew == vc.pan_card_number){
    //     vc.vendor_code == 0 ? vendor_existing = 0 : vendor_already_created = 1
    //   }
    // })

    // if(vendor_existing == 0 && vendor_already_created == 0){
    //   toast.error('Vendor Creation Process Already Pending.. So Kindly Go and Complete the Vendor creation Process..')
    //   return false
    // }

    const formData = new FormData()
    formData.append('vehicle_id', currentVehicleInfo.vehicle_id)
    formData.append('parking_id', currentVehicleInfo.parking_yard_gate_id)
    formData.append('vehicle_inspection_id', currentVehicleInfo.vehicle_inspection.inspection_id)
    
    formData.append('license_copy', values.license || '')
    formData.append('rc_copy_front', values.rcFront)
    formData.append('rc_copy_back', values.rcBack)
    formData.append('insurance_copy_front', values.insurance || '') 
    formData.append('insurance_validity', values.insuranceValid)
    formData.append('tds_dec_form_front', values.TDSfront)
    formData.append('tds_dec_form_back', values.TDSback)
    formData.append('created_by', user_id)

    if (!vendor) {
      formData.append('aadhar_copy', values.aadharCopy)
      formData.append('pan_copy', values.panCopy)
      formData.append('pass_copy', values.passCopy)
    }

    formData.append('transport_shed_sheet', values.transportShedSheet) 
    formData.append('shed_id', values.shedName) 
    formData.append('shed_name', shed_Name1)
    formData.append('ownership_transfer_form', values.ownershipTrans)
    formData.append('shed_owner_number', shedData.shed_owner_phone_1)
    formData.append('shed_owner_whatsapp', shedData.shed_owner_phone_2)
    formData.append('freight_rate', values.freightRate)
    formData.append('remarks',  remarks ? remarks : 'NO REMARKS')
    formData.append('document_status', status)
    formData.append('document_verification_status', status) 

    if (isTouched.panNumbernew && !panNumbernew) {
      setFetch(true)
      toast.warning('Pan Number Required')
      return false

    } else if (isTouched.panNumbernew && !/^[A-Z]{5}[\d]{4}[A-Z]{1}$/.test(panNumbernew)) {
      setFetch(true)
      toast.warning('PAN NUMBER Must Like "CRCPK0712L"')
      return false
    }

    console.log(panGroupData,'addDocumentVerification-panGroupData')
    console.log(panData,'addDocumentVerification-pandata')

    if(panGroupData.length > 0 && Object.keys(panData).length === 0){ 
      setFetch(true)
      toast.warning('Pan Data Required')
      return false
    } 

    if(panData && Object.keys(panData).length > 0)
    { 
      formData.append('pan_number', panData.J_1IPANNO)
      formData.append('vendor_code', panData.LIFNR)
      formData.append('owner_name', panData.NAME1)
      formData.append('owner_name2', panData.NAME2)
      formData.append('owner_number', panData.TELF1)
      formData.append('city', panData.CITY)
      formData.append('aadhar_number', panData.IDNUMBER)
      formData.append('bank_acc_number', panData.BANKN)
      formData.append('gst_tax_code', panData.WITHT) 
      formData.append('is_sap_vendor', 1)
    } else {
      formData.append('pan_number', panNumbernew || panNumber)
      formData.append('vendor_code',0)
      formData.append('owner_name',values.ownerName)
      formData.append('owner_name2',null)
      formData.append('city',null)
      formData.append('owner_number', values.ownerMob)
      formData.append('aadhar_number',values.aadhar)
      formData.append('bank_acc_number',values.bankAcc)
      formData.append('gst_tax_code', null)
      formData.append('is_sap_vendor', 0)
    }

    console.log(formData,'addDocumentVerification-formData22')
    console.log(values,'addDocumentVerification-values')

    // toast.success('All are correct..')
    // return false

    DocumentVerificationService.addDocumentVerificationData(formData)
      .then((res) => {
        setFetch(true)
        if (res.status == 200) {
          toast.success('Document Verification Done!')
          navigation('/DocsVerify')
        } else if (res.status == 201) {
          toast.error('Document Verification Rejected..!')
          navigation('/DocsVerify')
        } else if (res.status == 204) {
          toast.success('Document Verified for Existing Vendor.!')
          navigation('/DocsVerify')
        } else if (res.status == 205) {
          toast.warning('Already, Document Verified..')
          navigation('/DocsVerify')
        }
      })
      .catch((err) => {
        setFetch(true)
        toast.warning(err)
      })
  }


  const onChange = (event) => {
    let shedId = event.value
    if (shedId) {
      values.shedName = shedId

      ShedMasterService.getShedById(shedId).then((res) => {
        console.log(res.data.data)
        setShedMob(res.data.data.shed_owner_phone_1)
        setShedWhats(res.data.data.shed_owner_phone_2)
        setShed_Name1(res.data.data.shed_name)
      })
     console.log(setShed_Name1)
    } else {
      values.shedName = ''
      setShedMob('')
      setShedWhats('')
      // console.log()
    }
  }

  const [remarks, setRemarks] = useState('');
  const handleChangenew = event => {
    let result = event.target.value.toUpperCase();
    setRemarks(result);
  };

  const [panNumbernew, setpanNumber] = useState('');
  const handleChangenewpan = event => {
    const panResult = event.target.value.toUpperCase();
    setpanNumber(panResult);
  };

  /* ====================Web Cam Start ========================*/
  const webcamRef = React.useRef(null);
  const [fileuploadedAadhar, setFileuploadedAadhar] = useState(false)
  const [fileuploadedPan, setFileuploadedPan] = useState(false)
  const [fileuploadedPass, setFileuploadedPass] = useState(false)
  const [fileuploadedTDSFront, setFileuploadedTDSFront] = useState(false)
  const [fileuploadedTDSBack, setFileuploadedTDSBack] = useState(false)
  const [fileuploadedLicense, setFileuploadedLicence] = useState(false)
  const [fileuploadedRCFront, setFileuploadedRCFront] = useState(false)
  const [fileuploadedRCBack, setFileuploadedRCBack] = useState(false)
  const [fileuploadedInsurance, setFileuploadedInsurance] = useState(false)
  const [fileuploadedTransShedSheet, setFileuploadedTransShedSheet] = useState(false)
  const [fileuploadedOwnerTransForm, setFileuploadedOwnerTransForm] = useState(false)

  const [camEnableAadhar, setCamEnableAadhar] = useState(false)
  const [camEnablePan, setCamEnablePan] = useState(false)
  const [camEnablePass, setCamEnablePass] = useState(false)
  const [camEnableTDSFront, setCamEnableTDSFront] = useState(false)
  const [camEnableTDSBack, setCamEnableTDSBack] = useState(false)
  const [camEnableLicense, setCamEnableLicense] = useState(false)
  const [camEnableInsurance, setCamEnableInsurance] = useState(false)
  const [camEnableRCFront, setCamEnableRCFront] = useState(false)
  const [camEnableRCBack, setCamEnableRCBack] = useState(false)
  const [camEnableOwnerTrans, setCamEnableOwnerTrans] = useState(false)
  const [camEnableTransShed, setCamEnableTransShed] = useState(false)

  const [imgSrcAadhar, setImgSrcAadhar] = React.useState(null);
  const [imgSrcPan, setImgSrcPan] = React.useState(null);
  const [imgSrcPass, setImgSrcPass] = React.useState(null);
  const [imgSrcTDSFront, setImgSrcTDSFront] = React.useState(null);
  const [imgSrcTDSBack, setImgSrcTDSBack] = React.useState(null);
  const [imgSrcLicense, setImgSrcLicense] = React.useState(null);
  const [imgSrcInsurance, setImgSrcInsurance] = React.useState(null);
  const [imgSrcRCFront, setImgSrcRCFront] = React.useState(null);
  const [imgSrcRCBack, setImgSrcRCBack] = React.useState(null);
  const [imgSrcTransShed, setImgSrcTransShed] = React.useState(null);
  const [imgSrcOwnerTrans, setImgSrcOwnerTrans] = React.useState(null);

  const captureAadhar = React.useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImgSrcAadhar(imageSrc);
  }, [webcamRef, setImgSrcAadhar]);

  const capturePan = React.useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImgSrcPan(imageSrc);
  }, [webcamRef, setImgSrcPan]);

  const capturePass = React.useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImgSrcPass(imageSrc);
  }, [webcamRef, setImgSrcPass]);

  const captureTDSFront = React.useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImgSrcTDSFront(imageSrc);
  }, [webcamRef, setImgSrcTDSFront]);

  const captureTDSBack = React.useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImgSrcTDSBack(imageSrc);
  }, [webcamRef, setImgSrcTDSBack]);

  const captureLicense = React.useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImgSrcLicense(imageSrc);
  }, [webcamRef, setImgSrcLicense]);

  const captureInsurance = React.useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImgSrcInsurance(imageSrc);
  }, [webcamRef, setImgSrcInsurance]);

  const captureRCBack = React.useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImgSrcRCBack(imageSrc);
  }, [webcamRef, setImgSrcRCBack]);

  const captureRCFront = React.useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImgSrcRCFront(imageSrc);
  }, [webcamRef, setImgSrcRCFront]);

  const captureTransShed = React.useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImgSrcTransShed(imageSrc);
  }, [webcamRef, setImgSrcTransShed]);

  const captureOwnerTrans = React.useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImgSrcOwnerTrans(imageSrc);
  }, [webcamRef, setImgSrcOwnerTrans]);

 /* ====================Web Cam End ========================*/

/* ==================== File Aadhar Compress ========================*/
  const resizeFileAadhar = (file) => new Promise(resolve => {
    FileResizer.imageFileResizer(file, 500, 500, 'JPEG', 100, 0,
    uri => {
      resolve(uri);
    }, 'base64' );
  })

  const imageCompressAadhar = async (event) => {
    const file = event.target.files[0];
    console.log(file)

    if(file.type == 'application/pdf') {

      if(file.size > 5000000){
        alert('File to Big, please select a file less than 5mb')
        setFileuploadedAadhar(false)
      } else {
        values.aadharCopy = file
        setFileuploadedAadhar(true)
      }
    } else  {

      const image = await resizeFileAadhar(file);
      if(file.size > 2000000){ // Condition Set only for compress more than 2mb files
        valueAppendToImageAadhar(image)
        setFileuploadedAadhar(true)
      } else {
        values.aadharCopy = file
        setFileuploadedAadhar(true)
      }
    }
  }

  const dataURLtoFileAadhar = (dataurl, filename) => {
    var arr = dataurl.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, {type: mime});
  };

  const valueAppendToImageAadhar = (image) => {

    let file_name = 'dummy'+getRndIntegerAadhar(100001,999999)+'.png'
    let file = dataURLtoFileAadhar(
      image,
      file_name,
    );

    console.log(file )

    values.aadharCopy = file
  }

  // will hold a reference for our real input file
  let inputFile = '';

  // function to trigger our input file click
  const uploadClickAadhar = e => {
    e.preventDefault();
    inputFile.click();
    return false;
  };

  const getRndIntegerAadhar = (min, max) => {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  const getPanChildData = (e) => {
    e.preventDefault()
    let res = e.target.value
    setVendorCode(res)

    panGroupData.map((vv,kk)=>{
      if(vv.LIFNR == res){
        console.log(vv,'getPanChildData')
        setPanData(vv)
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

  const vendorClear = () => {
    setpanNumber('')
    setPanGroupData([])
    setPanData({})
    // setTDS('0')
    // setErrorsTdsType('')
    setVendorCode('0')
    setVendor(false)
  }

  useEffect(() => {

    if(values.aadharCopy) {
      setFileuploadedAadhar(true)
    } else {
      setFileuploadedAadhar(false)
    }

  }, [values.aadharCopy])
    /* ==================== Aadhar Image ReSize End ========================*/

  /* ==================== File Pan Card Compress ========================*/
  const resizeFilePanCard = (file) => new Promise(resolve => {
    FileResizer.imageFileResizer(file, 500, 500, 'JPEG', 100, 0,
    uri => {
      resolve(uri);
    }, 'base64' );
  })

  const imageCompressPanCard = async (event) => {
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
    } else {

      const image = await resizeFilePanCard(file);
      if(file.size > 2000000){ // Condition Set only for compress more than 2mb files
        valueAppendToImagePanCard(image)
        setFileuploadedPan(true)
      } else {
        values.panCopy = file
        setFileuploadedPan(true)
      }
    }
  }

  const dataURLtoFilePanCard = (dataurl, filename) => {
    var arr = dataurl.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, {type: mime});
  };

  const valueAppendToImagePanCard = (image) => {

    let file_name = 'dummy'+getRndIntegerPanCard(100001,999999)+'.png'
    let file = dataURLtoFilePanCard(
      image,
      file_name,
    );

    console.log(file )

    values.panCopy = file
  }

  // will hold a reference for our real input file
  let inputFilePanCard = '';

  // function to trigger our input file click
  const uploadClickPanCard = e => {
    e.preventDefault();
    inputFilePanCard.click();
    return false;
  };

  const getRndIntegerPanCard = (min, max) => {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  useEffect(() => {

    if(values.panCopy) {
      setFileuploadedPan(true)
    } else {
      setFileuploadedPan(false)
    }

  }, [values.panCopy])
  /* ==================== Pan Card Image Compress End ========================*/

  /* ==================== File Bank passbook Compress ========================*/
  const resizeFilepassCopy = (file) => new Promise(resolve => {
    FileResizer.imageFileResizer(file, 500, 500, 'JPEG', 100, 0,
    uri => {
      resolve(uri);
    }, 'base64' );
  })

  const imageCompresspassCopy = async (event) => {
    const file = event.target.files[0];
    console.log(file)

    if(file.type == 'application/pdf') {

    if(file.size > 5000000){
      alert('File to Big, please select a file less than 5mb')
      setFileuploadedPass(false)
    } else {
      values.passCopy = file
      setFileuploadedPass(true)
    }
  }else{

    const image = await resizeFilepassCopy(file);
    if(file.size > 2000000){ // Condition Set only for compress more than 2mb files
      valueAppendToImagepassCopy(image)
      setFileuploadedPass(true)
    } else {
      values.passCopy = file
      setFileuploadedPass(true)
    }
  }
  }

  const dataURLtoFilepassCopy = (dataurl, filename) => {
    var arr = dataurl.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, {type: mime});
  };

  const valueAppendToImagepassCopy = (image) => {

    let file_name = 'dummy'+getRndIntegerpassCopy(100001,999999)+'.png'
    let file = dataURLtoFilepassCopy(
      image,
      file_name,
    );

    console.log(file )

    values.passCopy = file
  }

  // will hold a reference for our real input file
  let inputFilepassCopy = '';

  // function to trigger our input file click
  const uploadClickpassCopy = e => {
    e.preventDefault();
    inputFilepassCopy.click();
    return false;
  };

  const getRndIntegerpassCopy = (min, max) => {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  useEffect(() => {

    if(values.passCopy) {
      setFileuploadedPass(true)
    } else {
      setFileuploadedPass(false)
    }

  }, [values.passCopy])
  /* ==================== Bank Pass book Compress End ========================*/


  /* ==================== File RC Copy Front Compress ========================*/
  const resizeFilercFront = (file) => new Promise(resolve => {
    FileResizer.imageFileResizer(file, 500, 500, 'JPEG', 100, 0,
    uri => {
      resolve(uri);
    }, 'base64' );
  })

  const imageCompressrcFront = async (event) => {
    const file = event.target.files[0];
    console.log(file)

    if(file.type == 'application/pdf') {

    if(file.size > 5000000){
      alert('File to Big, please select a file less than 5mb')
      setFileuploadedRCFront(false)
    } else {
      values.rcFront = file
      setFileuploadedRCFront(true)
    }
  }else{

    const image = await resizeFilercFront(file);
    if(file.size > 2000000){ // Condition Set only for compress more than 2mb files
      valueAppendToImagercFront(image)
      setFileuploadedRCFront(true)
    } else {
      values.rcFront = file
      setFileuploadedRCFront(true)
    }
  }
  }

  const dataURLtoFilercFront = (dataurl, filename) => {
    var arr = dataurl.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, {type: mime});
  };

  const valueAppendToImagercFront = (image) => {

    let file_name = 'dummy'+getRndIntegerrcFront(100001,999999)+'.png'
    let file = dataURLtoFilercFront(
      image,
      file_name,
    );

    console.log(file )

    values.rcFront = file
  }

  // will hold a reference for our real input file
  let inputFilercFront = '';

  // function to trigger our input file click
  const uploadClickrcFront = e => {
    e.preventDefault();
    inputFilercFront.click();
    return false;
  };

  const getRndIntegerrcFront = (min, max) => {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  useEffect(() => {

    if(values.rcFront) {
      setFileuploadedRCFront(true)
    } else {
      setFileuploadedRCFront(false)
    }

  }, [values.rcFront])
      /* ==================== RC Front Compress End ========================*/

  /* ==================== File RC Copy Front Compress ========================*/
  const resizeFilerrcBack = (file) => new Promise(resolve => {
    FileResizer.imageFileResizer(file, 500, 500, 'JPEG', 100, 0,
    uri => {
      resolve(uri);
    }, 'base64' );
  })

  const imageCompressrcBack = async (event) => {
    const file = event.target.files[0];
    console.log(file)

    if(file.type == 'application/pdf') {

    if(file.size > 5000000){
      alert('File to Big, please select a file less than 5mb')
      setFileuploadedRCBack(false)
    } else {
      values.rcBack = file
      setFileuploadedRCBack(true)
    }
  }else{

    const image = await resizeFilerrcBack(file);
    if(file.size > 2000000){ // Condition Set only for compress more than 2mb files
      valueAppendToImagercBack(image)
      setFileuploadedRCBack(true)
    } else {
      values.rcBack = file
      setFileuploadedRCBack(true)
    }
  }
  }

  const dataURLtoFilercBack = (dataurl, filename) => {
    var arr = dataurl.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, {type: mime});
  };

  const valueAppendToImagercBack = (image) => {

    let file_name = 'dummy'+getRndIntegerrcBack(100001,999999)+'.png'
    let file = dataURLtoFilercBack(
      image,
      file_name,
    );

    console.log(file )

    values.rcBack = file
  }

  // will hold a reference for our real input file
  let inputFilercBack = '';

  // function to trigger our input file click
  const uploadClickrcBack = e => {
    e.preventDefault();
    inputFilercBack.click();
    return false;
  };

  const getRndIntegerrcBack = (min, max) => {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  useEffect(() => {

    if(values.rcBack) {
      setFileuploadedRCBack(true)
    } else {
      setFileuploadedRCBack(false)
    }

  }, [values.rcBack])
  /* ==================== rcBack book Compress End ========================*/


  /* ==================== File TDSfront Front Compress ========================*/
  const resizeFilerTDSfront = (file) => new Promise(resolve => {
    FileResizer.imageFileResizer(file, 500, 500, 'JPEG', 100, 0,
    uri => {
      resolve(uri);
    }, 'base64' );
  })

  const imageCompressTDSfront = async (event) => {
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

    const image = await resizeFilerTDSfront(file);
    if(file.size > 2000000){ // Condition Set only for compress more than 2mb files
      valueAppendToImageTDSfront(image)
      setFileuploadedTDSFront(true)
    } else {
      values.TDSfront = file
      setFileuploadedTDSFront(true)
    }
  }
  }

  const dataURLtoFileTDSfront = (dataurl, filename) => {
    var arr = dataurl.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, {type: mime});
  };

  const valueAppendToImageTDSfront = (image) => {

    let file_name = 'dummy'+getRndIntegerTDSfront(100001,999999)+'.png'
    let file = dataURLtoFileTDSfront(
      image,
      file_name,
    );

    console.log(file )

    values.TDSfront = file
  }

  // will hold a reference for our real input file
  let inputFileTDSfront = '';

  // function to trigger our input file click
  const uploadClickTDSfront = e => {
    e.preventDefault();
    inputFileTDSfront.click();
    return false;
  };

  const getRndIntegerTDSfront = (min, max) => {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  useEffect(() => {

    if(values.TDSfront) {
      setFileuploadedTDSFront(true)
    } else {
      setFileuploadedTDSFront(false)
    }

  }, [values.TDSfront])
      /* ==================== TDS Front Compress End ========================*/

  /* ==================== File TDSBack Front Compress ========================*/
  const resizeFilerTDSback = (file) => new Promise(resolve => {
    FileResizer.imageFileResizer(file, 500, 500, 'JPEG', 100, 0,
    uri => {
      resolve(uri);
    }, 'base64' );
  })

  const imageCompressTDSback = async (event) => {
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

    const image = await resizeFilerTDSback(file);
    if(file.size > 2000000){ // Condition Set only for compress more than 2mb files
      valueAppendToImageTDSback(image)
      setFileuploadedTDSBack(true)
    } else {
      values.TDSback = file
      setFileuploadedTDSBack(true)
    }
  }
  }

  const dataURLtoFileTDSback = (dataurl, filename) => {
    var arr = dataurl.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, {type: mime});
  };

  const valueAppendToImageTDSback = (image) => {

    let file_name = 'dummy'+getRndIntegerTDSback(100001,999999)+'.png'
    let file = dataURLtoFileTDSback(
      image,
      file_name,
    );

    console.log(file )

    values.TDSback = file
  }

  // will hold a reference for our real input file
  let inputFileTDSback = '';

  // function to trigger our input file click
  const uploadClickTDSback = e => {
    e.preventDefault();
    inputFileTDSback.click();
    return false;
  };

  const getRndIntegerTDSback = (min, max) => {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  useEffect(() => {

    if(values.TDSback) {
      setFileuploadedTDSBack(true)
    } else {
      setFileuploadedTDSBack(false)
    }

  }, [values.TDSback])
  /* ==================== TDS Back Compress End ========================*/

  /* ==================== File license Front Compress ========================*/
  const resizeFilerlicense = (file) => new Promise(resolve => {
    FileResizer.imageFileResizer(file, 500, 500, 'JPEG', 100, 0,
    uri => {
      resolve(uri);
    }, 'base64' );
  })

  const imageCompresslicense = async (event) => {
    const file = event.target.files[0];
    console.log(file)

    if(file.type == 'application/pdf') {

    if(file.size > 5000000){
      alert('File to Big, please select a file less than 5mb')
      setFileuploadedLicence(false)
    } else {
      values.license = file
      setFileuploadedLicence(true)
    }
  }else{

    const image = await resizeFilerlicense(file);
    if(file.size > 2000000){ // Condition Set only for compress more than 2mb files
      valueAppendToImagelicense(image)
      setFileuploadedLicence(true)
    } else {
      values.license = file
      setFileuploadedLicence(true)
    }
  }
  }

  const dataURLtoFilelicense = (dataurl, filename) => {
    var arr = dataurl.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, {type: mime});
  };

  const valueAppendToImagelicense = (image) => {

    let file_name = 'dummy'+getRndIntegerlicense(100001,999999)+'.png'
    let file = dataURLtoFilelicense(
      image,
      file_name,
    );

    console.log(file )

    values.license = file
  }

  // will hold a reference for our real input file
  let inputFilelicense = '';

  // function to trigger our input file click
  const uploadClicklicense = e => {
    e.preventDefault();
    inputFilelicense.click();
    return false;
  };

  const getRndIntegerlicense = (min, max) => {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  useEffect(() => {

    if(values.license) {
      setFileuploadedLicence(true)
    } else {
      setFileuploadedLicence(false)
    }

  }, [values.license])
  /* ==================== license Compress End ========================*/


  /* ==================== File insurance Compress ========================*/
  const resizeFilerinsurance = (file) => new Promise(resolve => {
    FileResizer.imageFileResizer(file, 500, 500, 'JPEG', 100, 0,
    uri => {
      resolve(uri);
    }, 'base64' );
  })

  const imageCompressinsurance = async (event) => {
    const file = event.target.files[0];
    console.log(file)

    if(file.type == 'application/pdf') {

    if(file.size > 5000000){
      alert('File to Big, please select a file less than 5mb')
      setFileuploadedInsurance(false)
    } else {
      values.insurance = file
      setFileuploadedInsurance(true)
    }
  }else{

    const image = await resizeFilerinsurance(file);
    if(file.size > 2000000){ // Condition Set only for compress more than 2mb files
      valueAppendToImageinsurance(image)
      setFileuploadedInsurance(true)
    } else {
      values.insurance = file
      setFileuploadedInsurance(true)
    }
  }
  }

  const dataURLtoFileinsurance = (dataurl, filename) => {
    var arr = dataurl.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, {type: mime});
  };

  const valueAppendToImageinsurance = (image) => {

    let file_name = 'dummy'+getRndIntegerinsurance(100001,999999)+'.png'
    let file = dataURLtoFileinsurance(
      image,
      file_name,
    );

    console.log(file )

    values.insurance = file
  }

  // will hold a reference for our real input file
  let inputFileinsurance = '';

  // function to trigger our input file click
  const uploadClickinsurance = e => {
    e.preventDefault();
    inputFileinsurance.click();
    return false;
  };

  const getRndIntegerinsurance = (min, max) => {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  useEffect(() => {

    if(values.insurance) {
      setFileuploadedInsurance(true)
    } else {
      setFileuploadedInsurance(false)
    }

  }, [values.insurance])
      /* ==================== insurance Compress End ========================*/

  /* ==================== File transportShedSheet Compress ========================*/
  const resizeFilertransportShedSheet = (file) => new Promise(resolve => {
    FileResizer.imageFileResizer(file, 500, 500, 'JPEG', 100, 0,
    uri => {
      resolve(uri);
    }, 'base64' );
  })

  const imageCompresstransportShedSheet = async (event) => {
    const file = event.target.files[0];
    console.log(file)

    if(file.type == 'application/pdf') {

    if(file.size > 5000000){
      alert('File to Big, please select a file less than 5mb')
      setFileuploadedTransShedSheet(false)
    } else {
      values.transportShedSheet = file
      setFileuploadedTransShedSheet(true)
    }
  }else{

    const image = await resizeFilertransportShedSheet(file);
    if(file.size > 2000000){ // Condition Set only for compress more than 2mb files
      valueAppendToImagetransportShedSheet(image)
      setFileuploadedTransShedSheet(true)
    } else {
      values.transportShedSheet = file
      setFileuploadedTransShedSheet(true)
    }
  }
  }

  const dataURLtoFiletransportShedSheet = (dataurl, filename) => {
    var arr = dataurl.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, {type: mime});
  };

  const valueAppendToImagetransportShedSheet = (image) => {

    let file_name = 'dummy'+getRndIntegertransportShedSheet(100001,999999)+'.png'
    let file = dataURLtoFiletransportShedSheet(
      image,
      file_name,
    );

    console.log(file )

    values.transportShedSheet = file
  }

  // will hold a reference for our real input file
  let inputFiletransportShedSheet = '';

  // function to trigger our input file click
  const uploadClicktransportShedSheet = e => {
    e.preventDefault();
    inputFiletransportShedSheet.click();
    return false;
  };

  const getRndIntegertransportShedSheet = (min, max) => {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  useEffect(() => {

    if(values.transportShedSheet) {
      setFileuploadedTransShedSheet(true)
    } else {
      setFileuploadedTransShedSheet(false)
    }

  }, [values.transportShedSheet])
      /* ==================== transportShedSheet Compress End ========================*/


  /* ==================== File ownershipTrans Compress ========================*/
  const resizeFilerownershipTrans = (file) => new Promise(resolve => {
    FileResizer.imageFileResizer(file, 500, 500, 'JPEG', 100, 0,
    uri => {
      resolve(uri);
    }, 'base64' );
  })

  const imageCompressownershipTrans = async (event) => {
    const file = event.target.files[0];
    console.log(file)

    if(file.type == 'application/pdf') {

    if(file.size > 5000000){
      alert('File to Big, please select a file less than 5mb')
      setFileuploadedOwnerTransForm(false)
    } else {
      values.ownershipTrans = file
      setFileuploadedOwnerTransForm(true)
    }
  }else{

    const image = await resizeFilerownershipTrans(file);
    if(file.size > 2000000){ // Condition Set only for compress more than 2mb files
      valueAppendToImageownershipTrans(image)
      setFileuploadedOwnerTransForm(true)
    } else {
      values.ownershipTrans = file
      setFileuploadedOwnerTransForm(true)
    }
  }
  }

  const dataURLtoFileownershipTrans = (dataurl, filename) => {
    var arr = dataurl.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, {type: mime});
  };

  const valueAppendToImageownershipTrans = (image) => {

    let file_name = 'dummy'+getRndIntegerownershipTrans(100001,999999)+'.png'
    let file = dataURLtoFileownershipTrans(
      image,
      file_name,
    );

    console.log(file )

    values.ownershipTrans = file
  }

  // will hold a reference for our real input file
  let inputFileownershipTrans = '';

  // function to trigger our input file click
  const uploadClickownershipTrans = e => {
    e.preventDefault();
    inputFileownershipTrans.click();
    return false;
  };

  const getRndIntegerownershipTrans = (min, max) => {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  useEffect(() => {

    if(values.ownershipTrans) {
      setFileuploadedOwnerTransForm(true)
    } else {
      setFileuploadedOwnerTransForm(false)
    }

  }, [values.ownershipTrans])
  /* ==================== ownershipTrans Compress End ========================*/

  return (
    <>
      {!fetch && <Loader />}
      {fetch && (
        <>
          {screenAccess ? 
            (
              <>
                <CCard>
                  <CTabContent className="m-0 p-0">
                    <CNav variant="pills" layout="justified">
                      <CNavItem>
                        <CNavLink href="#" active>
                          <h5>Hire Vehicle</h5>
                        </CNavLink>
                      </CNavItem>
                    </CNav>
                    <CTabPane role="tabpanel" aria-labelledby="home-tab" visible={true}>
                      <CForm className="container p-3" onSubmit={handleSubmit}>
                        <CRow className="">
                          <CCol md={3}>
                            <CFormLabel htmlFor="vType">Vehicle Type</CFormLabel>
                            <CFormInput
                              name="vType"
                              size="sm"
                              id="vType"
                              value={currentVehicleInfo.vehicle_type_id.type}
                              readOnly
                            />
                          </CCol>

                          <CCol md={3}>
                            <CFormLabel htmlFor="vNum">Vehicle Number / Vehicle Capacity</CFormLabel>
                            <CFormInput
                              name="vNum"
                              size="sm"
                              id="vNum"
                              value={`${currentVehicleInfo.vehicle_number} / ${currentVehicleInfo.vehicle_capacity_id.capacity} TON`}
                              readOnly
                            />
                          </CCol>

                          {/* <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="vCap">Vehicle Capacity In MTS</CFormLabel>
                            <CFormInput
                              name="vCap"
                              size="sm"
                              id="vCap"
                              value={currentVehicleInfo.vehicle_capacity_id.capacity}
                              readOnly
                            />
                          </CCol> */}
                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="dName">Driver Name / Contact Number</CFormLabel>
                            <CFormInput
                              name="dName"
                              size="sm"
                              id="dName"
                              value={`${currentVehicleInfo.driver_name} / ${currentVehicleInfo.driver_contact_number}`}
                              // value={currentVehicleInfo.driver_name}
                              readOnly
                            />
                          </CCol>
                          {/* <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="dMob">Driver Contact Number</CFormLabel>
                            <CFormInput
                              name="dMob"
                              size="sm"
                              id="dMob"
                              value={currentVehicleInfo.driver_contact_number}
                              readOnly
                            />
                          </CCol> */}
                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="gateInDateTime">Gate-In Date & Time</CFormLabel>
                            <CFormInput
                              name="gateInDateTime"
                              size="sm"
                              id="gateInDateTime"
                              value={currentVehicleInfo.gate_in_date_time}
                              readOnly
                            />
                          </CCol>
                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="inspectionDateTime">Inspection Date & Time</CFormLabel>
                            <CFormInput
                              name="inspectionDateTime"
                              size="sm"
                              id="inspectionDateTime"
                              value={currentVehicleInfo.vehicle_inspection.inspection_time}
                              readOnly
                            />
                          </CCol>
                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="panNumbernew">
                              PAN Card Number
                              <REQ />{' '}
                              {/* {errors.panNumber && (
                                <span className="small text-danger">{errors.panNumber}</span>
                              )} */}
                            </CFormLabel>
                            <CInputGroup>
                              <CFormInput
                                size="sm"
                                name="panNumbernew"
                                id="panNumbernew"
                                maxLength={10}
                                value={panNumbernew}
                                readOnly = {panGroupData.length > 0 ? true : false}
                                onFocus={onFocus}
                                onBlur={onBlur}
                                onChange={handleChangenewpan}
                              />
                              {/* <CInputGroupText className="p-0">
                                <CButton size="sm" color="success" onClick={(e) => getPanData(e)}>
                                  <i className="fa fa-check px-1"></i>
                                </CButton>
                              </CInputGroupText> */}
                              <CInputGroupText className="p-0">
                                {panGroupData.length == 0 ? (
                                  <CButton 
                                    size="sm" 
                                    color="success" 
                                    onClick={(e) => getPanData(e)}
                                  >
                                    <i className="fa fa-check px-1"></i>
                                  </CButton>
                                  ) : (
                                    <CButton 
                                      size="sm" 
                                      color="danger" 
                                      onClick={(e) => vendorClear()}
                                    >
                                      <i className="fa fa-refresh px-1"></i>
                                    </CButton>
                                  )
                                }
                              </CInputGroupText>
                            </CInputGroup>
                          </CCol>

                          {panGroupData.length > 0 && (
                            <CCol md={3}>
                              <CFormLabel htmlFor="pan_data">
                                PAN Data <REQ />{' '}
                                {errors.gstType && (
                                  <span className="small text-danger">{errors.gstType}</span>
                                )}
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
                          )}

                          {vendor ? (
                            <VendorAvaiable panData={panData} />
                          ) : (
                            <VendorNotAvailable
                              onFocus={onFocus}
                              onBlur={onBlur}
                              handleChange={handleChange}
                              values={values}
                              errors={errors}
                            />
                          )}

                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="shedName">
                              Shed Name
                              <REQ />{' '}
                              {errors.shedName && (
                                <span className="small text-danger">{errors.shedName}</span>
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
                            {/* <CFormSelect
                              size="sm"
                              name="shedName"
                              className=""
                              id="shedName"
                              onFocus={onFocus}
                              value={values.shedName}
                              onBlur={onBlur}
                              onChange={handleChange}
                            >
                              <option value="0">Select ...</option>
                              {shedNames.map((data) => {
                                return (
                                  <>
                                    <option
                                      key={data.shed_id}
                                      value={data.shed_id}
                                      onClick={() => ShedData(data.shed_id)}
                                    >
                                      {data.shed_name}
                                    </option>
                                  </>
                                )
                              })}
                            </CFormSelect> */}
                          </CCol>
                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="shedownerMob">Shed Mobile Number</CFormLabel>
                            <CFormInput
                              type="text"
                              name="shedownerMob"
                              size="sm"
                              id="shedownerMob"
                              // value={shedData && shedData.shed_owner_phone_1}
                              value={shedMob}
                              readOnly
                            />
                          </CCol>
                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="shedownerWhatsapp">Shed WhatsApp Number</CFormLabel>
                            <CFormInput
                              type="text"
                              name="shedownerWhatsapp"
                              size="sm"
                              id="shedownerWhatsapp"
                              // value={shedData && shedData.shed_owner_phone_2}
                              value={shedWhats}
                              readOnly
                            />
                          </CCol>
                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="insuranceValid">
                              Insurance Validity
                              {/* <REQ />{' '}
                              {errors.insuranceValid && (
                                <span className="small text-danger">{errors.insuranceValid}</span>
                              )} */}
                            </CFormLabel>
                            <CFormSelect
                              size="sm"
                              name="insuranceValid"
                              id="insuranceValid"
                              onFocus={onFocus}
                              onBlur={onBlur}
                              onChange={handleChange}
                            >
                              <option hidden>Select...</option>
                              <option value="1">Valid</option>
                              <option value="0">Invalid</option>
                            </CFormSelect>
                          </CCol>
                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="freightRate">
                              Freight Rate Per Ton
                              <REQ />{' '}
                              {errors.freightRate && (
                                <span className="small text-danger">{errors.freightRate}</span>
                              )}
                            </CFormLabel>
                            <CFormInput
                              type="text"
                              name="freightRate"
                              size="sm"
                              id="freightRate"
                              maxLength={4}
                              onFocus={onFocus}
                              onBlur={onBlur}
                              onChange={handleChange}
                            />
                          </CCol>
                          {!vendor && (
                            <>
                              <CCol xs={12} md={3}>
                                <CFormLabel htmlFor="aadharCopy">
                                  Aadhar Card Copy
                                  {/* <REQ />{' '}
                                  {errors.aadharCopy && (
                                    <span className="small text-danger">{errors.aadharCopy}</span>
                                  )} */}
                                </CFormLabel>
                                <CButton className="w-100 m-0" color="info" size="sm" id="inputAddress">
                                {!fileuploadedAadhar ? (
                                  <>
                                    <span className="float-start" onClick={uploadClickAadhar}>
                                      <CIcon
                                        style={{color:'red'}}
                                        icon={icon.cilFolderOpen}
                                        size="lg"
                                      />
                                      &nbsp;Upload
                                    </span>
                                    <span
                                      style={{marginRight:'10%'}}
                                      className="mr-10 float-end"
                                      onClick={() => {
                                        setCamEnableAadhar(true)
                                      }}
                                    >
                                      <CIcon
                                          style={{color:'red'}}
                                          icon={icon.cilCamera}
                                          size="lg"
                                        />
                                      &nbsp;Camera
                                    </span>
                                  </>
                                ) : (
                                  <>
                                    <span className="float-start">
                                      &nbsp;{values.aadharCopy.name}
                                    </span>
                                    <span className="float-end">
                                      <i
                                        className="fa fa-trash"
                                        aria-hidden="true"
                                        onClick={() => {
                                          setFileuploadedAadhar(false)
                                          values.aadharCopy == ''
                                        }}
                                      ></i>
                                    </span>
                                  </>
                                )}
                              </CButton>
                            <CFormInput
                              type="file"
                              name="aadharCopy"
                              onFocus={onFocus}
                              onBlur={onBlur}
                              onChange={(e)=>{imageCompressAadhar(e)}}
                              size="sm"
                              id="aadharCopy"
                              accept=".jpg,.jpeg,.png,.pdf"
                              style={{display:'none'}}
                              ref={input => {
                                  // assigns a reference so we can trigger it later
                                  inputFile = input;
                              }}
                              />
                              </CCol>
                              <CCol xs={12} md={3}>
                                <CFormLabel htmlFor="panCopy">
                                  PAN Card Copy
                                  {/* <REQ />{' '}
                                  {errors.panCopy && (
                                    <span className="small text-danger">{errors.panCopy}</span>
                                  )} */}
                                </CFormLabel>
                                <CButton className="w-100 m-0" color="info" size="sm" id="inputAddress">
                                {!fileuploadedPan ? (
                                  <>
                                    <span className="float-start" onClick={uploadClickPanCard}>
                                      <CIcon
                                        style={{color:'red'}}
                                        icon={icon.cilFolderOpen}
                                        size="lg"
                                      />
                                      &nbsp;Upload
                                    </span>
                                    <span
                                      style={{marginRight:'10%'}}
                                      className="mr-10 float-end"
                                      onClick={() => {
                                        setCamEnablePan(true)
                                      }}
                                    >
                                      <CIcon
                                          style={{color:'red'}}
                                          icon={icon.cilCamera}
                                          size="lg"
                                        />
                                      &nbsp;Camera
                                    </span>
                                  </>
                                ) : (
                                  <>
                                    <span className="float-start">
                                      &nbsp;{values.panCopy.name}
                                    </span>
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
                            <CFormInput
                              type="file"
                              name="panCopy"
                              onFocus={onFocus}
                              onBlur={onBlur}
                              onChange={(e)=>{imageCompressPanCard(e)}}
                              size="sm"
                              id="panCopy"
                              accept=".jpg,.jpeg,.png,.pdf"
                              style={{display:'none'}}
                              ref={input => {
                                  // assigns a reference so we can trigger it later
                                  inputFilePanCard = input;
                              }}
                              />
                              </CCol>

                              <CCol xs={12} md={3}>
                                <CFormLabel htmlFor="passCopy">
                                  Bank Pass Book Copy
                                  {/* <REQ />{' '}
                                  {errors.passCopy && (
                                    <span className="small text-danger">{errors.passCopy}</span>
                                  )} */}
                                </CFormLabel>
                                <CButton className="w-100 m-0" color="info" size="sm" id="inputAddress">
                                {!fileuploadedPass ? (
                                  <>
                                    <span className="float-start" onClick={uploadClickpassCopy}>
                                      <CIcon
                                        style={{color:'red'}}
                                        icon={icon.cilFolderOpen}
                                        size="lg"
                                      />
                                      &nbsp;Upload
                                    </span>
                                    <span
                                      style={{marginRight:'10%'}}
                                      className="mr-10 float-end"
                                      onClick={() => {
                                        setCamEnablePass(true)
                                      }}
                                    >
                                      <CIcon
                                          style={{color:'red'}}
                                          icon={icon.cilCamera}
                                          size="lg"
                                        />
                                      &nbsp;Camera
                                    </span>
                                  </>
                                ) : (
                                  <>
                                    <span className="float-start">
                                      &nbsp;{values.passCopy.name}
                                    </span>
                                    <span className="float-end">
                                      <i
                                        className="fa fa-trash"
                                        aria-hidden="true"
                                        onClick={() => {
                                          setFileuploadedPass(false)
                                          values.passCopy == ''
                                        }}
                                      ></i>
                                    </span>
                                  </>
                                )}
                              </CButton>
                            <CFormInput
                              type="file"
                              name="passCopy"
                              onFocus={onFocus}
                              onBlur={onBlur}
                              onChange={(e)=>{imageCompresspassCopy(e)}}
                              size="sm"
                              id="passCopy"
                              accept=".jpg,.jpeg,.png,.pdf"
                              style={{display:'none'}}
                              ref={input => {
                                  // assigns a reference so we can trigger it later
                                  inputFilepassCopy = input;
                              }}
                              />
                              </CCol>
                            </>
                          )}

                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="rcFront">
                              RC Copy - Front
                              {/* <REQ />{' '}
                              {errors.rcFront && (
                                <span className="small text-danger">{errors.rcFront}</span>
                              )} */}
                            </CFormLabel>
                            <CButton className="w-100 m-0" color="info" size="sm" id="inputAddress">
                                {!fileuploadedRCFront ? (
                                  <>
                                    <span className="float-start" onClick={uploadClickrcFront}>
                                      <CIcon
                                        style={{color:'red'}}
                                        icon={icon.cilFolderOpen}
                                        size="lg"
                                      />
                                      &nbsp;Upload
                                    </span>
                                    <span
                                      style={{marginRight:'10%'}}
                                      className="mr-10 float-end"
                                      onClick={() => {
                                        setCamEnableRCFront(true)
                                      }}
                                    >
                                      <CIcon
                                          style={{color:'red'}}
                                          icon={icon.cilCamera}
                                          size="lg"
                                        />
                                      &nbsp;Camera
                                    </span>
                                  </>
                                ) : (
                                  <>
                                    <span className="float-start">
                                      &nbsp;{values.rcFront.name}
                                    </span>
                                    <span className="float-end">
                                      <i
                                        className="fa fa-trash"
                                        aria-hidden="true"
                                        onClick={() => {
                                          setFileuploadedRCFront(false)
                                          values.rcFront == ''
                                        }}
                                      ></i>
                                    </span>
                                  </>
                                )}
                              </CButton>
                            <CFormInput
                              type="file"
                              name="rcFront"
                              onFocus={onFocus}
                              onBlur={onBlur}
                              onChange={(e)=>{imageCompressrcFront(e)}}
                              size="sm"
                              id="rcFront"
                              accept=".jpg,.jpeg,.png,.pdf"
                              style={{display:'none'}}
                              ref={input => {
                                  // assigns a reference so we can trigger it later
                                  inputFilercFront = input;
                              }}
                              />
                          </CCol>
                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="rcBack">
                              RC Copy - Back
                              {/* <REQ />{' '}
                              {errors.rcBack && (
                                <span className="small text-danger">{errors.rcBack}</span>
                              )} */}
                            </CFormLabel>
                            <CButton className="w-100 m-0" color="info" size="sm" id="inputAddress">
                                {!fileuploadedRCBack ? (
                                  <>
                                    <span className="float-start" onClick={uploadClickrcBack}>
                                      <CIcon
                                        style={{color:'red'}}
                                        icon={icon.cilFolderOpen}
                                        size="lg"
                                      />
                                      &nbsp;Upload
                                    </span>
                                    <span
                                      style={{marginRight:'10%'}}
                                      className="mr-10 float-end"
                                      onClick={() => {
                                        setCamEnableRCBack(true)
                                      }}
                                    >
                                      <CIcon
                                          style={{color:'red'}}
                                          icon={icon.cilCamera}
                                          size="lg"
                                        />
                                      &nbsp;Camera
                                    </span>
                                  </>
                                ) : (
                                  <>
                                    <span className="float-start">
                                      &nbsp;{values.rcBack.name}
                                    </span>
                                    <span className="float-end">
                                      <i
                                        className="fa fa-trash"
                                        aria-hidden="true"
                                        onClick={() => {
                                          setFileuploadedRCBack(false)
                                          values.rcBack == ''
                                        }}
                                      ></i>
                                    </span>
                                  </>
                                )}
                              </CButton>
                            <CFormInput
                              type="file"
                              name="rcBack"
                              onFocus={onFocus}
                              onBlur={onBlur}
                              onChange={(e)=>{imageCompressrcBack(e)}}
                              size="sm"
                              id="rcBack"
                              accept=".jpg,.jpeg,.png,.pdf"
                              style={{display:'none'}}
                              ref={input => {
                                  // assigns a reference so we can trigger it later
                                  inputFilercBack = input;
                              }}
                              />
                          </CCol>

                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="TDSfront">
                              TDS Declaration Form - Front
                              {/* <REQ />{' '}
                              {errors.TDSfront && (
                                <span className="small text-danger">{errors.TDSfront}</span>
                              )} */}
                            </CFormLabel>
                            <CButton className="w-100 m-0" color="info" size="sm" id="inputAddress">
                                {!fileuploadedTDSFront ? (
                                  <>
                                    <span className="float-start" onClick={uploadClickTDSfront}>
                                      <CIcon
                                        style={{color:'red'}}
                                        icon={icon.cilFolderOpen}
                                        size="lg"
                                      />
                                      &nbsp;Upload
                                    </span>
                                    <span
                                      style={{marginRight:'10%'}}
                                      className="mr-10 float-end"
                                      onClick={() => {
                                        setCamEnableTDSFront(true)
                                      }}
                                    >
                                      <CIcon
                                          style={{color:'red'}}
                                          icon={icon.cilCamera}
                                          size="lg"
                                        />
                                      &nbsp;Camera
                                    </span>
                                  </>
                                ) : (
                                  <>
                                    <span className="float-start">
                                      &nbsp;{values.TDSfront.name}
                                    </span>
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
                            <CFormInput
                              type="file"
                              name="TDSfront"
                              onFocus={onFocus}
                              onBlur={onBlur}
                              onChange={(e)=>{imageCompressTDSfront(e)}}
                              size="sm"
                              id="TDSfront"
                              accept=".jpg,.jpeg,.png,.pdf"
                              style={{display:'none'}}
                              ref={input => {
                                  // assigns a reference so we can trigger it later
                                  inputFileTDSfront = input;
                              }}
                              />
                          </CCol>

                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="TDSback">
                              TDS Declaration Form - Back
                              {/* <REQ />{' '}
                              {errors.TDSback && (
                                <span className="small text-danger">{errors.TDSback}</span>
                              )}{' '} */}
                            </CFormLabel>
                            <CButton className="w-100 m-0" color="info" size="sm" id="inputAddress">
                                {!fileuploadedTDSBack ? (
                                  <>
                                    <span className="float-start" onClick={uploadClickTDSback}>
                                      <CIcon
                                        style={{color:'red'}}
                                        icon={icon.cilFolderOpen}
                                        size="lg"
                                      />
                                      &nbsp;Upload
                                    </span>
                                    <span
                                      style={{marginRight:'10%'}}
                                      className="mr-10 float-end"
                                      onClick={() => {
                                        setCamEnableTDSBack(true)
                                      }}
                                    >
                                      <CIcon
                                          style={{color:'red'}}
                                          icon={icon.cilCamera}
                                          size="lg"
                                        />
                                      &nbsp;Camera
                                    </span>
                                  </>
                                ) : (
                                  <>
                                    <span className="float-start">
                                      &nbsp;{values.TDSback.name}
                                    </span>
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
                            <CFormInput
                              type="file"
                              name="TDSback"
                              onFocus={onFocus}
                              onBlur={onBlur}
                              onChange={(e)=>{imageCompressTDSback(e)}}
                              size="sm"
                              id="TDSback"
                              accept=".jpg,.jpeg,.png,.pdf"
                              style={{display:'none'}}
                              ref={input => {
                                  // assigns a reference so we can trigger it later
                                  inputFileTDSback = input;
                              }}
                              />
                          </CCol>
                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="license">
                              License Copy
                              {/* {!vendor && <REQ />}
                              {!vendor && errors.license && (
                                <span className="small text-danger">{errors.license}</span>
                              )} */}
                            </CFormLabel>
                            <CButton className="w-100 m-0" color="info" size="sm" id="inputAddress">
                                {!fileuploadedLicense ? (
                                  <>
                                    <span className="float-start" onClick={uploadClicklicense}>
                                      <CIcon
                                        style={{color:'red'}}
                                        icon={icon.cilFolderOpen}
                                        size="lg"
                                      />
                                      &nbsp;Upload
                                    </span>
                                    <span
                                      style={{marginRight:'10%'}}
                                      className="mr-10 float-end"
                                      onClick={() => {
                                        setCamEnableLicense(true)
                                      }}
                                    >
                                      <CIcon
                                          style={{color:'red'}}
                                          icon={icon.cilCamera}
                                          size="lg"
                                        />
                                      &nbsp;Camera
                                    </span>
                                  </>
                                ) : (
                                  <>
                                    <span className="float-start">
                                      &nbsp;{values.license.name}
                                    </span>
                                    <span className="float-end">
                                      <i
                                        className="fa fa-trash"
                                        aria-hidden="true"
                                        onClick={() => {
                                          setFileuploadedLicence(false)
                                          values.license == ''
                                        }}
                                      ></i>
                                    </span>
                                  </>
                                )}
                              </CButton>
                            <CFormInput
                              type="file"
                              name="license"
                              onFocus={onFocus}
                              onBlur={onBlur}
                              onChange={(e)=>{imageCompresslicense(e)}}
                              size="sm"
                              id="license"
                              accept=".jpg,.jpeg,.png,.pdf"
                              style={{display:'none'}}
                              ref={input => {
                                  // assigns a reference so we can trigger it later
                                  inputFilelicense = input;
                              }}
                              />
                          </CCol>
                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="insurance">Insurance Copy</CFormLabel>
                            <CButton className="w-100 m-0" color="info" size="sm" id="inputAddress">
                                {!fileuploadedInsurance ? (
                                  <>
                                    <span className="float-start" onClick={uploadClickinsurance}>
                                      <CIcon
                                        style={{color:'red'}}
                                        icon={icon.cilFolderOpen}
                                        size="lg"
                                      />
                                      &nbsp;Upload
                                    </span>
                                    <span
                                      style={{marginRight:'10%'}}
                                      className="mr-10 float-end"
                                      onClick={() => {
                                        setCamEnableInsurance(true)
                                      }}
                                    >
                                      <CIcon
                                          style={{color:'red'}}
                                          icon={icon.cilCamera}
                                          size="lg"
                                        />
                                      &nbsp;Camera
                                    </span>
                                  </>
                                ) : (
                                  <>
                                    <span className="float-start">
                                      &nbsp;{values.insurance.name}
                                    </span>
                                    <span className="float-end">
                                      <i
                                        className="fa fa-trash"
                                        aria-hidden="true"
                                        onClick={() => {
                                          setFileuploadedInsurance(false)
                                          values.insurance == ''
                                        }}
                                      ></i>
                                    </span>
                                  </>
                                )}
                              </CButton>
                            <CFormInput
                              type="file"
                              name="insurance"
                              onFocus={onFocus}
                              onBlur={onBlur}
                              onChange={(e)=>{imageCompressinsurance(e)}}
                              size="sm"
                              id="insurance"
                              accept=".jpg,.jpeg,.png,.pdf"
                              style={{display:'none'}}
                              ref={input => {
                                  // assigns a reference so we can trigger it later
                                  inputFileinsurance = input;
                              }}
                              />
                          </CCol>
                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="transportShedSheet">
                              Transporter Shed Sheet
                              {/* <REQ />{' '}
                              {errors.transportShedSheet && (
                                <span className="small text-danger">{errors.transportShedSheet}</span>
                              )} */}
                            </CFormLabel>
                            <CButton className="w-100 m-0" color="info" size="sm" id="inputAddress">
                                {!fileuploadedTransShedSheet ? (
                                  <>
                                    <span className="float-start" onClick={uploadClicktransportShedSheet}>
                                      <CIcon
                                        style={{color:'red'}}
                                        icon={icon.cilFolderOpen}
                                        size="lg"
                                      />
                                      &nbsp;Upload
                                    </span>
                                    <span
                                      style={{marginRight:'10%'}}
                                      className="mr-10 float-end"
                                      onClick={() => {
                                        setCamEnableTransShed(true)
                                      }}
                                    >
                                      <CIcon
                                          style={{color:'red'}}
                                          icon={icon.cilCamera}
                                          size="lg"
                                        />
                                      &nbsp;Camera
                                    </span>
                                  </>
                                ) : (
                                  <>
                                    <span className="float-start">
                                      &nbsp;{values.transportShedSheet.name}
                                    </span>
                                    <span className="float-end">
                                      <i
                                        className="fa fa-trash"
                                        aria-hidden="true"
                                        onClick={() => {
                                          setFileuploadedTransShedSheet(false)
                                          values.transportShedSheet == ''
                                        }}
                                      ></i>
                                    </span>
                                  </>
                                )}
                              </CButton>
                            <CFormInput
                              type="file"
                              name="transportShedSheet"
                              onFocus={onFocus}
                              onBlur={onBlur}
                              onChange={(e)=>{imageCompresstransportShedSheet(e)}}
                              size="sm"
                              id="transportShedSheet"
                              accept=".jpg,.jpeg,.png,.pdf"
                              style={{display:'none'}}
                              ref={input => {
                                  // assigns a reference so we can trigger it later
                                  inputFiletransportShedSheet = input;
                              }}
                              />
                          </CCol>

                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="ownershipTrans">Ownership Transfer Form</CFormLabel>
                            <CButton className="w-100 m-0" color="info" size="sm" id="inputAddress">
                                {!fileuploadedOwnerTransForm ? (
                                  <>
                                    <span className="float-start" onClick={uploadClickownershipTrans}>
                                      <CIcon
                                        style={{color:'red'}}
                                        icon={icon.cilFolderOpen}
                                        size="lg"
                                      />
                                      &nbsp;Upload
                                    </span>
                                    <span
                                      style={{marginRight:'10%'}}
                                      className="mr-10 float-end"
                                      onClick={() => {
                                        setCamEnableOwnerTrans(true)
                                      }}
                                    >
                                      <CIcon
                                          style={{color:'red'}}
                                          icon={icon.cilCamera}
                                          size="lg"
                                        />
                                      &nbsp;Camera
                                    </span>
                                  </>
                                ) : (
                                  <>
                                    <span className="float-start">
                                      &nbsp;{values.ownershipTrans.name}
                                    </span>
                                    <span className="float-end">
                                      <i
                                        className="fa fa-trash"
                                        aria-hidden="true"
                                        onClick={() => {
                                          setFileuploadedOwnerTransForm(false)
                                          values.ownershipTrans == ''
                                        }}
                                      ></i>
                                    </span>
                                  </>
                                )}
                              </CButton>
                            <CFormInput
                              type="file"
                              name="transportShedSheet"
                              onFocus={onFocus}
                              onBlur={onBlur}
                              onChange={(e)=>{imageCompressownershipTrans(e)}}
                              size="sm"
                              id="transportShedSheet"
                              accept=".jpg,.jpeg,.png,.pdf"
                              style={{display:'none'}}
                              ref={input => {
                                  // assigns a reference so we can trigger it later
                                  inputFileownershipTrans = input;
                              }}
                              />
                          </CCol>

                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="remarks">Remarks</CFormLabel>
                            {/* <CFormTextarea id="remarks" rows="1"></CFormTextarea> */}
                            <CFormTextarea
                              name="remarks"
                              id="remarks"
                              onChange={handleChangenew}
                              onFocus={onFocus}
                              onBlur={onBlur}
                              value={remarks}
                              rows="1"
                            >
                            </CFormTextarea>
                          </CCol>
                        </CRow>

                        <CRow className="pt-3">
                          <CCol>
                            <Link to="/DocsVerify">
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
                          </CCol>

                          <CCol
                            className=""
                            xs={12}
                            sm={12}
                            md={3}
                            style={{ display: 'flex', justifyContent: 'flex-end' }}
                          >
                            {/* addDocumentVerification */}
                            <CButton
                              size="sm"
                              color="warning"
                              className="mx-1 px-2 text-white"
                              type="button"
                              disabled={acceptBtn}
                              onClick={() => {
                                setFetch(false)
                                addDocumentVerification(1)
                              }}
                            >
                              Accept
                            </CButton>
                            <CButton
                              size="sm"
                              color="warning"
                              className="mx-1 px-2 text-white"
                              type="button"
                              disabled={rejectBtn}
                              onClick={() => {
                                setFetch(false)
                                addDocumentVerification(2)
                              }}
                            >
                              Reject
                            </CButton>
                          </CCol>
                        </CRow>
                      </CForm>
                    </CTabPane>
                  </CTabContent>
                </CCard>

                <CModal visible={visible} onClose={() => setVisible(false)}>
                  <CModalHeader>
                    <CModalTitle>Odometer Photo</CModalTitle>
                  </CModalHeader>

                  <CModalBody>
                    <img
                      src="https://media-exp1.licdn.com/dms/image/C560BAQEhfRQblzW2Jw/company-logo_200_200/0/1597849191912?e=2159024400&v=beta&t=GfooSG4SaLjwT3-7D7uTYkhI_3ZT8q64wR-d0e_Ti_s"
                      alt=""
                    />
                  </CModalBody>

                  <CModalFooter>
                    <CButton color="secondary" onClick={() => setVisible(false)}>
                      Close
                    </CButton>
                  </CModalFooter>
                </CModal>

                {/*Camera Image Copy model*/}
                <CModal
                  visible={camEnableAadhar}
                  backdrop="static"
                  onClose={() => {
                    setCamEnableAadhar(false)
                    setImgSrcAadhar("")
                  }}
                >
                  <CModalHeader>
                    <CModalTitle>Aadhar Photo Copy</CModalTitle>
                  </CModalHeader>
                  <CModalBody>

                    {!imgSrcAadhar && (
                      <>
                        <Webcam
                          audio={false}
                          ref={webcamRef}
                          screenshotFormat="image/png"
                          height={200}
                        />
                        <p className='mt-2'>
                          <CButton
                            size="sm"
                            color="warning"
                            className="mx-1 px-2 text-white"
                            type="button"
                            onClick={() => {
                              captureAadhar()
                            }}
                          >
                            Accept
                          </CButton>
                        </p>
                      </>
                    )}
                    {imgSrcAadhar && (

                      <>
                        <img height={200}
                          src={imgSrcAadhar}
                        />
                        <p className='mt-2'>
                          <CButton
                            size="sm"
                            color="warning"
                            className="mx-1 px-2 text-white"
                            type="button"
                            onClick={() => {
                              setImgSrcAadhar("")
                            }}
                          >
                            Delete
                          </CButton>
                        </p>
                      </>
                    )}

                  </CModalBody>
                  <CModalFooter>
                    {imgSrcAadhar &&(
                      <CButton
                        className="m-2"
                        color="warning"
                        onClick={() => {
                          setCamEnableAadhar(false)
                          valueAppendToImageAadhar(imgSrcAadhar)
                        }}
                      >
                        Confirm
                      </CButton>
                    )}
                    <CButton
                      color="secondary"
                      onClick={() => {
                        setCamEnableAadhar(false)
                        setImgSrcAadhar("")
                      }}
                    >
                      Cancel
                    </CButton>
                  </CModalFooter>
                </CModal>

                <CModal
                  visible={camEnablePan}
                  backdrop="static"
                  onClose={() => {
                    setCamEnablePan(false)
                    setImgSrcPan("")
                  }}
                >
                  <CModalHeader>
                    <CModalTitle>PAN Photo Copy</CModalTitle>
                  </CModalHeader>
                  <CModalBody>

                    {!imgSrcPan && (
                      <>
                        <Webcam
                          audio={false}
                          ref={webcamRef}
                          screenshotFormat="image/png"
                          height={200}
                        />
                        <p className='mt-2'>
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
                        <img height={200}
                          src={imgSrcPan}
                        />
                        <p className='mt-2'>
                          <CButton
                            size="sm"
                            color="warning"
                            className="mx-1 px-2 text-white"
                            type="button"
                            onClick={() => {
                              setImgSrcPan("")
                            }}
                          >
                            Delete
                          </CButton>
                        </p>
                      </>
                    )}

                  </CModalBody>
                  <CModalFooter>
                    {imgSrcPan &&(
                      <CButton
                        className="m-2"
                        color="warning"
                        onClick={() => {
                          setCamEnablePan(false)
                          valueAppendToImagePanCard(imgSrcPan)
                        }}
                      >
                        Confirm
                      </CButton>
                    )}
                    <CButton
                      color="secondary"
                      onClick={() => {
                        setCamEnablePan(false)
                        setImgSrcPan("")
                      }}
                    >
                      Cancel
                    </CButton>
                  </CModalFooter>
                </CModal>

                <CModal
                  visible={camEnablePass}
                  backdrop="static"
                  onClose={() => {
                    setCamEnablePass(false)
                    setImgSrcPass("")
                  }}
                >
                  <CModalHeader>
                    <CModalTitle>Bank PassBook Photo Copy</CModalTitle>
                  </CModalHeader>
                  <CModalBody>

                    {!imgSrcPass && (
                      <>
                        <Webcam
                          audio={false}
                          ref={webcamRef}
                          screenshotFormat="image/png"
                          height={200}
                        />
                        <p className='mt-2'>
                          <CButton
                            size="sm"
                            color="warning"
                            className="mx-1 px-2 text-white"
                            type="button"
                            onClick={() => {
                              capturePass()
                            }}
                          >
                            Accept
                          </CButton>
                        </p>
                      </>
                    )}
                    {imgSrcPass && (

                      <>
                        <img height={200}
                          src={imgSrcPass}
                        />
                        <p className='mt-2'>
                          <CButton
                            size="sm"
                            color="warning"
                            className="mx-1 px-2 text-white"
                            type="button"
                            onClick={() => {
                              setImgSrcPass("")
                            }}
                          >
                            Delete
                          </CButton>
                        </p>
                      </>
                    )}

                  </CModalBody>
                  <CModalFooter>
                    {imgSrcPass &&(
                      <CButton
                        className="m-2"
                        color="warning"
                        onClick={() => {
                          setCamEnablePass(false)
                          valueAppendToImagepassCopy(imgSrcPass)
                        }}
                      >
                        Confirm
                      </CButton>
                    )}
                    <CButton
                      color="secondary"
                      onClick={() => {
                        setCamEnablePass(false)
                        setImgSrcPass("")
                      }}
                    >
                      Cancel
                    </CButton>
                  </CModalFooter>
                </CModal>

                <CModal
                  visible={camEnableRCFront}
                  backdrop="static"
                  onClose={() => {
                    setCamEnableRCFront(false)
                    setImgSrcRCFront("")
                  }}
                >
                  <CModalHeader>
                    <CModalTitle>RC Front Photo Copy</CModalTitle>
                  </CModalHeader>
                  <CModalBody>

                    {!imgSrcRCFront && (
                      <>
                        <Webcam
                          audio={false}
                          ref={webcamRef}
                          screenshotFormat="image/png"
                          height={200}
                        />
                        <p className='mt-2'>
                          <CButton
                            size="sm"
                            color="warning"
                            className="mx-1 px-2 text-white"
                            type="button"
                            onClick={() => {
                              captureRCFront()
                            }}
                          >
                            Accept
                          </CButton>
                        </p>
                      </>
                    )}
                    {imgSrcRCFront && (

                      <>
                        <img height={200}
                          src={imgSrcRCFront}
                        />
                        <p className='mt-2'>
                          <CButton
                            size="sm"
                            color="warning"
                            className="mx-1 px-2 text-white"
                            type="button"
                            onClick={() => {
                              setImgSrcRCFront("")
                            }}
                          >
                            Delete
                          </CButton>
                        </p>
                      </>
                    )}

                  </CModalBody>
                  <CModalFooter>
                    {imgSrcRCFront &&(
                      <CButton
                        className="m-2"
                        color="warning"
                        onClick={() => {
                          setCamEnableRCFront(false)
                          valueAppendToImagercFront(imgSrcRCFront)
                        }}
                      >
                        Confirm
                      </CButton>
                    )}
                    <CButton
                      color="secondary"
                      onClick={() => {
                        setCamEnableRCFront(false)
                        setImgSrcRCFront("")
                      }}
                    >
                      Cancel
                    </CButton>
                  </CModalFooter>
                </CModal>

                <CModal
                  visible={camEnableRCBack}
                  backdrop="static"
                  onClose={() => {
                    setCamEnableRCBack(false)
                    setImgSrcRCBack("")
                  }}
                >
                  <CModalHeader>
                    <CModalTitle>RC Back Photo Copy</CModalTitle>
                  </CModalHeader>
                  <CModalBody>

                    {!imgSrcRCBack && (
                      <>
                        <Webcam
                          audio={false}
                          ref={webcamRef}
                          screenshotFormat="image/png"
                          height={200}
                        />
                        <p className='mt-2'>
                          <CButton
                            size="sm"
                            color="warning"
                            className="mx-1 px-2 text-white"
                            type="button"
                            onClick={() => {
                              captureRCBack()
                            }}
                          >
                            Accept
                          </CButton>
                        </p>
                      </>
                    )}
                    {imgSrcRCBack && (

                      <>
                        <img height={200}
                          src={imgSrcRCBack}
                        />
                        <p className='mt-2'>
                          <CButton
                            size="sm"
                            color="warning"
                            className="mx-1 px-2 text-white"
                            type="button"
                            onClick={() => {
                              setImgSrcRCBack("")
                            }}
                          >
                            Delete
                          </CButton>
                        </p>
                      </>
                    )}

                  </CModalBody>
                  <CModalFooter>
                    {imgSrcRCBack &&(
                      <CButton
                        className="m-2"
                        color="warning"
                        onClick={() => {
                          setCamEnableRCBack(false)
                          valueAppendToImagercBack(imgSrcRCBack)
                        }}
                      >
                        Confirm
                      </CButton>
                    )}
                    <CButton
                      color="secondary"
                      onClick={() => {
                        setCamEnableRCBack(false)
                        setImgSrcRCBack("")
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
                    setImgSrcTDSFront("")
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
                          ref={webcamRef}
                          screenshotFormat="image/png"
                          height={200}
                        />
                        <p className='mt-2'>
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
                        <img height={200}
                          src={imgSrcTDSFront}
                        />
                        <p className='mt-2'>
                          <CButton
                            size="sm"
                            color="warning"
                            className="mx-1 px-2 text-white"
                            type="button"
                            onClick={() => {
                              setImgSrcTDSFront("")
                            }}
                          >
                            Delete
                          </CButton>
                        </p>
                      </>
                    )}

                  </CModalBody>
                  <CModalFooter>
                    {imgSrcTDSFront &&(
                      <CButton
                        className="m-2"
                        color="warning"
                        onClick={() => {
                          setCamEnableTDSFront(false)
                          valueAppendToImageTDSfront(imgSrcTDSFront)
                        }}
                      >
                        Confirm
                      </CButton>
                    )}
                    <CButton
                      color="secondary"
                      onClick={() => {
                        setCamEnableTDSFront(false)
                        setImgSrcTDSFront("")
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
                    setImgSrcTDSBack("")
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
                          ref={webcamRef}
                          screenshotFormat="image/png"
                          height={200}
                        />
                        <p className='mt-2'>
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
                        <img height={200}
                          src={imgSrcTDSBack}
                        />
                        <p className='mt-2'>
                          <CButton
                            size="sm"
                            color="warning"
                            className="mx-1 px-2 text-white"
                            type="button"
                            onClick={() => {
                              setImgSrcTDSBack("")
                            }}
                          >
                            Delete
                          </CButton>
                        </p>
                      </>
                    )}

                  </CModalBody>
                  <CModalFooter>
                    {imgSrcTDSBack &&(
                      <CButton
                        className="m-2"
                        color="warning"
                        onClick={() => {
                          setCamEnableTDSBack(false)
                          valueAppendToImageTDSback(imgSrcTDSBack)
                        }}
                      >
                        Confirm
                      </CButton>
                    )}
                    <CButton
                      color="secondary"
                      onClick={() => {
                        setCamEnableTDSBack(false)
                        setImgSrcTDSBack("")
                      }}
                    >
                      Cancel
                    </CButton>
                  </CModalFooter>
                </CModal>

                <CModal
                  visible={camEnableLicense}
                  backdrop="static"
                  onClose={() => {
                    setCamEnableLicense(false)
                    setImgSrcLicense("")
                  }}
                >
                  <CModalHeader>
                    <CModalTitle>License Photo Copy</CModalTitle>
                  </CModalHeader>
                  <CModalBody>

                    {!imgSrcLicense && (
                      <>
                        <Webcam
                          audio={false}
                          ref={webcamRef}
                          screenshotFormat="image/png"
                          height={200}
                        />
                        <p className='mt-2'>
                          <CButton
                            size="sm"
                            color="warning"
                            className="mx-1 px-2 text-white"
                            type="button"
                            onClick={() => {
                              captureLicense()
                            }}
                          >
                            Accept
                          </CButton>
                        </p>
                      </>
                    )}
                    {imgSrcLicense && (

                      <>
                        <img height={200}
                          src={imgSrcLicense}
                        />
                        <p className='mt-2'>
                          <CButton
                            size="sm"
                            color="warning"
                            className="mx-1 px-2 text-white"
                            type="button"
                            onClick={() => {
                              setImgSrcLicense("")
                            }}
                          >
                            Delete
                          </CButton>
                        </p>
                      </>
                    )}

                  </CModalBody>
                  <CModalFooter>
                    {imgSrcLicense &&(
                      <CButton
                        className="m-2"
                        color="warning"
                        onClick={() => {
                          setCamEnableLicense(false)
                          valueAppendToImagelicense(imgSrcLicense)
                        }}
                      >
                        Confirm
                      </CButton>
                    )}
                    <CButton
                      color="secondary"
                      onClick={() => {
                        setCamEnableLicense(false)
                        setImgSrcLicense("")
                      }}
                    >
                      Cancel
                    </CButton>
                  </CModalFooter>
                </CModal>

                <CModal
                  visible={camEnableInsurance}
                  backdrop="static"
                  onClose={() => {
                    setCamEnableInsurance(false)
                    setImgSrcInsurance("")
                  }}
                >
                  <CModalHeader>
                    <CModalTitle>Insurance Photo Copy</CModalTitle>
                  </CModalHeader>
                  <CModalBody>

                    {!imgSrcInsurance && (
                      <>
                        <Webcam
                          audio={false}
                          ref={webcamRef}
                          screenshotFormat="image/png"
                          height={200}
                        />
                        <p className='mt-2'>
                          <CButton
                            size="sm"
                            color="warning"
                            className="mx-1 px-2 text-white"
                            type="button"
                            onClick={() => {
                              captureInsurance()
                            }}
                          >
                            Accept
                          </CButton>
                        </p>
                      </>
                    )}
                    {imgSrcInsurance && (

                      <>
                        <img height={200}
                          src={imgSrcInsurance}
                        />
                        <p className='mt-2'>
                          <CButton
                            size="sm"
                            color="warning"
                            className="mx-1 px-2 text-white"
                            type="button"
                            onClick={() => {
                              setImgSrcInsurance("")
                            }}
                          >
                            Delete
                          </CButton>
                        </p>
                      </>
                    )}

                  </CModalBody>
                  <CModalFooter>
                    {imgSrcInsurance &&(
                      <CButton
                        className="m-2"
                        color="warning"
                        onClick={() => {
                          setCamEnableInsurance(false)
                          valueAppendToImageinsurance(imgSrcInsurance)
                        }}
                      >
                        Confirm
                      </CButton>
                    )}
                    <CButton
                      color="secondary"
                      onClick={() => {
                        setCamEnableInsurance(false)
                        setImgSrcInsurance("")
                      }}
                    >
                      Cancel
                    </CButton>
                  </CModalFooter>
                </CModal>

                <CModal
                  visible={camEnableTransShed}
                  backdrop="static"
                  onClose={() => {
                    setCamEnableTransShed(false)
                    setImgSrcTransShed("")
                  }}
                >
                  <CModalHeader>
                    <CModalTitle>Transporter Sheet Photo Copy</CModalTitle>
                  </CModalHeader>
                  <CModalBody>

                    {!imgSrcTransShed && (
                      <>
                        <Webcam
                          audio={false}
                          ref={webcamRef}
                          screenshotFormat="image/png"
                          height={200}
                        />
                        <p className='mt-2'>
                          <CButton
                            size="sm"
                            color="warning"
                            className="mx-1 px-2 text-white"
                            type="button"
                            onClick={() => {
                              captureTransShed()
                            }}
                          >
                            Accept
                          </CButton>
                        </p>
                      </>
                    )}
                    {imgSrcTransShed && (

                      <>
                        <img height={200}
                          src={imgSrcTransShed}
                        />
                        <p className='mt-2'>
                          <CButton
                            size="sm"
                            color="warning"
                            className="mx-1 px-2 text-white"
                            type="button"
                            onClick={() => {
                              setImgSrcTransShed("")
                            }}
                          >
                            Delete
                          </CButton>
                        </p>
                      </>
                    )}

                  </CModalBody>
                  <CModalFooter>
                    {imgSrcTransShed &&(
                      <CButton
                        className="m-2"
                        color="warning"
                        onClick={() => {
                          setCamEnableTransShed(false)
                          valueAppendToImagetransportShedSheet(imgSrcTransShed)
                        }}
                      >
                        Confirm
                      </CButton>
                    )}
                    <CButton
                      color="secondary"
                      onClick={() => {
                        setCamEnableTransShed(false)
                        setImgSrcTransShed("")
                      }}
                    >
                      Cancel
                    </CButton>
                  </CModalFooter>
                </CModal>

                <CModal
                  visible={camEnableOwnerTrans}
                  backdrop="static"
                  onClose={() => {
                    setCamEnableOwnerTrans(false)
                    setImgSrcOwnerTrans("")
                  }}
                >
                  <CModalHeader>
                    <CModalTitle>Ownership Transfer Photo Copy</CModalTitle>
                  </CModalHeader>
                  <CModalBody>

                    {!imgSrcOwnerTrans && (
                      <>
                        <Webcam
                          audio={false}
                          ref={webcamRef}
                          screenshotFormat="image/png"
                          height={200}
                        />
                        <p className='mt-2'>
                          <CButton
                            size="sm"
                            color="warning"
                            className="mx-1 px-2 text-white"
                            type="button"
                            onClick={() => {
                              captureOwnerTrans()
                            }}
                          >
                            Accept
                          </CButton>
                        </p>
                      </>
                    )}
                    {imgSrcOwnerTrans && (

                      <>
                        <img height={200}
                          src={imgSrcOwnerTrans}
                        />
                        <p className='mt-2'>
                          <CButton
                            size="sm"
                            color="warning"
                            className="mx-1 px-2 text-white"
                            type="button"
                            onClick={() => {
                              setImgSrcOwnerTrans("")
                            }}
                          >
                            Delete
                          </CButton>
                        </p>
                      </>
                    )}

                  </CModalBody>
                  <CModalFooter>
                    {imgSrcOwnerTrans &&(
                      <CButton
                        className="m-2"
                        color="warning"
                        onClick={() => {
                          setCamEnableOwnerTrans(false)
                          valueAppendToImageownershipTrans(imgSrcOwnerTrans)
                        }}
                      >
                        Confirm
                      </CButton>
                    )}
                    <CButton
                      color="secondary"
                      onClick={() => {
                        setCamEnableOwnerTrans(false)
                        setImgSrcOwnerTrans("")
                      }}
                    >
                      Cancel
                    </CButton>
                  </CModalFooter>
                </CModal>
              </>
            ) : (<AccessDeniedComponent />
          )}
        </>
      )}
    </>
  )
}

export default DocVerifyVendorAvail
