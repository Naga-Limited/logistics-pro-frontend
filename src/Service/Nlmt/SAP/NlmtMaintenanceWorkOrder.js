import axios from 'axios'
import AppConfig from 'src/AppConfig'
import api from 'src/Service/Config'

const URL = AppConfig.api.baseUrl + '/sap/nlmt_maintenance_workorder/'
const WORK_ORDER_STOP = AppConfig.api.baseUrl + '/sap/nlmt_maintenance_workorderstop'

class NlmtMaintenanceWorkOrder {
  // GET SINGLE PAN DATA FROM SAP
  getworkorderData(workorder) {
    return api.get(URL + workorder)
  }
  WorkorderstopSAP(data) {
    return api.post(WORK_ORDER_STOP, data)
  }
}

export default new NlmtMaintenanceWorkOrder()
