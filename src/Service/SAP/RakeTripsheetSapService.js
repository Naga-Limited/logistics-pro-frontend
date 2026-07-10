import AppConfig from 'src/AppConfig'
import api from '../Config'

const RAKE_TRIPSHEET_CREATION_URL = AppConfig.api.baseUrl + '/Rake/Sap/tripsheet-creation'
const RAKE_TRIPSHEET_UPDATION_URL = AppConfig.api.baseUrl + '/Rake/Sap/tripsheet-updation'
const RAKE_GET_FNR_VENDOR_GROUPING_DATA_URL = AppConfig.api.baseUrl + '/Rake/Sap/check-fnr_vendor-delivery-available/'
const RAKE_TRIPSHEET_INCOME_SUBMISSION_URL = AppConfig.api.baseUrl + '/Rake/Sap/income-submission'
const RAKE_TRIPSHEET_EXPENSE_SUBMISSION_URL = AppConfig.api.baseUrl + '/Rake/Sap/expense-submission'
const TRIPSHEET_TRIP_EXPENSES_BY_RPS_NO = AppConfig.api.baseUrl + '/Rake/Sap/ts-hire-expenses/DataByRpsNo'
const HIRE_VENDOR_PAYMENT_POST_API_URL = AppConfig.api.baseUrl + '/Rake/Sap/payment-submission'

class RakeTripsheetSapService {

  /* Tripsheet Creation Process */
  createTripsheet(data) {
    return api.post(RAKE_TRIPSHEET_CREATION_URL, data)
  }

  /* Sent Tripsheet Info To Update SAP Process for Individual Tripsheet */
  UpdateTSInfoToSAP(data) {
    return api.post(RAKE_TRIPSHEET_UPDATION_URL, data)
  }

  // GET SINGLE FNR-Vendor DATA FROM SAP
  getFnrVendorDeliveryData(fnr_number,ven_code) {
    return api.get(RAKE_GET_FNR_VENDOR_GROUPING_DATA_URL + fnr_number+'||'+ven_code)
  }

  rakeIncomeSubmission(data) {
    return api.post(RAKE_TRIPSHEET_INCOME_SUBMISSION_URL, data)
  }

  rakeExpenseSubmission(data) {
    return api.post(RAKE_TRIPSHEET_EXPENSE_SUBMISSION_URL, data)
  }

  /* Get SAP Expenses With or Without TDS by using RPS No */
  getSapTripExpensesByRpsNo(rps_no) {
    return api.get(TRIPSHEET_TRIP_EXPENSES_BY_RPS_NO + '/' + rps_no)
  }

  /* Payment Posting */
  rakeHireVendorPaymentPost(data) {
    return api.post(HIRE_VENDOR_PAYMENT_POST_API_URL, data)
  }

}

export default new RakeTripsheetSapService()
