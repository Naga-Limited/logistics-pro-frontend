import axios from 'axios'
import AppConfig from 'src/AppConfig'
import api from '../Config'

const URL = AppConfig.api.baseUrl + '/sap/shipment_ifoods/'
const DELETE = AppConfig.api.baseUrl + '/sap/shipmentstop'

class IfoodsVehicleAssignment {

  getshipmentData(purpose) {
    return api.get(URL + purpose)
  }
  shipmentDeleteSAP(data) {
    return api.post(DELETE, data)
  }
}

export default new IfoodsVehicleAssignment()
