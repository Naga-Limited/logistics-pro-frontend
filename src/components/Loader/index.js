import { CCard, CCardBody, CCardImage, CCardText, CCol, CContainer, CRow } from '@coreui/react'
import React from 'react'
import LoaderImage from '../../assets/loader/loader8.gif'
const Loader = () => {
  return (
    <>
      <CContainer className="mt-5">
        <div className="row justify-content-md-center">
          <CCol xs md={3}></CCol>
          <CCol md={6}>
            {' '}
            <CCard
              className="p-5"
              style={{ backgroundColor: 'transparent', borderColor: 'transparent' }}
            >
              {/* <CCard style={{ width: '10rem' }}  className="p-5"> */}
              <CCardImage orientation="top" src={LoaderImage} style={{ borderRadius: '30%' }} />
            </CCard>
          </CCol>
          <CCol xs md={3}></CCol>
        </div>
      </CContainer>
    </>
  )
}

export default Loader
