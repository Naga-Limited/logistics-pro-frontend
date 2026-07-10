import AppConfig from "src/AppConfig"
import api from "src/Service/Config"

const DEPO_TS_TRUCK_INFO_URL = AppConfig.api.baseUrl + '/DepoShipmentCreation'
const DEPO_SHIPMENT_VIEW_URL = AppConfig.api.baseUrl + '/DepoShipmentView'
const DEPO_SHIPMENT_WAITING_VIEW_URL = AppConfig.api.baseUrl + '/DepoWaitingShipmentView'
const DEPO_SHIPMENT_WAITING_DELIVERIES_VIEW_URL = AppConfig.api.baseUrl + '/DepoWaitingShipmentDeliveries'
const DEPO_SHIPMENT_STARTING_VIEW_URL = AppConfig.api.baseUrl + '/DepoCreateShipmentView'
const VEHICLE_ASSIGNEMNT_SINGLE_DEPO_SHIPMENT_CHILD_INFO_VIEW_URL = AppConfig.api.baseUrl + '/singleDepoShipmentChildInfo'
const VEHICLE_ASSIGNEMNT_SINGLE_DEPO_SHIPMENT_VIEW_URL = AppConfig.api.baseUrl + '/singleDepoShipment'
const VEHICLE_ASSIGNEMNT_SINGLE_DEPO_SHIPMENT_BY_PID_VIEW_URL = AppConfig.api.baseUrl + '/singleDepoShipmentByPid'
const VEHICLE_ASSIGNEMNT_SINGLE_DEPO_SHIPMENT_PYG_VIEW_URL = AppConfig.api.baseUrl + '/singleDepoShipmentPYG'
const VEHICLE_ASSIGNEMNT_CANCEL_TRIP_URL = AppConfig.api.baseUrl + '/singleDepoShipmentCancel'
const VEHICLE_ASSIGNEMNT_CONFIRM_SHIPMENT_REQUEST_URL = AppConfig.api.baseUrl + '/confirmDepoShipment'
const VEHICLE_ASSIGNEMNT_REJECT_SHIPMENT_REQUEST_URL = AppConfig.api.baseUrl + '/rejectDepoShipment'
const VEHICLE_ASSIGNEMNT_REJECT_DELIVERY_INSERT_REQUEST_URL = AppConfig.api.baseUrl + '/rejectDepoDeliveryInsert'
const VEHICLE_ASSIGNEMNT_PAUSE_SHIPMENT_REQUEST_URL = AppConfig.api.baseUrl + '/pauseDepoShipment'
const VEHICLE_ASSIGNEMNT_INSERTION_DELIVERIES_REQUEST_URL = AppConfig.api.baseUrl + '/insertionDeliveriesDepoShipment'
const VEHICLE_ASSIGNEMNT_UNPAUSE_SHIPMENT_REQUEST_URL = AppConfig.api.baseUrl + '/unpauseDepoShipment'
const VEHICLE_ASSIGNEMNT_ADVANCE_DELETE_DELIVERY_SHIPMENT_REQUEST_URL = AppConfig.api.baseUrl + '/deleteDepoShipmentDeliveryAdvance'
const VEHICLE_ASSIGNEMNT_ADVANCE_INSERT_DELIVERY_SHIPMENT_REQUEST_URL = AppConfig.api.baseUrl + '/insertDepoShipmentDeliveryAdvance'
const VEHICLE_ASSIGNEMNT_LATER_INSERT_DELIVERY_SHIPMENT_REQUEST_URL = AppConfig.api.baseUrl + '/insertDepoShipmentDeliveryLater'
const VEHICLE_ASSIGNEMNT_AFTER_APPROVAL_INSERT_DELIVERY_SHIPMENT_REQUEST_URL = AppConfig.api.baseUrl + '/insertDepoShipmentDeliveryAfterApproval'
const VEHICLE_ASSIGNEMNT_USER_REJECT_SHIPMENT_REQUEST_URL = AppConfig.api.baseUrl + '/rejectDepoShipmentByUser'
const VEHICLE_ASSIGNEMNT_INSERT_SHIPMENT_REQUEST_URL = AppConfig.api.baseUrl + '/insertDepoShipmentNo'
const VEHICLE_ASSIGNEMNT_SHIPMENT_PGI_INFO_UPDATION_URL = AppConfig.api.baseUrl + '/DepoPgiInfoUpdate'
const VEHICLE_ASSIGNEMNT_SHIPMENT_DELIVERY_QTY_INFO_UPDATION_URL = AppConfig.api.baseUrl + '/DepoDeliveryQuantityInfoUpdate'
const VEHICLE_ASSIGNEMNT_SHIPMENT_SECONDWEIGHT_INFO_UPDATION_URL = AppConfig.api.baseUrl + '/DeposecondWeightInfoUpdate'

const VEHICLE_ASSIGNEMNT_SHIPMENT_REPORT_VIEW_URL = AppConfig.api.baseUrl + '/shipmentDepoReportView'
const VEHICLE_ASSIGNEMNT_SHIPMENT_REPORT_SENT_URL = AppConfig.api.baseUrl + '/shipmentDepoReportRequest'

const VEHICLE_ASSIGNEMNT_MISSING_SHIPMENT_VIEW_URL = AppConfig.api.baseUrl + '/sap/depoMissingShipmentView'

const VEHICLE_ASSIGNEMNT_MANUAL_INSERT_BASE_URL = AppConfig.api.baseUrl + '/DepoVehicleAssignmentManualInsert'

class DepoShipmentCreationService {

  /* Get Depo Tripsheet Created Truck Info */
  getTruckInfo() {
    return api.get(DEPO_TS_TRUCK_INFO_URL)
  }

  /* Get All Depo Shipment Orders From DB */
  getAllShipmentOrders() {
    return api.get(DEPO_SHIPMENT_VIEW_URL)
  }

  /* Get All Depo Waiting Shipment Orders From DB */
  getAllWaitingShipmentOrders() {
    return api.get(DEPO_SHIPMENT_WAITING_VIEW_URL)
  }

  getShipmentWiseWaitingDeliveries() {
    return api.get(DEPO_SHIPMENT_WAITING_DELIVERIES_VIEW_URL)
  }

  /* Get All Depo Starting Shipment Orders From DB */
  getAllCreatingShipmentOrders() {
    return api.get(DEPO_SHIPMENT_STARTING_VIEW_URL)
  }

  /* Shipment Creation Process */
  createShipmentOrder(data) {
    return api.post(DEPO_TS_TRUCK_INFO_URL, data)
  }

  /* Shipment Creation Manual Process */
  insertShipmentOrder(data) {
    return api.post(VEHICLE_ASSIGNEMNT_MANUAL_INSERT_BASE_URL, data)
  }

  // /* Get Single Shipment By Id */
  // getSingleShipmentChildIdInfo(id) {
  //   return api.get(DEPO_TS_TRUCK_INFO_URL + '/' + id)
  // }

   /* Get Single Depo Shipment Child Info From DB */
   getSingleDepoShipmentChildInfo(shipment_id) {
    return api.get(VEHICLE_ASSIGNEMNT_SINGLE_DEPO_SHIPMENT_CHILD_INFO_VIEW_URL + '/' + shipment_id)
  }


  /* Get Single Depo Shipment Parent Info From DB */
  getSingleDepoShipment(shipment_id) {
    return api.get(VEHICLE_ASSIGNEMNT_SINGLE_DEPO_SHIPMENT_VIEW_URL + '/' + shipment_id)
  }

  /* Get Single Depo Shipment Parent Info By Using Parking_id From DB */
  getSingleDepoShipmentByParkingId(shipment_id) {
    return api.get(VEHICLE_ASSIGNEMNT_SINGLE_DEPO_SHIPMENT_BY_PID_VIEW_URL + '/' + shipment_id)
  }

  /* Shipment Updation ( Delivery Insert / Delete ) Process */
  updateDepoShipmentOrder(id, data) {
    return api.post(DEPO_TS_TRUCK_INFO_URL + '/' + id, data)
  }

  /* Get Single Shipment Parent Info with Parking Yard data From DB */
  getSingleDepoShipmentPYGData(parking_id) {
    return api.get(VEHICLE_ASSIGNEMNT_SINGLE_DEPO_SHIPMENT_PYG_VIEW_URL + '/' + parking_id)
  }

  confirmShipmentRequest(data) {
    return api.post(VEHICLE_ASSIGNEMNT_CONFIRM_SHIPMENT_REQUEST_URL, data)
  }

  rejectShipmentRequest(data) {
    return api.post(VEHICLE_ASSIGNEMNT_REJECT_SHIPMENT_REQUEST_URL, data)
  }

  rejectDeliveryInsertRequest(data) {
    return api.post(VEHICLE_ASSIGNEMNT_REJECT_DELIVERY_INSERT_REQUEST_URL, data)
  }

  pauseShipmentRequest(data) {
    return api.post(VEHICLE_ASSIGNEMNT_PAUSE_SHIPMENT_REQUEST_URL, data)
  }

  getInsertionDeliveriesData(data) {
    return api.post(VEHICLE_ASSIGNEMNT_INSERTION_DELIVERIES_REQUEST_URL, data)
  }

  unpauseShipmentRequest(data) {
    return api.post(VEHICLE_ASSIGNEMNT_UNPAUSE_SHIPMENT_REQUEST_URL, data)
  }

   /* Delivery Delete Before Shipment Creation */
  deleteDeliveryInAdvance(data) {
    return api.post(VEHICLE_ASSIGNEMNT_ADVANCE_DELETE_DELIVERY_SHIPMENT_REQUEST_URL, data)
  }

   /* Delivery Insert Before Shipment Creation */
   updateShipmentOrderBeforeShipmentCreation(data) {
    return api.post(VEHICLE_ASSIGNEMNT_ADVANCE_INSERT_DELIVERY_SHIPMENT_REQUEST_URL, data)
   }

   /* Delivery Insert After Shipment Creation */
   updateShipmentOrderAfterShipmentCreation(data) {
    return api.post(VEHICLE_ASSIGNEMNT_LATER_INSERT_DELIVERY_SHIPMENT_REQUEST_URL, data)
   }

   /* Delivery Insert After Delivery Insert Approval */
   updateShipmentOrderAfterDeliveryInsertApproval(data) {
    return api.post(VEHICLE_ASSIGNEMNT_AFTER_APPROVAL_INSERT_DELIVERY_SHIPMENT_REQUEST_URL, data)
   }

  rejectShipmentRequestByUser(data) {
    return api.post(VEHICLE_ASSIGNEMNT_USER_REJECT_SHIPMENT_REQUEST_URL, data)
  }

  insertShipmentNumber(data) {
    return api.post(VEHICLE_ASSIGNEMNT_INSERT_SHIPMENT_REQUEST_URL, data)
  }

  /* Shipment Deletion Process */
  deleteShipmentOrder(shipment_no,data) {
    return api.post(DEPO_TS_TRUCK_INFO_URL + '/' + shipment_no,data)
  }

  /* Shipment Cancel Process */
  deleteShipmentTrip(data) {
    return api.post(VEHICLE_ASSIGNEMNT_CANCEL_TRIP_URL, data)
  }

  /* Shipment Delivery PGI Info Updation Process */
  updatePgiInfoToDb(data) {
    return api.get(VEHICLE_ASSIGNEMNT_SHIPMENT_PGI_INFO_UPDATION_URL + '/' + data)
  }

  /* Shipment Delivery Quantity Info Updation Process */
  updateDeliveryQuantityInfoToDb(data) {
    return api.get(VEHICLE_ASSIGNEMNT_SHIPMENT_DELIVERY_QTY_INFO_UPDATION_URL + '/' + data)
  }

  /* Shipment Delivery Invoice Info Updation Process */
  updateSecondWeightInfoToDb(data) {
    return api.get(VEHICLE_ASSIGNEMNT_SHIPMENT_SECONDWEIGHT_INFO_UPDATION_URL + '/' + data)
  }

  /* Get All Shipment Orders From DB for Report */
  getShipmentDataForReport() {
    return api.get(VEHICLE_ASSIGNEMNT_SHIPMENT_REPORT_VIEW_URL)
  }

  /* Get All Shipment Orders From DB for Report */
  sentShipmentDataForReport(data) {
    return api.post(VEHICLE_ASSIGNEMNT_SHIPMENT_REPORT_SENT_URL, data)
  }

  /* Get All Shipment Orders From DB */
  getMissingShipmentOrders() {
    return api.get(VEHICLE_ASSIGNEMNT_MISSING_SHIPMENT_VIEW_URL)
  }

}

export default new DepoShipmentCreationService()
