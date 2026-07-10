import AppConfig from 'src/AppConfig'
import api from '../Config'

const TIC_MASTER_BASE_URL = AppConfig.api.baseUrl + '/trip_info_capture'
const TIC_MASTER_COMPLETE_URL = AppConfig.api.baseUrl + '/trip_info_capture_complete'
const TIC_MASTER_DELETE_URL = AppConfig.api.baseUrl + '/trip_info_capture_delete'
const TIC_MASTER_UNDELETE_URL = AppConfig.api.baseUrl + '/trip_info_capture_undelete'
const OWN_VEHICLE_OPEN_TRIPSHEETS_INFO_VIEW_URL = AppConfig.api.baseUrl + '/ovotScreenView'
const OWN_VEHICLE_OPEN_TRIPSHEETS_INFO_ADMIN_VIEW_URL = AppConfig.api.baseUrl + '/ovotScreenAdminView'
const TIC_MASTER_REPORT_VIEW_URL = AppConfig.api.baseUrl + '/ticReportView' 
const TIC_MASTER_REPORT_SENT_URL = AppConfig.api.baseUrl + '/ticReportRequest'
const TIC_RJ_MASTER_REPORT_VIEW_URL = AppConfig.api.baseUrl + '/ticrjReportView' 
const TIC_RJ_MASTER_REPORT_SENT_URL = AppConfig.api.baseUrl + '/ticrjReportRequest'

const PBFC_OV_MASTER_REPORT_VIEW_URL = AppConfig.api.baseUrl + '/pbfcOwnVehiclesReportView'   

const PBFC_HVF_MASTER_REPORT_VIEW_URL = AppConfig.api.baseUrl + '/pbfcHireVehiclesNLFDReportView'  

const PBFC_HVC_MASTER_REPORT_VIEW_URL = AppConfig.api.baseUrl + '/pbfcHireVehiclesNLCDReportView'  

const TRIP_INFO_PUSH_TO_SAP_POST_API_URL = AppConfig.api.baseUrl + '/sap/tripInfoPushToSAP'
const BULK_TRIP_INFO_PUSH_TO_SAP_POST_API_URL = AppConfig.api.baseUrl + '/sap/bulkTripInfoPushToSAP'

const TRIP_INFO_PUSH_TO_SAP_BY_BULK_UPLOAD_URL = AppConfig.api.baseUrl + '/tripInfoPushToSAPBulkUploadVerification'
const TRIP_INFO_PUSH_TO_SAP_UPDATION_URL = AppConfig.api.baseUrl + '/tripInfoPushToSAPBulkUploadUpdation'

const TIC_MASTER_DATA_BY_TSNO_URL = AppConfig.api.baseUrl + '/trip_info_capture_by_tripsheet_no'

const INV_INFO_PUSH_TO_PRO_BY_BULK_UPLOAD_URL = AppConfig.api.baseUrl + '/invInfoPushToPROBulkUploadVerification'
const INV_INFO_PUSH_TO_PRO_UPDATION_URL = AppConfig.api.baseUrl + '/invInfoPushToPROBulkUploadUpdation'

class TripInfoCaptureService {

    getTICData() {
      return api.get(TIC_MASTER_BASE_URL)
    } 

    getTICAdminData() {
        return api.get(OWN_VEHICLE_OPEN_TRIPSHEETS_INFO_ADMIN_VIEW_URL)
    }

    getTICInfoById(tic_id) {
        return api.get(TIC_MASTER_BASE_URL + '/' + tic_id)
    }

    getTICInfoByTripsheetNo(tripsheet_no) {
        return api.get(TIC_MASTER_DATA_BY_TSNO_URL + '/' + tripsheet_no)
    }

    insertTICData(value) {
        return api.post(TIC_MASTER_BASE_URL, value)
    }

    updateTICData(id, value) {
        return api.post(TIC_MASTER_BASE_URL + '/' + id, value)
      }

    /* Get All Own Vehicle Open Tripsheet Info From DB for Report */
    getOVOTInfoForReport() {
        return api.get(OWN_VEHICLE_OPEN_TRIPSHEETS_INFO_VIEW_URL)
    }

    completeTICInfoById(dt_id) {
        return api.get(TIC_MASTER_COMPLETE_URL + '/' + dt_id)
    }

    closeTICInfoById(dt_id) {
        return api.get(TIC_MASTER_DELETE_URL + '/' + dt_id)
    }

    uncloseTICInfoById(dt_id) {
        return api.get(TIC_MASTER_UNDELETE_URL + '/' + dt_id)
    }

    /* Get All TIC Info From DB for Report */
    getTICInfoForReport() {
        return api.get(TIC_MASTER_REPORT_VIEW_URL)
    }

    /* Get All TIC Info From DB for Report */
    sentTICInfoForReport(data) {
        return api.post(TIC_MASTER_REPORT_SENT_URL, data)
    }

    /* Get All TIC RJ Info From DB for Report */
    getTICRJInfoForReport() {
        return api.get(TIC_RJ_MASTER_REPORT_VIEW_URL)
    }

    /* Get All TIC RJ Info From DB for Report */
    sentTICRJInfoForReport(data) {
        return api.post(TIC_RJ_MASTER_REPORT_SENT_URL, data)
    }

    /* Get All PBFC OV Info From DB for Report */
    PBFCOwnVehiclesReport() {
        return api.get(PBFC_OV_MASTER_REPORT_VIEW_URL)
    } 

    /* Get All PBFC OV Info From DB for Report */
    PBFCHireVehiclesNLFDReport() {
        return api.get(PBFC_HVF_MASTER_REPORT_VIEW_URL)
    } 

    /* Get All PBFC OV Info From DB for Report */
    PBFCHireVehiclesNLCDReport() {
        return api.get(PBFC_HVC_MASTER_REPORT_VIEW_URL)
    }  
    
    /* Trip Info Sent to SAP */
    tripInfoPushToSAP(data){
        return api.post(TRIP_INFO_PUSH_TO_SAP_POST_API_URL, data)
    }

    /* Bulk Upload Process */
    createByBulkUpload(data) {
        return api.post(TRIP_INFO_PUSH_TO_SAP_BY_BULK_UPLOAD_URL, data)
    }

    /* Bulk Trip Info Sent to SAP */
    bulkTripInfoPushToSAP(data){
        return api.post(BULK_TRIP_INFO_PUSH_TO_SAP_POST_API_URL, data)
    }

    /* Bulk Upload Process */
    updateBulkUpload(data) {
        return api.post(TRIP_INFO_PUSH_TO_SAP_UPDATION_URL, data)
    }

    /* Bulk Upload Process */
    invInfoCreateByBulkUpload(data) {
        return api.post(INV_INFO_PUSH_TO_PRO_BY_BULK_UPLOAD_URL, data)
    }

    /* Bulk Upload Process */
    invInfoUpdateByBulkUpload(data) {
        return api.post(INV_INFO_PUSH_TO_PRO_UPDATION_URL, data)
    }
} 

export default new TripInfoCaptureService()