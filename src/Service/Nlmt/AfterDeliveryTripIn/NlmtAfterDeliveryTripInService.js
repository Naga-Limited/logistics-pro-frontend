import AppConfig from 'src/AppConfig'
import api from 'src/Service/Config'

const DELIVERY_GATEIN = AppConfig.api.baseUrl + '/nlmt_delivery_after_tripin/'
//const DELIVERY_GATEIN_CREATION = AppConfig.api.baseUrl + '/nlmt_delivery_after_tripin'

class NlmtAfterDeliveryTripInService {
  getVehicleReadyToGatein() {
    return api.get(DELIVERY_GATEIN)
  }
  getSingleVehicleInfoOnGate(parkingYardID) {
    return api.get(DELIVERY_GATEIN + parkingYardID)
  }
  createGatein(id, values) {
    return api.post(DELIVERY_GATEIN + id, values)
  }
  createTripIn(data) {
    return api.post(DELIVERY_GATEIN, data)
  }
}

export default new NlmtAfterDeliveryTripInService()
