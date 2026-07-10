import AppConfig from 'src/AppConfig'
import api from 'src/Service/Config'

const ADVANCE_OWN = AppConfig.api.baseUrl + '/sap/NlmtOwnadvance'

class NlmtAdvanceOwnSAP {
  // GET ADVANCE Own Driver FROM SAP
  AdvanceOwnSAP(data) {
    return api.post(ADVANCE_OWN, data)
  }
}
export default new NlmtAdvanceOwnSAP()


