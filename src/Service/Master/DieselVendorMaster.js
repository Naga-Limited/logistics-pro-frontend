import axios from 'axios'

// const API_BASE_URL = 'http://localhost/' //Production
// const API_BASE_URL = 'https://jsonplaceholder.typicode.com/todos/1' //Development

class DieselVendorMaster {
  getDieselVendor() {
    return axios.get(API_BASE_URL)
  }

  createDieselVendor(value) {
    return axios.post(API_BASE_URL, value)
  }

  getDieselVendorById(DieselVendorId) {
    return axios.get(API_BASE_URL + '/' + DieselVendorId)
  }

  updateDieselVendor(DieselVendor, DieselVendorId) {
    return axios.put(API_BASE_URL + '/' + DieselVendorId, DieselVendor)
  }

  deleteDieselVendor(DieselVendorId) {
    return axios.delete(API_BASE_URL + '/' + DieselVendorId)
  }
}

export default new DieselVendorMaster()
