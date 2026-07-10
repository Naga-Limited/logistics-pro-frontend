import AppConfig from 'src/AppConfig'
import api from 'src/Service/Config'

const IFOODS_VENDOR_MASTER_BASE_URL = AppConfig.api.baseUrl + '/Ifoods/Vendor'
const IFOODS_ACTIVE_VENDORS_LIST_URL = AppConfig.api.baseUrl + '/Ifoods/ActiveVendor'

class IfoodsVendorMasterService {
  getIfoodsVendors() {
    return api.get(IFOODS_VENDOR_MASTER_BASE_URL)
  }

  getActiveIfoodsVendors() {
    return api.get(IFOODS_ACTIVE_VENDORS_LIST_URL)
  }

  createIfoodsVendor(value) {
    return api.post(IFOODS_VENDOR_MASTER_BASE_URL, value)
  }

  getVendorsById(VendorId) {
    return api.get(IFOODS_VENDOR_MASTER_BASE_URL + '/' + VendorId)
  }

  updateVendors(VendorId, Vendors) {
    return api.post(IFOODS_VENDOR_MASTER_BASE_URL + '/' + VendorId, Vendors)
  }

  deleteIfoodsVendors(VendorId) {
    return api.delete(IFOODS_VENDOR_MASTER_BASE_URL + '/' + VendorId)
  }
}

export default new IfoodsVendorMasterService()
