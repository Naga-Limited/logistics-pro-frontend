import AppConfig from 'src/AppConfig'
import api from '../Config'

const DRIVER_MASTER_BASE_URL = AppConfig.api.baseUrl + '/drivers'
const DRIVER_MASTER_ASSIGN_BASE_URL = AppConfig.api.baseUrl + '/driver_assign/' 
export const DRIVER_SOFT_DELETE_URL = AppConfig.api.baseUrl + '/driverSoftDeleteRequest'
export const DRIVER_ASSIGN_LOG_URL = AppConfig.api.baseUrl + '/driverAssignLogRequest'
export const DRIVER_BACKFILL_LOG_URL = AppConfig.api.baseUrl + '/backfillDriverLog'

class DriverMasterService {
  getDrivers() {
    return api.get(DRIVER_MASTER_BASE_URL)
  }

  createDrivers(value) {
    return api.post(DRIVER_MASTER_BASE_URL, value)
  }

  getDriversById(DriversId) {
    return api.get(DRIVER_MASTER_BASE_URL + '/' + DriversId)
  }

  updateDrivers(DriversId, Drivers) {
    return api.post(DRIVER_MASTER_BASE_URL + '/' + DriversId, Drivers)
  }

  deleteDrivers(DriversId) {
    return api.delete(DRIVER_MASTER_BASE_URL + '/' + DriversId)
  }

  muteDrivers(DriversId) {
    return api.get(DRIVER_MASTER_ASSIGN_BASE_URL + DriversId)
  }

  assignDriverWithLog(data) {
    return api.post(DRIVER_ASSIGN_LOG_URL, data)
  }

  softDeleteDrivers(data) {
    return api.post(DRIVER_SOFT_DELETE_URL, data)
  }

  backfillDriverLog(data) {
    return api.post(DRIVER_BACKFILL_LOG_URL, data)
  }
}

export default new DriverMasterService()
