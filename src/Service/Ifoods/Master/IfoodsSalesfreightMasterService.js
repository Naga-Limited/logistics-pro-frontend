import AppConfig from 'src/AppConfig'
import api from 'src/Service/Config'

const IFOODS_STOFREIGHT_MASTER_BASE_URL = AppConfig.api.baseUrl + '/Ifoods/SalesFreight'
const IFOODS_STOFREIGHT_MASTER_BASED_ON_CONTRACTOR_ID_VIEW_URL = AppConfig.api.baseUrl + '/Ifoods/SalesfreightByVendor'
const IFOODS_ACTIVE_STOFREIGHT_LIST_URL = AppConfig.api.baseUrl + '/Ifoods/ActiveSalesfreight'

class IfoodsSalesfreightMasterService {
  getIfoodsSalesfreight() {
    return api.get(IFOODS_STOFREIGHT_MASTER_BASE_URL)
  }
  getActiveIfoodsSalesfreight() {
    return api.get(IFOODS_ACTIVE_STOFREIGHT_LIST_URL)
  }

  createIfoodsSalesfreight(value) {
    return api.post(IFOODS_STOFREIGHT_MASTER_BASE_URL, value)
  }

  getIfoodsSalesfreightById(SalesfreightId) {
    return api.get(IFOODS_STOFREIGHT_MASTER_BASE_URL + '/' + SalesfreightId)
  }

  getIfoodsSalesfreightByVendorId(vendorId) {
    return api.get(IFOODS_STOFREIGHT_MASTER_BASED_ON_CONTRACTOR_ID_VIEW_URL + '/' + vendorId)
  }

  updateSalesfreight(SalesfreightId, Salesfreight) {
    return api.post(IFOODS_STOFREIGHT_MASTER_BASE_URL + '/' + SalesfreightId, Salesfreight)
  }

  deleteIfoodsSalesfreight(SalesfreightId) {
    return api.delete(IFOODS_STOFREIGHT_MASTER_BASE_URL + '/' + SalesfreightId)
  }
}

export default new IfoodsSalesfreightMasterService()
