import {
    CForm,
    CButton,
    CCard,
    CContainer,
    CCol,
    CRow,
    CModal,
    CFormInput,
    CFormLabel,
    CModalHeader,
    CFormSelect,
    CInputGroupText,
    CInputGroup,
    CModalTitle,
    CModalBody,
    CModalFooter,
    CAlert,
    CFormCheck,
    CListGroup,
    CListGroupItem,
    CTabPane,
    CAccordion,
    CAccordionItem,
    CAccordionBody,
    CAccordionHeader,
    CTabContent,
    CNavItem,
    CNav,
    CNavLink,
    CButtonGroup,
    CFormTextarea,
    CWidgetStatsC,
    CWidgetStatsF,
  } from '@coreui/react'
  import React, { useState, useEffect } from 'react'
  import { Link, useNavigate } from 'react-router-dom'
  import { toast } from 'react-toastify'
  import 'react-toastify/dist/ReactToastify.css'
  
  import Loader from 'src/components/Loader'
  import SmallLoader from 'src/components/SmallLoader'
  import TripSheetClosureService from 'src/Service/TripSheetClosure/TripSheetClosureService'
  import VendorOutstanding from 'src/Service/SAP/VendorOutstanding'
  // import ExpenseIncomePostingDate from '../TripsheetClosure/Calculations/ExpenseIncomePostingDate'
  import DefinitionsListApi from 'src/Service/Definitions/DefinitionsListApi'
  import TripSheetClosureSapService from 'src/Service/SAP/TripSheetClosureSapService'
  import Swal from 'sweetalert2'
  import * as NlmtScreenAccessCodes from 'src/components/constants/NlmtScreenAccessCodes'
  import AccessDeniedComponent from 'src/components/commoncomponent/AccessDeniedComponent'
  import JavascriptInArrayComponent from 'src/components/commoncomponent/JavascriptInArrayComponent'
  import JavascriptDateCheckComponent from 'src/components/commoncomponent/JavascriptDateCheckComponent'
import TripSheetCreationService from 'src/Service/TripSheetCreation/TripSheetCreationService'
import CIcon from '@coreui/icons-react'
import { cilChartPie } from '@coreui/icons'
import TripSheetInfoService from 'src/Service/PurchasePro/TripSheetInfoService'
import ExpenseIncomePostingDate from 'src/Pages/TripsheetClosure/Calculations/ExpenseIncomePostingDate'
import NlmtTSCreationService from 'src/Service/Nlmt/TSCreation/NlmtTSCreationService'
  
  const NlmtVehicleTripSearch = () => {
    const REQ = () => <span className="text-danger"> * </span>
  
    /*================== User Id & Location Fetch ======================*/
    const user_info_json = localStorage.getItem('user_info')
    const user_info = JSON.parse(user_info_json)
    const user_locations = []
    const navigation = useNavigate()
    const is_admin = (user_info.user_id == 1 && user_info.is_admin == 1) || (user_info.user_id == 26)
  
    if(is_admin){
      console.log(user_info)
    }
  
    /* Get User Locations From Local Storage */
    user_info.location_info.map((data, index) => {
      user_locations.push(data.id)
    })
  
    const Expense_Income_Posting_Date = ExpenseIncomePostingDate();
    console.log(Expense_Income_Posting_Date,'ExpenseIncomePostingDate')
  
    /* Get User Id From Local Storage */
    const user_id = user_info.user_id    
    const user_emp_id = user_info.empid
  
    // console.log(user_locations)
    /*================== User Location Fetch ======================*/
  
    /* ==================== Access Part Start ========================*/
    const [screenAccess, setScreenAccess] = useState(true)
    let page_no = NlmtScreenAccessCodes.NlmtTSStatusScreens.Nlmt_Vehicle_Tripsheet_Status
  
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
  
    const [fetch, setFetch] = useState(false)
    const [smallfetch, setSmallFetch] = useState(false)
    const [pageList, setPageList] = useState([])
  
    const [tripHirePaymentData, setTripHirePaymentData] = useState({}) 
    const [hireVendorData, setHireVendorData] = useState({})
    const [gstTaxTermsData, setGstTaxTermsData] = useState([])
    const [tripSheetHaving, setTripsheetHaving] = useState(false)
    const [paymentSubmit, setPaymentSubmit] = useState(false) 
    const [activeKey, setActiveKey] = useState(4)
    const [hireVendorCode, setHireVendorCode] = useState(0)
  
    const [errorModal, setErrorModal] = useState(false)
    const [error, setError] = useState({})

    const trip_remarks_edit_user_list_array = [4,9,14,18,23,37,48,93] 
    /* 4 - Sabari Shankar, 18 - Karthikeyan, 23 - Sarath Kumar, 14 - Sivaraman, 93 - Velu Samy, 37 - Saravanan, 9 - Sasi, 48 - Boobalan*/
  
    const [tripsheetNumberNew, setTripsheetNumberNew] = useState('');
    const handleChangenewtrip = event => {
      let tripResult = event.target.value.toUpperCase();
      setTripsheetNumberNew(tripResult.trim());
  
    };

    const [is_tr_admin, set_is_tr_admin] = useState(false)
    const [remarksAdminUsersData, setRemarksAdminUsersData] = useState([])
  
    // GET PAN DETAILS FROM SAP
    const gettripHirePaymentData = (e) => {
      e.preventDefault()
      console.log(tripsheetNumberNew,'tripsheetNumberNew')
      if(/^[a-zA-Z0-9]+$/i.test(tripsheetNumberNew) && /[a-zA-Z]/.test(tripsheetNumberNew) && /[0-9]/.test(tripsheetNumberNew)){
          NlmtTSCreationService.getAllTripsheetInfoByTripsheetNo(tripsheetNumberNew).then((res) => {
          setTripsheetHaving(true)
          console.log(res,'getTripSettlementInfoByTripsheetNo')
          if (res.status == 200 && res.data != '') {
  
            let needed_data = res.data.data
            setSmallFetch(true)
            setTripRemarksFilled(needed_data.trip_remarks)
            setPygRemarksFilled(needed_data.remarks)
            setTripHirePaymentData(needed_data)
            if(needed_data.Parking_Vendor_Info){
              setHireVendorData(needed_data.Parking_Vendor_Info)
              setHireVendorCode(needed_data.Parking_Vendor_Info.vendor_code)
            } else if(needed_data.vendor_info){
              setHireVendorData(needed_data.vendor_info)
              setHireVendorCode(needed_data.vendor_info.vendor_code)
            } else {
                setHireVendorCode(0)
                setHireVendorData({})
            }
            // setHireVendorCode(needed_data.vendor_info.vendor_code)
            toast.success('Tripsheet Details Detected!')
  
          } else {
  
            setTripHirePaymentData([])
            setHireVendorCode(0)
            setHireVendorData({})
            setTripsheetHaving(false)
            setTripRemarksFilled('')
            setPygRemarksFilled('')
            setSmallFetch(true)
            if (res.status == 201 && (res.data.status == '1' ||res.data.status == '2')) {
              toast.warning(res.data.message)
            } else {
              setSmallFetch(true)
              toast.warning('Tripsheet Details cannot be detected from LP!')
            }
          }
        })
      } else {
  
        setTripHirePaymentData([])
        setHireVendorCode(0)
        setTripsheetHaving(false)
        setSmallFetch(true)
        setTripRemarksFilled('')
        setPygRemarksFilled('')
        toast.warning('Tripsheet Number Must Like "AB123456789"')
        return false
      }
  
    }
  
    useEffect(() => {
      /* section for getting Pages List from database For Setting Permission */
      DefinitionsListApi.visibleDefinitionsListByDefinition(8).then((response) => {
        console.log(response.data.data)
        setPageList(response.data.data)
        setFetch(true)
        setSmallFetch(true)
      })
  
       /* section for getting GST Tax Terms Master List For GST Tax Code Display from database */
       DefinitionsListApi.visibleDefinitionsListByDefinition(3).then((response) => {
        console.log(response.data.data,'setGstTaxTermsData')
        setGstTaxTermsData(response.data.data)
      })

      /* section for getting Remarks Admin User Lists from database */
      DefinitionsListApi.visibleDefinitionsListByDefinition(33).then((response) => {

        let viewData = response.data.data
        console.log(viewData,'Remarks Admin User Lists')
        setRemarksAdminUsersData(viewData)
      })
    }, [])

    useEffect(() => {
      if(remarksAdminUsersData.length > 0){
        let user_array = []
        let tr_admin = 0
        remarksAdminUsersData.map((vv,kk)=>{
          if(vv.definition_list_status == '1'){
            user_array.push(vv.definition_list_code)
          }
        })
  
        if(user_info.is_admin == 1 || JavascriptInArrayComponent(user_emp_id, user_array)){
          tr_admin = 1
        } else {
          tr_admin = 0 
        }
  
        console.log(user_array,'user_array')
        console.log(tr_admin,'tr_admin')
  
        tr_admin == 1 ? set_is_tr_admin(true) : set_is_tr_admin(false) 
      }
  
    }, [remarksAdminUsersData])
  
    const getInt = (val) => {
      return Number(parseFloat(val).toFixed(2))
    }
  
    const getLowerValue = (a,b) => {
      let lower = 0
      console.log(a,'a')
      console.log(b,'b')
      if(-a >= b){
        lower = b
      } else {
        lower = -a
      }
      console.log(lower,'lower-Amount')
      return lower
    }

   const veh_cur_pos = [ 
        { desc:'Parking Yard Gate In - Gate In - Completed',code:1},
        { desc:'Vehicle Inspection - Inspection - Completed',code:2},
        { desc:'Vehicle Inspection - Inspection	- Rejected',code:	3},
        { desc:'Vehicle Maintenance	- Process - Started',code:4},
        { desc:'Vehicle Maintenance	- Process - Completed',code:5},
        { desc:'RMSTO Vehicle Taken - Completed',code:6},
        { desc:'OTHERS Vehicle Taken - Completed',code:7},
        { desc:'Document Verification - Process	- Completed',code:8},
        { desc:'Document Verification - Process	- Rejected',code:9},
        { desc:'Tripsheet Creation - Process Completed',code:16},
        { desc:'Tripsheet Creation - Process Cancelled',code:17},
        { desc:'Advance Payment	- Process - Completed',code:18},
        { desc:'Vehicle Assignment Foods - Shipment Creation - Completed',code:20},
        { desc:'Vehicle Assignment Foods - Shipment - Deleted',code:21},
        { desc:'Vehicle Assignment Foods - Shipment Invoice Creation - Completed',code:22},
        { desc:'Vehicle Assignment Consumer - Shipment Creation	- Completed',code:23},
        { desc:'Vehicle Assignment Consumer	- Shipment - Deleted',code:24},
        { desc:'Vehicle Assignment Consumer	- Shipment Invoice Creation	- Completed',code:25},
        { desc:'Tripsheet Closure - Expense Capture	- Completed',code:26},
        { desc:'Tripsheet Closure - Income Capture - Completed',code:27},
        { desc:'Tripsheet Settlement - Process - Completed',code:28},
        { desc:'RJ Sale Order - Process - Created',code:35},
        { desc:'Diesel Indent - Request Creation - Completed',code:37},
        { desc:'Diesel Indent - Confirmation - Completed',code:39},
        { desc:'Diesel Indent - Approval - Completed',code:41},
        { desc:'Tripsheet Creation - Process - Completed',code:50}
   ]

   const vehTypefinder = (id) => {
    let vehType = '-'

    if(id == 21){
      vehType = 'Own'
    } else if(id == 22){
      vehType = 'Hire'
    } else if(id == 23){
      vehType = 'Party'
    } 

    return vehType

   }

    const veh_cur_pos_finder = (val) => {
        let veh_cur_pos_val = '-'
        veh_cur_pos.map((v1,k1)=>{
            if(v1.code == val){
                veh_cur_pos_val = v1.desc
            }
        })
        return veh_cur_pos_val
    }

   const parking_status = [ 
        { desc:'Vehicle Waiting Out Side - Completed',code:0},
        { desc:'Vehicle Gate In - Completed',code:1},
        { desc:'Hire Vehicle Gate In - Completed',code:	2},
        { desc:'Party Vehicle Gate In - Completed',code:3},
        { desc:'Hire Vehicle Inspection Failure Gate Out - Completed',code:4},
        { desc:'Own Vehicle - Vehicle Maintenance Gate Out - Completed',code:5},
        { desc:'Own Vehicle - After Maintenance Gate In - Completed',code:6},
        { desc:'Hire Vehicle Document Verification Failure Gate Out - Completed',code:7},
        { desc:'Own/Contract Vehicle Gate Out for RMSTO - Completed',code:8},
        { desc:'Hire Vehicle Gate Out for RMSTO - Completed',code:9},
        { desc:'Hire Vehicle Gate Out for FG-STO Foods Division - Completed',code:10},
        { desc:'Own/Contract Vehicle Gate Out for FG-Sales Consumer Division - Completed',code:11},
        { desc:'Own/Contract Vehicle Gate Out for FG-STO Consumer Division - Completed',code:12},
        { desc:'Hire Vehicle Gate Out for FG-Sales Consumer Division - Completed',code:13},
        { desc:'Hire Vehicle Gate Out for FG-STO Consumer Division - Completed',code:14},
        { desc:'Own/Contract Vehicle Gate Out for FG-Sales Foods Division - Completed',code:15},
        { desc:'Own/Contract Vehicle Gate Out for FG-STO Foods Division - Completed',code:16},
        { desc:'Hire Vehicle Gate Out for FG-Sales Foods Division - Completed',code:17},
        { desc:'Party Vehicle Gate Out - Completed',code:18},
        { desc:'Own/Contract - After Delivery Gate In - Completed',code:19},
        { desc:'Own/Contract Vehicle Gate Out For Others Process - Completed',code:20},
        { desc:'Hire Vehicle Gate Out For Others Process - Completed',code:21}
    ]

    const waiting_at_array = [
        
        {vcp:1,ps:1,val:'Vehicle Inspection, RM/Others Movement, Vehicle Maintenance',type:1},/* Own Vehicle GateIn Success */
        {vcp:1,ps:2,val:'Vehicle Inspection, RM Movement',type:1},/* Hire Vehicle GateIn Success */
        {vcp:1,ps:3,val:'Vehicle Inspection',type:1},/* Party Vehicle GateIn Success */
        {vcp:2,ps:2,val:'Document Verification',type:1},/* Hire Vehicle Inspection Success */

        /* Tripsheet Creation */
        {vcp:6,ps:2,val:'Tripsheet Creation',type:1},/* Hire RMSTO Taken */
        {vcp:2,ps:1,val:'Tripsheet Creation',type:1},/* Own Vehicle Inspection Success */
        {vcp:2,ps:6,val:'Tripsheet Creation',type:1},/* Own Vehicle Inspection Success */
        {vcp:6,ps:1,val:'Tripsheet Creation',type:1},/* Own RMSTO Taken */
        {vcp:6,ps:6,val:'Tripsheet Creation',type:1},/* Own RMSTO Taken */
        {vcp:7,ps:1,val:'Tripsheet Creation',type:1},/* Own Others Taken */
        {vcp:7,ps:6,val:'Tripsheet Creation',type:1},/* Own Others Taken */
        {vcp:8,ps:2,val:'Tripsheet Creation',type:1},/* Hire Document Verification Success */
        
        /* Gate-In */
        {vcp:4,ps:5,val:'Gate-In',type:1},/* Vehicle Maintenance */
        {vcp:17,ps:11,val:'Gate-In',type:1},/*Own Foods FGSTO*/
        {vcp:17,ps:12,val:'Gate-In',type:1},/*Own Consumer FGSALES*/
        {vcp:17,ps:16,val:'Gate-In',type:1},/*Own Consumer FGSTO*/
        {vcp:17,ps:8,val:'Gate-In',type:1},/*Own RMSTO*/
        {vcp:17,ps:20,val:'Gate-In',type:1},/*Own Others*/
        
        {vcp:16,ps:13,val:'Consumer Vehicle Assignment',type:1},/* Hire - After, Consumer FGSALES Gatout*/
        
        {vcp:20,ps:1,val:'Gate-Out, Shipment-Second Weight Completion',type:1},/*Own - After, Shipment Creation*/
        {vcp:20,ps:2,val:'Gate-Out, Shipment-Second Weight Completion',type:1},/*Hire - After, Shipment Creation*/
        {vcp:20,ps:6,val:'Gate-Out, Shipment-Second Weight Completion',type:1},/*Own - After, Shipment Creation*/

        /* Shipment-Second Weight Completion */
        {vcp:20,ps:8,val:'Shipment-Second Weight Completion',type:1},/*Own RMSTO - After, Shipment Creation NLFD*/
        {vcp:20,ps:11,val:'Shipment-Second Weight Completion',type:1},/*Own NLCD FGSALES - After, Shipment Creation NLFD*/
        {vcp:20,ps:12,val:'Shipment-Second Weight Completion',type:1},/*Own NLCD FGSTO - After, Shipment Creation NLFD*/
        {vcp:20,ps:15,val:'Shipment-Second Weight Completion',type:1},/*Own NLFD FGSALES - After, Shipment Creation NLFD*/
        {vcp:20,ps:16,val:'Shipment-Second Weight Completion',type:1},/*Own NLFD FGSTO - After, Shipment Creation NLFD*/
        {vcp:20,ps:17,val:'Shipment-Second Weight Completion',type:1},/*Hire NLFD FGSALES - After, Shipment Creation NLCD*/
        {vcp:20,ps:18,val:'Shipment-Second Weight Completion',type:1},/*PARTY FGSALES - After, Shipment Creation NLFD*/
        {vcp:23,ps:8,val:'Shipment-Second Weight Completion',type:1},/*Own RMSTO - After, Shipment Creation NLCD*/
        {vcp:23,ps:11,val:'Shipment-Second Weight Completion',type:1},/*Own NLCD FGSALES - After, Shipment Creation NLCD*/
        {vcp:23,ps:12,val:'Shipment-Second Weight Completion',type:1},/*Own NLCD FGSTO - After, Shipment Creation NLCD*/
        {vcp:23,ps:13,val:'Shipment-Second Weight Completion',type:1},/*Hire NLCD FGSALES - After, Shipment Creation NLFD*/
        {vcp:23,ps:15,val:'Shipment-Second Weight Completion',type:1},/*Own NLFD FGSALES - After, Shipment Creation NLCD*/
        {vcp:23,ps:16,val:'Shipment-Second Weight Completion',type:1},/*Own NLFD FGSTO - After, Shipment Creation NLCD*/

        /* Diesel INdent Creation */
        {vcp:18,ps:16,val:'Diesel Indent Creation',type:1},/*Own NLFD FGSTO - After, Advance Completion*/
        
        /* Add-On OWn/Contract Vehicles Trip */
        {vcp:22,ps:8,val:'Foods Vehicle Assignment, Consumer Vehicle Assignment, RJSO Creation, Diesel Indent Creation',type:1},/*Own RMSTO - After, Shipment Creation NLFD*/
        {vcp:22,ps:11,val:'Foods Vehicle Assignment, Consumer Vehicle Assignment, RJSO Creation, Diesel Indent Creation',type:1},/*Own NLCD FGSALES - After, Shipment Creation NLFD*/
        {vcp:22,ps:12,val:'Foods Vehicle Assignment, Consumer Vehicle Assignment, RJSO Creation, Diesel Indent Creation',type:1},/*Own NLCD FGSTO - After, Shipment Creation NLFD*/
        {vcp:22,ps:15,val:'Foods Vehicle Assignment, Consumer Vehicle Assignment, RJSO Creation, Diesel Indent Creation',type:1},/*Own NLFD FGSALES - After, Shipment Creation NLFD*/
        {vcp:22,ps:16,val:'Foods Vehicle Assignment, Consumer Vehicle Assignment, RJSO Creation, Diesel Indent Creation',type:1},/*Own NLFD FGSTO - After, Shipment Creation NLFD*/
        {vcp:25,ps:8,val:'Foods Vehicle Assignment, Consumer Vehicle Assignment, RJSO Creation, Diesel Indent Creation',type:1},/*Own RMSTO - After, Shipment Creation NLCD*/
        {vcp:25,ps:11,val:'Foods Vehicle Assignment, Consumer Vehicle Assignment, RJSO Creation, Diesel Indent Creation',type:1},/*Own NLCD FGSALES - After, Shipment Creation NLCD*/
        {vcp:25,ps:12,val:'Foods Vehicle Assignment, Consumer Vehicle Assignment, RJSO Creation, Diesel Indent Creation',type:1},/*Own NLCD FGSTO - After, Shipment Creation NLCD*/
        {vcp:25,ps:15,val:'Foods Vehicle Assignment, Consumer Vehicle Assignment, RJSO Creation, Diesel Indent Creation',type:1},/*Own NLFD FGSALES - After, Shipment Creation NLCD*/
        {vcp:25,ps:16,val:'Foods Vehicle Assignment, Consumer Vehicle Assignment, RJSO Creation, Diesel Indent Creation',type:1},/*Own NLFD FGSTO - After, Shipment Creation NLCD*/
        {vcp:16,ps:20,val:'Foods Vehicle Assignment, Consumer Vehicle Assignment, RJSO Creation, Diesel Indent Creation',type:1},/*Own Others Tripsheet Creation Success*/
        {vcp:16,ps:22,val:'Foods Vehicle Assignment, Consumer Vehicle Assignment, RJSO Creation, Diesel Indent Creation',type:1},/*Own FCI Tripsheet Creation Success*/
        {vcp:16,ps:8,val:'Foods Vehicle Assignment, Consumer Vehicle Assignment, RJSO Creation, Diesel Indent Creation',type:1},/*Own RMSTO Tripsheet Creation Success*/
        {vcp:16,ps:12,val:'Foods Vehicle Assignment, Consumer Vehicle Assignment, RJSO Creation, Diesel Indent Creation',type:1},/*Own Consumer FGSTO Tripsheet Creation Success*/
        {vcp:16,ps:16,val:'Foods Vehicle Assignment, Consumer Vehicle Assignment, RJSO Creation, Diesel Indent Creation',type:1},/*Own Foods FGSTO Tripsheet Creation Success*/       

        /* Tripsheet Cancelled */
        {vcp:17,ps:10,val:'Tripsheet Cancelled',type:1},/*Hire Foods FGSTO*/
        {vcp:17,ps:13,val:'Tripsheet Cancelled',type:1},/*Hire Consumer FGSALES*/
        {vcp:17,ps:14,val:'Tripsheet Cancelled',type:1},/*Hire Consumer FGSTO*/
        {vcp:17,ps:2,val:'Tripsheet Cancelled',type:1},/*Hire GateIn*/
        {vcp:17,ps:9,val:'Tripsheet Cancelled',type:1},/*Hire RMSTO*/
        {vcp:17,ps:21,val:'Tripsheet Cancelled',type:1},/*Hire Others*/
        {vcp:9,ps:7,val:'Trip Cancelled',type:1},/* Hire Document Verification Failure */
        {vcp:3,ps:4,val:'Trip Cancelled',type:1},/* Hire Vehicle Inspection Failure */
        
        {vcp:4,ps:6,val:'Vehicle Maintenance',type:1},/* Vehicle Maintenance */
        {vcp:50,ps:18,val:'Party-Shipment-Creation',type:1},/* Party Vehicle GateOut Success */
        {vcp:22,ps:18,val:'Tripsheet Closed',type:1},/* Party vehicle Shipment Completion */

        /* Gate-Out */
        {vcp:4,ps:1,val:'Gate-Out',type:1},/* Vehicle Maintenance */
        {vcp:9,ps:2,val:'Gate-Out',type:1},/* Hire Document Verification Failure */
        {vcp:3,ps:2,val:'Gate-Out',type:1},/* Hire Vehicle Inspection Failure */
        {vcp:20,ps:2,val:'Gate-Out',type:1},/* Hire Vehicle NLFD FGSALES Shipment Creation */
        {vcp:18,ps:1,val:'Gate-Out',type:1},/* After Advance Creation */
        
        /* Closure Process */
        {vcp:16,ps:9,val:'Expense Closure',type:1},/*Hire - After, RMSTO Gatout*/
        {vcp:16,ps:21,val:'Expense Closure',type:1},/*Hire - After, OTHERS Gatout*/
        {vcp:26,ps:19,val:'Income Closure',type:1},/* Own Income Closure */
        {vcp:26,ps:19,val:'Income Closure, Diesel Indent Confirmation',type:2},/* Own Income Closure */
        {vcp:26,ps:19,val:'Income Closure, Diesel Indent Approval',type:3},/* Own Income Closure */
        {vcp:27,ps:19,val:'Settlement Closure',type:1}, /* Own Settlement Closure */
        {vcp:27,ps:19,val:'Settlement Closure, Diesel Indent Confirmation',type:2},/* Own Settlement Closure */
        {vcp:27,ps:19,val:'Settlement Closure, Diesel Indent Approval',type:3},/* Own Settlement Closure */
    ]

    const parking_status_finder = (val) => {
        let parking_status_val = '-'
        parking_status.map((v2,k2)=>{
            if(v2.code == val){
                parking_status_val = v2.desc
            }
        })
        return parking_status_val
    }
    
    const waiting_at_finder = (a1,b1) => {
      let waiting_at_val = '-'
      if(tripHirePaymentData.parking_status == 1 && tripHirePaymentData.vehicle_current_position == 16){
        if(tripHirePaymentData.tripsheet_info.purpose == 2){ /* FG-STO */
            waiting_at_val = 'Gate-Out, Advance Payment'
        } else if(tripHirePaymentData.tripsheet_info.purpose == 1){ /* FG-SALES */
            if(tripHirePaymentData.tripsheet_info.to_divison == 2){
                waiting_at_val = 'Gate-Out, Advance Payment'
            } else {
                waiting_at_val = 'Foods Vehicle Assignment, Advance Payment'
            }
        } else { /* RMSTO & Others & FCI */
            waiting_at_val = 'Gate-Out'
        }
      } else if(tripHirePaymentData.parking_status == 2 && tripHirePaymentData.vehicle_current_position == 16){
        if(tripHirePaymentData.tripsheet_info.purpose == 2){ /* FG-STO */
            waiting_at_val = 'Gate-Out'
        } else if(tripHirePaymentData.tripsheet_info.purpose == 1){ /* FG-SALES */
            if(tripHirePaymentData.tripsheet_info.to_divison == 2){
                waiting_at_val = 'Gate-Out'
            } else {
                waiting_at_val = 'Foods Vehicle Assignment'
            }
        } else { /* RMSTO */
            waiting_at_val = 'Gate-Out'
        }
      } else if(JavascriptInArrayComponent(tripHirePaymentData.parking_status,[10,13,14,17]) && JavascriptInArrayComponent(tripHirePaymentData.vehicle_current_position,[16,18,22,25,26,27,37,39,41])){
        if(JavascriptInArrayComponent(tripHirePaymentData.vehicle_current_position,[16,22,25])){
            if(!(tripHirePaymentData.tripsheet_info.advance_payment_diesel == null || tripHirePaymentData.tripsheet_info.advance_payment_diesel == 0 || tripHirePaymentData.tripsheet_info.advance_payment_diesel == '')){
                waiting_at_val = 'Diesel Indent Creation'
            } else {
                if(tripHirePaymentData.tripsheet_info.advance_amount == 0){
                    waiting_at_val = 'Advance Payment, Expense Closure'
                } else {
                    waiting_at_val = 'Advance Payment'
                }
            }
        } else if(tripHirePaymentData.vehicle_current_position == 18){
            if(tripHirePaymentData.diesel_intent_info && tripHirePaymentData.diesel_intent_info.diesel_status == 1){
                waiting_at_val = 'Diesel Indent Confirmation'
            } else if(tripHirePaymentData.diesel_intent_info && tripHirePaymentData.diesel_intent_info.diesel_status == 2){
                waiting_at_val = 'Diesel Indent Approval'
            } else {
                waiting_at_val = 'Expense Closure'
            }
        } else if(tripHirePaymentData.vehicle_current_position == 37){
            if(tripHirePaymentData.advance_payment_info == null){
                waiting_at_val = 'Advance Payment, Diesel Indent Confirmation'
            } else {
                waiting_at_val = 'Diesel Indent Confirmation'
            }
        } else if(tripHirePaymentData.vehicle_current_position == 39){
            if(tripHirePaymentData.advance_payment_info == null){
                waiting_at_val = 'Advance Payment, Diesel Indent Approval'
            } else {
                waiting_at_val = 'Diesel Indent Approval'
            }
        } else if(tripHirePaymentData.vehicle_current_position == 41){
            if(tripHirePaymentData.tripsheet_info.advance_amount > 0 && tripHirePaymentData.advance_payment_info == null){
                waiting_at_val = 'Advance Payment'
            } else if(tripHirePaymentData.tripsheet_info.advance_amount == 0 && tripHirePaymentData.advance_payment_info == null){
                waiting_at_val = 'Advance Payment, Expense Closure'
            } else {
                waiting_at_val = 'Expense Closure'
            }
        } else if(tripHirePaymentData.vehicle_current_position == 26){
          waiting_at_val = 'Income Closure'
        } else if(tripHirePaymentData.vehicle_current_position == 27){
          waiting_at_val = 'Settlement Closure'
        }
      } else if(JavascriptInArrayComponent(tripHirePaymentData.parking_status,[8,11,15,12,16,20]) && tripHirePaymentData.vehicle_current_position == 37){
        waiting_at_val = 'Diesel Indent Confirmation, After Delivery Gate-In'
      } else if(JavascriptInArrayComponent(tripHirePaymentData.parking_status,[8,11,15,12,16,20]) && tripHirePaymentData.vehicle_current_position == 39){
        waiting_at_val = 'Diesel Indent Approval, After Delivery Gate-In'
      } else if(JavascriptInArrayComponent(tripHirePaymentData.parking_status,[8,11,15,12,16,20]) && tripHirePaymentData.vehicle_current_position == 41){
        waiting_at_val = 'After Delivery Gate-In'
      } else if(!(JavascriptInArrayComponent(tripHirePaymentData.vehicle_current_position,[17,26,27,28])) && tripHirePaymentData.parking_status == 19){
        if(tripHirePaymentData.vehicle_current_position == 37){
          if(tripHirePaymentData.trip_settlement_info && tripHirePaymentData.trip_settlement_info.tripsheet_is_settled == 1){
            waiting_at_val = 'Diesel Indent Confirmation, Income Closure'
          } else if(tripHirePaymentData.trip_settlement_info && tripHirePaymentData.trip_settlement_info.tripsheet_is_settled == 3){
            waiting_at_val = 'Diesel Indent Confirmation, Settlement Closure'
          } else {
            waiting_at_val = 'Diesel Indent Confirmation, Expense Closure'
          }
        } else if(tripHirePaymentData.vehicle_current_position == 39){
          if(tripHirePaymentData.trip_settlement_info && tripHirePaymentData.trip_settlement_info.tripsheet_is_settled == 1){
            waiting_at_val = 'Diesel Indent Approval, Income Closure'
          } else if(tripHirePaymentData.trip_settlement_info && tripHirePaymentData.trip_settlement_info.tripsheet_is_settled == 3){
            waiting_at_val = 'Diesel Indent Approval, Settlement Closure'
          } else {
            waiting_at_val = 'Diesel Indent Approval, Expense Closure'
          }
        } else if(tripHirePaymentData.vehicle_current_position == 41){
          if(tripHirePaymentData.trip_settlement_info && tripHirePaymentData.trip_settlement_info.tripsheet_is_settled == 1){
            waiting_at_val = 'Income Closure'
          } else if(tripHirePaymentData.trip_settlement_info && tripHirePaymentData.trip_settlement_info.tripsheet_is_settled == 3){
            waiting_at_val = 'Settlement Closure'
          } else {
            waiting_at_val = 'Expense Closure'
          }
        }
      } else {
        waiting_at_array.map((v3,k3)=>{
          if(v3.vcp == a1 && v3.ps == b1){
            waiting_at_val = v3.val
          }
        })
      }
      console.log(waiting_at_val,'waiting_at_val')
      if(waiting_at_val == '-'){
          if(tripHirePaymentData.tripsheet_open_status == 2 && tripHirePaymentData.parking_status == 19 && tripHirePaymentData.vehicle_current_position == 17){
              waiting_at_val = 'Tripsheet Cancelled'
          } else if(tripHirePaymentData.tripsheet_open_status == 2 && tripHirePaymentData.vehicle_current_position == 28){
              waiting_at_val = 'Tripsheet Closed'
          } 
      }
      return waiting_at_val
    }

    const sapStatusChange = () => {
      console.log(tripHirePaymentData,'tripHirePaymentData')
      let sap_status = 0
      let lp_status = ''
      if(tripHirePaymentData.tripsheet_info.sap_flag == 1 || tripHirePaymentData.tripsheet_info.sap_flag == 2){
        sap_status = 2
        lp_status = 0
      } else {
        sap_status = 1
        lp_status = 1
      } 

      let SAPData = new FormData()
      SAPData.append('TRIP_SHEET', tripHirePaymentData.tripsheet_info.nlmt_tripsheet_no)
      SAPData.append('VEHICLE_NO', tripHirePaymentData.vehicle_number)
      SAPData.append('Flag', sap_status)

      let LPData = new FormData()
      LPData.append('tripsheet_no', tripHirePaymentData.tripsheet_info.nlmt_tripsheet_no)
      LPData.append('update_by', user_id)
      LPData.append('pyg_id', tripHirePaymentData.parking_yard_gate_id)
      LPData.append('status', lp_status)

      setFetch(false)
      TripSheetInfoService.UpdateTSInfoToSAP(SAPData).then((response) => {
        console.log(response, 'StopTSInfoToSAP') 
        if (response.data && (response.data[0].STATUS == 1 || response.data[0].STATUS == 2)) {
          // setFetch(true)
          toast.success(`${response.data[0].MESSAGE} for the Tripsheet : ${tripHirePaymentData.tripsheet_info.nlmt_tripsheet_no}`)
          TripSheetCreationService.updateSAPTripFlagRequest(LPData).then((res) => {
            setFetch(true)
            if (res.status == 200) {              
              toast.success('TripSheet Updated Sucessfully')
              window.location.reload(false)
            }
          })
          .catch((error) => {
            setFetch(true)
            toast.warning(error)
          }) 
        } else if (response.data.STATUS == 3) {
          setFetch(true)
          toast.success(`${response.data[0].MESSAGE}. Kindly check the Tripsheet and Vehicle Number`)
          return false
        } else {
          setFetch(true)
          toast.warning('SAP Flag : Change Status Action Failed. Kindly Contact Admin..!')
          return false
        }
      })
    }

    const [tripRemarksFilled,setTripRemarksFilled] = useState('')
    const [pygRemarksFilled,setPygRemarksFilled] = useState('')
    const onChangeItem = (e) => {
      let value_change = e.target.value.trimStart()  
      console.log(value_change,'value_change')     
      setTripRemarksFilled(value_change)
    }

    const onChangeItem1 = (e) => {
      let value_change = e.target.value.trimStart()  
      console.log(value_change,'value_change')     
      setPygRemarksFilled(value_change)
    }

    const tripRemarksChange = () => {
      let LPData = new FormData()
      LPData.append('trip_remarks', tripRemarksFilled)
      LPData.append('pyg_remarks', pygRemarksFilled)
      LPData.append('update_by', user_id)
      LPData.append('pyg_id', tripHirePaymentData.parking_yard_gate_id)

      if (tripRemarksFilled == '') {              
        toast.warning('Trip Remarks Should be Filled..')
        return false
      }

      setFetch(false)
      TripSheetCreationService.updateTripRemarksRequest(LPData).then((res) => {
        console.log(res,'updateTripRemarksRequest-res')
        setFetch(true)
        if (res.status == 200) {              
          toast.success(`${res.data.message}`)
          window.location.reload(false)
        } else if (res.status == 201) {
          setFetch(true)
          toast.success(`${res.data.message}. Kindly check the Tripsheet and Vehicle Number`)
          return false
        } else {
          setFetch(true)
          toast.warning('Trip Remarks Updation Failed. Kindly Contact Admin..!')
          return false
        }
      })
      .catch((error) => {
        setFetch(true)
        toast.warning(error)
      }) 
    }
  
    console.log(tripHirePaymentData,'tripHirePaymentData')
  
    return (
      <>
        {!fetch && <Loader />}
        {fetch && (
          <>
            {screenAccess ? (
              <>
                <CContainer className="mt-2">
                  <CRow>
                    <CCol xs={12} md={4}>
                      <div className="w-100 p-3">
                        <CFormLabel htmlFor="tripsheetNumberNew">
                          Enter Tripsheet Number
                          <REQ />{' '}
  
                        </CFormLabel>
                        <CInputGroup>
                          <CFormInput
                            size="sm"
                            name="tripsheetNumberNew"
                            id="tripsheetNumberNew"
                            maxLength={15}
                            autoComplete='off'
                            value={tripsheetNumberNew}
                            onChange={handleChangenewtrip}
                          />
                          <CInputGroupText className="p-0">
                            <CButton
                              size="sm"
                              color="primary"
                              onClick={(e) => {
                                // setFetch(false)
                                setSmallFetch(false)
                                gettripHirePaymentData(e)
                              }}
                            >
                              <i className="fa fa-search px-1"></i>
                            </CButton>
                            <CButton
                              size="sm"
                              style={{ marginLeft:"3px",marginRight:"3px", }}
                              color="primary"
                              onClick={() => {
                                window.location.reload(false)
                              }}
                            >
                              <i className="fa fa-refresh px-1"></i>
                            </CButton>
                          </CInputGroupText>
                          {tripHirePaymentData.tripsheet_info && tripHirePaymentData.tripsheet_info.status == 2 ? ( 
                            <></>                           
                            ) : (  
                              <>
                              {tripHirePaymentData.tripsheet_info && tripHirePaymentData.tripsheet_info.status != 2 && (
                                <CButton
                                  className="text-white"                              
                                  color="success"
                                  id={tripHirePaymentData.tripsheet_sheet_id}
                                  disabled={tripHirePaymentData.tripsheet_info && tripHirePaymentData.tripsheet_info.status == 2}
                                  size="sm"
                                >
                                  <span className="float-start">
                                  <Link target='_blank' to={`/NlmtTripsheetReport/${tripHirePaymentData.tripsheet_id}`}>
                                    <i className="fa fa-eye" style={{ color:"blue" }} aria-hidden="true"></i> &nbsp;
                                    <span style={{ color:"black" }}>Print </span>
                                  </Link>
                                  </span>
                                </CButton> 
                              )}
                            </>
                          )}
                        </CInputGroup>
                      </div>
                      
                    </CCol>
                  </CRow>
  
                  {!smallfetch && <SmallLoader />}
  
                  {smallfetch && Object.keys(tripHirePaymentData).length != 0  && (
  
                    <CCard style={{display: tripSheetHaving ? 'block' : 'none'}}  className="p-3">
                      <CTabContent className="p-3">
                        <CTabPane role="tabpanel" aria-labelledby="home-tab">
                            
                        </CTabPane>
                      </CTabContent>
                    
                      <CNav variant="tabs" role="tablist">
                        <CNavItem>
                          <CNavLink
                            active={activeKey === 4}
                            style={{ backgroundColor: 'green' }}
                            onClick={() => setActiveKey(4)}
                          >
                            Tripsheet Status
                          </CNavLink>
                        </CNavItem>
                        <CNavItem>
                          <CNavLink
                            active={activeKey === 1}
                            style={{ backgroundColor: 'green' }}
                            onClick={() => setActiveKey(1)}
                          >
                            General Information
                          </CNavLink>
                        </CNavItem>
                         
  
                      </CNav>
  
                      <CTabContent>
                        <CTabPane role="tabpanel" aria-labelledby="home-tab" visible={activeKey === 4}>
                          <CContainer className="overflow-hidden">
                              <CRow className="mt-4">
                                <CCol xs={12} md={6}>
                                  <CWidgetStatsF
                                      style={{backgroundColor:'beige'}}
                                      className="mb-3"
                                      icon={<CIcon icon={cilChartPie} height={26} />}
                                      color="success"
                                      bg
                                      inverse
                                      text="Widget helper text"
                                      title="Vehicle Current Position"
                                      value={veh_cur_pos_finder(tripHirePaymentData.vehicle_current_position)}
                                  />
                                </CCol>
                              {/* </CRow>
                              <CRow className="mt-4"> */}
                                  <CCol xs={12} md={6}>
                                      <CWidgetStatsF
                                          style={{backgroundColor:'beige'}}
                                          className="mb-3"
                                          icon={<CIcon icon={cilChartPie} height={26} />}
                                          color="danger"
                                          text="Widget helper text"
                                          title="Parking Status"
                                          value={parking_status_finder(tripHirePaymentData.parking_status)}
                                      />
                                  </CCol>                                       
                                  
                              </CRow>
                              {is_admin ? (
                                <>
                                
                                  <CRow>
                                    <CCol xs={12} md={6}>
                                      <CWidgetStatsF
                                        style={{backgroundColor:'beige'}}
                                        className="mb-3"
                                        icon={<CIcon icon={cilChartPie} height={26} />}
                                        color="primary"
                                        text="Widget helper text"
                                        title="WAITING AT"
                                        value={waiting_at_finder(tripHirePaymentData.vehicle_current_position, tripHirePaymentData.parking_status)}
                                      />
                                    </CCol>    
                                    <CCol xs={12} md={3}>
                                      <CFormLabel htmlFor="vNum">Trip Remarks</CFormLabel>
          
                                      <CFormInput 
                                        size="sm" 
                                        id="pygRemarks" 
                                        maxLength={'50'}
                                        value={pygRemarksFilled}
                                        onChange={(e) => onChangeItem1(e)}
                                        readOnly
                                      /> 
                                    </CCol> 
                                                                   
                                  </CRow> 
                                  <CRow>                                           
                                    <CCol xs={12} md={4}>
                                      <CWidgetStatsF
                                        style={{backgroundColor:'beige'}}
                                        className="mb-3"
                                        icon={<CIcon icon={cilChartPie} height={26} />}
                                        color="primary" 
                                        text="Widget helper text"
                                        title="SAP FLAG STATUS"
                                        value={tripHirePaymentData.tripsheet_info.sap_flag == 0 ? 'STOPPED' : (tripHirePaymentData.tripsheet_info.sap_flag == 1 ? 'STARTED' : (tripHirePaymentData.tripsheet_info.sap_flag == 2 ? 'STARTED - CHANGED' : 'NULL - ENDED'))}
                                      />
                                    </CCol> 
                                    <CCol xs={12} md={2}>
                                      <CFormLabel htmlFor="vCap">SAP Flag Change Status - {tripHirePaymentData.vehicle_current_position}</CFormLabel>
                                      <div style={{marginTop:'5%', textAlign:'center'}} className="d-grid gap-2 d-md-block">
                                        <CButton 
                                          color="primary" 
                                          onClick={() => {sapStatusChange()}}
                                        >
                                          {tripHirePaymentData.tripsheet_info.sap_flag == 1 ? 'SAP - STOP' : (tripHirePaymentData.tripsheet_info.sap_flag == 0 ? 'SAP - REVERT' : 'SAP - START')}
                                        </CButton>
                                      </div>                                      
                                    </CCol>                               
                                  </CRow>
                                </>
                              ) : (
                                <CRow>
                                  <CCol xs={12} md={6}>
                                    <CWidgetStatsF
                                      style={{backgroundColor:'beige'}}
                                      className="mb-3"
                                      icon={<CIcon icon={cilChartPie} height={26} />}
                                      color="primary"
                                      text="Widget helper text"
                                      title="WAITING AT"
                                      value={waiting_at_finder(tripHirePaymentData.vehicle_current_position, tripHirePaymentData.parking_status)}
                                    />
                                  </CCol> 
                                  {JavascriptInArrayComponent(user_id, trip_remarks_edit_user_list_array) ? (
                                    <CCol xs={12} md={3}>
                                      <CFormLabel htmlFor="vNum">Trip Remarks</CFormLabel>
                                      <CFormInput 
                                        size="sm" 
                                        id="pygRemarks" 
                                        maxLength={'50'}
                                        value={pygRemarksFilled}
                                        onChange={(e) => onChangeItem1(e)}
                                      /> 
                                    </CCol>
                                  ) : (
                                    <CCol xs={12} md={3}>
                                      <CFormLabel htmlFor="vNum">Trip Remarks</CFormLabel>
          
                                      <CFormInput size="sm" id="vNum" value={tripHirePaymentData.remarks} readOnly />
                                    </CCol>
                                  )} 
                                  {is_tr_admin ? (
                                    <CCol xs={12} md={3}>
                                        <CFormLabel htmlFor="tripRemarks">Accounts Remarks</CFormLabel>
          
                                      <CFormInput 
                                        size="sm" 
                                        id="tripRemarks" 
                                        maxLength={'50'}
                                        value={tripRemarksFilled}
                                        onChange={(e) => onChangeItem(e)}
                                      />
                                      <CButton 
                                        color="success" 
                                        className='mt-2' 
                                        style={{float:'inline-end'}} 
                                        onClick={() => {tripRemarksChange()}}
                                      >
                                        Submit
                                      </CButton>
                                    </CCol>   
                                  ) : (
                                    <CCol xs={12} md={3}>
                                      <CFormLabel htmlFor="vNum">Accounts Remarks</CFormLabel>
          
                                      <CFormInput size="sm" id="vNum" value={tripHirePaymentData.trip_remarks} readOnly />
                                    </CCol> 
                                  )}  
                                </CRow> 
                              )}
                          </CContainer>
                        </CTabPane>
                      </CTabContent>
                      <CTabContent>
                        <CTabPane role="tabpanel" aria-labelledby="home-tab" visible={activeKey === 1}>
                          <CRow className="mt-2">
  
                            <CCol xs={12} md={3}>
                              <CFormLabel htmlFor="vNum">Vehicle Number</CFormLabel>
  
                              <CFormInput size="sm" id="vNum" value={tripHirePaymentData.vehicle_info.vehicle_number} readOnly />
                            </CCol>
                            <CCol xs={12} md={3}>
                              <CFormLabel htmlFor="vCap">Vehicle Capacity in MTS</CFormLabel>
  
                              <CFormInput
                                size="sm"
                                id="vCap"
                                value={
                                  tripHirePaymentData.vehicle_info.vehicle_capacity_details ? tripHirePaymentData.vehicle_info.vehicle_capacity_details.definition_list_code : ''
                                }
                                readOnly
                              />
                            </CCol>
  
                            <CCol xs={12} md={3}>
                              <CFormLabel htmlFor="vType">Vehicle Type</CFormLabel>
  
                              <CFormInput
                                size="sm"
                                id="vType"
                                value={tripHirePaymentData.vehicle_info?.vehicle_type_id ? vehTypefinder(tripHirePaymentData.vehicle_info.vehicle_type_id) : ''}
                                readOnly
                              />
                            </CCol>
                            <CCol xs={12} md={3}>
                              <CFormLabel htmlFor="dName">Driver Name</CFormLabel>
  
                              <CFormInput size="sm" id="dName" value={tripHirePaymentData.driver_id != null ? tripHirePaymentData.driver_info.driver_name : tripHirePaymentData.driver_name} readOnly />
                            </CCol>
                            <CCol xs={12} md={3}>
                              <CFormLabel htmlFor="dMob">Driver Cell Number</CFormLabel>
  
                              <CFormInput
                                size="sm"
                                id="dMob"
                                value={tripHirePaymentData.driver_id != null ? tripHirePaymentData.driver_info.driver_phone_1 : tripHirePaymentData.driver_phone_1}
                                readOnly
                              />
                            </CCol>
  
  
                            <CCol xs={12} md={3}>
                              <CFormLabel htmlFor="gateInDateTime">Gate-In Date & Time</CFormLabel>
  
                              <CFormInput
                                size="sm"
                                id="gateInDateTime"
                                value={tripHirePaymentData.gate_in_date_time_string}
                                readOnly
                              />
                            </CCol>
                            {tripHirePaymentData.tripsheet_info.purpose != 3 && (
                              <CCol xs={12} md={3}>
                                <CFormLabel htmlFor="inspectionDateTime">
                                  Vehicle Inspection Date & Time
                                </CFormLabel>
  
                                <CFormInput
                                  size="sm"
                                  id="inspectionDateTime"
                                  value={
                                    tripHirePaymentData.vehicle_inspection_info
                                      ? tripHirePaymentData.vehicle_inspection_info.inspection_time_string
                                      : 'No Inspection'
                                  }
                                  readOnly
                                />
                              </CCol>
                            )}
                             
                            {tripHirePaymentData.gate_out_date_time_string && (
                              <CCol xs={12} md={3}>
                                <CFormLabel htmlFor="gateoutDate">Gate Out Date & Time</CFormLabel>
    
                                <CFormInput
                                  size="sm"
                                  id="gateoutDate"
                                  value={tripHirePaymentData.gate_out_date_time_string}
                                  readOnly
                                />
                              </CCol>
                            )}
                            {tripHirePaymentData.vehicle_info?.vehicle_type_id == 22 && (
                                <>
                                    <CCol xs={12} md={3}>
                                    <CFormLabel htmlFor="shedName">Shed Name</CFormLabel>
        
                                    <CFormInput
                                        size="sm"
                                        id="shedName"
                                        // value={tripHirePaymentData.vendor_info && tripHirePaymentData.vendor_info.nlmt_shed_info ? tripHirePaymentData.vendor_info.nlmt_shed_info.shed_name : ''}
                                        value={hireVendorData && hireVendorData.nlmt_shed_info ? hireVendorData.nlmt_shed_info.shed_name : ''}
                                        readOnly
                                    />
                                    </CCol>
                                    <CCol xs={12} md={3}>
                                    <CFormLabel htmlFor="shedOwnerName">Shed Owner Name</CFormLabel>
        
                                    <CFormInput
                                        size="sm"
                                        id="shedOwnerName"
                                        // value={
                                        //   tripHirePaymentData.vendor_info && tripHirePaymentData.vendor_info.nlmt_shed_info ? tripHirePaymentData.vendor_info.nlmt_shed_info.shed_owner_name : ''
                                        // }
                                        value={hireVendorData && hireVendorData.nlmt_shed_info ? hireVendorData.nlmt_shed_info.shed_owner_name : ''}
                                        readOnly
                                    />
                                    </CCol>
                                    <CCol xs={12} md={3}>
                                    <CFormLabel htmlFor="shedOwnerMob">Shed Owner Cell Number</CFormLabel>
        
                                    <CFormInput
                                        size="sm"
                                        id="shedOwnerMob"
                                        // value={
                                        //   tripHirePaymentData.vendor_info && tripHirePaymentData.vendor_info.nlmt_shed_info
                                        //     ? tripHirePaymentData.vendor_info.nlmt_shed_info.shed_owner_phone_1
                                        //     : ''
                                        // }
                                        value={hireVendorData && hireVendorData.nlmt_shed_info ? hireVendorData.nlmt_shed_info.shed_owner_phone_1 : ''}
                                        readOnly
                                    />
                                    </CCol>
                                    <CCol xs={12} md={3}>
                                    <CFormLabel htmlFor="vendorName">Vendor Name</CFormLabel>
        
                                    <CFormInput
                                        size="sm"
                                        id="vendorName"
                                        // value={tripHirePaymentData.vendor_info ? tripHirePaymentData.vendor_info.owner_name : ''}
                                        value={hireVendorData ? hireVendorData.owner_name : ''}
                                        readOnly
                                    />
                                    </CCol>
                                    <CCol xs={12} md={3}>
                                    <CFormLabel htmlFor="vendorCode">Vendor Code</CFormLabel>
        
                                    <CFormInput
                                        size="sm"
                                        id="vendorCode"
                                        // value={tripHirePaymentData.vendor_info ? tripHirePaymentData.vendor_info.vendor_code : ''}
                                        value={hireVendorData ? hireVendorData.vendor_code : ''}
                                        readOnly
                                    />
                                    </CCol>
                                    <CCol xs={12} md={3}>
                                    <CFormLabel htmlFor="vendorMob">Vendor Cell Number</CFormLabel>
        
                                    <CFormInput
                                        size="sm"
                                        id="vendorMob"
                                        // value={tripHirePaymentData.vendor_info ? tripHirePaymentData.vendor_info.owner_number : ''}
                                        value={hireVendorData ? (hireVendorData.owner_number ? hireVendorData.owner_number : '-') : '-'}
                                        readOnly
                                    />
                                    </CCol>
                                    <CCol xs={12} md={3}>
                                    <CFormLabel htmlFor="vendorPanNo">Vendor PAN Number</CFormLabel>
        
                                    <CFormInput
                                        size="sm"
                                        id="vendorPanNo"
                                        // value={tripHirePaymentData.vendor_info ? tripHirePaymentData.vendor_info.pan_card_number : ''}
                                        value={hireVendorData ? hireVendorData.pan_card_number : ''}
                                        readOnly
                                    />
                                    </CCol>
                                </>
                            )}
                            <CCol xs={12} md={3}>
                              <CFormLabel htmlFor="tNum">Tripsheet Number</CFormLabel>
                              <CFormInput
                                size="sm"
                                id="tNum"
                                value={
                                  tripHirePaymentData.tripsheet_info ? tripHirePaymentData.tripsheet_info.nlmt_tripsheet_no : ''
                                }
                                readOnly
                              />
                            </CCol>
                            <CCol xs={12} md={3}>
                              <CFormLabel htmlFor="inspectionDateTime">
                                Tripsheet Creation Date & Time
                              </CFormLabel>
  
                              <CFormInput
                                size="sm"
                                id="TSCreationDateTime"
                                value={
                                  tripHirePaymentData.tripsheet_info
                                    ? tripHirePaymentData.tripsheet_info.tripsheet_creation_time_string
                                    : '---'
                                }
                                readOnly
                              />
                            </CCol>
                          </CRow>
                        </CTabPane>                        
                         
                      </CTabContent>                      
                    </CCard>  
                  )}  
                </CContainer>
              </> ) : (<AccessDeniedComponent />)
            }
          </>
        )}
      </>
    )
  }
  
  export default NlmtVehicleTripSearch
  