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
  CInputGroup,
  CInputGroupText,
  CFormText,
  CFormCheck,
  CForm,
  CTabPane,
  CCard,
  CTabContent,
  CAlert
} from '@coreui/react'
import React,{ useState,useEffect } from 'react'
import useForm from 'src/Hooks/useForm'
import {useNavigate, useParams } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import AfterDeliveryGateInService from 'src/Service/AfterDeliveryGateIn/AfterDeliveryGateInService'
import AllDriverListSelectComponent from 'src/components/commoncomponent/AllDriverListSelectComponent'
import AfterDeliveryGateInValidation from 'src/Utils/AfterDeliveryGateIn/AfterDeliveryGateInValidation'
import Loader from 'src/components/Loader'
import ParkingYardGateService from 'src/Service/ParkingYardGate/ParkingYardGateService'

import Webcam from 'react-webcam'
import CIcon from '@coreui/icons-react'
import * as icon from '@coreui/icons';

import FileResizer from 'react-image-file-resizer'

import AccessDeniedComponent from 'src/components/commoncomponent/AccessDeniedComponent'
import JavascriptInArrayComponent from 'src/components/commoncomponent/JavascriptInArrayComponent'
import * as LogisticsProScreenNumberConstants from 'src/components/constants/LogisticsProScreenNumberConstants'

  const AfterDeliveryGateInDetails = () => {
    const formValues = {
      vehicle_id: '',
      odometer_closing_photo :'',
      odometer_closing_km :'',
      remarks :''
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
      OWN: 1,
      CONTRACT: 2,
      HIRE: 3,
    }
    const REQ = () => <span className="text-danger"> * </span>

    useEffect(() => {
      AfterDeliveryGateInService.getSingleVehicleInfoOnGate(id).then((res) => {
        setFetch(true)
        console.log(res.data.data,'getSingleVehicleInfoOnGate')
        if (res.status === 200) {
          values.vehicle_id = res.data.data.vehicle_id
          isTouched.vehicle_id = true
          isTouched.driver_id = true
          isTouched.tripsheet_id = true
          isTouched.vehicle_type_id = true
          // values.tripsheet_id = res.data.data.tripsheet_sheet_id
          values.trip_sheet_no = res.data.data.trip_sheet_info != null ? res.data.data.trip_sheet_info.trip_sheet_no : ''
          values.diesel_vendor_name=
          res.data.data.diesel_vendor != null ? res.data.data.diesel_vendor.diesel_vendor_name : ''
          values.vtype = res.data.data.vehicle_type_id != null ? res.data.data.vehicle_type_id.type : ''
          values.vbodytype = res.data.data.vehicle_body_type_id != null ? res.data.data.vehicle_body_type_id.id : ''
          values.type_id = res.data.data.vehicle_type_id!= null ? res.data.data.vehicle_type_id.id : ''
          values.vehicle_number = res.data.data.vehicle_location_id != null ? res.data.data.vehicle_location_id.vehicle_number : ''
          values.odometer_photo = res.data.data.vehicle_location_id != null ? res.data.data.vehicle_location_id.odometer_photo : ''
          values.vCap = res.data.data.vehicle_capacity_id != null ? res.data.data.vehicle_capacity_id.capacity : ''
          values.vCap_id = res.data.data.vehicle_capacity_id != null ? res.data.data.vehicle_capacity_id.id : ''
          values.inspection_time_string = res.data.data.vehicle_inspection_trip != null ? res.data.data.vehicle_inspection_trip.inspection_time_string : ''
          values.parking_id = res.data.data != null ? res.data.data.parking_yard_gate_id : ''
          values.created_by = res.data.data != null ? res.data.data.created_by : ''
          setRemarks(res.data.data != null ? res.data.data.remarks : '')
          let veh_info = res.data.data.updated_vehicle_info
          console.log(veh_info,'veh_info')
          setSingleVehicleInfo(res.data.data)
          console.log(singleVehicleInfo)
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
    console.log(userLocation,'userLocation')

    var lastIndex_new = userLocation.lastIndexOf(',')
    const userLocation_new = userLocation.substring(lastIndex_new+1)
    console.log(userLocation_new,'userLocation_new')

     /* ==================== Access Part Start ========================*/
const [screenAccess, setScreenAccess] = useState(false)
let page_no = LogisticsProScreenNumberConstants.ParkingYardGateModule.ParkingYardGate

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
      useForm(UpdateGateIn, AfterDeliveryGateInValidation, formValues)

      function UpdateGateIn() {
        if(values.odometer_closing_photo == '' && singleVehicleInfo.vehicle_current_position != "17" || values.odometer_closing_photo.size > 5000000 && singleVehicleInfo.vehicle_current_position != "17"){
          setFetch(true)
          toast.warning('Closing Odometer Required Less Than 5MB')
          return false
        }
        const data = new FormData()
        console.log(values)
        data.append('_method', 'PUT')
        data.append('odometer_closing_km', values.odometer_closing_km)
        data.append('vehicle_id', values.vehicle_id)
        data.append('parking_id', values.parking_id)
        data.append('odometer_closing_photo', values.odometer_closing_photo)
        data.append('remarks', remarks)

        var closing_km = values.odometer_closing_km
        if(closing_km < singleVehicleInfo.odometer_km && singleVehicleInfo.vehicle_current_position == "17"){
          setFetch(true)
          toast.warning('Closing KM Gretter Than Opening KM.')
          return false
        }
        else if(closing_km <= singleVehicleInfo.odometer_km && singleVehicleInfo.vehicle_current_position != "17"){
          setFetch(true)
          toast.warning('Closing KM Gretter Than Opening KM.')
          return false
        }
        AfterDeliveryGateInService.createGatein(id,data).then((res) =>{
          if (res.status == 200) {
            setFetch(true)
            toast.success('Previous Trip Completed Successfully!')
            setAcceptBtn(true)
            navigation('/GateIn')
          } 
        })
        .catch((error) => {
          setFetch(true)
          var object = error.res.data.errors
          var output = ''
          for (var property in object) {
            output += '*' + object[property] + '\n'
          }
          setError(output)
          setErrorModal(true)
        })
    }
      function action(type) {
        if (singleVehicleInfo.vehicle_number == '') {
          toast.warning('Invalid Vehicle Selected. Kindly Contact Admin.!')
          setFetch(true)
          return false
        } else if (singleVehicleInfo.driver_name == '') {
          toast.warning('Invalid Driver Selected. Kindly Contact Admin.!')
          setFetch(true)
          return false
        }

        var closing_km = values.odometer_closing_km
        if(closing_km < singleVehicleInfo.odometer_km && singleVehicleInfo.vehicle_current_position == "17"){
          setFetch(true)
          // toast.warning('Closing KM Gretter Than Opening KM.')
          return false
        }
        else if(closing_km <= singleVehicleInfo.odometer_km && singleVehicleInfo.vehicle_current_position != "17"){
          setFetch(true)
          // toast.warning('Closing KM Gretter Than Opening KM.')
          return false
        }

        if(values.odometer_closing_photo == '' && singleVehicleInfo.vehicle_current_position != "17"|| values.odometer_closing_photo.size > 5000000 && singleVehicleInfo.vehicle_current_position != "17"){
          // toast.warning('Please Upload the Closing Odometer Photo ..')
          setFetch(true)
          return false
        }

        let veh_info = singleVehicleInfo.updated_vehicle_info
        console.log(veh_info,'veh_info')

        const formData = new FormData()
        formData.append('vehicle_type_id', veh_info.vehicle_type_id) /* ============= */
        formData.append('vehicle_id', singleVehicleInfo.vehicle_id)
        formData.append('driver_id', singleVehicleInfo.driver_id)
        formData.append('odometer_km',  values.odometer_closing_km)
        formData.append('odometer_photo', values.odometer_closing_photo)
        formData.append('vehicle_number', singleVehicleInfo.vehicle_number)
        formData.append('vehicle_body_type_id', veh_info.vehicle_body_type_id) /* ============= */
        formData.append('vehicle_capacity_id', veh_info.vehicle_capacity_id) /* ============= */
        formData.append('driver_name', singleVehicleInfo.driver_name)
        formData.append('driver_contact_number', singleVehicleInfo.driver_contact_number)
        formData.append('remarks', remarks || '')
        formData.append('parking_status','1')
        formData.append('vehicle_current_position','1')
        formData.append('created_by',values.created_by)
        formData.append('action_type', '1')
        // formData.append('vehicle_location_id', userLocation)
        formData.append('vehicle_location_id', userLocation_new) 


        AfterDeliveryGateInService.createGate(formData)
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
            var object = error.res.data.errors
            var output = ''
            for (var property in object) {
              output += '*' + object[property] + '\n'
            }
            setError(output)
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
      if(!errors.odometer_closing_km && isTouched.odometer_closing_km  && !errors.odometer_closing_photo){
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
    values.odometer_closing_photo = file
    setFileuploaded(true)
  }
}else{

  const image = await resizeFile(file);
  if(file.size > 2000000){ // Condition Set only for compress more than 2mb files
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

   return new File([u8arr], filename, {type: mime});
 };

 const valueAppendToImage = (image) => {

   let file_name = 'dummy'+getRndInteger(100001,999999)+'.png'
   let file = dataURLtoFile(
     image,
     file_name,
   );

   console.log(file )

   values.odometer_closing_photo = file
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

   if(values.odometer_closing_photo) {
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
              <CFormLabel htmlFor="vType">Vehicle Type</CFormLabel>
              <CFormInput
                size="sm"
                id="vType"
                value={values.vtype}
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
                value={values.vCap}
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
                value={values.inspection_time_string}
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
              value={values.trip_sheet_no}
              // value={singleVehicleInfo.trip_sheet_info.trip_sheet_no}
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
                  value={singleVehicleInfo.driver_name}
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
              <CFormInput size="sm" id="driveMobile" value={singleVehicleInfo.driver_contact_number} readOnly />
            </CCol>
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
              maxLength={6}/>
            </CCol>
            {/* ================ Running KM Tab Start ===================== */}
            <CCol xs={12} md={3}>
              <CFormLabel htmlFor="running_km">Running KM</CFormLabel>
              <CFormInput size="sm" value={runningKM} readOnly />
            </CCol>
          {/* ================ Running KM Tab End ===================== */}
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
                onChange={(e)=>{imageCompress(e)}}
                className={`${errors.odometer_closing_photo && 'is-invalid'}`}
                id="odometer_closing_photo"
                accept='.jpg,.jepg,.png,.pdf'
                style={{display:'none'}}
                ref={input => {
                // assigns a reference so we can trigger it later
                inputFile = input;
                }}
                />
            </CCol>
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
                          <Link className="text-white" to="/GateIn">
                      Previous
                    </Link>
                      </CButton>
                    </CCol>
                    <CCol className="offset-md-6  d-md-flex justify-content-end" xs={12} sm={12} md={3}>
                    <CButton
                        size="sm"
                        color="warning"
                        className="mx-3 px-3 text-white"
                        disabled={singleVehicleInfo.vehicle_current_position !='17' && acceptBtn}
                        onClick={ () =>{setFetch(false)
                          UpdateGateIn();action()}}
                      >
                        Submit
                      </CButton>

                    </CCol>
                  </CRow>
                </CForm>
              </CTabPane>
            </CTabContent>
          </CCard>
         </>) : (<AccessDeniedComponent />)}
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

export default AfterDeliveryGateInDetails
