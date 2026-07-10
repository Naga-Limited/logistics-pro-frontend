import AppConfig from 'src/AppConfig'
import api from 'src/Service/Config'

const IFOODS_TSCREATION_BASE_URL = AppConfig.api.baseUrl + '/Ifoods/TSCreation'
const IFOODS_TSINFO_BASE_URL = AppConfig.api.baseUrl + '/Ifoods/TSInfo'
const TRIPSHEET_REPORT_URL = AppConfig.api.baseUrl+ '/Ifoods/tripsheet_register'
const IFOODS_TRIPSHEET_URL_UPDATE = AppConfig.api.baseUrl + '/Ifoods/tripsheet_edit_update'
const IFOODS_TRIPSHEET_CANCEL_URL_UPDATE = AppConfig.api.baseUrl + '/Ifoods/tripsheet_cancel'
const IFOODS_TRIPSHEET_EDIT_GET_ID = AppConfig.api.baseUrl + '/Ifoods/trip_edit_show_report_data/'

class IfoodsTSCreationService {

  getVehicleReadyToTripsheetCreation() {
    return api.get(IFOODS_TSCREATION_BASE_URL)
  }

  getSingleVehicleInfoOnGate(parkingYardID) {
    return api.get(IFOODS_TSCREATION_BASE_URL + '/VehicleInfo/' + parkingYardID)
  }
  getSingleVehicleInfoTrip(id) {
    return api.get(IFOODS_TSINFO_BASE_URL + id)
  }

  handleTripsheetCreationAction(data) {
    return api.post(IFOODS_TSCREATION_BASE_URL, data)
  }

  TripsheetReport(data){
    return api.post(TRIPSHEET_REPORT_URL,data)
  }

  singleTripDetailsList(id) {
    return api.get(TRIPSHEET_REPORT_URL+ '/'+id)
  }
  updateTripSheet(id,data) {
    return api.post(IFOODS_TRIPSHEET_URL_UPDATE + '/' + id, data)
  }

  getTripsheetInfoById(id) {
    return api.get(IFOODS_TRIPSHEET_EDIT_GET_ID + id)
  }

  tripSheet_cancel(id,data) {
    return api.post(IFOODS_TRIPSHEET_CANCEL_URL_UPDATE + '/' + id, data)
  }

}

export default new IfoodsTSCreationService()
