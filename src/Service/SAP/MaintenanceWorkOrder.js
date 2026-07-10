import axios from 'axios'
import AppConfig from 'src/AppConfig'
import api from '../Config'

const URL = AppConfig.api.baseUrl + '/sap/maintenance_workorder/'
const WORK_ORDER_STOP = AppConfig.api.baseUrl + '/sap/maintenance_workorderstop'

class WorkorderService {
  // GET SINGLE PAN DATA FROM SAP
  getworkorderData(workorder) {
    return api.get(URL + workorder)
  }
  WorkorderstopSAP(data) {
    return api.post(WORK_ORDER_STOP, data)
  }
}

export default new WorkorderService()
