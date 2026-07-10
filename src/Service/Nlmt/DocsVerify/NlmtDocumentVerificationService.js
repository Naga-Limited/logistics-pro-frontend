import AppConfig from 'src/AppConfig'
import api from 'src/Service/Config'

const DOCS_VERIFY_URL = AppConfig.api.baseUrl + '/NlmtDocumentVerification'
const DOCS_VERIFY_CREATE_URL = AppConfig.api.baseUrl + '/NlmtDocumentVerification'
const PARKING_YRD_SINGLE_VEHICLE_INFO_URL = AppConfig.api.baseUrl + '/nlmt-doc-data/'
const PARKING_YRD_SINGLE_VEHICLE_VENOR_INFO_URL = AppConfig.api.baseUrl + '/PYGVehicleVendorInfo/'

class NlmtDocumentVerificationService {
  getDocsVerifyTableData() {
    return api.get(DOCS_VERIFY_URL)
  }
  getSingleVehicleInfoOnTripIn(id) {
    return api.get(PARKING_YRD_SINGLE_VEHICLE_INFO_URL + id)
  }
  // getSingleVehicleInfo(id) {
  //   return api.get(DOCS_VERIFY_URL + id)
  // }
  addDocumentVerificationData(data) {
    return api.post(DOCS_VERIFY_CREATE_URL, data)
  }

  updateDocumentVerificationData(id, data) {
    return api.post(DOCS_VERIFY_URL + id, data)
  }
  getVehicleVendorDetails(veh_no) {
    return api.get(PARKING_YRD_SINGLE_VEHICLE_VENOR_INFO_URL + veh_no)
  }


}

export default new NlmtDocumentVerificationService()
