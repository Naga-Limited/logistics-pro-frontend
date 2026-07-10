import AppConfig from 'src/AppConfig'
import api from 'src/Service/Config'

const DROPDOWNS_LIST_URL = AppConfig.api.baseUrl + '/NLFS/DropdownList'
const DROPDOWNS_LIST_BY_DROPDOWN_URL = AppConfig.api.baseUrl + '/dropdowns_list_by_dropdown'
const ACTIVE_DROPDOWNS_LIST_BY_DROPDOWN_URL = AppConfig.api.baseUrl + '/active_dropdowns_list_by_dropdown'

class DropdownListApi {
  getDropdownsList() {
    return api.get(DROPDOWNS_LIST_URL)
  }

  visibleDropdownsListByDropdown(DropdownId) {
    return api.get(DROPDOWNS_LIST_BY_DROPDOWN_URL + '/' + DropdownId)
  }

  createDropdownsList(value) {
    return api.post(DROPDOWNS_LIST_URL, value)
  }

  getDropdownsListById(DropdownsListId) {
    return api.get(DROPDOWNS_LIST_URL + '/' + DropdownsListId)
  }

  updateDropdownsList(DropdownsList, DropdownsListId) {
    return api.put(DROPDOWNS_LIST_URL + '/' + DropdownsListId, DropdownsList)
  }

  deleteDropdownsList(DropdownsListId) {
    return api.delete(DROPDOWNS_LIST_URL + '/' + DropdownsListId)
  }
  activevisibleDropdownsListByDropdown(DropdownId) {
    return api.get(ACTIVE_DROPDOWNS_LIST_BY_DROPDOWN_URL + '/' + DropdownId)
  }
}

export default new DropdownListApi()
