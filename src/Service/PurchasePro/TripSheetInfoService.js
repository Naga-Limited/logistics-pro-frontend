import AppConfig from 'src/AppConfig'
import api from '../Config'

const TS_INFO_SHARE_TO_START_PP = AppConfig.api.baseUrl + '/pp/TSInfoStart'
const TS_INFO_SHARE_TO_STOP_PP = AppConfig.api.baseUrl + '/pp/TSInfoStop'
const TS_INFO_SHARE_TO_START_SAP = AppConfig.api.baseUrl + '/sap/TSInfoStart'
const TS_INFO_SHARE_TO_STOP_SAP = AppConfig.api.baseUrl + '/sap/TSInfoStop'
const TS_INFO_SHARE_TO_UPDATE_SAP = AppConfig.api.baseUrl + '/sap/TSInfoUpdate'

class TripSheetInfoService {
  /* Sent Tripsheet Info To Start PP Process for Individual Tripsheet */
  StartTSInfoToPP(data) {
    return api.post(TS_INFO_SHARE_TO_START_PP, data)
  }

  /* Sent Tripsheet Info To Stop PP Process for Individual Tripsheet */
  StopTSInfoToPP(data) {
    return api.post(TS_INFO_SHARE_TO_STOP_PP, data)
  }

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
export default new TripSheetInfoService()
