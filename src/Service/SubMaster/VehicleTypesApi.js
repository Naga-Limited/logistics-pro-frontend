import AppConfig from "src/AppConfig";
import api from "../Config";


const VEHICLE_TYPES_URL = AppConfig.api.baseUrl+ '/vehicleType' //Development

class VehicleTypesApi {
  getVehicleTypes() {
    return api.get(VEHICLE_TYPES_URL)
  }
}

export default new VehicleTypesApi()
