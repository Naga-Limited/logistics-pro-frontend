import AppConfig from 'src/AppConfig'
import api from 'src/Service/Config'

const DIVISION_URL = AppConfig.api.baseUrl + '/NLFS/Division'
const ACTIVE_DIVISION_URL = AppConfig.api.baseUrl + '/NLFS/ActiveDivision'

class NLFSDivisionApi {
  getDivisions() {
    return api.get(DIVISION_URL)
  }

  getActiveDivisions() {
    return api.get(ACTIVE_DIVISION_URL)
  }

  createDivisions(value) {
    return api.post(DIVISION_URL, value)
  }

  getDivisionsById(DivisionsId) {
    return api.get(DIVISION_URL + '/' + DivisionsId)
  }

  updateDivisions(Divisions, DivisionsId) {
    return api.put(DIVISION_URL + '/' + DivisionsId, Divisions)
  }
}

export default new NLFSDivisionApi()
