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
} from '@coreui/react'
import CustomerCreationService from 'src/Service/CustomerCreation/CustomerCreationService'
import { Link, useNavigate, useParams } from 'react-router-dom'
import useForm from 'src/Hooks/useForm'
import 'react-toastify/dist/ReactToastify.css'
import { ToastContainer, toast } from 'react-toastify'
import React,{ useState, useEffect } from 'react'
import RJCustomerValidation from 'src/Utils/TransactionPages/RJCustomerCreation/RJCustomerValidation'
import BankComponent from 'src/components/commoncomponent/BankComponent'
import Loader from 'src/components/Loader'

import AccessDeniedComponent from 'src/components/commoncomponent/AccessDeniedComponent'
import JavascriptInArrayComponent from 'src/components/commoncomponent/JavascriptInArrayComponent'
import * as LogisticsProScreenNumberConstants from 'src/components/constants/LogisticsProScreenNumberConstants'

import Webcam from 'react-webcam'
import CIcon from '@coreui/icons-react'
import * as icon from '@coreui/icons';

import FileResizer from 'react-image-file-resizer'

const RJcustomerCreation = () => {
  const user_info_json = localStorage.getItem('user_info')
  const user_info = JSON.parse(user_info_json)

  /* Get User Id From Local Storage */
  const user_id = user_info.user_id

  /* ==================== Access Part Start ========================*/
const [screenAccess, setScreenAccess] = useState(false)
let page_no = LogisticsProScreenNumberConstants.RJCustomerModule.Customer_Creation_Request

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
    incoterms_description: '',
    customer_remarks: '',
  }

  const navigation = useNavigate()
  const [errorModal, setErrorModal] = useState(false)
  const [error, setError] = useState({})
  const [fitForLoad, setFitForLoad] = useState('')
  const [acceptBtn, setAcceptBtn] = useState(true)
  const [rejectBtn, setRejectBtn] = useState(true)
  const REQ = () => <span className="text-danger"> * </span>
  const [fetch, setFetch] = useState(false)

  const { values, errors, handleChange, onFocus, handleSubmit, enableSubmit, onBlur, isTouched } =
    useForm(CustomerCreation, RJCustomerValidation, formValues)

  useEffect(() => {
    if (
      isTouched.cMob &&
      isTouched.customer_name &&
      isTouched.createdtype &&
      isTouched.state &&
      isTouched.postalCode &&
      isTouched.district &&
      isTouched.City &&
      isTouched.incoterms_description &&
      isTouched.Payment &&
      !errors.createdtype &&
      !errors.customer_name &&
      !errors.cMob &&
      !errors.postalCode &&
      !errors.district &&
      !errors.state &&
      !errors.City &&
      !errors.street &&
      !errors.area &&
      isTouched.area &&
      isTouched.street
    ) {
      setAcceptBtn(false)
    } else {
      setAcceptBtn(true)
    }
    setFetch(true)
  }, [errors])

  // function getCurrentDate(separator = '') {
  //   let newDate = new Date()
  //   let date = newDate.getDate()
  //   let month = newDate.getMonth() + 1
  //   let year = newDate.getFullYear()
  // }
  //   return `${year}${separator}${month < 10 ? `0${month}` : `${month}`}${separator}${date}`

  function CustomerCreation(status) {
    const formData = new FormData()
    formData.append('creation_type', values.createdtype)
    formData.append('customer_name', values.customer_name)
    formData.append('customer_mobile_number', values.cMob)
    formData.append('customer_PAN_card_number', values.panCard || ' ')
    formData.append('customer_PAN_card', values.panCardattachment)
    formData.append('customer_Aadhar_card_number', values.aadharCard || ' ')
    formData.append('customer_Aadhar_card', values.AadharCopy)
    formData.append('customer_bank_passbook', values.bankPass)
    formData.append('customer_bank_id', values.bankName)
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
    formData.append('customer_remarks', values.customer_remarks || ' ')
    formData.append('customer_status', status)
    formData.append('created_by', user_id)

    CustomerCreationService.createCustomer(formData)
      .then((res) => {
        console.log(res)
        if (res.status === 201) {
          toast.success('Customer Created Successfully!')
          setAcceptBtn(true)
          // setTimeout(() => {
            navigation('/RJcustomerCreationHome')
            setFetch(true)
          // }, 1000)
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
                        {errors.street && (
                          <span className="small text-danger">{errors.street}</span>
                        )}
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
                      <CFormLabel htmlFor="City">
                        City
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
                        {errors.region && (
                          <span className="small text-danger">{errors.region}</span>
                        )}
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

                    <CCol xs={12} md={3}>
                      <CFormLabel htmlFor="panCard">
                        PAN Number
                        {errors.panCard && (
                          <span className="small text-danger">{errors.panCard}</span>
                        )}
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
                        value={values.aadharCard || ''}
                        onFocus={onFocus}
                        onBlur={onBlur}
                        placeholder=""
                      />
                    </CCol>
                    <CCol xs={12} md={3}>
                      <CFormLabel htmlFor="panCardattachment">PAN Card Attatchment</CFormLabel>
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
                          name="panCardattachment"
                          type="file"
                          size="sm"
                          id="panCardattachment"
                          onChange={(e)=>{imageCompress(e)}}
                          onFocus={onFocus}
                          onBlur={onBlur}
                          placeholder=""
                          accept=".jpg,.jpeg"
                          style={{display:'none'}}
                          ref={input => {
                            // assigns a reference so we can trigger it later
                            inputFile = input;
                          }}
                        />
                      </CCol>
                      <CCol xs={12} md={3}>
                        <CFormLabel htmlFor="AadharCopy">Aadhar Card Attachment</CFormLabel>
                        <CButton className="w-100 m-0" color="info" size="sm" id="inputAddress">
                          {!fileuploaded1 ? (
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
                          name="AadharCopy"
                          type="file"
                          size="sm"
                          id="AadharCopy"
                          onChange={(e)=>{imageCompress1(e)}}
                          onFocus={onFocus}
                          onBlur={onBlur}
                          placeholder=""
                          accept=".jpg,.jpeg"
                          style={{display:'none'}}
                          ref={input1 => {
                            // assigns a reference so we can trigger it later
                            inputFile1 = input1;
                          }}
                        />
                      </CCol>
                      <CCol xs={12} md={3}>
                        <CFormLabel htmlFor="bankPass">Bank Passbook</CFormLabel>
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
                          name="bankPass"
                          type="file"
                          size="sm"
                          id="bankPass"
                          onChange={(e)=>{imageCompress2(e)}}
                          onFocus={onFocus}
                          onBlur={onBlur}
                          placeholder=""
                          accept=".jpg,.jpeg"
                          style={{display:'none'}}
                          ref={input2 => {
                            // assigns a reference so we can trigger it later
                            inputFile2 = input2;
                          }}
                        />
                      </CCol>
                      <CCol xs={12} md={3}>
                        <CFormLabel htmlFor="bankName">Bank Name</CFormLabel>
                        <CFormSelect
                          size="sm"
                          name="bankName"
                          onChange={handleChange}
                          onFocus={onFocus}
                          value={values.bankName}
                          className={`mb-1 ${errors.bankName && 'is-invalid'}`}
                          aria-label="Small select example"
                          id="bankName"
                        >
                          <BankComponent />
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
                      <CFormLabel htmlFor="Payment">
                        Payment Terms
                        <REQ />{' '}
                        {errors.Payment && (
                          <span className="small text-danger">{errors.Payment}</span>
                        )}
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
                        {errors.incoterms_description && (
                          <span className="small text-danger">{errors.incoterms_description}</span>
                        )}
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
                        <Link to="/RJcustomerCreationHome"> Previous</Link>
                      </CButton>
                    </CCol>
                    <CCol
                      className="offset-md-6 d-md-flex justify-content-end"
                      xs={12}
                      sm={12}
                      md={3}
                    >
                      <CButton
                        size="sm"
                        color="warning"
                        disabled={acceptBtn}
                        className="mx-3 px-3 text-white"
                        type="button"
                          onClick={() => {
                            setFetch(false)
                            CustomerCreation(1)}}
                        >
                          Submit
                        </CButton>
                        {/* <CButton
                      size="sm"
                      // disabled={enableSubmit}
                      color="warning"
                      className="px-3 text-white"
                      type="submit"
                    >
                      Cancel
                    </CButton> */}
                      </CCol>
                    </CRow>
                  </CForm>
                </CTabPane>
              </CTabContent>
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
            </CCard>
            </>) : (<AccessDeniedComponent />)}
        </>
      )}
    </>
  )
}
export default RJcustomerCreation
