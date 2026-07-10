import AppConfig from 'src/AppConfig'
import api from 'src/Service/Config'

const DEPO_TSCREATION_BASE_URL = AppConfig.api.baseUrl + '/Depo/TSCreation'
const TRIPSHEET_REPORT_URL = AppConfig.api.baseUrl+ '/Depo/tripsheet_register' 

class DepoTSCreationService {

  getVehicleReadyToTripsheetCreation() {
    return api.get(DEPO_TSCREATION_BASE_URL)
  }

  getSingleVehicleInfoOnGate(parkingYardID) {
    return api.get(DEPO_TSCREATION_BASE_URL + '/VehicleInfo/' + parkingYardID)
  }

  handleTripsheetCreationAction(data) {
    return api.post(DEPO_TSCREATION_BASE_URL, data)
  }

  TripsheetReport(data){
    return api.post(TRIPSHEET_REPORT_URL,data)
  }

  singleTripDetailsList(id) {
    return api.get(TRIPSHEET_REPORT_URL+ '/'+id)
  }

  /* Get Tripsheet data for shipment updation from lp */
  getTripsheetInfoByTripsheetNo(tripsheet_no) {
    return api.get(DEPO_TSCREATION_BASE_URL + '/tripsheet-info/' + tripsheet_no)
  }

}

export default new DepoTSCreationService()
