export default function RJSaleOrderCreationValidation(values, isTouched) {
  const errors = {}
  // console.log(values)
  //Material Type Validation Rule
  if (isTouched.materialType && values.materialType === '0') {
    errors.materialType = 'Required'
  }

  //UOM Type Validation Rule
  if (isTouched.uomType && values.uomType === '0') {
    errors.uomType = 'Required'
  }

  //Vehicle Number Validation Rule
  if (isTouched.vehicleNumber && values.vehicleNumber === '0') {
    errors.vehicleNumber = 'Required'
  }

  //Customer Name Validation Rule
  if (isTouched.customerName && values.customerName === '0') {
    errors.customerName = 'Required'
  }

  //Payment Term Validation Rule
  if (isTouched.PaymentTerm && values.PaymentTerm === '0') {
    errors.PaymentTerm = 'Required'
    errors.customerCode = 'Required'
  }
  // else if (isTouched.PaymentTerm && values.PaymentTerm === '1') {
  //   if (values.customerCode == '') {
  //     errors.customerCode = 'Shed Name Required'
  //   }
  // } else if (isTouched.PaymentTerm && values.PaymentTerm === '2') {
  //   if (values.customerCode == '') {
  //     errors.customerCode = 'Customer Name Required'
  //   }
  // }

  //Shed Name Validation Rule
  if (isTouched.shed_name && values.shed_name === '0') {
    errors.shed_name = 'Required'
  }

  // Advance Payment Mode Validation Rule
  if (isTouched.advancePaymentMode && values.advancePaymentMode === '0') {
    errors.advancePaymentMode = 'Required'
  }

  // Balance Payment Mode Validation Rule
  if (isTouched.balancePaymentMode && values.balancePaymentMode === '0') {
    errors.balancePaymentMode = 'Required'
  }

  //HSN Code Validation Rule
  if (isTouched.hsnCode && !values.hsnCode) {
    errors.hsnCode = 'Required'
  } else if (isTouched.hsnCode && !/^[\d]{8}$/.test(values.hsnCode)) {
    errors.hsnCode = 'Only have 8 Digit Numeric'
  }

  //Customer Code Validation Rule
  // if (isTouched.customerCode && !values.customerCode) {
  //   errors.customerCode = 'Required'
  // }
  // else
  // if (isTouched.customerCode && !/^[\d]{5}$/.test(values.customerCode)) {
  //   errors.customerCode = '1'
  // }

  //Order Quantity Validation Rule
  if (isTouched.orderQuantity && !values.orderQuantity) {
    errors.orderQuantity = 'Required'
  } else if (isTouched.orderQuantity && !/^[1-9]\d*(\.\d+)?$/.test(values.orderQuantity)) {
    errors.orderQuantity = 'Only have Numeric Value'
  }

  //Empty Load KM Validation Rule
  if (isTouched.emptyLoad && !values.emptyLoad) {
    errors.emptyLoad = 'Required'
  } else if (isTouched.emptyLoad && !values.emptyLoad.match(/^[0-9]{0,3}$/)) {
    errors.emptyLoad = 'Only have Numeric Value'
  }

  //Empty Load KM After Unload Validation Rule
  if (isTouched.emptyUnload && !values.emptyUnload) {
    errors.emptyUnload = 'Required'
  } else if (isTouched.emptyUnload && !values.emptyUnload.match(/^[0-9]{0,3}$/)) {
    errors.emptyUnload = 'Only have Numeric Value'
  }

  //Freight Income Validation Rule
  if (isTouched.freight_income && !values.freight_income) {
    errors.freight_income = 'Required'
  } else if (isTouched.freight_income && !values.freight_income.match(/^[0-9]{0,5}$/)) {
    errors.freight_income = 'Only have Numeric Value'
  }

  //Advance Amount Validation Rule
  if (isTouched.advance_amount && !values.advance_amount) {
    errors.advance_amount = 'Required'
  } else if (isTouched.advance_amount && !values.advance_amount.match(/^[0-9]{0,5}$/)) {
    errors.advance_amount = 'Only have Numeric Value'
  }

  //Material Description Validation Rule
  if (isTouched.materialDescription && !values.materialDescription) {
    errors.materialDescription = 'Required'
  } else if (
    isTouched.materialDescription &&
    !/^[^*|\":<>[\]{}`\\()';@&$#+!]+$/.test(values.materialDescription)
  ) {
    errors.materialDescription = 'Special Characters Not Allowed'
  }

  //Customer Name Validation Rule
  // if (isTouched.customerName && !values.customerName) {
  //   errors.customerName = 'Required'
  // } else if (isTouched.customerName && !/^[a-zA-Z ]+$/.test(values.customerName)) {
  //   errors.customerName = 'Only have Letters and space'
  // }

  //Customer Mobile Number Validation Rule
  // if (isTouched.customerMobile && !values.customerMobile) {
  //   errors.customerMobile = 'Required'
  // } else if (isTouched.customerMobile && !/^[\d]{10}$/.test(values.customerMobile)) {
  //   errors.customerMobile = 'Only have 10 Digit Numeric'
  // }

  //Customer PAN Number Validation Rule
  // if (isTouched.customerPAN && !values.customerPAN) {
  //   errors.customerPAN = 'Required'
  // } else if (isTouched.customerPAN && !/^[A-Z]{5}[\d]{4}[A-Z]{1}$/.test(values.customerPAN)) {
  //   errors.customerPAN = 'Must Have 10 Digit Alphanumeric (Ex.ABCDE1234F)'
  // }

  //Unloading Point Validation Rule
  if (isTouched.unloadPoint && !values.unloadPoint) {
    errors.unloadPoint = 'Required'
  } else if (isTouched.unloadPoint && !/^[a-zA-Z ]+$/.test(values.unloadPoint)) {
    errors.unloadPoint = 'Only have Letters and space'
  }

  //Loading Point Validation Rule
  if (isTouched.loadPoint && !values.loadPoint) {
    errors.loadPoint = 'Required'
  } else if (isTouched.loadPoint && !/^[a-zA-Z ]+$/.test(values.loadPoint)) {
    errors.loadPoint = 'Only have Letters and space'
  }

  //Last Delivery Point Validation Rule
  if (isTouched.lastDeliveryPoint && !values.lastDeliveryPoint) {
    errors.lastDeliveryPoint = 'Required'
  } else if (isTouched.lastDeliveryPoint && !/^[a-zA-Z ]+$/.test(values.lastDeliveryPoint)) {
    errors.lastDeliveryPoint = 'Only have Letters and space'
  }

  //Expected Delivery Time Validation Rule
  if (isTouched.deliveryTime && !values.deliveryTime) {
    errors.deliveryTime = 'Required'
  }

  //Expected Return Time Validation Rule
  if (isTouched.returnTime && !values.returnTime) {
    errors.returnTime = 'Required'
  }

  // customerCode: '',
  // customerName: '',
  // customerMobile: '',

  // console.log(errors)
  return errors
}
