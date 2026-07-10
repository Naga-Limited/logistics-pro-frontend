import AppConfig from 'src/AppConfig'
//import api from 'src/Service/Config'
import api from 'src/Service/Config'

const NLMT_DRIVER_MASTER_BASE_URL = AppConfig.api.baseUrl + '/Nlmt/Masters/Drivers'
const NLMT_DRIVER_MASTER_ASSIGN_BASE_URL = AppConfig.api.baseUrl + '/nlmt_driver_assign/'

class NlmtDriverMasterService {
  getNlmtDrivers() {
    return api.get(NLMT_DRIVER_MASTER_BASE_URL)
  }

  createNlmtDrivers(value) {
    return api.post(NLMT_DRIVER_MASTER_BASE_URL, value)
  }

  getNlmtDriversById(DriversId) {
    return api.get(NLMT_DRIVER_MASTER_BASE_URL + '/' + DriversId)
  }

  updateNlmtDrivers(DriversId, Drivers) {
    return api.post(NLMT_DRIVER_MASTER_BASE_URL + '/' + DriversId, Drivers)
  }

  deleteNlmtDrivers(DriversId) {
    return api.delete(NLMT_DRIVER_MASTER_BASE_URL + '/' + DriversId)
  }

  muteNlmtDrivers(DriversId) {
    return api.patch(NLMT_DRIVER_MASTER_ASSIGN_BASE_URL + DriversId)
  }
}

export default new NlmtDriverMasterService()
