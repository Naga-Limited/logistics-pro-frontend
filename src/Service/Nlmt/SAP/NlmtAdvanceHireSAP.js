import AppConfig from 'src/AppConfig'
import api from 'src/Service/Config'

const ADVANCE_HIRE = AppConfig.api.baseUrl + '/sap/NlmtHireadvance'
const ADVANCE_DIESEL_HIRE = AppConfig.api.baseUrl + '/sap/Nlmt_Hire_diesel_advance'
const ADVANCE_BANK_HIRE = AppConfig.api.baseUrl + '/sap/Nlmt_Hire_bank_advance'

class NlmtAdvanceHireSAP {
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
export default new NlmtAdvanceHireSAP()
