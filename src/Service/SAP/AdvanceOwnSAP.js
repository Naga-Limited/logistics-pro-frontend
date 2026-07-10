import AppConfig from 'src/AppConfig'
import api from '../Config'

const ADVANCE_OWN = AppConfig.api.baseUrl + '/sap/Ownadvance'

class AdvanceOwnSAP {
  // GET ADVANCE Own Driver FROM SAP
  AdvanceOwnSAP(data) {
    return api.post(ADVANCE_OWN, data)
  }
}
export default new AdvanceOwnSAP()


