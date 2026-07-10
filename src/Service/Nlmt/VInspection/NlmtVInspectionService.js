import AppConfig from 'src/AppConfig'
import api from 'src/Service/Config'

const NLMT_VINSPECTION_BASE_URL = AppConfig.api.baseUrl + '/Nlmt/VInspection'
const NLMT_GATEIN_BASE_URL = AppConfig.api.baseUrl + '/Nlmt/TripIn/'

class NlmtVInspectionService {

  getVehicleReadyToInspect() {
    return api.get(NLMT_VINSPECTION_BASE_URL)
  }

  getSingleVehicleInfoOnTripIn(id) {
    return api.get(NLMT_GATEIN_BASE_URL + id)
  }

  handleVehicleInspectionAction(data) {
    return api.post(NLMT_VINSPECTION_BASE_URL, data)
  }

}

export default new NlmtVInspectionService()
