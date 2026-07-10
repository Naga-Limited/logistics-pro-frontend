import axios from 'axios'

// const API_BASE_URL = '' //Production
const API_BASE_URL = 'https://jsonplaceholder.typicode.com/todos/1' //Development

class VEHInspection {
  getVEHIns() {
    return axios.get(API_BASE_URL)
  }
  getVEHInsO() {
    return axios.get(API_BASE_URL)
  }
  getVEHInsHIre() {
    return axios.get(API_BASE_URL)
  }
}

export default new VEHInspection()
