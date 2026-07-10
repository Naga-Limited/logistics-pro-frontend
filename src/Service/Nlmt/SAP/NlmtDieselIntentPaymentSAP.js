import AppConfig from 'src/AppConfig'
import api from 'src/Service/Config'

const DIESEL_INTENT = AppConfig.api.baseUrl + '/SapNlmtDieselPayment'

class NlmtDieselIntentPaymentSAP {
  // Post Diesel Payment FROM SAP
  DieselIntentSAP(data) {
    return api.post(DIESEL_INTENT, data)
  }
}
export default new NlmtDieselIntentPaymentSAP()


