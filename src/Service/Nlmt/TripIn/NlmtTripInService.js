import AppConfig from 'src/AppConfig'
import api from 'src/Service/Config'

const NLMT_TRIPIN_BASE_URL = AppConfig.api.baseUrl + '/Nlmt/TripIn'
const PARKING_YRD_GATE_IN_ACTION_URL = AppConfig.api.baseUrl + '/Nlmt/action/tripIn/'
const PARKING_YRD_GATE_OUT_ACTION_URL = AppConfig.api.baseUrl + '/Nlmt/action/tripOut/'
const NLMT_VEHICLE_REPORT_SENT_URL = AppConfig.api.baseUrl + '/nlmtVehicleReportRequest'
const NLMT_TRIPIN_OPEN_TRUCK_BASE_URL = AppConfig.api.baseUrl + '/get-nlmt-open-trucks'
const DRIVERS_LIST_URL = AppConfig.api.baseUrl + '/nlmt-drivers/'

const AVAIABLE_DRIVERS_LIST_URL = AppConfig.api.baseUrl + '/nlmt-activeDrivers'
const NLMT_TRIP_IN_DISTINCT_VEHICLES_FETCH_URL = AppConfig.api.baseUrl + '/nlmt-TripIn-Distinct-Vehicles-Info/'
const NLMT_TRIP_IN_VEHICLES_LIST_URL = AppConfig.api.baseUrl + '/nlmt_tripin_vehicles_ot/'

class NlmtTripInService {

  getTripInTrucks() {
    return api.get(NLMT_TRIPIN_BASE_URL)
  }

  getTripInAllTruckData() {
    return api.get(TRIP_IN_GET_ALL_TRUCK_DATA_URL)
  }

  handleTripInAction(data) {
    return api.post(NLMT_TRIPIN_BASE_URL, data)
  }

  actionTripOut(PYGId) {
    return api.get(NLMT_TRIP_OUT_ACTION_URL + PYGId)
  }

  sentNlmtVehicleDataForReport(data) {
    return api.post(NLMT_VEHICLE_REPORT_SENT_URL, data)
  }
  getTripInOpenTrucks(vehicleId) {
    return api.get(NLMT_TRIPIN_OPEN_TRUCK_BASE_URL + '/' + vehicleId)
  }
  getDriverInfoById(id) {
    return api.get(DRIVERS_LIST_URL + id)
  }
  actionWaitingOutsideToTripIn(vehicleRowId) {
    return api.put(NLMT_TRIP_IN_ACTION_URL + vehicleRowId)
  }

  actionTripOut(vehicleRowId) {
    return api.put(NLMT_TRIP_OUT_ACTION_URL + vehicleRowId)
  }

  getNlmtTripInDistinctVehiclesData() {
    return api.get(NLMT_TRIP_IN_DISTINCT_VEHICLES_FETCH_URL)
  }

  getNlmtOpenTripsheetInfoByVId(id) {
    return api.get(NLMT_TRIP_IN_VEHICLES_LIST_URL + id)
  }
}

export default new NlmtTripInService()
