import AppConfig from 'src/AppConfig'
import api from 'src/Service/Config'

const NLMT_TS_FREIGHT_UPDATION_APPROVAL_DATA_GET_URL = AppConfig.api.baseUrl + '/NlmtTripFreightUpdationApprovalData_get'
const NLMT_TS_FREIGHT_UPDATION_APPROVAL_DATA_SENT_URL = AppConfig.api.baseUrl + '/NlmtTripFreightUpdationApprovalData_sent'
const NLMT_TS_FREIGHT_UPDATION_REJECTION_DATA_SENT_URL = AppConfig.api.baseUrl + '/NlmtTripFreightUpdationRejectionData_sent'
const NLMT_TS_FREIGHT_UPDATION_REREQUEST_DATA_SENT_URL = AppConfig.api.baseUrl + '/NlmtTripFreightUpdationReRequestData_sent'
const NLMT_TS_FREIGHT_UPDATION_REQUEST_DATA_GET_URL = AppConfig.api.baseUrl + '/NlmtTripFreightUpdationRequestData_get'

class NlmtTSFreightUpdationService {

  getFreightUpdationApprovalData() {
    return api.get(NLMT_TS_FREIGHT_UPDATION_APPROVAL_DATA_GET_URL)
  }

  approveFreightUpdationApprovalData(data) {
    return api.post(NLMT_TS_FREIGHT_UPDATION_APPROVAL_DATA_SENT_URL, data)
  }

  rejectFreightUpdationApprovalData(data) {
    return api.post(NLMT_TS_FREIGHT_UPDATION_REJECTION_DATA_SENT_URL, data)
  }

  rerequestFreightUpdationApprovalData(data) {
    return api.post(NLMT_TS_FREIGHT_UPDATION_REREQUEST_DATA_SENT_URL, data)
  }
  
  getFreightUpdationRequestData() {
    return api.get(NLMT_TS_FREIGHT_UPDATION_REQUEST_DATA_GET_URL)
  }

}

export default new NlmtTSFreightUpdationService()
