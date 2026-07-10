import AppConfig from 'src/AppConfig'
import api from '../Config'

const SINGLE_VEHICLE_DOCUMENT_INFO_URL = AppConfig.api.baseUrl + '/DocumentVerification/'

const VENDOR_DATA = AppConfig.api.baseUrl + '/vendor_data/'
const VENDOR = AppConfig.api.baseUrl + '/vendorcreation'
const VENDOR_REQUEST = AppConfig.api.baseUrl + '/vendorRequest/'
const VENDOR_APPROVAL = AppConfig.api.baseUrl + '/vendorApproval/'
const VENDOR_CONFIRMATION = AppConfig.api.baseUrl + '/vendorConfirmation/'
const VENDOR_EXTENSION = AppConfig.api.baseUrl + '/sap_vendor_extension_info/'
const VENDOR_UPDATION_REQUEST_URL = AppConfig.api.baseUrl + '/vendorInfoUpdation'
const VENDOR_EXTENSION_REQUEST_URL = AppConfig.api.baseUrl + '/vendorInfoExtension'

const TS_VENDOR_CHANGE_REQUEST_DATA = AppConfig.api.baseUrl + '/ts_vendor_change_request_data/'
const TS_VENDOR_CHANGE_REQUEST_REPORT_DATA = AppConfig.api.baseUrl + '/ts_vendor_change_request_report_data/'
const TS_VENDOR_CHANGE_AH_APPROVAL_REQUEST_DATA = AppConfig.api.baseUrl + '/ts_vendor_change_ah_approval_request_data/'
const TS_VENDOR_CHANGE_OH_APPROVAL_REQUEST_DATA = AppConfig.api.baseUrl + '/ts_vendor_change_oh_approval_request_data/'
const SINGLE_VEHICLE_DOCUMENT_INFO_BY_PID_URL = AppConfig.api.baseUrl + '/DocumentVerificationByPid'

const VENDOR_CHANGE_REQUEST_UPDATION_URL = AppConfig.api.baseUrl + '/vendorChangeRequestInfoUpdation'
const VENDOR_CHANGE_REQUEST_UPDATION_AHOH_URL = AppConfig.api.baseUrl + '/vendorChangeRequestAHOHApprovalInfoUpdation'

class VendorCreationService {
  // VENDOR CREATION REQUEST
  getVendorRequestTableData() {
    return api.get(VENDOR_REQUEST)
  }
  getVehicleDocumentInfo(vehicle_id) {
    return api.get(SINGLE_VEHICLE_DOCUMENT_INFO_URL + vehicle_id)
  }

  // VENDOR CREATION APPROVAL
  getVendorApprovalTableData() {
    return api.get(VENDOR_APPROVAL)
  }
  updateVendorRequestData(id, data) {
    return api.post(VENDOR + '/' + id, data)
  }

  // VENDOR CREATION CONFIRMATION
  getVendorConfirmationTableData() {
    return api.get(VENDOR_CONFIRMATION)
  }

  getVendorsByPan() {
    return api.get(VENDOR_DATA)
  }

  updateVendorConfirmationData(id, data) {
    // does not do anything useful

    return api.post(VENDOR + '/' + id, data)
  }

  updateVendorInfo(data){
    return api.post(VENDOR_UPDATION_REQUEST_URL, data)
  }

  // Fetch Vendor Extension Data
  getVendorExtensionTableData() {
    return api.get(VENDOR_EXTENSION)
  }

  extendVendorInfo(data){
    return api.post(VENDOR_EXTENSION_REQUEST_URL, data)
  }

  getTSVendorChangeRequestData() {
    return api.get(TS_VENDOR_CHANGE_REQUEST_DATA)
  }

  getTSVendorChangeAhApprovalRequestData() {
    return api.get(TS_VENDOR_CHANGE_AH_APPROVAL_REQUEST_DATA)
  }  
  getTSVendorChangeOhApprovalRequestData() {
    return api.get(TS_VENDOR_CHANGE_OH_APPROVAL_REQUEST_DATA)
  }  

  getVehicleDocumentInfoByPid(pID) {
    return api.get(SINGLE_VEHICLE_DOCUMENT_INFO_BY_PID_URL + '/' + pID)
  }

  updateVendorChangeRequestData(data){
    return api.post(VENDOR_CHANGE_REQUEST_UPDATION_URL, data)
  }

  updateVendorChangeRequestAOHData(data){
    return api.post(VENDOR_CHANGE_REQUEST_UPDATION_AHOH_URL, data)
  }

  getTSVendorChangeRequestReportData() {
    return api.get(TS_VENDOR_CHANGE_REQUEST_REPORT_DATA)
  }  
}

export default new VendorCreationService()
