



import AppConfig from "src/AppConfig";
import api from "../Config";

const MAINTENANCE_REPORT_URL = AppConfig.api.baseUrl+ '/maintenance_report'
const RMSTO_REPORT_URL = AppConfig.api.baseUrl+ '/rmsto_report'
const ADVANCE_REPORT_URL = AppConfig.api.baseUrl+ '/advance_register'
const ADVANCE_REPORT_EXPORT = AppConfig.api.baseUrl+ '/advance_export'
const DIESEL_REPORT_URL = AppConfig.api.baseUrl+ '/diesel_intent_register'
const DIESEL_VEHICLE_REPORT_URL = AppConfig.api.baseUrl+ '/vehicle_data_capture_diesel'
const DIESEL_TRIPSHEET_REPORT_URL = AppConfig.api.baseUrl+ '/tripsheet_data_capture_diesel'
const DIESEL_STATUS_REPORT_URL = AppConfig.api.baseUrl+ '/diesel_status_data_capture_diesel'
const SINGLE_DIESEL_LIST = AppConfig.api.baseUrl+ '/diesel_intent_register'

const ADVANCE_TRIPSHEET_REPORT_URL = AppConfig.api.baseUrl+ '/tripsheet_data_capture_advance'
const ADVANCE_VEHICLE_REPORT_URL = AppConfig.api.baseUrl+ '/vehicle_data_capture_advance'
const TRIPSHEET_REPORT_URL = AppConfig.api.baseUrl+ '/tripsheet_register'
const TRIPSHEET_ACCOUNTS_REPORT_URL = AppConfig.api.baseUrl+ '/tripsheet_accounts_register'
const SINGLE_TRIP_SHEET_LIST = AppConfig.api.baseUrl+ '/tripsheet_register'
const TRIPSHEET_VEHICLE_REPORT_URL = AppConfig.api.baseUrl+ '/vehicle_data_capture_tripsheet'
const INSPECTION_REPORT_URL = AppConfig.api.baseUrl+ '/Inspection_report'
const INSPECTION_VEHICLE_REPORT_URL = AppConfig.api.baseUrl+ '/vehicle_data_capture_inspection'
const INSPECTION_PREVIOUS_REPORT_URL = AppConfig.api.baseUrl+ '/previous_load_details_data'
const MAINTENANCE_BY_REPORT_URL = AppConfig.api.baseUrl+ '/maintenance_by_data'
const MAINTENANCE_VEHICLE_REPORT_URL = AppConfig.api.baseUrl+ '/maintenance_vehicle_data'
const RJ_SALES_ORDER_REPORT = AppConfig.api.baseUrl+ '/RJ_SO_report'
const RJ_SALES_VEHICLE_REPORT_URL = AppConfig.api.baseUrl+ '/vehicle_data_rj_so_creation'
const RJ_CUSTOMER_REPORT = AppConfig.api.baseUrl+ '/RJ_customer_report'
const RJ_CREATION_TYPE_URL = AppConfig.api.baseUrl+ '/customer_creation_type'
const RJ_CUSTOMER_STATUS_URL = AppConfig.api.baseUrl+ '/customer_creation_status'
const DOCUMENT_VERIFY_REPORT = AppConfig.api.baseUrl+ '/Document_verifigation_report'
const DOCUMENT_VERIFY_REPORT_WITH_IMAGE = AppConfig.api.baseUrl+ '/Document_Report'
const VEHICLE_DOCUMENT_DATA = AppConfig.api.baseUrl+ '/vehicle_data_get_document'
const VENDOR_CREATION_REPORT = AppConfig.api.baseUrl+ '/vendor_report'
const VENDOR_CREATION_STATUS = AppConfig.api.baseUrl+ '/vehicle_data_get_document'
const RJ_SO_OS_RECEIVABLE_VECHILE_URL = AppConfig.api.baseUrl+ '/rj_so_os_rec_vehicleno'
const RJ_SO_OS_RECEIVABLE_SHED_NAME_URL = AppConfig.api.baseUrl+ '/rj_so_os_rec_shed_name'
const STO_REPORT_VIEW_URL = AppConfig.api.baseUrl + '/sto_report'
const STO_REPORT_SENT_URL = AppConfig.api.baseUrl + '/STOReportRequest'
const FI_REPORT_VIEW_URL = AppConfig.api.baseUrl + '/fi_report'
const FI_REPORT_SENT_URL = AppConfig.api.baseUrl + '/FIReportRequest'
const FM_REPORT_VIEW_URL = AppConfig.api.baseUrl + '/freight_report'
const FM_REPORT_SENT_URL = AppConfig.api.baseUrl + '/freightReportRequest'

class ReportService {

   getmaintenancereport()
   {
    return api.get(MAINTENANCE_REPORT_URL)
   }
   getrmstoreport()
   {
    return api.get(RMSTO_REPORT_URL)
   }
   Advancereport(data)
   {
    return api.post(ADVANCE_REPORT_URL,data)
   }
   AdvanceExport(data)
   {
    return api.post(ADVANCE_REPORT_EXPORT,data)
   }
   DieselReport(data)
   {
    return api.post(DIESEL_REPORT_URL,data)
   }
   getdiesel_vehicle_no()
   {
    return api.get(DIESEL_VEHICLE_REPORT_URL)
   }
   getdiesel_tripsheet_no()
   {
    return api.get(DIESEL_TRIPSHEET_REPORT_URL)
   }
   singleDieselDetailsList(id) {
      return api.get(SINGLE_DIESEL_LIST+ '/'+id)
    }
   getdiesel_status()
   {
    return api.get(DIESEL_STATUS_REPORT_URL)
   }
   getadvance_vehicle_no()
   {
    return api.get(ADVANCE_VEHICLE_REPORT_URL)
   }
   getadvance_tripsheet_no()
   {
    return api.get(ADVANCE_TRIPSHEET_REPORT_URL)
   }
   TripsheetReport(data)
   {
    return api.post(TRIPSHEET_REPORT_URL,data)
   }
   TripsheetAccountsReport(data)
   {
    return api.post(TRIPSHEET_ACCOUNTS_REPORT_URL,data)
   }

   singleTripDetailsList(id) {
    return api.get(SINGLE_TRIP_SHEET_LIST+ '/'+id)
  }

   gettripsheet_vehicle_no()
   {
    return api.get(TRIPSHEET_VEHICLE_REPORT_URL)
   }
   VehicleInspectionReport(data)
   {
    return api.post(INSPECTION_REPORT_URL,data)
   }
   getinspection_vehicle_no()
   {
    return api.get(INSPECTION_VEHICLE_REPORT_URL)
   }
   getinspection_previous_load()
   {
    return api.get(INSPECTION_PREVIOUS_REPORT_URL)
   }
   VehicleMaintenanceReport(data)
   {
    return api.post(MAINTENANCE_REPORT_URL,data)
   }
   getmaintenace_vehice_no()
   {
    return api.get(MAINTENANCE_VEHICLE_REPORT_URL)
   }
   getmaintenace_by()
   {
    return api.get(MAINTENANCE_BY_REPORT_URL)
   }
   RJSalesOrderReport(data)
   {
    return api.post(RJ_SALES_ORDER_REPORT,data)
   }
   getrj_vehice_no()
   {
    return api.get(RJ_SALES_VEHICLE_REPORT_URL)
   }
   RJCustomerReport(data)
   {
    return api.post(RJ_CUSTOMER_REPORT,data)
   }
   getrj_type()
   {
    return api.get(RJ_CREATION_TYPE_URL)
   }
   getrj_customer_status()
   {
    return api.get(RJ_CUSTOMER_STATUS_URL)
   }
   Document_Verify(data)
   {
    return api.post(DOCUMENT_VERIFY_REPORT,data)
   }
   Document_Verify_Report(data)
   {
    return api.post(DOCUMENT_VERIFY_REPORT_WITH_IMAGE,data)
   }
   getdocument_vehicle_data()
   {
    return api.get(VEHICLE_DOCUMENT_DATA)
   }
   Vendor_Report(data)
   {
    return api.post(VENDOR_CREATION_REPORT,data)
   }
   getvendor_status()
   {
    return api.get(VENDOR_CREATION_STATUS)
   }
   getRjSoOsReceivableVehicleNo()
   {
    return api.get(RJ_SO_OS_RECEIVABLE_VECHILE_URL)
   }
   getRjSoOsReceivableShedName()
   {
    return api.get(RJ_SO_OS_RECEIVABLE_SHED_NAME_URL)
   }

    getSTODataForReport() {
    return api.get(STO_REPORT_VIEW_URL)
    }

    sentSTODataForReport(data) {
      return api.post(STO_REPORT_SENT_URL, data)
    }

    getFIDataForReport() {
      return api.get(FI_REPORT_VIEW_URL)
    }
  
    sentFIDataForReport(data) {
        return api.post(FI_REPORT_SENT_URL, data)
    }
     getFreightDataForReport() {
      return api.get(FM_REPORT_VIEW_URL)
    }
    sentFreightDataForReport(data) {
      return api.post(FM_REPORT_SENT_URL, data)
    }
}

export default new  ReportService()
