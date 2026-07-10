import { useEffect } from "react"

export const freightValueFinder = (a,b) => {
  let c = 0
  c = Number(parseFloat(a).toFixed(2)) * Number(parseFloat(b).toFixed(2))
  return Number(parseFloat(c).toFixed(2))
}

export const largestFreightFinder = (drawDeleteInsertTableData,type,drawoldTableData) => {
  var largest= 0;
  console.log(drawDeleteInsertTableData,'largestFreightFinder-drawDeleteTableData')
  for (let i=0; i<drawDeleteInsertTableData.length; i++){
    let org_freight = Number(parseFloat(drawDeleteInsertTableData[i].delivery_depo_freight_amount).toFixed(2))
      if (org_freight > largest) {
          largest = org_freight;
      }
  }
  return largest
}

export const largestFreightFinder1 = (drawDeleteInsertTableData) => {
  var largest1= 0;
  console.log(drawDeleteInsertTableData,'largestFreightFinder-drawDeleteTableData')
  for (let i=0; i<drawDeleteInsertTableData.length; i++){
    let org_freight1 = Number(parseFloat(drawDeleteInsertTableData[i].deliveryFreight).toFixed(2))
      if (org_freight1 > largest1) {
          largest1 = org_freight1;
      }
  }
  return largest1
}

export const totalQtyFinder = (all_data) => {
  var qty= 0.00;

  for (let i=0; i<all_data.length; i++){
    // let org_qty = Number(parseFloat(all_data[i].deliveryQty).toFixed(2))
    let org_qty = Number(parseFloat(all_data[i].deliveryNetQty).toFixed(2))
    qty += org_qty;
  }
  return Number(parseFloat(qty).toFixed(2))
}

export const actualFreightValue_FindCalculation = (all_data) => {
  var frit1= 0.00;
  for (let i=0; i<all_data.length; i++){
    frit1 += Number(parseFloat(all_data[i].actualFreight).toFixed(2))
  }
  return Number(parseFloat(frit1).toFixed(2))
}

export const budjetFreightValue_FindCalculation = (all_data) => {
  var frit2= 0.00;
  for (let i=0; i<all_data.length; i++){
    frit2 += Number(parseFloat(all_data[i].budgetFreight).toFixed(2))
  }
  return Number(parseFloat(frit2).toFixed(2))
}

// export const budjetFreightValue_FindCalculation = () => {
//   var frit= 0;
//   console.log(drawDeleteTableData,'largestFreightFinder-drawDeleteTableData')
//   for (let i=0; i<drawDeleteTableData.length; i++){
//     let org_frit = Number(parseFloat(drawDeleteTableData[i].delivery_qty).toFixed(2)) * Number(parseFloat(drawDeleteTableData[i].delivery_depo_freight_amount).toFixed(2))
//     frit += org_frit;
//   }
//   return Number(parseFloat(frit).toFixed(2))
// }

export const cont_loc_cust_freight_finder = (customerData,FreightData,contractorId,locationCode,customerCode) => {
  let freight = 0

  customerData.map((data2, index1) => {
    if (customerCode == data2.customer_code) {
      FreightData.map((data3, index2) => {
        if (data2.location_id == data3.location_id && data2.route_id == data3.route_id && contractorId == data3.contractor_id) {
          freight = data3.freight_rate
        }
      })
    }
  })

  console.log(freight,'freight-freight')

  return freight
}

