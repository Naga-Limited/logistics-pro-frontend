import AppConfig from "src/AppConfig";
import api from "../Config";

const DEPARTMENT_URL = AppConfig.api.baseUrl+ '/department' //Development

class DepartmentApi {
  getDepartment() {
    return api.get(DEPARTMENT_URL)
  }

  createDepartment(value) {
    return api.post(DEPARTMENT_URL, value)
  }

  getDepartmentById(DepartmentId) {
    return api.get(DEPARTMENT_URL + '/' + DepartmentId)
  }

  updateDepartment(Department, DepartmentId) {
    return api.put(DEPARTMENT_URL + '/' + DepartmentId, Department)
  }

  deleteDepartment(DepartmentId) {
    return api.delete(DEPARTMENT_URL + '/' + DepartmentId)
  }
}

export default new DepartmentApi()
