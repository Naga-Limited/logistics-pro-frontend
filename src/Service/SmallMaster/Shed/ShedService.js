import AppConfig from 'src/AppConfig'
import api from '../../Config'

const SHED_TYPE_URL = AppConfig.api.baseUrl + '/shedType'
const SHED_DATA_URL = AppConfig.api.baseUrl + '/shed/'

class ShedService {
  getAllShedData() {
    return api.get(SHED_DATA_URL)
  }
  SingleShedData(id) {
    return api.get(SHED_DATA_URL + id)
  }
  getShedType() {
    return api.get(SHED_TYPE_URL)
  }
  
}

export default new ShedService()
