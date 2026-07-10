import AppConfig from 'src/AppConfig'
import api from '../Config'

const MATERIAL_MASTER_BASE_URL = AppConfig.api.baseUrl + '/materialMaster'
const MATERIAL_MASTER_VENDOR_CODE_URL = AppConfig.api.baseUrl + '/materialbycode'
const MATERIAL_MASTER_BASE_CREATION_BY_BULK_UPLOAD_URL = AppConfig.api.baseUrl + '/materialMasterBulkUpload'
export const MATERIAL_SOFT_DELETE_URL = AppConfig.api.baseUrl + '/materialSoftDeleteRequest'

class MaterialMasterService {
  getMaterialInfo() {
    return api.get(MATERIAL_MASTER_BASE_URL)
  }

  createMaterialInfo(value) {
    return api.post(MATERIAL_MASTER_BASE_URL, value)
  }

  getMaterialInfoById(MaterialInfoId) {
    return api.get(MATERIAL_MASTER_BASE_URL + '/' + MaterialInfoId)
  }

  updateMaterialInfo(MaterialInfoId, MaterialInfo) {
    return api.post(MATERIAL_MASTER_BASE_URL + '/' + MaterialInfoId, MaterialInfo)
  }

  deleteMaterialInfo(MaterialInfoId) {
    return api.delete(MATERIAL_MASTER_BASE_URL + '/' + MaterialInfoId)
  }
  getMaterialInfoByCode(MaterialInfoCode) {
    return api.get(MATERIAL_MASTER_VENDOR_CODE_URL + '/' + MaterialInfoCode)
  }

  /* Bulk Upload Process */
  createByBulkUpload(data) {
    return api.post(MATERIAL_MASTER_BASE_CREATION_BY_BULK_UPLOAD_URL, data)
  }

  softDeleteMaterial(data) {
    return api.post(MATERIAL_SOFT_DELETE_URL, data)
  }
}

export default new MaterialMasterService()
