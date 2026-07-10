import { cilAt, cilLockLocked, cilUser } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import {
  CButton,
  CForm,
  CFormInput,
  CImage,
  CInputGroup,
  CInputGroupText,
  CSpinner,
} from '@coreui/react'
import React from 'react'
import EmailComponent from './InternalComponents/EmailComponent'
import NewPasswordComponent from './InternalComponents/NewPasswordComponent'
import OtpComponent from './InternalComponents/OtpComponent'

const ForgetPasswordFromComponent = ({
  handleForgetPassword,
  state,
  setState,
  verifyOtp,
  ChangePassword,
  forgetPassword,
  setForgetPassword
}) => {
  return (
    <>
         {(forgetPassword && !state.otpPage && !state.confirmOtp) && <EmailComponent
            handleForgetPassword={handleForgetPassword}
            state={state}
            setState={setState}
            setForgetPassword={setForgetPassword}
          />}
        {(state.otpPage && forgetPassword && !state.confirmOtp) && (<OtpComponent verifyOtp={verifyOtp} state={state} setState={setState} />)}
        {(state.confirmOtp && state.otpPage) && <NewPasswordComponent  ChangePassword={ChangePassword} state={state} setState={setState} />}

    </>
  )
}

export default ForgetPasswordFromComponent
