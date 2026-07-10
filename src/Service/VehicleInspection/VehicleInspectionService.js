import AppConfig from 'src/AppConfig'
import api from '../Config'

const VEHICLE_INSPECTION_URL = AppConfig.api.baseUrl + '/VehicleInspection'

const PARKING_YRD_SINGLE_VEHICLE_INFO_URL = AppConfig.api.baseUrl + '/parkingYard/'

class VehicleInspectionService {
  getVehicleReadyToInspect() {
    return api.get(VEHICLE_INSPECTION_URL)
  }

  addVehicleInspectionDetails(data) {
    return api.post(VEHICLE_INSPECTION_URL, data)
  }

  getSingleVehicleInfoOnParkingYardGate(id) {
    return api.get(PARKING_YRD_SINGLE_VEHICLE_INFO_URL + id)
  }
}

export default new VehicleInspectionService()
