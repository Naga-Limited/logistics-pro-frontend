import { authConstant } from './AuthConstant'

const loginRequest = (value) => {
  return {
    type: authConstant.LOGIN_REQUEST,
    payload: value,
  }
}

export default loginRequest
