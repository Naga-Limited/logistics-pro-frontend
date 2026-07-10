import AppConfig from 'src/AppConfig'
import api from '../Config'

const OTP_BASE_URL = AppConfig.api.baseUrl + '/mobileotpsend'
const OTP_MESSAGE_URL = AppConfig.api.baseUrl + '/mobileotp/'
const OTP_VERIFY_URL = AppConfig.api.baseUrl + '/advance/verify_otp'
const DRIVER_POD_ATTACHMENT_SMS_GENERATION_BASE_URL = AppConfig.api.baseUrl + '/podMobileSmsSend'

class MobileOTP {
  getOTP(data) {
    return api.post(OTP_BASE_URL, data)
  }
  gentrateOTP(driver_id, trip_sheet_no, advance_amount) {
    return api.get(OTP_MESSAGE_URL + driver_id + '/' + trip_sheet_no + '/' + advance_amount)
  }
  VerifyOTP(data) {
    return api.post(OTP_VERIFY_URL, data)
  }
  generateDriverPODAttachmentSms(data){
    return api.post(DRIVER_POD_ATTACHMENT_SMS_GENERATION_BASE_URL, data)
  }
}

export default new MobileOTP()
