import { CCol, CFormInput, CFormLabel } from '@coreui/react'
import React from 'react'

const REQ = () => <span className="text-danger"> * </span>
const VendorNotAvailable = ({ onFocus, onBlur, handleChange, values, errors }) => {
  return (
    <>
      <CCol xs={12} md={3}>
        <CFormLabel htmlFor="vendor_name">
          Vendor Name
          <REQ />{' '}
          {errors.ownerName && <span className="small text-danger">{errors.vendor_name}</span>}
        </CFormLabel>
        <CFormInput
          name="vendor_name"
          size="sm"
          id="vendor_name"
          value={values.vendor_name}
          onFocus={onFocus}
          onBlur={onBlur}
          onChange={handleChange}
        />
      </CCol>

      <CCol xs={12} md={3}>
        <CFormLabel htmlFor="ownerMob">
          Vendor Mobile Number
          <REQ /> {errors.ownerMob && <span className="small text-danger">{errors.ownerMob}</span>}
        </CFormLabel>
        <CFormInput
          name="ownerMob"
          size="sm"
          id="ownerMob"
          maxLength={10}
          value={values.ownerMob}
          onFocus={onFocus}
          onBlur={onBlur}
          onChange={handleChange}
        />
      </CCol>
    </>
  )
}

export default VendorNotAvailable
