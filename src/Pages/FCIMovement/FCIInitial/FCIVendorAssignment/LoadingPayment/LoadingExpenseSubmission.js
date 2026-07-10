

/* eslint-disable prettier/prettier */
import {
  CButton,
  CCard,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CFormLabel,
  CTableCaption,
  CFormSelect,
  CNav,
  CNavItem,
  CNavLink,
  CRow,
  CTabContent,
  CModal,
  CModalHeader,
  CModalTitle,
  CTabPane,
  CModalBody,
  CModalFooter,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CFormFloating,
  CNavbar,
  CTableRow,
  CFormTextarea,
  CCardImage,
  CBadge,
  CInputGroup,
  CInputGroupText,
  CAlert,
  CFormCheck,
  CButtonGroup,
} from '@coreui/react'
import React, { useEffect, useState } from 'react' 
import { Link, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import Loader from 'src/components/Loader'
import * as XLSX from 'xlsx';
import FileSaver from 'file-saver'
import DefinitionsListApi from 'src/Service/Definitions/DefinitionsListApi'
import AccessDeniedComponent from 'src/components/commoncomponent/AccessDeniedComponent'
import JavascriptInArrayComponent from 'src/components/commoncomponent/JavascriptInArrayComponent'
import * as LogisticsProScreenNumberConstants from 'src/components/constants/LogisticsProScreenNumberConstants' 
import useFormDepoExpenseClosure from 'src/Hooks/useFormDepoExpenseClosure';
import LocationApi from 'src/Service/SubMaster/LocationApi';
import { GetDateTimeFormat, imageUrlValidation } from 'src/Pages/Depo/CommonMethods/CommonMethods'; 
import RakeVendorMasterService from 'src/Service/RakeMovement/RakeMaster/RakeVendorMasterService'; 
import FCITripsheetSapService from 'src/Service/SAP/FCITripsheetSapService';
import FCITripsheetCreationService from 'src/Service/FCIMovement/FCITripsheetCreation/FCITripsheetCreationService';
import FCIClosureSubmissionService from 'src/Service/FCIMovement/FCIClosureSubmission/FCIClosureSubmissionService';
import FCIVendorSerachSelectComponent from 'src/Pages/FCIMovement/CommonMethods/FCIVendorSerachSelectComponent';
import FCIVendorCreationService from 'src/Service/FCIMovement/FCIVendorCreation/FCIVendorCreationService'; 
import Swal from 'sweetalert2';
import AuthService from 'src/Service/Auth/AuthService'
import LocalStorageService from 'src/Service/LocalStoage'
import FCIPlantMasterService from 'src/Service/FCIMovement/FCIPlantMaster/FCIPlantMasterService'

const LoadingExpenseSubmission = () => {

  const { id } = useParams()

  console.log(id,'id-id')

  let temp_pos = id.lastIndexOf('||')

  const p__no = id.substring(0,temp_pos)
  const p__code = id.substring(temp_pos+2)

  console.log(p__no,'p__no')
  console.log(p__code,'p__code')


  /*================== User Id & Location Fetch ======================*/
  const user_info_json = localStorage.getItem('user_info')
  const user_info = JSON.parse(user_info_json)
  const user_locations = []
  const navigation = useNavigate()

  console.log(user_info)

  /* Get User Locations From Local Storage */
  user_info.location_info.map((data, index) => {
    user_locations.push(data.id)
  })

  // const Expense_Income_Posting_Date = ExpenseIncomePostingDate();
  // console.log(Expense_Income_Posting_Date,'ExpenseIncomePostingDate')

  /* Get User Id From Local Storage */
  const user_id = user_info.user_id

  // console.log(user_locations)
  /*================== User Location Fetch ======================*/

  const [locationData, setLocationData] = useState([])
  const [settlementAvailable, setSettlementAvailable] = useState(false)
  const [checkedYes, setCheckedYes] = useState(false)
  const [checkList, setCheckList] = useState([])

  /* Expense Constants Declaration */
  const [unloadingCharge, setUnloadingCharge] = useState('')
  const [subDeliveryCharge, setSubDeliveryCharge] = useState('')
  const [weighmentCharge, setWeighmentCharge] = useState('')
  const [freightCharge, setFreightCharge] = useState('')
  const [diversionCharge, setDiversionCharge] = useState('')
  const [haltingCharge, setHaltingCharge] = useState('')
  const [adjustedFreightCharge, setAdjustedFreightCharge] = useState('')
  const [popGroupingData,setPopGroupingData] = useState([])
  const [vendorPopGroupingData,setVendorPopGroupingData] = useState([])  
  const [vendorPopGroupingLPData,setVendorPopGroupingLPData] = useState([])
  const [vendorPopGroupingLPMigoData,setVendorPopGroupingLPMigoData] = useState([])

  /* ==================== Access Part Start ========================*/
  const [screenAccess, setScreenAccess] = useState(false)
  const [restrictScreenById, setRestrictScreenById] = useState(true)
  let page_no = LogisticsProScreenNumberConstants.FCIModule.FCI_LP_Vendor_Assignment

  useEffect(()=>{

    if(user_info.is_admin == 1 || JavascriptInArrayComponent(page_no,user_info.page_permissions)){
      console.log('screen-access-allowed')
      setScreenAccess(true)
    } else{
      console.log('screen-access-not-allowed')
      setScreenAccess(false)
    }

    //section for getting Location Data from database
    LocationApi.getLocation().then((res) => {
      setLocationData(res.data.data,'LocationData')
    })

  },[])

  function logout() {
    AuthService.forceLogout(user_id).then((res) => {
      // console.log(res)
      if (res.status == 204) {
        LocalStorageService.clear()
        window.location.reload(false)
      }
    })
  }
  /* ==================== Access Part End ========================*/

  const formValues = {
    halt_days: '',
    remarks: '',
    apremarks: '',
    expremarks: '',
    selectAll: ''
  }

  const [plantMasterData, setPlantMasterData] = useState([])
  const [selectAllCount, setSelectAllCount] = useState(0)
  const [fciPlantData, setFciPlantData] = useState([])

  const FciPlantFinder = (id) => {
    let n_loc = '--'
    console.log(fciPlantData,'fciPlantData')
    fciPlantData.map((datann, indexnn) => {
      if(datann.plant_id == id){
        n_loc = datann.plant_name
      }
    })
    return n_loc
  }

  useEffect(() => {
    /* section for getting Plant Master List For Location Name Display from database */
    DefinitionsListApi.visibleDefinitionsListByDefinition(34).then((response) => {
      console.log(response.data.data)
      setPlantMasterData(response.data.data)
    })

    /* section for getting FCI Plant Lists from database */
    // DefinitionsListApi.visibleDefinitionsListByDefinition(34).then((response) => {
      FCIPlantMasterService.getActiveFCIPlantRequestTableData().then((response) => {
      // setFetch(true)
      let viewData = response.data.data
      console.log(viewData,'FCI Plant Data') 
      setFciPlantData(viewData) 
    })
  }, [])

  const checkSelectAll = (e) => {
    if (e.target.checked === true) {
      // setUnCheckedYes(false)
      setCheckedYes(true)
      AssignMigosToCheckList(vendorPopGroupingData,vendorPopGroupingLPData,vendorPopGroupingLPMigoData)
    } else {
      setCheckedYes(false)
      setCheckList([])
      setSelectAllCount(0)
      setDeliveryInfo({
        delivery_orders: [],
        response: [],
      })
    }
    console.log(checkList,'checkList-checkList')
  }

  const AssignMigosToCheckList = (datan,datan1,datan2) => {
    console.log(datan,'AssignMigosToCheckList-SAPdata')
    console.log(datan1,'AssignMigosToCheckList-LPdata')
    console.log(datan2,'AssignMigosToCheckList-LPMigodata')
    let migo_json = {}
    migo_json.delivery_orders = []
    migo_json.response = []
    datan.map((vg,kg)=>{
      // console.log(vg,'vg-vg')
      let update_status = 0
      datan2.map((vg1,kg1)=>{
        // console.log(vg1,'vg-vg1')
        if(vg.MIGO_NO == vg1.migo_no && vg.TRIPSHEET_NO == vg1.tripsheet_no && (vg1.status == 1 || vg1.status == 3)){
          update_status = 1
        } else {
          // console.log(migo_json.delivery_orders,'vg-vg migo_json.delivery_orders')
          // if(JavascriptInArrayComponent(vg.MIGO_NO,migo_json.delivery_orders)){
          //   //
          // } else {
          //   migo_json.delivery_orders.push(vg.MIGO_NO)
          //   migo_json.response.push(vg.MIGO_NO)
          // }

        }

      })
      // console.log(migo_json.delivery_orders,'vg-vg migo_json.delivery_orders')

      if(update_status == 0){
        if(vg.MIGO_NO != ''){
          migo_json.delivery_orders.push(vg.MIGO_NO)
          migo_json.response.push(vg.MIGO_NO)
        }

      }
    })

    console.log(migo_json,'vg-vg AssignMigosToCheckList-migo_json')
    setCheckList(migo_json.delivery_orders)
    setDeliveryInfo(migo_json)
    setSelectAllCount(migo_json.delivery_orders.length)

  }

  const range = (start, end) => {
    let menuadd =
      Array(end - start + 1)
      .fill()
      .map((_, idx) => start + idx)
      menuadd.push(261,321,70,80,81)
      console.log(menuadd);
      return menuadd
  }


  /* Overall Journey Information Constants */
  const [pmData, setPMData] = useState([])

  const {
    values,
    errors,
    handleChange,
    isTouched,
    setIsTouched,
    setErrors,
    onFocus,
    handleSubmit,
    enableSubmit,
    onBlur,
  } = useFormDepoExpenseClosure(login, formValues)

  function login() {
    // alert('No Errors CallBack Called')
  }


  const [fetch, setFetch] = useState(false)

  const [clearValuesObject, setClearValuesObject] = useState(false) 
  const [assignMigoModal, setAssignMigoModal] = useState(false)
  const [migoData, setMigoData] = useState([]) 

  const [vendorHaving, setVendorHaving] = useState(false)
  const [selectedVendorData, setSelectedVendorData] = useState({})
  const [selectedVendorCode, setSelectedVendorCode] = useState('')
  const [fciVendorsData, setFciVendorsData] = useState([])

  useEffect(() => {

    /* section for getting Rake Vendors from database */
    FCIVendorCreationService.getAllSapVendorsFromLP().then((response) => {
      let viewData = response.data   
      let updated_closure_data = Object.keys(viewData).map((val) => (viewData[val]));
      console.log(updated_closure_data,'FCI Vendor Data') 
      setFciVendorsData(updated_closure_data)
    })

  }, [])

  const onChangeFilter = (event) => {
    var selected_value = event.value
    console.log(selected_value, 'selected_value')
    if (selected_value) {
      setVendorHaving(true)
      setSelectedVendorCode(selected_value)
      fciVendorsData.map((vv,kk)=>{ 
        if(selected_value == vv.vendor_code){
          setSelectedVendorData(vv) 
        }
      })
    } else {
      setVendorHaving(false)
      setSelectedVendorCode('') 
      setSelectedVendorData({}) 
    }
  }
 
  const [errorModal, setErrorModal] = useState(false)
  const [error, setError] = useState({})

  const ColoredLine = ({ color }) => (
    <hr
        style={{
            color: color,
            backgroundColor: color,
            height: 5
        }}
    />
  )

  const [otherExpenses, setOtherExpenses] = useState('')
  const [totalExpenses, setTotalExpenses] = useState(0)

  useEffect(()=>{

    let migoExpenseFinderAmount = migoExpenseFinder(migoData)
    if(otherExpenses != ''){
      let tot_exp = Number(parseFloat(migoExpenseFinderAmount).toFixed(3))  + Number(parseFloat(otherExpenses).toFixed(3))
      setTotalExpenses(tot_exp)
    } else {
      setTotalExpenses(Number(parseFloat(migoExpenseFinderAmount).toFixed(3)))
    }

  },[migoData,otherExpenses])

  /* ===================== Closure Extra Details Capture Part Start ===================== */

  const setAdditionalCharges = (event, child_property_name, parent_index) => {
    let getData = event.target.value
    console.log(getData, 'getData')

    var floatValues =  /[+-]?([0-9]*[.])?[0-9]+/;

    if(child_property_name == 'atti_cooli_deduction'){ 
      getData = event.target.checked ? 1 : 0
    } else if(child_property_name == 'remarks'){
      //
    } else {
      if (getData.match(floatValues) && !isNaN(getData)) {
        //
      } else {
        getData = event.target.value.replace(/\D/g, '')
      }
    }

    const trip_parent_info = JSON.parse(JSON.stringify(vendorPopGroupingData))

    console.log(trip_parent_info[parent_index],'trip_parent_info')

    trip_parent_info[parent_index][`${child_property_name}_input`] = getData

    trip_parent_info[parent_index][`total_freight`] = total_trip_freight(trip_parent_info[parent_index])

    let ant_sto =  document.getElementById(`trip_total_freight_${parent_index}`)

    ant_sto.value = trip_parent_info[parent_index][`total_freight`]

    console.log(ant_sto.value, 'ant_sto')

    console.log(trip_parent_info,'trip_parent_info')

    setVendorPopGroupingData(trip_parent_info)
  }

  const setTripExpense = (original, input) => {
    // return input === undefined ? original : input
    return input === undefined ? original : input
  }

  const total_trip_freight = (data) => {

    console.log(data, 'total_freight')

    let expense_loading_charges = data.loading_freight_input
      ? Number(data.loading_freight_input)
      : 0
    let expense_deduction_charges = data.deduction_freight_input
      ? Number(data.deduction_freight_input)
      : 0

    let sap_overall_expense = data.OVERALL_EXPENSE
    let sap_loading_expense = data.LOADING_CHARG

    let atti_cooli_deductionValue = data.atti_cooli_deduction_input && data.atti_cooli_deduction_input == 1 ? data.ATTI_COOLI : 0
    let total_data1 = 0
    if(sap_loading_expense != sap_overall_expense){
      total_data1 = expense_loading_charges + sap_overall_expense - expense_deduction_charges - atti_cooli_deductionValue 
    } else {
      total_data1 = (expense_loading_charges == 0 ? sap_loading_expense : expense_loading_charges) - expense_deduction_charges - atti_cooli_deductionValue
    }

    console.log(expense_loading_charges, 'expense_loading_charges')
    console.log(expense_deduction_charges, 'expense_deduction_charges')
    console.log(total_data1, 'total_data1')

    return Number(parseFloat(total_data1).toFixed(3))
  }

  /* ===================== Closure Extra Details Capture Part End ===================== */

  const vadDataUpdate = (original, input) => {
    // return input === undefined ? original : input
    return input === undefined ? original : input
  }


  useEffect(() => {
    const val_obj = Object.entries(values)

    val_obj.forEach(([key_st, value]) => {})
    console.log(values, 'values')
    console.log(formValues, 'formValues')

    if(clearValuesObject) {
      setClearValuesObject(false)
    }

  }, [values, formValues, clearValuesObject])

  const [rowData, setRowData] = useState([])

  const exportToCSV = () => {

    let dateTimeString = GetDateTimeFormat(1)
    let fileName='FCILoadingExpenseSubmissionMigoDetails_'+dateTimeString
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';
    const ws = XLSX.utils.json_to_sheet(rowData);
    const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], {type: fileType});
    FileSaver.saveAs(data, fileName + fileExtension);
  }

 const locationFinder = (data) =>{
  let location = ''
  let code = ''
  // console.log(data,'locationFinderData')
  locationData.map((val,ind)=>{
    if(val.id == data){
      location = val.location
      code = val.location_code
    }
  })

  let needed_data = (location != '' && code != '') ?  `${location} / ${code}` : ''

  return needed_data
 }

  /* ===================== The Constants Needed For First Render Part Start ===================== */


  /* ===================== The Constants Needed For First Render Part End ===================== */

  /* ===================== The Very First Render Part Start ===================== */


  useEffect(() => {

     /* section for getting Shipment Routes For Shipment Creation from database */
     DefinitionsListApi.visibleDefinitionsListByDefinition(11).then((response) => {
      console.log(response.data.data)
      setPMData(response.data.data)
    })

}, [id])

useEffect(() => {

  if(popGroupingData.length > 0){

    
    FCITripsheetSapService.getpopLoadVendorDeliveryData(p__no,p__code).then((res) => {
      setFetch(true)
      let sap_response = res.data
      console.log(sap_response, 'getFnrVendorDeliveryData')
      let rowDataList = []

      sap_response.map((data, index) => {
        console.log(data,'data-data')
        rowDataList.push({
          S_No: index + 1,
          BUDGET_FREIGHT: data.BUDGET_FREIGHT,
          COST_PER_TON: data.COST_PER_TON,
          GATEIN_DATE: data.GATEIN_DATE,
          GATEOUT_DATE: data.GATEOUT_DATE,
          IN_DATE_TIME: data.IN_DATE_TIME,
          MIGO_DATE: data.MIGO_DATE,
          MIGO_NO: data.MIGO_NO,
          OUT_DATE_TIME: data.OUT_DATE_TIME,
          PO_NO: data.PO_NO,
          TONNAGE: data.TONNAGE,
          FROM_PLANT: data.FROM_PLANT,
          TO_PLANT: data.TO_PLANT,
          TRIPSHEET_NO: data.TRIPSHEET_NO,
          TRUCK_NO: data.TRUCK_NO,
          VA_NO: data.VA_NO,
        })
      })
      setRowData(rowDataList)
      if (sap_response.length > 0) {
        toast.success('SAP - FCI Delivery Details Detected!')
        setVendorPopGroupingData(sap_response)
      } else {
        setVendorPopGroupingData([])
        toast.warning('No FCI Delivery Details Detected From SAP!')
        navigation('/LoadingExpenseSubmissionHome')
      }
    })

    FCIClosureSubmissionService.getPopVendorWiseTripData(p__no,p__code).then((res) => {
      let lp_response = res.data.data
      console.log(lp_response, 'getPopVendorWiseTripData')
      if (lp_response.length > 0) {
        setVendorPopGroupingLPData(lp_response)
      } else {
        setVendorPopGroupingLPData([])
      }
    })

    FCIClosureSubmissionService.getPopVendorWiseTripLoadingMigoData(p__no,p__code).then((res) => {
      let lp_response1 = res.data.data
      console.log(lp_response1, 'getPopVendorWiseTripLoadingMigoData')
      if (lp_response1.length > 0) {
        setVendorPopGroupingLPMigoData(lp_response1)
      } else {
        setVendorPopGroupingLPMigoData([])
      }
    })

  }

}, [popGroupingData])

const checkMigoACHStatus = (tsno,mgno,status) => { /* ACH - Atti Cooli Having */
  let cms = 0
  console.log(vendorPopGroupingLPMigoData,'checkMigoStatus')
  console.log(status,'checkMigoACHStatus')
  vendorPopGroupingLPMigoData.map((vvv,kkk)=>{
    if(tsno == vvv.tripsheet_no && mgno == vvv.migo_no && (vvv.status == 1 || vvv.status == 3)){
      cms = 1
    }
  })
  // if(mgno == '' && mgdt == '00-00-0000'){
  if(mgno == '' || status == 2){
    cms = 1
  }
  if(cms == 0){
    return false
  } else {
    return true
  }
}

const checkMigoStatus = (tsno,mgno) => {
  let cms = 0
  console.log(vendorPopGroupingLPMigoData,'checkMigoStatus')
  vendorPopGroupingLPMigoData.map((vvv,kkk)=>{
    if(tsno == vvv.tripsheet_no && mgno == vvv.migo_no && (vvv.status == 1 || vvv.status == 3)){
      cms = 1
    }
  })
  // if(mgno == '' && mgdt == '00-00-0000'){
  if(mgno == ''){
    cms = 1
  }
  if(cms == 0){
    return false
  } else {
    return true
  }
}

const checkMigoCheckBoxStatus = (tsno,mgno,mgdt) => {
  let cms = 1

  console.log(vendorPopGroupingLPMigoData,'checkMigoCheckBoxStatus')
  vendorPopGroupingLPMigoData.map((vvv,kkk)=>{
    console.log(vvv,'checkMigoCheckBoxStatus-vvv',kkk)
    if(tsno == vvv.tripsheet_no && mgno == vvv.migo_no && (vvv.status == 1 || vvv.status == 3)){
      cms = 2
    }
  })

  if(mgno == '' && mgdt == '00-00-0000'){
    cms = 3
  }

  console.log(cms,'checkMigoCheckBoxStatus-cms')
  return cms
}

const checkMigoDataFinder = (tsno1,migono1,type) => {
  let needed_data = ''
  vendorPopGroupingLPMigoData.map((vv1,kk1)=>{
    if(tsno1 == vv1.tripsheet_no && migono1 == vv1.migo_no){
      if(type == 1) {
        needed_data = vv1.nlfd_updated_loading_expense
      } else if(type == 2) {
        needed_data = vv1.deduction
      } else if(type == 3) {
        needed_data = vv1.total_freight
      } else if(type == 4) {
        needed_data = vv1.remarks
      } else if(type == 7) {
        needed_data = vv1.atti_cooli_deduction
      }
    }
  })

  return needed_data
}

  /* ===================== The Very First Render Part End ===================== */

  /* ===================== Header Tabs Controls Part Start ===================== */

  /* ===================== Vehicle Assignment Details (FG-SALES) Table Data Part Start ===================== */



  /* ===================== Header Tabs Controls Part End ===================== */

  /* ===================== All Expenses Capture Part Start  ======================= */

  /* ================= FGSALES ========================================= */

  /* ===================== All Expenses Capture Part End  ======================= */

  const REQ = () => <span className="text-danger"> * </span>

  const getClosureVehiclesData = () => {

    FCITripsheetCreationService.getTripsheetDatabyPOPGrouping().then((res) => {
      let closureData = res.data
      console.log(closureData,'getTripsheetDatabyPOPGrouping-closureData')


      var updated_closure_data = Object.keys(closureData).map((val) => (closureData[val]));
      console.log(updated_closure_data,'getTripsheetDatabyPOPGrouping-updated_closure_data')
      const filterData = updated_closure_data.filter(
        // (data) => data.tripsheet_count != 0 && data.fnr_no == f__no && data.vendor_code == v__code
        (data) => data.tripsheet_count != 0 && data.po_no == p__no && data.fci_plant_code == p__code
      )

      console.log(filterData,'getTripsheetDatabyPOPGrouping-filterData')
      setPopGroupingData(filterData)
    })
    .catch((error) => {
      setFetch(true)
      console.log(error)
      let errorText = error.response.data.message
      console.log(errorText,'errorText')
      let timerInterval;
      if (error.response.status === 401) { 
        Swal.fire({
          title: "Unauthorized Activities Found..",
          html: "App will close in <b></b> milliseconds.",
          icon: "error",
          timer: 3000,
          timerProgressBar: true,
          didOpen: () => {
            Swal.showLoading();
            const timer = Swal.getPopup().querySelector("b");
            timerInterval = setInterval(() => {
              timer.textContent = `${Swal.getTimerLeft()}`;
            }, 100);
          },
          willClose: () => {
            clearInterval(timerInterval);
          }
        }).then((result) => {
          // console.log(result,'result') 
          if (result.dismiss === Swal.DismissReason.timer) { 
            logout()
          }
        });      
      }
    })

  }

  useEffect(() => {
    getClosureVehiclesData()
  }, [])

  const getRndInteger = (min, max) => {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  const [deliveryinfo, setDeliveryInfo] = useState({
    delivery_orders: [],
    response: [],
  })
  

  function checkModalDisplay() {
    console.log(vendorPopGroupingData,'vendorPopGroupingData')
    console.log(deliveryinfo,'deliveryinfo')
    var del_orders_array = deliveryinfo.delivery_orders
    console.log(del_orders_array,'del_orders_array')
    var migo_details2 = []

    /* Create Shipment JSON String for DB Update */
    /*========(Start)================================================================================*/

    del_orders_array.map((value_item1, key_item1) => {
      console.log(value_item1,'value_item1')
      vendorPopGroupingData.map((value_item, key_item) => {
        if (value_item1 == value_item.MIGO_NO) {
          value_item['delivery_sequence'] = key_item1 + 1
          migo_details2.push(value_item)
        }
      })
    })

    console.log(migo_details2,'migo_details2')
    let change_remarks = 0
    let date_month_status = 0
    let date_month = Object.keys(deliveryinfo.response).length > 0 ? migo_details2[0].MIGO_DATE.substring(3) : ''
    console.log(date_month,'date_month-parent')
    migo_details2.map((vk,kk)=>{
      if(vk.total_freight && vk.BUDGET_FREIGHT != vk.total_freight && (!vk.remarks_input || vk.remarks_input.trim() == '')){
        change_remarks = 1
      }
      console.log(vk.MIGO_DATE.substring(3),'date_month-child',kk)
      if(date_month != vk.MIGO_DATE.substring(3)){
        date_month_status = 1
      }
    })

    if(date_month_status == 1){
      toast.warning("Selected Transactions' Month were differed..")
      return false
    }

    // if(change_remarks == 1){
    //   toast.warning('Need proper remarks for modified freight..')
    //   return false
    // }

    setMigoData(migo_details2)
    values.migo_info = JSON.stringify(migo_details2)

    /*=========(End)=================================================================================*/

    if (Object.keys(deliveryinfo.response).length > 0) {
      setAssignMigoModal(true)
    } else {
      toast.warning('Please Choose Atleast One Migo Order for Expense Submission !')
      setAssignMigoModal(false)
    }
  }

  useEffect(()=>{
    if(deliveryinfo.delivery_orders.length == 0 || selectAllCount == 0 || selectAllCount != deliveryinfo.delivery_orders.length){
      setCheckedYes(false)
    } else if(selectAllCount == deliveryinfo.delivery_orders.length){
      // setCheckedYes(true)
    }
  },[checkList,deliveryinfo,selectAllCount])

  const migoTonnageFinder = (dat) => {
    let migo_tonnage = 0
    console.log(dat,'migoExpenseFinder')

    dat.map((vv,kk)=>{
      migo_tonnage += Number(parseFloat(vv.TONNAGE).toFixed(3))
    })
    console.log(migo_tonnage,'migo_tonnage')
    return Number(parseFloat(migo_tonnage).toFixed(3))
  }

  const migoExpenseFinder = (dat) => {
    let exp_migo = 0
    console.log(dat,'migoExpenseFinder')

    dat.map((vv,kk)=>{
      exp_migo += vv.total_freight ? Number(parseFloat(vv.total_freight).toFixed(3)) : Number(parseFloat(vv.OVERALL_EXPENSE).toFixed(3))
      // exp_migo += vv.total_freight ? Number(parseFloat(vv.total_freight).toFixed(3)) : 0
    })
    console.log(exp_migo,'exp_migo')
    return Number(parseFloat(exp_migo).toFixed(3))
  }

  const migoBudgetExpenseFinder = (dat) => {
    let budget_exp_migo = 0
    console.log(dat,'migoBudgetExpenseFinder')

    dat.map((vv,kk)=>{
      budget_exp_migo += vv.BUDGET_FREIGHT
    })
    console.log(budget_exp_migo,'budget_exp_migo')
    return Number(parseFloat(budget_exp_migo).toFixed(3))
  }

  const [rakeVendorsData, setRakeVendorsData] = useState([])

  const vIDFinder = (vcode) => {
    let vID = '--'
    rakeVendorsData.map((datann1, indexnn1) => {
      if(datann1.v_code == vcode){
        vID = datann1.v_id
      }
    })
    return vID
  }

  useEffect(() => {

    /* section for getting Rake Vendors from database */
    RakeVendorMasterService.getActiveRakeVendors().then((response) => {
      let viewData = response.data.data
      console.log(viewData,'Rake Vendor Data')
      setRakeVendorsData(viewData)
    })

  }, [])

  const assign_migo_delivery = (e) => {
    // Destructuring
    const { value, checked } = e.target
    const { delivery_orders } = deliveryinfo
    // const { delivery_orders1 } = checkList

    // Case 1 : The user checks the box
    if (checked) {
      setDeliveryInfo({
        delivery_orders: [...delivery_orders, value],
        response: [...delivery_orders, value],
      })

      if(JavascriptInArrayComponent(value,checkList)){
        //
      } else{
        checkList.push(value)
      }
      // setCheckList({
      //   delivery_orders: [...delivery_orders1, value],
      //   response: [...delivery_orders1, value],
      // })
    }

    // Case 2 : The user unchecks the box
    else {
      setDeliveryInfo({
        delivery_orders: delivery_orders.filter((e) => e !== value),
        response: delivery_orders.filter((e) => e !== value),
      })
      // setCheckList({
      //   delivery_orders: [...delivery_orders1, value],
      //   response: [...delivery_orders1, value],
      // })
      if(JavascriptInArrayComponent(value,checkList)){
        let key = ''
        checkList.map((vl,kl)=>{
          if(vl==value){
            key = kl
          }
        })
        checkList.splice(key,1)
      } else{
        //
      }
    }
    console.log(deliveryinfo.response,'del-res')
    console.log(deliveryinfo.delivery_orders,'del-do')
    console.log(deliveryinfo,'del-info')
  }

  /* ===================== RM-STO Needed Functions Part End  ======================= */

  /* ================= FGSALES ========================================= */

  const expenseSubmit = () => {

    var trip_array= []
    var trip_migo_array= []
    migoData.map((map_data,map_index)=>{
      if(JavascriptInArrayComponent(map_data.TRIPSHEET_NO,trip_array)){
        //
      } else{
        trip_array.push(map_data.TRIPSHEET_NO)
      }
      trip_migo_array.push(map_data.MIGO_NO)
    })

    console.log(migoData,'expenseSubmission-migoData')
    console.log(popGroupingData,'expenseSubmission-popGroupingData')
    console.log(vendorHaving ? selectedVendorData.vendor_name : '-','expenseSubmission-vendor_name')
    console.log(selectedVendorCode ? selectedVendorCode : '-','expenseSubmission-vendor_code')
    console.log(migoBudgetExpenseFinder(migoData),'expenseSubmission-baseExpenses')
    console.log(migoExpenseFinder(migoData),'expenseSubmission-totalExpenses')
    console.log(trip_array.length,'expenseSubmission-tripsheet_count')
    console.log(trip_migo_array.length,'expenseSubmission-trip_migo_count')
    console.log(p__no,'expenseSubmission-po_no')
    console.log(popGroupingData[0].fci_plant_code,'expenseSubmission-fci_plant_code')
    // console.log(expenseClosureApproval ? 2 : 1,'expenseSubmission-status')
    console.log(values.expremarks,'expenseSubmission-values.expremarks')
    console.log(trip_array,'expenseSubmission-trip_array')
    console.log(trip_migo_array,'expenseSubmission-trip_migo_array')

    let fci_closure_data = new FormData()
    fci_closure_data.append('tripsheet_json_info', JSON.stringify(trip_array))
    fci_closure_data.append('trip_migo_json_info', JSON.stringify(trip_migo_array))
    fci_closure_data.append('expense_vendor_name', vendorHaving ? selectedVendorData.vendor_name : '-')
    fci_closure_data.append('expense_vendor_code', selectedVendorCode ? selectedVendorCode : '-')
    fci_closure_data.append('tripsheet_count', trip_array.length)
    fci_closure_data.append('trip_migo_count', trip_migo_array.length)
    fci_closure_data.append('po_no', p__no)
    fci_closure_data.append('fci_plant_code', popGroupingData[0].fci_plant_code)
    fci_closure_data.append('fci_plant_id', popGroupingData[0].fci_plant_id)
    fci_closure_data.append('nlfd_base_expenses', migoBudgetExpenseFinder(migoData))
    fci_closure_data.append('nlld_base_expenses', migoBudgetExpenseFinder(migoData))
    fci_closure_data.append('other_expenses', 0)
    fci_closure_data.append('expense_remarks', values.expremarks || '')
    fci_closure_data.append('expense_amount', migoExpenseFinder(migoData))
    fci_closure_data.append('created_by', user_id)
    fci_closure_data.append('status', 1)
    fci_closure_data.append('expense_vendor_type', 2)
    fci_closure_data.append('trip_migo_info', JSON.stringify(migoData))

    var SentVAInfoData = {}
    var SentVAInfoData_seq = []
    var SentVAInfoData_seq1 = []

    /* Set VAInfo Data via Clubbed Data by Loop */
    for (var i = 0; i < migoData.length; i++) {
      SentVAInfoData.VA_NO = migoData[i].VA_NO
      SentVAInfoData.TRIPSHEET_NO = migoData[i].TRIPSHEET_NO
      SentVAInfoData.VENDOR_TYPE = 2 /* 1 - Freight Vendor, 2 - Loading Vendor, 3 - Freight & Loading Vendor */       
      SentVAInfoData.ASSIGN_FLAG = 1 
      SentVAInfoData_seq[i] = SentVAInfoData

      let be_data = JSON.parse(JSON.stringify(SentVAInfoData)) 
      SentVAInfoData_seq1[i] = be_data
      be_data = {}
      SentVAInfoData = {}
    }

    console.log(SentVAInfoData_seq,'SentVAInfoData_seq')
    console.log(SentVAInfoData_seq1,'SentVAInfoData_seq1')
    setFetch(false)
    // return false
    FCITripsheetSapService.sentVAInfoToSAP(SentVAInfoData_seq).then((res) => {
      console.log(res,'sentVAInfoToSAP-response')
      let sap_tsc_res = JSON.stringify(res.data) 
      console.log(sap_tsc_res,'sap_tsc_res')

      if(sap_tsc_res && sap_tsc_res.length > 0){
         
        fci_closure_data.append('lp_data', JSON.stringify(SentVAInfoData_seq1))
        fci_closure_data.append('sap_res', sap_tsc_res)  

        toast.success('Vendor Assignment Process Sent to SAP Successfully!')

        FCIClosureSubmissionService.createClosure(fci_closure_data).then((res) => {
          console.log(res,'createClosure')
          // return false
          let expense_reference = res.data.expense_reference
          setFetch(true)
          if (res.status == 200) {
            Swal.fire({
              icon: "success",
              title:'Loading Expense Submission Request Sent Successfully!',
              text:  'Loading Expense Reference : ' + expense_reference,
              confirmButtonText: "OK",
            }).then(function () {
              if(popGroupingData[0].tripsheet_count == migoData.length){
                navigation('/LoadingExpenseSubmissionHome')
              } else {
                window.location.reload(false)
              }
            });
          } else if (res.status == 201) {
            Swal.fire({
              title: res.data.message,
              icon: "warning",
              confirmButtonText: "OK",
            }).then(function () {
              // window.location.reload(false)
            })
          } else {
            toast.warning('Expense Submission Failed. Kindly Contact Admin..!')
          }
        })
        .catch((errortemp) => {
          console.log(errortemp)
          setFetch(true)
          var object = errortemp.response.data.errors
          var output = ''
          for (var property in object) {
            output += '*' + object[property] + '\n'
          }
          setError(output)
          setErrorModal(true)
        })          

      } else {

        setFetch(true)
        Swal.fire({
          title: 'Sent VA Info to SAP process Failed in SAP. Kindly contact admin..!',
          icon: "warning",
          confirmButtonText: "OK",
        }).then(function () {
          // window.location.reload(false)
        })

      }

    })
    .catch((error) => {
      setFetch(true)
      Swal.fire({
        title: 'Server Connection Failed. Kindly contact Admin.!',
        // text:  error.response.data.message,
        text:  error.message,
        icon: "warning",
        confirmButtonText: "OK",
      }).then(function () {
        // window.location.reload(false)
      })       
    })

  }


  return (
    <>
      {!fetch && <Loader />}
      {fetch && (
        <>

          {screenAccess ? (
            <>
              <CCard className="p-1 overflow-scroll">
                {popGroupingData.length > 0 && (
                  <CContainer className="p-4">
                    <CRow style={{justifyContent:"center"}}>
                      {/* <CCol xs> */}
                      <CCol className="" xs={12} sm={12} md={3}>
                        <CInputGroup>
                          <CInputGroupText
                            style={{
                              backgroundColor: '#4d3227',
                              color: 'white',
                              width: '45%',
                            }}
                          >
                            PO Number
                          </CInputGroupText>
                          <CFormInput readOnly value={p__no} />
                        </CInputGroup>
                      </CCol>

                      <CCol className="" xs={12} sm={12} md={2}>
                        <CInputGroup>
                          <CInputGroupText
                            style={{
                              backgroundColor: '#4d3227',
                              color: 'white',
                              width: '70%',
                            }}
                          >
                            Tripsheet Count
                          </CInputGroupText>
                          <CFormInput readOnly value={popGroupingData[0].tripsheet_count} />
                        </CInputGroup>
                      </CCol>

                      <CCol className="" xs={12} sm={12} md={6}>
                        <CInputGroup>
                          <CInputGroupText
                            style={{
                              backgroundColor: '#4d3227',
                              color: 'white',
                              width: '35%',
                            }}
                          >
                            Plant Name / Code
                          </CInputGroupText>
                        <CFormInput readOnly value={`${FciPlantFinder(popGroupingData[0].fci_plant_id)} / ${popGroupingData[0].fci_plant_code}`} />
                        </CInputGroup>
                      </CCol>

                      {/* <CCol xs>
                        <CInputGroup>
                          <CInputGroupText
                            style={{
                              backgroundColor: '#4d3227',
                              color: 'white',
                              width: '35%',
                            }}
                          >
                            Vendor Code
                          </CInputGroupText>
                          <CFormInput readOnly value={fnrGroupingData[0].vendor_code} />
                        </CInputGroup>
                      </CCol> */}
                    </CRow>

                    {/* <CRow>
                      <CCol xs>
                        <CInputGroup>
                          <CInputGroupText
                            style={{
                              backgroundColor: '#4d3227',
                              color: 'white',
                              width: '35%',
                            }}
                          >
                            Tripsheet Count
                          </CInputGroupText>
                          <CFormInput readOnly value={fnrGroupingData[0].tripsheet_count} />
                        </CInputGroup>
                      </CCol>

                      <CCol xs>
                        <CInputGroup>
                          <CInputGroupText
                            style={{
                              backgroundColor: '#4d3227',
                              color: 'white',
                              width: '35%',
                            }}
                          >
                            Vendor Code
                          </CInputGroupText>
                          <CFormInput readOnly value={fnrGroupingData[0].vendor_code} />
                        </CInputGroup>
                      </CCol>
                    </CRow> */}

                    <CRow>
                    <CCol md={2}>
                        <div className="d-flex ">
                          <h5 className="px-2">Select All</h5>
                          <div>
                            <CFormCheck
                              style={{ float: 'right', height: '1.3em', width: '1.3em' }}
                              checked={checkedYes}
                              onChange={(e) => checkSelectAll(e)}
                              value={values.selectAll}
                              name="selectAll"
                              id="select_all_btn"
                              aria-label="..."
                            />
                          </div>
                        </div>
                      </CCol>
                      <CCol xs={12} sm={12} md={4}></CCol>

                      <CCol
                        // className="mt-2 offset-md-9"
                        xs={12}
                        sm={12}
                        md={6}
                        // style={{ display: 'flex', justifyContent: 'space-between' }}
                        style={{ display: 'flex', flexDirection: 'row-reverse', cursor: 'pointer' }}
                      >
                        <CButton
                          onClick={() => {
                            checkModalDisplay()
                            // setAssignMigoModal(!assignMigoModal)
                          }}
                          color="warning"
                          className="mx-3 text-white"
                          size="sm"
                          id="inputAddress"
                        >
                          <span className="float-start">
                            <i className="" aria-hidden="true"></i> &nbsp;Submit Transaction
                          </span>
                        </CButton>
                        <CButton
                          size="lg-sm"
                          color="warning"
                          className="mx-3 px-3 text-white"
                          onClick={(e) => {
                            exportToCSV()}
                          }>
                          Export
                        </CButton>

                      </CCol>

                    </CRow>

                    <CRow>
                    {/* <CTable responsive={'xxl'} style={{ height: '80vh'}}>  */}
                    <div className='table-responsive'>
                      <table style={{ width: '200%',height: '60vh'}} className="table pt-1">
                      {/* <CTable className="overflow-scroll"> */}
                        <CTableHead style={{ backgroundColor: '#4d3227', color: 'white' }}>
                          <CTableRow style={{ width: '100%' }}>
                            <CTableHeaderCell
                              scope="col"
                              style={{ color: 'white', width:'10%', textAlign: 'center' }}
                            >
                              #
                            </CTableHeaderCell>
                            <CTableHeaderCell
                              scope="col"
                              style={{ color: 'white', width:'15%', textAlign: 'center' }}
                            >
                              S.No
                            </CTableHeaderCell>

                            <CTableHeaderCell
                              scope="col"
                              style={{ color: 'white', width:'20%', textAlign: 'center' }}
                            >
                              Migo Date
                            </CTableHeaderCell>

                            <CTableHeaderCell
                              scope="col"
                              style={{ color: 'white', width:'25%', textAlign: 'center' }}
                            >
                              Truck No
                            </CTableHeaderCell>
                            <CTableHeaderCell
                              scope="col"
                              style={{ color: 'white', width:'25%', textAlign: 'center' }}
                            >
                              Tripsheet No
                            </CTableHeaderCell>
                            <CTableHeaderCell
                              scope="col"
                              style={{ color: 'white', width:'20%', textAlign: 'center' }}
                            >
                              PO No
                            </CTableHeaderCell>
                            <CTableHeaderCell
                              scope="col"
                              style={{ color: 'white', width:'20%', textAlign: 'center' }}
                            >
                              MIGO No
                            </CTableHeaderCell>
                            {/* <CTableHeaderCell
                              scope="col"
                              style={{ color: 'white', width:'20%', textAlign: 'center' }}
                            >
                              From Plant
                            </CTableHeaderCell> */}

                            <CTableHeaderCell
                              scope="col"
                              style={{ color: 'white', width:'20%', textAlign: 'center' }}
                            >
                              To Plant
                            </CTableHeaderCell>
                            <CTableHeaderCell
                              scope="col"
                              style={{ color: 'white', width:'20%', textAlign: 'center' }}
                            >
                              Tonnage
                            </CTableHeaderCell>
                            <CTableHeaderCell
                              scope="col"
                              style={{ color: 'white', width:'20%', textAlign: 'center' }}
                            >
                              Cost Per Ton
                            </CTableHeaderCell>

                            <CTableHeaderCell
                              scope="col"
                              style={{ color: 'white', width:'20%', textAlign: 'center' }}
                            >
                              Budget Freight
                            </CTableHeaderCell>
                            <CTableHeaderCell
                              scope="col"
                              style={{ color: 'white', width:'20%', textAlign: 'center' }}
                            >
                              Atti Cooli Deduction
                            </CTableHeaderCell>
                            <CTableHeaderCell
                              scope="col"
                              style={{ color: 'white', width:'20%', textAlign: 'center' }}
                            >
                              Atti Cooli
                            </CTableHeaderCell>
                            <CTableHeaderCell
                              scope="col"
                              style={{ color: 'white', width:'20%', textAlign: 'center' }}
                            >
                              Other Charges
                            </CTableHeaderCell>
                            <CTableHeaderCell
                              scope="col"
                              style={{ color: 'white', width:'20%', textAlign: 'center' }}
                            >
                              Office Expenses
                            </CTableHeaderCell>
                            <CTableHeaderCell
                              scope="col"
                              style={{ color: 'white', width:'20%', textAlign: 'center' }}
                            >
                              Weighment Expenses
                            </CTableHeaderCell>
                            <CTableHeaderCell
                              scope="col"
                              style={{ color: 'white', width:'20%', textAlign: 'center' }}
                            >
                              Gate Expenses
                            </CTableHeaderCell>
                            <CTableHeaderCell
                              scope="col"
                              style={{ color: 'white', width:'20%', textAlign: 'center' }}
                            >
                              Actual Loading Cost
                            </CTableHeaderCell>
                            <CTableHeaderCell
                              scope="col"
                              style={{ color: 'white', width:'20%', textAlign: 'center' }}
                            >
                              Updated Loading Cost
                            </CTableHeaderCell>                            
                            <CTableHeaderCell
                              scope="col"
                              style={{ color: 'white', width:'20%', textAlign: 'center' }}
                            >
                              Deduction
                            </CTableHeaderCell>

                            <CTableHeaderCell
                              scope="col"
                              style={{ color: 'white', width:'20%', textAlign: 'center' }}
                            >
                              Total Amount
                            </CTableHeaderCell>
                            <CTableHeaderCell
                              scope="col"
                              style={{ color: 'white', width:'20%', textAlign: 'center' }}
                            >
                              In Date & Time
                            </CTableHeaderCell>
                            <CTableHeaderCell
                              scope="col"
                              style={{ color: 'white', width:'20%', textAlign: 'center' }}
                            >
                              Out Date & Time
                            </CTableHeaderCell>

                            <CTableHeaderCell
                              scope="col"
                              style={{ color: 'white', width:'40%', textAlign: 'center' }}
                            >
                              VA No
                            </CTableHeaderCell>

                            <CTableHeaderCell
                              scope="col"
                              style={{ color: 'white', width:'20%', textAlign: 'center' }}
                            >
                              Remarks
                            </CTableHeaderCell>
                          </CTableRow>
                        </CTableHead>
                        <CTableBody>
                          {/* { saleOrders && { */}
                          {/* {fetch && */}
                          {vendorPopGroupingData && vendorPopGroupingData.length > 0 && vendorPopGroupingData.map((data, index) => {

                            console.log(data,'data-vendorPopGroupingData')
                            // if (data.VBELN2)
                            return (
                              <>
                                <CTableRow key={`trip_expense_data${index}`}>
                                  <CTableDataCell
                                    style={{ width: '10%', textAlign: 'center' }}
                                    scope="row"
                                  >
                                  {checkMigoCheckBoxStatus(data.TRIPSHEET_NO,data.MIGO_NO,data.MIGO_DATE) == 2 ? (
                                    <>
                                      <i
                                        style={{color:'green',fontSize:'x-large' }}
                                        className="fa fa-bullseye"
                                        aria-hidden="true"
                                      ></i>
                                    </>
                                    ) : (checkMigoCheckBoxStatus(data.TRIPSHEET_NO,data.MIGO_NO,data.MIGO_DATE) == 3 ?
                                      (
                                        <i
                                          style={{color:'red',fontSize:'x-large' }}
                                          className="fa fa-bullseye"
                                          aria-hidden="true"
                                        ></i>
                                      ):(
                                        <input
                                          className="form-check-input"
                                          // style={{ minHeight: '18px !important' }}
                                          type="checkbox"
                                          name="delivery_orders"
                                          value={data.MIGO_NO}
                                          checked={
                                          checkList.length > 0 &&
                                            checkList.lastIndexOf(data.MIGO_NO) >= 0
                                              ? true
                                              : false
                                          }
                                          id={`flexCheckDefault_${index}`}
                                          onChange={assign_migo_delivery}
                                        />
                                      )
                                    )
                                  }
                                    {/* <input type="checkbox" name="name2" /> */}
                                  </CTableDataCell>
                                  <CTableDataCell
                                    style={{ width: '15%', textAlign: 'center' }}
                                    scope="row"
                                  >
                                    {index+1}
                                  </CTableDataCell>
                                  <CTableDataCell
                                    style={{ width: '20%', textAlign: 'center' }}
                                    scope="row"
                                  >
                                    {data.MIGO_DATE == '00-00-0000' ? '--' : data.MIGO_DATE}
                                  </CTableDataCell>
                                  <CTableDataCell
                                    style={{ width: '25%', textAlign: 'center' }}
                                    scope="row"
                                  >
                                    {data.TRUCK_NO}
                                  </CTableDataCell>
                                  <CTableDataCell
                                    style={{ width: '25%', textAlign: 'center' }}
                                    scope="row"
                                  >
                                    {data.TRIPSHEET_NO}
                                  </CTableDataCell>
                                  <CTableDataCell
                                    style={{ width: '20%', textAlign: 'center' }}
                                    scope="row"
                                  >
                                    {data.PO_NO}
                                  </CTableDataCell>
                                  <CTableDataCell
                                    style={{ width: '20%', textAlign: 'center' }}
                                    scope="row"
                                  >
                                    {data.MIGO_NO ? data.MIGO_NO : '--'}
                                  </CTableDataCell>
                                  {/* <CTableDataCell
                                    style={{ width: '20%', textAlign: 'center' }}
                                    scope="row"
                                  >
                                    {data.FROM_PLANT}
                                  </CTableDataCell> */}
                                  <CTableDataCell
                                    style={{ width: '20%', textAlign: 'center' }}
                                    scope="row"
                                  >
                                    {data.TO_PLANT}
                                  </CTableDataCell>
                                  <CTableDataCell
                                    style={{ width: '20%', textAlign: 'center' }}
                                    scope="row"
                                  >
                                    {data.TONNAGE}
                                  </CTableDataCell>
                                  <CTableDataCell
                                    style={{ width: '20%', textAlign: 'center' }}
                                    scope="row"
                                  >
                                    {data.COST_PER_TON}
                                  </CTableDataCell>
                                  <CTableDataCell
                                    style={{ width: '20%', textAlign: 'center' }}
                                    scope="row"
                                  >
                                    {data.BUDGET_FREIGHT}
                                  </CTableDataCell>
                                  <CTableDataCell
                                    style={{ width: '20%', textAlign: 'center' }}
                                    scope="row"
                                  >
                                    <CButtonGroup role="group" aria-label="Basic checkbox toggle button group">
                                      {checkMigoACHStatus(data.TRIPSHEET_NO,data.MIGO_NO,data.STATUS) ? (
                                        <CFormCheck
                                          size="lg"
                                          name="atti_cooli_deduction"
                                          id="atti_cooli_deduction"  
                                          checked = {checkMigoDataFinder(data.TRIPSHEET_NO,data.MIGO_NO,7) == 1 ? true : false}
                                          disabled
                                        />
                                      ) : (
                                        <CFormCheck 
                                          // type="radio" 
                                          size="lg"
                                          name="atti_cooli_deduction"
                                          id={`atti_cooli_deduction${index}`}
                                          autoComplete="off"  
                                          // checked = {checkMigoDataFinder(data.TRIPSHEET_NO,data.MIGO_NO,7) == 1 ? true : false}
                                          onChange={(e) => {
                                            setAdditionalCharges(
                                              e,
                                              'atti_cooli_deduction',
                                              index
                                            )
                                          }} 
                                        />
                                      )}
                                      <span></span>                                       
                                    </CButtonGroup>                                    
                                  </CTableDataCell>
                                  <CTableDataCell
                                    class="rounded-circle"
                                    style={{ width: '20%', background:'#ebc999', textAlign: 'center' }}
                                    scope="row"
                                  >
                                    {data.ATTI_COOLI ? data.ATTI_COOLI : '--'}
                                  </CTableDataCell>
                                  <CTableDataCell
                                    class="rounded-circle"
                                    style={{ width: '20%', background:'#ebc999', textAlign: 'center' }}
                                    scope="row"
                                  >
                                    {data.EXTRA_CHARGE ? data.EXTRA_CHARGE : '--'}
                                  </CTableDataCell>
                                  <CTableDataCell
                                    class="rounded-circle"
                                    style={{ width: '20%', background:'#ebc999', textAlign: 'center' }}
                                    scope="row"
                                  >
                                    {data.OFFICE_EXPENSE ? data.OFFICE_EXPENSE : '--'}
                                  </CTableDataCell>
                                  <CTableDataCell
                                    class="rounded-circle"
                                    style={{ width: '20%', background:'#ebc999', textAlign: 'center' }}
                                    scope="row"
                                  >
                                    {data.WEIGHTMENT_CHARGE ? data.WEIGHTMENT_CHARGE : '--'}
                                  </CTableDataCell>
                                  <CTableDataCell
                                    class="rounded-circle"
                                    style={{ width: '20%', background:'#ebc999', textAlign: 'center' }}
                                    scope="row"
                                  >
                                    {data.GATE_EXPENSE ? data.GATE_EXPENSE : '--'}
                                  </CTableDataCell>
                                  <CTableDataCell
                                    class="rounded-circle"
                                    style={{ width: '20%', background:'#ebc999', textAlign: 'center' }}
                                    scope="row"
                                  >
                                    {data.LOADING_CHARG ? data.LOADING_CHARG : '--'}
                                  </CTableDataCell>
                                  <CTableDataCell
                                    style={{ width: '20%', textAlign: 'center' }}
                                    scope="row"
                                  >
                                    {checkMigoStatus(data.TRIPSHEET_NO,data.MIGO_NO) ? (
                                      <>
                                        <CFormInput
                                          size="sm"
                                          name="loading_freight"
                                          id="loading_freight"
                                          value={checkMigoDataFinder(data.TRIPSHEET_NO,data.MIGO_NO,1)}
                                          readOnly
                                        />
                                      </> ) :
                                      <CFormInput
                                        id="loading_freight"
                                        name="loading_freight"
                                        maxLength={5}
                                        onChange={(e) => {
                                          setAdditionalCharges(
                                            e,
                                            'loading_freight',
                                            index
                                          )
                                        }}
                                        value={setTripExpense(
                                          data.loading_freight,
                                          data.loading_freight_input
                                        )}
                                        size="sm"
                                      />
                                    }

                                  </CTableDataCell>
                                  <CTableDataCell
                                    style={{ width: '20%', textAlign: 'center' }}
                                    scope="row"
                                  >
                                    {checkMigoStatus(data.TRIPSHEET_NO,data.MIGO_NO) ? (
                                      <>
                                        <CFormInput
                                          size="sm"
                                          name="deduction_freight"
                                          id="deduction_freight"
                                          value={checkMigoDataFinder(data.TRIPSHEET_NO,data.MIGO_NO,2)}
                                          readOnly
                                        />
                                      </> ) :
                                      <CFormInput
                                        id="deduction_freight"
                                        name="deduction_freight"
                                        maxLength={5}
                                        onChange={(e) => {
                                          setAdditionalCharges(
                                            e,
                                            'deduction_freight',
                                            index
                                          )
                                        }}
                                        value={setTripExpense(
                                          data.deduction_freight,
                                          data.deduction_freight_input
                                        )}
                                        size="sm"
                                      />
                                    }

                                  </CTableDataCell>
                                  <CTableDataCell
                                    style={{ width: '20%', textAlign: 'center' }}
                                    scope="row"
                                  >

                                    {checkMigoStatus(data.TRIPSHEET_NO,data.MIGO_NO) ? (
                                      <>
                                        <CFormInput
                                          size="sm"
                                          name="total_freight"
                                          id="total_freight"
                                          value={checkMigoDataFinder(data.TRIPSHEET_NO,data.MIGO_NO,3)}
                                          readOnly
                                        />
                                      </> ) :
                                      <CFormInput
                                        size="sm"
                                        // id="total_freight"
                                        name="total_freight"
                                        id={`trip_total_freight_${index}`}
                                        value={total_trip_freight(data)}
                                        // value="5"
                                        readOnly
                                      />
                                    }

                                  </CTableDataCell>
                                  <CTableDataCell
                                    style={{ width: '20%', textAlign: 'center' }}
                                    scope="row"
                                  >
                                    {data.IN_DATE_TIME}
                                  </CTableDataCell>
                                  <CTableDataCell
                                    style={{ width: '20%', textAlign: 'center' }}
                                    scope="row"
                                  >
                                    {data.OUT_DATE_TIME}
                                  </CTableDataCell>
                                  <CTableDataCell
                                    style={{ width: '40%', textAlign: 'center' }}
                                    scope="row"
                                  >
                                    {data.VA_NO}
                                  </CTableDataCell>

                                  <CTableDataCell
                                    style={{ width: '20%', textAlign: 'center' }}
                                    scope="row"
                                  >

                                    {checkMigoStatus(data.TRIPSHEET_NO,data.MIGO_NO) ? (
                                      <>
                                        <CFormInput
                                          size="sm"
                                          name="remarks"
                                          id="remarks"
                                          value={checkMigoDataFinder(data.TRIPSHEET_NO,data.MIGO_NO,4)}
                                          readOnly
                                        />
                                      </> ) :
                                      <CFormTextarea
                                        rows="1"
                                        id="remarks"
                                        name="remarks"
                                        // maxLength={5}
                                        onChange={(e) => {
                                          setAdditionalCharges(
                                            e,
                                            'remarks',
                                            index
                                          )
                                        }}
                                        value={setTripExpense(
                                          data.remarks,
                                          data.remarks_input
                                        )}
                                      ></CFormTextarea>
                                    }

                                  </CTableDataCell>
                                </CTableRow>
                              </>
                            )
                          })}
                        </CTableBody>
                      </table>
                    </div>
                  </CRow>

                    <CRow className="mt-md-3">
                      <CCol className="" xs={12} sm={12} md={3}>
                        <CButton size="sm" color="primary" className="text-white" type="button">
                          <Link className="text-white" to="/LoadingExpenseSubmissionHome">
                            Previous
                          </Link>
                        </CButton>
                      </CCol>
                    </CRow>
                  </CContainer>
                )}

                {/* Error Modal Section */}
                <CModal visible={errorModal} onClose={() => setErrorModal(false)}>
                  <CModalHeader>
                    <CModalTitle className="h4">Error</CModalTitle>
                  </CModalHeader>
                  <CModalBody>
                    <CRow>
                      <CCol>
                        {error && (
                          <CAlert color="danger" data-aos="fade-down">
                            {error}
                          </CAlert>
                        )}
                      </CCol>
                    </CRow>
                  </CModalBody>
                  <CModalFooter>
                    <CButton onClick={() => setErrorModal(false)} color="primary">
                      Close
                    </CButton>
                  </CModalFooter>
                </CModal>
                {/* Error Modal Section */}

                {/* Assign Truck Modal */}
                <CModal
                  size="xl" 
                  backdrop="static"
                  scrollable
                  visible={assignMigoModal}
                  onClose={() => {
                    setAssignMigoModal(false)
                    setOtherExpenses('')
                  }}
                >
                  <CModalHeader>
                    <CModalTitle>{`Total Expenses (Assigned Count : ${migoData.length})`}</CModalTitle>
                  </CModalHeader>
                  <CModalBody>
                    <CRow className="mt-1">
                      <CCol xs={12} md={4}>
                        <CFormLabel htmlFor="vCap">Vendor PAN Number</CFormLabel>
                        {/* <CFormInput
                          size="sm"
                          className="mb-2"
                          id="vCap"
                          // value={fnrGroupingData && fnrGroupingData[0].vendor_name ? fnrGroupingData[0].vendor_name : '-'}
                          readOnly
                        /> */}
                        <FCIVendorSerachSelectComponent
                          size="sm"
                          className="mb-2"
                          onChange={(e) => {
                            onChangeFilter(e)
                            {
                              handleChange
                            }
                          }}
                          label="Select Vendor Name"
                          noOptionsMessage="Vendor Not found" 
                          search_type={'vendor_master'}
                          search_data={fciVendorsData}
                        />
                      </CCol>
                      <CCol xs={12} md={4}>
                        <CFormLabel htmlFor="vCap">Vendor Name</CFormLabel>
                        <CFormInput
                          size="sm"
                          className="mb-2"
                          id="vCap"
                          value={vendorHaving ? selectedVendorData.vendor_name : '-'}
                          readOnly
                        />
                      </CCol>
                      <CCol xs={12} md={4}>
                        <CFormLabel htmlFor="vCap">Vendor Code</CFormLabel>
                        <CFormInput
                          size="sm"
                          className="mb-2"
                          id="vCap"
                          value={selectedVendorCode ? selectedVendorCode : '-'}
                          readOnly
                        />
                      </CCol>

                      <CCol xs={12} md={4}>
                        <CFormLabel htmlFor="cmn">Total Tonnage</CFormLabel>
                        <CFormInput
                          // style={{fontWeight: 'bolder'}}
                          name="cmn"
                          size="sm"
                          id="cmn"
                          value={migoTonnageFinder(migoData)}
                          readOnly
                        />
                      </CCol>
                       
                      <CCol xs={12} md={4}>
                        <CFormLabel htmlFor="vCap">Total Loading Expenses</CFormLabel>
                        <CFormInput
                          size="sm"
                          className="mb-2"
                          id="vCap"
                          value={migoExpenseFinder(migoData)}
                          readOnly
                        />
                      </CCol>
                      <CCol xs={12} md={4}>
                        <CFormLabel htmlFor="expremarks">Remarks</CFormLabel>
                        <CFormTextarea
                          name="expremarks"
                          id="expremarks"
                          rows="1"
                          onFocus={onFocus}
                          onBlur={onBlur}
                          onChange={handleChange}
                          value={values.expremarks}
                        ></CFormTextarea>
                      </CCol>
                      {/* <CCol xs={12} md={10}>
                        {expenseClosureApproval && (
                          <span style={{ color: 'red',marginTop:'3%', marginRight:'5%',fontWeight:'bolder',float:'right' }}>
                            Updated Additional Expenses will be sent to Expense Submission Approval..
                          </span>
                        )}
                      </CCol> */}
                    </CRow>
                    <CRow className="mt-5"></CRow>
                    <CRow className="mt-5"></CRow>
                    <CRow className="mt-5"></CRow>
                    <CRow className="mt-5"></CRow>
                  </CModalBody>
                  <CModalFooter>
                    <CButton
                      color="primary"
                      style={{marginRight:'10px'}}
                      onClick={() => {
                        setAssignMigoModal(false)
                        // setFetch(false)
                        expenseSubmit()
                      }}
                      // disabled={!vendorHaving}
                      disabled={!vendorHaving || migoExpenseFinder(migoData) == 0}
                      // disabled={ChildVnum && ChildVroute ? false : true}
                    >
                      Submit
                    </CButton>
                    <CButton
                      color="primary"
                      onClick={() => {
                        setAssignMigoModal(false)
                        setOtherExpenses('')
                      }}
                    >
                      Cancel
                    </CButton>
                  </CModalFooter>
                </CModal>
                {/* Assign Truck Empty Error Modal */}

              </CCard>
            </> ) : (<AccessDeniedComponent />)
          }

   	    </>
      )}
    </>
  )
}

export default LoadingExpenseSubmission

