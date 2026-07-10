import AppConfig from 'src/AppConfig'
import api from '../Config'

const DEFECT_TYPE_URL = AppConfig.api.baseUrl + '/defectType' //Development

class DefectTypeApi {
  getDefectType() {
    return api.get(DEFECT_TYPE_URL)
  }

  createDefectType(value) {
    return api.post(DEFECT_TYPE_URL, value)
  }

  getDefectTypeById(DefectTypeId) {
    return api.get(DEFECT_TYPE_URL + '/' + DefectTypeId)
  }

  updateDefectType(DefectType, DefectTypeId) {
    return api.put(DEFECT_TYPE_URL + '/' + DefectTypeId, DefectType)
  }

  deleteDefectType(DefectTypeId) {
    return api.delete(DEFECT_TYPE_URL + '/' + DefectTypeId)
  }
}

export default new DefectTypeApi()
