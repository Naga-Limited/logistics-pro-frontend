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
  CInputGroupText
} from '@coreui/react'
import React, { useState } from 'react'
import { useEffect } from 'react'
import AllDriverListSelectComponent from 'src/components/commoncomponent/AllDriverListSelectComponent'
import DieseVendorSelectComponent from 'src/components/commoncomponent/DieselVendorSelectComponent'
import ExpenseIncomePostingDate from 'src/Pages/TripsheetClosure/Calculations/ExpenseIncomePostingDate'
import DieselIntentCreationService from 'src/Service/DieselIntent/DieselIntentCreationService'

import Webcam from 'react-webcam'
import CIcon from '@coreui/icons-react'
import * as icon from '@coreui/icons';

import FileResizer from 'react-image-file-resizer'
import DefinitionsListApi from 'src/Service/Definitions/DefinitionsListApi'

const NlmtDieselCreationOwn = ({
  values,
  errors,
  handleChange,
  onFocus,
  handleSubmit,
  enableSubmit,
  onBlur,
  singleVehicleInfo,
  isTouched,
  setDirverAssign,
  dirverAssign,
  Purpose,
  SourcedBy,
  DivisonList,
  remarks,
  handleChangenew
}) => {
  const [OdometerPhoto, setOdometerPhoto] = useState(false)
  const [vendorData, setvendorData] = useState({})
  const [vendor, setVendor] = useState(false)
  const [readOnly, setReadOnly] = useState(true)
  const [write, setWrite] = useState(false)
  const [driverPhoneNumberById, setDriverPhoneNumberById] = useState(0)
  const REQ = () => <span className="text-danger"> * </span>
  const [vendor_code, setVendor_code] = useState('')

  useEffect(() => {
    if (values.diesel_vendor_name) {
      DieselIntentCreationService.getDieselInfoById(values.diesel_vendor_name).then((res) => {
            // console.log(res)
            // isTouched.diesel_vendor_id =true
            // values.diesel_vendor_id = res.data.data.diesel_vendor_id
            values.vendor_code = res.data.data.vendor_code
            setVendor_code(res.data.data.vendor_code)
      })
    }else {
      values.vendor_code = ''
    }
  }, [values.diesel_vendor_name])

  useEffect(() => {
    if (values.no_of_ltrs1 && values.rate_of_ltrs1) {
      isTouched.total_amount = true
      values.total_amount1 = Number(values.no_of_ltrs1) * Number(values.rate_of_ltrs1)
    } else {
      values.total_amount1 = ''
    }
  })
  const formatter = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  })
  const formatter1 = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })

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

   /* ====================Bunk Reading Web Cam Start ========================*/
   const webcamRef = React.useRef(null);
   const [fileuploaded, setFileuploaded] = useState(false)
   const [camEnable, setCamEnable] = useState(false)
   const [imgSrc, setImgSrc] = React.useState(null);

   const capture = React.useCallback(() => {
     const imageSrc = webcamRef.current.getScreenshot();
     setImgSrc(imageSrc);
   }, [webcamRef, setImgSrc]);

  /* ====================Bunk Reading Web Cam End ========================*/

 /* ==================== Bunk Reading ReSize Start ========================*/
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
       values.bunk_reading = file
       setFileuploaded(true)
     }
   }else{

     const image = await resizeFile(file);
     if(file.size > 2000000){ // Condition Set only for compress more than 2mb files
       valueAppendToImage(image)
       setFileuploaded(true)
     } else {
       values.bunk_reading = file
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

    values.bunk_reading = file
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

    if(values.bunk_reading) {
      setFileuploaded(true)
    } else {
      setFileuploaded(false)
    }

   }, [values.bunk_reading])
     /* ==================== Bunk Reading Image ReSize End ========================*/

     /* ====================Invoice Copy Web Cam Start ========================*/

  const webcamRef1 = React.useRef(null);
  const [fileuploaded1, setFileuploaded1] = useState(false)
  const [camEnable1, setCamEnable1] = useState(false)
  const [imgSrc1, setImgSrc1] = React.useState(null);

   const capture1 = React.useCallback(() => {
     const imageSrc1 = webcamRef1.current.getScreenshot();
     setImgSrc1(imageSrc1);
   }, [webcamRef1, setImgSrc1]);
  /* ====================Invoice Copy Reading Web Cam End ========================*/

  /* ==================== Invoice Copy Image ReSize Start ========================*/

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
       values.invoice_copy = file
       setFileuploaded1(true)
     }
   }else{

     const image = await resizeFile1(file);
     if(file.size > 2000000){ // Condition Set only for compress more than 2mb files
       valueAppendToImage1(image)
       setFileuploaded1(true)
     } else {
       values.invoice_copy = file
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

    values.invoice_copy = file
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

    if(values.invoice_copy) {
      setFileuploaded1(true)
    } else {
      setFileuploaded1(false)
    }

  }, [values.invoice_copy])

  /* ==================== Invoice Copy Image ReSize End ========================*/

  /* ============================= ASK Part Start ================================= */

  const [sapHsnData, setSapHsnData] = useState([])
  const [tdsMasterData, setTdsMasterData] = useState([])

  useEffect(() => {
    /* section for getting Sap Hsn Data from database */
    DefinitionsListApi.visibleDefinitionsListByDefinition(27).then((response) => {
      console.log(response.data.data,'DefinitionsListApi-setSapHsnData')
      setSapHsnData(response.data.data)
    })

    /* section for getting TDS Master Data from database */
    DefinitionsListApi.visibleDefinitionsListByDefinition(3).then((response) => {
      console.log(response.data.data,'DefinitionsListApi-setTdsMasterData')
      setTdsMasterData(response.data.data)
    })
  }, [])

/* ============================= ASK Part End ================================= */

  return (
    <>
      <CRow className="">
        <CCol xs={12} md={3}>
          <CFormLabel htmlFor="vType">Vehicle Type</CFormLabel>
          <CFormInput
            size="sm"
            id="vType"
            value={singleVehicleInfo.vehicle_type_id.type}
            readOnly
          />
        </CCol>
        <CCol xs={12} md={3}>
          <CFormLabel htmlFor="vNum">Vehicle Number</CFormLabel>
          <CFormInput size="sm" id="vNum" value={singleVehicleInfo.vehicle_number} readOnly />
        </CCol>
        <CCol xs={12} md={3}>
          <CFormLabel htmlFor="vCap">Vehicle Capacity</CFormLabel>
          <CFormInput
            size="sm"
            id="vCap"
            value={singleVehicleInfo.vehicle_capacity_id.capacity}
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
          <CFormLabel htmlFor="gateInDateTime">Gate-In Date & Time</CFormLabel>
          <CFormInput
            size="sm"
            id="gateInDateTime"
            type="text"
            value={singleVehicleInfo.gate_in_date_time_string}
            readOnly
          />
        </CCol>
            {singleVehicleInfo.vehicle_inspection_status==null || '' || undefined ||
            <CCol xs={12} md={3}>
              <CFormLabel htmlFor="inspectionDateTime">Inspection Date & Time</CFormLabel>
              <CFormInput
                size="sm"
                id="inspectionDateTime"
                type="text"
                value={values.inspection_time}
                readOnly
              />
            </CCol>}
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
              value={singleVehicleInfo.trip_sheet_info.trip_sheet_no}
              // value={singleVehicleInfo.tripsheet_sheet_id}
              // id="tripsheet_id"
              type="text"
              readOnly
            />
          </CCol>
          <CCol xs={12} md={3}>
          <CFormLabel htmlFor="driver_id">
            Driver Name
            {errors.driver_id && <span className="small text-danger">{errors.driver_id}</span>}
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
          <CFormLabel htmlFor="driveMobile">
            Driver Mobile Number
            {errors.driveMobile && <span className="small text-danger">{errors.driveMobile}</span>}
          </CFormLabel>
          <CFormInput size="sm" id="driveMobile" value={values.driveMobile} readOnly />
        </CCol>
        <CCol xs={12} md={3}>
          <CFormLabel htmlFor="diesel_vendor_name">
            Vendor Name <REQ />{' '}
            {errors.diesel_vendor_name && <span className="small text-danger">{errors.diesel_vendor_name}</span>}
          </CFormLabel>
            <CFormSelect
              size="sm"
              name="diesel_vendor_name"
              onFocus={onFocus}
              onBlur={onBlur}
              onChange={handleChange}
              value={values.diesel_vendor_name}
              id="vendor_id"
              className={`${errors.diesel_vendor_name && 'is-invalid'}`}
              aria-label="Small select example"
            >
              <DieseVendorSelectComponent/>
            </CFormSelect>
        </CCol>
          <CCol xs={12} md={3}>
          <CFormLabel htmlFor="vendor_code">
            Vendor Code
            {errors.vendor_code && <span className="small text-danger">{errors.vendor_code}</span>}
          </CFormLabel>
          <CFormInput size="sm" name='vendor_code'
           onFocus={onFocus}
           onBlur={onBlur}
           onChange={vendor_code}
            id="vendor_code"
            value={values.vendor_code}
            readOnly />
        </CCol>
        <CCol xs={12} md={3}>
          <CFormLabel htmlFor="diesel_invoice_date">
          Invoice Date
          {errors.diesel_invoice_date && (
          <span className="small text-danger">{errors.diesel_invoice_date}</span>
          )}
          </CFormLabel>
          <CFormInput
          size="sm"
          type="date"
          name="diesel_invoice_date"
          id="diesel_invoice_date"
          onFocus={onFocus}
          onBlur={onBlur}
          onChange={handleChange}
          value={values.diesel_invoice_date}
         />
        </CCol>
        <CCol xs={12} md={3}>
                    <CFormLabel htmlFor="invoice_no">
                      Invoice Number <REQ />{' '}
                      {errors.invoice_no && (
                        <span className="help text-danger">{errors.invoice_no}</span>
                      )}
                    </CFormLabel>
                    <CFormInput
                      name="invoice_no"
                      onFocus={onFocus}
                      onBlur={onBlur}
                      onChange={handleChange}
                      className={`${errors.invoice_no && 'is-invalid'}`}
                      size="sm"
                      id="invoice_no"
                      value={values.invoice_no}
                      maxLength={15}
                    />
                  </CCol>
                  <CCol xs={12} md={3}>
                    <CFormLabel htmlFor="invoice_copy">
                      Invoice Copy <REQ />{' '}
                      {errors.invoice_copy && (
                        <span className="help text-danger">{errors.invoice_copy}</span>
                      )}
                    </CFormLabel>
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
                              &nbsp;{values.invoice_copy.name}
                            </span>
                            <span className="float-end">
                              <i
                                className="fa fa-trash"
                                aria-hidden="true"
                                onClick={() => {
                                  setFileuploaded1(false)
                                  values.invoice_copy == ''
                                }}
                              ></i>
                            </span>
                          </>
                        )}
                      </CButton>
                    <CFormInput
                      type="file"
                      name="invoice_copy"
                      onFocus={onFocus}
                      onBlur={onBlur}
                      onChange={(e)=>{imageCompress1(e)}}
                      className={`${errors.invoice_copy && 'is-invalid'}`}
                      size="sm"
                      id="invoice_copy"
                      accept=".jpg,.jpeg,.png,.pdf"
                      style={{display:'none'}}
                      ref={input1 => {
                          // assigns a reference so we can trigger it later
                          inputFile1 = input1;
                      }}
                    />
                  </CCol>
                   {values.vehicle_type_id != 3 && (
                  <CCol xs={12} md={3}>
                    <CFormLabel htmlFor="rate_of_ltrs1">
                      Rate Per Liter <REQ />{' '}
                      {errors.rate_of_ltrs1 && (
                        <span className="help text-danger">{errors.rate_of_ltrs1}</span>
                      )}
                    </CFormLabel>
                    <CFormInput
                      name="rate_of_ltrs1"
                      onFocus={onFocus}
                      onBlur={onBlur}
                      onChange={handleChange}
                      className={`${errors.rate_of_ltrs1 && 'is-invalid'}`}
                      value={values.rate_of_ltrs1}
                      size="sm"
                      id="rate_of_ltrs1"
                      maxLength={6}
                    />
                  </CCol>)}
                  {values.vehicle_type_id != 3 && (
                  <CCol xs={12} md={3}>
                    <CFormLabel htmlFor="no_of_ltrs1">
                      No. Of Liters <REQ />{' '}
                      {errors.no_of_ltrs1 && (
                        <span className="help text-danger">{errors.no_of_ltrs1}</span>
                      )}
                    </CFormLabel>
                    <CFormInput
                      size="sm"
                      name="no_of_ltrs1"
                      onFocus={onFocus}
                      onBlur={onBlur}
                      onChange={handleChange}
                      id="no_of_ltrs1"
                      // value={(formatter.format(values.no_of_ltrs))}
                      value={values.no_of_ltrs1}
                      maxLength={7}
                    />
                  </CCol>)}
                  <CCol xs={12} md={3}>
                    <CFormLabel htmlFor="sap_invoice_diesel_posting_date">
                      Posting Date
                      {errors.sap_invoice_posting_date && (
                        <span className="small text-danger">{errors.sap_invoice_posting_date}</span>
                      )}
                    </CFormLabel>
                    <CFormInput
                      size="sm"
                      type="date"
                      name="sap_invoice_diesel_posting_date"
                      id="sap_invoice_diesel_posting_date"
                      onFocus={onFocus}
                      onBlur={onBlur}
                      onChange={handleChange}
                      value={values.sap_invoice_diesel_posting_date}
                      // max={new Date().toISOString().split("T")[0]}
                      // min={datevalidation()}
                      min={Expense_Income_Posting_Date.min_date}
                      max={Expense_Income_Posting_Date.max_date}
                      onKeyDown={(e) => {
                        e.preventDefault();
                      }}
                    />
                  </CCol>
                  {values.vehicle_type_id != 3 && (
                    <CCol xs={12} md={3}>
                      <CFormLabel htmlFor="total_amount1">
                        Amount
                        {/* {errors.total_amount && (
                          <span className="help text-danger">{errors.total_amount}</span>
                        )} */}
                      </CFormLabel>
                      <CFormInput
                        name="total_amount1"
                        onFocus={onFocus}
                        onBlur={onBlur}
                        onChange={handleChange}
                        size="sm"
                        value={(formatter1.format(isFinite(values.total_amount1) ? values.total_amount1 : 0))}
                        id="total_amount1"
                        maxLength={6}
                        readOnly
                      />
                    </CCol>
                  )}
                  <CCol xs={12} md={3}>
                    <CFormLabel htmlFor="bunk_reading">
                      Bunk Reading <REQ />{' '}
                      {errors.bunk_reading && (
                        <span className="help text-danger">{errors.bunk_reading}</span>
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
                              &nbsp;{values.bunk_reading.name}
                            </span>
                            <span className="float-end">
                              <i
                                className="fa fa-trash"
                                aria-hidden="true"
                                onClick={() => {
                                  setFileuploaded(false)
                                  values.bunk_reading == ''
                                }}
                              ></i>
                            </span>
                          </>
                        )}
                      </CButton>
                    <CFormInput
                      type="file"
                      name="bunk_reading"
                      onFocus={onFocus}
                      onBlur={onBlur}
                      onChange={(e)=>{imageCompress(e)}}
                      className={`${errors.bunk_reading && 'is-invalid'}`}
                      size="sm"
                      id="bunk_reading"
                      accept=".jpg,.jpeg,.png,.pdf"
                      style={{display:'none'}}
                      ref={input => {
                          // assigns a reference so we can trigger it later
                          inputFile = input;
                      }}
                    />
                  </CCol>
                  {/* ================ ASK Part Start ================ */}
                    <CCol xs={12} md={3}>
                      <CFormLabel htmlFor="vendor_tds">
                        TDS Tax Type <REQ />{' '}
                      </CFormLabel>
                      <CFormSelect
                        size="sm"
                        name="vendor_tds"
                        onFocus={onFocus}
                        onBlur={onBlur}
                        onChange={handleChange}
                        value={values.vendor_tds}
                        className={`${errors.vendor_tds && 'is-invalid'}`}
                        aria-label="Small select example"
                      >
                        <option value="">Select</option>
                        <option value="0">No Tax</option>

                        {tdsMasterData.map(({ definition_list_code, definition_list_name }) => {
                          if (definition_list_code) {
                            return (
                              <>
                                <option
                                  key={definition_list_code}
                                  value={definition_list_code}
                                >
                                  {definition_list_name}
                                </option>
                              </>
                            )
                          }
                        })}
                      </CFormSelect>
                    </CCol>
                    <CCol xs={12} md={3}>
                      <CFormLabel htmlFor="vendor_hsn">
                        HSN Code <REQ />{' '}
                      </CFormLabel>
                      <CFormSelect
                        size="sm"
                        name="vendor_hsn"
                        onFocus={onFocus}
                        onBlur={onBlur}
                        onChange={handleChange}
                        value={values.vendor_hsn}
                        className={`${errors.vendor_hsn && 'is-invalid'}`}
                        aria-label="Small select example"
                      >
                        <option value="">Select</option>

                        {sapHsnData.map(({ definition_list_code, definition_list_name }) => {
                          if (definition_list_code) {
                            return (
                              <>
                                <option
                                  key={definition_list_code}
                                  value={definition_list_code}
                                >
                                  {definition_list_name}
                                </option>
                              </>
                            )
                          }
                        })}
                      </CFormSelect>
                    </CCol>
                  {/* ================ ASK Part End ================ */}
        <CCol xs={12} md={3}>
                  <CFormLabel htmlFor="remarks">Remarks</CFormLabel>
                  <CFormTextarea
                    id="remarks"
                    name="remarks"
                    onFocus={onFocus}
                    onBlur={onBlur}
                    onChange={handleChangenew}
                    value={remarks}
                    rows="1"
                  >
                  </CFormTextarea>
          </CCol>
      </CRow>
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
                <CModalTitle>Bunk Reading Photo</CModalTitle>
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
                <CModalTitle>Invoice Copy Photo</CModalTitle>
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
      {/*Camera Image Copy model*/}
    </>
  )
}

export default NlmtDieselCreationOwn
