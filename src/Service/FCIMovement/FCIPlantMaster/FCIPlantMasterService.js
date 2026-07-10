import AppConfig from 'src/AppConfig'
import api from 'src/Service/Config'

const FCI_PLANT_MASTER_CREATION_BASE_URL = AppConfig.api.baseUrl + '/FCI/Plant'
const FCI_ACTIVE_PLANT_MASTER_CREATION_BASE_URL = AppConfig.api.baseUrl + '/FCI/ActivePlantList'

class FCIPlantMasterService {

    getFCIPlantRequestTableData() {
        return api.get(FCI_PLANT_MASTER_CREATION_BASE_URL)
    }

    getActiveFCIPlantRequestTableData() {
        return api.get(FCI_ACTIVE_PLANT_MASTER_CREATION_BASE_URL)
    }

    getFCIPlantListById(PlantId) {
        return api.get(FCI_PLANT_MASTER_CREATION_BASE_URL + '/' + PlantId)
    }    

    createFCIPlant(value) {
        return api.post(FCI_PLANT_MASTER_CREATION_BASE_URL, value)
    }

    updateFCIPlantListById(PlantId, data) {
        return api.post(FCI_PLANT_MASTER_CREATION_BASE_URL + '/' + PlantId, data)
    }

    deleteFCIPlantRequestTableData(vID) {
        return api.delete(FCI_PLANT_MASTER_CREATION_BASE_URL + '/' + vID)
    }

}

export default new FCIPlantMasterService()

