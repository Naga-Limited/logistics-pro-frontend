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
        <CFormLabel htmlFor="vendor_name">Vendor Name</CFormLabel>
        <CFormInput name="vendor_name" size="sm" id="vendor_name" value={panData.NAME1} readOnly />
      </CCol>

      {/* <CCol xs={12} md={3}>
        <CFormLabel htmlFor="vendor_contact_no">Vendor Mobile Number</CFormLabel>
        <CFormInput name="vendor_contact_no" size="sm" id="vendor_contact_no" value={panData.TELF1} />
      </CCol> */}
    
    </>
  )
}

export default VendorAvaiable
