// import React, { useState, useEffect } from 'react'
// import { CButton, CCard, CCol, CRow, CContainer, CFormLabel } from '@coreui/react'
// import { Link } from 'react-router-dom'
// import CustomTable from 'src/components/customComponent/CustomTable'
// import Loader from 'src/components/Loader'
// import TripSheetClosureService from 'src/Service/TripSheetClosure/TripSheetClosureService'
// import * as XLSX from 'xlsx';
// import FileSaver from 'file-saver'
// import AccessDeniedComponent from 'src/components/commoncomponent/AccessDeniedComponent'
// import JavascriptInArrayComponent from 'src/components/commoncomponent/JavascriptInArrayComponent'
// import * as NlmtScreenAccessCodes from 'src/components/constants/NlmtScreenAccessCodes'
// import { GetDateTimeFormat } from 'src/Pages/Nlmt/CommonMethods/CommonMethods'
// import { DateRangePicker } from 'rsuite'
// import { toast } from 'react-toastify'
// import DieselVendorMasterService from 'src/Service/Master/DieselVendorMasterService'
// import NlmtTripSheetClosureService from 'src/Service/Nlmt/TripSheetClosure/NlmtTripSheetClosureService'

// const NlmtTSHireExpApprovalHome = () => {
//   /*================== User Location Fetch ======================*/
//   const user_info_json = localStorage.getItem('user_info')
//   const user_info = JSON.parse(user_info_json)
//   const user_locations = []
//   const user_vehicle_types = []

//   /* Get User Locations From Local Storage */
//   user_info.location_info.map((data, index) => {
//     user_locations.push(data.id)
//   })

//   /* Get User Vehicle Types From Local Storage */
//   user_info.vehicle_type_info.map((data, index) => {
//     user_vehicle_types.push(data.id)
//   })

//   // console.log(user_locations)
//   /*================== User Location Fetch ======================*/

//   /* ==================== Access Part Start ========================*/
//   const [screenAccess, setScreenAccess] = useState(false)
//   let page_no = NlmtScreenAccessCodes.NlmtClosureScreens.Nlmt_Expenses_Closure_Approval

//   useEffect(()=>{

//     if(user_info.is_admin == 1 || JavascriptInArrayComponent(page_no,user_info.page_permissions)){
//       console.log('screen-access-allowed')
//       setScreenAccess(true)
//     } else{
//       console.log('screen-access-not-allowed')
//       setScreenAccess(false)
//     }

//   },[])
//   /* ==================== Access Part End ========================*/

//   const [rowData, setRowData] = useState([])
//   const [pending, setPending] = useState(true)
//   const [fetch, setFetch] = useState(false)
//   const [dvData, setDvData] = useState([])
//   let tableData = []
//   let closureData = []

//   const getDateTime = (myDateTime, type = 0) => {
//     let myTime = '-'
//     if (type == 1) {
//       myTime = new Date(myDateTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
//     } else if (type == 2) {
//       myTime = new Date(myDateTime).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
//     } else {
//       myTime = new Date(myDateTime).toLocaleString('en-US');
//     }

//     return myTime
//   }
//   const VEHICLE_TYPE_MAP = {
//     21: 'Own',
//     22: 'Hire',
//   }
//   const exportToCSV = () => {
//     let dateTimeString = GetDateTimeFormat(1)
//     let fileName = 'ExpenseClosureScreen_' + dateTimeString
//     const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
//     const fileExtension = '.xlsx';
//     const ws = XLSX.utils.json_to_sheet(rowData);
//     const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
//     const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
//     const data = new Blob([excelBuffer], { type: fileType });
//     FileSaver.saveAs(data, fileName + fileExtension);
//   }
//   const ACTION = {
//     GATE_IN: 1,
//     GATE_OUT: 2,
//     WAIT_OUTSIDE: 0,
//   }

//   const tripBalanceFreight = (a1, a2, a3) => {
//     let balance = 0
//     let total_freight = Number(parseFloat(a1).toFixed(2))
//     let bank_advance = Number(parseFloat(a2).toFixed(2))
//     let diesel_advance = Number(parseFloat(a3).toFixed(2))
//     balance = total_freight - (bank_advance + diesel_advance)
//     return Number(parseFloat(balance).toFixed(2))
//   }

//   /* Vehicle Current Position */
//   const VEHICLE_CURRENT_POSITION = {
//     TRIPSHEET_CREATED: 16,
//     ADVANCE_CREATED: 18,
//     NLFD_SHIPMENT_COMPLETED: 22,
//     NLCD_SHIPMENT_COMPLETED: 25,
//     DIESEL_INDENT_CREATION_COMPLETED: 37,
//     DIESEL_INDENT_CONFIRMATION_COMPLETED: 39,
//     DIESEL_INDENT_APPROVAL_COMPLETED: 41,
//     INCOME_CLOSURE_REJECTED: 261,
//   }

//   /* Vehicle Current Parking Status */
//   const VEHICLE_CURRENT_PARKING_STATUS = {
//     HIRE_RMSTO_GATEOUT: 9,
//     HIRE_FGSTO_NLFD_GATEOUT: 10,
//     HIRE_FGSALES_NLCD_GATEOUT: 13,
//     HIRE_FGSTO_NLCD_GATEOUT: 14,
//     HIRE_FGSALES_NLFD_GATEOUT: 17,
//     AFTER_DELIVERY_GATEIN: 19,
//     HIRE_OTHERS_GATEOUT: 21,
//   }

//   function formatDate(date) {
//     var d = new Date(date),
//       month = '' + (d.getMonth() + 1),
//       day = '' + d.getDate(),
//       year = d.getFullYear();

//     if (month.length < 2)
//       month = '0' + month;
//     if (day.length < 2)
//       day = '0' + day;

//     return [day, month, year].join('-');
//   }

//   /* Set Default Date (Today) in a Variable State */
//   const ddd = new Date();
//   // ddd.setMonth(ddd.getMonth() - 1);
//   ddd.setDate(ddd.getDate() - 10);
//   const [defaultDate, setDefaultDate] = React.useState([
//     new Date(ddd),
//     // new Date(getCurrentDate('-')),
//     new Date(getCurrentDate('-')),
//   ])

//   function getCurrentDate(separator = '') {
//     let newDate = new Date()
//     let date = newDate.getDate()
//     let month = newDate.getMonth() + 1
//     let year = newDate.getFullYear()

//     return `${year}${separator}${month < 10 ? `0${month}` : `${month}`}${separator}${date < 10 ? `0${date}` : `${date}`
//       }`
//   }

//   useEffect(() => {
//     console.log(defaultDate)
//     if (defaultDate) {
//       setDefaultDate(defaultDate)
//     } else {
//     }
//   }, [defaultDate])

//   const getDieselVendorNameById = (vendor_id) => {

//     console.log(dvData, 'dieselVendorFinder-dvData')
//     console.log(vendor_id, 'dieselVendorFinder-vendor_id')
//     let vendorName = '-'
//     for (let i = 0; i < dvData.length; i++) {
//       if (dvData[i].diesel_vendor_id == vendor_id) {
//         vendorName = dvData[i].diesel_vendor_name
//       }
//     }
//     console.log(vendorName, 'dieselVendorFinder-vendorName')
//     return vendorName

//     // let driverName = code == '1' ? 'RNS Fuel Station' : 'RS Petroleum'
//     // return driverName
//   }

//   const getVehicleTypeId = (data) => {
//     return Number(
//       typeof data.vehicle_type_id === 'object'
//         ? data.vehicle_type_id?.id
//         : data.vehicle_type_id
//     )
//   }

//   const getClosureVehiclesData = (fresh_type = '') => {
//     if (fresh_type !== '1') {
//       NlmtTripSheetClosureService.getVehicleReadyToExpenseClosureApproval().then((res) => {
//         closureData = res.data.data
//         console.log(closureData,'getVehicleReadyToExpenseClosureApproval')
//         setFetch(true)
        

//         let rowDataList = []
//         const filterData1 = closureData.filter(
//           (data) =>
//             user_locations.indexOf(data.vehicle_location_id) != -1
//         )
//         console.log('ROWSfilterData1:', filterData1)
//         const filterData = filterData1.filter(
//           (data) =>
//           (

//             (
//                data.trip_settlement_info?.tripsheet_is_settled == 1 && data.trip_settlement_info?.approval_status == 0

//             )
//           )
//         )
//         console.log('filterData:', filterData)
//         filterData.map((data, index) => {

//           const vehicleType = Number(data?.vehicle_info?.vehicle_type_id)

//           const vendor = data?.vendor_info ?? {}
//           const shed = vendor?.shed_info ?? {}
//           const advance = data?.advance_payment_info ?? {}
//           const diesel = data?.diesel_intent_info ?? {}
//           const settlement = data?.trip_settlement_info?.approval_status ?? '-'

//           rowDataList.push({
//             sno: index + 1,

//             Tripsheet_No: data?.tripsheet_info?.nlmt_tripsheet_no ?? '-',
//             Tripsheet_Date: data?.tripsheet_info?.created_date ?? '-',
//             Tripsheet_Month: getDateTime(data?.tripsheet_info?.created_at, 2),

//             Vehicle_Type: VEHICLE_TYPE_MAP[vehicleType] ?? '-',
//             Vehicle_No: data?.vehicle_info?.vehicle_number ?? '-',

//             Driver_Name: data?.tripsheet_info?.parking_yard_info?.driver_name ?? '-',
//             Driver_Mobile_No: data?.tripsheet_info?.parking_yard_info?.driver_phone_1 ?? '-',

//             Vendor_Code: vendor?.vendor_code ?? '-',
//             Vendor_Name: vendor?.owner_name ?? '-',
//             Vendor_Mobile_No: vendor?.owner_number ?? '-',
//             Vendor_PAN_No: vendor?.pan_card_number ?? '-',
//             Vendor_Town: vendor?.city ?? '-',

//             HV_Freight_Amount: vehicleType == 22 ? advance?.actual_freight ?? '-' : '-',
//             HV_Freight_DOC_No: vehicleType == 22 ? advance?.sap_freight_payment_document_no ?? '-' : '-',
//             HV_Freight_DOC_Date: vehicleType == 22 ? formatDate(advance?.sap_invoice_posting_date) : '-',

//             HV_Bank_Advance_Amount: vehicleType == 22 ? advance?.advance_payment ?? '-' : '-',
//             HV_Bank_Advance_Doc_No: vehicleType == 22 ? advance?.sap_bank_payment_document_no ?? '-' : '-',

//             HV_Diesel_Advance_amount: vehicleType == 22 ? advance?.advance_payment_diesel ?? '-' : '-',
//             HV_Diesle_Advance_Doc_No: vehicleType == 22 ? advance?.sap_diesel_payment_document_no ?? '-' : '-',

//             Diesel_Bunk_Name: diesel?.diesel_vendor_id
//               ? getDieselVendorNameById(diesel.diesel_vendor_id)
//               : '-',

//             Diesel_Amount: diesel?.total_amount ?? '-',
//             Diesel_Bunk_Invoice_No: diesel?.invoice_no ?? '-',
//             Diesel_Debit_Note_Doc_No: diesel?.diesel_vendor_sap_invoice_no ?? '-',

//             Shed_Name: vehicleType == 22 ? shed?.shed_name ?? '-' : '-',
//             Shed_Mobile_No: vehicleType == 22 ? shed?.shed_owner_phone_1 ?? '-' : '-',

//             Tripsheet_Created_By: data?.tripsheet_info?.trip_user_info?.emp_name ?? '-',

//             Trip_Remarks: data?.trip_remarks ?? '-',

//             Screen_Duration: data?.vehicle_current_position_updated_time ?? '-',
//             Overall_Duration: data?.created_at ?? '-',

//             Action: (
//               <CButton className="badge" color="warning">
//                 <Link className="text-white" to={`/NlmtTSExpenseClosureApprovalHome/${data?.nlmt_trip_in_id}`}>
//                   Expense Approval
//                 </Link>
//               </CButton>
//             ),
//           })
//         })

//         setRowData(rowDataList)
//         setPending(false)
//       })
//     } 
    
//   }

//   useEffect(() => {
//     getClosureVehiclesData()

//     DieselVendorMasterService.getDieselVendors().then((response) => {
//       let viewData = response.data.data
//       console.log(viewData, 'getDieselVendors')
//       setDvData(viewData)
//     })
//   }, [])

//   const columns = [
//     {
//       name: 'S.No',
//       selector: (row) => row.sno,
//       sortable: true,
//       center: true,
//     },
//     {
//       name: 'TripSheet',
//       selector: (row) => row.Tripsheet_No,
//       sortable: true,
//       center: true,
//     },
//     {
//       name: 'Date',
//       selector: (row) => row.Tripsheet_Date,
//       sortable: true,
//       center: true,
//     },
//     {
//       name: 'Veh. Type',
//       selector: (row) => row.Vehicle_Type,
//       sortable: true,
//       center: true,
//     },
//     {
//       name: 'Vehicle No',
//       selector: (row) => row.Vehicle_No,
//       sortable: true,
//       center: true,
//     },
//     {
//       name: 'Driver Name',
//       selector: (row) => row.Driver_Name,
//       sortable: true,
//       center: true,
//     },
//     {
//       name: 'Vendor',
//       selector: (row) => row.Vendor_Name,
//       sortable: true,
//       center: true,
//     },
//     {
//       name: 'Code',
//       selector: (row) => row.Vendor_Code,
//       sortable: true,
//       center: true,
//     },
//     {
//       name: 'Town',
//       selector: (row) => row.Vendor_Town,
//       sortable: true,
//       center: true,
//     },
//     // {
//     //   name: 'Current Status',
//     //   selector: (row) => row.Previous_Status,
//     //   center: true,
//     // }, 
//     {
//       name: 'Screen Duration',
//       selector: (row) => row.Screen_Duration,
//       center: true,
//       sortable: true,
//     },
//     // {
//     //   name: ' Overall Duration',
//     //   selector: (row) => row.Overall_Duration,
//     //   center: true,
//     //   sortable: true,
//     // },
//     {
//       name: 'Action',
//       selector: (row) => row.Action,
//       center: true,
//     },
//   ]

//   return (
//     <>
//       {!fetch && <Loader />}
//       {fetch && (
//         <>
//           {screenAccess ? (
//             <>
//               <CCard className="mt-4">
//                 <CContainer className="mt-2">
//                   <CRow className="mt-3">
//                     <CCol xs={12} md={3}></CCol>

//                     <CCol
//                       className="offset-md-6"
//                       xs={12}
//                       sm={9}
//                       md={3}
//                       style={{ display: 'flex', justifyContent: 'end' }}
//                     >
                      
//                       <CButton
//                         size="lg-sm"
//                         color="warning"
//                         className="m-3 px-3 text-white"
//                         onClick={(e) => {
//                           exportToCSV()
//                         }}
//                       >
//                         Export
//                       </CButton>
//                     </CCol>
//                   </CRow>
//                   <CustomTable
//                     columns={columns}
//                     data={rowData}
//                     fieldName={'Driver_Name'}
//                     showSearchFilter={true}
//                   />
//                 </CContainer>
//               </CCard>
//             </>
//           ) : (
//             <AccessDeniedComponent />
//           )}
//         </>
//       )}
//     </>
//   )
// }

// export default NlmtTSHireExpApprovalHome

import { React } from 'react'
import maintenance_logo from 'src/assets/naga/main2.png'

const NlmtTSHireExpApprovalHome = () => {
  return (
    <>
      <div className="card mt-3">
        <img style={{ margin: '5% 25%', borderRadius: '30%' }} src={maintenance_logo} />
      </div>
    </>
  )
}

export default NlmtTSHireExpApprovalHome
