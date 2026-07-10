import React, { useState, useEffect } from 'react'
import { CButton, CCard,CCol,CRow, CContainer, CFormLabel } from '@coreui/react'
import { Link } from 'react-router-dom'
import CustomTable from 'src/components/customComponent/CustomTable'
import Loader from 'src/components/Loader'
import TripSheetClosureService from 'src/Service/TripSheetClosure/TripSheetClosureService'
import * as XLSX from 'xlsx';
import FileSaver from 'file-saver'
import AccessDeniedComponent from 'src/components/commoncomponent/AccessDeniedComponent'
import JavascriptInArrayComponent from 'src/components/commoncomponent/JavascriptInArrayComponent'
import * as LogisticsProScreenNumberConstants from 'src/components/constants/LogisticsProScreenNumberConstants'
import { GetDateTimeFormat } from '../Depo/CommonMethods/CommonMethods'
import { DateRangePicker } from 'rsuite'
import { toast } from 'react-toastify'
import DieselVendorMasterService from 'src/Service/Master/DieselVendorMasterService'

const TSExpenseClosureHome = () => {
  /*================== User Location Fetch ======================*/
  const user_info_json = localStorage.getItem('user_info')
  const user_info = JSON.parse(user_info_json)
  const user_locations = []
  const user_vehicle_types = []

  /* Get User Locations From Local Storage */
  user_info.location_info.map((data, index) => {
    user_locations.push(data.id)
  })

  /* Get User Vehicle Types From Local Storage */
  user_info.vehicle_type_info.map((data, index) => {
    user_vehicle_types.push(data.id)
  })

  // console.log(user_locations)
  /*================== User Location Fetch ======================*/

  /* ==================== Access Part Start ========================*/
  const [screenAccess, setScreenAccess] = useState(false)
  let page_no = LogisticsProScreenNumberConstants.TripSettlementScreens.Tripsheet_Expense_Closure

  useEffect(()=>{

    if(user_info.is_admin == 1 || JavascriptInArrayComponent(page_no,user_info.page_permissions)){
      console.log('screen-access-allowed')
      setScreenAccess(true)
    } else{
      console.log('screen-access-not-allowed')
      setScreenAccess(false)
    }

  },[])
  /* ==================== Access Part End ========================*/

  const [rowData, setRowData] = useState([])
  const [pending, setPending] = useState(true)
  const [fetch, setFetch] = useState(false)
  const [dvData, setDvData] = useState([])
  let tableData = []
  let closureData = []

  const getDateTime = (myDateTime, type=0) => {
    let myTime = '-'
    if(type == 1){
      myTime = new Date(myDateTime).toLocaleTimeString('en-US',{ hour: '2-digit', minute: '2-digit' });
    } else if(type == 2){
      myTime = new Date(myDateTime).toLocaleDateString('en-US',{ month: 'short', year: 'numeric' });
    } else {
      myTime = new Date(myDateTime).toLocaleString('en-US');
    }
    
    return myTime
  }

  const exportToCSV = () => {
    let dateTimeString = GetDateTimeFormat(1)
    let fileName='ExpenseClosureScreen_'+dateTimeString
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';
    const ws = XLSX.utils.json_to_sheet(rowData);
    const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], {type: fileType});
    FileSaver.saveAs(data, fileName + fileExtension);
  }
  const ACTION = {
    GATE_IN: 1,
    GATE_OUT: 2,
    WAIT_OUTSIDE: 0,
  }

  const tripBalanceFreight = (a1,a2,a3) => {
    let balance = 0
    let total_freight = Number(parseFloat(a1).toFixed(2))
    let bank_advance = Number(parseFloat(a2).toFixed(2))
    let diesel_advance = Number(parseFloat(a3).toFixed(2))
    balance =  total_freight - ( bank_advance + diesel_advance )
    return Number(parseFloat(balance).toFixed(2))
  }

  /* Vehicle Current Position */
  const VEHICLE_CURRENT_POSITION = {
    TRIPSHEET_CREATED: 16,
    ADVANCE_CREATED: 18,
    NLFD_SHIPMENT_COMPLETED: 22,
    NLCD_SHIPMENT_COMPLETED: 25,
    DIESEL_INDENT_CREATION_COMPLETED: 37,
    DIESEL_INDENT_CONFIRMATION_COMPLETED: 39,
    DIESEL_INDENT_APPROVAL_COMPLETED: 41,
    INCOME_CLOSURE_REJECTED: 261,
  }

  /* Vehicle Current Parking Status */
  const VEHICLE_CURRENT_PARKING_STATUS = {
    HIRE_RMSTO_GATEOUT: 9,
    HIRE_FGSTO_NLFD_GATEOUT: 10,
    HIRE_FGSALES_NLCD_GATEOUT: 13,
    HIRE_FGSTO_NLCD_GATEOUT: 14,
    HIRE_FGSALES_NLFD_GATEOUT: 17,
    AFTER_DELIVERY_GATEIN: 19,
    HIRE_OTHERS_GATEOUT: 21,
  }

  function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [day, month, year].join('-');
  }

  /* Set Default Date (Today) in a Variable State */
  const ddd = new Date(); 
  // ddd.setMonth(ddd.getMonth() - 1);
  ddd.setDate(ddd.getDate() - 10);
  const [defaultDate, setDefaultDate] = React.useState([
    new Date(ddd),
    // new Date(getCurrentDate('-')),
    new Date(getCurrentDate('-')),
  ])

  function getCurrentDate(separator = '') {
    let newDate = new Date()
    let date = newDate.getDate()
    let month = newDate.getMonth() + 1
    let year = newDate.getFullYear()

    return `${year}${separator}${month < 10 ? `0${month}` : `${month}`}${separator}${
      date < 10 ? `0${date}` : `${date}`
    }`
  }

  useEffect(() => {
    console.log(defaultDate)
    if (defaultDate) {
      setDefaultDate(defaultDate)
    } else {
    }
  }, [defaultDate])

  const getDieselVendorNameById = (vendor_id) => {

    console.log(dvData,'dieselVendorFinder-dvData')
    console.log(vendor_id,'dieselVendorFinder-vendor_id')
    let vendorName = '-'
    for (let i = 0; i < dvData.length; i++) {
      if (dvData[i].diesel_vendor_id == vendor_id) {
        vendorName = dvData[i].diesel_vendor_name
      }
    }
    console.log(vendorName,'dieselVendorFinder-vendorName')
    return vendorName

    // let driverName = code == '1' ? 'RNS Fuel Station' : 'RS Petroleum'
    // return driverName
  }

  const getClosureVehiclesData = (fresh_type = '') => {
    if (fresh_type !== '1') {
      TripSheetClosureService.getVehicleReadyToTripClose().then((res) => {
        closureData = res.data.data
        console.log(closureData)
        setFetch(true)

        let rowDataList = []
        const filterData1 = closureData.filter(
          (data) =>
            user_locations.indexOf(data.vehicle_location_id) != -1 &&
            user_vehicle_types.indexOf(data.vehicle_type_id.id) != -1
        )

        const filterData = filterData1.filter(
          (data) =>
          (
            /* Hire Vehicles After Tripsheet Creation for FG-STO (If Advance & Diesel 0 Given) */
            (
              data.vehicle_current_position == VEHICLE_CURRENT_POSITION.TRIPSHEET_CREATED &&
              (data.parking_status == VEHICLE_CURRENT_PARKING_STATUS.HIRE_FGSTO_NLCD_GATEOUT || data.parking_status == VEHICLE_CURRENT_PARKING_STATUS.HIRE_FGSTO_NLFD_GATEOUT) &&
              data.trip_sheet_info.trip_advance_eligiblity == 1 &&
              data.trip_sheet_info.advance_amount == 0 &&
              data.trip_sheet_info.advance_payment_diesel == 0 &&
              data.trip_sheet_info.advance_status == 0
            )
          ) ||
          (
            /* Hire Vehicles After Advance Creation or Diesel Indent Approval for FG-STO (If Advance & Diesel Both Given / Diesel Only Given) */
            (
              (data.vehicle_current_position == VEHICLE_CURRENT_POSITION.ADVANCE_CREATED || data.vehicle_current_position == VEHICLE_CURRENT_POSITION.DIESEL_INDENT_APPROVAL_COMPLETED) &&
              (data.parking_status == VEHICLE_CURRENT_PARKING_STATUS.HIRE_FGSTO_NLCD_GATEOUT || data.parking_status == VEHICLE_CURRENT_PARKING_STATUS.HIRE_FGSTO_NLFD_GATEOUT) &&
              data.trip_sheet_info.trip_advance_eligiblity == 1 &&
              data.trip_sheet_info.advance_payment_diesel != 0 &&
              data.trip_sheet_info.advance_status == 1 &&
              data.advance_payment_info &&
              data.advance_payment_info.sap_diesel_payment_document_no != null &&
              data.advance_payment_info.sap_freight_payment_document_no != null &&
              data.diesel_intent_info &&
              data.diesel_intent_info.diesel_vendor_sap_invoice_no != null
            )
          ) ||
          (
            /* Hire Vehicles After Advance Creation for FG-STO (If Advance only Given) */
            (
              data.vehicle_current_position == VEHICLE_CURRENT_POSITION.ADVANCE_CREATED &&
              (data.parking_status == VEHICLE_CURRENT_PARKING_STATUS.HIRE_FGSTO_NLCD_GATEOUT || data.parking_status == VEHICLE_CURRENT_PARKING_STATUS.HIRE_FGSTO_NLFD_GATEOUT) &&
              data.trip_sheet_info.trip_advance_eligiblity == 1 &&
              data.trip_sheet_info.advance_payment_diesel == 0 &&
              data.trip_sheet_info.advance_status == 1 &&
              data.advance_payment_info &&
              data.advance_payment_info.sap_freight_payment_document_no != null
            )
          ) ||
          (
            /* Hire Vehicles After Shipment Completion for FG-SALES (If Advance & Diesel 0 Given) */
            (
              (data.vehicle_current_position == VEHICLE_CURRENT_POSITION.NLFD_SHIPMENT_COMPLETED || data.vehicle_current_position == VEHICLE_CURRENT_POSITION.NLCD_SHIPMENT_COMPLETED) &&
              (data.parking_status == VEHICLE_CURRENT_PARKING_STATUS.HIRE_FGSALES_NLFD_GATEOUT || data.parking_status == VEHICLE_CURRENT_PARKING_STATUS.HIRE_FGSALES_NLCD_GATEOUT) &&
              data.trip_sheet_info.trip_advance_eligiblity == 1 &&
              data.trip_sheet_info.advance_amount == 0 &&
              data.trip_sheet_info.advance_payment_diesel == 0 &&
              data.trip_sheet_info.advance_status == 0
            )
          ) ||
          (
            /* Hire Vehicles After Advance Creation or Diesel Indent Approval for FG-SALES & Others (If Advance & Diesel Both Given / Diesel Only Given) */
            (
              (data.vehicle_current_position == VEHICLE_CURRENT_POSITION.ADVANCE_CREATED || data.vehicle_current_position == VEHICLE_CURRENT_POSITION.DIESEL_INDENT_APPROVAL_COMPLETED) &&
              (data.parking_status == VEHICLE_CURRENT_PARKING_STATUS.HIRE_FGSALES_NLFD_GATEOUT || data.parking_status == VEHICLE_CURRENT_PARKING_STATUS.HIRE_FGSALES_NLCD_GATEOUT || data.parking_status == VEHICLE_CURRENT_PARKING_STATUS.HIRE_OTHERS_GATEOUT) &&
              data.trip_sheet_info.trip_advance_eligiblity == 1 &&
              data.trip_sheet_info.advance_payment_diesel != 0 &&
              data.trip_sheet_info.advance_status == 1 &&
              data.advance_payment_info &&
              data.advance_payment_info.sap_diesel_payment_document_no != null &&
              data.advance_payment_info.sap_freight_payment_document_no != null &&
              data.diesel_intent_info &&
              data.diesel_intent_info.diesel_vendor_sap_invoice_no != null
            )
          ) ||
          (
            /* Hire Vehicles After Advance Creation for FG-SALES & Others (If Advance only Given) */
            (
              data.vehicle_current_position == VEHICLE_CURRENT_POSITION.ADVANCE_CREATED &&
              (data.parking_status == VEHICLE_CURRENT_PARKING_STATUS.HIRE_FGSALES_NLFD_GATEOUT || data.parking_status == VEHICLE_CURRENT_PARKING_STATUS.HIRE_FGSALES_NLCD_GATEOUT || data.parking_status == VEHICLE_CURRENT_PARKING_STATUS.HIRE_OTHERS_GATEOUT) &&
              data.trip_sheet_info.trip_advance_eligiblity == 1 &&
              data.trip_sheet_info.advance_payment_diesel == 0 &&
              data.trip_sheet_info.advance_status == 1 &&
              data.advance_payment_info &&
              data.advance_payment_info.sap_freight_payment_document_no != null
            )
          )  ||
          (
            /* Hire Vehicles After Tripsheet Creation for RMSTO & Others */
            (
              data.vehicle_current_position == VEHICLE_CURRENT_POSITION.TRIPSHEET_CREATED &&
              (data.parking_status == VEHICLE_CURRENT_PARKING_STATUS.HIRE_RMSTO_GATEOUT || data.parking_status == VEHICLE_CURRENT_PARKING_STATUS.HIRE_OTHERS_GATEOUT) &&
              (data.trip_sheet_info.trip_advance_eligiblity == null || data.trip_sheet_info.trip_advance_eligiblity == 0) &&
              data.trip_sheet_info.advance_amount == null &&
              data.trip_sheet_info.advance_payment_diesel == null &&
              data.trip_sheet_info.advance_status == 0
            )
          ) ||
          (
            /* Hire Vehicles After Tripsheet Creation for RMSTO */
            (
              data.vehicle_current_position == VEHICLE_CURRENT_POSITION.TRIPSHEET_CREATED &&
              data.parking_status == VEHICLE_CURRENT_PARKING_STATUS.HIRE_RMSTO_GATEOUT &&
              (data.trip_sheet_info.trip_advance_eligiblity == null || data.trip_sheet_info.trip_advance_eligiblity == 0) &&
              data.trip_sheet_info.advance_amount == null &&
              data.trip_sheet_info.advance_payment_diesel == null &&
              data.trip_sheet_info.advance_status == 0
            )
          ) ||
          (
            /* Hire Vehicles After Tripsheet Creation for Others */
            (
              data.vehicle_current_position == VEHICLE_CURRENT_POSITION.TRIPSHEET_CREATED &&
              data.parking_status == VEHICLE_CURRENT_PARKING_STATUS.HIRE_OTHERS_GATEOUT && 
              data.trip_sheet_info.advance_amount == 0 &&
              data.trip_sheet_info.advance_payment_diesel == 0 &&
              data.trip_sheet_info.advance_status == 0
            )
          ) ||
          (
            /* Own/Contract Vehicles After Diesel Indent Creation/Completion/Approval Scenario */
            (
              (data.vehicle_current_position == VEHICLE_CURRENT_POSITION.DIESEL_INDENT_CREATION_COMPLETED || data.vehicle_current_position == VEHICLE_CURRENT_POSITION.DIESEL_INDENT_CONFIRMATION_COMPLETED || data.vehicle_current_position == VEHICLE_CURRENT_POSITION.DIESEL_INDENT_APPROVAL_COMPLETED) &&
              data.parking_status == VEHICLE_CURRENT_PARKING_STATUS.AFTER_DELIVERY_GATEIN &&
              ((data.trip_sheet_info.purpose == 3 || data.trip_sheet_info.purpose == 4 || data.trip_sheet_info.purpose == 5) || ( data.trip_sheet_info.trip_advance_eligiblity == 1 &&
              data.trip_sheet_info.advance_status == 1)) &&
              data.tripsheet_open_status != 2 &&
              !data.trip_settlement_info
            )
          )
        )

        filterData.map((data, index) => {
          rowDataList.push({
            sno: index + 1,
            Tripsheet_No: data.trip_sheet_info.trip_sheet_no,
            Tripsheet_Date: data.trip_sheet_info.created_date,
            Tripsheet_Month: getDateTime(data.trip_sheet_info.created_at,2), 
            TIC_Status : data.tic_parent_info && data.tic_parent_info.status == '6' ? 'Completed' : 'Not Completed',
            Vehicle_Type: data.vehicle_type_id.type,
            Division: data.trip_sheet_info && data.trip_sheet_info.to_divison == '2' ? 'NLCD' : (data.trip_sheet_info.purpose == '4' ? '-' : 'NLFD'),
            Vehicle_No: data.vehicle_number,
            Driver_Name: data.driver_name,
            Driver_Mobile_No: data.driver_contact_number,
            Vendor_Code: data.vehicle_type_id.id == 3 ? (data.vendor_info ? data.vendor_info.vendor_code : '-') : '-',
            Vendor_Name: data.vehicle_type_id.id == 3 ? (data.vendor_info ? data.vendor_info.owner_name : '-') : '-',          
            Vendor_Mobile_No: data.vehicle_type_id.id == 3 ? (data.vendor_info ? data.vendor_info.owner_number : '-') : '-',
            Vendor_PAN_No: data.vehicle_type_id.id == 3 ? (data.vendor_info ? data.vendor_info.pan_card_number : '-') : '-',
            Vendor_Town: data.vehicle_type_id.id == 3 ? (data.vendor_info ? (data.vendor_info.city ? data.vendor_info.city : '-') : '-') : '-',
            Previous_Status: (
              // <span className="badge rounded-pill bg-info">
                (data.vehicle_current_position ==
                  VEHICLE_CURRENT_POSITION.DIESEL_INDENT_APPROVAL_COMPLETED &&
                  data.parking_status == VEHICLE_CURRENT_PARKING_STATUS.AFTER_DELIVERY_GATEIN) ||
                (data.vehicle_current_position ==
                  VEHICLE_CURRENT_POSITION.DIESEL_INDENT_APPROVAL_COMPLETED &&
                  (data.parking_status == VEHICLE_CURRENT_PARKING_STATUS.HIRE_FGSTO_NLCD_GATEOUT ||
                    data.parking_status == VEHICLE_CURRENT_PARKING_STATUS.HIRE_FGSTO_NLFD_GATEOUT ||
                    data.parking_status == VEHICLE_CURRENT_PARKING_STATUS.HIRE_FGSALES_NLFD_GATEOUT ||
                    data.parking_status == VEHICLE_CURRENT_PARKING_STATUS.HIRE_FGSALES_NLCD_GATEOUT))
                  ? 'DI APPROVAL ✔️'
                  : data.vehicle_current_position == VEHICLE_CURRENT_POSITION.ADVANCE_CREATED &&
                    (data.parking_status == VEHICLE_CURRENT_PARKING_STATUS.HIRE_FGSTO_NLCD_GATEOUT ||
                      data.parking_status == VEHICLE_CURRENT_PARKING_STATUS.HIRE_FGSTO_NLFD_GATEOUT ||
                      data.parking_status ==
                        VEHICLE_CURRENT_PARKING_STATUS.HIRE_FGSALES_NLFD_GATEOUT ||
                      data.parking_status == VEHICLE_CURRENT_PARKING_STATUS.HIRE_FGSALES_NLCD_GATEOUT || data.parking_status == VEHICLE_CURRENT_PARKING_STATUS.HIRE_OTHERS_GATEOUT)
                  ? 'ADVANCE ✔️'
                  : data.vehicle_current_position == VEHICLE_CURRENT_POSITION.TRIPSHEET_CREATED &&
                    data.parking_status == VEHICLE_CURRENT_PARKING_STATUS.HIRE_RMSTO_GATEOUT
                  ? 'RMSTO ✔️'
                  : data.vehicle_current_position == VEHICLE_CURRENT_POSITION.TRIPSHEET_CREATED &&
                    data.parking_status == VEHICLE_CURRENT_PARKING_STATUS.HIRE_OTHERS_GATEOUT
                  ? 'OTHERS ✔️'
                  : data.vehicle_current_position == VEHICLE_CURRENT_POSITION.TRIPSHEET_CREATED &&
                    data.parking_status == VEHICLE_CURRENT_PARKING_STATUS.HIRE_FGSTO_NLCD_GATEOUT
                  ? 'FGSTO - NLCD ✔️'
                  : data.vehicle_current_position == VEHICLE_CURRENT_POSITION.TRIPSHEET_CREATED &&
                    data.parking_status == VEHICLE_CURRENT_PARKING_STATUS.HIRE_FGSTO_NLFD_GATEOUT
                  ? 'FGSTO - NLFD ✔️'
                  : data.vehicle_current_position ==
                      VEHICLE_CURRENT_POSITION.NLCD_SHIPMENT_COMPLETED &&
                    data.parking_status == VEHICLE_CURRENT_PARKING_STATUS.HIRE_FGSALES_NLCD_GATEOUT
                  ? 'FGSALES - NLCD ✔️'
                  : data.vehicle_current_position ==
                      VEHICLE_CURRENT_POSITION.NLFD_SHIPMENT_COMPLETED &&
                    data.parking_status == VEHICLE_CURRENT_PARKING_STATUS.HIRE_FGSALES_NLFD_GATEOUT
                  ? 'FGSALES - NLFD ✔️'
                  : data.vehicle_current_position == ACTION.VEHICLE_MAINTENANCE_ENDED
                  ? 'VM Completed'
                  : data.vehicle_current_position ==
                      VEHICLE_CURRENT_POSITION.INCOME_CLOSURE_REJECTED &&
                    data.trip_settlement_info.rejected_by == '2'
                  ? 'SETTLEMENT ❌'
                  : data.vehicle_current_position ==
                      VEHICLE_CURRENT_POSITION.INCOME_CLOSURE_REJECTED &&
                    data.trip_settlement_info.rejected_by == '1'
                  ? 'INCOME ❌'
                  : data.vehicle_current_position ==
                      VEHICLE_CURRENT_POSITION.DIESEL_INDENT_CREATION_COMPLETED &&
                    data.parking_status == VEHICLE_CURRENT_PARKING_STATUS.AFTER_DELIVERY_GATEIN
                  ? 'DI CREATION ✔️'
                  : data.vehicle_current_position ==
                      VEHICLE_CURRENT_POSITION.DIESEL_INDENT_CONFIRMATION_COMPLETED &&
                    data.parking_status == VEHICLE_CURRENT_PARKING_STATUS.AFTER_DELIVERY_GATEIN
                  ? 'DI CONFIRMATION ✔️'
                  : 'Gate Out'
              // </span>
            ),
            Waiting_At: 'Expense Closure',
            /* New Fields Start */
            HV_Freight_Amount: data.vehicle_type_id.id == 3 ? (data.advance_payment_info ? data.advance_payment_info.actual_freight : '-') : '-', 
            HV_Freight_DOC_No: data.vehicle_type_id.id == 3 ? (data.advance_payment_info ? data.advance_payment_info.sap_freight_payment_document_no : '-') : '-', 
            HV_Freight_DOC_Date: data.vehicle_type_id.id == 3 ? (data.advance_payment_info ? formatDate(data.advance_payment_info.sap_invoice_posting_date) : '-') : '-', 
            Advance_Eligibility: data.advance_payment_info ? (data.vehicle_type_id.id == 3 && (data.advance_payment_info.advance_payment != 0 || data.advance_payment_info.advance_payment != 0) ? 'Yes' : 'No'): 'No',
            HV_Bank_Advance_Amount: data.vehicle_type_id.id == 3 ? (data.advance_payment_info ? data.advance_payment_info.advance_payment : '-') : '-', 
            HV_Bank_Advance_Doc_No: data.vehicle_type_id.id == 3 ? (data.advance_payment_info ? data.advance_payment_info.sap_bank_payment_document_no : '-') : '-', 
            HV_Bank_Advance_Doc_Date: data.vehicle_type_id.id == 3 ? (data.advance_payment_info ? formatDate(data.advance_payment_info.sap_invoice_posting_date) : '-') : '-', 
            HV_Diesel_Advance_amount: data.vehicle_type_id.id == 3 ? (data.advance_payment_info ? data.advance_payment_info.advance_payment_diesel : '-') : '-', 
            HV_Diesle_Advance_Doc_No: data.vehicle_type_id.id == 3 ? (data.advance_payment_info ? data.advance_payment_info.sap_diesel_payment_document_no : '-') : '-', 
            HV_Diesel_Advance_Doc_Date: data.vehicle_type_id.id == 3 ? (data.advance_payment_info ? formatDate(data.advance_payment_info.sap_invoice_posting_date) : '-') : '-',  
            HV_Balance_Amount_To_Pay: data.vehicle_type_id.id == 3 ? (data.advance_payment_info ? tripBalanceFreight(data.advance_payment_info.actual_freight,data.advance_payment_info.advance_payment,data.advance_payment_info.advance_payment_diesel) : '-') : '-', 
            Own_Driver_Advance_Amount: data.vehicle_type_id.id != 3 ? (data.advance_payment_info ? data.advance_payment_info.advance_payment : '-') : '-', 
            Own_Driver_Advance_Document_No: data.vehicle_type_id.id != 3 ? (data.advance_payment_info ? data.advance_payment_info.document_no : '-') : '-', 
            Own_Driver_Advance_Document_Date: data.vehicle_type_id.id != 3 ? (data.advance_payment_info ? formatDate(data.advance_payment_info.sap_invoice_posting_date) : '-') : '-', 
            Own_Driver_Additional_Advance_Amount: data.vehicle_type_id.id != 3 ? (data.advance_payment_info ? data.advance_payment_info.additional_advance_payment : '-') : '-', 
            Own_Driver_Additional_Advance_Document_No: data.vehicle_type_id.id != 3 ? (data.advance_payment_info ? data.advance_payment_info.additional_advance_document_no : '-') : '-', 
            Own_Driver_Additional_Advance_Document_Date: data.vehicle_type_id.id != 3 ? (data.advance_payment_info ? formatDate(data.advance_payment_info.additional_advance_sap_invoice_posting_date) : '-') : '-', 
            // Diesel_Bunk_Name: data.diesel_intent_info ? (data.diesel_intent_info.diesel_vendor_id == 1 ? 'RNS Fuel Station' : 'RS Petroleum') : '-',
            Diesel_Bunk_Name: data.diesel_intent_info ? getDieselVendorNameById (data.diesel_intent_info.diesel_vendor_id) : '-',
            // Diesel_Approval_Date: data.diesel_intent_info ? data.diesel_intent_info.sap_diesel_date : '-',
            Diesel_Amount: data.diesel_intent_info ? data.diesel_intent_info.total_amount : '-',
            Diesel_Bunk_Invoice_No: data.diesel_intent_info ? data.diesel_intent_info.invoice_no : '-',
            Diesel_Debit_Note_Doc_No: data.diesel_intent_info ? data.diesel_intent_info.diesel_vendor_sap_invoice_no : '-',
            Diesel_Debit_Note_Doc_Date: data.diesel_intent_info ? data.diesel_intent_info.sap_diesel_date : '-',        
            Tripsheet_Created_By: data.trip_sheet_info && data.trip_sheet_info.trip_user_info ? data.trip_sheet_info.trip_user_info.emp_name : '-',
            TSC_User_Division: data.trip_sheet_info && data.trip_sheet_info.trip_user_info && data.trip_sheet_info.trip_user_info.user_division_info ? data.trip_sheet_info.trip_user_info.user_division_info.division : '-',
            TSC_User_Department: data.trip_sheet_info && data.trip_sheet_info.trip_user_info && data.trip_sheet_info.trip_user_info.user_department_info ? data.trip_sheet_info.trip_user_info.user_department_info.department : '-',
            Shed_Name: data.vehicle_type_id.id == 3 ? (data.vendor_info && data.vendor_info.shed_info ? data.vendor_info.shed_info.shed_name : '-') : '-',
            Shed_Mobile_No: data.vehicle_type_id.id == 3 ? (data.vendor_info && data.vendor_info.shed_info ? data.vendor_info.shed_info.shed_owner_phone_1 : '-') : '-',
            /* New Fields End */
            Trip_Remarks: data.trip_remarks ? data.trip_remarks : '-',
            Screen_Duration: data.vehicle_current_position_updated_time,
            Overall_Duration: data.created_at,
            Action: (
              <CButton className="badge" color="warning">
                <Link className="text-white" to={`/TSExpenseCapture/${data.parking_yard_gate_id}`}>
                  Expense Closure
                </Link>
              </CButton>
            ),
          })
        })
        setRowData(rowDataList)
        setPending(false)
      })
    } else {
      if (defaultDate == null) {
        setFetch(true)
        toast.warning('Date Filter Should not be empty..!')
        return false
      } 
      let report_form_data = new FormData()
      report_form_data.append('date_between', defaultDate) 
      console.log(defaultDate, 'defaultDate') 

      TripSheetClosureService.getVehicleReadyToTripCloseFilterSearch(report_form_data).then((res) => {
        closureData = res.data.data
        console.log(closureData)
        setFetch(true)

        let rowDataList = []
        const filterData1 = closureData.filter(
          (data) =>
            user_locations.indexOf(data.vehicle_location_id) != -1 &&
            user_vehicle_types.indexOf(data.vehicle_type_id.id) != -1
        )

        const filterData = filterData1.filter(
          (data) =>
          (
            /* Hire Vehicles After Tripsheet Creation for FG-STO (If Advance & Diesel 0 Given) */
            (
              data.vehicle_current_position == VEHICLE_CURRENT_POSITION.TRIPSHEET_CREATED &&
              (data.parking_status == VEHICLE_CURRENT_PARKING_STATUS.HIRE_FGSTO_NLCD_GATEOUT || data.parking_status == VEHICLE_CURRENT_PARKING_STATUS.HIRE_FGSTO_NLFD_GATEOUT) &&
              data.trip_sheet_info.trip_advance_eligiblity == 1 &&
              data.trip_sheet_info.advance_amount == 0 &&
              data.trip_sheet_info.advance_payment_diesel == 0 &&
              data.trip_sheet_info.advance_status == 0
            )
          ) ||
          (
            /* Hire Vehicles After Advance Creation or Diesel Indent Approval for FG-STO (If Advance & Diesel Both Given / Diesel Only Given) */
            (
              (data.vehicle_current_position == VEHICLE_CURRENT_POSITION.ADVANCE_CREATED || data.vehicle_current_position == VEHICLE_CURRENT_POSITION.DIESEL_INDENT_APPROVAL_COMPLETED) &&
              (data.parking_status == VEHICLE_CURRENT_PARKING_STATUS.HIRE_FGSTO_NLCD_GATEOUT || data.parking_status == VEHICLE_CURRENT_PARKING_STATUS.HIRE_FGSTO_NLFD_GATEOUT) &&
              data.trip_sheet_info.trip_advance_eligiblity == 1 &&
              data.trip_sheet_info.advance_payment_diesel != 0 &&
              data.trip_sheet_info.advance_status == 1 &&
              data.advance_payment_info &&
              data.advance_payment_info.sap_diesel_payment_document_no != null &&
              data.advance_payment_info.sap_freight_payment_document_no != null &&
              data.diesel_intent_info &&
              data.diesel_intent_info.diesel_vendor_sap_invoice_no != null
            )
          ) ||
          (
            /* Hire Vehicles After Advance Creation for FG-STO (If Advance only Given) */
            (
              data.vehicle_current_position == VEHICLE_CURRENT_POSITION.ADVANCE_CREATED &&
              (data.parking_status == VEHICLE_CURRENT_PARKING_STATUS.HIRE_FGSTO_NLCD_GATEOUT || data.parking_status == VEHICLE_CURRENT_PARKING_STATUS.HIRE_FGSTO_NLFD_GATEOUT) &&
              data.trip_sheet_info.trip_advance_eligiblity == 1 &&
              data.trip_sheet_info.advance_payment_diesel == 0 &&
              data.trip_sheet_info.advance_status == 1 &&
              data.advance_payment_info &&
              data.advance_payment_info.sap_freight_payment_document_no != null
            )
          ) ||
          (
            /* Hire Vehicles After Shipment Completion for FG-SALES (If Advance & Diesel 0 Given) */
            (
              (data.vehicle_current_position == VEHICLE_CURRENT_POSITION.NLFD_SHIPMENT_COMPLETED || data.vehicle_current_position == VEHICLE_CURRENT_POSITION.NLCD_SHIPMENT_COMPLETED) &&
              (data.parking_status == VEHICLE_CURRENT_PARKING_STATUS.HIRE_FGSALES_NLFD_GATEOUT || data.parking_status == VEHICLE_CURRENT_PARKING_STATUS.HIRE_FGSALES_NLCD_GATEOUT) &&
              data.trip_sheet_info.trip_advance_eligiblity == 1 &&
              data.trip_sheet_info.advance_amount == 0 &&
              data.trip_sheet_info.advance_payment_diesel == 0 &&
              data.trip_sheet_info.advance_status == 0
            )
          ) ||
          (
            /* Hire Vehicles After Advance Creation or Diesel Indent Approval for FG-SALES & Others (If Advance & Diesel Both Given / Diesel Only Given) */
            (
              (data.vehicle_current_position == VEHICLE_CURRENT_POSITION.ADVANCE_CREATED || data.vehicle_current_position == VEHICLE_CURRENT_POSITION.DIESEL_INDENT_APPROVAL_COMPLETED) &&
              (data.parking_status == VEHICLE_CURRENT_PARKING_STATUS.HIRE_FGSALES_NLFD_GATEOUT || data.parking_status == VEHICLE_CURRENT_PARKING_STATUS.HIRE_FGSALES_NLCD_GATEOUT || data.parking_status == VEHICLE_CURRENT_PARKING_STATUS.HIRE_OTHERS_GATEOUT) &&
              data.trip_sheet_info.trip_advance_eligiblity == 1 &&
              data.trip_sheet_info.advance_payment_diesel != 0 &&
              data.trip_sheet_info.advance_status == 1 &&
              data.advance_payment_info &&
              data.advance_payment_info.sap_diesel_payment_document_no != null &&
              data.advance_payment_info.sap_freight_payment_document_no != null &&
              data.diesel_intent_info &&
              data.diesel_intent_info.diesel_vendor_sap_invoice_no != null
            )
          ) ||
          (
            /* Hire Vehicles After Advance Creation for FG-SALES & Others (If Advance only Given) */
            (
              data.vehicle_current_position == VEHICLE_CURRENT_POSITION.ADVANCE_CREATED &&
              (data.parking_status == VEHICLE_CURRENT_PARKING_STATUS.HIRE_FGSALES_NLFD_GATEOUT || data.parking_status == VEHICLE_CURRENT_PARKING_STATUS.HIRE_FGSALES_NLCD_GATEOUT || data.parking_status == VEHICLE_CURRENT_PARKING_STATUS.HIRE_OTHERS_GATEOUT) &&
              data.trip_sheet_info.trip_advance_eligiblity == 1 &&
              data.trip_sheet_info.advance_payment_diesel == 0 &&
              data.trip_sheet_info.advance_status == 1 &&
              data.advance_payment_info &&
              data.advance_payment_info.sap_freight_payment_document_no != null
            )
          )  ||
          (
            /* Hire Vehicles After Tripsheet Creation for RMSTO & Others */
            (
              data.vehicle_current_position == VEHICLE_CURRENT_POSITION.TRIPSHEET_CREATED &&
              (data.parking_status == VEHICLE_CURRENT_PARKING_STATUS.HIRE_RMSTO_GATEOUT || data.parking_status == VEHICLE_CURRENT_PARKING_STATUS.HIRE_OTHERS_GATEOUT) &&
              (data.trip_sheet_info.trip_advance_eligiblity == null || data.trip_sheet_info.trip_advance_eligiblity == 0) &&
              data.trip_sheet_info.advance_amount == null &&
              data.trip_sheet_info.advance_payment_diesel == null &&
              data.trip_sheet_info.advance_status == 0
            )
          ) ||
          (
            /* Hire Vehicles After Tripsheet Creation for RMSTO */
            (
              data.vehicle_current_position == VEHICLE_CURRENT_POSITION.TRIPSHEET_CREATED &&
              data.parking_status == VEHICLE_CURRENT_PARKING_STATUS.HIRE_RMSTO_GATEOUT &&
              (data.trip_sheet_info.trip_advance_eligiblity == null || data.trip_sheet_info.trip_advance_eligiblity == 0) &&
              data.trip_sheet_info.advance_amount == null &&
              data.trip_sheet_info.advance_payment_diesel == null &&
              data.trip_sheet_info.advance_status == 0
            )
          ) ||
          (
            /* Hire Vehicles After Tripsheet Creation for Others */
            (
              data.vehicle_current_position == VEHICLE_CURRENT_POSITION.TRIPSHEET_CREATED &&
              data.parking_status == VEHICLE_CURRENT_PARKING_STATUS.HIRE_OTHERS_GATEOUT && 
              data.trip_sheet_info.advance_amount == 0 &&
              data.trip_sheet_info.advance_payment_diesel == 0 &&
              data.trip_sheet_info.advance_status == 0
            )
          ) ||
          (
            /* Own/Contract Vehicles After Diesel Indent Creation/Completion/Approval Scenario */
            (
              (data.vehicle_current_position == VEHICLE_CURRENT_POSITION.DIESEL_INDENT_CREATION_COMPLETED || data.vehicle_current_position == VEHICLE_CURRENT_POSITION.DIESEL_INDENT_CONFIRMATION_COMPLETED || data.vehicle_current_position == VEHICLE_CURRENT_POSITION.DIESEL_INDENT_APPROVAL_COMPLETED) &&
              data.parking_status == VEHICLE_CURRENT_PARKING_STATUS.AFTER_DELIVERY_GATEIN &&
              ((data.trip_sheet_info.purpose == 3 || data.trip_sheet_info.purpose == 4 || data.trip_sheet_info.purpose == 5) || ( data.trip_sheet_info.trip_advance_eligiblity == 1 && /* Need to update for trip purpose change */
              data.trip_sheet_info.advance_status == 1)) && /* Need to update for trip purpose change */
              data.tripsheet_open_status != 2 &&
              !data.trip_settlement_info
            )
          )
        )

        filterData.map((data, index) => {
          rowDataList.push({
            sno: index + 1,
            Tripsheet_No: data.trip_sheet_info.trip_sheet_no,
            Tripsheet_Date: data.trip_sheet_info.created_date,
            Tripsheet_Month: getDateTime(data.trip_sheet_info.created_at,2), 
            TIC_Status : data.tic_parent_info && data.tic_parent_info.status == '6' ? 'Completed' : 'Not Completed',
            Vehicle_Type: data.vehicle_type_id.type,
            Division: data.trip_sheet_info && data.trip_sheet_info.to_divison == '2' ? 'NLCD' : (data.trip_sheet_info.purpose == '4' ? '-' : 'NLFD'),
            Vehicle_No: data.vehicle_number,
            Driver_Name: data.driver_name,
            Driver_Mobile_No: data.driver_contact_number,
            Vendor_Code: data.vehicle_type_id.id == 3 ? (data.vendor_info ? data.vendor_info.vendor_code : '-') : '-',
            Vendor_Name: data.vehicle_type_id.id == 3 ? (data.vendor_info ? data.vendor_info.owner_name : '-') : '-',          
            Vendor_Mobile_No: data.vehicle_type_id.id == 3 ? (data.vendor_info ? data.vendor_info.owner_number : '-') : '-',
            Vendor_PAN_No: data.vehicle_type_id.id == 3 ? (data.vendor_info ? data.vendor_info.pan_card_number : '-') : '-',
            Vendor_Town: data.vehicle_type_id.id == 3 ? (data.vendor_info ? (data.vendor_info.city ? data.vendor_info.city : '-') : '-') : '-',
            Previous_Status: (
              // <span className="badge rounded-pill bg-info">
                (data.vehicle_current_position ==
                  VEHICLE_CURRENT_POSITION.DIESEL_INDENT_APPROVAL_COMPLETED &&
                  data.parking_status == VEHICLE_CURRENT_PARKING_STATUS.AFTER_DELIVERY_GATEIN) ||
                (data.vehicle_current_position ==
                  VEHICLE_CURRENT_POSITION.DIESEL_INDENT_APPROVAL_COMPLETED &&
                  (data.parking_status == VEHICLE_CURRENT_PARKING_STATUS.HIRE_FGSTO_NLCD_GATEOUT ||
                    data.parking_status == VEHICLE_CURRENT_PARKING_STATUS.HIRE_FGSTO_NLFD_GATEOUT ||
                    data.parking_status == VEHICLE_CURRENT_PARKING_STATUS.HIRE_FGSALES_NLFD_GATEOUT ||
                    data.parking_status == VEHICLE_CURRENT_PARKING_STATUS.HIRE_FGSALES_NLCD_GATEOUT))
                  ? 'DI APPROVAL ✔️'
                  : data.vehicle_current_position == VEHICLE_CURRENT_POSITION.ADVANCE_CREATED &&
                    (data.parking_status == VEHICLE_CURRENT_PARKING_STATUS.HIRE_FGSTO_NLCD_GATEOUT ||
                      data.parking_status == VEHICLE_CURRENT_PARKING_STATUS.HIRE_FGSTO_NLFD_GATEOUT ||
                      data.parking_status ==
                        VEHICLE_CURRENT_PARKING_STATUS.HIRE_FGSALES_NLFD_GATEOUT ||
                      data.parking_status == VEHICLE_CURRENT_PARKING_STATUS.HIRE_FGSALES_NLCD_GATEOUT || data.parking_status == VEHICLE_CURRENT_PARKING_STATUS.HIRE_OTHERS_GATEOUT)
                  ? 'ADVANCE ✔️'
                  : data.vehicle_current_position == VEHICLE_CURRENT_POSITION.TRIPSHEET_CREATED &&
                    data.parking_status == VEHICLE_CURRENT_PARKING_STATUS.HIRE_RMSTO_GATEOUT
                  ? 'RMSTO ✔️'
                  : data.vehicle_current_position == VEHICLE_CURRENT_POSITION.TRIPSHEET_CREATED &&
                    data.parking_status == VEHICLE_CURRENT_PARKING_STATUS.HIRE_OTHERS_GATEOUT
                  ? 'OTHERS ✔️'
                  : data.vehicle_current_position == VEHICLE_CURRENT_POSITION.TRIPSHEET_CREATED &&
                    data.parking_status == VEHICLE_CURRENT_PARKING_STATUS.HIRE_FGSTO_NLCD_GATEOUT
                  ? 'FGSTO - NLCD ✔️'
                  : data.vehicle_current_position == VEHICLE_CURRENT_POSITION.TRIPSHEET_CREATED &&
                    data.parking_status == VEHICLE_CURRENT_PARKING_STATUS.HIRE_FGSTO_NLFD_GATEOUT
                  ? 'FGSTO - NLFD ✔️'
                  : data.vehicle_current_position ==
                      VEHICLE_CURRENT_POSITION.NLCD_SHIPMENT_COMPLETED &&
                    data.parking_status == VEHICLE_CURRENT_PARKING_STATUS.HIRE_FGSALES_NLCD_GATEOUT
                  ? 'FGSALES - NLCD ✔️'
                  : data.vehicle_current_position ==
                      VEHICLE_CURRENT_POSITION.NLFD_SHIPMENT_COMPLETED &&
                    data.parking_status == VEHICLE_CURRENT_PARKING_STATUS.HIRE_FGSALES_NLFD_GATEOUT
                  ? 'FGSALES - NLFD ✔️'
                  : data.vehicle_current_position == ACTION.VEHICLE_MAINTENANCE_ENDED
                  ? 'VM Completed'
                  : data.vehicle_current_position ==
                      VEHICLE_CURRENT_POSITION.INCOME_CLOSURE_REJECTED &&
                    data.trip_settlement_info.rejected_by == '2'
                  ? 'SETTLEMENT ❌'
                  : data.vehicle_current_position ==
                      VEHICLE_CURRENT_POSITION.INCOME_CLOSURE_REJECTED &&
                    data.trip_settlement_info.rejected_by == '1'
                  ? 'INCOME ❌'
                  : data.vehicle_current_position ==
                      VEHICLE_CURRENT_POSITION.DIESEL_INDENT_CREATION_COMPLETED &&
                    data.parking_status == VEHICLE_CURRENT_PARKING_STATUS.AFTER_DELIVERY_GATEIN
                  ? 'DI CREATION ✔️'
                  : data.vehicle_current_position ==
                      VEHICLE_CURRENT_POSITION.DIESEL_INDENT_CONFIRMATION_COMPLETED &&
                    data.parking_status == VEHICLE_CURRENT_PARKING_STATUS.AFTER_DELIVERY_GATEIN
                  ? 'DI CONFIRMATION ✔️'
                  : 'Gate Out'
              // </span>
            ),
            Waiting_At: 'Expense Closure',
            /* New Fields Start */
            HV_Freight_Amount: data.vehicle_type_id.id == 3 ? (data.advance_payment_info ? data.advance_payment_info.actual_freight : '-') : '-', 
            HV_Freight_DOC_No: data.vehicle_type_id.id == 3 ? (data.advance_payment_info ? data.advance_payment_info.sap_freight_payment_document_no : '-') : '-', 
            HV_Freight_DOC_Date: data.vehicle_type_id.id == 3 ? (data.advance_payment_info ? formatDate(data.advance_payment_info.sap_invoice_posting_date) : '-') : '-', 
            Advance_Eligibility: data.advance_payment_info ? (data.vehicle_type_id.id == 3 && (data.advance_payment_info.advance_payment != 0 || data.advance_payment_info.advance_payment != 0) ? 'Yes' : 'No'): 'No',
            HV_Bank_Advance_Amount: data.vehicle_type_id.id == 3 ? (data.advance_payment_info ? data.advance_payment_info.advance_payment : '-') : '-', 
            HV_Bank_Advance_Doc_No: data.vehicle_type_id.id == 3 ? (data.advance_payment_info ? data.advance_payment_info.sap_bank_payment_document_no : '-') : '-', 
            HV_Bank_Advance_Doc_Date: data.vehicle_type_id.id == 3 ? (data.advance_payment_info ? formatDate(data.advance_payment_info.sap_invoice_posting_date) : '-') : '-', 
            HV_Diesel_Advance_amount: data.vehicle_type_id.id == 3 ? (data.advance_payment_info ? data.advance_payment_info.advance_payment_diesel : '-') : '-', 
            HV_Diesle_Advance_Doc_No: data.vehicle_type_id.id == 3 ? (data.advance_payment_info ? data.advance_payment_info.sap_diesel_payment_document_no : '-') : '-', 
            HV_Diesel_Advance_Doc_Date: data.vehicle_type_id.id == 3 ? (data.advance_payment_info ? formatDate(data.advance_payment_info.sap_invoice_posting_date) : '-') : '-',  
            HV_Balance_Amount_To_Pay: data.vehicle_type_id.id == 3 ? (data.advance_payment_info ? tripBalanceFreight(data.advance_payment_info.actual_freight,data.advance_payment_info.advance_payment,data.advance_payment_info.advance_payment_diesel) : '-') : '-', 
            Own_Driver_Advance_Amount: data.vehicle_type_id.id != 3 ? (data.advance_payment_info ? data.advance_payment_info.advance_payment : '-') : '-', 
            Own_Driver_Advance_Document_No: data.vehicle_type_id.id != 3 ? (data.advance_payment_info ? data.advance_payment_info.document_no : '-') : '-', 
            Own_Driver_Advance_Document_Date: data.vehicle_type_id.id != 3 ? (data.advance_payment_info ? formatDate(data.advance_payment_info.sap_invoice_posting_date) : '-') : '-', 
            Own_Driver_Additional_Advance_Amount: data.vehicle_type_id.id != 3 ? (data.advance_payment_info ? data.advance_payment_info.additional_advance_payment : '-') : '-', 
            Own_Driver_Additional_Advance_Document_No: data.vehicle_type_id.id != 3 ? (data.advance_payment_info ? data.advance_payment_info.additional_advance_document_no : '-') : '-', 
            Own_Driver_Additional_Advance_Document_Date: data.vehicle_type_id.id != 3 ? (data.advance_payment_info ? formatDate(data.advance_payment_info.additional_advance_sap_invoice_posting_date) : '-') : '-', 
            // Diesel_Bunk_Name: data.diesel_intent_info ? (data.diesel_intent_info.diesel_vendor_id == 1 ? 'RNS Fuel Station' : 'RS Petroleum') : '-',
            Diesel_Bunk_Name: data.diesel_intent_info ? getDieselVendorNameById (data.diesel_intent_info.diesel_vendor_id) : '-', 
            // Diesel_Approval_Date: data.diesel_intent_info ? data.diesel_intent_info.sap_diesel_date : '-',
            Diesel_Amount: data.diesel_intent_info ? data.diesel_intent_info.total_amount : '-',
            Diesel_Bunk_Invoice_No: data.diesel_intent_info ? data.diesel_intent_info.invoice_no : '-',
            Diesel_Debit_Note_Doc_No: data.diesel_intent_info ? data.diesel_intent_info.diesel_vendor_sap_invoice_no : '-',
            Diesel_Debit_Note_Doc_Date: data.diesel_intent_info ? data.diesel_intent_info.sap_diesel_date : '-',        
            Tripsheet_Created_By: data.trip_sheet_info && data.trip_sheet_info.trip_user_info ? data.trip_sheet_info.trip_user_info.emp_name : '-',
            TSC_User_Division: data.trip_sheet_info && data.trip_sheet_info.trip_user_info && data.trip_sheet_info.trip_user_info.user_division_info ? data.trip_sheet_info.trip_user_info.user_division_info.division : '-',
            TSC_User_Department: data.trip_sheet_info && data.trip_sheet_info.trip_user_info && data.trip_sheet_info.trip_user_info.user_department_info ? data.trip_sheet_info.trip_user_info.user_department_info.department : '-',
            Shed_Name: data.vehicle_type_id.id == 3 ? (data.vendor_info && data.vendor_info.shed_info ? data.vendor_info.shed_info.shed_name : '-') : '-',
            Shed_Mobile_No: data.vehicle_type_id.id == 3 ? (data.vendor_info && data.vendor_info.shed_info ? data.vendor_info.shed_info.shed_owner_phone_1 : '-') : '-',
            /* New Fields End */
            Trip_Remarks: data.trip_remarks ? data.trip_remarks : '-',
            Screen_Duration: data.vehicle_current_position_updated_time,
            Overall_Duration: data.created_at,
            Action: (
              <CButton className="badge" color="warning">
                <Link className="text-white" to={`/TSExpenseCapture/${data.parking_yard_gate_id}`}>
                  Expense Closure
                </Link>
              </CButton>
            ),
          })
        })
        setRowData(rowDataList)
        setPending(false)
      })
    }
  }

  useEffect(() => {
    getClosureVehiclesData()

    DieselVendorMasterService.getDieselVendors().then((response) => {
      let viewData = response.data.data
      console.log(viewData,'getDieselVendors')
      setDvData(viewData)
    })
  }, [])

  const columns = [
    {
      name: 'S.No',
      selector: (row) => row.sno,
      sortable: true,
      center: true,
    },
    {
      name: 'TripSheet No',
      selector: (row) => row.Tripsheet_No,
      sortable: true,
      center: true,
    },
    {
      name: 'TripSheet Date',
      selector: (row) => row.Tripsheet_Date,
      sortable: true,
      center: true,
    },
    {
      name: 'TIC Status',
      selector: (row) => row.TIC_Status,
      sortable: true,
      center: true,
    },
    {
      name: 'Vehicle Type',
      selector: (row) => row.Vehicle_Type,
      sortable: true,
      center: true,
    },
    {
      name: 'Vehicle No',
      selector: (row) => row.Vehicle_No,
      sortable: true,
      center: true,
    },
    {
      name: 'Driver Name',
      selector: (row) => row.Driver_Name,
      sortable: true,
      center: true,
    },
    {
      name: 'Vendor Name',
      selector: (row) => row.Vendor_Name,
      sortable: true,
      center: true,
    },
    {
      name: 'Vendor Code',
      selector: (row) => row.Vendor_Code,
      sortable: true,
      center: true,
    },
    {
      name: 'Town',
      selector: (row) => row.Vendor_Town,
      sortable: true,
      center: true,
    },
    {
      name: 'Current Status',
      selector: (row) => row.Previous_Status,
      center: true,
    },
    {
      name: 'Acc. Remarks',
      selector: (row) => row.Trip_Remarks,
      center: true,
      sortable: true,
    },
    {
      name: 'Screen Duration',
      selector: (row) => row.Screen_Duration,
      center: true,
      sortable: true,
    },
    // {
    //   name: ' Overall Duration',
    //   selector: (row) => row.Overall_Duration,
    //   center: true,
    //   sortable: true,
    // },
    {
      name: 'Action',
      selector: (row) => row.Action,
      center: true,
    },
  ]

  return (
    <>
      {!fetch && <Loader />}
      {fetch && (
        <>
          {screenAccess ? (
            <>
              <CCard className="mt-4">
                <CContainer className="mt-2">
                  <CRow className="mt-3">
                    <CCol xs={12} md={3}>
                      <CFormLabel htmlFor="VNum">Date Filter</CFormLabel>
                      <DateRangePicker
                        style={{ width: '100rem', height: '100%', borderColor: 'black' }}
                        className="mb-2"
                        id="start_date"
                        name="end_date"
                        format="dd-MM-yyyy"
                        value={defaultDate}
                        onChange={setDefaultDate}
                      />
                    </CCol>

                    <CCol
                      className="offset-md-6"
                      xs={12}
                      sm={9}
                      md={3}
                      style={{ display: 'flex', justifyContent: 'end' }}
                    >
                      <CButton
                        size="sm"
                        color="primary"
                        className="m-3 px-3 text-white" 
                        onClick={() => {
                          setFetch(false)
                          getClosureVehiclesData('1')
                        }}
                      >
                        Filter
                      </CButton>
                      <CButton
                        size="lg-sm"
                        color="warning"
                        className="m-3 px-3 text-white" 
                        onClick={(e) => { 
                            exportToCSV()
                          }}
                      >
                        Export
                      </CButton>
                    </CCol>
                  </CRow> 
                  <CustomTable
                    columns={columns}
                    data={rowData}
                    fieldName={'Driver_Name'}
                    showSearchFilter={true}
                  />
                </CContainer>
              </CCard>
            </> 
            ) : (<AccessDeniedComponent />
          )}

   	    </>
      )}
    </>
  )
}

export default TSExpenseClosureHome
