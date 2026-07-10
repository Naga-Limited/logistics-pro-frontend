export default function ExpenseCalculations(data, property) {
  // console.log(data)

  const needed_value = (child_data) => {
    // console.log(child_data)
    let data_keys = Object.keys(child_data)
    let data_values = Object.values(child_data)
    var needed_data_key = ''

    // console.log(data_keys, 'data_keys')
    // console.log(data_values, 'data_values')
    data_keys.map((dat, ind) => {
      // console.log(dat, 'dat')
      // console.log(property, 'property')
      if (dat === property) {
        needed_data_key = ind
        // console.log('yes')
      } else {
        // console.log('no')
      }
    })
    // console.log(needed_data_key, 'needed_data_key')
    // console.log(data_values[needed_data_key], 'data_values[needed_data_key]')
    return Number(data_values[needed_data_key])
  }

  let property_value = 0
  data.map((parent_data, parent_index) => {
    // console.log(parent_data)
    if (parent_data.shipmentInfo && parent_data.shipmentInfo.length > 0) {
      let parent_fgsales_value = parent_data.shipmentInfo
      parent_fgsales_value.map((child_data, child_index) => {
        // console.log(needed_value(child_data))
        property_value += Number(needed_value(child_data))
      })
    }

    if (parent_data.rjsoInfo && parent_data.rjsoInfo.length > 0) {
      let parent_rjso_value = parent_data.rjsoInfo
      parent_rjso_value.map((child_data, child_index) => {
        // console.log(needed_value(child_data))
        property_value += Number(needed_value(child_data))
      })
    }

    if (parent_data.stoTableData && parent_data.stoTableData.length > 0) {
      let parent_fgsto_value = parent_data.stoTableData
      parent_fgsto_value.map((child_data, child_index) => {
        // console.log(needed_value(child_data))
        property_value += Number(needed_value(child_data))
      })
    }

    if (parent_data.stoTableDataRMSTO && parent_data.stoTableDataRMSTO.length > 0) {
      let parent_rmsto_value = parent_data.stoTableDataRMSTO
      parent_rmsto_value.map((child_data, child_index) => {
        // console.log(needed_value(child_data))
        property_value += Number(needed_value(child_data))
      })
    }
  })

  // console.log(property_value)
  return Number(property_value)
}

// toll_amount,bata, diversion_return_charges,halt_days,loading_charges,low_tonage_charges, maintenance_cost, misc_charges,municipal_charges,port_entry_fee,sub_delivery_charges,tarpaulin_charges,unloading_charges,weighment_charges
