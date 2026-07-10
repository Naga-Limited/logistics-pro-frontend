

import AppConfig from "src/AppConfig";
import api from "../../Config";

const VEHICLE_GROUP_URL = AppConfig.api.baseUrl+ '/vehicle_group'
class VehicleGroupService {

    getVehicleGroup()
    {
      return api.get(VEHICLE_GROUP_URL)
    }

}

export default new VehicleGroupService()
