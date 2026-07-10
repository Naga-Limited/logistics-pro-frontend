import AppConfig from 'src/AppConfig'
import api from 'src/Service/Config'

const ADVANCE_BASE_URL = AppConfig.api.baseUrl + '/NlmtAdvance/'
const ADVANCE_CREATE_URL = AppConfig.api.baseUrl + '/NlmtAdvance'
const DEFINITIONS_LIST_DEFINITION_URL = AppConfig.api.baseUrl + '/definitions_list_show'
const ADDITIONAL_ADVANCE_BASE_URL = AppConfig.api.baseUrl + '/nlmt_AdditionalAdvanceIndex/'
const ADDITIONAL_ADVANCE_CREATE_URL = AppConfig.api.baseUrl + '/NlmtAdditionalAdvanceStore'
const ADDITIONAL_ADVANCE_CREATE_UPDATE_URL = AppConfig.api.baseUrl + '/put-nlmt_additional_advance_update'
const DIESEL_ADVANCE_CREATE_UPDATE_URL = AppConfig.api.baseUrl + '/put-diesel_nlmt_advance_update'
const FREIGHT_ADVANCE_CREATE_UPDATE_URL = AppConfig.api.baseUrl + '/put-nlmt_freight_advance_update'

const ADVANCE_SEARCH_FILTER_URL = AppConfig.api.baseUrl + '/nlmtAdvanceSearchFilterRequest'
const ADVANCE_REJECTION_URL = AppConfig.api.baseUrl + '/nlmtAdvanceApprovalReject'

const ADVANCE_APPROVAL_DATA_FETCH_URL = AppConfig.api.baseUrl + '/nlmt_advance_approval_show/' 
const ADVANCE_APPROVAL_INFO_FETCH_BY_ID_URL = AppConfig.api.baseUrl + '/nlmt_advance_approval_info_by_id' 

class NlmtAdvanceCreationService {
  getVehicleReadyToAdvance() {
    return api.get(ADVANCE_BASE_URL)
  }  
  getVehicleReadyToAdvanceFilterSearch(data) {
    return api.post(ADVANCE_SEARCH_FILTER_URL, data)
  }
  getVehicleReadyToAdvanceApproval() {
    return api.get(ADVANCE_APPROVAL_DATA_FETCH_URL)
  } 
  getSingleVehicleInfoOnGate(parkingYardID) {
    return api.get(ADVANCE_BASE_URL + parkingYardID)
  }
  getAdvanceApprovalInfoById(parkingYardID) {
    return api.get(ADVANCE_APPROVAL_INFO_FETCH_BY_ID_URL + '/' + parkingYardID)
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

  rejectAdvanceApproval(data) {
    return api.post(ADVANCE_REJECTION_URL, data)
  }
}

export default new NlmtAdvanceCreationService()
