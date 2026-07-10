import AppConfig from 'src/AppConfig'
import api from '../Config'

export const USER_MASTER_BASE_URL = AppConfig.api.baseUrl + '/users'
export const USER_MASTER_UPDATE_BASE_URL = AppConfig.api.baseUrl + '/users/'
export const USER_MASTER_ASSIGN_PERMISSION_URL = AppConfig.api.baseUrl + '/users-page-permission'
export const USER_ID_CREATE_BASE_URL = AppConfig.api.baseUrl + '/create_unique_userid/'
export const USER_LOGIN_DETAILS = AppConfig.api.baseUrl + '/user_count'
export const USER_SOFT_DELETE_URL = AppConfig.api.baseUrl + '/userSoftDeleteRequest'

//  API For User Login Master
class UserLoginMasterService {
  // Get All User
  getUser() {
    return api.get(USER_MASTER_BASE_URL)
  }

  // Create New User
  createUser(data) {
    console.log(USER_MASTER_BASE_URL)
    console.log(data)
    return api.post(USER_MASTER_BASE_URL, data)
  }

  // Get Single User By Id
  getUserById(UserId) {
    return api.get(USER_MASTER_UPDATE_BASE_URL + UserId)
  }

  // Update Single User By Id
  updateUser(UserId, data) {
    return api.post(USER_MASTER_UPDATE_BASE_URL + UserId, data)
  }

  // Assign Permissions to Single User By Id
  assignPermission(data) {
    return api.post(USER_MASTER_ASSIGN_PERMISSION_URL, data)
  }

  // Delete Single User By Id
  deleteUser(UserId) {
    return api.delete(USER_MASTER_UPDATE_BASE_URL + UserId)
  }
  createUniqueUserId(data) {
    return api.get(USER_ID_CREATE_BASE_URL+data)
  }

  getUserLoginDetails() {
    return api.get(USER_LOGIN_DETAILS)
  }

  softDeleteUser(data) {
    return api.post(USER_SOFT_DELETE_URL, data)
  }
}

export default new UserLoginMasterService()
