import AppConfig from 'src/AppConfig'
import api from 'src/Service/Config'

const IFOODS_GATEIN_BASE_URL = AppConfig.api.baseUrl + '/Ifoods/GateIn'
const PARKING_YRD_GATE_OUT_ACTION_URL = IFOODS_GATEIN_BASE_URL + '/action/gateOut/'
const PARKING_YRD_GET_ALL_TRUCK_DATA_URL = AppConfig.api.baseUrl + '/get-all-ifoodstrucks'
const IFOODS_VEHICLE_REPORT_SENT_URL = AppConfig.api.baseUrl + '/ifoodsVehicleReportRequest'
const TS_INFO_SHARE_TO_STOP_SAP = AppConfig.api.baseUrl + '/sap/IfoodsTSInfoStop'
const IFOODS_VEHICLE_API_BASE_OTP_URL = AppConfig.api.baseUrl + '/Ifoods/otpmsg-outlet'
class IfoodsGateInService {

  getParkingYardGateTrucks() {
    return api.get(IFOODS_GATEIN_BASE_URL)
  }

  getPygAllTruckData() {
    return api.get(PARKING_YRD_GET_ALL_TRUCK_DATA_URL)
  }

  handleParkingYardGateInAction(data) {
    return api.post(IFOODS_GATEIN_BASE_URL, data)
  }

  actionGateOut(PYGId) {
    return api.get(PARKING_YRD_GATE_OUT_ACTION_URL + PYGId)
  }

  sentVehicleDataForReport(data) {
    return api.post(IFOODS_VEHICLE_REPORT_SENT_URL, data)
  }
  /* Sent Tripsheet Info To Stop PP Process for Individual Tripsheet */
  StopTSInfoToSAP(data) {
    return api.post(TS_INFO_SHARE_TO_STOP_SAP, data)
  }
  otpmsgoutlet(data) {
    return api.post(IFOODS_VEHICLE_API_BASE_OTP_URL, data)
  }

}

export default new IfoodsGateInService()
