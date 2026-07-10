import { combineReducers } from "redux";
import  AuthReducer  from "./Auth/AuthReducer";
import changeState from "./default/changeState";


export const rootReducer=combineReducers({
  auth:AuthReducer,
  changeState:changeState
})
