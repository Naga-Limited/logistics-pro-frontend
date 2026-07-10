import AppConfig from 'src/AppConfig'
import api from 'src/Service/Config'

const IFOODS_VEHICLE_MASTER_BASE_URL = AppConfig.api.baseUrl + '/Ifoods/Vehicle'
const IFOODS_VEHICLE_MASTER_BASED_ON_CONTRACTOR_ID_VIEW_URL = AppConfig.api.baseUrl + '/Ifoods/VehicleByVendor'
const IFOODS_ACTIVE_VEHICLE_LIST_URL = AppConfig.api.baseUrl + '/Ifoods/ActiveVehicle'

class IfoodsVehicleMasterService {
  getIfoodsVehicles() {
    return api.get(IFOODS_VEHICLE_MASTER_BASE_URL)
  }
  getActiveIfoodsVehicle() {
    return api.get(IFOODS_ACTIVE_VEHICLE_LIST_URL)
  }

  createIfoodsVehicle(value) {
    return api.post(IFOODS_VEHICLE_MASTER_BASE_URL, value)
  }

  getIfoodsVehicleById(VehicleId) {
    return api.get(IFOODS_VEHICLE_MASTER_BASE_URL + '/' + VehicleId)
  }

  getIfoodsVehicleByVendorId(contractorId) {
    return api.get(IFOODS_VEHICLE_MASTER_BASED_ON_CONTRACTOR_ID_VIEW_URL + '/' + contractorId)
  }

  updateVehicles(VehicleId, Vehicles) {
    return api.post(IFOODS_VEHICLE_MASTER_BASE_URL + '/' + VehicleId, Vehicles)
  }

  deleteIfoodsVehicle(VehicleId) {
    return api.delete(IFOODS_VEHICLE_MASTER_BASE_URL + '/' + VehicleId)
  }
}

export default new IfoodsVehicleMasterService()
