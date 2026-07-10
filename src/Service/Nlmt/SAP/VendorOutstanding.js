import AppConfig from 'src/AppConfig'
import api from 'src/Service/Config'

const URL = AppConfig.api.baseUrl + '/sap/check-vendor-available/'
const NLCDURL = AppConfig.api.baseUrl + '/sap/check-nlcd-vendor-available/'

class VendorOutstanding {
  // GET SINGLE PAN DATA FROM SAP
  getVendoroutstanding(vendor_no) {
    return api.get(URL + vendor_no)
  }

  getNLCDVendoroutstanding(vendor_no) {
    return api.get(NLCDURL + vendor_no)
  }
}

export default new VendorOutstanding()
