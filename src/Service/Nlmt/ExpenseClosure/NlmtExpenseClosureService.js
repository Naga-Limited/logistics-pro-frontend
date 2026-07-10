import AppConfig from 'src/AppConfig'
import api from 'src/Service/Config'

const NLMT_TRIP_SHEET_CLOSURE_BASE_URL = AppConfig.api.baseUrl + '/Nlmt/TSClosure'
const NLMT_TRIP_SHEET_EXPENSE_APPROVAL_BASE_URL = AppConfig.api.baseUrl + '/Nlmt/ExpenseApproval/'
const NLMT_TRIP_SHEET_SETTLEMENT_CLOSURE_BASE_URL = AppConfig.api.baseUrl + '/Nlmt/SettlementClosure/'
const NLMT_TRIP_SHEET_SETTLEMENT_CLOSURE_FILTER_REQUEST_BASE_URL = AppConfig.api.baseUrl + '/Nlmt/SettlementClosure/paymentSubmissionFilterRequest'
const NLMT_TRIP_SHEET_PAYMENT_SUBMISSION_REQUEST_BASE_URL = AppConfig.api.baseUrl + '/Nlmt/PaymentSubmission/paymentSubmissionRequest'
const NLMT_TRIP_SHEET_PAYMENT_VALIDATION_REQUEST_BASE_URL = AppConfig.api.baseUrl + '/Nlmt/PaymentValidation/paymentValidationRequest'
const NLMT_TRIP_SHEET_PAYMENT_APPROVAL_REQUEST_BASE_URL = AppConfig.api.baseUrl + '/Nlmt/PaymentApproval/paymentApprovalRequest'
const NLMT_TRIP_SHEET_REJECT_SINGLE_PAYMENT_REQUEST_BASE_URL = AppConfig.api.baseUrl + '/Nlmt/PaymentSubmission/paymentSubmissionSingleTripReject'
const NLMT_TRIP_SHEET_REJECT_ALL_PAYMENT_REQUEST_BASE_URL = AppConfig.api.baseUrl + '/Nlmt/PaymentSubmission/paymentSubmissionAllTripReject'
const NLMT_TRIP_SHEET_REJECT_PAYMENT_VALIDATION_REQUEST_BASE_URL = AppConfig.api.baseUrl + '/Nlmt/PaymentSubmission/paymentValidationReject'
const NLMT_TRIP_SHEET_SETTLEMENT_VALIDATION_BASE_URL = AppConfig.api.baseUrl + '/Nlmt/SettlementValidation/'
const NLMT_TRIP_SHEET_SETTLEMENT_APPROVAL_BASE_URL = AppConfig.api.baseUrl + '/Nlmt/SettlementApproval/'
const NLMT_TRIP_SHEET_CLOSURE_INFO_GET_URL =  AppConfig.api.baseUrl + '/Nlmt/GetClosureInfo/'
const NLMT_TRIP_SHEET_CLOSURE_INFO_COPY_GET_URL =  AppConfig.api.baseUrl + '/Nlmt/GetClosureInfo1/'
const NLMT_TRIP_SHEET_EXPENSE_APPROVAL_UPDATE_URL =  AppConfig.api.baseUrl + '/Nlmt/UpdateExpenseApproval'
const NLMT_TRIP_SHEET_SETTLEMENT_APPROVAL_INFO_GET_URL =  AppConfig.api.baseUrl + '/Nlmt/GetSettlementClosureApprovalInfo/'
const NLMT_TRIP_SHEET_SETTLEMENT_VALIDATION_INFO_GET_URL =  AppConfig.api.baseUrl + '/Nlmt/GetSettlementClosureValidationInfo/'
const NLMT_TRIP_PAYMENT_SUBMISSION_INFO_GET_URL =  AppConfig.api.baseUrl + '/Nlmt/GetPaymentSubmissionInfo/'
const NLMT_TRIPSHEET_SETTLEMENT_PAYMENT_INVOICE_POST_API_URL = AppConfig.api.baseUrl + '/sap/ts-nlmt-payment-invoice'
const NLMT_TRIPSHEET_SETTLEMENT_REPORT_VIEW_URL = AppConfig.api.baseUrl + '/Nlmt/NlmtPaymentReportView'
const NLMT_TRIPSHEET_SETTLEMENT_REPORT_SENT_URL = AppConfig.api.baseUrl + '/Nlmt/NlmtPaymentReportRequest'

class NlmtExpenseClosureService {

  /* Laravel Controller Index Function Call for Expense Capture */
  getVehicleReadyToTripClose() {
    return api.get(NLMT_TRIP_SHEET_CLOSURE_BASE_URL)
  }

  /* Laravel Controller Custom Index Function Call for Fetch Vehicle Info Data */
  getTruckInfoById(id) {
    return api.get(NLMT_TRIP_SHEET_CLOSURE_BASE_URL + '/' + id)
  }

  /* Laravel Controller Custom Index Function Call for Fetch Vehicle Info Data */
  getClosureInfoById(closure_id) {
    return api.get(NLMT_TRIP_SHEET_CLOSURE_INFO_GET_URL + closure_id)
  }

  /* Laravel Controller Custom Index Function Call for Fetch Vehicle Info Data */
  getClosureInfoById1(parking_id) {
    return api.get(NLMT_TRIP_SHEET_CLOSURE_INFO_COPY_GET_URL + parking_id)
  }

  /* Laravel Controller Store Function Call for Expense Capture Save */
  createExpenseClosure(value) {
    return api.post(NLMT_TRIP_SHEET_CLOSURE_BASE_URL, value)
  }

  /* Update Expense Approval */
  updateExpenseApproval(value) {
    return api.post(NLMT_TRIP_SHEET_EXPENSE_APPROVAL_UPDATE_URL, value)
  }

  /* Get Vehicles Waiting For Expense Approval */
  getVehicleReadyToExpenseApproval() {
    return api.get(NLMT_TRIP_SHEET_EXPENSE_APPROVAL_BASE_URL)
  }

  /* Get Vehicles Waiting For Settlement Closure */
  getVehicleReadyToSettlementClosure() {
    return api.get(NLMT_TRIP_SHEET_SETTLEMENT_CLOSURE_BASE_URL)
  }

  /* Get Tripsheets Data Waiting For Settlement Validation */
  getTripsReadyToSettlementValidation() {
    return api.get(NLMT_TRIP_SHEET_SETTLEMENT_VALIDATION_BASE_URL)
  }

  /* Get Tripsheets Data Waiting For Settlement Approval */
  getTripsReadyToSettlementApproval() {
    return api.get(NLMT_TRIP_SHEET_SETTLEMENT_APPROVAL_BASE_URL)
  }

  /* Laravel Controller Custom Index Function Call for Fetch Tripsheets Data */
  getSettlementApprovalInfoById(payment_id) {
    return api.get(NLMT_TRIP_SHEET_SETTLEMENT_APPROVAL_INFO_GET_URL + payment_id)
  }

  /* Laravel Controller Custom Index Function Call for Fetch Tripsheets Data */
  getSettlementValidationInfoById(payment_id) {
    return api.get(NLMT_TRIP_SHEET_SETTLEMENT_VALIDATION_INFO_GET_URL + payment_id)
  }

  /* Laravel Controller Custom Index Function Call for Fetch Tripsheets Data */
  getPaymentInfoById(payment_id) {
    return api.get(NLMT_TRIP_PAYMENT_SUBMISSION_INFO_GET_URL + payment_id)
  }

   /* Laravel Controller update Function Call for Expense Capture update */
   updateExpenseClosure(id, value) {
    return api.post(NLMT_TRIP_SHEET_CLOSURE_BASE_URL + '/' + id, value)
  }

  /* Get All closure info From DB for filter */
  sentPaymentSubmissionDataForFilter(data) {
    return api.post(NLMT_TRIP_SHEET_SETTLEMENT_CLOSURE_FILTER_REQUEST_BASE_URL, data)
  }

  /* Sent Trip Payments info to DB */
  sentPaymentSubmissionData(data) {
    return api.post(NLMT_TRIP_SHEET_PAYMENT_SUBMISSION_REQUEST_BASE_URL, data)
  }

  /* Reject Single Trip Payment Data */
  rejectSingleTripPayment(data) {
    return api.post(NLMT_TRIP_SHEET_REJECT_SINGLE_PAYMENT_REQUEST_BASE_URL, data)
  }

  /* Reject All Trip Payment Data */
  rejectAllTripPayment(data) {
    return api.post(NLMT_TRIP_SHEET_REJECT_ALL_PAYMENT_REQUEST_BASE_URL, data)
  }

   /* Reject Payment Validation Data */
   rejectPaymentValidation(data) {
    return api.post(NLMT_TRIP_SHEET_REJECT_PAYMENT_VALIDATION_REQUEST_BASE_URL, data)
  }

  /* Sent Payment Validations info to DB */
  sendValidationApproval(data) {
    return api.post(NLMT_TRIP_SHEET_PAYMENT_VALIDATION_REQUEST_BASE_URL, data)
  }

  /* Sent Payment Approvals info to DB */
  sendPaymentApproval(data) {
    return api.post(NLMT_TRIP_SHEET_PAYMENT_APPROVAL_REQUEST_BASE_URL, data)
  }

  /* SAP Payment Invoice Creation */
  depoPaymentInvoiceCreation(data){
    return api.post(NLMT_TRIPSHEET_SETTLEMENT_PAYMENT_INVOICE_POST_API_URL, data)
  }

  /* Get All Payment Orders From DB for Report */
  getPaymentDataForReport() {
    return api.get(NLMT_TRIPSHEET_SETTLEMENT_REPORT_VIEW_URL)
  }

  /* Get All Payment Orders From DB for Report */
  sentPaymentDataForReport(data) {
    return api.post(NLMT_TRIPSHEET_SETTLEMENT_REPORT_SENT_URL, data)
  }

}

export default new NlmtExpenseClosureService()
