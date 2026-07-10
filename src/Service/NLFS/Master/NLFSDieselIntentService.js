import AppConfig from 'src/AppConfig'
import api from 'src/Service/Config' 

const NLFS_DIESEL_INDENT_INSERT_URL = AppConfig.api.baseUrl + '/NLFS/Diesel_Indent_Create' 
const NLFS_DIESEL_INDENT_CONFIRM_URL = AppConfig.api.baseUrl + '/NLFS/Get_Diesel_Indent_confirm/'
const NLFS_DIESEL_INDENT_APPROVAL_URL = AppConfig.api.baseUrl + '/NLFS/Get_Diesel_Indent_approval/'
const NLFS_DIESEL_INDENT_CONFIRM_UPDATE_URL = AppConfig.api.baseUrl + '/NLFS/Update_Diesel_Indent_confirm'
const NLFS_DIESEL_INDENT_CANCEL_URL = AppConfig.api.baseUrl + '/NLFS/Cancel_Diesel_Indent'
const NLFS_BUNK_READING_OCR_DATA_FETCH_URL = AppConfig.api.baseUrl + '/NLFS/OCR/Bunk_Reading_Data'
const NLFS_ACCOUNTS_APPROVAL_REQUEST_SENT_URL = AppConfig.api.baseUrl + '/NLFS/accounts_approval_request_sent'
const NLFS_ACCOUNTS_APPROVAL_SUBMISSION_SENT_URL = AppConfig.api.baseUrl + '/NLFS/accounts_approval_submission_sent'
const NLFS_DIESEL_INDENT_SO_CREATION_SUBMISSION_SENT_URL = AppConfig.api.baseUrl + '/nlfs_so_creation_sent'
const NLFS_DIESEL_INDENT_DO_CREATION_SUBMISSION_SENT_URL = AppConfig.api.baseUrl + '/nlfs_do_creation_sent'
const NLFS_DIESEL_INDENT_INVOICE_CREATION_SUBMISSION_SENT_URL = AppConfig.api.baseUrl + '/nlfs_invoice_creation_sent'
const NLFS_DIESEL_INDENT_VENDOR_INVOICE_CREATION_SUBMISSION_SENT_URL = AppConfig.api.baseUrl + '/nlfs_vendor_invoice_creation_sent'
const NLFS_DIESEL_INDENT_EBILL_CREATION_SUBMISSION_SENT_URL = AppConfig.api.baseUrl + '/nlfs_ebill_creation_sent'
const NLFS_DIESEL_INDENT_SN_GENERATION_URL = AppConfig.api.baseUrl + '/NLFS/DIS_No_Generation_List/'
const NLFS_DIESEL_INDENT_SN_GENERATION_FILTER_URL = AppConfig.api.baseUrl + '/NLFS/DIS_No_Generation_List_Filter'
const NLFS_DIESEL_INDENT_SUBMISSION_URL = AppConfig.api.baseUrl + '/NLFS/DIS_Creation'
const NLFS_DIESEL_VENDOR_RECEIPT_GENERATION_URL = AppConfig.api.baseUrl + '/NLFS/DIS_Receipt_Generation_List/'
const NLFS_DIS_REJECT_ALL_DIESEL_INDENT_REQUEST_BASE_URL = AppConfig.api.baseUrl + '/NLFS/DISSubmissionAllIndentReject'
const NLFS_DIESEL_VENDOR_INVOICE_CREATION_URL = AppConfig.api.baseUrl + '/NLFS/DIS_Invoice_Creation_List/'
const NLFS_DIESEL_REPORT_URL = AppConfig.api.baseUrl+ '/NLFS/nlfs_diesel_intent_register'
const SINGLE_NLFS_DIESEL_LIST = AppConfig.api.baseUrl+ '/NLFS/nlfs_diesel_intent_register'

class NLFSDieselIntentService {
  createDiesel(data) {
    return api.post(NLFS_DIESEL_INDENT_INSERT_URL, data)
  }
  getVehicleReadyToDIConfirm() {
    return api.get(NLFS_DIESEL_INDENT_CONFIRM_URL)
  }
  getVehicleReadyToDieselApproval() {
    return api.get(NLFS_DIESEL_INDENT_APPROVAL_URL)
  }
  getNLFSDIInfoById(id) {
    return api.get(NLFS_DIESEL_INDENT_INSERT_URL + '/' + id)
  }
  updateDieselConfirmation(data) {
    return api.post(NLFS_DIESEL_INDENT_CONFIRM_UPDATE_URL, data)
  }
  cancelDieselIndentRequest(value) {
    return api.post(NLFS_DIESEL_INDENT_CANCEL_URL, value)
  }
  brOCRFetch(value) {
    return api.post(NLFS_BUNK_READING_OCR_DATA_FETCH_URL, value)
  }

  /* Accounts Approval Request Given */
  accountsApprovalRequest(data) {
    return api.post(NLFS_ACCOUNTS_APPROVAL_REQUEST_SENT_URL, data)
  }

  /* Accounts Approval Submission Given */
  accountsApprovalSumission(data) {
    return api.post(NLFS_ACCOUNTS_APPROVAL_SUBMISSION_SENT_URL, data)
  }

  /* SO Creation Submission Given */
  NLFSSOCreation(data) {
    return api.post(NLFS_DIESEL_INDENT_SO_CREATION_SUBMISSION_SENT_URL, data)
  }

  /* DO Creation Submission Given */
  NLFSDOCreation(data) {
    return api.post(NLFS_DIESEL_INDENT_DO_CREATION_SUBMISSION_SENT_URL, data)
  }

  /* Invoice Creation Submission Given */
  NLFSInvoiceCreation(data) {
    return api.post(NLFS_DIESEL_INDENT_INVOICE_CREATION_SUBMISSION_SENT_URL, data)
  }

  /* Eway Bill Creation Submission Given */
  NLFSEWayBillCreation(data) {
    return api.post(NLFS_DIESEL_INDENT_EBILL_CREATION_SUBMISSION_SENT_URL, data)
  }

  /* Invoice Creation Submission Given */
  NLFSVendorInvoiceCreation(data) {
    return api.post(NLFS_DIESEL_INDENT_VENDOR_INVOICE_CREATION_SUBMISSION_SENT_URL, data)
  }

  getNLFSVehicleReadyToDieselIndentSequenceNumberGeneration() {
    return api.get(NLFS_DIESEL_INDENT_SN_GENERATION_URL)
  }

  filterNLFSVehicleReadyToDieselIndentSequenceNumberGeneration(data) {
    return api.post(NLFS_DIESEL_INDENT_SN_GENERATION_FILTER_URL, data)
  }

  /* Sent Trip DI info to DB */
  sentDISubmissionData(data) {
    return api.post(NLFS_DIESEL_INDENT_SUBMISSION_URL, data)
  }

  getNLFSPaymentReceiptGeneration() {
    return api.get(NLFS_DIESEL_VENDOR_RECEIPT_GENERATION_URL)
  } 

  getNLFSVehicleReadyToDieselIndentVendorInvoiceGeneration() {
    return api.get(NLFS_DIESEL_VENDOR_INVOICE_CREATION_URL)
  }

  getNLFSDISInfoById(id) { 
    return api.get(NLFS_DIESEL_INDENT_SUBMISSION_URL + '/' + id)
  }  

  /* Reject All Trip DI Data */
  rejectAllNLFSTripDiData(data) {
    return api.post(NLFS_DIS_REJECT_ALL_DIESEL_INDENT_REQUEST_BASE_URL, data)
  }

  NlfsDieselReport(data){
    return api.post(NLFS_DIESEL_REPORT_URL,data)
  }

  singleNlfsDieselDetailsList(id) {
    return api.get(SINGLE_NLFS_DIESEL_LIST+ '/'+id)
  }

}

export default new NLFSDieselIntentService()
