

import AppConfig from "src/AppConfig";
import api from "../../Config";

const VEHICLE_VARIETY_URL = AppConfig.api.baseUrl+ '/vehicle_variety'
class VehicleVarietyService {

  getVehicleVariety()
  {
    return api.get(VEHICLE_VARIETY_URL)
  }

}

export default new VehicleVarietyService()
