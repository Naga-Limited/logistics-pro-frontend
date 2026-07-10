
import AppConfig from "src/AppConfig";
import api from "../../Config";

const VEHICLE_BODY_TYPE_URL = AppConfig.api.baseUrl+ '/vehicleBody'
class VehicleBodyTypeService {

     getVehicleBody()
     {
      return api.get(VEHICLE_BODY_TYPE_URL)
     }

}

export default new VehicleBodyTypeService()
