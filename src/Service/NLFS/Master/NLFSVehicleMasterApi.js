import AppConfig from 'src/AppConfig'
import api from 'src/Service/Config'

const NLFS_VEHICLE_MASTER_URL = AppConfig.api.baseUrl + '/NLFS/Vehicle'
const NLFS_ACTIVE_VEHICLE_MASTER_URL = AppConfig.api.baseUrl + '/NLFS/ActiveVehicle' 
export const NLFS_VEHICLE_SOFT_DELETE_URL = AppConfig.api.baseUrl + '/NLFS/VehicleSoftDeleteRequest'
export const NLFS_VEHICLE_BACKFILL_LOG_URL = AppConfig.api.baseUrl + '/NLFS/backfillVehicleLog'

class NLFSVehicleMasterApi {
  getNLFSVehicles() {
    return api.get(NLFS_VEHICLE_MASTER_URL)
  }

  getActiveNLFSVehicles() {
    return api.get(NLFS_ACTIVE_VEHICLE_MASTER_URL)
  }

  createNLFSVehicles(value) {
    return api.post(NLFS_VEHICLE_MASTER_URL, value)
  }

  getNLFSVehiclesById(VehiclesId) {
    return api.get(NLFS_VEHICLE_MASTER_URL + '/' + VehiclesId)
  }

  updateNLFSVehicles(VehiclesId,Vehicles) {
    return api.post(NLFS_VEHICLE_MASTER_URL + '/' + VehiclesId, Vehicles)
  }  

  deleteNLFSVehicles(VehiclesId) {
    return api.delete(NLFS_VEHICLE_MASTER_URL + '/' + VehiclesId)
  }

  softDeleteNLFSVehicles(data) {
    return api.post(NLFS_VEHICLE_SOFT_DELETE_URL, data)
  }

  backfillNLFSVehicleLog(data) {
    return api.post(NLFS_VEHICLE_BACKFILL_LOG_URL, data)
  }
}

export default new NLFSVehicleMasterApi()
