import AppConfig from 'src/AppConfig'
import api from '../Config'

const URL = AppConfig.api.baseUrl + '/sap/check-vendor-available/'
const NLCDURL = AppConfig.api.baseUrl + '/sap/check-nlcd-vendor-available/'
const NLFSURL = AppConfig.api.baseUrl + '/sap/check-nlfs-fuel-rate/'
const NLFS_NLLD_DISCOUNT_URL = AppConfig.api.baseUrl + '/sap/check-nlfs-nlld-discount-fuel-rate'
const NLFS_ALL_DISCOUNT_URL = AppConfig.api.baseUrl + '/sap/check-nlfs-all-discount-fuel-rate/'
const NLFSINFOURL = AppConfig.api.baseUrl + '/sap/get-nlfs-fuel-info'

class VendorOutstanding {
  // GET SINGLE PAN DATA FROM SAP
  getVendoroutstanding(vendor_no) {
    return api.get(URL + vendor_no)
  }

  getNLCDVendoroutstanding(vendor_no) {
    return api.get(NLCDURL + vendor_no)
  }

  getNLFSDieselRate(div_ode) {
    return api.get(NLFSURL + div_ode)
  }

  getNLLDFuelDiscount() {
    return api.get(NLFS_NLLD_DISCOUNT_URL)
  }

  getFuelDiscountByDivisionCode(div_code) {
    return api.get(NLFS_ALL_DISCOUNT_URL + div_code)
  }

  getNLFSDieselInfo(data) {
    return api.post(NLFSINFOURL, data)
  }
}

export default new VendorOutstanding()
