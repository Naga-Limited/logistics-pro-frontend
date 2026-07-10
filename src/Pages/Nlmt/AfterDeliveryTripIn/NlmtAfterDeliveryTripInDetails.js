/* eslint-disable  */
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
  CForm,
  CTabPane,
  CCard,
  CTabContent,
  CAlert
} from '@coreui/react'

import React, { useState, useEffect } from 'react'
import useForm from 'src/Hooks/useForm'
import { useNavigate, useParams } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import AllDriverListSelectComponent from 'src/components/commoncomponent/AllDriverListSelectComponent' 
import Loader from 'src/components/Loader' 
import * as NlmtScreenAccessCodes from 'src/components/constants/NlmtScreenAccessCodes'
import Webcam from 'react-webcam'
import CIcon from '@coreui/icons-react'
import * as icon from '@coreui/icons';
import FileResizer from 'react-image-file-resizer'
import AccessDeniedComponent from 'src/components/commoncomponent/AccessDeniedComponent'
import JavascriptInArrayComponent from 'src/components/commoncomponent/JavascriptInArrayComponent' 
import NlmtAfterDeliveryGateInValidation from 'src/Utils/Nlmt/AfterDeliveryGateIn/NlmtAfterDeliveryGateInValidation'
import NlmtAfterDeliveryTripInService from 'src/Service/Nlmt/AfterDeliveryTripIn/NlmtAfterDeliveryTripInService'
import NlmtDefinitionsListApi from 'src/Service/Nlmt/Masters/NlmtDefinitionsListApi'
import TripSheetInfoService from 'src/Service/PurchasePro/TripSheetInfoService'
import NlmtTripSheetClosureService from 'src/Service/Nlmt/TripSheetClosure/NlmtTripSheetClosureService'


const NlmtAfterDeliveryTripInDetails = () => {

  const formValues = {
    vehicle_id: '',
    odometer_closing_photo: '',
    odometer_closing_km: '',
    remarks: ''
  }

  const { id } = useParams()
  const [state, setState] = useState({
    page_loading: false,
  })
  const [errorModal, setErrorModal] = useState(false)
  const [error, setError] = useState({})
  const [OdometerPhoto, setOdometerPhoto] = useState(false)
  const [singleVehicleInfo, setSingleVehicleInfo] = useState(false)
  const [dirverAssign, setDirverAssign] = useState(true)
  const [fetch, setFetch] = useState(false)
  const [acceptBtn, setAcceptBtn] = useState(true)
  const navigation = useNavigate()
  const vehicleType = {
    OWN: 21,
    HIRE: 22,
    PARTY: 23,
  }
  const REQ = () => <span className="text-danger"> * </span>

  useEffect(() => {
    NlmtAfterDeliveryTripInService.getSingleVehicleInfoOnGate(id).then((res) => {
      setFetch(true)
      console.log(res.data.data, 'single vehicle info')

      let single_vehicle_info = res.data.data

      if (res.status === 200 && single_vehicle_info) {
        values.vehicle_id = single_vehicle_info.vehicle_info?.vehicle_id
        isTouched.vehicle_id = true
        isTouched.driver_id = true
        isTouched.tripsheet_id = true
        isTouched.vehicle_type_id = true
        values.trip_sheet_no = single_vehicle_info.tripsheet_info?.nlmt_tripsheet_no != null ? single_vehicle_info.tripsheet_info.nlmt_tripsheet_no : ''
        //values.diesel_vendor_name= single_vehicle_info.diesel_vendor != null ? single_vehicle_info.diesel_vendor.diesel_vendor_name : ''
        values.vtype = single_vehicle_info.vehicle_info?.vehicle_type_id != null ? single_vehicle_info.vehicle_info.vehicle_type_id : ''
        values.odometer_closing_km = (single_vehicle_info.vehicle_current_position == "17" || single_vehicle_info.vehicle_current_position == "21") ? single_vehicle_info.odometer_km : ''
        values.vbodytype = single_vehicle_info.vehicle_info?.vehicle_body_type_id != null ? single_vehicle_info.vehicle_info.vehicle_body_type_id : ''
        values.vCap_id = single_vehicle_info.vehicle_info?.vehicle_capacity_id != null ? single_vehicle_info.vehicle_info.vehicle_capacity_id : ''
        // values.vehicle_number = single_vehicle_info.vehicle_location_id != null ? single_vehicle_info.vehicle_location_id.vehicle_number : ''
        values.odometer_photo = single_vehicle_info.odometer_photo != null ? single_vehicle_info.odometer_photo : ''
        //values.vCap = single_vehicle_info.vehicle_capacity_id != null ? single_vehicle_info.vehicle_capacity_id.capacity : ''
        // values.vCap_id = single_vehicle_info.vehicle_capacity_id != null ? single_vehicle_info.vehicle_capacity_id.id : ''
        values.inspection_time_string = single_vehicle_info.vehicle_inspection_info?.inspection_time_string != null ? single_vehicle_info.vehicle_inspection_info.inspection_time_string : ''
        values.parking_id = single_vehicle_info.nlmt_trip_in_id,
          values.created_by = single_vehicle_info.created_by != null ? single_vehicle_info.created_by : ''
        setRemarks(single_vehicle_info.remarks != null ? single_vehicle_info.remarks : '')

        setSingleVehicleInfo(single_vehicle_info)
        console.log(singleVehicleInfo, 'singleVehicleInfo')
      }
    })
  }, [])

  const user_info_json = localStorage.getItem('user_info')
  const user_info = JSON.parse(user_info_json)
  const user_locations = []

  /* Get User Locations From Local Storage */
  user_info.location_info.map((data, index) => {
    user_locations.push(data.id)
  })

  /* Get User Id From Local Storage */
  const user_id = user_info.user_id

  // console.log(user_locations)
  /*================== User Location Fetch ======================*/

  /* Get User Locations From Local Storage */
  const user_location_info = user_info.location_info
  var user_locations_id = ''
  user_location_info.map((data, index) => {
    user_locations_id = user_locations_id + data.id + ','
  })

  var lastIndex = user_locations_id.lastIndexOf(',')

  const userLocation = user_locations_id.substring(0, lastIndex)
  console.log(userLocation, 'userLocation')

  var lastIndex_new = userLocation.lastIndexOf(',')
  const userLocation_new = userLocation.substring(lastIndex_new + 1)
  console.log(userLocation_new, 'userLocation_new')

  /* ==================== Access Part Start ========================*/
    const [screenAccess, setScreenAccess] = useState(false)
    let page_no = NlmtScreenAccessCodes.NlmtTransactionScreens.Nlmt_Vehicle_Trip_In
  
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


  const { values, errors, handleChange, onFocus, handleSubmit, enableSubmit, onBlur, isTouched } =
    useForm(UpdateGateIn, NlmtAfterDeliveryGateInValidation, formValues)

  const [vehicleCapacity, setVehicleCapacity] = useState([])
  const [vehicleBody, setVehicleBody] = useState([])

  useEffect(() => {
    Promise.all([
      NlmtDefinitionsListApi.visibleNlmtDefinitionsListByDefinition(2),// Vehicle Capacity
      NlmtDefinitionsListApi.visibleNlmtDefinitionsListByDefinition(1),// Vehicle Body Type
      // NlmtDefinitionsListApi.visibleNlmtDefinitionsListByDefinition(3),// Vehicle Type
    ]).then(([cap, body, type]) => {
      setVehicleCapacity(cap.data.data || [])
      setVehicleBody(body.data.data || [])
      // setVehicleType(type.data.data || [])
      // setMastersLoaded(true)
    })
  }, [])
  const VEHICLE_TYPE_MAP = {
    21: 'Own',
    22: 'Hire',
  }
  console.log(singleVehicleInfo,':singleVehicleInfo' )
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


  function UpdateGateIn() {

    var closing_km = values.odometer_closing_km

    if(singleVehicleInfo?.vehicle_current_position == "17" || singleVehicleInfo?.vehicle_current_position == "21"){
      closing_km = singleVehicleInfo.odometer_km
    }

    console.log(singleVehicleInfo,'UpdateGateIn-singleVehicleInfo')
    console.log(values,'UpdateGateIn-values')

    /* Trip Completion Scenario */
    if (closing_km <= singleVehicleInfo.odometer_km && singleVehicleInfo?.vehicle_current_position != "17") {
      setFetch(true)
      toast.warning('Closing KM should be greater than Opening KM.')
      return false
    }

    if (values.odometer_closing_photo == '' && singleVehicleInfo?.vehicle_current_position != "17" || values.odometer_closing_photo.size > 5000000 && singleVehicleInfo?.vehicle_current_position != "17") {
      setFetch(true)
      toast.warning('Closing Odometer Required Less Than 5MB')
      return false
    }

    const data = new FormData()
    console.log(values)
    data.append('_method', 'PUT')
    data.append('odometer_closing_km', closing_km)
    data.append('vehicle_id', values.vehicle_id)
    data.append('parking_id', values.parking_id)
    data.append('odometer_closing_photo', values.odometer_closing_photo)
    data.append('remarks', remarks)
    data.append('user_id', user_id)

    NlmtAfterDeliveryTripInService.createGatein(id, data).then((res) => {
      if (res.status == 200) {
        setFetch(true)
        toast.success('After Delivery Gate In Completed Successfully!')
        setAcceptBtn(true)
        navigation('/NlmtTripInOwnVehicle')
      }
    })
      .catch((error) => {
        setFetch(true)
        if (error.response && error.response.data && error.response.data.errors) {
          var object = error.response.data.errors
          var output = ''
          for (var property in object) {
            output += '*' + object[property] + '\n'
          }
          setError(output)
        } else {
          setError('Something went wrong. Please try again.')
        }
        setErrorModal(true)
      })
  }
  
  function action(type) {
    if (singleVehicleInfo.vehicle_info.vehicle_number == '') {
      toast.warning('Invalid Vehicle Selected. Kindly Contact Admin.!')
      setFetch(true)
      return false
    } else if (singleVehicleInfo.driver_name == '') {
      toast.warning('Invalid Driver Selected. Kindly Contact Admin.!')
      setFetch(true)
      return false
    }

    var closing_km = values.odometer_closing_km
    if (closing_km < singleVehicleInfo.odometer_km && singleVehicleInfo?.parking_info?.vehicle_current_position == "17") {
      setFetch(true)
      // toast.warning('Closing KM Gretter Than Opening KM.')
      return false
    }
    else if (closing_km <= singleVehicleInfo.odometer_km && singleVehicleInfo?.parking_info?.vehicle_current_position != "17") {
      setFetch(true)
      // toast.warning('Closing KM Gretter Than Opening KM.')
      return false
    }

    if (values.odometer_closing_photo == '' && singleVehicleInfo?.parking_info?.vehicle_current_position != "17" || values.odometer_closing_photo.size > 5000000 && singleVehicleInfo?.parking_info?.vehicle_current_position != "17") {
      // toast.warning('Please Upload the Closing Odometer Photo ..')
      setFetch(true)
      return false
    }

    const formData = new FormData()
    formData.append('vehicle_type_id', singleVehicleInfo.vehicle_info.vehicle_type_id)
    formData.append('vehicle_id', singleVehicleInfo.vehicle_id)
    formData.append('driver_id', singleVehicleInfo.driver_id)
    formData.append('odometer_km', values.odometer_closing_km)
    formData.append('odometer_photo', values.odometer_closing_photo)
    formData.append('vehicle_number', singleVehicleInfo.vehicle_info.vehicle_number)
    formData.append('vehicle_body_type_id', values.vbodytype)
    formData.append('vehicle_capacity_id', values.vCap_id)
    formData.append('driver_name', singleVehicleInfo.driver_info.driver_name)
    formData.append('driver_contact_number', singleVehicleInfo.driver_info.driver_phone_1)
    formData.append('remarks', remarks || '')
    formData.append('parking_status', '1')
    formData.append('vehicle_current_position', '1')
    formData.append('created_by', values.created_by)
    formData.append('action_type', '1')
    // formData.append('vehicle_location_id', userLocation)
    formData.append('vehicle_location_id', userLocation_new)


    NlmtAfterDeliveryTripInService.createTripIn(formData)
      .then((res) => {
        setFetch(true)
        if (res.status === 201) {
          if (type == 3) {
            toast.success('Vehicle Waiting Outside Successfully!')
          } else if (type == 1) {
            toast.success('Vehicle GateIn Successfully!')
          } else {
            toast.success('After Delivery GateIn Successfully!')
          }
        } else if (res.status === 200) {
          toast.warning(res.data.message)
        } else {
          toast.error('Something Went Wrong!')
        }
      })
      .catch((error) => {
        setFetch(true)
        if (error.response && error.response.data && error.response.data.errors) {
          var object = error.response.data.errors
          var output = ''
          for (var property in object) {
            output += '*' + object[property] + '\n'
          }
          setError(output)
        } else {
          setError('Something went wrong. Please try again.')
        }
        setErrorModal(true)
      })
  }
  /* ================ Running KM Calculation Part Start ===================== */

  const [runningKM, setRunningKM] = useState(0)

  useEffect(() => {
    if (values.odometer_closing_km) {
      let start_point = Number(singleVehicleInfo.odometer_km)
      let end_point = Number(values.odometer_closing_km)
      let difference = end_point - start_point
      setRunningKM(difference ? difference : 0)
    } else {
      setRunningKM(0)
    }
  }, [values.odometer_closing_km])

  /* ================= Running KM Calculation Part End =========================*/

  useEffect(() => {
    if (!errors.odometer_closing_km && isTouched.odometer_closing_km && !errors.odometer_closing_photo) {
      setAcceptBtn(false);
    } else {
      setAcceptBtn(true);
    }
  }, [errors])

  const [remarks, setRemarks] = useState('');
  const handleChangenew = event => {
    const result = event.target.value.toUpperCase();

    setRemarks(result);

  };

  /* ==================== Web Cam Start ========================*/

  const webcamRef = React.useRef(null);
  const [fileuploaded, setFileuploaded] = useState(false)
  const [camEnable, setCamEnable] = useState(false)
  const [imgSrc, setImgSrc] = React.useState(null);

  const capture = React.useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImgSrc(imageSrc);
  }, [webcamRef, setImgSrc]);

  /* ==================== Web Cam End ========================*/

  /* ==================== File ReSize Start ========================*/

  const resizeFile = (file) => new Promise(resolve => {
    FileResizer.imageFileResizer(file, 1000, 1000, 'JPEG', 100, 0,
      uri => {
        resolve(uri);
      }, 'base64');
  })

  const imageCompress = async (event) => {
    const file = event.target.files[0];
    console.log(file)

    if (file.type == 'application/pdf') {

      if (file.size > 5000000) {
        alert('File to Big, please select a file less than 5mb')
        setFileuploaded(false)
      } else {
        values.odometer_closing_photo = file
        setFileuploaded(true)
      }
    } else {

      const image = await resizeFile(file);
      if (file.size > 2000000) { // Condition Set only for compress more than 2mb files
        valueAppendToImage(image)
        setFileuploaded(true)
      } else {
        values.odometer_closing_photo = file
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

    return new File([u8arr], filename, { type: mime });
  };

  const valueAppendToImage = (image) => {

    let file_name = 'dummy' + getRndInteger(100001, 999999) + '.png'
    let file = dataURLtoFile(
      image,
      file_name,
    );

    console.log(file)

    values.odometer_closing_photo = file
  }

  // will hold a reference for our real input file
  let inputFile = '';

  // function to trigger our input file click
  const uploadClick = e => {
    e.preventDefault();
    inputFile.click();
    return false;
  }

  const sapStatusChange = () => { 
  
    let SAPData = new FormData()
    SAPData.append('TRIP_SHEET', singleVehicleInfo.tripsheet_info.nlmt_tripsheet_no)
    SAPData.append('VEHICLE_NO', singleVehicleInfo.vehicle_info.vehicle_number)
    SAPData.append('Flag', 2)

    let LPData = new FormData()
    LPData.append('tripsheet_no', singleVehicleInfo.tripsheet_info.nlmt_tripsheet_no)
    LPData.append('update_by', user_id)
    LPData.append('pyg_id', singleVehicleInfo.nlmt_trip_in_id)
    LPData.append('status', 0)

    setFetch(false)
    TripSheetInfoService.UpdateTSInfoToSAP(SAPData).then((response) => {
      console.log(response, 'StopTSInfoToSAP') 
      if (response.data && (response.data[0].STATUS == 1 || response.data[0].STATUS == 2)) {
        // setFetch(true)
        toast.success(`${response.data[0].MESSAGE} for the Tripsheet : ${singleVehicleInfo.tripsheet_info.nlmt_tripsheet_no}`)
        NlmtTripSheetClosureService.nlmtUpdateSAPTripStopFlagRequest(LPData).then((res) => {
          setFetch(true)
          if (res.status == 200) {              
            toast.success('TripSheet SAP Flag Updated Sucessfully')
            window.location.reload(false)
            // navigation('/NlmtTripInOwnVehicle')
          }
        })
        .catch((error) => {
          setFetch(true)
          toast.warning(error)
        }) 
      } else if (response.data.STATUS == 3) {
        setFetch(true)
        toast.success(`${response.data[0].MESSAGE}. Kindly check the Tripsheet and Vehicle Number`)
        return false
      } else {
        setFetch(true)
        toast.warning('SAP Stop Flag Action Failed. Kindly Contact Admin..!')
        return false
      }
    })
  }

  const getRndInteger = (min, max) => {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  useEffect(() => {

    if (values.odometer_closing_photo) {
      setFileuploaded(true)
    } else {
      setFileuploaded(false)
    }

  }, [values.odometer_closing_photo])

  /* ==================== File Resize End ========================*/

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
                          <CFormLabel htmlFor="vNum">Vehicle Number</CFormLabel>
                          <CFormInput size="sm" id="vNum" value={singleVehicleInfo?.vehicle_info?.vehicle_number} readOnly />
                        </CCol>
                        <CCol xs={12} md={3}>
                          <CFormLabel htmlFor="vCap">Vehicle Type/Capacity/Body</CFormLabel>
                          <CFormInput
                            size="sm"
                            id="vCap"
                            value={`${VEHICLE_TYPE_MAP[singleVehicleInfo?.vehicle_info?.vehicle_type_id] || '-'
                              } / ${vehicleCapacityName || '-'
                              } Mts / ${vehicleBodyName || '-'
                              }`}
                            readOnly
                          />
                        </CCol>
                        <CCol xs={12} md={3}>
                          <CFormLabel htmlFor="OdometerKM">Odometer KM</CFormLabel>
                          <CFormInput size="sm" id="OdometerKM" value={singleVehicleInfo?.odometer_km || ''} readOnly />
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
                              {singleVehicleInfo?.odometer_photo &&
                                !singleVehicleInfo?.odometer_photo.includes('.pdf') ? (
                                <CCardImage orientation="top" src={singleVehicleInfo?.odometer_photo} />
                              ) : (
                                <iframe
                                  orientation="top"
                                  height={500}
                                  width={475}
                                  src={singleVehicleInfo?.odometer_photo}
                                ></iframe>
                              )}
                            </CModalBody>
                            {/* <CModalBody>
                  <CCardImage orientation="top" src={singleVehicleInfo?.odometer_photo} />
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
                            value={singleVehicleInfo?.gate_in_date_time_string || ''}
                            readOnly
                          />
                        </CCol>
                        {singleVehicleInfo.vehicle_inspection_status == null || '' || undefined ||
                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="inspectionDateTime">Inspection Date & Time</CFormLabel>
                            <CFormInput
                              size="sm"
                              id="inspectionDateTime"
                              type="text"
                              value={singleVehicleInfo?.vehicle_inspection_info?.inspection_time_string}
                              readOnly
                            />
                          </CCol>}
                          {singleVehicleInfo.tripsheet_info && (
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
                                value={singleVehicleInfo?.tripsheet_info?.nlmt_tripsheet_no || ''}
                                // value={singleVehicleInfo.trip_sheet_info.trip_sheet_no}
                                // id="tripsheet_id"
                                type="text"
                                readOnly
                              />
                            </CCol>
                          )}
                        <CCol xs={12} md={3}>
                          <CFormLabel htmlFor="driver_id">
                            Driver Name
                            {errors.driver_id && <span className="small text-danger">{errors.driver_id}</span>}
                          </CFormLabel>

                          {dirverAssign ? (
                            <CFormInput
                              size="sm"
                              id="driverName"
                              value={singleVehicleInfo?.driver_info?.driver_name || ''}
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
                          <CFormInput size="sm" id="driveMobile" value={singleVehicleInfo?.driver_info?.driver_phone_1 || ''}
                            readOnly />
                        </CCol>
                        {(singleVehicleInfo?.vehicle_current_position == "17" || singleVehicleInfo?.vehicle_current_position == "21") ? (
                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="status">Closing Odometer KM</CFormLabel>
                            <CFormInput size="sm" id="status" value={singleVehicleInfo?.odometer_km} readOnly />
                          </CCol>
                        ) : (
                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="odometer_closing_km">
                              Closing Odometer KM <REQ />{' '}
                              {errors.odometer_closing_km && <span className="small text-danger">{errors.odometer_closing_km}</span>}
                            </CFormLabel>
                            <CFormInput
                              size="sm"
                              id="odometer_closing_km"
                              value={values.odometer_closing_km}
                              onChange={handleChange}
                              name="odometer_closing_km"
                              onFocus={onFocus}
                              onBlur={onBlur}
                              className={`${errors.odometer_closing_km && 'is-invalid'}`}
                              maxLength={6} 
                            />
                          </CCol>
                        )}
                        
                        {/* ================ Running KM Tab Start ===================== */}
                        <CCol xs={12} md={3}>
                          <CFormLabel htmlFor="running_km">Running KM</CFormLabel>
                          <CFormInput size="sm" value={runningKM} readOnly />
                        </CCol>
                        {/* ================ Running KM Tab End ===================== */}
                        {!(singleVehicleInfo?.vehicle_current_position == "17" || singleVehicleInfo?.vehicle_current_position == "21") && (
                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="odometer_closing_photo">
                              Closing Odometer KM Photo <REQ />{' '}
                              {errors.odometer_closing_photo && <span className="small text-danger">{errors.odometer_closing_photo}</span>}
                            </CFormLabel>
                            <CButton className="w-100 m-0" color="info" size="sm" id="inputAddress">
                              {!fileuploaded ? (
                                <>
                                  <span className="float-start" onClick={uploadClick}>
                                    <CIcon
                                      style={{ color: 'red' }}
                                      icon={icon.cilFolderOpen}
                                      size="lg"
                                    />
                                    &nbsp;Upload
                                  </span>
                                  <span
                                    style={{ marginRight: '10%' }}
                                    className="mr-10 float-end"
                                    onClick={() => {
                                      setCamEnable(true)
                                    }}
                                  >
                                    <CIcon
                                      style={{ color: 'red' }}
                                      icon={icon.cilCamera}
                                      size="lg"
                                    />
                                    &nbsp;Camera
                                  </span>
                                </>
                              ) : (
                                <>
                                  <span className="float-start">
                                    &nbsp;{values.odometer_closing_photo.name}
                                  </span>
                                  <span className="float-end">
                                    <i
                                      className="fa fa-trash"
                                      aria-hidden="true"
                                      onClick={() => {
                                        setFileuploaded(false)
                                        values.odometer_closing_photo == ''
                                      }}
                                    ></i>
                                  </span>
                                </>
                              )}
                            </CButton>
                            <CFormInput size="sm"
                              type="file"
                              name="odometer_closing_photo"
                              onFocus={onFocus}
                              onBlur={onBlur}
                              onChange={(e) => { imageCompress(e) }}
                              className={`${errors.odometer_closing_photo && 'is-invalid'}`}
                              id="odometer_closing_photo"
                              accept='.jpg,.jepg,.png,.pdf'
                              style={{ display: 'none' }}
                              ref={input => {
                                // assigns a reference so we can trigger it later
                                inputFile = input;
                              }}
                            />
                          </CCol>
                        )}
                        <CCol xs={12} md={3}>
                          <CFormLabel htmlFor="remarks">Remarks</CFormLabel>
                          <CFormTextarea
                            name="remarks"
                            id="remarks"
                            onFocus={onFocus}
                            onBlur={onBlur}
                            onChange={handleChangenew}
                            value={remarks}
                            rows="1"
                          ></CFormTextarea>
                        </CCol>
                      </CRow>
                      <CRow className="mt-3">
                        <CCol>
                          <CButton
                            size="sm"
                            // disabled={enableSubmit}
                            color="primary"
                            className="text-white"
                          >
                            <Link className="text-white" to="/NlmtTripInOwnVehicle">
                              Previous
                            </Link>
                          </CButton>
                        </CCol>
                        
                        <CCol className="offset-md-6  d-md-flex justify-content-end" xs={12} sm={12} md={3}>
                          {singleVehicleInfo.tripsheet_info && singleVehicleInfo.tripsheet_info.sap_flag == 1 ? (
                              <CButton 
                                color="primary" 
                                onClick={() => {
                                  sapStatusChange()
                                }}
                              >
                                SAP Trip Stop Call to SAP
                              </CButton>
                            ) : (
                              <CButton
                                size="sm"
                                color="warning"
                                className="mx-3 px-3 text-white"
                                disabled={!(singleVehicleInfo.vehicle_current_position == '17' || singleVehicleInfo.vehicle_current_position == '21' ) && acceptBtn}
                                onClick={() => {
                                  setFetch(false)
                                  UpdateGateIn()
                                  // action()
                                }}
                              >
                                Submit
                              </CButton>
                            )}

                        </CCol>
                      </CRow>
                    </CForm>
                  </CTabPane>
                </CTabContent>
              </CCard>
            </> ) : (<AccessDeniedComponent />
          )}
        </>
      )}
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
      {/* Web Camera Modal Section */}
      <CModal
        visible={camEnable}
        backdrop="static"
        onClose={() => {
          setCamEnable(false)
          setImgSrc("")
        }}
      >
        <CModalHeader>
          <CModalTitle>Closing Odometer Photo</CModalTitle>
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

export default NlmtAfterDeliveryTripInDetails
