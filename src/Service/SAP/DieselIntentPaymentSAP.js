import AppConfig from 'src/AppConfig'
import api from '../Config'

const DIESEL_INTENT = AppConfig.api.baseUrl + '/SapDieselPayment'

class DieselIntentPaymentSAP {
  // Post Diesel Payment FROM SAP
  DieselIntentSAP(data) {
    return api.post(DIESEL_INTENT, data)
  }
}
export default new DieselIntentPaymentSAP()


