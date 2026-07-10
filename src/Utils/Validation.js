export default function validate(values, isTouched) {
  const errors = {}

  //================================ Transaction Pages Validations ===================================

  // Parking Yard Gate In
  if (!values.vType && isTouched.vType) {
    errors.vType = 'Required'
  }

  if (!values.vNum && isTouched.vNum) {
    errors.vNum = 'Required'
  }
  // else if (!(values.vNum.length == 10)) {
  //   errors.vNum = 'Min 10 Digits'
  // } else {
  //   errors.vNum = ''
  // }

  if (!values.dName && isTouched.dName) {
    errors.dName = 'Required'
  }

  if (!values.dNum && isTouched.dNum) {
    errors.dNum = 'Required'
  }
  // else if (values.dNum > 10) {
  //   errors.vNum = 'Min 10 Digits'
  // }

  if (isTouched.vBody && !values.vBody) {
    errors.vBody = 'Required'
  }
  if (isTouched.vCap && !values.vCap) {
    errors.vCap = 'Required'
  }
  if (isTouched.odoKm && !values.odoKm) {
    errors.odoKm = 'Required'
  }

  if (isTouched.pName && !values.pName) {
    errors.pName = 'Required'
  }

  // Vehicle Inspection
  if (isTouched.truckClean && !values.truckClean) {
    errors.truckClean = 'Required'
  }
  if (isTouched.badSmell && !values.badSmell) {
    errors.badSmell = 'Required'
  }
  if (isTouched.insectVevils && !values.insectVevils) {
    errors.insectVevils = 'Required'
  }
  if (isTouched.tarSRF && !values.tarSRF) {
    errors.tarSRF = 'Required'
  }
  if (isTouched.tarNon && !values.tarNon) {
    errors.tarNon = 'Required'
  }
  if (isTouched.tarInsectVevils && !values.tarInsectVevils) {
    errors.tarInsectVevils = 'Required'
  }
  if (isTouched.trkPlat && !values.trkPlat) {
    errors.trkPlat = 'Required'
  }
  if (isTouched.prevLoad && !values.prevLoad) {
    errors.prevLoad = 'Required'
  }
  if (isTouched.vFitLoad && !values.vFitLoad) {
    errors.vFitLoad = 'Required'
  }

  // Vehicle Maintainence
  if (isTouched.maintenenceType && !values.maintenenceType) {
    errors.maintenenceType = 'Required'
  }
  if (isTouched.maintenenceBy && !values.maintenenceBy) {
    errors.maintenenceBy = 'Required'
  }
  if (isTouched.workOrder && !values.workOrder) {
    errors.workOrder = 'Required'
  }
  if (isTouched.vendorName && !values.vendorName) {
    errors.vendorName = 'Required'
  }
  if (isTouched.MaintenanceStart && !values.MaintenanceStart) {
    errors.MaintenanceStart = 'Required'
  }
  if (isTouched.MaintenanceEnd && !values.MaintenanceEnd) {
    errors.MaintenanceEnd = 'Required'
  }

  // Document Verification - Hire
  if (isTouched.panNum && !values.panNum) {
    errors.panNum = 'Required'
  }
  if (isTouched.license && !values.license) {
    errors.license = 'Required'
  }
  if (isTouched.rcFront && !values.rcFront) {
    errors.rcFront = 'Required'
  }
  if (isTouched.rcBack && !values.rcBack) {
    errors.rcBack = 'Required'
  }
  if (isTouched.insurance && !values.insurance) {
    errors.insurance = 'Required'
  }
  if (isTouched.insuranceValid && !values.insuranceValid) {
    errors.insuranceValid = 'Required'
  }
  if (isTouched.TDSfront && !values.TDSfront) {
    errors.TDSfront = 'Required'
  }
  if (isTouched.TDSback && !values.TDSback) {
    errors.TDSback = 'Required'
  }
  if (isTouched.transportShed && !values.transportShed) {
    errors.transportShed = 'Required'
  }
  if (isTouched.shedName && !values.shedName) {
    errors.shedName = 'Required'
  }
  if (isTouched.ownershipTrans && !values.ownershipTrans) {
    errors.ownershipTrans = 'Required'
  }
  if (isTouched.shedownerMob && !values.shedownerMob) {
    errors.shedownerMob = 'Required'
  }
  if (isTouched.shedownerWhatsapp && !values.shedownerWhatsapp) {
    errors.shedownerWhatsapp = 'Required'
  }
  if (isTouched.freigthRate && !values.freigthRate) {
    errors.freigthRate = 'Required'
  }

  // Document Verification - Hire Not Avail
  if (isTouched.ownerName && !values.ownerName) {
    errors.ownerName = 'Required'
  }
  if (isTouched.docNum && !values.docNum) {
    errors.docNum = 'Required'
  }
  if (isTouched.aadharCard && !values.aadharCard) {
    errors.aadharCard = 'Required'
  }
  if (isTouched.bankPass && !values.bankPass) {
    errors.bankPass = 'Required'
  }
  if (isTouched.panCard && !values.panCard) {
    errors.panCard = 'Required'
  }

  // Vendor Creation Request
  if (isTouched.aadhar && !values.aadhar) {
    errors.aadhar = 'Required'
  }

  // Vehicle Assignment - Foods & Consumer
  if (isTouched.advanceReq && !values.advanceReq) {
    errors.advanceReq = 'Required'
  }
  // Advance Payment - Own
  if (isTouched.advanceReq && !values.advanceReq) {
    errors.advanceReq = 'Required'
  }
  if (isTouched.enterOtp && !values.enterOtp) {
    errors.enterOtp = 'Required'
  }

  // Advance Payment - Hire
  if (isTouched.advancepayBank && !values.advancepayBank) {
    errors.advancepayBank = 'Required'
  }
  if (isTouched.advancepayDiesel && !values.advancepayDiesel) {
    errors.advancepayDiesel = 'Required'
  }
  if (isTouched.actFreight && !values.actFreight) {
    errors.actFreight = 'Required'
  }
  if (isTouched.incomeFreight && !values.incomeFreight) {
    errors.incomeFreight = 'Required'
  }
  if (isTouched.expectDelivery && !values.expectDelivery) {
    errors.expectDelivery = 'Required'
  }

  // Diesel Indent Creation

  // Diesel Indent Confirmation

  // FI Entry
  if (isTouched.tripNum && !values.tripNum) {
    errors.tripNum = 'Required'
  }
  if (isTouched.ownerMob && !values.ownerMob) {
    errors.ownerMob = 'Required'
  }
  if (isTouched.docType && !values.docType) {
    errors.docType = 'Required'
  }
  if (isTouched.internalNum && !values.internalNum) {
    errors.internalNum = 'Required'
  }
  if (isTouched.amount && !values.amount) {
    errors.amount = 'Required'
  }
  if (isTouched.narration && !values.narration) {
    errors.narration = 'Required'
  }
  if (isTouched.division && !values.division) {
    errors.division = 'Required'
  }

  // ===================By ASK================(start)========================

  if (isTouched.material_description && !values.material_description) {
    errors.material_description = 'Required'
  }
  if (isTouched.uom && !values.uom) {
    errors.uom = 'Required'
  }
  if (isTouched.defect_type && !values.defect_type.trim()) {
    errors.defect_type = 'Required'
  }

  // ===================By ASK================(end)========================

  // Change Vehicle
  if (isTouched.status && !values.status) {
    errors.status = 'Required'
  }

  // Common Remarks
  if (isTouched.remarks && !values.remarks) {
    errors.remarks = 'Required'
  }

  //================================ Transaction Pages Validations ===================================
  /*                       */
  //================================ Masters Validations =============================================

  // Sub-Masters
  if (isTouched.division && !values.division) {
    errors.division = 'Required'
  }

  if (isTouched.department && !values.department) {
    errors.department = 'Required'
  }

  //================================ Masters Validations =============================================

  // console.log(errors)
  return errors
}
