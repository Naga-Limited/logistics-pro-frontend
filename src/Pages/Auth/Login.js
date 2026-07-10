import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  CCard,
  CCardBody, 
  CCol,
  CContainer, 
  CRow,
} from '@coreui/react'   
// import logo from 'src/assets/logo/summer.png'   
import logo from 'src/assets/logo/june_sum.png'   
import Swal from "sweetalert2";
import Loader from 'src/components/Loader'
import AuthService from 'src/Service/Auth/AuthService' 
import LocalStorageService from 'src/Service/LocalStoage'
import LoginFormComponent from './AuthComponents/LoginFormComponent'
import ForgetPasswordFromComponent from './AuthComponents/ForgetPasswordFromComponent'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import './AuthComponents/InternalComponents/LoginWithDiwali.css' 

const Login = () => {
  const [state, setState] = useState({
    empid: '',
    username: '',
    password: '',
    email: '',
    mobile_no: '',
    otp: '',
    loading: false,
    otpPage: false,
    confirmOtp: false,
    newPassword: '',
    newPasswordConfirm: '',
    error: '',
  })

  const [fetch, setFetch] = useState(false)
  const [forgetPassword, setForgetPassword] = useState(false)
  const navigation = useNavigate()

  useEffect(()=>{
    const user_info_json = localStorage.getItem('user_info')
    const user_info = JSON.parse(user_info_json) 
    if(user_info){
      //
    } else {
      setFetch(true)
    } 
    
  },[])

  //this function handles the login request
  const handleLogin = (e) => {
    e.preventDefault()
    setFetch(false)
    AuthService.login(state)
      .then((res) => {
        // setFetch(true)
        console.log(res,'handleLogin-res')
        console.log(state,'handleLogin-state')
        if (res.status == 200) {
          LocalStorageService.setLocalstorage('auth_token', res.data.token)
          LocalStorageService.setLocalstorage('user_info', JSON.stringify(res.data.data))
          LocalStorageService.setLocalstorage(
            'page_permission',
            JSON.stringify(res.data.data.page_permissions)
          )
          navigation('/Dashboard')
          window.location.reload(true)
        } else if (res.status == 201) {
          setFetch(true)
          toast.error('User Id was Blocked. Kindly Contact Admin to Unblock..')
        }
      })
      .catch((error) => {
        setFetch(true)
        console.log(error)
        if (error.response.status === 401) {
          setState({ ...state, error: error.response.data.message })
        } else if(error.code == 'ERR_NETWORK'){
          Swal.fire({
            title: 'Backend Server cannot be started. Kindly contact admin..!',
            icon: "warning",
            confirmButtonText: "OK",
          }).then(function () {
            // window.location.reload(false)
          })
        }

      })
  }

  //this function handles the Forget password request & send OTP
  const handleForgetPassword = (e) => {
    e.preventDefault()
    setState({ ...state, loading: true })

    let data = new FormData()
    data.append('empid', state.empid)
    AuthService.forgetPassword(data)
      .then((res) => {
        if (res.status == 200) {
          setState({ ...state, loading: false, otpPage: true, error: '' })
        }
      })
      .catch((error) => {
        if (error.response.status === 404) {
          setState({ ...state, error: error.response.data.message })
        }
      })
  }

  //this function handles the verify OTP request & Verify OTP MATCHS
  const verifyOtp = (e) => {
    e.preventDefault()
    setState({ ...state, loading: true })

    let data = new FormData()
    data.append('empid', state.empid)
    data.append('otp', state.otp)
    AuthService.verifyOtp(data)
      .then((res) => {
        if (res.status === 200) {
          setState({ ...state, loading: false, confirmOtp: true, error: '' })
        }
      })
      .catch((error) => {
        if (error.response.status === 422) {
          setState({ ...state, error: error.response.data.message })
        }
        if (error.response.status === 403) {
          setState({ ...state, error: error.response.data.message })
        }
      })
  }

  const isMobile = window.innerWidth <= 768;

  //this function handle the password change request to server and Update the new password
  const ChangePassword = (e) => {
    e.preventDefault()
    setState({ ...state, loading: true })

    let data = new FormData() 
   data.append('empid', state.empid)
    data.append('password', state.newPassword)
    data.append('confirm_password', state.newPasswordConfirm)

    AuthService.changePassword(data)
      .then((res) => {
        if (res.status === 200) {
          setState({ ...state, loading: false, error: '' })
          toast.info('Password Changed Successfully!') 
          setTimeout(() => {
            window.location.reload(false)
          }, 1000)

        }
      })
      .catch((error) => {
        if (error.response.status === 500) {
          setState({ ...state, error: error.response.data.message })
        }
      })
  }

  return (
    <>
      {!fetch && <Loader />}{' '}
      {fetch && (
        <div className="bg-light min-vh-100 d-flex flex-row align-items-center" style={{ position: 'relative'}}>
           
          <div className="summer-effects"></div>                 
          
          <CContainer style={{ maxWidth:"100%"}}>
          {/* <CContainer> */}
            <CRow className="justify-content-center">
              <CCol md={15}>
                <div style={{width:"100%", display: isMobile ? "block" : "flex"}}> 
                  <CCard
                    className="p-4" 
                    style={{
                      // background: 'linear-gradient(135deg, #ffca23, #ffca23)',
                      background: '#A5BCD9',
                      color: 'white',
                      width: isMobile ? "100%" : "70%"
                    }}
                  >
                    {/* <div className="snow"></div> */}
                    <CCardBody className="mt-3">
                      <img
                        src={logo} 
                        alt=""
                        style={{aspectRatio:"3/2",width:"100%",objectFit:"cover"}} 
                      />
                    </CCardBody>
                  </CCard>
                  <CCard
                    className="p-4"
                    style={{
                      // background: 'linear-gradient(135deg, #dae5efff, #d1d3f2ff)',
                      background: '#A5BCD9',
                      color: 'white',
                      width: isMobile ? "100%" : "30%"
                    }}
                  >
                    <CCardBody className="mt-3">
                      
                      {forgetPassword ? (
                        <ForgetPasswordFromComponent
                          handleLogin={handleLogin}
                          setState={setState}
                          state={state}
                          handleForgetPassword={handleForgetPassword}
                          setForgetPassword={setForgetPassword}
                          forgetPassword={forgetPassword}
                          verifyOtp={verifyOtp}
                          ChangePassword={ChangePassword}
                        />
                      ) : (
                        <LoginFormComponent
                          handleLogin={handleLogin}
                          setState={setState}
                          state={state}
                          setForgetPassword={setForgetPassword}
                          theme = 'diwali' // default
                        />
                      )}
                    </CCardBody>
                  </CCard>
                </div>
              </CCol>
            </CRow>
          </CContainer>
        </div>
      )}
    </>
  )
}

export default Login
