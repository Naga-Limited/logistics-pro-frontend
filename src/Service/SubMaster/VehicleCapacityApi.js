import AppConfig from "src/AppConfig";
import api from "../Config";


const VEHICLE_CAPACITY_URL = AppConfig.api.baseUrl+ '/vehicleCapacity' //Development

class VehicleCapacityApi {
  getVehicleCapacity() {
    return api.get(VEHICLE_CAPACITY_URL)
  }

  createVehicleCapacity(value) {
    return api.post(VEHICLE_CAPACITY_URL, value)
  }

  getVehicleCapacityById(VehicleCapacityId) {
    return api.get(VEHICLE_CAPACITY_URL + '/' + VehicleCapacityId)
  }

  updateVehicleCapacity(VehicleCapacity, VehicleCapacityId) {
    return api.put(VEHICLE_CAPACITY_URL + '/' + VehicleCapacityId, VehicleCapacity)
  }

  deleteVehicleCapacity(VehicleCapacityId) {
    return api.delete(VEHICLE_CAPACITY_URL + '/' + VehicleCapacityId)
  }
}

export default new VehicleCapacityApi()
