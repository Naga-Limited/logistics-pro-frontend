



import AppConfig from "src/AppConfig";
import api from "../Config";



const PERVIOUS_LOAD_DETAILS_URL = AppConfig.api.baseUrl+ '/previous_load_details'



class PerviousLoadDetailsService {


   getPerviousLoadDetails()
   {
    return api.get(PERVIOUS_LOAD_DETAILS_URL)
   }



}

export default new  PerviousLoadDetailsService()
