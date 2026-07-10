import axios from 'axios'

// const API_BASE_URL = 'http://localhost/' //Production
const API_BASE_URL = 'https://jsonplaceholder.typicode.com/todos/1' //Development

class ShedMaster {
  getShed() {
    return axios.get(API_BASE_URL)
  }

  createShed(value) {
    return axios.post(API_BASE_URL, value)
  }

  getShedById(ShedId) {
    return axios.get(API_BASE_URL + '/' + ShedId)
  }

  updateShed(Shed, ShedId) {
    return axios.put(API_BASE_URL + '/' + ShedId, Shed)
  }

  deleteShed(ShedId) {
    return axios.delete(API_BASE_URL + '/' + ShedId)
  }
}

export default new ShedMaster()
