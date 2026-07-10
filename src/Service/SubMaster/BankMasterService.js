import AppConfig from 'src/AppConfig'
import api from '../Config'

const BANK_MASTER_URL = AppConfig.api.baseUrl + '/bank'
const BANK_SOFT_DELETE_URL = AppConfig.api.baseUrl + '/bankSoftDeleteRequest'

class BankMasterService {
  getAllBank() {
    return api.get(BANK_MASTER_URL)
  }

  createBank(data) {
    return api.post(BANK_MASTER_URL, data)
  }

  getBankById(BankId) {
    return api.get(BANK_MASTER_URL + '/' + BankId)
  }

  updateBank(BankId, BankData) {
    return api.post(BANK_MASTER_URL + '/' + BankId, BankData)
  }

  deleteBank(BankId) {
    return api.delete(BANK_MASTER_URL + '/' + BankId)
  }

  softDeleteBank(data) {
    return api.post(BANK_SOFT_DELETE_URL, data)
  }
}

export default new BankMasterService()
