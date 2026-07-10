import AppConfig from 'src/AppConfig'
import api from 'src/Service/Config'

const NLMT_ROUTE_MASTER_BASE_URL = AppConfig.api.baseUrl + '/Nlmt/Route'
const NLMT_ROUTE_LATEST_END_DATE_URL = AppConfig.api.baseUrl + '/Nlmt/Route/LatestEndDate'


class NlmtRouteMasterService {

  getNlmtRoutes() {
    return api.get(NLMT_ROUTE_MASTER_BASE_URL)
  }

  createNlmtRoute(value) {
    return api.post(NLMT_ROUTE_MASTER_BASE_URL, value)
  }

  getNlmtRouteById(id) {
    return api.get(NLMT_ROUTE_MASTER_BASE_URL + '/' + id)
  }

  updateNlmtRoutes(id, Routes) {
    return api.post(NLMT_ROUTE_MASTER_BASE_URL + '/' + id, Routes)
  }

  deleteNlmtRoute(id) {
    return api.delete(NLMT_ROUTE_MASTER_BASE_URL + '/' + id)
  }

  // Fetch the latest end_date for a given route name (used to auto-fill start_date of next record)
  getLatestEndDateByRouteName(routeName) {
    return api.get(NLMT_ROUTE_LATEST_END_DATE_URL + '/' + encodeURIComponent(routeName))
  }
}

export default new NlmtRouteMasterService()
