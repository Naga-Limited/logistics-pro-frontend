import AppConfig from 'src/AppConfig'
import api from 'src/Service/Config'

const TRIPSHEETNUMBER1_DATA_FETCH_URL = AppConfig.api.baseUrl + '/Admin/getTripsheetNumber1Data'
const TRIPSHEETNUMBER7_DATA_FETCH_URL = AppConfig.api.baseUrl + '/Admin/getTripsheetNumber7Data'
const TRIPSHEETNUMBER6_DATA_FETCH_URL = AppConfig.api.baseUrl + '/Admin/getTripsheetNumber6Data'
const TRIPSHEETNUMBER5_DATA_FETCH_URL = AppConfig.api.baseUrl + '/Admin/getTripsheetNumber5Data'
const TICDATA_BY_TRIPSHEET_FETCH_URL = AppConfig.api.baseUrl + '/Admin/getTICDataByTripsheet'
const PARTIAL_SETLLEMENT_TRIPSHEETS_FETCH_URL = AppConfig.api.baseUrl + '/Admin/getPartialSettlementTripsheetsData/'
const INVOICE_REVERSAL_SHIPMENTS_FETCH_URL = AppConfig.api.baseUrl + '/Admin/getInvoiceReversalShipmentsData/'
const CHANGES_TYPE1_POST_URL = AppConfig.api.baseUrl + '/Admin/changesType1Post'
const CHANGES_TYPE2_POST_URL = AppConfig.api.baseUrl + '/Admin/changesType2Post'
const CHANGES_TYPE3_POST_URL = AppConfig.api.baseUrl + '/Admin/changesType3Post'
const CHANGES_TYPE4_POST_URL = AppConfig.api.baseUrl + '/Admin/changesType4Post'
const CHANGES_TYPE5_POST_URL = AppConfig.api.baseUrl + '/Admin/changesType5Post'
const CHANGES_TYPE6_POST_URL = AppConfig.api.baseUrl + '/Admin/changesType6Post'
const CHANGES_TYPE7_POST_URL = AppConfig.api.baseUrl + '/Admin/changesType7Post'
const CHANGES_TYPE8_POST_URL = AppConfig.api.baseUrl + '/Admin/changesType8Post'
const LP_DB_DOWNLOAD_URL = AppConfig.api.baseUrl + '/Admin/dbDownload'
const VRNUMBER_DATA_FETCH_URL = AppConfig.api.baseUrl + '/Admin/getVRNumberData'

const VISITER_INFO_REPORT_URL = AppConfig.api.baseUrl+ '/Admin/ReportVisitInfoReport'

class AdminSettingsService {

    // ================ GET REQUESTS ===================== //

    getTripsheetNumber1Data(ts_no) {
        return api.get(TRIPSHEETNUMBER1_DATA_FETCH_URL + '/' + ts_no)
    }

    getTripsheetNumber6Data(ts_no) {
        return api.get(TRIPSHEETNUMBER6_DATA_FETCH_URL + '/' + ts_no)
    }

    getTripsheetNumber5Data(ts_no) {
        return api.get(TRIPSHEETNUMBER5_DATA_FETCH_URL + '/' + ts_no)
    }

    getTICDataByTripsheet(ts_no) {
        return api.get(TICDATA_BY_TRIPSHEET_FETCH_URL + '/' + ts_no)
    }

    getPartialSettlementTripsheetsData() {
        return api.get(PARTIAL_SETLLEMENT_TRIPSHEETS_FETCH_URL)
    }

    getInvoiceReversalShipmentsData() {
        return api.get(INVOICE_REVERSAL_SHIPMENTS_FETCH_URL)
    }

    // ================ POST REQUESTs ===================== //

    /* Hire Vehicles Advance & Diesel Amount Edit */
    submitChangesType1(data) {
        return api.post(CHANGES_TYPE1_POST_URL, data)
    }

    /* Shipment Invoice Reversal */
    submitChangesType2(data) {
        return api.post(CHANGES_TYPE2_POST_URL, data)
    }

    /* Delivery's Inco Term Update */
    submitChangesType3(data) {
        return api.post(CHANGES_TYPE3_POST_URL, data)
    }

    /* Partial Tripsheets Update */
    submitChangesType4(data) {
        return api.post(CHANGES_TYPE4_POST_URL, data)
    }

    /* Delivery Removal Update */
    submitChangesType5(data) {
        return api.post(CHANGES_TYPE5_POST_URL, data)
    }

    /* Delivery PGI Update */
    submitChangesType6(data) {
        return api.post(CHANGES_TYPE6_POST_URL, data)
    }

    /* TS Purpose & Division Update */
    submitChangesType7(data) {
        return api.post(CHANGES_TYPE7_POST_URL, data)
    }

    /* Driver / Vendor Expense Edit */
    submitChangesType8(data) {
        return api.post(CHANGES_TYPE8_POST_URL, data)
    }

    dbDownload() {
        return api.get(LP_DB_DOWNLOAD_URL)
    }

    ReportVisitInfoReport(data){
        return api.post(VISITER_INFO_REPORT_URL,data)
    }

    getTripsheetNumber7Data(ts_no) {
        return api.get(TRIPSHEETNUMBER7_DATA_FETCH_URL + '/' + ts_no)
    }

    getVRNumberData(vr_no) {
        return api.get(VRNUMBER_DATA_FETCH_URL + '/' + vr_no)
    }

}

export default new AdminSettingsService()