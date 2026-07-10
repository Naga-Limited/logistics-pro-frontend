import AppConfig from "src/AppConfig";
import api from 'src/Service/Config'


export const NLMT_VENDOR_REQUEST_BASE_URL = AppConfig.api.baseUrl+'/nlmt_vendor_request'
export const NLMT_VENDOR_REQUEST_INFO_BASE_URL = AppConfig.api.baseUrl+'/nlmt_vendor_request_status'


class NlmtVendorRequestService {
  getNlmtVendorRequest() {
    return api.get(NLMT_VENDOR_REQUEST_BASE_URL)
  }

  createNlmtVendorRequest(value) {
    return api.post(NLMT_VENDOR_REQUEST_BASE_URL, value)
  }

  getNlmtVendorRequestById(VendorId) {
    return api.get(NLMT_VENDOR_REQUEST_BASE_URL + '/' + VendorId)
  }

  updateNlmtVendorRequest( VendorsId,Vendors) {

    return api.post(NLMT_VENDOR_REQUEST_BASE_URL + '/' + VendorsId, Vendors)
  }

  deleteNlmtVendorRequest(VendorsId) {
    return api.delete(NLMT_VENDOR_REQUEST_BASE_URL + '/' + VendorsId)
  }


}

export default new NlmtVendorRequestService()
