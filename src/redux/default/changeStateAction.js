import { changeStateConstant } from "./changeStateConstants"



export const changeStateAction=(value)=>{
  console.log(value);
  return{
    action:changeStateConstant.set,
    payload:value
  }

}
