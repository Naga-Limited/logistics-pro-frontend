import AppConfig from 'src/AppConfig'
import api from '../Config'

const ADVANCE_HIRE = AppConfig.api.baseUrl + '/sap/Hireadvance'
const ADVANCE_DIESEL_HIRE = AppConfig.api.baseUrl + '/sap/Hire_diesel_advance'
const ADVANCE_BANK_HIRE = AppConfig.api.baseUrl + '/sap/Hire_bank_advance'

class AdvanceHireSAP {
  // GET ADVANCE HIRE FROM SAP
  AdvanceHireSAP(data) {
    return api.post(ADVANCE_HIRE, data)
  }
  AdvanceHireDieselSAP(data) {
    return api.post(ADVANCE_DIESEL_HIRE, data)
  }
  AdvanceHireBankSAP(data) {
    return api.post(ADVANCE_BANK_HIRE, data)
  }
}
export default new AdvanceHireSAP()
