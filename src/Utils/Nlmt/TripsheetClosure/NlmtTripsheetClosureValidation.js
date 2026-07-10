export default function NlmtTripsheetClosureValidation(values, isTouched) {
  const errors = {}
  console.log(values)
  console.log(isTouched)

  /* Toll Amount Validation Rule */

  if (isTouched.toll_amount && !values.toll_amount) {
    errors.toll_amount = 'Required'
  } else if (isTouched.toll_amount && !values.toll_amount.match(/^[0-9]{0,5}$/)) {
    errors.toll_amount = 'Only have Numeric Value'
  }

  /* Bata Validation Rule */

  if (isTouched.bata && !values.bata) {
    errors.bata = 'Required'
  } else if (isTouched.bata && !values.bata.match(/^[0-9]{0,5}$/)) {
    errors.bata = 'Only have Numeric Value'
  }

  /* Municipal Charges Validation Rule */

  if (isTouched.municipal_charges && !values.municipal_charges) {
    errors.municipal_charges = 'Required'
  } else if (isTouched.municipal_charges && !values.municipal_charges.match(/^[0-9]{0,5}$/)) {
    errors.municipal_charges = 'Only have Numeric Value'
  }

  /* Port Entry Fee Validation Rule */

  if (isTouched.port_entry_fee && !values.port_entry_fee) {
    errors.port_entry_fee = 'Required'
  } else if (isTouched.port_entry_fee && !values.port_entry_fee.match(/^[0-9]{0,5}$/)) {
    errors.port_entry_fee = 'Only have Numeric Value'
  }

  /* Misc Charges Validation Rule */

  if (isTouched.misc_charges && !values.misc_charges) {
    errors.misc_charges = 'Required'
  } else if (isTouched.misc_charges && !values.misc_charges.match(/^[0-9]{0,5}$/)) {
    errors.misc_charges = 'Only have Numeric Value'
  }

  /* Fine Amount Validation Rule */

  if (isTouched.fine_amount && !values.fine_amount) {
    errors.fine_amount = 'Required'
  } else if (isTouched.fine_amount && !values.fine_amount.match(/^[0-9]{0,5}$/)) {
    errors.fine_amount = 'Only have Numeric Value'
  }

  /* Subdelivery Charges Validation Rule */

  if (isTouched.sub_delivery_charges && !values.sub_delivery_charges) {
    errors.sub_delivery_charges = 'Required'
  } else if (isTouched.sub_delivery_charges && !values.sub_delivery_charges.match(/^[0-9]{0,5}$/)) {
    errors.sub_delivery_charges = 'Only have Numeric Value'
  }

  /* Maintenance Cost Validation Rule */

  if (isTouched.maintenance_cost && !values.maintenance_cost) {
    errors.maintenance_cost = 'Required'
  } else if (isTouched.maintenance_cost && !values.maintenance_cost.match(/^[0-9]{0,5}$/)) {
    errors.maintenance_cost = 'Only have Numeric Value'
  }

  /* Loading Charges Validation Rule */

  if (isTouched.loading_charges && !values.loading_charges) {
    errors.loading_charges = 'Required'
  } else if (isTouched.loading_charges && !values.loading_charges.match(/^[0-9]{0,5}$/)) {
    errors.loading_charges = 'Only have Numeric Value'
  }

  /* Unloading Charges Validation Rule */

  if (isTouched.unloading_charges && !values.unloading_charges) {
    errors.unloading_charges = 'Required'
  } else if (isTouched.unloading_charges && !values.unloading_charges.match(/^[0-9]{0,5}$/)) {
    errors.unloading_charges = 'Only have Numeric Value'
  }

  /* Tarpaulin Charges Validation Rule */

  if (isTouched.tarpaulin_charges && !values.tarpaulin_charges) {
    errors.tarpaulin_charges = 'Required'
  } else if (isTouched.tarpaulin_charges && !values.tarpaulin_charges.match(/^[0-9]{0,5}$/)) {
    errors.tarpaulin_charges = 'Only have Numeric Value'
  }

  /* Weighment Charges Validation Rule */

  if (isTouched.weighment_charges && !values.weighment_charges) {
    errors.weighment_charges = 'Required'
  } else if (isTouched.weighment_charges && !values.weighment_charges.match(/^[0-9]{0,5}$/)) {
    errors.weighment_charges = 'Only have Numeric Value'
  }

  /* Low Tonage Charges Validation Rule */

  if (isTouched.low_tonage_charges && !values.low_tonage_charges) {
    errors.low_tonage_charges = 'Required'
  } else if (isTouched.low_tonage_charges && !values.low_tonage_charges.match(/^[0-9]{0,5}$/)) {
    errors.low_tonage_charges = 'Only have Numeric Value'
  }

  /* Low Tonnage Charges Validation Rule */

  if (isTouched.low_tonnage_charges && !values.low_tonnage_charges) {
    errors.low_tonnage_charges = 'Required'
  } else if (isTouched.low_tonnage_charges && !values.low_tonnage_charges.match(/^[0-9]{0,5}$/)) {
    errors.low_tonnage_charges = 'Only have Numeric Value'
  }

  /* Halting Charges Validation Rule */

  if (isTouched.halting_charges && !values.halting_charges) {
    errors.halting_charges = 'Required'
  } else if (isTouched.halting_charges && !values.halting_charges.match(/^[0-9]{0,5}$/)) {
    errors.halting_charges = 'Only have Numeric Value'
  }

  /* Freight Charges Validation Rule */

  if (isTouched.freight_charges && !values.freight_charges) {
    errors.freight_charges = 'Required'
  } else if (isTouched.freight_charges && !values.freight_charges.match(/^[0-9]{0,5}$/)) {
    errors.freight_charges = 'Only have Numeric Value'
  }

  /* Halt Days Validation Rule */

  if (isTouched.halt_days && !values.halt_days) {
    errors.halt_days = 'Required'
  } else if (isTouched.halt_days && !values.halt_days.match(/^[0-9]{0,5}$/)) {
    errors.halt_days = 'Only have Numeric Value'
  }

  /* Stock Diversion / Return Charges Validation Rule */

  if (isTouched.diversion_return_charges && !values.diversion_return_charges) {
    errors.diversion_return_charges = 'Required'
  } else if (
    isTouched.diversion_return_charges &&
    !values.diversion_return_charges.match(/^[0-9]{0,5}$/)
  ) {
    errors.diversion_return_charges = 'Only have Numeric Value'
  }

  /* RJSO Weighment Charges Validation Rule */

  if (isTouched.rjso_weighment_charges && !values.rjso_weighment_charges) {
    errors.rjso_weighment_charges = 'Required'
  } else if (isTouched.rjso_weighment_charges && !values.rjso_weighment_charges.match(/^[0-9]{0,5}$/)) {
    errors.rjso_weighment_charges = 'Only have Numeric Value'
  }

  /* RJSO Misc. Charges Validation Rule */

  if (isTouched.rjso_misc_charges && !values.rjso_misc_charges) {
    errors.rjso_misc_charges = 'Required'
  } else if (isTouched.rjso_misc_charges && !values.rjso_misc_charges.match(/^[0-9]{0,5}$/)) {
    errors.rjso_misc_charges = 'Only have Numeric Value'
  }

  /* RJSO Commision Charges Validation Rule */

  if (isTouched.rjso_commision_charges && !values.rjso_commision_charges) {
    errors.rjso_commision_charges = 'Required'
  } else if (isTouched.rjso_commision_charges && !values.rjso_commision_charges.match(/^[0-9]{0,5}$/)) {
    errors.rjso_commision_charges = 'Only have Numeric Value'
  }

  /* RJSO Bata Amount Validation Rule */

  if (isTouched.rjso_bata_amount && !values.rjso_bata_amount) {
    errors.rjso_bata_amount = 'Required'
  } else if (isTouched.rjso_bata_amount && !values.rjso_bata_amount.match(/^[0-9]{0,5}$/)) {
    errors.rjso_bata_amount = 'Only have Numeric Value'
  }

  /* RJSO Loading Charges Validation Rule */

  if (isTouched.rjso_loading_charges && !values.rjso_loading_charges) {
    errors.rjso_loading_charges = 'Required'
  } else if (isTouched.rjso_loading_charges && !values.rjso_loading_charges.match(/^[0-9]{0,5}$/)) {
    errors.rjso_loading_charges = 'Only have Numeric Value'
  }

  /* RJSO Unloading Charges Validation Rule */

  if (isTouched.rjso_unloading_charges && !values.rjso_unloading_charges) {
    errors.rjso_unloading_charges = 'Required'
  } else if (isTouched.rjso_unloading_charges && !values.rjso_unloading_charges.match(/^[0-9]{0,5}$/)) {
    errors.rjso_unloading_charges = 'Only have Numeric Value'
  }

  /* RJSO Tarpaulin Charges Validation Rule */

  if (isTouched.rjso_tarpaulin_charges && !values.rjso_tarpaulin_charges) {
    errors.rjso_tarpaulin_charges = 'Required'
  } else if (isTouched.rjso_tarpaulin_charges && !values.rjso_tarpaulin_charges.match(/^[0-9]{0,5}$/)) {
    errors.rjso_tarpaulin_charges = 'Only have Numeric Value'
  }

  /* RJSO Municipal Charges Validation Rule */

  if (isTouched.rjso_munic_charges && !values.rjso_munic_charges) {
    errors.rjso_munic_charges = 'Required'
  } else if (isTouched.rjso_munic_charges && !values.rjso_munic_charges.match(/^[0-9]{0,5}$/)) {
    errors.rjso_munic_charges = 'Only have Numeric Value'
  }

  /* RJSO Halting Charges Validation Rule */

  if (isTouched.rjso_halt_charges && !values.rjso_halt_charges) {
    errors.rjso_halt_charges = 'Required'
  } else if (isTouched.rjso_halt_charges && !values.rjso_halt_charges.match(/^[0-9]{0,5}$/)) {
    errors.rjso_halt_charges = 'Only have Numeric Value'
  }

  /* RJSO ED Charges Validation Rule */

  if (isTouched.rjso_en_diesel_charges && !values.rjso_en_diesel_charges) {
    errors.rjso_en_diesel_charges = 'Required'
  } else if (isTouched.rjso_en_diesel_charges && !values.rjso_en_diesel_charges.match(/^[0-9]{0,5}$/)) {
    errors.rjso_en_diesel_charges = 'Only have Numeric Value'
  }

  /* FCI Atti Cooli Charges Validation Rule */

  if (isTouched.fci_atti_cooli_charges && !values.fci_atti_cooli_charges) {
    errors.fci_atti_cooli_charges = 'Required'
  } else if (isTouched.fci_atti_cooli_charges && !values.fci_atti_cooli_charges.match(/^[0-9]{0,5}$/)) {
    errors.fci_atti_cooli_charges = 'Only have Numeric Value'
  }

  /* FCI Extra Charges Validation Rule */

  if (isTouched.fci_extra_charges && !values.fci_extra_charges) {
    errors.fci_extra_charges = 'Required'
  } else if (isTouched.fci_extra_charges && !values.fci_extra_charges.match(/^[0-9]{0,5}$/)) {
    errors.fci_extra_charges = 'Only have Numeric Value'
  }

  /* FCI Office Expenses Validation Rule */

  if (isTouched.fci_office_exp_charges && !values.fci_office_exp_charges) {
    errors.fci_office_exp_charges = 'Required'
  } else if (isTouched.fci_office_exp_charges && !values.fci_office_exp_charges.match(/^[0-9]{0,5}$/)) {
    errors.fci_office_exp_charges = 'Only have Numeric Value'
  }

  /* FCI Gate Expenses Validation Rule */

  if (isTouched.fci_gate_exp_charges && !values.fci_gate_exp_charges) {
    errors.fci_gate_exp_charges = 'Required'
  } else if (isTouched.fci_gate_exp_charges && !values.fci_gate_exp_charges.match(/^[0-9]{0,5}$/)) {
    errors.fci_gate_exp_charges = 'Only have Numeric Value'
  }

  /* FCI Weighment Charges Validation Rule */

  if (isTouched.fci_weighment_charges && !values.fci_weighment_charges) {
    errors.fci_weighment_charges = 'Required'
  } else if (isTouched.fci_weighment_charges && !values.fci_weighment_charges.match(/^[0-9]{0,5}$/)) {
    errors.fci_weighment_charges = 'Only have Numeric Value'
  }

  // console.log(errors)
  return errors
}
