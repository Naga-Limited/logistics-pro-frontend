import AppConfig from 'src/AppConfig'
import api from 'src/Service/Config'

const DEPO_CUSTOMER_MASTER_BASE_URL = AppConfig.api.baseUrl + '/Depo/Customer'
const DEPO_ACTIVE_CUSTOMERS_LIST_URL = AppConfig.api.baseUrl + '/Depo/ActiveCustomer'
const DEPO_SINGLE_CUSTOMER_BY_CODE_URL = AppConfig.api.baseUrl + '/singleCustomerByCode'
const DEPO_CUSTOMER_REPORT_SENT_URL = AppConfig.api.baseUrl + '/depocustomerReportRequest'
class DepoCustomerMasterService {
  getDepoCustomers() {
    return api.get(DEPO_CUSTOMER_MASTER_BASE_URL)
  }

  getActiveDepoCustomers() {
    return api.get(DEPO_ACTIVE_CUSTOMERS_LIST_URL)
  }

  createDepoCustomer(value) {
    return api.post(DEPO_CUSTOMER_MASTER_BASE_URL, value)
  }

  getDepoCustomerById(id) {
    return api.get(DEPO_CUSTOMER_MASTER_BASE_URL + '/' + id)
  }

  getDepoCustomerByCode(code) {
    return api.get(DEPO_SINGLE_CUSTOMER_BY_CODE_URL + '/' + code)
  }

  updateCustomers(id, customer_data) {
    return api.post(DEPO_CUSTOMER_MASTER_BASE_URL + '/' + id, customer_data)
  }

  deleteDepoCustomer(id) {
    return api.delete(DEPO_CUSTOMER_MASTER_BASE_URL + '/' + id)
  }
  sentDataForReport(data) {
    return api.post(DEPO_CUSTOMER_REPORT_SENT_URL, data)
  }
}

export default new DepoCustomerMasterService()
