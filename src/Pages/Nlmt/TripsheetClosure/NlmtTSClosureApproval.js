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
} from '@coreui/react'
import React, { useEffect, useState } from 'react'
import Webcam from 'react-webcam'
import CIcon from '@coreui/icons-react'
import * as icon from '@coreui/icons'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'

import Loader from 'src/components/Loader'
// import Select from 'react-select';
// import CModal from '@coreui/react/src/components/modal/CModal'
import useForm from 'src/Hooks/useForm'

import validate from 'src/Utils/Validation'

import * as TripsheetClosureConstants from 'src/components/constants/TripsheetClosureConstants'
import VehicleAssignmentService from 'src/Service/VehicleAssignment/VehicleAssignmentService'
import DieselVendorMasterService from 'src/Service/Master/DieselVendorMasterService'

import StoTableComponent from './StoTableComponent'
import AllDriverListNameSelectComponent from 'src/components/commoncomponent/AllDriverListNameSelectComponent'
import StoTableRMSTOComponent from './StoTableRMSTOComponent'
import CustomTable from 'src/components/customComponent/CustomTable'
import ExpenseCalculations from './Calculations/NlmtExpenseCalculations'
import useFormRJSO from 'src/Hooks/useFormRJSO'
import useFormTripsheetClosure from 'src/Hooks/useFormTripsheetClosure'
import RJSaleOrderCreationService from 'src/Service/RJSaleOrderCreation/RJSaleOrderCreationService'
import VehicleMasterService from 'src/Service/Master/VehicleMasterService'
import DefinitionsListApi from 'src/Service/Definitions/DefinitionsListApi'
import TripSheetInfoService from 'src/Service/PurchasePro/TripSheetInfoService'
import CustomerCreationService from 'src/Service/CustomerCreation/CustomerCreationService'
import ExpenseIncomePostingDate from './Calculations/NlmtExpenseIncomePostingDate'
import TripSheetClosureSapService from 'src/Service/SAP/TripSheetClosureSapService'
import Swal from 'sweetalert2'
import AccessDeniedComponent from 'src/components/commoncomponent/AccessDeniedComponent'
import JavascriptInArrayComponent from 'src/components/commoncomponent/JavascriptInArrayComponent'
import * as NlmtScreenAccessCodes from 'src/components/constants/NlmtScreenAccessCodes'
import FileResizer from 'react-image-file-resizer'
import DepartmentApi from 'src/Service/SubMaster/DepartmentApi'
import DivisionApi from 'src/Service/SubMaster/DivisionApi'
import StoTableOthersComponent from './StoTableOthersComponent'
import VehicleRequestMasterService from 'src/Service/VehicleRequest/VehicleRequestMasterService'
import SmallLoader from 'src/components/SmallLoader'
import JavascriptDateCheckComponent from 'src/components/commoncomponent/JavascriptDateCheckComponent'
import { APIURL } from 'src/App'
import NlmtTripSheetClosureService from 'src/Service/Nlmt/TripSheetClosure/NlmtTripSheetClosureService'
import NlmtVehicleAssignmentService from 'src/Service/Nlmt/VehicleAssignment/NlmtVehicleAssignmentService'
import NlmtTripInOwnVehicle from '../TripIn/NlmtTripInOwnVehicle'
import NlmtDefinitionsListApi from 'src/Service/Nlmt/Masters/NlmtDefinitionsListApi'
import NlmtTripSheetInfoService from 'src/Service/Nlmt/SAP/NlmtTripSheetInfoService'
import NlmtTripSheetClosureSapService from 'src/Service/Nlmt/SAP/NlmtTripSheetClosureSapService'
import NlmtTripsheetClosureValidation from 'src/Utils/Nlmt/TripsheetClosure/NlmtTripsheetClosureValidation'
import NlmtStoDeliveryDataService from 'src/Service/Nlmt/SAP/NlmtStoDeliveryDataService'
import NlmtRJSaleOrderCreationSapService from 'src/Service/Nlmt/SAP/NlmtRJSaleOrderCreationSapService'
import NlmtRJSaleOrderCreationService from 'src/Service/Nlmt/RJSaleOrderCreation/NlmtRJSaleOrderCreationService'

const NlmtTSClosureApproval = () => {
  /*================== User Id & Location Fetch ======================*/
  const user_info_json = localStorage.getItem('user_info')
  const user_info = JSON.parse(user_info_json)
  const user_locations = []
  const navigation = useNavigate()
  const is_admin = user_info.user_id == 1 && user_info.is_admin == 1

  if (is_admin) {
    //console.log(user_info)
  }

  /* Get User Locations From Local Storage */
  user_info.location_info.map((data, index) => {
    user_locations.push(data.id)
  })

  const Expense_Income_Posting_Date = ExpenseIncomePostingDate()
  //console.log(Expense_Income_Posting_Date, 'ExpenseIncomePostingDate')

  /* Get User Id From Local Storage */
  const user_id = user_info.user_id

  // //console.log(user_locations)
  /*================== User Location Fetch ======================*/

  const webcamRef = React.useRef(null)
  const [fileuploaded, setFileuploaded] = useState(false)
  const [camEnable, setCamEnable] = useState(false)
  const [camEnableType, setCamEnableType] = useState('')
  const [imgSrc, setImgSrc] = React.useState(null)

  const capture = React.useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot()
    setImgSrc(imageSrc)
  }, [webcamRef, setImgSrc])

  /* ==================== Access Part Start ========================*/
  const [screenAccess, setScreenAccess] = useState(false)
  const [restrictScreenById, setRestrictScreenById] = useState(true)
  let page_no = NlmtScreenAccessCodes.NlmtClosureScreens.NLMT_Deduction_Approval

  useEffect(()=>{

    if(user_info.is_admin == 1 || JavascriptInArrayComponent(page_no,user_info.page_permissions)){
      //console.log('screen-access-allowed')
      setScreenAccess(true)
    } else{
      //console.log('screen-access-not-allowed')
      setScreenAccess(false)
    }

  },[])
  /* ==================== Access Part End ========================*/

  const formValues = {
    vehicle_id: '',
    driver_id: '',
    parking_id: '',
    tripsheet_id: '',
    shipment_id: '',
    sto_info_id: '',
    vendor_id: '',
    diesel_intent_id: '',
    tripsheet_no: '',
    toll_posting_date: '',
    expense_captured_delivery_numbers: '',
    advance_amount: '',
    income: '',
    expense: '',
    halt_days: '',
    profit_and_loss: '',
    base_freight: '',
    additional_freight: '',
    division: '',
    unloading_charges: '',
    sub_delivery_charges: '',
    weighment_charges: '',
    freight_charges: '',
    diversion_return_charges: '',
    halting_charges: '',
    toll_amount: '',
    bata: '',
    municipal_charges: '',
    registered_diesel_amount: '',
    enroute_diesel_amount: '',
    port_entry_fee: '',
    misc_charges: '',
    fine_amount: '',
    sub_delivery_charges: '',
    maintenance_cost: '',
    loading_charges: '',
    tarpaulin_charges: '',
    low_tonage_charges: '' /* Own */,
    low_tonnage_charges: '' /* Hire */,
    rjso_tarpaulin_charges: '',
    rjso_weighment_charges: '',
    rjso_unloading_charges: '',
    rjso_loading_charges: '',
    rjso_bata_amount: '',
    rjso_commision_charges: '',
    rjso_misc_charges: '',
    rjso_munic_charges: '',
    rjso_halt_charges: '',
    rjso_en_diesel_charges: '',
     
    file_attachment1: '',
    file_attachment2: '',
    rj_receipt_amount: '',
    total_amount: '',
    balance_amount: '',
    tripsheet_is_settled: '',
    diesel_consumption_per_trip: '',
    average_rate_and_liter_per_trip: '',
    total_diesel_amount: '',
    diesel_consumption_per_journey: '',
    average_rate_and_liter_per_journey: '',
    created_by: '',
    remarks: '',
    settled_by: '',
    enroute_payment: '',
    halt_bata_amount: '',
    local_bata_amount: '',
    approval_remarks: '',
    TdsHaving: '',
    TdsType: '',
    halt_days: '',
    cost_center: '',
    ded_remarks: '',
    ded_ref: '',
    deduction_doc: '',
    GSTtax: '',
    HSNtax: '',
    sap_text: '',
    ot_process_type: '',
    ot_vr_id: '',
    incoterm_freight_info: '',
    supplier_posting_date:'',
    supplier_ref_no:''
  }
  const VEHICLE_TYPE_MAP = {
    21: 'Own',
    22: 'Hire',
  }
  const [plantMasterData, setPlantMasterData] = useState([])
  const [gstTaxTermsData, setGstTaxTermsData] = useState([])
  const [tdsTaxTermsData, setTdsTaxTermsData] = useState([])
  const [sapHsnData, setSapHsnData] = useState([])
  const [costCenterData, setcostCenterData] = useState([])
  const [loading, setLoading] = useState(true)
  const [dvData, setDvData] = useState([])
  useEffect(() => {
    Promise.all([NlmtDefinitionsListApi.visibleNlmtDefinitionsListByDefinition(6)])
      .then(([costCenter]) => {
        setcostCenterData(costCenter.data.data || [])
      })
      .finally(() => setLoading(false))
  }, [])
  useEffect(() => {
    /* section for getting Plant Master List For Location Name Display from database */
    DefinitionsListApi.visibleDefinitionsListByDefinition(12).then((response) => {
      //console.log(response.data.data, 'setPlantMasterData')
      setPlantMasterData(response.data.data)
    })

    /* section for getting GST Tax Terms Master List For GST Tax Code Display from database */
    DefinitionsListApi.visibleDefinitionsListByDefinition(20).then((response) => {
      //console.log(response.data.data, 'setGstTaxTermsData')
      setGstTaxTermsData(response.data.data)
    })

    /* section for getting TDS Tax Terms Master List For TDS Tax Code Display from database */
    DefinitionsListApi.visibleDefinitionsListByDefinition(3).then((response) => {
      //console.log(response.data.data, 'setTdsTaxTermsData')
      let tdstaxtermdata = response.data.data
      let active_data = tdstaxtermdata.filter((data) => data.definition_list_status == 1)
      setTdsTaxTermsData(active_data)
    })

    /* section for getting Sap Hsn Data from database */
    DefinitionsListApi.visibleDefinitionsListByDefinition(27).then((response) => {
      //console.log(response.data.data, 'DefinitionsListApi-setSapHsnData')
      setSapHsnData(response.data.data)
    }) 
  }, [])

  const location_name = (code) => {
    let plant_name = ''

    plantMasterData.map((val, key) => {
      if (val.definition_list_code == code) {
        plant_name = val.definition_list_name
      }
    })

    return plant_name
  }

  const gstTaxCodeName = (code) => {
    let gst_tax_code_name = '-'

    gstTaxTermsData.map((val, key) => {
      if (val.definition_list_code == code) {
        gst_tax_code_name = val.definition_list_name
      }
    })

    //console.log(gst_tax_code_name, 'gst_tax_code_name')

    return gst_tax_code_name
  }
  const handleChangepostingDate = (event) => {
    let vall = event.target.value

    setpostingDate(vall) // local state (optional)

    values.ded_posting_date = vall // ✅ IMPORTANT
  }
  const tdsTaxCodeName = (code) => {
    let tds_tax_code_name = '-'

    tdsTaxTermsData.map((val, key) => {
      if (val.definition_list_code == code) {
        tds_tax_code_name = val.definition_list_name
      }
    })

    //console.log(tds_tax_code_name, 'tds_tax_code_name')

    return tds_tax_code_name
  }

  /* Overall Journey Information Constants */
  const [tripFgsalesData, setTripFgsalesData] = useState([])
  const [tripRjsoData, setTripRjsoData] = useState([])
  const [tripStoData, setTripStoData] = useState([])
  const [tripsettlementData, setTripsettlementData] = useState([])
  const [pmData, setPMData] = useState([])
  const [settlementAvailable, setSettlementAvailable] = useState(false)
  const [diApprovalCompleted, setDiApprovalCompleted] = useState(false)

  const convertJsonSTringify = (data) => {
    // reCreate new Object and set File Data into it
    var newObject = {
      lastModified: data.lastModified,
      lastModifiedDate: data.lastModifiedDate,
      name: data.name,
      size: data.size,
      type: data.type,
    }

    return JSON.stringify(newObject)
  }

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
  } = useFormTripsheetClosure(login, NlmtTripsheetClosureValidation, formValues)

  // Separate state for fields that were not re-rendering due to direct mutation
  const [haltDays, setHaltDays] = useState('')
  const [costCenter, setcostCenter] = useState('')
  const [dedRemarks, setdedRemarks] = useState('')
  const [ded_posting_date, setpostingDate] = useState('')
  const [deductionDoc, setdeductionDoc] = useState('')
  const [tdsType, setTdsType] = useState('')
  const [gstTax, setGstTax] = useState('')
  const [hsnTax, setHsnTax] = useState('')

  function login() {
    // alert('No Errors CallBack Called')
  }

  const { id } = useParams()
  const [fetch, setFetch] = useState(false)
  const [smallFetch, setSmallFetch] = useState(false)
  const [stoDeliveryEdit, setStoDeliveryEdit] = useState(false)
  const [clearValuesObject, setClearValuesObject] = useState(false)
  const [fileImageKey, setFileImageKey] = useState('')
  const [stoDeliveryEditRMSTO, setStoDeliveryEditRMSTO] = useState(false)

  const [freight_balance_amount, setFreight_balance_amount] = useState(0)
  const [freight_total_amount, setFreight_total_amount] = useState(0)
  const [advance_total_amount, setAdvance_total_amount] = useState(0)
  const [shipmentInfo, setShipmentInfo] = useState([])
  const [rjsoInfo, setRjsoInfo] = useState([])
  const [rjRequestsInfo, setRjRequestsInfo] = useState([])
  const [stoTableData, setStoTableData] = useState([])
  const [stoTableDataRMSTO, setStoTableDataRMSTO] = useState([])
  const [stoTableDataFCI, setStoTableDataFCI] = useState([])
  const [stoTableDataFGSTO, setStoTableDataFGSTO] = useState([])
  const [errorModal, setErrorModal] = useState(false)
  const [error, setError] = useState({})

  const uomName = (id) => {
    if (id == 1) {
      return 'TON'
    } else if (id == 2) {
      return 'KG'
    } else {
      return ''
    }
  }

  useEffect(() => {
    const val_obj = Object.entries(values)

    val_obj.forEach(([key_st, value]) => {})
    //console.log(values, 'values')
    //console.log(formValues, 'formValues')

    if (clearValuesObject) {
      setClearValuesObject(false)
    }
  }, [values, formValues, clearValuesObject])

  const expenseDataCapture = (event) => {
    let expense_name = event.target.name

    let expense_value = event.target.value
    // TripsheetClosureValidation(formValues)
    //console.log(expense_name)
    //console.log(expense_value)

    // if (expense_name == 'unloading_charges') {
    //   if (expense_value) {
    //     errors.unloading_charges = ''
    //   } else {
    //     errors.unloading_charges = 'Required'
    //   }
    // }
  }
  const formatDateTimeIST = (utcDate) => {
    if (!utcDate) return '-'

    const date = new Date(utcDate)

    const datePart = date
      .toLocaleDateString('en-GB', {
        timeZone: 'Asia/Kolkata',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })
      .replace(/\//g, '-') // replace / with -

    const timePart = date.toLocaleTimeString('en-US', {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    })

    return `${datePart} ${timePart}`
  }

  /* ===================== The Constants Needed For First Render Part Start ===================== */

  const [calculationValues, setCalculationValues] = useState(
    TripsheetClosureConstants.InitialCalculationValues
  )

  const [tripInfo, setTripInfo] = useState({})
  const [dieselCollectionInfo, setDieselCollectionInfo] = useState([])
  const [tabDieselAvailable, setTabDieselAvailable] = useState(false)
  const [mainKey, setMainKey] = useState(1)
  const [activeKey, setActiveKey] = useState(1)
  const [activeKey_2, setActiveKey_2] = useState(1)
  const [ExpenseUnloadingCharges, setExpenseUnloadingCharges] = useState(0)
  const [visible, setVisible] = useState(false)
  const [fg_sales_enable, setfg_sales_enable] = useState(false)
  const [sto_enable, setsto_enable] = useState(false)
  const [rjso_enable, setrjso_enable] = useState(false)

  /* ===================== The Constants Needed For First Render Part End ===================== */
  useEffect(() => {
    if (tripFgsalesData && tripFgsalesData.length > 0) {
      let stoArray = []

      tripFgsalesData.forEach((x) => {
        if (Array.isArray(x.shipment_child_info)) {
          x.shipment_child_info.forEach((c) => {
            stoArray.push(c)
          })
        }
      })

      setStoTableDataFCI(stoArray)
    }
  }, [tripFgsalesData])

  //console.log(tripFgsalesData, 'tripFgsalesData')
  // ================= DIESEL INFO FIX =================

  useEffect(() => {
    const vehicleType = tripInfo?.vehicle_info?.vehicle_type_id
    const dieselData = tripInfo?.diesel_intent_collection_info

    console.log('Diesel Check:', vehicleType, dieselData)

    if (Number(vehicleType) === 21 && Array.isArray(dieselData) && dieselData.length > 0) {
      setTabDieselAvailable(true)
      setActiveKey(3) // 🔥 Diesel Tab index
    } else {
      setTabDieselAvailable(false)
    }
  }, [tripInfo])

  // ================= FJ INFO FIX =================
  // ✅ Map FJ rows here

  useEffect(() => {
    if (Array.isArray(tripFgsalesData) && tripFgsalesData.length > 0) {
      const mapped = tripFgsalesData.map((s) => ({
        shipment_id: s.shipment_id,
        shipment_no: s.shipment_no,
        billed_net_qty: s.billed_net_qty,
        shipment_child_info: (s.shipment_child_info || []).map((c) => ({
          ...c,
          fj_pod_copy: '',
          delivered_date_time_input: c.delivered_date_time,
          unloading_charges_input: c.unloading_charges,
        })),
      }))

      setShipmentInfo(mapped)
      setfg_sales_enable(true)
    } else {
      setShipmentInfo([])
      setfg_sales_enable(false)
    }
  }, [tripFgsalesData])

  //console.log('shipmentInfo length:', shipmentInfo.length)
  /* ===================== The Very First Render Part Start ===================== */

  useEffect(() => {
    if (id) {
      NlmtTripSheetClosureService.getTripSettlementInfoByParkingId(id).then((res) => {
        console.log(res.data.data, 'getTripSettlementInfoByParkingId')
        //console.log(values.low_tonnage_charges, 'getTripSettlementInfoByParkingId - lowtonnagecharge')
        if (res.data.data[0] === undefined) {
          setTripsettlementData([])
          setSettlementAvailable(false)
        } else if (res.data.data[0]) {
          setTripsettlementData(res.data.data[0])
          setSettlementAvailable(true)
          values.remarks = res.data.data[0].remarks
          values.income_remarks = res.data.data[0].income_remarks

          let budgetKM = res.data.data[0].budgeted_km

          let actualMileage = res.data.data[0].actual_mileage
          let budgetMileage = res.data.data[0].budgeted_mileage

          values.toll_amount = res.data.data[0].toll_amount ? res.data.data[0].toll_amount : ''
          values.bata = res.data.data[0].bata ? res.data.data[0].bata : ''
          values.municipal_charges = res.data.data[0].municipal_charges
            ? res.data.data[0].municipal_charges
            : ''
          values.local_bata_amount = res.data.data[0].local_bata_amount
            ? res.data.data[0].local_bata_amount
            : ''
          values.halt_bata_amount = res.data.data[0].halt_bata_amount
            ? res.data.data[0].halt_bata_amount
            : ''
          values.port_entry_fee = res.data.data[0].port_entry_fee
            ? res.data.data[0].port_entry_fee
            : ''
          values.misc_charges = res.data.data[0].misc_charges ? res.data.data[0].misc_charges : ''
          values.fine_amount = res.data.data[0].fine_amount ? res.data.data[0].fine_amount : ''
          values.sub_delivery_charges = res.data.data[0].sub_delivery_charges
            ? res.data.data[0].sub_delivery_charges
            : ''
          values.maintenance_cost = res.data.data[0].maintenance_cost
            ? res.data.data[0].maintenance_cost
            : ''
          values.loading_charges = res.data.data[0].loading_charges
            ? res.data.data[0].loading_charges
            : ''
          values.unloading_charges = res.data.data[0].unloading_charges
            ? res.data.data[0].unloading_charges
            : 0
          values.tarpaulin_charges = res.data.data[0].tarpaulin_charges
            ? res.data.data[0].tarpaulin_charges
            : ''
          values.weighment_charges = res.data.data[0].weighment_charges
            ? res.data.data[0].weighment_charges
            : ''
          values.low_tonage_charges = res.data.data[0].low_tonage_charges
            ? res.data.data[0].low_tonage_charges
            : ''
          values.diversion_return_charges = res.data.data[0].diversion_return_charges
            ? res.data.data[0].diversion_return_charges
            : ''
          // values.freight_charges = res.data.data[0].freight_charges
          //   ? res.data.data[0].freight_charges
          //   : tripInfo.advance_payment_info
          //   ? tripInfo.advance_payment_info.actual_freight
          //   : ''
          if (res.data.data[0].freight_charges) {
            values.freight_charges = res.data.data[0].freight_charges
          } else {
            if (
              tripInfo?.advance_payment_info?.actual_freight &&
              Number(tripInfo.advance_payment_info.low_tonnage_charges) > 0
            ) {
              values.freight_charges =
                Number(tripInfo.advance_payment_info.actual_freight) -
                Number(tripInfo.advance_payment_info.low_tonnage_charges)
            } else if (
              tripInfo.advance_payment_info &&
              (tripInfo.advance_payment_info.low_tonnage_charges ||
                tripInfo.advance_payment_info.actual_freight)
            ) {
              values.freight_charges = tripInfo.advance_payment_info.actual_freight
            } else {
              values.freight_charges = ''
            }
          }
          values.low_tonnage_charges = res.data.data[0].low_tonage_charges
            ? res.data.data[0].low_tonage_charges
            : tripInfo.advance_info
            ? tripInfo.advance_info.low_tonnage_charges
            : ''
          values.halting_charges = res.data.data[0].halting_charges
            ? res.data.data[0].halting_charges
            : ''
          // values.halt_days = res.data.data[0].halt_days ? res.data.data[0].halt_days : ''

          setHaltDays(res.data.data[0]?.halt_days ?? '')
          values.halt_days = res.data.data[0]?.halt_days ?? ''
          setcostCenter(res.data.data[0]?.cost_center ?? '')
          values.cost_center = res.data.data[0]?.cost_center ?? ''
          setdedRemarks(res.data.data[0]?.ded_remarks ?? '')
          values.ded_remarks = res.data.data[0]?.ded_remarks ?? ''
          values.ded_ref = res.data.data[0]?.ded_ref ?? ''
          setpostingDate(res.data.data[0]?.ded_posting_date ?? '')
          values.ded_posting_date = res.data.data[0]?.ded_posting_date ?? ''
          setdeductionDoc(res.data.data[0]?.deduction_doc ?? '')
          values.deduction_doc = res.data.data[0]?.deduction_doc ?? ''

          setTdsType(res.data.data[0]?.tds_type ?? '')
          values.TdsType = res.data.data[0]?.tds_type ?? ''
          values.TdsHaving = res.data.data[0]?.tds_having ?? ''
          values.TdsTax = res.data.data[0]?.vendor_tds ?? ''

          values.sap_text = res.data.data[0]?.sap_text ?? ''

          setGstTax(res.data.data[0]?.gst_tax_type ?? '')
          values.GSTtax = res.data.data[0]?.gst_tax_type ?? ''

          setHsnTax(res.data.data[0]?.vendor_hsn ?? '')
          values.HSNtax = res.data.data[0]?.vendor_hsn ?? ''
          let updatedInputs = { ...calculationValues, budgetKM, budgetMileage, actualMileage }
          setCalculationValues(updatedInputs)
          setTripIdleHours(res.data.data[0].idle_hours)
          console.log(values.halt_days, 'values.halt_days')
          console.log(values.TdsType, 'values.TdsType')
          console.log(values.sap_text, 'values.sap_text')
          console.log(values.GSTtax, 'values.GSTtax')
          console.log(values.HSNtax, 'values.HSNtax')
        }
      })

      NlmtVehicleAssignmentService.getShipmentInfoByPId(id).then((res) => {
        //console.log(res.data.data)
        let shipment_data = res.data.data || []
        setTripFgsalesData(shipment_data)
      })

      /* section for getting Shipment Routes For Shipment Creation from database */
      DefinitionsListApi.visibleDefinitionsListByDefinition(11).then((response) => {
        //console.log(response.data.data)
        setPMData(response.data.data)
      })

      NlmtTripSheetClosureService.getTripStoInfoByParkingId(id).then((res) => {
        console.log(res.data.data, 'getTripStoInfoByParkingId')
        if (res.data.data === undefined) {
          setTripStoData([])
        } else if (res.data.data) {
          let stoTripSheetData = res.data.data
          const stoTripSheetFGSTOData = stoTripSheetData.filter(
            (data) => data.sto_delivery_type == '1'
          )
          const stoTripSheetRMSTOData = stoTripSheetData.filter(
            (data) => data.sto_delivery_type == '2'
          )

          console.log(stoTripSheetFGSTOData, 'stoTripSheetFGSTOData')
          console.log(stoTripSheetRMSTOData, 'stoTripSheetRMSTOData')
          setStoTableData(stoTripSheetFGSTOData)
          setStoTableDataRMSTO(stoTripSheetRMSTOData)
          setTripStoData(res.data.data)
        }
      })
    }
  }, [id])
  const vehicleTypeId = Number(tripInfo?.vehicle_info?.vehicle_type_id)
  useEffect(() => {
    const vehicleTypeId = Number(tripInfo?.vehicle_info?.vehicle_type_id)

    if (vehicleTypeId === 22) {
      setMainKey(1) // Hire Section
    } else if (vehicleTypeId === 21) {
      setMainKey(2) // Own Section
    }
  }, [tripInfo])

  const [incotermFreightInfo, setIncotermFreightInfo] = useState([])
  const [idt, setIdt] = useState([])

  useEffect(() => {
    NlmtTripSheetClosureService.getVehicleInfoById(id)
      .then((res) => {
        let fetchedData = res.data.data
        console.log(fetchedData, 'fetchedData')

        // declare FIRST
        let filtered = []

        if (
          user_info.is_admin == 0 &&
          (fetchedData.vehicle_current_position == 26 ||
            fetchedData.vehicle_current_position == 27 ||
            fetchedData.vehicle_current_position == 28)
        ) {
          setRestrictScreenById(false)
        }

        fetchedData.shipment_info
          ? setShipmentNumber(fetchedData.shipment_info.shipment_no)
          : setShipmentNumber('')

        setTripInfo(fetchedData)

        if (!settlementAvailable) {
          if (fetchedData.rj_so_info) {
            setRjsoInfo(fetchedData.rj_so_info)
          } else {
            setRjsoInfo([])
          }
        }

        // incoterm
        if (fetchedData.shipment_info?.length > 0) {
          setIncotermFreightInfo(fetchedData.shipment_info[0].incoterm_freight_info)
        } else {
          setIncotermFreightInfo([])
        }

        // freight logic
        if (
          fetchedData.vehicle_info &&
          fetchedData.vehicle_info.vehicle_type_id == 22 &&
          fetchedData.advance_info
        ) {
          if (
            fetchedData.advance_payment_info &&
            fetchedData.advance_payment_info.low_tonnage_charges &&
            Number(fetchedData.advance_payment_info.low_tonnage_charges) > 0
          ) {
            values.freight_charges =
              Number(fetchedData.advance_payment_info.actual_freight) -
              Number(fetchedData.advance_payment_info.low_tonnage_charges)
          } else if (
            fetchedData.advance_payment_info &&
            (fetchedData.advance_payment_info.low_tonnage_charges ||
              fetchedData.advance_payment_info.actual_freight)
          ) {
            values.freight_charges = fetchedData.advance_payment_info.actual_freight
          } else {
            values.freight_charges = ''
          }

          values.low_tonnage_charges = fetchedData.advance_info.low_tonnage_charges
            ? fetchedData.advance_info.low_tonnage_charges
            : ''
        }

        if (
          fetchedData.vehicle_info &&
          fetchedData.vehicle_info.vehicle_type_id == 23 &&
          !fetchedData.advance_payment_info &&
          idt.length > 0 &&
          fetchedData.trip_sheet_info.to_divison == 1
        ) {
          values.freight_charges = totalvaluefinder(2, fetchedData.shipment_info[0])
        }

        // diesel
        if (fetchedData.diesel_intent_collection_info) {
          setDieselCollectionInfo(fetchedData.diesel_intent_collection_info)
        } else {
          setDieselCollectionInfo([])
        }

        // shipment filter

        // if (Number(fetchedData.trip_vehicle_info.vehicle_type_id) === 21) {
        //   setMainKey(3)   // Diesel tab
        // } else {
        //   setMainKey(1)
        // }
        if (Number(fetchedData.vehicle_info.vehicle_type_id) === 22) {
          setMainKey(1) // Hire Section
        } else if (Number(fetchedData.vehicle_info.vehicle_type_id) === 21) {
          setMainKey(2) // Own Section
        } else if (Number(fetchedData.vehicle_info.vehicle_type_id) === 23) {
          setMainKey(2) // Party Section (same as own)
        }

        fetchedData.vehicle_current_position == 37 || fetchedData.vehicle_current_position == 39
          ? setDiApprovalCompleted(false)
          : setDiApprovalCompleted(true)

        fetchedData.rj_so_info?.length > 0 ? setrjso_enable(true) : setrjso_enable(false)

        // FG enable

        setFetch(true)
      })
      .catch((error) => {
        setFetch(true)
        toast.warning(error)
      })
  }, [id, idt.length > 0])

  const [vehicleCapacity, setVehicleCapacity] = useState([])
  const [vehicleBody, setVehicleBody] = useState([])
  const [vehicleType1, setVehicleType1] = useState([])
  const [mastersLoaded, setMastersLoaded] = useState(false)
  useEffect(() => {
    Promise.all([
      NlmtDefinitionsListApi.visibleNlmtDefinitionsListByDefinition(2), // Vehicle Capacity
      NlmtDefinitionsListApi.visibleNlmtDefinitionsListByDefinition(1), // Vehicle Body Type
      NlmtDefinitionsListApi.visibleNlmtDefinitionsListByDefinition(3), // Vehicle Type
    ]).then(([cap, body, type]) => {
      setVehicleCapacity(cap.data.data || [])
      setVehicleBody(body.data.data || [])
      setVehicleType1(type.data.data || [])
      setMastersLoaded(true)
    })
  }, [])
  const getDefinitionName = (list, id) => {
    if (!list || !id) return ''

    const item = list.find((x) => String(x.definition_list_id) === String(id))

    return item ? item.definition_list_name.trim() : ''
  }
  /* ===================== The Very First Render Part End ===================== */

  /* ===================== Header Tabs Controls Part Start ===================== */

  const [tabGISuccess, setTabGISuccess] = useState(false)
  const [tabFJSuccess, setTabFJSuccess] = useState(false)
  const [tabRJSOSuccess, setTabRJSOSuccess] = useState(false)
  const [tabFGSTOSuccess, setTabFGSTOSuccess] = useState(false)
  const [tabRMSTOSuccess, setTabRMSTOSuccess] = useState(false)
  const [tabFCISuccess, setTabFCISuccess] = useState(false)
  const [tabFJ_RJ_FG_RM_STO_Success, setTabFJ_RJ_FG_RM_STO_Success] = useState(false)
  const [tabDISuccess, setTabDISuccess] = useState(false)
  const [tabEXSuccess, setTabEXSuccess] = useState(false)
  const [tabFGSTOHireSuccess, setTabFGSTOHireSuccess] = useState(false)
  const [tabRMSTOHireSuccess, setTabRMSTOHireSuccess] = useState(false)
  const [tabFGSALESHireSuccess, setTabFGSALESHireSuccess] = useState(false)
  const [tabFGSALESHireAvailable, setTabFGSALESHireAvailable] = useState(false)
  const [tabFreightHireSuccess, setTabFreightHireSuccess] = useState(false)
  const [tabExpensesHireSuccess, setTabExpensesHireSuccess] = useState(false)
  const [stoOthersTableData, setStoOthersTableData] = useState([])

  /* ===================== Header Tabs Controls Part End ===================== */

  useEffect(() => {
    if (Array.isArray(tripFgsalesData) && tripFgsalesData.length > 0) {
      setfg_sales_enable(true)
      setTabFGSALESHireAvailable(true)
    } else {
      setfg_sales_enable(false)
      setTabFGSALESHireAvailable(false)
    }
  }, [tripFgsalesData])

  useEffect(() => {
    if (
      tabFGSALESHireSuccess ||
      // shipmentInfo.length === 0 ||
      // !tabFGSALESHireAvailable ||
      (stoTableData && stoTableData.length > 0) ||
      (stoTableDataFGSTO && stoTableDataFGSTO.length > 0) ||
      (stoTableDataRMSTO && stoTableDataRMSTO.length > 0) ||
      (stoOthersTableData && stoOthersTableData.length > 0)
    ) {
      setTabFreightHireSuccess(true)
    } else {
      setTabFreightHireSuccess(false)
    }

    //console.log(tabFGSALESHireSuccess, 'tabFGSALESHireSuccess')
    //console.log(tabFGSALESHireAvailable, 'tabFGSALESHireAvailable')
    //console.log(stoTableData.length, 'stoTableData')
    //console.log(stoTableDataRMSTO.length, 'stoTableDataRMSTO')
    //console.log(tabFreightHireSuccess, 'tabFreightHireSuccess')
  }, [
    shipmentInfo,
    stoTableData,
    stoTableDataFGSTO,
    stoTableDataRMSTO,
    tabFGSALESHireSuccess,
    stoOthersTableData,
  ])

  useEffect(() => {
    if (stoTableData && stoTableData.length > 0) {
      setTabFGSTOHireSuccess(true)
    } else {
      setTabFGSTOHireSuccess(false)
    }
  }, [stoTableData])

  useEffect(() => {
    if (stoTableDataRMSTO && stoTableDataRMSTO.length > 0) {
      setTabRMSTOHireSuccess(true)
    } else {
      setTabRMSTOHireSuccess(false)
    }
  }, [stoTableDataRMSTO])

  /* ===== User Inco Terms Declaration Start ===== */

  const [incoTermData, setIncoTermData] = useState([])

  useEffect(() => {
    /* section for getting Inco Term Lists from database */
    DefinitionsListApi.visibleDefinitionsListByDefinition(16).then((response) => {
      let viewData = response.data.data
      //console.log(viewData, 'Inco Term Lists')

      let rowDataList_location = []
      viewData.map((data, index) => {
        rowDataList_location.push({
          sno: index + 1,
          incoterm_id: data.definition_list_id,
          incoterm_name: data.definition_list_name,
          incoterm_code: data.definition_list_code,
        })
      })

      setIncoTermData(rowDataList_location)
    })
  }, [])

  const totalFreightvaluefinder = (type, Actual_Freight, Low_Tonnage_Charges) => {
    let ans = 0
    let ans1 = 0
    if (type == 1) {
      //console.log(Actual_Freight, 'totalFreightvaluefinder-Inco_Term_wise_Freight')
    } else {
      //console.log(Actual_Freight, 'totalFreightvaluefinder-Actual_Freight')
    }
    //console.log(Low_Tonnage_Charges, 'totalFreightvaluefinder-Low_Tonnage_Charges')
    let Total_Freight =
      Number(Actual_Freight) +
      (Number.isInteger(Number(Low_Tonnage_Charges)) ? Number(Low_Tonnage_Charges) : 0)
    ans = Number(parseFloat(Total_Freight).toFixed(2))
    ans1 = Math.round(ans)
    //console.log(ans1, 'totalFreightvaluefinder-totalFreightvalue')
    return ans1 ? ans1 : 0
  }

  /* Display The Inco Term Name via Given Inco Term Code */
  const getIncoTermNameByCode = (code) => {
    //console.log(incoTermData, 'getIncoTermNameByCode-incoTermData')
    //console.log(code, 'getIncoTermNameByCode-code')

    let filtered_incoterm_data = incoTermData.filter((c, index) => {
      if (c.incoterm_id == code) {
        return true
      }
    })

    let incoTermName = filtered_incoterm_data[0]
      ? filtered_incoterm_data[0].incoterm_code
      : 'Loading..'

    return incoTermName
  }

  useEffect(() => {
    if (
      tripInfo &&
      tripInfo.shipment_info &&
      tripInfo.shipment_info.length > 0 &&
      incoTermData.length > 0
    ) {
      let shp = tripInfo.shipment_info[0]
      let shp_incoterm_array = []
      var incoTableData = []
      var do_array = []
      shp.shipment_child_info.map((vv, kk) => {
        if (JavascriptInArrayComponent(vv.inco_term_id, shp_incoterm_array)) {
          incoTableData
            .filter((data) => data.inco_term_id == vv.inco_term_id)
            .map((v1, k1) => {
              let dArray = JSON.parse(JSON.stringify(v1.delivery_array))
              dArray.push(vv.delivery_no)
              v1.qty = v1.qty + getDeliveryQuantity(vv.invoice_net_quantity, vv.invoice_uom)
              v1.amount =
                v1.amount +
                freightamountfinder(
                  vv.inco_term_id,
                  tripInfo[0]?.trip_sheet_info.freight_rate_per_tone,
                  getDeliveryQuantity(vv.invoice_net_quantity, vv.invoice_uom)
                )
              v1.delivery_array = dArray
              dArray = []
            })
        } else {
          shp_incoterm_array.push(vv.inco_term_id)

          let valarray = {}

          let old_array = []
          old_array.push(vv.delivery_no)
          valarray.inco_term_id = vv.inco_term_id
          valarray.delivery_array = old_array
          valarray.do = vv.delivery_no
          valarray.inco_term = getIncoTermNameByCode(vv.inco_term_id)
          valarray.qty = getDeliveryQuantity(vv.invoice_net_quantity, vv.invoice_uom)
          valarray.amount = freightamountfinder(
            vv.inco_term_id,
            tripInfo[0]?.trip_sheet_info.freight_rate_per_tone,
            getDeliveryQuantity(vv.invoice_net_quantity, vv.invoice_uom)
          )
          //console.log(valarray.amount, 'incoTableData-valarray.amount')
          incoTableData.push(valarray)
        }
      })
      setIdt(incoTableData)
      values.incoterm_freight_info = JSON.stringify(incoTableData)
      //console.log(incoTableData, 'incoTableData1')
    } else {
      //console.log('incoTableData2')
      setIdt([])
      values.incoterm_freight_info = ''
      //console.log(tripInfo, 'incoTableData21')
    }
  }, [incoTermData, tripInfo.shipment_info])

  /* ===== User Inco Terms Declaration End ===== */

  /* ===================== Vehicle Assignment Details (FG-SALES) Table Data Part Start ===================== */

  const changeVadTableItem = (event, child_property_name, parent_index, child_index) => {
    let getData = event.target.value
    //console.log(getData, 'getData')

    if (child_property_name == 'unloading_charges') {
      getData = event.target.value.replace(/\D/g, '')
    }

    const shipment_parent_info = JSON.parse(JSON.stringify(shipmentInfo))

    if (child_property_name == 'fj_pod_copy') {
      let dataNeeded = {}
      dataNeeded.parent = parent_index
      dataNeeded.child = child_index
      imageCompress(event, dataNeeded, 'fjsales')
    } else {
      shipment_parent_info[parent_index].shipment_child_info[child_index][
        `${child_property_name}_input`
      ] = getData

      if (child_property_name !== 'defect_type') {
        shipment_parent_info[parent_index].shipment_child_info[child_index][
          `${child_property_name}_validated`
        ] = !!getData
      }
    }

    //console.log(shipment_parent_info)
    setShipmentInfo(shipment_parent_info)
  }

  const changeVadHireTableItem = (event, child_property_name, parent_index, child_index) => {
    let getData01 = event.target.value
    //console.log(getData01, 'getData')

    if (child_property_name == 'unloading_charges') {
      getData01 = event.target.value.replace(/\D/g, '')
    }

    const shipment_hire_parent_info = JSON.parse(JSON.stringify(shipmentInfo))

    shipment_hire_parent_info[parent_index].shipment_child_info[child_index][
      `${child_property_name}_input`
    ] = getData01

    if (child_property_name !== 'defect_type') {
      shipment_hire_parent_info[parent_index].shipment_child_info[child_index][
        `${child_property_name}_validated`
      ] = !!getData01
    }

    //console.log(shipment_hire_parent_info)
    setShipmentInfo(shipment_hire_parent_info)
  }

  //console.log(shipmentInfo)

  const vadHireDataUpdate = (original, input) => {
    return original === undefined ? input : original
  }

  const vadDataUpdate = (original, input) => {
    // return input === undefined ? original : input
    return input === undefined ? original : input
  }

  /* ===================== Vehicle Assignment Details Table Data Part End ===================== */

  /* ===================== RJSO Creation Table Data Part Start ===================== */

  const changeRjsoTableItem = (event, child_property_name, parent_index) => {
    let getData1 = event.target.value

    if (event.target.type === 'file') {
      // getData1 = event.target.files[0]
      getData1 = convertJsonSTringify(event.target.files[0])
    }

    if (child_property_name == 'unloading_charges') {
      getData1 = event.target.value.replace(/\D/g, '')
    }

    const rjso_parent_info = JSON.parse(JSON.stringify(rjsoInfo))

    if (child_property_name == 'rj_pod_copy') {
      imageCompress(event, parent_index, 'rjso')
    } else {
      rjso_parent_info[parent_index][`${child_property_name}_input`] = getData1

      if (child_property_name !== 'defect_type') {
        rjso_parent_info[parent_index][`${child_property_name}_validated`] = !!getData1
      }
    }

    // //console.log(shipment_parent_info)
    setRjsoInfo(rjso_parent_info)
  }

  // //console.log(rjsoInfo)
  const [fasttagData, setFasttagData] = useState([])
  const [fasttagAmount, setFasttagAmount] = useState(0)
  const rjsoDataUpdate = (original, input) => {
    return input === undefined ? original : input
  }

  /* ===================== RJSO Creation Table Data Part End ===================== */

  /* ===================== All Expenses Capture Part Start  ======================= */
  const [expensesData, setExpensesData] = useState({})
  const [formExpensesData, setFormExpensesData] = useState([])
  const [totalTollAmount, setTotalTollAmount] = useState(0)
  const [totalLocalBataAmount, setTotalLocalBataAmount] = useState(0)
  const [totalHaltBataAmount, setTotalHaltBataAmount] = useState(0)
  const [totalBata, setTotalBata] = useState(0)
  const [totalMunicipalCharges, setTotalMunicipalCharges] = useState(0)
  const [totalPortEntryFee, setTotalPortEntryFee] = useState(0)
  const [totalMiscCharges, setTotalMiscCharges] = useState(0)
  const [totalFineAmount, setTotalFineAmount] = useState(0)
  const [totalSubDeliveryCharges, setTotalSubDeliveryCharges] = useState(0)
  const [totalMaintenanceCost, setTotalMaintenanceCost] = useState(0)
  const [totalLoadingCharges, setTotalLoadingCharges] = useState(0)
  const [totalUnloadingCharges, setTotalUnloadingCharges] = useState(0)
  const [totalTarpaulinCharges, setTotalTarpaulinCHarges] = useState(0)
  const [totalWeighmentCharges, setTotalWeighmentCharges] = useState(0)
  const [totalFreightCharges, setTotalFreightCharges] = useState(0)
  const [totalLowTonageCharges, setTotalLowTonageCharges] = useState(0)
  const [totalLowTonnageCharges, setTotalLowTonnageCharges] = useState(0)
  const [totalStockDiversionReturnCharges, setTotalStockDiversionReturnCharges] = useState(0)
  const [totalHaltDays, setTotalHaltDays] = useState(0)
  const [totalHaltingCharges, setTotalHaltingCharges] = useState(0)
  const [totalCharges, setTotalCharges] = useState(0)
  const [totalChargesOwn, setTotalChargesOwn] = useState(0)
  const [totalChargesHire, setTotalChargesHire] = useState(0)
  const [rvTotalValuesBP, setRvTotalValuesBP] = useState([])
  const [expenseClosureApproval, setExpenseClosureApproval] = useState(false)
  const vendorCodeFinder = (data) => {
    let v_code = ''
    if (data.Parking_Vendor_Info) {
      v_code = data.Parking_Vendor_Info.vendor_code
    } else {
      v_code = data.vendor_info.vendor_code
    }
    return v_code
  }
  console.log(tripInfo, 'tripInfo-totalChargesFinder')
  const [freightCharges, setFreightCharges] = useState(0)
  useEffect(() => {
    if (Number(tripInfo?.vehicle_info?.vehicle_type_id) === 22 && !values.freight_charges) {
      const computedFreight =
        Number(tripInfo?.vehicle_assignment?.[0]?.billed_qty || 0) *
        Number(tripInfo?.tripsheet_info?.trip_vehicle_route?.freight_rate || 0)

      if (computedFreight > 0) {
        values.freight_charges = computedFreight // seed the shared form state
      }
    }
  }, [tripInfo])
  const totalChargesFinder = () => {
    let total_charge = 0
    if (Number(tripInfo?.vehicle_info?.vehicle_type_id) === 22) {
      total_charge =
        Number(values.freight_charges || 0) +
        Number(totalTollAmount || 0) +
        Number(totalUnloadingCharges || 0) +
        Number(totalWeighmentCharges || 0) +
        Number(totalHaltingCharges || 0) -
        Number(totalStockDiversionReturnCharges || 0) +
        Number(totalLowTonnageCharges || 0) +
        Number(totalSubDeliveryCharges || 0)
    } else {
      total_charge =
        Number(totalTollAmount ? totalTollAmount : 0) +
        Number(totalLocalBataAmount ? totalLocalBataAmount : 0) +
        Number(totalHaltBataAmount ? totalHaltBataAmount : 0) +
        Number(totalMunicipalCharges ? totalMunicipalCharges : 0) +
        Number(totalPortEntryFee ? totalPortEntryFee : 0) +
        Number(totalMiscCharges ? totalMiscCharges : 0) +
        Number(totalFineAmount ? totalFineAmount : 0) +
        Number(totalSubDeliveryCharges ? totalSubDeliveryCharges : 0) +
        Number(totalMaintenanceCost ? totalMaintenanceCost : 0) +
        Number(totalLoadingCharges ? totalLoadingCharges : 0) +
        Number(totalUnloadingCharges ? totalUnloadingCharges : 0) +
        Number(totalTarpaulinCharges ? totalTarpaulinCharges : 0) +
        Number(totalWeighmentCharges ? totalWeighmentCharges : 0) +
        Number(totalLowTonageCharges ? totalLowTonageCharges : 0) +
        Number(totalFreightCharges ? totalFreightCharges : 0) +
        Number(totalHaltingCharges ? totalHaltingCharges : 0) +
        Number(totalStockDiversionReturnCharges ? totalStockDiversionReturnCharges : 0)
    }

    //console.log(total_charge)

    return total_charge
  }

  useEffect(() => {
    // console.log(fasttagAmount, 'fasttagAmount')
    // console.log(totalTollAmount, 'totalTollAmount')
    // console.log(totalHaltBataAmount, 'totalHaltBataAmount')
    // console.log(totalLocalBataAmount, 'totalLocalBataAmount')
    // console.log(totalBata, 'totalBata')
    // console.log(totalMunicipalCharges, 'totalMunicipalCharges')
    // console.log(totalPortEntryFee, 'totalPortEntryFee')
    // console.log(totalMiscCharges, 'totalMiscCharges')
    // console.log(totalFineAmount, 'totalFineAmount')
    // console.log(totalSubDeliveryCharges, 'totalSubDeliveryCharges')
    // console.log(totalMaintenanceCost, 'totalMaintenanceCost')
    // console.log(totalLoadingCharges, 'totalLoadingCharges')
    // console.log(totalUnloadingCharges, 'totalUnloadingCharges')
    // console.log(totalTarpaulinCharges, 'totalTarpaulinCharges')
    // console.log(totalWeighmentCharges, 'totalWeighmentCharges')
    // console.log(totalLowTonageCharges, 'totalLowTonageCharges - Own')
    // console.log(totalLowTonnageCharges, 'totalLowTonnageCharges - Hire')
    // console.log(totalStockDiversionReturnCharges, 'totalStockDiversionReturnCharges')
    // console.log(totalCharges, 'totalCharges')
    //setTotalCharges(totalChargesFinder())
    if (Number(tripInfo?.vehicle_info?.vehicle_type_id) === 22) {
      setTotalCharges(totalChargesCalculator(values))
    } else {
      setTotalCharges(totalChargesFinder())
    }
  }, [
    fasttagAmount,
    totalTollAmount,
    totalHaltBataAmount,
    totalLocalBataAmount,
    totalBata,
    totalMunicipalCharges,
    totalPortEntryFee,
    totalMiscCharges,
    totalFineAmount,
    totalSubDeliveryCharges,
    totalMaintenanceCost,
    totalLoadingCharges,
    totalUnloadingCharges,
    totalTarpaulinCharges,
    totalWeighmentCharges,
    totalFreightCharges,
    totalHaltingCharges,
    totalLowTonageCharges,
    totalLowTonnageCharges,
    totalStockDiversionReturnCharges,
    values.freight_charges,
  ])

  const totalAdditionalChargesCalculator = (data, total) => {
    let freight_charge = Number(values.freight_charges || 0)
    let additional_charge = Number(total) - freight_charge
    //console.log(freight_charge, 'totalAdditionalChargesCalculator-freight_charge')
    //console.log(additional_charge, 'totalAdditionalChargesCalculator-additional_charge')
    //console.log(total, 'totalAdditionalChargesCalculator-total_charge')

    return additional_charge
  }

  const totalChargesCalculator = (data) => {
    let total_charge = 0
    let unload_charge = 0
    Object.keys(tripInfo).length
    //console.log(tripInfo, 'totalChargesCalculator-totalChargesCalculator-rjso')
    if (Number(tripInfo?.vehicle_info?.vehicle_type_id) === 22) {
      total_charge =
        Number(values.freight_charges || 0) + // ✅ main freight
        Number(values.toll_amount || 0) +
        Number(values.unloading_charges || 0) +
        Number(values.sub_delivery_charges || 0) +
        Number(values.weighment_charges || 0) +
        Number(values.low_tonnage_charges || 0) +
        Number(values.halting_charges || 0) -
        Number(values.diversion_return_charges || 0) // ✅ deduction
    } else {
      unload_charge =
        Number(ExpenseUnloadingCharges) != 0
          ? Number(ExpenseUnloadingCharges)
          : Number(values.unloading_charges)
      // : settlementAvailable
      // ? Number(values.unloading_charges)
      // : 0
      //console.log(unload_charge, 'unload_charge')
      total_charge =
        Number(fasttagAmount ? fasttagAmount : 0) +
        Number(data.toll_amount ? data.toll_amount : 0) +
        Number(data.halt_bata_amount ? data.halt_bata_amount : 0) +
        Number(data.local_bata_amount ? data.local_bata_amount : 0) +
        Number(data.bata ? data.bata : 0) +
        Number(data.municipal_charges ? data.municipal_charges : 0) +
        Number(data.port_entry_fee ? data.port_entry_fee : 0) +
        Number(data.misc_charges ? data.misc_charges : 0) +
        Number(data.fine_amount ? data.fine_amount : 0) +
        Number(data.sub_delivery_charges ? data.sub_delivery_charges : 0) +
        Number(data.maintenance_cost ? data.maintenance_cost : 0) +
        Number(data.loading_charges ? data.loading_charges : 0) +
        // Number(data.unloading_charges ? data.unloading_charges : 0) +
        Number(data.tarpaulin_charges ? data.tarpaulin_charges : 0) +
        Number(data.weighment_charges ? data.weighment_charges : 0) +
        Number(data.low_tonage_charges ? data.low_tonage_charges : 0) +
        Number(data.diversion_return_charges ? data.diversion_return_charges : 0) +
        Number(rvTotalValuesBP.rvTotalDieselAmount ? rvTotalValuesBP.rvTotalDieselAmount : 0) +
        Number(urvTotalAmountFinder ? urvTotalAmountFinder : 0) +
        unload_charge
    } 

    //console.log(total_charge, 'total_charge-expenses')

    return total_charge
  }

  useEffect(() => {
    if (tripInfo?.vehicle_info?.vehicle_type_id == 22 && Number(totalChargesHire) > 0) {
      console.log('Approval Required')
      setExpenseClosureApproval(true)
    } else {
      console.log('Approval Not Required')
      setExpenseClosureApproval(false)
    }
  }, [tripInfo?.vehicle_info?.vehicle_type_id, totalChargesHire])

  useEffect(() => {
    if (Object.keys(tripInfo).length > 0) {
      setTotalChargesOwn(totalChargesCalculator(values))
      setTotalChargesHire(totalChargesCalculator(values))
    }
  }, [
    values,
    tripInfo,
    tripsettlementData,
    rvTotalValuesBP,
    values.unloading_charges,
    ExpenseUnloadingCharges,
    fasttagAmount,
    stoTableDataFCI, 
  ])

  useEffect(() => {
    let lp_trip_data = [{ shipmentInfo }, { rjsoInfo }, { stoTableData }, { stoTableDataRMSTO }]

    setTotalTollAmount(ExpenseCalculations(lp_trip_data, 'toll_amount'))
    setTotalLocalBataAmount(ExpenseCalculations(lp_trip_data, 'local_bata_amount'))
    setTotalHaltBataAmount(ExpenseCalculations(lp_trip_data, 'halt_bata_amount'))
    setTotalBata(ExpenseCalculations(lp_trip_data, 'bata'))
    setTotalMunicipalCharges(ExpenseCalculations(lp_trip_data, 'municipal_charges'))
    setTotalPortEntryFee(ExpenseCalculations(lp_trip_data, 'port_entry_fee'))
    setTotalMiscCharges(ExpenseCalculations(lp_trip_data, 'misc_charges'))
    setTotalFineAmount(ExpenseCalculations(lp_trip_data, 'fine_amount'))
    setTotalSubDeliveryCharges(ExpenseCalculations(lp_trip_data, 'sub_delivery_charges'))
    setTotalMaintenanceCost(ExpenseCalculations(lp_trip_data, 'maintenance_cost'))
    setTotalLoadingCharges(ExpenseCalculations(lp_trip_data, 'loading_charges'))
    setTotalUnloadingCharges(ExpenseCalculations(lp_trip_data, 'unloading_charges'))
    setTotalTarpaulinCHarges(ExpenseCalculations(lp_trip_data, 'tarpaulin_charges'))
    setTotalWeighmentCharges(ExpenseCalculations(lp_trip_data, 'weighment_charges'))
    if (Number(tripInfo?.vehicle_info?.vehicle_type_id) === 22) {
      // Hire
      setTotalLowTonnageCharges(ExpenseCalculations(lp_trip_data, 'low_tonnage_charges'))
      setTotalLowTonageCharges(0)
    } else {
      // Own
      setTotalLowTonageCharges(ExpenseCalculations(lp_trip_data, 'low_tonage_charges'))
      setTotalLowTonnageCharges(0)
    }

    setTotalStockDiversionReturnCharges(
      ExpenseCalculations(lp_trip_data, 'diversion_return_charges')
    )
    setTotalHaltDays(ExpenseCalculations(lp_trip_data, 'halt_days'))
    setTotalHaltingCharges(ExpenseCalculations(lp_trip_data, 'halting_charges'))
    setTotalFreightCharges(ExpenseCalculations(lp_trip_data, 'freight_charges'))
    if (Number(tripInfo?.vehicle_info?.vehicle_type_id) === 22) {
      // Hire
      setTotalLowTonnageCharges(ExpenseCalculations(lp_trip_data, 'low_tonnage_charges'))
    } else {
      // Own
      setTotalLowTonageCharges(ExpenseCalculations(lp_trip_data, 'low_tonage_charges'))
    }
  }, [
    shipmentInfo,
    rjsoInfo,
    stoTableData,
    stoTableDataRMSTO,
    stoTableDataFGSTO,
    totalTollAmount,
    totalLocalBataAmount,
    totalLocalBataAmount,
    totalBata,
    totalMunicipalCharges,
    totalPortEntryFee,
    totalMiscCharges,
    totalFineAmount,
    totalFreightCharges,
    totalHaltingCharges,
    totalSubDeliveryCharges,
    totalMaintenanceCost,
    totalLoadingCharges,
    totalUnloadingCharges,
    totalTarpaulinCharges,
    totalWeighmentCharges,
    totalLowTonageCharges,
    totalLowTonnageCharges,
    totalStockDiversionReturnCharges,
  ])

  /* ================= FGSALES ========================================= */

  const onChangeFgsalesExpenseItem = (event, property_name, parent_index) => {
    let getData5 = event.target.value.replace(/\D/g, '')

    const fgsales_expenses_parent_info = JSON.parse(JSON.stringify(shipmentInfo))

    fgsales_expenses_parent_info[parent_index][property_name] = getData5
    setShipmentInfo(fgsales_expenses_parent_info)
    //console.log(fgsales_expenses_parent_info)
  }

  const vadDataUpdateForExpenses = (value) => {
    return !value ? '' : value
  }

  /* ================= RJSO ========================================= */

  const onChangeRjsoExpenseItem = (event, property_name, parent_index) => {
    let getData6 = event.target.value.replace(/\D/g, '')

    const rjso_expenses_parent_info = JSON.parse(JSON.stringify(rjsoInfo))

    rjso_expenses_parent_info[parent_index][property_name] = getData6
    setRjsoInfo(rjso_expenses_parent_info)
    //console.log(rjsoInfo)
  }

  const rjsoDataUpdateForExpenses = (value) => {
    return !value ? '' : value
  }

  /* ================= FGSTO ========================================= */

  const onChangeFgstoExpenseItem = (event, property_name, parent_index) => {
    let getData7 = event.target.value.replace(/\D/g, '')

    const fgsto_expenses_parent_info = JSON.parse(JSON.stringify(stoTableData))

    fgsto_expenses_parent_info[parent_index][property_name] = getData7
    setStoTableData(fgsto_expenses_parent_info)
  }

  const fgstoDataUpdateForExpenses = (value) => {
    return !value ? '' : value
  }

  /* ================= RMSTO ========================================= */

  const onChangeRmstoExpenseItem = (event, property_name, parent_index) => {
    let getData8 = event.target.value.replace(/\D/g, '')

    const rmsto_expenses_parent_info = JSON.parse(JSON.stringify(stoTableDataRMSTO))

    rmsto_expenses_parent_info[parent_index][property_name] = getData8
    setStoTableDataRMSTO(rmsto_expenses_parent_info)
  }

  const rmstoDataUpdateForExpenses = (value) => {
    return !value ? '' : value
  }

  {
    /* Hire Vehicles Part */
  }

  /* ===================== All Expenses Capture Part End  ======================= */
  /* ===================== FG-STO Needed Constants Part Start  ======================= */

  const [deliveryDelete, setDeliveryDelete] = useState(false)
  const [stoPodVisible, setStoPodVisible] = useState(false)
  const [stoFileUploadVisible, setStoFileUploadVisible] = useState(true)
  const [stoDeliveryInvalid, setStoDeliveryInvalid] = useState(true)

  const [stoValues, setStoValues] = useState(TripsheetClosureConstants.stoInitialState)

  const [isStoEditMode, setIsStoEditMode] = useState(false)
  const [stoEditIndex, setStoEditIndex] = useState(-1)

  const {
    sto_delivery_number,
    sto_po_number,
    sto_delivery_division,
    sto_from_location,
    sto_to_location,
    sto_delivery_quantity,
    sto_freight_amount,
    sto_delivery_date_time,
    sto_pod_copy,
    sto_delivery_driver_name,
    sto_delivery_expense_capture,
  } = TripsheetClosureConstants.stoStateVariables

  const [filePath, setFilePath] = useState()
  const [deliveryNoDelete, setDeliveryNoDelete] = useState('')
  const [deliveryNoDeleteIndex, setDeliveryNoDeleteIndex] = useState('')

  /* ===================== FG-STO Needed Constants Part End  ======================= */

  /* ===================== RM-STO Needed Constants Part Start  ======================= */

  const [deliveryDeleteRMSTO, setDeliveryDeleteRMSTO] = useState(false)
  const [stoPodVisibleRMSTO, setStoPodVisibleRMSTO] = useState(false)
  const [stoFileUploadVisibleRMSTO, setStoFileUploadVisibleRMSTO] = useState(true) 

  const [stoValuesRMSTO, setStoValuesRMSTO] = useState(
    TripsheetClosureConstants.stoInitialStateRMSTO
  )
 
  const [stoValuesFGSTO, setStoValuesFGSTO] = useState(
    TripsheetClosureConstants.stoInitialStateFGSTO
  )

  const [isStoEditModeRMSTO, setIsStoEditModeRMSTO] = useState(false)
  const [stoEditIndexRMSTO, setStoEditIndexRMSTO] = useState(-1)

  const {
    sto_delivery_number_rmsto,
    sto_po_number_rmsto,
    sto_delivery_division_rmsto,
    sto_from_location_rmsto,
    sto_to_location_rmsto,
    sto_delivery_quantity_rmsto,
    sto_freight_amount_rmsto,
    sto_delivery_date_time_rmsto,
    sto_pod_copy_rmsto,
    sto_delivery_driver_name_rmsto,
    sto_delivery_expense_capture_rmsto,
  } = TripsheetClosureConstants.stoStateVariablesRMSTO

  const [filePathRMSTO, setFilePathRMSTO] = useState()
  const [deliveryNoDeleteRMSTO, setDeliveryNoDeleteRMSTO] = useState('')
  const [deliveryNoDeleteIndexRMSTO, setDeliveryNoDeleteIndexRMSTO] = useState('')

  /* ===================== RM-STO Needed Constants Part End  ======================= */

  const [fgsto_tripAddonAvailability, setfgsto_TripAddonAvailability] = useState(2)
  const [rmsto_tripAddonAvailability, setrmsto_TripAddonAvailability] = useState(2)
  const [fgstoAvailable, setFgstoAvailable] = useState(false)
  const [rmstoAvailable, setRmstoAvailable] = useState(false) 

  const [differenceKMFinder, setDifferenceKMFinder] = useState('-')
  const [tripIdleHours, setTripIdleHours] = useState('')
  const [differenceMileageFinder, setDifferenceMileageFinder] = useState('-')

  const [dieselVendorName, setDieselVendorName] = useState('')

  const [shipmentChildInfo, setShipmentChildInfo] = useState([])

  const [shipmentNumber, setShipmentNumber] = useState('')
  const REQ = () => <span className="text-danger"> * </span>

  const fgstoaddonTabEnableCheck = (e) => {
    let availability_fgsto = e.target.value
    setfgsto_TripAddonAvailability(availability_fgsto)
    //console.log(availability_fgsto)
    //console.log(tabFGSTOSuccess, 'tabFGSTOSuccess')
    if (availability_fgsto == 1) {
      setFgstoAvailable(true)
      setTabFGSTOSuccess(false)
    } else {
      setStoTableData([])
      setFgstoAvailable(false)
    }
  }

  const rmstoaddonTabEnableCheck = (e) => {
    let availability_rmsto = e.target.value
    setrmsto_TripAddonAvailability(availability_rmsto)
    if (availability_rmsto == 1) {
      setRmstoAvailable(true)
      setTabRMSTOSuccess(false)
    } else {
      setStoTableDataRMSTO([])
      setRmstoAvailable(false)
    }
  }

  /* ===== Unregistered Vendor Constants, Functions, Calculations Part Start  =========== */

  const [urvValues, setUrvValues] = useState(TripsheetClosureConstants.InitialURVValues)
  const [rvValues, setRvValues] = useState(TripsheetClosureConstants.InitialRVValues)
  const [rvTotalValues, setRvTotalValues] = useState([])
  // const [rvTotalValuesBP, setRvTotalValuesBP] = useState([])
  const [urvTotalAmountFinder, seturvTotalAmountFinder] = useState(0)
  const [tdlDieselInfo, setTdlDieselInfo] = useState(0)
  const [arplDieselInfo, setArplDieselInfo] = useState(0)
  const [tdaDieselInfo, setTdaDieselInfo] = useState(0)

  const onChangeURVItem = (event) => {
    let urv_value_change = event.target.value
    if (event.target.name == 'urvDieselAmount') {
      urv_value_change = event.target.value.replace(/\D/g, '')
    } else if (event.target.name == 'urvName') {
      urv_value_change = event.target.value.replace(/[^a-zA-Z ]/gi, '')
    } else if (event.target.name == 'urvDieselRate' || event.target.name == 'urvDieselLiter') {
      urv_value_change = event.target.value
        .replace(/[^0-9^\.]+/g, '')
        .replace('.', '$#$')
        .replace(/\./g, '')
        .replace('$#$', '.')
        .replace(/^0+/, '')
    }

    let updatedURVInputs = { ...urvValues, [event.target.name]: urv_value_change }
    setUrvValues(updatedURVInputs)

    //console.log(updatedURVInputs.urvDieselLiter)
    //console.log(updatedURVInputs.urvDieselRate)
    //console.log(urvTotalAmountFinder)

    if (updatedURVInputs.urvDieselLiter) {
      setTdlDieselInfo(rvTotalValues.rvTotalDieselLiter + Number(updatedURVInputs.urvDieselLiter))
    } else {
      setTdlDieselInfo(rvTotalValuesBP.rvTotalDieselLiter)
    }

    if (updatedURVInputs.urvDieselRate) {
      if (diApprovalCompleted) {
        setArplDieselInfo(
          (rvTotalValues.rvAverageRatePerLiter + Number(updatedURVInputs.urvDieselRate)) / 2
        )
      } else {
        setArplDieselInfo(
          rvTotalValues.rvAverageRatePerLiter + Number(updatedURVInputs.urvDieselRate)
        )
      }
      // setArplDieselInfo(
      //   (rvTotalValues.rvAverageRatePerLiter + Number(updatedURVInputs.urvDieselRate)) / 2
      // )
    } else {
      setArplDieselInfo(rvTotalValuesBP.rvAverageRatePerLiter)
    }

    if (urvTotalAmountFinder) {
      setTdaDieselInfo(rvTotalValues.rvTotalDieselAmount + Number(urvTotalAmountFinder))
    } else {
      setTdaDieselInfo(rvTotalValuesBP.rvTotalDieselAmount)
    }

    // if (
    //   urvTotalAmountFinder != 0 &&
    //   updatedURVInputs.urvDieselLiter &&
    //   updatedURVInputs.urvDieselRate
    // ) {
    //   //console.log('123')
    //   totalDieselInfoCalculationAfterEnrouteDiesel(
    //     updatedURVInputs.urvDieselLiter,
    //     updatedURVInputs.urvDieselRate,
    //     urvTotalAmountFinder
    //   )
    // } else {
    //   //console.log('456')
    //   setRvValues(rvTotalValuesBP)
    // }

    if (updatedURVInputs.urvDieselLiter && updatedURVInputs.urvDieselRate) {
      seturvTotalAmountFinder(
        Math.round(updatedURVInputs.urvDieselLiter * updatedURVInputs.urvDieselRate)
      )
    } else {
      seturvTotalAmountFinder(0)
    }
  }

  const totalDieselInfoCalculation = (collection_data) => {
    //console.log(dieselCollectionInfo)
    let Total_Diesel_Liter = 0
    let Total_Rate_Per_Liter = 0
    let Total_Diesel_Amount = 0

    let needed_data = []
    needed_data.push(dieselCollectionInfo)
    //console.log(needed_data)
    needed_data.map((datan, index1) => {
      datan.map((data, index) => {
        //console.log(data.no_of_ltrs, 'no_of_ltrs', index)
        //console.log(data.rate_of_ltrs, 'rate_of_ltrs', index)
        //console.log(data.total_amount, 'total_amount', index)
        Total_Diesel_Liter = Total_Diesel_Liter + Number(data.no_of_ltrs)
        Total_Rate_Per_Liter = Total_Rate_Per_Liter + Number(data.rate_of_ltrs)
        Total_Diesel_Amount = Total_Diesel_Amount + Number(data.total_amount)
      })
    })

    setTdlDieselInfo(Total_Diesel_Liter)
    if (diApprovalCompleted) {
      setArplDieselInfo(Total_Rate_Per_Liter / dieselCollectionInfo.length)
    } else {
      setArplDieselInfo(Total_Rate_Per_Liter)
    }

    setTdaDieselInfo(Total_Diesel_Amount)
    //console.log(Total_Diesel_Liter)
    //console.log(Total_Rate_Per_Liter)
    //console.log(Total_Diesel_Amount)

    const total_diesel_values = {
      rvTotalDieselLiter: Total_Diesel_Liter,
      rvAverageRatePerLiter: Total_Rate_Per_Liter / dieselCollectionInfo.length,
      rvTotalDieselAmount: Total_Diesel_Amount,
    }

    setRvTotalValues(total_diesel_values)
    setRvTotalValuesBP(total_diesel_values)
    setRvValues(total_diesel_values)
  }

  const totalDieselInfoCalculationAfterEnrouteDiesel = (liter, rate, amount) => {
    //console.log(rvTotalValues)
    let Total_Diesel_Liter1 = rvTotalValues.rvTotalDieselLiter + Number(liter)
    let Total_Rate_Per_Liter1 = (rvTotalValues.rvAverageRatePerLiter + Number(rate)) / 2
    let Total_Diesel_Amount1 = rvTotalValues.rvTotalDieselAmount + Number(amount)

    // let needed_data = []
    // needed_data.push(dieselCollectionInfo)
    // //console.log(needed_data)
    // needed_data.map((datan, index1) => {
    //   datan.map((data, index) => {
    //     //console.log(data.no_of_ltrs, 'no_of_ltrs', index)
    //     //console.log(data.rate_of_ltrs, 'rate_of_ltrs', index)
    //     //console.log(data.total_amount, 'total_amount', index)
    //     Total_Diesel_Liter1 = Total_Diesel_Liter1 + Number(data.no_of_ltrs)
    //     Total_Rate_Per_Liter1 = Total_Rate_Per_Liter1 + Number(data.rate_of_ltrs)
    //     Total_Diesel_Amount1 = Total_Diesel_Amount1 + Number(data.total_amount)
    //   })
    // })

    //console.log(Total_Diesel_Liter1)
    //console.log(Total_Rate_Per_Liter1)
    //console.log(Total_Diesel_Amount1)

    const total_diesel_values1 = {
      rvTotalDieselLiter: Total_Diesel_Liter1,
      rvAverageRatePerLiter: Total_Rate_Per_Liter1 / 2,
      rvTotalDieselAmount: Total_Diesel_Amount1,
    }

    // setRvTotalValues(total_diesel_values)
    setRvValues(total_diesel_values1)
  }

  /* ===== Unregistered Vendor Constants, Functions, Calculations Part End  =========== */

  /* ===================== FG-STO Needed Functions Part Start  ======================= */
  const onStoSubmitCancelBtn = () => {
    setStoDeliveryEdit(false)
    setStoFileUploadVisible(true)
    setStoValues(TripsheetClosureConstants.stoInitialState)
  }

  const stoResetEdit = () => {
    setIsStoEditMode(false)
    setStoDeliveryEdit(false)
    setStoEditIndex(-1)
    setStoFileUploadVisible(true)
    setStoValues(TripsheetClosureConstants.stoInitialState)
  }

  const stoPodUploadResetEdit = () => {
    //console.log(stoValues.sto_pod_copy)
    stoValues.sto_pod_copy = ''
    setStoFileUploadVisible(true)
  }

  const onStoEditcallback = (index) => {
    setStoDeliveryEdit(true)
    setIsStoEditMode(true)
    //console.log(index)
    //console.log(deliveryNoDelete)
    setStoEditIndex(index)
    setStoFileUploadVisible(false)
    //console.log(stoTableData[index])
    setStoValues(stoTableData[index])
  }

  const removeStoFields = (index) => {
    setDeliveryDelete(false)
    setStoDeliveryEdit(false)
    const updatedData = [...stoTableData]
    updatedData.splice(index, 1)
    setStoTableData(updatedData)
    setDeliveryNoDelete('')
    setDeliveryNoDeleteIndex('')
  }

  const onStoDeleteCallback = (index) => {
    //console.log(index)
    setDeliveryNoDelete(stoTableData[index].sto_delivery_number)
    setDeliveryNoDeleteIndex(index)
    setDeliveryDelete(true)
  }

  const onStoSubmitBtn = () => {
    let updatedTable = []
    if (addEnable(stoValues)) {
      if (!isStoEditMode) {
        updatedTable = [...stoTableData, stoValues]
      } else {
        const prevTable = [...stoTableData]
        prevTable[stoEditIndex] = stoValues
        updatedTable = prevTable
      }
      setStoTableData(updatedTable)
      setStoFileUploadVisible(true)
      stoResetEdit()
      //console.log(stoTableData, 'after stoTableData update/edit')
    } else {
      toast.warning('Please Fill All The Required Fields..')
    }
  }

  const addEnable = (data) => {
    //console.log(data)
    var hire_vehicle_check =
      tripInfo.tripsheet_info && tripInfo.tripsheet_info.trip_vehicle_info && tripInfo.tripsheet_info.trip_vehicle_info.vehicle_type_id == 22 ? true : false
    //console.log(hire_vehicle_check, 'hire_vehicle_check')
    if (
      data.sto_delivery_number != '' &&
      data.sto_po_number != '' &&
      data.sto_delivery_division != '' &&
      data.sto_from_location != '' &&
      data.sto_to_location != '' &&
      data.sto_delivery_quantity != '' &&
      data.sto_freight_amount != ''
      // &&
      // data.sto_delivery_date_time != '' &&
      // data.sto_pod_copy != ''
      //  && (data.sto_delivery_driver_name != '' || hire_vehicle_check)
    ) {
      setStoDeliveryInvalid(false)
      return true
    } else {
      setStoDeliveryInvalid(true)
      return false
    }
  }

  /* ===================== FG-STO Needed Functions Part End  ======================= */

  /* ===================== RM-STO Needed Functions Part Start  ======================= */
  const onStoSubmitCancelBtnRMSTO = () => {
    setStoDeliveryEditRMSTO(false)
    setStoFileUploadVisibleRMSTO(true)
    setStoValuesRMSTO(TripsheetClosureConstants.stoInitialStateRMSTO)
  }

  const stoResetEditRMSTO = () => {
    setStoDeliveryEditRMSTO(false)
    setIsStoEditModeRMSTO(false)
    setStoEditIndexRMSTO(-1)
    setStoFileUploadVisibleRMSTO(true)
    setStoValuesRMSTO(TripsheetClosureConstants.stoInitialStateRMSTO)
  }

  const onStoDeleteCallbackRMSTO = (index) => {
    //console.log(index)
    setDeliveryNoDeleteRMSTO(stoTableDataRMSTO[index].sto_delivery_number_rmsto)
    setDeliveryNoDeleteIndexRMSTO(index)
    setDeliveryDeleteRMSTO(true)
  }

  const onStoSubmitBtnRMSTO = () => {
    let updatedTable = []
    //console.log(stoValuesRMSTO)
    if (addEnableRMSTO(stoValuesRMSTO)) {
      if (!isStoEditModeRMSTO) {
        updatedTable = [...stoTableDataRMSTO, stoValuesRMSTO]
      } else {
        const prevTable = [...stoTableDataRMSTO]
        prevTable[stoEditIndexRMSTO] = stoValuesRMSTO
        updatedTable = prevTable
      }
      setStoTableDataRMSTO(updatedTable)
      setStoFileUploadVisibleRMSTO(true)
      stoResetEditRMSTO()
      //console.log(stoTableDataRMSTO, 'after stoTableDataRMSTO update/edit')
    } else {
      toast.warning('Please Fill All The Required Fields..')
    }
  }

  const hire_total_freight = (hire_data) => {
    let freight = 0
    if (hire_data.length > 0) {
      hire_data.map((val, ind) => {
        freight += Number(parseFloat(val.sto_delivery_quantity_rmsto).toFixed(2))
      })
    }

    return freight
  }

  /* For SAP FGSTO Data */
  const hire_total_freight1 = (hire_data) => {
    let freight = 0
    if (hire_data.length > 0) {
      hire_data.map((val, ind) => {
        freight += Number(parseFloat(val.sto_delivery_quantity_fgsto).toFixed(2))
      })
    }

    return freight
  }

  const freight_balance_amount_calculator = (actual_freight_amount, advance_freight_amount) => {
    let balance_amount = Number(actual_freight_amount) - Number(advance_freight_amount)
    return Number(balance_amount)
  }

  /* ==================== FIle Compress Code Start=========================*/

  const resizeFile = (file) =>
    new Promise((resolve) => {
      FileResizer.imageFileResizer(
        file,
        1000,
        1000,
        'JPEG',
        100,
        0,
        (uri) => {
          resolve(uri)
        },
        'base64'
      )
    })

  const imageCompress = async (event, need_data, ftype) => {
    //console.log(need_data, 'need_data')

    const file = event.target.files[0]
    //console.log(file, 'file')

    if (ftype == 'rmsto') {
      need_data.sto_pod_copy_rmsto_file_name = file.name
      if (file.type == 'application/pdf') {
        if (file.size > 5000000) {
          alert('File too Big, please select a file less than 5mb')
          need_data.sto_pod_copy_rmsto_file_upload = false
          need_data.sto_pod_copy_rmsto = file
          return false
        } else {
          need_data.sto_pod_copy_rmsto = file
        }
      } else {
        //console.log(file, 'filename')
        //console.log(file.type, 'filename')

        const image = await resizeFile(file)

        if (file.size > 2000000) {
          valueAppendToImage(image, need_data, 'rmsto')
        } else {
          need_data.sto_pod_copy_rmsto = file
        }
      }
    }  else if (ftype == 'fjsales') {
      const shipment_parent_info_for_fjsales = JSON.parse(JSON.stringify(shipmentInfo))

      //console.log(shipment_parent_info_for_fjsales[need_data.parent].shipment_child_info[need_data.child], 'fjsales')
      shipment_parent_info_for_fjsales[need_data.parent].shipment_child_info[
        need_data.child
      ].fj_pod_copy_file_name = file.name

      if (file.type == 'application/pdf') {
        if (file.size > 5000000) {
          alert('File too Big, please select a file less than 5mb')
          shipment_parent_info_for_fjsales[need_data.parent].shipment_child_info[
            need_data.child
          ].fj_pod_copy = null
          return false
        } else {
          shipment_parent_info_for_fjsales[need_data.parent].shipment_child_info[
            need_data.child
          ].fj_pod_copy = file
        }
      } else {
        //console.log(file, 'filename')
        //console.log(file.type, 'filename')

        const image = await resizeFile(file)

        if (file.size > 2000000) {
          valueAppendToImage(
            image,
            shipment_parent_info_for_fjsales[need_data.parent].shipment_child_info[need_data.child],
            'fjsales'
          )
        } else {
          shipment_parent_info_for_fjsales[need_data.parent].shipment_child_info[
            need_data.child
          ].fj_pod_copy = file
        }
      }

      setShipmentInfo(shipment_parent_info_for_fjsales)
    }  
  }

  const dataURLtoFile = (dataurl, filename) => {
    var arr = dataurl.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n)

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n)
    }

    return new File([u8arr], filename, { type: mime })
  }

  const uploadClick = (index_val) => {
    //console.log(index_val, 'index_val')
    let div_val = document.getElementById(`sto_pod_copy_rmsto_upload_yes_${index_val}`)

    if (div_val) {
      document.getElementById(`sto_pod_copy_rmsto_upload_yes_${index_val}`).click()
    }
  }

  const uploadClickRJ = (index_val) => {
    //console.log(index_val, 'index_val')

    let div_val = document.getElementById(`rj_pod_copy_upload_yes_${index_val}`)

    if (div_val) {
      document.getElementById(`rj_pod_copy_upload_yes_${index_val}`).click()
    }
  }

  const uploadClickFJ = (index, index_val) => {
    //console.log(index_val, 'index_val')

    let div_val = document.getElementById(`fj_pod_copy_upload_yes_parent${index}_child${index_val}`)

    if (div_val) {
      document.getElementById(`fj_pod_copy_upload_yes_parent${index}_child${index_val}`).click()
    }
  }

  const clearValues = (index_val, ftype, main_index = '') => {
    if (ftype == 'rmsto') {
      stoValuesRMSTO[index_val].sto_pod_copy_rmsto_file_upload = false
      stoValuesRMSTO[index_val].sto_pod_copy_rmsto_file_name = ''
    } else if (ftype == 'fjsales') {
      shipmentInfo[main_index].shipment_child_info[index_val].fj_pod_copy_file_name = ''
      shipmentInfo[main_index].shipment_child_info[index_val].fj_pod_copy = null
    } else if (ftype == 'rjso') {
      rjsoInfo[index_val].rj_pod_copy_file_upload = false
      rjsoInfo[index_val].rj_pod_copy_file_name = ''
      rjsoInfo[index_val].rj_pod_copy = ''
    }

    setClearValuesObject(true)
  }

  const valueAppendToImage1 = (image) => {
    let file_name = 'dummy' + getRndInteger(100001, 999999) + '.jpg'
    let file = dataURLtoFile(image, file_name)

    //console.log(camEnableType, 'camEnableType')

    if (camEnableType == 'fjsales') {
      //console.log(fileImageKey, 'fileImageKey')
      let ind_no = fileImageKey.lastIndexOf('|')
      let parent = fileImageKey.substring(0, ind_no)
      let child = fileImageKey.substring(ind_no + 1)
      //console.log(parent, 'parent')
      //console.log(child, 'child')
      shipmentInfo[parent].shipment_child_info[child].fj_pod_copy = file
      shipmentInfo[parent].shipment_child_info[child].fj_pod_copy_file_name = file.name
    } else if (camEnableType == 'rmsto') {
      stoValuesRMSTO[fileImageKey].sto_pod_copy_rmsto = file
      stoValuesRMSTO[fileImageKey].sto_pod_copy_rmsto_file_upload = true
      stoValuesRMSTO[fileImageKey].sto_pod_copy_rmsto_file_name = file.name
    } else if (camEnableType == 'rjso') {
      rjsoInfo[fileImageKey].rj_pod_copy = file
      rjsoInfo[fileImageKey].rj_pod_copy_file_upload = true
      rjsoInfo[fileImageKey].rj_pod_copy_file_name = file.name
    }
  }

  const valueAppendToImage = (image, need_data, ftype) => {
    let file_name = 'dummy' + getRndInteger(100001, 999999) + '.jpg'
    let file = dataURLtoFile(image, file_name)

    if (ftype == 'fjsales') {
      if (need_data) {
        need_data.fj_pod_copy = file
      }
    }  
  }

  const getRndInteger = (min, max) => {
    return Math.floor(Math.random() * (max - min)) + min
  }

  /* ==================== FIle Compress Code End =========================*/

  /* ===================== RM-STO Needed Functions Part End  ======================= */

  const tripKMFinder = (openingKM, closingKM) => {
    return closingKM - openingKM
  }

  const onChangeItem = (e) => {
    let value_change = e.target.value
    if (e.target.name == 'budgetMileage' || e.target.name == 'actualMileage') {
      value_change = e.target.value
        .replace(/[^0-9^\.]+/g, '')
        .replace('.', '$#$')
        .replace(/\./g, '')
        .replace('$#$', '.')
        .replace(/^0+/, '')
    }
    let updatedInputs = { ...calculationValues, [e.target.name]: value_change }
    setCalculationValues(updatedInputs)
  }

  const onChangeIdleHrs = (e) => {
    setTripIdleHours(e.target.value)
  }

  /* tabGISuccess Setup */
  useEffect(() => {
    // blob_to_image_converter('blob:http://localhost:3000/928b567d-f915-4c13-9af4-09928327545d')
    if (
      calculationValues.budgetKM &&
      calculationValues.budgetMileage &&
      calculationValues.actualMileage &&
      tripIdleHours
    ) {
      setTabGISuccess(true)
    } else {
      setTabGISuccess(false)
    }
  })

  /* Remove FG-STO DETAILS */
  const emptySTOData = () => {
    let updatedinputs = {}

    let sto_po_number = ''
    let sto_delivery_division = ''
    let sto_from_location = ''
    let sto_to_location = ''
    let sto_delivery_quantity = ''
    let sto_freight_amount = ''

    updatedinputs = {
      ...stoValues,
      sto_po_number,
      sto_delivery_division,
      sto_from_location,
      sto_to_location,
      sto_delivery_quantity,
      sto_freight_amount,
    }

    //console.log(updatedinputs)

    setStoValues(updatedinputs)
    addEnable(updatedinputs)
  }

  /* Remove RM-STO DETAILS */
  const emptyRMSTOData = () => {
    let updatedinputs = {}

    let sto_po_number_rmsto = ''
    let sto_delivery_division_rmsto = ''
    let sto_from_location_rmsto = ''
    let sto_to_location_rmsto = ''
    let sto_delivery_quantity_rmsto = ''
    let sto_freight_amount_rmsto = ''

    updatedinputs = {
      ...stoValuesRMSTO,
      sto_po_number_rmsto,
      sto_delivery_division_rmsto,
      sto_from_location_rmsto,
      sto_to_location_rmsto,
      sto_delivery_quantity_rmsto,
      sto_freight_amount_rmsto,
    }

    //console.log(updatedinputs)

    setStoValuesRMSTO(updatedinputs)
    addEnableRMSTO(updatedinputs)
  }

  /* ExpenseTotalCHarges Calculation */
  useEffect(() => {
    //console.log(shipmentInfo)
    //console.log(rjsoInfo)

    var unload_charge = 0

    if (shipmentInfo.length > 0) {
      shipmentInfo.map((parent, parent_id) => {
        parent.shipment_child_info.map((child, child_id) => {
          if (child.unloading_charges_input) {
            unload_charge += Number(child.unloading_charges_input)
          } else if (child.unloading_charges) {
            unload_charge += Number(child.unloading_charges)
          }
        })
      })
    }

    if (rjsoInfo.length > 0) {
      rjsoInfo.map((parent, parent_id) => {
        //console.log(parent.unloading_charges, 'rjso-unloadcharge')
        if (parent.unloading_charges_input) {
          unload_charge += Number(parent.unloading_charges_input)
        } else if (parent.unloading_charges) {
          unload_charge += Number(parent.unloading_charges)
        }
      })
    }
    //console.log(unload_charge, 'total unload_charge')
    setExpenseUnloadingCharges(unload_charge)
  }, [shipmentInfo, rjsoInfo])

  /* tabFJISuccess Setup */
  useEffect(() => {
    if (shipmentInfo) {
      let vad_data_valid = true
      const val_data_array = []
      //console.log(vad_data_valid, 'vad_data_valid1')
      shipmentInfo.map((parent, parent_id) => {
        parent.shipment_child_info.map((child, child_id) => {
          //console.log(child)
          if (
            child.delivered_date_time_validated &&
            child.unloading_charges_validated &&
            child.fj_pod_copy_validated
          ) {
            val_data_array.push({
              parent: parent_id,
              child: child_id,
              validated: true,
            })
          } else {
            val_data_array.push({
              parent: parent_id,
              child: child_id,
              validated: true,
              // validated: false,
            })
          }
        })
        //console.log(vad_data_valid, 'vad_data_valid2')
      })

      val_data_array.map((value, index) => {
        if (value.validated === false) {
          vad_data_valid = false
        }
      })
      //console.log(val_data_array, 'val_data_array')

      //console.log(vad_data_valid, 'vad_data_valid3')
      if (vad_data_valid && val_data_array.length !== 0) {
        setTabFJSuccess(true)

        //console.log('11')
      } else {
        setTabFJSuccess(false)

        //console.log('12')
      }
    }
  }, [shipmentInfo, tabFJSuccess])

  /* TabFGSALESHireSuccess Setup */
  useEffect(() => {
    if (shipmentInfo) {
      let vad_data_valid = true
      const val_data_array1 = []
      //console.log(vad_data_valid, 'vad_data_valid1')
      shipmentInfo.map((parent, parent_id) => {
        parent.shipment_child_info.map((child, child_id) => {
          // //console.log(child)
          if (child.delivered_date_time_validated && child.fj_pod_copy_validated) {
            val_data_array1.push({
              parent: parent_id,
              child: child_id,
              validated: true,
            })
          } else {
            val_data_array1.push({
              parent: parent_id,
              child: child_id,
              // validated: false,
              validated: true,
            })
          }
        })
        //console.log(vad_data_valid, 'vad_data_valid2')
      })

      val_data_array1.map((value, index) => {
        if (value.validated === false) {
          vad_data_valid = false
        }
      })
      //console.log(val_data_array1, 'val_data_array1')

      //console.log(vad_data_valid, 'vad_data_valid3')
      if (vad_data_valid && val_data_array1.length !== 0) {
        setTabFGSALESHireSuccess(true)
        //console.log('41')
      } else {
        setTabFGSALESHireSuccess(false)
        //console.log('42')
      }
    }
  }, [shipmentInfo, tabFGSALESHireSuccess])

  const getDeliveryQuantity = (qty, uom) => {
    if (uom == 'KG') {
      //console.log(Number(qty) / 1000, 'getDeliveryQuantity')
      // return Number(parseFloat(qty).toFixed(2))
      return Number(qty) / 1000
    } else {
      return '-'
    }
  }

  const totalvaluefinder = (type, data) => {
    //console.log(values, 'totalvaluefinder-values')
    //console.log(type, 'totalvaluefinder-type')
    //console.log(data, 'totalvaluefinder-data')

    let totval_type1 = 0
    let totval_type2 = 0
    let totval_type3 = 0

    if (data) {
      let children = data.shipment_child_info

      children.map((vv, kk) => {
        if (vv.invoice_uom == 'KG') {
          let qtty = Number(vv.invoice_net_quantity) / 1000
          //console.log(qtty, 'totalvaluefinder1')
          totval_type1 = totval_type1 + qtty
          if (JavascriptInArrayComponent(vv.inco_term_id, [381, 382])) {
            //
          } else {
            totval_type3 = totval_type3 + qtty
          }
        } else {
          //
        }
        let ammt = freightamountfinder(
          vv.inco_term_id,
          tripInfo.tripsheet_info.freight_rate_per_tone,
          getDeliveryQuantity(vv.invoice_net_quantity, vv.invoice_uom)
        )
        //console.log(ammt, 'totalvaluefinderammt')
        totval_type2 = totval_type2 + ammt
      })

      //console.log(totval_type1, 'totalvaluefinder1')
      //console.log(totval_type2, 'totalvaluefinder2')
      //console.log(totval_type3, 'totalvaluefinder3')
    }
    if (type == 1) {
      return Number(parseFloat(totval_type1).toFixed(2))
    } else if (type == 2) {
      // return totval_type2
      return Math.round(totval_type2)
    } else if (type == 3) {
      return Number(parseFloat(totval_type3).toFixed(2))
    }
  }

  const totalFreightAmountFinder = (data) => {
    let total = 0
    let billed_qty = data.vehicle_assignment[0] ? data.vehicle_assignment[0].billed_qty : 0
    let freight_per_ton = data.tripsheet_info && data.tripsheet_info.freight_approval_status == 2 ? data.tripsheet_info.trip_updated_freight_rate : data.tripsheet_info.trip_freight_rate
    if(data.advance_payment_info){
      total = data.advance_payment_info.actual_freight
    } else {
      total = billed_qty * freight_per_ton
    }
    return total
  }

  const freightamountfinder = (id, ton, qty) => {
    //console.log(id, 'freightamountfinder-id')
    //console.log(ton, 'freightamountfinder-ton')
    //console.log(qty, 'freightamountfinder-qty')
    if (JavascriptInArrayComponent(id, [381, 382])) {
      return 0
    }
    let ans = Number(ton) * qty
    //console.log(ans, 'freightamountfinder-ans')
    // return Math.round(ans)
    return Number(ans)
    // return parseInt(ans)
  }

  console.log(tripInfo, 'tripInfo')
  console.log(shipmentInfo, 'shipmentInfo')
  /* tabFJ_RJ_FG_RM_STO_Success Setup */
  useEffect(() => {
    //console.log(stoTableData, 'stoTableData3')
    if (
      stoTableData &&
      tripInfo &&
      tripInfo.tripsheet_info &&
      shipmentInfo &&
      stoTableDataRMSTO &&
      rjsoInfo
    ) {
      //console.log(stoTableData, 'stoTableData4')
      let fgsto_not_available_condition_for_di =
        stoTableData.length === 0 && fgsto_tripAddonAvailability === 2 ? true : false

      //console.log(stoTableData.length)
      //console.log(fgsto_tripAddonAvailability)
      // //console.log(tripInfo.trip_sheet_info.purpose)
      let fgsto_available_with_proper_condition_for_di =
        stoTableData.length > 0 && fgsto_tripAddonAvailability === 2 ? true : false
      let rmsto_not_available_condition_for_di =
        stoTableDataRMSTO.length === 0 && rmsto_tripAddonAvailability === 2 ? true : false
      let rmsto_available_with_proper_condition_for_di =
        stoTableDataRMSTO.length > 0 && rmsto_tripAddonAvailability === 2 ? true : false
      let fgsales_not_available_condition_for_di = shipmentInfo.length === 0 ? true : false
      let rjso_not_available_condition_for_di = rjsoInfo.length === 0 ? true : false

      {
        /* Log For Tab Success Start */
      }
      console.log(fgsales_not_available_condition_for_di, 'fgsales_not_available_condition_for_di')
      console.log(rjso_not_available_condition_for_di, 'rjso_not_available_condition_for_di')
      console.log(fgsto_not_available_condition_for_di, 'fgsto_not_available_condition_for_di')
      console.log(rmsto_not_available_condition_for_di, 'rmsto_not_available_condition_for_di')
      console.log(
        fgsto_available_with_proper_condition_for_di,
        'rmsto_available_with_proper_condition_for_di'
      )
      console.log(
        fgsto_available_with_proper_condition_for_di,
        'fgsto_available_with_proper_condition_for_di'
      )

      console.log(tabGISuccess, 'tabGISuccess')
      console.log(tabFJSuccess, 'tabFJSuccess')
      console.log(tabRJSOSuccess, 'tabRJSOSuccess')
      console.log(tabFGSTOSuccess, 'tabFGSTOSuccess')
      console.log(tabRMSTOSuccess, 'tabRMSTOSuccess')
      {
        /* Log For Tab Success End */
      }

      if (
        tabGISuccess &&
        (tabFJSuccess || fgsales_not_available_condition_for_di) &&
        (tabRJSOSuccess || rjso_not_available_condition_for_di) &&
        (tabFGSTOSuccess ||
          fgsto_available_with_proper_condition_for_di ||
          fgsto_not_available_condition_for_di) &&
        (tabRMSTOSuccess ||
          rmsto_available_with_proper_condition_for_di ||
          rmsto_not_available_condition_for_di)
      ) {
        //console.log('rjso_data_valid-211')
        setTabFJ_RJ_FG_RM_STO_Success(true)
      } else {
        //console.log('rjso_data_valid-212')
        setTabFJ_RJ_FG_RM_STO_Success(false)
      }
    }
  }, [tripInfo, shipmentInfo, stoTableData, stoTableDataFGSTO, stoTableDataRMSTO, rjsoInfo])  
 

  // GST Description
  const getGSTTaxTypeName = (code) => {
    if (!code) return '-'

    const item = gstTaxTermsData.find((val) => String(val.definition_list_code) === String(code))

    return item ? item.definition_list_name : '-'
  }

  // TDS Description
  const getTdsTypeHaving = (code) => {
    if (!code) return '-'

    const item = tdsTaxTermsData.find((val) => String(val.definition_list_code) === String(code))

    return item ? item.definition_list_name : '-'
  }
  // HSN Description
  const getHSNTypeDesc = (code) => {
    if (!code) return '-'

    const item = sapHsnData.find((val) => String(val.definition_list_code) === String(code))

    return item ? item.definition_list_name : '-'
  }
  /* KM Differce Calculation */
  useEffect(() => {
    //console.log(tripKMFinder(tripInfo.odometer_km, tripInfo.odometer_closing_km))
    //console.log(calculationValues.budgetKM)
    if (calculationValues.budgetKM) {
      setDifferenceKMFinder(
        tripKMFinder(tripInfo.odometer_km, tripInfo.odometer_closing_km) -
          Number(calculationValues.budgetKM)
      )
      // setDifferenceKMFinder(
      //   Number(calculationValues.budgetKM) -
      //     tripKMFinder(tripInfo.odometer_km, tripInfo.odometer_closing_km)
      // )
    } else {
      setDifferenceKMFinder('-')
    }
  })

  /* Mileage Differce Calculation */
  useEffect(() => {
    if (calculationValues.budgetMileage && calculationValues.actualMileage) {
      setDifferenceMileageFinder(
        parseFloat(
          Number(calculationValues.actualMileage) - Number(calculationValues.budgetMileage)
        ).toFixed(2)
      )
    } else {
      setDifferenceMileageFinder('-')
    }
  })
 

  useEffect(() => {
    let diesel_advance = tripInfo.diesel_intent_info ? tripInfo.diesel_intent_info.total_amount : 0
    //console.log(diesel_advance, 'diesel_advance_freight')
    let bank_advance = tripInfo.advance_payment_info
      ? tripInfo.advance_payment_info.advance_payment
      : 0
    let advance_total_amount_data = Number(diesel_advance) + Number(bank_advance)
    //console.log(diesel_advance, 'diesel_advance_freight')
    //console.log(bank_advance, 'bank_advance_freight')
    //console.log(advance_total_amount_data, 'advance_total_amount_data')
    setAdvance_total_amount(advance_total_amount_data)

    let actual_freight = tripInfo.advance_payment_info
      ? tripInfo.advance_payment_info.actual_freight
      : 0

    let low_tonnage_freight = tripInfo.advance_payment_info
      ? tripInfo.advance_payment_info.low_tonnage_charges
      : 0

    // let total_actual_freight = Number(actual_freight) + Number(low_tonnage_freight)
    let total_actual_freight = Number(actual_freight)
    let total_freight = 0
    if (stoTableData && stoTableData.length > 0) {
      total_freight = stoTableData[0].sto_freight_amount
    } else if (stoTableDataRMSTO && stoTableDataRMSTO.length > 0) {
      total_freight = stoTableDataRMSTO[0].sto_freight_amount_rmsto
    } else if (shipmentInfo && shipmentInfo.length > 0) {
      total_freight = shipmentInfo[0].shipment_freight_amount
    }

    //console.log(total_freight)

    setFreight_total_amount(Number(total_freight))

    /* Freight = API Freight */
    // setFreight_balance_amount(Number(total_freight) - advance_total_amount_data)

    /* Freight = Actual Freight */
    setFreight_balance_amount(Number(total_actual_freight) - advance_total_amount_data)
  }, [tripInfo, shipmentInfo, stoTableData, stoTableDataFGSTO, stoTableDataRMSTO])

  

  const [oopVisible, setOopVisible] = useState(false)
  const [copVisible, setCopVisible] = useState(false)
  const [visible1, setVisible1] = useState(false)
  const [adharvisible, setAdharVisible] = useState(false)
  const [dieselInvoiceVisible, setDieselInvoiceVisible] = useState(false)
  const [dieselInvoiceAttachmentVisible, setDieselInvoiceAttachmentVisible] = useState(false)
  const [dieselInvoiceAttachmentVisible1, setDieselInvoiceAttachmentVisible1] = useState(false)
  const [dieselInvoiceAttachmentVisible1Index, setDieselInvoiceAttachmentVisible1Index] =
    useState('')
  const [adhardel, setAdhardel] = useState(false)
  const options = [
    { value: 'chocolate', label: 'Chocolate' },
    { value: 'strawberry', label: 'Strawberry' },
    { value: 'vanilla', label: 'Vanilla' },
  ]
  const [deliveryNumber, setSelectedDeliveryNumber] = useState([])

  const vehicle_type_find = (veh_type_id) => {
    //console.log(veh_type_id, 'veh_type_id')
    if (veh_type_id == '21') {
      return 'OWN'
    } else if (veh_type_id == '22') {
      return 'HIRE'
    } else if (veh_type_id == '23') {
      return 'PARTY'
    }
  }

  const driver_info_find = (info_type) => {
    // //console.log(driver_trip_id, 'driver_trip_id')
    //console.log(info_type, 'info_type')
    //console.log(tripInfo, 'tripInfo')

    if (info_type == 'name') {
      if (tripInfo.driver_id === null) {
        return tripInfo.driver_name
      } else {
        return tripInfo.driver_info.driver_name
      }
    }

    if (info_type == 'contact_no') {
      return tripInfo.driver_contact_number
    }

    if (info_type == 'code') {
      if (tripInfo.driver_info != null) {
        return tripInfo.driver_info.driver_code
      } else {
        return '0'
      }
    }
    return ''
  }

  const tollEndTimeCalculator = (data = []) => {
    if (!Array.isArray(data) || data.length === 0) {
      return null
    }

    const filteredData = data.filter((item) => item && item.status === '1')

    if (filteredData.length === 0) {
      return null
    }

    // continue your logic safely
  }

  /* =========== Others Tripsheet Reworks Part Start ask1=========== */

  const [isOthersStoEditMode, setIsOthersStoEditMode] = useState(false)
  const [othersstoEditIndex, setOthersStoEditIndex] = useState(-1)
  const [deliveryNoOthersDelete, setDeliveryNoOthersDelete] = useState('')
  const [deliveryNoOthersDeleteIndex, setDeliveryNoOthersDeleteIndex] = useState('')
  const [deliveryOthersDelete, setDeliveryOthersDelete] = useState(false)
  const [others_tripAddonAvailability, setothers_TripAddonAvailability] = useState(2)
  const [tabOthersSuccess, setTabOthersSuccess] = useState(false)
  const [othersAvailable, setOthersAvailable] = useState(false)
  const [vrData, setVrData] = useState([])

  const ColoredLine = ({ color }) => (
    <hr
      style={{
        color: color,
        backgroundColor: color,
        height: 5,
      }}
    />
  )

  /* tabOthersSuccess Setup */
  useEffect(() => {
    //console.log(stoOthersTableData, 'stoOthersTableDataTest1')
    if (stoOthersTableData && tripInfo && tripInfo.tripsheet_info) {
      //console.log(stoOthersTableData, 'stoOthersTableDataTest2')
      {
        /* Condition 1 : Others data must have atleast 1 child */
      }
      let condition1 = stoOthersTableData.length > 0 ? true : false

      //console.log(condition1, 'condition1')

      {
        /* Condition 2 : Others Trip Addon Availability Not Chosen and  Others data have 0 elements and Others is not a FJ Journey  */
      }
      let condition2 =
        stoOthersTableData.length === 0 && others_tripAddonAvailability == 2 ? true : false

      //console.log(condition2, 'condition2')

      //console.log(stoOthersTableData.length, '1')
      //console.log(others_tripAddonAvailability, '2')

      if (condition1 || condition2) {
        //console.log('setTrue1')
        setTabOthersSuccess(true)
      } else {
        //console.log('setFalse')
        setTabOthersSuccess(false)
      }
    }
  }, [stoOthersTableData, tripInfo])

  const othersaddonTabEnableCheck = (e) => {
    let availability_others = e.target.value
    setothers_TripAddonAvailability(availability_others)
    //console.log(availability_others)
    //console.log(tabOthersSuccess, 'tabOthersSuccess')
    if (availability_others == 1) {
      setOthersAvailable(true)
      setTabOthersSuccess(false)
    } else {
      setStoOthersTableData([])
      setOthersAvailable(false)
    }
  }

  const stoOthersResetEdit = () => {
    setIsOthersStoEditMode(false)
    setOtherDeliveryEdit(false)
    setOthersStoEditIndex(-1)
    // values.ot_process_type = ''
    setStoOthersValues(TripsheetClosureConstants.stoOthersInitialState)
  }

  const veh_variety_finder = (variety) => {
    let vari = ''
    if (vehicleVariety.length > 0) {
      vehicleVariety.map((vv, kk) => {
        if (variety == vv.id) {
          vari = vv.vehicle_variety
        }
      })
    }
    return vari
  }

  /* For SAP Others Data */
  const others_hire_total_qty = (hire_data) => {
    let qty = 0
    if (hire_data.length > 0) {
      hire_data.map((val, ind) => {
        qty += Number(parseFloat(val.others_sto_delivery_quantity).toFixed(2))
      })
    }

    return qty
  }

  const onOthersStoSubmitBtn = (event, type) => {
    //console.log(stoOthersValues.others_sto_doc_number, 'onOthersStoSubmitBtn-others_sto_doc_number')
    //console.log(currentSapOthersDeliveryData, 'onOthersStoSubmitBtn-currentSapOthersDeliveryData')

    let others_duplicate1 = 0
    let others_duplicate2 = 0
    stoOthersTableData.map((vf, kf) => {
      if (vf.others_sto_doc_number == stoOthersValues.others_sto_doc_number) {
        others_duplicate1 = 1
      }

      if (vf.others_sto_vr_id == stoOthersValues.others_sto_vr_id) {
        others_duplicate2 = 1
      }
    })

    if (type == 'Add') {
      if (others_duplicate1 != 0) {
        toast.warning("Same Doc.No can't allowed to save twice..")
        return false
      }

      // if(others_duplicate2 != 0){
      //   toast.warning("Same VR No can't allowed to hold twice process..")
      //   return false
      // }
    }

    if (
      stoOthersValues.others_sto_doc_number != currentSapOthersDeliveryData.DOC_NO &&
      !isOthersStoEditMode
    ) {
      toast.warning('Document No. mismatched. Kindly check now..')
      return false
    }

    let updatedTable = []
    if (addOthersEnable(stoOthersValues)) {
      if (!isOthersStoEditMode) {
        updatedTable = [...stoOthersTableData, stoOthersValues]
      } else {
        const prevTable = [...stoOthersTableData]
        prevTable[othersstoEditIndex] = stoOthersValues
        updatedTable = prevTable
      }
      setStoOthersTableData(updatedTable)
      stoOthersResetEdit()
      //console.log(stoOthersTableData, 'after stoOthersTableData update/edit')
    } else {
      toast.warning('Please Fill All The Required Fields..')
    }
  }

  const onOthersStoEditcallback = (index) => {
    setOtherDeliveryEdit(true)
    setIsOthersStoEditMode(true)
    //console.log(index)
    //console.log(deliveryNoOthersDelete)
    setOthersStoEditIndex(index)
    values.ot_process_type = stoOthersTableData[index].others_sto_process_type
    // values.ot_vr_id = stoOthersTableData[index].others_sto_vr_id
    //console.log(stoOthersTableData[index])
    setStoOthersValues(stoOthersTableData[index])
  }

  const removeOthersStoFields = (index) => {
    setDeliveryOthersDelete(false)
    setOtherDeliveryEdit(false)
    const updatedData = [...stoOthersTableData]
    updatedData.splice(index, 1)
    setStoOthersTableData(updatedData)
    setDeliveryNoOthersDelete('')
    setDeliveryNoOthersDeleteIndex('')
  }

  const onOthersStoDeleteCallback = (index) => {
    //console.log(index)
    setDeliveryNoOthersDelete(stoOthersTableData[index].others_sto_doc_number)
    setDeliveryNoOthersDeleteIndex(index)
    setDeliveryOthersDelete(true)
  }

  const veh_capacity_finder = (capacity) => {
    let cap = ''
    if (vehicleCapacity.length > 0) {
      vehicleCapacity.map((vv, kk) => {
        if (capacity == vv.id) {
          cap = vv.capacity
        }
      })
    }
    return cap
  }

  /* Values Assigning To Save Details into DB Part Start*/
  const getCostCenterName = (id) => {
    if (!costCenterData || !id) return ''

    const item = costCenterData.find((x) => String(x.definition_list_id) === String(id))

    return item ? item.definition_list_name : ''
  }

  const veh_body_finder = (body) => {
    let bod = ''
    if (vehicleBody.length > 0) {
      vehicleBody.map((vv, kk) => {
        if (body == vv.id) {
          bod = vv.body_type
        }
      })
    }
    return bod
  }

  const div_finder = (division) => {
    let div = ''
    if (divisionData.length > 0) {
      divisionData.map((vv, kk) => {
        if (division == vv.id) {
          div = vv.division
        }
      })
    }
    return div
  }

  const div_finder_by_vr_id = (vrId) => {
    let vr_data = []
    vrData.map((vk, lk) => {
      if (vrId == vk.vr_id) {
        vr_data.push(vk)
      }
    })
    //console.log('vrId', vrId)
    //console.log('vr_data', vr_data)
    let div = '-'
    if (vr_data && vr_data.length > 0) {
      if (divisionData.length > 0) {
        divisionData.map((vv, kk) => {
          if (vr_data[0].vr_division == vv.id) {
            div = vv.division
          }
        })
      }
    }
    return div
  }

  const dep_finder = (department) => {
    let dep = ''
    if (departmentData.length > 0) {
      departmentData.map((vv, kk) => {
        if (department == vv.id) {
          dep = vv.department
        }
      })
    }
    return dep
  }

  const prod_finder = (product) => {
    let dep = ''
    if (vrProductdata.length > 0) {
      vrProductdata.map((vv, kk) => {
        if (product == vv.definition_list_code) {
          dep = vv.definition_list_name
        }
      })
    }
    return dep
  }

  const [divisionData, setDivisionData] = useState([])
  const [departmentData, setDepartmentData] = useState([])
  const [vehicleVariety, setVehicleVariety] = useState([])
  const [vrProductdata, setVrProductdata] = useState([])
  const [vrPurposedata, setVrPurposedata] = useState([])

  useEffect(() => {

    /* section for getting Division Data from database */
    DivisionApi.getDivision().then((rest) => {
      let tableData = rest.data.data
      //console.log(tableData)
      setDivisionData(tableData)
    })

    /* section for getting Department Data from database */
    DepartmentApi.getDepartment().then((rest) => {
      setFetch(true)
      let tableData = rest.data.data
      //console.log(tableData)
      setDepartmentData(tableData)
    })

    /* section for getting VR Purpose Lists from database */
    DefinitionsListApi.visibleDefinitionsListByDefinition(29).then((response) => {
      let viewData = response.data.data
      //console.log(viewData, 'VR Purpose Lists')
      setVrPurposedata(viewData)
    })

    /* section for getting VR Product Lists from database */
    DefinitionsListApi.visibleDefinitionsListByDefinition(30).then((response) => {
      let viewData = response.data.data
      //console.log(viewData, 'VR Product Lists')
      let filter_Data = viewData.filter((data) => data.definition_list_status == 1)
      //console.log(filter_Data, 'VR Product Lists - filter_Data')
      setVrProductdata(filter_Data)
    })
  }, [])

  const [vehicleRequestsData, setVehicleRequestsData] = useState([])
  // const [stoOthersTableData, setStoOthersTableData] = useState([])
  const [tabOthersHireSuccess, setTabOthersHireSuccess] = useState(false)
  const [stoOthersDeliveryEdit, setOtherDeliveryEdit] = useState(false)
  const [stoOthersValues, setStoOthersValues] = useState(
    TripsheetClosureConstants.stoOthersInitialState
  )
  const [stoOthersDeliveryInvalid, setStoOthersDeliveryInvalid] = useState(true)

  const {
    others_sto_process_type,
    others_sto_doc_number,
    others_sto_doc_date,
    others_sto_from_plant_code,
    others_sto_from_plant_name,
    others_sto_to_plant_code,
    others_sto_to_plant_name,
    others_sto_vendor_code,
    others_sto_vendor_name,
    others_sto_po_number,
    others_sto_delivery_quantity,
    others_sto_freight_amount,
    others_sto_pod_copy,
    others_sto_delivered_date,
    others_sto_incoterm,
    others_sto_net_weight,
    others_sto_customer_code,
    others_sto_assignment,
    others_sto_va_no,
    others_sto_truck_no,
  } = TripsheetClosureConstants.stoOthersStateVariables

  useEffect(() => {
    if (stoOthersTableData && stoOthersTableData.length > 0) {
      setTabOthersHireSuccess(true)
    } else {
      setTabOthersHireSuccess(false)
    }
  }, [stoOthersTableData])

  const changeOthersTableItemForDCC = (event, child_property_name, parent_index, arpl = '') => {
    let getData2 = event.target.value

    if (child_property_name == 'diesel_cons_qty_ltr') {
      getData2 = event.target.value
        .replace(/[^0-9^\.]+/g, '')
        .replace('.', '$#$')
        .replace(/\./g, '')
        .replace('$#$', '.')
        .replace(/^0+/, '')
    } else if (child_property_name == 'closing_km' || child_property_name == 'opening_km') {
      getData2 = event.target.value.replace(/\D/g, '')
    }

    const others_parent_info = JSON.parse(JSON.stringify(stoOthersTableData))

    if (child_property_name == 'diesel_cons_qty_ltr') {
      others_parent_info[parent_index][`${child_property_name}_input`] = getData2
      others_parent_info[parent_index][`diesel_amount_input`] = Math.round(getData2 * arpl)
    } else if (child_property_name == 'opening_km') {
      others_parent_info[parent_index][`${child_property_name}_input`] = getData2
      others_parent_info[parent_index][`running_km_input`] = others_parent_info[parent_index][
        `closing_km_input`
      ]
        ? Number(others_parent_info[parent_index][`closing_km_input`]) - Number(getData2)
        : ''
    } else if (child_property_name == 'closing_km') {
      others_parent_info[parent_index][`${child_property_name}_input`] = getData2
      others_parent_info[parent_index][`running_km_input`] = others_parent_info[parent_index][
        `opening_km_input`
      ]
        ? Number(getData2) - Number(others_parent_info[parent_index][`opening_km_input`])
        : ''
    } else {
      others_parent_info[parent_index][`${child_property_name}_input`] = getData2
    }

    setStoOthersTableData(others_parent_info)
  }

  //console.log(stoOthersTableData)

  const othersDataUpdateForDCC = (original, input) => {
    return input === undefined ? original : input
  }

  const handleStoOthersValueChange = (event) => {
    //console.log(event, 'event')
    let value_change = event.target.value
    //console.log(value_change, 'event-value')
    //console.log(values.ot_process_type, 'handleStoOthersValueChange-values.ot_process_type')
    if (
      event.target.name == 'others_sto_doc_number' ||
      event.target.name == 'others_sto_freight_amount'
    ) {
      if (values.ot_process_type == 11 && event.target.name == 'others_sto_doc_number') {
        value_change = event.target.value.replace(/[^a-zA-Z0-9]/g, '')
      } else {
        value_change = event.target.value.replace(/\D/g, '')
      }
    } else if (event.target.name == 'sto_from_location' || event.target.name == 'sto_to_location') {
      value_change = event.target.value.replace(/[^a-zA-Z ]/gi, '')
    } else if (event.target.name == 'others_sto_delivery_quantity') {
      value_change = event.target.value
        .replace(/[^0-9^\.]+/g, '')
        .replace('.', '$#$')
        .replace(/\./g, '')
        .replace('$#$', '.')
        .replace(/^0+/, '')
    }

    let updatedinputs = { ...stoOthersValues, [event.target.name]: value_change }
    //console.log(updatedinputs, 'event-updatedinputs')
    setStoOthersValues(updatedinputs)
    addOthersEnable(updatedinputs)
  }

  const [currentSapOthersDeliveryData, setCurrentSapOthersDeliveryData] = useState({})

  const addOthersEnable = (data) => {
    //console.log(data, 'addOthersEnable')
    let del_len = Object.keys(currentSapOthersDeliveryData).length
    if (
      (data.others_sto_doc_number != '' || data.others_sto_process_type == 'Gate Pass NO') &&
      data.others_sto_freight_amount != '' &&
      data.others_sto_delivery_quantity != '' &&
      (data.others_sto_vr_id != '' ||
        (tripInfo.tripsheet_info && tripInfo.tripsheet_info.trip_vehicle_info && tripInfo.tripsheet_info.trip_vehicle_info.vehicle_type_id == 22)) &&
      // (del_len > 0 || isOthersStoEditMode) &&
      values.ot_process_type != ''
      // &&
      // values.ot_vr_id != ''
    ) {
      setStoOthersDeliveryInvalid(false)
      return true
    } else {
      setStoOthersDeliveryInvalid(true)
      return false
    }
  }

  const balanceFreight = (a,b) => {

    if(!a || !b)
      return 0

    let freight = Number(parseFloat(a).toFixed(2))
    let advance = Number(parseFloat(b).toFixed(2))

    return Number(parseFloat(freight - advance).toFixed(2))

  }

  const TripsheetClosureSubmit = (process) => {
    if (is_admin) {
      console.log('-------------------tripInfo---------------------------')
      console.log(tripInfo)
      console.log('-------------------shipmentInfo---------------------------')
      console.log(shipmentInfo) 
      console.log('-------------------FormValues---------------------------')
      console.log(values)
    }

    let sto1 = []
    let sto2 = []

     
    
    
    // setFetch(true)
    console.log('process', process)
    // return false

    const sap_data = {
      TRIP_SHEET: tripInfo?.tripsheet_info?.nlmt_tripsheet_no,
      VEHICLE_NO: tripInfo?.vehicle_info?.vehicle_number,
      // "TAX_TYPE":"R5",
      // "TDS":"YES",
      // "TDS_VALUE":"T7",
      // "REMARKS":"TEST1",
      LIFNR: tripInfo?.vendor_info?.vendor_code,
      POST_DATE: values.ded_posting_date,
      // "BANK_DATE":"2026-06-01",
      // "REF_NO":"5555",
      // "REF_DATE":"2026-06-01",
      // "HSN":"996511", 
      // "PLANT":"NLMD",
      DEDUCT_AMT: tripInfo?.trip_settlement_info?.diversion_return_charges,
      DEDUCT_REMARKS: values.ded_remarks,
      REF_NO: values.ded_ref,
      PLANT: "NLMD",
      COST_CENTER: getCostCenterName(tripInfo?.trip_settlement_info?.cost_center),
    }

    const now = new Date();

    const closure_updation_time =
      now.getFullYear() + '-' +
      String(now.getMonth() + 1).padStart(2, '0') + '-' +
      String(now.getDate()).padStart(2, '0') + ' ' +
      String(now.getHours()).padStart(2, '0') + ':' +
      String(now.getMinutes()).padStart(2, '0') + ':' +
      String(now.getSeconds()).padStart(2, '0');

    console.log(closure_updation_time, 'closure_updation_time');

    if (process == 'Approve') {

      let advance_percentage = tripInfo.trip_settlement_info.advance_amount
      let settlement_data = tripInfo.trip_settlement_info

      if(advance_percentage == 100){ /* Deduction With 100% Expense Entry */
              
        if (values.ded_ref == '' || values.ded_ref.trim() == '') {
          setFetch(true)
          toast.warning(`Reference No. Should be required for Deduction Process.`)
          return false
        }

        if (values.ded_remarks == '' || values.ded_remarks.trim() == '') {
          setFetch(true)
          toast.warning(`Remarks Should be required for Deduction Process.`)
          return false
        }    

        let expense = Number(settlement_data.expense)
        let deduction = Number(settlement_data.diversion_return_charges)

        if( deduction > expense ){
          setFetch(true) 
          toast.warning(`Deduction Amount (${deduction}) should be less than Total Expense Amount (${expense})..`)          
          return false
        }

        // ============= Posting date Validation Part =================== //
        
          let Expense_Income_Posting_Date_Taken = ExpenseIncomePostingDate();
          let from_date = Expense_Income_Posting_Date_Taken.min_date
          let to_date = Expense_Income_Posting_Date_Taken.max_date

          console.log(from_date,'qqqqq from_date')
          console.log(to_date,'qqqqq to_date')
          console.log(values.ded_posting_date,'qqqqq ded_posting_date')
      
          if(JavascriptDateCheckComponent(from_date,values.ded_posting_date,to_date)){
            //
          } else {
            setFetch(true)
            toast.warning('Invalid Deduction Posting date')
            return false
          }
          // ============= Posting date Validation Part =================== //
        
        // let SAPData = new FormData()
                  
        // SAPData.append('TRIP_SHEET', settlement_data.tripsheet_no) 
        // SAPData.append('VEHICLE_NO', settlement_data.vehicle_number)
        // SAPData.append('TAX_TYPE', settlement_data.gst_tax_type != 'Empty' ? settlement_data.gst_tax_type : '')
        // SAPData.append('TDS', settlement_data.tds_having == 0 ? 'NO' : 'YES')
        // SAPData.append('TDS_VALUE', settlement_data.tds_having == 0 ? '' : settlement_data.tds_type)
        // SAPData.append('REMARKS', settlement_data.sap_text ? settlement_data.sap_text : '')
        // SAPData.append('LIFNR', settlement_data.vendor_code)         
        // SAPData.append('TOTAL_FRE', settlement_data.expense)
        // SAPData.append('POST_DATE', values.ded_posting_date)
        // SAPData.append('REF_NO', values.ded_ref)          
        // SAPData.append('HSN', settlement_data.vendor_hsn ? settlement_data.vendor_hsn : '')
        // SAPData.append('PLANT', 'NLMD')
        // SAPData.append('DEDUCT_AMT', settlement_data.diversion_return_charges ? settlement_data.diversion_return_charges : '')
        // SAPData.append('DEDUCT_REMARKS', values.ded_remarks)
        // SAPData.append('COST_CENTER', getCostCenterName(settlement_data.cost_center))
        // SAPData.append('REF_NO', settlement_data.supplier_ref_no ? settlement_data.supplier_ref_no : tripInfo.tripsheet_info.nlmt_tripsheet_no)
        // SAPData.append('REF_DATE', settlement_data.supplier_posting_date) 
        
        // console.log(SAPData,'SAPData1')
        console.log(values,'SAPData2')
        console.log(ded_posting_date,'SAPData3')

        
        // 2026-07-06 02:15:30

        // setFetch(true)
        // return false
          
        // NlmtTripSheetClosureSapService.hireTripsheetExpenseWithoutDeductionPost(SAPData).then((res) => {

        //   let sap_ts_no = res.data.TRIP_SHEET
        //   let sap_expense_document_no = res.data.DOCUMENT_NO
        //   let sap_expense_amount = res.data.EXP_DOC_AMT
        //   let sap_expense_status = res.data.STATUS
        //   let sap_expense_message = res.data.MESSAGE
        //   let sap_expense_deduction_document_no = res.data.DEDUCTION_DOCUMENT_NO
        //   let sap_expense_deduction_status = res.data.DEDUCTION_STATUS
        //   let sap_expense_deduction_message = res.data.DEDUCTION_MESSAGE

        //   console.log('hireTripsheetExpenseWithoutDeductionPost',
        //     sap_ts_no + '/' + sap_expense_amount + '/' + sap_expense_document_no + '/' + sap_expense_status + '/' + sap_expense_message + '/' + sap_expense_deduction_document_no + '/' + sap_expense_deduction_status + '/' + sap_expense_deduction_message
        //   )

        //   if (
        //     sap_expense_status == '1' &&
        //     res.status == 200 &&
        //     sap_expense_document_no &&
        //     sap_expense_message &&
        //     sap_ts_no == tripInfo.tripsheet_info.nlmt_tripsheet_no && 
        //     sap_expense_deduction_document_no &&
        //     sap_expense_deduction_message &&
        //     sap_expense_deduction_status == '1' 
        //   ){

            const formData = new FormData()

            // formData.append('expense_sap_document_no', sap_expense_document_no)
            // formData.append('sap_expense_amount', sap_expense_amount) 
            // formData.append('tripsheet_is_settled', 3)
            formData.append('shipment_id',tripInfo.vehicle_assignment[0].shipment_id)
            formData.append('vehicle_number',tripInfo.vehicle_info.vehicle_number)
            formData.append('approval_status',1) /* 1 - Deduction Approved */
            formData.append('deduction_approval_remarks',values.approval_remarks ? values.approval_remarks : 'approve') 
            formData.append('deduction_approval_by',user_id) 
            formData.append('deduction_approval_at',closure_updation_time) 
            formData.append('ded_remarks', values.ded_remarks ? values.ded_remarks : '') 
            formData.append('ded_ref', values.ded_ref ? values.ded_ref : '') 
            // formData.append('deduction_doc', sap_expense_deduction_document_no) 
            formData.append('ded_posting_date', values.ded_posting_date ? values.ded_posting_date : '') 
            // setFetch(true)
            // return false
            formData.append('hire_closure_status', 2) /* 2 - Deduction Approved (27) */
            formData.append('closure_updation_time', closure_updation_time)
            formData.append('advance_amount',advance_percentage)
            formData.append('parking_id', tripInfo.nlmt_trip_in_id)
            formData.append('vehicle_id', tripInfo.vehicle_id)
            formData.append('process', 2) /* 2 - Update */
            NlmtTripSheetClosureService.createTripsheetSettlementForExpenseWitoutDeduction(formData).then((res) => {
              console.log(res,'approveSettlementSubmission')
              
              setFetch(true)
              if (res.status == 200) {
                Swal.fire({
                  title: "Tripsheet Expense Deduction Approval Process Done Successfully!",
                  icon: "success",
                  // html: 'SAP Expense Amount : ' + sap_expense_amount + '<br />' + 'SAP Expense Document No : ' + sap_expense_document_no + '<br />' + ' SAP Deduction Doc. No. : ' + sap_expense_deduction_document_no,  
                  confirmButtonText: "OK",
                }).then(function () { 
                  navigation('/NlmtTSExpenseClosureApprovalHome')
                });
              } else if (res.status == 201) {
                Swal.fire({
                  title: res.data.message,
                  icon: "warning",
                  confirmButtonText: "OK",
                }).then(function () {
                  // window.location.reload(false)
                });
              } else {
                toast.warning(
                  'Expense Deduction - Approval Cannot Be Updated From LP.. Kindly Contact Admin!'
                )
              }
            })
            .catch((err) => {
              console.error('NLMT Deduction Approval Rejection Error:', err)
              toast.error('Failed to Approve expense deduction in PRO. Please try again.')
              setFetch(true)
            }) 

          // } else if (
          //   (sap_expense_status == '2') &&
          //   res.status == 200 &&
          //   sap_expense_document_no == '' &&
          //   sap_expense_message &&
          //   sap_ts_no == tripInfo.tripsheet_info.nlmt_tripsheet_no 
          // ) {
          //   setFetch(true)
          //   Swal.fire({
          //     title: sap_expense_message + ' Kindly Contact Admin..',
          //     icon: "warning",
          //     confirmButtonText: "OK",
          //   }).then(function () {
          //     // window.location.reload(false)
          //   })
  
          // } else if (
          //   (sap_expense_deduction_status == '2') &&
          //   res.status == 200 &&
          //   sap_expense_deduction_document_no == '' &&
          //   sap_expense_deduction_message &&
          //   sap_ts_no == tripInfo.tripsheet_info.nlmt_tripsheet_no 
          // ) {
          //   setFetch(true)
          //   Swal.fire({
          //     title: sap_expense_deduction_message + ' Kindly Contact Admin..',
          //     icon: "warning",
          //     confirmButtonText: "OK",
          //   }).then(function () {
          //     // window.location.reload(false)
          //   })
  
          // } else {
          //   setFetch(true)
          //   toast.warning('Expense Approval Submission Failed in SAP.. Kindly Contact Admin!')
          // }
        // })
        
      } else { /* Deduction Entry Only */

        // tripInfo.advance_payment_info.actual_freight
        let expense_balance_amount = balanceFreight(tripInfo.advance_payment_info.sap_freight_payment_amount,tripInfo.advance_payment_info.sap_bank_payment_amount)

        let deduction = Number(settlement_data.diversion_return_charges)

        if( deduction > expense_balance_amount ){
          setFetch(true)
          toast.warning(`Deduction Amount (${deduction}) should be less than Expense Balance Amount (${expense_balance_amount})..`)
          return false
        }

        let Expense_Income_Posting_Date_Taken = ExpenseIncomePostingDate();
        let from_date = Expense_Income_Posting_Date_Taken.min_date
        let to_date = Expense_Income_Posting_Date_Taken.max_date

        console.log(from_date,'qqqqq from_date')
        console.log(to_date,'qqqqq to_date')
        console.log(values.ded_posting_date,'qqqqq ded_posting_date')
    
        if(JavascriptDateCheckComponent(from_date,values.ded_posting_date,to_date)){
          //
        } else {
          setFetch(true)
          toast.warning('Invalid Deduction Posting date')
          return false
        }
        // ============= Posting date Validation Part =================== //

        // NlmtTripSheetClosureService.hireDeductionPayment(sap_data).then((res) => {
        //   let sap_deduction_doc = res.data.DEDUCT_DOCUMENT_NO
        //   let sap_deduction_status = res.data.STATUS
        //   let sap_deduction_message = res.data.MESSAGE

        //   console.log(sap_deduction_doc + '/' + sap_deduction_status + '/' + sap_deduction_message)

        //   if (
        //     sap_deduction_status == '1' &&
        //     res.status == 200 &&
        //     sap_deduction_message &&
        //     sap_deduction_doc
        //   ) {
            const formData = new FormData()

            formData.append('shipment_id',tripInfo.vehicle_assignment[0].shipment_id)
            formData.append('vehicle_number',tripInfo.vehicle_info.vehicle_number)
            formData.append('approval_status',1) /* 1 - Deduction Approved */
            formData.append('deduction_approval_remarks',values.approval_remarks ? values.approval_remarks : 'approve') 
            formData.append('deduction_approval_by',user_id) 
            formData.append('deduction_approval_at',closure_updation_time) 
            formData.append('ded_remarks', values.ded_remarks ? values.ded_remarks : '') 
            formData.append('ded_ref', values.ded_ref ? values.ded_ref : '') 
            // formData.append('deduction_doc', sap_expense_deduction_document_no) 
            formData.append('ded_posting_date', values.ded_posting_date ? values.ded_posting_date : '') 
            // setFetch(true)
            // return false
            formData.append('hire_closure_status', 2) /* 2 - Deduction Approved (27) */
            formData.append('closure_updation_time', closure_updation_time)
            formData.append('advance_amount',advance_percentage)
            formData.append('parking_id', tripInfo.nlmt_trip_in_id)
            formData.append('vehicle_id', tripInfo.vehicle_id)
            formData.append('process', 2) /* 2 - Update */ 

            setFetch(true)
            
            // NlmtTripSheetClosureService.updateTripsheetSettlement(tripSettlementID, formData).then((res) => {
            //   console.log(res)
            //   if (res.status == 200) {
            //     setFetch(true) 
            //     Swal.fire({
            //       title: "Tripsheet Deduction Approval Process Done Successfully!",
            //       icon: "success",
            //       // html: ' SAP Deduction Doc. No. : ' + sap_deduction_doc,  
            //       confirmButtonText: "OK",
            //     }).then(function () { 
            //       navigation('/NlmtTSExpenseClosureApprovalHome')
            //     })

            //   } else {
            //     setFetch(true)
            //     toast.warning('Tripsheet Deduction Approval Process Failed..')
            //     // navigation('/NlmtTSExpenseClosureApprovalHome')
            //   }
            // })
             NlmtTripSheetClosureService.createTripsheetSettlementForExpenseWitoutDeduction(formData).then((res) => {
              console.log(res,'approveSettlementSubmission')
              
              setFetch(true)
              if (res.status == 200) {
                Swal.fire({
                  title: "Tripsheet Expense Deduction Approval Process Done Successfully!",
                  icon: "success",
                  // html: 'SAP Expense Amount : ' + sap_expense_amount + '<br />' + 'SAP Expense Document No : ' + sap_expense_document_no + '<br />' + ' SAP Deduction Doc. No. : ' + sap_expense_deduction_document_no,  
                  confirmButtonText: "OK",
                }).then(function () { 
                  navigation('/NlmtTSExpenseClosureApprovalHome')
                });
              } else if (res.status == 201) {
                Swal.fire({
                  title: res.data.message,
                  icon: "warning",
                  confirmButtonText: "OK",
                }).then(function () {
                  // window.location.reload(false)
                });
              } else {
                toast.warning(
                  'Expense Deduction - Approval Cannot Be Updated From LP.. Kindly Contact Admin!'
                )
              }
            })
            .catch((err) => {
              console.error('NLMT Deduction Approval Rejection Error:', err)
              toast.error('Failed to Approve expense deduction in PRO. Please try again.')
              setFetch(true)
            })  
          }
          /* Values Assigning To Save Details into DB Part End*/
        // })
      // }

      
    } else if (process == 'reject') {

      if(values.approval_remarks == '' || values.approval_remarks.trim() == ''){
      setFetch(true)
      toast.warning(`Approval Remarks Should be required for Rejection Process.`)
      return false
    }

      const formData = new FormData() 
      formData.append('vehicle_id', tripInfo.vehicle_id)
      formData.append('parking_id', tripInfo.nlmt_trip_in_id) 
      formData.append(
        'deduction_approval_remarks',
        values.approval_remarks ? values.approval_remarks : 'reject'
      )
      formData.append('deduction_approval_by', user_id) 
      formData.append('closure_id', tripsettlementData.id)   

      setFetch(true)
      NlmtTripSheetClosureService.deductionRejectionProcess(formData)
        .then((res) => {
          console.log(res)
          if (res.status == 200) {
            setFetch(true)
            toast.success('Deduction Approval Process Rejected Successfully!')
            navigation('/NlmtTSExpenseClosureApprovalHome')
          } else {
            setFetch(true)
            toast.warning('Deduction Approval Rejection Process Failed..')
            navigation('/NlmtTSExpenseClosureApprovalHome')
          }
        })
        .catch((errortemp) => {
          console.log(errortemp)
          toast.error('Additional Expense Capture Process Failed.Kindly Contact Admin..')
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
  }

  return (
    <>
      {!fetch && <Loader />}
      {fetch && (
        <>
          {screenAccess ? (
            <>
              <CCard className="p-1">
                <CTabContent className="p-3">
                  <CTabPane role="tabpanel" aria-labelledby="home-tab" visible={mainKey === 1}>
                    {/* Hire Vehicles Part Header Tab Start */}
                    <CNav variant="tabs" role="tablist">
                      <CNavItem>
                        <CNavLink
                          active={activeKey === 1}
                          style={{ backgroundColor: 'green' }}
                          onClick={() => setActiveKey(1)}
                        >
                          General Information
                        </CNavLink>
                      </CNavItem>
                      {Array.isArray(shipmentInfo) && shipmentInfo.length > 0 && (
                        <>
                          <CNavItem>
                            <CNavLink
                              active={activeKey === 2}
                              style={{
                                backgroundColor: tabFGSALESHireSuccess ? 'green' : 'red',
                              }}
                              onClick={() => setActiveKey(2)}
                            >
                              FJ Information
                            </CNavLink>
                          </CNavItem>
                        </>
                      )}

                      {stoTableDataFGSTO.length > 0 && (
                        <>
                          <CNavItem>
                            <CNavLink
                              style={{ backgroundColor: 'green' }}
                              // disabled={!tabGISuccess}
                              active={activeKey === 9}
                              onClick={() => setActiveKey(9)}
                            >
                              SAP : FGSTO Information
                            </CNavLink>
                          </CNavItem>
                        </>
                      )}

                      {/* {sto_enable && tripInfo.trip_sheet_info.purpose == '2' && ( */}
                      {sto_enable &&
                        tripInfo &&
                        tripInfo.tripsheet_info &&
                        stoTableDataFGSTO.length == 0 && (
                          <>
                            <CNavItem>
                              <CNavLink
                                active={activeKey === 4}
                                style={{ backgroundColor: tabFGSTOHireSuccess ? 'green' : 'red' }}
                                onClick={() => setActiveKey(4)}
                              >
                                FGSTO Information
                              </CNavLink>
                            </CNavItem>
                          </>
                        )}

                      {sto_enable && tripInfo && (
                        <>
                          <CNavItem>
                            <CNavLink
                              active={activeKey === 8}
                              style={{ backgroundColor: tabRMSTOHireSuccess ? 'green' : 'red' }}
                              onClick={() => setActiveKey(8)}
                            >
                              RMSTO Information
                            </CNavLink>
                          </CNavItem>
                        </>
                      )}

                      {sto_enable && tripInfo && (
                        <>
                          <CNavItem>
                            <CNavLink
                              active={activeKey === 8}
                              style={{ backgroundColor: tabOthersHireSuccess ? 'green' : 'red' }}
                              onClick={() => setActiveKey(10)}
                            >
                              Others Information
                            </CNavLink>
                          </CNavItem>
                        </>
                      )}

                      <CNavItem>
                        <CNavLink
                          active={activeKey === 7}
                          style={{ backgroundColor: tabFreightHireSuccess ? 'green' : 'red' }}
                          disabled={
                            !(
                              tabFGSALESHireSuccess ||
                              (stoTableData && stoTableData.length > 0) ||
                              (stoTableDataFGSTO && stoTableDataFGSTO.length > 0) ||
                              (stoTableDataRMSTO && stoTableDataRMSTO.length > 0) ||
                              (stoOthersTableData && stoOthersTableData.length > 0)
                            )
                          }
                          onClick={() => setActiveKey(7)}
                        >
                          Freight
                        </CNavLink>
                      </CNavItem>
                      {tripInfo && tripInfo.diesel_intent_info && tripInfo.vehicle_info &&
                        tripInfo.vehicle_info.vehicle_type_id == 21 && (
                          <CNavItem>
                            <CNavLink
                              active={activeKey === 5}
                              style={{ backgroundColor: tabDISuccess ? 'green' : 'red' }}
                              disabled={!tabDieselAvailable}
                              onClick={() => setActiveKey(5)}
                            >
                              Diesel Information
                            </CNavLink>
                          </CNavItem>
                        )}
                      {/* Sales Return Start */}
                      {/* <CNavItem>
                      <CNavLink
                        // href="javascript:void(0);"
                        active={activeKey === 6}
                        onClick={() => setActiveKey(6)}
                      >
                        Return
                      </CNavLink>
                    </CNavItem> */}
                      {/* Sales Return End */}
                      <CNavItem>
                        <CNavLink
                          active={activeKey === 3}
                          style={{ backgroundColor: tabExpensesHireSuccess ? 'green' : 'green' }}
                          disabled={!tabFreightHireSuccess}
                          onClick={() => setActiveKey(3)}
                        >
                          Expenses
                        </CNavLink>
                      </CNavItem>
                    </CNav>
                    {/* Hire Vehicles Part Header Tab End */}
                    {/* Hire Vehicles Part Start */}
                    <CTabContent>
                      <CTabPane role="tabpanel" aria-labelledby="home-tab" visible={activeKey === 1}>
                        {/* Hire Vehicle General Info Part Start */}
                        <CRow className="mt-2">
                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="tNum">Tripsheet Number</CFormLabel>

                            <CFormInput
                              size="sm"
                              id="tNum"
                              value={
                                tripInfo && tripInfo.tripsheet_info
                                  ? tripInfo.tripsheet_info?.nlmt_tripsheet_no
                                  : ''
                              }
                              readOnly
                            />
                          </CCol>
                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="vNum">Vehicle Number</CFormLabel>

                            <CFormInput
                              size="sm"
                              id="vNum"
                              value={tripInfo?.vehicle_info?.vehicle_number}
                              readOnly
                            />
                          </CCol>
                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="vCap">Vehicle Capacity</CFormLabel>

                            <CFormInput
                              size="sm"
                              id="vCap"
                              value={
                                mastersLoaded
                                  ? `${getDefinitionName(
                                      vehicleCapacity,
                                      tripInfo?.vehicle_info?.vehicle_capacity_id
                                    )} MTS`
                                  : ''
                              }
                              readOnly
                            />
                          </CCol>

                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="vType">Vehicle Type</CFormLabel>

                            <CFormInput
                              size="sm"
                              id="vType"
                              value={
                                VEHICLE_TYPE_MAP[
                                  tripInfo?.tripsheet_info?.trip_vehicle_info?.vehicle_type_id
                                    ? tripInfo?.tripsheet_info?.trip_vehicle_info?.vehicle_type_id
                                    : ''
                                ] ?? '-'
                              }
                              readOnly
                            />
                          </CCol>
                          {tripInfo && tripInfo?.vehicle_info?.vehicle_type_id === 22 && (
                            <>
                              <CCol xs={12} md={3}>
                                <CFormLabel htmlFor="dName">Driver Name</CFormLabel>

                                <CFormInput
                                  size="sm"
                                  id="dName"
                                  value={tripInfo.driver_name}
                                  readOnly
                                />
                              </CCol>
                              <CCol xs={12} md={3}>
                                <CFormLabel htmlFor="dMob">Driver Cell Number</CFormLabel>

                                <CFormInput
                                  size="sm"
                                  id="dMob"
                                  value={tripInfo.driver_phone_1}
                                  readOnly
                                />
                              </CCol>
                            </>
                          )}
                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="advance_need">Trip Advance Eligibility</CFormLabel>

                            <CFormInput
                              size="sm"
                              id="advance_need"
                              value={tripInfo && tripInfo.advance_payment_info ? 'YES' : 'NO'}
                              readOnly
                            />
                          </CCol>

                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="gateInDateTime">Trip-In Date & Time</CFormLabel>
                            <CFormInput
                              size="sm"
                              id="gateInDateTime"
                              value={tripInfo.gate_in_date_time_string}
                              readOnly
                            />
                          </CCol>
                          {tripInfo && tripInfo.vehicle_info && tripInfo.vehicle_info.vehicle_type_id === 21 && (
                            <CCol xs={12} md={3}>
                              <CFormLabel htmlFor="inspectionDateTime">
                                Vehicle Inspection Date & Time
                              </CFormLabel>

                              <CFormInput
                                size="sm"
                                id="inspectionDateTime"
                                value={
                                  tripInfo.vehicle_inspection_trip
                                    ? tripInfo.vehicle_inspection_trip.inspection_time_string
                                    : 'No Inspection'
                                }
                                readOnly
                              />
                            </CCol>
                          )}
                          {tripInfo && tripInfo.vehicle_info && tripInfo.vehicle_info.vehicle_type_id === 22 && (
                            <CCol xs={12} md={3}>
                              <CFormLabel htmlFor="verifyDate">
                                Doc. Verification Date & Time
                              </CFormLabel>
                              <CFormInput
                                size="sm"
                                id="verifyDate"
                                value={formatDateTimeIST(
                                  tripInfo.vendor_info ? tripInfo.vendor_info.created_at : ''
                                )}
                                readOnly
                              />
                            </CCol>
                          )}
                          {tripInfo && tripInfo.vehicle_info && tripInfo.vehicle_info.vehicle_type_id === 21 && (
                            <>
                              <CCol xs={12} md={3}>
                                <CFormLabel htmlFor="gateoutDate">Gate Out Date & Time</CFormLabel>

                                <CFormInput
                                  size="sm"
                                  id="gateoutDate"
                                  value={tripInfo.gate_out_date_time_string}
                                  readOnly
                                />
                              </CCol>
                            </>
                          )}
                          {tripInfo && tripInfo.vehicle_info && tripInfo.vehicle_info.vehicle_type_id === 22 && (
                            <>
                              <CCol xs={12} md={3}>
                                <CFormLabel htmlFor="shedName">Shed Name</CFormLabel>

                                <CFormInput
                                  size="sm"
                                  id="shedName"
                                  value={
                                    tripInfo.vendor_info
                                      ? tripInfo.vendor_info.nlmt_shed_info.shed_name
                                      : ''
                                  }
                                  readOnly
                                />
                              </CCol>
                              <CCol xs={12} md={3}>
                                <CFormLabel htmlFor="shedOwnerName">Shed Owner Name</CFormLabel>

                                <CFormInput
                                  size="sm"
                                  id="shedOwnerName"
                                  value={
                                    tripInfo.vendor_info
                                      ? tripInfo.vendor_info.nlmt_shed_info.shed_owner_name
                                      : ''
                                  }
                                  readOnly
                                />
                              </CCol>
                              <CCol xs={12} md={3}>
                                <CFormLabel htmlFor="shedOwnerMob">Shed Owner Cell Number</CFormLabel>

                                <CFormInput
                                  size="sm"
                                  id="shedOwnerMob"
                                  value={
                                    tripInfo.vendor_info
                                      ? tripInfo.vendor_info.nlmt_shed_info.shed_owner_phone_1
                                      : ''
                                  }
                                  readOnly
                                />
                              </CCol>
                              <CCol xs={12} md={3}>
                                <CFormLabel htmlFor="vendorName">Vendor Name</CFormLabel>

                                <CFormInput
                                  size="sm"
                                  id="vendorName"
                                  value={tripInfo.vendor_info ? tripInfo.vendor_info.owner_name : ''}
                                  readOnly
                                />
                              </CCol>
                              <CCol xs={12} md={3}>
                                <CFormLabel htmlFor="vendorCode">Vendor Code</CFormLabel>

                                <CFormInput
                                  size="sm"
                                  id="vendorCode"
                                  // value={tripInfo.vendor_info ? tripInfo.vendor_info.vendor_code : ''}
                                  value={tripInfo.vendor_info ? vendorCodeFinder(tripInfo) : ''}
                                  readOnly
                                />
                              </CCol>
                              <CCol xs={12} md={3}>
                                <CFormLabel htmlFor="vendorMob">Vendor Cell Number</CFormLabel>

                                <CFormInput
                                  size="sm"
                                  id="vendorMob"
                                  value={
                                    tripInfo?.vendor_info ? tripInfo?.vendor_info?.owner_number : '-'
                                  }
                                  readOnly
                                />
                              </CCol>
                              <CCol xs={12} md={3}>
                                <CFormLabel htmlFor="vendorPanNo">Vendor PAN Number</CFormLabel>

                                <CFormInput
                                  size="sm"
                                  id="vendorPanNo"
                                  value={
                                    tripInfo.vendor_info ? tripInfo.vendor_info.pan_card_number : ''
                                  }
                                  readOnly
                                />
                              </CCol> 
                              <CCol xs={12} md={2}>
                                <CFormLabel htmlFor="remarks">Expense Attachment</CFormLabel>
                                <CButton className="w-100 m-0" color="info" size="sm" id="inputAddress">
                                  <span className="float-start">
                                    <a style={{color:'black'}} target='_blank' rel="noreferrer" href={tripsettlementData.expense_form}>
                                      <i className="fa fa-eye" aria-hidden="true">&nbsp;View</i>
                                    </a>
                                  </span> 
                                </CButton> 
                              </CCol>
                            </>
                          )}
                        </CRow>
                      </CTabPane>
                      {/* Hire Vehicle General Info Part End */}

                      {/* Hire Vehicle FG-SALES Part Start */}
                      <CTabPane role="tabpanel" aria-labelledby="profile-tab" visible={activeKey === 2}>
                        {shipmentInfo.map((data, index) => {
                          return (
                            <>
                              <CRow key={`HireshipmentData${index}`} className="mt-2" hidden>
                                <CCol xs={12} md={6}>
                                  <CFormLabel
                                    htmlFor="inputAddress"
                                    style={{
                                      backgroundColor: '#4d3227',
                                      color: 'white',
                                    }}
                                  >
                                    {`Shipment Number : ${data.shipment_no} , Shipment Qty. : ${data.billed_net_qty} TON`}
                                  </CFormLabel>
                                </CCol>
                              </CRow>
                              {data.shipment_child_info.map((val, val_index) => {
                                return (
                                  <>
                                    <CRow key={`HireshipmentChildData_${index}_${val_index}`}>
                                      <CCol xs={12} md={3}>
                                        <CFormLabel htmlFor="sNum">Delivery Number</CFormLabel>
                                        <CFormInput
                                          size="sm"
                                          id="sNum"
                                          value={val.delivery_no}
                                          readOnly
                                        />
                                      </CCol>
                                      <CCol xs={12} md={3}>
                                        <CFormLabel htmlFor="sNum">Delivery Qty. in MTS</CFormLabel>

                                        <CFormInput
                                          size="sm"
                                          id="sNum"
                                          value={val.delivery_net_qty}
                                          readOnly
                                        />
                                      </CCol>
                                      <CCol xs={12} md={3}>
                                        <CFormLabel htmlFor="sInvoice">Invoice Number</CFormLabel>

                                        <CFormInput
                                          size="sm"
                                          id="sInvoice"
                                          value={val.invoice_no}
                                          readOnly
                                        />
                                      </CCol>
                                      <CCol xs={12} md={3}>
                                        <CFormLabel htmlFor="sNum">Invoice Qty.</CFormLabel>

                                        <CFormInput
                                          size="sm"
                                          id="sNum"
                                          value={`${val.invoice_net_quantity} - ${val.invoice_uom}`}
                                          readOnly
                                        />
                                      </CCol>
                                        
                                      <CCol xs={12} md={3}>
                                        <CFormLabel htmlFor="cNum">Customer Name</CFormLabel>
                                        <CFormInput
                                          size="sm"
                                          id="cNum"
                                          value={val.customer_info.CustomerName}
                                          readOnly
                                        />
                                      </CCol>
                                      <CCol xs={12} md={3}>
                                        <CFormLabel htmlFor="cNum">Customer Code</CFormLabel>

                                        <CFormInput
                                          size="sm"
                                          id="cNum"
                                          value={val.customer_info.CustomerCode}
                                          readOnly
                                        />
                                      </CCol>
                                      <CCol xs={12} md={3}>
                                        <CFormLabel htmlFor="cNum">Customer City</CFormLabel>

                                        <CFormInput
                                          size="sm"
                                          id="cNum"
                                          value={val.customer_info.CustomerCity}
                                          readOnly
                                        />
                                      </CCol> 

                                      {/* <CCol xs={12} md={2}>
                                        <CFormLabel htmlFor="ddt">Delivery Date & Time</CFormLabel>

                                        <CFormInput
                                          size="sm"
                                          id="ddt"
                                          value={
                                            val.delivered_date_time ? val.delivered_date_time : '-'
                                          }
                                          readOnly
                                        />
                                      </CCol>
                                      <CCol xs={12} md={2}>
                                        <CFormLabel htmlFor="ddt">Invoice Copy</CFormLabel>

                                        <CButton
                                          className="w-100"
                                          color="info"
                                          size="sm"
                                          id="inputAddress"
                                        >
                                          {shipmentInfo[index].shipment_child_info[val_index]
                                            .fj_pod_copy ? (
                                            <CNavLink
                                              style={{ color: 'blue' }}
                                              href={
                                                shipmentInfo[index].shipment_child_info[val_index]
                                                  .fj_pod_copy
                                              }
                                              target={'_blank'}
                                            >
                                              <span className="float-start">
                                                <i className="fa fa-eye" aria-hidden="true"></i>{' '}
                                                &nbsp;View
                                              </span>
                                            </CNavLink>
                                          ) : (
                                            <CNavLink
                                              style={{ color: 'red' }}
                                              disabled={true}
                                              href={
                                                shipmentInfo[index].shipment_child_info[val_index]
                                                  .fj_pod_copy
                                                  ? shipmentInfo[index].shipment_child_info[val_index]
                                                      .fj_pod_copy
                                                  : 'Image Not Found..'
                                              }
                                              target={'_blank'}
                                            >
                                              <span className="float-start">
                                                <i className="fa fa-eye" aria-hidden="true"></i>{' '}
                                                &nbsp;Image Not Found..
                                              </span>
                                            </CNavLink>
                                          )}
                                        </CButton>
                                      </CCol>                                        
                                      <CCol md={2}>
                                        <CFormLabel htmlFor="DefectType">Defect Type</CFormLabel>

                                        <CFormSelect
                                          size="sm"
                                          onChange={(e) => {
                                            changeVadTableItem(e, 'defect_type', index, val_index)
                                          }}
                                          value={vadDataUpdate(val.defect_type, val.defect_type_input)}
                                        >
                                          <option value="">Select...</option>
                                          <option value="1">Shortage</option>
                                          <option value="2">Rain Damage</option>
                                          <option value="3">Sales Diversion</option>
                                          <option value="4">Sales Return</option>
                                          <option value="4">Halting</option>
                                        </CFormSelect>
                                      </CCol> */}
                                    </CRow>
                                  </>
                                )
                              })}
                            </>
                          )
                        })}
                      </CTabPane>
                      {/* Hire Vehicle FG-SALES Part End */}
                       
                      {/* ==================== Hire Vehicle Freight Tab Start ==================== */}
                      <CTabPane role="tabpanel" aria-labelledby="profile-tab" visible={activeKey === 7}>
                        
                        {!tripInfo.advance_payment_info &&
                          idt.length > 0 &&
                          tripInfo.tripsheet_info.to_divison == 1 && (
                            <>
                              <CRow className="mt-2" hidden>
                                <CCol xs={12} md={3}>
                                  <CFormLabel
                                    htmlFor="inputAddress"
                                    style={{
                                      backgroundColor: '#4d3227',
                                      marginTop: '5px 0',
                                      color: 'white',
                                    }}
                                  >
                                    IncoTerm wise Freight Information
                                  </CFormLabel>
                                </CCol>
                                <CCol md={3}>
                                  <CFormLabel htmlFor="dname">Freight Paid Tonnage in MTS</CFormLabel>
                                  <CFormInput
                                    name="dname"
                                    size="sm"
                                    id="dname"
                                    readOnly
                                    value={totalvaluefinder(3, tripInfo.shipment_info[0])}
                                  />
                                </CCol>
                              </CRow>
                              <CRow>
                                <CTable
                                  style={{ height: '40vh', width: 'auto' }}
                                  className="overflow-scroll"
                                >
                                  <CTableHead style={{ backgroundColor: '#4d3227', color: 'white' }}>
                                    <CTableRow style={{ width: '100%' }}>
                                      <CTableHeaderCell
                                        scope="col"
                                        style={{ color: 'white', width: '5%', textAlign: 'center' }}
                                      >
                                        S.No
                                      </CTableHeaderCell>

                                      <CTableHeaderCell
                                        scope="col"
                                        style={{ color: 'white', width: '9%', textAlign: 'center' }}
                                      >
                                        Inco Term
                                      </CTableHeaderCell>

                                      <CTableHeaderCell
                                        scope="col"
                                        style={{ color: 'white', width: '5%', textAlign: 'center' }}
                                      >
                                        QTY in MTS
                                      </CTableHeaderCell>

                                      <CTableHeaderCell
                                        scope="col"
                                        style={{ color: 'white', width: '5%', textAlign: 'center' }}
                                      >
                                        Rate Per TON
                                      </CTableHeaderCell>

                                      <CTableHeaderCell
                                        scope="col"
                                        style={{ color: 'white', width: '5%', textAlign: 'center' }}
                                      >
                                        Amount
                                      </CTableHeaderCell>
                                    </CTableRow>
                                  </CTableHead>
                                  <CTableBody>
                                    {idt.map((data, index) => {
                                      //console.log(data, 'rowData-data')

                                      return (
                                        <>
                                          <CTableRow style={{ width: '100%' }}>
                                            <CTableHeaderCell
                                              scope="col"
                                              style={{ width: '5%', textAlign: 'center' }}
                                            >
                                              {index + 1}
                                            </CTableHeaderCell>

                                            <CTableHeaderCell
                                              scope="col"
                                              style={{ width: '9%', textAlign: 'center' }}
                                            >
                                              {data.inco_term}
                                            </CTableHeaderCell>

                                            <CTableHeaderCell
                                              scope="col"
                                              style={{ width: '5%', textAlign: 'center' }}
                                            >
                                              {Number(parseFloat(data.qty).toFixed(2))}
                                            </CTableHeaderCell>

                                            <CTableHeaderCell
                                              scope="col"
                                              style={{ width: '5%', textAlign: 'center' }}
                                            >
                                              {JavascriptInArrayComponent(data.inco_term_id, [381, 382])
                                                ? 0
                                                : tripInfo.tripsheet_info.freight_rate_per_tone}
                                            </CTableHeaderCell>

                                            <CTableHeaderCell
                                              scope="col"
                                              style={{
                                                width: '5%',
                                                color: `${
                                                  JavascriptInArrayComponent(
                                                    data.inco_term_id,
                                                    [381, 382]
                                                  )
                                                    ? 'white'
                                                    : ''
                                                }`,
                                                textAlign: 'center',
                                                background: `${
                                                  JavascriptInArrayComponent(
                                                    data.inco_term_id,
                                                    [381, 382]
                                                  )
                                                    ? 'red'
                                                    : ''
                                                }`,
                                              }}
                                            >
                                              {/* {data.amount} */}
                                              {Math.round(
                                                Number(
                                                  parseFloat(
                                                    Number(
                                                      tripInfo.tripsheet_info.freight_rate_per_tone
                                                    ) * Number(data.qty)
                                                  ).toFixed(2)
                                                )
                                              )}
                                            </CTableHeaderCell>
                                          </CTableRow>
                                        </>
                                      )
                                    })}
                                    <CTableRow style={{ width: '100%', background: 'cyan' }}>
                                      <CTableHeaderCell
                                        scope="col"
                                        style={{ width: '5%', textAlign: 'center' }}
                                      >
                                        -
                                      </CTableHeaderCell>

                                      <CTableHeaderCell
                                        scope="col"
                                        style={{ width: '9%', textAlign: 'center', color: 'indigo' }}
                                      >
                                        BILLED TONNAGE TOTAL
                                      </CTableHeaderCell>

                                      <CTableHeaderCell
                                        scope="col"
                                        style={{ width: '5%', textAlign: 'center' }}
                                      >
                                        {totalvaluefinder(1, tripInfo.shipment_info[0])}
                                      </CTableHeaderCell>

                                      <CTableHeaderCell
                                        scope="col"
                                        style={{ width: '5%', textAlign: 'center', color: 'green' }}
                                      >
                                        Total
                                      </CTableHeaderCell>

                                      <CTableHeaderCell
                                        scope="col"
                                        style={{ width: '5%', textAlign: 'center' }}
                                      >
                                        {totalvaluefinder(2, tripInfo.shipment_info[0])}
                                      </CTableHeaderCell>
                                    </CTableRow>
                                  </CTableBody>
                                </CTable>
                              </CRow>
                            </>
                          )}

                        <CTable caption="top" hover>
                          <CTableHead style={{ backgroundColor: '#4d3227', color: 'white' }}>
                            <CTableRow>
                              {tripInfo?.vehicle_info?.vehicle_type_id == 21 && (
                                <>
                                  <CTableHeaderCell scope="col" style={{ color: 'white' }}>
                                    Diesel
                                  </CTableHeaderCell>
                                  <CTableHeaderCell scope="col" style={{ color: 'white' }}>
                                    Advance
                                  </CTableHeaderCell>
                                </>
                              )}
                              {tripInfo?.vehicle_info?.vehicle_type_id == 22 && (
                                <>
                                  <CTableHeaderCell scope="col" style={{ color: 'white' }}>
                                    Freight Amount
                                  </CTableHeaderCell>
                                  {tripInfo?.tripsheet_info?.freight_approval_status == 2 && (
                                    <CTableHeaderCell scope="col" style={{ color: 'white' }}>
                                      Approved Freight Amount
                                    </CTableHeaderCell>
                                  )}
                                  <CTableHeaderCell scope="col" style={{ color: 'white' }}>
                                    Billed Qty in MTS
                                  </CTableHeaderCell>
                                  <CTableHeaderCell scope="col" style={{ color: 'white' }}>
                                    Total Freight Amount
                                  </CTableHeaderCell>

                                  <CTableHeaderCell scope="col" style={{ color: 'white' }}>
                                    Advance
                                  </CTableHeaderCell>
                                  <CTableHeaderCell scope="col" style={{ color: 'white' }}>
                                    Balance
                                  </CTableHeaderCell>
                                </>
                              )}
                            </CTableRow>
                          </CTableHead>

                          <CTableBody>
                            <CTableRow>
                              {/* Freight : Load Tonnage in MTS Part Start */}
                              {tripInfo && tripInfo.vehicle_info && tripInfo.vehicle_info.vehicle_type_id === 22 && (
                                <>
                                  <CTableDataCell>
                                    <CFormInput
                                      size="sm"
                                      id="freight_rate"
                                      maxLength={5}
                                      name="freight_rate"
                                      value={
                                        tripInfo.tripsheet_info.trip_freight_rate
                                          ? tripInfo.tripsheet_info.trip_freight_rate
                                          : '0'
                                      }
                                      readOnly
                                    />
                                  </CTableDataCell>
                                  {tripInfo?.tripsheet_info?.freight_approval_status == 2 && (
                                    <CTableDataCell>
                                      <CFormInput
                                        size="sm"
                                        id="freight_rate"
                                        maxLength={5}
                                        name="freight_rate"
                                        value={
                                          tripInfo.tripsheet_info.trip_updated_freight_rate
                                          ? tripInfo.tripsheet_info.trip_updated_freight_rate
                                          : '0'
                                        }
                                        readOnly
                                      />
                                    </CTableDataCell>
                                  )}
                                    <CTableDataCell>
                                      <CFormInput
                                        size="sm"
                                        id="billed_qty"
                                        maxLength={5}
                                        name="billed_qty"
                                        value={
                                          tripInfo.vehicle_assignment[0]?.billed_qty
                                            ? tripInfo.vehicle_assignment[0].billed_qty
                                            : '0'
                                        }
                                        readOnly
                                      />
                                    </CTableDataCell>
                                    
                                    <CTableDataCell>
                                      <CFormInput
                                        size="sm"
                                        id="total_freight_amt"
                                        maxLength={5}
                                        name="total_freight_amt"
                                        value={totalFreightAmountFinder(tripInfo)}                  
                                        readOnly
                                      />
                                    </CTableDataCell>

                                  <CTableDataCell key={`freight_total_advance_amount_data`}>
                                    <CFormInput
                                      size="sm"
                                      id={`freight_total_advance_amount`}
                                      maxLength={5}
                                      name={`freight_total_advance_amount`}
                                      value={tripInfo.advance_payment_info ? tripInfo.advance_payment_info?.advance_payment : '0'}
                                      readOnly
                                    />
                                  </CTableDataCell>

                                  {/* Freight : Total Advance Part End */}
                                  {/* Freight : Balance Part Start */}

                                  <CTableDataCell key={`freight_balance_amount_data`}>
                                    <CFormInput
                                      size="sm"
                                      id={`freight_balance_amount`}
                                      maxLength={5}
                                      name={`freight_balance_amount`}                                  
                                      value={tripInfo.advance_payment_info ? freight_balance_amount_calculator(tripInfo.advance_payment_info.actual_freight, tripInfo.advance_payment_info?.advance_payment) : totalFreightAmountFinder(tripInfo)}                                   
                                      readOnly
                                    />
                                  </CTableDataCell>
                                </>
                              )}
                               
                              {/* Freight : Advance in Bank Part End */}
                              {/* Freight : Total Advance Part Start */}

                              {/* Freight : Balance Part End */}
                            </CTableRow>
                          </CTableBody>
                        </CTable>
                      </CTabPane>
                      {/* ======= Hire Vehicle Freight Tab End ================================= */}

                      {/* ================ Hire Diesel Indent Info Tab Start ====================== */}
                      <CTabPane role="tabpanel" aria-labelledby="contact-tab" visible={activeKey === 5}>
                        <CRow className="mt-2" hidden>
                          <CCol xs={12} md={2}>
                            <CFormLabel htmlFor="dVendor">Local Reg. Vendor</CFormLabel>

                            <CFormInput size="sm" id="dVendor" value={dieselVendorName} readOnly />
                          </CCol>
                          <CCol xs={12} md={2}>
                            <CFormLabel htmlFor="dLtr">Diesel Liter</CFormLabel>

                            <CFormInput
                              size="sm"
                              id="dLtr"
                              value={
                                tripInfo.diesel_intent_info
                                  ? tripInfo.diesel_intent_info.no_of_ltrs
                                  : ''
                              }
                              readOnly
                            />
                          </CCol>
                          <CCol xs={12} md={2}>
                            <CFormLabel htmlFor="rateLtr">Rate Per Liter</CFormLabel>

                            <CFormInput
                              size="sm"
                              type=""
                              id="rateLtr"
                              value={
                                tripInfo.diesel_intent_info
                                  ? tripInfo.diesel_intent_info.rate_of_ltrs
                                  : ''
                              }
                              readOnly
                            />
                          </CCol>
                          <CCol xs={12} md={2}>
                            <CFormLabel htmlFor="dAmount">Total Amount</CFormLabel>

                            <CFormInput
                              size="sm"
                              id="dAmount"
                              type=""
                              value={
                                tripInfo.diesel_intent_info
                                  ? tripInfo.diesel_intent_info.total_amount
                                  : ''
                              }
                              readOnly
                            />
                          </CCol>
                          <CCol xs={12} md={2}>
                            <CFormLabel htmlFor="invoiceDate">Invoice Date & Time</CFormLabel>

                            <CFormInput
                              size="sm"
                              id="invoiceDate"
                              // type="datetime-local"
                              value={
                                tripInfo.diesel_intent_info
                                  ? tripInfo.diesel_intent_info.invoice_date_time_string
                                  : ''
                              }
                              readOnly
                            />
                          </CCol>
                          {!adhardel && (
                            <CCol xs={12} md={2}>
                              <CFormLabel htmlFor="invoiceCopy">Invoice Copy</CFormLabel>
                              {dieselInvoiceVisible ? (
                                <CFormInput
                                  type="file"
                                  name="dInvoice"
                                  size="sm"
                                  id="dInvoice"
                                  accept=".jpg,.jpeg,.png,.pdf"
                                />
                              ) : (
                                <CButton className="w-100 m-0" color="info" size="sm" id="dInvoice">
                                  <span
                                    className="float-start"
                                    onClick={() => setDieselInvoiceAttachmentVisible(true)}
                                  >
                                    <i className="fa fa-eye" aria-hidden="true"></i> &nbsp;View
                                  </span>
                                </CButton>
                              )}
                            </CCol>
                          )}
                        </CRow>
                      </CTabPane>
                      {/* Hire Diesel Indent Info Tab End============================ */}
                      <CTabPane role="tabpanel" aria-labelledby="contact-tab" visible={activeKey === 6}>
                        <CRow className="mt-2" hidden>
                          <CCol md={2}>
                            <CFormLabel htmlFor="sNum">
                              Shipment Number{' '}
                              {errors.sNum && <span className="small text-danger">{errors.sNum}</span>}
                            </CFormLabel>
                            <CFormSelect
                              size="sm"
                              name="sNum"
                              id="sNum"
                              onFocus={onFocus}
                              onBlur={onBlur}
                              onChange={handleChange}
                              value={values.sNum}
                              className={`${errors.sNum && 'is-invalid'}`}
                              aria-label="Small select example"
                            >
                              <option value="">Select...</option>
                              <option value="1">11111</option>
                              <option value="2">22222</option>
                              <option value="3">33333</option>
                            </CFormSelect>
                          </CCol>
                          <CCol xs={12} md={2}>
                            <CFormLabel htmlFor="deliveryNum">
                              Delivery Number{' '}
                              {errors.deliveryNum && (
                                <span className="small text-danger">{errors.deliveryNum}</span>
                              )}
                            </CFormLabel>
                            <CFormSelect
                              size="sm"
                              name="deliveryNum"
                              onFocus={onFocus}
                              onBlur={onBlur}
                              onChange={handleChange}
                              value={values.deliveryNum}
                              className={`${errors.deliveryNum && 'is-invalid'}`}
                              aria-label="Small select example"
                            >
                              <option value="">Select...</option>
                              <option value="1">11111</option>
                              <option value="2">22222</option>
                              <option value="3">33333</option>
                            </CFormSelect>
                          </CCol>

                          <CCol xs={12} md={2}>
                            <CFormLabel htmlFor="returnTo">
                              Return To{' '}
                              {errors.returnTo && (
                                <span className="small text-danger">{errors.returnTo}</span>
                              )}
                            </CFormLabel>
                            <CFormSelect
                              size="sm"
                              name="returnTo"
                              id="returnTo"
                              onFocus={onFocus}
                              onBlur={onBlur}
                              onChange={handleChange}
                              value={values.returnTo}
                              className={`${errors.returnTo && 'is-invalid'}`}
                              aria-label="Small select example"
                            >
                              <option value="">Select...</option>
                              <option value="1">NLFD</option>
                              <option value="2">NLFA</option>
                              <option value="3">NLCD</option>
                              <option value="4">NLMD</option>
                              <option value="5">NLDV</option>
                            </CFormSelect>
                          </CCol>
                          <CCol xs={12} md={2}>
                            <CFormLabel htmlFor="returnQty">Retun QTY in Tons</CFormLabel>

                            <CFormInput size="sm" type="" id="returnQty" readOnly />
                          </CCol>
                          <CCol xs={12} md={2}>
                            <CFormLabel htmlFor="returnRate">Return Rate Per Ton</CFormLabel>

                            <CFormInput size="sm" id="returnRate" type="" readOnly />
                          </CCol>
                          <CCol xs={12} md={2}>
                            <CFormLabel htmlFor="returnFreight">Return Freight Amount</CFormLabel>

                            <CFormInput size="sm" id="returnFreight" type="" />
                          </CCol>
                          <CCol xs={12} md={2}>
                            <CFormLabel htmlFor="dPod">Diverted POD</CFormLabel>
                            <CFormInput type="file" name="dPod" size="sm" id="dPod" />

                            {/* <CFormInput size="sm" id="inputAddress" value=" " readOnly /> */}
                          </CCol>
                        </CRow>
                      </CTabPane>

                      {/* Hire Vehicle Expenses Capture Start */}
                      {vehicleTypeId === 22 && (
                        <CTabPane
                          role="tabpanel"
                          aria-labelledby="contact-tab"
                          visible={activeKey === 3}
                        >
                          <CTable caption="top" hover style={{ height: '35vh' }}>
                            <CTableCaption style={{ color: 'maroon' }}>Trip Over All Expenses</CTableCaption>

                            {/* ================== Expense Table Header Part Start ====================== */}
                            <CTableHead
                              style={{
                                backgroundColor: '#4d3227',
                                color: 'white',
                              }}
                            >
                              <CTableRow>
                      
                                <CTableHeaderCell scope="col" style={{ color: 'white' }}>
                                  Type
                                </CTableHeaderCell>

                                <CTableHeaderCell scope="col" style={{ color: 'white' }}>
                                  Expense
                                </CTableHeaderCell> 
                              </CTableRow>
                            </CTableHead>
                            {/* ================== Expense Table Header Part End ======================= */}
                            {/* ================== Expense Table Body Part Start ======================= */}
                            {/* ================== Expense Table Body Part Start ======================= */}
                              <CTableBody>
                                {/* ================== Freight Charges Part Start ======================= */}
          
                                {tripsettlementData.freight_charges &&
                                  tripsettlementData.freight_charges != '0' && (
                                    <CTableRow>
                                      <CTableDataCell>Freight Charges</CTableDataCell>
                                      <CTableDataCell>
                                        <CFormInput
                                          size="sm"
                                          value={tripsettlementData.freight_charges}
                                          readOnly
                                        />
                                      </CTableDataCell>
                                    </CTableRow>
                                  )}
          
                                {/* ================== Freight Charges Part End ======================= */}
                                {/* ================== Low Tonnage Charges Part Start ======================= */}
          
                                  {tripsettlementData.low_tonage_charges &&
                                  tripsettlementData.low_tonage_charges != '0' && (
                                    <CTableRow>
                                      <CTableDataCell>Low Tonnage Charges</CTableDataCell>
                                      <CTableDataCell>
                                        <CFormInput
                                          size="sm"
                                          value={tripsettlementData.low_tonage_charges}
                                          readOnly
                                        />
                                      </CTableDataCell>
                                    </CTableRow>
                                  )}
          
                                {/* ================== Low Tonnage Charges Part End ======================= */}
                                {/* ================== Unloading Charges Part Start ======================= */}
          
                                {tripsettlementData.unloading_charges &&
                                  tripsettlementData.unloading_charges != '0' && (
                                    <CTableRow>
                                      <CTableDataCell>Unloading Charges</CTableDataCell>
                                      <CTableDataCell>
                                        <CFormInput
                                          size="sm"
                                          value={tripsettlementData.unloading_charges}
                                          readOnly
                                        />
                                      </CTableDataCell>
                                    </CTableRow>
                                  )}
          
                                {/* ================== Unloading Charges Part End ======================= */}
                                {/* ================== Weighment Charges Part Start ======================= */}
          
                                {tripsettlementData.weighment_charges &&
                                  tripsettlementData.weighment_charges != '0' && (
                                    <CTableRow>
                                      <CTableDataCell>Weighment Charges</CTableDataCell>
                                      <CTableDataCell>
                                        <CFormInput
                                          size="sm"
                                          value={tripsettlementData.weighment_charges}
                                          readOnly
                                        />
                                      </CTableDataCell>
                                    </CTableRow>
                                  )}
                                {/* ================== Weighment Charges Part End ======================= */}
                                {/* ================== Halting Charges Part Start ======================= */}
          
                                {tripsettlementData.halting_charges &&
                                  tripsettlementData.halting_charges != '0' && (
                                    <CTableRow>
                                      <CTableDataCell>Halting Charges</CTableDataCell>
                                      <CTableDataCell>
                                        <CFormInput
                                          size="sm"
                                          value={tripsettlementData.halting_charges}
                                          readOnly
                                        />
                                      </CTableDataCell>
                                    </CTableRow>
                                  )}
          
                                {/* ================== Halting Charges Part End ======================= */}
          
                                {/* ================== Subdelivery Charges Part Start =================== */}
          
                                {tripsettlementData.sub_delivery_charges &&
                                  tripsettlementData.sub_delivery_charges != '0' && (
                                    <CTableRow>
                                      <CTableDataCell>Subdelivery Charges</CTableDataCell>
                                      <CTableDataCell>
                                        <CFormInput
                                          size="sm"
                                          value={tripsettlementData.sub_delivery_charges}
                                          readOnly
                                        />
                                      </CTableDataCell>
                                    </CTableRow>
                                  )}
                                {/* ================== Subdelivery Charges Part End ======================= */}
          
                                {/* ================== Expense Toll Amount Start ======================= */}
          
                                {tripsettlementData.toll_amount && tripsettlementData.toll_amount != '0' && (
                                  <CTableRow>
                                    <CTableDataCell>Toll Amount</CTableDataCell>
                                    <CTableDataCell>
                                      <CFormInput size="sm" value={tripsettlementData.toll_amount} readOnly />
                                    </CTableDataCell>
                                  </CTableRow>
                                )}
                                {/* ================== Expense Toll Amount Part End ======================= */}
          
                                {/* ================== Stock Diversion / Return Charges Part Start ========= */}  
          
                                {tripsettlementData.diversion_return_charges &&
                                  tripsettlementData.diversion_return_charges != '0' && (
                                    <CTableRow>
                                      <CTableDataCell>Deduction Amount</CTableDataCell>
                                      <CTableDataCell>
                                        <CFormInput
                                          size="sm"
                                          value={tripsettlementData.diversion_return_charges}
                                          readOnly
                                        />
                                      </CTableDataCell>
                                    </CTableRow>
                                  )}
                                {/* ================== Stock Diversion / Return Charges Part End ==========
                                
                                
                                {/* ================== Total Charges Part Start ============ */}
          
                                <CTableRow>
                                  <CTableDataCell>Total Expense</CTableDataCell>
                                  <CTableDataCell>
                                    <CFormInput size="sm" value={tripsettlementData.expense} readOnly />
                                  </CTableDataCell>
                                </CTableRow>
                                {/* ================== Total Charges Part End ========== */}
                              </CTableBody>                                           
                            {/* ================== Expense Table Body Part Start ======================= */}
                          </CTable>
                          {/* ================== Expense Table Body Part Start ======================= */}

                          <CTable caption="top" hover style={{ height: '45vh' }}>
                            <CTableCaption style={{ color: 'maroon' }}>Others</CTableCaption>

                            {/* ================== Others Table Header Part Start ====================== */}
                            <CTableHead
                              style={{
                                backgroundColor: '#4d3227',
                                color: 'white',
                              }}
                            >
                              <CTableRow>
                                <CTableHeaderCell scope="col" style={{ color: 'white' }}>
                                  S.No
                                </CTableHeaderCell>

                                <CTableHeaderCell scope="col" style={{ color: 'white' }}>
                                  Type
                                </CTableHeaderCell>

                                {/* <CTableHeaderCell></CTableHeaderCell> */}

                                <CTableHeaderCell scope="col" style={{ color: 'white' }}>
                                  Total
                                </CTableHeaderCell>
                              </CTableRow>
                            </CTableHead>
                            {/* ================== Others Table Header Part End ======================= */}
                            {/* ================== Others Table Body Part Start ======================= */}
                            <CTableBody>
                              {/* ================== Others Halt Days Part Start ======================= */}
                              <CTableRow>
                                <CTableDataCell scope="row">
                                  <b>1</b>
                                </CTableDataCell>
                                <CTableDataCell>Halt Days</CTableDataCell>
                                <CTableDataCell>
                                  <CFormInput
                                    className={`${errors.halt_days && 'is-invalid'}`}
                                    id="halt_days"
                                    name="halt_days"
                                    type="text"
                                    maxLength={2} 
                                    required={errors.halt_days ? true : false}
                                    size="sm"
                                    value={haltDays}
                                    readOnly
                                  />
                                  {errors.halt_days && (
                                    <span className="small text-danger">{errors.halt_days}</span>
                                  )}
                                </CTableDataCell>
                              </CTableRow>

                              {/* ================== Others Halt Days Part End ======================= */}

                              {/* ================== Tds Having Part Start ======================= */}
                                                           
                                <>
                                  <CTableRow>
                                    <CTableDataCell scope="row">
                                      <b>2</b>
                                    </CTableDataCell>
                                    <CTableDataCell>Tds Having</CTableDataCell>
                                    <CTableDataCell>
                                      <CFormInput
                                        size="sm"
                                        value={values.TdsHaving == 1 ? 'Yes' : 'No'}
                                        readOnly
                                      />
                                    </CTableDataCell>
                                  </CTableRow>
                                  
                                  <CTableRow>
                                    <CTableDataCell scope="row">
                                      <b>2 A</b>
                                    </CTableDataCell>
                                    <CTableDataCell>Tds Tax Type</CTableDataCell>
                                    <CTableDataCell>
                                      <CFormInput
                                        size="sm"
                                        value={`${values.TdsHaving == 1 ? tdsTaxCodeName(values.TdsTax) : '-'}`}
                                        // value={tdsType}
                                        readOnly
                                      />
                                    </CTableDataCell>
                                  </CTableRow>
                                    
                                </>
                              
                              {/* ================== Tds Having Part End ======================= */}

                              {/* ================== SAP Text Part Start ======================= */}
                              <CTableRow>
                                <CTableDataCell scope="row">
                                  <b>3</b>
                                </CTableDataCell>
                                <CTableDataCell>SAP Text</CTableDataCell>
                                <CTableDataCell>
                                  <CFormInput
                                    id="sap_text"
                                    name="sap_text"
                                    // maxLength={20}
                                    onFocus={onFocus}
                                    onBlur={onBlur}
                                    onChange={handleChange}
                                    size="sm"
                                    value={values.sap_text}
                                    readOnly
                                  />
                                </CTableDataCell>
                              </CTableRow>

                              {/* ================== SAP Text Part End ======================= */}
                              {/* ================== GST Tax Type Part Start ======================= */}
                              {tripInfo &&
                              tripInfo.advance_payment_info &&
                              tripInfo.advance_payment_info.gst_tax_type ? (
                                <CTableRow>
                                  <CTableDataCell scope="row">
                                    <b>4</b>
                                  </CTableDataCell>
                                  <CTableDataCell>GST Tax Type</CTableDataCell>
                                  <CTableDataCell>
                                    <CFormInput
                                      size="sm"
                                      //value={getGSTTaxTypeName(gstTax)}
                                      value={values.GSTtax}
                                      readOnly
                                    />
                                  </CTableDataCell>
                                </CTableRow>
                              ) : (
                                <CTableRow>
                                  <CTableDataCell scope="row">
                                    <b>4</b>
                                  </CTableDataCell>
                                  <CTableDataCell>GST Tax Type</CTableDataCell>
                                  <CTableDataCell>
                                    <CFormInput
                                      size="sm"
                                      id="GSTtax"
                                      name="GSTtax"
                                      //value={getGSTTaxTypeName(gstTax)}
                                      value={getGSTTaxTypeName(values.GSTtax)}
                                      onFocus={onFocus}
                                      onBlur={onBlur}
                                      onChange={handleChange}
                                      className={`${errors.GSTtax && 'is-invalid'}`}
                                      aria-label="Small select example"
                                      readOnly
                                    ></CFormInput>
                                    {errors.GSTtax && (
                                      <span className="small text-danger">{errors.GSTtax}</span>
                                    )}
                                  </CTableDataCell>
                                </CTableRow>
                              )}
                              {/* ================== GST Tax Type Part End ======================= */}
                              {/* ================== HSN TYpe Part Start ======================= */}
                              {tripInfo && tripInfo.advance_info && tripInfo.advance_info.vendor_hsn ? (
                                <>
                                  <CTableRow>
                                    <CTableDataCell scope="row">
                                      <b>5</b>
                                    </CTableDataCell>
                                    <CTableDataCell>HSN Code</CTableDataCell>
                                    <CTableDataCell>
                                      <CFormInput
                                        size="sm" 
                                        value={getHSNTypeDesc(values.HSNtax)}
                                        readOnly
                                      />
                                    </CTableDataCell>
                                  </CTableRow>
                                </>
                              ) : (
                                <>
                                  <CTableRow>
                                    <CTableDataCell scope="row">
                                      <b>5</b>
                                    </CTableDataCell>
                                    <CTableDataCell>HSN Type</CTableDataCell>
                                    <CTableDataCell>
                                      <CFormInput
                                        size="sm"
                                        id="HSNtax"
                                        name="HSNtax" 
                                        value={values.HSNtax}
                                        readOnly 
                                        aria-label="Small select example"
                                      ></CFormInput>
                                    </CTableDataCell>
                                  </CTableRow>
                                </>
                              )}
                              {/* ================== HSN Type Part End ======================= */}
                            </CTableBody>
                            {/* ================== Expense Table Body Part End ======================= */}
                          </CTable>

                          <CRow className="mt-2">
                            {!tripInfo.advance_payment_info && (
                              <>
                                <CCol xs={12} md={3}>
                                  <CFormLabel htmlFor="supplier_ref_no">Vendor Bill No/Reference
                                    
                                  </CFormLabel>
                                  <CFormInput
                                    size="sm"
                                    id="supplier_ref_no"
                                    name="supplier_ref_no"
                                    value={tripsettlementData.supplier_ref_no}
                                    type="text"
                                    maxLength="50"
                                    readOnly 
                                  />
                                </CCol>
                                <CCol xs={12} md={3}>
                                  <CFormLabel htmlFor="supplier_posting_date">Vendor Bill/Reference Date                         
                                  </CFormLabel>
                                  <CFormInput
                                    size="sm"
                                    id="supplier_posting_date"
                                    name="supplier_posting_date"
                                    value={tripsettlementData.supplier_posting_date} 
                                    readOnly
                                    type="date" 
                                  />
                                </CCol>
                              </>
                            )}
                            {tripsettlementData.diversion_return_charges && tripsettlementData.diversion_return_charges != '0' && tripsettlementData.cost_center && tripsettlementData.cost_center != '0' && (
                              <>
                                <CCol xs={12} md={3}>
                                  <CFormLabel htmlFor="remarks">Deduction Amount</CFormLabel>
                                  <CFormInput
                                    size="sm"
                                    id="deductionAmount"
                                    name="deductionAmount" 
                                    value={tripsettlementData.diversion_return_charges}
                                    readOnly 
                                    aria-label="Small select example"
                                  ></CFormInput>
                                </CCol>
                                <CCol xs={12} md={3}>
                                  <CFormLabel htmlFor="remarks">Deduction Cost Center</CFormLabel>
                                  <CFormInput
                                    size="sm"
                                    id="deductionCostCenter"
                                    name="deductionCostCenter" 
                                    value={getCostCenterName(tripsettlementData.cost_center)}
                                    readOnly 
                                    aria-label="Small select example"
                                  ></CFormInput>
                                </CCol>
                                <CCol xs={12} md={3}>
                                  <CFormLabel htmlFor="remarks">Deduction Remarks<REQ /></CFormLabel>
                                  <CFormInput
                                    size="sm"
                                    name="ded_remarks"
                                    value={values.ded_remarks}
                                    onChange={handleChange}
                                  />
                                </CCol>
                                <CCol xs={12} md={3}>
                                  <CFormLabel htmlFor="remarks">Deduction Ref. No<REQ /></CFormLabel>
                                  <CFormInput
                                    size="sm"
                                    name="ded_ref"
                                    value={values.ded_ref}
                                    onChange={handleChange}
                                  />
                                </CCol>
                                <CCol xs={12} md={3}>
                                  <CFormLabel htmlFor="remarks">Deduction Posting Date <REQ /></CFormLabel>
                                  {/* <CFormInput
                                    size="sm"
                                    id="dedPostingDate"
                                    name="dedPostingDate" 
                                    value={tripsettlementData.ded_posting_date}
                                    readOnly 
                                    aria-label="Small select example"
                                  ></CFormInput> */}

                                  

                                      <CFormInput
                                        size="sm"
                                        type="date"
                                        id="ded_posting_date"
                                        name="ded_posting_date"
                                        onChange={handleChangepostingDate}
                                        min={Expense_Income_Posting_Date.min_date}
                                        max={Expense_Income_Posting_Date.max_date}
                                        onKeyDown={(e) => {
                                          e.preventDefault()
                                        }}
                                        value={ded_posting_date}
                                      />
                                </CCol>
                                {/* <CTableDataCell style={{ width: '180px' }}>
                                    
                                    </CTableDataCell> */}
                              </>

                            )}


                            <CCol xs={12} md={3}>
                              <CFormLabel htmlFor="remarks">Expense Remarks</CFormLabel>
                              <CFormTextarea
                                name="remarks"
                                id="remarks"
                                rows="1" 
                                value={values.remarks}
                                readOnly
                              ></CFormTextarea>
                            </CCol>
                            <CCol xs={12} md={3}>
                              <CFormLabel htmlFor="remarks">Deduction Approval Remarks</CFormLabel>
                              <CFormTextarea
                                name="approval_remarks"
                                id="approval_remarks"
                                rows="1"
                                onFocus={onFocus}
                                onBlur={onBlur}
                                onChange={handleChange}
                                value={values.approval_remarks}
                              ></CFormTextarea>
                            </CCol>
                          </CRow>
                          <CRow>
                            <CCol
                              className="offset-md-9"
                              xs={12}
                              sm={12}
                              md={3}
                              // style={{ display: 'flex', justifyContent: 'space-between' }}
                              style={{
                                display: 'flex',
                                flexDirection: 'row-reverse',
                                cursor: 'pointer',
                              }}
                            >
                              <CButton
                                size="sm"
                                color="warning"
                                disabled={enableSubmit}
                                className="mx-3 text-white"
                                // className="align-self-end ml-auto"
                                onClick={() => {
                                  setFetch(false)
                                  TripsheetClosureSubmit('Approve')
                                }}
                                type="submit"
                              >
                                Approval
                              </CButton>
                              <CButton
                                size="sm"
                                color="danger"
                                disabled={enableSubmit}
                                className="mx-3 text-white"
                                // className="align-self-end ml-auto"
                                onClick={() => {
                                  setFetch(false)
                                  TripsheetClosureSubmit('reject')
                                }}
                                type="submit"
                              >
                                Reject
                              </CButton>
                            </CCol>
                          </CRow>
                        </CTabPane>
                      )}
                      {/* Hire Vehicle Expenses Capture End */}
                    </CTabContent>
                  </CTabPane>

                  
                </CTabContent>
                {/* Opening Odometer Photo View  */}
                <CModal visible={oopVisible} onClose={() => setOopVisible(false)}>
                  <CModalHeader>
                    <CModalTitle>Opeing Odometer Photo</CModalTitle>
                  </CModalHeader>
                  <CModalBody>
                    {tripInfo.odometer_photo && !tripInfo.odometer_photo.includes('.pdf') ? (
                      <CCardImage orientation="top" src={tripInfo.odometer_photo} />
                    ) : (
                      <iframe
                        orientation="top"
                        height={500}
                        width={475}
                        src={tripInfo.odometer_photo}
                      ></iframe>
                    )}
                  </CModalBody>

                  <CModalFooter>
                    <CButton color="secondary" onClick={() => setOopVisible(false)}>
                      Close
                    </CButton>
                  </CModalFooter>
                </CModal>
                {/* CLosing Odometer Photo View  */}
                <CModal visible={copVisible} onClose={() => setCopVisible(false)}>
                  <CModalHeader>
                    <CModalTitle>Opeing Odometer Photo</CModalTitle>
                  </CModalHeader>
                  <CModalBody>
                    {tripInfo.odometer_closing_photo &&
                    !tripInfo.odometer_closing_photo.includes('.pdf') ? (
                      <CCardImage orientation="top" src={tripInfo.odometer_closing_photo} />
                    ) : (
                      <iframe
                        orientation="top"
                        height={500}
                        width={475}
                        src={tripInfo.odometer_closing_photo}
                      ></iframe>
                    )}
                  </CModalBody>

                  <CModalFooter>
                    <CButton color="secondary" onClick={() => setCopVisible(false)}>
                      Close
                    </CButton>
                  </CModalFooter>
                </CModal>
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
                {/* FGSTO POD Copy Photo View Start */}
                <CModal visible={stoPodVisible} onClose={() => setStoPodVisible(false)}>
                  <CModalHeader>
                    <CModalTitle>Opeing Odometer Photo</CModalTitle>
                  </CModalHeader>
                  <CModalBody>
                    {stoTableData[stoEditIndex] &&
                    stoValues.sto_pod_copy &&
                    !stoValues.sto_pod_copy.includes('.pdf') ? (
                      <CCardImage orientation="top" src={stoTableData[stoEditIndex].sto_pod_copy} />
                    ) : (
                      <iframe
                        orientation="top"
                        height={500}
                        width={475}
                        src={
                          stoTableData[stoEditIndex]
                            ? stoTableData[stoEditIndex].sto_pod_copy
                            : filePath
                        }
                      ></iframe>
                    )}
                  </CModalBody>

                  <CModalFooter>
                    <CButton color="secondary" onClick={() => setStoPodVisible(false)}>
                      Close
                    </CButton>
                  </CModalFooter>
                </CModal>
                {/* FGSTO POD Copy Photo View End */}
                {/* Diesel Invoice Photo 1 View Start */}
                <CModal
                  visible={dieselInvoiceAttachmentVisible1}
                  onClose={() => {
                    setDieselInvoiceAttachmentVisible1(false)
                    setDieselInvoiceAttachmentVisible1Index('')
                  }}
                >
                  <CModalHeader>
                    <CModalTitle>Diesel Invoice Copy -</CModalTitle>
                  </CModalHeader>
                  <CModalBody>
                    {tripInfo.tripsheet_info && tripInfo.tripsheet_info.trip_vehicle_info &&
                      tripInfo.tripsheet_info.trip_vehicle_info.vehicle_type_id &&
                      tripInfo.tripsheet_info.trip_vehicle_info.vehicle_type_id === 23 && (
                        <>
                          {dieselCollectionInfo &&
                          dieselCollectionInfo.length > 0 &&
                          dieselInvoiceAttachmentVisible1Index != '' &&
                          !dieselCollectionInfo[
                            Number(dieselInvoiceAttachmentVisible1Index)
                          ].invoice_copy.includes('.pdf') ? (
                            <CCardImage
                              orientation="top"
                              src={
                                dieselCollectionInfo[Number(dieselInvoiceAttachmentVisible1Index)]
                                  .invoice_copy
                              }
                            />
                          ) : (
                            <iframe
                              orientation="top"
                              height={500}
                              width={475}
                              src={
                                dieselCollectionInfo &&
                                dieselCollectionInfo.length > 0 &&
                                dieselInvoiceAttachmentVisible1Index != ''
                                  ? dieselCollectionInfo[Number(dieselInvoiceAttachmentVisible1Index)]
                                      .invoice_copy
                                  : ''
                              }
                            ></iframe>
                          )}
                        </>
                      )}
                    {tripInfo.tripsheet_info && tripInfo.tripsheet_info.trip_vehicle_info &&
                      tripInfo.tripsheet_info.trip_vehicle_info.vehicle_type_id &&
                      tripInfo.tripsheet_info.trip_vehicle_info.vehicle_type_id !== 22 && (
                        <>
                          {dieselInvoiceAttachmentVisible1Index != '' &&
                          !dieselCollectionInfo[
                            Number(dieselInvoiceAttachmentVisible1Index)
                          ].invoice_copy.includes('.pdf') ? (
                            <CCardImage
                              orientation="top"
                              src={
                                dieselCollectionInfo[Number(dieselInvoiceAttachmentVisible1Index)]
                                  .invoice_copy
                              }
                            />
                          ) : (
                            <iframe
                              orientation="top"
                              height={500}
                              width={475}
                              src={
                                dieselInvoiceAttachmentVisible1Index != ''
                                  ? dieselCollectionInfo[Number(dieselInvoiceAttachmentVisible1Index)]
                                      .invoice_copy
                                  : ''
                              }
                            ></iframe>
                          )}
                        </>
                      )}
                  </CModalBody>

                  <CModalFooter>
                    <CButton
                      color="secondary"
                      onClick={() => {
                        setDieselInvoiceAttachmentVisible1(false)
                        setDieselInvoiceAttachmentVisible1Index('')
                      }}
                    >
                      Close
                    </CButton>
                  </CModalFooter>
                </CModal>
                {/* Diesel Invoice Photo 1 View End  */}
                {/* RMSTO POD Copy Photo View Start */}
                <CModal visible={stoPodVisibleRMSTO} onClose={() => setStoPodVisibleRMSTO(false)}>
                  <CModalHeader>
                    <CModalTitle>Opeing Odometer Photo</CModalTitle>
                  </CModalHeader>
                  <CModalBody>
                    {stoTableDataRMSTO[stoEditIndexRMSTO] &&
                    stoValuesRMSTO.sto_pod_copy_rmsto &&
                    !stoValuesRMSTO.sto_pod_copy_rmsto.includes('.pdf') ? (
                      <CCardImage
                        orientation="top"
                        src={stoTableDataRMSTO[stoEditIndexRMSTO].sto_pod_copy_rmsto}
                      />
                    ) : (
                      <iframe
                        orientation="top"
                        height={500}
                        width={475}
                        src={
                          stoTableDataRMSTO[stoEditIndexRMSTO]
                            ? stoTableDataRMSTO[stoEditIndexRMSTO].sto_pod_copy_rmsto
                            : filePathRMSTO
                        }
                      ></iframe>
                    )}
                  </CModalBody>

                  <CModalFooter>
                    <CButton color="secondary" onClick={() => setStoPodVisibleRMSTO(false)}>
                      Close
                    </CButton>
                  </CModalFooter>
                </CModal>
                {/* RMSTO POD Copy Photo View End */}
                {/* Diesel Invoice Photo View  */}
                {/* <CModal
                visible={dieselInvoiceAttachmentVisible}
                onClose={() => setDieselInvoiceAttachmentVisible(false)}
              >
                <CModalHeader>
                  <CModalTitle>Diesel Invoice Copy</CModalTitle>
                </CModalHeader>
                <CModalBody>
                  {tripInfo.diesel_intent_info &&
                  tripInfo.diesel_intent_info.invoice_copy &&
                  !tripInfo.diesel_intent_info.invoice_copy.includes('.pdf') ? (
                    <CCardImage
                      orientation="top"
                      src={tripInfo.diesel_intent_info ? tripInfo.diesel_intent_info.invoice_copy : ''}
                    />
                  ) : (
                    <iframe
                      orientation="top"
                      height={500}
                      width={475}
                      src={tripInfo.diesel_intent_info ? tripInfo.diesel_intent_info.invoice_copy : ''}
                    ></iframe>
                  )}
                </CModalBody>

                      <CModalFooter>
                        <CButton color="secondary" onClick={() => setDieselInvoiceAttachmentVisible(false)}>
                          Close
                        </CButton>
                      </CModalFooter>
                    </CModal> */}
                {/* ======================= FGSTO Confirm Delete Button Modal Area ========================== */}

                {/*Camera Image Copy model*/}
                <CModal
                  visible={camEnable}
                  backdrop="static"
                  onClose={() => {
                    setCamEnable(false)
                    setImgSrc('')
                    setFileImageKey('')
                    setCamEnableType('')
                  }}
                >
                  <CModalHeader>
                    <CModalTitle>POD Copy</CModalTitle>
                  </CModalHeader>
                  <CModalBody>
                    {!imgSrc && (
                      <>
                        <Webcam
                          audio={false}
                          ref={webcamRef}
                          screenshotFormat="image/png"
                          height={200}
                        />
                        <p className="mt-2">
                          <CButton
                            size="sm"
                            color="warning"
                            className="mx-1 px-2 text-white"
                            type="button"
                            onClick={() => {
                              capture()
                            }}
                          >
                            Accept
                          </CButton>
                        </p>
                      </>
                    )}
                    {imgSrc && (
                      <>
                        <img height={200} src={imgSrc} />
                        <p className="mt-2">
                          <CButton
                            size="sm"
                            color="warning"
                            className="mx-1 px-2 text-white"
                            type="button"
                            onClick={() => {
                              setImgSrc('')
                            }}
                          >
                            Delete
                          </CButton>
                        </p>
                      </>
                    )}
                  </CModalBody>
                  <CModalFooter>
                    {imgSrc && (
                      <CButton
                        className="m-2"
                        color="warning"
                        onClick={() => {
                          setCamEnable(false)
                          valueAppendToImage1(imgSrc)
                        }}
                      >
                        Confirm
                      </CButton>
                    )}
                    <CButton
                      color="secondary"
                      onClick={() => {
                        setCamEnable(false)
                        setImgSrc('')
                        setFileImageKey('')
                        setCamEnableType('')
                      }}
                    >
                      Cancel
                    </CButton>
                  </CModalFooter>
                </CModal>            
              
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

export default NlmtTSClosureApproval
