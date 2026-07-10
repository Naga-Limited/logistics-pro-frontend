import AppConfig from 'src/AppConfig'
import api from 'src/Service/Config'


const SHED_MASTER_BASE_URL = AppConfig.api.baseUrl+'/nlmt_shed'
const SHED_MASTER_BY_ACTIVE_BASE_URL = AppConfig.api.baseUrl+'/active_nlmt_shed'

class NlmtShedMasterService {
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
}

export default new NlmtShedMasterService()
