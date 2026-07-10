
import AppConfig from "src/AppConfig";
import api from "../../Config";

const VEHICLE_CAPACITY_URL = AppConfig.api.baseUrl+ '/vehicleCapacity'
class VehicleCapacityService {

     getVehicleCapacity()
     {
      return api.get(VEHICLE_CAPACITY_URL)
     }

}

export default new VehicleCapacityService()
