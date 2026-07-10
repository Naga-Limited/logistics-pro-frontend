import AppConfig from 'src/AppConfig'
import api from '../Config'

const TRIPSTO_URL = AppConfig.api.baseUrl + '/TripSto'
const TRIPSTO_SINGLE_DOCS_URL = AppConfig.api.baseUrl + '/DocsVerifyRequest/'

const PARKING_YRD_SINGEL_VEHICLE_INFO_URL = AppConfig.api.baseUrl + '/parkingYard/'

const SINGLE_VEHICLE_DOCUMENT_INFO_URL = AppConfig.api.baseUrl + '/DocumentVerification/'

class TripStoService {
  getVehicleReadyToTripSto() {
    return api.get(TRIPSTO_URL)
  }

  getVehicleDocumentInfo(pan_data) {
    return api.get(TRIPSTO_SINGLE_DOCS_URL + pan_data)
  }

  // doAssignTripSto(id) {
  //   return api.get(TRIPSTO_URL + '/' + id)
  // }

  doAssignTripSto(id,tType) {
    return api.get(TRIPSTO_URL + '/' + id +'||'+ tType)
  }

  assignRMSTOHire(data) {
    return api.post(TRIPSTO_URL, data)
  }

  getSingleVehicleInfoOnParkingYardGate(id) {
    return api.get(PARKING_YRD_SINGEL_VEHICLE_INFO_URL + id)
  }
}

export default new TripStoService()
