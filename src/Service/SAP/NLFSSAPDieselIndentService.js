import AppConfig from 'src/AppConfig'
import api from '../Config'

const NLFS_DI_SAP_SO_CREATION_URL = AppConfig.api.baseUrl + '/NLFSSapSOCreation'
const NLFS_DI_SAP_DO_CREATION_URL = AppConfig.api.baseUrl + '/NLFSSapDOCreation'
const NLFS_DI_SAP_INVOICE_CREATION_URL = AppConfig.api.baseUrl + '/NLFSSapInvoiceCreation'
const NLFS_DI_SAP_EWAYBILL_CREATION_URL = AppConfig.api.baseUrl + '/NLFSSapEWayBillCreation'

class NLFSSAPDieselIndentService { 

  NLFSSOCreation(data) {
    return api.post(NLFS_DI_SAP_SO_CREATION_URL, data)
  }

  NLFSDOCreation(data) {
    return api.post(NLFS_DI_SAP_DO_CREATION_URL, data)
  }

  NLFSInvoiceCreation(data) {
    return api.post(NLFS_DI_SAP_INVOICE_CREATION_URL, data)
  }

  NLFSEWayBillCreation(data) {
    return api.post(NLFS_DI_SAP_EWAYBILL_CREATION_URL, data)
  }

}
export default new NLFSSAPDieselIndentService()


