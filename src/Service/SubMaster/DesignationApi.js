import AppConfig from "src/AppConfig";
import api from "../Config";

const DESIGNATION_URL = AppConfig.api.baseUrl+ '/designation' //Development

class DesignationApi {
  getDesignation() {
    return api.get(DESIGNATION_URL)
  }

  createDesignation(value) {
    return api.post(DESIGNATION_URL, value)
  }

  getDesignationById(DesignationId) {
    return api.get(DESIGNATION_URL + '/' + DesignationId)
  }

  updateDesignation(Designation, DesignationId) {
    return api.put(DESIGNATION_URL + '/' + DesignationId, Designation)
  }

  deleteDesignation(DesignationId) {
    return api.delete(DESIGNATION_URL + '/' + DesignationId)
  }
}

export default new DesignationApi()
