import AppConfig from 'src/AppConfig'
import api from '../Config' 

const FCI_TRIPSHEET_CREATION_URL = AppConfig.api.baseUrl + '/FCI/Sap/tripsheet-creation'
const FCI_SENT_VA_INFO_URL = AppConfig.api.baseUrl + '/FCI/Sap/sent-vendor-assignment-info' 
const FCI_TRIPSHEET_UPDATION_URL = AppConfig.api.baseUrl + '/FCI/Sap/tripsheet-updation' 
const FCI_GET_POP_VENDOR_GROUPING_DATA_URL = AppConfig.api.baseUrl + '/FCI/Sap/check-po_plant-delivery-available/'
const FCI_GET_POP_LOAD_VENDOR_GROUPING_DATA_URL = AppConfig.api.baseUrl + '/FCI/Sap/check-po_plant-load-delivery-available/'

const TRIPSHEET_TRIP_EXPENSES_BY_FPS_NO = AppConfig.api.baseUrl + '/FCI/Sap/ts-hire-expenses/DataByFpsNo'
const HIRE_VENDOR_PAYMENT_POST_API_URL = AppConfig.api.baseUrl + '/FCI/Sap/payment-submission' 
const FCI_TRIPSHEET_SAP_INCOME_POSTING_URL = AppConfig.api.baseUrl + '/FCI/Sap/income-posting' 
const FCI_TRIPSHEET_SAP_EXPENSE_POSTING_URL = AppConfig.api.baseUrl + '/FCI/Sap/expense-posting'  

class FCITripsheetSapService {

  /* Tripsheet Creation Process */
  createTripsheet(data) {
    return api.post(FCI_TRIPSHEET_CREATION_URL, data)
  }

  /* Send VA Info to SAP */
  sentVAInfoToSAP(data) {
    return api.post(FCI_SENT_VA_INFO_URL, data)
  }

  /* Sent Tripsheet Info To Update SAP Process for Individual Tripsheet */
  UpdateTSInfoToSAP(data) {
    return api.post(FCI_TRIPSHEET_UPDATION_URL, data)
  }

  // GET SINGLE FNR-Vendor Freight DATA FROM SAP
  getpopVendorDeliveryData(po_number,plant_code) {
    return api.get(FCI_GET_POP_VENDOR_GROUPING_DATA_URL + po_number+'||'+plant_code)
  }

  // GET SINGLE FNR-Vendor Loading DATA FROM SAP
  getpopLoadVendorDeliveryData(po_number,plant_code) {
    return api.get(FCI_GET_POP_LOAD_VENDOR_GROUPING_DATA_URL + po_number+'||'+plant_code)
  }

  fciSAPExpensePosting(data) {
    return api.post(FCI_TRIPSHEET_SAP_EXPENSE_POSTING_URL, data)
  }
  
  fciSAPIncomePosting(data) {
    return api.post(FCI_TRIPSHEET_SAP_INCOME_POSTING_URL, data)
  }

  /* Get SAP Expenses With or Without TDS by using FPS No */
  getSapTripExpensesByFpsNo(fps_no) {
    return api.get(TRIPSHEET_TRIP_EXPENSES_BY_FPS_NO + '/' + fps_no)
  }

  /* Payment Posting */
  fciHireVendorPaymentPost(data) {
    return api.post(HIRE_VENDOR_PAYMENT_POST_API_URL, data)
  }

}

export default new FCITripsheetSapService()
