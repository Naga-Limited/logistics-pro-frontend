import AppConfig from 'src/AppConfig'
import api from '../Config'

const DELIVERY_TRACKING_MASTER_BASE_URL = AppConfig.api.baseUrl + '/delivery_track' 
const DELIVERY_TRACKING_BY_SHIPMENT_ID_URL = AppConfig.api.baseUrl + '/shipment_delivery_track' 
const DELIVERY_TRACKING_CLOSURE_BASE_URL = AppConfig.api.baseUrl + '/delivery_track_closure'
const VEHICLE_ASSIGNEMNT_FETCH_SHIPMENT_INFO_FOR_DELIVERY_TRACK_VIEW_URL = AppConfig.api.baseUrl + '/shipmentInfoForDT'
const VEHICLE_ASSIGNEMNT_FETCH_SHIPMENT_INFO_FOR_DELIVERY_TRACK_SENT_URL = AppConfig.api.baseUrl + '/sentShipmentInfoForDT'
const DELIVERY_TRACKING_REPORT_VIEW_URL = AppConfig.api.baseUrl + '/dtReportView' 
const DELIVERY_TRACKING_REPORT_SENT_URL = AppConfig.api.baseUrl + '/dtReportRequest'
const DT_DESPATCH_CUSTOM_SHIPMENT_INFO_BASE_URL = AppConfig.api.baseUrl + '/dtDespatchCustomDateShipmentInfo'
const DT_DESPATCH_TODAY_SHIPMENT_INFO_BASE_URL = AppConfig.api.baseUrl + '/dtDespatchTodayShipmentInfo'
const DT_DESPATCH_INFO_UPDATE_URL = AppConfig.api.baseUrl + '/dtDespatchUpdation'
const DELIVERY_TRACKING_MASTER_UPDATE_BASE_URL = AppConfig.api.baseUrl + '/shipmentDtUpdate'

class DeliveryTrackService {

  getAllDtInfo() {
    return api.get(DELIVERY_TRACKING_MASTER_BASE_URL)
  } 

  getDtInfoById(dt_id) {
    return api.get(DELIVERY_TRACKING_MASTER_BASE_URL + '/' + dt_id)
  }

  getDtInfoByShipmentId(sp_id) {
    return api.get(DELIVERY_TRACKING_BY_SHIPMENT_ID_URL + '/' + sp_id)
  }

  /* Get All Shipment Orders From DB for Delivery Track */
  getShipmentForDeliveryTrack() {
    return api.get(VEHICLE_ASSIGNEMNT_FETCH_SHIPMENT_INFO_FOR_DELIVERY_TRACK_VIEW_URL)
  }

  /* Get All DT Info From DB for Report */
  sentShipmentInfoForDeliveryTrack(data) {
    return api.post(VEHICLE_ASSIGNEMNT_FETCH_SHIPMENT_INFO_FOR_DELIVERY_TRACK_SENT_URL, data)
  }

  insertDTInfo(value) {
    return api.post(DELIVERY_TRACKING_MASTER_BASE_URL, value)
  }

  updateShipmentDTInfo(value) {
    return api.post(DELIVERY_TRACKING_MASTER_UPDATE_BASE_URL, value)
  }

  updateDTInfo(dt_id, value) {
    return api.post(DELIVERY_TRACKING_MASTER_BASE_URL + '/' + dt_id, value)
  }

  /* Get All DT Info From DB for Report */
  getDTInfoForReport() {
    return api.get(DELIVERY_TRACKING_REPORT_VIEW_URL)
  }

  /* Get All DT Info From DB for Report */
  sentDTInfoForReport(data) {
    return api.post(DELIVERY_TRACKING_REPORT_SENT_URL, data)
  }

  deleteDTInfo(DTId) {
    return api.delete(DELIVERY_TRACKING_MASTER_BASE_URL + '/' + DTId)
  }

  closeDtInfoById(dt_id) {
    return api.get(DELIVERY_TRACKING_CLOSURE_BASE_URL + '/' + dt_id)
  }

  /* DT Despatch Services */
  getTodayAllShipmentInfo() {
    return api.get(DT_DESPATCH_TODAY_SHIPMENT_INFO_BASE_URL)
  }

  /* Get All DT Info From DB for Report */
  sentDTAllInfoForReport(data) {
    return api.post(DT_DESPATCH_CUSTOM_SHIPMENT_INFO_BASE_URL, data)
  }

  updateDtDespatchInfo(value) {
    return api.post(DT_DESPATCH_INFO_UPDATE_URL, value)
  }

}

export default new DeliveryTrackService()