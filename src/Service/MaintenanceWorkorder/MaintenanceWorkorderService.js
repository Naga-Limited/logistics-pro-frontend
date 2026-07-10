



import AppConfig from "src/AppConfig";
import api from "../Config";



const MAINTENANCE_WORKODER_URL = AppConfig.api.baseUrl+ '/maintenance_workorder'



class MaintenanceWorkorderService {


   getMaintenanceWorkorderService()
   {
    return api.get(MAINTENANCE_WORKODER_URL)
   }
}

export default new  MaintenanceWorkorderService()
