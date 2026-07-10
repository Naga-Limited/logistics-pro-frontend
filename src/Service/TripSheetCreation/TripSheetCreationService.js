import AppConfig from 'src/AppConfig'
import api from '../Config'

const TRIP_SHEET_BASE_URL = AppConfig.api.baseUrl + '/trip-sheet'
const TRIP_SHEET_UPDATE_BASE_URL = AppConfig.api.baseUrl + '/trip-sheet/'
const TRIP_SHEET_SHIPMENT_UPDATE_BASE_URL = AppConfig.api.baseUrl + '/trip-sheet/'
const TRIP_SHEET_NUMBER_FETCH_URL = AppConfig.api.baseUrl + '/get-ts-no'

const TRIPSHEET_EDIT_IN_REPORT = AppConfig.api.baseUrl + '/TripSheetEditIndex'
const TRIPSHEET_URL_UPDATE = AppConfig.api.baseUrl + '/tripsheet_edit_update'
const TRIPSHEET_EDIT_GET_ID = AppConfig.api.baseUrl + '/trip_edit_show_report_data/'
const TRIPSHEET_CANCEL_URL_UPDATE = AppConfig.api.baseUrl + '/tripsheet_cancel'
const TRIP_REQUEST_CANCEL_URL = AppConfig.api.baseUrl + '/trip_request_cancel'
const SAP_TRIP_REQUEST_UPDATE_URL = AppConfig.api.baseUrl + '/sap_trip_info_update_request'
const SAP_TRIP_REMARKS_REQUEST_UPDATE_URL = AppConfig.api.baseUrl + '/lp_trip_remarks_info_update_request'


class TripSheetCreationService {
  getVehicleReadyToTrip() {
    return api.get(TRIP_SHEET_UPDATE_BASE_URL + 'ready-to-trip')
  }

  getSingleVehicleInfoOnGate(parkingYardID) {
    return api.get(TRIP_SHEET_UPDATE_BASE_URL + 'ready-to-trip/vehicle-info/' + parkingYardID)
  }

  createTripSheet(data) {
    return api.post(TRIP_SHEET_BASE_URL, data)
  }

  deleteBank(BankId) {
    return api.delete(TRIP_SHEET_BASE_URL + '/' + BankId)
  }

  getOpenTripsheetDataByVehicleId(vehicleId) {
    return api.get(TRIP_SHEET_UPDATE_BASE_URL + 'ready-to-trip/open-ts-info/' + vehicleId)
  }

  getPPUnstoppedVehicleInfo(vehicleId) {
    return api.get(TRIP_SHEET_UPDATE_BASE_URL + 'ready-to-trip/pp-unstop-ts-info/' + vehicleId)
  }

  setPPFlagAsStop(tripsheet_no) {
    return api.get(TRIP_SHEET_UPDATE_BASE_URL + 'ready-to-trip/pp-stop-ts-info/' + tripsheet_no)
  }

/*Tripsheet Info to SAP */
  getSAPUnstoppedVehicleInfo(vehicleId) {
    return api.get(TRIP_SHEET_UPDATE_BASE_URL + 'ready-to-trip/sap-unstop-ts-info/' + vehicleId)
  }


  setSAPFlagAsStop(tripsheet_no,user_id) {
    // return api.get(TRIP_SHEET_UPDATE_BASE_URL + 'ready-to-trip/sap-stop-ts-info/' + tripsheet_no)
    return api.get(TRIP_SHEET_UPDATE_BASE_URL + 'ready-to-trip/sap-stop-ts-info/' + tripsheet_no+'||'+user_id)
  }
/*Tripsheet Info to SAP */
  getTripSheetNo(data) {
    return api.post(TRIP_SHEET_NUMBER_FETCH_URL, data)
  }

  /*Tripsheet Edit */
  getTripsheetVehiclesReport() {
    return api.get(TRIPSHEET_EDIT_IN_REPORT)
    }

    updateTripSheet(id,data) {
      return api.post(TRIPSHEET_URL_UPDATE + '/' + id, data)
    }

    getTripsheetInfoById(id) {
      return api.get(TRIPSHEET_EDIT_GET_ID + id)
    }

    tripSheet_cancel(id,data) {
      return api.post(TRIPSHEET_CANCEL_URL_UPDATE + '/' + id, data)
    }

  /* Get Tripsheet data for shipment updation from lp */
  getTripsheetInfoByTripsheetNo(tripsheet_no) {
    return api.get(TRIP_SHEET_SHIPMENT_UPDATE_BASE_URL + 'ready-to-trip/tripsheet-info/' + tripsheet_no)
  }

  /* Get FCI Tripsheet data for Smartform Print in LP */
  getFCITripsheetInfoByTripsheetNo(tripsheet_no) {
    return api.get(TRIP_SHEET_SHIPMENT_UPDATE_BASE_URL + 'ready-to-trip/fci-tripsheet-info/' + tripsheet_no)
  }

  /* Get RAKE Tripsheet data for Smartform Print in LP */
  getRAKETripsheetInfoByTripsheetNo(tripsheet_no) {
    return api.get(TRIP_SHEET_SHIPMENT_UPDATE_BASE_URL + 'ready-to-trip/rake-tripsheet-info/' + tripsheet_no)
  }

  /* Get All Tripsheet data for shipment updation from lp */
  getAllTripsheetInfoByTripsheetNo(tripsheet_no) {
    return api.get(TRIP_SHEET_SHIPMENT_UPDATE_BASE_URL + 'ready-to-trip/all-tripsheet-info/' + tripsheet_no)
  }

  /* Trip Cancel Before Tripsheet Creation */
  cancelTripRequest(value) {
    return api.post(TRIP_REQUEST_CANCEL_URL, value)
  }

  /* Trip SAP FLAG Update */
  updateSAPTripFlagRequest(value) {
    return api.post(SAP_TRIP_REQUEST_UPDATE_URL, value)
  }

  /* Trip Remarks Update */
  updateTripRemarksRequest(value) {
    return api.post(SAP_TRIP_REMARKS_REQUEST_UPDATE_URL, value)
  }
}

export default new TripSheetCreationService()
