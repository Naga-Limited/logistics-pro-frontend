import React, { useEffect, useState } from 'react'

import CIcon from '@coreui/icons-react'
import { 
  cilCalculator, 
  cilInput, 
  cilCog,
  cilNotes, 
  cilStar,
  cilSpreadsheet, 
  cilNewspaper, 
  cilCash, 
  cilPenNib, 
  cilControl, 
  cilInfo,
  cilAirplay,
  cilTruck, 
  cilWallet, 
  cilBriefcase,
  cilLocomotive, 
  cilGroup,
  cilPaintBucket,
  cilCreditCard,
  cilExposure,
  cilBasket,
  cilBank,
  cilHome,
  cilSettings,
  cibCentos, 
  cilMediaRecord,
  cilLevelDown,
  cilLayers,
  cilMemory,
  cilMoney,
  cilCheckAlt,
  cilCheckCircle,
} from '@coreui/icons'
import { CNavGroup, CNavGroupItems, CNavItem, CNavTitle } from '@coreui/react'
import { useLocation } from 'react-router-dom'

const page_permission_json = localStorage.getItem('page_permission')
const page_permission = JSON.parse(page_permission_json)
console.log(page_permission,'page_permission')

const user_info_json = localStorage.getItem('user_info')
const user_info = JSON.parse(user_info_json)
// console.log(page_permission)
const user_admin = user_info && user_info.is_admin == '1' ? true : false
const all_users = user_info && user_info.is_admin != '1' ? true : false

// const location = useLocation();
// console.log(location.pathname,'location.pathname')

// const str = location.pathname;
// const substr = 'DriverInvoiceAttachment';
// const DIV_HAVING = str.includes(substr)

// console.log(DIV_HAVING,'DIV_HAVING');

// if(DIV_HAVING){

// } else {

// }

var _nav1 = {}
var _nav111 = {}
var _nav2 = {}
var _nav3 = {}
var _nav4 = {}
var _nav5 = {}
var _nav6 = {}
var _nav7 = {}
var _nav8 = {}
var _nav9 = {}
var _navVCHead = {}
var _nav10 = {}
var _nav11 = {}
var _nav12 = {}
var _nav13 = {}
var _navTSHead = {}
var _nav45 = {}
var _nav451 = {} 
var _nav14 = {}
var _nav15 = {}
var _nav202 = {}
var _nav49 = {}
var _navADVHead = {}
var _nav44 = {}
var _nav16 = {}
var _nav17 = {}
var _navVAHead = {}
var _nav18 = {}
var _nav181 = {}
var _nav201 = {}
var _nav108 = {}
var _nav109 = {}
var _nav110 = {}
var _nav19 = {}
var _nav20 = {}
var _nav21 = {}
var _navCCHead = {}
var _nav22 = {}
var _nav23 = {}
var _nav24 = {}
var _nav25 = {}
var _navRJHead = {}
var _nav26 = {}
var _nav261 = {}
var _nav27 = {}
var _navDIHead = {}
var _navFSHead = {}
var _nav28 = {}
var _nav281 = {}
var _nav29 = {}
var _nav30 = {}
var _nav31 = {}
var _navTSCHead = {}
var _nav32 = {}
var _nav321 = {}
var _nav33 = {}
var _nav34 = {}
var _nav35 = {}
var _nav36 = {}
var _nav37 = {}
var _navReportsHead = {}
var _nav38 = {}
var _nav39 = {}
var _nav40 = {}
var _nav41 = {}
var _nav42 = {}
var _navVESTHead = {}
var _nav43 = {}
var _nav431 = {} /* Regular Tripsheet Search */
var _nav434 = {} /* Own Vehicle Status */
var _nav432 = {} /* Rake Tripsheet Search */
var _nav433 = {} /* FCI Tripsheet Search */
var _nav46 = {}
var _nav47 = {}
var _nav48 = {}

var _navTripPaymentHead = {}
var _nav71 = {} /* Trip Hire Payment */
var _nav72 = {} /* Trip Income Debit */
var _nav73 = {} /* Trip Payment Report */

var _navBBReportsHead = {}

var _nav191 = {} /* Over Speed Report */
var _nav192 = {} /* Harsh Braking Report */
var _nav193 = {} /* Harsh Accelaration Report */
var _nav194 = {} /* Rash Turn Report */
var _nav195 = {} /* Fuel Filling Report */
var _nav196 = {} /* Fuel Theft Report */
var _nav197 = {} /* Fuel Mileage Report */
var _nav198 = {} /* Fuel Disconnection Report */
var _nav199 = {} /* Geo Fence Violation Report */
var _nav200 = {} /* Battery Disconnection Report */

/*=================================================================================================*/

var _nav189 = {} /* Syatem Admin Settings */
var _nav190 = {} /* NLLD Admin Settings */
var _nav191 = {} /* Black Box Vendor Report Screens */

/* Vehicle Request Master */
var _navVehicleRequestHead = {}
var _nav104 = {} /* Vehicle Request Master */
var _nav105 = {} /* Vehicle Request Report */

var _navTripDeliveryTrackHead = {}
var _nav77 = {} /* Delivery Track Screen */
var _nav78 = {} /* Delivery Track Report */

var _nav203 = {} /* Vendor Extension Screen */
var _nav204 = {} /* Customer Extension Screen */
var _nav205 = {} /* Open Tripsheets Information Report */
var _nav206 = {} /* Report Visit Info. Report */

var _navOwnVehicleTripInfoTrackHead = {}
var _nav207 = {} /* Report Visit Info. Report */
var _nav253 = {} /* Trip Info Push To SAP Table */
var _nav254 = {} /* Trip Info Edit */
var _nav255 = {} /* Invoice Attachment Bulk Upload */
var _nav208 = {} /* Own vehicle TIC Report */
var _nav209 = {} /* Version Info Details */
var _nav210 = {} /* Hire Vehicles Freight Info. Report */
var _nav211 = {} /* Own vehicle TIC RJ Report */
var _nav212 = {} /* Driver Invoice Attachment Screen */
var _nav213 = {} /* DT Despatch Screen */
var _nav214 = {} /* Invoice Attachment Report */

var _navVehicleUtilizationHead = {}
var _nav239 = {} /* Own Vehicles FG-SALES Report */
var _nav240 = {} /* Hire vehicles FG-SALES Report */
var _nav241 = {} /* Own Vehicles Others Report */
var _nav242 = {} /* Hire vehicles Others Report */
var _nav243 = {} /* Diesel Indent Accounts Approval */
var _nav244 = {} /* LP Diesel Indent Sequence Number Creation */
var _nav245 = {} /* NLFS Diesel Indent Sequence Number Creation */
var _nav246 = {} /* LP Diesel Indent Vendor Invoice Creation */
var _nav247 = {} /* LP Diesel Indent Payment Entry Screen */
var _nav248 = {} /* LP Diesel Indent Payment Report */
var _nav249 = {} /* LP Diesel Indent Receipt Creation Screen */
var _nav250 = {} /* NLFS Diesel Indent Report */
var _nav251 = {} /* NLFD Freight Report */
var _nav252 = {} /* NLCD Freight Report */
 
/* =========== 1) Depo Process Head Part Start =========== */

var _nav220 = {} /* Depo Process Head */ 

let depo_foods_array = [50,51,52,53,63]
let depo_exp_array = [54,64]
let depo_pay_array = [65,66,69]
let depo_rep_array = [55,56,67,68,70,80,81]
let depo_mas_array = [57,58,59,60,61,62]

let depoMergedArray = depo_foods_array
  .concat(depo_exp_array)
  .concat(depo_pay_array)
  .concat(depo_rep_array)
  .concat(depo_mas_array) 

console.log(page_permission,'page_permission - page_permission')
console.log(depoMergedArray,'page_permission - depoMergedArray')

_nav220 = {
  component: CNavGroup, 
  name: 'Depo Process',
  level: 'grandparent',
  to: '/DepoVehicleGateIn',
  is_restricted: 1,
  permission: depoMergedArray, // 👈 Grand Parent Depo permission
  icon: <CIcon icon={cilControl} customClassName="nav-icon" />,
  items: [
    {
      component: CNavGroup,
      name: 'DEPO Foods',
      level: 'parent',
      to: '/DepoVehicleGateIn',
      is_restricted: 1,
      permission_ca: depo_foods_array, // 👈 Parent Depo Foods permission
      icon: <CIcon icon={cilTruck} customClassName="nav-icon" />,
      items: [
        {
          component: CNavItem,
          name: 'Gate-In / Out',
          to: '/DepoVehicleGateIn',
          datatoggle: 'tooltip',
          title: 'Depo Vehicle Gate IN',
          level: 'child', 
          is_restricted: 1,
          permission_ca: [50], // 👈 Child Depo Vehicle Gate IN permission
          icon: <CIcon icon={cilMediaRecord} customClassName="nav-icon" />, 
        },
        {
          component: CNavItem,
          name: 'Vehicle Inspection',
          level: 'child',
          to: '/DepoVehicleInspectionHome',
          is_restricted: 1,
          permission_ca: [51], // 👈 Child Depo Vehicle Inspection permission
          icon: <CIcon icon={cilMediaRecord} customClassName="nav-icon" />,
          datatoggle: 'tooltip',
          title: 'Depo Vehicle Inspection',
        },
        {
          component: CNavItem,
          name: 'Tripsheet Creation',
          level: 'child',
          to: '/DepoTripsheetCreationHome',
          is_restricted: 1,
          permission_ca: [52], // 👈 Depo Tripsheet Creation permission
          icon: <CIcon icon={cilMediaRecord} customClassName="nav-icon" />,
          datatoggle: 'tooltip',
          title: 'Depo Tripsheet Creation',
        },        
        {
          component: CNavItem,
          name: 'Vehicle Assignment',
          to: '/DepoVehicleAssignment',
          datatoggle: 'tooltip',
          title: 'Depo Vehicle Assignment',
          level: 'child', 
          is_restricted: 1,
          permission_ca: [53], // 👈 Child Depo Vehicle Assignment permission
          icon: <CIcon icon={cilMediaRecord} customClassName="nav-icon" />, 
        },
        {
          component: CNavItem,
          name: 'Shipment Approval',
          to: '/DepoShipmentApprovalTable',
          datatoggle: 'tooltip',
          title: 'Depo Shipment Approval',
          level: 'child', 
          is_restricted: 1,
          permission_ca: [63], // 👈 Child Depo Shipment Approval permission
          icon: <CIcon icon={cilMediaRecord} customClassName="nav-icon" />, 
        }, 
      ],
    },
    {
      component: CNavGroup,
      name: 'DEPO Expenses',
      level: 'parent',
      to: '/DepoExpenseClosureHome',
      is_restricted: 1,
      permission_ca: depo_exp_array, // 👈 Parent Depo Expenses permission
      icon: <CIcon icon={cilExposure} customClassName="nav-icon" />,
      items: [
        {
          component: CNavItem,
          name: 'Expense Closure',
          to: '/DepoExpenseClosureHome',
          datatoggle: 'tooltip',
          title: 'Depo - Expense Closure',
          level: 'child', 
          is_restricted: 1,
          permission_ca: [54], // 👈 Child Depo Expense Closure permission
          icon: <CIcon icon={cilMediaRecord} customClassName="nav-icon" />, 
        },
        {
          component: CNavItem,
          name: 'Expense Approval',
          to: '/DepoExpenseApprovalTable',
          datatoggle: 'tooltip',
          title: 'Depo - Additional Expense Approval',
          level: 'child', 
          is_restricted: 1,
          permission_ca: [64], // 👈 Child Depo Expense Closure Approval permission
          icon: <CIcon icon={cilMediaRecord} customClassName="nav-icon" />, 
        }, 
      ],
    },
    {
      component: CNavGroup,
      name: 'DEPO Payment', 
      level: 'parent',
      to: '/DepoSettlementClosureHome',
      is_restricted: 1,
      permission_ca: depo_pay_array, // 👈 Parent Depo Payment permission
      icon: <CIcon icon={cilTruck} customClassName="nav-icon" />,
      items: [
        {
          component: CNavItem,
          name: 'Payment Submission',
          level: 'child',
          to: '/DepoSettlementClosureHome',
          is_restricted: 1,
          permission_ca: [65], // 👈 Child Depo Payment Submission permission
          icon: <CIcon icon={cilMediaRecord} customClassName="nav-icon" />,
          datatoggle: 'tooltip',
          title: 'Depo - Payment Submission',
        },
        {
          component: CNavItem,
          name: 'Payment Approval',
          level: 'child',
          to: '/DepoSettlementApprovalTable',
          is_restricted: 1,
          permission_ca: [66], // 👈 Child Depo Payment Approval permission
          icon: <CIcon icon={cilMediaRecord} customClassName="nav-icon" />,
          datatoggle: 'tooltip',
          title: 'Depo - Payment Approval',
        },
        {
          component: CNavItem,
          name: 'Payment Validation',
          level: 'child',
          to: '/DepoSettlementValidationTable',
          is_restricted: 1,
          permission_ca: [69], // 👈 Child Depo Payment Validation permission
          icon: <CIcon icon={cilMediaRecord} customClassName="nav-icon" />,
          datatoggle: 'tooltip',
          title: 'Depo - Payment Validation',
        },  
      ],
    },
    {
      component: CNavGroup,
      name: 'DEPO Reports',
      to: '/DepoTripsheetReport',
      permission_ca: depo_rep_array, // 👈 Parent Depo Report permission
      level: 'parent',
      is_restricted: 1,
      icon: <CIcon icon={cilInfo} customClassName="nav-icon" />,
      items: [
        {
          component: CNavItem,
          name: 'Tripsheet Report',
          level: 'child',
          to: '/DepoTripsheetReport',
          is_restricted: 1,
          permission_ca: [67], // 👈 Child Depo Tripsheet Report permission
          icon: <CIcon icon={cilMediaRecord} customClassName="nav-icon" />,
          datatoggle: 'tooltip',
          title: 'Depo - Tripsheet Report',
        },  
        {
          component: CNavItem,
          name: 'Depo Freight Report',
          level: 'child',
          to: '/DepoRoutefreightReport',
          is_restricted: 1,
          permission_ca: [81], // 👈 Child Depo Freight Report permission
          icon: <CIcon icon={cilMediaRecord} customClassName="nav-icon" />,
          datatoggle: 'tooltip',
          title: 'Depo Freight Report',
        },
        {
          component: CNavItem,
          name: 'Depo Customer Report',
          level: 'child',
          to: '/DepoCustomerReport',
          is_restricted: 1,
          permission_ca: [80], // 👈 Child Depo Customer Report permission
          icon: <CIcon icon={cilMediaRecord} customClassName="nav-icon" />,
          datatoggle: 'tooltip',
          title: 'Depo Customer Report',
        },
        {
          component: CNavItem,
          name: 'Delivery Report',
          level: 'child',
          to: '/DepoDeliveryReport',
          is_restricted: 1,
          permission_ca: [70], // 👈 Child Depo Delivery Report permission
          icon: <CIcon icon={cilMediaRecord} customClassName="nav-icon" />,
          datatoggle: 'tooltip',
          title: 'Depo Delivery Report',
        },
        {
          component: CNavItem,
          name: 'Shipment Report',
          to: '/DepoShipmentReport',
          datatoggle: 'tooltip',
          title: 'Depo Shipment Report',
          level: 'child', 
          is_restricted: 1,
          permission_ca: [68], // 👈 Child Depo Shipment Report permission
          icon: <CIcon icon={cilMediaRecord} customClassName="nav-icon" />, 
        }, 
        {
          component: CNavItem,
          name: 'Vehicles Report',
          level: 'child',
          to: '/DepoVehiclesReport',
          is_restricted: 1,
          permission_ca: [55], // 👈 Child Depo Vehicles Report permission
          icon: <CIcon icon={cilMediaRecord} customClassName="nav-icon" />,
          datatoggle: 'tooltip',
          title: 'Depo Vehicles Report',
        },
        {
          component: CNavItem,
          name: 'Payment Report',
          level: 'child',
          to: '/DepoFinalReport',
          is_restricted: 1,
          permission_ca: [56], // 👈 Child Depo Payment Report permission
          icon: <CIcon icon={cilMediaRecord} customClassName="nav-icon" />,
          datatoggle: 'tooltip',
          title: 'Depo Payment Report',
        }        
      ],
    },
    {
      component: CNavGroup,
      name: 'DEPO Master',
      level: 'parent',
      to: '/DepoContractorMasterTable',
      is_restricted: 1,
      permission_ca: depo_mas_array, // 👈 Parent Depo Master permission
      icon: <CIcon icon={cilBriefcase} customClassName="nav-icon" />,
      items: [
        {
          component: CNavItem,
          name: 'Contractor Master',
          level: 'child',
          to: '/DepoContractorMasterTable',
          is_restricted: 1,
          permission_ca: [57], // 👈 Child Depo Contractor Master permission
          icon: <CIcon icon={cilMediaRecord} size="sm" customClassName="nav-icon" />,
          datatoggle: 'tooltip',
          title: 'Depo - Contractor Master',
        },  
        {
          component: CNavItem,
          name: 'Customer Master',
          level: 'child',
          is_restricted: 1,
          to: '/DepoCustomerMasterTable',
          permission_ca: [62], // 👈 Child Depo Customer Master permission
          icon: <CIcon icon={cilMediaRecord} size="sm" customClassName="nav-icon" />,
          datatoggle: 'tooltip',
          title: 'Depo - Customer Master',
        },  
        {
          component: CNavItem,
          name: 'Driver Master',
          level: 'child',
          is_restricted: 1,
          to: '/DepoDriverMasterTable',
          permission_ca: [59], // 👈 Child Depo Driver Master permission
          icon: <CIcon icon={cilMediaRecord} size="sm" customClassName="nav-icon" />,
          datatoggle: 'tooltip',
          title: 'Depo Driver Master',
        },  
        {
          component: CNavItem,
          name: 'Vehicle Master',
          level: 'child',
          is_restricted: 1,
          to: '/DepoVehicleMasterTable',
          permission_ca: [58], // 👈 Child Depo Vehicle Master permission
          icon: <CIcon icon={cilMediaRecord} size="sm" customClassName="nav-icon" />,
          datatoggle: 'tooltip',
          title: 'Depo Vehicle Master',
        },
        {
          component: CNavItem,
          name: 'Route Master',
          level: 'child',
          is_restricted: 1,
          to: '/DepoRouteMasterTable',
          permission_ca: [60], // 👈 Child Depo Route Master permission
          icon: <CIcon icon={cilMediaRecord} size="sm" customClassName="nav-icon" />,
          datatoggle: 'tooltip',
          title: 'Depo Route Master',
        },
        {
          component: CNavItem,
          name: 'Freight Master',
          level: 'child',
          is_restricted: 1,
          to: '/DepoFreightMasterTable',
          permission_ca: [61], // 👈 Child Depo Freight Master permission
          icon: <CIcon icon={cilMediaRecord} size="sm" customClassName="nav-icon" />,
          datatoggle: 'tooltip',
          title: 'Depo Freight Master',
        },  
      ],
    },
  ],
}

/* =========== 1) Depo Process Head Part End =========== */

/* =========== 2) Rake Process Head Part Start =========== */

var _nav221 = {} /* Rake Process Head */

let rake_mov_array = [74,75,76,77]
let rake_setl_array = [78,79,82]
let rake_pay_array = [84]
let rake_rep_array = [87,88,89,90,91,92,94]
let rake_mas_array = [93]

let rakeMergedArray = rake_mov_array
  .concat(rake_setl_array)
  .concat(rake_pay_array)
  .concat(rake_rep_array)
  .concat(rake_mas_array) 

console.log(page_permission,'page_permission - page_permission')
console.log(rakeMergedArray,'page_permission - rakeMergedArray')
 
_nav221 = {
  component: CNavGroup,
  name: 'Rake Process',
  level: 'grandparent',
  to: '/Master',
  is_restricted: 1,
  permission: rakeMergedArray, // 👈 Grand Parent Rake permission
  icon: <CIcon icon={cilControl} customClassName="nav-icon" />,
  items: [
    {
      component: CNavGroup,
      name: 'Rake Movement',
      level: 'parent',
      to: '/RakeBdcUpload',
      is_restricted: 1,
      permission_ca: rake_mov_array, // 👈 Parent Rake Movement permission
      icon: <CIcon icon={cilTruck} customClassName="nav-icon" />,
      items: [
        {
          component: CNavItem,
          name: 'BDC Upload',
          level: 'child',
          to: '/RakeBdcUpload',
          is_restricted: 1,
          permission_ca: [74], // 👈 Child Rake BDC Upload permission
          icon: <CIcon icon={cilMediaRecord} customClassName="nav-icon" />,
          datatoggle: 'tooltip',
          title: 'Rake - BDC Upload',
        },
        {
          component: CNavItem,
          name: 'TS Edit',
          level: 'child',
          to: '/RakeTripsheetEditHome',
          is_restricted: 1,
          permission_ca: [75], // 👈 Child Rake Tripsheet Edit permission
          icon: <CIcon icon={cilMediaRecord} customClassName="nav-icon" />,
          datatoggle: 'tooltip',
          title: 'Rake - Tripsheet Edit',
        },
        {
          component: CNavItem,
          name: 'Exp. Submission',
          level: 'child',
          to: '/RakeExpenseSubmissionHome',
          is_restricted: 1,
          permission_ca: [76], // 👈 Child Rake Expense Submission permission
          icon: <CIcon icon={cilMediaRecord} customClassName="nav-icon" />,
          datatoggle: 'tooltip',
          title: 'Rake - Expenses Submission',
        },
        {
          component: CNavItem,
          name: 'Exp. Approval',
          level: 'child',
          to: '/RakeExpenseSubmissionApprovalHome',
          is_restricted: 1,
          permission_ca: [77], // 👈 Child Rake Expense Submission Approval permission
          icon: <CIcon icon={cilMediaRecord} customClassName="nav-icon" />,
          datatoggle: 'tooltip',
          title: 'Rake - Expenses Approval',
        },

        {
          component: CNavItem,
          name: 'Old Entry Clearance',
          level: 'child',
          to: '/RakeClearance',
          is_restricted: 1,
          permission_ca: [77], // 👈 Child Rake Old Entry Clearance permission
          icon: <CIcon icon={cilMediaRecord} customClassName="nav-icon" />,
          datatoggle: 'tooltip',
          title: 'Rake - Old Entry Clearance',
        }, 
      ],
    },
    {
      component: CNavGroup,
      name: 'Rake Settlement',
      level: 'parent',
      to: '/RakeIncomeClosureHome',
      permission_ca: rake_setl_array, // 👈 Parent Rake Settlement permission
      icon: <CIcon icon={cilExposure} customClassName="nav-icon" />,
      items: [
        {
          component: CNavItem,
          name: 'Income Posting',
          level: 'child',
          to: '/RakeIncomeClosureHome', 
          is_restricted: 1,
          permission_ca: [78], // 👈 Child Rake Income Posting permission
          icon: <CIcon icon={cilMediaRecord} customClassName="nav-icon" />,
          datatoggle: 'tooltip',
          title: 'Rake - Income Posting',
        },
        {
          component: CNavItem,
          name: 'Exp. Validation',
          level: 'child',
          to: '/RakeExpenseClosureHome',
          is_restricted: 1,
          permission_ca: [79], // 👈 Child Rake Expense Validation permission
          icon: <CIcon icon={cilMediaRecord} customClassName="nav-icon" />,
          datatoggle: 'tooltip',
          title: 'Rake - Expense Validation',
        },
        {
          component: CNavItem,
          name: 'Exp. Posting',
          level: 'child',
          to: '/RakeSettlementClosureHome',
          is_restricted: 1,
          permission_ca: [82], // 👈 Child Rake Expense Posting permission
          icon: <CIcon icon={cilMediaRecord} customClassName="nav-icon" />,
          datatoggle: 'tooltip',
          title: 'Rake - Expense Posting',
        }, 
      ],
    },
    {
      component: CNavGroup,
      name: 'Rake Payment', 
      level: 'parent',
      to: '/RakePayment',
      permission_ca: rake_pay_array, // 👈 Parent Rake Payment permission
      icon: <CIcon icon={cilTruck} customClassName="nav-icon" />,
      items: [
        {
          component: CNavItem,
          name: 'Payment Posting',
          level: 'child',
          to: '/RakePayment',
          is_restricted: 1,
          permission_ca: [84], // 👈 Child Rake Payment permission
          icon: <CIcon icon={cilMediaRecord} customClassName="nav-icon" />,
          datatoggle: 'tooltip',
          title: 'Rake - Payment Posting',
        },  
      ],
    },
    {
      component: CNavGroup,
      name: 'Rake Report',
      to: '/RakeTripsheetReport',
      permission_ca: rake_rep_array, // 👈 Parent Rake Report permission
      level: 'parent',
      icon: <CIcon icon={cilInfo} customClassName="nav-icon" />,
      items: [
        {
          component: CNavItem,
          name: 'Tripsheet Report',
          level: 'child',
          to: '/RakeTripsheetReport',
          is_restricted: 1,
          permission_ca: [87], // 👈 Child Rake Tripsheet Report permission
          icon: <CIcon icon={cilMediaRecord} customClassName="nav-icon" />,
          datatoggle: 'tooltip',
          title: 'Rake - Tripsheet Report',
        },  
        {
          component: CNavItem,
          name: 'Migo Report',
          level: 'child',
          to: '/RakeMigoReport',
          is_restricted: 1,
          permission_ca: [89], // 👈 Child Rake Migo Report permission
          icon: <CIcon icon={cilMediaRecord} customClassName="nav-icon" />,
          datatoggle: 'tooltip',
          title: 'Rake - MIGO Report',
        },
        {
          component: CNavItem,
          name: 'FNR Report',
          level: 'child',
          to: '/RakeFNRReport',
          is_restricted: 1,
          permission_ca: [89], // 👈 Child Rake FNR Report permission
          icon: <CIcon icon={cilMediaRecord} customClassName="nav-icon" />,
          datatoggle: 'tooltip',
          title: 'Rake - FNR Report',
        },
        {
          component: CNavItem,
          name: 'RPS Report',
          level: 'child',
          to: '/RakeExpenseReport',
          is_restricted: 1,
          permission_ca: [88], // 👈 Child Rake RPS Report permission
          icon: <CIcon icon={cilMediaRecord} customClassName="nav-icon" />,
          datatoggle: 'tooltip',
          title: 'Rake - Payment Seq. Report',
        },
        {
          component: CNavItem,
          name: 'Settlment Report',
          level: 'child',
          to: '/RakeSettlementReport',
          is_restricted: 1,
          permission_ca: [90], // 👈 Child Rake Settlment Report permission
          icon: <CIcon icon={cilMediaRecord} customClassName="nav-icon" />,
          datatoggle: 'tooltip',
          title: 'Rake - Settlement Report',
        },
        {
          component: CNavItem,
          name: 'RPS Payment',
          level: 'child',
          to: '/RakePaymentReport',
          is_restricted: 1,
          permission_ca: [91], // 👈 Child Rake RPS Payment Report permission
          icon: <CIcon icon={cilMediaRecord} customClassName="nav-icon" />,
          datatoggle: 'tooltip',
          title: 'Rake - RPS Payment Report',
        },
        {
          component: CNavItem,
          name: 'Vendor Payment',
          level: 'child',
          to: '/RakeVendorPaymentReport',
          is_restricted: 1,
          permission_ca: [94], // 👈 Child Rake Vendor Payment Report permission
          icon: <CIcon icon={cilMediaRecord} customClassName="nav-icon" />,
          datatoggle: 'tooltip',
          title: 'Rake - Vendor Payment Report',
        },
        {
          component: CNavItem,
          name: 'FI Entry Report',
          level: 'child',
          to: '/RakeFIEntryReport',
          is_restricted: 1,
          permission_ca: [92], // 👈 Child Rake FI Entry Report permission
          icon: <CIcon icon={cilMediaRecord} customClassName="nav-icon" />,
          datatoggle: 'tooltip',
          title: 'Rake - FI Entry Report',
        }
        
      ],
    },
    {
      component: CNavGroup,
      name: 'Rake Master',
      level: 'parent',
      to: '/RakeVendorMasterTable',
      is_restricted: 1,
      permission_ca: rake_mas_array, // 👈 Parent Rake Master permission
      icon: <CIcon icon={cilBriefcase} customClassName="nav-icon" />,
      items: [
        {
          component: CNavItem,
          name: 'Vendor Master',
          level: 'child',
          to: '/RakeVendorMasterTable',
          permission_ca: [93], // 👈 Child Rake Vendor Master permission
          icon: <CIcon icon={cilMediaRecord} size="sm" customClassName="nav-icon" />,
          datatoggle: 'tooltip',
          title: 'Rake - Vendor Master',
        },  
      ],
    },
  ],
}

/* =========== 2) Rake Process Head Part End =========== */

/* =========== 3) FCI Process Head Part Start =========== */

var _nav222 = {} /* FCI Process Head */

let fci_mov_array = [151,152,153,157,158,168,173,174]
let fci_setl_array = [169,70,71]
let fci_pay_array = [175]
let fci_rep_array = [159,162,163,164,165,166,167]
let fci_vc_array = [154,155,156,161]

let fciMergedArray = fci_mov_array
  .concat(fci_setl_array)
  .concat(fci_pay_array)
  .concat(fci_rep_array)
  .concat(fci_vc_array) 

console.log(page_permission,'page_permission - page_permission')
console.log(fciMergedArray,'page_permission - fciMergedArray')

_nav222 = {
  component: CNavGroup, 
  name: 'FCI Process',
  level: 'grandparent',
  to: '/FCIBdcUpload',
  is_restricted: 1,
  permission: fciMergedArray, // 👈 Grand Parent FCI permission
  icon: <CIcon icon={cilControl} customClassName="nav-icon" />,
  items: [
    {
      component: CNavGroup,
      name: 'FCI Movement',
      level: 'parent',
      to: '/FCIBdcUpload',
      is_restricted: 1,
      permission_ca: fci_mov_array, // 👈 Parent FCI Movement permission
      icon: <CIcon icon={cilTruck} customClassName="nav-icon" />,
      items: [
        {
          component: CNavItem,
          name: 'FCI Plant Mater',
          to: '/FCIPlantMasterHome',
          datatoggle: 'tooltip',
          title: 'FCI - Plant Master',
          level: 'child', 
          is_restricted: 1,
          permission_ca: [151], // 👈 Child FCI Plant Master permission
          icon: <CIcon icon={cilMediaRecord} customClassName="nav-icon" />, 
        },
        {
          component: CNavItem,
          name: 'Tripsheet Creation',
          level: 'child',
          to: '/FCIBdcUpload',
          is_restricted: 1,
          permission_ca: [152], // 👈 FCI Tripsheet Creation permission
          icon: <CIcon icon={cilMediaRecord} customClassName="nav-icon" />,
          datatoggle: 'tooltip',
          title: 'FCI - Tripsheet Creation',
        },
        {
          component: CNavItem,
          name: 'TS Edit',
          level: 'child',
          to: '/FCITripsheetEditHome',
          is_restricted: 1,
          permission_ca: [153], // 👈 Child FCI Tripsheet Edit permission
          icon: <CIcon icon={cilMediaRecord} customClassName="nav-icon" />,
          datatoggle: 'tooltip',
          title: 'FCI - Tripsheet Edit',
        },
        {
          component: CNavItem,
          name: 'Freight Vendor Assn.',
          to: '/FreightExpenseSubmissionHome',
          datatoggle: 'tooltip',
          title: 'FCI - Freight Payment Vendor Assignment',
          level: 'child', 
          is_restricted: 1,
          permission_ca: [158], // 👈 Child FCI Freight Vendor Assignment permission
          icon: <CIcon icon={cilMediaRecord} customClassName="nav-icon" />, 
        },
        {
          component: CNavItem,
          name: 'VA Freight Approval',
          to: '/FreightExpenseSubmissionApprovalHome',
          datatoggle: 'tooltip',
          title: 'FCI - Freight Payment Vendor Assignment Approval',
          level: 'child', 
          is_restricted: 1,
          permission_ca: [173], // 👈 Child FCI VA Freight Approval permission
          icon: <CIcon icon={cilMediaRecord} customClassName="nav-icon" />, 
        },
        {
          component: CNavItem,
          name: 'Loading Vendor Assn.',
          to: '/LoadingExpenseSubmissionHome',
          datatoggle: 'tooltip',
          title: 'FCI - Loading Payment Vendor Assignment',
          level: 'child', 
          is_restricted: 1,
          permission_ca: [157], // 👈 Child FCI Loading Vendor Assignment permission
          icon: <CIcon icon={cilMediaRecord} customClassName="nav-icon" />, 
        },
        {
          component: CNavItem,
          name: 'VA Loading Approval',
          to: '/LoadingExpenseSubmissionApprovalHome',
          datatoggle: 'tooltip',
          title: 'FCI - Loading Payment Vendor Assignment Approval',
          level: 'child', 
          is_restricted: 1,
          permission_ca: [174], // 👈 Child FCI VA Loading Approval permission
          icon: <CIcon icon={cilMediaRecord} customClassName="nav-icon" />, 
        },
        {
          component: CNavItem,
          name: 'Old Entry Clearance',
          level: 'child',
          to: '/FCIClearance',
          is_restricted: 1,
          permission_ca: [168], // 👈 Child FCI Old Entry Clearance permission
          icon: <CIcon icon={cilMediaRecord} customClassName="nav-icon" />,
          datatoggle: 'tooltip',
          title: 'FCI - Old Entry Clearance',
        }, 
      ],
    },
    {
      component: CNavGroup,
      name: 'FCI Settlement',
      level: 'parent',
      to: '/RakeIncomeClosureHome',
      is_restricted: 1,
      permission_ca: fci_setl_array, // 👈 Parent FCI Settlement permission
      icon: <CIcon icon={cilExposure} customClassName="nav-icon" />,
      items: [
        {
          component: CNavItem,
          name: 'Expense Validation',
          to: '/FCIExpenseValidationHome',
          datatoggle: 'tooltip',
          title: 'FCI - Expense Validation Home',
          level: 'child', 
          is_restricted: 1,
          permission_ca: [169], // 👈 Child FCI Expense Validation permission
          icon: <CIcon icon={cilMediaRecord} customClassName="nav-icon" />, 
        },
        {
          component: CNavItem,
          name: 'Expense Posting',
          to: '/FCIExpensePostingHome',
          datatoggle: 'tooltip',
          title: 'FCI - Expense Posting Home',
          level: 'child', 
          is_restricted: 1,
          permission_ca: [170], // 👈 Child FCI Expense Posting permission
          icon: <CIcon icon={cilMediaRecord} customClassName="nav-icon" />, 
        },
        {
          component: CNavItem,
          name: 'Income Closure',
          to: '/FCIIncomeClosureHome',
          datatoggle: 'tooltip',
          title: 'FCI - Income Closure Home',
          level: 'child', 
          is_restricted: 1,
          permission_ca: [171], // 👈 Child FCI Income Closure permission
          icon: <CIcon icon={cilMediaRecord} customClassName="nav-icon" />, 
        }, 
      ],
    },
    {
      component: CNavGroup,
      name: 'FCI Payment', 
      level: 'parent',
      to: '/FCIPayment',
      is_restricted: 1,
      permission_ca: fci_pay_array, // 👈 Parent FCI Payment permission
      icon: <CIcon icon={cilTruck} customClassName="nav-icon" />,
      items: [
        {
          component: CNavItem,
          name: 'Payment Posting',
          level: 'child',
          to: '/FCIPayment',
          is_restricted: 1,
          permission_ca: [175], // 👈 Child FCI Payment permission
          icon: <CIcon icon={cilMediaRecord} customClassName="nav-icon" />,
          datatoggle: 'tooltip',
          title: 'FCI - Payment Posting',
        },  
      ],
    },
    {
      component: CNavGroup,
      name: 'FCI Report',
      to: '/FCITripsheetReport',
      permission_ca: fci_rep_array, // 👈 Parent FCI Report permission
      level: 'parent',
      is_restricted: 1,
      icon: <CIcon icon={cilInfo} customClassName="nav-icon" />,
      items: [
        {
          component: CNavItem,
          name: 'Tripsheet Info',
          level: 'child',
          to: '/FCITripsheetReport',
          is_restricted: 1,
          permission_ca: [159], // 👈 Child FCI Tripsheet Report permission
          icon: <CIcon icon={cilMediaRecord} customClassName="nav-icon" />,
          datatoggle: 'tooltip',
          title: 'FCI - Tripsheet Report',
        },  
        {
          component: CNavItem,
          name: 'Freight Migo Info',
          level: 'child',
          to: '/FCIFreightMigoReport',
          is_restricted: 1,
          permission_ca: [163], // 👈 Child FCI Freight Migo Report permission
          icon: <CIcon icon={cilMediaRecord} customClassName="nav-icon" />,
          datatoggle: 'tooltip',
          title: 'FCI Freight Migo Report',
        },
        {
          component: CNavItem,
          name: 'Loading Migo Info',
          level: 'child',
          to: '/FCILoadingMigoReport',
          is_restricted: 1,
          permission_ca: [164], // 👈 Child FCI Loading Migo Report permission
          icon: <CIcon icon={cilMediaRecord} customClassName="nav-icon" />,
          datatoggle: 'tooltip',
          title: 'FCI Loading Migo Report',
        },
        {
          component: CNavItem,
          name: 'Vendor Assign. Info',
          level: 'child',
          to: '/FCIExpenseReport',
          is_restricted: 1,
          permission_ca: [162], // 👈 Child FCI Vendor Assignment Report permission
          icon: <CIcon icon={cilMediaRecord} customClassName="nav-icon" />,
          datatoggle: 'tooltip',
          title: 'FCI Vendor Assignment Report',
        },
        {
          component: CNavItem,
          name: 'Income Closure Info',
          to: '/FCISettlementReport',
          datatoggle: 'tooltip',
          title: 'FCI Income Closure Report',
          level: 'child', 
          is_restricted: 1,
          permission_ca: [165], // 👈 Child Income Closure Info Report permission
          icon: <CIcon icon={cilMediaRecord} customClassName="nav-icon" />, 
        }, 
        {
          component: CNavItem,
          name: 'Payment Info.',
          level: 'child',
          to: '/FCIPaymentReport',
          is_restricted: 1,
          permission_ca: [167], // 👈 Child FCI Payment Report permission
          icon: <CIcon icon={cilMediaRecord} customClassName="nav-icon" />,
          datatoggle: 'tooltip',
          title: 'FCI - Payment Report',
        },
        {
          component: CNavItem,
          name: 'FI Info.',
          level: 'child',
          to: '/FCIFIEntryReport',
          is_restricted: 1,
          permission_ca: [166], // 👈 Child FCI FI Entry Report permission
          icon: <CIcon icon={cilMediaRecord} customClassName="nav-icon" />,
          datatoggle: 'tooltip',
          title: 'FCI - FI Entry Report',
        }        
      ],
    },
    {
      component: CNavGroup,
      name: 'FCI Vendor Creation',
      level: 'parent',
      to: '/FCIVendorCreationHome',
      is_restricted: 1,
      permission_ca: fci_vc_array, // 👈 Parent FCI Vendor Creation permission
      icon: <CIcon icon={cilPenNib} customClassName="nav-icon" />,
      items: [
        {
          component: CNavItem,
          name: 'VC Request',
          level: 'child',
          to: '/FCIVendorCreationRequestHome',
          is_restricted: 1,
          permission_ca: [154], // 👈 Child FCI Vendor Creation Request permission
          icon: <CIcon icon={cilMediaRecord} size="sm" customClassName="nav-icon" />,
          datatoggle: 'tooltip',
          title: 'FCI - Vendor Creation',
        },  
        {
          component: CNavItem,
          name: 'VC Approval',
          level: 'child',
          is_restricted: 1,
          to: '/FCIVendorCreationApprovalHome',
          permission_ca: [155], // 👈 Child FCI Vendor Creation Approval permission
          icon: <CIcon icon={cilMediaRecord} size="sm" customClassName="nav-icon" />,
          datatoggle: 'tooltip',
          title: 'FCI - Vendor Approval',
        },  
        {
          component: CNavItem,
          name: 'VC Confirmation',
          level: 'child',
          is_restricted: 1,
          to: '/FCIVendorCreationConfirmationHome',
          permission_ca: [156], // 👈 Child FCI Vendor Creation Confirmation permission
          icon: <CIcon icon={cilMediaRecord} size="sm" customClassName="nav-icon" />,
          datatoggle: 'tooltip',
          title: 'FCI - Vendor Confirmation',
        },  
        {
          component: CNavItem,
          name: 'Vendor Info. Report',
          level: 'child',
          is_restricted: 1,
          to: '/FCIVendorReport',
          permission_ca: [161], // 👈 Child FCI Vendor Info. Report permission
          icon: <CIcon icon={cilMediaRecord} size="sm" customClassName="nav-icon" />,
          datatoggle: 'tooltip',
          title: 'FCI Vendor Info. Report',
        },  
      ],
    },
  ],
}

/* =========== 3) FCI Process Head Part End =========== */

/* =========== 4) NLIF - Logistics Process Head Part Start =========== */

var _nav223 = {} /* NLIF Logistics Process Head */

let ifoods_mov_array = [40,127,128,129,131]
let ifoods_setl_array = [130,132]
let ifoods_pay_array = [133,134,135,136,141]
let ifoods_rep_array = [122,123,124,125,126,137,138,139,140]
let ifoods_mas_array = [116,117,118,119,120,121,142]

let ifoodsMergedArray = ifoods_mov_array
  .concat(ifoods_setl_array)
  .concat(ifoods_pay_array)
  .concat(ifoods_rep_array)
  .concat(ifoods_mas_array) 

console.log(page_permission,'page_permission - page_permission')
console.log(ifoodsMergedArray,'page_permission - ifoodsMergedArray')

_nav223 = {
  component: CNavGroup, 
  name: 'IFOODS Process',
  level: 'grandparent',
  to: '/IfoodsVehicleGateIn',
  is_restricted: 1,
  permission: ifoodsMergedArray, // 👈 Grand Parent IFOODS permission
  icon: <CIcon icon={cilControl} customClassName="nav-icon" />,
  items: [
    {
      component: CNavGroup,
      name: 'IFOODS - Trip Plan',
      level: 'parent',
      to: '/IfoodsVehicleGateIn',
      is_restricted: 1,
      permission_ca: ifoods_mov_array, // 👈 Parent IFOODS - Trip Plan permission
      icon: <CIcon icon={cilTruck} customClassName="nav-icon" />,
      items: [
        {
          component: CNavItem,
          name: 'Home',
          level: 'child',
          is_restricted: 1,
          to: '/Dashboard',
          permission_ca: [40], // 👈 Parent Dashboard permission
          icon: <CIcon icon={cilHome} customClassName="nav-icon" />,
          datatoggle: 'tooltip',
          title: 'Home',
        },
        {
          component: CNavItem,
          name: 'Loading Point In / Out',
          to: '/IfoodsVehicleGateIn',
          datatoggle: 'tooltip',
          title: 'Loading Point In / Out',
          level: 'child', 
          is_restricted: 1,
          permission_ca: [127], // 👈 Child Loading Point In / Out permission
          icon: <CIcon icon={cilMediaRecord} customClassName="nav-icon" />, 
        },
        {
          component: CNavItem,
          name: 'Vehicle Inspection',
          level: 'child',
          to: '/IfoodsVehicleInspectionHome',
          is_restricted: 1,
          permission_ca: [128], // 👈 Child Vehicle Inspection permission
          icon: <CIcon icon={cilMediaRecord} customClassName="nav-icon" />,
          datatoggle: 'tooltip',
          title: 'Vehicle Inspection',
        },
        {
          component: CNavItem,
          name: 'Tripsheet Creation',
          level: 'child',
          to: '/IfoodsTripsheetCreationHome',
          is_restricted: 1,
          permission_ca: [129], // 👈 Tripsheet Creation permission
          icon: <CIcon icon={cilMediaRecord} customClassName="nav-icon" />,
          datatoggle: 'tooltip',
          title: 'Tripsheet Creation',
        },        
        {
          component: CNavItem,
          name: 'Tripsheet Edit',
          to: '/IfoodsTripSheetEditHome',
          datatoggle: 'tooltip',
          title: 'Tripsheet Edit',
          level: 'child', 
          is_restricted: 1,
          permission_ca: [131], // 👈 Child Tripsheet Edit permission
          icon: <CIcon icon={cilMediaRecord} customClassName="nav-icon" />, 
        }, 
      ],
    },
    {
      component: CNavGroup,
      name: 'IFOODS - Trip Closure',
      level: 'parent',
      to: '/IfoodsExpenseClosureHome',
      is_restricted: 1,
      permission_ca: ifoods_setl_array, // 👈 Parent IFOODS - Trip Closure permission
      icon: <CIcon icon={cilExposure} customClassName="nav-icon" />,
      items: [
        {
          component: CNavItem,
          name: 'Trip Closure',
          to: '/IfoodsExpenseClosureHome',
          datatoggle: 'tooltip',
          title: 'Trip Closure',
          level: 'child', 
          is_restricted: 1,
          permission_ca: [130], // 👈 Child Trip Closure permission
          icon: <CIcon icon={cilMediaRecord} customClassName="nav-icon" />, 
        },
        {
          component: CNavItem,
          name: 'Trip Closure Approval',
          to: '/IfoodsExpenseApprovalHome',
          datatoggle: 'tooltip',
          title: 'Trip Closure Approval',
          level: 'child', 
          is_restricted: 1,
          permission_ca: [132], // 👈 Child Trip Closure Approval permission
          icon: <CIcon icon={cilMediaRecord} customClassName="nav-icon" />, 
        }, 
      ],
    },
    {
      component: CNavGroup,
      name: 'IFOODS - Payment', 
      level: 'parent',
      to: '/IfoodsPaymentSubmissionHome',
      is_restricted: 1,
      permission_ca: ifoods_pay_array, // 👈 Parent IFOODS - Payment permission
      icon: <CIcon icon={cilTruck} customClassName="nav-icon" />,
      items: [
        {
          component: CNavItem,
          name: 'Payment Submission',
          level: 'child',
          to: '/IfoodsPaymentSubmissionHome',
          is_restricted: 1,
          permission_ca: [133], // 👈 Child Payment Submission permission
          icon: <CIcon icon={cilMediaRecord} customClassName="nav-icon" />,
          datatoggle: 'tooltip',
          title: 'Payment Submission',
        },
        {
          component: CNavItem,
          name: 'Pay. Validation - SCM',
          level: 'child',
          to: '/IfoodsPaymentValidationTable',
          is_restricted: 1,
          permission_ca: [134], // 👈 Child Payment Validation - SCM permission
          icon: <CIcon icon={cilMediaRecord} customClassName="nav-icon" />,
          datatoggle: 'tooltip',
          title: 'Payment Validation - SCM',
        },
        {
          component: CNavItem,
          name: 'Pay. Approval - OH',
          level: 'child',
          to: '/IfoodsPaymentValidationOhTable',
          is_restricted: 1,
          permission_ca: [141], // 👈 Child Payment Approval - Operational Head permission
          icon: <CIcon icon={cilMediaRecord} customClassName="nav-icon" />,
          datatoggle: 'tooltip',
          title: 'Payment Approval - Operational Head',
        }, 
        {
          component: CNavItem,
          name: 'Pay. Validation - AM',
          level: 'child',
          to: '/IfoodsPaymentValidationTableAc',
          is_restricted: 1,
          permission_ca: [136], // 👈 Child Payment Validation - Accounts Manager permission
          icon: <CIcon icon={cilMediaRecord} customClassName="nav-icon" />,
          datatoggle: 'tooltip',
          title: 'Payment Validation - Accounts Manager',
        },
        {
          component: CNavItem,
          name: 'Pay. Approval - AH',
          level: 'child',
          to: '/IfoodsPaymentApprovalTable',
          is_restricted: 1,
          permission_ca: [135], // 👈 Child Payment Approval - Accounts Head permission
          icon: <CIcon icon={cilMediaRecord} customClassName="nav-icon" />,
          datatoggle: 'tooltip',
          title: 'Payment Approval - Accounts Head',
        },  
      ],
    },
    {
      component: CNavGroup,
      name: 'IFOODS - Report',
      to: '/IfoodsVendorReportTable',
      permission_ca: ifoods_rep_array, // 👈 Parent IFOODS - Report permission
      level: 'parent',
      is_restricted: 1,
      icon: <CIcon icon={cilInfo} customClassName="nav-icon" />,
      items: [
        {
          component: CNavItem,
          name: 'Vendor Report',
          level: 'child',
          to: '/IfoodsVendorReport',
          is_restricted: 1,
          permission_ca: [122], // 👈 Child IFoods Vendor Report permission
          icon: <CIcon icon={cilMediaRecord} customClassName="nav-icon" />,
          datatoggle: 'tooltip',
          title: 'IFoods Vendor Report',
        },
        {
          component: CNavItem,
          name: 'Vehicle Report',
          level: 'child',
          to: '/IfoodsVehicleReport',
          is_restricted: 1,
          permission_ca: [123], // 👈 Child IFoods Vehicles Report permission
          icon: <CIcon icon={cilMediaRecord} customClassName="nav-icon" />,
          datatoggle: 'tooltip',
          title: 'IFoods Vehicles Report',
        },
        {
          component: CNavItem,
          name: 'Route Report',
          level: 'child',
          to: '/IfoodsRouteReport',
          is_restricted: 1,
          permission_ca: [124], // 👈 Child IFoods Route Report permission
          icon: <CIcon icon={cilMediaRecord} customClassName="nav-icon" />,
          datatoggle: 'tooltip',
          title: 'IFoods Route Report',
        },
        {
          component: CNavItem,
          name: 'Sales Freight Report',
          level: 'child',
          to: '/IfoodsSalesfreightReport',
          is_restricted: 1,
          permission_ca: [125], // 👈 Child Sales Freight Report permission
          icon: <CIcon icon={cilMediaRecord} customClassName="nav-icon" />,
          datatoggle: 'tooltip',
          title: 'IFoods Sales Freight Report',
        },
        {
          component: CNavItem,
          name: 'STO Freight Report',
          level: 'child',
          to: '/IfoodsStofreightReport',
          is_restricted: 1,
          permission_ca: [126], // 👈 Child STO Freight Report permission
          icon: <CIcon icon={cilMediaRecord} customClassName="nav-icon" />,
          datatoggle: 'tooltip',
          title: 'IFoods STO Freight Report',
        },
        {
          component: CNavItem,
          name: 'Tripsheet Report',
          level: 'child',
          to: '/IfoodsTripsheetReport',
          is_restricted: 1,
          permission_ca: [137], // 👈 Child IFoods Tripsheet Report permission
          icon: <CIcon icon={cilMediaRecord} customClassName="nav-icon" />,
          datatoggle: 'tooltip',
          title: 'IFoods - Tripsheet Report',
        }, 
        {
          component: CNavItem,
          name: 'Payment Report',
          level: 'child',
          to: '/IfoodsPaymentReport',
          is_restricted: 1,
          permission_ca: [138], // 👈 Child IFoods Payment Report permission
          icon: <CIcon icon={cilMediaRecord} customClassName="nav-icon" />,
          datatoggle: 'tooltip',
          title: 'IFoods Payment Report',
        },
        {
          component: CNavItem,
          name: 'Delivery Wise Report',
          level: 'child',
          to: '/IfoodsDeliveryReport',
          is_restricted: 1,
          permission_ca: [140], // 👈 Child IFoods Delivery Wise Report permission
          icon: <CIcon icon={cilMediaRecord} customClassName="nav-icon" />,
          datatoggle: 'tooltip',
          title: 'IFoods Delivery Wise Report',
        },
        {
          component: CNavItem,
          name: 'Trip Closure Report',
          level: 'child',
          to: '/IfoodsTripClosureReport',
          is_restricted: 1,
          permission_ca: [139], // 👈 Child IFoods Trip Closure Report permission
          icon: <CIcon icon={cilMediaRecord} customClassName="nav-icon" />,
          datatoggle: 'tooltip',
          title: 'IFoods Trip Closure Report',
        }  
      ],
    },
    {
      component: CNavGroup,
      name: 'IFOODS - Master',
      level: 'parent',
      to: '/IfoodsVendorMasterTable',
      is_restricted: 1,
      permission_ca: ifoods_mas_array, // 👈 Parent IFOODS Master permission
      icon: <CIcon icon={cilPenNib} customClassName="nav-icon" />,
      items: [
        {
          component: CNavItem,
          name: 'Outlet Master',
          level: 'child',
          to: '/IfoodsOutletMasterTable',
          is_restricted: 1,
          permission_ca: [116], // 👈 Child IFoods Outlet Master permission
          icon: <CIcon icon={cilMediaRecord} size="sm" customClassName="nav-icon" />,
          datatoggle: 'tooltip',
          title: 'IFoods Outlet Master',
        },
        {
          component: CNavItem,
          name: 'Vendor Code Master',
          level: 'child',
          to: '/IfoodsVendorCodeMasterTable',
          is_restricted: 1,
          permission_ca: [142], // 👈 Child IFoods Vendor Code Master permission
          icon: <CIcon icon={cilMediaRecord} size="sm" customClassName="nav-icon" />,
          datatoggle: 'tooltip',
          title: 'IFoods Vendor Code Master',
        },  
        {
          component: CNavItem,
          name: 'Vendor Master',
          level: 'child',
          to: '/IfoodsVendorMasterTable',
          is_restricted: 1,
          permission_ca: [117], // 👈 Child IFoods Vendor Master permission
          icon: <CIcon icon={cilMediaRecord} size="sm" customClassName="nav-icon" />,
          datatoggle: 'tooltip',
          title: 'IFoods Vendor Master',
        },   
        {
          component: CNavItem,
          name: 'Vehicle Master',
          level: 'child',
          is_restricted: 1,
          to: '/IfoodsVehicleMasterTable',
          permission_ca: [118], // 👈 Child IFoods Vehicle Master permission
          icon: <CIcon icon={cilMediaRecord} size="sm" customClassName="nav-icon" />,
          datatoggle: 'tooltip',
          title: 'IFoods Vehicle Master',
        },
        {
          component: CNavItem,
          name: 'Route Master',
          level: 'child',
          is_restricted: 1,
          to: '/IfoodsRouteMasterTable',
          permission_ca: [119], // 👈 Child IFoods Route Master permission
          icon: <CIcon icon={cilMediaRecord} size="sm" customClassName="nav-icon" />,
          datatoggle: 'tooltip',
          title: 'IFoods Route Master',
        },
        {
          component: CNavItem,
          name: 'Sales Freight Master',
          level: 'child',
          is_restricted: 1,
          to: '/IfoodsSalesfreightMasterTable',
          permission_ca: [120], // 👈 Child IFoods Sales Freight Master permission
          icon: <CIcon icon={cilMediaRecord} size="sm" customClassName="nav-icon" />,
          datatoggle: 'tooltip',
          title: 'IFoods Sales Freight Master',
        },
        {
          component: CNavItem,
          name: 'STO Freight Master',
          level: 'child',
          is_restricted: 1,
          to: '/IfoodsStofreightMasterTable',
          permission_ca: [121], // 👈 Child IFoods STO Freight Master permission
          icon: <CIcon icon={cilMediaRecord} size="sm" customClassName="nav-icon" />,
          datatoggle: 'tooltip',
          title: 'IFoods STO Freight Master',
        },
      ],
    },
  ],
}

/* =========== 4) NLIF - Logistics Process Head Part End =========== */

/* =========== 5) NLLD - Logistics Process Head Part Start =========== */

var _nav224 = {} /* NLLD Logistics Process Head */

/* =========== 5) NLLD - Logistics Process Head Part End =========== */

/* =========== 6) BB Process Head =========== */

var _nav225 = {} /* BB Process Head */

/* =========== 7) Settings Process Head =========== */

var _nav226 = {} /* Settings Process Head */


var _nav500 = {} /* NLMT Process Head */

let nlmt_array = [256, 257, 258, 247, 248, 249, 259, 260]
let nlmt_main_array = [261]
let nlmt_adv_array = [262,263]
let nlmt_dies_array = [264,265,266]
let nlmt_vendor_array = [267,268,269,270]
let nlmt_exp_array = [271, 272,273]
let nlmt_pay_array = [274, 275, 276, 277]
let nlmt_rep_array = [278,279,280,281,282,283,284,285,287]
let nlmt_master_array = [250, 251, 252, 253, 254, 255]
let nlmt_ts_status_array = [286,288,289]

let nlmtMergedArray = nlmt_array
  .concat(nlmt_exp_array)
  .concat(nlmt_pay_array)
  .concat(nlmt_rep_array)
  .concat(nlmt_master_array)

// console.log(page_permission,'page_permission - page_permission')
// console.log(nlmtMergedArray,'page_permission - nlmtMergedArray')

_nav500 = {
  component: CNavGroup,
  name: 'NLMT Process',
  level: 'grandparent',
  to: '/NlmtTripInOwnVehicle',
  is_restricted: 1,
  permission: nlmtMergedArray, // 👈 Grand Parent NLMT permission
  icon: <CIcon icon={cilControl} customClassName="nav-icon" />,
  items: [
    {
      component: CNavGroup,
      name: 'Movements',
      level: 'parent',
      to: '/NlmtTripInOwnVehicle',
      is_restricted: 1,
      permission_ca: nlmt_array,
      icon: <CIcon icon={cilTruck} customClassName="nav-icon" />,
      items: [
        {
          component: CNavItem,
          name: 'Trip - IN',
          to: '/NlmtTripInOwnVehicle',
          datatoggle: 'tooltip',
          title: 'Trip - IN', // 👈 NLMT Vehicle Trip IN permission
          level: 'child',
          is_restricted: 1,
          permission_ca: [256],
          icon: <CIcon icon={cilInput} customClassName="nav-icon" />,
        },
        {
          component: CNavItem,
          name: 'Vehicle Inspection',
          level: 'child',
          to: '/NlmtVehicleInspectionHome',
          is_restricted: 1,
          permission_ca: [257], // 👈 NLMT Vehicle Inspection
          icon: <CIcon icon={cilAirplay} customClassName="nav-icon" />,
          datatoggle: 'tooltip',
          title: 'NLMT Vehicle Inspection',
        },
        {
          component: CNavItem,
          name: 'TS Creation - Own',
          level: 'child',
          to: '/NlmtTripsheetCreationOwnHome',
          is_restricted: 1,
          permission_ca: [258], // 👈 NLMT Tripsheet Creation
          icon: <CIcon icon={cilNotes} customClassName="nav-icon" />,
          datatoggle: 'tooltip',
          title: 'NLMT-Tripsheet Creation(Own)',
        },
        {
          component: CNavItem,
          name: 'TS Creation - Others',
          level: 'child',
          to: '/NlmtTripsheetCreationOthers',
          is_restricted: 1,
          permission_ca: [259], // 👈 NLMT Tripsheet Creation permission
          icon: <CIcon icon={cilPenNib} customClassName="nav-icon" />,
          datatoggle: 'tooltip',
          title: 'NLMT-Tripsheet Creation(Others)',
        },
        {
          component: CNavItem,
          name: 'TS Change',
          level: 'child',
          to: '/NlmtTripsheetUpdation',
          is_restricted: 1,
          permission_ca: [249], // 👈 NLMT Tripsheet Updation permission
          icon: <CIcon icon={cilPenNib} customClassName="nav-icon" />,
          datatoggle: 'tooltip',
          title: 'NLMT-Tripsheet Change',
        },
        {
          component: CNavItem,
          name: 'Trip Cancel',
          level: 'child',
          to: '/NlmtTripCancel',
          is_restricted: 1,
          permission_ca: [249], // 👈 NLMT Tripsheet Updation permission
          icon: <CIcon icon={cilPenNib} customClassName="nav-icon" />,
          datatoggle: 'tooltip',
          title: 'NLMT-Trip Cancel',
        },
        {
          component: CNavItem,
          name: 'Freight Request',
          level: 'child',
          to: '/NlmtFreightRequest',
          is_restricted: 1,
          permission_ca: [248], // 👈 NLMT Freight Request Creation
          icon: <CIcon icon={cilCheckAlt} customClassName="nav-icon" />,
          datatoggle: 'tooltip',
          title: 'NLMT Freight Request',
        },
        {
          component: CNavItem,
          name: 'Freight Approval',
          level: 'child',
          to: '/NlmtFreightApproval',
          is_restricted: 1,
          permission_ca: [247], // 👈 NLMT Freight Request Approval
          icon: <CIcon icon={cilCheckCircle} customClassName="nav-icon" />,
          datatoggle: 'tooltip',
          title: 'NLMT Freight Approval',
        },
        {
          component: CNavItem,
          name: 'Vehicle Assignment',
          to: '/NlmtShipmentCreation',
          datatoggle: 'tooltip',
          title: 'NLMT-Vehicle Assignment',
          level: 'child',
          is_restricted: 1,
          permission_ca: [260], // 👈 NLMT Vehicle Assignment permission
          icon: <CIcon icon={cilTruck} customClassName="nav-icon" />,
        },

      ],
    },
    {
      component: CNavGroup,
      name: 'Vehicle Maintainence',
      level: 'parent',
      to: '/NlmtVehicleMaintainence',
      is_restricted: 1,
      permission_ca: nlmt_main_array,  // 👈 Parent NLMT Vehicle Maintainence permission
      icon: <CIcon icon={cilSettings} customClassName="nav-icon" />,
      items: [
        {
          component: CNavItem,
          name: 'Vehicle Maintainence',
          to: '/NlmtVehicleMaintainence',
          datatoggle: 'tooltip',
          title: 'NLMT - Vehicle Maintainence',
          level: 'child',
          is_restricted: 1,
          permission_ca: [261], // 👈 Child NLMT Vehicle Maintainence permission
          icon: <CIcon icon={cilSettings} customClassName="nav-icon" />,
        },
      ],
    },

    {
      component: CNavGroup,
      name: 'Advance',
      level: 'parent',
      to: '/NlmtAdvancePayment',
      is_restricted: 1,
      permission_ca: nlmt_adv_array, // 👈 Parent NLMT Advance Payment permission
      icon: <CIcon icon={cilMoney} customClassName="nav-icon" />,
      items: [
        {
          component: CNavItem,
          name: 'Advance Request',
          to: '/NlmtAdvancePayment',
          datatoggle: 'tooltip',
          title: 'NLMT - Advance Payment Request',
          level: 'child',
          is_restricted: 1,
          permission_ca: [262], // 👈 Child NLMT Advance Payment Request permission
          icon: <CIcon icon={cilWallet} customClassName="nav-icon" />,
        },
        // {
        //   component: CNavItem,
        //   name: 'Additional Advance',
        //   to: '/NlmtAdditionalAdvanceHome',
        //   datatoggle: 'tooltip',
        //   title: 'NLMT - Additional Advance',
        //   level: 'child',
        //   is_restricted: 1,
        //   permission_ca: [263], // 👈 Child Depo Expense Closure Approval permission
        //   icon: <CIcon icon={cilCreditCard} customClassName="nav-icon" />,
        // },
        {
          component: CNavItem,
          name: 'Advance Approval',
          to: '/NlmtAdvancePaymentApproval',
          datatoggle: 'tooltip',
          title: 'NLMT - Advance Payment Approval',
          level: 'child',
          is_restricted: 1,
          permission_ca: [290], // 👈 Child NLMT Advance Approval
          icon: <CIcon icon={cilWallet} customClassName="nav-icon" />,
        },
      ],
    },

    {
      component: CNavGroup,
      name: 'Diesel Indent',
      level: 'parent',
      to: '/NlmtDieselIntentHome',
      is_restricted: 1,
      permission_ca: nlmt_dies_array, // 👈 Parent NLMT Diesel Indent Permission
      icon: <CIcon icon={cilMoney} customClassName="nav-icon" />,
      items: [
        {
          component: CNavItem,
          name: 'DI Creation',
          to: '/NlmtDieselIntentHome',
          datatoggle: 'tooltip',
          title: 'NLMT - DI Creation',
          level: 'child',
          is_restricted: 1,
          permission_ca: [264], // 👈 Child NLMT Diesel Indent Creation permission
          icon: <CIcon icon={cilWallet} customClassName="nav-icon" />,
        },
        {
          component: CNavItem,
          name: 'DI Confirmation',
          to: '/NlmtDIConfirmationHome',
          datatoggle: 'tooltip',
          title: 'NLMT - DI Confirmation',
          level: 'child',
          is_restricted: 1,
          permission_ca: [265], // 👈 Child NLMT Diesel Indent Confirmation permission
          icon: <CIcon icon={cilCreditCard} customClassName="nav-icon" />,
        },
        // {
        //   component: CNavItem,
        //   name: 'DI Approval',
        //   to: '/NlmtDiApprovalHome',
        //   datatoggle: 'tooltip',
        //   title: 'NLMT - DI Approval',
        //   level: 'child',
        //   is_restricted: 1,
        //   permission_ca: [266], // 👈 Child Depo Expense Closure Approval permission
        //   icon: <CIcon icon={cilCreditCard} customClassName="nav-icon" />,
        // },
      ],
    },
    {
      component: CNavGroup,
      name: 'Vendor Creation',
      level: 'parent',
      to: '/NlmtDocumentVerificationTable',
      is_restricted: 1,
      permission_ca: nlmt_vendor_array, // 👈 Parent NLMT Vendor Creation permission
      icon: <CIcon icon={cilBank} customClassName="nav-icon" />,
      items: [

        {
          component: CNavItem,
          name: 'Vendor Request',
          to: '/NlmtVendorRequestTable',
          datatoggle: 'tooltip',
          title: 'NLMT - Vendor Request',
          level: 'child',
          is_restricted: 1,
          permission_ca: [267], // 👈 Child NLMT Vendor Creation Request permission
          icon: <CIcon icon={cilPaintBucket} customClassName="nav-icon" />,
        },

        {
          component: CNavItem,
          name: 'Vendor Approval',
          to: '/NlmtVendorApprovalTable',
          datatoggle: 'tooltip',
          title: 'NLMT - Vendor Approval',
          level: 'child',
          is_restricted: 1,
          permission_ca: [268], // 👈 Child NLMT Vendor Creation Unit Head Approval permission
          icon: <CIcon icon={cilLocomotive} customClassName="nav-icon" />,
        },
        {
          component: CNavItem,
          name: 'Vendor Tax Approval',
          to: '/NlmtVendorTaxApprovalTable',
          datatoggle: 'tooltip',
          title: 'NLMT - Vendor Approval',
          level: 'child',
          is_restricted: 1,
          permission_ca: [269], // 👈 Child NLMT Vendor Creation TAX Approval permission
          icon: <CIcon icon={cilLocomotive} customClassName="nav-icon" />,
        },

        {
          component: CNavItem,
          name: 'Vendor Confirmation',
          to: '/NlmtVendorConfirmationTable',
          datatoggle: 'tooltip',
          title: 'NLMT - Vendor Confirmation',
          level: 'child',
          is_restricted: 1,
          permission_ca: [270], // 👈 Child NLMT Vendor Creation : Confirmation permission
          icon: <CIcon icon={cilGroup} customClassName="nav-icon" />,
        },

      ],
    },
    {
      component: CNavGroup,
      name: 'NLMT Masters',
      level: 'parent',
      to: '/NlmtDriverMasterTable',
      is_restricted: 1,
      permission_ca: nlmt_master_array, // 👈 Parent NLMT Master permission
      icon: <CIcon icon={cilBriefcase} customClassName="nav-icon" />,
      items: [
        {
          component: CNavItem,
          name: 'Driver Master',
          level: 'child',
          to: '/NlmtDriverMasterTable',
          is_restricted: 1,
          permission_ca: [250], // 👈 Child  NLMT Driver Master permission
          icon: <CIcon icon={cilStar} size="sm" customClassName="nav-icon" />,
          datatoggle: 'tooltip',
          title: 'NLMT - Driver Master',
        },
        {
          component: CNavItem,
          name: 'Vehicle Master',
          level: 'child',
          is_restricted: 1,
          to: '/NlmtVehicleMasterTable',
          permission_ca: [251], // 👈 Child NLMT Vehicle Master permission
          icon: <CIcon icon={cilTruck} size="sm" customClassName="nav-icon" />,
          datatoggle: 'tooltip',
          title: 'NLMT Vehicle Master',
        },

        {
          component: CNavItem,
          name: 'Definitions Master',
          level: 'child',
          is_restricted: 1,
          to: '/NlmtDefinitionsTable',
          permission_ca: [252], // 👈 Child NLMT Freight Master permission
          icon: <CIcon icon={cilLayers} size="sm" customClassName="nav-icon" />,
          title: 'NLMT Definitions',
        },
        {
          component: CNavItem,
          name: 'Definitions List Master',
          level: 'child',
          is_restricted: 1,
          to: '/NlmtDefinitionsListTable',
          permission_ca: [253], // 👈 Child NLMT Freight Master permission
          icon: <CIcon icon={cibCentos} size="sm" customClassName="nav-icon" />,
          title: 'NLMT Definitions List',
        },
        {
          component: CNavItem,
          name: 'Route & Freight Master',
          level: 'child',
          is_restricted: 1,
          to: '/NlmtRouteMasterTable',
          permission_ca: [254],
          icon: <CIcon icon={cilSettings} size="sm" customClassName="nav-icon" />,
          datatoggle: 'tooltip',
          title: 'NLMT Route & Freight Master',
        },
        {
          component: CNavItem,
          name: 'Shed Master',
          level: 'child',
          to: '/NlmtShedMasterTable',
          is_restricted: 1,
          permission_ca: [255], // 👈 Child  NLMT Shed Master permission
          icon: <CIcon icon={cilMemory} size="sm" customClassName="nav-icon" />,
          datatoggle: 'tooltip',
          title: 'NLMT - Shed Master',
        },
      ],
    },

    {
      component: CNavGroup,
      name: 'NLMT - TS Closure',
      level: 'parent',
      to: '/NlmtTSExpenseClosureHome',
      is_restricted: 1,
      permission_ca: nlmt_exp_array, // 👈 Parent NLMT Expenses permission
      icon: <CIcon icon={cilExposure} customClassName="nav-icon" />,
      items: [
        {
          component: CNavItem,
          name: 'Expense Closure',
          to: '/NlmtTSExpenseClosureHome',
          datatoggle: 'tooltip',
          title: 'NLMT - Expense Closure',
          level: 'child',
          is_restricted: 1,
          permission_ca: [271], // 👈 Child NLMT Expense Closure permission
          icon: <CIcon icon={cilMediaRecord} customClassName="nav-icon" />,
        },
        {
          component: CNavItem,
          name: 'Deduction Approval',
          to: '/NlmtTSExpenseClosureApprovalHome',
          datatoggle: 'tooltip',
          title: 'NLMT - Deduction Approval',
          level: 'child',
          is_restricted: 1,
          permission_ca: [291], // 👈 Child NLMT Expense Deduction Approval permission
          icon: <CIcon icon={cilMediaRecord} customClassName="nav-icon" />,
        },
        {
          component: CNavItem,
          name: 'Hire Exp. Approval',
          to: '/NlmtTSHireExpApprovalHome',
          datatoggle: 'tooltip',
          title: 'NLMT - Hire Vehicles Expense Approval',
          level: 'child',
          is_restricted: 1,
          permission_ca: [272], // 👈 Child NLMT Hire Expense Closure Approval permission
          icon: <CIcon icon={cilMediaRecord} customClassName="nav-icon" />,
        },
        {
          component: CNavItem,
          name: 'Own Exp. Approval',
          to: '/NlmtTSOwnExpenseClosureApprovalHome',
          datatoggle: 'tooltip',
          title: 'NLMT - Own Vehicles Expense Approval',
          level: 'child',
          is_restricted: 1,
          permission_ca: [296], // 👈 Child NLMT Own Expense Closure Approval permission
          icon: <CIcon icon={cilMediaRecord} customClassName="nav-icon" />,
        },
        {
          component: CNavItem,
          name: 'Income Closure',
          to: '/NlmtTSIncomeClosureHome',
          datatoggle: 'tooltip',
          title: 'NLMT - Income Closure',
          level: 'child',
          is_restricted: 1,
          permission_ca: [273], // 👈 Child NLMT Income Closure permission
          icon: <CIcon icon={cilExposure} customClassName="nav-icon" />,
        },
        {
          component: CNavItem,
          name: 'Income Approval',
          to: '/NlmtTSIncomeApprovalHome',
          datatoggle: 'tooltip',
          title: 'NLMT - Income Closure Approval',
          level: 'child',
          is_restricted: 1,
          permission_ca: [294], // 👈 Child NLMT Income Closure Approval permission
          icon: <CIcon icon={cilExposure} customClassName="nav-icon" />,
        },
        {
          component: CNavItem,
          name: 'Driver Payment',
          to: '/NlmtTSPaymentHome',
          datatoggle: 'tooltip',
          title: 'NLMT - Own Driver Payment',
          level: 'child',
          is_restricted: 1,
          permission_ca: [297], // 👈 Child NLMT Own Driver Payment Permission
          icon: <CIcon icon={cilExposure} customClassName="nav-icon" />,
        },
        {
          component: CNavItem,
          name: 'Payment Approval',
          to: '/NlmtTSPaymentApprovalHome',
          datatoggle: 'tooltip',
          title: 'NLMT - Own Driver Payment Approval',
          level: 'child',
          is_restricted: 1,
          permission_ca: [298], // 👈 Child NLMT Own Driver Payment Approval permission
          icon: <CIcon icon={cilExposure} customClassName="nav-icon" />,
        },
      ],
    },
       {
      component: CNavGroup,
      name: 'Hire Payment',
      level: 'parent',
      to: '/NlmtSettlementClosureHome',
      is_restricted: 1,
      permission_ca: nlmt_pay_array, // 👈 Parent Nlmt Payment permission
      icon: <CIcon icon={cilSpreadsheet} customClassName="nav-icon" />,
      items: [
        {
          component: CNavItem,
          name: 'Payment Submission',
          level: 'child',
          to: '/NlmtSettlementClosureHome',
          is_restricted: 1,
          permission_ca: [274], // 👈 Child Nlmt Payment Submission permission
          icon: <CIcon icon={cilNewspaper} customClassName="nav-icon" />,
          datatoggle: 'tooltip',
          title: 'NLMT - Payment Submission',
        },

        {
          component: CNavItem,
          name: 'Payment Validation',
          level: 'child',
          to: '/NlmtSettlementValidationTable',
          is_restricted: 1,
          permission_ca: [275], // 👈 Child Nlmt Payment Validation permission
          icon: <CIcon icon={cilControl} customClassName="nav-icon" />,
          datatoggle: 'tooltip',
          title: 'NLMT - Payment Validation',
        },
        {
          component: CNavItem,
          name: 'Payment Approval',
          level: 'child',
          to: '/NlmtSettlementApprovalTable',
          is_restricted: 1,
          permission_ca: [276], // 👈 Child Nlmt Payment Approval permission
          icon: <CIcon icon={cilPenNib} customClassName="nav-icon" />,
          datatoggle: 'tooltip',
          title: 'NLMT - Payment Approval',
        },
      ],
    },

      {
      component: CNavGroup,
      name: 'Veh. & TS Status',
      level: 'parent',
      // to: '/NlmtTSSettlementHome',
      is_restricted: 1,
      permission_ca: nlmt_ts_status_array,  
      icon: <CIcon icon={cilSettings} customClassName="nav-icon" />,
      items: [
        {
          component: CNavItem,
          name: 'Own Vehicle Status',
          to: '/NlmtOwnVehicleStatus',
          datatoggle: 'tooltip',
          title: 'NLMT - Own Vehicles Status',
          level: 'child',
          is_restricted: 1,
          permission_ca: [286],
          icon: <CIcon icon={cilSettings} customClassName="nav-icon" />,
        },
        {
          component: CNavItem,
          name: 'Tripsheet Status',
          to: '/NlmtVehicleTripSearch',
          datatoggle: 'tooltip',
          title: 'NLMT - Tripsheet Status',
          level: 'child',
          is_restricted: 1,
          permission_ca: [288],
          icon: <CIcon icon={cilSettings} customClassName="nav-icon" />,
        },
        {
          component: CNavItem,
          name: `Vehicle's TS Status`,
          to: '/NlmtOpenTSInfo',
          datatoggle: 'tooltip',
          title: 'NLMT - Vehicles Open Tripsheet Info.',
          level: 'child',
          is_restricted: 1,
          permission_ca: [289],
          icon: <CIcon icon={cilSettings} customClassName="nav-icon" />,
        },
      ],
    },

    {
      component: CNavGroup,
      name: 'NLMT Reports',
      to: '/NlmtTripsheetReport',
      permission_ca: nlmt_rep_array, // 👈 Parent Nlmt Report permission
      level: 'parent',
      is_restricted: 1,
      icon: <CIcon icon={cilInfo} customClassName="nav-icon" />,
      items: [
        {
          component: CNavItem,
          name: 'Trip-In Report',
          level: 'child',
          to: '/NlmtTripInReport',
          is_restricted: 1,
          permission_ca: [285], // 👈 Child Nlmt Trip-In Report permission
          icon: <CIcon icon={cilMediaRecord} customClassName="nav-icon" />,
          datatoggle: 'tooltip',
          title: 'NLMT - Trip-In Report',
        },
        {
          component: CNavItem,
          name: 'Tripsheet Report',
          level: 'child',
          to: '/NlmtTripsheetReport',
          is_restricted: 1,
          permission_ca: [278], // 👈 Child Nlmt Tripsheet Report permission
          icon: <CIcon icon={cilMediaRecord} customClassName="nav-icon" />,
          datatoggle: 'tooltip',
          title: 'NLMT - Tripsheet Report',
        },
        {
          component: CNavItem,
          name: 'Vendor Report',
          level: 'child',
          to: '/NlmtVendorReport',
          is_restricted: 1,
          permission_ca: [287], // 👈 Child Nlmt Vendor Report permission
          icon: <CIcon icon={cilMediaRecord} customClassName="nav-icon" />,
          datatoggle: 'tooltip',
          title: 'NLMT - Vendor Report',
        },
        {
          component: CNavItem,
          name: 'Shipment Report',
          level: 'child',
          to: '/NlmtShipmentReport',
          is_restricted: 1,
          permission_ca: [283], // 👈 Child Nlmt Shipment Report permission
          icon: <CIcon icon={cilMediaRecord} customClassName="nav-icon" />,
          datatoggle: 'tooltip',
          title: 'NLMT Shipment Report',
        },
        {
          component: CNavItem,
          name: 'Delivery Report',
          level: 'child',
          to: '/NlmtDeliveryReport',
          is_restricted: 1,
          permission_ca: [284], // 👈 Child Nlmt Delivery Report permission
          icon: <CIcon icon={cilMediaRecord} customClassName="nav-icon" />,
          datatoggle: 'tooltip',
          title: 'NLMT Delivery Report',
        },
        {
          component: CNavItem,
          name: 'Advance Report',
          level: 'child',
          to: '/NlmtAdvanceReport',
          is_restricted: 1,
          permission_ca: [279], // 👈 Child Nlmt Advance Report permission
          icon: <CIcon icon={cilMediaRecord} customClassName="nav-icon" />,
          datatoggle: 'tooltip',
          title: 'NLMT Advance Payment Report',
        },
        {
          component: CNavItem,
          name: 'Diesel Intent Report',
          level: 'child',
          to: '/NlmtDieselIntentReport',
          is_restricted: 1,
          permission_ca: [280], // 👈 Child Nlmt Diesel Intent Report permission
          icon: <CIcon icon={cilMediaRecord} customClassName="nav-icon" />,
          datatoggle: 'tooltip',
          title: 'NLMT Diesel Intent Report',
        },
        {
          component: CNavItem,
          name: 'TS Closure Report',
          level: 'child',
          to: '/NlmtTSClosureReport',
          is_restricted: 1,
          permission_ca: [281], // 👈 Child Nlmt TS Closure Report permission
          icon: <CIcon icon={cilMediaRecord} customClassName="nav-icon" />,
          datatoggle: 'tooltip',
          title: 'NLMT Tripsheet Closure Report',
        },
        {
          component: CNavItem,
          name: 'MPS Payment Report',
          level: 'child',
          to: '/NlmtMPSPaymentReport',
          is_restricted: 1,
          permission_ca: [282], // 👈 Child Nlmt MPS Payment Report permission
          icon: <CIcon icon={cilMediaRecord} customClassName="nav-icon" />,
          datatoggle: 'tooltip',
          title: 'NLMT MPS Payment Report',
        },
      ],
    },
  ],
}

/* =========== 1) NLMT Process Head Part End =========== */

/* ----------------------------------------------------------------------------------- */

/* --------- Pending Bills Capture & Follow Up Process Start --------- */

var _navTripPendingBCHead = {} /* PBCF Own Vehicles Screen */
var _nav231 = {} /* PBCF Own Vehicles Screen */
var _nav232 = {} /* PBCF NLFD Hire Vehicles Screen */
var _nav233 = {} /* PBCF NLCD Hire Vehicles Screen */

/* Condition For Enable Trip Payment Head */
if (
  inArray(111, page_permission) ||
  inArray(112, page_permission) ||
  inArray(113, page_permission) ||
  user_admin
) {
  _navTripPendingBCHead = {
    component: CNavGroup,
    name: 'TS Pending Bills',
    to: '/TSPending',
    datatoggle: 'tooltip',
    title: 'Tripsheet Pending Bills Capture & Follow Up',
    icon: <CIcon icon={cilBank} customClassName="nav-icon" />,
    items: [],
  }
} else {
  _navTripPendingBCHead = ''
}

/* Condition For Enable PBCF OV Screen {'111' => 'PBCF Own Vehicles Screen'} */
if (inArray(111, page_permission) || user_admin) {
  _nav231 = {
    component: CNavItem,
    name: 'Own Vehicles',
    to: '/Pbcfov',
    icon: <CIcon icon={cilMediaRecord} customClassName="nav-icon" />, 
    datatoggle: 'tooltip',
    title: 'Pending Bills Capture & Follow Up - Own Vehicles',
  }
} else {
  _nav231 = ''
}

/* Condition For Enable PBCF HV F Screen {'112' => 'PBCF Hire Vehicles NLFD Screen'} */
if (inArray(112, page_permission) || user_admin) {
  _nav232 = {
    component: CNavItem,
    name: 'Hire Vehicles - NLFD',
    to: '/Pbcfhfv',
    icon: <CIcon icon={cilMediaRecord} customClassName="nav-icon" />, 
    datatoggle: 'tooltip',
    title: 'Pending Bills Capture & Follow Up - NLFD Hire Vehicles',
  }
} else {
  _nav232 = ''
}

/* Condition For Enable PBCF HV C Screen {'113' => 'PBCF Hire Vehicles NLCD Screen'} */
if (inArray(113, page_permission) || user_admin) {
  _nav233 = {
    component: CNavItem,
    name: 'Hire Vehicles - NLCD',
    to: '/Pbcfhcv',
    icon: <CIcon icon={cilMediaRecord} customClassName="nav-icon" />, 
    datatoggle: 'tooltip',
    title: 'Pending Bills Capture & Follow Up - NLCD Hire Vehicles',
  }
} else {
  _nav233 = ''
}

/* --------- Pending Bills Follow Up Process End --------- */

/* --------- Tripsheet Vendor Change Process Start --------- */

var _navTsVendorChangeHead = {} /* Tripsheet Freight Vendor Change Screen */
var _nav234 = {} /* TS VCH Request Screen */
var _nav235 = {} /* TS VCH Accounts Head Approval Screen */
var _nav236 = {} /* TS VCH Accounts Operations Head Approval Screen */
var _nav237 = {} /* TS VCH Request Report */

/* Condition For Enable Trip Payment Head */
if (
  inArray(101, page_permission) ||
  inArray(102, page_permission) ||
  inArray(103, page_permission) ||
  inArray(104, page_permission) ||
  user_admin
) {
  _navTsVendorChangeHead = {
    component: CNavGroup,
    name: 'TS Vendor Change',
    to: '/TSPending',
    datatoggle: 'tooltip',
    title: 'Tripsheet Freight Vendor Change Process',
    icon: <CIcon icon={cilBank} customClassName="nav-icon" />,
    items: [],
  }
} else {
  _navTsVendorChangeHead = ''
}

/* Condition For Enable PBCF TS VCH Request Screen {'101' => 'TS VCH Request Screen'} */
if (inArray(101, page_permission) || user_admin) {
  _nav234 = {
    component: CNavItem,
    name: 'VCH Request',
    to: '/tsvchreq',
    datatoggle: 'tooltip',
    title: 'Vendor Change Request',
    icon: <CIcon icon={cilMediaRecord} customClassName="nav-icon" />, 
  }
} else {
  _nav234 = ''
}

/* Condition For Enable TS VCH AH Approval Screen {'102' => 'TS VCH Accounts Head Approval Screen'} */
if (inArray(102, page_permission) || user_admin) {
  _nav235 = {
    component: CNavItem,
    name: 'VCH AH Approval',
    to: '/tsvchahapp',
    datatoggle: 'tooltip',
    title: 'Vendor Change Accounts Head Approval',
    icon: <CIcon icon={cilMediaRecord} customClassName="nav-icon" />, 
  }
} else {
  _nav235 = ''
}

/* Condition For Enable TS VCH OH Approval Screen {'103' => 'TS VCH Operations Head Approval Screen'} */
if (inArray(103, page_permission) || user_admin) {
  _nav236 = {
    component: CNavItem,
    name: 'VCH OH Approval',
    to: '/tsvchohapp',
    datatoggle: 'tooltip',
    title: 'Vendor Change Operations Head Approval',
    icon: <CIcon icon={cilMediaRecord} customClassName="nav-icon" />, 
  }
} else {
  _nav236 = ''
}

/* Condition For Enable TS VCH Req. Report {'104' => 'TS VCH Req. Report'} */
if (inArray(104, page_permission) || user_admin) {
  _nav237 = {
    component: CNavItem,
    name: 'VCH Req. Report',
    to: '/tsvchreqreport',
    datatoggle: 'tooltip',
    title: 'Tripsheet Vendor Change Request Report',
    icon: <CIcon icon={cilMediaRecord} customClassName="nav-icon" />, 
  }
} else {
  _nav237 = ''
}

/* --------- Tripsheet Vendor Change Process End --------- */

/* --------- Master Process Start --------- */
 
var _nav238 = {} /* Logistics Master Access Head */ 

let main_master = [201,202,203,204,205,206,207,208,209,210,211,212,213,214,215,216,217,218,219,220]
let vehicle_master = [201,202]
let nlfs_vehicle_master = [229]
let driver_master = [203,204]
let shed_master = [205,206]
let freight_master = [207,208]
let gl_list_master = [219,220] 

let sub_master = [221,222,223,224]
let customer_master = [221,222]
let bank_master = [223,224]

let masterMergedArray = main_master
  .concat(sub_master) 

console.log(page_permission,'page_permission - page_permission')
console.log(ifoodsMergedArray,'page_permission - ifoodsMergedArray')

_nav238 = {
  component: CNavGroup, 
  name: 'Master Process',
  level: 'grandparent', 
  is_restricted: 1,
  permission: masterMergedArray, // 👈 Grand Parent Master Access permission
  icon: <CIcon icon={cilControl} customClassName="nav-icon" />,
  items: [
 
    {
      component: CNavGroup,
      name: 'Main - Master',
      level: 'parent', 
      is_restricted: 1,
      permission_ca: main_master, // 👈 Parent Main Master permission
      icon: <CIcon icon={cilPenNib} customClassName="nav-icon" />,
      items: [
        {
          component: CNavItem,
          name: 'NLLD Vehicles',
          level: 'child',
          to: '/VehicleMasterTableData',
          is_restricted: 1,
          permission_ca: vehicle_master, // 👈 Child Vehicle Master permission
          icon: <CIcon icon={cilMediaRecord} size="sm" customClassName="nav-icon" />,
          datatoggle: 'tooltip',
          title: 'NLLD Vehicle Master',
        },
        {
          component: CNavItem,
          name: 'Hire Vehicle Info',
          level: 'child',
          to: '/HireVehicleInfoTableData',
          is_restricted: 1,
          permission_ca: vehicle_master, // 👈 Same as Vehicle Master permission
          icon: <CIcon icon={cilMediaRecord} size="sm" customClassName="nav-icon" />,
          datatoggle: 'tooltip',
          title: 'Hire Vehicle Info Table',
        },
        {
          component: CNavItem,
          name: 'NLFS Vehicles',
          level: 'child',
          to: '/NLFSVehicleMasterTableData',
          is_restricted: 1,
          permission_ca: nlfs_vehicle_master, // 👈 Child Vehicle Master permission
          icon: <CIcon icon={cilMediaRecord} size="sm" customClassName="nav-icon" />,
          datatoggle: 'tooltip',
          title: 'NLFS Vehicle Master',
        },
        {
          component: CNavItem,
          name: 'Driver Master',
          level: 'child',
          to: '/DriverMasterTableData',
          is_restricted: 1,
          permission_ca: driver_master, // 👈 Child Driver Master permission
          icon: <CIcon icon={cilMediaRecord} size="sm" customClassName="nav-icon" />,
          datatoggle: 'tooltip',
          title: 'Driver Master',
        },   
        {
          component: CNavItem,
          name: 'Shed Master',
          level: 'child',
          is_restricted: 1,
          to: '/ShedMasterTableData',
          permission_ca: shed_master, // 👈 Child Shed Master permission
          icon: <CIcon icon={cilMediaRecord} size="sm" customClassName="nav-icon" />,
          datatoggle: 'tooltip',
          title: 'Shed Master',
        },
        {
          component: CNavItem,
          name: 'FOB Freight',
          level: 'child',
          is_restricted: 1,
          to: '/FreightMasterTableData',
          permission_ca: freight_master, // 👈 Child Freight Master permission
          icon: <CIcon icon={cilMediaRecord} size="sm" customClassName="nav-icon" />,
          datatoggle: 'tooltip',
          title: 'Free On Board Type Freight Master',
        },
        {
          component: CNavItem,
          name: 'G/L List Master',
          level: 'child',
          is_restricted: 1,
          to: '/GLListMasterTableData',
          permission_ca: gl_list_master, // 👈 Child Customer Master permission
          icon: <CIcon icon={cilMediaRecord} size="sm" customClassName="nav-icon" />,
          datatoggle: 'tooltip',
          title: 'G/L List Master',
        },        
      ],
    },
    {
      component: CNavGroup,
      name: 'Sub - Master',
      level: 'parent', 
      is_restricted: 1,
      permission_ca: sub_master, // 👈 Parent Sub Master permission
      icon: <CIcon icon={cilPenNib} customClassName="nav-icon" />,
      items: [
        {
          component: CNavItem,
          name: 'Bank Master',
          level: 'child',
          is_restricted: 1,
          to: '/BankMasterTableData',
          permission_ca: bank_master, // 👈 Child Customer Master permission
          icon: <CIcon icon={cilMediaRecord} size="sm" customClassName="nav-icon" />,
          datatoggle: 'tooltip',
          title: 'Bank Master',
        },
        {
          component: CNavItem,
          name: 'Customer Master',
          level: 'child',
          is_restricted: 1,
          to: '/CustomerMasterTableData',
          permission_ca: customer_master, // 👈 Child Customer Master permission
          icon: <CIcon icon={cilMediaRecord} size="sm" customClassName="nav-icon" />,
          datatoggle: 'tooltip',
          title: 'Customer Master',
        },
      ]
    }
  ],
}

/* --------- Master Process End --------- */
 
/*=================================================================================================*/

/* Condition For Enable PYG Screen {'1' => 'Parking yard Gate In'} */
if (inArray(1, page_permission) || user_admin) {
  _nav1 = {
    component: CNavItem,
    name: 'Yard Gate-In / Out',
    to: '/GateIn',
    icon: <CIcon icon={cilInput} customClassName="nav-icon" />,
    datatoggle: 'tooltip',
    title: 'Parking Yard Gate-In / Out',
  }
} else {
  _nav1 = ''
}

/* Condition For Enable VI Screen {'2' => 'Vehicle Inspection List'} */
if (inArray(2, page_permission) || user_admin) {
  _nav2 = {
    component: CNavItem,
    name: 'Vehicle Inspection',
    to: '/vInspection',
    icon: <CIcon icon={cilAirplay} customClassName="nav-icon" />,
    datatoggle: 'tooltip',
    title: 'Vehicle Inspection',
  }
} else {
  _nav2 = ''
}

/* Condition For Enable VI Report Screen {'3' => 'Vehicle Inspection Report'} */
if (inArray(3, page_permission) || user_admin) {
  _nav3 = {
    component: CNavItem,
    name: 'Vehicle Inspection',
    to: '/vInspectionReport',

    datatoggle: 'tooltip',
    title: 'Vehicle Inspection Report',
  }
} else {
  _nav3 = ''
}

/* Condition For Enable RMSTO Screen {'4' => 'RMSTO List'} */
if (inArray(4, page_permission) || user_admin) {
  _nav4 = {
    component: CNavItem,
    name: 'RM / Others / FCI',
    to: '/RMSTOTable',
    icon: <CIcon icon={cilBasket} customClassName="nav-icon" />,
    datatoggle: 'tooltip',
    title: 'RM / Others / FCI',
  }
} else {
  _nav4 = ''
}

/* Condition For Enable RMSTO Report Screen {'5' => 'RMSTO Report'} */
if (inArray(5, page_permission) || user_admin) {
  _nav5 = {
    component: CNavItem,
    name: 'STO',
    to: '/RMSTOReport',

    datatoggle: 'tooltip',
    title: 'STO Report',
  }
} else {
  _nav5 = ''
}

/* Condition For Enable VM Screen {'6' => 'Vehicle Maintenance List'} */
if (inArray(6, page_permission) || user_admin) {
  _nav6 = {
    component: CNavItem,
    name: 'Vehicle Maintenance',
    to: '/VMain',
    icon: <CIcon icon={cilCog} customClassName="nav-icon" />,
    datatoggle: 'tooltip',
    title: 'Vehicle Maintenance',
  }
} else {
  _nav6 = ''
}

/* Condition For Enable VM Report Screen {'7' => 'Vehicle Maintenance Report'} */
if (inArray(7, page_permission) || user_admin) {
  _nav7 = {
    component: CNavItem,
    name: 'Vehicle Maintenance',
    to: '/VMainReport',

    datatoggle: 'tooltip',
    title: 'Vehicle Maintenance Report',
  }
} else {
  _nav7 = ''
}

/* Condition For Enable DV Screen {'8' => 'Document Verification List'} */
if (inArray(8, page_permission) || user_admin) {
  _nav8 = {
    component: CNavItem,
    name: 'Docs. Verification',
    to: '/DocsVerify',
    icon: <CIcon icon={cilSpreadsheet} customClassName="nav-icon" />,
    datatoggle: 'tooltip',
    title: 'Documents Verification',
  }
} else {
  _nav8 = ''
}

/* Condition For Enable DV Report Screen {'9' => 'Document Verification Report'} */
if (inArray(9, page_permission) || user_admin) {
  _nav9 = {
    component: CNavItem,
    name: 'Docs. Verification',
    to: '/DocsVerifyReport',

    datatoggle: 'tooltip',
    title: 'Documents Verification Report',
  }
} else {
  _nav9 = ''
}

/* Condition For Enable VC Screen { 'Vendor Creation Parent' } */
if (
  inArray(10, page_permission) ||
  inArray(11, page_permission) ||
  inArray(12, page_permission) ||
  inArray(13, page_permission) ||
  user_admin
) {
  _navVCHead = {
    component: CNavGroup,
    name: 'Vendor Creation',
    to: '/VendorCreationHome',
    icon: <CIcon icon={cilPenNib} customClassName="nav-icon" />,
    items: [],
  }
} else {
  _navVCHead = ''
}

/* Condition For Enable VCR Screen {'10' => 'Vendor Creation Request'} */
if (inArray(10, page_permission) || user_admin) {
  _nav10 = {
    component: CNavItem,
    name: 'VC Request',
    to: '/VendorCreationHome',

    datatoggle: 'tooltip',
    title: 'Vendor Creation Request',
  }
} else {
  _nav10 = ''
}

/* Condition For Enable VCA Screen {'11' => 'Vendor Creation Approval'} */
if (inArray(11, page_permission) || user_admin) {
  _nav11 = {
    component: CNavItem,
    name: 'VC Approval',
    to: '/VendorCreationApprovalHome',

    datatoggle: 'tooltip',
    title: 'Vendor Creation Approval',
  }
} else {
  _nav11 = ''
}

/* Condition For Enable VCC Screen {'12' => 'Vendor Creation Confirmation'} */
if (inArray(12, page_permission) || user_admin) {
  _nav12 = {
    component: CNavItem,
    name: 'VC Confirmation',
    to: '/VendorCreationConfrimationHome',

    datatoggle: 'tooltip',
    title: 'Vendor Creation Confirmation',
  }
} else {
  _nav12 = ''
}

/* Condition For Enable VCC Screen {'12' => 'Vendor Creation Confirmation'} */
if (inArray(12, page_permission) || user_admin) {
  _nav203 = {
    component: CNavItem,
    name: 'VC Extension',
    to: '/VendorCreationExtensionHome',
    datatoggle: 'tooltip',
    title: 'Vendor Creation Extension',
  }
} else {
  _nav203 = ''
}

/* Condition For Enable VC Report Screen {'13' => 'Vendor Creation Report'} */
if (inArray(13, page_permission) || user_admin) {
  _nav13 = {
    component: CNavItem,
    name: 'Vendor Details',
    to: '/VendorCreationReport',

    datatoggle: 'tooltip',
    title: 'Vendor Creation Report',
  }
} else {
  _nav13 = ''
}
if (
  inArray(45, page_permission) ||
  inArray(14, page_permission) ||
  inArray(97, page_permission) ||
  user_admin
) {
  _navTSHead = {
    component: CNavGroup,
    name: 'TS Creation',
    to: '/TripSheetCreation',
    icon: <CIcon icon={cilNewspaper} customClassName="nav-icon" />,
    items: [],
  }
} else {
  _navTSHead = ''
}

/* Condition For Enable TS Screen {'14' => 'Tripsheet Creation List'} */
if (inArray(14, page_permission) || user_admin) {
  _nav14 = {
    component: CNavItem,
    name: 'TS Creation',
    to: '/TripSheetCreation',
    // icon: <CIcon icon={cilNewspaper} customClassName="nav-icon" />,
    datatoggle: 'tooltip',
    title: 'Trip Sheet Creation',
  }
} else {
  _nav14 = ''
}

if (inArray(45, page_permission) || user_admin) {
  _nav45 = {
    component: CNavItem,
    name: 'TS Change',
    to: '/TripSheetEditHome',
    datatoggle: 'tooltip',
    title: 'Trip Sheet Change',
  }
} else {
  _nav45 = ''
}

if (inArray(45, page_permission) || user_admin) {
  _nav451 = {
    component: CNavItem,
    name: 'Trip Info Change',
    to: '/TripInfoEditHome',
    datatoggle: 'tooltip',
    title: 'Trip Info Change',
  }
} else {
  _nav451 = ''
}

if (inArray(97, page_permission) || user_admin) {
  _nav49 = {
    component: CNavItem,
    name: 'Others',
    to: '/OthersTripsheet',
    datatoggle: 'tooltip',
    title: 'Others Tripsheet Creation',
  }
} else {
  _nav49 = ''
}

/* Condition For Enable TS Report Screen {'15' => 'Tripsheet Creation Report'} */
if (inArray(15, page_permission) || user_admin) {
  _nav15 = {
    component: CNavItem,
    name: 'TripSheet Details',
    to: '/TSCreationReport',

    datatoggle: 'tooltip',
    title: 'TripSheet Creation Report',
  }
} else {
  _nav15 = ''
}

/* Condition For Enable TS Report Screen {'15' => 'Tripsheet Creation Report'} */
if (inArray(15, page_permission) || user_admin) {
  _nav205 = {
    component: CNavItem,
    name: 'Open TripSheet Info.',
    to: '/OpenTSInfoReport',

    datatoggle: 'tooltip',
    title: `Vehicle's Open TripSheets Information Report`,
  }
} else {
  _nav205 = ''
}

/* Condition For Enable TS Report Screen {'191' => 'Tripsheet Accounts Info. Report'} */
if (inArray(191, page_permission) || user_admin) {
  _nav202 = {
    component: CNavItem,
    name: 'TripSheet Acc. Info.',
    to: '/TSAccountsReport',

    datatoggle: 'tooltip',
    title: 'TripSheet Accounts Info Report',
  }
} else {
  _nav202 = ''
}

/* Condition For Enable Delivery Track Screen { 'Delivery Track Parent' } */
if (
  inArray(98, page_permission) ||
  inArray(99, page_permission) ||
  user_admin
) {
  _navTripDeliveryTrackHead = {
    component: CNavGroup,
    name: 'Delivery Tracking',
    to: '/DeliveryTrackHome',
    icon: <CIcon icon={cilCash} customClassName="nav-icon" />,
    items: [],
  }
} else {
  _navTripDeliveryTrackHead = ''
}

/* Condition For Enable AP Screen {'98' => 'Delivery Track List'} */
if (inArray(98, page_permission) || user_admin) {
  _nav77 = {
    component: CNavItem,
    name: 'DT Home',
    to: '/DeliveryTrackHome',
    datatoggle: 'tooltip',
    title: 'Delivery Track Home',
  }
} else {
  _nav77 = ''
}

/* Condition For Enable AP Screen {'98' => 'Delivery Track List'} */
if (inArray(98, page_permission) || user_admin) {
  _nav213 = {
    component: CNavItem,
    name: 'Despatch',
    to: '/DespatchHome',
    datatoggle: 'tooltip',
    title: 'Despatch Home',
  }
} else {
  _nav213 = ''
}

/* Condition For Enable AP Screen {'99' => 'Delivery Track Report'} */
if (inArray(99, page_permission) || user_admin) {
  _nav78 = {
    component: CNavItem,
    name: 'DT Report',
    to: '/DeliveryTrackReport',
    datatoggle: 'tooltip',
    title: 'DT Report',
  }
} else {
  _nav78 = ''
}


/* Condition For Enable Advance Screen { 'Advance Creation Parent' } */
if (
  inArray(44, page_permission) ||
  inArray(16, page_permission) ||
  inArray(100, page_permission) ||
  user_admin
) {
  _navADVHead = {
    component: CNavGroup,
    name: 'Advance',
    to: '/AdvancePayment',
    icon: <CIcon icon={cilCash} customClassName="nav-icon" />,
    items: [],
  }
} else {
  _navADVHead = ''
}

/* Condition For Enable AP Screen {'16' => 'Advance Payment List'} */
if (inArray(16, page_permission) || user_admin) {
  _nav16 = {
    component: CNavItem,
    name: 'Advance Payment',
    to: '/AdvancePayment',
    datatoggle: 'tooltip',
    title: 'Advance Payment',
  }
} else {
  _nav16 = ''
}

if (inArray(44, page_permission) || user_admin) {
  _nav44 = {
    component: CNavItem,
    name: 'Additional Advance',
    to: '/AdditionalAdvanceHome',
    datatoggle: 'tooltip',
    title: 'Additional Advance',
  }
} else {
  _nav44 = ''
}

/* Condition For Enable AP Report Screen {'17' => 'Advance Payment Report'} */
if (inArray(17, page_permission) || user_admin) {
  _nav17 = {
    component: CNavItem,
    name: 'Advance Details',
    to: '/AdvancePaymentReport',

    datatoggle: 'tooltip',
    title: 'Advance Payment Report',
  }
} else {
  _nav17 = ''
}

/* Condition For Enable VA Screen { 'Vehicle Assignment Parent' } */
if (
  inArray(18, page_permission) ||
  inArray(19, page_permission) ||
  inArray(20, page_permission) ||
  inArray(21, page_permission) ||
  inArray(150, page_permission) ||
  user_admin
) {
  _navVAHead = {
    component: CNavGroup,
    name: 'Vehicle Assign.',
    to: '/ShipmentCreation',
    icon: <CIcon icon={cilTruck} customClassName="nav-icon" />,
    datatoggle: 'tooltip',
    title: 'Vehicle Assignment',
    items: [],
  }
} else {
  _navVAHead = ''
}

/* Condition For Enable VAC NLFD Screen {'18' => 'Vehicle Assignment Creation - NLFD'} */
if (inArray(18, page_permission) || user_admin) {
  _nav18 = {
    component: CNavItem,
    name: 'VH.Assign Foods',
    to: '/ShipmentCreation',

    datatoggle: 'tooltip',
    title: 'Vehicle Assignment Foods',
  }
} else {
  _nav18 = ''
}

/* Condition For Enable VAC NLFD Report Screen {'19' => 'Vehicle Assignment Creation Report - NLFD'} */
if (inArray(19, page_permission) || user_admin) {
  _nav19 = {
    component: CNavItem,
    name: 'VH.Assign NLFD Info.',
    to: '/ShipmentCreationNLFDReport',

    datatoggle: 'tooltip',
    title: 'Vehicle Assignment NLFD Report',
  }
} else {
  _nav19 = ''
}

/* Condition For Enable VAC NLFD Delivery Report Screen {'148' => 'NLFD - Delivery Report'} */
if (inArray(148, page_permission) || user_admin) {
  _nav108 = {
    component: CNavItem,
    name: 'NLFD Del. Info.',
    to: '/NLFDInvoiceReport',

    datatoggle: 'tooltip',
    title: 'NLFD Invoice Report',
  }
} else {
  _nav108 = ''
}

/* Condition For Enable Hire Vehicles Freight Info. Report Screen {'180' => 'Hire Vehicles Freight Info. report'} */
if (inArray(180, page_permission) || user_admin) {
  _nav210 = {
    component: CNavItem,
    name: 'HVITW Freight Info.',
    to: '/HVITWFreightReport',

    datatoggle: 'tooltip',
    title: 'Hire Vehicles Inco Term Wise Freight Info. report',
  }
} else {
  _nav210 = ''
}

/* Shipment Update Screen */
if (user_admin) {
  _nav181 = {
    component: CNavItem,
    name: 'Shipment Update',
    to: '/ShipmentUpdation',

    datatoggle: 'tooltip',
    title: 'Shipment Updation',
  }
} else {
  _nav181 = ''
}

/* Depo Shipment Update Screen */
if (user_admin) {
  _nav201 = {
    component: CNavItem,
    name: 'Depo Ship. Update',
    to: '/DepoShipmentUpdation',

    datatoggle: 'tooltip',
    title: 'Depo Shipment Updation',
  }
} else {
  _nav201 = ''
}

/* Condition For Enable VAC NLCD Screen {'20' => 'Vehicle Assignment Creation - NLCD'} */
if (inArray(20, page_permission) || user_admin) {
  _nav20 = {
    component: CNavItem,
    name: 'VH.Assign Consumer',
    to: '/ShipmentCreationConsumer',

    datatoggle: 'tooltip',
    title: 'Vehicle Assignment Consumer',
  }
} else {
  _nav20 = ''
}

/* Condition For Enable VAC NLCD Report Screen {'21' => 'Vehicle Assignment Creation Report - NLCD'} */
if (inArray(21, page_permission) || user_admin) {
  _nav21 = {
    component: CNavItem,
    name: 'VH.Assign NLCD Info.',
    to: '/ShipmentCreationNLCDReport',

    datatoggle: 'tooltip',
    title: 'Vehicle Assignment NLCD Report',
  }
} else {
  _nav21 = ''
}

/* Condition For Enable VAC NLFD Delivery Report Screen {'149' => 'NLCD - Delivery Report'} */
if (inArray(149, page_permission) || user_admin) {
  _nav109 = {
    component: CNavItem,
    name: 'NLCD Del. Info.',
    to: '/NLCDInvoiceReport',

    datatoggle: 'tooltip',
    title: 'NLCD Invoice Report',
  }
} else {
  _nav109 = ''
}

/* Condition For Enable VAC Shipment Invoice Attachment Screen {'150' => 'Invoice Attachment'} */
if (inArray(150, page_permission) || user_admin) {
  _nav110 = {
    component: CNavItem,
    name: 'Invoice Attach.',
    to: '/InvoiceAttachment',

    datatoggle: 'tooltip',
    title: 'Invoice Attachment',
  }
} else {
  _nav110 = ''
}

/* Condition For Enable VAC Shipment Invoice Attachment Screen {'150' => 'Invoice Attachment'} */
if (inArray(150, page_permission) || user_admin) {
  _nav255 = {
    component: CNavItem,
    name: 'Bulk Data Push',
    to: '/InvAttachBulkDataPush',

    datatoggle: 'tooltip',
    title: 'Invoice Attachment',
  }
} else {
  _nav255 = ''
}

/* Condition For Enable VAC Shipment Invoice Attachment Screen {'150' => 'Invoice Attachment'} */
if (inArray(150, page_permission) || user_admin) {
  _nav214 = {
    component: CNavItem,
    name: 'Inv. At. Report',
    to: '/InvoiceAttachmentReport',

    datatoggle: 'tooltip',
    title: 'Invoice Attachment Report',
  }
} else {
  _nav214 = ''
}

/* Condition For Enable CC Screen { 'Customer Creation Parent' } */
if (
  inArray(22, page_permission) ||
  inArray(23, page_permission) ||
  inArray(24, page_permission) ||
  inArray(25, page_permission) ||
  user_admin
) {
  _navCCHead = {
    component: CNavGroup,
    name: 'Cus. Creation',
    to: '/RJcustomerCreationHome',
    icon: <CIcon icon={cilGroup} customClassName="nav-icon" />,
    items: [],
  }
} else {
  _navCCHead = ''
}

/* Condition For Enable CCR Screen {'22' => 'Customer Creation Request'} */
if (inArray(22, page_permission) || user_admin) {
  _nav22 = {
    component: CNavItem,
    name: 'CC Request',
    to: '/RJcustomerCreationHome',

    datatoggle: 'tooltip',
    title: 'Return Journey Customer Creation Request',
  }
} else {
  _nav22 = ''
}

/* Condition For Enable CCA Screen {'23' => 'Customer Creation Approval'} */
if (inArray(23, page_permission) || user_admin) {
  _nav23 = {
    component: CNavItem,
    name: 'CC Approval',
    to: '/RJcustomerCreationApprovalHome',

    datatoggle: 'tooltip',
    title: 'RJ Customer Create Approval',
  }
} else {
  _nav23 = ''
}

/* Condition For Enable CCC Screen {'24' => 'Customer Creation Confirmation'} */
if (inArray(24, page_permission) || user_admin) {
  _nav24 = {
    component: CNavItem,
    name: 'CC Confirmation',
    to: '/RJcustomerCreationConfrimationHome',

    datatoggle: 'tooltip',
    title: 'RJ Customer Creation Confirmation',
  }
} else {
  _nav24 = ''
}

/* Condition For Enable CCC Screen {'24' => 'Customer Creation Extension'} */
if (inArray(24, page_permission) || user_admin) {
  _nav204 = {
    component: CNavItem,
    name: 'CC Extension',
    to: '/RJcustomerCreationExtensionHome',
    datatoggle: 'tooltip',
    title: 'RJ Customer Creation Extension',
  }
} else {
  _nav204 = ''
}

/* Condition For Enable CC Report Screen {'25' => 'Customer Creation Report'} */
if (inArray(25, page_permission) || user_admin) {
  _nav25 = {
    component: CNavItem,
    name: 'RJ Cus. Details',
    to: '/CustomerCreationReport',

    datatoggle: 'tooltip',
    title: 'RJ Customer Creation Report',
  }
} else {
  _nav25 = ''
}

if (inArray(26, page_permission) || inArray(261, page_permission) || user_admin) {
  _navRJHead = {
    component: CNavGroup,
    name: 'Return Journey',
    to: '/RjSalesOrder',
    icon: <CIcon icon={cilLocomotive} customClassName="nav-icon" />,
    items: [],
  }
} else {
  _navRJHead = ''
}
/* Condition For Enable RJ SOC Screen { '26' => 'Return Journey Sales Order Creation' } */
if (inArray(26, page_permission) || user_admin) {
  _nav26 = {
    component: CNavItem,
    // name: 'RJ SO Creation',
    name: 'RJSO Request',
    to: '/RjSalesOrderCreation',

    datatoggle: 'tooltip',
    title: 'RJSO Request Creation',
  }
} else {
  _nav26 = ''
}

if (inArray(261, page_permission) || user_admin) {
  _nav261 = {
    component: CNavItem,
    // name: 'RJ Acc Receivable',
    name: 'RJSO Approval',
    to: '/RjSalesOrderReceivable',

    datatoggle: 'tooltip',
    // title: 'RJ SO Account Receivable',
    title: 'RJSO Approval',
  }
} else {
  _nav261 = ''
}

/* Condition For Enable RJ SOC Report Screen {'27' => 'Return Journey Sales Order Creation Report'} */
if (inArray(27, page_permission) || user_admin) {
  _nav27 = {
    component: CNavItem,
    name: 'RJ Sale Order',
    to: '/RJSOCreationReport',

    datatoggle: 'tooltip',
    title: 'Return Journey Sales Order Creation Report',
  }
} else {
  _nav27 = ''
}

/* Condition For Enable DI Screen { 'Diesel Intent Creation Parent' } */
if (
  inArray(28, page_permission) ||
  inArray(233, page_permission) ||
  inArray(234, page_permission) || 
  inArray(41, page_permission) || 
  user_admin
) {
  _navDIHead = {
    component: CNavGroup,
    name: 'Diesel Indent',
    to: '/DieselIntentHome',
    icon: <CIcon icon={cilPaintBucket} customClassName="nav-icon" />,
    items: [],
  }
} else {
  _navDIHead = ''
}

/* Condition For Enable DIR Screen {'28' => 'Diesel Intent Creation Request'} */
if (inArray(28, page_permission) || user_admin) {
  _nav28 = {
    component: CNavItem,
    name: 'DI Creation ',
    to: '/DieselIntentHome',

    datatoggle: 'tooltip',
    title: 'Diesel Indent Creation',
  }
} else {
  _nav28 = ''
}

/* Condition For Enable DIR Screen {'28' => 'Diesel Intent Creation Request'} */
if (inArray(28, page_permission) || user_admin) {
  _nav281 = {
    component: CNavItem,
    name: 'DI Cancel ',
    to: '/DieselIntentCancelHome',

    datatoggle: 'tooltip',
    title: 'Diesel Indent Cancel',
  }
} else {
  _nav281 = ''
}

/* Condition For Enable DIS Vendor Invoice Screen {'233' => 'DIS Vendor Invoice'} */
if (inArray(233, page_permission) || user_admin) {
  _nav246 = {
    component: CNavItem,
    name: 'DIS Vendor Invoice',
    to: '/DIInvoiceCreationHome',

    datatoggle: 'tooltip',
    title: 'Diesel Indent Vendor Invoice Creation',
  }
} else {
  _nav246 = ''
}

/* Condition For Enable DIS Payment Screen { '234' => 'DIS Payment' } */
if (inArray(234, page_permission) || user_admin) {
  _nav247 = {
    component: CNavItem,
    name: 'DIS Payment',
    to: '/DISPaymentHome',
    datatoggle: 'tooltip',
    title: 'Diesel Indent Sequence Payment', 
  }
} else {
  _nav247 = ''
}

// /* Condition For Enable TS ST. Report Screen { '73' => 'Tripsheet Payment Report' } */
// if (inArray(230, page_permission) || user_admin) {
//   _nav248 = {
//     component: CNavItem,
//     name: 'DIS Payment Info',
//     to: '/DISPaymentReport',
//     datatoggle: 'tooltip',
//     title: 'iesel Indent Sequence Payment Report',
//   }
// } else {
//   _nav248 = ''
// }

if (inArray(41, page_permission) || user_admin) {
  _nav41 = {
    component: CNavItem,
    name: 'Additional DI Amount',
    to: '/DieselIntentHomeRegister',

    datatoggle: 'tooltip',
    title: 'Additional Diesel Amount',
  }
} else {
  _nav41 = ''
} 

/* Condition For Enable DI Report {'31' => 'Diesel Intent Report'} */
if (inArray(31, page_permission) || user_admin) {
  _nav31 = {
    component: CNavItem,
    name: 'Diesel Indent Info.',
    to: '/DieselIntentReport',

    datatoggle: 'tooltip',
    title: 'Diesel Indent Report',
  }
} else {
  _nav31 = ''
}

/* Condition For Enable FS DI Info Report {'236' => 'FS DI Info Report'} */
if (inArray(236, page_permission) || user_admin) {
  _nav250 = {
    component: CNavItem,
    name: 'FS DI Info.',
    to: '/NLFSDieselIntentReport',

    datatoggle: 'tooltip',
    title: 'Fuel Station Diesel Indent Information Report',
  }
} else {
  _nav250 = ''
}

/* Condition For Enable FS Screen { 'Fuel Station Parent' } */
if ( 
  inArray(29, page_permission) ||
  inArray(30, page_permission) ||
  inArray(230, page_permission) ||
  inArray(231, page_permission) ||
  inArray(232, page_permission) || 
  inArray(235, page_permission) ||
  user_admin
) {
  _navFSHead = {
    component: CNavGroup,
    name: 'Fuel Station',
    to: '/DieselIntentHome',
    icon: <CIcon icon={cilPaintBucket} customClassName="nav-icon" />,
    items: [],
  }
} else {
  _navFSHead = ''
}

/* Condition For Enable DIC Screen {'29' => 'Diesel Intent Creation Confirmation'} */
if (inArray(29, page_permission) || user_admin) {
  _nav29 = {
    component: CNavItem,
    name: 'FS Confirmation',
    to: '/DiConfirmationHome',

    datatoggle: 'tooltip',
    title: 'Fuel Station Diesel Indent Confirmation',
  }
} else {
  _nav29 = ''
}

/* Condition For Enable DIA Screen {'30' => 'Diesel Intent Creation Approval'} */
if (inArray(30, page_permission) || user_admin) {
  _nav30 = {
    component: CNavItem,
    name: 'FS Approval',
    to: '/DiApprovalHome',

    datatoggle: 'tooltip',
    title: 'Fuel Station Diesel Indent Approval',
  }
} else {
  _nav30 = ''
}

/* Condition For Enable FSA Screen {'230' => 'FS Accounts Approval'} */
if (inArray(230, page_permission) || user_admin) {
  _nav243 = {
    component: CNavItem,
    name: 'FS Acc. Approval',
    to: '/DIAccountsApprovalHome',

    datatoggle: 'tooltip',
    title: 'Fuel Station Diesel Indent Accounts Approval',
  }
} else {
  _nav243 = ''
}

/* Condition For Enable FS DIS TS Creation Screen {'231' => 'FS DIS No Creation - TS'} */
if (inArray(231, page_permission) || user_admin) {
  _nav244 = {
    component: CNavItem,
    name: 'FS DIS No Crn. - TS',
    to: '/DISNoCreation',

    datatoggle: 'tooltip',
    title: 'Fuel Station Bill Creation for Tripsheets',
  }
} else {
  _nav244 = ''
}

/* Condition For Enable FS DIS NTS Creation Screen {'232' => 'FS DIS No Creation - NTS'} */
if (inArray(232, page_permission) || user_admin) {
  _nav245 = {
    component: CNavItem,
    name: 'FS DIS No Crn. - NTS',
    to: '/NLFSDISNoCreation',

    datatoggle: 'tooltip',
    title: 'Fuel Station Bill Creation for Diesel Indents',
  }
} else {
  _nav245 = ''
}

/* Condition For Enable DIS Receipt Screen {'235' => 'FS DIS Receipt Creation'} */
if (inArray(235, page_permission) || user_admin) {
  _nav249 = {
    component: CNavItem,
    name: 'FS DIS Receipt',
    to: '/DIPaymentReceiptHome',

    datatoggle: 'tooltip',
    title: 'Fuel Station Diesel Indent Receipt Creation',
  }
} else {
  _nav249 = ''
}

/* Condition For Enable TSC Screen { 'Tripsheet Closure Parent' } */
if (inArray(32, page_permission) || inArray(321, page_permission) || user_admin) {
  _navTSCHead = {
    component: CNavGroup,
    name: 'TS Closure',
    to: '/TSClosureHome',
    icon: <CIcon icon={cilCreditCard} customClassName="nav-icon" />,
    items: [],
  }
} else {
  _navTSCHead = ''
}

/* Condition For Enable TS CL. Screen { '32' => 'Tripsheet Closure List' } */
if (inArray(32, page_permission) || user_admin) {
  _nav32 = {
    component: CNavItem,
    name: 'Expenses Capture',
    to: '/TSExpenseCapture',

    datatoggle: 'tooltip',
    title: 'Trip Sheet Expense Closure',
  }
} else {
  _nav32 = ''
}

/* Condition For Enable TS Info CL. Screen { '321' => 'Tripsheet Info Closure List' } */
if (inArray(321, page_permission) || user_admin) {
  _nav321 = {
    component: CNavItem,
    name: 'Income Capture',
    to: '/TSIncomeCapture',

    datatoggle: 'tooltip',
    title: 'Trip Sheet Income Closure',
  }
} else {
  _nav321 = ''
}

/* Condition For Enable TS CL. Report Screen { '33' => 'Tripsheet Closure Report' } */
if (inArray(33, page_permission) || user_admin) {
  _nav33 = {
    component: CNavItem,
    name: 'TS Closure Info.',
    to: '/TSClosureReport',

    datatoggle: 'tooltip',
    title: 'TripSheet Closure Report',
  }
} else {
  _nav33 = ''
}

/* Condition For Enable TS ST. Screen { '34' => 'Tripsheet Settlement List' } */
if (inArray(34, page_permission) || user_admin) {
  _nav34 = {
    component: CNavItem,
    name: 'TS Settlement',
    to: '/TSSettlement',
    icon: <CIcon icon={cilExposure} customClassName="nav-icon" />,
    datatoggle: 'tooltip',
    title: 'Trip Sheet Settlement',
  }
} else {
  _nav34 = ''
}

/* Condition For Enable TS ST. Report Screen { '35' => 'Tripsheet Settlement Report' } */
if (inArray(35, page_permission) || user_admin) {
  _nav35 = {
    component: CNavItem,
    name: 'TS Settlement Info.',
    to: '/TSSettlementReport',

    datatoggle: 'tooltip',
    title: 'TripSheet Settlement Report',
  }
} else {
  _nav35 = ''
}

/* Condition For Enable FI EC. Screen { '36' => ''FI Entry Creation' } */
if (inArray(36, page_permission) || inArray(85, page_permission) || user_admin) {
  _nav36 = {
    component: CNavItem,
    name: 'FI Entry',
    to: '/FIScreen',
    icon: <CIcon icon={cilCalculator} customClassName="nav-icon" />,
    datatoggle: 'tooltip',
    title: 'FI Entry',
  }
} else {
  _nav36 = ''
}

/* Condition For Enable FI EC. Report Screen { '37' => ''FI Entry Report' } */
if (inArray(37, page_permission) || user_admin) {
  _nav37 = {
    component: CNavItem,
    name: 'FI Entry Info.',
    to: '/FIEntryReport',

    datatoggle: 'tooltip',
    title: 'FI Entry Report',
  }
} else {
  _nav37 = ''
}

/* Condition For Enable TSC Screen { 'Vehicle Status Parent' } */
if (inArray(43, page_permission) || user_admin) {
  _navVESTHead = {
    component: CNavGroup,
    name: 'Tripsheet Status',
    to: '/VehicleCurrentPosition',
    icon: <CIcon icon={cilTruck} customClassName="nav-icon" />,
    items: [],
  }
} else {
  _navVESTHead = ''
}

/* Condition For Enable Current Position { '43' => 'Vehicle Current Position' } */
if (inArray(43, page_permission) || user_admin) {
  _nav43 = {
    component: CNavItem,
    name: 'Current Position',
    to: '/VehicleCurrentPosition',
    // icon: <CIcon icon={cilCheckCircle} customClassName="nav-icon" />,
    datatoggle: 'tooltip',
    title: 'Vehicle Current Position',
  }
} else {
  _nav43 = ''
}

/* Condition For Enable Current Position { '43' => 'Vehicle Current Position' } */
if (inArray(43, page_permission) || user_admin) {
  _nav431 = {
    component: CNavItem,
    name: 'Regular Tripsheet',
    to: '/VehicleTripSearch',
    // icon: <CIcon icon={cilCheckCircle} customClassName="nav-icon" />,
    datatoggle: 'tooltip',
    title: 'Vehicle Current Position',
  }
} else {
  _nav431 = ''
}

/* Condition For Enable Current Position { '43' => 'Vehicle Current Position' } */
if (inArray(43, page_permission) || user_admin) {
  _nav434 = {
    component: CNavItem,
    name: 'Own Vehicle Status',
    to: '/OwnVehicleStatus',
    // icon: <CIcon icon={cilCheckCircle} customClassName="nav-icon" />,
    datatoggle: 'tooltip',
    title: 'Own Vehicle Trip Status',
  }
} else {
  _nav434 = ''
}

/* Condition For Enable Current Position { '43' => 'Vehicle Current Position' } */
if (inArray(43, page_permission) || user_admin) {
  _nav432 = {
    component: CNavItem,
    name: 'RAKE Tripsheet',
    to: '/RakeVehicleTripSearch',
    // icon: <CIcon icon={cilCheckCircle} customClassName="nav-icon" />,
    datatoggle: 'tooltip',
    title: 'RAKE Vehicle Current Position',
  }
} else {
  _nav432 = ''
}

/* Condition For Enable Current Position { '43' => 'Vehicle Current Position' } */
if (inArray(43, page_permission) || user_admin) {
  _nav433 = {
    component: CNavItem,
    name: 'FCI Tripsheet',
    to: '/FciVehicleTripSearch',
    // icon: <CIcon icon={cilCheckCircle} customClassName="nav-icon" />,
    datatoggle: 'tooltip',
    title: 'FCI Vehicle Current Position',
  }
} else {
  _nav433 = ''
}

/* Condition For Enable Trip Vehicle Request Head */
if (
  inArray(96, page_permission) ||
  user_admin
) {
  _navVehicleRequestHead = {
    component: CNavGroup,
    name: 'Veh. Request',
    to: '/VehicleRequestTable',
    icon: <CIcon icon={cilTruck} customClassName="nav-icon" />,
    items: [],
  }
} else {
  _navVehicleRequestHead = ''
}

/* Condition For Enable Vehicle Request Screen { '96' => 'Vehicle Request Master' } */
if (inArray(96, page_permission) || user_admin) {
  _nav104 = {
    component: CNavItem,
    name: 'VR Dashboard',
    to: '/VehicleRequestTable',
    // icon: <CIcon icon={cilNotes} customClassName="nav-icon" />,
    datatoggle: 'tooltip',
    title: 'Vehicle Request',
  }
} else {
  _nav104 = ''
}

/* Condition For Enable Vehicle Request Screen { '96' => 'Vehicle Request Report' } */
if (inArray(96, page_permission) || user_admin) {
  _nav105 = {
    component: CNavItem,
    name: 'VR Report',
    to: '/VehicleRequestReport',
    // icon: <CIcon icon={cilNotes} customClassName="nav-icon" />,
    datatoggle: 'tooltip',
    title: 'Vehicle Request Report',
  }
} else {
  _nav105 = ''
}

/* Condition For Enable Freight Report Screen {'48' => 'Freight Master Report'} */
if (inArray(48, page_permission) || user_admin) {
  _nav48 = {
    component: CNavItem,
    name: 'FOB Freight Report',
    to: '/FreightMasterReport',

    datatoggle: 'tooltip',
    title: 'FOB Freight Master Report',
  }
} else {
  _nav48 = ''
}

/* Condition For Enable Freight Report Screen {'237' => 'NLFD Freight Report'} */
if (inArray(237, page_permission) || user_admin) {
  _nav251 = {
    component: CNavItem,
    name: 'NLFD Freight Report',
    to: '/NLFDFreightReport',

    datatoggle: 'tooltip',
    title: 'NLFD Freight Report',
  }
} else {
  _nav251 = ''
}

/* Condition For Enable Freight Report Screen {'238' => 'NLCD Freight Report'} */
if (inArray(238, page_permission) || user_admin) {
  _nav252 = {
    component: CNavItem,
    name: 'NLCD Freight Report',
    to: '/NLCDFreightReport',

    datatoggle: 'tooltip',
    title: 'NLCD Freight Report',
  }
} else {
  _nav252 = ''
}

/* Condition For Enable Trip Payment Head */
if (
  inArray(225, page_permission) ||
  inArray(226, page_permission) ||
  inArray(227, page_permission) ||
  inArray(228, page_permission) ||
  user_admin
) {
  _navVehicleUtilizationHead = {
    component: CNavGroup,
    name: 'Vehicle Utilization',
    to: '/VehUtilization',
    icon: <CIcon icon={cilBank} customClassName="nav-icon" />,
    items: [],
  }
} else {
  _navVehicleUtilizationHead = ''
}

/* Condition For Enable TS PT. Screen { '225' => 'Vehicle Utilization - Own Vehicles FG-SALES Report' } */
if (inArray(225, page_permission) || user_admin) {
  _nav239 = {
    component: CNavItem,
    name: 'Own FG-SALES',
    to: '/VehicleUtilizationOwnFgReport',
    datatoggle: 'tooltip',
    title: 'Vehicle Utilization : Own Vehicles - FG Sales',
  }
} else {
  _nav239 = ''
}

/* Condition For Enable TS PT. Screen { '226' => 'Vehicle Utilization - Hire Vehicles FG-SALES Report' } */
if (inArray(226, page_permission) || user_admin) {
  _nav240 = {
    component: CNavItem,
    name: 'Hire FG-SALES',
    to: '/VehicleUtilizationHireFgReport',
    datatoggle: 'tooltip',
    title: 'Vehicle Utilization : Hire Vehicles - FG Sales',
  }
} else {
  _nav240 = ''
}

/* Condition For Enable TS PT. Screen { '227' => 'Vehicle Utilization - Own Vehicles Others Report' } */
if (inArray(227, page_permission) || user_admin) {
  _nav241 = {
    component: CNavItem,
    name: 'Own Others',
    to: '/VehicleUtilizationOwnOthersReport',
    datatoggle: 'tooltip',
    title: 'Vehicle Utilization : Own Vehicles - OTHERS',
  }
} else {
  _nav241 = ''
}

/* Condition For Enable TS PT. Screen { '228' => 'Vehicle Utilization - Hire Vehicles Others Report' } */
if (inArray(228, page_permission) || user_admin) {
  _nav242 = {
    component: CNavItem,
    name: 'Hire Others',
    to: '/VehicleUtilizationHireOthersReport',
    datatoggle: 'tooltip',
    title: 'Vehicle Utilization : Hire Vehicles - OTHERS',
  }
} else {
  _nav242 = ''
}

/* Condition For Enable Trip Payment Head */
if (
  inArray(71, page_permission) ||
  inArray(72, page_permission) ||
  inArray(73, page_permission) ||
  user_admin
) {
  _navTripPaymentHead = {
    component: CNavGroup,
    name: 'TS Payment',
    to: '/TSPayment',
    icon: <CIcon icon={cilBank} customClassName="nav-icon" />,
    items: [],
  }
} else {
  _navTripPaymentHead = ''
}

/* Condition For Enable TS PT. Screen { '71' => 'Tripsheet Hire Deduction' } */
if (inArray(71, page_permission) || user_admin) {
  _nav71 = {
    component: CNavItem,
    name: 'Hire Deduction',
    to: '/TSDeduction',
    datatoggle: 'tooltip',
    title: 'Trip Sheet Hire Deduction',
  }
} else {
  _nav71 = ''
}

/* Condition For Enable TS ST. Report Screen { '72' => 'Tripsheet Hire Payment' } */
if (inArray(72, page_permission) || user_admin) {
  _nav72 = {
    component: CNavItem,
    name: 'Hire Payment',
    to: '/TSPayment',
    datatoggle: 'tooltip',
    title: 'Trip Sheet Hire Payment',
    // component: CNavItem,
    // name: 'Income Debit.',
    // to: '/TSIncomeDebit',
    // datatoggle: 'tooltip',
    // title: 'Tripsheet Income Debit',
  }
} else {
  _nav72 = ''
}

/* Condition For Enable TS ST. Report Screen { '73' => 'Tripsheet Payment Report' } */
if (inArray(73, page_permission) || user_admin) {
  _nav73 = {
    component: CNavItem,
    name: 'Ded. & Payment Info',
    to: '/TSPaymentReport',
    datatoggle: 'tooltip',
    title: 'TripSheet Deduction & Payment Report',
  }
} else {
  _nav73 = ''
}

/* Condition For Enable User Login Status Screen { '42' => ' User Login Status' } */
if (inArray(42, page_permission) || user_admin) {
  _nav42 = {
    component: CNavItem,
    name: ' User Login Status',
    to: '/UserLoginStatusTable',
    icon: <CIcon icon={cilStar} customClassName="nav-icon" />,
    datatoggle: 'tooltip',
    title: 'User Login Status',
  }
} else {
  _nav42 = ''
}

if (inArray(46, page_permission) || user_admin) {
  _nav46 = {
    component: CNavItem,
    name: 'Fast Tag Report',
    to: '/FastTagReport',
    datatoggle: 'tooltip',
    title: 'Fast Tag Report',
  }
} else {
  _nav46 = ''
}
if (inArray(47, page_permission) || user_admin) {
  _nav47 = {
    component: CNavItem,
    name: 'Gate In Report',
    to: '/GateInReport',
    datatoggle: 'tooltip',
    title: 'Gate In Report',
  }
} else {
  _nav47 = ''
}

/* Condition For Enable Visited Report Info Screen { '177' => 'Visited Report Info' } */
if (inArray(177, page_permission) || user_admin) {
  _nav206 = {
    component: CNavItem,
    name: 'Report Visit Info.',
    to: '/ReportVisitInfoReport',
    datatoggle: 'tooltip',
    title: 'Report Visit Info. Report',
  }
} else {
  _nav206 = ''
}

/* Condition For Enable Delivery Track Screen { 'Delivery Track Parent' } */
if (
  inArray(178, page_permission) ||
  inArray(179, page_permission) ||
  user_admin
) {
  _navOwnVehicleTripInfoTrackHead = {
    component: CNavGroup,
    name: 'Trip Info Capturing',
    to: '/DeliveryTrackHome',
    icon: <CIcon icon={cilCash} customClassName="nav-icon" />,
    items: [],
  }
} else {
  _navOwnVehicleTripInfoTrackHead = ''
}

/* Condition For Enable Own Vehicles Trip Info Capturing Screen { '178' => 'Own Vehicles Trip Info. Capture' } */
if (inArray(178, page_permission) || user_admin) {
  _nav207 = {
    component: CNavItem,
    name: 'OV. Trip Info.',
    to: '/OVTICHome',
    datatoggle: 'tooltip',
    title: 'Own Vehicles Trip Info Capture',
  }
} else {
  _nav207 = ''
}

/* Condition For Enable Own Vehicles Trip Info Capturing Screen { '178' => 'Own Vehicles Trip Info. Capture' } */
if (inArray(178, page_permission) || user_admin) {
  _nav254 = {
    component: CNavItem,
    name: 'OV. Trip Info. Edit',
    to: '/OVTICEdit',
    datatoggle: 'tooltip',
    title: 'Own Vehicle Trip Info. Capture Edit',
  }
} else {
  _nav254 = ''
}

/* Condition For Enable Own Vehicles Trip Info Capturing Report Screen { '179' => 'Own Vehicles Trip Info. Report' } */
if (inArray(179, page_permission) || user_admin) {
  _nav208 = {
    component: CNavItem,
    name: 'OV. Trip Report',
    to: '/OVTIReport',
    datatoggle: 'tooltip',
    title: 'Own Vehicles Trip Info. Report',
  }
} else {
  _nav208 = ''
}

/* Condition For Enable Own Vehicles Trip Info Capturing Report Screen { '192' => 'Own Vehicles Trip Info. RJ Report' } */
if (inArray(192, page_permission) || user_admin) {
  _nav211 = {
    component: CNavItem,
    name: 'OV. Trip RJ Report',
    to: '/OVTIRJReport',
    datatoggle: 'tooltip',
    title: 'Own Vehicles Trip Info. RJ Report',
  }
} else {
  _nav211 = ''
}

/* Condition For Enable Admin Settings Screen */
if (user_admin) {
  _nav189 = {
    component: CNavItem,
    name: 'Sys. Admin Settings',
    to: '/SystemAdminSettings',
    icon: <CIcon icon={cilSettings} customClassName="nav-icon" />,
    datatoggle: 'tooltip',
    title: 'System Admin Settings',
  }
} else {
  _nav189 = ''
}

/* Condition For Enable Admin Settings Screen */
if (user_admin || all_users) {
  _nav209 = {
    component: CNavItem,
    name: 'Version Info',
    to: '/VersionInfo',
    icon: <CIcon icon={cibCentos} customClassName="nav-icon" />,
    datatoggle: 'tooltip',
    title: 'Version Information',
  }
} else {
  _nav209 = ''
}

/* Condition For Enable Admin Settings Screen */
if (user_admin) {
  _nav212 = {
    component: CNavItem,
    name: 'Driver Invoice Attachment',
    // to: '/DriverInvoiceAttachment',
    to: '/PageNotFoundComponent',
    icon: <CIcon icon={cibCentos} customClassName="nav-icon" />,
    datatoggle: 'tooltip',
    title: 'Driver Invoice Attachment',
  }
} else {
  _nav212 = ''
}

let varar = true
/* Condition For Enable Admin Settings Screen */
if (
  inArray(181, page_permission) ||
  inArray(182, page_permission) ||
  inArray(183, page_permission) ||
  inArray(184, page_permission) ||
  inArray(185, page_permission) ||
  inArray(186, page_permission) ||
  inArray(187, page_permission) ||
  inArray(188, page_permission) ||
  inArray(189, page_permission) ||
  inArray(190, page_permission) || 
  user_admin
) {
  _navBBReportsHead = {
    component: CNavGroup,
    name: 'BB Vehicle Reports',
    datatoggle: 'tooltip',
    title: 'Black Box Vehicle Reports',
    to: '/BlackBoxOverSpeedReportScreen',
    icon: <CIcon icon={cilBank} customClassName="nav-icon" />,
    items: [],
  }
} else {
  _navBBReportsHead = ''
}

/* Black Box Vehicle Over Speed Info Screen */
if (inArray(181, page_permission) || user_admin) {
  _nav191 = {
    component: CNavItem,
    name: 'Over Speed',
    to: '/BlackBoxOverSpeedReportScreen',
    icon: <CIcon icon={cilStar} customClassName="nav-icon" />,
    datatoggle: 'tooltip',
    title: 'Vehicle Over Speed Report',
  }
} else {
  _nav191 = ''
}

/* Black Box Vehicle Harsh Braking Info Screen */
if (inArray(182, page_permission) || user_admin) {
  _nav192 = {
    component: CNavItem,
    name: 'Harsh Braking',
    to: '/BlackBoxHarshBrakingReportScreen',
    icon: <CIcon icon={cilStar} customClassName="nav-icon" />,
    datatoggle: 'tooltip',
    title: 'Vehicle Harsh Braking Report',
  }
} else {
  _nav192 = ''
}

/* Black Box Vehicle Harsh Accelaration Info Screen */
if (inArray(183, page_permission) || user_admin) {
  _nav193 = {
    component: CNavItem,
    name: 'Harsh Accelaration',
    to: '/BlackBoxHarshAccelarationReportScreen',
    icon: <CIcon icon={cilStar} customClassName="nav-icon" />,
    datatoggle: 'tooltip',
    title: 'Vehicle Harsh Accelaration Report',
  }
} else {
  _nav193 = ''
}

/* Black Box Vehicle Rash Turn Info Screen */
if (inArray(184, page_permission) || user_admin) {
  _nav194 = {
    component: CNavItem,
    name: 'Rash Turn',
    to: '/BlackBoxRashTurnReportScreen',
    icon: <CIcon icon={cilStar} customClassName="nav-icon" />,
    datatoggle: 'tooltip',
    title: 'Vehicle Rash Turn Report',
  }
} else {
  _nav194 = ''
}

/* Black Box Vehicle Fuel Filling Info Screen */
if (inArray(185, page_permission) || user_admin) {
  _nav195 = {
    component: CNavItem,
    name: 'Fuel Filling',
    to: '/BlackBoxFuelFillingReportScreen',
    icon: <CIcon icon={cilStar} customClassName="nav-icon" />,
    datatoggle: 'tooltip',
    title: 'Vehicle Fuel Filling Report',
  }
} else {
  _nav195 = ''
}

/* Black Box Vehicle Fuel Theft Info Screen */
if (inArray(186, page_permission) || user_admin) {
  _nav196 = {
    component: CNavItem,
    name: 'Fuel Theft',
    to: '/BlackBoxFuelTheftReportScreen',
    icon: <CIcon icon={cilStar} customClassName="nav-icon" />,
    datatoggle: 'tooltip',
    title: 'Vehicle FuelTheft Report',
  }
} else {
  _nav196 = ''
}

/* Condition For Enable Admin Settings Screen */
if (inArray(176, page_permission) || user_admin) {
  _nav190 = {
    component: CNavItem,
    name: 'NLLD Admin Settings',
    to: '/AdminSettings',
    icon: <CIcon icon={cilSettings} customClassName="nav-icon" />,
    datatoggle: 'tooltip',
    title: 'NLLD Admin Settings',
  }
} else {
  _nav190 = ''
}

/* Condition For Enable Reports { 'Reports Parent' } */

var reports_array_condition = !user_admin ? true : false

if (!user_admin) {
  /* Reports Pages Array */
  var reports_page_array = [3, 5, 7, 9, 13, 15, 17, 19, 21, 25, 27, 31, 33, 35, 37]

  // public $Report_pages = array(
  //     '3' => 'Vehicle Inspection Report',
  //     '5' => 'RMSTO Report',
  //     '7' => 'Vehicle Maintenance Report',
  //     '9' => 'Document Verification Report',
  //     '13' => 'Vendor Creation Report',
  //     '15' => 'Tripsheet Creation Report',
  //     '17' => 'Advance Payment Report',
  //     '19' => 'Shipment Completion Report - NLFD',
  //     '21' => 'Shipment Completion Report - NLCD',
  //     '25' => 'Customer Creation Report',
  //     '27' => 'Return Journey Sales Order Creation Report',
  //     '31' => 'Diesel Intent Creation Report',
  //     '33' => 'Tripsheet Closure Report',
  //     '35' => 'Tripsheet Settlement Report',
  //     '37' => 'FI Entry Report',
  // );

  /* Find unique pages is in between User's Pages and Reports Pages */
  var unique_pages_length = page_permission ? (page_permission.filter((val) => {
    return reports_page_array.indexOf(val) != -1
  })) : 0

  /* Set Reports Arry Condition - False, if not having unique pages */
  if (unique_pages_length == 0) {
    reports_array_condition = false
  }
  console.log(unique_pages_length.length)
}

if (reports_array_condition || user_admin) {
  _navReportsHead = {
    component: CNavGroup,
    name: 'Reports',
    icon: <CIcon icon={cilInfo} customClassName="nav-icon" />,
    items: [],
  }
} else {
  _navReportsHead = ''
}

/* Condition For Enable Master Screen { '38' => 'Master Creation Screen'} */
if (inArray(38, page_permission) || user_admin) {
  _nav38 = {
    component: CNavGroup,
    name: 'Admin Master',
    to: '/Master',
    icon: <CIcon icon={cilBriefcase} customClassName="nav-icon" />,
    items: [
      {
        component: CNavGroup,
        name: 'Main Master',
        to: '/Master',
        icon: <CIcon icon={cilWallet} customClassName="nav-icon" />,
        items: [
          {
            component: CNavItem,
            name: 'Vehicle Master',
            to: '/VehicleMasterTable',
            title: 'Vehicle Master',
          },
          {
            component: CNavItem,
            name: 'Hire Vehicle Info Table',
            to: '/HireVehicleInfoTable',
            title: 'Hire Vehicle Info Table',
          },
          {
            component: CNavItem,
            name: 'Driver Master',
            to: '/DriverMasterTable',
            title: 'Driver Master',
          },
          {
            component: CNavItem,
            name: 'Shed Master',
            to: '/ShedMasterTable',
            title: 'Shed Master',
          },
          {
            component: CNavItem,
            name: 'Freight Master',
            to: '/FreightMasterTable',
            title: 'Freight Master',
          },

          {
            component: CNavItem,
            name: 'Diesel Vendor Master',
            to: '/DieselVendorMasterTable',
            title: 'Diesel Vendor Master',
          },
          {
            component: CNavItem,
            name: 'Material Master',
            to: '/MaterialMasterTable',
            title: 'Material Master',
          },
          {
            component: CNavItem,
            name: 'User Login Master',
            to: '/UserLoginMasterTable',
            title: 'User Login Master',
          },
          {
            component: CNavItem,
            name: 'User Menu Access',
            to: '/UserLoginMenuAccess',
            title: 'User Menu Access',
          },
          {
            component: CNavItem,
            name: 'Definitions Master',
            to: '/DefinitionsTable',
            title: 'Definitions',
          },
          {
            component: CNavItem,
            name: 'Definitions List Master',
            to: '/DefinitionsListTable',
            title: 'Definitions List',
          },
          {
            component: CNavItem,
            name: 'G/L List Master',
            to: '/GLListMasterTable',
            title: 'G/L List Master',
          },
        ],
      },
      {
        component: CNavGroup,
        name: 'Sub Master',
        to: '/Master',
        icon: <CIcon icon={cilNotes} customClassName="nav-icon" />,
        items: [
          {
            component: CNavItem,
            name: 'Division',
            to: '/DivisionTable',
            title: 'Division',
          },
          {
            component: CNavItem,
            name: 'Department',
            to: '/DepartmentTable',
            title: 'Department',
          },
          {
            component: CNavItem,
            name: 'Designation',
            to: '/DesignationTable',
            title: 'Designation',
          },
          {
            component: CNavItem,
            name: 'Vehicle Capacity',
            to: '/VehicleCapacityTable',
            title: 'Vehicle Capacity',
          },
          {
            component: CNavItem,
            name: 'Vehicle Variety',
            to: '/VehicleVarietyTable',
            title: 'Vehicle Variety',
          },
          {
            component: CNavItem,
            name: 'Vehicle Group',
            to: '/VehicleGroupTable',
            title: 'Vehicle Group',
          },
          {
            component: CNavItem,
            name: 'Rejection Reason',
            to: '/RejectReasonTable',
            title: 'Rejection Reason',
          },
          {
            component: CNavItem,
            name: 'Material Description',
            to: '/MaterialDescriptionTable',
            title: 'Material Description',
          },
          {
            component: CNavItem,
            name: 'Unit of Measurement',
            to: '/UOMTable',
            title: 'UOM',
          },
          {
            component: CNavItem,
            name: 'Defect Type',
            to: '/DefectTypeTable',
            title: 'Defect Type',
          },
          {
            component: CNavItem,
            name: 'Previous Load Details',
            to: '/PreviousLoadDetailsTable',
            title: 'Previous Load Details',
          },
          {
            component: CNavItem,
            name: 'Status',
            to: '/StatusTable',
            title: 'Status',
          },
          {
            component: CNavItem,
            name: 'Bank Master',
            to: '/bankmaster',
            title: 'Bank Master',
          },
          {
            component: CNavItem,
            name: 'Location Master',
            to: '/locationmaster',
            title: 'Location Master',
          },

          {
            component: CNavItem,
            name: 'Customer Freight  ',
            to: '/CustomerFreightTable',
            title: 'Customer Freight ',
          },


        ],
      },
      {
        component: CNavGroup,
        name: 'NLFS Master',
        to: '/Master',
        icon: <CIcon icon={cilLocomotive} customClassName="nav-icon" />,
        items: [
          {
            component: CNavItem,
            name: 'Vehicle Master', /* Left Nav Bar Name */
            to: '/NLFSVehicleMasterTable', /* Url Path */
            title: 'NLFS Vehicle Master', /* Top Page Title */
          },
          {
            component: CNavItem,
            name: 'Division Master',
            to: '/NLFSDivisionMasterTable',
            title: 'NLFS Division Master',
          },
          {
            component: CNavItem,
            name: 'Dropdown',
            to: '/NLFSDropdownTable',
            title: 'NLFS Dropdown Master',
          },
          {
            component: CNavItem,
            name: 'Dropdown List',
            to: '/NLFSDropdownListTable',
            title: 'NLFS Dropdown List Master',
          },
        ]
      }
    ],
  }
} else {
  _nav38 = ''
}

/* Condition For Enable FI EC. Screen { '39' => 'Vehicle Status Change Screen' } */
// if (inArray(39, page_permission) || user_admin) {
//   _nav39 = {
//     component: CNavItem,
//     name: 'Change Vehicle',
//     to: '/ChangeVehicleHome',
//     icon: <CIcon icon={cilBackspace} customClassName="nav-icon" />,
//     datatoggle: 'tooltip',
//     title: 'Change Vehicle',
//   }
// } else {
//   _nav39 = ''
// }

 

// console.log(_nav1)

function inArray(needle, haystack) {
  var length = haystack ? haystack.length : 0
  for (var i = 0; i < length; i++) {
    if (haystack[i] == needle) return true
  }
  return false
}

const _nav = []

/*if (_nav39) {
  _nav.unshift(_nav39)
} */

if (_nav212) {
  _nav.unshift(_nav212)
}

if (_nav209) {
  _nav.unshift(_nav209)
}

if (_nav189) {
  _nav.unshift(_nav189)
}

if (_nav190) {
  _nav.unshift(_nav190)
}

if(_navVehicleUtilizationHead) {
  _nav.unshift(_navVehicleUtilizationHead)
}

if (_nav242) {
  _navVehicleUtilizationHead.items.unshift(_nav242)
}

if (_nav241) {
  _navVehicleUtilizationHead.items.unshift(_nav241)
}

if (_nav240) {
  _navVehicleUtilizationHead.items.unshift(_nav240)
}

if (_nav239) {
  _navVehicleUtilizationHead.items.unshift(_nav239)
}

if(_navBBReportsHead) {
  _nav.unshift(_navBBReportsHead)
}

if (_nav196) {
  _navBBReportsHead.items.unshift(_nav196)
}

if (_nav195) {
  _navBBReportsHead.items.unshift(_nav195)
}

if (_nav194) {
  _navBBReportsHead.items.unshift(_nav194)
}

if (_nav193) {
  _navBBReportsHead.items.unshift(_nav193)
}

if (_nav192) {
  _navBBReportsHead.items.unshift(_nav192)
}

if (_nav191) {
  _navBBReportsHead.items.unshift(_nav191)
}

if (_navReportsHead) {
  _nav.unshift(_navReportsHead)
}
if (_nav206) {
  _navReportsHead.items.unshift(_nav206)
}
if (_nav47) {
  _navReportsHead.items.unshift(_nav47)
}
if (_nav46) {
  _navReportsHead.items.unshift(_nav46)
}
if (_nav37) {
  _navReportsHead.items.unshift(_nav37)
}

if (_nav35) {
  _navReportsHead.items.unshift(_nav35)
}

if (_nav33) {
  _navReportsHead.items.unshift(_nav33)
}

if (_nav31) {
  _navReportsHead.items.unshift(_nav31)
}

if (_nav250) {
  _navReportsHead.items.unshift(_nav250)
}

if (_nav27) {
  _navReportsHead.items.unshift(_nav27)
}

if (_nav25) {
  _navReportsHead.items.unshift(_nav25)
}

if (_nav109) {
  _navReportsHead.items.unshift(_nav109)
}

if (_nav21) {
  _navReportsHead.items.unshift(_nav21)
}

if (_nav108) {
  _navReportsHead.items.unshift(_nav108)
}

if (_nav19) {
  _navReportsHead.items.unshift(_nav19)
}

if (_nav210) {
  _navReportsHead.items.unshift(_nav210)
}

if (_nav17) {
  _navReportsHead.items.unshift(_nav17)
}

if (_nav15) {
  _navReportsHead.items.unshift(_nav15)
} 

if (_nav205) {
  _navReportsHead.items.unshift(_nav205)
} 

if (_nav202) {
  _navReportsHead.items.unshift(_nav202)
}

if (_nav13) {
  _navReportsHead.items.unshift(_nav13)
}

if (_nav9) {
  _navReportsHead.items.unshift(_nav9)
}

if (_nav7) {
  _navReportsHead.items.unshift(_nav7)
}

if (_nav5) {
  _navReportsHead.items.unshift(_nav5)
}

if (_nav3) {
  _navReportsHead.items.unshift(_nav3)
}
if (_nav42) {
  _nav.unshift(_nav42)
}
if (_nav38) {
  _nav.unshift(_nav38)
}

if (_navOwnVehicleTripInfoTrackHead) {
  _nav.unshift(_navOwnVehicleTripInfoTrackHead)
}
if (_nav208) {
  _navOwnVehicleTripInfoTrackHead.items.unshift(_nav208)
}
if (_nav211) {
  _navOwnVehicleTripInfoTrackHead.items.unshift(_nav211)
}
if (_nav254) {
  _navOwnVehicleTripInfoTrackHead.items.unshift(_nav254)
}
// if (_nav253) {
//   _navOwnVehicleTripInfoTrackHead.items.unshift(_nav253)
// }
if (_nav207) {
  _navOwnVehicleTripInfoTrackHead.items.unshift(_nav207)
}


if (_navVehicleRequestHead) {
  _nav.unshift(_navVehicleRequestHead)
}
if (_nav105) {
  _navVehicleRequestHead.items.unshift(_nav105)
}
if (_nav104) {
  _navVehicleRequestHead.items.unshift(_nav104)
}

// if (_nav104) {
//   _nav.unshift(_nav104)
// }
if (_navVESTHead) {
  _nav.unshift(_navVESTHead)
}
// if (_nav43) {
//   _navVESTHead.items.unshift(_nav43)
// }
if (_nav433) {
  _navVESTHead.items.unshift(_nav433)
}
if (_nav432) {
  _navVESTHead.items.unshift(_nav432)
}
if (_nav431) {
  _navVESTHead.items.unshift(_nav431)
}
if (_nav434) {
  _navVESTHead.items.unshift(_nav434)
}
// if (_nav43) {
//   _nav.unshift(_nav43)
// }
if (_nav36) {
  _nav.unshift(_nav36)
}

if (_nav34) {
  _nav.unshift(_nav34)
}

if (_navTripPaymentHead) {
  _nav.unshift(_navTripPaymentHead)
}

if (_nav73) {
  _navTripPaymentHead.items.unshift(_nav73)
}

if (_nav72) {
  _navTripPaymentHead.items.unshift(_nav72)
}

if (_nav71) {
  _navTripPaymentHead.items.unshift(_nav71)
}

if (_navTSCHead) {
  _nav.unshift(_navTSCHead)
}

if (_nav321) {
  _navTSCHead.items.unshift(_nav321)
}

if (_nav32) {
  _navTSCHead.items.unshift(_nav32)
}

/* ======================================================= */

if (_navTripPendingBCHead) {
  _nav.unshift(_navTripPendingBCHead)
}

if (_nav233) {
  _navTripPendingBCHead.items.unshift(_nav233)
}

if (_nav232) {
  _navTripPendingBCHead.items.unshift(_nav232)
}

if (_nav231) {
  _navTripPendingBCHead.items.unshift(_nav231)
}

if (_navTsVendorChangeHead) {
  _nav.unshift(_navTsVendorChangeHead)
}

if (_nav237) {
  _navTsVendorChangeHead.items.unshift(_nav237)
}

if (_nav236) {
  _navTsVendorChangeHead.items.unshift(_nav236)
}

if (_nav235) {
  _navTsVendorChangeHead.items.unshift(_nav235)
}

if (_nav234) {
  _navTsVendorChangeHead.items.unshift(_nav234)
}

/* ======================================================= */

if (_navFSHead) {
  _nav.unshift(_navFSHead)
}

if (_nav249) {
  _navFSHead.items.unshift(_nav249)
}
if (_nav245) {
  _navFSHead.items.unshift(_nav245)
}
if (_nav244) {
  _navFSHead.items.unshift(_nav244)
}
if (_nav243) {
  _navFSHead.items.unshift(_nav243)
}
if (_nav30) {
  _navFSHead.items.unshift(_nav30)
}
if (_nav29) {
  _navFSHead.items.unshift(_nav29)
}

/* ======================================================= */

if (_navDIHead) {
  _nav.unshift(_navDIHead)
}
if (_nav41) {
  _navDIHead.items.unshift(_nav41)
}
if (_nav247) {
  _navDIHead.items.unshift(_nav247)
}
if (_nav246) {
  _navDIHead.items.unshift(_nav246)
}
if (_nav281) {
  _navDIHead.items.unshift(_nav281)
}
if (_nav28) {
  _navDIHead.items.unshift(_nav28)
}

/* ======================================================= */

if (_navRJHead) {
  _nav.unshift(_navRJHead)
}

if (_nav261) {
  _navRJHead.items.unshift(_nav261)
}

if (_nav26) {
  _navRJHead.items.unshift(_nav26)
}

if (_navCCHead) {
  _nav.unshift(_navCCHead)
}

if (_nav204) {
  _navCCHead.items.unshift(_nav204)
}

if (_nav24) {
  _navCCHead.items.unshift(_nav24)
}

if (_nav23) {
  _navCCHead.items.unshift(_nav23)
}

if (_nav22) {
  _navCCHead.items.unshift(_nav22)
}

if (_navTripDeliveryTrackHead) {
  _nav.unshift(_navTripDeliveryTrackHead)
}
if (_nav78) {
  _navTripDeliveryTrackHead.items.unshift(_nav78)
}
if (_nav77) {
  _navTripDeliveryTrackHead.items.unshift(_nav77)
}
if (_nav213) {
  _navTripDeliveryTrackHead.items.unshift(_nav213)
}

if (_navVAHead) {
  _nav.unshift(_navVAHead)
}

if (_nav214) {
  _navVAHead.items.unshift(_nav214)
}

if (_nav255) {
  _navVAHead.items.unshift(_nav255)
}

if (_nav110) {
  _navVAHead.items.unshift(_nav110)
}

if (_nav181) {
  _navVAHead.items.unshift(_nav181)
}

if (_nav201) {
  _navVAHead.items.unshift(_nav201)
}

if (_nav20) {
  _navVAHead.items.unshift(_nav20)
}

if (_nav18) {
  _navVAHead.items.unshift(_nav18)
}

if (_navADVHead) {
  _nav.unshift(_navADVHead)
}

if (_nav44) {
  _navADVHead.items.unshift(_nav44)
}
if (_nav16) {
  _navADVHead.items.unshift(_nav16)
}
if (_navTSHead) {
  _nav.unshift(_navTSHead)
}
if (_nav451) {
  _navTSHead.items.unshift(_nav451)
}
if (_nav45) {
  _navTSHead.items.unshift(_nav45)
}
if (_nav49) {
  _navTSHead.items.unshift(_nav49)
}
if (_nav14) {
  _navTSHead.items.unshift(_nav14)
}

if (_navVCHead) {
  _nav.unshift(_navVCHead)
}

if (_nav203) {
  _navVCHead.items.unshift(_nav203)
}

if (_nav12) {
  _navVCHead.items.unshift(_nav12)
}

if (_nav11) {
  _navVCHead.items.unshift(_nav11)
}

if (_nav10) {
  _navVCHead.items.unshift(_nav10)
}

if (_nav8) {
  _nav.unshift(_nav8)
}

if (_nav6) {
  _nav.unshift(_nav6)
}

if (_nav4) {
  _nav.unshift(_nav4)
}

if (_nav2) {
  _nav.unshift(_nav2)
}

if (_nav1) {
  _nav.unshift(_nav1)
}

if (_nav252) {
    _navReportsHead.items.unshift(_nav252)
} 

if (_nav251) {
    _navReportsHead.items.unshift(_nav251)
} 

if (_nav48) {
    _navReportsHead.items.unshift(_nav48)
} 

/*-------------------------------------------------*/

if(_nav238) {
   _nav.unshift(_nav238)
}

if(_nav223) {
   _nav.unshift(_nav223)
}

if (_nav500) {
  _nav.unshift(_nav500)
}
if (_nav222) {
  _nav.unshift(_nav222)
}

if(_nav221) {
   _nav.unshift(_nav221)
}
 
if(_nav220) {
   _nav.unshift(_nav220)
} 

export default _nav

// public $pages_for_permission = array(
//   '1' => 'Parking yard Gate In',
//   '2' => 'Vehicle Inspection List',
//   '3' => 'Vehicle Inspection Report',
//   '4' => 'RMSTO List',
//   '5' => 'RMSTO Report',
//   '6' => 'Vehicle Maintenance List',
//   '7' => 'Vehicle Maintenance Report',
//   '8' => 'Document Verification List',
//   '9' => 'Document Verification Report',
//   '10' => 'Vendor Creation Request',
//   '11' => 'Vendor Creation Approval',
//   '12' => 'Vendor Creation Confirmation',
//   '13' => 'Vendor Creation Report',
//   '14' => 'Tripsheet Creation List ',
//   '15' => 'Tripsheet Creation Report',
//   '16' => 'Advance Payment List ',
//   '17' => 'Advance Payment Report',
//   '18' => 'Vehicle Assignment Creation - NLFD',
//   '19' => 'Shipment Completion Report - NLFD',
//   '20' => 'Vehicle Assignment Creation - NLCD',
//   '21' => 'Shipment Completion Report - NLCD',
//   '181' => 'Shipment Updation',
//   '22' => 'Customer Creation Request',
//   '23' => 'Customer Creation Approval',
//   '24' => 'Customer Creation Confirmation',
//   '25' => 'Customer Creation Report',
//   '26' => 'Return Journey Sales Order Creation',
//   '27' => 'Return Journey Sales Order Creation Report',
//   '32' => 'Tripsheet Closure List',
//   '33' => 'Tripsheet Closure Report',
//   '34' => 'Tripsheet Settlement List',
//   '35' => 'Tripsheet Settlement Report',
//   '36' => 'FI Entry Creation',
//   '37' => 'FI Entry Report',
//   '38' => 'Master Creation Screen',
//   '39' => 'Vehicle Status Change Screen',
//   '40' => 'Dashboard Screen',
//   '50' => 'Depo Gate IN'
//   '51' => 'Depo Vehicle Inspection'
//   '52' => 'Depo Tripsheet Creation'
//   '53' => 'Depo Vehicle Assignment'
//   '54' => 'Depo Expense Closure'
//   '55' => 'Depo Vehicles Report'
//   '56' => 'Depo Final Report'
//   '57' => 'Depo Contractor Master'
//   '58' => 'Depo Vehicle Master'
//   '59' => 'Depo Driver Master'
//   '60' => 'Depo Route Master'
//   '61' => 'Depo Freight Master'
//   '62' => 'Depo Customer Master'
//   '63' => 'Depo Shipment Approval'
//   '64' => 'Depo Expense Approval'
//   '65' => 'Depo Settlement Closure'
//   '66' => 'Depo Settlement Approval'
//   '67' => 'Depo Tripsheet Report'
//   '68' => 'Depo Shipment Report'
//   '69' => 'Depo Settlement Validation'
//   '70' => 'Depo Delivery Report',
//   '71' => 'Tripsheet Hire Deduction',
//   '72' => 'Tripsheet Hire Payment',
//   '73' => 'Tripsheet Payment Report',
//   '74' => 'Rake Movement BDC Upload',
//   '75' => 'Rake Movement Tripsheet Edit',
//   '76' => 'Rake Movement Expenses Submission',
//   '77' => 'Rake Movement Expenses Submission Approval',
//   '78' => 'Rake Movement Income Closure',
//   '79' => 'Rake Movement Expense Closure',
//   '80' => 'Depo Customer Report',
//   '81' => 'Depo Freight Report',
//   '82' => 'Rake Movement Settlement Closure',
//   '83' => 'Rake Movement Deduction',
//   '84' => 'Rake Movement Payment',
//   '85' => 'Rake Movement FI Entry',
//   '86' => 'Rake Movement FI Entry Payment',
//   '87' => 'Rake Tripsheet Report',
//   '88' => 'Rake Migo Report',
//   '89' => 'Rake Income Closure Report',
//   '90' => 'Rake Settlement Closure Report',
//   '91' => 'Rake Deduction & Payment Report',
//   '92' => 'Rake FI Entry Report',
//   '93' => 'Rake Vendor Info Master', 
//   '94' => 'Rake Vendor Payment Report'
//   '95' => 'Rake Plant Master'
//   '96' => 'Vehicle Request Master'
//   '97' => 'Others - Tripsheet Creation'
//   '148' => 'NLFD - Delivery Report'
//   '149' => 'NLCD - Delivery Report'
//   '150' => 'Invoice Attachment'
//   '151' => 'FCI - Plant Master'
//   '152' => 'FCI - BDC Upload'
//   '153' => 'FCI - Tripsheet Edit'
//   '154' => 'FCI - Vendor Creation'
//   '155' => 'FCI - Vendor Approval'
//   '156' => 'FCI - Vendor Confirmation'
//   '157' => 'FCI - Loading Payment Vendor Assignment'
//   '158' => 'FCI - Freight Payment Vendor Assignment'
//   '159' => 'FCI Tripsheet Report',
//   '160' => 'FCI Plant Master Report',
//   '161' => 'FCI Vendor Master Report',
//   '162' => 'FCI Vendor Assignment Report',
//   '163' => 'FCI Freight Migo Report',
//   '164' => 'FCI Loading Migo Report',
//   '165' => 'FCI Income Report',
//   '166' => 'FCI FIEntry Report',
//   '167' => 'FCI Payment Report',
//   '168' => 'FCI - Old Entry Clearance'
//   '169' => 'FCI - Expense Validation'
//   '170' => 'FCI - Expense Approval'
//   '171' => 'FCI - Income Closure'
//   '172' => 'FCI - FI Entry'
//   '173' => 'FCI - Freight Payment Vendor Assignment Approval'
//   '174' => 'FCI - Loading Payment Vendor Assignment Approval'
//   '175' => 'FCI - Payment'
//   '176' => 'Admin Settings'
//   '177' => 'Visited Report Info'
//   '178' => 'Own Vehicles Trip Info. Capture'
//   '179' => 'Own Vehicles Trip Info. Report'
//   '180' => 'Hire Vehicles Freight Info. report'
//   '181' => 'Black Box - Vehicle Over Speed Report'
//   '182' => 'Black Box - Vehicle Harsh Braking Report'
//   '183' => 'Black Box - Vehicle Harsh Acceleration Report'
//   '184' => 'Black Box - Vehicle Rash Turn Report'
//   '185' => 'Black Box - Vehicle Fuel Filling Report'
//   '186' => 'Black Box - Vehicle Fuel Theft Report'
//   '187' => 'Black Box - Vehicle Fuel Mileage Report'
//   '188' => 'Black Box - Vehicle Fuel Disconnection Report'
//   '189' => 'Black Box - Vehicle Geo Fence Violation Report'
//   '190' => 'Black Box - Vehicle Battery Disconnection Report'
//   '191' => 'Tripsheet Accounts Info. Report'
//   '192' => 'Own Vehicles Trip Info. RJ Report'
//   '101' => 'TS VCH Request Screen',
//   '102' => 'TS VCH Accounts Head Approval Screen',
//   '103' => 'TS VCH Operations Head Approval Screen',
//   '104' => 'TS VCH Req. Report',
//   '111' => 'PBCF Own Vehicles Screen',
//   '112' => 'PBCF Hire Vehicles NLFD Screen',
//   '113' => 'PBCF Hire Vehicles NLCD Screen',

    /* Master Access */
  // '201' => 'Vehicle Master - View',
  // '202' => 'Vehicle Master - Edit',
  // '203' => 'Driver Master - View',
  // '204' => 'Driver Master - Edit',
  // '205' => 'Shed Master - View',
  // '206' => 'Shed Master - Edit',
  // '207' => 'Freight Master - View',
  // '208' => 'Freight Master - Edit',
  // '209' => 'Diesel Vendor Master - View',
  // '210' => 'Diesel Vendor Master - Edit',
  // '211' => 'User Login Master - View',
  // '212' => 'User Login Master - Edit',
  // '213' => 'User Menu Access Master - View',
  // '214' => 'User Menu Access Master - Edit',
  // '215' => 'Definitions Master - View',
  // '216' => 'Definitions Master - Edit',
  // '217' => 'Definitions List Master - View', 
  // '218' => 'Definitions List Master - Edit',
  // '219' => 'G/L List Master - View', 
  // '220' => 'G/L List Master - Edit',
  // '221' => 'Customer Master - View',
  // '222' => 'Customer Master - Edit',
  // '223' => 'Bank Master - View',
  // '224' => 'Bank Master - Edit',
  // '225' => 'Vehicle Utilization - Own Vehicles FG-SALES Report'
  // '226' => 'Vehicle Utilization - Hire Vehicles FG-SALES Report'
  // '227' => 'Vehicle Utilization - Own Vehicles Others Report'
  // '228' => 'Vehicle Utilization - Hire Vehicles Others Report'

  // '28' => 'Diesel Intent Creation Request',
  // '29' => 'Diesel Intent Creation Confirmation',
  // '30' => 'Diesel Intent Creation Approval',
  // '31' => 'Diesel Intent Creation Report',
  // '41' => 'Additional Diesel Intent Creation',
  // '229' => 'NLFS Vehicle Master'
  // '230' => 'FS Accounts Approval'
  // '231' => 'FS DIS No Creation - TS'
  // '232' => 'FS DIS No Creation - NTS'
  // '233' => 'DIS Vendor Invoice'
  // '234' => 'DIS Payment'
  // '235' => 'FS DIS Receipt Creation'
  // '236' => 'FS DI Info Report'
  // '237' => 'NLFD Freight Report'
  // '238' => 'NLCD Freight Report'
  // '249' => 'NLMT Tripsheet Updation permission'
  // '248' => 'NLMT Freight Request Creation'
  // '247' => 'NLMT Freight Request Approval'
// );
