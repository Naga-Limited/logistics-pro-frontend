import AppConfig from 'src/AppConfig'
import api from 'src/Service/Config'

const DEPO_ROUTE_MASTER_BASE_URL = AppConfig.api.baseUrl + '/Depo/Route'
const DEPO_GET_ROUTES_BY_LOCATION_URL = AppConfig.api.baseUrl + '/Depo/RoutesFromLocation'
const DEPO_GET_CONTRCATORS_BY_LOCATION_URL = AppConfig.api.baseUrl + '/Depo/ContractorsFromLocation'

class DepoRouteMasterService {

  getDepoRoutes() {
    return api.get(DEPO_ROUTE_MASTER_BASE_URL)
  }

  createDepoRoute(value) {
    return api.post(DEPO_ROUTE_MASTER_BASE_URL, value)
  }

  getDepoRouteById(id) {
    return api.get(DEPO_ROUTE_MASTER_BASE_URL + '/' + id)
  }

  getDepoRoutesByDepoLocationId(locationId) {
    return api.get(DEPO_GET_ROUTES_BY_LOCATION_URL + '/' + locationId)
  }

  getDepoContractorsByDepoLocationId(locationId) {
    return api.get(DEPO_GET_CONTRCATORS_BY_LOCATION_URL + '/' + locationId)
  }

  updateDepoRoutes(id, Routes) {
    return api.post(DEPO_ROUTE_MASTER_BASE_URL + '/' + id, Routes)
  }

  deleteDepoRoute(id) {
    return api.delete(DEPO_ROUTE_MASTER_BASE_URL + '/' + id)
  }
}

export default new DepoRouteMasterService()
