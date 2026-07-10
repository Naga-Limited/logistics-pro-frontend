import AppConfig from 'src/AppConfig'
import api from 'src/Service/Config'

const DEPO_VINSPECTION_BASE_URL = AppConfig.api.baseUrl + '/Ifoods/VInspection'
const DEPO_GATEIN_BASE_URL = AppConfig.api.baseUrl + '/Ifoods/GateIn/'

class IfoodsVInspectionService {

  getVehicleReadyToInspect() {
    return api.get(DEPO_VINSPECTION_BASE_URL)
  }

  getSingleVehicleInfoOnParkingYardGate(id) {
    return api.get(DEPO_GATEIN_BASE_URL + id)
  }

  handleVehicleInspectionAction(data) {
    return api.post(DEPO_VINSPECTION_BASE_URL, data)
  }

}

export default new IfoodsVInspectionService()
