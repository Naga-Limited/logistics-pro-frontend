export default function ConsumerDivisionIncomeRequest(data, trip_data) {
  let sapCIData = new FormData()
  console.log(data, 'ConsumerDivisionIncomeRequest')

  sapCIData.append('TRIPSHEET_NO', trip_data.trip_sheet_info.trip_sheet_no)
  sapCIData.append('VEHICLE_NO', trip_data.vehicle_number)
  sapCIData.append('DIVISION', 'CONSUMER')

  sapCIData.append('BASE_FREIGHT', tripsettlementData.halting_charges)
  sapCIData.append('HALTING_CHARG', tripsettlementData.halting_charges)
  sapCIData.append('SUBDELIVERY_CHARG', tripsettlementData.toll_amount)
  sapCIData.append('UNLOADING_CHARG', tripsettlementData.bata)
  sapCIData.append('WEIGHMENT_CHARG', tripsettlementData.municipal_charges)
  sapCIData.append('LOW_TONAGE_CHARG', tripsettlementData.registered_diesel_amount)
  sapCIData.append('OTHER_FREIGHT', tripsettlementData.enroute_diesel_amount)

  sapCIData.append('TOT_FRE_INC', tripsettlementData.port_entry_fee)

  sapCIData.append('HIRE_FRE_VEN_BALANCE', tripsettlementData.misc_charges)

  return sapCIData
}
