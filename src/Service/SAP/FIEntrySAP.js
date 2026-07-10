import AppConfig from 'src/AppConfig'
import api from '../Config'

const FI_ENTRY_SAP = AppConfig.api.baseUrl + '/SapFIPayment'

class FIEntrySAP {
  // Post Diesel Payment FROM SAP
  FIEntrySAPData(data) {
    return api.post(FI_ENTRY_SAP, data)
  }
}
export default new FIEntrySAP()


