
import AppConfig from "src/AppConfig";
import api from "../Config";


const VEHICLE_VARIETY_URL = AppConfig.api.baseUrl+ '/vehicle_variety' //Development

class VehicleVarietyApi {
  getVehicleVariety() {
    return api.get(VEHICLE_VARIETY_URL)
  }

  createVehicleVariety(value) {
    return api.post(VEHICLE_VARIETY_URL, value)
  }

  getVehicleVarietyById(VehicleVarietyId) {
    return api.get(VEHICLE_VARIETY_URL + '/' + VehicleVarietyId)
  }

  updateVehicleVariety(VehicleVariety, VehicleVarietyId) {
    return api.put(VEHICLE_VARIETY_URL + '/' + VehicleVarietyId, VehicleVariety)
  }

  deleteVehicleVariety(VehicleVarietyId) {
    return api.delete(VEHICLE_VARIETY_URL + '/' + VehicleVarietyId)
  }
}

export default new VehicleVarietyApi()
