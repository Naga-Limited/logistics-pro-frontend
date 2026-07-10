import AppConfig from 'src/AppConfig'
import api from 'src/Service/Config'

const OTP_BASE_URL = AppConfig.api.baseUrl + '/nlmtmobileotpsend'
const OTP_MESSAGE_URL = AppConfig.api.baseUrl + '/nlmtmobileotp/'
const OTP_VERIFY_URL = AppConfig.api.baseUrl + '/nlmtadvance/verify_otp'

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
}

export default new MobileOTP()
