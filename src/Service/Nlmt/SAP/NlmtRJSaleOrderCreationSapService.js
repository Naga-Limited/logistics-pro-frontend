import AppConfig from 'src/AppConfig'
import api from 'src/Service/Config'

const RJSALEORDER_CREATION_API_URL = AppConfig.api.baseUrl + '/sap/nlmt-rj-sale-order-creation'

class NlmtRJSaleOrderCreationSapService {
  createRJSaleOrder(data) {
    // return Math.floor(100000 + Math.random() * 900000)
    return api.post(RJSALEORDER_CREATION_API_URL, data)
  }
}
export default new NlmtRJSaleOrderCreationSapService()
