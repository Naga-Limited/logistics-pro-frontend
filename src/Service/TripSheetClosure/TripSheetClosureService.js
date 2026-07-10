import AppConfig from 'src/AppConfig'
import api, { api_copy } from '../Config'

const TRIP_SHEET_CLOSURE_BASE_URL = AppConfig.api.baseUrl + '/trip-sheet-closure/'
const TRIP_SHEET_CLOSURE_POST_URL = AppConfig.api.baseUrl + '/trip-sheet-closure'
const TRIP_SHEET_INCOME_CLOSURE_BASE_URL = AppConfig.api.baseUrl + '/trip-sheet-income-closure/'
const TRIP_SHEET_SETTLEMENT_BASE_URL = AppConfig.api.baseUrl + '/trip-sheet-settlement/'
const TRIP_SHEET_CLOSURE_INFO_GET_URL = AppConfig.api.baseUrl + '/get-trip-sheet-closure-info/'
const TRIP_SHEET_STO_INFO_GET_URL = AppConfig.api.baseUrl + '/get-trip-sto-info/'
const TRIP_SHEET_INCOME_CLOSURE_REJECT_URL = AppConfig.api.baseUrl + '/put-trip-income-reject'
const TRIP_SHEET_INCOME_CLOSURE_ACCEPT_URL = AppConfig.api.baseUrl + '/put-trip-income-accept'
const TRIP_SHEET_SETTLEMENT_CLOSURE_ACCEPT_URL =
  AppConfig.api.baseUrl + '/put-trip-settlement-accept'
const TRIP_SHEET_SETTLEMENT_CLOSURE_REJECT_URL =
  AppConfig.api.baseUrl + '/put-trip-settlement-reject'
  const TRIP_SHEET_SETTLEMENT_CLOSURE_UPDATE_URL =
  AppConfig.api.baseUrl + '/put-trip-settlement-update'

const TS_CLOSURE_REPORT_VIEW_URL =  AppConfig.api.baseUrl + '/closureReportView'
const TS_CLOSURE_REPORT_SENT_URL =  AppConfig.api.baseUrl + '/closureReportRequest'

const TS_SETTLEMENT_REPORT_VIEW_URL =  AppConfig.api.baseUrl + '/settlementReportView'
const TS_SETTLEMENT_REPORT_SENT_URL =  AppConfig.api.baseUrl + '/settlementReportRequest'

const TS_HIRE_DEDUCTION_VIEW_URL =  AppConfig.api.baseUrl + '/tripHireDeductiondata/'
const TS_HIRE_PAYMENT_VIEW_URL =  AppConfig.api.baseUrl + '/tripHirePaymentdata/'
const TRIP_SHEET_DEDUCTION_POST_URL = AppConfig.api.baseUrl + '/trip-sheet-deduction'
const TRIP_SHEET_PAYMENT_POST_URL = AppConfig.api.baseUrl + '/trip-sheet-payment'
const DEDUCTION_PAYMENT_REPORT_VIEW_URL = AppConfig.api.baseUrl + '/paymentReportView'
const DEDUCTION_PAYMENT_REPORT_SENT_URL = AppConfig.api.baseUrl + '/paymentReportRequest'

const TS_INFO_FETCH_VIA_SHIPMENT_VIEW_URL =  AppConfig.api.baseUrl + '/tripShipmentTrackdata/'
const TRIP_SHEET_CLOSURE_SEARCH_FILTER_URL = AppConfig.api.baseUrl + '/expenseClosureSearchFilterRequest'

class TripSheetClosureService {
  /* Laravel Controller Index Function Call for Expense Capture */
  getVehicleReadyToTripClose() {
    return api.get(TRIP_SHEET_CLOSURE_BASE_URL)
  }

  getVehicleReadyToTripCloseFilterSearch(data) {
    return api.post(TRIP_SHEET_CLOSURE_SEARCH_FILTER_URL, data)
  }

  /* Laravel Controller Custom Index Function Call for Income Capture */
  getVehicleReadyToTripIncomeClose() {
    return api.get(TRIP_SHEET_INCOME_CLOSURE_BASE_URL)
  }

  /* Laravel Controller Custom Index Function Call for Income Capture */
  getVehicleReadyToTripSettlement() {
    return api.get(TRIP_SHEET_SETTLEMENT_BASE_URL)
  }

  /* Laravel Controller Store Function Call for Expense Capture Save */
  createTripsheetSettlement(value) {
    return api_copy.post(TRIP_SHEET_CLOSURE_POST_URL, value)
  }

  /* Laravel Controller update Function Call for Expense Capture update */
  updateTripsheetSettlement(id, value) {
    return api_copy.post(TRIP_SHEET_CLOSURE_POST_URL + '/' + id, value)
  }

  /* Laravel Controller Custom Index Function Call for Fetch Vehicle Info Data */
  getVehicleInfoById(id) {
    return api.get(TRIP_SHEET_CLOSURE_BASE_URL + id)
  }

  /* Laravel Controller Custom Index Function Call for Fetch Trip Settlement Info Data */
  getTripSettlementInfoByParkingId(id) {
    return api.get(TRIP_SHEET_CLOSURE_INFO_GET_URL + id)
  }

  /* Laravel Controller Custom Index Function Call for Fetch Trip STO Info Data */
  getTripStoInfoByParkingId(id) {
    return api.get(TRIP_SHEET_STO_INFO_GET_URL + id)
  }

  /* Laravel Controller Custom Index Function Call for Reject Trip Income Closure */
  updateIncomeClosureRejection(id, data) {
    return api.post(TRIP_SHEET_INCOME_CLOSURE_REJECT_URL + '/' + id, data)
  }

  /* Laravel Controller Custom Index Function Call for Accept Trip Income Closure */
  updateIncomeClosureAcception(id, data) {
    return api.post(TRIP_SHEET_INCOME_CLOSURE_ACCEPT_URL + '/' + id, data)
  }

  /* Laravel Controller Custom Index Function Call for Accept Trip Settlement Closure */
  updateSettlementClosureAcception(id, data) {
    return api.post(TRIP_SHEET_SETTLEMENT_CLOSURE_ACCEPT_URL + '/' + id, data)
  }

  /* Laravel Controller Custom Index Function Call for Accept Trip Settlement Closure */
  settlementClosureUpdation(id, data) {
    return api.post(TRIP_SHEET_SETTLEMENT_CLOSURE_UPDATE_URL + '/' + id, data)
  }

  /* Laravel Controller Custom Index Function Call for Reject Trip Settlement Closure */
  updateSettlementClosureRejection(id, data) {
    return api.post(TRIP_SHEET_SETTLEMENT_CLOSURE_REJECT_URL + '/' + id, data)
  }

   /* Get All Closure Data From DB for Report */
   getClosureDataForReport() {
    return api.get(TS_CLOSURE_REPORT_VIEW_URL)
  }

  /* Get All Closure Data From DB for Report */
  sentClosureDataForReport(data) {
    return api.post(TS_CLOSURE_REPORT_SENT_URL, data)
  }

  /* Get All Settlement Data From DB for Report */
  getSettlementDataForReport() {
    return api.get(TS_SETTLEMENT_REPORT_VIEW_URL)
  }

  /* Get All Settlement Data From DB for Report */
  sentSettlementDataForReport(data) {
    return api.post(TS_SETTLEMENT_REPORT_SENT_URL, data)
  }

  /* Laravel Controller Custom Index Function Call for Fetch Trip Settlement Deduction Info Data */
  getTripSettlementDeductionInfoByTripsheetNo(trip_no) {
    return api.get(TS_HIRE_DEDUCTION_VIEW_URL + trip_no)
  }

  /* Laravel Controller Custom Index Function Call for Fetch Trip Settlement Payment Info Data */
  getTripSettlementPaymentInfoByTripsheetNo(trip_no) {
    return api.get(TS_HIRE_PAYMENT_VIEW_URL + trip_no)
  }

  /* Laravel Controller Custom Index Function Call for Fetch Trip Shipment Info Data */
  getTripInfoByShipmentNo(ship_no) {
    return api.get(TS_INFO_FETCH_VIA_SHIPMENT_VIEW_URL + ship_no)
  }

  /* Laravel Controller Store Function Call for Hire Deduction Save */
  createHireTripsheetDeduction(value) {
    return api.post(TRIP_SHEET_DEDUCTION_POST_URL, value)
  }

  /* Laravel Controller Store Function Call for Hire Deduction Save */
  updateHireTripsheetPayment(value) {
    return api.post(TRIP_SHEET_PAYMENT_POST_URL, value)
  }

   /* Get All Deduction & Payments Entries From DB for Report */
   getPaymentDataForReport() {
    return api.get(DEDUCTION_PAYMENT_REPORT_VIEW_URL)
  }

  /* Get Selected Deduction & Payments Entries From DB for Report */
  sentPaymentDataForReport(data) {
    return api.post(DEDUCTION_PAYMENT_REPORT_SENT_URL, data)
  }

}

export default new TripSheetClosureService()
