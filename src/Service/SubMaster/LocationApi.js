import AppConfig from "src/AppConfig";
import api from "../Config";

const LOCATION_URL = AppConfig.api.baseUrl+ '/location' //Development

class LocationApi {
  getLocation() {
    return api.get(LOCATION_URL)
  }

  createLocation(value) {
    return api.post(LOCATION_URL, value)
  }

  getLocationById(LocationId) {
    return api.get(LOCATION_URL + '/' + LocationId)
  }

  updateLocation(Location, LocationId) {
    return api.put(LOCATION_URL + '/' + LocationId, Location)
  }

  deleteLocation(LocationId) {
    return api.delete(LOCATION_URL + '/' + LocationId)
  }
}

export default new LocationApi()
