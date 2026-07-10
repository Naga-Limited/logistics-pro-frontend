import { CCol, CFormInput, CFormLabel, CFormSelect } from '@coreui/react'
import React, { useEffect } from 'react'
import VehicleCapacitySelectField from '../CommonComponent/VehicleCapacitySelectField'
import VehicleTypeSelectField from '../CommonComponent/VehicleTypeSelectField'

const HireSection = ({
  errors,
  onFocus,
  onBlur,
  handleChange,
  values,
  isTouched,
  setIsTouched,
  setErrors,
}) => {
  const REQ = () => <span className="text-danger"> * </span>
  useEffect(() => {
    setErrors({})
    isTouched.driverId = true
    isTouched.odometerImg = true
    isTouched.odometerKm = true
    isTouched.partyName = true
    isTouched.vehicleId = true
    values.odometerImg = ''
  }, [])

  return (
    <>
      <CCol xs={12} md={3}>
        <CFormLabel htmlFor="vehicleNumber">
          Vehicle Number <REQ />{' '}
          {errors.vehicleNumber && (
            <span className="small text-danger">{errors.vehicleNumber}</span>
          )}
        </CFormLabel>
        <CFormInput
          size="sm"
          name="vehicleNumber"
          id="vehicleNumber"
          maxLength={10}
          onFocus={onFocus}
          onBlur={onBlur}
          onChange={handleChange}
          value={values.vehicleNumber}
        />
      </CCol>

      <CCol xs={12} md={3}>
        <CFormLabel htmlFor="vehicleCapacity">
          Vehicle Capacity In MTS <REQ />{' '}
          {errors.vehicleCapacity && (
            <span className="small text-danger">{errors.vehicleCapacity}</span>
          )}
        </CFormLabel>
        <VehicleCapacitySelectField onBlur={onBlur} onFocus={onFocus} handleChange={handleChange} />
      </CCol>

      <CCol xs={12} md={3}>
        <CFormLabel htmlFor="driverName">
          Driver Name <REQ />{' '}
          {errors.driverName && <span className="small text-danger">{errors.driverName}</span>}
        </CFormLabel>
        <CFormInput
          size="sm"
          name="driverName"
          id="driverName"
          maxLength={30}
          onFocus={onFocus}
          onBlur={onBlur}
          onChange={handleChange}
          value={values.driverName}
        />
      </CCol>

      <CCol xs={12} md={3}>
        <CFormLabel htmlFor="driverPhoneNumber">
          Driver Contact Number <REQ />{' '}
          {errors.driverPhoneNumber && (
            <span className="small text-danger">{errors.driverPhoneNumber}</span>
          )}
        </CFormLabel>
        <CFormInput
          size="sm"
          type="text"
          name="driverPhoneNumber"
          id="driverPhoneNumber"
          maxLength={10}
          onFocus={onFocus}
          onBlur={onBlur}
          onChange={handleChange}
          value={values.driverPhoneNumber}
        />
      </CCol>

      <CCol xs={12} md={3}>
        <CFormLabel htmlFor="vehicleBody">
          Vehicle Body <REQ />{' '}
          {errors.vehicleBody && <span className="small text-danger">{errors.vehicleBody}</span>}
        </CFormLabel>
        <VehicleTypeSelectField onBlur={onBlur} onFocus={onFocus} handleChange={handleChange} />
      </CCol>
    </>
  )
}

export default HireSection
