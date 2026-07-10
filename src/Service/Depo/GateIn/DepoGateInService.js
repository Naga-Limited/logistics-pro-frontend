import AppConfig from 'src/AppConfig'
import api from 'src/Service/Config'

const DEPO_GATEIN_BASE_URL = AppConfig.api.baseUrl + '/Depo/GateIn'
const PARKING_YRD_GATE_OUT_ACTION_URL = DEPO_GATEIN_BASE_URL + '/action/gateOut/'
const PARKING_YRD_GET_ALL_TRUCK_DATA_URL = AppConfig.api.baseUrl + '/get-all-trucks'
const DEPO_VEHICLE_REPORT_SENT_URL = AppConfig.api.baseUrl + '/depoVehicleReportRequest'

class DepoGateInService {

  getParkingYardGateTrucks() {
    return api.get(DEPO_GATEIN_BASE_URL)
  }

  getPygAllTruckData() {
    return api.get(PARKING_YRD_GET_ALL_TRUCK_DATA_URL)
  }

  handleParkingYardGateInAction(data) {
    return api.post(DEPO_GATEIN_BASE_URL, data)
  }

  actionGateOut(PYGId) {
    return api.get(PARKING_YRD_GATE_OUT_ACTION_URL + PYGId)
  }

  sentVehicleDataForReport(data) {
    return api.post(DEPO_VEHICLE_REPORT_SENT_URL, data)
  }

}

export default new DepoGateInService()
