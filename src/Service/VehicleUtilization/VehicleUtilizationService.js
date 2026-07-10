import AppConfig from 'src/AppConfig'
import api from '../Config'

const VEHICLE_UTILIZATION_OWNFGSALES_REPORT_VIEW_URL = AppConfig.api.baseUrl + '/vuOwnFgSalesReportView' 
const VEHICLE_UTILIZATION_OWNFGSALES_REPORT_SENT_URL = AppConfig.api.baseUrl + '/vuOwnFgSalesReportRequest' 

const VEHICLE_UTILIZATION_HIREFGSALES_REPORT_VIEW_URL = AppConfig.api.baseUrl + '/vuHireFgSalesReportView' 
const VEHICLE_UTILIZATION_HIREFGSALES_REPORT_SENT_URL = AppConfig.api.baseUrl + '/vuHireFgSalesReportRequest' 

const VEHICLE_UTILIZATION_OWNOTHERS_REPORT_VIEW_URL = AppConfig.api.baseUrl + '/vuOwnOthersReportView' 
const VEHICLE_UTILIZATION_OWNOTHERS_REPORT_SENT_URL = AppConfig.api.baseUrl + '/vuOwnOthersReportRequest' 

const VEHICLE_UTILIZATION_HIREOTHERS_REPORT_VIEW_URL = AppConfig.api.baseUrl + '/vuHireOthersReportView' 
const VEHICLE_UTILIZATION_HIREOTHERS_REPORT_SENT_URL = AppConfig.api.baseUrl + '/vuHireOthersReportRequest' 

class VehicleUtilizationService {
  
  getOwnFgsalesVehilceUtilizationDataForReport() {
    return api.get(VEHICLE_UTILIZATION_OWNFGSALES_REPORT_VIEW_URL)
  }

  sentOwnFgsalesVehilceUtilizationDataForReport(data) {
    return api.post(VEHICLE_UTILIZATION_OWNFGSALES_REPORT_SENT_URL, data)
  }

  getHireFgsalesVehilceUtilizationDataForReport() {
    return api.get(VEHICLE_UTILIZATION_HIREFGSALES_REPORT_VIEW_URL)
  }

  sentHireFgsalesVehilceUtilizationDataForReport(data) {
    return api.post(VEHICLE_UTILIZATION_HIREFGSALES_REPORT_SENT_URL, data)
  }

  getOwnOthersVehilceUtilizationDataForReport() {
    return api.get(VEHICLE_UTILIZATION_OWNOTHERS_REPORT_VIEW_URL)
  }

  sentOwnOthersVehilceUtilizationDataForReport(data) {
    return api.post(VEHICLE_UTILIZATION_OWNOTHERS_REPORT_SENT_URL, data)
  }

  getHireOthersVehilceUtilizationDataForReport() {
    return api.get(VEHICLE_UTILIZATION_HIREOTHERS_REPORT_VIEW_URL)
  }

  sentHireOthersVehilceUtilizationDataForReport(data) {
    return api.post(VEHICLE_UTILIZATION_HIREOTHERS_REPORT_SENT_URL, data)
  }

}

export default new VehicleUtilizationService()
