
import AppConfig from "src/AppConfig";
import api from "../../Config";

const DRIVER_TYPE_URL = AppConfig.api.baseUrl+ '/driverType'
class DriverTypeService {

     getDriverTypes()
     {
      return api.get(DRIVER_TYPE_URL)
     }

}

export default new DriverTypeService()
