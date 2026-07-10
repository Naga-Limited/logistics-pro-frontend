import axios from 'axios'
import AppConfig from 'src/AppConfig'

const token = localStorage.getItem('auth_token')

const api = axios.create({
  baseURL: AppConfig.api.baseUrl,
  timeout: 100000,
  headers: {
    Accept: 'application/json',
    Authorization: `Bearer ${token}`,
  },
})

export const api_copy = axios.create({
  baseURL: AppConfig.api.baseUrl,
  timeout: 100000,
  headers: {
    // 'Accept': 'application/json',
    'Content-Type': 'multipart/form-data',
    Authorization: `Bearer ${token}`,
  },
})

export default api
