import { CCard, CCardBody, CCardImage, CCardText, CCol, CContainer, CRow } from '@coreui/react'
import React from 'react'
import LoaderImage from '../../assets/loader/loader.gif'
const SmallLoader = () => {
  return (
    <>
      <CContainer className="mt-5">
        <div className="row justify-content-md-center">
          <CCol xs md={4}></CCol>
          <CCol md={4}>
            {' '}
            <CCard className="p-1">
              <CCardImage
                style={{ height: '10rem', width: '100%' }}
                orientation="top"
                src={LoaderImage}
              />
            </CCard>
          </CCol>
          <CCol xs md={4}></CCol>
        </div>
      </CContainer>
    </>
  )
}

export default SmallLoader
