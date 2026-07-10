import AppConfig from 'src/AppConfig'
import api from 'src/Service/Config'

const FCI_VENDOR_CREATION_BASE_URL = AppConfig.api.baseUrl + '/FCI/Vendor'
const FCI_SAP_VENDORS_FETCH_URL = AppConfig.api.baseUrl + '/FCI/SapVendorFetch'
const FCI_VENDOR_APPROVAL = AppConfig.api.baseUrl + '/FCI/VendorApproval/'
const FCI_VENDOR_CONFIRMATION = AppConfig.api.baseUrl + '/FCI/VendorConfirmation/'

// ============== Reports Part Start ===================//

const FCI_VENDOR_MASTER_REPORT_VIEW_URL = AppConfig.api.baseUrl + '/fciVendorMasterReportView'
const FCI_VENDOR_MASTER_REPORT_SENT_URL = AppConfig.api.baseUrl + '/fciVendorMasterReportRequest'

// ============== Reports Part End ===================//


class FCIVendorCreationService {

    getVendorRequestTableData() {
        return api.get(FCI_VENDOR_CREATION_BASE_URL)
    }

    getVendorRequestApproveTableData() {
        return api.get(FCI_VENDOR_APPROVAL)
    }

    getVendorRequestConfirmationTableData() {
        return api.get(FCI_VENDOR_CONFIRMATION)
    }

    /* Vendor Creation Process */
    createVendor(data) {
        return api.post(FCI_VENDOR_CREATION_BASE_URL, data)
    }

    cancelVendorInfo(vID) {
        return api.delete(FCI_VENDOR_CREATION_BASE_URL + '/' + vID)
    }

    getSingleVendorCreationInfo(vID) {
        return api.get(FCI_VENDOR_CREATION_BASE_URL + '/' + vID)
    }

    updateVendorRequestData(id, data) {
        return api.post(FCI_VENDOR_CREATION_BASE_URL + '/' + id, data)
    }

    getAllSapVendorsFromLP(){
        return api.get(FCI_SAP_VENDORS_FETCH_URL)
    }

    /* Get All FCI Vendors Info From DB for Report */
    getVendorMasterDataForReport() {
        return api.get(FCI_VENDOR_MASTER_REPORT_VIEW_URL)
    }

    /* Get All FCI Vendors Info From DB for Report */
    sentVendorMasterForReport(data) {
        return api.post(FCI_VENDOR_MASTER_REPORT_SENT_URL, data)
    }
    
}

export default new FCIVendorCreationService()