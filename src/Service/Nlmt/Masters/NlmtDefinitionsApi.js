import AppConfig from 'src/AppConfig'
import api from 'src/Service/Config'

const NLMT_DEFINITION_URL = AppConfig.api.baseUrl + '/nlmt_definitions'

class NlmtDefinitionsApi {
  getNlmtDefinitions() {
    return api.get(NLMT_DEFINITION_URL)
  }

  createNlmtDefinitions(value) {
    return api.post(NLMT_DEFINITION_URL, value)
  }

  getNlmtDefinitionsById(DefinitionsId) {
    return api.get(NLMT_DEFINITION_URL + '/' + DefinitionsId)
  }

  updateNlmtDefinitions(Definitions, DefinitionsId) {
    return api.put(NLMT_DEFINITION_URL + '/' + DefinitionsId, Definitions)
  }
}

export default new NlmtDefinitionsApi()
