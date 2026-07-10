import axios from 'axios'
import AppConfig from 'src/AppConfig'
import api from 'src/Service/Config'

const URL = AppConfig.api.baseUrl + '/sap/check-sto-delivery-available/'
const RMSTOURL = AppConfig.api.baseUrl + '/sap/check-rmsto-delivery-available/'
const FCIURL = AppConfig.api.baseUrl + '/sap/check-fci-delivery-available/'
const FGSTOURL = AppConfig.api.baseUrl + '/sap/check-fgsto-delivery-available/'
const OTHERSURL = AppConfig.api.baseUrl + '/sap/check-others-delivery-available/'

class NlmtStoDeliveryDataService {
  // GET SINGLE FGSTO DATA FROM SAP
  getFgstoDeliveryData(stoDeliveryNumber) {
    return api.get(URL + stoDeliveryNumber)
  }

  // GET SINGLE RMSTO DATA FROM SAP
  getRmstoDeliveryData(tripsheet_number) {
    return api.get(RMSTOURL + tripsheet_number)
  }

  // GET SINGLE FCI DATA FROM SAP
  getFciDeliveryData(tripsheet_number) {
    return api.get(FCIURL + tripsheet_number)
  }

  // GET FGSTO DATA FROM SAP
  getAllFgstoDeliveryData(tripsheet_number) {
    return api.get(FGSTOURL + tripsheet_number)
  }

  // GET Others Process Data From SAP
  getOthersDeliveryData(stoDeliveryNumber,process_type_id) {
    return api.get(OTHERSURL + stoDeliveryNumber+'||'+process_type_id)
  }

}

export default new NlmtStoDeliveryDataService()
