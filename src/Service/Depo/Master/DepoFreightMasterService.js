import AppConfig from 'src/AppConfig'
import api from 'src/Service/Config'

const DEPO_FREIGHT_MASTER_BASE_URL = AppConfig.api.baseUrl + '/Depo/Freight'
const DEPO_ACTIVE_FREIGHTS_LIST_URL = AppConfig.api.baseUrl + '/Depo/ActiveFreight'
const DEPO_VEHICLE_REPORT_SENT_URL = AppConfig.api.baseUrl + '/depofreightReportRequest'
const DEPO_FREIGHT_SOFT_DELETE_REQUEST_URL = AppConfig.api.baseUrl + '/depofreightSoftDeleteRequest'
class DepoFreightMasterService {
  getDepoFreights() {
    return api.get(DEPO_FREIGHT_MASTER_BASE_URL)
  }

  getActiveDepoFreights() {
    return api.get(DEPO_ACTIVE_FREIGHTS_LIST_URL)
  }

  createDepoFreight(value) {
    return api.post(DEPO_FREIGHT_MASTER_BASE_URL, value)
  }

  getDepoFreightById(id) {
    return api.get(DEPO_FREIGHT_MASTER_BASE_URL + '/' + id)
  }

  updateFreights(id, freights) {
    return api.post(DEPO_FREIGHT_MASTER_BASE_URL + '/' + id, freights)
  }

  deleteDepoFreight(id) {
    return api.delete(DEPO_FREIGHT_MASTER_BASE_URL + '/' + id)
  }
  sentDataForReport(data) {
    return api.post(DEPO_VEHICLE_REPORT_SENT_URL, data)
  }

  softDeleteDepoFreight(data) {
    return api.post(DEPO_FREIGHT_SOFT_DELETE_REQUEST_URL, data)
  }
}

export default new DepoFreightMasterService()
