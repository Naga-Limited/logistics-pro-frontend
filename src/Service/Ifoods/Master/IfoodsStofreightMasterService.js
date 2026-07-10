import AppConfig from 'src/AppConfig'
import api from 'src/Service/Config'

const IFOODS_STOFREIGHT_MASTER_BASE_URL = AppConfig.api.baseUrl + '/Ifoods/StoFreight'
const IFOODS_STOFREIGHT_MASTER_BASED_ON_CONTRACTOR_ID_VIEW_URL = AppConfig.api.baseUrl + '/Ifoods/StofreightByVendor'
const IFOODS_ACTIVE_STOFREIGHT_LIST_URL = AppConfig.api.baseUrl + '/Ifoods/ActiveFreightSto'

class IfoodsStofreightMasterService {
  getIfoodsStofreight() {
    return api.get(IFOODS_STOFREIGHT_MASTER_BASE_URL)
  }
  getActiveIfoodsStofreight() {
    return api.get(IFOODS_ACTIVE_STOFREIGHT_LIST_URL)
  }

 createIfoodsStofreight(value) {
    return api.post(IFOODS_STOFREIGHT_MASTER_BASE_URL, value)
  }

  getIfoodsStofreightById(StofreightId) {
    return api.get(IFOODS_STOFREIGHT_MASTER_BASE_URL + '/' + StofreightId)
  }

  getIfoodsStofreightByVendorId(vendorId) {
    return api.get(IFOODS_STOFREIGHT_MASTER_BASED_ON_CONTRACTOR_ID_VIEW_URL + '/' + vendorId)
  }

  updateStofreight(StofreightId, Stofreight) {
    return api.post(IFOODS_STOFREIGHT_MASTER_BASE_URL + '/' + StofreightId, Stofreight)
  }

  deleteIfoodsStofreight(StofreightId) {
    return api.delete(IFOODS_STOFREIGHT_MASTER_BASE_URL + '/' + StofreightId)
  }
}

export default new IfoodsStofreightMasterService()
