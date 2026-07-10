import AppConfig from "src/AppConfig"
import api from "src/Service/Config"

const IFOODS_TS_TRUCK_INFO_URL = AppConfig.api.baseUrl + '/IfoodsShipmentCreation'
const IFOODS_SHIPMENT_VIEW_URL = AppConfig.api.baseUrl + '/IfoodsShipmentView'
const IFOODS_SHIPMENT_WAITING_VIEW_URL = AppConfig.api.baseUrl + '/IfoodsWaitingShipmentView'
const IFOODS_SHIPMENT_WAITING_DELIVERIES_VIEW_URL = AppConfig.api.baseUrl + '/IfoodsWaitingShipmentDeliveries'
const IFOODS_SHIPMENT_STARTING_VIEW_URL = AppConfig.api.baseUrl + '/IfoodsCreateShipmentView'
const VEHICLE_ASSIGNEMNT_SINGLE_IFOODS_SHIPMENT_CHILD_INFO_VIEW_URL = AppConfig.api.baseUrl + '/singleIfoodsShipmentChildInfo'
const VEHICLE_ASSIGNEMNT_SINGLE_IFOODS_SHIPMENT_VIEW_URL = AppConfig.api.baseUrl + '/singleIfoodsShipment'
const VEHICLE_ASSIGNEMNT_SINGLE_IFOODS_SHIPMENT_BY_PID_VIEW_URL = AppConfig.api.baseUrl + '/singleIfoodsShipmentByPid'
const VEHICLE_ASSIGNEMNT_SINGLE_IFOODS_SHIPMENT_PYG_VIEW_URL = AppConfig.api.baseUrl + '/singleIfoodsShipmentPYG'
const VEHICLE_ASSIGNEMNT_CANCEL_TRIP_URL = AppConfig.api.baseUrl + '/singleIfoodsShipmentCancel'
const VEHICLE_ASSIGNEMNT_CONFIRM_SHIPMENT_REQUEST_URL = AppConfig.api.baseUrl + '/confirmIfoodsShipment'
const VEHICLE_ASSIGNEMNT_REJECT_SHIPMENT_REQUEST_URL = AppConfig.api.baseUrl + '/rejectIfoodsShipment'
const VEHICLE_ASSIGNEMNT_REJECT_DELIVERY_INSERT_REQUEST_URL = AppConfig.api.baseUrl + '/rejectIfoodsDeliveryInsert'
const VEHICLE_ASSIGNEMNT_PAUSE_SHIPMENT_REQUEST_URL = AppConfig.api.baseUrl + '/pauseIfoodsShipment'
const VEHICLE_ASSIGNEMNT_INSERTION_DELIVERIES_REQUEST_URL = AppConfig.api.baseUrl + '/insertionDeliveriesIfoodsShipment'
const VEHICLE_ASSIGNEMNT_UNPAUSE_SHIPMENT_REQUEST_URL = AppConfig.api.baseUrl + '/unpauseIfoodsShipment'
const VEHICLE_ASSIGNEMNT_ADVANCE_DELETE_DELIVERY_SHIPMENT_REQUEST_URL = AppConfig.api.baseUrl + '/deleteIfoodsShipmentDeliveryAdvance'
const VEHICLE_ASSIGNEMNT_ADVANCE_INSERT_DELIVERY_SHIPMENT_REQUEST_URL = AppConfig.api.baseUrl + '/insertIfoodsShipmentDeliveryAdvance'
const VEHICLE_ASSIGNEMNT_LATER_INSERT_DELIVERY_SHIPMENT_REQUEST_URL = AppConfig.api.baseUrl + '/insertIfoodsShipmentDeliveryLater'
const VEHICLE_ASSIGNEMNT_AFTER_APPROVAL_INSERT_DELIVERY_SHIPMENT_REQUEST_URL = AppConfig.api.baseUrl + '/insertIfoodsShipmentDeliveryAfterApproval'
const VEHICLE_ASSIGNEMNT_USER_REJECT_SHIPMENT_REQUEST_URL = AppConfig.api.baseUrl + '/rejectIfoodsShipmentByUser'
const VEHICLE_ASSIGNEMNT_INSERT_SHIPMENT_REQUEST_URL = AppConfig.api.baseUrl + '/insertIfoodsShipmentNo'
const VEHICLE_ASSIGNEMNT_SHIPMENT_PGI_INFO_UPDATION_URL = AppConfig.api.baseUrl + '/IfoodsPgiInfoUpdate'
const VEHICLE_ASSIGNEMNT_SHIPMENT_DELIVERY_QTY_INFO_UPDATION_URL = AppConfig.api.baseUrl + '/IfoodsDeliveryQuantityInfoUpdate'
const VEHICLE_ASSIGNEMNT_SHIPMENT_SECONDWEIGHT_INFO_UPDATION_URL = AppConfig.api.baseUrl + '/IfoodssecondWeightInfoUpdate'

const VEHICLE_ASSIGNEMNT_SHIPMENT_REPORT_VIEW_URL = AppConfig.api.baseUrl + '/shipmentIfoodsReportView'
const VEHICLE_ASSIGNEMNT_SHIPMENT_REPORT_SENT_URL = AppConfig.api.baseUrl + '/shipmentIfoodsReportRequest'

class IfoodsShipmentCreationService {

  /* Get Ifoods Tripsheet Created Truck Info */
  getTruckInfo() {
    return api.get(IFOODS_TS_TRUCK_INFO_URL)
  }

  /* Get All Ifoods Shipment Orders From DB */
  getAllShipmentOrders() {
    return api.get(IFOODS_SHIPMENT_VIEW_URL)
  }

  /* Get All Ifoods Waiting Shipment Orders From DB */
  getAllWaitingShipmentOrders() {
    return api.get(IFOODS_SHIPMENT_WAITING_VIEW_URL)
  }

  getShipmentWiseWaitingDeliveries() {
    return api.get(IFOODS_SHIPMENT_WAITING_DELIVERIES_VIEW_URL)
  }

  /* Get All Ifoods Starting Shipment Orders From DB */
  getAllCreatingShipmentOrders() {
    return api.get(IFOODS_SHIPMENT_STARTING_VIEW_URL)
  }

  /* Shipment Creation Process */
  createShipmentOrder(data) {
    return api.post(IFOODS_TS_TRUCK_INFO_URL, data)
  }

  // /* Get Single Shipment By Id */
  // getSingleShipmentChildIdInfo(id) {
  //   return api.get(IFOODS_TS_TRUCK_INFO_URL + '/' + id)
  // }

   /* Get Single Ifoods Shipment Child Info From DB */
   getSingleIfoodsShipmentChildInfo(shipment_id) {
    return api.get(VEHICLE_ASSIGNEMNT_SINGLE_IFOODS_SHIPMENT_CHILD_INFO_VIEW_URL + '/' + shipment_id)
  }


  /* Get Single Ifoods Shipment Parent Info From DB */
  getSingleIfoodsShipment(shipment_id) {
    return api.get(VEHICLE_ASSIGNEMNT_SINGLE_IFOODS_SHIPMENT_VIEW_URL + '/' + shipment_id)
  }

  /* Get Single Ifoods Shipment Parent Info By Using Parking_id From DB */
  getSingleIfoodsShipmentByParkingId(shipment_id) {
    return api.get(VEHICLE_ASSIGNEMNT_SINGLE_IFOODS_SHIPMENT_BY_PID_VIEW_URL + '/' + shipment_id)
  }

  /* Shipment Updation ( Delivery Insert / Delete ) Process */
  updateIfoodsShipmentOrder(id, data) {
    return api.post(IFOODS_TS_TRUCK_INFO_URL + '/' + id, data)
  }

  /* Get Single Shipment Parent Info with Parking Yard data From DB */
  getSingleIfoodsShipmentPYGData(parking_id) {
    return api.get(VEHICLE_ASSIGNEMNT_SINGLE_IFOODS_SHIPMENT_PYG_VIEW_URL + '/' + parking_id)
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
    return api.post(IFOODS_TS_TRUCK_INFO_URL + '/' + shipment_no,data)
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

}

export default new IfoodsShipmentCreationService()
