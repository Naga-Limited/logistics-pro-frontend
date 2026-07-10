export const GetDateTimeFormat = ( type ) => {

  var now     = new Date();
  var year    = now.getFullYear();
  var month   = now.getMonth()+1;
  var day     = now.getDate();
  var hour    = now.getHours();
  var minute  = now.getMinutes();
  var second  = now.getSeconds();
  var dateTime = ''
  if(month.toString().length == 1) {
       month = '0'+month;
  }
  if(day.toString().length == 1) {
       day = '0'+day;
  }
  if(hour.toString().length == 1) {
       hour = '0'+hour;
  }
  if(minute.toString().length == 1) {
       minute = '0'+minute;
  }
  if(second.toString().length == 1) {
       second = '0'+second;
  }

  if(type == 1){ /*yyyymmddhhmm */
    // dateTime = year+month+day+hour+minute
    dateTime = `${year}${month}${day}${hour}${minute}`
  } else if(type == 2){ /*yyyymmddhhmmss */
    // dateTime = year+month+day+hour+minute+second
    dateTime = `${year}${month}${day}${hour}${minute}${second}`
  } else if(type == 'current'){ /*yyyymmddhhmmss */
    dateTime = `${day}-${month}-${year} ${hour}:${minute}:${second}`
  } else { /*yyyymmdd */
    // dateTime = year+month+day
    dateTime = `${year}${month}${day}`
  }

  return dateTime

}

export const getGstTax = (code) => {
  let gst_text = '-'
  if(code == 'R5') {
    gst_text = 'R5/Input Tax RCM (SGST,CGST @ 2.5% & 2.5%)'
  } else if(code == 'F7') {
    gst_text = 'F7/Input Tax (SGST,CGST @ 9% & 9%)'
  } else if(code == 'F6') {
    gst_text = 'F6/Input Tax (SGST,CGST @ 6% & 6%)'
  } else if(code == 'E0') {
    gst_text = 'No Tax'
  } else if(code == 'T0') {
    gst_text = 'T0/GST ITC Reversal Exp'
  } else if(code == 'F2') {
    gst_text = 'F2/Input Tax (IGST@12%)'
  } else if(code == 'Z2') {
    gst_text = 'Z2/FRT Outward RCM (CGST,SGST@2.5&2.5%)'
  } else if(code == 'Z3') {
    gst_text = 'Z3/FRT Outward RCM (IGST@5%)'
  }
  return gst_text
}

export const getFreightAdjustment = (data1,data2) => {

  let total_freight = 0
  let shipment_freight = 0
  if(data2.total_expenses){
    total_freight = data2.total_expenses
  }

  if(data1.freight_type){
    shipment_freight = data1.freight_type == '2' ? data1.shipment_depo_actual_freight_amount : data1.shipment_depo_budget_freight_amount
  }

  let adjustment = Number(total_freight) - Number(shipment_freight)

  return adjustment

}

export const imageUrlNameFinder = (link) => {
  console.log(link,'imageUrlNameFinder')
  if(link.name){
    return link.name
  }
  let img_url_split_count  =  link.lastIndexOf("/")
  let img_file_name = link.substring(img_url_split_count+1);
  return img_file_name
}

export const imageUrlValidation = (link,type = '') => {

  console.log(link,'linnk')
  if(link){
    console.log(Object.keys(link).length,'linnk-length')
  }

  if(link && typeof link.name == 'string'){
    return true
  }

  if(link && Object.keys(link).length != 0){
    console.log(link,'linnk1')

    let img_url_split_count  =  link.lastIndexOf("/")
    let img_file_name = link.substring(img_url_split_count+1);

    console.log(img_file_name,'url-linnk1')
    if(type == 'url'){
      return img_file_name
    }

    if(img_file_name){
      console.log('img_file_name having')
      return true
    } else {
      console.log('img_file_name not having')
      return false
    }
  } else {
    console.log(link,'linnk2')
    return false
  }


}
