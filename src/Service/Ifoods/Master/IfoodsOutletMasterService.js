import AppConfig from 'src/AppConfig'
import api from 'src/Service/Config'

const IFOODS_OUTLET_MASTER_BASE_URL = AppConfig.api.baseUrl + '/Ifoods/Outlet'
const IFOODS_OUTLET_MASTER_BASED_ON_CONTRACTOR_ID_VIEW_URL = AppConfig.api.baseUrl + '/Ifoods/OutletByVendor'
const IFOODS_ACTIVE_OUTLET_LIST_URL = AppConfig.api.baseUrl + '/Ifoods/ActiveOutlet'

class IfoodsOutletMasterService {
  getIfoodsOutlets() {
    return api.get(IFOODS_OUTLET_MASTER_BASE_URL)
  }
  getActiveIfoodsOutlet() {
    return api.get(IFOODS_ACTIVE_OUTLET_LIST_URL)
  }

  createIfoodsOutlet(value) {
    return api.post(IFOODS_OUTLET_MASTER_BASE_URL, value)
  }

  getIfoodsOutletById(OutletId) {
    return api.get(IFOODS_OUTLET_MASTER_BASE_URL + '/' + OutletId)
  }

  getIfoodsOutletByVendorId(contractorId) {
    return api.get(IFOODS_OUTLET_MASTER_BASED_ON_CONTRACTOR_ID_VIEW_URL + '/' + contractorId)
  }

  updateOutlets(OutletId, Outlets) {
    return api.post(IFOODS_OUTLET_MASTER_BASE_URL + '/' + OutletId, Outlets)
  }

  deleteIfoodsOutlet(OutletId) {
    return api.delete(IFOODS_OUTLET_MASTER_BASE_URL + '/' + OutletId)
  }
}

export default new IfoodsOutletMasterService()
