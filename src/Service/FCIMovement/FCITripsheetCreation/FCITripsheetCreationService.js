import AppConfig from 'src/AppConfig'
import api from 'src/Service/Config'

const FCI_LOCATION_MASTER_BASE_URL = AppConfig.api.baseUrl + '/definitions_list'
const FCI_TRIPSHEET_CREATION_BASE_URL = AppConfig.api.baseUrl + '/FCI/Tripsheet/'
const FCI_TRIPSHEET_UPDATION_BASE_URL = AppConfig.api.baseUrl + '/FCI/Tripsheet-Update'
const FCI_TRIPSHEET_BEFORE_CHECK_URL = AppConfig.api.baseUrl + '/FCI/fciTripsheetBeforeCheck/'
const FCI_TRIP_SHEET_NUMBER_FETCH_URL = FCI_TRIPSHEET_CREATION_BASE_URL + 'get-ts-no/'
const FCI_BULK_UPLOAD_TRIP_SHEET_NUMBER_FETCH_URL = FCI_TRIPSHEET_CREATION_BASE_URL + 'get-ts-no-upload/'
const FCI_TRIPSHEET_CREATION_POST_URL = AppConfig.api.baseUrl + '/FCI/Tripsheet'
const FCI_TRIPSHEET_BY_PO_PLANT_VIEW_URL = AppConfig.api.baseUrl + '/FCITripsheet/ts-no-by-pop'

// ============== Reports Part Start ===================//

const FCI_TRIPSHEET_REPORT_VIEW_URL = AppConfig.api.baseUrl + '/fciTripsheetReportView'
const FCI_TRIPSHEET_REPORT_SENT_URL = AppConfig.api.baseUrl + '/fciTripsheetReportRequest'

const FCI_TRIPSHEET_FREIGHT_MIGO_REPORT_VIEW_URL = AppConfig.api.baseUrl + '/fciFreightMigoReportView'
const FCI_TRIPSHEET_FREIGHT_MIGO_REPORT_SENT_URL = AppConfig.api.baseUrl + '/fciFreightMigoReportRequest'

const FCI_TRIPSHEET_LOADING_MIGO_REPORT_VIEW_URL = AppConfig.api.baseUrl + '/fciLoadingMigoReportView'
const FCI_TRIPSHEET_LOADING_MIGO_REPORT_SENT_URL = AppConfig.api.baseUrl + '/fciLoadingMigoReportRequest'

// ============== Reports Part End ===================//

class FCITripsheetCreationService {
    createRakeVendor(value) {
        return api.post(FCI_LOCATION_MASTER_BASE_URL, value)
    }

    getTripeInfoById(id) {
        return api.get(FCI_TRIPSHEET_CREATION_BASE_URL + id)
    }

    /* Tripsheet Updation Process */
    updateTripsheet(data) {
        return api.post(FCI_TRIPSHEET_UPDATION_BASE_URL, data)
    }

    /* Duplicate data Check for Single BDC Upload */
    checkDuplicateDataForPoNoVehNo(po_number,veh_no) {
        return api.post(FCI_TRIPSHEET_BEFORE_CHECK_URL + po_number+'||'+veh_no)
    }

    getFCITripSheetNo(code) {
        return api.get(FCI_TRIP_SHEET_NUMBER_FETCH_URL+code)
    }
    
    getFCITripSheetNoForBulkUpload(code) {
        return api.get(FCI_BULK_UPLOAD_TRIP_SHEET_NUMBER_FETCH_URL+code)
    }    

    /* Tripsheet Creation Process */
    createTripsheet(data) {
        return api.post(FCI_TRIPSHEET_CREATION_POST_URL, data)
    }

    getVehicleReadyToTripsheetEdit() {
        return api.get(FCI_TRIPSHEET_CREATION_BASE_URL)
    }

    /* Get All Tripsheets by PO & Plant From DB */
    getTripsheetDatabyPOPGrouping() {
        return api.get(FCI_TRIPSHEET_BY_PO_PLANT_VIEW_URL)
    }

    /* Get All Tripsheets From DB for Report */
    getTripsheetDataForReport() {
        return api.get(FCI_TRIPSHEET_REPORT_VIEW_URL)
    }

    /* Get All Tripsheets From DB for Report */
    sentTripsheetDataForReport(data) {
        return api.post(FCI_TRIPSHEET_REPORT_SENT_URL, data)
    }

    /* Get All Tripsheet Freight Migo Details From DB for Report */
    getTripsheetFreightMigoDataForReport() {
        return api.get(FCI_TRIPSHEET_FREIGHT_MIGO_REPORT_VIEW_URL)
    }

    /* Get All Tripsheet Freight Migo Details From DB for Report */
    sentTripsheetFreightMigoDataForReport(data) {
        return api.post(FCI_TRIPSHEET_FREIGHT_MIGO_REPORT_SENT_URL, data)
    }

    /* Get All Tripsheet Loading Migo Details From DB for Report */
    getTripsheetLoadingMigoDataForReport() {
        return api.get(FCI_TRIPSHEET_LOADING_MIGO_REPORT_VIEW_URL)
    }

    /* Get All Tripsheet Loading Migo Details From DB for Report */
    sentTripsheetLoadingMigoDataForReport(data) {
        return api.post(FCI_TRIPSHEET_LOADING_MIGO_REPORT_SENT_URL, data)
    }
}

export default new FCITripsheetCreationService()
