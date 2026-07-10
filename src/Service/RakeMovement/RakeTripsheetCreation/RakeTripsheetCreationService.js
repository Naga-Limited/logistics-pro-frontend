import AppConfig from 'src/AppConfig'
import api from 'src/Service/Config'

const RAKE_TRIPSHEET_CREATION_BASE_URL = AppConfig.api.baseUrl + '/Rake/Tripsheet/'
const RAKE_TRIPSHEET_CREATION_POST_URL = AppConfig.api.baseUrl + '/Rake/Tripsheet'
const RAKE_TRIPSHEET_UPDATION_BASE_URL = AppConfig.api.baseUrl + '/Rake/Tripsheet-Update'
const RAKE_TRIP_SHEET_NUMBER_FETCH_URL = RAKE_TRIPSHEET_CREATION_BASE_URL + 'get-ts-no/'
const RAKE_TRIPSHEET_BY_FNR_VIEW_URL = AppConfig.api.baseUrl + '/RakeTripsheet/ts-no-by-fnr'

const RAKE_TRIPSHEET_REPORT_VIEW_URL = AppConfig.api.baseUrl + '/rakeTripsheetReportView'
const RAKE_TRIPSHEET_REPORT_SENT_URL = AppConfig.api.baseUrl + '/rakeTripsheetReportRequest'

const RAKE_MIGO_REPORT_VIEW_URL = AppConfig.api.baseUrl + '/rakeMigoReportView'
const RAKE_MIGO_REPORT_SENT_URL = AppConfig.api.baseUrl + '/rakeMigoReportRequest'

const RAKE_TRIPSHEET_BEFORE_CHECK_URL = AppConfig.api.baseUrl + '/Rake/rakeTripsheetBeforeCheck/'

const RAKE_VENDOR_PAYMENT_REPORT_VIEW_URL = AppConfig.api.baseUrl + '/rakeVendorPaymentReferenceReportView'
const RAKE_VENDOR_PAYMENT_REPORT_SENT_URL = AppConfig.api.baseUrl + '/rakeVendorPaymentReferenceReportRequest'

const RAKE_FNR_REPORT_VIEW_URL = AppConfig.api.baseUrl + '/rakeFNRReportView'
const RAKE_FNR_REPORT_SENT_URL = AppConfig.api.baseUrl + '/rakeFNRReportRequest'

const RAKE_TRIPSHEET_EDIT_SEARCH_FILTER_URL = AppConfig.api.baseUrl + '/Rake/RakeTripsheetEditSearchFilterRequest'

class RakeTripsheetCreationService {

  getRakeTripSheetNo(code) {
    return api.get(RAKE_TRIP_SHEET_NUMBER_FETCH_URL+code)
  }

  /* Tripsheet Creation Process */
  createTripsheet(data) {
    return api.post(RAKE_TRIPSHEET_CREATION_POST_URL, data)
  }

  getVehicleReadyToTripsheetEdit() {
    return api.get(RAKE_TRIPSHEET_CREATION_BASE_URL)
  }

  getVehicleReadyToTripsheetEditFilterSearch(data) {
    return api.post(RAKE_TRIPSHEET_EDIT_SEARCH_FILTER_URL, data)
  }

  getTripeInfoById(id) {
    return api.get(RAKE_TRIPSHEET_CREATION_BASE_URL + id)
  }

  /* Tripsheet Updation Process */
  updateTripsheet(data) {
    return api.post(RAKE_TRIPSHEET_UPDATION_BASE_URL, data)
  }

  /* Get All Tripsheets by FNR From DB for Report */
  getTripsheetDatabyFNRGrouping() {
    return api.get(RAKE_TRIPSHEET_BY_FNR_VIEW_URL)
  }

  /* Get All Tripsheets From DB for Report */
  getTripsheetDataForReport() {
    return api.get(RAKE_TRIPSHEET_REPORT_VIEW_URL)
  }

  /* Get All Tripsheets From DB for Report */
  sentTripsheetDataForReport(data) {
    return api.post(RAKE_TRIPSHEET_REPORT_SENT_URL, data)
  }

  /* Get All Migo Details From DB for Report */
  getMigoDataForReport() {
    return api.get(RAKE_MIGO_REPORT_VIEW_URL)
  }

  /* Get All Migo Details From DB for Report */
  sentMigoDataForReport(data) {
    return api.post(RAKE_MIGO_REPORT_SENT_URL, data)
  }  

  /* Get All FNR - Details From DB for Report */
  getFNRDataForReport() {
    return api.get(RAKE_FNR_REPORT_VIEW_URL)
  }

  /* Get All FNR - Migo Details From DB for Report */
  sentFNRDataForReport(data) {
    return api.post(RAKE_FNR_REPORT_SENT_URL, data)
  }

  /* Duplicate data Check for Single BDC Upload */
  checkDuplicateDataForFnrVehNo(fnr_number,veh_no) {
    return api.post(RAKE_TRIPSHEET_BEFORE_CHECK_URL + fnr_number+'||'+veh_no)
  }

  /* Get All Vendor Payment Details From DB for Report */
  getVendorPaymentDataForReport() {
    return api.get(RAKE_VENDOR_PAYMENT_REPORT_VIEW_URL)
  }

  /* Get All Vendor Payment Details From DB for Report */
  sentVendorPaymentDataForReport(data) {
    return api.post(RAKE_VENDOR_PAYMENT_REPORT_SENT_URL,data)
  }

}

export default new RakeTripsheetCreationService()
