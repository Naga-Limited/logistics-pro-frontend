import AppConfig from 'src/AppConfig'
import api from 'src/Service/Config'

const TRIPSHEET_EXPENSE_TOLL_EXPENSE_POST_API_URL = AppConfig.api.baseUrl + '/sap/ts-nlmt-toll-expense-post'
const TRIPSHEET_EXPENSE_DRIVER_EXPENSE_POST_API_URL = AppConfig.api.baseUrl + '/sap/ts-nlmt-driver-expense-post'
const TRIPSHEET_SETTLEMENT_DIVISION_INCOME_POST_API_URL = AppConfig.api.baseUrl + '/sap/ts-nlmt-division-income-post'
const TRIPSHEET_SETTLEMENT_DIVISION_EXPENSE_POST_API_URL = AppConfig.api.baseUrl + '/sap/ts-nlmt-division-expense-post'
const TRIPSHEET_SETTLEMENT_RJCUSTOMER_INCOME_POST_API_URL = AppConfig.api.baseUrl + '/sap/ts-nlmt-rjcustomer-income-post'
const DEPO_GET_FASTTAG_DATA_BY_VEHICLE_ID = AppConfig.api.baseUrl + '/getTransactionDetails/DataByVehicleId'
const TRIPSHEET_TRIP_EXPENSES_BY_TRIPSHEET_NO = AppConfig.api.baseUrl + '/sap/ts-hire-expenses/DataByTripsheetNo'
const HIRE_TRIPSHEET_DEDUCTION_POST_API_URL = AppConfig.api.baseUrl + '/sap/ts-hire-deduction-post'
const HIRE_TRIPSHEET_PAYMENT_POST_API_URL = AppConfig.api.baseUrl + '/sap/ts-hire-payment-post'
const HIRE_TRIPSHEET_EXPENSE_WITHOUT_DEDUCTION_POST_API_URL = AppConfig.api.baseUrl + '/sap/ts-hire-expense-without-deduction-post'

class NlmtTripSheetClosureSapService {
  driverExpensePost(data) {
    return api.post(TRIPSHEET_EXPENSE_DRIVER_EXPENSE_POST_API_URL, data)
  } 

  tollExpensePost(data) {
    return api.post(TRIPSHEET_EXPENSE_TOLL_EXPENSE_POST_API_URL, data)
  }

  /* Get Fasttag Entries By VehicleId From Database */
  getFasttagEntriesByVehicleId(id) {
    return api.get(DEPO_GET_FASTTAG_DATA_BY_VEHICLE_ID + '/' + id)
  }

  tsDivisionExpensePost(data) {
    return api.post(TRIPSHEET_SETTLEMENT_DIVISION_EXPENSE_POST_API_URL, data)
  }

  tsDivisionIncomePost(data) {
    return api.post(TRIPSHEET_SETTLEMENT_DIVISION_INCOME_POST_API_URL, data)
  }

  rjCustomerIncomePost(data) {
    return api.post(TRIPSHEET_SETTLEMENT_RJCUSTOMER_INCOME_POST_API_URL, data)
  }

  /* Get SAP Expenses With or Without TDS by using Tripsheet No */
  getSapTripExpensesByTripsheetNo(tripsheet_no) {
    return api.get(TRIPSHEET_TRIP_EXPENSES_BY_TRIPSHEET_NO + '/' + tripsheet_no)
  }

  hireTripsheetDeductionPost(data) {
    return api.post(HIRE_TRIPSHEET_DEDUCTION_POST_API_URL, data)
  }

  hireTripsheetPaymentPost(data) {
    return api.post(HIRE_TRIPSHEET_PAYMENT_POST_API_URL, data)
  }

  hireTripsheetExpenseWithoutDeductionPost(data) {
    return api.post(HIRE_TRIPSHEET_EXPENSE_WITHOUT_DEDUCTION_POST_API_URL, data)
  }

}
export default new NlmtTripSheetClosureSapService()
