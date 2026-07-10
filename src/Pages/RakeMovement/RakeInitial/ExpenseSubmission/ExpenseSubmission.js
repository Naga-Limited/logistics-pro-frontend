

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
} from '@coreui/react'
import React, { useEffect, useState } from 'react'
import Webcam from 'react-webcam'
import CIcon from '@coreui/icons-react'
import * as icon from '@coreui/icons';
import { Link, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'

import Loader from 'src/components/Loader'
import * as XLSX from 'xlsx';
import FileSaver from 'file-saver'
import DefinitionsListApi from 'src/Service/Definitions/DefinitionsListApi'

import AccessDeniedComponent from 'src/components/commoncomponent/AccessDeniedComponent'
import JavascriptInArrayComponent from 'src/components/commoncomponent/JavascriptInArrayComponent'
import * as LogisticsProScreenNumberConstants from 'src/components/constants/LogisticsProScreenNumberConstants'
import FileResizer from 'react-image-file-resizer'
import DepoExpenseClosureService from 'src/Service/Depo/ExpenseClosure/DepoExpenseClosureService';
import useFormDepoExpenseClosure from 'src/Hooks/useFormDepoExpenseClosure';
import LocationApi from 'src/Service/SubMaster/LocationApi';
import Swal from 'sweetalert2';
import { GetDateTimeFormat, imageUrlValidation } from 'src/Pages/Depo/CommonMethods/CommonMethods';
import RakeTripsheetCreationService from 'src/Service/RakeMovement/RakeTripsheetCreation/RakeTripsheetCreationService';
import StoDeliveryDataService from 'src/Service/SAP/StoDeliveryDataService';
import RakeTripsheetSapService from 'src/Service/SAP/RakeTripsheetSapService';
import RakeVendorMasterService from 'src/Service/RakeMovement/RakeMaster/RakeVendorMasterService';
import RakeClosureSubmissionService from 'src/Service/RakeMovement/RakeClosureSubmission/RakeClosureSubmissionService';
// import { imageUrlValidation } from '../CommonMethods/CommonMethods';

const ExpenseSubmission = () => {

  const { id } = useParams()

  console.log(id,'id-id')

  let temp_pos = id.lastIndexOf('||')

  const f__no = id.substring(0,temp_pos)
  const v__code = id.substring(temp_pos+2)

  console.log(f__no,'f__no')
  console.log(v__code,'v__code')


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
  const [fnrGroupingData,setFnrGroupingData] = useState([])
  const [vendorFnrGroupingData,setVendorFnrGroupingData] = useState([])
  const [vendorFnrGroupingLPData,setVendorFnrGroupingLPData] = useState([])
  const [vendorFnrGroupingLPMigoData,setVendorFnrGroupingLPMigoData] = useState([])

  /* ==================== Access Part Start ========================*/
  const [screenAccess, setScreenAccess] = useState(false)
  const [restrictScreenById, setRestrictScreenById] = useState(true)
  let page_no = LogisticsProScreenNumberConstants.RakeModule.Rake_Expense_Submission

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
  useEffect(() => {
    /* section for getting Plant Master List For Location Name Display from database */
    DefinitionsListApi.visibleDefinitionsListByDefinition(12).then((response) => {
      console.log(response.data.data)
      setPlantMasterData(response.data.data)
    })
  }, [])

  const checkSelectAll = (e) => {
    if (e.target.checked === true) {
      // setUnCheckedYes(false)
      setCheckedYes(true)
      AssignMigosToCheckList(vendorFnrGroupingData,vendorFnrGroupingLPData,vendorFnrGroupingLPMigoData)
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
  const [submitEnable, setSubmitEnable] = useState(false)
  const [assignMigoModal, setAssignMigoModal] = useState(false)
  const [migoData, setMigoData] = useState([])
  // const [expenseClosureApproval, setExpenseClosureApproval] = useState(false)
  const [fileImageKey, setFileImageKey] = useState('')

  const [shipmentInfo, setShipmentInfo] = useState([])
  const [rjsoInfo, setRjsoInfo] = useState([])
  const [stoTableData, setStoTableData] = useState([])
  const [stoTableDataRMSTO, setStoTableDataRMSTO] = useState([])
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

  // useEffect(()=>{
  //   if(migoData.length > 0){
  //     let approval = 0
  //     migoData.map((vj,kj)=>{
  //       if(vj.total_freight && vj.total_freight !== vj.BUDGET_FREIGHT){
  //         approval = 1
  //       }
  //     })
  //     if(approval === 1){
  //       setExpenseClosureApproval(true)
  //     } else {
  //       setExpenseClosureApproval(false)
  //     }
  //   } else {
  //     setExpenseClosureApproval(false)
  //   }

  //   if(otherExpenses != ''){
  //     setExpenseClosureApproval(true)
  //   }
  // },[migoData,otherExpenses])

  const handleChangeOtherExpenses = (event) => {
    let get_data = event.target.value.replace(/\D/g, '')
    console.log('get_data', get_data)
    if(get_data > 0){
      setOtherExpenses(get_data)
    } else {
      setOtherExpenses('')
    }
    if(get_data > 0 && values.expremarks.trim() == ''){
      setSubmitEnable(true)
    } else {
      setSubmitEnable(false)
    }
  }

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

    if(child_property_name == 'remarks'){
      //
    } else {
      if (getData.match(floatValues) && !isNaN(getData)) {
        //
      } else {
        getData = event.target.value.replace(/\D/g, '')
      }
    }

    const trip_parent_info = JSON.parse(JSON.stringify(vendorFnrGroupingData))

    console.log(trip_parent_info[parent_index],'trip_parent_info')

    trip_parent_info[parent_index][`${child_property_name}_input`] = getData

    trip_parent_info[parent_index][`total_freight`] = total_trip_freight(trip_parent_info[parent_index])

    let ant_sto =  document.getElementById(`trip_total_freight_${parent_index}`)

    ant_sto.value = trip_parent_info[parent_index][`total_freight`]

    console.log(ant_sto.value, 'ant_sto')

    console.log(trip_parent_info,'trip_parent_info')

    setVendorFnrGroupingData(trip_parent_info)
  }

  const setTripExpense = (original, input) => {
    // return input === undefined ? original : input
    return input === undefined ? original : input
  }

  const total_trip_freight = (data) => {

    console.log(data, 'total_freight')

    let expense_additional_charges = data.additional_freight_input
      ? Number(data.additional_freight_input)
      : 0
    let expense_deduction_charges = data.deduction_freight_input
      ? Number(data.deduction_freight_input)
      : 0

    let budget_freight_amount = data.BUDGET_FREIGHT

    let total_data1 = budget_freight_amount + expense_additional_charges - expense_deduction_charges

    console.log(budget_freight_amount, 'budget_freight_amount')
    console.log(expense_additional_charges, 'expense_additional_charges')
    console.log(expense_deduction_charges, 'expense_deduction_charges')
    console.log(total_data1, 'total_data1')

    return Number(parseFloat(total_data1).toFixed(3))
  }

  /* ===================== Closure Extra Details Capture Part End ===================== */

  const reUpload = React.useCallback(() => {
    console.log(shipmentInfo,'updated-shipmentInfo')
  }, [shipmentInfo]);

  const [totalChargesDepo, setTotalChargesDepo] = useState('')

  useEffect(() => {
      setTotalChargesDepo(totalChargesCalculator())
  }, [unloadingCharge, subDeliveryCharge, weighmentCharge, freightCharge, diversionCharge, haltingCharge, adjustedFreightCharge])



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

  }, [values, formValues, clearValuesObject, shipmentInfo])

  const [rowData, setRowData] = useState([])

  const exportToCSV = () => {

    let dateTimeString = GetDateTimeFormat(1)
    let fileName='RakeExpenseSubmissionMigoDetails_'+dateTimeString
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

  if(fnrGroupingData.length > 0){

    let fnr_dummy_no = '23061402690'
    let vendor_dummy_no = '218839'
    // RakeTripsheetSapService.getFnrVendorDeliveryData(fnr_dummy_no,vendor_dummy_no).then((res) => {
    RakeTripsheetSapService.getFnrVendorDeliveryData(f__no,v__code).then((res) => {
      setFetch(true)
      let sap_response = res.data
      console.log(sap_response, 'getFnrVendorDeliveryData')
      let rowDataList = []
      // const filterData = updated_closure_data.filter((data) => data.tripsheet_count != 0)

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
          TO_PLANT: data.TO_PLANT,
          TRIPSHEET_NO: data.TRIPSHEET_NO,
          TRUCK_NO: data.TRUCK_NO,
          VA_NO: data.VA_NO,
        })
      })
      setRowData(rowDataList)
      if (sap_response.length > 0) {
        toast.success('SAP - Rake Delivery Details Detected!')
        setVendorFnrGroupingData(sap_response)
      } else {
        setVendorFnrGroupingData([])
        toast.warning('No Rake Delivery Details Detected From SAP!')
      }
    })

    RakeClosureSubmissionService.getFnrVendorWiseTripData(f__no,v__code).then((res) => {
      setFetch(true)
      let lp_response = res.data.data
      console.log(lp_response, 'getFnrVendorDeliveryLPData')
      if (lp_response.length > 0) {
        // toast.success('LP - Rake Delivery Details Detected!')
        setVendorFnrGroupingLPData(lp_response)
      } else {
        setVendorFnrGroupingLPData([])
        // toast.warning('No Rake Delivery Details Detected From LP!')
      }
    })

    RakeClosureSubmissionService.getFnrVendorWiseTripMigoData(f__no,v__code).then((res) => {
      setFetch(true)
      let lp_response1 = res.data.data
      console.log(lp_response1, 'getFnrVendorDeliveryLPMigoData')
      if (lp_response1.length > 0) {

        setVendorFnrGroupingLPMigoData(lp_response1)
      } else {
        setVendorFnrGroupingLPMigoData([])

      }
    })

  }

}, [fnrGroupingData])

const checkMigoStatus = (tsno,mgno) => {
  let cms = 0
  console.log(vendorFnrGroupingLPMigoData,'checkMigoStatus')
  vendorFnrGroupingLPMigoData.map((vvv,kkk)=>{
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

  console.log(vendorFnrGroupingLPMigoData,'checkMigoCheckBoxStatus')
  vendorFnrGroupingLPMigoData.map((vvv,kkk)=>{
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
  vendorFnrGroupingLPMigoData.map((vv1,kk1)=>{
    if(tsno1 == vv1.tripsheet_no && migono1 == vv1.migo_no){
      if(type == 1) {
        needed_data = vv1.additional_freight
      } else if(type == 2) {
        needed_data = vv1.deduction
      } else if(type == 3) {
        needed_data = vv1.total_freight
      } else if(type == 4) {
        needed_data = vv1.remarks
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

  const totalChargesCalculator = () => {

    let  total_charge =
      Number(unloadingCharge ? unloadingCharge : 0) +
      Number(subDeliveryCharge ? subDeliveryCharge : 0) +
      Number(weighmentCharge ? weighmentCharge : 0) +
      Number(freightCharge ? freightCharge : 0) +
      Number(isNaN(adjustedFreightCharge) ? 0 : adjustedFreightCharge) +
      Number(diversionCharge ? diversionCharge : 0) +
      Number(haltingCharge ? haltingCharge : 0)

    console.log(total_charge,'total_charge')
    return total_charge
  }

  const additionalExpenseFinder = (data1) => {
    let add_exp = migoExpenseFinder(data1) - migoBudgetExpenseFinder(data1)
    console.log(add_exp,'add_exp')
    return Number(parseFloat(add_exp).toFixed(3))
  }

  /* ================= FGSALES ========================================= */

  /* ===================== All Expenses Capture Part End  ======================= */

  const REQ = () => <span className="text-danger"> * </span>

  const getClosureVehiclesData = () => {

    RakeTripsheetCreationService.getTripsheetDatabyFNRGrouping().then((res) => {
      let closureData = res.data
      console.log(closureData,'getTripsheetDatabyFNRGrouping')


      var updated_closure_data = Object.keys(closureData).map((val) => (closureData[val]));
      console.log(updated_closure_data,'result-data')
      const filterData = updated_closure_data.filter(
        (data) => data.tripsheet_count != 0 && data.fnr_no == f__no && data.vendor_code == v__code
      )

      console.log(filterData,'filterData')
      setFnrGroupingData(filterData)
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

  useEffect(()=>{

    if(values.expremarks.trim() == ''){
      if(otherExpenses > 0){
        setSubmitEnable(true)
      } else {
        setSubmitEnable(false)
      }
    } else {
      setSubmitEnable(false)
    }

  },[values.expremarks])

  function checkModalDisplay() {
    console.log(vendorFnrGroupingData,'vendorFnrGroupingData')
    console.log(deliveryinfo,'deliveryinfo')
    var del_orders_array = deliveryinfo.delivery_orders
    console.log(del_orders_array,'del_orders_array')
    var migo_details2 = []

    /* Create Shipment JSON String for DB Update */
    /*========(Start)================================================================================*/

    del_orders_array.map((value_item1, key_item1) => {
      console.log(value_item1,'value_item1')
      vendorFnrGroupingData.map((value_item, key_item) => {
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

    if(change_remarks == 1){
      toast.warning('Need proper remarks for modified freight..')
      return false
    }

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
      exp_migo += vv.total_freight ? Number(parseFloat(vv.total_freight).toFixed(3)) : Number(parseFloat(vv.BUDGET_FREIGHT).toFixed(3))
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
    console.log(fnrGroupingData,'expenseSubmission-fnrGroupingData')
    console.log(vIDFinder(fnrGroupingData[0].vendor_code),'expenseSubmission-vendor_id')
    console.log(fnrGroupingData[0].vendor_code,'expenseSubmission-vendor_code')
    console.log(migoBudgetExpenseFinder(migoData),'expenseSubmission-baseExpenses')
    console.log(additionalExpenseFinder(migoData),'expenseSubmission-otherExpenses')
    console.log(migoExpenseFinder(migoData),'expenseSubmission-totalExpenses')
    console.log(trip_array.length,'expenseSubmission-tripsheet_count')
    console.log(trip_migo_array.length,'expenseSubmission-trip_migo_count')
    // console.log(expenseClosureApproval ? 2 : 1,'expenseSubmission-status')
    console.log(values.expremarks,'expenseSubmission-values.expremarks')
    console.log(trip_array,'expenseSubmission-trip_array')
    console.log(trip_migo_array,'expenseSubmission-trip_migo_array')

    let rake_closure_data = new FormData()
    rake_closure_data.append('tripsheet_json_info', JSON.stringify(trip_array))
    rake_closure_data.append('trip_migo_json_info', JSON.stringify(trip_migo_array))
    rake_closure_data.append('vendor_id', vIDFinder(fnrGroupingData[0].vendor_code))
    rake_closure_data.append('vendor_code', fnrGroupingData[0].vendor_code)
    rake_closure_data.append('tripsheet_count', trip_array.length)
    rake_closure_data.append('trip_migo_count', trip_migo_array.length)
    rake_closure_data.append('fnr_no', fnrGroupingData[0].fnr_no)
    rake_closure_data.append('po_no', migoData[0].PO_NO)
    rake_closure_data.append('rake_plant_code', vendorFnrGroupingLPData[0].rake_plant_code)
    rake_closure_data.append('base_expenses', migoBudgetExpenseFinder(migoData))
    rake_closure_data.append('other_expenses', additionalExpenseFinder(migoData))
    rake_closure_data.append('expense_remarks', values.expremarks || '')
    rake_closure_data.append('expense_amount', migoExpenseFinder(migoData))
    rake_closure_data.append('created_by', user_id)
    rake_closure_data.append('status', 1)
    rake_closure_data.append('tripsheet_migo_info', JSON.stringify(migoData))

    // return false
    RakeClosureSubmissionService.createClosure(rake_closure_data).then((res) => {
      console.log(res,'createClosure')
      // return false
      let expense_reference = res.data.expense_reference
      setFetch(true)
      if (res.status == 200) {
        Swal.fire({
          icon: "success",
          title:'Expense Submission Request Sent Successfully!',
          text:  'Expense Reference : ' + expense_reference,
          confirmButtonText: "OK",
        }).then(function () {
          if(fnrGroupingData[0].tripsheet_count == migoData.length){
            navigation('/RakeExpenseSubmissionHome')
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

  }


  return (
    <>
      {!fetch && <Loader />}
      {fetch && (
        <>

          {screenAccess ? (
            <>
              <CCard className="p-1 overflow-scroll">
                {fnrGroupingData.length > 0 && (
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
                            FNR Number
                          </CInputGroupText>
                          <CFormInput readOnly value={f__no} />
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
                          <CFormInput readOnly value={fnrGroupingData[0].tripsheet_count} />
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
                            Vendor Name / Code
                          </CInputGroupText>
                        <CFormInput readOnly value={`${fnrGroupingData[0].vendor_name} / ${fnrGroupingData[0].vendor_code}`} />
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
                              Additional Freight
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
                              Total Freight
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
                          {vendorFnrGroupingData && vendorFnrGroupingData.length > 0 && vendorFnrGroupingData.map((data, index) => {

                            console.log(data,'data-vendorFnrGroupingData')
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
                                    {checkMigoStatus(data.TRIPSHEET_NO,data.MIGO_NO) ? (
                                      <>
                                        <CFormInput
                                          size="sm"
                                          name="additional_freight"
                                          id="additional_freight"
                                          value={checkMigoDataFinder(data.TRIPSHEET_NO,data.MIGO_NO,1)}
                                          readOnly
                                        />
                                      </> ) :
                                      <CFormInput
                                        id="additional_freight"
                                        name="additional_freight"
                                        maxLength={5}
                                        onChange={(e) => {
                                          setAdditionalCharges(
                                            e,
                                            'additional_freight',
                                            index
                                          )
                                        }}
                                        value={setTripExpense(
                                          data.additional_freight,
                                          data.additional_freight_input
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
                                          name="additional_freight"
                                          id="additional_freight"
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
                          <Link className="text-white" to="/RakeExpenseSubmissionHome">
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
                  size="lg"
                  backdrop="static"
                  scrollable
                  visible={assignMigoModal}
                  onClose={() => {
                    setAssignMigoModal(false)
                    setOtherExpenses('')
                  }}
                >
                  <CModalHeader>
                    <CModalTitle>{`Total Vendor Expenses (Assigned Count : ${migoData.length})`}</CModalTitle>
                  </CModalHeader>
                  <CModalBody>
                    <CRow className="mt-1">
                      <CCol xs={12} md={4}>
                        <CFormLabel htmlFor="vCap">Vendor Name</CFormLabel>
                        <CFormInput
                          size="sm"
                          className="mb-2"
                          id="vCap"
                          value={fnrGroupingData[0].vendor_name}
                          readOnly
                        />
                      </CCol>
                      <CCol xs={12} md={4}>
                        <CFormLabel htmlFor="vCap">Vendor Code</CFormLabel>
                        <CFormInput
                          size="sm"
                          className="mb-2"
                          id="vCap"
                          value={v__code}
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
                        <CFormLabel htmlFor="vCap">Base Expenses</CFormLabel>
                        <CFormInput
                          size="sm"
                          className="mb-2"
                          id="vCap"
                          value={migoBudgetExpenseFinder(migoData)}
                          readOnly
                        />
                      </CCol>
                      <CCol xs={12} md={4}>
                        <CFormLabel htmlFor="vCap">Additional Expenses</CFormLabel>
                        <CFormInput
                          size="sm"
                          className="mb-2"
                          id="vCap"
                          value={additionalExpenseFinder(migoData)}
                          readOnly
                        />
                      </CCol>
                      {/* <CCol xs={12} md={4}>
                        <CFormLabel htmlFor="other_expenses">Other Expenses</CFormLabel>
                        <CFormInput
                          size="sm"
                          name="other_expenses"
                          id="other_expenses"
                          maxLength={5}
                          value={otherExpenses}
                          onChange={handleChangeOtherExpenses}
                        />
                      </CCol> */}
                      <CCol xs={12} md={4}>
                        <CFormLabel htmlFor="vCap">Total Expenses</CFormLabel>
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
                  </CModalBody>
                  <CModalFooter>
                    <CButton
                      color="primary"
                      style={{marginRight:'10px'}}
                      onClick={() => {
                        setAssignMigoModal(false)
                        setFetch(false)
                        expenseSubmit()
                      }}
                      disabled={submitEnable}
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

export default ExpenseSubmission

