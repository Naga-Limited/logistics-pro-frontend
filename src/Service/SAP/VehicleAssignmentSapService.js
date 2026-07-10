import AppConfig from 'src/AppConfig'
import api from '../Config'

const URL = AppConfig.api.baseUrl + '/sap/fetch-sale-orders/'
const PGI_INFO_URL = AppConfig.api.baseUrl + '/sap/fetch-pgi-info/'
const DELIVERY_QTY_INFO_URL = AppConfig.api.baseUrl + '/sap/fetch-deliveryquantity-info/'
const SECONDWEIGHT_INFO_URL = AppConfig.api.baseUrl + '/sap/fetch-secondweight-info/'
const TS_TRUCK_INFO_URL = AppConfig.api.baseUrl + '/VehicleAssignment/'
const SHIPMENT_CREATION_URL = AppConfig.api.baseUrl + '/sap/shipment-creation'
const SHIPMENT_UPDATION_BY_DI_URL = AppConfig.api.baseUrl + '/sap/shipment-updation-di'
const SHIPMENT_DELETION_URL = AppConfig.api.baseUrl + '/sap/shipment-deletion'
const SHIPMENT_UPDATION_URL = AppConfig.api.baseUrl + '/sap/shipment-updation'
const SHIPMENT_INVOICE_UPDATION_URL = AppConfig.api.baseUrl + '/sap/shipment-invoice-completion'
const SHIPMENT_INVOICE_COMPLETION_CHECK_URL = AppConfig.api.baseUrl + '/sap/shipment-invoice-completion-check'
const SHIPMENT_INFO_FOR_UPDATION_URL = AppConfig.api.baseUrl + '/sap/shipment-info-updation'
const OWN_TRIPSHEET_FGSTO_INFO_URL = AppConfig.api.baseUrl + '/sap/own-tripsheet-fgsto-info'

class VehicleAssignmentSapService {
  /* Get Delivery Orders From SAP */
  getSaleOrders() {
    return api.get(URL)
  }

  /* Get PGI Info From SAP */
  getPGIInfoData() {
    return api.get(PGI_INFO_URL)
  }

  /* Get Delivery Quantity Info From SAP */
  getDeliveryQuantityInfoData() {
    return api.get(DELIVERY_QTY_INFO_URL)
  }

  /* Get 2nd Weight Info From SAP */
  getSecondWeightInfoData() {
    return api.get(SECONDWEIGHT_INFO_URL)
  }

  /* Shipment Creation Process */
  createShipment(data) {
    return api.post(SHIPMENT_CREATION_URL, data)
  }

  /* Shipment Deletion Process */
  deleteShipment(data) {
    return api.post(SHIPMENT_DELETION_URL, data)
  }

  /* Shipment Updation ( Delivery Delete ) Process */
  updateShipment(data) {
    return api.post(SHIPMENT_UPDATION_URL, data)
  }

  /* Shipment Updation ( Delivery Insert ) Process */
  updateShipmentByDeliveryInsert(data) {
    return api.post(SHIPMENT_UPDATION_BY_DI_URL, data)
  }

  /* Shipment Invoice Complete Updation Process */
  updateShipmentInvoiceCompletionCheck(data) {
    return api.post(SHIPMENT_INVOICE_COMPLETION_CHECK_URL, data)
  }

  /* Shipment Invoice Complete Updation Process for Depo */
  updateShipmentInvoiceCompletion(data) {
    return api.post(SHIPMENT_INVOICE_UPDATION_URL, data)
  }

  /* Get Tripsheet Created Truck Info */
  getTruckInfo() {
    return api.get(TS_TRUCK_INFO_URL)
  }

  /* Get Shipment Details For Updation Process */
  getShipmentInfoForUpdation(data) {
    return api.post(SHIPMENT_INFO_FOR_UPDATION_URL, data)
  }

  /* Get OWN Tripsheet Having FGSTO Details Process */
  getOTFGSTOInfo(data) {
    return api.post(OWN_TRIPSHEET_FGSTO_INFO_URL, data)
  }
}

export default new VehicleAssignmentSapService()
