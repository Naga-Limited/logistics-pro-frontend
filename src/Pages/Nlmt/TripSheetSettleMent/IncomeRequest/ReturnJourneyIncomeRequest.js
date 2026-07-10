export default function ReturnJourneyIncomeRequest(data, trip_data) {
  let sapRJIData = new FormData()
  console.log(data, 'ReturnJourneyIncomeRequest')

  // sapFIData.append('TRIPSHEET_NO', trip_data.trip_sheet_info.trip_sheet_no)
  // sapFIData.append('VEHICLE_NO', trip_data.vehicle_number)
  // sapFIData.append('DIVISION', 'FOODS')

  sapRJIData.append('vbeln', tripsettlementData.tripsheet_no)
  sapRJIData.append('kunnr', tripInfo.vehicle_number)
  sapRJIData.append('netwr', tripInfo.vehicle_number)
  sapRJIData.append('TRIPSHEET_NO', tripsettlementData.halting_charges)
  sapRJIData.append('VEHICLE_NO', tripsettlementData.halting_charges)

  sapRJIData.append('HALTING_CHARG', tripsettlementData.toll_amount)
  sapRJIData.append('SUBDELIVERY_CHARG', tripsettlementData.toll_amount)
  sapRJIData.append('UNLOADING_CHARG', tripsettlementData.bata)
  sapRJIData.append('WEIGHMENT_CHARG', tripsettlementData.municipal_charges)
  sapRJIData.append('LOW_TONAGE_CHARG', tripsettlementData.registered_diesel_amount)
  sapRJIData.append('OTHER_FREIGHT', tripsettlementData.enroute_diesel_amount)

  return sapRJIData
}
