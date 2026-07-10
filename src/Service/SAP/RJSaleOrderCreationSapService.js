import AppConfig from 'src/AppConfig'
import api from '../Config'

const RJSALEORDER_CREATION_API_URL = AppConfig.api.baseUrl + '/sap/rj-sale-order-creation'

class RJSaleOrderCreationSapService {
  createRJSaleOrder(data) {
    // return Math.floor(100000 + Math.random() * 900000)
    return api.post(RJSALEORDER_CREATION_API_URL, data)
  }
}
export default new RJSaleOrderCreationSapService()
