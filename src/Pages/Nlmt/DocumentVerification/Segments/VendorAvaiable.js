import { CCol, CFormInput, CFormLabel } from '@coreui/react'
import React from 'react'

const VendorAvaiable = ({panData}) => {

  console.log(panData,'VendorAvaiable-panData')

  const valFilter = (val) => {
    return val ? val : '-'
  }

  return (
    <>
      <CCol xs={12} md={3}>
        <CFormLabel htmlFor="VendorCode">Vendor Code</CFormLabel>
        <CFormInput name="VendorCode" size="sm" id="VendorCode" value={valFilter(panData.LIFNR)} readOnly />
      </CCol>
      <CCol xs={12} md={3}>
        <CFormLabel htmlFor="ownerName">Vendor Name</CFormLabel>
        <CFormInput name="ownerName" size="sm" id="ownerName" value={valFilter(panData.NAME1)} readOnly />
      </CCol>
      <CCol xs={12} md={3}>
        <CFormLabel htmlFor="ownerName">Vendor Name 2</CFormLabel>
        <CFormInput name="ownerName" size="sm" id="ownerName" value={valFilter(panData.NAME2)} readOnly />
      </CCol>
      <CCol xs={12} md={3}>
        <CFormLabel htmlFor="ownerMob">Mobile Number</CFormLabel>
        <CFormInput name="ownerMob" size="sm" id="ownerMob" value={valFilter(panData.TELF1)} readOnly />
      </CCol>
      <CCol xs={12} md={3}>
        <CFormLabel htmlFor="aadhar">Aadhar Number</CFormLabel>
        <CFormInput name="aadhar" size="sm" id="aadhar" maxLength={12} value={valFilter(panData.IDNUMBER)} readOnly />
      </CCol>
      <CCol xs={12} md={3}>
        <CFormLabel htmlFor="bankAcc">Bank Account Number</CFormLabel>
        <CFormInput name="bankAcc" size="sm" id="bankAcc" maxLength={20} value={valFilter(panData.BANKN)} readOnly />
      </CCol>
      <CCol xs={12} md={3}>
        <CFormLabel htmlFor="bankAcc">City</CFormLabel>
        <CFormInput name="city" size="sm" id="city" maxLength={20} value={valFilter(panData.CITY)} readOnly />
      </CCol>
    </>
  )
}

export default VendorAvaiable
