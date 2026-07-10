import AppConfig from 'src/AppConfig'
import api from 'src/Service/Config'

const DEPO_DRIVER_MASTER_BASE_URL = AppConfig.api.baseUrl + '/Depo/Driver'
const DEPO_DRIVER_MASTER_BASED_ON_CONTRACTOR_ID_VIEW_URL = AppConfig.api.baseUrl + '/Depo/DriverByContractor'

class DepoDriverMasterService {
  getDepoDrivers() {
    return api.get(DEPO_DRIVER_MASTER_BASE_URL)
  }

  createDepoDriver(value) {
    return api.post(DEPO_DRIVER_MASTER_BASE_URL, value)
  }

  getDriversById(DriversId) {
    return api.get(DEPO_DRIVER_MASTER_BASE_URL + '/' + DriversId)
  }

  getDepoDriverByContractorId(contractorId) {
    return api.get(DEPO_DRIVER_MASTER_BASED_ON_CONTRACTOR_ID_VIEW_URL + '/' + contractorId)
  }

  updateDrivers(DriversId, Drivers) {
    return api.post(DEPO_DRIVER_MASTER_BASE_URL + '/' + DriversId, Drivers)
  }

  deleteDepoDriver(DriversId) {
    return api.delete(DEPO_DRIVER_MASTER_BASE_URL + '/' + DriversId)
  }
}

export default new DepoDriverMasterService()
