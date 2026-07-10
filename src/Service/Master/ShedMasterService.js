import AppConfig from "src/AppConfig";
import api from "../Config";


const SHED_MASTER_BASE_URL = AppConfig.api.baseUrl+'/shed'
const SHED_MASTER_BY_ACTIVE_BASE_URL = AppConfig.api.baseUrl+'/active_shed'
const SHED_SOFT_DELETE_URL = AppConfig.api.baseUrl+'/shedSoftDeleteRequest'
const SHED_BACKFILL_LOG_URL = AppConfig.api.baseUrl+'/backfillShedLog'

class ShedMaster {
  getShed() {
    return api.get(SHED_MASTER_BASE_URL)
  }

  getActiveSheds() {
    return api.get(SHED_MASTER_BY_ACTIVE_BASE_URL)
  }

  createShed(value) {
    return api.post(SHED_MASTER_BASE_URL, value)
  }

  getShedById(ShedId) {
    return api.get(SHED_MASTER_BASE_URL + '/' + ShedId)
  }

  updateShed( ShedId,Shed) {

    return api.post(SHED_MASTER_BASE_URL + '/' + ShedId, Shed)
  }

  deleteShed(ShedId) {
    return api.delete(SHED_MASTER_BASE_URL + '/' + ShedId)
  }

  softDeleteShed(formData) {
    return api.post(SHED_SOFT_DELETE_URL, formData)
  }

  backfillShedLog(formData) {
    return api.post(SHED_BACKFILL_LOG_URL, formData)
  }
}

export default new ShedMaster()
