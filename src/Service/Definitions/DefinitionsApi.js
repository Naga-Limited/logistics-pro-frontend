import AppConfig from 'src/AppConfig'
import api from '../Config'

const DEFINITION_URL = AppConfig.api.baseUrl + '/definitions'

class DefinitionsApi {
  getDefinitions() {
    return api.get(DEFINITION_URL)
  }

  createDefinitions(value) {
    return api.post(DEFINITION_URL, value)
  }

  getDefinitionsById(DefinitionsId) {
    return api.get(DEFINITION_URL + '/' + DefinitionsId)
  }

  updateDefinitions(Definitions, DefinitionsId) {
    return api.put(DEFINITION_URL + '/' + DefinitionsId, Definitions)
  }
}

export default new DefinitionsApi()
