import AppConfig from "src/AppConfig";
import api from "../Config";

const DELIVERY_GATEIN = AppConfig.api.baseUrl + '/delivery_after_gatein/'
const DELIVERY_GATEIN_CREATION = AppConfig.api.baseUrl + '/delivery_after_gatein'

class AfterDeliveryGateIn {

  getVehicleReadyToGatein() {
    return api.get(DELIVERY_GATEIN)
  }
  getSingleVehicleInfoOnGate(parkingYardID) {
    return api.get(DELIVERY_GATEIN + parkingYardID)
  }
  createGatein(id,values) {
    return api.post(DELIVERY_GATEIN  +  id,values)
  }
  createGate(data) {
    return api.post(DELIVERY_GATEIN_CREATION , data)
  }

}

export default new  AfterDeliveryGateIn()
