import axios from 'axios'

// const API_BASE_URL = 'http://localhost/' //Production
const API_BASE_URL = 'https://jsonplaceholder.typicode.com/todos/1' //Development

class PYG {
  getPYGown() {
    return axios.get(API_BASE_URL)
  }

  getPYGcontract() {
    return axios.get(API_BASE_URL)
  }
  getPYGhire() {
    return axios.get(API_BASE_URL)
  }
  getPYGparty() {
    return axios.get(API_BASE_URL)
  }
}

export default new PYG()
