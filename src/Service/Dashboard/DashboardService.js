import AppConfig from "src/AppConfig";
import api from "../Config";

const DASHBOARD_URL = AppConfig.api.baseUrl + '/dashboard/'
const DASHBOARD_TRIPSHEET_URL = AppConfig.api.baseUrl + '/dashboard_tripsheet/'
const DASHBOARD_ALLDETAILS_URL = AppConfig.api.baseUrl + '/dashboard_all/'
const DASHBOARD_DETAILSIFOODS_URL = AppConfig.api.baseUrl + '/dashboard_ifoods/'
const DASHBOARD_DETAILSIFOODS_DETAILS_URL = AppConfig.api.baseUrl + '/dashboard_ifoods_new'

class DashboardService {

  getDashboardDetails() {
    return api.get(DASHBOARD_URL)
  }
  getDashboardTripSheetDetails() {
    return api.get(DASHBOARD_TRIPSHEET_URL)
  }
  getDashboardOverAllDetails() {
    return api.get(DASHBOARD_ALLDETAILS_URL)
  }
  getDashboardDetailsIfoods(values) {
    return api.get(DASHBOARD_DETAILSIFOODS_URL)
  }
  getDashboardDetailsIfoodsByDateRange(startDate, endDate) {
    const url = `${DASHBOARD_DETAILSIFOODS_DETAILS_URL}?start_date=${startDate}&end_date=${endDate}`;
    return api.post(url)
  }
}

export default new  DashboardService()
