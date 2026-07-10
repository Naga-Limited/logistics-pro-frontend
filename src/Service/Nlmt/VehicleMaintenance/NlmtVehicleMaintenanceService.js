import AppConfig from "src/AppConfig";
import api from 'src/Service/Config'
import { VEHILCE_MASTER_BASE_URL } from 'src/Service/Master/VehicleMasterService'

const VEHICLE_MAINTENANCE_URL = AppConfig.api.baseUrl + '/NlmtVehicleMaintenance'

const VEHICLE_MAINTENANCE_UPDATE_URL = AppConfig.api.baseUrl + '/NlmtVehicleMaintenanceUpdate'
const PARKING_YRD_SINGEL_VEHICLE_INFO_URL = AppConfig.api.baseUrl + '/Nlmt/TripIn/'

const AVAIABLE_DRIVERS_LIST_URL = AppConfig.api.baseUrl + '/activeNlmtDrivers'

class NlmtVehicleMaintenanceService {
  getVehicleReadyToMaintenance() {
    return api.get(VEHICLE_MAINTENANCE_URL)
   }
   addVehicleMaintenance(data)
   {
    return api.post(VEHICLE_MAINTENANCE_URL,data)
   }
   getMaintenanceById(maintenance_id) {
    return api.get(VEHICLE_MAINTENANCE_URL + '/' + maintenance_id)
  }

  updateMaintenance(id, data) {
  return api.post(VEHICLE_MAINTENANCE_UPDATE_URL + '/' + id, data)
}
   getSingleVehicleInfoOnParkingYardGate(id)
   {
    return api.get(PARKING_YRD_SINGEL_VEHICLE_INFO_URL+id);
   }
   getDrivers()
   {
    return api.get(AVAIABLE_DRIVERS_LIST_URL)
  }
getVehicleMaintenanceInfo(vehicle_id) {
  return api.get(VEHICLE_MAINTENANCE_URL + '/' + vehicle_id)
}
  // doAssignMaintenance(id) {
  //   return api.get(VEHICLE_MAINTENANCE_URL + '/' + id)
  // }
}

export default new NlmtVehicleMaintenanceService()
