import FreightCalculation from '../FreightCalculation/FreightCalculation'

export default function FoodsDivisionIncomeRequest(data, trip_data) {
  let sapFIData = new FormData()
  console.log(data, 'FoodsDivisionIncomeRequest')
  console.log(trip_data, 'trip_data')

  const totalFreightCalculation = () => {
    let total_freight = 0
    let freight1 = FreightCalculation(data, 'BASE_FREIGHT', 'FI')
    let freight2 = FreightCalculation(data, 'HALTING_CHARG', 'FI')
    let freight3 = FreightCalculation(data, 'SUBDELIVERY_CHARG', 'FI')
    let freight4 = FreightCalculation(data, 'UNLOADING_CHARG', 'FI')
    let freight5 = FreightCalculation(data, 'WEIGHMENT_CHARG', 'FI')
    let freight6 = FreightCalculation(data, 'LOW_TONAGE_CHARG', 'FI')
    let freight7 = FreightCalculation(data, 'OTHER_FREIGHT', 'FI')

    total_freight = freight1 + freight2 + freight3 + freight4 + freight5 + freight6 + freight7

    console.log(total_freight, 'total_freight')

    return total_freight
  }

  sapFIData.append('TRIPSHEET_NO', trip_data.trip_sheet_info.trip_sheet_no)
  sapFIData.append('VEHICLE_NO', trip_data.vehicle_number)
  sapFIData.append('DIVISION', 'FOODS')

  sapFIData.append('BASE_FREIGHT', FreightCalculation(data, 'BASE_FREIGHT', 'FI'))
  sapFIData.append('HALTING_CHARG', FreightCalculation(data, 'HALTING_CHARG', 'FI'))
  sapFIData.append('SUBDELIVERY_CHARG', FreightCalculation(data, 'SUBDELIVERY_CHARG', 'FI'))
  sapFIData.append('UNLOADING_CHARG', FreightCalculation(data, 'UNLOADING_CHARG', 'FI'))
  sapFIData.append('WEIGHMENT_CHARG', FreightCalculation(data, 'WEIGHMENT_CHARG', 'FI'))
  sapFIData.append('LOW_TONAGE_CHARG', FreightCalculation(data, 'LOW_TONAGE_CHARG', 'FI'))
  sapFIData.append('OTHER_FREIGHT', FreightCalculation(data, 'OTHER_FREIGHT', 'FI'))

  sapFIData.append('TOT_FRE_INC', totalFreightCalculation())

  if (trip_data.vehicle_type_id.id == '3') {
    sapFIData.append('HIRE_FRE_VEN_BALANCE', tripsettlementData.misc_charges)
  }

  return sapFIData
}
