
import AppConfig from "src/AppConfig";
import api from "../Config";

const FAST_TAG_ENTRY_URL = AppConfig.api.baseUrl+ '/getTransactionDetails'
const FAST_TAG_ENTRY_SINGLE_URL = AppConfig.api.baseUrl+ '/getTransactionDetails'

const FAST_TAG_REPORT_VIEW_URL = AppConfig.api.baseUrl + '/fasttag_report'
const FAST_TAG_REPORT_SENT_URL = AppConfig.api.baseUrl + '/FastTagReportRequest'

class FastTagTransactionService {

   getFastVehicles()
   {
    return api.get(FAST_TAG_ENTRY_URL)
   }
   getFastSingleVehicle(Id) {
    return api.get(FAST_TAG_ENTRY_SINGLE_URL + '/' + Id)
  }

  getFastTagDataForReport() {
    return api.get(FAST_TAG_REPORT_VIEW_URL)
  }

  sentFastTagDataForReport(data) {
      return api.post(FAST_TAG_REPORT_SENT_URL, data)
  }

}
export default new  FastTagTransactionService()
