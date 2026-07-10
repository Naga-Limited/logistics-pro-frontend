import AppConfig from 'src/AppConfig'
import api from 'src/Service/Config'

const NLMT_TSCREATION_BASE_URL = AppConfig.api.baseUrl + '/Nlmt/TSCreation'
const TRIPSHEET_REPORT_URL = AppConfig.api.baseUrl+ '/Nlmt/tripsheet_register'
const NLMT_TRIPSHEET_GET_ID = AppConfig.api.baseUrl + '/Nlmt/trip_show_report_data/'
const NLMT_TRIPSHEET_EDIT_IN_REPORT = AppConfig.api.baseUrl + '/NlmtTripSheetEditIndex'
const NLMT_TRIPSHEET_CANCEL_URL_UPDATE = AppConfig.api.baseUrl + '/NlmtTripsheet_cancel'
const NLMT_TRIP_INFO_CANCEL_REPORT = AppConfig.api.baseUrl + '/NlmtTripInfoCancelIndex'
const NLMT_TRIP_INFO_CANCEL_URL_UPDATE = AppConfig.api.baseUrl + '/NlmtTripInfo_cancel'

const NLMT_TRIP_SHEET_INFO_FETCH_BASE_URL = AppConfig.api.baseUrl + '/NlmtTripsheet/Fetch-Trip-Info/'

class NlmtTSCreationService {

  getVehicleReadyToTripsheetCreation() {
    return api.get(NLMT_TSCREATION_BASE_URL)
  }

  getSingleVehicleInfoOnTripIn(tripInID) {
    return api.get(NLMT_TSCREATION_BASE_URL + '/VehicleInfo/' + tripInID)
  }

  handleTripsheetCreationAction(data) {
    return api.post(NLMT_TSCREATION_BASE_URL, data)
  }

  TripsheetReport(data){
    return api.post(TRIPSHEET_REPORT_URL,data)
  }

  singleTripDetailsList(id) {
    return api.get(TRIPSHEET_REPORT_URL+ '/'+id)
  }

  /* Get Tripsheet data for shipment updation from lp */
  getTripsheetInfoByTripsheetNo(tripsheet_no) {
    return api.get(NLMT_TSCREATION_BASE_URL + '/tripsheet-info/' + tripsheet_no)
  }

  getTripsheetInfoById(id) {
    return api.get(NLMT_TRIPSHEET_GET_ID + id)
  }

  /*Tripsheet Edit */
  getNlmtTripsheetVehiclesReport() {
    return api.get(NLMT_TRIPSHEET_EDIT_IN_REPORT)
  }

  tripSheet_cancel(id,data) {
    return api.post(NLMT_TRIPSHEET_CANCEL_URL_UPDATE + '/' + id, data)
  }

  /*Trip Info Cancel */
  getNlmtTripInfoCancelReport() {
    return api.get(NLMT_TRIP_INFO_CANCEL_REPORT)
  }

  tripInfo_cancel(id,data) {
    return api.post(NLMT_TRIP_INFO_CANCEL_URL_UPDATE + '/' + id, data)
  }

  /* Get All Tripsheet data for Tripsheet Search from lp */
  getAllTripsheetInfoByTripsheetNo(tripsheet_no) {
    return api.get(NLMT_TRIP_SHEET_INFO_FETCH_BASE_URL + tripsheet_no)
  }

}

export default new NlmtTSCreationService()
