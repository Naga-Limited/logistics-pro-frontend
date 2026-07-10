
import AppConfig from "src/AppConfig";
import api from "../Config";

const FI_ENTRY_URL = AppConfig.api.baseUrl+ '/fi_entry'
const FI_ENTRY_VEHICLE_URL = AppConfig.api.baseUrl+ '/fi_index'
const FI_ENTRY_CREATE_URL = AppConfig.api.baseUrl + '/fi_entry'
const FI_ENTRY_SINGLE_URL = AppConfig.api.baseUrl+ '/fi_entry_single'
const RJ_SO_SINGLE_DATA_URL = AppConfig.api.baseUrl+ '/rj_so_show'
const RJ_SO_OVER_ALL = AppConfig.api.baseUrl+ '/rj_so_get_data_fi'
const FJ_SO_DATA_URL = AppConfig.api.baseUrl+ '/index_customer_list'
const FJ_SO_SINGLE_DATA_URL = AppConfig.api.baseUrl+ '/vehicle_customer_info_details_show'
const FI_REGISTER_LIST_URL = AppConfig.api.baseUrl+ '/fi_entry_tripsheet_details/'
const CASH_PAYMENT_USER_ACCESS = AppConfig.api.baseUrl+ '/fi_advance_access/'


class FIEntryService {

   getFIEntryVehicles()
   {
    return api.get(FI_ENTRY_URL)
   }
   getFIEntryVehiclesList()
   {
    return api.get(FI_ENTRY_VEHICLE_URL)
   }
   getFIEntrySingleVehicle(Id) {
    return api.get(FI_ENTRY_SINGLE_URL + '/' + Id)
  }
  addFiEntryData(data) {
    return api.post(FI_ENTRY_CREATE_URL, data)
  }
  getSalesOrderSingle(Id) {
    return api.get(RJ_SO_SINGLE_DATA_URL + '/' + Id)
  }
  getFIEntryRJSOVehicles()
   {
    return api.get(RJ_SO_OVER_ALL)
   }
  getFJSalesOrder(Id) {
    return api.get(FJ_SO_DATA_URL+ '/' + Id)
  }
  getFJSalesOrderSingle(Id) {
    return api.get(FJ_SO_SINGLE_DATA_URL + '/' + Id)
  }
  singleTripFIDetailsList(id) {
    return api.get(FI_REGISTER_LIST_URL+ id)
  }

  CashPaymentUserAccess(id) {
    return api.get(CASH_PAYMENT_USER_ACCESS+ id)
  }

}
export default new  FIEntryService()
