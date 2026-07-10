import AppConfig from 'src/AppConfig'
import api from 'src/Service/Config'

const IFOODS_ROUTE_MASTER_BASE_URL = AppConfig.api.baseUrl + '/Ifoods/Route'
const IFOODS_ACTIVE_ROUTES_LIST_URL = AppConfig.api.baseUrl + '/Ifoods/ActiveRoute'
const IFOODS_GET_VENDOR_BY_LOCATION_URL = AppConfig.api.baseUrl + '/Ifoods/VendorsFromLocation'

class IfoodsRouteMasterService {

  getIfoodsRoutes() {
    return api.get(IFOODS_ROUTE_MASTER_BASE_URL)
  }
  getActiveIfoodsRoutes() {
    return api.get(IFOODS_ACTIVE_ROUTES_LIST_URL)
  }

  createIfoodsRoute(value) {
    return api.post(IFOODS_ROUTE_MASTER_BASE_URL, value)
  }

  getIfoodsRouteById(id) {
    return api.get(IFOODS_ROUTE_MASTER_BASE_URL + '/' + id)
  }

  getIfoodsRoutesByIfoodsLocationId(locationId) {
    return api.get(IFOODS_GET_ROUTES_BY_LOCATION_URL + '/' + locationId)
  }

  getIfoodsVendorsByIfoodsLocationId(locationId) {
    return api.get(IFOODS_GET_VENDOR_BY_LOCATION_URL + '/' + locationId)
  }

  updateIfoodsRoutes(id, Routes) {
    return api.post(IFOODS_ROUTE_MASTER_BASE_URL + '/' + id, Routes)
  }

  deleteIfoodsRoute(id) {
    return api.delete(IFOODS_ROUTE_MASTER_BASE_URL + '/' + id)
  }
}

export default new IfoodsRouteMasterService()
