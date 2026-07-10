import AppConfig from 'src/AppConfig'
import api from 'src/Service/Config'

const IFOODS_TRIP_SHEET_CLOSURE_BASE_URL = AppConfig.api.baseUrl + '/Ifoods/TSClosure'
const IFOODS_TRIP_SHEET_EXPENSE_APPROVAL_BASE_URL = AppConfig.api.baseUrl + '/Ifoods/ExpenseApproval/'
const IFOODS_TRIP_SHEET_SETTLEMENT_CLOSURE_BASE_URL = AppConfig.api.baseUrl + '/Ifoods/SettlementClosure/'
const IFOODS_TRIP_SHEET_SETTLEMENT_CLOSURE_REPORT_BASE_URL = AppConfig.api.baseUrl + '/Ifoods/SettlementClosureReport/'
const IFOODS_TRIP_SHEET_SETTLEMENT_CLOSURE_FILTER_REQUEST_BASE_URL = AppConfig.api.baseUrl + '/Ifoods/SettlementClosure/paymentSubmissionFilterRequest'
const IFOODS_TRIP_SHEET_PAYMENT_SUBMISSION_REQUEST_BASE_URL = AppConfig.api.baseUrl + '/Ifoods/PaymentSubmission/paymentSubmissionRequest'
const IFOODS_TRIP_SHEET_PAYMENT_VALIDATION_REQUEST_BASE_URL = AppConfig.api.baseUrl + '/Ifoods/PaymentValidation/paymentValidationRequest'
const IFOODS_TRIP_SHEET_PAYMENT_VALIDATIONAM_REQUEST_BASE_URL = AppConfig.api.baseUrl + '/Ifoods/PaymentValidation/paymentValidationRequestAm'
const IFOODS_TRIP_SHEET_PAYMENT_VALIDATIONOH_REQUEST_BASE_URL = AppConfig.api.baseUrl + '/Ifoods/PaymentValidation/paymentValidationRequestOh'
const IFOODS_TRIP_SHEET_PAYMENT_APPROVAL_REQUEST_BASE_URL = AppConfig.api.baseUrl + '/Ifoods/PaymentApproval/paymentApprovalRequest'
const IFOODS_TRIP_SHEET_REJECT_SINGLE_PAYMENT_REQUEST_BASE_URL = AppConfig.api.baseUrl + '/Ifoods/PaymentSubmission/paymentSubmissionSingleTripReject'
const IFOODS_TRIP_SHEET_REJECTAM_SINGLE_PAYMENT_REQUEST_BASE_URL = AppConfig.api.baseUrl + '/Ifoods/PaymentSubmission/paymentSubmissionSingleTripRejectAm'
const IFOODS_TRIP_SHEET_REJECT_ALL_PAYMENT_REQUEST_BASE_URL = AppConfig.api.baseUrl + '/Ifoods/PaymentSubmission/paymentSubmissionAllTripReject'
const IFOODS_TRIP_SHEET_REJECTOH_ALL_PAYMENT_REQUEST_BASE_URL = AppConfig.api.baseUrl + '/Ifoods/PaymentSubmission/paymentSubmissionAllTripRejectOh'
const IFOODS_TRIP_SHEET_REJECT_ALL_PAYMENTS_REQUEST_BASE_URL = AppConfig.api.baseUrl + '/Ifoods/PaymentSubmission/paymentSubmissionAllTripReject1'
const IFOODS_TRIP_SHEET_REJECT_PAYMENT_VALIDATION_REQUEST_BASE_URL = AppConfig.api.baseUrl + '/Ifoods/PaymentSubmission/paymentValidationReject'
const IFOODS_TRIP_SHEET_SETTLEMENT_VALIDATION_BASE_URL = AppConfig.api.baseUrl + '/Ifoods/SettlementValidation/'
const IFOODS_TRIP_SHEET_SETTLEMENT_VALIDATIONOH_BASE_URL = AppConfig.api.baseUrl + '/Ifoods/SettlementValidationOh/'
const IFOODS_TRIP_SHEET_SETTLEMENTS_VALIDATION_BASE_URL = AppConfig.api.baseUrl + '/Ifoods/SettlementValidation1/'
const IFOODS_TRIP_SHEET_SETTLEMENT_APPROVAL_BASE_URL = AppConfig.api.baseUrl + '/Ifoods/SettlementApproval/'
const IFOODS_TRIP_SHEET_CLOSURE_INFO_GET_URL =  AppConfig.api.baseUrl + '/Ifoods/GetClosureInfo/'
const IFOODS_TRIP_SHEET_CLOSURE_INFO_COPY_GET_URL =  AppConfig.api.baseUrl + '/Ifoods/GetClosureInfo1/'
const IFOODS_TRIP_SHEET_EXPENSE_APPROVAL_UPDATE_URL =  AppConfig.api.baseUrl + '/Ifoods/UpdateExpenseApproval'
const IFOODS_TRIP_SHEET_SETTLEMENT_APPROVAL_INFO_GET_URL =  AppConfig.api.baseUrl + '/Ifoods/GetSettlementClosureApprovalInfo/'
const IFOODS_TRIP_SHEET_SETTLEMENT_VALIDATION_INFO_GET_URL =  AppConfig.api.baseUrl + '/Ifoods/GetSettlementClosureValidationInfo/'
const IFOODS_TRIP_PAYMENT_SUBMISSION_INFO_GET_URL =  AppConfig.api.baseUrl + '/Ifoods/GetPaymentSubmissionInfo/'
const IFOODS_TRIPSHEET_SETTLEMENT_PAYMENT_INVOICE_POST_API_URL = AppConfig.api.baseUrl + '/sap/ts-ifoods-payment-invoice'
const IFOODS_TRIPSHEET_SETTLEMENT_REPORT_VIEW_URL = AppConfig.api.baseUrl + '/Ifoods/IfoodsPaymentReportView'
const IFOODS_TRIPSHEET_SETTLEMENT_REPORT_SENT_URL = AppConfig.api.baseUrl + '/Ifoods/IfoodsPaymentReportRequest'
const IFOODS_TRIP_SHEET_SETTLEMENT_CLOSURE_FILTER_REPORT_REQUEST_BASE_URL = AppConfig.api.baseUrl + '/Ifoods/SettlementClosure/paymentSubmissionFilterReportRequest'
const IFOODS_EXEMPTION_URL = AppConfig.api.baseUrl + '/sap/GetExemptioninfo'
class IfoodsExpenseClosureService {

  /* Laravel Controller Index Function Call for Expense Capture */
  getVehicleReadyToTripClose() {
    return api.get(IFOODS_TRIP_SHEET_CLOSURE_BASE_URL)
  }

  /* Laravel Controller Custom Index Function Call for Fetch Vehicle Info Data */
  getTruckInfoById(id) {
    return api.get(IFOODS_TRIP_SHEET_CLOSURE_BASE_URL + '/' + id)
  }

  /* Laravel Controller Custom Index Function Call for Fetch Vehicle Info Data */
  getClosureInfoById(closure_id) {
    return api.get(IFOODS_TRIP_SHEET_CLOSURE_INFO_GET_URL + closure_id)
  }

  /* Laravel Controller Custom Index Function Call for Fetch Vehicle Info Data */
  getClosureInfoById1(parking_id) {
    return api.get(IFOODS_TRIP_SHEET_CLOSURE_INFO_COPY_GET_URL + parking_id)
  }

  /* Laravel Controller Store Function Call for Expense Capture Save */
  createExpenseClosure(value) {
    return api.post(IFOODS_TRIP_SHEET_CLOSURE_BASE_URL, value)
  }

  /* Update Expense Approval */
  updateExpenseApproval(value) {
    return api.post(IFOODS_TRIP_SHEET_EXPENSE_APPROVAL_UPDATE_URL, value)
  }

  /* Get Vehicles Waiting For Expense Approval */
  getVehicleReadyToExpenseApproval() {
    return api.get(IFOODS_TRIP_SHEET_EXPENSE_APPROVAL_BASE_URL)
  }

  /* Get Vehicles Waiting For Settlement Closure */
  getVehicleReadyToSettlementClosure() {
    return api.get(IFOODS_TRIP_SHEET_SETTLEMENT_CLOSURE_BASE_URL)
  }
  getSettlementClosureReport() {
    return api.get(IFOODS_TRIP_SHEET_SETTLEMENT_CLOSURE_REPORT_BASE_URL)
  }
  getSettlementClosureReportFilter(data) {
    return api.post(IFOODS_TRIP_SHEET_SETTLEMENT_CLOSURE_FILTER_REPORT_REQUEST_BASE_URL, data)
  }

  /* Get Tripsheets Data Waiting For Settlement Validation */
  getTripsReadyToSettlementValidation() {
    return api.get(IFOODS_TRIP_SHEET_SETTLEMENT_VALIDATION_BASE_URL)
  }
  getTripsReadyToSettlementValidationOh() {
    return api.get(IFOODS_TRIP_SHEET_SETTLEMENT_VALIDATIONOH_BASE_URL)
  }
  getTripsReadyToSettlementValidation1() {
    return api.get(IFOODS_TRIP_SHEET_SETTLEMENTS_VALIDATION_BASE_URL)
  }


  /* Get Tripsheets Data Waiting For Settlement Approval */
  getTripsReadyToSettlementApproval() {
    return api.get(IFOODS_TRIP_SHEET_SETTLEMENT_APPROVAL_BASE_URL)
  }

  /* Laravel Controller Custom Index Function Call for Fetch Tripsheets Data */
  getSettlementApprovalInfoById(payment_id) {
    return api.get(IFOODS_TRIP_SHEET_SETTLEMENT_APPROVAL_INFO_GET_URL + payment_id)
  }

  /* Laravel Controller Custom Index Function Call for Fetch Tripsheets Data */
  getSettlementValidationInfoById(payment_id) {
    return api.get(IFOODS_TRIP_SHEET_SETTLEMENT_VALIDATION_INFO_GET_URL + payment_id)
  }

  /* Laravel Controller Custom Index Function Call for Fetch Tripsheets Data */
  getPaymentInfoById(payment_id) {
    return api.get(IFOODS_TRIP_PAYMENT_SUBMISSION_INFO_GET_URL + payment_id)
  }

   /* Laravel Controller update Function Call for Expense Capture update */
   updateExpenseClosure(id, value) {
    return api.post(IFOODS_TRIP_SHEET_CLOSURE_BASE_URL + '/' + id, value)
  }

  /* Get All closure info From DB for filter */
  sentPaymentSubmissionDataForFilter(data) {
    return api.post(IFOODS_TRIP_SHEET_SETTLEMENT_CLOSURE_FILTER_REQUEST_BASE_URL, data)
  }

  /* Sent Trip Payments info to DB */
  sentPaymentSubmissionData(data) {
    return api.post(IFOODS_TRIP_SHEET_PAYMENT_SUBMISSION_REQUEST_BASE_URL, data)
  }

  /* Reject Single Trip Payment Data */
  rejectSingleTripPayment(data) {
    return api.post(IFOODS_TRIP_SHEET_REJECT_SINGLE_PAYMENT_REQUEST_BASE_URL, data)
  }
  rejectSingleTripPaymentam(data) {
    return api.post(IFOODS_TRIP_SHEET_REJECTAM_SINGLE_PAYMENT_REQUEST_BASE_URL, data)
  }

  /* Reject All Trip Payment Data */
  rejectAllTripPayment(data) {
    return api.post(IFOODS_TRIP_SHEET_REJECT_ALL_PAYMENT_REQUEST_BASE_URL, data)
  }
  rejectAllTripPaymentoh(data) {
    return api.post(IFOODS_TRIP_SHEET_REJECTOH_ALL_PAYMENT_REQUEST_BASE_URL, data)
  }
  rejectAllTripPayment1(data) {
    return api.post(IFOODS_TRIP_SHEET_REJECT_ALL_PAYMENTS_REQUEST_BASE_URL, data)
  }

   /* Reject Payment Validation Data */
   rejectPaymentValidation(data) {
    return api.post(IFOODS_TRIP_SHEET_REJECT_PAYMENT_VALIDATION_REQUEST_BASE_URL, data)
  }

  /* Sent Payment Validations info to DB */
  sendValidationApproval(data) {
    return api.post(IFOODS_TRIP_SHEET_PAYMENT_VALIDATION_REQUEST_BASE_URL, data)
  }
  sendValidationApprovalAm(data) {
    return api.post(IFOODS_TRIP_SHEET_PAYMENT_VALIDATIONAM_REQUEST_BASE_URL, data)
  }
  ohsendValidationApproval(data) {
    return api.post(IFOODS_TRIP_SHEET_PAYMENT_VALIDATIONOH_REQUEST_BASE_URL, data)
  }

  /* Sent Payment Approvals info to DB */
  sendPaymentApproval(data) {
    return api.post(IFOODS_TRIP_SHEET_PAYMENT_APPROVAL_REQUEST_BASE_URL, data)
  }

  /* SAP Payment Invoice Creation */
  ifoodsPaymentInvoiceCreation(data){
    return api.post(IFOODS_TRIPSHEET_SETTLEMENT_PAYMENT_INVOICE_POST_API_URL, data)
  }

  /* Get All Payment Orders From DB for Report */
  getPaymentDataForReport() {
    return api.get(IFOODS_TRIPSHEET_SETTLEMENT_REPORT_VIEW_URL)
  }

  /* Get All Payment Orders From DB for Report */
  sentPaymentDataForReport(data) {
    return api.post(IFOODS_TRIPSHEET_SETTLEMENT_REPORT_SENT_URL, data)
  }
   /* Get Exemption By From SAP */
  getExemptionbyVendor(data) {
    return api.post(IFOODS_EXEMPTION_URL ,data)
  }

}

export default new IfoodsExpenseClosureService()
