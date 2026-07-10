import { authConstant } from "./AuthConstant";

const initialState={
  is_auth:true,
  user_info:{}
}


 const AuthReducer=(state=initialState,action)=>{
  switch (action.type) {
    case authConstant.LOGIN_REQUEST:return{
      ...state,is_auth:true,user_info:action.payload
    }


    default: return state
  }
}

export default AuthReducer
