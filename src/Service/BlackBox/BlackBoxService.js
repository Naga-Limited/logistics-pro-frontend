import AppConfig from 'src/AppConfig'
import api from '../Config'

const VEHICLE_OVER_SPEED_INFO_VIEW_URL = AppConfig.api.baseUrl + '/BB/Vehicle/OverSpeedInfo'
const VEHICLE_OVER_SPEED_INFO_SENT_URL = AppConfig.api.baseUrl + '/BB/Vehicle/OverSpeedInfoRequest'
const VEHICLE_OVER_SPEED_INFO_BY_ID_VIEW_URL = AppConfig.api.baseUrl + '/BB/Vehicle/OverSpeedInfoById'

const VEHICLE_HARSH_BRAKING_INFO_VIEW_URL = AppConfig.api.baseUrl + '/BB/Vehicle/HarshBrakingInfo'
const VEHICLE_HARSH_BRAKING_INFO_SENT_URL = AppConfig.api.baseUrl + '/BB/Vehicle/HarshBrakingInfoRequest'
const VEHICLE_HARSH_BRAKING_INFO_BY_ID_VIEW_URL = AppConfig.api.baseUrl + '/BB/Vehicle/HarshBrakingInfoById'

const VEHICLE_HARSH_ACCELARATION_INFO_VIEW_URL = AppConfig.api.baseUrl + '/BB/Vehicle/HarshAccelarationInfo'
const VEHICLE_HARSH_ACCELARATION_INFO_SENT_URL = AppConfig.api.baseUrl + '/BB/Vehicle/HarshAccelarationInfoRequest'
const VEHICLE_HARSH_ACCELARATION_INFO_BY_ID_VIEW_URL = AppConfig.api.baseUrl + '/BB/Vehicle/HarshAccelarationInfoById'

const VEHICLE_RASH_TURN_INFO_VIEW_URL = AppConfig.api.baseUrl + '/BB/Vehicle/RashTurnInfo'
const VEHICLE_RASH_TURN_INFO_SENT_URL = AppConfig.api.baseUrl + '/BB/Vehicle/RashTurnInfoRequest'
const VEHICLE_RASH_TURN_INFO_BY_ID_VIEW_URL = AppConfig.api.baseUrl + '/BB/Vehicle/RashTurnInfoById'

const VEHICLE_FUEL_FILLING_INFO_VIEW_URL = AppConfig.api.baseUrl + '/BB/Vehicle/FuelFillingInfo'
const VEHICLE_FUEL_FILLING_INFO_SENT_URL = AppConfig.api.baseUrl + '/BB/Vehicle/FuelFillingInfoRequest'
const VEHICLE_FUEL_FILLING_INFO_BY_ID_VIEW_URL = AppConfig.api.baseUrl + '/BB/Vehicle/FuelFillingInfoById'

const VEHICLE_FUEL_THEFT_INFO_VIEW_URL = AppConfig.api.baseUrl + '/BB/Vehicle/FuelTheftInfo'
const VEHICLE_FUEL_THEFT_INFO_SENT_URL = AppConfig.api.baseUrl + '/BB/Vehicle/FuelTheftInfoRequest'
const VEHICLE_FUEL_THEFT_INFO_BY_ID_VIEW_URL = AppConfig.api.baseUrl + '/BB/Vehicle/FuelTheftInfoById'

class BlackBoxService {

    /* Get Over Speed data From DB */
    getVehilceOverSpeedInfo() {
        return api.get(VEHICLE_OVER_SPEED_INFO_VIEW_URL)
    }

    /* Get Over Speed data DB for Report */
    sentVehilceOverSpeedInfo(data) {
        return api.post(VEHICLE_OVER_SPEED_INFO_SENT_URL, data)
    }

    /* Get Over Speed data By ID From DB */
    getVOSInfoById(ID) {
        return api.get(VEHICLE_OVER_SPEED_INFO_BY_ID_VIEW_URL + '/' + ID)
    }

    /* ------------------------------------------------------------------------------------*/

    /* Get Harsh Braking data From DB */
    getVehilceHarshBrakingInfo() {
        return api.get(VEHICLE_HARSH_BRAKING_INFO_VIEW_URL)
    }

    /* Get Harsh Braking data DB for Report */
    sentVehilceHarshBrakingInfo(data) {
        return api.post(VEHICLE_HARSH_BRAKING_INFO_SENT_URL, data)
    }

    /* Get Harsh Braking data By ID From DB */
    getVHBInfoById(ID) {
        return api.get(VEHICLE_HARSH_BRAKING_INFO_BY_ID_VIEW_URL + '/' + ID)
    }

    /* ------------------------------------------------------------------------------------*/

    /* Get Harsh Accelaration data From DB */
    getVehilceHarshAccelarationInfo() {
        return api.get(VEHICLE_HARSH_ACCELARATION_INFO_VIEW_URL)
    }

    /* Get Harsh Accelaration data DB for Report */
    sentVehilceHarshAccelarationInfo(data) {
        return api.post(VEHICLE_HARSH_ACCELARATION_INFO_SENT_URL, data)
    }

    /* Get Harsh Accelaration data By ID From DB */
    getVHAInfoById(ID) {
        return api.get(VEHICLE_HARSH_ACCELARATION_INFO_BY_ID_VIEW_URL + '/' + ID)
    }

    /* ------------------------------------------------------------------------------------*/

    /* Get Rash Turn data From DB */
    getVehilceRashTurnInfo() {
        return api.get(VEHICLE_RASH_TURN_INFO_VIEW_URL)
    }

    /* Get Rash Turn data DB for Report */
    sentVehilceRashTurnInfo(data) {
        return api.post(VEHICLE_RASH_TURN_INFO_SENT_URL, data)
    }

    /* Get Rash Turn data By ID From DB */
    getVRTInfoById(ID) {
        return api.get(VEHICLE_RASH_TURN_INFO_BY_ID_VIEW_URL + '/' + ID)
    }

    /* ------------------------------------------------------------------------------------*/

    /* Get Fuel Filling data From DB */
    getVehilceFuelFillingInfo() {
        return api.get(VEHICLE_FUEL_FILLING_INFO_VIEW_URL)
    }

    /* Get Fuel Filling data DB for Report */
    sentVehilceFuelFillingInfo(data) {
        return api.post(VEHICLE_FUEL_FILLING_INFO_SENT_URL, data)
    }

    /* Get Fuel Filling data By ID From DB */
    getVFFInfoById(ID) {
        return api.get(VEHICLE_FUEL_FILLING_INFO_BY_ID_VIEW_URL + '/' + ID)
    }

    /* ------------------------------------------------------------------------------------*/

     /* Get Fuel Theft data From DB */
     getVehilceFuelTheftInfo() {
        return api.get(VEHICLE_FUEL_THEFT_INFO_VIEW_URL)
    }

    /* Get Fuel Theft data DB for Report */
    sentVehilceFuelTheftInfo(data) {
        return api.post(VEHICLE_FUEL_THEFT_INFO_SENT_URL, data)
    }

    /* Get Fuel Theft data By ID From DB */
    getVFTInfoById(ID) {
        return api.get(VEHICLE_FUEL_THEFT_INFO_BY_ID_VIEW_URL + '/' + ID)
    }

    /* ------------------------------------------------------------------------------------*/
}

export default new BlackBoxService()