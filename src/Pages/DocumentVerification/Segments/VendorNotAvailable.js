import { CCol, CFormInput, CFormLabel } from '@coreui/react'
import React from 'react'

const REQ = () => <span className="text-danger"> * </span>
const VendorNotAvailable = ({ onFocus, onBlur, handleChange, values, errors }) => {
  return (
    <>
      <CCol xs={12} md={3}>
        <CFormLabel htmlFor="ownerName">
          Owner Name
          <REQ />{' '}
          {errors.ownerName && <span className="small text-danger">{errors.ownerName}</span>}
        </CFormLabel>
        <CFormInput
          name="ownerName"
          size="sm"
          id="ownerName"
          maxLength={20}
          value={values.ownerName}
          onFocus={onFocus}
          onBlur={onBlur}
          onChange={handleChange}
        />
      </CCol>

      <CCol xs={12} md={3}>
        <CFormLabel htmlFor="ownerMob">
          Owner Mobile Number
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
      <CCol xs={12} md={3}>
        <CFormLabel htmlFor="aadhar">
          Aadhar Number
          <REQ /> {errors.aadhar && <span className="small text-danger">{errors.aadhar}</span>}
        </CFormLabel>
        <CFormInput
          name="aadhar"
          size="sm"
          id="aadhar"
          maxLength={12}
          value={values.aadhar}
          onFocus={onFocus}
          onBlur={onBlur}
          onChange={handleChange}
        />
      </CCol>
      <CCol xs={12} md={3}>
        <CFormLabel htmlFor="bankAcc">
          Bank Account Number
          <REQ /> {errors.bankAcc && <span className="small text-danger">{errors.bankAcc}</span>}
        </CFormLabel>
        <CFormInput
          name="bankAcc"
          size="sm"
          id="bankAcc"
          maxLength={20}
          value={values.bankAcc}
          onFocus={onFocus}
          onBlur={onBlur}
          onChange={handleChange}
        />
      </CCol>
    </>
  )
}

export default VendorNotAvailable
