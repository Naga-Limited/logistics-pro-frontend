import AppConfig from 'src/AppConfig'
import api from 'src/Service/Config'

const RAKE_TRIPSHEET_CLOSURE_BASE_URL = AppConfig.api.baseUrl + '/Rake/Closure'
const RAKE_TRIPSHEET_CLOSURE_APPROVAL_BASE_URL = AppConfig.api.baseUrl + '/Rake/ClosureApproval/'
const RAKE_TRIPSHEET_INCOME_CLOSURE_BASE_URL = AppConfig.api.baseUrl + '/Rake/IncomeClosure/'
const RAKE_TRIPSHEET_EXPENSE_CLOSURE_BASE_URL = AppConfig.api.baseUrl + '/Rake/ExpenseClosure/'
const RAKE_TRIPSHEET_SETTLEMENT_CLOSURE_BASE_URL = AppConfig.api.baseUrl + '/Rake/SettlementClosure/'
const RAKE_TRIPSHEET_DATA_BY_VTS_URL = AppConfig.api.baseUrl + '/Rake/TripdataByVTS/'
const RAKE_TRIPSHEET_MIGO_DATA_BY_VTS_URL = AppConfig.api.baseUrl + '/Rake/TripMigodataByVTS/'
const RAKE_TRIPSHEET_MIGO_DATA_BY_VFS_URL = AppConfig.api.baseUrl + '/Rake/TripMigodataByVFS/'
const RAKE_TRIPSHEET_MIGO_DATA_BY_VFS_URL1 = AppConfig.api.baseUrl + '/Rake/TripMigodataByVFSForApproval/'
const RAKE_TRIPSHEET_MIGO_DATA_BY_VFS_URL2 = AppConfig.api.baseUrl + '/Rake/TripMigodataByVFSForApprovalReport/'
const RAKE_TRIPSHEET_CLOSURE_APPROVAL_INFO_GET_URL =  AppConfig.api.baseUrl + '/Rake/ClosureApprovalInfo/'
const RAKE_TRIPSHEET_CLOSURE_APPROVAL_INFO_BY_RPS_GET_URL =  AppConfig.api.baseUrl + '/Rake/ClosureApprovalInfoByRPS/'
const RAKE_TRIPSHEET_CLOSURE_APPROVAL_INFO_BY_RPS_FOR_FI_PAYMENT_GET_URL =  AppConfig.api.baseUrl + '/Rake/ClosureApprovalInfoByRPSForFiPayment/'

/* Rake Old Entry Clearance By FNR */
const RAKE_TRIPSHEET_FNR_INFO_GET_URL =  AppConfig.api.baseUrl + '/Rake/FNRInfoForClearance/'
const RAKE_TRIPSHEET_FNR_CLEARANCE_START_URL =  AppConfig.api.baseUrl + '/Rake/fnr_clearance_start/'
const RAKE_TRIPSHEET_FNR_CLEARANCE_REVERT_URL =  AppConfig.api.baseUrl + '/Rake/fnr_clearance_revert/'

/* Rake Old Entry Clearance By RPS */
const RAKE_TRIPSHEET_RPS_CLEARANCE_INFO_GET_URL =  AppConfig.api.baseUrl + '/Rake/RPSClosureInfoForClearance/'
const RAKE_TRIPSHEET_RPS_CLEARANCE_START_URL =  AppConfig.api.baseUrl + '/Rake/rps_clearance_start/'
const RAKE_TRIPSHEET_RPS_CLEARANCE_REVERT_URL =  AppConfig.api.baseUrl + '/Rake/rps_clearance_revert/'

const RAKE_TRIPSHEET_CLOSURE_APPROVAL_MIGO_INFO_GET_URL =  AppConfig.api.baseUrl + '/Rake/ClosureApprovalMigoInfo/'

const RAKE_TRIP_SHEET_REJECT_EXPENSE_SUBMISSION_REQUEST_BASE_URL = AppConfig.api.baseUrl + '/Rake/ExpenseSubmissionReject'
const RAKE_TRIP_SHEET_APPROVE_EXPENSE_SUBMISSION_REQUEST_BASE_URL = AppConfig.api.baseUrl + '/Rake/ExpenseSubmissionApprove'
const RAKE_TRIP_SHEET_UPDATE_INCOME_CLOSURE_SUBMISSION_REQUEST_BASE_URL = AppConfig.api.baseUrl + '/Rake/IncomeClosureSubmission'
const RAKE_TRIP_SHEET_UPDATE_EXPENSE_CLOSURE_SUBMISSION_REQUEST_BASE_URL = AppConfig.api.baseUrl + '/Rake/ExpenseClosureSubmission'
const RAKE_TRIP_SHEET_UPDATE_APPROVE_SETTLEMENT_CLOSURE_SUBMISSION_REQUEST_BASE_URL = AppConfig.api.baseUrl + '/Rake/SettlementClosureSubmissionApprove'
const RAKE_TRIP_SHEET_UPDATE_REJECT_SETTLEMENT_CLOSURE_SUBMISSION_REQUEST_BASE_URL = AppConfig.api.baseUrl + '/Rake/SettlementClosureSubmissionReject'

const RAKE_TRIPSHEET_EXPENSE_REPORT_VIEW_URL = AppConfig.api.baseUrl + '/rakeTripsheetExpenseReportView'
const RAKE_TRIPSHEET_EXPENSE_REPORT_SENT_URL = AppConfig.api.baseUrl + '/rakeTripsheetExpenseReportRequest'

const RAKE_TRIPSHEET_SETTLEMENT_REPORT_VIEW_URL = AppConfig.api.baseUrl + '/rakeTripsheetSettlementReportView'
const RAKE_TRIPSHEET_SETTLEMENT_REPORT_SENT_URL = AppConfig.api.baseUrl + '/rakeTripsheetSettlementReportRequest'

const RAKE_TRIP_SHEET_UPDATE_FI_CLOSURE_SUBMISSION_REQUEST_BASE_URL = AppConfig.api.baseUrl + '/Rake/FiSubmission'
const RAKE_TRIP_SHEET_UPDATE_PAYMENT_SUBMISSION_REQUEST_BASE_URL = AppConfig.api.baseUrl + '/Rake/PaymentSubmission'
const RAKE_TRIPSHEET_FI_INFO_BY_RPS_GET_URL =  AppConfig.api.baseUrl + '/Rake/FIInfoByRPS/'

const PAYMENT_REPORT_VIEW_URL = AppConfig.api.baseUrl + '/rakePaymentReportView'
const PAYMENT_REPORT_SENT_URL = AppConfig.api.baseUrl + '/rakePaymentReportRequest'

const FIENTRY_REPORT_VIEW_URL = AppConfig.api.baseUrl + '/rakeFIEntryReportView'
const FIENTRY_REPORT_SENT_URL = AppConfig.api.baseUrl + '/rakeFIEntryReportRequest'

class RakeClosureSubmissionService {

  /* Closure Submission Process */
  createClosure(data) {
    return api.post(RAKE_TRIPSHEET_CLOSURE_BASE_URL, data)
  }

  getFnrVendorWiseTripData(fnr_number,ven_code) {
    return api.get(RAKE_TRIPSHEET_DATA_BY_VTS_URL + fnr_number+'||'+ven_code)
  }

  getFnrVendorWiseTripMigoData(fnr_number,ven_code) {
    return api.get(RAKE_TRIPSHEET_MIGO_DATA_BY_VTS_URL + fnr_number+'||'+ven_code)
  }

  getFnrVendorSeqWiseTripMigoData1(fnr_number,ven_code,sequence) {
    return api.get(RAKE_TRIPSHEET_MIGO_DATA_BY_VFS_URL1 + fnr_number+'||'+ven_code+'||'+sequence)
  }

  getFnrVendorSeqWiseTripMigoDataForReport(fnr_number,ven_code,sequence) {
    return api.get(RAKE_TRIPSHEET_MIGO_DATA_BY_VFS_URL2 + fnr_number+'||'+ven_code+'||'+sequence)
  }

  getFnrVendorSeqWiseTripMigoData(fnr_number,ven_code,sequence) {
    return api.get(RAKE_TRIPSHEET_MIGO_DATA_BY_VFS_URL + fnr_number+'||'+ven_code+'||'+sequence)
  }

  getExpenseApprovalData(){
    return api.get(RAKE_TRIPSHEET_CLOSURE_APPROVAL_BASE_URL)
  }

  getIncomeClosureData(){
    return api.get(RAKE_TRIPSHEET_INCOME_CLOSURE_BASE_URL)
  }

  getExpenseClosureData(){
    return api.get(RAKE_TRIPSHEET_EXPENSE_CLOSURE_BASE_URL)
  }

  getSettlementClosureData(){
    return api.get(RAKE_TRIPSHEET_SETTLEMENT_CLOSURE_BASE_URL)
  }

  getExpenseApprovalInfoById(closure_id) {
    return api.get(RAKE_TRIPSHEET_CLOSURE_APPROVAL_INFO_GET_URL + closure_id)
  }

  getExpenseApprovalInfoByRPS(closure_sequence) {
    return api.get(RAKE_TRIPSHEET_CLOSURE_APPROVAL_INFO_BY_RPS_GET_URL + closure_sequence)
  }

  getExpenseApprovalInfoByRPSForFiPayment(closure_sequence) {
    return api.get(RAKE_TRIPSHEET_CLOSURE_APPROVAL_INFO_BY_RPS_FOR_FI_PAYMENT_GET_URL + closure_sequence)
  }

  getRPSInfoForClearance(closure_sequence) {
    return api.get(RAKE_TRIPSHEET_RPS_CLEARANCE_INFO_GET_URL + closure_sequence)
  } 

  getFNRInfoForClearance(closure_sequence) {
    return api.get(RAKE_TRIPSHEET_FNR_INFO_GET_URL + closure_sequence)
  }

  startRPSClearance(closure_sequence) {
    return api.get(RAKE_TRIPSHEET_RPS_CLEARANCE_START_URL + closure_sequence)
  }

  revertRPSClearance(closure_sequence) {
    return api.get(RAKE_TRIPSHEET_RPS_CLEARANCE_REVERT_URL + closure_sequence)
  }

  startFNRClearance(closure_sequence) {
    return api.get(RAKE_TRIPSHEET_FNR_CLEARANCE_START_URL + closure_sequence)
  }

  revertFNRClearance(closure_sequence) {
    return api.get(RAKE_TRIPSHEET_FNR_CLEARANCE_REVERT_URL + closure_sequence)
  }

  getFIInfoByRPS(closure_sequence) {
    return api.get(RAKE_TRIPSHEET_FI_INFO_BY_RPS_GET_URL + closure_sequence)
  }

  getExpenseApprovalMigoInfoById(closure_id) {
    return api.get(RAKE_TRIPSHEET_CLOSURE_APPROVAL_MIGO_INFO_GET_URL + closure_id)
  }

  /* Reject Migo Expense Submission Data */
  rejectExpenseSubmission(data) {
    return api.post(RAKE_TRIP_SHEET_REJECT_EXPENSE_SUBMISSION_REQUEST_BASE_URL, data)
  }

  /* Approve Migo Expense Submission Data */
  approveExpenseSubmission(data) {
    return api.post(RAKE_TRIP_SHEET_APPROVE_EXPENSE_SUBMISSION_REQUEST_BASE_URL, data)
  }

  /* Get All Tripsheet Expenses From DB for Report */
  getTripsheetExpenseDataForReport() {
    return api.get(RAKE_TRIPSHEET_EXPENSE_REPORT_VIEW_URL)
  }

  /* Get All Tripsheet Expenses From DB for Report */
  sentTripsheetExpenseDataForReport(data) {
    return api.post(RAKE_TRIPSHEET_EXPENSE_REPORT_SENT_URL, data)
  }

  /* Update Income Closure Submission Data */
  updateIncomeClosureSubmission(data) {
    return api.post(RAKE_TRIP_SHEET_UPDATE_INCOME_CLOSURE_SUBMISSION_REQUEST_BASE_URL, data)
  }

  /* Update Expense Closure Submission Data */
  updateExpenseClosureSubmission(data) {
    return api.post(RAKE_TRIP_SHEET_UPDATE_EXPENSE_CLOSURE_SUBMISSION_REQUEST_BASE_URL, data)
  }

  /* Reject Settlement Closure Submission Data */
  rejectSettlementSubmission(data) {
    return api.post(RAKE_TRIP_SHEET_UPDATE_REJECT_SETTLEMENT_CLOSURE_SUBMISSION_REQUEST_BASE_URL, data)
  }

  /* Approve Settlement Closure Submission Data */
  approveSettlementSubmission(data) {
    return api.post(RAKE_TRIP_SHEET_UPDATE_APPROVE_SETTLEMENT_CLOSURE_SUBMISSION_REQUEST_BASE_URL, data)
  }

  /* Get All Settlement Tripsheets From DB for Report */
  getTripsheetSettlementDataForReport() {
    return api.get(RAKE_TRIPSHEET_SETTLEMENT_REPORT_VIEW_URL)
  }

  /* Get All Settlement Tripsheets From DB for Report */
  sentTripsheetSettlementDataForReport(data) {
    return api.post(RAKE_TRIPSHEET_SETTLEMENT_REPORT_SENT_URL, data)
  }

  /* Submit FI Closure Submission Data */
  fiSubmission(data) {
    return api.post(RAKE_TRIP_SHEET_UPDATE_FI_CLOSURE_SUBMISSION_REQUEST_BASE_URL, data)
  }

  /* Submit Payment Submission Data */
  paymentSubmission(data) {
    return api.post(RAKE_TRIP_SHEET_UPDATE_PAYMENT_SUBMISSION_REQUEST_BASE_URL, data)
  }

  /* Get All Rake Payments Entries From DB for Report */
  getPaymentDataForReport() {
    return api.get(PAYMENT_REPORT_VIEW_URL)
  }

  /* Get All Rake Payments Entries From DB for Report */
  sentPaymentDataForReport(data) {
    return api.post(PAYMENT_REPORT_SENT_URL, data)
  }

  /* Get All Rake FI - Entries From DB for Report */
  getFiEntryDataForReport() {
    return api.get(FIENTRY_REPORT_VIEW_URL)
  }

  /* Get All Rake FI - Entries From DB for Report */
  sentFiEntryDataForReport(data) {
    return api.post(FIENTRY_REPORT_SENT_URL, data)
  }

}

export default new RakeClosureSubmissionService()

