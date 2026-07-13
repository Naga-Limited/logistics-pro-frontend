import AppConfig from 'src/AppConfig'
import api from 'src/Service/Config'

const ADVANCE_OWN = AppConfig.api.baseUrl + '/sap/NlmtOwnadvance'
const ADVANCE_SIMULATION = AppConfig.api.baseUrl + '/sap/NlmtAdvanceSimulation'

class NlmtAdvanceOwnSAP {
  // GET ADVANCE Own Driver FROM SAP
  AdvanceOwnSAP(data) {
    return api.post(ADVANCE_OWN, data)
  }

  AdvanceSimulationSAP(data) {
    return api.post(ADVANCE_SIMULATION, data)
  }
}
export default new NlmtAdvanceOwnSAP()


