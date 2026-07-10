import {
  CButton,
  CCardImage,
  CCol,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CFormTextarea,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
  CInputGroup,
  CInputGroupText, 
  CFormCheck

} from '@coreui/react'
import React, { useState , useRef, useCallback,useEffect } from 'react'
import { toast } from 'react-toastify' 
import AllDriverListSelectComponent from 'src/components/commoncomponent/AllDriverListSelectComponent' 
import ExpenseIncomePostingDate from 'src/Pages/TripsheetClosure/Calculations/ExpenseIncomePostingDate' 

import Webcam from 'react-webcam'
import CIcon from '@coreui/icons-react'
import * as icon from '@coreui/icons';

import FileResizer from 'react-image-file-resizer'
import DefinitionsListApi from 'src/Service/Definitions/DefinitionsListApi'
import NlmtDriverMasterService from 'src/Service/Nlmt/Masters/NlmtDriverMasterService'
import NlmtDefinitionsListApi from 'src/Service/Nlmt/Masters/NlmtDefinitionsListApi'
import NlmtMobileOTP from 'src/Service/Nlmt/Advance/NlmtMobileOTP'
import NlmtVendorOutstanding from 'src/Service/Nlmt/Advance/NlmtVendorOutstanding'

const NlmtAdvanceCreationOwn = ({
  values,
  errors,
  handleChange, 
  onFocus, 
  onBlur,
  singleVehicleInfo,
  isTouched, 
  dirverAssign, 
  remarks,
  handleChangenew,
  checked,
  setChecked,
  otpVerify,
  setOtpVerify,
  otpGenerated,
  setOtpGenerated
}) => {

  const [OdometerPhoto, setOdometerPhoto] = useState(false)
  const [vendorData, setvendorData] = useState({})
  const [vendor, setVendor] = useState(false)
  const [resendOtp,setResendOtp] = useState(true)
  const [readOnly, setReadOnly] = useState(true)
  const [write, setWrite] = useState(false)
  const [fetch, setFetch] = useState(false)
  const [name, setName] = useState();
  const REQ = () => <span className="text-danger"> * </span>
  const [outstanding, setOutstanding] = useState('')
  const [acceptBtn2, setAcceptBtn2] = useState(true)
  const [mastersLoaded, setMastersLoaded] = useState(false)
  const [vehicleType, setVehicleType] = useState([])
  const [vehicleCapacity, setVehicleCapacity] = useState([])
  const [vehicleBody, setVehicleBody] = useState([])

  useEffect(() => {
    if (!errors.advance_paymented) {
      setAcceptBtn2(false)
    } else {
      setAcceptBtn2(true)
    }
  }, [errors])

  // We need ref in this, because we are dealing
    // with JS setInterval to keep track of it and
    // stop it when needed
  const Ref = useRef(null);

    // The state for our timer
  const [timer, setTimer] = useState('00:00:00');


  const getTimeRemaining = (e) => {
    const total = Date.parse(e) - Date.parse(new Date());
    const seconds = Math.floor((total / 1000) % 60);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    const hours = Math.floor((total / 1000 * 60 * 60) % 24);
    return {
        total, hours, minutes, seconds
    };
  }

  //   useEffect(() => {
  //     clearTimer(getDeadTime());
  // }, []);



  const startTimer = (e) => {
      let { total, hours, minutes, seconds }
                  = getTimeRemaining(e);
      if (total >= 0) {

          // update the timer
          // check if less than 10 then we need to
          // add '0' at the begining of the variable
          setTimer(
              (hours > 9 ? hours : '0' + hours) + ':' +
              (minutes > 9 ? minutes : '0' + minutes) + ':'
              + (seconds > 9 ? seconds : '0' + seconds)
          )
      }
  }

  const clearTimer = (e) => {

    // If you adjust it you should also need to
    // adjust the Endtime formula we are about
    // to code next
    setTimer('00:00:60');

    // If you try to remove this line the
    // updating of timer Variable will be
    // after 1000ms or 1sec
    if (Ref.current) clearInterval(Ref.current);
    const id = setInterval(() => {
        startTimer(e);
    }, 1000)
    Ref.current = id;
  }

  const getDeadTime = () => {
    let deadline = new Date();

    // This is where you need to adjust if
    // you entend to add more time
    deadline.setSeconds(deadline.getSeconds() + 60);
    return deadline;
  }

  useEffect(() => {
    if (values.driver_code) {
      NlmtVendorOutstanding.getVendoroutstanding(values.driver_code).then((res) => {
        setFetch(true)
        let driver_outstanding_data = res.data;
        driver_outstanding_data.map((res)=>{
          console.log(res.L_DMBTR)
            isTouched.driver_outstanding = true
            values.driver_outstanding = res.L_DMBTR;
            setOutstanding(res.L_DMBTR)
          })
      })
    }else {
      values.driver_outstanding = '';
    }
  }, [values.driver_code])


  useEffect(() => {
    NlmtDriverMasterService.getNlmtDriversById(values.driver_id).then((res) => {
      if (res.status === 200) {
        values.driveMobile = res.data.data.driver_phone_1
      }
    })
  }, [values.driver_id])

  const [counter, setCounter] = useState(59);

  const onClickReset = useCallback(async()=>{
    if(otpGenerated) return
    setOtpGenerated(true)
    // await API.onClickReset()
    // setOtpGenerated(false)
    clearTimer(getDeadTime());
  },[otpGenerated])

  const timer1 = () => {
    if(counter > 0){
      setInterval(setCounter(counter - 1), 1000)
      for(var i = 0;i<counter;i++){
        return clearInterval(timer())
      }
      // return clearInterval(timer())
    }
  };

  function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [day, month, year].join('-');
  }

  function OTPgeneration(){
    const formData = new FormData()
    formData.append('parking_id',values.parking_id)
    // formData.append('advance_payment',values.advance_payment)
    console.log(formData)
    NlmtMobileOTP.getOTP(formData).then((res) => {
    if (res.status === 200) {
      setOtpGenerated(true)
      setResendOtp(false)
      setAcceptBtn2(true)
      clearTimer(getDeadTime())
      OTPMessage(true)
      console.log(res)
      toast.success('OTP Send Successfully!')
    }

  })
  }

  function OTPResend(){
    const formData = new FormData()
    formData.append('parking_id', values.parking_id)
    NlmtMobileOTP.getOTP(formData).then((res) => {
    if (res.status === 200) {
      setOtpGenerated(true)
      setResendOtp(false)
      handleChange1
      clearTimer(getDeadTime())
      OTPMessage(true)
      setAcceptBtn2(true)
      console.log(res)
      toast.success('OTP Send Successfully!')
    }
  })
  }

  const OTPMessage = (e) => {
    // e.preventDefault()
  NlmtMobileOTP.gentrateOTP(values.driver_id,values.trip_sheet_no,values.advance_paymented||values.advance_payments).then((res) => {
      if (res.status == 200) {
        setVendor(true)
        setAcceptBtn2(true)
        // toast.success('Send OTP Sucessfully!')
      } else {
        toast.warning('Message Did not Sent')
        setVendor(false)
      }
    })

    setReadOnly(true)
    setWrite(true)
  }

  function OTPVerify(otpValue){
    if (otpValue.target.value.length === 4) {
      const formData = new FormData()
      values.otp = otpValue.target.value
      values.otp1 = otpValue.target.value
      formData.append('parking_id', values.parking_id)
      formData.append('advance_otp', values.otp)
      console.log('res')
      NlmtMobileOTP.VerifyOTP(formData).then((res) => {
        console.log('res')
        console.log(res.status)
        if (res.status == 200) {
          setResendOtp(false)
          setOtpVerify(true)
          console.log(res)
          toast.success('OTP Verified Successfully!')
        }else {
          setResendOtp(true)
          setOtpVerify(false)
          toast.warning('Wrong OTP')
        }
      });
    }
  }

  function handleChange1(e) {
    setChecked(!checked)
    values.advance_paymented = ''
    values.otp = ''
    values.otp1 = ''
    setOtpVerify(false)
    setOtpGenerated(false)
  }

  useEffect(() => {
    Promise.all([
      NlmtDefinitionsListApi.visibleNlmtDefinitionsListByDefinition(2),// Vehicle Capacity
      NlmtDefinitionsListApi.visibleNlmtDefinitionsListByDefinition(1),// Vehicle Body Type
      NlmtDefinitionsListApi.visibleNlmtDefinitionsListByDefinition(3),// Vehicle Type
    ]).then(([cap, body, type]) => {
      setVehicleCapacity(cap.data.data || [])
      setVehicleBody(body.data.data || [])
      setVehicleType(type.data.data || [])
      setMastersLoaded(true)
    })
  }, [])

  const vehicleCapacityName = vehicleCapacity.find(
    (item) =>
      item.definition_list_id ===
      singleVehicleInfo?.vehicle_info?.vehicle_capacity_id
  )?.definition_list_name || '-'

  const vehicleBodyName = vehicleBody.find(
    (item) =>
      item.definition_list_id ===
      singleVehicleInfo?.vehicle_info?.vehicle_body_type_id
  )?.definition_list_name || '-'

  const datevalidation = function () {

    let today = new Date();
    today.setDate(today.getDate() - 3);

    let dd = today.getDate();
    let mm = today.getMonth() + 1;
    let yyyy = today.getFullYear();

    if (dd < 10) {
        dd = '0' + dd
    }
    if (mm < 10) {
        mm = '0' + mm
    }

    today = yyyy + '-' + mm + '-' + dd;

    return today;
  }

  const Expense_Income_Posting_Date = ExpenseIncomePostingDate();

  /* ====================Advance Form Web Cam Start ========================*/
  const webcamRef = React.useRef(null);
  const [fileuploaded, setFileuploaded] = useState(false)
  const [camEnable, setCamEnable] = useState(false)
  const [imgSrc, setImgSrc] = React.useState(null);

  const capture = React.useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImgSrc(imageSrc);
  }, [webcamRef, setImgSrc]);
    const VEHICLE_TYPE_MAP = {
    21: 'Own',
    22: 'Hire',
  }
  /* ====================Advance Form Web Cam End ========================*/

  /* ==================== Advance Form Image ReSize Start ========================*/
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
        values.advance_form = file
        setFileuploaded(true)
      }
    }else{

      const image = await resizeFile(file);
      if(file.size > 2000000){ // Condition Set only for compress more than 2mb files
        valueAppendToImage(image)
        setFileuploaded(true)
      } else {
        values.advance_form = file
        setFileuploaded(true)
      }
    }
  }

  const dataURLtoFile = (dataurl, filename) => {
    var arr = dataurl.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n)

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n)
    }

    return new File([u8arr], filename, {type: mime})
  }

  const valueAppendToImage = (image) => {

    let file_name = 'dummy'+getRndInteger(100001,999999)+'.png'
    let file = dataURLtoFile(
      image,
      file_name,
    );

    console.log(file )

    values.advance_form = file
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

    if(values.advance_form) {
      setFileuploaded(true)
    } else {
      setFileuploaded(false)
    }

  }, [values.advance_form])
  /* ==================== Advance Form Image ReSize End ========================*/

  const [TaxType, setTaxType] = useState([])

  useEffect(() => {
    DefinitionsListApi.visibleDefinitionsListByDefinition(11).then((response) => {
      let tableData = response.data.data
      const filterData = tableData.filter(
        (data) => data.definition_list_status == 1
      )

      setTaxType(filterData)

      // ✅ set default Bank Payment
      const bankPayment = filterData.find(
        (item) => item.definition_list_name === "Bank Payment"
      )

      if (bankPayment) {
        values.payment_mode = bankPayment.definition_list_code  // "2"
      }
    })
  }, [])

  return (
    <>
      <CRow className="">
        <CCol xs={12} md={3}>
          <CFormLabel htmlFor="vType">Vehicle Type</CFormLabel>
          <CFormInput
            size="sm"
            id="vType"
            value={VEHICLE_TYPE_MAP[singleVehicleInfo.vehicle_info.vehicle_type_id] ?? '-'}
            readOnly
          />
        </CCol>
        <CCol xs={12} md={3}>
          <CFormLabel htmlFor="vNum">Vehicle Number</CFormLabel>
          <CFormInput size="sm" id="vNum" value={singleVehicleInfo.vehicle_info.vehicle_number} readOnly />
        </CCol>
        <CCol xs={12} md={3}>
          <CFormLabel htmlFor="vCap">Vehicle Capacity & Body Type</CFormLabel>
          <CFormInput
            size="sm"
            id="vCap"
            value={vehicleCapacityName+' Mts'+' & '+vehicleBodyName}
            readOnly
          />
        </CCol>
        <CCol xs={12} md={3}>
          <CFormLabel htmlFor="OdometerKM">Odometer KM</CFormLabel>
          <CFormInput size="sm" id="OdometerKM" value={singleVehicleInfo.odometer_km} readOnly />
        </CCol>
        <CCol xs={12} md={3}>
          <CFormLabel htmlFor="odoImg">
            Odometer Photo
            {errors.vehicleType && <span className="small text-danger">{errors.vehicleType}</span>}
          </CFormLabel>

          <CButton
            onClick={() => setOdometerPhoto(!OdometerPhoto)}
            className="w-100 m-0"
            color="info"
            size="sm"
            id="odoImg"
          >
            <span className="float-start">
              <i className="fa fa-eye" aria-hidden="true"></i> &nbsp;View
            </span>
          </CButton>
          <CModal visible={OdometerPhoto} onClose={() => setOdometerPhoto(false)}>
            <CModalHeader>
              <CModalTitle>Odometer Photo</CModalTitle>
            </CModalHeader>
            <CModalBody>
              {singleVehicleInfo.odometer_photo &&
              !singleVehicleInfo.odometer_photo.includes('.pdf') ? (
                <CCardImage orientation="top" src={singleVehicleInfo.odometer_photo} />
              ) : (
                <iframe
                  orientation="top"
                  height={500}
                  width={475}
                  src={singleVehicleInfo.odometer_photo}
                ></iframe>
              )}
            </CModalBody>
            {/* <CModalBody>
              <CCardImage orientation="top" src={singleVehicleInfo.odometer_photo} />
            </CModalBody> */}
            <CModalFooter>
              <CButton color="secondary" onClick={() => setOdometerPhoto(false)}>
                Close
              </CButton>
            </CModalFooter>
          </CModal>
        </CCol>
        <CCol xs={12} md={3}>
          <CFormLabel htmlFor="gateInDateTime">Trip-In Date & Time</CFormLabel>
          <CFormInput
            size="sm"
            id="gateInDateTime"
            type="text"
            value={singleVehicleInfo.gate_in_date_time_string}
            readOnly
          />
        </CCol>
        <CCol xs={12} md={3}>
          <CFormLabel htmlFor="inspectionDateTime">Inspection Date & Time</CFormLabel>
          <CFormInput
            size="sm"
            id="inspectionDateTime"
            type="text"
            value={singleVehicleInfo.tripsheet_info.inspection_info.inspection_time_string}
            readOnly
          />
        </CCol>
        <CCol xs={12} md={3}>
          <CFormLabel htmlFor="tripsheet_id">
            Trip Sheet Number
          </CFormLabel>
          <CFormInput
            size="sm"
            // name="tripsheet_sheet_id"
            onFocus={onFocus}
            onBlur={onBlur}
            onChange={handleChange}
            value={singleVehicleInfo.tripsheet_info.nlmt_tripsheet_no}
            // value={singleVehicleInfo.tripsheet_sheet_id}
            // id="tripsheet_id"
            type="text"
            readOnly
          />
        </CCol>
        <CCol xs={12} md={3}>
          <CFormLabel htmlFor="sap_invoice_posting_date">
            Posting Date <REQ />{' '}
            {errors.sap_invoice_posting_date && (
              <span className="small text-danger">{errors.sap_invoice_posting_date}</span>
            )}
          </CFormLabel>
          <CFormInput
            size="sm"
            type="date"
            name="sap_invoice_posting_date"
            id="sap_invoice_posting_date"
            onFocus={onFocus}
            onBlur={onBlur}
            onChange={handleChange}
            value={values.sap_invoice_posting_date}
            // max={new Date().toISOString().split("T")[0]}
            // min={datevalidation()}
            min={Expense_Income_Posting_Date.min_date}
            max={Expense_Income_Posting_Date.max_date}
            onKeyDown={(e) => {
              e.preventDefault();
            }}
          />
        </CCol>
        <CCol xs={12} md={3}>
          <CFormLabel htmlFor="advance">
            Advance Amount 
          </CFormLabel>
          <CInputGroup>
            <CFormInput
              size="sm"
              name="advance"
              onFocus={onFocus}
              onBlur={onBlur}
              onChange={handleChange}
              value={singleVehicleInfo.tripsheet_info.advance_amount}
              id="advance"
              type="text"
              maxLength={6}
              readOnly
            />
            {/* <CInputGroupText className="p-0">
              <span style={{width:"100px"}}>Change</span>
              <CFormCheck
                checked={checked}
                onChange={handleChange1}
                // values={values.Advancechange}
                style={{height:"22px",width:"16px"}}
                name="Advancechange"
                id="Advancechange"
                disabled={otpGenerated}
              />
          </CInputGroupText> */}
          </CInputGroup>
        </CCol>

        {checked && (
          <CCol xs={12} md={3}>
            <CFormLabel htmlFor="advance_paymented">
             Actual Advance Amount<REQ />{' '}
              {errors.advance_paymented && (
                <span className="small text-danger">{errors.advance_paymented}</span>
              )}
            </CFormLabel>
            <CFormInput
              size="sm"
              name="advance_paymented"
              onFocus={onFocus}
              onBlur={onBlur}
              onChange={handleChange}
              value={values.advance_paymented}
              id="advance_paymented"
              type="text"
              maxLength={6}
              className="Advancechange"
              disabled={otpGenerated}
            />
          </CCol>
        )}

        {((!checked && Number(singleVehicleInfo.tripsheet_info.advance_amount) > 0) || (checked && Number(values.advance_paymented) > 0)) &&
          <CCol className="mb-3" md={3}>
            <CFormLabel htmlFor="payment_mode">
                Payment Mode
            </CFormLabel>
            <CFormSelect
              size="sm"
              id="payment_mode"
              name="payment_mode"
              value={values.payment_mode || "2"}
              onFocus={onFocus}
              onBlur={onBlur}
              onChange={handleChange}
              type="text"
              disabled
            >
              <option value="">  Select  </option>
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
        }

        <CCol xs={12} md={3}>
          <CFormLabel htmlFor="driver_id">
            Driver Name
          </CFormLabel>

          {dirverAssign ? (
            <CFormInput
              size="sm"
              id="driverName"
              value={singleVehicleInfo.driver_info.driver_name}
              readOnly
            />
            ) : (
            <CFormSelect
              size="sm"
              name="driver_id"
              onFocus={onFocus}
              onBlur={onBlur}
              onChange={handleChange}
              value={values.driver_id}
              className={`${errors.driver_id && 'is-invalid'}`}
              aria-label="Small select example"
            >
              <AllDriverListSelectComponent />
            </CFormSelect>
          )}
        </CCol>

        <CCol xs={12} md={3}>
          <CFormLabel htmlFor="driver_code">
            Driver Code
          </CFormLabel>
          <CInputGroup>
          <CFormInput
            size="sm"
            name="driver_code"
            onFocus={onFocus}
            onBlur={onBlur}
            value={values.driver_code}
            id="driver_code"
            type="text"
            readOnly
          />
          </CInputGroup>
        </CCol>

        <CCol xs={12} md={3}>
          <CFormLabel htmlFor="driver_outstanding">
            Driver Outstanding
            {errors.driver_outstanding && (
              <span className="small text-danger">{errors.driver_outstanding}</span>
            )}
          </CFormLabel>
          <CFormInput
            size="sm"
            name="driver_outstanding"
            onFocus={onFocus}
            onBlur={onBlur}
            onChange={outstanding}
            value={values.driver_outstanding}
            id="driver_outstanding"
            type="text"
            readOnly
          />

        </CCol>

        {((!checked && Number(singleVehicleInfo.tripsheet_info.advance_amount) > 0) || (checked && Number(values.advance_paymented) > 0)) &&
          <CCol xs={12} md={3}>
            <CFormLabel htmlFor="driveMobile">
              Driver Mobile Number 
            </CFormLabel>
            <CInputGroup>
              <CFormInput size="sm" id="driveMobile" value={values.driveMobile} readOnly />
              {/* <CInputGroupText className="p-0">
                <CButton size="sm"
                  hidden={otpGenerated}
                  disabled={acceptBtn2}
                  style={{color:"primary"}}
                  onClick={ () =>{
                    setFetch(false)
                    OTPgeneration()
                    {vendor}
                  }}
                > 
                  Generate OTP
                </CButton>
                {otpGenerated &&
                  <CButton 
                    size="sm" 
                    class="text-white bg-dark" 
                    checked={checked}
                    fontWeight={500}
                    disabled={(timer === '00:00:00' ? false : true)||otpVerify} 
                    onClick={()=>{
                      clearTimer(getDeadTime())
                      OTPResend()
                    }} 
                    align="center"> Resend
                   
                  </CButton>
                }
              </CInputGroupText> */}
            </CInputGroup>
          </CCol>
        }
        {otpGenerated &&
          <CCol xs={12} md={3}>
            <CFormLabel htmlFor="otp">
              Enter OTP <REQ />{' '} 
            </CFormLabel>
            <CInputGroup>
              <CFormInput
                size="sm"
                name="otp"
                onFocus={onFocus}
                disabled={otpVerify}
                onBlur={onBlur}
                value={values.otp || values.otp1 || ''}
                onChange ={(otp) => {
                  OTPVerify(otp);
                  handleChange(otp);
                }}
                // onClick={ () =>{setFetch(false)
                //   CreateAdvanceOwn(1)}}
                // onClick ={handleChange}
                id="otp"
                type="text"
                maxLength={4}
              />             
            </CInputGroup>
          </CCol>
        } 

        <CCol xs={12} md={3}>
          <CFormLabel htmlFor="advance_form">Advance Form <REQ />{' '}</CFormLabel>
          {errors.advance_form && (
            <span className="small text-danger">{errors.advance_form}</span>
          )}
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
                 
              </>
            ) : (
              <>
                <span className="float-start">
                  &nbsp;{values.advance_form.name}
                </span>
                <span className="float-end">
                  <i
                    className="fa fa-trash"
                    aria-hidden="true"
                    onClick={() => {
                      setFileuploaded(false)
                      values.advance_form == ''
                    }}
                  ></i>
                </span>
              </>
            )}
          </CButton>
          <CFormInput
            name="advance_form"
            type="file"
            size="sm"
            id="advance_form"
            onChange={(e)=>{imageCompress(e)}}
            onFocus={onFocus}
            onBlur={onBlur}
            accept=".jpg,.jpeg,.png,.pdf"
            style={{display:'none'}}
            ref={input => {
              // assigns a reference so we can trigger it later
              inputFile = input;
            }}
          />
        </CCol>

        <CCol xs={12} md={3}>
          <CFormLabel htmlFor="expected_date_time">
            Expected Delivery Date
            {errors.expected_date_time && (
              <span className="small text-danger">{errors.expected_date_time}</span>
            )}
          </CFormLabel>
          <CFormInput
             size="sm"
             id="expected_date_time"
             type="text" 
             readOnly
            value={formatDate(singleVehicleInfo.tripsheet_info.expected_delivery_date || '')}
          />
        </CCol>

        <CCol xs={12} md={3}>
          <CFormLabel htmlFor="expected_return_date_time">
            Expected Return Date
            {errors.expected_return_date_time && (
              <span className="small text-danger">{errors.expected_return_date_time}</span>
            )}
          </CFormLabel>
          <CFormInput
            size="sm"
            id="expected_return_date_time"
            name="expected_return_date_time"
            onFocus={onFocus}
            onBlur={onBlur}
            onChange={handleChange}
            value={formatDate(singleVehicleInfo.tripsheet_info.expected_return_date_time || '')}
            readOnly
          />
        </CCol>
         
        <CCol xs={12} md={3}>
          <CFormLabel htmlFor="remarks">Remarks</CFormLabel>
          <CFormTextarea
            id="remarks"
            name="remarks"
            // className="text-uppercase"
            onFocus={onFocus}
            onBlur={onBlur}
            onChange={handleChangenew}
            value={remarks}
            rows="1"
          >
          </CFormTextarea>
        </CCol>
      </CRow>
      <CModal
        visible={camEnable}
        backdrop="static"
        onClose={() => {
          setCamEnable(false)
          setImgSrc("")
        }}
      >
        <CModalHeader>
          <CModalTitle>Advance Form</CModalTitle>
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
    </>
  )
}

export default NlmtAdvanceCreationOwn
