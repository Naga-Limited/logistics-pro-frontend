import AppConfig from 'src/AppConfig'
import api from '../Config'

const FREIGHT_MASTER_BASE_URL = AppConfig.api.baseUrl + '/freightrate'
const FREIGHT_BASE_URL = AppConfig.api.baseUrl + '/freightrate-update'
const FREIGHT_SOFT_DELETE_URL = AppConfig.api.baseUrl + '/freightrateSoftDeleteRequest'
const CUSTOMER_URL = AppConfig.api.baseUrl + '/customerfreight' //Development
const LOCATIONS_URL = AppConfig.api.baseUrl + '/location'
//const FREIGHT_MASTER_BASE_URL_IMPORT = AppConfig.api.baseUrl + '/import'
class FreightMasterService {
  getFreight() {
    return api.get(FREIGHT_MASTER_BASE_URL)
  }

  createFreight(value) {
    return api.post(FREIGHT_MASTER_BASE_URL, value)
  }

  getSingleFreightInfo(id) {
    return api.get(FREIGHT_MASTER_BASE_URL + id)
  }

  getFreightById(FreightId) {
    return api.get(FREIGHT_MASTER_BASE_URL + '/' + FreightId)
  }

  updateFreight(FreightId, Freight) {
    return api.post(FREIGHT_BASE_URL + '/' + FreightId, Freight)
  }

  deleteFreight(FreightId) {
    return api.delete(FREIGHT_MASTER_BASE_URL + '/' + FreightId)
  }

  softDeleteFreight(value) {
    return api.post(FREIGHT_SOFT_DELETE_URL, value)
  }
  getCustomer() {
    return api.get(CUSTOMER_URL)
  }
  getLocation() {
    return api.get(CUSTOMER_URL)
  }
  createCustomer(data) {
    console.log(CUSTOMER_URL)
    console.log(data)
    return api.post(CUSTOMER_URL, data)
  }
  //   createFreight(data) {
  //   console.log(FREIGHT_MASTER_BASE_URL_IMPORT)
  //   console.log(data)
  //   return api.post(FREIGHT_MASTER_BASE_URL_IMPORT, data)
  // }
}

export default new FreightMasterService()
