import AppConfig from 'src/AppConfig'
import api from 'src/Service/Config'


const TS_INFO_SHARE_TO_START_SAP = AppConfig.api.baseUrl + '/sap/nlmt/TSInfoStart'
const TS_INFO_SHARE_TO_STOP_SAP = AppConfig.api.baseUrl + '/sap/nlmt/TSInfoStop'
const TS_INFO_SHARE_TO_UPDATE_SAP = AppConfig.api.baseUrl + '/sap/nlmt/TSInfoUpdate'

class NlmtTripSheetInfoService {
  /* Sent Tripsheet Info To Start PP Process for Individual Tripsheet */


  /* Sent Tripsheet Info To Start SAP Process for Individual Tripsheet */
  StartTSInfoToSAP(data) {
    return api.post(TS_INFO_SHARE_TO_START_SAP, data)
  }

  /* Sent Tripsheet Info To Stop SAP Process for Individual Tripsheet */
  StopTSInfoToSAP(data) {
    return api.post(TS_INFO_SHARE_TO_STOP_SAP, data)
  }

  /* Sent Tripsheet Info To Update SAP Process for Individual Tripsheet */
  UpdateTSInfoToSAP(data) {
    return api.post(TS_INFO_SHARE_TO_UPDATE_SAP, data)
  }
}
export default new NlmtTripSheetInfoService()
