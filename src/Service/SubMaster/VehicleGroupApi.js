
import AppConfig from "src/AppConfig";
import api from "../Config";

const VEHICLE_GROUP_URL = AppConfig.api.baseUrl+ '/vehicle_group' //Development

class VehicleGroupApi {
  getVehicleGroup() {
    return api.get(VEHICLE_GROUP_URL)
  }

  createVehicleGroup(value) {
    return api.post(VEHICLE_GROUP_URL, value)
  }

  getVehicleGroupById(VehicleGroupId) {
    return api.get(VEHICLE_GROUP_URL + '/' + VehicleGroupId)
  }

  updateVehicleGroup(VehicleGroup, VehicleGroupId) {
    return api.put(VEHICLE_GROUP_URL + '/' + VehicleGroupId, VehicleGroup)
  }

  deleteVehicleGroup(VehicleGroupId) {
    return api.delete(VEHICLE_GROUP_URL + '/' + VehicleGroupId)
  }
}

export default new VehicleGroupApi()
