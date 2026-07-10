import axios from 'axios'

// const API_BASE_URL = 'http://localhost/' //Production
const API_BASE_URL = 'https://jsonplaceholder.typicode.com/todos/1' //Development

class VEHMaintain {
  getVEHMain() {
    return axios.get(API_BASE_URL)
  }
  getVEHMainOC() {
    return axios.get(API_BASE_URL)
  }
  getVEHMainHire() {
    return axios.get(API_BASE_URL)
  }
}

export default new VEHMaintain()
