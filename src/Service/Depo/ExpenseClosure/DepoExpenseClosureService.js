import AppConfig from 'src/AppConfig'
import api from 'src/Service/Config'

const DEPO_TRIP_SHEET_CLOSURE_BASE_URL = AppConfig.api.baseUrl + '/Depo/TSClosure'
const DEPO_TRIP_SHEET_EXPENSE_APPROVAL_BASE_URL = AppConfig.api.baseUrl + '/Depo/ExpenseApproval/'
const DEPO_TRIP_SHEET_SETTLEMENT_CLOSURE_BASE_URL = AppConfig.api.baseUrl + '/Depo/SettlementClosure/'
const DEPO_TRIP_SHEET_SETTLEMENT_CLOSURE_FILTER_REQUEST_BASE_URL = AppConfig.api.baseUrl + '/Depo/SettlementClosure/paymentSubmissionFilterRequest'
const DEPO_TRIP_SHEET_PAYMENT_SUBMISSION_REQUEST_BASE_URL = AppConfig.api.baseUrl + '/Depo/PaymentSubmission/paymentSubmissionRequest'
const DEPO_TRIP_SHEET_PAYMENT_VALIDATION_REQUEST_BASE_URL = AppConfig.api.baseUrl + '/Depo/PaymentValidation/paymentValidationRequest'
const DEPO_TRIP_SHEET_PAYMENT_APPROVAL_REQUEST_BASE_URL = AppConfig.api.baseUrl + '/Depo/PaymentApproval/paymentApprovalRequest'
const DEPO_TRIP_SHEET_REJECT_SINGLE_PAYMENT_REQUEST_BASE_URL = AppConfig.api.baseUrl + '/Depo/PaymentSubmission/paymentSubmissionSingleTripReject'
const DEPO_TRIP_SHEET_REJECT_ALL_PAYMENT_REQUEST_BASE_URL = AppConfig.api.baseUrl + '/Depo/PaymentSubmission/paymentSubmissionAllTripReject'
const DEPO_TRIP_SHEET_REJECT_PAYMENT_VALIDATION_REQUEST_BASE_URL = AppConfig.api.baseUrl + '/Depo/PaymentSubmission/paymentValidationReject'
const DEPO_TRIP_SHEET_SETTLEMENT_VALIDATION_BASE_URL = AppConfig.api.baseUrl + '/Depo/SettlementValidation/'
const DEPO_TRIP_SHEET_SETTLEMENT_APPROVAL_BASE_URL = AppConfig.api.baseUrl + '/Depo/SettlementApproval/'
const DEPO_TRIP_SHEET_CLOSURE_INFO_GET_URL =  AppConfig.api.baseUrl + '/Depo/GetClosureInfo/'
const DEPO_TRIP_SHEET_CLOSURE_INFO_COPY_GET_URL =  AppConfig.api.baseUrl + '/Depo/GetClosureInfo1/'
const DEPO_TRIP_SHEET_EXPENSE_APPROVAL_UPDATE_URL =  AppConfig.api.baseUrl + '/Depo/UpdateExpenseApproval'
const DEPO_TRIP_SHEET_SETTLEMENT_APPROVAL_INFO_GET_URL =  AppConfig.api.baseUrl + '/Depo/GetSettlementClosureApprovalInfo/'
const DEPO_TRIP_SHEET_SETTLEMENT_VALIDATION_INFO_GET_URL =  AppConfig.api.baseUrl + '/Depo/GetSettlementClosureValidationInfo/'
const DEPO_TRIP_PAYMENT_SUBMISSION_INFO_GET_URL =  AppConfig.api.baseUrl + '/Depo/GetPaymentSubmissionInfo/'
const DEPO_TRIPSHEET_SETTLEMENT_PAYMENT_INVOICE_POST_API_URL = AppConfig.api.baseUrl + '/sap/ts-depo-payment-invoice'
const DEPO_TRIPSHEET_SETTLEMENT_REPORT_VIEW_URL = AppConfig.api.baseUrl + '/Depo/DepoPaymentReportView'
const DEPO_TRIPSHEET_SETTLEMENT_REPORT_SENT_URL = AppConfig.api.baseUrl + '/Depo/DepoPaymentReportRequest'

class DepoExpenseClosureService {

  /* Laravel Controller Index Function Call for Expense Capture */
  getVehicleReadyToTripClose() {
    return api.get(DEPO_TRIP_SHEET_CLOSURE_BASE_URL)
  }

  /* Laravel Controller Custom Index Function Call for Fetch Vehicle Info Data */
  getTruckInfoById(id) {
    return api.get(DEPO_TRIP_SHEET_CLOSURE_BASE_URL + '/' + id)
  }

  /* Laravel Controller Custom Index Function Call for Fetch Vehicle Info Data */
  getClosureInfoById(closure_id) {
    return api.get(DEPO_TRIP_SHEET_CLOSURE_INFO_GET_URL + closure_id)
  }

  /* Laravel Controller Custom Index Function Call for Fetch Vehicle Info Data */
  getClosureInfoById1(parking_id) {
    return api.get(DEPO_TRIP_SHEET_CLOSURE_INFO_COPY_GET_URL + parking_id)
  }

  /* Laravel Controller Store Function Call for Expense Capture Save */
  createExpenseClosure(value) {
    return api.post(DEPO_TRIP_SHEET_CLOSURE_BASE_URL, value)
  }

  /* Update Expense Approval */
  updateExpenseApproval(value) {
    return api.post(DEPO_TRIP_SHEET_EXPENSE_APPROVAL_UPDATE_URL, value)
  }

  /* Get Vehicles Waiting For Expense Approval */
  getVehicleReadyToExpenseApproval() {
    return api.get(DEPO_TRIP_SHEET_EXPENSE_APPROVAL_BASE_URL)
  }

  /* Get Vehicles Waiting For Settlement Closure */
  getVehicleReadyToSettlementClosure() {
    return api.get(DEPO_TRIP_SHEET_SETTLEMENT_CLOSURE_BASE_URL)
  }

  /* Get Tripsheets Data Waiting For Settlement Validation */
  getTripsReadyToSettlementValidation() {
    return api.get(DEPO_TRIP_SHEET_SETTLEMENT_VALIDATION_BASE_URL)
  }

  /* Get Tripsheets Data Waiting For Settlement Approval */
  getTripsReadyToSettlementApproval() {
    return api.get(DEPO_TRIP_SHEET_SETTLEMENT_APPROVAL_BASE_URL)
  }

  /* Laravel Controller Custom Index Function Call for Fetch Tripsheets Data */
  getSettlementApprovalInfoById(payment_id) {
    return api.get(DEPO_TRIP_SHEET_SETTLEMENT_APPROVAL_INFO_GET_URL + payment_id)
  }

  /* Laravel Controller Custom Index Function Call for Fetch Tripsheets Data */
  getSettlementValidationInfoById(payment_id) {
    return api.get(DEPO_TRIP_SHEET_SETTLEMENT_VALIDATION_INFO_GET_URL + payment_id)
  }

  /* Laravel Controller Custom Index Function Call for Fetch Tripsheets Data */
  getPaymentInfoById(payment_id) {
    return api.get(DEPO_TRIP_PAYMENT_SUBMISSION_INFO_GET_URL + payment_id)
  }

   /* Laravel Controller update Function Call for Expense Capture update */
   updateExpenseClosure(id, value) {
    return api.post(DEPO_TRIP_SHEET_CLOSURE_BASE_URL + '/' + id, value)
  }

  /* Get All closure info From DB for filter */
  sentPaymentSubmissionDataForFilter(data) {
    return api.post(DEPO_TRIP_SHEET_SETTLEMENT_CLOSURE_FILTER_REQUEST_BASE_URL, data)
  }

  /* Sent Trip Payments info to DB */
  sentPaymentSubmissionData(data) {
    return api.post(DEPO_TRIP_SHEET_PAYMENT_SUBMISSION_REQUEST_BASE_URL, data)
  }

  /* Reject Single Trip Payment Data */
  rejectSingleTripPayment(data) {
    return api.post(DEPO_TRIP_SHEET_REJECT_SINGLE_PAYMENT_REQUEST_BASE_URL, data)
  }

  /* Reject All Trip Payment Data */
  rejectAllTripPayment(data) {
    return api.post(DEPO_TRIP_SHEET_REJECT_ALL_PAYMENT_REQUEST_BASE_URL, data)
  }

   /* Reject Payment Validation Data */
   rejectPaymentValidation(data) {
    return api.post(DEPO_TRIP_SHEET_REJECT_PAYMENT_VALIDATION_REQUEST_BASE_URL, data)
  }

  /* Sent Payment Validations info to DB */
  sendValidationApproval(data) {
    return api.post(DEPO_TRIP_SHEET_PAYMENT_VALIDATION_REQUEST_BASE_URL, data)
  }

  /* Sent Payment Approvals info to DB */
  sendPaymentApproval(data) {
    return api.post(DEPO_TRIP_SHEET_PAYMENT_APPROVAL_REQUEST_BASE_URL, data)
  }

  /* SAP Payment Invoice Creation */
  depoPaymentInvoiceCreation(data){
    return api.post(DEPO_TRIPSHEET_SETTLEMENT_PAYMENT_INVOICE_POST_API_URL, data)
  }

  /* Get All Payment Orders From DB for Report */
  getPaymentDataForReport() {
    return api.get(DEPO_TRIPSHEET_SETTLEMENT_REPORT_VIEW_URL)
  }

  /* Get All Payment Orders From DB for Report */
  sentPaymentDataForReport(data) {
    return api.post(DEPO_TRIPSHEET_SETTLEMENT_REPORT_SENT_URL, data)
  }

}

export default new DepoExpenseClosureService()
