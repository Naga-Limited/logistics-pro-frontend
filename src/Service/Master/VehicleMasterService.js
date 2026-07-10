import AppConfig from 'src/AppConfig'
import api from '../Config'

export const VEHILCE_MASTER_BASE_URL = AppConfig.api.baseUrl + '/vehicles'
export const OWN_VEHILCES_MASTER_INFO_BASE_URL = AppConfig.api.baseUrl + '/own_vehicles_status'
export const VEHICLE_SOFT_DELETE_URL = AppConfig.api.baseUrl + '/vehicleSoftDeleteRequest'
export const VEHICLE_BACKFILL_LOG_URL = AppConfig.api.baseUrl + '/backfillVehicleLog'
export const HIRE_VEHICLES_INFO_BASE_URL = AppConfig.api.baseUrl + '/hire_vehicles_info'

class VehicleMasterService {
  getVehicles() {
    return api.get(VEHILCE_MASTER_BASE_URL)
  }

  getHireVehicles() {
    return api.get(HIRE_VEHICLES_INFO_BASE_URL)
  }

  createVehicles(value) {
    return api.post(VEHILCE_MASTER_BASE_URL, value)
  }

  getVehiclesById(VehiclesId) {
    return api.get(VEHILCE_MASTER_BASE_URL + '/' + VehiclesId)
  }

  updateVehicles(VehiclesId, Vehicles) {
    return api.post(VEHILCE_MASTER_BASE_URL + '/' + VehiclesId, Vehicles)
  }

  deleteVehicles(VehiclesId) {
    return api.delete(VEHILCE_MASTER_BASE_URL + '/' + VehiclesId)
  }

  getOwnTripVehicles() {
    return api.get(OWN_VEHILCES_MASTER_INFO_BASE_URL)
    // return rdata
  }

  softDeleteVehicles(data) {
    return api.post(VEHICLE_SOFT_DELETE_URL, data)
  }

  backfillVehicleLog(data) {
    return api.post(VEHICLE_BACKFILL_LOG_URL, data)
  }
}

export default new VehicleMasterService()
