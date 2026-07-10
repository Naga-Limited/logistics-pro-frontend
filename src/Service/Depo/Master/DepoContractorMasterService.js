import AppConfig from 'src/AppConfig'
import api from 'src/Service/Config'

const DEPO_CONTRACTOR_MASTER_BASE_URL = AppConfig.api.baseUrl + '/Depo/Contractor'
const DEPO_ACTIVE_CONTRACTORS_LIST_URL = AppConfig.api.baseUrl + '/Depo/ActiveContractor'

class DepoContractorMasterService {
  getDepoContractors() {
    return api.get(DEPO_CONTRACTOR_MASTER_BASE_URL)
  }

  getActiveDepoContractors() {
    return api.get(DEPO_ACTIVE_CONTRACTORS_LIST_URL)
  }

  createDepoContractor(value) {
    return api.post(DEPO_CONTRACTOR_MASTER_BASE_URL, value)
  }

  getContractorsById(ContractorId) {
    return api.get(DEPO_CONTRACTOR_MASTER_BASE_URL + '/' + ContractorId)
  }

  updateContractors(ContractorId, Contractors) {
    return api.post(DEPO_CONTRACTOR_MASTER_BASE_URL + '/' + ContractorId, Contractors)
  }

  deleteDepoContractor(ContractorId) {
    return api.delete(DEPO_CONTRACTOR_MASTER_BASE_URL + '/' + ContractorId)
  }
}

export default new DepoContractorMasterService()
