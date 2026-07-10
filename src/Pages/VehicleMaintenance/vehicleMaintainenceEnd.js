import {
  CButton,
  CCard,
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
  CFormTextarea,
  CModal,
  CModalTitle,
  CModalHeader,
  CModalBody,
  CAlert,
  CModalFooter,
} from '@coreui/react'

import React,{ useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import DriverListSelectComponent from 'src/components/commoncomponent/DriverListSelectComponent'
import useForm from 'src/Hooks/useForm'
import VehicleMaintenanceValidation from 'src/Utils/TransactionPages/VehicleMaintenance/VehicleMaintenanceValidation'
import VehicleMaintenanceService from 'src/Service/VehicleMaintenance/VehicleMaintenanceService'
import ParkingYardGateService from 'src/Service/ParkingYardGate/ParkingYardGateService'
import validate from 'src/Utils/Validation'
import CustomTable from '../../components/customComponent/CustomTable'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import MaintenanceWorkorderComponent from 'src/components/commoncomponent/MaintenanceWorkorderComponent'
import MaintenanceWorkorderService from 'src/Service/MaintenanceWorkorder/MaintenanceWorkorderService'
import VehicleMasterService from 'src/Service/Master/VehicleMasterService'
import MaintenanceWorkOrder from 'src/Service/SAP/MaintenanceWorkOrder'
import Loader from 'src/components/Loader'
import DriverMasterService from 'src/Service/Master/DriverMasterService'
import VehicleInspectionService from 'src/Service/VehicleInspection/VehicleInspectionService'

import AccessDeniedComponent from 'src/components/commoncomponent/AccessDeniedComponent'
import JavascriptInArrayComponent from 'src/components/commoncomponent/JavascriptInArrayComponent'
import * as LogisticsProScreenNumberConstants from 'src/components/constants/LogisticsProScreenNumberConstants'

import Webcam from 'react-webcam'
import CIcon from '@coreui/icons-react'
import * as icon from '@coreui/icons';

import FileResizer from 'react-image-file-resizer'

const VehicleMaintainenceEnd = () => {
  const user_info_json = localStorage.getItem('user_info')
  const user_info = JSON.parse(user_info_json)

  /* Get User Id From Local Storage */
  const user_id = user_info.user_id

  /* ==================== Access Part Start ========================*/
  const [screenAccess, setScreenAccess] = useState(false)
  let page_no = LogisticsProScreenNumberConstants.VehicleMaintenanceModuleScreen.Vehicle_Maintenance_Started

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
    vehicle_id: '',
    driver_id: '',
    vendorName: '',
    maintenenceType: '',
    maintenenceBy: '',
    workOrder: '',
    vendorName: '',
    MaintenanceStart: '',
    MaintenanceEnd: '',
    closingOdoKM: '',
    closing_odometer_photo: '',
  }
  const border = {
    borderColor: '#b1b7c1',
  }

  const { values, errors, handleChange, onFocus, handleSubmit, enableSubmit, onBlur, isTouched } =
    useForm(MaintenanceVehicle, VehicleMaintenanceValidation, formValues)

  const navigation = useNavigate()

  const addVehicleMaintenance = (status) => {
    // let data = new FormData();
    let data = new FormData()
    data.append('_method', 'PUT')
    data.append('vehicle_id', values.vehicle_id)
    data.append('parking_id', currentVehicleInfo.parking_id)
    data.append('maintenance_typ', maintenance_info.maintenance_typ)
    data.append('maintenance_by', maintenance_info.maintenance_by)
    data.append('work_order', values.workOrder)
    data.append('vendor_id', values.vendorName)
    data.append('maintenance_start_datetime', values.MaintenanceStart)
    data.append('maintenance_end_datetime', values.MaintenanceEnd)
    data.append('opening_odometer_km', values.openingOdoKM)
    data.append('closing_odometer_km', values.closingOdoKM)
    data.append('vehicle_maintenance_status', status == 'inHouse' ? 3 : 4)
    data.append('closing_odometer_photo', values.closing_odometer_photo)
    data.append('remarks', values.remarks ? values.remarks : 'NO REMARKS')
    data.append('created_by', user_id)

    if (values.maintenenceBy != 'inHouse') {
      var closing_km = values.closingOdoKM
      if (Number(closing_km) <= Number(values.openingOdoKM)) {
        setFetch(true)
        toast.warning('Closing KM Greater Than Opening KM.')
        return false
      } else if (values.closing_odometer_photo == '' || values.closing_odometer_photo.size > 5000000) {
        setFetch(true)
        toast.warning('Please Upload Closing Odometer Photo Less Than 5MB.')
        return false
      }
    }
    // var p = values.closingOdoKM

    VehicleMaintenanceService.updateMaintenance(id, data)
      .then((res) => {
        if (res.status === 201) {
          setFetch(true)
          toast.success('Maintenance End Completed!')
          navigation('/vMain')
        } else {
          toast.warning('Failed To Assign Trip Maintenance End.Kindly Contact Admin.!')
        }
      })
      .catch((error) => {
        setFetch(true)
        var object = error.response.data.errors
        var output = ''
        for (var property in object) {
          output += '*' + object[property] + '\n'
        }
        setError(output)
        setErrorModal(true)
      })
  }

  function MaintenanceVehicle() {}

  const REQ = () => <span className="text-danger"> * </span>
  const [currentVehicleInfo, setCurrentVehicleInfo] = useState({})
  const [maintenance_info, setMaintenance_info] = useState([])
  const [vehicle_no, setVehicle_no] = useState('')
  const [acceptBtn, setAcceptBtn] = useState(true)
  const [fetch, setFetch] = useState(false)
  const [driver, setDriver] = useState([])
  const [errorModal, setErrorModal] = useState(false)
  const [error, setError] = useState({})
  const VEHICLE_TYPE = {
    OWN: 1,
    CONTRACT: 2,
    HIRE: 3,
    PARTY: 4,
  }

  const { id } = useParams()

  console.log(id)

  /* Date Format Change : yyyy-mm-dd to dd-mm-yy */
  const formatDate = (input) => {
    var datePart = input.match(/\d+/g),
      year = datePart[0].substring(2), // get only two digits
      month = datePart[1],
      day = datePart[2]

    return day + '-' + month + '-' + year
  }

  useEffect(() => {
    if (values.driverId) {
      /* Fetch Driver data From DB */
      DriverMasterService.getDriversById(values.driverId).then((res) => {
        console.log(res.data.data)
        setDriver(res.data.data)
      })
    }
  }, [values.driverId])

  useEffect(() => {
    if (isTouched.MaintenanceEnd && !errors.MaintenanceEnd) {
      setAcceptBtn(false)
    } else {
      setAcceptBtn(true)
    }
  }, [errors])
  useEffect(() => {
    //section to fetch single maintenance info
    VehicleMaintenanceService.getMaintenanceById(id).then((res) => {
      console.log(res.data.data)
      setMaintenance_info(res.data.data)
      if (res.data.data.vehicle_id) {
        VehicleMasterService.getVehiclesById(res.data.data.vehicle_id).then((item) => {
          setFetch(true)
          setVehicle_no(item.data.data.vehicle_number)
          isTouched.vehicle_id = true
        })
      }
      values.vehicle_id = res.data.data.vehicle_id
      values.driverId = res.data.data.driver_id
      values.maintenenceType = res.data.data.maintenance_typ
      values.maintenenceBy = res.data.data.maintenance_by
      values.workOrder = res.data.data.work_order
      values.vendorName = res.data.data.vendor_id
      values.MaintenanceStart = res.data.data.maintenance_start_datetime
      values.MaintenanceEnd = res.data.data.maintenance_end_datetime
      values.openingOdoKM = res.data.data.opening_odometer_km
      // isTouched.vehicle_id = true
      isTouched.remarks = true
      setCurrentVehicleInfo(res.data.data)
    })
  }, [id])

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
    values.closing_odometer_photo = file
    setFileuploaded(true)
  }
}else{

  const image = await resizeFile(file);
  if(file.size > 2000000){ // Condition Set only for compress more than 2mb files
    valueAppendToImage(image)
    setFileuploaded(true)
  } else {
    values.closing_odometer_photo = file
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

   values.closing_odometer_photo = file
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

   if(values.closing_odometer_photo) {
     setFileuploaded(true)
   } else {
     setFileuploaded(false)
   }

 }, [values.closing_odometer_photo])

/* ==================== File ReSize End ========================*/

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
                      <CRow>
                        <CCol xs={12} md={3}>
                          <CFormLabel htmlFor="vehicle_id">Vehicle No </CFormLabel>
                          <CFormInput
                            name="vehicle_id"
                            size="sm"
                            id="vehicle_id"
                            value={vehicle_no}
                            placeholder=""
                            readOnly
                          />
                        </CCol>
                        <CCol className="mb-3" md={3}>
                          <CFormLabel htmlFor="maintenenceBy">Maintenance By</CFormLabel>
                          <CFormInput
                            name="maintenenceBy"
                            size="sm"
                            id="maintenenceBy"
                            value={values.maintenenceBy == 'outSide' ? 'Out Side' : 'In side'}
                            readOnly
                          />
                        </CCol>
                        <CCol className="mb-3" md={3}>
                          <CFormLabel htmlFor="maintenenceType">Maintenance Type </CFormLabel>
                          <CFormInput
                            name="maintenenceType"
                            size="sm"
                            id="maintenenceType"
                            value={values.maintenenceType == 'breakDown' ? 'Break Down' : 'Scheduled'}
                            readOnly
                          />
                        </CCol>
                        <CCol xs={12} md={3}>
                          <CFormLabel htmlFor="MaintenanceStart">
                            Maintenance Start Date
                            {errors.MaintenanceStart && (
                              <span className="small text-danger">{errors.MaintenanceStart}</span>
                            )}
                          </CFormLabel>

                          <CFormInput
                            size="sm"
                            id="MaintenanceStart"
                            name="MaintenanceStart"
                            value={formatDate(values.MaintenanceStart)}
                            readOnly
                          />
                        </CCol>
                        {values.maintenenceBy != 'inHouse' && (
                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="driverId">Driver Name </CFormLabel>
                            <CFormInput
                              name="driverId"
                              size="sm"
                              id="driverId"
                              value={driver.driver_name +' - '+driver.driver_code}
                              readOnly
                            />
                          </CCol>
                        )}
                        {values.maintenenceBy != 'inHouse' && (
                          <CCol className="mb-3" md={3}>
                            <CFormLabel htmlFor="workOrder">Work Order</CFormLabel>
                            <CFormInput
                              name="workOrder"
                              size="sm"
                              id="workOrder"
                              value={values.workOrder}
                              readOnly
                            />
                          </CCol>
                        )}

                        {values.maintenenceBy != 'inHouse' && (
                          <CCol className="mb-3" md={3}>
                            <CFormLabel htmlFor="vendorName">Vendor Name</CFormLabel>
                            <CFormInput
                              size="sm"
                              id="vendorName"
                              name="vendorName"
                              value={values.vendorName}
                              readOnly
                            />
                          </CCol>
                        )}

                        <CCol xs={12} md={3}>
                          <CFormLabel htmlFor="MaintenanceEnd">
                            Maintenance End Date <REQ />{' '}
                            {errors.MaintenanceEnd && (
                              <span className="small text-danger">{errors.MaintenanceEnd}</span>
                            )}
                          </CFormLabel>

                          <CFormInput
                            size="sm"
                            id="MaintenanceEnd"
                            className={`${errors.MaintenanceEnd && 'is-invalid'}`}
                            name="MaintenanceEnd"
                            value={values.MaintenanceEnd}
                            type="date"
                            onFocus={onFocus}
                            onBlur={onBlur}
                            onChange={handleChange}
                          />
                        </CCol>
                        {values.maintenenceBy != 'inHouse' && values.maintenenceBy && (
                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="openingOdoKM">Opening Odometer KM</CFormLabel>
                            <CFormInput
                              size="sm"
                              id="openingOdoKM"
                              name="openingOdoKM"
                              value={values.openingOdoKM}
                              type="text"
                              readOnly
                            />
                          </CCol>
                        )}
                        {values.maintenenceBy != 'inHouse' && (
                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="closingOdoKM">
                              Closing Odometer KM <REQ />{' '}
                              {errors.closingOdoKM && (
                                <span className="small text-danger">{errors.closingOdoKM}</span>
                              )}
                            </CFormLabel>
                              <CFormInput
                                size="sm"
                                id="closingOdoKM"
                                name="closingOdoKM"
                                value={values.closingOdoKM}
                                type="text"
                                maxLength="6"
                                //   onChange={(e)=>{
                                //     validateClosingOdoKMValidation(e,values.openingOdoKM);
                                //     handleChange(e);
                                // }}
                                max={values.openingOdoKM}
                                onFocus={onFocus}
                                onBlur={onBlur}
                                onChange={handleChange}
                              />
                          </CCol>
                        )}
                        {values.maintenenceBy != 'inHouse' && (
                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="closing_odometer_photo">
                              Closing Odometer Photo <REQ />{' '}
                            </CFormLabel>
                            {errors.closing_odometer_photo && (
                              <span className="small text-danger">{errors.closing_odometer_photo}</span>
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
                                    &nbsp;{values.closing_odometer_photo.name}
                                  </span>
                                  <span className="float-end">
                                    <i
                                      className="fa fa-trash"
                                      aria-hidden="true"
                                      onClick={() => {
                                        setFileuploaded(false)
                                        values.closing_odometer_photo == ''
                                      }}
                                    ></i>
                                  </span>
                                </>
                                )}
                            </CButton>
                            <CFormInput
                              name="closing_odometer_photo"
                              type="file"
                              size="sm"
                              id="closing_odometer_photo"
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
                        )}
                        <CCol xs={12} md={3}>
                          <CFormLabel htmlFor="remarks">Remarks</CFormLabel>
                          <CFormTextarea
                            name="remarks"
                            id="remarks"
                            onBlur={onBlur}
                            onChange={handleChange}
                            value={values.remarks}
                            rows="1"
                          ></CFormTextarea>
                        </CCol>
                      </CRow>

                  <CRow>
                    <CCol>
                      <Link to={'/VMain'}>
                        <CButton
                          md={6}
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
                          className="pull-right"
                          xs={12}
                          sm={12}
                          md={3}
                          style={{ display: 'flex', justifyContent: 'flex-end' }}
                        >
                          <CButton
                            size="sm"
                            color="warning"
                            className="mx-3 text-white"
                            type="button"
                            disabled={acceptBtn}
                            onClick={() => {
                              setFetch(false)
                              addVehicleMaintenance(values.maintenenceBy)
                            }}
                          >
                            Maintenence End
                          </CButton>
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

export default VehicleMaintainenceEnd
