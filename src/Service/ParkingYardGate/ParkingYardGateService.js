import AppConfig from 'src/AppConfig'
import api from '../Config'

import { VEHILCE_MASTER_BASE_URL } from 'src/Service/Master/VehicleMasterService'

const PARKING_YRD_URL = AppConfig.api.baseUrl + '/parkingYard'

const PARKING_YRD_GATE_IN_ACTION_URL = AppConfig.api.baseUrl + '/parkingYard/action/gateIn/'
const PARKING_YRD_GATE_OUT_ACTION_URL = AppConfig.api.baseUrl + '/parkingYard/action/gateOut/'

const VEHILCE_BY_TYPE_URLS = VEHILCE_MASTER_BASE_URL + '/type/'

const VEHILCE_INFO_BY_VID_URLS = VEHILCE_MASTER_BASE_URL + '/'

const DRIVERS_LIST_URL = AppConfig.api.baseUrl + '/drivers/'

const AVAIABLE_DRIVERS_LIST_URL = AppConfig.api.baseUrl + '/activeDrivers'

const GATE_IN_REPORT = AppConfig.api.baseUrl + '/parkingYardGate_Index'
const GATEIN_REPORT_SENT_URL = AppConfig.api.baseUrl + '/GateInReportRequest'
const PYG_Others_TSC_URL = AppConfig.api.baseUrl + '/PYG_Others_TSC'
const Fetch_VR_List_URL = AppConfig.api.baseUrl + '/fetch_vr_list'
const DVC_Others_TSC_URL = AppConfig.api.baseUrl + '/DVC_Others_TSC'
const TSC_Others_TSC_URL = AppConfig.api.baseUrl + '/TSC_Others_TSC'
const OTHERS_TRIP_SHEET_NUMBER_FETCH_URL = AppConfig.api.baseUrl + '/get-others-ts-no'
const CHECK_VEHICLE_NUMBER_AVAILABILITY_FETCH_URL = AppConfig.api.baseUrl + '/check-others-trip-veh-no'
const PARKING_YRD_URL_UPDATE = AppConfig.api.baseUrl + '/parking_update_request'
const PARKING_YARD_GET_ID = AppConfig.api.baseUrl + '/show_report_data/'

const PYG_VEHICLES_LIST_URL = AppConfig.api.baseUrl + '/pyg_Vehicles_ot/'
const PYG_DISTINCT_VEHICLES_FETCH_URL = AppConfig.api.baseUrl + '/parkingYardGate_VOT_Index/'

const PYG_PREVIOUS_TRIP_INFO_FETCH_URL = AppConfig.api.baseUrl + '/get-previous-trip-km'

class ParkingYardGateService {

  getVehiclebyType(id) {
    return api.get(VEHILCE_BY_TYPE_URLS + id)
  }

  getVehicleInfoById(id) {
    return api.get(VEHILCE_INFO_BY_VID_URLS + id)
  }

  getDrivers() {
    return api.get(AVAIABLE_DRIVERS_LIST_URL)
  }

  getAllDrivers() {
    return api.get(DRIVERS_LIST_URL)
  }

  getDriverInfoById(id) {
    return api.get(DRIVERS_LIST_URL + id)
  }

  getParkingYardGateTrucks() {
    return api.get(PARKING_YRD_URL)
  }

  getParkingYardGateInfoById(id) {
    return api.get(PARKING_YRD_URL + '/' + id)
  }

  handleParkingYardGateAction(data) {
    return api.post(PARKING_YRD_URL, data)
  }

  actionWaitingOutsideToGateIn(vehicleRowId) {
    return api.put(PARKING_YRD_GATE_IN_ACTION_URL + vehicleRowId)
  }

  actionGateOut(vehicleRowId) {
    return api.put(PARKING_YRD_GATE_OUT_ACTION_URL + vehicleRowId)
  }
/*Parking yard gate Report */
   getParkingYardGateVehiclesReport() {
    return api.get(GATE_IN_REPORT)
    }
   sentGateInDataForReport(data) {
    return api.post(GATEIN_REPORT_SENT_URL, data)
    }

    updateParkingYard(id,data) {
      return api.post(PARKING_YRD_URL_UPDATE + '/' + id, data)
    }

    getParkingInfoById(id) {
      return api.get(PARKING_YARD_GET_ID + id)
    }

    CreateOtherTripsheetPYG(data) {
      return api.post(PYG_Others_TSC_URL, data)
    }

    CreateOtherTripsheetDVC(data) {
      return api.post(DVC_Others_TSC_URL, data)
    }

    CreateOtherTripsheetTSC(data) {
      return api.post(TSC_Others_TSC_URL, data)
    }

    getOthersTripSheetNo(data) {
      return api.post(OTHERS_TRIP_SHEET_NUMBER_FETCH_URL, data)
    }

    checkTripAvailability(veh_no) {
      return api.post(CHECK_VEHICLE_NUMBER_AVAILABILITY_FETCH_URL + '/' + veh_no)
    }

    fetchVRList(data) {
      return api.post(Fetch_VR_List_URL, data)
    }

    getPYGDisticstVehiclesData() {
      return api.get(PYG_DISTINCT_VEHICLES_FETCH_URL)
    }

    getOpenTripsheetInfoByVId(id) {
      return api.get(PYG_VEHICLES_LIST_URL + id)
    }

    getPreviousTripInfo(data) {
      return api.post(PYG_PREVIOUS_TRIP_INFO_FETCH_URL, data)
    }

}

export default new ParkingYardGateService()
