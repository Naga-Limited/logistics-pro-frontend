import AppConfig from 'src/AppConfig'
import api from '../Config'

const RJSO_MASTER_BASE_URL = AppConfig.api.baseUrl + '/rj_saleorder_creation'
const RJSO_FORM_REQUEST_FETCH_URL = AppConfig.api.baseUrl + '/get-rjso-form-requests/'
const SINGLE_RJSO_FORM_REQUEST_FETCH_URL = AppConfig.api.baseUrl + '/get-single-rjso-info/'
const RJSO_FORM_REQUEST_URL = AppConfig.api.baseUrl + '/rjso-form-request'
const RJSO_FORM_WAITING_REQUESTs_FETCH_URL = AppConfig.api.baseUrl + '/get-waiting-rjso-form-requests/'
const RJSO_FORM_CANCEL_URL = AppConfig.api.baseUrl + '/rjso-form-cancel'
const RJSO_FORM_UPDATE_URL = AppConfig.api.baseUrl + '/rjso-form-update'
const RJ_SO_RECEIVABLE_OUTSTANDING = AppConfig.api.baseUrl + '/rj_so_receivable_os_view'
const RJ_SO_RECEIVABLE_OUTSTANDING_FILTER = AppConfig.api.baseUrl + '/rj_so_receivable_os_fliter'

class RJSaleOrderMasterService {
  getRJSaleOrder() {
    return api.get(RJSO_MASTER_BASE_URL)
  }

  getRJSaleOrderbyParkingId(PARKING_ID) {
    return api.get(RJSO_MASTER_BASE_URL + '/' + PARKING_ID)
  }

  getRJSaleOrderbyId(id) {
    return api.get(SINGLE_RJSO_FORM_REQUEST_FETCH_URL + id)
  }

  getWaitingRJRequestsbyParkingId(id) {
    return api.get(RJSO_FORM_WAITING_REQUESTs_FETCH_URL + id)
  }

  createRJSaleOrder(value) {
    return api.post(RJSO_MASTER_BASE_URL, value)
  }

  getRjsoRequestForms() {
    return api.get(RJSO_FORM_REQUEST_FETCH_URL)
  }

  rjsoRequestFormCreation(value) {
    return api.post(RJSO_FORM_REQUEST_URL, value)
  }

  rjsoRequestFormCancellation(value) {
    return api.post(RJSO_FORM_CANCEL_URL, value)
  }

  rjsoRequestFormUpdation(value) {
    return api.post(RJSO_FORM_UPDATE_URL, value)
  }

  getRJSORecievableOSView() {
    return api.get(RJ_SO_RECEIVABLE_OUTSTANDING)
  }
  getRJSORecievableOSFilter(value) {
    return api.post(RJ_SO_RECEIVABLE_OUTSTANDING_FILTER)
  }

}

export default new RJSaleOrderMasterService()
