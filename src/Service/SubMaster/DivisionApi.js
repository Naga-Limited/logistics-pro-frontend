import AppConfig from "src/AppConfig";
import api from "../Config";

const DIVISON_URL =AppConfig.api.baseUrl+ '/division' //Development

class DivisionApi {
  getDivision() {
    return api.get(DIVISON_URL)
  }

  createDivision(value) {
    return api.post(DIVISON_URL, value)
  }

  getDivisionById(DivisionId) {
    return api.get(DIVISON_URL + '/' + DivisionId)
  }

  updateDivision(Division, DivisionId) {
    return api.put(DIVISON_URL + '/' + DivisionId, Division)
  }

  deleteDivision(DivisionId) {
    return api.delete(DIVISON_URL + '/' + DivisionId)
  }
}

export default new DivisionApi()
