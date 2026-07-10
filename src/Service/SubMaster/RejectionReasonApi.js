import AppConfig from "src/AppConfig";
import api from "../Config";


const REJECTION_REASON_URL = AppConfig.api.baseUrl+ '/rejection_reason' //Development

class RejectionReasonApi {
  getRejectionReason() {
    return api.get(REJECTION_REASON_URL)
  }

  createRejectionReason(value) {
    return api.post(REJECTION_REASON_URL, value)
  }

  getRejectionReasonById(RejectionReasonId) {
    return api.get(REJECTION_REASON_URL + '/' + RejectionReasonId)
  }

  updateRejectionReason(RejectionReason, RejectionReasonId) {
    return api.put(REJECTION_REASON_URL + '/' + RejectionReasonId, RejectionReason)
  }

  deleteRejectionReason(RejectionReasonId) {
    return api.delete(REJECTION_REASON_URL + '/' + RejectionReasonId)
  }
}

export default new RejectionReasonApi()
