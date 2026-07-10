import AppConfig from 'src/AppConfig'
import api from 'src/Service/Config'

const RAKE_VENDOR_MASTER_BASE_URL = AppConfig.api.baseUrl + '/Rake/Vendor'
const RAKE_ACTIVE_VENDORS_LIST_URL = AppConfig.api.baseUrl + '/Rake/ActiveVendor'

class RakeVendorMasterService {
  getRakeVendors() {
    return api.get(RAKE_VENDOR_MASTER_BASE_URL)
  }

  getActiveRakeVendors() {
    return api.get(RAKE_ACTIVE_VENDORS_LIST_URL)
  }

  createRakeVendor(value) {
    return api.post(RAKE_VENDOR_MASTER_BASE_URL, value)
  }

  getRakeVendorsById(VendorId) {
    return api.get(RAKE_VENDOR_MASTER_BASE_URL + '/' + VendorId)
  }

  updateRakeVendors(VendorId, Vendors) {
    return api.post(RAKE_VENDOR_MASTER_BASE_URL + '/' + VendorId, Vendors)
  }

  deleteRakeVendor(VendorId) {
    return api.delete(RAKE_VENDOR_MASTER_BASE_URL + '/' + VendorId)
  }
}

export default new RakeVendorMasterService()
