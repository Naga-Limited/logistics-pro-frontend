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
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
  CTabContent,
  CTabPane,
} from '@coreui/react'
import  React , { useEffect, useState } from 'react'
import useForm from 'src/Hooks/useForm.js'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Loader from 'src/components/Loader'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import AccessDeniedComponent from 'src/components/commoncomponent/AccessDeniedComponent'
import JavascriptInArrayComponent from 'src/components/commoncomponent/JavascriptInArrayComponent'
import * as LogisticsProScreenNumberConstants from 'src/components/constants/LogisticsProScreenNumberConstants'
import LocationApi from 'src/Service/SubMaster/LocationApi'
import DepoRouteMasterService from 'src/Service/Depo/Master/DepoRouteMasterService'
import Webcam from 'react-webcam'
import CIcon from '@coreui/icons-react'
import * as icon from '@coreui/icons';
import DepoCustomerValidation from 'src/Utils/Depo/Customer/DepoCustomerValidation'
import DepoCustomerMasterService from 'src/Service/Depo/Master/DepoCustomerMasterService'

const DepoCustomerMasterEdit = () => {
  const formValues = {
    locationName: '',
    routeName: '',
    customerName: '',
    customerNumber: '',
    customerAddress: '',
    customerCode: '',
    customerPhoto: '',
  }

  const { id } = useParams()

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

    values.customerPhoto = file
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
  let page_no = LogisticsProScreenNumberConstants.DepoModuleScreens.Depo_Customer_Master

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
  const [locationData, setLocationData] = useState([])
  const [submitBtn, setSubmitBtn] = useState(true)
  const [routeData, setRouteData] = useState([])
  const [singleCustomerInfo, setSingleCustomerInfo] = useState([])
  const [routeId, setRouteId] = useState('')
  const [depoLocationName, setDepoLocationName] = useState('')
  const [errorModal, setErrorModal] = useState(false)
  const [error, setError] = useState({})
  const [customerCopy, setCustomerCopy] = useState(true)
  const [customerCopyDel, setCustomerCopyDel] = useState(false)

  const { values, errors, handleChange, onFocus, handleSubmit, onBlur } = useForm(
    updateoldCustomer,
    DepoCustomerValidation,
    formValues
  )

  useEffect(() => {

    //section for getting Location Data from database
    LocationApi.getLocation().then((res) => {
      setLocationData(res.data.data)
    })

  }, [])

  const getRndInteger = (min, max) => {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  useEffect(() => {

    if(values.customerPhoto) {
      setFileuploaded(true)
    } else {
      setFileuploaded(false)
    }

  }, [values.customerPhoto])


  const onChangeFilter = (event) => {
    var selected_value = event.target.value
    console.log(selected_value, 'selected_value')
    if (selected_value) {
      setDepoLocationName(selected_value)
      values.locationName = selected_value
      errors.locationName = ''
    } else {
      setDepoLocationName('')
      values.locationName = ''
      errors.locationName = 'Required'
    }
  }

  const onChangeRouteFilter = (value) => {
    var selected_route_value = value
    if (selected_route_value) {
      setRouteId(selected_route_value)
      values.routeName = selected_route_value
      errors.routeName = ''
    } else {
      setRouteId('')
      values.routeName = ''
      errors.routeName = 'Required'
    }
  }

  useEffect(() => {

    // setFetch(true)

    let lName = !errors.locationName && values.locationName
    let rName = !errors.routeName && values.routeName
    let cName = !errors.customerName && values.customerName
    let cAddress = !errors.customerAddress && values.customerAddress
    let cCode = !errors.customerCode && values.customerCode
    let cNumber = !errors.customerNumber && values.customerNumber


    let condition_check = lName && rName && cName && cAddress && cCode && cNumber

    console.log(condition_check,'condition_check')

    if (condition_check) {
      setSubmitBtn(false)
    } else {
      setSubmitBtn(true)
    }
  }, [values, errors, values.locationName, depoLocationName, routeId])

  useEffect(() => {

    if(values.locationName) {

      //section to fetch Routes by Depo Location Id
      DepoRouteMasterService.getDepoRoutesByDepoLocationId(values.locationName).then((res) => {
        console.log(res.data.data,'getDepoRoutesByDepoLocationId')
        setRouteData(res.data.data)
      })

    } else {
      setRouteId('')
      setRouteData([])
    }


  }, [values.locationName])

  function updateoldCustomer() {

    setFetch(false)

    const formData = new FormData()
    formData.append('_method', 'PUT')
    formData.append('location_id', values.locationName)
    formData.append('route_id', values.routeName)
    formData.append('customer_name', values.customerName)
    formData.append('customer_code', values.customerCode)
    formData.append('customer_contact_number', values.customerNumber)
    formData.append('customer_address', values.customerAddress)
    formData.append('customer_photo', values.customerPhoto)
    formData.append('updated_by', user_id)

    console.log(values,'createDepoFreight')

    DepoCustomerMasterService.updateCustomers(id, formData).then((res) => {

      setFetch(true)
      if (res.status === 200) {
        toast.success('Customer Updated Successfully!')

        setTimeout(() => {
          navigation('/DepoCustomerMasterTable')
        }, 1000)
      }
    })
    .catch((error) => {
      setFetch(true)
      for (let value of formData.values()) {
      }
      var object = error.response.data.errors
      var output = ''
      for (var property in object) {
        output += '*' + object[property] + '\n'
      }
      setError(output)
      setErrorModal(true)
    })
  }

  useEffect(() => {

    //section to fetch single Customer info
    DepoCustomerMasterService.getDepoCustomerById(id).then((res) => {
      setFetch(true)
      let customer_data = res.data.data
      console.log(customer_data,'Customer info')
      values.locationName = customer_data.location_id
      values.routeName = customer_data.route_id
      values.customerName = customer_data.customer_name
      values.customerCode = customer_data.customer_code
      values.customerNumber = customer_data.customer_contact_number
      values.customerAddress = customer_data.customer_address
      values.customerPhoto = customer_data.customer_photo
      setDepoLocationName(customer_data.location_id)
      setRouteId(customer_data.route_id)
      setSingleCustomerInfo(customer_data)
    })

  }, [id])

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
                          <CFormLabel htmlFor="locationName">
                            Depo Location <REQ />{' '}
                            {errors.locationName && (
                              <span className="small text-danger">{errors.locationName}</span>
                            )}
                          </CFormLabel>
                          <CFormSelect
                            size="sm"
                            name="depoLocation"
                            id="depoLocation"
                            onFocus={onFocus}
                            onClick={(e) => {
                              onChangeFilter(e)
                            }}
                            value={values.locationName}
                            aria-label="Small select example"
                          >
                            <option value="">Select ...</option>

                            {locationData.map(({ id, location }) => {
                              return (
                                <>
                                  <option key={id} value={id}>
                                    {location}
                                  </option>
                                </>
                              )
                            })}
                          </CFormSelect>
                        </CCol>

                        <CCol md={3}>
                          <CFormLabel htmlFor="routeName">
                            Route Name <REQ />{' '}
                            {errors.routeName && (
                              <span className="small text-danger">{errors.routeName}</span>
                            )}
                          </CFormLabel>

                          <CFormSelect
                            size="sm"
                            name="routeName"
                            id="routeName"
                            onFocus={onFocus}
                            onChange={(e) => onChangeRouteFilter(e.target.value)}
                            value={routeId}
                            aria-label="Small select example"
                          >
                            <option value="">Select ...</option>

                            {routeData.map(({ id, route_name }) => {
                              return (
                                <>
                                  <option key={id} value={id}>
                                    {route_name}
                                  </option>
                                </>
                              )
                            })}
                          </CFormSelect>

                        </CCol>

                        <CCol md={3}>
                          <CFormLabel htmlFor="customerName">
                            Customer Name <REQ />{' '}
                            {errors.customerName && (
                              <span className="small text-danger">{errors.customerName}</span>
                            )}
                          </CFormLabel>
                          <CFormInput
                            name="customerName"
                            size="sm"
                            maxLength={30}
                            id="customerName"
                            onChange={handleChange}
                            value={values.customerName}
                            onFocus={onFocus}
                            onBlur={onBlur}
                            placeholder=""
                          />
                        </CCol>

                        <CCol md={3}>
                          <CFormLabel htmlFor="customerCode">
                            Customer Code <REQ />{' '}
                            {errors.customerCode && (
                              <span className="small text-danger">{errors.customerCode}</span>
                            )}
                          </CFormLabel>
                          <CFormInput
                            name="customerCode"
                            size="sm"
                            maxLength={8}
                            id="customerCode"
                            onChange={handleChange}
                            value={values.customerCode}
                            onFocus={onFocus}
                            onBlur={onBlur}
                            placeholder=""
                          />
                        </CCol>

                        <CCol md={3}>
                          <CFormLabel htmlFor="customerNumber">
                          Customer Mobile Number <REQ />{' '}
                            {errors.customerNumber && (
                              <span className="small text-danger">{errors.customerNumber}</span>
                            )}
                          </CFormLabel>
                          <CFormInput
                            name="customerNumber"
                            size="sm"
                            maxLength={10}
                            id="customerNumber"
                            onChange={handleChange}
                            value={values.customerNumber}
                            onFocus={onFocus}
                            onBlur={onBlur}
                            placeholder=""
                          />
                        </CCol>

                        <CCol md={3}>
                          <CFormLabel htmlFor="customerAddress">
                            Customer Address <REQ />{' '}
                            {errors.customerAddress && (
                              <span className="small text-danger">{errors.customerAddress}</span>
                            )}
                          </CFormLabel>
                          <CFormInput
                            name="customerAddress"
                            size="sm"
                            maxLength={200}
                            id="customerAddress"
                            onChange={handleChange}
                            value={values.customerAddress}
                            onFocus={onFocus}
                            onBlur={onBlur}
                            placeholder=""
                          />
                        </CCol>

                        <CCol md={3}>

                          <CFormLabel htmlFor="customerPhoto">
                          Customer Photo Attachment
                            {errors.customerPhoto && (
                              <span className="small text-danger">{errors.customerPhoto}</span>
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

                                {customerCopy ? (
                                  <span className="float-start">
                                    <i
                                      className="fa fa-eye"
                                      onClick={() => setCustomerCopyDel(true)}
                                      aria-hidden="true"
                                    ></i>{' '}
                                    &nbsp;View
                                  </span>) : (
                                    <span className="float-start">
                                      &nbsp;{values.customerPhoto.name}
                                    </span>
                                )}

                                <span className="float-end">
                                  <i
                                    className="fa fa-trash"
                                    aria-hidden="true"
                                    onClick={() => {
                                      setFileuploaded(false)
                                      setCustomerCopy(false)
                                      values.customerPhoto == ''
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
                            name="customerPhoto"
                            size="sm"
                            id="customerPhoto"
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
                            disabled={submitBtn}
                            onClick={(e) => {
                              e.preventDefault()
                              updateoldCustomer()
                            }}

                          >
                            ADD
                          </CButton>
                          <Link to={'/DepoCustomerMasterTable'}>
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
                      <CModalTitle>Customer Photo</CModalTitle>
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
                {/*Contractor Copy model*/}
                  <CModal visible={customerCopyDel} backdrop="static" onClose={() => setCustomerCopyDel(false)}>
                    <CModalHeader>
                      <CModalTitle>Customer Photo</CModalTitle>
                    </CModalHeader>
                    <CModalBody>
                    {singleCustomerInfo.customer_photo && !singleCustomerInfo.customer_photo.includes('.pdf') ? (
                        <CCardImage orientation="top" src={singleCustomerInfo.customer_photo} />
                      ) : (
                        <iframe
                          orientation="top"
                          height={500}
                          width={475}
                          src={singleCustomerInfo.customer_photo}
                        ></iframe>
                      )}
                    </CModalBody>
                    <CModalFooter>
                      <CButton color="secondary" onClick={() => setCustomerCopyDel(false)}>
                        Close
                      </CButton>
                    </CModalFooter>
                  </CModal>
                {/*Contractor Copy model*/}
                {/* Error Modal Section */}
                  <CModal visible={errorModal} backdrop="static" onClose={() => setErrorModal(false)}>
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

export default DepoCustomerMasterEdit
