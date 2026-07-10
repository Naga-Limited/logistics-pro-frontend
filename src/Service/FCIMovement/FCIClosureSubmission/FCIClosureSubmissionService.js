import AppConfig from 'src/AppConfig'
import api from 'src/Service/Config'

const FCI_TRIPSHEET_CLOSURE_BASE_URL = AppConfig.api.baseUrl + '/FCI/Closure'
const FCI_TRIPSHEET_DATA_BY_VTS_URL = AppConfig.api.baseUrl + '/FCI/TripdataByVTS/'
const FCI_TRIPSHEET_FREIGHT_MIGO_DATA_BY_VTS_URL = AppConfig.api.baseUrl + '/FCI/TripFreightMigodataByVTS/'
const FCI_TRIPSHEET_LOADING_MIGO_DATA_BY_VTS_URL = AppConfig.api.baseUrl + '/FCI/TripLoadingMigodataByVTS/'
const FCI_FP_VA_TRIPSHEET_CLOSURE_APPROVAL_BASE_URL = AppConfig.api.baseUrl + '/FCI/FPExpenseClosureApproval/'
const FCI_LP_VA_TRIPSHEET_CLOSURE_APPROVAL_BASE_URL = AppConfig.api.baseUrl + '/FCI/LPExpenseClosureApproval/'
const FCI_TRIPSHEET_CLOSURE_FP_APPROVAL_INFO_GET_URL =  AppConfig.api.baseUrl + '/FCI/FPClosureApprovalInfo/'
const FCI_TRIPSHEET_CLOSURE_LP_APPROVAL_INFO_GET_URL =  AppConfig.api.baseUrl + '/FCI/LPClosureApprovalInfo/'
const FCI_TRIPSHEET_CLOSURE_INFO_GET_URL =  AppConfig.api.baseUrl + '/FCI/TripClosureInfo/'
const FCI_TRIPSHEET_FREIGHT_MIGO_DATA_BY_VPS_URL1 = AppConfig.api.baseUrl + '/FCI/TripFreightMigodataByVPSForApproval/'
const FCI_TRIPSHEET_LOADING_MIGO_DATA_BY_VPS_URL1 = AppConfig.api.baseUrl + '/FCI/TripLoadingMigodataByVPSForApproval/'
const FCI_TRIP_SHEET_REJECT_FREIGHT_EXPENSE_SUBMISSION_REQUEST_BASE_URL = AppConfig.api.baseUrl + '/FCI/FreightExpenseSubmissionReject'
const FCI_TRIP_SHEET_APPROVE_FREIGHT_EXPENSE_SUBMISSION_REQUEST_BASE_URL = AppConfig.api.baseUrl + '/FCI/FreightExpenseSubmissionApprove'
const FCI_TRIP_SHEET_REJECT_LOADING_EXPENSE_SUBMISSION_REQUEST_BASE_URL = AppConfig.api.baseUrl + '/FCI/LoadingExpenseSubmissionReject'
const FCI_TRIP_SHEET_APPROVE_LOADING_EXPENSE_SUBMISSION_REQUEST_BASE_URL = AppConfig.api.baseUrl + '/FCI/LoadingExpenseSubmissionApprove'
const FCI_TRIPSHEET_EXPENSE_VALIDATION_BASE_URL = AppConfig.api.baseUrl + '/FCI/ExpenseValidation/'
const FCI_TRIPSHEET_EXPENSE_APPROVAL_BASE_URL = AppConfig.api.baseUrl + '/FCI/ExpenseApproval/'
const FCI_TRIPSHEET_INCOME_CLOSURE_BASE_URL = AppConfig.api.baseUrl + '/FCI/IncomeClosure/' 
const FCI_TRIP_SHEET_SUBMIT_EXPENSE_VALIDATION_REQUEST_BASE_URL = AppConfig.api.baseUrl + '/FCI/ExpenseValidationSubmit' 
const FCI_TRIP_SHEET_REJECT_EXPENSE_POSTING_REQUEST_BASE_URL = AppConfig.api.baseUrl + '/FCI/ExpensePostingReject' 
const FCI_TRIP_SHEET_SUBMIT_EXPENSE_POSTING_REQUEST_BASE_URL = AppConfig.api.baseUrl + '/FCI/ExpensePostingSubmit' 
const FCI_TRIP_SHEET_SUBMIT_INCOME_POSTING_REQUEST_BASE_URL = AppConfig.api.baseUrl + '/FCI/IncomePostingSubmit' 
const FCI_TRIPSHEET_CLOSURE_APPROVAL_INFO_BY_RPS_FOR_FI_PAYMENT_GET_URL = AppConfig.api.baseUrl + '/FCI/ClosureApprovalInfoByFPSForFiPayment/' 
const FCI_TRIP_SHEET_UPDATE_PAYMENT_SUBMISSION_REQUEST_BASE_URL = AppConfig.api.baseUrl + '/FCI/PaymentSubmission'
const FCI_TRIP_SHEET_UPDATE_FI_CLOSURE_SUBMISSION_REQUEST_BASE_URL = AppConfig.api.baseUrl + '/FCI/FiSubmission'

// ============== Reports Part Start ===================//

const FCI_TRIPSHEET_EXPENSE_REPORT_VIEW_URL = AppConfig.api.baseUrl + '/fciTripsheetExpenseReportView'
const FCI_TRIPSHEET_EXPENSE_REPORT_SENT_URL = AppConfig.api.baseUrl + '/fciTripsheetExpenseReportRequest'

const FCI_TRIPSHEET_SETTLEMENT_REPORT_VIEW_URL = AppConfig.api.baseUrl + '/fciTripsheetSettlementReportView'
const FCI_TRIPSHEET_SETTLEMENT_REPORT_SENT_URL = AppConfig.api.baseUrl + '/fciTripsheetSettlementReportRequest'

const PAYMENT_REPORT_VIEW_URL = AppConfig.api.baseUrl + '/fciPaymentReportView'
const PAYMENT_REPORT_SENT_URL = AppConfig.api.baseUrl + '/fciPaymentReportRequest'

const FIENTRY_REPORT_VIEW_URL = AppConfig.api.baseUrl + '/fciFIEntryReportView'
const FIENTRY_REPORT_SENT_URL = AppConfig.api.baseUrl + '/fciFIEntryReportRequest'

// ============== Reports Part End ===================//

class FCIClosureSubmissionService {

    /* Closure Submission Process */
    createClosure(data) {
        return api.post(FCI_TRIPSHEET_CLOSURE_BASE_URL, data)
    }

    getPopVendorWiseTripData(po_number,plant_code) {
        return api.get(FCI_TRIPSHEET_DATA_BY_VTS_URL + po_number+'||'+plant_code)
    }

    getPopVendorWiseTripFreightMigoData(po_number,plant_code) {
        return api.get(FCI_TRIPSHEET_FREIGHT_MIGO_DATA_BY_VTS_URL + po_number+'||'+plant_code)
    }

    getPopVendorWiseTripLoadingMigoData(po_number,plant_code) {
        return api.get(FCI_TRIPSHEET_LOADING_MIGO_DATA_BY_VTS_URL + po_number+'||'+plant_code)
    }

    getFreightExpenseApprovalData(){
        return api.get(FCI_FP_VA_TRIPSHEET_CLOSURE_APPROVAL_BASE_URL)
    }

    getLoadingExpenseApprovalData(){
        return api.get(FCI_LP_VA_TRIPSHEET_CLOSURE_APPROVAL_BASE_URL)
    }

    getFreightExpenseApprovalInfoById(closure_id) {
        return api.get(FCI_TRIPSHEET_CLOSURE_FP_APPROVAL_INFO_GET_URL + closure_id)
    }

    getLoadingExpenseApprovalInfoById(closure_id) {
        return api.get(FCI_TRIPSHEET_CLOSURE_LP_APPROVAL_INFO_GET_URL + closure_id)
    }

    getPoVendorSeqWiseTripFreightMigoData1(po_number,ven_code,sequence) {
        return api.get(FCI_TRIPSHEET_FREIGHT_MIGO_DATA_BY_VPS_URL1 + po_number+'||'+ven_code+'||'+sequence)
    }

    getPoVendorSeqWiseTripLoadingMigoData1(po_number,ven_code,sequence) {
        return api.get(FCI_TRIPSHEET_LOADING_MIGO_DATA_BY_VPS_URL1 + po_number+'||'+ven_code+'||'+sequence)
    }

    /* Reject Freight Migo Expense Submission Data */
    rejectFreightExpenseSubmission(data) {
        return api.post(FCI_TRIP_SHEET_REJECT_FREIGHT_EXPENSE_SUBMISSION_REQUEST_BASE_URL, data)
    }

    /* Reject Loading Migo Expense Submission Data */
    rejectLoadingExpenseSubmission(data) {
        return api.post(FCI_TRIP_SHEET_REJECT_LOADING_EXPENSE_SUBMISSION_REQUEST_BASE_URL, data)
    }

    /* Approve Freight Migo Expense Submission Data */
    approveFreightExpenseSubmission(data) {
        return api.post(FCI_TRIP_SHEET_APPROVE_FREIGHT_EXPENSE_SUBMISSION_REQUEST_BASE_URL, data)
    }

    /* Approve Loading Migo Expense Submission Data */
    approveLoadingExpenseSubmission(data) {
        return api.post(FCI_TRIP_SHEET_APPROVE_LOADING_EXPENSE_SUBMISSION_REQUEST_BASE_URL, data)
    }

    getExpenseValidationData(){
        return api.get(FCI_TRIPSHEET_EXPENSE_VALIDATION_BASE_URL)
    }

    getExpenseValidationApprovalData(){
        return api.get(FCI_TRIPSHEET_EXPENSE_APPROVAL_BASE_URL)
    }

    getIncomeClosureData(){
        return api.get(FCI_TRIPSHEET_INCOME_CLOSURE_BASE_URL)
    }

    getTripClosureInfoById(closure_id) {
        return api.get(FCI_TRIPSHEET_CLOSURE_INFO_GET_URL + closure_id)
    }

    /* Submit Expense Validation Data */
    submitExpenseValidation(data) {
        return api.post(FCI_TRIP_SHEET_SUBMIT_EXPENSE_VALIDATION_REQUEST_BASE_URL, data)
    } 

    /* Reject Expense Posting Data */
    rejectExpensePosting(data) {
        return api.post(FCI_TRIP_SHEET_REJECT_EXPENSE_POSTING_REQUEST_BASE_URL, data)
    } 

    /* Submit Expense Posting Data */
    submitExpensePosting(data) {
        return api.post(FCI_TRIP_SHEET_SUBMIT_EXPENSE_POSTING_REQUEST_BASE_URL, data)
    }  

    /* Submit Income Posting Data */
    submitIncomePosting(data) {
        return api.post(FCI_TRIP_SHEET_SUBMIT_INCOME_POSTING_REQUEST_BASE_URL, data)
    } 

    /* Get All Tripsheet Expenses From DB for Report */
    getTripsheetExpenseDataForReport() {
        return api.get(FCI_TRIPSHEET_EXPENSE_REPORT_VIEW_URL)
    }

    /* Get All Tripsheet Expenses From DB for Report */
    sentTripsheetExpenseDataForReport(data) {
        return api.post(FCI_TRIPSHEET_EXPENSE_REPORT_SENT_URL, data)
    }

    /* Get All Settlement Tripsheets From DB for Report */
    getTripsheetSettlementDataForReport() {
        return api.get(FCI_TRIPSHEET_SETTLEMENT_REPORT_VIEW_URL)
    }

    /* Get All Settlement Tripsheets From DB for Report */
    sentTripsheetSettlementDataForReport(data) {
        return api.post(FCI_TRIPSHEET_SETTLEMENT_REPORT_SENT_URL, data)
    }

    getExpenseApprovalInfoByFPSForFiPayment(closure_sequence) {
        return api.get(FCI_TRIPSHEET_CLOSURE_APPROVAL_INFO_BY_RPS_FOR_FI_PAYMENT_GET_URL + closure_sequence)
    }

    /* Submit Payment Submission Data */
    paymentSubmission(data) {
        return api.post(FCI_TRIP_SHEET_UPDATE_PAYMENT_SUBMISSION_REQUEST_BASE_URL, data)
    }

    /* Get All Rake Payments Entries From DB for Report */
    getPaymentDataForReport() {
        return api.get(PAYMENT_REPORT_VIEW_URL)
    }

     /* Get All Rake Payments Entries From DB for Report */
    sentPaymentDataForReport(data) {
        return api.post(PAYMENT_REPORT_SENT_URL, data)
    }

    /* Submit FI Closure Submission Data */
    fiSubmission(data) {
        return api.post(FCI_TRIP_SHEET_UPDATE_FI_CLOSURE_SUBMISSION_REQUEST_BASE_URL, data)
    }

    /* Get All FCI FI - Entries From DB for Report */
    getFiEntryDataForReport() {
        return api.get(FIENTRY_REPORT_VIEW_URL)
    }

    /* Get All FCI FI - Entries From DB for Report */
    sentFiEntryDataForReport(data) {
        return api.post(FIENTRY_REPORT_SENT_URL, data)
    }
    
}
export default new FCIClosureSubmissionService()