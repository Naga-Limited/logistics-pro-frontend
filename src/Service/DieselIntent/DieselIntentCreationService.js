import AppConfig from 'src/AppConfig'
import api from '../Config'

const DIESEL_BASE_URL = AppConfig.api.baseUrl + '/Diesel/'
const DIESEL_CREATE_URL = AppConfig.api.baseUrl + '/Diesel'
const DIESEL_INDENT_REQUEST_CANCEL_URL = AppConfig.api.baseUrl + '/Diesel_indent_cancel'
const DIESEL_CONFIRM_URL = AppConfig.api.baseUrl + '/Diesel_confirm/'
const DIESEL_VENDOR_URL = AppConfig.api.baseUrl + '/dieselvendor/'
const ACTIVE_DIESEL_VENDOR_URL = AppConfig.api.baseUrl + '/active_diesel_vendors_list/'
const DIESEL_APPROVAL_URL = AppConfig.api.baseUrl + '/Diesel_Approval/'
const DIESEL_REGISTER_VENDOR_URL = AppConfig.api.baseUrl + '/register_vendor_index/'
const DIESEL_CREATE_REGISTER_URL = AppConfig.api.baseUrl + '/Register_Vendor'
const DIESEL_VENDOR_CHANGE_URL = AppConfig.api.baseUrl + '/Register_Diesel_Vendor_Change'
const ACCOUNTS_APPROVAL_REQUEST_SENT_URL = AppConfig.api.baseUrl + '/accounts_approval_request_sent'
const ACCOUNTS_APPROVAL_SUBMISSION_SENT_URL = AppConfig.api.baseUrl + '/accounts_approval_submission_sent'
const DIESEL_INDENT_SO_CREATION_SUBMISSION_SENT_URL = AppConfig.api.baseUrl + '/so_creation_sent'
const DIESEL_INDENT_DO_CREATION_SUBMISSION_SENT_URL = AppConfig.api.baseUrl + '/do_creation_sent'
const DIESEL_INDENT_INVOICE_CREATION_SUBMISSION_SENT_URL = AppConfig.api.baseUrl + '/invoice_creation_sent'
const DIESEL_CREATE_REGISTER_LIST_URL = AppConfig.api.baseUrl + '/diesel_details_get_single_trip/'
const DIESEL_INDENT_SN_GENERATION_URL = AppConfig.api.baseUrl + '/DIS_No_Generation_List/'
const DIESEL_VENDOR_INVOICE_CREATION_URL = AppConfig.api.baseUrl + '/DIS_Invoice_Creation_List/'
const DIESEL_PAYMENT_GENERATION_URL = AppConfig.api.baseUrl + '/DIS_Payment_Generation_List/'
const DIS_REJECT_ALL_DIESEL_INDENT_REQUEST_BASE_URL = AppConfig.api.baseUrl + '/DISSubmissionAllIndentReject'
const DIS_VENDOR_INVOICE_POST_API_URL = AppConfig.api.baseUrl + '/sap/dis-vendor-invoice-posting'
const DIS_VENDOR_PAYMENT_POST_API_URL = AppConfig.api.baseUrl + '/sap/dis-vendor-payment-posting'
const NLFS_DIS_PAYMENT_RECEIPT_POST_API_URL = AppConfig.api.baseUrl + '/sap/nlfs-dis-payment-receipt-posting'
const DIS_VENDOR_INVOICE_POSTING_SEND_URL = AppConfig.api.baseUrl + '/dis_vendor_invoice_creation_sent'
const DIS_VENDOR_PAYMENT_POSTING_SEND_URL = AppConfig.api.baseUrl + '/dis_vendor_payment_creation_sent'
const NLFS_DIS_PAYMENT_RECEIPT_POSTING_SEND_URL = AppConfig.api.baseUrl + '/nlfs_dis_payment_receipt_creation_sent'
const DIS_TRIP_EXPENSES_BY_DIS_NO = AppConfig.api.baseUrl + '/sap/dis-expenses/DataByDisNo'

class DieselIntentCreationService {
  getVehicleReadyToDiesel() {
    return api.get(DIESEL_BASE_URL)
  }
  getSingleVehicleInfoOnGate(parkingYardID) {
    return api.get(DIESEL_BASE_URL + parkingYardID)
  }
  getSingleVehicleInfoOnConfirm(parkingYardID) {
    return api.get(DIESEL_BASE_URL + parkingYardID)
  }
  createDiesel(data) {
    return api.post(DIESEL_CREATE_URL, data)
  }
  updateDiesel(id, values) {
    return api.post(DIESEL_BASE_URL + id, values)
  }
  getDieselVendor() {
    return api.get(DIESEL_VENDOR_URL)
  }
  getActiveDieselVendors() {
    return api.get(ACTIVE_DIESEL_VENDOR_URL)
  }
  getDieselInfoById(id) {
    return api.get(DIESEL_VENDOR_URL + id)
  }
  getVehicleReadyToDieselConfirm() {
    return api.get(DIESEL_CONFIRM_URL)
  }
  getVehicleReadyToDieselApproval() {
    return api.get(DIESEL_APPROVAL_URL)
  }
  getVehicleReadyToDieselRegisterVendor() {
    return api.get(DIESEL_REGISTER_VENDOR_URL)
  }
  createDieselRegisterVendor(data) {
    return api.post(DIESEL_CREATE_REGISTER_URL, data)
  }
  singleAdditionalDieselDetailsList(id) {
    return api.get(DIESEL_CREATE_REGISTER_LIST_URL+ id)
  }
  cancelDieselIndentRequest(value) {
    return api.post(DIESEL_INDENT_REQUEST_CANCEL_URL, value)
  }

  /* Diesel Vendor Change By Admin */
  adminUpdateDieselVendor(data) {
    return api.post(DIESEL_VENDOR_CHANGE_URL, data)
  }

  /* Accounts Approval Request Given */
  accountsApprovalRequest(data) {
    return api.post(ACCOUNTS_APPROVAL_REQUEST_SENT_URL, data)
  }

  /* Accounts Approval Submission Given */
  accountsApprovalSumission(data) {
    return api.post(ACCOUNTS_APPROVAL_SUBMISSION_SENT_URL, data)
  }

  /* SO Creation Submission Given */
  NLFSSOCreation(data) {
    return api.post(DIESEL_INDENT_SO_CREATION_SUBMISSION_SENT_URL, data)
  }

  /* DO Creation Submission Given */
  NLFSDOCreation(data) {
    return api.post(DIESEL_INDENT_DO_CREATION_SUBMISSION_SENT_URL, data)
  }

  /* Invoice Creation Submission Given */
  NLFSInvoiceCreation(data) {
    return api.post(DIESEL_INDENT_INVOICE_CREATION_SUBMISSION_SENT_URL, data)
  }

  getVehicleReadyToDieselIndentSequenceNumberGeneration() {
    return api.get(DIESEL_INDENT_SN_GENERATION_URL)
  }

  getVehicleReadyToVendorInvoiceCreation() {
    return api.get(DIESEL_VENDOR_INVOICE_CREATION_URL)
  }

  getVehicleReadyToDisPaymentGeneration() {
    return api.get(DIESEL_PAYMENT_GENERATION_URL)
  }

  /* Reject All Trip DI Data */
  rejectAllTripDiData(data) {
    return api.post(DIS_REJECT_ALL_DIESEL_INDENT_REQUEST_BASE_URL, data)
  }

  /* SAP DIS Vendor Invoice Creation */
  disSapVendorInvoiceCreation(data){
    return api.post(DIS_VENDOR_INVOICE_POST_API_URL, data)
  }

  /* SAP DIS Vendor Payment Creation */
  disSapVendorPaymentCreation(data){
    return api.post(DIS_VENDOR_PAYMENT_POST_API_URL, data)
  }

  /* SAP NLFS DIS Payment Receipt Creation */
  nlfsDisSapPaymentReceiptCreation(data){
    return api.post(NLFS_DIS_PAYMENT_RECEIPT_POST_API_URL, data)
  }

  /* Sent Vendor Invoice Creation info to DB */
  sendVendorInvoiceCreation(data) {
    return api.post(DIS_VENDOR_INVOICE_POSTING_SEND_URL, data)
  }

  /* Sent Vendor Payment Creation info to DB */
  sendVendorPaymentCreation(data) {
    return api.post(DIS_VENDOR_PAYMENT_POSTING_SEND_URL, data)
  }

  /* Sent Payment Receipt Creation info to DB */
  sendNLFSPaymentReceiptCreation(data) {
    return api.post(NLFS_DIS_PAYMENT_RECEIPT_POSTING_SEND_URL, data)
  }

  /* Get SAP Expenses With or Without TDS by using Dis No */
  getSapTripExpensesByDisNo(dis_no) {
    return api.get(DIS_TRIP_EXPENSES_BY_DIS_NO + '/' + dis_no)
  }

}

export default new DieselIntentCreationService()
