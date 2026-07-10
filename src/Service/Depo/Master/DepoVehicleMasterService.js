import AppConfig from 'src/AppConfig'
import api from 'src/Service/Config'

const DEPO_VEHICLE_MASTER_BASE_URL = AppConfig.api.baseUrl + '/Depo/Vehicle'
const DEPO_VEHICLE_MASTER_BASED_ON_CONTRACTOR_ID_VIEW_URL = AppConfig.api.baseUrl + '/Depo/VehicleByContractor'

class DepoVehicleMasterService {
  getDepoVehicles() {
    return api.get(DEPO_VEHICLE_MASTER_BASE_URL)
  }

  createDepoVehicle(value) {
    return api.post(DEPO_VEHICLE_MASTER_BASE_URL, value)
  }

  getDepoVehicleById(VehicleId) {
    return api.get(DEPO_VEHICLE_MASTER_BASE_URL + '/' + VehicleId)
  }

  getDepoVehicleByContractorId(contractorId) {
    return api.get(DEPO_VEHICLE_MASTER_BASED_ON_CONTRACTOR_ID_VIEW_URL + '/' + contractorId)
  }

  updateVehicles(VehicleId, Vehicles) {
    return api.post(DEPO_VEHICLE_MASTER_BASE_URL + '/' + VehicleId, Vehicles)
  }

  deleteDepoVehicle(VehicleId) {
    return api.delete(DEPO_VEHICLE_MASTER_BASE_URL + '/' + VehicleId)
  }
}

export default new DepoVehicleMasterService()
