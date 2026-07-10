import AppConfig from 'src/AppConfig'
import api from '../Config'

const ADVANCE_BASE_URL = AppConfig.api.baseUrl + '/Advance/'
const ADVANCE_CREATE_URL = AppConfig.api.baseUrl + '/Advance'
const DEFINITIONS_LIST_DEFINITION_URL = AppConfig.api.baseUrl + '/definitions_list_show'
const ADDITIONAL_ADVANCE_BASE_URL = AppConfig.api.baseUrl + '/AdditionalAdvanceIndex/'
const ADDITIONAL_ADVANCE_CREATE_URL = AppConfig.api.baseUrl + '/AdditionalAdvanceStore'
const ADDITIONAL_ADVANCE_CREATE_UPDATE_URL = AppConfig.api.baseUrl + '/put-additional_advance_update'
const DIESEL_ADVANCE_CREATE_UPDATE_URL = AppConfig.api.baseUrl + '/put-diesel_advance_update'
const FREIGHT_ADVANCE_CREATE_UPDATE_URL = AppConfig.api.baseUrl + '/put-freight_advance_update'

const ADVANCE_SEARCH_FILTER_URL = AppConfig.api.baseUrl + '/advanceSearchFilterRequest'

class AdvanceCreationService {
  getVehicleReadyToAdvance() {
    return api.get(ADVANCE_BASE_URL)
  }
  getVehicleReadyToAdvanceFilterSearch(data) {
    return api.post(ADVANCE_SEARCH_FILTER_URL, data)
  }
  getSingleVehicleInfoOnGate(parkingYardID) {
    return api.get(ADVANCE_BASE_URL + parkingYardID)
  }
  createAdvance(data) {
    return api.post(ADVANCE_CREATE_URL, data)
  }
  updateAdvance(id, values) {
    return api.post(ADVANCE_BASE_URL + id, values)
  }

  visibleDefinitionsListByDefinition(DefinitionId) {
    return api.get(DEFINITIONS_LIST_DEFINITION_URL + '/' + DefinitionId)
  }

  getVehicleReadyToAdditionalAdvance() {
    return api.get(ADDITIONAL_ADVANCE_BASE_URL)
  }

  createAdditionalAdvance(data) {
    return api.post(ADDITIONAL_ADVANCE_CREATE_URL, data)
  }

  updateAdditionalAdvance(id,data) {
    return api.post(ADDITIONAL_ADVANCE_CREATE_UPDATE_URL + '/' + id, data)
  }

  diesel_advance_update(id,data) {
    return api.post(DIESEL_ADVANCE_CREATE_UPDATE_URL + '/' + id, data)
  }

  freight_advance_update(id,data) {
    return api.post(FREIGHT_ADVANCE_CREATE_UPDATE_URL + '/' + id, data)
  }
}

export default new AdvanceCreationService()
