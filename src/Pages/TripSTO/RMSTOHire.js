/* eslint-disable prettier/prettier */
import {
  CButton,
  CCard,
  CAlert,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CNav,
  CNavItem,
  CNavLink,
  CRow,
  CTabContent,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CTabPane,
  CFormFloating,
  CFormCheck,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CFormTextarea,
  CInputGroupText,
  CInputGroup,
  CSpinner,
} from '@coreui/react'
import React,{  useState, useEffect } from 'react'

import { Link, useNavigate, useParams } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import TripStoService from 'src/Service/TripSTO/TripStoService'
import Loader from 'src/components/Loader'
import ShedListSearchSelect from 'src/components/commoncomponent/ShedListSearchSelect'
// SERVICES FILE
import DocumentVerificationService from 'src/Service/DocsVerify/DocsVerifyService'
import ShedService from 'src/Service/SmallMaster/Shed/ShedService'
import ShedMasterService from 'src/Service/Master/ShedMasterService'
import PanDataService from 'src/Service/SAP/PanDataService'

// VALIDATIONS FILE
import useForm from 'src/Hooks/useForm.js'
import useFormRMSTOHire from 'src/Hooks/useFormRMSTOHire'
import validate from 'src/Utils/Validation'
import DocumentVerificationValidation from 'src/Utils/TransactionPages/DocumentVerification/DocumentVerificationValidation'
import RMSTOHireValidation from 'src/Utils/TripSTO/RMSTOHireValidation'
import VendorCreationService from 'src/Service/VendorCreation/VendorCreationService'
import VendorAvaiable from './Segments/VendorAvaiable'
import VendorNotAvailable from './Segments/VendorNotAvailable'

import Webcam from 'react-webcam'
import CIcon from '@coreui/icons-react'
import * as icon from '@coreui/icons';
import FileResizer from 'react-image-file-resizer'

import AccessDeniedComponent from 'src/components/commoncomponent/AccessDeniedComponent'
import JavascriptInArrayComponent from 'src/components/commoncomponent/JavascriptInArrayComponent'
import * as LogisticsProScreenNumberConstants from 'src/components/constants/LogisticsProScreenNumberConstants'

const RMSTOHire = () => {
  const user_info_json = localStorage.getItem('user_info')
  const user_info = JSON.parse(user_info_json)

  /* Get User Id From Local Storage */
  const user_id = user_info.user_id

   /* ==================== Access Part Start ========================*/
   const [screenAccess, setScreenAccess] = useState(false)
   let page_no = LogisticsProScreenNumberConstants.RMSTOModule.RM_STO_Screen

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
  console.log(id)
  const navigation = useNavigate()
  const [visible, setVisible] = useState(false)
  const [rmstoenable, setRmstoenable] = useState(true)
  const [currentVehicleInfo, setCurrentVehicleInfo] = useState({})
  const [acceptBtn, setAcceptBtn] = useState(true)
  const [rejectBtn, setRejectBtn] = useState(true)
  const [fetch, setFetch] = useState(false)
  const [shedName, setShedName] = useState([])
  // const [shedNames, setShedNames] = useState([])
  const [shedData, setShedData] = useState({})
  const [panNumber, setPanNumber] = useState('')
  const [panData, setPanData] = useState({})
  const [readOnly, setReadOnly] = useState(true)
  const [write, setWrite] = useState(false)
  const [shed_owner_phone_1, setShed_owner_phone_1] = useState('')
  const [shed_owner_phone_2, setShed_owner_phone_2] = useState('')
  const [validateSubmit, setValidateSubmit] = useState(true)
  const [errorModal, setErrorModal] = useState(false)
  const REQ = () => <span className="text-danger"> * </span>
  const [vendor, setVendor] = useState(false) // Vendor Available

  const [pending, setPending] = useState(true)

  const [vehicleSto, setVehicleSto] = useState('')

  // SET FORM VALUES
  const formValues = {
    panNumber: '',
    shedName: '',
    remarks: '',
    ownerName: '',
    ownerMob: '',
    aadhar: '',
    bankAcc: '',
    rcFront: '',
    rcBack: '',
    insuranceValid: '',
    transportShedSheet: '',
    ownershipTrans: '',
    license: '',
    insurance: '',
    // freightRate: '',
  }
  const [shed_Name1, setShed_Name1] = useState('')
  const [shedMob, setShedMob] = useState('')
  const [shedWhats, setShedWhats] = useState('')
  const [WITHT, setWITHT] = useState('')

  const { values, errors, handleChange, onFocus, handleSubmit, enableSubmit, onBlur, isTouched } =
    useFormRMSTOHire(panData, RMSTOHireValidation, formValues)

  // const [vehicleVendors, setVehicleVendors] = useState([])
  // // GET ALL VENDOR DATA FOR THE VEHICLE NO
  // useEffect(() => {
  //   if(currentVehicleInfo.vehicle_number){
  //     // section for getting Vehicle's Vendor Details from database
  //     DocumentVerificationService.getVehicleVendorDetails(currentVehicleInfo.vehicle_number).then((res) => {
  //       console.log(res.data.data,'getVehicleVendorDetails')
  //       setVehicleVendors(res.data.data)
  //     })
  //   }

  // }, [currentVehicleInfo,currentVehicleInfo.vehicle_number])

  // GET PAN DETAILS FROM SAP
  const getPanData = (e) => {
    // setFetch(false)
    e.preventDefault()
    // let panDetail =
    console.log(values.panNumber)
    PanDataService.getPanData(values.panNumber).then((res) => {
      setFetch(true)
      console.log(res)
      if (res.status == 200 && res.data != '') {
        setPanData(res.data[0])
        setWITHT(res.data[0].WITHT)
        toast.success('Pan Details Detected!')
        setVendor(true)
      } else {
        toast.warning('No Pan Details Detected! Fill Up The Fields')
        setVendor(false)
      }
    })

    setReadOnly(true)
    setWrite(true)
  }
  const onChange = (event) => {
    let shedId = event.value
    if (shedId) {
      values.shedName = shedId
      ShedMasterService.getShedById(shedId).then((res) => {
        setShed_Name1(res.data.data.shed_name)
        setShed_owner_phone_1(res.data.data.shed_owner_phone_1)
        setShed_owner_phone_2(res.data.data.shed_owner_phone_2)

      })
     console.log(setShed_Name1)
    } else {
      values.shedName = ''
      setShed_owner_phone_1('')
      setShed_owner_phone_2('')
      // console.log()
    }
  }


  // GET SINGLE SHED DETAILS
  // const ShedData = (id) => {
  //   ShedService.SingleShedData(id).then((resp) => {
  //     setShedData(resp.data.data)
  //   })
  // }

  // GET SINGLE SHED DETAILS
  const ShedData = (id) => {
    // getShedById

    ShedMasterService.getShedById(id).then((resp) => {
      setShedData(resp.data.data)
    })
  }

  useEffect(() => {
    // section for getting Shed Details from database
    ShedMasterService.getShed().then((res) => {
      // console.log(res.data.data)
      setShedName(res.data.data)
    })
  }, [])

  useEffect(() => {
    if (values.shedName != '0') {
      //fetch Shed Pan , Aadhar Number from Shed Master

      // console.log('dd')
      ShedMasterService.getShedById(values.shedName).then((res) => {
        // isTouched.shed_name = true
        // isTouched.shed_pan = true
        // isTouched.shed_aadhar = true
        // isTouched.customerCode = true // double command
        // isTouched.customerCode = true
        // console.log(res.data.data)
        // values.shed_name = res.data.data.shed_id // double command
        // values.shed_pan = res.data.data.pan_number // double command
        // values.shed_aadhar = res.data.data.shed_adhar_number // double command
        setShed_owner_phone_1(res.data.data.shed_owner_phone_1)
        setShed_owner_phone_2(res.data.data.shed_owner_phone_2)
      })
    } else {
      setShed_owner_phone_1('')
      setShed_owner_phone_2('')
      // setShedCode('')
    }
  }, [values.shedName])

  function assignTripSTO(vehicleId) {
    // alert(vehicleId)

    TripStoService.doAssignTripSto(vehicleId).then((res) => {
      if (res.status === 204) {
        toast.success('TripSto Assigned Successfully!')
        window.location.reload(false)
      } else {
        toast.warning('Failed To Assign Trip STO..Kindly Contact Admin.!')
      }
    })
  }

  const assignRMSTOHireVehicle = (data) => {
    console.log(data)
    // console.log(panData.LIFNR)
    console.log(panData)
    if (panData.LIFNR) {
      VendorCreationService.getVendorsByPan().then((res) => {
        // console.log(res)
        console.log(panData)
        let tableData = res.data.data
        // console.log(panData.J_1IPANNO)
        var vendor_info = []

        const filterData = tableData.filter((data) => data.pan_card_number == panData.J_1IPANNO)
        console.log(filterData)
        let vendor_available = filterData.length == 0 ? false : true
        if (vendor_available) {
          vendor_info.push(filterData[filterData.length - 1])
        }
        // console.log(vendor_available)
        // console.log(vendor_info)
        // let pan_number_check = '1'
        // pan_number_check = vendor_available
        //   ? vendor_info.pan_card_number
        //   : panData
        //   ? panData.J_1IPANNO
        //   : ''
        // console.log(vendor_info)
        // console.log(vendor_info[0].pan_card_number)
        // console.log(pan_number_check)
        // debugger // try
        const formData = new FormData()
        formData.append('vehicle_id', currentVehicleInfo.vehicle_id)
        formData.append('parking_id', currentVehicleInfo.parking_yard_gate_id)
        formData.append(
          'pan_number',
          vendor_available ? vendor_info[0].pan_card_number : panData ? panData.J_1IPANNO : ''
        )
        // formData.append('owner_name', vendor_info.owner_name)
        formData.append(
          'owner_name',
          vendor_available ? vendor_info[0].owner_name : panData ? panData.NAME1 : ''
        )
        // formData.append('owner_number', vendor_info.owner_number)
        formData.append(
          'owner_number',
          vendor_available ? vendor_info[0].owner_number : panData ? panData.TELF1 : ''
        )
        // formData.append('aadhar_number', vendor_info.aadhar_card_number)
        formData.append(
          'aadhar_number',
          vendor_available ? vendor_info[0].aadhar_card_number : panData ? panData.IDNUMBER : ''
        )
        // formData.append('bank_acc_number', vendor_info.bank_acc_number)
        formData.append(
          'bank_acc_number',
          vendor_available ? vendor_info[0].bank_acc_number : panData ? panData.BANKN : ''
        )
        // formData.append('vendor_code', vendor_info.vendor_code)
        formData.append(
          'vendor_code',
          vendor_available ? vendor_info[0].vendor_code : panData ? panData.LIFNR : ''
        )
        // formData.append('shed_id', vendor_info.shed_id)values.shedName
        formData.append('shed_id', vendor_available ? vendor_info[0].shed_id : values.shedName)
        formData.append('document_status', 1)
        formData.append('license_copy', values.license || '')
        formData.append('rc_copy_front', values.rcFront)
        formData.append('rc_copy_back', values.rcBack)
        formData.append('insurance_validity', values.insuranceValid)
        formData.append('insurance_copy_front', values.insurance || '')
        formData.append('transport_shed_sheet', values.transportShedSheet)
        formData.append('ownership_transfer_form', values.ownershipTrans)
        formData.append('remarks', remarks ? remarks : '')
        // formData.append('parking_id', vehicleSto) 
        formData.append('created_by', user_id)
        formData.append('naga_rmsto', 'true')
        formData.append('gst_tax_code', WITHT || '')


        DocumentVerificationService.addDocumentVerificationData(formData)
          .then((res) => {
            setFetch(true)
            if (res.status == 200) {
              toast.success('Document Verification Done!')
              navigation('/RMSTOTable')
            } else if (res.status == 204) {
              toast.success('Document Verified for Existing Vendor.!')
              navigation('/RMSTOTable')
            }
          })
          .catch((err) => {
            setFetch(true)
            toast.warning(err)
          })
      })

      // setErrorModal(true)
      // setVehicleSto(data.vehicle_id)
    } else {
      //  =================================================================================================

      // let vendor_existing = 1
      // let vendor_already_created = 0
      // vehicleVendors.map((vc,kc)=>{
      //   if(values.panNumber == vc.pan_card_number){
      //     vc.vendor_code == 0 ? vendor_existing = 0 : vendor_already_created = 1
      //   }
      // })

      // if(vendor_existing == 0 && vendor_already_created == 0){
      //   setFetch(true)
      //   toast.error('Vendor Creation Process Already Pending.. So Kindly Go and Complete the Vendor creation Process..')
      //   return false
      // }

      const formData = new FormData()
      formData.append('vehicle_id', currentVehicleInfo.vehicle_id)
      formData.append('parking_id', currentVehicleInfo.parking_yard_gate_id)
      formData.append('pan_number', values.panNumber)
      formData.append('owner_name', values.ownerName)
      formData.append('owner_number', values.ownerMob)
      formData.append('aadhar_number', values.aadhar)
      formData.append('bank_acc_number', values.bankAcc)
      formData.append('shed_id', values.shedName)
      formData.append('document_status', 1)
      formData.append('license_copy', values.license || '')
      formData.append('rc_copy_front', values.rcFront)
      formData.append('rc_copy_back', values.rcBack)
      formData.append('insurance_validity', values.insuranceValid)
      formData.append('insurance_copy_front', values.insurance || '')
      formData.append('transport_shed_sheet', values.transportShedSheet)
      formData.append('ownership_transfer_form', values.ownershipTrans)
      // formData.append('parking_id', vehicleSto)
      formData.append('created_by', user_id)
      formData.append('remarks', values.remarks ? values.remarks : '')

      console.log(values)
      // console.log(vendor_info)

      TripStoService.assignRMSTOHire(formData)
        .then((res) => {
          setFetch(true)
          if (res.status === 200) {
            toast.success('RMSto Hire Vechile Assigned Successfully!')
            navigation('/RMSTOTable')
          } else {
            toast.warning('Failed To Assign Trip STO..Kindly Contact Admin.!')
          }
        })
        .catch((err) => {
          setFetch(true)
          toast.warning(err)
        })
    }
    // =================================================================================================
  }

  useEffect(() => {
    TripStoService.getSingleVehicleInfoOnParkingYardGate(id).then((res) => {
      console.log(res.data.data)
      console.log(id)
      console.log('id')
      // values.vehicle_id = res.data.data.vehicle_id // double command
      // isTouched.vehicle_id = true
      isTouched.remarks = true
      // isTouched.vType = true
      setCurrentVehicleInfo(res.data.data,'getSingleVehicleInfoOnParkingYardGate')
      setVehicleSto(res.data.data.parking_yard_gate_id)
      setFetch(true)
    })

    console.log(values.ownerMob)
    console.log(values.ownerName)
    console.log(values.panNumber)
    console.log('tesft')
    if (values.ownerMob != '' && values.ownerName != '' && values.panNumber != '') {
      setRmstoenable(false)
    } else {
      setRmstoenable(true)
    }

    // GET ALL SHED DETAILS
    // ShedService.getAllShedData().then((res) => {
    //   setShedNames(res.data.data)
    // })
  }, [id])
  const [remarks, setRemarks] = useState('');
    const handleChangenew = event => {
    const result = event.target.value.toUpperCase();

    setRemarks(result);

  };

/* ====================Web Cam Start ========================*/
const webcamRef = React.useRef(null);
const [fileuploadedLicense, setFileuploadedLicence] = useState(false)
const [fileuploadedRCFront, setFileuploadedRCFront] = useState(false)
const [fileuploadedRCBack, setFileuploadedRCBack] = useState(false)
const [fileuploadedInsurance, setFileuploadedInsurance] = useState(false)
const [fileuploadedTransShedSheet, setFileuploadedTransShedSheet] = useState(false)
const [fileuploadedOwnerTransForm, setFileuploadedOwnerTransForm] = useState(false)

const [camEnableLicense, setCamEnableLicense] = useState(false)
const [camEnableInsurance, setCamEnableInsurance] = useState(false)
const [camEnableRCFront, setCamEnableRCFront] = useState(false)
const [camEnableRCBack, setCamEnableRCBack] = useState(false)
const [camEnableOwnerTrans, setCamEnableOwnerTrans] = useState(false)
const [camEnableTransShed, setCamEnableTransShed] = useState(false)

const [imgSrcLicense, setImgSrcLicense] = React.useState(null);
const [imgSrcInsurance, setImgSrcInsurance] = React.useState(null);
const [imgSrcRCFront, setImgSrcRCFront] = React.useState(null);
const [imgSrcRCBack, setImgSrcRCBack] = React.useState(null);
const [imgSrcTransShed, setImgSrcTransShed] = React.useState(null);
const [imgSrcOwnerTrans, setImgSrcOwnerTrans] = React.useState(null);




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
      {screenAccess ? (
       <>
        <CCard>
          <CTabContent className="m-0 p-0">
            {/* <CNav variant="pills" layout="justified">
            <CNavItem>
              <CNavLink href="#" active>
                <h5>Hire Vehicle</h5>
              </CNavLink>
            </CNavItem>
          </CNav> */}
            <CTabPane role="tabpanel" aria-labelledby="home-tab" visible={true}>
              <CForm className="container p-3" onSubmit={handleSubmit}>
                <CRow className="">
                  <CCol md={3}>
                    <CFormLabel htmlFor="vType">
                      Vehicle Type
                      {/* <CSpinner size="sm" /> */}
                    </CFormLabel>
                    <CFormInput
                      name="vType"
                      size="sm"
                      id="vType"
                      value={fetch ? currentVehicleInfo.vehicle_type_id.type : ''}
                      // value={currentVehicleInfo.vehicle_type_id.type}
                      readOnly
                    />
                  </CCol>

                  <CCol md={3}>
                    <CFormLabel htmlFor="vNum">Vehicle Number</CFormLabel>
                    <CFormInput
                      name="vNum"
                      size="sm"
                      id="vNum"
                      value={fetch ? currentVehicleInfo.vehicle_number : ''}
                      readOnly
                    />
                  </CCol>

                  <CCol xs={12} md={3}>
                    <CFormLabel htmlFor="vCap">Vehicle Capacity In MTS</CFormLabel>
                    <CFormInput
                      name="vCap"
                      size="sm"
                      id="vCap"
                      value={fetch ? currentVehicleInfo.vehicle_capacity_id.capacity : ''}
                      readOnly
                    />
                  </CCol>
                  <CCol xs={12} md={3}>
                    <CFormLabel htmlFor="dName">Driver Name</CFormLabel>
                    <CFormInput
                      name="dName"
                      size="sm"
                      id="dName"
                      value={fetch ? currentVehicleInfo.driver_name : ''}
                      readOnly
                    />
                  </CCol>
                  <CCol xs={12} md={3}>
                    <CFormLabel htmlFor="dMob">Driver Contact Number</CFormLabel>
                    <CFormInput
                      name="dMob"
                      size="sm"
                      id="dMob"
                      value={fetch ? currentVehicleInfo.driver_contact_number : ''}
                      readOnly
                    />
                  </CCol>
                  <CCol xs={12} md={3}>
                    <CFormLabel htmlFor="gateInDateTime">Gate-In Date & Time</CFormLabel>
                    <CFormInput
                      name="gateInDateTime"
                      size="sm"
                      id="gateInDateTime"
                      value={fetch ? currentVehicleInfo.gate_in_date_time : ''}
                      readOnly
                    />
                  </CCol>

                  <CCol xs={12} md={3}>
                    <CFormLabel htmlFor="panNumber">
                      PAN Card Number
                      <REQ />{' '}
                      {errors.panNumber && (
                        <span className="small text-danger">{errors.panNumber}</span>
                      )}
                    </CFormLabel>
                    <CInputGroup>
                      <CFormInput
                        size="sm"
                        name="panNumber"
                        id="panNumber"
                        maxLength={10}
                        value={values.panNumber}
                        onFocus={onFocus}
                        onBlur={onBlur}
                        onChange={handleChange}
                      />
                      <CInputGroupText className="p-0">
                        <CButton size="sm" color="success" onClick={(e) => getPanData(e)}>
                          <i className="fa fa-check px-1"></i>
                        </CButton>
                      </CInputGroupText>
                    </CInputGroup>
                  </CCol>
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

                  {/* <CCol xs={12} md={3}>
                    <CFormLabel htmlFor="panNumber">
                      PAN Card Number*{' '}
                      {errors.panNumber && (
                        <span className="small text-danger">{errors.panNumber}</span>
                      )}
                    </CFormLabel>
                    <CInputGroup>
                      <CFormInput
                        size="sm"
                        name="panNumber"
                        id="panNumber"
                        maxLength={10}
                        value={values.panNumber || panNumber}
                        onFocus={onFocus}
                        onBlur={onBlur}
                        onChange={handleChange}
                      />
                      <CInputGroupText className="p-0">
                        <CButton
                          size="sm"
                          color="primary"
                          onClick={(e) => getPanData(e)}
                          // disabled={
                          //   errors.panNumber ? true : false || values.panNumber ? false : true
                          // }
                        >
                          <i className="fa fa-check px-1"></i>
                        </CButton>
                        <CButton
                          size="sm"
                          color="warning"
                          className="text-white"
                          onClick={() => {
                            values.panNumber = ''
                            values.ownerName = ''
                            values.ownerMob = ''
                            setPanData('')
                            setPanNumber('')
                            setWrite(false)
                          }}
                          // disabled={values.panNumber ? false : true}
                        >
                          <i className="fa fa-ban px-1" aria-hidden="true"></i>
                        </CButton>
                        <CButton
                          size="sm"
                          color="success"
                          className="text-white"
                          onClick={() => {
                            setReadOnly(false)
                          }}
                          disabled={write}
                        >
                          <i className="fa fa-edit px-1" aria-hidden="true"></i>
                        </CButton>
                      </CInputGroupText>
                    </CInputGroup>
                  </CCol>
                  <CCol xs={12} md={3} hidden={!readOnly}>
                    <CFormLabel htmlFor="VendorCode">Vendor Code</CFormLabel>
                    <CFormInput
                      name="VendorCode"
                      size="sm"
                      id="VendorCode"
                      value={panData ? panData.LIFNR : ''}
                      readOnly
                    />
                  </CCol>
                  <CCol xs={12} md={3}>
                    <CFormLabel htmlFor="ownerName">
                      Owner Name{!readOnly && '*'}
                      {!readOnly && errors.ownerName && (
                        <span className="small text-danger">{errors.ownerName}</span>
                      )}
                    </CFormLabel>
                    <CFormInput
                      name="ownerName"
                      size="sm"
                      id="ownerName"
                      value={panData ? panData.NAME1 : values.ownerName}
                      onFocus={onFocus}
                      onBlur={onBlur}
                      onChange={handleChange}
                      readOnly={readOnly}
                    />
                  </CCol>

                  <CCol xs={12} md={3}>
                    <CFormLabel htmlFor="ownerMob">
                      Owner Mobile Number{!readOnly && '*'}
                      {!readOnly && errors.ownerMob && (
                        <span className="small text-danger">{errors.ownerMob}</span>
                      )}
                    </CFormLabel>
                    <CFormInput
                      name="ownerMob"
                      size="sm"
                      id="ownerMob"
                      maxLength={10}
                      value={panData ? panData.TELF1 : values.ownerMob}
                      onFocus={onFocus}
                      onBlur={onBlur}
                      onChange={handleChange}
                      readOnly={readOnly}
                    />
                  </CCol>
                  <CCol xs={12} md={3} hidden={!readOnly}>
                    <CFormLabel htmlFor="aadhar">
                      Aadhar Number{!readOnly && '*'}
                      {!readOnly && errors.aadhar && (
                        <span className="small text-danger">{errors.aadhar}</span>
                      )}
                    </CFormLabel>
                    <CFormInput
                      name="aadhar"
                      size="sm"
                      id="aadhar"
                      maxLength={12}
                      value={panData ? panData.IDNUMBER : ''}
                      onFocus={onFocus}
                      onBlur={onBlur}
                      onChange={handleChange}
                      readOnly={readOnly}
                    />
                  </CCol>
                  <CCol xs={12} md={3} hidden={!readOnly}>
                    <CFormLabel htmlFor="bankAcc">
                      Bank Account Number{!readOnly && '*'}
                      {!readOnly && errors.bankAcc && (
                        <span className="small text-danger">{errors.bankAcc}</span>
                      )}
                    </CFormLabel>
                    <CFormInput
                      name="bankAcc"
                      size="sm"
                      id="bankAcc"
                      maxLength={18}
                      value={panData ? panData.BANKN : ''}
                      onFocus={onFocus}
                      onBlur={onBlur}
                      onChange={handleChange}
                      readOnly={readOnly}
                    />
                  </CCol> */}
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
                  {/* <CCol xs={12} md={3}>
                    <CFormLabel htmlFor="freightRate">
                      Freight Rate Per Ton
                      {/* <REQ />{' '}
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
                  </CCol> */}

                  <CCol xs={12} md={3}>
                    <CFormLabel htmlFor="shedName">
                      Shed Name <REQ />{' '}
                      {errors.shedName && (
                        <span className="small text-danger">{errors.shedName}</span>
                      )}
                    </CFormLabel>
                    <ShedListSearchSelect
                      size="sm"
                      name="shedName"
                      className=""
                      id="shedName"
                      value={values.shedName}
                      onFocus={onFocus}
                      onBlur={onBlur}
                      onChange={(e) => {
                        onChange(e)
                      }}
                      search_type="shed_name"
                    />
                      {/* <option value="0">Select..</option> */}
                      {/* {shedNames.map((data) => {
                        return (
                          <>
                            <option
                              key={data.shed_id}
                              value={data.shed_name}
                              onClick={() => ShedData(data.shed_id)}
                            >
                              {data.shed_name}
                            </option>
                          </>
                        )
                      })} */}
                      {/* {shedName.map(({ shed_id, shed_name }) => {
                        if (shed_id) {
                          return (
                            <>
                              <option
                                key={shed_id}
                                value={shed_id}
                                // onClick={() => ShedData(shed_id)}
                              >
                                {shed_name}
                              </option>
                            </>
                          )
                        }
                      })} */}
                    {/* </CFormSelect> */}
                  </CCol>

                  <CCol xs={12} md={3}>
                    <CFormLabel htmlFor="shedownerMob">Shed Mobile Number</CFormLabel>
                    <CFormInput
                      type="text"
                      name="shedownerMob"
                      size="sm"
                      id="shedownerMob"
                      // value={shedData && shedData.shed_owner_phone_1}
                      value={shed_owner_phone_1}
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
                      value={shed_owner_phone_2}
                      readOnly
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
                      size="sm"
                      id="remarks"
                      name="remarks"
                      value={remarks||''}
                      onFocus={onFocus}
                      onBlur={onBlur}
                      onChange={handleChangenew}
                      rows="1"
                    />
                  </CCol>
                </CRow>

                <CRow>
                  <CCol>
                    <Link to="/RMSTOTable">
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
                      disabled={enableSubmit}
                      // disabled={enableSubmit && rmstoenable}
                      // disabled={rmstoenable}
                      onClick={() => {
                        setFetch(false)
                        assignRMSTOHireVehicle(values)                        
                        // addVendorConfirmation(4)
                      }}
                      // onClick={() => {assignRMSTOHireVehicle(values) setFetch(false)}}
                    >
                      Accept
                    </CButton>
                    {/* <CButton
                      size="sm"
                      color="warning"
                      className="mx-1 px-2 text-white"
                      type="button"
                      disabled={rejectBtn}
                      onClick={() => addDocumentVerification(0)}
                    >
                      Reject
                    </CButton> */}
                  </CCol>
                </CRow>
              </CForm>
            </CTabPane>
          </CTabContent>
        </CCard>
       </>
      ) : (<AccessDeniedComponent />)}
      </>
      )}

      {/* Error Modal Section */}
      <CModal visible={errorModal} onClose={() => setErrorModal(false)}>
        <CModalHeader>
          <CModalTitle className="h4">Trip STO Confirmation</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CRow>
            <CCol>
              <CAlert color="danger" data-aos="fade-down">
                {'Are You Sure to Want to go Trip STO ?'}
              </CAlert>
            </CCol>
          </CRow>
        </CModalBody>
        <CModalFooter>
          <CButton color="primary" onClick={() => assignTripSTO(vehicleSto)}>
            Yes
          </CButton>
          <CButton onClick={() => setErrorModal(false)} color="primary">
            <Link to=""> No </Link>
          </CButton>
        </CModalFooter>
      </CModal>
      {/* Error Modal Section */}

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
  )
}

export default RMSTOHire
