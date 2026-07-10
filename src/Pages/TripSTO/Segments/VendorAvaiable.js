import { CCol, CFormInput, CFormLabel } from '@coreui/react'
import React from 'react'

const VendorAvaiable = ({panData}) => {
  return (
    <>
      <CCol xs={12} md={3}>
        <CFormLabel htmlFor="VendorCode">Vendor Code</CFormLabel>
        <CFormInput name="VendorCode" size="sm" id="VendorCode" value={panData.LIFNR} readOnly />
      </CCol>
      <CCol xs={12} md={3}>
        <CFormLabel htmlFor="ownerName">Owner Name</CFormLabel>
        <CFormInput name="ownerName" size="sm" id="ownerName" value={panData.NAME1} readOnly />
      </CCol>

      <CCol xs={12} md={3}>
        <CFormLabel htmlFor="ownerMob">Owner Mobile Number</CFormLabel>
        <CFormInput name="ownerMob" size="sm" id="ownerMob" value={panData.TELF1} readOnly />
      </CCol>
      <CCol xs={12} md={3}>
        <CFormLabel htmlFor="aadhar">Aadhar Number</CFormLabel>
        <CFormInput
          name="aadhar"
          size="sm"
          id="aadhar"
          maxLength={12}
          value={panData.IDNUMBER}
          readOnly
        />
      </CCol>
      <CCol xs={12} md={3}>
        <CFormLabel htmlFor="bankAcc">Bank Account Number</CFormLabel>
        <CFormInput
          name="bankAcc"
          size="sm"
          id="bankAcc"
          maxLength={20}
          value={panData.BANKN}
          readOnly
        />
      </CCol>
    </>
  )
}

export default VendorAvaiable
