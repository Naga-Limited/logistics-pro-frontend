import AppConfig from 'src/AppConfig'
import api from '../Config'

const CUSTOMER_FREIGHT_URL = AppConfig.api.baseUrl + '/customerfreight' //Development
const CUSTOMER_FREIGHT_SOFT_DELETE_URL = AppConfig.api.baseUrl + '/customerfreightSoftDeleteRequest'

class CustomerFreightApi {
  getCustomerFreight() {
    return api.get(CUSTOMER_FREIGHT_URL)
  }

  createCustomerFreight(value) {
    return api.post(CUSTOMER_FREIGHT_URL, value)
  }

  getCustomerFreightById(CustomerFreightId) {
    return api.get(CUSTOMER_FREIGHT_URL + '/' + CustomerFreightId)
  }

  updateCustomerFreight(CustomerFreight, CustomerFreightId) {
    return api.put(CUSTOMER_FREIGHT_URL + '/' + CustomerFreightId, CustomerFreight)
  }
  getCustomerCode() {
    return api.get(CUSTOMER_FREIGHT_URL)
  }
  handleCustomerAddAction(data) {
    return api.post(CUSTOMER_FREIGHT_URL, data)
  }

  deleteCustomerFreight(CustomerFreightId) {
    return api.delete(CUSTOMER_FREIGHT_URL + '/' + CustomerFreightId)
  }

  softDeleteCustomerFreight(data) {
    return api.post(CUSTOMER_FREIGHT_SOFT_DELETE_URL, data)
  }
}

export default new CustomerFreightApi()
