import AppConfig from 'src/AppConfig'
import api from '../Config'

const DEFINITIONS_LIST_URL = AppConfig.api.baseUrl + '/definitions_list'
const DEFINITIONS_LIST_BY_DEFINITION_URL = AppConfig.api.baseUrl + '/definitions_list_by_definition'
const ACTIVE_DEFINITIONS_LIST_BY_DEFINITION_URL = AppConfig.api.baseUrl + '/active_definitions_list_by_definition'

class DefinitionsListApi {
  getDefinitionsList() {
    return api.get(DEFINITIONS_LIST_URL)
  }

  visibleDefinitionsListByDefinition(DefinitionId) {
    return api.get(DEFINITIONS_LIST_BY_DEFINITION_URL + '/' + DefinitionId)
  }

  createDefinitionsList(value) {
    return api.post(DEFINITIONS_LIST_URL, value)
  }

  getDefinitionsListById(DefinitionsListId) {
    return api.get(DEFINITIONS_LIST_URL + '/' + DefinitionsListId)
  }

  updateDefinitionsList(DefinitionsList, DefinitionsListId) {
    return api.put(DEFINITIONS_LIST_URL + '/' + DefinitionsListId, DefinitionsList)
  }

  deleteDefinitionsList(DefinitionsListId) {
    return api.delete(DEFINITIONS_LIST_URL + '/' + DefinitionsListId)
  }
  activevisibleDefinitionsListByDefinition(DefinitionId) {
    return api.get(ACTIVE_DEFINITIONS_LIST_BY_DEFINITION_URL + '/' + DefinitionId)
  }
}

export default new DefinitionsListApi()
