/* eslint-disable prettier/prettier */
import {
  CButton,
  CCard,
  CCardImage,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
  CTabContent,
  CTabPane,
} from '@coreui/react'
import React, { useEffect, useState } from 'react'
import useForm from 'src/Hooks/useForm.js'
import { Link, useNavigate } from 'react-router-dom'
import Loader from 'src/components/Loader'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import AccessDeniedComponent from 'src/components/commoncomponent/AccessDeniedComponent'
import JavascriptInArrayComponent from 'src/components/commoncomponent/JavascriptInArrayComponent'
import * as LogisticsProScreenNumberConstants from 'src/components/constants/LogisticsProScreenNumberConstants'
import DepoDriverValidation from 'src/Utils/Depo/Driver/DepoDriverValidation'
import DepoContractorMasterService from 'src/Service/Depo/Master/DepoContractorMasterService'
import DepoDriverMasterService from 'src/Service/Depo/Master/DepoDriverMasterService'
import SearchSelectComponent from 'src/components/commoncomponent/searchSelectComponent'
import Webcam from 'react-webcam'
import CIcon from '@coreui/icons-react'
import * as icon from '@coreui/icons';
const DepoDriverMaster = () => {
  const formValues = {
    depoContractorName: '',
    driverName: '',
    driverNumber: '',
    driverAddress: '',
    licenseNumber: '',
    licenseValidDate: '',
    driverPhoto: '',
  }

  const webcamRef = React.useRef(null);
  const [fileuploaded, setFileuploaded] = useState(false)
  const [camEnable, setCamEnable] = useState(false)
  const [imgSrc, setImgSrc] = React.useState(null);

  const capture = React.useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImgSrc(imageSrc);
  }, [webcamRef, setImgSrc]);

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

    values.driverPhoto = file
  }

  // will hold a reference for our real input file
  let inputFile = '';

  // function to trigger our input file click
  const uploadClick = e => {
    e.preventDefault();
    inputFile.click();
    return false;
  };

  /*================== User Id & Location Fetch ======================*/
  const user_info_json = localStorage.getItem('user_info')
  const user_info = JSON.parse(user_info_json)
  const user_locations = []
  const navigation = useNavigate()

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
  let page_no = LogisticsProScreenNumberConstants.DepoModuleScreens.Depo_Driver_Master

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
  const [submitBtn, setSubmitBtn] = useState(true)
  const [contractorName, setContractorName] = useState('')
  const [contractorError, setContractorError] = useState(true)
  const [contractorData, setContractorData] = useState([])

  const { values, errors, handleChange, onFocus, handleSubmit, onBlur } = useForm(
    addNewDriver,
    DepoDriverValidation,
    formValues
  )

  console.log(values.driverPhoto,'values.driverPhoto')
  if(values.driverPhoto){
    console.log(values.driverPhoto.name,'values.driverPhoto')
  }

  useEffect(() => {

    //section for getting Contractor Data from database
    DepoContractorMasterService.getActiveDepoContractors().then((res) => {
      console.log(res.data.data)
      setContractorData(res.data.data)
    })

  }, [])

  const getRndInteger = (min, max) => {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  useEffect(() => {

    if(values.driverPhoto) {
      setFileuploaded(true)
    } else {
      setFileuploaded(false)
    }

  }, [values.driverPhoto])

  const onChangeFilter = (event) => {
    var selected_value = event.value
    console.log(selected_value, 'selected_value')
    if (selected_value) {
      setContractorName(selected_value)
      setContractorError(false)
    } else {
      setContractorName('')
      setContractorError(true)
    }
  }

  useEffect(() => {
    setFetch(true)

    let cName = contractorError ? false : true
    let dName = !errors.driverName && values.driverName
    let dNumber = !errors.driverNumber && values.driverNumber
    let lNumber = !errors.licenseNumber && values.licenseNumber
    let lValidDate = !errors.licenseValidDate && values.licenseValidDate
    let dAddress = !errors.driverAddress && values.driverAddress

    values.depoContractorName = contractorName

    let condition_check = cName && dName && dNumber && lNumber && lValidDate && dAddress

    // console.log(condition_check,'condition_check')

    if (condition_check) {
      setSubmitBtn(false)
    } else {
      setSubmitBtn(true)
    }
  }, [values, errors,contractorError])

  function addNewDriver() {

    setFetch(false)
    const formData = new FormData()
    formData.append('contractor_id', values.depoContractorName)
    formData.append('driver_name', values.driverName)
    formData.append('license_no', values.licenseNumber)
    formData.append('license_validity_to', values.licenseValidDate)
    formData.append('driver_address', values.driverAddress)
    formData.append('driver_photo', values.driverPhoto)
    formData.append('driver_number', values.driverNumber)
    formData.append('created_by', user_id)

      DepoDriverMasterService.createDepoDriver(formData).then((res) => {

      if (res.status === 201) {
        setFetch(true)
        toast.success('Driver Created Successfully!')

        setTimeout(() => {
          navigation('/DepoDriverMasterTable')
        }, 1000)
      }
    })
  }

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
                <CForm className="row g-3 m-2 p-1" onSubmit={handleSubmit}>
                  <CRow className="mb-md-1">
                    <CCol md={3}>
                      <CFormLabel htmlFor="depoContractorName">
                        Contractor Name <REQ />{' '}
                        {contractorError && (
                          <span className="small text-danger">Required</span>
                        )}
                      </CFormLabel>
                      <SearchSelectComponent
                        size="sm"
                        className="mb-2"
                        onChange={(e) => {
                          onChangeFilter(e)
                          {
                            handleChange
                          }
                        }}
                        label="Select Contractor Name"
                        noOptionsMessage="Contractor Not found"
                        search_type="depo_contractors"
                        search_data={contractorData}
                      />
                    </CCol>

                    <CCol md={3}>
                      <CFormLabel htmlFor="driverName">
                        Driver Name <REQ />{' '}
                        {errors.driverName && (
                          <span className="small text-danger">{errors.driverName}</span>
                        )}
                      </CFormLabel>
                      <CFormInput
                        name="driverName"
                        size="sm"
                        maxLength={30}
                        id="driverName"
                        onChange={handleChange}
                        value={values.driverName}
                        onFocus={onFocus}
                        onBlur={onBlur}
                        placeholder=""
                      />
                    </CCol>

                    <CCol md={3}>
                      <CFormLabel htmlFor="driverNumber">
                      Driver Mobile Number <REQ />{' '}
                        {errors.driverNumber && (
                          <span className="small text-danger">{errors.driverNumber}</span>
                        )}
                      </CFormLabel>
                      <CFormInput
                        name="driverNumber"
                        size="sm"
                        maxLength={10}
                        id="driverNumber"
                        onChange={handleChange}
                        value={values.driverNumber}
                        onFocus={onFocus}
                        onBlur={onBlur}
                        placeholder=""
                      />
                    </CCol>

                    <CCol md={3}>
                      <CFormLabel htmlFor="driverAddress">
                        Driver Address <REQ />{' '}
                        {errors.driverAddress && (
                          <span className="small text-danger">{errors.driverAddress}</span>
                        )}
                      </CFormLabel>
                      <CFormInput
                        name="driverAddress"
                        size="sm"
                        maxLength={200}
                        id="driverAddress"
                        onChange={handleChange}
                        value={values.driverAddress}
                        onFocus={onFocus}
                        onBlur={onBlur}
                        placeholder=""
                      />
                    </CCol>
                  </CRow>

                  <CRow className="mb-md-1">
                  <CCol md={3}>
                      <CFormLabel htmlFor="licenseNumber">
                        License Number <REQ />{' '}
                        {errors.licenseNumber && (
                          <span className="small text-danger">{errors.licenseNumber}</span>
                        )}
                      </CFormLabel>
                      <CFormInput
                        name="licenseNumber"
                        size="sm"
                        maxLength={16}
                        id="licenseNumber"
                        onChange={handleChange}
                        value={values.licenseNumber}
                        onFocus={onFocus}
                        onBlur={onBlur}
                        placeholder=""
                      />
                    </CCol>
                    <CCol md={3}>
                      <CFormLabel htmlFor="licenseValidDate">
                        License Valid To <REQ />{' '}
                        {errors.licenseValidDate && (
                          <span className="small text-danger">{errors.licenseValidDate}</span>
                        )}
                      </CFormLabel>
                      <CFormInput
                        type="date"
                        onBlur={onBlur}
                        onFocus={onFocus}
                        onChange={handleChange}
                        size="sm"
                        required
                        value={values.licenseValidDate}
                        id="licenseValidDate"
                        name="licenseValidDate"
                        placeholder="date"
                      />
                    </CCol>
                    <CCol md={3}>

                      <CFormLabel htmlFor="driverPhoto">
                        Driver Photo Attachment
                        {errors.driverPhoto && (
                          <span className="small text-danger">{errors.driverPhoto}</span>
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
                              &nbsp;{values.driverPhoto.name}
                            </span>
                            <span className="float-end">
                              <i
                                className="fa fa-trash"
                                aria-hidden="true"
                                onClick={() => {
                                  setFileuploaded(false)
                                  values.driverPhoto == ''
                                }}
                              ></i>
                            </span>
                          </>
                        )}
                      </CButton>

                       <CFormInput
                        onBlur={onBlur}
                        onChange={handleChange}
                        type="file"
                        accept=".jpg,.jpeg,.png,.pdf"
                        name="driverPhoto"
                        size="sm"
                        id="driverPhoto"
                        style={{display:'none'}}
                        ref={input => {
                          // assigns a reference so we can trigger it later
                          inputFile = input;
                        }}
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
                      <CButton
                        size="s-lg"
                        color="warning"
                        className="mx-1 px-2 text-white"
                        // type="submit"
                        disabled={submitBtn}
                        onClick={addNewDriver}
                      >
                        ADD
                      </CButton>
                      <Link to={'/DepoDriverMasterTable'}>
                        <CButton
                          size="s-lg"
                          color="warning"
                          className="mx-1 px-2 text-white"
                          type="button"
                        >
                          BACK
                        </CButton>
                      </Link>
                    </CCol>
                  </CRow>
                </CForm>
              </CTabPane>
            </CTabContent>
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
                <CModalTitle>Driver Photo</CModalTitle>
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
            {/*Camera Image Copy model*/}
          </CCard>
        </>) : (<AccessDeniedComponent />)}
      </>)}
    </>
  )
}

export default DepoDriverMaster
