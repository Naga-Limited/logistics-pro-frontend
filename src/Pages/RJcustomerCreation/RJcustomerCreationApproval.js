import {
  CButton,
  CCard,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CFormTextarea,
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
import React,{ useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useForm from 'src/Hooks/useForm.js'
import RJCustomerValidation from 'src/Utils/TransactionPages/RJCustomerCreation/RJCustomerValidation'
import { useParams } from 'react-router-dom'
import RJSaleOrderCreationService from 'src/Service/RJSaleOrderCreation/RJSaleOrderCreationService'
import CustomerCreationService from 'src/Service/CustomerCreation/CustomerCreationService'
import BankComponent from 'src/components/commoncomponent/BankComponent'
import { ToastContainer, toast } from 'react-toastify'
import BankMasterService from 'src/Service/SubMaster/BankMasterService'
import BankService from 'src/Service/Bank/BankService'
import Loader from 'src/components/Loader'

import AccessDeniedComponent from 'src/components/commoncomponent/AccessDeniedComponent'
import JavascriptInArrayComponent from 'src/components/commoncomponent/JavascriptInArrayComponent'
import * as LogisticsProScreenNumberConstants from 'src/components/constants/LogisticsProScreenNumberConstants'

import Webcam from 'react-webcam'
import CIcon from '@coreui/icons-react'
import * as icon from '@coreui/icons';

import FileResizer from 'react-image-file-resizer'

const RJcustomerCreationApproval = () => {

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
let page_no = LogisticsProScreenNumberConstants.RJCustomerModule.Customer_Creation_Approval

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
    const [vehicle_no, setVehicle_no] = useState('')
    const [setCurrentVehicleInfo, CurrentVehicleInfo] = useState('')
    const [bankData, setBankData] = useState([])
    const [currentInfo, setCurrentInfo] = useState({})
    const [fetch, setFetch] = useState(false)
    const [acceptBtn, setAcceptBtn] = useState(true)
    const REQ = () => <span className="text-danger"> * </span>

    const { values, errors, handleChange, onFocus, handleSubmit, enableSubmit, onBlur,isTouched } = useForm(
      CustomerCreation,
      RJCustomerValidation,
      formValues
    )


    function CustomerCreation(status_code) {
      console.log(status_code)
      const formData = new FormData()
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
      formData.append('customer_status', status_code);
      formData.append('customer_remarks',values.customer_remarks || ' ')
      formData.append('customer_bank_id', values.bankName)

      // data.append('customer_status', '')
      CustomerCreationService.updateCustomer(id,formData)
        .then((res) => {
          if (res.status === 200) {
            if (status_code == 2){
            toast.success('Customer Approved Successfully!')
            // setTimeout(() => {
              navigation('/RJcustomerCreationApprovalHome')
              setFetch(false)
            // }, 1000)
          } else {
            toast.warning('Customer Appoval Rejected!')
            // setTimeout(() => {
              navigation('/RJcustomerCreationApprovalHome')
              setFetch(false)
            // }, 1000)
          }
        }
        })


        // .catch((error) => {
        //   var object = error.response.data.errors
        //   var output = ''
        //   for (var property in object) {
        //     output += '*' + object[property] + '\n'
        //   }
        //   setError(output)
        //   setErrorModal(true)
        // })
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
        isTouched.remarks = true
        GetBankData()
        setFetch(true)
      })

    }, [id])
    useEffect(() => {
      if( !errors.customer_name && !errors.cMob && !errors.postalCode && !errors.district &&!errors.state && !errors.City && !errors.area && !errors.street){
        setAcceptBtn(false);
      } else {
        setAcceptBtn(true);
      }
    }, [errors,values])

/* ====================Pan Card Web Cam Start ========================*/
const webcamRef = React.useRef(null);
const [fileuploaded, setFileuploaded] = useState(false)
const [camEnable, setCamEnable] = useState(false)
const [imgSrc, setImgSrc] = React.useState(null);

const capture = React.useCallback(() => {
  const imageSrc = webcamRef.current.getScreenshot();
  setImgSrc(imageSrc);
}, [webcamRef, setImgSrc]);

/* ====================Pan Card Web Cam End ========================*/

/* ==================== Pan Card ReSize Start ========================*/

const resizeFile = (file) => new Promise(resolve => {
  FileResizer.imageFileResizer(file, 1000, 1000, 'JPEG', 100, 0,
  uri => {
    resolve(uri);
  }, 'base64' );
})

const imageCompress = async (event) => {
  const file = event.target.files[0];
  console.log(file)

  if(file.type == 'application/pdf') {

  if(file.size > 5000000){
    alert('File to Big, please select a file less than 5mb')
    setFileuploaded(false)
  } else {
    values.panCardattachment = file
    setFileuploaded(true)
  }
}else{

  const image = await resizeFile(file);
  if(file.size > 2000000){ // Condition Set only for compress more than 2mb files
    valueAppendToImage(image)
    setFileuploaded(true)
  } else {
    values.panCardattachment = file
    setFileuploaded(true)
  }
}
}

  const dataURLtoFile = (dataurl, filename) => {
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

  const valueAppendToImage = (image) => {

    let file_name = 'dummy'+getRndInteger(100001,999999)+'.png'
    let file = dataURLtoFile(
      image,
      file_name,
    );

    console.log(file )

    values.panCardattachment = file
  }

  // will hold a reference for our real input file
  let inputFile = '';

  // function to trigger our input file click
  const uploadClick = e => {
    e.preventDefault();
    inputFile.click();
    return false;
  };

const getRndInteger = (min, max) => {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  useEffect(() => {

    if(values.panCardattachment) {
      setFileuploaded(true)
    } else {
      setFileuploaded(false)
    }

}, [values.panCardattachment])
/* ==================== Pan Card ReSize Start ========================*/

/* ====================Aadhar Copy Web Cam Start ========================*/

  const webcamRef1 = React.useRef(null);
  const [fileuploaded1, setFileuploaded1] = useState(false)
  const [camEnable1, setCamEnable1] = useState(false)
  const [imgSrc1, setImgSrc1] = React.useState(null);

const capture1 = React.useCallback(() => {
  const imageSrc1 = webcamRef1.current.getScreenshot();
  setImgSrc1(imageSrc1);
}, [webcamRef1, setImgSrc1]);

/* ====================Invoice Copy Web Cam End ========================*/

/* ==================== Aadhar Card ReSize Start ========================*/

const resizeFile1 = (file) => new Promise(resolve => {
  FileResizer.imageFileResizer(file, 1000, 1000, 'JPEG', 100, 0,
  uri => {
    resolve(uri);
  }, 'base64' );
})

const imageCompress1 = async (event) => {
  const file = event.target.files[0];
  console.log(file)

  if(file.type == 'application/pdf') {

  if(file.size > 5000000){
    alert('File too Big, please select a file less than 5mb')
    setFileuploaded1(false)
  } else {
    values.AadharCopy = file
    setFileuploaded1(true)
  }
}else{

  const image = await resizeFile1(file);
  if(file.size > 2000000){ // Condition Set only for compress more than 2mb files
    valueAppendToImage1(image)
    setFileuploaded1(true)
  } else {
    values.AadharCopy = file
    setFileuploaded1(true)
  }
}
}

  const dataURLtoFile1 = (dataurl, filename) => {
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

  const valueAppendToImage1 = (image) => {

    let file_name = 'dummy'+getRndInteger1(100001,999999)+'.png'
    let file = dataURLtoFile1(
      image,
      file_name,
    );

    console.log(file)

    values.AadharCopy = file
  }

  // will hold a reference for our real input file
  let inputFile1 = '';

  // function to trigger our input file click
  const uploadClick1 = e => {
    e.preventDefault();
    inputFile1.click();
    return false;
  };

const getRndInteger1 = (min, max) => {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  useEffect(() => {

    if(values.AadharCopy) {
      setFileuploaded1(true)
    } else {
      setFileuploaded1(false)
    }

  }, [values.AadharCopy])

/* ==================== Aadhar Card ReSize End ========================*/

  /* ====================Bank passbook Web Cam Start ========================*/

const webcamRef2 = React.useRef(null);
const [fileuploaded2, setFileuploaded2] = useState(false)
const [camEnable2, setCamEnable2] = useState(false)
const [imgSrc2, setImgSrc2] = React.useState(null);

const capture2 = React.useCallback(() => {
  const imageSrc2 = webcamRef2.current.getScreenshot();
  setImgSrc2(imageSrc2);
}, [webcamRef2, setImgSrc2]);

/* ====================Bank passbook Web Cam End ========================*/

/* ==================== Bank Passbook ReSize Start ========================*/

const resizeFile2 = (file) => new Promise(resolve => {
  FileResizer.imageFileResizer(file, 1000, 1000, 'JPEG', 100, 0,
  uri => {
    resolve(uri);
  }, 'base64' );
})

const imageCompress2 = async (event) => {
  const file = event.target.files[0];
  console.log(file)

  if(file.type == 'application/pdf') {

  if(file.size > 5000000){
    alert('File too Big, please select a file less than 5mb')
    setFileuploaded2(false)
  } else {
    values.bankPass = file
    setFileuploaded2(true)
  }
}else{

  const image = await resizeFile2(file);
  if(file.size > 2000000){ // Condition Set only for compress more than 2mb files
    valueAppendToImage2(image)
    setFileuploaded2(true)
  } else {
    values.bankPass = file
    setFileuploaded2(true)
  }
}
}

  const dataURLtoFile2 = (dataurl, filename) => {
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

  const valueAppendToImage2 = (image) => {

    let file_name = 'dummy'+getRndInteger2(100001,999999)+'.png'
    let file = dataURLtoFile2(
      image,
      file_name,
    );

    console.log(file)

    values.bankPass = file
  }

  // will hold a reference for our real input file
  let inputFile2 = '';

  // function to trigger our input file click
  const uploadClick2 = e => {
    e.preventDefault();
    inputFile2.click();
    return false;
  };

const getRndInteger2 = (min, max) => {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  useEffect(() => {

    if(values.bankPass) {
      setFileuploaded2(true)
    } else {
      setFileuploaded2(false)
    }

  }, [values.bankPass])

/* ==================== Bank Passbook ReSize End ========================*/



console.log(values.panCardattachment)
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
                        {errors.createdtype && (
                          <span className="small text-danger">{errors.createdtype}</span>
                        )}
                      </CFormLabel>

                    <CFormSelect
                      size="sm"
                      id="createdtype"
                      className={`${errors.createdtype && 'is-invalid'}`}
                      name="createdtype"
                      value={values.createdtype}
                      onFocus={onFocus}
                      onBlur={onBlur}
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
                    />
                  </CCol>
                  <CCol xs={12} md={3}>
                    <CFormLabel htmlFor="street">
                      Street Name
                      <REQ />{' '}
                      {errors.street && <span className="small text-danger">{errors.street}</span>}
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
                    />
                  </CCol>

                  <CCol xs={12} md={3}>
                    <CFormLabel htmlFor="area">
                      Area Name
                      <REQ />{' '}
                      {errors.area && <span className="small text-danger">{errors.area}</span>}
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
                    />
                  </CCol>
                  <CCol xs={12} md={3}>
                    <CFormLabel htmlFor="City">City
                    <REQ />{' '}
                    </CFormLabel>
                    {errors.City && <span className="small text-danger">{errors.City}</span>}
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
                      name="district"
                      size="sm"
                      maxLength={20}
                      id="district"
                      onChange={handleChange}
                      value={values.district}
                      onFocus={onFocus}
                      onBlur={onBlur}
                      placeholder=""
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
                        <CButton className="w-100 m-0" color="info" size="sm" id="inputAddress">
                            {!fileuploaded ? (
                                <>
                                  <span className="float-start" onClick={uploadClick}>
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
                                      setCamEnable(true)
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
                                    &nbsp;{values.panCardattachment.name}
                                  </span>
                                  {values.panCardattachment.name == undefined &&
                                  <span className="float-start">
                                  <i
                                      className="fa fa-eye"
                                      onClick={() => setShedOwnerPhoto(true)}
                                      aria-hidden="true"
                                    ></i>{' '}
                                    &nbsp;View
                                  </span>
                                  }
                                  <span className="float-end">
                                    <i
                                      className="fa fa-trash"
                                      aria-hidden="true"
                                      onClick={() => {
                                        setFileuploaded(false)
                                        values.panCardattachment == ''
                                      }}
                                    ></i>
                                  </span>
                                </>
                              )}
                        </CButton>
                      <CFormInput
                        onBlur={onBlur}
                        onChange={(e)=>{imageCompress(e)}}
                        type="file"
                        accept=".jpg,.jpeg,.png,.pdf"
                        name="panCardattachment"
                        size="sm"
                        id="panCardattachment"
                        style={{display:'none'}}
                        ref={input => {
                          // assigns a reference so we can trigger it later
                          inputFile = input;
                        }}
                      />

                  </CCol>
                    <CCol xs={12} md={3}>
                      <CFormLabel htmlFor="panCard">
                        PAN Number
                        {errors.panCard && <span className="small text-danger">{errors.panCard}</span>}
                      </CFormLabel>

                      <CFormInput
                        name="panCard"
                        size="sm"
                        maxLength={10}
                        id="panCard"
                        onChange={handleChange}
                        value={values.panCard || ''}
                        onFocus={onFocus}
                        onBlur={onBlur}
                        placeholder=""
                      />
                    </CCol>

                    <CCol xs={12} md={3}>

                    <CFormLabel htmlFor="AadharCopy">
                    Aadhar Card Photo{' '}
                      {errors.AadharCopy && (
                        <span className="small text-danger">{errors.AadharCopy}</span>
                      )}
                    </CFormLabel>
                       <CButton className="w-100 m-0" color="info" size="sm" id="inputAddress">
                            {!fileuploaded1? (
                                <>
                                  <span className="float-start" onClick={uploadClick1}>
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
                                      setCamEnable1(true)
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
                                    &nbsp;{values.AadharCopy.name}
                                  </span>
                                  {values.AadharCopy.name == undefined &&
                                  <span className="float-start">
                                  <i
                                      className="fa fa-eye"
                                      onClick={() => setAadhar(true)}
                                      aria-hidden="true"
                                    ></i>{' '}
                                    &nbsp;View
                                  </span>
                                  }
                                  <span className="float-end">
                                    <i
                                      className="fa fa-trash"
                                      aria-hidden="true"
                                      onClick={() => {
                                        setFileuploaded1(false)
                                        values.AadharCopy == ''
                                      }}
                                    ></i>
                                  </span>
                                </>
                              )}
                       </CButton>
                      <CFormInput
                        onBlur={onBlur}
                        onChange={(e)=>{imageCompress1(e)}}
                        type="file"
                        accept=".jpg,.jpeg,.png,.pdf"
                        name="AadharCopy"
                        size="sm"
                        id="AadharCopy"
                        style={{display:'none'}}
                        ref={input1 => {
                          // assigns a reference so we can trigger it later
                          inputFile1 = input1;
                        }}
                      />

                </CCol>

                    <CCol xs={12} md={3}>
                      <CFormLabel htmlFor="aadharCard">
                        Aadhar Number
                        {errors.aadharCard && (
                          <span className="small text-danger">{errors.aadharCard}</span>
                        )}
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
                        value={values.aadharCard || ''}
                      />
                    </CCol>

                    <CCol xs={12} md={3}>
                    <CFormLabel htmlFor="bankPass">
                      Bank Passbook{' '}
                      {errors.bankPass && (
                        <span className="small text-danger">{errors.bankPass}</span>
                      )}
                    </CFormLabel>
                       <CButton className="w-100 m-0" color="info" size="sm" id="inputAddress">
                            {!fileuploaded2 ? (
                                <>
                                  <span className="float-start" onClick={uploadClick2}>
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
                                      setCamEnable2(true)
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
                                    &nbsp;{values.bankPass.name}
                                  </span>
                                  {values.bankPass.name == undefined &&
                                  <span className="float-start">
                                  <i
                                      className="fa fa-eye"
                                      onClick={() => setpassbook(true)}
                                      aria-hidden="true"
                                    ></i>{' '}
                                    &nbsp;View
                                  </span>
                                  }
                                  <span className="float-end">
                                    <i
                                      className="fa fa-trash"
                                      aria-hidden="true"
                                      onClick={() => {
                                        setFileuploaded2(false)
                                        values.bankPass == ''
                                      }}
                                    ></i>
                                  </span>
                                </>
                              )}
                       </CButton>
                      <CFormInput
                        onBlur={onBlur}
                        onChange={(e)=>{imageCompress2(e)}}
                        type="file"
                        accept=".jpg,.jpeg,.png,.pdf"
                        name="bankPass"
                        size="sm"
                        id="bankPass"
                        style={{display:'none'}}
                        ref={input2 => {
                          // assigns a reference so we can trigger it later
                          inputFile2 = input2;
                        }}
                      />

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
              >
                <option value="0" selected hidden>
                  Select ...
                </option>
                {
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
                      value={values.bankBranch || ''}
                      onFocus={onFocus}
                      onBlur={onBlur}
                      placeholder=""
                    />
                  </CCol>
                  <CCol xs={12} md={3}>
                    <CFormLabel htmlFor="ifscCode">
                      Bank IFSC Code
                      {errors.ifscCode && (
                        <span className="small text-danger">{errors.ifscCode}</span>
                      )}
                    </CFormLabel>
                    <CFormInput
                      name="ifscCode"
                      size="sm"
                      maxLength={11}
                      id="ifscCode"
                      onChange={handleChange}
                      value={values.ifscCode || ''}
                      onFocus={onFocus}
                      onBlur={onBlur}
                      placeholder=""
                    />
                  </CCol>
                  <CCol xs={12} md={3}>
                    <CFormLabel htmlFor="bankAccount">
                      Bank Account Number
                      {errors.bankAccount && (
                        <span className="small text-danger">{errors.bankAccount}</span>
                      )}
                    </CFormLabel>
                    <CFormInput
                      name="bankAccount"
                      size="sm"
                      maxLength={20}
                      id="bankAccount"
                      onChange={handleChange}
                      value={values.bankAccount || ''}
                      onFocus={onFocus}
                      onBlur={onBlur}
                      placeholder=""
                    />
                  </CCol>
                  <CCol xs={12} md={3}>
                    <CFormLabel htmlFor="GST">
                      GST Number
                      {errors.GST && <span className="small text-danger">{errors.GST}</span>}
                    </CFormLabel>
                    <CFormInput
                      name="GST"
                      size="sm"
                      maxLength={15}
                      id="GST"
                      onChange={handleChange}
                      value={values.GST || ''}
                      onFocus={onFocus}
                      onBlur={onBlur}
                      placeholder=""
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
                  {/* <CCol xs={12} md={3}> */}
                    {/* <CFormLabel htmlFor="customer_payment_id">
                      Payment Type
                      {errors.customer_payment_id && <span className="small text-danger">{errors.customer_payment_id}</span>}
                    </CFormLabel> */}
                    {/* <CFormInput
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
                >
                  <option value={''} hidden selected>
                    Select...
                  </option>
                  <option value="CFR">Cost and Freight</option>
                  <option value="CT1">Customer Regular</option>
                  <option value="FOB">Free on Board</option>
                </CFormSelect>
                </CCol>
                  <CCol xs={12} md={3}>
                    <CFormLabel htmlFor="customer_remarks">Remarks</CFormLabel>
                    <CFormInput
                      name="customer_remarks"
                      size="sm"
                      maxLength={40}
                      id="customer_remarks"
                      onChange={handleChange}
                      value={values.customer_remarks || ''}
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
                      <Link to="/RJcustomerCreationApprovalHome"> Previous</Link>
                    </CButton>
                  </CCol>
                  <CCol className="offset-md-6 d-md-flex justify-content-end" xs={12} sm={12} md={3}>
                    <CButton
                      size="sm"
                      color="warning"
                      disabled={acceptBtn}
                      className="mx-3 px-3 text-white"
                      // type="button"
                      onClick={() => {CustomerCreation(2)
                        setFetch(false)}}
                    >
                      Submit
                    </CButton>

                    <CButton
                      size="sm"
                      // disabled={enableSubmit}
                      color="warning"
                      className="px-3 text-white"
                      type="submit"
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
         </>) : (<AccessDeniedComponent />)}
        </>
      )}
         {/*Pan copy model*/}
         <CModal visible={ShedOwnerPhoto} onClose={() => setShedOwnerPhoto(false)}>
                  <CModalHeader>
                    <CModalTitle>PAN Card Photo</CModalTitle>
                  </CModalHeader>
                  <CModalBody>
                    <CCardImage orientation="top" src={values.panCardattachment} />
                  </CModalBody>
                  <CModalFooter>
                    <CButton color="secondary" onClick={() => setShedOwnerPhoto(false)}>
                      Close
                    </CButton>
                  </CModalFooter>
                </CModal>
                   {/*aadhar copy front model*/}
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
                 {/*Passbook copy Modal*/}
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
          {/*Camera Image Copy model*/}
          <CModal
                    visible={camEnable}
                    backdrop="static"
                    onClose={() => {
                      setCamEnable(false)
                      setImgSrc("")
                    }}
                  >
                    <CModalHeader>
                      <CModalTitle>PAN Card Photo</CModalTitle>
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
                          <p className='mt-2'>
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
                          <img height={200}
                            src={imgSrc}
                          />
                          <p className='mt-2'>
                            <CButton
                              size="sm"
                              color="warning"
                              className="mx-1 px-2 text-white"
                              type="button"
                              onClick={() => {
                                setImgSrc("")
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
                          setImgSrc("")
                        }}
                      >
                        Cancel
                      </CButton>
                    </CModalFooter>
          </CModal>

          <CModal
                    visible={camEnable1}
                    backdrop="static"
                    onClose={() => {
                      setCamEnable1(false)
                      setImgSrc1("")
                    }}
                  >
                    <CModalHeader>
                      <CModalTitle>Aadhar Card Photo</CModalTitle>
                    </CModalHeader>
                    <CModalBody>

                      {!imgSrc1 && (
                        <>
                          <Webcam
                            audio={false}
                            ref={webcamRef1}
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
                                capture1()
                              }}
                            >
                              Accept
                            </CButton>
                          </p>
                        </>
                      )}
                      {imgSrc1 && (

                        <>
                          <img height={200}
                            src={imgSrc1}
                          />
                          <p className='mt-2'>
                            <CButton
                              size="sm"
                              color="warning"
                              className="mx-1 px-2 text-white"
                              type="button"
                              onClick={() => {
                                setImgSrc1("")
                              }}
                            >
                              Delete
                            </CButton>
                          </p>
                        </>
                      )}

                    </CModalBody>
                    <CModalFooter>
                      {imgSrc1 && (
                        <CButton
                          className="m-2"
                          color="warning"
                          onClick={() => {
                            setCamEnable1(false)
                            valueAppendToImage1(imgSrc1)
                          }}
                        >
                          Confirm
                        </CButton>
                      )}
                      <CButton
                        color="secondary"
                        onClick={() => {
                          setCamEnable1(false)
                          setImgSrc1("")
                        }}
                      >
                        Cancel
                      </CButton>
                    </CModalFooter>
          </CModal>

          <CModal
                  visible={camEnable2}
                  backdrop="static"
                  onClose={() => {
                    setCamEnable2(false)
                    setImgSrc2("")
                  }}
                >
                  <CModalHeader>
                    <CModalTitle>Bankpassbook Photo</CModalTitle>
                  </CModalHeader>
                  <CModalBody>

                    {!imgSrc2 && (
                      <>
                        <Webcam
                          audio={false}
                          ref={webcamRef2}
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
                              capture2()
                            }}
                          >
                            Accept
                          </CButton>
                        </p>
                      </>
                    )}
                    {imgSrc2 && (

                      <>
                        <img height={200}
                          src={imgSrc2}
                        />
                        <p className='mt-2'>
                          <CButton
                            size="sm"
                            color="warning"
                            className="mx-1 px-2 text-white"
                            type="button"
                            onClick={() => {
                              setImgSrc2("")
                            }}
                          >
                            Delete
                          </CButton>
                        </p>
                      </>
                    )}

                  </CModalBody>
                  <CModalFooter>
                    {imgSrc2 && (
                      <CButton
                        className="m-2"
                        color="warning"
                        onClick={() => {
                          setCamEnable2(false)
                          valueAppendToImage2(imgSrc2)
                        }}
                      >
                        Confirm
                      </CButton>
                    )}
                    <CButton
                      color="secondary"
                      onClick={() => {
                        setCamEnable2(false)
                        setImgSrc2("")
                      }}
                    >
                      Cancel
                    </CButton>
                  </CModalFooter>
          </CModal>
          {/*Camera Image Copy model*/}

    </>
    )
}

export default RJcustomerCreationApproval
