//Created By Mariavananraj
import AppConfig from 'src/AppConfig'
import api from '../Config'

const STATUS_URL = AppConfig.api.baseUrl + '/status'
const SHIPMENT_INFO_URL = AppConfig.api.baseUrl + '/status/shipment-info'
const DELIVERY_UPDATE_URL = AppConfig.api.baseUrl + '/status/delivery-update'
const SHIPMENT_UPDATE_URL = AppConfig.api.baseUrl + '/status/shipment-update'

class StatusApi {
  getStatus() {
    return api.get(STATUS_URL)
  }

  createStatus(value) {
    return api.post(STATUS_URL, value)
  }

  getStatusById(StatusId) {
    return api.get(STATUS_URL + '/' + StatusId)
  }

  updateStatus(StatusDetails, StatusId) {
    return api.put(STATUS_URL + '/' + StatusId, StatusDetails)
  }

  deleteStatus(StatusId) {
    return api.delete(STATUS_URL + '/' + StatusId)
  }

  getShipmentInfo(data) {
    return api.post(SHIPMENT_INFO_URL, data)
  }

  updateDeliveryInfo(delivery_data) {
    return api.post(DELIVERY_UPDATE_URL, delivery_data)
  }

  updateShipmentInfo(shipment_data) {
    return api.post(SHIPMENT_UPDATE_URL, shipment_data)
  }
}

export default new StatusApi()
