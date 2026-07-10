import AppConfig from 'src/AppConfig'
import api from '../Config'

const CUSTOMER_CREATION_URL = AppConfig.api.baseUrl + '/customer'
const CUSTOMER_EXTENSION = AppConfig.api.baseUrl + '/sap_customer_extension_info/' 
const CUSTOMER_EXTENSION_REQUEST_URL = AppConfig.api.baseUrl + '/customerInfoExtension'


class CustomerCreationService {
  getCustomerCreationData() {
    return api.get(CUSTOMER_CREATION_URL)
  }
  createCustomer(values) {
    return api.post(CUSTOMER_CREATION_URL, values)
  }
  updateCustomer( id,values) {
    return api.post(CUSTOMER_CREATION_URL + '/' +  id,values)
  }
  updateCustomerconfirmation( id,values) {
    return api.post(CUSTOMER_CREATION_URL + '/' +  id,values)
  }
  // getSingleVehicleInfoOnParkingYardGate(id) {
  //   return api.get(PARKING_YRD_SINGEL_VEHICLE_INFO_URL + id)
  // }
  // getSingleVehicleInfo(id) {
  //   return api.get(DOCS_VERIFY_URL + id)
  // }
  // addCustomerCreationData(data) {
  //   return api.post(CUSTOMER_CREATION_URL, data)
  // }
  getCustomerById(customer_id) {
    return api.get(CUSTOMER_CREATION_URL + '/' + customer_id)
  }

  // Fetch Customer Extension Data
  getCustomerExtensionTableData() {
    return api.get(CUSTOMER_EXTENSION)
  }

  extendCustomerInfo(data){
    return api.post(CUSTOMER_EXTENSION_REQUEST_URL, data)
  }

}


export default new CustomerCreationService()
