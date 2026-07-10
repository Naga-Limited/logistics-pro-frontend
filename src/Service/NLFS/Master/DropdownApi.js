import AppConfig from 'src/AppConfig'
import api from 'src/Service/Config'

const DROPDOWN_URL = AppConfig.api.baseUrl + '/NLFS/Dropdown'

class DropdownApi {
  getDropdowns() {
    return api.get(DROPDOWN_URL)
  }

  createDropdowns(value) {
    return api.post(DROPDOWN_URL, value)
  }

  getDropdownsById(DropdownsId) {
    return api.get(DROPDOWN_URL + '/' + DropdownsId)
  }

  updateDropdowns(Dropdowns, DropdownsId) {
    return api.put(DROPDOWN_URL + '/' + DropdownsId, Dropdowns)
  }
}

export default new DropdownApi()
