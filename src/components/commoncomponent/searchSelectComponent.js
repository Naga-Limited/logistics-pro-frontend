import React, { useEffect, useState } from 'react'
import Select from 'react-select'
import DefinitionsListApi from 'src/Service/Definitions/DefinitionsListApi'
import DepoContractorMasterService from 'src/Service/Depo/Master/DepoContractorMasterService'
import DepoRouteMasterService from 'src/Service/Depo/Master/DepoRouteMasterService'
import FIEntryService from 'src/Service/FIEntry/FIEntryService'
import UserLoginMasterService from 'src/Service/Master/UserLoginMasterService'
import LocationApi from 'src/Service/SubMaster/LocationApi'
import TripSheetClosureService from 'src/Service/TripSheetClosure/TripSheetClosureService'
import VehicleAssignmentService from 'src/Service/VehicleAssignment/VehicleAssignmentService'
// I Foods Start
import IfoodsVendorMasterService from 'src/Service/Ifoods/Master/IfoodsVendorMasterService'
import IfoodsOutletMasterService from 'src/Service/Ifoods/Master/IfoodsOutletMasterService'
import IfoodsStofreightMasterService from 'src/Service/Ifoods/Master/IfoodsStofreightMasterService'
import IfoodsRouteMasterService from 'src/Service/Ifoods/Master/IfoodsRouteMasterService'
// I Foods End
const SearchSelectComponent = ({
  size,
  id,
  className,
  onChange,
  label,
  noOptionsMessage,
  search_type,
  search_data = [],
  division_type = '',
 isMultiple
}) => {
  const option = [{ value: '', label: 'Select' }]

  const [srVehicle, setSRVehicle] = useState([])
  const [srcVehicle, setSRCVehicle] = useState([])
  const [userList, setUserList] = useState([])
  const [materialTypeList, setMaterialTypeList] = useState([])
  const [contractorData, setContractorData] = useState([])
  const [routeData, setCRouteData] = useState([])
  const [locationData, setLocationData] = useState([])
    /*========================== I Foods Part Start ========================== */
  const [vendorData, setVendorData] = useState([])
  const [find_outlet, setfind_outlet] = useState([])
  const [OutletData, setOutletData] = useState([])
  const [stofreight, setstoFreight] = useState([])
  const [route, setRoute] = useState([])
   /*========================== I Foods Part End ========================== */

  /*========================== Varialbes For Shipment Report Part Start ========================== */

  const shipmentStatusName = (code) => {
    if (code == 1) {
      return 'Created'
    } else if (code == 2) {
      return 'Updated BY User'
    }
    if (code == 3) {
      return 'Updated BY SAP'
    }
    if (code == 4) {
      return 'Deleted'
    }
    if (code == 5) {
      return 'Completed'
    } else {
      return ''
    }
  }
  const STOStatus = (id) => {
    if (id == 1) {
      return 'FG STO'
    } else if (id == 2) {
      return 'RM STO'
    } else if (id == 3) {
      return 'OTHERS'
    } else if (id == 4) {
      return 'FCI'
    } else {
      return ''
    }
  }

  const FIType = (id) => {
    if (id == 1) {
      return 'Income'
    } else if (id == 2) {
      return 'Expense'
    } else if (id == 3) {
      return 'Payment'
    } else {
      return 'Receipt'
    }
  }

  const closureStatus = (id) => {
    if (id == 1) {
      return 'Expense Completed'
    } else if (id == 2) {
      return 'Income Rejected'
    } else if (id == 3) {
      return 'Income Completed'
    } else if (id == 5) {
      return 'Settlement Partially Completed'
    } else {
      return 'Settlement Completed'
    }
  }
  const TS_Capture_Status = (id) => {
    if (id == 0) {
      return 'Not Captured'
    } else if (id == 1) {
      return 'Captured'
    }
  }

  const Rake_Closure_Status = (id) => {
    let rakeClosureStatusArray = [
      '',
      'Exp. WM Sub. ✔️',
      'Exp. WM Verified ✔️',
      'Exp. WM Rejected ❌',
      'Inc. Posted ✔️',
      'Inc. Rejected ❌',
      'Exp. Verified ✔️',
      'Exp. Posted ✔️',
      'Exp. Rejected ❌',
      'Cancelled ❌'
    ]
    return rakeClosureStatusArray[id]
  }

  const Depo_Payment_Status = (id) => {
    let paymentStatusArray = [
      'Submission ✔️',
      'Validation ❌',
      'Validation ✔️',
      'Completed ✔️',
      'Deleted'
    ]
    return paymentStatusArray[id-1]
  }

  const RakeFI_Array = ['','Expense Credit','Expense Debit','Income Credit','Income Debit']
  /*========================== I Foods Part Start ========================== */
  const Ifoods_Payment_Status = (id) => {
    let paymentStatusArray = [
      'Submission ✔️',
      'SCM Validation Rejected ❌',
      'SCM Validation Approved ✔️',
      'AM Validation Rejected, ❌',
      ' AM Validation Approved ✔️',
      ' Completed ✔️',
      ' Deleted ✔️',
    ]
    return paymentStatusArray[id - 1]
  }
  /*========================== I Foods Part End ========================== */

  const [srVehicleData, setSrVehicleData] = useState([])
  const [srShipmentData, setSrShipmentData] = useState([])
  const [srTripsheetData, setSrTripsheetData] = useState([])
  const [srStatusData, setSrStatusData] = useState([])
  const [TripsheetNo, setTripsheetNo] = useState([])
  const [CurrentPos, setCurrentPos] = useState([])

  /*========================== Varialbes For Shipment Report Part End ========================== */

  useEffect(() => {
    /* section for getting Shipment Routes For Shipment Creation - Foods from database-Logan */
    DefinitionsListApi.visibleDefinitionsListByDefinition(1).then((response) => {
      console.log(response.data.data, 'shipment_route_search')
      setSRVehicle(response.data.data)
    })
    /* section for getting Shipment Routes For Shipment Creation - Consumer from database-Logan */
    DefinitionsListApi.visibleDefinitionsListByDefinition(17).then((response) => {
      console.log(response.data.data, 'shipment_route_search')
      setSRCVehicle(response.data.data)
    })

    /* section for getting User Lists from database For Access Setting */
    UserLoginMasterService.getUser().then((response) => {
      console.log(response.data.data, 'user_search')
      setUserList(response.data.data)
    })

    /* section for getting Material Type Lists from database For Material Type Grouping */
    DefinitionsListApi.visibleDefinitionsListByDefinition(15).then((response) => {
      console.log(response.data.data, 'material_type_search')
      setMaterialTypeList(response.data.data)
    })

    /* section for getting Shipment Data from database For Shipment Report */
    VehicleAssignmentService.getShipmentDataForReport().then((response) => {
      console.log(response.data.data, 'shipment_report_search')
      setSrShipmentData(response.data.data)
    })

    //section for getting Contractor Data from database
    DepoContractorMasterService.getActiveDepoContractors().then((response) => {
      console.log(response.data.data, 'Contractor_name_search')
      setContractorData(response.data.data)
    })
// Ifoods Start
    IfoodsVendorMasterService.getActiveIfoodsVendors().then((response) => {
      //  console.log(response.data.data, 'Contractor_name_search')
      setVendorData(response.data.data)
    })

    IfoodsOutletMasterService.getActiveIfoodsOutlet().then((response) => {
      //  console.log(response.data.data, 'Contractor_name_search')
      setOutletData(response.data.data)
    })
    IfoodsStofreightMasterService.getActiveIfoodsStofreight().then((response) => {
     // console.log(response.data.data, 'STO Freight')
      setstoFreight(response.data.data)
    })
    IfoodsRouteMasterService.getActiveIfoodsRoutes().then((response) => {
   //   console.log(response.data.data, 'Route Freight')
      setRoute(response.data.data)
    })
// Ifoods End
    //section for getting Depo Route Data from database
    DepoRouteMasterService.getDepoRoutes().then((response) => {
      //console.log(response.data.data, 'Depo_Route__search')
      setCRouteData(response.data.data)
    })

    //section for getting Location Data from database
    LocationApi.getLocation().then((res) => {
      setLocationData(res.data.data)
    })

  }, [])

  if (search_type == 'shipment_routes') {
    if (division_type == 2 ){
      srcVehicle.map(({ definition_list_code, definition_list_name }) => {
        option.push({ value: definition_list_code, label: definition_list_name+' - '+definition_list_code })
      })
    } else {
      srVehicle.map(({ definition_list_code, definition_list_name }) => {
        option.push({ value: definition_list_code, label: definition_list_name+' - '+definition_list_code })
      })
    }
  } else if ( search_type == 'user_lists') {
    userList.map(({ user_id, emp_name ,empid}) => {
      option.push({ value: user_id, label: emp_name+' - '+empid })
    })
  } else if (search_type == 'depo_vehicle_report_vehicle_number') {
    let depo_vehicle_array = []
    search_data.map(({ vehicle_id, vehicle_info }) => {
      if (depo_vehicle_array.indexOf(vehicle_id) === -1) {
        depo_vehicle_array.push(vehicle_id)
        option.push({ value: vehicle_id, label: vehicle_info.vehicle_number })
      }
    })
  } else if (search_type == 'depo_contractors') {
    search_data.map(({ id, contractor_name }) => {
      option.push({ value: id, label: contractor_name })
    })
    // contractorData.map(({ id, contractor_name }) => {
    //   option.push({ value: id, label: contractor_name })
    // })
  }

  //  I Foods Start

  else if (search_type == 'ifoods_Outletss') {
    let sp_array = []
    search_data.map(({ outlet_code, index }) => {
      if (sp_array.indexOf(outlet_code) === -1) {
        sp_array.push(outlet_code)
        option.push({ value: outlet_code, label: outlet_name+ ' - ' + outlet_code})
      }
    })
  }
  else if (search_type == 'ifoods_Vendors') {
    vendorData.map(({ id, vendor_name }) => {
      option.push({ value: id, label: vendor_name })
    })
  } else if (search_type == 'ifoods_Outlets') {
    OutletData.map(({ id, outlet_name, outlet_code }) => {
      option.push({ value: outlet_code, label: outlet_name + ' - ' + outlet_code })
    })
  } 
  
  else if (search_type == 'ifoods_sto') {
    stofreight.map(({ id, from_location_info, to_location_info, location,vehicle_capacity_info,capacity,ifoods_Vendor_info,vendor_name }) => {
      option.push({
        value: id,
        label: from_location_info.location + ' To ' + to_location_info.location+'  -  '+vehicle_capacity_info.capacity+' Feet'+'  -  '+ifoods_Vendor_info.vendor_name,
      })
    })
  } else if (search_type == 'ifoods_route') {
    route.map(({ id, route_name, budgeted_km }) => {
      option.push({ value: id, label: route_name + ' - ' + budgeted_km + 'KM' })
    })
  }
   else if (search_type == 'find_outlet') {
      find_outlet.map(({ outlet_name, outlet_code }) => {
        option.push({ value: outlet_code, label: outlet_name + ' - ' + outlet_code })
      })
    } 
    else if (search_type == 'ifoods_payment_report_payment_status') {
      let dprps_array = []
      // console.log(search_data,'depo_payment_report_payment_status-search_data')
      search_data.map(({ status, index }) => {
        if (dprps_array.indexOf(status) === -1) {
          dprps_array.push(status)
          option.push({ value: status, label: Ifoods_Payment_Status(status) })
        }
      })
    } 
    else if (search_type == 'ifoods_payment_submission_vendor') {
      let dpsl__array = []
  
      search_data.map(({ payment_vendor_info, index }) => {
        if (dpsl__array.indexOf(payment_vendor_info.id) === -1) {
          dpsl__array.push(payment_vendor_info.id)
          option.push({ value: payment_vendor_info.id, label: payment_vendor_info.vendor_name })
        }
      })
    }
  
  else if (search_type == 'ifoods_payment_submission_contractor') {
      let dpsl__array = []
  
      search_data.map(({ ifoods_Vendor_info, index }) => {
        if (dpsl__array.indexOf(ifoods_Vendor_info.id) === -1) {
          dpsl__array.push(ifoods_Vendor_info.id)
          option.push({ value: ifoods_Vendor_info.id, label: ifoods_Vendor_info.vendor_name })
        }
      })
    }
     else if (search_type == 'ifoods_payment_submission_vehicle_number') {
      let dpsl__array = []
  
      search_data.map(({ vehicle_id, ifoods_Vehicle_info }) => {
        if (dpsl__array.indexOf(vehicle_id) === -1) {
          dpsl__array.push(vehicle_id)
          option.push({ value: vehicle_id, label: ifoods_Vehicle_info.vehicle_number })
        }
      })
    } 
    else if (search_type == 'ifoods_purpose') {
      let dpsl__array = []
  
      search_data.map(({ purpose, index }) => {
        if (dpsl__array.indexOf(purpose) === -1) {
          dpsl__array.push(purpose)
          option.push({ value: purpose, 
            label: purpose == '1' ? 'FG-Sales' : 'FG-STO',
          })
        }
      })
    }

  //  I Foods End
  else if (search_type == 'depos_location') {
    let depo_location_array = []
    search_data.map(({ location_id, location_info }) => {
      if (depo_location_array.indexOf(location_id) === -1) {
        depo_location_array.push(location_id)
        option.push({ value: location_id, label: location_info.location })
      }
    })
  }

  else if (search_type == 'depos_route') {
    let depo_route_array = []
    search_data.map(({ route_id, route_info }) => {
      if (depo_route_array.indexOf(route_id) === -1) {
        depo_route_array.push(route_id)
        option.push({ value: route_id, label: route_info.route_name })
      }
    })
  }




  else if (search_type == 'depo_routes') {
    locationData.map(({ id, location }) => {
      option.push({ value: id, label: location })
    })
  } else if (search_type == 'material_types') {
    materialTypeList.map(({ definition_list_code, definition_list_name }) => {
      option.push({ value: definition_list_code, label: definition_list_name })
    })

    /* ====================== Shipment Report Filter Component Part Start ====================== */
  } else if (search_type == 'shipment_report_vehicle_number') {
    let sp_vehicle_array = []
    search_data.map(({ vehicle_id, vehicle_number }) => {
      if (sp_vehicle_array.indexOf(vehicle_id) === -1) {
        sp_vehicle_array.push(vehicle_id)
        option.push({ value: vehicle_id, label: vehicle_number })
      }
    })
  } else if (search_type == 'shipment_report_shipment_number') {
    search_data.map(({ shipment_id, shipment_no }) => {
      option.push({ value: shipment_id, label: shipment_no })
    })
  } else if (search_type == 'shipment_report_tripsheet_number') {
    let sp_ts_array = []
    search_data.map(({ tripsheet_id, trip_sheet_info }) => {
      if (sp_ts_array.indexOf(tripsheet_id) === -1) {
        sp_ts_array.push(tripsheet_id)
        option.push({ value: tripsheet_id, label: trip_sheet_info.trip_sheet_no })
      }
    })
  } else if (search_type == 'shipment_report_shipment_status') {
    let sp_array = []
    search_data.map(({ shipment_status, index }) => {
      if (sp_array.indexOf(shipment_status) === -1) {
        sp_array.push(shipment_status)
        option.push({ value: shipment_status, label: shipmentStatusName(shipment_status) })
      }
    })
  } else if (search_type == 'payment_report_shipment_status') {
    let sp_array = []
    search_data.map(({ status, index }) => {
      if (sp_array.indexOf(status) === -1) {
        sp_array.push(status)
        option.push({ value: status, label: status == '1' ? "Deduction Completed" : "Payment Completed" })
      }
    })
    /* ====================== Shipment Report Filter Component Part End ====================== */
    /* ====================== Depo Shipment Report Filter Component Part Start ====================== */
  } else if (search_type == 'depo_shipment_report_vehicle_number') {
    let depo_sp_vehicle_array = []
    search_data.map(({ trip_vehicle_info }) => {
      if (depo_sp_vehicle_array.indexOf(trip_vehicle_info.id) === -1) {
        depo_sp_vehicle_array.push(trip_vehicle_info.id)
        option.push({ value: trip_vehicle_info.id, label: trip_vehicle_info.vehicle_number })
      }
    })
  } else if (search_type == 'depo_shipment_report_tripsheet_number') {
    let sp_ts_array = []
    search_data.map(({ tripsheet_id, trip_sheet_info }) => {
      if (sp_ts_array.indexOf(tripsheet_id) === -1) {
        sp_ts_array.push(tripsheet_id)
        option.push({ value: tripsheet_id, label: trip_sheet_info.depo_tripsheet_no })
      }
    })
  } else if (search_type == 'depo_shipment_report_shipment_status') {
    let sp_array = []
    search_data.map(({ status, index }) => {
      if (sp_array.indexOf(status) === -1) {
        sp_array.push(status)
        option.push({ value: status, label: shipmentStatusName(status) })
      }
    })


    /* ====================== Depo Shipment Report Filter Component Part End ====================== */
    /* ====================== Closure Report Filter Component Part Start ====================== */
  } else if (search_type == 'closure_report_vehicle_number') {
    let cl_vehicle_array = []
    search_data.map(({ vehicle_id, vehicle_number }) => {
      if (cl_vehicle_array.indexOf(vehicle_id) === -1) {
        cl_vehicle_array.push(vehicle_id)
        option.push({ value: vehicle_id, label: vehicle_number })
      }
    })
  } else if (search_type == 'closure_report_tripsheet_number') {
    let cl_ts_array = []
    search_data.map(({ tripsheet_sheet_id, trip_sheet_info }) => {
      if (cl_ts_array.indexOf(tripsheet_sheet_id) === -1) {
        cl_ts_array.push(tripsheet_sheet_id)
        option.push({ value: tripsheet_sheet_id, label: trip_sheet_info.trip_sheet_no })
      }
    })
  } else if (search_type == 'closure_report_status') {
    let cl_array = []
    search_data.map(({ trip_settlement_info, index }) => {
      if (cl_array.indexOf(trip_settlement_info.tripsheet_is_settled) === -1) {
        cl_array.push(trip_settlement_info.tripsheet_is_settled)
        option.push({ value: trip_settlement_info.tripsheet_is_settled, label: closureStatus(trip_settlement_info.tripsheet_is_settled) })
      }
    })
    /* ====================== Closure Report Filter Component Part End ====================== */
    /* ====================== Settlement Report Filter Component Part Start ====================== */
  } else if (search_type == 'settlement_report_vehicle_number') {
    let tst_vehicle_array = []
    search_data.map(({ vehicle_id, vehicle_number }) => {
      if (tst_vehicle_array.indexOf(vehicle_id) === -1) {
        tst_vehicle_array.push(vehicle_id)
        option.push({ value: vehicle_id, label: vehicle_number })
      }
    })
  } else if (search_type == 'settlement_report_tripsheet_number') {
    let st_ts_array = []
    search_data.map(({ tripsheet_sheet_id, trip_sheet_info }) => {
      if (st_ts_array.indexOf(tripsheet_sheet_id) === -1) {
        st_ts_array.push(tripsheet_sheet_id)
        option.push({ value: tripsheet_sheet_id, label: trip_sheet_info.trip_sheet_no })
      }
    })
  } else if (search_type == 'settlement_report_vehicle_type') {
    let st_array = []
    search_data.map(({ vehicle_type_id}) => {
      if (st_array.indexOf(vehicle_type_id.id) === -1) {
        st_array.push(vehicle_type_id.id)
        option.push({ value: vehicle_type_id.id, label: vehicle_type_id.type })
      }
    })
    /* ====================== Settlement Report Filter Component Part End ====================== */
    /*========================(*R)Return Journey Search Select Component Start =======================*/
  } else if (search_type == 'return_journey_vehicle_number') {

    let rj_vehicle_array = []
    console.log(search_data, 'return_journey_vehicle_number')
    search_data.map(({ vehicle_id, vehicle_number }) => {
      if (rj_vehicle_array.indexOf(vehicle_id) === -1) {
        rj_vehicle_array.push(vehicle_id)
        option.push({ value: vehicle_id, label: vehicle_number })
      }
    })
  } else if (search_type == 'sto_report_vehicle_number') {
    let sp_vehicle_array = []
    search_data.map(({ vehicle_id, parking_yard_info }) => {
      if (sp_vehicle_array.indexOf(vehicle_id) === -1) {
        sp_vehicle_array.push(vehicle_id)
        option.push({ value: vehicle_id, label: parking_yard_info.vehicle_number })
      }
    })
  } else if (search_type == 'sto_report_tripsheet_number') {
    let sp_ts_array = []
    search_data.map(({ tripsheet_id, trip_sheet_info }) => {
      if (sp_ts_array.indexOf(tripsheet_id) === -1) {
        sp_ts_array.push(tripsheet_id)
        option.push({ value: tripsheet_id, label: trip_sheet_info.trip_sheet_no })
      }
    })
  } else if (search_type == 'sto_type') {
    let sp_array = []
    search_data.map(({ sto_delivery_type, index }) => {
      if (sp_array.indexOf(sto_delivery_type) === -1) {
        sp_array.push(sto_delivery_type)
        option.push({ value: sto_delivery_type, label: STOStatus(sto_delivery_type) })
      }
    })
  } else if (search_type == 'to_location') {
    let sp_array = []
    search_data.map(({ to_location, index }) => {
      if (sp_array.indexOf(to_location) === -1) {
        sp_array.push(to_location)
        option.push({ value: to_location, label: to_location })
      }
    })
  }  else if (search_type == 'from_location') {
    let sp_array = []
    search_data.map(({ from_location, index }) => {
      if (sp_array.indexOf(from_location) === -1) {
        sp_array.push(from_location)
        option.push({ value: from_location, label: from_location})
      }
    })
  } else if (search_type == 'fi_type') {
  /* ====================== STO Report Filter Component Part End ====================== */

  /* ====================== FI Report Filter Component Part Start ====================== */
    let sp_array = []
    search_data.map(({ fi_entry_type, index }) => {
      if (sp_array.indexOf(fi_entry_type) === -1) {
        sp_array.push(fi_entry_type)
        option.push({ value: fi_entry_type, label: FIType(fi_entry_type) })
      }
    })
  /* ====================== Parking Report Filter Component Part Start ====================== */
}
else if (search_type == 'fi_status') {

  let sp_array = []
  search_data.map(({ fi_status, index }) => {
    if (sp_array.indexOf(fi_status) === -1) {
      sp_array.push(fi_status)
      option.push({ value: fi_status, label: fi_status == '1' ? 'Created' : 'Rejected'})
    }
  })
}
   else if (search_type == 'gate_in_report_vehicle_number') {
    let sp_vehicle_array = []
    search_data.map(({ vehicle_id, vehicle_number }) => {
      if (sp_vehicle_array.indexOf(vehicle_id) === -1) {
        sp_vehicle_array.push(vehicle_id)
        option.push({ value: vehicle_id, label: vehicle_number })
      }
    })
  }
  /* ====================== Parking Report Filter Component Part End ====================== */
  else if (search_type == 'depo_va_vehicle_number') {
    let depo_va_vehicle_array = []
    console.log(search_data, 'depo_va_vehicle_number')

    search_data.map(
      ({
        vehicle_info,
        parking_status,
        vehicle_tripsheet_info,
        vehicle_current_position,
      }) => {
        if (vehicle_tripsheet_info && vehicle_current_position == 16 && parking_status == 1 ){
          if (depo_va_vehicle_array.indexOf(vehicle_info.vehicle_number) === -1) {
            depo_va_vehicle_array.push(vehicle_info.vehicle_number)
            option.push({ value: vehicle_tripsheet_info.depo_tripsheet_no, label: vehicle_info.vehicle_number })
          }

        }
      }
    )
    // console.log(depo_va_vehicle_array, 'depo_va_vehicle_array')
  }
  else if (search_type == 'nlfd_va_vehicle_number') {
    let nlfd_va_vehicle_array = []
    console.log(search_data, 'nlfd_va_vehicle_number')

    search_data.map(
      ({
        vehicle_number,
        parking_status,
        trip_sheet_info,
        vehicle_type_id,
        vehicle_current_position,
      }) => {
        if ( (trip_sheet_info && trip_sheet_info.to_divison == division_type ||
            (vehicle_current_position == 16 && parking_status == 8) ||
            (vehicle_current_position == 16 && parking_status == 20) ||
            (vehicle_current_position == 16 && parking_status == 22) ||
            (vehicle_current_position == 50 && parking_status == 18) ||
            (vehicle_current_position == 18 && parking_status == 16) ||
            (vehicle_current_position == 18 && parking_status == 12) ||
            (vehicle_current_position == 16 && parking_status == 16) ||
            (vehicle_current_position == 16 && parking_status == 12) ||
            vehicle_current_position == 22 ||
            vehicle_current_position == 25 ||
            vehicle_current_position == 35) &&
             ((trip_sheet_info.to_divison == 2 && (parking_status == 11 || parking_status ==13 )) ||
                        (trip_sheet_info.to_divison == 1 && (parking_status == 1 || parking_status == 2 || parking_status == 6 || parking_status == 15 || parking_status == 17) && trip_sheet_info.purpose == '1') ||
                        trip_sheet_info.purpose == '3' ||
                        trip_sheet_info.purpose == '4' ||
                        trip_sheet_info.purpose == '5' ||
                        vehicle_type_id.id == 4 || 
                        (trip_sheet_info.purpose == '2' && trip_sheet_info.advance_status == '1' && parking_status != '1')))
                     {


          if (nlfd_va_vehicle_array.indexOf(vehicle_number) === -1) {
            nlfd_va_vehicle_array.push(vehicle_number)
            option.push({ value: trip_sheet_info.trip_sheet_no, label: vehicle_number })
          }

        }
      }
    )

  }
    /* ====================== Vehicle Maintenance Work Order Component Part Start ====================== */
  else if (search_type == 'work_order') {
    let sp_work_order_array = []
    search_data.map(({ EBELN }) => {
      if (sp_work_order_array.indexOf(EBELN) === -1) {
        sp_work_order_array.push(EBELN)
        option.push({ value: EBELN, label: EBELN })
      }
    })
  }
    /* ====================== Vehicle Maintenance Work Order Component Part End ====================== */
    /* ====================== Fastag Report Filter Component Part Start ====================== */

  else if (search_type == 'fast_tag_report_vehicle_number') {
    let sp_vehicle_array = []
    search_data.map(({ vehicle_id, vechile_number }) => {
      if (sp_vehicle_array.indexOf(vechile_number) === -1) {
        sp_vehicle_array.push(vechile_number)
        option.push({ value: vechile_number, label: vechile_number })
      }
    })
  }

  else if (search_type == 'fast_tag_report_tripsheet_no') {
    let sp_vehicle_array = []
    search_data.map(({ vehicle_id, tripsheet_no }) => {
      if (sp_vehicle_array.indexOf(tripsheet_no) === -1) {
        sp_vehicle_array.push(tripsheet_no)
        option.push({ value: tripsheet_no, label: tripsheet_no })
      }
    })
  }
  else if (search_type == 'fast_tag_report_captured_status') {
    let sp_vehicle_array = []
    search_data.map(({ vehicle_id, ts_captured_status }) => {
      if (sp_vehicle_array.indexOf(ts_captured_status) === -1) {
        sp_vehicle_array.push(ts_captured_status)
        option.push({ value: ts_captured_status, label: TS_Capture_Status(ts_captured_status) })
      }
    })
  }
   /* ====================== Fastag Report Filter Component Part End ====================== */
   /* ================== Payment Submission Filter Part Start ========================== */
   else if (search_type == 'depo_payment_submission_location') {
    let dpsl__array = []
    console.log(search_data,'depo_payment_submission_location-search_data')
    search_data.map(({ vehicle_location_info, index }) => {
      if (dpsl__array.indexOf(vehicle_location_info.id) === -1) {
        dpsl__array.push(vehicle_location_info.id)
        option.push({ value: vehicle_location_info.id, label: vehicle_location_info.location })
      }
    })
   } else if (search_type == 'depo_payment_submission_contractor') {
    let dpsl__array = []
    console.log(search_data,'depo_payment_submission_contractor-search_data')
    search_data.map(({ contractor_info, index }) => {
      if (dpsl__array.indexOf(contractor_info.id) === -1) {
        dpsl__array.push(contractor_info.id)
        option.push({ value: contractor_info.id, label: contractor_info.contractor_name })
      }
    })
   } else if (search_type == 'depo_payment_submission_vehicle_number') {
    let dpsl__array = []
    console.log(search_data,'depo_payment_submission_location-search_data')
    search_data.map(({ vehicle_id, vehicle_info }) => {
      if (dpsl__array.indexOf(vehicle_id) === -1) {
        dpsl__array.push(vehicle_id)
        option.push({ value: vehicle_id, label: vehicle_info.vehicle_number })
      }
    })
   }
   /* ================== Payment Submission Filter Part End ========================== */
   /* ================== Payment Report Filter Part Start ========================== */
   else if (search_type == 'depo_payment_report_contractor_name') {
    let dprcn_array = []
    console.log(search_data,'depo_payment_report_contractor_name-search_data')
    search_data.map(({ payment_contractor_info, index }) => {
      if (dprcn_array.indexOf(payment_contractor_info.id) === -1) {
        dprcn_array.push(payment_contractor_info.id)
        option.push({ value: payment_contractor_info.id, label: payment_contractor_info.contractor_name })
      }
    })
   } else if (search_type == 'depo_payment_report_payment_status') {
    let dprps_array = []
    console.log(search_data,'depo_payment_report_payment_status-search_data')
    search_data.map(({ status, index }) => {
      if (dprps_array.indexOf(status) === -1) {
        dprps_array.push(status)
        option.push({ value: status, label: Depo_Payment_Status(status) })
      }
    })
   }

   /* ================== Payment Report Filter Part End ========================== */
   /* ================== Trip Hire Payment Filter Part Start ========================== */
   else if (search_type == 'trip_hire_payment') {
    let thps_array = []
    // console.log(search_data,'trip_hire_payment-search_data')
    search_data.map(({ status, index }) => {
      if (thps_array.indexOf(status) === -1) {
        thps_array.push(status)
        option.push({ value: status, label: Depo_Payment_Status(status) })
      }
    })
   /* ================== Trip Hire Payment Filter Part End ========================== */

  /* ================== Rake Payment Report Filter Part Start ========================== */
  } else if (search_type == 'rake_report_rps_number') {
    let rake_ts_status_array = []
    search_data.map(({ expense_sequence_no, index }) => {
      if (rake_ts_status_array.indexOf(expense_sequence_no) === -1) {
        rake_ts_status_array.push(expense_sequence_no)
        option.push({ value: expense_sequence_no, label: expense_sequence_no })
      }
    })
  } else if (search_type == 'rake_report_vendor') {
    let rake_ts_status_array = []
    search_data.map(({ rake_vendor_info, index }) => {
      if (rake_ts_status_array.indexOf(rake_vendor_info.v_name) === -1) {
        rake_ts_status_array.push(rake_vendor_info.v_code)
        option.push({ value: rake_vendor_info.v_code, label: rake_vendor_info.v_name })
      }
    })
  /* ================== Rake Payment Report Filter Part End ========================== */
  /* ================== Rake FI Entry Report Filter Part Start ========================== */
} else if (search_type == 'rake_fi_report_rps_number') {
  let rake_ts_status_array = []
  search_data.map(({ rps_no, index }) => {
    if (rake_ts_status_array.indexOf(rps_no) === -1) {
      rake_ts_status_array.push(rps_no)
      option.push({ value: rps_no, label: rps_no })
    }
  })
} else if (search_type == 'rake_fi_report_type') {
  let rake_ts_status_array = []
  search_data.map(({ fi_entry_mode, index }) => {
    if (rake_ts_status_array.indexOf(fi_entry_mode) === -1) {
      rake_ts_status_array.push(fi_entry_mode)
      option.push({ value: fi_entry_mode, label: RakeFI_Array[fi_entry_mode] })
    }
  })
/* ================== Rake FI Entry Report Filter Part End ========================== */
  /* ================== Rake Tripsheet Report Filter Part Start ========================== */
  } else if (search_type == 'rake_tripsheet_report_vehicle_number') {
    let rake_ts_vehicle_array = []
    search_data.map(({ vehicle_no, index }) => {
      if (rake_ts_vehicle_array.indexOf(vehicle_no) === -1) {
        rake_ts_vehicle_array.push(vehicle_no)
        option.push({ value: vehicle_no, label: vehicle_no })
      }
    })
  } else if (search_type == 'rake_tripsheet_migo_report_tripsheet_number') {
    let rake_ts_vehicle_array = []
    search_data.map(({ trip_info }) => {
      if (rake_ts_vehicle_array.indexOf(trip_info.rake_tripsheet_no) === -1) {
        rake_ts_vehicle_array.push(trip_info.rake_tripsheet_no)
        option.push({ value: trip_info.rake_tripsheet_no, label: trip_info.rake_tripsheet_no })
      }
    })
  } else if (search_type == 'rake_tripsheet_migo_report_vehicle_number') {
    let rake_ts_vehicle_array = []
    search_data.map(({ truck_no, index }) => {
      if (rake_ts_vehicle_array.indexOf(truck_no) === -1) {
        rake_ts_vehicle_array.push(truck_no)
        option.push({ value: truck_no, label: truck_no })
      }
    })
  } else if (search_type == 'rake_tripsheet_report_fnr_number') {
    let rake_ts_fnr_array = []
    search_data.map(({ fnr_no, index }) => {
      if (rake_ts_fnr_array.indexOf(fnr_no) === -1) {
        rake_ts_fnr_array.push(fnr_no)
        option.push({ value: fnr_no, label: fnr_no })
      }
    })
  } else if (search_type == 'rake_tripsheet_report_vendor_name') {
    let rake_ts_vendor_array = []
    search_data.map(({ tripsheet_creation_vendor_info, index }) => {
      if (rake_ts_vendor_array.indexOf(tripsheet_creation_vendor_info.v_id) === -1) {
        rake_ts_vendor_array.push(tripsheet_creation_vendor_info.v_id)
        option.push({ value: tripsheet_creation_vendor_info.v_id, label: `${tripsheet_creation_vendor_info.v_name} - (${tripsheet_creation_vendor_info.v_code})`})
      }
    })
  } else if (search_type == 'rake_tripsheet_migo_report_vendor_name') {
    let rake_ts_vendor_array = []
    search_data.map(({ trip_info, vendor_code }) => {
      if (rake_ts_vendor_array.indexOf(vendor_code) === -1) {
        rake_ts_vendor_array.push(vendor_code)
        option.push({ value: vendor_code, label: `${trip_info.v_name} - (${trip_info.v_code})`})
      }
    })
  } else if (search_type == 'rake_tripsheet_report_trip_status') {
    let rake_ts_status_array = []
    search_data.map(({ status, index }) => {
      if (rake_ts_status_array.indexOf(status) === -1) {
        rake_ts_status_array.push(status)
        option.push({ value: status, label: status == 1 ? 'Created' : 'Closed' })
      }
    })
  } else if (search_type == 'rake_expense_report_vendor_name') {
    let rake_ts_vendor_array = []
    search_data.map(({ rake_vendor_info, index }) => {
      if (rake_ts_vendor_array.indexOf(rake_vendor_info.v_id) === -1) {
        rake_ts_vendor_array.push(rake_vendor_info.v_id)
        option.push({ value: rake_vendor_info.v_id, label: `${rake_vendor_info.v_name} - (${rake_vendor_info.v_code})`})
      }
    })
  } else if (search_type == 'rake_expense_report_status') {
    let rake_ts_status_array = []
    search_data.map(({ status, index }) => {
      if (rake_ts_status_array.indexOf(status) === -1) {
        rake_ts_status_array.push(status)
        option.push({ value: status, label: Rake_Closure_Status(status) })
      }
    })
  } else if (search_type == 'rake_tripsheet_fnr_report_vendor_name') {
    let rake_fnr_report_vendor_array = []
    search_data.map(({ tripsheet_creation_vendor_info, index }) => {
      if (rake_fnr_report_vendor_array.indexOf(tripsheet_creation_vendor_info.v_code) === -1) {
        rake_fnr_report_vendor_array.push(tripsheet_creation_vendor_info.v_code)
        option.push({ value: tripsheet_creation_vendor_info.v_code, label: `${tripsheet_creation_vendor_info.v_name} - (${tripsheet_creation_vendor_info.v_code})`})
      }
    })
  /* ================== Rake Tripsheet Report Filter Part End ========================== */
  }

  return (
    <>
      <Select
        options={option}
        placeholder={label}
        noOptionsMessage={() => noOptionsMessage}
        size={size}
        className={className}
        onChange={(e) => onChange(e)}
        isMulti={isMultiple}
      />
    </>
  )
}

export default SearchSelectComponent
