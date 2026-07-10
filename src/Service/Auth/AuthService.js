import AppConfig from 'src/AppConfig'
import api from '../Config'
const AUTH_API_BASE_URL = AppConfig.api.baseUrl + '/admin/login'
const AUTH_API_BASE_URL_LOGOUT = AppConfig.api.baseUrl + '/admin/logout'
const AUTH_API_FORCE_URL_LOGOUT = AppConfig.api.baseUrl + '/admin/forceLogout'
const AUTH_API_BASE_FORGET_PASSWORD_URL = AppConfig.api.baseUrl + '/user/forget-password'
const AUTH_API_BASE_VERIFY_OTP_URL = AppConfig.api.baseUrl + '/user/verify-otp'
const AUTH_API_BASE_CHNAGE_PASSWORD_URL = AppConfig.api.baseUrl + '/user/change-new-password'
class AuthService {
  login(data) {
    return api.post(AUTH_API_BASE_URL, data)
  }

  logout(id) {
    return api.post(AUTH_API_BASE_URL_LOGOUT + '/' + id)
  }

  forceLogout(id) {
    return api.post(AUTH_API_FORCE_URL_LOGOUT + '/' + id)
  }

  forgetPassword(data) {
    return api.post(AUTH_API_BASE_FORGET_PASSWORD_URL, data)
  }

  verifyOtp(data) {
    return api.post(AUTH_API_BASE_VERIFY_OTP_URL, data)
  }

  changePassword(data) {
    return api.post(AUTH_API_BASE_CHNAGE_PASSWORD_URL, data)
  }
}

export default new AuthService()
