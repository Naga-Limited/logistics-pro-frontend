export const InitialCalculationValues = {
  budgetKM: '',
  actualKM: '',
  budgetMileage: '',
  actualMileage: '',
}

export const InitialURVValues = {
  urvName: '',
  urvDieselLiter: '',
  urvDieselRate: '',
  urvDieselAmount: '',
  urvInvoice: '',
}

export const InitialRVValues = {
  rvTotalDieselLiter: 0,
  rvAverageRatePerLiter: 0,
  rvTotalDieselAmount: 0,
}

export const stoStateVariables = {
  sto_delivery_number: 'sto_delivery_number',
  sto_po_number: 'sto_po_number',
  sto_delivery_division: 'sto_delivery_division',
  sto_from_location: 'sto_from_location',
  sto_to_location: 'sto_to_location',
  sto_delivery_quantity: 'sto_delivery_quantity',
  sto_freight_amount: 'sto_freight_amount',
  sto_delivery_date_time: 'sto_delivery_date_time',
  sto_pod_copy: 'sto_pod_copy',
  sto_delivery_driver_name: 'sto_delivery_driver_name',
  sto_delivery_expense_capture: 'sto_delivery_expense_capture',
}

export const stoInitialState = {
  [stoStateVariables.sto_delivery_number]: '',
  [stoStateVariables.sto_po_number]: '',
  [stoStateVariables.sto_delivery_division]: '',
  [stoStateVariables.sto_from_location]: '',
  [stoStateVariables.sto_to_location]: '',
  [stoStateVariables.sto_delivery_quantity]: '',
  [stoStateVariables.sto_freight_amount]: '',
  [stoStateVariables.sto_delivery_date_time]: '',
  [stoStateVariables.sto_pod_copy]: '',
  [stoStateVariables.sto_delivery_driver_name]: '',
  [stoStateVariables.sto_delivery_expense_capture]: false,
}

export const stoStateVariablesRMSTO = {
  sto_delivery_number_rmsto: 'sto_delivery_number_rmsto',
  sto_po_number_rmsto: 'sto_po_number_rmsto',
  sto_delivery_division_rmsto: 'sto_delivery_division_rmsto',
  sto_from_location_rmsto: 'sto_from_location_rmsto',
  sto_to_location_rmsto: 'sto_to_location_rmsto',
  sto_delivery_quantity_rmsto: 'sto_delivery_quantity_rmsto',
  sto_freight_amount_rmsto: 'sto_freight_amount_rmsto',
  sto_delivery_date_time_rmsto: 'sto_delivery_date_time_rmsto',
  sto_pod_copy_rmsto: 'sto_pod_copy_rmsto',
  sto_delivery_driver_name_rmsto: 'sto_delivery_driver_name_rmsto',
  sto_delivery_expense_capture_rmsto: 'sto_delivery_expense_capture_rmsto',
}

export const stoStateVariablesFCI = { 
  sto_po_number_fci: 'sto_po_number_fci',
  sto_delivery_division_fci: 'sto_delivery_division_fci',
  sto_from_location_fci: 'sto_from_location_fci',
  sto_to_location_fci: 'sto_to_location_fci',
  sto_delivery_quantity_fci: 'sto_delivery_quantity_fci',
  sto_base_freight_amount_fci: 'sto_base_freight_amount_fci',
  sto_migo_number_fci: 'sto_migo_number_fci',
  sto_va_number_fci: 'sto_va_number_fci',
  sto_driver_name_fci: 'sto_driver_name_fci', 
}

export const stoStateVariablesFGSTO = {
  sto_delivery_number_fgsto: 'sto_delivery_number_fgsto',
  sto_po_number_fgsto: 'sto_po_number_fgsto',
  sto_delivery_division_fgsto: 'sto_delivery_division_fgsto',
  sto_from_location_fgsto: 'sto_from_location_fgsto',
  sto_to_location_fgsto: 'sto_to_location_fgsto',
  sto_delivery_quantity_fgsto: 'sto_delivery_quantity_fgsto',
  sto_freight_amount_fgsto: 'sto_freight_amount_fgsto',
  sto_delivery_date_time_fgsto: 'sto_delivery_date_time_fgsto',
  sto_pod_copy_fgsto: 'sto_pod_copy_fgsto',
  sto_delivery_driver_name_fgsto: 'sto_delivery_driver_name_fgsto',
  sto_delivery_expense_capture_fgsto: 'sto_delivery_expense_capture_fgsto',
}

export const stoInitialStateFGSTO = {
  [stoStateVariablesFGSTO.sto_delivery_number_fgsto]: '',
  [stoStateVariablesFGSTO.sto_po_number_fgsto]: '',
  [stoStateVariablesFGSTO.sto_delivery_division_fgsto]: '',
  [stoStateVariablesFGSTO.sto_from_location_fgsto]: '',
  [stoStateVariablesFGSTO.sto_to_location_fgsto]: '',
  [stoStateVariablesFGSTO.sto_delivery_quantity_fgsto]: '',
  [stoStateVariablesFGSTO.sto_freight_amount_fgsto]: '',
  [stoStateVariablesFGSTO.sto_delivery_date_time_fgsto]: '',
  [stoStateVariablesFGSTO.sto_pod_copy_fgsto]: '',
  [stoStateVariablesFGSTO.sto_delivery_driver_name_fgsto]: '',
  [stoStateVariablesFGSTO.sto_delivery_expense_capture_fgsto]: false,
}

export const stoInitialStateRMSTO = {
  [stoStateVariablesRMSTO.sto_delivery_number_rmsto]: '',
  [stoStateVariablesRMSTO.sto_po_number_rmsto]: '',
  [stoStateVariablesRMSTO.sto_delivery_division_rmsto]: '',
  [stoStateVariablesRMSTO.sto_from_location_rmsto]: '',
  [stoStateVariablesRMSTO.sto_to_location_rmsto]: '',
  [stoStateVariablesRMSTO.sto_delivery_quantity_rmsto]: '',
  [stoStateVariablesRMSTO.sto_freight_amount_rmsto]: '',
  [stoStateVariablesRMSTO.sto_delivery_date_time_rmsto]: '',
  [stoStateVariablesRMSTO.sto_pod_copy_rmsto]: '',
  [stoStateVariablesRMSTO.sto_delivery_driver_name_rmsto]: '',
  [stoStateVariablesRMSTO.sto_delivery_expense_capture_rmsto]: false,
}

export const stoInitialStateFCI = { 
  [stoStateVariablesFCI.sto_po_number_fci]: '',
  [stoStateVariablesFCI.sto_delivery_division_fci]: '',
  [stoStateVariablesFCI.sto_from_location_fci]: '',
  [stoStateVariablesFCI.sto_to_location_fci]: '',
  [stoStateVariablesFCI.sto_delivery_quantity_fci]: '', 
  [stoStateVariablesFCI.sto_base_freight_amount_fci]: '',
  [stoStateVariablesFCI.sto_migo_number_fci]: '',
  [stoStateVariablesFCI.sto_va_number_fci]: '', 
  [stoStateVariablesFCI.sto_driver_name_fci]: '', 
}

export const vadGetInputs = {
  delivered_date_time_input: '',
  unloading_charges_input: '',
  fj_pod_copy_input: '',
  defect_type_input: '',
}

export const vadGetInputErrors = {
  delivered_date_time_validated: '',
  unloading_charges_validated: '',
  fj_pod_copy_validated: '',
}

export const stoOthersStateVariables = {
  others_sto_process_type: 'others_sto_process_type',
  others_sto_vr_id: 'others_sto_vr_id',
  others_sto_doc_number: 'others_sto_doc_number',
  others_sto_doc_date: 'others_sto_doc_date',
  others_sto_from_plant_code: 'others_sto_from_plant_code',
  others_sto_from_plant_name: 'others_sto_from_plant_name',
  others_sto_to_plant_code: 'others_sto_to_plant_code',
  others_sto_to_plant_name: 'others_sto_to_plant_name',
  others_sto_vendor_code: 'others_sto_vendor_code',
  others_sto_vendor_name: 'others_sto_vendor_name',
  others_sto_po_number: 'others_sto_po_number',
  others_sto_delivery_quantity: 'others_sto_delivery_quantity',
  others_sto_freight_amount: 'others_sto_freight_amount',
  others_sto_pod_copy: 'others_sto_pod_copy',
  others_sto_delivered_date: 'others_sto_delivered_date',
  others_sto_incoterm: 'others_sto_incoterm',
  others_sto_net_weight: 'others_sto_net_weight',
  others_sto_customer_code: 'others_sto_customer_code',
  others_sto_assignment: 'others_sto_assignment',
  others_sto_va_no: 'others_sto_va_no',
  others_sto_truck_no: 'others_sto_truck_no'
}

export const stoOthersInitialState = {
  [stoOthersStateVariables.others_sto_process_type]: '',
  [stoOthersStateVariables.others_sto_vr_id]: '',
  [stoOthersStateVariables.others_sto_doc_number]: '',
  [stoOthersStateVariables.others_sto_doc_date]: '',
  [stoOthersStateVariables.others_sto_from_plant_code]: '',
  [stoOthersStateVariables.others_sto_from_plant_name]: '',
  [stoOthersStateVariables.others_sto_to_plant_code]: '',
  [stoOthersStateVariables.others_sto_to_plant_name]: '',
  [stoOthersStateVariables.others_sto_vendor_code]: '',
  [stoOthersStateVariables.others_sto_vendor_name]: '',
  [stoOthersStateVariables.others_sto_po_number]: '',
  [stoOthersStateVariables.others_sto_delivery_quantity]: '',
  [stoOthersStateVariables.others_sto_freight_amount]: '',
  [stoOthersStateVariables.others_sto_pod_copy]: '',
  [stoOthersStateVariables.others_sto_delivered_date]: '',
  [stoOthersStateVariables.others_sto_incoterm]: '',
  [stoOthersStateVariables.others_sto_net_weight]: '',
  [stoOthersStateVariables.others_sto_customer_code]: '',
  [stoOthersStateVariables.others_sto_assignment]: '',
  [stoOthersStateVariables.others_sto_va_no]: '',
  [stoOthersStateVariables.others_sto_truck_no]: '',
}
