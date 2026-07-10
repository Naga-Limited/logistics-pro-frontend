import React, { useState, useEffect } from 'react'
import { CButton, CCard, CCol, CRow, CContainer, CFormLabel } from '@coreui/react'
import { Link } from 'react-router-dom'
import CustomTable from 'src/components/customComponent/CustomTable'
import Loader from 'src/components/Loader'
import TripSheetClosureService from 'src/Service/TripSheetClosure/TripSheetClosureService'
import * as XLSX from 'xlsx'
import FileSaver from 'file-saver'
import AccessDeniedComponent from 'src/components/commoncomponent/AccessDeniedComponent'
import JavascriptInArrayComponent from 'src/components/commoncomponent/JavascriptInArrayComponent'
import * as NlmtScreenAccessCodes from 'src/components/constants/NlmtScreenAccessCodes'
import { GetDateTimeFormat } from 'src/Pages/Nlmt/CommonMethods/CommonMethods'
import { DateRangePicker } from 'rsuite'
import { toast } from 'react-toastify'
import DieselVendorMasterService from 'src/Service/Master/DieselVendorMasterService'
import NlmtTripSheetClosureService from 'src/Service/Nlmt/TripSheetClosure/NlmtTripSheetClosureService'

const NlmtTSExpenseClosureHome = () => {

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
  let page_no = NlmtScreenAccessCodes.NlmtClosureScreens.Nlmt_Expenses_Closure

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

  const getDateTime = (myDateTime, type = 0) => {
    let myTime = '-'
    if (type == 1) {
      myTime = new Date(myDateTime).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      })
    } else if (type == 2) {
      myTime = new Date(myDateTime).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    } else {
      myTime = new Date(myDateTime).toLocaleString('en-US')
    }

    return myTime
  }
  const VEHICLE_TYPE_MAP = {
    21: 'Own',
    22: 'Hire',
  }
  const exportToCSV = () => {
    let dateTimeString = GetDateTimeFormat(1)
    let fileName = 'ExpenseClosureScreen_' + dateTimeString
    const fileType =
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
    const fileExtension = '.xlsx'
    const ws = XLSX.utils.json_to_sheet(rowData)
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] }
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
    const data = new Blob([excelBuffer], { type: fileType })
    FileSaver.saveAs(data, fileName + fileExtension)
  }
  const ACTION = {
    GATE_IN: 1,
    GATE_OUT: 2,
    WAIT_OUTSIDE: 0,
  }

  const tripBalanceFreight = (a1, a2, a3) => {
    let balance = 0
    let total_freight = Number(parseFloat(a1).toFixed(2))
    let bank_advance = Number(parseFloat(a2).toFixed(2))
    let diesel_advance = Number(parseFloat(a3).toFixed(2))
    balance = total_freight - (bank_advance + diesel_advance)
    return Number(parseFloat(balance).toFixed(2))
  }

  /* Vehicle Current Position */
  const VEHICLE_CURRENT_POSITION = {
    TRIPSHEET_CREATED: 16,
    ADVANCE_CREATED: 18,
    NLFD_SHIPMENT_COMPLETED: 22,
    NLCD_SHIPMENT_COMPLETED: 25,
    EXPENSE_CLOSURE_COMPLETED: 26,
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
      year = d.getFullYear()

    if (month.length < 2) month = '0' + month
    if (day.length < 2) day = '0' + day

    return [day, month, year].join('-')
  }

  /* Set Default Date (Today) in a Variable State */
  const ddd = new Date()
  // ddd.setMonth(ddd.getMonth() - 1);
  ddd.setDate(ddd.getDate() - 10)
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
    console.log(dvData, 'dieselVendorFinder-dvData')
    console.log(vendor_id, 'dieselVendorFinder-vendor_id')
    let vendorName = '-'
    for (let i = 0; i < dvData.length; i++) {
      if (dvData[i].diesel_vendor_id == vendor_id) {
        vendorName = dvData[i].diesel_vendor_name
      }
    }
    console.log(vendorName, 'dieselVendorFinder-vendorName')
    return vendorName

    // let driverName = code == '1' ? 'RNS Fuel Station' : 'RS Petroleum'
    // return driverName
  }

  const getVehicleTypeId = (data) => {

    let veh_id = data.vehicle_info ? data.vehicle_info.vehicle_type_id : '-'
    return Number(typeof veh_id === 'object' ? veh_id.id : veh_id)
  } 

  const getClosureVehiclesData = (fresh_type = '') => {
    if (fresh_type !== '1') {
      NlmtTripSheetClosureService.getVehicleReadyToTripClose().then((res) => {
        closureData = res.data.data
        console.log(closureData,'getVehicleReadyToTripClose')
        setFetch(true)
        

        let rowDataList = []
        
        const filterData1 = closureData.filter((data) =>
          user_locations.includes(Number(data.vehicle_location_id))
        )

        // const filterData = filterData1.filter((data) => {
        // const vehicleType = Number(data?.vehicle_info?.vehicle_type_id)
        //   const settlement = data?.trip_settlement_info

        //   let advanceHaving = data?.advance_payment_info

        //   let case_1 = ((!settlement || settlement?.approval_status == '2') && data.vehicle_current_position == '26')
        //   let case_2 = (!advanceHaving && data.tripsheet_info.advance_request == '0' && data.vehicle_current_position == '22')
        //   let case_3 = (advanceHaving && advanceHaving.approval_status != 1 && data.vehicle_current_position == '18')

        //   console.log(case_1,'case_1')
        //   console.log(settlement,'case_1A')
        //   console.log(data.vehicle_current_position,'case_1B')
        //   console.log(case_2,'case_2')
        //   console.log(advanceHaving,'case_2A')
        //   console.log(data.tripsheet_info.advance_request,'case_2B')
        //   console.log(case_3,'case_3') 

        //   // Hire Vehicles (22)
        //   if (vehicleType === 22) {
        //     return ( //<></>
        //       /* Case 1 : Expense Closure Approval Rejection */
        //       ((!settlement || Number(settlement?.approval_status) === 2) && Number(data.vehicle_current_position) == 26) || 
        //       /* Case 2 : No Advance After Shipment Creation */
        //       (!advanceHaving && data.tripsheet_info.advance_request == '0' && Number(data.vehicle_current_position) == 22) ||
        //       /* Case 3 : After Advance Creation */
        //       (advanceHaving && advanceHaving.approval_status != 1 && Number(data.vehicle_current_position) === 18) 
        //     )
        //   }

        //   // Own Vehicles (21)
        //   if (vehicleType === 21) {
        //     return (
        //       !settlement ||
        //       Number(settlement?.approval_status) === 2 ||
        //       Number(data.vehicle_current_position) === 30
        //     )
        //   }

        //   return false
        // })

        const filterData = filterData1.filter(
          (data) =>  /* Hire / Own Vehicles After Advance Payment Completion */
            (data.vehicle_current_position == VEHICLE_CURRENT_POSITION.ADVANCE_CREATED &&
            (data.tripsheet_info.freight_approval_status == 0 || data.tripsheet_info.freight_approval_status == 2) && 
            data.tripsheet_info.status == 1 &&
            data.advance_payment_info &&
            data.advance_payment_info.approval_status != 1) ||
            /* Hire Vehicles After Expense Closure Approval Rejection */
            (data.vehicle_current_position == VEHICLE_CURRENT_POSITION.EXPENSE_CLOSURE_COMPLETED &&
            (data.trip_settlement_info.approval_status == 2 || !data.trip_settlement_info)) ||
            /* Hire Vehicles After Shipment Completion (No Advance) */
            (data.vehicle_current_position == VEHICLE_CURRENT_POSITION.NLFD_SHIPMENT_COMPLETED &&
            (data.tripsheet_info.advance_amount == null && !data.advance_payment_info)) || 
            /* Own vehciles Process */
            Number(data.vehicle_info.vehicle_type_id) == 21
        )

        console.log('filterData:', filterData)
        filterData.map((data, index) => {
          const vehicleType = Number(data?.vehicle_info?.vehicle_type_id)

          const vendor = data?.vendor_info ?? {}
          const shed = vendor?.shed_info ?? {}
          const advance = data?.advance_payment_info ?? {}
          const diesel = data?.diesel_intent_info ?? {}
          const settlement = data?.trip_settlement_info ?? {}

          rowDataList.push({
            sno: index + 1,

            Tripsheet_No: data?.tripsheet_info?.nlmt_tripsheet_no ?? '-',
            Tripsheet_Date: data?.tripsheet_info?.created_date ?? '-',
            Tripsheet_Month: getDateTime(data?.tripsheet_info?.created_at, 2),

            Vehicle_Type: VEHICLE_TYPE_MAP[vehicleType] ?? '-',
            Vehicle_No: data?.vehicle_info?.vehicle_number ?? '-',
            Freight_Percentage: vehicleType !== 22 ? '-' : (data?.advance_payment_info ? '10%' : '100%'),

            Driver_Name: data?.tripsheet_info?.parking_yard_info?.driver_name ?? '-',
            Driver_Mobile_No: data?.tripsheet_info?.parking_yard_info?.driver_phone_1 ?? '-',

            Vendor_Code: vendor?.vendor_code ?? '-',
            Vendor_Name: vendor?.owner_name ?? '-',
            Vendor_Mobile_No: vendor?.owner_number ?? '-',
            Vendor_PAN_No: vendor?.pan_card_number ?? '-',
            Vendor_Town: vendor?.city ?? '-',

            HV_Freight_Amount: vehicleType == 22 ? advance?.actual_freight ?? '-' : '-',
            HV_Freight_DOC_No:
              vehicleType == 22 ? advance?.sap_freight_payment_document_no ?? '-' : '-',
            HV_Freight_DOC_Date:
              vehicleType == 22 ? formatDate(advance?.sap_invoice_posting_date) : '-',

            HV_Bank_Advance_Amount: vehicleType == 22 ? advance?.advance_payment ?? '-' : '-',
            HV_Bank_Advance_Doc_No:
              vehicleType == 22 ? advance?.sap_bank_payment_document_no ?? '-' : '-',

            HV_Diesel_Advance_amount:
              vehicleType == 22 ? advance?.advance_payment_diesel ?? '-' : '-',
            HV_Diesle_Advance_Doc_No:
              vehicleType == 22 ? advance?.sap_diesel_payment_document_no ?? '-' : '-',

            Diesel_Bunk_Name: diesel?.diesel_vendor_id
              ? getDieselVendorNameById(diesel.diesel_vendor_id)
              : '-',

            Diesel_Amount: diesel?.total_amount ?? '-',
            Diesel_Bunk_Invoice_No: diesel?.invoice_no ?? '-',
            Diesel_Debit_Note_Doc_No: diesel?.diesel_vendor_sap_invoice_no ?? '-',

            Shed_Name: vehicleType == 22 ? shed?.shed_name ?? '-' : '-',
            Shed_Mobile_No: vehicleType == 22 ? shed?.shed_owner_phone_1 ?? '-' : '-',

            Tripsheet_Created_By: data?.tripsheet_info?.trip_user_info?.emp_name ?? '-', 

            Screen_Duration: data?.vehicle_current_position_updated_time ?? '-',
            Overall_Duration: data?.created_at ?? '-',

            Previous_Status:
                // <span className="badge rounded-pill bg-info">
                (data.vehicle_current_position ==
                  VEHICLE_CURRENT_POSITION.DIESEL_INDENT_APPROVAL_COMPLETED &&
                  data.parking_status == VEHICLE_CURRENT_PARKING_STATUS.AFTER_DELIVERY_GATEIN) ||
                (data.vehicle_current_position ==
                  VEHICLE_CURRENT_POSITION.DIESEL_INDENT_APPROVAL_COMPLETED &&
                  (data.parking_status == VEHICLE_CURRENT_PARKING_STATUS.HIRE_FGSTO_NLCD_GATEOUT ||
                    data.parking_status == VEHICLE_CURRENT_PARKING_STATUS.HIRE_FGSTO_NLFD_GATEOUT ||
                    data.parking_status ==
                      VEHICLE_CURRENT_PARKING_STATUS.HIRE_FGSALES_NLFD_GATEOUT ||
                    data.parking_status ==
                      VEHICLE_CURRENT_PARKING_STATUS.HIRE_FGSALES_NLCD_GATEOUT))
                  ? 'DI APPROVAL ✔️'
                  : data.vehicle_current_position == VEHICLE_CURRENT_POSITION.ADVANCE_CREATED &&
                    (data.parking_status ==
                      VEHICLE_CURRENT_PARKING_STATUS.HIRE_FGSTO_NLCD_GATEOUT ||
                      data.parking_status ==
                        VEHICLE_CURRENT_PARKING_STATUS.HIRE_FGSTO_NLFD_GATEOUT ||
                      data.parking_status ==
                        VEHICLE_CURRENT_PARKING_STATUS.HIRE_FGSALES_NLFD_GATEOUT ||
                      data.parking_status ==
                        VEHICLE_CURRENT_PARKING_STATUS.HIRE_FGSALES_NLCD_GATEOUT ||
                      data.parking_status == VEHICLE_CURRENT_PARKING_STATUS.HIRE_OTHERS_GATEOUT)
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
                  : data.vehicle_current_position ==
                  VEHICLE_CURRENT_POSITION.ADVANCE_CREATED && getVehicleTypeId(data) == 22
                  ? 'ADVANCE ✔️'
                  : data.vehicle_current_position ==
                  VEHICLE_CURRENT_POSITION.EXPENSE_CLOSURE_COMPLETED && getVehicleTypeId(data) == 22 && (data.trip_settlement_info && data.trip_settlement_info.approval_status == 2)
                  ? 'Ex. Approval ❌'
                  : data.vehicle_current_position ==
                  VEHICLE_CURRENT_POSITION.NLFD_SHIPMENT_COMPLETED && getVehicleTypeId(data) == 22 && (!data.advance_payment_info && data.tripsheet_info.advance_amount == null)
                  ? 'Shipment ✔️'
                  : 'Gate Out',

            Action: (
              <CButton className="badge" color="warning">
                <Link
                  className="text-white"
                  to={`/NlmtTSExpenseClosureHome/${data?.nlmt_trip_in_id}`}
                >
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

      NlmtTripSheetClosureService.getVehicleReadyToTripCloseFilterSearch(report_form_data).then(
        (res) => {
          closureData = res.data.data
          console.log(closureData, 'closureData-filtered')
          setFetch(true)

          // const vehicleType = Number(data?.vehicle_info?.vehicle_type_id)

          let rowDataList = []
          const filterData1 = closureData.filter(
            (data) =>
              user_locations.indexOf(data.vehicle_location_id) != -1 
              // user_vehicle_types.indexOf(data.vehicle_type_id.id) != -1
          )

          const filterData = filterData1.filter(
            (data) =>  /* Hire / Own Vehicles After Advance Payment Completion */
              (data.vehicle_current_position == VEHICLE_CURRENT_POSITION.ADVANCE_CREATED &&
              (data.tripsheet_info.freight_approval_status == 0 || data.tripsheet_info.freight_approval_status == 2) && 
              data.tripsheet_info.status == 1 &&
              data.advance_payment_info &&
              data.advance_payment_info.approval_status != 1) ||
              /* Hire Vehicles After Expense Closure Approval Rejection */
              (data.vehicle_current_position == VEHICLE_CURRENT_POSITION.EXPENSE_CLOSURE_COMPLETED &&
              (data.trip_settlement_info.approval_status == 2 || !data.trip_settlement_info)) ||
              /* Hire Vehicles After Shipment Completion (No Advance) */
              (data.vehicle_current_position == VEHICLE_CURRENT_POSITION.NLFD_SHIPMENT_COMPLETED &&
              (data.tripsheet_info.advance_amount == null && !data.advance_payment_info)) ||
              /* Own vehciles Process */
              Number(data.vehicle_info.vehicle_type_id) == 21
          )

          filterData.map((data, index) => {
            const vehicleType = Number(data?.vehicle_info?.vehicle_type_id)
            rowDataList.push({
              sno: index + 1,
              Tripsheet_No: data.tripsheet_info.nlmt_tripsheet_no,
              Tripsheet_Date: data.tripsheet_info.created_date,
              Tripsheet_Month: getDateTime(data.tripsheet_info.created_at, 2),
              
              Vehicle_Type: getVehicleTypeId(data) == 22 ? 'Hire' : 'Own',
              
              Vehicle_No: data.vehicle_info?.vehicle_number ?? '-',
              Freight_Percentage: vehicleType !== 22 ? '-' : (data?.advance_payment_info ? '10%' : '100%'),
              Driver_Name: data.driver_name,
              Driver_Mobile_No: data.driver_phone_1,
              Vendor_Code:
                getVehicleTypeId(data) == 22
                  ? data.vendor_info
                    ? data.vendor_info.vendor_code
                    : '-'
                  : '-',
              Vendor_Name:
                getVehicleTypeId(data) == 22
                  ? data.vendor_info
                    ? data.vendor_info.owner_name
                    : '-'
                  : '-',
              Vendor_Mobile_No:
                getVehicleTypeId(data) == 22
                  ? data.vendor_info
                    ? data.vendor_info.owner_number
                    : '-'
                  : '-',
              Vendor_PAN_No:
                getVehicleTypeId(data) == 22
                  ? data.vendor_info
                    ? data.vendor_info.pan_card_number
                    : '-'
                  : '-',
              Vendor_Town:
                getVehicleTypeId(data) == 22
                  ? data.vendor_info
                    ? data.vendor_info.city
                      ? data.vendor_info.city
                      : '-'
                    : '-'
                  : '-',
              Previous_Status:
                // <span className="badge rounded-pill bg-info">
                (data.vehicle_current_position ==
                  VEHICLE_CURRENT_POSITION.DIESEL_INDENT_APPROVAL_COMPLETED &&
                  data.parking_status == VEHICLE_CURRENT_PARKING_STATUS.AFTER_DELIVERY_GATEIN) ||
                (data.vehicle_current_position ==
                  VEHICLE_CURRENT_POSITION.DIESEL_INDENT_APPROVAL_COMPLETED &&
                  (data.parking_status == VEHICLE_CURRENT_PARKING_STATUS.HIRE_FGSTO_NLCD_GATEOUT ||
                    data.parking_status == VEHICLE_CURRENT_PARKING_STATUS.HIRE_FGSTO_NLFD_GATEOUT ||
                    data.parking_status ==
                      VEHICLE_CURRENT_PARKING_STATUS.HIRE_FGSALES_NLFD_GATEOUT ||
                    data.parking_status ==
                      VEHICLE_CURRENT_PARKING_STATUS.HIRE_FGSALES_NLCD_GATEOUT))
                  ? 'DI APPROVAL ✔️'
                  : data.vehicle_current_position == VEHICLE_CURRENT_POSITION.ADVANCE_CREATED &&
                    (data.parking_status ==
                      VEHICLE_CURRENT_PARKING_STATUS.HIRE_FGSTO_NLCD_GATEOUT ||
                      data.parking_status ==
                        VEHICLE_CURRENT_PARKING_STATUS.HIRE_FGSTO_NLFD_GATEOUT ||
                      data.parking_status ==
                        VEHICLE_CURRENT_PARKING_STATUS.HIRE_FGSALES_NLFD_GATEOUT ||
                      data.parking_status ==
                        VEHICLE_CURRENT_PARKING_STATUS.HIRE_FGSALES_NLCD_GATEOUT ||
                      data.parking_status == VEHICLE_CURRENT_PARKING_STATUS.HIRE_OTHERS_GATEOUT)
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
                  : data.vehicle_current_position ==
                  VEHICLE_CURRENT_POSITION.ADVANCE_CREATED && getVehicleTypeId(data) == 22
                  ? 'ADVANCE ✔️'
                  : data.vehicle_current_position ==
                  VEHICLE_CURRENT_POSITION.EXPENSE_CLOSURE_COMPLETED && getVehicleTypeId(data) == 22 && (data.trip_settlement_info && data.trip_settlement_info.approval_status == 2)
                  ? 'Ex. Approval ❌'
                  : data.vehicle_current_position ==
                  VEHICLE_CURRENT_POSITION.NLFD_SHIPMENT_COMPLETED && getVehicleTypeId(data) == 22 && (!data.advance_payment_info && data.tripsheet_info.advance_amount == null)
                  ? 'Shipment ✔️'
                  : 'Gate Out',
              // </span>
              Waiting_At: 'Expense Closure',
              /* New Fields Start */
              HV_Freight_Amount:
                getVehicleTypeId(data) == 22
                  ? data.advance_payment_info
                    ? data.advance_payment_info.actual_freight
                    : '-'
                  : '-',
              HV_Freight_DOC_No:
                getVehicleTypeId(data) == 22
                  ? data.advance_payment_info
                    ? data.advance_payment_info.sap_freight_payment_document_no
                    : '-'
                  : '-',
              HV_Freight_DOC_Date:
                getVehicleTypeId(data) == 22
                  ? data.advance_payment_info
                    ? formatDate(data.advance_payment_info.sap_invoice_posting_date)
                    : '-'
                  : '-',
              Advance_Eligibility: data.advance_payment_info
                ? getVehicleTypeId(data) == 22 &&
                  (data.advance_payment_info.advance_payment != 0 ||
                    data.advance_payment_info.advance_payment != 0)
                  ? 'Yes'
                  : 'No'
                : 'No',
              HV_Bank_Advance_Amount:
                getVehicleTypeId(data) == 22
                  ? data.advance_payment_info
                    ? data.advance_payment_info.advance_payment
                    : '-'
                  : '-',
              HV_Bank_Advance_Doc_No:
                getVehicleTypeId(data) == 22
                  ? data.advance_payment_info
                    ? data.advance_payment_info.sap_bank_payment_document_no
                    : '-'
                  : '-',
              HV_Bank_Advance_Doc_Date:
                getVehicleTypeId(data) == 22
                  ? data.advance_payment_info
                    ? formatDate(data.advance_payment_info.sap_invoice_posting_date)
                    : '-'
                  : '-',
              HV_Diesel_Advance_amount:
                getVehicleTypeId(data) == 22
                  ? data.advance_payment_info
                    ? data.advance_payment_info.advance_payment_diesel
                    : '-'
                  : '-',
              HV_Diesle_Advance_Doc_No:
                getVehicleTypeId(data) == 22
                  ? data.advance_payment_info
                    ? data.advance_payment_info.sap_diesel_payment_document_no
                    : '-'
                  : '-',
              HV_Diesel_Advance_Doc_Date:
                getVehicleTypeId(data) == 22
                  ? data.advance_payment_info
                    ? formatDate(data.advance_payment_info.sap_invoice_posting_date)
                    : '-'
                  : '-',
              HV_Balance_Amount_To_Pay:
                getVehicleTypeId(data) == 22
                  ? data.advance_payment_info
                    ? tripBalanceFreight(
                        data.advance_payment_info.actual_freight,
                        data.advance_payment_info.advance_payment,
                        data.advance_payment_info.advance_payment_diesel
                      )
                    : '-'
                  : '-',
              Own_Driver_Advance_Amount:
                getVehicleTypeId(data) != 22
                  ? data.advance_payment_info
                    ? data.advance_payment_info.advance_payment
                    : '-'
                  : '-',
              Own_Driver_Advance_Document_No:
                getVehicleTypeId(data) != 22
                  ? data.advance_payment_info
                    ? data.advance_payment_info.document_no
                    : '-'
                  : '-',
              Own_Driver_Advance_Document_Date:
                getVehicleTypeId(data) != 22
                  ? data.advance_payment_info
                    ? formatDate(data.advance_payment_info.sap_invoice_posting_date)
                    : '-'
                  : '-',
              Own_Driver_Additional_Advance_Amount:
                getVehicleTypeId(data) != 22
                  ? data.advance_payment_info
                    ? data.advance_payment_info.additional_advance_payment
                    : '-'
                  : '-',
              Own_Driver_Additional_Advance_Document_No:
                getVehicleTypeId(data) != 22
                  ? data.advance_payment_info
                    ? data.advance_payment_info.additional_advance_document_no
                    : '-'
                  : '-',
              Own_Driver_Additional_Advance_Document_Date:
                getVehicleTypeId(data) != 22
                  ? data.advance_payment_info
                    ? formatDate(
                        data.advance_payment_info.additional_advance_sap_invoice_posting_date
                      )
                    : '-'
                  : '-',
              // Diesel_Bunk_Name: data.diesel_intent_info ? (data.diesel_intent_info.diesel_vendor_id == 1 ? 'RNS Fuel Station' : 'RS Petroleum') : '-',
              Diesel_Bunk_Name: data.diesel_intent_info
                ? getDieselVendorNameById(data.diesel_intent_info.diesel_vendor_id)
                : '-',
              // Diesel_Approval_Date: data.diesel_intent_info ? data.diesel_intent_info.sap_diesel_date : '-',
              Diesel_Amount: data.diesel_intent_info ? data.diesel_intent_info.total_amount : '-',
              Diesel_Bunk_Invoice_No: data.diesel_intent_info
                ? data.diesel_intent_info.invoice_no
                : '-',
              Diesel_Debit_Note_Doc_No: data.diesel_intent_info
                ? data.diesel_intent_info.diesel_vendor_sap_invoice_no
                : '-',
              Diesel_Debit_Note_Doc_Date: data.diesel_intent_info
                ? data.diesel_intent_info.sap_diesel_date
                : '-',
              Tripsheet_Created_By:
                data.tripsheet_info && data.tripsheet_info.trip_user_info
                  ? data.tripsheet_info.trip_user_info.emp_name
                  : '-',
              TSC_User_Division:
                data.tripsheet_info &&
                data.tripsheet_info.trip_user_info &&
                data.tripsheet_info.trip_user_info.user_division_info
                  ? data.tripsheet_info.trip_user_info.user_division_info.division
                  : '-',
              TSC_User_Department:
                data.tripsheet_info &&
                data.tripsheet_info.trip_user_info &&
                data.tripsheet_info.trip_user_info.user_department_info
                  ? data.tripsheet_info.trip_user_info.user_department_info.department
                  : '-',
              Shed_Name:
                getVehicleTypeId(data) == 22
                  ? data.vendor_info && data.vendor_info.shed_info
                    ? data.vendor_info.shed_info.shed_name
                    : '-'
                  : '-',
              Shed_Mobile_No:
                getVehicleTypeId(data) == 22
                  ? data.vendor_info && data.vendor_info.shed_info
                    ? data.vendor_info.shed_info.shed_owner_phone_1
                    : '-'
                  : '-',
              /* New Fields End */ 
              Screen_Duration: data.vehicle_current_position_updated_time,
              Overall_Duration: data.created_at,
              Action: (
                <CButton className="badge" color="warning">
                  <Link className="text-white" to={`${data.nlmt_trip_in_id}`}>
                    Expense Closure
                  </Link>
                </CButton>
              ),
            })
          })
          setRowData(rowDataList)
          setPending(false)
        }
      )
    }
  }

  useEffect(() => {
    getClosureVehiclesData()

    DieselVendorMasterService.getDieselVendors().then((response) => {
      let viewData = response.data.data
      console.log(viewData, 'getDieselVendors')
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
      name: 'TripSheet',
      selector: (row) => row.Tripsheet_No,
      sortable: true,
      center: true,
    },
    {
      name: 'Date',
      selector: (row) => row.Tripsheet_Date,
      sortable: true,
      center: true,
    },
    {
      name: 'Veh. Type',
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
      name: 'Freight %',
      selector: (row) => row.Freight_Percentage,
      sortable: true,
      center: true,
    },
    // {
    //   name: 'Driver Name',
    //   selector: (row) => row.Driver_Name,
    //   sortable: true,
    //   center: true,
    // },
    // {
    //   name: 'Vendor',
    //   selector: (row) => row.Vendor_Name,
    //   sortable: true,
    //   center: true,
    // },
    // {
    //   name: 'Code',
    //   selector: (row) => row.Vendor_Code,
    //   sortable: true,
    //   center: true,
    // },
    // {
    //   name: 'Town',
    //   selector: (row) => row.Vendor_Town,
    //   sortable: true,
    //   center: true,
    // },
    {
      name: 'Current Status',
      selector: (row) => row.Previous_Status,
      center: true,
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
          ) : (
            <AccessDeniedComponent />
          )}
        </>
      )}
    </>
  )
}

export default NlmtTSExpenseClosureHome
