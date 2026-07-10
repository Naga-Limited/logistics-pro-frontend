//Created By Mariavananraj
import AppConfig from "src/AppConfig";
import api from "../Config";

const PREVIOUS_URL =AppConfig.api.baseUrl+ '/previous_load_details' 

class PreviousLoadDetailsApi {
  getPreviousLoadDetails() {
    return api.get(PREVIOUS_URL)
  }

  createPreviousLoadDetails(value) {
    return api.post(PREVIOUS_URL, value)
  }

  getPreviousLoadDetailsById(PreviousLoadDetailsId) {
    return api.get(PREVIOUS_URL + '/' + PreviousLoadDetailsId)
  }

  updatePreviousLoadDetails(PreviousLoadDetails, PreviousLoadDetailsId) {
    return api.put(PREVIOUS_URL + '/' + PreviousLoadDetailsId, PreviousLoadDetails)
  }

  deletePreviousLoadDetails(PreviousLoadDetailsId) {
    return api.delete(PREVIOUS_URL + '/' + PreviousLoadDetailsId)
  }
}

export default new PreviousLoadDetailsApi()
