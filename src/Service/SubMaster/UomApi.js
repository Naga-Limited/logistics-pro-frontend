import AppConfig from 'src/AppConfig'
import api from '../Config'

const UOM_BASE_URL = AppConfig.api.baseUrl + '/uom'

class UomApi {
  getUom() {
    return api.get(UOM_BASE_URL)
  }

  createUom(value) {
    return api.post(UOM_BASE_URL, value)
  }

  getUomById(UomId) {
    return api.get(UOM_BASE_URL + '/' + UomId)
  }

  updateUom(Uom_Data, UomId) {
    return api.put(UOM_BASE_URL + '/' + UomId, Uom_Data)
  }

  deleteUom(UomId) {
    return api.delete(UOM_BASE_URL + '/' + UomId)
  }
}

export default new UomApi()
