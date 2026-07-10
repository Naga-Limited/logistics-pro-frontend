import AppConfig from 'src/AppConfig'
import api from 'src/Service/Config'

const VENDOR_CREATION = AppConfig.api.baseUrl + '/sap/vendor-creation-confirmation'
const VENDOR_EXTENSION = AppConfig.api.baseUrl + '/sap/vendor-creation-extension/'

class VendorToSAP {
  // GET SINGLE PAN DATA FROM SAP
  vendorCreation(data) {
    return api.post(VENDOR_CREATION, data)
  }

  vendorExtension(data) {
    return api.get(VENDOR_EXTENSION + data)
  }

}

export default new VendorToSAP()
