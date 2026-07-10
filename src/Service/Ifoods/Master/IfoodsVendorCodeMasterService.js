import AppConfig from 'src/AppConfig'
import api from 'src/Service/Config'

const IFOODS_VENDOR_CODE_MASTER_BASE_URL = AppConfig.api.baseUrl + '/Ifoods/VendorCode'
const IFOODS_ACTIVE_VENDORS_LIST_URL = AppConfig.api.baseUrl + '/Ifoods/ActiveVendorCode'

class IfoodsVendorCodeMasterService {
  getIfoodsVendorsCode() {
    return api.get(IFOODS_VENDOR_CODE_MASTER_BASE_URL)
  }

  getActiveIfoodsVendorsCode() {
    return api.get(IFOODS_ACTIVE_VENDORS_LIST_URL)
  }

  createIfoodsVendorCode(value) {
    return api.post(IFOODS_VENDOR_CODE_MASTER_BASE_URL, value)
  }

  getVendorsByIdCode(VendorId) {
    return api.get(IFOODS_VENDOR_CODE_MASTER_BASE_URL + '/' + VendorId)
  }

  updateVendorsCode(VendorId, Vendors) {
    return api.post(IFOODS_VENDOR_CODE_MASTER_BASE_URL + '/' + VendorId, Vendors)
  }

  deleteIfoodsVendorsCode(VendorId) {
    return api.delete(IFOODS_VENDOR_CODE_MASTER_BASE_URL + '/' + VendorId)
  }
}

export default new IfoodsVendorCodeMasterService()
