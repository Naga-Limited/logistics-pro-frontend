
import AppConfig from "src/AppConfig";
import api from "../Config";



const BANK_URL = AppConfig.api.baseUrl+ '/bank'



class BankService {


   getBankDetails()
   {
    return api.get(BANK_URL)
   }
}

export default new  BankService()
