import AppConfig from 'src/AppConfig'
import api, { api_copy } from 'src/Service/Config'

const TRIP_SHEET_CLOSURE_BASE_URL = AppConfig.api.baseUrl + '/nlmt-trip-sheet-closure/'
const TRIP_SHEET_CLOSURE_APPROVAL_BASE_URL = AppConfig.api.baseUrl + '/nlmt-trip-sheet-closure-approval/'
const TRIP_SHEET_CLOSURE_APPROVAL2_BASE_URL = AppConfig.api.baseUrl + '/nlmt-trip-sheet-closure-approval2/'
const OWN_TRIP_SHEET_CLOSURE_APPROVAL_BASE_URL = AppConfig.api.baseUrl + '/nlmt-own-trip-sheet-closure-approval/'
const TRIP_SHEET_CLOSURE_POST_URL = AppConfig.api.baseUrl + '/nlmt-trip-sheet-closure'
const TRIP_SHEET_CLOSURE_APPROVAL_POST_URL = AppConfig.api.baseUrl + '/nlmt-trip-closure-approval'
const TRIP_SHEET_INCOME_CLOSURE_BASE_URL =
  AppConfig.api.baseUrl + '/nlmt-trip-sheet-income-closure/'
  const TRIP_SHEET_INCOME_CLOSURE_APPROVAL_BASE_URL =
  AppConfig.api.baseUrl + '/nlmt-trip-sheet-income-closure-approval/'
const TRIP_SHEET_SETTLEMENT_BASE_URL = AppConfig.api.baseUrl + '/nlmt-trip-sheet-settlement/'
const TRIP_SHEET_CLOSURE_INFO_GET_URL = AppConfig.api.baseUrl + '/get-nlmt-trip-sheet-closure-info/'
const TRIP_SHEET_STO_INFO_GET_URL = AppConfig.api.baseUrl + '/get-nlmt-trip-sto-info/'
const TRIP_SHEET_INCOME_CLOSURE_REJECT_URL = AppConfig.api.baseUrl + '/put-nlmt-trip-income-reject'
const TRIP_SHEET_INCOME_CLOSURE_ACCEPT_URL = AppConfig.api.baseUrl + '/put-nlmt-trip-income-accept'
const TRIP_SHEET_INCOME_CLOSURE_APPROVAL_ACCEPT_URL = AppConfig.api.baseUrl + '/put-nlmt-trip-income-approval-accept'
const TRIP_SHEET_SETTLEMENT_CLOSURE_ACCEPT_URL =
  AppConfig.api.baseUrl + '/put-nlmt-trip-settlement-accept'
const TRIP_SHEET_SETTLEMENT_CLOSURE_REJECT_URL =
  AppConfig.api.baseUrl + '/put-nlmt-trip-settlement-reject'
const TRIP_SHEET_SETTLEMENT_CLOSURE_UPDATE_URL =
  AppConfig.api.baseUrl + '/put-nlmt-trip-settlement-update'

const TS_CLOSURE_REPORT_VIEW_URL = AppConfig.api.baseUrl + '/nlmt-closureReportView'
const TS_CLOSURE_REPORT_SENT_URL = AppConfig.api.baseUrl + '/nlmt-closureReportRequest'

const TS_SETTLEMENT_REPORT_VIEW_URL = AppConfig.api.baseUrl + '/nlmt-settlementReportView'
const TS_SETTLEMENT_REPORT_SENT_URL = AppConfig.api.baseUrl + '/nlmt-settlementReportRequest'

const TS_HIRE_DEDUCTION_VIEW_URL = AppConfig.api.baseUrl + '/nlmt-tripHireDeductiondata/'
const TS_HIRE_PAYMENT_VIEW_URL = AppConfig.api.baseUrl + '/nlmt-tripHirePaymentdata/'
const TRIP_SHEET_DEDUCTION_POST_URL = AppConfig.api.baseUrl + '/nlmt-trip-sheet-deduction'
const TRIP_SHEET_PAYMENT_POST_URL = AppConfig.api.baseUrl + '/nlmt-trip-sheet-payment'
const DEDUCTION_PAYMENT_REPORT_VIEW_URL = AppConfig.api.baseUrl + '/nlmt-paymentReportView'
const DEDUCTION_PAYMENT_REPORT_SENT_URL = AppConfig.api.baseUrl + '/nlmt-paymentReportRequest'

const TS_INFO_FETCH_VIA_SHIPMENT_VIEW_URL = AppConfig.api.baseUrl + '/nlmt-tripShipmentTrackdata/'
const TRIP_SHEET_CLOSURE_SEARCH_FILTER_URL =
  AppConfig.api.baseUrl + '/nlmt-expenseClosureSearchFilterRequest'
const TRIP_SHEET_SETTLEMENT_CLOSURE_FILTER_REQUEST_BASE_URL =
  AppConfig.api.baseUrl + '/Nlmt/SettlementClosure/paymentSubmissionFilterRequest'

const NLMT_TRIP_SHEET_CLOSURE_INFO_GET_URL = AppConfig.api.baseUrl + '/Nlmt/GetClosureInfo/'
const NLMT_TRIP_SHEET_CLOSURE_INFO_COPY_GET_URL = AppConfig.api.baseUrl + '/Nlmt/GetClosureInfo1/'
const NLMT_TRIP_SHEET_PAYMENT_SUBMISSION_REQUEST_BASE_URL =
  AppConfig.api.baseUrl + '/Nlmt/PaymentSubmission/paymentSubmissionRequest'

const NLMT_TRIP_SHEET_SETTLEMENT_VALIDATION_BASE_URL =
  AppConfig.api.baseUrl + '/Nlmt/SettlementValidation/'
const NLMT_TRIP_SHEET_SETTLEMENT_APPROVAL_BASE_URL =
  AppConfig.api.baseUrl + '/Nlmt/SettlementApproval/'
const NLMT_TRIP_SHEET_REJECT_PAYMENT_VALIDATION_REQUEST_BASE_URL =
  AppConfig.api.baseUrl + '/Nlmt/PaymentSubmission/paymentValidationReject'
const NLMT_TRIP_SHEET_PAYMENT_APPROVAL_REQUEST_BASE_URL =
  AppConfig.api.baseUrl + '/Nlmt/PaymentApproval/paymentApprovalRequest'
const NLMT_TRIPSHEET_SETTLEMENT_PAYMENT_INVOICE_POST_API_URL =
  AppConfig.api.baseUrl + '/sap/ts-nlmt-payment-invoice'
const NLMT_TRIPSHEET_SETTLEMENT_DRIVER_PAYMENT_INVOICE_POST_API_URL = AppConfig.api.baseUrl + '/sap/ts-nlmt-driver-payment-invoice'
const NLMT_TRIP_SHEET_SETTLEMENT_APPROVAL_INFO_GET_URL =
  AppConfig.api.baseUrl + '/Nlmt/GetSettlementClosureApprovalInfo/'
const NLMT_TRIP_PAYMENT_SUBMISSION_INFO_GET_URL =
  AppConfig.api.baseUrl + '/Nlmt/GetPaymentSubmissionInfo/'
const NLMT_TRIP_SHEET_SETTLEMENT_VALIDATION_INFO_GET_URL =
  AppConfig.api.baseUrl + '/Nlmt/GetSettlementClosureValidationInfo/'
const NLMT_TRIP_SHEET_PAYMENT_VALIDATION_REQUEST_BASE_URL =
  AppConfig.api.baseUrl + '/Nlmt/PaymentValidation/paymentValidationRequest'
const NLMT_TRIP_SHEET_REJECT_ALL_PAYMENT_REQUEST_BASE_URL =
  AppConfig.api.baseUrl + '/Nlmt/PaymentSubmission/paymentSubmissionAllTripReject'
const NLMT_TRIP_SHEET_DEDUCTION_PAYMENT_REQUEST_BASE_URL =
  AppConfig.api.baseUrl + '/sap/ts-nlmt-hire-deduction'
const NLMT_TRIP_SHEET_SAP_TDS_DATA_FETCH_REQUEST_URL = AppConfig.api.baseUrl + '/sap/ts-nlmt-tds-fetch-info'


const TRIP_SHEET_CLOSURE_EXPENSE_WITHOUT_DEDUCTION_POST_URL = AppConfig.api.baseUrl + '/nlmt-trip-sheet-closure-expense-without-deduction'
const NLMT_SAP_TRIP_STOP_FLAG_REQUEST_UPDATE_URL = AppConfig.api.baseUrl + '/nlmt_sap_trip_info_update_request'
const NLMT_TRIP_EXPENSE_SUBMISSION_DATA_FETCH_URL = AppConfig.api.baseUrl + '/nlmt-trip-sheet-hire-expense-submission/'

const NLMT_PAYMENT_SUBMISSION_URL = AppConfig.api.baseUrl + '/nlmt-payment-sequnce-no-generation'
const NLMT_PAYMENT_SN_GENERATION_FILTER_URL = AppConfig.api.baseUrl + '/nlmt-payment-sequnce-no-generation-filter'

const NLMT_MPS_PAYMENT_REPORT_VIEW_URL = AppConfig.api.baseUrl + '/Nlmt/NlmtPaymentReportView'
const NLMT_MPS_PAYMENT_REPORT_SENT_URL = AppConfig.api.baseUrl + '/Nlmt/NlmtPaymentReportRequest'

const NLMT_MPS_PAYMENT_APPROVAL_INFO_GET_URL =  AppConfig.api.baseUrl + '/Nlmt/GetNlmtSettlementClosureApprovalInfo/'
const NLMT_MPS_PAYMENT_SUBMISSION_INFO_GET_URL =  AppConfig.api.baseUrl + '/Nlmt/GetNlmtPaymentSubmissionInfo/'

const NLMT_TS_CLOSURE_REPORT_VIEW_URL = AppConfig.api.baseUrl + '/Nlmt/NlmtClosureReportView'
const NLMT_TS_CLOSURE_REPORT_SENT_URL = AppConfig.api.baseUrl + '/Nlmt/NlmtClosureReportRequest'
const NLMT_DEDUCTION_REJECTION_PROCESS_SENT_URL = AppConfig.api.baseUrl + '/Nlmt/NlmtDeductionRejectionProcess'
const NLMT_EXPENSE_APPROVAL_REJECTION_PROCESS_SENT_URL = AppConfig.api.baseUrl + '/Nlmt/NlmtExpenseApprovalRejectionProcess'
const NLMT_OWN_EXPENSE_APPROVAL_REJECTION_PROCESS_SENT_URL = AppConfig.api.baseUrl + '/Nlmt/NlmtOwnExpenseApprovalRejectionProcess'
const NLMT_OWN_INCOME_APPROVAL_REJECTION_PROCESS_SENT_URL = AppConfig.api.baseUrl + '/Nlmt/NlmtOwnIncomeApprovalRejectionProcess'

class NlmtTripSheetClosureService {

  /* Laravel Controller Index Function Call for Expense Capture */
  getVehicleReadyToTripClose() {
    return api.get(TRIP_SHEET_CLOSURE_BASE_URL)
  }

  getVehicleReadyToExpenseClosureApproval() { /* Deduction Approval Home */
    return api.get(TRIP_SHEET_CLOSURE_APPROVAL_BASE_URL)
  }

  getVehicleReadyToExpenseClosureApproval2() { /* Hire Expense Approval Home */
    return api.get(TRIP_SHEET_CLOSURE_APPROVAL2_BASE_URL)
  }

  getVehicleReadyToOwnExpenseClosureApproval() {  /* Own Expense Approval Home */
    return api.get(OWN_TRIP_SHEET_CLOSURE_APPROVAL_BASE_URL)
  }

  getVehicleReadyToTripCloseFilterSearch(data) {
    return api.post(TRIP_SHEET_CLOSURE_SEARCH_FILTER_URL, data)
  }

  /* Laravel Controller Custom Index Function Call for Income Capture */
  getVehicleReadyToTripIncomeClose() {
    return api.get(TRIP_SHEET_INCOME_CLOSURE_BASE_URL)
  }

  getVehicleReadyToTripIncomeCloseApproval() {
    return api.get(TRIP_SHEET_INCOME_CLOSURE_APPROVAL_BASE_URL)
  }

  /* Laravel Controller Custom Index Function Call for Income Capture */
  getVehicleReadyToTripSettlement() {
    return api.get(TRIP_SHEET_SETTLEMENT_BASE_URL)
  }

  /* Laravel Controller Store Function Call for Expense Capture Save */
  createTripsheetSettlement(value) {
    return api_copy.post(TRIP_SHEET_CLOSURE_POST_URL, value)
  }

  /* Laravel Controller Store Function Call for Expense Capture Save */
  createTripsheetSettlementForExpenseWitoutDeduction(value) {
    return api_copy.post(TRIP_SHEET_CLOSURE_EXPENSE_WITHOUT_DEDUCTION_POST_URL, value)
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

  updateIncomeClosureApprovalAcception(id, data) {
    return api.post(TRIP_SHEET_INCOME_CLOSURE_APPROVAL_ACCEPT_URL + '/' + id, data)
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

  updateTripsheetExpenseApproval(id, value) {
    return api_copy.put(TRIP_SHEET_CLOSURE_APPROVAL_POST_URL + '/' + id, value)
  }
  sentPaymentSubmissionDataForFilter(data) {
    return api.post(TRIP_SHEET_SETTLEMENT_CLOSURE_FILTER_REQUEST_BASE_URL, data)
  }
  getClosureInfoById(closure_id) {
    return api.get(NLMT_TRIP_SHEET_CLOSURE_INFO_GET_URL + closure_id)
  }

  /* Laravel Controller Custom Index Function Call for Fetch Vehicle Info Data */
  getClosureInfoById1(parking_id) {
    return api.get(NLMT_TRIP_SHEET_CLOSURE_INFO_COPY_GET_URL + parking_id)
  }
  storePaymentSubmission(data) {
    return api.post(NLMT_TRIP_SHEET_PAYMENT_SUBMISSION_REQUEST_BASE_URL, data)
  }
  getTripsReadyToSettlementValidation() {
    return api.get(NLMT_TRIP_SHEET_SETTLEMENT_VALIDATION_BASE_URL)
  }

  /* Get Tripsheets Data Waiting For Settlement Approval */
  getTripsReadyToSettlementApproval() {
    return api.get(NLMT_TRIP_SHEET_SETTLEMENT_APPROVAL_BASE_URL)
  }
  rejectPaymentValidation(data) {
    return api.post(NLMT_TRIP_SHEET_REJECT_PAYMENT_VALIDATION_REQUEST_BASE_URL, data)
  }
  getPaymentInfoById(payment_id) {
    return api.get(NLMT_TRIP_PAYMENT_SUBMISSION_INFO_GET_URL + payment_id)
  }
  getSettlementApprovalInfoById(payment_id) {
    return api.get(NLMT_TRIP_SHEET_SETTLEMENT_APPROVAL_INFO_GET_URL + payment_id)
  }
  NlmtPaymentInvoiceCreation(data) {
    return api.post(NLMT_TRIPSHEET_SETTLEMENT_PAYMENT_INVOICE_POST_API_URL, data)
  }
  NlmtDriverPaymentInvoiceCreation(data) {
    return api.post(NLMT_TRIPSHEET_SETTLEMENT_DRIVER_PAYMENT_INVOICE_POST_API_URL, data)
  }
  sendPaymentApproval(data) {
    return api.post(NLMT_TRIP_SHEET_PAYMENT_APPROVAL_REQUEST_BASE_URL, data)
  }
  getSettlementValidationInfoById(payment_id) {
    return api.get(NLMT_TRIP_SHEET_SETTLEMENT_VALIDATION_INFO_GET_URL + payment_id)
  }
  sendValidationApproval(data) {
    return api.post(NLMT_TRIP_SHEET_PAYMENT_VALIDATION_REQUEST_BASE_URL, data)
  }
  rejectAllTripPayment(data) {
    return api.post(NLMT_TRIP_SHEET_REJECT_ALL_PAYMENT_REQUEST_BASE_URL, data)
  }

  hireDeductionPayment(data) {
    return api.post(NLMT_TRIP_SHEET_DEDUCTION_PAYMENT_REQUEST_BASE_URL, data)
  }

  /* Trip SAP Stop FLAG Update */
  nlmtUpdateSAPTripStopFlagRequest(value) {
    return api.post(NLMT_SAP_TRIP_STOP_FLAG_REQUEST_UPDATE_URL, value)
  }

  getVehicleReadyToTripExpenseSubmission(){
    return api.get(NLMT_TRIP_EXPENSE_SUBMISSION_DATA_FETCH_URL)
  }

  tdsDataFetchFromSAP(data) {
    return api.post(NLMT_TRIP_SHEET_SAP_TDS_DATA_FETCH_REQUEST_URL, data)
  }

  /* Sent Trip DI info to DB */
  sentNLMTPaymentSubmissionData(data) {
    return api.post(NLMT_PAYMENT_SUBMISSION_URL, data)
  }

  filterNLMTVehicleReadyToPaymentSequenceNumberGeneration(data) {
    return api.post(NLMT_PAYMENT_SN_GENERATION_FILTER_URL, data)
  }

  /* Get All Payment Orders From DB for Report */
  getNlmtPaymentDataForReport() {
    return api.get(NLMT_MPS_PAYMENT_REPORT_VIEW_URL)
  }

  /* Get All Payment Orders From DB for Report */
  sentNlmtPaymentDataForReport(data) {
    return api.post(NLMT_MPS_PAYMENT_REPORT_SENT_URL, data)
  }

  /* Laravel Controller Custom Index Function Call for Fetch Tripsheets Data */
  getNlmtSettlementApprovalInfoById(payment_id) {
    return api.get(NLMT_MPS_PAYMENT_APPROVAL_INFO_GET_URL + payment_id)
  } 

  /* Laravel Controller Custom Index Function Call for Fetch Tripsheets Data */
  getNlmtPaymentInfoById(payment_id) {
    return api.get(NLMT_MPS_PAYMENT_SUBMISSION_INFO_GET_URL + payment_id)
  }

  /* Get All NLMT Closure Info From DB for Report */
  getNlmtClosureDataForReport() {
    return api.get(NLMT_TS_CLOSURE_REPORT_VIEW_URL)
  }

  /* Get All NLMT Closure Info From DB for Report */
  sentNlmtClosureDataForReport(data) {
    return api.post(NLMT_TS_CLOSURE_REPORT_SENT_URL, data)
  }
  
  deductionRejectionProcess(data) {
    return api.post(NLMT_DEDUCTION_REJECTION_PROCESS_SENT_URL, data)
  }

  expApprovalRejectionProcess(data) {
    return api.post(NLMT_EXPENSE_APPROVAL_REJECTION_PROCESS_SENT_URL, data)
  }

  ownExpApprovalRejectionProcess(data) {
    return api.post(NLMT_OWN_EXPENSE_APPROVAL_REJECTION_PROCESS_SENT_URL, data)
  }

  ownIncApprovalRejectionProcess(data) {
    return api.post(NLMT_OWN_INCOME_APPROVAL_REJECTION_PROCESS_SENT_URL, data)
  }

}

export default new NlmtTripSheetClosureService()
