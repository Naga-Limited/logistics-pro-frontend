import AppConfig from 'src/AppConfig'
import api from 'src/Service/Config'

const URL = AppConfig.api.baseUrl + '/sap/check-nlmt-vendor-available/'

class NlmtVendorOutstanding {
  // GET SINGLE PAN DATA FROM SAP
  getVendoroutstanding(vendor_no) {
    return api.get(URL + vendor_no)
  }

}

export default new NlmtVendorOutstanding()
