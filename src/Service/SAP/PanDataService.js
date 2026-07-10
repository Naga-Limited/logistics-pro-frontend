import axios from 'axios'
import AppConfig from 'src/AppConfig'
import api from '../Config'

const URL = AppConfig.api.baseUrl + '/sap/check-document-available/'
const MULTIVENDORURL = AppConfig.api.baseUrl + '/sap/check-multi-vendor-document-available/'

class PanDataService {
  // GET SINGLE PAN DATA FROM SAP
  getPanData(panNumber) {
    return api.get(URL + panNumber)
  }

  getMultiVendorInfoByPan(panNumber) {
    return api.get(MULTIVENDORURL + panNumber)
  }
}

export default new PanDataService()
