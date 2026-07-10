import AppConfig from 'src/AppConfig'
import api from 'src/Service/Config'

const VEHICLE_ASSIGNEMNT_BASE_URL = AppConfig.api.baseUrl + '/NlmtVehicleAssignment'
const VEHICLE_ASSIGNEMNT_MANUAL_INSERT_BASE_URL = AppConfig.api.baseUrl + '/nlmtVehicleAssignmentManualInsert'
const VEHICLE_ASSIGNEMNT_CREATE_URL = AppConfig.api.baseUrl + '/VehicleAssignment/'
const VEHICLE_ASSIGNEMNT_SHIPMENT_VIEW_URL = AppConfig.api.baseUrl + '/nlmtshipmentView'
const VEHICLE_ASSIGNEMNT_MISSING_SHIPMENT_VIEW_URL = AppConfig.api.baseUrl + '/sap/nlmtMissingShipmentView'

const VEHICLE_ASSIGNEMNT_SHIPMENT_NLCD_REPORT_VIEW_URL = AppConfig.api.baseUrl + '/shipmentReportViewNLCD'

const VEHICLE_ASSIGNEMNT_SHIPMENT_DELIVERY_REPORT_VIEW_URL_NLCD = AppConfig.api.baseUrl + '/shipmentDeliveryReportViewNlcd'
const VEHICLE_ASSIGNEMNT_SHIPMENT_INFO_BY_PARKING_ID_VIEW_URL =
  AppConfig.api.baseUrl + '/nlmtshipmentByPId'

const VEHICLE_ASSIGNEMNT_SINGLE_SHIPMENT_VIEW_URL = AppConfig.api.baseUrl + '/nlmtsingleShipment'
const VEHICLE_ASSIGNEMNT_SINGLE_SHIPMENT_CHILD_INFO_VIEW_URL =
  AppConfig.api.baseUrl + '/nlmtsingleShipmentChildInfo'
const VEHICLE_ASSIGNEMNT_SINGLE_SHIPMENT_PYG_VIEW_URL = AppConfig.api.baseUrl + '/nlmtsingleShipmentPYG'
const VEHICLE_ASSIGNEMNT_SHIPMENT_PGI_INFO_UPDATION_URL = AppConfig.api.baseUrl + '/PgiInfoNlmtUpdate'
const VEHICLE_ASSIGNEMNT_SHIPMENT_DELIVERY_QTY_INFO_UPDATION_URL =
  AppConfig.api.baseUrl + '/nlmtDeliveryQuantityInfoUpdate'
const VEHICLE_ASSIGNEMNT_SHIPMENT_SECONDWEIGHT_INFO_UPDATION_URL = AppConfig.api.baseUrl + '/nlmtsecondWeightInfoUpdate'
const VEHICLE_ASSIGNEMNT_INVOICE_ATTACHMENT_UPDATION_URL = AppConfig.api.baseUrl + '/invoiceAttachmentUpdate'
const VEHICLE_ASSIGNEMNT_SHIPMENT_SECONDWEIGHT_INFO_UPDATION_DATA_URL = AppConfig.api.baseUrl + '/nlmtsecondWeightInfoUpdateData'

const NLMT_VEHICLE_ASSIGNEMNT_SHIPMENT_REPORT_VIEW_URL = AppConfig.api.baseUrl + '/nlmtShipmentReportView'
const NLMT_VEHICLE_ASSIGNEMNT_SHIPMENT_REPORT_SENT_URL = AppConfig.api.baseUrl + '/nlmtShipmentReportRequest'
const NLMT_VEHICLE_ASSIGNEMNT_SHIPMENT_DELIVERY_REPORT_VIEW_URL = AppConfig.api.baseUrl + '/nlmtShipmentDeliveryReportView'
const NLMT_VEHICLE_ASSIGNEMNT_SHIPMENT_DELIVERY_REPORT_SENT_URL = AppConfig.api.baseUrl + '/nlmtShipmentDeliveryReportRequest'



const VEHICLE_ASSIGNEMNT_SHIPMENT_HVITW_FREIGHT_REPORT_VIEW_URL = AppConfig.api.baseUrl + '/shipmentHvitwFreightReportView'
const VEHICLE_ASSIGNEMNT_SHIPMENT_HVITW_FREIGHT_REPORT_SENT_URL = AppConfig.api.baseUrl + '/shipmentHvitwFreightReportRequest'

const VEHICLE_ASSIGNEMNT_SHIPMENT_INFO_BY_SHIPMENT_ID_VIEW_URL = AppConfig.api.baseUrl + '/nlmt-shipmentBySId'
const INVOICE_ATTACHMENT_REPORT_VIEW_URL = AppConfig.api.baseUrl + '/shipmentIARDByCId'
const INVOICE_ATTACHMENT_REPORT_SENT_URL = AppConfig.api.baseUrl + '/shipmentIARDByCIdRequest'

const VEHICLE_ASSIGNEMNT_SINGLE_PGI_COMPLETION_UPDATE_URL = AppConfig.api.baseUrl + '/nlmtSinglePgiCompletionUpdate'

class NlmtVehicleAssignmentService {
  /* Get All Shipment Orders From DB */
  getAllShipmentOrders() {
    return api.get(VEHICLE_ASSIGNEMNT_SHIPMENT_VIEW_URL)
  }

  /* Get All Shipment Orders From DB */
  getMissingShipmentOrders() {
    return api.get(VEHICLE_ASSIGNEMNT_MISSING_SHIPMENT_VIEW_URL)
  }

  /* Get All NLFD Shipment Orders From DB for Report */
  getNlmtShipmentDataForReport() {
    return api.get(NLMT_VEHICLE_ASSIGNEMNT_SHIPMENT_REPORT_VIEW_URL)
  }

  /* Get All NLCD Shipment Orders From DB for Report */
  getShipmentDataForReportNLCD() {
    return api.get(VEHICLE_ASSIGNEMNT_SHIPMENT_NLCD_REPORT_VIEW_URL)
  }

  /* Get All Delivery Orders From DB for Report */
  getNlmtShipmentDeliveryDataForReport() {
    return api.get(NLMT_VEHICLE_ASSIGNEMNT_SHIPMENT_DELIVERY_REPORT_VIEW_URL)
  }

  /* Get All Delivery Orders From DB for Report */
  getShipmentDeliveryDataForReportNLCD() {
    return api.get(VEHICLE_ASSIGNEMNT_SHIPMENT_DELIVERY_REPORT_VIEW_URL_NLCD)
  }

  /* Get All Shipment Orders From DB for Report */
  sentNlmtShipmentDataForReport(data) {
    return api.post(NLMT_VEHICLE_ASSIGNEMNT_SHIPMENT_REPORT_SENT_URL, data)
  }

  /* Get All Shipment Delivery Orders From DB for Report */
  sentNlmtShipmentDeliveryDataForReport(data) {
    return api.post(NLMT_VEHICLE_ASSIGNEMNT_SHIPMENT_DELIVERY_REPORT_SENT_URL, data)
  }

  /* Get Single Shipment Parent Info From DB */
  getSingleShipment(shipment_no) {
    return api.get(VEHICLE_ASSIGNEMNT_SINGLE_SHIPMENT_VIEW_URL + '/' + shipment_no)
  }

  /* Get Single Shipment Child Info From DB */
  getSingleShipmentChildInfo(shipment_no) {
    return api.get(VEHICLE_ASSIGNEMNT_SINGLE_SHIPMENT_CHILD_INFO_VIEW_URL + '/' + shipment_no)
  }

  /* Get Single Shipment Info From DB By Parking Id */
  getShipmentInfoByPId(PARKING_ID) {
    return api.get(VEHICLE_ASSIGNEMNT_SHIPMENT_INFO_BY_PARKING_ID_VIEW_URL + '/' + PARKING_ID)
  }

  /* Get Single Shipment Parent Info with Parking Yard data From DB */
  getSingleShipmentPYGData(parking_id) {
    return api.get(VEHICLE_ASSIGNEMNT_SINGLE_SHIPMENT_PYG_VIEW_URL + '/' + parking_id)
  }

  /* Shipment Creation Process */
  createShipmentOrder(data) {
    return api.post(VEHICLE_ASSIGNEMNT_BASE_URL, data)
  }

  /* Shipment Creation Manual Process */
  insertShipmentOrder(data) {
    return api.post(VEHICLE_ASSIGNEMNT_MANUAL_INSERT_BASE_URL, data)
  }

  /* Shipment Delivery PGI Info Updation Process */
  updatePgiInfoToDb(data) {
    return api.get(VEHICLE_ASSIGNEMNT_SHIPMENT_PGI_INFO_UPDATION_URL + '/' + data)
  }

  /* Shipment Delivery Quantity Info Updation Process */
  updateDeliveryQuantityInfoToDb(data) {
    return api.get(VEHICLE_ASSIGNEMNT_SHIPMENT_DELIVERY_QTY_INFO_UPDATION_URL + '/' + data)
  }

  /* Shipment Delivery Second Weight Info Updation Process */
  updateSecondWeightInfoToDb(data) {
    return api.get(VEHICLE_ASSIGNEMNT_SHIPMENT_SECONDWEIGHT_INFO_UPDATION_URL + '/' + data)
  }

  /* Shipment Delivery Second Weight Info Updation Process */
  updateSecondWeightInfoToDbData(data) {
    return api.get(VEHICLE_ASSIGNEMNT_SHIPMENT_SECONDWEIGHT_INFO_UPDATION_DATA_URL + '/' + data)
  }

  /* Shipment Updation ( Delivery Insert / Delete ) Process */
  updateShipmentOrder(id, data) {
    return api.post(VEHICLE_ASSIGNEMNT_BASE_URL + '/' + id, data)
  }

  /* Shipment Deletion Process */
  deleteShipmentOrder(shipment_no) {
    return api.delete(VEHICLE_ASSIGNEMNT_BASE_URL + '/' + shipment_no)
  }

  /* Invoice Attachment Updation Process */
  updateInvoiceAttachment(data) {
    return api.post(VEHICLE_ASSIGNEMNT_INVOICE_ATTACHMENT_UPDATION_URL, data)
  }

  /* Get All (Hire Vehicles IncoTerm Wise) Delivery Orders From DB for Report */
  getShipmentHvitwFreightDataForReport() {
    return api.get(VEHICLE_ASSIGNEMNT_SHIPMENT_HVITW_FREIGHT_REPORT_VIEW_URL)
  }

  /* Get All (Hire Vehicles IncoTerm Wise) Shipment Delivery Orders From DB for Report */
  sentShipmentHvitwFreightDataForReport(data) {
    return api.post(VEHICLE_ASSIGNEMNT_SHIPMENT_HVITW_FREIGHT_REPORT_SENT_URL, data)
  }

  /* Get Single Shipment Info From DB By Shipment Id */
  getShipmentInfoBySId(SHIPMENT_ID) {
    return api.get(VEHICLE_ASSIGNEMNT_SHIPMENT_INFO_BY_SHIPMENT_ID_VIEW_URL + '/' + SHIPMENT_ID)
  }

  /* Get Invoice Attachment Report From DB */
  getInvoiceAttachmentReortData(cId) {
    return api.get(INVOICE_ATTACHMENT_REPORT_VIEW_URL + '/' + cId)
  }

  sentInvoiceAttachmentReortDataForReport(data) {
    return api.post(INVOICE_ATTACHMENT_REPORT_SENT_URL, data)
  }

  /* Single PGI Completion Update Process */
  updateSinglePGICompletion(data) {
    return api.post(VEHICLE_ASSIGNEMNT_SINGLE_PGI_COMPLETION_UPDATE_URL, data)
  }
}

export default new NlmtVehicleAssignmentService()
