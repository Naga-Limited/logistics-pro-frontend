import AppConfig from "src/AppConfig";
import api from "../Config";

const GET_CURRENT_DATE_TIME = AppConfig.api.baseUrl + '/third_party/get-date-time'

class ThirdPartyService {

  // GET Current Date & Time Data FROM Third Part API
  getCurrentDateTime() {
    return api.post(GET_CURRENT_DATE_TIME)
  }
}

export default new ThirdPartyService()
