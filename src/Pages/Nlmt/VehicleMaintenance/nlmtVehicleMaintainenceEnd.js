import {
  CButton,
  CCard,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CRow,
  CTabContent,
  CTabPane,
  CFormTextarea,
  CModal,
  CModalTitle,
  CModalHeader,
  CModalBody,
  CAlert,
  CModalFooter,
} from '@coreui/react'

import React, { useEffect, useState, useRef } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import Webcam from 'react-webcam'
import CIcon from '@coreui/icons-react'
import * as icon from '@coreui/icons'
import FileResizer from 'react-image-file-resizer'

import useForm from 'src/Hooks/useForm'
import Loader from 'src/components/Loader'
import NlmtVehicleMaintenanceValidation from 'src/Utils/TransactionPages/VehicleMaintenance/NlmtVehicleMaintenanceValidation'
import NlmtVehicleMasterService from 'src/Service/Nlmt/Masters/NlmtVehicleMasterService'
import NlmtDriverMasterService from 'src/Service/Nlmt/Masters/NlmtDriverMasterService'
import NlmtVehicleMaintenanceService from 'src/Service/Nlmt/VehicleMaintenance/NlmtVehicleMaintenanceService'

const nlmtVehicleMaintainenceEnd = () => {
  const user_info = JSON.parse(localStorage.getItem('user_info'))
  const user_id = user_info.user_id
  const { id } = useParams()
  const navigate = useNavigate()

  /* ==================== STATE ========================*/
  const [fetch, setFetch] = useState(false)
  const [maintenanceInfo, setMaintenanceInfo] = useState({})
  const [vehicleNo, setVehicleNo] = useState('')
  const [driver, setDriver] = useState({})
  const [errorModal, setErrorModal] = useState(false)
  const [error, setError] = useState('')
  const [fileUploaded, setFileUploaded] = useState(false)
  const [camEnable, setCamEnable] = useState(false)
  const [imgSrc, setImgSrc] = useState(null)
  const [acceptBtn, setAcceptBtn] = useState(true)

  const webcamRef = useRef(null)
  let inputFile = null

  /* ==================== FORM ========================*/
  const formValues = {
    vehicle_id: '',
    driverId: '',
    vendorName: '',
    maintenenceType: '',
    maintenenceBy: '',
    workOrder: '',
    MaintenanceStart: '',
    MaintenanceEnd: '',
    openingOdoKM: '',
    closingOdoKM: '',
    closing_odometer_photo: '',
    remarks: '',
  }

  const {
    values,
    errors,
    handleChange,
    onBlur,
    onFocus,
    isTouched,
  } = useForm(() => { }, NlmtVehicleMaintenanceValidation, formValues)

  /* ==================== INITIAL LOAD ========================*/
  useEffect(() => {
    setFetch(false)

    NlmtVehicleMaintenanceService.getMaintenanceById(id)
      .then((res) => {
        const data = res.data.data
        setMaintenanceInfo(data)
        console.log(data, 'maintenanceInfo')
      values.vehicle_id = data.vehicle_id
      values.driverId = data.driver_id
      values.vendorName = data.vendor_id
      values.maintenenceType = data.maintenance_typ
      values.maintenenceBy = data.maintenance_by
      values.workOrder = data.work_order
      values.MaintenanceStart = data.maintenance_start_datetime
      values.MaintenanceEnd = data.maintenance_end_datetime
      values.openingOdoKM = data.opening_odometer_km
        if (data.vehicle_id) {
          NlmtVehicleMasterService.getNlmtVehiclesById(data.vehicle_id)
            .then(v => setVehicleNo(v.data.data.vehicle_number))
        }
      })
      .catch(() => toast.error('Failed to load maintenance'))
      .finally(() => setFetch(true))
  }, [id])

  /* ==================== DRIVER LOAD (OUTSIDE ONLY) ========================*/
  useEffect(() => {
    if (values.maintenenceBy !== 'outSide') return
    if (!values.driverId) return

    NlmtDriverMasterService.getNlmtDriversById(values.driverId)
      .then(res => setDriver(res.data.data))
  }, [values.driverId, values.maintenenceBy])

  /* ==================== ACCEPT BTN LOGIC ========================*/
  useEffect(() => {
    if (isTouched.MaintenanceEnd && !errors.MaintenanceEnd) {
      setAcceptBtn(false)
    } else {
      setAcceptBtn(true)
    }
  }, [errors, isTouched])

  /* ==================== CAMERA ========================*/
  const capture = () => {
    const imageSrc = webcamRef.current.getScreenshot()
    setImgSrc(imageSrc)
  }

  const dataURLtoFile = (dataurl, filename) => {
    const arr = dataurl.split(',')
    const mime = arr[0].match(/:(.*?);/)[1]
    const bstr = atob(arr[1])
    let n = bstr.length
    const u8arr = new Uint8Array(n)
    while (n--) u8arr[n] = bstr.charCodeAt(n)
    return new File([u8arr], filename, { type: mime })
  }

  const valueAppendToImage = (image) => {
    const file = dataURLtoFile(image, `odo_${Date.now()}.png`)
    values.closing_odometer_photo = file
    setFileUploaded(true)
  }

  /* ==================== FILE UPLOAD ========================*/
  const imageCompress = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (file.size > 5000000) {
      toast.warning('File must be less than 5MB')
      return
    }

    values.closing_odometer_photo = file
    setFileUploaded(true)
  }

  const uploadClick = (e) => {
    e.preventDefault()
    inputFile?.click()
  }

  /* ==================== FORMAT DATE ========================*/
  const formatDate = (input) => {
    if (!input) return ''
    const [y, m, d] = input.split('-')
    return `${d}-${m}-${y.slice(2)}`
  }

  /* ==================== SUBMIT ========================*/
  const addVehicleMaintenance = () => {
    setFetch(false)

    // VALIDATION
    if (values.maintenenceBy !== 'inHouse') {
      if (Number(values.closingOdoKM) <= Number(values.openingOdoKM)) {
        toast.warning('Closing KM must be greater than Opening KM')
        setFetch(true)
        return
      }

      if (!values.closing_odometer_photo) {
        toast.warning('Closing odometer photo required')
        setFetch(true)
        return
      }
      if (
        new Date(values.MaintenanceEnd) <
        new Date(values.MaintenanceStart)
      ) {
        toast.warning('Maintenance End Date cannot be before Start Date')
        setFetch(true)
        return
      }
    }
    console.log(maintenanceInfo, "maintenanceInfo")
    const data = new FormData()
  data.append('_method', 'PUT')


  data.append('vehicle_id', maintenanceInfo.vehicle_id)
  data.append('driver_id', maintenanceInfo.driver_id)
  data.append('parking_id', maintenanceInfo.parking_id)
  data.append('maintenance_typ', values.maintenenceType)
  data.append('maintenance_by', values.maintenenceBy)
data.append('work_order', values.workOrder ?? '')
  data.append('vendor_id', values.vendorName || '')

  data.append(
    'maintenance_start_datetime',
    values.MaintenanceStart || maintenanceInfo.maintenance_start_datetime
  )

  data.append('maintenance_end_datetime', values.MaintenanceEnd)

  data.append(
    'opening_odometer_km',
    values.openingOdoKM || maintenanceInfo.opening_odometer_km
  )

  data.append('closing_odometer_km', values.closingOdoKM || '')
  data.append(
    'vehicle_maintenance_status',
    values.maintenenceBy === 'inHouse' ? 3 : 4
  )

  data.append('closing_odometer_photo', values.closing_odometer_photo || '')
  data.append('remarks', values.remarks || '')
  data.append('created_by', user_id)


    NlmtVehicleMaintenanceService.updateMaintenance(id, data)
      .then(() => {
        toast.success('Maintenance End Completed!')
        navigate('/NlmtVehicleMaintainence')
      })
      .catch(() => {
        setError('Update failed')
        setErrorModal(true)
      })
      .finally(() => setFetch(true))
  }

  const REQ = () => <span className="text-danger"> * </span>

  /* ==================== UI ========================*/
  return (
    <>
      {!fetch && <Loader />}

      {fetch && (
        <CCard>
          <CTabContent>
            <CTabPane visible>
              <CForm className="p-3">

                {/* Vehicle Info */}
                <CRow>
                  <CCol md={3} className="mb-3">
                    <CFormLabel htmlFor="vehicle_id">Vehicle No</CFormLabel>
                    <CFormInput value={vehicleNo} readOnly />
                  </CCol>

                  <CCol md={3} className="mb-3">
                    <CFormLabel htmlFor="maintenenceBy">Maintenance By</CFormLabel>
                    <CFormInput
                      value={values.maintenenceBy === 'outSide' ? 'Out Side' : 'In House'}
                      readOnly
                    />
                  </CCol>
                  <CCol md={3} className="mb-3">
                    <CFormLabel htmlFor="maintenenceType">Maintenance Type</CFormLabel>
                    <CFormInput
                      value={values.maintenenceType === 'breakDown' ? 'Break Down' : 'Scheduled'}
                      readOnly
                    />
                  </CCol>

                  <CCol md={3} className="mb-3">
                    <CFormLabel htmlFor="MaintenanceStart">Maintenance Start Date</CFormLabel>
                    <CFormInput
                      value={formatDate(values.MaintenanceStart)}
                      readOnly
                    />
                  </CCol>

                  {values.maintenenceBy === 'outSide' && (
                    <CCol md={3} className="mb-3">
                      <CFormLabel htmlFor="driverId">Driver Name</CFormLabel>
                      <CFormInput
                        value={
                          driver?.driver_name
                            ? `${driver.driver_name} - ${driver.driver_code}`
                            : ''
                        }
                        readOnly
                      />
                    </CCol>
                  )}

                  {values.maintenenceBy !== 'inHouse' && (
                    <CCol md={3} className="mb-3">
                      <CFormLabel htmlFor="workOrder">Work Order</CFormLabel>
                      <CFormInput
                        value={values.workOrder}
                        readOnly
                      />
                    </CCol>
                  )}

                  {values.maintenenceBy !== 'inHouse' && (
                    <CCol md={3} className="mb-3">
                      <CFormLabel htmlFor="vendorName">Vendor Name</CFormLabel>
                      <CFormInput
                        value={values.vendorName}
                        readOnly
                      />
                    </CCol>
                  )}

                  <CCol md={3} className="mb-3">
                    <CFormLabel htmlFor="MaintenanceEnd">
                      Maintenance End Date <REQ />
                    </CFormLabel>
                    <CFormInput
                      type="date"
                      id="MaintenanceEnd"
                      name="MaintenanceEnd"
                      value={values.MaintenanceEnd}
                      onChange={handleChange}
                      onBlur={onBlur}
                      onFocus={onFocus}
                      className={errors.MaintenanceEnd ? 'is-invalid' : ''}
                    />
                    {errors.MaintenanceEnd && (
                      <span className="small text-danger">{errors.MaintenanceEnd}</span>
                    )}
                  </CCol>

                  {values.maintenenceBy !== 'inHouse' && (
                    <CCol md={3} className="mb-3">
                      <CFormLabel htmlFor="openingOdoKM">Opening Odometer KM</CFormLabel>
                      <CFormInput
                        value={values.openingOdoKM}
                        readOnly
                      />
                    </CCol>
                  )}

                  {values.maintenenceBy !== 'inHouse' && (
                    <CCol md={3} className="mb-3">
                      <CFormLabel htmlFor="closingOdoKM">
                        Closing Odometer KM <REQ />
                      </CFormLabel>
                      <CFormInput
                        type="text"
                        id="closingOdoKM"
                        name="closingOdoKM"
                        value={values.closingOdoKM}
                        onChange={handleChange}
                        onBlur={onBlur}
                        onFocus={onFocus}
                        maxLength="6"
                        className={errors.closingOdoKM ? 'is-invalid' : ''}
                      />
                      {errors.closingOdoKM && (
                        <span className="small text-danger">{errors.closingOdoKM}</span>
                      )}
                    </CCol>
                  )}

                  {values.maintenenceBy !== 'inHouse' && (
                    <CCol md={3} className="mb-3">
                      <CFormLabel htmlFor="closing_odometer_photo">
                        Closing Odometer Photo <REQ />
                      </CFormLabel>
                      {errors.closing_odometer_photo && (
                        <span className="small text-danger">{errors.closing_odometer_photo}</span>
                      )}
                      <CButton className="w-100 m-0" color="info" size="sm" id="inputAddress">
                        {!fileUploaded ? (
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
                              className="float-end"
                              onClick={() => setCamEnable(true)}
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
                              &nbsp;{values.closing_odometer_photo?.name}
                            </span>
                            <span
                              className="float-end"
                              onClick={() => {
                                values.closing_odometer_photo = ''
                                setFileUploaded(false)
                              }}
                            >
                              <i className="fa fa-trash" aria-hidden="true"></i>
                            </span>
                          </>
                        )}
                      </CButton>
                      <CFormInput
                        type="file"
                        size="sm"
                        id="closing_odometer_photo"
                        onChange={imageCompress}
                        onFocus={onFocus}
                        onBlur={onBlur}
                        accept=".jpg,.jpeg,.png,.pdf"
                        style={{ display: 'none' }}
                        ref={input => {
                          inputFile = input
                        }}
                      />
                    </CCol>
                  )}

                  <CCol md={3} className="mb-3">
                    <CFormLabel htmlFor="remarks">Remarks</CFormLabel>
                    <CFormTextarea
                      id="remarks"
                      name="remarks"
                      value={values.remarks}
                      onChange={handleChange}
                      onBlur={onBlur}
                      rows="1"
                    ></CFormTextarea>
                  </CCol>
                </CRow>

                {/* ACTIONS */}
                <CRow>
                  <CCol>
                    <Link to="/NlmtVehicleMaintainence">
                      <CButton
                        size="sm"
                        color="primary"
                        className="text-white"
                      >
                        Previous
                      </CButton>
                    </Link>
                  </CCol>

                  <CCol
                    className="text-end"
                  >
                    <CButton
                      size="sm"
                      color="warning"
                      className="mx-3 text-white"
                      type="button"
                      disabled={acceptBtn}
                      onClick={addVehicleMaintenance}
                    >
                      Maintenance End
                    </CButton>
                  </CCol>
                </CRow>

              </CForm>
            </CTabPane>
          </CTabContent>
        </CCard>
      )}

      {/* ERROR MODAL */}
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

      {/* CAMERA MODAL */}
      <CModal
        visible={camEnable}
        backdrop="static"
        onClose={() => {
          setCamEnable(false)
          setImgSrc('')
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
              <p className="mt-2">
                <CButton
                  size="sm"
                  color="warning"
                  className="mx-1 px-2 text-white"
                  type="button"
                  onClick={capture}
                >
                  Accept
                </CButton>
              </p>
            </>
          )}
          {imgSrc && (
            <>
              <img height={200} src={imgSrc} alt="Captured" />
              <p className="mt-2">
                <CButton
                  size="sm"
                  color="warning"
                  className="mx-1 px-2 text-white"
                  type="button"
                  onClick={() => {
                    setImgSrc('')
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
              setImgSrc('')
            }}
          >
            Cancel
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}

export default nlmtVehicleMaintainenceEnd
