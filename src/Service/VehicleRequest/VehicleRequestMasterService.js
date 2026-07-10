import AppConfig from 'src/AppConfig'
import api from 'src/Service/Config'

const VEHICLE_REQUEST_MASTER_BASE_URL = AppConfig.api.baseUrl + '/vehicle_request'
const VEHICLE_REQUEST_MASTER_CLOSURE_URL = AppConfig.api.baseUrl + '/vehicle_request_closure'
const VEHICLE_REQUEST_CANCEL_URL = AppConfig.api.baseUrl + '/vehicle_request_cancel'
const VEHICLE_REQUEST_ACTIVE_LIST_URL = AppConfig.api.baseUrl + '/active_vehicle_request'
const VEHICLE_REQUEST_ACTIVE_FOR_ASSIGNING_LIST_URL = AppConfig.api.baseUrl + '/vehicle_request_for_assigning'
const VEHICLE_REQUEST_REPORT_SENT_URL =  AppConfig.api.baseUrl + '/VRReportRequest'
const VEHICLE_REQUEST_REPORT_VIEW_URL =  AppConfig.api.baseUrl + '/VRReportView'

class VehicleRequestMasterService {
  getVehicleRequests() {
    return api.get(VEHICLE_REQUEST_MASTER_BASE_URL)
  }

  getClosureVehicleRequests() {
    return api.get(VEHICLE_REQUEST_MASTER_CLOSURE_URL)
  }

  getActiveVehicleRequests() {
    return api.get(VEHICLE_REQUEST_ACTIVE_LIST_URL)
  }

  getVehicleRequestsForAssigning() {
    return api.get(VEHICLE_REQUEST_ACTIVE_FOR_ASSIGNING_LIST_URL)
  }

  createVehicleRequest(value) {
    return api.post(VEHICLE_REQUEST_MASTER_BASE_URL, value)
  }

  getVehicleRequestsById(vr_id) {
    return api.get(VEHICLE_REQUEST_MASTER_BASE_URL + '/' + vr_id)
  }

  updateVehicleRequests(vr_id, vrs) {
    return api.post(VEHICLE_REQUEST_MASTER_BASE_URL + '/' + vr_id, vrs)
  }

  deleteVehicleRequest(vr_id) {
    return api.delete(VEHICLE_REQUEST_MASTER_BASE_URL + '/' + vr_id)
  }

  cancelVehicleRequest(value) {
    return api.post(VEHICLE_REQUEST_CANCEL_URL, value)
  }

  /* Get All VR Data From DB for Report */
  getVRDataForReport() {
    return api.get(VEHICLE_REQUEST_REPORT_VIEW_URL)
  }

  sentVRDataForReport(data) {
    return api.post(VEHICLE_REQUEST_REPORT_SENT_URL, data)
  }
}

export default new VehicleRequestMasterService()
