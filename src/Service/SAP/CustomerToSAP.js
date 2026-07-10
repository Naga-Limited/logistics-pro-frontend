import AppConfig from 'src/AppConfig'
import api from '../Config'

const CUSTOMER_CREATION = AppConfig.api.baseUrl + '/sap/customer'
const CUSTOMER_EXTENSION = AppConfig.api.baseUrl + '/sap/customer-creation-extension/' 

class VendorToSAP {
  // GET SINGLE PAN DATA FROM SAP
  customerCreation(data) {
    return api.post(CUSTOMER_CREATION, data)
  }

  customerExtension(data) {
    return api.get(CUSTOMER_EXTENSION + data)
  }
}

export default new VendorToSAP()
