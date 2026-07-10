import AppConfig from 'src/AppConfig'
import api from 'src/Service/Config'

const NLMT_DEFINITIONS_LIST_URL = AppConfig.api.baseUrl + '/nlmt_definitions_list'
const NLMT_DEFINITIONS_LIST_BY_DEFINITION_URL = AppConfig.api.baseUrl + '/nlmt_definitions_list_by_definition'
const NLMT_ACTIVE_DEFINITIONS_LIST_BY_DEFINITION_URL = AppConfig.api.baseUrl + '/Nlmt_active_definitions_list_by_definition'

class NlmtDefinitionsListApi {
  getNlmtDefinitionsList() {
    return api.get(NLMT_DEFINITIONS_LIST_URL)
  }

  visibleNlmtDefinitionsListByDefinition(DefinitionId) {
    return api.get(NLMT_DEFINITIONS_LIST_BY_DEFINITION_URL + '/' + DefinitionId)
  }

  createNlmtDefinitionsList(value) {
    return api.post(NLMT_DEFINITIONS_LIST_URL, value)
  }

  getNlmtDefinitionsListById(DefinitionsListId) {
    return api.get(NLMT_DEFINITIONS_LIST_URL + '/' + DefinitionsListId)
  }

  updateNlmtDefinitionsList(DefinitionsList, DefinitionsListId) {
    return api.put(NLMT_DEFINITIONS_LIST_URL + '/' + DefinitionsListId, DefinitionsList)
  }

  deleteNlmtDefinitionsList(DefinitionsListId) {
    return api.delete(NLMT_DEFINITIONS_LIST_URL + '/' + DefinitionsListId)
  }
  activevisibleNlmtDefinitionsListByDefinition(DefinitionId) {
    return api.get(NLMT_ACTIVE_DEFINITIONS_LIST_BY_DEFINITION_URL + '/' + DefinitionId)
  }
}

export default new NlmtDefinitionsListApi()
