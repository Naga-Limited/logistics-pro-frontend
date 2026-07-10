export default function ClosureCommonForm(form_data, type) {

  let rowDataList = []

  /* Function For Vehicle Type Find */
  const vehicleType = (id) => {
    if (id == 1) {
      return 'Own'
    } else if (id == 2) {
      return 'Contract'
    } else if (id == 3) {
      return 'Hire'
    } else {
      return 'Party Vehicle'
    }
  }

  /* Function For Closure Status Find */
  const closureStatus = (id) => {
    if (id == 1) {
      return 'Expense Completed'
    } else if (id == 2) {
      return 'Income Rejected'
    } else if (id == 3) {
      return 'Income Completed'
    } else if (id == 5) {
      return 'Settlement Partially Completed'
    } else {
      return 'Settlement Completed'
    }
  }

  /* Function For Trip Purpose Find */
  const tripPurpose = (id) => {
    if(id == 1) {
      return 'FG-Sales'
    } else if(id == 2) {
      return 'FG-STO'
    } else if(id == 3) {
      return 'RMSTO'
    } else if(id == 4) {
      return 'OTHERS'
    } else {
      return 'FCI'
    }
  }

  /* Function For Trip Division Find */
  const tripDivision = (id) => {
    if(id == 2) {
      return 'NLCD'
    } else {
      return 'NLFD'
    }
  }

  /* Function For Trip Addon Availability Find */
  const tripAddonAvailabilityCheck = (id,data) => {
    let trip_addon_count = 0

    let trip_addon_check = true

    let trip_purpose = data.trip_sheet_info.purpose

    var sto_length = data.trip_sto_info.length;
    var fgsales_length = data.trip_sto_info.length;

    if( trip_purpose == 1 && sto_length > 0 || ((trip_purpose == 2 || trip_purpose == 3)  && fgsales_length > 0) ) {
      trip_addon_check = false
    } else if( sto_length > 1 || fgsales_length > 1) {
      trip_addon_check = false
    }

    let trip_addon = trip_addon_check ? 'Yes' : 'No'

    return trip_addon
  }

  /* ============== Function for Get Total Freight Start =============== */
  const total_freight_calculation = (type, data) => {
    let total_freight = 0
    let base_freight = 0
    let additional_freight = 0
    let additional_freight7 = 0

    console.log(data)

    let additional_freight1 = data.income_halting_charges ? Number(data.income_halting_charges) : 0
    let additional_freight2 = data.income_sub_delivery_charges ? Number(data.income_sub_delivery_charges) : 0
    let additional_freight3 = data.income_unloading_charges ? Number(data.income_unloading_charges) : 0
    let additional_freight4 = data.income_weighment_chares ? Number(data.income_weighment_chares) : 0
    let additional_freight5 = data.income_low_tonage_charges ? Number(data.income_low_tonage_charges) : 0
    let additional_freight6 = data.income_others_charges ? Number(data.income_others_charges) : 0

    if(type != 'rjso') {
      additional_freight7 = data.income_base_charges ? Number(data.income_base_charges) : 0
    }

    additional_freight = additional_freight1 + additional_freight2 + additional_freight3 + additional_freight4 + additional_freight5 + additional_freight6

    if (type == 'sto') {
      base_freight = Number(data.freight_amount)
    } else if (type == 'fg-sales') {
      base_freight = Number(data.shipment_freight_amount)
    } else if (type == 'rjso') {
      if(data.balance_payment_received && data.balance_payment_received == '1') {
        base_freight = Number(data.freight_income)
      } else {
        base_freight = Number(data.advance_amount)
      }
    }

    if(type != 'rjso') {
      console.log(additional_freight7, 'additional_freight7')
      if (additional_freight7 && additional_freight7 > 0) {
        total_freight = additional_freight + additional_freight7
      } else {
        total_freight = base_freight + additional_freight
      }
    } else {
      total_freight = base_freight + additional_freight
    }

    // total_freight = base_freight + additional_freight
    console.log(base_freight, 'base_freight')
    console.log(additional_freight, 'additional_freight')
    console.log(total_freight, 'total_freight')

    return total_freight
  }

  /* ============== Function for Get Total Freight End =============== */

  /* Function For MMD Income Calculation Find */
  const mmdIncomeCalculate = (data) => {
    let total_mmd_income = 0

    /* FG_STO and RM_STO Income Calculation */
    if(data.trip_sto_info.length > 0) {
      let mapping_data = data.trip_sto_info
      mapping_data.map((value_data,value_index)=>{
        if(value_data.sto_delivery_division == 'MMD') {
          total_mmd_income += total_freight_calculation('sto', value_data)
        }
      })
    }

    return total_mmd_income
  }

  /* Function For NLFD Income Calculation Find */
  const nlfdIncomeCalculate = (data) => {
    let total_nlfd_income = 0

    /* FG_SALES Income Calculation */
    if(data.shipment_info.length > 0) {
      let mapping_data = data.shipment_info
      mapping_data.map((value_data,value_index)=>{
        if(value_data.assigned_by == 1) {
          total_nlfd_income += total_freight_calculation('fg-sales', value_data)
        }
      })
    }

    /* FG_STO and RM_STO Income Calculation */
    if(data.trip_sto_info.length > 0) {
      let mapping_data = data.trip_sto_info
      mapping_data.map((value_data,value_index)=>{
        if(value_data.sto_delivery_division == 'FOODS') {
          total_nlfd_income += total_freight_calculation('sto', value_data)
        }
      })
    }

    return total_nlfd_income
  }

  /* Function For NLCD Income Calculation Find */
  const nlcdIncomeCalculate = (data) => {
    let total_nlcd_income = 0

    /* FG_SALES Income Calculation */
    if(data.shipment_info.length > 0) {
      let mapping_data = data.shipment_info
      mapping_data.map((value_data,value_index)=>{
        if(value_data.assigned_by == 2) {
          total_nlcd_income += total_freight_calculation('fg-sales', value_data)
        }
      })
    }

    /* FG_STO Income Calculation */
    if(data.trip_sto_info.length > 0) {
      let mapping_data = data.trip_sto_info
      mapping_data.map((value_data,value_index)=>{
        if(value_data.sto_delivery_division == 'CONSUMER') {
          total_nlcd_income += total_freight_calculation('sto', value_data)
        }
      })
    }

    return total_nlcd_income
  }

  const incomeBaseDocFinder = (data,code) => {
    let base_doc = '-'
    data.map((vg,kg)=>{
      if(vg.Doc_type_code == code){
        base_doc = vg.Document_no
      }
    })
    return base_doc
  }

  const incomeAddDocFinder = (data,code) => {
    let add_doc = '-'
    data.map((vg,kg)=>{
      if(vg.Doc_type_code == code){
        add_doc = vg.Document_no
      }
    })
    return add_doc
  }

  /* Function For RJSO Income Calculation Find */
  const rjsoIncomeCalculate = (data) => {
    let total_rjso_income = 0

    /* RJSO Income Calculation */
    if(data.rj_so_info.length > 0) {
      let mapping_data = data.rj_so_info
      mapping_data.map((value_data,value_index)=>{
        total_rjso_income += total_freight_calculation('rjso', value_data)
      })
    }

    return total_rjso_income
  }

  /* Form Row Data as per the request : Type1-Closure, Type2-Settlement */

  if(type == '1') {
    form_data.map((data, index) => {
      rowDataList.push({
        sno: index + 1,
        Tripsheet_No: data.trip_sheet_info.trip_sheet_no,
        Tripsheet_Date: data.trip_sheet_info.created_date,
        Vehicle_Type: vehicleType(data.vehicle_type_id.id),
        Vehicle_No: data.vehicle_number,
        Driver_Name: data.driver_name,
        Driver_Mobile_Number: data.driver_contact_number,
        Driver_Code: data.driver_info ? data.driver_info.driver_code : '-',
        Vendor_Name: data.vendor_info ? data.vendor_info.owner_name : '-',
        Vendor_Pan_No: data.vendor_info ? data.vendor_info.pan_card_number : '-',
        Vendor_Mobile_No: data.vendor_info ? data.vendor_info.owner_number : '-',
        Vendor_Code: data.vendor_info ? data.vendor_info.vendor_code : '-',
        Trip_Purpose: tripPurpose(data.trip_sheet_info.purpose),
        Trip_Division: tripDivision(data.trip_sheet_info.to_divison),
        Advance_Availability: data.trip_sheet_info.trip_advance_eligiblity == 1 ? 'Yes' : 'No',
        Driver_Advance: data.advance_payment_info ? data.advance_payment_info.advance_payment : '-',
        Total_Freight: data.advance_payment_info ? data.advance_payment_info.actual_freight : '-',
        Bank_Advance: data.advance_payment_info ? data.advance_payment_info.advance_payment : '-',
        Diesel_Advance: data.advance_payment_info ? data.advance_payment_info.advance_payment_diesel : '-',
        Addon_Availability: tripAddonAvailabilityCheck(data.trip_sheet_info.trip_sheet_no,data),
        RJSO_Availability: data.rj_so_info.length > 0 ? 'Yes' : 'No',
        Budgeted_KM: data.trip_settlement_info.budgeted_km,
        Actual_KM: data.trip_settlement_info.actual_km,
        Budgeted_Mileage: data.trip_settlement_info.budgeted_mileage,
        Actual_Mileage: data.trip_settlement_info.actual_mileage,
        Trip_Idle_Hours: data.trip_settlement_info.idle_hours,
        Unloading_Charges: data.trip_settlement_info.unloading_charges,
        Sub_Delivery_Charges: data.trip_settlement_info.sub_delivery_charges,
        Weighment_Charges: data.trip_settlement_info.weighment_charges,
        Freight_Charges: data.trip_settlement_info.freight_charges,
        Diversion_Return_Charges: data.trip_settlement_info.diversion_return_charges,
        Halting_Charges: data.trip_settlement_info.halting_charges,
        Toll_Amount: data.trip_settlement_info.fasttag_toll_amount,
        Bata: data.trip_settlement_info.bata,
        Municipal_Charges: data.trip_settlement_info.municipal_charges,
        Registered_Diesel_Amount: data.trip_settlement_info.registered_diesel_amount,
        Enroute_Diesel_Amount: data.trip_settlement_info.enroute_diesel_amount,
        Port_Entry_Fee: data.trip_settlement_info.port_entry_fee,
        Misc_Charges: data.trip_settlement_info.misc_charges,
        Fine_Amount: data.trip_settlement_info.fine_amount,
        Maintenance_Cost: data.trip_settlement_info.maintenance_cost,
        Loading_Charges: data.trip_settlement_info.loading_charges,
        Tarpaulin_Charges: data.trip_settlement_info.tarpaulin_charges,
        Low_Tonnage_Charges: data.trip_settlement_info.low_tonage_charges,
        Local_Bata_Amount: data.trip_settlement_info.local_bata_amount,
        Halt_Bata_Amount: data.trip_settlement_info.halt_bata_amount,
        RJ_Bata_Amount: data.trip_settlement_info.rjso_bata_amount,
        RJ_Loading_Charges: data.trip_settlement_info.rjso_loading_charges,
        RJ_Commision_Charges: data.trip_settlement_info.rjso_commision_charges,
        RJ_Tarpaulin_Charges: data.trip_settlement_info.rjso_tarpaulin_charges,
        RJ_Weighment_Charges: data.trip_settlement_info.rjso_weighment_charges,
        RJ_Unloading_Charges: data.trip_settlement_info.rjso_unloading_charges,
        RJ_Misc_Charges: data.trip_settlement_info.rjso_misc_charges,
        RJ_Munic_Charges: data.trip_settlement_info.rjso_munic_charges,
        RJ_Halt_Charges: data.trip_settlement_info.rjso_halt_charges,
        RJ_ED_Charges: data.trip_settlement_info.rjso_en_diesel_charges,
        FCI_AttiCooli_Charges: data.trip_settlement_info.fci_atti_cooli_charges,
        FCI_Extra_Charges: data.trip_settlement_info.fci_extra_charges,
        FCI_OfficeExpense_Charges: data.trip_settlement_info.fci_office_exp_charges,
        FCI_GateExpense_Charges: data.trip_settlement_info.fci_gate_exp_charges,
        FCI_Weighment_Charges: data.trip_settlement_info.fci_weighment_charges,
        Driver_Expense: data.trip_settlement_info.driver_expense,
        Trip_Expense: data.trip_settlement_info.expense,
        Halt_Days: data.trip_settlement_info.halt_days,
        Driver_Advance_Sap_Document_No: data.advance_payment_info ? data.advance_payment_info.document_no : '-',
        Diesel_Vendor_Sap_Document_No: data.diesel_intent_info ? data.diesel_intent_info.diesel_vendor_sap_invoice_no : '-',
        Total_Freight_Expense_Sap_Document_No: data.advance_payment_info ? data.advance_payment_info.sap_freight_payment_document_no : '-',
        Bank_Expense_Sap_Document_No: data.advance_payment_info ? data.advance_payment_info.sap_bank_payment_document_no : '-',
        Diesel_Expense_Sap_Document_No: data.advance_payment_info ? data.advance_payment_info.sap_diesel_payment_document_no : '-',
        Trip_Expense_Sap_Document_No: data.trip_settlement_info.expense_sap_document_no,
        Trip_Expense_Posting_Date: data.trip_settlement_info.expense_posting_date,
        TDS_Having: data.trip_settlement_info.tds_having,
        TDS_Type: data.trip_settlement_info.tds_type,
        SAP_Remarks: data.trip_settlement_info.sap_text,
        GST_Tax_Type: data.trip_settlement_info.gst_tax_type,
        Expense_Remarks: data.trip_settlement_info.remarks,
        Expense_Closure_Clearance_Date: data.trip_settlement_info.created_date,
        Trip_Income_Remarks: data.trip_settlement_info.income_remarks,
        Expense_Closure_Cleared_By: data.trip_settlement_info.created_by,
        Trip_Income_Amount: data.trip_settlement_info.income,
        Status: closureStatus(data.trip_settlement_info.tripsheet_is_settled),
      })
    })
  } else {
    form_data.map((data, index) => {
      rowDataList.push({
        sno: index + 1,
        Tripsheet_No: data.trip_sheet_info.trip_sheet_no,
        Tripsheet_Date: data.trip_sheet_info.created_date,
        Vehicle_Type: vehicleType(data.vehicle_type_id.id),
        Vehicle_No: data.vehicle_number,
        Driver_Name: data.driver_name,
        Driver_Mobile_Number: data.driver_contact_number,
        Driver_Code: data.driver_info ? data.driver_info.driver_code : '-',
        Vendor_Name: data.vendor_info ? data.vendor_info.owner_name : '-',
        Vendor_Pan_No: data.vendor_info ? data.vendor_info.pan_card_number : '-',
        Vendor_Mobile_No: data.vendor_info ? data.vendor_info.owner_number : '-',
        Vendor_Code: data.vendor_info ? data.vendor_info.vendor_code : '-',
        Trip_Purpose: tripPurpose(data.trip_sheet_info.purpose),
        Trip_Division: tripDivision(data.trip_sheet_info.to_divison),
        Advance_Availability: data.trip_sheet_info.trip_advance_eligiblity == 1 ? 'Yes' : 'No',
        Driver_Advance: data.advance_payment_info ? data.advance_payment_info.advance_payment : '-',
        Total_Freight: data.advance_payment_info ? data.advance_payment_info.actual_freight : '-',
        Bank_Advance: data.advance_payment_info ? data.advance_payment_info.advance_payment : '-',
        Diesel_Advance: data.advance_payment_info ? data.advance_payment_info.advance_payment_diesel : '-',
        Addon_Availability: tripAddonAvailabilityCheck(data.trip_sheet_info.trip_sheet_no,data),
        RJSO_Availability: data.rj_so_info.length > 0 ? 'Yes' : 'No',
        Budgeted_KM: data.trip_settlement_info.budgeted_km,
        Actual_KM: data.trip_settlement_info.actual_km,
        Budgeted_Mileage: data.trip_settlement_info.budgeted_mileage,
        Actual_Mileage: data.trip_settlement_info.actual_mileage,
        Trip_Idle_Hours: data.trip_settlement_info.idle_hours,
        Unloading_Charges: data.trip_settlement_info.unloading_charges,
        Sub_Delivery_Charges: data.trip_settlement_info.sub_delivery_charges,
        Weighment_Charges: data.trip_settlement_info.weighment_charges,
        Freight_Charges: data.trip_settlement_info.freight_charges,
        Diversion_Return_Charges: data.trip_settlement_info.diversion_return_charges,
        Halting_Charges: data.trip_settlement_info.halting_charges,
        Toll_Amount: data.trip_settlement_info.fasttag_toll_amount,
        Bata: data.trip_settlement_info.bata,
        Municipal_Charges: data.trip_settlement_info.municipal_charges,
        Registered_Diesel_Amount: data.trip_settlement_info.registered_diesel_amount,
        Enroute_Diesel_Amount: data.trip_settlement_info.enroute_diesel_amount,
        Port_Entry_Fee: data.trip_settlement_info.port_entry_fee,
        Misc_Charges: data.trip_settlement_info.misc_charges,
        Fine_Amount: data.trip_settlement_info.fine_amount,
        Maintenance_Cost: data.trip_settlement_info.maintenance_cost,
        Loading_Charges: data.trip_settlement_info.loading_charges,
        Tarpaulin_Charges: data.trip_settlement_info.tarpaulin_charges,
        Low_Tonnage_Charges: data.trip_settlement_info.low_tonage_charges,
        Local_Bata_Amount: data.trip_settlement_info.local_bata_amount,
        Halt_Bata_Amount: data.trip_settlement_info.halt_bata_amount,
        RJ_Bata_Amount: data.trip_settlement_info.rjso_bata_amount,
        RJ_Loading_Charges: data.trip_settlement_info.rjso_loading_charges,
        RJ_Commision_Charges: data.trip_settlement_info.rjso_commision_charges,
        RJ_Tarpaulin_Charges: data.trip_settlement_info.rjso_tarpaulin_charges,
        RJ_Weighment_Charges: data.trip_settlement_info.rjso_weighment_charges,
        RJ_Unloading_Charges: data.trip_settlement_info.rjso_unloading_charges,
        RJ_Misc_Charges: data.trip_settlement_info.rjso_misc_charges,
        RJ_Munic_Charges: data.trip_settlement_info.rjso_munic_charges,
        RJ_Halt_Charges: data.trip_settlement_info.rjso_halt_charges,
        RJ_ED_Charges: data.trip_settlement_info.rjso_en_diesel_charges,
        FCI_AttiCooli_Charges: data.trip_settlement_info.fci_atti_cooli_charges,
        FCI_Extra_Charges: data.trip_settlement_info.fci_extra_charges,
        FCI_OfficeExpense_Charges: data.trip_settlement_info.fci_office_exp_charges,
        FCI_GateExpense_Charges: data.trip_settlement_info.fci_gate_exp_charges,
        FCI_Weighment_Charges: data.trip_settlement_info.fci_weighment_charges,
        Driver_Expense: data.trip_settlement_info.driver_expense,
        Trip_Expense: data.trip_settlement_info.expense,
        Halt_Days: data.trip_settlement_info.halt_days,
        Driver_Advance_Sap_Document_No: data.advance_payment_info ? data.advance_payment_info.document_no : '-',
        Diesel_Vendor_Sap_Document_No: data.diesel_intent_info ? data.diesel_intent_info.diesel_vendor_sap_invoice_no : '-',
        Total_Freight_Expense_Sap_Document_No: data.advance_payment_info ? data.advance_payment_info.sap_freight_payment_document_no : '-',
        Bank_Expense_Sap_Document_No: data.advance_payment_info ? data.advance_payment_info.sap_bank_payment_document_no : '-',
        Diesel_Expense_Sap_Document_No: data.advance_payment_info ? data.advance_payment_info.sap_diesel_payment_document_no : '-',
        Trip_Expense_Sap_Document_No: data.trip_settlement_info.expense_sap_document_no,
        Trip_Expense_Posting_Date: data.trip_settlement_info.expense_posting_date,
        TDS_Having: data.trip_settlement_info.tds_having,
        TDS_Type: data.trip_settlement_info.tds_type,
        SAP_Remarks: data.trip_settlement_info.sap_text,
        GST_Tax_Type: data.trip_settlement_info.gst_tax_type,
        Expense_Remarks: data.trip_settlement_info.remarks,
        Expense_Closure_Clearance_Date: data.trip_settlement_info.created_date,
        Trip_Income_Remarks: data.trip_settlement_info.income_remarks,
        Expense_Closure_Cleared_By: data.trip_settlement_info.created_by,
        Trip_Settlement_Remarks: data.trip_settlement_info.income_remarks,
        Trip_Income_Amount: data.trip_settlement_info.income,
        Status: closureStatus(data.trip_settlement_info.tripsheet_is_settled),
        /* =========== Settlement Additional Fields Start =========== */
        Settlement_Closure_Cleared_By: data.trip_settlement_info.settled_by,
        Trip_Settlement_Remarks: data.trip_settlement_info.settlement_remarks,
        Trip_MMD_Income_Amount: mmdIncomeCalculate(data),
        Trip_NLFD_Income_Amount: nlfdIncomeCalculate(data),
        Trip_NLCD_Income_Amount: nlcdIncomeCalculate(data),
        Trip_RJSO_Income_Amount: rjsoIncomeCalculate(data),
        Trip_NLFD_Income_Sap_Document_No: data.trip_settlement_info.income_nlfd_sap_document_no,
        Trip_NLCD_Income_Sap_Document_No: data.trip_settlement_info.income_nlcd_sap_document_no,
        Trip_RJSO_Income_Sap_Document_No: data.trip_settlement_info.income_rj_sap_document_no,
        Trip_MMD_Income_Sap_Document_No: data.trip_settlement_info.income_mmd_sap_document_no,
        Trip_MMD_Income_Sap_TDS_Document_No: data.trip_settlement_info.income_mmd_tds_sap_document_no,
        /* ========== Base Freight Income Documents Fields Start ========== */
        NLFD_BASE_DOC : incomeBaseDocFinder(data.trip_settlement_info.sap_income_info,1),
        NLCD_BASE_DOC : incomeBaseDocFinder(data.trip_settlement_info.sap_income_info,2),
        NLMMD_BASE_DOC : incomeBaseDocFinder(data.trip_settlement_info.sap_income_info,3),
        NLIF_BASE_DOC : incomeBaseDocFinder(data.trip_settlement_info.sap_income_info,4),
        NLMD_BASE_DOC : incomeBaseDocFinder(data.trip_settlement_info.sap_income_info,5),
        NLDV_BASE_DOC : incomeBaseDocFinder(data.trip_settlement_info.sap_income_info,6),
        NLSD_BASE_DOC : incomeBaseDocFinder(data.trip_settlement_info.sap_income_info,7),
        /* ========== Base Freight Income Documents Fields End ========== */
        /* ========== Additional Freight Income Documents Fields Start ========== */
        NLFD_ADD_DOC : incomeAddDocFinder(data.trip_settlement_info.sap_income_info,8),
        NLCD_ADD_DOC : incomeAddDocFinder(data.trip_settlement_info.sap_income_info,9),
        NLMMD_ADD_DOC : incomeAddDocFinder(data.trip_settlement_info.sap_income_info,10),
        NLIF_ADD_DOC : incomeAddDocFinder(data.trip_settlement_info.sap_income_info,11),
        NLMD_ADD_DOC : incomeAddDocFinder(data.trip_settlement_info.sap_income_info,12),
        NLDV_ADD_DOC : incomeAddDocFinder(data.trip_settlement_info.sap_income_info,13),
        NLSD_ADD_DOC : incomeAddDocFinder(data.trip_settlement_info.sap_income_info,14),
        /* ========== Additional Freight Income Documents Fields End ========== */
        Trip_Income_Posting_Date: data.trip_settlement_info.income_posting_date,
        Trip_Profit_Loss : data.trip_settlement_info.profit_and_loss,
        Settlement_Closure_Clearance_Date: data.trip_settlement_info.settled_date,
        /* =========== Settlement Additional Fields End =========== */
      })
    })
  }
  return rowDataList
}
