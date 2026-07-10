import AppConfig from 'src/AppConfig'
import api from '../../Config'

const VEHICLE_TYPE_URL = AppConfig.api.baseUrl + '/vehicleType'
class VehicleTypeService {
  getVehicleTypes() {
    return api.get(VEHICLE_TYPE_URL)
  }
}

export default new VehicleTypeService()
