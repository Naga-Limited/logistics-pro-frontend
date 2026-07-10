import AppConfig from 'src/AppConfig'
import api from '../Config'

const MATERIAL_DESC_URL = AppConfig.api.baseUrl + '/material_description'

class MaterialDescriptionApi {
  getMaterialDescription() {
    return api.get(MATERIAL_DESC_URL)
  }

  createMaterialDescription(value) {
    return api.post(MATERIAL_DESC_URL, value)
  }

  getMaterialDescriptionById(MaterialDescriptionId) {
    return api.get(MATERIAL_DESC_URL + '/' + MaterialDescriptionId)
  }

  updateMaterialDescription(MaterialDescription_Data, MaterialDescriptionId) {
    return api.put(MATERIAL_DESC_URL + '/' + MaterialDescriptionId, MaterialDescription_Data)
  }

  deleteMaterialDescription(MaterialDescriptionId) {
    return api.delete(MATERIAL_DESC_URL + '/' + MaterialDescriptionId)
  }
}

export default new MaterialDescriptionApi()
