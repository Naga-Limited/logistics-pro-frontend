export default function FreightCalculation(data, freight_type, income_type) {
  console.log(data, 'data')
  console.log(freight_type, 'freight_type')
  console.log(income_type, 'income_type')

  if (income_type == 'FI' || income_type == 'CI') {
    /* Base Freight Calculation */
    if (freight_type == 'BASE_FREIGHT') {
      let base_freight = 0
      data.map((val, key) => {
        if (val.shipment_freight_amount) {
          base_freight += Number(parseFloat(val.shipment_freight_amount).toFixed(2))
        } else {
          base_freight += Number(parseFloat(val.freight_amount).toFixed(2))
        }
      })
      console.log(base_freight, 'base_freight')
      return base_freight
    }

    /* Halt Income Calculation */
    if (freight_type == 'HALTING_CHARG') {
      let halting_charge = 0
      data.map((val, key) => {
        halting_charge += Number(parseFloat(val.income_halting_charges).toFixed(2))
      })
      console.log(halting_charge, 'halting_charge')
      return halting_charge
    }

    /* Sub-Delivery Income Calculation */
    if (freight_type == 'SUBDELIVERY_CHARG') {
      let sub_delivery_charge = 0
      data.map((val, key) => {
        sub_delivery_charge += Number(parseFloat(val.income_sub_delivery_charges).toFixed(2))
      })
      console.log(sub_delivery_charge, 'sub_delivery_charge')
      return sub_delivery_charge
    }

    /* Unloading Income Calculation */
    if (freight_type == 'UNLOADING_CHARG') {
      let unloading_charge = 0
      data.map((val, key) => {
        unloading_charge += Number(parseFloat(val.income_unloading_charges).toFixed(2))
      })
      console.log(unloading_charge, 'unloading_charge')
      return unloading_charge
    }

    /* Weighment Income Calculation */
    if (freight_type == 'WEIGHMENT_CHARG') {
      let weighment_charge = 0
      data.map((val, key) => {
        weighment_charge += Number(parseFloat(val.income_weighment_chares).toFixed(2))
      })
      console.log(weighment_charge, 'weighment_charge')
      return weighment_charge
    }

    /* Low Tonnage Income Calculation */
    if (freight_type == 'LOW_TONAGE_CHARG') {
      let low_tonage_charge = 0
      data.map((val, key) => {
        low_tonage_charge += Number(parseFloat(val.income_low_tonage_charges).toFixed(2))
      })
      console.log(low_tonage_charge, 'low_tonage_charge')
      return low_tonage_charge
    }

    /* Other Income Calculation */
    if (freight_type == 'OTHER_FREIGHT') {
      let other_freight = 0
      data.map((val, key) => {
        other_freight += Number(parseFloat(val.income_others_charges).toFixed(2))
      })
      console.log(other_freight, 'other_freight')
      return other_freight
    }
  } else {
    //RJ Income Type
  }
}
