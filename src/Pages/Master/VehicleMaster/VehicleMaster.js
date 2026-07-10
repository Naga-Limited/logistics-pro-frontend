/* eslint-disable prettier/prettier */
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
  CFormCheck,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CAlert,
} from '@coreui/react'
import { React, useEffect, useState } from 'react'
import useForm from 'src/Hooks/useForm.js'
import VehicleMasterValidation from '../../../Utils/Master/VehicleMasterValidation'
import VehicleTypeService from 'src/Service/SmallMaster/Vehicles/VehicleTypeService'
import VehicleCapacityService from 'src/Service/SmallMaster/Vehicles/VehicleCapacityService'
import VehicleBodyTypeService from 'src/Service/SmallMaster/Vehicles/VehicleBodyTypeService'
import VehicleMasterService from 'src/Service/Master/VehicleMasterService'
import { Link, useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import Loader from 'src/components/Loader'
import 'react-toastify/dist/ReactToastify.css'
import VehicleVarietyService from 'src/Service/SmallMaster/Vehicles/VehicleVarietyService'
import VehicleGroupService from 'src/Service/SmallMaster/Vehicles/VehicleGroupService'
import { getCurrentDateTime } from 'src/Pages/Depo/CommonMethods/CommonMethods'
const VehicleMaster = () => {
  const formValues = {
    vehicleType: '',
    vechileNumber: '',
    VehicleCapacity: '',
    VehicleBodyType: '',
    VehicleVariety: '',
    VehicleGroup: '',
    RCCopyFront: '',
    RCCopyBack: '',
    InsuranceCopyFront: '',
    InsuranceCopyBack: '',
    InsuranceValidity: '',
    FCValidity: '',
    vehicleLength: '',
    vehicleWidth: '',
    vehicleHeight: '',
    vehicleFrontView: '',
    vehicleBackView: '',
    vehicleSideView: '',
  }

  const [vehicleType, setVehicleType] = useState([])
  const [vehicleMasterData, setVehicleMasterData] = useState([])
  const [vehicleCapacity, setVehicleCapacity] = useState([])
  const [vehicleVariety, setVehicleVariety] = useState([])
  const [vehicleGroup, setVehicleGroup] = useState([])
  const [vehicleBody, setVehicleBody] = useState([])
  const REQ = () => <span className="text-danger"> * </span>
  const [fetch, setFetch] = useState(false)
  const navigation = useNavigate()

  /*================== User Id Fetch ======================*/
  const user_info_json = localStorage.getItem('user_info')
  const user_info = user_info_json ? JSON.parse(user_info_json) : null
  const user_id = user_info && user_info.user_id ? user_info.user_id : 0
  /*================== User Id Fetch ======================*/

  const { values, errors, handleChange, onFocus, handleSubmit, enableSubmit, onBlur } = useForm(
    addNewVehicle,
    VehicleMasterValidation,
    formValues
  )

  const [errorModal, setErrorModal] = useState(false)
  const [error, setError] = useState({})

  const getNameById = (list, id, key) => {
    const target = list.find((item) => Number(item.id) === Number(id))
    return target && target[key] ? target[key] : ''
  }

  const vehicleAlreadyExistInVehicleMaster = (vno) => {
    let condition = 0
    vehicleMasterData.map((vb, lb) => {
      if (vb.vehicle_number == vno) {
        condition = 1
      }
    })

    return condition
  }

  function addNewVehicle() {
    const formData = new FormData()

    if (vehicleAlreadyExistInVehicleMaster(values.vechileNumber) === 1) {
      toast.warning('Entered Vehicle Number was already exists in Vehicle Master..!')
      return false
    }

    formData.append('vehicle_type_id', values.vehicleType)
    formData.append('vehicle_number', values.vechileNumber)
    formData.append('vehicle_capacity_id', values.VehicleCapacity)
    formData.append('vehicle_variety_id', values.VehicleVariety)
    formData.append('vehicle_group_id', values.VehicleGroup)
    formData.append('vehicle_body_type_id', values.VehicleBodyType)
    formData.append('rc_copy_front', values.RCCopyFront)
    formData.append('rc_copy_back', values.RCCopyBack)
    formData.append('insurance_copy_front', values.InsuranceCopyFront)
    formData.append('insurance_copy_back', values.InsuranceCopyBack)
    formData.append('insurance_validity', values.InsuranceValidity)
    formData.append('fc_validity', values.FCValidity)
    formData.append('vehicle_length', values.vehicleLength)
    formData.append('vehicle_width', values.vehicleWidth)
    formData.append('vehicle_height', values.vehicleHeight)
    formData.append('vehicle_front_view', values.vehicleFrontView)
    formData.append('vehicle_back_view', values.vehicleBackView)
    formData.append('vehicle_side_view', values.vehicleSideView)
    formData.append('created_by', user_id)
    setFetch(false)

    let current_time = getCurrentDateTime()
    let current_info = []
    current_info.push({
      vehicle_number: values.vechileNumber,
      vehicle_type_id: values.vehicleType,
      vehicle_type_name: getNameById(vehicleType, values.vehicleType, 'type'),
      vehicle_capacity_id: values.VehicleCapacity,
      vehicle_capacity_name: getNameById(vehicleCapacity, values.VehicleCapacity, 'capacity'),
      vehicle_body_type_id: values.VehicleBodyType,
      vehicle_body_type_name: getNameById(vehicleBody, values.VehicleBodyType, 'body_type'),
      vehicle_variety_id: values.VehicleVariety,
      vehicle_variety_name: getNameById(vehicleVariety, values.VehicleVariety, 'vehicle_variety'),
      vehicle_group_id: values.VehicleGroup,
      vehicle_group_name: getNameById(vehicleGroup, values.VehicleGroup, 'vehicle_group'),
      vehicle_length: values.vehicleLength,
      vehicle_width: values.vehicleWidth,
      vehicle_height: values.vehicleHeight,
      insurance_validity: values.InsuranceValidity,
      fc_validity: values.FCValidity,
      type: 1,
      user: user_info.emp_name || user_id,
      time: current_time,
      remarks: '',
    })
    formData.append('log_info', JSON.stringify(current_info))

    VehicleMasterService.createVehicles(formData)
      .then((res) => {
        setFetch(true)
        if (res.status === 201) {
          toast.success('Vehicle Created Successfully!')

          setTimeout(() => {
            navigation('/VehicleMasterTable')
          }, 1000)
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

  useEffect(() => {
    //section for getting vehicle type from database
    VehicleTypeService.getVehicleTypes().then((res) => {
      // setFetch(true)
      setVehicleType(res.data.data)
    })

    //section for getting vehicle Master from database
    VehicleMasterService.getVehicles().then((res) => {
      setFetch(true)
      setVehicleMasterData(res.data.data)
    })

    //section for getting vehicle capacity from database
    VehicleCapacityService.getVehicleCapacity().then((res) => {
      setVehicleCapacity(res.data.data)
    })

    //section for getting vehicle Body Type from database
    VehicleBodyTypeService.getVehicleBody().then((res) => {
      setVehicleBody(res.data.data)
    })

    //section for getting vehicle variety from database
    VehicleVarietyService.getVehicleVariety().then((res) => {
      setVehicleVariety(res.data.data)
    })

    //section for getting vehicle group from database
    VehicleGroupService.getVehicleGroup().then((res) => {
      setVehicleGroup(res.data.data)
    })
  }, [])

  // console.log(values);

  return (
    <>
      {!fetch && <Loader />}
      {fetch && (
        <CCard>
          <CTabContent>
            <CTabPane role="tabpanel" aria-labelledby="home-tab" visible={true}>
              <CForm className="row g-3 m-2 p-1" onSubmit={handleSubmit}>
                <CRow className="mb-md-1">
                  <CCol md={3}>
                    <CFormLabel htmlFor="vType">
                      Vehicle Type
                      <REQ />{' '}
                      {errors.vehicleType && (
                        <span className="small text-danger">{errors.vehicleType}</span>
                      )}
                    </CFormLabel>
                    <CFormSelect
                      size="sm"
                      name="vehicleType"
                      onChange={handleChange}
                      onFocus={onFocus}
                      value={values.vehicleType}
                      className={`mb-1 ${errors.vehicleType && 'is-invalid'}`}
                      aria-label="Small select example"
                      id="vType"
                    >
                      <option value="0">Select ...</option>
                      {vehicleType.map(({ id, type }) => {
                        if (id <= 2) {
                          return (
                            <>
                              <option key={id} value={id}>
                                {type}
                              </option>
                            </>
                          )
                        }
                      })}
                    </CFormSelect>
                  </CCol>

                  <CCol md={3}>
                    <CFormLabel htmlFor="vNum">
                      Vehicle Number
                      <REQ />{' '}
                      {errors.vechileNumber && (
                        <span className="small text-danger">{errors.vechileNumber}</span>
                      )}
                    </CFormLabel>
                    <CFormInput
                      name="vechileNumber"
                      size="sm"
                      maxLength={10}
                      id="vNum"
                      onChange={handleChange}
                      value={values.vechileNumber}
                      onFocus={onFocus}
                      onBlur={onBlur}
                      placeholder=""
                    />
                  </CCol>

                  <CCol md={3}>
                    <CFormLabel htmlFor="vCap">
                      Vehicle Capacity
                      <REQ />{' '}
                      {errors.VehicleCapacity && (
                        <span className="small text-danger">{errors.VehicleCapacity}</span>
                      )}
                    </CFormLabel>

                    <CFormSelect
                      size="sm"
                      name="VehicleCapacity"
                      onChange={handleChange}
                      onFocus={onFocus}
                      value={values.VehicleCapacity}
                      className={`mb-1 ${errors.VehicleCapacity && 'is-invalid'}`}
                      aria-label="Small select example"
                      id="vCap"
                    >
                      <option value="0">Select ...</option>
                      {vehicleCapacity.map(({ id, capacity }) => {
                        return (
                          <>
                            <option key={id} value={id}>
                              {capacity}
                            </option>
                          </>
                        )
                      })}
                    </CFormSelect>
                  </CCol>

                  <CCol md={3}>
                    <CFormLabel htmlFor="vVty">
                      Vehicle Variety
                      <REQ />{' '}
                      {errors.VehicleVariety && (
                        <span className="small text-danger">{errors.VehicleVariety}</span>
                      )}
                    </CFormLabel>

                    <CFormSelect
                      size="sm"
                      name="VehicleVariety"
                      onChange={handleChange}
                      onFocus={onFocus}
                      value={values.VehicleVariety}
                      className={`mb-1 ${errors.VehicleVariety && 'is-invalid'}`}
                      aria-label="Small select example"
                      id="vCap"
                    >
                      <option value="0">Select ...</option>
                      {vehicleVariety.map(({ id, vehicle_variety }) => {
                        return (
                          <>
                            <option key={id} value={id}>
                              {vehicle_variety}
                            </option>
                          </>
                        )
                      })}
                    </CFormSelect>
                  </CCol>

                  <CCol md={3}>
                    <CFormLabel htmlFor="vGrp">
                      Vehicle Group
                      <REQ />{' '}
                      {errors.VehicleGroup && (
                        <span className="small text-danger">{errors.VehicleGroup}</span>
                      )}
                    </CFormLabel>

                    <CFormSelect
                      size="sm"
                      name="VehicleGroup"
                      onChange={handleChange}
                      onFocus={onFocus}
                      value={values.VehicleGroup}
                      className={`mb-1 ${errors.VehicleGroup && 'is-invalid'}`}
                      aria-label="Small select example"
                      id="vCap"
                    >
                      <option value="0">Select ...</option>
                      {vehicleGroup.map(({ id, vehicle_group }) => {
                        return (
                          <>
                            <option key={id} value={id}>
                              {vehicle_group}
                            </option>
                          </>
                        )
                      })}
                    </CFormSelect>
                  </CCol>

                  <CCol md={3}>
                    <CFormLabel htmlFor="vBody">
                      Vehicle Body Type
                      <REQ />{' '}
                      {errors.VehicleBodyType && (
                        <span className="small text-danger">{errors.VehicleBodyType}</span>
                      )}
                    </CFormLabel>
                    <CFormSelect
                      size="sm"
                      name="VehicleBodyType"
                      id="vBody"
                      onFocus={onFocus}
                      onBlur={onBlur}
                      onChange={handleChange}
                      value={values.VehicleBodyType}
                      className={`mb-1 ${errors.VehicleBodyType && 'is-invalid'}`}
                      aria-label="Small select example"
                    >
                      <option value="0">Select ...</option>

                      {vehicleBody.map(({ id, body_type }) => {
                        return (
                          <>
                            <option key={id} value={id}>
                              {body_type}
                            </option>
                          </>
                        )
                      })}
                    </CFormSelect>
                  </CCol>
                  {/* </CRow>
              <CRow className="mb-md-1"> */}
                  <CCol md={3}>
                    <CFormLabel htmlFor="rcFront">
                      RC Copy Front
                      <REQ />{' '}
                      {errors.RCCopyFront && (
                        <span className="small text-danger">{errors.RCCopyFront}</span>
                      )}
                    </CFormLabel>
                    <CFormInput
                      onBlur={onBlur}
                      onChange={handleChange}
                      type="file"
                      accept=".jpg,.jpeg,.png,.pdf"
                      name="RCCopyFront"
                      size="sm"
                      id="rcFront"
                    />
                  </CCol>
                  <CCol md={3}>
                    <CFormLabel htmlFor="rcBack">
                      RC Copy Back
                      <REQ />{' '}
                      {errors.RCCopyBack && (
                        <span className="small text-danger">{errors.RCCopyBack}</span>
                      )}
                    </CFormLabel>
                    <CFormInput
                      onBlur={onBlur}
                      onChange={handleChange}
                      type="file"
                      accept=".jpg,.jpeg,.png,.pdf"
                      name="RCCopyBack"
                      size="sm"
                      id="rcBack"
                    />
                  </CCol>
                  <CCol md={3}>
                    <CFormLabel htmlFor="iFront">
                      Insurance Copy Front
                      <REQ />{' '}
                      {errors.InsuranceCopyFront && (
                        <span className="small text-danger">{errors.InsuranceCopyFront}</span>
                      )}
                    </CFormLabel>
                    <CFormInput
                      onBlur={onBlur}
                      onChange={handleChange}
                      type="file"
                      accept=".jpg,.jpeg,.png,.pdf"
                      name="InsuranceCopyFront"
                      size="sm"
                      id="iFront"
                    />
                  </CCol>
                  <CCol md={3}>
                    <CFormLabel htmlFor="iBack">
                      Insurance Copy Back
                      <REQ />{' '}
                      {errors.InsuranceCopyBack && (
                        <span className="small text-danger">{errors.InsuranceCopyBack}</span>
                      )}
                    </CFormLabel>
                    <CFormInput
                      onBlur={onBlur}
                      onChange={handleChange}
                      type="file"
                      required
                      accept=".jpg,.jpeg,.png,.pdf"
                      name="InsuranceCopyBack"
                      size="sm"
                      id="iBack"
                    />
                  </CCol>
                  {/* </CRow>
              <CRow className="mb-md-1"> */}
                  <CCol md={3}>
                    <CFormLabel htmlFor="iValidaitiy">
                      Insurance Validity
                      <REQ />{' '}
                      {errors.InsuranceValidity && (
                        <span className="small text-danger">{errors.InsuranceValidity}</span>
                      )}
                    </CFormLabel>
                    <CFormInput
                      type="date"
                      onBlur={onBlur}
                      onFocus={onFocus}
                      onChange={handleChange}
                      size="sm"
                      required
                      value={values.InsuranceValidity}
                      id="iValidaitiy"
                      name="InsuranceValidity"
                      placeholder="date"
                    />
                  </CCol>
                  <CCol md={3}>
                    <CFormLabel htmlFor="fcvalid">
                      FC Validity
                      <REQ />{' '}
                      {errors.FCValidity && (
                        <span className="small text-danger">{errors.FCValidity}</span>
                      )}
                    </CFormLabel>
                    <CFormInput
                      type="date"
                      size="sm"
                      required
                      value={values.FCValidity}
                      onBlur={onBlur}
                      onFocus={onFocus}
                      onChange={handleChange}
                      id="fcvalid"
                      name="FCValidity"
                      placeholder="date"
                    />
                  </CCol>
                </CRow>
                <CRow className="mb-md-1">
                  <CCol md={3}>
                    <CFormLabel htmlFor="vLength">Vehicle Length (ft)</CFormLabel>
                    <CFormInput
                      // type="number"
                      step="0.01"
                      maxLength={4}
                      name="vehicleLength"
                      size="sm"
                      id="vLength"
                      onChange={(e) => {
                        e.target.value = e.target.value
                          .replace(/[^0-9.]/g, '')
                          .replace(/(\..*)\./g, '$1')
                        handleChange(e)
                      }}
                      value={values.vehicleLength}
                      onFocus={onFocus}
                      onBlur={onBlur}
                      placeholder="e.g. 20.5"
                    />
                  </CCol>
                  <CCol md={3}>
                    <CFormLabel htmlFor="vWidth">
                      Vehicle Width (ft)
                    </CFormLabel>
                    <CFormInput
                      // type="number"
                      maxLength={4}
                      step="0.01"
                      name="vehicleWidth"
                      size="sm"
                      id="vWidth"
                      onChange={(e) => {
                        e.target.value = e.target.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
                        handleChange(e);
                      }}
                      value={values.vehicleWidth}
                      onFocus={onFocus}
                      onBlur={onBlur}
                      placeholder="e.g. 8.5"
                    />
                  </CCol>
                  <CCol md={3}>
                    <CFormLabel htmlFor="vHeight">
                      Vehicle Height (ft)
                    </CFormLabel>
                    <CFormInput
                      step="0.01"
                      maxLength={4}
                      name="vehicleHeight"
                      size="sm"
                      id="vHeight"
                      onChange={(e) => {
                        e.target.value = e.target.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
                        handleChange(e);
                      }}
                      value={values.vehicleHeight}
                      onFocus={onFocus}
                      onBlur={onBlur}
                      placeholder="e.g. 10.2"
                    />
                  </CCol>
                  {/* </CRow>
                <CRow className="mb-md-1"> */}
                  <CCol md={3}>
                    <CFormLabel htmlFor="vFrontView">
                      Vehicle Front View
                    </CFormLabel>
                    <CFormInput
                      type="file"
                      accept=".jpg,.jpeg,.png,.pdf"
                      name="vehicleFrontView"
                      size="sm"
                      id="vFrontView"
                      onChange={handleChange}
                      onBlur={onBlur}
                    />
                  </CCol>
                  <CCol md={3}>
                    <CFormLabel htmlFor="vBackView">
                      Vehicle Back View
                    </CFormLabel>
                    <CFormInput
                      type="file"
                      accept=".jpg,.jpeg,.png,.pdf"
                      name="vehicleBackView"
                      size="sm"
                      id="vBackView"
                      onChange={handleChange}
                      onBlur={onBlur}
                    />
                  </CCol>
                  <CCol md={3}>
                    <CFormLabel htmlFor="vSideView">
                      Vehicle Side View
                    </CFormLabel>
                    <CFormInput
                      type="file"
                      accept=".jpg,.jpeg,.png,.pdf"
                      name="vehicleSideView"
                      size="sm"
                      id="vSideView"
                      onChange={handleChange}
                      onBlur={onBlur}
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
                      type="submit"
                      disabled={enableSubmit}
                    >
                      ADD
                    </CButton>
                    <Link to={'/VehicleMasterTable'}>
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
          {/* Error Modal Section Start */}
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
        {/* Error Modal Section End */}
      </CCard>
    )}
    </>
  )
}

export default VehicleMaster
