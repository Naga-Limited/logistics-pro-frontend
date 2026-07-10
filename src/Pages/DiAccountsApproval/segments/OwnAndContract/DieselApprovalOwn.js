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
} from '@coreui/react'

import React, { useState, } from 'react'
import { useEffect } from 'react'   
import Webcam from 'react-webcam'
import CIcon from '@coreui/icons-react'
import * as icon from '@coreui/icons';
import FileResizer from 'react-image-file-resizer'
import DefinitionsListApi from 'src/Service/Definitions/DefinitionsListApi'
import VendorOutstanding from 'src/Service/SAP/VendorOutstanding'

const DieselCreationOwn = ({
  values,
  errors,
  handleChange,
  onFocus, 
  onBlur,
  singleVehicleInfo,
  isTouched,  
  remarks,
  handleChangenew,
}) => { 

  const [OdometerPhoto1, setOdometerPhoto1] = useState(false)
  const [OdometerPhoto2, setOdometerPhoto2] = useState(false) 

  /* ====================Bunk Reading Web Cam Start ========================*/
  const webcamRef = React.useRef(null);
  const [fileuploaded, setFileuploaded] = useState(false)
  const [camEnable, setCamEnable] = useState(false)
  const [imgSrc, setImgSrc] = React.useState(null)

  const capture = React.useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot()
    setImgSrc(imageSrc)
  }, [webcamRef, setImgSrc])
  /* ====================Bunk Reading Web Cam End ========================*/

  /* ==================== Bunk Reading ReSize Start ========================*/
  const resizeFile = (file) => new Promise(resolve => {
    FileResizer.imageFileResizer(file, 1000, 1000, 'JPEG', 100, 0,
    uri => {
      resolve(uri)
    }, 'base64' )
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

    } else {

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
  }

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
    } else { 

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
  }

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
  }

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
  const [sapDieselRate, setSapDieselRate] = useState(0) 

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

    let formData = new FormData()
    formData.append('CUSTOMER', 1006) 
    formData.append('POST_DATE', values.sap_invoice_diesel_posting_date) 

    VendorOutstanding.getNLFSDieselInfo(formData).then((res) => {  
      let op_array = res.data[0] 
      console.log(op_array,'getNLFSDieselRate');
      if(op_array.STATUS == 1){
        setSapDieselRate(op_array.AMOUNT)
      } else {
        setSapDieselRate(0)
      } 
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
            value={singleVehicleInfo.parking_info.vehicle_type_id.type}
            readOnly
          />
        </CCol>
        <CCol xs={12} md={3}>
          <CFormLabel htmlFor="vNum">Vehicle Number</CFormLabel>
          <CFormInput size="sm" id="vNum" value={singleVehicleInfo.parking_info.vehicle_number} readOnly />
        </CCol>
         
        <CCol xs={12} md={3}>
          <CFormLabel htmlFor="tripsheet_id">
            Trip Sheet Number
          </CFormLabel>
          <CFormInput
            size="sm" 
            onFocus={onFocus}
            onBlur={onBlur}
            onChange={handleChange}
            value={singleVehicleInfo.parking_info.trip_sheet_info.trip_sheet_no} 
            type="text"
            readOnly
          />
        </CCol>
        <CCol xs={12} md={3}>
          <CFormLabel htmlFor="driver_id">
            Driver Name 
          </CFormLabel>
          <CFormInput
            size="sm"
            id="driverName"
            value={singleVehicleInfo.parking_info.driver_info.driver_name}
            readOnly
          />
        </CCol>

        <CCol xs={12} md={3}>
          <CFormLabel htmlFor="driveMobile">
            Driver Mobile Number 
          </CFormLabel>
          <CFormInput size="sm" id="driveMobile" value={values.driveMobile} readOnly />
        </CCol>
        <CCol xs={12} md={3}>
          <CFormLabel htmlFor="diesel_vendor_name">
            Vendor Name
          </CFormLabel>
          <CFormInput 
            size="sm"  
            id="diesel_vendor_name"
            value={values.diesel_vendor_name}
            readOnly 
          />
        </CCol>
        <CCol xs={12} md={3}>
          <CFormLabel htmlFor="vendor_code">
            Vendor Code
          </CFormLabel>
          <CFormInput 
            size="sm"  
            id="vendor_code"
            value={values.vendor_code}
            readOnly 
          />
        </CCol>
        <CCol xs={12} md={3}>
          <CFormLabel htmlFor="diesel_invoice_date">
            NLFS Invoice Date 
          </CFormLabel>
          <CFormInput
            size="sm"
            // type="date" 
            value={values.diesel_invoice_date}
            readOnly
         />
        </CCol>
        <CCol xs={12} md={3}>
          <CFormLabel htmlFor="invoice_no">
            Invoice Number 
          </CFormLabel>
          <CFormInput
            size="sm"
            id="invoice_no"
            readOnly
            value={values.invoice_no}
            maxLength={15}
          />
        </CCol>
        <CCol xs={12} md={3}>
          <CFormLabel htmlFor="invoice_copy">
            Invoice Copy
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
                  {values.invoice_copy.name == undefined &&
                  <span className="float-start">
                  <i
                    className="fa fa-eye"
                    onClick={() => setOdometerPhoto1(true)}
                    aria-hidden="true"
                  ></i>{' '}
                  &nbsp;View
                  </span>}
                  
                </>
              )}
          </CButton>
          <CFormInput
            onBlur={onBlur}
            onChange={(e)=>{imageCompress1(e)}}
            type="file"
            accept=".jpg,.jpeg,.png,.pdf"
            name="invoice_copy"
            size="sm"
            id="invoice_copy"
            onFocus={onFocus}
            className={`${errors.invoice_copy && 'is-invalid'}`}
            style={{display:'none'}}
            ref={input1 => {
              // assigns a reference so we can trigger it later
              inputFile1 = input1;
            }}
          />
        </CCol>
        <CCol xs={12} md={3}>
          <CFormLabel htmlFor="bunk_reading">
            Bunk Reading
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
                {values.bunk_reading.name == undefined &&
                <span className="float-start">
                <i
                    className="fa fa-eye"
                    onClick={() => setOdometerPhoto2(true)}
                    aria-hidden="true"
                  ></i>{' '}
                  &nbsp;View
                </span>
                } 
              </>
            )}
          </CButton>
          <CFormInput
            onBlur={onBlur}
            onChange={(e)=>{imageCompress(e)}}
            type="file"
            accept=".jpg,.jpeg,.png,.pdf"
            name="bunk_reading"
            size="sm"
            id="bunk_reading"
            style={{display:'none'}}
            ref={input => {
              // assigns a reference so we can trigger it later
              inputFile = input;
            }}
          />
        </CCol>
        <CCol xs={12} md={3}>
          <CFormLabel htmlFor="sap_invoice_diesel_posting_date">
            SAP Posting Date & Diesel Rate
          </CFormLabel>
          <CFormInput
            size="sm"
            // type="date" 
            id="sap_invoice_diesel_posting_date" 
            readOnly
            value={`${values.sap_invoice_diesel_posting_date} { ${sapDieselRate} }`} 
          />
        </CCol> 
        {/* ================ ASK Part Start ================ */}
        {/* <CCol xs={12} md={3}>
          <CFormLabel htmlFor="vendor_tds">
            TDS Tax Type  
          </CFormLabel>
          <CFormSelect
            size="sm" 
            value={values.vendor_tds} 
            disabled 
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
            HSN Code  
          </CFormLabel>
          <CFormSelect
            size="sm" 
            value={values.vendor_hsn}
            disabled 
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
        </CCol> */}
        <CCol xs={12} md={3}>
          <CFormLabel htmlFor="acc_appr_request_remarks">
            Accounts Approval Request Remarks
          </CFormLabel>
          <CFormInput 
            size="sm"
            value={values.acc_appr_request_remarks}
            id="acc_appr_request_remarks"
            readOnly
          />
        </CCol>
        <CCol xs={12} md={3}>
          <CFormLabel htmlFor="acc_appr_request_at">
            Accounts Approval Request Time
          </CFormLabel>
          <CFormInput 
            size="sm"
            value={values.acc_appr_request_at}
            id="acc_appr_request_at"
            readOnly
          />
        </CCol>
        <CCol xs={12} md={3}></CCol>
        <CCol xs={12} md={3}></CCol>
        {/* ================ ASK Part End ================ */} 
        {/*Previous Diesel Information*/}
        <CCol xs={12} md={3}>
          <CFormLabel
            htmlFor="inputAddress"
            style={{
              backgroundColor: 'red',
              color: 'white',
              marginTop:"8%"
            }}
          >
            {`__ Previous Diesel Information : __`}
          </CFormLabel>
        </CCol>
        <CCol xs={12} md={3}>
          <CFormLabel htmlFor="prev_di_nol">
            No. Of Liters 
          </CFormLabel>
          <CFormInput size="sm" 
          readOnly
          id="prev_di_nol"
          value={values.prev_di_nol}
          maxLength={7}
          />
        </CCol>
        <CCol xs={12} md={3}>
          <CFormLabel htmlFor="prev_di_rpl">
            Rate Per Liter 
          </CFormLabel>
          <CFormInput 
            value={values.prev_di_rpl} 
            size="sm"
            readOnly
            id="prev_di_rpl"
            maxLength={6}
          />
        </CCol> 
        <CCol xs={12} md={3}>
          <CFormLabel htmlFor="prev_di_amount">
            Amount
          </CFormLabel>
          <CFormInput 
            size="sm"
            value={values.prev_di_amount} 
            id="prev_di_amount"
            readOnly
          />
        </CCol> 
        {/*Current Diesel Information*/}
        <CCol xs={12} md={3}>
          <CFormLabel
            htmlFor="inputAddress"
            style={{
              backgroundColor: 'greenyellow',
              color: 'black',
              marginTop:"8%"
            }}
          >
            {`__ Current Diesel Information : __`}
          </CFormLabel>
        </CCol>
        <CCol xs={12} md={3}>
          <CFormLabel htmlFor="no_of_ltrs1">
            No. Of Liters 
          </CFormLabel>
          <CFormInput size="sm" 
          readOnly
          id="no_of_ltrs1"
          value={values.no_of_ltrs1}
          maxLength={7}
          />
        </CCol>
        <CCol xs={12} md={3}>
          <CFormLabel htmlFor="rate_of_ltrs">
            Rate Per Liter 
          </CFormLabel>
          <CFormInput 
            value={values.rate_of_ltrs} 
            size="sm"
            readOnly
            id="rate_of_ltrs"
            maxLength={6}
          />
        </CCol> 
        <CCol xs={12} md={3}>
          <CFormLabel htmlFor="total_amount">
            Amount
          </CFormLabel>
          <CFormInput 
            size="sm"
            // value={(formatter1.format(isFinite(values.total_amount) ? values.total_amount : 0))}
            value={values.total_amount} 
            id="total_amount"
            readOnly
          />
        </CCol> 

        <CCol xs={12} md={3}>
          <CFormLabel htmlFor="remarks">Approval Remarks</CFormLabel>
          <CFormTextarea
            id="remarks"
            name="remarks"
            onFocus={onFocus}
            onBlur={onBlur}
            onChange={handleChangenew}
            value={remarks}
          >
          </CFormTextarea>
        </CCol>
      </CRow>

      <CModal visible={OdometerPhoto1} onClose={() => setOdometerPhoto1(false)}>
        <CModalHeader>
          <CModalTitle>Invoice Copy</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {singleVehicleInfo.invoice_copy && !singleVehicleInfo.invoice_copy.includes('.pdf') ? (
            <CCardImage orientation="top" src={singleVehicleInfo.invoice_copy} />
            ) : (
            <iframe
              orientation="top"
              height={500}
              width={475}
              src={singleVehicleInfo.invoice_copy}
            ></iframe>
          )}
        </CModalBody> 
        <CModalFooter>
          <CButton color="secondary" onClick={() => setOdometerPhoto1(false)}>
            Close
          </CButton>
        </CModalFooter>
      </CModal>

      <CModal visible={OdometerPhoto2} onClose={() => setOdometerPhoto2(false)}>
        <CModalHeader>
          <CModalTitle>Bunk Reading</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {singleVehicleInfo.bunk_reading && !singleVehicleInfo.bunk_reading.includes('.pdf') ? (
              <CCardImage orientation="top" src={singleVehicleInfo.bunk_reading} />
          ):(
            <iframe
              orientation="top"
              height={500}
              width={475}
              src={singleVehicleInfo.bunk_reading}
            ></iframe>
          )}
        </CModalBody> 
        <CModalFooter>
          <CButton color="secondary" onClick={() => setOdometerPhoto2(false)}>
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

export default DieselCreationOwn
