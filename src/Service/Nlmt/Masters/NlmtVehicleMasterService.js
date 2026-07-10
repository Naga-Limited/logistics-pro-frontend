import AppConfig from "src/AppConfig";
import api from 'src/Service/Config'


export const NLMT_VEHILCE_MASTER_BASE_URL = AppConfig.api.baseUrl+'/nlmt_vehicles'
export const OWN_NLMT_VEHILCES_MASTER_INFO_BASE_URL = AppConfig.api.baseUrl+'/own_nlmt_vehicles_status'
export const OWN_NLMT_VEHILCES_TYPE_INFO_BASE_URL = AppConfig.api.baseUrl+'/get_nlmt_other_vehicle_type'
export const HIRE_NLMT_VEHILCES_TYPE_INFO_BASE_URL = AppConfig.api.baseUrl+'/get_nlmt_hire_vehicle_number'
export const HIRE_NLMT_VEHILCES_CHECK_INFO_BASE_URL = AppConfig.api.baseUrl+'/check_nlmt_vehicle_number'
export const NLMT_OWN_VEHILCES_MASTER_INFO_BASE_URL = AppConfig.api.baseUrl + '/get_nlmt_own_vehicles_status'

class NlmtVehicleMasterService {
  getNlmtVehicles() {
    return api.get(NLMT_VEHILCE_MASTER_BASE_URL)
  }

  createNlmtVehicles(value) {
    return api.post(NLMT_VEHILCE_MASTER_BASE_URL, value)
  }

  getNlmtVehiclesById(VehiclesId) {
    return api.get(NLMT_VEHILCE_MASTER_BASE_URL + '/' + VehiclesId)
  }

  updateNlmtVehicles( VehiclesId,Vehicles) {

    return api.post(NLMT_VEHILCE_MASTER_BASE_URL + '/' + VehiclesId, Vehicles)
  }

  deleteNlmtVehicles(VehiclesId) {
    return api.delete(NLMT_VEHILCE_MASTER_BASE_URL + '/' + VehiclesId)
  }

  getNlmtOwnTripVehicles() {
    return api.get(OWN_VEHILCES_MASTER_INFO_BASE_URL)
    // return rdata
  }
  getAllNlmtVehicles() {
  return api.get(AppConfig.api.baseUrl + '/nlmt_vehicles')
}
  getNlmtOtherVehicleType() {
    return api.get(OWN_NLMT_VEHILCES_TYPE_INFO_BASE_URL)
  }
    getNlmtHireVehicle() {
    return api.get(HIRE_NLMT_VEHILCES_TYPE_INFO_BASE_URL)
  }
  //     getNlmtHireVehicleCheck(vehicleNumber) {
  //   HIRE_NLMT_VEHILCES_CHECK_INFO_BASE_URL + '/' + vehicleNumber
  // }
    getNlmtHireVehicleCheck(vehicleNumber) {
      return api.get(HIRE_NLMT_VEHILCES_CHECK_INFO_BASE_URL +'/' + vehicleNumber)
    }

  getOwnTripVehicles() {
    return api.get(NLMT_OWN_VEHILCES_MASTER_INFO_BASE_URL) 
  }

}

export default new NlmtVehicleMasterService()
