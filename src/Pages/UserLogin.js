import React, { useState } from 'react'
import {
  CButton,
  CCard,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CFormLabel,
  CRow,
} from '@coreui/react'

function UserLogin() {
  const handleSubmitClick = (e) => {
    // e.preventDefault()
    // const payload = {
    //   email: state.email,
    //   password: state.password,
    // }
    // axios
    //   .post(API_BASE_URL + 'login', payload)
    //   .then(function (response) {
    //     if (response.data.code === 200) {
    //       setState((prevState) => ({
    //         ...prevState,
    //         successMessage: 'Login successful. Redirecting to home page..',
    //       }))
    //       redirectToHome()
    //       props.showError(null)
    //     } else if (response.data.code === 204) {
    //       props.showError('Username and password do not match')
    //     } else {
    //       props.showError('Username does not exists')
    //     }
    //   })
    //   .catch(function (error) {
    //     console.log(error)
    //   })
  }

  return (
    <>
      <CContainer>
        <CCard className="m-5 p-3">
          <CForm className="container p-3" onSubmit={''}>
            <CRow className="d-flex justify-content-center">
              <CCol md={4}>
                <CFormLabel htmlFor="empid">Empolyee code* </CFormLabel>
                <CFormInput
                  size="sm"
                  name="empid"
                  id="empid"
                  maxLength={6}
                  onFocus={''}
                  onBlur={''}
                  onChange={''}
                  value={''}
                />
                <CFormLabel htmlFor="pass">Pass Word* </CFormLabel>
                <CFormInput
                  size="sm"
                  name="pass"
                  id="pass"
                  maxLength={6}
                  onFocus={''}
                  onBlur={''}
                  onChange={''}
                  value={''}
                />
              
                {/* <div className="text-center"> */}
                  <CButton className="btn-block pl-5 pr-5 mt-2" md={12}>
                    Login
                  </CButton>
                {/* </div> */}
              </CCol>
            </CRow>
          </CForm>
        </CCard>
      </CContainer>
    </>
  )
}
export default UserLogin
