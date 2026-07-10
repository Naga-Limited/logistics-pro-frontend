import { CCol, CFormInput, CFormLabel, CFormSelect } from '@coreui/react'
import React, { useEffect } from 'react'
import VehicleCapacitySelectField from '../CommonComponent/VehicleCapacitySelectField'
import VehicleTypeSelectField from '../CommonComponent/VehicleTypeSelectField'
const PartySection = ({
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
    // setIsTouched({})
    setErrors({})
    isTouched.driverId = true
    isTouched.odometerImg = true
    isTouched.odometerKm = true
    isTouched.vehicleId = true
    values.odometerImg = ''
  }, [])

  return (
    <>
      <CCol xs={12} md={3}>
        <CFormLabel htmlFor="others_type">
          Others Type <REQ />{' '}
          {errors.others_type && (
            <span className="small text-danger">{errors.others_type}</span>
          )}
        </CFormLabel>
        <CFormSelect
          size="sm"
          name="others_type"
          onFocus={onFocus}
          onBlur={onBlur}
          onChange={handleChange}
          value={values.others_type}
          className={`${errors.others_type && 'is-invalid'}`}
          aria-label="Small select example"
          id="others_type"
        >
          <option value="">Select...</option>
          <option value="1">Party Vehicle</option>
          <option value="2">D2R Vehicle</option> 
        </CFormSelect>
      </CCol>

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

      {values.others_type && (
        <CCol xs={12} md={3}>
          <CFormLabel htmlFor="partyName">
            {values.others_type == '1' ? 'Party Name' : 'Route Name'} <REQ />{' '}
            {errors.partyName && <span className="small text-danger">{errors.partyName}</span>}
          </CFormLabel>
          <CFormInput
            size="sm"
            name="partyName"
            id="partyName"
            onFocus={onFocus}
            onBlur={onBlur}
            onChange={handleChange}
            value={values.partyName}
          />
        </CCol>
      )}

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
          name="driverPhoneNumber"
          id="driverPhoneNumber"
          onFocus={onFocus}
          maxLength={10}
          onBlur={onBlur}
          onChange={handleChange}
          value={values.driverPhoneNumber}
        />
      </CCol>

      <CCol xs={12} md={3}>
        <CFormLabel htmlFor="vBody">
          Vehicle Body <REQ />{' '}
          {errors.vehicleBody && <span className="small text-danger">{errors.vehicleBody}</span>}
        </CFormLabel>
        <VehicleTypeSelectField onBlur={onBlur} onFocus={onFocus} handleChange={handleChange} />
      </CCol>
    </>
  )
}

export default PartySection
